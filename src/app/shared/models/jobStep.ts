import { Shift } from "./shift";
import { Staff } from "./staff";

export interface JobStep {
    jobId: number;
    stepId: number;
    inputInfo: string;
    inputNumber: number;
    outputInfo: string;
    outputNumber: number;
    workerId: number;
    worker: Staff;
    shiftId: number;
    shift: Shift;
    estimationInSeconds: number;
    startTime: Date;
    endTime: Date;
    stepStatus: number;
}