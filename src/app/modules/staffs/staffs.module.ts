import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { StaffListComponent } from './staff-list/staff-list.component';
import { StaffDetailComponent } from './staff-detail/staff-detail.component';
import { StaffsComponent } from './staffs.component';
import { AddStaffComponent } from './add-staff/add-staff.component';
import { AddProductLevelForStaffComponent } from './add-productlevel-for-staff/add-productlevel-for-staff.component';
import { RemoveStaffComponent } from './remove-staff/remove-staff.component';
import { UpdateStepStatusComponent } from './update-step-status/update-step-status.component';


const routes: Routes = [
  {
    path: 'staffs',
    component: StaffsComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
        component: StaffListComponent
      },
      {
        path: ':id',
        component: StaffDetailComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    StaffListComponent,
    StaffDetailComponent,
    AddStaffComponent,
    AddProductLevelForStaffComponent,
    RemoveStaffComponent,
    UpdateStepStatusComponent,
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
  bootstrap: [StaffsComponent]
})
export class StaffsModule { }
