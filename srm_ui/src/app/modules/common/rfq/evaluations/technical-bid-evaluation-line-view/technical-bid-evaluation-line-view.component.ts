import { Component, Input, OnInit, Output, EventEmitter,ChangeDetectorRef,NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BidEvaluationModel } from 'app/main/Models/etendering/ViewModels/bid-evaluation-model';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { ApprovalConfirmationOverlayComponent } from '../../approval-confirmation-overlay/approval-confirmation-overlay.component';
import { RejectionConfirmationOverlayComponent } from '../../rejection-confirmation-overlay/rejection-confirmation-overlay.component';
import { RfqComponent, RowData172, RowData182, RowData20, RowData4, RowData432, RowData622, RowData722, RowData822, RowData9, RowData932 } from '../../rfq.component';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { TermsService } from 'app/shared/Services/etendering/terms.service';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { RFQApprovalViewModel } from 'app/main/Models/etendering/ViewModels/rfq-approval-model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-technical-bid-evaluation-line-view',
  templateUrl: './technical-bid-evaluation-line-view.component.html',
  styleUrls: ['./technical-bid-evaluation-line-view.component.scss']
})

export class TechnicalBidEvaluationLineViewComponent implements OnInit {
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
  displayedColumn42: string[] = ['payno', 'description2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue'];
  displayedColumn43: string[] = ['payno', 'description2', 'work', 'milestone', 'payment', 'retention', 'release', 'releasevalue', 'comment'];
  displayedColumn432: string[] = ['tbepayno', 'tbedescription2', 'tbework', 'tbemilestone', 'tbepayment', 'tberetention', 'tberelease', 'tbereleasevalue', 'tbecomments432', 'tbeweight432', 'tbescore', 'tbeevaluation', 'tbecomments2432'];
  displayedColumn5: string[] = ['id', 'no', 'termsname', 'inputtype', 'preview', 'type3', 'editable', 'default', 'beforequote', 'endquote'];
  displayedColumn6: string[] = ['id', 'srno', 'title', 'filename', 'attachment', 'documentclass', 'reference', 'internalrfq', 'atttype'];
  displayedColumn62: string[] = ['srno', 'title', 'filename', 'attachment', 'atttype', 'attachment2', 'comment'];
  displayedColumn622: string[] = ['srno622', 'title622', 'filename622', 'attachment622', 'reference622', 'attachment2622', 'comment622', 'tbeweight622', 'tbescore622', 'tbeevaluation622', 'tbecomments622'];
  displayedColumn7: string[] = ['id', 'docsrno', 'outputtype', 'documentext', 'type3', 'visibility3'];
  displayedColumn72: string[] = ['documentext', 'documentext2', 'comment'];
  displayedColumn722: string[] = ['dtno','outputtype', 'documentext722', 'documentext2722', 'comment722', 'tbeweight722', 'tbescore722', 'tbeevaluation722', 'tbecomments722'];
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
  displayedColumn172: string[] = ['tbecostfactName', 'tbecostfactType', 'tbecostfactDesc', 'tbecostfactExpectedValue', 'tbecostfactValue', 'tbecostfactComments', 'tbeweight2', 'tbescore', 'tbeevaluation', 'tbecomments2'];
  displayedColumn18: string[] = ['costfactName', 'costfactType', 'costfactDesc', 'costfactValue', 'costfactComments'];
  displayedColumn182: string[] = ['tbecostfactName', 'tbecostfactType', 'tbecostfactDesc', 'tbecostfactValue', 'tbecostfactComments', 'tbeweight2', 'tbescore', 'tbeevaluation', 'tbecomments2'];
  displayedColumn19: string[] = ['attributeItem', 'description', 'expectedValue', 'value', 'assocCosts', 'cost', 'comments'];
  displayedColumn20: string[] = ['tbeattributeItem', 'tbedescription', 'required', 'tbeexpectedValue', 'datatype', 'tbevalue', 'tbeassocCosts', 'tbecost', 'tbecomments', 'tbeweight', 'tbescore', 'tbeevaluation', 'tbecomments2'];

