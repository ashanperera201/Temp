import { Component, OnInit,Input } from '@angular/core';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatDialog } from '@angular/material/dialog';
import { ScoringService } from 'app/shared/Services/etendering/RFQ/scoring.service';

import {
    AttributeItem,
    Attributes,
    SampleAttribute,
    SupplierResponces,
    CostFactors,
    CostFactorItems,
    CostFactorbySuppliers,
    SupplierResponces1,
    SupplierResponces2,
    SampleCostFactors,
    PaymentSchedule,
    PaymentSchedulebySuppliers,
    Responces1,
    Responces2,
    SamplePaymentSchedule,
    SampleAttachments,
    SampleDocument,
    SampleNotes,
    Attachments,
    AttachmentResponces,
    DocumentResponces,
    NotesResponces,
    Notes,
    Documents,
    SampleDeliverables,
    Deliverables,
    DeliverablesbySuppliers,
    DeliverableResponces2,
    DeliverableResponces1,
    supplierResponses_header,
    supplierResponses_headerData,
    header,
    headerData,
    Lines,
    Lines_Data,
    Information,
    Supplier_Inormation_Data,
    Team_Inormation_Data,
    Rules_RFX_header,
    Rules_Lines_header,
    newTable,
    GeneralRules,
    GeneralRules_Data,
    scoringTables,
    Scoring_Header_Attribute_Data,
    Scoring_Lines_Attribute_Data,
    Scoring_Header_CostFactors_Data,
    Scoring_Header_PaymentShcedule_Data,
    Scoring_Header_Attachment_Data,
    Scoring_Header_Deliverables_Data,
    Scoring_Header_Notes_Data,
    Scoring_Header_Document_Data,
    Scoring_Lines_Deliverables_Data,
    Scoring_Lines_Notes_Data,
    Scoring_Lines_Document_Data,
    Scoring_Lines_Attachment_Data,
    Scoring_Lines_PaymentShcedule_Data,
    Scoring_Lines_CostFactors_Data,
    lineItems,
    lineItems_Data,
    scoringCriteria,
    BidPrice_Data,
    scoringCriteria_Data,
    evaluations,
    Evaluation_Attribute_Data,
    Evaluation_CostFactors_Data,
    Evaluation_PaymentSchedule_Data,
    Evaluation_Attachments_Data,
    Evaluation_Document_Data,
    Evaluation_Notes_Data,
    Evaluation_Deliverables_Data,
    technicalEvaluation_Score,
    // technicalEvaluation_Score_Data,
    totalBID_Data,
    bidDetails,
    summeryComparison_data,
    summeryComparison,
    lineItemAward_data,
    lineItemAward,
    totalAward_data,
    totalAward,
    supplier_chartdata,
    supplier_cost_chartdata,
    supplier_response_chartdata,
    summary_comparison_chartdata,
    awardedSupplier_chartdata,
    totalAward_chartdata,
    supplierResponseDetails,
    lineItemBreakdown,
    lineItemBreakdown_data,
} from './sampledata';
import {
    ApexAxisChartSeries,
    ApexChart,
    ApexDataLabels,
    ApexPlotOptions,
    ApexYAxis,
    ApexLegend,
    ApexStroke,
    ApexXAxis,
    ApexFill,
    ApexTooltip,
    ApexGrid,
    ApexStates,
} from 'ng-apexcharts';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute} from '@angular/router';


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

@Component({
    selector: 'app-export-report',
    templateUrl: './export-report.component.html',
    styleUrls: ['./export-report.component.scss'],
})
export class ExportReportComponent implements OnInit {
    SampleAttribute = {};
    SampleCostFactors = {};
    SamplePaymentSchedule = {};
    SampleAttachments = {};
    SampleDocument = {};
    SampleNotes = {};
    SampleDeliverables = {};
    
    supplier_response_chartdata: {};
    summary_comparison_chartdata: {};
    awardedSupplier_chartdata: {};
    totalAward_chartdata: {};
    supplierResponseDetails:any=[];
    Evaluation_Attribute_Data: [];
    Evaluation_CostFactors_Data: [];
    Evaluation_PaymentSchedule_Data: [];
    Evaluation_Attachments_Data: [];
    Evaluation_Document_Data: [];
    Evaluation_Notes_Data: [];
    Evaluation_Deliverables_Data: [];
    durationInSeconds = 5;
    proceedDownload: boolean = true;
    horizontal: boolean;
    columns: Array<any>;
    displayedColumns: Array<any>;
    dataSource: any;

    columns_Attributes = [
        {
            columnDef: 'title',
            header: 'List Title',
            cell: (element: Attributes) => `${element.title}`,
        },
        {
            columnDef: 'name',
            header: 'List Name',
            cell: (element: Attributes) => `${element.name}`,
        },
        {
            columnDef: 'group',
            header: 'Attribute Group',
            cell: (element: Attributes) => `${element.group}`,
        },
    ];

