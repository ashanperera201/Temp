/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { FuseAlertService } from '@fuse/components/alert';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { RFQHeaderTermsConditionSearchModel } from 'app/main/Models/etendering/ViewModels/rfq-header-terms-condition-search-model';
import { RFQHeaderTermsConditionModel } from 'app/main/Models/etendering/ViewModels/rfq-header-terms-condition-view-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { TermsConditionViewModel } from 'app/main/Models/etendering/ViewModels/terms-condition-view-model';
import { AddEditOverlayComponent } from 'app/modules/common/terms/add-edit-overlay/add-edit-overlay.component';
import { RfqHeaderTCService } from 'app/shared/Services/etendering/RFQ/Header/rfq-header-tc.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { AddTermsOverlayComponent } from '../../add-terms-overlay/add-terms-overlay.component';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-term-condition',
  templateUrl: './term-condition.component.html',
  styleUrls: ['./term-condition.component.scss']
})
export class TermConditionComponent implements OnInit {

  @Input() RFQID: any;
  @Input() rfqModel: RFQViewModel;
  @Input() displayedColumn5: string[] = ['No', 'RFQId ', 'TermsConditionId ', 'InputType ', 'Input ', 'Default ', 'BeforeQuoteId ', 'EndOfQuoteId '];
  attributecategoryTypes: any[];
  beforequoteOptions: any[];
  endOfquoteOptions: any[];

  pageEvent: PageEvent;

  rFQHeaderTermsConditionSearchModel: RFQHeaderTermsConditionSearchModel = new RFQHeaderTermsConditionSearchModel();
  Message: string = "";
  guiEmpty = "00000000-0000-0000-0000-000000000000";

  constructor(public dialog: MatDialog,
    private rfqHeaderTCService: RfqHeaderTCService,
    private termsService: TermsService,
    private _fuseConfirmationService: FuseConfirmationService,
    private _fuseAlertService: FuseAlertService, private _snackBar: MatSnackBar) {
    this.rFQHeaderTermsConditionSearchModel.pageSize = 5;
    this.rFQHeaderTermsConditionSearchModel.page = 1;
  }

  ngOnInit(): void {
    this.fetchRfqHeaderTermsConditionData(this.RFQID);
  }

  openSnackBar(message: string): void {
    this._snackBar.open(message + ' ' + 'successfully', 'x', { duration: 3000 });
  }

