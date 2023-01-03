import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { ProductLevelService } from "src/app/core/services/productLevels.service";
import { StaffService } from "src/app/core/services/staffs.service";

@Component({
    selector: 'remove-staff',
    templateUrl: './remove-staff.component.html',
})

export class RemoveStaffComponent {
    constructor(
        private staffService: StaffService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveStaffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(id: number) {
        this.staffService.deleteStaff(id).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}