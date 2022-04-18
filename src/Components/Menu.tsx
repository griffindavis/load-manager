import IUserInfo from './IUserInfo';
import { ViewOptions } from './ViewOptions';

function Menu(props: {
	userInfo: IUserInfo;
	optionSelected: ViewOptions | undefined;
}) {
	if (props.optionSelected !== ViewOptions.menu) {
		return null;
	}
	return (
		<section className="menu-container">
			<div className="item card clickable">Edit User Info</div>
			<div className="item card clickable">Log Out</div>
		</section>
	);
}

export default Menu;
