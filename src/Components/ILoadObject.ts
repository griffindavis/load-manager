import IJumperObject from './IJumperObject';

export enum LoadType {
	high,
	low,
}
export default interface ILoadObject extends ILoadObjectStorable {
	jumperList: IJumperObject[];
}

export interface ILoadObjectStorable {
	id: string;
	number: number;
	type: LoadType;
}