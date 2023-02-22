import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DataService } from '../supplier-review-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { ReviewResponse } from '../supplier-review-models';
import { SupplierReviewConstants } from '../supplier-review-constants';


@Component({
  selector: 'app-review-reinitiation-overlay',
  templateUrl: './review-reinitiation-overlay.component.html',
  styleUrls: ['./review-reinitiation-overlay.component.scss']
})


export class ReviewReinitiationOverlayComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  reviewResponse: ReviewResponse;


  approver: string;
  comment: string;
  issuccess = false;
  firstScreen: boolean = true;
  lastScreen: boolean = false;


  reviewResponseCreatedState = SupplierReviewConstants.reviewResponseCreatedState;
  reviewOutcomeCreatedState = SupplierReviewConstants.reviewOutcomeCreatedState;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
  constructor(private dataService: DataService, private http: HttpClient, public dialogRef: MatDialogRef<ReviewReinitiationOverlayComponent>) {
    this.reviewResponse = this.dataService.reviewResponse;
    dialogRef.disableClose = true; 
  }

  ngOnInit(): void {
  }
  
  submitForm(): void {
    this.reviewResponse.status = this.reviewResponseCreatedState;
    this.http.post<any>(environment.nodeurl + '/api/supplier/reviewResponse', this.reviewResponse)
      .subscribe(data => {
       this.firstScreen = false;
       this.lastScreen = true;
      });
  
  }

  doAction() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  Continue() {
    this.dialogRef.close({ event: 'Cancel' });
    this.issuccess = true;
  }
}
