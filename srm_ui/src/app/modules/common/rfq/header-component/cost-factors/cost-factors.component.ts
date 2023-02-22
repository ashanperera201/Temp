import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RFQCostFactorGroupModel } from 'app/main/Models/etendering/rfq-cost-factor-group-model';
import { RFQHeaderCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-header-cost-factor-model';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { AddCostfactorItemOverlayComponent } from '../../add-costfactor-item-overlay/add-costfactor-item-overlay.component';
import { AddNewCostfactorOverlayComponent } from '../../add-new-costfactor-overlay/add-new-costfactor-overlay.component';
import { AddNewCostfactorlistOverlayComponent } from '../../add-new-costfactorlist-overlay/add-new-costfactorlist-overlay.component';
import { AddReusableCostfactorOverlayComponent } from '../../add-reusable-costfactor-overlay/add-reusable-costfactor-overlay.component';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cost-factors',
  templateUrl: './cost-factors.component.html',
  styleUrls: ['./cost-factors.component.scss']
})
export class CostFactorsComponent implements OnInit {
  rfqCostFactorGroupModel: RFQCostFactorGroupModel[];
  rfqHeaderCostFactorList: any = [];
  //Checks if Add new cf overlay is triggered to edit Cost factor name, disc and expected value
  isEditOperation: boolean = false;
  // To hold cost factor item data so it can be passed to Add new cost factor item overlay
  costFactorModelTemp: any;
  @Input() RFQModel: any;
  detailsDisplayMap = new Map();

  AttributeCatagoryTypes: any[];
  AttributeFieldTypes: any[];
  CostTypes: any[];
  Message: string;
  @Input() RFQID: any;
  message: string = "";
  constructor(public dialog: MatDialog, private rfqHeaderCostFactorService: RfqHeaderCostFactorService, private _fuseAlertService: FuseAlertService
    , private _fuseConfirmationService: FuseConfirmationService, private _snackBar: MatSnackBar) {
  }

  reusableCostFactorList() {
    const dialogRef = this.dialog.open(AddReusableCostfactorOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  addCostFactorList() {
    const dialogRef = this.dialog.open(AddNewCostfactorlistOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this,"label":"New ","costTypeList": this.CostTypes  } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editCostFactorList() {
    const dialogRef = this.dialog.open(AddNewCostfactorlistOverlayComponent, { data: { "rfqId": this.RFQID, "editOperation": this.isEditOperation, "CostFactorGroupId": this.costFactorModelTemp.id, "CostFactorComponent": this,"label":"Edit " } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  addNewCostFactorItem() {
    const dialogRef = this.dialog.open(AddNewCostfactorOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this, "costTypeList": this.CostTypes, } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  editNewCostFactorItems() {
    const dialogRef = this.dialog.open(AddNewCostfactorOverlayComponent, { data: { "rfqId": this.RFQID, "costTypeList": this.CostTypes, "editOperation": this.isEditOperation, "CostFactorId": this.costFactorModelTemp.id, "CostFactorComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  addCostFactorItem() {
    const dialogRef = this.dialog.open(AddCostfactorItemOverlayComponent, { data: { "rfqId": this.RFQID, "CostFactorComponent": this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
    });
  }

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

  fetchRFQHeaderCostFactorData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    this.rfqHeaderCostFactorService.GetRFQHeaderCostFactorGroupByRFQId(this.RFQID).subscribe(result => {
      refference.close();
      this.rfqCostFactorGroupModel = result.data;
    if(this.rfqCostFactorGroupModel.length>0){
      this.AttributeCatagoryTypes = this.rfqCostFactorGroupModel[0].rfqHearderCostFactorList[0].attributeCategoryList;
      this.AttributeFieldTypes = this.rfqCostFactorGroupModel[0].rfqHearderCostFactorList[0].attributeFieldTypeList;
      this.CostTypes = this.rfqCostFactorGroupModel[0].rfqHearderCostFactorList[0].costTypeList;

      this.rfqCostFactorGroupModel.forEach(cfGroup => cfGroup.rfqHearderCostFactorList.forEach(cfItem => {
        return cfItem.attributeCategory = cfItem.attributeCategoryList.find(cateogry => cateogry.id == cfItem.attributeCategoryId), cfItem.costType = cfItem.costTypeList.find(costType => costType.id == cfItem.costTypeId)
          , cfItem.attributeFieldType = cfItem.attributeFieldTypeList.find(fieldType => fieldType.id == cfItem.attributeFieldTypeId)
      }));
    }
    });
  
  }

  ngOnInit(): void {
    this.fetchRFQHeaderCostFactorData(this.RFQID);
    this.dismiss("successerror");
  }

  //2
  editCostFactorItemDetails(model: any) {
    this.isEditOperation = true;
    this.costFactorModelTemp = model;
    this.editNewCostFactorItems();

    this.isEditOperation = false;
  }

  //1
  editCostFactorListDetails(model: any) {
    this.isEditOperation = true;
    this.costFactorModelTemp = model;
    this.editCostFactorList();
    this.isEditOperation = false;
  }

  SaveCostFactorItems(model: any, update: string) {
    if(this.RFQModel.isSaveAsDraft==true){
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

    let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
    model.rfq=null;
    rfqHeaderCostFactors.push(model);
    this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
      this.fetchRFQHeaderCostFactorData(this.RFQID);
      this.Message = "Updated";
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 1000); */
      this.openSnackBar(this.Message);
    });
  }
  }


  DeleteCostFactorItem(model: RFQHeaderCostFactorModel[]) {
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
        this.rfqHeaderCostFactorList.push(model);
        this.rfqHeaderCostFactorService.DeleteRFQHeaderCostFactor(this.rfqHeaderCostFactorList).subscribe(result => {
          this.fetchRFQHeaderCostFactorData(this.RFQID);
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 1000); */
          this.openSnackBar(this.Message);
        });
      }
    });
  }

  DeleteCostFactorGroup(model: RFQHeaderCostFactorModel[]) {
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
        this.rfqHeaderCostFactorService.DeleteRFQHeaderCostFactor(model).subscribe(result => {
          this.fetchRFQHeaderCostFactorData(this.RFQID);
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 1000); */
          this.openSnackBar(this.Message);
        });
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
