import {Component, ViewChild, ViewEncapsulation} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {AddOverlayComponent} from './add-overlay/add-overlay.component';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { Router } from '@angular/router';
//import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { AttributeItemSearchModel } from 'app/main/Models/etendering/attribute-items-search-model';
import Swal from 'sweetalert2';

@Component({
    selector     : 'rfx',
    templateUrl  : './list-detail.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ListDetailComponent
{
    displayedColumns: string[] = ['id','attributeName', 'categoryName', 'description', 'dataTypeName'];

    attributeGroupID : any;
    attributeGroup: any = new AttributeGroupSearchModel();
    attributeItemSearchModel: AttributeItemSearchModel = new AttributeItemSearchModel();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent:PageEvent;
    panelOpenState = false;
    message:string="";
   
    attributeItems: string = "";
    categories: string = "";
    descriptions: string = "";
    dataTypeList: any=[];
    dTypes: any;
    dataTypeName:string;
    actualAttributeModels:any=[];

    name: string = "";
    category: string = "";
    description: string = ""; 
    /**
     * Constructor
     */
     constructor(public dialog: MatDialog,private attributeGroupService: AttributeGroupService,private router: Router
        //,private _fuseAlertService: FuseAlertService
        ,private _fuseConfirmationService: FuseConfirmationService)
    {
        
        this.attributeGroupID = this.router.getCurrentNavigation().extras.state.Id;
        this.attributeGroup.pageSize=10;
        this.attributeGroup.page=1;
        this.attributeItemSearchModel.pageSize=10;
        this.attributeItemSearchModel.page=1;
  
    }
    OnPaginateChange(event:PageEvent)
    {
        let page=event.pageIndex;
        let size=event.pageSize;
        page=page+1;
        this.attributeGroup.pageSize=event.pageSize;
        this.attributeGroup.page=page;
        this.attributeItemSearchModel.pageSize=event.pageSize;
          this.attributeItemSearchModel.page=page;
        this.FetchBasicData();
    //  this.dataSource=   this.CreatePaginationData(page,size);
           
    }

    sortData(sort: Sort) {
        ////debugger;
       // console.log(sort);
        this.attributeGroup.direction=sort.direction;
        this.attributeGroup.column=sort.active;
        this.attributeItemSearchModel.direction=sort.direction;
        this.attributeItemSearchModel.column=sort.active;
        this.FetchBasicData();
    }
    
    searchData() {

        ////debugger;
       /*  let dataList: AttributeViewModel[] = this.actualAttributeModels;
        
        if(this.attributeItems && this.attributeItems != ""){
            dataList = dataList.filter((data: AttributeViewModel) => {
                return data.attributeName.indexOf(this.attributeItems) > -1;
            })
        }
        if(this.categories && this.categories != ""){
            dataList = dataList.filter((data: AttributeViewModel) => {
                return data.categoryName.indexOf(this.categories) > -1;
            })
        }
        if(this.descriptions && this.descriptions != ""){
            dataList = dataList.filter((data: AttributeViewModel) => {
                return data.description.indexOf(this.descriptions) > -1;
            })
        }
        if(this.dataTypeName && this.dataTypeName != ""){
            dataList = dataList.filter((data: AttributeViewModel) => {
                return data.dataTypeName.indexOf(this.dataTypeName) > -1;

            })
        }

        this.attributeGroup.attributeModels = dataList; */

        if(this.name && this.name != ""){
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.title.indexOf(this.title) > -1;
             }) */
             this.attributeItemSearchModel.attributeName=this.name;
         }
         else{
             this.attributeItemSearchModel.attributeName=null;
         }
         
         if(this.category && this.category != ""){
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.groupName.indexOf(this.groupName) > -1;
             }) */
             this.attributeItemSearchModel.category=this.category;
         }
         else{
             this.attributeItemSearchModel.category=null;
         }
         if(this.description && this.description != ""){
           /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.groupName.indexOf(this.groupName) > -1;
            }) */
            this.attributeItemSearchModel.description=this.description;
        }
        else{
            this.attributeItemSearchModel.description=null;
        }
        if(this.dataTypeName && this.dataTypeName != ""){
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.groupName.indexOf(this.groupName) > -1;
             }) */
             this.attributeItemSearchModel.dataTypeName=this.dataTypeName;
         }
         else{
             this.attributeItemSearchModel.dataTypeName=null;
         }
        // this.attributeGroupSearchModel=data;
         //console.log(this.attributeSearchModel);
             this.FetchBasicData();
    }

    /* FetchBasicData(){

        this.attributeGroupService.getAttributeGroupById(this.attributeGroupID).subscribe(result => {
        
          ////debugger;
          this.attributeGroup = result.data;
          console.log(result.data);
          for(var kk=0;kk<result.data.attributeModels.length;kk++)
          {
              this.actualAttributeModels.push(result.data.attributeModels[kk]);
          }
        
        this.dataTypeList = result.data.dataTypeList;
        
        });
   
    } */

    FetchBasicData(){
        this.attributeItemSearchModel.Id=this.attributeGroupID
        this.attributeGroupService.getAttributeItemsGroupById(this.attributeItemSearchModel).subscribe(result => {
        // console.log(result);   
        this.attributeGroup=result.data;
        this.attributeGroup.totalItems = result.data.totalItems;
        this.attributeGroup.pageSize=result.data.pageSize;
        this.attributeGroup.TotalPages=result.data.TotalPages;
        this.attributeGroup.Page=result.data.Page;
        //console.log(this.attributeGroup,result.data.listModel)
        for(var kk=0;kk<result.data.attributeModels.length;kk++)
        {
            this.actualAttributeModels.push(result.data.attributeModels[kk]);
        }
      
        this.dataTypeList = result.data.dataTypeList;
        this.attributeItemSearchModel
        
        });
   
    }
    
    ngOnInit() {
        //this.dismiss("successerror");
        this.FetchBasicData();
       
      
    }
