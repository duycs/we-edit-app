import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProductLevel } from 'src/app/shared/models/productLevel';
import { AddProductLevelComponent } from '../add-productlevel/add-productlevel.component';
import { RemoveProductLevelComponent } from '../remove-productlevel/remove-productlevel.component';
import { ProductLevelDataSource } from '../productlevel-data-source';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-productlevel-list',
  templateUrl: './productlevel-list.component.html',
  styleUrls: ['../../../shared/components/table/table-base.component.scss']
})

export class ProductLevelListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
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

  title: string = "Product-Levels";
  displayedColumns: string[] = ['action','code', 'name', 'description', 'id'];

  productLevel!: ProductLevel;
  dataSource!: ProductLevelDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private AuthService: AuthService,
    private productLevelService: ProductLevelService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
    this.dataSource = new ProductLevelDataSource(this.productLevelService);
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 1;
          this.loadJobsPage();
        })
      )
      .subscribe();

    if (this.sort && this.sort.sortChange) {
      // reset the paginator after sorting
      this.sort?.sortChange.subscribe(() => this.paginator.pageIndex = 1);

      // on sort or paginate events, load a new page
      merge(this.sort?.sortChange, this.paginator.page)
        .pipe(
          tap(() => this.loadJobsPage())
        )
        .subscribe();
    }
  }

  ngOnInit(): void {
    this.productLevel = this.route.snapshot.data["id"];
    this.dataSource.loadData();
  }

  loadJobsPage() {
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

    this.loadJobsPage();
  }

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};

    const dialogRef = this.dialog.open(AddProductLevelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      result => {
        setTimeout(() => {
          console.log("reload after added", result);
          this.loadJobsPage();
        }, 2000);
      }
    );
  }

  openRemoveDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveProductLevelComponent, {
      data: { id: element.id, name: element.name },
    });

    dialogRef.afterClosed().subscribe(() => {
      setTimeout(() => {
        this.loadJobsPage();
      }, 2000);
    });
  }

  openUpdateDialog(element: any) {
    console.log("updateJobDialog");
  }

}