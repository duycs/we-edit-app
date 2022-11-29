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

  public data!: Staff[];
  public pageSettings!: PageSettingsModel;

  ngOnInit(): void {
    this.getStaffs();
  }

  getStaffs(): void {
    this.staffService.getStaffs(this.page, this.size, true)
      .subscribe(res => {
        this.data = this.mappingDisplayNameOfRoleAndProductLevel(res.data);

        this.pageSettings = { pageSize: this.size };
        console.log(res);
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
            return productLevelnames += productLevel.name;
          } else {
            return productLevelnames += ", " + productLevel.name;
          }
        });
        staff.productLevelnames = productLevelnames;
      }
    });

    return staffs;
  }

}