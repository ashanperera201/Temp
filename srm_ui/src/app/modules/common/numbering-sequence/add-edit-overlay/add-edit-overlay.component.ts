import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { NumberingSequenceSearchModel } from 'app/main/Models/etendering/numbering-sequence-search-model';
import { NumberingSequenceViewModel } from 'app/main/Models/etendering/ViewModels/numbering-sequence-view-model';
import { NumberingSequenceService } from 'app/shared/Services/etendering/numbering-sequence.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'att-add-edit-overlay',
  templateUrl: './add-edit-overlay.component.html',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class AddEditOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  templateData: any = [];
  useremail: string = '';

  selectedId: any = [];
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully added the template';
  issuccess = false;
  iserror = false;
  isDelete = false;
  dataId: any = "";
  numberingSequence: NumberingSequenceViewModel[];
  sequenceList: FormGroup;
  rfxType: string = "RFQ";
  beforeStartDate: Date;
  beforeEndtDate: Date;
  isNew: boolean = true;
  neweditText: string = "Numbering Sequence saved successfully";
  newEditText: string = "Add";
  newEditbuttonText: string = "Save";
  isSaved: boolean = false;
  previousValue: string = '';
  isInputEmpty: boolean = false;
  numberingSequenceForm: FormGroup;
isDateValidate:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private numberingSequenceService: NumberingSequenceService,
    private datePipe: DatePipe) {
    this.sequenceList = this.fb.group({
      numberingSequenceModels: this.fb.array([])
    });
    this.dataId = this.data.id;
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.isNew = false;
      this.newEditText = "Edit";
      this.newEditbuttonText = "Update";
    }
    this.rfxType = this.data.RFXType;
  }

  get numberingSequenceModels(): FormArray {
    return this.sequenceList.get("numberingSequenceModels") as FormArray
  }

  newNumberingSequence(): FormGroup {
    this.numberingSequenceForm = this.fb.group({
      'startNumber': [null, Validators.required],
      'startOfNoSequence': { value: '', disabled: true },
      'isProjectExists': [null],
      'startDate': [null, Validators.required],
      'endDate': [null, Validators.required],
      'isActive': [true],
    });


    // Add value change listener for startDate and endDate fields
    this.numberingSequenceForm.get('startDate').valueChanges.subscribe(() => {
      debugger;
      this.validateEndDate();
    });

    this.numberingSequenceForm.get('endDate').valueChanges.subscribe(() => {
      debugger;
      this.validateEndDate();
    });

    this.numberingSequenceForm.get('isProjectExists').valueChanges.subscribe((checked: boolean) => {
      const startOfNoSequenceControl = this.numberingSequenceForm.get('startOfNoSequence');
      if (checked) {
        startOfNoSequenceControl.setValidators([Validators.required]);
        startOfNoSequenceControl.setValue(this.previousValue);
        startOfNoSequenceControl.enable();
      } else {

        startOfNoSequenceControl.clearValidators();
        startOfNoSequenceControl.setValue(0);
        startOfNoSequenceControl.disable();
      }
      startOfNoSequenceControl.updateValueAndValidity();
    });

    this.numberingSequenceForm.get('startOfNoSequence').valueChanges.subscribe((value: string) => {
      this.isInputEmpty = value === '';
    });

    return this.numberingSequenceForm;

    // return this.fb.group({
    //   'startNumber': [null, Validators.required],
    //   'startOfNoSequence': {value: '', disabled: true},
    //   'isProjectExists': [null, Validators.required],
    //   'startDate': [null, Validators.required],
    //   'endDate': [null, Validators.required],
    // })
  }


  validateEndDate(): void {
    const startDateControl = this.numberingSequenceForm.get('startDate');
    const endDateControl = this.numberingSequenceForm.get('endDate');
    const startDate = this.datePipe.transform(startDateControl.value, 'yyyy-MM-dd');
    const endDate = this.datePipe.transform(endDateControl.value, 'yyyy-MM-dd');

    if (startDate && endDate) {
      if (endDate < startDate) {
        endDateControl.setErrors({ endDateGreaterThanStartDate: true });
      } else {
        endDateControl.setErrors(null);
      }
    }
  }

  addNumberingSequence() {
    if (this.sequenceList.get('numberingSequenceModels').invalid) {
      this.sequenceList.get('numberingSequenceModels').markAllAsTouched();
      return;
    }
    this.numberingSequenceModels.push(this.newNumberingSequence());
  }

  ngOnInit() {
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
      this.addNumberingSequence();
    }
    else {
      this.numberingSequenceService.getNumberingSequenceById(this.dataId).subscribe(result => {
        this.isDelete = true;
        this.numberingSequence = [];
        this.numberingSequence.push(result.data);
        this.previousValue = result.data.startOfNoSequence;
        const linesFormArray = this.sequenceList.get("numberingSequenceModels") as FormArray;
        linesFormArray.push(this.newNumberingSequence());
        this.sequenceList.patchValue({ "numberingSequenceModels": this.numberingSequence });
        this.beforeStartDate = this.numberingSequence[0].startDate;
        this.beforeEndtDate = this.numberingSequence[0].endDate;
      });
    }
  }

  onFormSubmit(form: NgForm) {
    this.isSaved = true;
    this.isDateValidate=false;
    if (this.sequenceList.valid) {
      let numberingSequenceSearchModel: NumberingSequenceSearchModel = new NumberingSequenceSearchModel();
      numberingSequenceSearchModel = Object.assign(numberingSequenceSearchModel, form);
      if (numberingSequenceSearchModel.numberingSequenceModels.length > 0 && numberingSequenceSearchModel.numberingSequenceModels[0].isProjectExists === null) {
        numberingSequenceSearchModel.numberingSequenceModels[0].isProjectExists = false;
        numberingSequenceSearchModel.numberingSequenceModels[0].startOfNoSequence = '0';
      }
      numberingSequenceSearchModel.numberingSequenceModels[0].rfxType = this.rfxType;
      if (this.dataId != "00000000-0000-0000-0000-000000000000") {
        numberingSequenceSearchModel.numberingSequenceModels[0].id = this.numberingSequence[0].id;
      }
      if (this.beforeStartDate != numberingSequenceSearchModel.numberingSequenceModels[0].startDate) {
        numberingSequenceSearchModel.numberingSequenceModels[0].startDate.setMinutes(numberingSequenceSearchModel.numberingSequenceModels[0].startDate.getMinutes() - numberingSequenceSearchModel.numberingSequenceModels[0].startDate.getTimezoneOffset())
      }
      if (this.beforeEndtDate != numberingSequenceSearchModel.numberingSequenceModels[0].endDate) {
        numberingSequenceSearchModel.numberingSequenceModels[0].endDate.setMinutes(numberingSequenceSearchModel.numberingSequenceModels[0].endDate.getMinutes() - numberingSequenceSearchModel.numberingSequenceModels[0].endDate.getTimezoneOffset())
      }
     // this.ValidateExistsDate(numberingSequenceSearchModel.numberingSequenceModels);
      if (!this.isNew) {
        this.neweditText = "Numbering Sequence updated successfully";
      }
     // if(!this.isDateValidate){
      this.numberingSequenceService.createEditNumberingSequence(numberingSequenceSearchModel.numberingSequenceModels).subscribe(result => {
        numberingSequenceSearchModel.numberingSequenceModels = result;
        this.isSaved = false;
        if (result.data.isSuccess) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: this.neweditText,
            showConfirmButton: true
          })
            .then((result) => {
              this.dialogRef.close();
            });
        }
        else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: result.data.responseMessage,
            showConfirmButton: true
          })
            .then((result) => {
            });
        }
      }); 
    /*   }
     else{
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: "Date Range Already Exists",
        showConfirmButton: true
      })
        .then((result) => {
        });
     } */
    }
    else {
      this.isSaved = false;
    }
  }

  doAction() {
    this.dialogRef.close();
  }
ValidateExistsDate(numberingSequenceModels){
  this.numberingSequenceService.ValidateStartDate(numberingSequenceModels).subscribe(result => {
    this.isDateValidate=result
  });
}
}
