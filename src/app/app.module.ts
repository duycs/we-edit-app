import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

//material, include animation,
import { MaterialModule } from './material.module';
import { AppComponent } from "./app.component";

import { NavMenuComponent } from './core/nav-menu/nav-menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SharedModule } from './shared.module';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './modules/home/home.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfigService } from './shared/config.service';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/guards/auth.guard';
import { TokenInterceptorService } from './core/interceptors/token-interceptor';
import { AdminGuard } from './core/guards/admin.guard';
import { ManagementComponent } from './modules/management/management.component';
import { ManagementModule } from './modules/management/management.module';
import { AuthenticationModule } from './core/authentication/authentication.module';
import { AuthenticationComponent } from './core/authentication/authentication.component';
import { StaffComponent } from './modules/staff/staff.component';
import { StaffModule } from './modules/staff/staff.module';

const appRoutes: Routes = [
  { path: 'authentication', loadChildren: () => import('./core/authentication/authentication.module').then(m => m.AuthenticationModule), component: AuthenticationComponent },

  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },

  { path: 'management', loadChildren: () => import('./modules/management/management.module').then(m => m.ManagementModule), component: ManagementComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'staffs', loadChildren: () => import('./modules/staff/staff.module').then(m => m.StaffModule), component: StaffComponent, canActivate: [AuthGuard] },

];

@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    AuthenticationComponent,
    ManagementComponent,
    StaffComponent,
  ],
  imports: [
    NgxSpinnerModule,
    SharedModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
    RouterModule.forChild([]),
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MaterialModule,

    //app modules
    CoreModule,
    AuthenticationModule,
    ManagementModule,
    StaffModule,
  ],
  providers: [
    ConfigService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
