export class RFQHeaderAttributeModel {
    id: string;
    pRNum: string;
    attributeGroupId: string;
    attributeId: string;
    attributeDataTypeId: string;
    expectedValue: string;
    displayTarget: boolean;
    description: string;
    rFXId: string;
    attributeCategoryId: string;
    attributeName: string;
    attributeTypeName: string;
    attributeGroupName: string;
    dataTypeName: string;
    attributeCategoryTypes: any[];
    attributeDataTypes: any[];
    isRequired: boolean;
    isRequiredSave: boolean;
    isDisplayTargetSave: boolean;
    attributeFormatValueModels:any[]
}