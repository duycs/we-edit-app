import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { JobService } from 'src/app/core/services/jobs.service';
import { Job } from 'src/app/shared/models/job';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { StaffService } from 'src/app/core/services/staffs.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})

export class StaffListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
  users: Staff[] = [];

  public jobs!: Job[];
  page: number = 1;
  size: number = 100;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private staffService: StaffService,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  public staffs!: Staff[];
  public pageSettings!: PageSettingsModel;

  ngOnInit(): void {
    this.getStaffs();
  }

  inShiftClick(data: any): void {
    let staffInShiftVM = {
      staffId: data.id
    };

    this.staffService.addInShiftForStaff(staffInShiftVM)
      .subscribe(res => {
        this.alertService.showToastSuccess();
        this.getStaffs();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  outShiftClick(data: any): void {
    let staffOutShiftVM = {
      staffId: data.id
    };

    this.staffService.addOutShiftForStaff(staffOutShiftVM)
      .subscribe(res => {
        this.alertService.showToastSuccess();
        this.getStaffs();
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  getStaffs(): void {
    this.staffService.getStaffs(this.page, this.size, true)
      .subscribe(res => {
        this.staffs = this.mappingDisplayNameOfRoleAndProductLevel(res.data);
        this.pageSettings = { pageSize: this.size };
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  mappingDisplayNameOfRoleAndProductLevel(staffs: Staff[]) {
    staffs.forEach(staff => {
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

        if (staff.isAssigned == null) {
          statusNameVal = "Is Assigned";
        }

        staff.statusname = statusNameVal;
      }
    });

    return staffs;
  }

}