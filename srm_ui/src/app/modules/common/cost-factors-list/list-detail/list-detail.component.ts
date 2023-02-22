import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AddOverlayComponent } from './add-overlay/add-overlay.component';
import { Router } from '@angular/router';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'rfx',
    templateUrl: './list-detail.component.html',
    styleUrls: ['./list-detail.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ListDetailComponent {
    displayedColumns: string[] = ['id', 'factor', 'description'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;
    panelOpenState = false;
    costFactorGroupID: any;
    costFactorGroups: any = new CostFactorGroupSearchModel();
    costFactor: any = new CostFactorSearchModel();
    showMsg: boolean = false;
    Message: string = "";
    actualCostFactorModels: any = [];
    cfName: string = "";
    cfDescription: string = "";
    cfType: string = "";
    cfTypeName: any;
    dataTypeList: any = [];
    selectedDataType: any;

    constructor(public dialog: MatDialog,
        private costFactorGroupService: CostFactorGroupService, private router: Router) {
        this.costFactorGroupID = this.router.getCurrentNavigation().extras.state.Id
        this.costFactorGroups.pageSize = 5;
        this.costFactorGroups.page = 1;
    }

    FetchBasicData() {
        this.costFactorGroupService.getCostFactorGroupById({ "cfgId": this.costFactorGroupID, "cfgTitle": this.costFactorGroups.cfName, "cfgDesc": this.costFactorGroups.cfgDesc }).subscribe(result => {
            this.costFactorGroups = result.data;
            if (!this.costFactorGroups.costFactorModels) {
                this.costFactorGroups.costFactorModels = [];
            }
            for (var i = 0; i < result.data.costFactorModels.length; i++) {
                this.actualCostFactorModels.push(result.data.costFactorModels[i]);
            }
            this.dataTypeList = result.data.dataTypeList;
        }
        );
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.costFactorGroups.pageSize = event.pageSize;
        this.costFactorGroups.page = page;
        this.FetchBasicData();
    }

    sortData(sort: Sort) {
        this.costFactor.direction = sort.direction;
        this.costFactor.column = sort.active;
        this.FetchBasicData();
    }

    saveChanges() {
        for (var i = 0; i < this.actualCostFactorModels.length; i++) {
            this.actualCostFactorModels[i].costFactorGroupId = this.costFactorGroupID;
        }
        this.costFactorGroupService.SaveCostFactorGroupMapping(this.actualCostFactorModels).subscribe(
            result => {
                this.Message = "Added";
            }
        );
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddOverlayComponent, { data: { AddedCostFactor: this.costFactorGroups } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            if (result == "success") {
                this.FetchBasicData();
            }
            // let data:any=[];
            // for (var i = 0; i < this.costFactorGroups.costFactorModels.length; i++) {
            //     data.push(this.costFactorGroups.costFactorModels[i]);
            // }
            // for(var i=0; i<result.length; i++)
            // {
            //     if(result[i].isChecked==true && result[i].isDisabled==false)
            //     {
            //         data.push(result[i]);
            //     } 
            // }
            // this.Message="Added";
            // this.costFactorGroups.costFactorModels=[];
            // this.costFactorGroups.costFactorModels=data;
            // this.actualCostFactorModels=data;
        });
    }

    Delete(row) {
        var rowDeleted = { "id": row.id, "costFactorGroupId": this.costFactorGroupID };
        Swal.fire({
            title: 'Remove Cost Factor Mapping',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.costFactorGroupService.DeleteCostFactorGroupMapping(rowDeleted).subscribe(
                    result => {
                        Swal.fire(
                            'Deleted!',
                            'Record Deleted successfully.',
                            'success'
                        ).then((result) => {
                            if (result.isConfirmed) {
                                this.FetchBasicData();
                            }
                        })
                    }
                );
            }
        })
    }

    searchData() {
        this.FetchBasicData();
    }

    goBack() {
        this.router.navigate(['/cost-factors-list']);
    }
}
