import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AttributeGroupService } from 'app/shared/Services/etendering/attribute-group.service';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import { RFQHeaderAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attribute-model';
import { AttributeItemComponent } from '../header-component/attribute-item/attribute-item.component';
import { AddNewAttributeOverlayComponent } from '../add-new-attribute-overlay/add-new-attribute-overlay.component';

@Component({
    selector: 'add-attrlist-item-overlay',
    templateUrl: './add-atttrlist-item-overlay.component.html',
  
    encapsulation: ViewEncapsulation.None
})
export class AddAttrlistItemOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['title', 'name', 'group'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    issuccess = false;
    iserror = false;

    title: string = "";
    name: string = "";
    group: string = "";

    rfqId: string;

    attributeGroupSearchModel: AttributeGroupSearchModel = new AttributeGroupSearchModel();
    attributeGroupModel: AttributeGroupViewModel[];
    attributeGroupModelStore: AttributeGroupViewModel[];

    context: AddAttrlistItemOverlayComponent;
    result:any={};
   

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddAttrlistItemOverlayComponent>,
        public dialog: MatDialog,
        private rfqHeaderAttributeService: RfqHeaderAttributeService,private attributeService: AttributeGroupService
    ) {
      
      this.context = data.context;
     
        this.rfqId = data.rfqId;
      
    }

    sortData(sort: Sort) {
        this.attributeGroupSearchModel.direction = sort.direction;
        this.attributeGroupSearchModel.column = sort.active;
        this.fetchReusableAttributeListData(this.rfqId);
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload();
    }

    searchReusableAttributeList() {
        let dataList: AttributeGroupViewModel[] = this.attributeGroupModelStore;
        if (this.title && this.title != "") {
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.title.toLowerCase().includes(this.title.toLowerCase());
            })
        }
        if (this.name && this.name != "") {
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.name.toLowerCase().includes(this.name.toLowerCase());
            })
        }
        if (this.group && this.group != "") {
            dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.groupName.toLowerCase().includes(this.group.toLowerCase());
            })
        }
        this.attributeGroupModel = dataList;
    }

    fetchReusableAttributeListData(rfqId: string) {
        this.rfqId = rfqId;
        this.attributeGroupSearchModel.rfqId=rfqId;
        this.attributeService.getNewAttributeList(this.attributeGroupSearchModel).subscribe(result => {
           //console.log(result);
            this.attributeGroupModel = result.attributeGroupViewModels;
           // console.log(result);
            this.attributeGroupModelStore = result;
            //this.searchReusableAttributeList();
        });
    }

  

    ngOnInit(): void {
        this.fetchReusableAttributeListData(this.rfqId);
    }
    SelectList(row){
        this.result=row;
        this.dialogRef.close(this.result);
    }
}