import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';
import { CostFactorService } from 'app/shared/Services/etendering/cost-factor.service';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-overlay',
    templateUrl: './add-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'factor', 'description'];
    pageEvent: PageEvent;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    issuccess = false;
    iserror = false;

    costFactorGroupID: any = "";
    costFactor: CostFactorSearchModel = new CostFactorSearchModel();
    costFactorGroup: any = new CostFactorGroupSearchModel();
    AddedCostFactor: any = [];
    actualCostFactorModels: any = [];
    cfName: string = "";
    cfDescription: string = "";
    isSaved:boolean =false;
    constructor(public dialogRef: MatDialogRef<AddOverlayComponent>, private fb: FormBuilder,
        public dialog: MatDialog, private costFactorService: CostFactorService, @Inject(MAT_DIALOG_DATA) public data
        , private costFactorGroupservice: CostFactorGroupService) {
        this.costFactorGroupID = this.data.AddedCostFactor.id;
        this.AddedCostFactor = this.data.AddedCostFactor;
    }

    addCostFactor() {
        this.savechanges(this.costFactor.costFactorTextViewModels);
    }

    savechanges(costFactorTextViewModels) {
        this.isSaved=true;
        let data: any = [];
        for (var i = 0; i < this.AddedCostFactor.costFactorModels.length; i++) {
            data.push(this.AddedCostFactor.costFactorModels[i]);
        }
        for (var i = 0; i < costFactorTextViewModels.length; i++) {
            if (costFactorTextViewModels[i].isChecked == true && costFactorTextViewModels[i].isDisabled == false) {
                data.push(costFactorTextViewModels[i]);
            }
        }
        this.AddedCostFactor.costFactorModels = [];
        this.AddedCostFactor.costFactorModels = data;
        this.actualCostFactorModels = data;
        for (var i = 0; i < this.actualCostFactorModels.length; i++) {
            this.actualCostFactorModels[i].costFactorGroupId = this.costFactorGroupID;
        }
        this.costFactorGroupservice.SaveCostFactorGroupMapping(this.actualCostFactorModels).subscribe(
            result => {
                this.isSaved=false;
                Swal.fire({
                    icon: 'success',
                    title: "Cost factor Added to List successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
                //costFactorGroupSearchModel.costFactorGroupModels = result;
                this.dialogRef.close();
                this.FetchBasicData();
            });
    }

    sortData(sort: Sort) {
        this.costFactor.direction = sort.direction;
        this.costFactor.column = sort.active;
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.costFactor.page = 1;
        this.costFactor.pageSize = 10000;
        this.costFactorService.getCFList(this.costFactor).subscribe(
            result => {
                this.costFactor = result;

                for (var i = 0; i < this.costFactor.costFactorTextViewModels.length; i++) {
                    this.costFactor.costFactorTextViewModels[i].isChecked = false;
                    this.costFactor.costFactorTextViewModels[i].isDisabled = false;
                    for (var k = 0; k < this.AddedCostFactor.costFactorModels.length; k++) {
                        if (this.costFactor.costFactorTextViewModels[i].id == this.AddedCostFactor.costFactorModels[k].id) {
                            this.costFactor.costFactorTextViewModels[i].isChecked = true;
                            this.costFactor.costFactorTextViewModels[i].isDisabled = true;
                        }
                    }
                }
            });
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.costFactor.pageSize = event.pageSize;
        this.costFactor.page = page;
        this.FetchBasicData();
    }

    SetIsChecked(row, event) {
        row.isChecked = event.checked;
    }

    searchData() {
        let dataList: CostFactorTextViewModel[] = this.actualCostFactorModels;

        if (this.cfName && this.cfName != "") {
            dataList = dataList.filter((data: CostFactorTextViewModel) => {
                return data.cfName.indexOf(this.cfName) > -1;
            })
        }

        if (this.cfDescription && this.cfDescription != "") {
            dataList = dataList.filter((data: CostFactorTextViewModel) => {
                return data.cfDescription.indexOf(this.cfDescription) > -1;
            })
        }

        this.costFactor.costFactorTextViewModels = dataList;
    }

}