/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-var */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { SelectionModel } from '@angular/cdk/collections';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { forkJoin, Observable } from 'rxjs';
import { ReviewForm, Supplier, User, UserRole } from '../supplier-review-models';
import { ReviewScheduleSummaryOverlayComponent } from '../review-schedule-summary-overlay/review-schedule-summary-overlay.component';
import { map, startWith } from 'rxjs/operators';
import { UserGroupService } from '../../../../shared/Services/user-groups.service';
import { DataService } from '../supplier-review-data.service';
import { values } from 'lodash';

@Component({
    selector: 'review-schedule',
    templateUrl: './review-schedule-overlay.component.html',
    styleUrls: ['review-schedule-overlay.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ReviewScheduleOverlayComponent implements OnInit {
    @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
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
        }
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
            columnDef: 'ifsCode',
            header: 'IFS code ',
            cell: (element: Supplier) => `${element.supplierCode}`,
        },
    ];

    displayedColumns = this.columns.map(c => c.columnDef);
    displayedColumns1 = this.columns1.map(c => c.columnDef);
    displayedColumns2 = this.columns2.map(c => c.columnDef);

    //general
    editSession = 0;
    createdStatus = true;
    dialogTitle = 'Review Schedule Initiation';
    issuccess = false;
    iserror = false;
    errorText = '';
    session;
    reviewInitiationForm: FormGroup;
    validationErrorDialog: any;
    scoredReview = true;
    today = new Date();

    //review Form
    reviewForms: ReviewForm[];
    allReviewForms: ReviewForm[];
    reviewFormByName = new Map<string, ReviewForm>();
    filteredReviewForms: Observable<ReviewForm[]>;
    scoreForms = {};


    //users and userroles
    //userColumns: string[] = ['id', 'select', 'name', 'email', 'department'];
    allUsers: MatTableDataSource<User>;
    usersControl = new FormControl();
    selectedUsers = new SelectionModel<User>(true, []);
    selectedUsersInitial = new SelectionModel<User>(true, []);
    //userRoleColumns: string[] = ['id', 'select', 'name'];
    allUserRoles: MatTableDataSource<UserRole>;
    userRolesControl = new FormControl();
    selectedUserRolesInitial = new SelectionModel<UserRole>(true, []);
    selectedUserRoles = new SelectionModel<UserRole>(true, []);
    usersAssignMethod = SupplierReviewConstants.usersAssignMethod;
    userRolesAssignMethod = SupplierReviewConstants.userRolesAssignMethod;
    assignMethodSelection: string;
    reviewCreatedState = SupplierReviewConstants.reviewCreatedState;
    userGroupDetails = [];

    selectedallUser = [];
    //suppliers
    //supplierColumns: string[] = ['id', 'select', 'supplierId', 'supplierName', 'supplierType', 'ifsCode'];
    allSuppliers: MatTableDataSource<Supplier>;
    suppliersControl = new FormControl();
    selectedSuppliers = new SelectionModel<Supplier>(true, []);

    //time period
    monthlyScheduleFrequency = SupplierReviewConstants.monthlyScheduleFrequency;
    annualScheduleFrequency = SupplierReviewConstants.annualScheduleFrequency;
    quarterlyScheduleFrequency = SupplierReviewConstants.quarterlyScheduleFrequency;
    semiAnnualScheduleFrequency = SupplierReviewConstants.semiAnnualScheduleFrequency;
    presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
    customTypePeriod = SupplierReviewConstants.customTypePeriod;

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


    allUser = 'allUser';
    allRoles = 'allRoles';
    allSupplier = 'allSupplier';
    selectedTableUser: any;
    selectedTableRoles: any;
    selectedTableSupplier: any;
    public selectedIndex: number = 0;
    selectedTable: any;

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

    constructor(private http: HttpClient, private userGroupService: UserGroupService,
        private dataService: DataService,
        public dialogRef: MatDialogRef<ReviewScheduleOverlayComponent>,
        public dialog: MatDialog, private fb: FormBuilder, public datepipe: DatePipe
    ) {
        this.isLoading = true;
        this.requestDataFromMultipleSources().subscribe((responseList) => {
            this.allUsers = new MatTableDataSource(responseList[0]);
            this.userGroupDetails = responseList[3];
            let userGroupsWithUsers = [];
            this.userGroupDetails.forEach((userGroupUser)=>{
                if (!userGroupsWithUsers.includes(userGroupUser.groupId)){
                    userGroupsWithUsers.push(userGroupUser.groupId);
                }
            })
            responseList[1]?.sort((a, b) =>
                a.supplierName.localeCompare(b.supplierName));
            responseList[1] = responseList[1].filter(obj => {
                return obj.status != 'blocked';
            });
            responseList[1] = responseList[1] .filter(obj => {
                return obj.supplierCode != '';
            });
            this.allSuppliers = new MatTableDataSource(responseList[1]);
            const userGroups = [];
            responseList[2].forEach((userGroup) => {
                if (userGroup.isActive==true && userGroupsWithUsers.includes(userGroup.id)){
                    var userRole: UserRole = {
                        id: userGroup.id,
                        name: userGroup.userGroup
                    };
                    userGroups.push(userRole);
                }
            });
            this.allUserRoles = new MatTableDataSource<UserRole>(userGroups);
            this.isLoading = this.editSession === 0 ? false : true;

            if (this.editSession === 1) {
                this.dialogTitle = 'Review Schedule Edit';
                this.formTabDisabled = false;
                this.userTabDisabled = false;
                this.timeTabDisabled = false;
                this.supplierTabDisabled = false;
                this.gradingTabDisabled = false;
                this.gradeTabDisabled = false;
                this.scoredReview = this.session.scored;
                let assignedUsers = this.session.assignedUsers;
                const index = this.dataService.sessionNames.indexOf(this.session.evaluationName, 0);
                if (index > -1) {
                    this.dataService.sessionNames.splice(index, 1);
                }
                assignedUsers = this.allUsers.data.filter(function (user) {
                    return assignedUsers.includes(user.name);
                });
                assignedUsers = new MatTableDataSource<User>(assignedUsers);
                assignedUsers.data.forEach(row => this.selectedUsers.select(row));
                assignedUsers.data.forEach(row => this.selectedUsersInitial.select(row));

                let assignedUserRoles = this.session.assignedUserRoles;
                assignedUserRoles = this.allUserRoles.data.filter(function (userRole) {
                    return assignedUserRoles.includes(userRole.name);
                });
                assignedUserRoles = new MatTableDataSource<UserRole>(assignedUserRoles);
                assignedUserRoles.data.forEach(row => this.selectedUserRoles.select(row));
                assignedUserRoles.data.forEach(row => this.selectedUserRolesInitial.select(row));

                let suppliers = this.session.suppliers;
                suppliers = this.allSuppliers.data.filter(function (supplier) {
                    return suppliers.includes(supplier.supplierID);
                });
                suppliers = new MatTableDataSource<User>(suppliers);
                suppliers.data.forEach(row => this.selectedSuppliers.select(row));
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
                this.session.startDate = moment(this.session.startDate, 'DD/MM/YYYY 12:00:00 AM').toDate();
                this.session.endDate = moment(this.session.endDate, 'DD/MM/YYYY 12:00:00 AM').toDate();
                this.http.get(environment.nodeurl + '/api/supplier/reviewForms')
                    .subscribe((data: ReviewForm[]) => {
                        if (data) {
                            this.updateReviewFormData(data);
                            this.filterFormsByType(this.session.services);
                            this.session.formName = this.reviewForms?.find(reviewForm => reviewForm.id === this.session.formId).name;
                            this.reviewInitiationForm = this.fb.group(this.session);
                            this.gradingMethodSelection = this.reviewInitiationForm.value['gradingMethod'];
                            this.assignMethodSelection = this.reviewInitiationForm.value['assignType'];
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
            this.filteredReviewForms = this.reviewInitiationForm.get('formName')!.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
        }
    }
    ngOnInit(): void {

        if (this.editSession===0){
            this.http
            .get(environment.nodeurl + '/api/supplier/reviewForms')
            .subscribe((data: ReviewForm[]) => {
                if (data) {
                    this.updateReviewFormData(data);
                }
            });
        }
        this.reviewInitiationForm = this.fb.group({
            formName: '',
            evaluationName: '',
            reviewYear: '2022',
            gradingMethod: this.gradingMethodA,
            presetPeriod: '',
            periodType: this.customTypePeriod,
            startDate: new FormControl(),
            endDate: new FormControl(),
            assignType: this.usersAssignMethod,
            minGradeThreshold: 50,
            frequency: this.monthlyScheduleFrequency,
            scheduled: 1,
            supplierBlocker: false,
            //materials: false,
            services: '',
            scored: this.scoredReview,
            status: '',

            reviewerWeights: this.fb.array([
            ]
            ),
            gradeCategories: this.fb.array([this.fb.group({
                category: [this.recommendedOutcome, Validators.required],
                upperBound: [100, Validators.required],
                lowerBound: [51, Validators.required]
            }), this.fb.group({
                category: [this.notRecommendedOutcome, Validators.required],
                upperBound: [50, Validators.required],
                lowerBound: [1, Validators.required]
            })])
        });

    }

    filterFormsByType(formType) {
        this.reviewForms = this.allReviewForms?.filter(obj => {
            return obj.formType.toLowerCase() === formType.toLowerCase();
        });
    };

    private _filter(value: string): ReviewForm[] {
        const filterValue = value.toLowerCase();

        return this.reviewForms.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    get gradeCategories() {
        return this.reviewInitiationForm.controls['gradeCategories'] as FormArray;
    }

    get reviewerWeights() {
        return this.reviewInitiationForm.controls['reviewerWeights'] as FormArray;
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

    addGradeCategory() {
        const categoryForm = this.fb.group({
            category: ['', Validators.required],
            upperBound: ['', Validators.required],
            lowerBound: ['', Validators.required]
        });
        this.gradeCategories.push(categoryForm);
    }

    deleteGradeCategory(lessonIndex: number) {
        this.gradeCategories.removeAt(lessonIndex);
    }

    getReviewerWeights(selectedIndex) {
        for (const user of this.selectedUsers.selected) {
            if (!this.reviewerWeights.getRawValue().map(item => item.reviewer).includes(user.name)) {
                const reviewerForm = this.fb.group({
                    reviewer: [user.name, Validators.required],
                    weight: [0, Validators.required]
                });
                this.reviewerWeights.push(reviewerForm);
            }
            this.reviewerWeights.getRawValue().forEach((reviewer, index) => {
                if (!this.selectedUsers.selected.some(e => e.name === reviewer.reviewer)) {
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

    setDefaultValue() {
        this.fb.group['formId'] = this.reviewForms[0].id;
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
        this.reviewInitiationForm.value['startDate'] = this.datepipe.transform(this.reviewInitiationForm.value['startDate'], 'yyyy-MM-dd');
        this.reviewInitiationForm.value['endDate'] = this.datepipe.transform(this.reviewInitiationForm.value['endDate'], 'yyyy-MM-dd');

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
        }
        else {
            this.reviewInitiationForm.value['supplierBlocker'] = 0;
        }
        if (this.reviewInitiationForm.value['services'] === '') {
            this.reviewInitiationForm.value['services'] = '';
        }
        if (this.scoredReview == true) {
            this.reviewInitiationForm.value['scored'] = 1;
        }
        else {
            this.reviewInitiationForm.value['scored'] = 0;
        }
        if (this.editSession === 0) {
            this.reviewInitiationForm.value['status'] = this.reviewCreatedState;
        }
        const dialogRef = this.dialog.open(ReviewScheduleSummaryOverlayComponent, { data: this.reviewInitiationForm });
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
    checkChangedForm(event) {
        this.scoredReview = this.scoreForms[event.value];

    }
    validateRequiredInputs() {
        if (this.reviewInitiationForm.value['evaluationName'] === '') {
            this.errorText = 'Specify evaluation name';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.reviewInitiationForm.value['services'] === '') {
            this.errorText = 'Specify whether this evaluation is for materials/services';
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
        if (this.dataService.sessionNames?.includes(this.reviewInitiationForm.value['evaluationName'])) {
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
        if (this.reviewInitiationForm.value['startDate'] === null || this.reviewInitiationForm.value['endDate'] === null) {
            this.errorText = 'Set date range for scheduling';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }

        const dayDiff = this.convertTimeToDays(this.reviewInitiationForm.value['endDate'], this.reviewInitiationForm.value['startDate']);

        if (this.reviewInitiationForm.value['frequency'] === this.monthlyScheduleFrequency && (dayDiff < 30)) {
            this.errorText = 'Selected date range must be greater than 30 days';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.reviewInitiationForm.value['frequency'] === this.quarterlyScheduleFrequency && (dayDiff < 90)) {
            this.errorText = 'Selected date range must be greater than 90 days';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.reviewInitiationForm.value['frequency'] === this.semiAnnualScheduleFrequency && (dayDiff < 180)) {
            this.errorText = 'Selected date range must be greater than 180 days';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.reviewInitiationForm.value['frequency'] === this.annualScheduleFrequency && (dayDiff < 365)) {
            this.errorText = 'Selected date range must be greater than 365 days';
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        if (this.selectedUsers.isEmpty() && this.selectedUserRoles.isEmpty()) {
            this.errorText = 'Select atleast 1 reviewer/ group';
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
            const sum: number = this.reviewerWeights.getRawValue().map(a => a.weight).reduce(function (a, b) {
                return a + b;
            });
            if (sum !== 100) {
                this.errorText = 'The sum of reviewer weights must be equal to 100';
                this.validationErrorDialog = this.dialog.open(this.errorDialog);
                return false;
            }
        }
        if (this.gradingMethodSelection === this.gradingMethodC) {
            if (!(this.reviewInitiationForm.value['minGradeThreshold'] < 100 && this.reviewInitiationForm.value['minGradeThreshold'] > 0)) {
                this.errorText = 'MinGradeThreshold must lie between 1 and 100';
                document.getElementById('minThreshold').style.color = "Red";
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            }
        }
        return true;
    }

    areOverlapping(a, b) {
        return (a.lowerBound <= b.upperBound) && (a.upperBound >= b.lowerBound);
    }

    anyOverlap(intervals: any[]) {
        for (let i = 0; i < intervals.length - 1; i++) {
            for (let j = i + 1; j < intervals.length; j++) {
                if (this.areOverlapping(intervals[i], intervals[j])) { return true; }
            }
        }
        return false;
    }

    validateGradeCategories() {
        const intervals = this.gradeCategories.getRawValue();
        if (this.anyOverlap(intervals)) {
            // there is at least a pair that overlaps.
            this.errorText = 'Check validity & Overlapping of Grade Categories';
            this.showUpperBoundError = true;
            this.showLowerBoundError = true;
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
            return false;
        }
        let sum = 0;

        for (let i = 0; i < intervals.length; i++) {
            sum = sum + intervals[i].upperBound - intervals[i].lowerBound + 1;
            if (intervals[i].category.replace(/\s/g, '') === '') {
                this.errorText = 'Grade categories must have labels';
                this.showBoundError[i] = false;
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            }
            if (intervals[i].lowerBound >= intervals[i].upperBound) {
                this.errorText = 'Upper bound must be greater than lower bound';
                this.showBoundError[i] = false;
                this.showUpperBoundError = true;
                this.showLowerBoundError = false;
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            }
            if (intervals[i].lowerBound == null || intervals[i].lowerBound === '') {
                this.errorText = 'Please specify all lower bounds';
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            }
            if (intervals[i].upperBound === null || intervals[i].upperBound === '') {
                this.errorText = 'Please specify all upper bounds';
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            }
            if (intervals[i].lowerBound === 0) {
                this.errorText = 'Lower bound must start with 1';
                this.showBoundError[i] = true;
                this.showUpperBoundError = false;
                this.showLowerBoundError = false;
                this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                return false;
            }
        }
        if (sum !== 100) {
            this.errorText = 'Grade categories must sum up to 100';
            this.showUpperBoundError = true;
            this.showLowerBoundError = true;
            this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
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
                    document.getElementById('evaluationName').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return;
                }
                if (
                    this.reviewInitiationForm.value['services'] === ''
                ) {
                    this.errorText =
                        'Specify whether this evaluation is for materials/services';
                    document.getElementById('evaluationName').style.color = "Black";
                    document.getElementById('services').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return;
                }
                if (this.dataService.sessionNames.includes(this.reviewInitiationForm.value['evaluationName'])) {
                    this.errorText =
                        'Evaluation name already exists';
                    document.getElementById('services').style.color = "Black";
                    document.getElementById('evaluationName').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
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
                if (this.reviewInitiationForm.value['formName'] === '') {
                    this.errorText = 'Specify evaluation form';
                    document.getElementById('formName').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return false;

                } else {
                    this.tabIndexChange(index, position);
                    position === 'next' ? this.timeTabDisabled = false : null;
                }
            }
            else {
                this.tabIndexChange(index, position);
                position === 'next' ? this.timeTabDisabled = false : null;
            }
        }
        if (index === 2) {
            if (!this.goBack && position === 'next') {
                if (this.reviewInitiationForm.value['startDate'] === null || this.reviewInitiationForm.value['endDate'] === null) {
                    this.errorText = 'Set date range for scheduling';
                    document.getElementById('dateRange').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return false;
                }
                if (this.reviewInitiationForm.value['frequency'] === this.monthlyScheduleFrequency &&
                    (this.reviewInitiationForm.value['endDate'].getTime() - this.reviewInitiationForm.value['startDate'].getTime()) / (1000 * 3600 * 24) < 30) {
                    this.errorText = 'Selected date range must be greater than 30 days';
                    document.getElementById('dateRange').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return false;
                }
                if (this.reviewInitiationForm.value['frequency'] === this.quarterlyScheduleFrequency &&
                    (this.reviewInitiationForm.value['endDate'].getTime() - this.reviewInitiationForm.value['startDate'].getTime()) / (1000 * 3600 * 24) < 90) {
                    this.errorText = 'Selected date range must be greater than 90 days';
                    document.getElementById('dateRange').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return false;
                }
                if (this.reviewInitiationForm.value['frequency'] === this.semiAnnualScheduleFrequency &&
                    (this.reviewInitiationForm.value['endDate'].getTime() - this.reviewInitiationForm.value['startDate'].getTime()) / (1000 * 3600 * 24) < 180) {
                    this.errorText = 'Selected date range must be greater than 180 days';
                    document.getElementById('dateRange').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return false;
                }
                if (this.reviewInitiationForm.value['frequency'] === this.annualScheduleFrequency &&
                    (this.reviewInitiationForm.value['endDate'].getTime() - this.reviewInitiationForm.value['startDate'].getTime()) / (1000 * 3600 * 24) < 365) {
                    this.errorText = 'Selected date range must be greater than 365 days';
                    document.getElementById('dateRange').style.color = "Red";
                    this.validationErrorDialog = this.dialog.open(this.errorDialog, { disableClose: true });
                    return false;
                }
                this.tabIndexChange(index, position);
                position === 'next' ? this.userTabDisabled = false : null;
            }

            else {
                this.tabIndexChange(index, position);
                position === 'next' ? this.userTabDisabled = false : null;
            }
        }
        if (index === 3) {
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
                position === 'next' ? this.supplierTabDisabled = false : null;
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

    selectedTableUsers(value) {
        this.selectedTable = value;
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

    convertTimeToDays(val1, val2) {
        let val: number = 0;
        val1 = new Date(val1).getTime();
        val2 = new Date(val2).getTime();
        val = (val1 - val2) / (1000 * 3600 * 24);
        return val;
    }
}
