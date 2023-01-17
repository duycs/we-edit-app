import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { Operation } from 'src/app/shared/models/operation';
import { Flow } from 'src/app/shared/models/flow';
import { FlowService } from 'src/app/core/services/flows.service';
import { RemoveOperationComponent } from '../remove-operation/remove-operation.component';
import { AddOperationComponent } from '../add-operation/add-operation.component';
import { InstantFlowVM } from 'src/app/shared/models/instantFlowVM';

@Component({
  selector: 'flow-detail',
  templateUrl: './flow-detail.component.html',
})

export class FlowDetailComponent implements OnInit, AfterViewInit {
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

  displayedFlowColumns: string[] = ['action', 'name', 'description', 'type', 'status', 'dateModified'];

  displayedOperationColumns: string[] = ['action', 'name', 'description', 'executionName', 'type'];

  flows!: Flow[];
  operations!: Operation[];
  flowId!: number;

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
  }

  ngAfterViewInit() {
    this.getFlow();
  }

  getFlow() {
    this.flowService.getFlow(this.flowId)
      .subscribe(res => {
        var flowMapped = this.mappingModel.MappingDisplayNameFieldsOfFlow(res);
        this.flows = [flowMapped];
        this.operations = flowMapped.operations;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.flowId = this.route.snapshot.params['id'];
  }

  openAddOperationForFlowDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { flowId: this.flowId, flowName: this.flows[0].name };

    const dialogRef = this.dialog.open(AddOperationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        // do nothing
      }
    );
  }

  openRemoveOperationDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveOperationComponent, {
      data: { flowId: this.flowId, flowName: this.flows[0].name, operationId: element.id, operationName: element.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      setTimeout(() => {
        console.log("reload after removed", result);
        this.getFlow();
      }, environment.loadTimeout);
    });
  }

  openUpdateOperationDialog(element: any) {
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

  openAddNextOperationDialog(element: any){
    console.log("openAddNextOperationDialog");

    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = { flowId: this.flowId, flowName: this.flows[0].name };

    const dialogRef = this.dialog.open(AddOperationComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        // do nothing
      }
    );
  }

}