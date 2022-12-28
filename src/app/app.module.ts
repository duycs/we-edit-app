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
import { JobsComponent } from './modules/jobs/jobs.component';
import { JobsModule } from './modules/jobs/jobs.module';
import { StaffsComponent } from './modules/staffs/staffs.component';
import { StaffsModule } from './modules/staffs/staffs.module';
import { StepsComponent } from './modules/steps/steps.component';
import { StepsModule } from './modules/steps/steps.module';
import { ProductLevelsComponent } from './modules/productlevels/productlevels.component';
import { ProductLevelsModule } from './modules/productlevels/productlevels.module';
import { HeaderComponent } from './core/header/header.component';
import { HomeComponent } from './modules/home/home.component';
import { NotesComponent } from './modules/notes/notes.component';
import { NotesModule } from './modules/notes/notes.module';
import { RegisterComponent } from './modules/register/register.component';
import { LoginComponent } from './modules/login/login.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfigService } from './shared/config.service';
import { AuthCallbackComponent } from './modules/auth-callback/auth-callback.component';
import { CoreModule } from './core/core.module';
import { AuthGuard } from './core/authentication/auth.guard';
import { TokenInterceptorService } from './core/interceptors/token-interceptor';


const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'auth-callback', component: AuthCallbackComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
  // { path: 'about', component: AboutComponent },
  // { path: 'menu', component: MenuComponent },

  { path: 'modules/jobs', component: JobsComponent, canActivate: [AuthGuard] },
  { path: 'modules/steps', component: StepsComponent },
  { path: 'modules/staffs', component: StaffsComponent },
  { path: 'modules/productlevels', component: ProductLevelsComponent },
  { path: 'modules/notes', component: NotesComponent },
];


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AuthCallbackComponent,
    AppComponent,
    NavMenuComponent,
    HeaderComponent,
    JobsComponent,
    StaffsComponent,
    StepsComponent,
    ProductLevelsComponent,
    NotesComponent,
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
    JobsModule,
    StaffsModule,
    StepsModule,
    ProductLevelsModule,
    NotesModule,
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
