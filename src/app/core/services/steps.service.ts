import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/configs/app-settings.config';
import { Step } from 'src/app/shared/models/step';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${AppSettings.defaultBackendDevelopUrl}/steps`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class StepService {

  constructor(private http: HttpClient) { }

  getSteps(): Observable<Step[]> {
    const url = `${apiUrl}`;
    return this.http.get<Step[]>(url)
      .pipe(
        tap(productLevels => console.log('Fetch Steps')),
        catchError(this.handleError<Step[]>('getSteps'))
      );
  }

  getStep(id: number): Observable<Step> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Step>(url).pipe(
      tap(_ => console.log('fetched Step id=${id}')),
      catchError(this.handleError<Step>('getStep id=${id}'))
    );
  }

  addStep(step: any): Observable<Step> {
    return this.http.post<Step>(apiUrl, step, httpOptions).pipe(
      tap((step: Step) => console.log('added')),
      catchError(this.handleError<Step>('addStep'))
    );
  }

  updateStep(step: any): Observable<Step> {
    return this.http.put<Step>(apiUrl, step, httpOptions).pipe(
      tap((step: Step) => console.log('updated')),
      catchError(this.handleError<Step>('addStep'))
    );
  }

  deleteStep(id: any): Observable<Step> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Step>(url, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<Step>('deleteStep'))
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