import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {AddEditOverlayComponent} from './add-edit-overlay/add-edit-overlay.component';
import { map,tap } from 'lodash';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import {Sort} from '@angular/material/sort';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import { Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
//import { FuseAlertService } from '@fuse/components/alert';
import Swal from 'sweetalert2';

@Component({
    selector     : 'attribute-items',
    templateUrl  : './attribute-list.component.html',
    styleUrls:['./attributes-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AttributeListComponent
{
    displayedColumns: string[] = ['id', 'title', 'name', 'groupName','isPrivate','isActive'];

    attributeGroups: AttributeGroupViewModel[];
    attributeGroupSearchModel: AttributeGroupSearchModel = new AttributeGroupSearchModel();
   
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    pageEvent:PageEvent;
    panelOpenState = false;
    message: string = "";
   // actualAttributeModels:any=[];

    title: string = "";
    name: string = "";
    groupName: string = "";
    type: string = "";
    
    /**
     * Constructor
     */
     constructor(public dialog: MatDialog,private attributeGroupService: AttributeGroupService,private router: Router
        ,private _fuseConfirmationService: FuseConfirmationService)
    {

        this.attributeGroupSearchModel.pageSize=10;
        this.attributeGroupSearchModel.page=1;
        
    }
    OpenURL(url,row) {

        this.router.navigateByUrl(url, { state: { Id: row.id} });

    }


    EditAttGrp(row :any) {
     ////debugger;
        const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":row.id}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                /* Swal.fire({
                   // position: 'top-end',
                    icon: 'success',
                    title: "Attribute List updated successfully",
                    showConfirmButton: false,
                    timer: 1000
                  }) */
                  this.FetchBasicData();
            } 
        });   
    }

    DeleteAttGrp(model: AttributeGroupViewModel[]) {

       // this.attributeGroups = model;

       Swal.fire({
        title: 'Remove Attribute List',
        text: "Are you sure you want to delete this record?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Remove'
    }).then((result) => {
          if(result.isConfirmed)
          {
              
              this.attributeGroupService.DeleteItem([model]).subscribe(result => {
            //   this.attributeGroupService.DeleteItem([this.attributeGroups]).subscribe(result => {
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

    }

    OnPaginateChange(event:PageEvent)
    {
        let page=event.pageIndex;
        let size=event.pageSize;
        page=page+1;
        this.attributeGroupSearchModel.pageSize=event.pageSize;
        this.attributeGroupSearchModel.page=page;
        this.FetchBasicData();
        
    }

    sortData(sort: Sort) {
        ////debugger;
        this.attributeGroupSearchModel.direction=sort.direction;
        this.attributeGroupSearchModel.column=sort.active;
        this.FetchBasicData();
    }

    searchData() {

        ////debugger;
       /*  let dataList: AttributeGroupViewModel[] = this.actualAttributeModels;
        
        if(this.title && this.title != ""){
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.title.indexOf(this.title) > -1;
            })
        }
        if(this.name && this.name != ""){
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.name.indexOf(this.name) > -1;
            })
        }
        if(this.groupName && this.groupName != ""){
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.groupName.indexOf(this.groupName) > -1;
            })
        }
        if(this.type != ""){
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.isPrivate === (this.type === "private" ? true : false);
            })
        } */
        
        //this.attributeGroupSearchModel.attributeGroupViewModels = dataList;

        //let dataList: AttributeGroupSearchModel[] = this.actualAttributeModels;
      
        if(this.title && this.title != ""){
           /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.title.indexOf(this.title) > -1;
            }) */
            this.attributeGroupSearchModel.title=this.title;
        }
        else{
            this.attributeGroupSearchModel.title=null;
        }
        if(this.name && this.name != ""){
            /* dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.name.indexOf(this.name) > -1;
            }) */
            this.attributeGroupSearchModel.name=this.name;
        }
        else{
            this.attributeGroupSearchModel.name=null;
        }
        if(this.groupName && this.groupName != ""){
           /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.groupName.indexOf(this.groupName) > -1;
            }) */
            this.attributeGroupSearchModel.group=this.groupName;
        }
        else{
            this.attributeGroupSearchModel.group=null;
        }
        if(this.type != ""){
           /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.isPrivate === (this.type === "private" ? true : false);
            }) */
            this.attributeGroupSearchModel.isPrivate=(this.type === "private" ? true : false);
        }
        else{
            this.attributeGroupSearchModel.isPrivate=null;
        }
       // this.attributeGroupSearchModel=data;
        
            this.FetchBasicData();
        
    }

    FetchBasicData() {
      ////debugger;
      
        this.attributeGroupService.getAttributeGroupList(this.attributeGroupSearchModel).subscribe(result => {
         
          ////debugger;
          this.attributeGroupSearchModel = result;

         /*  for(var kk=0;kk<result.attributeGroupViewModels.length;kk++)
          {
              this.actualAttributeModels.push(result.attributeGroupViewModels[kk]);
          } */
        });
       
    }

    ngOnInit() {
        this.FetchBasicData();
        this.dismiss("successerror");
      
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddEditOverlayComponent,{data:{"id":"00000000-0000-0000-0000-000000000000"}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                /* Swal.fire({
                   // position: 'top-end',
                    icon: 'success',
                    title: "Attribute List updated successfully",
                    showConfirmButton: false,
                    timer: 1000
                  }) */
                  this.FetchBasicData();
            }
          
        }); 
         
    }

     /**
     * Dismiss the alert via the service
     *
     * @param name
    */
      dismiss(name: string): void
      {
         // this._fuseAlertService.dismiss(name);
      }
  
      /**
       * Show the alert via the service
       *
       * @param name
       */
      show(name: string): void
      {
         // this._fuseAlertService.show(name);
      }
}


