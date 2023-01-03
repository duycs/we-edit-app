import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { JobService } from "src/app/core/services/jobs.service";
import { RemoveStepsFromJobVM } from "src/app/shared/models/removeStepsFromJobVM";

@Component({
    selector: 'remove-step-of-job',
    templateUrl: './remove-step-of-job.component.html',
})

export class RemoveStepOfJobComponent {
    constructor(
        private jobService: JobService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveStepOfJobComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemoveStepOfJob(jobId: number, stepId: number) {
        let removeStepsFromJobVM: RemoveStepsFromJobVM = {
            jobId: jobId,
            stepIds: [stepId]
        };
        this.jobService.removeStepsFromJob(removeStepsFromJobVM).subscribe(res => {
            this.alertService.showToastSuccess();
            console.log("remove step job", this.data);
        }, err => {
            console.log(err);
        });
    };

}