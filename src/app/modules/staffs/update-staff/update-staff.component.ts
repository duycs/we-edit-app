import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { ProductLevel } from 'src/app/shared/models/productLevel';
import { UpdateStaffVM } from 'src/app/shared/models/updateStaffVM';

@Component({
    selector: 'update-staff',
    templateUrl: './update-staff.component.html',
})

export class UpdateStaffComponent implements OnInit {

    form!: FormGroup;
    staffId!: number;
    staffName!: string;

    roles: any[] = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'CSO' },
        { id: 3, name: 'Editor' },
        { id: 4, name: 'QC' },
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
        private router: Router,
        private route: ActivatedRoute,
        private dialogRef: MatDialogRef<UpdateStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
        console.log("data", this.data);
        this.staffId = this.data.id;
        this.staffName = this.data.fullName;

        this.getProductLevels();

        if (this.data.roles && this.data.roles.length > 0) {
            let selectedRoleIds = this.data.roles.map((v: any) => v.id);
            this.roleIds = new FormControl(selectedRoleIds);
        }
        if (this.data.groups && this.data.groups.length > 0) {
            let selectedGroupIds = this.data.groups.map((v: any) => v.id);
            this.groupIds = new FormControl(selectedGroupIds);
        }
        if (this.data.productLevels && this.data.productLevels.length > 0) {
            let selectedproductLevelIds = this.data.productLevels.map((v: any) => v.id);
            this.productLevelIds = new FormControl(selectedproductLevelIds);
        }
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            fullname: [this.data.fullName, Validators.required],
            account: [this.data.account, Validators.required],
            email: [this.data.email, Validators.required],
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
        let updateStaffVM: UpdateStaffVM = {
            staffId: this.staffId,
            fullname: this.form.get('fullname')?.value,
            account: this.form.get('account')?.value,
            roleIds: this.roleIds?.value,
            groupIds: this.groupIds?.value,
            productLevelIds: this.productLevelIds?.value
        };

        this.staffService.updateStaff(updateStaffVM)
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