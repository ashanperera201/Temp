import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { identity } from 'lodash';
import moment from 'moment';

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
  selector: 'dash-item-tag-datatable',
  templateUrl: './dashboard-tags-datatable.component.html',
  styleUrls: ['./dashboard-tags-datatable.component.scss'],
  providers: [DatePipe]
})
export class DashboardTagsDatatableComponent implements OnInit {
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @Input() itemNo: any;

  dataSourceDashboard = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
  tempData: DashboardElement[];

  currentReqPage = '';

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
  isloading: boolean = true;

  minDate = null;
  maxDate = null;

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
  }


  ngOnInit(): void {
    var loggedInRole = localStorage.getItem('userrole');

    var templateId = this.itemNo;

    if (templateId > 0) {
      this.http.get<any>(environment.nodeurl + '/api/template/querydata?templateId=' + templateId + '&role=' + loggedInRole + '&type=N').subscribe(data => {
        var messagelist = data;
        this.filltabledata(messagelist, '');
      });
    }

    this.filterValues = JSON.parse(localStorage.getItem('allfiltertags'));
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
          }
        )
      });

      this.dataSourceDashboard = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);
      this.tempData = this.dataSourceDashboardList;
      this.dataSourceDashboard.paginator = this.tableOnePaginator;

      this.setFilterText();
      this.filterChange('', '');
    }
    this.isloading = false;
  }

  filterChange(filter, event) {
    var value = '';
    if (filter == "createddatefrom" || filter == "createddateto") {
      value = this.datePipe.transform(event, 'yyyy-MM-dd');
    } else {
      value = event ? event.target.value.trim().toLowerCase() : '';
    }

    if (filter != '') {
      this.filterValues[filter] = value;
    }

    localStorage.setItem('allfiltertags', JSON.stringify(this.filterValues));

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
      this.isloading = false;
    }

  }

  openRowInfo(position) {
    var id = position.split('-')[2];
    this.router.navigate(['/dashboard/inner/d/' + id]);
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

    this.minDate = null;
    this.maxDate = null;
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
}
