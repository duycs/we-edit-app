import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { APISignalRService } from "src/app/core/services/api-signalr.service";
import { JobService } from "src/app/core/services/jobs.service";
import { ProductLevelService } from "src/app/core/services/productLevels.service";
import { StaffService } from "src/app/core/services/staffs.service";
import { CreateJobVM } from "src/app/shared/models/createJobVM";
import { ProductLevel } from "src/app/shared/models/productLevel";
import { Staff } from "src/app/shared/models/staff";

@Component({
    selector: 'add-job',
    templateUrl: './add-job.component.html',
})

export class AddJobComponent implements OnInit {
    form!: FormGroup;
    description!: string;
    title: string = "Add new Job";

    csoStaffs!: Staff[];
    apps: any[] = [{ id: 1, name: "App 1" },
    { id: 2, name: "App 2" },
    { id: 3, name: "App3" }];

    locations: any[] = [{ id: 1, name: "EU" },
    { id: 2, name: "US" },
    { id: 3, name: "AU" }];

    deliverTypes: any[] = [{ id: 1, name: "V1" },
    { id: 2, name: "V2" },
    { id: 3, name: "V3" }];

    productLevels!: ProductLevel[];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddJobComponent>,
        private router: Router,
        private jobService: JobService,
        private apiSignalRService: APISignalRService,
        private productLevelService: ProductLevelService,
        private staffService: StaffService,
        private alertService: AlertService) {
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            date: [new Date(), Validators.required],
            locationId: [null, Validators.required],
            csoStaffId: [null, Validators.required],
            jobId: [null, Validators.required],
            jobName: [null, Validators.required],
            instruction: [null, Validators.required],
            code: [null, Validators.required],
            inputNumber: [null, Validators.required],
            productLevelId: [null, Validators.required],
            deliverTypeId: [null, Validators.required],
            appId: [null, Validators.required],
            deadline: [new Date(), Validators.required],
        });

        this.getStaffs();
        this.getProductLevels();
    };

    getStaffs(): void {
        this.staffService.getAllStaffs()
            .subscribe(res => {
                this.csoStaffs = res;
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    getProductLevels(): void {
        this.productLevelService.getProductLevels(1, 10000, '', false)
            .subscribe(res => {
                this.productLevels = res.data;
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    save() {
        this.dialogRef.close(this.form.value);
        console.log("form value", this.form.value);

        let createJobVM: CreateJobVM = {
            date: new Date(this.form.get('date')?.value),
            locationId: ~~this.form.get('locationId')?.value,
            csoStaffId: ~~this.form.get('csoStaffId')?.value,
            jobName: this.form.get('jobName')?.value,
            code: this.form.get('code')?.value,
            instruction: this.form.get('instruction')?.value,
            inputInfo: "",
            inputNumber: ~~this.form.get('inputNumber')?.value,
            deliverTypeId: ~~this.form.get('deliverTypeId')?.value,
            productLevelId: ~~this.form.get('productLevelId')?.value,
            deadline: new Date(this.form.get('deadline')?.value),
            appId: this.form.get('appId')?.value,
        };

        this.jobService.addJob(createJobVM)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                this.router.navigate([`/jobs/${res.id}`]);
            }, (err) => {
                this.alertService.showToastError();
            });
    }

    close() {
        this.dialogRef.close(this.form.value);
    }

}