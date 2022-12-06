import { ProductLevel } from "./productLevel";

export interface PaggedDataProductLevel {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
    data: ProductLevel[];
    succeeded: boolean;
    errors: any;
    message: string;
}