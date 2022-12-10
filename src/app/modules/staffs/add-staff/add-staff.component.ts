import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { CreateStaffVM } from 'src/app/shared/models/createStaffVM';
import { ProductLevel } from 'src/app/shared/models/productLevel';

@Component({
    selector: 'add-staff',
    templateUrl: './add-staff.component.html',
})

export class AddStaffComponent implements OnInit {
    form!: FormGroup;
    title: string = "Add new Staff";
    roles: any[] = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'CSO' },
        { id: 3, name: 'Editor' },
        { id: 4, name: 'High Quanlity' },
        { id: 5, name: 'Merge Retouch' },
        { id: 6, name: 'Video' },
        { id: 7, name: '2D&3D' },
        { id: 8, name: 'QC' },
        { id: 9, name: 'DCQC' }
    ];
    roleIds = new FormControl();

    groups: any[] = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'QC' },
        { id: 3, name: 'High Quanlity' },
        { id: 4, name: 'Photo Editing' },
        { id: 5, name: 'Merge Retouch' },
        { id: 6, name: 'Video' },
        { id: 7, name: '2D&3D' },
    ];
    groupIds = new FormControl();

    productLevelIds = new FormControl();
    productLevels!: ProductLevel[];

    constructor(private fb: FormBuilder,
        private staffService: StaffService,
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
            fullname: [null, Validators.required],
            account: [null, Validators.required],
            email: [null, Validators.required],
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
        let createStaffVM: CreateStaffVM = {
            fullname: this.form.get('fullname')?.value,
            account: this.form.get('account')?.value,
            email: this.form.get('email')?.value,
            roleIds: this.roleIds?.value,
            groupIds: this.groupIds?.value,
            productLevelIds: this.productLevelIds?.value
        };

        console.log("createStaffVM", createStaffVM);

        this.staffService.addStaff(createStaffVM)
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
