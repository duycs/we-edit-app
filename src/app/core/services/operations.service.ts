import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Staff } from 'src/app/shared/models/staff';
import { environment } from 'src/environments/environment';
import { CreateOperationVM } from 'src/app/shared/models/createOperationVM';
import { Operation } from 'src/app/shared/models/operation';
import { UpdateOperationVM } from 'src/app/shared/models/updateOperationVM';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/operations`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private http: HttpClient) { }

  getOperations(page: number = 1, size: number = sizeDefault, searchValue: string = "", isInclude: boolean = true)
    : Observable<Operation[]> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
    return this.http.get<Operation[]>(url)
      .pipe(
        tap(() => console.log('Fetch getOperations')),
        catchError(this.handleError<Operation[]>('getOperations'))
      );
  }

  getOperation(id: any, isInclude: boolean = true): Observable<Operation> {
    const url = `${apiUrl}/${id}?isInclude=${isInclude}`;

    return this.http.get<Operation>(url)
      .pipe(
        tap(_ => console.log('fetched Operation id=${id}')),
        catchError(this.handleError<Operation>('getOperation id=${id}'))
      );
  }

  addOperation(createOperationVM: CreateOperationVM): Observable<Operation> {
    return this.http.post<Operation>(apiUrl, createOperationVM, httpOptions).pipe(
      tap(() => console.log('added')),
      catchError(this.handleError<Operation>('addOperation'))
    );
  }

  updateOperation(updateOperation: UpdateOperationVM): Observable<Operation> {
    return this.http.put<Operation>(apiUrl, updateOperation, httpOptions).pipe(
      tap((operation: Operation) => console.log('updated')),
      catchError(this.handleError<Operation>('updateOperation'))
    );
  }

  deleteOperation(id: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<any>(url, httpOptions).pipe(
      tap(_ => console.log('deleted Operation id=${id}')),
      catchError(this.handleError<Staff>('deleteOperation'))
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