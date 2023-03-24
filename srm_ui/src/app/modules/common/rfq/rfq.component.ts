/* eslint-disable max-len */
import { Component, ViewChild, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddCurrencyOverlayComponent } from './add-currency-overlay/add-currency-overlay.component';
import { AddEditShippingOverlayComponent } from './add-edit-shipping-overlay/add-edit-shipping-overlay.component';
import { CopyToLinesOverlayComponent } from './copy-to-lines-overlay/copy-to-lines-overlay.component';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexLegend, ApexStroke, ApexXAxis, ApexFill, ApexTooltip, ApexGrid, ApexStates, } from 'ng-apexcharts';
import { AwardSelectedOverlayComponent } from './award-selected-overlay/award-selected-overlay.component';
import { AwardRecommendOverlayComponent } from './award-recommend-overlay/award-recommend-overlay.component';
import { AddNewAttributeListOverlayComponent } from 'app/modules/common/rfq/add-new-attributelist-overlay/add-new-attribute-list-overlay.component';
import { AddReusableAttributeOverlayComponent } from 'app/modules/common/rfq/add-reusable-attribute-overlay/add-reusable-attribute-overlay.component';
import { AddAttributeItemOverlayComponent } from 'app/modules/common/rfq/add-attribute-item-overlay/add-attribute-item-overlay.component';
import { AddNewAttributeOverlayComponent } from 'app/modules/common/rfq/add-new-attribute-overlay/add-new-attribute-overlay.component';
import { AddReusableCostfactorOverlayComponent } from 'app/modules/common/rfq/add-reusable-costfactor-overlay/add-reusable-costfactor-overlay.component';
import { AddNewCostfactorlistOverlayComponent } from 'app/modules/common/rfq/add-new-costfactorlist-overlay/add-new-costfactorlist-overlay.component';
import { AddNewCostfactorOverlayComponent } from 'app/modules/common/rfq/add-new-costfactor-overlay/add-new-costfactor-overlay.component';
import { AddCostfactorItemOverlayComponent } from 'app/modules/common/rfq/add-costfactor-item-overlay/add-costfactor-item-overlay.component';
import { AddNewPaymentschedulesOverlayComponent } from 'app/modules/common/rfq/add-new-paymentschedules-overlay/add-new-paymentschedules-overlay.component';
import { AddTermsOverlayComponent } from 'app/modules/common/rfq/add-terms-overlay/add-terms-overlay.component';
import { AddNewAttachmentOverlayComponent } from 'app/modules/common/rfq/add-new-attachment-overlay/add-new-attachment-overlay.component';
import { AddNewLineAttachmentOverlayComponent } from 'app/modules/common/rfq/add-new-line-attachment-overlay/add-new-line-attachment-overlay.component';
import { AddNewDocumenttextOverlayComponent } from 'app/modules/common/rfq/add-new-documenttext-overlay/add-new-documenttext-overlay.component';
import { AddNewNoteOverlayComponent } from 'app/modules/common/rfq/add-new-note-overlay/add-new-note-overlay.component';
import { AddNewDeliverableOverlayComponent } from 'app/modules/common/rfq/add-new-deliverable-overlay/add-new-deliverable-overlay.component';
import { AddSurveyOverlayComponent } from 'app/modules/common/rfq/add-survey-overlay/add-survey-overlay.component';
import { AddSurveyQuestionOverlayComponent } from 'app/modules/common/rfq/add-survey-question-overlay/add-survey-question-overlay.component';
import { CreateSurveyQuestionOverlayComponent } from 'app/modules/common/rfq/create-survey-question-overlay/create-survey-question-overlay.component';
import { AddSupplierOverlayComponent } from 'app/modules/common/rfq/add-supplier-overlay/add-supplier-overlay.component';
import { AddTeamOverlayComponent } from 'app/modules/common/rfq/add-team-overlay/add-team-overlay.component';
import { AddNewPartLineNoteOverlayComponent } from './add-new-part-line-note-overlay/add-new-part-line-note-overlay.component';
import { ActivatedRoute, NoPreloading, Router } from '@angular/router';
import { AddCsvOverlayComponent } from './add-csv-overlay/add-csv-overlay.component';
import { RulesService } from 'app/shared/Services/etendering/RFQ/rules.service';
import { RFQApprovalViewModel } from 'app/main/Models/etendering/ViewModels/rfq-approval-model';
import { RFQCurrencyViewModel } from 'app/main/Models/etendering/ViewModels/rfq-currency-view-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RFXHistoryViewModel } from 'app/main/Models/etendering/ViewModels/rfx-history-view-model';
import * as signalR from '@microsoft/signalr';
import { environment } from 'environments/environment';
import { ApprovalConfirmationOverlayComponent } from './approval-confirmation-overlay/approval-confirmation-overlay.component';
import { RejectionConfirmationOverlayComponent } from './rejection-confirmation-overlay/rejection-confirmation-overlay.component';
import { ChatService } from 'app/shared/Services/etendering/Chats/chat.service';
import { AgreementInfoDialogComponent } from 'app/modules/common/rfq/agreement-info-dialog/agreement-info-dialog.component';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Workbook, Worksheet } from 'exceljs';
import * as fs from 'file-saver';
import { RfxTemplatesOverlayComponent } from '../rfx-templates-overlay/rfx-templates-overlay.component';
import { ChatsComponent } from '../../common/chats/chats.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';

import { InviteSupplier } from '../../Dto/InviteSupplier';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DeleteDraftSupplier } from 'app/modules/Dto/DeleteDraftSupplier';

import { AmendBidCloseOverlayComponent } from './amend-bidclose-overlay/amend-bidclose-overlay.component';
declare module '@angular/forms/forms' {
    interface FormGroup {
        validate(): void;
    }
}

FormGroup.prototype.validate = function (this: FormGroup): void {
    for (const key in this.controls) {
        const formElement = this.get(key);
        if (formElement instanceof FormControl) {
            formElement.updateValueAndValidity();
        } else if (formElement instanceof FormGroup) {
            formElement.validate();
        }
    }
};
export class ItemChangeModel {
    frm: FormGroup; model: any
}

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
    colors: string[];
    states: ApexStates;
};
export type ChartOptions2 = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    grid: ApexGrid;
    colors: string[];
    states: ApexStates;
};

export interface RowData {
    stepNumber: string;
    id: string;
    name: string;
    address: string;
    status: string;
    template: string;
    justification: string;

}
export interface RowData2 {
    pefno: string;
    revno: string;
    type: string;
    // name2: string;
    by: string;
    action: string;
    status2: string;
    timestamp: string;
    // justification: string;
}

