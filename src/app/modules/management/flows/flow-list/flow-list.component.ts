import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { Job } from 'src/app/shared/models/job';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddFlowComponent } from '../add-flow/add-flow.component';
import { FlowService } from 'src/app/core/services/flows.service';
import { RemoveFlowComponent } from '../remove-flow/remove-flow.component';
import { FlowsDataSource } from '../flows-data-source';
import { InstantFlowVM } from 'src/app/shared/models/instantFlowVM';
import { Flow } from 'src/app/shared/models/flow';

@Component({
  selector: 'app-flow-list',
  templateUrl: './flow-list.component.html',
})

export class FlowListComponent implements OnInit, AfterViewInit {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
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

  flow!: Flow;
  flowId!: number;
  displayedColumns: string[] = ['action', 'name', 'description', 'type', 'status', 'dateModified', 'id'];
  dataSource!: FlowsDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private flowService: FlowService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
    this.dataSource = new FlowsDataSource(this.flowService, this.mappingModel);
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
    this.flowId = this.route.snapshot.data["id"];
    this.dataSource.load();
  }

  loadPage() {
    this.dataSource.load(
      this.flowId,
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

    this.loadPage();
  }

  openAddFlowDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(AddFlowComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    );
  }

  openRemoveDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveFlowComponent, {
      data: { id: element.id, name: element.name },
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openUpdateDialog(element: any) {
    console.log("openUpdateDialog");
  }

  openAutomatedFlowDialog(element: any) {
    console.log("openAutomatedFlowDialog");
  }

  openInstantFlowDialog(element: any) {
    let instantFlowVM: InstantFlowVM = {
      flowId: element.id
    };

    console.log("instantFlowVM", instantFlowVM);

    this.flowService.instantFlow(instantFlowVM)
      .subscribe(res => {
        this.alertService.success(res.message);
      }, (err) => {
        this.alertService.showToastError();
      });
  }

  openSchedulerFlowDialog(element: any) {
    console.log("openSchedulerFlowDialog");
  }


  openDeployFlowDialog(element: any) {
    console.log("openDeployFlowDialog");
  }

}