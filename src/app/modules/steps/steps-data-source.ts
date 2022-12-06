import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { StaffService } from "src/app/core/services/staffs.service";
import { StepService } from "src/app/core/services/steps.service";
import { MappingModels } from "src/app/shared/models/mapping-models";
import { Step } from "src/app/shared/models/step";

export class StepDataSource implements DataSource<Step>{
    private stepsSubject = new BehaviorSubject<Step[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private stepService: StepService,
        private mappingModels: MappingModels,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Step[]> {
        return this.stepsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.stepsSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(ids: number[] = [], searchValue = '',
        sortDirection = 'asc', pageIndex = 1, pageSize = 5, isInclude: boolean = false) {
        this.loadingSubject.next(true);

        if (pageIndex == 0 && pageSize == 0) {
            this.stepService.getSteps().pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(data => {
                    this.stepsSubject.next(data)
                });
        } else if (ids != null && ids.length > 0) {
            // TODO

        } else {
            this.stepService.getPaggedSteps(pageIndex, pageSize, searchValue, isInclude).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(paggedData => {
                    this.stepsSubject.next(paggedData.data)
                    this.count = paggedData.totalRecords;
                    console.log(paggedData.data);
                });
        }

    }
}