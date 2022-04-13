import ILoadObject, { LoadType } from './ILoadObject';
import { ViewOptions } from './ViewOptions';

function Transactions(props: {
	optionSelected: ViewOptions | undefined;
	loadList: ILoadObject[];
}) {
	if (props.optionSelected !== ViewOptions.transactions) return <div />;
	const loadList = props.loadList;

	return (
		<section className="transactions">
			<div className="card">{`Total: $${calculateTotal(loadList)}`}</div>
			{loadList.map((load) => (
				<div className="card">{`Load ${load.number}: $${getPrice(load)}`}</div>
			))}
		</section>
	);
}

function calculateTotal(loadList: ILoadObject[]): number {
	let total = 0;
	loadList.forEach((load) => {
		total += getPrice(load);
	});
	return total;
}

function getPrice(load: ILoadObject) {
	if (load.type === LoadType.low) {
	}
	return 19;
}

export default Transactions;
