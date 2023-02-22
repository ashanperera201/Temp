import { TermsConditionViewModel } from "./terms-condition-view-model";

export class RFQTermsConditionModel{
    no: Int16Array;
    name : string;
    rfqId : string;
    termsConditionId : string;
    inputType : string;
    input : string;
    isEditable : boolean;
    isDefault : boolean;
    beforeQuoteId : string; 
    endOfQuoteId : string;
    attributeCategoryId : string;
    attributeCategoryName : string;
    beforeQuote : string;
    endOfQuote : string;
    isAttributeCategorySave : boolean;
    isEditableSave : boolean;
    isDefaultSave : boolean;
    isBeforeQuoteIdSave : boolean;
    isEndOfQuoteIdSave : boolean;
    eTMediaId : string;
    fileName : string;
    fileExtension : string;
    termsConditionModel : TermsConditionViewModel;
} 