import { ListModel } from "./list-model";
import { RFQHeaderNoteViewModel } from "./ViewModels/rfq-header-note-view-model";

export class RFQHeaderNoteSearchModel extends ListModel {
    rfqId: string;
    rfqHeaderNoteModel: RFQHeaderNoteViewModel[];

    constructor() {
        super();
    }
}