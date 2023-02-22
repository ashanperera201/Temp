import { AttributeViewModel } from "./attribute-view-model";

export class AttributeGroupViewModel {
    id: string;
    title: string;
    name: string;
    groupName: string;
    isPrivate: boolean;
    isActive:boolean;
    attributeModels: AttributeViewModel[];
    dataTypeList: any[];
    isChecked: boolean;
    rfqId: string;
    rfqPartLineId: string;
    isdisable:boolean;
}