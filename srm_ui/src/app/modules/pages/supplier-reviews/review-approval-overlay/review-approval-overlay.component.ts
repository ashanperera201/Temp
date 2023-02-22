import { Component, ViewEncapsulation, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface RowData {
  id: string;
  group: string;
  objKey: string;
  visibility: string;
}

@Component({
  selector: 'review-approval-overlay',
  templateUrl: './review-approval-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ReviewApprovalOverlayComponent {
  approver: string;
  comment: string;
  issuccess = false;
  firstScreen: boolean = true;
  lastScreen: boolean = false;



  constructor(public dialogRef: MatDialogRef<ReviewApprovalOverlayComponent>,
    public dialog: MatDialog) {
      dialogRef.disableClose = true; 
  }

  ngOnInit() {

  }

  doAction() {
    this.dialogRef.close({ event: 'Cancel' });
  }

  submit() {
    this.issuccess = true;
    this.firstScreen = false;
    this.lastScreen = true;
  }

  Continue() {
    this.dialogRef.close({ event: 'Cancel' });
    this.issuccess = true;
  }

}