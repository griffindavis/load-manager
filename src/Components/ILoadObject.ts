import IJumperObject from './IJumperObject';

export enum LoadType {
	high,
	low,
}
export default interface ILoadObject {
	jumperList: IJumperObject[];
	id: string;
	number: number;
	type: LoadType;
}
