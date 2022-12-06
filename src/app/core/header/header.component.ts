import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CronJobSignalrService } from '../services/cronjob-signalr.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    @Output() public sidenavToggle = new EventEmitter();

    constructor(public cronJobSignalRService: CronJobSignalrService) { }

    ngOnInit() {
        this.cronJobSignalRService.startConnection();
        this.cronJobSignalRService.addJobListener();
    }

    public onToggleSidenav = () => {
        this.sidenavToggle.emit();
    }
}