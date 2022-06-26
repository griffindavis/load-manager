export default interface IUserInfo {
	id: string;
	name: string;
	isCheckedIn: boolean;
	canRemoveJumpers?: boolean;
	canRemoveLoads?: boolean;
	jumper?: string;
}