/* eslint-disable guard-for-in */
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Table } from './table';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { NotificationConfigDialogComponent } from './notification-config-dialog/notification-config-dialog.component';

const ELEMENT_DATA_CATEGORIES_NEW: Table[] = [
  {
    id: 1,
    template: 'Mellie',
    description: 'Gabbott',
    type: 'mgabbott0@indiatimes.com',
    createdBy: '11/01/22 : 11:00AM',
    action: 'approved',
    status: 'open'
  },
  {
    id: 2,
    template: 'Yehudi',
    description: 'Ainsby',
    type: 'yainsby1@w3.org',
    createdBy: 'Support',
    action: 'open',
    status: 'close'
  },
  {
    id: 3,
    template: 'Noellyn',
    description: 'Primett',
    type: 'nprimett2@ning.com',
    createdBy: 'Human Resources',
    action: 'reject',
    status: 'open'
  },
  {
    id: 4,
    template: 'Stefanie',
    description: 'Yurenin',
    type: 'syurenin3@boston.com',
    createdBy: 'Marketing',
    action: 'approved',
    status: 'close'
  },
  {
    id: 5,
    template: 'Stormi',
    description: "O'Lunny",
    type: 'solunny4@patch.com',
    createdBy: 'Engineering',
    action: 'approved',
    status: 'open'
  },
  {
    id: 6,
    template: 'Keelia',
    description: 'Giraudy',
    type: 'kgiraudy5@nba.com',
    createdBy: 'Marketing',
    action: 'open',
    status: 'close'
  },
  {
    id: 7,
    template: 'Ikey',
    description: 'Laight',
    type: 'ilaight6@wiley.com',
    createdBy: 'Support',
    action: 'reject',
    status: 'close'
  },
  {
    id: 8,
    template: 'Adrianna',
    description: 'Ruddom',
    type: 'aruddom7@seattletimes.com',
    createdBy: 'Marketing',
    action: 'reject',
    status: 'open'
  },
  {
    id: 9,
    template: 'Dionysus',
    description: 'McCory',
    type: 'dmccory8@ox.ac.uk',
    createdBy: 'Engineering',
    action: 'Open',
    status: 'close'
  },
  {
    id: 10,
    template: 'Claybourne',
    description: 'Shellard',
    type: 'cshellard9@rediff.com',
    createdBy: 'Engineering',
    action: 'approved',
    status: 'open'
  },
];
export interface TableData {
  tableData: any;
  table: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading: boolean = true;
  toDoOverviewDataSource: MatTableDataSource<Table>;
  tempData: MatTableDataSource<Table>;


  template: '';
  description: '';
  type: '';
  createdBy: '';

  currentReqPage = '';
  dataSourceDashboardList: any = [];
  displayedDashboardColumns: string[];

  filterValues = {};
  table: string;

  constructor(private router: Router,) {
    this.toDoOverviewDataSource = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);

    this.displayedDashboardColumns = ['template', 'description', 'type', 'createdBy', 'active'];
  }

  ngOnInit(): void {
    this.isLoading = false;
  }

  ngAfterViewInit(): void {
    this.toDoOverviewDataSource.paginator = this.paginator;
    this.toDoOverviewDataSource.sort = this.sort;
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

    this.toDoOverviewDataSource.filter = filterValue.trim().toLowerCase();

    if (type === 'template') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.template.toLowerCase().includes(filter);
    } else if (type === 'description') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.description.toLowerCase().includes(filter);
    } else if (type === 'type') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.type.toLowerCase().includes(filter);
    } else if (type === 'createdBy') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.createdBy.toLowerCase().includes(filter);
    }

    if (this.toDoOverviewDataSource.paginator) {
      this.toDoOverviewDataSource.paginator.firstPage();
    }
  }

  //popup close
  close(): void {
    //this.dialogRef.close();
  }

  //edit row
  editRow(row): void {
    const data = row;
    console.log('Row clicked edit: ', data);
  }

  //copy row
  copyRow(row): void {
    const data = row;
    console.log('Row clicked copy: ', data);
  }

  //activate row
  activeRow($event, row): void {

    const data = { data: row, checked: $event.checked };
    console.log('Row clicked active: ', data);
  }

  //view notification
  getRowInfo(row): void {
    const data = row;
    console.log('Row clicked add: ', data);
  }

  viewNotification(row): void {
    const queryParams: any = {};
    queryParams.type = 'view';
    queryParams.row = JSON.stringify(row);

    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/notifications-config'], navigationExtras);
  }

  createNew(): void {
    const queryParams: any = {};
    queryParams.type = 'new';

    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/notifications-config'], navigationExtras);
  }
}

