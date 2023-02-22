import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AddEditOverlayComponent} from './add-edit-overlay/add-edit-overlay.component';
import {AddEditOverlay2Component} from './add-edit-overlay2/add-edit-overlay2.component';
import {AddEditOverlay3Component} from './add-edit-overlay3/add-edit-overlay3.component';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { AddEditOverlay4Component } from './add-edit-overlay4/add-edit-overlay4.component';
import {Sort} from '@angular/material/sort';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import Swal from 'sweetalert2';


@Component({
    selector     : 'attribute-items',
    templateUrl  : './attribute-items.component.html',
    styleUrls:['./attribute-items.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AttributeItemsComponent
{
    attributeViewModel: AttributeViewModel[];

    displayedColumns: string[] = ['id','categoryName', 'attributeName', 'description','dataTypeName', 'inputVal'];
    //dataSource: AttributeSearchModel = null;
    attributeModels: any = [];
    attributeSearchModel: AttributeSearchModel = new AttributeSearchModel();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent:PageEvent;
    panelOpenState = false;
    attributeCatagoryTypes: any[];//Your Model 
    dataTypeList: any=[];
    
    //attributeModels: any[];
    
    

    //resultsLength:any;
    Message:string="";
    name: string = "";
    category: string = "";
    description: string = "";
    dataTypeName:string;
    /**
     * Constructor
     */
     
    constructor(public dialog: MatDialog, private attributeService: AttributeService
      ,private _fuseAlertService: FuseAlertService
      , private _fuseConfirmationService: FuseConfirmationService)
    {
        
        this.attributeSearchModel.pageSize=10;
        this.attributeSearchModel.page=1;
        //debugger;
       /*  const users = Array.from({length: 100}, (_, k) => createNewRow(k + 1)); */

        // Assign the data to the data source for the table to render
        /* this.dataSource = new MatTableDataSource(users); */
    }
    ngAfterViewInit() {
       /*  this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; */
    }
    /* DeleteAttribute(row) {
        this.attributeService.DeleteItem(row).subscribe(result => {
          console.log(result);
          //debugger;
          this.FetchBasicData();
    
        });
      } */
      DeleteAttribute(model: AttributeViewModel[]) {
        Swal.fire({
          title: 'Remove Attribute Item',
          text: "Are you sure you want to delete this record?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Remove'
      }).then((result) => {
            if(result.isConfirmed)
            {
                this.Message="Deleted";
            this.attributeService.DeleteItem([model]).subscribe(result => {
                //debugger;
                Swal.fire(
                  'Deleted!',
                  'Record Deleted successfully.',
                  'success'
              ).then((result) => {
                  if (result.isConfirmed) {
                      this.FetchBasicData();
                  }
                })
               
      
            });
        }
        });


       /*  this.attributeViewModel = model;
        console.log("DeleteTest");
        console.log(this.attributeViewModel);
        this.attributeService.DeleteItem([this.attributeViewModel]).subscribe(result => {
        console.log(result);
        this.attributeViewModel = result;
        this.FetchBasicData();

        }); */
        }
      
    EditAttribute(row :any) {
        //debugger;
        const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":row.id, "initialDataType": row.dataTypeName, "attributeListComponent":this}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            Swal.fire({
              //position: 'top-end',
              icon: 'success',
              title: "Attribute updated successfully",
              showConfirmButton: false,
              timer: 1000
            })
            this.FetchBasicData();
          }
      });
        //debugger;
       
    }
    defineInputValue(row){
      //debugger;
      let attributeSearchModel: AttributeSearchModel = new AttributeSearchModel();
      

      this.attributeModels.push({"DataType": {"id":row.dataTypeId,"text":row.dataTypeName},"attributeName": row.attributeName, "categoryId":row.categoryId,"dataTypeId":row.dataTypeId,"dataTypeName": row.dataTypeName ,"description": row.description, "id":row.id});
      attributeSearchModel.attributeModels = this.attributeModels;
      if(row.dataTypeName=="IFS Value List"){
        const dialogRef = this.dialog.open(AddEditOverlay3Component,{data:{"attributeData": attributeSearchModel,  "initialDataType": row.dataTypeName, "attributeListComponent":this}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          /* this.Message = "Updated";
          this.show("seccesserror"); */
        this.FetchBasicData();
      });
      }else if(row.dataTypeName=="Sql"){
        const dialogRef = this.dialog.open(AddEditOverlay4Component,{data:{"attributeData": attributeSearchModel,  "initialDataType": row.dataTypeName, "attributeListComponent":this}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          /* this.Message = "Updated";
          this.show("seccesserror"); */
        this.FetchBasicData();
        });
      }else{
        const dialogRef = this.dialog.open(AddEditOverlay2Component,{data:{"attributeData": attributeSearchModel,  "initialDataType": row.dataTypeName, "attributeListComponent":this}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          /* this.Message = "Updated";
          this.show("seccesserror"); */
        this.FetchBasicData();
      });
      

      }
      
      
    }
    OnPaginateChange(event:PageEvent)
    {
          let page=event.pageIndex;
          let size=event.pageSize;
          page=page+1;
          this.attributeSearchModel.pageSize=event.pageSize;
          this.attributeSearchModel.page=page;
          this.FetchBasicData();
      //  this.dataSource=   this.CreatePaginationData(page,size);
           //console.log(this.attributeSearchModel);  
    }
    sortData(sort: Sort) {
        //debugger;
        this.attributeSearchModel.direction=sort.direction;
        this.attributeSearchModel.column=sort.active;
        this.FetchBasicData();
    }
    FetchBasicData() {
      //debugger;
        // this.collaborationTeamSearchModel.teamName=this.ctForm.value.teamName;
        this.attributeService.getAttributeList(this.attributeSearchModel).subscribe(result => {
          //debugger;
         // console.log(result.dataTypeList);
          var filteredAttributeItems = result.attributeModels.filter(x => x.isDeleted==false);
          this.attributeSearchModel = result;
          this.dataTypeList = result.dataTypeList;
        });
      }
      ngOnInit() {
          this.FetchBasicData();

           // this.dataSource= this.CreatePaginationData(0,5);
      }

   /*  applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    } */
    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":"00000000-0000-0000-0000-000000000000", "attributeListComponent":this}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
          if (result) {          
           /*  Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: "Attribute Added successfully",
              showConfirmButton: false,
              timer: 1000
            }) */
            this.FetchBasicData();
          }
        });

    }
    openDialog2() {
        const dialogRef = this.dialog.open(AddEditOverlay2Component,{data:{"id":"00000000-0000-0000-0000-000000000000", "attributeListComponent":this}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    
    searchData() {

      
      if(this.name && this.name != ""){
         /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
              return data.title.indexOf(this.title) > -1;
          }) */
          this.attributeSearchModel.attributeName=this.name;
      }
      else{
          this.attributeSearchModel.attributeName=null;
      }
      
      if(this.category && this.category != ""){
         /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
              return data.groupName.indexOf(this.groupName) > -1;
          }) */
          this.attributeSearchModel.category=this.category;
      }
      else{
          this.attributeSearchModel.category=null;
      }
      if(this.description && this.description != ""){
        /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
             return data.groupName.indexOf(this.groupName) > -1;
         }) */
         this.attributeSearchModel.description=this.description;
     }
     else{
         this.attributeSearchModel.description=null;
     }
     if(this.dataTypeName && this.dataTypeName != ""){
      /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
           return data.groupName.indexOf(this.groupName) > -1;
       }) */
       this.attributeSearchModel.dataTypeName=this.dataTypeName;
   }
   else{
       this.attributeSearchModel.dataTypeName=null;
   }
     // this.attributeGroupSearchModel=data;
      //console.log(this.attributeSearchModel);
          this.FetchBasicData();
      
  }

       /**
 * Dismiss the alert via the service
 *
 * @param name
 */
  dismiss(name: string): void
  {
    this._fuseAlertService.dismiss(name);
  }
  /**
 * Show the alert via the service
 *
 * @param name
 */
  show(name: string): void
  {
    this._fuseAlertService.show(name);
  }
}
/** Builds and returns a new createNewRow. */
/* function createNewRow(id: number): RowData {

    return {
        id: id.toString(),
        attItem: ATTITEM[Math.round(Math.random() * (ATTITEM.length - 1))],
        description: DESCRIPTION[Math.round(Math.random() * (DESCRIPTION.length - 1))],
        category: CATEGORY[Math.round(Math.random() * (CATEGORY.length - 1))],
        dataType: DATATYPE[Math.round(Math.random() * (DATATYPE.length - 1))],

    };
} */

