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
import { Router } from '@angular/router';

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
  private staff!: Staff | null;
  private staffLocalStoreKey: string = 'staff';

  constructor(private http: HttpClient,
    private router: Router,
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

    // store staff
    this.setStaff();

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

  getStaffLocalStoreKey(): string {
    return this.staffLocalStoreKey;
  }

  isAuthenticated(): boolean {
    console.log("user auth: ", this.user);

    this.staff = this.getStaff();

    console.log("staff: ", this.staff);

    // user auth or staff existing
    return (this.user != null && !this.user.expired) || (this.staff != null && this.staff.id > 0);
  }

  userId(): string {
    return this.user?.profile['id'];
  }

  setStaff() {
    if (this.staff != null) {
      localStorage.setItem(this.staffLocalStoreKey, JSON.stringify(this.staff));
    }
  }

  getStaff(): Staff | null {
    let jsonStaff = localStorage.getItem(this.staffLocalStoreKey) ?? "";
    if (!jsonStaff || jsonStaff.length == 0)
      return null;

    this.staff = JSON.parse(jsonStaff);
    return this.staff;
  }

  removeStaff() {
    localStorage.removeItem(this.staffLocalStoreKey);
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
    this.removeStaff();
    await this.manager.signoutRedirect();
  }

  goToForbidden(){
    this.router.navigate([`/authentication/forbidden`])
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
    automaticSilentRenew: false,
    silent_redirect_uri: `${environment.appUrl}/silent-refresh.html`
  };
}