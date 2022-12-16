import { JobStep } from "./jobStep";
import { Note } from "./note";

export interface JobStepDto {
    jobStep: JobStep;
    notes: Note[];

    noteDescriptions: string;
}