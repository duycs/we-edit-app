import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { StepService } from 'src/app/core/services/steps.service';
import { AddStepsToJobVM } from 'src/app/shared/models/addStepsToJobVM';
import { Step } from 'src/app/shared/models/step';

@Component({
    selector: 'add-job-step',
    templateUrl: './add-job-step.component.html',
})

export class AddJobStepComponent implements OnInit, AfterViewInit {

    form!: FormGroup;
    steps!: Step[];
    jobId!: number;

    constructor(private fb: FormBuilder,
        private jobService: JobService,
        private stepService: StepService,
        private router: Router,
        private route: ActivatedRoute,
        private dialogRef: MatDialogRef<AddJobStepComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
        this.jobId = this.data.jobId;
        console.log("jobId", this.jobId);

        this.getSteps();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            stepId: [null, Validators.required]
        });
    };

    getSteps(): void {
        this.stepService.getSteps().subscribe(res => {
            this.steps = res;
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    public save(): void {
        let addStepsToJobVM: AddStepsToJobVM = {
            jobId: this.jobId,
            stepIds: [~~this.form.get('stepId')?.value],
        };

        this.jobService.addStepsToJob(addStepsToJobVM)
            .subscribe(() => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

        this.dialogRef.close({ event: "save", data: this.form.value });
    }

    close() {
        this.dialogRef.close({ event: "close", data: this.form.value });
    }

}