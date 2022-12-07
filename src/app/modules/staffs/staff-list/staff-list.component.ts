import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { StaffService } from 'src/app/core/services/staffs.service';
import { AddStaffComponent } from '../add-staff/add-staff.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StaffDataSource } from '../staffs-data-source';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { RemoveStaffComponent } from '../remove-staff/remove-staff.component';
import { AddProductLevelForStaffComponent } from '../add-productlevel-for-staff/add-productlevel-for-staff.component';
import { StaffInShiftVM } from 'src/app/shared/models/staffInShiftVM';
import { StaffOutShiftVM } from 'src/app/shared/models/staffOutShiftVM';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
})

export class StaffListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
  users: Staff[] = [];

  length = 50;
  pageSize = 10;
  pageIndex = 1;
  pageSizeOptions = [5, 10, 15, 20];
  pageEvent!: PageEvent;

  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  title: string = "Staffs";
  displayedColumns: string[] = ['action', 'id', 'fullname', 'account', "email", 'roles', "productLevels", "currentShift", "isAssigned", "status"];

  staff!: Staff;
  dataSource!: StaffDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private authenticationService: AuthenticationService,
    private staffService: StaffService,
    private mappingModels: MappingModels,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.dataSource = new StaffDataSource(this.staffService, this.mappingModels);
    });
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 1;
          this.loadPage();
        })
      )
      .subscribe();

    if (this.sort && this.sort.sortChange) {
      // reset the paginator after sorting
      this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 1);

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
      false);
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

    const dialogRef = this.dialog.open(AddStaffComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          console.log("reload after added", result);
          this.loadPage();
        }, 2000);
      }
    );
  }

  openAddProductLevelDialog(element: any) {
    const dialogRef = this.dialog.open(AddProductLevelForStaffComponent, {
      data: { id: element.id, name: element.fullName },
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadPage();
      }, 2000);
    });
  }

  openRemoveDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveStaffComponent, {
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

  addInShift(element: any) {
    var staffInShiftVM: StaffInShiftVM = {
      staffId: element.id,
    };

    this.staffService.addInShiftForStaff(staffInShiftVM)
      .subscribe(() => {
        this.alertService.showToastSuccess();
        setTimeout(() => {
          this.loadPage();
        }, 2000);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }


  addOutShift(element: any) {
    var staffOutShiftVM: StaffOutShiftVM = {
      staffId: element.id,
    };

    this.staffService.addOutShiftForStaff(staffOutShiftVM)
      .subscribe(() => {
        this.alertService.showToastSuccess();
        setTimeout(() => {
          this.loadPage();
        }, 2000);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }
}