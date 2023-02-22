import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { RFQSupplierHeaderTermsConditionModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-termscondition-view-model';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

@Component({
  selector: 'terms1',
  templateUrl: '../terms1/terms1.component.html',
  encapsulation: ViewEncapsulation.None
})

export class Terms1Component implements OnInit, OnDestroy {
  contentBody: string;
  submitinrfaq: true;
  select: string;
  rfqTermsCondtionModel: string;
  isLoad: boolean;
  rfqId: any;
  supplierID: any;
  quotes: any = [];
  message: string = "";
  shtcmodel: any = [];
  rfqSupplierHeaderTermsConditionModel: RFQSupplierHeaderTermsConditionModel[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  obs: Observable<any>;
  dataSource: MatTableDataSource<RFQSupplierHeaderTermsConditionModel>;
  /**
   * Constructor
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<Terms1Component>,
    private rfaqService: RfaqService,
    private _fuseAlertService: FuseAlertService,
    private termsService: TermsService,
    private changeDetectorRef: ChangeDetectorRef) {

    this.rfqTermsCondtionModel = data.rfqTermsCondtionModel;
    this.isLoad = data.isLoad;
    this.rfqId = data.rfqId;
    this.supplierID = data.supplierID;
  }
  ngOnInit(): void {
    this.getRFQSupplierHeaderTermsConditionByID();
  }

  ngOnDestroy() {
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
  }

  // terms and condition - Abeeshan
  DownloadTermsMedia(etMediaId, fileName, fileExtension) {
    let eTMedia: any = { id: etMediaId }
    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

  getRFQSupplierHeaderTermsConditionByID() {
    this.rfaqService.getRFQSupplierHeaderTermsConditionByID(this.rfqId, this.supplierID, this.isLoad).subscribe(result => {
      this.rfqSupplierHeaderTermsConditionModel = result.data;
      let isallmandatoryaccepted = 0;
      //debugger;
      this.rfqSupplierHeaderTermsConditionModel.forEach(x => {
        if (x.isAccepted == null) {
          x.isControlDisable = false;
        } else {
          x.isControlDisable = true;
        }
        if (x.rfqTermsConditionModel.termsConditionModel.isOnLoadMandatory == true) {
          if (x.isAccepted == true) {
            isallmandatoryaccepted = isallmandatoryaccepted + 1;
          }
        }
      })

      if (isallmandatoryaccepted == result.data.length) {
        this.dialogRef.close();
      }
      else {
        this.dataSource = new MatTableDataSource<RFQSupplierHeaderTermsConditionModel>(this.rfqSupplierHeaderTermsConditionModel);

        this.changeDetectorRef.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.obs = this.dataSource.connect();
      }
    })
  }

  UpdateTerms(shtcmodel) {
    this.rfaqService.SaveRFQSupplierHeaderTermsCondition(shtcmodel).subscribe(result => {
      this.getRFQSupplierHeaderTermsConditionByID();
      this.message = "Updated";
      this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 3000);
    });
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    // this.rfqSupplierHeaderTermsConditionModel.pageSize = event.pageSize;
    // this.rfqSupplierHeaderTermsConditionModel.page = page;
    this.getRFQSupplierHeaderTermsConditionByID();
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

}
