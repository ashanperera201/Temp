/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable max-len */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-var */
/* eslint-disable arrow-parens */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RfqPartLineAttributeService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attribute.service';
import { RFQPartLineAttributeGroupModel } from 'app/main/Models/etendering/rfq-partline-attribute-group-model';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQPartLineAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-attribute-model';
import { AddNewLineAttributeListOverlayComponent } from '../../../add-new-line-attributelist-overlay/add-new-line-attribute-list-overlay.component';
import { AddReusableLineAttributeOverlayComponent } from '../../../add-reusable-line-attribute-overlay/add-reusable-line-attribute-overlay.component';
import { AddLineAttributeItemOverlayComponent } from '../../../add-line-attribute-item-overlay/add-line-attribute-item-overlay.component';
import { AddNewLineAttributeOverlayComponent } from '../../../add-new-line-attribute-overlay/add-new-line-attribute-overlay.component';
import { EditNewLineAttributeOverlayComponent } from '../../../edit-new-line-attribute-overlay/edit-new-line-attribute-overlay.component';
import { AddAttrLineItemOverlayComponent } from '../../../add-attr-line-item-overlay/add-attr-line-item-overlay.component'
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-attribute-items',
  templateUrl: './rfq-attribute-items.component.html',
  styleUrls: ['./rfq-attribute-items.component.scss']
})
export class RFQAttributeItemsComponent implements OnInit {

  @Input() RFQID: any;
  @Input() RFQPartLineID: any;
  @Input() RFQModel: any;
  @Input() index: any;
  rfqPartLineAttributeGroupModel: RFQPartLineAttributeGroupModel[];
  detailsDisplayMap = new Map();
  attributeCategoryTypes: any[];
  attributeDataTypes: any[];
  message: string = "";
  attributeValueTypes: any[];
  constructor(public dialog: MatDialog,
    private rfqPartLineAttributeService: RfqPartLineAttributeService,
    private _fuseAlertService: FuseAlertService,
    private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) { }

  reusableAttributeList() {
    const dialogRef = this.dialog.open(AddReusableLineAttributeOverlayComponent, { data: { "context": this, rfqId: this.RFQID, partLineId: this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  addAttributeList() {
    const dialogRef = this.dialog.open(AddNewLineAttributeListOverlayComponent, { data: { "rfqId": this.RFQID, "context": this, partLineId: this.RFQPartLineID, "label": "New " } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addAttributeItem() {
    const dialogRef = this.dialog.open(AddLineAttributeItemOverlayComponent, { data: { "context": this, rfqId: this.RFQID, partLineId: this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addNewAttributeItem() {
    const dialogRef = this.dialog.open(AddNewLineAttributeOverlayComponent, { data: { "rfqId": this.RFQID, "context": this, rfqPartLineId: this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editAttributeList(row: any) {
    const dialogRef = this.dialog.open(AddNewLineAttributeListOverlayComponent, { data: { "id": row, "rfqId": this.RFQID, "context": this, "label": "Edit " } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editAttributeItem(row: any) {
    //console.log(row)
    if(row.attributes.rfqId!=null){
      const dialogRef = this.dialog.open(AddAttrLineItemOverlayComponent, { data: { "id": row, "context": this,"isPrev":false } });
      dialogRef.addPanelClass('inline-md-overlay');
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    else{
    const dialogRef = this.dialog.open(EditNewLineAttributeOverlayComponent, { data: { "id": row, "rfqId": this.RFQID, "context": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  }

  toggleDisplay(id: string) {
    var existingVal = this.detailsDisplayMap.get(id);
    if (existingVal) {
      this.detailsDisplayMap.set(id, !existingVal)
    } else {
      this.detailsDisplayMap.set(id, true)
    }
  }

  getActiveDetailsTab(id: string): boolean {
    return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
  }

  fetchRfqPartLineAttributeData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    this.rfqPartLineAttributeService.getRFQPartLineAttributeByRFQId(this.RFQID, this.RFQPartLineID).subscribe(result => {
      refference.close();
      this.rfqPartLineAttributeGroupModel = result.data;

      if (this.rfqPartLineAttributeGroupModel.length > 0) {
        this.attributeCategoryTypes = this.rfqPartLineAttributeGroupModel[0].rfqLineAttributeModels[0].attributeCategoryTypes;
        this.attributeDataTypes = this.rfqPartLineAttributeGroupModel[0].rfqLineAttributeModels[0].attributeDataTypes;
        this.attributeValueTypes = this.rfqPartLineAttributeGroupModel[0].rfqLineAttributeModels[0].attributeFormatValueModels;
      }
    });
  }
  fetchRfqLineAttributeData(rfqId: string, rfqpartlineId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    this.rfqPartLineAttributeService.getRFQPartLineAttributeByRFQId(this.RFQID, rfqpartlineId).subscribe(result => {
      refference.close();
      this.rfqPartLineAttributeGroupModel = result.data;

      if (this.rfqPartLineAttributeGroupModel.length > 0) {
        this.attributeCategoryTypes = this.rfqPartLineAttributeGroupModel[0].rfqLineAttributeModels[0].attributeCategoryTypes;
        this.attributeDataTypes = this.rfqPartLineAttributeGroupModel[0].rfqLineAttributeModels[0].attributeDataTypes;
      }
    });
  }
  ngOnInit(): void {
    this.fetchRfqPartLineAttributeData(this.RFQID);
    this.dismiss("successerror");
    this.index = this.index.toString();
  }

  getName() {
    const name = 'successerror' + this.index;
    return name;
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  updateRfqPartLineAttribute(model: any, update: string) {
    if (this.RFQModel.isSaveAsDraft == true) {
      if (update == 'ACT') {
        model.isCategoryTypeSave = true;
      } else if (update == 'RE') {
        model.isRequiredSave = true;
      } else if (update == 'DT') {
        model.isDisplayTargetSave = true;
      }
      else if (update == 'VTS') {
        model.isVisibibleToSuppliersSave = true;
      }
      let rfqLineAttributes: RFQPartLineAttributeGroupModel[] = [];
      rfqLineAttributes.push(model);
      const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
      this.rfqPartLineAttributeService.savePartLineAttribute(rfqLineAttributes).subscribe(result => {
        refference.close();
        this.fetchRfqPartLineAttributeData(this.RFQID);
        this.message = "Updated";
       /*  this.show(this.getName());
        setTimeout(() => { this.dismiss(this.getName()) }, 3000); */
        this.openSnackBar(this.message);
      });
    }
  }

  deleteRfqPartLineAttributeData(model: RFQPartLineAttributeModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Attribute Item",
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
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.message = "Deleted";
        this.rfqPartLineAttributeService.deleteRFQPartLineAttribute([model]).subscribe(result => {
          this.fetchRfqPartLineAttributeData(this.RFQID);
          /* this.show(this.getName());
          setTimeout(() => { this.dismiss(this.getName()) }, 3000); */
          this.openSnackBar(this.message);
        });
      }
    });
  }

  deleteRfqPartLineAttributeGroupData(model: RFQPartLineAttributeModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Attribute Group",
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
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.message = "Deleted";
        // console.log(model);
        this.rfqPartLineAttributeService.deleteRFQPartLineAttributeGroup([model]).subscribe(result => {
          this.fetchRfqPartLineAttributeData(this.RFQID);
          /* this.show(this.getName());
          setTimeout(() => { this.dismiss(this.getName()) }, 3000); */
          this.openSnackBar(this.message);
        });
      }
    });
  }

}
