import '../Styles/styles.css';
import JumperList from './JumperList';
import LoadContainer from './LoadContainer';
import { Helmet } from 'react-helmet';
import HeaderNavBar from './HeaderNavBar';
import FooterNavBar from './FooterNavBar';
import { useEffect, useState } from 'react';
import ILoadObject from './ILoadObject';
import IUserInfo from './IUserInfo';
import Shield from './Shield';
import { ViewOptions } from './ViewOptions';
import Transactions from './Transactions';
import IJumperObject from './IJumperObject';
import Menu from './Menu';
import JumperSelectionPopup from './JumperSelectionPopup';
import SignIn from './SignIn';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/analytics';
import 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { getFirestore, doc, collection } from 'firebase/firestore';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';

// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: 'AIzaSyCvd-LhmaeOiuuQLrPni_L6CneU0vpvN5w',
	authDomain: 'load-manager-976d8.firebaseapp.com',
	projectId: 'load-manager-976d8',
	storageBucket: 'load-manager-976d8.appspot.com',
	messagingSenderId: '406786636155',
	appId: '1:406786636155:web:47b31c66e5d30b282865de',
	measurementId: 'G-Z00EJV9ET3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

/**
 * The main function defining the application
 */
function App() {
	// TODO: Notifications page

	//#region User Info
	const [userAuth] = useAuthState(auth);

	const [userInfo, setUserInfo] = useState<IUserInfo>({
		id: '',
		name: '',
		isCheckedIn: false,
		canRemoveLoads: false,
	});

	const [user, userLoading, error] = useDocumentData(
		doc(firestore, 'users', userAuth?.uid || '1')
	);

	useEffect(() => {
		if (user === undefined) return;
		setUserInfo({
			id: auth?.currentUser?.uid || 'fail',
			name: user.Name,
			isCheckedIn: user.isCheckedIn,
			canRemoveLoads: user.canRemoveLoads,
			canRemoveJumpers: user.canRemoveJumpers,
			jumper: user.jumper.id,
		});
	}, [user]);

	//endregion User Info

	//#region App State
	const [optionSelected, setOptionSelected] = useState<
		ViewOptions | undefined
	>();

	const [dbJumpers, jumperLoading, jumperError] = useCollection(
		collection(firestore, 'jumpers'),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	/**
	 * Handles switching the view options and raising / lowering the shield
	 */
	function handleChangeViewOption(option?: ViewOptions) {
		setOptionSelected(optionSelected === undefined ? option : undefined);

		if (option === ViewOptions.myLoads) {
			setMyLoadsFilter(userInfo);
		} else {
			toggleShield();
		}
	}

	const shield = document.getElementById('shield'); // keep a ref to shield
	// TODO: useref?

	//#endregion App State

	//#region Messaging Between Components  //TODO: This could be a better, more generic, messaging system
	const [loadToUpdate, setLoadToUpdate] = useState<{
		load?: string;
		jumper?: IJumperObject;
	}>({});
	//#endregion Messaging Between Components

	/**
	 * Helper to raise and lower the shield
	 */
	function toggleShield() {
		if (shieldRaised) {
			shield?.classList.remove('raised');
			setShieldRaised(false);
		} else {
			shield?.classList.add('raised');
			setShieldRaised(true);
		}
	}

	//#region Load Specific Details
	/**
	 * Constructs the local storage key for a jumper list of a load
	 * @param loadId - the load ID we're interested in
	 * @returns the string key
	 */
	function getJumperListLocalStorageKey(loadId: string): string {
		return 'load' + loadId + '.jumperList';
	}

	/**
	 * Gets the up-to-date list of jumpers for a load
	 * @param loadId - the ID of the load to get jumpers from
	 * @returns an array of jumpers
	 */
	function getUpdatedJumperList(loadId: string): IJumperObject[] {
		const storedJSON: string =
			localStorage.getItem(getJumperListLocalStorageKey(loadId)) || '';
		if (storedJSON === '') return [];
		return JSON.parse(storedJSON);
	}

	/**
	 * Function to filter the loads to only this user's
	 * @param userId - the ID of the logged in user
	 */
	function getMyLoads(userId: string): number[] {
		const myLoads: number[] = [];

		loadList.forEach((load) => {
			const jumperList = getUpdatedJumperList(load.id);
			if (jumperList.length > 0) {
				jumperList.forEach((jumper) => {
					if (jumper.id === userId) {
						myLoads.push(load.number);
					}
				});
			}
		});
		return myLoads; // TODO: retire this function
	}
	// #endregion End Load Specific Details
	/**
	 * Get's the load objects for loads that this user is on
	 * @param userId - the user ID that is logged in
	 * @returns an array of loads
	 */
	function getMyLoadDetails(userId: string): ILoadObject[] {
		const myLoads: ILoadObject[] = [];

		loadList.forEach((load) => {
			const jumperList = getUpdatedJumperList(load.id);
			if (jumperList.length > 0) {
				jumperList.forEach((jumper) => {
					if (jumper.id === userId) {
						myLoads.push(load);
					}
				});
			}
		});
		return myLoads;
	}

	/**
	 * Function to set the my loads filter
	 * @param userInfo - user's info
	 */
	function setMyLoadsFilter(userInfo: IUserInfo) {
		if (loadFilter.length > 0) {
			setLoadFilter([]);
		} else {
			const myLoads = getMyLoads(userInfo.id);
			setLoadFilter(myLoads);
		}
	}

	//#region Maintain load state at the app level
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const [dbLoadList, loadsLoading, loadError] = useCollection(
		collection(firestore, 'loads'),
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	// render loadlist updates from the database
	useEffect(() => {
		const array: ILoadObject[] = [];
		dbLoadList?.docs.forEach((load) => {
			console.log(load.data());
			array.push({
				jumperList: convertJumperListToArray(load.data().jumpers),
				id: load.id,
				number: load.data().number,
				type: load.data().Type,
			});
		});

		// make sure we're sorted correctly
		array.sort((a, b) => {
			if (a.number < b.number) {
				return -1;
			} else {
				return 1;
			}
		});

		setLoadList(array);
	}, [dbLoadList]);

	//TODO: do we really need to know about the jumpers at this point?
	function convertJumperListToArray(list: any) {
		const array: IJumperObject[] = [];
		list.forEach((jumper: IJumperObject) => {
			array.push({
				id: jumper.id,
			});
		});
		console.log(array);
		return array;
	}

	const [loadFilter, setLoadFilter] = useState<number[]>([]);
	const [shieldRaised, setShieldRaised] = useState(false);

	///#endregionend load state

	function authenticatedApp() {
		return (
			<>
				<HeaderNavBar
					handleChangeViewOption={handleChangeViewOption}
					optionSelected={optionSelected}
				/>
				<section className="contents">
					<LoadContainer
						loadList={loadList}
						setLoadList={setLoadList}
						loadFilter={loadFilter}
						userInfo={userInfo}
						handleChangeViewOption={handleChangeViewOption}
						setLoadToUpdate={setLoadToUpdate}
						loadToUpdate={loadToUpdate}
						firestore={firestore}
						dbJumpers={dbJumpers}
					/>
					<JumperList firestore={firestore} dbJumpers={dbJumpers} />
				</section>

				<Shield handleChangeViewOption={handleChangeViewOption} />
				<Transactions
					optionSelected={optionSelected}
					loadList={getMyLoadDetails(userInfo.id)}
				/>
				<Menu userInfo={userInfo} optionSelected={optionSelected} auth={auth} />
				<JumperSelectionPopup
					optionSelected={optionSelected}
					handleChangeViewOption={handleChangeViewOption}
					setLoadToUpdate={setLoadToUpdate}
				/>

				<FooterNavBar
					firestore={firestore}
					loadList={loadList}
					setLoadList={setLoadList}
					userInfo={userInfo}
					setLoadFilter={setLoadFilter}
					handleChangeViewOption={handleChangeViewOption}
					optionSelected={optionSelected}
				/>
			</>
		);
	}

	return (
		<div className="App">
			<Helmet>
				<script src="https://kit.fontawesome.com/4ae8208dc5.js"></script>
				<title>DZ Manager</title>
			</Helmet>
			{userAuth ? authenticatedApp() : <SignIn app={app} />}
		</div>
	);
}

export default App;
