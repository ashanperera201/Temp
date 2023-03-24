/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable quotes */
/* eslint-disable arrow-parens */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
import { Component, Input, OnInit, Output, EventEmitter, OnDestroy,ChangeDetectorRef, NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RFQApprovalViewModel } from 'app/main/Models/etendering/ViewModels/rfq-approval-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ApprovalConfirmationOverlayComponent } from '../../approval-confirmation-overlay/approval-confirmation-overlay.component';
import { RejectionConfirmationOverlayComponent } from '../../rejection-confirmation-overlay/rejection-confirmation-overlay.component';
import { RowData172, RowData182, RowData20, RowData4, RowData432, RowData622, RowData722, RowData822, RowData9, RowData932 } from '../../rfq.component';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApplicationLoaderComponent } from '../../../../../shared/components/application-loader/application-loader.component';


@Component({
  selector: 'app-commercial-bid-evaluation-header-view',
  templateUrl: './commercial-bid-evaluation-header-view.component.html',
  styleUrls: ['./commercial-bid-evaluation-header-view.component.scss']
})

export class CommercialBidEvaluationHeaderViewComponent implements OnInit, OnDestroy {
  @Output() rfqUpdated = new EventEmitter<{ rfqModel: RFQViewModel }>();
  @Input() dataSource20: MatTableDataSource<RowData20>;
  @Input() dataSource172: MatTableDataSource<RowData172>;
  @Input() dataSource182: MatTableDataSource<RowData182>;
  @Input() dataSource4: MatTableDataSource<RowData4>;
  @Input() dataSource432: MatTableDataSource<RowData432>;
  @Input() dataSource622: MatTableDataSource<RowData622>;
  @Input() dataSource722: MatTableDataSource<RowData722>;
  @Input() dataSource822: MatTableDataSource<RowData822>;
  @Input() dataSource9: MatTableDataSource<RowData9>;
  @Input() dataSource932: MatTableDataSource<RowData932>;

