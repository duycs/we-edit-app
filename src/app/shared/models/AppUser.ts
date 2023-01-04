import { Profile, User, UserSettings } from "oidc-client";
import { Staff } from "./staff";

export class AppUser extends User {
    staff!: Staff;

    constructor(userSettings: UserSettings, profile: Profile, staff: Staff) {
        super(userSettings);
        staff = staff;
        this.profile = profile;
    }
}