import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLinkWithHref } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { LocalStorageService } from 'app/shared/Services/local-storage.service';
import { FormControl } from '@angular/forms';
import { RolesService } from 'app/shared/Services/roles.service';
import { result, take } from 'lodash';
import { resourceLimits } from 'worker_threads';
export interface ReviewForm {
    isActive: number;
    isActiveBoolean: boolean;
    id: string;
    name: string;
    status: string;
    createdUser: string;
    createdUserRole: string;
    submittedDate: string;
    userRole: any;
}
@Component({
    selector: 'form-landing',
    templateUrl: './form-landing.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class FormLandingComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    displayedColumns: string[] = [
        'id',
        'name',
        'status',
        'createdUser',
        'createdUserRole',
        'submittedDate',
        'publishedDate',
        'actions',
        'isActive',
    ];
    dataSource: MatTableDataSource<ReviewForm>;
    userRole: any;

    filterValues = {
        id: '',
        name: '',
        status: '',
        createdUser: '',
        createdUserRole: '',
        submittedDate: '',
    };
    idFilter = new FormControl('');
    nameFilter = new FormControl('');
    statusFilter = new FormControl('');
    createdUserFilter = new FormControl('');
    createdUserRoleFilter = new FormControl('');
    submittedDateFilter = new FormControl('');

    constructor(
        private http: HttpClient,
        private router: Router,
        private localStorageService: LocalStorageService,
        private rolesService: RolesService
    ) {

    }

    ngOnInit(): void {
        this.roleListner();
        this.http
            .get(environment.nodeurl + '/api/supplier/reviewForms')
            .subscribe((data: ReviewForm[]) => {
                if (data) {
                    data.forEach((obj) => {
                        if (obj.isActive == 1) {
                            obj.isActiveBoolean = true;
                        }
                        if (obj.isActive == 0) {
                            obj.isActiveBoolean = false;
                        }
                    });
                    data.sort((a, b) => Number(b.id) - Number(a.id));
                    this.dataSource = new MatTableDataSource<ReviewForm>(data);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.dataSource.filterPredicate = this.createFilter();
                }
            });
        this.idFilter.valueChanges.subscribe((id) => {
            this.filterValues.id = id.trim().toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.nameFilter.valueChanges.subscribe((name) => {
            this.filterValues.name = name.trim().toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.statusFilter.valueChanges.subscribe((status) => {
            this.filterValues.status = status.trim().toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.statusFilter.valueChanges.subscribe((status) => {
            this.filterValues.status = status.trim().toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.createdUserFilter.valueChanges.subscribe((createdUser) => {
            this.filterValues.createdUser = createdUser.trim().toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.createdUserRoleFilter.valueChanges.subscribe((createdUserRole) => {
            this.filterValues.createdUserRole = createdUserRole
                .trim()
                .toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
        this.submittedDateFilter.valueChanges.subscribe((submittedDate) => {
            this.filterValues.submittedDate = submittedDate
                .trim()
                .toLowerCase();
            this.dataSource.filter = JSON.stringify(this.filterValues);
        });
    }

    createFilter(): (data: any, filter: string) => boolean {
        let filterFunction = function (data, filter): boolean {
            let searchTerms = JSON.parse(filter);
            return (
                data.id.toString().toLowerCase().indexOf(searchTerms.id) !==
                -1 &&
                data.name.toLowerCase().indexOf(searchTerms.name) !== -1 &&
                data.status.toLowerCase().indexOf(searchTerms.status) !== -1 &&
                data.createdUser
                    .toLowerCase()
                    .indexOf(searchTerms.createdUser) !== -1 &&
                data.createdUserRole
                    .toLowerCase()
                    .indexOf(searchTerms.createdUserRole) !== -1 &&
                data.submittedDate
                    .toLowerCase()
                    .indexOf(searchTerms.submittedDate) !== -1
            );
        };
        return filterFunction;
    }

    roleListner = () => {
        const role = localStorage.getItem("userrole");
        this.userRole = role;
    };

    goToReview(formId?: any): void {
        if (formId) {
            this.localStorageService.removeItem('formId');
            this.router.navigate(['/form-builder/review-form/' + formId]);
        } else {
            this.localStorageService.removeItem('formId');
            this.localStorageService.removeItem('form-builder-data');
            this.localStorageService.removeItem('builder-form');
            this.router.navigate(['/form-builder/review-form']);
        }
    }
    isFormActive(row) {
        if (row.isActive == 1) {
            return true;
        }
        return false;
    }
    onToggleChange = (row: any, event: any) => {
        if (event.checked) {
            row.isActive = 1;
        } else {
            row.isActive = 0;
        }

        this.http
            .post(environment.nodeurl + '/api/supplier/SaveReviewForm', row)
            .subscribe((data: ReviewForm[]) => { });
    };
}
