import { Step } from "./step";

export interface PaggedDataStep {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
    data: Step[];
    succeeded: boolean;
    errors: any;
    message: string;
}