import { SyntheticEvent } from "react";


function JumperNavBar(props: {setFilters: React.Dispatch<React.SetStateAction<{
    video: boolean;
    instructor: boolean;
    student: boolean;
}>>, filters: { [key: string]: boolean
    video: boolean;
    instructor: boolean;
    student: boolean;
}}) {
        function handleClick(e: SyntheticEvent) {
        const dataType = e.currentTarget.getAttribute('data-type');
        const classList = e.currentTarget.classList;
        if (classList.contains('selected')) {
            classList.remove('selected');
        }
        else {
            classList.add('selected');
        }
        if (dataType !== null && dataType in props.filters) {

            props.setFilters({
                ...props.filters,
                [dataType]: !props.filters[dataType]
            })
        }
    }

    return (
        <div className='filterContainer'>
            <div className="filter" >
                <i className="fas fa-video faImage" data-type='video' onClick={handleClick}></i>
            </div>
            <div className="filter"  >
                <i className="fas fa-chalkboard-teacher faImage" data-type='instructor' onClick={handleClick}></i>
            </div>
            <div className="filter"  >
                <i className="fas fa-users faImage" data-type='student' onClick={handleClick}></i>
            </div>
        </div>
    )
}

export default JumperNavBar;