import { useEffect, useRef, useState } from 'react';
import Load from './Load';
import { v4 as uuidv4 } from 'uuid';
import IJumperObject from './IJumperObject';

interface ILoadObject {
	id: string;
	number: number;
	jumperList: IJumperObject[];
}

function LoadContainer() {
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const LOCAL_STORAGE_KEY = 'loadList';
	const scrollToRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
		if (storedJSON === '') return;
		setLoadList(JSON.parse(storedJSON));
	}, []);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadList));
	}, [loadList]);

	function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (event.dataTransfer.types[0] === 'text/jumper') {
			const data = JSON.parse(event.dataTransfer.getData('text/jumper'));
			const newId = data.id;
			const newName = data.name;
			if (newId !== '') {
				setLoadList((previousLoads) => {
					return [
						...previousLoads,
						{
							id: uuidv4().toString(),
							number: loadList.length + 1,
							jumperList: [{ id: newId, name: newName }],
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
			determinePosition(event);
			reorderLoads(
				event.dataTransfer.getData('text/load'),
				determinePosition(event)
			);
		}
	}

	function getLoadPosition(id: string) {
		for (let i = 0; i < loadList.length; i++) {
			if (loadList[i].id === id) {
				return i;
			}
		}
		return 0;
	}

	function reorderLoads(id: string, position: number) {
		const newList: ILoadObject[] = [...loadList];
		const index = getLoadPosition(id);
		if (index + 1 < position) {
			for (let i = position - 1; i >= index; i--) {
				newList[i] = loadList[i + 1];
			}
			newList[position - 1] = loadList[index];
		} else if (index + 1 > position) {
			for (let i = 0; i <= position; i++) {
				newList[i] = loadList[i > 0 ? i - 1 : 0];
			}
			newList[position - 1] = loadList[index];
		}
		let count = 1;
		newList.forEach((load) => {
			load.number = count;
			count++;
		});
		setLoadList([...newList]);
	}

	function determinePosition(event: React.DragEvent<HTMLDivElement>) {
		const currentX = event.clientX;
		const currentY = event.clientY;
		const loads = Array.from(document.querySelectorAll('.load'));
		const currentNumber = event.dataTransfer.getData('text/loadNum') || 0;

		let closest = loads.length - 1;
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
		} else {
			proposed = minimumDistance > 0 ? closest + 1 : closest;
		}
		return proposed > 0 ? proposed : 1;
	}

	function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (event.dataTransfer.types[0] !== 'text/load') {
			return;
		}
	}

	function removeLoad(id: string) {
		let count = 0;

		loadList.forEach((load) => {
			// update the load count
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
				className="loadContainer"
				onDragOver={handleOnDragOver}
				onDrop={handleOnDrop}
			>
				{loadList.map((load) => {
					return (
						<Load
							id={load.id}
							number={load.number}
							key={load.id}
							initialJumperList={load.jumperList}
							removeLoad={removeLoad}
						/>
					);
				})}
				<div ref={scrollToRef} className="scrollTo"></div>
			</div>
		</>
	);
}

export default LoadContainer;
