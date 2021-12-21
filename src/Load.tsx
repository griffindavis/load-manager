/* eslint-disable react-hooks/exhaustive-deps */
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import IJumperObject from './IJumperObject';

function Load(
	props: {
		id: string;
		number?: number;
		initialJumperList: IJumperObject[];
		removeLoad: (id: string) => void;
		setDraggingLoad: (loadId: string, num: number) => void;
	},
	key: string
) {
	const [jumperList, setJumpers] = useState<IJumperObject[]>([]);
	const LOCAL_STORAGE_KEY = 'load' + props.id + '.jumperList';

	useEffect(() => {
		const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
		if (storedJSON.length === 0) {
			// this is the case when we create a new load
			setJumpers(props.initialJumperList);
		} else {
			setJumpers(JSON.parse(storedJSON));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jumperList));
	}, [jumperList]);

	function handleCancel(e: BaseSyntheticEvent) {
		const id = e.target.offsetParent.firstChild.innerText;
		// do this better with html dataset
		setJumpers(
			jumperList.filter((entry) => {
				return entry.id !== id;
			})
		);
	}

	function loadContainsJumper(id: string) {
		return (
			jumperList.filter((entry) => {
				return entry.id === id;
			}).length > 0
		);
	}

	function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		document.querySelector('.dragging')?.classList?.remove('dragging');
		if (event.dataTransfer.types[0] === 'text/jumper') {
			const data = JSON.parse(event.dataTransfer.getData('text/jumper'));
			const newId = data.id;
			const newName = data.name;

			if (jumperList.length >= 4) {
				alert(`You cannot add ${newName} to the load, it is already full :(`);
			} else if (newId !== '') {
				if (!loadContainsJumper(newId)) {
					setJumpers((prevJumpers) => {
						return [...prevJumpers, { id: newId, name: newName }];
					});
				} else {
					alert(`${newName} is already on this load!`);
				}
			}
			event.stopPropagation();
		}
	}

	function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (event.dataTransfer.types[0] !== 'text/jumper') {
			// don't allow dropping an existing load onto another
			//event.dataTransfer.dropEffect = 'none';
		}
	}

	function handleLoadDelete() {
		props.removeLoad(props.id);
	}

	return (
		<div
			className="load card"
			onDrop={handleOnDrop}
			onDragOver={handleOnDragOver}
			draggable={true}
			onDragStart={(event) => {
				event.dataTransfer.setData('text/load', props.id);
				if (props.number !== undefined) {
					event.dataTransfer.setData('text/loadNum', props.number.toString());
					props.setDraggingLoad(props.id, props.number);
					event.currentTarget.classList.add('dragging');
				}
			}}
		>
			<div className="loadId">{props.number?.toString()}</div>

			<div className="jumperList">
				<ul>
					{jumperList === undefined
						? ''
						: jumperList.map((jumper) => {
								// TODO: create a new component
								return (
									<span className="jumper card" key={jumper.id}>
										<div className="hide">{jumper.id}</div>
										<li>{jumper.name}</li>
										<div className="cancel" onClick={handleCancel}>
											X
										</div>
									</span>
								);
						  })}
				</ul>
			</div>
			<button onClick={handleLoadDelete}>Delete</button>
		</div>
	);
}

export default Load;
