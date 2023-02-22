import { ListModel } from "./list-model";
import { SurveyQuestionModel } from "./ViewModels/survey-question-view-model";

export class SurveyTemplateItemSearchModel extends ListModel {

    id: string;
    name: string;
    description: string;
    isPrivate: boolean;
    surveyQuestions: SurveyQuestionModel[];
}