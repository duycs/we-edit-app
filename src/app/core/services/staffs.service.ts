import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppSettings } from 'src/app/configs/app-settings.config';
import { PaggedDataStaff } from 'src/app/shared/models/paggedDataStaff';
import { Staff } from 'src/app/shared/models/staff';
import { CreateStaffVM } from 'src/app/shared/models/createStaffVM';
import { AddRolesForStaffVM } from 'src/app/shared/models/addRolesForStaffVM';
import { RemoveRolesForStaffVM } from 'src/app/shared/models/removeRolesForStaffVM';
import { AddProductLevelForStaffVM } from 'src/app/shared/models/addProductLevelForStaffVM';
import { RemoveProdutLevelsForStaffVM } from 'src/app/shared/models/removeProdutLevelsForStaffVM';
import { StaffInShiftVM } from 'src/app/shared/models/staffInShiftVM';
import { StaffOutShiftVM } from 'src/app/shared/models/staffOutShiftVM';
import { JobStep } from 'src/app/shared/models/jobStep';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${AppSettings.defaultBackendDevelopUrl}/staffs`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient) { }

  getAllStaffs(page: number = 0, size: number = 0, searchValue: string = "", isInclude: boolean = true)
    : Observable<Staff[]> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
    return this.http.get<Staff[]>(url)
      .pipe(
        tap(paggedDataStaff => console.log('Fetch paggedDataStaff')),
        catchError(this.handleError<Staff[]>('getStaffs'))
      );
  }

  getStaffs(page: number = 1, size: number = sizeDefault, searchValue: string = "", isInclude: boolean = true)
    : Observable<PaggedDataStaff> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
    return this.http.get<PaggedDataStaff>(url)
      .pipe(
        tap(paggedDataStaff => console.log('Fetch paggedDataStaff')),
        catchError(this.handleError<PaggedDataStaff>('getStaffs'))
      );
  }

  getStaff(id: number): Observable<Staff> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Staff>(url).pipe(
      tap(_ => console.log('fetched staff id=${id}')),
      catchError(this.handleError<Staff>('getStaff id=${id}'))
    );
  }

  getJobStepsOfStaff(id: number): Observable<JobStep[]> {
    const url = `${apiUrl}/${id}/jobSteps`;
    return this.http.get<JobStep[]>(url).pipe(
      tap(_ => console.log('fetched jobSteps of staff id=${id}')),
      catchError(this.handleError<JobStep[]>('getJobStepsOfStaff id=${id}'))
    );
  }


  addStaff(createStaffVM: CreateStaffVM): Observable<Staff> {
    return this.http.post<Staff>(apiUrl, createStaffVM, httpOptions).pipe(
      tap((staff: Staff) => console.log('added')),
      catchError(this.handleError<Staff>('addStaff'))
    );
  }

  deleteStaff(id: any): Observable<Staff> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Staff>(url, httpOptions).pipe(
      tap(_ => console.log('deleted staff id=${id}')),
      catchError(this.handleError<Staff>('deleteStaff'))
    );
  }

  addRolesForStaff(addRolesForStaffVM: any): Observable<AddRolesForStaffVM> {
    let url = `${apiUrl}/roles`;
    return this.http.post<AddRolesForStaffVM>(url, addRolesForStaffVM, httpOptions).pipe(
      tap((addRolesForStaffVM: AddRolesForStaffVM) => console.log('added')),
      catchError(this.handleError<AddRolesForStaffVM>('addRolesForStaffVM'))
    );
  }

  removeRolesForStaff(removeRolesForStaffVM: any): Observable<RemoveRolesForStaffVM> {
    let url = `${apiUrl}/roles`;
    return this.http.delete<RemoveRolesForStaffVM>(url, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<RemoveRolesForStaffVM>('removeRolesForStaffVM'))
    );
  }

  addProductLevelsForStaff(addProductLevelForStaffVM: AddProductLevelForStaffVM): Observable<any> {
    let url = `${apiUrl}/productLevels`;
    return this.http.post<any>(url, addProductLevelForStaffVM, httpOptions).pipe(
      tap(_ => console.log('added')),
      catchError(this.handleError<any>('addProductLevelForStaffVM'))
    );
  }

  removeProductLevelsForStaff(removeProdutLevelsForStaffVM: any): Observable<RemoveProdutLevelsForStaffVM> {
    let url = `${apiUrl}/productLevels`;
    return this.http.delete<RemoveProdutLevelsForStaffVM>(url, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<RemoveProdutLevelsForStaffVM>('RemoveProdutLevelsForStaffVM'))
    );
  }

  addInShiftForStaff(staffInShiftVM: any): Observable<StaffInShiftVM> {
    let url = `${apiUrl}/shifts/in`;
    return this.http.post<StaffInShiftVM>(url, staffInShiftVM, httpOptions).pipe(
      tap((staffInShiftVM: StaffInShiftVM) => console.log('added')),
      catchError(this.handleError<StaffInShiftVM>('addStaffInShiftVM'))
    );
  }

  addOutShiftForStaff(staffOutShiftVM: any): Observable<StaffOutShiftVM> {
    let url = `${apiUrl}/shifts/out`;
    return this.http.post<StaffOutShiftVM>(url, staffOutShiftVM, httpOptions).pipe(
      tap((staffOutShiftVM: StaffOutShiftVM) => console.log('added')),
      catchError(this.handleError<StaffOutShiftVM>('addStaffOutShiftVM'))
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