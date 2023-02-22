import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-supplier-response-view',
  templateUrl: './supplier-response-view.component.html',
  styleUrls: ['./supplier-response-view.component.scss']
})
export class SupplierResponseViewComponent implements OnInit {
  rfqSupplierSearchModel: SupplierSearchModel = new SupplierSearchModel();
  @Input() rfqModel: RFQViewModel;
  @Input() rfqId: any
  supplierId: any;
  @Output() supplierIsChanged = new EventEmitter<string>();

  constructor(public dialog: MatDialog,private rfqSupplierService: RfqSupplierService) {
    this.rfqSupplierSearchModel.pageSize = 10;
    this.rfqSupplierSearchModel.page = 1;
  }

  ngOnInit(): void {
    this.fetchSupplierList();
  }

  fetchSupplierList() {
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
    this.rfqSupplierService.getRFQSupplierByRFQId(this.rfqId).subscribe(result => {
      refference.close();
      this.rfqSupplierSearchModel.supplierViewModels = result.data.suppliers;
    });
  }

  fetchResponse() {
    this.supplierIsChanged.emit(this.supplierId);
  }

}