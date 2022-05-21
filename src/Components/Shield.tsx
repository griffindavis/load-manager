import { ViewOptions } from './ViewOptions';

export default function Shield(props: {
	handleChangeViewOption: (option: ViewOptions) => void;
}) {
	function handleClearViewOption() {
		props.handleChangeViewOption(ViewOptions.none);
	}
	return (
		<div id="shield" className="shield" onClick={handleClearViewOption}></div>
	);
}
