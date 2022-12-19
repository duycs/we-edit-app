import { Note } from "./note";
import { NoteDto } from "./noteDto";

export interface PaggedDataNote {
    pageNumber: number;
    pageSize: number;
    firstPage: string;
    lastPage: string;
    totalPages: number;
    totalRecords: number;
    nextPage: number;
    previousPage: number;
    data: NoteDto[];
    succeeded: boolean;
    errors: any;
    message: string;
}