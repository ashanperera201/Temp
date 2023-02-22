/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AttributeSearchModel } from 'app/main/Models/etendering/attribute-search-model';
import { RfqHeaderAttributeService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-attribute.service';
import { AttributeViewModel } from 'app/main/Models/etendering/ViewModels/attribute-view-model';
import { RFQHeaderAttributeModel } from 'app/main/Models/etendering/ViewModels/rfq-header-attribute-model';
import { AttributeItemComponent } from '../header-component/attribute-item/attribute-item.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
@Component({
    selector: 'add-attribute-item-overlay',
    templateUrl: './add-attribute-item-overlay.component.html',
    styleUrls: ['./add-attribute-item-overlay.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddAttributeItemOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    pageEvent: PageEvent;

    attributeName: any;
    description: any;

    issuccess = false;
    iserror = false;

    detailsDisplayMap = new Map();

    rfqId: string;

    attributeSearchModel: AttributeSearchModel = new AttributeSearchModel();
    attributeModel: AttributeViewModel[];
    attributeModelStore: AttributeViewModel[];
    context: AttributeItemComponent;
    NewListId: string = "";

    selectedAttribute: any[] = [];
    isSaved:boolean =false;
    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddAttributeItemOverlayComponent>,
        public dialog: MatDialog,
        private rfqHeaderAttributeService: RfqHeaderAttributeService
    ) {
        this.context = data.context;
        this.rfqId = data.rfqId;
        //  console.log( this.rfqId);
        this.attributeSearchModel.pageSize = 10;
        this.attributeSearchModel.page = 1;
        // console.log(this.rfqId)
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
        this.fetchAttributeItemData(this.rfqId);
    }

    sortData(sort: Sort) {
        this.attributeSearchModel.direction = sort.direction;
        this.attributeSearchModel.column = sort.active;
        this.fetchAttributeItemData(this.rfqId);
    }

    doAction() {
        this.dialogRef.close();
    }

    searchAttributeItem() {
        let dataList: AttributeViewModel[] = this.attributeModelStore;
        /*  if (this.attributeName && this.attributeName != "") {
             dataList = dataList.filter((data: AttributeViewModel) => {
                 return data.attributeName.toLowerCase().includes(this.attributeName.toLowerCase());
             })
         }
         if (this.description && this.description != "") {
             dataList = dataList.filter((data: AttributeViewModel) => {
                 return data.description.toLowerCase().includes(this.description.toLowerCase());
             })
         } */

        if (this.attributeName && this.attributeName != "") {
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.title.indexOf(this.title) > -1;
             }) */
            this.attributeSearchModel.attributeName = this.attributeName;
        }
        else {
            this.attributeSearchModel.attributeName = null;
        }


        if (this.description && this.description != "") {
            /*  dataList = dataList.filter((data: AttributeGroupViewModel) => {
                 return data.groupName.indexOf(this.groupName) > -1;
             }) */
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
        this.fetchAttributeItemData(this.rfqId);
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

    fetchAttributeItemData(rfqId: string) {
        this.attributeSearchModel.rfqId = rfqId;
        this.attributeSearchModel.NewListId = this.NewListId
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
        //console.log(this.attributeSearchModel);
        this.rfqHeaderAttributeService.getAttributeItemByRFQId(this.attributeSearchModel).subscribe(result => {
            refference.close();
            this.attributeModel = result.data.attributeModels;
            this.attributeModelStore = result.data.attributeModels;
            this.attributeSearchModel = result.data
            //this.searchAttributeItem();
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
        let rfqHeaderAttributes: RFQHeaderAttributeModel[] = [];
        for (var k = 0; k < this.attributeModel.length; k++) {
            if (this.attributeModel[k].isChecked == true) {
                let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
                rfqHeaderAttribute.attributeId = this.attributeModel[k].id;
                rfqHeaderAttribute.attributeGroupId = this.NewListId;
                rfqHeaderAttribute.rFXId = this.rfqId;
                rfqHeaderAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;

                rfqHeaderAttributes.push(rfqHeaderAttribute);
            }
        }
       // console.log(rfqHeaderAttributes);
        if (rfqHeaderAttributes.length > 0) {
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
            this.rfqHeaderAttributeService.saveHeaderAttribute(rfqHeaderAttributes).subscribe(result => {
                refference.close();
                this.isSaved=false;
                this.dialogRef.close();
                // this.fetchAttributeItemData(this.rfqId);
                this.context && this.context.fetchRfqHeaderAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
        }
    }
    saveAttributeItem() {
        let rfqHeaderAttributes: RFQHeaderAttributeModel[] = [];

        for (var k = 0; k < this.attributeModel.length; k++) {
            if (this.attributeModel[k].isChecked == true) {
                if (this.attributeModel[k].attributeGroupModels != null && this.attributeModel[k].attributeGroupModels.length > 0) {
                    let checkedgroup = this.attributeModel[k].attributeGroupModels.filter(i => i.isChecked == true)
                    if (checkedgroup.length > 0) {
                        /*  for (var m = 0; m < this.attributeModel[k].attributeGroupModels.length; m++) {
                             if (this.attributeModel[k].attributeGroupModels[m].isChecked == true) {
                                 let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
                                 rfqHeaderAttribute.attributeId = this.attributeModel[k].id;
                                 rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
                                 rfqHeaderAttribute.rFXId = this.rfqId;
                                 rfqHeaderAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;
     
                                 rfqHeaderAttributes.push(rfqHeaderAttribute);
                             }
                         
                         } */

                        for (var m = 0; m < checkedgroup.length; m++) {
                            if (checkedgroup[m].isChecked == true) {
                                let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
                                rfqHeaderAttribute.attributeId = this.attributeModel[k].id;
                                rfqHeaderAttribute.attributeGroupId = checkedgroup[m].id;
                                rfqHeaderAttribute.rFXId = this.rfqId;
                                rfqHeaderAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;

                                rfqHeaderAttributes.push(rfqHeaderAttribute);
                            }

                        }
                    }
                    else {
                        let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
                        rfqHeaderAttribute.attributeId = this.attributeModel[k].id;
                        //rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
                        rfqHeaderAttribute.rFXId = this.rfqId;
                        rfqHeaderAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;

                        rfqHeaderAttributes.push(rfqHeaderAttribute);
                    }

                }
                else {
                    let rfqHeaderAttribute: RFQHeaderAttributeModel = new RFQHeaderAttributeModel();
                    rfqHeaderAttribute.attributeId = this.attributeModel[k].id;
                    //rfqHeaderAttribute.attributeGroupId = this.attributeModel[k].attributeGroupModels[m].id;
                    rfqHeaderAttribute.rFXId = this.rfqId;
                    rfqHeaderAttribute.attributeDataTypeId = this.attributeModel[k].dataTypeId;

                    rfqHeaderAttributes.push(rfqHeaderAttribute);
                }
            }
        }
       // console.log(rfqHeaderAttributes);
        if (rfqHeaderAttributes.length > 0) {
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } }); 
            this.rfqHeaderAttributeService.saveHeaderAttribute(rfqHeaderAttributes).subscribe(result => {
                refference.close();
                this.isSaved=false;
                this.dialogRef.close();
                // this.fetchAttributeItemData(this.rfqId);
                this.context && this.context.fetchRfqHeaderAttributeData(this.rfqId);
                this.context.message = "Added";
                this.context.show("successerror");
                setTimeout(() => { this.context.dismiss("successerror") }, 3000);
            });
        }
    }

    ngOnInit(): void {
        //debugger;
        this.fetchAttributeItemData(this.rfqId);
    }

    setParentIsChecked(at, event) {
        at.isChecked = event.checked;
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedAttribute.push(row);
        } else {
            this.selectedAttribute.splice(this.selectedAttribute.indexOf(row), 1);
        }
    }
}
