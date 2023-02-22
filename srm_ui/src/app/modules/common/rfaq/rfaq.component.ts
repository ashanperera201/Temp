/* eslint-disable max-len */
import { Component, ElementRef, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagsOverlayComponent } from 'app/modules/common/tags-overlay/tags-overlay.component';
import { ChatsComponent } from 'app/modules/common/chats/chats.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddEditLineShippingOverlayComponent } from './add-edit-line-shipping-overlay/add-edit-line-shipping-overlay.component';
import { CopyToLinesOverlayComponent } from './copy-to-lines-overlay/copy-to-lines-overlay.component';
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
import { AddEditShippingOverlayComponent } from './add-edit-shipping-overlay/add-edit-shipping-overlay.component';
import { Terms1Component } from '../terms1/terms1.component';
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
import { RFQSupplierHeaderTermsConditionModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-termscondition-view-model';
import { RFXScoringModel } from 'app/main/Models/etendering/ViewModels/rfx-scoring-view-model';

export interface RowData {
    stepNumber: string;
    id: string;
    name: string;
    address: string;
    status: string;
    rules: string;
    template: string;
}

export interface RowData4 {
    payno: string;
    description2: string;
    work: string;
    milestone: string;
    payment: string;
    retention: string;
    release: string;
    releasevalue: string;
}

export interface RowData6 {
    srno: string;
    title: string;
    filename: string;
    documentclass: string;
    reference: string;
    atttype: string;
}

export interface RowData7 {
    docsrno: string;
    outputtype: string;
    documentext: string;
}

export interface RowData8 {
    notesrno: string;
    notes: string;
}

export interface RowData9 {
    milestonenumber: string;
    milestonename: string;
    deliverabledescription: string;
    prevmilestonenumber: string;
    progresspercentage: string;
    stagepercentage: string;
    begindate: string;
}

export interface RowData15 {
    group: string;
}

export interface RowData17 {
    costfactName: string;
    costfactType: string;
    costfactDesc: string;
    costfactExpectedValue: string;
    costfactValue: string;
    costfactComments: string;
}

// export interface RowData19 {
//     attributeItem: string;
//     description: string;
//     expectedValue: string;
//     value: string;
//     assocCosts: string;
//     cost: string;
//     comments: string;
// }

/** Constants used to fill up our data base. */
const PAYNO: string[] = [
    '10101', '10102'
];
const DESCRIPTION2: string[] = [
    'Freight Cost for single shipment'
];
const WORK: string[] = [
    '01%'
];
const MILESTONE: string[] = [
    '01', '02'
];
const PAYMENT: string[] = [
    '20%', '30%'
];
const RETENTION: string[] = [
    '25%', '34%'
];
const RELEASE: string[] = [
    '20%', '30%'
];
const RELEASEVALUE: string[] = [
    '87234 USD'
];


/** Constants used to fill up our data base. */
const SRNO: string[] = [
    '10101', '10102'
];
const TITLE: string[] = [
    'xxxxxxxxxxxx'
];
const FILENAME: string[] = [
    'abcd.xml', 'pqrs.xml'
];
const DOCUMENTCLASS: string[] = [
    'XXX', 'YYY'
];
const REFERENCE: string[] = [
    'PR 001', 'PR 002'
];
const ATTTYPE: string[] = [
    'Technical', 'Non Technical'
];


/** Constants used to fill up our data base. */
const DOCSRNO: string[] = [
    '10101', '10102'
];
const OUTPUTTYPE: string[] = [
    'XXX', 'YYY'
];
const DOCUMENTTEXT: string[] = [
    'xxxxx xxxxxx xxxxx'
];


/** Constants used to fill up our data base. */
const NOTESRNO: string[] = [
    '10101', '10102'
];
const NOTES: string[] = [
    'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', 'Ipsum is simply dummy text and typesetting industry. '
];

/** Constants used to fill up our data base. */
const MILESTONENUMBER: string[] = [
    '01', '02'
];
const MILESTONENAME: string[] = [
    'Design Approval', 'Design Approval'
];
const DELIVERABLEDESCRIPTION: string[] = [
    'lorem ipsum text'
];
const PREVMILESTONENUMBER: string[] = [
    'PR 001', 'PR 002'
];
const PROGRESSPERCENTAGE: string[] = [
    '25%', '75%'
];
const STAGEPERCENTAGE: string[] = [
    '15%', '35%'
];
const BEGINDATE: string[] = [
    '02 -12-2021', '22 -12-2021'
];


/** Constants used to fill up our data base. */
const COSTFACTNAME: string[] = [
    'Line Price', 'Cost of Start-Up & C/Ammissioning Spares'
];
const COSTFACTTYPE: string[] = [
    'Total', 'Fixed'
];
const COSTFACTDESC: string[] = [
    'Charges applicable for R&', 'cost of administration '
];
const COSTFACTEXPECTEDVALUE: string[] = [
    '$25,000.00', '$35,000.00'
];
const COSTFACTVALUE: string[] = [
    '$5,000.00', '$5,000.00'
];
const COSTFACCOMMENTS: string[] = [
    'comment'
];


/** Constants used to fill up our data base. */
const ATTRIBUTEITEM: string[] = [
    'Minimum Order', 'Packaging'
];
const RESDESCRIPTION: string[] = [
    'Min order quantity', 'When can you ship?'
];
const EXPECTEDVALUE: string[] = [
    '100', 'Purposes/Overlays/Structures'
];
const RESVALUE: string[] = [
    'Number', 'Text'
];
const ASSOCCOSTS: string[] = [
    'Yes', 'No'
];
const COST: string[] = [
    '236.00 USD', '456.00 USD'
];
const COMMENT: string[] = [
    ''
];

/** Constants used to fill up our data base. */
const TBECOMMENT: string[] = [
    'comment description'
];
const TBEWEIGHT: string[] = [
    '05', '02'
];

@Component({
    selector: 'rfaq',
    templateUrl: './rfaq.component.html',
    styleUrls: ['./rfaq.component.scss'],
    encapsulation: ViewEncapsulation.None,
    styles: [
        /* language=SCSS */
        `
            .add-attribute-items-parent-grid {
                grid-template-columns: 5% 35% 35% 10%;
                border-top: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;

                @screen md {
                    grid-template-columns: 5% 35% 35% 10%;
                }
            }
            .attribute-items-parent-grid {
                grid-template-columns: 40px 20% 20% auto 96px;
                border-top: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;

                @screen md {
                    grid-template-columns: 40px 10% 10% auto 96px;
                }
            }
            .attribute-items-parent-grid2 {
                grid-template-columns: 20% 20% auto 96px;
                border-top: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;

                @screen md {
                    grid-template-columns: 10% 10% auto 96px;
                }
            }
            .attribute-items-inner-grid {
                grid-template-columns: 40px 10% 12% auto 10% 10% 10% 10%;
                border-top: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;

                @screen md {
                    grid-template-columns: 40px 10% 12% auto 10% 10% 10% 10%;
                }
            }
            .noneditable-attribute-items-inner-grid {
                grid-template-columns: 35% auto 30%;
                min-width: 500px;

                @screen md {
                    grid-template-columns: 35% auto 30%;
                }
            }
            .noneditable-attribute-items-inner-grid2 {
                grid-template-columns: 25% 25% 20% auto;
                min-width: 500px;

                @screen md {
                    grid-template-columns: 25% 25% 20% auto;
                }
            }
            .costfactor-items-parent-grid {
                grid-template-columns: 40px 20% auto 96px;
                border-top: 1px solid #eeeeee;
                border-bottom: 1px solid #eeeeee;

                @screen md {
                    grid-template-columns: 40px 15% auto 96px;
                }
            }
            .noneditable-costfactor-items-parent-grid {
                grid-template-columns: 20% auto 96px;

                @screen md {
                    grid-template-columns: 10% auto 96px;
                }
            }
            .costfactor-items-inner-grid {
                grid-template-columns: 40px 10% 12% 12% 15% 10% 10% 10% 14%;

                @screen md {
                    grid-template-columns: 40px 10% 12% 12% 15% 10% 10% 10% 14%;
                }
            }
            .survey-parent-grid {
                grid-template-columns: 20% auto 120px 96px;

                @screen md {
                    grid-template-columns: 20% auto 120px 96px;
                }
            }
            .scoring-grid {
                grid-template-columns: auto 260px 260px 96px;
                min-width: 800px;

                @screen md {
                    grid-template-columns: auto 260px 260px 96px;
                    min-width: 800px;
                }
            }
            .scoring-inner-grid {
                grid-template-columns: auto 160px 160px;

                @screen md {
                    grid-template-columns: auto 160px 160px;
                }
            }
            .survey-inner-grid {
                grid-template-columns: 20% auto 14% 12% 20%;
                min-width: 900px;

                @screen md {
                    grid-template-columns: 20% auto 14% 12% 20%;
                }
            }
            .line-items-parent-grid {
                grid-template-columns: 40px 60px 60px 90px auto 80px 80px 110px 80px 100px 100px 96px;

                @screen md {
                    grid-template-columns: 40px 60px 60px 90px auto 80px 80px 110px 80px 100px 100px 96px;
                }
            }
            .noneditable-line-items-parent-grid {
                grid-template-columns: 10% 10% 10% auto 15% 10% 20% 15% 20% 20% 20%;

                @screen md {
                    grid-template-columns: 60px 60px 90px auto 80px 80px 110px 80px 100px 100px 96px;
                }
            }
            .noneditable-line-items-parent-grid2 {
                grid-template-columns: 60px 20% 20% 80px 80px 20% 100px 100px 96px;

                @screen md {
                    grid-template-columns: 60px 20% 20% 80px 80px 20% 100px 100px 96px;
                }
            }
            .scoring-line-items-grid {
                grid-template-columns: 60px 140px auto 260px 260px;

                @screen md {
                    grid-template-columns: 60px 140px auto 260px 260px;
                }
            }
            .scoring-line-items-criteria-grid {
                grid-template-columns: auto 120px 120px 135px;

                @screen md {
                    grid-template-columns: auto 120px 120px 135px;
                }
            }
            .awardline-grid {
                grid-template-columns: 90px 80px 120px 110px 180px 180px 120px;

                @screen md {
                    grid-template-columns: 90px 80px 120px 110px 180px 180px 120px;
                }
            }
            .deviation-grid {
                grid-template-columns: 40px 150px 200px 150px 150px 150px;

                @screen md {
                    grid-template-columns: 40px 150px 200px 150px 150px 150px;
                }
            }
            .noneditable-deviation-grid {
                grid-template-columns: 150px 250px 150px 150px 150px;

                @screen md {
                    grid-template-columns: 150px 250px 150px 150px 150px;
                }
            }
            .overall-supplier-grid {
                grid-template-columns: 140px 80px 160px 60px 60px 60px 180px;

                @screen md {
                    grid-template-columns: 140px 80px 160px 60px 60px 60px 180px;
                }
            }
            .shipment-grid {
                grid-template-columns: 40px 100px 100px 100px 180px 150px 150px 150px;

                @screen md {
                    grid-template-columns: 40px 100px 100px 100px 180px 150px 150px 150px;
                }
            }
            .noneditable-shipment-grid {
                grid-template-columns: 100px 100px 100px 180px 150px 150px 150px;

                @screen md {
                    grid-template-columns: 100px 100px 100px 180px 150px 150px 150px;
                }
            }
            .tbe-noneditable-line-items-parent-grid {
                grid-template-columns: 80px 80px 100px 200px 80px 80px 130px 100px 120px 120px 100px 100px 140px 180px 96px;

                @screen md {
                    grid-template-columns: 80px 80px 100px 200px 80px 80px 130px 100px 120px 120px 100px 100px 140px 180px 96px;
                }
            }
        `
    ],
})

export class RfaqComponent {
    displayedColumn4: string[] = ['id', 'payno', 'description2', 'type2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'visibility'];
    displayedColumn42: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate']
    displayedColumnPayment: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate']
    displayedColumn43: string[] = ['payno', 'description2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue'];
    displayedColumnResponce: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
    displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
    displayedColumn62: string[] = ['srno', 'title', 'buyfileName', 'attachment', 'atttype', 'attachment2', 'comment'];
    displayedColumn7: string[] = ['id', 'docsrno', 'outputtype', 'documentext', 'type3', 'visibility3'];
    displayedColumn72: string[] = ['documentext', 'documentext2', 'comment'];
    displayedColumn8: string[] = ['id', 'notesrno', 'notes', 'type4', 'visibility4'];
    displayedColumn82: string[] = ['notes', 'notes2', 'comment'];
    displayedColumn9: string[] = ['id', 'milestonenumber', 'milestonename', 'deliverabledescription', 'type5', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'visibility5'];
    displayedColumn92: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate'];
    displayedColumn93: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'comment'];
    displayedColumn17: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'costfactExpectedValue', 'costfactValue', 'costfactComments'];
    displayedColumn19: string[] = ['attributeItem', 'description', 'expectedValue', 'value', 'assocCosts', 'cost', 'comments'];

    dataSource4: MatTableDataSource<RowData4>;
    dataSource6: MatTableDataSource<RowData6>;
    dataSource7: MatTableDataSource<RowData7>;
    dataSource8: MatTableDataSource<RowData8>;
    dataSource9: MatTableDataSource<RowData9>;
    dataSource17: MatTableDataSource<RowData17>;
    //dataSource19: MatTableDataSource<RowData19>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('file') currentFile: ElementRef; reset() { this.currentFile.nativeElement.value = ''; }


    panelOpenState = false;
    supplierStatuses: any[];
    status: string = "";
    //statusID:string = "";
    rfqId: any = '78A1D6C1-E816-4B48-7E88-08DA28424952';
    supplierId: any = '63B53126-C6E2-411C-A732-065AB743448F';
    supplierID: any = '63B53126-C6E2-411C-A732-065AB743448F';

    message: string = "";
    isInformationDeleteAndDownloadEnabledVisible = false;
    rfqCurrencies: any = [];
    showData = false;

    // For Parent child relationship between Attribute - Helani
    detailsHeaderAttributeDisplayMap = new Map();
    detailsPartLineAttributeDisplayMap = new Map();
    detailsHeaderSurveyQuestionDisplayMap = new Map();
    bidClosingDate: any;
    bidOpeningDate: any;

    allCOnditionsAccepted: boolean = true;

    rfqSupplierHeaderInformationModel: RFQSupplierHeaderInformationModel = new RFQSupplierHeaderInformationModel;
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

    frmHeaderAttachmentList: FormGroup;
    etmedia: any = { id: "00000000-0000-0000-0000-000000000000", fileName: "" };

    rfqSupplierHeaderPaymentScheduleModel: RFQSupplierHeaderPaymentScheduleModel[];
    rfqHeaderPaymentScheduleModel: RFQHeaderPaymentScheduleModel[];
    rfqSupplierPartLinePaymentScheduleModel: RFQSupplierPartLinePaymentScheduleModel[];
    rfqPartLinePaymentSchedule: RFQPartLinePaymentScheduleModel[];
    etenderingLookupViewModel: EtenderingLookupViewModel[];
    rfqSupplierHeaderSurveyTemplateQuestionModel: RFQSupplierHeaderSurveyTemplateQuestionModel[];
    rfqSurveyQuestionModel: RFQQuestionModel[];
    AttributeFieldTypes: any[];
    rfqSupplierHeaderTermsConditionModel: RFQSupplierHeaderTermsConditionModel[];

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

    rfqModel: RFQViewModel = new RFQViewModel();

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

    //Soring form variables - abeeshan 

    rfxScoringModel: RFXScoringModel[];
    rfqHeaderScoringCriterias: any[];
    scoringModel: any;
    detailsDisplayMap = new Map();
    scoringForm: FormGroup;
    headerAttributeModel: any;
    headerCFModel: any;
    headerAttachModel: any;
    headerDeliModel: any;
    headerPSModel: any;
    headerTSModel: any;
    headerNoteModel: any;
    headerDTModel: any;
    headerCriteriaModel: any;
    lineCriteriaModel: any;
    partLineModel: any;
    rfqPartLineId: any = "00000000-0000-0000-0000-000000000000";
    rfqKnockOutScorePartLineId: any = "00000000-0000-0000-0000-000000000000";
    lineAttributeModel: any;
    lineCFModel: any;
    lineAttachModel: any;
    lineDeliModel: any;
    linePSModel: any;
    lineNoteModel: any;
    lineDTModel: any;
    lineScoringCriteriaModel: any;
    mainFormModel: any = {
        "rfqId": "", "scoringHeaderAttributes": [], "scoringHeaderCFs": [], "scoringHeaderAttachments": [],
        "scoringFeaderDeliveries": [], "scoringHeaderPSs": [], "scoringHeaderNotes": [], "scoringHeaderDTs": [], "scoringPartLines": [],
        "scoringLineAttributes": [], "scoringLineAttach": [], "scoringlineDocumentText": [], "scoringlineDelivery": [], "scoringLinePSs": [],
        "scoringlineNote": [], "scoringHeaderCriteria": [], "scoringLineCriteria": [], "scoringPartLineCriteria": []
    };
    rfqid: string;
    rfqScoringHeaderModel: any;
    rfqScoringLineModel: any;
    rfqLineScoringCriterias: any;
    rfqPartLineScoringCriterias: any;
    rfqScoringLineAttributeModel: any;
    totalrfxHeader: any = 0;
    headerTotalPercentage: any = 0;
    headerTotalPoints: any = 0;
    lineTotalPercentage: any = 0;
    lineTotalPoints: any = 0;
    rfqPartLinePoints: any = 0;
    rfqPartLinePercentage: any = 0;
    rfqPartLineKnockOut: any = 0;
    rfxheader: any = 0;
    rfxline: any = 0;

    /**
     * Constructor
     */
    constructor(public dialog: MatDialog,
        private rfaqService: RfaqService,
        private termsService: TermsService,
        private rfqService: RfqService,
        private _fuseAlertService: FuseAlertService,
        private _fuseConfirmationService: FuseConfirmationService
        , private chatService: ChatService
        , private _ngZone: NgZone) {

        const users4 = Array.from({ length: 6 }, (_, k) => createNewRow4(k + 1));
        const users6 = Array.from({ length: 3 }, (_, k) => createNewRow6(k + 1));
        const users7 = Array.from({ length: 3 }, (_, k) => createNewRow7(k + 1));
        const users8 = Array.from({ length: 3 }, (_, k) => createNewRow8(k + 1));
        const users9 = Array.from({ length: 3 }, (_, k) => createNewRow9(k + 1));
        const users17 = Array.from({ length: 3 }, (_, k) => createNewRow17());
        //const users19 = Array.from({ length: 3 }, (_, k) => createNewRow19());

        this.dataSource4 = new MatTableDataSource(users4);
        this.dataSource6 = new MatTableDataSource(users6);
        this.dataSource7 = new MatTableDataSource(users7);
        this.dataSource8 = new MatTableDataSource(users8);
        this.dataSource9 = new MatTableDataSource(users9);
        this.dataSource17 = new MatTableDataSource(users17);
        //this.dataSource19 = new MatTableDataSource(users19);
    }

    //RFQ Information - Manula

    Message: string = "";

    getRFQById() {
        this.rfqService.getRFQById(this.rfqId, false, false).subscribe((result) => {
            this.rfqModel = result.data;

            if (this.rfqModel.statusName == "Publish/Bid Live") {
                setInterval(() => {
                    this.myTimer()
                }, 1000);
            }

            this.FetchRFQCurrency();
            // this.getCities(this.rfqModel.countryID);            
        });
    }

    getRFQSupplierHeaderTermsConditionByID(isLoad) {
        this.rfaqService.getRFQSupplierHeaderTermsConditionByID(this.rfqId, this.supplierID, isLoad).subscribe(result => {
            this.showData = true;
            this.rfqSupplierHeaderTermsConditionModel = result.data;
            if (isLoad) {
                this.rfqSupplierHeaderTermsConditionModel.forEach(x => {
                    if (x.rfqTermsConditionModel.termsConditionModel.beforeQuoteStatus == "Mandatory") {
                        if (x.isAccepted == null) {
                            this.allCOnditionsAccepted = false;
                        }
                    }
                    return true;
                });
            } else {
                this.rfqSupplierHeaderTermsConditionModel.forEach(x => {
                    if (x.rfqTermsConditionModel.termsConditionModel.submitQuoteStatus == "Mandatory") {
                        if (x.isAccepted == null) {
                            this.allCOnditionsAccepted = false;
                        }
                    }
                    return true;
                });
            }

            if (this.allCOnditionsAccepted == false) {
                this.openTerms1(isLoad);
            } else {
                if (isLoad) {
                    this.FetchRFAQDAta();
                } else if (!isLoad) {
                    this.submitResponse();
                }
            }
        })
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

    showTimerAndActionButtons: boolean = false;
    //Timer dynamically done - Gangez
    myTimer() {

        if (this.rfqModel) {

            if (this.rfqModel.bidClosingDate && this.rfqModel.bidOpeningDate) {

                this.bidClosingDate = new Date(this.rfqModel.bidClosingDate);

                this.bidOpeningDate = new Date();
                var diff = this.bidClosingDate.getTime() - this.bidOpeningDate.getTime();

                var days = Math.floor(diff / (60 * 60 * 24 * 1000));
                var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
                var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

                this.days = days;
                this.hours = hours;
                this.minutes = minutes;
                this.seconds = seconds;
                if (seconds == 0) {
                    this.showTimerAndActionButtons = false;
                }
                if (seconds > 0) {
                    this.showTimerAndActionButtons = true;
                }
                this.days = this.days < 10 ? '0' + this.days : this.days;
                this.hours = this.hours < 10 ? '0' + this.hours : this.hours;
                this.minutes = this.minutes < 10 ? '0' + this.minutes : this.minutes;
                this.seconds = this.seconds < 10 ? '0' + this.seconds : this.seconds;

                // //if (document.getElementById('days')) {
                /// document.getElementById('days').innerText = this.days;
                //}
                //if (document.getElementById('hours')) {
                // document.getElementById('hours').innerText = this.hours;
                //}
                //if (document.getElementById('mins')) {
                // document.getElementById('mins').innerText = this.minutes;
                //}
                //if (document.getElementById('seconds')) {
                // document.getElementById('seconds').innerText = this.seconds;
                //}
            }
        }
    }

    ngAfterViewInit() {
        this.dataSource4.paginator = this.paginator;
        this.dataSource4.sort = this.sort;
        this.dataSource6.paginator = this.paginator;
        this.dataSource6.sort = this.sort;
        this.dataSource7.paginator = this.paginator;
        this.dataSource7.sort = this.sort;
        this.dataSource8.paginator = this.paginator;
        this.dataSource8.sort = this.sort;
        this.dataSource9.paginator = this.paginator;
        this.dataSource9.sort = this.sort;
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource4.filter = filterValue.trim().toLowerCase();
        this.dataSource6.filter = filterValue.trim().toLowerCase();
        this.dataSource7.filter = filterValue.trim().toLowerCase();
        this.dataSource8.filter = filterValue.trim().toLowerCase();
        this.dataSource9.filter = filterValue.trim().toLowerCase();
    }

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
        var existingVal = this.detailsSupplierHeaderCFDisplayMap.get(id);
        if (existingVal) {
            this.detailsSupplierHeaderCFDisplayMap.set(id, !existingVal)
        } else {
            this.detailsSupplierHeaderCFDisplayMap.set(id, true)
        }
    }

    getactiveDetailsSupplierHeaderCFTab(id: string): boolean {
        return this.detailsSupplierHeaderCFDisplayMap.get(id) ? this.detailsSupplierHeaderCFDisplayMap.get(id) : false;
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

    // open Copy to Lines Overlay - Helani
    openCopytoLines() {
        const dialogRef = this.dialog.open(CopyToLinesOverlayComponent, { data: { "context": this, "rfqId": this.rfqId, "supplierId": this.supplierId } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // open Shipment Overlay - Helani
    openShipment() {
        const dialogRef = this.dialog.open(AddEditShippingOverlayComponent, { data: { "context": this } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    submitConditionCheck(isLoad) {
        this.issaved = false;
        this.getRFQSupplierHeaderTermsConditionByID(isLoad);
    }

    // open terms1 overlay - Abeeshan 
    openTerms1(isLoad) {
        const dialogRef = this.dialog.open(Terms1Component, { data: { "rfqTermsCondtionModel": this.rfqSupplierHeaderTermsConditionModel, "isLoad": isLoad, "rfqId": this.rfqId, "supplierID": this.supplierID } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.allCOnditionsAccepted = true;
            this.getRFQSupplierHeaderTermsConditionByID(isLoad);
        });
        this.issaved = true;
    }

    // edit Shipment Overlay - Helani
    editShipment(row: any) {
        const dialogRef = this.dialog.open(AddEditShippingOverlayComponent, { data: { "id": row, "context": this } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // delete Shipment Overlay - Helani
    deleteShipment(id: string) {
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
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.message = "Deleted";
                this.rfaqService.deleteRFQSupplierHeaderCountryOrigin(id).subscribe(result => {
                    this.fetchRFQSupplierHeaderInformation();
                    this.show("successerror");
                    setTimeout(() => { this.dismiss("successerror") }, 3000);
                });
            }
        });
    }

    // open PartLine Shipment Overlay - Helani
    openLineShipment() {
        const dialogRef = this.dialog.open(AddEditLineShippingOverlayComponent, { data: { "context": this } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // edit PartLine Shipment Overlay - Helani
    editLineShipment(row: any) {
        const dialogRef = this.dialog.open(AddEditLineShippingOverlayComponent, { data: { "id": row, "context": this } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // delete PartLine Shipment Overlay - Helani
    deleteLineShipment(id: string) {
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
        // Subscribe to afterClosed from the dialog reference
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                this.message = "Deleted";
                this.rfaqService.deleteRFQSupplierPartLineCountryOrigin(id).subscribe(result => {
                    this.fetchRFQSupplierHeaderInformation();
                    this.show("successerror");
                    setTimeout(() => { this.dismiss("successerror") }, 3000);
                });
            }
        });
    }

    fetchRFQCurrency() {
        this.rfqService.GetRFQCurrencyByRFQId(this.rfqId).subscribe((result) => {
            this.rfqCurrencies = result.data;
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

    toggleDisplayHeaderSurveyQuestion(id: string) {
        var existingVal = this.detailsHeaderSurveyQuestionDisplayMap.get(id);

        if (existingVal) {
            this.detailsHeaderSurveyQuestionDisplayMap.set(id, !existingVal)
        } else {
            this.detailsHeaderSurveyQuestionDisplayMap.set(id, true)
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
        this.rfaqService.UpdateSupplierStatus(this.rfqSupplierHeaderInformationModel).subscribe(result => {
        });
    }

    fetchRFQSupplierHeaderInformation() {
        this.rfaqService.getRFQSupplierHeaderInformationById(this.rfqId, this.supplierId).subscribe(result => {
            this.showData = true;
            //debugger;
            this.issaved = true;

            // Supplier Header Information - Helani
            this.rfqSupplierHeaderInformationModel = result.data;

            // Supplier Header Information Attatchment - Helani
            this.rfqSupplierHeaderInformationAttatchmentModel = result.data.rfqSupplierHeaderInformationAttatchments;
            //debugger;
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

            // Supplier Header Attribute - Helani
            this.rfqSupplierHeaderAttributeGroupModel = result.data.rfqSupplierHeaderAttributeGroups;

            // Supplier PartLine Attribute - Helani
            this.rfqSupplierPartLineAttributeGroupModel = result.data.rfqSupplierPartLineAttributeGroups;

            // Supplier Header Country Origin - Helani
            this.rfqSupplierHeaderCountryOriginModel = result.data.rfqSupplierHeaderCountryOrigin;

            // Supplier PartLine Country Origin - Helani
            this.rfqSupplierPartLineCountryOriginModel = result.data.rfqSupplierPartLineCountryOrigin;

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
            this.findsumpaymentPercentage(this.rfqSupplierHeaderPaymentScheduleModel);
            this.findsumpaymentreleaseValue(this.rfqSupplierHeaderPaymentScheduleModel);
            this.findsumWork(this.rfqSupplierHeaderPaymentScheduleModel);
            this.findsumpaymentPercentagePayment(this.rfqSupplierHeaderPaymentScheduleModel);
            this.findsumpaymentreleaseValuereleaseValue(this.rfqSupplierHeaderPaymentScheduleModel);

            // supplier partline total number - Abeeshan
            this.findsumtotalbwork(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalbpayment(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalbreaseValue(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalswork(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalspayment(this.rfqSupplierPartLinePaymentScheduleModel);
            this.findsumtotalsrelasevalue(this.rfqSupplierPartLinePaymentScheduleModel);

            this.etenderingLookupViewModel = result.data.supplierStatusList;

            // supplier Header rfqSupplierHeaderSurveyTemplateQuestionModel - Abeeshan
            this.rfqSupplierHeaderSurveyTemplateQuestionModel = result.data.rfqSupplierHeaderSurveyTemplateQuestionList;
            // Supplier Header Document text - Shohan
            this.rfqSupplierHeaderDocumentTextModel = result.data.rfqSupplierHeaderDocumentTextModelList;
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
        });
    }


    addMoreDeviationDetails(details: any) {
        let objSub = new RFXSupplierPartLineSubstitueModel();
        objSub.rfqId = this.rfqId;
        objSub.supplierID = this.supplierId;
        objSub.rfqSupplierPartLineID = details.id;

        details.rfxSupplierPartLineSubstitueModels.push(objSub);
    }

    deleteDeviationDetails(details: any) {
        this.rfaqService.deleteSupplierPartLineSubstituteById(details.id).subscribe(result => {
            this.fetchRFQSupplierHeaderInformation();
            this.message = "Deleted";
            this.show("successerror");
            setTimeout(() => { this.dismiss("successerror") }, 3000);
        });
    }
    issaved: boolean = false;
    saveAsDraft() {
        this.issaved = false;
        this.rfqSupplierHeaderInformationModel.rfqSupplierHeaderInformationAttatchments = this.rfqSupplierHeaderInformationAttatchmentModel;
        this.rfaqService.saveRFQSupplierHeaderInformation(this.rfqSupplierHeaderInformationModel).subscribe(result => {
            this.fetchRFQSupplierHeaderInformation();
            this.message = "Updated";
            this.show("successerror");
            setTimeout(() => { this.dismiss("successerror") }, 3000);
        });
    }
    submitResponse() {
        this.rfaqService.SentQuoteSubmitted(this.rfqSupplierHeaderInformationModel).subscribe(result => {
            this.fetchRFQSupplierHeaderInformation();
            this.message = "Updated";
            this.show("successerror");
            setTimeout(() => { this.dismiss("successerror") }, 3000);
        });
    }

    // Upload file for Header Information Attatchment - Helani
    uploadFileHeaderInformationAttatchment = (files) => {
        if (files.length === 0) {
            return;
        }
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);
        this.termsService.uploadFile(formData).subscribe(result => {
            if (result["body"] != undefined) {
                this.rfqSupplierHeaderInformationAttatchmentModel[0].etMediaId = result["body"].object[0].id;
                this.rfqSupplierHeaderInformationAttatchmentModel[0].fileName = result["body"].object[0].fileName;
                this.rfqSupplierHeaderInformationAttatchmentModel[0].isInformationDeleteAndDownloadEnabledVisible = true;
                this.reset();
            }
        });
    }

    // DownloadMedia for Header Information Attatchment - Helani
    DownloadHeaderInformationAttatchmentMedia(row) {
        this.DownloadHeaderInformationAttatchmentFile(row.etMediaId, row.fileName, row.fileExtension);
    }

    DownloadHeaderInformationAttatchmentFile(id, fileName, fileExtension) {
        let eTMedia: any = { id: id }

        this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

    // Delete attachment for Header Information Attatchment - Helani
    DeleteHeaderInformationAttatchmentFile(row) {
        row.isInformationDeleteAndDownloadEnabledVisible = false;
        row.etMediaId = "";
        row.fileName = "";
    }

    ngOnInit(): void {
        //this.fetchRFQSupplierHeaderInformation();
        //this.fetchRFQCurrency();
        //this.getRFQById();
        //this.fetchrfaqScoring();
        this.getRFQSupplierHeaderTermsConditionByID(true);
    }

    FetchRFAQDAta() {

        this.fetchRFQSupplierHeaderInformation();
        this.fetchRFQCurrency();
        this.getRFQById();
    }

    dismiss(name: string): void {
        this._fuseAlertService.dismiss(name);
    }

    show(name: string): void {
        this._fuseAlertService.show(name);
    }

    openTerms(): void {
        const dialogRef = this.dialog.open(Terms1Component, {
            width: '100%',
            height: 'auto',
            data: {
                parent: 'rfaq'
            }
        });
    }

    isDeleteandDownloadEnabledVisible = false;
    currentRow: any;

    public unreadCount: any = 0;
    getNotificationCount() {
        this._ngZone.run(() => {
            this.chatService.getRFQCount(this.rfqId).subscribe(result => {
                this.unreadCount = result.data;
            });
        });
    }

    //upload file for header attachment - Rahal
    uploadFile = (files) => {
        if (files.length === 0) {
            return;
        }
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe(result => {

            if (result["body"] != undefined) {
                this.currentRow.etMediaId = result["body"].object[0].id;
                this.currentRow.fileName = result["body"].object[0].fileName;
                this.currentRow.isDeleteandDownloadEnabledVisible = true;
                this.reset();
            }
        });
    }

    //upload file for lines attachment - Rahal
    uploadFilePartLine = (files) => {
        if (files.length === 0) {
            return;
        }
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe(result => {

            if (result["body"] != undefined) {
                this.currentRow.attachmentId = result["body"].object[0].id;
                this.currentRow.fileName = result["body"].object[0].fileName;
                this.currentRow.isDeleteandDownloadEnabledVisible = true;
                this.reset();
            }
        });
    }

    //upload file for Lines information - Shohan
    uploadLinesInformationFile = (files, row: any) => {
        if (files.length === 0) {
            return;
        }
        let fileToUpload = <File>files[0];
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name);

        this.termsService.uploadFile(formData).subscribe(result => {

            if (result["body"] != undefined) {
                row.attachmentId = result["body"].object[0].id;
                row.fileName = result["body"].object[0].fileName;
                row.isDeleteandDownloadEnabledVisible = true;
                this.reset();
            }
        });
    }

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

    //DownloadFile for header attachment - Rahal
    DownloadFile(id, fileName, fileExtension) {
        let eTMedia: any = { id: id }
        this.termsService.DownloadMedia(eTMedia).subscribe(blob => {

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
        let eTMedia: any = { id: id }
        this.termsService.DownloadMedia(eTMedia).subscribe(blob => {

            saveAs(blob, fileName, {
                type: fileExtension // --> or whatever you need here
            });
        });
    }

    //delete attachment for header attachment - Rahal
    DeleteFile(row) {
        row.isDeleteandDownloadEnabledVisible = false;
        row.etMediaId = "";
        row.fileName = "";
    }

    //delete attachment for lines attachment - Rahal
    DeleteFileParLine(row) {
        row.isDeleteandDownloadEnabledVisible = false;
        row.attachmentId = "";
        row.fileName = "";
    }

    //delete lines information - Shohan
    DeleteLinesInformationFile(row) {
        row.isDeleteandDownloadEnabledVisible = false;
        row.etMediaId = "";
        row.fileName = "";
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
            this.total5 += this.value[j].releasevalue
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

function createNewRow4(id: number): RowData4 {

    return {
        payno: PAYNO[Math.round(Math.random() * (PAYNO.length - 1))],
        description2: DESCRIPTION2[Math.round(Math.random() * (DESCRIPTION2.length - 1))],
        work: WORK[Math.round(Math.random() * (WORK.length - 1))],
        milestone: MILESTONE[Math.round(Math.random() * (MILESTONE.length - 1))],
        payment: PAYMENT[Math.round(Math.random() * (PAYMENT.length - 1))],
        retention: RETENTION[Math.round(Math.random() * (RETENTION.length - 1))],
        release: RELEASE[Math.round(Math.random() * (RELEASE.length - 1))],
        releasevalue: RELEASEVALUE[Math.round(Math.random() * (RELEASEVALUE.length - 1))],
    };
}

function createNewRow6(id: number): RowData6 {

    return {
        srno: SRNO[Math.round(Math.random() * (SRNO.length - 1))],
        title: TITLE[Math.round(Math.random() * (TITLE.length - 1))],
        filename: FILENAME[Math.round(Math.random() * (FILENAME.length - 1))],
        documentclass: DOCUMENTCLASS[Math.round(Math.random() * (DOCUMENTCLASS.length - 1))],
        reference: REFERENCE[Math.round(Math.random() * (REFERENCE.length - 1))],
        atttype: ATTTYPE[Math.round(Math.random() * (ATTTYPE.length - 1))],
    };
}

function createNewRow7(id: number): RowData7 {

    return {
        docsrno: DOCSRNO[Math.round(Math.random() * (DOCSRNO.length - 1))],
        outputtype: OUTPUTTYPE[Math.round(Math.random() * (OUTPUTTYPE.length - 1))],
        documentext: DOCUMENTTEXT[Math.round(Math.random() * (DOCUMENTTEXT.length - 1))],
    };
}

function createNewRow8(id: number): RowData8 {

    return {
        notesrno: NOTESRNO[Math.round(Math.random() * (NOTESRNO.length - 1))],
        notes: NOTES[Math.round(Math.random() * (NOTES.length - 1))],
    };
}

function createNewRow9(id: number): RowData9 {

    return {
        milestonenumber: MILESTONENUMBER[Math.round(Math.random() * (MILESTONENUMBER.length - 1))],
        milestonename: MILESTONENAME[Math.round(Math.random() * (MILESTONENAME.length - 1))],
        deliverabledescription: DELIVERABLEDESCRIPTION[Math.round(Math.random() * (DELIVERABLEDESCRIPTION.length - 1))],
        prevmilestonenumber: PREVMILESTONENUMBER[Math.round(Math.random() * (PREVMILESTONENUMBER.length - 1))],
        progresspercentage: PROGRESSPERCENTAGE[Math.round(Math.random() * (PROGRESSPERCENTAGE.length - 1))],
        stagepercentage: STAGEPERCENTAGE[Math.round(Math.random() * (STAGEPERCENTAGE.length - 1))],
        begindate: BEGINDATE[Math.round(Math.random() * (BEGINDATE.length - 1))],
    };
}

function createNewRow17(): RowData17 {

    return {
        costfactName: COSTFACTNAME[Math.round(Math.random() * (COSTFACTNAME.length - 1))],
        costfactType: COSTFACTTYPE[Math.round(Math.random() * (COSTFACTTYPE.length - 1))],
        costfactDesc: COSTFACTDESC[Math.round(Math.random() * (COSTFACTDESC.length - 1))],
        costfactExpectedValue: COSTFACTEXPECTEDVALUE[Math.round(Math.random() * (COSTFACTEXPECTEDVALUE.length - 1))],
        costfactValue: COSTFACTVALUE[Math.round(Math.random() * (COSTFACTVALUE.length - 1))],
        costfactComments: COSTFACCOMMENTS[Math.round(Math.random() * (COSTFACCOMMENTS.length - 1))],
    };
}
function saveAs(blob: Blob, fileName: any, arg2: {
    type: any; // --> or whatever you need here
}) {
    throw new Error('Function not implemented.');
}

