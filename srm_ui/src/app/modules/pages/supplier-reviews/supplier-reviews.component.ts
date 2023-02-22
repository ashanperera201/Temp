/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/prefer-for-of */
import {
    Component,
    OnInit,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { ReviewInitiationOverlayComponent } from './review-initiation-overlay/review-initiation-overlay.component';
import { ReviewScheduleOverlayComponent } from './review-schedule-overlay/review-schedule-overlay.component';
import { SupplierReviewConstants } from './supplier-review-constants';
import { DataService } from './supplier-review-data.service';
import { DatePipe } from '@angular/common';
import { ReviewResponse, ReviewSession, Tabs } from './supplier-review-models';
import { FuseConfirmationService } from '@fuse/services/confirmation';

@Component({
    selector: 'supplier-reviews',
    templateUrl: './supplier-reviews.component.html',
    styleUrls: ['./supplier-reviews.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class SupplierReviewsComponent implements OnInit {


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
  @ViewChild('errorDialog2') errorDialog2: TemplateRef<any>;
  @ViewChild('errorDialog3') errorDialog3: TemplateRef<any>;
  reviewColumns: string[] = ['evalName', 'formType', 'reviewTime', 'reqBy', 'status', 'initDate', 'pubDate', 'revYear', 'editButton', 'publishButton'];
  reviews: MatTableDataSource<ReviewSession>;
  panelOpenState = false;
  tabIndex: Tabs = Tabs.Review_Sessions;
  loading = false;
  sessionReviewerColours = {};
  sessionReviewerStatuses = {}
  reviewPublishedState = SupplierReviewConstants.reviewPublishedState;
  reviewCreatedState = SupplierReviewConstants.reviewCreatedState;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
  customTypePeriod = SupplierReviewConstants.customTypePeriod;
  reviewResponseCreatedState = SupplierReviewConstants.reviewResponseCreatedState;
  reviewOutcomeCreatedState = SupplierReviewConstants.reviewOutcomeCreatedState;
  monthlyScheduleFrequency = SupplierReviewConstants.monthlyScheduleFrequency;
  quarterlyScheduleFrequency = SupplierReviewConstants.quarterlyScheduleFrequency;
  semiAnnualScheduleFrequency = SupplierReviewConstants.semiAnnualScheduleFrequency;
  annualScheduleFrequency = SupplierReviewConstants.annualScheduleFrequency;
  limitingRoles = SupplierReviewConstants.limitingRoles;
  error3Message;
    value: string;
    value2: string;
    show = true;
    /**
     * Constructor
     */
    constructor(private router: Router, public dialog: MatDialog, private http: HttpClient,
        private dataService: DataService, public datePipe: DatePipe, private _fuseConfirmationService: FuseConfirmationService,
        private route: ActivatedRoute) {
        route.queryParams.subscribe(params => {
            if (Object.keys(params).includes('tab')) {
                if (params['tab'] == 'sessions') {
                    this.setTab(Tabs.Review_Sessions);
                }
                else if (params['tab'] == 'todos') {
                    this.setTab(Tabs.Review_Todos);
                }
                else if (params['tab'] == 'responses') {
                    this.setTab(Tabs.Review_Responses);
                }
                else {
                    this.setTab(Tabs.Review_Outcomes);
                }
            }
            else {
                this.setTab(this.dataService.landingTab);
            }
        });
    }

    ngOnInit(): void {
        if (this.limitingRoles.includes(localStorage.getItem("userrole")?.toLowerCase().replace(/\s/g, ""))){
            this.show = false;
          }
        this.http
            .get(
                environment.nodeurl +
                '/api/supplier/reviewSessionsByUser?loggedInUser=' +
                localStorage.getItem('username')
            )
            .subscribe((data: ReviewSession[]) => {
                if (data) {
                    this.reviews = new MatTableDataSource<ReviewSession>(data);
                    console.log("is this causing the error?", this.reviews.data)
                    for (let i = 0; i < this.reviews.data?.length; i++) {
                        this.reviews.data[i].startDate = new Date(
                            this.reviews.data[i].startDate
                        );
                        this.reviews.data[i].endDate = new Date(
                            this.reviews.data[i].endDate
                        );
                    }
                    this.dataService.sessionNames = this.reviews.data.map(
                        (review) => review.evaluationName
                    );
                    setTimeout(() => {
                        this.reviews.paginator = this.paginator;
                        this.reviews.sort = this.sort;
                    }, 500);
                    this.http
                        .get<any>(
                            environment.nodeurl +
                            '/api/supplier/reviewResponsesByUser?loggedInUser=0'
                        )
                        .subscribe((responses: ReviewResponse[]) => {
                            responses?.forEach((response: ReviewResponse) => {
                                if (
                                    response.conductedUser.toLowerCase() ==
                                    localStorage.getItem('username').toLowerCase()
                                ) {
                                    if (
                                        !Object.keys(
                                            this.sessionReviewerStatuses
                                        ).includes(response.evaluationName)
                                    ) {
                                        this.sessionReviewerStatuses[
                                            response.evaluationName
                                        ] = [response.status];
                                    } else {
                                        this.sessionReviewerStatuses[
                                            response.evaluationName
                                        ].push(response.status);
                                    }
                                }
                            });
                            this.reviews.data.forEach(
                                (reviewSession: ReviewSession) => {
                                    let toDo = 0;
                                    if (!Object.keys(this.sessionReviewerStatuses).includes(reviewSession.evaluationName)
                                    ) {
                                        this.sessionReviewerColours[reviewSession.evaluationName] = 'white';
                                        return;
                                    }
                                    this.sessionReviewerStatuses[reviewSession.evaluationName].forEach((status) => {
                                        if (status == this.reviewResponseCreatedState
                                        ) {
                                            toDo += 1;
                                        }
                                    });
                                    if (
                                        toDo ==
                                        this.sessionReviewerStatuses[
                                            reviewSession.evaluationName
                                        ]?.length
                                    ) {
                                        this.sessionReviewerColours[
                                            reviewSession.evaluationName
                                        ] = 'red';
                                    } else if (toDo == 0) {
                                        this.sessionReviewerColours[
                                            reviewSession.evaluationName
                                        ] = 'green';
                                    } else {
                                        this.sessionReviewerColours[
                                            reviewSession.evaluationName
                                        ] = 'yellow';
                                    }
                                }

                            );
                        });
                }
            });
    }

    setTab(tab: Tabs): void {
        this.tabIndex = tab;
    }
    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.reviews.filter = filterValue.trim().toLowerCase();
    }

    initiateReview() {
        this.dataService.sessionNames = this.reviews?.data?.map(
            (review) => review.evaluationName
        );
        const dialogRef = this.dialog.open(ReviewInitiationOverlayComponent, {
            disableClose: true,
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => { });
    }
    canPublishSession(row) {
        if (
            row.status == this.reviewCreatedState &&
            row.createdUser.toLowerCase() ==
            localStorage.getItem('username').toLowerCase()
        ) {
            return true;
        }
        return false;
    }
    canEditSession(row) {
        if (
            row.status == this.reviewCreatedState &&
            row.createdUser.toLowerCase() ==
            localStorage.getItem('username').toLowerCase()
        ) {
            return true;
        }
        return false;
    }
    canDisplaySession(row) {
        if (
            row.status != this.reviewCreatedState &&
            row.createdUser.toLowerCase() ==
            localStorage.getItem('username').toLowerCase()
        ) {
            return true;
        }
        return false;
    }

    publishReviewSession(session) {
        if (typeof session.reviewerWeights == 'object') {
            session.reviewerWeights = JSON.stringify(
                session.reviewerWeights.getRawValue()
            );
        }
        if (typeof session.gradeCategories == 'object') {
            session.gradeCategories = JSON.stringify(
                session.gradeCategories.getRawValue()
            );
        }
        this.pushnotification(
            session.status,
            session.evaluationName,
            session.createdDate,
            session.createdUser
        );
        this.loading = true;
        this.http
            .post<any>(
                environment.nodeurl + '/api/supplier/reviewSessionPublish',
                session
            )
            .subscribe((data) => {
                session.status = this.reviewPublishedState;
                this.loading = false;

                const dataPop: [] = [];

                dataPop['title'] = 'Session published';
                dataPop['message'] = 'Session has been successfully published';
                dataPop['dismissible'] = true;
                dataPop['color'] = 'primary';
                dataPop['icon'] = 'heroicons_outline:check-circle';
                this.showPopup(dataPop);
                setTimeout(() => {
                    window.location.reload();
                }, 2500);

            });
    }

    pushnotification(status, evaluationName, createdDate, createdUser) {
        var status = status;
        var evaluationName = evaluationName;
        var createdDate = createdDate;
        var createdUser = createdUser;

        evaluationName =
            'Review session : ' +
            evaluationName +
            ' has been assigned for reviewing';
        createdUser = 'Created by: ' + createdUser;
        createdDate = 'Created date: ' + createdDate;
        var secondcontent = createdUser + ' | ' + createdDate;
        var actionurl = environment.clientUrl + '/supplier-reviews';
        const url = 'https://api.magicbell.com/notifications';

        var body = '';

        body =
            '{"notification": {"title":"' +
            evaluationName +
            '","content": "' +
            secondcontent +
            '","category": "new_message","action_url": "' +
            actionurl +
            '","recipients": [{"email": "bilal.rifas@gmail.com"}],"custom_attributes": {"order": {"id": "1202983","title": "A title you can use in your templates"}}}}';
        // body = '{"name":"' + this.newRoleFormControl.value + '","description":"' + this.newRoleFormControl.value + '"}';

        let headers = new HttpHeaders({
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-MAGICBELL-API-SECRET':
                'Kmzcj/AlT6oN8yGjXO6UMeJCdhxIpNyers8zqp6T',
            'X-MAGICBELL-API-KEY': 'e47fd0f1737dffcc6a9c96a4371b642c8ffae8ba',
        });
        let options = { headers: headers };

        this.http.post(url, body, options).subscribe((data) => {
            console.log('Here is the Push data');
            console.log(data);
        });
    }

    editReviewSession(session) {
        if (session.scheduled === 1) {
            const dialogRef = this.dialog.open(ReviewScheduleOverlayComponent, {
                disableClose: true,
            });
            const instance = dialogRef.componentInstance;
            instance.session = session;
            instance.editSession = 1;
            instance.createdStatus = session.status === this.reviewCreatedState;
            dialogRef.addPanelClass('inline-md-overlay');
            dialogRef.afterClosed().subscribe((result) => { });
        } else {
            const dialogRef = this.dialog.open(
                ReviewInitiationOverlayComponent,
                { disableClose: true }
            );
            const instance = dialogRef.componentInstance;
            instance.session = session;
            instance.editSession = 1;
            instance.createdStatus = session.status === this.reviewCreatedState;
            dialogRef.addPanelClass('inline-md-overlay');
            dialogRef.afterClosed().subscribe((result) => { });
        }
    }
    scheduleReview() {
        const dialogRef = this.dialog.open(ReviewScheduleOverlayComponent, {
            disableClose: true,
        });
        dialogRef.addPanelClass('inline-md-overlay');
        dialogRef.afterClosed().subscribe((result) => { });
    }
    goToReviewResponse(reviewSession) {

        this.dataService.approvalState = 0;
        if (reviewSession.status === this.reviewCreatedState) {
            this.dialog.open(this.errorDialog, { disableClose: true });
        } else if (
            reviewSession.assignedUsers
                .toLowerCase()
                .split(',')
                .indexOf(localStorage.getItem('username').toLowerCase()) == -1
        ) {
            this.dialog.open(this.errorDialog2, { disableClose: true });
        } else if (
            reviewSession.scheduled==1
        ) {
            const date = reviewSession.startDate;
            var startDate;
            if (reviewSession.frequency==this.monthlyScheduleFrequency){
                startDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                this.error3Message = 'This review will begin only on '+ startDate.toDateString();
            }
            else if (reviewSession.frequency==this.quarterlyScheduleFrequency){
                var quarterMonths = [0, 3, 6, 9];
                for (let i = 1; i < 13; i++){
                    startDate = new Date(date.getFullYear(), date.getMonth() + i, 1);
                    if (quarterMonths.includes(startDate.getMonth())){
                        this.error3Message = 'This review will begin only on '+ startDate.toDateString();
                        break;
                    }
                }
            }
            else if (reviewSession.frequency==this.semiAnnualScheduleFrequency){
                var semiAnnualMonths = [0, 6];
                for (let i = 1; i < 13; i++){
                    startDate = new Date(date.getFullYear(), date.getMonth() + i, 1);
                    if (semiAnnualMonths.includes(startDate.getMonth())){
                        this.error3Message = 'This review will begin only on '+ startDate.toDateString();
                        break;
                    }
                }
            }
            else if (reviewSession.frequency==this.annualScheduleFrequency){
                startDate = new Date(date.getFullYear()+1, 0, 1);
                this.error3Message = 'This review will begin only on '+ startDate.toDateString();
            }
            else{
                this.error3Message = 'This review has not begun yet!';
            }
            this.dialog.open(this.errorDialog3, { disableClose: true });
        }else {
            this.dataService.reviewSession = reviewSession;
            this.dataService.editResponse = 1;
            this.router.navigate(['/review-response-page/0']);
        }
    }


    // Filter the data table
    filterChange(type, event): void {
        let value = '';
        if (type === 'initDate' || type === 'pubDate') {
            value = this.datePipe.transform(event.target.value, 'dd/MM/YY');
            //value = moment(event).format('DD-MMM-YYYY');
        } else {
            value = event ? event.target.value.trim().toLowerCase() : '';
        }
        const filterValue = value;

        this.reviews.filter = filterValue.trim().toLowerCase();
        if (type === 'evalName') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.evaluationName.toString().toLowerCase().includes(filter);
        } else if (type === 'formType') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.services.toString().toLowerCase().includes(filter); 
        } else if (type === 'reviewTime') {
            this.reviews.filterPredicate = (data, filter: any): boolean =>
            ((data.scheduled == 1) ? data.frequency.toString().toLowerCase().includes(filter) :
                data.presetPeriod.toString().toLowerCase().includes(filter) || data.startDate.toString().toLowerCase().includes(filter)
                || data.endDate.toString().toLowerCase().includes(filter));
        } else if (type === 'status') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.status.toLowerCase().includes(filter);
        } else if (type === 'reqBy') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.createdUser.toLowerCase().includes(filter);
        } else if (type === 'initDate') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.createdDate.toString().toLowerCase().includes(filter);
        } else if (type === 'pubDate') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.modifiedDate.toString().toLowerCase().includes(filter);
        } else if (type === 'revYear') {
            this.reviews.filterPredicate = (data, filter: any): boolean => data.reviewYear.toString().toLowerCase().includes(filter);
        }

        if (this.reviews.paginator) {
            this.reviews.paginator.firstPage();
        }
    }

    //reset filters/data
    resetFilters(): void {
        this.filterChange('', '');
    }

    showPopup(data) {
        const dialogRef = this._fuseConfirmationService.open({
            title: data.title,
            message:
                data.message,
            icon: {
                show: true,
                name: data.icon,
                color: data.color,
            },
            actions: {
                confirm: {
                    show: true,
                    label: 'Ok',
                    color: data.color,
                },
                cancel: {
                    show: false,
                    label: 'No',
                },
            },
            dismissible: data.dismissible,
        });
    }

}
