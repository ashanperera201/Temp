import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AddNewAttributeOverlay2Component } from '../add-new-attribute-overlay2/add-new-attribute-overlay2.component';
import { AddNewAttributeOverlay3Component } from '../add-new-attribute-overlay3/add-new-attribute-overlay3.component';
import { AddNewAttributeOverlay4Component } from '../add-new-attribute-overlay4/add-new-attribute-overlay4.component';
import { AttributeItemComponent } from 'app/modules/common/rfq/header-component/attribute-item/attribute-item.component';
import { AddAttrlistItemOverlayComponent } from '../add-attrlist-item-overlay/add-atttrlist-item-overlay.component';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
@Component({
    selector: 'add-att-new-overlay',
    templateUrl: './add-new-attribute-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewAttributeOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    rfqId: string;
    dataAttr: any;
    frmAttribute: FormGroup;
    attributeCategoryList: any = [];
    attributeDataTypeList: any = [];
    detailsDataTypeMap = new Map();

    context: AttributeItemComponent;
    attributelist:any;
    NewListId:boolean=false;
    names:any[];
    
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddNewAttributeOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,private attributeService: AttributeService,
        private rfqHeaderAttributeService: RfqHeaderAttributeService,
    ) {
        this.dataAttr = data.id;
        this.rfqId = data.rfqId;
        this.context = data.context;   
        if(data.NewList!=null){
            //this.NewListId=data.NewListId;
            this.attributelist=data.NewList
            this.NewListId=true
        }
        this.LoadNames();
    }

    createDataTypeMap() {
        this.attributeDataTypeList && this.attributeDataTypeList.length > 0 && this.attributeDataTypeList.forEach(element => {
            this.detailsDataTypeMap.set(element.id, element)
        });
    }

    fetchAttributeCategoryTypeData() {
        this.rfqHeaderAttributeService.getHeaderAttributeCategoryType().subscribe(result => {
          
            this.attributeCategoryList = result.data;
           // console.log(this.attributeCategoryList);
        });
    }

    fetchAttributeDataTypeData() {
        this.rfqHeaderAttributeService.getHeaderAttributeDataType().subscribe(result => {
           
            this.attributeDataTypeList = result.data;
            //console.log(this.attributeDataTypeList);
            this.createDataTypeMap();
        });
    }

    ngOnInit(): void {
      
        this.fetchAttributeCategoryTypeData();
        this.fetchAttributeDataTypeData();
        this.frmAttribute = this.fb.group({
            'attributeName': [this.dataAttr ? this.dataAttr.attributeName : null, Validators.required],
            'categoryId': [this.dataAttr ? this.dataAttr.attributeCategoryId || this.dataAttr.categoryId : null,Validators.required],
            'description': [this.dataAttr ? this.dataAttr.description : null, Validators.required],
            'dataTypeId': [this.dataAttr ? this.dataAttr.attributeDataTypeId || this.dataAttr.dataTypeId : null,Validators.required],
            'newattributelist': [this.dataAttr ? this.dataAttr.newattributelist : null],
            'rfqId': this.dataAttr ? this.dataAttr.rfxId : this.rfqId,
        }); 
        if(this.NewListId){
            let grptitle=this.attributelist.title;
            this.frmAttribute.patchValue({newattributelist:grptitle})
        }
    }

    onFormSubmit(form: NgForm) {
        if (this.frmAttribute.valid) {
        let attribute: AttributeViewModel = new AttributeViewModel();
        attribute = Object.assign(attribute, form);
        attribute.rfqId = this.dataAttr ? this.dataAttr.rfxId || this.dataAttr.rfqId : this.rfqId;
        attribute.id = this.dataAttr ? this.dataAttr.attributeId || this.dataAttr.id : '00000000-0000-0000-0000-000000000000';

        attribute.dataTypeName = this.detailsDataTypeMap.get(this.frmAttribute.get('dataTypeId').value).text;
        attribute.dataTypeId = this.frmAttribute.get('dataTypeId').value;

        attribute.categoryId = this.frmAttribute.get('categoryId').value;

        attribute.ifsTableId = this.dataAttr && this.dataAttr.ifsTableId ? this.dataAttr.ifsTableId || this.dataAttr.attributeModel.ifsTableId : undefined;
        attribute.iFSTable1Id = this.dataAttr && this.dataAttr.ifsTable1Id ? this.dataAttr.ifsTable1Id || this.dataAttr.attributeModel.ifsTable1Id : undefined;
        attribute.iFSTable2Id = this.dataAttr && this.dataAttr.ifsTable2Id ? this.dataAttr.ifsTable2Id || this.dataAttr.attributeModel.ifsTable2Id : undefined;
        attribute.format = this.dataAttr && this.dataAttr.format ? this.dataAttr.format || this.dataAttr.attributeModel.format : undefined;

        if (attribute.dataTypeName == "IFS Value List") {

            const dialogIFSValueRef = this.dialog.open(AddNewAttributeOverlay3Component, { data: { "attributeData": attribute, "id": attribute.id, "rfqId": attribute.rfqId, "ifsTableId": attribute.ifsTableId, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "context": this.context } });
            dialogIFSValueRef.addPanelClass('inline-md-overlay');
            //dialogIFSValueRef.close();
            dialogIFSValueRef.afterClosed().subscribe(result => {
            });
        }
        if (attribute.dataTypeName == "Text" || attribute.dataTypeName == "Dropdown List" || attribute.dataTypeName == "Number" || attribute.dataTypeName == "Date") {
            
            const dialogTextValueRef = this.dialog.open(AddNewAttributeOverlay2Component, { data: { "attributeData": attribute, "id": attribute.id, "rfqId": attribute.rfqId, "format": attribute.format, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "context": this.context,"attributeList":this.attributelist } });
            dialogTextValueRef.addPanelClass('inline-md-overlay');
            dialogTextValueRef.disableClose = true;
            dialogTextValueRef.afterClosed().subscribe(result => {
            });
        }
        if (attribute.dataTypeName == "Sql") {

            const dialogIFSValueRef = this.dialog.open(AddNewAttributeOverlay4Component, { data: { "attributeData": attribute, "id": attribute.id, "rfqId": attribute.rfqId, "format": attribute.format, "ifsTable1Id": attribute.iFSTable1Id, "ifsTable2Id": attribute.iFSTable2Id, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "context": this.context } });
            dialogIFSValueRef.addPanelClass('inline-md-overlay');
           // dialogIFSValueRef.close();
            dialogIFSValueRef.afterClosed().subscribe(result => {
            });
        }
        this.dialogRef.close();
    }
    }
    addList(){
        if(!this.NewListId){
        const dialogRef = this.dialog.open(AddAttrlistItemOverlayComponent, { data: { "rfqId": this.rfqId } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if(result){
               // console.log(result);
            this.attributelist=result;
            this.frmAttribute.patchValue({newattributelist:result.title})
            //name setValue({name: ‘abc’, age: ‘25’});
            }
        }); 
    }
    }
    doAction() {
        this.dialogRef.close();
    }

    onNameInput(name: string) {
      
  
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