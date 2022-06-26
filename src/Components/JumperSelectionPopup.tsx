import { DocumentData, QuerySnapshot } from 'firebase/firestore';
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
	jumperList: QuerySnapshot<DocumentData> | undefined;
}) {
	const { optionSelected } = props;
	if (optionSelected !== ViewOptions.addJumper) return null;
	const jumperList = props.jumperList;

	/**
	 * Function to clear the view option state once a jumper has been selected
	 */
	function clearOptionSelected() {
		props.handleChangeViewOption(ViewOptions.none);
	}

	function convertDBJumperToObject(dbJumper: any) {
		return {
			id: dbJumper.id,
			name: dbJumper.data().name,
		};
	}

	return (
		<section className="jumperSelection popup" onClick={clearOptionSelected}>
			{jumperList?.docs.map((jumper) => {
				return (
					<Jumper
						key={jumper.id}
						jumper={convertDBJumperToObject(jumper)}
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
