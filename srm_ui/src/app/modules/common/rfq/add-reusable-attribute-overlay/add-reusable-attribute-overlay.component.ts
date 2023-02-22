/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import { RFQHeaderAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attribute-model';
import { AttributeItemComponent } from '../header-component/attribute-item/attribute-item.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-reusable-attribute-overlay',
    templateUrl: './add-reusable-attribute-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddReusableAttributeOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    displayedColumns: string[] = ['id', 'title', 'name', 'group'];

    issuccess = false;
    iserror = false;

    title: string = "";
    name: string = "";
    group: string = "";

    rfqId: string;

    attributeGroupSearchModel: AttributeGroupSearchModel = new AttributeGroupSearchModel();
    attributeGroupModel: AttributeGroupViewModel[];
    attributeGroupModelStore: AttributeGroupViewModel[];

    context: AttributeItemComponent;
    pageEvent: PageEvent;
    ErrorInfo: string = "";
    selectedTerms: any[] = [];

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddReusableAttributeOverlayComponent>,
        public dialog: MatDialog,
        private rfqHeaderAttributeService: RfqHeaderAttributeService
    ) {
        this.context = data.context;
        this.rfqId = data.rfqId;
        this.attributeGroupSearchModel.pageSize = 10;
        this.attributeGroupSearchModel.page = 1;
        this.attributeGroupSearchModel.column = "title"
        this.attributeGroupSearchModel.direction = "desc";
    }

    sortData(sort: Sort) {
        this.attributeGroupSearchModel.direction = sort.direction;
        this.attributeGroupSearchModel.column = sort.active;
        this.fetchReusableAttributeListData(this.rfqId);
    }

    doAction() {
        this.dialogRef.close();
    }

    searchReusableAttributeList() {
        //let dataList: AttributeGroupViewModel[] = this.attributeGroupModelStore;
        /*  if (this.title && this.title != "") {
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
         this.attributeGroupModel = dataList; */
        if (this.title && this.title != "") {
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.title.indexOf(this.title) > -1;
             }) */
            this.attributeGroupSearchModel.title = this.title;
        }
        else {
            this.attributeGroupSearchModel.title = null;
        }
        if (this.name && this.name != "") {
            /* dataList = dataList.filter((data: AttributeGroupViewModel) => {
                return data.name.indexOf(this.name) > -1;
            }) */
            this.attributeGroupSearchModel.name = this.name;
        }
        else {
            this.attributeGroupSearchModel.name = null;
        }
        if (this.group && this.group != "") {
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.groupName.indexOf(this.groupName) > -1;
             }) */
            this.attributeGroupSearchModel.group = this.group;
        }
        else {
            this.attributeGroupSearchModel.group = null;
        }
        this.attributeGroupSearchModel.pageSize = 10;
        this.attributeGroupSearchModel.page = 1;
        this.attributeGroupSearchModel.totalItems = 0;
        this.attributeGroupSearchModel.totalPages = 0;
        this.paginator.pageIndex = 0;
        this.fetchReusableAttributeListData(this.rfqId);
    }

    fetchReusableAttributeListData(rfqId: string) {
        this.rfqId = rfqId;
        this.attributeGroupSearchModel.rfqId = this.rfqId;
        this.rfqHeaderAttributeService.getReusableAttributeList(this.attributeGroupSearchModel).subscribe(result => {
            // console.log(result);
            this.attributeGroupSearchModel = result.data;
            this.attributeGroupModel = result.data.attributeGroupViewModels;
            this.attributeGroupModelStore = result.data;

            for (let k = 0; k < this.attributeGroupModel.length; k++) {
                if (this.attributeGroupModel[k].isChecked === true) {
                    this.attributeGroupModel[k].isdisable=true;
                  this.selectedTerms.push(this.attributeGroupModel[k].title);
                }
              }
            //this.searchReusableAttributeList();
        });
    }

    saveReusableAttributeList() {
        this.ErrorInfo = "";
        let rfqHeaderAttributes: RFQHeaderAttributeModel[] = [];


        for (var k = 0; k < this.attributeGroupModel.length; k++) {
            if (this.attributeGroupModel[k].isChecked == true && this.attributeGroupModel[k].isdisable != true) {
                if (this.attributeGroupModel[k].attributeModels.length == 0) {
                    this.ErrorInfo = "Attribute List " + this.attributeGroupModel[k].title + " has no items."
                    return;
                }
                for (var m = 0; m < this.attributeGroupModel[k].attributeModels.length; m++) {
                    let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
                    rfqHeaderAttribute.attributeId = this.attributeGroupModel[k].attributeModels[m].id;
                    rfqHeaderAttribute.attributeGroupId = this.attributeGroupModel[k].id;
                    rfqHeaderAttribute.attributeDataTypeId = this.attributeGroupModel[k].attributeModels[m].dataTypeId;
                    rfqHeaderAttribute.rFXId = this.rfqId;

                    rfqHeaderAttributes.push(rfqHeaderAttribute);
                }
            }
        }
        if (rfqHeaderAttributes.length > 0 && this.ErrorInfo == "") {
            this.rfqHeaderAttributeService.saveHeaderAttribute(rfqHeaderAttributes).subscribe(result => {
                this.dialogRef.close();
                this.fetchReusableAttributeListData(this.rfqId);
                this.context && this.context.fetchRfqHeaderAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
        }
    }

    ngOnInit(): void {
        this.fetchReusableAttributeListData(this.rfqId);
    }
    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.attributeGroupSearchModel.pageSize = event.pageSize;
        this.attributeGroupSearchModel.page = page;
        this.fetchReusableAttributeListData(this.rfqId);
    }

    showOptions(event: MatCheckboxChange, row): void {
        debugger
        if (event.checked === true) {
            this.selectedTerms.push(row);
        } else {
            this.selectedTerms.splice(this.selectedTerms.indexOf(row), 1);
        }
    }
}
