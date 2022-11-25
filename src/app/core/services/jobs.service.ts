import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AppSettings } from 'src/app/configs/app-settings.config';
import { Job } from 'src/app/shared/models/job';
import { CreateJobVM } from 'src/app/shared/models/createJobVM';
import { JobStep } from 'src/app/shared/models/jobStep';
import { PaggedDataJob } from 'src/app/shared/models/paggedDataJob';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${AppSettings.defaultBackendDevelopUrl}/jobs`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class JobService {

  constructor(private http: HttpClient) { }

  getJobs(page: number = 1, size: number = sizeDefault, isInclude: boolean = true)
    : Observable<PaggedDataJob> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}`;
    return this.http.get<PaggedDataJob>(url)
      .pipe(
        tap(paggedJobData => console.log('Fetch paggedJobData')),
        catchError(this.handleError<PaggedDataJob>('getJobs'))
      );
  }

  getJob(id: number): Observable<Job> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Job>(url).pipe(
      tap(_ => console.log('fetched job id=${id}')),
      catchError(this.handleError<Job>('getJob id=${id}'))
    );
  }

  addJob(createJobVM: any): Observable<CreateJobVM> {
    return this.http.post<CreateJobVM>(apiUrl, createJobVM, httpOptions).pipe(
      tap((createJobVM: CreateJobVM) => console.log('added job w/ id=${createJobVM.id}')),
      catchError(this.handleError<CreateJobVM>('addJob'))
    );
  }

  deleteJob(id: any): Observable<Job> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Job>(url, httpOptions).pipe(
      tap(_ => console.log('deleted job id=${id}')),
      catchError(this.handleError<Job>('deleteJob'))
    );
  }

  getJobSteps(id: number): Observable<JobStep> {
    const url = `${apiUrl}/${id}/jobsteps`;
    return this.http.get<JobStep>(url).pipe(
      tap(_ => console.log('fetched JobSteps job=${id}')),
      catchError(this.handleError<JobStep>('getJobSteps job id=${id}'))
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