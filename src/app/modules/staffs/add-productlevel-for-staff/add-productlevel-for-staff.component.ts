import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';

@Component({
    selector: 'add-productlevel-for-staff',
    templateUrl: './add-productlevel-for-staff.component.html',
    styleUrls: ['./add-productlevel-for-staff.component.css']
})

export class AddProductLevelForStaffComponent implements OnInit {

    constructor(private router: Router,
        private jobService: JobService,
        private productLevelService: ProductLevelService,
        private staffService: StaffService,
        private alertService: AlertService) {
    };

    @ViewChild('formUpload')
    public uploadObj!: UploaderComponent;

    @ViewChild('FormDialogAddProductLevelForStaff')
    public dialogObj!: DialogComponent;

    public width: string = '335px';
    public visible: boolean = false;
    public multiple: boolean = false;
    public showCloseIcon: Boolean = true;
    public formHeader: string = 'Success';
    public contentData: string = 'Your details have been updated successfully, Thank you.';
    public target: string = '#FormDialogAddProductLevelForStaff';
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

    public staffdata: { [key: string]: Object }[] = [];
    public stafffields: Object = { text: 'Name', value: 'Id' };
    public stafftext: string = "Select a Staff";

    ngOnInit() {
        this.dialogObj?.hide();
        this.fetchProductLevelDropdown();
        this.fetchStaffDropdown();
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

    fetchStaffDropdown() {
        this.staffService.getStaffs(1, 1000, true)
            .subscribe(res => {
                console.log(res);
                res.data.forEach(element => {
                    this.staffdata.push({ Id: element.id, Name: element.fullName });
                });
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public onOpenAddProductLevelDialog(event: any): void {
        // ISSUE:  Cannot read properties of undefined (reading 'show')
        this.dialogObj.show();
        document.getElementById('container-ejs-dialog')?.style.setProperty('display', 'block');
    }

    public Submit(): void {
        this.onFormSubmit();
        document.getElementById('container-ejs-dialog')?.style.setProperty('display', 'none');
    }

    public onFormSubmit(): void {
        this.dialogObj.show();
        let formData = this.getDynamicContent();

        this.staffService.addProductLevelsForStaff(formData)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                //this.router.navigate(['/staffs']);
                window.location.reload();

            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public getDynamicContent: EmitType<object> = () => {
        const dialogId = 'FormDialogAddProductLevelForStaff';
        let staffId = document.getElementById(dialogId)?.querySelector('#staffId_hidden') as HTMLInputElement;
        let productlevelId = document.getElementById(dialogId)?.querySelector('#productLevelId_hidden') as HTMLInputElement;

        let data = {
            staffId: ~~staffId.value,
            productLevelId: ~~productlevelId.value,
        };

        return data;
    }
}