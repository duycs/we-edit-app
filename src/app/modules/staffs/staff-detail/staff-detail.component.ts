import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { StaffService } from 'src/app/core/services/staffs.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { RemoveStepOfJobComponent } from '../../jobs/remove-step-of-job/remove-step-of-job.component';
import { UpdateStepStatusVM } from 'src/app/shared/models/updateStepStatusVM';
import { UpdateStepStatusComponent } from '../update-step-status/update-step-status.component';
import { NoteService } from 'src/app/core/services/notes.service';
import { JobStepDto } from 'src/app/shared/models/jobStepDto';

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

  displayedStaffColumns: string[] = ['account', 'fullname', "email", 'roles', "productLevels", "currentShift", "isAssigned", "status", 'id',];

  displayedJobStepColumns: string[] = ['action', 'name', 'productLevel', 'inputNumber', 'worker', 'shift', 'estimationInSeconds',
    'startTime', 'endTime', 'statusname', 'notes', 'id'];

  staffs!: Staff[];
  jobStepDtos = new MatTableDataSource<JobStepDto>([]);
  staffId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private staffService: StaffService,
    private noteService: NoteService,
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
    this.staffService.getJobStepsOfStaff(this.staffId)
      .subscribe(res => {
        console.log(res);
        this.jobStepDtos.data = this.mappingModel.MappingDisplayNameFieldsOfJobStepDtos(res);
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

  openRemoveStepOfStaffDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveStepOfJobComponent, {
      data: { staffId: this.staffId, staffName: this.staffs[0].fullName, stepId: element.step.id, stepName: element.step.name },
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

  openUpdateStepStatus(jobStep: any, status: number) {
    let updateStepStatusVM: UpdateStepStatusVM = {
      jobId: jobStep.job.id,
      staffId: this.staffId,
      stepId: jobStep.step.id,
      status: status,
    };

    console.log("updateStepStatusVM", updateStepStatusVM);

    this.staffService.updateStepStatus(updateStepStatusVM)
      .subscribe(res => {
        this.alertService.showToastSuccess();
        setTimeout(() => {
          console.log("reload after updated");
          this.getJobSteps();
          this.getStaff();
        }, 2000);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  openUpdateStepStatusDialog(jobStep: any, status: number): void {
    const dialogRef = this.dialog.open(UpdateStepStatusComponent, {
      data: {
        jobstep: {id: jobStep.id, oldStatusname: jobStep.statusname},
        job: {id: jobStep.job.id},
        staff: { id: this.staffId },
        step: { id: jobStep.step.id, name: jobStep.step.name, status: status, statusname: this.mappingModel.MappingStepStatus(status) },
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after updated", result);
        this.getJobSteps();
        this.getStaff();
      }, 2000);
    });
  }

}