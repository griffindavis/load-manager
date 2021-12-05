import { useState, useRef, useEffect, SyntheticEvent, KeyboardEvent } from 'react';
import Jumpers from './Jumpers';
import IJumperObject from './IJumperObject';
import { v4 as uuidv4 } from 'uuid';

const LOCAL_STORAGE_KEY = 'jumperList.jumpers'


function JumperList() {
    const [jumpers, setJumpers] = useState<IJumperObject[]>([])
    const jumperNameRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (jumpers.length < 1) return
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jumpers))
        console.log(jumpers)
    }, [jumpers])

    useEffect(() => {
        const storedJSON: string = localStorage.getItem(LOCAL_STORAGE_KEY) || ''
        if (storedJSON === '') return
        const storedJumpers = JSON.parse(storedJSON)
        console.log(storedJumpers)
        if (storedJumpers !== '') {
            setJumpers(storedJumpers)
        }
    }, [])

    function handleAddJumper(e: SyntheticEvent) {
        let name: string = '';
        if (jumperNameRef?.current?.value === null) {
            return;
        }
        if (jumperNameRef === null) {
            
        }
        else {
            if (jumperNameRef.current === null) {

            }
            else {
                name = jumperNameRef.current.value;
                jumperNameRef.current.value = '';
            }
        }
        if (name === '') {
            return;
        }
        setJumpers(prevJumpers => {
            return [...prevJumpers, {id: uuidv4().toString(), name: name}]
        })
    }

    function handleClear() {
        setJumpers([])
        localStorage.setItem(LOCAL_STORAGE_KEY, '')
    }

    function handleKeyDown (e: KeyboardEvent) {
        if (e.key === 'Enter') {
            document.getElementById('AddJumper')?.click()
        }
    }

    return (
        <div className='jumperListSection'>
            <h1>Jumper List</h1>
            <Jumpers list = {jumpers}/>
            <div className='jumperListInputContainer'>
                <input ref={jumperNameRef} onKeyDown={handleKeyDown} type="text" className='margin' /> 
                <button id="AddJumper" className='margin' onClick={handleAddJumper}>Add</button>
                <button onClick = {handleClear} className='margin'>Clear All</button>
            </div>
            <p>There are {jumpers.length} jumpers!</p>
        </div>
    )
}

export default JumperList;