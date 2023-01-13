import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { OperationService } from "src/app/core/services/operations.service";

@Component({
    selector: 'remove-operation',
    templateUrl: './remove-operation.component.html',
})

export class RemoveOperationComponent {
    constructor(
        private operationService: OperationService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveOperationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(operationId: number) {
        this.operationService.removeOperation(operationId).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}