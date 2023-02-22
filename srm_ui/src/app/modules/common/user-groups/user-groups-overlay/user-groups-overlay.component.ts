/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AfterViewInit, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    MatDialog,
    MatDialogRef,
    MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AuthService, User } from '@auth0/auth0-angular';
import { TYPE } from '../../../../shared/enums/toast.enum';
import { ToastService } from '../../../../shared/Services/toast.service';
import { UserGroupService } from '../../../../shared/Services/user-groups.service';
import { SrmUserService } from 'app/shared/Services/srm-user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';

export interface Table {
    name: string;
    userName: string;
    emailAddress: string;
}
@Component({
    selector: 'user-groups-overlay',
    templateUrl: './user-groups-overlay.component.html',
    encapsulation: ViewEncapsulation.None,
})

export class UserGroupsOverlayComponent implements OnInit, AfterViewInit {

    @ViewChild('userGroupViewPaginator') userGroupViewPaginator: MatPaginator;
    @ViewChild('userGroupViewSort') userGroupViewSort: MatSort;
    @ViewChild('selectedUserPaginator') selectedUserPaginator: MatPaginator;
    @ViewChild('selectedUserSort') selectedUserSort: MatSort;
    @ViewChild('dataSourcePaginator') dataSourcePaginator: MatPaginator;
    @ViewChild('dataSourceSort') dataSourceSort: MatSort;

    dataSource: MatTableDataSource<Table>;
    selectedUserDataSource: MatTableDataSource<Table>;
    userGroupView: MatTableDataSource<Table>;

    source: any;
    name: string;
    id: string;
    row: {};
    gname: string = '';
    des: string = '';
    exUser: string = '';
    checksource: string = 'xitricon';
    RowData2: any;
    src: string;
    isChecked = false;
    userProfileInformation: User;
    existingData: any;


    userColumns = ['select', 'userName', 'emailAddress', 'name', 'isActive'];
    selectedUserColumns = ['userName', 'emailAddress', 'name', 'isActive'];
    viewUserColumns = ['userName', 'emailAddress', 'name', 'isActive', 'delete'];

    abpUsers: any;
    selectedUsers: any[] = [];
    viewSelectedUsers: any[] = [];
    fetchedUsersGroupInfo: any = {};