  detailsEvaluationSupplierLineAttributeDisplayMap = new Map();
  detailsEvaluationSupplierLinesCostFactorDisplayMap = new Map();
  // For parent child relationship for Supplier Line information
  detailsSupplierLineInformationDisplayMap = new Map();

  @Input() bidEvaluationModel: any;// = new BidEvaluationModel;

  rfqId: any;
  @Input() rfqModel: RFQViewModel = new RFQViewModel();
  private value;

  private workHeaderTotal = 0;
  private paymentHeaderTotal = 0;
  private releaseValueHeaderTotal = 0;
  private supplierWorkHeaderTotal = 0;
  private supplierPaymentHeaderTotal = 0;
  private supplierReleaseValueHeaderTotal = 0;
  private workLineTotal = 0;
  private paymentLineTotal = 0;
  private releaseValueLineTotal = 0;
  private supplierWorkLineTotal = 0;
  private supplierPaymentLineTotal = 0;
  private supplierReleaseValueLineTotal = 0;
  discountType = 'Percentage';
  processOnApprovel: boolean;
  destroy$ = new Subject<boolean>();

  constructor(private zone:NgZone,private rfqService: RfqService, public dialog: MatDialog, private termsService: TermsService,private _changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit() {

    if (this.bidEvaluationModel != null) {
      this.bidEvaluationModel.rfqEvaluationSupplierPartLines.forEach(element => {
        //Attachment 
        if (this.bidEvaluationModel.rfqEvaluationSupplierLineAttachments.length > 0) {
          element.rFQEvaluationSupplierLineAttachments = this.bidEvaluationModel.rfqEvaluationSupplierLineAttachments.filter(det => det.rfqSupplierPartLineAttachment.rfqSupplierPartLineId == element.rfqSupplierPartLineModel.id)
        }
        else{
          element.rFQEvaluationSupplierLineAttachments = [];
        }

        //Attribute
        if (this.bidEvaluationModel.rfqEvaluationSupplierLineAttributeGroups.length > 0) {
          element.rfqEvaluationSupplierLineAttributeGroups = this.bidEvaluationModel.rfqEvaluationSupplierLineAttributeGroups.filter(det => det.rfqSupplierPartLineId == element.rfqSupplierPartLineModel.id)
        }
        else{
          element.rfqEvaluationSupplierLineAttributeGroups = [];
        }

        // Document Text
        if (this.bidEvaluationModel.rfqEvaluationSupplierLineDocumentTexts.length > 0) {
          element.rfqEvaluationSupplierLineDocumentTexts = this.bidEvaluationModel.rfqEvaluationSupplierLineDocumentTexts.filter(dt => dt.rfqSupplierPartLineDocumentText.rfqSupplierPartLineId == element.rfqSupplierPartLineModel.id);
        }
        else{
          element.rfqEvaluationSupplierLineDocumentTexts = [];
        }

        // Notes
        if (this.bidEvaluationModel.rfqEvaluationSupplierPartLineNotes.length > 0) {
          element.rfqEvaluationSupplierPartLineNotes = this.bidEvaluationModel.rfqEvaluationSupplierPartLineNotes.filter(note => note.rfqSupplierPartLineId == element.rfqSupplierPartLineModel.id);
        }
        else{
          element.rfqEvaluationSupplierPartLineNotes = [];
        }

        // Deleiverable
        if (this.bidEvaluationModel.rfqEvaluationSupplierLineDeliverables.length > 0) {
          element.rfqEvaluationSupplierLineDeliverables = this.bidEvaluationModel.rfqEvaluationSupplierLineDeliverables.filter(det => det.rfqSupplierPartLineDeliverable.rfqSupplierPartLineId == element.rfqSupplierPartLineModel.id)
        }
        else{
          element.rfqEvaluationSupplierLineDeliverables = [];
        }

        // Shipments
        if (this.bidEvaluationModel.rfqSupplierHeaderInformationModel && this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierPartLineCountryOrigin) {
          element.rfqSupplierPartLineCountryOriginModel = this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierPartLineCountryOrigin.filter(x => x.rfqSupplierPartLineId == element.rfqSupplierPartLineModel.id);
        }
        else{
          element.rfqSupplierPartLineCountryOriginModel = [];
        }

        //Line Information
        if (this.bidEvaluationModel.rfqSupplierHeaderInformationModel && this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierPartLineModelList) {
          this.bidEvaluationModel.rfqSupplierHeaderInformationModel.rfqSupplierPartLineModelList.forEach(x => {
            if(x.rfqPartLineId === element.rfqPartLineModel.id){
              element.rfqSupplierPartLineModel.attachmentId = x.attachmentId;
              element.rfqSupplierPartLineModel.fileName = x.fileName;
              element.rfqPartLineModel.subProject = x.rfqPartLineModel.subProject;
              element.rfqPartLineModel.activity = x.rfqPartLineModel.activity;
              element.purchaseUoMCode = x.purchaseUoMCode;
            }
          });
        }
      });
    }
  }

  isShow = true;
  isShow2 = true;

  toggleDisplay() {
    this.isShow = !this.isShow;
  }

  toggleDisplay2() {
    this.isShow2 = !this.isShow2;
  }

  beedEvaluation() {
    // this.bidEvaluationModel.rFQId = 'F1E764E6-DD24-476C-B516-08D95FA0982A';
    // this.bidEvaluationModel.supplierId = '3FA85F64-5717-4562-B3FC-2C963F66AFB6';
    // this.bidEvaluationModel.attributeCategoryName = 'Technical';
    // this.rfqService.getBeedEvaluation(this.bidEvaluationModel).subscribe(result => {
    //   //debugger;
    //   this.bidEvaluationModel = result.data;
    //   this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules = result.data.rfqEvaluationSupplierLinePaymentSchedules;

    // for (let k = 0; k < this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules.length; k++) {
    //   console.log(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule)
    //   this.findWorkSum(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
    //   this.findPaymentSum(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
    //   this.findReleaseValueSum(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
    //   this.findSupplierWorkSum(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
    //   this.findSupplierPaymentSum(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
    //   this.findSupplierReleaseValueSum(this.bidEvaluationModel.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
    // }
    //   console.log("this.bidEvaluationModel - rfqEvaluationSupplierPartLines");
    //   console.log(this.bidEvaluationModel.rfqEvaluationSupplierPartLines);

    // });
  }
  isSaving: boolean = false;
  saveAsDraft() {
    let prevStatus = this.bidEvaluationModel.statusName;
    this.bidEvaluationModel.statusName = 'TBE in Progress';
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

  // Method to expand Line information
  toggleDisplayLineInformation(id: string) {
    var existingVal = this.detailsSupplierLineInformationDisplayMap.get(id);
    if (existingVal) {
      this.detailsSupplierLineInformationDisplayMap.set(id, !existingVal)
    } else {
      this.detailsSupplierLineInformationDisplayMap.set(id, true)
    }
  }

  getactiveDetailsLineInformationTab(id: string): boolean {
    return this.detailsSupplierLineInformationDisplayMap.get(id) ? this.detailsSupplierLineInformationDisplayMap.get(id) : false;
  }

  // Parent child relationship between Attribute groups and items
  toggleDisplayEvaluationSupplierLineAttribute(id: string) {
    var existingVal = this.detailsEvaluationSupplierLineAttributeDisplayMap.get(id);
    if (existingVal) {
      this.detailsEvaluationSupplierLineAttributeDisplayMap.set(id, !existingVal)
    } else {
      this.detailsEvaluationSupplierLineAttributeDisplayMap.set(id, true)
    }
  }

  getactiveDetailsEvaluationSupplierLineAttributeTab(id: string): boolean {
    return this.detailsEvaluationSupplierLineAttributeDisplayMap.get(id) ? this.detailsEvaluationSupplierLineAttributeDisplayMap.get(id) : false;
  }

  // Parent child relationship between cost factor groups and items
  toggleDisplayEvaluationSupplierLinesCostFactor(id: string) {
    var existingVal = this.detailsEvaluationSupplierLinesCostFactorDisplayMap.get(id);
    if (existingVal) {
      this.detailsEvaluationSupplierLinesCostFactorDisplayMap.set(id, !existingVal)
    } else {
      this.detailsEvaluationSupplierLinesCostFactorDisplayMap.set(id, true)
    }
  }

  getactiveDetailsEvaluationSupplierLinesCostFactorTab(id: string): boolean {
    return this.detailsEvaluationSupplierLinesCostFactorDisplayMap.get(id) ? this.detailsEvaluationSupplierLinesCostFactorDisplayMap.get(id) : false;
  }

  workTotal: any;
  paymentTotal: any;
  releaseValueTotal: any;
  supplierWorkTotal: any;
  supplierPaymentTotal: any;
  supplierReleaseValueTotal: any;

  findWorkSum(data) {
    this.value = data;
    this.workTotal += this.value.work;
  }

  findPaymentSum(data) {
    this.value = data;
    this.paymentTotal += this.value.payment;
  }

  findReleaseValueSum(data) {
    this.value = data;
    this.releaseValueTotal += this.value.releaseValue;
  }

  findSupplierWorkSum(data) {
    this.value = data;
    this.supplierWorkTotal += this.value.work;
  }
  findSupplierPaymentSum(data) {
    this.value = data;
    this.supplierPaymentTotal += this.value.payment;
  }

  findSupplierReleaseValueSum(data) {
    this.value = data;
    this.supplierReleaseValueTotal += parseInt(this.value.releaseValue);
  }

  submit() {
    this.isSaving = true;
    let prevStatus = this.bidEvaluationModel.statusName;
    this.bidEvaluationModel.statusName = 'TBE Submitted';
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
    this.processOnApprovel = true;
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });
    let rfqApprovalViewModel = new RFQApprovalViewModel();
    rfqApprovalViewModel.rFQId = this.rfqModel.id;
    //rfqApprovalViewModel.approvalId = "98F477C2-199E-41A5-A3FD-00672C8FA078";
    rfqApprovalViewModel.statusName = "Approval Pending";
    rfqApprovalViewModel.statusType = "TBE";
    rfqApprovalViewModel.approvalType = "TBE";

    this.rfqService.SendForApproval(rfqApprovalViewModel).pipe(takeUntil(this.destroy$)).subscribe({
      next: (result) => {
        const timoutRef = setTimeout(() => {
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
          clearTimeout(timoutRef);
        }, 1500);

      }
    });
  }

