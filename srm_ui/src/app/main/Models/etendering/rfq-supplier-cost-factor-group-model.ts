import { RFQHeaderCostFactorModel } from "./ViewModels/rfq-header-cost-factor-model";
import { RFQPartLineCostFactorModel } from "./ViewModels/rfq-line-cost-factor-model";
import { RFQSupplierHeaderCostFactorModel } from "./ViewModels/rfq-supplier-header-cost-factor-model";
import { RFQSupplierpartLineCostFactorModel } from "./ViewModels/rfq-supplier-part-line-cost-factor-model";

export class RFQSupplierCostFactorGroupModel{
   
    costFactorGroupId : string;
    name : string;
    description : string;

    rfqSupplierHearderCostFactorList : RFQSupplierHeaderCostFactorModel[];
    rfqSupplierPartLineCostFactorList : RFQSupplierpartLineCostFactorModel[];
    rfqSupplierPartLineId:any;
}