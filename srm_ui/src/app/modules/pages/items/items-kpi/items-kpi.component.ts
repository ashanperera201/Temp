import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ItemDatatableComponent } from 'app/modules/common/item-datatable/item-datatable.component';
import { ItemTagsDatatableComponent } from 'app/modules/common/item-tags-datatable/item-tags-datatable.component';
import { ItemTagsDatatableModule } from 'app/modules/common/item-tags-datatable/item-tags-datatable.module';
import { environment } from 'environments/environment';
import { Workbook } from 'exceljs';
import moment from 'moment';
import * as fs from 'file-saver';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { KpiFields } from 'app/main/Models/Template';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';


export interface DashboardElement {
    supplierId: string;
    supplierCode: string;
    supplierName: string;
    status: string;
    location: string;
    country: string;
    auditCompletion: string;
    createdDate: string;
    lastSubmitDate: string;
    auditComDate: string;
    documentKpi: string;
    docKpiResult: string;
    gmApprovedDate: string;
    ifsCode: string;
    srmRecomDate: string;
    srmReviewDate: string;
    supSubmitDate: string;
    regisDuration: string;
    srmKpi: string;
    srmKpiResult: string;
    srmReviewDura: string;
    supplierClas: string;
    totCount: string;
    vpApprovedDate: string;
}



const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

