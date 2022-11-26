import { Staff } from "./staff";

export interface PaggedDataStaff {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
    data: Staff[];
    succeeded: boolean;
    errors: any;
    message: string;
}