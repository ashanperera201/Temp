export class RFQHeaderTermsConditionModel {
    id: string;
    no: string;
    name: string;
    rFQId: string;
    termsConditionId: string;
    inputType: string;
    input: string;
    isEditable: boolean;
    isDefault: boolean;
    beforeQuoteId: string;
    endOfQuoteId: string;
    attributeCategoryId: string;
    attributeCategoryName: string;
    beforeQuote: string;
    endOfQuote: string;
    attributeCategoryTypes: any[];
    beforeQuoteOptions: any[]
    endOfQuoteOptions: any[];
    isAttributeCategorySave: boolean;
    isEditableSave: boolean;
    isDefaultSave: boolean;
    isBeforeQuoteIdSave: boolean;
    isEndOfQuoteIdSave: boolean;
    fileName: string;
    fileExtension: string;
    eTMediaId: string;
}
