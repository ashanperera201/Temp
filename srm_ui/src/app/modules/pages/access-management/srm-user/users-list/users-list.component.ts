import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

import { SrmUserService } from '../../../../../shared/Services/srm-user.service';
import { UserCreateUpdateComponent } from '../user-create-update/user-create-update.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isLoading: boolean = true;
  internalUserDataSource: MatTableDataSource<any>;
  tempData: MatTableDataSource<any>;

  defaultLang: '';
  fullName: '';
  email: '';
  loginMethod: '';
  userName: '';
  createdOn: '';
  isActive: '';

  currentReqPage = '';
  dataSourceDashboardList: any = [];
  displayedDashboardColumns: string[];

  filterValues = {};
  table: string;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, private srmUserService: SrmUserService) {
    this.displayedDashboardColumns = ['userName', 'fullName', 'email', 'defaultLang', 'loginMethod', 'createdOn', 'isActive', 'actions'];
  }

  ngOnInit(): void {
    this.fetchUsers();
    this.onAfterSaveUpdate();
  }

  onAfterSaveUpdate = () => {
    this.srmUserService.afterSaveUpdate.subscribe(res => {
      if (res) {
        this.fetchUsers();
      }
    })
  }

  fetchUsers = () => {
    this.srmUserService.fetchUsers().subscribe({
      next: (serviceRes: any) => {
        this.internalUserDataSource = new MatTableDataSource(serviceRes);
      }
    });
  }

  ngAfterViewInit = (): void => {
    if (this.internalUserDataSource) {
      this.internalUserDataSource.paginator = this.paginator;
      this.internalUserDataSource.sort = this.sort;
    }
  }

  resetFilters = (): void => {
    this.filterValues = {};
    this.filterChange('', '');
  }

  filterChange = (type, event): void => {
    if (this.internalUserDataSource) {
      let value = '';
      value = event ? event.target.value.trim().toLowerCase() : '';

      const filterValue = value;

      this.internalUserDataSource.filter = filterValue.trim().toLowerCase();

      if (type === 'userIdentity') {
        this.internalUserDataSource.filterPredicate = (data, filter: any): boolean => data.userIdentity.toLowerCase().includes(filter);
      } else if (type === 'fullName') {
        this.internalUserDataSource.filterPredicate = (data, filter: any): boolean => data.fullName.toLowerCase().includes(filter);
      } else if (type === 'email') {
        this.internalUserDataSource.filterPredicate = (data, filter: any): boolean => data.email.toLowerCase().includes(filter);
      } else if (type === 'defaultLang') {
        this.internalUserDataSource.filterPredicate = (data, filter: any): boolean => data.defaultLang.toLowerCase().includes(filter);
      } else if (type === 'loginMethod') {
        this.internalUserDataSource.filterPredicate = (data, filter: any): boolean => data.loginMethod.toLowerCase().includes(filter);
      } else if (type === 'userName') {
        this.internalUserDataSource.filterPredicate = (data, filter: any): boolean => data.userName.toLowerCase().includes(filter);
      }

      if (this.internalUserDataSource.paginator) {
        this.internalUserDataSource.paginator.firstPage();
      }
    }
  }

  activeRow = ($event, row): void => {
    const data = { data: row, checked: $event.checked };
    console.log('Row clicked active: ', data);
  }

  viewNotification = (row): void => {
    const queryParams: any = {};
    queryParams.user = 'view';
    queryParams.userID = row.userIdentity;
    queryParams.row = JSON.stringify(row);
    const navigationExtras: NavigationExtras = {
      queryParams,
    };
    this.router.navigate(['/user-records'], navigationExtras);
  }


  userCreateUpdatePopup = (existingUser?: any): void => {
    if (existingUser) {
      this.router.navigate([`/access-management/user/update/${existingUser.userId}`])
    } else {
      this.router.navigate(['access-management/user/create']);
    }
  }
}
