import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { JobService } from 'src/app/core/services/jobs.service';
import { CommandClickEventArgs, CommandModel, EditSettingsModel, PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { StepService } from 'src/app/core/services/steps.service';
import { DataManager } from '@syncfusion/ej2-data';
import { StaffService } from 'src/app/core/services/staffs.service';
import { JobStep } from 'src/app/shared/models/jobStep';

@Component({
  selector: 'app-staff-detail',
  templateUrl: './staff-detail.component.html',
  styleUrls: ['./staff-detail.component.css']
})

export class StaffDetailComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
  users: Staff[] = [];

  page: number = 1;
  size: number = 100;

  public staffId!: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private jobService: JobService,
    private staffService: StaffService,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  public jobSteps!: object[];
  public staff!: DataManager;
  public pageSettings!: PageSettingsModel;

  ngOnInit(): void {
    this.staffId = this.route.snapshot.params['id'];
    this.fetchJobSteps(this.staffId);
    this.fetchStaff(this.staffId);
  }

  fetchStaff(id: number): void {
    this.staffService.getStaff(id)
      .subscribe(res => {
        let resMapped = this.mappingDisplayNameOfRoleAndProductLevel(res);
        let data = [resMapped];
        this.staff = new DataManager(data);
        console.log("staff", this.staff);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  fetchJobSteps(id: number): void {
    this.staffService.getJobStepsOfStaff(id)
      .subscribe(res => {
        this.jobSteps = this.mappingDisplayNameJobStepStatus(res);
        this.pageSettings = { pageSize: this.size };
        console.log('jobSteps', this.jobSteps);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  mappingDisplayNameOfRoleAndProductLevel(staff: Staff) {
    if (staff.roles != null && staff.roles.length > 0) {
      let rolenames = "";
      staff.roles.map((role, i) => {
        if (i == 0) {
          return rolenames += role.name;
        } else {
          return rolenames += ", " + role.name;
        }
      });
      staff.rolenames = rolenames;
    }

    if (staff.productLevels != null && staff.productLevels.length > 0) {
      let productLevelnames = "";
      staff.productLevels.map((productLevel, i) => {
        if (i == 0) {
          return productLevelnames += productLevel.code;
        } else {
          return productLevelnames += ", " + productLevel.code;
        }
      });
      staff.productLevelnames = productLevelnames;
    }

    let statusNameVal = "";

    if (staff.currentShiftId != null) {
      switch (staff.currentShiftId) {
        case 0:
          staff.currentShiftname = "none";
          statusNameVal = "none";
          break;

        case 6:
          staff.currentShiftname = "none";
          statusNameVal = "none";
          break;

        case 1:
          staff.currentShiftname = "Shift 1";
          statusNameVal = "In Shift";
          break;

        case 2:
          staff.currentShiftname = "Shift 2";
          statusNameVal = "In Shift";
          break;

        case 3:
          staff.currentShiftname = "Shift 3";
          statusNameVal = "In Shift";
          break;

        case 4:
          staff.currentShiftname = "Out";
          statusNameVal = "Out Shift";
          break;

        case 5:
          staff.currentShiftname = "Free";
          statusNameVal = "Free";
          break;

        default:
          staff.currentShiftname = "none";
          statusNameVal = "none";
          break;
      }

      if (staff.isAssigned != null && staff.isAssigned) {
        statusNameVal = "Is Assigned";
      }

      staff.statusname = statusNameVal;
    }

    return staff;
  }

  mappingDisplayNameJobStepStatus(jobSteps: JobStep[]) {
    jobSteps.forEach(jobStep => {
      switch (jobStep.status) {
        case 0:
          jobStep.statusname = "Todo";
          break;

        case 1:
          jobStep.statusname = "Doding";
          break;

        case 2:
          jobStep.statusname = "Done";
          break;

        case 3:
          jobStep.statusname = "Approved";
          break;

        case 4:
          jobStep.statusname = "Rejected";
          break;

        case 5:
          jobStep.statusname = "Pending";
          break;

        case 6:
          jobStep.statusname = "Assigned";
          break;

        default:
          jobStep.statusname = "none";
          break;
      }
    })

    return jobSteps;
  }

}