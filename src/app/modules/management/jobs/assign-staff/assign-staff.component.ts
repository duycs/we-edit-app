import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { AssignStaffToStepVM } from 'src/app/shared/models/assignStaffToStepVM';
import { Staff } from 'src/app/shared/models/staff';

@Component({
    selector: 'assign-staff',
    templateUrl: './assign-staff.component.html',
})

export class AssignStaffComponent implements OnInit, AfterViewInit {

    form!: FormGroup;
    staffs!: Staff[];
    jobId!: number;

    constructor(private fb: FormBuilder,
        private jobService: JobService,
        private staffService: StaffService,
        private dialogRef: MatDialogRef<AssignStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
        this.jobId = this.data.jobId;
        console.log("jobId", this.jobId);

        this.getStaffs();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            staffId: [null, Validators.required],
            estimationInSeconds: [null, Validators.required]
        });
    };

    getStaffs(): void {
        this.staffService.getStaffs().subscribe(res => {
            this.staffs = res.data;
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    public save(): void {
        let assignStaffToStepVM: AssignStaffToStepVM = {
            jobId: ~~this.jobId,
            staffId: ~~this.form.get('staffId')?.value,
            stepId: ~~this.data.stepId,
            estimationInSeconds: ~~this.form.get('estimationInSeconds')?.value
        };

        this.jobService.assignStaffToStep(assignStaffToStepVM)
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