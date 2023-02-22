import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AddOverlayComponent } from './add-overlay/add-overlay.component';
import { SupplierGroupSearchModel } from 'app/main/Models/etendering/supplier-group-search-model';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { SupplierInvitationListService } from 'app/shared/Services/etendering/supplier-invitation-list.service';
import { Router } from '@angular/router';
import { SupplierViewModel } from 'app/main/Models/etendering/ViewModels/supplier-view-model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import Swal from 'sweetalert2';

@Component({
    selector: 'rfx',
    templateUrl: './sup-list-detail.component.html',
    encapsulation: ViewEncapsulation.None
})
export class SupListDetailComponent {
    displayedColumns: string[] = ['id', 'supId', 'name', 'status', 'contact', 'email'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    panelOpenState = false;
    supplierGroupID: any;
    pageEvent: PageEvent;
    supplierGroups: any = new SupplierGroupSearchModel();
    supplier: any = new SupplierSearchModel();
    supplierName: string = "";
    ifsSupplierId: string = "";
    supplierStatus: string = "";
    contactTitle: string = "";
    message: string = "";
    actualSuppplierModels: any = [];
    isAddSupplier: boolean = false;
    /**
     * Constructor
     */
    constructor(public dialog: MatDialog, private supplierInvitationListService: SupplierInvitationListService, private router: Router,
        private _fuseConfirmationService: FuseConfirmationService,
        private _fuseAlertService: FuseAlertService) {
        this.supplierGroupID = this.router.getCurrentNavigation().extras.state.Id;
        this.isAddSupplier = this.router.getCurrentNavigation().extras.state.isAddSupplier;
        this.supplierGroups.supplierGroupID = this.supplierGroupID;
        this.supplierGroups.pageSize = 10;
        this.supplierGroups.page = 1;

    }

    ngOnInit() {
        this.FetchBasicData();
    }

    sortData(sort: Sort) {
        this.supplier.direction = sort.direction;
        this.supplier.column = sort.active;
        this.FetchBasicData();
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.supplierGroups.pageSize = event.pageSize;
        this.supplierGroups.page = page;
        this.FetchBasicData();
    }

    FetchBasicData() {

        this.supplierInvitationListService.getSupplierGroupMappingList(this.supplierGroups).subscribe(result => {
            this.supplierGroups = result;
            if (this.supplierGroups) {
                if (!this.supplierGroups.supplierModels) {
                    this.supplierGroups.supplierModels = [];
                }
            }

            this.actualSuppplierModels.push()
            for (var i = 0; i < result.supplierModels.length; i++) {

                this.actualSuppplierModels.push(result.supplierModels[i]);
            }
        }
        );
    }

    saveChanges() {
        for (var i = 0; i < this.actualSuppplierModels.length; i++) {
            this.actualSuppplierModels[i].supplierGroupId = this.supplierGroupID;
        }

        this.supplierInvitationListService.SaveSupplierGroupMapping(this.actualSuppplierModels).subscribe(
            result => {
                this.FetchBasicData();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: "Suppliers added successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        );
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddOverlayComponent, { data: { AddedSupplierInvitationList: this.supplierGroups } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            let data: any = [];
            if (this.supplierGroups) {
                if (!this.supplierGroups.supplierModels) {
                    this.supplierGroups.supplierModels = [];
                }
            }
            for (var i = 0; i < this.supplierGroups.supplierModels.length; i++) {
                data.push(this.supplierGroups.supplierModels[i]);
            }
            for (var i = 0; i < result.length; i++) {
                if (result[i].isChecked == true && result[i].isDisabled == false) {
                    data.push(result[i]);
                }

            }
            this.supplierGroups.supplierModels = [];
            this.supplierGroups.supplierModels = data;
            this.actualSuppplierModels = [];
            for (var kk = 0; kk < this.supplierGroups.supplierModels.length; kk++) {
                this.actualSuppplierModels.push(this.supplierGroups.supplierModels[kk]);
            }
            this.saveChanges();
        });
    }

    searchData() {
        let dataList: SupplierViewModel[] = this.actualSuppplierModels;

        if (this.supplierName && this.supplierName != "") {

            dataList = dataList.filter((data: SupplierViewModel) => {

                return data.supplierName.indexOf(this.supplierName) > -1;

            })

        }

        if (this.ifsSupplierId && this.ifsSupplierId != "") {

            dataList = dataList.filter((data: SupplierViewModel) => {

                return data.ifsSupplierId === this.ifsSupplierId;

            })

        }

        if (this.supplierStatus && this.supplierStatus != "") {

            dataList = dataList.filter((data: SupplierViewModel) => {

                return data.supplierStatus === this.supplierStatus;

            })

        }


        if (this.contactTitle && this.contactTitle != "") {

            dataList = dataList.filter((data: SupplierViewModel) => {

                return data.contactTitle === this.contactTitle;

            })

        }


        this.supplierGroups.supplierModels = dataList;
        console.log(this.supplier, this.supplierName, this.supplierStatus, this.ifsSupplierId);
    }

    Delete(row) {
        Swal.fire({
            title: 'Remove Supplier',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove',
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                // for (var kk = 0; kk < this.actualSuppplierModels.length; kk++) {
                //     if (row.id == this.actualSuppplierModels[kk].id) {
                //         this.actualSuppplierModels[kk].IsChecked = false;
                //     }
                // }
                // var attributeIndex = -1;
                // for (var kk = 0; kk < this.supplierGroups.supplierModels.length; kk++) {
                //     if (row.id == this.supplierGroups.supplierModels[kk].id) {
                //         attributeIndex = kk;
                //     }
                // }
                // this.supplierGroups.supplierModels = this.supplierGroups.supplierModels.filter(obj => obj.id !== row.id);
                // row.IsChecked = false;
                // row.IsDeleted = true;

                row.supplierGroupId = this.supplierGroupID;
                this.supplierInvitationListService.DeleteSupplierGroupMapping([row]).subscribe(result => {
                    this.FetchBasicData();
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: "Supplier removed successfully",
                        showConfirmButton: false,
                        timer: 1000
                    })
                });
            }
        });
    }

    dismiss(name: string): void {
        this._fuseAlertService.dismiss(name);
    }

    show(name: string): void {
        this._fuseAlertService.show(name);
    }

    goBack() {
        this.router.navigate(['/supplier-invitation-list']);
    }
}

