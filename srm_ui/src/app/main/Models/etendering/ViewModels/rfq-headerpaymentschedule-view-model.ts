import { DecimalPipe } from "@angular/common";

export class RFQHeaderPaymentScheduleViewModel {
    id : string;
    rfqId:any;
    payScheduleNo : string;
    description: string;
    workPercentage: DecimalPipe;
    milestone: DecimalPipe;
    paymentPercentage: DecimalPipe;
    retentionPercentage: DecimalPipe;
    releasePercentage: DecimalPipe;
    releaseValue: string;
    attributeCategoryId: string;
    isVisibleToSupplier:boolean;
    isCategorySave: boolean;
    categoryName: string;
    attributeCategorys: any[];
    isDescriptionSave: boolean;
    isVisibleToSupplierSave: boolean;
    scheduleLineType: string;
    downPaymentType: string;
    dueDate: string;
    dueDateD: Date;
    isScheduleLineType: boolean;
    isDownPaymentType: boolean;
    isDueDate: boolean;
}