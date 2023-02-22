import { ListModel } from "../list-model";
import { TermsConditionViewModel } from "../ViewModels/terms-condition-view-model";

export class TermsConditionSearchModel extends ListModel {
    id: string;
    RFQId: string;
    termsConditions: string;
    isRFQ: boolean;
    tCs: string;
    inputType: string;
    wordData: string;
    termsConditionModels: TermsConditionViewModel[];

    constructor() {
        super();
        this.column = '';
    }
}
