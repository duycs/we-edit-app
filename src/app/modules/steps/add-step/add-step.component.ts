import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StepService } from 'src/app/core/services/steps.service';
import { CreateStepVM } from 'src/app/shared/models/createStepVM';
import { ProductLevel } from 'src/app/shared/models/productLevel';
import { AddStaffComponent } from '../../staffs/add-staff/add-staff.component';

@Component({
    selector: 'add-step',
    templateUrl: './add-step.component.html',
})

export class AddStepComponent implements OnInit {

    form!: FormGroup;
    title: string = "Add new Step";
    productLevels!: ProductLevel[];

    constructor(private fb: FormBuilder,
        private stepService: StepService,
        private productLevelService: ProductLevelService,
        private dialogRef: MatDialogRef<AddStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
        this.getProductLevels();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            code: [null, Validators.required],
            orderNumber: [null, Validators.required],
            estimationInSeconds: [3600],
            productLevelId: [null, Validators.required],
        });
    };

    getProductLevels(): void {
        this.productLevelService.getAllProductLevels()
            .subscribe(res => {
                this.productLevels = res;
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public save(): void {
        let createStepVM: CreateStepVM = {
            name: this.form.get('name')?.value,
            code: this.form.get('code')?.value,
            orderNumber: this.form.get('orderNumber')?.value,
            estimationInSeconds: ~~this.form.get('estimationInSeconds')?.value,
            productLevelId: ~~this.form.get('productLevelId')?.value
        };

        this.stepService.addStep(createStepVM)
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
