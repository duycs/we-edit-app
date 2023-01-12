import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { FlowService } from "src/app/core/services/flows.service";
import { RemoveOperationFromFlowVM } from "src/app/shared/models/removeOperationFromFlowVM";

@Component({
    selector: 'remove-operation',
    templateUrl: './remove-operation.component.html',
})

export class RemoveOperationComponent {
    constructor(
        private flowService: FlowService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveOperationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(flowId: number, operationId: number) {
        let removeOperationFromFlowVM: RemoveOperationFromFlowVM = {
            flowId: flowId,
            operationId: operationId
        };
        this.flowService.removeOperationFromFlow(removeOperationFromFlowVM).subscribe(res => {
            this.alertService.showToastSuccess();
            console.log("remove operation", this.data);
        }, err => {
            console.log(err);
        });
    };

}