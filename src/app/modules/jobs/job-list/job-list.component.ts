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

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})

export class JobListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
  users: Staff[] = [];

  public jobs!: Job[];
  page: number = 1;
  size: number = 100;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private jobService: JobService,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  public data!: object[];
  public pageSettings!: PageSettingsModel;

  ngOnInit(): void {
    this.getJobs();
  }

  getJobs(): void {
    this.jobService.getJobs(this.page, this.size, true)
      .subscribe(res => {
        this.data = this.mappingDisplayNameOfLocationAndStatus(res.data);
        this.pageSettings = { pageSize: this.size };
        console.log(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  mappingDisplayNameOfLocationAndStatus(jobs: Job[]) {
    jobs.forEach(job => {
      if (job.location != null) {
        switch (job.location) {
          case 0:
            job.locationname = "EU";
            break;

          case 1:
            job.locationname = "US";
            break;

          case 2:
            job.locationname = "AU";
            break;

          default:
            job.locationname = "none";
            break;
        }
      }

      if (job.status != null) {
        switch (job.status) {
          case 0:
            job.statusname = "Todo";
            break;

          case 1:
            job.statusname = "Doing";
            break;

          case 2:
            job.statusname = "Done";
            break;

          case 3:
            job.statusname = "Pending";
            break;

          default:
            job.statusname = "none";
            break;
        }
      }
    });

    return jobs;
  }


}