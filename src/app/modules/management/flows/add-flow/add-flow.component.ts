import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { APISignalRService } from "src/app/core/services/api-signalr.service";
import { FlowService } from "src/app/core/services/flows.service";
import { JobService } from "src/app/core/services/jobs.service";
import { ProductLevelService } from "src/app/core/services/productLevels.service";
import { StaffService } from "src/app/core/services/staffs.service";
import { CreateFlowVM } from "src/app/shared/models/createFlowVM";
import { CreateJobVM } from "src/app/shared/models/createJobVM";
import { ProductLevel } from "src/app/shared/models/productLevel";
import { Staff } from "src/app/shared/models/staff";

@Component({
    selector: 'add-flow',
    templateUrl: './add-flow.component.html',
})

export class AddFlowComponent implements OnInit {
    form!: FormGroup;
    description!: string;
    title: string = "Add new Flow";

    status: any[] = [{ id: 1, name: "Off" },
    { id: 2, name: "On" }];

    types: any[] = [{ id: 1, name: "Automated" },
    { id: 2, name: "Instant" },
    { id: 3, name: "Scheduled" }];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddFlowComponent>,
        private router: Router,
        private flowService: FlowService,
        private apiSignalRService: APISignalRService,
        private staffService: StaffService,
        private alertService: AlertService) {
    };

    ngOnInit(): void {
        this.form = this.fb.group({
            name: [null, Validators.required],
            description: [null, Validators.required],
            statusId: [null, Validators.required],
            typeId: [null, Validators.required],
        });
    };

    save() {
        this.dialogRef.close(this.form.value);
        console.log("form value", this.form.value);

        let createFlowVM: CreateFlowVM = {
            status: ~~this.form.get('statusId')?.value,
            type: ~~this.form.get('typeId')?.value,
            name: this.form.get('name')?.value,
            description: this.form.get('description')?.value,
        };

        this.flowService.addFlow(createFlowVM)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                this.router.navigate([`/flows/${res.id}`]);
            }, (err) => {
                this.alertService.showToastError();
            });
    }

    close() {
        this.dialogRef.close(this.form.value);
    }

}