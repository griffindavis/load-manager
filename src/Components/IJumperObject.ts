import { v4 as uuidv4 } from 'uuid';

interface IJumperObject {
    id: string,
    name: string,
    isVideographer?: boolean,
    isInstructor?: boolean,
    isStudent?: boolean
}

export function createNewJumper(): IJumperObject {
    return {
        id: uuidv4().toString(),
        name: ''
    }
}

export default IJumperObject;