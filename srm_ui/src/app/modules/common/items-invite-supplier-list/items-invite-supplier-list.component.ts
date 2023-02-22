import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { environment } from 'environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

export interface InviteElement {
  position: number;
  supplierId: string;
  ifsSupplierCode: string;
  name: string;
  ifsStatus: string;
  createdDate: string;
  pushSupplierStatus: string;
  role: string;
  buyerName: string;
  buyerEmail: string;
  title: string,
  first_name: string,
  last_name: string,
  email: string,
  justification: string,
  create_date_time: string;
  invite_by: string;
  invite_by_email: string;
  invite_by_role: string;
  re_invite_date_time: string;
  re_invite_by: string;
  re_invite_by_email: string;
  re_invite_by_role: string;
  invite_status: string;
}

const ELEMENT_INVITE: InviteElement[] = [];

@Component({
  selector: 'app-items-invite-supplier-list',
  templateUrl: './items-invite-supplier-list.component.html',
  styleUrls: ['./items-invite-supplier-list.component.scss'],
  providers: [DatePipe]
})
export class ItemsInviteSupplierListComponent implements OnInit {

  @Input() messagelist: any[];
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @ViewChild('select') select: MatSelect;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;

  dataSource = new MatTableDataSource(ELEMENT_INVITE);
  displayedColumns: string[] = ['position', 'supplierId', /*ifsSupplierCode, */ 'name', 'ifsStatus', /*'registration Number'  , 'SRMRemarkAfterVPRejection',*/ 'createdDate',
  /*'additionalScope',  'yearOfEstablishement', */  'ifsSupplierCode', 'pushSupplierStatus', 'role', 'buyerName', /* 'supplierRegKey', */ 'buyerEmail','invite_status'];

  custom_search = [
    { value: true, viewValue: 'All' },
    { value: true, viewValue: 'Supplier Code' },
    { value: true, viewValue: 'Supplier Name' },
    { value: true, viewValue: 'Role' },
    { value: true, viewValue: 'Creator Name' },
    { value: true, viewValue: 'Creator Email' },
    { value: true, viewValue: 'Registration Status' }
  ];

  choose_search: any;
  tempData: InviteElement[];
  tempDataBeforeDateClear: InviteElement[];
  filterValues = {};
  filterValuesBackButton = {};

  supplierId = '';
  ifsSupplierCode = '';
  name = '';
  ifsStatus = '';
  pushSupplierStatus = '';
  role = '';
  buyerName = '';
  buyerEmail = '';
  createddatefrom = '';
  createddateto = '';
  invite_status = '';

  pipe: DatePipe;
  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  fromDateValue: boolean = false;
  toDateValue: boolean = false;
  DateValue: any;

  get fromDate() { return this.range.get('start').value; }
  get toDate() { return this.range.get('end').value; }

  public date: any;
  checkSearchForBackButton = '';

  minDate = null;
  maxDate = null;

  // Excel related columns
  ColumnList = [
    { name: 'Status', isSelected: false, val: 'ifsStatus' },
    { name: 'Created Date', isSelected: false, val: 'create_date_time' },
    { name: 'IFS Supplier Code', isSelected: false, val: 'ifsSupplierCode' },
    { name: 'Push Supplier Status', isSelected: false, val: 'pushSupplierStatus' },
    { name: 'Role', isSelected: false, val: 'invite_by_role' },
    { name: 'Creator Name', isSelected: false, val: 'invite_by' },
    { name: 'Creator Email', isSelected: false, val: 'invite_by_email' },
    { name: 'Registration Status', isSelected: false, val: 'invite_status' }

  ];

  checkedList: any;
  selectedList: any;
  DataToExport = [];

  SupplierCode: boolean = false;
  SupplierName: boolean = false;
  Status: boolean = false;
  CreatedDate: boolean = false;
  IFSsupplierCode: boolean = false;
  PushSupplierStatus: boolean = false;
  Role: boolean = false;
  CreatorName: boolean = false;
  CreatorEmail: boolean = false;
  allSelected: boolean = false;
  isloading: boolean = true;
  InviteStatus: boolean = false;

