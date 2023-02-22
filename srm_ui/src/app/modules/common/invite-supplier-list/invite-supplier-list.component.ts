import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { environment } from 'environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFields } from 'app/main/Models/Template';
import { DatePipe } from '@angular/common';

export interface InviteElement {
  position: number;
  supplierCode: string;
  ifsSupplierCode: string;
  supplierName: string;
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
}

const ELEMENT_INVITE: InviteElement[] = [];

@Component({
  selector: 'app-invite-supplier-list',
  templateUrl: './invite-supplier-list.component.html',
  styleUrls: ['./invite-supplier-list.component.scss'],
  providers: [DatePipe]

})
export class InviteSupplierListComponent implements OnInit {

  @Input() messagelist: any[];
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @ViewChild('select') select: MatSelect;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  issuccess = false;
  iserror = false;
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully saved';
  selectedValue: string = 'all';
  useremail = '';
  isloading: boolean = true;
  allSelected: boolean = false;
  filterName:string;
  dataSourceDashboardList: any = [];

  dataSource = new MatTableDataSource(ELEMENT_INVITE);
  displayedColumns: string[] = ['position', 'supplierId', /*ifsSupplierCode, */ 'name', 'ifsStatus', /*'registration Number'  , 'SRMRemarkAfterVPRejection',*/ 'createdDate',
  /*'additionalScope',  'yearOfEstablishement', */  'ifsSupplierCode', 'pushSupplierStatus', 'role', 'buyerName', /* 'supplierRegKey', */ 'buyerEmail'];

  custom_search = [
    { value: true, viewValue: 'All' },
    { value: true, viewValue: 'Supplier Code' },
    { value: true, viewValue: 'Supplier Name' },
    { value: true, viewValue: 'Role' },
    { value: true, viewValue: 'Creator Name' },
    { value: true, viewValue: 'Creator Email' }
  ];

  ColumnList = [
    { name: 'Supplier Code', completed: 0, val: 'supplierCode' },
    { name: 'Supplier Name', completed: 1, val: 'supplierName' },
    { name: 'Status', completed: 2, val: 'ifsStatus' },
    { name: 'Created Date', completed: 3, val: 'createdDate' },
    { name: 'Position', completed: 4, val: 'position' },
    { name: 'Title', completed: 5, val: 'title' },
    { name: 'First Name', completed: 6, val: 'first_name' },
    { name: 'Last Name', completed: 7, val: 'last_name' },
    { name: 'Email', completed: 8, val: 'email' },
    { name: 'Creator Name', completed: 9, val: 'invite_by' },
    { name: 'Role', completed: 10, val: 'invite_by_role' },
    { name: 'IFS Supplier Code', completed: 11, val: 'ifsSupplierCode' },
    { name: 'Push Supplier Status', completed: 12, val: 'pushSupplierStatus' },
    // { name: 'Role', completed: false, val: 'role' },
    // { name: 'Creator Name', completed: false, val: 'buyerName' },
    // { name: 'Creator Email', completed: false, val: 'buyerEmail' }
  ]

  FilterdisplayedColumns = [
    { name: 'Status', selected: false },
    { name: 'Created Date', selected: false },
    { name: 'Position', selected: false },
    { name: 'Title', selected: false },
    { name: 'First Name', selected: false },
    { name: 'Last Name', selected: false },
    { name: 'Email', selected: false },
    { name: 'Creator Name', selected: false },
    { name: 'Role', selected: false },
    { name: 'IFS Supplier Code', selected: false },
    { name: 'Push Supplier Status', selected: false },
    // { name: 'Role', selected: false },
    // { name: 'Creator Name', selected: false },
    // { name: 'Creator Email', selected: false }
  ]

  columnsToDisplay: string[] = this.ColumnList.map(c => c.val);
  columnsToDisplayDesc: string[] = this.ColumnList.map(c => c.name);

  choose_search: any;
  tempData: InviteElement[];

  constructor(private http: HttpClient, private router: Router,private datePipe: DatePipe) {
    this.choose_search = "All";
    this.getUserSelectedFields();
  }

  ngOnInit(): void {
  }

  // Set to data to table
  filltabledata(data: any) {
    if(localStorage.getItem('dashboardinvfilter')!=''){
      this.filterName = localStorage.getItem('dashboardinvfilter');
      this.selectedValue = localStorage.getItem('dashboardinvfiltersel')? localStorage.getItem('dashboardinvfiltersel'):'all';
      
    }else{
      this.filterName = '';
      this.selectedValue = 'all';
    }

    if (data) {
      this.dataSourceDashboardList = [];
      data.forEach(element => {
        this.dataSourceDashboardList.push(
          {
            position: element.invite_supplier_id,
            supplierCode: 'IMI-IS-' + element.invite_supplier_id,
            ifsSupplierCode: '-',
            supplierName: element.invite_supplier_name,
            ifsStatus: 'Invite Sent',
            createdDate: this.datePipe.transform(element.create_date_time, 'dd-MMM-yyyy, HH:mm'),
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
            create_date_time: this.datePipe.transform(element.create_date_time, 'dd-MMM-yyyy, HH:mm'),
            re_invite_by: element.re_invite_by,
            re_invite_by_email: element.re_invite_by_email,
            re_invite_by_role: element.re_invite_by_role,
            re_invite_date_time: element.re_invite_date_ti
          }
        )
      });

      this.dataSource = new MatTableDataSource<InviteElement>(this.dataSourceDashboardList);
      this.tempData = this.dataSource.data;
      this.table.renderRows();
      this.dataSource.paginator = this.tableOnePaginator;
      if(localStorage.getItem('dashboardinvfilter')!=''){
        this.applyFilter(localStorage.getItem('dashboardinvfilter'));
      }

    }
    this.isloading = false;

  }

