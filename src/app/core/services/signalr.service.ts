import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"

@Injectable({
    providedIn: 'root'
})

export class SignalrService {
    private hubConnection!: signalR.HubConnection
    public message: string = "Auto assign Job is disabled";
    public autoAssignResponse!: any;
    public bradcastedData!: any[];

    public startConnection = () => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:7017/jobshub')
            .build();
        this.hubConnection
            .start()
            .then(() => {
                this.message = "Auto assign Job connecting...";
                console.log('Connection started');
            })
            .catch(err => {
                this.message = "Auto assign Job error while starting";
                console.log('Error while starting connection: ' + err);
            })
    }

    public addJobListener = () => {
        this.hubConnection.on('AutoAssignStaffToStepJob', (data) => {
            this.autoAssignResponse = data;
            this.message = this.autoAssignResponse.message;

            console.log(data);
        });
    }

    // public broadcastJob = () => {
    //     const data = this.autoAssignResponse.map(m => {
    //         const temp = {
    //             data: m.data,
    //             label: m.label
    //         }
    //         return temp;
    //     });
    //     this.hubConnection.invoke('AutoAssignStaffToStepJob', data)
    //         .catch(err => console.error(err));
    // }

    public addBroadcastChartDataListener = () => {
        this.hubConnection.on('AutoAssignStaffToStepJob', (data) => {
            this.bradcastedData = data;
        })
    }
}