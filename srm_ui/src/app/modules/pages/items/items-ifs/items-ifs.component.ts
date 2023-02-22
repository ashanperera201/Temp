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
import { SelectionModel } from '@angular/cdk/collections';


export interface DashboardElement {
    supplierId: string;
    supplierCode: string;
    supplierEmail: string;
    supplierName: string;
    status: string;
    userrole: string;
    category: string;
    error: string;
    interfaceddate: string;
}



const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

@Component({
    selector: 'items-ifs',
    templateUrl: './items-ifs.component.html',
    styleUrls: ['./items-ifs.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]

})
export class ItemsIfsComponent {
    @ViewChild(ItemTagsDatatableComponent) child: ItemTagsDatatableComponent;
    @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;

    userrole: string = '';
    tagselected: any = 0;
    currentReqPage = '';
    dataSourceDashboardList: any = [];
    templateData: any = [];
    dataSourceDashboard = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
    selection = new SelectionModel<DashboardElement>(true, []);
    isloadeddata = true;
    selectedList: any;
    iserror = false;
    DataToExport = [];
    SupplierCode: boolean = false;
    SupplierName: boolean = false;
    Status: boolean = false;
    Email: boolean = false;
    Error: boolean = false;
    LastInterfacedDate: boolean = false;
    UserRole: boolean = false;

    allSelected: boolean = false;
    checkedList: any;
    filterValues = {};
    minDate = null;
    maxDate = null;

    errormessage = 'Select atleast one column';
    successmessage='Re-interface is done';
    issuccess = false;

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
    previousCount =0;

    minCreatedDate = null;
    maxCreatedDate = null;

    ColumnList = [
        // { name: 'Supplier Code', isSelected: false, val: 'supplierCode' },
        // { name: 'Supplier Name', isSelected: false, val: 'supplierName' },
        { name: 'Email', isSelected: false, val: 'Email' },
        { name: 'Status', isSelected: false, val: 'Status' },
        { name: 'Error', isSelected: false, val: 'Error' },
        { name: 'Last Interfaced Date', isSelected: false, val: 'LastInterfacedDate' },
        { name: 'User Role', isSelected: false, val: 'UserRole' }
    ];

    displayedDashboardColumns: string[] = ['select','supplierCode', 'supplierName', 'supplierEmail','status', 'error','interfaceddate','userrole','actions','history'];

    constructor(private http: HttpClient,private router: Router,private datePipe: DatePipe) {
        this.userrole = localStorage.getItem("userrole");
        this.filterValues = JSON.parse(localStorage.getItem('kpifilter'));
        this.filterValues = this.filterValues == null ? {} : this.filterValues;

        this.getSuppliers();
        this.RemoveAllFilters();
        // this.dataSourceDashboard.paginator = this.tableOnePaginator;
    }

    RemoveAllFilters() {
        localStorage.removeItem('reportfilter');
        localStorage.removeItem('allfilter-i');
        localStorage.removeItem('allfilter');
        localStorage.removeItem('auditfilter');
        localStorage.removeItem('allfilter-e');
    }

    isAllSelectedgrid() {
        this.errormessage = '';
        this.iserror = false;
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSourceDashboard.data.length;
        return numSelected === numRows;
      }

      /** Selects all rows if they are not all selected; otherwise clear selection. */
      masterToggle() {
        this.isAllSelectedgrid() ?
            this.selection.clear() :
            this.dataSourceDashboard.data.forEach(row => this.selection.select(row));
      }

    ExportToExcel(){
        if (this.selectedList != undefined) {
            if (this.selectedList.length > 0) {
              this.iserror = false;
              this.selectedValue();
              var count: number = 0;
              this.DataToExport = [];

              if (count == 0) {

                for (var i = 0; i < this.dataSourceDashboard.filteredData.length; i++) {
                  this.DataToExport.push({
                    Id: i + 1,
                    SupplierCode: this.dataSourceDashboard.data[i].supplierCode,
                    SupplierName: this.dataSourceDashboard.data[i].supplierName,
                    Email: this.dataSourceDashboard.data[i].supplierEmail,
                    Status: this.dataSourceDashboard.data[i].status,
                    Error: this.dataSourceDashboard.data[i].error,
                    LastInterfacedDate: moment(new Date(this.dataSourceDashboard.data[i].interfaceddate)).format('YYYY-MMM-DD HH:mm'),
                    UserRole: this.dataSourceDashboard.data[i].userrole
                  });

                  count = count + 1;
                }
              }

              if (count == this.dataSourceDashboard.filteredData.length) {
                var headerresult = this.DataToExport;

                let workbook = new Workbook();
                let worksheet = workbook.addWorksheet('Ifs Interfaced Failed Suppliers');

                var headertbltitles = [];

                headertbltitles.push("S. No");
                headertbltitles.push("Supplier Code");
                headertbltitles.push("Supplier Name");

                for (var i = 0; i < this.selectedList.length; i++) {
                  if (this.selectedList[i]) {
                    headertbltitles.push(this.selectedList[i].name);
                  }
                }

                let headerRow = worksheet.addRow(headertbltitles);
                headerRow.font = { bold: true }

                // colour the header
                for (var i = 0; i < this.selectedList.length; i++) {
                  if (this.selectedList[i]) {
                    worksheet.getRow(1).getCell(1).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    worksheet.getRow(1).getCell(2).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    worksheet.getRow(1).getCell(3).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    var num: number = 0;
                    num = i + 4;
                    worksheet.getRow(1).getCell(num).fill = {
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

                  row.push(x.SupplierCode);
                  row.push(x.SupplierName);
                  if (this.Email) { row.push(x.Email); }
                  if (this.Status) { row.push(x.Status); }
                  if (this.Error) { row.push(x.Error); }
                  if (this.LastInterfacedDate) { row.push(x.LastInterfacedDate); }
                  if (this.UserRole) { row.push(x.UserRole); }

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

                // Generate Excel File with given name
                workbook.xlsx.writeBuffer().then((data) => {
                  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, 'AllFailedSuppliersDetails.xlsx');
                });
              }
            }
            else {
              this.iserror = true;
            }
          }
          else{
            this.iserror = true;
          }
    }

    selectedValue() {
        this.Status = false;
        this.Email = false;
        this.Error = false;
        this.LastInterfacedDate = false;
        this.UserRole = false;

        for (var i = 0; i < this.selectedList.length; i++) {
            if (this.selectedList[i].val == "Status") {
                this.Status = true;
            }
            if (this.selectedList[i].val == "Email") {
                this.Email = true;
            }
            if (this.selectedList[i].val == "Error") {
                this.Error = true;
            }
            if (this.selectedList[i].val == "LastInterfacedDate") {
                this.LastInterfacedDate = true;
            }
            if (this.selectedList[i].val == "UserRole") {
                this.UserRole = true;
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
        var supplierid= 0;

        this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+supplierid).subscribe(data2 => {
            if (data2) {
                this.isloadeddata = false;
                var messagelist = data2;
                this.filltabledata(messagelist, 'all');
                // this.totalSize = messagelist.length;
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
            // this.totalSize = data.length > 0 ? data[0].toT_COUNT : 0;

            if (data.length > 0) {
                data.forEach(element => {
                    var interfaceddate=moment(new Date(element.interfacedDate)).format('YYYY-MM-DD') == '1900-01-01' ? '' : moment(new Date(element.interfacedDate)).format('YYYY-MMM-DD HH:MM');

                    this.dataSourceDashboardList.push(
                        {
                            supplierId: element.supplierId,
                            supplierCode: element.supplierCode,
                            supplierName: element.supplierName,
                            supplierEmail: element.supplierEmail,
                            userrole: element.userrole,
                            status: element.status,
                            category: element.category,
                            error: element.error,
                            interfaceddate: interfaceddate,
                        }
                    )
                });

            } else {
                this.dataSourceDashboardList = [];
            }

            this.dataSourceDashboard = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
            this.tempData = this.dataSourceDashboardList;
            this.dataSourceDashboard.paginator = this.tableOnePaginator;

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
        this.router.navigate(['/items/ifs-supplier/' + position]);
      }

    reinterface(){
       if(this.selection.selected.length >0){



        Swal.fire({
            title: 'Please wait... We are re-interfacing the suppliers!',
            showConfirmButton: false,
            allowOutsideClick: false
        })
        Swal.showLoading();

        this.selection.selected.forEach(element => {
            this.getSupplierData(element);
        });

       }else{
        this.iserror = true;
        this.errormessage = 'Please select suppliers to re-interface!';
       }
    }

    getSupplierData(element){
        this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + element.supplierId)
        .subscribe(data => {

            var supplier = data[0];
            let catvalues = data[0].supplierCategories;
                if (catvalues) {
                    var categories = []
                    for (let i = 0; i < catvalues.length; i++) {
                        categories.push({
                            //id: i,
                            position: catvalues[i].position,
                            generalCategory: catvalues[i].generalCategory,
                            subCategory: catvalues[i].subCategory,
                            detailCategory: catvalues[i].detailCategory,
                            isChecked: catvalues[i].isChecked,
                            isSRMChecked: catvalues[i].isSRMChecked,
                            generalCode: catvalues[i].generalCode,
                            subCode: catvalues[i].subCode,
                            detailCode: catvalues[i].detailCode
                        });
                    }
                }

                this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+element.supplierId).subscribe(data2 => {
                    if (data2) {
                        this.previousCount = data2.length;
                        if(element.userrole == 'IMI-VP'){
                            this.interfaceSupplierData(supplier,categories);
                        }else{
                            this.interfaceBankData(supplier);
                        }
                    }
                });


        });
    }

    interfaceSupplierData(supplier,categories){
        const ifsSupplier = {
            supplier_id: supplier.supplier_id,
            supplier_name: supplier.supplier_name,
            email: supplier.email,
            supplier_name_arabic: supplier.supplier_name_arabic,
            establishment_year: supplier.establishment_year,
            issued_by: supplier.issued_by,
            web_site: supplier.web_site,
            supplier_type: supplier.supplier_type,
            country: supplier.country,
            city: supplier.city,
            other_city: supplier.other_city,

            po_box: supplier.po_box,
            postal_code: supplier.postal_code,
            address_line1: supplier.address_line1,
            address_line2: supplier.address_line2,
            title: supplier.title,
            first_name: supplier.first_name,
            last_name: supplier.last_name,
            telphone_country_code: supplier.telphone_country_code,
            telephone_no: supplier.telephone_no,
            extension: supplier.extension,
            position: supplier.position,
            mobile_country_code: supplier.mobile_country_code,
            mobile_no: supplier.mobile_no,
            fax_country_code: supplier.fax_country_code,
            fax_no: supplier.fax_no,
            additional_material: supplier.additional_material,

            cr_no: supplier.cr_no,
            vat_no: supplier.vat_no,
            gosi_certificate: supplier.gosi_certificate,

            parentcompany: supplier.parentcompany,
            sistercompany: supplier.sistercompany,
            ownercompany: supplier.ownercompany,
            operatingProfit1: supplier.operatingProfit1,
            operatingProfit2: supplier.operatingProfit2,
            netIncome1: supplier.netIncome1,
            netIncome2: supplier.netIncome2,
            currentAsset1: supplier.currentAsset1,
            currentAsset2: supplier.currentAsset2,
            totalLiable1: supplier.totalLiable1,
            totalLiable2: supplier.totalLiable2,
            totalEquity1: supplier.totalEquity1,
            totalEquity2: supplier.totalEquity2,
            noOfYears: supplier.noOfYears,
            ownsPlantEquip: supplier.ownsPlantEquip,
            designnCap: supplier.designnCap,
            finishProd: supplier.finishProd,
            internalPolicy: supplier.internalPolicy,
            registeredOrg: supplier.registeredOrg,
            suspendedProj1: supplier.suspendedProj1,
            suspendedProj2: supplier.suspendedProj2,
            litigation1: supplier.litigation1,
            litigation2: supplier.litigation2,
            compliance1: supplier.compliance1,
            compliance2: supplier.compliance2,
            shareholder1: supplier.shareholder1,
            shareholder2: supplier.shareholder2,
            labour1: supplier.labour1,
            labour2: supplier.labour2,
            environment1: supplier.environment1,
            environment2: supplier.environment2,
            imiInterested1: supplier.imiInterested1,
            imiInterested2: supplier.imiInterested2,
            hse1: supplier.hse1,
            hse2: supplier.hse2,
            docuHse: supplier.docuHse,
            isohealth: supplier.isohealth,
            envtMgt1: supplier.envtMgt1,
            envtMgt2: supplier.envtMgt2,
            dedicatedpers: supplier.dedicatedpers,
            statistic: supplier.statistic,
            qualityPolicy1: supplier.qualityPolicy1,
            qualityPolicy2: supplier.qualityPolicy2,
            qualityMgt: supplier.qualityMgt,
            qualityResp1: supplier.qualityResp1,
            qualityResp2: supplier.qualityResp2,
            qualityreviewDate: supplier.qualityreviewDate,
            typeOfOrganization: supplier.typeOfOrganization,
            typeOfOrganization2: supplier.typeOfOrganization2,
            managerialno: supplier.managerialno,
            technicalno: supplier.technicalno,
            operationsno: supplier.operationsno,
            saudiNationalsno: supplier.saudiNationalsno,
            totallno: supplier.totallno,
            hijriSelected: supplier.hijriSelected,

            bankCountryCodes: supplier.bankCountryCodes,
            // qualityResp2Ctrl: supplier.qualityResp2,
            bankName: supplier.bankName != 'Other' ? supplier.bankName : supplier.otherBankName,
            swiftcode: supplier.swiftcode,
            accountHolderName: supplier.accountHolderName,
            ibanNo: supplier.ibanNo,
            bankAddress: supplier.bankAddress,
            bankAddress2: supplier.bankAddress2,
            accountCurrency: supplier.accountCurrency,
            account_number: supplier.account_number,
            isEmergencySupplier: 'FALSE',
            supplierCategories: categories,
            wasalAddress: supplier.wasalAddress,
            additionalCtrl: supplier.additionalCtrl,
            additionalCtrl2: supplier.additionalCtrl2,
            additionalCtrl3: supplier.additionalCtrl3,
            additionalCtrl4: supplier.additionalCtrl4,
            additionalCtrl5: supplier.additionalCtrl5,
            supplier_extra: supplier.supplier_extra

        }

        this.http.post<any>(environment.ifsIntegrationUrl + '/api/supplier/', ifsSupplier).subscribe(data3 => {
            if (data3["Response"]) {
                if (data3["Message"] != null) {
                    var ifscode = data3["Message"];
                    this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+ifsSupplier.supplier_id).subscribe(data2 => {
                        if (data2) {
                            var messagelist = data2;
                            if(this.previousCount == data2.length){
                                this.http.post<any>(environment.nodeurl + '/api/supplier/ifsreinterfacestatus?supplierId=' + ifsSupplier.supplier_id, null).subscribe(data => {
                                    this.getSuppliers();

                                });
                            }
                        }
                    });

                }
                this.issuccess = true;

            }

            Swal.close();
            this.issuccess = true;
        });
    }

    interfaceBankData(supplier){
        const bankdetails = {
            SupplierId: supplier.supplier_id,
            SupplierName: supplier.supplier_name,
            BankName: supplier.bankName != 'Other' ? supplier.bankName : supplier.otherBankName,
            AccountNo: supplier.account_number,
            IbanNo: supplier.ibanNo,
            BicCode: supplier.swiftcode,
            AddressLine1: supplier.bankAddress,
            AddressLine2: supplier.bankAddress2,
            IsEmergencySupplier: "FALSE",
            BankCountry: supplier.bankCode,
            Currency: supplier.accountCurrency,
            exp_date: ''
        }

        this.http.post(environment.ifsIntegrationUrl + '/api/Bank/', bankdetails).subscribe(data3 => {
            if (data3["Response"]) {
                if (data3["Message"] != null) {
                    var ifscode = data3["Message"];
                    this.http.get<any>(environment.nodeurl + '/api/supplier/ifsfailed?supplierID='+bankdetails.SupplierId).subscribe(data2 => {
                        if (data2) {
                            var messagelist = data2;
                            if(this.previousCount == data2.length){
                                this.http.post<any>(environment.nodeurl + '/api/supplier/ifsreinterfacestatus?supplierId=' + bankdetails.SupplierId, null).subscribe(data => {
                                    this.getSuppliers();

                                });
                            }
                        }
                    });

                }
                this.issuccess = true;

            }

            Swal.close();
            this.issuccess = true;
        });
    }

    edit(element){
        var ele= element;
        this.router.navigate(['/items/ifs-supplier/edit/' + element.supplierId]);

    }

    ViewHistory(element){
        var ele= element;
        this.router.navigate(['/items/ifs-supplier/history/' + element.supplierId]);
        
    }
}

