import IUserInfo from './IUserInfo';
import { ViewOptions } from './ViewOptions';
import { Auth } from 'firebase/auth';

function Menu(props: {
	userInfo: IUserInfo;
	optionSelected: ViewOptions | undefined;
	auth: Auth;
}) {
	if (props.optionSelected !== ViewOptions.menu) {
		return null;
	}

	/**
	 * Function to sign the user out
	 */
	function signOut() {
		props.auth.signOut();
	}

	return (
		<section className="menu-container">
			<div className="item card clickable">Edit User Info</div>
			<div className="item card clickable" onClick={signOut}>
				Log Out
			</div>
		</section>
	);
}

export default Menu;
