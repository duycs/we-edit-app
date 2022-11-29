import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
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
import { AppBarModule } from "@syncfusion/ej2-angular-navigations";
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { StaffsComponent } from './modules/staffs/staffs.component';
import { StaffsModule } from './modules/staffs/staffs.module';
import { StepsComponent } from './modules/steps/steps.component';
import { StepsModule } from './modules/steps/steps.module';
import { ProductLevelsComponent } from './modules/productlevels/productlevels.component';
import { ProductLevelsModule } from './modules/productlevels/productlevels.module';


const appRoutes: Routes = [
  // { path: '', component: HomeComponent, pathMatch: 'full' },
  // { path: 'about', component: AboutComponent },
  // { path: 'menu', component: MenuComponent },
  // { path: 'login', component: LoginComponent },

  { path: 'modules/jobs', component: JobsComponent },
  { path: 'modules/steps', component: StepsComponent },
  { path: 'modules/staffs', component: StaffsComponent },
  { path: 'modules/productlevels', component: ProductLevelsComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    JobsComponent,
    StaffsComponent,
    StepsComponent,
    ProductLevelsComponent,
  ],
  imports: [
    AppBarModule,
    ButtonModule,
    DialogModule,
    UploaderModule,
    SharedModule,
    BrowserAnimationsModule,
    MaterialModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' }),
    RouterModule.forChild([]),
    BrowserAnimationsModule,
    NoopAnimationsModule,

    //app modules
    JobsModule,
    StaffsModule,
    StepsModule,
    ProductLevelsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
