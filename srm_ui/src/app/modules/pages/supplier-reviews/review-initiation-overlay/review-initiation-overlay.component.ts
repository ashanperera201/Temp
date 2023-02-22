/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { ReviewInitiationSummaryOverlayComponent } from '../review-initiation-summary-overlay/review-initiation-summary-overlay.component';
import { SelectionModel } from '@angular/cdk/collections';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { UserGroupService } from '../../../../shared/Services/user-groups.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import {
    ReviewForm,
    Supplier,
    User,
    UserRole,
} from '../supplier-review-models';
import { map, startWith } from 'rxjs/operators';
import { DataService } from '../supplier-review-data.service';

@Component({
    selector: 'review-initiation',
    templateUrl: './review-initiation-overlay.component.html',
    styleUrls: ['./review-initiation-overlay.scss'],

})
export class ReviewInitiationOverlayComponent implements OnInit {
    @ViewChild('errorDialog') errorDialog: TemplateRef<any>;

    columns = [
        {
            columnDef: 'id',
            header: 'Id',
            cell: (element: User) => `${element.id}`,
        },
        {
            columnDef: 'name',
            header: 'Name',
            cell: (element: User) => `${element.name}`,
        },
        {
            columnDef: 'email',
            header: 'Email',
            cell: (element: User) => `${element.email}`,
        },
        {
            columnDef: 'department',
            header: 'Department',
            cell: (element: User) => `${element.department}`,
        },
    ];

    columns1 = [
        {
            columnDef: 'name',
            header: 'Name',
            cell: (element: UserRole) => `${element.name}`,
        },
    ];

    columns2 = [
        {
            columnDef: 'supplierID',
            header: 'Supplier ID',
            cell: (element: Supplier) => `IMI-${new Date(element.regDate).getFullYear()}-${element.supplierID}`,
        },
        {
            columnDef: 'supplierName',
            header: 'Supplier name',
            cell: (element: Supplier) => `${element.supplierName}`,
        },
        {
            columnDef: 'supplierType',
            header: 'Supplier type',
            cell: (element: Supplier) => `${element.supplierType}`,
        },
        {
            columnDef: 'supplierCode',
            header: 'IFS code ',
            cell: (element: Supplier) => `${element.supplierCode}`,
        },
    ];

    displayedColumns = this.columns.map(c => c.columnDef);
    displayedColumns1 = this.columns1.map(c => c.columnDef);
    displayedColumns2 = this.columns2.map(c => c.columnDef);

    [x: string]: any;

    //general
    editSession = 0;
    scoredReview = true;
    createdStatus = true;
    dialogTitle = 'Review Session Initiation';
    issuccess = false;
    iserror = false;
    errorText = '';
    session;
    reviewInitiationForm: FormGroup;
    validationErrorDialog: any;

    //review Form
    reviewForms: ReviewForm[];
    allReviewForms: ReviewForm[];
    reviewFormByName = new Map<string, ReviewForm>();
    filteredReviewForms: Observable<ReviewForm[]>;
    scoreForms = {};
    formSelection: string = '';

    //users and userroles
    pageSize = 10;
    page = 1;
    allUsers: MatTableDataSource<User>;
    usersControl = new FormControl();
    selectedUsers = new SelectionModel<User>(true, []);
    selectedUsersInitial = new SelectionModel<User>(true, []);
    allUserRoles: MatTableDataSource<UserRole>;
    userRolesControl = new FormControl();
    selectedUserRolesInitial = new SelectionModel<UserRole>(true, []);
    selectedUserRoles = new SelectionModel<UserRole>(true, []);
    usersAssignMethod = SupplierReviewConstants.usersAssignMethod;
    userRolesAssignMethod = SupplierReviewConstants.userRolesAssignMethod;
    assignMethodSelection: string;
    userGroupDetails = [];


    //suppliers
    allSuppliers: MatTableDataSource<Supplier>;
    suppliersControl = new FormControl();
    selectedSuppliers = new SelectionModel<Supplier>(true, []);

