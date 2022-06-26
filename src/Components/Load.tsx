/* eslint-disable react-hooks/exhaustive-deps */
import { AnyAaaaRecord } from 'dns';
import {
	Firestore,
	doc,
	QuerySnapshot,
	DocumentData,
	setDoc,
	deleteDoc,
} from 'firebase/firestore';
import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import IJumperObject from './IJumperObject';
import IUserInfo from './IUserInfo';
import { ViewOptions } from './ViewOptions';

function Load(
	props: {
		id: string;
		number: number;
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
		firestore: Firestore;
		dbJumpers: QuerySnapshot<DocumentData> | undefined;
	},
	key: string
) {
	const {
		id,
		number,
		removeLoad,
		setDraggingLoad,
		userInfo,
		handleChangeViewOption,
		setLoadToUpdate,
		loadToUpdate,
		firestore,
		dbJumpers,
	} = props;

	const [jumperList, setJumpers] = useState<IJumperObject[]>([]);

	//#region data storage
	const [thisLoad, loading, error] = useDocumentData(
		doc(firestore, 'loads', id)
	);
	useEffect(() => {
		const tempArray: IJumperObject[] = [];
		const jumperList = thisLoad?.jumpers;
		jumperList?.forEach((jumper: any) => {
			let reference = dbJumpers?.docs.find((doc) => {
				return doc.id === jumper.id;
			});
			tempArray.push({
				id: reference?.id || '',
				name: reference?.data().name,
			});
		});
		setJumpers(tempArray);
	}, [thisLoad, dbJumpers]);

	//#endregion data storage

	/*
	 * Once we have the necessary information in the "messaging system" go ahead and try to add that jumper to the load
	 */
	useEffect(() => {
		//TODO: can this be done better now that we can listen to the firestore updates
		// quit early if we're still missing information
		if (loadToUpdate.jumper === undefined || loadToUpdate.load === undefined)
			return;
		else if (loadToUpdate.load !== id) return;
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
		let filtered = jumperList.filter((entry) => {
			return entry.id !== id;
		});
		//setJumpers(convertJumperListToFirestore(filtered));
		let docRef = doc(firestore, 'loads', props.id);
		setDoc(
			docRef,
			{ jumpers: convertJumperListToFirestore(filtered) },
			{ merge: true }
		);
	}

	/**
	 * Converts the jumper list to a reference doc list that can be used by firestore
	 * @param jumperList - the list of jumper objects
	 * @returns
	 */
	function convertJumperListToFirestore(jumperList: IJumperObject[]) {
		const array: any[] = [];
		jumperList.forEach((jumper) => {
			array.push(doc(firestore, 'jumpers', jumper.id));
		});
		console.log(array);
		return array;
	}

	/**
	 * Adds a jumper to the load, does not perform the validation
	 */
	function addJumperToLoad(jumperId: string) {
		if (jumperList.length >= 4) {
			alert(`You cannot add yourself to the load, it is already full :(`);
		} else if (loadContainsJumper(jumperId)) {
			alert(`You're already on this load!`);
		} else {
			let docRef = doc(firestore, 'loads', props.id);
			setDoc(
				docRef,
				{
					jumpers: [
						...convertJumperListToFirestore(jumperList),
						doc(firestore, 'jumpers', jumperId),
					],
				},
				{ merge: true }
			);
		}
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
		document.querySelector('.dragging')?.classList?.remove('dragging'); // stop the animation

		if (event.dataTransfer.types[0] === 'text/jumper') {
			const data = JSON.parse(event.dataTransfer.getData('text/jumper'));
			const newId = data.id;
			const newName = data.name;

			if (jumperList.length >= 4) {
				alert(`You cannot add ${newName} to the load, it is already full :(`);
			} else if (newId !== '') {
				if (!loadContainsJumper(newId)) {
					addJumperToLoad(newId);
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
	}

	/**
	 * Handles logic for deleting a load
	 */
	function handleLoadDelete() {
		deleteDoc(doc(firestore, 'loads', props.id));
	}

	/**
	 * Handles logic for adding the logged in user to a load
	 */
	function handleAddMe() {
		if (userInfo.jumper !== null && userInfo.jumper !== undefined) {
			console.log(userInfo.jumper);
			addJumperToLoad(userInfo.jumper);
		}
		// setJumpers((prevJumpers) => {
		// 	return [...prevJumpers, { id: userInfo.id, name: userInfo.name }];
		// });
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
		setLoadToUpdate((previous) => {
			return { load: id, jumper: undefined };
		});
		handleChangeViewOption(ViewOptions.addJumper);
	}

	return (
		<div
			className="load card"
			onDrop={handleOnDrop}
			onDragOver={handleOnDragOver}
			draggable={true}
			onDragStart={(event) => {
				event.dataTransfer.setData('text/load', id);
				if (number !== undefined) {
					event.dataTransfer.setData('text/loadNum', number.toString());
					setDraggingLoad(id, number);
					event.currentTarget.classList.add('dragging');
				}
			}}
		>
			<div className="loadHeader">
				<div className="loadId">{thisLoad?.number?.toString()}</div>
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
