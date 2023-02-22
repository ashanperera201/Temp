import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService, User } from '@auth0/auth0-angular';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';


import { RoleCreateUpdateComponent } from './role-create-update/role-create-update.component';
import { RoleConfirmationComponent } from './role-confirmation/role-confirmation.component';
import { RolesService } from '../../../../shared/Services/roles.service';
import { UserService } from '../../../../shared/Services/user.service';
import { PermissionCreateUpdateComponent } from '../permission/permission-visibility-create-update/permission-visibility-create-update.component';

@Component({
    selector: 'access-management-roles',
    templateUrl: './role.component.html',
    styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit, OnDestroy, AfterViewInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    isLoading: boolean = true;
    displayedDashboardColumns = ['roleName', 'description', 'type', 'roleAssignedUser', 'createdDate', 'action'];
    // CREATE DTO LATER.
    rolesDataSource = new MatTableDataSource<any>();
    roleName: '';
    roleDescription: '';
    type: '';
    createdDate: '';
    action: '';
    currentReqPage = '';
    dataSourceDashboardList: any = [];
    filterValues = {};
    roleAssignedUser: '';
    userList$: any;
    roleSubscriptions: Subscription[] = [];

    userProfileInformation: User;

    constructor(
        private authService: AuthService,
        private rolesService: RolesService,
        private userService: UserService,
        public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.fetchUsers();
        this.triggerAfterRoleSaveUpdate();
    }

    triggerAfterRoleSaveUpdate = () => {
        this.roleSubscriptions.push(this.rolesService.afterSaveUpdate.subscribe(res => {
            if (res) {
                this.fetchRoles();
            }
        }))
    }

    fetchUsers = () => {
        this.userService.fetchUsers().subscribe({
            next: (usersList: any) => {
                this.userList$ = usersList;
                this.fetchUserProfile();
            },
            error: (error: any) => {
                console.log(error);
            }
        })
    }

    fetchUserProfile = () => {
        this.authService.user$.subscribe((user: User) => {
            if (user) {
                this.userProfileInformation = user;
                this.fetchRoles();
            }
        }, error => {
            console.log(error);
        })
    }

    fetchRoles = (): void => {
        this.rolesService.fetchRoles(this.userProfileInformation.sub).subscribe(roles => {
            if (roles) {
                this.rolesDataSource.data = roles;
            }
            this.isLoading = false;
        }, error => {
            console.log(error);
            this.isLoading = false;
        });
    };

    ngAfterViewInit(): void {
        if (this.rolesDataSource) {
            this.rolesDataSource.paginator = this.paginator;
            this.rolesDataSource.sort = this.sort;
        }
    }

    resetFilters = (): void => {
        this.filterValues = {};
        this.filterChange('', '');
    }

    getUser = (userId: string) => {
        return this.userList$.find(x => x.user_id === userId)?.name;
    }

    filterChange = (type, event): void => {

        let value = '';
        value = event ? event.target.value.trim().toLowerCase() : '';

        const filterValue = value;

        this.rolesDataSource.filter = filterValue.trim().toLowerCase();

        if (type === 'roleName') {
            this.rolesDataSource.filterPredicate = (data, filter: any): boolean => data.roleName.toLowerCase().includes(filter);
        } else if (type === 'roleDescription') {
            this.rolesDataSource.filterPredicate = (data, filter: any): boolean => data.roleDescription.toLowerCase().includes(filter);
        } else if (type === 'type') {
            this.rolesDataSource.filterPredicate = (data, filter: any): boolean => data.roleType.toLowerCase().includes(filter);
        } else if (type === 'createdDate') {
            this.rolesDataSource.filterPredicate = (data, filter: any): boolean => data.createdOn.toString().toLowerCase().includes(filter);
        } else if (type === 'action') {
            this.rolesDataSource.filterPredicate = (data, filter: any): boolean => data.action.toLowerCase().includes(filter);
        } else if (type === 'roleAssignedUser') {
            this.rolesDataSource.filterPredicate = (data, filter: any): boolean => data.roleAssignedUserId.toLowerCase().includes(filter);
        }

        if (this.rolesDataSource.paginator) {
            this.rolesDataSource.paginator.firstPage();
        }
    }

    close = (): void => {
    }

    editPermission = (row): void => {
        const data = row;
        console.log('edit: ', data);
    }

    copyPermission = (row): void => {
        const data = row;
        console.log('copy: ', data);
    }

    activateUser = (row): void => {
        const data = row;
        console.log('activate: ', data);
    }

    roleCreateUpdatePopup = (roleRef?: any) => {
        if (roleRef) {
            this.dialog.open(RoleCreateUpdateComponent, {
                height: 'auto',
                width: '70%',
                data: roleRef,
                disableClose: true
            });
        } else {
            this.dialog.open(RoleCreateUpdateComponent, {
                height: 'auto',
                width: '70%',
                disableClose: true
            });
        }
    }

    openPermissionConfiguration = (role: any) => {
        this.dialog.open(PermissionCreateUpdateComponent, {
            height: '90%',
            width: '95%',
            data: role,
            disableClose: true
        })
    }

    deleteConfirmation = (roleId: string) => {
        this.dialog.open(RoleConfirmationComponent, {
            height: 'auto',
            width: '50%',
            data: roleId,
            disableClose: true
        });
    }

    ngOnDestroy(): void {
        if (this.roleSubscriptions && this.roleSubscriptions.length > 0) {
            this.roleSubscriptions.forEach(r => r.unsubscribe());
        }
    }
}
