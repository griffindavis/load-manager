
import IJumperObject from './IJumperObject';

function Jumper( props: {key: string, jumper: IJumperObject} ) {
    
    return (
        <div className='jumper card' draggable='true' onDragStart={(event) => {
            event.dataTransfer.setData('text/id', props.jumper.id);
            event.dataTransfer.setData('text/name', props.jumper.name);
        }}>{props.jumper.name}</div>
    )
}

export default Jumper;