    //time period
    monthlyScheduleFrequency = SupplierReviewConstants.monthlyScheduleFrequency;
    reviewYears = ['2022', '2021', '2020', '2019', '2018'];
    presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
    customTypePeriod = SupplierReviewConstants.customTypePeriod;
    periodSelection: string;
    presetPeriods = [
        {
            period: 'Q1 (Jan - March)',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2022-03-31'),
        },
        {
            period: 'Q2 (Apr - Jun)',
            startDate: new Date(),
            endDate: new Date(),
        }, // start date and end date are not needed for preset periods
        {
            period: 'Q3 (Jul - Sep)',
            startDate: new Date(),
            endDate: new Date(),
        },
        {
            period: 'Q4 (Oct - Dec)',
            startDate: new Date(),
            endDate: new Date(),
        },
        {
            period: 'H1 (Jan - Jun)',
            startDate: new Date(),
            endDate: new Date(),
        },
        {
            period: 'H2 (Jul - Dec)',
            startDate: new Date(),
            endDate: new Date(),
        },
        {
            period: 'Year (Jan - Dec)',
            startDate: new Date(),
            endDate: new Date(),
        },
        {
            period: 'Semi Annually',
            startDate: new Date(),
            endDate: new Date(),
        },
        {
            period: 'Bi Annually ',
            startDate: new Date(),
            endDate: new Date(),
        },
    ];
    today = new Date();
    allUser = 'allUser';
    allRoles = 'allRoles';
    allSupplier = 'allSupplier';
    selectedTableUser: any;
    selectedTableRoles: any;
    selectedTableSupplier: any;
    public selectedIndex: number = 0;

    // grading
    gradingMethodA = SupplierReviewConstants.gradingMethodA;
    gradingMethodB = SupplierReviewConstants.gradingMethodB;
    gradingMethodC = SupplierReviewConstants.gradingMethodC;
    gradingMethodD = SupplierReviewConstants.gradingMethodD;
    descriptionMethodA = SupplierReviewConstants.descriptionMethodA;
    descriptionMethodB = SupplierReviewConstants.descriptionMethodB;
    descriptionMethodC = SupplierReviewConstants.descriptionMethodC;
    descriptionMethodD = SupplierReviewConstants.descriptionMethodD;
    gradingMethodSelection = SupplierReviewConstants.gradingMethodA;
    notRecommendedOutcome = SupplierReviewConstants.notRecommendedOutcome;
    recommendedOutcome = SupplierReviewConstants.recommendedOutcome;

    // tab names
    evaluationNameTab = SupplierReviewConstants.evaluationNameTab;
    formTab = SupplierReviewConstants.formTab;
    userTab = SupplierReviewConstants.userTab;
    timeTab = SupplierReviewConstants.timeTab;
    supplierTab = SupplierReviewConstants.supplierTab;
    gradingMethodTab = SupplierReviewConstants.gradingMethodTab;
    gradeCategoriesTab = SupplierReviewConstants.gradeCategoriesTab;
    reviewCreatedState = SupplierReviewConstants.reviewCreatedState;
    allData: any[];
    materialTypeForm = SupplierReviewConstants.materialTypeForm;
    serviceTypeForm = SupplierReviewConstants.serviceTypeForm;
    commonTypeForm = SupplierReviewConstants.commonTypeForm;

    selectedAllUser = new SelectionModel<User>(true, []);
    allServices: string[] = [this.materialTypeForm, this.serviceTypeForm, this.commonTypeForm];

    formTabDisabled: boolean = true;
    userTabDisabled: boolean = true;
    timeTabDisabled: boolean = true;
    supplierTabDisabled: boolean = true;
    gradingTabDisabled: boolean = true;
    gradeTabDisabled: boolean = true;
    formType: any;

    goBack: boolean = false;
    showUpperBoundError: boolean = false;
    showLowerBoundError: boolean = false;
    ShowBoundCount = 1;
    showBoundError= [] ;

    selectedUsersShow: boolean = false;
    selectedUserRolesShow: boolean = false;
    selectedSuppliersShow: boolean = false;

    reviewFormBySelect: string = '';
    reviewFormByInit: string = '';
    reviewFormBySelectId: string = null;
    reviewFormByInitId: string = null;

    isLoading: boolean = false;