@Component({
    selector: 'items-kpi',
    templateUrl: './items-kpi.component.html',
    styleUrls: ['./items-kpi.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]

})
export class ItemsKpiComponent {
    @ViewChild(ItemTagsDatatableComponent) child: ItemTagsDatatableComponent;
    @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;

    userrole: string = '';
    tagselected: any = 0;
    currentReqPage = '';
    dataSourceDashboardList: any = [];
    templateData: any = [];
    dataSourceDashboard = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
    isloadeddata = true;
    selectedList: any;
    iserror = false;
    DataToExport = [];
    SupplierCode: boolean = false;
    SupplierName: boolean = false;
    Status: boolean = false;
    IfsCode: boolean = false;
    Location: boolean = false;
    Country: boolean = false;
    SupplierClas: boolean = false;
    CreatedDate: boolean = false;
    LastSubmitDate: boolean = false;
    SrmReviewDate: boolean = false;
    AuditComDate: boolean = false;
    SrmRecomDate: boolean = false;
    GmApprovedDate: boolean = false;
    VpApprovedDate: boolean = false;
    SrmReviewDura: boolean = false;
    RegisDuration: boolean = false;
    AuditCompletion: boolean = false;
    DocumentKpi: boolean = false;
    DocKpiResult: boolean = false;
    SrmKpi: boolean = false;
    SrmKpiResult: boolean = false;
    allSelected: boolean = false;
    checkedList: any;
    filterValues = {};
    minDate = null;
    maxDate = null;

    errormessage = 'Select atleast one column';

    supplierNameModel = '';
    statusModel = '';
    supplierCodemodel = '';
    locationModel = '';
    ifscodemodel = '';
    countryModel = '';
    classificationModel = '';
    supplierCode = '';
    createddatefrom = '';
    createddateto = '';
    lastsupsubmitdatefrom = '';
    lastsupsubmitdateto = '';
    srmreviewfrom='';
    srmreviewto='';
    auditcompletefrom='';
    auditcompleteto='';
    srmrecomfrom='';
    srmrecomto='';
    gmapprovedfrom='';
    gmapprovedto='';
    vpapprovedfrom ='';
    vpapprovedto ='';

    srmreviewdurModel = '';
    regisdurModel = '';
    auditcomModel= '';
    deptkpiResultModel='';
    srmkpiModel='';
    srmkpiResultModel = '';
    city = '';
    postalcode = '';
    adressline1 = '';
    firstname = '';
    email = '';
    crno = '';
    typeoforg = '';
    vatno = '';
    tempData: DashboardElement[];
    totalSize = 0;

    minCreatedDate = null;
    maxCreatedDate = null;

    ColumnList = [
        { name: 'Status', isSelected: false, val: 'Status' },
        { name: 'IFS Code', isSelected: false, val: 'IfsCode' },
        { name: 'Location', isSelected: false, val: 'Location' },
        { name: 'Country', isSelected: false, val: 'Country' },
        { name: 'Supplier Classification', isSelected: false, val: 'SupplierClassification' },
        { name: 'Created Date', isSelected: false, val: 'CreatedDate' },
        { name: 'Last Supplier Submitted Date', isSelected: false, val: 'LastSubmitDate' },
        { name: 'Last SRM Review Date', isSelected: false, val: 'SrmReviewDate' },
        { name: 'Audit Complete Date', isSelected: false, val: 'AuditCompleteDate' },
        { name: 'SRM Recommended Date', isSelected: false, val: 'SrmRecommendedDate' },
        { name: 'GM Approved Date', isSelected: false, val: 'GmApprovedDate' },
        { name: 'VP Approved Date', isSelected: false, val: 'VpApprovedDate' },
        { name: 'SRM Review Duration', isSelected: false, val: 'SrmReviewDuration' },
        { name: 'Registration Duration', isSelected: false, val: 'RegisDuration' },
        { name: 'Audit Completion', isSelected: false, val: 'AuditCompletion' },
        { name: 'Department KPI', isSelected: false, val: 'DepartmentKpi' },
        { name: 'Department KPI Result', isSelected: false, val: 'DepartmentKpiResult' },
        { name: 'SRM KPI', isSelected: false, val: 'SrmKpi' },
        { name: 'SRM KPI Result', isSelected: false, val: 'SrmKpiResult' }
    ];

    displayedDashboardColumns: string[] = ['supplierCode', 'supplierName', 'status', 'ifsCode', 'location', 'country', 'supplierClas',
        'createdDate', 'lastSubmitDate', 'srmReviewDate', 'auditComDate', 'srmRecomDate', 'gmApprovedDate', 'vpApprovedDate', 'srmReviewDura', 'regisDuration',
        'auditCompletion', 'documentKpi', 'docKpiResult', 'srmKpi', 'srmKpiResult'];

    constructor(private http: HttpClient,private router: Router,private datePipe: DatePipe) {
        this.userrole = localStorage.getItem("userrole");
        this.filterValues = JSON.parse(localStorage.getItem('kpifilter'));
        this.filterValues = this.filterValues == null ? {} : this.filterValues;

        this.getSuppliers();
        this.RemoveAllFilters();
        this.dataSourceDashboard.paginator = this.tableOnePaginator;
    }

    RemoveAllFilters() {
        localStorage.removeItem('reportfilter');
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfilter-e');
    }

    ExportToExcel() {
        if (this.selectedList != undefined) {
            if (this.selectedList.length > 0) {
                this.iserror = false;
                this.selectedValue();
                var count: number = 0;
                this.DataToExport = [];

                if (count == 0) {
                    var kpiDto = new KpiFields();
                    kpiDto.startindex = 0;
                    kpiDto.pagesize = Number(this.dataSourceDashboard.data[0].totCount);

                    for (let key in this.filterValues) {
                        let filtervalue = this.filterValues[key];
                        var type = key;

                        if (type == "supplierCode") { kpiDto.suppliercode = filtervalue; }
                        else if (type == "supplierName") { kpiDto.suppliername = filtervalue; }
                        else if (type == "status") { kpiDto.status = filtervalue; }
                        else if (type == "ifscode") { kpiDto.ifscode = filtervalue; }
                        else if (type == "location") { kpiDto.location = filtervalue; }
                        else if (type == "country") { kpiDto.country = filtervalue; }
                        else if (type == "classification") { kpiDto.classification = filtervalue; }
                        else if (type == "createddatefrom") { kpiDto.createdfrom = filtervalue; }
                        else if (type == "createddateto") { kpiDto.createdto = filtervalue; }
                        else if (type == "lastsupsubmitdatefrom") { kpiDto.lastsubmitfrom = filtervalue; }
                        else if (type == "lastsupsubmitdateto") { kpiDto.lastsubmitto = filtervalue; }
                        else if (type == "srmreviewfrom") { kpiDto.srmreviewfrom = filtervalue; }
                        else if (type == "srmreviewto") { kpiDto.srmreviewto = filtervalue; }
                        else if (type == "auditcompletefrom") { kpiDto.auditcompletefrom = filtervalue; }
                        else if (type == "auditcompleteto") { kpiDto.auditcompleteto = filtervalue; }
                        else if (type == "srmrecomfrom") { kpiDto.srmrecomfrom = filtervalue; }
                        else if (type == "srmrecomto") { kpiDto.srmrecomto = filtervalue; }
                        else if (type == "gmapprovedfrom") { kpiDto.gmapprovedfrom = filtervalue; }
                        else if (type == "gmapprovedto") { kpiDto.gmapprovedto = filtervalue; }
                        else if (type == "vpapprovedfrom") { kpiDto.vpapprovedfrom = filtervalue; }
                        else if (type == "vpapprovedto") { kpiDto.vpapprovedto = filtervalue; }
                        else if (type == "srmreviewdur") { kpiDto.srmreviewdur = filtervalue; }
                        else if (type == "regisdur") { kpiDto.regisdur = filtervalue; }
                        else if (type == "auditcom") { kpiDto.auditcom = filtervalue; }
                        else if (type == "deptkpi") { kpiDto.deptkpi = filtervalue; }
                        else if (type == "deptkpiResult") { kpiDto.deptkpiResult = filtervalue; }
                        else if (type == "srmkpi") { kpiDto.srmkpi = filtervalue; }
                        else if (type == "srmkpiResult") { kpiDto.srmkpiResult = filtervalue; }
                    }

                    Swal.fire({
                        title: 'Please wait... We are generating the report!',
                        showConfirmButton: false,
                        allowOutsideClick: false
                    })
                    Swal.showLoading();

                    this.http.post<any>(environment.nodeurl + '/api/template/kpiData', kpiDto).subscribe(data2 => {
                        if (data2) {
                            var messagelist = data2;
                            for (var i = 0; i < messagelist.length; i++) {
                                var lastsrmreviewdate=moment(new Date(messagelist[i].lasT_SRM_REVIEW_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].lasT_SRM_REVIEW_DATE)).format('YYYY-MM-DD');
                                var lastsupsubmitteddate = moment(new Date(messagelist[i].lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD');
                                var lastsrmrecomdate = moment(new Date(messagelist[i].lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD');
                                var srmreviewduration=(messagelist[i].supplieR_CLASSIFICATION == '' && messagelist[i].status== 'Awaiting Clarification from Supplier')?'N/A':(Number(messagelist[i].srM_REVIEW_DURATION)<0?0:Number(messagelist[i].srM_REVIEW_DURATION));
                                var registrationduration=(messagelist[i].supplieR_CLASSIFICATION == '' && messagelist[i].status== 'Awaiting Clarification from Supplier')?'N/A':(Number(messagelist[i].registratioN_DURATION)<0?0:Number(messagelist[i].registratioN_DURATION));
                                var auditcompletion = (messagelist[i].supplieR_CLASSIFICATION == '' && messagelist[i].status== 'Awaiting Clarification from Supplier')?'N/A':(Number(messagelist[i].audiT_COMPLETION)<0?0:Number(messagelist[i].audiT_COMPLETION));
                                var documentkpi=messagelist[i].supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(messagelist[i].departmenT_KPI) < 0 ? 0 : messagelist[i].departmenT_KPI);
                                var srmkpi=messagelist[i].supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(messagelist[i].srM_KPI) < 0 ? 0 : messagelist[i].srM_KPI);

                                if(srmreviewduration !='N/A' && (Number(messagelist[i].srM_REVIEW_DURATION)<0)){
                                    if(srmkpi !='N/A')
                                    srmkpi = Number(srmkpi) - (Number(messagelist[i].srM_REVIEW_DURATION));
                                }

                                if(registrationduration !='N/A' && (Number(messagelist[i].registratioN_DURATION)<0)){
                                    if(documentkpi !='N/A')
                                    documentkpi = Number(documentkpi) - (Number(messagelist[i].registratioN_DURATION));
                                }

                                if(auditcompletion !='N/A' && (Number(messagelist[i].audiT_COMPLETION)<0)){
                                    if(documentkpi !='N/A'){
                                        documentkpi = Number(documentkpi) + (Number(messagelist[i].audiT_COMPLETION));
                                    }
                                    if(srmkpi !='N/A'){
                                        srmkpi = Number(srmkpi) + (Number(messagelist[i].audiT_COMPLETION));
                                    }
                                }

                                this.DataToExport.push({
                                    Id: i + 1,
                                    // SupplierCode: messagelist[i].position,
                                    supplierId: messagelist[i].supplieR_ID,
                                    supplierName: messagelist[i].supplieR_NAME,
                                    supplierCode: messagelist[i].supplieR_CODE,
                                    status: messagelist[i].status,
                                    ifsCode: messagelist[i].ifS_CODE,
                                    location: messagelist[i].supplieR_LOCATION,
                                    country: messagelist[i].country,
                                    supplierClas: messagelist[i].supplieR_CLASSIFICATION,
                                    createdDate: moment(new Date(messagelist[i].createD_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].createD_DATE)).format('YYYY-MM-DD'),
                                    lastSubmitDate: moment(new Date(messagelist[i].lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD'),
                                    srmReviewDate: lastsupsubmitteddate>lastsrmreviewdate?lastsrmrecomdate:lastsrmreviewdate,
                                    auditComDate: moment(new Date(messagelist[i].audiT_COMPLETION_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].audiT_COMPLETION_DATE)).format('YYYY-MM-DD'),
                                    srmRecomDate: messagelist[i].status == 'Awaiting for SRM Recommendation'?'' :(moment(new Date(messagelist[i].lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD')),
                                    gmApprovedDate: moment(new Date(messagelist[i].gM_APPROVED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].gM_APPROVED_DATE)).format('YYYY-MM-DD'),
                                    vpApprovedDate: moment(new Date(messagelist[i].vP_APPROVED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(messagelist[i].vP_APPROVED_DATE)).format('YYYY-MM-DD'),
                                    srmReviewDura: srmreviewduration,
                                    regisDuration: registrationduration,
                                    auditCompletion: auditcompletion,
                                    documentKpi:documentkpi == 'N/A' ? 'N/A': (Number(documentkpi)<0?0: Number(documentkpi)),
                                    docKpiResult: messagelist[i].supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(documentkpi)<16?'Meets KPI': 'Does not Meet KPI'),
                                    srmKpi: srmkpi== 'N/A' ? 'N/A': (Number(srmkpi)<0?0: Number(srmkpi)),
                                    srmKpiResult: messagelist[i].supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(srmkpi)<16?'Meets KPI': 'Does not Meet KPI'),

                                });

                                count = count + 1;
                            }
                        }
                        if (count == messagelist.length) {
                            var headerresult = this.DataToExport;

                            let workbook = new Workbook();
                            let worksheet = workbook.addWorksheet('All Suppliers');

                            var headertblformula = [];

                            for (var i = 0; i < 15; i++) {
                                headertblformula.push('');
                            }

                            headertblformula.push("Last SRM Review Date (K) - Last Supplier Submitted Date (J)");
                            headertblformula.push("VP Approved Date (O) - Last Supplier Submitted Date (J)");
                            headertblformula.push("Audit Completion Date (L) - Last SRM Review Date (K)");
                            headertblformula.push("Registration Duration (Q) - Audit Completion (R)");
                            headertblformula.push("=IF(Department KPI (S) <16,meets KPI,Doesn’t Meet KPI)");
                            headertblformula.push("SRM Review Duration (P) - Audit Completion (Q)");
                            headertblformula.push("=IF(SRM KPI (U) <16,Meets KPI,Doesn’t meet KPI)");

                            let headerformulaRow = worksheet.addRow(headertblformula);
                            headerformulaRow.font = { bold: true };

                            var headertbltitles = [];

                            headertbltitles.push("S. No");
                            headertbltitles.push("Supplier Code");
                            headertbltitles.push("Supplier Name");

                            for (var i = 0; i < this.selectedList.length; i++) {
                                if (this.selectedList[i]) {
                                    headertbltitles.push(this.selectedList[i].name);
                                }
                            }

                            headertbltitles.push("Year");
                            headertbltitles.push("Quarter");

                            let headerRow = worksheet.addRow(headertbltitles);
                            headerRow.font = { bold: true };

                            // colour the header
                            for (var i = 0; i < this.selectedList.length; i++) {
                                if (this.selectedList[i]) {
                                    worksheet.getRow(2).getCell(1).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'cccccc' },
                                        bgColor: { argb: 'd3d3d3' }
                                    };

                                    worksheet.getRow(2).getCell(2).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'cccccc' },
                                        bgColor: { argb: 'd3d3d3' }
                                    };

                                    worksheet.getRow(2).getCell(3).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'cccccc' },
                                        bgColor: { argb: 'd3d3d3' }
                                    };

                                    var num: number = 0;
                                    num = i + 4;
                                    worksheet.getRow(2).getCell(num).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'cccccc' },
                                        bgColor: { argb: 'd3d3d3' }
                                    };

                                    worksheet.getRow(2).getCell(23).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'cccccc' },
                                        bgColor: { argb: 'd3d3d3' }
                                    };

                                    worksheet.getRow(2).getCell(24).fill = {
                                        type: 'pattern',
                                        pattern: 'solid',
                                        fgColor: { argb: 'cccccc' },
                                        bgColor: { argb: 'd3d3d3' }
                                    };
                                }
                            }

                            headerresult.forEach(x => {
                                let row = [];
                                row.push(x.Id);

                                row.push(x.supplierCode);
                                row.push(x.supplierName);
                                if (this.Status) { row.push(x.status); }
                                if (this.IfsCode) { row.push(x.ifsCode); }
                                if (this.Location) { row.push(x.location); }
                                if (this.Country) { row.push(x.country); }
                                if (this.SupplierClas) { row.push(x.supplierClas); }
                                if (this.CreatedDate) { row.push(x.createdDate!=''?this.datePipe.transform(new Date(x.createdDate),'dd-MMM-yyyy'):''); }
                                if (this.LastSubmitDate) { row.push(x.lastSubmitDate!=''?this.datePipe.transform(new Date(x.lastSubmitDate),'dd-MMM-yyyy'):''); }
                                if (this.SrmReviewDate) { row.push(x.srmReviewDate!=''?this.datePipe.transform(new Date(x.srmReviewDate),'dd-MMM-yyyy'):''); }
                                if (this.AuditComDate) { row.push(x.auditComDate!=''?this.datePipe.transform(new Date(x.auditComDate),'dd-MMM-yyyy'):''); }
                                if (this.SrmRecomDate) { row.push(x.srmRecomDate!=''?this.datePipe.transform(new Date(x.srmRecomDate),'dd-MMM-yyyy'):''); }
                                if (this.GmApprovedDate) { row.push(x.gmApprovedDate!=''?this.datePipe.transform(new Date(x.gmApprovedDate),'dd-MMM-yyyy'):''); }
                                if (this.VpApprovedDate) { row.push(x.vpApprovedDate!=''?this.datePipe.transform(new Date(x.vpApprovedDate),'dd-MMM-yyyy'):''); }
                                if (this.SrmReviewDura) { row.push(x.srmReviewDura=='N/A'?'N/A':Number(x.srmReviewDura)); }
                                if (this.RegisDuration) { row.push(x.regisDuration=='N/A'?'N/A':Number(x.regisDuration)); }
                                if (this.AuditCompletion) { row.push(x.auditCompletion=='N/A'?'N/A':Number(x.auditCompletion)); }
                                if (this.DocumentKpi) { row.push(x.documentKpi == 'N/A' ?'N/A' :Number(x.documentKpi)); }
                                if (this.DocKpiResult) { row.push(x.docKpiResult); }
                                if (this.SrmKpi) { row.push(x.srmKpi == 'N/A' ?'N/A':Number(x.srmKpi)); }
                                if (this.SrmKpiResult) { row.push(x.srmKpiResult); }
                                { row.push(x.lastSubmitDate!=''?new Date(x.lastSubmitDate).getUTCFullYear():''); }
                                if(x.lastSubmitDate!=''){
                                    if(new Date(x.lastSubmitDate).getUTCMonth()<=3){row.push(1);}
                                    else if(new Date(x.lastSubmitDate).getUTCMonth()>3 && new Date(x.lastSubmitDate).getUTCMonth()<=6){row.push(2);}
                                    else if(new Date(x.lastSubmitDate).getUTCMonth()>6 && new Date(x.lastSubmitDate).getUTCMonth()<=9){row.push(3);}
                                    else if(new Date(x.lastSubmitDate).getUTCMonth()>9){row.push(4);}
                                    else {row.push('');}
                                }
                                
                                worksheet.addRow(row);
                            });

                            worksheet.addRow([]);

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

                            // Footer Row
                            var Footer_row: number = headerresult.length + 3;
                            var last_cell: number = this.selectedList.length + 1;
                            let footerRow = worksheet.addRow(['Report generated date - ' + moment().format('YYYY-MM-DD')]);
                            worksheet.mergeCells(Footer_row, 1, Footer_row, last_cell);

                            let worksheet2 = workbook.addWorksheet('Summary');
                            var headertbltitles2 = [];
                            let headerformulaRowdep =worksheet2.addRow([]);
                            worksheet2.mergeCells('A1:D1');
                            worksheet2.getCell('A1').value = "Deparment's KPI";
                            worksheet2.getCell('A1').alignment = {
                                horizontal: 'center'
                            };
                            worksheet2.getCell('E1').value = "2021";
                            worksheet2.getCell('E1').alignment = {
                                horizontal: 'right'
                            };
                            headerformulaRowdep.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerformulaRowdep.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            headerformulaRowdep.font = { bold: true,size: 16 };

                            worksheet2.columns.forEach((column) => {
                                let maxColumnLength = 0;
                                column.eachCell({ includeEmpty: true }, (cell) => {
                                    maxColumnLength = Math.max(
                                        maxColumnLength,
                                        10,
                                        cell.value ? cell.value.toString().length : 0
                                    );
                                });
                                column.width = maxColumnLength + 20;
                            });

                            headertbltitles2.push("Year 2021 Q1(Jan-March)");
                            headertbltitles2.push("Total Supplier(Department KPI Result)");
                            headertbltitles2.push("Meets KPI");
                            headertbltitles2.push("Does not meet KPI");
                            headertbltitles2.push("Not Applicable");
                            let headerRow2 = worksheet2.addRow(headertbltitles2);
                            headerRow2.font ={ bold: true};
                            headerRow2.alignment ={ horizontal: 'center'};
                            headerRow2.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRow2.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRow2.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRow2.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRow2.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(2).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }
                            

                            var totcount = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptmeetcount = this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptdonotmeetcount = this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var deptnotappcount = totcount-(dptmeetcount + dptdonotmeetcount);
                            var srmmeetcount = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmdonotmeetcount = this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmnotappcount = totcount-(srmmeetcount + srmdonotmeetcount);

                            let row2 = [];
                            row2.push("Data");
                            row2.push(totcount);
                            row2.push(dptmeetcount);
                            row2.push(dptdonotmeetcount);
                            row2.push(deptnotappcount);
                            let r1 = worksheet2.addRow(row2);
                            r1.font ={ bold: true};
                            r1.alignment ={ horizontal: 'center'};
                            r1.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r1.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r1.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r1.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r1.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            let row3 = [];
                            row3.push("Percentage");
                            row3.push("");
                            row3.push(dptmeetcount>0 ?((dptmeetcount/totcount)*100).toFixed(2)+"%":"0%");
                            row3.push(dptdonotmeetcount>0 ?((dptdonotmeetcount/totcount)*100).toFixed(2)+"%":"0%");
                            row3.push(deptnotappcount>0 ?((deptnotappcount/totcount)*100).toFixed(2)+"%":"0%");
                            let r2 = worksheet2.addRow(row3);
                            r2.font ={ bold: true};
                            r2.alignment ={ horizontal: 'center'};
                            r2.getCell(3).font={color:{argb: "00FF0000"}};
                            r2.getCell(4).font={color:{argb: "00FF0000"}};
                            r2.getCell(5).font={color:{argb: "00FF0000"}};
                            r2.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r2.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r2.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r2.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r2.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            var totcountq2 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptmeetcountq2= this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptdonotmeetcountq2= this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var deptnotappcountq2 = totcountq2-(dptmeetcountq2 + dptdonotmeetcountq2);
                            var srmmeetcountq2 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmdonotmeetcountq2 = this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmnotappcountq2 = totcountq2-(srmmeetcountq2 + srmdonotmeetcountq2);

                            var headertbltitlesq2 = [];
                            headertbltitlesq2.push("Year 2021 Q2(Apr-Jun)");
                            headertbltitlesq2.push("Total Supplier(Department KPI Result)");
                            headertbltitlesq2.push("Meets KPI");
                            headertbltitlesq2.push("Does not meet KPI");
                            headertbltitlesq2.push("Not Applicable");
                            let headerRowq2 = worksheet2.addRow(headertbltitlesq2);
                            headerRowq2.font ={ bold: true};
                            headerRowq2.alignment ={ horizontal: 'center'};
                            headerRowq2.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq2.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq2.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq2.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq2.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(5).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }
                            
                            let rowq2 = [];
                            rowq2.push("Data");
                            rowq2.push(totcountq2);
                            rowq2.push(dptmeetcountq2);
                            rowq2.push(dptdonotmeetcountq2);
                            rowq2.push(deptnotappcountq2);
                            let r3=worksheet2.addRow(rowq2);
                            r3.font ={ bold: true};
                            r3.alignment ={ horizontal: 'center'};
                            r3.alignment ={ horizontal: 'center'};
                            r3.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r3.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r3.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r3.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r3.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            let rowsrmq2= [];
                            rowsrmq2.push("Percentage");
                            rowsrmq2.push("");
                            rowsrmq2.push(dptmeetcountq2>0 ?((dptmeetcountq2/totcountq2)*100).toFixed(2)+"%":"0%");
                            rowsrmq2.push(dptdonotmeetcountq2>0 ?((dptdonotmeetcountq2/totcountq2)*100).toFixed(2)+"%":"0%");
                            rowsrmq2.push(deptnotappcountq2>0 ?((deptnotappcountq2/totcountq2)*100).toFixed(2)+"%":"0%");
                            let r4 = worksheet2.addRow(rowsrmq2);
                            r4.font ={ bold: true};
                            r4.alignment ={ horizontal: 'center'};
                            r4.getCell(3).font={color:{argb: "00FF0000"}};
                            r4.getCell(4).font={color:{argb: "00FF0000"}};
                            r4.getCell(5).font={color:{argb: "00FF0000"}};
                            r4.alignment ={ horizontal: 'center'};
                            r4.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r4.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r4.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r4.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r4.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            var headertbltitlesq3 = [];
                            headertbltitlesq3.push("Year 2021 Q3(Jul-Sep)");
                            headertbltitlesq3.push("Total Supplier(Department KPI Result)");
                            headertbltitlesq3.push("Meets KPI");
                            headertbltitlesq3.push("Does not meet KPI");
                            headertbltitlesq3.push("Not Applicable");
                            let headerRowq3 = worksheet2.addRow(headertbltitlesq3);
                            headerRowq3.font ={ bold: true};
                            headerRowq3.alignment ={ horizontal: 'center'};
                            headerRowq3.alignment ={ horizontal: 'center'};
                            headerRowq3.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq3.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq3.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq3.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq3.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(8).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }
                            var totcountq3 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptmeetcountq3= this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptdonotmeetcountq3= this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var deptnotappcountq3= totcountq3-(dptmeetcountq3 + dptdonotmeetcountq3);
                            var srmmeetcountq3 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmdonotmeetcountq3= this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmnotappcountq3 = totcountq3-(srmmeetcountq3 + srmdonotmeetcountq3);

                            let rowq3 = [];
                            rowq3.push("Data");
                            rowq3.push(totcountq3);
                            rowq3.push(dptmeetcountq3);
                            rowq3.push(dptdonotmeetcountq3);
                            rowq3.push(deptnotappcountq3);
                            let r5 = worksheet2.addRow(rowq3);
                            r5.font ={ bold: true};
                            r5.alignment ={ horizontal: 'center'};
                            r5.alignment ={ horizontal: 'center'};
                            r5.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r5.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r5.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r5.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r5.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            let rowsrmq3= [];
                            rowsrmq3.push("Percentage");
                            rowsrmq3.push("");
                            rowsrmq3.push(dptmeetcountq3>0 ?((dptmeetcountq3/totcountq3)*100).toFixed(2)+"%":"0%");
                            rowsrmq3.push(dptdonotmeetcountq3>0 ?((dptdonotmeetcountq3/totcountq3)*100).toFixed(2)+"%":"0%");
                            rowsrmq3.push(deptnotappcountq3>0 ?((deptnotappcountq3/totcountq3)*100).toFixed(2)+"%":"0%");
                            let r6=worksheet2.addRow(rowsrmq3);
                            r6.font ={ bold: true};
                            r6.alignment ={ horizontal: 'center'};
                            r6.getCell(3).font={color:{argb: "00FF0000"}};
                            r6.getCell(4).font={color:{argb: "00FF0000"}};
                            r6.getCell(5).font={color:{argb: "00FF0000"}};
                            r6.alignment ={ horizontal: 'center'};
                            r6.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r6.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r6.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r6.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            r6.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            var headertbltitlesq4 = [];
                            headertbltitlesq4.push("Year 2021 Q4(Oct-Dec)");
                            headertbltitlesq4.push("Total Supplier(Department KPI Result)");
                            headertbltitlesq4.push("Meets KPI");
                            headertbltitlesq4.push("Does not meet KPI");
                            headertbltitlesq4.push("Not Applicable");
                            let headerRowq4 = worksheet2.addRow(headertbltitlesq4);
                            headerRowq4.font ={ bold: true};
                            headerRowq4.alignment ={ horizontal: 'center'};
                            headerRowq4.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq4.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq4.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq4.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
                            headerRowq4.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(11).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            var totcountq4 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptmeetcountq4= this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var dptdonotmeetcountq4= this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var deptnotappcountq4= totcountq4-(dptmeetcountq4 + dptdonotmeetcountq4);
                            var srmmeetcountq4 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmdonotmeetcountq4= this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2021 && x.status == 'Approved').length;
                            var srmnotappcountq4 = totcountq4-(srmmeetcountq4 + srmdonotmeetcountq4);

                            let rowq4 = [];
                            rowq4.push("Data");
                            rowq4.push(totcountq4);
                            rowq4.push(dptmeetcountq4);
                            rowq4.push(dptdonotmeetcountq4);
                            rowq4.push(deptnotappcountq4);
                            let r7=worksheet2.addRow(rowq4);
                            r7.font ={ bold: true};
                            r7.alignment ={ horizontal: 'center'};
                            r7.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r7.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r7.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r7.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r7.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rowsrmq4= [];
                            rowsrmq4.push("Percentage");
                            rowsrmq4.push("");
                            rowsrmq4.push(dptmeetcountq4>0 ?((dptmeetcountq4/totcountq4)*100).toFixed(2)+"%":"0%");
                            rowsrmq4.push(dptdonotmeetcountq4>0 ?((dptdonotmeetcountq4/totcountq4)*100).toFixed(2)+"%":"0%");
                            rowsrmq4.push(deptnotappcountq4>0 ?((deptnotappcountq4/totcountq4)*100).toFixed(2)+"%":"0%");
                            let r8=worksheet2.addRow(rowsrmq4);
                            r8.font ={ bold: true};
                            r8.alignment ={ horizontal: 'center'};
                            r8.getCell(3).font={color:{argb: "00FF0000"}};
                            r8.getCell(4).font={color:{argb: "00FF0000"}};
                            r8.getCell(5).font={color:{argb: "00FF0000"}};
                            r8.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r8.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r8.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r8.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r8.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            /////ttt
                            worksheet2.addRow([]);
                            let headerformulaRowdep2 =worksheet2.addRow([]);
                            worksheet2.mergeCells('A15:D15');
                            worksheet2.getCell('A15').value = "Deparment's KPI";
                            worksheet2.getCell('A15').alignment = {
                                horizontal: 'center'
                            };
                            worksheet2.getCell('E15').value = "2022";
                            worksheet2.getCell('E15').alignment = {
                                horizontal: 'right'
                            };
                            headerformulaRowdep2.font = { bold: true ,size: 16};

                            var headertbltitles2 = [];

                            headertbltitles2.push("Year 2022 Q1(Jan-March)");
                            headertbltitles2.push("Total Supplier(Department KPI Result)");
                            headertbltitles2.push("Meets KPI");
                            headertbltitles2.push("Does not meet KPI");
                            headertbltitles2.push("Not Applicable");
                            let r9=worksheet2.addRow(headertbltitles2);
                            r9.font ={ bold: true};
                            r9.alignment ={ horizontal: 'center'};
                            r9.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r9.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r9.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r9.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r9.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(16).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }
                            

                            var totcount22 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptmeetcount22 = this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptdonotmeetcount22 = this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var deptnotappcount22 = totcount22-(dptmeetcount22 + dptdonotmeetcount22);
                            var srmmeetcount22 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmdonotmeetcount22 = this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() <=3 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmnotappcount22 = totcount22-(srmmeetcount22 + srmdonotmeetcount22);

                            let row22 = [];
                            row22.push("Data");
                            row22.push(totcount22);
                            row22.push(dptmeetcount22);
                            row22.push(dptdonotmeetcount22);
                            row22.push(deptnotappcount22);
                            let r10=worksheet2.addRow(row22);
                            r10.font ={ bold: true};
                            r10.alignment ={ horizontal: 'center'};
                            r10.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r10.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r10.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r10.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r10.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let row322 = [];
                            row322.push("Percentage");
                            row322.push("");
                            row322.push(dptmeetcount22>0 ?((dptmeetcount22/totcount22)*100).toFixed(2)+"%":"0%");
                            row322.push(dptdonotmeetcount22>0 ?((dptdonotmeetcount22/totcount22)*100).toFixed(2)+"%":"0%");
                            row322.push(deptnotappcount22>0 ?((deptnotappcount22/totcount22)*100).toFixed(2)+"%":"0%");
                            let r11=worksheet2.addRow(row322);
                            r11.font ={ bold: true};
                            r11.alignment ={ horizontal: 'center'};
                            r11.getCell(3).font={color:{argb: "00FF0000"}};
                            r11.getCell(4).font={color:{argb: "00FF0000"}};
                            r11.getCell(5).font={color:{argb: "00FF0000"}};
                            r11.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r11.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r11.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r11.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r11.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var totcountq222 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptmeetcountq222= this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptdonotmeetcountq222= this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var deptnotappcountq222 = totcountq222-(dptmeetcountq222 + dptdonotmeetcountq222);
                            var srmmeetcountq222 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmdonotmeetcountq222 = this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >3 && (new Date(x.lastSubmitDate)).getMonth() <=6 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmnotappcountq222 = totcountq222-(srmmeetcountq222 + srmdonotmeetcountq222);

                            var headertbltitlesq222 = [];
                            headertbltitlesq222.push("Year 2022 Q2(Apr-Jun)");
                            headertbltitlesq222.push("Total Supplier(Department KPI Result)");
                            headertbltitlesq222.push("Meets KPI");
                            headertbltitlesq222.push("Does not meet KPI");
                            headertbltitlesq222.push("Not Applicable");
                            let r12=worksheet2.addRow(headertbltitlesq222);
                            r12.font ={ bold: true};
                            r12.alignment ={ horizontal: 'center'};
                            r12.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r12.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r12.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r12.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r12.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(19).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }
                            
                            let rowq222 = [];
                            rowq222.push("Data");
                            rowq222.push(totcountq222);
                            rowq222.push(dptmeetcountq222);
                            rowq222.push(dptdonotmeetcountq222);
                            rowq222.push(deptnotappcountq222);
                            let r13=worksheet2.addRow(rowq222);
                            r13.font ={ bold: true};
                            r13.alignment ={ horizontal: 'center'};
                            r13.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r13.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r13.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r13.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r13.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rowsrmq222= [];
                            rowsrmq222.push("Percentage");
                            rowsrmq222.push("");
                            rowsrmq222.push(dptmeetcountq222>0 ?((dptmeetcountq222/totcountq222)*100).toFixed(2)+"%":"0%");
                            rowsrmq222.push(dptdonotmeetcountq222>0 ?((dptdonotmeetcountq222/totcountq222)*100).toFixed(2)+"%":"0%");
                            rowsrmq222.push(deptnotappcountq222>0 ?((deptnotappcountq222/totcountq222)*100).toFixed(2)+"%":"0%");
                            let r14=worksheet2.addRow(rowsrmq222);
                            r14.font ={ bold: true};
                            r14.alignment ={ horizontal: 'center'};
                            r14.getCell(3).font={color:{argb: "00FF0000"}};
                            r14.getCell(4).font={color:{argb: "00FF0000"}};
                            r14.getCell(5).font={color:{argb: "00FF0000"}};
                            r14.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r14.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r14.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r14.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r14.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitlesq322 = [];
                            headertbltitlesq322.push("Year 2022 Q3(Jul-Sep)");
                            headertbltitlesq322.push("Total Supplier(Department KPI Result)");
                            headertbltitlesq322.push("Meets KPI");
                            headertbltitlesq322.push("Does not meet KPI");
                            headertbltitlesq322.push("Not Applicable");
                            let r15=worksheet2.addRow(headertbltitlesq322);
                            r15.font ={ bold: true};
                            r15.alignment ={ horizontal: 'center'};
                            r15.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r15.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r15.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r15.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r15.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(22).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }
                            var totcountq322 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptmeetcountq322= this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptdonotmeetcountq322= this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var deptnotappcountq322= totcountq322-(dptmeetcountq322 + dptdonotmeetcountq322);
                            var srmmeetcountq322 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmdonotmeetcountq322= this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >6 && (new Date(x.lastSubmitDate)).getMonth() <=9 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmnotappcountq322 = totcountq322-(srmmeetcountq322 + srmdonotmeetcountq322);

                            let rowq322 = [];
                            rowq322.push("Data");
                            rowq322.push(totcountq322);
                            rowq322.push(dptmeetcountq322);
                            rowq322.push(dptdonotmeetcountq322);
                            rowq322.push(deptnotappcountq322);
                            let r16=worksheet2.addRow(rowq322);
                            r16.font ={ bold: true};
                            r16.alignment ={ horizontal: 'center'};
                            r16.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r16.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r16.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r16.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r16.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rowsrmq322= [];
                            rowsrmq322.push("Percentage");
                            rowsrmq322.push("");
                            rowsrmq322.push(dptmeetcountq322>0 ?((dptmeetcountq322/totcountq322)*100).toFixed(2)+"%":"0%");
                            rowsrmq322.push(dptdonotmeetcountq322>0 ?((dptdonotmeetcountq322/totcountq322)*100).toFixed(2)+"%":"0%");
                            rowsrmq322.push(deptnotappcountq322>0 ?((deptnotappcountq322/totcountq322)*100).toFixed(2)+"%":"0%");
                            let r17=worksheet2.addRow(rowsrmq322);
                            r17.font ={ bold: true};
                            r17.alignment ={ horizontal: 'center'};
                            r17.getCell(3).font={color:{argb: "00FF0000"}};
                            r17.getCell(4).font={color:{argb: "00FF0000"}};
                            r17.getCell(5).font={color:{argb: "00FF0000"}};
                            r17.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r17.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r17.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r17.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r17.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitlesq422 = [];
                            headertbltitlesq422.push("Year 2022 Q4(Oct-Dec)");
                            headertbltitlesq422.push("Total Supplier(Department KPI Result)");
                            headertbltitlesq422.push("Meets KPI");
                            headertbltitlesq422.push("Does not meet KPI");
                            headertbltitlesq422.push("Not Applicable");
                            let r18=worksheet2.addRow(headertbltitlesq422);
                            r18.font ={ bold: true};
                            r18.alignment ={ horizontal: 'center'};
                            r18.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r18.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r18.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r18.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r18.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(25).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            var totcountq422 = this.DataToExport.filter(x=>(new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptmeetcountq422= this.DataToExport.filter(x=>x.docKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var dptdonotmeetcountq422= this.DataToExport.filter(x=>x.docKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var deptnotappcountq422= totcountq422-(dptmeetcountq422 + dptdonotmeetcountq422);
                            var srmmeetcountq422 = this.DataToExport.filter(x=>x.srmKpiResult=='Meets KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmdonotmeetcountq422= this.DataToExport.filter(x=>x.srmKpiResult=='Does not Meet KPI' && (new Date(x.lastSubmitDate)).getMonth() >9 && (new Date(x.lastSubmitDate)).getMonth() <=12 && (new Date(x.lastSubmitDate)).getUTCFullYear() ==2022 && x.status == 'Approved').length;
                            var srmnotappcountq422 = totcountq422-(srmmeetcountq422 + srmdonotmeetcountq422);

                            let rowq422 = [];
                            rowq422.push("Data");
                            rowq422.push(totcountq422);
                            rowq422.push(dptmeetcountq422);
                            rowq422.push(dptdonotmeetcountq422);
                            rowq422.push(deptnotappcountq422);
                            let r19=worksheet2.addRow(rowq422);
                            r19.font ={ bold: true};
                            r19.alignment ={ horizontal: 'center'};
                            r19.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r19.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r19.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r19.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r19.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rowsrmq422= [];
                            rowsrmq422.push("Percentage");
                            rowsrmq422.push("");
                            rowsrmq422.push(dptmeetcountq422>0 ?((dptmeetcountq422/totcountq422)*100).toFixed(2)+"%":"0%");
                            rowsrmq422.push(dptdonotmeetcountq422>0 ?((dptdonotmeetcountq422/totcountq422)*100).toFixed(2)+"%":"0%");
                            rowsrmq422.push(deptnotappcountq422>0 ?((deptnotappcountq422/totcountq422)*100).toFixed(2)+"%":"0%");
                            let r20=worksheet2.addRow(rowsrmq422);
                            r20.font ={ bold: true};
                            r20.alignment ={ horizontal: 'center'};
                            r20.getCell(3).font={color:{argb: "00FF0000"}};
                            r20.getCell(4).font={color:{argb: "00FF0000"}};
                            r20.getCell(5).font={color:{argb: "00FF0000"}};
                            r20.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r20.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r20.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r20.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r20.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            ////ttt

                            worksheet2.addRow([]);
                            worksheet2.addRow([]);

                            worksheet2.mergeCells('A29:D29');
                            worksheet2.getCell('A29').value = "SRM KPI";
                            worksheet2.getCell('A29').alignment = {
                                horizontal: 'center'
                            };
                            worksheet2.getCell('A29').font = {
                                bold: true,
                                size: 16
                            };
                            
                            worksheet2.getCell('E29').value = "2021";
                            worksheet2.getCell('E29').alignment = {
                                horizontal: 'right'
                            };
                            worksheet2.getCell('E29').font = {
                                bold: true,
                                size: 16
                            };
                            var headertbltitles3 = [];

                            headertbltitles3.push("Year 2021 Q1(Jan-Mar)");
                            headertbltitles3.push("Total Supplier(SRM KPI Result)");
                            headertbltitles3.push("Meets KPI");
                            headertbltitles3.push("Does not meet KPI");
                            headertbltitles3.push("Not Applicable");
                            let r21=worksheet2.addRow(headertbltitles3);
                            r21.font ={ bold: true};
                            r21.alignment ={ horizontal: 'center'};
                            r21.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r21.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r21.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r21.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r21.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(30).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let row4 = [];
                            row4.push("Data");
                            row4.push(totcount);
                            row4.push(srmmeetcount);
                            row4.push(srmdonotmeetcount);
                            row4.push(srmnotappcount);
                            let r22=worksheet2.addRow(row4);
                            r22.font ={ bold: true};
                            r22.alignment ={ horizontal: 'center'};
                            r22.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r22.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r22.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r22.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r22.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let row5 = [];
                            row5.push("Percentage");
                            row5.push("");
                            row5.push(srmmeetcount>0 ?((srmmeetcount/totcount)*100).toFixed(2)+"%":"0%");
                            row5.push(srmdonotmeetcount>0 ?((srmdonotmeetcount/totcount)*100).toFixed(2)+"%":"0%");
                            row5.push(srmnotappcount>0 ?((srmnotappcount/totcount)*100).toFixed(2)+"%":"0%");
                            let r23=worksheet2.addRow(row5);
                            r23.font ={ bold: true};
                            r23.alignment ={ horizontal: 'center'};
                            r23.getCell(3).font={color:{argb: "00FF0000"}};
                            r23.getCell(4).font={color:{argb: "00FF0000"}};
                            r23.getCell(5).font={color:{argb: "00FF0000"}};
                            r23.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r23.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r23.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r23.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r23.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitles4 = [];

                            headertbltitles4.push("Year 2021 Q2(Apr-Jun)");
                            headertbltitles4.push("Total Supplier(SRM KPI Result)");
                            headertbltitles4.push("Meets KPI");
                            headertbltitles4.push("Does not meet KPI");
                            headertbltitles4.push("Not Applicable");
                            let r24=worksheet2.addRow(headertbltitles4);
                            r24.font ={ bold: true};
                            r24.alignment ={ horizontal: 'center'};
                            r24.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r24.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r24.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r24.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r24.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(33).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let rows4 = [];
                            rows4.push("Data");
                            rows4.push(totcountq2);
                            rows4.push(srmmeetcountq2);
                            rows4.push(srmdonotmeetcountq2);
                            rows4.push(srmnotappcountq2);
                            let r25=worksheet2.addRow(rows4);
                            r25.font ={ bold: true};
                            r25.alignment ={ horizontal: 'center'};
                            r25.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r25.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r25.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r25.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r25.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rows5 = [];
                            rows5.push("Percentage");
                            rows5.push("");
                            rows5.push(srmmeetcountq2>0 ?((srmmeetcountq2/totcountq2)*100).toFixed(2)+"%":"0%");
                            rows5.push(srmdonotmeetcountq2>0 ?((srmdonotmeetcountq2/totcountq2)*100).toFixed(2)+"%":"0%");
                            rows5.push(srmnotappcountq2>0 ?((srmnotappcountq2/totcountq2)*100).toFixed(2)+"%":"0%");
                            let r26=worksheet2.addRow(rows5);
                            r26.font ={ bold: true};
                            r26.alignment ={ horizontal: 'center'};
                            r26.getCell(3).font={color:{argb: "00FF0000"}};
                            r26.getCell(4).font={color:{argb: "00FF0000"}};
                            r26.getCell(5).font={color:{argb: "00FF0000"}};
                            r26.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r26.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r26.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r26.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r26.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitles5 = [];

                            headertbltitles5.push("Year Q3(Jul-Sep)");
                            headertbltitles5.push("Total Supplier(SRM KPI Result)");
                            headertbltitles5.push("Meets KPI");
                            headertbltitles5.push("Does not meet KPI");
                            headertbltitles5.push("Not Applicable");
                            let r27=worksheet2.addRow(headertbltitles5);
                            r27.font ={ bold: true};
                            r27.alignment ={ horizontal: 'center'};
                            r27.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r27.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r27.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r27.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r27.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(36).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let rows6 = [];
                            rows6.push("Data");
                            rows6.push(totcountq3);
                            rows6.push(srmmeetcountq3);
                            rows6.push(srmdonotmeetcountq3);
                            rows6.push(srmnotappcountq3);
                            let r28=worksheet2.addRow(rows6);
                            r28.font ={ bold: true};
                            r28.alignment ={ horizontal: 'center'};
                            r28.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r28.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r28.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r28.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r28.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rows7 = [];
                            rows7.push("Percentage");
                            rows7.push("");
                            rows7.push(srmmeetcountq3>0 ?((srmmeetcountq3/totcountq3)*100).toFixed(2)+"%":"0%");
                            rows7.push(srmdonotmeetcountq3>0 ?((srmdonotmeetcountq3/totcountq3)*100).toFixed(2)+"%":"0%");
                            rows7.push(srmnotappcountq3>0 ?((srmnotappcountq3/totcountq3)*100).toFixed(2)+"%":"0%");
                            let r29=worksheet2.addRow(rows7);
                            r29.font ={ bold: true};
                            r29.alignment ={ horizontal: 'center'};
                            r29.getCell(3).font={color:{argb: "00FF0000"}};
                            r29.getCell(4).font={color:{argb: "00FF0000"}};
                            r29.getCell(5).font={color:{argb: "00FF0000"}};
                            r29.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r29.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r29.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r29.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r29.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitles6 = [];

                            headertbltitles6.push("Year Q4(Oct-Dec)");
                            headertbltitles6.push("Total Supplier(SRM KPI Result)");
                            headertbltitles6.push("Meets KPI");
                            headertbltitles6.push("Does not meet KPI");
                            headertbltitles6.push("Not Applicable");
                            let r30=worksheet2.addRow(headertbltitles6);
                            r30.font ={ bold: true};
                            r30.alignment ={ horizontal: 'center'};
                            r30.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r30.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r30.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r30.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r30.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(39).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let rows8 = [];
                            rows8.push("Data");
                            rows8.push(totcountq4);
                            rows8.push(srmmeetcountq4);
                            rows8.push(srmdonotmeetcountq4);
                            rows8.push(srmnotappcountq4);
                            let r31=worksheet2.addRow(rows8);
                            r31.font ={ bold: true};
                            r31.alignment ={ horizontal: 'center'};
                            r31.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r31.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r31.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r31.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r31.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rows9 = [];
                            rows9.push("Percentage");
                            rows9.push("");
                            rows9.push(srmmeetcountq4>0 ?((srmmeetcountq4/totcountq4)*100).toFixed(2)+"%":"0%");
                            rows9.push(srmdonotmeetcountq4>0 ?((srmdonotmeetcountq4/totcountq4)*100).toFixed(2)+"%":"0%");
                            rows9.push(srmnotappcountq4>0 ?((srmnotappcountq4/totcountq4)*100).toFixed(2)+"%":"0%");
                            let r32=worksheet2.addRow(rows9);
                            r32.font ={ bold: true};
                            r32.alignment ={ horizontal: 'center'};
                            r32.getCell(3).font={color:{argb: "00FF0000"}};
                            r32.getCell(4).font={color:{argb: "00FF0000"}};
                            r32.getCell(5).font={color:{argb: "00FF0000"}};
                            r32.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r32.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r32.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r32.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r32.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            ////ttt
                            worksheet2.addRow([]);
                            worksheet2.addRow([]);

                            worksheet2.mergeCells('A43:D43');
                            worksheet2.getCell('A43').value = "SRM KPI";
                            worksheet2.getCell('A43').alignment = {
                                horizontal: 'center'
                            };
                            worksheet2.getCell('A43').font = {
                                bold: true,
                                size: 16
                            };
                            
                            worksheet2.getCell('E43').value = "2022";
                            worksheet2.getCell('E43').alignment = {
                                horizontal: 'right'
                            };
                            worksheet2.getCell('E43').font = {
                                bold: true,
                                size: 16
                            };
                            var headertbltitles322 = [];

                            headertbltitles322.push("Year 2022 Q1(Jan-Mar)");
                            headertbltitles322.push("Total Supplier(SRM KPI Result)");
                            headertbltitles322.push("Meets KPI");
                            headertbltitles322.push("Does not meet KPI");
                            headertbltitles322.push("Not Applicable");
                            let r33=worksheet2.addRow(headertbltitles322);
                            r33.font ={ bold: true};
                            r33.alignment ={ horizontal: 'center'};
                            r33.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r33.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r33.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r33.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r33.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(44).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let row422 = [];
                            row422.push("Data");
                            row422.push(totcount22);
                            row422.push(srmmeetcount22);
                            row422.push(srmdonotmeetcount22);
                            row422.push(srmnotappcount22);
                            let r34=worksheet2.addRow(row422);
                            r34.font ={ bold: true};
                            r34.alignment ={ horizontal: 'center'};
                            r34.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r34.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r34.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r34.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r34.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let row522 = [];
                            row522.push("Percentage");
                            row522.push("");
                            row522.push(srmmeetcount22>0 ?((srmmeetcount22/totcount22)*100).toFixed(2)+"%":"0%");
                            row522.push(srmdonotmeetcount22>0 ?((srmdonotmeetcount22/totcount22)*100).toFixed(2)+"%":"0%");
                            row522.push(srmnotappcount22>0 ?((srmnotappcount22/totcount22)*100).toFixed(2)+"%":"0%");
                            let r35=worksheet2.addRow(row522);
                            r35.font ={ bold: true};
                            r35.alignment ={ horizontal: 'center'};
                            r35.getCell(3).font={color:{argb: "00FF0000"}};
                            r35.getCell(4).font={color:{argb: "00FF0000"}};
                            r35.getCell(5).font={color:{argb: "00FF0000"}};
                            r35.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r35.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r35.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r35.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r35.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitles422 = [];

                            headertbltitles422.push("Year 2022 Q2(Apr-Jun)");
                            headertbltitles422.push("Total Supplier(SRM KPI Result)");
                            headertbltitles422.push("Meets KPI");
                            headertbltitles422.push("Does not meet KPI");
                            headertbltitles422.push("Not Applicable");
                            let r36=worksheet2.addRow(headertbltitles422);
                            r36.font ={ bold: true};
                            r36.alignment ={ horizontal: 'center'};
                            r36.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r36.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r36.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r36.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r36.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(47).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let rows422 = [];
                            rows422.push("Data");
                            rows422.push(totcountq222);
                            rows422.push(srmmeetcountq222);
                            rows422.push(srmdonotmeetcountq222);
                            rows422.push(srmnotappcountq222);
                            let r37=worksheet2.addRow(rows422);
                            r37.font ={ bold: true};
                            r37.alignment ={ horizontal: 'center'};
                            r37.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r37.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r37.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r37.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r37.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            
                            let rows522 = [];
                            rows522.push("Percentage");
                            rows522.push("");
                            rows522.push(srmmeetcountq222>0 ?((srmmeetcountq222/totcountq222)*100).toFixed(2)+"%":"0%");
                            rows522.push(srmdonotmeetcountq222>0 ?((srmdonotmeetcountq222/totcountq222)*100).toFixed(2)+"%":"0%");
                            rows522.push(srmnotappcountq222>0 ?((srmnotappcountq222/totcountq222)*100).toFixed(2)+"%":"0%");
                            let r38=worksheet2.addRow(rows522);
                            r38.font ={ bold: true};
                            r38.alignment ={ horizontal: 'center'};
                            r38.getCell(3).font={color:{argb: "00FF0000"}};
                            r38.getCell(4).font={color:{argb: "00FF0000"}};
                            r38.getCell(5).font={color:{argb: "00FF0000"}};
                            r38.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r38.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r38.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r38.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r38.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitles522 = [];

                            headertbltitles522.push("Year 2022 Q3(Jul-Sep)");
                            headertbltitles522.push("Total Supplier(SRM KPI Result)");
                            headertbltitles522.push("Meets KPI");
                            headertbltitles522.push("Does not meet KPI");
                            headertbltitles522.push("Not Applicable");
                            let r39=worksheet2.addRow(headertbltitles522);
                            r39.font ={ bold: true};
                            r39.alignment ={ horizontal: 'center'};
                            r39.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r39.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r39.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r39.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r39.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(50).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let rows622 = [];
                            rows622.push("Data");
                            rows622.push(totcountq322);
                            rows622.push(srmmeetcountq322);
                            rows622.push(srmdonotmeetcountq322);
                            rows622.push(srmnotappcountq322);
                            let r40=worksheet2.addRow(rows622);
                            r40.font ={ bold: true};
                            r40.alignment ={ horizontal: 'center'};
                            r40.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r40.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r40.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r40.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r40.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rows722 = [];
                            rows722.push("Percentage");
                            rows722.push("");
                            rows722.push(srmmeetcountq322>0 ?((srmmeetcountq322/totcountq322)*100).toFixed(2)+"%":"0%");
                            rows722.push(srmdonotmeetcountq322>0 ?((srmdonotmeetcountq322/totcountq322)*100).toFixed(2)+"%":"0%");
                            rows722.push(srmnotappcountq322>0 ?((srmnotappcountq322/totcountq322)*100).toFixed(2)+"%":"0%");
                            let r41=worksheet2.addRow(rows722);
                            r41.font ={ bold: true};
                            r41.alignment ={ horizontal: 'center'};
                            r41.getCell(3).font={color:{argb: "00FF0000"}};
                            r41.getCell(4).font={color:{argb: "00FF0000"}};
                            r41.getCell(5).font={color:{argb: "00FF0000"}};
                            r41.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r41.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r41.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r41.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r41.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            var headertbltitles622 = [];

                            headertbltitles622.push("Year 2022 Q4(Oct-Dec)");
                            headertbltitles622.push("Total Supplier(SRM KPI Result)");
                            headertbltitles622.push("Meets KPI");
                            headertbltitles622.push("Does not meet KPI");
                            headertbltitles622.push("Not Applicable");
                            let r42=worksheet2.addRow(headertbltitles622);
                            r42.font ={ bold: true};
                            r42.alignment ={ horizontal: 'center'};
                            r42.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r42.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r42.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r42.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r42.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            for (var i = 1; i < 6; i++) {
                                worksheet2.getRow(53).getCell(i).fill = {
                                    type: 'pattern',
                                    pattern: 'solid',
                                    fgColor: { argb: '00B050' },
                                    bgColor: { argb: '00B050' }
                                };
                            }

                            let rows822 = [];
                            rows822.push("Data");
                            rows822.push(totcountq422);
                            rows822.push(srmmeetcountq422);
                            rows822.push(srmdonotmeetcountq422);
                            rows822.push(srmnotappcountq422);
                            let r43=worksheet2.addRow(rows822);
                            r43.font ={ bold: true};
                            r43.alignment ={ horizontal: 'center'};
                            r43.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r43.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r43.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r43.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r43.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            let rows922 = [];
                            rows922.push("Percentage");
                            rows922.push("");
                            rows922.push(srmmeetcountq422>0 ?((srmmeetcountq422/totcountq422)*100).toFixed(2)+"%":"0%");
                            rows922.push(srmdonotmeetcountq422>0 ?((srmdonotmeetcountq422/totcountq422)*100).toFixed(2)+"%":"0%");
                            rows922.push(srmnotappcountq422>0 ?((srmnotappcountq422/totcountq422)*100).toFixed(2)+"%":"0%");
                            let r44=worksheet2.addRow(rows922);
                            r44.font ={ bold: true};
                            r44.alignment ={ horizontal: 'center'};
                            r44.getCell(3).font={color:{argb: "00FF0000"}};
                            r44.getCell(4).font={color:{argb: "00FF0000"}};
                            r44.getCell(5).font={color:{argb: "00FF0000"}};
                            r44.getCell(1).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r44.getCell(2).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r44.getCell(3).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r44.getCell(4).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                            r44.getCell(5).style.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

                            ///ttt

                            // Generate Excel File with given name
                            workbook.xlsx.writeBuffer().then((data) => {
                                let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                                fs.saveAs(blob, 'AllSuppliersDetails.xlsx');
                            });
                            Swal.close();
                        }
                    });


                }


            }
            else {
                this.iserror = true;
            }
        }
        else {
            this.iserror = true;
        }
    }

    selectedValue() {
        this.Status = false;
        this.Country = false;
        this.IfsCode = false;
        this.Location = false;
        this.Country = false;
        this.SupplierClas = false;
        this.CreatedDate = false;
        this.LastSubmitDate = false;
        this.SrmReviewDate = false;
        this.AuditComDate = false;
        this.SrmRecomDate = false;
        this.GmApprovedDate = false;
        this.VpApprovedDate = false;
        this.SrmReviewDura = false;
        this.RegisDuration = false;
        this.AuditCompletion = false;
        this.DocumentKpi = false;
        this.DocKpiResult = false;
        this.SrmKpi = false;
        this.SrmKpiResult = false;

        for (var i = 0; i < this.selectedList.length; i++) {
            if (this.selectedList[i].val == "Status") {
                this.Status = true;
            }
            if (this.selectedList[i].val == "IfsCode") {
                this.IfsCode = true;
            }
            if (this.selectedList[i].val == "Location") {
                this.Location = true;
            }
            if (this.selectedList[i].val == "Country") {
                this.Country = true;
            }
            if (this.selectedList[i].val == "SupplierClassification") {
                this.SupplierClas = true;
            }
            if (this.selectedList[i].val == "CreatedDate") {
                this.CreatedDate = true;
            }
            if (this.selectedList[i].val == "LastSubmitDate") {
                this.LastSubmitDate = true;
            }
            if (this.selectedList[i].val == "SrmReviewDate") {
                this.SrmReviewDate = true;
            }
            if (this.selectedList[i].val == "AuditCompleteDate") {
                this.AuditComDate = true;
            }
            if (this.selectedList[i].val == "SrmRecommendedDate") {
                this.SrmRecomDate = true;
            }
            if (this.selectedList[i].val == "GmApprovedDate") {
                this.GmApprovedDate = true;
            }
            if (this.selectedList[i].val == "VpApprovedDate") {
                this.VpApprovedDate = true;
            }
            if (this.selectedList[i].val == "SrmReviewDuration") {
                this.SrmReviewDura = true;
            }
            if (this.selectedList[i].val == "RegisDuration") {
                this.RegisDuration = true;
            }
            if (this.selectedList[i].val == "AuditCompletion") {
                this.AuditCompletion = true;
            }
            if (this.selectedList[i].val == "DepartmentKpi") {
                this.DocumentKpi = true;
            }
            if (this.selectedList[i].val == "DepartmentKpiResult") {
                this.DocKpiResult = true;
            }
            if (this.selectedList[i].val == "SrmKpi") {
                this.SrmKpi = true;
            }
            if (this.selectedList[i].val == "SrmKpiResult") {
                this.SrmKpiResult = true;
            }
        }
    }

    toggleAllSelection() {
        for (var i = 0; i < this.ColumnList.length; i++) {
            this.ColumnList[i].isSelected = this.allSelected;
        }
        this.getCheckedItemList();
    }
    getCheckedItemList() {
        this.checkedList = [];
        this.selectedList = [];
        for (var i = 0; i < this.ColumnList.length; i++) {
            if (this.ColumnList[i].isSelected)
                this.checkedList.push(this.ColumnList[i]);
        }
        this.selectedList = this.checkedList;
        this.checkedList = JSON.stringify(this.checkedList);
    }
    resetFilters() {
        this.filterValues = {};
        this.getSuppliers();
        this.setFilterText();

        this.maxDate = null;
        this.minDate = null;
    }

    setFilterText() {
        this.statusModel = this.filterValues['status'] ? this.filterValues['status'] : '';
        this.supplierNameModel = this.filterValues['supplierName'] ? this.filterValues['supplierName'] : '';
        this.supplierCodemodel = this.filterValues['supplierCode'] ? this.filterValues['supplierCode'] : '';
        this.locationModel = this.filterValues['location'] ? this.filterValues['location'] : '';
        this.ifscodemodel = this.filterValues['ifscode'] ? this.filterValues['ifscode'] : '';
        this.countryModel = this.filterValues['country'] ? this.filterValues['country'] : '';
        this.classificationModel = this.filterValues['classification'] ? this.filterValues['classification'] : '';
        this.createddateto = this.filterValues['createddateto'] ? this.filterValues['createddateto'] : '';
        this.createddatefrom = this.filterValues['createddatefrom'] ? this.filterValues['createddatefrom'] : '';
        this.lastsupsubmitdatefrom = this.filterValues['lastsupsubmitdatefrom'] ? this.filterValues['lastsupsubmitdatefrom'] : '';
        this.lastsupsubmitdateto  = this.filterValues['lastsupsubmitdateto'] ? this.filterValues['lastsupsubmitdateto'] : '';
        this.srmreviewfrom = this.filterValues['srmreviewfrom'] ? this.filterValues['srmreviewfrom'] : '';
        this.srmreviewto = this.filterValues['srmreviewto'] ? this.filterValues['srmreviewto'] : '';
        this.auditcompletefrom = this.filterValues['auditcompletefrom'] ? this.filterValues['auditcompletefrom'] : '';
        this.auditcompleteto = this.filterValues['auditcompleteto'] ? this.filterValues['auditcompleteto'] : '';
        this.srmrecomfrom = this.filterValues['srmrecomfrom'] ? this.filterValues['srmrecomfrom'] : '';
        this.srmrecomto = this.filterValues['srmrecomto'] ? this.filterValues['srmrecomto'] : '';
        this.gmapprovedfrom = this.filterValues['gmapprovedfrom'] ? this.filterValues['gmapprovedfrom'] : '';
        this.gmapprovedto = this.filterValues['gmapprovedto'] ? this.filterValues['gmapprovedto'] : '';
        this.vpapprovedfrom = this.filterValues['vpapprovedfrom'] ? this.filterValues['vpapprovedfrom'] : '';
        this.vpapprovedto = this.filterValues['vpapprovedto'] ? this.filterValues['vpapprovedto'] : '';
        this.srmreviewdurModel = this.filterValues['srmreviewdur'] ? this.filterValues['srmreviewdur'] : '';
        this.regisdurModel = this.filterValues['regisdur'] ? this.filterValues['regisdur'] : '';
        this.auditcomModel = this.filterValues['auditcom'] ? this.filterValues['auditcom'] : '';
        this.deptkpiResultModel = this.filterValues['deptkpiResult'] ? this.filterValues['deptkpiResult'] : '';
        this.srmkpiModel = this.filterValues['srmkpi'] ? this.filterValues['srmkpi'] : '';
        this.srmkpiResultModel = this.filterValues['srmkpiResult'] ? this.filterValues['srmkpiResult'] : '';
    }

    filterChange(filter, event) {
        var value = '';
        this.isloadeddata = true;

        if (filter == "createddatefrom" || filter == "createddateto" || filter == "srmrecomfrom" || filter == "srmrecomto"
        || filter == "lastsupsubmitdatefrom" || filter == "lastsupsubmitdateto" || filter == "auditcompletefrom" || filter == "auditcompleteto"
        || filter == "gmapprovedfrom" || filter == "gmapprovedto" || filter == "vpapprovedfrom" || filter == "vpapprovedto") {
            value = moment(event).format('YYYY-MM-DD');
        }else {
            value = event ? event.trim().toLowerCase() : '';
        }

        if (filter != '') {
            this.filterValues[filter] = value;
        }

        localStorage.setItem('kpifilter', JSON.stringify(this.filterValues));

        this.dataSourceDashboard.data = this.tempData;

        var kpiDto = new KpiFields();
        kpiDto.startindex = 0;
        kpiDto.pagesize = 5;

        for (let key in this.filterValues) {
            let filtervalue = this.filterValues[key];
            var type = key;

            if (type == "supplierCode") { kpiDto.suppliercode = filtervalue; }
            else if (type == "supplierName") { kpiDto.suppliername = filtervalue; }
            else if (type == "status") { kpiDto.status = filtervalue; }
            else if (type == "ifscode") { kpiDto.ifscode = filtervalue; }
            else if (type == "location") { kpiDto.location = filtervalue; }
            else if (type == "country") { kpiDto.country = filtervalue; }
            else if (type == "classification") { kpiDto.classification = filtervalue; }
            else if (type == "createddatefrom") { kpiDto.createdfrom = filtervalue; }
            else if (type == "createddateto") { kpiDto.createdto = filtervalue; }
            else if (type == "lastsupsubmitdatefrom") { kpiDto.lastsubmitfrom = filtervalue; }
            else if (type == "lastsupsubmitdateto") { kpiDto.lastsubmitto = filtervalue; }
            else if (type == "srmreviewfrom") { kpiDto.srmreviewfrom = filtervalue; }
            else if (type == "srmreviewto") { kpiDto.srmreviewto = filtervalue; }
            else if (type == "auditcompletefrom") { kpiDto.auditcompletefrom = filtervalue; }
            else if (type == "auditcompleteto") { kpiDto.auditcompleteto = filtervalue; }
            else if (type == "srmrecomfrom") { kpiDto.srmrecomfrom = filtervalue; }
            else if (type == "srmrecomto") { kpiDto.srmrecomto = filtervalue; }
            else if (type == "gmapprovedfrom") { kpiDto.gmapprovedfrom = filtervalue; }
            else if (type == "gmapprovedto") { kpiDto.gmapprovedto = filtervalue; }
            else if (type == "vpapprovedfrom") { kpiDto.vpapprovedfrom = filtervalue; }
            else if (type == "vpapprovedto") { kpiDto.vpapprovedto = filtervalue; }
            else if (type == "srmreviewdur") { kpiDto.srmreviewdur = filtervalue; }
            else if (type == "regisdur") { kpiDto.regisdur = filtervalue; }
            else if (type == "auditcom") { kpiDto.auditcom = filtervalue; }
            else if (type == "deptkpi") { kpiDto.deptkpi = filtervalue; }
            else if (type == "deptkpiResult") { kpiDto.deptkpiResult = filtervalue; }
            else if (type == "srmkpi") { kpiDto.srmkpi = filtervalue; }
            else if (type == "srmkpiResult") { kpiDto.srmkpiResult = filtervalue; }
        }


        this.http.post<any>(environment.nodeurl + '/api/template/kpiData', kpiDto).subscribe(data2 => {
            if (data2) {
                this.isloadeddata = false;
                var messagelist = data2;
                this.filltabledata(messagelist, 'all');
            } else {
                this.dataSourceDashboard.data = [];
                this.isloadeddata = false;
            }
        });

    }

    async getSuppliers() {
        var kpiDto = new KpiFields();
        kpiDto.startindex = 0;
        kpiDto.pagesize = 5;

        this.isloadeddata = true;
        for (let key in this.filterValues) {
            let filtervalue = this.filterValues[key];
            var type = key;

            if (type == "supplierCode") { kpiDto.suppliercode = filtervalue; }
            else if (type == "supplierName") { kpiDto.suppliername = filtervalue; }
            else if (type == "status") { kpiDto.status = filtervalue; }
            else if (type == "ifscode") { kpiDto.ifscode = filtervalue; }
            else if (type == "location") { kpiDto.location = filtervalue; }
            else if (type == "country") { kpiDto.country = filtervalue; }
            else if (type == "classification") { kpiDto.classification = filtervalue; }
            else if (type == "createddatefrom") { kpiDto.createdfrom = filtervalue; }
            else if (type == "createddateto") { kpiDto.createdto = filtervalue; }
            else if (type == "lastsupsubmitdatefrom") { kpiDto.lastsubmitfrom = filtervalue; }
            else if (type == "lastsupsubmitdateto") { kpiDto.lastsubmitto = filtervalue; }
            else if (type == "srmreviewfrom") { kpiDto.srmreviewfrom = filtervalue; }
            else if (type == "srmreviewto") { kpiDto.srmreviewto = filtervalue; }
            else if (type == "auditcompletefrom") { kpiDto.auditcompletefrom = filtervalue; }
            else if (type == "auditcompleteto") { kpiDto.auditcompleteto = filtervalue; }
            else if (type == "srmrecomfrom") { kpiDto.srmrecomfrom = filtervalue; }
            else if (type == "srmrecomto") { kpiDto.srmrecomto = filtervalue; }
            else if (type == "gmapprovedfrom") { kpiDto.gmapprovedfrom = filtervalue; }
            else if (type == "gmapprovedto") { kpiDto.gmapprovedto = filtervalue; }
            else if (type == "vpapprovedfrom") { kpiDto.vpapprovedfrom = filtervalue; }
            else if (type == "vpapprovedto") { kpiDto.vpapprovedto = filtervalue; }
            else if (type == "srmreviewdur") { kpiDto.srmreviewdur = filtervalue; }
            else if (type == "regisdur") { kpiDto.regisdur = filtervalue; }
            else if (type == "auditcom") { kpiDto.auditcom = filtervalue; }
            else if (type == "deptkpi") { kpiDto.deptkpi = filtervalue; }
            else if (type == "deptkpiResult") { kpiDto.deptkpiResult = filtervalue; }
            else if (type == "srmkpi") { kpiDto.srmkpi = filtervalue; }
            else if (type == "srmkpiResult") { kpiDto.srmkpiResult = filtervalue; }
        }

        this.http.post<any>(environment.nodeurl + '/api/template/kpiData', kpiDto).subscribe(data2 => {
            if (data2) {
                this.isloadeddata = false;
                var messagelist = data2;
                this.filltabledata(messagelist, 'all');
                this.totalSize = messagelist[0].toT_COUNT;
                this.dataSourceDashboard.paginator = this.tableOnePaginator;
            } else {
            }
            setTimeout(function () {
                this.issuccess = false;
                this.iserror = false;
            }.bind(this), 2000);
        });
    }

    filltabledata(data: any, page: string) {
        if (data) {
            this.currentReqPage = page;
            this.dataSourceDashboardList = [];
            this.totalSize = data.length > 0 ? data[0].toT_COUNT : 0;

            if (data.length > 0) {
                data.forEach(element => {
                    var lastsrmreviewdate=moment(new Date(element.lasT_SRM_REVIEW_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.lasT_SRM_REVIEW_DATE)).format('YYYY-MM-DD');
                    var lastsupsubmitteddate = moment(new Date(element.lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD');
                    var lastsrmrecomdate = moment(new Date(element.lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD');
                    var srmreviewduration=(element.supplieR_CLASSIFICATION == '' && element.status== 'Awaiting Clarification from Supplier')?'N/A':(Number(element.srM_REVIEW_DURATION)<0?0:Number(element.srM_REVIEW_DURATION));
                    var registrationduration=(element.supplieR_CLASSIFICATION == '' && element.status== 'Awaiting Clarification from Supplier')?'N/A':(Number(element.registratioN_DURATION)<0?0:Number(element.registratioN_DURATION));
                    var auditcompletion = (element.supplieR_CLASSIFICATION == '' && element.status== 'Awaiting Clarification from Supplier')?'N/A':(Number(element.audiT_COMPLETION)<0?0:Number(element.audiT_COMPLETION));
                    var documentkpi=element.supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(element.departmenT_KPI) < 0 ? 0 : element.departmenT_KPI);
                    var srmkpi=element.supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(element.srM_KPI) < 0 ? 0 : element.srM_KPI);

                    if(srmreviewduration !='N/A' && (Number(element.srM_REVIEW_DURATION)<0)){
                        if(srmkpi !='N/A')
                        srmkpi = Number(srmkpi) - (Number(element.srM_REVIEW_DURATION));
                    }

                    if(registrationduration !='N/A' && (Number(element.registratioN_DURATION)<0)){
                        if(documentkpi !='N/A')
                        documentkpi = Number(documentkpi) - (Number(element.registratioN_DURATION));
                    }

                    if(auditcompletion !='N/A' && (Number(element.audiT_COMPLETION)<0)){
                        if(documentkpi !='N/A'){
                            documentkpi = Number(documentkpi) + (Number(element.audiT_COMPLETION));
                        }
                        if(srmkpi !='N/A'){
                            srmkpi = Number(srmkpi) + (Number(element.audiT_COMPLETION));
                        }
                    }

                    this.dataSourceDashboardList.push(
                        {
                            supplierId: element.supplieR_ID,
                            supplierName: element.supplieR_NAME,
                            supplierCode: element.supplieR_CODE,
                            status: element.status,
                            ifsCode: element.ifS_CODE,
                            location: element.supplieR_LOCATION,
                            country: element.country,
                            supplierClas: element.supplieR_CLASSIFICATION,
                            createdDate: moment(new Date(element.createD_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.createD_DATE)).format('YYYY-MM-DD'),
                            lastSubmitDate: moment(new Date(element.lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.lasT_SUPPLIER_SUBMITTED_DATE)).format('YYYY-MM-DD'),
                            srmReviewDate: lastsupsubmitteddate>lastsrmreviewdate?lastsrmrecomdate:lastsrmreviewdate,
                            auditComDate: moment(new Date(element.audiT_COMPLETION_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.audiT_COMPLETION_DATE)).format('YYYY-MM-DD'),
                            srmRecomDate: element.status == 'Awaiting for SRM Recommendation'?'' :(moment(new Date(element.lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.lasT_SRM_RECOMMANDED_DATE)).format('YYYY-MM-DD')),
                            gmApprovedDate: moment(new Date(element.gM_APPROVED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.gM_APPROVED_DATE)).format('YYYY-MM-DD'),
                            vpApprovedDate: moment(new Date(element.vP_APPROVED_DATE)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.vP_APPROVED_DATE)).format('YYYY-MM-DD'),
                            srmReviewDura: srmreviewduration,
                            regisDuration: registrationduration,
                            auditCompletion: auditcompletion,
                            documentKpi:documentkpi == 'N/A' ? 'N/A': (Number(documentkpi)<0?0: Number(documentkpi)),
                            docKpiResult: element.supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(documentkpi)<16?'Meets KPI': 'Does not Meet KPI'),
                            srmKpi: srmkpi== 'N/A' ? 'N/A': (Number(srmkpi)<0?0: Number(srmkpi)),
                            srmKpiResult: element.supplieR_CLASSIFICATION == '' ? 'N/A' : (Number(srmkpi)<16?'Meets KPI': 'Does not Meet KPI'),
                            totCount: element.toT_COUNT
                        }
                    )
                });

            } else {
                this.dataSourceDashboardList = [];
            }

            this.dataSourceDashboard = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
            this.tempData = this.dataSourceDashboardList;
            // this.dataSourceDashboard.paginator = this.tableOnePaginator;

            this.setFilterText();
            // this.filterChange('', '');
        }
        this.isloadeddata = false;
    }

    isAllSelected() {
        this.allSelected = this.ColumnList.every(function (item: any) {
            return item.isSelected == true;
        })
        this.getCheckedItemList();
    }

    onChangePage(pe: PageEvent) {
        var kpiDto = new KpiFields();
        kpiDto.startindex = pe.pageIndex * pe.pageSize;
        kpiDto.pagesize = pe.pageSize;

        for (let key in this.filterValues) {
            let filtervalue = this.filterValues[key];
            var type = key;

            if (type == "supplierCode") { kpiDto.suppliercode = filtervalue; }
            else if (type == "supplierName") { kpiDto.suppliername = filtervalue; }
            else if (type == "status") { kpiDto.status = filtervalue; }
            else if (type == "ifscode") { kpiDto.ifscode = filtervalue; }
            else if (type == "location") { kpiDto.location = filtervalue; }
            else if (type == "country") { kpiDto.country = filtervalue; }
            else if (type == "classification") { kpiDto.classification = filtervalue; }
            else if (type == "createddatefrom") { kpiDto.createdfrom = filtervalue; }
            else if (type == "createddateto") { kpiDto.createdto = filtervalue; }
            else if (type == "lastsupsubmitdatefrom") { kpiDto.lastsubmitfrom = filtervalue; }
            else if (type == "lastsupsubmitdateto") { kpiDto.lastsubmitto = filtervalue; }
            else if (type == "srmreviewfrom") { kpiDto.srmreviewfrom = filtervalue; }
            else if (type == "srmreviewto") { kpiDto.srmreviewto = filtervalue; }
            else if (type == "auditcompletefrom") { kpiDto.auditcompletefrom = filtervalue; }
            else if (type == "auditcompleteto") { kpiDto.auditcompleteto = filtervalue; }
            else if (type == "srmrecomfrom") { kpiDto.srmrecomfrom = filtervalue; }
            else if (type == "srmrecomto") { kpiDto.srmrecomto = filtervalue; }
            else if (type == "gmapprovedfrom") { kpiDto.gmapprovedfrom = filtervalue; }
            else if (type == "gmapprovedto") { kpiDto.gmapprovedto = filtervalue; }
            else if (type == "vpapprovedfrom") { kpiDto.vpapprovedfrom = filtervalue; }
            else if (type == "vpapprovedto") { kpiDto.vpapprovedto = filtervalue; }
            else if (type == "srmreviewdur") { kpiDto.srmreviewdur = filtervalue; }
            else if (type == "regisdur") { kpiDto.regisdur = filtervalue; }
            else if (type == "auditcom") { kpiDto.auditcom = filtervalue; }
            else if (type == "deptkpi") { kpiDto.deptkpi = filtervalue; }
            else if (type == "deptkpiResult") { kpiDto.deptkpiResult = filtervalue; }
            else if (type == "srmkpi") { kpiDto.srmkpi = filtervalue; }
            else if (type == "srmkpiResult") { kpiDto.srmkpiResult = filtervalue; }
        }



        this.isloadeddata = true;
        this.http.post<any>(environment.nodeurl + '/api/template/kpiData', kpiDto).subscribe(data2 => {
            if (data2) {
                this.isloadeddata = false;
                var messagelist = data2;
                this.filltabledata(messagelist, 'all');
            } else {
            }
            setTimeout(function () {
                this.issuccess = false;
                this.iserror = false;
            }.bind(this), 2000);
        });
    }

    selectedDate(type, event) {
        if (type == "createddatefrom") {
            if (event.value != null) { this.minCreatedDate = moment(event.value).format('YYYY-MM-DD'); }
            else { this.minCreatedDate = null; }
        }
        else {
            if (event.value != null) { this.maxCreatedDate = moment(event.value).format('YYYY-MM-DD'); }
            else { this.maxCreatedDate = null; }
        }
    }

    openRowInfo(position) {
        this.router.navigate(['/dashboard/inner/k/' + position]);
      }
}

