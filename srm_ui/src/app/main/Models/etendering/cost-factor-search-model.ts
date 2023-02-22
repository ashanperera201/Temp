import { ListModel } from "./list-model";
import { CostFactorTextViewModel } from "./ViewModels/cost-factor-view-model";

export class CostFactorSearchModel extends ListModel {
    rfqId: string;
    rfqPartlineId: any;
    cfName: string;
    cfDescription: string;
    cfType: string;
    cfTypeId: string;
    costFactorTextViewModels: CostFactorTextViewModel[];
    cfTypes: any[];
    data: any;
    NewListId: string;
    isPrivate: boolean;

    constructor() {
        super();
        //this.column = "cfName";
        this.column = "creationDate";
        this.direction = "desc";
    }
}
