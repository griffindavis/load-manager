import {
	useState,
	useRef,
	useEffect,
	SyntheticEvent,
	KeyboardEvent,
} from 'react';
import IJumperObject from './IJumperObject';
import { createNewJumper } from './IJumperObject';
import JumperNavBar from './JumperNavBar';
import Jumper from './Jumper';

const LOCAL_STORAGE_KEY = 'jumperList.jumpers';

function JumperList() {
	const [filters, setFilters] = useState({
		video: false,
		instructor: false,
		student: false,
	});
	const [jumpers, setJumpers] = useState<IJumperObject[]>([]);
	const jumperNameRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		// maintain local storage of the jumper list
		if (jumpers.length < 1) return;
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jumpers));
	}, [jumpers]);

	useEffect(() => {
		// get the initial list from local storage
		const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
		if (storedJSON === '') return;
		const storedJumpers = JSON.parse(storedJSON);
		if (storedJumpers !== '') {
			setJumpers(storedJumpers);
		}
	}, []);

	useEffect(() => {
		// force a re-render of the list when we update the filters
	}, [filters]);

	function handleAddJumper(e: SyntheticEvent) {
		let name: string = '';
		if (jumperNameRef?.current?.value === null) {
			return;
		}
		if (jumperNameRef !== null) {
			if (jumperNameRef.current !== null) {
				name = jumperNameRef.current.value;
				jumperNameRef.current.value = '';
				const newJumper = createNewJumper();
				newJumper.name = name;
				setJumpers((prevJumpers) => {
					return [...prevJumpers, newJumper];
				});
			}
		}
	}

	function handleClear() {
		setJumpers([]);
		localStorage.setItem(LOCAL_STORAGE_KEY, '');
	}

	function removeJumper(e: SyntheticEvent) {
		const id = e.currentTarget.getAttribute('data-id');
		setJumpers(
			jumpers.filter((entry) => {
				return entry.id !== id;
			})
		);
	}

	function handleKeyDown(e: KeyboardEvent) {
		// allow hitting enter to submit the new jumper
		if (e.key === 'Enter') {
			document.getElementById('AddJumper')?.click();
		}
	}

	return (
		<div className="jumperListSection">
			<h1>Jumper List</h1>

			{/* pass filters to the navbar since that's where they'll actually be set but we need to maintain the state in the parent */}
			<JumperNavBar setFilters={setFilters} filters={filters} />
			<div
				className={`listOfJumpers ${jumpers.length === 0 ? 'zeroState' : ''}`}
			>
				{jumpers.map((jumper) => {
					// also pass filters here since the subcomponent
					// needs to know whether it should render.
					// which comes down to just adding a css class to hide if needed
					return (
						<Jumper
							key={jumper.id}
							jumper={jumper}
							removeJumper={removeJumper}
							filters={filters}
						/>
					);
				})}
				<div id="jumper-zero-state">
					{jumpers.length === 0 ? "Enter a jumper's name below to start!" : ''}
				</div>
			</div>

			<div className="jumperListInputContainer">
				<input
					ref={jumperNameRef}
					onKeyDown={handleKeyDown}
					type="text"
					className="margin"
				/>
				<button id="AddJumper" className="margin" onClick={handleAddJumper}>
					Add
				</button>
				<button onClick={handleClear} className="margin">
					Clear All
				</button>
			</div>
			<p>There are {jumpers.length} jumpers!</p>
		</div>
	);
}

export default JumperList;
