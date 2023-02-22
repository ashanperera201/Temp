import { ListModel } from "./list-model";
import { SurveyQuestionModel } from "./ViewModels/survey-question-view-model";

export class SurveyQuestionSearchModel extends ListModel {

    surveyQuestionSearchName: string;
    surveyQuestionSearchDescription: string;
    surveyQuestionModels: SurveyQuestionModel[];
    rfqId: string;
    isPrivate: boolean;

    constructor() {
        super();
        this.column = "creationDate";
        this.direction = "desc";
    }
}