    columns_AttributeItem = [
        {
            columnDef: 'item',
            header: 'Attribute Item',
            cell: (element: AttributeItem) => `${element.item}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: AttributeItem) => `${element.description}`,
        },
        {
            columnDef: 'value',
            header: 'Expected Value',
            cell: (element: AttributeItem) => `${element.value}`,
        },
    ];

    columns_SupplierResponces = [
        {
            columnDef: 'name',
            header: 'Supplier name',
            cell: (element: SupplierResponces) => `${element.name}`,
        },
        {
            columnDef: 'value',
            header: 'No.',
            cell: (element: SupplierResponces) => `${element.value}`,
        },
        {
            columnDef: 'cost',
            header: 'Name',
            cell: (element: SupplierResponces) => `${element.cost}`,
        },
        {
            columnDef: 'Comments',
            header: 'Weight',
            cell: (element: SupplierResponces) => `${element.Comments}`,
        },
    ];

    displayedColumns_Attributes = this.columns_Attributes.map(
        (c) => c.columnDef
    );
    displayedColumns_AttributeItem = this.columns_AttributeItem.map(
        (c) => c.columnDef
    );
    displayedColumns_SupplierResponces = this.columns_SupplierResponces.map(
        (c) => c.columnDef
    );

    columns_CostFactors = [
        {
            columnDef: 'list',
            header: 'Cost Factor List',
            cell: (element: CostFactors) => `${element.list}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: CostFactors) => `${element.description}`,
        },
    ];

    columns_CostFactorItems = [
        {
            columnDef: 'name',
            header: 'Cost Factor Name',
            cell: (element: CostFactorItems) => `${element.name}`,
        },
        {
            columnDef: 'type',
            header: 'Cost Factor Type',
            cell: (element: CostFactorItems) => `${element.type}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: CostFactorItems) => `${element.description}`,
        },
        {
            columnDef: 'value',
            header: 'Expected Value',
            cell: (element: CostFactorItems) => `${element.value}`,
        },
    ];

    columns_CostFactorbySuppliers = [
        {
            columnDef: 'name',
            header: 'Cost Factor Name',
            cell: (element: CostFactorbySuppliers) => `${element.name}`,
        },
        {
            columnDef: 'type',
            header: 'Cost Factor Type',
            cell: (element: CostFactorbySuppliers) => `${element.type}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: CostFactorbySuppliers) => `${element.description}`,
        },
    ];

    columns_SupplierResponces1 = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: SupplierResponces1) => `${element.name}`,
        },
        {
            columnDef: 'value',
            header: 'Value',
            cell: (element: SupplierResponces1) => `${element.value}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: SupplierResponces1) => `${element.Comments}`,
        },
    ];

    columns_SupplierResponces2 = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: SupplierResponces2) => `${element.name}`,
        },
        {
            columnDef: 'value',
            header: 'Value',
            cell: (element: SupplierResponces2) => `${element.value}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: SupplierResponces2) => `${element.Comments}`,
        },
    ];

    displayedColumns_CostFactors = this.columns_CostFactors.map(
        (c) => c.columnDef
    );
    displayedColumns_CostFactorItems = this.columns_CostFactorItems.map(
        (c) => c.columnDef
    );
    displayedColumns_columns_CostFactorbySuppliers =
        this.columns_CostFactorbySuppliers.map((c) => c.columnDef);
    displayedColumns_SupplierResponces1 = this.columns_SupplierResponces1.map(
        (c) => c.columnDef
    );
    displayedColumns_SupplierResponces2 = this.columns_SupplierResponces2.map(
        (c) => c.columnDef
    );

    columns_PaymentSchedule = [
        {
            columnDef: 'no',
            header: 'Schedule No',
            cell: (element: PaymentSchedule) => `${element.no}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: PaymentSchedule) => `${element.description}`,
        },
        {
            columnDef: 'work',
            header: 'Work %',
            cell: (element: PaymentSchedule) => `${element.work}`,
        },
        {
            columnDef: 'milestone',
            header: 'Milestone No',
            cell: (element: PaymentSchedule) => `${element.milestone}`,
        },
        {
            columnDef: 'payment',
            header: 'Payment %',
            cell: (element: PaymentSchedule) => `${element.payment}`,
        },
        {
            columnDef: 'retention',
            header: 'Retention %',
            cell: (element: PaymentSchedule) => `${element.retention}`,
        },
        {
            columnDef: 'release',
            header: 'Release %',
            cell: (element: PaymentSchedule) => `${element.release}`,
        },
        {
            columnDef: 'value',
            header: 'Release Value',
            cell: (element: PaymentSchedule) => `${element.value}`,
        },
    ];

    columns_PaymentSchedulebySuppliers = [
        {
            columnDef: 'no',
            header: 'Schedule No',
            cell: (element: PaymentSchedulebySuppliers) => `${element.no}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: PaymentSchedulebySuppliers) =>
                `${element.description}`,
        },
        {
            columnDef: 'work',
            header: 'Work %',
            cell: (element: PaymentSchedulebySuppliers) => `${element.work}`,
        },
        {
            columnDef: 'milestone',
            header: 'Milestone No',
            cell: (element: PaymentSchedulebySuppliers) =>
                `${element.milestone}`,
        },
        {
            columnDef: 'payment',
            header: 'Payment %',
            cell: (element: PaymentSchedulebySuppliers) => `${element.payment}`,
        },
        {
            columnDef: 'retention',
            header: 'Retention %',
            cell: (element: PaymentSchedulebySuppliers) =>
                `${element.retention}`,
        },
        {
            columnDef: 'release',
            header: 'Release %',
            cell: (element: PaymentSchedulebySuppliers) => `${element.release}`,
        },
        {
            columnDef: 'value',
            header: 'Release Value',
            cell: (element: PaymentSchedulebySuppliers) => `${element.value}`,
        },
    ];

    columns_Responces1 = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: Responces1) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: 'Response',
            cell: (element: Responces1) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: Responces1) => `${element.Comments}`,
        },
    ];

    columns_Responces2 = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: Responces2) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: 'Response',
            cell: (element: Responces2) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: Responces2) => `${element.Comments}`,
        },
    ];

    displayedColumns_PaymentSchedule = this.columns_PaymentSchedule.map(
        (c) => c.columnDef
    );
    displayedColumns_PaymentSchedulebySuppliers =
        this.columns_PaymentSchedulebySuppliers.map((c) => c.columnDef);
    displayedColumns_Responces1 = this.columns_Responces1.map(
        (c) => c.columnDef
    );
    displayedColumns_Responces2 = this.columns_Responces2.map(
        (c) => c.columnDef
    );

    columns_Attachments = [
        {
            columnDef: 'no',
            header: 'Sr No',
            cell: (element: Attachments) => `${element.no}`,
        },
        {
            columnDef: 'titleName',
            header: 'Title Name',
            cell: (element: Attachments) => `${element.titleName}`,
        },
        {
            columnDef: 'fileName',
            header: 'File Name',
            cell: (element: Attachments) => `${element.fileName}`,
        },
        {
            columnDef: 'Attachemnt',
            header: 'Attachemnt',
            cell: (element: Attachments) => `${element.Attachemnt}`,
        },
        {
            columnDef: 'Type',
            header: 'Type',
            cell: (element: Attachments) => `${element.Type}`,
        },
    ];

    displayedColumns_Attachments = this.columns_Attachments.map(
        (c) => c.columnDef
    );

    columns_AttachmentResponces = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: AttachmentResponces) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: ' Attachment',
            cell: (element: AttachmentResponces) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: AttachmentResponces) => `${element.Comments}`,
        },
    ];
    displayedColumns_AttachmentResponces = this.columns_AttachmentResponces.map(
        (c) => c.columnDef
    );

    columns_Document = [
        {
            columnDef: 'no',
            header: 'Sr No',
            cell: (element: Documents) => `${element.no}`,
        },
    ];
    displayedColumns_Documents = this.columns_Document.map((c) => c.columnDef);

    columns_DocumentResponces = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: DocumentResponces) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: 'Response',
            cell: (element: DocumentResponces) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: DocumentResponces) => `${element.Comments}`,
        },
    ];
    displayedColumns_DocumentResponces = this.columns_DocumentResponces.map(
        (c) => c.columnDef
    );

    columns_Notes = [
        {
            columnDef: 'no',
            header: 'Sr No',
            cell: (element: Notes) => `${element.no}`,
        },
    ];
    displayedColumns_Notes = this.columns_Notes.map((c) => c.columnDef);

    columns_NotesResponces = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: DocumentResponces) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: 'Response',
            cell: (element: NotesResponces) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: NotesResponces) => `${element.Comments}`,
        },
    ];
    displayedColumns_NotesResponces = this.columns_NotesResponces.map(
        (c) => c.columnDef
    );

    columns_Deliverables = [
        {
            columnDef: 'no',
            header: 'Milestone No',
            cell: (element: Deliverables) => `${element.no}`,
        },
        {
            columnDef: 'name',
            header: 'Milestone Name',
            cell: (element: Deliverables) => `${element.name}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: Deliverables) => `${element.description}`,
        },
        {
            columnDef: 'milestone',
            header: 'Previous Milestone',
            cell: (element: Deliverables) => `${element.milestone}`,
        },
        {
            columnDef: 'progress',
            header: 'Progress %',
            cell: (element: Deliverables) => `${element.progress}`,
        },
        {
            columnDef: 'stageProgress',
            header: 'Stage Progress%',
            cell: (element: Deliverables) => `${element.stageProgress}`,
        },
        {
            columnDef: 'date',
            header: 'Begin Date',
            cell: (element: Deliverables) => `${element.date}`,
        },
    ];

    displayedColumns_Deliverables = this.columns_Deliverables.map(
        (c) => c.columnDef
    );

    columns_DeliverablesbySuppliers = [
        {
            columnDef: 'no',
            header: 'Milestone No',
            cell: (element: DeliverablesbySuppliers) => `${element.no}`,
        },
        {
            columnDef: 'milestoneName',
            header: 'Milestone Name',
            cell: (element: DeliverablesbySuppliers) => `${element.name}`,
        },
        {
            columnDef: 'description',
            header: 'Description',
            cell: (element: DeliverablesbySuppliers) =>
                `${element.description}`,
        },
        {
            columnDef: 'milestone',
            header: 'Previous Milestone',
            cell: (element: DeliverablesbySuppliers) => `${element.milestone}`,
        },
        {
            columnDef: 'progress',
            header: 'Progress %',
            cell: (element: DeliverablesbySuppliers) => `${element.progress}`,
        },
        {
            columnDef: 'stageProgress',
            header: 'Stage Progress%',
            cell: (element: DeliverablesbySuppliers) =>
                `${element.stageProgress}`,
        },
        {
            columnDef: 'date',
            header: 'Begin Date',
            cell: (element: DeliverablesbySuppliers) => `${element.date}`,
        },
    ];

    displayedColumns_DeliverablesbySuppliers =
        this.columns_DeliverablesbySuppliers.map((c) => c.columnDef);

    columns_DeliverableResponces1 = [
        {
            columnDef: 'name',
            header: 'Supplier name',
            cell: (element: DeliverableResponces1) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: 'Response',
            cell: (element: DeliverableResponces1) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: DeliverableResponces1) => `${element.Comments}`,
        },
    ];
    displayedColumns_DeliverableResponces1 =
        this.columns_DeliverableResponces1.map((c) => c.columnDef);
    columns_DeliverableResponces2 = [
        {
            columnDef: 'name',
            header: 'Supplier name',
            cell: (element: DeliverableResponces2) => `${element.name}`,
        },
        {
            columnDef: 'responces',
            header: 'Response',
            cell: (element: DeliverableResponces2) => `${element.responces}`,
        },
        {
            columnDef: 'Comments',
            header: 'Comments',
            cell: (element: DeliverableResponces2) => `${element.Comments}`,
        },
    ];
    displayedColumns_DeliverableResponces2 =
        this.columns_DeliverableResponces2.map((c) => c.columnDef);

    columns_supplierResponses_header = [
        {
            columnDef: 'srNo',
            header: 'Sr No',
            cell: (element: any) => `${element.srNo}`,
        },
        {
            columnDef: 'supplierName',
            header: 'Supplier Name',
            cell: (element: any) => `${element.supplierName}`,
        },
        {
            columnDef: 'fileName',
            header: 'File Name',
            cell: (element: any) => `${element.fileName}`,
        },
    ];

    displayedColumns_supplierResponses_header =
        this.columns_supplierResponses_header.map((c) => c.columnDef);

    supplierResponses_header_DataSource=[];

    columns_header = [
        {
            columnDef: 'supplierName',
            header: 'Supplier Name',
            cell: (element: header) => `${element.quoteNumber}`,
        },
        {
            columnDef: 'quoteNumber',
            header: 'Quote Number',
            cell: (element: header) => `${element.quoteNumber}`,
        },
        {
            columnDef: 'refNumber',
            header: 'Ref number',
            cell: (element: header) => `${element.refNumber}`,
        },
        {
            columnDef: 'rfqCurrency',
            header: 'RFQ Currency',
            cell: (element: header) => `${element.rfqCurrency}`,
        },
        {
            columnDef: 'validUntil',
            header: 'Quote valid until',
            cell: (element: header) => `${element.validUntil}`,
        },
        {
            columnDef: 'weeks',
            header: 'Days or weeks',
            cell: (element: header) => `${element.weeks}`,
        },
        {
            columnDef: 'deliveryTime',
            header: 'Delivery Time',
            cell: (element: header) => `${element.deliveryTime}`,
        },
        {
            columnDef: 'supplierSite',
            header: 'Supplier Site',
            cell: (element: header) => `${element.supplierSite}`,
        },
    ];

    displayedColumns_header = this.columns_header.map((c) => c.columnDef);

    header_DataSource=[];

    columns_Lines = [
        {
            columnDef: 'no',
            header: 'Line No',
            cell: (element: Lines) => `${element.no}`,
        },
        {
            columnDef: 'prNo',
            header: 'PR Number',
            cell: (element: Lines) => `${element.prNo}`,
        },
        {
            columnDef: 'partId',
            header: 'Part ID',
            cell: (element: Lines) => `${element.partId}`,
        },
        {
            columnDef: 'description',
            header: 'Part Description',
            cell: (element: Lines) => `${element.description}`,
        },
        {
            columnDef: 'date',
            header: 'Need by Date',
            cell: (element: Lines) => `${element.date}`,
        },
        {
            columnDef: 'target',
            header: 'Target',
            cell: (element: Lines) => `${element.target}`,
        },
        {
            columnDef: 'price',
            header: 'Show Price',
            cell: (element: Lines) => `${element.price}`,
        },
        {
            columnDef: 'uom',
            header: 'UoM',
            cell: (element: Lines) => `${element.uom}`,
        },
        {
            columnDef: 'qty',
            header: 'Qty',
            cell: (element: Lines) => `${element.qty}`,
        },
    ];

    displayedColumns_Lines = this.columns_Lines.map((c) => c.columnDef);

    Lines_DataSource = [];

    supliercolumns_Information = [
        {
            columnDef: 'supplierID',
            header: 'Supplier ID',
            cell: (element: any) => `${element.supplierID}`,
        },
        {
            columnDef: 'name',
            header: 'Name',
            cell: (element: any) => `${element.name}`,
        },
        {
            columnDef: 'invitedOn',
            header: 'Invitation Date',
            cell: (element: any) => `${element.invitedOn}`,
        },
        {
            columnDef: 'supplierContact',
            header: 'Contact',
            cell: (element: any) => `${element.supplierContact}`,
        },
        {
            columnDef: 'emailID',
            header: 'Email ID',
            cell: (element: any) => `${element.emailID}`,
        },
        {
            columnDef: 'currencies',
            header: 'Currencies',
            cell: (element: any) => `${element.currencies}`,
        },
        {
            columnDef: 'status',
            header: 'Status',
            cell: (element: any) => `${element.status}`,
        },
    ];

    columns_Information = [
        {
            columnDef: 'name',
            header: 'USER NAME',
            cell: (element: any) => `${element.name}`,
        },
        {
            columnDef: 'role',
            header: 'RFX ROLE',
            cell: (element: any) => `${element.role}`,
        },
        {
            columnDef: 'substitute',
            header: 'SUBSTITUE',
            cell: (element: any) => `${element.substitute}`,
        },
        {
            columnDef: 'access',
            header: 'ACCESS LEVEL',
            cell: (element: any) => `${element.access}`,
        },
        {
            columnDef: 'pages',
            header: 'PAGES WITH ACCESS',
            cell: (element: any) => `${element.pages}`,
        },
        {
            columnDef: 'teamName',
            header: 'TEAM NAME',
            cell: (element: any) => `${element.teamName}`,
        },
        {
            columnDef: 'description',
            header: 'TEAM DESCRIPTION',
            cell: (element: any) => `${element.description}`,
        },
    ];

    displayedColumns_Information = this.columns_Information.map(
        (c) => c.columnDef
    );

    displayedSupplierColumns_Information = this.supliercolumns_Information.map(
        (c) => c.columnDef
    );

    columns_Rules_RFX_header = [
        {
            columnDef: 'select',
            header: 'RFX Header',
            cell: (element: newTable) => `${element.select}`,
        },
        {
            columnDef: 'name',
            header: '',
            cell: (element: newTable) => `${element.name}`,
        },
        {
            columnDef: 't',
            header: 'T',
            cell: (element: newTable) => `${element.t}`,
        },
        {
            columnDef: 'c',
            header: 'C',
            cell: (element: newTable) => `${element.c}`,
        },
    ];

    displayedColumns_Rules_RFX_header = this.columns_Rules_RFX_header.map(
        (c) => c.columnDef
    );

    columns_Rules_Lines_header = [
        {
            columnDef: 'select',
            header: 'RFX Lines',
            cell: (element: newTable) => `${element.select}`,
        },
        {
            columnDef: 'name',
            header: '',
            cell: (element: newTable) => `${element.name}`,
        },
        {
            columnDef: 't',
            header: 'T',
            cell: (element: newTable) => `${element.t}`,
        },
        {
            columnDef: 'c',
            header: 'C',
            cell: (element: newTable) => `${element.c}`,
        },
    ];

    displayedColumns_Rules_Lines_header = this.columns_Rules_Lines_header.map(
        (c) => c.columnDef
    );

    columns_GeneralRules = [
        {
            columnDef: 'name',
            header: 'General Rules',
            cell: (element: GeneralRules) => `${element.name}`,
        },
        {
            columnDef: 'select',
            header: '',
            cell: (element: GeneralRules) => `${element.select}`,
        },
    ];

    displayedColumns_GeneralRules = this.columns_GeneralRules.map(
        (c) => c.columnDef
    );

    columns_Scoring_Attribute = [
        {
            columnDef: 'name',
            header: 'Attribute Items',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_Attributes = this.columns_Scoring_Attribute.map(
        (c) => c.columnDef
    );
    Scoring_Header_Attribute_DataSource = Scoring_Header_Attribute_Data;

    columns_Scoring_CostFactors = [
        {
            columnDef: 'name',
            header: 'Cost Factors',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_CostFactors = this.columns_Scoring_Attribute.map(
        (c) => c.columnDef
    );
    Scoring_Header_CostFactors_DataSource = Scoring_Header_CostFactors_Data;
    Scoring_Lines_CostFactors_DataSource = Scoring_Lines_CostFactors_Data;

    columns_Scoring_PaymentShcedule = [
        {
            columnDef: 'name',
            header: 'Payment Schedules',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_PaymentShcedule =
        this.columns_Scoring_PaymentShcedule.map((c) => c.columnDef);
    Scoring_Header_PaymentShcedule_DataSource =
        Scoring_Header_PaymentShcedule_Data;
    Scoring_Lines_PaymentShcedule_DataSource =
        Scoring_Lines_PaymentShcedule_Data;

    columns_Scoring_Attachment = [
        {
            columnDef: 'name',
            header: 'Attatchment',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_Attachment = this.columns_Scoring_Attachment.map(
        (c) => c.columnDef
    );
    Scoring_Header_Attachment_DataSource = Scoring_Header_Attachment_Data;
    Scoring_Lines_Attachment_DataSource = Scoring_Lines_Attachment_Data;

    columns_Scoring_Document = [
        {
            columnDef: 'name',
            header: 'Document Text',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_Document = this.columns_Scoring_Document.map(
        (c) => c.columnDef
    );
    Scoring_Header_Document_DataSource = Scoring_Header_Document_Data;
    Scoring_Lines_Document_DataSource = Scoring_Lines_Document_Data;

    columns_Scoring_Notes = [
        {
            columnDef: 'name',
            header: 'Notes',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_Notes = this.columns_Scoring_Notes.map(
        (c) => c.columnDef
    );
    Scoring_Header_Notes_DataSource = Scoring_Header_Notes_Data;
    Scoring_Lines_Notes_DataSource = Scoring_Lines_Notes_Data;

    columns_Scoring_Deliverables = [
        {
            columnDef: 'name',
            header: 'Deliverables',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_Deliverables =
        this.columns_Scoring_Deliverables.map((c) => c.columnDef);
    Scoring_Header_Deliverables_DataSource = Scoring_Header_Deliverables_Data;
    Scoring_Lines_Deliverables_DataSource = Scoring_Lines_Deliverables_Data;

    columns_Scoring_Lines_Attribute = [
        {
            columnDef: 'name',
            header: 'Attribute Points',
            cell: (element: scoringTables) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringTables) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringTables) => `${element.weight}`,
        },
    ];

    displayedColumns_Scoring_Lines_Attributes =
        this.columns_Scoring_Lines_Attribute.map((c) => c.columnDef);
    Scoring_Lines_Attribute_DataSource = Scoring_Lines_Attribute_Data;

    columns_lineItems = [
        {
            columnDef: 'line',
            header: 'Line #',
            cell: (element: lineItems) => `${element.line}`,
        },
        {
            columnDef: 'id',
            header: 'Part ID',
            cell: (element: lineItems) => `${element.id}`,
        },
        {
            columnDef: 'description',
            header: 'Part Description',
            cell: (element: lineItems) => `${element.description}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: lineItems) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: lineItems) => `${element.weight}`,
        },
    ];

    displayedColumns_lineItems = this.columns_lineItems.map((c) => c.columnDef);
    Scoring_lineItems_DataSource = lineItems_Data;

    columns_scoringCriteria_Header = [
        {
            columnDef: 'name',
            header: 'RFX Header',
            cell: (element: scoringCriteria) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringCriteria) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringCriteria) => `${element.weight}`,
        },
        {
            columnDef: 'score',
            header: 'k',
            cell: (element: scoringCriteria) => `${element.score}`,
        },
    ];

    displayedColumns_scoringCriteria_Header =
        this.columns_scoringCriteria_Header.map((c) => c.columnDef);

    columns_scoringCriteria_Lines = [
        {
            columnDef: 'name',
            header: 'RFX Lines',
            cell: (element: scoringCriteria) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringCriteria) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringCriteria) => `${element.weight}`,
        },
        {
            columnDef: 'score',
            header: 'k',
            cell: (element: scoringCriteria) => `${element.score}`,
        },
    ];

    displayedColumns_scoringCriteria_Lines =
        this.columns_scoringCriteria_Lines.map((c) => c.columnDef);

    columns_BidPrice = [
        {
            columnDef: 'name',
            header: 'Bid Price Responses',
            cell: (element: scoringCriteria) => `${element.name}`,
        },
        {
            columnDef: 'points',
            header: 'P',
            cell: (element: scoringCriteria) => `${element.points}`,
        },
        {
            columnDef: 'weight',
            header: '%',
            cell: (element: scoringCriteria) => `${element.weight}`,
        },
        {
            columnDef: 'score',
            header: 'k',
            cell: (element: scoringCriteria) => `${element.score}`,
        },
    ];

    displayedColumns_BidPrice = this.columns_BidPrice.map((c) => c.columnDef);
    scoringCriteria_DataSource = scoringCriteria_Data;
    BidPrice_DataSource = BidPrice_Data;

    columns_technicalEvaluation_Score = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: technicalEvaluation_Score) => `${element.name}`,
        },
        {
            columnDef: 'finalScore',
            header: 'Final technical score',
            cell: (element: technicalEvaluation_Score) =>
                `${element.finalScore}`,
        },
    ];

    displayedColumns_technicalEvaluation_Score =
        this.columns_technicalEvaluation_Score.map((c) => c.columnDef);

    columns_commercialEvaluation_Score = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: technicalEvaluation_Score) => `${element.name}`,
        },
        {
            columnDef: 'finalScore',
            header: 'Final commercial score',
            cell: (element: technicalEvaluation_Score) =>
                `${element.finalScore}`,
        },
    ];

    displayedColumns_commercialEvaluation_Score =
        this.columns_commercialEvaluation_Score.map((c) => c.columnDef);
    technicalEvaluation_Score_DataSource =[];
    commercialEvaluation_Score_DataSource =[];
    columns_bidDetails = [
        {
            columnDef: 'name',
            header: 'Supplier name',
            cell: (element: bidDetails) => `${element.name}`,
        },
        {
            columnDef: 'items',
            header: 'Total Line Items',
            cell: (element: bidDetails) => `${element.items}`,
        },
        {
            columnDef: 'total',
            header: 'Total Cost',
            cell: (element: bidDetails) => `${element.total}`,
        },
    ];

    displayedColumns_bidDetails = this.columns_bidDetails.map(
        (c) => c.columnDef
    );
    bidDetails_DataSource = [];

    columns_summeryComparison = [
        {
            columnDef: 'name',
            header: 'Supplier name',
            cell: (element: summeryComparison) => `${element.name}`,
        },
        {
            columnDef: 'total',
            header: 'Total price',
            cell: (element: summeryComparison) => `${element.total}`,
        },
        {
            columnDef: 'target',
            header: 'Savings from target',
            cell: (element: summeryComparison) => `${element.target}`,
        },
        {
            columnDef: 'tbeRank',
            header: 'Supplier name',
            cell: (element: summeryComparison) => `${element.tbeRank}`,
        },
        {
            columnDef: 'cbeRank',
            header: 'Supplier name',
            cell: (element: summeryComparison) => `${element.cbeRank}`,
        },
        {
            columnDef: 'overallRank',
            header: 'Overall Rank',
            cell: (element: summeryComparison) => `${element.overallRank}`,
        },
        {
            columnDef: 'status',
            header: 'Supplier name',
            cell: (element: summeryComparison) => `${element.status}`,
        },
    ];

    displayedColumns_summeryComparison = this.columns_summeryComparison.map(
        (c) => c.columnDef
    );
    summeryComparison_DataSource = summeryComparison_data;

    columns_lineItemAward = [
        {
            columnDef: 'description',
            header: 'Line Item Description',
            cell: (element: lineItemAward) => `${element.description}`,
        },
        {
            columnDef: 'price',
            header: 'Unit Price',
            cell: (element: lineItemAward) => `${element.price}`,
        },
        {
            columnDef: 'cost',
            header: 'Total Cost',
            cell: (element: lineItemAward) => `${element.cost}`,
        },
        {
            columnDef: 'award',
            header: 'Awarded Supplier',
            cell: (element: lineItemAward) => `${element.award}`,
        },
    ];

    displayedColumns_lineItemAward = this.columns_lineItemAward.map(
        (c) => c.columnDef
    );
    lineItemAward_DataSource = lineItemAward_data;

    columns_totalAward = [
        {
            columnDef: 'name',
            header: 'Supplier Name',
            cell: (element: totalAward) => `${element.name}`,
        },
        {
            columnDef: 'award',
            header: 'Total Award',
            cell: (element: totalAward) => `${element.award}`,
        },
    ];

    displayedColumns_totalAward = this.columns_totalAward.map(
        (c) => c.columnDef
    );
    totalAward_DataSource = totalAward_data;

    columns_lineItemBreakdown = [
        {
            columnDef: 'lineNumber',
            header: 'Line No',
            cell: (element: lineItemBreakdown) => `${element.no}`,
        },
        {
            columnDef: 'partId',
            header: 'Part ID',
            cell: (element: lineItemBreakdown) => `${element.partId}`,
        },
        {
            columnDef: 'partDescription',
            header: 'Part Description',
            cell: (element: lineItemBreakdown) => `${element.description}`,
        },
        {
            columnDef: 'purchaseQty',
            header: 'Qty',
            cell: (element: lineItemBreakdown) => `${element.qty}`,
        },
        {
            columnDef: 'uom',
            header: 'UoM',
            cell: (element: lineItemBreakdown) => `${element.uom}`,
        },
        {
            columnDef: 'wantedDate',
            header: 'Need by Date',
            cell: (element: lineItemBreakdown) => `${element.date}`,
        },
        {
            columnDef: 'targetPrice',
            header: 'Target',
            cell: (element: lineItemBreakdown) => `${element.target}`,
        },
    ];

    displayedColumns_lineItemBreakdown:string[];
    lineItemBreakdown_DataSource = [];

    Supplier_Inormation_DataSource = Supplier_Inormation_Data;
    Team_Inormation_DataSource = Team_Inormation_Data;
    Rules_RFX_header_DataSource = Rules_RFX_header;
    Rules_Lines_header_DataSource = Rules_Lines_header;
    GeneralRules_DataSource = GeneralRules_Data;

    supplier_response_details: any;
    columns_supplier_response_detail: {}[];
    supplier_TBEchartdata:any=[];
    supplier_CBEchartdata:any=[];
    supplier_cost_chartdata:any=[];
    //data for Supplier Response Details table
    columnNames:string[];
    expand: boolean;

    capitalize(s: string): string {
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    //columns for evaluation table
    columnNames_Evaluation_Attribute_Data:string[];
    columnNames_Evaluation_LineAttribute_Data:string[];
    columnNames_Evaluation_CostFactors_Data: string[];
   
    columnNames_Evaluation_PaymentSchedule_Data : string[];
   
    columnNames_Evaluation_Attachments_Data: string[];;
    columnNames_Evaluation_Document_Data: string[];;
    columnNames_Evaluation_Notes_Dataa: string[];;
    columnNames_Evaluation_Deliverables_Data: string[];;
    @Input() rfqId:any
    @Input() rfqModel:any;
    rfqEvaluationModel:any;
    evaluationLines:any[];

    bindSupplierHeaderInformations()
    {
        
        // supplierResponses_header_DataSource
        if (this.rfqModel.table27)
        {
            for (var als = 0; als < this.rfqModel.table27.length; als++) {
                var currenctSUp=this.rfqModel.table27[als];
                let supplierHeader = {
                    quoteNumber: currenctSUp.qouteNumber,
                    refNumber: currenctSUp.refNumber,
                    rfqCurrency: currenctSUp.currencyName,
                    validUntil: currenctSUp.qouteValideUntil,
                    weeks: currenctSUp.daysOrWeeks,
                    deliveryTime: currenctSUp.deliveryTime,
                    supplierSite: currenctSUp.supplierSite,
                    supplierName: currenctSUp.supplierName
                }
                this.header_DataSource.push(supplierHeader);
            }
          
        }
        if (this.rfqModel.table53)
        {
            for (var als = 0; als < this.rfqModel.table53.length; als++) {
                var currenctSUp=this.rfqModel.table53[als];
                let supplierHeaderFiles = {
                    srNo: currenctSUp.srNo,
                    supplierName: currenctSUp.supplierName,
                    fileName: currenctSUp.fileName
                }
                this.supplierResponses_header_DataSource.push(supplierHeaderFiles);
            }
          
        }
    }
    dynamicdataROA:any;
    getROA(){
        let cbaModel = { rfqId: this.rfqId };
        const refference2 = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading ROA....' } });
       
        this.rfqService.getROA(cbaModel).subscribe(result => {
            refference2.close();
            
            this.dynamicdataROA = result.data;
            this.getRecommnedation();
            
        });
    }
    detailsDisplayMap = new Map();
    
    getActiveDetailsTabROA(id: string): boolean {
        return this.detailsDisplayMapROA.get(id) ? this.detailsDisplayMapROA.get(id) : false;
    }

    toggleDisplayROA(id: string) {
        var existingVal = this.detailsDisplayMapROA.get(id);
        if (existingVal) {
            this.detailsDisplayMapROA.set(id, !existingVal)
        } else {
            this.detailsDisplayMapROA.set(id, true)
        }
    }
    isSupplierSame = false;
    rankRecommendation: any;
    scoreRecommendation: any;
    partlines: any = [];
    isauto: any = false;
    supplierscores: any = [];
    supplierNames: any = [];
    supplierTBEranks: any = [];
    supplierCBEranks: any = [];
    supplierTBENames: any = [];
    supplierCBENames: any = [];
    public chartOptionsCBERanks: Partial<ChartOptions>;
    public chartOptionsTBERanks: Partial<ChartOptions>;
    public chartOptionsScores: Partial<ChartOptions>;
    getRecommnedation() {
        let rankRecommendation = this.dynamicdataROA.overallRecommendation.sort((a, b) => b.supplierRank - a.supplierRank);
        this.rankRecommendation = rankRecommendation[rankRecommendation.length - 1];
        let scoreRecommendation = this.dynamicdataROA.overallRecommendation.sort((a, b) => (b.tbe + b.cbe) - (a.tbe + a.cbe));
        this.scoreRecommendation = scoreRecommendation[0];
        let supplierRankBasedNames = [];
        let supplierPriceBasedNames = [];
        
        if (this.dynamicdataROA) {
            if (this.dynamicdataROA.overallRecommendation) {
                for (var k = 0; k < this.dynamicdataROA.overallRecommendation.length; k++) {
                    let avgSupRank = ((this.dynamicdataROA.overallRecommendation[k].supplierRank + this.dynamicdataROA.overallRecommendation[k].tbe + this.dynamicdataROA.overallRecommendation[k].cbe) / 3)
                    let priceBased = { "supplierName": this.dynamicdataROA.overallRecommendation[k].supplierName, "RankAvg": avgSupRank, "id": this.dynamicdataROA.overallRecommendation[k].id };
                    supplierPriceBasedNames.push({ "supplierName": this.dynamicdataROA.overallRecommendation[k].supplierName, "PriceRank": this.dynamicdataROA.overallRecommendation[k].supplierRank, "id": this.dynamicdataROA.overallRecommendation[k].id });
                    supplierRankBasedNames.push(priceBased);
                }
                if (supplierRankBasedNames) {
                    const closest = supplierRankBasedNames.reduce(
                        (acc, loc) =>
                            acc.PriceRank < loc.PriceRank
                                ? acc
                                : loc
                    )
                    this.scoreRecommendation = closest;
                }
                if (supplierPriceBasedNames) {
                    const closest1 = supplierPriceBasedNames.reduce(
                        (acc, loc) =>
                            acc.PriceRank < loc.RankAvg
                                ? acc
                                : loc
                    )
                    this.rankRecommendation = closest1;
                }
                if (this.rankRecommendation.supplierName == this.scoreRecommendation.supplierName) {
                    this.isSupplierSame = true;
                }
                if (this.dynamicdataROA != null) {
                    if (this.dynamicdataROA.partLines != null && this.dynamicdataROA.partLineResponses != null) {
                        for (var i = 0; i < this.dynamicdataROA.partLines.length; i++) {
                            let partLine: any;
                            partLine = this.dynamicdataROA.partLines[i];
                            partLine.supplierResponses = [];
                            for (var k = 0; k < this.dynamicdataROA.partLineResponses.length; k++) {
                                if (this.dynamicdataROA.partLines[i].id == this.dynamicdataROA.partLineResponses[k].rfqPartLineId) {
                                    partLine.supplierResponses.push(this.dynamicdataROA.partLineResponses[k]);
                                    if (this.dynamicdataROA.partLineResponses[k].isLineAwarded == true) {
                                        partLine.isLineAwarded = this.dynamicdataROA.partLineResponses[k].isLineAwarded;
                                    }
                                }
                            }
                            this.partlines.push(partLine);
                        }
                    }
                    
                }
                this.isauto = (this.dynamicdataROA.headerRow[0].isOverAllAwarded == null);
                this.supplierNames = [];
                this.supplierscores = [];
                this.supplierTBEranks = [];
                this.supplierCBEranks = [];
                this.supplierTBENames = [];
                this.supplierCBENames = [];
               
                for (var i = 0; i < this.dynamicdataROA.supplierRanks.length; i++) {
                    this.supplierNames.push(this.dynamicdataROA.supplierRanks[i].supplierName);
                    this.supplierscores.push(this.dynamicdataROA.supplierRanks[i].supplierRank);
                }
                for (var i = 0; i < this.dynamicdataROA.supplierTBEScores.length; i++) {
                    this.supplierTBEranks.push(this.dynamicdataROA.supplierTBEScores[i].tbe);
                    this.supplierTBENames.push(this.dynamicdataROA.supplierTBEScores[i].supplierName);
                }
                for (var i = 0; i < this.dynamicdataROA.supplierCBESCores.length; i++) {
                    this.supplierCBEranks.push(this.dynamicdataROA.supplierCBESCores[i].cbe);
                    this.supplierCBENames.push(this.dynamicdataROA.supplierCBESCores[i].supplierName);
                }
                // for (var i = 0; i < this.dynamicdata.supplierData.length; i++) {
                //     this.dynamicdata.supplierData[i].tbe=this.supplierTBEranks[i];
                //     this.dynamicdata.supplierData[i].cbe=this.supplierCBEranks[i];
                // }
                this.chartOptionsScores.series = [{ data: this.supplierscores }];

                this.chartOptionsScores.xaxis = { categories: this.supplierNames };

                this.chartOptionsTBERanks.series = [{ data: this.supplierTBEranks }];

                this.chartOptionsTBERanks.xaxis = { categories: this.supplierTBENames };
                this.chartOptionsCBERanks.series = [{ data: this.supplierCBEranks }];

                this.chartOptionsCBERanks.xaxis = { categories: this.supplierCBENames };
            }
        }
    }
    bindHeaderAttribute() {
        this.SampleAttribute = [];
        let attributeListsData:any = []
        if (this.rfqModel.table1)//Header Attribute
        {
            for (var al = 0; al < this.rfqModel.table1.length; al++) {
                let attributeListData = { ATTRIBUTES: [], ATTRIBUTE_ITEMS: [], SUPPLIERS: [] }
                attributeListData.ATTRIBUTES.push({ title: this.rfqModel.table1[al].title, name: this.rfqModel.table1[al].name, group: this.rfqModel.table1[al].groupName })
                attributeListData.ATTRIBUTE_ITEMS.push({ item: this.rfqModel.table1[al].attributeName, description: this.rfqModel.table1[al].attributeDescription, value: this.rfqModel.table1[al].expectedValue })

                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table31.length; alsV++) {
                            if(this.rfqModel.table1[al].rfqAttributeID==this.rfqModel.table31[alsV].rfqAttributeID && this.rfqModel.table26[als].supplierID==this.rfqModel.table31[alsV].supplierID)
                            {
                                attributeListData.SUPPLIERS.push({ name: this.rfqModel.table26[als].supplierName, value: this.rfqModel.table31[alsV].targetValue, cost: this.rfqModel.table31[alsV].cost, Comments: this.rfqModel.table31[alsV].supplierComment });
                            }
                        }
                        
                    }
                }
                attributeListsData.push(attributeListData);
            }
            this.SampleAttribute = attributeListsData;
        }
    }

    bindHeaderCF() {
        this.SampleCostFactors = [];
        let cfListsData:any = [];
        if (this.rfqModel.table2)//Header Cost Factor
        {
            for (var al = 0; al < this.rfqModel.table2.length; al++) {
                let cfData = { CostFactors: [], CostFactorItems: [], SupplierResponces1: [] }
                cfData.CostFactors.push({ list: this.rfqModel.table2[al].title, description: this.rfqModel.table2[al].name })
                cfData.CostFactorItems.push({ name: this.rfqModel.table2[al].costFactorName, description: this.rfqModel.table2[al].cfDescription, type: this.rfqModel.table2[al].attributeCategoryName, value: this.rfqModel.table2[al].expectedValue })

                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table32.length; alsV++) {
                            if(this.rfqModel.table2[al].rfqcfid==this.rfqModel.table32[alsV].rfqHeaderCostFactorID && this.rfqModel.table26[als].supplierID==this.rfqModel.table32[alsV].supplierID)
                            {
                                cfData.SupplierResponces1.push({ name: this.rfqModel.table26[als].supplierName, value: this.rfqModel.table32[alsV].supplierResponse, Comments: this.rfqModel.table32[alsV].supplierComment});
                            }
                        }
                        
                    }
                }
                cfListsData.push(cfData);
            }
            this.SampleCostFactors = cfListsData;
        }
    }

     bindHeaderPS() {
        this.SamplePaymentSchedule = [];
        let psListsData:any = []
        if (this.rfqModel.table3)//Header Payment Schedules
        {
            for (var al = 0; al < this.rfqModel.table3.length; al++) {
                let psListData = { PaymentSchedule: [], Responces1: [], PaymentSchedulebySuppliers: [] }
                psListData.PaymentSchedule.push({ no: this.rfqModel.table3[al].payScheduleNo, description: this.rfqModel.table3[al].description, work: this.rfqModel.table3[al].workPercentage
                ,milestone: this.rfqModel.table3[al].milestone, payment: this.rfqModel.table3[al].paymentPercentage, retention: this.rfqModel.table3[al].retentionPercentage
                , release: this.rfqModel.table3[al].releasePercentage, value: this.rfqModel.table3[al].releaseValue });
                psListData.PaymentSchedulebySuppliers.push({ no: this.rfqModel.table3[al].payScheduleNo, description: this.rfqModel.table3[al].description, work: this.rfqModel.table3[al].workPercentage
                    ,milestone: this.rfqModel.table3[al].milestone, payment: this.rfqModel.table3[al].paymentPercentage, retention: this.rfqModel.table3[al].retentionPercentage
                    , release: this.rfqModel.table3[al].releasePercentage, value: this.rfqModel.table3[al].releaseValue })
                

                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table33.length; alsV++) {
                            if(this.rfqModel.table3[al].rfqPSID==this.rfqModel.table33[alsV].rfqHeaderPaymentScheduleId && this.rfqModel.table26[als].supplierID==this.rfqModel.table33[alsV].supplierID)
                            {
                                var currentPS=this.rfqModel.table33[alsV];
                                psListData.Responces1.push({ name: currentPS.supplierName, no: currentPS.paySchedNo, description: currentPS.description, 
                                    work: currentPS.workPercentage, milestone: currentPS.mlestonePercentage, payment: currentPS.paymentPercentage
                                    , retention: currentPS.retentionPercentage, release: currentPS.relesePercentage, value: currentPS.releasevalue });
                              
                            }
                        }
                        
                    }
                }
                psListsData.push(psListData);
            }
            this.SamplePaymentSchedule = psListsData;
        }
    }

    bindHeaderAttachment() {
        this.SampleAttachments = [];
        let attachList:any = []
        var table=this.rfqModel.table5;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                let attachment = { Attachments: [], AttachmentResponces: [] }
                attachment.Attachments.push({ no: table[al].srNo, titleName: table[al].title, fileName: table[al].fileName,Attachemnt: table[al].fileName
                    ,Type: table[al].type});
                
                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        
                        for (var alsV = 0; alsV < this.rfqModel.table36.length; alsV++) {
                            if(table[al].rfqAttachID==this.rfqModel.table36[alsV].rfqHeaderAttachmentId && this.rfqModel.table26[als].supplierID==this.rfqModel.table36[alsV].supplierID)
                            {
                                var currentAtt=this.rfqModel.table36[alsV];
                                attachment.AttachmentResponces.push({ name: this.rfqModel.table26[als].supplierName, responces: currentAtt.fileName, Comments: currentAtt.comments });
                            }
                        }
                    }
                }
                attachList.push(attachment);
            }
            this.SampleAttachments = attachList;
        }
    }
    
    bindHeaderDT() {
        
        this.SampleDocument = [];
        let docList:any = []
        var table=this.rfqModel.table6;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                let document = { Documents: [], DocumentResponces: [] }
                document.Documents.push({ no: table[al].phraseID});
                
                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table37.length; alsV++) {
                            if(table[al].rfqdtid==this.rfqModel.table37[alsV].rfqHeaderDocumentTextId && this.rfqModel.table26[als].supplierID==this.rfqModel.table37[alsV].supplierID)
                            {
                                var currentDT=this.rfqModel.table37[alsV];
                                document.DocumentResponces.push({ name: this.rfqModel.table26[als].supplierName, responces: currentDT.supplierResponse, Comments: currentDT.comments });
                            }
                        }
                        
                    }
                }
                docList.push(document);
            }
            this.SampleDocument = docList;
        }
    }
    
    bindHeaderNotes() {
        this.SampleNotes = [];
        let noteList:any = []
        var table=this.rfqModel.table7;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                let note = { Notes: [], NotesResponces: [] }
                note.Notes.push({ no: table[al].description});
                
                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table39.length; alsV++) {
                            if(table[al].rfqNoteID==this.rfqModel.table39[alsV].rfqHeaderNoteId && this.rfqModel.table26[als].supplierID==this.rfqModel.table39[alsV].supplierId)
                            {
                                var currentNote=this.rfqModel.table39[alsV];
                                note.NotesResponces.push({ name: this.rfqModel.table26[als].supplierName, responces: currentNote.description, Comments: currentNote.comments });
                            }
                        }
                       
                    }
                }
                noteList.push(note);
            }
            this.SampleNotes = noteList;
        }
    }
    
    bindHeaderDeliverables() {
        this.SampleDeliverables = [];
        let deliverableList:any = []
        var table=this.rfqModel.table8;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                let deliverable = { Deliverables: [],DeliverablesbySuppliers:[] }
                deliverable.Deliverables.push({ no: table[al].mileStoneNo,name:table[al].name,description:table[al].description
                    ,milestone:table[al].progressPercentageMilestone,progress:table[al].mileStoneNo,stageProgress:table[al].accumulatedCompletion,date:table[al].beginDate});
                    
                    deliverable.DeliverablesbySuppliers.push({ no: table[al].mileStoneNo,name:table[al].name,description:table[al].description
                        ,milestone:table[al].progressPercentageMilestone,progress:table[al].mileStoneNo,stageProgress:table[al].accumulatedCompletion,date:table[al].beginDate});

                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table34.length; alsV++) {
                            if(table[al].rfqDeliID==this.rfqModel.table34[alsV].rfqHeaderDeliverableId && this.rfqModel.table26[als].supplierID==this.rfqModel.table34[alsV].supplierID)
                            {
                                var currentDel=this.rfqModel.table34[alsV];
                                deliverable.DeliverablesbySuppliers.push({ name: this.rfqModel.table26[als].supplierName, 
                                    no: currentDel.milestone, milestoneName: currentDel.milestoneName,description:currentDel.description,milestone:currentDel.milestone
                                    ,progress:currentDel.progress,stageProgress:currentDel.stageProgress,date:currentDel.beginDate });
                            }
                        }
                        
                    }
                }
                deliverableList.push(deliverable);
            }
            this.SampleDeliverables = deliverableList;
        }
    }

    
    
    bindPartLines() {
        this.Lines_DataSource = [];
        let linesList:any = []
        var table=this.rfqModel.table10;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                
                var line={ id:table[al].id,no: table[al].lineNumber,prNo:table[al].prNumber,partId:table[al].partID
                    ,description:table[al].partDescirption,date:table[al].wantedDate,target:table[al].targetPrice
                    ,price:table[al].startPrice,uom:table[al].uoM,qty:table[al].purchaseQty,isShow:false,SUPPLIERS:[]};
                    if (this.rfqModel.table26) {
                        for (var als = 0; als < this.rfqModel.table26.length; als++) {
                            for (var alsV = 0; alsV < this.rfqModel.table40.length; alsV++) {
                                if(table[al].id==this.rfqModel.table40[alsV].rfqPartLineId && this.rfqModel.table26[als].supplierID==this.rfqModel.table40[alsV].supplierID)
                                {
                                    line.SUPPLIERS.push({ name: this.rfqModel.table26[als].supplierName
                                        ,supplierID:this.rfqModel.table26[als].supplierID,rfqPartLineId:table[al].id
                                    ,lineRow:{},SampleAttribute:[],
                                    SampleCostFactors:[],SamplePaymentSchedule:[],SampleAttachments:[],SampleDocument:[],SampleNotes:[],SampleDeliverables:[]});
                                }
                            }
                            
                            
                            
                        }
                        for (var alsV1 = 0; alsV1 < line.SUPPLIERS.length; alsV1++) {
                            for (var alsV2 = 0; alsV2 < this.rfqModel.table50.length; alsV2++) {
                                if (line.SUPPLIERS[alsV1].rfqPartLineId == this.rfqModel.table50[alsV2].rfqPartLineId && line.SUPPLIERS[alsV1].supplierID == this.rfqModel.table50[alsV2].supplierId) {
                                    line.SUPPLIERS[alsV1].lineRow=this.rfqModel.table50[alsV2];
                                    line.SUPPLIERS[alsV1].SampleAttribute = this.bindPartLineAttribute(line,line.SUPPLIERS[alsV1].supplierID);
                                    line.SUPPLIERS[alsV1].SampleCostFactors = this.bindPartLineCF(line,line.SUPPLIERS[alsV1].supplierID);
                                    line.SUPPLIERS[alsV1].SamplePaymentSchedule= this.bindPartLinePS(line,line.SUPPLIERS[alsV1].supplierID);
                                    line.SUPPLIERS[alsV1].SampleAttachments= this.bindPartLineAttachment(line,line.SUPPLIERS[alsV1].supplierID);
                                    line.SUPPLIERS[alsV1].SampleDocument= this.bindPartLineDT(line,line.SUPPLIERS[alsV1].supplierID);
                                    line.SUPPLIERS[alsV1].SampleNotes= this.bindPartLineNotes(line,line.SUPPLIERS[alsV1].supplierID);
                                    line.SUPPLIERS[alsV1].SampleDeliverables= this.bindPartLineDel(line,line.SUPPLIERS[alsV1].supplierID);
                                }
                            }
                        }
                    }

                    // var dtLineAttr=this.rfqModel.table11;
                    // if (dtLineAttr)//Line Attribute
                    // {
                       
                    //     line.SampleAttribute = this.bindPartLineAttribute(line);
                    //     line.SampleCostFactors = this.bindPartLineCF(line);
                    //     line.SamplePaymentSchedule= this.bindPartLinePS(line);
                    //     line.SampleAttachments= this.bindPartLineAttachment(line);
                    //     line.SampleDocument= this.bindPartLineDT(line);
                    //     line.SampleNotes= this.bindPartLineNotes(line);
                    //     line.SampleDeliverables= this.bindPartLineDel(line);
                    // }

                
                    this.Lines_DataSource.push(line);
            }
            // this.Lines_DataSource = linesList;
        }
    }

