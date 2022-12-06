import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { JobService } from 'src/app/core/services/jobs.service';
import { Job } from 'src/app/shared/models/job';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddJobComponent } from '../add-job/add-job.component';
import { RemoveJobComponent } from '../remove-job/remove-job.component';
import { JobStep } from 'src/app/shared/models/jobStep';
import { JobsDataSource } from '../jobs-data-source';
import { AddJobStepComponent } from '../add-job-step/add-job-step.component';
import { RemoveStepOfJobComponent } from '../remove-step-of-job/remove-step-of-job.component';
import { MatTableDataSource } from '@angular/material/table';
import { AssignStaffComponent } from '../assign-staff/assign-staff.component';

@Component({
  selector: 'job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})

export class JobDetailComponent implements OnInit, AfterViewInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
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

  displayedJobColumns: string[] = ['id', 'date', 'location', 'cso', 'jobId', 'code', 'instruction', 'inputNumber',
    'productLevel', 'startTime', 'endTime', 'deadline', 'deliverType', 'app',];

  displayedJobStepColumns: string[] = ['action', 'id', 'name', 'productLevel', 'inputNumber', 'worker', 'shift', 'estimationInSeconds',
    'startTime', 'endTime', 'statusname'];

  jobs!: Job[];
  jobSteps = new MatTableDataSource<JobStep>([]);
  jobId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private jobService: JobService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
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
        }, 2000);
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
      }, 2000);
    });
  }

  openUpdateJobDialog(element: any) {
    console.log("updateJobDialog");
  }

  openAssignStaffForStepOfJobDialog(element: any) {
    const dialogRef = this.dialog.open(AssignStaffComponent, {
      data: { jobId: this.jobId, jobName: this.jobs[0].code, stepId: element.step.id, stepName: element.step.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after added", result);
        this.getJobSteps();
        this.getJob();
      }, 2000);
    });
  }

}