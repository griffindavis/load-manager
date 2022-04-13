import IJumperObject from './IJumperObject';

export enum LoadType {
	high,
	low,
}
export default interface ILoadObject {
	id: string;
	number: number;
	jumperList: IJumperObject[];
	type: LoadType;
}
