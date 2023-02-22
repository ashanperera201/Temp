import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { RfqPartLineAttributeService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line-attribute.service';
import { RFQPartLineAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-partline-attribute-model';
import { RFQAttributeItemsComponent } from '../Lines/rfq-part-line/rfq-attribute-items/rfq-attribute-items.component';
import { RfqPartLineService } from 'app/shared/Services/etendering/RFQ/Lines/rfq-part-line.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

@Component({
    selector: 'add-attribute-item-overlay',
    templateUrl: './add-line-attribute-item-overlay.component.html',
    styleUrls: ['./add-line-attribute-item-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddLineAttributeItemOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;

    attributeName: any;
    description: any;

    issuccess = false;
    iserror = false;

    rfqPartLines: any[];
    detailsDisplayMap = new Map();

    rfqId: string;
    partLineId: string;

    attributeSearchModel: AttributeSearchModel = new AttributeSearchModel();
    attributeModel: AttributeViewModel[];
    attributeModelStore: AttributeViewModel[];
    context: RFQAttributeItemsComponent;
    NewListId: string = "";

    selectedAttribute: any[] = [];
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddLineAttributeItemOverlayComponent>,
        public dialog: MatDialog,
        private rfqPartLineService: RfqPartLineService,
        private rfqPartLineAttributeService: RfqPartLineAttributeService
    ) {
        this.context = data.context;
        this.attributeSearchModel.pageSize = 10;
        this.attributeSearchModel.page = 1;
        this.rfqId = data.rfqId;
        this.partLineId = data.partLineId;
        console.log(this.partLineId);
        if (data.NewListId != null) {
            this.NewListId = data.NewListId;
        }
    }

    OnPaginateChange(event: PageEvent) {
        let page = event.pageIndex;
        let size = event.pageSize;
        page = page + 1;
        this.attributeSearchModel.pageSize = event.pageSize;
        this.attributeSearchModel.page = page;
        this.fetchAttributeItemData();
    }

    sortData(sort: Sort) {
        this.attributeSearchModel.direction = sort.direction;
        this.attributeSearchModel.column = sort.active;
        this.fetchAttributeItemData();
    }

    doAction() {
        this.dialogRef.close();
    }
    searchItem() {
        if (this.attributeName && this.attributeName != "") {
            this.attributeSearchModel.attributeName = this.attributeName;
        }
        else {
            this.attributeSearchModel.attributeName = null;
        }

        if (this.description && this.description != "") {
            this.attributeSearchModel.description = this.description;
        }
        else {
            this.attributeSearchModel.description = null;
        }
        this.attributeSearchModel.pageSize = 10;
        this.attributeSearchModel.page = 1;
        this.attributeSearchModel.totalItems = 0;
        this.attributeSearchModel.totalPages = 0;
        this.paginator.pageIndex = 0;
        this.fetchAttributeItemData();
    }
    searchAttributeItem() {
        //debugger;
        /*  this.attributeSearchModel.name = this.attributeName;
         this.attributeSearchModel.description = this.description; */
        //this.attributeSearchModel.rfqPartLineId = this.partLineId;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
        this.rfqPartLineAttributeService.getPartLineAttributeItemByRFQId(this.attributeSearchModel).subscribe(result => {
            refference.close()
            this.attributeModel = result.data.attributeModels;
            this.attributeModelStore = result.data.attributeModels;
            this.attributeSearchModel = result.data
            for (let k = 0; k < this.attributeModelStore.length; k++) {
                if (this.attributeModelStore[k].isChecked === true) {
                    this.attributeModelStore[k].ischeckdisabled=true;
                    this.selectedAttribute.push(this.attributeModelStore[k].attributeName);
                    if(this.attributeModelStore[k].attributeGroupModels!=null){
                        for(let j = 0; j < this.attributeModelStore[k].attributeGroupModels.length; j++){
                            if (this.attributeModelStore[k].attributeGroupModels[j].isChecked === true) {
                                this.attributeModelStore[k].attributeGroupModels[j].isdisable=true;
                            }
                        }
                    }
                    
                }
            }
        });
    }

    toggleDisplay(id: string) {
        var existingVal = this.detailsDisplayMap.get(id);
        if (existingVal) {
            this.detailsDisplayMap.set(id, !existingVal)
        } else {
            this.detailsDisplayMap.set(id, true)
        }
    }

    getActiveDetailsTab(id: string): boolean {
        return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
    }

    fetchAttributeItemData() {
        this.attributeSearchModel.rfqId = this.rfqId;
        this.attributeSearchModel.rfqPartLineId = this.partLineId;
        this.attributeSearchModel.NewListId = this.NewListId
        this.searchAttributeItem();
    }

    //fetchRfqPartLineData() {
    //this.fetchAttributeItemData(this.rfqId, this.partLineId);
    /* this.rfqPartLineService.getPartLineByPartLineRFQId(this.rfqId).subscribe(result => {
        this.rfqPartLines = result.data;
        //this.fetchAttributeItemData(this.rfqId, this.partLineId);
    }); */
    //}
    SaveItem() {
        this.isSaved=true;
        if (this.NewListId == "") {

            this.saveAttributeItem()
        }
        else {

            this.saveAttributeItemNew()
        }
    }
    saveAttributeItemNew() {
        let rfqLinesAttributes: RFQPartLineAttributeModel[] = [];
        for (var k = 0; k < this.attributeModel.length; k++) {
            if (this.attributeModel[k].isChecked == true) {
                let rfqLineAttribute: RFQPartLineAttributeModel = new RFQPartLineAttributeModel();
                rfqLineAttribute.attributeId = this.attributeModel[k].id;
                rfqLineAttribute.attributeGroupId = this.NewListId;
                rfqLineAttribute.rfqId = this.rfqId;
                rfqLineAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;
                rfqLineAttribute.rfqPartLineId = this.partLineId;
                rfqLinesAttributes.push(rfqLineAttribute);
            }
        }
        if (rfqLinesAttributes.length > 0) {
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
            this.rfqPartLineAttributeService.savePartLineAttribute(rfqLinesAttributes).subscribe(result => {
                refference.close();
                this.isSaved=false;
                this.dialogRef.close();
                // this.fetchAttributeItemData(this.rfqId);
                this.context && this.context.fetchRfqPartLineAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
        }
    }
    saveAttributeItem() {
        let rfqLinesAttributes: RFQPartLineAttributeModel[] = [];

        for (var k = 0; k < this.attributeModel.length; k++) {
            if (this.attributeModel[k].isChecked == true) {
                if (this.attributeModel[k].attributeGroupModels != null && this.attributeModel[k].attributeGroupModels.length > 0) {
                    let checkedgroup = this.attributeModel[k].attributeGroupModels.filter(i => i.isChecked == true)
                    if (checkedgroup.length > 0) {
                        /* for (var m = 0; m < this.attributeModel[k].attributeGroupModels.length; m++) {
                            if (this.attributeModel[k].attributeGroupModels[m].isChecked == true) {
                                let rfqLineAttribute: RFQPartLineAttributeModel = new RFQPartLineAttributeModel();
                                rfqLineAttribute.attributeId = this.attributeModel[k].id;
                                rfqLineAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
                                rfqLineAttribute.rfqId = this.rfqId;
                                rfqLineAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;
                                rfqLineAttribute.rfqPartLineId = this.partLineId;

                                rfqLinesAttributes.push(rfqLineAttribute);
                            }
                        } */
                        for (var m = 0; m < checkedgroup.length; m++) {
                            if (checkedgroup[m].isChecked == true) {
                                let rfqLineAttribute: RFQPartLineAttributeModel = new RFQPartLineAttributeModel();
                                rfqLineAttribute.attributeId = this.attributeModel[k].id;
                                rfqLineAttribute.attributeGroupId = checkedgroup[m].id;
                                rfqLineAttribute.rfqId = this.rfqId;
                                rfqLineAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;
                                rfqLineAttribute.rfqPartLineId = this.partLineId;
                                rfqLinesAttributes.push(rfqLineAttribute);
                            }

                        }
                    }
                    else {
                        let rfqLineAttribute: RFQPartLineAttributeModel = new RFQPartLineAttributeModel();
                        rfqLineAttribute.attributeId = this.attributeModel[k].id;
                        //rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
                        rfqLineAttribute.rfqId = this.rfqId;
                        rfqLineAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;
                        rfqLineAttribute.rfqPartLineId = this.partLineId;
                        rfqLinesAttributes.push(rfqLineAttribute);
                    }
                }
                else {
                    let rfqLineAttribute: RFQPartLineAttributeModel = new RFQPartLineAttributeModel();
                    rfqLineAttribute.attributeId = this.attributeModel[k].id;
                    //rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
                    rfqLineAttribute.rfqId = this.rfqId;
                    rfqLineAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;
                    rfqLineAttribute.rfqPartLineId = this.partLineId;
                    rfqLinesAttributes.push(rfqLineAttribute);
                }
            }
        }
        if (rfqLinesAttributes.length > 0) {
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
            this.rfqPartLineAttributeService.savePartLineAttribute(rfqLinesAttributes).subscribe(result => {
                refference.close();
                this.isSaved=false;
                this.dialogRef.close();
                this.fetchAttributeItemData();
                this.context && this.context.fetchRfqPartLineAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
        }
    }

    ngOnInit(): void {
        this.fetchAttributeItemData();
    }

    partLineChange() {
        // this.fetchAttributeItemData(this.rfqId, this.partLineId);
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedAttribute.push(row);
        } else {
            this.selectedAttribute.splice(this.selectedAttribute.indexOf(row), 1);
        }
    }
}
