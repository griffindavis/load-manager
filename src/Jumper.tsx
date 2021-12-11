/* eslint-disable react-hooks/exhaustive-deps */

import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import IJumperObject from './IJumperObject';

function Jumper( props: {key: string, jumper: IJumperObject, removeJumper: (e: SyntheticEvent) => void, filters: {
    video: boolean;
    instructor: boolean;
    student: boolean;
}}) {
    const LOCAL_STORAGE_KEY = `jumper.${props.jumper.id}`
    const [data, setData] = useState(props.jumper);
    const isMounted = useRef(false); // used to prevent useEffect from overwriting the stored data
    useEffect(() => { // maintain the state of the data
        if (!isMounted.current) { // so we don't overwrite the localstorage
            isMounted.current = true;
            return;
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }, [data])

    useEffect(() => { // get the localstorage on initial load
        const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || ''
        if (storedJSON === '') return
        setData(JSON.parse(storedJSON));
    }, [])

    function handleTypeSelection(e: SyntheticEvent) { // updating the jumpers attributes
        switch(e.currentTarget.getAttribute('data-type')) {
            case 'video':
                setData({
                    ...data,
                    isVideographer: !data.isVideographer
                })
                break;
            case 'instructor':
                setData({
                    ...data,
                    isInstructor: !data.isInstructor
                })
                break;
            case 'student':
                setData({
                    ...data,
                    isStudent: !data.isStudent
                })
                break;
        }
        // make sure the right buttons are selected
        const classList = e.currentTarget.classList;
        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            classList.add('selected');
        }
    }

    function handleClick(e: SyntheticEvent) { // event handler for displaying additional details on a jumper
        const classList = e.currentTarget.nextElementSibling?.classList;
        if (classList === undefined) {

        }
        else if (classList.contains('expanded')) {
            classList.remove('expanded')
        }
        else {
            classList.add('expanded')
        }
    }

    function isFiltered(): boolean { // don't render if filtered out
        if (props.filters.instructor && !data.isInstructor) return true;
        if (props.filters.video && !data.isVideographer) return true;
        if (props.filters.student && !data.isStudent) return true;
        return false;
    }
    
    return (
        <>
            <span className={`jumper card ${isFiltered() ? 'hide' : ''}`} draggable='true' onDragStart={(event) => {
                event.dataTransfer.setData('text/id', data.id);
                event.dataTransfer.setData('text/name', data.name);
            }} 
            onClick={handleClick}>
                <div className='header'>{data.name}</div>
            <div className="cancel" onClick={props.removeJumper}
            data-id={data.id}>X</div>
            </span>


            <div className="dropdown details">
                <div className="dropdown-menu">
                    <span className='dropdown-button'>
                        <i className={`fas fa-video faImage ${data.isVideographer ? 'selected' : ''}`} onClick={handleTypeSelection}
                        data-type='video'></i>
                    </span>
                    <span className='dropdown-button'>
                        <i className={`fas fa-chalkboard-teacher faImage ${data.isInstructor ? 'selected' : ''}`} onClick={handleTypeSelection}
                        data-type='instructor'></i>
                    </span>
                    <span className='dropdown-button'>
                        <i className={`fas fa-users faImage ${data.isStudent ? 'selected' : ''}`} onClick={handleTypeSelection}
                        data-type='student'></i>
                    </span>
                </div>
            </div>
        </>
    )
}

export default Jumper;