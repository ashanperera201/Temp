import { RFQHeaderCostFactorModel } from "./ViewModels/rfq-header-cost-factor-model";
import { RFQPartLineCostFactorModel } from "./ViewModels/rfq-line-cost-factor-model";

export class RFQCostFactorGroupModel{
   
    costFactorGroupId : string;
    name : string;
    description : string;
    IsDefault:boolean;
    IsEventList:boolean;
    rfqHearderCostFactorList : RFQHeaderCostFactorModel[];
    rfqLineCostFactorList : RFQPartLineCostFactorModel[];

    


    
}