  tBEHeaderApprovalConfirm() {
    const dialogRef = this.dialog.open(ApprovalConfirmationOverlayComponent, {
      height: 'auto',

      data: {
        id: "00000000-0000-0000-0000-000000000000",
        // approver: 'Udaraa', 
        // activity: '123#456',
        rfqId: this.rfqModel.id,
        approvalType: "TBE"
      },
      disableClose: true

    });
    this.zone.runOutsideAngular(() => {
    dialogRef.afterClosed().subscribe(result => {
      this.rfqModel.isTBEApproved=!result.issuccess;
      this.zone.run(() => {
        this.rfqModel.approvalType="TBE";
       this._changeDetectorRef.detectChanges();
       
        this.rfqUpdated.emit({ rfqModel: this.rfqModel });
      });
    });
    });
  }

  tBEHeaderRejectionConfirm() {
    const dialogRef = this.dialog.open(RejectionConfirmationOverlayComponent, {
      height: 'auto',

      data: {
        id: "00000000-0000-0000-0000-000000000000",
        // approver: 'Udaraa', 
        // activity: '123#456' ,
        rfqId: this.rfqModel.id,
        approvalType: "TBE"
      },
      disableClose: true
    });
    this.zone.runOutsideAngular(() => {
    dialogRef.afterClosed().subscribe(result => {
      this.rfqModel.isTBEApproved=!result.issuccess;
      this.zone.run(() => {
        this.rfqModel.approvalType="TBE";
       this._changeDetectorRef.detectChanges();
       
        this.rfqUpdated.emit({ rfqModel: this.rfqModel });
      });
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

  DownloadHeaderInformationAttatchmentMedia(row) {
    this.DownloadHeaderInformationAttatchmentFile(row.attachmentId, row.fileName, row.fileExtension);
  }

  DownloadHeaderInformationAttatchmentFile(id, fileName, fileExtension) {
    let eTMedia: any = { id: id }

    this.termsService.DownloadMedia(eTMedia).subscribe(blob => {
      saveAs(blob, fileName, {
        type: fileExtension // --> or whatever you need here
      });
    });
  }
}
