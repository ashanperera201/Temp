import { AttributeValueViewModel } from "../ViewModels/attribute-value-view-model";
import { AttributeGroupViewModel } from "./attribute-group-view-model";

export class AttributeViewModel {
    id: string;
    attributeName: string;
    format: string;
    description: string;
    isIFSValueList: boolean;
    maxLength: number;
    categoryId: string;
    fieldTypeId: string;
    dataTypeId: string;
    attributeValues: AttributeValueViewModel[];
    attributeGroupId: string;
    isChecked: boolean;
    dataTypeName: string;
    categoryName: string;
    isDisabled: boolean;
    categoryType: string;
    DataType: any;
    fieldTypeName: string;
    ifsTableId: string;
    iFSTable1Id: string;
    iFSTable2Id: string;
    isDeleted: boolean;
    attributeGroupModels: AttributeGroupViewModel[];
    attributeCategoryList: any[];
    attributeDataTypeList: any[];
    rfqId: string;
    rfqPartLineId: string;
    // Value to hold expected value in add new attribute overlay when editing attribute item details.
    expectedValue: string;
    ischeckdisabled:boolean;
}