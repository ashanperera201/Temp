import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators,NgForm} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { AttributeItemsComponent } from '../attribute-items.component';
import { AddEditOverlayComponent } from '../add-edit-overlay/add-edit-overlay.component';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { EditorChangeContent, EditorChangeSelection, QuillEditorBase, QuillModule } from 'ngx-quill';
import Swal from 'sweetalert2';

@Component({
    selector: 'add-overlay4',
    templateUrl: './add-edit-overlay4.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditOverlay4Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['code', 'description','uniqueID'];
    displayedColumns2: string[] = ['id', 'code'];
    
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    neweditText: string = "Attribute Item saved successfully";
    templateData: any = [];
    useremail: string = '';
    count = 0;
    dataArrayOfSqleditor: string[];
    dataEditor: string[];
    iFSTable1: any[];
    iFSTable2: any[];
    results: any[];
    selectedValue: any[];
    filteredValue: any[]
    sqlQueryResult:string;
    iFSData :FormGroup;
    iFSTableList: any = [];
    parentComponent:AttributeItemsComponent;
    attributeData: any;
    dataId: any = "";
    selectedTable: any;
    attributeViewModel: AttributeViewModel[];
    selectedTableId: any = "";
    highlightcolor: boolean = false;
    type: string = "";
    sqlForm : FormGroup;
    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    addTeam = new FormGroup({
        teamName: new FormControl('Team Name One'),
        teamDescription: new FormControl('Team Description One'),
    });
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'align': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction


            ['link', 'image', 'video']                         // link and image, video
        ]
    };


    constructor(public dialogRef: MatDialogRef<AddEditOverlay4Component>,
                public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,private fb: FormBuilder, 
                private attributeService: AttributeService
    ) {
        
        this.sqlForm =this.fb.group({
            ifsTable1Id:[null, Validators.required],
            ifsTable2Id:[null, Validators.required],
            format:[null, Validators.required],
            attributeValues: this.fb.array([])
        });
        this.attributeData = data.attributeData;
        this.dataId = this.attributeData.attributeModels[0].id;
        this.parentComponent=data.attributeListComponent;
       
    }

    categorySelection(tableNo) {
        var tableid="";
        tableid=this.sqlForm.value.ifsTable2Id;
        if(tableNo=="1")
        {
            tableid=this.sqlForm.value.ifsTable1Id;

        }

        this.attributeService.GetTableData(tableid).subscribe(result =>{
            if(tableNo=="1")
            {
                this.iFSTable1 =result.data;
            }
            else{
                this.iFSTable2 =result.data;
            }
               
        });
    
    }

    ValidateSql() {
        this.sqlQueryResult = this.sqlForm.get("format").value;
        // if(this.sqlQueryResult.includes("SELECT") || this.sqlQueryResult.includes("WHERE") || this.sqlQueryResult.includes("FROM") ||
        //  this.sqlQueryResult.includes("UPDATE") || this.sqlQueryResult.includes("ON")){
        //    this.highlightcolor = true;
        // }
       
        this.attributeService.ValidateSql(this.sqlForm.value.format).subscribe(result =>{

            this.results = result.data.attributeValues;
            for(var i = 0; i< this.results.length; i++){

                for(var k = 0; k< this.attributeViewModel[0].attributeValues.length; k++) {
                    if(this.results[i].attrValue==this.attributeViewModel[0].attributeValues[k].attrValue) {
                        this.results[i].isChecked = true; 
                    }

                }
            
            }
            
        });
    }

    SetIsChecked(row,event) {

        row.isChecked=event.checked;

    }

    ngOnInit() {
        
        this.attributeService.GetIFSTable().subscribe(result =>{
            this.iFSTableList = result.data;
        });

        if(this.dataId != "00000000-0000-0000-0000-000000000000"){

            this.attributeService.getAttributeById(this.dataId).subscribe(result =>{
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
        else{
            
        // this.getIFSTable(); 
        }
          
    }

    addSelection() {
       
        let attributeViewModel: AttributeViewModel = new AttributeViewModel(); 

        attributeViewModel.attributeValues = this.results.filter(value =>{
                     return value;
                } ).filter(value => value.isChecked);
                
        attributeViewModel.categoryId = this.attributeData.attributeModels[0].categoryId;
        attributeViewModel.dataTypeId = this.attributeData.attributeModels[0].dataTypeId;
        attributeViewModel.description = this.attributeData.attributeModels[0].description;
        attributeViewModel.attributeName = this.attributeData.attributeModels[0].attributeName;
        attributeViewModel.iFSTable1Id = this.sqlForm.value.ifsTable1Id;
        attributeViewModel.iFSTable2Id = this.sqlForm.value.ifsTable2Id;
        attributeViewModel.format = this.sqlForm.value.format;
        
        attributeViewModel.id = this.attributeData.attributeModels[0].id;

        this.attributeService.SaveAttribute(attributeViewModel).subscribe(result =>{
            debugger;
            if (result.success.success == true) {
                Swal.fire({
                  icon: 'success',
                  title: this.neweditText,
                  showConfirmButton: false,
                  timer: 1000
                })
              } else {
                Swal.fire({
                  icon: 'warning',
                  title: 'Duplicate Attribute Item Name cannot be added',
                  showConfirmButton: false,
                  timer: 1000
                })
              }
           this.dialogRef.close();
           this.parentComponent.FetchBasicData();

       });
        
    }

    changedEditor(event: EditorChangeContent | EditorChangeSelection){
        this.validateSQLeditorText(event.editor);
        
    }

    validateSQLeditorText(eventEditor: any ){
        
            eventEditor.formatText(0, 13, {'color': 'rgb(0, 0, 255)'});
            eventEditor.formatText(14, 15, {'color': 'rgb(0, 0, 0)'});
            eventEditor.formatText(37, 10, {'color': 'rgb(220,220,220)'});
            eventEditor.formatText(48, 49, {'color': 'rgb(0, 0, 0)'});
            eventEditor.formatText(72, 2, {'color': 'rgb(0, 0, 255)'});
            eventEditor.formatText(75, 1, {'color': 'rgb(0, 0, 0)'});
            eventEditor.formatText(120, 5, {'color': 'rgb(220,220,220)'});
            eventEditor.formatText(131, 1, {'color': 'rgb(0, 0, 0)'});
    }
    getSqlSelectStyle(){
        return '#fff000';
    }
    ngAfterViewInit() {
        
    }

    applyFilter(event: Event) {  
    }

    addTemplate(item, event) {
    }

    doAction() {
        this.dialogRef.close();
    }

    GotoAddValueOverlay() {
        const dialogattributeValueRef = this.dialog.open(AddEditOverlayComponent, 
            {data: {"attributeData": this.attributeData, "id":this.attributeData.attributeModels[0].id,  
            "initialDataType": this.attributeData.attributeModels[0].dataTypeId, "attributeListComponent":this.parentComponent}});
        dialogattributeValueRef.addPanelClass('inline-md-overlay');
        dialogattributeValueRef.afterClosed().subscribe(result => {
        });
        this.dialogRef.close();
    }
    
    saveTemplate() {
    }

    onFormSubmit(form:NgForm){
    }
}

