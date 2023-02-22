import { ListModel } from "../list-model";
import { RFQTermsConditionModel } from "./rfq-terms-condition-model";

export class RFQSupplierHeaderTermsConditionModel {
    id: string;
    rfqTermsConditionID: string;
    supplierID: string;
    isAccepted: boolean;
    rfqId: string;
    rfqParentId: string;
    isOverride: boolean;
    surrogateById: string;
    surrogationDate: Date;
    etMediaId: string;
    isDeleteandDownloadEnabledVisible: boolean;
    rfqTermsConditionModel: RFQTermsConditionModel;
    comments: string;
    isControlDisable: boolean;


}