bindPartLineAttribute(line,supplierId)
{
    
    let attributeListsData:any = []
                    var dtLineAttr=this.rfqModel.table11;
                    if (dtLineAttr)//Line Attribute
                    {
                        for (var al = 0; al < dtLineAttr.length; al++) {
                            if(line.id==dtLineAttr[al].rfqPartLineId)
                            {
                                let attributeListData = { ATTRIBUTES: [], ATTRIBUTE_ITEMS: [], SUPPLIERS: [] }
                                attributeListData.ATTRIBUTES.push({ title: dtLineAttr[al].title, name: dtLineAttr[al].name, group: dtLineAttr[al].groupName })
                                attributeListData.ATTRIBUTE_ITEMS.push({ item: dtLineAttr[al].attributeName, description: dtLineAttr[al].attributeDescription, value: dtLineAttr[al].expectedValue })
                
                                if (this.rfqModel.table26) {
                                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                                        for (var alsV = 0; alsV < this.rfqModel.table41.length; alsV++) {
                                            if(dtLineAttr[al].id==this.rfqModel.table41[alsV].rfqPartLineAttributeId && this.rfqModel.table26[als].supplierID==this.rfqModel.table41[alsV].supplierID && this.rfqModel.table26[als].supplierID==supplierId)
                                            {
                                                attributeListData.SUPPLIERS.push({ name: this.rfqModel.table26[als].supplierName, value: this.rfqModel.table41[alsV].targetValue, cost: this.rfqModel.table41[alsV].cost, Comments: this.rfqModel.table31[alsV].supplierComment });
                                            }
                                        }
                                        
                                    }
                                }
                                attributeListsData.push(attributeListData);
                            }
                           
                        }
                        line.SampleAttribute = attributeListsData;
                    }
                    return attributeListsData;
}


