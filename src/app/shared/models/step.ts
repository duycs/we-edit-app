import { ProductLevel } from "./productLevel";

export interface Step {
    id: number;
    name: string;
    code: string;
    orderNumber: number;
    productLevelId: number;
    groupId: number;
    estimationInSeconds: number;

    groupname: string;
}