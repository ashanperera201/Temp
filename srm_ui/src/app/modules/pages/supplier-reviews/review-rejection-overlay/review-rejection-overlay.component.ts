import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'review-rejection-overlay',
  templateUrl: './review-rejection-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class ReviewRejectionOverlayComponent {
  approver: string;
  comment: string = "";
  issuccess = false;
  firstScreen: boolean = true;
  loading: boolean = false;
  lastScreen: boolean = false;


  constructor(public dialogRef: MatDialogRef<ReviewRejectionOverlayComponent>,
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