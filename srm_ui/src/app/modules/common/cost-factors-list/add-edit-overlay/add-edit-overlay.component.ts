import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { CostFactorGroupSearchModel } from 'app/main/Models/etendering/cost-factor-group-search-model';
import { CostFactorGroupViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-group-view-model';
import { CostFactorGroupService } from 'app/shared/Services/etendering/cost-factor-group.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'att-list-add-edit-overlay',
  templateUrl: './add-edit-overlay.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AddEditOverlayComponent {
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  frmCostFactorGroup: FormGroup;
  isDelete = false;
  dataId: any = "";
  isNew: boolean = true;
  neweditText: string = "Cost factor List('s) saved successfully";
  newEditText: string = "Add";
  newEditbuttonText: string = "Save";

  costFactorGroupViewModel: CostFactorGroupViewModel[];
  names:any[];
  EditedName:string="";
  isSaved:boolean =false;
  constructor(@Inject(MAT_DIALOG_DATA) public data, public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog, private fb: FormBuilder, private costFactorGroupService: CostFactorGroupService) {
    this.frmCostFactorGroup = this.fb.group({
      'title': [null, Validators.required],
      'name': [null, Validators.required],
      'isPrivate': [null, Validators.required],
    })
    this.frmCostFactorGroup = this.fb.group({
      costFactorGroupModels: this.fb.array([])
    });
    this.dataId = data.id;
    if (this.dataId != "00000000-0000-0000-0000-000000000000") {
      this.isNew = false;
      this.newEditText = "Edit";
      this.newEditbuttonText = "Update";
    }
  }

  get costFactorGroupModels(): FormArray {
    return this.frmCostFactorGroup.get("costFactorGroupModels") as FormArray
  }

  newCostFactorList(): FormGroup {
    return this.fb.group({
      'title': [null, Validators.required],
      'name': [null, Validators.required],
      'isPrivate': [null, Validators.required],
    })
  }

  addCostFactorList() {
    if (this.frmCostFactorGroup.get('costFactorGroupModels').invalid) {
      this.frmCostFactorGroup.get('costFactorGroupModels').markAllAsTouched();
      return;
    }
    this.costFactorGroupModels.push(this.newCostFactorList());
  }

  ngOnInit() {
    this.LoadNames();
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
      this.addCostFactorList();
    }
    else {
      this.costFactorGroupService.getCostFactorGroupById({ "cfgId": this.dataId }).subscribe(result => {
        this.isDelete = true;
        this.costFactorGroupViewModel = [];
        this.costFactorGroupViewModel.push(result.data);
        const linesFormArray = this.frmCostFactorGroup.get("costFactorGroupModels") as FormArray;
        linesFormArray.push(this.newCostFactorList());
        this.frmCostFactorGroup.patchValue({ "costFactorGroupModels": this.costFactorGroupViewModel });
        if(this.costFactorGroupViewModel[0].title!=null){
          this.EditedName=this.costFactorGroupViewModel[0].title
        }
      });
    }
  }

  onFormSubmit(form: NgForm) {
    this.isSaved=true;
    if (this.frmCostFactorGroup.valid) {
      let costFactorGroupSearchModel: CostFactorGroupSearchModel = new CostFactorGroupSearchModel();
      costFactorGroupSearchModel = Object.assign(costFactorGroupSearchModel, form);

      if (this.dataId != "00000000-0000-0000-0000-000000000000") {
        costFactorGroupSearchModel.costFactorGroupModels[0].id = this.costFactorGroupViewModel[0].id;
      }

      if (!this.isNew) {
        this.neweditText = "Cost factor List updated successfully";
      }

      this.costFactorGroupService.SaveCostFactorGroup(costFactorGroupSearchModel.costFactorGroupModels).subscribe(result => {
        if (result.success.success == true) {
          this.isSaved=false;
          Swal.fire({
            icon: 'success',
            title: this.neweditText,
            showConfirmButton: false,
            timer: 1000
          })
        } 
        costFactorGroupSearchModel.costFactorGroupModels = result;
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
  item.get('title').setErrors({ invalid: true });
}
  if (this.names.includes(name)) {
    
    item.get('title').setErrors({ duplicate: true });
     
      }
   
    if (this.dataId == "00000000-0000-0000-0000-000000000000") {
   let attrcnt=this.costFactorGroupModels.value.filter(i=>i.title==name);
   if(attrcnt.length>1){
    item.get('title').setErrors({ duplicate: true });
   }
      }
  }

  LoadNames(){
    this.costFactorGroupService.GetCostfactorGroupNameList().subscribe(result => {
      this.names = result.data;
  });
  }
  removeValueAt(index){
    this.costFactorGroupModels.removeAt(index);
  }
}
