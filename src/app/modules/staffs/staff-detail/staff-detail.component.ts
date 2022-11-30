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
        let data = [res];
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
        this.jobSteps = res;
        this.pageSettings = { pageSize: this.size };
        console.log('jobSteps', this.jobSteps);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

}