import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AttributeItemComponent } from '../header-component/attribute-item/attribute-item.component';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
@Component({
    selector: 'edit-att-new-overlay',
    templateUrl: './edit-new-attribute-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class EditNewAttributeOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    rfqId: string = "F1E764E6-DD24-476C-B516-08D95FA0983A";
    dataAttr: any;
    frmAttribute: FormGroup;
    validateNumberFormat: boolean = true;
    submitValidation: boolean = true;
    datatype:string;
    format:string;
    validationstring:string="";
    context: AttributeItemComponent;
    isEditable=false;
    names:any[];
    editedname:string="";
    attvalues:any[]
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<EditNewAttributeOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,private attributeService: AttributeService,
        private rfqHeaderAttributeService: RfqHeaderAttributeService,
    ) {
        this.dataAttr = data.id;
        this.rfqId = data.rfqId;
        this.context = data.context;
       this.datatype=this.dataAttr.dataTypeName;
       this.format=this.dataAttr.attributeModel.format
       this.attvalues=this.dataAttr.attributeValues;
       if(this.datatype=='Text' && this.format==null){
        this.format='250';
    }
        if(this.dataAttr.attributeModel.rfqId==null){
            this.isEditable= true
        }
        this.editedname=this.dataAttr.attributeName
        this.frmAttribute = this.fb.group({
            'attributeName': [this.dataAttr ? this.dataAttr.attributeName : null, Validators.required],
            'description': [this.dataAttr ? this.dataAttr.description : null, Validators.required],
            'expectedValue': [this.dataAttr ? this.dataAttr.expectedValue : null, Validators.required],
        });
        this.LoadNames();
    }

    isExpectedValueValid(item) {
        this.validationstring="";
        this.validateNumberFormat = true;
        if(this.datatype=="Number" && this.format=="Decimal"){
        
        /* if (!Number.isInteger(item) && item.includes('.')) {
            var code, i, len;
            for (i = 0, len = item.length; i < len; i++) {
                code = item.charCodeAt(i);
                if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                    !(code > 96 && code < 123) ||
                    (code == 46)) { // lower alpha (a-z) 
                }
            }
            if ((item.slice(item.indexOf(".") + 1).length != 2)) {
                this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
                this.validateNumberFormat = false;
            }
        } else {
            this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
            this.validateNumberFormat = false;
        } */
        if (!isNaN(Number(item))) {
            if ((item.slice(item.indexOf(".") + 1).length != 2)) {
                this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
                this.validateNumberFormat = false;
            }
           
        }
        else{
            this.validationstring="Invalid Input: Number";
            this.validateNumberFormat = false;
        }
    }
    else if(this.datatype=="Number"&& this.format!="Decimal"){
        if (!isNaN(Number(item))) {
            
            if (item.includes('.')) {
                this.validationstring="Invalid Input: Number";
                this.validateNumberFormat = false;
            }
        }
        else{
            this.validationstring="Invalid Input: Number";
            this.validateNumberFormat = false;
        }
    }
    }

    keyPressNumbersWithDecimal() {
        this.validateNumberFormat = true;
    }

    onFormSubmit(form: NgForm) {
        if (this.frmAttribute.valid) {
           
        let attribute: AttributeViewModel = new AttributeViewModel();
        attribute = Object.assign(attribute, form);

        

         
            this.dataAttr.attributeName = attribute.attributeName;
            this.dataAttr.description = attribute.description;
            this.dataAttr.expectedValue = attribute.expectedValue;
            this.dataAttr.isAttributeBasicDataSave = true;
           
            this.rfqHeaderAttributeService.saveHeaderAttribute([this.dataAttr]).subscribe(result => {
                this.dialogRef.close();
                this.context && this.context.fetchRfqHeaderAttributeData(this.rfqId);
                this.context.message = "Updated";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
       
        

    }
    }
CheckValue(attrval){
    console.log(attrval);
    if(this.attvalues.length>0){     
        let isExist=this.attvalues.filter(i=>i.attrValue==attrval)
        if(isExist.length==0){
            this.frmAttribute.get('expectedValue').setErrors({invalidexpval:true})
        }
       } 
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

        isDecimalValidater(attrval,item) {
            if (!isNaN(Number(attrval))) {
                if((attrval.indexOf("."))>-1){
                 if ((attrval.slice(attrval.indexOf(".") + 1).length != 2)) {
                    this.frmAttribute.get('expectedValue').setErrors({invaliddecimal:true})
                 }
                 else{
                    this.CheckValue(attrval);
                 }
                 }
                 else{
                    this.frmAttribute.get('expectedValue').setErrors({invaliddecimal:true})
                 }
             }
             else{
                this.frmAttribute.get('expectedValue').setErrors({invalidnumber:true})
             }
          
        }
        isNumberValidater(attrval,item) {
            if (isNaN(Number(attrval))) {
                this.frmAttribute.get('expectedValue').setErrors({invalidnumber:true})
            }
            else{
                this.CheckValue(attrval);
             }
        }

        CheckValueDate(attrval){
            
             if(this.attvalues.length>0){  
                let dtval=this.toDatetimeLocal(attrval);   
                console.log(dtval);
                console.log(this.attvalues);
                let isExist=this.attvalues.filter(i=>i.attrValue.includes(dtval))
                if(isExist.length==0){
                    this.frmAttribute.get('expectedValue').setErrors({invalidexpval:true})
                }
               } 
        }  
        toDatetimeLocal(date) {
            var ten = function (i) {
                return (i < 10 ? '0' : '') + i;
            },
                YYYY = date.getFullYear(),
                MM = ten(date.getMonth() + 1),
                DD = ten(date.getDate()),
                HH = ten(date.getHours()),
                II = ten(date.getMinutes()),
                SS = ten(date.getSeconds())
                ;
            return YYYY + '-' + MM + '-' + DD 
        };  
}