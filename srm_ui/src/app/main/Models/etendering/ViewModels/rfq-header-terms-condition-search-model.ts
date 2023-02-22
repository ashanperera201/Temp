import { ListModel } from "../list-model";
import { RFQHeaderTermsConditionModel } from "./rfq-header-terms-condition-view-model";

export class RFQHeaderTermsConditionSearchModel extends ListModel {
    RFQId: string;
    rfqTermsConditionModel : RFQHeaderTermsConditionModel[];

    constructor() {
        super();
        this.column = "id";
    }
}
