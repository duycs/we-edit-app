import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { StaffService } from 'src/app/core/services/staffs.service';
import { JobStep } from 'src/app/shared/models/jobStep';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { AddJobStepComponent } from '../../jobs/add-job-step/add-job-step.component';
import { AssignStaffComponent } from '../../jobs/assign-staff/assign-staff.component';
import { RemoveStepOfJobComponent } from '../../jobs/remove-step-of-job/remove-step-of-job.component';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['../../../shared/components/table/table-base.component.scss']
})

export class StaffDetailComponent implements OnInit {
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

  displayedStaffColumns: string[] = ['account','fullname',  "email", 'roles', "productLevels", "currentShift", "isAssigned", "status", 'id',];

  displayedJobStepColumns: string[] = ['action', 'name', 'productLevel', 'inputNumber', 'worker', 'shift', 'estimationInSeconds',
    'startTime', 'endTime', 'statusname', 'id',];

  staffs!: Staff[];
  jobSteps = new MatTableDataSource<JobStep>([]);
  staffId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private staffService: StaffService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  ngAfterViewInit() {
    this.getJobSteps();
  }

  getJobSteps() {
    this.staffService.getJobStepsOfStaff(this.staffId)
      .subscribe(res => {
        console.log(res);
        this.jobSteps.data = this.mappingModel.MappingDisplayNameFieldsOfJobSteps(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  getStaff() {
    this.staffService.getStaff(this.staffId)
      .subscribe(res => {
        var staffMapped = this.mappingModel.MappingDisplayNameFieldsOfStaff(res);
        this.staffs = [staffMapped];
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.staffId = this.route.snapshot.params['id'];
    this.getStaff();
  }

  onRowClicked(row: any) {
  }

  openAddStepForJobDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { staffId: this.staffId };

    const dialogRef = this.dialog.open(AddJobStepComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          console.log("reload after added", result);
          this.getJobSteps();
          this.getStaff();
        }, 2000);
      }
    );
  }

  openRemoveStepOfStaffDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveStepOfJobComponent, {
      data: { staffId: this.staffId, jobName: this.staffs[0].fullName, stepId: element.step.id, stepName: element.step.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after removed", result);
        this.getJobSteps();
        this.getStaff();
      }, 2000);
    });
  }

  openUpdateJobDialog(element: any) {
    console.log("updateJobDialog");
  }

  openAssignStaffForStepOfJobDialog(element: any) {
    const dialogRef = this.dialog.open(AssignStaffComponent, {
      data: { staffId: this.staffId, jobName: this.staffs[0].fullName, stepId: element.step.id, stepName: element.step.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after added", result);
        this.getJobSteps();
        this.getStaff();
      }, 2000);
    });
  }

}