bindPartLineCF(line,supplierId)
{
    
    let cfListsData:any = [];
    var table=this.rfqModel.table12;
        if (this.rfqModel.table12)//Header Cost Factor
        {
            for (var al = 0; al < table.length; al++) {
                if(line.id==table[al].rfqPartLineId)
                {
                    let cfData = { CostFactors: [], CostFactorItems: [], SupplierResponces1: [] }
                    cfData.CostFactors.push({ list: table[al].title, description: table[al].name })
                    cfData.CostFactorItems.push({ name: table[al].costFactorName, description: table[al].cfDescription, type: table[al].attributeCategoryName, value: table[al].expectedValue })
    
                    if (this.rfqModel.table26) {
                        for (var als = 0; als < this.rfqModel.table26.length; als++) {
                            for (var alsV = 0; alsV < this.rfqModel.table42.length; alsV++) {
                                if(table[al].id==this.rfqModel.table42[alsV].rfqPartLineCostFactorID && this.rfqModel.table26[als].supplierID==this.rfqModel.table42[alsV].supplierID && this.rfqModel.table26[als].supplierID==supplierId)
                                {
                                    cfData.SupplierResponces1.push({ name: this.rfqModel.table26[als].supplierName, value: this.rfqModel.table42[alsV].supplierResponse, Comments: this.rfqModel.table42[alsV].supplierComment});
                                }
                            }
                            
                        }
                    }
                    cfListsData.push(cfData);
                }
                
            }
            
        }
                    return cfListsData;
}


