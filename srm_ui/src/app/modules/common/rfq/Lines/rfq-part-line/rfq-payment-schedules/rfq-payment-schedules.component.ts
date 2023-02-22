import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQLinePaymentScheduleViewModel } from 'app/main/Models/etendering/ViewModels/rfq-line-payment-schedule-view-model';
import { RfqPartLinePSService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-ps.service';
import { AddNewLinePaymentschedulesOverlayComponent } from '../../../add-new-line-paymentschedules-overlay/add-new-line-paymentschedules-overlay.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface RowData4 {
  payno: string;
  description2: string;
  work: string;
  milestone: string;
  payment: string;
  retention: string;
  release: string;
  releasevalue: string;
}

@Component({
  selector: 'app-rfq-payment-schedules',
  templateUrl: './rfq-payment-schedules.component.html',
  styleUrls: ['./rfq-payment-schedules.component.scss']
})
export class RfqPaymentSchedulesComponent implements OnInit {
  dataSource4: MatTableDataSource<RowData4>;
  displayedColumn4: string[] = ['id', 'payno', 'description2', 'type2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'visibility'];
  PaymentColumn: string[] = ['id', 'payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate', 'visibility'];

  Message: string = "";
  Id: string;
  attributecategorys: any[];
  rfqLinePaymentScheduleModel: RFQLinePaymentScheduleViewModel[];
  @Input() RFQID: any;
  @Input() RFQPartLineID: any;
  @Input() RFQModel: any;
  work: DecimalPipe;
  payment: DecimalPipe;
  releaseValue: DecimalPipe;

  users: any
  workTotal = 0;
  paymentTotal = 0;
  retentionTotal = 0;
  releaseTotal = 0;
  total = 0;

  private value;

  constructor(public dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseAlertService: FuseAlertService,
    private rfqPartLinePSService: RfqPartLinePSService, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.fetchPartRfqPaymentSchedulesData(this.RFQID);
    this.dismiss("successerror");
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  addPaymentSchedule() {
    let payScheduleNos;
    if (this.rfqLinePaymentScheduleModel) {
      payScheduleNos = this.rfqLinePaymentScheduleModel.map(p => p.payScheduleNo);
    } else {
      payScheduleNos = [];
    }
    const dialogRef = this.dialog.open(
      AddNewLinePaymentschedulesOverlayComponent,
      {
        data: {
          "id": "00000000-0000-0000-0000-000000000000",
          "rfqId": this.RFQID,
          "rfqPartLineId": this.RFQPartLineID,
          "type": "Add New",
          "payScheduleNos": payScheduleNos
        }
      });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Added";
        /* this.show("successerror");
        setTimeout(() => { this.dismiss("successerror") }, 1000); */
        this.openSnackBar(this.Message);
        this.fetchPartRfqPaymentSchedulesData(this.RFQID);
      }
    });
  }

  fetchPartRfqPaymentSchedulesData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
   
           
    this.rfqPartLinePSService.GetPartPaymentByRFQId(this.RFQID, this.RFQPartLineID).subscribe((result: any) => {
      refference.close();
      if (result.data.length > 0) {
        this.rfqLinePaymentScheduleModel = result.data;
        this.attributecategorys = this.rfqLinePaymentScheduleModel[0].attributeCategorys;
      }
      this.findsum(this.rfqLinePaymentScheduleModel);
      if (result.data.length === 0) {
        this.rfqLinePaymentScheduleModel = null;
      } else {
        this.rfqLinePaymentScheduleModel.map(p => {
          if(p.dueDate){
            p.dueDateD = new Date(p.dueDate);
          }
          return p;
        });
      }
    });
  }

  deleteRFQLinePaymentSchedule(model: RFQLinePaymentScheduleViewModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove contact",
      "message": "Are you sure you want to delete this record?",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Remove",
          "color": "warn"
        },
        "cancel": {
          "show": true,
          "label": "Cancel"
        }
      },
      "dismissible": true
    });
    dialogRef.addPanelClass('confirmation-dialog');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.rfqPartLinePSService.DeletePartPaymentSchedule([model]).subscribe(result => {
          this.Message = "Deleted";
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 1000); */
          this.openSnackBar(this.Message);
          this.fetchPartRfqPaymentSchedulesData(this.RFQID);
        });
      }
    });


  }
  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  EditAttachment(row: any) {
    let payScheduleNos;
    if (this.rfqLinePaymentScheduleModel) {
      payScheduleNos = this.rfqLinePaymentScheduleModel.map(p => p.payScheduleNo);
      payScheduleNos = payScheduleNos.filter(p => p != row.payScheduleNo);
    } else {
      payScheduleNos = [];
    }
    const dialogRef = this.dialog.open(AddNewLinePaymentschedulesOverlayComponent, { data: { "id": row.id, "rfqPartLineId": this.RFQPartLineID, "rfqId": this.RFQID, "type": "Edit", "payScheduleNos": payScheduleNos } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Updated";
        /* this.show("successerror");
        setTimeout(() => { this.dismiss("successerror") }, 1000); */
        this.openSnackBar(this.Message);
        this.fetchPartRfqPaymentSchedulesData(this.RFQID);
      }
    });
  }

  findsum(data) {
    this.value = data;
    let workTotalTemp = 0, paymentTotolTemp = 0, retentionTotalTemp = 0, releaseTotalTemp = 0;
    this.workTotal = this.paymentTotal = this.retentionTotal = this.total = this.releaseTotal = 0;
    for (let j = 0; j < data.length; j++) {
      workTotalTemp += Number(this.value[j].work);
      paymentTotolTemp += Number(this.value[j].payment);
      retentionTotalTemp += Number(this.value[j].retention);
      releaseTotalTemp += Number(this.value[j].release);
      this.total += Number(this.value[j].releaseValue);
    }
    if (data.length > 0) {
      this.workTotal = workTotalTemp;
      this.paymentTotal = paymentTotolTemp;
      this.retentionTotal = retentionTotalTemp;
      this.releaseTotal = releaseTotalTemp;
    }
  }

  // findsum(data) {
  //   this.value = data
  //   for (let j = 0; j < data.length; j++) {
  //     this.total += this.value[j].work
  //   }
  // }

  // findsumpaymentPercentage(data) {
  //   this.value = data
  //   for (let j = 0; j < data.length; j++) {
  //     this.total1 += this.value[j].payment
  //   }
  // }

  // findsumpaymentreleaseValue(data) {
  //   this.value = data
  //   for (let j = 0; j < data.length; j++) {
  //     this.total2 += this.value[j].releaseValue
  //   }
  // }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  UpdateRFQPartPaymentSchedule(model: RFQLinePaymentScheduleViewModel, typevis) {
    if (typevis == "Cat") {
      model.isCategorySave = true;
    }
    else if (typevis == "Sup") {
      model.isVisibleToSupplierSave = true;
    }
    else if (typevis == "LineType") {
      model.isScheduleLineType = true;
    }
    else if (typevis == "PaymentType") {
      model.isDownPaymentType = true;
    }
    else if (typevis == "DueDate") {
      model.isDueDate = true;
      model.dueDate = model.dueDateD.toLocaleDateString();
    }
    this.rfqPartLinePSService.SavePartPaymentSchedule(model).subscribe(result => {
      this.Message = "Updated";
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 1000); */
      this.openSnackBar(this.Message);
    });
  }

}