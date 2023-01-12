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
    selector: 'assign-action-operation',
    templateUrl: './assign-action-operation.component.html',
})

export class AssignActionOperationComponent implements OnInit, AfterViewInit {

    form!: FormGroup;
    isGroupMatching = new FormControl(false);
    isProductLevelMatching = new FormControl(false);
    //matchingAssignSetting = new FormControl();
    operations!: Operation[];
    flowId!: number;
    executionName = "AssignAction";

    types: any[] = [{ id: 1, name: "Action" },
    { id: 2, name: "Trigger" }];

    // matchingAssignSettings: any[] = [
    //     { id: 1, key: "IsGroupMatching", name: "Group Matching" },
    //     { id: 1, key: "IsProductLevelMatching", name: "ProductLevel Matching" },
    // ];

    IsGroupMatching: boolean = false;
    IsProductLevelMatching: boolean = false;

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
            rawSqlFilterStaff: [null, Validators.required],
            validJobStepIsExpriedMethod: [null, Validators.required],
            description: [null, Validators.required],
            name: [null, Validators.required],
        });
    };

    public save(): void {
        let settingMatching = {
            IsGroupMatching: this.isGroupMatching?.value || false,
            IsProductLevelMatching: this.isProductLevelMatching?.value || false
        };

        let settings: Setting[] = [
            {
                key: "rawSqlFilterJobStep",
                name: "Filter Job-Step",
                value: this.form.get('rawSqlFilterJobStep')?.value
            },
            {
                key: "rawSqlFilterStaff",
                name: "Filter Staff",
                value: this.form.get('rawSqlFilterStaff')?.value
            },
            {
                key: "validJobStepIsExpriedMethod",
                name: "Valid JobStep IsExpried method",
                value: this.form.get('validJobStepIsExpriedMethod')?.value
            },
            {
                key: "matchingAssignSetting",
                name: "Matching assign setting",
                value: JSON.stringify(settingMatching)
            }
        ];

        let createOperationVM: CreateOperationVM = {
            flowId: this.flowId,
            type: ~~this.types[0], // type action
            name: this.form.get('name')?.value,
            description: this.form.get('description')?.value,
            executionName: this.executionName,
            settings: settings
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