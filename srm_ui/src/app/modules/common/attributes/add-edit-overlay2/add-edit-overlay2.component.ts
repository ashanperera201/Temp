import { Component, ViewChild,Inject, ViewEncapsulation, Injectable } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, NgForm} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import {AddEditOverlayComponent} from '../add-edit-overlay/add-edit-overlay.component';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import {AttributeItemsComponent} from 'app/modules/common/attributes/attribute-items.component';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import {NgxMatDateAdapter, NgxMatDateFormats,
    NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
    import { NgModule } from '@angular/core';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { result } from 'lodash';
import Swal from 'sweetalert2';


import {
    MomentDateAdapter,
    MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  } from '@angular/material-moment-adapter';
  import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
  } from '@angular/material/core';
import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import { CustomNgxDatetimeAdapter } from './CustomNgxDatetimeAdapter';
import { items } from 'app/mock-api/apps/file-manager/data';
import { CostFactorsModule } from '../../cost-factors/cost-factors.module';

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
    selector: 'att-add-edit-overlay2',
    templateUrl: './add-edit-overlay2.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [
        // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
        // application's root module. We provide it at the component level here, due to limitations of
        // our example generation script.
        {
          provide: NgxMatDateAdapter,
          useClass: CustomNgxDatetimeAdapter,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
    
        { provide: NGX_MAT_DATE_FORMATS, useValue: MY_FORMATS },
      ],
    
})
export class AddEditOverlay2Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    
     public date: moment.Moment;
     public showSpinners = true;
     public showSeconds = true;
     public enableMeridian = true;
    templateData: any = [];
    useremail: string = '';
    selectedId: any = [];
    validateNumberFormat: any = "true";
    validateTextLength: any = "true";
    submitValidation:any="true"
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addValue : FormGroup;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    formFieldHelpers: string[] = [''];
    
    attributeViewModel: AttributeViewModel[];
    dataId: any = "";
    initialDataType: any ="";
    initialDateFormat: any ="";

    attributeData: any;
    inputValueDataId:any="";
    attributeFormateValueList: any[];
    lblMaxLenFormat: string;
    lblHeading: string;
    ErrorPromptDecimal: string=": Decimal values only. Eg. 14.0";
    ErrorPromptCurrency: string=": Decimal values only, max. 2 d.p";
    ErrorPromptText: string=": Max. character count exceeded";
    parentComponent:AttributeItemsComponent;
    neweditText: string = "Attribute Item saved successfully";
    attrFormat: any;
    isSaved:boolean =false;
    constructor(public dialogRef: MatDialogRef<AddEditOverlay2Component>,
                public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,private fb: FormBuilder, private attributeService: AttributeService
    ) {
        ////debugger;
        this.inputValueDataId = data.id;
        this.addValue = this.fb.group({
            format: [null, Validators.required],
           // isIFSValueList: [null, Validators.required],
            attributeValues: this.fb.array([])
          });  
        
        this.initialDataType = data.initialDataType;
        this.attributeData = data.attributeData;
        this.dataId = this.attributeData.attributeModels[0].id;
        this.attributeData.dataTypeName = data.attributeData.attributeModels[0].DataType.text;
        this.attributeData.dataTypeId = data.attributeData.attributeModels[0].DataType.id;
        this.parentComponent=data.attributeListComponent;
        this.attrFormat = data.format;
        this.addValue = this.fb.group({
            format: [this.attrFormat ? this.attrFormat : null, Validators.required],
            attributeValues: this.fb.array([])
        });


        if(this.attributeData.dataTypeName == "Sql")
        {
            
            this.lblMaxLenFormat = "Define sql";
            this.lblHeading = "Define SQL Values";
        } 
        else if(this.attributeData.dataTypeName == "Text" ||this.attributeData.dataTypeName =="Dropdown List")
        {
            this.lblMaxLenFormat = "Max Length";
            this.lblHeading = "Define Text Values";

        }
        else if(this.attributeData.dataTypeName == "Number")
        {
            this.lblMaxLenFormat = "Format";
            this.lblHeading = "Define Number Values";

        }
        else if(this.attributeData.dataTypeName == "Date")
        {
            this.lblMaxLenFormat = "Format";
            this.lblHeading = "Define Date Values";
        }
        ////debugger;


    }
   
    get attributeValues(): FormArray {
        return this.addValue.get("attributeValues") as FormArray
      }
    newTeam(): FormGroup {
        ////debugger;
    
        return this.fb.group({
          'attrValue': [null, Validators.required],
          'id': ['00000000-0000-0000-0000-000000000000']
        })
     }  
    addValueField() {
          ////debugger;
        if (this.addValue.get('attributeValues').invalid) {
          this.addValue.get('attributeValues').markAllAsTouched();
          return;
        }
        this.attributeValues.push(this.newTeam());
    
    }
    ngOnInit() {
        ////debugger;
        
        

        if((this.dataId != "00000000-0000-0000-0000-000000000000") && (this.attributeData.dataTypeName == this.initialDataType)){

            this.attributeService.getAttributeById(this.dataId).subscribe(result =>{
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
        
        ////debugger;
        this.attributeService.GetAttributeFormatValueByDataTypeID(this.attributeData.dataTypeId).subscribe(result =>{
            

            this.attributeFormateValueList = result.data;



        });

        
    }
    isDecimalValidater(item){
        
        this.validateNumberFormat = true;
        ////debugger;
        item.forEach(element => {
            if(!Number.isInteger(element.attrValue) && element.attrValue.includes('.')){
                var code, i, len;
                for (i = 0, len = element.attrValue.length; i < len; i++) {
                    code = element.attrValue.charCodeAt(i);
                    if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                        !(code > 96 && code < 123) ||
                        (code == 46)) { // lower alpha (a-z)
                        
                    }else{
                        this.validateNumberFormat = false;
                    }
                  }

            }else{
                this.validateNumberFormat = false;
            }
        });
        
    }
    isCurrencyvalidater(item){
        
        this.validateNumberFormat = true;
        ////debugger;
        item.forEach(element => {
            if(!Number.isInteger(element.attrValue) && element.attrValue.includes('.')){
                var code, i, len;
                for (i = 0, len = element.attrValue.length; i < len; i++) {
                    code = element.attrValue.charCodeAt(i);
                    if (!(code > 64 && code < 91) && // upper alpha (A-Z)
                        !(code > 96 && code < 123) ||
                        (code == 46)) { // lower alpha (a-z)

                       
                    }
                  }
                  if((element.attrValue.slice(element.attrValue.indexOf(".")+1).length > 2)){
                    this.validateNumberFormat = false;
                   }

            }else{
                this.validateNumberFormat = false;
            }
        });
    }
    isTextLengthValidater(item, itemLength){
        this.validateTextLength = true;
        item.forEach(element => {
            if(element.attrValue.length <= itemLength.format){
                
            }else{
                this.validateTextLength = false;
            }
        });
    }
    
    onFormSubmit(form:NgForm){
       this.isSaved=true;
        let attributeViewModel: AttributeViewModel = new AttributeViewModel();
        attributeViewModel = Object.assign(attributeViewModel, form);
        if(attributeViewModel.format=="Decimal"){
            this.isDecimalValidater(attributeViewModel.attributeValues);
        }else if(attributeViewModel.format=="Currency"){
            this.isCurrencyvalidater(attributeViewModel.attributeValues)
        }else if(attributeViewModel.format=="Percentage"){
            this.isDecimalValidater(attributeViewModel.attributeValues)
        }else if(this.attributeData.attributeModels[0].dataTypeName == "Text" || this.attributeData.attributeModels[0].dataTypeName == "Dropdown List"){
            this.isTextLengthValidater(attributeViewModel.attributeValues, attributeViewModel);
        }
        //if(((this.attributeData.attributeModels[0].dataTypeName != 'Number'&&'Dropdown List') && this.attributeData.attributeModels[0].dataTypeName != "Text")||(this.attributeData.attributeModels[0].dataTypeName == 'Number' && this.validateNumberFormat)|| (this.attributeData.attributeModels[0].dataTypeName == "Text"  && this.validateTextLength)){
        if( this.validateTextLength && this.validateNumberFormat){
            attributeViewModel.categoryId = this.attributeData.attributeModels[0].categoryId;
            attributeViewModel.dataTypeId = this.attributeData.attributeModels[0].dataTypeId;
            attributeViewModel.description = this.attributeData.attributeModels[0].description;
            attributeViewModel.attributeName = this.attributeData.attributeModels[0].attributeName;
            
    
            attributeViewModel.id = this.attributeData.attributeModels[0].id;
        
             this.attributeService.SaveAttribute(attributeViewModel).subscribe(result =>{
                
                this.isSaved=false;
                if (result.success.success == true) {
                    Swal.fire({
                      icon: 'success',
                      title: this.neweditText,
                      showConfirmButton: false,
                      timer: 1000
                    })
             
                  }

                // let titletext="Attribute Item updated successfully";
                // if(attributeViewModel.id =="00000000-0000-0000-0000-000000000000"){
                //     titletext="Attribute Item Added successfully";
                // }
                
                
                this.dialogRef.close();
                this.parentComponent.FetchBasicData();
                /* if(attributeViewModel.id =="00000000-0000-0000-0000-000000000000"){
                this.parentComponent.Message = "Added";
                this.parentComponent.show("successerror");
                }else{
                    this.parentComponent.Message = "Updated";
                    this.parentComponent.show("successerror");
                } */        
            });  
        }else{
           this.submitValidation = false;
           this.isSaved=false;
        }     
    }

    keyPressNumbersWithDecimal(event): boolean {
        ////debugger;
        this.submitValidation = true;
        var charCode = (event.which) ? event.which : event.keyCode;
        if (charCode != 46 && charCode > 31
          && (charCode < 48 || charCode > 57)) {
          event.preventDefault();
          return false;
        }
        return true;
      }
    selectedFormat(event, editedFormatCheck){
        // editedFormatCheck checks if selectedFormat is called from the html or the ngOnit method based on whether 1 or 2 is passed
        this.validateNumberFormat = true; 
        this.validateTextLength = true;
        ////debugger;
       this.attrFormat= event.value;
      // console.log( this.attrFormat);
        if(event.value == "MM/DD/YYYY" || event.format== "MM/DD/YYYY" )
        {
            
        MY_FORMATS.display.dateInput = 'MM/DD/YYYY HH:mm:ss';
        MY_FORMATS.parse.dateInput = 'MM/DD/YYYY HH:mm:ss';

        }else if(event.value == "DD/MM/YYYY" || event.format== "DD/MM/YYYY")
        {
            MY_FORMATS.display.dateInput = 'DD/MM/YYYY HH:mm:ss';
            MY_FORMATS.parse.dateInput = 'DD/MM/YYYY HH:mm:ss';

        }else if(event.value == "YYYY/MM/DD" || event.format== "YYYY/MM/DD")
        {
            MY_FORMATS.display.dateInput = 'YYYY/MM/DD HH:mm:ss';
            MY_FORMATS.parse.dateInput = 'YYYY/MM/DD HH:mm:ss';

        }
        if( this.attributeData.dataTypeName == "Date" && editedFormatCheck == 2){
            this.attributeViewModel[0].format = event.value;
            this.attributeViewModel[0].attributeValues = this.addValue.get('attributeValues').value;
            /* console.log("hi" );
            console.log( this.addValue.get('attributeValues').value); */
            this.addValue.patchValue(this.attributeViewModel[0]);

        }

    }
 
    addTemplate(item, event) {
    }
    removeValueAt(i){
        this.attributeValues.removeAt(i);
    }
    
    returnValidateDecimalNumber(){
        ////debugger;
        return this.submitValidation;
    }

    doAction() {
        this.dialogRef.close();
       // window.location.reload() ;

    }
    GotoAddValueOverlay(){
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
               // this.FetchBasicData();
               const dialogattributeValueRef = this.dialog.open(AddEditOverlayComponent, {data: {"attributeData": this.attributeData, "id":this.attributeData.attributeModels[0].id,  "initialDataType": this.initialDataType, "attributeListComponent":this.parentComponent,"format": this.attrFormat}});
               dialogattributeValueRef.addPanelClass('inline-md-overlay');
               dialogattributeValueRef.disableClose = true;
               dialogattributeValueRef.afterClosed().subscribe(result => {
               });
               this.dialogRef.close();
            }
          })
        ////debugger;
      

    }

    saveTemplate() {
    }


}
