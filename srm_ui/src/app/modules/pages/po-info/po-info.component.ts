import {
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { RFXHistoryViewModel } from 'app/main/Models/etendering/ViewModels/rfx-history-view-model';
import { PODetails } from './data'
import { ActivatedRoute } from '@angular/router';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { AgreementInfoDialogComponent } from 'app/modules/common/rfq/agreement-info-dialog/agreement-info-dialog.component';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

export interface RowData {
  Charge: string;
}

export interface RowData1 {
  id: string;
  des: string;
}

const ELEMENT_DATA: RowData1[] = [
  { id: '1', des: 'Description 1' },
  { id: '2', des: 'Description 2' },

];
[
  { id: '1', des: 'Description 1' },
  { id: '2', des: 'Description 2' },

];
[
  { id: '1', des: 'Description 1' },
  { id: '2', des: 'Description 2' },

];

@Component({
  selector: 'po-info',
  templateUrl: './po-info.component.html',
  styleUrls: ['./po-info.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PoInfoComponent {

  displayedColumns: string[] = [
    'ChargeTypeDescription',
    'ChargeType',
    'ChargePrice/Base',
    'ChargePrice/Curr',
    'ChargePriceInclTax/Base',
    'ChargePriceInclTax/Curr',
  ];
  // dataSource = ELEMENT_DATA;

  displayedColumns1: string[] = [
    'PaySchedID',
    'ScheduleLineDesc',
    // 'LinkedtoDel',
    'ScheduleLineType',
    'DownPaymentType',
    'PlannedAmount',
    'Percenatge',
    'DueDate',
  ];

  panelOpenState = false;
  panelOpenState1 = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  data: any;
  dataSource: any[] = [];
  rfqId: any;
  constructor(private activatedRoute: ActivatedRoute, public dialog: MatDialog, private rfqService: RfqService) {
    const data = new Array(PODetails);
    this.data = data[0];
    this.selectExpansion(0);
    activatedRoute.params.subscribe((params) => {
      this.rfqId = params['id'];
    });
  }
  ngOnInit() {
    this.loadPOTransferData();

  }
  isPOTransferVisible = false;
  isPOCreated:any="1";
  loadPOTransferData() {
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

    this.rfqService.getPOTransferData(this.rfqId).subscribe(result => {
      refference.close();
      let agreeementVisibleCount = 0;
      this.data = result.data;
      if (this.data) {
        if (this.data.projectDetails) {
          for (var g = 0; g < this.data.projectDetails.length; g++) {
            if(this.data.projectDetails[g].title=='POStatus')
            {
              this.isPOCreated=this.data.projectDetails[g].value;
            }
          }

        }
       
        if (this.data.headerInformation) {
          let awardedSupplierCount = this.data.headerInformation.length;
          let agreementSubmiitedCount = 0;
          for (var i = 0; i < this.data.headerInformation.length; i++) {
            if (this.data.headerInformation[i].isAgreementVisible) {
              agreeementVisibleCount = agreeementVisibleCount + 1;
              if (this.data.headerInformation[i].isAgreementSubmitted) {
                agreementSubmiitedCount = agreementSubmiitedCount + 1;
              }
            }


          }
          if (agreementSubmiitedCount == awardedSupplierCount) {
            this.isPOTransferVisible = true;
          }
          else if (agreeementVisibleCount == 0) {
            this.isPOTransferVisible = true;
          }
        }
      }

    });
  }
  retentionAmount = 0;
  downPaymentAmount = 0;
  selectExpansion(i): void {
    this.retentionAmount = 0;
    this.downPaymentAmount = 0;
    if (this.data) {
      if (this.data.paymentDetails) {
        if (this.data.paymentDetails.length > 0) {
          this.dataSource[i] = new MatTableDataSource<RowData1>(this.data.paymentDetails[i].table);
          if (this.data.paymentDetails[i].table) {
            this.retentionAmount = this.data.paymentDetails[i].table
              .reduce((sum, current) => sum + parseInt(current.retention), 0);
            this.downPaymentAmount = this.data.paymentDetails[i].table
              .reduce((sum, current) => sum + parseInt(current.releaseValue), 0);
          }

        }
      }
    }

  }

  showRFI(supplierid) {
    debugger;
    const dialogRef = this.dialog.open(AgreementInfoDialogComponent, { data: { "rfqId": this.rfqId, "supplierId": supplierid } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.loadPOTransferData();
    });

  }
  processOnPOCreation!: boolean;
  CreatePO() {
    let model: any = { id: this.rfqId, statusName: "PO Created" }
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Processing....' } });

    this.rfqService.UpdateRFQStatus(model).subscribe(result => {
      this.processOnPOCreation = false;
      refference.close();

      if (result.data.success == false) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          html: this.GetErrorOrderedList(result.data.errors),
          customClass: {
            container: 'display-list'
          },
          target: '#error-alert'
        });
      }
      else {

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: "PO Created successfully",
          showConfirmButton: true
        })
          .then((result1) => {
            this.loadPOTransferData();
          });
      }
    });
  }

  GetErrorOrderedList(errors: any[]) {
    var elem = document.createElement('div');

    var errorLis = "";
    for (var i = 0; i < errors.length; i++) {
      errorLis = errorLis + "<li> <span class='material-icons style='font-size:10px; display:flex; item-align: center'>fiber_manual_record</span>" + errors[i].description + "</li>";
    }
    errorLis = '<ul style="text-align: left !important" id="error-alert">' + errorLis + "</ul>";
    elem.innerHTML = errorLis;

    return elem;
  }

}

