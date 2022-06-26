import {
	useState,
	useRef,
	useEffect,
	SyntheticEvent,
	KeyboardEvent,
} from 'react';
import IJumperObject from './IJumperObject';
import JumperNavBar from './JumperNavBar';
import Jumper from './Jumper';
import {
	addDoc,
	collection,
	Firestore,
	QuerySnapshot,
	DocumentData,
} from 'firebase/firestore';

function JumperList(props: {
	firestore: Firestore;
	dbJumpers: QuerySnapshot<DocumentData> | undefined;
}) {
	const [filters, setFilters] = useState({
		video: false,
		instructor: false,
		student: false,
	});

	const { firestore, dbJumpers } = props;
	const [jumpers, setJumpers] = useState<IJumperObject[]>([]);
	const jumperNameRef = useRef<HTMLInputElement>(null);

	// listen for changes to the jumper list from the database
	useEffect(() => {
		const array: IJumperObject[] = []; //TODO: create a function to translate a db jumper to a client object
		dbJumpers?.docs.forEach((doc) => {
			array.push({
				id: doc.id,
				name: doc.data().name,
				isVideographer: doc.data().isVideographer,
				isInstructor: doc.data().isInstructor,
				isStudent: doc.data().isStudent,
			});
			setJumpers(array);
		});
	}, [dbJumpers]);

	/**
	 * Creates a new jumper in the database
	 * @param name - the name of the jumper
	 */
	function createNewJumper(name: string): void {
		//TODO: we need to be able to add more info here
		addDoc(collection(firestore, 'jumpers'), {
			name: name,
		});
	}

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

				createNewJumper(name);
			}
		}
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
							firestore={firestore}
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
			</div>
		</div>
	);
}

export default JumperList;
