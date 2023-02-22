/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, Input, OnInit } from '@angular/core';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { ElementRef, ViewChild, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RFQSupplierHeaderAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-attachment-view-model';
import { RFQSupplierPartLineAttachmentViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-partline-attachment-view-model';
import { RFQSupplierPartLineDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-part-line-deliverable-view-model';
import { RFQPartLineDeliverableModel } from 'app/main/Models/etendering/rfq-partline-deliverable-model';
import { FormGroup } from '@angular/forms';
import { RFQSupplierHeaderDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-document-text-model';
import { RFQSupplierPartLineDocumentTextViewModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-partline-document-text-model';
import { RFQSupplierCostFactorGroupModel } from 'app/main/Models/etendering/rfq-supplier-cost-factor-group-model';
import { RFQSupplierHeaderNoteModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-note-model';
import { RFQSupplierPartLineNoteModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-part-line-note-model';
import { RFQSupplierPartLine } from 'app/main/Models/etendering/ViewModels/rfq-supplier-partline';
import { RFQSupplierPartLineCountryOriginModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-part-line-country-origin-model';
import { RFQSupplierHeaderInformationAttatchmentModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-attatchment-model';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { FuseAlertService } from '@fuse/components/alert';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ChatService } from 'app/shared/Services/etendering/Chats/chat.service';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { RfaqService } from 'app/shared/Services/etendering/RFAQ/rfaq.service';
import { RFQSupplierHeaderAttributeGroupModel } from 'app/main/Models/etendering/rfq-supplier-header-attribute-group-model';
import { RFQSupplierPartLineAttributeGroupModel } from 'app/main/Models/etendering/rfq-supplier-part-line-attribute-group-model';
import { RFQSupplierHeaderSurveyTemplateQuestionModel } from 'app/main/Models/etendering/rfq-supplierheader-surveytemplate-question-module';
import { RFQQuestionModel } from 'app/main/Models/etendering/rfq-header-RFQQuestionModel';
import { EtenderingLookupViewModel } from 'app/main/Models/etendering/ViewModels/etendering-lookup-view-model';
import { RFQPartLinePaymentScheduleModel } from 'app/main/Models/etendering/rfq-partLine-payment-schedule-model';
import { RFQSupplierPartLinePaymentScheduleModel } from 'app/main/Models/etendering/rfq-supplier-partLine-payment-schedule-model';
import { RFQHeaderPaymentScheduleModel } from 'app/main/Models/etendering/rfq-header-payment-schedule-model';
import { RFQSupplierHeaderPaymentScheduleModel } from 'app/main/Models/etendering/rfq-supplier-headerpayment-schedule-model';
import { RFQSupplierHeaderDeliverableModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-deliverable-model';
import { RFQSupplierHeaderCountryOriginModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-country-origin-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RFXSupplierPartLineSubstitueModel } from 'app/main/Models/etendering/ViewModels/rfx-supplier-partline-substitue-model';
import { RFQSupplierHeaderInformationModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-model';
import { saveAs } from 'file-saver';
import { CopyToLinesOverlayComponent } from 'app/modules/common/rfaq/copy-to-lines-overlay/copy-to-lines-overlay.component';
import { AddEditShippingOverlayComponent } from 'app/modules/common/rfaq/add-edit-shipping-overlay/add-edit-shipping-overlay.component';
import { AddEditLineShippingOverlayComponent } from 'app/modules/common/rfaq/add-edit-line-shipping-overlay/add-edit-line-shipping-overlay.component';
import Swal from 'sweetalert2';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { AddNewLineCostfactorOverlayComponent } from './add-new-line-costfactor-overlay/add-new-line-costfactor-overlay.component';
import { RFQSupplierSurveyTemplateGroupModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-survey-template-group-model';

export interface costFactBySupplier {
    list: string;
    type: string;
    description: string;
    value: string;
}

const costFactBySupplier_DATA: costFactBySupplier[] = [
    { list: 'Special Tool Cost', type: 'Fixed', description: 'Cost Elements involved in RIG building', value: '500.00 USD', },
    { list: 'Special Tool Cost', type: 'Per Unit', description: 'Cost Elements involved in RIG building', value: '500.00 USD', },
];
@Component({
    selector: 'app-surrogate-response-view',
    templateUrl: './surrogate-response-view.component.html',
    styleUrls: ['./surrogate-response-view.component.scss']
})
export class SurrogateResponseViewComponent implements OnInit {


    displayedColumn4: string[] = ['id', 'payno', 'description2', 'type2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'visibility'];
    displayedColumn42: string[] = ['payno', 'description2', 'scheduleLineType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
    displayedColumn43: string[] = ['payno', 'description2', 'scheduleLineType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
    displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
    displayedColumn62: string[] = ['srno', 'title', 'buyfileName', 'attachment', 'reference', 'attachment2', 'comment'];
    displayedColumn7: string[] = ['id', 'docsrno', 'outputtype', 'documentext', 'type3', 'visibility3'];
    displayedColumn72: string[] = ['dtno', 'outputtype', 'documentext', 'documentext2', 'comment'];
    displayedColumn8: string[] = ['id', 'notesrno', 'notes', 'type4', 'visibility4'];
    displayedColumn82: string[] = ['notesrno', 'notes', 'notes2', 'comment'];
    displayedColumn9: string[] = ['id', 'milestonenumber', 'milestonename', 'deliverabledescription', 'type5', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'visibility5'];
    displayedColumn92: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate'];
    displayedColumn93: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'comment'];
    displayedColumn17: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'suppliertype', 'costfactExpectedValue', 'costfactValue', 'costfactComments'];
    displayedColumn19: string[] = ['attributeItem', 'description', 'required', 'expectedValue', 'datatype', 'value', 'assocCosts', 'cost', 'comments'];
    displayedColumnsCostFactBySupplier: string[] = ['list', 'type', 'description', 'value', 'action'];

    dataSourcecostFactBySupplier = [...costFactBySupplier_DATA];

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('file') currentFile: ElementRef; reset() { this.currentFile.nativeElement.value = ''; }
    @Input() rfqModel: any;
    @Input() RFQID: any;

    panelOpenState = false;
    supplierStatuses: any[];
    status: string = '';
    //statusID:string = "";
    rfqId: any;
    supplierId: any = '';
    isDisableFields = false;
    bidReceivedDate: any = '';

    rfqSupplierSearchModel: SupplierSearchModel = new SupplierSearchModel();
    message: string = '';
    isInformationDeleteAndDownloadEnabledVisible = false;
    rfqCurrencies: any = [];
    showData = false;

    TypeValidation: any[] = [];
    TypeValidationText: string[] = [];
    TypeValidationAttrLineText: string[] = [];
    TypeValidationAttrLine: any[] = [];
    //
    CFTypeValidation: any[] = [];
    CFTypeValidationText: string[] = [];
    CFTypeValidationAttrLineText: string[] = [];
    CFTypeValidationAttrLine: any[] = [];

    // For Parent child relationship between Attribute - Helani
    detailsHeaderAttributeDisplayMap = new Map();
    detailsPartLineAttributeDisplayMap = new Map();
    detailsHeaderSurveyQuestionDisplayMap = new Map();

    rfqSupplierHeaderInformationModel: RFQSupplierHeaderInformationModel = new RFQSupplierHeaderInformationModel();

    // Supplier Header Information Attatchment - Helani
    rfqSupplierHeaderInformationAttatchmentModel: RFQSupplierHeaderInformationAttatchmentModel[];

    // Supplier Header Attribute - Helani
    rfqSupplierHeaderAttributeGroupModel: RFQSupplierHeaderAttributeGroupModel[];

    // Supplier PartLine Attribute - Helani
    rfqSupplierPartLineAttributeGroupModel: RFQSupplierPartLineAttributeGroupModel[];

    // For Parent child relationship between header cost factor - Shohan
    detailsSupplierHeaderCFDisplayMap = new Map();
    detailsSupplierPartLineCFDisplayMap = new Map();

    // For parent child relationship for Supplier Line information
    detailsSupplierLineInformationDisplayMap = new Map();
    //--
    rfqSupplierHeaderDeliverableModel: RFQSupplierHeaderDeliverableModel[];
    rfqSupplierHeaderInformationModels: RFQSupplierHeaderInformationModel[];

    // Supplier Header Country Origin - Helani
    rfqSupplierHeaderCountryOriginModel: RFQSupplierHeaderCountryOriginModel[];

    // Supplier PartLine Country Origin - Helani
    rfqSupplierPartLineCountryOriginModel: RFQSupplierPartLineCountryOriginModel[];

    // Lines Information
    rfqSupplierPartLineModelList: RFQSupplierPartLine[];


    //Supplier Header Note - Manula
    rfqSupplierHeaderNoteModel: RFQSupplierHeaderNoteModel[];
    //Supplier PartLine Note - Manula
    rfqSupplierPartLineNoteModel: RFQSupplierPartLineNoteModel[];

    // Supplier Header cost factor - Shohan
    rfqSupplierCostFactorGroupModel: RFQSupplierCostFactorGroupModel[];
    // Supplier Partline cost factor - Shohan
    rfqSupplierPartLineCostFactorGroupModel: RFQSupplierCostFactorGroupModel[];
    // Supplier header Document text - Shohan
    rfqSupplierHeaderDocumentTextModel: RFQSupplierHeaderDocumentTextViewModel[];
    // Supplier part line Document text - Shohan
    rfqSupplierPartLineDocumentTextModel: RFQSupplierPartLineDocumentTextViewModel[];


    //supplier header attachment view model - Rahal
    rfqSupplierHeaderAttachmentViewModel: RFQSupplierHeaderAttachmentViewModel[] = [];
    //supplier line attachment view model - Rahal
    rfqSupplierPartLineAttachmentViewModel: RFQSupplierPartLineAttachmentViewModel[] = [];

    //RFQ Supplier Partline Deliverables - Rahal
    rfqSupplierPartLineDeliverableModel: RFQSupplierPartLineDeliverableModel[];
    //RFQ Partline Deliverables - Rahal
    rfqPartLineDeliverableModel: RFQPartLineDeliverableModel[];
    etmedia: any = { id: '00000000-0000-0000-0000-000000000000', fileName: '' };

    rfqSupplierHeaderPaymentScheduleModel: RFQSupplierHeaderPaymentScheduleModel[];
    rfqHeaderPaymentScheduleModel: RFQHeaderPaymentScheduleModel[];
    rfqSupplierPartLinePaymentScheduleModel: RFQSupplierPartLinePaymentScheduleModel[];
    rfqPartLinePaymentSchedule: RFQPartLinePaymentScheduleModel[];
    etenderingLookupViewModel: EtenderingLookupViewModel[];
    rfqSupplierHeaderSurveyTemplateQuestionModel: RFQSupplierHeaderSurveyTemplateQuestionModel[];
    rfqSurveyQuestionModel: RFQQuestionModel[];
    AttributeFieldTypes: any[];
    rfqSupplierSurveyTemplateGroupModel: RFQSupplierSurveyTemplateGroupModel[];

    workTotal: number;
    paymentTotal: number;
    retentionTotal: number;
    total: number;
    releaseTotal: number;
    sworkTotal: number;
    spaymentTotal: number;
    sretentionTotal: number;
    stotal: number;
    sreleaseTotal: number;
    workTotalLine: number;
    paymentTotalLine: number;
    retentionTotalLine: number;
    totalLine: number;
    releaseTotalLine: number;
    sworkTotalLine: number;
    spaymentTotalLine: number;
    sretentionTotalLine: number;
    stotalLine: number;
    sreleaseTotalLine: number;

    private value;

    // rfqModel: RFQViewModel = new RFQViewModel();

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

    quoteValid: string = 'one';
    isQuoteValid: boolean = false;

    discountType = 'Percentage';
    issaved: boolean = false;
    isRequiredValidation = false;

    /**
     * Constructor
     */
    constructor(public dialog: MatDialog,
        private rfaqService: RfaqService,
        private rfqSupplierService: RfqSupplierService,
        private termsService: TermsService,
        private rfqService: RfqService,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService
        , private chatService: ChatService
        , private _ngZone: NgZone) {
        this.rfqSupplierSearchModel.pageSize = 10;
        this.rfqSupplierSearchModel.page = 1;
    }

    ngOnInit(): void {
        this.rfqId = this.rfqModel.id;
        console.log(this.rfqId);
        this.fetchSupplierList();
        //this.createDataTypeMap();
        //this.fetchRFQSupplierHeaderInformation();
        this.fetchRFQCurrency();
    }

    //RFQ Information - Manula

    Message: string = '';

    // getRFQById() {
    //     this.rfqService.getRFQById(this.rfqId, false, false).subscribe((result) => {
    //         this.rfqModel = result.data;
    //         this.FetchRFQCurrency();
    //         this.getCities(this.rfqModel.countryID);
    //     });
    // }

    // countryFlag: string;
    // setFlag(countryId) {
    //     for (var i = 0; i < this.rfqModel.countryList.length; i++) {
    //         if (this.rfqModel.countryList[i].id == countryId) {
    //             this.countryFlag = this.rfqModel.countryList[i].text;
    //         }
    //     }
    // }

    // getCities(countryId) {
    //     this.setFlag(countryId);
    //     this.rfqService.getCities(countryId).subscribe((result) => {
    //         this.rfqModel.cityList = result;
    //     });
    // }

    // FetchRFQCurrency() {
    //     this.rfqService.GetRFQCurrencyByRFQId(this.rfqId).subscribe((result) => {
    //         this.rfqCurrencies = result.data;
    //     });
    // }

    isShow = true;
    isShow2 = true;

    toggleDisplay() {
        this.isShow = !this.isShow;
    }
    toggleDisplay2() {
        this.isShow2 = !this.isShow2;
    }

    // Expand and close Supplier header and partline cost factor groups code base --- SHohan
    toggleDisplaySupplierHeaderCF(id: string) {
        const existingVal = this.detailsSupplierHeaderCFDisplayMap.get(id);
        if (existingVal) {
            this.detailsSupplierHeaderCFDisplayMap.set(id, !existingVal);
        } else {
            this.detailsSupplierHeaderCFDisplayMap.set(id, true);
        }
    }

    getactiveDetailsSupplierHeaderCFTab(id: string): boolean {
        return this.detailsSupplierHeaderCFDisplayMap.get(id) ? this.detailsSupplierHeaderCFDisplayMap.get(id) : false;
    }

    toggleDisplaySupplierPartLineCF(id: string) {
        const existingVal = this.detailsSupplierPartLineCFDisplayMap.get(id);
        if (existingVal) {
            this.detailsSupplierPartLineCFDisplayMap.set(id, !existingVal);
        } else {
            this.detailsSupplierPartLineCFDisplayMap.set(id, true);
        }
    }

    getactiveDetailsSupplierPartLineCFTab(id: string): boolean {
        return this.detailsSupplierPartLineCFDisplayMap.get(id) ? this.detailsSupplierPartLineCFDisplayMap.get(id) : false;
    }
    // End of  Expand and close Supplier header and partline cost factor groups code base --
    // Method to expand Line information
    toggleDisplayLineInformation(id: string) {
        const existingVal = this.detailsSupplierLineInformationDisplayMap.get(id);
        if (existingVal) {
            this.detailsSupplierLineInformationDisplayMap.set(id, !existingVal);
        } else {
            this.detailsSupplierLineInformationDisplayMap.set(id, true);
        }
    }

    getactiveDetailsLineInformationTab(id: string): boolean {
        return this.detailsSupplierLineInformationDisplayMap.get(id) ? this.detailsSupplierLineInformationDisplayMap.get(id) : false;
    }

    fetchRFQCurrency(): void {
        this.rfqService.getCurrency(this.RFQID).subscribe((result) => {
            this.rfqCurrencies = result.data.result;
        });
    }

    toggleHeaderAttributeDisplay(id: string) {
        const existingVal = this.detailsHeaderAttributeDisplayMap.get(id);
        if (existingVal) {
            this.detailsHeaderAttributeDisplayMap.set(id, !existingVal);
        } else {
            this.detailsHeaderAttributeDisplayMap.set(id, true);
        }
    }

    togglePartLineAttributeDisplay(id: string) {
        const existingVal = this.detailsPartLineAttributeDisplayMap.get(id);
        if (existingVal) {
            this.detailsPartLineAttributeDisplayMap.set(id, !existingVal);
        } else {
            this.detailsPartLineAttributeDisplayMap.set(id, true);
        }
    }

    toggleDisplayHeaderSurveyQuestion(id: string) {
        const existingVal = this.detailsHeaderSurveyQuestionDisplayMap.get(id);

        if (existingVal) {
            this.detailsHeaderSurveyQuestionDisplayMap.set(id, !existingVal);
        } else {
            this.detailsHeaderSurveyQuestionDisplayMap.set(id, true);
        }
    }

    getactiveDetailsHeaderSurveyQuestion(id: string): boolean {
        return this.detailsHeaderSurveyQuestionDisplayMap.get(id) ? this.detailsHeaderSurveyQuestionDisplayMap.get(id) : false;
    }

    getHeaderAttributeActiveDetailsTab(id: string): boolean {
        return this.detailsHeaderAttributeDisplayMap.get(id) ? this.detailsHeaderAttributeDisplayMap.get(id) : false;
    }

    getPartLineAttributeActiveDetailsTab(id: string): boolean {
        return this.detailsPartLineAttributeDisplayMap.get(id) ? this.detailsPartLineAttributeDisplayMap.get(id) : false;
    }

    UpdateRFQSuppleirInformation() {
        //call service in that pass rfqSupplierHeaderInformationModel to service method
        this.rfqSupplierHeaderInformationModel.id = 'F31F503F-E32A-47BD-B850-BD0695AA1250';
        this.rfaqService.UpdateSupplierStatus(this.rfqSupplierHeaderInformationModel).subscribe((result) => {
        });
    }

    fetchRFQSupplierHeaderInformation(): void {
        if (this.supplierId === '' || this.supplierId === '00000000-0000-0000-0000-000000000000') {
            this.showData = false;
            return;
        }
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
        this.rfaqService.getRFQSupplierHeaderInformationById(this.RFQID, this.supplierId).subscribe((result) => {
            refference.close();
            this.showData = true;

            // Supplier Header Information - Helani
            this.rfqSupplierHeaderInformationModel = result.data;
            if (new Date(this.rfqSupplierHeaderInformationModel.bidReceivedDate).toDateString() === new Date('0001-01-01T00:00:00').toDateString()) {
                this.bidReceivedDate = null;
            }
            else {
                this.bidReceivedDate = this.rfqSupplierHeaderInformationModel.bidReceivedDate;
            }
            if (this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId && this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId !== '00000000-0000-0000-0000-000000000000') {
                this.isDeleteandDownloadEnabledVisible = true;
            }
            else {
                this.isDeleteandDownloadEnabledVisible = false;
            }

            if (this.rfqSupplierHeaderInformationModel.qouteValideUntil) {
                this.quoteValid = 'one';
                this.isQuoteValid = false;
            }
            if (this.rfqSupplierHeaderInformationModel.daysOrWeeksInt || this.rfqSupplierHeaderInformationModel.daysOrWeekType) {
                this.quoteValid = 'two';
                this.isQuoteValid = true;
            }

            // Supplier Header Information Attatchment - Helani
            this.rfqSupplierHeaderInformationAttatchmentModel = result.data.rfqSupplierHeaderInformationAttatchments;

            if (this.rfqSupplierHeaderInformationAttatchmentModel == null || this.rfqSupplierHeaderInformationAttatchmentModel === undefined || this.rfqSupplierHeaderInformationAttatchmentModel.length === 0) {
                this.rfqSupplierHeaderInformationAttatchmentModel = [];
                const rfqSupplierHeaderInformationAttatchmentModel = new RFQSupplierHeaderInformationAttatchmentModel();
                this.rfqSupplierHeaderInformationAttatchmentModel.push(rfqSupplierHeaderInformationAttatchmentModel);
            }
            if (this.rfqSupplierHeaderInformationAttatchmentModel.length > 0) {
                for (let k = 0; k < this.rfqSupplierHeaderInformationAttatchmentModel.length; k++) {
                    if (this.rfqSupplierHeaderInformationAttatchmentModel[k].etMediaId != null) {
                        if (this.rfqSupplierHeaderInformationAttatchmentModel[k].etMediaId != '00000000-0000-0000-0000-000000000000') {
                            this.rfqSupplierHeaderInformationAttatchmentModel[k].isInformationDeleteAndDownloadEnabledVisible = true;
                        }
                    }
                }
            }

            // Supplier Header Attribute - Helani
            this.rfqSupplierHeaderAttributeGroupModel = result.data.rfqSupplierHeaderAttributeGroups;
            if (this.rfqSupplierHeaderAttributeGroupModel) {
                this.rfqSupplierHeaderAttributeGroupModel.forEach((attGroup) => {
                    if (attGroup.rfqSupplierHeaderAttributeModels) {
                        attGroup.rfqSupplierHeaderAttributeModels.forEach((attribute) => {
                            if (attribute.attributeDataName === 'Date') {
                                attribute.targetDate = attribute.targetValue;
                            }
                        });
                    }
                });
            }

            // Supplier PartLine Attribute - Helani
            this.rfqSupplierPartLineAttributeGroupModel = result.data.rfqSupplierPartLineAttributeGroups;
            if (this.rfqSupplierPartLineAttributeGroupModel) {
                this.rfqSupplierPartLineAttributeGroupModel.forEach((attGroup) => {
                    if (attGroup.rfqSupplierPartLineAttributeModels) {
                        attGroup.rfqSupplierPartLineAttributeModels.forEach((attribute) => {
                            if (attribute.attributeDataName === 'Date') {
                                attribute.targetDate = attribute.targetValue;
                            }
                        });
                    }
                });
            }

            // Supplier Header Country Origin - Helani
            this.rfqSupplierHeaderCountryOriginModel = result.data.rfqSupplierHeaderCountryOrigin;

            // Supplier PartLine Country Origin - Helani
            this.rfqSupplierPartLineCountryOriginModel = result.data.rfqSupplierPartLineCountryOrigin;

            //fetch RFQSupplierHeaderAttachment by RFQID - Rahal
            this.rfqSupplierHeaderAttachmentViewModel = result.data.rfqSupplierHeaderAttachments;

            this.rfqSupplierHeaderDeliverableModel = result.data.rfqSupplierHeaderDeliverableModels;
            if (this.rfqSupplierHeaderDeliverableModel != null) {
                if (this.rfqSupplierHeaderDeliverableModel.length > 0) {
                    this.rfqSupplierHeaderDeliverableModel.forEach((del) => {
                        console.log(del);
                        del.beginDateISO = del.beginDate;
                    });
                }
            }

            this.rfqSupplierHeaderInformationModel = result.data;
            if (this.rfqSupplierHeaderAttachmentViewModel.length > 0) {
                for (let k = 0; k < this.rfqSupplierHeaderAttachmentViewModel.length; k++) {
                    if (this.rfqSupplierHeaderAttachmentViewModel[k].etMediaId != null) {
                        if (this.rfqSupplierHeaderAttachmentViewModel[k].etMediaId != '00000000-0000-0000-0000-000000000000') {
                            this.rfqSupplierHeaderAttachmentViewModel[k].isDeleteandDownloadEnabledVisible = true;
                        }
                    }
                }
            }

            //fetch rfqsupplierpartline attachment by rfqid - Rahal
            this.rfqSupplierPartLineAttachmentViewModel = result.data.rfqSupplierPartLineAttachments;
            this.rfqSupplierHeaderInformationModel = result.data;
            if (this.rfqSupplierPartLineAttachmentViewModel.length > 0) {
                for (let k = 0; k < this.rfqSupplierPartLineAttachmentViewModel.length; k++) {
                    if (this.rfqSupplierPartLineAttachmentViewModel[k].attachmentId != null) {
                        if (this.rfqSupplierPartLineAttachmentViewModel[k].attachmentId != '00000000-0000-0000-0000-000000000000') {
                            this.rfqSupplierPartLineAttachmentViewModel[k].isDeleteandDownloadEnabledVisible = true;
                        }
                    }
                }
            }

            //Supplier Header Note - Manula
            this.rfqSupplierHeaderNoteModel = result.data.rfqSupplierHeaderNotes;
            //Supplier PartLine Note - Manula
            this.rfqSupplierPartLineNoteModel = result.data.rfqSupplierPartLineNotes;
            // Supplier Header Cost Factor - Shohan
            this.rfqSupplierCostFactorGroupModel = result.data.rfqSupplierCostFactorGroupModelList;
            // Supplier Part Line Cost Factor - Shohan
            this.rfqSupplierPartLineCostFactorGroupModel = result.data.rfqSupplierPartLineCostFactorGroupModelList;
            //Supplier Header PaymentSchedule - Abeeshan
            this.rfqSupplierHeaderPaymentScheduleModel = result.data.rfqSupplierHeaderPaymentScheduleList;

            //Supplier PartLine PaymentSchedule - Abeeshan
            this.rfqSupplierPartLinePaymentScheduleModel = result.data.rfqSupplierPartLinePaymentScheduleList;

            //Supplier Header PaymentSchedule total number - Abeeshan
            this.findsum(this.rfqSupplierHeaderPaymentScheduleModel);
            this.findsum2(this.rfqSupplierHeaderPaymentScheduleModel);

            this.etenderingLookupViewModel = result.data.supplierStatusList;

            // supplier Header rfqSupplierHeaderSurveyTemplateQuestionModel - Abeeshan
            this.rfqSupplierHeaderSurveyTemplateQuestionModel = result.data.rfqSupplierHeaderSurveyTemplateQuestionList;
            this.rfqSupplierSurveyTemplateGroupModel = result.data.rfqSupplierHeaderSurveyTemplateQuestionList;
            // Supplier Header Document text - Shohan
            this.rfqSupplierHeaderDocumentTextModel = result.data.rfqSupplierHeaderDocumentTextModelList;
            // Supplier Part Line  Document text - Shohan
            this.rfqSupplierPartLineDocumentTextModel = result.data.rfqSupplierPartLineDocumentTextModelList;
            // Supplier PartLine Deliverables - Rahal
            this.rfqSupplierPartLineDeliverableModel = result.data.rfqSupplierPartLineDeliverables;

            if (this.rfqSupplierPartLineDeliverableModel != null) {
                if (this.rfqSupplierPartLineDeliverableModel.length > 0) {
                    this.rfqSupplierPartLineDeliverableModel.forEach((del) => {
                        del.beginDateISO = del.beginDate;
                    });
                }
            }

            // Lines information task - Shohan
            this.rfqSupplierPartLineModelList = result.data.rfqSupplierPartLineModelList;
            if (this.rfqSupplierPartLineModelList.length > 0) {
                for (let k = 0; k < this.rfqSupplierPartLineModelList.length; k++) {
                    if (this.rfqSupplierPartLineModelList[k].attachmentId != null) {
                        if (this.rfqSupplierPartLineModelList[k].attachmentId != '00000000-0000-0000-0000-000000000000') {
                            this.rfqSupplierPartLineModelList[k].isDeleteandDownloadEnabledVisible = true;
                        }
                    }
                }

                for (let k = 0; k < this.rfqSupplierPartLineModelList.length; k++) {
                    for (let a = 0; a < this.rfqSupplierPartLineAttributeGroupModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineAttributeGroupModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttributes.push(this.rfqSupplierPartLineAttributeGroupModel[a]);
                        }
                    }
                    for (let a = 0; a < this.rfqSupplierPartLineAttachmentViewModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineAttachmentViewModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineAttachments.push(this.rfqSupplierPartLineAttachmentViewModel[a]);
                        }
                    }

                    for (let a = 0; a < this.rfqSupplierPartLineCostFactorGroupModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineCostFactorGroupModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCostFactors.push(this.rfqSupplierPartLineCostFactorGroupModel[a]);
                        }
                    }

                    for (let a = 0; a < this.rfqSupplierPartLineDeliverableModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineDeliverableModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDeliverables.push(this.rfqSupplierPartLineDeliverableModel[a]);
                        }
                    }

                    for (let a = 0; a < this.rfqSupplierPartLineDocumentTextModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineDocumentTextModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineDocumentTexts.push(this.rfqSupplierPartLineDocumentTextModel[a]);
                        }
                    }
                    for (let a = 0; a < this.rfqSupplierPartLineNoteModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineNoteModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineNotes.push(this.rfqSupplierPartLineNoteModel[a]);
                        }
                    }

                    for (let a = 0; a < this.rfqSupplierPartLinePaymentScheduleModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLinePaymentScheduleModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLinePaymentScheduleModel[a].dueDate) {
                                this.rfqSupplierPartLinePaymentScheduleModel[a].dueDateDO = new Date(this.rfqSupplierPartLinePaymentScheduleModel[a].dueDate);
                            }
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule = [];
                            }
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLinePaymentSchedule.push(this.rfqSupplierPartLinePaymentScheduleModel[a]);
                        }
                    }

                    for (let a = 0; a < this.rfqSupplierPartLineCountryOriginModel.length; a++) {
                        if (this.rfqSupplierPartLineModelList[k].id == this.rfqSupplierPartLineCountryOriginModel[a].rfqSupplierPartLineId) {
                            if (this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCountryOrigins == null) {
                                this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCountryOrigins = [];
                            }
                            this.rfqSupplierPartLineModelList[k].rfqSupplierPartLineCountryOrigins.push(this.rfqSupplierPartLineCountryOriginModel[a]);
                        }
                    }
                }
            }

            this.findDiscountedValue();
            this.findSubstituteDiscountedValue();
        });
    }

    addMoreDeviationDetails(details: any): void {
        const objSub = new RFXSupplierPartLineSubstitueModel();
        objSub.rfqId = this.rfqId;
        objSub.supplierID = this.supplierId;
        objSub.rfqSupplierPartLineID = details.id;
        objSub.partId = details.listOfParts[0]?.id;
        objSub.purchaseQty = details.purchaseQty;
        objSub.uomId = details.purchaseUoMId;
        objSub.currencyId = details.currencyId;
        objSub.discount = '0';
        objSub.rowId = details.rfxSupplierPartLineSubstitueModels.length + 1;

        details.rfxSupplierPartLineSubstitueModels.push(objSub);
    }

    deleteDeviationDetails(row: any, partLines: any): void {
        if (!row.id) {
            partLines.rfxSupplierPartLineSubstitueModels = partLines.rfxSupplierPartLineSubstitueModels.filter(s => s.rowId != row.rowId);
            return;
        }
        this.rfaqService.deleteSupplierPartLineSubstituteById(row.id).subscribe((result) => {
            this.fetchRFQSupplierHeaderInformation();
            this.message = 'Deleted';
            this.show('successerror');
            setTimeout(() => { this.dismiss('successerror'); }, 3000);
        });
    }

    saveAsDraft(): void {
        this.rfaqService.saveRFQSupplierHeaderInformation(this.rfqSupplierHeaderInformationModel).subscribe((result) => {
            this.fetchRFQSupplierHeaderInformation();
            this.message = 'Updated';
            this.show('successerror');
            setTimeout(() => { this.dismiss('successerror'); }, 3000);
        });
    }

    // Upload file for Header Information Attatchment - Helani
    uploadFileHeaderInformationAttatchment = (files) => {
        if (files.length === 0) {
            return;
        }
        const fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.termsService.uploadFile(formData).subscribe((result) => {
            if (result['body'] != undefined) {
                this.rfqSupplierHeaderInformationAttatchmentModel[0].etMediaId = result['body'].object[0].id;
                this.rfqSupplierHeaderInformationAttatchmentModel[0].fileName = result['body'].object[0].fileName;
                this.rfqSupplierHeaderInformationAttatchmentModel[0].isInformationDeleteAndDownloadEnabledVisible = true;
                this.reset();
            }
        });
    };

    // DownloadMedia for Header Information Attatchment - Helani
    DownloadHeaderInformationAttatchmentMedia(row) {
        this.DownloadHeaderInformationAttatchmentFile(row.etMediaId, row.fileName, row.fileExtension);
    }

    DownloadHeaderInformationAttatchmentFile(id, fileName, fileExtension) {
        const eTMedia: any = { id: id };

        this.termsService.DownloadMedia(eTMedia).subscribe((blob) => {
            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

    // Delete attachment for Header Information Attatchment - Helani
    DeleteHeaderInformationAttatchmentFile(row) {
        row.isInformationDeleteAndDownloadEnabledVisible = false;
        row.etMediaId = '';
        row.fileName = '';
    }

    dismiss(name: string): void {
        this._fuseAlertService.dismiss(name);
    }

    show(name: string): void {
        this._fuseAlertService.show(name);
    }


    isDeleteandDownloadEnabledVisible = false;
    currentRow: any;

    public unreadCount: any = 0;
    getNotificationCount() {
        this._ngZone.run(() => {
            this.chatService.getRFQCount(this.rfqId).subscribe((result) => {
                ////debugger;
                this.unreadCount = result.data;
            });
        });
    }

    //upload file for header attachment - Rahal
    uploadFile = (files) => {
        if (files.length === 0) {
            return;
        }
        const fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe((result) => {

            if (result['body'] != undefined) {
                this.currentRow.etMediaId = result['body'].object[0].id;
                this.currentRow.fileName = result['body'].object[0].fileName;
                this.currentRow.isDeleteandDownloadEnabledVisible = true;
                this.reset();
            }
        });
    };

    public uploadSurrogateFile = (files) => {
        if (files.length === 0) {
            return;
        }
        const fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe((result) => {
            if (result['body'] != undefined) {
                this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId = result['body'].object[0].id;
                this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentFileName = result['body'].object[0].fileName;
                this.isDeleteandDownloadEnabledVisible = true;
            }

        });

    };

    saveSurrogate(): void {
        if (this.rfqSupplierHeaderInformationModel.rfqSupplierHeaderPaymentScheduleList) {
            this.rfqSupplierHeaderInformationModel.rfqSupplierHeaderPaymentScheduleList.forEach((ps) => {
                ps.dueDate = ps.dueDateDO ? ps.dueDateDO.toLocaleDateString() : null;
            });
        }
        if (this.rfqSupplierPartLineModelList) {
            this.rfqSupplierPartLineModelList.forEach((rfqSupplierPartline) => {
                if (rfqSupplierPartline.rfqSupplierPartLinePaymentSchedule) {
                    rfqSupplierPartline.rfqSupplierPartLinePaymentSchedule.forEach((ps) => {
                        ps.dueDate = ps.dueDateDO ? ps.dueDateDO.toLocaleDateString() : null;
                    });
                }
            });
        }
        // this.rfqSupplierHeaderInformationModel.bidReceivedDate = new Date('0001-01-01T00:00:00');
        this.rfaqService.saveRFQSupplierHeaderInformation(this.rfqSupplierHeaderInformationModel).subscribe((result) => {
            this.fetchRFQSupplierHeaderInformation();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Saved Successfully',
                showConfirmButton: false,
                timer: 1000
            });
        });
    }
    submitSurrogate(): void {
        const errorMessage = this.validate();
        if (errorMessage !== '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: errorMessage
            });
            this.issaved = true;
            return;
        }

        if (this.rfqSupplierHeaderInformationModel.rfqSupplierHeaderPaymentScheduleList) {
            this.rfqSupplierHeaderInformationModel.rfqSupplierHeaderPaymentScheduleList.forEach((ps) => {
                ps.dueDate = ps.dueDateDO ? ps.dueDateDO.toLocaleDateString() : null;
            });
        }
        if (this.rfqSupplierPartLineModelList) {
            this.rfqSupplierPartLineModelList.forEach((rfqSupplierPartline) => {
                if (rfqSupplierPartline.rfqSupplierPartLinePaymentSchedule) {
                    rfqSupplierPartline.rfqSupplierPartLinePaymentSchedule.forEach((ps) => {
                        ps.dueDate = ps.dueDateDO ? ps.dueDateDO.toLocaleDateString() : null;
                    });
                }
            });
        }
        this.rfqSupplierHeaderInformationModel.bidReceivedDate = new Date().toLocaleDateString();
        this.rfaqService.SentQuoteSubmitted(this.rfqSupplierHeaderInformationModel).subscribe((result) => {
            this.fetchRFQSupplierHeaderInformation();
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Submitted Successfully',
                showConfirmButton: false,
                timer: 1000
            });
        });
    }

    validate(): string {
        const breakException = {};
        let errorMessage = '';
        this.isRequiredValidation = false;
        let errorFound = false;

        try {
            //Header attributes
            if (!this.rfqSupplierHeaderInformationModel.communicationMethod || this.rfqSupplierHeaderInformationModel.communicationMethod.length === 0) {
                errorMessage = 'Required field Communication Method is missing';
                throw breakException;
            }
            if (!this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId || this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId.length === 0) {
                errorMessage = 'Required field Surrogate Proof Attachment is missing';
                throw breakException;
            }

            //Header attributes
            if (this.rfqSupplierHeaderAttributeGroupModel.length > 0) {
                let errorcount = 0;
                this.rfqSupplierHeaderAttributeGroupModel.forEach((grp) => {
                    grp.rfqSupplierHeaderAttributeModels.forEach((am) => {
                        if (am.isRequired === true && (am.targetValue == null || am.targetValue.length === 0 || (am.attributeDataName === 'Number' && Number(am.targetValue) === 0))) {
                            errorcount = errorcount + 1;
                            errorMessage = 'Required fields are missing in Header Attribute Items';
                            throw breakException;
                        }

                        if (am.associatedCosts != null && am.associatedCosts.toString() === 'true' && (am.cost == null || am.cost.length === 0 || isNaN(+am.cost) || Number(am.cost) === 0)) {
                            errorcount = errorcount + 1;
                            errorMessage = 'Required fields are missing in Header Attribute Items';
                            throw breakException;
                        }
                    });
                });
                if (errorcount > 0) {
                    errorFound = true;
                }
            }

            //Header Cost factors
            if (this.rfqSupplierCostFactorGroupModel.length > 0) {
                let errorcount = 0;
                this.rfqSupplierCostFactorGroupModel.forEach((grp) => {
                    grp.rfqSupplierHearderCostFactorList.forEach((cf) => {
                        if (cf.attributeFieldTypeName === 'Supplier Required' && (cf.supplierResponse == null || +cf.supplierResponse === +'0')) {
                            errorcount = errorcount + 1;
                            errorMessage = 'Required fields are missing in Header Cost factor Items';
                            throw breakException;
                        }
                    });
                });
                if (errorcount > 0) {
                    errorFound = true;
                }
            }

            //Lines attributes
            this.rfqSupplierPartLineModelList.forEach((part) => {
                if (part.rfqSupplierPartLineAttributes != null) {

                    if (part.rfqSupplierPartLineAttributes.length > 0) {
                        let errorcount = 0;
                        part.rfqSupplierPartLineAttributes.forEach((grp) => {
                            grp.rfqSupplierPartLineAttributeModels.forEach((am) => {
                                if (am.isRequired === true && (am.targetValue == null || am.targetValue.length === 0 || (am.attributeDataName === 'Number' && Number(am.targetValue) === 0))) {
                                    errorcount = errorcount + 1;
                                    errorMessage = 'Required fields are missing in Lines Attribute Items';
                                    throw breakException;
                                }

                                if (am.associatedCosts != null && am.associatedCosts.toString() === 'true' && (am.cost == null || am.cost.length === 0 || Number(am.cost) === 0)) {
                                    errorcount = errorcount + 1;
                                    errorMessage = 'Required fields are missing in Lines Attribute Items';
                                    throw breakException;
                                }
                            });
                        });

                        if (errorcount > 0) {
                            errorFound = true;
                        }
                    }
                }
            });

            //Lines cost factors
            this.rfqSupplierPartLineModelList.forEach((part) => {
                if (part.rfqSupplierPartLineCostFactors != null) {

                    if (part.rfqSupplierPartLineCostFactors.length > 0) {
                        let errorcount = 0;
                        part.rfqSupplierPartLineCostFactors.forEach((grp) => {
                            grp.rfqSupplierPartLineCostFactorList.forEach((cf) => {
                                if (cf.attributeFieldTypeName === 'Supplier Required' && (cf.supplierResponse == null || +cf.supplierResponse === +'0')) {
                                    errorcount = errorcount + 1;
                                    errorMessage = 'Required fields are missing in Lines Cost factor Items';
                                    throw breakException;
                                }
                            });
                        });

                        if (errorcount > 0) {
                            errorFound = true;
                        }
                    }
                }
            });
        } catch (e) {
            if (e !== breakException) {
                throw e;
            }
            else {
                this.isRequiredValidation = true;
            }
        }

        return errorMessage;
    }

    DeleteSurrogateFile(row) {
        // this.etmedia.id = this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId;
        // this.termsService.DeleteFile(this.etmedia).subscribe((result) => {

        //     console.log(result);

        //     this.isDeleteandDownloadEnabledVisible = false;
        //     this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentId = null;
        //     this.rfqSupplierHeaderInformationModel.surrogateProofOfAttachmentFileName = '';

        // });
        this.isDeleteandDownloadEnabledVisible = false;
        row.surrogateProofOfAttachmentId = '';
        row.surrogateProofOfAttachmentFileName = '';
        (document.getElementsByName('surrogatefile')[0] as HTMLInputElement).value = '';
    }

    //upload file for lines attachment - Rahal
    uploadFilePartLine = (files) => {
        if (files.length === 0) {
            return;
        }
        const fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe((result) => {

            if (result['body'] != undefined) {
                this.currentRow.attachmentId = result['body'].object[0].id;
                this.currentRow.fileName = result['body'].object[0].fileName;
                this.currentRow.isDeleteandDownloadEnabledVisible = true;
                this.reset();
            }
        });
    };

    //upload file for Lines information - Shohan
    uploadLinesInformationFile = (files, row: any) => {
        if (files.length === 0) {
            return;
        }
        const fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe((result) => {

            if (result['body'] != undefined) {
                row.attachmentId = result['body'].object[0].id;
                row.fileName = result['body'].object[0].fileName;
                row.isDeleteandDownloadEnabledVisible = true;
                this.reset();
            }
        });
    };

    //DownloadBuyerMedia for header attachment - Rahal
    DownloadBuyerMedia(row) {
        this.DownloadFile(row.buyETMediaId, row.buyFileName, row.buyFileExtension);
    }

    //DownloadMedia for header attachment - Rahal
    DownloadMedia(row) {
        this.DownloadFile(row.etMediaId, row.fileName, row.fileExtension);
    }

    //DownloadMedia for header attachment - Rahal
    DownloadMediaLines(row) {
        this.DownloadFile(row.attachmentId, row.fileName, row.fileExtension);
    }

    DownloadMediaSurrogate(row) {
        this.DownloadFile(row.surrogateProofOfAttachmentId, row.surrogateProofOfAttachmentFileName, row.fileExtension);
    }

    //DownloadFile for header attachment - Rahal
    DownloadFile(id, fileName, fileExtension) {
        const eTMedia: any = { id: id };
        this.termsService.DownloadMedia(eTMedia).subscribe((blob) => {

            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

    // Download for Lines information - Shohan
    DownloadLinesInformationMedia(row) {
        this.DownloadLinesInformationFile(row.attachmentId, row.fileName, row.fileExtension);
    }

    //DownloadFile for Lines information - Shohan
    DownloadLinesInformationFile(id, fileName, fileExtension) {
        const eTMedia: any = { id: id };
        this.termsService.DownloadMedia(eTMedia).subscribe((blob) => {

            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

    //delete attachment for header attachment - Rahal
    DeleteFile(row) {
        row.isDeleteandDownloadEnabledVisible = false;
        row.etMediaId = '';
        row.fileName = '';
    }

    //delete attachment for lines attachment - Rahal
    DeleteFileParLine(row) {
        row.isDeleteandDownloadEnabledVisible = false;
        row.attachmentId = '';
        row.fileName = '';
    }

    //delete lines information - Shohan
    DeleteLinesInformationFile(row) {
        row.isDeleteandDownloadEnabledVisible = false;
        row.etMediaId = '';
        row.fileName = '';
    }

    findsum(data): void {
        let workTotalTemp = 0; let paymentTotolTemp = 0; let retentionTotalTemp = 0; let releaseTotalTemp = 0;
        this.workTotal = this.paymentTotal = this.retentionTotal = this.total = this.releaseTotal = 0;

        for (let j = 0; j < data.length; j++) {
            if (data[j].dueDate) {
                data[j].dueDateDO = new Date(data[j].dueDate);
            }
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

    findsum2(data): void {
        let sworkTotalTemp = 0; let spaymentTotolTemp = 0; let sretentionTotalTemp = 0; let sreleaseTotalTemp = 0;
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

    partlinePsWorkTotal(id): string {
        let workTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                workTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.work);
            }
        }
        return workTotalTemp.toFixed(2);
    }
    partlinePsPaymentTotal(id): string {
        let paymentTotolTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                paymentTotolTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.payment);
            }
        }
        return paymentTotolTemp.toFixed(2);
    }
    partlinePsRetensionTotal(id): string {
        let retentionTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                retentionTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.retention);
            }
        }
        return retentionTotalTemp.toFixed(2);
    }
    partlinePsReleaseTotal(id): string {
        let releaseTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.release);
            }
        }
        return releaseTotalTemp.toFixed(2);
    }
    partlinePsReleaseValueTotal(id): string {
        let releaseValueTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseValueTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].rfqPartLinePaymentScheduleModel.releaseValue);
            }
        }
        return releaseValueTemp.toFixed(2);
    }

    spartlinePsWorkTotal(id): string {
        let workTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                workTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].work);
            }
        }
        return workTotalTemp.toFixed(2);
    }
    spartlinePsPaymentTotal(id): string {
        let paymentTotolTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                paymentTotolTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].payment);
            }
        }
        return paymentTotolTemp.toFixed(2);
    }
    spartlinePsRetensionTotal(id): string {
        let retentionTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                retentionTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].retention);
            }
        }
        return retentionTotalTemp.toFixed(2);
    }
    spartlinePsReleaseTotal(id): string {
        let releaseTotalTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseTotalTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].release);
            }
        }
        return releaseTotalTemp.toFixed(2);
    }
    spartlinePsReleaseValueTotal(id): string {
        let releaseValueTemp = 0;
        for (let j = 0; j < this.rfqSupplierPartLinePaymentScheduleModel.length; j++) {
            if (this.rfqSupplierPartLinePaymentScheduleModel[j].rfqSupplierPartLineId == id) {
                releaseValueTemp += Number(this.rfqSupplierPartLinePaymentScheduleModel[j].releaseValue);
            }
        }
        return releaseValueTemp.toFixed(2);
    }

    calSupPaySchTotoal(): void {
        this.findsum2(this.rfqSupplierHeaderPaymentScheduleModel);
    }

    fetchSupplierList(): void {
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
        this.rfqSupplierService.getRFQSupplierByRFQId(this.RFQID).subscribe((result) => {
            refference.close();
            this.rfqSupplierSearchModel.supplierViewModels = result.data.suppliers;
        });
    }

    openShipment(): void {
        const dialogRef = this.dialog.open(AddEditShippingOverlayComponent, { data: { 'context': this } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    editShipment(row: any): void {
        const dialogRef = this.dialog.open(AddEditShippingOverlayComponent, { data: { 'id': row, 'context': this } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    deleteShipment(id: string): void {
        const dialogRef = this._fuseConfirmationService.open({
            'title': 'Remove contact',
            'message': 'Are you sure you want to delete this record?',
            'icon': {
                'show': true,
                'name': 'heroicons_outline:exclamation',
                'color': 'warn'
            },
            'actions': {
                'confirm': {
                    'show': true,
                    'label': 'Remove',
                    'color': 'warn'
                },
                'cancel': {
                    'show': true,
                    'label': 'Cancel'
                }
            },
            'dismissible': true
        });
        dialogRef.addPanelClass('confirmation-dialog');
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const data = this.rfqSupplierHeaderCountryOriginModel.filter(x => x.id == id);
                const index = this.rfqSupplierHeaderCountryOriginModel.indexOf(data[0]);
                this.rfqSupplierHeaderCountryOriginModel[index].isDeleting = true;
                this.rfaqService.deleteRFQSupplierHeaderCountryOrigin(id).subscribe((result) => {
                    if (index >= 0) {
                        this.rfqSupplierHeaderCountryOriginModel.splice(index, 1);
                        this.message = 'Deleted';
                        this.show('successerror');
                        setTimeout(() => { this.dismiss('successerror'); }, 3000);
                    }
                });
            }
        });
    }

    // open PartLine Shipment Overlay - Helani
    openLineShipment(rfqSupplierPartline): void {
        const dialogRef = this.dialog.open(AddEditLineShippingOverlayComponent, { data: { 'context': this, 'rfqSupplierPartline': rfqSupplierPartline } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    // edit PartLine Shipment Overlay - Helani
    editLineShipment(row: any, rfqSupplierPartline): void {
        const dialogRef = this.dialog.open(AddEditLineShippingOverlayComponent, { data: { 'id': row, 'context': this, 'rfqSupplierPartline': rfqSupplierPartline } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    deleteLineShipment(id: string, rfqSupplierPartline): void {
        const dialogRef = this._fuseConfirmationService.open({
            'title': 'Remove contact',
            'message': 'Are you sure you want to delete this record?',
            'icon': {
                'show': true,
                'name': 'heroicons_outline:exclamation',
                'color': 'warn'
            },
            'actions': {
                'confirm': {
                    'show': true,
                    'label': 'Remove',
                    'color': 'warn'
                },
                'cancel': {
                    'show': true,
                    'label': 'Cancel'
                }
            },
            'dismissible': true
        });
        dialogRef.addPanelClass('confirmation-dialog');
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == 'confirmed') {
                const data = rfqSupplierPartline.rfqSupplierPartLineCountryOrigins.filter(x => x.id == id);
                const index = rfqSupplierPartline.rfqSupplierPartLineCountryOrigins.indexOf(data[0]);
                rfqSupplierPartline.rfqSupplierPartLineCountryOrigins[index].isDeleting = true;
                this.rfaqService.deleteRFQSupplierPartLineCountryOrigin(id).subscribe((result) => {
                    if (index >= 0) {
                        rfqSupplierPartline.rfqSupplierPartLineCountryOrigins.splice(index, 1);
                        this.message = 'Deleted';
                        this.show('successerror');
                        setTimeout(() => { this.dismiss('successerror'); }, 3000);
                    }
                });
            }
        });
    }

    openCopytoLines(): void {
        const dialogRef = this.dialog.open(CopyToLinesOverlayComponent, { data: { 'context': this, 'rfqId': this.rfqId, 'supplierId': this.supplierId } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    showHideQuoteDaysOrWeeksOption(numm): void {
        if (numm === 'one') {
            this.quoteValid = 'one';
            this.isQuoteValid = false;
            this.rfqSupplierHeaderInformationModel.daysOrWeeksInt = null;
            this.rfqSupplierHeaderInformationModel.daysOrWeekType = null;
        }
        if (numm === 'two') {
            this.quoteValid = 'two';
            this.isQuoteValid = true;
            this.rfqSupplierHeaderInformationModel.qouteValideUntil = null;
        }
    }

    findDiscountedValue(): void {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.rfqSupplierPartLineModelList.length; i++) {
            this.rfqSupplierPartLineModelList[i].discountedValue = (this.rfqSupplierPartLineModelList[i].unitPrice) * (this.rfqSupplierPartLineModelList[i].discount) / 100;
            this.rfqSupplierPartLineModelList[i].finalUnitPrice = (this.rfqSupplierPartLineModelList[i].unitPrice) - this.rfqSupplierPartLineModelList[i].discountedValue;
            this.rfqSupplierPartLineModelList[i].totalPrice = (this.rfqSupplierPartLineModelList[i].finalUnitPrice) * (this.rfqSupplierPartLineModelList[i].purchaseQty);

            // eslint-disable-next-line max-len
            this.rfqSupplierPartLineModelList[i].discountedValue = this.rfqSupplierPartLineModelList[i].discountedValue ? this.rfqSupplierPartLineModelList[i].discountedValue.toFixed(2) : 0;
            // eslint-disable-next-line max-len
            this.rfqSupplierPartLineModelList[i].finalUnitPrice = this.rfqSupplierPartLineModelList[i].finalUnitPrice ? this.rfqSupplierPartLineModelList[i].finalUnitPrice.toFixed(2) : 0;
            this.rfqSupplierPartLineModelList[i].totalPrice = this.rfqSupplierPartLineModelList[i].totalPrice ? this.rfqSupplierPartLineModelList[i].totalPrice.toFixed(2) : 0;
        }
    }

    findSubstituteDiscountedValue(): void {
        for (let i = 0; i < this.rfqSupplierPartLineModelList.length; i++) {
            for (let j = 0; j < this.rfqSupplierPartLineModelList[i].rfxSupplierPartLineSubstitueModels.length; j++) {
                this.calculateSubstituteDiscountedValue(this.rfqSupplierPartLineModelList[i].rfxSupplierPartLineSubstitueModels[j]);
            }
        }
    }

    calculateSubstituteDiscountedValue(substitue): void {
        substitue.discountedValue = (substitue.price) * (substitue.discount) / 100;
        substitue.finalUnitPrice = (substitue.price) - substitue.discountedValue;
        substitue.totalPrice = (substitue.finalUnitPrice) * (substitue.purchaseQty);

        substitue.discountedValue = substitue.discountedValue ? substitue.discountedValue.toFixed(2) : 0;
        substitue.finalUnitPrice = substitue.finalUnitPrice ? substitue.finalUnitPrice.toFixed(2) : 0;
        substitue.totalPrice = substitue.totalPrice ? substitue.totalPrice.toFixed(2) : 0;
    }

    handleDOBChange(row): void {
        const dd = row.beginDateISO.getDate();
        let mm = row.beginDateISO.getMonth() + 1;
        if (mm < 10) {
            mm = '0' + mm;
        }
        const yyyy = row.beginDateISO.getFullYear();
        let hh = row.beginDateISO.getHours();
        if (hh < 10) {
            hh = '0' + hh;
        }
        let min = row.beginDateISO.getMinutes();
        if (min < 10) {
            min = '0' + min;
        }
        let ss = row.beginDateISO.getSeconds();
        if (ss < 10) {
            ss = '0' + ss;
        }
        row.beginDate = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + ss;
    }

    handleAttributeDateChange(row): void {
        const dd = row.targetDate.getDate();
        let mm = row.targetDate.getMonth() + 1;
        if (mm < 10) {
            mm = '0' + mm;
        }
        const yyyy = row.targetDate.getFullYear();
        let hh = row.targetDate.getHours();
        if (hh < 10) {
            hh = '0' + hh;
        }
        let min = row.targetDate.getMinutes();
        if (min < 10) {
            min = '0' + min;
        }
        let ss = row.targetDate.getSeconds();
        if (ss < 10) {
            ss = '0' + ss;
        }
        row.targetValue = yyyy + '-' + mm + '-' + dd + 'T' + hh + ':' + min + ':' + ss;
    }

    toDatetimeLocal(date: Date): string {
        const dateString = date.getFullYear() +
            '-' + pad0(date.getMonth() + 1) +
            '-' + pad0(date.getDate()) +
            'T' + pad0(date.getHours()) +
            ':' + pad0(date.getMinutes()) +
            ':' + pad0(date.getSeconds());

        return dateString;
    }

    //OnChangeValidation
    OnAttributeHeaderChange(name, row, lbl, m): void {
        this.TypeValidation[m] = false;
        this.TypeValidationText[m] = '';
        if (lbl == 'tve') {
            if (row.attributeDataName == 'Number') {
                if (!isNaN(name)) {
                    if (row.format == 'Percentage') {
                        if (name.length > 100) {
                            this.TypeValidation[m] = true;
                            this.TypeValidationText[m] = 'Value : Invalid Percentage';

                        }
                    }
                    /* if(row.format=="Decimal"){

                    }  */
                }
                else {

                    this.TypeValidation[m] = true;
                    this.TypeValidationText[m] = 'Value : Invalid Number';

                }
            }
            if (row.attributeDataName == 'Text') {
                if (row.format != null) {
                    if (row.format < name.length) {
                        this.TypeValidation[m] = true;
                        this.TypeValidationText[m] = 'Value : Max text length is ' + row.format;

                    }
                }
            }

        }

        if (lbl == 'cost') {
            if (isNaN(name)) {
                this.TypeValidation[m] = true;
                this.TypeValidationText[m] = 'Value : Invalid Number';

            }
        }
    }
    //
    OnAttributeHeaderCostChange(row) {

        if (row.associatedCosts.toString() == 'false') {

            row.cost = 0;
            // console.log(row);
        }
    }
    OnAttributeLineChange(name, row, lbl, n) {
        this.TypeValidationAttrLine[n] = false;
        this.TypeValidationAttrLineText[n] = '';
        if (lbl == 'tve') {
            if (row.attributeDataName == 'Number') {
                if (!isNaN(name)) {
                    if (row.format == 'Percentage') {
                        if (name.length > 100) {
                            this.TypeValidationAttrLine[n] = true;
                            this.TypeValidationAttrLineText[n] = 'Value : Invalid Percentage';

                        }
                    }
                    /* if(row.format=="Decimal"){

                    }  */
                }
                else {

                    this.TypeValidationAttrLine[n] = true;
                    this.TypeValidationAttrLineText[n] = 'Value : Invalid Number';

                }
            }
            if (row.attributeDataName == 'Text') {
                if (row.format != null) {
                    if (row.format < name.length) {
                        this.TypeValidationAttrLine[n] = true;
                        this.TypeValidationAttrLineText[n] = 'Value : Max text length is ' + row.format;

                    }
                }
            }

        }

        if (lbl == 'cost') {
            if (isNaN(name)) {
                this.TypeValidationAttrLine[n] = true;
                this.TypeValidationAttrLineText[n] = 'Value : Invalid Number';

            }
        }
    }

    OnAttributeLineCostChange(row) {

        if (row.associatedCosts.toString() == 'false') {

            row.cost = 0;
            // console.log(row);
        }
    }

    OnCFValueChangeLine(name, l) {
        this.CFTypeValidationAttrLine[l] = false;
        this.CFTypeValidationAttrLineText[l] = '';
        if (isNaN(name)) {
            this.CFTypeValidationAttrLine[l] = true;
            this.CFTypeValidationAttrLineText[l] = 'Value : Invalid Number';

        }
    }
    OnCFValueChangeHdr(name, k) {
        this.CFTypeValidation[k] = false;
        this.CFTypeValidationText[k] = '';
        if (isNaN(name)) {
            this.CFTypeValidation[k] = true;
            this.CFTypeValidationText[k] = 'Value : Invalid Number';

        }
    }

    getType(type): string {
        if (type !== null) {
            if (type === 'Number') {
                return 'number';
            } else {
                return 'text';
            }
        } else {
            return 'number';
        }

    }

    openCostFactors(): void {
        const dialogRef = this.dialog.open(AddNewLineCostfactorOverlayComponent, { data: { 'context': this } });
        dialogRef.addPanelClass('inline-md-overlay');
        // dialogRef.disableClose = true;
        dialogRef.afterClosed().subscribe((result) => {
            const newRow = {
                list: result.list,
                type: result.type,
                description: result.description,
                value: result.value,
            };

            this.dataSourcecostFactBySupplier = [...this.dataSourcecostFactBySupplier, newRow];
        });
    }
}

function pad0(num) {
    return (num < 10 ? '0' : '') + num;
}
