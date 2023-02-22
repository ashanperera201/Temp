import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserFields, UserTemplate } from 'app/main/Models/Template';
import { environment } from 'environments/environment.prod';
import { Subject } from 'rxjs';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NgxPermissionsService } from 'ngx-permissions';

export interface DashboardElement {
  supplierName: string;
  suppliercode: string;
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

const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

@Component({
  selector: 'app-normal-datatable',
  templateUrl: './normal-datatable.component.html',
  styleUrls: ['./normal-datatable.component.scss'],
  providers: [DatePipe]
})
export class NormalDatatableComponent implements OnInit {
  @Input() messagelist: any[];
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  employees: any[];
  selectedValue: string = 'all';

  dataSource = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
  tempData: DashboardElement[] = [];
  useremail = '';
  issuccess = false;
  iserror = false;
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully saved';
  isloading: boolean = true;
  allSelected: boolean = false;
  filterName: string;

  ColumnList = [
    { name: 'Supplier Code', completed: 0, val: 'suppliercode', width: '150px' },
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

  ]

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
  ]

  columnsToDisplay: string[] = this.ColumnList.map(c => c.val);
  columnsToDisplayDesc: string[] = this.ColumnList.map(c => c.name);

  dataSourceDashboardList: any = [];

  constructor(private router: Router, private http: HttpClient, private datePipe: DatePipe) {
    if (localStorage.getItem('userrole') == 'IMI-Treasury Bank Reviewer') {
      this.ColumnList.splice(5, 0, { name: 'Returned by TBA', completed: 5, val: 'returned', width: '100px' });
      this.FilterdisplayedColumns.splice(4, 0, { name: 'Returned by TBA', selected: false });
      this.columnsToDisplay = this.ColumnList.map(c => c.val);
      this.columnsToDisplayDesc = this.ColumnList.map(c => c.name);
    }

    this.getUserSelectedFields();
  }

  ngOnInit(): void {
  }

