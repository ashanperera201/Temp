import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator,PageEvent } from '@angular/material/paginator';
import { MatSort,Sort } from '@angular/material/sort';
import { RFQCostFactorGroupModel } from 'app/main/Models/etendering/rfq-cost-factor-group-model';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { RfqPartLineCostFactorService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-cost-factor.service';
import { RFQPartLineCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-line-cost-factor-model';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { RfqCostFactorsComponent } from '../Lines/rfq-Part-Line/rfq-cost-factors/rfq-cost-factors.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-line-reusable-costactorlist-overlay',
    templateUrl: './add-line-reusable-costfactor-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddLineReusableCostfactorOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    rfqCostFactorGroupModel: RFQCostFactorGroupModel[];
    rFQPartLineList: any[];

    parentComponent: RfqCostFactorsComponent;
    costFactorGroupModel: CostFactorGroupViewModel[];
    cfGroupList: any = [];
    costFactorGroupSearchModel: CostFactorGroupSearchModel = new CostFactorGroupSearchModel();
    descriptions: any;
    name: any;

    rfqId: string;
    rfqPartlineId: any;

    displayedColumns: string[] = ['id', 'title', 'name'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];

    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    ErrorInfo:string="";
    pageEvent: PageEvent;

    selectedLines: any[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddLineReusableCostfactorOverlayComponent>,
        public dialog: MatDialog, private rfqPartLineCostFactorService: RfqPartLineCostFactorService
        , private rfqPartLineService: RfqPartLineService
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.rfqPartlineId = data.rfqPartlineId;
        this.costFactorGroupSearchModel.pageSize = 10;
        this.costFactorGroupSearchModel.page = 1;
        this.costFactorGroupSearchModel.column="title"
        this.costFactorGroupSearchModel.direction = "asc";
    }

    FetchCostFactorList(rfqId: string, partLineId: string) {
        this.rfqId = rfqId;
        this.rfqPartlineId = partLineId;
        this.costFactorGroupSearchModel.rfqId = this.rfqId;
        this.costFactorGroupSearchModel.rfqPartLineId = this.rfqPartlineId;

        if (this.costFactorGroupSearchModel.rfqPartLineId != null) {
            this.rfqPartLineCostFactorService.getCostFactorGroupSearch(this.costFactorGroupSearchModel).subscribe(result => {
               // this.costFactorGroupModel = result.data;
               this.costFactorGroupModel = result.data.costFactorGroupModels;
               this.costFactorGroupSearchModel=result.data;

               const line = this.costFactorGroupSearchModel.costFactorGroupModels;
               for (let k = 0; k < line.length; k++) {
                   if (line[k].isChecked === true) {
                       line[k].isdisable=true;
                       this.selectedLines.push(line[k].name);
                   }
               }
            });
        }

       /*  this.rfqPartLineService.getPartLineByPartLineRFQId(this.costFactorGroupSearchModel.rfqId).subscribe(result => {
            this.rFQPartLineList = result.data;
           
        }) */
    }

    partLineChange() {
        this.searchGroup();
    }

    ngOnInit() {
        this.FetchCostFactorList(this.rfqId, this.rfqPartlineId);
    }

    searchGroup() {
       /*  this.costFactorGroupSearchModel.cFGName = this.name;
        this.costFactorGroupSearchModel.cFGTitle = this.descriptions;
        this.costFactorGroupSearchModel.rfqPartLineId = this.rfqPartlineId;

        this.FetchCostFactorList(this.rfqId, this.rfqPartlineId); */
        if(this.descriptions && this.descriptions != ""){
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.title.indexOf(this.title) > -1;
             }) */
             this.costFactorGroupSearchModel.cFGName=this.descriptions;
         }
         else{
             this.costFactorGroupSearchModel.cFGName=null;
         }
         if(this.name && this.name != ""){
             /* dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.name.indexOf(this.name) > -1;
             }) */
             this.costFactorGroupSearchModel.cFGTitle=this.name;
         }
         else{
             this.costFactorGroupSearchModel.cFGTitle=null;
         }
         this.costFactorGroupSearchModel.pageSize = 10;
        this.costFactorGroupSearchModel.page = 1;
        this.paginator.pageIndex=0;
         this.FetchCostFactorList(this.rfqId, this.rfqPartlineId);
    }

    saveTemplate() {
        this.ErrorInfo="";
        let rfqLineCostFactors: RFQPartLineCostFactorModel[] = [];
        for (var k = 0; k < this.costFactorGroupModel.length; k++) {
           
            if (this.costFactorGroupModel[k].isChecked == true && this.costFactorGroupModel[k].isdisable != true) {
                if(this.costFactorGroupModel[k].costFactorModels.length==0){
                    this.ErrorInfo="Cost Factor List "+this.costFactorGroupModel[k].title+" has no items."
                    return;
                }
                for (var m = 0; m < this.costFactorGroupModel[k].costFactorModels.length; m++) {

                    let rfqPartlineCostFactor: RFQPartLineCostFactorModel = new RFQPartLineCostFactorModel();
                    rfqPartlineCostFactor.costFactorId = this.costFactorGroupModel[k].costFactorModels[m].id;
                    rfqPartlineCostFactor.costFactorGroupId = this.costFactorGroupModel[k].id;
                    rfqPartlineCostFactor.rFQId = this.rfqId;
                    rfqPartlineCostFactor.costTypeId = this.costFactorGroupModel[k].costFactorModels[m].cfTypeId;
                    rfqPartlineCostFactor.rFQPartLineId = this.rfqPartlineId;

                    rfqLineCostFactors.push(rfqPartlineCostFactor);
                }
            }
        }
        if(rfqLineCostFactors.length>0 && this.ErrorInfo==""){
        this.rfqPartLineCostFactorService.SaveRFQPartLine(rfqLineCostFactors).subscribe(result => {
            this.dialogRef.close();
            this.parentComponent.fetchRFQLineCostFactorData(this.rfqId);
            this.parentComponent.Message = "Added";
            this.parentComponent.show("successerror");
            setTimeout(() => { this.parentComponent.dismiss("successerror") }, 3000);
        });
    }
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }
    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.costFactorGroupSearchModel.pageSize = event.pageSize;
        this.costFactorGroupSearchModel.page = page;
        this.FetchCostFactorList(this.rfqId, this.rfqPartlineId);
    }

    sortData(sort: Sort) {
        this.costFactorGroupSearchModel.direction = sort.direction;
        this.costFactorGroupSearchModel.column = sort.active;
        this.FetchCostFactorList(this.rfqId, this.rfqPartlineId);
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedLines.push(row);
        } else {
            this.selectedLines.splice(this.selectedLines.indexOf(row), 1);
        }
    }
}
