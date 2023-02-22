import { RFQEvaluationSupplierHeaderCostFactorModel } from "./ViewModels/rfq-evaluation-supplier-header-cost-factor-model";
import { RFQEvaluationSupplierLineCostFactorModel } from "./ViewModels/rfq-evaluation-supplier-line-cost-factor-model";

export class RFQEvaluationSupplierCostFactorGroupModel { 
    costFactorGroupId : string;   
    name: string;
    description: any;
    rfqEvaluationSupplierHeaderCostFactorModels: RFQEvaluationSupplierHeaderCostFactorModel[];
    rfqEvaluationSupplierLineAttributeModels: RFQEvaluationSupplierLineCostFactorModel[];

   
   }