/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, ViewChild, ViewEncapsulation, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { SupplierViewModel } from 'app/main/Models/etendering/ViewModels/supplier-view-model';
import { SuppliersViewComponent } from '../suppliers-view/suppliers-view.component';
import { RFQSupplierModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-model';
import { FuseAlertService } from '@fuse/components/alert';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface RowData {
    supplierId: string;
    supplierName: string;
    supplierEmail: string;
    supplierStatus: string;
    invited: string;
    awarded: string;
    category: string;
}

@Component({
    selector: 'add-supplier-overlay',
    templateUrl: './add-supplier-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddSupplierOverlayComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumn: string[] = ['id', 'supplierId', 'supplierName', 'supplierStatus', 'supplierEmail', 'category', 'invited', 'awarded'];

    templateData: any = [];
    useremail: string = '';
    events: string = 'yes';
    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    pageEvent: PageEvent;
    supplierSearchModel: SupplierSearchModel = new SupplierSearchModel();
    supplierModel: SupplierViewModel[];
    rfqSupplierList: RFQSupplierModel[];
    parentComponent: SuppliersViewComponent;
    rfqId: string;
    checkedCount;

    selectedSupplier: any[] = [];

    constructor(public dialogRef: MatDialogRef<AddSupplierOverlayComponent>,
        public dialog: MatDialog,
        private _fuseAlertService: FuseAlertService,
        private rfqSupplierService: RfqSupplierService
        , @Inject(MAT_DIALOG_DATA) public data,) {

        this.supplierSearchModel.pageSize = 10;
        this.supplierSearchModel.page = 1;

        this.rfqId = data.rfqId;
        this.parentComponent = data.SuppliersViewComponent;
        this.rfqSupplierList = JSON.parse(JSON.stringify(data.SuppliersViewComponent.supplierModel));
    }

    ngOnInit(): void {
        this.checkedCount = 0;
        this.fetchRfqHeaderAttachmentData();
        this.dismiss('successerror');
    }

    fetchRfqHeaderAttachmentData(): void {
        this.rfqSupplierService.getSupplierList(this.supplierSearchModel).subscribe((result) => {
            this.supplierSearchModel = result.data;
            this.supplierModel = result.data.supplierModel;

            for (let k = 0; k < this.supplierModel.length; k++) {
                if (this.rfqSupplierList.filter(x => x.supplierID === this.supplierModel[k].id).length > 0) {
                    this.supplierModel[k].isChecked = true;
                }
            }
        });
    }

    onPaginateChange(event: PageEvent): void {
        let page = event.pageIndex;
        const pageSize = event.pageSize;
        page = page + 1;
        this.supplierSearchModel.pageSize = pageSize;
        this.supplierSearchModel.page = page;
        this.fetchRfqHeaderAttachmentData();
    }

    sortData(sort: Sort): void {
        this.supplierSearchModel.direction = sort.direction;
        this.supplierSearchModel.column = sort.active;
        this.fetchRfqHeaderAttachmentData();
    }

    searchData(): void {
        this.supplierSearchModel.pageSize = 10;
        this.supplierSearchModel.page = 1;
        this.paginator.pageIndex = 0;
        this.fetchRfqHeaderAttachmentData();
    }

    saveTemplate(): void {
        const rfqHeaderSuppliers: RFQSupplierModel[] = this.rfqSupplierList.filter(x => x.id === undefined);

        if (rfqHeaderSuppliers.length > 0) {
            this.rfqSupplierService.SaveRFQSupplier(rfqHeaderSuppliers).subscribe(() => {
                this.parentComponent.fetchRfqSupplier();
                this.parentComponent.Message = 'Supplier Added';
                this.parentComponent.show('successerror');
                setTimeout(() => { this.parentComponent.dismiss('successerror'); }, 3000);
                this.dialogRef.close();
            });
        }
    }


    ngAfterViewInit() {
        this.supplierSearchModel.paginator = this.paginator;
        this.supplierSearchModel.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.supplierSearchModel.filter = filterValue.trim().toLowerCase();

        if (this.supplierSearchModel.paginator) {
            this.supplierSearchModel.paginator.firstPage();
        }
    }

    doAction(): void {
        this.dialogRef.close();
    }

    show(name: string): void {
        this._fuseAlertService.show(name);
    }

    dismiss(name: string): void {
        this._fuseAlertService.dismiss(name);
    }

    onChange(event: MatCheckboxChange, row): void {
        if (event.checked) {
            this.checkedCount += 1;

            const rfqHeaderSupplier: RFQSupplierModel = new RFQSupplierModel();
            rfqHeaderSupplier.supplierID = row.id;
            rfqHeaderSupplier.email = row.contactEmail;
            rfqHeaderSupplier.currencyId = row.currencyId;
            rfqHeaderSupplier.supplierName = row.supplierName;
            rfqHeaderSupplier.rFQId = this.rfqId;
            this.rfqSupplierList.push(rfqHeaderSupplier);
        }
        else {
            this.checkedCount -= 1;

            const data = this.rfqSupplierList.filter(x => x.supplierID === row.id);
            const index = this.rfqSupplierList.indexOf(data[0]);
            this.rfqSupplierList.splice(index, 1);
        }
    }

    remove(row): void {
        this.checkedCount -= 1;

        const data = this.rfqSupplierList.filter(x => x.supplierID === row.supplierID);
        const index = this.rfqSupplierList.indexOf(data[0]);
        this.rfqSupplierList.splice(index, 1);

        const suplier = this.supplierModel.filter(x => x.id === row.supplierID);
        if (suplier.length > 0) {
            suplier[0].isChecked = false;
        }
    }

    displayCategories(categories: any[]): string {
        let categoriesStr = '';
        categories.forEach((category) => {
            if (categoriesStr) {
                categoriesStr = categoriesStr + ', ' + category.category.detailCategoryName;
            }
            else {
                categoriesStr = category.category.detailCategoryName;
            }
        });
        return categoriesStr;
    }

    isAvailable(id): boolean {
        if (this.parentComponent.supplierModel.map(x => x.supplierID).includes(id)) {
            return true;
        }
        else {
            return false;
        }
    }
}

