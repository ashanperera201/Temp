import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { NumberingSequenceSearchModel } from 'app/main/Models/etendering/numbering-sequence-search-model';
import { NumberingSequenceViewModel } from 'app/main/Models/etendering/ViewModels/numbering-sequence-view-model';
import { NumberingSequenceService } from 'app/shared/Services/etendering/numbering-sequence.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'att-add-edit-overlay',
  templateUrl: './add-edit-overlay.component.html',
  encapsulation: ViewEncapsulation.None
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

  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private numberingSequenceService: NumberingSequenceService) {
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
    return this.fb.group({
      'startNumber': [null, Validators.required],
      'isProjectExists': [null, Validators.required],
      'startDate': [null, Validators.required],
      'endDate': [null, Validators.required],
    })
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
    if (this.sequenceList.valid) {
      let numberingSequenceSearchModel: NumberingSequenceSearchModel = new NumberingSequenceSearchModel();
      numberingSequenceSearchModel = Object.assign(numberingSequenceSearchModel, form);
      if (numberingSequenceSearchModel.numberingSequenceModels.length > 0 && numberingSequenceSearchModel.numberingSequenceModels[0].isProjectExists === null) {
        numberingSequenceSearchModel.numberingSequenceModels[0].isProjectExists = false;
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

      if (!this.isNew) {
        this.neweditText = "Numbering Sequence updated successfully";
      }
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
    }
  }

  doAction() {
    this.dialogRef.close();
  }

}
