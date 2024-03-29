import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
    constructor(private router: Router,
        private authService: AuthService) { }
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        const token = this.authService.authorizationHeaderValue;
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token,
                },
            });
        }
        return next.handle(request).pipe(
            catchError((err) => {
                if (err.status === 401) {
                    this.authService.signout();
                }

                if (err.status === 403) {
                    this.authService.goToForbidden();
                }

                const error = err.error.message || err.statusText;
                return throwError(error);
            })
        );
    }
}