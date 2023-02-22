import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { AddNewAttributeOverlayComponent } from '../add-new-attribute-overlay/add-new-attribute-overlay.component';
import { AttributeItemComponent } from 'app/modules/common/rfq/header-component/attribute-item/attribute-item.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
    selector: 'add-overlay3',
    templateUrl: './add-new-attribute-overlay3.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewAttributeOverlay3Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'value', 'description'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    issuccess = false;
    iserror = false;

    iFSTableList: any = [];
    iFSValue: any[];
    selectedIFSValue: any[];
    filteredIFSValue: any[];
    selectedIFSTable: any;
    iFSData: FormGroup;
    attributeData: any;
    dataId: any = "";
    selectedIFSTableId: any = "";
    attributeViewModel: AttributeViewModel[];
    attributeCategoryList: any = [];
    attributeDataTypeList: any = [];

    context: AttributeItemComponent;

    constructor(public dialogRef: MatDialogRef<AddNewAttributeOverlay3Component>,
        public dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data,
        private fb: FormBuilder,
        private attributeService: AttributeService
    ) {
        this.iFSData = this.fb.group({
            category: [null, Validators.required],
            ifsValues: this.fb.array([])
        });
        this.attributeData = data.attributeData;
        this.dataId = this.attributeData.id;
        this.attributeCategoryList = data.attributeCategoryTypes;
        this.attributeDataTypeList = data.attributeDataTypes;
        this.context = data.context;
    }

    doAction() {
        this.dialogRef.close();
    }

    ngOnInit() {
        this.attributeService.GetIFSTable().subscribe(result => {
            this.iFSTableList = result.data;
        });
        if (this.dataId != "00000000-0000-0000-0000-000000000000") {

            this.attributeService.getAttributeById(this.dataId).subscribe(result => {
                this.attributeViewModel = [];
                this.attributeViewModel.push(result.data);
                this.selectedIFSValue = this.attributeViewModel[0].attributeValues;
                this.selectedIFSTableId = this.attributeViewModel[0].ifsTableId;

                this.selectedIFSTable = this.iFSTableList.find(ifsTableValue => ifsTableValue.id == this.selectedIFSTableId);
                this.categorySelection();
            });
        }
        else { }
    }

    getIFSTable() {
        this.attributeService.GetIFSTable().subscribe(result => {
            this.iFSTableList = result.data;
        });
    }

    categorySelection() {
        //Category has been selected, fetch IFSValues for respective ID
        this.attributeService.GetIFSValue(this.selectedIFSTable.id).subscribe(result => {
            this.iFSValue = result.data;
            this.iFSValue = this.iFSValue.filter(value => {
                return value.attrValue = value.value, value.iFSValueId = value.id;
            });

            this.validateIsChecked();
        });
    }

    addSelection() {
        let attributeViewModel: AttributeViewModel = new AttributeViewModel();

        if (this.dataId != "00000000-0000-0000-0000-000000000000") {
            this.filteredIFSValue = this.iFSValue.filter(x => !this.selectedIFSValue.some(y => y.attrValue.includes(x.attrValue)) && x.isChecked == true);

            // Add new chekced rows to selectedIFSValue array
            for (var i = 0; i < this.filteredIFSValue.length; i++) {
                this.selectedIFSValue.push({ attrValue: this.filteredIFSValue[i].value, ifsValueId: this.filteredIFSValue[i].id, id: "00000000-0000-0000-0000-000000000000" });
            }
            //Removes unchecked rows from selctedIFSValue array
            this.selectedIFSValue = this.selectedIFSValue.filter(x => this.iFSValue.some(y => y.attrValue.includes(x.attrValue) && y.isChecked == true));

            attributeViewModel.attributeValues = this.selectedIFSValue;

        } else {
            attributeViewModel.attributeValues = this.iFSValue.filter(value => {
                return value.attrValue = value.value, value.iFSValueId = value.id, value.id = "00000000-0000-0000-0000-000000000000";
            }).filter(value => value.isChecked);
            attributeViewModel.attributeValues
        }

        attributeViewModel.categoryId = this.attributeData.categoryId;
        attributeViewModel.dataTypeId = this.attributeData.dataTypeId;
        attributeViewModel.description = this.attributeData.description;
        attributeViewModel.attributeName = this.attributeData.attributeName;
        attributeViewModel.ifsTableId = this.selectedIFSTable.id;
        attributeViewModel.rfqId = this.attributeData.rfqId;

        attributeViewModel.id = this.attributeData.id;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
        this.attributeService.SaveAttribute(attributeViewModel).subscribe(result => {
            refference.close();
            this.dialogRef.close();
            this.context && this.context.fetchRfqHeaderAttributeData(result.data.rfqId);

            if (attributeViewModel.id == "00000000-0000-0000-0000-000000000000") {
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            } else {
                this.context.message = "Updated";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            }
        });
    }

    validateIsChecked() {
        this.iFSValue.forEach(value => {
            if (this.selectedIFSValue && this.selectedIFSValue.length > 0) {
                for (var i = 0; i < this.selectedIFSValue.length; i++) {
                    if (this.selectedIFSValue[i].ifsValueId == value.id) {
                        value.isChecked = true;
                    }
                }
            }
        });
    }

    GotoAddValueOverlay() {
        this.attributeData.ifsTableId = this.selectedIFSTable.id;
        const dialogattributeValueRef = this.dialog.open(AddNewAttributeOverlayComponent, { data: { "id": this.attributeData, "rfqId": this.attributeData.rfqId, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "ifsTableId": this.attributeData.ifsTableId } });
        dialogattributeValueRef.addPanelClass('inline-md-overlay');
        dialogattributeValueRef.afterClosed().subscribe(result => {
        });
        this.dialogRef.close();
    }
}