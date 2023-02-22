import { DecimalPipe } from '@angular/common';

export class RFQSupplierPartLinePaymentScheduleModel {
    rfqPartLinePaymentScheduleId: string;
    rfqPartLinePaymentScheduleModel: any;
    rfqId: string;
    supplierId: string;
    payScheduleNo: string;
    description: string;
    work: DecimalPipe;
    milestone: DecimalPipe;
    payment: DecimalPipe;
    retention: DecimalPipe;
    release: DecimalPipe;
    releaseValue: string;
    surrogateById: any;
    surrogationDate: Date;
    attributeCategoryId: any;
    comment: string;
    rfqSupplierPartLineId: any;
    dueDate: string;
    dueDateDO: Date;
}
