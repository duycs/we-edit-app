export interface Staff {
    fullName: string;
    account: string;
    email: string;
    roles: [];
    productLevels: [];
    shifts: [],
    jobSteps: [];
    isAssigned: false,
    currentShiftId: number;
    id: number;
    token: string;
}