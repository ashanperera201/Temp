import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQAttributeGroupModel } from 'app/main/Models/etendering/rfq-attribute-group-model';
import { RFQHeaderAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attribute-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AddAttributeItemOverlayComponent } from '../../add-attribute-item-overlay/add-attribute-item-overlay.component';
import { AddNewAttributeOverlayComponent } from '../../add-new-attribute-overlay/add-new-attribute-overlay.component';
import { AddNewAttributeListOverlayComponent } from '../../add-new-attributelist-overlay/add-new-attribute-list-overlay.component';
import { AddReusableAttributeOverlayComponent } from '../../add-reusable-attribute-overlay/add-reusable-attribute-overlay.component';
import { EditNewAttributeOverlayComponent } from '../../edit-new-attribute-overlay/edit-new-attribute-overlay.component';
import { AddAttrHdrItemOverlayComponent } from '../../add-attr-hdr-item-overlay/add-attr-hdr-item-overlay.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
@Component({
  selector: 'app-attribute-item',
  templateUrl: './attribute-item.component.html',
  styleUrls: ['./attribute-item.component.scss']
})
export class AttributeItemComponent implements OnInit {

  @Input() RFQID: any;
  rfqAttributeGroupModel: RFQAttributeGroupModel[];
  @Input() RFQModel: any;
  detailsDisplayMap = new Map();
  attributeFieldTypes: any[];
  attributeCategoryTypes: any[];
  attributeDataTypes: any[];
  attributeValueTypes: any[];
  message: string = "";
  fieldType: string = "";

  constructor(public dialog: MatDialog,
    private rfqHeaderAttributeService: RfqHeaderAttributeService,
    private _fuseAlertService: FuseAlertService,
    private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) {

  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x');
  }


  reusableAttributeList() {
    const dialogRef = this.dialog.open(AddReusableAttributeOverlayComponent, { data: { "rfqId": this.RFQID, "context": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addAttributeList() {
    const dialogRef = this.dialog.open(AddNewAttributeListOverlayComponent, { data: { "rfqId": this.RFQID, "context": this,"label":"New " } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addAttributeItem() {
    const dialogRef = this.dialog.open(AddAttributeItemOverlayComponent, { data: { "context": this, "rfqId": this.RFQID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addNewAttributeItem() {
    const dialogRef = this.dialog.open(AddNewAttributeOverlayComponent, { data: { "rfqId": this.RFQID, "context": this} });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  editAttributeList(row: any) {
    const dialogRef = this.dialog.open(AddNewAttributeListOverlayComponent, { data: { "id": row, "rfqId": this.RFQID, "context": this,"label":"Edit " } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editAttributeItem(row: any) {
    if(row.attributeModel.rfqId!=null){
      const dialogRef = this.dialog.open(AddAttrHdrItemOverlayComponent, { data: { "id": row, "context": this,"isPrev":false } });
      dialogRef.addPanelClass('inline-md-overlay');
      dialogRef.disableClose = true;
      dialogRef.afterClosed().subscribe(result => {
      });
    }
    else{
      const dialogRef = this.dialog.open(EditNewAttributeOverlayComponent, { data: { "id": row, "context": this } });
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

  fetchRfqHeaderAttributeData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    this.rfqHeaderAttributeService.getRFQHeaderAttributeByRFQId(this.RFQID).subscribe(result => {
      refference.close();
      this.rfqAttributeGroupModel = result.data;
      //console.log(this.rfqAttributeGroupModel);
      if (this.rfqAttributeGroupModel.length > 0) {
        this.attributeCategoryTypes = this.rfqAttributeGroupModel[0].rfqHeaderAttributeModels[0].attributeCategoryTypes;
        this.attributeDataTypes = this.rfqAttributeGroupModel[0].rfqHeaderAttributeModels[0].attributeDataTypes;
        this.attributeValueTypes = this.rfqAttributeGroupModel[0].rfqHeaderAttributeModels[0].attributeFormatValueModels;
      }
    });
  }

  deleteRfqHeaderAttributeData(model: RFQHeaderAttributeModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Attribute",
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
        //model[0].rFXId=this.RFQID;
        this.rfqHeaderAttributeService.deleteRFQHeaderAttribute([model]).subscribe(result => {
          this.fetchRfqHeaderAttributeData(this.RFQID);
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 3000); */
          this.openSnackBar(this.message);
        });
      }
    });
  }

  deleteRfqHeaderAttributeGroupData(model: RFQHeaderAttributeModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove Attribute List",
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
        //console.log(model);
        //model.rFXId=this.RFQID;
        this.rfqHeaderAttributeService.deleteRFQHeaderAttributeGroup([model]).subscribe(result => {
          this.fetchRfqHeaderAttributeData(this.RFQID);
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 3000); */
          this.openSnackBar(this.message);
        });
      }
    });
  }

  ngOnInit(): void {
    this.fetchRfqHeaderAttributeData(this.RFQID);
    this.dismiss("successerror");
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  updateRfqHeaderAttribute(model: any, update: string) {
    if(this.RFQModel.isSaveAsDraft==true){
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
    let rfqHeaderAttributes: RFQHeaderAttributeModel[] = [];
    rfqHeaderAttributes.push(model);
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    this.rfqHeaderAttributeService.saveHeaderAttribute(rfqHeaderAttributes).subscribe(result => {
      refference.close();
      this.fetchRfqHeaderAttributeData(this.RFQID);
      this.message = "Updated";
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000); */
      this.openSnackBar(this.message);
    });
  }
}

}