import IJumperObject from './IJumperObject';
import Jumper from './Jumper';
import { ViewOptions } from './ViewOptions';
function JumperSelectionPopup(props: {
	optionSelected: ViewOptions | undefined;
	handleChangeViewOption: (option: ViewOptions) => void;
	setLoadToUpdate: React.Dispatch<
		React.SetStateAction<{
			load?: string | undefined;
			jumper?: IJumperObject | undefined;
		}>
	>;
}) {
	const { optionSelected } = props;
	if (optionSelected !== ViewOptions.addJumper) return null;

	const LOCAL_STORAGE_KEY = 'jumperList.jumpers';
	const jumpers = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
	if (jumpers === '') return null;
	const jumperList: IJumperObject[] = JSON.parse(jumpers);

	function clearOptionSelected() {
		props.handleChangeViewOption(ViewOptions.none);
	}

	return (
		<section className="jumperSelection popup" onClick={clearOptionSelected}>
			{jumperList.map((jumper) => {
				return (
					<Jumper
						key={jumper.id}
						jumper={jumper}
						fromPopup={true}
						setLoadToUpdate={props.setLoadToUpdate}
					/>
				);
			})}
			;
		</section>
	);
}

export default JumperSelectionPopup;
