export interface CreateJobVM {
    date: Date;
    locationId: number;
    csoStaffId: number;
    jobName: string;
    code: string;
    instruction: string;
    inputInfo: string;
    inputNumber: number;
    deliverTypeId: number;
    productLevelId: number;
    deadline: Date;
    appId: number;
}