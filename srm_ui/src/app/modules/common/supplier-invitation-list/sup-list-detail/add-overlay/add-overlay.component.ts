import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SupplierGroupSearchModel } from 'app/main/Models/etendering/supplier-group-search-model';
import { SupplierViewModel } from 'app/main/Models/etendering/ViewModels/supplier-view-model';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { SupplierInvitationListService } from 'app/shared/Services/etendering/supplier-invitation-list.service';

@Component({
    selector: 'add-overlay',
    templateUrl: './add-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'status', 'email'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];
    useremail: string = '';
    pageEvent: PageEvent;

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    AddedSupplierInvitationList: any = [];
    supplierGroups: any = new SupplierGroupSearchModel();
    supplier: any = new SupplierSearchModel();
    supplierGroupID: any;
    supplierName: string = "";
    supplierStatus: string = "";
    contactEmail: string = "";
    actualSuppplierModels: any = [];

    constructor(public dialogRef: MatDialogRef<AddOverlayComponent>,
        public dialog: MatDialog, private supplierInvitationListService: SupplierInvitationListService, @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.supplier.page = 1;
        this.supplier.pageSize = 10;
        //const users = Array.from({length: 100}, (_, k) => createNewRow(k + 1));

        this.AddedSupplierInvitationList = this.data.AddedSupplierInvitationList;

        // Assign the data to the data source for the table to render
        //this.dataSource = new MatTableDataSource(users);
    }

    addSupplierInvitationList() {
        ////debugger;
        this.dialogRef.close(this.supplier.supplierModel);
    }

    sortData(sort: Sort) {
        ////debugger;
        this.supplier.direction = sort.direction;
        this.supplier.column = sort.active;
        this.FetchBasicData();
    }

    FetchBasicData() {
        this.supplierInvitationListService.getSList(this.supplier).subscribe(
            result => {
                console.log(result);
                ////debugger;
                this.supplier = result.data;
                for (var i = 0; i < this.supplier.supplierModel.length; i++) {
                    this.supplier.supplierModel[i].isChecked = false;
                    this.supplier.supplierModel[i].isDisabled = false;
                    for (var k = 0; k < this.AddedSupplierInvitationList.supplierModels.length; k++) {

                        if (this.supplier.supplierModel[i].id == this.AddedSupplierInvitationList.supplierModels[k].id) {
                            this.supplier.supplierModel[i].isChecked = true;
                            this.supplier.supplierModel[i].isDisabled = true;
                        }
                    }
                }

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
        this.supplier.pageSize = event.pageSize;
        this.supplier.page = page;
        this.FetchBasicData();
        //  this.dataSource=   this.CreatePaginationData(page,size);
    }

    SetIsChecked(row, event) {
        ////debugger;
        row.isChecked = event.checked;
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }
}