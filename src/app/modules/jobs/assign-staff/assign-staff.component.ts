import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { DialogComponent } from '@syncfusion/ej2-angular-popups';
import { isNullOrUndefined, EmitType } from '@syncfusion/ej2-base';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { StepService } from 'src/app/core/services/steps.service';

@Component({
    selector: 'assign-staff',
    templateUrl: './assign-staff.component.html',
    styleUrls: ['./assign-staff.component.css']
})

export class AssignStaffComponent implements OnInit {

    constructor(private router: Router,
        private route: ActivatedRoute,
        private jobService: JobService,
        private stepService: StepService,
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

    public jobId!: number;

    public stepdata: { [key: string]: Object }[] = [];
    public stepfields: Object = { text: 'Name', value: 'Id' };
    public steptext: string = "Select a Step";

    public staffdata: { [key: string]: Object }[] = [];
    public stafffields: Object = { text: 'Name', value: 'Id' };
    public stafftext: string = "Select a Staff";

    ngOnInit() {
        //this.initilaizeTarget();
        this.dialogObj?.hide();
        this.jobId = this.route.snapshot.params['id'];
        console.log('jobId', this.jobId);

        this.fetchSteps();
        this.fetchStaffs();
    }

    fetchSteps(): void {
        this.stepService.getSteps().subscribe(res => {
            res.forEach(element => {
                this.stepdata.push({ Id: element.id, Name: element.name });
            });
        }, (err) => {
            this.alertService.showToastError();
            console.log(err);
        });
    }

    fetchStaffs() {
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
        let formData = this.getAssignStaffToStepVM();
        console.log(JSON.stringify(formData));

        this.jobService.assignStaffToStep(formData)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                this.router.navigate([`/jobs/${this.jobId}`]);
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public getAssignStaffToStepVM: EmitType<object> = () => {
        const dialogId = 'FormDialogAssignStaff';

        let staffId = document.getElementById(dialogId)?.querySelector('#staffId_hidden') as HTMLInputElement;
        let stepId = document.getElementById(dialogId)?.querySelector('#stepId_hidden') as HTMLInputElement;
        let data = {
            jobId: ~~this.jobId,
            staffId: ~~staffId.value,
            stepId: ~~stepId.value
        };

        return data;
    }
}