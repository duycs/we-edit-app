import { ProductLevel } from "./productLevel";
import { Role } from "./role";

export interface Staff {
    fullName: string;
    account: string;
    email: string;
    roles: Role[];
    productLevels: ProductLevel[];
    shifts: [],
    jobSteps: [];
    isAssigned: false,
    currentShiftId: number;
    id: number;
    token: string;

    rolenames: string;
    productLevelnames: string;
}