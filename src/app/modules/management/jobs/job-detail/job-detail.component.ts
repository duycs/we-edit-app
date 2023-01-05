import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { JobService } from 'src/app/core/services/jobs.service';
import { Job } from 'src/app/shared/models/job';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { JobStep } from 'src/app/shared/models/jobStep';
import { AddJobStepComponent } from '../add-job-step/add-job-step.component';
import { RemoveStepOfJobComponent } from '../remove-step-of-job/remove-step-of-job.component';
import { MatTableDataSource } from '@angular/material/table';
import { AssignStaffComponent } from '../assign-staff/assign-staff.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'job-detail',
  templateUrl: './job-detail.component.html',
})

export class JobDetailComponent implements OnInit, AfterViewInit {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
  users: Staff[] = [];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  pageEvent!: PageEvent;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  displayedJobColumns: string[] = ['code', 'date', 'location', 'cso', 'jobId', 'instruction', 'inputNumber',
    'productLevel', 'startTime', 'endTime', 'deadline', 'deliverType', 'app', 'id',];

  displayedJobStepColumns: string[] = ['action', 'code', 'name', 'productLevel', 'group', 'inputNumber', 'worker', 'shift', 'estimationInSeconds',
    'startTime', 'endTime', 'statusname', 'id',];

  jobs!: Job[];
  jobSteps = new MatTableDataSource<JobStep>([]);
  jobId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private jobService: JobService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  ngAfterViewInit() {
    this.getJobSteps();
  }

  getJobSteps() {
    this.jobService.getJobSteps(this.jobId)
      .subscribe(res => {
        console.log(res);
        this.jobSteps.data = this.mappingModel.MappingDisplayNameFieldsOfJobSteps(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  getJob() {
    this.jobService.getJob(this.jobId)
      .subscribe(res => {
        var jobMapped = this.mappingModel.MappingDisplayNameFieldsOfJob(res);
        this.jobs = [jobMapped];
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.jobId = this.route.snapshot.params['id'];
    this.getJob();
  }

  onRowClicked(row: any) {
  }

  openAddStepForJobDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { jobId: this.jobId };

    const dialogRef = this.dialog.open(AddJobStepComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          console.log("reload after added", result);
          this.getJobSteps();
          this.getJob();
        }, environment.loadtimeout);
      }
    );
  }

  openRemoveStepOfJobDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveStepOfJobComponent, {
      data: { jobId: this.jobId, jobName: this.jobs[0].code, stepId: element.step.id, stepName: element.step.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after removed", result);
        this.getJobSteps();
        this.getJob();
      }, environment.loadTimeout;
    });
  }

  openUpdateJobDialog(element: any) {
    console.log("updateJobDialog");
  }

  openAssignStaffToStepOfJobDialog(element: any) {
    const dialogRef = this.dialog.open(AssignStaffComponent, {
      data: { jobId: this.jobId, jobName: this.jobs[0].code, stepId: element.step.id, stepName: element.step.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after added", result);
        this.getJobSteps();
        this.getJob();
      }, environment.loadTimeout;
    });
  }

}