import { RFQPartLineAttributeModel } from "./ViewModels/rfq-partline-attribute-model";

export class RFQPartLineAttributeGroupModel {
    id: string;
    attributeGroupId: string;
    title: string;
    name: string;
    group: string;
    rfqLineAttributeModels: RFQPartLineAttributeModel[];
    rfqSupplierPartLineId:any;
    rfqId:string;
    rfqPartLineId:string;
}