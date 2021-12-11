import { useEffect, useRef, useState } from 'react';
import Load from './Load';
import { v4 as uuidv4 } from 'uuid';
import IJumperObject from './IJumperObject';

interface ILoadObject  {
    id: string
    number: number
    jumperList: IJumperObject[]
} 

function LoadContainer() {

    const [loadList, setLoadList] = useState<ILoadObject[]>([]);
    const LOCAL_STORAGE_KEY = 'loadList';
    const scrollToRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || ''
        if (storedJSON === '') return;
        setLoadList(JSON.parse(storedJSON));
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loadList))
    }, [loadList]);

    function handleOnDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const newId=event.dataTransfer?.getData('text/id');
        const newName=event.dataTransfer?.getData('text/name')

        setLoadList(previousLoads => {
            return[...previousLoads, {id: uuidv4().toString(), number: loadList.length+1, jumperList: [{id: newId, name: newName}]}]
        });
        setTimeout(() => { // have to have a short timeout to make this actually work
            scrollToRef?.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }, 100);
        
    }

    function handleOnDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
    }

    function removeLoad(id: string) {
        let count = 0;
        loadList.forEach(load => { // update the load count
            if (load.id === id) return;
            count++;
            load.number = count;
        })
        setLoadList(loadList.filter(load => {
            return load.id !== id;
        }))
        
    }

    return (
        <>
            <div className='loadContainer' 
                onDragOver={handleOnDragOver}
                onDrop={handleOnDrop}>
                
                {loadList.map(load => {
                    return (
                        <Load id={load.id} number={load.number} key={load.id} initialJumperList={load.jumperList} removeLoad={removeLoad}/>
                    )
                })}
                <div ref={scrollToRef} className="scrollTo"></div>
            </div>
        </>
    )
}

export default LoadContainer;