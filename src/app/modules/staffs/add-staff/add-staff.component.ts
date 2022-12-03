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
import { CreateStaffVM } from 'src/app/shared/models/createStaffVM';
import { ProductLevel } from 'src/app/shared/models/productLevel';

@Component({
    selector: 'add-staff',
    templateUrl: './add-staff.component.html',
    styleUrls: ['./add-staff.component.css']
})

export class AddStaffComponent implements OnInit {

    constructor(private router: Router,
        private jobService: JobService,
        private productLevelService: ProductLevelService,
        private staffService: StaffService,
        private alertService: AlertService) {
    };

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

    public roledata: { [key: string]: Object }[] =
        [
            { Id: 0, Name: 'Select a Role' },
            { Id: 1, Name: 'Admin' },
            { Id: 2, Name: 'CSO' },
            { Id: 3, Name: 'Editor' },
            { Id: 4, Name: 'High Quanlity' },
            { Id: 5, Name: 'Merge Retouch' },
            { Id: 6, Name: 'Video' },
            { Id: 7, Name: '2D&3D' },
            { Id: 8, Name: 'QC' },
            { Id: 9, Name: 'DCQC' }
        ];

    public rolefields: Object = { text: 'Name', value: 'Id' };
    public roletext: string = "Select a Role";

    public createStaffVM!: CreateStaffVM;

    ngOnInit() {
        this.dialogObj?.hide();
    }

    public onOpenAddStaffDialog(event: any): void {
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
        this.setCreateStaffVM();

        this.staffService.addStaff(this.createStaffVM)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                this.router.navigate([`/staffs/${res.id}`]);
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public setCreateStaffVM: EmitType<object> = () => {
        const dialogId = 'FormDialogStaff';
        let fullname = document.getElementById(dialogId)?.querySelector('#fullname') as HTMLInputElement;
        let account = document.getElementById(dialogId)?.querySelector('#account') as HTMLInputElement;
        let email = document.getElementById(dialogId)?.querySelector('#email') as HTMLInputElement;
        let roleId = document.getElementById(dialogId)?.querySelector('#roleId_hidden') as HTMLInputElement;

        this.createStaffVM = {
            fullname: fullname.value,
            account: account.value,
            email: email.value,
            roleIds: [~~roleId.value],
        };
    }
}