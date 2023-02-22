import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Table } from './table';

const ELEMENT_DATA_CATEGORIES_NEW: Table[] = [
  {
    id: 1,
    userIdentity: 'Mellie',
    fullName: 'Gabbott',
    email: 'mgabbott0@indiatimes.com',
    ifsID: '11/01/22 : 11:00AM',
    company: '',
    type: 'Internal',
    action: 'approved',
    status: 'open'
  },
  {
    id: 2,
    userIdentity: 'Yehudi',
    fullName: 'Ainsby',
    email: 'yainsby1@w3.org',
    ifsID: 'Support',
    company: 'Company 2',
    type: 'Internal',
    action: 'open',
    status: 'close'
  },
  {
    id: 3,
    userIdentity: 'Noellyn',
    fullName: 'Primett',
    email: 'nprimett2@ning.com',
    ifsID: 'Human Resources',
    company: 'Company 2',
    type: 'Internal',
    action: 'reject',
    status: 'open'
  },
  {
    id: 4,
    userIdentity: 'Stefanie',
    fullName: 'Yurenin',
    email: 'syurenin3@boston.com',
    ifsID: 'Marketing',
    company: 'Company 3',
    type: 'Internal',
    action: 'approved',
    status: 'close'
  },
  {
    id: 5,
    userIdentity: 'Stormi',
    fullName: "O'Lunny",
    email: 'solunny4@patch.com',
    ifsID: 'Engineering',
    company: 'Company 3',
    type: 'Internal',
    action: 'approved',
    status: 'open'
  },
  {
    id: 6,
    userIdentity: 'Keelia',
    fullName: 'Giraudy',
    email: 'kgiraudy5@nba.com',
    ifsID: 'Marketing',
    company: 'Company 4',
    type: 'Internal',
    action: 'open',
    status: 'close'
  },
  {
    id: 7,
    userIdentity: 'Ikey',
    fullName: 'Laight',
    email: 'ilaight6@wiley.com',
    ifsID: 'Support',
    company: 'Company 4',
    type: 'Internal',
    action: 'reject',
    status: 'close'
  },
  {
    id: 8,
    userIdentity: 'Adrianna',
    fullName: 'Ruddom',
    email: 'aruddom7@seattletimes.com',
    ifsID: 'Marketing',
    company: 'Company 4',
    type: 'External',
    action: 'reject',
    status: 'open'
  },
  {
    id: 9,
    userIdentity: 'Dionysus',
    fullName: 'McCory',
    email: 'dmccory8@ox.ac.uk',
    ifsID: 'Engineering',
    company: 'Company 4',
    type: 'External',
    action: 'Open',
    status: 'close'
  },
  {
    id: 10,
    userIdentity: 'Claybourne',
    fullName: 'Shellard',
    email: 'cshellard9@rediff.com',
    ifsID: 'Engineering',
    company: 'Company 5',
    type: 'External',
    action: 'approved',
    status: 'open'
  },
];

export interface TableData {
  tableData: any;
  table: string;
}

@Component({
  selector: 'app-internal-user-creation-n-role-assignment',
  templateUrl: './internal-user-creation-n-role-assignment.component.html',
  styleUrls: ['./internal-user-creation-n-role-assignment.component.scss']
})
export class InternalUserCreationNRoleAssignmentComponent implements OnInit, AfterViewInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading: boolean = true;
  internalUser: MatTableDataSource<Table>;
  tempData: MatTableDataSource<Table>;


  userIdentity: '';
  fullName: '';
  email: '';
  ifsID: '';
  company: '';

  currentReqPage = '';
  dataSourceDashboardList: any = [];
  displayedDashboardColumns: string[];

  filterValues = {};
  table: string;

  constructor(public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute) {

    this.internalUser = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);

    this.displayedDashboardColumns = ['userIdentity', 'fullName', 'email', 'ifsID', 'company', 'type', 'active'];
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.internalUser.paginator = this.paginator;
    this.internalUser.sort = this.sort;
  }

  //reset filters/data
  resetFilters(): void {
    this.filterValues = {};
    this.filterChange('', '');
  }

  //table filters
  filterChange(type, event): void {

    let value = '';
    value = event ? event.target.value.trim().toLowerCase() : '';

    const filterValue = value;

    this.internalUser.filter = filterValue.trim().toLowerCase();

    if (type === 'userIdentity') {
      this.internalUser.filterPredicate = (data, filter: any): boolean => data.userIdentity.toLowerCase().includes(filter);
    } else if (type === 'fullName') {
      this.internalUser.filterPredicate = (data, filter: any): boolean => data.fullName.toLowerCase().includes(filter);
    } else if (type === 'email') {
      this.internalUser.filterPredicate = (data, filter: any): boolean => data.email.toLowerCase().includes(filter);
    } else if (type === 'ifsID') {
      this.internalUser.filterPredicate = (data, filter: any): boolean => data.ifsID.toLowerCase().includes(filter);
    } else if (type === 'company') {
      this.internalUser.filterPredicate = (data, filter: any): boolean => data.company.toLowerCase().includes(filter);
    } else if (type === 'type') {
      this.internalUser.filterPredicate = (data, filter: any): boolean => data.type.toLowerCase().includes(filter);
    }

    if (this.internalUser.paginator) {
      this.internalUser.paginator.firstPage();
    }
  }

  //activate row
  activeRow($event, row): void {

    const data = { data: row, checked: $event.checked };
    console.log('Row clicked active: ', data);
  }

  viewNotification(row): void {
    const queryParams: any = {};
    queryParams.user = 'view';
    queryParams.userID = row.userIdentity;
    queryParams.row = JSON.stringify(row);
    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/user-records'], navigationExtras);
  }

  createNew(val): void {
    const queryParams: any = {};
    queryParams.user = 'new';
    queryParams.type = val;
    queryParams.userID = null;
    queryParams.row = null;

    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/user-records'], navigationExtras);
  }
}
