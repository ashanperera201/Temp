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
import { CustomNgxDatetimeAdapter } from './CustomNgxDatetimeAdapter';
import { AttributeItemComponent } from 'app/modules/common/rfq/header-component/attribute-item/attribute-item.component';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { RFQHeaderAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attribute-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

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
    selector: 'att-new-add-overlay2',
    templateUrl: './add-new-attribute-overlay2.component.html',
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
export class AddNewAttributeOverlay2Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    lblHeading: string;
    lblMaxLenFormat: string;
    attributeData: any;
    dataId: any = "";
    initialDateFormat: any = "";
    addValue: FormGroup;
    attributeViewModel: AttributeViewModel[];
    attributeFormateValueList: any[];
    validateNumberFormat: any = "true";
    validateTextLength: any = "true";
    submitValidation: any = "true";
    initialDataType: any = "";
    ErrorPromptDecimal: string = ": Decimal values only. Eg. 14.0";
    ErrorPromptCurrency: string = ": Decimal values only, max. 2 d.p";
    ErrorPromptText: string = ": Max. character count exceeded";
    attrFormat: any;
    attributeCategoryList: any = [];
    attributeDataTypeList: any = [];
    attributelist:any={};

    context: AttributeItemComponent;
    isSaved:boolean =false;
    constructor(public dialogRef: MatDialogRef<AddNewAttributeOverlay2Component>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data,
        private fb: FormBuilder,
        private attributeService: AttributeService,
        private attributeGroupService: AttributeGroupService,
        private rfqHeaderAttributeService: RfqHeaderAttributeService
    ) {
        this.initialDataType = data.initialDataType;
        this.attributeData = data.attributeData;
        this.dataId = data.attributeData.id;
        this.attributeData.rfqId = data.attributeData.rfqId;
        this.attributeData.categoryId = data.attributeData.categoryId;
        this.attributeData.dataTypeId = data.attributeData.dataTypeId;
        this.attrFormat = data.format;
        this.attributeCategoryList = data.attributeCategoryTypes;
        this.attributeDataTypeList = data.attributeDataTypes;
        this.attributelist=data.attributeList;
        this.context = data.context;
        this.addValue = this.fb.group({
            format: [this.attrFormat ? this.attrFormat : null, Validators.required],
            attributeValues: this.fb.array([])
        });

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

    ngOnInit() {

        if ((this.dataId != "00000000-0000-0000-0000-000000000000") && (this.attributeData.dataTypeName == this.initialDataType)) {

            this.attributeService.getAttributeById(this.dataId).subscribe(result => {
                this.attributeViewModel = [];
                this.attributeViewModel.push(result.data);
                this.initialDateFormat = result.data.format;
                for (let line = 0; line < this.attributeViewModel[0].attributeValues.length; line++) {

                    const linesFormArray = this.addValue.get("attributeValues") as FormArray;
                    linesFormArray.push(this.newTeam());
                }
                this.addValue.patchValue(this.attributeViewModel[0]);
                this.selectedFormat(this.addValue.value, 1);

            });
        }

        this.attributeService.GetAttributeFormatValueByDataTypeID(this.attributeData.dataTypeId).subscribe(result => {
            this.attributeFormateValueList = result.data;
        });
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
    isNumberValidater(attrval,item) {
        if (isNaN(Number(attrval))) {
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
                if ((element.attrValue.slice(element.attrValue.indexOf(".") + 1).length > 2)) {
                    this.validateNumberFormat = false;
                }

            } else {
                this.validateNumberFormat = false;
            }
        });
    }

    isTextLengthValidater(item, itemLength) {
        this.validateTextLength = true;
        item.forEach(element => {
            if (element.attrValue.length <= itemLength.format) {

            } else {
                this.validateTextLength = false;
            }
        });
    }

    onFormSubmit(form: NgForm) {
        this.isSaved =true; 
        if (this.addValue.valid) 
        {
        let attributeViewModel: AttributeViewModel = new AttributeViewModel();
        attributeViewModel = Object.assign(attributeViewModel, form);

            attributeViewModel.categoryId = this.attributeData.categoryId;
            attributeViewModel.dataTypeId = this.attributeData.dataTypeId;
            attributeViewModel.description = this.attributeData.description;
            attributeViewModel.attributeName = this.attributeData.attributeName;
            attributeViewModel.rfqId = this.attributeData.rfqId;

            attributeViewModel.id = this.attributeData.id;
            if(this.attributelist==null)
            {  
                const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });   
                 this.attributeService.SaveAttribute(attributeViewModel).subscribe(result => {
                    refference.close();
                    this.saveRFQHeaderNoList(result.data)
                        
                
                }); 
            }
            else{
               
               attributeViewModel.attributeGroupId= this.attributelist.id;
                this.attributeGroupService.SaveRFQAttributeGroupMapping(attributeViewModel).subscribe(

                    result => {
                        //console.log(result);
                        this.saveRFQHeaderList(result.data)
                    
                    });
            }
       }
     else {
        this.isSaved =false; 
   }
    }

    keyPressNumbersWithDecimal(event): boolean {
        this.submitValidation = true;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31
            && (charCode < 48 || charCode > 57)) {
            event.preventDefault();
            return false;
        }
        return true;
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
        Swal.fire(
            {
            title: 'Are you sure?',
            text: "You will lost the data!!!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes!',
            allowOutsideClick: false
             } ).then((result) => {
            if (result.isConfirmed) {
                const dialogattributeValueRef = this.dialog.open(AddNewAttributeOverlayComponent, { data: { "id": this.attributeData, "rfqId": this.attributeData.rfqId, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "format": this.attributeData.format,"context": this.context,"NewList":this.attributeData.NewList } });
                dialogattributeValueRef.addPanelClass('inline-md-overlay');
                dialogattributeValueRef.disableClose = true;
                dialogattributeValueRef.afterClosed().subscribe(result => {
                });
                this.dialogRef.close();
            }
          })
       
    }

    doAction() {
        this.dialogRef.close();
    }
    //
    saveRFQHeaderNoList(attributeresult) {
        let rfqHeaderAttributes: RFQHeaderAttributeModel[] = [];
        let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
        rfqHeaderAttribute.attributeId = attributeresult.id;
        rfqHeaderAttribute.attributeDataTypeId = attributeresult.dataTypeId;
        rfqHeaderAttribute.rFXId = attributeresult.rfqId;
        rfqHeaderAttributes.push(rfqHeaderAttribute);
        
        this.rfqHeaderAttributeService.saveHeaderAttribute(rfqHeaderAttributes).subscribe(result => {
            this.isSaved =false;
           this.dialogRef.close();
                        this.context && this.context.fetchRfqHeaderAttributeData(attributeresult.rfqId);
                        this.context.message = "Added";
                        this.context.show("successerror");
                        setTimeout(() => { this.context.dismiss("successerror") }, 3000);
        });
    }
    saveRFQHeaderList(attributeresult) {
        let rfqHeaderAttributes: RFQHeaderAttributeModel[] = [];
        let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
        rfqHeaderAttribute.attributeId = attributeresult.id;
        rfqHeaderAttribute.attributeGroupId = attributeresult.attributeGroupId;
        rfqHeaderAttribute.attributeDataTypeId = attributeresult.dataTypeId;
        rfqHeaderAttribute.rFXId = attributeresult.rfqId;
        rfqHeaderAttributes.push(rfqHeaderAttribute);
        //console.log(rfqHeaderAttribute);
        this.rfqHeaderAttributeService.saveHeaderAttribute(rfqHeaderAttributes).subscribe(result => {
            this.isSaved =false;
           this.dialogRef.close();
                        this.context && this.context.fetchRfqHeaderAttributeData(attributeresult.rfqId);
                        this.context.message = "Added";
                        this.context.show("successerror");
                        setTimeout(() => { this.context.dismiss("successerror") }, 3000);
        });
    }
    //
}