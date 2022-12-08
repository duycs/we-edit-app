import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Staff } from '../../shared/models/staff';
import { AppSettings } from 'src/app/configs/app-settings.config';

const apiUrl = `${AppSettings.API_URL}`;

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<Staff>;
    public currentUser: Observable<Staff>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<Staff>(JSON.parse(localStorage.getItem('currentUser')?? ""));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): Staff {
        return this.currentUserSubject.value;
    }

    //user type is member or librarian
    login(accountName: string, password: string) {
        //TODO: default is member
        const url = `${apiUrl}/authentication/login`;
        return this.http.post<any>(url, {accountName, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout(email: string) {
        //TODO: default is member
        const url = `${apiUrl}/authentication/logout`;
        return this.http.post<any>(url, { email })
            .pipe(map(result => {
                // remove user from local storage to log user out
                localStorage.removeItem('currentUser');
                this.currentUserSubject.unsubscribe();
            }));
    }
}