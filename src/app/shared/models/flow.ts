import { Operation } from "./operation";

export interface Flow {
    uid: string;
    id: number;
    name: string;
    description: string;
    status: number;
    type: number;
    operations: Operation[];
    dateModified: Date;

    statusname: string;
    typename: string;
}