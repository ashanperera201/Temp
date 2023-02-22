/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, ViewChild, ViewEncapsulation, Input, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { RfqHeaderTCService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-tc.service';
import { TermsConditionSearchModel } from 'app/main/Models/etendering/ViewModels/terms-condition-search-model';
import { TermsConditionViewModel } from 'app/main/Models/etendering/ViewModels/terms-condition-view-model';
import { RFQHeaderTermsConditionModel } from 'app/main/Models/etendering/ViewModels/rfq-header-terms-condition-view-model';
import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'add-reusable-attribute-overlay',
    templateUrl: './add-terms-overlay.component.html',
    encapsulation: ViewEncapsulation.None
})

export class AddTermsOverlayComponent {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

    displayedColumns: string[] = ['id', 'name', 'inputtype', 'preview'];
    @Input() rfqId: any;

    @ViewChild(MatSort) sort: MatSort;

    templateData: any = [];
    useremail: string = '';

    selectedId: any = [];
    errormessage = 'Something went wrong, please try again.';
    successmessage = 'Successfully added the template';
    issuccess = false;
    iserror = false;
    rfqHeaderTermsConditionViewModel: RFQHeaderTermsConditionModel[];
    nameOf: string;
    inputtype: string;
    termsConditionViewModels: TermsConditionViewModel[] = [];
    isAdded = false;
    selectedTerms: any[] = [];
    selection = new SelectionModel<TermsConditionViewModel>(true, []);
    searchName: any;
    searcInputType: any;

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<AddTermsOverlayComponent>,
        public dialog: MatDialog, public termsService: TermsService,
        private rfqHeaderTCService: RfqHeaderTCService
    ) {
        this.rfqId = data.rfqId;
        this.rfqHeaderTermsConditionViewModel = data.rfqHeaderTermsConditionListComponent.rFQHeaderTermsConditionSearchModel.rfqTermsConditionModel;
        // Assign the data to the data source for the table to render
        let termsConditionSearchModel = new TermsConditionSearchModel();
        termsConditionSearchModel.RFQId = this.rfqId;
        termsConditionSearchModel.isRFQ = true;
        termsConditionSearchModel.page = 1;
        termsConditionSearchModel.pageSize = 1000;
        this.termsService.GetTermsConditionList(termsConditionSearchModel).subscribe(result => {
            this.termsConditionViewModels = result.termsConditionModels;
            if (this.termsConditionViewModels.length !== 0) {
                for (let index = 0; index < this.rfqHeaderTermsConditionViewModel.length; index++) {

                    this.selectedTerms.push(this.rfqHeaderTermsConditionViewModel[index].name);
                }
            }
        });


    }

    AddTCToRFQ() {
        //RFQTermsConditionViewModel to be created of not created of corresponding RFQTermsConditionModel backend
        let localTermsConditionViewModels: TermsConditionViewModel[] = [];
        for (var k = 0; k < this.termsConditionViewModels.length; k++) {
            if (this.termsConditionViewModels[k].isChecked == true) {
                localTermsConditionViewModels.push(this.termsConditionViewModels[k]);
                this.selectedTerms.push(this.termsConditionViewModels[k]);
            }
        }
    }

    searchData() {
        let termsConditionSearchModel = new TermsConditionSearchModel();
        termsConditionSearchModel.RFQId = this.rfqId;
        termsConditionSearchModel.page = 1;
        termsConditionSearchModel.pageSize = 1000;
        termsConditionSearchModel.tCs = this.searchName;
        termsConditionSearchModel.inputType = this.searcInputType;
        this.termsService.GetTermsConditionList(termsConditionSearchModel).subscribe(result => {
            this.termsConditionViewModels = result.termsConditionModels;
        });
    }

    doAction() {
        this.dialogRef.close();
        //window.location.reload() ;
    }

    fetchRfqHeaderTermsConditionData(rfqId: string) {
        this.rfqId = rfqId;
        this.rfqHeaderTCService.getRFQHeaderTermsConditionByRFQId(this.rfqId).subscribe(result => {
            this.rfqHeaderTermsConditionViewModel = result.data;
        });
    }

    DownloadMedia(eTMediaId, fileName, fileExtension) {
        let eTMedia: any = { id: eTMediaId }
        this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

    saveTemplate() {
        let rfqHeaderTermsConditions: RFQHeaderTermsConditionModel[] = [];
        for (var k = 0; k < this.termsConditionViewModels.length; k++) {
            if (!(this.rfqHeaderTermsConditionViewModel.map(x => x.termsConditionId).includes(this.termsConditionViewModels[k].id)) && this.termsConditionViewModels[k].isChecked == true) {
                let rfqHeaderTermsCondition: RFQHeaderTermsConditionModel = new RFQHeaderTermsConditionModel();
                rfqHeaderTermsCondition.rFQId = this.rfqId;
                rfqHeaderTermsCondition.termsConditionId = this.termsConditionViewModels[k].id;
                rfqHeaderTermsCondition.rFQId = this.rfqId;
                rfqHeaderTermsConditions.push(rfqHeaderTermsCondition);
            }
        }
        if (rfqHeaderTermsConditions.length > 0) {
            this.rfqHeaderTCService.SaveRFQHeaderTermsCondition(rfqHeaderTermsConditions).subscribe(result => {
                this.dialogRef.close();
                this.fetchRfqHeaderTermsConditionData(this.rfqId);
                this.isAdded = true;
            });
        }
    }

    isAvailable(id) {
        if (this.rfqHeaderTermsConditionViewModel.map(x => x.termsConditionId).includes(id)) {
            return true;
        }
        else {
            return false;
        }
    }

    showOptions(event: MatCheckboxChange, row): void {
        if (event.checked === true) {
            this.selectedTerms.push(row);
        } else {
            this.selectedTerms.splice(this.selectedTerms.indexOf(row), 1);
        }
    }
}
