import ILoadObject, { LoadType } from './ILoadObject';
import { v4 as uuidv4 } from 'uuid';
import IUserInfo from './IUserInfo';
import { ViewOptions } from './ViewOptions';

function FooterNavBar(props: {
	loadList: ILoadObject[];
	setLoadList: React.Dispatch<React.SetStateAction<ILoadObject[]>>;
	userInfo: IUserInfo;
	setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>;
	setLoadFilter: React.Dispatch<React.SetStateAction<number[]>>;
	handleChangeViewOption: (option: ViewOptions) => void;
	optionSelected: ViewOptions | undefined;
}) {
	const {
		loadList,
		setLoadList,
		userInfo,
		setUserInfo,
		handleChangeViewOption,
		optionSelected,
	} = props; // destructure props

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
					type: LoadType.high,
				},
			];
		});
		// need to give it time to render
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
		handleChangeViewOption(ViewOptions.transactions);
	}

	/**
	 * Handles displaying and hiding the users loads
	 */
	function handleMyLoads() {
		handleChangeViewOption(ViewOptions.myLoads);
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
					optionSelected === ViewOptions.transactions
						? 'selected compliment'
						: ''
				}`}
				onClick={handleTransactions}
			></span>
			<span
				className={`myLoads fas faImage fa-plane fa-xs ${
					optionSelected === ViewOptions.myLoads ? 'selected compliment' : ''
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
