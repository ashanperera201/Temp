import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { RfqPartLineAttributeService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attribute.service';
import { RFQAttributeItemsComponent } from '../Lines/rfq-part-line/rfq-attribute-items/rfq-attribute-items.component';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import {AddAttrLineItemOverlay2Component} from '../add-attr-line-item-overlay2/add-attr-line-item-overlay2.component';
import { forkJoin } from 'rxjs';

import { result } from 'lodash';
import { fork } from 'child_process';

@Component({
    selector: 'add-attr-line-item-overlay',
    templateUrl: './add-attr-line-item-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddAttrLineItemOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    rfqId: string = "";
    dataAttr: any;
    frmAttribute: FormGroup;
    validateNumberFormat: boolean = true;
    submitValidation: boolean = true;
    datatype:string;
    format:string;
    validationstring:string="";
    context: RFQAttributeItemsComponent;
    isEditable=false;
    names:any[];
    editedname:string="";
    attributeDataTypes: any[];//Your Model 
    datatypeId:any;
    isChange=false;
    orgDataType:string=''
    DataTypeCollection:any[];
    DataFormatCollection:any[];
    DataValueCollection:any[];
    attribute: AttributeViewModel = new AttributeViewModel();
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddAttrLineItemOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,private attributeService: AttributeService,
        private rfqPartLineAttributeService: RfqPartLineAttributeService
    ) {
       // console.log(data);
         this.dataAttr = data.id;
        this.rfqId = data.rfqId;
        this.context = data.context;
       this.datatype=this.dataAttr.dataTypeName;
      // this.format=this.dataAttr.attributeModel.format
       this.attributeDataTypes=data.context.attributeDataTypes
       
        this.editedname=this.dataAttr.attributeName
        if(data.isPrev){
      
           this.attribute.id=this.dataAttr.attributeId;
            this.attribute.attributeName=this.dataAttr.attributeName;
            this.attribute.format=this.dataAttr.format;
            this.attribute.description=this.dataAttr.description;
            //this.attribute.maxLength=this.dataAttr.maxLength;
           
            this.attribute.dataTypeId=this.dataAttr.dataTypeId;
            this.attribute.dataTypeName=this.dataAttr.dataTypeName;
            this.attribute.expectedValue=this.dataAttr.expectedValue;
            this.attribute.rfqId=this.dataAttr.rfqId;
            this.attribute.rfqPartLineId=this.dataAttr.rfqPartLineId;
            this.attribute.attributeValues=this.dataAttr.attributeValues; 
            this.attribute.attributeGroupId=this.dataAttr.attributeGroupId
        }
        else{
          //  console.log(this.dataAttr);
            this.attribute.id=this.dataAttr.attributeId;
            this.attribute.attributeName=this.dataAttr.attributeName;
            this.attribute.format=this.dataAttr.attributes.format;
            this.attribute.description=this.dataAttr.description;
           // this.attribute.maxLength=this.dataAttr.attributeModel.maxLength;
           
            this.attribute.dataTypeId=this.dataAttr.attributeDataTypeId;
            this.attribute.dataTypeName=this.dataAttr.dataTypeName;
            this.attribute.expectedValue=this.dataAttr.expectedValue;
            this.attribute.rfqId=this.dataAttr.rfqId;
            this.attribute.rfqPartLineId=this.dataAttr.rfqPartLineId;
            this.attribute.attributeValues=this.dataAttr.attributeValues; 
            this.attribute.attributeGroupId=this.dataAttr.attributeGroupId

        }
        this.frmAttribute = this.fb.group({
            'attributeName': [ this.attribute.attributeName , Validators.required],
            'description': [this.attribute.description , Validators.required],       
            'dataTypeId': [this.attribute.dataTypeId ,Validators.required],
            'expectedValue': this.attribute.expectedValue,
            'attributeId':  this.attribute.id,
            'format': this.attribute.format,
            'maxLength': this.attribute.maxLength,
            'dataTypeName':  this.attribute.dataTypeName,
            'attributeValues': this.attribute.attributeValues,
           'rfqId': this.attribute.rfqId,
           'rfqPartLineId': this.attribute.rfqPartLineId,
           'attributeGroupId':this.attribute.attributeGroupId
        }); 
        this.LoadNames();
        
    }

    // isExpectedValueValid(item) {
    //     this.validationstring="";
    //     this.validateNumberFormat = true;
    //     if(this.datatype=="Number" && this.format=="Decimal"){
        
    //     /* if (!Number.isInteger(item) && item.includes('.')) {
    //         var code, i, len;
    //         for (i = 0, len = item.length; i < len; i++) {
    //             code = item.charCodeAt(i);
    //             if (!(code > 64 && code < 91) && // upper alpha (A-Z)
    //                 !(code > 96 && code < 123) ||
    //                 (code == 46)) { // lower alpha (a-z) 
    //             }
    //         }
    //         if ((item.slice(item.indexOf(".") + 1).length != 2)) {
    //             this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
    //             this.validateNumberFormat = false;
    //         }
    //     } else {
    //         this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
    //         this.validateNumberFormat = false;
    //     } */
    //     if (!isNaN(Number(item))) {
    //         if ((item.slice(item.indexOf(".") + 1).length != 2)) {
    //             this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
    //             this.validateNumberFormat = false;
    //         }
           
    //     }
    //     else{
    //         this.validationstring="Invalid Input: Number";
    //         this.validateNumberFormat = false;
    //     }
    // }
    // else if(this.datatype=="Number"&& this.format!="Decimal"){
    //     if (!isNaN(Number(item))) {
            
    //         if (item.includes('.')) {
    //             this.validationstring="Invalid Input: Number";
    //             this.validateNumberFormat = false;
    //         }
    //     }
    //     else{
    //         this.validationstring="Invalid Input: Number";
    //         this.validateNumberFormat = false;
    //     }
    // }
    // }

    // keyPressNumbersWithDecimal() {
    //     this.validateNumberFormat = true;
    // }

    onFormSubmit(form: NgForm) {
        if (this.frmAttribute.valid) {
            let attr: AttributeViewModel = new AttributeViewModel();
            attr = Object.assign(attr, form);
          attr.attributeValues=this.attribute.attributeValues;
            
           if (attr.dataTypeName == "Text" || attr.dataTypeName == "Dropdown List" || attr.dataTypeName == "Number" || attr.dataTypeName == "Date") {
           
             const dialogTextValueRef = this.dialog.open(AddAttrLineItemOverlay2Component, { data: { "attributeData":attr,    "context": this.context } });
               dialogTextValueRef.addPanelClass('inline-md-overlay');
               dialogTextValueRef.disableClose = true;
               dialogTextValueRef.afterClosed().subscribe(result => {
                 });  
            }
            
            this.dialogRef.close();
        }
    }
    ChangeType(){
        
        this.attribute.format=null;      
        this.attribute.maxLength=null;
        let dtype = this.attributeDataTypes.filter(i=>i.id==(this.frmAttribute.get('dataTypeId').value))[0].text;
 
      
        this.attribute.dataTypeName=dtype;
        this.attribute.expectedValue=null;
        
        this.attribute.attributeValues=[]; 
     
        this.frmAttribute.patchValue({
            'dataTypeName': dtype,
            'expectedValue': this.attribute.expectedValue,
       
            'format': this.attribute.format,
            'maxLength': this.attribute.maxLength,
          
            'attributeValues': this.attribute.attributeValues
          });
    }
    doAction() {
        this.dialogRef.close();
    }
    onNameInput(name: string) {
     if(this.editedname==name){
        return;
     }
        if (this.names.includes(name)) {
          
            this.frmAttribute.get('attributeName').setErrors({ duplicate: true });
           
            }
         
        }
    
   
        LoadNames(){
            this.attributeService.GetAttributeNameList().subscribe(result => {
              this.names = result.data;
          });
          }
}
