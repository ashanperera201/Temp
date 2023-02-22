import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Store } from '@ngrx/store';
import { setCommonConcurrency } from '../../redux/actions/concurrency.action'

import { CommonService } from './common.service';
import { environment } from '../../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class ConnectionHubService {

    private hubConnection!: signalR.HubConnection;
    private readonly baseUrl = `${environment.srmServer}/app-listener`;

    constructor(private commonService: CommonService, private store: Store) { }

    initializeHubConnection = (): void => {
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.baseUrl, { transport: signalR.HttpTransportType.WebSockets, skipNegotiation: true })
            .build();
    }


    useHubConnection = (): void => {
        this.hubConnection.start().then(() => {
            console.log('Connection successfully started.');
            this.hubListeners();
        }).catch(error => {
            console.log('Error while connection.!');
        })
    }

    private hubListeners = (): void => {
        if (this.hubConnection) {
            this.hubConnection.on('CommonParallelAction', (emittedMessage: any) => {
                if (emittedMessage) {
                    this.store.dispatch(setCommonConcurrency(emittedMessage));
                }
            });
        }
    }

    public emitOnGivenSubscriber = (listnerName: string, subsArgs: any): void => {
        if (this.hubConnection) {
            this.hubConnection.send(listnerName, subsArgs)
        }
    }
}
