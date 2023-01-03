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
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfigService } from './shared/config.service';
import { AuthCallbackComponent } from './modules/auth-callback/auth-callback.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/authentication/auth.guard';
import { TokenInterceptorService } from './core/interceptors/token-interceptor';
import { ForbiddenComponent } from './modules/forbidden/forbidden.component';
import { AdminGuard } from './core/authentication/admin.guard';
import { NotFoundComponent } from './modules/not-found/not-found.component';
import { ManagementComponent } from './modules/management/management.component';
import { ManagementModule } from './modules/management/management.module';

const appRoutes: Routes = [
  { path: 'forbidden', component: ForbiddenComponent },
  { path: 'notfound', component: NotFoundComponent },
  // { path: '**', redirectTo: '/notfound', pathMatch: 'full'},
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  
  { path: 'home', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full', canActivate: [AuthGuard] },

  { path: 'management', loadChildren: () => import('./modules/management/management.module').then(m => m.ManagementModule), component: ManagementComponent, canActivate: [AuthGuard, AdminGuard] },

];

@NgModule({
  declarations: [
    NotFoundComponent,
    ForbiddenComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AuthCallbackComponent,
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    ManagementComponent,
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
    ManagementModule,
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
