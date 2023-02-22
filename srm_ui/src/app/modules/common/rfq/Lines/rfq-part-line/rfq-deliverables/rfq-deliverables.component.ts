/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQPartLineDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-deliverable-view-model';
import { RfqPartLineDeliverableService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-deliverable.service';
import { AddNewLineDeliverableOverlayComponent } from '../../../add-new-line-deliverable-overlay/add-new-line-deliverable-overlay.component';
import { RowData9 } from '../../../rfq.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rfq-deliverables',
  templateUrl: './rfq-deliverables.component.html',
  styleUrls: ['./rfq-deliverables.component.scss']
})
export class RfqDeliverablesComponent implements OnInit {
  @Input() RFQID: any;
  @Input() RFQModel: any;
  @Input() RFQPartLineID: any;
  @Input() dataSource9: MatTableDataSource<RowData9>;
  displayedColumn9: string[] = ['id', 'milestonenumber', 'milestonename', 'deliverabledescription', 'type5', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'visibility5'];
  Id: string;

  Message: any = "";
  deliverableModel: RFQPartLineDeliverableModel[];
  attributeCategories: any[];

  constructor(private _changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog, private rfqPartLineDeliverableService: RfqPartLineDeliverableService,
    private _fuseAlertService: FuseAlertService, private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchRFQPartLineDeliverableData(this.RFQID);
    this.dismiss("successerror");
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  addDeliverable() {
    let milstoneNos = this.deliverableModel.map(p => p.mileStoneNo);
    const dialogRef = this.dialog.open(AddNewLineDeliverableOverlayComponent, { data: { "rfqId": this.RFQID, rfqPartLineId: this.RFQPartLineID, "id": "00000000-0000-0000-0000-000000000000", "rfqHeaderDeliverableListComponent": this, "milstoneNos": milstoneNos } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Added";
        this.fetchRFQPartLineDeliverableData(this.RFQID);
        //setTimeout(() => { this.dismiss("successerror") }, 1000);
        this.openSnackBar(this.Message);
      }
    });
  }



  fetchRFQPartLineDeliverableData(rfxid: string) {
    this.RFQID = rfxid;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
    this.rfqPartLineDeliverableService.getPartLineDeliverableByRFQPartLineId(this.RFQID, this.RFQPartLineID).subscribe(result => {
      refference.close();
      this.deliverableModel = result.data;

      if (this.deliverableModel.length > 0) {
        this.attributeCategories = this.deliverableModel[0].attributeCatagories;
      }
      this._changeDetectorRef.detectChanges();
    });
  }

  //delete method
  DeleteRFQPartLineDeliverable(model: RFQPartLineDeliverableModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Deliverable",
      "message": "Are you sure you want to delete this record?",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Remove",
          "color": "warn"
        },
        "cancel": {
          "show": true,
          "label": "Cancel"
        }
      },
      "dismissible": true
    });
    dialogRef.addPanelClass('confirmation-dialog');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.rfqPartLineDeliverableService.DeleteDeliverables([model]).subscribe(result => {
          this.Message = "Deleted";
          this.fetchRFQPartLineDeliverableData(this.RFQID);
          //this.show("successerror");
          this.openSnackBar(this.Message);
        });
      }
    });
  }

  //update method
  UpdateRFQPartLineDeliverable(model: RFQPartLineDeliverableModel, isCategorySave, event) {
    if (isCategorySave == true) {
      model.isCategorySave = true;
    }
    else {
      model.isVisibleToSupplierSave = true;
      model.displayToSupplier = event.checked;
    }
    this.rfqPartLineDeliverableService.SaveRFQPDeliverable(model).subscribe(result => {
      this.Message = "Updated";
      //this.show("successerror");
      this.openSnackBar(this.Message);
      this.fetchRFQPartLineDeliverableData(this.RFQID);
      //setTimeout(() => { this.dismiss("successerror") }, 1000);
    });
  }

  EditPartLineDeliverables(row: any) {
    let milstoneNos = this.deliverableModel.map(p => p.mileStoneNo);
    milstoneNos = milstoneNos.filter(p => p != row.mileStoneNo);
    const dialogRef = this.dialog.open(AddNewLineDeliverableOverlayComponent, { data: { "id": row.id, "rfqLineDeliverableListComponent": this, "editable": true, rfqId: this.RFQID, rfqPartLineId: this.RFQPartLineID, "milstoneNos": milstoneNos } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Updated";
        //this.show("successerror");
        this.fetchRFQPartLineDeliverableData(this.RFQID);
        //setTimeout(() => { this.dismiss("successerror") }, 1000);
        this.openSnackBar(this.Message);
      }
    });
  }

  /**
* Dismiss the alert via the service
*
* @param name
*/
  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }
  /**
 * Show the alert via the service
 *
 * @param name
 */
  show(name: string): void {
    this._fuseAlertService.show(name);
  }
}