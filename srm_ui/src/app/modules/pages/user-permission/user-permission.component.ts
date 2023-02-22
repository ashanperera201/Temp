/* eslint-disable guard-for-in */
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserRole } from './table';
import { MatSort } from '@angular/material/sort';
import moment from 'moment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

const userRoleData: UserRole[] = [
  {
    id: 1,
    roleName: 'Mellie',
    description: 'Gabbott',
    type: 'mgabbott0@indiatimes.com',
    createdBy: 'mgabbott0@indiatimes.com',
    createdDate: '11/01/22 : 11:00AM',
    action: 'approved',
    isChecked: true,
  },
  {
    id: 2,
    roleName: 'Yehudi',
    description: 'Ainsby',
    type: 'yainsby1@w3.org',
    createdBy: 'yainsby1@w3.org',
    createdDate: 'Female',
    action: 'open',
    isChecked: true,
  },
  {
    id: 3,
    roleName: 'Noellyn',
    description: 'Primett',
    type: 'nprimett2@ning.com',
    createdBy: 'nprimett2@ning.com',
    createdDate: 'Female',
    action: 'reject',
    isChecked: true,
  },
  {
    id: 4,
    roleName: 'Stefanie',
    description: 'Yurenin',
    type: 'syurenin3@boston.com',
    createdBy: 'syurenin3@boston.com',
    createdDate: 'Female',
    action: 'approved',
    isChecked: true,
  },
  {
    id: 5,
    roleName: 'Stormi',
    description: 'O\'Lunny',
    type: 'solunny4@patch.com',
    createdBy: 'solunny4@patch.com',
    createdDate: 'Female',
    action: 'approved',
    isChecked: true,
  },
  {
    id: 6,
    roleName: 'Keelia',
    description: 'Giraudy',
    type: 'kgiraudy5@nba.com',
    createdBy: 'kgiraudy5@nba.com',
    createdDate: 'Male',
    action: 'open',
    isChecked: true,
  },
  {
    id: 7,
    roleName: 'Ikey',
    description: 'Laight',
    type: 'ilaight6@wiley.com',
    createdBy: 'ilaight6@wiley.com',
    createdDate: 'Male',
    action: 'reject',
    isChecked: true,
  },
  {
    id: 8,
    roleName: 'Adrianna',
    description: 'Ruddom',
    type: 'aruddom7@seattletimes.com',
    createdBy: 'aruddom7@seattletimes.com',
    createdDate: 'Male',
    action: 'reject',
    isChecked: true,
  },
  {
    id: 9,
    roleName: 'Dionysus',
    description: 'McCory',
    type: 'dmccory8@ox.ac.uk',
    createdBy: 'dmccory8@ox.ac.uk',
    createdDate: 'Male',
    action: 'Open',
    isChecked: true,
  },
  {
    id: 10,
    roleName: 'Claybourne',
    description: 'Shellard',
    type: 'cshellard9@rediff.com',
    createdBy: 'cshellard9@rediff.com',
    createdDate: 'Male',
    action: 'approved',
    isChecked: true,
  },
];


@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading: boolean = true;
  displayedDashboardColumns = ['roleName', 'description', 'type', 'createdBy', 'createdDate', 'action'];


  toDoOverviewDataSource = new MatTableDataSource<UserRole>(userRoleData);


  roleName: '';
  description: '';
  type: '';
  createdDate: '';
  action: '';

  currentReqPage = '';
  dataSourceDashboardList: any = [];


  filterValues = {};

  constructor(private router: Router) {

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

    if (type === 'roleName') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.roleName.toLowerCase().includes(filter);
    } else if (type === 'description') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.description.toLowerCase().includes(filter);
    } else if (type === 'type') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.type.toLowerCase().includes(filter);
    } else if (type === 'createdDate') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.createdDate.toLowerCase().includes(filter);
    } else if (type === 'action') {
      this.toDoOverviewDataSource.filterPredicate = (data, filter: any): boolean => data.action.toLowerCase().includes(filter);
    }

    if (this.toDoOverviewDataSource.paginator) {
      this.toDoOverviewDataSource.paginator.firstPage();
    }
  }

  //popup close
  close(): void {
  }

  //new permission
  addNew(): void {
    const newPermission = 'new';
    this.router.navigate(['/user-permission-details', { task: newPermission }]);
  }

  //view permission
  getRowInfo(row): void {
    const data = row;
    console.log('goto: ', data);

    const viewPermission = 'view';
    this.router.navigate(['/user-permission-details', { task: viewPermission }]);
  }

  //edit permission
  editPermission(row): void {
    const data = row;
    console.log('edit: ', data);

    const editPermission = 'editPermission';
    this.router.navigate(['/user-permission-details', { task: editPermission }]);
  }

  //copy permission
  copyPermission(row): void {
    const data = row;
    console.log('copy: ', data);

    const copyPermission = 'copyPermission';
    this.router.navigate(['/user-permission-details', { task: copyPermission }]);
  }

  //activation user
  activateUser(row): void {
    const data = row;
    console.log('activate: ', data);
  }
}
