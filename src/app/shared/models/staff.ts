import { ProductLevel } from "./productLevel";
import { Role } from "./role";
import { Shift } from "./shift";

export interface Staff {
    fullName: string;
    account: string;
    email: string;
    roles: Role[];
    productLevels: ProductLevel[];
    shifts: Shift[],
    jobSteps: [];
    isAssigned: false,
    currentShiftId: number;
    id: number;
    token: string;

    rolenames: string;
    productLevelnames: string;
    currentShiftname: string;
}