bindPartLinePS(line,supplierId)
{
    
        let psListsData:any = []
        var table=this.rfqModel.table13;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                if (line.id == table[al].rfqPartLineId) {
                    let psListData = { PaymentSchedule: [], Responces1: [], PaymentSchedulebySuppliers: [] }
                    psListData.PaymentSchedule.push({
                        no: table[al].payScheduleNo, description: table[al].description, work: table[al].workPercentage
                        , milestone: table[al].milestone, payment: table[al].paymentPercentage, retention: table[al].retentionPercentage
                        , release: table[al].releasePercentage, value: table[al].releaseValue
                    });
                    psListData.PaymentSchedulebySuppliers.push({
                        no: table[al].payScheduleNo, description: table[al].description, work: table[al].workPercentage
                        , milestone: table[al].milestone, payment: table[al].paymentPercentage, retention: table[al].retentionPercentage
                        , release: table[al].releasePercentage, value: table[al].releaseValue
                    })


                    if (this.rfqModel.table26) {
                        for (var als = 0; als < this.rfqModel.table26.length; als++) {
                            for (var alsV = 0; alsV < this.rfqModel.table43.length; alsV++) {
                                if(table[al].id==this.rfqModel.table43[alsV].rfqPartLinePaymentScheduleId && this.rfqModel.table26[als].supplierID==this.rfqModel.table43[alsV].supplierID && this.rfqModel.table26[als].supplierID==supplierId)
                                {
                                    
                                    var currentPS=this.rfqModel.table43[alsV];
                                psListData.Responces1.push({ name: this.rfqModel.table26[als].supplierName, no: currentPS.paySchedNo, description: currentPS.description, 
                                    work: currentPS.workPercentage, milestone: currentPS.mlestonePercentage, payment: currentPS.paymentPercentage
                                    , retention: currentPS.retentionPercentage, release: currentPS.relesePercentage, value: currentPS.releasevalue });
                                }
                            }
                            
                        }
                    }
                    psListsData.push(psListData);
                }
            }
           
        }
                    return psListsData;
}

