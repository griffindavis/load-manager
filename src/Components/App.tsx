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

function App() {
	// TODO: Notifications page

	/* User Info */
	const [userInfo, setUserInfo] = useState<IUserInfo>({
		id: '5bb38709-8799-4b22-b561-6ee7d9a8d58a',
		name: 'Griffin',
		isCheckedIn: false,
		canRemoveLoads: true,
	});
	/* End user info */

	/* View State */
	const [optionSelected, setOptionSelected] = useState<
		ViewOptions | undefined
	>();

	const [loadToUpdate, setLoadToUpdate] = useState<{
		load?: string;
		jumper?: IJumperObject;
	}>({});

	const shield = document.getElementById('shield'); // keep a ref to shield
	// TODO: useref?

	/* End View State */

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
	 * Constructs the local storage key for a jumper list of a load
	 * @param loadId - the load ID we're interested in
	 * @returns the string key
	 */
	function getJumperListLocalStorageKey(loadId: string): string {
		return 'load' + loadId + '.jumperList';
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

	/* Maintain load state at the app level */
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const LOAD_LOCAL_STORAGE_KEY = 'loadList';
	const [loadFilter, setLoadFilter] = useState<number[]>([]);
	const [shieldRaised, setShieldRaised] = useState(false);

	// get the initial stored load list
	useEffect(() => {
		const storedJSON: string =
			localStorage.getItem(LOAD_LOCAL_STORAGE_KEY) || '';
		if (storedJSON === '') return;
		setLoadList(JSON.parse(storedJSON));
	}, []);

	// update the stored load list whenever it is changed
	useEffect(() => {
		localStorage.setItem(LOAD_LOCAL_STORAGE_KEY, JSON.stringify(loadList));
	}, [loadList]);
	/* end load state */

	return (
		<div className="App">
			<Helmet>
				<script src="https://kit.fontawesome.com/4ae8208dc5.js"></script>
			</Helmet>

			<HeaderNavBar
				handleChangeViewOption={handleChangeViewOption}
				optionSelected={optionSelected}
			/>

			<LoadContainer
				loadList={loadList}
				setLoadList={setLoadList}
				loadFilter={loadFilter}
				userInfo={userInfo}
				handleChangeViewOption={handleChangeViewOption}
				setLoadToUpdate={setLoadToUpdate}
				loadToUpdate={loadToUpdate}
			/>
			<Shield handleChangeViewOption={handleChangeViewOption} />
			<Transactions
				optionSelected={optionSelected}
				loadList={getMyLoadDetails(userInfo.id)}
			/>
			<Menu userInfo={userInfo} optionSelected={optionSelected} />
			<JumperSelectionPopup
				optionSelected={optionSelected}
				handleChangeViewOption={handleChangeViewOption}
				setLoadToUpdate={setLoadToUpdate}
			/>

			<JumperList />

			<FooterNavBar
				loadList={loadList}
				setLoadList={setLoadList}
				userInfo={userInfo}
				setUserInfo={setUserInfo}
				setLoadFilter={setLoadFilter}
				handleChangeViewOption={handleChangeViewOption}
				optionSelected={optionSelected}
			/>
		</div>
	);
}

export default App;
