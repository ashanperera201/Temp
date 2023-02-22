import { DecimalPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQHeaderPaymentScheduleViewModel } from 'app/main/Models/etendering/ViewModels/rfq-headerpaymentschedule-view-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqHeaderPSService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-ps.service';
import { AddNewPaymentschedulesOverlayComponent } from '../../add-new-paymentschedules-overlay/add-new-paymentschedules-overlay.component';
import { RowData4 } from '../../rfq.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-payment-schedules',
  templateUrl: './payment-schedules.component.html',
  styleUrls: ['./payment-schedules.component.scss']
})
export class PaymentSchedulesComponent implements OnInit {

  @Input() dataSource4: MatTableDataSource<RowData4>;
  @Input() PaymentColumn: string[] = ['id', 'payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate', 'visibility'];
  @Input() RFQID: any;
  @Input() RFQModel: RFQViewModel;
  rfqHeaderPaymentScheduleModel: RFQHeaderPaymentScheduleViewModel[];
  Message: string = "";
  Id: string;
  attributecategorys: any[];
  workPercentage: DecimalPipe;
  paymentPercentage: DecimalPipe;
  releaseValue: DecimalPipe;
  users: any

  private value;
  workTotal = 0;
  paymentTotal = 0;
  retentionTotal = 0;
  releaseTotal = 0;
  total = 0;

  constructor(public dialog: MatDialog,
    private _fuseAlertService: FuseAlertService,
    private _fuseConfirmationService: FuseConfirmationService,
    private rfqHeaderPSService: RfqHeaderPSService, private _snackBar: MatSnackBar) { }

    openSnackBar(message: string): void {
      this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
    }
  

  addPaymentSchedule() {
    let payScheduleNos = this.rfqHeaderPaymentScheduleModel.map(p => p.payScheduleNo);
    const dialogRef = this.dialog.open(
      AddNewPaymentschedulesOverlayComponent,
      {
        data: {
          "id": "00000000-0000-0000-0000-000000000000",
          "rfqId": this.RFQID,
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
        this.fetchRfqPaymentSchedulesData(this.RFQID);
      }
    });
  }

  // UpdateRFQHeaderPaymentSchedule(row: any, typeOfFieldTpBeUpdated) {
  //   if (typeOfFieldTpBeUpdated == "LineType") {
  //     row.scheduleLineType = "Down Payment";
  //   }
  //   // else if (typeOfFieldTpBeUpdated == "EQ") {
  //   //   row.isEndOfQuoteIdSave = true;
  //   // }
  //   // else if (typeOfFieldTpBeUpdated == "BQ") {
  //   //   row.isBeforeQuoteIdSave = true;
  //   // }


  //   let rfqHeaderTermsConditions: RFQHeaderPaymentScheduleViewModel[] = [];
  //   rfqHeaderTermsConditions.push(row);

  //   this.rfqHeaderPSService.SavePaymentSchedule(rfqHeaderTermsConditions).subscribe(result => {

  //     this.fetchRfqPaymentSchedulesData(this.RFQID);
  //   });
  // }

  fetchRfqPaymentSchedulesData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

    this.rfqHeaderPSService.GetPaymentScheduleByRFQId(this.RFQID).subscribe((result: any) => {
      refference.close();
      this.rfqHeaderPaymentScheduleModel = result.data;

      this.findsum(this.rfqHeaderPaymentScheduleModel);
      if (this.rfqHeaderPaymentScheduleModel.length > 0) {
        this.attributecategorys = this.rfqHeaderPaymentScheduleModel[0].attributeCategorys;
        this.rfqHeaderPaymentScheduleModel.map(p => {
          if (p.dueDate) {
            p.dueDateD = new Date(p.dueDate);
          }
          return p;
        });
      }
    }, error => {
      console.log(error);
    });
  }

  fetchAttachmentData(Id: string) {
    this.Id = Id;
    this.rfqHeaderPSService.GetPaymentScheduleByID(this.Id).subscribe(result => {
      this.rfqHeaderPaymentScheduleModel = result.data;
    });
  }

  deleteRFQHeaderPaymentSchedule(model: RFQHeaderPaymentScheduleViewModel[]) {
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
        this.rfqHeaderPSService.DeletePaymentSchedule([model]).subscribe(result => {
          this.Message = "Deleted";
          /* this.show("successerror");
          setTimeout(() => { this.dismiss("successerror") }, 1000); */
          this.openSnackBar(this.Message);
          this.fetchRfqPaymentSchedulesData(this.RFQID);
        });
      }
    });
  }

  EditAttachment(row: any) {
    let payScheduleNos = this.rfqHeaderPaymentScheduleModel.map(p => p.payScheduleNo);
    payScheduleNos = payScheduleNos.filter(p => p != row.payScheduleNo);
    const dialogRef = this.dialog.open(AddNewPaymentschedulesOverlayComponent, { data: { "id": row.id, "rfqId": this.RFQID, "type": "Edit", "payScheduleNos": payScheduleNos } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      if (result.data == "cancel") {
      } else {
        this.Message = "Updated";
       /*  this.show("successerror");
        setTimeout(() => { this.dismiss("successerror") }, 1000); */
        this.openSnackBar(this.Message);
        this.fetchRfqPaymentSchedulesData(this.RFQID);
      }
    });
  }

  ngOnInit(): void {
    this.fetchRfqPaymentSchedulesData(this.RFQID);
    this.dismiss("successerror");
  }

  UpdateRFQHeaderPaymentSchedule(model: RFQHeaderPaymentScheduleViewModel, typevis) {
    debugger;
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
    this.rfqHeaderPSService.SavePaymentSchedule(model).subscribe(result => {
      this.Message = "Updated";
      /* this.show("successerror");
      setTimeout(() => { this.dismiss("successerror") }, 1000); */
      this.openSnackBar(this.Message);
    });
  }

  findsum(data) {
    this.value = data;
    let workTotalTemp = 0, paymentTotolTemp = 0, retentionTotalTemp = 0, releaseTotalTemp = 0;
    this.workTotal = this.paymentTotal = this.retentionTotal = this.total = this.releaseTotal = 0;
    for (let j = 0; j < data.length; j++) {
      workTotalTemp += Number(this.value[j].workPercentage);
      paymentTotolTemp += Number(this.value[j].paymentPercentage);
      retentionTotalTemp += Number(this.value[j].retentionPercentage);
      releaseTotalTemp += Number(this.value[j].releasePercentage);
      this.total += Number(this.value[j].releaseValue);
    }
    if (data.length > 0) {
      this.workTotal = workTotalTemp;
      this.paymentTotal = paymentTotolTemp;
      this.retentionTotal = retentionTotalTemp;
      this.releaseTotal = releaseTotalTemp;
    }
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

}
