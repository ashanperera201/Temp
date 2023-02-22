import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RFQHeaderNoteViewModel } from 'app/main/Models/etendering/ViewModels/rfq-header-note-view-model';
import { RfqHeaderNoteService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-note.service';
import { AddNewNoteOverlayComponent } from '../../add-new-note-overlay/add-new-note-overlay.component';
import Swal from 'sweetalert2';
import { PageEvent } from '@angular/material/paginator';
import { RFQHeaderNoteSearchModel } from 'app/main/Models/etendering/rfq-header-note-search-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})

export class NotesComponent implements OnInit {

  @Input() displayedColumn8: string[] = ['id', 'notesrno', 'notes', 'type4', 'visibility4'];
  @Input() RFQID: any;
  @Input() rfqModel: RFQViewModel;
  pageEvent: PageEvent;

  rfqHeaderNoteViewModel: RFQHeaderNoteViewModel[];
  Message: any = "";
  Id: string;
  attributecategorys: any[];
  rfqsearchmodel: RFQHeaderNoteSearchModel = new RFQHeaderNoteSearchModel();

  constructor(private _changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog, private rfqHeaderNoteService: RfqHeaderNoteService) {
    this.rfqsearchmodel.pageSize = 10;
    this.rfqsearchmodel.page = 1;
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rfqsearchmodel.pageSize = size;
    this.rfqsearchmodel.page = page;
    this.fetchRfqHeaderNoteData(this.RFQID);
    this.fetchNoteData(this.RFQID);
  }

  addNote() {
    const dialogRef = this.dialog.open(AddNewNoteOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqId": this.RFQID } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqHeaderNoteData(this.RFQID);
      this.fetchNoteData(this.RFQID);
    });
  }

  fetchRfqHeaderNoteData(rfqId: string) {
    this.RFQID = rfqId;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    
           
    this.rfqHeaderNoteService.getRFQHeaderNoteByRFQId(this.RFQID).subscribe(result => {
      refference.close();
      this.rfqHeaderNoteViewModel = result.data;
      if (this.rfqHeaderNoteViewModel.length > 0) {
        this.attributecategorys = this.rfqHeaderNoteViewModel[0].attributeCategorys;
      }
      this._changeDetectorRef.detectChanges();
    });
  }

  ngOnInit(): void {
    this.fetchRfqHeaderNoteData(this.RFQID);
    this.fetchNoteData(this.RFQID);
  }

  EditRFQHeaderNote(row: any) {
    const dialogRef = this.dialog.open(AddNewNoteOverlayComponent, { data: { "id": row.id } });
    dialogRef.disableClose = true;
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
      this.fetchRfqHeaderNoteData(this.RFQID);
      this.fetchNoteData(this.RFQID);
    });
  }

  UpdateRFQHeaderNote(model: RFQHeaderNoteViewModel, isCategorySave, event) {
    if (isCategorySave == true) {
      model.isCategorySave = true;
    }
    else {
      model.isVisibleToSupplierSave = true;
      model.isVisibleToSuppliers = event.checked;
    }
    this.rfqHeaderNoteService.SaveRFQHeaderNote(model).subscribe(result => {
      Swal.fire(
        'Updated!',
        'Record Updated successfully.',
        'success'
      ).then((result) => {
        if (result.isConfirmed) {
          this.fetchRfqHeaderNoteData(this.RFQID);
        }
      })
    });
  }

  DeleteRFQHeaderNote(model: RFQHeaderNoteViewModel[]) {
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
        this.rfqHeaderNoteService.DeleteRFQHeaderNote([model]).subscribe(result => {
          Swal.fire(
            'Deleted!',
            'Record Deleted successfully.',
            'success'
          );
          this.fetchRfqHeaderNoteData(this.RFQID);
          this.fetchNoteData(this.RFQID);
        });
      }
    });
  }

  fetchNoteData(rfqId: string) {
    this.RFQID = rfqId;
    this.rfqsearchmodel.rfqId = this.RFQID;
    this.rfqHeaderNoteService.GetRFQHeaderNoteByRFQ(this.rfqsearchmodel).subscribe(result => {
      this.rfqsearchmodel = result.data;
    });
  }

}