import { Component, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';
import { Router } from '@angular/router';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'cost-factors-list',
    templateUrl: './cost-factors-list.component.html',
    styleUrls: ['./cost-factors-list.scss'],
    encapsulation: ViewEncapsulation.None
})

export class CostFactorsListComponent {
    displayedColumns: string[] = ['id', 'title', 'name', 'isPrivate'];
    pageEvent: PageEvent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;
    dataTypeList: any[];
    actualCostFactorModels: any = [];
    costFactorGroups: any = new CostFactorGroupSearchModel();
    title: string;
    name: string;
    type: string = "";
    costFactor: any = new CostFactorSearchModel();
    message: string = "";

    constructor(public dialog: MatDialog, private costFactorGroupService: CostFactorGroupService,
        private router: Router, private changeDetection: ChangeDetectorRef) {
        this.costFactorGroups.pageSize = 5;
        this.costFactorGroups.page = 1;
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
        this.costFactorGroups.direction = sort.direction;
        this.costFactorGroups.column = sort.active;
        this.FetchBasicData();
    }

    FetchBasicData() {
        if (this.type != "") {
            this.costFactorGroups.isPrivate = (this.type === "private" ? true : false);
        }
        else {
            this.costFactorGroups.isPrivate = null;
        }
        this.costFactorGroupService.getCFGList(this.costFactorGroups).subscribe(result => {
            this.costFactorGroups = result;
            for (var i = 0; i < result.costFactorGroupModels.length; i++) {
                this.actualCostFactorModels.push(result.costFactorGroupModels[i])
            }
            this.changeDetection.detectChanges();
        });
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    OpenURL(url, row) {
        this.router.navigateByUrl(url, { state: { Id: row.id } });
    }

    DeleteCFLGrp(model: CostFactorGroupViewModel[]) {
        Swal.fire({
            title: 'Remove Cost Factor List',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.costFactorGroupService.DeleteItem([model]).subscribe(result => {
                    Swal.fire(
                        'Deleted!',
                        'Record Deleted successfully.',
                        'success'
                    ).then((result) => {
                        if (result.isConfirmed) {
                            this.FetchBasicData();
                        }
                    })
                });
            }
        });
    }

    openDialog(row) {
        var id = "00000000-0000-0000-0000-000000000000";
        if (row) {
            id = row.id;
        }
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": id } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.FetchBasicData();
        });
    }

    searchData() {
        this.FetchBasicData();
    }

}
