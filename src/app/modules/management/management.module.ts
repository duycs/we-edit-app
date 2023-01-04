import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { ManagementComponent } from './management.component';
import { StepListComponent } from './steps/step-list/step-list.component';
import { AddStepComponent } from './steps/add-step/add-step.component';
import { RemoveStepComponent } from './steps/remove-step/remove-step.component';
import { AddStaffComponent } from './staffs/add-staff/add-staff.component';
import { StaffListComponent } from './staffs/staff-list/staff-list.component';
import { RemoveStaffComponent } from './staffs/remove-staff/remove-staff.component';
import { AddProductLevelComponent } from './productlevels/add-productlevel/add-productlevel.component';
import { AddProductLevelForStaffComponent } from './staffs/add-productlevel-for-staff/add-productlevel-for-staff.component';
import { StaffDetailComponent } from './staffs/staff-detail/staff-detail.component';
import { UpdateStaffComponent } from './staffs/update-staff/update-staff.component';
import { UpdateStepStatusComponent } from './staffs/update-step-status/update-step-status.component';
import { AddJobComponent } from './jobs/add-job/add-job.component';
import { AddJobStepComponent } from './jobs/add-job-step/add-job-step.component';
import { AssignStaffComponent } from './jobs/assign-staff/assign-staff.component';
import { JobDetailComponent } from './jobs/job-detail/job-detail.component';
import { JobListComponent } from './jobs/job-list/job-list.component';
import { RemoveJobComponent } from './jobs/remove-job/remove-job.component';
import { RemoveStepOfJobComponent } from './jobs/remove-step-of-job/remove-step-of-job.component';
import { ProductLevelListComponent } from './productlevels/productlevel-list/productlevel-list.component';
import { RemoveProductLevelComponent } from './productlevels/remove-productlevel/remove-productlevel.component';
import { NoteListComponent } from './notes/note-list/note-list.component';
import { RemoveNoteComponent } from './notes/remove-note/remove-note.component';

const routes: Routes = [
    {
        path: 'management',
        component: ManagementComponent,
        children: [
            // steps
            {
                path: 'steps',
                component: StepListComponent
            },
            {
                path: 'steps/add',
                component: AddStepComponent
            },
            {
                path: 'steps/remove',
                component: RemoveStepComponent
            },

            // staffs
            {
                path: 'staffs',
                component: StaffListComponent
            },
            {
                path: 'staffs/:id',
                component: StaffDetailComponent
            },
            {
                path: 'staffs/add',
                component: AddStaffComponent
            },
            {
                path: 'staffs/update',
                component: UpdateStaffComponent
            },
            {
                path: 'staffs/step-status/update',
                component: UpdateStepStatusComponent
            },
            {
                path: 'staffs/remove',
                component: RemoveStaffComponent
            },
            {
                path: 'staffs/product-level/add',
                component: AddProductLevelForStaffComponent
            },

            // jobs
            {
                path: 'jobs',
                component: JobListComponent
            },
            {
                path: 'jobs/add',
                component: AddJobComponent
            },
            {
                path: 'jobs/:id',
                component: JobDetailComponent
            },
            {
                path: 'jobs/step/add',
                component: AddJobStepComponent
            },
            {
                path: 'jobs/assign-staff',
                component: AssignStaffComponent
            },
            {
                path: 'jobs/remove/:id',
                component: RemoveJobComponent
            },
            {
                path: 'jobs/step/remove',
                component: RemoveStepOfJobComponent
            },

            // product-levels
            {
                path: 'plevels',
                component: ProductLevelListComponent
            },
            {
                path: 'plevels/add',
                component: AddProductLevelComponent
            },
            {
                path: 'plevels/remove',
                component: RemoveProductLevelComponent
            },

            // notes
            {
                path: 'notes',
                component: NoteListComponent
            },
            {
                path: 'notes/remove',
                component: RemoveNoteComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        StepListComponent,
        AddStepComponent,
        RemoveStepComponent,

        StaffListComponent,
        StaffDetailComponent,
        AddStaffComponent,
        UpdateStaffComponent,
        UpdateStepStatusComponent,
        RemoveStaffComponent,
        AddProductLevelForStaffComponent,

        JobListComponent,
        JobDetailComponent,
        AddJobComponent,
        AddJobStepComponent,
        AssignStaffComponent,
        RemoveJobComponent,
        RemoveStepOfJobComponent,

        ProductLevelListComponent,
        AddProductLevelComponent,
        RemoveProductLevelComponent,

        NoteListComponent,
        RemoveNoteComponent
    ],
    imports: [
        SharedModule,
        MaterialModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ],
    providers: [],
    bootstrap: [ManagementComponent]
})
export class ManagementModule { }
