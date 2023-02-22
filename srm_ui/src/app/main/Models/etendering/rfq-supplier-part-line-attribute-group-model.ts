import { RFQSupplierPartLineAttributeModel } from "./ViewModels/rfq-supplier-part-line-attribute-model";

export class RFQSupplierPartLineAttributeGroupModel {
    id: string;
    attributeGroupId: string;
    title: string;
    name: string;
    group: string;
    rfqSupplierPartLineAttributeModels: RFQSupplierPartLineAttributeModel[];
    rfqSupplierPartLineId:any;
}