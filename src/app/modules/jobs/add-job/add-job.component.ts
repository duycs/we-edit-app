import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { AlertService } from 'src/app/core/services/alert.service';
import { APISignalRService } from 'src/app/core/services/api-signalr.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { CreateJobVM } from 'src/app/shared/models/createJobVM';

@Component({
    selector: 'add-job',
    templateUrl: './add-job.component.html',
    styleUrls: ['./add-job.component.css']
})

export class AddJobComponent implements OnInit {

    constructor(private router: Router,
        private jobService: JobService,
        private apiSignalRService: APISignalRService,
        private productLevelService: ProductLevelService,
        private staffService: StaffService,
        private alertService: AlertService) {
    };

    @ViewChild('formUpload')
    public uploadObj!: UploaderComponent;

    @ViewChild('FormDialog')
    public dialogObj!: DialogComponent;

    public width: string = '335px';
    public visible: boolean = false;
    public multiple: boolean = false;
    public showCloseIcon: Boolean = true;
    public formHeader: string = 'Success';
    public contentData: string = 'Your details have been updated successfully, Thank you.';
    public target: string = '#FormDialog';
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

    // locations
    public locationdata: { [key: string]: Object }[] = [{ Id: 0, Name: 'Select a Location' }, { Id: 1, Name: 'EU' }, { Id: 2, Name: 'US' }, { Id: 3, Name: 'AU' }];
    // maps the appropriate column to fields property
    public locationfields: Object = { text: 'Name', value: 'Id' };
    //set the placeholder to DropDownList input
    public locationtext: string = "Select a Location";

    // deliverTypes
    public deliverTypedata: { [key: string]: Object }[] = [{ Id: 0, Name: 'Select a Deliver Type' }, { Id: 1, Name: 'V1' }, { Id: 2, Name: 'V2' }, { Id: 3, Name: 'V3' }];
    public deliverTypefields: Object = { text: 'Name', value: 'Id' };
    public deliverTypetext: string = "Select a Deliver Type";

    // apps
    public appdata: { [key: string]: Object }[] = [{ Id: 0, Name: 'Select an App' }, { Id: 1, Name: 'App 1' }, { Id: 2, Name: 'App 2' }, { Id: 3, Name: 'App 3' }];
    public appfields: Object = { text: 'Name', value: 'Id' };
    public apptext: string = "Select an App";

    public productLeveldata: { [key: string]: Object }[] = [];
    public productLevelfields: Object = { text: 'Name', value: 'Id' };
    public productLeveltext: string = "Select an ProductLevel";

    public csodata: { [key: string]: Object }[] = [];
    public csofields: Object = { text: 'Name', value: 'Id' };
    public csotext: string = "Select a CSO";

    public createJobVM!: CreateJobVM;

    ngOnInit() {
        //this.initilaizeTarget();
        this.dialogObj?.hide();

        // fetch productLevels, staffs
        this.fetchProductLevelDropdown();
        this.fetchCSOStaffDropdown();

        // this.apiSignalRService.startConnection();
        // this.apiSignalRService.addGetJobsListener();
    }

    fetchProductLevelDropdown() {
        this.productLevelService.getProductLevels()
            .subscribe(res => {
                console.log(res);
                res.forEach(element => {
                    this.productLeveldata.push({ Id: element.id, Name: element.code });
                });
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    fetchCSOStaffDropdown() {
        this.staffService.getStaffs(1, 1000, true)
            .subscribe(res => {
                console.log(res);
                res.data.forEach(element => {
                    this.csodata.push({ Id: element.id, Name: element.fullName });
                });
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    initilaizeTarget: EmitType<object> = () => {
        // ISSUE: Cannot read properties of undefined (reading 'nativeElement')
        this.targetElement = this.container.nativeElement.parentElement;
    }

    public onOpenDialog(event: any): void {
        // ISSUE:  Cannot read properties of undefined (reading 'show')
        this.dialogObj.show();

        document.getElementById('container-ejs-dialog')?.style.setProperty('display', 'block');
    }

    public browseClick() {
        document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button')?.click(); return false;
    }

    public Submit(): void {
        this.onFormSubmit();
        document.getElementById('container-ejs-dialog')?.style.setProperty('display', 'none');
    }
    public onFileSelect: EmitType<Object> = (args: any) => {
        this.uploadInput = args.filesData[0].name;
    }

    public onFormSubmit(): void {
        this.dialogObj.show();
        this.setCreateJobVM();

        console.log(JSON.stringify(this.createJobVM));

        this.jobService.addJob(this.createJobVM)
            .subscribe(res => {
                let id = res.id;
                this.alertService.showToastSuccess();
                console.log("id", id);
                this.router.navigate([`/jobs/${id}`]);
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public setCreateJobVM: EmitType<object> = () => {
        const dialogId = 'FormDialog';
        let date = document.getElementById(dialogId)?.querySelector('#date') as HTMLInputElement;
        let locationId = document.getElementById(dialogId)?.querySelector('#locationId_hidden') as HTMLInputElement;
        let cso = document.getElementById(dialogId)?.querySelector('#csoId_hidden') as HTMLInputElement;
        let jobName = document.getElementById(dialogId)?.querySelector('#jobName') as HTMLInputElement;
        let code = document.getElementById(dialogId)?.querySelector('#code') as HTMLInputElement;
        let inputNumber = document.getElementById(dialogId)?.querySelector('#inputNumber') as HTMLInputElement;
        let instruction = document.getElementById(dialogId)?.querySelector('#instruction') as HTMLInputElement;
        let deliverTypeId = document.getElementById(dialogId)?.querySelector('#deliverTypeId_hidden') as HTMLInputElement;
        let productLevelId = document.getElementById(dialogId)?.querySelector('#productLevelId_hidden') as HTMLInputElement;
        let deadline = document.getElementById(dialogId)?.querySelector('#deadline') as HTMLInputElement;
        let appId = document.getElementById(dialogId)?.querySelector('#appId_hidden') as HTMLInputElement;

        this.createJobVM = {
            date: new Date(date.value),
            csoStaffId: ~~cso.value,
            locationId: ~~locationId.value,
            jobName: jobName.value,
            code: code.value,
            inputNumber: ~~inputNumber.value,
            instruction: instruction.value,
            deliverTypeId: ~~deliverTypeId.value,
            productLevelId: ~~productLevelId.value,
            deadline: new Date(deadline.value),
            appId: ~~appId.value,
            inputInfo: ""
        };
    }
}