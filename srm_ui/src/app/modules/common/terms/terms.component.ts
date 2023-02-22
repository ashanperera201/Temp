import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { TermsConditionSearchModel } from 'app/main/Models/etendering/ViewModels/terms-condition-search-model';
import { Sort } from '@angular/material/sort';
import { TermsConditionViewModel } from 'app/main/Models/etendering/ViewModels/terms-condition-view-model';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { FuseAlertService } from '@fuse/components/alert';
import Swal from 'sweetalert2';

@Component({
    selector: 'terms',
    templateUrl: './terms.component.html',
    encapsulation: ViewEncapsulation.None
})
export class TermsComponent {
    displayedColumns: string[] = ['id', 'name', 'inputType', 'beforeQuote', 'submitQuote', 'rfq', 'rfi', 'rfaq', 'po'];


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    terms: TermsConditionViewModel[];
    Message: string = "";
    pageEvent: PageEvent;
    panelOpenState = false;

    termsConditions: string = "";
    /**
     * Constructor
     */
    termsConditionSearchModel: TermsConditionSearchModel = new TermsConditionSearchModel();
    constructor(public dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService,
        private termsService: TermsService) {
        this.termsConditionSearchModel.pageSize = 10;
        this.termsConditionSearchModel.page = 1;
    }


    ngOnInit() {
        this.FetchBasicData();
        this.dismiss("successerror")
    }

    EditTerms(row: any) {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": row.id }, disableClose: true, width: '80vw' });
        dialogRef.componentInstance.title = "Edit";
        dialogRef.componentInstance.submitButtonText = "Update";
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if (dialogRef.componentInstance.isAdded) {
                this.Message = "Updated";
                this.show("successerror");
                setTimeout(() => { this.dismiss("successerror") }, 3000);
            }
            this.FetchBasicData();
        });
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.termsConditionSearchModel.pageSize = event.pageSize;
        this.termsConditionSearchModel.page = page;
        this.FetchBasicData();
        //this.dataSource=   this.CreatePaginationData(page,size);

    }

    sortData(sort: Sort) {
        // //debugger;
        this.termsConditionSearchModel.direction = sort.direction;
        this.termsConditionSearchModel.column = sort.active;
        this.FetchBasicData();
    }

    searchData() {
        if (this.termsConditions && this.termsConditions != "") {
            this.termsConditionSearchModel.tCs = this.termsConditions;
        }
        else {
            this.termsConditionSearchModel.tCs = null;
        }
        this.FetchBasicData();
    }

    FetchBasicData() {
        // //debugger;

        this.termsService.GetTermsConditionList(this.termsConditionSearchModel).subscribe(result => {
            console.log(result);
            // //debugger;
            this.termsConditionSearchModel = result;

        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000" }, disableClose: true });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if (dialogRef.componentInstance.isAdded) {
                this.Message = "Added";
                this.show("successerror");
                setTimeout(() => { this.dismiss("successerror") }, 3000);
            }
            this.FetchBasicData();
        });
    }

    DeleteTerms(model: TermsConditionViewModel[]) {
        Swal.fire({
            title: 'Remove Term',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                this.Message = "Deleted";
                this.termsService.DeleteTermsCondition([model]).subscribe(result => {
                    this.FetchBasicData();
                    Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: "Terms deleted successfully",
                        showConfirmButton: false,
                        timer: 1000
                    })
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