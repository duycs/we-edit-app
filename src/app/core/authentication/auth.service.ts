import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject, Observable } from 'rxjs';

import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  // Observable navItem source
  private _authNavStatusSource = new BehaviorSubject<boolean>(false);
  // Observable navItem stream
  authNavStatus$ = this._authNavStatusSource.asObservable();

  private manager = new UserManager(getClientSettings());
  private user!: User | null;

  constructor(private http: HttpClient,
    private configService: ConfigService) {
    super();
    this.manager.getUser().then(user => {
      this.user = user;
      this._authNavStatusSource.next(this.isAuthenticated());
    });
  }

  login() {
    return this.manager.signinRedirect();
  }

  async completeAuthentication() {
    this.user = await this.manager.signinRedirectCallback();

    console.log("user", this.user);

    this._authNavStatusSource.next(this.isAuthenticated());
  }

  register(userRegistration: any) {
    return this.http.post(this.configService.authApiURI + '/account', userRegistration).pipe(catchError(this.handleError));
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  public isUserAdmin = (): boolean => {
    let roles = this.user?.profile['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    console.log("roles", roles);

    return Array.isArray(roles) ? roles.includes('admin') : roles == 'admin';
  }

  get authorizationHeaderValue(): string {
    return `${this.user?.token_type} ${this.user?.access_token}`;
  }

  get name(): string {
    if (this.user != null) {
      return this.user?.profile?.name ?? '';
    }
    else return '';
  }

  async signout() {
    await this.manager.signoutRedirect();
  }
}

export function getClientSettings(): UserManagerSettings {
  return {
    authority: environment.ssoUrl,
    client_id: 'we-edit-web-app',
    redirect_uri: `${environment.appUrl}/authentication/callback`,
    post_logout_redirect_uri: environment.appUrl,
    response_type: "id_token token",
    scope: "openid profile email api.read",
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: `${environment.appUrl}/silent-refresh.html`
  };
}