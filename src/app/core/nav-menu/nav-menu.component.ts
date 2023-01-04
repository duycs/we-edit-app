import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../authentication/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { CronJobSignalrService } from '../services/cronjob-signalr.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  name!: string;
  isAuthenticated!: boolean;
  isAdmin!: boolean;
  subscription!: Subscription;
  userId!: string;
  staffId!: number;

  @Output() sidenavClose = new EventEmitter();

  constructor(
    public cronJobSignalRService: CronJobSignalrService,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
  ) {

  };

  ngOnInit() {
    this.subscription = this.authService.authNavStatus$
      .subscribe(status => {
        this.name = this.authService.name;
        this.isAuthenticated = status;
        this.isAdmin = this.authService.isUserAdmin();
        this.userId = this.authService.userId();
        this.staffId = this.authService.getStaff()?.id;

        console.log("staffId", this.staffId);
        console.log("staff",  this.authService.getStaff());
      }
      );

    // this.cronJobSignalRService.startConnection();
    // this.cronJobSignalRService.addJobListener();   
  }

  login() {
    this.authService.login();
  }

  async signout() {
    await this.authService.signout();
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.subscription.unsubscribe();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

}
