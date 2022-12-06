import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { JobsComponent } from './jobs.component';
import { JobListComponent } from './job-list/job-list.component';
import { AddJobComponent } from './add-job/add-job.component';
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
    BrowserModule,
    SharedModule,
    MaterialModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  providers: [],
  bootstrap: [JobsComponent]
})
export class JobsModule { }