    constructor(
        private http: HttpClient,
        public dialogRef: MatDialogRef<ReviewInitiationOverlayComponent>,
        public dialog: MatDialog,
        private fb: FormBuilder,
        public datepipe: DatePipe,
        private userGroupService: UserGroupService,
        private dataService: DataService
    ) {

        this.isLoading = true;
        this.requestDataFromMultipleSources().subscribe((responseList) => {
            this.allData = responseList;
            this.allUsers = new MatTableDataSource(this.allData[0]);
            this.userGroupDetails = this.allData[3];
            let userGroupsWithUsers = [];
            this.userGroupDetails.forEach((userGroupUser)=>{
                if (!userGroupsWithUsers.includes(userGroupUser.groupId)){
                    userGroupsWithUsers.push(userGroupUser.groupId);
                }
            })
            this.allData[1]?.sort((a, b) =>
                a.supplierName.localeCompare(b.supplierName));
            this.allData[1] = this.allData[1].filter(obj => {
                return obj.status != 'blocked';
            });
            this.allData[1] = this.allData[1].filter(obj => {
                return obj.supplierCode != '';
            });
            this.allSuppliers = new MatTableDataSource(this.allData[1]);
            const userGroups = [];
            this.allData[2].forEach((userGroup) => {
                if (userGroup.isActive==true && userGroupsWithUsers.includes(userGroup.id)){
                    var userRole: UserRole = {
                        id: userGroup.id,
                        name: userGroup.userGroup
                    };
                    userGroups.push(userRole);
                }
            });

            this.isLoading = this.editSession === 0 ? false : true;

            this.allUserRoles = new MatTableDataSource<UserRole>(userGroups);
            if (this.editSession === 1) {

                this.dialogTitle = 'Review Session Edit';
                this.formTabDisabled = false;
                this.userTabDisabled = false;
                this.timeTabDisabled = false;
                this.supplierTabDisabled = false;
                this.gradingTabDisabled = false;
                this.gradeTabDisabled = false;
                this.scoredReview = this.session.scored;
                var assignedUsers = this.session.assignedUsers;
                const index = this.dataService.sessionNames.indexOf(this.session.evaluationName, 0);
                if (index > -1) {
                    this.dataService.sessionNames.splice(index, 1);
                }
                assignedUsers = this.allUsers.data.filter(function (user) {
                    return assignedUsers.includes(user.name);
                });
                assignedUsers = new MatTableDataSource<User>(assignedUsers);
                assignedUsers.data.forEach(row =>
                    this.selectedUsers.select(row)
                );
                assignedUsers.data.forEach(row =>
                    this.selectedUsersInitial.select(row)
                );

                var assignedUserRoles = this.session.assignedUserRoles;
                assignedUserRoles = this.allUserRoles.data.filter(function (
                    userRole
                ) {
                    return assignedUserRoles.includes(userRole.name);
                });
                assignedUserRoles = new MatTableDataSource<UserRole>(
                    assignedUserRoles
                );
                assignedUserRoles.data.forEach(row =>
                    this.selectedUserRoles.select(row)
                );
                assignedUserRoles.data.forEach(row =>
                    this.selectedUserRolesInitial.select(row)
                );

                var suppliers = this.session.suppliers;
                suppliers = this.allSuppliers.data.filter(function (supplier) {
                    return suppliers.includes(supplier.supplierID);
                });
                suppliers = new MatTableDataSource<User>(suppliers);
                suppliers.data.forEach(row =>
                    this.selectedSuppliers.select(row)
                );

                this.selectedTableSupplier = suppliers.data;


                if (typeof this.session.gradeCategories === 'string') {
                    var formGroups = [];
                    JSON.parse(this.session.gradeCategories).forEach((x) => {
                        formGroups.push(this.fb.group(x));
                    });
                    this.session.gradeCategories = this.fb.array(formGroups);
                }

                if (typeof this.session.reviewerWeights === 'string') {
                    var formGroups = [];
                    JSON.parse(this.session.reviewerWeights).forEach((x) => {
                        formGroups.push(this.fb.group(x));
                    });
                    this.session.reviewerWeights =
                        this.fb.array(formGroups);
                }


                this.session.startDate = moment(
                    this.session.startDate,
                    'DD/MM/YYYY 12:00:00 AM'
                ).toDate();
                this.session.endDate = moment(
                    this.session.endDate,
                    'DD/MM/YYYY 12:00:00 AM'
                ).toDate();

                this.http
                    .get(environment.nodeurl + '/api/supplier/reviewForms')
                    .subscribe((data: ReviewForm[]) => {
                        if (data) {
                            this.updateReviewFormData(data);
                            this.filterFormsByType(this.session.services);
                            this.session.formName = this.reviewForms.find(
                                reviewForm =>
                                    reviewForm.id === this.session.formId
                            ).name;

                            this.reviewInitiationForm = this.fb.group(
                                this.session
                            );
                            this.gradingMethodSelection =
                                this.reviewInitiationForm.value['gradingMethod'];
                            this.periodSelection =
                                this.reviewInitiationForm.value['periodType'];
                            this.assignMethodSelection =
                                this.reviewInitiationForm.value['assignType'];
                            this.switchRadio(this.reviewInitiationForm.value['assignType']);
                            this.isLoading = false;
                        }
                    });
            }
        });
    }

