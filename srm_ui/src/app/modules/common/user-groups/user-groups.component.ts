/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AfterViewInit, Component, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserGroupsOverlayComponent } from './user-groups-overlay/user-groups-overlay.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserGroupService } from '../../../shared/Services/user-groups.service';
import { UserService } from '../../../shared/Services/user.service';
import { TYPE } from '../../../shared/enums/toast.enum';
import { ToastService } from '../../../shared/Services/toast.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'user-groups',
    templateUrl: './user-groups.component.html',
    styleUrls: ['./user-groups.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class UserGroupsComponent implements OnInit, AfterViewInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        'userGroup',
        'description',
        'companyCode',
        'createdBy',
        'createdOn',
        'isActive',
        'edit',
        'copy',
        'active',
        'adduser',
    ];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    newUser: any[] = [];
    name: string;
    description: any;
    date: any;
    create: any;
    isChecked = false;
    userList$: any;
    value = '';

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute,
        private userGroupService: UserGroupService,
        private userService: UserService,
        private toastService: ToastService,
        private datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.fetchUsers();
        this.triggerOnFetch();
    }

    triggerOnFetch = () => {
        this.userGroupService.afterSaveUpdate.subscribe((res) => {
            if (res) {
                this.fetchUserGroups();
            }
        });
    };

    /** method for paginator */
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    fetchUserGroups = () => {
        this.userGroupService.fetchUserGroups().subscribe({
            next: (serviceRes: any) => {
                this.dataSource.data = serviceRes;
            }
        });
    };

    fetchUsers = () => {
        this.userService.fetchUsers().subscribe({
            next: (usersList: any) => {
                this.userList$ = usersList;
                this.fetchUserGroups();
            },
            error: (error: any) => {
                console.log(error);
            }
        });
    };

    getUser = (userId: string) => this.userList$.find(x => x.user_id === userId)?.name;

    /** method for open the overlay for create a group */
    createGroup(dataRow?: any) {
        if (dataRow) {
            const dialogRef = this.dialog.open(UserGroupsOverlayComponent, {
                data: { screen: 'create', dataRow: { ...dataRow } },
                disableClose: true
            });
            dialogRef.addPanelClass('inline-md-overlay');
        } else {
            const dialogRef = this.dialog.open(UserGroupsOverlayComponent, {
                data: { screen: 'create' },
                disableClose: true
            });
            dialogRef.addPanelClass('inline-md-overlay');
        }
    }

    onToggleChange = (row: any, event: any) => {
        row.isActive = event.checked;
        console.log(event);

        this.userGroupService.updateUserGroup(row).subscribe({
            next: (serviceRes: any) => {
                this.toastService.showToast(TYPE.SUCCESS, true, 'Status updated successfully.');
                this.fetchUserGroups();
            }
        });
    };

    /** Method for open view users popup */
    viewUser(row, i): void {
        const dialogRef = this.dialog.open(UserGroupsOverlayComponent, {
            width: '100%',
            height: 'auto',
            data: { screen: 'view', source: row },
            disableClose: true
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => {
            if (result && (result.gname !== row.name || result.des !== row.description)) {
                const source = 'XITRICON';
                const date = row.date;
                const user = row.create;

                const newRow = {
                    name: result.gname,
                    description: result.des,
                    source: source,
                    create: user,
                    date: date,
                };

                this.dataSource.data.splice(i, 1, newRow);
                const newData = this.dataSource.data;
                this.dataSource = new MatTableDataSource(newData);

            }
        });
    }

    /** Method for open add users popup */
    addUser(row): void {
        const dialogRef = this.dialog.open(UserGroupsOverlayComponent, {
            width: '100%',
            height: 'auto',
            data: { screen: 'add', source: row },
            disableClose: true
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => { });
    }

    cloneUserGroup = (row: any) => {
        this.userGroupService.cloneUserGroup(row.userGroup).subscribe({
            next: (serviceRes: any) => {
                this.toastService.showToast(TYPE.SUCCESS, true, 'Cloned Successfully.');
                this.fetchUserGroups();
            }
        });
    };
    resetFilters(): void {
        this.filterChange('', '');
    }

    filterChange = (type, event): void => {
        debugger;
        let value = '';
        if (type === 'createdOn') {
            value = this.datePipe.transform(event.target.value, 'yyyy-MM-dd');
            //value = moment(event).format('DD-MMM-YYYY');
        } else {
            value = event ? event.target.value.trim().toLowerCase() : '';
        }

        const filterValue = value;

        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (type === 'userGroup') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.userGroup.toLowerCase().includes(filter);
        } else if (type === 'description') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.description.toLowerCase().includes(filter);
        } else if (type === 'companyCode') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.companyCode.toLowerCase().includes(filter);
        } else if (type === 'createdBy') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.createdBy.toLowerCase().includes(filter);
        } else if (type === 'createdOn') {
            this.dataSource.filterPredicate = (data, filter: any): boolean => data.createdOn.toLowerCase().includes(filter);
        }

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    };

}
