import { ListModel } from "./list-model";
import { SurveyTemplateModel } from "./survey-template-model";

export class SurveyTemplateSearchModel extends ListModel {

     name: string;
     description: string;
     surveyTemplateModels: SurveyTemplateModel[];
     rfqId: string;

     constructor() {
          super();
          this.column = "creationDate";
          this.direction = "desc";
     }
}