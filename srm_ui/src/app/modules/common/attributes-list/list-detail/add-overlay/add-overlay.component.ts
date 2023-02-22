import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { AttributeService } from 'app/shared/Services/etendering/attribute.service';


@Component({
    selector: 'add-overlay',
    templateUrl: './add-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddOverlayComponent {
    displayedColumns: string[] = ['id', 'category', 'attItem', 'description'];

    attribute : AttributeSearchModel = new AttributeSearchModel();
    attributeGroup: any = new AttributeGroupSearchModel();

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent:PageEvent;
    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    AddedAttribute:any=[];
    actualAttributeModels:any=[];
    attributeItems: string = "";
    categories: string = "";
    descriptions: string = "";
    OverlayText:string="Add New "
    isSaved:boolean =false;
    constructor(public dialog: MatDialog,private attributeService: AttributeService,public dialogRef: MatDialogRef<AddOverlayComponent>,@Inject(MAT_DIALOG_DATA) public data)
    {
       
        this.attribute.pageSize=10;
        this.attribute.page=1;
        this.AddedAttribute = this.data.AddedAttribute;
        if(this.data.Id!="00000000-0000-0000-0000-000000000000"){
            this.OverlayText ="Edit "
          }
    }

    addAttribute() {
        this.isSaved=true
        if(this.attribute.attributeModels.length>0)
        {   
            let data:any=[];        
            data=this.attribute.attributeModels.filter(i=>i.isChecked==true && i.isDisabled==false)
            this.isSaved=false
            this.dialogRef.close(data);
        }
    }

    
    sortData(sort: Sort) {
        this.attribute.direction=sort.direction;
        this.attribute.column=sort.active;
        this.FetchBasicData();
    }

    searchData() {
       /*  this.attribute.name=this.attributeItems;
        this.attribute.description=this.descriptions;
        this.attribute.category=this.categories; */
        if(this.attributeItems && this.attributeItems != ""){
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.title.indexOf(this.title) > -1;
             }) */
             this.attribute.attributeName=this.attributeItems;
         }
         else{
             this.attribute.attributeName=null;
         }
         
         if(this.categories && this.categories != ""){
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.groupName.indexOf(this.groupName) > -1;
             }) */
             this.attribute.category=this.categories;
         }
         else{
             this.attribute.category=null;
         }
         if(this.descriptions && this.descriptions != ""){
           /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.groupName.indexOf(this.groupName) > -1;
            }) */
            this.attribute.description=this.descriptions;
        }
        else{
            this.attribute.description=null;
        }
        this.FetchBasicData();
    }

    FetchBasicData() {

        /* this.attribute.page=1;
        this.attribute.pageSize=10000; */
        this.attributeService.getAttributeList(this.attribute).subscribe(result => {
          this.attribute = result;
         
          for(var i=0;i< this.attribute.attributeModels.length;i++)
          {
            this.attribute.attributeModels[i].isChecked=false;
            this.attribute.attributeModels[i].isDisabled=false;
            if(this.AddedAttribute.attributeModels){
            for(var k=0;k< this.AddedAttribute.attributeModels.length;k++)
              {
                  if(this.attribute.attributeModels[i].id==this.AddedAttribute.attributeModels[k].id)
                  {
                      this.attribute.attributeModels[i].isChecked=true;
                      this.attribute.attributeModels[i].isDisabled=true;
                  }
              }
            }
              for(var kk=0;kk<result.attributeModels.length;kk++)
              {
                  this.actualAttributeModels.push(result.attributeModels[kk]);
              }
          }

        });
   
    }

    SetIsChecked(row,event) {
        row.isChecked=event.checked;
    }

    ngOnInit() {
        this.FetchBasicData();  
    }

    OnPaginateChange(event:PageEvent) {
       // console.log(event);
        let page=event.pageIndex;
        let size=event.pageSize;
        page=page+1;
        this.attribute.pageSize=event.pageSize;
        this.attribute.page=page;
        this.FetchBasicData();       
    }
    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
  
    }
}
