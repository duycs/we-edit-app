import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { NoteService } from "src/app/core/services/notes.service";
import { StaffService } from "src/app/core/services/staffs.service";
import { CreateNoteVM } from "src/app/shared/models/createNoteVM";
import { UpdateStepStatusVM } from "src/app/shared/models/updateStepStatusVM";

@Component({
    selector: 'update-step-status',
    templateUrl: './update-step-status.component.html',
})

export class UpdateStepStatusComponent implements OnInit {
    form!: FormGroup;
    title: string = "";
    titleDefault: string = "";

    constructor(
        private fb: FormBuilder,
        private staffService: StaffService,
        private alertService: AlertService,
        private noteService: NoteService,
        public dialogRef: MatDialogRef<UpdateStepStatusComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit(): void {
        this.title = this.data.step.statusname + " for " + this.data.step.name;

        this.titleDefault = "update from " + this.data.jobstep.oldStatusname + " to " + this.title;
        this.form = this.fb.group({
            title: [this.titleDefault],
            description: [null],
        });
    }

    onCancelClick(): void {
        this.dialogRef.close();
    }

    onUpdate(data: any) {

        // update step status
        let updateStepStatusVM: UpdateStepStatusVM = {
            jobId: data.job.id,
            staffId: data.staff.id,
            stepId: data.step.id,
            status: data.step.status,
        };

        console.log("updateStepStatusVM", updateStepStatusVM);

        this.staffService.updateStepStatus(updateStepStatusVM)
            .subscribe(res => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

        // add note if have value
        let title = this.form.get('title')?.value;
        let description = this.form.get('description')?.value;

        if (description && description !== "") {
            let createNoteVM: CreateNoteVM = {
                title: this.form.get('title')?.value,
                description: this.form.get('description')?.value,
                noterId: data.staff.id,
                objectName: 'jobstep',
                objectId: data.jobstep.id,
            };

            console.log("createNoteVM", createNoteVM);

            this.noteService.addNote(createNoteVM)
                .subscribe(res => {
                    this.alertService.showToastSuccess();
                }, (err) => {
                    this.alertService.showToastError();
                    console.log(err);
                });
        }

    };

}