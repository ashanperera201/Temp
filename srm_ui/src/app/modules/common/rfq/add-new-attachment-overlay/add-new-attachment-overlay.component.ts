import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQHeaderAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attachment-view-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqHeaderAttachmentsService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attachments.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'add-new-attachment-overlay',
  templateUrl: './add-new-attachment-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddNewAttachmentOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  templateData: any = [];
  useremail: string = '';
  dataId: any = "";
  rfqId: any;
  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  RFQModel: RFQViewModel;
  addTeam = new FormGroup({
    teamName: new FormControl('Team Name One'),
    teamDescription: new FormControl('Team Description One'),
  });
  headerAttachment: RFQHeaderAttachmentViewModel;//Your Model 
  isDelete: boolean;
  frmHeaderAttachmentList: FormGroup;
  etmedia: any = { id: "00000000-0000-0000-0000-000000000000", fileName: "" };
  attributeCatagories: any[];
  overlayName: any = "";
  isNew: boolean = true;
  neweditText: string = "Attachment saved successfully";
  newEditText: string = "Add";
  newEditbuttonText: string = "Save";
  isSaved: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddNewAttachmentOverlayComponent>,
    public dialog: MatDialog,
    private rfqHeaderAttachmentsService: RfqHeaderAttachmentsService,
    private fb: FormBuilder,
    private termsService: TermsService) {
    this.rfqId = data.rfqId;
    this.RFQModel = data.RFQModel;
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.isNew = false;
      this.newEditText = "Edit";
      this.newEditbuttonText = "Update";
    }
    this.dataId = data.id;
    this.overlayName = data.overlayName;
    this.frmHeaderAttachmentList = this.fb.group({
      'title': [null, Validators.required],
      'fileName': [null, Validators.required],
      'documentClass': [null, Validators.required],
      'prReferenceNo': [null, Validators.required],
      'isVisibleToSuppliers': false,
      'etMediaId': [null],
      'rFQId': [null],
      'attributeCategoryId': [null, Validators.required]
    });
    this.frmHeaderAttachmentList.get('documentClass').disable();
  }

  ngOnInit() {
    this.rfqHeaderAttachmentsService.getRFQHeaderAttachmentById(this.dataId).subscribe(result => {//your service call here
      this.isDelete = true;
      this.headerAttachment = result.data;
      this.attributeCatagories = result.data.attributeCatagories;
      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
        this.headerAttachment.documentClass = this.RFQModel.documentClass;
      }
      if (this.headerAttachment.id != '00000000-0000-0000-0000-000000000000') {
        this.frmHeaderAttachmentList.patchValue(this.headerAttachment);
      }
      if (this.headerAttachment.etMediaId != null && this.headerAttachment.etMediaId != "00000000-0000-0000-0000-000000000000") {
        this.isDeleteandDownloadEnabledVisible = true;
      }
    });
  }

  onFormSubmit(form: NgForm) {
    this.isSaved = true;
    if (this.frmHeaderAttachmentList.valid) {
      let rfqHeaderAttachmentViewModel: RFQHeaderAttachmentViewModel = new RFQHeaderAttachmentViewModel();
      rfqHeaderAttachmentViewModel = Object.assign(rfqHeaderAttachmentViewModel, form);
      rfqHeaderAttachmentViewModel.rFQId = this.rfqId;
      rfqHeaderAttachmentViewModel.id = this.dataId;
      if (!this.isNew) {
        this.neweditText = "Document Text updated successfully";
      }
      this.rfqHeaderAttachmentsService.SaveRFQHeaderAttachment(rfqHeaderAttachmentViewModel).subscribe(
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

  doAction() {
    this.dialogRef.close();
  }

  isDeleteandDownloadEnabledVisible = false;

  uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    this.termsService.uploadFile(formData).subscribe(result => {
      if (result["body"] != undefined) {
        this.isDeleteandDownloadEnabledVisible = true;
        this.frmHeaderAttachmentList.controls['etMediaId'].setValue(result["body"].object[0].id);
        this.frmHeaderAttachmentList.controls['fileName'].setValue(result["body"].object[0].fileName);
      }
    });
  }


  DownloadMedia(eTMediaId, fileName, fileExtension) {
    let eTMedia: any = { id: eTMediaId }
    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

  DeleteFile() {
    this.etmedia.id = this.frmHeaderAttachmentList.controls['etMediaId'].value;
    this.isDeleteandDownloadEnabledVisible = false;
    this.frmHeaderAttachmentList.controls['etMediaId'].setValue(null);
    this.frmHeaderAttachmentList.controls['fileName'].setValue('');
  }

  addNewAttachmentButtonEnable() {
    this.isSaved = false;
  }

}