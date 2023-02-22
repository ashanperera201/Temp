import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RFQPartLineNoteViewModel } from 'app/main/Models/etendering/ViewModels/rfq-part-line-note-view-model';
import { RfqPartLineNoteService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-note.service';
import { AddNewPartLineNoteOverlayComponent } from '../../../add-new-part-line-note-overlay/add-new-part-line-note-overlay.component';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
  selector: 'app-rfq-notes',
  templateUrl: './rfq-notes.component.html',
  styleUrls: ['./rfq-notes.component.scss']
})

export class RfqNotesComponent implements OnInit {

  displayedColumn8: string[] = ['id', 'notesrno', 'notes', 'type4', 'visibility4'];
  @Input() RFQID: any;
  @Input() RFQModel: any;
  @Input() RFQPartLineID: any;

  rfqPartLineNoteViewModel: RFQPartLineNoteViewModel[];
  Id: string;
  attributecategorys: any[];

  constructor(public dialog: MatDialog, private rfqPartLineNoteService: RfqPartLineNoteService, private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchRfqPartLineNoteData(this.RFQID);
  }

  addPartLineNote() {
    const dialogRef = this.dialog.open(AddNewPartLineNoteOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqId": this.RFQID, "rfqPartLineId": this.RFQPartLineID } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqPartLineNoteData(this.RFQID);
    });
  }

  fetchRfqPartLineNoteData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
           
    this.rfqPartLineNoteService.getRFQPartLineNoteByRFQPartId(this.RFQID, this.RFQPartLineID).subscribe(result => {
      refference.close();
      this.rfqPartLineNoteViewModel = result.data;

      if (this.rfqPartLineNoteViewModel.length > 0) {
        this.attributecategorys = this.rfqPartLineNoteViewModel[0].attributeCategorys;
      }
      this._changeDetectorRef.detectChanges();
    });
  }

  UpdateRFQHeaderNote(model: RFQPartLineNoteViewModel, isCategorySave, event) {
    if (isCategorySave == true) {
      model.isCategorySave = true;
    }
    else {
      model.isDisplayToSupplierSave = true;
      model.displayToSupplier = event.checked;
    }
    this.rfqPartLineNoteService.SaveRFQPartLineNote(model).subscribe(result => {
      Swal.fire(
        'Updated!',
        'Record Updated successfully.',
        'success'
      ).then((result) => {
        if (result.isConfirmed) {
          this.fetchRfqPartLineNoteData(this.RFQID);
        }
      })
    });
  }

  EditRFQPartLineNote(row: any) {
    const dialogRef = this.dialog.open(AddNewPartLineNoteOverlayComponent, { data: { "id": row.id, "rfqId": this.RFQID, "rfqPartLineId": this.RFQPartLineID } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqPartLineNoteData(this.RFQID);
    });
  }

  DeleteRFQPartLineNote(model: RFQPartLineNoteViewModel[]) {
    Swal.fire({
      title: 'Remove Note',
      text: "Are you sure you want to delete this record?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Remove'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rfqPartLineNoteService.DeleteRFQPartLineNote([model]).subscribe(result => {
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          );
          this.fetchRfqPartLineNoteData(this.RFQID);
        });
      }
    });
  }

}
