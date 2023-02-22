import { RFQHeaderAttributeModel } from "./ViewModels/rfq-header-attribute-model";

export class RFQAttributeGroupModel {
    id: string;
    attributeGroupId: string;
    title: string;
    name: string;
    group: string;
    rfqHeaderAttributeModels: RFQHeaderAttributeModel[];
}