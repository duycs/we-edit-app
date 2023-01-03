import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { JobService } from "src/app/core/services/jobs.service";

@Component({
    selector: 'remove-job',
    templateUrl: './remove-job.component.html',
})

export class RemoveJobComponent {
    constructor(
        private jobService: JobService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveJobComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemoveJob(id: number) {
        this.jobService.deleteJob(id).subscribe(res => {
            this.alertService.showToastSuccess();
            //window.location.reload();
            console.log("remove job", id);
        }, err => {
            console.log(err);
        });
    };

}

export interface DialogData {
    id: number;
    name: string;
}
