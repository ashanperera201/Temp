import { ListModel } from "./list-model";
import { RFQHeaderAttachmentViewModel } from "./ViewModels/rfq-header-attachment-view-model";

export class RFQHeaderAttachmentSearchModel extends ListModel {
    RFQId: string;   
    rfqHeaderAttchmentModel : RFQHeaderAttachmentViewModel[];
    constructor() {
        super();       
    }
}