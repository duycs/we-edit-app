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
import { AddStepsToJobVM } from 'src/app/shared/models/addStepsToJobVM';
import { ProductLevel } from 'src/app/shared/models/productLevel';

@Component({
    selector: 'add-job-step',
    templateUrl: './add-job-step.component.html',
    styleUrls: ['./add-job-step.component.css']
})

export class AddJobStepComponent implements OnInit {

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

    public addStepsToJobVM!: AddStepsToJobVM;

    ngOnInit() {
        //this.initilaizeTarget();
        this.dialogObj?.hide();
        this.jobId = this.route.snapshot.params['id'];
        this.fetchSteps();
        console.log('jobId', this.jobId);
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
        this.setAddStepsToJobVM();

        console.log(JSON.stringify(this.addStepsToJobVM));

        this.jobService.addStepsToJob(this.addStepsToJobVM)
            .subscribe(res => {
                this.alertService.showToastSuccess();
                //this.router.navigate([`/jobs/${this.jobId}`]);
                window.location.reload();
            }, (err) => {
                this.alertService.showToastError();
                console.log(err);
            });
    }

    public setAddStepsToJobVM: EmitType<object> = () => {
        const dialogId = 'FormDialog';

        let stepId = document.getElementById(dialogId)?.querySelector('#stepId_hidden') as HTMLInputElement;
        this.addStepsToJobVM = {
            jobId: this.jobId,
            stepIds: [~~stepId.value]
        };
    }
}