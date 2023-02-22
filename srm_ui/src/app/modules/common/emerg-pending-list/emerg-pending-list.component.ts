import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { environment } from 'environments/environment.prod';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { UserFields } from 'app/main/Models/Template';
import { DatePipe } from '@angular/common';

export interface EmergencyElement {
  position: string;
  suppliercode: string;
  ifsSupplierCode: string;
  supplierName: string;
  ifsStatus: string;
  registrationNumber: string;
  createdDate: string;
  yearOfEstablishement: string;
  pushSupplierStatus: string;
  role: string;
  buyerName: string;
  buyerEmail: string;
  contactemail: string;
  contactPhone: string;
  contactname: string;
}

const ELEMENT_EMERGENCY: EmergencyElement[] = [];

@Component({
  selector: 'app-emerg-pending-list',
  templateUrl: './emerg-pending-list.component.html',
  styleUrls: ['./emerg-pending-list.component.scss'],
  providers: [DatePipe]
})
export class EmergPendingListComponent implements OnInit {

  @Input() messagelist: any[];
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild('select') select: MatSelect;
  employees: any[];
  issuccess = false;
  iserror = false;
  errormessage = 'Something went wrong, please try again.';
  successmessage = 'Successfully saved';
  selectedValue: string = 'all';
  isloading: boolean = true;
  allSelected: boolean = false;
  filterName:string;
  dataSourceDashboardList: any = [];

  dataSource = new MatTableDataSource(ELEMENT_EMERGENCY);
  displayedColumns: string[] = ['id', 'supplierId', 'name', 'position', 'supplierEmail', 'supplierPhone', 'ifsStatus', 'registrationNumber', /* 'SRMRemarkAfterVPRejection', */
    'createdDate', /* 'additionalScope', */ 'yearOfEstablishement', 'ifsSupplierCode', 'pushSupplierStatus', 'role', 'buyerName', /* 'supplierRegKey', */ 'buyerEmail'];

  custom_search = [
    { value: true, viewValue: 'All' },
    { value: true, viewValue: 'Supplier Code' },
    { value: true, viewValue: 'Supplier Name' },
    { value: true, viewValue: 'Position' },
    { value: true, viewValue: 'Contact Email' },
    { value: true, viewValue: 'Contact Phone' },
    { value: true, viewValue: 'Status' },
    { value: true, viewValue: 'CR/Registration #' },
    { value: true, viewValue: 'Year of Establishment' },
    { value: true, viewValue: 'IFS Supplier Code' },
    { value: true, viewValue: 'Push Supplier Status' },
    { value: true, viewValue: 'Role' },
    { value: true, viewValue: 'Creator Name' },
    { value: true, viewValue: 'Creator Email' },
    { value: true, viewValue: 'Contact Person Name' }
  ];

  ColumnList = [
    { name: 'Supplier Code', completed: 0, val: 'suppliercode' },
    { name: 'Supplier Name', completed: 1, val: 'supplierName' },
    { name: 'Status', completed: 2, val: 'ifsStatus' },
    { name: 'Created Date', completed: 3, val: 'createdDate' },
    { name: 'Position', completed: 4, val: 'position' },
    { name: 'Contact Person Name', completed: 5, val: 'contactname' },
    { name: 'Contact Email', completed: 6, val: 'contactemail' },
    { name: 'Contact Phone', completed: 7, val: 'contactPhone' },
    { name: 'CR/Registration #', completed: 8, val: 'registrationNumber' },
    { name: 'Year of Establishment', completed: 9, val: 'yearOfEstablishement' },
    { name: 'IFS Supplier Code', completed: 10, val: 'ifsSupplierCode' },
    { name: 'Push Supplier Status', completed: 11, val: 'pushSupplierStatus' },
    { name: 'Role', completed: 12, val: 'role' },
    { name: 'Creator Name', completed: 13, val: 'buyerName' },
    { name: 'Creator Email', completed: 14, val: 'buyerEmail' }
  ]

  FilterdisplayedColumns = [
    { name: 'Status', selected: false },
    { name: 'Created Date', selected: false },
    { name: 'Position', selected: false },
    { name: 'Contact Person Name', selected: false },
    { name: 'Contact Email', selected: false },
    { name: 'Contact Phone', selected: false },
    { name: 'CR/Registration #', selected: false },
    { name: 'Year of Establishment', selected: false },
    { name: 'IFS Supplier Code', selected: false },
    { name: 'Push Supplier Status', selected: false },
    { name: 'Role', selected: false },
    { name: 'Creator Name', selected: false },
    { name: 'Creator Email', selected: false }
  ]

  columnsToDisplay: string[] = this.ColumnList.map(c => c.val);
  columnsToDisplayDesc: string[] = this.ColumnList.map(c => c.name);

