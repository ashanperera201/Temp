import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { AddNewAttributeOverlayComponent } from '../add-new-attribute-overlay/add-new-attribute-overlay.component';
import { AttributeItemComponent } from 'app/modules/common/rfq/header-component/attribute-item/attribute-item.component';
import { EditorChangeContent, EditorChangeSelection } from 'ngx-quill';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
    selector: 'add-overlay3',
    templateUrl: './add-new-attribute-overlay4.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddNewAttributeOverlay4Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['code', 'description', 'uniqueID'];
    displayedColumns2: string[] = ['id', 'code'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    iFSTable1: any[];
    iFSTable2: any[];
    results: any[];
    selectedValue: any[];
    sqlQueryResult: string;
    iFSTableList: any = [];
    attributeData: any;
    dataId: any = "";
    selectedTable: any;
    attributeViewModel: AttributeViewModel[];
    selectedTableId: any = "";
    type: string = "";
    sqlForm: FormGroup;

    issuccess = false;
    iserror = false;

    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            ['link', 'image', 'video']                         // link and image, video
        ]
    };

    attrFormat: any;
    attributeCategoryList: any = [];
    attributeDataTypeList: any = [];
    context: AttributeItemComponent;

    constructor(public dialogRef: MatDialogRef<AddNewAttributeOverlay4Component>,
        public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data, private fb: FormBuilder,
        private attributeService: AttributeService
    ) {
        this.attributeData = data.attributeData;
        this.dataId = this.attributeData.id;
        this.attributeCategoryList = data.attributeCategoryTypes;
        this.attributeDataTypeList = data.attributeDataTypes;
        this.attrFormat = data.format;

        this.context = data.context;

        this.sqlForm = this.fb.group({
            ifsTable1Id: [null, Validators.required],
            ifsTable2Id: [null, Validators.required],
            format: [null, Validators.required],
            attributeValues: this.fb.array([])
        });
    }

    categorySelection(tableNo) {
        var tableid = "";
        tableid = this.sqlForm.value.ifsTable2Id;
        if (tableNo == "1") {
            tableid = this.sqlForm.value.ifsTable1Id;
        }

        this.attributeService.GetTableData(tableid).subscribe(result => {
            if (tableNo == "1") {
                this.iFSTable1 = result.data;
            }
            else {
                this.iFSTable2 = result.data;
            }
        });
    }

    ValidateSql() {
        this.sqlQueryResult = this.sqlForm.get("format").value;

        this.attributeService.ValidateSql(this.sqlForm.value.format).subscribe(result => {

            this.results = result.data.attributeValues;
            for (var i = 0; i < this.results.length; i++) {

                if (this.attributeViewModel && this.attributeViewModel.length > 0 && this.attributeViewModel[0].attributeValues && this.attributeViewModel[0].attributeValues.length > 0) {
                    for (var k = 0; k < this.attributeViewModel[0].attributeValues.length; k++) {
                        if (this.results[i].attrValue == this.attributeViewModel[0].attributeValues[k].attrValue) {
                            this.results[i].isChecked = true;
                        }
                    }
                }

            }

        });
    }

    SetIsChecked(row, event) {
        row.isChecked = event.checked;
    }

    ngOnInit() {

        this.attributeService.GetIFSTable().subscribe(result => {
            this.iFSTableList = result.data;
        });

        if (this.dataId != "00000000-0000-0000-0000-000000000000") {

            this.attributeService.getAttributeById(this.dataId).subscribe(result => {
                this.attributeViewModel = [];
                this.attributeViewModel.push(result.data);
                this.selectedValue = this.attributeViewModel[0].attributeValues;
                this.selectedTableId = this.attributeViewModel[0].ifsTableId;

                this.selectedTable = this.iFSTableList.find(ifsTableValue => ifsTableValue.id == this.selectedTableId);
                this.sqlForm.patchValue(this.attributeViewModel[0]);
                this.categorySelection('1');
                this.categorySelection('2');
                this.ValidateSql();

            });

        }
        else {

        }

    }

    addSelection() {

        let attributeViewModel: AttributeViewModel = new AttributeViewModel();

        attributeViewModel.attributeValues = this.results.filter(value => {
            return value;
        }).filter(value => value.isChecked);

        attributeViewModel.categoryId = this.attributeData.categoryId;
        attributeViewModel.dataTypeId = this.attributeData.dataTypeId;
        attributeViewModel.description = this.attributeData.description;
        attributeViewModel.attributeName = this.attributeData.attributeName;
        attributeViewModel.iFSTable1Id = this.sqlForm.value.ifsTable1Id;
        attributeViewModel.iFSTable2Id = this.sqlForm.value.ifsTable2Id;
        attributeViewModel.format = this.sqlForm.value.format;

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

    changedEditor(event: EditorChangeContent | EditorChangeSelection) {
        this.validateSQLeditorText(event.editor);
    }

    validateSQLeditorText(eventEditor: any) {
        eventEditor.formatText(0, 13, { 'color': 'rgb(0, 0, 255)' });
        eventEditor.formatText(14, 15, { 'color': 'rgb(0, 0, 0)' });
        eventEditor.formatText(37, 10, { 'color': 'rgb(220,220,220)' });
        eventEditor.formatText(48, 49, { 'color': 'rgb(0, 0, 0)' });
        eventEditor.formatText(72, 2, { 'color': 'rgb(0, 0, 255)' });
        eventEditor.formatText(75, 1, { 'color': 'rgb(0, 0, 0)' });
        eventEditor.formatText(120, 5, { 'color': 'rgb(220,220,220)' });
        eventEditor.formatText(131, 1, { 'color': 'rgb(0, 0, 0)' });
    }

    getSqlSelectStyle() {
        return '#fff000';
    }

    doAction() {
        this.dialogRef.close();
    }

    GotoAddValueOverlay() {
        const dialogattributeValueRef = this.dialog.open(AddNewAttributeOverlayComponent,
            {
                data: {
                    "id": this.attributeData, "rfqId": this.attributeData.rfqId, "attributeCategoryTypes": this.attributeCategoryList, "attributeDataTypes": this.attributeDataTypeList, "format": this.attributeData.format
                }
            });
        dialogattributeValueRef.addPanelClass('inline-md-overlay');
        dialogattributeValueRef.afterClosed().subscribe(result => {
        });
        this.dialogRef.close();
    }

    onFormSubmit(form: NgForm) {
    }
}