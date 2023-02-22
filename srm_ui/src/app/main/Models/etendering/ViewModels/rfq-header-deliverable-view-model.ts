export class RFQHeaderDeliverableModel {
    
    id : string;
    rfxId : string;
    attributeCategoryId : string;
    //rfqId : string;
    name : string;
    description : string;
    mileStoneNo : string;
    previousMilestoneNo : string;
    progressPercentage : string;
    stagePaymentPercentage : string;
    beginDate : string;
    isVisibleToSuppliers : boolean;
    categoryName :string;
    attributeCatagories:any[];
    isCategorySave : boolean;
    isVisibleToSupplierSave : boolean;

}
