export class RFQPartLineDeliverableModel {

    id : string;
    rfxId : string;
    attributeCategoryId : string;
    rfxPartLineId : string;
    //rfqId : string;
    name : string;
    description : string;
    mileStoneNo : string;
    previousMilestone : string;
    progressPercentage : string;
    stagePaymentPercentage : string;
    beginDate : string;
    displayToSupplier : boolean;
    categoryName :string;
    attributeCatagories:any[];
    isCategorySave : boolean;
    isVisibleToSupplierSave : boolean;

}