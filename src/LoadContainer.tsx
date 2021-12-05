import Load from './Load';

function LoadContainer() {
    return (
        <div className='loadContainer'>
            <Load id='1' key={'1'}/>
            <Load id='2' key={'2'}/>
            <Load id='3' key={'3'}/>
            <Load id='4' key={'4'}/>
            <Load id='5' key={'5'}/>
        </div>
    )
}

export default LoadContainer;