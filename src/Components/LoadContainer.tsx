import React, { useRef } from 'react';
import Load from './Load';
import { v4 as uuidv4 } from 'uuid';
import ILoadObject, { LoadType } from './ILoadObject';
import IUserInfo from './IUserInfo';
import { ViewOptions } from './ViewOptions';
import IJumperObject from './IJumperObject';
import { DocumentData, Firestore, QuerySnapshot } from 'firebase/firestore';

function LoadContainer(props: {
	loadList: ILoadObject[];
	setLoadList: React.Dispatch<React.SetStateAction<ILoadObject[]>>;
	loadFilter: number[];
	userInfo: IUserInfo;
	handleChangeViewOption: (option: ViewOptions) => void;
	setLoadToUpdate: React.Dispatch<
		React.SetStateAction<{
			load?: string | undefined;
			jumper?: IJumperObject | undefined;
		}>
	>;
	loadToUpdate: {
		load?: string;
		jumper?: IJumperObject;
	};
	firestore: Firestore;
	dbJumpers: QuerySnapshot<DocumentData> | undefined;
}) {
	const scrollToRef = useRef<HTMLDivElement>(null); // used to scroll automatically when a new load is added

	// destructure props
	const {
		loadList,
		setLoadList,
		loadFilter,
		userInfo,
		handleChangeViewOption,
		setLoadToUpdate,
		loadToUpdate,
		firestore,
		dbJumpers,
	} = props;

	const draggingLoadId = useRef('');
	const draggingLoadNumber = useRef(0);

	/**
	 * Saves off the load details being dragged
	 * @param loadId - the load ID to set
	 * @param num - the load number to set
	 */
	function setDraggingLoad(loadId: string, num: number) {
		draggingLoadId.current = loadId;
		draggingLoadNumber.current = num;
	}

	/**
	 * Handles dropping an element on a load
	 * @param event - drag event
	 */
	function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();

		document.querySelector('.dragging')?.classList?.remove('dragging'); // don't let shaking persist

		if (event.dataTransfer.types[0] === 'text/jumper') {
			const data = JSON.parse(event.dataTransfer.getData('text/jumper'));

			const jumperId = data.id;
			const jumperName = data.name;

			if (jumperId !== '') {
				setLoadList((previousLoads) => {
					return [
						...previousLoads,
						{
							id: uuidv4().toString(),
							number: loadList.length + 1,
							jumperList: [{ id: jumperId, name: jumperName }],
							type: LoadType.high,
						},
					];
				});
			} else {
			}
			setTimeout(() => {
				// have to have a short timeout to make this actually work
				scrollToRef?.current?.scrollIntoView({
					block: 'start',
					behavior: 'smooth',
				});
			}, 100);
		} else if (event.dataTransfer.types[0] === 'text/load') {
			reorderLoads(
				event.dataTransfer.getData('text/load'),
				determinePosition(event)
			); //TODO: replace getData with draggingLoadId
		}
	}

	/**
	 * Determines the load's index in the array
	 * @param id - the load ID
	 * @returns
	 */
	function getLoadPosition(id: string) {
		for (let i = 0; i < loadList.length; i++) {
			if (loadList[i].id === id) {
				return i;
			}
		}
		return 0;
	}

	/**
	 * Reredners the loads in their new positions
	 * @param id - the load ID
	 * @param position  - the new position
	 * @returns - nothing
	 */
	function reorderLoads(id: string, position: number) {
		const newList: ILoadObject[] = [...loadList];
		const index = getLoadPosition(id); // TODO: this is just draggingLoadNumber - 1

		if (index + 1 === position) return; // don't set loads constantly
		if (index + 1 < position) {
			for (let i = position - 1; i >= index; i--) {
				newList[i] = loadList[i + 1];
			}
			newList[position - 1] = loadList[index];
		} else if (index + 1 > position) {
			for (let i = position - 1; i <= index; i++) {
				newList[i] = loadList[i > 0 ? i - 1 : 0];
			}
			newList[position - 1] = loadList[index];
		}
		let count = 1;
		newList.forEach((load) => {
			load.number = count;
			count++;
		});

		// actually set the values
		setDraggingLoad(id, position);
		setLoadList([...newList]);
	}

	/**
	 * Determine the position of the element being dragged
	 * @param event - the drag event
	 * @returns the new proposed position (index in the array)
	 */
	function determinePosition(event: React.DragEvent<HTMLDivElement>) {
		const currentX = event.clientX;
		const currentY = event.clientY;

		// need to querySelectorAll because we need the dom elements
		const loads = Array.from(document.querySelectorAll('.load'));
		const currentNumber = draggingLoadNumber.current;

		let closest = loads.length - 1; // this is the index
		let minimumDistance = window.innerWidth;

		for (let i = 0; i < loads.length; i++) {
			const box = loads[i].getBoundingClientRect();
			if (currentY > box.bottom || currentY < box.top) {
				continue;
			}
			const middle = box.left + box.width / 2;
			const distance = currentX - middle;
			if (Math.abs(distance) < Math.abs(minimumDistance)) {
				minimumDistance = distance;
				closest = i;
			}
		}
		let proposed = 0;

		if (closest + 1 < currentNumber) {
			proposed = minimumDistance < 0 ? closest + 1 : closest + 2;
		} else if (closest + 1 === currentNumber) {
			return currentNumber;
		} else {
			proposed = minimumDistance > 0 ? closest + 1 : closest;
		}
		return proposed > 0 ? proposed : 1;
	}

	/**
	 * Handles the logic for dragging the element over a load card
	 * @param event - the drag event
	 * @returns
	 */
	function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (event.dataTransfer.types[0] !== 'text/load') {
			return;
		}

		// Live reordering
		const position = determinePosition(event);
		reorderLoads(draggingLoadId.current, position);
	}

	/**
	 * Removes a load from the list
	 * @param id - the load ID to remove
	 */
	function removeLoad(id: string) {
		let count = 0;

		loadList.forEach((load) => {
			// backfill any necessary load number changes
			if (load.id === id) return;
			count++;
			load.number = count;
		});

		setLoadList(
			loadList.filter((load) => {
				return load.id !== id;
			})
		);
	}

	return (
		<>
			<div
				className={`loadContainer ${loadList.length === 0 ? 'zeroState' : ''}`}
				onDragOver={handleOnDragOver}
				onDrop={handleOnDrop}
			>
				{loadList.map((load) => {
					// filter out loads if we've applied a filter
					if (loadFilter.length > 0 && !loadFilter.includes(load.number)) {
						return null;
					}
					return (
						<Load
							id={load.id}
							number={load.number}
							key={load.id}
							removeLoad={removeLoad}
							setDraggingLoad={setDraggingLoad}
							userInfo={userInfo}
							handleChangeViewOption={handleChangeViewOption}
							setLoadToUpdate={setLoadToUpdate}
							loadToUpdate={loadToUpdate}
							firestore={firestore}
							dbJumpers={dbJumpers}
						/>
					);
				})}
				<div>
					{loadList.length === 0
						? 'There are no loads prepared, drag a jumper into the section to start a load!'
						: ''}
				</div>
				<div ref={scrollToRef} className="scrollTo"></div>
			</div>
		</>
	);
}

export default LoadContainer;
