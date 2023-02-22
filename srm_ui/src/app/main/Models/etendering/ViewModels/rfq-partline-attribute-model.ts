export class RFQPartLineAttributeModel {
    id: string;
    rfqPartLineId: string;
    pRNum: string;
    attributeGroupId: string;
    attributeId: string;
    displayTarget: boolean;
    description: string;
    rfqId: string;
    attributeCategoryId: string;
    attributeDataTypeId: string;
    expectedValue: string;
    isRequired: boolean;
    attributeName: string;
    attributeGroupName: string;
    dataTypeName: string;
    categoryName: string;
    attributeCategoryTypes: any[];
    attributeDataTypes: any[];
    lineAttributeTitle: string;
    lineAttributeName: string;
    lineAttributeGroupName: string;
    attributeFormatValueModels:any[]
}