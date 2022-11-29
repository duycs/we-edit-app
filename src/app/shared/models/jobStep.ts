import { Job } from "./job";
import { Shift } from "./shift";
import { Staff } from "./staff";
import { Step } from "./step";

export interface JobStep {
    jobId: number;
    job: Job;
    stepId: number;
    step: Step;
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
    status: number;
}