    public requestDataFromMultipleSources(): Observable<any[]> {
        const users = this.http.get(
            environment.nodeurl + '/api/workflow/users'
        );
        const suppliers = this.http.get(
            environment.nodeurl + '/api/supplier/allSuppliersTrunc'
        );
        const userRoles = this.userGroupService.fetchUserGroups();
        const userGroupInfo = this.userGroupService.getUserGroupInfo();
        // Observable.forkJoin (RxJS 5) changes to just forkJoin() in RxJS 6
        return forkJoin([users, suppliers, userRoles, userGroupInfo]);
    }

    updateReviewFormData(data) {
        this.reviewForms = data;
        this.reviewForms = this.reviewForms.filter(obj => obj.isActive == 1);

        if (true) {
            this.reviewForms.sort(function (a, b) {
                var textA = a.name.toUpperCase();
                var textB = b.name.toUpperCase();
                return textA < textB ? -1 : textA > textB ? 1 : 0;
            });
            this.reviewForms.forEach((element) => {
                const form = JSON.parse(element.form);
                this.scoreForms[element.id] = false;
                let suffix = ' (unscored)';
                form.forEach((section) => {
                    if (
                        this.scoreForms[element.id] === false &&
                        section.hasOwnProperty('enableScore') &&
                        section['enableScore'] == true
                    ) {
                        this.scoreForms[element.id] = true;
                        suffix = ' (scored)';
                    }
                });
                element.name = element.name + suffix;
                this.reviewFormByName.set(element.name, element);
                this.allReviewForms = this.reviewForms;
            });

            this.filteredReviewForms = this.reviewInitiationForm
                .get('formName')!
                .valueChanges.pipe(
                    startWith(''),
                    map(value => this._filter(value || ''))
                );
        }
    }
    ngOnInit(): void {
        this.reviewInitiationForm = this.fb.group({
            formName: '',
            reviewYear: this.reviewYears[0],
            evaluationName: '',
            gradingMethod: this.gradingMethodA,
            presetPeriod: '',
            periodType: null,
            startDate: new FormControl(),
            endDate: new FormControl(),
            assignType: this.usersAssignMethod,
            minGradeThreshold: 50,
            frequency: this.monthlyScheduleFrequency,
            scheduled: 0,
            supplierBlocker: false,
            //materials: false,
            services: '',
            scored: this.scoredReview,
            status: '',
            reviewerWeights: this.fb.array([]),
            gradeCategories: this.fb.array([
                this.fb.group({
                    category: [this.recommendedOutcome, Validators.required],
                    upperBound: [100, Validators.required],
                    lowerBound: [51, Validators.required],
                }),
                this.fb.group({
                    category: [this.notRecommendedOutcome, Validators.required],
                    upperBound: [50, Validators.required],
                    lowerBound: [1, Validators.required],
                }),
            ]),
        });
        if (this.editSession===0){
            this.http
            .get(environment.nodeurl + '/api/supplier/reviewForms')
            .subscribe((data: ReviewForm[]) => {
                if (data) {
                    this.updateReviewFormData(data);
                }
            });
        }
    }

    selectedRow(row): void {
        if (row.selected[0].tableName === 'allUser') {
            this.selectedUsers = row;
            this.selectedTableUser = this.selectedUsers.selected;
            this.selectedUsersShow = true;
        }
        if (row.selected[0].tableName === 'allRoles') {
            this.selectedUserRoles = row;
            this.selectedTableRoles = this.selectedUserRoles.selected;
            this.selectedUserRolesShow = true;
        }
        if (row.selected[0].tableName === 'allSupplier') {
            this.selectedSuppliers = row;
            this.selectedTableSupplier = this.selectedSuppliers.selected;
            this.selectedSuppliersShow = true;
        }
    }

