import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { JobService } from 'src/app/core/services/jobs.service';
import { Job } from 'src/app/shared/models/job';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { JobsDataSource } from '../jobs-data-source';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddJobComponent } from '../add-job/add-job.component';
import { RemoveJobComponent } from '../remove-job/remove-job.component';

// Ref: https://blog.angular-university.io/angular-material-data-table/
@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})

export class JobListComponent implements OnInit, AfterViewInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
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

  displayedColumns: string[] = ['action', 'id', 'date', 'location', 'cso', 'jobId', 'code', 'instruction', 'inputNumber',
    'productLevel', 'startTime', 'endTime', 'deadline', 'deliverType', 'app',];
  job!: Job;
  jobCount!: number;
  dataSource!: JobsDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private jobService: JobService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.dataSource = new JobsDataSource(this.jobService, this.mappingModel);
    });
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadJobsPage();
        })
      )
      .subscribe();

    if (this.sort && this.sort.sortChange) {
      // reset the paginator after sorting
      this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      // on sort or paginate events, load a new page
      merge(this.sort?.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadJobsPage())
        )
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.job = this.route.snapshot.data["id"];
    this.dataSource.loadJobs();
  }

  onRowClicked(row: any) {
    console.log('Row clicked: ', row);
    this.router.navigate([`/jobs/${row.id}`]);
  }

  loadJobsPage() {
    this.dataSource.loadJobs(
      this.job?.id,
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.loadJobsPage();
  }

  openAddJobDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(AddJobComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    );
  }

  openRemoveJobDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveJobComponent, {
      data: { id: element.id, name: element.jobId },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openUpdateJobDialog(element: any) {
    console.log("updateJobDialog");
  }

}