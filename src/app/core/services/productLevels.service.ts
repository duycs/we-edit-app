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
import { PaggedDataProductLevel } from 'src/app/shared/models/paggedDataProductLevel';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const apiUrl = `${AppSettings.defaultBackendDevelopUrl}/productlevels`;
const sizeDefault = 10;

@Injectable({
  providedIn: 'root'
})
export class ProductLevelService {

  constructor(private http: HttpClient) { }

  getAllProductLevels(page: number = 0, size: number = 0, searchValue: string = '', isInclude: boolean = true): Observable<ProductLevel[]> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
    return this.http.get<ProductLevel[]>(url)
      .pipe(
        tap(productLevels => console.log('Fetch ProductLevels')),
        catchError(this.handleError<ProductLevel[]>('getProductLevels'))
      );
  }

  getProductLevels(page: number = 1, size: number = sizeDefault, searchValue: string = '', isInclude: boolean = true): Observable<PaggedDataProductLevel> {
    const url = `${apiUrl}?pageNumber=${page}&pageSize=${size}&isInclude=${isInclude}&searchValue=${searchValue}`;
    return this.http.get<PaggedDataProductLevel>(url)
      .pipe(
        tap(paggedProductLevels => console.log('Fetch ProductLevels')),
        catchError(this.handleError<PaggedDataProductLevel>('getProductLevels'))
      );
  }

  getProductLevel(id: number): Observable<ProductLevel> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<ProductLevel>(url).pipe(
      tap(_ => console.log('fetched ProductLevel id=${id}')),
      catchError(this.handleError<ProductLevel>('getProductLevel id=${id}'))
    );
  }

  addProductLevel(productLevel: any): Observable<ProductLevel> {
    return this.http.post<ProductLevel>(apiUrl, productLevel, httpOptions).pipe(
      tap((productLevel: ProductLevel) => console.log('added')),
      catchError(this.handleError<ProductLevel>('addProductLevel'))
    );
  }

  updateProductLevel(productLevel: any): Observable<ProductLevel> {
    return this.http.put<ProductLevel>(apiUrl, productLevel, httpOptions).pipe(
      tap((productLevel: ProductLevel) => console.log('updated')),
      catchError(this.handleError<ProductLevel>('addProductLevel'))
    );
  }

  deleteProductLevel(id: any): Observable<ProductLevel> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<ProductLevel>(url, httpOptions).pipe(
      tap(_ => console.log('deleted')),
      catchError(this.handleError<ProductLevel>('deleteProductLevel'))
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