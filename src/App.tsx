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

function App() {
	// TODO: Maintiain jumper state at this level

	// TODO: Filter loads

	// TODO: Add a button to add jumpers -- this will also need a popup

	// TODO: Menu page
	// TODO: Notifications page
	// TODO: Transactions page

	/* User Info */
	const [userInfo, setUserInfo] = useState<IUserInfo>({
		id: '5bb38709-8799-4b22-b561-6ee7d9a8d58a',
		isCheckedIn: false,
	});
	/* End user info */

	/* Maintain load state at the app level */
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const LOCAL_STORAGE_KEY = 'loadList';
	const [loadFilter, setLoadFilter] = useState<number[]>([]);
	const [shieldRaised, setShieldRaised] = useState(false);

	useEffect(() => {
		const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
		if (storedJSON === '') return;
		setLoadList(JSON.parse(storedJSON));
	}, []);

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
				shieldRaised={shieldRaised}
				setShieldRaised={setShieldRaised}
			/>
			<LoadContainer
				loadList={loadList}
				setLoadList={setLoadList}
				loadFilter={loadFilter}
			/>
			<Shield />
			<JumperList />
			<FooterNavBar
				loadList={loadList}
				setLoadList={setLoadList}
				userInfo={userInfo}
				setUserInfo={setUserInfo}
				loadFilter={loadFilter}
				setLoadFilter={setLoadFilter}
				shieldRaised={shieldRaised}
				setShieldRaised={setShieldRaised}
			/>
		</div>
	);
}

export default App;
