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
	const isLoaded = useRef(false);

	//#region data storage
	useEffect(() => {
		// maintain local storage of the jumper list
		if (!isLoaded.current) {
			return; // don't set local storage on mount
		}
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
		isLoaded.current = true;
	}, []);

	//#endregion data storage

	useEffect(() => {
		// force a re-render of the list when we update the filters
	}, [filters]);

	/**
	 * Handle adding a new jumper to the list
	 * @param e - the js event
	 * @returns
	 */
	function handleAddNewJumper(e: SyntheticEvent) {
		let name: string = '';
		if (jumperNameRef?.current?.value === null) {
			return;
		}
		if (jumperNameRef !== null) {
			if (jumperNameRef.current !== null) {
				name = jumperNameRef.current.value;
				jumperNameRef.current.value = ''; // reset the entry field

				const newJumper = createNewJumper();
				newJumper.name = name;
				setJumpers((prevJumpers) => {
					return [...prevJumpers, newJumper];
				});
			}
		}
	}

	/**
	 * Handles clearing the local storage of all jumpers
	 */
	function handleClear() {
		setJumpers([]);
		localStorage.setItem(LOCAL_STORAGE_KEY, '');
	}

	/**
	 * Handles removing the jumper from the stored jumper list
	 * @param e - the js event
	 */
	function removeJumper(e: SyntheticEvent) {
		const id = e.currentTarget.getAttribute('data-id');
		setJumpers(
			jumpers.filter((entry) => {
				return entry.id !== id;
			})
		);
	}

	/**
	 * Handles when the enter key was pressed
	 * @param e - the js event
	 */
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
					name="name"
					required
					autoComplete="off"
				/>
				<label htmlFor="name" className="label-name">
					<span className="label-content">Name</span>
				</label>
				<button id="AddJumper" className="margin" onClick={handleAddNewJumper}>
					Add
				</button>
				<button onClick={handleClear} className="margin">
					Clear All
				</button>
			</div>
		</div>
	);
}

export default JumperList;
