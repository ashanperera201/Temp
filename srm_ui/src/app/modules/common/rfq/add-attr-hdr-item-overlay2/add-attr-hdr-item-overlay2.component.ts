import { NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { AddNewAttributeOverlayComponent } from '../add-new-attribute-overlay/add-new-attribute-overlay.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { CustomNgxDatetimeAdapter } from './../add-new-attribute-overlay2/CustomNgxDatetimeAdapter';
import { AttributeItemComponent } from 'app/modules/common/rfq/header-component/attribute-item/attribute-item.component';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { RFQHeaderAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attribute-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import Swal from 'sweetalert2';
import { AddAttrHdrItemOverlayComponent } from '../add-attr-hdr-item-overlay/add-attr-hdr-item-overlay.component';

const moment = _rollupMoment || _moment;
//export class CustomeDateTimeAdaptor 
export const MY_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY/DD HH:mm:ss'
    },
    display: {
        dateInput: 'MM/YYYY/DD HH:mm:ss',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    }
};

@Component({
    selector: 'add-attr-hdr-item-overlay2',
    templateUrl: './add-attr-hdr-item-overlay2.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        {
            provide: NgxMatDateAdapter,
            useClass: CustomNgxDatetimeAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: NGX_MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})
export class AddAttrHdrItemOverlay2Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;
    public showSpinners = true;
    public showSeconds = true;
    public enableMeridian = true;
    lblHeading: string;
    lblMaxLenFormat: string;
    attributeData: any;
    dataId: any = "";
    initialDateFormat: any = "";
    addValue: FormGroup;
    attributeViewModel: AttributeViewModel[];
    attributeFormateValueList: any[];
   validateNumberFormat: any = "true";
    validateExpNumberFormat: any = "true";
    validateTextLength: any = "true";
    submitValidation: any = "true";
    initialDataType: any = "";
    ErrorPromptDecimal: string = ": Decimal values only, max. 2 d.p";
    ErrorPromptCurrency: string = ": Decimal values only, max. 2 d.p";
    ErrorPromptText: string = ": Max. character count exceeded";
    attrFormat: any;
    attributeCategoryList: any = [];
    attributeDataTypeList: any = [];
    attributelist:any={};
    validationstring:string="";
    context: AttributeItemComponent;
    isSaved:boolean =false;
    constructor(public dialogRef: MatDialogRef<AddAttrHdrItemOverlay2Component>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data,
        private fb: FormBuilder,
        private attributeService: AttributeService,
        private attributeGroupService: AttributeGroupService,
        private rfqHeaderAttributeService: RfqHeaderAttributeService
    ) {
        
        this.attributeData = data.attributeData;
        this.dataId = data.attributeData.id;
        this.attributeData.rfqId = data.attributeData.rfqId;
       // this.attributeData.categoryId = data.attributeData.categoryId;
        //this.attributeData.dataTypeId = data.attributeData.dataTypeId;
       // this.attrFormat = data.format;
        //this.attributeCategoryList = data.attributeCategoryTypes;
      //  this.attributeDataTypeList = data.attributeDataTypes;
      //  this.attributelist=data.attributeList;
        this.context = data.context;
        //this.attributeFormateValueList=data.context.attributeValueTypes
       
       /*  this.addValue = this.fb.group({
            format: [this.attrFormat ? this.attrFormat : null, Validators.required],
            attributeValues: this.fb.array([])
        });
 */
        if (this.attributeData.dataTypeName == "Text" || this.attributeData.dataTypeName == "Dropdown List") {
            this.lblMaxLenFormat = "Max Length";
            this.lblHeading = "Define Text Values";
        }
        else if (this.attributeData.dataTypeName == "Number") {
            this.lblMaxLenFormat = "Format";
            this.lblHeading = "Define Number Values";
        }
        else if (this.attributeData.dataTypeName == "Date") {
            this.lblMaxLenFormat = "Format";
            this.lblHeading = "Define Date Values";
        } 
    }

    get attributeValues(): FormArray {
        return this.addValue.get("attributeValues") as FormArray
    }

    newTeam(): FormGroup {
        return this.fb.group({
            'attrValue': [null, Validators.required],
            'id': ['00000000-0000-0000-0000-000000000000']
        })
    }

    addValueField() {
        if (this.addValue.get('attributeValues').invalid) {
            this.addValue.get('attributeValues').markAllAsTouched();
            return;
        }
       
        this.attributeValues.push(this.newTeam());
    }
    ngOnInit(){
        
        let formatValues=this.context.attributeValueTypes.filter(i=>i.dataTypeId==this.attributeData.dataTypeId)
        this.attributeFormateValueList=formatValues;
       
              this.addValue = this.fb.group({
            format: [this.attributeData.format, Validators.required],
            expectedValue: [this.attributeData.expectedValue],
            attributeValues: this.fb.array([])
        }); 
        this.addExistingValueField();
     
    } 

    isDecimalValidater(attrval,item) {
        if (!isNaN(Number(attrval))) {
            if((attrval.indexOf("."))>-1){
             if ((attrval.slice(attrval.indexOf(".") + 1).length != 2)) {
                 item.get('attrValue').setErrors({invaliddecimal:true})
             }
             }
             else{
                 item.get('attrValue').setErrors({invaliddecimal:true})
             }
         }
         else{
             item.get('attrValue').setErrors({invalidnumber:true})
         }
      
    }
    isCurrencyvalidater(item) {
        this.validateNumberFormat = true;
        item.forEach(element => {
            if (!Number.isInteger(element.attrValue) && element.attrValue.includes('.')) {
                var code, i, len;
                for (i = 0, len = element.attrValue.length; i < len; i++) {
                    code = element.attrValue.charCodeAt(i);
                    if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                        !(code > 96 && code < 123) ||
                        (code == 46)) { // lower alpha (a-z)
                    }
                }
                

            } else {
                this.validateNumberFormat = false;
            }
        });
    }

    isTextLengthValidater(item, itemLength) {
        this.validateTextLength = true;
      
        if(itemLength.format!=null){
        item.forEach(element => {
            if (element.attrValue.length <= itemLength.format) {

            } else {
                this.validateTextLength = false;
            }
        });
        }
    }
    isNumberValidater(attrval,item) {
        if (isNaN(Number(attrval))) {
            item.get('attrValue').setErrors({invalidnumber:true})
        }
    }
    isNumberValidaterExp(attrval) {
        if (isNaN(Number(attrval))) {
            this.addValue.get('expectedValue').setErrors({invalidnumber:true})
        }
        else{
            this.CheckValue(attrval);
         }
    }
    isDecimalValidaterexp(attrval) {
        if (!isNaN(Number(attrval))) {
            if((attrval.indexOf("."))>-1){
             if ((attrval.slice(attrval.indexOf(".") + 1).length != 2)) {
                this.addValue.get('expectedValue').setErrors({invaliddecimal:true})
             }
             else{
                this.CheckValue(attrval);
             }
             }
             else{
                this.addValue.get('expectedValue').setErrors({invaliddecimal:true})
             }
         }
         else{
            this.addValue.get('expectedValue').setErrors({invalidnumber:true})
         }
      
    }
    onFormSubmit(form: NgForm) {
        this.isSaved =true; 
        if (this.addValue.valid) 
        {
        let attributeViewModel: AttributeViewModel = new AttributeViewModel();
        attributeViewModel = Object.assign(attributeViewModel, form);
       // console.log(attributeViewModel);
        this.attributeData.format=this.addValue.get('format').value
        this.attributeData.attributeValues=this.addValue.get('attributeValues').value
        this.attributeData.expectedValue=this.addValue.get('expectedValue').value

            let dtype=this.attributeData.dataTypeId;
            this.attributeData.attributeDataTypeId=dtype;
            this.attributeData.attributeGroupId=this.attributeData.attributeGroupId;
            this.attributeData.rFXId=this.attributeData.rfqId;
           //console.log(this.attributeData)
            this.rfqHeaderAttributeService.UpdateRFQAttribute([this.attributeData]).subscribe(result => {
                this.dialogRef.close();
                this.context && this.context.fetchRfqHeaderAttributeData(this.attributeData.rfqId);
                this.context.message = "Updated";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            }); 
            
        } 
       
    
    else{
        this.isSaved=false;
    }
 }

   
    selectedFormat(event, editedFormatCheck) {
        // editedFormatCheck checks if selectedFormat is called from the html or the ngOnit method based on whether 1 or 2 is passed
        this.validateNumberFormat = true;
        this.validateTextLength = true;

        if (event.value == "MM/DD/YYYY" || event.format == "MM/DD/YYYY") {
            MY_FORMATS.display.dateInput = 'MM/DD/YYYY HH:mm:ss';
            MY_FORMATS.parse.dateInput = 'MM/DD/YYYY HH:mm:ss';

        } else if (event.value == "DD/MM/YYYY" || event.format == "DD/MM/YYYY") {
            MY_FORMATS.display.dateInput = 'DD/MM/YYYY HH:mm:ss';
            MY_FORMATS.parse.dateInput = 'DD/MM/YYYY HH:mm:ss';

        } else if (event.value == "YYYY/MM/DD" || event.format == "YYYY/MM/DD") {
            MY_FORMATS.display.dateInput = 'YYYY/MM/DD HH:mm:ss';
            MY_FORMATS.parse.dateInput = 'YYYY/MM/DD HH:mm:ss';
        }
        if(this.addValue.get('expectedValue').value!=null){
            this.attributeData.expectedValue = this.addValue.get('expectedValue').value;
        }
        this.attributeData.format = event.value;
        this.attributeData.attributeValues = this.addValue.get('attributeValues').value;
        this.addValue.patchValue(this.attributeData);
    }

    removeValueAt(i) {
        this.attributeValues.removeAt(i);
    }

    returnValidateDecimalNumber() {
        return this.submitValidation;
    }

    GotoAddValueOverlay() {
        this.attributeData.format=this.addValue.get('format').value
        this.attributeData.attributeValues=this.addValue.get('attributeValues').value
        this.attributeData.expectedValue=this.addValue.get('expectedValue').value
       
       const dialogattributeValueRef = this.dialog.open(AddAttrHdrItemOverlayComponent, { data: {"id": this.attributeData, "context": this.context,"isPrev":true  } });
                dialogattributeValueRef.addPanelClass('inline-md-overlay');
                dialogattributeValueRef.disableClose = true;
                dialogattributeValueRef.afterClosed().subscribe(result => {
                });
                this.dialogRef.close();
                     
        
    }

    doAction() {
        this.dialogRef.close();
    }
    //
    
    addval(val): FormGroup {
     
   
        return this.fb.group(val)
     }  
    addExistingValueField() {
          ////debugger;
       if(this.attributeData.attributeValues.length>0){
        this.attributeData.attributeValues.forEach(i=>{
            this.attributeValues.push(this.addval(i));
        })
       }
       
    
    }
    isExpectedValueValid(item) {
        debugger;
        this.validationstring="";
        this.validateExpNumberFormat = true;
        if(this.attributeData.dataTypeName=="Number" && this.attributeData.format=="Decimal"){
        
        if (!isNaN(Number(item))) {
           if((item.indexOf("."))>-1){
            if ((item.slice(item.indexOf(".") + 1).length != 2)) {
                this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
                this.validateExpNumberFormat = false;
            }
            }
            else{
                this.validationstring="Invalid Input: Accepts Decimal values of max. 2 d.p";
                this.validateExpNumberFormat = false;
            }
        }
        else{
            this.validationstring="Invalid Input: Number";
            this.validateExpNumberFormat = false;
        }
    }
    else if(this.attributeData.dataTypeName=="Number"&& this.attributeData.format!="Decimal"){
        if (isNaN(Number(item))) {
            this.validationstring="Invalid Input: Number";
            this.validateExpNumberFormat = false;
        }
    }
    }
    CheckValue(attrval){
        let atrval=this.addValue.get('attributeValues').value 
        if(atrval.length>0){     
            let isExist=atrval.filter(i=>i.attrValue==attrval)
            if(isExist.length==0){
                this.addValue.get('expectedValue').setErrors({invalidexpval:true})
            }
           } 
    }
    CheckValueDate(){
        let atrval=this.addValue.get('attributeValues').value  
        let dval=new Date(this.addValue.get('expectedValue').value)
        if(atrval.length>0){  
           let dtval=this.toDatetimeLocal(dval);   
          
           let isExist=atrval.filter(i=>i.attrValue.includes(dtval))
           if(isExist.length==0){
            this.addValue.get('expectedValue').setErrors({invalidexpval:true})
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