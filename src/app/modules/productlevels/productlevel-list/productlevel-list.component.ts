import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { Staff } from 'src/app/shared/models/staff';
import { PageSettingsModel } from '@syncfusion/ej2-angular-grids';
import { ProductLevelService } from 'src/app/core/services/productLevels.service';

@Component({
  selector: 'app-productlevel-list',
  templateUrl: './productlevel-list.component.html',
  styleUrls: ['./productlevel-list.component.css']
})

export class ProductLevelListComponent implements OnInit {
  currentUser!: Staff;
  currentUserSubscription: Subscription;
  users: Staff[] = [];

  page: number = 1;
  size: number = 20;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private productLevelService: ProductLevelService,
    private alertService: AlertService) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
  }

  public data!: object[];
  public pageSettings!: PageSettingsModel;

  ngOnInit(): void {
    this.getProductLevels();
  }

  getProductLevels(): void {
    this.productLevelService.getProductLevels()
      .subscribe(res => {
        this.data = res;
        this.pageSettings = { pageSize: this.size };
        console.log(res);
      }, (err) => {
        this.alertService.showToastError();
        console.log(err);
      });
  }

}