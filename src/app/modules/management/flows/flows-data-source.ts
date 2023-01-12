import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { FlowService } from "src/app/core/services/flows.service";
import { Flow } from "src/app/shared/models/flow";
import { MappingModels } from "src/app/shared/models/mapping-models";

export class FlowsDataSource implements DataSource<Flow>{
    private subject = new BehaviorSubject<Flow[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private flowService: FlowService,
        private mappingModels: MappingModels,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Flow[]> {
        return this.subject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.subject.complete();
        this.loadingSubject.complete();
    }

    load(id: number = 0, searchValue = '',
        sortDirection = 'asc', pageIndex = 0, pageSize = 5) {

        this.loadingSubject.next(true);

        if (id > 0) {
            this.flowService.getFlow(id).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(data => {
                    this.subject.next([this.mappingModels.MappingDisplayNameFieldsOfFlow(data)])
                    console.log(this.subject);
                });
        } else {
            this.flowService.getFlows(pageIndex, pageSize, searchValue, true).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(paggedData => {
                    this.subject.next(this.mappingModels.MappingDisplayNameFieldsOfFlows(paggedData.data))
                    this.count = paggedData.totalRecords;
                    console.log(paggedData.data);
                });
        }
    }
}