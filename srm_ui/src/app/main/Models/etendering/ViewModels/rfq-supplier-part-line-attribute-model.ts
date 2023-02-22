import { RFQPartLineAttributeModel } from './rfq-partline-attribute-model';

export class RFQSupplierPartLineAttributeModel {
    id: string;
    rfqPartLineAttributeModel: RFQPartLineAttributeModel[];
    partDescirption: string;
    attributeDataName: string;
    targetValue: string;
    targetDate: string;
    rfqId: string;
    supplierId: string;
    associatedCosts: string;
    cost: string;
    comment: string;
    isRequired: boolean;
}
