import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { SupplierGroupSearchModel } from 'app/main/Models/etendering/supplier-group-search-model';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { SupplierInvitationListService } from 'app/shared/Services/etendering/supplier-invitation-list.service';
import { Router } from '@angular/router';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { SupplierGroupViewModel } from 'app/main/Models/etendering/ViewModels/supplier-group-view-model';
import Swal from 'sweetalert2';
import { UserProfile } from 'app/main/Models/etendering/userprofile';

@Component({
    selector: 'attribute-items',
    templateUrl: './supplier-invitation-list.component.html',
    styleUrls: ['./supplier-invitation-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SupplierInvitationListComponent {
    displayedColumns: string[] = ['id', 'suplisttitle', 'suplistname', 'type', 'isActive'];


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;
    pageEvent: PageEvent;
    supplierGroups: any = new SupplierGroupSearchModel();
    supplier: any = new SupplierSearchModel();

    // SupplierTitle : string="";

    // SupplierName : string = "";

    actualSuppplierModels: any = [];
    Message: string = "";
    userProfile: UserProfile;

    /**
     * Constructor
     */
    constructor(public dialog: MatDialog
        , private supplierInvitationListService: SupplierInvitationListService
        , private router: Router
        , private _fuseAlertService: FuseAlertService
        , private _fuseConfirmationService: FuseConfirmationService) {
        // //debugger;
        this.supplierGroups.pageSize = 10;
        this.supplierGroups.page = 1;

    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.supplierGroups.pageSize = event.pageSize;
        this.supplierGroups.page = page;
        this.FetchBasicData();
    }

    sortData(sort: Sort) {
        ////debugger;
        this.supplierGroups.direction = sort.direction;
        this.supplierGroups.column = sort.active;
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.supplierInvitationListService.getSGList(this.supplierGroups).subscribe(
            result => {
                console.log(result);
                // //debugger;
                this.supplierGroups = result;

                for (var i = 0; i < result.supplierGroupModels.length; i++) {

                    this.actualSuppplierModels.push(result.supplierGroupModels[i]);

                }
            }
        );
    }
    DeleteCFLGrp(model: SupplierGroupViewModel[]) {
        Swal.fire({
            title: 'Remove Supplier Invitation List',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                this.supplierInvitationListService.DeleteItem([model]).subscribe(result => {
                    this.FetchBasicData();
                    Swal.fire({
                        // position: 'top-end',
                        icon: 'success',
                        title: "Supplier Invitation List deleted successfully",
                        showConfirmButton: false,
                        timer: 1000
                    })
                });
            }
        });
    }

    ngOnInit() {
        this.dismiss("successerror");
        this.FetchBasicData();
        this.userProfile = JSON.parse(localStorage.getItem('userProfile'));

    }

    OpenURL(url, row) {
        //this.router.navigate([url]); 
        //   //debugger;
        this.router.navigateByUrl(url, { state: { Id: row.id, isAddSupplier: row.sub == this.userProfile.sub } });
    }

    openDialog() {

        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", 'supplierGroupModels': this.supplierGroups.supplierGroupModels } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "Saved") {
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: "Supplier Invitation List added successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
                this.FetchBasicData();
            }

        });
    }
    editList(row: any) {
        const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": row.id, 'supplierGroupModels': this.supplierGroups.supplierGroupModels } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if (result == "Saved") {
                Swal.fire({
                    // position: 'top-end',
                    icon: 'success',
                    title: "Supplier Invitation List updated successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
                this.FetchBasicData();
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

