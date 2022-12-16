import { Injectable } from "@angular/core";
import { Job } from "./job";
import { JobStep } from "./jobStep";
import { JobStepDto } from "./jobStepDto";
import { Staff } from "./staff";
import { Step } from "./step";

@Injectable({
    providedIn: 'root'
})

export class MappingModels {

    public MappingDisplayNameFieldsOfSteps(steps: Step[]) {
        steps.forEach(step => {
            step = this.MappingDisplayNameFieldsOfStep(step);
        });

        return steps;
    }

    public MappingDisplayNameFieldsOfStep(step: Step) {
        step.groupname = this.MappingDisplayGroupName(step.groupId);
        return step;
    }

    public MappingDisplayGroupName(groupId: number) {
        let groupname = 'none';
        switch (groupId) {
            case 2:
                groupname = "Admin";
                break;

            case 2:
                groupname = "QC";
                break;

            case 3:
                groupname = "High Quality";
                break;

            case 4:
                groupname = "Photo Editing";
                break;

            case 5:
                groupname = "Merge Retouch";
                break;

            case 6:
                groupname = "Video";
                break;

            case 7:
                groupname = "2D&3D";
                break;

            default:
                groupname = "none";
                break;
        }

        return groupname;
    }

    public MappingDisplayNameFieldsOfJobStepDtos(jobStepDtos: JobStepDto[]) {
        jobStepDtos.forEach(jobStepDto => {
            jobStepDto.jobStep = this.MappingDisplayNameFieldsOfJobStep(jobStepDto.jobStep);
            jobStepDto.noteDescriptions = jobStepDto.notes.map(elm => { return elm.description }).join(", ");
        });



        return jobStepDtos;
    }

    public MappingDisplayNameFieldsOfJobSteps(jobSteps: JobStep[]) {
        jobSteps.forEach(jobStep => {
            jobStep = this.MappingDisplayNameFieldsOfJobStep(jobStep);
        });

        return jobSteps;
    }

    public MappingDisplayNameFieldsOfJobStep(jobStep: JobStep) {
        jobStep.groupname = this.MappingDisplayGroupName(jobStep.step.groupId);
        jobStep.statusname = this.MappingStepStatus(jobStep.status);
        return jobStep;
    }

    public MappingStepStatus(status: number) {
        let statusname = "none";
        switch (status) {
            case 0:
                statusname = "Todo";
                break;

            case 1:
                statusname = "Doding";
                break;

            case 2:
                statusname = "Done";
                break;

            case 3:
                statusname = "Approved";
                break;

            case 4:
                statusname = "Rejected";
                break;

            case 5:
                statusname = "Pending";
                break;

            case 6:
                statusname = "Assigned";
                break;

            default:
                statusname = "none";
                break;
        }
        return statusname;
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

    MappingDisplayNameFieldsOfStaffs(staffs: Staff[]) {
        staffs.forEach(staff => {
            staff = this.MappingDisplayNameFieldsOfStaff(staff);
        })

        return staffs;
    }

    MappingDisplayNameFieldsOfStaff(staff: Staff) {
        if (staff.roles != null && staff.roles.length > 0) {
            let rolenames = "";
            staff.roles.map((role, i) => {
                if (i == 0) {
                    return rolenames += role.name;
                } else {
                    return rolenames += ", " + role.name;
                }
            });
            staff.rolenames = rolenames;
        }

        if (staff.groups != null && staff.groups.length > 0) {
            let groupnames = "";
            staff.groups.map((group, i) => {
                if (i == 0) {
                    return groupnames += group.name;
                } else {
                    return groupnames += ", " + group.name;
                }
            });
            staff.groupnames = groupnames;
        }

        if (staff.productLevels != null && staff.productLevels.length > 0) {
            let productLevelnames = "";
            staff.productLevels.map((productLevel, i) => {
                if (i == 0) {
                    return productLevelnames += productLevel.code;
                } else {
                    return productLevelnames += ", " + productLevel.code;
                }
            });
            staff.productLevelnames = productLevelnames;
        }

        let statusNameVal = "";

        if (staff.currentShiftId != null) {
            switch (staff.currentShiftId) {
                case 0:
                    staff.currentShiftname = "none";
                    statusNameVal = "none";
                    break;

                case 6:
                    staff.currentShiftname = "none";
                    statusNameVal = "none";
                    break;

                case 1:
                    staff.currentShiftname = "Shift 1";
                    statusNameVal = "In Shift";
                    break;

                case 2:
                    staff.currentShiftname = "Shift 2";
                    statusNameVal = "In Shift";
                    break;

                case 3:
                    staff.currentShiftname = "Shift 3";
                    statusNameVal = "In Shift";
                    break;

                case 4:
                    staff.currentShiftname = "Out";
                    statusNameVal = "Out Shift";
                    break;

                case 5:
                    staff.currentShiftname = "Free";
                    statusNameVal = "Free";
                    break;

                default:
                    staff.currentShiftname = "none";
                    statusNameVal = "none";
                    break;
            }

            if (staff.isAssigned == null) {
                statusNameVal = "Is Assigned";
            }

            staff.statusname = statusNameVal;
        }

        return staff;
    }
}