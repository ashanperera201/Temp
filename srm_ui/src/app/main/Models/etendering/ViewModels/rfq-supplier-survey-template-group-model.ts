import { RFQSupplierHeaderSurveyTemplateQuestionModel } from "../rfq-supplierheader-surveytemplate-question-module";

export class RFQSupplierSurveyTemplateGroupModel{
   
    surveyTemplateId : string;
    name : string;
    description : string;
    rfqSupplierHearderSurveyTemplateList : RFQSupplierHeaderSurveyTemplateQuestionModel[];
}