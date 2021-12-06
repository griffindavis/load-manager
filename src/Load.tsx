/* eslint-disable react-hooks/exhaustive-deps */
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import IJumperObject from './IJumperObject';

function Load(props: { id: string, number?: number, initialJumperList: IJumperObject[], removeLoad: (id: string) => void },  key: string) {
    const [jumperList, setJumpers] = useState<IJumperObject[]>([]);
    const LOCAL_STORAGE_KEY = 'load' + props.id + '.jumperList';

    useEffect(() => {
        const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || ''
        if (storedJSON.length === 0) {
            // this is the case when we create a new load
            setJumpers(props.initialJumperList);
        }
        else {
            setJumpers(JSON.parse(storedJSON));
        }
        
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jumperList))
    }, [jumperList]);

    function handleCancel(e: BaseSyntheticEvent) {
        const id = e.target.offsetParent.firstChild.innerText;
        setJumpers(jumperList.filter(entry => {
            return entry.id !== id;
        }));
    }

    function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const newId=event.dataTransfer?.getData('text/id');
        const newName=event.dataTransfer?.getData('text/name')
        setJumpers(prevJumpers => {
            return[...prevJumpers, {id: newId, name: newName}]
        });
        event.stopPropagation();
    }

    function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    function handleLoadDelete() {
        props.removeLoad(props.id)
    }

    return (
        <div className="load card" 
            onDrop={handleOnDrop} 
            onDragOver={handleOnDragOver}>
            <div className="loadId" >
                {props.number?.toString()}
            </div>
            
            <div className="jumperList">
                <ul> 
               {jumperList === undefined ? '' : jumperList.map(jumper => { // TODO: create a new component
                   return (<span  className='jumper card'  key={jumper.id}>
                       <div className="hide">{jumper.id}</div>
                       <li>{jumper.name}</li>
                       <div className="cancel" onClick={handleCancel}>X</div>
                   </span>)
               })}
               </ul>
            </div>
            <button onClick={handleLoadDelete}>Delete</button>
        </div>
    )
}

export default Load;