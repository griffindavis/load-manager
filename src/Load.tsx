/* eslint-disable react-hooks/exhaustive-deps */
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import IJumperObject from './IJumperObject';
import IUserInfo from './IUserInfo';

function Load(
	props: {
		id: string;
		number?: number;
		initialJumperList: IJumperObject[];
		removeLoad: (id: string) => void;
		setDraggingLoad: (loadId: string, num: number) => void;
		userInfo: IUserInfo;
	},
	key: string
) {
	const [jumperList, setJumpers] = useState<IJumperObject[]>([]);
	const LOCAL_STORAGE_KEY = 'load' + props.id + '.jumperList';
	const userInfo = props.userInfo;
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

	function handleAddMe() {
		setJumpers((prevJumpers) => {
			return [...prevJumpers, { id: userInfo.id, name: userInfo.name }];
		});
	}

	function isJumperThisUser(jumperId: string) {
		return jumperId === userInfo.id;
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
			<div className="loadHeader">
				<div className="loadId">{props.number?.toString()}</div>
				{userInfo.canRemoveLoads ? (
					<div
						className="deleteLoad"
						/* TODO: filter out users that shouldnt' be able to delete the load*/ onClick={
							handleLoadDelete
						}
					>
						X
					</div>
				) : (
					''
				)}
			</div>

			<div className="jumperList">
				<ul>
					{jumperList === undefined
						? ''
						: jumperList.map((jumper) => {
								// TODO: create a new component
								//TODO: filter who which jumpers can be canceled
								return (
									<span className="jumper card" key={jumper.id}>
										<div className="hide">{jumper.id}</div>
										<li>{jumper.name}</li>
										{userInfo.canRemoveJumpers ||
										isJumperThisUser(jumper.id) ? (
											<div className="cancel" onClick={handleCancel}>
												X
											</div>
										) : (
											''
										)}
									</span>
								);
						  })}
					{loadContainsJumper(userInfo.id) ? (
						''
					) : (
						<li className="addMe jumper card" onClick={handleAddMe}>
							Add Me
						</li>
					)}
				</ul>
			</div>
		</div>
	);
}

export default Load;