  choose_search: any;
  tempData: EmergencyElement[];
  currentUserRole: string;
  useremail = '';

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
    this.choose_search = "All";
    this.getUserSelectedFields();
  }

  ngOnInit(): void {
  }

  // Set to data to table
  filltabledata(data: any) {
    if(localStorage.getItem('dashboardemgfilter')!=''){
      this.filterName = localStorage.getItem('dashboardemgfilter');
      this.selectedValue = localStorage.getItem('dashboardemgfiltersel')? localStorage.getItem('dashboardemgfiltersel'):'all';
      
    }else{
      this.filterName = '';
      this.selectedValue = 'all';
    }

    if (data) {
      this.dataSourceDashboardList = [];
      data.forEach(element => {
        this.dataSourceDashboardList.push(
          {
            position: element.position,
            suppliercode: 'IMI-ES-' + element.supplier_id,
            ifsSupplierCode: element.ifs_code,
            supplierName: element.emergency_supplier_name,
            ifsStatus: element.status,
            registrationNumber: element.cr_no,
            createdDate: this.datePipe.transform(element.create_date_time, 'dd-MMM-yyyy, HH:mm'),
            yearOfEstablishement: element.establishment_year,
            pushSupplierStatus: (element.ifs_code !=null && element.ifs_code !="")? "Pushed": "Not Pushed",
            role: element.invite_by_role,
            buyerName: element.invite_by,
            buyerEmail: element.invite_by_email,
            contactemail: element.email,
            contactPhone: element.telephone_no,
            contactname: element.first_name
          }
        )
      });
      this.dataSource = new MatTableDataSource<EmergencyElement>(this.dataSourceDashboardList);
      this.tempData = this.dataSource.data;
      this.table.renderRows();
      this.dataSource.paginator = this.tableOnePaginator;

      if(localStorage.getItem('dashboardemgfilter')!=''){
        this.applyFilter(localStorage.getItem('dashboardemgfilter'));
      }

    }
    this.isloading = false;
  }

  selectchange(){
    this.applyFilter(localStorage.getItem('dashboardemgfilter')?localStorage.getItem('dashboardemgfilter'):'');
  }

  applyFilter(value) {
    const filterValue = value?value.trim().toLowerCase():'';

    localStorage.setItem('dashboardemgfilter',value?value.trim():'');
    localStorage.setItem('dashboardemgfiltersel',this.selectedValue);

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
        if (type == "Supplier Code") { result = d.suppliercode.toString(); }
        else if (type == "Supplier Name") { result = d.supplierName.toString(); }
        else if (type == "Supplier Code") { result = d.suppliercode.toString(); }
        else if (type == "Position") { result = d.position.toString(); }
        else if (type == "Contact Person Name") { result = d.contactname.toString(); }
        else if (type == "Contact Email") { result = d.contactemail.toString(); }
        else if (type == "Contact Phone") { result = d.contactPhone.toString(); }
        else if (type == "Status") { result = d.ifsStatus.toString(); }
        else if (type == "CR/Registration #") { result = d.registrationNumber.toString(); }
        else if (type == "Year of Establishment") { result = d.yearOfEstablishement.toString(); }
        else if (type == "IFS Supplier Code") { result = d.ifsSupplierCode.toString(); }
        else if (type == "Push Supplier Status") { result = d.pushSupplierStatus.toString(); }
        else if (type == "Role") { result = d.role.toString(); }
        else if (type == "Creator Name") { result = d.buyerName.toString(); }
        else if (type == "Creator Email") { result = d.buyerEmail.toString(); }
        else if (type == "Created Date") { result = d.createdDate.toString(); }
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
          if (selected.filter(x => x.section == 'Emg Task').length > 0) {
            var usersavedcolumns: string[] = selected.filter(x => x.section == 'Emg Task')[0].selectedColumns;

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
    templatedto.section = 'Emg Task';
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
    localStorage.setItem('dashboardclick','emergency');
    var code = supplierID.split("-")[2];
    this.router.navigate(['items/emergency-supplier/d/', code]);
  }

  toggleAllSelection() {
    var selected = this.allSelected;
    for (var i = 0; i < this.FilterdisplayedColumns.length; i++) {
      this.FilterdisplayedColumns[i].selected = selected;
    }
    if(this.allSelected){
      this.columnsToDisplay = this.ColumnList.map(c => c.val);
      this.columnsToDisplayDesc = this.ColumnList.map(c => c.name);
    }else{
      this.columnsToDisplay = ['suppliercode','supplierName'];
      this.columnsToDisplayDesc = ['Supplier Code','Supplier Name'];
    }
  }
}