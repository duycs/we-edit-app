import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { JobsComponent } from './jobs.component';
import { JobListComponent } from './job-list/job-list.component';
import { FilterService, GridModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { AddJobComponent } from './add-job/add-job.component';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { JobDetailComponent } from './job-detail/job-detail.component';
import { AddJobStepComponent } from './add-job-step/add-job-step.component';
import { AssignStaffComponent } from './assign-staff/assign-staff.component';
import { RemoveJobComponent } from './remove-job/remove-job.component';
import { RemoveStepOfJobComponent } from './remove-step-of-job/remove-step-of-job.component';
import { NgModule } from '@angular/core';


const routes: Routes = [
  {
    path: 'jobs',
    component: JobsComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
        component: JobListComponent
      },
      {
        path: ':id',
        component: JobDetailComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    JobListComponent,
    JobDetailComponent,
    AddJobComponent,
    RemoveJobComponent,
    RemoveStepOfJobComponent,
    AddJobStepComponent,
    AssignStaffComponent,
  ],
  imports: [
    DropDownListModule,
    ButtonModule,
    DialogModule,
    UploaderModule,
    GridModule,
    BrowserModule,
    SharedModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService],
  bootstrap: [JobsComponent]
})
export class JobsModule { }