export interface RowData22 {
    supId: string;
    supName: string;
    supEmail: string;
    supResponse: string;
    supTechEval: string;
    supComEval: string;
    supRank: string;
    supContact: string;
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

export interface RowData432 {
    tbepayno: string;
    tbedescription2: string;
    tbework: string;
    tbemilestone: string;
    tbepayment: string;
    tberetention: string;
    tberelease: string;
    tbereleasevalue: string;
    tbecomments432: string;
    tbeweight432: string;
}

export interface RowData5 {
    no: string;
    termsname: string;
    inputtype: string;
    preview: string;
    editable: string;
    beforequote: string;
    endquote: string;
}

export interface RowData6 {
    srno: string;
    title: string;
    filename: string;
    documentclass: string;
    reference: string;
    atttype: string;
}

export interface RowData622 {
    srno622: string;
    title622: string;
    filename622: string;
    comment622: string;
    atttype622: string;
    tbeweight622: string;
}

export interface RowData7 {
    docsrno: string;
    outputtype: string;
    documentext: string;
}

export interface RowData722 {
    docsrno722: string;
    outputtype722: string;
    documentext722: string;
    documentext2722: string;
    tbeweight722: string;
    comment722: string;
}

export interface RowData8 {
    notesrno: string;
    notes: string;
}

export interface RowData822 {
    notes2822: string;
    notes822: string;
    comment822: string;
    tbeweight822: string;
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

export interface RowData932 {
    milestonenumber932: string;
    milestonename932: string;
    deliverabledescription932: string;
    prevmilestonenumber932: string;
    progresspercentage932: string;
    stagepercentage932: string;
    begindate932: string;
    tbeweight932: string;
    comment932: string;
}

export interface RowData10 {
    templatename: string;
    questionname: string;
    surveydescription: string;
    questiondetails: string;
}

export interface RowData11 {
    linesprno: string;
    lineno: string;
    partid: string;
    partdescription: string;
    uom: string;
    needbydate: string;
    startprice: string;
    targetprice: string;
}

export interface RowData12 {
    supplierId: string;
    supplierName: string;
    invitedDateTime: string;
    supplierEmail: string;
    currencies: string;
    acknowledged: string;
    supplierStatus: string;
    responses: string;
}

export interface RowData13 {
    teamUserName: string;
    rfxRole: string;
    substituteName: string;
    accessLevel: string;
    pageAccess: string;
    teamName: string;
    teamDescription: string;
}
export interface RowData14 {
    headerRules: string;
}
export interface RowData15 {
    group: string;
}
export interface RowData16 {
    resRules: string;
}
export interface RowData17 {
    costfactName: string;
    costfactType: string;
    costfactDesc: string;
    costfactExpectedValue: string;
    costfactValue: string;
    costfactComments: string;
}
export interface RowData172 {
    tbecostfactName: string;
    tbecostfactType: string;
    tbecostfactDesc: string;
    tbecostfactExpectedValue: string;
    tbecostfactValue: string;
    tbecostfactComments: string;
    tbeweight2: string;
}
export interface RowData182 {
    tbecostfactName: string;
    tbecostfactType: string;
    tbecostfactDesc: string;
    tbecostfactValue: string;
    tbecostfactComments: string;
    tbeweight2: string;
}
export interface RowData19 {
    attributeItem: string;
    description: string;
    expectedValue: string;
    value: string;
    assocCosts: string;
    cost: string;
    comments: string;
}
export interface RowData20 {
    tbeattributeItem: string;
    tbedescription: string;
    tbeexpectedValue: string;
    tbevalue: string;
    tbeassocCosts: string;
    tbecost: string;
    tbecomments: string;
    tbecomments2: string;
    tbeweight: string;
}

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
const NUMBER: string[] = [
    '10', '20', '30'
];
const ID: string[] = [
    'User 01', 'User 02',
];
const NAME: string[] = [
    'Manager 01', 'Manager 02',
];
const ADDRESS: string[] = [
    'manager1@gmail.com', 'manager2@gmail.com',
];
const STATUS: string[] = [
    'Approved', 'Pending Approval',
];
const TEMPLATE: string[] = [
    'R1', 'R2', 'R3'
];
const JUSTIFICATION: string[] = [
    ''
];

/** Constants used to fill up our data base. */
const SUPID: string[] = [
    '10101', '10102', '10103'
];
const SUPNAME: string[] = [
    'Sup A', 'Sup B',
];
const SUPRESPONSE: string[] = [
    '01', '02',
];
const SUPEMAIL: string[] = [
    'manager1@gmail.com', 'manager2@gmail.com',
];
const SUPTECHEVAL: string[] = [
    'Accepted with reservations', 'Accepted',
];
const SUPCOMEVAL: string[] = [
    'Accepted'
];
const SUPRANK: string[] = [
    '2', '1', '4'
];
const SUPCONTACT: string[] = [
    'Contact A', 'Contact B', 'Contact C'
];


const PEFNO: string[] = [
    '10101', '10102', '10104'
];
const REVNO: string[] = [
    '01', '02', '03'
];
const TYPE: string[] = [
    'RFQ'
];
// const NAME2: string[] = [
//     'ABCD ', 'ABCA', 'ABCO'
// ];
const BY: string[] = [
    'Buyer 01', 'Buyer 02', 'Buyer 03'
];
const ACTION: string[] = [
    'New Round RFQ', 'RFQ Published'
];
const STATUS2: string[] = [
    'Planned'
];
const TIMESTAMP: string[] = [
    '01-07-2021  3:499:40 PM', '01-07-2021  3:499:40 PM'
];
// const JUSTIFICATION: string[] = [
//     '10', '20', '30'
// ];

/** Constants used to fill up our data base. */
const TERMSNAME: string[] = [
    'Gegeral RFQ', 'Legal Terms'
];
const INPUTTYPE: string[] = [
    'Wordpad', 'Attachment'
];
const PREVIEW: string[] = [
    ' XXXXXXXXXXX XXXXXXXXX'
];
const EDITABLE: string[] = [
    'No', 'Yes'
];
const BEFOREQUOTE: string[] = [
    'Mandatory', 'Optional'
];
const ENDQUOTE: string[] = [
    'Mandatory', 'Optional'
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
const TEMPLATENAME: string[] = [
    '01', '02'
];
const QUESTIONNAME: string[] = [
    'Clarification Response Time', 'Payment'
];
const SURVEYDESCRIPTION: string[] = [
    'Rate our response time for clarifications', 'Payment were made on the due date without delays?'
];
const QUESTIONDETAILS: string[] = [
    'Public', 'Public'
];


/** Constants used to fill up our data base. */
const LINESPRNO: string[] = [
    '10101', '10101'
];
const LINENO: string[] = [
    '01', '02'
];
const PARTID: string[] = [
    '1121247', '3221247'
];
const PARTDESCRIPTION: string[] = [
    'Ball Bearings - SKF 6206'
];
const UOM: string[] = [
    '75', '50'
];
const NEEDBYDATE: string[] = [
    '19/12/2021', '24/12/2021'
];
const STARTPRICE: string[] = [
    '$75', '$35'
];
const TARGETPRICE: string[] = [
    '$55', '$25'
];


/** Constants used to fill up our data base. */
const SUPPLIERID: string[] = [
    '10101', '10101'
];
const SUPPLIERNAME: string[] = [
    'Sup A', 'Sup B'
];
const INVITEDDATETIME: string[] = [
    '01-02-2021  02:00:13 PM', '21-02-2021  02:00:13 PM'
];
const SUPPLIEREMAIL: string[] = [
    'A@gmail.com', 'B@gmail.com'
];
const CURRENCIES: string[] = [
    'Dirham', 'USD'
];
const ACKNOWLEDGED: string[] = [
    'Yes', 'No'
];
const SUPPLIERSTATUS: string[] = [
    'Intend to participate', 'Not Interested to participate', 'Response Submitted', 'Yet to acknowledge'
];
const RESPONSES: string[] = [
    '$55', '$25'
];

/** Constants used to fill up our data base. */
const TEAMUSERNAME: string[] = [
    'Danny Boyle', 'Richard Barn'
];
const RFXROLE: string[] = [
    'Buyer', 'Technical Bid Evaluator', 'Commercial Bid Evaluator'
];
const SUBSTITUTENAME: string[] = [
    'Chris Torris', 'M Nauman'
];
const ACCESSLEVEL: string[] = [
    'Full', 'Edit Tabs'
];
const PAGEACCESS: string[] = [
    'Full RFQ', 'RFQ - Evaluations'
];
const TEAMNAME: string[] = [
    '10101', '10101'
];
const TEAMDESCRIPTION: string[] = [
    'Quality Team 01', 'Quality Team 02'
];

/** Constants used to fill up our data base. */
const HEADERRULES: string[] = [
    'Attribute Items', 'Cost Factors', 'Payment Schedules'
];

/** Constants used to fill up our data base. */
const GROUP: string[] = [
    'Attribute Items', 'Cost Factors', 'Payment Schedules'
];

/** Constants used to fill up our data base. */
const RESRULES: string[] = [
    'Allow suppliers to select lines on which to respond', 'Display best price to suppliers', 'Allow multiple response'
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
const TBEATTRIBUTEITEM: string[] = [
    'Minimum Order', 'Packaging'
];
const TBERESDESCRIPTION: string[] = [
    'Min order quantity', 'When can you ship?'
];
const TBEEXPECTEDVALUE: string[] = [
    '100', 'Purposes/Overlays/Structures'
];
const TBERESVALUE: string[] = [
    'Number', 'Text'
];
const TBEASSOCCOSTS: string[] = [
    'Yes', 'No'
];
const TBECOST: string[] = [
    '236.00 USD', '456.00 USD'
];
const TBECOMMENT: string[] = [
    'comment description'
];
const TBEWEIGHT: string[] = [
    '05', '02'
];

@Component({
    selector: 'attribute-items',
    templateUrl: './rfq.component.html',
    styleUrls: ['./rfq.component.scss'],
    encapsulation: ViewEncapsulation.None,
    styles: [
        /* language=SCSS */
        `
            .suevay-grid{
                grid-template-columns: 40px 35% 40% 96px;
            }
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

                @screen md {
                    grid-template-columns: 10% 10% auto 96px;
                }
            }
            .attribute-items-inner-grid {
                grid-template-columns: 40px 10% 12% 15% 12% 10% 10% 10%;

                @screen md {
                    grid-template-columns: 40px 10% 12% 15% 12% 10% 10% 10%;
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
                grid-template-columns: 40px 10% 12% 12% 12% 12% 10% 10% 14%;

                @screen md {
                    grid-template-columns: 40px 10% 12% 12% 12% 12% 10% 10% 14%;
                }
            }
            .survey-parent-grid {
                grid-template-columns: 40px 30% auto 96px;

                @screen md {
                    grid-template-columns: 40px 30% auto 96px;
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
                grid-template-columns: 400px 300px 180px 180px 120px;
                min-width: 900px;

                @screen md {
                    grid-template-columns: 400px 300px 180px 180px 120px;
                }
            }
            .line-items-parent-grid {
                grid-template-columns: 40px 60px 60px 60px 100px 100px 180px 60px 100px 100px 96px 80px 40px 40px;

                @screen md {
                    grid-template-columns: 40px 60px 60px 60px 100px 100px 180px 60px 100px 100px 96px 80px 40px 80px 40px;
                }
            }
            .noneditable-line-items-parent-grid {
                grid-template-columns: 60px 60px 90px auto 80px 80px 110px 80px 100px 100px 96px;

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
                grid-template-columns: 300px 160px 180px 80px 80px 80px;
                border-top: 1px solid #eeeeee !important;
                border-bottom: 1px solid #eeeeee !important;

                @screen md {
                    grid-template-columns: 300px 160px 180px 80px 80px 80px;
                    border-top: 1px solid #eeeeee !important;
                    border-bottom: 1px solid #eeeeee !important;
                }
            }
            .shipment-grid {
                grid-template-columns: 40px 100px 100px 100px 180px 150px 150px 150px;

                @screen md {
                    grid-template-columns: 40px 100px 100px 100px 180px 150px 150px 150px;
                }
            }
            .noneditable-shipment-grid {
                grid-template-columns: 180px 150px 150px 280px;
                border-top: 1px solid #eeeeee !important;
                border-bottom: 1px solid #eeeeee !important;

                @screen md {
                    grid-template-columns: 180px 150px 150px 280px;
                    border-top: 1px solid #eeeeee !important;
                    border-bottom: 1px solid #eeeeee !important;
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

export class RfqComponent implements OnDestroy {
    @ViewChild(ChatsComponent) chatComponentRef;

    displayedColumn: string[] = ['stepNumber', 'id', 'name', 'address', 'status', 'template', 'justification'];
    displayedColumn2: string[] = ['pefno', 'revno', 'by', 'action', 'status2', 'timestamp'];
    displayedColumn22: string[] = ['supId', 'supName', 'supContact', 'supEmail', 'supResponse', 'supTechEval', 'supComEval', 'supRank'];
    displayedColumn4: string[] = ['id', 'payno', 'description2', 'type2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'visibility'];
    displayedColumn42: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
    displayedColumn43: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
    displayedColumn432: string[] = ['tbepayno', 'tbedescription2', 'tbework', 'tbemilestone', 'tbepayment', 'tberetention', 'tberelease', 'tbereleasevalue', 'tbecomments432', 'tbeweight432', 'tbescore', 'tbeevaluation', 'tbecomments2432'];
    displayedColumn5: string[] = ['id', 'termsname', 'inputtype', 'default', 'beforequote', 'endquote'];
    displayedColumn55: string[] = ['termsname', 'beforequote', 'endquote', 'isaccepted', 'comment'];
    displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
    displayedColumn62: string[] = ['srno', 'title', 'filename', 'attachment', 'reference', 'attachment2', 'comment'];
    displayedColumn622: string[] = ['srno622', 'title622', 'filename622', 'attachment622', 'atttype622', 'attachment2622', 'comment622', 'tbeweight622', 'tbescore622', 'tbeevaluation622', 'tbecomments622'];
    displayedColumn7: string[] = ['id', 'docsrno', 'outputtype', 'documentext', 'type3', 'visibility3'];
    displayedColumn72: string[] = ['dtno', 'outputtype', 'documentext', 'documentext2', 'comment'];
    displayedColumn722: string[] = ['documentext722', 'documentext2722', 'comment722', 'tbeweight722', 'tbescore722', 'tbeevaluation722', 'tbecomments722'];
    displayedColumn8: string[] = ['id', 'notesrno', 'notes', 'type4', 'visibility4'];
    displayedColumn82: string[] = ['notesrno', 'notes', 'notes2', 'comment'];
    displayedColumn822: string[] = ['notes822', 'notes2822', 'comment822', 'tbeweight822', 'tbescore822', 'tbeevaluation822', 'tbecomments822'];
    displayedColumn9: string[] = ['id', 'milestonenumber', 'milestonename', 'deliverabledescription', 'type5', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'visibility5'];
    displayedColumn92: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate'];
    displayedColumn93: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'comment'];
    displayedColumn932: string[] = ['milestonenumber932', 'milestonename932', 'deliverabledescription932', 'prevmilestonenumber932', 'progresspercentage932', 'stagepercentage932', 'begindate932', 'comment932', 'tbeweight932', 'tbescore932', 'tbeevaluation932', 'tbecomments932'];
    displayedColumn11: string[] = ['id', 'linesprno', 'lineno', 'partid', 'partdescription', 'uom', 'needbydate', 'startprice', 'targetprice', 'showprices'];
    displayedColumn12: string[] = ['id', 'supplierId', 'supplierName', 'invitedDateTime', 'supplierContact', 'supplierEmail', 'currencies', 'supplierStatus', 'groupName', 'acknowledged', 'responses'];
    displayedColumn13: string[] = ['id', 'teamUserName', 'rfxRole', 'substituteName', 'accessLevel', 'pageAccess', 'teamName', 'teamDescription'];
    displayedColumn14: string[] = ['id', 'headerRules', 'headerTechnical', 'headerCommercial'];
    displayedColumn15: string[] = ['id', 'group', 'headerTechnical2', 'headerCommercial2'];
    displayedColumn16: string[] = ['id', 'resRules', 'selection'];
    displayedColumn17: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'supplierType', 'costfactExpectedValue', 'costfactValue', 'costfactComments'];
    displayedColumn172: string[] = ['tbecostfactName', 'tbecostfactType', 'tbecostfactDesc', 'tbecostfactExpectedValue', 'tbecostfactValue', 'tbecostfactComments', 'tbeweight2', 'tbescore', 'tbeevaluation', 'tbecomments2'];
    displayedColumn18: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'costfactValue', 'costfactComments'];
    displayedColumn182: string[] = ['tbecostfactName', 'tbecostfactType', 'tbecostfactDesc', 'tbecostfactValue', 'tbecostfactComments', 'tbeweight2', 'tbescore', 'tbeevaluation', 'tbecomments2'];
    displayedColumn19: string[] = ['attributeItem', 'description', 'required', 'expectedValue', 'datatype', 'value', 'assocCosts', 'cost', 'comments'];

    dataSource: MatTableDataSource<RowData>;
    dataSource2: MatTableDataSource<RowData2>;
    dataSource22: MatTableDataSource<RowData22>;
    dataSource4: MatTableDataSource<RowData4>;
    dataSource432: MatTableDataSource<RowData432>;
    dataSource5: MatTableDataSource<RowData5>;
    dataSource6: MatTableDataSource<RowData6>;
    dataSource622: MatTableDataSource<RowData622>;
    dataSource7: MatTableDataSource<RowData7>;
    dataSource722: MatTableDataSource<RowData722>;
    dataSource8: MatTableDataSource<RowData8>;
    dataSource822: MatTableDataSource<RowData822>;
    dataSource9: MatTableDataSource<RowData9>;
    dataSource932: MatTableDataSource<RowData932>;
    dataSource10: MatTableDataSource<RowData10>;
    dataSource11: MatTableDataSource<RowData11>;
    dataSource12: MatTableDataSource<RowData12>;
    dataSource13: MatTableDataSource<RowData13>;
    dataSource14: MatTableDataSource<RowData14>;
    dataSource15: MatTableDataSource<RowData15>;
    dataSource16: MatTableDataSource<RowData16>;
    dataSource17: MatTableDataSource<RowData17>;
    dataSource172: MatTableDataSource<RowData172>;
    dataSource182: MatTableDataSource<RowData182>;
    dataSource19: MatTableDataSource<RowData19>;
    dataSource20: MatTableDataSource<RowData20>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    destroy$ = new Subject();
    processOnApprovel!: boolean;
    processOnReview!: boolean;
    processOnApprove!: boolean;
    processOnReject!: boolean;
    isClickedPublish: boolean = false;
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
    importfilerfqid: number;
    panelOpenState = false;
    public chartOptions: Partial<ChartOptions>;
    public chartOptions2: Partial<ChartOptions2>;
    frmScoring: FormGroup;
    partLineModel: any = {};
    message: string = "";
    rfqApprovalViewModel: RFQApprovalViewModel[] = [];
    rfxHistoryViewModel: any[] = [];
    /**
     * Constructor
     */
    rfqModel: RFQViewModel = new RFQViewModel();
    timerStatuses = ['Planned Draft', 'Review', 'Revise', 'Send for Approval', 'Approval InProgress', 'Approved', 'Rejected', 'Publish/Bid Live'];
    showTimer: boolean = false;
    isSaveAsDraft: boolean = false;
    rfqId: any;
    lblRFXHeader = "";
    lblRFXNo = "";
    tempRFQModel: RFQViewModel = new RFQViewModel();
    frmRFQInformationForm: FormGroup;
    rfqModelPublish: RFQViewModel = new RFQViewModel();
    bidClosingDate: any;
    bidOpeningDate: any;
    rdbpreviewDate: string;
    rdbawardDate: string;
    supplierIsChangedInResponses = true;
    supplierIdInResponses: any;
    constructor(private activatedRoute: ActivatedRoute, private _changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog, private router: Router,private route: ActivatedRoute,
        private fb: FormBuilder, private rfqService: RfqService,private http:HttpClient,
        private rulesService: RulesService, private chatService: ChatService) {

        this.rfqModel.currencyID = "";

        this.frmRFQInformationForm = this.fb.group({
            'estimatedAmount': [null],
            'eventOnAwardDate': [null],
            'awardDate': [null],
            'buyerName': [null],
            'revNo': [null],
            'rfqNo': [null],
            'rfqName': [null],
            'rfqDescription': [null],
            'rfxType': [null],
            'negitiationStyleID': [null],
            'biddingStyleID': [null],
            'outcomeID': [null],
            'currencyID': [null],
            'paymentTermID': [null],
            'ifsProjectID': [null],
            'subProjectID': [null],
            'ifsProgramId': [null],
            'timeZoneId': [null],
            'shipViaCodeID': [null],
            'countryID': [null],
            'cityID': [null],
            'ifsSiteId': [null],
            'deliveryTermsID': [null],
            //'outcome': [null],
            'projectType': [null],
            'activity': [null],
            'bidOpeningDate': [null],
            'bidClosingDate': [null],
            'publishDate': [null],
            'awardedOn': [null],
            'previewDate': [null],
            'previewCount': [null],
            'previewId': [null],
            'awardCount': [null],
            'awardId': [null],
            'afterROACompletedId': [null],
            'roaCount': [null],
            'deliveryAddressID': [null],
            'isDisplayRank': [null],
            'isTwoStageRFx': [null],
            'isAlternateCurrencyApplicable': [null],
            'documentClass': [null]
        });

        if (this.router) {
            if (this.router.getCurrentNavigation()) {
                if (this.router.getCurrentNavigation().extras) {
                    if (this.router.getCurrentNavigation().extras.state) {
                        if (this.router.getCurrentNavigation().extras.state.Id) {
                            this.rfqId = this.router.getCurrentNavigation().extras.state.Id;

                        }
                        if (this.router.getCurrentNavigation().extras.state.name) {
                            this.tempRFQModel.rfqName = this.router.getCurrentNavigation().extras.state.name;

                        }
                        if (this.router.getCurrentNavigation().extras.state.description) {
                            this.tempRFQModel.rfqDescription = this.router.getCurrentNavigation().extras.state.description;

                        }
                        if (this.router.getCurrentNavigation().extras.state.type) {
                            this.tempRFQModel.rfxType = this.router.getCurrentNavigation().extras.state.type;

                        }
                        if (this.router.getCurrentNavigation().extras.state.negotiation) {
                            this.tempRFQModel.negitiationStyleID = this.router.getCurrentNavigation().extras.state.negotiation;

                        }
                        if (this.router.getCurrentNavigation().extras.state.biding) {
                            this.tempRFQModel.biddingStyleID = this.router.getCurrentNavigation().extras.state.biding;

                        }
                        if (this.router.getCurrentNavigation().extras.state.currency) {
                            this.tempRFQModel.defaultCurrencyID= this.router.getCurrentNavigation().extras.state.currency;

                        }
                    }
                }
            }
        }

        activatedRoute.params.subscribe((params) => {
            this.rfqId = params['id'];
        });



    }
    
    dataId: any = "";
    biddingStyleLists: any[];
    negotiationStyleLists: any[];
    negotiationStyles: any[];
    outcomeLists: any[];
    rfqCurrencies: any = [];

    Message: string = "";
    unreadCount = 0;
    showScoring: boolean = false;

    selectedTabIndex: any = 0;
    selectedEvaluationIndex: any = 0;
    selectedTabIndexHeader: any = 0;


    ngOnInit() {
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.router.navigateByUrl('/rfq' + "/F00445AC-0FD2-4671-6BF7-08DAAB7AB1C9", { state: { Id: 'F00445AC-0FD2-4671-6BF7-08DAAB7AB1C9' } });
        this.selectedTab = "RFQ Information";
        this.chatService.getRFQCount(this.rfqId).subscribe(result => {
            this.unreadCount = result.data;
        });
        const connection = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.Information)
            .withUrl(environment.apiUrl + 'notify')
            .build();

        connection.start().then(function () {
        }).catch(function (err) {
            return console.error(err.toString());
        });

        connection.on("BroadcastMessage", () => {
            this.getRFQChatMessages();
        });
        this.fetchRFXHistoryData();

        this.getRFQById(this.rfqId ? this.rfqId : '00000000-0000-0000-0000-000000000000');
        this.getApproveRejectWidgetData();
        // this.rfqModel.isApproveReject = true;

        this.frmRFQInformationForm.get('publishDate').valueChanges.subscribe(value => {
            if (this.isAfter(value, this.frmRFQInformationForm.get('previewDate').value)) {
                this.frmRFQInformationForm.get('publishDate').setErrors({ invalidDate2: true });
                // this.frmRFQInformationForm.get('previewDate').setErrors({ invalidDate1: true });
            }
            else if (this.frmRFQInformationForm.get('previewDate').hasError('invalidDate1')) {
                this.frmRFQInformationForm.get('previewDate').setErrors(null);
            }

            if (this.isAfter(value, this.frmRFQInformationForm.get('bidOpeningDate').value)) {
                this.frmRFQInformationForm.get('publishDate').setErrors({ invalidDate4: true });
                // this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ invalidDate3: true });
            }
            else if (this.frmRFQInformationForm.get('bidOpeningDate').hasError('invalidDate3')) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors(null);
            }

            if (value && this.isBefore(new Date(value).toISOString(), new Date().toISOString())) {
                this.frmRFQInformationForm.get('publishDate').setErrors({ pastDate: true });
            }
        });

        this.frmRFQInformationForm.get('previewDate').valueChanges.subscribe(value => {
            if (this.isBefore(value, this.frmRFQInformationForm.get('publishDate').value)) {
                this.frmRFQInformationForm.get('previewDate').setErrors({ invalidDate1: true });
                // this.frmRFQInformationForm.get('publishDate').setErrors({ invalidDate2: true });
            }
            else if (this.frmRFQInformationForm.get('publishDate').hasError('invalidDate2')) {
                this.frmRFQInformationForm.get('publishDate').setErrors(null);
            }

            if (this.isAfter(value, this.frmRFQInformationForm.get('bidOpeningDate').value)) {
                this.frmRFQInformationForm.get('previewDate').setErrors({ invalidDate2: true });
                // this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ invalidDate1: true });
            }
            else if (this.frmRFQInformationForm.get('bidOpeningDate').hasError('invalidDate1')) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors(null);
            }

            if (value && this.isBefore(new Date(value).toISOString(), new Date().toISOString())) {
                this.frmRFQInformationForm.get('previewDate').setErrors({ pastDate: true });
            }
        });

        this.frmRFQInformationForm.get('bidOpeningDate').valueChanges.subscribe(value => {
            if (this.isBefore(value, this.frmRFQInformationForm.get('previewDate').value)) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ invalidDate1: true });
                // this.frmRFQInformationForm.get('previewDate').setErrors({ invalidDate2: true });
            }
            else if (this.frmRFQInformationForm.get('previewDate').hasError('invalidDate2')) {
                this.frmRFQInformationForm.get('previewDate').setErrors(null);
            }

            if (this.isBefore(value, this.frmRFQInformationForm.get('publishDate').value)) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ invalidDate3: true });
                // this.frmRFQInformationForm.get('publishDate').setErrors({ invalidDate4: true });
            }
            else if (this.frmRFQInformationForm.get('publishDate').hasError('invalidDate4')) {
                this.frmRFQInformationForm.get('publishDate').setErrors(null);
            }

            if (this.isAfter(value, this.frmRFQInformationForm.get('bidClosingDate').value)) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ invalidDate2: true });
                // this.frmRFQInformationForm.get('bidClosingDate').setErrors({ invalidDate1: true });
            }
            else if (this.frmRFQInformationForm.get('bidClosingDate').hasError('invalidDate1')) {
                this.frmRFQInformationForm.get('bidClosingDate').setErrors(null);
            }

            if (value && this.isBefore(new Date(value).toISOString(), new Date().toISOString())) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ pastDate: true });
            }
        });

        this.frmRFQInformationForm.get('bidClosingDate').valueChanges.subscribe(value => {
            if (this.isBefore(value, this.frmRFQInformationForm.get('bidOpeningDate').value)) {
                this.frmRFQInformationForm.get('bidClosingDate').setErrors({ invalidDate1: true });
                // this.frmRFQInformationForm.get('bidOpeningDate').setErrors({ invalidDate2: true });
            }
            else if (this.frmRFQInformationForm.get('bidOpeningDate').hasError('invalidDate2')) {
                this.frmRFQInformationForm.get('bidOpeningDate').setErrors(null);
            }

            if (this.isAfter(value, this.frmRFQInformationForm.get('eventOnAwardDate').value)) {
                this.frmRFQInformationForm.get('bidClosingDate').setErrors({ invalidDate2: true });
                // this.frmRFQInformationForm.get('eventOnAwardDate').setErrors({ invalidDate1: true });
            }
            else if (this.frmRFQInformationForm.get('eventOnAwardDate').hasError('invalidDate1')) {
                this.frmRFQInformationForm.get('eventOnAwardDate').setErrors(null);
            }

            if (value && this.isBefore(new Date(value).toISOString(), new Date().toISOString())) {
                this.frmRFQInformationForm.get('bidClosingDate').setErrors({ pastDate: true });
            }
        });

        this.frmRFQInformationForm.get('eventOnAwardDate').valueChanges.subscribe(value => {
            if (this.isBefore(value, this.frmRFQInformationForm.get('bidClosingDate').value)) {
                this.frmRFQInformationForm.get('eventOnAwardDate').setErrors({ invalidDate1: true });
                // this.frmRFQInformationForm.get('bidClosingDate').setErrors({ invalidDate2: true });
            }
            else if (this.frmRFQInformationForm.get('bidClosingDate').hasError('invalidDate2')) {
                this.frmRFQInformationForm.get('bidClosingDate').setErrors(null);
            }

            if (value && this.isBefore(new Date(value).toISOString(), new Date().toISOString())) {
                this.frmRFQInformationForm.get('eventOnAwardDate').setErrors({ pastDate: true });
            }
        });

    }

    isAfter(date1, date2) {
        if (date2 == null) {
            return false;
        }
        var d1 = Date.parse(date1);
        var d2 = Date.parse(date2);
        if (d1 > d2) {
            return true;
        }
        else {
            return false;
        }
    }

    isBefore(date1, date2) {
        if (date2 == null) {
            return false;
        }
        var d1 = Date.parse(date1);
        var d2 = Date.parse(date2);
        if (d1 < d2) {
            return true;
        }
        else {
            return false;
        }
    }

    toDatetimeLocal(date) {
        var ten = function (i) {
            return (i < 10 ? '0' : '') + i;
        },
            YYYY = date.getFullYear(),
            MM = ten(date.getMonth() + 1),
            DD = ten(date.getDate()),
            HH = ten(date.getHours()),
            II = ten(date.getMinutes()),
            SS = ten(date.getSeconds())
            ;
        return YYYY + '-' + MM + '-' + DD + 'T' +
            HH + ':' + II + ':' + SS;
    };

    goBack() {
        this.router.navigate(['/rfx']);
    }

    getRFQById(rfqId) {
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
       
        this.rfqService.getRFQById(rfqId, false, false).subscribe((result) => {
            refference.close();
            this.rfqModel.approvalType="RFQ";
            this.selectedTabIndex  = localStorage.getItem('selectedTabIndexRFQ') || 0;
            this.selectedEvaluationIndex = localStorage.getItem('selectedEvaluationIndexRFQ') || 0;
            this.selectedTabIndexHeader = localStorage.getItem('selectedTabIndexHeader') || 0;
            this.rfqModel = result.data;
            if (this.rfqModel) {
                this.rfqModel.publishDate = this.rfqModel.publishDate ? this.toDatetimeLocal(new Date(this.rfqModel.publishDate + "Z")) : null;
                this.rfqModel.bidOpeningDate = this.rfqModel.bidOpeningDate ? this.toDatetimeLocal(new Date(this.rfqModel.bidOpeningDate + "Z")) : null;
                this.rfqModel.bidClosingDate = this.rfqModel.bidClosingDate ? this.toDatetimeLocal(new Date(this.rfqModel.bidClosingDate + "Z")) : null;
                this.rfqModel.awardDate = this.rfqModel.awardDate ? this.toDatetimeLocal(new Date(this.rfqModel.awardDate + "Z")) : null;
                this.rfqModel.previewDate = this.rfqModel.previewDate ? this.toDatetimeLocal(new Date(this.rfqModel.previewDate + "Z")) : null;
                this.rfqModel.eventOnAwardDate = this.rfqModel.eventOnAwardDate ? this.toDatetimeLocal(new Date(this.rfqModel.eventOnAwardDate + "Z")) : null;

                if (this.rfqModel.bidClosingDate && new Date(this.rfqModel.bidClosingDate) < new Date()) {
                    this.rfqModel.bidClosingDateTimeArrived = true;
                }
                

                this.isSaveAsDraft = this.rfqModel.isSaveAsDraft;
                if (!this.rfqModel.isSaveAsDraft) {
                    this.frmRFQInformationForm.disable();
                }
            }

            this.biddingStyleLists = this.rfqModel.biddingStyleList;
            //remove closed & open bidding styles
            this.biddingStyleLists.splice(0,2);
            this.negotiationStyleLists = this.rfqModel.negotiationStyleList;
            this.outcomeLists = this.rfqModel.outcomeLists;
            this.negotiationStyles = this.rfqModel.negotiationStyles;

            this.createNSMap();
            this.createNSTwoStageMap();

            // this.tempRFQModel = null;
            if (this.rfqModel.id === '00000000-0000-0000-0000-000000000000' && this.tempRFQModel != null) {
                // this.rfqModel.negitiationStyleText = this.tempRFQModel.negitiationStyleID;
                // this.rfqModel.biddingStyleText = this.tempRFQModel.biddingStyleID;
                // this.rfqModel.currencyText = this.tempRFQModel.currencyID;
                this.rfqModel.negitiationStyleID = this.tempRFQModel.negitiationStyleID;
                this.rfqModel.rfxType = this.tempRFQModel.rfxType;
                this.rfqModel.biddingStyleID = this.tempRFQModel.biddingStyleID;
                this.rfqModel.currencyID = this.tempRFQModel.defaultCurrencyID;
                this.rfqModel.rfqName = this.tempRFQModel.rfqName;
                this.rfqModel.rfqDescription = this.tempRFQModel.rfqDescription;
            }
            if (this.rfqModel.rfxType) {
                if (this.rfqModel.rfxType == "RFQ") {
                    this.lblRFXHeader = "Request for Quotation";
                    this.lblRFXNo = "RFQ#";
                }
                else if (this.rfqModel.rfxType == "RFI") {
                    this.lblRFXHeader = "Request for Information";
                    this.lblRFXNo = "RFI#";
                } if (this.rfqModel.rfxType == "RFAQ") {
                    this.lblRFXHeader = "Request for Agreement Quotation";
                    this.lblRFXNo = "RFAQ#";
                }
            }
            this.rfqModel.currencyList = result.data.currencyList;
            if (this.rfqModel.currencyList) {
                for (var i = 0; i < this.rfqModel.currencyList.length; i++) {
                    if (this.rfqModel.currencyList[i].currencyId == this.rfqModel.currencyID) {
                        this.rfqModel.currencyText = this.rfqModel.currencyList[i].currencyCode;
                    }
                }
            }
            this.rfqModel.deliveryAddressList = result.data.deliveryAddressList
            this.rfqModel.paymentTermsList = result.data.paymentTermsList
            this.rfqModel.deliveryTermsList = result.data.deliveryTermsList
            this.rfqModel.shipViaCodeList = result.data.shipViaCodeList
            this.rfqModel.projectCodeList = result.data.projectCodeList
            this.rfqModel.timeZoneList = result.data.timeZoneList
            this.rfqModel.programList = result.data.programList
            this.rfqModel.siteList = result.data.siteList
            this.rfqModel.countryList = result.data.countryList
            this.rfqModel.publishDateList = result.data.publishDateList
            this.rfqModel.awardDateBeforeList = result.data.awardDateBeforeList
            this.rfqModel.awardDateAfterList = result.data.awardDateAfterList
            this.rfqModel.negitiationStyleID = result.data.negitiationStyleID
            this.rfqModel.biddingStyleID = result.data.biddingStyleID;
            this.rfqModel.outcomeID = result.data.outcomeID;
            this.rfqModel.projectType = result.data.projectType;

            this.rfqModel.isTwoStageRFx = this.negotiationTwoStageMap.get(this.rfqModel.negitiationStyleID);

            if (this.rfqModel.previewDate) {
                this.rdbpreviewDate = 'one';
                this.frmRFQInformationForm.get('previewDate').enable();
                this.isPreviewDate = false;
            }
            if (this.rfqModel.previewCount) {
                if (this.rfqModel.previewCount > 0) {
                    this.rdbpreviewDate = 'two';
                    this.frmRFQInformationForm.get('previewDate').disable();
                    this.isPreviewDate = true;
                }
            }
            if (this.rfqModel.eventOnAwardDate) {
                this.rdbawardDate = 'one';
                this.frmRFQInformationForm.get('eventOnAwardDate').enable();
                this.isAwardDate = false;
            }
            if (this.rfqModel.roaCount) {
                if (this.rfqModel.roaCount > 0) {
                    this.rdbawardDate = 'two';
                    this.frmRFQInformationForm.get('eventOnAwardDate').disable();
                    this.isAwardDate = true;
                }
            }

            this.FetchRFQCurrency();
            if (this.rfqModel.countryID != undefined) {
                this.getCities(this.rfqModel.countryID);
            }

            this.frmRFQInformationForm.patchValue(this.rfqModel);
            this.SetAlternateCurrencyFlag();
            if (!this.timerStatuses.includes(this.rfqModel.statusName)) {
                setInterval(() => {
                    this.myTimer();
                }, 1000);
            }
            if (this.rfqModel.statusName == "Publish/Bid Live" || this.rfqModel.statusName == "Bid Open") {
                setInterval(() => {
                    this.automaticStatusChange();
                }, 1000);
            }
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
            this._changeDetectorRef.detectChanges();
        });
    }

    PublishRFX() {
        this.isClickedPublish = true;
        this.rfqModelPublish.id = this.rfqId;
        this.rfqModelPublish.statusID = '00000001-0000-0000-0000-000000000000';
        this.rfqService.PublishRFX(this.rfqModelPublish).subscribe(result => {
           
           var emergencysupplier=result.data.suppliers.filter(i=>i.isEmergencySupplier==true);
           if(emergencysupplier.length>0){
            this.createInviteSupplierSRM(emergencysupplier);
            this.isClickedPublish = false;
           }
           else{
            this.isClickedPublish = false;
           }
           
        });
        this.goBack();

    }

    DeleteRFQCurrencys(currencies: RFQCurrencyViewModel[]) {
        Swal.fire({
            title: 'Delete RFQ Currency',
            text: "Are you sure you want to delete this record?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Remove'
        }).then((result) => {
            if (result.isConfirmed) {
                this.rfqService.DeleteRFQCurrency([currencies]).subscribe(result => {

                    Swal.fire(
                        'Deleted!',
                        'Record deleted successfully.',
                    ).then((result) => {
                        this.rfqCurrencies = [];
                        this.FetchRFQCurrency();
                    });
                });
            }
        });
    }

    // Pause RFX button on 'More' drop-down - Shohan
    pauseRFX() {
        Swal.fire({
            title: 'Are you sure you want to amend changes?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Amend",
            denyButtonText: 'Cancel',
        }).then((result) => {
            this.isreviseDisable = true;
            this.rfqService.pauseRFX(this.rfqId).subscribe(result => {
                this.reviseRFX();
            });
            // this.rfqService.copyRFQ(row.id).subscribe(result => {           
            //     Swal.fire({
            //         position: 'top-end',
            //         icon: 'success',
            //         title: "Duplicated successfully",
            //         showConfirmButton: false,
            //         timer: 1000
            //     });
            //     this.FetchBasicData(); 
            // });
        });

    }
    isreviseDisable = false;
    // Revise RFX button on 'More' drop-down - Shohan
    reviseRFX() {
        this.rfqService.reviseRFX(this.rfqId).subscribe(result => {
            debugger;
            this.isreviseDisable = false;
            this.router.navigateByUrl('/rfq' + "/" + result.data.id, { state: { Id: result.data.id } });
            // window.location.reload();
        });
    }

    cancelledRFX() {
        this.rfqService.cancelledRFX(this.rfqId).subscribe(result => {
        });
    }

    evaluationInitiationRFX() {
        const loadingDialog = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
        this.rfqService.evaluationInitiationRFX(this.rfqId).subscribe(result => {
            loadingDialog.close();
            if (result.data.isSuccess == true) {
                Swal.fire({
                    icon: 'success',
                    position: "center",
                    title: 'Success',
                    html: this.GetErrorOrderedList(result.data.errors),
                }).then((result) => {
                    debugger;
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        this.getRFQById(this.rfqId);
                        this.fetchRFXHistoryData();

                    }
                });
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error',
                    html: this.GetErrorOrderedList(result.data.errors),
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                });
                this.getRFQById(this.rfqId);
            }
        });
    }

    //Create Follow On Event on 'More' drop-down - Gangez
    createFollowOnEvent() {
        if(this.rfqModel.statusName=="Bid Closed")
        
        this.rfqService.CreateFollowOnEvent(this.rfqId).subscribe(result => {
         this.getRFQById(this.rfqId);
         }); 
     }
 isBidClosed(){
     if(this.rfqModel.statusName=="Bid Closed"){
         return true;
     }
     else{
         return false;
     }
 }

    ngAfterViewInit() {
        if (this.dataSource) {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.dataSource2.paginator = this.paginator;
            this.dataSource2.sort = this.sort;
            this.dataSource4.paginator = this.paginator;
            this.dataSource4.sort = this.sort;
            this.dataSource5.paginator = this.paginator;
            this.dataSource5.sort = this.sort;
            this.dataSource6.paginator = this.paginator;
            this.dataSource6.sort = this.sort;
            this.dataSource7.paginator = this.paginator;
            this.dataSource7.sort = this.sort;
            this.dataSource8.paginator = this.paginator;
            this.dataSource8.sort = this.sort;
            this.dataSource9.paginator = this.paginator;
            this.dataSource9.sort = this.sort;
            this.dataSource10.paginator = this.paginator;
            this.dataSource10.sort = this.sort;
            this.dataSource11.paginator = this.paginator;
            this.dataSource11.sort = this.sort;
            this.dataSource12.paginator = this.paginator;
            this.dataSource12.sort = this.sort;
            this.dataSource13.paginator = this.paginator;
            this.dataSource13.sort = this.sort;
        }

        this.myTimer();
        

    }

    getRFQChatMessages() {

    }

    fetchRFXHistoryData() {
        const refference1 = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
       
        this.rfqService.GetRFXHistoryByRFXID(this.rfqId ? this.rfqId : '00000000-0000-0000-0000-000000000000').subscribe(result => {
            refference1.close();
            this.rfxHistoryViewModel = result.model.table;
            for (var i = 0; i < this.rfxHistoryViewModel.length; i++) {
                this.rfxHistoryViewModel[i].creationDate=this.rfxHistoryViewModel[i].creationDate ? this.toDatetimeLocal(new Date(this.rfxHistoryViewModel[i].creationDate + "Z")) :'';
                this.rfxHistoryViewModel[i].creationDate=this.rfxHistoryViewModel[i].creationDate.replace('T', ' ');
            }
            this._changeDetectorRef.detectChanges();
        });
    }

    RFQSendForApproval() {
        this.processOnApprovel = true;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
        let rfqApprovalViewModel = new RFQApprovalViewModel();
        rfqApprovalViewModel.rFQId = this.rfqId;
        //rfqApprovalViewModel.approvalId = "438ce631-f035-4546-3cbc-08da399044ff";
        rfqApprovalViewModel.statusName = "Approval Pending";
        rfqApprovalViewModel.statusType = "RFQ";
        rfqApprovalViewModel.approvalType = "RFQ";

        this.rfqService.SendForApproval(rfqApprovalViewModel)
            .pipe(takeUntil(this.destroy$)).subscribe({
                next: (result) => {
                    if (result.data.isSuccess == false) {
                        this.processOnApprovel = false;
                        refference.close();
                        Swal.fire({
                            icon: 'error',
                            position: "center-start",
                            title: 'Error',
                            html: result.data.responseMessage,
                            customClass: {
                                container: 'display-list'
                            },
                            target: '#error-alert'
                        });
                    }
                    else {
                        Swal.fire({
                            icon: 'success',
                            position: "center",
                            title: 'Success',
                            html: result.data.responseMessage
                        }).then((result) => {
                            /* Read more about isConfirmed, isDenied below */
                            if (result.isConfirmed) {
                                this.getRFQById(this.rfqId);
                                this.fetchRFXHistoryData();
                                this.getApproveRejectWidgetData();
                            }
                        });
                        refference.close();
                        this.processOnApprovel = false;
                    }
                }
            });
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
        this.dataSource2.filter = filterValue.trim().toLowerCase();
        this.dataSource4.filter = filterValue.trim().toLowerCase();
        this.dataSource5.filter = filterValue.trim().toLowerCase();
        this.dataSource6.filter = filterValue.trim().toLowerCase();
        this.dataSource7.filter = filterValue.trim().toLowerCase();
        this.dataSource8.filter = filterValue.trim().toLowerCase();
        this.dataSource9.filter = filterValue.trim().toLowerCase();
        this.dataSource10.filter = filterValue.trim().toLowerCase();
        this.dataSource11.filter = filterValue.trim().toLowerCase();
        this.dataSource12.filter = filterValue.trim().toLowerCase();
        this.dataSource13.filter = filterValue.trim().toLowerCase();
    }

    openAddCurrency() {
        let rfqCurrecyIds = this.rfqCurrencies.map(p => p.currencyId);
        rfqCurrecyIds.push(this.frmRFQInformationForm.get('currencyID').value);
        const dialogRef = this.dialog.open(AddCurrencyOverlayComponent, { data: { "rfqId": this.rfqId, "type": this.rfqModel.rfxType, "usedCurrencies": rfqCurrecyIds } });
        dialogRef.disableClose = true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.FetchRFQCurrency();
        });
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

    openAwardSelectedLine() {
        const dialogRef = this.dialog.open(AwardSelectedOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openAwardRecommendLine() {
        const dialogRef = this.dialog.open(AwardRecommendOverlayComponent);
        dialogRef.addPanelClass('inline-sm-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    isShow2 = true;
    isShow = true;

    reusableAttributeList() {
        const dialogRef = this.dialog.open(AddReusableAttributeOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addAttributeList() {
        const dialogRef = this.dialog.open(AddNewAttributeListOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addAttributeItem() {
        const dialogRef = this.dialog.open(AddAttributeItemOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addNewAttributeItem() {
        const dialogRef = this.dialog.open(AddNewAttributeOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    reusableCostFactorList() {
        const dialogRef = this.dialog.open(AddReusableCostfactorOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addCostFactorList() {
        const dialogRef = this.dialog.open(AddNewCostfactorlistOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addNewCostFactorItem() {
        const dialogRef = this.dialog.open(AddNewCostfactorOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addCostFactorItem() {
        const dialogRef = this.dialog.open(AddCostfactorItemOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addPaymentSchedule() {
        const dialogRef = this.dialog.open(AddNewPaymentschedulesOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addTerms() {
        const dialogRef = this.dialog.open(AddTermsOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addAttachment() {
        const dialogRef = this.dialog.open(AddNewAttachmentOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addLineAttachment() {
        const dialogRef = this.dialog.open(AddNewLineAttachmentOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addDocumentText() {
        const dialogRef = this.dialog.open(AddNewDocumenttextOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addNote() {
        const dialogRef = this.dialog.open(AddNewNoteOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addPartLineNote() {
        const dialogRef = this.dialog.open(AddNewPartLineNoteOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addDeliverable() {
        const dialogRef = this.dialog.open(AddNewDeliverableOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addSurveyTemplate() {
        const dialogRef = this.dialog.open(AddSurveyOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addSurveyQuestion() {
        const dialogRef = this.dialog.open(AddSurveyQuestionOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    createSurveyQuestion() {
        const dialogRef = this.dialog.open(CreateSurveyQuestionOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addSupplier() {
        const dialogRef = this.dialog.open(AddSupplierOverlayComponent);
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    addTeamMember() {
        const dialogRef = this.dialog.open(AddTeamOverlayComponent);
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openDialog() {
        const dialogRef = this.dialog.open(AddCsvOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000" } });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            this.importfilerfqid = result;
            if (this.importfilerfqid) {
                this.getRFQById(this.importfilerfqid);
            }
        });
    }

    approvalConfirm() {
        if (this.rfqId) {
            const dialogRef = this.dialog.open(ApprovalConfirmationOverlayComponent, {
                height: 'auto',
                data: {
                    rfqId: this.rfqId,
                    approvalType: "RFQ"
                },
                disableClose: true
            });
            dialogRef.afterClosed().subscribe(result => {
                this.rfqModel.isApproveReject=!result.issuccess;
                if (result.event == "Success") {
                    this.getRFQById(this.rfqId);
                    this.getApproveRejectWidgetData();
                    this.fetchRFXHistoryData();
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: "RFQ id is required, please retry",
                customClass: {
                    container: 'display-list'
                },
                target: '#error-alert'
            }).then((result) => {
                console.log(result);
            });

        }
    }

    rejectionConfirm() {
        const dialogRef = this.dialog.open(RejectionConfirmationOverlayComponent, {
            height: 'auto',

            data: {
                // id: "00000000-0000-0000-0000-000000000000",
                // approver: 'Udaraa', 
                // activity: '123#456' ,
                rfqId: this.rfqId,
                approvalType: "RFQ"
            },
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(result => {
            this.rfqModel.isApproveReject=!result.issuccess;
            if (result.event == "Success") {
                this.getRFQById(this.rfqId);
                this.getApproveRejectWidgetData();
                this.fetchRFXHistoryData();
            }
        });
    }

    toggleDisplay() {
        this.isShow = !this.isShow;
    }

    toggleDisplay2() {
        this.isShow2 = !this.isShow2;
    }

    selectedTab: string;
    selectedTabData: any;

    tabClick(tab, mainTab) {
        this.selectedTab = tab.tab.textLabel;
        if (mainTab) {
            this.selectedTab = mainTab + tab.tab.textLabel;
        }
        localStorage.setItem('selectedTabIndexHeader', tab.index);
    }

    tabIndex = -1;
    changeTab(event) {
        // if (this.selectedTab == "RFQ Information") {
        //     let rfqModel: RFQViewModel = new RFQViewModel();
        //     rfqModel = this.frmRFQInformationForm.value;
        //     rfqModel.id = this.rfqId;
        //     rfqModel.statusName = this.rfqModel.statusName;
        //     rfqModel.nextStatusName = this.rfqModel.nextStatusName;
        //     this.rfqService.SaveRFQ(rfqModel).subscribe((response) => { });
        // }
        this.tabIndex = event.index;
        this.selectedTab = event.tab.textLabel;
        if(event.index==0)
        {
            this.UpdateAprovalHistory('RFQ');

        }

        localStorage.setItem('selectedTabIndexRFQ', event.index);
    }
    

    evaluationTabIndex = -1;
    changeEvaluationTab(event) {
        this.evaluationTabIndex = event.index;
        localStorage.setItem('selectedEvaluationIndexRFQ', event.index);
    }

    tabIndexResponse = -1;
    changeTabResponse(event) {
        this.tabIndexResponse = event.index;
    }

    addItem(newItem: ItemChangeModel) {
        this.frmScoring = newItem.frm;
        this.partLineModel = newItem.model;
    }

    rfxRulesViewModel: any;
    addRulesItem(rfxRVM: any) {
        this.rfxRulesViewModel = rfxRVM;
    }

    copyRFQ() {
        Swal.fire({
            title: 'Do you want to Copy the rfq?',
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Copy",
            denyButtonText: 'Cancel',
        }).then((result) => {
            this.rfqService.copyRFQ(this.rfqId).subscribe(result => {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: "RFQ Copied successfully",
                    showConfirmButton: false,
                    timer: 1000
                });
            });
        });
    }

    //Timer dynamically done - Gangez
    myTimer() {
        if (this.rfqModel) {
            if (this.rfqModel.bidClosingDate && this.rfqModel.bidOpeningDate) {

                this.bidClosingDate = new Date(this.rfqModel.bidClosingDate);
                this.bidOpeningDate = new Date();
                var diff = this.bidClosingDate.getTime() - this.bidOpeningDate.getTime();

                if (diff > 0) {
                    var days = Math.floor(diff / (60 * 60 * 24 * 1000));
                    var hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
                    var minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
                    var seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));

                    this.days = days < 10 ? '0' + days : days;
                    this.hours = hours < 10 ? '0' + hours : hours;
                    this.minutes = minutes < 10 ? '0' + minutes : minutes;
                    this.seconds = seconds < 10 ? '0' + seconds : seconds;
                }
                else {
                    this.days = '00';
                    this.hours = '00';
                    this.minutes = '00';
                    this.seconds = '00';
                }
                this.showTimer = true;

                // if (document.getElementById('days')) {
                //     document.getElementById('days').innerText = this.days;
                // }

                // if (document.getElementById('hours')) {
                //     document.getElementById('hours').innerText = this.hours;
                // }

                // if (document.getElementById('mins')) {
                //     document.getElementById('mins').innerText = this.minutes;
                // }

                // if (document.getElementById('seconds')) {
                //     document.getElementById('seconds').innerText = this.seconds;
                // }
            }
        }
    }

    automaticStatusChange() {
        if (this.rfqModel) {
            if (this.rfqModel.bidClosingDate && this.rfqModel.bidOpeningDate) {

                if (this.rfqModel.statusName == "Publish/Bid Live" && new Date(this.rfqModel.bidOpeningDate) < new Date()) {
                    this.rfqModel.statusName = "Bid Open";
                    setInterval(() => {
                        this.myTimer();
                    }, 1000);
                }
                if (this.rfqModel.statusName == "Bid Open" && new Date(this.rfqModel.bidClosingDate) < new Date()) {
                    this.rfqModel.statusName = "Bid Closed";
                }
            }
        }
    }

    validateRFQ() {
        if (!this.frmRFQInformationForm.get('rfqNo').value) {
            this.frmRFQInformationForm.controls['rfqNo'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('rfqNo').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('buyerName').value) {
            this.frmRFQInformationForm.controls['buyerName'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('buyerName').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('negitiationStyleID').value) {
            this.frmRFQInformationForm.controls['negitiationStyleID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('negitiationStyleID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('biddingStyleID').value) {
            this.frmRFQInformationForm.controls['biddingStyleID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('biddingStyleID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('outcomeID').value) {
            this.frmRFQInformationForm.controls['outcomeID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('outcomeID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('rfqName').value) {
            this.frmRFQInformationForm.controls['rfqName'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('rfqName').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('currencyID').value) {
            this.frmRFQInformationForm.controls['currencyID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('currencyID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('paymentTermID').value) {
            this.frmRFQInformationForm.controls['paymentTermID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('paymentTermID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('bidOpeningDate').value) {
            this.frmRFQInformationForm.controls['bidOpeningDate'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('bidOpeningDate').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('bidClosingDate').value) {
            this.frmRFQInformationForm.controls['bidClosingDate'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('bidClosingDate').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('deliveryAddressID').value) {
            this.frmRFQInformationForm.controls['deliveryAddressID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('deliveryAddressID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('countryID').value) {
            this.frmRFQInformationForm.controls['countryID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('countryID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('cityID').value) {
            this.frmRFQInformationForm.controls['cityID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('cityID').clearValidators();
        }

        if (!this.frmRFQInformationForm.get('deliveryTermsID').value) {
            this.frmRFQInformationForm.controls['deliveryTermsID'].setValidators([Validators.required]);
        } else {

            this.frmRFQInformationForm.get('deliveryTermsID').clearValidators();
        }
        this.frmRFQInformationForm.validate();
    }

    Review() {
        this.validateRFQ();
        if (!this.frmRFQInformationForm.valid) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                html: "Please fill in all the required fields"
            });
            this.frmRFQInformationForm.markAllAsTouched();
            return;
        }
        this.processOnReview = true;
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Processing....' } });
       
        let rfqModel: RFQViewModel = new RFQViewModel();

        rfqModel = this.frmRFQInformationForm.value;
        rfqModel.id = this.rfqId;
        rfqModel.statusName = this.rfqModel.nextStatusName;
        rfqModel.nextStatusName = this.rfqModel.nextStatusName;

        // if (this.rfqId != null && this.rfqId != "00000000-0000-0000-0000-000000000000" && this.rfxRulesViewModel) {
        //     this.rulesService.SaveRules(this.rfxRulesViewModel).subscribe(result => {
        //     });
        // }
        /* if (this.rfqId != null && this.rfqId != "00000000-0000-0000-0000-000000000000" && this.frmScoring && this.partLineModel) {
            let scoringmodel: any = { rfqScoringHeaderModel: {}, rfqScoringLineModel: {}, rfqHeaderLineScoringCriterias: [], rfqId: "", rfqHeaderScoringCriterias: [], rfqPartLineScoringCriterias: [], rfqLineScoringCriterias: [] };
            scoringmodel.rfqScoringHeaderModel = {
                rfqScoringHeaderAttachmentTextViewModels: [], rfqScoringHeaderAttributeTextViewModels: [], rfqScoringHeaderCostFactorTextViewModels: []
                , rfqScoringHeaderDeliverablesTextViewModels: [], rfqScoringHeaderDocumentTextTextViewModels: [], rfqScoringHeaderPaymentScheduleTextViewModels: []
                , rfqScoringHeaderTermsConditionTextViewModels: [], rfqScoringHeaderNoteViewModels: []
            };

            scoringmodel.rfqScoringLineModel = {
                rfqPartLineScoringModels: [], rfqScoringLineAttributeTextViewModels: [], rfqScoringLineCostFactorTextViewModels: []
                , rfqScoringLineAttachmentTextViewModels: [], rfqScoringLineDeliverableTextViewModels: [], rfqScoringLineDocumentTextTextViewModels: []
                , rfqScoringLinePaymentScheduleTextViewModels: [], rfqScoringLineNotes: []
            };
            scoringmodel.rfqHeaderLineScoringCriterias = [];

            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderAttachmentTextViewModels, this.frmScoring.value.scoringHeaderAttachments);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderAttributeTextViewModels, this.frmScoring.value.scoringHeaderAttributes);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderCostFactorTextViewModels, this.frmScoring.value.scoringHeaderCFs);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderDeliverablesTextViewModels, this.frmScoring.value.scoringFeaderDeliveries);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderDocumentTextTextViewModels, this.frmScoring.value.scoringHeaderDTs);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderPaymentScheduleTextViewModels, this.frmScoring.value.scoringHeaderPSs);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderNoteViewModels, this.frmScoring.value.scoringHeaderNotes);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqPartLineScoringModels, this.frmScoring.value.scoringPartLines);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineAttributeTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineAttributeTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineCostFactorTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineCostFactorTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineAttachmentTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineAttachmentTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineDeliverableTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineDeliverableTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineDocumentTextTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineDocumentTextTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLinePaymentScheduleTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLinePaymentScheduleTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineNotes, this.partLineModel.rfqScoringLineModel.rfqScoringLineNotes);
            Object.assign(scoringmodel.rfqHeaderScoringCriterias, this.frmScoring.value.scoringHeaderCriteria);
            Object.assign(scoringmodel.rfqPartLineScoringCriterias, this.frmScoring.value.scoringPartLineCriteria);
            Object.assign(scoringmodel.rfqLineScoringCriterias, this.partLineModel.rfqLineScoringCriterias);
            // Object.assign(scoringmodel.rfqHeaderLineScoringCriterias,this.frmScoring.value.scoringPartLines);
            scoringmodel.rfqId = this.partLineModel.rfqId;

            this.rfqService.SaveScoring(scoringmodel).subscribe(result => {
                console.log(result);
            });
        }  */
        this.rfqService.SaveRFQ(rfqModel).subscribe(result => {
            this.processOnReview = false;
            refference.close();
            this.isSaveAsDraft=result.data.isSaveAsDraft;
            if (result.data.success == false) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: 'Error',
                    html: this.GetErrorOrderedList(result.data.errors),
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                });
            }
            else {
            
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "RFQ Saved Successfully",
                    showConfirmButton: false,
                    timer: 1000
                })
                    .then((result1) => {
                        this.getRFQById(this.rfqId);
                        this.router.navigateByUrl('/rfq' + "/" + result.data.id, { state: { Id: result.data.id } });
                    });
            }
        });
    }

    GetErrorOrderedList(errors: any[]) {
        var elem = document.createElement('div');

        var errorLis = "";
        for (var i = 0; i < errors.length; i++) {
            errorLis = errorLis + "<li> <span class='material-icons style='font-size:10px; display:flex; item-align: center'>fiber_manual_record</span>" + errors[i].description + "</li>";
        }
        errorLis = '<ul style="text-align: left !important" id="error-alert">' + errorLis + "</ul>";
        elem.innerHTML = errorLis;

        return elem;
    }

    SaveAsDraft() {
        //Save RFQ
        let rfqModel: RFQViewModel = new RFQViewModel();

        rfqModel = this.frmRFQInformationForm.value;
        rfqModel.id = this.rfqId;
        rfqModel.statusName = "Planned Draft";

        // if (this.rfqId != null && this.rfqId != "00000000-0000-0000-0000-000000000000" && this.rfxRulesViewModel) {
        //     this.rulesService.SaveRules(this.rfxRulesViewModel).subscribe(
        //         (response) => {
        //         },
        //         (response) => {
        //             Swal.fire({
        //                 icon: 'error',
        //                 title: 'Error',
        //                 html: "Something Went Wrong With Saving Rules"
        //             });
        //         }
        //     );
        // }
        if (this.rfqId != null && this.rfqId != "00000000-0000-0000-0000-000000000000" && this.frmScoring && this.partLineModel) {
            let scoringmodel: any = { rfqScoringHeaderModel: {}, rfqScoringLineModel: {}, rfqHeaderLineScoringCriterias: [], rfqId: "", rfqHeaderScoringCriterias: [], rfqPartLineScoringCriterias: [], rfqLineScoringCriterias: [] };
            scoringmodel.rfqScoringHeaderModel = {
                rfqScoringHeaderAttachmentTextViewModels: [], rfqScoringHeaderAttributeTextViewModels: [], rfqScoringHeaderCostFactorTextViewModels: []
                , rfqScoringHeaderDeliverablesTextViewModels: [], rfqScoringHeaderDocumentTextTextViewModels: [], rfqScoringHeaderPaymentScheduleTextViewModels: []
                , rfqScoringHeaderTermsConditionTextViewModels: [], rfqScoringHeaderNoteViewModels: []
            };

            scoringmodel.rfqScoringLineModel = {
                rfqPartLineScoringModels: [], rfqScoringLineAttributeTextViewModels: [], rfqScoringLineCostFactorTextViewModels: []
                , rfqScoringLineAttachmentTextViewModels: [], rfqScoringLineDeliverableTextViewModels: [], rfqScoringLineDocumentTextTextViewModels: []
                , rfqScoringLinePaymentScheduleTextViewModels: [], rfqScoringLineNotes: []
            };
            scoringmodel.rfqHeaderLineScoringCriterias = [];

            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderAttachmentTextViewModels, this.frmScoring.value.scoringHeaderAttachments);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderAttributeTextViewModels, this.frmScoring.value.scoringHeaderAttributes);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderCostFactorTextViewModels, this.frmScoring.value.scoringHeaderCFs);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderDeliverablesTextViewModels, this.frmScoring.value.scoringFeaderDeliveries);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderDocumentTextTextViewModels, this.frmScoring.value.scoringHeaderDTs);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderPaymentScheduleTextViewModels, this.frmScoring.value.scoringHeaderPSs);
            Object.assign(scoringmodel.rfqScoringHeaderModel.rfqScoringHeaderNoteViewModels, this.frmScoring.value.scoringHeaderNotes);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqPartLineScoringModels, this.frmScoring.value.scoringPartLines);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineAttributeTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineAttributeTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineCostFactorTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineCostFactorTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineAttachmentTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineAttachmentTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineDeliverableTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineDeliverableTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineDocumentTextTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLineDocumentTextTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLinePaymentScheduleTextViewModels, this.partLineModel.rfqScoringLineModel.rfqScoringLinePaymentScheduleTextViewModels);
            Object.assign(scoringmodel.rfqScoringLineModel.rfqScoringLineNotes, this.partLineModel.rfqScoringLineModel.rfqScoringLineNotes);
            Object.assign(scoringmodel.rfqHeaderScoringCriterias, this.frmScoring.value.scoringHeaderCriteria);
            Object.assign(scoringmodel.rfqPartLineScoringCriterias, this.frmScoring.value.scoringPartLineCriteria);
            Object.assign(scoringmodel.rfqLineScoringCriterias, this.partLineModel.rfqLineScoringCriterias);
            // Object.assign(scoringmodel.rfqHeaderLineScoringCriterias,this.frmScoring.value.scoringPartLines);
            scoringmodel.rfqId = this.partLineModel.rfqId;
            const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Processing....' } });
            this.rfqService.SaveScoring(scoringmodel).subscribe(
                (response) => {
                    refference.close();
                },
                (response) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        html: "Something Went Wrong With Saving RFQ Score"
                    });
                }
            );
        }

        rfqModel.statusName = this.rfqModel.statusName;
        rfqModel.nextStatusName = this.rfqModel.nextStatusName;
        const refference1 = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Processing....' } });
        this.rfqService.SaveRFQ(rfqModel).subscribe(result => {
            refference1.close();
            if (result.data.success == false) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    html: this.GetErrorOrderedList(result.data.errors),
                    customClass: {
                        container: 'display-list'
                    },
                    target: '#error-alert'
                });
            }
            else {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "RFQ Saved Successfully",
                    showConfirmButton: true
                })
                    .then((result1) => {
                        this.router.navigateByUrl('/rfq' + "/" + result.data.id, { state: { Id: result.data.id } });
                    });
            }
        });
    }

    isPreviewDate: boolean = false;
    isAwardDate: boolean = false;
    successMessage: any[] = [];
    errorMessage: any[] = [];

    showHidePreviewDateOption(numm) {
        if (numm == 'one') {
            this.isPreviewDate = false;
            this.frmRFQInformationForm.get('previewDate').enable();
            this.frmRFQInformationForm.controls['previewCount'].setValue(null);
            this.frmRFQInformationForm.controls['previewId'].setValue(null);
            if (this.frmRFQInformationForm.controls['previewDate'].value != null) {
                if (new Date(this.frmRFQInformationForm.controls['previewDate'].value) <= new Date(this.frmRFQInformationForm.controls['publishDate'].value)) {
                    this.frmRFQInformationForm.controls['previewDate'].setValue(null);
                }

                if (new Date(this.frmRFQInformationForm.controls['previewDate'].value) > new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value)) {
                    this.frmRFQInformationForm.controls['previewDate'].setValue(null);
                }
            }
        }
        else if (numm == 'two') {
            this.isPreviewDate = true;
            this.frmRFQInformationForm.get('previewDate').disable();
            this.frmRFQInformationForm.controls['previewDate'].setValue(null);
        }
    }

    previewDateValidation(event: MatDatepickerInputEvent<Date>) {
        return;
        if (new Date(event.value) <= new Date(this.frmRFQInformationForm.controls['publishDate'].value)) {
            this.frmRFQInformationForm.controls['previewDate'].setValue(null);
        }
        if (new Date(event.value) > new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value)) {
            this.frmRFQInformationForm.controls['previewDate'].setValue(null);
        }
    }

    awardDateValidation(event: MatDatepickerInputEvent<Date>) {
        return;
        if (new Date(event.value) < new Date(this.frmRFQInformationForm.controls['bidClosingDate'].value)) {
            this.frmRFQInformationForm.controls['eventOnAwardDate'].setValue(null);
        }
    }

    handleDateChange(numm) {
        return;
        if (numm == 1) {
            if (new Date(this.frmRFQInformationForm.controls['publishDate'].value) <= (new Date())) {
                this.frmRFQInformationForm.controls['publishDate'].setValue(null);
            }
        }
        else if (numm == 2) {
            if (new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value) <= (new Date())) {
                this.frmRFQInformationForm.controls['bidOpeningDate'].setValue(null);
            }
            if (new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value) <= new Date(this.frmRFQInformationForm.controls['publishDate'].value)) {
                this.frmRFQInformationForm.controls['bidOpeningDate'].setValue(null);
            }
            if (new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value) <= new Date(this.frmRFQInformationForm.controls['publishDate'].value)) {
                this.frmRFQInformationForm.controls['bidOpeningDate'].setValue(null);
            }
            if (new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value) > new Date(this.frmRFQInformationForm.controls['previewDate'].value)) {
                this.frmRFQInformationForm.controls['bidOpeningDate'].setValue(null);
            }
        }
        else if (numm == 3) {
            if (new Date(this.frmRFQInformationForm.controls['bidClosingDate'].value) <= (new Date())) {
                this.frmRFQInformationForm.controls['bidClosingDate'].setValue(null);
            }
            if (new Date(this.frmRFQInformationForm.controls['bidClosingDate'].value) <= new Date(this.frmRFQInformationForm.controls['bidOpeningDate'].value)) {
                this.frmRFQInformationForm.controls['bidClosingDate'].setValue(null);
            }
            if (new Date(this.frmRFQInformationForm.controls['bidClosingDate'].value) <= new Date(this.frmRFQInformationForm.controls['publishDate'].value)) {
                this.frmRFQInformationForm.controls['bidClosingDate'].setValue(null);
            }
        }
        else if (numm == 4) {
            if (new Date(this.frmRFQInformationForm.controls['awardDate'].value) <= (new Date())) {
                this.frmRFQInformationForm.controls['awardDate'].setValue(null);
            }
            if (new Date(this.frmRFQInformationForm.controls['awardDate'].value) <= new Date(this.frmRFQInformationForm.controls['bidClosingDate'].value)) {
                this.frmRFQInformationForm.controls['awardDate'].setValue(null);
            }
        }
    }

    showHideAwardDateOption(numm) {
        if (numm == 'one') {
            this.isAwardDate = false;
            this.frmRFQInformationForm.get('eventOnAwardDate').enable();
            this.frmRFQInformationForm.controls['roaCount'].setValue(null);
            this.frmRFQInformationForm.controls['afterROACompletedId'].setValue(null);
        }
        else if (numm == 'two') {
            this.isAwardDate = true;
            this.frmRFQInformationForm.get('eventOnAwardDate').disable();
            this.frmRFQInformationForm.controls['eventOnAwardDate'].setValue(null);
        }
    }

    showRFI(event) {
        if (this.rfqModel.statusName == "Awarded") {
            const dialogRef = this.dialog.open(AgreementInfoDialogComponent, { data: { "rfqId": this.rfqId } });
            dialogRef.disableClose = true;
            dialogRef.addPanelClass('inline-md-overlay');
            dialogRef.afterClosed().subscribe(result => {
                this.FetchRFQCurrency();
            });
        }
    }

    SetIsTemplate() {
        const dialogRef = this.dialog.open(RfxTemplatesOverlayComponent, { data: { "id": "00000000-0000-0000-0000-000000000000", "rfqId": this.rfqId } });
        dialogRef.disableClose=true;
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe(result => {
            
        });
    }

    poCreation() {
        this.router.navigateByUrl('/po-info');
    }

    openExportReport() {
        window.open('/export-report/' + this.rfqId);
    }

    isAlternateCurrencyApplicable: boolean = true;

    SetAlternateCurrencyFlag() {
        this.isAlternateCurrencyApplicable = this.frmRFQInformationForm.get('isAlternateCurrencyApplicable').value;
    }

    negotiationMap = new Map();
    negotiationTwoStageMap = new Map();
    createNSMap() {
        this.negotiationStyles && this.negotiationStyles.length > 0 && this.negotiationStyles.forEach(element => {
            this.negotiationMap.set(element.id, element.bidingStyleID)
        });
    }

    createNSTwoStageMap() {
        this.negotiationStyles && this.negotiationStyles.length > 0 && this.negotiationStyles.forEach(element => {
            this.negotiationTwoStageMap.set(element.id, element.isTwoStageRFx)
        });
    }

    showBiddingStyle(event) {
        this.frmRFQInformationForm.get('biddingStyleID').setValue(this.negotiationMap.get(event.value));
        this.frmRFQInformationForm.get('isTwoStageRFx').setValue(this.negotiationTwoStageMap.get(event.value));

        let rfqModel: RFQViewModel = new RFQViewModel();
        rfqModel = this.frmRFQInformationForm.value;
        rfqModel.id = this.rfqId;
        rfqModel.statusName = this.rfqModel.statusName;
        rfqModel.nextStatusName = this.rfqModel.nextStatusName;
        this.rfqService.SaveRFQ(rfqModel).subscribe((response) => { });

        this.rulesService.getNsById(event.value).subscribe(result => {
            this.rfqModel.rfxRules = result.data;
        });
    }

    public exportToExcel() {
        let workbook = new Workbook();
        this.rfqService.getRFQDataForExport(this.rfqId).subscribe(result => {

            this.getRFQInformationSheet(workbook, result.model.table[0]);
            this.getHeaderAttributes(workbook, result.model.table1);
            this.getHeaderCF(workbook, result.model.table2);
            this.getHeaderPS(workbook, result.model.table3);
            this.getHeaderTC(workbook, result.model.table4);
            this.getHeaderAt(workbook, result.model.table5);
            this.getHeaderDT(workbook, result.model.table6);
            this.getHeaderNo(workbook, result.model.table7);
            this.getHeaderDel(workbook, result.model.table8);
            this.getHeaderSF(workbook, result.model.table9);
            this.getPartLines(workbook, result.model);
            this.getSupplier(workbook, result.model.table18);
            this.getCollaborationTeam(workbook, result.model.table19);
            this.getRules(workbook, result.model.table20, result.model.table21);
            this.getScorings(workbook, result.model);
            workbook.xlsx.writeBuffer().then((data) => {
                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                fs.saveAs(blob, 'RFQ.xlsx');
            });
        });
        // Generate Excel File with given name

    }

    setColourToCell(cell, worksheet, row) {
        worksheet.getRow(row).getCell(cell).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'ffffff' },
            bgColor: { argb: '888484' }
        };
    }

    getRFQInformationSheet(workbook: Workbook, rfq) {

        let wsRFQInformation = workbook.addWorksheet('RFQ Information');
        var rowValues = [];
        rowValues[0] = 'RFQ No';
        rowValues[2] = 'Rev No';
        rowValues[4] = 'Buyer Name';
        rowValues[6] = 'Negotiation Style';
        rowValues[8] = 'Bidding Style';
        rowValues[10] = 'Outcome';
        const newRow1 = wsRFQInformation.addRow(rowValues, 'i');//Row 1


        rowValues = [];

        rowValues[0] = rfq.rfqno;
        rowValues[2] = rfq.revNo;
        rowValues[4] = rfq.buyerName;
        rowValues[6] = rfq.negitiationStyle;
        rowValues[8] = rfq.biddingStyle;
        rowValues[10] = rfq.outcomeID;
        wsRFQInformation.addRow(rowValues, 'i');//Row 2 Data

        // this.setColourToCell(2,wsRFQInformation,2);
        // this.setColourToCell('C2',wsRFQInformation,1);
        // this.setColourToCell('E2',wsRFQInformation,1);
        // this.setColourToCell('G2',wsRFQInformation,1);
        // this.setColourToCell('I2',wsRFQInformation,1);
        // this.setColourToCell('K2',wsRFQInformation,1);

        rowValues = [];
        wsRFQInformation.addRow([]);//Row 3

        rowValues[0] = 'Name';
        rowValues[2] = 'Description';
        rowValues[6] = 'Two Stage';
        rowValues[8] = 'Show Rank During Bidding';
        const newRow = wsRFQInformation.addRow(rowValues, 'i');//Row 4

        rowValues = [];
        rowValues[0] = rfq.rfqName;
        rowValues[2] = rfq.rfqDescription;
        rowValues[6] = rfq.twoStageRFx;
        rowValues[8] = rfq.showRankDuringBidding;
        wsRFQInformation.addRow(rowValues, 'i');//Row 5 Data
        wsRFQInformation.addRow([]);//Row 6

        rowValues = [];


        rowValues[0] = 'Allow Bids in Alternate Currency';
        rowValues[4] = 'Alternate Currencies';

        const newRow2 = wsRFQInformation.addRow(rowValues, 'i');//Row 7

        wsRFQInformation.mergeCells('A7:C7');


        rowValues = [];
        rowValues[0] = rfq.alternateCurrencyApplicable;
        rowValues[4] = rfq.alternateCurrencies;
        wsRFQInformation.addRow(rowValues, 'i');//Row 8 Data
        wsRFQInformation.mergeCells('A8:C8');
        wsRFQInformation.addRow([]);//Row 9

        rowValues = [];
        rowValues[0] = 'Project Code';
        rowValues[2] = 'Programme ID';
        rowValues[4] = 'Project Type';
        rowValues[6] = 'Show Rank During Bidding';
        const newRow3 = wsRFQInformation.addRow(rowValues, 'i');//Row 10

        rowValues = [];
        rowValues[0] = rfq.project;
        rowValues[2] = rfq.program;
        rowValues[4] = rfq.projectType;
        rowValues[6] = rfq.showRankDuringBidding;
        wsRFQInformation.addRow(rowValues, 'i');//Row 11 Data
        wsRFQInformation.addRow([]);//Row 12

        rowValues = [];
        rowValues[0] = 'Time Zone';
        rowValues[2] = 'Publish Date & Time';
        rowValues[4] = 'Bid Opening Date & Time';
        rowValues[6] = 'Bid Closing Date & Time';
        rowValues[8] = 'Award Date & Time';
        const newRow4 = wsRFQInformation.addRow(rowValues, 'i');//Row 13

        rowValues = [];
        rowValues[0] = rfq.timeZone;
        rowValues[2] = rfq.publishDate;
        rowValues[4] = rfq.bidOpeningDate;
        rowValues[6] = rfq.bidClosingDate;
        rowValues[8] = rfq.awardDate;
        wsRFQInformation.addRow(rowValues, 'i');//Row 14 Data
        wsRFQInformation.addRow([]);//Row 15

        rowValues = [];
        rowValues[0] = 'Preview Date';
        rowValues[2] = 'Award Date';
        const newRow5 = wsRFQInformation.addRow(rowValues, 'i');//Row 16

        rowValues = [];
        rowValues[0] = rfq.previewDate;
        rowValues[2] = rfq.eventOnAwardDate;
        wsRFQInformation.addRow([]);//Row 17 Data
        wsRFQInformation.addRow([]);//Row 18

        rowValues = [];
        rowValues[0] = 'Delivery Address';
        const newRow6 = wsRFQInformation.addRow(rowValues, 'i');//Row 19

        rowValues = [];
        rowValues[0] = rfq.deliveryAddressID;
        wsRFQInformation.addRow([]);//Row 20 Data
        wsRFQInformation.addRow([]);//Row 21

        rowValues = [];
        rowValues[0] = 'Ship via Code';
        rowValues[2] = 'Country';
        rowValues[4] = 'City';
        rowValues[6] = 'Site';
        rowValues[8] = 'Delivery Term';

        const newRow7 = wsRFQInformation.addRow(rowValues, 'i');//Row 22
        rowValues = [];
        rowValues[0] = rfq.shipViaCodeID;
        rowValues[2] = rfq.country;
        rowValues[4] = rfq.city;
        rowValues[6] = rfq.site;
        rowValues[8] = rfq.deliveryTerms;
        wsRFQInformation.addRow(rowValues, 'i');//Row 20 Data

        this.autoAdjustWidth(wsRFQInformation);

    }

    getHeaderAttributes(workbook: Workbook, rfqHeaderAttributes) {
        let wsHeaderAttributes = workbook.addWorksheet('Header - Attributes');
        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'List Title';
        rowValues[2] = 'List Name';
        rowValues[3] = 'Attribute Name';

        const headerRow = wsHeaderAttributes.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderAttributes) {
            for (var i = 0; i < rfqHeaderAttributes.length; i++) {
                rowValues = [];
                rowValues[0] = rfqHeaderAttributes[i].mixName;
                rowValues[1] = rfqHeaderAttributes[i].title;
                rowValues[2] = rfqHeaderAttributes[i].name;
                rowValues[3] = rfqHeaderAttributes[i].attributeName;
                const dataRow = wsHeaderAttributes.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderAttributes);
    }

    getHeaderCF(workbook: Workbook, rfqHeaderCF) {
        let wsHeaderCF = workbook.addWorksheet('Header - Cost factors');
        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Cost Factor List';
        rowValues[2] = 'Cost Factor Name';
        rowValues[3] = 'Description';

        const headerRow = wsHeaderCF.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderCF) {
            for (var i = 0; i < rfqHeaderCF.length; i++) {
                rowValues = [];
                rowValues[0] = rfqHeaderCF[i].mixName;
                rowValues[1] = rfqHeaderCF[i].name;
                rowValues[2] = rfqHeaderCF[i].costFactorName;
                rowValues[3] = rfqHeaderCF[i].title;
                const dataRow = wsHeaderCF.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderCF);

    }

    getHeaderPS(workbook: Workbook, rfqHeaderPS) {
        let wsHeaderPS = workbook.addWorksheet('Header - Payment Schedules');
        var totalValue = 0;
        if (rfqHeaderPS) {
            for (var i = 0; i < rfqHeaderPS.length; i++) {

                if (rfqHeaderPS[i].releaseValue) {
                    totalValue = totalValue + parseFloat(rfqHeaderPS[i].releaseValue);
                }
            }
        }
        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = '';
        rowValues[2] = 'Total Value';
        rowValues[3] = totalValue;
        wsHeaderPS.addRow(rowValues, 'i');//Total Value ROW
        wsHeaderPS.addRow([]);//EMpty Row

        rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Pay Sched No';
        rowValues[2] = 'Schedule Line Description';
        rowValues[3] = 'Sched Line Type';
        rowValues[4] = 'Down Payment Type';
        rowValues[5] = 'Work %';
        rowValues[6] = 'Payment %';
        rowValues[7] = 'Retention %';
        rowValues[8] = 'Release % ';
        rowValues[9] = 'Release Value';
        rowValues[10] = 'Due Date';

        const headerRow = wsHeaderPS.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderPS) {
            for (var i = 0; i < rfqHeaderPS.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqHeaderPS[i].payScheduleNo;
                rowValues[2] = rfqHeaderPS[i].description;
                rowValues[3] = rfqHeaderPS[i].scheduleLineType;
                rowValues[4] = rfqHeaderPS[i].downPaymentType;
                rowValues[5] = rfqHeaderPS[i].workPercentage;
                rowValues[6] = rfqHeaderPS[i].paymentPercentage;
                rowValues[7] = rfqHeaderPS[i].retentionPercentage;
                rowValues[8] = rfqHeaderPS[i].releasePercentage;
                rowValues[9] = rfqHeaderPS[i].releaseValue;
                rowValues[10] = rfqHeaderPS[i].dueDate;
                const dataRow = wsHeaderPS.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderPS);

    }

    getHeaderTC(workbook: Workbook, rfqHeaderTC) {
        let wsHeaderTC = workbook.addWorksheet('Header - Terms & Conditions');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'No';
        rowValues[2] = 'Name';
        rowValues[3] = 'Input Type';
        rowValues[4] = 'Preview';
        rowValues[5] = 'Type';
        rowValues[6] = 'Editable';
        rowValues[7] = 'Default';
        rowValues[8] = 'Before Quote';
        rowValues[9] = 'End Quote';

        const headerRow = wsHeaderTC.addRow(rowValues, 'i');//Row 1
        if (wsHeaderTC) {
            for (var i = 0; i < rfqHeaderTC.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqHeaderTC[i].srNo;
                rowValues[2] = rfqHeaderTC[i].name;
                rowValues[3] = rfqHeaderTC[i].inputType;
                rowValues[4] = 'Preview';
                rowValues[5] = rfqHeaderTC[i].type;
                rowValues[6] = rfqHeaderTC[i].editable;
                rowValues[7] = rfqHeaderTC[i].isDefault;
                rowValues[8] = rfqHeaderTC[i].beforeQuote;
                rowValues[9] = rfqHeaderTC[i].endQuote;
                const dataRow = wsHeaderTC.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderTC);

    }

    getHeaderAt(workbook: Workbook, rfqHeaderAt) {
        let wsHeaderAt = workbook.addWorksheet('Header - Attachments');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Attach No';
        rowValues[2] = 'Title';
        rowValues[3] = 'File Name';
        rowValues[4] = 'Attachment';
        rowValues[5] = 'Document Class';
        rowValues[6] = 'Reference';
        rowValues[7] = 'Visibility to Suppliers';
        rowValues[8] = 'Type';

        const headerRow = wsHeaderAt.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderAt) {
            for (var i = 0; i < rfqHeaderAt.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqHeaderAt[i].srNo;
                rowValues[2] = rfqHeaderAt[i].title;
                rowValues[3] = rfqHeaderAt[i].fileName;
                rowValues[4] = rfqHeaderAt[i].attachment;
                rowValues[5] = rfqHeaderAt[i].documentClass;
                rowValues[6] = rfqHeaderAt[i].prReferenceNo;
                rowValues[7] = rfqHeaderAt[i].visibleToSuppliers;
                rowValues[8] = rfqHeaderAt[i].type;

                const dataRow = wsHeaderAt.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderAt);
    }

    getHeaderDT(workbook: Workbook, rfqHeaderDT) {
        let wsHeaderDT = workbook.addWorksheet('Header - Document Text');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Doc Text No';
        rowValues[2] = 'Output Type';
        rowValues[3] = 'Document Text';
        rowValues[4] = 'Type';
        rowValues[5] = 'Visibility to Suppliers';

        const headerRow = wsHeaderDT.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderDT) {
            for (var i = 0; i < rfqHeaderDT.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqHeaderDT[i].srNo;
                rowValues[2] = rfqHeaderDT[i].outputType;
                rowValues[3] = rfqHeaderDT[i].phraseID;
                rowValues[4] = rfqHeaderDT[i].type;
                rowValues[5] = rfqHeaderDT[i].visibleToSuppliers;

                const dataRow = wsHeaderDT.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderDT);
    }


    getHeaderNo(workbook: Workbook, rfqHeaderNotes) {
        let wsHeaderNote = workbook.addWorksheet('Header - Notes');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Note No';
        rowValues[2] = 'Notes';
        rowValues[3] = 'Type';
        rowValues[4] = 'Visibility to Suppliers';

        const headerRow = wsHeaderNote.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderNotes) {
            for (var i = 0; i < rfqHeaderNotes.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqHeaderNotes[i].srNo;
                rowValues[2] = rfqHeaderNotes[i].description;
                rowValues[3] = rfqHeaderNotes[i].type;
                rowValues[4] = rfqHeaderNotes[i].visibleToSuppliers;

                const dataRow = wsHeaderNote.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderNote);

    }

    getHeaderDel(workbook: Workbook, rfqHeaderDel) {
        let wsHeaderDel = workbook.addWorksheet('Header - Deliverables');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Milestone #';
        rowValues[2] = 'Milestone Name';
        rowValues[3] = 'Deliverables Description';
        rowValues[4] = 'Notes';
        rowValues[5] = 'Attachment';
        rowValues[6] = 'Progress % of Milestone';
        rowValues[7] = 'Accumulated Completion % of Milestone';
        rowValues[8] = 'Begin Date';
        rowValues[9] = 'Visibility to Supplier';

        const headerRow = wsHeaderDel.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderDel) {
            for (var i = 0; i < rfqHeaderDel.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqHeaderDel[i].mileStoneNo;
                rowValues[2] = rfqHeaderDel[i].name;
                rowValues[3] = rfqHeaderDel[i].description;
                rowValues[4] = 'Notes';
                rowValues[5] = 'Attachment';
                rowValues[6] = rfqHeaderDel[i].progressPercentageMilestone;
                rowValues[7] = rfqHeaderDel[i].accumulatedCompletion;
                rowValues[8] = rfqHeaderDel[i].beginDate;
                rowValues[9] = rfqHeaderDel[i].visibleToSuppliers;

                const dataRow = wsHeaderDel.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderDel);

    }

    getHeaderSF(workbook: Workbook, rfqHeaderSF) {
        let wsHeaderSF = workbook.addWorksheet('Header - Survey Form');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Template Name';
        rowValues[2] = 'Survey Question';
        rowValues[3] = 'Description';

        const headerRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
        if (rfqHeaderSF) {
            for (var i = 0; i < rfqHeaderSF.length; i++) {
                rowValues = [];
                rowValues[0] = rfqHeaderSF[i].mixName;
                rowValues[1] = rfqHeaderSF[i].templateName;
                rowValues[2] = rfqHeaderSF[i].surveyQuestionName;
                rowValues[3] = rfqHeaderSF[i].description;

                const dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderSF);

    }

    getSupplier(workbook: Workbook, rfqSuppliers) {
        let wsHeaderSF = workbook.addWorksheet('Suppliers');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Supplier ID';
        rowValues[2] = 'Name';
        rowValues[3] = 'Invited Date & Time';
        rowValues[4] = 'Supplier Contact';
        rowValues[5] = 'Email ID';
        rowValues[6] = 'Currencies';
        rowValues[7] = 'Status';

        const headerRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
        if (rfqSuppliers) {
            for (var i = 0; i < rfqSuppliers.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqSuppliers[i].ifsSupplierId;
                rowValues[2] = rfqSuppliers[i].supplierName;
                rowValues[3] = rfqSuppliers[i].invitationDate;
                rowValues[4] = rfqSuppliers[i].supplierContactName;
                rowValues[5] = rfqSuppliers[i].email;
                rowValues[6] = rfqSuppliers[i].currencys;
                rowValues[7] = rfqSuppliers[i].supplierStatus;

                const dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderSF);

    }

    getCollaborationTeam(workbook: Workbook, rfqCollaborationTeamAccess) {
        let wsHeaderSF = workbook.addWorksheet('Collaboration Team');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'User Name';
        rowValues[2] = 'RFX Role';
        rowValues[3] = 'Substitute Name';
        rowValues[4] = 'Access level';
        rowValues[5] = 'Pages with Access';
        rowValues[6] = 'Team Name';
        rowValues[7] = 'Team Description';

        const headerRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
        if (rfqCollaborationTeamAccess) {
            for (var i = 0; i < rfqCollaborationTeamAccess.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqCollaborationTeamAccess[i].userName;
                rowValues[2] = rfqCollaborationTeamAccess[i].rfxRole;
                rowValues[3] = rfqCollaborationTeamAccess[i].substituteName;
                rowValues[4] = rfqCollaborationTeamAccess[i].accessLevel;
                rowValues[5] = rfqCollaborationTeamAccess[i].pageWithAccess;
                rowValues[6] = rfqCollaborationTeamAccess[i].teamName;
                rowValues[7] = rfqCollaborationTeamAccess[i].teamDescription;


                const dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsHeaderSF);
    }

    getRules(workbook: Workbook, rfqHeaderRules, rfqLineRules) {

        let wsHeaderSF = workbook.addWorksheet('Rules');

        var rowValues = [];
        rowValues[0] = '';
        rowValues[3] = 'RFX Header';
        rowValues[7] = 'RFX Lines';
        let dataRowHeader = wsHeaderSF.addRow(rowValues, 'i');//First Header

        wsHeaderSF.mergeCells('D1:F1');
        wsHeaderSF.mergeCells('H1:J1');
        wsHeaderSF.getCell('D1').alignment = { vertical: 'middle', horizontal: 'center' };
        wsHeaderSF.getCell('H1').alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues = [];
        rowValues[0] = ''; rowValues[1] = ''; rowValues[2] = '';
        rowValues[3] = 'Response Rule';
        rowValues[4] = 'Technical';
        rowValues[5] = 'Commercial';
        rowValues[6] = '';
        rowValues[7] = 'Response Rule';
        rowValues[8] = 'Technical';
        rowValues[9] = 'Commercial';
        const dataRowLines = wsHeaderSF.addRow(rowValues, 'i');//Second Header

        var dataRowIndex = 0;
        if (rfqHeaderRules) {
            for (var i = 0; i < rfqHeaderRules.length; i++) {

                rowValues = [];
                rowValues[0] = ''; rowValues[1] = ''; rowValues[2] = '';
                rowValues[3] = rfqHeaderRules[i].lookUpName;
                rowValues[4] = rfqHeaderRules[i].technical;
                rowValues[5] = rfqHeaderRules[i].commercial;
                const dataRowLines1 = wsHeaderSF.addRow(rowValues, 'i');//Second Header
                if (i == 0) {
                    dataRowIndex = dataRowLines1.number;
                }
            }
        }

        if (rfqLineRules) {
            for (var i = 0; i < rfqLineRules.length; i++) {

                var existRow = wsHeaderSF.getRow(dataRowIndex);
                if (existRow) {

                    existRow.getCell(8).value = rfqLineRules[i].lookUpName;
                    existRow.getCell(9).value = rfqLineRules[i].technical;
                    existRow.getCell(10).value = rfqLineRules[i].commercial;
                }
                dataRowIndex = dataRowIndex + 1;

            }
        }

        this.autoAdjustWidth(wsHeaderSF);

    }

    getLineScoring(rfqScore, headerName) {
        var score = null;
        for (var i = 0; i < rfqScore.length; i++) {
            if (rfqScore[i].headerName == headerName && rfqScore[i].isheader == 0) {
                score = rfqScore[i];
                break;
            }
        }
        return score;
    }

    getScorings(workbook: Workbook, rfqscore) {

        let wsHeaderSF = workbook.addWorksheet('Scoring');
        var rowValues = [];
        rowValues[0] = 'Header Tabs';
        rowValues[4] = 'Line Tabs';
        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = 1;
        wsHeaderSF.mergeCells('A' + this.rowcount + ':C' + this.rowcount);
        wsHeaderSF.getCell('A' + this.rowcount + ':C' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        wsHeaderSF.mergeCells('E' + this.rowcount + ':G' + this.rowcount);
        wsHeaderSF.getCell('E' + this.rowcount + ':G' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        var rowValues = [];
        rowValues[0] = 'Description';
        rowValues[1] = 'Weights in Points';
        rowValues[2] = 'Weights in %';
        rowValues[4] = 'Description';
        rowValues[5] = 'Weights in Points';
        rowValues[6] = 'Weights in %';

        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;
        if (rfqscore.table22) {
            for (var i = 0; i < rfqscore.table22.length; i++) {
                rowValues = [];

                if (rfqscore.table22[i].isheader == 1) {
                    rowValues[0] = rfqscore.table22[i].headerName;
                    rowValues[1] = rfqscore.table22[i].weightInPoints;
                    rowValues[2] = rfqscore.table22[i].weightInPercentage;
                    var lineScore = this.getLineScoring(rfqscore.table22, rfqscore.table22[i].headerName);
                    if (lineScore) {
                        rowValues[3] = null;
                        rowValues[4] = lineScore.headerName;
                        rowValues[5] = lineScore.weightInPoints;
                        rowValues[6] = lineScore.weightInPercentage;
                    }
                    let dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
                    this.rowcount = this.rowcount + 1;
                }
            }
        }

        rowValues = [];
        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;

        rowValues = [];
        rowValues[0] = 'Line Items';
        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;

        wsHeaderSF.mergeCells('A' + this.rowcount + ':E' + this.rowcount);
        wsHeaderSF.getCell('A' + this.rowcount + ':E' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues = [];
        rowValues[0] = 'Line No';
        rowValues[1] = 'Part ID';
        rowValues[2] = 'Part Description';
        rowValues[3] = 'Weights in Points';
        rowValues[4] = 'Weights in %';

        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;

        if (rfqscore.table23) {
            for (var i = 0; i < rfqscore.table23.length; i++) {
                rowValues = [];
                rowValues[0] = rfqscore.table23[i].lineNo;
                rowValues[1] = rfqscore.table23[i].partID;
                rowValues[2] = rfqscore.table23[i].partDescription;
                rowValues[3] = rfqscore.table23[i].weightInPoints;
                rowValues[4] = rfqscore.table23[i].weightInPercentage;
                const dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;
            }
        }

        wsHeaderSF.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        wsHeaderSF.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues = [];
        rowValues[0] = 'Header Tabs';
        rowValues[1] = null;
        rowValues[2] = null;
        rowValues[3] = null;
        rowValues[4] = null;
        rowValues[5] = null;
        rowValues[6] = 'Line Tabs';
        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;
        wsHeaderSF.mergeCells('A' + this.rowcount + ':D' + this.rowcount);
        wsHeaderSF.getCell('A' + this.rowcount + ':D' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };
        wsHeaderSF.mergeCells('F' + this.rowcount + ':I' + this.rowcount);
        wsHeaderSF.getCell('F' + this.rowcount + ':I' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues = [];
        rowValues[0] = 'Description';
        rowValues[1] = 'Weights in Points';
        rowValues[2] = 'Weights in %';
        rowValues[3] = 'Knockout Score';
        rowValues[4] = '';
        rowValues[5] = 'Description';
        rowValues[6] = 'Weights in Points';
        rowValues[7] = 'Weights in %';
        rowValues[8] = 'Knockout Score';

        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;

        if (rfqscore.table24) {

            for (var i = 0; i < rfqscore.table24.length; i++) {
                rowValues = [];
                if (rfqscore.table24[i].isheader == 1) {
                    rowValues[0] = rfqscore.table24[i].headerName;
                    rowValues[1] = rfqscore.table24[i].points;
                    rowValues[2] = rfqscore.table24[i].percentatge;
                    rowValues[3] = rfqscore.table24[i].knockOutScore;
                    var lineScore = this.getLineScoring(rfqscore.table24, rfqscore.table24[i].headerName);
                    if (lineScore) {
                        rowValues[4] = null;
                        rowValues[5] = lineScore.headerName;
                        rowValues[6] = lineScore.points;
                        rowValues[7] = lineScore.percentatge;
                        rowValues[8] = lineScore.knockOutScore;
                    }
                    const dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
                    this.rowcount = this.rowcount + 1;
                }
            }
        }

        wsHeaderSF.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;

        rowValues = [];
        rowValues[0] = 'Line Items';
        rowValues[1] = null;
        rowValues[2] = null;
        rowValues[3] = null;

        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;
        debugger;
        wsHeaderSF.mergeCells('A' + this.rowcount + ':D' + this.rowcount);
        wsHeaderSF.getCell('A' + this.rowcount + ':D' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues = [];
        rowValues[0] = 'Description';
        rowValues[1] = 'Weights in Points';
        rowValues[2] = 'Weights in %';
        rowValues[3] = 'Knockout Score';

        wsHeaderSF.addRow(rowValues);//Empty Row
        this.rowcount = this.rowcount + 1;

        if (rfqscore.table25) {
            for (var i = 0; i < rfqscore.table25.length; i++) {
                rowValues = [];
                rowValues[0] = rfqscore.table25[i].description;
                rowValues[1] = rfqscore.table25[i].points;
                rowValues[2] = rfqscore.table25[i].percentatge;
                rowValues[3] = rfqscore.table25[i].knockOutScore;
                const dataRow = wsHeaderSF.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;
            }

        }
        this.autoAdjustWidth(wsHeaderSF);
    }


    getLineAttribute(wsPartLine: Worksheet, rfqLineAttributes) {
        var rowValues = [];
        // let wsHeaderPL = workbook.addWorksheet('Header - Survey Form');
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues[2] = 'Attributes';
        wsPartLine.addRow(rowValues, 'i');
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;

        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };
        rowValues = [];
        rowValues[1] = '';
        rowValues[2] = 'List Title';
        rowValues[3] = 'List Name';
        rowValues[4] = 'Attribute Name';

        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;
        if (rfqLineAttributes) {
            for (var i = 0; i < rfqLineAttributes.length; i++) {
                rowValues = [];
                rowValues[1] = rfqLineAttributes[i].mixName;
                rowValues[2] = rfqLineAttributes[i].title;
                rowValues[3] = rfqLineAttributes[i].name;
                rowValues[4] = rfqLineAttributes[i].attributeName;
                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;
            }
        }
        this.autoAdjustWidth(wsPartLine);
        return wsPartLine;
    }

    getLineCF(wsPartLine: Worksheet, rfqLineCF) {
        var rowValues = [];
        // let wsHeaderPL = workbook.addWorksheet('Header - Survey Form');
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues[2] = 'Cost Factors';
        wsPartLine.addRow(rowValues, 'i');
        this.rowcount = this.rowcount + 1;

        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;


        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };
        rowValues[1] = '';
        rowValues[2] = 'Cost Factor List';
        rowValues[3] = 'Cost Factor Name';
        rowValues[4] = 'Description';

        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;

        if (rfqLineCF) {
            for (var i = 0; i < rfqLineCF.length; i++) {
                rowValues = [];
                rowValues[1] = rfqLineCF[i].mixName;
                rowValues[2] = rfqLineCF[i].name;
                rowValues[3] = rfqLineCF[i].costFactorName;
                rowValues[4] = rfqLineCF[i].title;
                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;

            }
        }

        return wsPartLine;
    }

    getLinePS(wsPartLine: Worksheet, rfqLinePS) {
        // var totalValue=0;
        // if(rfqLinePS)
        // {
        //     for (var i = 0; i < rfqLinePS.length; i++) {

        //         if (rfqLinePS[i].releaseValue) {
        //             totalValue = totalValue + parseFloat(rfqLinePS[i].releaseValue);
        //         }


        //     }
        // }
        // var rowValues = [];
        // rowValues[0] = '';
        // rowValues[1] = '';
        // rowValues[2] = 'Total Value';
        // rowValues[3] = totalValue;
        // wsPartLine.addRow(rowValues,'i');//Total Value ROW
        // wsPartLine.addRow([]);//EMpty Row
        var rowValues = [];
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues[2] = 'Payment Schedules';
        wsPartLine.addRow(rowValues, 'i');
        this.rowcount = this.rowcount + 1;

        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;


        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };
        rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Pay Sched No';
        rowValues[2] = 'Schedule Line Description';
        rowValues[3] = 'Sched Line Type';
        rowValues[4] = 'Down Payment Type';
        rowValues[5] = 'Work %';
        rowValues[6] = 'Payment %';
        rowValues[7] = 'Retention %';
        rowValues[8] = 'Release % ';
        rowValues[9] = 'Release Value';
        rowValues[10] = 'Due Date';

        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;

        if (rfqLinePS) {
            for (var i = 0; i < rfqLinePS.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqLinePS[i].payScheduleNo;
                rowValues[2] = rfqLinePS[i].description;
                rowValues[3] = rfqLinePS[i].scheduleLineType;
                rowValues[4] = rfqLinePS[i].downPaymentType;
                rowValues[5] = rfqLinePS[i].work;
                rowValues[6] = rfqLinePS[i].payment;
                rowValues[7] = rfqLinePS[i].retention;
                rowValues[8] = rfqLinePS[i].release;
                rowValues[9] = rfqLinePS[i].releaseValue;
                rowValues[10] = rfqLinePS[i].dueDate;
                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;
            }
        }

        return wsPartLine;
    }


    getLineAtC(wsPartLine: Worksheet, rfqLineAttachments) {
        // let wsHeaderAt = wsPartLine.addWorksheet('Header - Attachments');
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        var rowValues = [];
        rowValues[2] = 'Attachments';
        wsPartLine.addRow(rowValues, 'i');
        this.rowcount = this.rowcount + 1;

        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;

        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues = [];
        rowValues[0] = '';
        rowValues[1] = 'Attach No';
        rowValues[2] = 'Title';
        rowValues[3] = 'File Name';
        rowValues[4] = 'Attachment';
        rowValues[5] = 'Document Class';
        rowValues[6] = 'Reference';
        rowValues[7] = 'Visibility to Suppliers';
        rowValues[8] = 'Type';
        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;

        if (rfqLineAttachments) {
            for (var i = 0; i < rfqLineAttachments.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqLineAttachments[i].srNo;
                rowValues[2] = rfqLineAttachments[i].title;
                rowValues[3] = rfqLineAttachments[i].fileName;
                rowValues[4] = rfqLineAttachments[i].attachment;
                rowValues[5] = rfqLineAttachments[i].documentClass;
                rowValues[6] = rfqLineAttachments[i].prReferenceNo;
                rowValues[7] = rfqLineAttachments[i].visibleToSuppliers;
                rowValues[8] = rfqLineAttachments[i].type;

                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;
            }
        }
        return wsPartLine;
    }

    getLineDT(wsPartLine: Worksheet, rfqLineDT) {
        var rowValues = [];
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues[2] = 'Document Text';
        wsPartLine.addRow(rowValues, 'i');
        this.rowcount = this.rowcount + 1;

        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;


        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues[0] = '';
        rowValues[1] = 'Doc Text No';
        rowValues[2] = 'Output Type';
        rowValues[3] = 'Document Text';
        rowValues[4] = 'Type';
        rowValues[5] = 'Visibility to Suppliers';
        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;

        if (rfqLineDT) {
            for (var i = 0; i < rfqLineDT.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqLineDT[i].srNo;
                rowValues[2] = rfqLineDT[i].outputType;
                rowValues[3] = rfqLineDT[i].phraseID;
                rowValues[4] = rfqLineDT[i].type;
                rowValues[5] = rfqLineDT[i].visibleToSuppliers;
                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;

            }
        }
        return wsPartLine;
    }

    getLineNotes(wsPartLine: Worksheet, rfqLineNotes) {

        var rowValues = [];
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues[2] = 'Notes';
        wsPartLine.addRow(rowValues, 'i');
        this.rowcount = this.rowcount + 1;

        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;


        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues[0] = '';
        rowValues[1] = 'Note No';
        rowValues[2] = 'Notes';
        rowValues[3] = 'Type';
        rowValues[4] = 'Visibility to Suppliers';
        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;

        if (rfqLineNotes) {
            for (var i = 0; i < rfqLineNotes.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqLineNotes[i].srNo;
                rowValues[2] = rfqLineNotes[i].description;
                rowValues[3] = rfqLineNotes[i].type;
                rowValues[4] = rfqLineNotes[i].visibleToSuppliers;
                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;

            }
        }
        return wsPartLine;;
    }

    getLineDel(wsPartLine: Worksheet, rfqLineDels) {

        var rowValues = [];
        // let wsHeaderPL = workbook.addWorksheet('Header - Survey Form');
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;
        rowValues[2] = 'Deliverables';
        var rowFormatColor = wsPartLine.addRow(rowValues, 'i');
        rowFormatColor.getCell(1).fill = { type: 'pattern', pattern: 'none', fgColor: { argb: 'cccccc' }, bgColor: { argb: 'd3d3d3' } };

        this.rowcount = this.rowcount + 1;
        wsPartLine.addRow([]);//Empty Row
        this.rowcount = this.rowcount + 1;

        wsPartLine.mergeCells('B' + this.rowcount + ':M' + this.rowcount);
        wsPartLine.getCell('B' + this.rowcount).alignment = { vertical: 'middle', horizontal: 'center' };

        rowValues[0] = '';
        rowValues[1] = 'Milestone #';
        rowValues[2] = 'Milestone Name';
        rowValues[3] = 'Deliverables Description';
        rowValues[4] = 'Notes';
        rowValues[5] = 'Attachment';
        rowValues[6] = 'Progress % of Milestone';
        rowValues[7] = 'Accumulated Completion % of Milestone';
        rowValues[8] = 'Begin Date';
        rowValues[9] = 'Visibility to Supplier';

        const headerRow = wsPartLine.addRow(rowValues, 'i');//Row 1
        this.rowcount = this.rowcount + 1;

        if (rfqLineDels) {
            for (var i = 0; i < rfqLineDels.length; i++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = rfqLineDels[i].mileStoneNo;
                rowValues[2] = rfqLineDels[i].name;
                rowValues[3] = rfqLineDels[i].description;
                rowValues[4] = 'Notes';
                rowValues[5] = 'Attachment';
                rowValues[6] = rfqLineDels[i].progressPercentageMilestone;
                rowValues[7] = rfqLineDels[i].accumulatedCompletion;
                rowValues[8] = rfqLineDels[i].beginDate;
                rowValues[9] = rfqLineDels[i].visibleToSuppliers;
                const dataRow = wsPartLine.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;

            }
        }
        return wsPartLine;
    }

    rowcount = 1;
    getPartLines(workbook: Workbook, rfq) {
        this.rowcount = 1;
        let wsHeaderPL = workbook.addWorksheet('Lines');

        var rowValues = [];

        const headerRow = wsHeaderPL.addRow(rowValues, 'i');//Row 1

        if (rfq.table10) {
            for (var k = 0; k < rfq.table10.length; k++) {
                rowValues = [];
                rowValues[0] = '';
                rowValues[1] = 'Line No';
                rowValues[2] = 'PR No';
                rowValues[3] = 'Part ID';
                rowValues[4] = 'Sub Project Code';
                rowValues[5] = 'Activity';
                rowValues[6] = 'Part Description';
                rowValues[7] = 'Quantity';
                rowValues[8] = 'UoM';
                rowValues[9] = 'Need by Date';
                rowValues[10] = 'IFS Reference Price';
                rowValues[11] = 'Target Price';
                rowValues[12] = 'Show Prices';

                const headerRow = wsHeaderPL.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;

                rowValues[0] = '';
                rowValues[1] = rfq.table10[k].lineNumber;
                rowValues[2] = rfq.table10[k].prNumber;
                rowValues[3] = rfq.table10[k].partID;
                rowValues[4] = rfq.table10[k].subProject;
                rowValues[5] = rfq.table10[k].activity;
                rowValues[6] = rfq.table10[k].partDescirption;
                rowValues[7] = rfq.table10[k].purchaseQty;
                rowValues[8] = rfq.table10[k].uoM;
                rowValues[9] = rfq.table10[k].wantedDate;
                rowValues[10] = rfq.table10[k].startPrice;
                rowValues[11] = rfq.table10[k].targetPrice;
                rowValues[12] = rfq.table10[k].showPriceToSuppliers;

                let dataRow = wsHeaderPL.addRow(rowValues, 'i');//Row 1
                this.rowcount = this.rowcount + 1;

                wsHeaderPL = this.getLineAttribute(wsHeaderPL, rfq.table11);
                wsHeaderPL = this.getLineCF(wsHeaderPL, rfq.table12)
                wsHeaderPL = this.getLinePS(wsHeaderPL, rfq.table13)
                wsHeaderPL = this.getLineAtC(wsHeaderPL, rfq.table14)
                wsHeaderPL = this.getLineDT(wsHeaderPL, rfq.table15)
                wsHeaderPL = this.getLineNotes(wsHeaderPL, rfq.table16)
                wsHeaderPL = this.getLineDel(wsHeaderPL, rfq.table17)

                wsHeaderPL.addRow([]);//Row 1
                this.rowcount = this.rowcount + 2;

            }
        }
        this.autoAdjustWidth(wsHeaderPL);

    }

    autoAdjustWidth(worksheet: any) {
        // column size adjusted
        worksheet.columns.forEach((column) => {
            let maxColumnLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                maxColumnLength = Math.max(
                    maxColumnLength,
                    10,
                    cell.value ? cell.value.toString().length : 0
                );
            });
            column.width = maxColumnLength + 2;
        });
    }
    openChat() {
        this.chatComponentRef.openSupplierPanel();
    }

    exportHistoryToExcel() {
        let workbook = new Workbook();


        let wsRFQInformation = workbook.addWorksheet('History');
        var rowValues = [];
        rowValues[0] = 'Sr No';
        rowValues[1] = 'Rev No';
        rowValues[2] = 'Action By';
        rowValues[3] = 'Action';
        rowValues[4] = 'Status';
        rowValues[5] = 'Date-Timestamp';
        const newRow1 = wsRFQInformation.addRow(rowValues, 'i');//Row 1


        rowValues = [];


        wsRFQInformation.addRow(rowValues, 'i');//Row 2 Data

        if (this.rfxHistoryViewModel) {
            for (var i = 0; i < this.rfxHistoryViewModel.length; i++) {
                rowValues = [];
                rowValues[0] = this.rfxHistoryViewModel[i].srNo;
                rowValues[1] = this.rfxHistoryViewModel[i].revNo;
                rowValues[2] = this.rfxHistoryViewModel[i].employeeName;
                rowValues[3] = this.rfxHistoryViewModel[i].actionName;
                rowValues[4] = this.rfxHistoryViewModel[i].status;
                rowValues[5] = this.rfxHistoryViewModel[i].creationDate;
                const dataRow = wsRFQInformation.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsRFQInformation);

        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'RFQHistory.xlsx');
        });


    }
    approveRejectWidgetData: any = [];
    approveRejectTableData: any = [];
    actualApproveRejectWidgetData: any = [];
    actualApproveRejectTableData: any = [];
    completedDivCss = "flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full bg-gray-100";
    completedIconCss = "icon-size-7 text-gray-400";
    getApproveRejectWidgetData() {
        const refference2 = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
       
        this.rfqService.getApproveRejectWidgetData(this.rfqId ? this.rfqId : '00000000-0000-0000-0000-000000000000').subscribe(result => {
            refference2.close();
            this.approveRejectWidgetData = result.model.table;
            this.approveRejectTableData = result.model.table1;

            this.actualApproveRejectWidgetData = result.model.table;
            this.actualApproveRejectTableData = result.model.table1;

            this.approveRejectWidgetData = this.actualApproveRejectWidgetData.filter(element => {
                return element.rfxType.indexOf(this.rfqModel.approvalType) !== -1;
            });

            this.approveRejectTableData = this.actualApproveRejectTableData.filter(element => {
                return element.rfxType.indexOf(this.rfqModel.approvalType) !== -1;
            });

             var approved = this.approveRejectWidgetData.filter(element => {
                return element.level == "Center" && element.status == "Approved";
            })
            var total = this.approveRejectWidgetData.filter(element => {
                return element.level == "Center";
            })
            if (approved && total) {

                if (approved.length > 0 && approved.length == total.length) {
                    this.completedDivCss = "flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full bg-primary";
                    this.completedIconCss = "icon-size-7 text-white";
                }

            }
            this._changeDetectorRef.detectChanges();

        });
    }
    public exportApprovalToExcel() {
        let workbook = new Workbook();


        let wsRFQInformation = workbook.addWorksheet('Approval History');
        var rowValues = [];
        rowValues[0] = 'Step No';
        rowValues[1] = 'Autharizer ID';
        rowValues[2] = 'Autharizer Name';
        rowValues[3] = 'Email Address';
        rowValues[4] = 'Approval Status';
        rowValues[5] = 'Authorization Routing Template';
        rowValues[6] = 'Justification';

        const newRow1 = wsRFQInformation.addRow(rowValues, 'i');//Row 1


        rowValues = [];


        wsRFQInformation.addRow(rowValues, 'i');//Row 2 Data

        if (this.approveRejectTableData) {
            for (var i = 0; i < this.approveRejectTableData.length; i++) {
                rowValues = [];
                rowValues[0] = this.approveRejectTableData[i].stepNo;
                rowValues[1] = this.approveRejectTableData[i].autharizerID;
                rowValues[2] = this.approveRejectTableData[i].autharizerName;
                rowValues[3] = this.approveRejectTableData[i].employeeEmail;
                rowValues[4] = this.approveRejectTableData[i].approvalStatus;
                rowValues[5] = this.approveRejectTableData[i].authorizationRoutingTemplate;
                rowValues[6] = this.approveRejectTableData[i].reason;
                const dataRow = wsRFQInformation.addRow(rowValues, 'i');//Row 1
            }
        }
        this.autoAdjustWidth(wsRFQInformation);

        workbook.xlsx.writeBuffer().then((data) => {
            let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fs.saveAs(blob, 'ApprovalHistory.xlsx');
        });

    }

    supplierIsChanged(value) {
        this.supplierIsChangedInResponses = false;
        this.supplierIdInResponses = value;
        setTimeout(() => {
            this.supplierIsChangedInResponses = true;
        }, 0)
    }

    public UpdateRFQModel($event) {
        debugger;
this.rfqModel.approvalType=$event.rfqModel.approvalType;
        this.getRFQById(this.rfqId);
        this.fetchRFXHistoryData();
        this.getApproveRejectWidgetData();
    }
    public UpdateRFQIndex(index) {
        debugger;
        this.selectedEvaluationIndex = index.index;
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        localStorage.removeItem('selectedTabIndexRFQ');
        localStorage.removeItem('selectedEvaluationIndexRFQ');
        localStorage.removeItem('selectedTabIndexHeader');
    }
    approvedstring:any="Approved";
    approvalPendingstring:any="Approval Pending";
    
    public UpdateAprovalHistory(rfxType)
    {
        if (rfxType == "TBE") {
            this.approvedstring = "TBE Approved";
            this.approvalPendingstring = "TBE Approval Pending";
        }
        else if (rfxType == "CBE") {
            this.approvedstring = "CBE Approved";
            this.approvalPendingstring = "CBE Approval Pending";
        }
        else if (rfxType == "ROA") {
            this.approvedstring = "Award Approved";
            this.approvalPendingstring = "Award Approval Pending";

        }
        this.approveRejectWidgetData = this.actualApproveRejectWidgetData.filter(element => {
            return element.rfxType.indexOf(rfxType) !== -1;
        });

        this.approveRejectTableData = this.actualApproveRejectTableData.filter(element => {
            return element.rfxType.indexOf(rfxType) !== -1;
        });

         var approved = this.approveRejectWidgetData.filter(element => {
            return element.level == "Center" && element.status == this.approvedstring;
        })
        var total = this.approveRejectWidgetData.filter(element => {
            return element.level == "Center";
        })
        if (approved && total) {

            if (approved.length > 0 && approved.length == total.length) {
                this.completedDivCss = "flex flex-shrink-0 items-center justify-center w-12 h-12 rounded-full bg-primary";
                this.completedIconCss = "icon-size-7 text-white";
            }

        }
        this._changeDetectorRef.detectChanges();

    }
    OpenPOTransfer() {
        this.router.navigateByUrl("/po-info" + "/" + this.rfqId, { state: { Id: this.rfqId } });
    }

    public createInviteSupplierSRM(eSupplier) {
        var CreatedDate = new Date().toISOString();
        eSupplier.forEach(i=>{
            var CreatedTime = new Date().toTimeString();
            var date_time_split = CreatedDate.split("T");
            var date = date_time_split[0];
    
            var time_split = CreatedTime.split(" ");
            var time = time_split[0] + "." + new Date().getMilliseconds();
    
            var inviteSupplier: InviteSupplier = new InviteSupplier();
            inviteSupplier.invite_supplier_name = i.supplierName;
            inviteSupplier.email = i.email;
            inviteSupplier.last_name = "rr";
            inviteSupplier.justification = "";
            inviteSupplier.title = "Ms";
            inviteSupplier.first_name = "rtrt";
            inviteSupplier.create_date_time = date + " " + time;
            inviteSupplier.invite_by = localStorage.getItem("username");
            inviteSupplier.invite_by_role = localStorage.getItem("userrole");
            inviteSupplier.invite_by_email = localStorage.getItem("useremail");
            inviteSupplier.supplier_type = ["ET"];
            this.http.post<any>(environment.nodeurl + '/api/supplier/invite', inviteSupplier).subscribe(async data => {
               
                if (data > 0) {
                   
                    var count = 0;
                    inviteSupplier.invite_supplier_id = data;

                    
                   
                        this.http.get<any>(environment.nodeurl + '/api/email?email=' + inviteSupplier.email + '&supplierid=' + data + '&content='+inviteSupplier.justification+'&category=inv').subscribe(async data => {
                             if (data) {
                                
                                /* var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                                deleteSupplier.supplier_name = this.firstFormGroup.value.supplierNameFormControl.trim();
                                deleteSupplier.supplier_email = this.firstFormGroup.value.emailFormControl.trim();
                                deleteSupplier.cr_no = "0";
                                deleteSupplier.type = "invite";

                                this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                    
                                }); */
                            } 
                        })
                    
                }
            })
        })

     
       
        
       
       
    }

    OpenURL(url, row) {
        if(row.status=="Follow on Event"){
        localStorage.setItem('selectedTabIndexRFQ', "0");
        this.router.navigateByUrl(url + "/" + row.followon, { state: { Id: row.followon } }); 
        }
      }

      Changebidclosetime(){
        const dialogRef = this.dialog.open(AmendBidCloseOverlayComponent, {
            data: {  'rfqmodel':this.rfqModel },
            disableClose: true
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => {
            if (result ) {
               
               this.getRFQById(this.rfqId);
                
            }
        });
      }
    
    isBidOpened(){
        if(this.rfqModel.statusName=="Bid Open"){
            return true;
        }
        else{
            return false;
        }
    }
}