  displayedColumn: string[] = ['stepNumber', 'id', 'name', 'address', 'status', 'template', 'justification'];
  displayedColumn2: string[] = ['pefno', 'revno', 'by', 'action', 'status2', 'timestamp'];
  displayedColumn22: string[] = ['supId', 'supName', 'supContact', 'supEmail', 'supResponse', 'supTechEval', 'supComEval', 'supRank'];
  displayedColumn4: string[] = ['id', 'payno', 'description2', 'type2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'visibility'];
  displayedColumn42: string[] = ['payno', 'description2', 'sheduleType', 'downPaymentType', 'milestone', 'work', 'payment', 'retention', 'release', 'releasevalue', 'dueDate'];
  displayedColumn43: string[] = ['payno', 'description2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'comment'];
  displayedColumn432: string[] = ['tbepayno', 'tbedescription2', 'sheduleType', 'downPaymentType', 'milestone', 'tbework', 'tbepayment', 'tberetention', 'tberelease', 'tbereleasevalue', 'dueDate', 'tbeweight432', 'tbescore', 'tbeevaluation', 'tbecomments2432'];
  displayedColumn5: string[] = ['id', 'no', 'termsname', 'inputtype', 'preview', 'type3', 'editable', 'default', 'beforequote', 'endquote'];
  displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
  displayedColumn62: string[] = ['srno', 'title', 'filename', 'attachment', 'atttype', 'attachment2', 'comment'];
  displayedColumn622: string[] = ['srno622', 'title622', 'filename622', 'attachment622', 'reference622', 'attachment2622', 'comment622', 'tbeweight622', 'tbescore622', 'tbeevaluation622', 'tbecomments622'];
  displayedColumn7: string[] = ['id', 'docsrno', 'outputtype', 'documentext', 'type3', 'visibility3'];
  displayedColumn72: string[] = ['documentext', 'documentext2', 'comment'];
  displayedColumn722: string[] = ['dtno', 'outputtype', 'documentext722', 'documentext2722', 'comment722', 'tbeweight722', 'tbescore722', 'tbeevaluation722', 'tbecomments722'];
  displayedColumn8: string[] = ['id', 'notesrno', 'notes', 'type4', 'visibility4'];
  displayedColumn82: string[] = ['notes', 'notes2', 'comment'];
  displayedColumn822: string[] = ['notesrno', 'notes822', 'notes2822', 'comment822', 'tbeweight822', 'tbescore822', 'tbeevaluation822', 'tbecomments822'];
  displayedColumn9: string[] = ['id', 'milestonenumber', 'milestonename', 'deliverabledescription', 'type5', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'visibility5'];
  displayedColumn92: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate'];
  displayedColumn93: string[] = ['milestonenumber', 'milestonename', 'deliverabledescription', 'prevmilestonenumber', 'progresspercentage', 'stagepercentage', 'begindate', 'comment'];
  displayedColumn932: string[] = ['milestonenumber932', 'milestonename932', 'deliverabledescription932', 'prevmilestonenumber932', 'progresspercentage932', 'stagepercentage932', 'begindate932', 'comment932', 'tbeweight932', 'tbescore932', 'tbeevaluation932', 'tbecomments932'];
  displayedColumn11: string[] = ['id', 'linesprno', 'lineno', 'partid', 'partdescription', 'uom', 'needbydate', 'startprice', 'targetprice', 'showprices'];
  displayedColumn12: string[] = ['id', 'supplierId', 'supplierName', 'invitedDateTime', 'supplierContact', 'supplierEmail', 'currencies', 'acknowledged', 'supplierStatus', 'responses'];
  displayedColumn13: string[] = ['id', 'teamUserName', 'rfxRole', 'substituteName', 'accessLevel', 'pageAccess', 'teamName', 'teamDescription'];
  displayedColumn14: string[] = ['id', 'headerRules', 'headerTechnical', 'headerCommercial'];
  displayedColumn15: string[] = ['id', 'group', 'headerTechnical2', 'headerCommercial2'];
  displayedColumn16: string[] = ['id', 'resRules', 'selection'];
  displayedColumn17: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'costfactExpectedValue', 'costfactValue', 'costfactComments'];
  displayedColumn172: string[] = ['tbecostfactName', 'tbecostfactType', 'tbecostfactDesc', 'supplierType', 'tbecostfactExpectedValue', 'tbecostfactValue', 'tbecostfactComments', 'tbeweight2', 'tbescore', 'tbeevaluation', 'tbecomments2'];
  displayedColumn18: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'costfactValue', 'costfactComments'];
  displayedColumn182: string[] = ['tbecostfactName', 'tbecostfactType', 'tbecostfactDesc', 'tbecostfactValue', 'tbecostfactComments', 'tbeweight2', 'tbescore', 'tbeevaluation', 'tbecomments2'];
  displayedColumn19: string[] = ['attributeItem', 'description', 'expectedValue', 'value', 'assocCosts', 'cost', 'comments'];
  displayedColumn20: string[] = ['tbeattributeItem', 'tbedescription', 'required', 'tbeexpectedValue', 'datatype', 'tbevalue', 'tbeassocCosts', 'tbecost', 'tbecomments', 'tbeweight', 'tbescore', 'tbeevaluation', 'tbecomments2'];
  displayedColumn30: string[] = ['name', 'desc', 'type', 'supresponse', 'remarks', 'tbescore', 'tbeevaluation', 'tbecomments'];

  detailsEvaluationSupplierHeaderAttributeDisplayMap = new Map();
  detailsEvaluationSupplierHeaderCostFactorDisplayMap = new Map();
  detailsEvaluationSupplierHeaderSurveyDisplayMap = new Map();

  private value;
  private workTotal = 0;
  private paymentTotal = 0;
  private releaseValueTotal = 0;
  private supplierWorkTotal = 0;
  private supplierPaymentTotal = 0;
  private supplierReleaseValueTotal = 0;
  retentionTotal = 0;
  total = 0;
  releaseTotal = 0;
  sworkTotal = 0;
  spaymentTotal = 0;
  sretentionTotal = 0;
  stotal = 0;
  sreleaseTotal = 0;

  @Input() bidEvaluationModel: any;
  rfqId: any;
  @Input() rfqModel: RFQViewModel = new RFQViewModel();
  rfqSupplierHeaderCountryOriginModel: any = [];
  rfqSupplierHeaderInformationAttatchment;
  rfqCurrencies: any = [];
  currencies: any = [];
  destroy$ = new Subject<boolean>();
  processing: boolean = false;

  constructor(private zone: NgZone,private rfqService: RfqService, private _changeDetectorRef: ChangeDetectorRef, public dialog: MatDialog, private termsService: TermsService) { }

