import { RFQHeaderAttributeModel } from './rfq-header-attribute-model';

export class RFQSupplierHeaderAttributeModel {
    id: string;
    rfqAttributeModel: RFQHeaderAttributeModel[];
    description: string;
    attributeDataName: string;
    targetValue: string;
    targetDate: string;
    rfqId: string;
    supplierId: string;
    associatedCosts: string;
    cost: string;
    supplierComment: string;
    isRequired: boolean;
}
