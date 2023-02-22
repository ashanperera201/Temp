import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CostFactorSearchModel } from 'app/main/Models/etendering/cost-factor-search-model';
import { CostFactorService } from 'app/shared/Services/etendering/cost-factor.service';
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';
import Swal from 'sweetalert2';

@Component({
  selector: 'att-add-edit-overlay',
  templateUrl: './add-edit-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AddEditOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  isNew: boolean = true;
  neweditText: string = "Cost factor('s) saved successfully";
  newEditText: string = "Add";
  newEditbuttonText: string = "Save";

  issuccess = false;
  iserror = false;
  frmCostFactorList: FormGroup;
  isDelete = false;
  dataId: any = "";
  costFactors: CostFactorTextViewModel[];//Your Model 
  costFactorTypes: any[];//Your Model 
  names:any[];
  EditedName:string="";
  isSaved:boolean =false;
  constructor(@Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog, private fb: FormBuilder,
    private costFactorService: CostFactorService
  ) {
    this.frmCostFactorList = this.fb.group({
      costFactorTextViewModels: this.fb.array([])
    });
    this.dataId = data.id;
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.isNew = false;
      this.newEditText = "Edit";
      this.newEditbuttonText = "Update";
    }
  }

  get costFactorTextViewModels(): FormArray {
    return this.frmCostFactorList.get("costFactorTextViewModels") as FormArray
  }

  newCostFactor(): FormGroup {
    return this.fb.group({
      'cfName': [null, Validators.required],
      'cfDescription': [null, Validators.required],
      'cfTypeId': [null, Validators.required]
    })
  }

  addCostFactor() {
    if (this.frmCostFactorList.get('costFactorTextViewModels').invalid) {
      this.frmCostFactorList.get('costFactorTextViewModels').markAllAsTouched();
      return;
    }
    this.costFactorTextViewModels.push(this.newCostFactor());
  }

  ngOnInit() {
    this.LoadNames();
    this.costFactorService.getCFById(this.dataId).subscribe(result => {//your service call here
      if (result.data.cfTypeId == "00000000-0000-0000-0000-000000000000") {
        result.data.cfTypeId = null;
      }
      this.isDelete = true;
      this.costFactors = [];
      this.costFactors.push(result.data);
      this.costFactorTypes = result.data.cfTypes;
      const linesFormArray = this.frmCostFactorList.get("costFactorTextViewModels") as FormArray;
      linesFormArray.push(this.newCostFactor());
      this.frmCostFactorList.patchValue({ "costFactorTextViewModels": this.costFactors });
      if(this.costFactors[0].cfName!=null){
        this.EditedName=this.costFactors[0].cfName
      }
    });
  }

  onFormSubmit(form: NgForm) {
    this.isSaved=true;
    if (this.frmCostFactorList.valid) {
      let costFactorSearchModel: CostFactorSearchModel = new CostFactorSearchModel();
      costFactorSearchModel = Object.assign(costFactorSearchModel, form);

      if (this.dataId != "00000000-0000-0000-0000-000000000000") {
        costFactorSearchModel.costFactorTextViewModels[0].id = this.costFactors[0].id;
      }
      if (!this.isNew) {
        this.neweditText = "Cost factor updated successfully";
      }

      this.costFactorService.SaveCF(costFactorSearchModel.costFactorTextViewModels).subscribe(result => {
        if (result.success.success == true) {
          this.isSaved=false;
          Swal.fire({
            icon: 'success',
            title: this.neweditText,
            showConfirmButton: false,
            timer: 1000
          })
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Duplicate Cost Factor Names cannot be added',
            showConfirmButton: false,
            timer: 1000
          })
        }
        costFactorSearchModel.costFactorTextViewModels = result;
        this.dialogRef.close();
      });
    }
    this.isSaved=false;
  }
  doAction() {
    this.dialogRef.close();
  }
  onNameInput(name: string,item,) {
      
    if(this.EditedName==name){
      return;
    }
    if(name.trim().length==0){
      item.get('cfName').setErrors({ invalid: true });
    }
  if (this.names.includes(name)) {
    
    item.get('cfName').setErrors({ duplicate: true });
     
      }
   
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
   let attrcnt=this.costFactorTextViewModels.value.filter(i=>i.title==name);
   if(attrcnt.length>1){
    item.get('cfName').setErrors({ duplicate: true });
   }
      }
  }

  LoadNames(){
    this.costFactorService.GetCostfactorNameList().subscribe(result => {
      this.names = result.data;
  });
  }
  removeValueAt(index){
    this.costFactorTextViewModels.removeAt(index);
  }
}