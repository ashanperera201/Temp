import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConnectionHubService } from './shared/Services/connection-hub.service';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
//import { NgxUiLoaderService } from 'ngx-ui-loader';

import { AppState } from '../app/redux/application-state';
import { selectConcurrentInfo } from '../app/redux/selectors/concurrency.selector';
import { ToastService } from './shared/Services/toast.service';
import { TYPE } from './shared/enums/toast.enum'
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    destroy$: Subject<boolean>;

    constructor(
        private connectionHubService: ConnectionHubService,
        private store: Store<AppState>,
        private toastService: ToastService,) { }

    ngOnInit(): void {
        this.connectionHubService.initializeHubConnection();
        this.connectionHubService.useHubConnection();
        this.onConcurrentDataListner();
    }

    onConcurrentDataListner = () => {
        this.store.select(state => state.concurrentData).subscribe({
            next: (serviceResult: any) => {
                if (serviceResult && serviceResult.commonConcurrency && serviceResult.commonConcurrency.userInformation) {
                    const concurrencyRef = serviceResult.commonConcurrency;
                    const user = JSON.parse(serviceResult.commonConcurrency.userInformation);
                    const message = `User ${user?.firstName} has processed ${concurrencyRef.action}`
                    this.toastService.showToast(TYPE.SUCCESS, false, message);
                }
            }
        })
    }


    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
}