  selectchange(){
    this.applyFilter(localStorage.getItem('dashboardinvfilter')?localStorage.getItem('dashboardinvfilter'):'');
  }

  // Apply Filter to the table
  applyFilter(value) {
   
    const filterValue = value?value.trim().toLowerCase():'';

    localStorage.setItem('dashboardinvfilter',value?value.trim():'');
    localStorage.setItem('dashboardinvfiltersel',this.selectedValue);

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
        if (type == "Supplier Code") { result = d.supplierCode.toString(); }
        else if (type == "Supplier Name") { result = d.supplierName.toString(); }
        else if (type == "Supplier Code") { result = d.supplierCode.toString(); }
        else if (type == "Position") { result = d.position.toString(); }
        else if (type == "Title") { result = d.title.toString(); }
        else if (type == "First Name") { result = d.first_name.toString(); }
        else if (type == "Last Name") { result = d.last_name.toString(); }
        else if (type == "Email") { result = d.email.toString(); }
        else if (type == "Creator Name") { result = d.invite_by.toString(); }
        else if (type == "Role") { result = d.invite_by_role.toString(); }
        else if (type == "IFS Supplier Code") { result = d.ifsSupplierCode.toString(); }
        else if (type == "Status") { result = d.ifsStatus.toString(); }
        else if (type == "Created Date") { result = d.createdDate.toString(); }
        else if (type == "Push Supplier Status") { result = d.pushSupplierStatus.toString(); }
        // else if (type == "Role") { result = d.role.toString(); }
        // else if (type == "Creator Name") { result = d.buyerName.toString(); }
        // else if (type == "Creator Email") { result = d.buyerEmail.toString(); }
        return result.toLowerCase().indexOf(filterValue) == 0 || !filterValue || result.toLowerCase().includes(filterValue);
      });
      this.dataSource.data = temp;
    }
    this.isloading = false;

  }

  async getUserSelectedFields() {
    this.useremail = localStorage.getItem("useremail");

    this.http.get(environment.nodeurl + '/api/template/userDatatableFields?email=' + this.useremail)
      .subscribe(data => {
        if (data) {
          var selected: any = data;
          if (selected.filter(x => x.section == 'Inv Task').length > 0) {
            var usersavedcolumns: string[] = selected.filter(x => x.section == 'Inv Task')[0].selectedColumns;

            var tempColumnList: string[] = [];
            tempColumnList.push('supplierCode', 'supplierName');
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
    templatedto.section = 'Inv Task';
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

  addRemoveField(item, event) {
    var selitem = this.ColumnList.filter(a => a.name == item).map(c => c.val)[0];

    if (selitem) {
      if (!event.checked) {
        var index = this.ColumnList.filter(x=>x.val == selitem)[0].completed;
        this.columnsToDisplay.splice(index,0,selitem);
        this.columnsToDisplayDesc.splice(index,0,item);

        // this.columnsToDisplay.push(selitem);
        // this.columnsToDisplayDesc.push(item);
      } else {
        this.columnsToDisplay = this.columnsToDisplay.filter(a => a !== selitem);
        this.columnsToDisplayDesc = this.columnsToDisplayDesc.filter(a => a !== item);
      }
    }

  }

  // Navigate to each suppliers data
  openRowInfo(supplierID) {
    localStorage.setItem('dashboardclick','invite');
    var code = supplierID.split("-")[2];
    this.router.navigate(['items/invite-supplier/d/', code]);
  }

  changeColumn(data){
    this.selectedValue = data;
  }

  toggleAllSelection(event) {
    var selected = event.checked;
    this.allSelected = event.checked;
    for (var i = 0; i < this.FilterdisplayedColumns.length; i++) {
      this.FilterdisplayedColumns[i].selected = selected;
    }
    if(this.allSelected){
      this.columnsToDisplay = this.ColumnList.map(c => c.val);
      this.columnsToDisplayDesc = this.ColumnList.map(c => c.name);
    }else{
      this.columnsToDisplay = ['supplierCode', 'supplierName'];
      this.columnsToDisplayDesc = ['Supplier Code', 'Supplier Name'];
    }
  }
}