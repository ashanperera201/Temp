/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { ReviewInitiationForm } from '../supplier-review-models';


@Component({
  selector: 'review-initiation-summary',
  templateUrl: './review-initiation-summary-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ReviewInitiationSummaryOverlayComponent {

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  displayedColumn2: string[] = ['index', 'id', 'name'];
  displayedColumn3: string[] = ['index', 'sid', 'sname'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  editSession = 0;
  selectedId: any = [];
  issuccess = false;
  iserror = false;
  dialogTitle = 'Supplier Review Initiation Summary';
  submitButtonText = 'Initiate Review';
  gradingMethodA = SupplierReviewConstants.gradingMethodA;
  gradingMethodB = SupplierReviewConstants.gradingMethodB;
  gradingMethodC = SupplierReviewConstants.gradingMethodC;
  gradingMethodD = SupplierReviewConstants.gradingMethodD;
  reviewCreatedState = SupplierReviewConstants.reviewCreatedState;


  usersAssignMethod = SupplierReviewConstants.usersAssignMethod;
  userRolesAssignMethod = SupplierReviewConstants.userRolesAssignMethod;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
  customTypePeriod = SupplierReviewConstants.customTypePeriod;
  reviewInitiationForm: ReviewInitiationForm;
  supplierNameList = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<ReviewInitiationSummaryOverlayComponent>,
    public dialog: MatDialog, private http: HttpClient
  ) {
    debugger
    this.reviewInitiationForm = data.value;
    const reviewInitiationForm = this.reviewInitiationForm;
    this.http.get<any>(environment.nodeurl + '/api/supplier/allSuppliersTrunc')
      .subscribe((data) => {
        this.supplierNameList = data.filter(function (supplier) {
          return reviewInitiationForm.supplierList.includes(supplier.supplierID);
        });
      });
      dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    if (this.editSession == 1) {
      this.dialogTitle = 'Review Session Edit Summary';
      this.submitButtonText = 'Edit Review Session';
    }
    this.http.get<any>(environment.nodeurl + '/api/supplier/reviewForm?formId=' + this.reviewInitiationForm.formId)
      .subscribe((data) => {
        if (data) {
          this.reviewInitiationForm.formName = data.name;
        }
      });
  }
  doAction() {
    this.dialogRef.close();

  }

  saveReview() {
    this.reviewInitiationForm.suppliers = this.reviewInitiationForm.supplierList.toString();
    this.reviewInitiationForm.createdUser = localStorage.getItem('username');
    this.reviewInitiationForm.assignedUsers = this.reviewInitiationForm.assignedUsersList.toString();
    this.reviewInitiationForm.assignedUserRoles = this.reviewInitiationForm.assignedUserRolesList.toString();
    this.reviewInitiationForm.gradeCategories = JSON.stringify(this.reviewInitiationForm.gradeCategoriesArray);
    this.reviewInitiationForm.reviewerWeights = JSON.stringify(this.reviewInitiationForm.reviewerWeightsArray);

    if (this.reviewInitiationForm.status != this.reviewCreatedState) {
      this.http.post<any>(environment.nodeurl + '/api/supplier/reviewSessionPublish', this.reviewInitiationForm).subscribe((data) => {
        this.http.post<any>(environment.nodeurl + '/api/supplier/reviewSession', this.reviewInitiationForm)
          .subscribe((data) => {
            this.issuccess = true;
            this.dialogRef.close();
          });
      });
    }
    else {
      this.http.post<any>(environment.nodeurl + '/api/supplier/reviewSession', this.reviewInitiationForm)
        .subscribe((data) => {
          this.issuccess = true;
          this.dialogRef.close();
        });
    }
  }
}
