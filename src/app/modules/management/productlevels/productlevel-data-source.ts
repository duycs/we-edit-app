import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { ProductLevelService } from "src/app/core/services/productLevels.service";
import { ProductLevel } from "src/app/shared/models/productLevel";

export class ProductLevelDataSource implements DataSource<ProductLevel>{
    private productLevelsSubject = new BehaviorSubject<ProductLevel[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private productLevelService: ProductLevelService,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<ProductLevel[]> {
        return this.productLevelsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productLevelsSubject.complete();
        this.loadingSubject.complete();
    }

    loadData(ids: number[] = [], searchValue = '',
        sortDirection = 'asc', pageIndex = 1, pageSize = 5, isInclude: boolean = false) {
        this.loadingSubject.next(true);

        if (pageIndex == 0 && pageSize == 0) {
            this.productLevelService.getAllProductLevels(pageIndex, pageSize, searchValue, isInclude).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(data => {
                    this.productLevelsSubject.next(data)
                });
        } else if (ids != null && ids.length > 0) {
            // TODO

        } else {
            this.productLevelService.getProductLevels(pageIndex, pageSize, searchValue, isInclude).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(paggedData => {
                    this.productLevelsSubject.next(paggedData.data)
                    this.count = paggedData.totalRecords;
                    console.log(paggedData.data);
                });
        }

    }
}