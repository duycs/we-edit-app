import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Operation } from 'src/app/shared/models/operation';
import { environment } from 'src/environments/environment';
import { AssignActionOperationComponent } from '../../operations/assign-action/assign-action-operation.component';

@Component({
    selector: 'add-operation',
    templateUrl: './add-operation.component.html',
})

export class AddOperationComponent implements OnInit, AfterViewInit {
    form!: FormGroup;
    operations!: Operation[];
    flowId!: number;
    operationTemplates: any[] = [
        {
            executionName: "AssignAction",
            name: "Assign Action",
            icon: "assignment"
        }
    ];

    constructor(private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AddOperationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    };

    ngAfterViewInit(): void {
        this.flowId = this.data.flowId;
        console.log("flowId", this.flowId);
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            executionName: [null, Validators.required]
        });
    };

    openOperationDialog() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = { flowId: this.flowId };

        let executionName = this.form.get('executionName')?.value;
        let dialogRef;
        if (executionName === "AssignAction") {
            dialogRef = this.dialog.open(AssignActionOperationComponent, dialogConfig);
        } else {
            console.log(`Not found operation ${executionName}`);

            this.dialogRef.afterClosed().subscribe(
                result => {
                    
                }
            );
        }
    }

    close() {
        this.dialogRef.close({ event: "close", data: this.form.value });
    }

}