bindPartLineAttachment(line,supplierId)
{
    
        let attachList:any = []
        var table=this.rfqModel.table14;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                if (line.id == table[al].rfqPartLineId) {
                let attachment = { Attachments: [], AttachmentResponces: [] }
                attachment.Attachments.push({ no: table[al].srNo, titleName: table[al].title, fileName: table[al].fileName,Attachemnt: table[al].fileName
                ,Type: table[al].type});
                
                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table45.length; alsV++) {
                            if(table[al].id==this.rfqModel.table45[alsV].rfqPartLineAttachmentId && this.rfqModel.table26[als].supplierID==this.rfqModel.table45[alsV].supplierId && this.rfqModel.table26[als].supplierID==supplierId)
                            {
                                
                                var currentAtt=this.rfqModel.table45[alsV];
                                attachment.AttachmentResponces.push({ name: this.rfqModel.table26[als].supplierName, responces: currentAtt.fileName, Comments: currentAtt.comment });
                            }
                        }
                        
                    }
                }
                attachList.push(attachment);
            }
            }
            // line.SampleAttachments = attachList;
        }
        return attachList;
}

bindPartLineDT(line,supplierId)
{
    let docList:any = []
    var table=this.rfqModel.table15;
    if (table)//Header Payment Schedules
    {
        for (var al = 0; al < table.length; al++) {
            if (line.id == table[al].rfqPartLineId) {
            let document = { Documents: [], DocumentResponces: [] }
            document.Documents.push({ no: table[al].phraseID});
            
            if (this.rfqModel.table26) {
                for (var als = 0; als < this.rfqModel.table26.length; als++) {
                    for (var alsV = 0; alsV < this.rfqModel.table46.length; alsV++) {
                        if(table[al].id==this.rfqModel.table46[alsV].rfqPartLineDocumentTextId && this.rfqModel.table26[als].supplierID==this.rfqModel.table46[alsV].supplierID && this.rfqModel.table26[als].supplierID==supplierId)
                        {
                            
                            var currentDT=this.rfqModel.table46[alsV];
                                document.DocumentResponces.push({ name: this.rfqModel.table26[als].supplierName, responces: currentDT.supplierResponse, Comments: currentDT.comment });
                        }
                    }
                    
                }
            }
            docList.push(document);
        }
        }
        return docList;
    }
}

bindPartLineNotes(line,supplierId)
{
    let noteList:any = []
    var table=this.rfqModel.table16;
    if (table)//Header Payment Schedules
    {
        for (var al = 0; al < table.length; al++) {
            if (line.id == table[al].rfqPartLineId) {
            let note = { Notes: [], NotesResponces: [] }
            note.Notes.push({ no: table[al].description});
            
            if (this.rfqModel.table26) {
                for (var als = 0; als < this.rfqModel.table26.length; als++) {
                    for (var alsV = 0; alsV < this.rfqModel.table47.length; alsV++) {
                        if(table[al].id==this.rfqModel.table47[alsV].rfqPartLineNoteId && this.rfqModel.table26[als].supplierID==this.rfqModel.table47[alsV].supplierId && this.rfqModel.table26[als].supplierID==supplierId)
                        {
                            
                            var currentNote=this.rfqModel.table47[alsV];
                            note.NotesResponces.push({ name: this.rfqModel.table26[als].supplierName, responces: currentNote.description, Comments: currentNote.comment });
                        }
                    }
                    
                }
            }
            noteList.push(note);
        }
        }
        return noteList;
    }
}

