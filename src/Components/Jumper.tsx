/* eslint-disable react-hooks/exhaustive-deps */

import { SyntheticEvent } from 'react';
import IJumperObject from './IJumperObject';

function Jumper(props: {
	key: string;
	jumper: IJumperObject;
	removeJumper?: (e: SyntheticEvent) => void;
	filters?: {
		video: boolean;
		instructor: boolean;
		student: boolean;
	};
	fromPopup?: boolean;
	setLoadToUpdate?: React.Dispatch<
		React.SetStateAction<{
			load?: string | undefined;
			jumper?: IJumperObject | undefined;
		}>
	>;
}) {
	const fromPopup = props.fromPopup;
	const data = props.jumper;

	/**
	 * Handles jumper type filtering
	 * @param e -the js event
	 */
	function handleTypeSelection(e: SyntheticEvent) {
		// updating the jumpers attributes
		switch (
			e.currentTarget.getAttribute('data-type')
			//TODO: this should be a different editor
		) {
		}
		// make sure the right buttons are selected
		const classList = e.currentTarget.classList; // TODO: is it better to do DOM manipulation or to use a reference
		if (classList.contains('selected')) {
			classList.remove('selected');
		} else {
			classList.add('selected');
		}
	}

	/**
	 * Handles clicking on an individual jumper
	 * @param e - the js event
	 */
	function handleClick(e: SyntheticEvent) {
		// event handler for displaying additional details on a jumper
		//TODO: handle this differently
		const classList = e.currentTarget.nextElementSibling?.classList;
		if (classList === undefined) {
		} else if (classList.contains('expanded')) {
			classList.remove('expanded');
		} else {
			classList.add('expanded');
		}
	}

	/**
	 * Determines whether this jumper is filtered from the list
	 * @returns - true or false
	 */
	function isFiltered(): boolean {
		// don't render if filtered out
		if (props.filters?.instructor && !data.isInstructor) return true;
		if (props.filters?.video && !data.isVideographer) return true;
		if (props.filters?.student && !data.isStudent) return true;
		return false;
	}

	/**
	 * Handles setting the data to add a jumper to the load from the add jumper popup
	 */
	function handleAddJumperByClick() {
		if (props.setLoadToUpdate !== undefined) {
			props.setLoadToUpdate((previous) => {
				return { load: previous.load, jumper: props.jumper };
			});
		}
	}

	/**
	 * Constructs the html for a simple jumper for the add jumper popup
	 * @returns the html for a simple jumper
	 */
	function simpleJumper() {
		return (
			<span className="item card" onClick={handleAddJumperByClick}>
				<div className="header">{data.name}</div>
			</span>
		);
	}

	/**
	 * Displays the complex jumper field for the jumper list on full screens
	 * @returns The html for displaying a complex jumper field
	 */
	function complexJumper() {
		return (
			<>
				<span
					className={`jumper card ${isFiltered() ? 'hide' : ''} ${
						fromPopup ? 'item' : ''
					}`}
					draggable="true"
					onDragStart={(event) => {
						event.dataTransfer.setData('text/jumper', JSON.stringify(data));
					}}
					onClick={handleClick}
				>
					<div className="header">{data.name}</div>
					<div
						className="cancel"
						onClick={props.removeJumper}
						data-id={data.id}
					>
						X
					</div>
				</span>

				<div className="dropdown details">
					<div className="dropdown-menu">
						<span className="dropdown-button">
							<i
								className={`fas fa-video faImage ${
									data.isVideographer ? 'selected' : ''
								}`}
								onClick={handleTypeSelection}
								data-type="video"
							></i>
						</span>
						<span className="dropdown-button">
							<i
								className={`fas fa-chalkboard-teacher faImage ${
									data.isInstructor ? 'selected' : ''
								}`}
								onClick={handleTypeSelection}
								data-type="instructor"
							></i>
						</span>
						<span className="dropdown-button">
							<i
								className={`fas fa-users faImage ${
									data.isStudent ? 'selected' : ''
								}`}
								onClick={handleTypeSelection}
								data-type="student"
							></i>
						</span>
					</div>
				</div>
			</>
		);
	}

	// Determine which type jumper to render
	return <>{fromPopup ? simpleJumper() : complexJumper()}</>;
}

export default Jumper;
