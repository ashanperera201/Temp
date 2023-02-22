import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { RfqPartLineAttributeService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attribute.service';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { AddNewLineAttributeOverlay2Component } from '../add-new-line-attribute-overlay2/add-new-line-attribute-overlay2.component';
import { AddNewLineAttributeOverlay3Component } from '../add-new-line-attribute-overlay3/add-new-line-attribute-overlay3.component';
import { AddNewLineAttributeOverlay4Component } from '../add-new-line-attribute-overlay4/add-new-line-attribute-overlay4.component';
import { RFQAttributeItemsComponent } from '../Lines/rfq-part-line/rfq-attribute-items/rfq-attribute-items.component';
import { AddAttrlinelistItemOverlayComponent } from '../add-attrlist-line-item-overlay/add-atttrlist-line-item-overlay.component';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
@Component({
    selector: 'add-att-new-overlay',
    templateUrl: './add-new-line-attribute-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewLineAttributeOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    issuccess = false;
    iserror = false;

    rfqId: string;
    rfqPartLineId: string = "";
    dataAttr: any;
    frmAttribute: FormGroup;
    attributeCategoryList: any = [];
    attributeDataTypeList: any = [];
    detailsDataTypeMap = new Map();

    context: RFQAttributeItemsComponent;
    rfqPartLines: any[];
    attributelist:any;
    NewListId:boolean=false;
    names:any[];
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddNewLineAttributeOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private rfqPartLineService: RfqPartLineService,private attributeService: AttributeService,
        private rfqPartLineAttributeService: RfqPartLineAttributeService,
    ) {
        this.dataAttr = data.id;
        this.rfqId = data.rfqId;
        this.context = data.context;
        this.rfqPartLineId=data.rfqPartLineId;
      //console.log(this.rfqPartLineId);
        if(data.NewList!=null){
            //this.NewListId=data.NewListId;
            this.attributelist=data.NewList
            this.NewListId=true
        }
        this.frmAttribute = this.fb.group({
            'attributeName': [this.dataAttr ? this.dataAttr.attributeName : null, Validators.required],
            'categoryId': [this.dataAttr ? this.dataAttr.attributeCategoryId || this.dataAttr.categoryId : null,Validators.required],
            'description': [this.dataAttr ? this.dataAttr.description : null, Validators.required],
            'dataTypeId': [this.dataAttr ? this.dataAttr.attributeDataTypeId || this.dataAttr.dataTypeId : null,Validators.required],
            'newattributelist': [this.dataAttr ? this.dataAttr.newattributelist : null],
            'rfqId': this.dataAttr ? this.dataAttr.rfxId : this.rfqId,
            'rfqPartLineId': this.rfqPartLineId,
        });
        if(this.NewListId){
            let grptitle=this.attributelist.title;
            this.frmAttribute.patchValue({newattributelist:grptitle})
        }
        this.LoadNames();
    }

    createDataTypeMap() {
        this.attributeDataTypeList && this.attributeDataTypeList.length > 0 && this.attributeDataTypeList.forEach(element => {
            this.detailsDataTypeMap.set(element.id, element)
        });
    }

   /*  fetchRfqPartLineData() {
        this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
            this.rfqPartLines = result.data;
        });
    } */

    fetchAttributeCategoryTypeData() {
        this.rfqPartLineAttributeService.getLineAttributeCategoryType().subscribe(result => {
            this.attributeCategoryList = result.data;
        });
    }

    fetchAttributeDataTypeData() {
        this.rfqPartLineAttributeService.getLineAttributeDataType().subscribe(result => {
            this.attributeDataTypeList = result.data;
            this.createDataTypeMap();
        });
    }

    ngOnInit(): void {
        //this.fetchRfqPartLineData();
        this.fetchAttributeCategoryTypeData();
        this.fetchAttributeDataTypeData();
    }

    onFormSubmit(form: NgForm) {
        if (this.frmAttribute.valid) {
        let attribute: AttributeViewModel = new AttributeViewModel();
        attribute = Object.assign(attribute, form);

        attribute.rfqId = this.dataAttr ? this.dataAttr.rfxId || this.dataAttr.rfqId : this.rfqId;
        attribute.rfqPartLineId = this.frmAttribute.get('rfqPartLineId').value;

        attribute.id = this.dataAttr ? this.dataAttr.attributeId || this.dataAttr.id : '00000000-0000-0000-0000-000000000000';

        attribute.dataTypeName = this.detailsDataTypeMap.get(this.frmAttribute.get('dataTypeId').value).text;
        attribute.dataTypeId = this.frmAttribute.get('dataTypeId').value;

        attribute.categoryId = this.frmAttribute.get('categoryId').value;

        attribute.ifsTableId = this.dataAttr && this.dataAttr.ifsTableId ? this.dataAttr.ifsTableId || this.dataAttr.attributeModel.ifsTableId : undefined;
        attribute.iFSTable1Id = this.dataAttr && this.dataAttr.ifsTable1Id ? this.dataAttr.ifsTable1Id || this.dataAttr.attributeModel.ifsTable1Id : undefined;
        attribute.iFSTable2Id = this.dataAttr && this.dataAttr.ifsTable2Id ? this.dataAttr.ifsTable2Id || this.dataAttr.attributeModel.ifsTable2Id : undefined;
        attribute.format = this.dataAttr && this.dataAttr.format ? this.dataAttr.format || this.dataAttr.attributeModel.format : undefined;

        if (attribute.dataTypeName == "IFS Value List") {

            const dialogIFSValueRef = this.dialog.open(AddNewLineAttributeOverlay3Component, { data: { "attributeData": attribute, "id": attribute.id, "rfqId": attribute.rfqId, "ifsTableId": attribute.ifsTableId, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "context": this.context } });
            dialogIFSValueRef.addPanelClass('inline-md-overlay');
            dialogIFSValueRef.disableClose = true;
            dialogIFSValueRef.afterClosed().subscribe(result => {
            });
        }
        if (attribute.dataTypeName == "Text" || attribute.dataTypeName == "Dropdown List" || attribute.dataTypeName == "Number" || attribute.dataTypeName == "Date") {

            const dialogTextValueRef = this.dialog.open(AddNewLineAttributeOverlay2Component, { data: { "attributeData": attribute, "id": attribute.id, "rfqId": attribute.rfqId, "format": attribute.format, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "context": this.context,"attributeList":this.attributelist,"rfqPartLineId": this.rfqPartLineId } });
            dialogTextValueRef.addPanelClass('inline-md-overlay');
           dialogTextValueRef.disableClose = true;
            dialogTextValueRef.afterClosed().subscribe(result => {
            });
        }
        if (attribute.dataTypeName == "Sql") {

            const dialogIFSValueRef = this.dialog.open(AddNewLineAttributeOverlay4Component, { data: { "attributeData": attribute, "id": attribute.id, "rfqId": attribute.rfqId, "format": attribute.format, "ifsTable1Id": attribute.iFSTable1Id, "ifsTable2Id": attribute.iFSTable2Id, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "context": this.context } });
            dialogIFSValueRef.disableClose = true;
            dialogIFSValueRef.addPanelClass('inline-md-overlay');
            dialogIFSValueRef.afterClosed().subscribe(result => {
            });
        }
        this.dialogRef.close();
    }
}

    doAction() {
        this.dialogRef.close();
    }
    addList(){
        if(!this.NewListId){
        const dialogRef = this.dialog.open(AddAttrlinelistItemOverlayComponent, { data: { "rfqId": this.rfqId,"rfqPartLineId": this.rfqPartLineId } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if(result){
            this.attributelist=result;
            this.frmAttribute.patchValue({newattributelist:result.title})
            //name setValue({name: ‘abc’, age: ‘25’});
            }
        }); 
    }
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