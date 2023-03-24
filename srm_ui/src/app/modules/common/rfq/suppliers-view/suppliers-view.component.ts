import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RegisterModel } from 'app/main/Models/etendering/registermodel';
import { RFQ } from 'app/main/Models/etendering/rfq';
import { RFQSupplierSearchModel } from 'app/main/Models/etendering/rfq-supplier-search-model';
import { Tenant } from 'app/main/Models/etendering/tenant';
import { UserProfile } from 'app/main/Models/etendering/userprofile';
import { RFQSupplierModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { SupplierViewModel } from 'app/main/Models/etendering/ViewModels/supplier-view-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { TenantService } from 'app/shared/Services/etendering/tenant.service';
import { AddEmergencySupllierComponent } from '../add-emergency-supllier/add-emergency-supllier.component';
import { AddSupplierListOverlayComponent } from '../add-supplier-list-overlay/add-supplier-list-overlay.component';
import { AddSupplierOverlayComponent } from '../add-supplier-overlay/add-supplier-overlay.component';
import { RowData12 } from '../rfq.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
  selector: 'app-suppliers-view',
  templateUrl: './suppliers-view.component.html',
  styleUrls: ['./suppliers-view.component.scss']
})
export class SuppliersViewComponent implements OnInit {
  @Input() dataSource12: MatTableDataSource<RowData12>;
  @Input() displayedColumn12: string[];
  @Input() RFQID: string;
  @Input() rfqModel: RFQViewModel;
  tenant: Tenant;
  rfqData: RFQViewModel;
  Message: any = '';
  pageEvent: PageEvent;
  rfqSupplierSearchModel: RFQSupplierSearchModel = new RFQSupplierSearchModel();
  supplierModel: RFQSupplierModel[];
  supplier: SupplierViewModel[];
  isBidOpen: boolean = false;

  constructor(public dialog: MatDialog,
    private tenantService: TenantService,
    private rfqService: RfqService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseAlertService: FuseAlertService,
    private rfqSupplierService: RfqSupplierService,) {
    this.rfqSupplierSearchModel.pageSize = 10;
    this.rfqSupplierSearchModel.page = 1;
  }

  ngOnInit(): void {
    this.isBidOpen = this.rfqModel.statusName === 'Bid Open';
    this.getRfqData();
    this.fetchRfqSupplier();
    this.dismiss('successerror');
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    const size = event.pageSize;
    page = page + 1;
    this.rfqSupplierSearchModel.pageSize = event.pageSize;
    this.rfqSupplierSearchModel.page = page;
    this.fetchRfqSupplier();
  }

  sortData(sort: Sort) {
    this.rfqSupplierSearchModel.direction = sort.direction;
    this.rfqSupplierSearchModel.column = sort.active;
    this.fetchRfqSupplier();
  }

  fetchRfqSupplier() {
    this.rfqSupplierSearchModel.RFQId = this.RFQID;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
    this.rfqSupplierService.getRFQSupplierList(this.rfqSupplierSearchModel).subscribe((result) => {
      refference.close();
      this.supplierModel = result.data.rfqSupplierModel;
      this.rfqSupplierSearchModel = result.data;
      if (this.rfqSupplierSearchModel.rfqSupplierModel) {
        this.rfqSupplierSearchModel.rfqSupplierModel.forEach((supplier) => {
          if(new Date(supplier.invitationDate).toDateString() !== new Date('0001-01-01T00:00:00').toDateString())
          {
            supplier.inviteDate = this.toDatetimeLocal(new Date(supplier.invitationDate + 'Z'));
          }
          else{
            supplier.inviteDate = '-';
          }
        });
      }
    });
  }

