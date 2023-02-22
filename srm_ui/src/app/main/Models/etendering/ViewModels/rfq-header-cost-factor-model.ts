export class RFQHeaderCostFactorModel {
    id : string;
    
    pRNum : string;
    rFQId : string;
    costFactorGroupId:string;
    costFactorId : string;
    costFactor : any;
    costFactorName : string;
    headerCostFactorGroupName: string;
    headerCostFactorGroupDescription: string;

    description : string;
    targetValue : string;
    displayTarget : boolean;
    attributeCategoryId : string;
    attributeCategoryName : string;
    attributeCategory: any;

    costTypeId :string;
    costTypeName :string;
    costType : any;

    attributeFieldTypeId : string;
    attributeFieldTypeName : string;
    attributeFieldType: any;

    expectedValue: string;
    isVisibleToSuppliers: boolean;

    attributeCategoryList : any[];    
    costTypeList : any[];   
    attributeFieldTypeList : any[];   
    deleteType: string;

    isCostTypeSave: boolean;
    isAttributeCategoryTypeSave: boolean;
    isFieldTypeeSave: boolean;
    isDisplayTargetSave: boolean;
    isVisibibleToSuppliersSave: boolean;
    isCostFactorBasicDataSave: boolean;
    
    isCostFactorGroupDataSave: boolean;



}