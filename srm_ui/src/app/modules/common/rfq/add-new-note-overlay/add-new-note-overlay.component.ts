import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQHeaderNoteViewModel } from 'app/main/Models/etendering/ViewModels/rfq-header-note-view-model';
import { RfqHeaderNoteService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-note.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-new-attachment-overlay',
    templateUrl: './add-new-note-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewNoteOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    dataId: any = "";
    rfqId: any;
    rfqHeaderNote: RFQHeaderNoteViewModel;
    isDelete: boolean;
    frmHeaderNote: FormGroup;
    buttontext: string;
    popuptext: string = "Add";
    isSaved: boolean = false;

    constructor(public dialogRef: MatDialogRef<AddNewNoteOverlayComponent>,
        public dialog: MatDialog, private rfqHeaderNoteService: RfqHeaderNoteService,
        private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data) {
        this.dataId = data.id;
        this.rfqId = this.data.rfqId;
        this.frmHeaderNote = this.fb.group({
            'description': [null, Validators.required]
        })
    }

    ngOnInit() {
        this.rfqHeaderNoteService.getRFQHeaderNoteById(this.dataId).subscribe(result => {
            this.isDelete = true;
            this.rfqHeaderNote = result.data;
            this.frmHeaderNote.patchValue(this.rfqHeaderNote);
        });

        if (this.dataId == "00000000-0000-0000-0000-000000000000" || this.dataId == null || this.dataId == undefined) {
            this.buttontext = "Add";
        }
        else {
            this.buttontext = "Update";
            this.popuptext = "Edit";
        }
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        if (this.frmHeaderNote.valid) {
            let rfqHeaderNoteViewModel: RFQHeaderNoteViewModel = new RFQHeaderNoteViewModel();
            rfqHeaderNoteViewModel = Object.assign(rfqHeaderNoteViewModel, form);
            rfqHeaderNoteViewModel.rFQId = this.rfqId;
            rfqHeaderNoteViewModel.isDescriptionSave = true;

            if (this.dataId != "00000000-0000-0000-0000-000000000000") {
                rfqHeaderNoteViewModel.id = this.rfqHeaderNote.id;
            }

            this.rfqHeaderNoteService.SaveRFQHeaderNote(rfqHeaderNoteViewModel).subscribe(result => {
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