  filltabledata(data: any) {
    this.isloading = true;
    if (data) {
      if(localStorage.getItem('dashboardpendingfilter')!=''){
        this.filterName = localStorage.getItem('dashboardpendingfilter');
        this.selectedValue = localStorage.getItem('dashboardpendingfiltersel')? localStorage.getItem('dashboardpendingfiltersel'):'all';
        
      }else{
        this.filterName = '';
        this.selectedValue = 'all';
      }

      this.dataSourceDashboardList = [];
      data.forEach(element => {
        if (element.supplier_status != 'Awaiting Clarification from Supplier') {

          var regformatdate: any = element.reg_date ? this.datePipe.transform(element.reg_date, "yyyy-MM-dd") : '';
          var reg_date;
          var gosiformatdate: any = element.gosi_date ? this.datePipe.transform(element.gosi_date, "yyyy-MM-dd") : '';
          var gosi_date;
          var saudiformatdate: any = element.saudi_date ? this.datePipe.transform(element.saudi_date, "yyyy-MM-dd") : '';
          var saudi_date;
          var zakathformatdate: any = element.zakath_date ? this.datePipe.transform(element.zakath_date, "yyyy-MM-dd") : '';
          var zakath_date;

          // CR date
          if (Number(regformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "Y") {
            reg_date = new NgbDate(Number(regformatdate.split("-")[0]) - 1, 12, Number(regformatdate.split("-")[2]) - 1);
            reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
          }
          if (Number(regformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "N") {
            reg_date = new NgbDate(Number(regformatdate.split("-")[0]) - 1, 12, Number(regformatdate.split("-")[2]));
            reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
          }
          if (Number(regformatdate.split("-")[1]) - 1 != 0) {
            if (element.country == "SAUDI ARABIA" && element.hijri_selected == "N") {
              reg_date = new NgbDate(Number(regformatdate.split("-")[0]), Number(regformatdate.split("-")[1]) - 1, Number(regformatdate.split("-")[2]));
              reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
            }
            else if (element.country == "SAUDI ARABIA" && element.hijri_selected == "Y") {
              reg_date = new NgbDate(Number(regformatdate.split("-")[0]), Number(regformatdate.split("-")[1]) - 1, Number(regformatdate.split("-")[2]) - 1);
              reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
            }
            else { reg_date = ''; }
          }

          // Gosi Date
          if (Number(gosiformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "Y") {
            gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]) - 1, 12, Number(gosiformatdate.split("-")[2]) - 1);
            gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
          }
          if (Number(gosiformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "N") {
            gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]) - 1, 12, Number(gosiformatdate.split("-")[2]));
            gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
          }
          if (Number(gosiformatdate.split("-")[1]) - 1 != 0) {
            if (element.country == "SAUDI ARABIA" && element.hijri_selected == "N") {
              gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]), Number(gosiformatdate.split("-")[1]) - 1, Number(gosiformatdate.split("-")[2]));
              gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
            }
            else if (element.country == "SAUDI ARABIA" && element.hijri_selected == "Y") {
              gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]), Number(gosiformatdate.split("-")[1]) - 1, Number(gosiformatdate.split("-")[2]) - 1);
              gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
            }
            else { gosi_date = ''; }
          }

          // Saudi Date
          if (Number(saudiformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "Y") {
            saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]) - 1, 12, Number(saudiformatdate.split("-")[2]) - 1);
            saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
          }
          if (Number(saudiformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "N") {
            saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]) - 1, 12, Number(saudiformatdate.split("-")[2]));
            saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
          }
          if (Number(saudiformatdate.split("-")[1]) - 1 != 0) {
            if (element.country == "SAUDI ARABIA" && element.hijri_selected == "N") {
              saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]), Number(saudiformatdate.split("-")[1]) - 1, Number(saudiformatdate.split("-")[2]));
              saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
            }
            else if (element.country == "SAUDI ARABIA" && element.hijri_selected == "Y") {
              saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]), Number(saudiformatdate.split("-")[1]) - 1, Number(saudiformatdate.split("-")[2]) - 1);
              saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
            }
            else { saudi_date = ''; }
          }

          // Zakath Date
          if (Number(zakathformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "Y") {
            zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]) - 1, 12, Number(zakathformatdate.split("-")[2]) - 1);
            zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
          }
          if (Number(zakathformatdate.split("-")[1]) - 1 == 0 && element.hijri_selected == "N") {
            zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]) - 1, 12, Number(zakathformatdate.split("-")[2]));
            zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
          }
          if (Number(zakathformatdate.split("-")[1]) - 1 != 0) {
            if (element.country == "SAUDI ARABIA" && element.hijri_selected == "N") {
              zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]), Number(zakathformatdate.split("-")[1]) - 1, Number(zakathformatdate.split("-")[2]));
              zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
            }
            else if (element.country == "SAUDI ARABIA" && element.hijri_selected == "Y") {
              zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]), Number(zakathformatdate.split("-")[1]) - 1, Number(zakathformatdate.split("-")[2]) - 1);
              zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
            }
            else { zakath_date = ''; }
          }

          this.dataSourceDashboardList.push(
            {
              position: element.supplier_id,
              supplierName: element.supplier_name,
              suppliercode: element.supplier_code,
              status: element.supplier_status,
              // currentPosition: element.position,
              createdDate: this.datePipe.transform(element.created_date, 'dd-MMM-yyyy, HH:mm'),
              score: element.due_date,
              email: element.email,
              country: element.country.trim().toUpperCase(),
              city: element.city,
              cr_no: element.cr_no,
              cr_exp_date: this.datePipe.transform(element.cr_exp_date, 'dd-MMM-yyyy'),
              vat_no: element.vat_no,
              establishment_year: element.establishment_year,
              extension: element.extension,
              title: element.title,
              first_name: element.first_name,
              last_name: element.last_name,
              mobile_no: element.mobile_no,
              mobile_country_code: element.mobile_country_code,
              telephone_no: element.telephone_no,
              fax_no: element.fax_no,
              fax_country_code: element.fax_country_code,
              postal_code: element.postal_code,
              po_box: element.po_box,
              gosi_date: element.gosi_date == '1900-01-01 12:00:00 AM' ? '' : gosi_date,
              ibanNo: element.iban_no,
              ifs_code: element.ifs_code,
              reg_date: element.reg_date == '1900-01-01 12:00:00 AM' ? '' : reg_date,
              zakath_date: element.zakath_date == '1900-01-01 12:00:00 AM' ? '' : zakath_date,
              saudi_date: element.saudi_date == '1900-01-01 12:00:00 AM' ? '' : saudi_date,
              web_site: element.website,
              additionalScope: element.additional_material,
              pushSupplierStatus: element.pushed_supplier_status,
              role: element.role,
              buyerName: element.buyer_name,
              // supplierRegKey: '-',
              buyerEmail: element.buyer_email,
              type: element.type,
              criticality: element.criticality == 'Normal' ? 'Non Critical' : element.criticality,
              criticalityColor: element.criticality.toLowerCase().replace(/ /g, ""),
              returned: element.returned
            }
          )
        }
      });

      this.dataSource = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
      this.dataSource.paginator = this.tableOnePaginator;
      this.tempData = this.dataSource.data;

      if(localStorage.getItem('dashboardpendingfilter')!=''){
        this.applyFilter(localStorage.getItem('dashboardpendingfilter'));
      }
    }
    this.isloading = false;
  }

  selectchange(){
    this.applyFilter(localStorage.getItem('dashboardpendingfilter')?localStorage.getItem('dashboardpendingfilter'):'');
  }

  applyFilter(value) {
    const filterValue = value?value.trim().toLowerCase():'';

    localStorage.setItem('dashboardpendingfilter',value?value.trim():'');
    localStorage.setItem('dashboardpendingfiltersel',this.selectedValue);

    if (this.selectedValue == 'all') {
      this.dataSource.data = this.tempData;
      this.dataSource.filter = filterValue.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.dataSource.data = this.tempData;
      var type = this.selectedValue;

      const temp = this.dataSource.data.filter(function (d) {
        var result;
        if (type != "Criticality") {
          if (type == "Position") { result = d.position.toString(); }
          else if (type == "Supplier Name") { result = d.supplierName.toString(); }
          else if (type == "Supplier Code") { result = d.suppliercode.toString(); }
          else if (type == "Type") { result = d.type.toString(); }
          else if (type == "Status") { result = d.status.toString(); }
          else if (type == "Created Date") { result = d.createdDate.toString(); }
          else if (type == "Email") { result = d.email.toString(); }
          else if (type == "Country") { result = d.country.toString(); }
          else if (type == "Criticality") { result = d.criticality.toString(); }
          else if (type == "City") { result = d.city.toString(); }
          else if (type == "Cr No") { result = d.cr_no.toString(); }
          else if (type == "Cr Exp Date") { result = d.cr_exp_date.toString(); }
          else if (type == "Vat No") { result = d.vat_no.toString(); }
          else if (type == "Establishment Year") { result = d.establishment_year.toString(); }
          else if (type == "Extension") { result = d.extension.toString(); }
          else if (type == "Title") { result = d.title.toString(); }
          else if (type == "First Name") { result = d.first_name.toString(); }
          else if (type == "Last Name") { result = d.last_name.toString(); }
          else if (type == "Mobile No") { result = d.mobile_no.toString(); }
          else if (type == "Mobile Country Code") { result = d.mobile_country_code.toString(); }
          else if (type == "Telephone No") { result = d.telephone_no.toString(); }
          else if (type == "Fax No") { result = d.fax_no.toString(); }
          else if (type == "Fax Country Code") { result = d.fax_country_code.toString(); }
          else if (type == "Postal Code") { result = d.postal_code.toString(); }
          else if (type == "Po Box") { result = d.po_box.toString(); }
          else if (type == "GOSI Date") { result = d.gosi_date.toString(); }
          else if (type == "Iban No") { result = d.ibanNo.toString(); }
          else if (type == "Ifs Code") { result = d.ifs_code.toString(); }
          else if (type == "Aadditional Scope") { result = d.additionalScope.toString(); }
          else if (type == "Reg Date") { result = d.reg_date.toString(); }
          else if (type == "Zakat Date") { result = d.zakath_date.toString(); }
          else if (type == "Saudization Date") { result = d.saudi_date.toString(); }
          else if (type == "Website") { result = d.web_site.toString(); }
          else if (type == "Push Supplier Status") { result = d.pushSupplierStatus.toString(); }
          else if (type == "Creator Name") { result = d.buyerName.toString(); }
          else if (type == "Creator Email") { result = d.buyerEmail.toString(); }
          else if (type == "Returned by TBA") { result = d.returned.toString(); }
          return result.toLowerCase().indexOf(filterValue) == 0 || !filterValue || result.toLowerCase().includes(filterValue);
        } else {
          if (type == "Criticality") { result = d.criticality.toString(); }
          return result.toLowerCase().indexOf(filterValue) == 0 || !filterValue;
        }
      });
      this.dataSource.data = temp;
    }
    this.isloading = false;
  }

  openRowInfo(position) {
    localStorage.setItem('dashboardclick','pending');
    this.router.navigate(['/dashboard/inner/d/' + position]);
  }

  addRemoveField(item, event) {
    var selitem = this.ColumnList.filter(a => a.name == item).map(c => c.val)[0];

    if (selitem) {
      if (!event.checked) {
        var index = this.ColumnList.filter(x => x.val == selitem)[0].completed;
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

  async getUserSelectedFields() {
    this.useremail = localStorage.getItem("useremail");

    this.http.get(environment.nodeurl + '/api/template/userDatatableFields?email=' + this.useremail)
      .subscribe(data => {
        if (data) {
          var selected: any = data;
          if (selected.filter(x => x.section == 'Pending Task').length > 0) {
            var usersavedcolumns: string[] = selected.filter(x => x.section == 'Pending Task')[0].selectedColumns;

            var tempColumnList: string[] = [];
            tempColumnList.push('suppliercode', 'supplierName');
            var templist = this.ColumnList;

            usersavedcolumns.forEach(element => {
              var objIndex = this.FilterdisplayedColumns.findIndex((obj => obj.name == element));
              if (objIndex != -1) {
                this.FilterdisplayedColumns[objIndex].selected = true;

                tempColumnList.push(templist.filter(x => x.name == element)[0].val);
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

  async saveFields() {
    var templatedto = new UserFields();
    templatedto.section = 'Pending Task';
    templatedto.selectedColumns = this.columnsToDisplayDesc;

    this.http.post<any>(environment.nodeurl + '/api/template/SaveUserField?email=' + this.useremail, templatedto).subscribe(data2 => {
      if (data2) {
        this.issuccess = true;
      } else {
        this.iserror = true;
      }
      setTimeout(function () {
        this.issuccess = false;
        this.iserror = false;
      }.bind(this), 2000);
    });
  }

  toggleAllSelection() {
    var selected = this.allSelected;
    for (var i = 0; i < this.FilterdisplayedColumns.length; i++) {
      this.FilterdisplayedColumns[i].selected = selected;
    }
    if (this.allSelected) {
      this.columnsToDisplay = this.ColumnList.map(c => c.val);
      this.columnsToDisplayDesc = this.ColumnList.map(c => c.name);
    } else {
      this.columnsToDisplay = ['suppliercode', 'supplierName'];
      this.columnsToDisplayDesc = ['Supplier Code', 'Supplier Name'];
    }
  }

}
