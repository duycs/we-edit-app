import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { FlowService } from "src/app/core/services/flows.service";

@Component({
    selector: 'remove-flow',
    templateUrl: './remove-flow.component.html',
})

export class RemoveFlowComponent {
    constructor(
        private flowService: FlowService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveFlowComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemoveFlow(id: number) {
        this.flowService.deleteFlow(id).subscribe(res => {
            this.alertService.showToastSuccess();
            console.log("remove flow", id);
        }, err => {
            console.log(err);
        });
    };

}

export interface DialogData {
    id: number;
    name: string;
}
