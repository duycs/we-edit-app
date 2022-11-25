import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CardJobListComponent } from './shared/components/list/card-job-list.component';
import { AddJobComponent } from './modules/jobs/add-job/add-job.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        RouterModule,
    RouterModule.forChild([

    ]),
    ],
    declarations: [
        CardJobListComponent,
    ],
    exports: [
        CardJobListComponent,
    ]
})
export class SharedModule { }