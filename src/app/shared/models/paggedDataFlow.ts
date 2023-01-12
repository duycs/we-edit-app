import { Flow } from "./flow";

export interface PaggedDataFlow {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
    data: Flow[];
    succeeded: boolean;
    errors: any;
    message: string;
}