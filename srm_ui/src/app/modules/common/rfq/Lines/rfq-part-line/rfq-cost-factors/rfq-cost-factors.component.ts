/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-body-style */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable arrow-parens */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RFQCostFactorGroupModel } from 'app/main/Models/etendering/rfq-cost-factor-group-model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import { RfqPartLineCostFactorService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-cost-factor.service';
import { AddLineReusableCostfactorOverlayComponent } from '../../../add-line-reusable-costfactor-overlay/add-line-reusable-costfactor-overlay.component';
import { AddNewLineCostfactorlistOverlayComponent } from '../../../add-new-line-costfactorlist-overlay/add-new-line-costfactorlist-overlay.component';
import { AddNewLineCostfactorOverlayComponent } from '../../../add-new-line-costfactor-overlay/add-new-line-costfactor-overlay.component';
import { AddLineCostfactorItemOverlayComponent } from '../../../add-line-costfactor-item-overlay/add-line-costfactor-item-overlay.component';
import { RFQPartLineCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-line-cost-factor-model';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-rfq-cost-factors',
  templateUrl: './rfq-cost-factors.component.html',
  styleUrls: ['./rfq-cost-factors.component.scss']
})
export class RfqCostFactorsComponent implements OnInit {
  @Input() RFQModel: any;
  rfqCostFactorGroupModel: RFQCostFactorGroupModel[];
  rfqLineCostFactorList: any = [];
  //Checks if Add new cf overlay is triggered to edit Cost factor name, disc and expected value
  isEditOperation: boolean = false;
  // To hold cost factor item data so it can be passed to Add new cost factor item overlay
  costFactorModelTemp: any;

  detailsDisplayMap = new Map();
  AttributeCatagoryTypes: any[];
  AttributeFieldTypes: any[];
  CostTypes: any[];
  Message: string;
  @Input() RFQID: any;
  @Input() RFQPartLineID: any;
  @Input() index: any;

  constructor(public dialog: MatDialog, private rfqPartLineCostFactorService: RfqPartLineCostFactorService, private _fuseAlertService: FuseAlertService
    , private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) { }

  isShow = true;

  toggleDisplay(id: string) {
    var existingVal = this.detailsDisplayMap.get(id);
    if (existingVal) {
      this.detailsDisplayMap.set(id, !existingVal)
    } else {
      this.detailsDisplayMap.set(id, true)
    }
  }

  getactiveDetailsTab(id: string): boolean {
    return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
  }

  fetchRFQLineCostFactorData(rfqId: string) {
    
 const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
 
    this.rfqPartLineCostFactorService.getLineCostFactorGroupByRFQId(rfqId, this.RFQPartLineID).subscribe(result => {
      refference.close();
      this.rfqCostFactorGroupModel = result.data;
      // console.log(this.rfqCostFactorGroupModel)
      if (this.rfqCostFactorGroupModel.length > 0) {
        this.AttributeCatagoryTypes = this.rfqCostFactorGroupModel[0].rfqLineCostFactorList[0].attributeCategoryList;
        this.AttributeFieldTypes = this.rfqCostFactorGroupModel[0].rfqLineCostFactorList[0].attributeFieldTypeList;
        this.CostTypes = this.rfqCostFactorGroupModel[0].rfqLineCostFactorList[0].costTypeList;

        this.rfqCostFactorGroupModel.forEach(cfGroup => cfGroup.rfqLineCostFactorList.forEach(cfItem => {
          return cfItem.attributeCategory = cfItem.attributeCategoryList.find(cateogry => cateogry.id == cfItem.attributeCategoryId), cfItem.costType = cfItem.costTypeList.find(costType => costType.id == cfItem.costTypeId)
            , cfItem.attributeFieldType = cfItem.attributeFieldTypeList.find(fieldType => fieldType.id == cfItem.attributeFieldTypeId)
        }));
      }
    });
  }

