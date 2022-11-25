import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';

@Component({
    selector: 'add-job',
    templateUrl: './add-job.component.html',
    styleUrls: ['./add-job.component.css']
})

export class AddJobComponent {

    constructor(private router: Router,
        private jobService: JobService,
        private alertService: AlertService) {
    };

    @ViewChild('formUpload')
    public uploadObj!: UploaderComponent;
    @ViewChild('Dialog')
    public dialogObj!: DialogComponent;
    public width: string = '335px';
    public visible: boolean = false;
    public multiple: boolean = false;
    public showCloseIcon: Boolean = true;
    public formHeader: string = 'Success';
    public contentData: string = 'Your details have been updated successfully, Thank you.';
    public target: string = '#addJobDialog';
    public isModal: boolean = true;
    public animationSettings: object = {
        effect: 'Zoom'
    };
    public uploadInput: string = '';
    public dlgBtnClick: EmitType<object> = () => {
        this.dialogObj.hide();
    }
    public dlgButtons: Object[] = [{ click: this.dlgBtnClick.bind(this), buttonModel: { content: 'Ok', isPrimary: true } }];
    @ViewChild('formElement') element: any;
    @ViewChild('container', { read: ElementRef }) container!: ElementRef;
    public targetElement!: HTMLElement;

    public onOpenDialog(event: any): void {
        this.dialogObj.show();
    }

    public browseClick() {
        //document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')?.click(); return false;
    }

    public Submit(): void {
        this.onFormSubmit();
    }
    public onFileSelect: EmitType<Object> = (args: any) => {
        this.uploadInput = args.filesData[0].name;
    }

    public onFormSubmit(): void {
        this.dialogObj.show();
        let formData = this.getDynamicContent();
        console.log(JSON.stringify(formData));

        this.jobService.addJob(formData)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                this.router.navigate(['/jobs']);
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public getDynamicContent: EmitType<object> = () => {
        const dialogId = 'addJobDialog';
        let date = document.getElementById(dialogId)?.querySelector('#date') as HTMLInputElement;
        let locationId = document.getElementById(dialogId)?.querySelector('#locationId') as HTMLInputElement;
        let cso = document.getElementById(dialogId)?.querySelector('#cso') as HTMLInputElement;
        let jobName = document.getElementById(dialogId)?.querySelector('#jobName') as HTMLInputElement;
        let code = document.getElementById(dialogId)?.querySelector('#code') as HTMLInputElement;
        let picNumber = document.getElementById(dialogId)?.querySelector('#picNumber') as HTMLInputElement;
        let instruction = document.getElementById(dialogId)?.querySelector('#instruction') as HTMLInputElement;
        let deliverTypeId = document.getElementById(dialogId)?.querySelector('#deliverTypeId') as HTMLInputElement;
        let productLevelId = document.getElementById(dialogId)?.querySelector('#productLevelId') as HTMLInputElement;
        let deadline = document.getElementById(dialogId)?.querySelector('#deadline') as HTMLInputElement;
        let appId = document.getElementById(dialogId)?.querySelector('#appId') as HTMLInputElement;

        let data = {
            date: date.value,
            csoStaffId: cso.value,
            locationId: locationId.value,
            jobName: jobName.value,
            code: code.value,
            picNumber: picNumber.value,
            instruction: instruction.value,
            deliverTypeId: deliverTypeId.value,
            productLevelId: productLevelId.value,
            deadline: deadline.value,
            appId: appId.value,
            InputInfo: ""
        };

        return data;
    }
}