  addTerms() {
    const dialogRef = this.dialog.open(AddTermsOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqHeaderTermsConditionListComponent": this, "rfqId": this.RFQID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.isAdded) {
        this.Message = "Added";
        this.fetchRfqHeaderTermsConditionData(this.RFQID);
        /*  this.show("successerror");
         setTimeout(() => { this.dismiss("successerror") }, 3000); */
        this.openSnackBar(this.Message);
      }
    });
  }

  addNewTerms() {
    const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqId": this.RFQID } });
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.isAdded) {
        let rfqHeaderTermsCondition: RFQHeaderTermsConditionModel = new RFQHeaderTermsConditionModel();
        rfqHeaderTermsCondition.rFQId = this.RFQID;
        rfqHeaderTermsCondition.termsConditionId = dialogRef.componentInstance.termsCondition.id;
        let rfqHeaderTermsConditions: RFQHeaderTermsConditionModel[] = [];
        rfqHeaderTermsConditions.push(rfqHeaderTermsCondition);

        let isAdded = dialogRef.componentInstance.isAdded;
        this.rfqHeaderTCService.SaveRFQHeaderTermsCondition(rfqHeaderTermsConditions).subscribe(result => {
          this.fetchRfqHeaderTermsConditionData(this.RFQID);
          this.Message = "Added";
          /*  this.show("successerror");
           setTimeout(() => { this.dismiss("successerror") }, 3000); */
          this.openSnackBar(this.Message);
        });
      }
    });
  }

  OnPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    let size = event.pageSize;
    page = page + 1;
    this.rFQHeaderTermsConditionSearchModel.pageSize = event.pageSize;
    this.rFQHeaderTermsConditionSearchModel.page = page;
    this.fetchRfqHeaderTermsConditionData(this.RFQID);
    //this.dataSource=   this.CreatePaginationData(page,size);

  }

  sortData(sort: Sort) {
    this.rFQHeaderTermsConditionSearchModel.direction = sort.direction;
    this.rFQHeaderTermsConditionSearchModel.column = sort.active;
    this.fetchRfqHeaderTermsConditionData(this.RFQID);
  }

  attributeCategorys: any = [];
  quotes: any = [];

  fetchRfqHeaderTermsConditionData(rfqId: string) {
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

    this.rFQHeaderTermsConditionSearchModel.RFQId = rfqId;
    this.rfqHeaderTCService.GetRFQHeaderTermsConditionList(this.rFQHeaderTermsConditionSearchModel).subscribe(result => {
      refference.close();
      this.rFQHeaderTermsConditionSearchModel = result;
      if (result != null) {
        if (this.rFQHeaderTermsConditionSearchModel.rfqTermsConditionModel.length > 0) {
          this.attributeCategorys = this.rFQHeaderTermsConditionSearchModel.rfqTermsConditionModel[0].attributeCategoryTypes;
          this.quotes = this.rFQHeaderTermsConditionSearchModel.rfqTermsConditionModel[0].beforeQuoteOptions;
        }
      }
    });
  }

  EditRFQHeaderTermsCondition(row: any) {
    const dialogRef = this.dialog.open(AddEditOverlayComponent, { data: { "id": row.termsConditionId, "rfqId": this.RFQID } });
    dialogRef.componentInstance.title = "Edit";
    dialogRef.componentInstance.submitButtonText = "Update";
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(result => {
      if (dialogRef.componentInstance.isAdded) {
        let termsConditionViewModel: TermsConditionViewModel = dialogRef.componentInstance.termsCondition;
        let rfqHeaderTermsCondition: RFQHeaderTermsConditionModel = new RFQHeaderTermsConditionModel();
        rfqHeaderTermsCondition.rFQId = this.RFQID;
        rfqHeaderTermsCondition.termsConditionId = termsConditionViewModel.id;
        let rfqHeaderTermsConditions: RFQHeaderTermsConditionModel[] = [];
        rfqHeaderTermsConditions.push(rfqHeaderTermsCondition);

        let isAdded = dialogRef.componentInstance.isAdded;
        this.rfqHeaderTCService.SaveRFQHeaderTermsCondition(rfqHeaderTermsConditions).subscribe(result => {
          this.fetchRfqHeaderTermsConditionData(this.RFQID);
          if (isAdded) {
            this.Message = "Updated";
            /* this.show("successerror");
            setTimeout(() => { this.dismiss("successerror") }, 3000); */
            this.openSnackBar(this.Message);
          }
        });
      }
    });
  }

  DeleteRFQHeaderTermsCondition(model: RFQHeaderTermsConditionModel[]) {
    const dialogRef = this._fuseConfirmationService.open({
      "title": "Remove contact",
      "message": "Are you sure you want to delete this record?",
      "icon": {
        "show": true,
        "name": "heroicons_outline:exclamation",
        "color": "warn"
      },
      "actions": {
        "confirm": {
          "show": true,
          "label": "Remove",
          "color": "warn"
        },
        "cancel": {
          "show": true,
          "label": "Cancel"
        }
      },
      "dismissible": true
    });
    dialogRef.addPanelClass('confirmation-dialog');

    dialogRef.afterClosed().subscribe((result) => {
      if (result == "confirmed") {
        this.rfqHeaderTCService.DeleteRFQHeaderTermsCondition([model]).subscribe(result => {
          let rfqHeaderTermsCondition: any = model;
          let termsCondition = new TermsConditionViewModel();
          if (rfqHeaderTermsCondition.isEditable) {
            termsCondition.id = rfqHeaderTermsCondition.termsConditionId;
            this.termsService.DeleteTermsCondition([termsCondition]).subscribe(result => {
              this.Message = "Deleted";
              this.fetchRfqHeaderTermsConditionData(this.RFQID);
              /*  this.show("successerror");
               setTimeout(() => { this.dismiss("successerror") }, 3000); */
              this.openSnackBar(this.Message);
            });
          }
          else {
            this.Message = "Deleted";
            this.fetchRfqHeaderTermsConditionData(this.RFQID);
            /* this.show("successerror");
            setTimeout(() => { this.dismiss("successerror") }, 3000); */
            this.openSnackBar(this.Message);
          }

        });
      }
    });
  }

  show(name: string): void {
    this._fuseAlertService.show(name);
  }

  dismiss(name: string): void {
    this._fuseAlertService.dismiss(name);
  }

  UpdateRFQTermsCondition(row: any, typeOfFieldTpBeUpdated) {
    if (typeOfFieldTpBeUpdated == "Cat") {
      row.isAttributeCategorySave = true;
    }
    else if (typeOfFieldTpBeUpdated == "EQ") {
      row.isEndOfQuoteIdSave = true;
    }
    else if (typeOfFieldTpBeUpdated == "BQ") {
      row.isBeforeQuoteIdSave = true;
    }
    else if (typeOfFieldTpBeUpdated == "Def") {
      row.isDefaultSave = true;
    }
    else if (typeOfFieldTpBeUpdated == "Edit") {
      row.isEditableSave = true;
    }

    let rfqHeaderTermsConditions: RFQHeaderTermsConditionModel[] = [];
    rfqHeaderTermsConditions.push(row);

    this.rfqHeaderTCService.SaveRFQHeaderTermsCondition(rfqHeaderTermsConditions).subscribe(result => {
      this.Message = "Updated";
      this.fetchRfqHeaderTermsConditionData(this.RFQID);
      /*  this.show("successerror");
       setTimeout(() => { this.dismiss("successerror") }, 3000); */
      this.openSnackBar(this.Message);
    });
  }

  selectQuote(quoteId) {
    let quote = "-";
    this.quotes.forEach(element => {
      if (element.id == quoteId) {
        quote = element.text;
        return quote;
      }
    });
    return quote;
  }

}