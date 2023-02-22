import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { RfqPartLineAttachmentService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attachment.service';
import { RFQPartLineAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-attachment-view-model';
import { saveAs } from 'file-saver';
import { AddNewLineAttachmentOverlayComponent } from '../../../add-new-line-attachment-overlay/add-new-line-attachment-overlay.component';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
  selector: 'app-rfq-attachments',
  templateUrl: './rfq-attachments.component.html',
  styleUrls: ['./rfq-attachments.component.scss']
})
export class RfqAttachmentsComponent implements OnInit {

  @Input() displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
  Id: string;
  rfqPartLineAttachmentViewModel: RFQPartLineAttachmentViewModel[] = [];

  @Input() RFQID: any;
  @Input() RFQPartLineID: any;
  @Input() RFQModel: any;
  attributeCatagories: any[];
  IsHeaded: boolean = false;

  constructor(public dialog: MatDialog,
    private rfqPartLineAttachmentsService: RfqPartLineAttachmentService,
    private termsService: TermsService) { }

  addLineAttachment() {
    const dialogRef = this.dialog.open(AddNewLineAttachmentOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqPartLineAttachmentListComponent": this, "rfqId": this.RFQID, "rfqPartLineId": this.RFQPartLineID, "RFQModel": this.RFQModel } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqPartLineAttachmentData(this.RFQID);
    });
  }

  DownloadMedia(etMediaId, fileName, fileExtension) {
    let eTMedia: any = { id: etMediaId }
    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

  fetchRfqPartLineAttachmentData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
           
    this.rfqPartLineAttachmentsService.getRFQPartLineAttachmentByRFQPartId(this.RFQID, this.RFQPartLineID).subscribe(result => {
      refference.close();
      this.rfqPartLineAttachmentViewModel = result.data;
      if (this.rfqPartLineAttachmentViewModel.length > 0) {
        this.attributeCatagories = this.rfqPartLineAttachmentViewModel[0].attributeCatagories;
      }
    });
  }

  ngOnInit(): void {
    this.fetchRfqPartLineAttachmentData(this.RFQID);

  }

  fetchAttachmentData(Id: string) {
    this.Id = Id;
    this.rfqPartLineAttachmentsService.getRFQPartLineAttachmentByRFQPartId(this.RFQID, this.RFQPartLineID).subscribe(result => {
      this.rfqPartLineAttachmentViewModel = result.data;
    });
  }

  EditAttachment(row: any) {
    const dialogRef = this.dialog.open(AddNewLineAttachmentOverlayComponent, { data: { "id": row.id, "rfqId": this.RFQID, "rfqPartLineId": this.RFQPartLineID, "srNumber": row.srNumber } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqPartLineAttachmentData(this.RFQID);
    });
  }

  updateRfqPartLineAttachment(row: any) {
    row.isVisibleToSupplierSave = true;
    this.rfqPartLineAttachmentsService.SaveRFQPartLineAttachment(row).subscribe(result => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1000
      })
    });
  }

  DeletePartLineAttachment(model: RFQPartLineAttachmentViewModel[]) {
    Swal.fire({
      title: 'Remove Document Text',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rfqPartLineAttachmentsService.DeleteRFQPartLineAttachment([model]).subscribe(result => {
          this.fetchRfqPartLineAttachmentData(this.RFQID);
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          )
        });
      }
    });
  }

}