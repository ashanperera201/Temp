import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQHeaderDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-header-document-text-view-model';
import { RfqHeaderDocumentTextService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-document-text.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-new-attachment-overlay',
    templateUrl: './add-new-documenttext-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddNewDocumenttextOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    rfqHeaderDocumentTextViewModel: RFQHeaderDocumentTextViewModel;
    selected: any;
    outputTypes: any[];
    dataId: any = "";
    outputTypeId: string;
    rfqId: any;
    isDelete: boolean;
    frmHeaderDocumentText: FormGroup;
    templateData: any = [];
    useremail: string = '';
    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    isNew: boolean = true;
    neweditText: string = "Document Text saved successfully";
    newEditText: string = "Add";
    newEditbuttonText: string = "Save";
    isSaved: boolean = false;

    constructor(public dialogRef: MatDialogRef<AddNewDocumenttextOverlayComponent>,
        public dialog: MatDialog, private rfqHeaderDocumentTextService: RfqHeaderDocumentTextService,
        private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data
    ) {
        this.dataId = data.id;
        this.rfqId = data.rfqId;
        if (this.dataId != "00000000-0000-0000-0000-000000000000") {
            this.isNew = false;
            this.newEditText = "Edit";
            this.newEditbuttonText = "Update";
        }
        this.frmHeaderDocumentText = this.fb.group({
            'phraseID': [null, Validators.required],
            //'outputTypeName': [null],
            // 'documentTextId': [null],
            //'rFQId': this.rfqId,
            'outputTypeID': [null, Validators.required]
        });
    }

    doAction() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.rfqHeaderDocumentTextService.getRFQHeaderDocumentTextById(this.dataId).subscribe(result => {//your service call here
            this.isDelete = true;
            this.rfqHeaderDocumentTextViewModel = result.data;
            this.outputTypes = result.data.outputTypes;
            this.frmHeaderDocumentText.patchValue(this.rfqHeaderDocumentTextViewModel);
        });
    }

    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        if (this.frmHeaderDocumentText.valid) {
            let rfqHeaderDocumentTextModel: RFQHeaderDocumentTextViewModel = new RFQHeaderDocumentTextViewModel();
            rfqHeaderDocumentTextModel = Object.assign(rfqHeaderDocumentTextModel, form);
            rfqHeaderDocumentTextModel.id = this.dataId;
            rfqHeaderDocumentTextModel.rfqId = this.rfqId;
            if (!this.isNew) {
                this.neweditText = "Document Text updated successfully";
            }
            this.rfqHeaderDocumentTextService.SaveRFQHeaderDocumentText(rfqHeaderDocumentTextModel).subscribe(
                result => {
                    this.isSaved = false;
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: this.neweditText,
                        showConfirmButton: false,
                        timer: 1000
                    })
                    this.dialogRef.close();
                }
            )
        }
    }

    addNewDocumentTextButtonEnable() {
        this.isSaved = false;
    }

}