    creategroupScreen: boolean;
    viewScreen: boolean;
    adduserScreen: boolean;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data,
        public dialogRef: MatDialogRef<UserGroupsOverlayComponent>,
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private _fuseConfirmationService: FuseConfirmationService,
        private toastService: ToastService,
        private userGroupService: UserGroupService,
        private authService: AuthService,
        private srmUserService: SrmUserService,
        private datePipe: DatePipe
    ) {
        this.source = data.source;
        this.gname = this.source ? this.source.name : '';
        this.des = this.source ? this.source.description : '';
        this.selectedUserDataSource = new MatTableDataSource();
        this.userGroupView = new MatTableDataSource();
    }



    ngOnInit() {
        this.creategroupScreen = this.data.screen === 'create' ? true : false;
        this.viewScreen = this.data.screen === 'view' ? true : false;
        this.adduserScreen = this.data.screen === 'add' ? true : false;
        this.existingData = this.data.source;
        this.patchExistingData();
        this.fetchProfileInformation();
    }

    ngAfterViewInit() {

    }

    patchExistingData = () => {
        if (this.existingData) {
            this.gname = this.existingData.userGroup;
            this.checksource = this.existingData.companyCode === 'XITRICON' ? 'xitricon' : 'ifs';
            this.des = this.existingData.description;
            this.isChecked = this.existingData.isActive;
        }
    };

    fetchProfileInformation = () => {
        this.authService.user$.subscribe((user: User) => {
            if (user) {
                this.userProfileInformation = user;
                this.fetchUsers();
            }
        }, (error) => {
            console.log(error);
        });
    };

    fetchUsers = () => {
        this.srmUserService.fetchAbpUsers().subscribe((serviceRes) => {
            if (serviceRes) {
                this.abpUsers = serviceRes;
                this.dataSource = new MatTableDataSource(this.abpUsers);
                this.dataSource.paginator = this.dataSourcePaginator;
                this.dataSource.sort = this.dataSourceSort;
                this.fetchUserGroupDetails();
            }
        });
    };

    fetchUserGroupDetails = () => {
        this.userGroupService.getUserGroupInfo().subscribe((serviceRes: any) => {
            if (serviceRes) {
                const result = serviceRes.find(x => x.groupId === this.source.id);
                this.fetchedUsersGroupInfo = JSON.parse(result.userIds);
                const filteredUsers = this.abpUsers.filter(x => this.fetchedUsersGroupInfo.includes(x.emailAddress));
                this.viewSelectedUsers = filteredUsers;
                this.userGroupView = new MatTableDataSource(filteredUsers);
                this.userGroupView.paginator = this.userGroupViewPaginator;
                this.userGroupView.sort = this.userGroupViewSort;
            }
        });
    };

    onUserSelection = (user, event) => {
        user['selected'] = event.checked;
        const index = this.selectedUsers.findIndex(x => x.id === user.id);
        if (event.checked) {
            this.selectedUsers.push(user);
        } else {
            this.selectedUsers.splice(index, 1);
        }
        this.selectedUserDataSource = new MatTableDataSource(this.selectedUsers);
        this.selectedUserDataSource.paginator = this.selectedUserPaginator;
        this.selectedUserDataSource.sort = this.selectedUserSort;
    };

    addUserGroup = () => {

        if (this.viewSelectedUsers && this.viewSelectedUsers.length > 0) {
            this.viewSelectedUsers.concat(this.selectedUsers);
            this.selectedUsers = [... this.viewSelectedUsers];
        }
        // selectedUsers.filter((user, index, array) => array.findIndex(t => t.color == tag.color && t.label == tag.label) == index);


        const uniqueAddresses = Array.from(new Set(this.selectedUsers.map(a => a.emailAddress)))
            .map(emailAddress => {
                return this.selectedUsers.find(a => a.emailAddress === emailAddress)
            })

        debugger

        const payload: any = {
            userIds: JSON.stringify(uniqueAddresses.map(x => x.emailAddress)),
            groupId: this.source.id,
            department: 'TODO.',
            isActive: true,
            createdBy: this.userProfileInformation.sub,
            createdOn: new Date()
        };

        this.userGroupService.saveUserGroupInfo(payload).subscribe((res) => {
            if (res) {
                this.toastService.showToast(TYPE.SUCCESS, true, 'Record submitted successfully.');
            }
        }, (error) => {
            console.log(error);
        });
    };

    addMember() {
        this.creategroupScreen = false;
        this.viewScreen = false;
        this.adduserScreen = true;
        if (this.abpUsers) {
            this.fetchUsers();
        }
    }

    doAction() {
        this.dialogRef.close();
    }

    removeCart = (row) => {
        const index = this.viewSelectedUsers.findIndex(x => x.emailAddress === row.emailAddress);
        this.viewSelectedUsers.splice(index, 1);
        this.userGroupView = new MatTableDataSource(this.viewSelectedUsers);
        this.userGroupView.paginator = this.userGroupViewPaginator;
        this.userGroupView.sort = this.userGroupViewSort;
        this.selectedUsers = this.viewSelectedUsers;
    };

    removeCart1(row) {
        // this.dataSource.data.splice(row, 1);
        // this.dataSource = new MatTableDataSource(this.users2);
    }

    confirmCreateGroup() {
        const dialogRef = this._fuseConfirmationService.open({
            title: 'Confirm',
            message:
                'Are you sure you want to create Group named "' +
                this.gname +
                '"',
            icon: {
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn',
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Yes',
                    color: 'warn',
                },
                cancel: {
                    show: true,
                    label: 'No',
                },
            },
            dismissible: true,
        });
        dialogRef.addPanelClass('confirmation-dialog');
        dialogRef.afterClosed().subscribe((result) => {
            this.src = this.checksource === 'xitricon' ? 'XITRICON' : 'IFS';

            if (result === 'confirmed') {
                if (this.gname && this.src) {

                    if (this.existingData) {
                        this.existingData.userGroup = this.gname;
                        this.existingData.companyCode = this.src;
                        this.existingData.description = this.des;
                        this.existingData.isActive = this.isChecked;
                        this.existingData.updatedBy = this.userProfileInformation?.sub;
                        this.existingData.updatedOn = new Date();

                        this.userGroupService.updateUserGroup(this.existingData).subscribe({
                            next: (serviceRes: any) => {
                                this.toastService.showToast(TYPE.SUCCESS, true, 'User group successfully updated.');
                                this.userGroupService.afterSaveUpdate.emit(true);
                                this.dialogRef.close(serviceRes);
                            }
                        });
                    } else {
                        const data = {
                            userGroup: this.gname,
                            companyCode: this.src,
                            description: this.des,
                            isActive: this.isChecked,
                            createdBy: this.userProfileInformation.sub,
                            createdOn: new Date(),
                        };

                        this.userGroupService.saveUserGroup(data).subscribe({
                            next: (serviceRes: any) => {
                                this.toastService.showToast(TYPE.SUCCESS, true, 'User group successfully created.');
                                this.userGroupService.afterSaveUpdate.emit(true);
                                this.dialogRef.close(data);
                            }
                        });
                    }
                } else {
                    this.toastService.showToast(TYPE.ERROR, true, 'Please check the form again.');
                }
            } else {
                this.dialogRef.close('noGroup');
            }
        });
    }

    // Filter the data table
    filterChange(type, tblName, event): void {
        let value = '';

        value = event ? event.target.value.trim().toLowerCase() : '';

        const filterValue = value;

        if (tblName === 'user') {
            this.userGroupView.filter = filterValue.trim().toLowerCase();
        } else if (tblName === 'selected') {
            this.selectedUserDataSource.filter = filterValue.trim().toLowerCase();
        } else if (tblName === 'dt') {
            this.dataSource.filter = filterValue.trim().toLowerCase();
        }


        if (type === 'userName' && tblName === 'user') {
            this.userGroupView.filterPredicate = (data, filter: any): boolean => data.userName.toString().toLowerCase().includes(filter);
        } else if (type === 'emailAddress' && tblName === 'user') {
            this.userGroupView.filterPredicate = (data, filter: any): boolean => data.emailAddress.toString().toLowerCase().includes(filter);
        } else if (type === 'name' && tblName === 'user') {
            this.userGroupView.filterPredicate = (data, filter: any): boolean => data.name.toLowerCase().includes(filter);
        } else if (type === 'userName' && tblName === 'selected') {
            this.selectedUserDataSource.filterPredicate = (data, filter: any): boolean => data.userName.toLowerCase().includes(filter);
        } else if (type === 'emailAddress' && tblName === 'selected') {
            this.selectedUserDataSource.filterPredicate = (data, filter: any): boolean => data.emailAddress.toString().toLowerCase().includes(filter);
        } else if (type === 'name' && tblName === 'selected') {
            this.selectedUserDataSource.filterPredicate = (data, filter: any): boolean => data.name.toString().toLowerCase().includes(filter);
        } else if (type === 'userName' && tblName === 'dt') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.userName.toString().toLowerCase().includes(filter);
        } else if (type === 'emailAddress' && tblName === 'dt') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.emailAddress.toString().toLowerCase().includes(filter);
        } else if (type === 'name' && tblName === 'dt') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.name.toString().toLowerCase().includes(filter);
        }

        if (tblName === 'user' && this.userGroupView.paginator) {
            this.userGroupView.paginator.firstPage();
        } else if (tblName === 'selected') {
            this.selectedUserDataSource.paginator.firstPage();
        } else if (tblName === 'dt') {
            this.dataSource.paginator.firstPage();
        }

    }

    //reset filters/data
    resetFilters(): void {
        this.filterChange('', '', '');
    }
}

