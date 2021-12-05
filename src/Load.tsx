/* eslint-disable react-hooks/exhaustive-deps */
import { BaseSyntheticEvent, useEffect, useState } from "react";
import IJumperObject from './IJumperObject';

function Load(props: { id: string }) {
    const [jumperList, setJumpers] = useState<IJumperObject[]>([]);
    const LOCAL_STORAGE_KEY = 'load' + props.id + '.jumperList';

    useEffect(() => {
        const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || ''
        if (storedJSON === '') return;
        setJumpers(JSON.parse(storedJSON));
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


    return (
        <div className="load card" onDrop={(event) => {
            event.preventDefault();
            const newId=event.dataTransfer?.getData('text/id');
            const newName=event.dataTransfer?.getData('text/name')
            setJumpers(prevJumpers => {
                return[...prevJumpers, {id: newId, name: newName}]
            });
        }} onDragOver={(event) => {
            event.preventDefault();
        }}>
            <div className="loadId" >
                {props.id}
            </div>
            
            <div className="jumperList">
                <ul> 
               {jumperList === undefined ? '' : jumperList.map(jumper => { // TODO: create a new component
                   return (<span  className='jumper card'>
                       <div className="hide">{jumper.id}</div>
                       <li>{jumper.name}</li>
                       <div className="cancel" onClick={handleCancel}>X</div>
                   </span>)
               })}
               </ul>
            </div>
        </div>
    )
}

export default Load;