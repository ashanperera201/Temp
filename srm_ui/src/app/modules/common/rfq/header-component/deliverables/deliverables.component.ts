import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQHeaderDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-header-deliverable-view-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqHeaderDeliverablesService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-deliverables.service';
import { AddNewDeliverableOverlayComponent } from '../../add-new-deliverable-overlay/add-new-deliverable-overlay.component';
import { RowData9 } from '../../rfq.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-deliverables',
  templateUrl: './deliverables.component.html',
  styleUrls: ['./deliverables.component.scss']
})

export class DeliverablesComponent implements OnInit {
  @Input() RFQID: any;
  @Input() rfqModel: RFQViewModel;
  @Input() dataSource9: MatTableDataSource<RowData9>;
  @Input() displayedColumn9: string[];
  Id: string;

  Message: any = "";
  DeliverableModel: RFQHeaderDeliverableModel[];
  attributeCategories: any[];

  constructor(public dialog: MatDialog, private rfqHeaderDeliverablesService: RfqHeaderDeliverablesService,
    private _fuseAlertService: FuseAlertService, private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) {
  }

  addDeliverable() {
    let milstoneNos = this.DeliverableModel.map(p => p.mileStoneNo);
    const dialogRef = this.dialog.open(AddNewDeliverableOverlayComponent, { data: { "rfxId": this.RFQID, "id": "00000000-0000-0000-0000-000000000000", "rfqHeaderDeliverableListComponent": this, "milstoneNos": milstoneNos } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Added";
        this.fetchRFQHeaderDeliverableData(this.RFQID);
        setTimeout(() => { this.dismiss("successerror") }, 1000);
      }
    });
  }

  ngOnInit(): void {
    this.fetchRFQHeaderDeliverableData(this.RFQID);
    this.dismiss("successerror");
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  fetchRFQHeaderDeliverableData(rfxid: string) {
    this.RFQID = rfxid;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

    this.rfqHeaderDeliverablesService.GetHeaderDeliverablesByRFXId(this.RFQID).subscribe(result => {
      refference.close();
       
      this.DeliverableModel = result.data;

      if (this.DeliverableModel.length > 0) {
        this.attributeCategories = this.DeliverableModel[0].attributeCatagories;
      }
    });
  }

  //delete method
  DeleteRFQHeaderDeliverable(model: RFQHeaderDeliverableModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove contact",
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
        this.rfqHeaderDeliverablesService.DeleteDeliverables([model]).subscribe(result => {
          this.Message = "Deleted";
          this.fetchRFQHeaderDeliverableData(this.RFQID);
          //this.show("successerror");
          this.openSnackBar(this.Message);
        });
      }
    });
  }

  //update method
  UpdateRFQHeaderDeliverable(model: RFQHeaderDeliverableModel, isCategorySave, event) {
    if (isCategorySave == true) {
      model.isCategorySave = true;
    }
    else {
      model.isVisibleToSupplierSave = true;
      model.isVisibleToSuppliers = event.checked;
    }
    this.rfqHeaderDeliverablesService.SaveRFQHDeliverable(model).subscribe(result => {
      this.Message = "Updated";
      //this.show("successerror");
      this.fetchRFQHeaderDeliverableData(this.RFQID);
      //setTimeout(() => { this.dismiss("successerror") }, 1000);
      this.openSnackBar(this.Message);
    });
  }

  EditDeliverables(row: any) {
    let milstoneNos = this.DeliverableModel.map(p => p.mileStoneNo);
    milstoneNos = milstoneNos.filter(p => p != row.mileStoneNo);
    const dialogRef = this.dialog.open(AddNewDeliverableOverlayComponent, { data: { "rfxId": this.RFQID, "id": row.id, "rfqHeaderDeliverableListComponent": this, "editable": true, "milstoneNos": milstoneNos } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Updated";
        //this.show("successerror");
        this.fetchRFQHeaderDeliverableData(this.RFQID);
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