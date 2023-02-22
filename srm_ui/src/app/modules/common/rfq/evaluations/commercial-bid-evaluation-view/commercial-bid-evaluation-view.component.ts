import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { RfqComponent } from '../../rfq.component';
import { BidEvaluationModel } from 'app/main/Models/etendering/ViewModels/bid-evaluation-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-commercial-bid-evaluation-view',
  templateUrl: './commercial-bid-evaluation-view.component.html',
  styleUrls: ['./commercial-bid-evaluation-view.component.scss']
})

export class CommercialBidEvaluationViewComponent implements OnInit {
  @Output() rfqUpdated = new EventEmitter<{ rfqModel: RFQViewModel }>();
  @Input() RFQModel: any;

  supplierSearchModel: SupplierSearchModel = new SupplierSearchModel();
  selectedSupId: string;
  profileSet: any = [];

  constructor(public dialog: MatDialog,private rfqSupplierService: RfqSupplierService, private rfqService: RfqService, public auth: AuthService) {
    this.auth.user$.subscribe(
      (profile) => (
          this.profileSet = profile
      ));
  }

  public UpdateRFQModel(model) {
    this.RFQModel = model.rfqModel;
    if(this.bidEvaluation.supplierId!=null)
    {
      if(this.bidEvaluation.supplierId=="00000000-0000-0000-0000-000000000000")
      {
        this.rfqService.getBeedEvaluation(this.bidEvaluation).subscribe(result => {
          this.bidEvaluation = result.data;
          this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules = result.data.rfqEvaluationSupplierHeaderPaymentSchedules;
          this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules = result.data.rfqEvaluationSupplierLinePaymentSchedules;

      if (this.bidEvaluation && this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules) {
        for (let k = 0; k < this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules.length; k++) {
          this.findHeaderWorkSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
          this.findHeaderPaymentSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
          this.findHeaderReleaseValueSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
          this.findHeaderSupplierWorkSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
          this.findHeaderSupplierPaymentSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
          this.findHeaderSupplierReleaseValueSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
        }
      }
      if (this.bidEvaluation && this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules) {
        for (let k = 0; k < this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules.length; k++) {
          this.findLineWorkSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
          this.findLinePaymentSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
          this.findLineReleaseValueSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
          this.findLineSupplierWorkSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
          this.findLineSupplierPaymentSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
          this.findLineSupplierReleaseValueSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
        }
      }
      this.bidCommercialFlag = true;
    });
    }
    this.rfqUpdated.emit({rfqModel:model});
    }
  }

  ngOnInit(): void {
    this.approvalHistoryView.emit();
    this.fetchSupplierList();
    this.fetchEvaluators();
  }

  fetchSupplierList() {
    let temprfqSupplierSearchModel: SupplierSearchModel = new SupplierSearchModel();

    temprfqSupplierSearchModel.supplierName = this.supplierSearchModel.supplierName;

    this.rfqSupplierService.getSubmittedResponseSupplier(this.RFQModel.id,"Commercial").subscribe(result => {
    this.supplierSearchModel.supplierViewModels = result.data;
      // this.selectedSupId = this.supplierSearchModel.supplierViewModels[0].id;

      // this.onSupplierChangeCommercial(this.selectedSupId);
    });
  }

  evaluators: any;
  fetchEvaluators() {
    if ((this.RFQModel.isEvaluatorViewer || this.RFQModel.isTBEBuyerOrApprover || this.RFQModel.isCBEBuyerOrApprover)) {
      this.rfqService.getEvaluators(this.RFQModel.id,"Commercial Bid Evaluator").subscribe(result => {
        this.evaluators = result.data;
      });
    }
  }

