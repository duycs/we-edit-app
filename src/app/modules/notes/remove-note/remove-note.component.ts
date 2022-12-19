import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AlertService } from "src/app/core/services/alert.service";
import { NoteService } from "src/app/core/services/notes.service";

@Component({
    selector: 'remove-note',
    templateUrl: './remove-note.component.html',
})

export class RemoveNoteComponent {
    constructor(
        private noteService: NoteService,
        private alertService: AlertService,
        public dialogRef: MatDialogRef<RemoveNoteComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onRemove(id: number) {
        this.noteService.deleteNote(id).subscribe(res => {
            this.alertService.showToastSuccess();
        }, err => {
            console.log(err);
        });
    };

}