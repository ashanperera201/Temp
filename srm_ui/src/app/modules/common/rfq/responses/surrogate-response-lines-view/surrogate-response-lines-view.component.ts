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

@Component({
    selector: 'app-surrogate-response-lines-view',
    templateUrl: './surrogate-response-lines-view.component.html',
    styleUrls: ['./surrogate-response-lines-view.component.scss']
})
export class SurrogateResponseLinesViewComponent implements OnInit {
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
    rfqId: any;
    supplierId: any;
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
    discountType = 'Percentage';

    //rfqModel: RFQViewModel = new RFQViewModel();
    @Input() rfqModel: RFQViewModel = new RFQViewModel();

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

    /**
     * Constructor
     */
    constructor(
        private rfaqService: RfaqService,
        private rfqService: RfqService) {
        this.rfqId = 'F1E764E6-DD24-476C-B516-08D95FA0983A';
    }

    //RFQ Information - Manula

    Message: string = "";

    getRFQById() {
        this.rfqService.getRFQById(this.rfqId, false, false).subscribe((result) => {
            this.rfqModel = result.data;
            this.FetchRFQCurrency();
            this.getCities(this.rfqModel.countryID);
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
        this.rfqId = 'F1E764E6-DD24-476C-B516-08D95FA0983A';
        this.supplierId = 'EB1AF284-3B53-4FE1-4D63-08D9DB1C6565';
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
            console.log(this.rfqSupplierPartLineAttributeGroupModel)
            console.log("hhh222")

            //Supplier PartLine Note - Manula
            this.rfqSupplierPartLineNoteModel = result.data.rfqSupplierPartLineNotes;
            // Supplier Part Line Cost Factor - Shohan
            this.rfqSupplierPartLineCostFactorGroupModel = result.data.rfqSupplierPartLineCostFactorGroupModelList;

            //Supplier PartLine PaymentSchedule - Abeeshan
            this.rfqSupplierPartLinePaymentScheduleModel = result.data.rfqSupplierPartLinePaymentScheduleList;

            // supplier partline total number - Abeeshan
            this.findsumtotalbwork(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalbpayment(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalbreaseValue(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalswork(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalspayment(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalsrelasevalue(this.rfqSupplierPartLinePaymentScheduleModel);

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
                    for (var a = 0; a < this.rfqSupplierPartLineAttributeGroupModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineAttributeGroupModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes.push(this.rfqSupplierPartLineAttributeGroupModel[a]);
                        }
                    }
                    for (var a = 0; a < this.rfqSupplierPartLineAttachmentViewModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineAttachmentViewModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments.push(this.rfqSupplierPartLineAttachmentViewModel[a]);
                        }
                    }

                    for (var a = 0; a < this.rfqSupplierPartLineCostFactorGroupModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineCostFactorGroupModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors.push(this.rfqSupplierPartLineCostFactorGroupModel[a]);
                        }
                    }

                    for (var a = 0; a < this.rfqSupplierPartLineDeliverableModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineDeliverableModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables.push(this.rfqSupplierPartLineDeliverableModel[a]);
                        }
                    }

                    for (var a = 0; a < this.rfqSupplierPartLineDocumentTextModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineDocumentTextModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts.push(this.rfqSupplierPartLineDocumentTextModel[a]);
                        }
                    }
                    for (var a = 0; a < this.rfqSupplierPartLineNoteModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineNoteModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes.push(this.rfqSupplierPartLineNoteModel[a]);
                        }
                    }

                    for (var a = 0; a < this.rfqSupplierPartLinePaymentScheduleModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLinePaymentScheduleModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule = []
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule.push(this.rfqSupplierPartLinePaymentScheduleModel[a]);
                        }
                    }
                }
            }
            console.log("fee344")
            console.log(this.rfqSupplierPartLineModelList)

        });
    }

    ngOnInit(): void {
        this.fetchRFQSupplierHeaderInformation();
        this.fetchRFQCurrency();
        this.getRFQById();
    }

    findsumWork(data) {
        this.value = data
        for (let j = 0; j < data.length; j++) {
            this.total3 += this.value[j].workPercentage
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

}