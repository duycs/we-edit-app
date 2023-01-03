import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { NoteService } from "src/app/core/services/notes.service";
import { MappingModels } from "src/app/shared/models/mapping-models";
import { NoteDto } from "src/app/shared/models/noteDto";

export class NoteDataSource implements DataSource<NoteDto>{
    private notesSubject = new BehaviorSubject<NoteDto[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private noteService: NoteService,
        private mappingModels: MappingModels,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<NoteDto[]> {
        return this.notesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.notesSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(ids: number[] = [], objectName = '', objectIds: number[] = [], searchValue = '',
        sortDirection = 'asc', pageIndex = 1, pageSize = 5, isInclude: boolean = false) {
        this.loadingSubject.next(true);

        if (ids != null && ids.length > 0) {
            // TODO

        } else {
            this.noteService.getNotes(pageIndex, pageSize, objectName, objectIds, searchValue, isInclude).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(paggedData => {
                    this.notesSubject.next(paggedData.data)
                    this.count = paggedData.totalRecords;
                    console.log(paggedData.data);
                });
        }

    }
}