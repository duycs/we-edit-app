import { Injectable } from "@angular/core";
import { Job } from "./job";
import { JobStep } from "./jobStep";

@Injectable({
    providedIn: 'root'
})

export class MappingModels {

    public MappingDisplayNameFieldsOfJobSteps(jobSteps: JobStep[]) {
        jobSteps.forEach(jobStep => {
            jobStep = this.MappingDisplayNameFieldsOfJobStep(jobStep);
        });

        return jobSteps;
    }

    public MappingDisplayNameFieldsOfJobStep(jobStep: JobStep) {
        switch (jobStep.status) {
            case 0:
                jobStep.statusname = "Todo";
                break;

            case 1:
                jobStep.statusname = "Doding";
                break;

            case 2:
                jobStep.statusname = "Done";
                break;

            case 3:
                jobStep.statusname = "Approved";
                break;

            case 4:
                jobStep.statusname = "Rejected";
                break;

            case 5:
                jobStep.statusname = "Pending";
                break;

            case 6:
                jobStep.statusname = "Assigned";
                break;

            default:
                jobStep.statusname = "none";
                break;
        }

        return jobStep;
    }

    public MappingDisplayNameFieldsOfJobs(jobs: Job[]) {
        jobs.forEach(job => {
            job = this.MappingDisplayNameFieldsOfJob(job);
        });

        return jobs;
    }

    public MappingDisplayNameFieldsOfJob(job: Job) {
        if (job.location != null) {
            switch (job.location) {
                case 0:
                    job.locationname = "EU";
                    break;

                case 1:
                    job.locationname = "US";
                    break;

                case 2:
                    job.locationname = "AU";
                    break;

                default:
                    job.locationname = "none";
                    break;
            }
        }

        if (job.status != null) {
            switch (job.status) {
                case 0:
                    job.statusname = "Todo";
                    break;

                case 1:
                    job.statusname = "Doing";
                    break;

                case 2:
                    job.statusname = "Done";
                    break;

                case 3:
                    job.statusname = "Pending";
                    break;

                default:
                    job.statusname = "none";
                    break;
            }
        }

        if (job.app != null) {
            switch (job.app) {
                case 0:
                    job.appname = "App 1";
                    break;

                case 1:
                    job.appname = "App 2";
                    break;

                case 2:
                    job.appname = "App 3";
                    break;

                default:
                    job.appname = "none";
                    break;
            }
        }

        if (job.deliverType != null) {
            switch (job.deliverType) {
                case 0:
                    job.deliverTypename = "V1";
                    break;

                case 1:
                    job.deliverTypename = "V2";
                    break;

                case 2:
                    job.deliverTypename = "V3";
                    break;

                default:
                    job.deliverTypename = "none";
                    break;
            }
        }
        
        return job;

    }
}