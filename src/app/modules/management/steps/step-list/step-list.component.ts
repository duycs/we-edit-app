import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { StepService } from 'src/app/core/services/steps.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { StepDataSource } from '../steps-data-source';
import { AddStepComponent } from '../add-step/add-step.component';
import { RemoveStepComponent } from '../remove-step/remove-step.component';

@Component({
  selector: 'app-step-list',
  templateUrl: './step-list.component.html',
})

export class StepListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
  users: Staff[] = [];

  length = 50;
  pageSize = 10;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent!: PageEvent;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  title: string = "Steps";
  displayedColumns: string[] = ['action', 'code', 'name', "orderNumber", 'group', 'productLevel', "estimationInSeconds", 'id'];

  staff!: Staff;
  dataSource!: StepDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private AuthService: AuthService,
    private stepService: StepService,
    private mappingModels: MappingModels,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
    this.dataSource = new StepDataSource(this.stepService, this.mappingModels);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();

    if (this.sort && this.sort.sortChange) {
      // reset the paginator after sorting
      this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 0);

      // on sort or paginate events, load a new page
      merge(this.sort?.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadPage())
        )
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.staff = this.route.snapshot.data["id"];
    this.dataSource.loadData();
  }

  loadPage() {
    this.dataSource.loadData(
      [],
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      true);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;

    this.loadPage();
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(AddStepComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          console.log("reload after added", result);
          this.loadPage();
        }, 2000);
      }
    );
  }

  openRemoveDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveStepComponent, {
      data: { id: element.id, name: element.name },
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadPage();
      }, 2000);
    });
  }

  openUpdateDialog(element: any) {
  }

}