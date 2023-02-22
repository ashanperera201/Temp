import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RFQHeaderAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attachment-view-model';
import { RfqHeaderAttachmentsService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attachments.service';
import { AddNewAttachmentOverlayComponent } from '../../add-new-attachment-overlay/add-new-attachment-overlay.component';
import { FuseAlertService } from '@fuse/components/alert';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { saveAs } from 'file-saver';
import { PageEvent } from '@angular/material/paginator';
import { RFQHeaderAttachmentSearchModel } from 'app/main/Models/etendering/rfq-header-attachment-search-model';
import Swal from 'sweetalert2';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss']
})
export class AttachmentsComponent implements OnInit {

  @Input() displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
  @Input() RFQID: any;
  @Input() RFQModel: RFQViewModel;

  Message: any = "";
  actualSurveyTemplateModels: any = [];
  Id: string;
  attributeCatagories: any[];
  pageEvent: PageEvent;
  rfqsearchmodel: RFQHeaderAttachmentSearchModel = new RFQHeaderAttachmentSearchModel();
  rfqHeaderAttachmentViewModel: any[];

  constructor(public dialog: MatDialog,
    private rfqHeaderAttachmentService: RfqHeaderAttachmentsService,
    private _fuseAlertService: FuseAlertService,
    private rfqHeaderAttachmentsService: RfqHeaderAttachmentsService,
    private termsService: TermsService, private _snackBar: MatSnackBar) {
    this.rfqsearchmodel.pageSize = 10;
    this.rfqsearchmodel.page = 1;
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }


  addAttachment() {
    const dialogRef = this.dialog.open(AddNewAttachmentOverlayComponent, {
      data: {
        "id": "00000000-0000-0000-0000-000000000000",
        "rfqHeaderAttachmentListComponent": this, "rfqId": this.RFQID, "overlayName": "Add New Attachment", "RFQModel": this.RFQModel
      }
    });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqHeaderAttachmentData(this.RFQID);
      this.fetchAttachmentData(this.RFQID);
    });
  }

  fetchRfqHeaderAttachmentData(rfqId: string) {
    this.rfqHeaderAttachmentService.getRFQHeaderAttachmentByRFQId(this.RFQID).subscribe(result => {
      this.rfqHeaderAttachmentViewModel = result.data;
      if (this.rfqHeaderAttachmentViewModel != null) {
        if (result.data.length > 0) {
          this.attributeCatagories = this.rfqHeaderAttachmentViewModel[0].attributeCatagories;
        }
      }
    });
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rfqsearchmodel.pageSize = event.pageSize;
    this.rfqsearchmodel.page = page;
    this.fetchAttachmentData(this.RFQID);
  }

  ngOnInit(): void {
    this.fetchAttachmentData(this.RFQID)
    this.dismiss("successerror")
  }


  DownloadMedia(eTMediaId, fileName, fileExtension) {
    let eTMedia: any = { id: eTMediaId }
    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

  DeleteAttachment(model: RFQHeaderAttachmentViewModel[]) {
    Swal.fire({
      title: 'Remove Attachment',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rfqHeaderAttachmentService.DeleteRFQHeaderAttachment([model]).subscribe(result => {
          this.fetchRfqHeaderAttachmentData(this.RFQID);
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.'
          )
        });
      }
    })
  }

  EditAttachment(row: any) {
    const dialogRef = this.dialog.open(AddNewAttachmentOverlayComponent, { data: { "id": row.id, "rfqId": this.RFQID, "overlayName": "Edit Attachment" } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      this.fetchAttachmentData(this.Id);
      this.fetchRfqHeaderAttachmentData(this.RFQID);
    });
  }

  fetchAttachmentData(Id: string) {
    this.Id = Id;
    this.rfqsearchmodel.RFQId = this.Id;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });


    this.rfqHeaderAttachmentService.GetRFQHeaderAttachmentByRFQ(this.rfqsearchmodel).subscribe(result => {
      refference.close();
      this.rfqsearchmodel = result.data;
    });
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  updateRfqHeaderAttachment(row: any) {
    row.isVisibleToSupplierSave = true;
    this.rfqHeaderAttachmentsService.SaveRFQHeaderAttachment(row).subscribe(result => {
    });
  }

}