import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { FilterService, GridModule, GroupService, PageService, SortService } from '@syncfusion/ej2-angular-grids';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { UploaderModule } from '@syncfusion/ej2-angular-inputs';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { StepsComponent } from './steps.component';
import { AddStepComponent } from './add-step/add-step.component';
import { StepListComponent } from './step-list/step-list.component';

const routes: Routes = [
  {
    path: 'steps',
    component: StepsComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
        component: StepListComponent
      },
    ]
  }
];

@NgModule({
  declarations: [
    StepListComponent,
    AddStepComponent,
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
  bootstrap: [StepsComponent]
})
export class StepsModule { }