  ngOnInit(): void {
    this.fetchRFQLineCostFactorData(this.RFQID);
    this.dismiss("successerror");
    this.index = this.index.toString();
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  getName() {
    let name = 'successerror' + this.index;
    return name;
  }

  editCostFactorItemDetails(model: any) {
    this.isEditOperation = true;
    this.costFactorModelTemp = model;
    this.editNewCostFactorItems();
    this.isEditOperation = false;
  }

  editCostFactorListDetails(model: any) {
    this.isEditOperation = true;
    this.costFactorModelTemp = model;
    this.editCostFactorList();
    this.isEditOperation = false;
  }

  SaveCostFactorItems(model: any, update: string) {
    debugger    
    if (this.RFQModel.isSaveAsDraft == true) {
      if (update == 'CT') {
        model.isCostTypeSave = true;
      } else if (update == 'ACT') {
        model.isAttributeCategoryTypeSave = true;
      } else if (update == 'AFT') {
        model.isFieldTypeeSave = true;
      } else if (update == 'DTT') {
        model.isDisplayTargetSave = true;
      }
      else if (update == 'VTS') {
        model.isVisibibleToSuppliersSave = true;
      }

      let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
      model.rfq = null;
      model.rfqPartLine = null;
      rfqLineCostFactors.push(model);
      this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
        this.fetchRFQLineCostFactorData(this.RFQID);
        this.Message = "Updated";
        /* this.show(this.getName());
        setTimeout(() => { this.dismiss(this.getName()); this.Message = ''; }, 1000); */
        this.openSnackBar(this.Message);
      });
    }
  }

  DeleteCostFactorItem(model: RFQPartLineCostFactorModel[]) {
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
        this.Message = "Deleted";
        this.rfqLineCostFactorList.push(model);
        this.rfqPartLineCostFactorService.DeleteRFQLineCostFactor(this.rfqLineCostFactorList).subscribe(result => {
          this.fetchRFQLineCostFactorData(this.RFQID);
          this.rfqLineCostFactorList.clear()
          /* this.show(this.getName());
          setTimeout(() => { this.dismiss(this.getName()); this.Message = ''; }, 1000); */
          this.openSnackBar(this.Message);
        });
      }
    });
  }

  DeleteCostFactorGroup(model: RFQPartLineCostFactorModel[]) {
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
        this.Message = "Deleted";
        model.forEach(p => p.deleteType = "CostFactorGroup");
        this.rfqPartLineCostFactorService.DeleteRFQLineCostFactor(model).subscribe(result => {
          this.fetchRFQLineCostFactorData(this.RFQID);
          /* this.show(this.getName());
          setTimeout(() => { this.dismiss(this.getName()); this.Message = ''; }, 1000); */
          this.openSnackBar(this.Message);
        });
      }
    });
  }

  reusableCostFactorList() {
    const dialogRef = this.dialog.open(AddLineReusableCostfactorOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this, "rfqPartlineId": this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addCostFactorList() {
    const dialogRef = this.dialog.open(AddNewLineCostfactorlistOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this, "rfqPartlineId": this.RFQPartLineID, "costTypeList": this.CostTypes } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editCostFactorList() {
    const dialogRef = this.dialog.open(AddNewLineCostfactorlistOverlayComponent, { data: { "rfqId": this.RFQID, "editOperation": this.isEditOperation, "CostFactorgroupId": this.costFactorModelTemp.id, "CostFactorComponent": this, "rfqPartlineId": this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addNewCostFactorItem() {
    const dialogRef = this.dialog.open(AddNewLineCostfactorOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this, "costTypeList": this.CostTypes, "rfqPartlineId": this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editNewCostFactorItems() {
    const dialogRef = this.dialog.open(AddNewLineCostfactorOverlayComponent, { data: { "rfqId": this.RFQID, "costTypeList": this.CostTypes, "editOperation": this.isEditOperation, "CostFactorId": this.costFactorModelTemp.id, "CostFactorComponent": this, "rfqPartlineId": this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addCostFactorItem() {
    const dialogRef = this.dialog.open(AddLineCostfactorItemOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this, "rfqPartlineId": this.RFQPartLineID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
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
