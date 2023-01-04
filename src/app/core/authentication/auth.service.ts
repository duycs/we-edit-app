import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from "../../shared/base.service";
import { ConfigService } from '../../shared/config.service';
import { environment } from 'src/environments/environment';
import { StaffService } from '../services/staffs.service';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { Staff } from 'src/app/shared/models/staff';

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
  private staff!: Staff;

  constructor(private http: HttpClient,
    private configService: ConfigService,
    private staffService: StaffService,
    private mappingModel: MappingModels) {
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
    this._authNavStatusSource.next(await this.doAuthentication());
  }

  async doAuthentication() {
    console.log("user", this.user);
    this.staff = await this.getStaffByUserId(this.userId());
    return this.isAuthenticated();
  }

  async getStaffByUserId(userId: any) {
    let staff = await this.staffService.getStaffSync(userId);
    let staffMapped = this.mappingModel.MappingDisplayNameFieldsOfStaff(staff);
    return staffMapped;
  }

  register(userRegistration: any) {
    return this.http.post(this.configService.authApiURI + '/account', userRegistration).pipe(catchError(this.handleError));
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }

  userId(): string {
    return this.user?.profile['id'];
  }

  getStaff(): Staff {
    return this.staff;
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