import ILoadObject from './ILoadObject';
import { v4 as uuidv4 } from 'uuid';
import IUserInfo from './IUserInfo';

function FooterNavBar(props: {
	loadList: ILoadObject[];
	setLoadList: React.Dispatch<React.SetStateAction<ILoadObject[]>>;
	userInfo: IUserInfo;
	setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
}) {
	const { loadList, setLoadList, userInfo, setUserInfo } = props;
	const shield = document.getElementById('shield');
	let shieldRaised = false;

	/**
	 * Function to handle clicking the add new load button on the mobile view
	 */
	function handleAddNewLoad() {
		setLoadList((previousLoads) => {
			return [
				...previousLoads,
				{
					id: uuidv4().toString(),
					number: loadList.length + 1,
					jumperList: [],
				},
			];
		});
		setTimeout(() => {
			const loads = Array.from(document.getElementsByClassName('load card'));
			loads[loadList.length - 1]?.scrollIntoView({
				block: 'start',
				behavior: 'smooth',
			});
		});
	}

	/**
	 * Handles toggling the user's checked in status
	 */
	function toggleCheckedIn() {
		setUserInfo((previousInfo) => {
			return {
				...previousInfo,
				isCheckedIn: !previousInfo.isCheckedIn,
			};
		});
	}

	/**
	 * Handles displaying and hiding the user's transaction data
	 */
	function handleTransactions() {
		if (shieldRaised) {
			shield?.classList.remove('raised');
			shieldRaised = false;
		} else {
			shield?.classList.add('raised');
			shieldRaised = true;
		}
	}

	/**
	 * Handles displaying and hiding the users loads
	 */
	function handleMyLoads() {
		// probably want to hide all loads without this user
	}

	function getMyLoads(userId: string) {
		const myLoads: number[] = [];
		loadList.forEach((load) => {
			load.jumperList.forEach((jumper) => {
				if (jumper.id === userId) {
					myLoads.push(load.number);
				}
			});
		});
		console.log(myLoads);
	}
	getMyLoads('5bb38709-8799-4b22-b561-6ee7d9a8d58a');

	return (
		<nav className="footer navigation">
			<span
				className={`checkIn fas faImage fa-check-circle fa-xs ${
					userInfo.isCheckedIn ? 'checkedIn' : ''
				}`}
				onClick={toggleCheckedIn}
			></span>
			<span
				className="myTransactions fas faImage fa-dollar-sign fa-xs"
				onClick={handleTransactions}
			></span>
			<span
				className="myLoads fas faImage fa-plane fa-xs"
				onClick={handleMyLoads}
			></span>
			<span
				className="addLoad fas faImage fa-plus fa-xs"
				onClick={handleAddNewLoad}
			></span>
		</nav>
	);
}

export default FooterNavBar;
