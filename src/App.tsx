import './styles.css';
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

function App() {
	// TODO: Maintiain jumper state at this level

	// TODO: Filter loads

	// TODO: Add a button to add jumpers -- this will also need a popup

	// TODO: Menu page
	// TODO: Notifications page

	/* User Info */
	const [userInfo, setUserInfo] = useState<IUserInfo>({
		id: '5bb38709-8799-4b22-b561-6ee7d9a8d58a',
		name: 'Griffin',
		isCheckedIn: false,
	});
	/* End user info */

	/* View State */
	const [optionSelected, setOptionSelected] = useState<
		ViewOptions | undefined
	>();

	const shield = document.getElementById('shield'); // keep a ref to shield

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
	function handleChangeViewOption(option: ViewOptions) {
		if (option !== ViewOptions.myLoads) {
			toggleShield();
		}

		setOptionSelected(optionSelected === undefined ? option : undefined);

		if (option === ViewOptions.myLoads) {
			setMyLoadsFilter(userInfo);
		}
	}
	/**
	 * Function to filter the loads to only this user's
	 * @param userId - the ID of the logged in user
	 */
	function getMyLoads(userId: string): number[] {
		const myLoads: number[] = [];

		loadList.forEach((load) => {
			load.jumperList.forEach((jumper) => {
				if (jumper.id === userId) {
					myLoads.push(load.number);
				}
			});
		});
		return myLoads;
	}

	function getMyLoadDetails(userId: string): ILoadObject[] {
		const myLoads: ILoadObject[] = [];

		loadList.forEach((load) => {
			load.jumperList.forEach((jumper) => {
				if (jumper.id === userId) {
					myLoads.push(load);
				}
			});
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

	/* End View State */

	/* Maintain load state at the app level */
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const LOCAL_STORAGE_KEY = 'loadList';
	const [loadFilter, setLoadFilter] = useState<number[]>([]);
	const [shieldRaised, setShieldRaised] = useState(false);

	// get the initial stored load list
	useEffect(() => {
		const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
		if (storedJSON === '') return;
		setLoadList(JSON.parse(storedJSON));
	}, []);

	// update the stored load list whenever it is changed
	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadList));
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
			/>
			<Transactions
				optionSelected={optionSelected}
				loadList={getMyLoadDetails(userInfo.id)}
			/>
			<Shield />
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
