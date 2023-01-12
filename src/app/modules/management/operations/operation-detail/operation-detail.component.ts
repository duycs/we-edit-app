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
import { OperationService } from 'src/app/core/services/operations.service';
import { Setting } from 'src/app/shared/models/setting';

@Component({
  selector: 'operation-detail',
  templateUrl: './operation-detail.component.html',
})

export class OperationDetailComponent implements OnInit, AfterViewInit {
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

  displayedOperationColumns: string[] = ['name', 'executionName', 'description', 'type', 'flowId'];
  displayedSettingColumns: string[] = ['action', 'name', 'key', 'value', 'description'];

  settings!: Setting[];
  operations!: Operation[];
  operationId!: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private AuthService: AuthService,
    private operationService: OperationService,
    private mappingModel: MappingModels,
    private dialog: MatDialog,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  ngAfterViewInit() {
    this.getOperation();
  }

  getOperation() {
    this.operationService.getOperation(this.operationId)
      .subscribe(res => {
        var operationMapped = this.mappingModel.MappingDisplayNameFieldsOfOperation(res);
        this.operations = [operationMapped];
        this.settings = operationMapped.settings;
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

  ngOnInit(): void {
    this.operationId = this.route.snapshot.params['id'];
  }

  openEditSettingDialog(element: any) {
    console.log("updateDialog");
  }

}