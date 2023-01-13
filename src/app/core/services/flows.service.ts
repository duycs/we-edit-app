import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Staff } from 'src/app/shared/models/staff';
import { AddRolesForStaffVM } from 'src/app/shared/models/addRolesForStaffVM';
import { RemoveRolesForStaffVM } from 'src/app/shared/models/removeRolesForStaffVM';
import { environment } from 'src/environments/environment';
import { PaggedDataFlow } from 'src/app/shared/models/paggedDataFlow';
import { Flow } from 'src/app/shared/models/flow';
import { CreateFlowVM } from 'src/app/shared/models/createFlowVM';
import { UpdateFlowVM } from 'src/app/shared/models/updateFlowVM';
import { CreateOperationVM } from 'src/app/shared/models/createOperationVM';
import { RemoveOperationFromFlowVM } from 'src/app/shared/models/removeOperationFromFlowVM';
import { InstantFlowVM } from 'src/app/shared/models/instantFlowVM';
import { InvokeResult } from 'src/app/shared/models/invokeResult';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${environment.apiUrl}/flows`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class FlowService {

  constructor(private http: HttpClient) { }

  getFlows(page: number = 1, size: number = sizeDefault, searchValue: string = "", isInclude: boolean = true)
    : Observable<PaggedDataFlow> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
    return this.http.get<PaggedDataFlow>(url)
      .pipe(
        tap(() => console.log('Fetch PaggedDataFlow')),
        catchError(this.handleError<PaggedDataFlow>('getFlows'))
      );
  }

  getFlow(id: any): Observable<Flow> {
    const url = `${apiUrl}/${id}`;

    return this.http.get<Flow>(url)
      .pipe(
        tap(_ => console.log('fetched flow id=${id}')),
        catchError(this.handleError<Flow>('getFlow id=${id}'))
      );
  }

  getFlowSync(id: any): Promise<any> {
    return this.getFlow(id).toPromise();
  }

  addFlow(createFlowVM: CreateFlowVM): Observable<Flow> {
    return this.http.post<Flow>(apiUrl, createFlowVM, httpOptions).pipe(
      tap((flow: Flow) => console.log('added')),
      catchError(this.handleError<Flow>('addFlow'))
    );
  }

  updateFlow(updateFlowVM: UpdateFlowVM): Observable<Flow> {
    return this.http.put<Flow>(apiUrl, updateFlowVM, httpOptions).pipe(
      tap((flow: Flow) => console.log('updated')),
      catchError(this.handleError<Flow>('updateFlow'))
    );
  }

  deleteFlow(id: any): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<any>(url, httpOptions).pipe(
      tap(_ => console.log('deleted flow id=${id}')),
      catchError(this.handleError<Staff>('deleteFlow'))
    );
  }

  instantFlow(instantFlowVM: InstantFlowVM): Observable<InvokeResult> {
    let url = `${apiUrl}/instant`;
    return this.http.post<InvokeResult>(url, instantFlowVM, httpOptions).pipe(
      tap((data: InvokeResult) => console.log(`updated instantFlow ${data.success}, ${data.message}`)),
      catchError(this.handleError<InvokeResult>('instantFlow'))
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