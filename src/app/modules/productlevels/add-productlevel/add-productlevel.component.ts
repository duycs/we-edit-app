import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { AlertService } from 'src/app/core/services/alert.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';

@Component({
    selector: 'add-productlevel',
    templateUrl: './add-productLevel.component.html',
    styleUrls: ['./add-productLevel.component.css']
})

export class AddProductLevelComponent implements OnInit {

    constructor(private router: Router,
        private productLevelService: ProductLevelService,
        private alertService: AlertService) {
    };

    @ViewChild('formUpload')
    public uploadObj!: UploaderComponent;

    @ViewChild('FormDialogProductLevel')
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

        this.productLevelService.addProductLevel(formData)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                //this.router.navigate(['/productLevels']);
                window.location.reload();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public getDynamicContent: EmitType<object> = () => {
        const dialogId = 'FormDialogProductLevel';
        let name = document.getElementById(dialogId)?.querySelector('#name') as HTMLInputElement;
        let code = document.getElementById(dialogId)?.querySelector('#code') as HTMLInputElement;
        let description = document.getElementById(dialogId)?.querySelector('#description') as HTMLInputElement;

        let data = {
            name: name.value,
            code: code.value,
            description: description.value,
        };

        return data;
    }
}