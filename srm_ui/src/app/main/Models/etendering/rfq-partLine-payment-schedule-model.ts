import { DecimalPipe } from "@angular/common";

export class RFQPartLinePaymentScheduleModel{
    rfqId : any;
    rfqPartLineId : any;
    payScheduleNo : string;
    description : string;
    work : DecimalPipe;
    milestone : DecimalPipe;
    payment : DecimalPipe;
    retention : DecimalPipe;
    release : DecimalPipe;
    valueVisibilityToSuppliers : boolean;
    releaseValue : DecimalPipe;
    attributeCategoryId : any;
    attributeCategorys : string;
    isCategorySave : boolean;
    categoryName : string;
    isVisibleToSupplierSave : boolean;
    rfqSupplierPartLineId:any;
}