  iserror = false;
  errormessage = 'Select atleast one column';

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
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
    this.Status = false;
    this.CreatedDate = false;
    this.IFSsupplierCode = false;
    this.PushSupplierStatus = false;
    this.Role = false;
    this.CreatorName = false;
    this.CreatorEmail = false;
    this.InviteStatus = false;

    for (var i = 0; i < this.selectedList.length; i++) {
      if (this.selectedList[i].val == "ifsStatus") {
        this.Status = true
      }
      if (this.selectedList[i].val == "create_date_time") {
        this.CreatedDate = true
      }
      if (this.selectedList[i].val == "ifsSupplierCode") {
        this.IFSsupplierCode = true
      }
      if (this.selectedList[i].val == "pushSupplierStatus") {
        this.PushSupplierStatus = true
      }
      if (this.selectedList[i].val == "invite_by_role") {
        this.Role = true
      }
      if (this.selectedList[i].val == "invite_by") {
        this.CreatorName = true
      }
      if (this.selectedList[i].val == "invite_by_email") {
        this.CreatorEmail = true
      }
      if (this.selectedList[i].val == "invite_status") {
        this.InviteStatus = true
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
              CreatedDate: moment(new Date(this.dataSource.data[i].create_date_time)).format('YYYY-MM-DD HH:mm'),
              IFSsupplierCode: this.dataSource.data[i].ifsSupplierCode,
              PushSupplierStatus: this.dataSource.data[i].pushSupplierStatus,
              Role: this.dataSource.data[i].invite_by_role,
              CreatorName: this.dataSource.data[i].invite_by,
              CreatorEmail: this.dataSource.data[i].invite_by_email,
              InviteStatus: this.dataSource.data[i].invite_status
            });