/* 
    saveChanges(){

         for (var i = 0; i < this.actualAttributeModels.length; i++) {

            this.actualAttributeModels[i].attributeGroupId= this.attributeGroupID;

        } 
        
        this.attributeGroupService.SaveAttributeGroupMapping(this.actualAttributeModels).subscribe(

            result => {

                this.FetchBasicData();
                this.message="Saved";
                this.show("successerror");

                }
        );
     
    } */
    saveAttribute(){

        for (var i = 0; i < this.actualAttributeModels.length; i++) {

           this.actualAttributeModels[i].attributeGroupId= this.attributeGroupID;

       } 
      
       this.attributeGroupService.SaveAttributeGroupMapping(this.actualAttributeModels).subscribe(

           result => {

            Swal.fire({
                //position: 'top-end',
                icon: 'success',
                title: "Attribute Item updated successfully",
                showConfirmButton: false,
                timer: 1000
              })
              this.FetchBasicData();
               }
       );
    
   }
    openDialog() {

        const  dialogRef = this.dialog.open(AddOverlayComponent,{data:{AddedAttribute:this.attributeGroup}});
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe(result => {
            /* let data:any=[];
            for (var i = 0; i < this.attributeGroup.attributeModels.length; i++) {
                data.push(this.attributeGroup.attributeModels[i]);
            }  */
            /* if(result.length>0)
            {
                for(var i=0; i<result.length; i++)
                {
                    if(result[i].isChecked==true && result[i].isDisabled==false)
                    {
                        data.push(result[i]);
                    }
                }
            }
            
            
            
            this.message="Added";
            this.show("successerror"); */
           
          if(result){
            if(result.length>0){
            this.actualAttributeModels=[];
            for(var kk=0;kk<result.length;kk++)
            {
                this.actualAttributeModels.push(result[kk]);
            }
            this.saveAttribute();
        }
        }
        });

    }

    Delete(model: AttributeViewModel[])
    {
        ////debugger;
        Swal.fire({
            title: 'Remove Attribute Item',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {  
              if (result.isConfirmed) {
                this.actualAttributeModels=[];
                this.actualAttributeModels.push(model);
                for (var i = 0; i < this.actualAttributeModels.length; i++) {

                    this.actualAttributeModels[i].attributeGroupId= this.attributeGroupID;
         
                } 
                //console.log(this.actualAttributeModels);
                this.attributeGroupService.DeleteAttributeGroupMapping(this.actualAttributeModels).subscribe(result => {
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

goBack() {
    this.router.navigate(['/attribute-list']);
}   
}

