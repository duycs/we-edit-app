import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { AppSettings } from 'src/app/configs/app-settings.config';
import { Job } from 'src/app/shared/models/job';
import { CreateJobVM } from 'src/app/shared/models/createJobVM';
import { JobStep } from 'src/app/shared/models/jobStep';
import { PaggedDataJob } from 'src/app/shared/models/paggedDataJob';
import { RemoveStepsFromJobVM } from 'src/app/shared/models/removeStepsFromJobVM';
import { AssignStaffToStepVM } from 'src/app/shared/models/assignStaffToStepVM';
import { UpdateJobStatusVM } from 'src/app/shared/models/updateJobStatusVM';
import { AddStepsToJobVM } from 'src/app/shared/models/addStepsToJobVM';

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

  getJobs(page: number = 1, size: number = sizeDefault, searchValue: string = '', isInclude: boolean = true)
    : Observable<PaggedDataJob> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
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

  addJob(createJobVM: CreateJobVM): Observable<Job> {
    console.log(createJobVM);
    return this.http.post<Job>(apiUrl, createJobVM, httpOptions).pipe(
      tap((job: Job) => console.log('added')),
      catchError(this.handleError<Job>('addJob'))
    );
  }

  deleteJob(id: any): Observable<Job> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Job>(url, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<Job>('deleteJob'))
    );
  }

  getJobSteps(id: number): Observable<JobStep[]> {
    const url = `${apiUrl}/${id}/jobsteps`;
    return this.http.get<JobStep[]>(url).pipe(
      tap(_ => console.log('fetched JobSteps of staff =${id}')),
      catchError(this.handleError<JobStep[]>('getJobSteps'))
    );
  }

  addStepsToJob(addStepsToJobVM: AddStepsToJobVM): Observable<JobStep> {
    const url = `${apiUrl}/steps`
    return this.http.post<JobStep>(url, addStepsToJobVM, httpOptions).pipe(
      tap((jobStep: JobStep) => console.log('added')),
      catchError(this.handleError<JobStep>('addStepsToJob'))
    );
  }

  removeStepsFromJob(removeStepsFromJobVM: RemoveStepsFromJobVM): Observable<any> {
    const url = `${apiUrl}/steps`;
    return this.http.put<any>(url, removeStepsFromJobVM, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<any>('RemoveStepsFromJob'))
    );
  }

  assignStaffToStep(assignStaffToStepVM: any): Observable<AssignStaffToStepVM> {
    const url = `${apiUrl}/assign`
    return this.http.put<AssignStaffToStepVM>(url, assignStaffToStepVM, httpOptions).pipe(
      tap((assignStaffToStepVM: AssignStaffToStepVM) => console.log('added')),
      catchError(this.handleError<AssignStaffToStepVM>('assignStaffToStep'))
    );
  }

  autoAssignStaffToStep(nothing: any): Observable<JobStep> {
    const url = `${apiUrl}/auto-assign`
    return this.http.post<JobStep>(url, nothing, httpOptions).pipe(
      tap((jobStep: JobStep) => console.log('added')),
      catchError(this.handleError<JobStep>('autoAssignStaffToStep'))
    );
  }

  updateJobStatus(updateJobStatusVM: any): Observable<UpdateJobStatusVM> {
    const url = `${apiUrl}/assign`
    return this.http.put<UpdateJobStatusVM>(url, updateJobStatusVM, httpOptions).pipe(
      tap((updateJobStatusVM: UpdateJobStatusVM) => console.log('updated')),
      catchError(this.handleError<UpdateJobStatusVM>('UpdateJobStatus'))
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