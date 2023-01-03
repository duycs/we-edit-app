import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { AddProductLevelForStaffVM } from 'src/app/shared/models/addProductLevelForStaffVM';
import { ProductLevel } from 'src/app/shared/models/productLevel';

@Component({
    selector: 'add-productlevel-for-staff',
    templateUrl: './add-productlevel-for-staff.component.html',
})

export class AddProductLevelForStaffComponent implements OnInit {

    form!: FormGroup;
    productLevels!: ProductLevel[];
    staffId!: number;

    constructor(private fb: FormBuilder,
        private staffService: StaffService,
        private productLevelService: ProductLevelService,
        private dialogRef: MatDialogRef<AddProductLevelForStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
        this.staffId = this.data.id;
        console.log("saffId", this.staffId);

        this.getProductLevels();
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            productLevelId: [null, Validators.required]
        });
    };

    getProductLevels(): void {
        this.productLevelService.getAllProductLevels().subscribe(res => {
            this.productLevels = res;
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    public save(): void {
        let addProductLevelForStaffVM: AddProductLevelForStaffVM = {
            staffId: this.staffId,
            productLevelId: ~~this.form.get('productLevelId')?.value,
        };

        this.staffService.addProductLevelsForStaff(addProductLevelForStaffVM)
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