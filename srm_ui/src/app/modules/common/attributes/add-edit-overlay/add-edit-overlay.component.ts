import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl,FormBuilder, FormGroup, Validators ,FormsModule,NgForm,FormArray } from '@angular/forms';  
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
// import { CollaborationTeamService } from '../../../../services/collaboration-team.service';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import {AttributeItemsComponent} from 'app/modules/common/attributes/attribute-items.component';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import {AddEditOverlay2Component} from '../add-edit-overlay2/add-edit-overlay2.component';
import {AddEditOverlay3Component} from '../add-edit-overlay3/add-edit-overlay3.component';
import { AddEditOverlay4Component } from '../add-edit-overlay4/add-edit-overlay4.component';
import { result } from 'lodash';

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
  initialDataType: any ="";
  attributeData: any;
  frmAttributeForm :  FormGroup;
  attributeViewModel: AttributeViewModel[];
  attributeDataTypes: any[];//Your Model 
  attributeCatagoryTypes: any[];//Your Model 
  selectedDataType: any;
  selectedDataTypeId: any = "";
  parentComponent:AttributeItemsComponent;
  OverlayText:string="Add New "
  names:any[];
EditedName:string="";
format:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data,public dialogRef: MatDialogRef<AddEditOverlayComponent>,
              public dialog: MatDialog,private fb: FormBuilder, private attributeService: AttributeService,
              
  ) {
      this.frmAttributeForm = this.fb.group({
        attributeModels: this.fb.array([])
        });
        ////debugger;
      this.dataId= data.id;
      this.initialDataType = data.initialDataType;
      this.attributeData = data.attributeData;
      this.parentComponent=data.attributeListComponent;
    //  console.log(this.data);
      if(this.dataId!="00000000-0000-0000-0000-000000000000"){
        this.OverlayText ="Edit "
      }
      
  }

  get attributeModels(): FormArray{
    return this.frmAttributeForm.get("attributeModels") as FormArray
  }
  newAttribute(): FormGroup{
    return this.fb.group({
      'attributeName': [null, Validators.required],
      'description': [null, Validators.required],
      'categoryId': [null, Validators.required],
      'fieldTypeId': [null],
      'DataType': [null, Validators.required],
    })
  }
  addAttribute(){
    if(this.frmAttributeForm.get('attributeModels').invalid){
      this.frmAttributeForm.get('attributeModels').markAllAsTouched();
      return;
    }
    this.attributeModels.push(this.newAttribute());
  }

  ngOnInit() {
    this.LoadNames();
   // console.log(this.data.attributeData)
      if (this.data.attributeData != null) {      
        this.attributeService.getAttributeById(this.dataId).subscribe(result =>{
        this.isDelete = true;
        this.attributeViewModel = [];
        
        this.attributeViewModel.push(this.attributeData.attributeModels[0]);
        this.attributeDataTypes = result.data.attributeDataTypeList;
        this.selectedDataTypeId = this.attributeData.attributeModels[0].dataTypeId;
        
        this.selectedDataType = this.attributeDataTypes.find(value => value.id == this.selectedDataTypeId);
        this.attributeCatagoryTypes = result.data.attributeCategoryList;

        this.attributeViewModel[0].DataType = this.selectedDataType;

        const linesFormArray = this.frmAttributeForm.get("attributeModels") as FormArray;
        linesFormArray.push(this.newAttribute());
        this.frmAttributeForm.patchValue({"attributeModels": this.attributeViewModel});
        
      });
      }
      else {
        ////debugger;
        this.attributeService.getAttributeById(this.dataId).subscribe(result =>{
          this.isDelete = true;
          this.attributeViewModel = [];
          
          this.attributeViewModel.push(result.data);
          this.attributeDataTypes = result.data.attributeDataTypeList;
          this.selectedDataTypeId = result.data.dataTypeId;
          this.selectedDataType = this.attributeDataTypes.find(value => value.id == this.selectedDataTypeId);
          this.attributeCatagoryTypes = result.data.attributeCategoryList;
          
          this.attributeViewModel[0].DataType = this.selectedDataType;
          
          const linesFormArray = this.frmAttributeForm.get("attributeModels") as FormArray;
          linesFormArray.push(this.newAttribute());
          this.frmAttributeForm.value.attributeModels[0].description = "Check";
          this.frmAttributeForm.patchValue({"attributeModels": this.attributeViewModel});
          this.frmAttributeForm.value.attributeModels[0].description = "Check";
          if(this.attributeViewModel[0].attributeName!=null){
            this.EditedName=this.attributeViewModel[0].attributeName;
          }
        });

  
      }
     
     }
    onFormSubmit(form:NgForm)  
    {        
      if (this.frmAttributeForm.valid) {
      let attributeSearchModel: AttributeSearchModel = new AttributeSearchModel();
      attributeSearchModel = Object.assign(attributeSearchModel, form);
      attributeSearchModel.attributeModels[0].dataTypeId = attributeSearchModel.attributeModels[0].DataType.id;
      attributeSearchModel.attributeModels[0].dataTypeName = attributeSearchModel.attributeModels[0].DataType.text;
      attributeSearchModel.attributeModels[0].id = this.dataId;
      this.format = this.data && this.data.format ? this.data.format || this.data.format : undefined;
      if( attributeSearchModel.attributeModels[0].dataTypeName == "IFS Value List"){
        
      const dialogattributeValueRef = this.dialog.open(AddEditOverlay3Component, {data: {"attributeData": attributeSearchModel, "attributeListComponent":this.parentComponent}});
      dialogattributeValueRef.addPanelClass('inline-md-overlay');
      dialogattributeValueRef.disableClose = true;
      dialogattributeValueRef.afterClosed().subscribe(result => {
      });
      }else if(attributeSearchModel.attributeModels[0].dataTypeName == "Sql"){
      const dialogattributeValueRef = this.dialog.open(AddEditOverlay4Component, {data: {"attributeData": attributeSearchModel, "attributeListComponent":this.parentComponent}});
      dialogattributeValueRef.addPanelClass('inline-md-overlay');
      dialogattributeValueRef.disableClose = true;
      dialogattributeValueRef.afterClosed().subscribe(result => {
      });
      }else{       
      const dialogattributeValueRef = this.dialog.open(AddEditOverlay2Component, {data: {"attributeData": attributeSearchModel,  "initialDataType": this.initialDataType, "attributeListComponent":this.parentComponent,"format": this.format}});
      dialogattributeValueRef.addPanelClass('inline-md-overlay');
      dialogattributeValueRef.disableClose = true;
      dialogattributeValueRef.afterClosed().subscribe(result => {
      });
      }
      //const dialogattributeValueRef = this.dialog.open(AddEditOverlay2Component, {data: {"attributeData": attributeSearchModel}});
      
      this.dialogRef.close();
   
    }  
  }

  doAction() {
      this.dialogRef.close();
      //window.location.reload() ;

  }
  
  onNameInput(name: string,item,) {
      if(this.EditedName==name){
        return;
      }
  
    if (this.names.includes(name)) {
      
      item.get('attributeName').setErrors({ duplicate: true });
       
        }
     
    
    }

    LoadNames(){
      this.attributeService.GetAttributeNameList().subscribe(result => {
        this.names = result.data;
    });
    }


}
