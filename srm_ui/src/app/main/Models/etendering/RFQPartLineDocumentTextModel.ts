import { OutputType } from "./OutputType";

export class RFQPartLineDocumentTextModel {
    rfqId: string;
    rfqPartLineId: string;
    outputTypeId: string;
    phraseId: string;
    reference: string;
    documentText: string;
    displayToSupplier: boolean;
    outputType: OutputType;
    isCategorySave: boolean;
    isVisibleToSupplierSave: boolean;
}