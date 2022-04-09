import ILoadObject from './ILoadObject';
import { v4 as uuidv4 } from 'uuid';
import IUserInfo from './IUserInfo';
import { useState } from 'react';

function FooterNavBar(props: {
	loadList: ILoadObject[];
	setLoadList: React.Dispatch<React.SetStateAction<ILoadObject[]>>;
	userInfo: IUserInfo;
	setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
	loadFilter: number[];
	setLoadFilter: React.Dispatch<React.SetStateAction<number[]>>;
	shieldRaised: boolean;
	setShieldRaised: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const {
		loadList,
		setLoadList,
		userInfo,
		setUserInfo,
		loadFilter,
		setLoadFilter,
		shieldRaised,
		setShieldRaised,
	} = props;
	const shield = document.getElementById('shield');

	const [transactionSelected, setTransactionSelected] = useState(false);

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
		toggleShield();
		setTransactionSelected(!transactionSelected);
	}

	/**
	 * Function to raise and drop the shield appropriately
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
	 * Handles displaying and hiding the users loads
	 */
	function handleMyLoads() {
		// probably want to hide all loads without this user
		if (loadFilter.length > 0) {
			setLoadFilter([]);
		} else {
			getMyLoads(userInfo.id);
		}
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
		setLoadFilter(myLoads);
	}

	return (
		<nav className="footer navigation">
			<span
				className={`checkIn fas faImage fa-check-circle fa-xs ${
					userInfo.isCheckedIn ? 'checkedIn' : ''
				}`}
				onClick={toggleCheckedIn}
			></span>
			<span
				className={`myTransactions fas faImage fa-dollar-sign fa-xs ${
					transactionSelected ? 'selected compliment' : ''
				}`}
				onClick={handleTransactions}
			></span>
			<span
				className={`myLoads fas faImage fa-plane fa-xs ${
					loadFilter.length > 0 ? 'selected compliment' : ''
				}`}
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
