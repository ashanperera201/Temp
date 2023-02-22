import { Component, Input, OnInit } from '@angular/core';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import { RFQPartLineDeliverableModel } from 'app/main/Models/etendering/rfq-partline-deliverable-model';
import { RFQPartLinePaymentScheduleModel } from 'app/main/Models/etendering/rfq-partLine-payment-schedule-model';
import { RFQSupplierCostFactorGroupModel } from 'app/main/Models/etendering/rfq-supplier-cost-factor-group-model';
import { RFQSupplierPartLineAttributeGroupModel } from 'app/main/Models/etendering/rfq-supplier-part-line-attribute-group-model';
import { RFQSupplierPartLinePaymentScheduleModel } from 'app/main/Models/etendering/rfq-supplier-partLine-payment-schedule-model';
import { EtenderingLookupViewModel } from 'app/main/Models/etendering/ViewModels/etendering-lookup-view-model';
import { RFQSupplierHeaderInformationAttatchmentModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-attatchment-model';
import { RFQSupplierHeaderInformationModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-model';
import { RFQSupplierPartLineCountryOriginModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-part-line-country-origin-model';
import { RFQSupplierPartLineDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-part-line-deliverable-view-model';
import { RFQSupplierPartLineNoteModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-part-line-note-model';
import { RFQSupplierPartLine } from 'app/main/Models/etendering/ViewModels/rfq-supplier-partline';
import { RFQSupplierPartLineAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-partline-attachment-view-model';
import { RFQSupplierPartLineDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-partline-document-text-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-supplier-response-line-view',
    templateUrl: './supplier-response-line-view.component.html',
    styleUrls: ['./supplier-response-line-view.component.scss']
})
export class SupplierResponseLineViewComponent implements OnInit {
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

    panelOpenState = false;
    supplierStatuses: any[];
    status: string = "";
    //statusID:string = "";
    @Input() rfqId: any;
    @Input() supplierId: any;
    @Input() rfqModel: RFQViewModel = new RFQViewModel();
    message: string = "";
    isInformationDeleteAndDownloadEnabledVisible = false;
    rfqCurrencies: any = [];
    showData = false;
    detailsPartLineAttributeDisplayMap = new Map();

    rfqSupplierHeaderInformationModel: RFQSupplierHeaderInformationModel = new RFQSupplierHeaderInformationModel;

    // Supplier Header Information Attatchment - Helani
    rfqSupplierHeaderInformationAttatchmentModel: RFQSupplierHeaderInformationAttatchmentModel[];

    // Supplier PartLine Attribute - Helani
    rfqSupplierPartLineAttributeGroupModel: RFQSupplierPartLineAttributeGroupModel[];
    detailsSupplierPartLineCFDisplayMap = new Map();

    // For parent child relationship for Supplier Line information
    detailsSupplierLineInformationDisplayMap = new Map();
    rfqSupplierHeaderInformationModels: RFQSupplierHeaderInformationModel[];

    // Supplier PartLine Country Origin - Helani
    rfqSupplierPartLineCountryOriginModel: RFQSupplierPartLineCountryOriginModel[];

    // Lines Information 
    rfqSupplierPartLineModelList: RFQSupplierPartLine[];
    //Supplier PartLine Note - Manula
    rfqSupplierPartLineNoteModel: RFQSupplierPartLineNoteModel[];
    // Supplier Partline cost factor - Shohan 
    rfqSupplierPartLineCostFactorGroupModel: RFQSupplierCostFactorGroupModel[];
    // Supplier part line Document text - Shohan 
    rfqSupplierPartLineDocumentTextModel: RFQSupplierPartLineDocumentTextViewModel[];
    //supplier line attachment view model - Rahal
    rfqSupplierPartLineAttachmentViewModel: RFQSupplierPartLineAttachmentViewModel[] = [];

    //RFQ Supplier Partline Deliverables - Rahal
    rfqSupplierPartLineDeliverableModel: RFQSupplierPartLineDeliverableModel[];
    //RFQ Partline Deliverables - Rahal
    rfqPartLineDeliverableModel: RFQPartLineDeliverableModel[];
    etmedia: any = { id: "00000000-0000-0000-0000-000000000000", fileName: "" };
    rfqSupplierPartLinePaymentScheduleModel: RFQSupplierPartLinePaymentScheduleModel[];
    rfqPartLinePaymentSchedule: RFQPartLinePaymentScheduleModel[];
    etenderingLookupViewModel: EtenderingLookupViewModel[];
    rfqSurveyQuestionModel: RFQQuestionModel[];
    AttributeFieldTypes: any[];

    //rfqModel: RFQViewModel = new RFQViewModel();

    currentDate: any;
    targetDate: any;
    cDateMillisecs: any;
    tDateMillisecs: any;
    difference: any;
    seconds: any;
    minutes: any;
    hours: any;
    days: any;
    year: number = 2022;
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
    discountType = 'Percentage';
    currencies: any = [];

    /**
     * Constructor
     */
    constructor(private rfaqService: RfaqService, private rfqService: RfqService, private termsService: TermsService) {
    }

    //RFQ Information - Manula

    Message: string = "";

    getRFQById() {
        this.rfqService.getRFQById(this.rfqId, false, false).subscribe((result) => {
            this.rfqModel = result.data;
            this.FetchRFQCurrency();
            this.getCities(this.rfqModel.countryID);
            this.fetchCurrency();
        });
    }

    countryFlag: string;
    setFlag(countryId) {
        for (var i = 0; i < this.rfqModel.countryList.length; i++) {
            if (this.rfqModel.countryList[i].id == countryId) {
                this.countryFlag = this.rfqModel.countryList[i].text;
            }
        }
    }

    getCities(countryId) {
        this.setFlag(countryId);
        this.rfqService.getCities(countryId).subscribe((result) => {
            this.rfqModel.cityList = result;
        });
    }

    FetchRFQCurrency() {
        this.rfqService.GetRFQCurrencyByRFQId(this.rfqId).subscribe((result) => {
            this.rfqCurrencies = result.data;
        });
    }

    fetchCurrency() {
        this.rfqService.getCurrency(this.rfqId).subscribe((result) => {
            this.currencies = result.data.result;
        });
    }

    isShow = true;
    isShow2 = true;

    toggleDisplay() {
        this.isShow = !this.isShow;
    }
    toggleDisplay2() {
        this.isShow2 = !this.isShow2;
    }

    toggleDisplaySupplierPartLineCF(id: string) {
        var existingVal = this.detailsSupplierPartLineCFDisplayMap.get(id);
        if (existingVal) {
            this.detailsSupplierPartLineCFDisplayMap.set(id, !existingVal)
        } else {
            this.detailsSupplierPartLineCFDisplayMap.set(id, true)
        }
    }

    getactiveDetailsSupplierPartLineCFTab(id: string): boolean {
        return this.detailsSupplierPartLineCFDisplayMap.get(id) ? this.detailsSupplierPartLineCFDisplayMap.get(id) : false;
    }

    // End of  Expand and close Supplier header and partline cost factor groups code base --
    // Method to expand Line information
    toggleDisplayLineInformation(id: string) {
        var existingVal = this.detailsSupplierLineInformationDisplayMap.get(id);
        if (existingVal) {
            this.detailsSupplierLineInformationDisplayMap.set(id, !existingVal)
        } else {
            this.detailsSupplierLineInformationDisplayMap.set(id, true)
        }
    }

    getactiveDetailsLineInformationTab(id: string): boolean {
        return this.detailsSupplierLineInformationDisplayMap.get(id) ? this.detailsSupplierLineInformationDisplayMap.get(id) : false;
    }

    fetchRFQCurrency() {
        this.rfqService.GetRFQCurrencyByRFQId(this.rfqId).subscribe((result) => {
            this.rfqCurrencies = result.data;
        });
    }

    togglePartLineAttributeDisplay(id: string) {
        var existingVal = this.detailsPartLineAttributeDisplayMap.get(id);
        if (existingVal) {
            this.detailsPartLineAttributeDisplayMap.set(id, !existingVal)
        } else {
            this.detailsPartLineAttributeDisplayMap.set(id, true)
        }
    }

    getPartLineAttributeActiveDetailsTab(id: string): boolean {
        return this.detailsPartLineAttributeDisplayMap.get(id) ? this.detailsPartLineAttributeDisplayMap.get(id) : false;
    }

    UpdateRFQSuppleirInformation() {
        //call service in that pass rfqSupplierHeaderInformationModel to service method
        this.rfqSupplierHeaderInformationModel.id = 'F31F503F-E32A-47BD-B850-BD0695AA1250';
        this.rfaqService.UpdateSupplierStatus(this.rfqSupplierHeaderInformationModel).subscribe(result => {
        });
    }

    fetchRFQSupplierHeaderInformation() {
        if (!this.rfqId || !this.supplierId) {
            return;
        }
        this.rfaqService.getRFQSupplierHeaderInformationById(this.rfqId, this.supplierId).subscribe(result => {
            this.showData = true;
            // Supplier Header Information - Helani
            this.rfqSupplierHeaderInformationModel = result.data;


            this.rfqSupplierPartLineAttributeGroupModel = result.data.rfqSupplierPartLineAttributeGroups;
            this.rfqSupplierPartLineCountryOriginModel = result.data.rfqSupplierPartLineCountryOrigin;
            this.rfqSupplierPartLineDeliverableModel = result.data.rfqSupplierPartLineDeliverables;

            //fetch rfqsupplierpartline attachment by rfqid - Rahal
            this.rfqSupplierPartLineAttachmentViewModel = result.data.rfqSupplierPartLineAttachments;
            this.rfqSupplierHeaderInformationModel = result.data;
            if (this.rfqSupplierPartLineAttachmentViewModel.length > 0) {
                for (var k = 0; k < this.rfqSupplierPartLineAttachmentViewModel.length; k++) {
                    if (this.rfqSupplierPartLineAttachmentViewModel[k].attachmentId != null) {
                        if (this.rfqSupplierPartLineAttachmentViewModel[k].attachmentId != "00000000-0000-0000-0000-000000000000") {
                            this.rfqSupplierPartLineAttachmentViewModel[k].isDeleteandDownloadEnabledVisible = true;
                        }
                    }
                }
            }

            //Supplier PartLine Note - Manula
            this.rfqSupplierPartLineNoteModel = result.data.rfqSupplierPartLineNotes;
            // Supplier Part Line Cost Factor - Shohan
            this.rfqSupplierPartLineCostFactorGroupModel = result.data.rfqSupplierPartLineCostFactorGroupModelList;

            //Supplier PartLine PaymentSchedule - Abeeshan
            this.rfqSupplierPartLinePaymentScheduleModel = result.data.rfqSupplierPartLinePaymentScheduleList;

            // supplier partline total number - Abeeshan
            this.findsum1(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsum2(this.rfqSupplierPartLinePaymentScheduleModel);

            this.etenderingLookupViewModel = result.data.supplierStatusList;
            // Supplier Part Line  Document text - Shohan
            this.rfqSupplierPartLineDocumentTextModel = result.data.rfqSupplierPartLineDocumentTextModelList;

            // Supplier PartLine Deliverables - Rahal
            this.rfqSupplierPartLineDeliverableModel = result.data.rfqSupplierPartLineDeliverables;

            // Lines information task - Shohan
            this.rfqSupplierPartLineModelList = result.data.rfqSupplierPartLineModelList;
            if (this.rfqSupplierPartLineModelList.length > 0) {
                for (var k = 0; k < this.rfqSupplierPartLineModelList.length; k++) {
                    if (this.rfqSupplierPartLineModelList[k].attachmentId != null) {
                        if (this.rfqSupplierPartLineModelList[k].attachmentId != "00000000-0000-0000-0000-000000000000") {
                            this.rfqSupplierPartLineModelList[k].isDeleteandDownloadEnabledVisible = true;
                        }
                    }
                }
                for (var k = 0; k < this.rfqSupplierPartLineModelList.length; k++) {

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes = [];
                    for (var a = 0; a < this.rfqSupplierPartLineAttributeGroupModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineAttributeGroupModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes.push(this.rfqSupplierPartLineAttributeGroupModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments = [];
                    for (var a = 0; a < this.rfqSupplierPartLineAttachmentViewModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineAttachmentViewModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments.push(this.rfqSupplierPartLineAttachmentViewModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors = [];
                    for (var a = 0; a < this.rfqSupplierPartLineCostFactorGroupModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineCostFactorGroupModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors.push(this.rfqSupplierPartLineCostFactorGroupModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables = [];
                    for (var a = 0; a < this.rfqSupplierPartLineDeliverableModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineDeliverableModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables.push(this.rfqSupplierPartLineDeliverableModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts = [];
                    for (var a = 0; a < this.rfqSupplierPartLineDocumentTextModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineDocumentTextModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts.push(this.rfqSupplierPartLineDocumentTextModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes = [];
                    for (var a = 0; a < this.rfqSupplierPartLineNoteModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineNoteModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes.push(this.rfqSupplierPartLineNoteModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule = [];
                    for (var a = 0; a < this.rfqSupplierPartLinePaymentScheduleModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLinePaymentScheduleModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule.push(this.rfqSupplierPartLinePaymentScheduleModel[a]);
                        }
                    }

                    this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCountryOriginModel = [];
                    for (var a = 0; a < this.rfqSupplierPartLineCountryOriginModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineCountryOriginModel[a].rfqSupplierPartLineId) {
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCountryOriginModel.push(this.rfqSupplierPartLineCountryOriginModel[a]);
                        }
                    }
                }
            }
        });
    }

    ngOnInit(): void {
        this.fetchRFQSupplierHeaderInformation();
        this.fetchRFQCurrency();
        this.getRFQById();
    }

    findsum1(data) {
        let workTotalTemp = 0, paymentTotolTemp = 0, retentionTotalTemp = 0, releaseTotalTemp = 0;
        this.workTotal = this.paymentTotal = this.retentionTotal = this.total = this.releaseTotal = 0;

        for (let j = 0; j < data.length; j++) {
            workTotalTemp += Number(data[j].rfqPartLinePaymentScheduleModel.work);
            paymentTotolTemp += Number(data[j].rfqPartLinePaymentScheduleModel.payment);
            retentionTotalTemp += Number(data[j].rfqPartLinePaymentScheduleModel.retention);
            releaseTotalTemp += Number(data[j].rfqPartLinePaymentScheduleModel.release);
            this.total += Number(data[j].rfqPartLinePaymentScheduleModel.releaseValue);
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
            sworkTotalTemp += Number(data[j].work);
            spaymentTotolTemp += Number(data[j].payment);
            sretentionTotalTemp += Number(data[j].retention);
            sreleaseTotalTemp += Number(data[j].release);
            this.stotal += Number(data[j].releaseValue);

            if (data.length > 0) {
                this.sworkTotal = sworkTotalTemp;
                this.spaymentTotal = spaymentTotolTemp;
                this.sretentionTotal = sretentionTotalTemp;
                this.sreleaseTotal = sreleaseTotalTemp;
            }
        }
    }

    partlinePsWorkTotal(id) {
        let workTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                workTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.work);
            }
        }
        return workTotalTemp.toFixed(2);
    }
    partlinePsPaymentTotal(id) {
        let paymentTotolTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                paymentTotolTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.payment);
            }
        }
        return paymentTotolTemp.toFixed(2);
    }
    partlinePsRetensionTotal(id) {
        let retentionTotalTemp = 0
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                retentionTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.retention);
            }
        }
        return retentionTotalTemp.toFixed(2);
    }
    partlinePsReleaseTotal(id) {
        let releaseTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.release);
            }
        }
        return releaseTotalTemp.toFixed(2);
    }
    partlinePsReleaseValueTotal(id) {
        let releaseValueTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseValueTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.releaseValue);
            }
        }
        return releaseValueTemp.toFixed(2);
    }

    spartlinePsWorkTotal(id) {
        let workTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                workTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].work);
            }
        }
        return workTotalTemp.toFixed(2);
    }
    spartlinePsPaymentTotal(id) {
        let paymentTotolTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                paymentTotolTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].payment);
            }
        }
        return paymentTotolTemp.toFixed(2);
    }
    spartlinePsRetensionTotal(id) {
        let retentionTotalTemp = 0
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                retentionTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].retention);
            }
        }
        return retentionTotalTemp.toFixed(2);
    }
    spartlinePsReleaseTotal(id) {
        let releaseTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].release);
            }
        }
        return releaseTotalTemp.toFixed(2);
    }
    spartlinePsReleaseValueTotal(id) {
        let releaseValueTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseValueTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].releaseValue);
            }
        }
        return releaseValueTemp.toFixed(2);
    }

    downloadBuyerMedia(row) {
        this.downloadBuyerAttatchmentFile(row.attachmentId, row.fileName, row.fileExtension);
    }

    //DownloadFile for Lines information - Shohan
    downloadBuyerAttatchmentFile(id, fileName, fileExtension) {
        let eTMedia: any = { id: id }
        this.termsService.DownloadMedia(eTMedia).subscribe(blob => {

            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

}