bindPartLineDel(line,supplierId)
{
    let deliverableList:any = []
        var table=this.rfqModel.table17;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                if (line.id == table[al].rfqPartLineId) {
                let deliverable = { Deliverables: [],DeliverableResponces1:[], DeliverablesbySuppliers: [] }
                deliverable.Deliverables.push({ no: table[al].mileStoneNo,name:table[al].name,description:table[al].description
                    ,milestone:table[al].progressPercentageMilestone,progress:table[al].mileStoneNo,stageProgress:table[al].accumulatedCompletion,date:table[al].beginDate});
                    
                    deliverable.DeliverablesbySuppliers.push({ no: table[al].mileStoneNo,name:table[al].name,description:table[al].description
                        ,milestone:table[al].progressPercentageMilestone,progress:table[al].mileStoneNo,stageProgress:table[al].accumulatedCompletion,date:table[al].beginDate});

                if (this.rfqModel.table26) {
                    for (var als = 0; als < this.rfqModel.table26.length; als++) {
                        for (var alsV = 0; alsV < this.rfqModel.table44.length; alsV++) {
                            if(table[al].id==this.rfqModel.table44[alsV].rfqPartLineDeliverableId && this.rfqModel.table26[als].supplierID==this.rfqModel.table44[alsV].supplierID && this.rfqModel.table26[als].supplierID==supplierId)
                            {
                                // deliverable.DeliverableResponces1.push({ name: this.rfqModel.table26[als].supplierName, responces: '', Comments: '' });
                                var currentDel=this.rfqModel.table44[alsV];
                                deliverable.DeliverablesbySuppliers.push({ name: this.rfqModel.table26[als].supplierName, 
                                    no: currentDel.milestone, milestoneName: currentDel.milestoneName,description:currentDel.description,milestone:currentDel.milestone
                                    ,progress:currentDel.progress,stageProgress:currentDel.stageProgress,date:currentDel.beginDate });
                            }
                        }
                        
                    }
                }
                deliverableList.push(deliverable);
            }
            }
            return deliverableList;
        }
}

    bindRulesHeader(){
  
        this.Rules_RFX_header_DataSource = [];
        
        var table=this.rfqModel.table20;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                
                this.Rules_RFX_header_DataSource.push({ select: false,name:table[al].lookUpName,t:table[al].technical =="YES" ? true : false
                    ,c:table[al].commercial =="YES" ? true : false});
                    
                
                
            }
            // this.Lines_DataSource = linesList;
        }
    }
    bindRulesLines(){
        
              this.Rules_Lines_header_DataSource = [];
              
              var table=this.rfqModel.table21;
              if (table)//Header Payment Schedules
              {
                  for (var al = 0; al < table.length; al++) {
                      
                      this.Rules_Lines_header_DataSource.push({ select: false,name:table[al].lookUpName,t:table[al].technical =="YES" ? true : false
                          ,c:table[al].commercial =="YES" ? true : false});
                          
                      
                      
                  }
                  // this.Lines_DataSource = linesList;
              }
          }

          bindCollaborationTeam()
          {
            this.Team_Inormation_DataSource=[];
            var table=this.rfqModel.table19;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {
                
                this.Team_Inormation_DataSource.push({ 
                        name:table[al].userName,
                role: table[al].rfxRole,
                substitute: table[al].substituteName,
                access: table[al].accessLevel,
                pages: table[al].pageWithAccess,
                teamName: table[al].teamName,
                description: table[al].teamDescription,
                });
                    
                
                
            }
            // this.Lines_DataSource = linesList;
        }
            // {
            
            // }
          }

    bindSupplier() {
        this.Supplier_Inormation_DataSource = [];
        var table = this.rfqModel.table18;
        if (table)//Header Payment Schedules
        {
            for (var al = 0; al < table.length; al++) {

                this.Supplier_Inormation_DataSource.push({
                    supplierID: table[al].ifsSupplierId,
                    name: table[al].supplierName,
                    invitedOn: table[al].invitationDate,
                    supplierContact: table[al].supplierContactName,
                    emailID: table[al].email,
                    currencies: table[al].currencys,
                    status: table[al].supplierStatus,
                });



            }
            // this.Lines_DataSource = linesList;
        }
        // {

        // }
    }
    bindEvaluationData() {
        this.bindSupplierHeaderInformations();
        this.bindHeaderAttributeEvaluationData();
        this.bindHeaderCFEvaluationData();
        this.bindHeaderPSEvaluationData();
        this.bindHeaderAttachEvaluationData();
        this.bindHeaderDTEvaluationData();
        this.bindHeaderNotesEvaluationData();
        this.bindHeaderDeliEvaluationData();
        this.bindEvaluationPartLines();
        this.bindFinalScore();
        this.bindCBA();
    }
    bindCBA()
    {
this.bidDetails_DataSource=[];
var table = this.rfqEvaluationModel.table17;
        if (table)
        {
            for (var k = 0; k < table.length; k++) {
                this.bidDetails_DataSource.push({name:table[k].supplierName,items:table[k].totalLineItems,total:table[k].totalPrice});
            }
        }

        this.getCBA();
    }
    dynamicdata: any = [];
    generalData: any = [];
    evaluationData: any = [];
    partLines: any = [];

    getCBA(){
      
        const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading CBA....' } });
        let cbaModel = { rfqId: this.rfqId, supplierIDs: [], partLineIDs: [], isTechnical: true, isCommercial: true, isTechnicalCommercial: true };
        this.rfqService.getCBA(cbaModel).subscribe(result => {
            
            refference.close();
            this.partLines = [];
            this.dynamicdata = [];
            this.dynamicdata = result.data;
            // this.suppliers=[];
            // this.suppliers=this.dynamicdata.rfqSuppliers;
            this.generalData = [];
            this.evaluationData = [];
            for (var i = 0; i < this.dynamicdata.partLinesData.length; i++) {
                let partLine = this.dynamicdata.partLinesData[i];
                if(partLine)
                {
                    this.displayedColumns_lineItemBreakdown = Object.keys(
                        partLine
                    );
                }
                
                partLine.generalData = [];
                partLine.scores = [];
                partLine.evaluationData = [];
                partLine.ranks = [];
                partLine.chartOptionsRanks;
                partLine.chartOptionsScores;
               
                
                let partlineFilterdataData = this.dynamicdata.supplierData.filter(function (el) { return el.rfqPartLineID == partLine.id; });
                if(partlineFilterdataData)
                {
                    for (var y = 0; y < partlineFilterdataData.length; y++) {
                        let plDynamicData:any={};
                        Object.keys(partlineFilterdataData[y]).forEach(function(key,index) {
                            // key: the name of the object key
                            // index: the ordinal position of the key within the object 
                            plDynamicData[key]=partlineFilterdataData[y][key];
                        });
                        delete plDynamicData.rfqPartLineID;  
                        this.supplierResponseDetails.push(plDynamicData);
                    }
                }
                if(supplierResponseDetails)
                {
                    if(supplierResponseDetails.length>0)
                    {
                        this.columnNames = Object.keys(this.supplierResponseDetails[0]);
                    }
                }
                
                this.getPartLineChart(partLine);
                this.partLines.push(partLine);

            }
            for (var i = 0; i < this.dynamicdata.supplierData.length; i++) {
                if (!((this.dynamicdata.supplierData[i].id == "Score") || (this.dynamicdata.supplierData[i].id == "Bid Acceptance") || (this.dynamicdata.supplierData[i].id == "Evaluator"))) {
                    this.generalData.push(this.dynamicdata.supplierData[i]);
                }
                if (((this.dynamicdata.supplierData[i].id == "Score") || (this.dynamicdata.supplierData[i].id == "Bid Acceptance") || (this.dynamicdata.supplierData[i].id == "Evaluator"))) {
                    this.evaluationData.push(this.dynamicdata.supplierData[i]);
                }
            }
            
            
        });
    }

    getPartLineChart(rfqPartLine:any)
    {
        
        // let supplierNames = [];
        let supplierTBEscores = [];
        let supplierCBEscores = [];
        let supplierranks = [];
                // for (var i = 0; i < this.dynamicdata.suppliers.length; i++) {
                //     supplierNames.push(this.dynamicdata.suppliers[i].supplierName);
                // }
                for (var i = 0; i < this.dynamicdata.scores.length; i++) {
                    if(rfqPartLine.id==this.dynamicdata.scores[i].rfqPartLineId && this.dynamicdata.scores[i].categoryName=="Technical")
                    {
                        supplierTBEscores.push({name:this.dynamicdata.scores[i].supplierName,value:this.dynamicdata.scores[i].supplierScore});
                    }
                    else if(rfqPartLine.id==this.dynamicdata.scores[i].rfqPartLineId && this.dynamicdata.scores[i].categoryName=="Commercial")
                    {
                        supplierCBEscores.push({name:this.dynamicdata.scores[i].supplierName,value:this.dynamicdata.scores[i].supplierScore});
                    }
                    
                }
                let supplierNameRanks = [];
                for (var i = 0; i < this.dynamicdata.ranks.length; i++) {
                    if(rfqPartLine.id==this.dynamicdata.ranks[i].rfqPartLineId)
                    {
                        supplierranks.push({name:this.dynamicdata.ranks[i].supplierName,value:this.dynamicdata.ranks[i].supplierRank});
                        // supplierNameRanks.push(this.dynamicdata.ranks[i].supplierName);
                    }
                    
                }
    
                rfqPartLine.supplier_Price_chartdata=[{supplier: 'Supplier',data:supplierranks}]
                rfqPartLine.supplier_TBE_chartdata=[{supplier: 'Supplier',data:supplierTBEscores}]
                rfqPartLine.supplier_CBE_chartdata=[{supplier: 'Supplier',data:supplierCBEscores}]
                // [
                //     {
                //         supplier: 'Supplier',
                //         data: [
                //             { name: 'Supplier A', value: 8 },
                //             { name: 'Supplier B', value: 5 },
                //             { name: 'Supplier C', value: 3 },
                //             { name: 'Supplier D', value: 4 },
                //         ],
                //     },
                // ];
    
                
    
                return rfqPartLine;
    }

    bindFinalScore(){
        this.technicalEvaluation_Score_DataSource = [];
        this.commercialEvaluation_Score_DataSource = [];
        
        var table = this.rfqEvaluationModel.table15;
        if (table)//Header Payment Schedules
        {
            let technicalFinalScore = table.filter(function (el) { return el.categoryName == "Technical"; });
            if(technicalFinalScore)
            {
                for (var m = 0; m < technicalFinalScore.length; m++) {
                    this.technicalEvaluation_Score_DataSource.push({name:technicalFinalScore[m].supplierName,finalScore:technicalFinalScore[m].tbe})
                }
            }
            let commercialFinalScore = table.filter(function (el) { return el.categoryName == "Commercial"; });
            if(commercialFinalScore)
            {
                for (var m = 0; m < commercialFinalScore.length; m++) {
                    this.commercialEvaluation_Score_DataSource.push({name:commercialFinalScore[m].supplierName,finalScore:commercialFinalScore[m].tbe})
                }
            }
            
        }
    }
    bindHeaderAttributeEvaluationData() {
        
        this.Evaluation_Attribute_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }

            this.Evaluation_Attribute_Data = attsEvals;
          
           
                this.columnNames_Evaluation_Attribute_Data = Object.keys(
                    attsEvals[0]
                );

           

        }
    }
    bindHeaderCFEvaluationData() {
        
        this.Evaluation_CostFactors_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table1;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }

            this.Evaluation_CostFactors_Data = attsEvals;
            this.columnNames_Evaluation_CostFactors_Data = Object.keys(
                attsEvals[0]
            );

        }
    }
        bindHeaderPSEvaluationData() {
        
        this.Evaluation_PaymentSchedule_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table2;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }
            this.Evaluation_PaymentSchedule_Data = attsEvals;
            this.columnNames_Evaluation_PaymentSchedule_Data = Object.keys(
                attsEvals[0]
            );

        }
    }
    bindHeaderAttachEvaluationData() {
        
        this.Evaluation_Attachments_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table3;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }
            this.Evaluation_Attachments_Data = attsEvals;
            this.columnNames_Evaluation_Attachments_Data = Object.keys(
                attsEvals[0]
            );

        }
    }
      bindHeaderDTEvaluationData() {
        
        this.Evaluation_Document_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table4;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }
            this.Evaluation_Document_Data = attsEvals;
            this.columnNames_Evaluation_Document_Data = Object.keys(
                attsEvals[0]
            );

        }
    }
    bindHeaderNotesEvaluationData() {
        
        this.Evaluation_Notes_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table5;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }
            this.Evaluation_Notes_Data = attsEvals;
            this.columnNames_Evaluation_Notes_Dataa = Object.keys(
                attsEvals[0]
            );

        }
    }
    bindHeaderDeliEvaluationData() {
        
        this.Evaluation_Deliverables_Data = [];
        let attsEvals: any = [];
        var table = this.rfqEvaluationModel.table6;
        if (table)//Header Payment Schedules
        {
            let uniqueAttributes = table
                .map((item) => item.attributeId)
                .filter((value, index, self) => self.indexOf(value) === index);

            if (uniqueAttributes) {
                for (var k = 0; k < uniqueAttributes.length; k++) {
                    let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                    if (attributeNameObj) {

                        let data = {};
                        data["attributeName"] = attributeNameObj[0].attributeName;
                        data["description"] = attributeNameObj[0].description;
                        data["weights"] = attributeNameObj[0].weightInPoints;
                        let uniqueSuppliers = table
                            .map((item) => item.supplierId)
                            .filter((value, index, self) => self.indexOf(value) === index);


                        if (uniqueSuppliers) {
                            for (var m = 0; m < uniqueSuppliers.length; m++) {
                                let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                if (score) {


                                    data[score[0].supplierName] = score[0].score;
                                    


                                }
                            }
                        }
                        attsEvals.push(data);

                    }


                }
            }
            this.Evaluation_Deliverables_Data = attsEvals;
            this.columnNames_Evaluation_Deliverables_Data = Object.keys(
                attsEvals[0]
            );

        }
    }
    bindLineAttributeEvaluationData(evaluatorId,categoryName,lineId,line) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table7;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId && el.categoryName == categoryName; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m] && el.rfqPartLineId == lineId; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                line
                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                       
                        line.columnNames_Evaluation_LineAttribute_Data = Object.keys(
                                    attsEvals[0]
                                );
                           
                        
                    }
                }
                
            }


        }
        return attsEvals;
    }
    bindLineCFEvaluationData(evaluatorId,categoryName,lineId) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table8;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                
                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                        this.columnNames_Evaluation_CostFactors_Data = Object.keys(
                            attsEvals[0]
                        );
                    }
                }
                
            }


        }
        return attsEvals;
    }
    bindLinePSEvaluationData(evaluatorId,categoryName,lineId) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table9;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                        this.columnNames_Evaluation_PaymentSchedule_Data = Object.keys(
                            attsEvals[0]
                        );
                    }
                }
            }


        }
        return attsEvals;
    }
    bindLineAttachEvaluationData(evaluatorId,categoryName,lineId) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table10;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                
                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                        this.columnNames_Evaluation_Attachments_Data = Object.keys(
                            attsEvals[0]
                        );
                    }
                }
            }


        }
        return attsEvals;
    }
    bindLineDTEvaluationData(evaluatorId,categoryName,lineId) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table11;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                
                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                        this.columnNames_Evaluation_Document_Data = Object.keys(
                            attsEvals[0]
                        );
                    }
                }
            }


        }
        return attsEvals;
    }
    bindLineNotesEvaluationData(evaluatorId,categoryName,lineId) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table12;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                
                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                        this.columnNames_Evaluation_Notes_Dataa = Object.keys(
                            attsEvals[0]
                        );
                    }
                }
            }


        }
        return attsEvals;
    }
    bindLineDelEvaluationData(evaluatorId,categoryName,lineId) {
        
        
        let attsEvals: any = [];
        var ftable = this.rfqEvaluationModel.table13;
        if (ftable)//Header Payment Schedules
        {
            let table = ftable.filter(function (el) { return el.employeeId == evaluatorId && el.rfqPartLineId == lineId; });
            if (table) {
                let uniqueAttributes = table
                    .map((item) => item.attributeId)
                    .filter((value, index, self) => self.indexOf(value) === index);

                if (uniqueAttributes) {
                    for (var k = 0; k < uniqueAttributes.length; k++) {
                        let attributeNameObj = table.filter(function (el) { return el.attributeId == uniqueAttributes[k]; });
                        if (attributeNameObj) {

                            let data = {};
                            data["attributeName"] = attributeNameObj[0].attributeName;
                            data["description"] = attributeNameObj[0].description;
                            data["weights"] = attributeNameObj[0].weightInPoints;
                            let uniqueSuppliers = table
                                .map((item) => item.supplierId)
                                .filter((value, index, self) => self.indexOf(value) === index);


                            if (uniqueSuppliers) {
                                for (var m = 0; m < uniqueSuppliers.length; m++) {
                                    let score = table.filter(function (el) { return el.attributeId == uniqueAttributes[k] && el.supplierId == uniqueSuppliers[m]; });
                                    if (score) {


                                        data[score[0].supplierName] = score[0].score;



                                    }
                                }
                            }
                            attsEvals.push(data);

                        }


                    }
                }

                
                if(attsEvals)
                {
                    if(attsEvals.length>0)
                    {
                        this.columnNames_Evaluation_Deliverables_Data = Object.keys(
                            attsEvals[0]
                        );
                    }
                }
            }


        }
        return attsEvals;
    }
    bindEvaluationPartLines()
    {
        console.clear();

        this.evaluationLines = [];
        var table = this.rfqEvaluationModel.table14;
        if (table) {
            let uniqueLines = table
                .map((item) => item.rfqPartLineId)
                .filter((value, index, self) => self.indexOf(value) === index);

            for (var k = 0; k < uniqueLines.length; k++) {
                let lineNo = table.filter(function (el) { return el.rfqPartLineId == uniqueLines[k]; });
                let line = {
                    lineNo: lineNo[0].lineNumber, lineDesc: lineNo[0].description, t_attributeEvaluators: [], t_cfEvaluators: [], t_psEvaluators: []
                    , t_attachmentsEvaluators: [], t_dtsEvaluators: [], t_notesEvaluators: [], t_delsEvaluators: [], c_attributeEvaluators: [], c_cfEvaluators: [], c_psEvaluators: []
                    , c_attachmentsEvaluators: [], c_dtsEvaluators: [], c_notesEvaluators: [], c_delsEvaluators: []
                }
                // line["evaluators"]=[];
                let uniqueEmployee = table
                    .map((item) => item.employeeId)
                    .filter((value, index, self) => self.indexOf(value) === index);
                if (uniqueEmployee) {
                    let evaluators = [];
                    for (var m = 0; m < uniqueEmployee.length; m++) {
                        let employeeNameObj = table.filter(function (el) { return el.employeeId == uniqueEmployee[m]; });
                        if (employeeNameObj) {
                           
                            let t_attributeEvaluators=this.bindLineAttributeEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId,line) ;
                            line.t_attributeEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Attributes": t_attributeEvaluators});
                            line.t_cfEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "CFs": this.bindLineCFEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId) });
                            line.t_psEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "PSs": this.bindLinePSEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId) });
                            line.t_attachmentsEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Attachments": this.bindLineAttachEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId) });
                            line.t_dtsEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "DTs": this.bindLineDTEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId) });
                            line.t_notesEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Notes": this.bindLineNotesEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId) });
                            line.t_delsEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Deliverables": this.bindLineDelEvaluationData(uniqueEmployee[m], "Technical", lineNo[0].rfqPartLineId) });

                            let c_attributeEvaluators=this.bindLineAttributeEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId,line) ;
                            line.c_attributeEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Attributes": c_attributeEvaluators });
                            line.c_cfEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "CFs": this.bindLineCFEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId) });
                            line.c_psEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "PSs": this.bindLinePSEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId) });
                            line.c_attachmentsEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Attachments": this.bindLineAttachEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId) });
                            line.c_dtsEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "DTs": this.bindLineDTEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId) });
                            line.c_notesEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Notes": this.bindLineNotesEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId) });
                            line.c_delsEvaluators.push({ "evaluatorName": employeeNameObj[0].employeeName, "Deliverables": this.bindLineDelEvaluationData(uniqueEmployee[m], "Commercial", lineNo[0].rfqPartLineId) });
                        }
                    }

                }
                this.evaluationLines.push(line);

            }
        }


    }
    constructor(public dialog: MatDialog,private scoringService: ScoringService,private activatedRoute: ActivatedRoute, private _snackBar: MatSnackBar,private rfqService: RfqService) {
        this.proceedDownload = true;
        this.SampleAttribute = SampleAttribute;
        this.SampleCostFactors = SampleCostFactors;
        this.SamplePaymentSchedule = SamplePaymentSchedule;
        this.SampleAttachments = SampleAttachments;
        this.SampleDocument = SampleDocument;
        this.SampleNotes = SampleNotes;
        this.SampleDeliverables = SampleDeliverables;
        // this.supplier_chartdata = supplier_chartdata;
        // this.supplier_cost_chartdata = supplier_cost_chartdata;
        this.supplier_response_chartdata = [];
        this.summary_comparison_chartdata = summary_comparison_chartdata;
        this.awardedSupplier_chartdata = awardedSupplier_chartdata;
        this.totalAward_chartdata = totalAward_chartdata;
        // this.supplierResponseDetails = supplierResponseDetails;
        // this.Evaluation_Attribute_Data = Evaluation_Attribute_Data;
        // this.Evaluation_CostFactors_Data = Evaluation_CostFactors_Data;
        // this.Evaluation_PaymentSchedule_Data = Evaluation_PaymentSchedule_Data;
        // this.Evaluation_Attachments_Data = Evaluation_Attachments_Data;
        // this.Evaluation_Document_Data = Evaluation_Document_Data;
        // this.Evaluation_Notes_Data = Evaluation_Notes_Data;
        // this.Evaluation_Deliverables_Data = Evaluation_Deliverables_Data;
        activatedRoute.params.subscribe((params) => {
            this.rfqId = params['id'];
        });
        this.setROAChartsConfiguration();
    }
