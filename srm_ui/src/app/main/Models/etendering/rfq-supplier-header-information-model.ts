import { RFQSupplierHeaderPaymentScheduleModel } from "./rfq-supplier-headerpayment-schedule-model";
import { RFQSupplierPartLinePaymentScheduleModel } from "./rfq-supplier-partLine-payment-schedule-model";

export class RFQSupplierHeaderInformationModel {
  rfqId: any;
  supplierId: any;
  supplierSite: string;
  deliveryTime: Date;
  daysOrWeeks: Date;
  daysOrWeeksInt: string;
  daysOrWeekType: string;
  qouteValideUntil: Date;
  currencyId: string;
  refNumber: number;
  qouteNumber: number;
  noteToBuyer: string;
  rfqSupplierHeaderPaymentScheduleList: RFQSupplierHeaderPaymentScheduleModel[];
  rfqSupplierPartLinePaymentScheduleList: RFQSupplierPartLinePaymentScheduleModel[];
  id: string;
}