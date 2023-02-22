import { Component, Inject, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { saveAs } from 'file-saver';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { TermsConditionViewModel } from 'app/main/Models/etendering/ViewModels/terms-condition-view-model';

@Component({
    selector: 'att-add-edit-overlay',
    templateUrl: './add-edit-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditOverlayComponent {
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction


            ['link', 'image', 'video']                         // link and image, video
        ]
    };

    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'currency', 'country'];

    @Input() rfqId: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    etmedia: any = { id: "00000000-0000-0000-0000-000000000000", fileName: "" };
    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    termsConditionList: FormGroup;
    dataId: any = "";
    termsCondition: TermsConditionViewModel;//Your Model 
    termsConditionTypes: any[];//Your Model 
    isDelete = false;
    isAdded = false;
    title: string = "Add";
    submitButtonText: string = "Save";
    names = [];
    isSaved: boolean = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddEditOverlayComponent>,
        public dialog: MatDialog, private fb: FormBuilder,
        private termsService: TermsService) {

        this.termsConditionList = this.fb.group({
            termsConditions: [null, Validators.required],
            isEditable: [null, Validators.required],
            inputType: [null],
            beforeQuoteId: [null, Validators.required],
            submitQuoteId: [null, Validators.required],
            isRFQ: [false],
            isRFI: [false],
            isRFAQ: [false],
            isPO: [false],
            termsConditionsAttachmentPath: [''],
            etMediaId: ['00000000-0000-0000-0000-000000000000'],
            fileName: [''],
            wordData: [''],
        });
        this.dataId = data.id;
        this.rfqId = data.rfqId;
        if (data.id != "00000000-0000-0000-0000-000000000000") {
            this.termsConditionList.get('beforeQuoteId').clearValidators();
            this.termsConditionList.get('submitQuoteId').clearValidators();
        }
    }

    onNameChange(name: string): void {
        this.termsService.GetTermsConditionNameList().subscribe((result) => {
            this.names = result.data.map(x => x.toLowerCase().trim());
        });
        this.onNameInput(name);
    }

    onNameInput(name: string): void {
        if (this.termsCondition.termsConditions) {
            if (name.toLowerCase().trim() != this.termsCondition.termsConditions.toLowerCase().trim() && this.names.includes(name.toLowerCase().trim())) {
                this.termsConditionList.get('termsConditions').setErrors({ duplicate: true });
            }
        }
        else if (this.names.includes(name.toLowerCase().trim())) {
            this.termsConditionList.get('termsConditions').setErrors({ duplicate: true });
        }
    }

    // get termsConditionModels(): FormArray {
    //     return this.termsConditionList.get("termsConditionModels") as FormArray
    // }

    // newTermsCondition(): FormGroup {
    //     //debugger;

    //     return this.fb.group({
    //       'termsConditions': [null, Validators.required],
    //       'isEditable': [null, Validators.required],
    //       'inputType': [null, Validators.required],
    //       'beforeQuoteId': [null, Validators.required],          
    //     //   'beforeQuoteStatus': ["9C41C756-85B5-43C2-A47D-6503E39B543C", Validators.required],
    //       'submitQuoteId': [null, Validators.required],  
    //     //   'submitQuoteStatus': ["9C41C756-85B5-43C2-A47D-6503E39B543C", Validators.required],
    //       'isRFQ': [false, Validators.required],
    //       'isRFI': [false, Validators.required],
    //       'isRFAQ': [false, Validators.required],
    //       'isPO': [false, Validators.required],
    //       'termsConditionsAttachmentPath': ['', Validators.required],
    //       'etMediaId': ['', Validators.required],

    //     })
    //   }

    // addTermsCondition() {
    //     if (this.termsConditionList.get('termsConditionModels').invalid) {
    //     this.termsConditionList.get('termsConditionModels').markAllAsTouched();
    //     return;
    //     }
    //    this.termsConditionModels.push(this.newTermsCondition());

    // }

    ngOnInit() {
        this.termsService.GetTermsConditionNameList().subscribe(result => {
            this.names = result.data.map(x => x.toLowerCase());
        });

        this.termsService.GetTermsConditionByID(this.dataId).subscribe(result => {//your service call here
            this.isDelete = true;
            // this.termsCondition = [];
            this.EInputType = result.data.inputType;
            // result.data.WordData='<p><strong>asasas<u>asdasasa</u><s><u>asasasd</u></s><em><s><u>sdsdsdsd</u></s></em></strong><strong style="color: rgb(102, 163, 224);"><em><s><u>sdsdsdsd</u></s></em></strong></p>';
            this.termsCondition = result.data;
            // this.costFactorTypes.push({"id":"","text":"Select"});
            this.termsConditionTypes = result.data.consents;
            // const linesFormArray = this.termsConditionList.get("termsConditionModels") as FormArray;
            // linesFormArray.push(this.newTermsCondition());
            // console.log(this.termsCondition[0].beforeQuoteId)
            // console.log(this.termsCondition[0].beforeQuoteStatus)
            this.termsConditionList.patchValue(this.termsCondition);
            if (this.termsCondition.etMediaId != null) {
                this.isDeleteandDownloadEnabledVisible = true;
            }
        });
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }

    isDeleteandDownloadEnabledVisible = false;
    onFormSubmit(form: NgForm) {
        this.isSaved = true;
        let termsConditionViewhModel: TermsConditionViewModel = new TermsConditionViewModel();
        termsConditionViewhModel = Object.assign(termsConditionViewhModel, form);
        if (this.dataId != "00000000-0000-0000-0000-000000000000") {
            termsConditionViewhModel.id = this.termsCondition.id;
        }
        if (this.rfqId != null) {
            termsConditionViewhModel.RFQId = this.rfqId;
            termsConditionViewhModel.isEditable = true;
            termsConditionViewhModel.isRFQ = true;
        }
        let terms: TermsConditionViewModel[];
        terms = [];
        terms.push(termsConditionViewhModel);
        this.termsService.SaveTermsCondition(terms).subscribe(result => {
            this.dialogRef.componentInstance.termsCondition = result.data[0];
            this.isSaved = false;
            this.dialogRef.close();
        });
        this.isAdded = true;
    }

    OnBeforeQuoteChange(event) {
        this.termsConditionList.get('submitQuoteId').clearValidators();
        this.termsConditionList.get('submitQuoteId').setValue(null);
        this.termsConditionList.get('beforeQuoteId').setValidators(Validators.required);
    }

    OnSubmitQuoteChange(event) {
        this.termsConditionList.get('beforeQuoteId').clearValidators();
        this.termsConditionList.get('beforeQuoteId').setValue(null);
        this.termsConditionList.get('submitQuoteId').setValidators(Validators.required);
    }

    EInputType: any = "Word";
    OnInputTypeChange(event) {
        if (event.value == "Attachment") {
            this.termsConditionList.get('wordData').clearValidators();
            this.termsConditionList.get('fileName').setValidators(Validators.required);
            this.termsConditionList.controls['wordData'].setValue('');
        }
        else if (event.value == "Word") {
            this.termsConditionList.get('fileName').clearValidators();
            this.termsConditionList.get('wordData').setValidators(Validators.required);
            this.DeleteFile();
        }
        else {
            this.termsConditionList.controls['inputType'].setValue(null);

            this.termsConditionList.get('wordData').clearValidators();
            this.termsConditionList.get('fileName').setValidators(Validators.required);
            this.termsConditionList.controls['wordData'].setValue('');

            this.termsConditionList.get('fileName').clearValidators();
            this.termsConditionList.get('wordData').setValidators(Validators.required);
            this.DeleteFile();
        }
        this.EInputType = event.value;
    }

    public uploadFile = (files) => {
        if (files.length === 0) {
            return;
        }
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe(result => {
            if (result["body"] != undefined) {
                ////debugger;
                // this.termsConditionList.get("etMediaId").setValue(result["body"].object[0].id);
                // this.etmedia.fileName=result["body"].object[0].fileName
                // this.termsConditionList.get("etMediaId").setValue(result["body"].object[0].fileName);
                this.isDeleteandDownloadEnabledVisible = true;
                this.termsConditionList.controls['etMediaId'].setValue(result["body"].object[0].id);
                this.termsConditionList.controls['fileName'].setValue(result["body"].object[0].fileName);
            }
        });
    }

    DownloadMedia() {
        this.etmedia.id = this.termsConditionList.controls['etMediaId'].value;
        this.termsService.DownloadMedia(this.etmedia).subscribe(blob => {
            saveAs(blob, this.termsConditionList.controls['fileName'].value, {
                type: 'application/pdf;charset=utf-8' // --> or whatever you need here
            });
        });
    }

    DeleteFile() {
        this.etmedia.id = '00000000-0000-0000-0000-000000000000';
        this.isDeleteandDownloadEnabledVisible = false;
        this.termsConditionList.controls['etMediaId'].setValue('00000000-0000-0000-0000-000000000000');
        this.termsConditionList.controls['fileName'].setValue('');
    }

    isNameDuplicate() {
        const name = this.termsConditionList.get('termsConditions').value;
        return name == "ab";
    }
}

function uniqueNameValidation(names: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        return !names.find((x) => x == control.value)
            ? null
            : {
                validateName: {
                    valid: true,
                },
            };
    };
}

