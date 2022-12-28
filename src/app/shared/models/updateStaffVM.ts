export interface UpdateStaffVM {
    staffId: number;
    fullname: string;
    account: string;
    roleIds: number[];
    groupIds: number[];
    productLevelIds: number[];
}