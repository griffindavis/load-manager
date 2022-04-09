import { useState } from 'react';

enum options {
	menu,
	user,
	notifications,
}

function HeaderNavBar(props: {
	shieldRaised: boolean;
	setShieldRaised: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { shieldRaised, setShieldRaised } = props;
	const shield = document.getElementById('shield');

	const [optionSelected, setOptionSelected] = useState<options | undefined>();

	function handleToggleNotifications() {
		toggleShield();
		setOptionSelected(
			optionSelected === undefined ? options.notifications : undefined
		);
	}

	function handleToggleUserInfo() {
		toggleShield();
		setOptionSelected(optionSelected === undefined ? options.user : undefined);
	}

	function handleToggleMenu() {
		toggleShield();
		setOptionSelected(optionSelected === undefined ? options.menu : undefined);
	}

	function toggleShield() {
		if (shieldRaised) {
			shield?.classList.remove('raised');
			setShieldRaised(false);
		} else {
			shield?.classList.add('raised');
			setShieldRaised(true);
		}
	}
	return (
		<nav className="header navigation">
			<span
				className={`menu fas faImage fa-bars fa-xs ${
					optionSelected === options.menu ? 'selected compliment' : ''
				}`}
				onClick={handleToggleMenu}
			></span>
			<span
				className={`myUser fas faImage fa-user-circle fa-xs ${
					optionSelected === options.user ? 'selected compliment' : ''
				}`}
				onClick={handleToggleUserInfo}
			></span>
			<span
				className={`notifications fas faImage fa-bell fa-xs ${
					optionSelected === options.notifications ? 'selected compliment' : ''
				}`}
				onClick={handleToggleNotifications}
			></span>
		</nav>
	);
}

export default HeaderNavBar;
