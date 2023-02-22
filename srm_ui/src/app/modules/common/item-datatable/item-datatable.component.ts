import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { identity } from 'lodash';
import moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export interface DashboardElement {
  supplierName: string;
  position: string;
  status: string;
  currentPosition: string;
  country: string;
  criticality: string;
  establishmentyear: string;
  createddate: string;
  issuedby: string;
  city: string;
  postalcode: string;
  adressline1: string;
  firstname: string;
  email: string;
  crno: string;
  typeoforg: string;
  vatno: string;
}

export class Template {
  TemplateName: string;
  FilterText: string;
  Query: string;
}

const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];


@Component({
  selector: 'app-item-datatable',
  templateUrl: './item-datatable.component.html',
  styleUrls: ['./item-datatable.component.scss'],
  providers: [DatePipe]
})
export class ItemDatatableComponent implements OnInit {
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;

  dataSourceDashboard = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
  tempData: DashboardElement[];

  currentReqPage = '';
  isloadeddata = true;

  displayedDashboardColumns: string[] = ['position', 'supplierName', 'criticality', 'status', 'currentPosition', 'country', 'createddate',
    'establishmentyear', 'issuedby', 'city', 'postalcode', 'adressline1', 'firstname', 'email', 'crno', 'typeoforg', 'vatno'];

  dataSourceDashboardList: any = [];
  filterValues = {};
  supplierName = '';
  status = '';
  currentPosition = '';
  country = '';
  criticality = '';
  establishmentyearfrom = '';
  establishmentyearto = '';
  position = '';
  createddatefrom = '';
  createddateto = '';
  issuedby = '';
  city = '';
  postalcode = '';
  adressline1 = '';
  firstname = '';
  email = '';
  crno = '';
  typeoforg = '';
  vatno = '';
  filtertext = "";
  displaytemplatecreate = false;

  // Excel related columns
  ColumnList = [
    { name: 'Status', isSelected: false, val: 'Status' },
    { name: 'Country', isSelected: false, val: 'Country' },
    { name: 'Criticality', isSelected: false, val: 'Criticality' },
    { name: 'Current Position', isSelected: false, val: 'CurrentPosition' },
    { name: 'Establishment Year', isSelected: false, val: 'EstablishmentYear' },
    { name: 'Created Date', isSelected: false, val: 'CreatedDate' },
    { name: 'Issued By', isSelected: false, val: 'IssuedBy' },
    { name: 'City', isSelected: false, val: 'City' },
    { name: 'Postal Code', isSelected: false, val: 'PostalCode' },
    { name: 'Address Line1', isSelected: false, val: 'AddressLine1' },
    { name: 'First Name', isSelected: false, val: 'FirstName' },
    { name: 'Email', isSelected: false, val: 'Email' },
    { name: 'CR No', isSelected: false, val: 'CRNo' },
    { name: 'Type Of Org', isSelected: false, val: 'TypeOfOrg' },
    { name: 'Vat No', isSelected: false, val: 'VatNo' }
  ];
  DataToExport = [];
  checkedList: any;
  selectedList: any;

  allSelected: boolean = false;
  SupplierCode: boolean = false;
  SupplierName: boolean = false;
  Status: boolean = false;
  Country: boolean = false;
  Criticality: boolean = false;
  CurrentPosition: boolean = false;
  EstablishmentYear: boolean = false;
  CreatedDate: boolean = false;
  IssuedBy: boolean = false;
  City: boolean = false;
  PostalCode: boolean = false;
  AddressLine1: boolean = false;
  FirstName: boolean = false;
  Email: boolean = false;
  CRNo: boolean = false;
  TypeOfOrg: boolean = false;
  VatNo: boolean = false;

  iserror = false;
  iserrortemplate:boolean= false;
  issuccesstemplate:boolean= false;
  templateclicked:boolean= false;
  errormessage = 'Select atleast one column';
  errormessagetemplate = 'Error when saving the template';
  successmessagetemplate = 'Sucessfully saved the template';
  templateData: any= [];
  
