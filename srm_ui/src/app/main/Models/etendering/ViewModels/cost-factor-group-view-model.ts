import { CostFactorTextViewModel } from "../ViewModels/cost-factor-view-model";

export class CostFactorGroupViewModel {
    id: string;
    title: string;
    name: string;
    rfqId: string;
    rfqPartlineId: string;
    costFactorModels: CostFactorTextViewModel[];
    rfqPartLineList: any[];
    dataTypeList: any[];
    isChecked: boolean;
    isPrivate: boolean;
    isdisable:boolean;
}