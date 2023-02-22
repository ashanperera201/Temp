import { RFQSupplierHeaderAttributeModel } from "./ViewModels/rfq-supplier-header-attribute-model";

export class RFQSupplierHeaderAttributeGroupModel {
    id: string;
    attributeGroupId: string;
    title: string;
    name: string;
    group: string;
    rfqSupplierHeaderAttributeModels: RFQSupplierHeaderAttributeModel[];
}