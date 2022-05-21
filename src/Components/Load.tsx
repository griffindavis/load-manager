/* eslint-disable react-hooks/exhaustive-deps */
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import IJumperObject from './IJumperObject';
import IUserInfo from './IUserInfo';
import { ViewOptions } from './ViewOptions';

function Load(
	props: {
		id: string;
		number?: number;
		initialJumperList: IJumperObject[];
		removeLoad: (id: string) => void;
		setDraggingLoad: (loadId: string, num: number) => void;
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
	},
	key: string
) {
	const [jumperList, setJumpers] = useState<IJumperObject[]>([]);
	const LOCAL_STORAGE_KEY = 'load' + props.id + '.jumperList';
	const userInfo = props.userInfo;
	const loadToUpdate = props.loadToUpdate;

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

	useEffect(() => {
		if (loadToUpdate.jumper === undefined || loadToUpdate.load === undefined)
			return;
		else if (loadToUpdate.load !== props.id) return;
		else if (jumperList.length >= 4) {
			alert('This load already has the max number of jumpers :(');
			return;
		} else if (loadContainsJumper(loadToUpdate.jumper.id)) {
			alert('This jumper is already on this load');
			return;
		}
		const newId = loadToUpdate.jumper.id;
		const newName = loadToUpdate.jumper.name;
		setJumpers((prevJumpers) => {
			return [...prevJumpers, { id: newId, name: newName }];
		});
	}, [loadToUpdate]);

	/**
	 * Handles the logic for removing a jumper from a load
	 * @param e the event
	 */
	function handleCancel(e: BaseSyntheticEvent) {
		const id = e.target.offsetParent.firstChild.innerText;
		// do this better with html dataset
		setJumpers(
			jumperList.filter((entry) => {
				return entry.id !== id;
			})
		);
	}

	/**
	 * Determines whether the jumper provided is on the load
	 * @param id - the jumper ID to find
	 * @returns true or false
	 */
	function loadContainsJumper(id: string) {
		return (
			jumperList.filter((entry) => {
				return entry.id === id;
			}).length > 0
		);
	}

	/**
	 * Handles dropping a jumper on a load card
	 * @param event - the drag event
	 */
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

	/**
	 * Handles logic for dragging a jumper over a load card
	 * @param event - the drag event
	 */
	function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
		event.preventDefault();
		if (event.dataTransfer.types[0] !== 'text/jumper') {
			// don't allow dropping an existing load onto another
			//event.dataTransfer.dropEffect = 'none';
		}
	}

	/**
	 * Handles logic for deleting a load
	 */
	function handleLoadDelete() {
		props.removeLoad(props.id);
	}

	/**
	 * Handles logic for adding the logged in user to a load
	 */
	function handleAddMe() {
		setJumpers((prevJumpers) => {
			return [...prevJumpers, { id: userInfo.id, name: userInfo.name }];
		});
	}

	/**
	 * Determines whether this jumper is the user logged in
	 * @param jumperId - the jumper id to find
	 * @returns true or false
	 */
	function isJumperThisUser(jumperId: string) {
		return jumperId === userInfo.id;
	}

	/**
	 * Handles displaying and hiding the users loads
	 */
	function handleAddJumper() {
		props.setLoadToUpdate((previous) => {
			return { load: props.id, jumper: undefined };
		});
		props.handleChangeViewOption(ViewOptions.addJumper);
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
					<div className="deleteLoad" onClick={handleLoadDelete}>
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
			<i
				className="fas faImage fa-user-plus addJumper fa-2x"
				onClick={handleAddJumper}
			></i>
		</div>
	);
}

export default Load;
