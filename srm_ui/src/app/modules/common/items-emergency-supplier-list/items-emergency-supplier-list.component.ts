import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export interface EmergencyElement {
  position: string;
  supplierId: string;
  ifsSupplierCode: string;
  name: string;
  ifsStatus: string;
  registrationNumber: string;
  createdDate: string;
  yearOfEstablishement: string;
  pushSupplierStatus: string;
  role: string;
  buyerName: string;
  buyerEmail: string;
  srmRemark: string;
  contactemail: string;
  contactPhone: string;
  contactName: string;
}

const ELEMENT_EMERGENCY: EmergencyElement[] = [];

@Component({
  selector: 'app-items-emergency-supplier-list',
  templateUrl: './items-emergency-supplier-list.component.html',
  styleUrls: ['./items-emergency-supplier-list.component.scss'],
  providers: [DatePipe]
})
export class ItemsEmergPendingListComponent implements OnInit {

  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild('select') select: MatSelect;

  dataSource = new MatTableDataSource(ELEMENT_EMERGENCY);
  displayedColumns: string[] = ['id', 'supplierId', 'name', 'position','contactName', 'supplierEmail', 'supplierPhone', 'ifsStatus', 'registrationNumber', /* 'SRMRemarkAfterVPRejection', */
    'createdDate', /* 'additionalScope', */ 'yearOfEstablishement', 'ifsSupplierCode', 'pushSupplierStatus', 'role', 'buyerName', /* 'supplierRegKey', */ 'buyerEmail', 'srmRemark'];

  custom_search = [
    { value: true, viewValue: 'All' },
    { value: true, viewValue: 'Supplier Code' },
    { value: true, viewValue: 'Supplier Name' },
    { value: true, viewValue: 'Position' },
    { value: true, viewValue: 'Contact Person Name' },
    { value: true, viewValue: 'Contact Email' },
    { value: true, viewValue: 'Contact Phone' },
    { value: true, viewValue: 'Status' },
    { value: true, viewValue: 'CR/Registration #' },
    { value: true, viewValue: 'Year of Establishment' },
    { value: true, viewValue: 'IFS Supplier Code' },
    { value: true, viewValue: 'Push Supplier Status' },
    { value: true, viewValue: 'Role' },
    { value: true, viewValue: 'Creator Name' },
    { value: true, viewValue: 'Creator Email' }
  ];
  choose_search: any;
  tempData: EmergencyElement[];
  tempDataBeforeDateClear: EmergencyElement[];
  filterValues = {};
  filterValuesBackButton = {};

  pipe: DatePipe;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  fromDateValue: boolean = false;
  toDateValue: boolean = false;
  DateValue: any;

  currentUserRole: any;
  currentUserName: any;
  currentUserEmail: any;

  get fromDate() { return this.range.get('start').value; }
  get toDate() { return this.range.get('end').value; }

  public date: any;
  supplierId = '';
  name = '';
  position = '';
  supplierEmail = '';
  supplierPhone = '';
  contactPersonName = '';
  ifsStatus = '';
  registrationNumber = '';
  createddatefrom = '';
  createddateto = '';
  establishmentyearfrom = '';
  establishmentyearto = '';
  ifsSupplierCode = '';
  pushSupplierStatus = '';
  role = '';
  buyerName = '';
  buyerEmail = '';
  srmRemark = '';
  checkSearchForBackButton = '';

  minDate = null;
  maxDate = null;

