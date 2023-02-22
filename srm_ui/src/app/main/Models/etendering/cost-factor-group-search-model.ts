import { ListModel } from "./list-model";
import { CostFactorGroupViewModel } from "./ViewModels/cost-factor-group-view-model";
import { CostFactorTextViewModel } from 'app/main/Models/etendering/ViewModels/cost-factor-view-model';

export class CostFactorGroupSearchModel extends ListModel {
    rfqId: string;
    rfqPartLineId: string;
    id: string;
    cFGTitle: string;
    cFGName: string;
    isPrivate: boolean;
    costFactorModels: CostFactorTextViewModel[];
    costFactorGroupModels: CostFactorGroupViewModel[];
    data: any;

    constructor() {
        super();
        //this.column = "cFGTitle";
        this.column = "creationDate";
        this.direction = "desc";
    }
}