  ngOnInit() {
    if (this.bidEvaluationModel) {
      if (this.bidEvaluationModel.rfqSupplierHeaderInformationModel) {
        if (this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierHeaderCountryOrigin) {
          this.rfqSupplierHeaderCountryOriginModel = this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierHeaderCountryOrigin;
        }
        if (this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierHeaderInformationAttatchments) {
          this.rfqSupplierHeaderInformationAttatchment = this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierHeaderInformationAttatchments[0];
        }
      }
      if(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules) {
        this.findsum1(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules);
        this.findsum2(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules);
      }
    }
    //this.fetchRFQCurrency();
    this.fetchCurrency();
  }

  isShow = true;
  isShow2 = true;

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  toggleDisplay2() {
    this.isShow2 = !this.isShow2;
  }

  saveAsDraft() {
    let prevStatus = this.bidEvaluationModel.statusName;
    this.bidEvaluationModel.statusName = 'CBE in Progress';
    this.isSaving = true;
    this.rfqService.saveBeedEvaluation(this.bidEvaluationModel).subscribe(result => {
      if (result.data.success == true) {
        this.rfqModel = result.data.rfqModel;
        Swal.fire({
          icon: 'success',
          position: "center",
          title: 'Success',
          html: this.GetErrorOrderedList(result.data.errors),
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.isSaving = false;
            this.rfqUpdated.emit({ rfqModel: this.rfqModel });
            // this.getRFQById(this.rfqId);
            // this.fetchRFXHistoryData();         
          }
        });
      }
      else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          html: this.GetErrorOrderedList(result.data.errors),
          customClass: {
            container: 'display-list'
          },
          target: '#error-alert'
        });
        this.bidEvaluationModel.statusName = prevStatus;
        this.isSaving = false;
      }
    });
  }

  beedEvaluation() {
    // this.bidEvaluationModel.rFQId = 'F1E764E6-DD24-476C-B516-08D95FA0982A';
    // this.bidEvaluationModel.supplierId = '3FA85F64-5717-4562-B3FC-2C963F66AFB6';
    // this.bidEvaluationModel.attributeCategoryName = 'Commercial';
    // //debugger;
    // this.rfqService.getBeedEvaluation(this.bidEvaluationModel).subscribe(result => {
    //   this.bidEvaluationModel = result.data;
    //   this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules = result.data.rfqEvaluationSupplierHeaderPaymentSchedules;

    //   for (let k = 0; k < result.data.rfqEvaluationSupplierHeaderPaymentSchedules.length; k++) {
    //     this.findWorkSum(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
    //     this.findPaymentSum(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
    //     this.findReleaseValueSum(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
    //     this.findSupplierWorkSum(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
    //     this.findSupplierPaymentSum(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
    //     this.findSupplierReleaseValueSum(this.bidEvaluationModel.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
    //   }
    //   console.log("this.bidEvaluationModel");
    //   console.log(this.bidEvaluationModel);

    // });
  }

  isSaving: boolean = false;

  submit() {
    this.isSaving = true;
    let prevStatus = this.bidEvaluationModel.statusName;
    this.bidEvaluationModel.statusName = 'CBE Submitted';
    this.rfqService.saveBeedEvaluation(this.bidEvaluationModel).subscribe(result => {
      if (result.data.success == true) {
        this.rfqModel = result.data.rfqModel;
        Swal.fire({
          icon: 'success',
          position: "center",
          title: 'Success',
          html: this.GetErrorOrderedList(result.data.errors),
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.isSaving = false;
            this.rfqUpdated.emit({ rfqModel: this.rfqModel });
            // this.getRFQById(this.rfqId);
            // this.fetchRFXHistoryData();      
          }
        });
      }
      else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          html: this.GetErrorOrderedList(result.data.errors),
          customClass: {
            container: 'display-list'
          },
          target: '#error-alert'
        });
        this.bidEvaluationModel.statusName = prevStatus;
        this.isSaving = false;
      }
    });
  }

  RFQSendForApproval = (): void => {
    this.processing = true;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    let rfqApprovalViewModel = new RFQApprovalViewModel();
    rfqApprovalViewModel.rFQId = this.rfqModel.id;
    //rfqApprovalViewModel.approvalId = "B575E739-17BE-4545-9224-05AE05A2C68F";
    rfqApprovalViewModel.statusName = "Approval Pending";
    rfqApprovalViewModel.statusType = "CBE";
    rfqApprovalViewModel.approvalType = "CBE";

    this.rfqService.SendForApproval(rfqApprovalViewModel).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result) {
            setTimeout(() => {
              refference.close();
              if (result.data.isSuccess == false) {

                Swal.fire({
                  icon: 'error',
                  position: "center-start",
                  title: 'Error',
                  html: result.data.responseMessage,
                  customClass: {
                    container: 'display-list'
                  },
                  target: '#error-alert'
                });
              }
              else {

                Swal.fire({
                  icon: 'success',
                  position: "center",
                  title: 'Success',
                  html: result.data.responseMessage
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    this.rfqUpdated.emit({ rfqModel: this.rfqModel });
                  }
                });
              }
            }, 1000);
          }
        },
        error: (error) => {
          console.log(error);
        }
      });
  }

  // Parent child relationship between Attribute groups and items
  toggleDisplayEvaluationSupplierHeaderAttribute(id: string) {
    var existingVal = this.detailsEvaluationSupplierHeaderAttributeDisplayMap.get(id);
    if (existingVal) {
      this.detailsEvaluationSupplierHeaderAttributeDisplayMap.set(id, !existingVal)
    } else {
      this.detailsEvaluationSupplierHeaderAttributeDisplayMap.set(id, true)
    }
  }

  getactiveDetailsEvaluationSupplierHeaderAttributeTab(id: string): boolean {
    return this.detailsEvaluationSupplierHeaderAttributeDisplayMap.get(id) ? this.detailsEvaluationSupplierHeaderAttributeDisplayMap.get(id) : false;
  }

  // Parent child relationship between cost factor groups and items
  toggleDisplayEvaluationSupplierHeaderCostFactor(id: string) {
    var existingVal = this.detailsEvaluationSupplierHeaderCostFactorDisplayMap.get(id);
    if (existingVal) {
      this.detailsEvaluationSupplierHeaderCostFactorDisplayMap.set(id, !existingVal)
    } else {
      this.detailsEvaluationSupplierHeaderCostFactorDisplayMap.set(id, true)
    }
  }

  getactiveDetailsEvaluationSupplierHeaderCostFactorTab(id: string): boolean {
    return this.detailsEvaluationSupplierHeaderCostFactorDisplayMap.get(id) ? this.detailsEvaluationSupplierHeaderCostFactorDisplayMap.get(id) : false;
  }

  toggleDisplayEvaluationSupplierHeaderSurvey(id: string) {
    var existingVal = this.detailsEvaluationSupplierHeaderSurveyDisplayMap.get(id);
    if (existingVal) {
      this.detailsEvaluationSupplierHeaderSurveyDisplayMap.set(id, !existingVal)
    } else {
      this.detailsEvaluationSupplierHeaderSurveyDisplayMap.set(id, true)
    }
  }

  getactiveDetailsEvaluationSupplierHeaderSurveyTab(id: string): boolean {
    return this.detailsEvaluationSupplierHeaderSurveyDisplayMap.get(id) ? this.detailsEvaluationSupplierHeaderSurveyDisplayMap.get(id) : false;
  }

  findWorkSum(data) {
    this.value = data;
    this.workTotal += this.value.workPercentage;
  }

  findPaymentSum(data) {
    this.value = data;
    this.paymentTotal += this.value.paymentPercentage;
  }

  findReleaseValueSum(data) {
    this.value = data;
    this.releaseValueTotal += this.value.releaseValue;
  }

  findSupplierWorkSum(data) {
    this.value = data;
    this.supplierWorkTotal += this.value.workPercentage;
  }

  findSupplierPaymentSum(data) {
    this.value = data;
    this.supplierPaymentTotal += this.value.paymentPercentage;
  }

  findSupplierReleaseValueSum(data) {
    this.value = data;
    this.supplierReleaseValueTotal += parseInt(this.value.releasevalue);
  }

  findsum1(data) {
    let workTotalTemp = 0, paymentTotolTemp = 0, retentionTotalTemp = 0, releaseTotalTemp = 0;
    this.workTotal = this.paymentTotal = this.retentionTotal = this.total = this.releaseTotal = 0;

    for (let j = 0; j < data.length; j++) {
      workTotalTemp += Number(data[j].rfqHeaderPaymentSchedule.workPercentage);
      paymentTotolTemp += Number(data[j].rfqHeaderPaymentSchedule.paymentPercentage);
      retentionTotalTemp += Number(data[j].rfqHeaderPaymentSchedule.retentionPercentage);
      releaseTotalTemp += Number(data[j].rfqHeaderPaymentSchedule.releasePercentage);
      this.total += Number(data[j].rfqHeaderPaymentSchedule.releaseValue);
    }
    if (data.length > 0) {
      this.workTotal = workTotalTemp;
      this.paymentTotal = paymentTotolTemp;
      this.retentionTotal = retentionTotalTemp;
      this.releaseTotal = releaseTotalTemp;
    }
  }

  findsum2(data) {
    let sworkTotalTemp = 0, spaymentTotolTemp = 0, sretentionTotalTemp = 0, sreleaseTotalTemp = 0;
    this.sworkTotal = this.spaymentTotal = this.sretentionTotal = this.stotal = this.sreleaseTotal = 0;
    for (let j = 0; j < data.length; j++) {
      sworkTotalTemp += Number(data[j].rfqSupplierHeaderPaymentSchedule.workPercentage);
      spaymentTotolTemp += Number(data[j].rfqSupplierHeaderPaymentSchedule.paymentPercentage);
      sretentionTotalTemp += Number(data[j].rfqSupplierHeaderPaymentSchedule.retentionPercentage);
      sreleaseTotalTemp += Number(data[j].rfqSupplierHeaderPaymentSchedule.relesePercentage);
      this.stotal += Number(data[j].rfqSupplierHeaderPaymentSchedule.releasevalue);

      if (data.length > 0) {
        this.sworkTotal = sworkTotalTemp;
        this.spaymentTotal = spaymentTotolTemp;
        this.sretentionTotal = sretentionTotalTemp;
        this.sreleaseTotal = sreleaseTotalTemp;
      }
    }
  }

  cBEHeaderApprovalConfirm() {
    const dialogRef = this.dialog.open(ApprovalConfirmationOverlayComponent, {
      height: 'auto',

      data: {
        id: "00000000-0000-0000-0000-000000000000",
        // approver: 'Udaraa', 
        // activity: '123#456',
        rfqId: this.rfqModel.id,
        approvalType: "CBE"
      },
      disableClose: true
    });
    this.zone.runOutsideAngular(() => {
    
    dialogRef.afterClosed().subscribe(result => {
      
      this.rfqModel.isCBEApproved=!result.issuccess;
      

      if (result.issuccess == true) {
        
            this.zone.run(() => {
              this.rfqModel.approvalType="CBE";
             this._changeDetectorRef.detectChanges();
             
              this.rfqUpdated.emit({ rfqModel: this.rfqModel });
            });
          
        
        
      }
    });
  });
  }

  cBEHeaderRejectionConfirm() {
    const dialogRef = this.dialog.open(RejectionConfirmationOverlayComponent, {
      height: 'auto',

      data: {
        id: "00000000-0000-0000-0000-000000000000",
        // approver: 'Udaraa', 
        // activity: '123#456' ,
        rfqId: this.rfqId,
        approvalType: "CBE"
      },
      disableClose: true

    });
    this.zone.runOutsideAngular(() => {
    dialogRef.afterClosed().subscribe(result => {
      this.rfqModel.isCBEApproved=!result.issuccess;
      this._changeDetectorRef.detectChanges();
      this.zone.run(() => {
        this.rfqModel.approvalType="CBE";
       this._changeDetectorRef.detectChanges();
       
        this.rfqUpdated.emit({ rfqModel: this.rfqModel });
      });
    });
  });
  }

  fetchRFQCurrency() {
    this.rfqService.GetRFQCurrencyByRFQId(this.bidEvaluationModel.rfqId).subscribe((result) => {
      this.rfqCurrencies = result.data;
    });
  }

  fetchCurrency() {
    this.rfqService.getCurrency(this.bidEvaluationModel.rfqId).subscribe((result) => {
      this.currencies = result.data.result;
    });
  }

  DownloadHeaderInformationAttatchmentMedia(row) {
    this.DownloadHeaderInformationAttatchmentFile(row.etMediaId, row.fileName, row.fileExtension);
  }

  DownloadHeaderInformationAttatchmentFile(id, fileName, fileExtension) {
    let eTMedia: any = { id: id }

    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }

  GetErrorOrderedList(errors: any[]) {
    var elem = document.createElement('div');

    var errorLis = "";
    for (var i = 0; i < errors.length; i++) {
      errorLis = errorLis + "<li>" + errors[i].description + "</li>";
    }
    errorLis = '<ul style="text-align: left !important" id="error-alert">' + errorLis + "</ul>";
    elem.innerHTML = errorLis;

    return elem;
  }


  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}
