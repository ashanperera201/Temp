import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { CostFactorService } from 'app/shared/Services/etendering/cost-factor.service';
import { Sort } from '@angular/material/sort';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'cost-factors',
    templateUrl: './cost-factors.component.html',
    styleUrls: ['./cost-factors.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CostFactorsComponent {
    displayedColumns: string[] = ['id', 'factor', 'description', 'costType'];
    pageEvent: PageEvent;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;
    costFactorSearchModel: CostFactorSearchModel = new CostFactorSearchModel();

    /**
     * Constructor
     */
    constructor(public dialog: MatDialog, private costFactorService: CostFactorService) {
        this.costFactorSearchModel.pageSize = 10;
        this.costFactorSearchModel.page = 1;
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000" } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.FetchBasicData();
        });
    }

    EditCF(row: any) {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": row.id } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.FetchBasicData();
        });
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.costFactorSearchModel.pageSize = event.pageSize;
        this.costFactorSearchModel.page = page;
        this.FetchBasicData();
    }

    sortData(sort: Sort) {
        this.costFactorSearchModel.direction = sort.direction;
        this.costFactorSearchModel.column = sort.active;
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.costFactorService.getCFList(this.costFactorSearchModel).subscribe(result => {
            this.costFactorSearchModel = result;
        });
    }

    ngOnInit() {
        this.FetchBasicData();
    }

    DeleteCF(model: CostFactorTextViewModel[]) {
        Swal.fire({
            title: 'Remove Cost Factor',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.costFactorService.DeleteItem([model]).subscribe(result => {
                    this.FetchBasicData();
                    Swal.fire(
                        'Deleted!',
                        'Record Deleted successfully.',
                        'success'
                    )
                });
            }
        })
    }

}