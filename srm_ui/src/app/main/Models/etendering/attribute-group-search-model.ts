import { ListModel } from "./list-model";
import { AttributeGroupViewModel } from "./ViewModels/attribute-group-view-model";
import { AttributeViewModel } from "./ViewModels/attribute-view-model";


export class AttributeGroupSearchModel extends ListModel {
    id: string;
    title: string;
    name: string;
    rfqId: string;
    group: string;
    isPrivate:boolean;  
    rfqPartLineId: string;
    attributeGroupViewModels: AttributeGroupViewModel[];
    attributeModels: AttributeViewModel[];
    constructor() {
        super();
        this.column = "";
    }
}
