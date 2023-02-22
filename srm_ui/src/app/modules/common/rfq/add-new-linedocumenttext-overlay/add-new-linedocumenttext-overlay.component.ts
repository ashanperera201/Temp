import { Component, Inject, OnChanges, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQPartLineDocumentTextModel } from 'app/main/Models/etendering/RFQPartLineDocumentTextModel';
import { RfqPartLineDocumentTextService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-document-text.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Type } from 'app/main/Models/etendering/enum';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-new-linedocumenttext-overlay',
    templateUrl: './add-new-linedocumenttext-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddNewLineDocumenttextOverlayComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    types: Type;
    selected: any;
    lineDocumentText: FormGroup;
    editData: any;
    templateData: any = [];
    useremail: string = '';
    docuementTextTypedata: any = [];
    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    isNew: boolean = true;
    neweditText: string = "Document Text saved successfully";
    newEditText: string = "Add";
    newEditbuttonText: string = "Save";
    isSaved: boolean = false;

    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    rfqId: any;
    rfqPartLineId: any

    constructor(public dialogRef: MatDialogRef<AddNewLineDocumenttextOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private rfqPartLineDocumentTextService: RfqPartLineDocumentTextService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.rfqId = data.rfqId;
        this.rfqPartLineId = data.rfqPartLineId;
        if (this.data.dataKey) {
            if (this.data.dataKey.id != "00000000-0000-0000-0000-000000000000") {
                this.isNew = false;
                this.newEditText = "Edit";
                this.newEditbuttonText = "Update";
            }
        }
    }

    ngOnInit(): void {
        this.lineDocumentText = this.fb.group({
            select: [null, Validators.required],
            documenttext: [null, Validators.required]
        });
        this.getDocumentOutPutText();
        if (this.data) {
            this.editData = this.data.dataKey;
            this.types = this.data.type;
            if (this.data.dataKey) {
                this.lineDocumentText.get('select').setValue(this.data.dataKey.outputTypeID);
                this.lineDocumentText.get('documenttext').setValue(this.data.dataKey.phraseID);
            }
        }
    }

    doAction() {
        this.dialogRef.close();
        // window.location.reload() ;
    }

    getDocumentOutPutText() {
        this.rfqPartLineDocumentTextService.getOutPutLines().subscribe((data) => {
            this.docuementTextTypedata = data;
            this.selected = data[0].id;
        }, error => {
            console.log(error);
        });
    }

    saveTemplate() {
        this.isSaved = true;
        if (this.lineDocumentText.valid) {
            if (this.editData && (this.types === Type.Lines)) {
                this.editData.outputTypeId = this.lineDocumentText.get('select').value;
                this.editData.phraseId = this.lineDocumentText.get('documenttext').value;
                this.rfqPartLineDocumentTextService.saveLineDocumentText(this.editData).subscribe((data) => {
                    this.isSaved = false;
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: this.neweditText,
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.dialogRef.close();
                    this.iserror = true;
                }, error => {
                    this.issuccess = true;
                    console.log(error);
                }
                );
            } else if (this.types === Type.Lines) {
                var lineDocumentText = new RFQPartLineDocumentTextModel();
                lineDocumentText.rfqId = this.rfqId;
                lineDocumentText.rfqPartLineId = this.rfqPartLineId;
                lineDocumentText.outputTypeId = this.lineDocumentText.get('select').value;
                lineDocumentText.phraseId = this.lineDocumentText.get('documenttext').value;
                this.rfqPartLineDocumentTextService.saveLineDocumentText(lineDocumentText).subscribe((data) => {
                    this.isSaved = false;
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: this.neweditText,
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.dialogRef.close();
                    this.iserror = true;
                }, error => {
                    this.issuccess = true;
                    console.log(error);
                }
                );
            }
        }
    }

    addNewDocumentTextButtonEnable() {
        this.isSaved = false;
    }

}