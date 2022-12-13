import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Staff } from 'src/app/shared/models/staff';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../authentication/authentication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { CronJobSignalrService } from '../services/cronjob-signalr.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
  users: Staff[] = [];
  isExpanded = false;
  isAnonymous = false;
  isMember = false;
  isLibrarian = false;

  @Output() sidenavClose = new EventEmitter();

  constructor(
    public cronJobSignalRService: CronJobSignalrService,
    private alertService: AlertService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    // this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  ngOnInit() {
    console.log(this.currentUser);
    if (this.currentUser == null) {
      this.isAnonymous = true;
      //this.alertService.open("You should register or login", "Thanks!", { duration: 2000, });
    } else {
      // let accountTypes = this.currentUser.accountTypes;
      // this.isMember = accountTypes.includes('member');
      // this.isLibrarian = accountTypes.includes('librarian');
    }

    // this.cronJobSignalRService.startConnection();
    // this.cronJobSignalRService.addJobListener();   
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  logout() {
    let account = this.currentUser?.email;
    this.authenticationService.logout(account).pipe(first()).subscribe(() => {
      console.log(account);
      this.alertService.showToastSuccess();
      this.router.navigate(['/']);
    });
  }

}
