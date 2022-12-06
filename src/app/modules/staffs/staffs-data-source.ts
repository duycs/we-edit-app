import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { StaffService } from "src/app/core/services/staffs.service";
import { MappingModels } from "src/app/shared/models/mapping-models";
import { Staff } from "src/app/shared/models/staff";

export class StaffDataSource implements DataSource<Staff>{
    private staffsSubject = new BehaviorSubject<Staff[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private staffService: StaffService,
        private mappingModels: MappingModels,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Staff[]> {
        return this.staffsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.staffsSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(ids: number[] = [], searchValue = '',
        sortDirection = 'asc', pageIndex = 1, pageSize = 5, isInclude: boolean = false) {
        this.loadingSubject.next(true);

        if (pageIndex == 0 && pageSize == 0) {
            this.staffService.getAllStaffs(pageIndex, pageSize, searchValue, isInclude).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(data => {
                    this.staffsSubject.next(this.mappingModels.MappingDisplayNameFieldsOfStaffs(data))
                });
        } else if (ids != null && ids.length > 0) {
            // TODO

        } else {
            this.staffService.getStaffs(pageIndex, pageSize, searchValue, isInclude).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(paggedData => {
                    this.staffsSubject.next(this.mappingModels.MappingDisplayNameFieldsOfStaffs(paggedData.data))
                    this.count = paggedData.totalRecords;
                    console.log(paggedData.data);
                });
        }

    }
}