  minDate = null;
  maxDate = null;

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
    this.getCheckedItemList();
    this.getTemplate();
    this.RemoveAllFilters();
  }

  ngOnInit(): void {
    var loggedInRole = localStorage.getItem('userrole');
    // var loggedInRole = 'Admin';
    if (loggedInRole == 'Admin') {
      this.displaytemplatecreate = true;
    }

    this.filterValues = JSON.parse(localStorage.getItem('allfilter'));
    this.filterValues = this.filterValues == null ? {} : this.filterValues;

  }

  filltabledata(data: any, page: string) {
    if (data) {
      this.currentReqPage = page;
      this.dataSourceDashboardList = [];
      data.forEach(element => {
        this.dataSourceDashboardList.push(
          {
            position: element.supplier_code,
            supplierName: element.supplier_name,
            status: element.status,
            currentPosition: element.position ? element.position : '',
            country: element.country ? element.country : '',
            criticality: element.criticality > 6 ? 'High Critical' : (element.criticality == 5 || element.criticality == 6) ? 'Critical' :
              (element.criticality > 0 && element.criticality < 5) ? 'Non Critical' : 'Not categorized',
            establishmentyear: element.establishment_year != 0 ? element.establishment_year : '',
            createddate: element.created_date,
            issuedby: element.issued_by ? element.issued_by : '',
            city: element.city ? element.city : '',
            postalcode: element.postal_code ? element.postal_code : '',
            adressline1: element.address_line1 ? element.address_line1 : '',
            firstname: element.first_name ? element.first_name : '',
            email: element.email ? element.email : '',
            crno: element.cr_no ? element.cr_no : '',
            typeoforg: element.typeOfOrganization ? element.typeOfOrganization : '',
            vatno: element.vat_no ? element.vat_no : '',
            supplierid: element.supplier_id
          }
        )
      });

      this.dataSourceDashboard = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
      this.tempData = this.dataSourceDashboardList;
      this.dataSourceDashboard.paginator = this.tableOnePaginator;

      this.setFilterText();
      this.filterChange('', '');
    }
    this.isloadeddata = false;
  }

  filterChange(filter, event) {
    var value = '';
    if (filter == "createddatefrom" || filter == "createddateto") {
      // value = this.datePipe.transform(event, 'yyyy-MM-dd');
      value = moment(event).format('YYYY-MM-DD');
    } else {
      value = event ? event.target.value.trim().toLowerCase() : '';
    }

    if (filter != '') {
      this.filterValues[filter] = value;
    }

    localStorage.setItem('allfilter', JSON.stringify(this.filterValues));

    this.dataSourceDashboard.data = this.tempData;

    for (let key in this.filterValues) {
      let value = this.filterValues[key];
      var type = key;

      const temp = this.dataSourceDashboard.data.filter(function (d) {
        var result;
        if ((type != "createddatefrom" && type != "createddateto") && (type != "establishmentyearfrom" && type != "establishmentyearto")) {
          if (type == "position") { result = d.position.toString(); }
          else if (type == "status") { result = d.status.toString(); }
          else if (type == "supplierName") { result = d.supplierName.toString(); }
          else if (type == "currentPosition") { result = d.currentPosition.toString(); }
          else if (type == "country") { result = d.country.toString(); }
          else if (type == "criticality") { result = d.criticality.toString(); }
          else if (type == "issuedby") { result = d.issuedby.toString(); }
          else if (type == "city") { result = d.city.toString(); }
          else if (type == "postalcode") { result = d.postalcode.toString(); }
          else if (type == "adressline1") { result = d.adressline1.toString(); }
          else if (type == "firstname") { result = d.firstname.toString(); }
          else if (type == "email") { result = d.email.toString(); }
          else if (type == "crno") { result = d.crno.toString(); }
          else if (type == "typeoforg") { result = d.typeoforg.toString(); }
          else if (type == "vatno") { result = d.vatno.toString(); }
          return result.toLowerCase().indexOf(value) == 0 || !value || result.toLowerCase().includes(value);
        } else if (type == "createddatefrom" || type == "createddateto") {
          if (type == "createddatefrom") { return moment(d.createddate).format('YYYY-MM-DD') >= value || !value; }
          else if (type == "createddateto") { return moment(d.createddate).format('YYYY-MM-DD') <= value || !value; }
        } else if (type == "establishmentyearfrom" || type == "establishmentyearto") {
          if (type == "establishmentyearfrom") { return d.establishmentyear >= value || !value; }
          else if (type == "establishmentyearto") { return d.establishmentyear <= value || !value; }
        }
      });
      this.dataSourceDashboard.data = temp;
      this.isloadeddata = false;

    }

  }

  onTemplateSave() {

    this.iserrortemplate = false;
    this.issuccesstemplate= false;

    this.templateclicked= true;

    if (this.filtertext) {

      if(this.templateData.findIndex(x=>x.templateName.toLowerCase() == this.filtertext.toLowerCase())<0){
        var status = this.filterValues['status'] ? this.filterValues['status'] : '';
        var name = this.filterValues['supplierName'] ? this.filterValues['supplierName'] : '';
        var position = this.filterValues['currentPosition'] ? this.filterValues['currentPosition'] : '';
        var supplierId = this.filterValues['position'] ? this.filterValues['position'] : '';
        var country = this.filterValues['country'] ? this.filterValues['country'] : '';
        var criticality = '';
  
        if (this.filterValues['criticality']) {
          criticality = this.filterValues['criticality'] == 'high critical' ? 'criticality_value > 6' :
            (this.filterValues['criticality'] === 'critical' ? ' criticality_value between 5 and 6' :
              (this.filterValues['criticality'] === 'non critical' ? 'criticality_value between 1 and 4' : '((criticality_value =0 or  criticality_value is null))'));
  
        } else {
          criticality = ' (criticality_value is null or criticality_value is not null)'
        }
  
        var establishmentyearfrom = this.filterValues['establishmentyearfrom'] ? this.filterValues['establishmentyearfrom'] : 0;
        var establishmentyearto = this.filterValues['establishmentyearto'] ? this.filterValues['establishmentyearto'] : 9999;
        var issuedby = this.filterValues['issuedby'] ? this.filterValues['issuedby'] : '';
        var city = this.filterValues['city'] ? this.filterValues['city'] : '';
        var postalcode = this.filterValues['postalcode'] ? this.filterValues['postalcode'] : '';
        var adressline1 = this.filterValues['adressline1'] ? this.filterValues['adressline1'] : '';
        var firstname = this.filterValues['firstname'] ? this.filterValues['firstname'] : '';
        var email = this.filterValues['email'] ? this.filterValues['email'] : '';
        var crno = this.filterValues['crno'] ? this.filterValues['crno'] : '';
        var typeoforg = this.filterValues['typeoforg'] ? this.filterValues['typeoforg'] : '';
        var vatno = this.filterValues['vatno'] ? this.filterValues['vatno'] : '';
  
  
        var query = 'lower(status) like \'' + status + '%\' and lower(supplier_name) like \'%' + name + '%\' and lower(supplier_code) like \'%'
          + supplierId + '%\' and lower(position) like \'%' + position + '\' and lower(country) like \'%' + country + '%\' and ' + criticality + ' and establishment_year between ' + establishmentyearfrom +
          ' and ' + establishmentyearto +
          ' and lower(issued_by) like \'%' + issuedby + '%\' and lower(city) like \'%' + city + '%\' and lower(postal_code) like \'%' + postalcode +
          '%\' and lower(ADDRESS_LINE1) like \'%' + adressline1 + '%\' and lower(FIRST_NAME) like \'%' + firstname + '%\' and lower(EMAIL) like \'%' +
          email + '%\' and lower(cr_no) like \'%' + crno + '%\' and lower(TYPE_OF_ORG) like \'%' + typeoforg + '%\' and (lower(VAT_NO) like \'%' + vatno + '%\'  or VAT_NO is null)';
  
  
        var templatedto = new Template();
        templatedto.TemplateName = this.filtertext;
        templatedto.FilterText = this.filterValues['status'] + ',' + this.filterValues['supplierName'];
        templatedto.Query = query;
  
        this.http.post<any>(environment.nodeurl + '/api/template/', templatedto).subscribe(data2 => {
          this.issuccesstemplate = true;
          this.errormessagetemplate = 'Successfully saved the template !';
          this.getTemplate();
          this.templateclicked = false;
        });
      }else{
        this.iserrortemplate = true;
        this.errormessagetemplate = 'Template name already exists !';
        this.templateclicked = false;

      }
      
    } else {
      this.iserrortemplate = true;
      this.errormessagetemplate = 'Please enter the template name !';
      this.templateclicked = false;

    }
  }

  openRowInfo(position) {
    // var id = position.split('-')[2];
    var id= this.dataSourceDashboardList.filter(x=>x.position== position)[0]['supplierid'];
    if (this.currentReqPage == 'tags') {

      this.router.navigate(['/dashboard/inner/t/' + id]);

    } else {

      this.router.navigate(['/dashboard/inner/i/' + id]);

    }

  }

  setFilterText() {
    this.status = this.filterValues['status'] ? this.filterValues['status'] : '';
    this.supplierName = this.filterValues['supplierName'] ? this.filterValues['supplierName'] : '';
    this.currentPosition = this.filterValues['currentPosition'] ? this.filterValues['currentPosition'] : '';
    this.position = this.filterValues['position'] ? this.filterValues['position'] : '';
    this.country = this.filterValues['country'] ? this.filterValues['country'] : '';
    this.criticality = this.filterValues['criticality'] ? this.filterValues['criticality'] : '';
    this.createddatefrom = this.filterValues['createddatefrom'] ? this.filterValues['createddatefrom'] : '';
    this.createddateto = this.filterValues['createddateto'] ? this.filterValues['createddateto'] : '';
    this.establishmentyearfrom = this.filterValues['establishmentyearfrom'] ? this.filterValues['establishmentyearfrom'] : '';
    this.establishmentyearto = this.filterValues['establishmentyearto'] ? this.filterValues['establishmentyearto'] : '';
    this.issuedby = this.filterValues['issuedby'] ? this.filterValues['issuedby'] : '';
    this.city = this.filterValues['city'] ? this.filterValues['city'] : '';
    this.postalcode = this.filterValues['postalcode'] ? this.filterValues['postalcode'] : '';
    this.adressline1 = this.filterValues['adressline1'] ? this.filterValues['adressline1'] : '';
    this.firstname = this.filterValues['firstname'] ? this.filterValues['firstname'] : '';
    this.email = this.filterValues['email'] ? this.filterValues['email'] : '';
    this.crno = this.filterValues['crno'] ? this.filterValues['crno'] : '';
    this.typeoforg = this.filterValues['typeoforg'] ? this.filterValues['typeoforg'] : '';
    this.vatno = this.filterValues['vatno'] ? this.filterValues['vatno'] : '';
  }

  resetFilters() {
    this.filterValues = {};
    this.filterChange('', '');
    this.setFilterText();

    this.maxDate = null;
    this.minDate = null;
  }

  // The master checkbox will check/ uncheck all items
  toggleAllSelection() {
    for (var i = 0; i < this.ColumnList.length; i++) {
      this.ColumnList[i].isSelected = this.allSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.allSelected = this.ColumnList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
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

  // Select column
  selectedValue() {
    this.Status = false;
    this.Country = false;
    this.Criticality = false;
    this.CurrentPosition = false;
    this.EstablishmentYear = false;
    this.CreatedDate = false;
    this.IssuedBy = false;
    this.City = false;
    this.PostalCode = false;
    this.AddressLine1 = false;
    this.FirstName = false;
    this.Email = false;
    this.CRNo = false;
    this.TypeOfOrg = false;
    this.VatNo = false;

    for (var i = 0; i < this.selectedList.length; i++) {
      if (this.selectedList[i].val == "Status") {
        this.Status = true;
      }
      if (this.selectedList[i].val == "Country") {
        this.Country = true;
      }
      if (this.selectedList[i].val == "Criticality") {
        this.Criticality = true;
      }
      if (this.selectedList[i].val == "CurrentPosition") {
        this.CurrentPosition = true;
      }
      if (this.selectedList[i].val == "EstablishmentYear") {
        this.EstablishmentYear = true;
      }
      if (this.selectedList[i].val == "CreatedDate") {
        this.CreatedDate = true;
      }
      if (this.selectedList[i].val == "IssuedBy") {
        this.IssuedBy = true;
      }
      if (this.selectedList[i].val == "City") {
        this.City = true;
      }
      if (this.selectedList[i].val == "PostalCode") {
        this.PostalCode = true;
      }
      if (this.selectedList[i].val == "AddressLine1") {
        this.AddressLine1 = true;
      }
      if (this.selectedList[i].val == "FirstName") {
        this.FirstName = true;
      }
      if (this.selectedList[i].val == "Email") {
        this.Email = true;
      }
      if (this.selectedList[i].val == "CRNo") {
        this.CRNo = true;
      }
      if (this.selectedList[i].val == "TypeOfOrg") {
        this.TypeOfOrg = true;
      }
      if (this.selectedList[i].val == "VatNo") {
        this.VatNo = true;
      }

    }
  }

  // Export data to excel sheet
  ExportToExcel() {
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
              SupplierCode: this.dataSourceDashboard.data[i].position,
              SupplierName: this.dataSourceDashboard.data[i].supplierName,
              Status: this.dataSourceDashboard.data[i].status,
              Country: this.dataSourceDashboard.data[i].country,
              Criticality: this.dataSourceDashboard.data[i].criticality,
              CurrentPosition: this.dataSourceDashboard.data[i].currentPosition,
              EstablishmentYear: this.dataSourceDashboard.data[i].establishmentyear ? this.dataSourceDashboard.data[i].establishmentyear : '',
              CreatedDate: moment(new Date(this.dataSourceDashboard.data[i].createddate)).format('YYYY-MM-DD HH:mm'),
              IssuedBy: this.dataSourceDashboard.data[i].issuedby,
              City: this.dataSourceDashboard.data[i].city,
              PostalCode: this.dataSourceDashboard.data[i].postalcode,
              AddressLine1: this.dataSourceDashboard.data[i].adressline1,
              FirstName: this.dataSourceDashboard.data[i].firstname,
              Email: this.dataSourceDashboard.data[i].email,
              CRNo: this.dataSourceDashboard.data[i].crno,
              TypeOfOrg: this.dataSourceDashboard.data[i].typeoforg,
              VatNo: this.dataSourceDashboard.data[i].vatno
            });

            count = count + 1;
          }
        }

        if (count == this.dataSourceDashboard.filteredData.length) {
          var headerresult = this.DataToExport;

          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet('All Suppliers');

          // headers
          // let titleRow = worksheet.addRow(["All Suppliers' Details"]);
          // titleRow.font = { size: 16, bold: true }
          // worksheet.addRow([]);
          // worksheet.addRow([]);

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
          headerRow.font = { bold: true };

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
            if (this.Status) { row.push(x.Status); }
            if (this.Country) { row.push(x.Country); }
            if (this.Criticality) { row.push(x.Criticality); }
            if (this.CurrentPosition) { row.push(x.CurrentPosition); }
            if (this.EstablishmentYear) { row.push(x.EstablishmentYear); }
            if (this.CreatedDate) { row.push(x.CreatedDate); }
            if (this.IssuedBy) { row.push(x.IssuedBy); }
            if (this.City) { row.push(x.City); }
            if (this.PostalCode) { row.push(x.PostalCode); }
            if (this.AddressLine1) { row.push(x.AddressLine1); }
            if (this.FirstName) { row.push(x.FirstName); }
            if (this.Email) { row.push(x.Email); }
            if (this.CRNo) { row.push(x.CRNo); }
            if (this.TypeOfOrg) { row.push(x.TypeOfOrg); }
            if (this.VatNo) { row.push(x.VatNo); }

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
            fs.saveAs(blob, 'AllSuppliersDetails.xlsx');
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

  // Set min and max date selection to created date
  selectedDate(type, event) {
    if (type == "createddatefrom") {
      if (event.value != null) { this.minDate = moment(event.value).format('YYYY-MM-DD'); }
      else { this.minDate = null; }
    }
    else {
      if (event.value != null) { this.maxDate = moment(event.value).format('YYYY-MM-DD'); }
      else { this.maxDate = null; }
    }
  }

  getTemplate() {
    this.http.get<any>(environment.nodeurl + '/api/template/').subscribe(data => {
        this.templateData = data;
    });
}

RemoveAllFilters(){
  localStorage.removeItem('reportfilter');
  localStorage.removeItem('allfilter-i');
  localStorage.removeItem('auditfilter');
  localStorage.removeItem('allfiltertags');
  localStorage.removeItem('allfilter-e');
  localStorage.removeItem('kpifilter');
}

}
