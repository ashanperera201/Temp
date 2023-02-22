import { ListModel } from "./list-model";
import { AttributeViewModel } from "app/main/Models/etendering/ViewModels/attribute-view-model";

export class AttributeSearchModel extends ListModel {
    rfqId: string;
    rfqPartLineId: string;
    attributeName: string;
    name:string;//to be delete
    dataTypeName: string;
    category: string;
    description: string;
    NewListId:string;
    attributeModels: AttributeViewModel[];
    AttributeDataTypeList: any[];
    attributeCategotyList: any[];
    dataTypeList:any[];
    constructor() {
        super();
        this.column = "";
    }
}
