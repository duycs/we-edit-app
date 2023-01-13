import { Setting } from "./setting";

export interface UpdateOperationVM {
    id: number;
    flowId: number;
    type: number;
    name: string;
    description: string;
    executionName: string;
    firstRoute: boolean;
}