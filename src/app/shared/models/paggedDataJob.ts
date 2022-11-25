import { Job } from "./job";

export interface PaggedDataJob {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
    data: Job[];
    succeeded: boolean;
    errors: any;
    message: string;
}