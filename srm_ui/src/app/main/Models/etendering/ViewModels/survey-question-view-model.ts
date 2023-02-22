export class SurveyQuestionModel {
    name: string;
    description: string;
    isPrivate: boolean;
    surveyTemplateModels: any[];
    surveyQuestionMappings: any[];
    associatedTemplate: string;
    rfqId: string;
    id: string;
    data: any;
    isChecked: boolean;
}