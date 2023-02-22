import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators ,FormsModule,NgForm,FormArray } from '@angular/forms';  
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
 import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import Swal from 'sweetalert2';

@Component({
    selector: 'att-list-add-edit-overlay',
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
    frmAttributeGroup :  FormGroup;
    isDelete = false;
    dataId: any = "";
    attributeGroupViewModel: AttributeGroupViewModel[];
    OverlayText:string="Add New "
    neweditText: string = "Attribute Group saved successfully";
    names:any[];
    EditedName:string="";
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<AddEditOverlayComponent>,
    public dialog: MatDialog,private fb: FormBuilder
    ,private attributeGroupService: AttributeGroupService
    ) {
        this.frmAttributeGroup = this.fb.group({
            'title': [null, Validators.required],
            'name': [null, Validators.required],
            'groupName': [null, Validators.required],
            'isPrivate': [null, Validators.required],
            'isActive': [null, Validators.required]
          })
          this.frmAttributeGroup = this.fb.group({  
            attributeGroupViewModels: this.fb.array([])
          });  
        this.dataId=data.id;
        if(this.dataId!="00000000-0000-0000-0000-000000000000"){
          this.OverlayText ="Edit "
        }
    }
    get attributeGroupViewModels(): FormArray {
      return this.frmAttributeGroup.get("attributeGroupViewModels") as FormArray
    }
    newAttributeList(): FormGroup {
      ////debugger;
  
      return this.fb.group({
        'title': [null, Validators.required],
            'name': [null, Validators.required],
            'groupName': [null, Validators.required],
            'isPrivate': [null, Validators.required],
            'isActive': [null, Validators.required]
      })
    }
    addAttributeList() {
      ////debugger;
      if(this.dataId == "00000000-0000-0000-0000-000000000000")
      {
        if (this.frmAttributeGroup.get('attributeGroupViewModels').invalid) {
          this.frmAttributeGroup.get('attributeGroupViewModels').markAllAsTouched();
          return;
        }
        this.attributeGroupViewModels.push(this.newAttributeList());
      }
    }
    ngOnInit() {
      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
        this.addAttributeList();
      }
      else {
  
        this.attributeGroupService.getAttributeGroupById(this.dataId).subscribe(result => {
         // console.log(result);
          ////debugger;
          this.isDelete = true;
          this.attributeGroupViewModel = [];
          this.attributeGroupViewModel.push(result.data);
          const linesFormArray = this.frmAttributeGroup.get("attributeGroupViewModels") as FormArray;
          linesFormArray.push(this.newAttributeList());
          this.frmAttributeGroup.patchValue({ "attributeGroupViewModels": this.attributeGroupViewModel });
          if(this.attributeGroupViewModel[0].title!=null){
            this.EditedName=this.attributeGroupViewModel[0].title
          }
        });
  
      }
      this.LoadNames();
       }
      onFormSubmit(form:NgForm)  
      {  
        ////debugger;
        //console.log(form);
        this.isSaved=true;
        if (this.frmAttributeGroup.get('attributeGroupViewModels').invalid) {
          this.frmAttributeGroup.get('attributeGroupViewModels').markAllAsTouched();
          this.isSaved=false;
          return;
        }
        let attributeGroupSearchModel: AttributeGroupSearchModel = new AttributeGroupSearchModel();
        attributeGroupSearchModel = Object.assign(attributeGroupSearchModel, form);
        if (this.dataId != "00000000-0000-0000-0000-000000000000") {
          attributeGroupSearchModel.attributeGroupViewModels[0].id = this.attributeGroupViewModel[0].id;
        }
        //debugger;
        this.attributeGroupService.SaveAttributeGroup(attributeGroupSearchModel.attributeGroupViewModels).subscribe(result => {
          this.isSaved=false;
          if (result.success.success == true) {
            Swal.fire({
              icon: 'success',
              title: this.neweditText,
              showConfirmButton: false,
              timer: 1000
            })
          } else {
            
            if(result.success.statusCode=='2601'){
              Swal.fire({
                icon: 'error',
                title: 'Duplicate Attribute Group Title cannot be added',
                showConfirmButton: false,
                timer: 2000
              })
            }
           else{
            Swal.fire({
              icon: 'error',
              title: 'Unable to Add Attribute Group',
              showConfirmButton: false,
              timer: 2000
            })
           }
          }
    
          attributeGroupSearchModel.attributeGroupViewModels = result;
          this.dialogRef.close(true);
        });
      }  
      
      cancel() {      
        this.dialogRef.close(false);
      }

      removeValueAt(index){
        this.attributeGroupViewModels.removeAt(index);
      }
     /*  onNameChange(name: string,item) {
        this.attributeGroupService.GetAttributGroupNameList().subscribe(result => {
            this.names = result.data;
        });
        if (this.names.includes(name)) {
          item.get('title').setErrors({ duplicate: true });
           
            }
        } */
    
 
    onNameInput(name: string,item,) {
      
      if(this.EditedName==name){
        return;
      }
  
    if (this.names.includes(name)) {
      
      item.get('title').setErrors({ duplicate: true });
       
        }
     
      if (this.dataId == "00000000-0000-0000-0000-000000000000") {
     let attrcnt=this.attributeGroupViewModels.value.filter(i=>i.title==name);
     if(attrcnt.length>1){
      item.get('title').setErrors({ duplicate: true });
     }
        }
    }

    LoadNames(){
      this.attributeGroupService.GetAttributGroupNameList().subscribe(result => {
        this.names = result.data;
    });
    }
    } 
    
   
