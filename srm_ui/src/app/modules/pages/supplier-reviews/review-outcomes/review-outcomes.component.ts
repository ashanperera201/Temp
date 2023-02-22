/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { SupplierReviewConstants } from '../supplier-review-constants';
import {
    ReviewApprover,
    ReviewOutcome,
    ReviewResponse,
    User,
} from '../supplier-review-models';
import 'jspdf-autotable';
//import autoTable from 'jspdf-autotable'
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DataService } from '../supplier-review-data.service';
import Excel from 'exceljs';
import { saveAs } from 'file-saver';
import { BlockSupplierOverlayComponent } from '../block-supplier-overlay/block-supplier-overlay.component';
import { SupplierReviewService } from '../supplier-review-common.service';
@Component({
    selector: 'app-review-outcomes',
    templateUrl: './review-outcomes.component.html',
    styleUrls: ['./review-outcomes.component.scss'],
})
export class ReviewOutcomesComponent implements OnInit {
    displayedColumns13: string[] = [
        'evalName',
        'supplierName',
        'reviewTime',
        'revYear',
        'status',
        'finalScore',
        'outcome',
        'actionButton'
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
    outcomes: MatTableDataSource<ReviewOutcome>;
    panelOpenState = false;
    reviewOutcomeCreatedState =
        SupplierReviewConstants.reviewOutcomeCreatedState;
    reviewApproverWaitingState =
        SupplierReviewConstants.reviewApproverWaitingState;
    reviewResponseApprovalReadyState =
        SupplierReviewConstants.reviewResponseApprovalReadyState;
    reviewOutcomeCompletedState =
        SupplierReviewConstants.reviewOutcomeCompletedState;
    presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
    customTypePeriod = SupplierReviewConstants.customTypePeriod;
    recommendedOutcome = SupplierReviewConstants.recommendedOutcome;
    notRecommendedOutcome = SupplierReviewConstants.notRecommendedOutcome;
    blockedSupplierStatus = SupplierReviewConstants.blockedSupplierStatus;
    users = [];
    allApprovers: ReviewApprover[];
    reviewerApprovers = {}
    loading = false;
    show = true;
    limitingRoles = SupplierReviewConstants.limitingRoles;
  
    /**
     * Constructor
     */
    constructor(
        public dialog: MatDialog,
        private http: HttpClient,
        private supplierReviewService: SupplierReviewService,
        private dataService: DataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (this.limitingRoles.includes(localStorage.getItem("userrole")?.toLowerCase().replace(/\s/g, ""))){
            this.show = false;
          }
        this.requestDataFromMultipleSources().subscribe((responses) => {
            let reviewOutcomes = responses[0];
            this.users = responses[1];

            this.outcomes = new MatTableDataSource<ReviewOutcome>(reviewOutcomes);
            this.outcomes.paginator = this.paginator;
            this.outcomes.sort = this.sort;
            console.log("is this causing the error?", this.outcomes.data)
            for (var i = 0; i < this.outcomes.data?.length; i++) {
                console.log("final score", this.outcomes.data[i].finalScore)
                if (
                    this.outcomes.data[i].finalScore == 0
                ) {
                    console.log("calling calculate outcome")
                    this.supplierReviewService.calculateOutcome(
                        this.outcomes.data[i]);
                }
                this.outcomes.data[i].startDate = new Date(
                    this.outcomes.data[i].startDate
                );
                this.outcomes.data[i].endDate = new Date(
                    this.outcomes.data[i].endDate
                );
            }

            this.allApprovers = responses[2];
            this.allApprovers?.sort((a, b) => (a.stepNo > b.stepNo) ? 1 : -1);
            this.allApprovers?.forEach((approver) => {
                let conductedUserOutcomeKeyString = approver.conductedUser+"-"+approver.outcomeId;
                if (!Object.keys(this.reviewerApprovers).includes(conductedUserOutcomeKeyString)) {
                    this.reviewerApprovers[conductedUserOutcomeKeyString] = [approver.approverName];
                }
                else {
                    if (!this.reviewerApprovers[conductedUserOutcomeKeyString].includes(approver.approverName)) {
                        this.reviewerApprovers[conductedUserOutcomeKeyString].push(approver.approverName);
                    }
                }
            })
        })
    }

    // Filter the data table
    filterChange(type, event): void {
        let value = '';

        value = event ? event.target.value.trim().toLowerCase() : '';

        const filterValue = value;

        this.outcomes.filter = filterValue.trim().toLowerCase();

        if (type === 'evalName') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.evaluationName.toString().toLowerCase().includes(filter);
        } else if (type === 'supplierName') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.supplierName.toString().toLowerCase().includes(filter);
        } else if (type === 'status') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.status.toLowerCase().includes(filter);
        } else if (type === 'reviewTime') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.periodType.toLowerCase().includes(filter);
        } else if (type === 'finalScore') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.finalScore.toString().toLowerCase().includes(filter);
        } else if (type === 'outcome') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.outcome.toString().toLowerCase().includes(filter);
        } else if (type === 'revYear') {
            this.outcomes.filterPredicate = (data, filter: any): boolean => data.reviewYear.toString().toLowerCase().includes(filter);
        }

        if (this.outcomes.paginator) {
            this.outcomes.paginator.firstPage();
        }
    }

    //reset filters/data
    resetFilters(): void {
        this.filterChange('', '');
    }

    viewCharts() {
        this.router.navigate(['/review-summary-charts/']);
        this.dataService.outcomes = this.outcomes.data;
    }

    exportToexcel = () => {
        let outcomes = this.outcomes?.data;
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet('Review Summary');
        worksheet.columns = [
            { key: 'evaluationName', header: 'Evaluation Name' },
            { key: 'initiatedDate', header: 'Initiated Date' },
            { key: 'publishedDate', header: 'Published Date' },
            { key: 'supplier', header: 'Supplier' },
            { key: 'supplierType', header: 'Supplier Type' },
            { key: 'evaluatorNames', header: 'Evaluator Names' },
            {
                key: 'evaluatorDepartments',
                header: 'Evaluator Departments',
            },
            { key: 'evaluationApprovers', header: 'Evaluation Approvers' },
            { key: 'evaluationFrequency', header: 'Evaluation Frequency' },
            { key: 'evaluationDuration', header: 'Evaluation Duration' },
            { key: 'score', header: 'Score' },
            { key: 'passStatus', header: 'Pass/Fail' },
            { key: 'activeStatus', header: 'Active/blocked' },
        ];


        outcomes.forEach((outcome) => {
            let approverList = {};
            let departmentList = {};
            let frequency = 'One off';
            if (outcome.scheduled == '1') {
                frequency = outcome.frequency;
            }
            let duration =
                outcome.startDate.toString().slice(0, 10) +
                ' to ' +
                outcome?.endDate.toString().slice(0, 10);
            if (
                outcome.periodType == this.presetTypePeriod
            ) {
                duration = outcome.presetPeriod;
            }
            let active = 'active';
            if (
                outcome.outcome != this.recommendedOutcome &&
                outcome.status ==
                this.reviewOutcomeCompletedState
            ) {
                active = 'blocked';
            }
            outcome.assignedUsers.split(",").forEach((reviewer) => {
                approverList[reviewer] = this.reviewerApprovers[reviewer+'-'+outcome.id];
                departmentList[reviewer] = '';
            });
            this.users.forEach((user: User) => {
                if (outcome.assignedUsers.split(",").includes(user.name)) {
                    departmentList[user?.name] = user?.department;
                }
            });
            let approverString =  JSON.stringify(approverList).replace(/['"]+/g, '');
            let departmentString =  JSON.stringify(departmentList).replace(/['"]+/g, '');
            let reviewOutcome = {
                evaluationName: outcome.evaluationName,
                initiatedDate: outcome.createdDate.toString().slice(0, 10),
                publishedDate: outcome.modifiedDate.toString().slice(0, 10),
                supplier: outcome.supplierName,
                supplierType: outcome.supplierType,
                evaluatorNames: outcome.assignedUsers,
                evaluatorDepartments: departmentString.substring(1, departmentString.length-1),
                evaluationApprovers: approverString.substring(1, approverString.length-1),
                evaluationFrequency: frequency,
                evaluationDuration: duration,
                score: outcome.finalScore,
                passStatus: outcome.outcome,
                activeStatus: active,
            };
            worksheet.addRow(reviewOutcome);
        })

        workbook.xlsx.writeBuffer().then((data) => {
            const blob = new Blob([data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
            });
            saveAs(blob, 'ReviewSummary.xlsx');
        });
    }

    getApproversOfResponses(reviewResponses): Observable<any[]> {
        var responseList = [];
        reviewResponses?.forEach((reviewResponse) => {
            responseList?.push(
                this.http.get(
                    environment.nodeurl +
                    '/api/supplier/reviewApproversByReviewResponse?reviewResponseId=' +
                    reviewResponse.id
                )
            );
        });
        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin(responseList);
    }

    requestDataFromMultipleSources(): Observable<any[]> {
        var responseList = [];
        responseList.push(this.http
            .get(
                environment.nodeurl +
                '/api/supplier/reviewOutcomesByUser?loggedInUser=' +
                localStorage.getItem('username')));

        responseList.push(this.http
            .get(environment.nodeurl + '/api/workflow/users'));
        responseList.push(this.http
            .get(environment.nodeurl + '/api/supplier/reviewApproversByReviewResponse?reviewResponseId=0'));
        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin(responseList);
    }


    haveActions(row) {
        if (
            row.status == this.reviewOutcomeCompletedState &&
            row.createdUser == localStorage.getItem('username')
        ) {
            return true;
        }
        return false;
    }

    goToReviewResponseSummary(outcome) {
        if (outcome.status != this.reviewOutcomeCompletedState) {
            this.dialog.open(this.errorDialog, { disableClose: true });
        }
        else {

            this.users.forEach((user: User) => {
                if (outcome.createdUser == user.name) {
                    outcome.createdUser = outcome.createdUser + " ("+user?.department+")";
                } 
            });
            this.dataService.outcome = outcome;
            this.router.navigate(['/review-response-summary/']);
        }
    }

    canBlockSupplier(row) {
        if (
            row.outcome == this.notRecommendedOutcome && row.supplierStatus!=this.blockedSupplierStatus
        ) {
            return true;
        }
        return false;
    }
    blockSupplier(row){
        this.loading = true;
        const dialogRef = this.dialog.open(BlockSupplierOverlayComponent, { disableClose: true });
        dialogRef.addPanelClass('inline-md-overlay');
        let instance = dialogRef.componentInstance;
        dialogRef.afterClosed().subscribe(result => {
          if (instance.issuccess) {
            dialogRef.close();
            // call to block supplier on SRM and IFS
            this.http.get(environment.nodeurl + '/api/supplier/reviewOutcomeSupplier?supplierId='+ row.supplierId +
            '&&supplierCode=' + row.supplierCode+ '&&comment=' + instance.comment)
                .subscribe(data => {
                    row.supplierStatus=this.blockedSupplierStatus;
                    this.loading = false;
                });
          }})
      }
}
