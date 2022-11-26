import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AppSettings } from 'src/app/configs/app-settings.config';
import { Job } from 'src/app/shared/models/job';
import { CreateJobVM } from 'src/app/shared/models/createJobVM';
import { JobStep } from 'src/app/shared/models/jobStep';
import { PaggedDataJob } from 'src/app/shared/models/paggedDataJob';
import { ProductLevel } from 'src/app/shared/models/productLevel';
import { Note } from 'src/app/shared/models/note';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${AppSettings.defaultBackendDevelopUrl}/notes`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private http: HttpClient) { }

  getNotes(): Observable<Note> {
    const url = `${apiUrl}`;
    return this.http.get<Note>(url)
      .pipe(
        tap(notes => console.log('Fetch Notes')),
        catchError(this.handleError<Note>('getNotes'))
      );
  }

  getNote(id: number): Observable<Note> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Note>(url).pipe(
      tap(_ => console.log('fetched Note id=${id}')),
      catchError(this.handleError<Note>('getNote id=${id}'))
    );
  }

  addNote(productLevel: any): Observable<Note> {
    return this.http.post<Note>(apiUrl, productLevel, httpOptions).pipe(
      tap((note: Note) => console.log('added')),
      catchError(this.handleError<Note>('addNote'))
    );
  }

  updateNote(note: any): Observable<Note> {
    return this.http.put<Note>(apiUrl, note, httpOptions).pipe(
      tap((note: Note) => console.log('updated')),
      catchError(this.handleError<Note>('addNote'))
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