import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';
import { SupplierSearchModel } from 'app/main/Models/etendering/supplier-search-model';
import { RfqSupplierService } from 'app/shared/Services/etendering/RFQ/rfq-supplier.service';
import { BidEvaluationModel } from 'app/main/Models/etendering/ViewModels/bid-evaluation-model';
import { RfqService } from 'app/shared/Services/etendering/RFQ/rfq.service';
import { RFQViewModel } from 'app/main/Models/etendering/ViewModels/rfqViewModel';
import { ApplicationLoaderComponent } from 'app/shared/components/application-loader/application-loader.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-technical-bid-evaluation-view',
  templateUrl: './technical-bid-evaluation-view.component.html',
  styleUrls: ['./technical-bid-evaluation-view.component.scss']
})

export class TechnicalBidEvaluationViewComponent implements OnInit {
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
    
          this.bidTechnicalFlag = true;
        });
      }}
    this.rfqUpdated.emit();
  }

  @Output() approvalHistoryView = new EventEmitter<{ index: any }>();

  ngOnInit(): void {
    this.approvalHistoryView.emit();
    this.fetchSupplierList();
    this.fetchEvaluators();
  }

  fetchSupplierList() {
    let temprfqSupplierSearchModel: SupplierSearchModel = new SupplierSearchModel();

    temprfqSupplierSearchModel.supplierName = this.supplierSearchModel.supplierName;

    this.rfqSupplierService.getSubmittedResponseSupplier(this.RFQModel.id,"Technical").subscribe(result => {
     this.supplierSearchModel.supplierViewModels = result.data;
      // this.selectedSupId = this.supplierSearchModel.supplierViewModels[0].id;

      // this.onSupplierChangeTechnical(this.selectedSupId);
    });
  }

  evaluators:any;
  fetchEvaluators() {
    if((this.RFQModel.isEvaluatorViewer || this.RFQModel.isTBEBuyerOrApprover || this.RFQModel.isCBEBuyerOrApprover))
    {
      this.rfqService.getEvaluators(this.RFQModel.id,"Technical Bid Evaluator").subscribe(result => {
        this.evaluators= result.data;
      });
    }
  }

  selectedEvlId:any;
  bidEvaluation: BidEvaluationModel = new BidEvaluationModel;
  bidTechnicalFlag = true;

  onSupplierChangeTechnical(supId: string) {
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

    this.bidTechnicalFlag = false;
    this.bidEvaluation = new BidEvaluationModel;
    this.bidEvaluation.rFQId = this.RFQModel.id;
    this.bidEvaluation.attributeCategoryName = 'Technical';
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

        this.bidTechnicalFlag = true;
      }); 
  }

}