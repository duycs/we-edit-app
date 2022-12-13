import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { StepService } from 'src/app/core/services/steps.service';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { Staff } from 'src/app/shared/models/staff';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
  users: Staff[] = [];

  jobsCount: number = 0;
  stepsCount: number = 0;
  staffsCount: number = 0;
  productLevelsCount: number = 0;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private jobService: JobService,
    private staffService: StaffService,
    private stepService: StepService,
    private productLevelService: ProductLevelService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  ngAfterViewInit() {
    this.getJobs();
    this.getSteps();
    this.getStaffs();
    this.getProductLevels();
  }

  ngOnInit(): void {
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
    this.router.navigate([`/jobs/${row.id}`]);
  }

  getJobs() {
    this.jobService.getJobs(1, 1).subscribe(paggedData => {
      this.jobsCount = paggedData.totalRecords;
    });

    return this.jobsCount;
  }

  getStaffs() {
    this.staffService.getAllStaffs().subscribe(data => {
      this.staffsCount = data.length;
    });

    return this.staffsCount;
  }

  getProductLevels() {
    this.productLevelService.getAllProductLevels().subscribe(data => {
      this.productLevelsCount = data.length;
    });

    return this.productLevelsCount;
  }


  getSteps() {
    this.stepService.getSteps().subscribe(data => {
      this.stepsCount = data.length;
    });

    return this.stepsCount;
  }

}