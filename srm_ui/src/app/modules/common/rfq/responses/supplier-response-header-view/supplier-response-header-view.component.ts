import { Component, Input, OnInit } from '@angular/core';
import { RFQSupplierCostFactorGroupModel } from 'app/main/Models/etendering/rfq-supplier-cost-factor-group-model';
import { RFQSupplierHeaderAttributeGroupModel } from 'app/main/Models/etendering/rfq-supplier-header-attribute-group-model';
import { RFQSupplierHeaderInformationModel } from 'app/main/Models/etendering/rfq-supplier-header-information-model';
import { RFQSupplierHeaderPaymentScheduleModel } from 'app/main/Models/etendering/rfq-supplier-headerpayment-schedule-model';
import { RFQSupplierHeaderAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-attachment-view-model';
import { RFQSupplierHeaderCountryOriginModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-country-origin-model';
import { RFQSupplierHeaderDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-deliverable-model';
import { RFQSupplierHeaderDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-document-text-model';
import { RFQSupplierHeaderInformationAttatchmentModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-attatchment-model';
import { RFQSupplierHeaderNoteModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-note-model';
import { RFQSupplierHeaderTermsConditionModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-termscondition-view-model';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { saveAs } from 'file-saver';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { RFQSupplierHeaderSurveyTemplateQuestionModel } from 'app/main/Models/etendering/rfq-supplierheader-surveytemplate-question-module';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RFQSupplierSurveyTemplateGroupModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-survey-template-group-model';

@Component({
  selector: 'app-supplier-response-header-view',
  templateUrl: './supplier-response-header-view.component.html',
  styleUrls: ['./supplier-response-header-view.component.scss']
})
export class SupplierResponseHeaderViewComponent implements OnInit {
  @Input() displayedColumn19: string[];
  @Input() displayedColumn17: string[];
  @Input() displayedColumn18: string[];
  @Input() displayedColumn42: string[];
  @Input() displayedColumn43: string[];
  @Input() displayedColumnPayment: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
  @Input() displayedColumnResponce: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
  @Input() displayedColumn62: string[];
  @Input() displayedColumn72: string[];
  @Input() displayedColumn82: string[];
  @Input() displayedColumn92: string[];
  @Input() displayedColumn93: string[];
  @Input() displayedColumn55: string[];
  @Input() rfqId: any;
  @Input() supplierId: any;
  @Input() rfqModel: RFQViewModel = new RFQViewModel();

  rfqSupplierHeaderInformationModel: RFQSupplierHeaderInformationModel = new RFQSupplierHeaderInformationModel;
  rfqSupplierHeaderInformationAttatchmentModel: RFQSupplierHeaderInformationAttatchmentModel[];
  rfqCurrencies: any = [];
  rfqSupplierHeaderCountryOriginModel: RFQSupplierHeaderCountryOriginModel[];
  rfqSupplierHeaderAttributeGroupModel: RFQSupplierHeaderAttributeGroupModel[];
  rfqSupplierCostFactorGroupModel: RFQSupplierCostFactorGroupModel[];
  rfqSupplierHeaderPaymentScheduleModel: RFQSupplierHeaderPaymentScheduleModel[];
  rfqSupplierHeaderAttachmentViewModel: RFQSupplierHeaderAttachmentViewModel[];
  rfqSupplierHeaderDeliverableModel: RFQSupplierHeaderDeliverableModel[];
  rfqSupplierHeaderDocumentTextModel: RFQSupplierHeaderDocumentTextViewModel[];
  rfqSupplierHeaderNoteModel: RFQSupplierHeaderNoteModel[];
  rfqSupplierHeaderTermsConditionModel: RFQSupplierHeaderTermsConditionModel[];
  rfqSupplierSurveyTemplateGroupModel: RFQSupplierSurveyTemplateGroupModel[];

  isShow = true;
  detailsHeaderAttributeDisplayMap = new Map();
  detailsSupplierHeaderCFDisplayMap = new Map();
  detailsPartLineAttributeDisplayMap = new Map();
  detailsHeaderSurveyQuestionDisplayMap = new Map();
  workTotal = 0;
  paymentTotal = 0;
  retentionTotal = 0;
  total = 0;
  releaseTotal = 0;
  sworkTotal = 0;
  spaymentTotal = 0;
  sretentionTotal = 0;
  stotal = 0;
  sreleaseTotal = 0;
  currencies: any = [];

  constructor(private rfaqService: RfaqService, private rfqService: RfqService, private termsService: TermsService) {
  }

  ngOnInit(): void {
    this.fetchRFQSupplierHeaderInformation();
    //this.fetchRFQCurrency();
    this.fetchCurrency();
  }

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  fetchRFQSupplierHeaderInformation() {
    if (!this.rfqId || !this.supplierId) {
      return;
    }
    this.rfaqService.getRFQSupplierHeaderInformationById(this.rfqId, this.supplierId).subscribe(result => {
      this.rfqSupplierHeaderInformationModel = result.data;
      this.rfqSupplierHeaderCountryOriginModel = result.data.rfqSupplierHeaderCountryOrigin;
      this.rfqSupplierHeaderAttributeGroupModel = result.data.rfqSupplierHeaderAttributeGroups;
      this.rfqSupplierCostFactorGroupModel = result.data.rfqSupplierCostFactorGroupModelList;
      this.rfqSupplierHeaderPaymentScheduleModel = result.data.rfqSupplierHeaderPaymentScheduleList;

      this.rfqSupplierHeaderAttachmentViewModel = result.data.rfqSupplierHeaderAttachments;
      this.rfqSupplierHeaderDeliverableModel = result.data.rfqSupplierHeaderDeliverableModels;
      this.rfqSupplierHeaderDocumentTextModel = result.data.rfqSupplierHeaderDocumentTextModelList;
      this.rfqSupplierHeaderNoteModel = result.data.rfqSupplierHeaderNotes;
      this.rfqSupplierHeaderTermsConditionModel = result.data.rfqSupplierHeaderTermsConditionModelList;
      this.rfqSupplierSurveyTemplateGroupModel = result.data.rfqSupplierHeaderSurveyTemplateQuestionList;

      if (this.rfqSupplierHeaderAttachmentViewModel.length > 0) {
        for (var k = 0; k < this.rfqSupplierHeaderAttachmentViewModel.length; k++) {
          if (this.rfqSupplierHeaderAttachmentViewModel[k].etMediaId != null) {
            if (this.rfqSupplierHeaderAttachmentViewModel[k].etMediaId != "00000000-0000-0000-0000-000000000000") {
              this.rfqSupplierHeaderAttachmentViewModel[k].isDeleteandDownloadEnabledVisible = true;
            }
          }
        }
      }

      this.rfqSupplierHeaderInformationAttatchmentModel = result.data.rfqSupplierHeaderInformationAttatchments;

      if (this.rfqSupplierHeaderInformationAttatchmentModel == null || this.rfqSupplierHeaderInformationAttatchmentModel == undefined || this.rfqSupplierHeaderInformationAttatchmentModel.length == 0) {
        this.rfqSupplierHeaderInformationAttatchmentModel = [];
        let rfqSupplierHeaderInformationAttatchmentModel = new RFQSupplierHeaderInformationAttatchmentModel();
        this.rfqSupplierHeaderInformationAttatchmentModel.push(rfqSupplierHeaderInformationAttatchmentModel);
      }
      if (this.rfqSupplierHeaderInformationAttatchmentModel.length > 0) {
        for (var k = 0; k < this.rfqSupplierHeaderInformationAttatchmentModel.length; k++) {
          if (this.rfqSupplierHeaderInformationAttatchmentModel[k].etMediaId != null) {
            if (this.rfqSupplierHeaderInformationAttatchmentModel[k].etMediaId != "00000000-0000-0000-0000-000000000000") {
              this.rfqSupplierHeaderInformationAttatchmentModel[k].isInformationDeleteAndDownloadEnabledVisible = true;
            }
          }
        }
      }

      this.findsum1(this.rfqSupplierHeaderPaymentScheduleModel);
      this.findsum2(this.rfqSupplierHeaderPaymentScheduleModel);
    });
  }

  findsum1(data) {
    let workTotalTemp = 0, paymentTotolTemp = 0, retentionTotalTemp = 0, releaseTotalTemp = 0;
    this.workTotal = this.paymentTotal = this.retentionTotal = this.total = this.releaseTotal = 0;

    for (let j = 0; j < data.length; j++) {
      workTotalTemp += Number(data[j].rfqHeaderPaymentScheduleModel.workPercentage);
      paymentTotolTemp += Number(data[j].rfqHeaderPaymentScheduleModel.paymentPercentage);
      retentionTotalTemp += Number(data[j].rfqHeaderPaymentScheduleModel.retentionPercentage);
      releaseTotalTemp += Number(data[j].rfqHeaderPaymentScheduleModel.releasePercentage);
      this.total += Number(data[j].rfqHeaderPaymentScheduleModel.releaseValue);
    }
    if (data.length > 0) {
      this.workTotal = workTotalTemp;
      this.paymentTotal = paymentTotolTemp;
      this.retentionTotal = retentionTotalTemp;
      this.releaseTotal = releaseTotalTemp;
    }
  }

  findsum2(data) {
    let sworkTotalTemp = 0, spaymentTotolTemp = 0, sretentionTotalTemp = 0, sreleaseTotalTemp = 0;
    this.sworkTotal = this.spaymentTotal = this.sretentionTotal = this.stotal = this.sreleaseTotal = 0;
    for (let j = 0; j < data.length; j++) {
      sworkTotalTemp += Number(data[j].workPercentage);
      spaymentTotolTemp += Number(data[j].paymentPercentage);
      sretentionTotalTemp += Number(data[j].retentionPercentage);
      sreleaseTotalTemp += Number(data[j].relesePercentage);
      this.stotal += Number(data[j].releasevalue);

      if (data.length > 0) {
        this.sworkTotal = sworkTotalTemp;
        this.spaymentTotal = spaymentTotolTemp;
        this.sretentionTotal = sretentionTotalTemp;
        this.sreleaseTotal = sreleaseTotalTemp;
      }
    }
  }

  DownloadHeaderInformationAttatchmentMedia(row) {
    this.DownloadHeaderInformationAttatchmentFile(row.etMediaId, row.fileName, row.fileExtension);
  }

  DownloadHeaderInformationAttatchmentFile(id, fileName, fileExtension) {
    let eTMedia: any = { id: id }

    this.rfqService.downloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
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

  toggleHeaderAttributeDisplay(id: string) {
    var existingVal = this.detailsHeaderAttributeDisplayMap.get(id);
    if (existingVal) {
      this.detailsHeaderAttributeDisplayMap.set(id, !existingVal)
    } else {
      this.detailsHeaderAttributeDisplayMap.set(id, true)
    }
  }

  togglePartLineAttributeDisplay(id: string) {
    var existingVal = this.detailsPartLineAttributeDisplayMap.get(id);
    if (existingVal) {
      this.detailsPartLineAttributeDisplayMap.set(id, !existingVal)
    } else {
      this.detailsPartLineAttributeDisplayMap.set(id, true)
    }
  }

  toggleDisplaySupplierHeaderCF(id: string) {
    var existingVal = this.detailsSupplierHeaderCFDisplayMap.get(id);
    if (existingVal) {
      this.detailsSupplierHeaderCFDisplayMap.set(id, !existingVal)
    } else {
      this.detailsSupplierHeaderCFDisplayMap.set(id, true)
    }
  }

  toggleDisplayHeaderSurveyQuestion(id: string) {
    var existingVal = this.detailsHeaderSurveyQuestionDisplayMap.get(id);
    if (existingVal) {
      this.detailsHeaderSurveyQuestionDisplayMap.set(id, !existingVal)
    } else {
      this.detailsHeaderSurveyQuestionDisplayMap.set(id, true)
    }
  }

  getHeaderAttributeActiveDetailsTab(id: string): boolean {
    return this.detailsHeaderAttributeDisplayMap.get(id) ? this.detailsHeaderAttributeDisplayMap.get(id) : false;
  }

  getactiveDetailsSupplierHeaderCFTab(id: string): boolean {
    return this.detailsSupplierHeaderCFDisplayMap.get(id) ? this.detailsSupplierHeaderCFDisplayMap.get(id) : false;
  }

  getPartLineAttributeActiveDetailsTab(id: string): boolean {
    return this.detailsPartLineAttributeDisplayMap.get(id) ? this.detailsPartLineAttributeDisplayMap.get(id) : false;
  }

  getactiveDetailsHeaderSurveyQuestion(id: string): boolean {
    return this.detailsHeaderSurveyQuestionDisplayMap.get(id) ? this.detailsHeaderSurveyQuestionDisplayMap.get(id) : false;
  }

  downloadBuyerMedia(row) {
    this.downloadBuyerAttatchmentFile(row.etMediaId, row.fileName, row.fileExtension);
  }

  downloadBuyerAttatchmentFile(id, fileName, fileExtension) {
    let eTMedia: any = { id: id }

    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

}