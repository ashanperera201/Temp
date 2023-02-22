import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ProcessConfiguratorService } from 'app/shared/Services/process-configurator.service';
import { ProcessConfiguratorCreateComponent } from '../process-configurator-create/process-configurator-create.component';

@Component({
    selector: 'app-process-configurator-landing',
    templateUrl: './process-configurator-landing.component.html',
    styleUrls: ['./process-configurator-landing.component.scss']
})
export class ProcessConfiguratorLandingComponent implements OnInit, OnDestroy {

    dataSource: any[] = [];
    displayedColumns: any[];

    destroy$ = new Subject<boolean>();
    pageSizeOptions: number[] = [5, 10, 25, 100];
    // TODO : SERVER SIDE PAGINATION LATER
    paginationModel: any = {
        page: 0,
        pageSize: 10,
        processName: '',
        processDescription: '',
        stepOne: ''
    };

    processName: FormControl = new FormControl('');
    processDescription: FormControl = new FormControl('');
    phaseOne: FormControl = new FormControl('');

    constructor(
        public matDialog: MatDialog,
        private processConfiguratorService: ProcessConfiguratorService,) { }

    ngOnInit(): void {
        this.initializeColumns();
        this.fetchProcessConfiguratorDetails();
        this.afterChangeListener();
    }

    afterChangeListener = (): void => {
        this.processConfiguratorService.afterSave.pipe(takeUntil(this.destroy$)).subscribe({
            next: () => {
                this.fetchProcessConfiguratorDetails();
            }
        })
    }

    onPageChangeEvent = (event: any): void => {
        if (event) {
            this.paginationModel.pageSize = event?.pageSize ? event?.pageSize : this.paginationModel.pageSize;
            this.paginationModel.page = event.page ? event?.page : this.paginationModel.page;
            this.fetchProcessConfiguratorDetails();
        }
    }

    fetchProcessConfiguratorDetails = (): void => {
        this.processConfiguratorService.getProcessConfiguratorDetails(this.paginationModel).pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (response: any) => {
                    this.dataSource = response;
                }
            });
    }

    initializeColumns = (): void => {
        this.displayedColumns = ['processName', 'processDescription', 'phaseOne', 'actions'];
    }

    createUpdateProcess = (): void => {
        this.matDialog.open(ProcessConfiguratorCreateComponent, {
            height: 'auto',
            width: '80%'
        });
    }

    onEditHandler = (row: any): void => {
        this.matDialog.open(ProcessConfiguratorCreateComponent, {
            height: 'auto',
            width: '80%',
            data: { data: row }
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}
