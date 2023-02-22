import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-application-loader',
  templateUrl: './application-loader.component.html',
  styleUrls: ['./application-loader.component.scss']
})
export class ApplicationLoaderComponent implements OnInit {

  constructor(
    public matDialogRef: MatDialogRef<ApplicationLoaderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.matDialogRef.disableClose = true;
  }
}
