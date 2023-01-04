import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { JobService } from 'src/app/core/services/jobs.service';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { StaffService } from 'src/app/core/services/staffs.service';
import { StepService } from 'src/app/core/services/steps.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  name!: string;
  isAuthenticated!: boolean;
  isAdmin!: boolean;
  subscription!: Subscription;

  jobsCount: number = 0;
  stepsCount: number = 0;
  staffsCount: number = 0;
  productLevelsCount: number = 0;

  constructor(private router: Router,
    private authService: AuthService,
    private jobService: JobService,
    private staffService: StaffService,
    private stepService: StepService,
    private productLevelService: ProductLevelService) {
  }

  ngAfterViewInit() {
    this.getJobs();
    this.getSteps();
    this.getStaffs();
    this.getProductLevels();
  }

  ngOnInit(): void {
    this.subscription = this.authService.authNavStatus$
      .subscribe(status => {
        this.name = this.authService.name,
          this.isAuthenticated = status,
          this.isAdmin = this.authService.isUserAdmin();
      }
      );
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