import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import { RFQHeaderCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-header-cost-factor-model';
import { CostFactorsComponent } from 'app/modules/common/rfq/header-component/cost-factors/cost-factors.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'add-costfactor-item-overlay',
  templateUrl: './add-costfactor-item-overlay.component.html',
  styleUrls: ['./add-costfactor-item-overlay.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddCostfactorItemOverlayComponent {
  rfqId: string;
  costfactorSearchModel: CostFactorSearchModel = new CostFactorSearchModel();
  detailsDisplayMap = new Map();
  costfactorModel: CostFactorTextViewModel[];
  CostFactorName: any;
  Description: any;
  CostType: any;
  costTypeList: any[];
  costTypeSelection: any;
  parentComponent: CostFactorsComponent;

  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  displayedColumns: string[] = ['id', 'name', 'description', 'type'];
  displayedColumns2: string[] = ['id', 'name2'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;

  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  NewListId: string = "";

  selectedCostFactor: any[] = [];
  isSaved:boolean =false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddCostfactorItemOverlayComponent>,
    public dialog: MatDialog, private rfqHeaderCostFactorService: RfqHeaderCostFactorService
  ) {
    this.rfqId = data.rfqId;
    this.parentComponent = data.CostFactorComponent;
    this.costfactorSearchModel.pageSize = 10;
    this.costfactorSearchModel.page = 1;
    if (data.NewListId != null) {
      // console.log(data.NewListId);
      this.NewListId = data.NewListId;
    }
  }
  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.costfactorSearchModel.pageSize = event.pageSize;
    this.costfactorSearchModel.page = page;
    this.fetchRFQHeaderCostFactorData(this.rfqId);
  }

  sortData(sort: Sort) {
    this.costfactorSearchModel.direction = sort.direction;
    this.costfactorSearchModel.column = sort.active;
    this.fetchRFQHeaderCostFactorData(this.rfqId);
  }
  fetchRFQHeaderCostFactorData(rfqId: string) {
    this.costfactorSearchModel.rfqId = rfqId;
    this.costfactorSearchModel.NewListId = this.NewListId
    this.rfqHeaderCostFactorService.getCostFactorSearchByRFQId(this.costfactorSearchModel).subscribe(result => {

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
  }

  searchGroup() {
    this.costfactorSearchModel.cfName = this.CostFactorName;
    this.costfactorSearchModel.cfDescription = this.Description;
    if (this.costTypeSelection != null) {
      this.costfactorSearchModel.cfTypeId = this.costTypeSelection;
    }
    this.costfactorSearchModel.pageSize = 10;
    this.costfactorSearchModel.page = 1;
    this.costfactorSearchModel.totalItems = 0;
    this.costfactorSearchModel.totalPages = 0;
    this.paginator.pageIndex = 0;
    this.fetchRFQHeaderCostFactorData(this.rfqId);

    /*  this.Description = "";
     this.CostFactorName = "";
     if (this.costfactorSearchModel.cfTypeId != null) {
       this.costfactorSearchModel.cfTypeId = "";
       this.costTypeSelection = null;
     } */
  }

  ngOnInit(): void {
    this.fetchRFQHeaderCostFactorData(this.rfqId);
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

  addTemplate(item, event) {
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
    let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
    for (var k = 0; k < this.costfactorModel.length; k++) {
      if (this.costfactorModel[k].isChecked == true) {

        let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
        rfqHeaderCostFactor.costFactorId = this.costfactorModel[k].id;
        rfqHeaderCostFactor.costFactorGroupId = this.NewListId;
        rfqHeaderCostFactor.rFQId = this.rfqId;
        rfqHeaderCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;

        rfqHeaderCostFactors.push(rfqHeaderCostFactor);
      }
    }
    if (rfqHeaderCostFactors.length > 0) {
      this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
        this.isSaved=false;
        this.dialogRef.close();
        this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
        this.parentComponent.Message = "Added";
        this.parentComponent.show("successerror");
        setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
      });
    }
  }
  saveTemplate() {

    let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
    for (var k = 0; k < this.costfactorModel.length; k++) {
      if (this.costfactorModel[k].isChecked == true) {
        if (this.costfactorModel[k].costFactorGroupModels != null && this.costfactorModel[k].costFactorGroupModels.length > 0) {
          let checkedgroup = this.costfactorModel[k].costFactorGroupModels.filter(i => i.isChecked == true)
          if (checkedgroup.length > 0) {
            for (var m = 0; m < this.costfactorModel[k].costFactorGroupModels.length; m++) {
              if (this.costfactorModel[k].costFactorGroupModels[m].isChecked == true) {
                let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
                rfqHeaderCostFactor.costFactorId = this.costfactorModel[k].id;
                rfqHeaderCostFactor.costFactorGroupId = this.costfactorModel[k].costFactorGroupModels[m].id;
                rfqHeaderCostFactor.rFQId = this.rfqId;
                rfqHeaderCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;

                rfqHeaderCostFactors.push(rfqHeaderCostFactor);
              }
            }
          }
          else {
            let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
            rfqHeaderCostFactor.costFactorId = this.costfactorModel[k].id;
            //rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
            rfqHeaderCostFactor.rFQId = this.rfqId;
            rfqHeaderCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;

            rfqHeaderCostFactors.push(rfqHeaderCostFactor);
          }
        }
        else {
          let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
          rfqHeaderCostFactor.costFactorId = this.costfactorModel[k].id;
          //rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
          rfqHeaderCostFactor.rFQId = this.rfqId;
          rfqHeaderCostFactor.costTypeId = this.costfactorModel[k].cfTypeId;

          rfqHeaderCostFactors.push(rfqHeaderCostFactor);
        }

      }

    }
    if (rfqHeaderCostFactors.length > 0) {
      this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
        this.isSaved=false;
        this.dialogRef.close();
        this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
        this.parentComponent.Message = "Added";
        this.parentComponent.show("successerror");
        setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
      });
    }
  }

  setParentIsChecked(cf, event) {
    cf.isChecked = event.checked;
  }

  showOptions(event: MatCheckboxChange, row): void {
    if (event.checked === true) {
      this.selectedCostFactor.push(row);
    } else {
      this.selectedCostFactor.splice(this.selectedCostFactor.indexOf(row), 1);
    }
  }
}
