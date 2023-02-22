import { ComponentType } from '@angular/cdk/portal/public-api';
import { Injectable } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { dialogKeys } from './dialog.constants';


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public matDialog: MatDialog) { }

  openDialog<T>(modalKey: string, component: ComponentType<T>): void {
    switch (modalKey) {
      case dialogKeys.REVIEW_FORM_CONFIGURATION:
        this.matDialog.open(component, {
          height: 'auto',
          width: '95%'
        })
        break;
      default:
        break;
    }
  }

}
