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
	// TODO: Maintian load state at this level
	// TODO: Maintiain jumper state at this level

	// TODO: Add load button
	// TODO: Filter loads

	// TODO: Add a button to add jumpers -- this will also need a popup

	// TODO: Menu page
	// TODO: Notifications page
	// TODO: Transactions page

	/* User Info */
	const [userInfo, setUserInfo] = useState<IUserInfo>({ isCheckedIn: false });
	/* End user info */

	/* Maintain load state at the app level */
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const LOCAL_STORAGE_KEY = 'loadList';

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

			<HeaderNavBar />
			<LoadContainer loadList={loadList} setLoadList={setLoadList} />
			<Shield />
			<JumperList />
			<FooterNavBar
				loadList={loadList}
				setLoadList={setLoadList}
				userInfo={userInfo}
				setUserInfo={setUserInfo}
			/>
		</div>
	);
}

export default App;
