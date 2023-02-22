import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import { RfqPartLineCostFactorService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-cost-factor.service';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RFQPartLineCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-line-cost-factor-model';
import { RfqCostFactorsComponent } from '../Lines/rfq-Part-Line/rfq-cost-factors/rfq-cost-factors.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'add-line-costfactor-item-overlay',
  templateUrl: './add-line-costfactor-item-overlay.component.html',
  styleUrls: ['./add-line-costfactor-item-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddLineCostfactorItemOverlayComponent {
  rfqId: string;
  costfactorSearchModel: CostFactorSearchModel = new CostFactorSearchModel();
  detailsDisplayMap = new Map();
  costfactorModel: CostFactorTextViewModel[];
  CostFactorName: any;
  Description: any;
  CostType: any;
  costTypeList: any[];
  costTypeSelection: any;
  parentComponent: RfqCostFactorsComponent;
  rfqPartlineId: any;
  rFQPartLineList: any[];
  pageEvent: PageEvent;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  displayedColumns: string[] = ['id', 'name', 'description', 'type'];
  displayedColumns2: string[] = ['id', 'name2'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  NewListId: string = "";

  selectedCostFactor: any[] = [];
  isSaved:boolean =false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddLineCostfactorItemOverlayComponent>,
    public dialog: MatDialog, private rfqPartLineCostFactorService: RfqPartLineCostFactorService
    , private rfqPartLineService: RfqPartLineService
  ) {
    this.rfqId = data.rfqId;
    this.rfqPartlineId = data.rfqPartlineId;
    if (data.NewListId != null) {
      // console.log(data.NewListId);
      this.NewListId = data.NewListId;
    }
    this.parentComponent = data.CostFactorComponent;
    this.costfactorSearchModel.pageSize = 10;
    this.costfactorSearchModel.page = 1;
  }
  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.costfactorSearchModel.pageSize = event.pageSize;
    this.costfactorSearchModel.page = page;
    this.fetchRFQLineCostFactorData(this.rfqId);
  }

  sortData(sort: Sort) {
    this.costfactorSearchModel.direction = sort.direction;
    this.costfactorSearchModel.column = sort.active;
    this.fetchRFQLineCostFactorData(this.rfqId);
  }
  fetchRFQLineCostFactorData(rfqId: string) {
    // if (this.costfactorSearchModel.rfqPartlineId != null) {
    this.costfactorSearchModel.rfqId = rfqId;
    this.costfactorSearchModel.rfqPartlineId = this.rfqPartlineId;
    this.costfactorSearchModel.NewListId = this.NewListId
    this.rfqPartLineCostFactorService.getCostFactorSearchByRFQId(this.costfactorSearchModel).subscribe(result => {
      // this.costfactorModel = result.data;
      this.costfactorSearchModel = result.data
      this.costfactorModel = result.data.costFactorTextViewModels;
      this.costTypeList = this.costfactorModel[0].cfTypes;

      for (let k = 0; k < this.costfactorModel.length; k++) {
        if (this.costfactorModel[k].isChecked === true) {
          this.costfactorModel[k].ischeckdisabled=true;
          this.selectedCostFactor.push(this.costfactorModel[k].cfName);
          if(this.costfactorModel[k].costFactorGroupModels!=null){
            for(let j = 0; j < this.costfactorModel[k].costFactorGroupModels.length; j++){
                if (this.costfactorModel[k].costFactorGroupModels[j].isChecked === true) {
                    this.costfactorModel[k].costFactorGroupModels[j].isdisable=true;
                }
            }
        }
        }
      }
    });
    // }
    /* this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
      this.rFQPartLineList = result.data;
    }) */
  }

  partLineChange() {
    this.searchGroup();
  }

  searchGroup() {

    this.costfactorSearchModel.cfName = this.CostFactorName;
    this.costfactorSearchModel.cfDescription = this.Description;
    this.costfactorSearchModel.rfqPartlineId = this.rfqPartlineId;
    this.costfactorSearchModel.pageSize = 10;
    this.costfactorSearchModel.page = 1;
    this.costfactorSearchModel.totalItems = 0;
    this.costfactorSearchModel.totalPages = 0;
    this.paginator.pageIndex = 0;
    if (this.costTypeSelection != null) {
      this.costfactorSearchModel.cfTypeId = this.costTypeSelection;
    }

    this.fetchRFQLineCostFactorData(this.rfqId);

    /*  this.Description = "";
     this.CostFactorName = "";
     if (this.costfactorSearchModel.cfTypeId != null) {
       this.costfactorSearchModel.cfTypeId = "";
       this.costTypeSelection = null;
     } */
  }

  ngOnInit(): void {
    this.fetchRFQLineCostFactorData(this.rfqId);
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

  doAction() {
    this.dialogRef.close();
    //window.location.reload() ;
  }
  SaveItem() {
    this.isSaved=true;
    if (this.NewListId == "") {
      console.log(this.NewListId);
      this.saveTemplate()
    }
    else {

      this.saveAttributeItemNew()
    }
  }
  saveAttributeItemNew() {
    let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
    for (var k = 0; k < this.costfactorModel.length; k++) {
      if (this.costfactorModel[k].isChecked == true) {

        let rfqLineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();

        rfqLineCostFactor.costFactorId = this.costfactorModel[k].id;
        rfqLineCostFactor.costFactorGroupId = this.NewListId;
        rfqLineCostFactor.rFQId = this.rfqId;
        rfqLineCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;
        rfqLineCostFactor.rFQPartLineId = this.rfqPartlineId;

        rfqLineCostFactors.push(rfqLineCostFactor);
      }
    }
    if (rfqLineCostFactors.length > 0) {
      this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
        this.isSaved=false;
        this.dialogRef.close();
        this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
        this.parentComponent.Message = "Added";
        this.parentComponent.show("successerror");
        setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
      });
    }
  }
  saveTemplate() {
    let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
    for (var k = 0; k < this.costfactorModel.length; k++) {
      if (this.costfactorModel[k].isChecked == true) {
        if (this.costfactorModel[k].costFactorGroupModels != null && this.costfactorModel[k].costFactorGroupModels.length > 0) {
          let checkedgroup = this.costfactorModel[k].costFactorGroupModels.filter(i => i.isChecked == true)
          if (checkedgroup.length > 0) {
            for (var m = 0; m < this.costfactorModel[k].costFactorGroupModels.length; m++) {
              if (this.costfactorModel[k].costFactorGroupModels[m].isChecked == true) {
                let rfqLineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();
                rfqLineCostFactor.costFactorId = this.costfactorModel[k].id;
                rfqLineCostFactor.costFactorGroupId = this.costfactorModel[k].costFactorGroupModels[m].id;
                rfqLineCostFactor.rFQId = this.rfqId;
                rfqLineCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;
                rfqLineCostFactor.rFQPartLineId = this.rfqPartlineId;

                rfqLineCostFactors.push(rfqLineCostFactor);
              }
            }
          }
          else {
            let rfqLineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();
            rfqLineCostFactor.costFactorId = this.costfactorModel[k].id;
            //rfqLineCostFactor.costFactorGroupId = this.costfactorModel[k].costFactorGroupModels[m].id;
            rfqLineCostFactor.rFQId = this.rfqId;
            rfqLineCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;
            rfqLineCostFactor.rFQPartLineId = this.rfqPartlineId;

            rfqLineCostFactors.push(rfqLineCostFactor);
          }
        }
        else {
          let rfqLineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();
          rfqLineCostFactor.costFactorId = this.costfactorModel[k].id;
          //rfqLineCostFactor.costFactorGroupId = this.costfactorModel[k].costFactorGroupModels[m].id;
          rfqLineCostFactor.rFQId = this.rfqId;
          rfqLineCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;
          rfqLineCostFactor.rFQPartLineId = this.rfqPartlineId;

          rfqLineCostFactors.push(rfqLineCostFactor);
        }

      }

    }
    if (rfqLineCostFactors.length > 0) {
      this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
        this.isSaved=false;
        this.dialogRef.close();
        this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
        this.parentComponent.Message = "Added";
        this.parentComponent.show("successerror");
        setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
      });
    }
  }

  showOptions(event: MatCheckboxChange, row): void {
    if (event.checked === true) {
      this.selectedCostFactor.push(row);
    } else {
      this.selectedCostFactor.splice(this.selectedCostFactor.indexOf(row), 1);
    }
  }

}