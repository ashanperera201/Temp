/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { RfqHeaderCostFactorService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-cost-factor.service';
import { RFQCostFactorGroupModel } from 'app/main/Models/etendering/rfq-cost-factor-group-model';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { RFQHeaderCostFactorModel } from 'app/main/Models/etendering/ViewModels/rfq-header-cost-factor-model';
import { CostFactorsComponent } from 'app/modules/common/rfq/header-component/cost-factors/cost-factors.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-reusable-costactorlist-overlay',
    templateUrl: './add-reusable-costfactor-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddReusableCostfactorOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    rfqCostFactorGroupModel: RFQCostFactorGroupModel[];

    parentComponent: CostFactorsComponent;
    costFactorGroupModel: CostFactorGroupViewModel[];
    cfGroupList: any = [];
    costFactorGroupSearchModel: CostFactorGroupSearchModel = new CostFactorGroupSearchModel();
    descriptions: any;
    name: any;

    rfqId: string;
    pageEvent: PageEvent;
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
    ErrorInfo: string = "";

    selectedLines: any[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddReusableCostfactorOverlayComponent>,
        public dialog: MatDialog, private rfqHeaderCostFactorService: RfqHeaderCostFactorService
    ) {
        this.parentComponent = data.CostFactorComponent;
        this.rfqId = data.rfqId;
        this.costFactorGroupSearchModel.pageSize = 10;
        this.costFactorGroupSearchModel.page = 1;
        this.costFactorGroupSearchModel.column = "title"
        this.costFactorGroupSearchModel.direction = "asc";
    }

    FetchCostFactorList(rfqId: string) {
        debugger
        this.rfqId = rfqId;
        this.costFactorGroupSearchModel.rfqId = this.rfqId;

        this.rfqHeaderCostFactorService.getCostFactorGroupSearch(this.costFactorGroupSearchModel).subscribe(result => {
            //console.log(result.data);
            this.costFactorGroupModel = result.data.costFactorGroupModels;
            this.costFactorGroupSearchModel = result.data;

            const line = this.costFactorGroupSearchModel.costFactorGroupModels;
            for (let k = 0; k < line.length; k++) {
                if (line[k].isChecked === true) {
                    line[k].isdisable=true;
                    this.selectedLines.push(line[k].name);
                }
            }
        });
    }

    ngOnInit() {
        this.FetchCostFactorList(this.rfqId);
    }

    searchGroup() {
        /*  this.costFactorGroupSearchModel.cFGName = this.name;
         this.costFactorGroupSearchModel.cFGTitle = this.descriptions; */
        if (this.descriptions && this.descriptions != "") {
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.title.indexOf(this.title) > -1;
             }) */
            this.costFactorGroupSearchModel.cFGName = this.descriptions;
        }
        else {
            this.costFactorGroupSearchModel.cFGName = null;
        }
        if (this.name && this.name != "") {
            /* dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.name.indexOf(this.name) > -1;
            }) */
            this.costFactorGroupSearchModel.cFGTitle = this.name;
        }
        else {
            this.costFactorGroupSearchModel.cFGTitle = null;
        }
        this.costFactorGroupSearchModel.pageSize = 10;
        this.costFactorGroupSearchModel.page = 1;
        this.costFactorGroupSearchModel.totalItems = 0;
        this.costFactorGroupSearchModel.totalPages = 0;
        this.paginator.pageIndex = 0;
        this.FetchCostFactorList(this.rfqId);
    }

    saveTemplate() {
        this.ErrorInfo = "";
        let rfqHeaderCostFactors: RFQHeaderCostFactorModel[] = [];
        for (var k = 0; k < this.costFactorGroupModel.length; k++) {
            if (this.costFactorGroupModel[k].isChecked == true && this.costFactorGroupModel[k].isdisable != true) {
                if (this.costFactorGroupModel[k].costFactorModels.length == 0) {
                    this.ErrorInfo = "Cost Factor List " + this.costFactorGroupModel[k].title + " has no items."
                    return;
                }
                for (var m = 0; m < this.costFactorGroupModel[k].costFactorModels.length; m++) {
                    let rfqHeaderCostFactor: RFQHeaderCostFactorModel = new RFQHeaderCostFactorModel();
                    rfqHeaderCostFactor.costFactorId = this.costFactorGroupModel[k].costFactorModels[m].id;
                    rfqHeaderCostFactor.costFactorGroupId = this.costFactorGroupModel[k].id;
                    rfqHeaderCostFactor.rFQId = this.rfqId;
                    rfqHeaderCostFactor.costTypeId = this.costFactorGroupModel[k].costFactorModels[m].cfTypeId;

                    rfqHeaderCostFactors.push(rfqHeaderCostFactor);
                }
            }

        }
        if (rfqHeaderCostFactors.length > 0 && this.ErrorInfo == "") {
            this.rfqHeaderCostFactorService.SaveRFQHeader(rfqHeaderCostFactors).subscribe(result => {
                this.dialogRef.close();
                this.parentComponent.fetchRFQHeaderCostFactorData(this.rfqId);
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
        this.FetchCostFactorList(this.rfqId);
    }

    sortData(sort: Sort) {
        this.costFactorGroupSearchModel.direction = sort.direction;
        this.costFactorGroupSearchModel.column = sort.active;
        this.FetchCostFactorList(this.rfqId);
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedLines.push(row);
        } else {
            this.selectedLines.splice(this.selectedLines.indexOf(row), 1);
        }
    }
}
