import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, fromEvent, merge, Subscription, tap } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { Staff } from 'src/app/shared/models/staff';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MappingModels } from 'src/app/shared/models/mapping-models';
import { RemoveNoteComponent } from '../remove-note/remove-note.component';
import { NoteService } from 'src/app/core/services/notes.service';
import { Note } from 'src/app/shared/models/note';
import { NoteDataSource } from '../notes-data-source';

@Component({
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
})

export class NoteListComponent implements OnInit {
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

  objectId!: number;
  objectName!: string;
  title: string = "Notes";
  displayedColumns: string[] = ['action', 'title', 'description', 'noter', 'dateCreated'];

  dataSource!: NoteDataSource;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('input') input!: ElementRef;

  constructor(private AuthService: AuthService,
    private mappingModels: MappingModels,
    private noteService: NoteService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
    this.dataSource = new NoteDataSource(this.noteService, this.mappingModels);
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
    this.route.queryParams.subscribe(params => {
      this.objectId = params["objectId"];
      this.objectName = params["objectName"];
    });

    this.dataSource.loadData([], this.objectName, [this.objectId]);
  }

  loadPage() {
    this.dataSource.loadData(
      [],
      this.objectName,
      [this.objectId],
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

  openRemoveDialog(element: any): void {
    const dialogRef = this.dialog.open(RemoveNoteComponent, {
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