  ColumnList = [
    { name: 'Position', isSelected: false, val: 'position' },
    { name: 'Contact Person Name', isSelected: false, val: 'contactname' },
    { name: 'Contact Email', isSelected: false, val: 'contactemail' },
    { name: 'Contact Phone', isSelected: false, val: 'contactPhone' },
    { name: 'Status', isSelected: false, val: 'ifsStatus' },
    { name: 'CR/Registration #', isSelected: false, val: 'registrationNumber' },
    { name: 'Created Date', isSelected: false, val: 'createdDate' },
    { name: 'Year of Establishment', isSelected: false, val: 'yearOfEstablishement' },
    { name: 'IFS Supplier Code', isSelected: false, val: 'ifsSupplierCode' },
    { name: 'Push Supplier Status', isSelected: false, val: 'pushSupplierStatus' },
    { name: 'Role', isSelected: false, val: 'role' },
    { name: 'Creator Name', isSelected: false, val: 'buyerName' },
    { name: 'Creator Email', isSelected: false, val: 'buyerEmail' },
    { name: 'Remark/Requested Department', isSelected: false, val: 'srmRemark' }
  ];
  
  checkedList: any;
  selectedList: any;
  DataToExport = [];

  SupplierCode: boolean = false;
  SupplierName: boolean = false;
  Position: boolean = false;
  ContactEmail: boolean = false;
  ContactPhone: boolean = false;
  ContactName: boolean = false;
  Status: boolean = false;
  RegNo: boolean = false;
  CreatedDate: boolean = false;
  EstablishmentYear: boolean = false;
  IFSsupplierCode: boolean = false;
  PushSupplierStatus: boolean = false;
  Role: boolean = false;
  CreatorName: boolean = false;
  CreatorEmail: boolean = false;
  SrmRemark: boolean = false;
  allSelected: boolean = false;
  isloading: boolean = true;

