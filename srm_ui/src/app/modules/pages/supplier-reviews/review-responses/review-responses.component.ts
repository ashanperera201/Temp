import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { DataService } from '../supplier-review-data.service';
import { ReviewApprover, ReviewResponse } from '../supplier-review-models';
import { FormControl } from '@angular/forms';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { ApprovalHistoryOverlayComponent } from '../approval-history-overlay/approval-history-overlay.component';
@Component({
  selector: 'app-review-responses',
  templateUrl: './review-responses.component.html',
  styleUrls: ['./review-responses.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class ReviewResponsesComponent {
  displayedColumns13: string[] = [ 'evalName', 'supplierName', 'conBy', 'status', 'iniDate','modDate', 'score',
   'sendForApprovalsButton', 'approvalInitiatedDate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  reviews: MatTableDataSource<ReviewResponse>;
  panelOpenState = false;
  filterValues = {
    evaluationName: '',
    supplierName: '',
    conductedUser: '',
    status: '',
    modifiedDate: '',
    createdDate: ''
  };
  evalNameFilter = new FormControl('');
  supplierNameFilter = new FormControl('');
  conByFilter = new FormControl('');
  statusFilter = new FormControl('');
  modDateFilter = new FormControl('');
  iniDateFilter = new FormControl('');
  reviewResponseCreatedState = SupplierReviewConstants.reviewResponseCreatedState;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
  reviewResponseApprovalWaitingState = SupplierReviewConstants.reviewResponseApprovalWaitingState;
  reviewApproverWaitingState = SupplierReviewConstants.reviewApproverWaitingState;
  reviewApproverReinitiatedState = SupplierReviewConstants.reviewApproverReinitiatedState;
  loading: boolean = false;
  responseApprovers = {};
  APPROVER_COUNT = 4;
  show = true;
  limitingRoles = SupplierReviewConstants.limitingRoles;
  
  /**
   * Constructor
   */
  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient, private dataService: DataService) {
  }

  ngOnInit(): void {
    if (this.limitingRoles.includes(localStorage.getItem("userrole")?.toLowerCase().replace(/\s/g, ""))){
      this.show = false;
    }
    this.http.get(environment.nodeurl + '/api/supplier/reviewResponsesByUser?loggedInUser=' + localStorage.getItem("username"))
      .subscribe((data: ReviewResponse[]) => {
        if (data) {
          this.http.get(environment.nodeurl + '/api/supplier/reviewApproversByReviewResponse?reviewResponse=0')
          .subscribe((reviewApprovers: ReviewApprover[]) => {
            if (reviewApprovers) {
              reviewApprovers.sort((a, b) => (a.stepNo > b.stepNo) ? 1 : -1);
              data.forEach((reviewResponse)=>{
                reviewApprovers.forEach((reviewApprover)=>{
                  if (reviewApprover.reviewResponseId==reviewResponse.id){
                    if (reviewResponse.id in this.responseApprovers){
                      this.responseApprovers[reviewResponse.id].push(reviewApprover);
                    }
                    else{
                      this.responseApprovers[reviewResponse.id] = [reviewApprover];
                    }
                }})
                if (reviewResponse.status==this.reviewResponseApprovalWaitingState){
                  reviewApprovers.forEach((reviewApprover)=>{
                    if (reviewApprover.reviewResponseId==reviewResponse.id){
                      if (reviewApprover.status==this.reviewApproverWaitingState)
                        { 
                          reviewResponse.status += " by "+reviewApprover.approverName;} 
                  }})
                }
               
              })

              this.reviews = new MatTableDataSource<ReviewResponse>(data);
              this.reviews.paginator = this.paginator;
              this.reviews.sort = this.sort;
              this.reviews.filterPredicate = this.createFilter();
            }})
        }
      });

      this.evalNameFilter.valueChanges
      .subscribe(
        evaluationName => {
          this.filterValues.evaluationName = evaluationName.trim().toLowerCase();
          this.reviews.filter = JSON.stringify(this.filterValues);
        }
      )
      this.supplierNameFilter.valueChanges
      .subscribe(
        supplierName => {
          this.filterValues.supplierName = supplierName.trim().toLowerCase();
          this.reviews.filter = JSON.stringify(this.filterValues);
        }
      )
      this.conByFilter.valueChanges
      .subscribe(
        conductedUser => {
          this.filterValues.conductedUser = conductedUser.trim().toLowerCase();
          this.reviews.filter = JSON.stringify(this.filterValues);
        }
      )
    this.statusFilter.valueChanges
      .subscribe(
        status => {
          this.filterValues.status = status.trim().toLowerCase();
          this.reviews.filter = JSON.stringify(this.filterValues);
        }
      )
    this.iniDateFilter.valueChanges
    .subscribe(
      createdDate => {
        this.filterValues.createdDate = createdDate.trim().toLowerCase();
        this.reviews.filter = JSON.stringify(this.filterValues);
      }
    )
    this.modDateFilter.valueChanges
      .subscribe(
        modifiedDate => {
          this.filterValues.modifiedDate = modifiedDate.trim().toLowerCase();
          this.reviews.filter = JSON.stringify(this.filterValues);
        }
      )
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data, filter): boolean {
      let searchTerms = JSON.parse(filter);
      return data.evaluationName.toLowerCase().indexOf(searchTerms.evaluationName) !== -1
        && data.supplierName.toString().toLowerCase().indexOf(searchTerms.supplierName) !== -1
        && data.conductedUser.toLowerCase().indexOf(searchTerms.conductedUser) !== -1
        && data.status.toLowerCase().indexOf(searchTerms.status) !== -1
        && data.modifiedDate.toLowerCase().indexOf(searchTerms.modifiedDate) !== -1
        && data.createdDate.toLowerCase().indexOf(searchTerms.createdDate) !== -1;
    }
    return filterFunction;

  }

  goToReviewResponse(reviewResponseId) {
    this.dataService.editResponse = 0;
    this.dataService.approvalState = 1;
    this.router.navigate(['/review-response-page/' + reviewResponseId]);
  }

  canViewApproval(row){
    return true;
    // if (row.status!=this.reviewResponseCreatedState){
    //   return true;
    // }
    // return false;
  }

  canViewApprovalHistory(row){
    if (this.responseApprovers[row.id]){
      return true;
    }
    return false;
  }

  viewApprovalHistory(row){
    const dialogRef = this.dialog.open(ApprovalHistoryOverlayComponent, { disableClose: true });
    dialogRef.addPanelClass('inline-md-overlay');
    let instance = dialogRef.componentInstance;
    let approversTemp =  this.responseApprovers[row.id];
    let approvers = [];
    approversTemp.sort((a, b) => (a.id > b.id) ? 1 : -1)
    for (let i = 0; i < approversTemp.length / this.APPROVER_COUNT; i++) {
      let approversInstance = approversTemp.slice(i * this.APPROVER_COUNT, i * this.APPROVER_COUNT + this.APPROVER_COUNT).sort((a, b) => (a.stepNo > b.stepNo) ? 1 : -1);
      let approversInstanceTemp = [];
      let ignore = false;
      approversInstance.forEach((approver) => {
        if (!ignore) {
          approversInstanceTemp.push(approver);
        }
        if (approver.status == this.reviewApproverReinitiatedState) {
          ignore = true;
        }
      })
      approvers = approvers.concat(approversInstanceTemp);
    }
    instance.approvers = new MatTableDataSource(approvers);
    dialogRef.afterClosed().subscribe(result => {
      })
    }
}
