import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RFQHeaderDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-header-document-text-view-model';
import { RfqHeaderDocumentTextService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-document-text.service';
import { AddNewDocumenttextOverlayComponent } from '../../add-new-documenttext-overlay/add-new-documenttext-overlay.component';
import { RowData7 } from '../../rfq.component';
import Swal from 'sweetalert2';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';


@Component({
  selector: 'app-document-text',
  templateUrl: './document-text.component.html',
  styleUrls: ['./document-text.component.scss']
})
export class DocumentTextComponent implements OnInit {
  @Input() RFQID: any;
  @Input() rfqModel: RFQViewModel;
  @Input() dataSource7: MatTableDataSource<RowData7>;
  @Input() displayedColumn7: string[];

  rfqHeaderDocumentTextViewModel: any = new RFQHeaderDocumentTextViewModel();

  Message: string;
  Id: string;
  attributeCategorys: any[];
  outputTypes: any[];

  constructor(public dialog: MatDialog, private rfqHeaderDocumentTextService: RfqHeaderDocumentTextService) { }

  addDocumentText() {
    const dialogRef = this.dialog.open(AddNewDocumenttextOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqId": this.RFQID } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqHeaderDocumentTextData(this.RFQID);
    });
  }

  ngOnInit(): void {
    this.fetchRfqHeaderDocumentTextData(this.RFQID);
  }

  fetchRfqHeaderDocumentTextData(rfqId: string) {
    this.RFQID = rfqId;
    
 const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
 
    this.rfqHeaderDocumentTextService.getRFQDocumentTextByRFQId(this.RFQID).subscribe((result: any) => {
      refference.close();
      if (result.data.length > 0) {
        this.rfqHeaderDocumentTextViewModel = result.data;
      } else if (result.data.length === 0) {
        this.rfqHeaderDocumentTextViewModel = null;
      }
      if (this.rfqHeaderDocumentTextViewModel.length > 0) {
        this.attributeCategorys = this.rfqHeaderDocumentTextViewModel[0].attributeCategorys;
      }
    });
  }

  DeleteRFQHeaderDocumentText(model: RFQHeaderDocumentTextViewModel[]) {
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
        this.rfqHeaderDocumentTextService.DeleteRFQHeaderDocumentText([model]).subscribe(result => {
          this.fetchRfqHeaderDocumentTextData(this.RFQID);
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          )
        });
      }
    })
  }

  fetchAttachmentData(Id: string) {
    this.Id = Id;
    this.rfqHeaderDocumentTextService.getRFQDocumentTextByRFQId(this.Id).subscribe(result => {
      this.rfqHeaderDocumentTextViewModel = result.data;
    });
  }

  EditAttachment(row: any) {
    const dialogRef = this.dialog.open(AddNewDocumenttextOverlayComponent, { data: { "id": row.id, "rfqId": this.RFQID } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqHeaderDocumentTextData(this.RFQID);
    });
  }

  updateRfqDocumentText(row: any) {
    row.isVisibleToSupplierSave = true;
    this.rfqHeaderDocumentTextService.SaveRFQHeaderDocumentText(row).subscribe(result => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1000
      })
      this.fetchRfqHeaderDocumentTextData(this.RFQID);
    });
  }

  UpdateRFQHeaderDocumentText(model: RFQHeaderDocumentTextViewModel, typevis) {
    if (typevis == "Cat") {
      model.isCategorySave = true;
    }
    else if (typevis == "Sup") {
      model.isVisibleToSupplierSave = true;
    }
    this.rfqHeaderDocumentTextService.SaveRFQHeaderDocumentText(model).subscribe(result => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1000
      })
    });
  }

}