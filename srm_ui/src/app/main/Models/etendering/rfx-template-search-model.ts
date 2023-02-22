import { ListModel } from "app/main/Models/etendering/list-model";
import { RFXTemplateViewModel } from "app/main/Models/etendering/ViewModels/rfx-template-view-model";

export class RFXTemplateSearchModel  extends ListModel {
    rfxTempName : string;
    rfxTempDescription : string;
    rfxTempType:string;
    rfxTemplateModelViewModels : RFXTemplateViewModel[];
    
    constructor() {
        super();
        this.column = "title";
    }
}