    unselectedRow(row): void {
        if (row === 'allUser') { this.selectedUsers.clear(); this.selectedUsersShow = false; }
        if (row === 'allRoles') { this.selectedUserRoles.clear(); this.selectedUserRolesShow = false; }
        if (row === 'allSupplier') { this.selectedSuppliers.clear(); this.selectedSuppliersShow = false; }
    }

    filterFormsByType(formType) {
        this.reviewForms = this.allReviewForms.filter(obj => {
            return obj.formType.toLowerCase() === formType.toLowerCase();
        });
    };

    private _filter(value: string): ReviewForm[] {
        if (this.reviewForms && this.reviewForms.length > 0) {
            const filterValue = value.toLowerCase();

            return this.reviewForms.filter(option =>
                option.name.toLowerCase().includes(filterValue)
            );
        }
    }

    get gradeCategories() {
        return this.reviewInitiationForm.controls[
            'gradeCategories'
        ] as FormArray;
    }

    get reviewerWeights() {
        return this.reviewInitiationForm.controls[
            'reviewerWeights'
        ] as FormArray;
    }
    addGradeCategory() {
        const categoryForm = this.fb.group({
            category: ['', Validators.required],
            upperBound: ['', Validators.required],
            lowerBound: ['', Validators.required],
        });
        this.gradeCategories.push(categoryForm);
    }

    deleteGradeCategory(lessonIndex: number) {
        this.gradeCategories.removeAt(lessonIndex);
    }

    getReviewerWeights(selectedIndex) {
        for (var user of this.selectedUsers.selected) {
            if (
                !this.reviewerWeights
                    .getRawValue()
                    .map(item => item.reviewer)
                    .includes(user?.name)
            ) {
                const reviewerForm = this.fb.group({
                    reviewer: [user.name, Validators.required],
                    weight: [0, Validators.required],
                });
                this.reviewerWeights.push(reviewerForm);
            }
            this.reviewerWeights.getRawValue().forEach((reviewer, index) => {
                if (
                    !this.selectedUsers.selected.some(
                        e => e.name === reviewer.reviewer
                    )
                ) {
                    this.reviewerWeights.removeAt(index);
                }
            });
        }
        if (this.gradingMethodSelection !== this.gradingMethodB) {
            this.reviewerWeights.disable();
        }
        if (!this.validateGradingMethod()) {
            return;
        }

        if (selectedIndex === 2 && this.assignMethodSelection === 'users') {
            this.switchRadio('users');
        } else if (selectedIndex === 2 && this.assignMethodSelection === 'userroles') {
            this.switchRadio('userroles');
        }
    }

    enableReviewerWeights() {
        this.reviewerWeights.enable();
    }

    checkChangedForm(event) {
        this.scoredReview = this.scoreForms[event.value];
    }

    doAction() {
        this.dialogRef.close();
    }