  iserror = false;
  errormessage = 'Select atleast one column';

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
    this.loadCurrentUserData();
    this.choose_search = "All";
    // Date range filter
    this.pipe = new DatePipe('en');
    this.getSuppliers();
    this.getCheckedItemList();
  }

  ngOnInit(): void {
    this.RemoveAllFilters();
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
    this.Position = false;
    this.ContactEmail = false;
    this.ContactPhone = false;
    this.ContactName = false;
    this.Status = false;
    this.EstablishmentYear = false;
    this.CreatedDate = false;
    this.RegNo = false;
    this.IFSsupplierCode = false;
    this.PushSupplierStatus = false;
    this.Role = false;
    this.CreatorName = false;
    this.CreatorEmail = false;
    this.SrmRemark = false;

    for (var i = 0; i < this.selectedList.length; i++) {
      if (this.selectedList[i].val == "ifsStatus") {
        this.Status = true
      }
      if (this.selectedList[i].val == "position") {
        this.Position = true
      }
      if (this.selectedList[i].val == "contactemail") {
        this.ContactEmail = true
      }
      if (this.selectedList[i].val == "contactPhone") {
        this.ContactPhone = true
      }
      if (this.selectedList[i].val == "contactname") {
        this.ContactName = true
      }
      if (this.selectedList[i].val == "yearOfEstablishement") {
        this.EstablishmentYear = true
      }
      if (this.selectedList[i].val == "createdDate") {
        this.CreatedDate = true
      }
      if (this.selectedList[i].val == "ifsSupplierCode") {
        this.IFSsupplierCode = true
      }
      if (this.selectedList[i].val == "pushSupplierStatus") {
        this.PushSupplierStatus = true
      }
      if (this.selectedList[i].val == "role") {
        this.Role = true
      }
      if (this.selectedList[i].val == "buyerName") {
        this.CreatorName = true
      }
      if (this.selectedList[i].val == "buyerEmail") {
        this.CreatorEmail = true
      }
      if (this.selectedList[i].val == "srmRemark") {
        this.SrmRemark = true
      }
      if (this.selectedList[i].val == "registrationNumber") {
        this.RegNo = true
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

          for (var i = 0; i < this.dataSource.filteredData.length; i++) {
            this.DataToExport.push({
              Id: i + 1,
              SupplierCode: this.dataSource.data[i].supplierId,
              SupplierName: this.dataSource.data[i].name,
              Status: this.dataSource.data[i].ifsStatus,
              Position: this.dataSource.data[i].position,
              ContactEmail: this.dataSource.data[i].contactemail,
              ContactPhone: this.dataSource.data[i].contactPhone,
              ContactName: this.dataSource.data[i].contactName,
              EstablishmentYear: this.dataSource.data[i].yearOfEstablishement ? this.dataSource.data[i].yearOfEstablishement : '',
              CreatedDate: moment(new Date(this.dataSource.data[i].createdDate)).format('YYYY-MM-DD HH:mm'),
              RegNo: this.dataSource.data[i].registrationNumber,
              IFSsupplierCode: this.dataSource.data[i].ifsSupplierCode,
              PushSupplierStatus: this.dataSource.data[i].pushSupplierStatus,
              Role: this.dataSource.data[i].role,
              CreatorName: this.dataSource.data[i].buyerName,
              CreatorEmail: this.dataSource.data[i].buyerEmail,
              SrmRemark: this.dataSource.data[i].srmRemark
            });
            count = count + 1;
          }
        }

        if (count == this.dataSource.filteredData.length) {
          var headerresult = this.DataToExport;

          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet('All Emergency Suppliers');

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
            if (this.Position) { row.push(x.Position); }
            if (this.ContactName) { row.push(x.ContactName); }
            if (this.ContactEmail) { row.push(x.ContactEmail); }
            if (this.ContactPhone) { row.push(x.ContactPhone); }
            if (this.Status) { row.push(x.Status); }
            if (this.RegNo) { row.push(x.RegNo); }
            if (this.CreatedDate) { row.push(x.CreatedDate); }
            if (this.EstablishmentYear) { row.push(x.EstablishmentYear); }
            if (this.IFSsupplierCode) { row.push(x.IFSsupplierCode); }
            if (this.PushSupplierStatus) { row.push(x.PushSupplierStatus); }
            if (this.Role) { row.push(x.Role); }
            if (this.CreatorName) { row.push(x.CreatorName); }
            if (this.CreatorEmail) { row.push(x.CreatorEmail); }
            if (this.SrmRemark) { row.push(x.SrmRemark); }

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
            fs.saveAs(blob, 'AllEmergencySuppliersDetails.xlsx');
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

  // Reset Table
  ResetTable() {
    this.dataSource.data = this.tempData;
    this.supplierId = '';
    this.name = '';
    this.position = '';
    this.supplierEmail = '';
    this.contactPersonName = '';
    this.supplierPhone = '';
    this.ifsStatus = '';
    this.registrationNumber = '';
    this.createddatefrom = '';
    this.createddateto = '';
    this.establishmentyearfrom = '';
    this.establishmentyearto = '';
    this.ifsSupplierCode = '';
    this.pushSupplierStatus = '';
    this.role = '';
    this.buyerName = '';
    this.buyerEmail = '';
    this.srmRemark = '';

    this.maxDate = null;
    this.minDate = null;

    localStorage.removeItem("allfilter-e");
  }

  // Get All Emergency Suppliers
  async getSuppliers() {
    this.http.get(environment.nodeurl + '/api/supplier/emergencyforRole?role=' + this.currentUserRole).subscribe(data => {
      if (data) {
        this.filltabledata(data);
      }
    });
  }

  // Load current user datas from localstorage
  public loadCurrentUserData() {
    this.currentUserName = localStorage.getItem("username");
    this.currentUserRole = localStorage.getItem("userrole");
    this.currentUserEmail = localStorage.getItem("useremail");
  }

  // Set to data to table
  filltabledata(data: any) {
    this.dataSource.data = [];
    if (data) {
      data.forEach(element => {
        this.dataSource.data.push(
          {
            position: element.position,
            supplierId: element.emergency_supplier_code,
            ifsSupplierCode: element.ifs_code,
            name: element.emergency_supplier_name,
            ifsStatus: element.status,
            registrationNumber: element.cr_no,
            createdDate: element.create_date_time,
            yearOfEstablishement: element.establishment_year,
            pushSupplierStatus: element.ifs_pushed_status,
            role: element.invite_by_role,
            buyerName: element.invite_by,
            buyerEmail: element.invite_by_email,
            contactemail: element.email,
            contactPhone: element.telephone_no,
            contactName: element.first_name,
            srmRemark: element.srm_remark
          }
        )
      });

      this.tempData = this.dataSource.data;
      this.table.renderRows();
      this.dataSource.paginator = this.tableOnePaginator;

      this.checkSearchForBackButton = localStorage.getItem('allfilter-e');
      if (this.checkSearchForBackButton != null && this.checkSearchForBackButton != '') {
        this.filterValues = JSON.parse(localStorage.getItem('allfilter-e'));
        this.loadCustomSearch();
        this.filterChange('', '');
      }
      this.isloading = false;
    }
  }

  // Apply Filter to the table
  applyTableFilter(filterValue) {
    if (filterValue == '') {
      this.dataSource.data = this.tempData;
    }
    
    else {
      var type = this.choose_search;
      this.dataSource.data = this.tempData;

      if (type == "All") {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      }
      else if (type == "Supplier Code") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.supplierId.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Supplier Name") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.name.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Position") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.position.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Contact Email") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.contactemail.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Contact Phone") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.contactPhone.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Contact Person Name") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.contactName.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Status") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.ifsStatus.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "CR/Registration #") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.registrationNumber.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Year of Establishment") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.yearOfEstablishement.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "IFS Supplier Code") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.ifsSupplierCode.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Push Supplier Status") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.pushSupplierStatus.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Role") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.role.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Creator Name") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.buyerName.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Creator Email") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.buyerEmail.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "SRM Remark") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.srmRemark.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
    }
    this.isloading= false;
  }

  // Navigate to each suppliers data
  route(supplierID) {
    var code = supplierID.split("-")[2];
    this.router.navigate(['items/emergency-supplier/i/', code]);
  }

  // column filter
  filterChange(filter, event) {
    var value = '';
    if (filter == "createddatefrom" || filter == "createddateto") {
      if (event.value != null) { value = moment(event.value).format('YYYY-MM-DD'); }
    }
    else {
      if (event != '') { value = event.target.value.trim().toLowerCase(); }
    }

    if (filter != '' && event != '') {
      this.filterValues[filter] = value;
      localStorage.setItem('allfilter-e', JSON.stringify(this.filterValues));
    }
    else {
      var count = 0;
      if (count == 0) {
        this.filterValuesBackButton = this.filterValues;
        for (const key in this.filterValuesBackButton) {
          if (this.filterValuesBackButton[key] === '') {
            delete this.filterValuesBackButton[key]
          }
          count = count + 1;
        }
      }
      if (count != 0) {
        this.filterValues = this.filterValuesBackButton
      }
    }

    this.dataSource.data = this.tempData;
    
    for (let key in this.filterValues) {
      let value = this.filterValues[key];
      var type = key;

      const temp = this.dataSource.data.filter(function (d) {
        var result;
        if ((type != "createddatefrom" && type != "createddateto") && (type != "establishmentyearfrom" && type != "establishmentyearto")) {
          if (type == "ifsStatus") {
            result = d.ifsStatus.toString();
            return result.toLowerCase().indexOf(value) == 0 || !value;
          }
          else if (type == "pushSupplierStatus") {
            result = d.pushSupplierStatus.toString();
            return result.toLowerCase().indexOf(value) == 0 || !value;
          }
          else {
            if (type == "supplierId") { result = d.supplierId.toString(); }
            else if (type == "name") { result = d.name.toString(); }
            else if (type == "position") { result = d.position.toString(); }
            else if (type == "supplierEmail") { result = d.contactemail.toString(); }
            else if (type == "contactPersonName") { result = d.contactName.toString(); }
            else if (type == "supplierPhone") { result = d.contactPhone.toString(); }
            else if (type == "registrationNumber") { result = d.registrationNumber.toString(); }
            else if (type == "ifsSupplierCode") { result = d.ifsSupplierCode.toString(); }
            else if (type == "role") { result = d.role.toString(); }
            else if (type == "buyerName") { result = d.buyerName.toString(); }
            else if (type == "buyerEmail") { result = d.buyerEmail.toString(); }
            else if (type == "srmRemark") { result = d.srmRemark.toString(); }
            return result.toLowerCase().indexOf(value) == 0 || !value || result.toLowerCase().includes(value);
          }
        }
        else if (type == "createddatefrom" || type == "createddateto") {
          if (type == "createddatefrom") { return moment(d.createdDate).format('YYYY-MM-DD') >= value || !value; }
          else if (type == "createddateto") { return moment(d.createdDate).format('YYYY-MM-DD') <= value || !value; }
        }
        else if (type == "establishmentyearfrom" || type == "establishmentyearto") {
          if (type == "establishmentyearfrom") { return d.yearOfEstablishement >= value || !value; }
          else if (type == "establishmentyearto") { return d.yearOfEstablishement <= value || !value; }
        }
      });
      this.dataSource.data = temp;
    }
    this.isloading= false;
  }

  // Validate Date
  checkDate(startDateValue: any, endDateValue: any) {
    this.tempDataBeforeDateClear = this.dataSource.data;
    var from_Date = moment(new Date(startDateValue.value)).format('YYYY-MM-DD');
    var to_Date = moment(new Date(endDateValue.value)).format('YYYY-MM-DD');

    if (from_Date != null && from_Date != 'Invalid date' && (to_Date == null || to_Date == 'Invalid date')) {
      this.fromDateValue = true;
      this.toDateValue = false;
      this.filterChange("createddatefrom", from_Date);
    }
    else if (to_Date != null && to_Date != 'Invalid date' && (from_Date == null || from_Date == 'Invalid date')) {
      this.fromDateValue = false;
      this.toDateValue = true;
      this.filterChange("createddateto", to_Date);
    }
    else if (from_Date != null && from_Date != 'Invalid date' && to_Date != null && to_Date != 'Invalid date') {
      this.fromDateValue = true;
      this.toDateValue = true;
      this.filterChange("createddatefrom", from_Date);
      this.filterChange("createddateto", to_Date);
    }
    else {
      console.log('Date field(s) cannot be empty! - Date Filter failed');
    }
  }

  // Clear Date fields and reset the 
  public clearDate(): void {
    this.date = null;
    this.fromDateValue = false;
    this.toDateValue = false;
    this.dataSource.data = this.tempDataBeforeDateClear;
  }

  // Set the searched terms to the text box
  loadCustomSearch() {
    var word = JSON.parse(localStorage.getItem("allfilter-e"));
    this.supplierId = word['supplierId'];
    this.name = word['name'];
    this.position = word['position'];
    this.supplierEmail = word['supplierEmail'];
    this.supplierPhone = word['supplierPhone'];
    this.contactPersonName = word['contactPersonName']
    this.ifsStatus = word['ifsStatus'];
    this.registrationNumber = word['registrationNumber'];
    this.createddatefrom = word['createddatefrom'];
    this.createddateto = word['createddateto'];
    this.establishmentyearfrom = word['establishmentyearfrom'];
    this.establishmentyearto = word['establishmentyearto'];
    this.ifsSupplierCode = word['ifsSupplierCode'];
    this.pushSupplierStatus = word['pushSupplierStatus'];
    this.role = word['role'];
    this.buyerName = word['buyerName'];
    this.buyerEmail = word['buyerEmail'];
    this.srmRemark = word['srmRemark'];
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

  RemoveAllFilters(){
    localStorage.removeItem('reportfilter');
    localStorage.removeItem('allfilter-i');
    localStorage.removeItem('allfilter');
    localStorage.removeItem('auditfilter');
    localStorage.removeItem('allfiltertags');
    localStorage.removeItem('kpifilter');
  }

}