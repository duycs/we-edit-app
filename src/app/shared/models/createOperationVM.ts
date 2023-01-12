import { Setting } from "./setting";

export interface CreateOperationVM {
    flowId: number;
    type: number;
    name: string;
    description: string;
    executionName: string;
    settings?: Setting[];
}