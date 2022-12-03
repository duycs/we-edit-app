import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { StepService } from 'src/app/core/services/steps.service';
import { ProductLevel } from 'src/app/shared/models/productLevel';

@Component({
    selector: 'add-step',
    templateUrl: './add-step.component.html',
    styleUrls: ['./add-step.component.css']
})

export class AddStepComponent implements OnInit {

    constructor(private router: Router,
        private stepService: StepService,
        private productLevelService: ProductLevelService,
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

    public productLeveldata: { [key: string]: Object }[] = [];
    public productLevelfields: Object = { text: 'Name', value: 'Id' };
    public productLeveltext: string = "Select an ProductLevel";

    ngOnInit() {
        //this.initilaizeTarget();
        this.dialogObj?.hide();
        this.fetchProductLevelDropdown();
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
        let formData = this.getDynamicContent();
        console.log(JSON.stringify(formData));

        this.stepService.addStep(formData)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                //this.router.navigate([`/steps/${res.id}`]);
                window.location.reload();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public getDynamicContent: EmitType<object> = () => {
        const dialogId = 'FormDialogStep';
        let productLevelId = document.getElementById(dialogId)?.querySelector('#productLevelId_hidden') as HTMLInputElement;
        let name = document.getElementById(dialogId)?.querySelector('#name') as HTMLInputElement;
        let code = document.getElementById(dialogId)?.querySelector('#code') as HTMLInputElement;
        let orderNumber = document.getElementById(dialogId)?.querySelector('#orderNumber') as HTMLInputElement;
        let estimationInSeconds = document.getElementById(dialogId)?.querySelector('#estimationInSeconds') as HTMLInputElement;

        let data = {
            name: name.value,
            code: code.value,
            orderNumber: orderNumber.value,
            estimationInSeconds: estimationInSeconds.value,
            productLevelId: productLevelId.value,
        };

        return data;
    }
}