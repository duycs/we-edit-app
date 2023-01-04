import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { AlertService } from '../services/alert.service';
import { CronJobSignalrService } from '../services/cronjob-signalr.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    name!: string;
    isAuthenticated!: boolean;
    isAdmin!: boolean;
    subscription!: Subscription;
    userId!: string;
    staffId!: number;

    @Output() public sidenavToggle = new EventEmitter();

    constructor(public cronJobSignalRService: CronJobSignalrService,
        private alertService: AlertService,
        private authService: AuthService) { }

    ngOnInit() {
        this.subscription = this.authService.authNavStatus$.subscribe(status => {
            this.isAuthenticated = status;
            this.name = this.authService.name;
            this.isAdmin = this.authService.isUserAdmin();
            this.userId = this.authService.userId();
            this.staffId = this.authService.getStaff()?.id;

            console.log("staffId", this.staffId);
            console.log("staff",  this.authService.getStaff());
        }
        );

        //this.cronJobSignalRService.startConnection();
        //this.cronJobSignalRService.addJobListener();
    }

    login() {
        this.authService.login();
    }

    ngOnDestroy() {
        // prevent memory leak when component is destroyed
        this.subscription.unsubscribe();
    }

    async signout() {
        await this.authService.signout();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}