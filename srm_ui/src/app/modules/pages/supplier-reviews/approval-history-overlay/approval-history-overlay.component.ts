import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReviewApprover } from '../supplier-review-models';

@Component({
  selector: 'app-approval-history-overlay',
  templateUrl: './approval-history-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ApprovalHistoryOverlayComponent {
  // approvers = [];
  approvers: MatTableDataSource<ReviewApprover>;
  displayedApproverColumns = ['approverId', 'approverName', 'email', 'status', 'approvedDate', 'comments'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialogRef: MatDialogRef<ApprovalHistoryOverlayComponent>,
    public dialog: MatDialog) {
      dialogRef.disableClose = true; 
  }

  ngOnInit() {
    if (this.approvers.paginator) {
      this.approvers.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.approvers.paginator = this.paginator;
    this.approvers.sort = this.sort;
  }

  goBack() {
    this.dialogRef.close({ event: 'Cancel' });
  }
}