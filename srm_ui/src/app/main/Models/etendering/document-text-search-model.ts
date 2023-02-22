import { ListModel } from "./list-model";
import { DocumentTextViewModel } from "./ViewModels/document-text-view-model";

export class DocumentTextSearchModel  extends ListModel {
    title : string;

    documentTextViewModels : DocumentTextViewModel[];
    
    constructor() {
        super();
        this.column = "title";
    }
}
