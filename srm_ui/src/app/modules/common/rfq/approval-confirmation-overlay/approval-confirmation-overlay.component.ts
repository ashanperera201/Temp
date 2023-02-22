import { Component, Inject, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RFQApprovalViewModel } from 'app/main/Models/etendering/ViewModels/rfq-approval-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import Swal from 'sweetalert2';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'

export interface RowData {
    id: string;
    group: string;
    objKey: string;
    visibility: string;
}

@Component({
    selector: 'approval-confirmation-overlay',
    templateUrl: './approval-confirmation-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class ApprovalConfirmationOverlayComponent implements OnDestroy {

    headerDataSource: any = [];
    lineDataSource: any = [];
    templateData: any = [];
    useremail: string = '';
    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    isDelete = false;
    bidingStyles: any[];
    dataId: any = "";
    headerMap = new Map();
    lineMap = new Map();
    approver: string;
    activity: string;
    loading: boolean = false;
    des: string;
    testdata: any;
    isApprover: boolean = true;
    allData: any;
    rfqApprovalViewModel: RFQApprovalViewModel[] = [];
    rfqId: any;
    approvalType: any;
    rfqApprovalModel: RFQApprovalViewModel = new RFQApprovalViewModel();

    showConfirmationForm: boolean = true;
    destroy$ = new Subject<boolean>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<ApprovalConfirmationOverlayComponent>,
        public dialog: MatDialog,
        private router: Router,
        private rfqService: RfqService) { }

    ngOnInit() {
        this.initiateTheDataSet();
        this.rfqService.getRFQApprovalStatusByRFQId(this.rfqId, this.approvalType).subscribe(result => {
            this.rfqApprovalModel = result.data;
        });
        this.activity = this.data.activity;
    }

    initiateTheDataSet = (): void => {
        if (this.data) {
            this.allData = this.data;
            this.testdata = this.data.approver;
            this.approver = this.data.approver;
            this.isApprover = true;
            this.rfqId = this.data.rfqId;
            this.approvalType = this.data.approvalType;
        }
    }

    doAction() {
        this.dialogRef.close({ event: 'Cancel' });
    }
    isAprovalInProgress!:boolean;
    submit = (): void => {
        this.loading = true;
        this.isAprovalInProgress=true;
        if (this.rfqId) {
            let rfqApprovalViewModel = new RFQApprovalViewModel();
            rfqApprovalViewModel.rFQId = this.rfqId;
            rfqApprovalViewModel.id = this.rfqApprovalModel.id;
            rfqApprovalViewModel.statusName = "Approved";
            rfqApprovalViewModel.approvalType = this.approvalType;
            rfqApprovalViewModel.reason = this.rfqApprovalModel.reason;

            this.rfqService.updateRFQApprovalStatus(rfqApprovalViewModel)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (result) => {
                        this.isAprovalInProgress=false;
                        this.showConfirmationForm = !this.showConfirmationForm;
                        this.loading = false;
                        if (result.data.isSuccess == false) {
                            this.showError(result.data.responseMessage, result.data.isSuccess)
                        }
                        else {
                            const timeoutRef = setTimeout(() => {
                                clearTimeout(timeoutRef);
                                this.dialogRef.close({ event: 'Success', issuccess: result.data.isSuccess });
                            }, 5000);
                        }
                    }
                });
        } else {
            this.loading = false;
            this.showError("RFQ id is required", false);
        }
    }

    showError = (errorMessage: string, isSuccess: boolean): void => {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            html: errorMessage,
            customClass: {
                container: 'display-list'
            },
            target: '#error-alert'
        }).then((result) => {
            if (result.isConfirmed) {
                this.dialogRef.close({ event: 'Success', issuccess: isSuccess });
            }
        });
    }

    Continue() {
        this.dialogRef.close({ event: 'Success', issuccess: true });
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

}