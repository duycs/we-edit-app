import { CollectionViewer, DataSource } from "@angular/cdk/collections"
import { BehaviorSubject, catchError, finalize, Observable, of } from "rxjs";
import { JobService } from "src/app/core/services/jobs.service";
import { Job } from "src/app/shared/models/job";
import { JobStep } from "src/app/shared/models/jobStep";
import { MappingModels } from "src/app/shared/models/mapping-models";

export class JobsDataSource implements DataSource<Job>{
    private jobsSubject = new BehaviorSubject<Job[]>([]);
    private jobStepSubject = new BehaviorSubject<JobStep[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public count!: number;

    constructor(private jobService: JobService,
        private mappingModels: MappingModels,
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<Job[]> {
        return this.jobsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.jobsSubject.complete();
        this.loadingSubject.complete();
    }

    loadJobs(id: number = 0, searchValue = '',
        sortDirection = 'asc', pageIndex = 0, pageSize = 5) {

        this.loadingSubject.next(true);

        if (id > 0) {
            this.jobService.getJob(id).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(data => {
                    this.jobsSubject.next([this.mappingModels.MappingDisplayNameFieldsOfJob(data)])
                    console.log(this.jobsSubject);
                });
        } else {
            this.jobService.getJobs(pageIndex, pageSize, searchValue, true).pipe(
                catchError(() => of()),
                finalize(() => this.loadingSubject.next(false))
            )
                .subscribe(paggedData => {
                    this.jobsSubject.next(this.mappingModels.MappingDisplayNameFieldsOfJobs(paggedData.data))
                    this.count = paggedData.totalRecords;
                    console.log(paggedData.data);
                });
        }
    }

    loadJobSteps(id: number = 0) {
        this.loadingSubject.next(true);
        this.jobService.getJobSteps(id).pipe(
            catchError(() => of()),
            finalize(() => this.loadingSubject.next(false))
        )
            .subscribe(data => {
                this.jobStepSubject.next(this.mappingModels.MappingDisplayNameFieldsOfJobSteps(data))
                console.log(data);
            });
    }
}