import { Component, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService, User } from '@auth0/auth0-angular';

import { RolesService } from '../../../../../../shared/Services/roles.service';
import { SrmUserService } from '../../../../../../shared/Services/srm-user.service';
import { ToastService } from '../../../../../../shared/Services/toast.service';
import { TYPE } from '../../../../../../shared/enums/toast.enum';
import { UserService } from '../../../../../../shared/Services/user.service';

@Component({
  selector: 'user-role-assign-tab',
  templateUrl: './user-role-assign-tab.component.html',
  styleUrls: ['./user-role-assign-tab.component.scss']
})
export class UserRoleAssignTabComponent implements OnInit, AfterViewInit {

  @Input() userId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  roleNameSelect: any;
  roleSelect = new FormControl();
  groupNameSearch = new FormControl();
  filteredOptions: Observable<string[]>;
  options: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  roleIdSelect: string[] = ['List 01', 'List 02', 'List 03', 'List 04', 'List 05'];
  displayedDashboardColumns: string[] = ['createdOn', 'createdBy', 'comment'];
  userProfileInformation: User;

  selectedRoles: any[] = [
    {
      name: 'RID 4467',
      title: 'Reviewer 1',
    },
    {
      name: 'RID 4468',
      title: 'Reviewer 2',
    },
    {
      name: 'RID 4469',
      title: 'Reviewer 3',
    },
  ];
  userList$: any[] = [];

  toDoOverviewDataSource: MatTableDataSource<any>;
  userRoles: any[] = [];
  pickedRoles: any;

  constructor(
    private rolesService: RolesService,
    private srmUserService: SrmUserService,
    private authService: AuthService,
    private toastService: ToastService,
    private userService: UserService) {

  }

  ngOnInit(): void {
    this.fetchRoles();
    this.fetchUsers();
    this.fetchAssignedRoles();

    this.filteredOptions = this.roleSelect.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    this.filteredOptions = this.groupNameSearch.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  fetchUsers = () => {
    this.userService.fetchUsers().subscribe({
      next: (usersList: any) => {
        this.userList$ = usersList;
        this.fetchRoleLogs();
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  fetchRoleLogs = () => {
    this.rolesService.fetchRoles().subscribe(serviceRes => {
      if (serviceRes) {
        const filteredRes: any[] = serviceRes.filter(x => x.userId === this.userId);
        const mappedResult = filteredRes.map(x => {
          const user = this.userList$.find(x => x.sub === x.createdBy);
          x['nickname'] = user?.nickname
          return {
            ...x,
          }
        });
        this.toDoOverviewDataSource = new MatTableDataSource(mappedResult);
      }
    })
  }

  fetchRoles = () => {
    this.rolesService.fetchRoles().subscribe(serviceRes => {
      if (serviceRes) {
        this.userRoles = serviceRes;
        this.fetchProfileInformation();
      }
    })
  }

  fetchAssignedRoles = () => {
    this.rolesService.fetchRoles().subscribe(serviceRes => {
      if (serviceRes) {

        const filteredRoles = serviceRes.filter(x => x.userId === this.userId);
        this.pickedRoles = this.userRoles.filter(r => {
          const role = filteredRoles.some(x => x.roleId === r.id);
          if (role) {
            return {
              ...r
            }
          }
        })
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.toDoOverviewDataSource) {
      this.toDoOverviewDataSource.paginator = this.paginator;
      this.toDoOverviewDataSource.sort = this.sort;
    }
  }

  assignRole = () => {
    let roleList: any[] = [];
    for (let i = 0; i < this.pickedRoles.length; i++) {
      let payload = {
        "userId": this.userId,
        "roleId": this.pickedRoles[i]?.id,
        "createdOn": new Date(),
        "createdBy": this.userProfileInformation.sub,
        "assignRoleLog": {
          "userId": this.userId,
          "roleId": this.pickedRoles[i]?.id,
          "comment": "Role Assigned",
          "createdBy": this.userProfileInformation.sub
        }
      };
      roleList.push(payload);
    }

    this.srmUserService.assignUserRole(roleList).subscribe(serviceRes => {
      if (serviceRes) {
        this.srmUserService.afterSaveUpdate.emit(true);
        this.toastService.showToast(TYPE.SUCCESS, false, "Successfully updated.");
      }
    })
  }

  fetchProfileInformation = () => {
    this.authService.user$.subscribe((user: User) => {
      if (user) {
        this.userProfileInformation = user;
      }
    }, error => {
      console.log(error);
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