    viewSummary() {
        if (!this.validateRequiredInputs()) {
            return;
        }
        if (!this.validateGradingMethod()) {
            return;
        }
        if (!this.validateGradeCategories()) {
            return;
        }
        if (this.reviewInitiationForm.value['reviewerWeights'] === undefined) {
            this.reviewInitiationForm.value['reviewerWeights'] = [];
        }
        this.reviewInitiationForm.value['startDate'] = this.datepipe.transform(
            this.reviewInitiationForm.value['startDate'],
            'yyyy-MM-dd'
        );
        this.reviewInitiationForm.value['endDate'] = this.datepipe.transform(
            this.reviewInitiationForm.value['endDate'],
            'yyyy-MM-dd'
        );
        if (this.periodSelection === this.presetTypePeriod) {
            this.reviewInitiationForm.value['startDate'] = new Date();
            this.reviewInitiationForm.value['endDate'] = new Date();
        }
        this.reviewInitiationForm.value['assignedUsersList'] = this.selectedUsers.selected.map(item => item.name);
        this.reviewInitiationForm.value['assignedUserRolesList'] = this.selectedUserRoles.selected.map(item => item.name);
        this.reviewInitiationForm.value['supplierList'] = this.selectedSuppliers.selected.map(item => item.supplierID);
        this.reviewInitiationForm.value['gradeCategoriesArray'] = this.reviewInitiationForm.value['gradeCategories'];
        this.reviewInitiationForm.value['reviewerWeightsArray'] = this.reviewInitiationForm.value['reviewerWeights'];

        this.reviewFormBySelectId = this.reviewFormBySelectId === null ? this.reviewInitiationForm.value['formId'] : this.reviewFormBySelectId;
        this.reviewFormByInitId = this.reviewFormByInitId === null ? this.reviewFormByName.get(this.reviewInitiationForm.value['formName']).id : this.reviewFormByInitId;

        this.reviewInitiationForm.value['formId'] = this.reviewFormByInitId;

        if (this.reviewInitiationForm.value['supplierBlocker'] == true) {
            this.reviewInitiationForm.value['supplierBlocker'] = 1;
        } else {
            this.reviewInitiationForm.value['supplierBlocker'] = 0;
        }
        if (this.reviewInitiationForm.value['services'] === '') {
            this.reviewInitiationForm.value['services'] = null;
        }
        if (this.scoredReview == true) {
            this.reviewInitiationForm.value['scored'] = 1;
        } else {
            this.reviewInitiationForm.value['scored'] = 0;
        }
        if (this.editSession === 0) {
            this.reviewInitiationForm.value['status'] = this.reviewCreatedState;
        }

        if (this.reviewInitiationForm.value['assignType'] === this.userRolesAssignMethod) {
            this.reviewInitiationForm.value['assignedUsersList'] = [];
            const users = [];
            this.reviewInitiationForm.value['assignedUserRolesList'].forEach((userRole) => {
                const userGroupId = this.allUserRoles.data.find(x => x.name === userRole).id;
                const result = this.userGroupDetails.find(x => x.groupId === userGroupId);
                const fetchedUsersGroupInfo = JSON.parse(result.userIds);
                const users3 = this.allUsers.data.filter(x => fetchedUsersGroupInfo.includes(x.email));
                users.push(users3.map(item => item.name));
            });
            if (users[0].length !== 0) {
                this.reviewInitiationForm.value['assignedUsersList'] = users.toString();
            }

        }
        debugger
        const dialogRef = this.dialog.open(
            ReviewInitiationSummaryOverlayComponent,
            { data: this.reviewInitiationForm, disableClose: true }
        );
        dialogRef.addPanelClass('inline-sm-overlay');
        const instance = dialogRef.componentInstance;
        instance.editSession = this.editSession;
        dialogRef.afterClosed().subscribe((result) => {
            if (instance.issuccess) {
                this.dialogRef.close();
                window.location.reload();
            }
        });
    }

