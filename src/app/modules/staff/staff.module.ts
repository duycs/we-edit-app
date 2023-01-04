import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { StaffComponent } from './staff.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { UpdateStepStatusComponent } from './update-step-status/update-step-status.component';
import { UpdateStaffComponent } from './update-staff/update-staff.component';

const routes: Routes = [
    {
        path: 'staffs',
        component: StaffComponent,
        children: [
            // steps
            {
                path: ':id',
                component: StaffDetailComponent
            },
        ]
    }
];

@NgModule({
    declarations: [
        StaffDetailComponent,
        UpdateStepStatusComponent,
        UpdateStaffComponent
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
    bootstrap: [StaffComponent]
})
export class StaffModule { }