setROAChartsConfiguration()
{
    this.chartOptionsScores = {
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            hover: {
                filter: {
                    type: 'darken',
                    value: 0.2,
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        series: [
            {
                name: 'Price',
                data: []
            },
        ],
        chart: {
            height: 300,
            type: 'bar',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            }
        },
        fill: {
            type: 'solid',
            opacity: 1,
            colors: [
                '#0FA60C',
                '#438AFE',
                '#958F02',
            ],
        },

        plotOptions: {
            bar: {
                columnWidth: '40%',
                distributed: true,
                dataLabels: {
                    position: 'top' // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '';
            },
            offsetY: -20,
            offsetX: 0,
            style: {
                fontSize: '12px',
                colors: ['#464A53']
            }
        },
        legend: {
            show: false
        },
        grid: {
            show: false
        },
        yaxis: {
            title: {
                text: 'All Lines Price'
            }
        },
        xaxis: {
            categories: [
            ],
            labels: {
                style: {
                    colors: [
                        '#464A53',
                    ],
                    fontSize: '12px'
                }
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + '';
                }
            }
        }
    };

    this.chartOptionsTBERanks = {
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            hover: {
                filter: {
                    type: 'darken',
                    value: 0.2,
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        series: [
            {
                name: 'TBERank',
                data: []
            },
        ],
        chart: {
            height: 300,
            type: 'bar',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            }
        },
        fill: {
            type: 'solid',
            opacity: 1,
            colors: [
                '#0FA60C',
                '#438AFE',
                '#958F02',
            ],
        },

        plotOptions: {
            bar: {
                columnWidth: '40%',
                distributed: true,
                dataLabels: {
                    position: 'top' // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '';
            },
            offsetY: -20,
            offsetX: 0,
            style: {
                fontSize: '12px',
                colors: ['#464A53']
            }
        },
        legend: {
            show: false
        },
        grid: {
            show: false
        },
        yaxis: {
            title: {
                text: 'Average TBE Scores (Header + Lines)'
            }
        },
        xaxis: {
            categories: [
            ],
            labels: {
                style: {
                    colors: [
                        '#464A53',
                    ],
                    fontSize: '12px'
                }
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + '';
                }
            }
        }
    };

    this.chartOptionsCBERanks = {
        states: {
            normal: {
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
            hover: {
                filter: {
                    type: 'darken',
                    value: 0.2,
                }
            },
            active: {
                allowMultipleDataPointsSelection: false,
                filter: {
                    type: 'none',
                    value: 0,
                }
            },
        },
        series: [
            {
                name: 'CBERank',
                data: []
            },
        ],
        chart: {
            height: 300,
            type: 'bar',
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            }
        },
        fill: {
            type: 'solid',
            opacity: 1,
            colors: [
                '#0FA60C',
                '#438AFE',
                '#958F02',
            ],
        },

        plotOptions: {
            bar: {
                columnWidth: '40%',
                distributed: true,
                dataLabels: {
                    position: 'top' // top, center, bottom
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function (val) {
                return val + '';
            },
            offsetY: -20,
            offsetX: 0,
            style: {
                fontSize: '12px',
                colors: ['#464A53']
            }
        },
        legend: {
            show: false
        },
        grid: {
            show: false
        },
        yaxis: {
            title: {
                text: 'Average CBE Scores (Header + Lines)'
            }
        },
        xaxis: {
            categories: [
            ],
            labels: {
                style: {
                    colors: [
                        '#464A53',
                    ],
                    fontSize: '12px'
                }
            },
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + '';
                }
            }
        }
    };
}
    ngOnInit(): void {
        this.getTBECBEGrapgh();
        this.getScorings();
        this.rfqService.getRFQDataForExport(this.rfqId).subscribe(result => {
            
            
            this.rfqModel=result.model;
            
            if(this.rfqModel)
            {
                this.bindHeaderAttribute();
                this.bindHeaderCF();
                this.bindHeaderPS();
                this.bindHeaderAttachment();
                this.bindHeaderDT();
                this.bindHeaderNotes();
                this.bindHeaderDeliverables();
                this.bindPartLines();
                this.bindRulesHeader();
                this.bindRulesLines();
                this.bindCollaborationTeam();
                this.bindSupplier();
                

            }
          });

          const refference1 = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading Evaluations....' } });
          this.rfqService.getRFQEvaluationDataForExportPDF(this.rfqId).subscribe(result => {
            refference1.close();
            
            this.rfqEvaluationModel=result.model;
            
            if(this.rfqEvaluationModel)
            {
                this.bindEvaluationData();

            }
          });

          this.getROA();
          
    }

    getTBECBEGrapgh()
    {
        const refferenceGraph = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading Graph Data....' } });
        this.rfqService.getTBECBEGraphForReports(this.rfqId).subscribe(result => {
            
            refferenceGraph.close();
            let graphData=result.data;
            if (graphData) {
                if (graphData.table) {
                    if(graphData.table.length>0)
                    {
                        for (var j = 0; j < graphData.table.length; j++) {
                            let SupTBEData={"supplier":graphData.table[j].supplierName,"data":[]};
                            let SupCBEData={"supplier":graphData.table[j].supplierName,"data":[]};
                            let SupCBAData={"supplier":graphData.table[j].supplierName,"data":[]};
                            let data=[];
                            let tbeGraphData = graphData.table1.filter(function (el) { return el.categoryName == "Technical" && el.supplierID==graphData.table[j].supplierID; });
                            let cbeGraphData = graphData.table1.filter(function (el) { return el.categoryName == "Commercial" && el.supplierID==graphData.table[j].supplierID; });
                            if (tbeGraphData) {
                                if (tbeGraphData.length > 0) {
                                    
                                    for (var k = 0; k < tbeGraphData.length; k++) {
                                        data.push({"name":tbeGraphData[k].section,"value":tbeGraphData[k].supplierScore})
                                    }
                                }
                            }
                            SupTBEData["data"]=data;
                            data=[];
                            this.supplier_TBEchartdata.push(SupTBEData);
                            if (cbeGraphData) {
                                if (cbeGraphData.length > 0) {
                                    
                                    for (var k = 0; k < cbeGraphData.length; k++) {
                                        data.push({"name":cbeGraphData[k].section,"value":cbeGraphData[k].supplierScore})
                                    }
                                }
                            }
                

                            SupCBEData["data"]=data;
                            this.supplier_CBEchartdata.push(SupCBEData);
                            data=[];
                            let cbaGraphData = graphData.table2.filter(function (el) { return el.supplierId==graphData.table[j].supplierID; });
                            if (cbaGraphData) {
                                if (cbaGraphData.length > 0) {
                                    
                                    for (var k = 0; k < cbaGraphData.length; k++) {
                                        data.push({"name":cbaGraphData[k].lineNumber,"value":cbaGraphData[k].totalPrice})
                                    }
                                }
                            }
                            SupCBAData["data"]=data;
                            data=[];
                            this.supplier_cost_chartdata.push(SupCBAData);
                        } 
                    }
                    
                    
                   
                   
                }
            }
           
            
            
           
          });

    }
    scoringModel: any;
    getScorings(){
        
          const refferenceScore = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading Scorings....' } });
          
        this.scoringService.getScorings(this.rfqId).subscribe(result => {
            refferenceScore.close();
          this.scoringModel = result.data;
            if (this.scoringModel) {
                if (this.scoringModel.rfqHeaderScoringCriterias) {
                    for (var j = 0; j < this.scoringModel.rfqHeaderScoringCriterias.length; j++) {
                        if(this.scoringModel.rfqHeaderScoringCriterias[j].criteriaName=="Attribute Items")
                        {

                        }
                    }
                }
            }
          
            // this.CalculateHeaderTotal();
            // this.CalculatePartLineItemTotal();
            // this.CalculatePartLineTotal();
            //console.log(this.scoringModel)
      
        });
      }
      headerTotalPoints=0;
      headerTotalPercentage=0;
      partlineTotalPoints=0;
      partlineTotalPercentage=0;
      CalculateHeaderTotal(){
        this.headerTotalPoints=this.scoringModel.rfqHeaderScoringCriterias.filter(item => item.points >0)
        .reduce((sum, current) => sum + current.points, 0);
        this.headerTotalPercentage=this.scoringModel.rfqHeaderScoringCriterias.filter(item => item.percentatge >0)
        .reduce((sum, current) => sum + current.percentatge, 0);
      }
      CalculatePartLineTotal(){
        this.partlineTotalPoints=this.scoringModel.rfqPartLineScoringCriterias.filter(item => item.points >0)
        .reduce((sum, current) => sum + current.points, 0);
        this.partlineTotalPercentage=this.scoringModel.rfqPartLineScoringCriterias.filter(item => item.percentatge >0)
        .reduce((sum, current) => sum + current.percentatge, 0);
      }
      
      CalculatePartLineItemTotal(){
        this.scoringModel.rfqPartLineScoringCriterias.filter(part=>{
          part.totalPoint=part.rfqLineScoringCriteriaModel.filter(item => item.points >0)
          .reduce((sum, current) => sum + current.points, 0);
        })
        this.scoringModel.rfqPartLineScoringCriterias.filter(part=>{
          part.totalPercent=part.rfqLineScoringCriteriaModel.filter(item => item.percentatge >0)
          .reduce((sum, current) => sum + current.percentatge, 0);
        })
      }
    scroll(el: HTMLElement) {
        this.proceedDownload = true;
        el.scrollIntoView();
    }

    scrollToTop(): void {
        window.scrollTo(0, 0);
    }

    SelectRow(){
        this.expand = !this.expand;
    }

    openSnackBar() {
        this._snackBar.open('downloading..... please wait', '', {
            duration: this.durationInSeconds * 1000,
        });
    }

    toggleDisplay(id: string, obj) {
        var existingVal = this.detailsDisplayMap.get(id);
        if (existingVal) {
          this.detailsDisplayMap.set(id, !existingVal)
        } else {
          this.detailsDisplayMap.set(id, true)
        }
        obj.isShow = !obj.isShow;
      }
    
      detailsDisplayMapROA = new Map();
    
      public getActiveDetailsTab(id: string): boolean {
        return this.detailsDisplayMap.get(id) ? this.detailsDisplayMap.get(id) : false;
      }
    downloadPdf(value) {
        this.proceedDownload = false;
        this.openSnackBar();
        setTimeout(() => {
            let printSection = document.getElementById(value);
            html2canvas(printSection).then((canvas: any) => {
                let imgWidth = 208;
                let pageHeight = 295;
                let imgHeight = (canvas.height * imgWidth) / canvas.width;
                let heightLeft = imgHeight;
                let position = 0;
                heightLeft -= pageHeight;
                let doc = new jspdf('p', 'mm');
                doc.addImage(
                    canvas,
                    'PNG',
                    0,
                    position,
                    imgWidth,
                    imgHeight,
                    '',
                    'FAST'
                );
                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    doc.addPage();
                    doc.addImage(
                        canvas,
                        'PNG',
                        0,
                        position,
                        imgWidth,
                        imgHeight,
                        '',
                        'FAST'
                    );
                    heightLeft -= pageHeight;
                }
                doc.save(value + '.pdf');
                this.proceedDownload = true;
            });
        }, 100);  
    }
}