    validateRequiredInputs() {
        if (this.reviewInitiationForm.value['evaluationName'] === '') {
            this.errorText = 'Specify evaluation name';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (
            this.reviewInitiationForm.value['services'] === ''
        ) {
            this.errorText =
                'Specify whether this evaluation is for materials/services';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }

        this.reviewFormBySelect = this.reviewFormBySelect === '' ? this.reviewFormByName.get(this.reviewInitiationForm.value['formName']).formType.toLowerCase() : this.reviewFormBySelect;
        this.reviewFormByInit = this.reviewFormByInit === '' ? this.reviewInitiationForm.value['services'].toLowerCase() : this.reviewFormByInit;

        if (this.reviewFormBySelect !== this.reviewFormByInit) {
            this.errorText =
                'Selected review form does not belong to selected evaluation type';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }

        if (this.dataService?.sessionNames?.includes(this.reviewInitiationForm.value['evaluationName'])) {
            this.errorText =
                'Evaluation name already exists';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return;
        }
        if (this.reviewInitiationForm.value['formName'] === '') {
            this.errorText = 'Specify evaluation form';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.reviewInitiationForm.value['periodType'] === undefined) {
            this.errorText = 'Specify review period';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }

        if (
            this.reviewInitiationForm.value['periodType'] ===
            this.customTypePeriod &&
            (this.reviewInitiationForm.value['startDate'] === null ||
                this.reviewInitiationForm.value['endDate'] === null)
        ) {
            this.errorText = 'Set date range';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (
            this.reviewInitiationForm.value['periodType'] ===
            this.customTypePeriod &&
            this.reviewInitiationForm.value['startDate'].getTime() ===
            this.reviewInitiationForm.value['endDate'].getTime()
        ) {
            this.errorText = 'Start date and end date cannot be the same';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (
            this.reviewInitiationForm.value['periodType'] ===
            this.presetTypePeriod &&
            this.reviewInitiationForm.value['presetPeriod'] === ''
        ) {
            this.errorText = 'Set preset period';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.selectedUsers.isEmpty() && this.selectedUserRoles.isEmpty()) {
            this.errorText = 'Select atleast 1 reviewer/ group';
            document.getElementById('reviewer').style.color = "Red";
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.selectedSuppliers.isEmpty()) {
            this.errorText = 'Select atleast 1 supplier';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        return true;
    }

    validateGradingMethod() {
        if (this.gradingMethodSelection === this.gradingMethodB) {
            const sum: number = this.reviewerWeights
                .getRawValue()
                .map(a => a.weight)
                .reduce(function (a, b) {
                    return a + b;
                });
            if (sum !== 100) {
                this.errorText =
                    'The sum of reviewer weights must be equal to 100';
                this.validationErrorDialog = this.dialog.open(this.errorDialog);
                document.getElementById('reviewers').style.color = "Red";
                return false;
            }
        }
        if (this.gradingMethodSelection === this.gradingMethodC) {
            if (
                !(
                    this.reviewInitiationForm.value['minGradeThreshold'] <
                    100 &&
                    this.reviewInitiationForm.value['minGradeThreshold'] > 0
                )
            ) {
                this.errorText = 'MinGradeThreshold must lie between 1 and 100';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                document.getElementById('minThreshold').style.color = "Red";
                return false;
            }
        }
        return true;
    }

    areOverlapping(a, b) {
        return a.lowerBound <= b.upperBound && a.upperBound >= b.lowerBound;
    }

    anyOverlap(intervals: any[]) {
        for (let i = 0; i < intervals.length - 1; i++) {
            for (let j = i + 1; j < intervals.length; j++) {
                if (this.areOverlapping(intervals[i], intervals[j])) {
                    return true;
                }
            }
        }
        return false;
    }

    validateGradeCategories() {
        const intervals = this.gradeCategories.getRawValue();
        if (this.anyOverlap(intervals)) {
            // there is at least a pair that overlaps.
            this.errorText = 'Check validity & Overlapping of Grade Categories';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            this.showUpperBoundError = true;
            this.showLowerBoundError = true;
            return false;
        }
        let sum = 0;

        for (let i = 0; i < intervals.length; i++) {
            sum = sum + intervals[i].upperBound - intervals[i].lowerBound + 1;
            if (intervals[i].category.replace(/\s/g, '') === '') {
                this.errorText = 'Grade categories must have labels';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                this.showBoundError[i] = false;
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                return false;
            }
            if (intervals[i].lowerBound >= intervals[i].upperBound) {
                this.errorText = 'Upper bound must be greater than lower bound';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                this.showBoundError[i] = false;
                this.showUpperBoundError = true;
                this.showLowerBoundError = false;
                return false;
            }
            if (intervals[i].lowerBound == null) {
                this.errorText = 'Please specify all lower bounds';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                return false;
            }
            if (intervals[i].upperBound === null) {
                this.errorText = 'Please specify all upper bounds';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                return false;
            }
            if (intervals[i].lowerBound === 0) {
                this.errorText = 'Lower bound must start with 1';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                this.showBoundError[i] = true;
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                return false;
            }
        }
        if (sum !== 100) {
            this.errorText = 'Grade categories must sum up to 100';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            this.showUpperBoundError = true;
            this.showLowerBoundError = true;
            return false;
        }
        return true;
    }

    closeError() {
        this.validationErrorDialog.close();
    }

    changeTab(index: any, position: string) {
        if (index === 5) {
            if (!this.validateGradingMethod() && !this.goBack && position === 'next') {
                return;
            } else {
                this.tabIndexChange(index, position);
                position === 'next' ? this.gradeTabDisabled = false : null;
            }
        }
        if (index === 0) {
            if (!this.goBack && position === 'next') {
                if (this.reviewInitiationForm.value['evaluationName'] === '') {
                    this.errorText = 'Specify evaluation name';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    document.getElementById('evaluationName').style.color = "Red";
                    return false;
                }
                if (
                    this.reviewInitiationForm.value['services'] === ''
                ) {
                    this.errorText =
                        'Specify whether this evaluation is for materials/services';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog);
                    document.getElementById('evaluationName').style.color = "Black";
                    document.getElementById('services').style.color = "Red";
                    return false;
                }
                if (this.dataService.sessionNames?.includes(this.reviewInitiationForm.value['evaluationName'])) {
                    this.errorText =
                        'Evaluation name already exists';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    document.getElementById('services').style.color = "Black";
                    document.getElementById('evaluationName').style.color = "Red";
                    return;
                }
                this.tabIndexChange(index, position);
                position === 'next' ? this.formTabDisabled = false : null;
            }
            else {
                this.tabIndexChange(index, position);
                position === 'next' ? this.formTabDisabled = false : null;
            }

        }
        if (index === 1) {
            if (!this.goBack && position === 'next') {
                if (this.reviewInitiationForm.value['formName'] === '' && !this.goBack) {
                    this.errorText = 'Specify evaluation form';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    document.getElementById('formName').style.color = "Red";
                    return false;
                } else {
                    this.tabIndexChange(index, position);
                    position === 'next' ? this.userTabDisabled = false : null;
                }
            }
            else {
                this.tabIndexChange(index, position);
                position === 'next' ? this.userTabDisabled = false : null;
            }

        }
        if (index === 3) {
            if (!this.goBack && position === 'next') {
                if (this.reviewInitiationForm.value['periodType'] === undefined) {
                    this.errorText = 'Specify review period';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog), { disableClose: true };
                    return false;
                }
                if (
                    this.reviewInitiationForm.value['periodType'] ===
                    this.customTypePeriod &&
                    (this.reviewInitiationForm.value['startDate'] === null ||
                        this.reviewInitiationForm.value['endDate'] === null)
                ) {
                    this.errorText = 'Set date range';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    document.getElementById('dateRange').style.color = "Red";
                    return false;
                }
                if (
                    this.reviewInitiationForm.value['periodType'] ===
                    this.customTypePeriod &&
                    this.reviewInitiationForm.value['startDate'].getTime() ===
                    this.reviewInitiationForm.value['endDate'].getTime()
                ) {
                    this.errorText = 'Start date and end date cannot be the same';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    document.getElementById('dateRange').style.color = "Red";
                    return false;
                }
                if (
                    this.reviewInitiationForm.value['periodType'] ===
                    this.presetTypePeriod &&
                    this.reviewInitiationForm.value['presetPeriod'] === ''
                ) {
                    this.errorText = 'Set preset period';
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    document.getElementById('period').style.color = "Red";
                    return false;
                }

                this.tabIndexChange(index, position);
                position === 'next' ? this.supplierTabDisabled = false : null;
            }

            else {
                this.tabIndexChange(index, position);
                position === 'next' ? this.supplierTabDisabled = false : null;
            }
        }
        if (index === 2) {
            if (
                this.selectedUsers.isEmpty() &&
                this.selectedUserRoles.isEmpty() && !this.goBack && position === 'next'
            ) {
                this.errorText = 'Select atleast 1 reviewer/ group';
                document.getElementById('reviewer').style.color = "Red";
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            } else {
                this.switchRadio(this.assignMethodSelection);
                this.tabIndexChange(index, position);
                position === 'next' ? this.timeTabDisabled = false : null;
            }
        }
        if (index === 4) {
            if (this.selectedSuppliers.isEmpty() && !this.goBack && position === 'next') {
                this.errorText = 'Select atleast 1 supplier';
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            } else {
                this.selectedTableSupplier = this.selectedSuppliers.selected;
                this.tabIndexChange(index, position);
                position === 'next' ? this.gradingTabDisabled = false : null;
            }
        }
    }

    switchRadio(value) {
        if (value === 'users') {
            this.selectedTableUser = this.selectedUsers.selected;
        } else {
            this.selectedTableRoles = this.selectedUserRoles.selected;
        }
    }

    changeTabBack(index) {
        this.goBack = true;
        this.selectedIndex = index - 1;
    }

    tabIndexChange(index, position) {
        if (position === 'tab') {
            this.selectedIndex = index;
            return this.selectedIndex;
        }
        if (position === 'next') {
            this.selectedIndex = index + 1;
            return this.selectedIndex;
        }
        if (this.goBack && index !== 0) {
            this.selectedIndex = index - 1;
            this.goBack = false;
            return this.selectedIndex;
        } else {
            this.selectedIndex = index;
            this.goBack = false;
            return this.selectedIndex;
        }
    }
}
