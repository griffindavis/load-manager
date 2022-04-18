import { ViewOptions } from './ViewOptions';

function HeaderNavBar(props: {
	handleChangeViewOption: (option: ViewOptions) => void;
	optionSelected: ViewOptions | undefined;
}) {
	const { handleChangeViewOption, optionSelected } = props;

	/**
	 * Function to toggle the notifications button
	 */
	function handleToggleNotifications() {
		handleChangeViewOption(ViewOptions.notifications);
	}

	/**
	 * Function to toggle the user info button
	 */
	function handleToggleUserInfo() {
		handleChangeViewOption(ViewOptions.user);
	}

	/**
	 * Function to toggle the menu button
	 */
	function handleToggleMenu() {
		handleChangeViewOption(ViewOptions.menu);
	}

	return (
		<nav className="header navigation">
			<span
				className={`menu fas faImage fa-bars fa-xs ${
					optionSelected === ViewOptions.menu ? 'selected compliment' : ''
				}`}
				onClick={handleToggleMenu}
			></span>
			<span
				className={`myUser fas faImage fa-user-circle fa-xs ${
					optionSelected === ViewOptions.user ? 'selected compliment' : ''
				}`}
				onClick={handleToggleUserInfo}
			></span>
			<span
				className={`notifications fas faImage fa-bell fa-xs ${
					optionSelected === ViewOptions.notifications
						? 'selected compliment'
						: ''
				}`}
				onClick={handleToggleNotifications}
			></span>
		</nav>
	);
}

export default HeaderNavBar;
