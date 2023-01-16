import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { FlowService } from 'src/app/core/services/flows.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { OperationService } from 'src/app/core/services/operations.service';
import { CreateOperationVM } from 'src/app/shared/models/createOperationVM';
import { Operation } from 'src/app/shared/models/operation';
import { Setting } from 'src/app/shared/models/setting';
import { ExecutionNames } from '../../execution-names';
import { AddOperationComponent } from '../../flows/add-operation/add-operation.component';

@Component({
    selector: 'get-jobstep-action-operation',
    templateUrl: './get-jobstep-action-operation.component.html',
})

export class GetJobStepActionOperationComponent implements OnInit, AfterViewInit {

    form!: FormGroup;
    isGroupMatching = new FormControl(false);
    isProductLevelMatching = new FormControl(false);
    isFirstRoute = new FormControl(false);
    operations!: Operation[];
    flowId!: number;
    executionName = "GetJobStepAction";

    types: any[] = [{ id: 1, name: "Action" },
    { id: 2, name: "Trigger" }];

    constructor(private fb: FormBuilder,
        private operationService: OperationService,
        private dialogRef: MatDialogRef<AddOperationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService) {
    };

    ngAfterViewInit(): void {
        this.flowId = ~~this.data.flowId;
        console.log("flowId", this.flowId);
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            rawSqlFilterJobStep: [null, Validators.required],
            description: [null, Validators.required],
            name: [null, Validators.required],
        });
    };

    public save(): void {
        let settings: Setting[] = [
            {
                key: "rawSqlFilterJobStep",
                name: "Filter Job-Step",
                value: this.form.get('rawSqlFilterJobStep')?.value
            },
        ];

        let createOperationVM: CreateOperationVM = {
            flowId: this.flowId,
            type: ~~this.types[0], // type action
            name: this.form.get('name')?.value,
            description: this.form.get('description')?.value,
            executionName: this.executionName,
            settings: settings,
            firstRoute: this.isFirstRoute?.value || false
        };

        console.log("createOperationVM", createOperationVM);

        this.operationService.addOperation(createOperationVM)
            .subscribe(() => {
                this.alertService.showToastSuccess();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });

        this.dialogRef.close({ event: "save", data: this.form.value });
    }

    close() {
        this.dialogRef.close({ event: "close", data: this.form.value });
    }

}