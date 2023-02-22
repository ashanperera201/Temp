import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQPartLineNoteViewModel } from 'app/main/Models/etendering/ViewModels/rfq-part-line-note-view-model';
import { RfqPartLineNoteService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-note.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-new-attachment-overlay',
    templateUrl: './add-new-part-line-note-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddNewPartLineNoteOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    popuptext: string = "Add";
    dataId: any = "";
    rfqId: any;
    rfqPartLineId: any;

    rfqPartLineNote: RFQPartLineNoteViewModel;
    isDelete: boolean;
    frmPartLineNote: FormGroup;
    buttontext: string;
    isSaved: boolean = false;

    constructor(public dialogRef: MatDialogRef<AddNewPartLineNoteOverlayComponent>,
        public dialog: MatDialog, private rfqPartLineNoteService: RfqPartLineNoteService,
        private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) {
        this.dataId = data.id;
        this.rfqId = this.data.rfqId;
        this.rfqPartLineId = this.data.rfqPartLineId;
        this.frmPartLineNote = this.fb.group({
            'description': [null, Validators.required]
        })
    }

    ngOnInit() {
        this.rfqPartLineNoteService.getRFQPartLineNoteById(this.dataId).subscribe(result => {
            this.isDelete = true;
            this.rfqPartLineNote = result.data;
            this.frmPartLineNote.patchValue(this.rfqPartLineNote);
            if (this.dataId == "00000000-0000-0000-0000-000000000000" || this.dataId == null || this.dataId == undefined) {
                this.buttontext = "Add";
            }
            else {
                this.buttontext = "Update";
                this.popuptext = "Edit";
            }
        });
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        if (this.frmPartLineNote.valid) {
            let rfqPartLineNoteViewModel: RFQPartLineNoteViewModel = new RFQPartLineNoteViewModel();
            rfqPartLineNoteViewModel = Object.assign(rfqPartLineNoteViewModel, form);

            rfqPartLineNoteViewModel.rFQId = this.rfqId;
            rfqPartLineNoteViewModel.rfqPartLineId = this.rfqPartLineId;
            rfqPartLineNoteViewModel.isDescriptionSave = true;
            rfqPartLineNoteViewModel.id = this.rfqPartLineNote.id;

            this.rfqPartLineNoteService.SaveRFQPartLineNote(rfqPartLineNoteViewModel).subscribe(result => {
                this.isSaved = false;
                Swal.fire(
                    'Added!',
                    'Record ' + this.buttontext + 'ed successfully.',
                    'success'
                )
                this.dialogRef.close();
            });
        }
    }

    doAction() {
        this.dialogRef.close();
    }

    addNewNoteButtonEnable() {
        this.isSaved = false;
    }

}