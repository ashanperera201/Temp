/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-for-of */
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Workbook } from 'exceljs';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as fs from 'file-saver';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { UserFields } from 'app/main/Models/Template';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

export interface Supplier {
  supplierName: string;
  supplierID: string;
  position: number;
  status: string;
  createdDate: string;
  score: number;
  email: string;
  country: string;
  city: string;
  cr_no: string;
  cr_exp_date: string;
  vat_no: string;
  establishment_year: number;
  extension: number;
  title: string;
  first_name: string;
  last_name: string;
  mobile_no: string;
  mobile_country_code: string;
  telephone_no: string;
  fax_no: string;
  fax_country_code: string;
  postal_code: string;
  po_box: string;
  gosi_date: string;
  ibanNo: string;
  ifs_code: string;
  reg_date: string;
  zakath_date: string;
  saudi_date: string;
  web_site: string;
  additionalScope: string;
  pushSupplierStatus: string;
  role: string;
  buyerName: string;
  buyerEmail: string;
  type: string;
  criticality: string;
  criticalityColor: string;
  returned: string;
}
const ELEMENT_DATA_CATEGORIES_NEW: Supplier[] = [];

@Component({
  selector: 'suppliers-list',
  templateUrl: './suppliers-list.component.html',
  encapsulation: ViewEncapsulation.None,
})

