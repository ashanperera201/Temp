import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RFQHeaderPaymentScheduleModel } from 'app/main/Models/etendering/rfq-header-payment-schedule-model';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import { RFQSupplierCostFactorGroupModel } from 'app/main/Models/etendering/rfq-supplier-cost-factor-group-model';
import { RFQSupplierHeaderAttributeGroupModel } from 'app/main/Models/etendering/rfq-supplier-header-attribute-group-model';
import { RFQSupplierHeaderInformationModel } from 'app/main/Models/etendering/rfq-supplier-header-information-model';
import { RFQSupplierHeaderPaymentScheduleModel } from 'app/main/Models/etendering/rfq-supplier-headerpayment-schedule-model';
import { RFQSupplierHeaderSurveyTemplateQuestionModel } from 'app/main/Models/etendering/rfq-supplierheader-surveytemplate-question-module';
import { EtenderingLookupViewModel } from 'app/main/Models/etendering/ViewModels/etendering-lookup-view-model';
import { RFQSupplierHeaderAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-attachment-view-model';
import { RFQSupplierHeaderCountryOriginModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-country-origin-model';
import { RFQSupplierHeaderDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-deliverable-model';
import { RFQSupplierHeaderDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-document-text-model';
import { RFQSupplierHeaderInformationAttatchmentModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-attatchment-model';
import { RFQSupplierHeaderNoteModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-note-model';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { AddEditShippingOverlayComponent } from '../../add-edit-shipping-overlay/add-edit-shipping-overlay.component';
import { CopyToLinesOverlayComponent } from '../../copy-to-lines-overlay/copy-to-lines-overlay.component';
import { RowData17, RowData19, RowData4, RowData6, RowData7, RowData8, RowData9 } from '../../rfq.component';
import { saveAs } from 'file-saver';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';

@Component({
  selector: 'app-surrogate-response-header-view',
  templateUrl: './surrogate-response-header-view.component.html',
  styleUrls: ['./surrogate-response-header-view.component.scss']
})

export class SurrogateResponseHeaderViewComponent implements OnInit {

  @Input() dataSource4: MatTableDataSource<RowData4>;
  @Input() displayedColumn19: string[];
  @Input() displayedColumn17: string[];
  @Input() displayedColumn18: string[];
  @Input() displayedColumn42: string[];
  @Input() displayedColumn43: string[];
  @Input() displayedColumn62: string[];
  @Input() displayedColumn72: string[];
  @Input() displayedColumn82: string[];
  @Input() displayedColumn92: string[];
  @Input() displayedColumn93: string[];
  @Input() rfqModel: RFQViewModel = new RFQViewModel();
  rfqId: any;
  supplierId: any;
  rfqSupplierHeaderInformationModel: RFQSupplierHeaderInformationModel = new RFQSupplierHeaderInformationModel;

  // Supplier Header Information Attatchment - Helani
  rfqSupplierHeaderInformationAttatchmentModel: RFQSupplierHeaderInformationAttatchmentModel[];

  // Supplier Header Attribute - Helani
  rfqSupplierHeaderAttributeGroupModel: RFQSupplierHeaderAttributeGroupModel[];

  // For Parent child relationship between header cost factor - Shohan
  detailsSupplierHeaderCFDisplayMap = new Map();

  // For parent child relationship for Supplier Line information
  detailsSupplierLineInformationDisplayMap = new Map();
  //--
  rfqSupplierHeaderDeliverableModel: RFQSupplierHeaderDeliverableModel[];
  rfqSupplierHeaderInformationModels: RFQSupplierHeaderInformationModel[];

  // Supplier Header Country Origin - Helani
  rfqSupplierHeaderCountryOriginModel: RFQSupplierHeaderCountryOriginModel[];

  //Supplier Header Note - Manula
  rfqSupplierHeaderNoteModel: RFQSupplierHeaderNoteModel[];

  // Supplier Header cost factor - Shohan 
  rfqSupplierCostFactorGroupModel: RFQSupplierCostFactorGroupModel[];
  // Supplier header Document text - Shohan 
  rfqSupplierHeaderDocumentTextModel: RFQSupplierHeaderDocumentTextViewModel[];
  detailsHeaderAttributeDisplayMap = new Map();

  //supplier header attachment view model - Rahal
  rfqSupplierHeaderAttachmentViewModel: RFQSupplierHeaderAttachmentViewModel[] = [];

  frmHeaderAttachmentList: FormGroup;
  etmedia: any = { id: "00000000-0000-0000-0000-000000000000", fileName: "" };

  rfqSupplierHeaderPaymentScheduleModel: RFQSupplierHeaderPaymentScheduleModel[];
  rfqHeaderPaymentScheduleModel: RFQHeaderPaymentScheduleModel[];
  etenderingLookupViewModel: EtenderingLookupViewModel[];
  rfqSupplierHeaderSurveyTemplateQuestionModel: RFQSupplierHeaderSurveyTemplateQuestionModel[];
  rfqSurveyQuestionModel: RFQQuestionModel[];
  AttributeFieldTypes: any[];
  private total = 0;
  private total1 = 0;
  private total2 = 0;
  private total3 = 0;
  private total4 = 0;
  private total5 = 0;

  private totalbwork = 0;
  private totalbpayment = 0;
  private totalbreaseValue = 0;
  private totalswork = 0;
  private totalspayment = 0;
  private totalsrelasevalue = 0;

  private value;
  rfqCurrencies: any = [];
  showData = false;
  currencies: any = [];

  constructor(public dialog: MatDialog, private rfaqService: RfaqService, private rfqService: RfqService, private termsService: TermsService) {
    this.supplierId = 'EB1AF284-3B53-4FE1-4D63-08D9DB1C6565'
    this.rfqId = 'F1E764E6-DD24-476C-B516-08D95FA0983A';
  }

  ngOnInit(): void {
    this.fetchRFQSupplierHeaderInformation();
    //this.fetchRFQCurrency();
    this.fetchCurrency();
  }

  openShipment() {
    const dialogRef = this.dialog.open(AddEditShippingOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openCopytoLines() {
    const dialogRef = this.dialog.open(CopyToLinesOverlayComponent);
    dialogRef.addPanelClass('inline-md-overlay');
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  fetchRFQSupplierHeaderInformation() {
    this.rfaqService.getRFQSupplierHeaderInformationById(this.rfqId, this.supplierId).subscribe(result => {
      this.showData = true;
      // Supplier Header Information - Helani
      this.rfqSupplierHeaderInformationModel = result.data;

      // Supplier Header Information Attatchment - Helani
      this.rfqSupplierHeaderInformationAttatchmentModel = result.data.rfqSupplierHeaderInformationAttatchments;
      if (this.rfqSupplierHeaderInformationAttatchmentModel.length > 0) {
        for (var k = 0; k < this.rfqSupplierHeaderInformationAttatchmentModel.length; k++) {
          if (this.rfqSupplierHeaderInformationAttatchmentModel[k].etMediaId != null) {
            if (this.rfqSupplierHeaderInformationAttatchmentModel[k].etMediaId != "00000000-0000-0000-0000-000000000000") {
              this.rfqSupplierHeaderInformationAttatchmentModel[k].isInformationDeleteAndDownloadEnabledVisible = true;
            }
          }
        }
      }

      // Supplier Header Attribute - Helani
      this.rfqSupplierHeaderAttributeGroupModel = result.data.rfqSupplierHeaderAttributeGroups;
      // Supplier Header Country Origin - Helani
      this.rfqSupplierHeaderCountryOriginModel = result.data.rfqSupplierHeaderCountryOrigin;
      //fetch RFQSupplierHeaderAttachment by RFQID - Rahal
      this.rfqSupplierHeaderAttachmentViewModel = result.data.rfqSupplierHeaderAttachments;
      this.rfqSupplierHeaderDeliverableModel = result.data.rfqSupplierHeaderDeliverableModels;
      this.rfqSupplierHeaderInformationModel = result.data;
      if (this.rfqSupplierHeaderAttachmentViewModel.length > 0) {
        for (var k = 0; k < this.rfqSupplierHeaderAttachmentViewModel.length; k++) {
          if (this.rfqSupplierHeaderAttachmentViewModel[k].etMediaId != null) {
            if (this.rfqSupplierHeaderAttachmentViewModel[k].etMediaId != "00000000-0000-0000-0000-000000000000") {
              this.rfqSupplierHeaderAttachmentViewModel[k].isDeleteandDownloadEnabledVisible = true;
            }
          }
        }
      }

      //Supplier Header Note - Manula
      this.rfqSupplierHeaderNoteModel = result.data.rfqSupplierHeaderNotes;
      // Supplier Header Cost Factor - Shohan
      this.rfqSupplierCostFactorGroupModel = result.data.rfqSupplierCostFactorGroupModelList;
      //Supplier Header PaymentSchedule - Abeeshan
      this.rfqSupplierHeaderPaymentScheduleModel = result.data.rfqSupplierHeaderPaymentScheduleList;

      //Supplier Header PaymentSchedule total number - Abeeshan
      this.findsum(this.rfqSupplierHeaderPaymentScheduleModel);
      this.findsumpaymentPercentage(this.rfqSupplierHeaderPaymentScheduleModel);
      this.findsumpaymentreleaseValue(this.rfqSupplierHeaderPaymentScheduleModel);
      this.findsumWork(this.rfqSupplierHeaderPaymentScheduleModel);
      this.findsumpaymentPercentagePayment(this.rfqSupplierHeaderPaymentScheduleModel);
      this.findsumpaymentreleaseValuereleaseValue(this.rfqSupplierHeaderPaymentScheduleModel);

      this.etenderingLookupViewModel = result.data.supplierStatusList;

      // supplier Header rfqSupplierHeaderSurveyTemplateQuestionModel - Abeeshan
      this.rfqSupplierHeaderSurveyTemplateQuestionModel = result.data.rfqSupplierHeaderSurveyTemplateQuestionList;
      // Supplier Header Document text - Shohan
      this.rfqSupplierHeaderDocumentTextModel = result.data.rfqSupplierHeaderDocumentTextModelList;
    });
  }

  fetchRFQCurrency() {
    this.rfqService.GetRFQCurrencyByRFQId(this.rfqId).subscribe((result) => {
      this.rfqCurrencies = result.data;
    });
  }

  fetchCurrency() {
    this.rfqService.getCurrency(this.rfqId).subscribe((result) => {
      this.currencies = result.data.result;
    });
  }

  findsum(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.total += this.value[j].rfqHeaderPaymentScheduleModel.workPercentage
    }
  }

  findsumWork(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.total3 += this.value[j].workPercentage
    }
  }

  findsumpaymentPercentage(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.total1 += this.value[j].rfqHeaderPaymentScheduleModel.paymentPercentage
    }
  }

  findsumpaymentPercentagePayment(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.total4 += this.value[j].paymentPercentage
    }
  }

  findsumpaymentreleaseValue(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.total2 += this.value[j].rfqHeaderPaymentScheduleModel.releaseValue
    }
  }

  findsumpaymentreleaseValuereleaseValue(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.total5 += this.value[j].releaseValue
    }
  }

  findsumtotalbwork(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.totalbwork += this.value[j].work
    }
  }

  findsumtotalbpayment(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.totalbpayment += this.value[j].payment
    }
  }

  findsumtotalbreaseValue(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.totalbreaseValue += this.value[j].releaseValue
    }
  }

  findsumtotalswork(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.totalswork += this.value[j].rfqPartLinePaymentScheduleModel.work
    }
  }

  findsumtotalspayment(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.totalspayment += this.value[j].rfqPartLinePaymentScheduleModel.payment
    }
  }

  findsumtotalsrelasevalue(data) {
    this.value = data
    for (let j = 0; j < data.length; j++) {
      this.totalsrelasevalue += this.value[j].rfqPartLinePaymentScheduleModel.releaseValue
    }
  }

  // Expand and close Supplier header and partline cost factor groups code base --- SHohan
  toggleDisplaySupplierHeaderCF(id: string) {
    var existingVal = this.detailsSupplierHeaderCFDisplayMap.get(id);
    if (existingVal) {
      this.detailsSupplierHeaderCFDisplayMap.set(id, !existingVal)
    } else {
      this.detailsSupplierHeaderCFDisplayMap.set(id, true)
    }
  }

  getHeaderAttributeActiveDetailsTab(id: string): boolean {
    return this.detailsHeaderAttributeDisplayMap.get(id) ? this.detailsHeaderAttributeDisplayMap.get(id) : false;
  }

  toggleHeaderAttributeDisplay(id: string) {
    var existingVal = this.detailsHeaderAttributeDisplayMap.get(id);
    if (existingVal) {
      this.detailsHeaderAttributeDisplayMap.set(id, !existingVal)
    } else {
      this.detailsHeaderAttributeDisplayMap.set(id, true)
    }
  }

  getactiveDetailsSupplierHeaderCFTab(id: string): boolean {
    return this.detailsSupplierHeaderCFDisplayMap.get(id) ? this.detailsSupplierHeaderCFDisplayMap.get(id) : false;
  }

  DownloadBuyerMedia(row) {
    this.DownloadFile(row.buyETMediaId, row.buyFileName, row.buyFileExtension);
  }

  DownloadFile(id, fileName, fileExtension) {
    let eTMedia: any = { id: id }
    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {

      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

  DeleteFile(row) {
    row.isDeleteandDownloadEnabledVisible = false;
    row.etMediaId = "";
    row.fileName = "";
  }

  DownloadMedia(row) {
    this.DownloadFile(row.etMediaId, row.fileName, row.fileExtension);
  }
}