  DeleteAttachment(model: SupplierViewModel[]): void {

    const dialogRef = this._fuseConfirmationService.open({
      'title': 'Remove contact',
      'message': 'Are you sure you want to delete this record?',
      'icon': {
        'show': true,
        'name': 'heroicons_outline:exclamation',
        'color': 'warn'
      },
      'actions': {
        'confirm': {
          'show': true,
          'label': 'Remove',
          'color': 'warn'
        },
        'cancel': {
          'show': true,
          'label': 'Cancel'
        }
      },
      'dismissible': true
    });
    dialogRef.addPanelClass('confirmation-dialog');

    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'confirmed') {
        this.rfqSupplierService.DeleteRFQSupplier([model]).subscribe((result) => {
          this.Message = 'Deleted';
          this.fetchRfqSupplier();
          this.show('successerror');
          setTimeout(() => { this.dismiss('successerror'); }, 3000);
        });
      }
    });
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  addSupplier(): void {
    const dialogRef = this.dialog.open(AddSupplierOverlayComponent, { data: { 'rfqId': this.RFQID, 'SuppliersViewComponent': this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  addSupplierList(): void {
    const dialogRef = this.dialog.open(AddSupplierListOverlayComponent, { data: { 'rfqId': this.RFQID, 'SuppliersViewComponent': this } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  addEmergencySupplier(): void {
    const dialogRef = this.dialog.open(AddEmergencySupllierComponent);
    dialogRef.addPanelClass('inline-lg-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);

      const rfqHeaderSuppliers: RFQSupplierModel[] = [];
      const rfqHeaderSupplier: RFQSupplierModel = new RFQSupplierModel();
      rfqHeaderSupplier.supplierID = result.id;
      rfqHeaderSupplier.email = result.contactEmail;
      rfqHeaderSupplier.rFQId = this.RFQID;
      rfqHeaderSupplier.isEmergencySupplier=true;
      rfqHeaderSuppliers.push(rfqHeaderSupplier);

      this.rfqSupplierService.SaveRFQSupplier(rfqHeaderSuppliers).subscribe(() => {
        this.fetchRfqSupplier();
        this.Message = 'Emergency Supplier Added';
        this.show('successerror');
        setTimeout(() => { this.dismiss('successerror'); }, 3000);
      });
      this.fetchRfqSupplier();
    });
  }

  updateRFQSupplierContact(model: SupplierViewModel, isCategorySave, event): void {
    if (isCategorySave == true) {
      model.isContactSave = true;
    }
    const rfqSuppliers = [];
    rfqSuppliers.push(model);
    this.rfqSupplierService.SaveRFQSupplier(rfqSuppliers).subscribe((result) => {
      this.fetchRfqSupplier();
      this.Message = 'Updated';
      this.show('successerror');
      setTimeout(() => { this.dismiss('successerror'); }, 3000);
    });
  }

  resendInvitation(data): void {
    this.rfqSupplierService.resendInvite(data).subscribe((result) => {
      this.Message = 'Resent Invite';
      this.show('successerror');
      setTimeout(() => { this.dismiss('successerror'); }, 3000);
    });
    this.createTenant(data);
  }

  getRfqData(): void {
    //this.rfqService.getRFQbyId(this.RFQID).subscribe((data) => {
      this.rfqData = this.rfqModel;
    //});
  }

  createTenant(data): void {
    const tenant = new Tenant();
    tenant.email = data.contactEmail;
    const userProfile = new UserProfile();
    userProfile.email = data.contactEmail;
    const registerModel = new RegisterModel();
    // registerModel.rfq = this.rfqData;
    registerModel.userProfile = userProfile;
    registerModel.tenant = tenant;
    this.tenantService.saveTenant(registerModel).subscribe((tenantData: Tenant) => {
      this.tenant = tenantData;
    });
  }

  toDatetimeLocal(date: Date): string {
    const dateString = date.getFullYear() +
                '-' + pad0(date.getMonth() + 1) +
                '-' + pad0(date.getDate()) +
                'T' + pad0(date.getHours()) +
                ':' + pad0(date.getMinutes()) +
                ':' + pad0(date.getSeconds());

    return dateString;
  }
}

function pad0(num) {
  return (num < 10 ? '0' : '') + num;
}

