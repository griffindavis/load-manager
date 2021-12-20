import React, { useEffect, useRef, useState } from 'react';
import Load from './Load';
import { v4 as uuidv4 } from 'uuid';
import IJumperObject from './IJumperObject';
import { Motion, spring } from 'react-motion';
import range from 'lodash.range';

interface ILoadObject {
	id: string;
	number: number;
	jumperList: IJumperObject[];
}

function LoadContainer() {
	const [loadList, setLoadList] = useState<ILoadObject[]>([]);
	const LOCAL_STORAGE_KEY = 'loadList';
	const scrollToRef = useRef<HTMLDivElement>(null);
	const [dragState, setDragState] = useState({
		isDragging: false,
		loadNumber: 0,
		loadId: '',
		mouseX: 0,
		mouseY: 0,
		deltaX: 0,
		deltaY: 0,
		order: [0],
	});

	function reinsert(arr: number[], from: number, to: number) {
		const _arr = arr.slice(0);
		const val = _arr[from];
		_arr.splice(from, 1);
		_arr.splice(to, 0, val);
		console.log(_arr);
		return _arr;
	}

	useEffect(() => {
		const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
		if (storedJSON === '') return;
		setLoadList(JSON.parse(storedJSON));
	}, []);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadList));
		setDragState((previousState) => {
			return { ...previousState, order: range(loadList.length) };
		});
	}, [loadList]);

	function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		document.querySelector('.dragging')?.classList?.remove('dragging'); // don't let shaking persist

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
			/*
			reorderLoads(
				event.dataTransfer.getData('text/load'),
				determinePosition(event)
			);
			*/
		}
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

	const defaultSize = 210;
	const padding = 20;
	const size = defaultSize + padding;
	function getSpringSize(index: number, isDragging: boolean) {
		let val = 0;
		if (index === 0) {
			val = 10;
		} else {
			val = size * index + padding / 2;
		}
		return isDragging ? val + dragState.deltaX : val;
	}
	const springSettings = {
		stiffness: 300,
		damping: 50,
	};

	return (
		<div
			className="loadContainer"
			onDragOver={handleOnDragOver}
			onDrop={handleOnDrop}
			onMouseMove={(event) => {
				if (dragState.isDragging) {
					const newState = {
						...dragState,
						deltaX: event.clientX - dragState.mouseX,
					};
					if (Math.abs(dragState.deltaX) > size) {
						const position =
							dragState.deltaX > 0
								? dragState.loadNumber + 1
								: dragState.loadNumber - 1;

						newState.order = reinsert(
							dragState.order,
							dragState.loadNumber,
							position
						);
						newState.loadNumber = position;
						newState.mouseX = event.clientX;
						newState.deltaX = 0;
					}

					setDragState(newState);
				}
			}}
		>
			{dragState.order.map((index) => {
				return (
					<Motion
						style={
							dragState.isDragging && index === dragState.loadNumber
								? {
										scale: spring(1.05),
										x: spring(getSpringSize(index, true), springSettings),
										y: spring(dragState.deltaY, springSettings),
										zindex: 99,
								  }
								: {
										scale: spring(1),
										x: spring(getSpringSize(index, false), springSettings),
										y: spring(0, springSettings),
										zindex: index,
								  }
						}
					>
						{({ scale, x, y, zindex }) => (
							<Load
								id={loadList[dragState.order[index]]?.id}
								number={index}
								key={loadList[dragState.order[index]]?.id}
								initialJumperList={[]}
								removeLoad={removeLoad}
								style={{
									transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
									zIndex: zindex,
								}}
								setDragState={setDragState}
							/>
						)}
					</Motion>
				);
			})}

			<div ref={scrollToRef} className="scrollTo"></div>
		</div>
	);
}

export default LoadContainer;
