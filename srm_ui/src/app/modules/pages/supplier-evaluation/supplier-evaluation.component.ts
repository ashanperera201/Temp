import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { SupplierReviewConstants } from '../supplier-reviews/supplier-review-constants';
import { DataService } from '../supplier-reviews/supplier-review-data.service';
import { ReviewOutcome } from '../supplier-reviews/supplier-review-models';

@Component({
  selector: 'supplier-evaluation',
  templateUrl: './supplier-evaluation.component.html',
  styleUrls: [ './supplier-evaluation.scss' ],
  encapsulation: ViewEncapsulation.None,
})
export class SupplierEvaluationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() supplierId;
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  displayedColumns: string[] = ['EvaluationName', 'reviewTimeline', 'RequestedBy', 'status', 'outcome', 'InitiatedDate'];
  outcomes: MatTableDataSource<ReviewOutcome>;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
  customTypePeriod = SupplierReviewConstants.customTypePeriod;
  reviewOutcomeCreatedState = SupplierReviewConstants.reviewOutcomeCreatedState;
  filterValues: {};
  constructor(public dialog: MatDialog, private http: HttpClient, private dataService: DataService, private router: Router) {}
  ngOnInit(): void {
    this.http.get(environment.nodeurl + '/api/supplier/reviewOutcomeBySupplier?sessionId=0&&supplierId=' + this.supplierId)
    .subscribe((data: ReviewOutcome[]) => {
      if (data) {
        this.outcomes = new MatTableDataSource<ReviewOutcome>(data);
        this.outcomes.paginator = this.paginator;
        this.outcomes.sort = this.sort;
        for (var i = 0; i < this.outcomes.data.length; i++) {
          this.outcomes.data[i].startDate = new Date(this.outcomes.data[i].startDate)
          this.outcomes.data[i].endDate = new Date(this.outcomes.data[i].endDate) 
          }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.outcomes.filter = filterValue.trim().toLowerCase();
  }

  goToReviewSummary(outcome) {
    if (outcome.status == this.reviewOutcomeCreatedState) {
      this.dialog.open(this.errorDialog,{disableClose: true})
    }
    else {
      this.dataService.outcome = outcome
      this.router.navigate(['/summery-review/'])
    }
  }

  }
