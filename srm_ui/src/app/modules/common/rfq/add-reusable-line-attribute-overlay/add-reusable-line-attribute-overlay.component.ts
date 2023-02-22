/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AttributeGroupSearchModel } from 'app/main/Models/etendering/attribute-group-search-model';
import { AttributeGroupViewModel } from 'app/main/Models/etendering/ViewModels/attribute-group-view-model';
import { RFQAttributeItemsComponent } from '../Lines/rfq-part-line/rfq-attribute-items/rfq-attribute-items.component';
import { RFQPartLineAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-attribute-model';
import { RfqPartLineAttributeService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attribute.service';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
    selector: 'add-reusable-attribute-overlay',
    templateUrl: './add-reusable-line-attribute-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AddReusableLineAttributeOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'title', 'name', 'group'];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    issuccess = false;
    iserror = false;

    title: string = "";
    name: string = "";
    group: string = "";

    rfqId: string;
    partLineId: string;

    attributeGroupSearchModel: AttributeGroupSearchModel = new AttributeGroupSearchModel();
    attributeGroupModel: AttributeGroupViewModel[];
    attributeGroupModelStore: AttributeGroupViewModel[];

    context: RFQAttributeItemsComponent;
    rfqPartLines: any[];
    pageEvent: PageEvent;
    ErrorInfo: string = "";
    selectedAttribute: any[] = [];
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddReusableLineAttributeOverlayComponent>,
        public dialog: MatDialog,
        private rfqPartLineService: RfqPartLineService,
        private rfqPartLineAttributeService: RfqPartLineAttributeService
    ) {
        this.context = data.context;
        this.rfqId = data.rfqId;
        this.partLineId = data.partLineId;
        this.attributeGroupSearchModel.pageSize = 10;
        this.attributeGroupSearchModel.page = 1;
        this.attributeGroupSearchModel.column = "title"
        this.attributeGroupSearchModel.direction = "desc";
    }

    sortData(sort: Sort) {
        this.attributeGroupSearchModel.direction = sort.direction;
        this.attributeGroupSearchModel.column = sort.active;
        this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
    }

    doAction() {
        this.dialogRef.close();
    }

    searchReusableAttributeList() {
        /*  this.attributeGroupSearchModel.title = this.title;
         this.attributeGroupSearchModel.name = this.name;
         this.attributeGroupSearchModel.group = this.group;
         this.attributeGroupSearchModel.rfqPartLineId = this.partLineId; */

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
        this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
    }

    /*  fetchRfqPartLineData() {
         this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
             this.rfqPartLines = result.data;
             this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
         });
     } */

    fetchReusableAttributeListData(rfqId: string, partLineId: string) {
        this.attributeGroupSearchModel.rfqId = rfqId;
        this.attributeGroupSearchModel.rfqPartLineId = partLineId;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
        this.rfqPartLineAttributeService.getPartLineReusableAttributeList(this.attributeGroupSearchModel).subscribe(result => {
            refference.close();
            this.attributeGroupSearchModel = result.data;
            this.attributeGroupModel = result.data.attributeGroupViewModels;

            for (let k = 0; k < this.attributeGroupModel.length; k++) {
                if (this.attributeGroupModel[k].isChecked === true) {
                    this.attributeGroupModel[k].isdisable=true;
                  this.selectedAttribute.push(this.attributeGroupModel[k].title);
                }
              }
            //this.attributeGroupModel = result.data;
            //this.attributeGroupModelStore = result.data;
        });
    }

    saveReusableAttributeList() {
        this.ErrorInfo = "";
        let rfqLinesAttributes: RFQPartLineAttributeModel[] = [];

        for (var k = 0; k < this.attributeGroupModel.length; k++) {
            if (this.attributeGroupModel[k].isChecked == true && this.attributeGroupModel[k].isdisable != true) {
                if (this.attributeGroupModel[k].attributeModels.length == 0) {
                    this.ErrorInfo = "Attribute List " + this.attributeGroupModel[k].title + " has no items."
                    return;
                }
                for (var m = 0; m < this.attributeGroupModel[k].attributeModels.length; m++) {
                    let rfqLineAttribute: RFQPartLineAttributeModel = new RFQPartLineAttributeModel();
                    rfqLineAttribute.attributeId = this.attributeGroupModel[k].attributeModels[m].id;
                    rfqLineAttribute.attributeGroupId = this.attributeGroupModel[k].id;
                    rfqLineAttribute.attributeDataTypeId = this.attributeGroupModel[k].attributeModels[m].dataTypeId;
                    rfqLineAttribute.rfqId = this.rfqId;
                    rfqLineAttribute.rfqPartLineId = this.partLineId;

                    rfqLinesAttributes.push(rfqLineAttribute);
                }
            }
        }
        if (rfqLinesAttributes.length > 0 && this.ErrorInfo == "") {
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
            this.rfqPartLineAttributeService.savePartLineAttribute(rfqLinesAttributes).subscribe(result => {
                this.dialogRef.close();
                refference.close();
                //this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
                this.context && this.context.fetchRfqLineAttributeData(this.rfqId, this.partLineId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
        }
    }

    ngOnInit(): void {
        this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
    }

    partLineChange() {
        this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
    }
    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.attributeGroupSearchModel.pageSize = event.pageSize;
        this.attributeGroupSearchModel.page = page;
        this.fetchReusableAttributeListData(this.rfqId, this.partLineId);
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedAttribute.push(row);
        } else {
            this.selectedAttribute.splice(this.selectedAttribute.indexOf(row), 1);
        }
    }
}
