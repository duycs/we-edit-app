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
import { JobStep } from 'src/app/shared/models/jobStep';
import { Job } from 'src/app/shared/models/job';

@Component({
  selector: 'app-job-detail',
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
})

export class JobDetailComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
  users: Staff[] = [];

  page: number = 1;
  size: number = 100;

  public jobId!: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private jobService: JobService,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  public jobSteps!: object[];
  public job!: DataManager;
  public pageSettings!: PageSettingsModel;

  ngOnInit(): void {
    this.jobId = this.route.snapshot.params['id'];
    this.fetchJobSteps(this.jobId);
    this.fetchJob(this.jobId);
  }

  // assignClick(data: any): void {
  //   console.log(JSON.stringify(data));
  // }

  fetchJob(id: number): void {
    this.jobService.getJob(id)
      .subscribe(res => {
        let jobMapped = this.mappingDisplayNameOfLocationAndStatus(res);
        let data = [jobMapped];
        this.job = new DataManager(data);
        console.log("job", this.job);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  fetchJobSteps(id: number): void {
    this.jobService.getJobSteps(id)
      .subscribe(res => {
        this.jobSteps = this.mappingDisplayNameStatus(res);
        this.pageSettings = { pageSize: this.size };
        console.log('jobSteps', this.jobSteps);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  mappingDisplayNameStatus(jobSteps: JobStep[]) {
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

  mappingDisplayNameOfLocationAndStatus(job: Job) {
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

    return job;
  }

}