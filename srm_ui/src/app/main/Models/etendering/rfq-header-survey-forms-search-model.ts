import { ListModel } from "./list-model";
import { RFQHeaderServeyQuestionModel } from "./rfq-header-survey-question-model";

export class RFQHeaderSurveyFormsSearchModel extends ListModel {
    RFQId: string;
    rfqHeaderSurveyModel: RFQHeaderServeyQuestionModel[];

    constructor() {
        super();
    }
}