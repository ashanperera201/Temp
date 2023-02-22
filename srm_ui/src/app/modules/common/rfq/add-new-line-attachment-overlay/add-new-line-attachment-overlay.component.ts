import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { RFQPartLineAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-attachment-view-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqPartLineAttachmentService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attachment.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { AnyRecordWithTtl } from 'dns';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'add-new-line-attachment-overlay',
  templateUrl: './add-new-line-attachment-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddNewLineAttachmentOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  templateData: any = [];
  useremail: string = '';
  dataId: any = "";
  rfqId: any;
  rfqpartLineId: any;
  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  srNumber: any;
  addTeam = new FormGroup({
    teamName: new FormControl('Team Name One'),
    teamDescription: new FormControl('Team Description One'),
  });
  linesAttachment: RFQPartLineAttachmentViewModel;//Your Model 
  isDelete: boolean;
  frmLineAttachmentList: FormGroup;
  etmedia: any = { id: "00000000-0000-0000-0000-000000000000", fileName: "" };
  attributeCatagories: any[];
  buttontext: string = 'Add';
  isNew: boolean = true;
  neweditText: string = "Document Text saved successfully";
  newEditText: string = "Add";
  newEditbuttonText: string = "Save";
  RFQModel: RFQViewModel;
  isSaved: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddNewLineAttachmentOverlayComponent>,
    public dialog: MatDialog,
    private rfqLineAttachmentsService: RfqPartLineAttachmentService,
    private fb: FormBuilder,
    private termsService: TermsService) {
    this.dataId = data.id;
    this.RFQModel = data.RFQModel;
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.isNew = false;
      this.newEditText = "Edit";
      this.newEditbuttonText = "Update";
    }
    this.rfqpartLineId = data.rfqPartLineId;
    this.rfqId = data.rfqId;
    this.srNumber = data.srNumber;
    this.frmLineAttachmentList = this.fb.group({
      'title': [null, Validators.required],
      'fileName': [null, Validators.required],
      'documentClass': [null, Validators.required],
      'prReferenceNo': [null, Validators.required],
      'isDisplayToSupplier': false,
      'etMediaId': [null, Validators.required],
      'rFQId': [null],
      'attributeCategoryId': [null, Validators.required],
    });
    this.frmLineAttachmentList.get('documentClass').disable();
  }

  ngOnInit() {
    this.rfqLineAttachmentsService.getRFQPartLineAttachmentById(this.dataId).subscribe(result => {//your service call here
      this.isDelete = true;
      this.linesAttachment = result.data;
      this.attributeCatagories = result.data.attributeCatagories;
      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
        this.linesAttachment.documentClass = this.RFQModel.documentClass;
      }
      if (this.linesAttachment.id != '00000000-0000-0000-0000-000000000000') {
        this.frmLineAttachmentList.patchValue(this.linesAttachment);
      }
      if (this.linesAttachment.etMediaId != null && this.linesAttachment.etMediaId != "00000000-0000-0000-0000-000000000000") {
        this.isDeleteandDownloadEnabledVisible = true;
      }

      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
        this.buttontext = "Add";
      }
      else {
        this.buttontext = "Update";
      }
    });
  }

  onFormSubmit(form: NgForm) {
    this.isSaved = true;
    if (this.frmLineAttachmentList.valid) {
      let rfqLinesAttachmentViewModel: RFQPartLineAttachmentViewModel = new RFQPartLineAttachmentViewModel();
      rfqLinesAttachmentViewModel = Object.assign(rfqLinesAttachmentViewModel, form);
      rfqLinesAttachmentViewModel.rFQId = this.rfqId;
      rfqLinesAttachmentViewModel.rFQPartLineId = this.rfqpartLineId;
      rfqLinesAttachmentViewModel.id = this.dataId;
      rfqLinesAttachmentViewModel.srNumber = this.srNumber;

      this.rfqLineAttachmentsService.SaveRFQPartLineAttachment(rfqLinesAttachmentViewModel).subscribe(result => {
        this.isSaved = false;
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: this.neweditText,
          showConfirmButton: false,
          timer: 1000
        })
        this.dialogRef.close();
      });
    }
  }

  doAction() {
    this.dialogRef.close({ data: "cancel" });
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
        this.frmLineAttachmentList.controls['etMediaId'].setValue(result["body"].object[0].id);
        this.frmLineAttachmentList.controls['fileName'].setValue(result["body"].object[0].fileName);
      }
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

  DeleteFile() {
    this.etmedia.id = this.frmLineAttachmentList.controls['etMediaId'].value;
    this.isDeleteandDownloadEnabledVisible = false;
    this.frmLineAttachmentList.controls['etMediaId'].setValue(null);
    this.frmLineAttachmentList.controls['fileName'].setValue('');
  }

  addNewAttachmentButtonEnable() {
    this.isSaved = false;
  }

}