            count = count + 1;
          }
        }

        if (count == this.dataSource.filteredData.length) {
          var headerresult = this.DataToExport;

          let workbook = new Workbook();
          let worksheet = workbook.addWorksheet('All Invite Suppliers');

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
            if (this.Status) { row.push(x.Status); }
            if (this.CreatedDate) { row.push(x.CreatedDate); }
            if (this.IFSsupplierCode) { row.push(x.IFSsupplierCode); }
            if (this.PushSupplierStatus) { row.push(x.PushSupplierStatus); }
            if (this.Role) { row.push(x.Role); }
            if (this.CreatorName) { row.push(x.CreatorName); }
            if (this.CreatorEmail) { row.push(x.CreatorEmail); }
            if (this.InviteStatus) {row.push(x.InviteStatus);}
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
            fs.saveAs(blob, 'AllInviteSuppliersDetails.xlsx');
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

  // Reset Table
  ResetTable() {
    this.dataSource.data = this.tempData;
    this.supplierId = '';
    this.ifsSupplierCode = '';
    this.name = '';
    this.ifsStatus = '';
    this.createddatefrom = '';
    this.createddateto = '';
    this.pushSupplierStatus = '';
    this.role = '';
    this.buyerName = '';
    this.buyerEmail = '';
    this.invite_status = '';

    this.maxDate = null;
    this.minDate = null;

    localStorage.removeItem("allfilter-i");
  }

  // Get All Invite Suppliers
  async getSuppliers() {
    this.http.get(environment.nodeurl + '/api/supplier/invite').subscribe(data => {
      if (data) {
        if (data) {
          this.filltabledata(data);
        }
      }
    });
  }

  // Set to data to table
  filltabledata(data: any) {
    this.dataSource.data = [];
    if (data) {
      data.forEach(element => {
        this.dataSource.data.push(
          {
            position: element.invite_supplier_id,
            supplierId: 'IMI-IS-' + element.invite_supplier_id,
            ifsSupplierCode: '',
            name: element.invite_supplier_name,
            ifsStatus: 'Invite Sent',
            createdDate: '-',
            pushSupplierStatus: '-',
            role: 'Admin',
            buyerName: 'Admin',
            buyerEmail: '-',
            title: element.title,
            first_name: element.first_name,
            last_name: element.last_name,
            email: element.email,
            justification: element.justification,
            invite_by: element.invite_by,
            invite_by_email: element.invite_by_email,
            invite_by_role: element.invite_by_role,
            create_date_time: element.create_date_time,
            re_invite_by: element.re_invite_by,
            re_invite_by_email: element.re_invite_by_email,
            re_invite_by_role: element.re_invite_by_role,
            re_invite_date_time: element.re_invite_date_time,
            invite_status: element.cr_no
          }
        )
      });

      this.tempData = this.dataSource.data;
      this.table.renderRows();
      this.dataSource.paginator = this.tableOnePaginator;

      // this.dataSource.filterPredicate = (data, filter) => {
      //   if (this.fromDate && this.toDate) {
      //     return data.create_date_time >= this.fromDate.toString() && data.create_date_time <= this.toDate.toString();
      //   }
      //   return true;
      // }

      this.checkSearchForBackButton = localStorage.getItem('allfilter-i');
      if (this.checkSearchForBackButton != null && this.checkSearchForBackButton != '') {
        this.filterValues = JSON.parse(localStorage.getItem('allfilter-i'));
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
      else if (type == "Role") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.invite_by_role.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else if (type == "Creator Name") {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.invite_by.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
      else {
        const value = filterValue.trim().toLowerCase();
        const temp = this.dataSource.data.filter(function (d) {
          return d.invite_by_email.toString().toLowerCase().indexOf(value) !== -1 || !value;
        });
        this.dataSource.data = temp;
      }
    }
    this.isloading = false;
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
      localStorage.setItem('allfilter-i', JSON.stringify(this.filterValues));
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
        if (type != "createddatefrom" && type != "createddateto") {
          if (type == "supplierId") { result = d.supplierId.toString(); }
          else if (type == "ifsSupplierCode") { result = d.ifsSupplierCode.toString(); }
          else if (type == "name") { result = d.name.toString(); }
          else if (type == "ifsStatus") { result = d.ifsStatus.toString(); }
          else if (type == "pushSupplierStatus") { result = d.pushSupplierStatus.toString(); }
          else if (type == "role") { result = d.invite_by_role.toString(); }
          else if (type == "buyerName") { result = d.invite_by.toString(); }
          else if (type == "buyerEmail") { result = d.invite_by_email.toString(); }
          else if (type == "invite_status") { result = d.invite_status.toString(); }
          return result.toLowerCase().indexOf(value) != -1 || !value;
        }
        else if (type == "createddatefrom" || type == "createddateto") {
          if (type == "createddatefrom") { return moment(d.create_date_time).format('YYYY-MM-DD') >= value || !value; }
          else if (type == "createddateto") { return moment(d.create_date_time).format('YYYY-MM-DD') <= value || !value; }
        }
      });
      this.dataSource.data = temp;
    }
    this.isloading= false;
  }

  // Navigate to each suppliers data
  route(supplierID) {
    var code = supplierID.split("-")[2];
    this.router.navigate(['items/invite-supplier/i/', code]);
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
    var word = JSON.parse(localStorage.getItem("allfilter-i"));
    this.supplierId = word['supplierId'];
    this.ifsSupplierCode = word['ifsSupplierCode'];
    this.name = word['name'];
    this.ifsStatus = word['ifsStatus'];
    this.pushSupplierStatus = word['pushSupplierStatus'];
    this.role = word['role'];
    this.buyerName = word['buyerName'];
    this.buyerEmail = word['buyerEmail'];
    this.createddatefrom = word['createddatefrom'];
    this.createddateto = word['createddateto'];
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
    localStorage.removeItem('allfilter');
    localStorage.removeItem('auditfilter');
    localStorage.removeItem('allfiltertags');
    localStorage.removeItem('allfilter-e');
    localStorage.removeItem('kpifilter');
  }

}