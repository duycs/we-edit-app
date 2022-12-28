import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/authentication/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Subscription } from 'rxjs';
import { Job } from '../../models/job';
import { Staff } from '../../models/staff';

@Component({
  selector: 'app-card-job-list',
  templateUrl: './card-job-list.component.html',
  styleUrls: ['./card-job-list.component.css']
})

export class CardJobListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription!: Subscription;
  users: Staff[] = [];

  //@Input() page: number = 1;
  @Input() jobs!: Job[];

  constructor(private router: Router,
    private AuthService: AuthService,
    private alertService: AlertService) {
    // this.currentUserSubscription = this.AuthService.currentUser.subscribe(user => {
    //   this.currentUser = user;
    // });
  }

  ngOnInit(): void {
  }

  onCoverBookClickEvent(job: any) {
    let jobId = job.id;
    console.log(jobId);
    if (this.currentUser == null) {
      //is anonymous
      this.router.navigate(['/jobs/', jobId]);
    }

  }

}