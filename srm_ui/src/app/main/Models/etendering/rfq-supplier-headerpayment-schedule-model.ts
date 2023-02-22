import { DecimalPipe } from "@angular/common";

export class RFQSupplierHeaderPaymentScheduleModel {
    rfqHeaderPaymentScheduleId: string;
    rfqHeaderPaymentScheduleModel: any;
    supplierId: string;
    supplier: any[];
    rFQId: string;
    description: string;
    workPercentage: DecimalPipe;
    milestonePercentage: DecimalPipe;
    paymentPercentage: DecimalPipe;
    retentionPercentage: DecimalPipe;
    relesePercentage: DecimalPipe;
    rFQParentId: string;
    isOverride: boolean;
    surrogateById: string;
    surrogationDate: Date;
    supplierResponse: string;
    comment: string;
    paySchedNo: string;
    releasevalue: string;
    dueDate: string;
    dueDateDO: Date;
}
