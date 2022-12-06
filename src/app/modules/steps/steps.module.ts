import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared.module';
import { StepsComponent } from './steps.component';
import { AddStepComponent } from './add-step/add-step.component';
import { StepListComponent } from './step-list/step-list.component';
import { RemoveStepComponent } from './remove-step/remove-step.component';

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
    RemoveStepComponent,
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
  bootstrap: [StepsComponent]
})
export class StepsModule { }
