/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FuseAlertService } from '@fuse/components/alert';
import { SupplierGroupSearchModel } from 'app/main/Models/etendering/supplier-group-search-model';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { RFQSupplierModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { SupplierInvitationListService } from 'app/shared/Services/etendering/supplier-invitation-list.service';
import Swal from 'sweetalert2';
import { SuppliersViewComponent } from '../suppliers-view/suppliers-view.component';

@Component({
  selector: 'app-add-supplier-list-overlay',
  templateUrl: './add-supplier-list-overlay.component.html',
  styleUrls: ['./add-supplier-list-overlay.component.scss']
})
export class AddSupplierListOverlayComponent implements OnInit {
  displayedColumn: string[] = ['id', 'title', 'name', 'type', 'isActive'];

  pageEvent: PageEvent;
  issuccess = false;
  iserror = false;
  supplierSearchModel: SupplierSearchModel = new SupplierSearchModel();
  supplierGroupSearchModel: SupplierGroupSearchModel = new SupplierGroupSearchModel();
  rfqSupplierList: RFQSupplierModel[];
  parentComponent: SuppliersViewComponent;
  rfqId: string;
  checkedCount: number;
  selectedSupplierList: any[] = [];

  constructor(public dialogRef: MatDialogRef<AddSupplierListOverlayComponent>,
    public dialog: MatDialog,
    private _fuseAlertService: FuseAlertService,
    private rfqSupplierService: RfqSupplierService,
    private supplierInvitationListService: SupplierInvitationListService,
    @Inject(MAT_DIALOG_DATA) public data,) {

    this.supplierSearchModel.pageSize = 10;
    this.supplierSearchModel.page = 1;

    this.rfqId = data.rfqId;
    this.parentComponent = data.SuppliersViewComponent;
    this.rfqSupplierList = data.SuppliersViewComponent.supplierModel;
  }

  ngOnInit(): void {
    this.fetchSupplierInvitationData();
  }

  onPaginateChange(event: PageEvent): void {
    let page = event.pageIndex;
    const size = event.pageSize;
    page = page + 1;
    this.supplierGroupSearchModel.pageSize = event.pageSize;
    this.supplierGroupSearchModel.page = page;
    this.fetchSupplierInvitationData();
  }

  sortData(sort: Sort): void {
    this.supplierGroupSearchModel.direction = sort.direction;
    this.supplierGroupSearchModel.column = sort.active;
    this.fetchSupplierInvitationData();
  }

  fetchSupplierInvitationData(): void {
    this.supplierGroupSearchModel.status = 'active';
    this.supplierInvitationListService.getSGList(this.supplierGroupSearchModel).subscribe(result => {
      this.supplierGroupSearchModel = result;
debugger
      if (this.supplierGroupSearchModel.supplierGroupModels.length !== 0) {
        for (let index = 0; index < this.supplierGroupSearchModel.supplierGroupModels.length; index++) {
            if (this.rfqSupplierList.map(x => x.supplierGroupId).includes(this.supplierGroupSearchModel.supplierGroupModels[index].id)) {
                this.selectedSupplierList.push(this.supplierGroupSearchModel.supplierGroupModels[index].title);
            }
        }
    }
      this.checkedCount = 0;
    });
  }

  saveTemplate(): void {
    const rfqHeaderSuppliers: RFQSupplierModel[] = [];
    this.supplierGroupSearchModel.supplierGroupModels.forEach((supplierGroup) => {
      if (supplierGroup.isChecked == true) {
        if (supplierGroup.supplierModels != null && supplierGroup.supplierModels.length > 0) {
          supplierGroup.supplierModels.forEach((supplier) => {
            const rfqHeaderSupplier: RFQSupplierModel = new RFQSupplierModel();
            rfqHeaderSupplier.supplierID = supplier.id;
            rfqHeaderSupplier.supplierGroupId = supplier.supplierGroupId;
            rfqHeaderSupplier.rFQId = this.rfqId;
            rfqHeaderSuppliers.push(rfqHeaderSupplier);
          });
        }
        else {
          Swal.fire({
            icon: 'warning',
            title: 'No suppliers found in Supplier List : ' + supplierGroup.name,
            showConfirmButton: false,
            timer: 3000
          });
          return;
        }
      }
    });

    if (rfqHeaderSuppliers.length > 0) {
      this.rfqSupplierService.SaveRFQSupplier(rfqHeaderSuppliers).subscribe((result) => {
        this.parentComponent.fetchRfqSupplier();
        this.parentComponent.Message = 'Supplier List Added';
        this.parentComponent.show('successerror');
        setTimeout(() => { this.parentComponent.dismiss('successerror'); }, 3000);
        this.dialogRef.close();
      });
    }
  }

  doAction(): void {
    this.dialogRef.close();
  }

  onChange(event: MatCheckboxChange): void {
    if (event.checked) {
      this.checkedCount += 1;
    }
    else {
      this.checkedCount -= 1;
    }
  }

  isAvailable(id): boolean {
    if (this.rfqSupplierList.map(x => x.supplierGroupId).includes(id)) {
      return true;
    }
    else {
      return false;
    }
  }

  showOptions(event: MatCheckboxChange, row): void {
    if (event.checked === true) {
      this.selectedSupplierList.push(row);
    } else {
      this.selectedSupplierList.splice(this.selectedSupplierList.indexOf(row), 1);
    }
  }
}
