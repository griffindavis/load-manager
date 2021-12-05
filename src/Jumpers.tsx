import IJumperObject from './IJumperObject';
import Jumper from './Jumper';

function Jumpers(props: { list: IJumperObject[] }) {
    return (
        <div className='jumperListContainer'>
            {props.list.map(jumper => {
                return <Jumper key={jumper.id} jumper={jumper}/>
            })
        }
        </div>
    )
}

export default Jumpers;