import { DecimalPipe } from "@angular/common";

export class RFQHeaderPaymentScheduleModel {
    rfqId:string;
    payScheduleNo:string;
    description:string;
    workPercentage:DecimalPipe;
    milestone:DecimalPipe;
    paymentPercentage:DecimalPipe;
    retentionPercentage:DecimalPipe;
    releasePercentage:DecimalPipe;
    releaseValue:DecimalPipe;
}