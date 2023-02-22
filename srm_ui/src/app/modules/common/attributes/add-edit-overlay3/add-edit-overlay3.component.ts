import { Component, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import {FormControl, FormGroup, FormBuilder, FormArray, Validators} from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import {AttributeSearchModel} from 'app/main/Models/etendering/attribute-search-model';
import {AttributeValueViewModel} from 'app/main/Models/etendering/ViewModels/attribute-value-view-model';
import {AttributeItemsComponent} from 'app/modules/common/attributes/attribute-items.component';

import {AddEditOverlayComponent} from '../add-edit-overlay/add-edit-overlay.component';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { result } from 'lodash';
import Swal from 'sweetalert2';




@Component({
    selector: 'add-overlay3',
    templateUrl: './add-edit-overlay3.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddEditOverlay3Component {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'value', 'description'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    attributeViewModel: AttributeViewModel[];

    templateData: any = [];
    useremail: string = '';
    // List to hold IFSTable data
    iFSTableList: any = [];
    iFSValue: any[];
    selectedIFSValue: any[];
    RemovefilteredIFSValue: any[];
    filteredIFSValue: any[]
    parentComponent:AttributeItemsComponent;
    selectedIFSTable: any;
    iFSData :FormGroup;

    selectedId: any ;
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;

    attributeData: any;
    dataId: any = "";
    neweditText: string = "Attribute Item saved successfully";

    
    selectedIFSTableId: any = "";

    attributeSearchModel: AttributeSearchModel = new AttributeSearchModel();

    constructor(public dialogRef: MatDialogRef<AddEditOverlay3Component>,
                public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data,private fb: FormBuilder, private attributeService: AttributeService
    ) {
        ////debugger;
        this.iFSData =this.fb.group({
            category:[null, Validators.required],
            ifsValues: this.fb.array([])
        });
        this.attributeData = data.attributeData;
        this.dataId = this.attributeData.attributeModels[0].id;
        this.parentComponent=data.attributeListComponent;

    }
    
    
    ngOnInit() {
        ////debugger;
        //this.getIFSTable();
        this.attributeService.GetIFSTable().subscribe(result =>{
            this.iFSTableList = result.data;
        });

        
        if(this.dataId != "00000000-0000-0000-0000-000000000000"){

            this.attributeService.getAttributeById(this.dataId).subscribe(result =>{
            this.attributeViewModel = [];
            this.attributeViewModel.push(result.data);
            this.selectedIFSValue = this.attributeViewModel[0].attributeValues;
            this.selectedIFSTableId = this.attributeViewModel[0].ifsTableId;
            
            this.selectedIFSTable = this.iFSTableList.find(ifsTableValue => ifsTableValue.id == this.selectedIFSTableId);
            this.categorySelection();
            

            });
            


        }
        else{
            
        /* //debugger;
        this.getIFSTable(); */
        }
        

        
    }
    getIFSTable(){
        this.attributeService.GetIFSTable().subscribe(result =>{
            this.iFSTableList = result.data;
        });
    }
    categorySelection() {
        ////debugger;
        //Category has been selected, fetch IFSValues for respective ID
        this.attributeService.GetIFSValue(this.selectedIFSTable.id).subscribe(result =>{
            this.iFSValue =result.data;
            this.iFSValue = this.iFSValue.filter(value =>{
                return value.attrValue = value.value, value.iFSValueId = value.id;
            } );
            
        this.validateIsChecked();
        });
        
          
        

    }
    addSelection(){
       

        let attributeViewModel: AttributeViewModel = new AttributeViewModel(); 

        if(this.dataId != "00000000-0000-0000-0000-000000000000"){
            ////debugger;
            this.filteredIFSValue = this.iFSValue.filter(x => !this.selectedIFSValue.some(y => y.attrValue.includes(x.attrValue))&& x.isChecked==true);
            //var iFSValueMap = this.iFSValue.map(ifsValue => ifsValue.value);
            // Add new chekced rows to selectedIFSValue array
            for(var i = 0; i< this.filteredIFSValue.length; i++){
                    this.selectedIFSValue.push({attrValue:this.filteredIFSValue[i].value, ifsValueId: this.filteredIFSValue[i].id, id: "00000000-0000-0000-0000-000000000000"});
                
            }
            //Removes unchecked rows from selctedIFSValue array
            this.selectedIFSValue = this.selectedIFSValue.filter(x => this.iFSValue.some(y => y.attrValue.includes(x.attrValue)&& y.isChecked==true));

        attributeViewModel.attributeValues =  this.selectedIFSValue; 

        }else{
            ////debugger;
            attributeViewModel.attributeValues = this.iFSValue.filter(value =>{
                return value.attrValue = value.value, value.iFSValueId = value.id, value.id = "00000000-0000-0000-0000-000000000000";
            } ).filter(value => value.isChecked);
            attributeViewModel.attributeValues
        }
        
        attributeViewModel.categoryId = this.attributeData.attributeModels[0].categoryId;
        attributeViewModel.dataTypeId = this.attributeData.attributeModels[0].dataTypeId;
        attributeViewModel.description = this.attributeData.attributeModels[0].description;
        attributeViewModel.attributeName = this.attributeData.attributeModels[0].attributeName;
        attributeViewModel.ifsTableId = this.selectedIFSTable.id;

        attributeViewModel.id = this.attributeData.attributeModels[0].id;

        this.attributeService.SaveAttribute(attributeViewModel).subscribe(result =>{
           //attributeViewModel.numberingSequenceModels = result;
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
    validateIsChecked() {
        ////debugger;
        
        this.iFSValue.forEach(value=>{
            for(var i = 0; i< this.selectedIFSValue.length; i++){
                if( this.selectedIFSValue[i].ifsValueId == value.id){
                  value.isChecked=true;
                }
            }
        });


    }
    
    ngAfterViewInit() {
       /*  this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; */
    }

    applyFilter(event: Event) {
      /*   const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        } */
    }
    addTemplate(item, event) {
    }
   

    doAction() {
        this.dialogRef.close();
        // window.location.reload() ;

    }
    GotoAddValueOverlay(){
        ////debugger;
        const dialogattributeValueRef = this.dialog.open(AddEditOverlayComponent, {data: {"attributeData": this.attributeData, "id":this.attributeData.attributeModels[0].id,  "initialDataType": this.attributeData.attributeModels[0].dataTypeId, "attributeListComponent":this.parentComponent}});
        dialogattributeValueRef.addPanelClass('inline-md-overlay');
        dialogattributeValueRef.afterClosed().subscribe(result => {
        });
        this.dialogRef.close();

    }

    saveTemplate() {
    }
}

