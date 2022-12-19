import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/configs/app-settings.config';
import { Note } from 'src/app/shared/models/note';
import { UpdateNoteVM } from 'src/app/shared/models/updateNoteVM';
import { CreateNoteVM } from 'src/app/shared/models/createNoteVM';
import { PaggedDataJob } from 'src/app/shared/models/paggedDataJob';
import { PaggedDataNote } from 'src/app/shared/models/paggedDataNote';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${AppSettings.API_URL}/notes`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  getNotesByObjectIds(objectIds: number[]): Observable<Note> {
    const url = `${apiUrl}`;
    return this.http.get<Note>(url)
      .pipe(
        tap(notes => console.log('Fetch Notes')),
        catchError(this.handleError<Note>('getNotes'))
      );
  }

  getNotes(page: number = 1, size: number = sizeDefault, objectName: string = '', objectIds: number[], searchValue: string = '', isInclude: boolean = true)
    : Observable<PaggedDataNote> {
    let params: any = {
      pageNumber: page,
      pageSize: size,
      isInclude: isInclude,
      searchValue: searchValue,
      objectName: objectName,
      objectIds: objectIds
    };

    console.log("params", params);
    
    return this.http.get<PaggedDataNote>(apiUrl, { params: params })
      .pipe(
        tap(paggedJobData => console.log('Fetch PaggedDataNote')),
        catchError(this.handleError<PaggedDataNote>('getNotes'))
      );
  }

  getNote(id: number): Observable<Note> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Note>(url).pipe(
      tap(_ => console.log('fetched Note id=${id}')),
      catchError(this.handleError<Note>('getNote id=${id}'))
    );
  }

  addNote(createNoteVM: CreateNoteVM): Observable<Note> {
    return this.http.post<Note>(apiUrl, createNoteVM, httpOptions).pipe(
      tap((note: Note) => console.log('added')),
      catchError(this.handleError<Note>('addNote'))
    );
  }

  updateNote(updateNoteVM: UpdateNoteVM): Observable<Note> {
    return this.http.put<Note>(apiUrl, updateNoteVM, httpOptions).pipe(
      tap((note: Note) => console.log('updated')),
      catchError(this.handleError<Note>('updateNote'))
    );
  }

  deleteNote(id: any): Observable<Note> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Note>(url, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<Note>('deleteNote'))
    );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}