import { ListModel } from "./list-model";
import { RFXViewModel } from "./ViewModels/rfx-view-model";

export class RFXSearchModel  extends ListModel {
    rfxNo : string;
    Revision : string;
    rfxName : string;
    rfqModels : RFXViewModel[];
    rFxType : string;
    statusName : string;
    buyerName : string;
    startDate : string;
    endDate : string;
    
    constructor() {
        super();
        this.column = "CreationDate";
        this.direction = "desc";
    }
}
