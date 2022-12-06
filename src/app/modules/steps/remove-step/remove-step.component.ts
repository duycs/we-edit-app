import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { StepService } from "src/app/core/services/steps.service";

@Component({
    selector: 'remove-step',
    templateUrl: './remove-step.component.html',
})

export class RemoveStepComponent {
    constructor(
        private stepService: StepService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveStepComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(id: number) {
        this.stepService.deleteStep(id).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}