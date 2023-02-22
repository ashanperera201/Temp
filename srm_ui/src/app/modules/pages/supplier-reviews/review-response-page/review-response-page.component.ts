/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation, ɵsetCurrentInjector } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { NgxSurveyComponent } from 'app/modules/pages/form-builder/ngx-survey/public-api';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierReviewConstants } from '../supplier-review-constants';
import { DataService } from '../supplier-review-data.service';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { NgxSurveyService } from '../../form-builder/ngx-survey/ngx-survey.service';
import { MatDialog } from '@angular/material/dialog';
import { ReviewReinitiationOverlayComponent } from '../review-reinitiation-overlay/review-reinitiation-overlay.component';
import { ReviewRejectionOverlayComponent } from '../review-rejection-overlay/review-rejection-overlay.component';
import { ReviewApprovalOverlayComponent } from '../review-approval-overlay/review-approval-overlay.component';
import { ReviewApprover, ReviewResponse, Supplier, ReviewOutcome, ReviewSession, Tabs, ReviewTodo} from '../supplier-review-models';
import { MatStepper } from '@angular/material/stepper';
import { SupplierReviewService } from '../supplier-review-common.service';
import { UserGroupService } from '../../../../shared/Services/user-groups.service';
import { forkJoin, Observable } from 'rxjs';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'app-review-response-page',
  templateUrl: './review-response-page.component.html',
  styleUrls: ['./review-response-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReviewResponsePageComponent implements OnInit {
  @ViewChild('survey', { static: false }) public survey: NgxSurveyComponent;
  @ViewChild('rejectDialog') rejectDialog: TemplateRef<any>;
  @ViewChild('stepper') private stepper: MatStepper;
  public form = [];
  APPROVER_COUNT = 4;
  reviewResponseId: number;
  review: ReviewResponse;
  reviewSession: ReviewSession;
  edit: number;
  approvalState: number = 0;
  reviewableSuppliers = []
  supplierId = new FormControl();
  reviewSessionId: number;
  reviewResponseCreatedState = SupplierReviewConstants.reviewResponseCreatedState;
  reviewResponseUpdatedState = SupplierReviewConstants.reviewResponseApprovalReadyState;
  reviewApproverWaitingState = SupplierReviewConstants.reviewApproverWaitingState;
  presetTypePeriod = SupplierReviewConstants.presetTypePeriod;
  customTypePeriod = SupplierReviewConstants.customTypePeriod;
  reviewApproverApprovedState = SupplierReviewConstants.reviewApproverApprovedState;
  reviewApproverRejectedState = SupplierReviewConstants.reviewApproverRejectedState;
  reviewResponseRejectedState = SupplierReviewConstants.reviewResponseRejectedState;
  reviewResponseApprovalReadyState = SupplierReviewConstants.reviewResponseApprovalReadyState;
  reviewResponseApprovedState = SupplierReviewConstants.reviewResponseApprovedState;
  usersAssignMethod = SupplierReviewConstants.usersAssignMethod;
  reviewApproverCreatedState = SupplierReviewConstants.reviewApproverCreatedState;
  reviewResponseApprovalWaitingState = SupplierReviewConstants.reviewResponseApprovalWaitingState;
  reviewApproverReinitiatedState = SupplierReviewConstants.reviewApproverReinitiatedState;
  reviewTodoCreatedState = SupplierReviewConstants.reviewTodoCreatedState;
  reviewTodoCompletedState = SupplierReviewConstants.reviewTodoCompletedState;

  supplierReviewalActionType = SupplierReviewConstants.supplierReviewalActionType;
  currentApprover: ReviewApprover;
  nextApprover: ReviewApprover = null;
  formData: any = {};
  logoFileName: any;
  bannerFileName: any;
  approvers = [];
  approverNames = [];
  approverRoles = [];
  displayedApproverColumns = ['approverId', 'approverName', 'email', 'status', 'approvedDate', 'comments'];
  approverLoggedIn = false;
  stepIndex = 0;
  comment: string;
  loading: boolean;
  userGroupDetails = [];
  userGroups = [];
  view: boolean = true;
  showLegends: boolean;
  FIRST_APPROVER_STEP = 10;
  SECOND_APPROVER_STEP = 20;
  THIRD_APPROVER_STEP = 30;
  FOURTH_APPROVER_STEP = 40;
  reinitiatedByGMVP = false;

  constructor(private _location: Location,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public dataService: DataService,
    public service: NgxSurveyService,
    private supplierReviewService: SupplierReviewService,
    public dialog: MatDialog,
    private userGroupService: UserGroupService,
    private _fuseConfirmationService: FuseConfirmationService,) {
    route.params.subscribe(params => {
      this.reviewResponseId = Number(params["id"]);
    });
    this.approvalState = this.dataService.approvalState;
    this.edit = this.dataService.editResponse;
    if (this.edit && !this.dataService.todoOrigin) {
      this.loading = true;
      let supplierIds = this.dataService.reviewSession.suppliers.split(",").map(function (supplierId) {
        return parseInt(supplierId, 10);
      });
      this.route.data.subscribe(v => {
        this.http.get(environment.nodeurl + '/api/supplier/allSuppliersTrunc')
          .subscribe((data: Supplier[]) => {
            if (data) {
              this.http.get<any>(environment.nodeurl + '/api/supplier/reviewResponsesByUser?loggedInUser=' + this.dataService.reviewSession.createdUser)
                .subscribe((responses: ReviewResponse[]) => {
                  this.reviewableSuppliers = data.filter(function (supplier) {
                    supplier.status = 'to do'
                    return supplierIds.includes(supplier.supplierID)
                  });
                  if (responses) {
                    responses.forEach((response: ReviewResponse) => {
                      //if (response.conductedUser.toLowerCase() == localStorage.getItem("username").toLowerCase() && response.reviewSessionId == this.reviewSessionId && response.status != this.reviewResponseCreatedState) {
                      if (response.reviewSessionId == this.reviewSessionId && response.status != this.reviewResponseCreatedState) {
                        this.reviewableSuppliers.forEach((supplier: Supplier) => {
                          if (supplier.supplierID == response.supplierId) {
                            supplier.status = 'done'
                          }
                        })
                      }
                    })
                  }
                  this.loading = false;
                });
            }
          });
      }
      );
    }

    this.http.get(environment.nodeurl + '/api/supplier/reviewApproversByReviewResponse?reviewResponseId=' +
      this.reviewResponseId)
      .subscribe((data: ReviewApprover[]) => {
        if (data) {
          var approversTemp = data;
          approversTemp.sort((a, b) => (a.id > b.id) ? 1 : -1)
          let lastVPFound = false;
          let lastGMFound = false;
          approversTemp.forEach((approver)=>{
            if (approver.stepNo==this.THIRD_APPROVER_STEP && lastGMFound==false){
              if (approver.status==this.reviewApproverReinitiatedState){
                this.reinitiatedByGMVP = true;
              }
              lastGMFound = true;
            }
            else if (approver.stepNo==this.FOURTH_APPROVER_STEP && lastVPFound==false){
              if (approver.status==this.reviewApproverReinitiatedState){
                this.reinitiatedByGMVP = true;
              }
              lastVPFound = true;
            } 
          })
          for (let i = 0; i < approversTemp.length / this.APPROVER_COUNT; i++) {
            let approversInstance = approversTemp.slice(i * this.APPROVER_COUNT, i * this.APPROVER_COUNT + this.APPROVER_COUNT).sort((a, b) => (a.stepNo > b.stepNo) ? 1 : -1);
            let approversInstanceTemp = [];
            let ignore = false;
            approversInstance.forEach((approver) => {
              if (!ignore) {
                approversInstanceTemp.push(approver);
              }
              if (approver.status == this.reviewApproverReinitiatedState) {
                ignore = true;
              }
            })
            this.approvers = this.approvers.concat(approversInstanceTemp);
          }

          let found = false;
          let approversForFlowChart = [...this.approvers];
          for (var i = 0, len = this.approvers.length; i < len; i++) {
            let approver = this.approvers[i];
            let index = this.approverNames.indexOf(approver.approverName)
            if (index > -1) {
              this.approverNames.splice(index, 1);
              this.approverRoles.splice(index, 1);
              approversForFlowChart.splice(index, 1);
            }
            this.approverNames.push(approver.approverName);
            this.approverRoles.push(approver.role);
          }
          for (var i = 0, len = approversForFlowChart.length; i < len; i++) {
            let approver = approversForFlowChart[i];
            if (!found && approver.status != this.reviewApproverWaitingState) {
              this.stepIndex += 1;
            }
            else {
              found = true;
            }
          }
          found = false;
          for (var i = 0, len = approversForFlowChart.length; i < len; i++) {

            let approver = approversForFlowChart[i];
            if (found == true) {
              this.nextApprover = approver;
              break;
            }
            if (approver.status == this.reviewApproverWaitingState) {
              if (approver.approverName.toLowerCase() == localStorage.getItem("username").toLowerCase()) {
                this.approverLoggedIn = true;
                this.currentApprover = approver;
                found = true;
              }
            }
          };
        }
      });



  }

  ngOnInit(): void {
    if (this.reviewResponseId != 0) {
      this.loadReview()
    }
    else {
      this.reviewSessionId = this.dataService.reviewSession.id;
    }
    this.approvalState = this.dataService.approvalState;
    this.http.get(environment.nodeurl + '/api/supplier/reviewSession?reviewSessionId=' +
      this.reviewSessionId)
      .subscribe((data: ReviewSession) => {
        if (data) {
          this.reviewSession = data;
          if (this.reviewSession.assignType != this.usersAssignMethod) {
            this.userGroupService.getUserGroupInfo().subscribe((data1: any) => {
              if (data1) {
                this.userGroupDetails = data1;
                this.userGroupService.fetchUserGroups().subscribe((data: any) => {
                  if (data) {
                    this.userGroups = data;
                  }
                })
              }
            })
          }
        }
      })
  }

  updateReviewData(data) {
    this.dataService.reviewResponse = data;
    this.review = data;
    if (this.review.status != this.reviewResponseCreatedState) {
      this.edit = 0;
    }
    this.formData.formTitle = data.title;
    this.formData.formSubTitle = data.title;

    this.form = JSON.parse(data.review);
    this.formData.formTitle = data.title;
    this.formData.formSubTitle = data.subtitle;
    this.service.reviewResponseId = this.reviewResponseId;
    this.formData.logoUrl = this.service.defaultLogo;
    this.formData.bannerUrl = this.service.defaultBanner;
    this.logoFileName = data.logo;
    this.bannerFileName = data.banner;
    this.formData.logoUrl = this.logoFileName
      ? this.service.fileDownloadUrl + '?fileName=' + data.formId + '_logo_' + this.logoFileName
      : this.service.defaultLogo;
    this.formData.bannerUrl = this.bannerFileName
      ? this.service.fileDownloadUrl + '?fileName=' + data.formId + '_banner_' + this.bannerFileName
      : this.service.defaultBanner;

    if (data.periodType == this.customTypePeriod) {
      data.presetPeriod = data.startDate.slice(0, 10).toString() + " to " + data.endDate.slice(0, 10).toString()
    }
    let reviewerDetails = [
      { title: 'Reviewer Name', value: data.conductedUser },
      { title: 'Supplier Name', value: data.supplierName },
      { title: 'Review Period', value: data.presetPeriod },
      { title: 'Review Year', value: data.reviewYear },
      { title: 'Requested By', value: data.createdUser },
      { title: 'Assigned Date', value: data.createdDate },
    ];
    this.formData.ReviewerDetails = reviewerDetails;
  }
  loadReview() {
    this.http.get<any>(environment.nodeurl + '/api/supplier/reviewResponse?reviewResponseId=' + this.reviewResponseId)
      .subscribe(data => {
        this.updateReviewData(data);
  
      });

  }
  loadSupplierReview(event) {
    var user_id = localStorage.getItem("username");
      this.http.get<any>(environment.nodeurl + '/api/supplier/reviewResponseBySessionAndUser?conducteduserid=' + user_id + '&&reviewsessionid=' + this.reviewSessionId + '&&supplierid=' + event.value)
        .subscribe(data => {
          if (data && data.id != 0) {
            this.reviewResponseId = data.id;
            this.updateReviewData(data)
          }
        });
    this.showLegends = true;
  }


  goBack() {
    if (this.dataService.todoOrigin == 1) {
      this.dataService.landingTab = Tabs.Review_Todos;
    }
    else if (this.dataService.summaryView == 1) {
      this._location.back()
    }
    else if (this.approvalState == 0) {
      this.dataService.landingTab = Tabs.Review_Sessions;
    }
    else {
      this.dataService.landingTab = Tabs.Review_Responses;
    }
    this.router.navigate(['/supplier-reviews']);
  }

  saveReview(event: any) {
    const onValidity: boolean = event.flatMap(x => x.items).some(x => x.invalid && !x.comment);
    if (event && event.length > 0 && onValidity) {
      const data: [] = [];
      data['title'] = 'Error';
      data['message'] = 'Comment is required.';
      data['dismissible'] = true;
      data['color'] = 'warn';
      data['icon'] = 'heroicons_outline:exclamation';
      this.showPopup(data);

      return;
    } else {
      this.loading = true;
      this.review.review = JSON.stringify(this.form);
      this.review.status = this.reviewResponseUpdatedState;
      this.http.post<any>(environment.nodeurl + '/api/supplier/reviewResponse', this.review)
        .subscribe(data => {
          let period;
          if (this.review.periodType == this.presetTypePeriod) {
            period = this.review.presetPeriod + ", " + this.review.reviewYear
          }
          else {
            period = this.review.startDate.toString().slice(0, 10) + " to " + this.review.endDate.toString().slice(0, 10);
          }
          this.http.post<any>(environment.nodeurl + '/api/email/responseReceivedMail?supplierName=' + this.review.supplierName + '&period=' + period + '&reviewer=' + this.review.conductedUser
            + '&sessionCreator=' + this.review.createdUser + '&evaluationName=' + this.review.evaluationName, null)
            .subscribe(data => {
              this.service.uploadFileToServer(this.reviewResponseId);
              this.router.navigate(['/supplier-reviews'], { queryParams: { tab: 'todos' } });
              this.sendForApproval(this.review)
              this.loading = false;
            })

        });
    }
  }

  sendForApproval(reviewResponse) {
    this.loading = true;
    reviewResponse.status = this.reviewResponseApprovalWaitingState;
    // this.http.get(environment.nodeurl + '/api/supplier/reviewApproversByReviewResponse?reviewResponseId=' + reviewResponse.id)
    //   .subscribe((data: ReviewApprover[]) => {
        this.addApproverRecords(reviewResponse).subscribe(responseList => {
          reviewResponse.approvalInitiationDate = (new Date()).toDateString();
          this.loading = false;
        })
        // }
      // })
  }

  public addApproverRecords(reviewResponse): Observable<any[]> {
    let approver1: ReviewApprover = {
      approverId: 1001,
      approverName: reviewResponse.supervisorName,
      reviewResponseId: reviewResponse.id,
      status: this.reviewApproverWaitingState,
      stepNo: this.FIRST_APPROVER_STEP,
      role: "Supervisor",
      type: "individual",
      email: reviewResponse.supervisorEmail

    };

    let app1 = this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', approver1) 
    let approver2: ReviewApprover = {
      approverId: 1002,
      approverName: reviewResponse.createdUser,
      reviewResponseId: reviewResponse.id,
      status: this.reviewApproverCreatedState,
      stepNo: this.SECOND_APPROVER_STEP,
      role: "SRM Analyst",
      type: "individual",
      email: reviewResponse.createdEmail

    };
    let app2 = this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', approver2)
    

    let approver3: ReviewApprover = {	
      approverId: 1003,	
      approverName: "Faisal2",	
      reviewResponseId: reviewResponse.id,	
      status: this.reviewApproverCreatedState,	
      stepNo: this.THIRD_APPROVER_STEP,	
      role: "General Manager",	
      type: "individual",	
      email: "faisal_otaibi2@yopmail.com"	
    };	
    let app3 = this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', approver3)	
    	
    let approver4: ReviewApprover = {	
      approverId: 1004,	
      approverName: "Abdullah2",	
      reviewResponseId: reviewResponse.id,	
      status: this.reviewApproverCreatedState,	
      stepNo: this.FOURTH_APPROVER_STEP,	
      role: "Vice President",	
      type: "individual",	
      email: "abdullah_muhannah@yopmail.com"	
    };	
    let app4 = this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', approver4)

    if (reviewResponse.periodType == this.presetTypePeriod) {
      var period = reviewResponse.presetPeriod + ", " + reviewResponse.reviewYear
    }
    else {
      period = reviewResponse.startDate.toString().slice(0, 10) + " to " + reviewResponse.endDate.toString().slice(0, 10);
    }
    let result1 = this.http.post<any>(environment.nodeurl + '/api/email/reviewsApprovalMail?supplierName=' + reviewResponse.supplierName
      + '&period=' + period + '&approverEmail=' + approver1.email + '&approverName=' + approver1.approverName + '&evaluationName=' + reviewResponse.evaluationName
      + '&reviewer=' + reviewResponse.conductedUser + '&reviewResponseId=' + this.review.id, null);
    //update status of reviewResponse
   let result2 = this.http.post<any>(environment.nodeurl + '/api/supplier/reviewResponse', this.review)
   return forkJoin([result1, result2, app1, app2, app3, app4]);
  }

  approveReview(): void {
    this.loading = true;
    const dialogRef = this.dialog.open(ReviewApprovalOverlayComponent, { disableClose: true });
    dialogRef.addPanelClass('inline-md-overlay');
    let instance = dialogRef.componentInstance;
    instance.approver = this.currentApprover.approverName;
    dialogRef.afterClosed().subscribe(result => {
      if (instance.issuccess) {
        dialogRef.close();
        this.currentApprover.status = this.reviewApproverApprovedState;
        this.currentApprover.comments = instance.comment;
        this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', this.currentApprover)
          .subscribe(data => {
            if (this.nextApprover != null) {
              this.nextApprover.status = this.reviewApproverWaitingState;
              this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', this.nextApprover)
                .subscribe(data => {
                  if (this.review.periodType == this.presetTypePeriod) {
                    var period = this.review.presetPeriod + ", " + this.review.reviewYear
                  }
                  else {
                    period = this.review.startDate.toString().slice(0, 10) + " to " + this.review.endDate.toString().slice(0, 10);

                  }
                  this.http.post<any>(environment.nodeurl + '/api/email/reviewsApprovalMail?supplierName=' + this.review.supplierName +
                    '&period=' + period + '&approverEmail=' + this.nextApprover.email + '&approverName=' + this.nextApprover.approverName + '&evaluationName=' + this.review.evaluationName +
                    '&reviewer=' + this.review.conductedUser + '&reviewResponseId=' + this.review.id, null)
                    .subscribe(data => {
                      this.stepIndex += 1;
                      this.approverLoggedIn = false;
                      this.loading = false;
                    })
                })
            }
            else {
              this.review.status = this.reviewResponseApprovedState;
              this.http.post<any>(environment.nodeurl + '/api/supplier/reviewResponse', this.review)
                .subscribe(data => {
                  this.stepIndex += 1;
                  this.approverLoggedIn = false;
                  this.loading = false;
                })
              // });
            }
          })
      }
      else {
        this.loading = false;
      }
    });
  }

  rejectReview(): void {
    const dialogRef = this.dialog.open(ReviewRejectionOverlayComponent, { disableClose: true });
    dialogRef.addPanelClass('inline-md-overlay');
    let instance = dialogRef.componentInstance;
    instance.approver = this.currentApprover.approverName;
    dialogRef.afterClosed().subscribe(result => {
      if (instance.issuccess) {
        dialogRef.close();
        this.currentApprover.status = this.reviewApproverRejectedState;
        this.currentApprover.comments = instance.comment;
        this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', this.currentApprover)
          .subscribe(data => {
            this.review.status = this.reviewResponseRejectedState
            this.http.post<any>(environment.nodeurl + '/api/supplier/reviewResponse', this.review)
              .subscribe(data => {
                this.approverLoggedIn = false;
                this.http.get(environment.nodeurl + '/api/supplier/reviewOutcomeBySupplier?sessionId=' + this.review.reviewSessionId + "&&supplierId=" +
                  this.review.supplierId)
                  .subscribe((data: ReviewOutcome[]) => {
                    if (data) {
                      var period;
                      if (this.review.periodType == this.presetTypePeriod) {
                        period = this.review.presetPeriod + ", " + this.review.reviewYear
                      }
                      else {
                        period = this.review.startDate.toString().slice(0, 10) + "-" + this.review.endDate.toString().slice(0, 10);
                      }
                      let priorApproversEmails = this.currentApprover.email;
                      this.approvers.forEach((approver) => {
                        if (approver.stepNo < this.currentApprover.stepNo) {
                          priorApproversEmails += ',' + approver.email;
                        }
                      })
                      let ccReceivers = this.review.createdEmail + "," + priorApproversEmails;
                      this.http.post<any>(environment.nodeurl + '/api/email/rejectionReviewerEmail?supplierName=' + this.review.supplierName + '&period=' + period + '&reviewer=' + this.review.conductedUser
                        + '&ccReceiverEmails=' + ccReceivers + '&evaluationName=' + this.review.evaluationName + '&comment=' + instance.comment, null)
                        .subscribe(data => {
                          this.supplierReviewService.calculateOutcome(data[0])
                        })
                    }
                  })
              });
          })
      }
    });
  }

  handleGMVPReinitiation(){
    let newTodo: ReviewTodo = {
      actionTakerUsername: this.review.createdUser,
      actionType: this.supplierReviewalActionType,
      reviewResponseId: this.reviewResponseId,
      status: this.reviewTodoCreatedState
  };
    this.http.post<any>(environment.nodeurl + '/api/supplier/reviewToDo', newTodo)
    .subscribe(data => {
      this.loading = false;
      this.router.navigate(['/supplier-reviews'], { queryParams: { tab: 'todos' } });
    })}

  canInformReviewer(){
    if (localStorage.getItem("username").toLowerCase()==this.review?.createdUser.toLowerCase() && this.reinitiatedByGMVP && this.approvalState!=1){
        return true;
      }
      return false;
    }
  updateReviewerOnReinitiation(comment="Requested by SRM Analyst"){
    this.loading = true;
      // inform reviewer and prior approvers about reinitiation, create review todo for reviewer
      if (!this.currentApprover){
        this.currentApprover = this.approvers[1];
      }
      let priorApproversEmails = this.currentApprover.email;
      this.approvers.forEach((approver) => {
        if (approver.stepNo < this.currentApprover.stepNo) {
          priorApproversEmails += ',' + approver.email;
        }
      })
      var period;
      if (this.review.periodType == this.presetTypePeriod) {
        period = this.review.presetPeriod + ", " + this.review.reviewYear
      }
      else {
        period = this.review.startDate.toString().slice(0, 10) + "-" + this.review.endDate.toString().slice(0, 10);
      }
      let ccReceivers = this.review.createdEmail + "," + priorApproversEmails;
      this.http.post<any>(environment.nodeurl + '/api/email/reinitiationReviewerEmail?supplierName=' + this.review.supplierName + '&period=' + period + '&reviewer=' + this.review.conductedUser
        + '&ccReceiverEmails=' + ccReceivers + '&evaluationName=' + this.review.evaluationName + '&reviewResponseId=' + this.review.id + '&comment=' + comment, null)
        .subscribe(data => {
          if (comment=="Requested by SRM Analyst"){
            console.log("havr to update todo")
            this.dataService.currentToDo.status = this.reviewTodoCompletedState;
            this.http.post<any>(environment.nodeurl + '/api/supplier/reviewToDo',  this.dataService.currentToDo)
            .subscribe(data => {
              this.loading = false;
              this.router.navigate(['/supplier-reviews'], { queryParams: { tab: 'todos' } });
            })
          }
          else{
            this.loading = false;
            this.router.navigate(['/supplier-reviews'], { queryParams: { tab: 'todos' } });
          }

        })
  }
  reinitiateReview(): void {
    this.loading = true;
    // opens dialog for user to fill-in reinitiate reason and confirm
    const dialogRef = this.dialog.open(ReviewReinitiationOverlayComponent, { disableClose: true });
    dialogRef.addPanelClass('inline-md-overlay');
    let instance = dialogRef.componentInstance;
    dialogRef.afterClosed().subscribe(result => {
      if (instance.issuccess) {
        this.currentApprover.status = this.reviewApproverReinitiatedState;
        this.currentApprover.comments = instance.comment;
        // update current approver's state and comment
        this.http.post<any>(environment.nodeurl + '/api/supplier/reviewApprover', this.currentApprover)
          .subscribe(data => {
            if (this.currentApprover.stepNo == this.THIRD_APPROVER_STEP || 
              this.currentApprover.stepNo == this.FOURTH_APPROVER_STEP){
                  this.handleGMVPReinitiation();
              }
            else{
              this.updateReviewerOnReinitiation(instance.comment);
            }

          })
      }
      else {
        this.loading = false;
      }
    })
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

