import { DecimalPipe } from "@angular/common";

export class RFQLinePaymentScheduleViewModel {
    id : string;
    rFQId: string;
    rFQPartLineId: string;
    payScheduleNo : string;
    description: string;
    work: DecimalPipe;
    milestone: DecimalPipe;
    payment: DecimalPipe;
    retention: DecimalPipe;
    release: DecimalPipe;
    releaseValue: DecimalPipe;
    valueVisibilityToSuppliers: boolean;
    attributeCategorys: any[];
    isDescriptionSave: boolean;
    categoryName: string;
    isCategorySave: boolean;
    isVisibleToSupplierSave: boolean;
    scheduleLineType: string;
    downPaymentType: string;
    dueDate: string;
    dueDateD: Date;
    isScheduleLineType: boolean;
    isDownPaymentType: boolean;
    isDueDate: boolean;
    attributeCategoryId: string;
}