  bidEvaluation: BidEvaluationModel = new BidEvaluationModel;
  bidCommercialFlag = true;
  selectedEvlId:any;
  onSupplierChangeCommercial(supId: string) {
    if (this.RFQModel.isEvaluatorViewer || this.RFQModel.isTBEBuyerOrApprover || this.RFQModel.isCBEBuyerOrApprover) {
      if (this.selectedEvlId) {
        if (this.selectedEvlId=='00000000-0000-0000-0000-000000000000') {
          return;
        }
      
      }
      if (this.selectedSupId) {
        if (this.selectedSupId=='00000000-0000-0000-0000-000000000000') {
          return;
        }
      
      }
    }
    this.bidCommercialFlag = false;
    this.bidEvaluation = new BidEvaluationModel;
    this.bidEvaluation.rFQId = this.RFQModel.id;
    this.bidEvaluation.attributeCategoryName = 'Commercial';
    this.bidEvaluation.supplierId = supId;
    
    if (this.selectedEvlId) {
      this.bidEvaluation.userId = this.selectedEvlId;
    }
    const refference = this.dialog.open(ApplicationLoaderComponent, { height: '400px', width: '600px', data: { loadingText: 'Loading....' } });

      this.rfqService.getBeedEvaluation(this.bidEvaluation).subscribe(result => {
        refference.close();
        this.bidEvaluation = result.data;
        this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules = result.data.rfqEvaluationSupplierHeaderPaymentSchedules;
        this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules = result.data.rfqEvaluationSupplierLinePaymentSchedules;
        if (this.bidEvaluation && this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules) {
          for (let k = 0; k < this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules.length; k++) {
            this.findHeaderWorkSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
            this.findHeaderPaymentSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
            this.findHeaderReleaseValueSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqHeaderPaymentSchedule);
            this.findHeaderSupplierWorkSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
            this.findHeaderSupplierPaymentSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
            this.findHeaderSupplierReleaseValueSum(this.bidEvaluation.rfqEvaluationSupplierHeaderPaymentSchedules[k].rfqSupplierHeaderPaymentSchedule);
          }
        }
        if (this.bidEvaluation && this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules) {
          for (let k = 0; k < this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules.length; k++) {
            this.findLineWorkSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
            this.findLinePaymentSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
            this.findLineReleaseValueSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqPartLinePaymentSchedule);
            this.findLineSupplierWorkSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
            this.findLineSupplierPaymentSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
            this.findLineSupplierReleaseValueSum(this.bidEvaluation.rFQEvaluationSupplierLinePaymentSchedules[k].rfqSupplierPartLinePaymentSchedule);
          }
        }
        this.bidCommercialFlag = true;
      });
  }

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

  findHeaderWorkSum(data) {
    this.value = data;
    this.workHeaderTotal += this.value.workPercentage;
  }

  findHeaderPaymentSum(data) {
    this.value = data;
    this.paymentHeaderTotal += this.value.paymentPercentage;
  }

  findHeaderReleaseValueSum(data) {
    this.value = data;
    this.releaseValueHeaderTotal += this.value.releaseValue;
  }

  findHeaderSupplierWorkSum(data) {
    this.value = data;
    this.supplierWorkHeaderTotal += this.value.workPercentage;
  }

  findHeaderSupplierPaymentSum(data) {
    this.value = data;
    this.supplierPaymentHeaderTotal += this.value.paymentPercentage;
  }

  findHeaderSupplierReleaseValueSum(data) {
    this.value = data;
    this.supplierReleaseValueHeaderTotal += parseInt(this.value.releasevalue);
  }

  //Lines
  findLineWorkSum(data) {
    this.value = data;
    this.workLineTotal += this.value.work;
  }

  findLinePaymentSum(data) {
    this.value = data;
    this.paymentLineTotal += this.value.payment;
  }

  findLineReleaseValueSum(data) {
    this.value = data;
    this.releaseValueLineTotal += this.value.releaseValue;
  }

  findLineSupplierWorkSum(data) {
    this.value = data;
    this.supplierWorkLineTotal += this.value.work;
  }

  findLineSupplierPaymentSum(data) {
    this.value = data;
    this.supplierPaymentLineTotal += this.value.payment;
  }

  findLineSupplierReleaseValueSum(data) {
    this.value = data;
    this.supplierReleaseValueLineTotal += parseInt(this.value.releaseValue);
  }

  @Output() approvalHistoryView = new EventEmitter<{ index: any }>();

}