export class SupplierListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ColumnList = [
    { name: 'Supplier Code', completed: 0, val: 'supplierID', width: '150px' },
    { name: 'Supplier Name', completed: 1, val: 'supplierName', width: '175px' },
    { name: 'Type', completed: 2, val: 'type', width: '150px' },
    { name: 'Status', completed: 3, val: 'status', width: '245px' },
    { name: 'Criticality', completed: 4, val: 'criticality', width: '100px' },
    { name: 'Created Date', completed: 5, val: 'createdDate', width: '175px' },
    { name: 'Email', completed: 6, val: 'email', width: '100px' },
    { name: 'Country', completed: 7, val: 'country', width: '100px' },
    { name: 'City', completed: 8, val: 'city', width: '100px' },
    { name: 'Cr No', completed: 9, val: 'cr_no', width: '100px' },
    { name: 'Cr Exp Date', completed: 10, val: 'cr_exp_date', width: '175px' },
    { name: 'Vat No', completed: 11, val: 'vat_no', width: '100px' },
    { name: 'Establishment Year', completed: 12, val: 'establishment_year', width: '100px' },
    { name: 'Extension', completed: 13, val: 'extension', width: '100px' },
    { name: 'Title', completed: 14, val: 'title', width: '100px' },
    { name: 'First Name', completed: 15, val: 'first_name', width: '100px' },
    { name: 'Last Name', completed: 16, val: 'last_name', width: '100px' },
    { name: 'Mobile No', completed: 17, val: 'mobile_no', width: '100px' },
    { name: 'Mobile Country Code', completed: 18, val: 'mobile_country_code', width: '150px' },
    { name: 'Telephone No', completed: 19, val: 'telephone_no', width: '100px' },
    { name: 'Fax No', completed: 20, val: 'fax_no', width: '100px' },
    { name: 'Fax Country Code', completed: 21, val: 'fax_country_code', width: '150px' },
    { name: 'Postal Code', completed: 22, val: 'postal_code', width: '100px' },
    { name: 'Po Box', completed: 23, val: 'po_box', width: '100px' },
    { name: 'GOSI Date', completed: 24, val: 'gosi_date', width: '150px' },
    { name: 'Iban No', completed: 25, val: 'ibanNo', width: '100px' },
    { name: 'Ifs Code', completed: 26, val: 'ifs_code', width: '100px' },
    { name: 'Additional Scope', completed: 27, val: 'additionalScope', width: '100px' },
    { name: 'Reg Date', completed: 28, val: 'reg_date', width: '150px' },
    { name: 'Zakat Date', completed: 29, val: 'zakath_date', width: '150px' },
    { name: 'Saudization Date', completed: 30, val: 'saudi_date', width: '150px' },
    { name: 'Website', completed: 31, val: 'web_site', width: '100px' },
    { name: 'Push Supplier Status', completed: 32, val: 'pushSupplierStatus', width: '150px' },
    { name: 'Role', completed: 33, val: 'role', width: '100px' },
    { name: 'Creator Name', completed: 34, val: 'buyerName', width: '120px' },
    { name: 'Creator Email', completed: 35, val: 'buyerEmail', width: '100px' },

  ];

  FilterdisplayedColumns = [
    { name: 'Type', selected: false },
    { name: 'Status', selected: false },
    { name: 'Criticality', selected: false },
    { name: 'Created Date', selected: false },
    { name: 'Email', selected: false },
    { name: 'Country', selected: false },
    { name: 'City', selected: false },
    { name: 'Cr No', selected: false },
    { name: 'Cr Exp Date', selected: false },
    { name: 'Vat No', selected: false },
    { name: 'Establishment Year', selected: false },
    { name: 'Extension', selected: false },
    { name: 'Title', selected: false },
    { name: 'First Name', selected: false },
    { name: 'Last Name', selected: false },
    { name: 'Mobile No', selected: false },
    { name: 'Mobile Country Code', selected: false },
    { name: 'Telephone No', selected: false },
    { name: 'Fax No', selected: false },
    { name: 'Fax Country Code', selected: false },
    { name: 'Postal Code', selected: false },
    { name: 'Po Box', selected: false },
    { name: 'GOSI Date', selected: false },
    { name: 'Iban No', selected: false },
    { name: 'Ifs Code', selected: false },
    { name: 'Additional Scope', selected: false },
    { name: 'Reg Date', selected: false },
    { name: 'Zakat Date', selected: false },
    { name: 'Saudization Date', selected: false },
    { name: 'Website', selected: false },
    { name: 'Push Supplier Status', selected: false },
    { name: 'Role', selected: false },
    { name: 'Creator Name', selected: false },
    { name: 'Creator Email', selected: false }
  ];

  dataSource = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
  tempData: Supplier[] = [];
  useremail = '';
  issuccess = false;
  iserror = false;
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully saved';
  isloading: boolean = true;
  allSelected: boolean = false;

  columnsToDisplay: string[] = this.ColumnList.map(c => c.val);
  columnsToDisplayDesc: string[] = this.ColumnList.map(c => c.name);

  displayedColumns: string[] = ['supplierID', 'supplierName', 'email', 'country', 'city'];
  //dataSource: MatTableDataSource<Supplier>;

  constructor(private router: Router, public dialog: MatDialog, private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get(environment.nodeurl + '/api/supplier/allapprovedsupplier')
      .subscribe((data: Supplier[]) => {
        if (data) {
          this.dataSource = new MatTableDataSource<Supplier>(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
  }

  addRemoveField(item, event): void {
    const selitem = this.ColumnList.filter(a => a.name === item).map(c => c.val)[0];

    if (selitem) {
      if (!event.checked) {
        const index = this.ColumnList.filter(x => x.val === selitem)[0].completed;
        this.columnsToDisplay.splice(index, 0, selitem);
        this.columnsToDisplayDesc.splice(index, 0, item);
        // this.columnsToDisplay.push(selitem);
        // this.columnsToDisplayDesc.push(item);
      } else {
        this.columnsToDisplay = this.columnsToDisplay.filter(a => a !== selitem);
        this.columnsToDisplayDesc = this.columnsToDisplayDesc.filter(a => a !== item);
      }
    }
  }

  async getUserSelectedFields(): Promise<void> {
    this.useremail = localStorage.getItem('useremail');

    this.http.get(environment.nodeurl + '/api/template/userDatatableFields?email=' + this.useremail)
      .subscribe((data) => {
        if (data) {
          const selected: any = data;
          if (selected.filter(x => x.section === 'Pending Task').length > 0) {
            const usersavedcolumns: string[] = selected.filter(x => x.section === 'Pending Task')[0].selectedColumns;

            const tempColumnList: string[] = [];
            tempColumnList.push('supplierID', 'supplierName', 'email', 'country', 'city');
            const templist = this.ColumnList;

            usersavedcolumns.forEach((element) => {
              const objIndex = this.FilterdisplayedColumns.findIndex((obj => obj.name === element));
              if (objIndex !== -1) {
                this.FilterdisplayedColumns[objIndex].selected = true;

                tempColumnList.push(templist.filter(x => x.name === element)[0].val);
              }
            });

            this.columnsToDisplay = this.columnsToDisplay.filter(x => tempColumnList.includes(x));
            this.columnsToDisplayDesc = this.columnsToDisplayDesc.filter(x => usersavedcolumns.includes(x));
          }
          else {
            for (let index = 0; index < this.FilterdisplayedColumns.length; index++) {
              this.FilterdisplayedColumns[index].selected = true;
            }
          }
        }
      });
  }

  async saveFields(): Promise<void> {
    const templatedto = new UserFields();
    templatedto.section = 'Pending Task';
    templatedto.selectedColumns = this.columnsToDisplayDesc;

    this.http.post<any>(environment.nodeurl + '/api/template/SaveUserField?email=' + this.useremail, templatedto).subscribe((data2) => {
      if (data2) {
        this.issuccess = true;
      } else {
        this.iserror = true;
      }
      setTimeout(function() {
        this.issuccess = false;
        this.iserror = false;
      }.bind(this), 2000);
    });
  }

  toggleAllSelection() {
    const selected = this.allSelected;
    for (let i = 0; i < this.FilterdisplayedColumns.length; i++) {
      this.FilterdisplayedColumns[i].selected = selected;
    }
    if (this.allSelected) {
      this.columnsToDisplay = this.ColumnList.map(c => c.val);
      this.columnsToDisplayDesc = this.ColumnList.map(c => c.name);
    } else {
      this.columnsToDisplay = ['supplierID', 'supplierName', 'email', 'country', 'city'];
      this.columnsToDisplayDesc = ['Supplier Code', 'Supplier Name'];
    }
  }

  goToApprovalPage(supplierId) {
    this.router.navigate(['/dashboard/inner/d/' + supplierId]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
