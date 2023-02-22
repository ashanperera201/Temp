import { ListModel } from "./list-model";
import { RFQSupplierModel } from "./ViewModels/rfq-supplier-model";

export class RFQSupplierSearchModel extends ListModel {
    RFQId: string;
    rfqSupplierModel: RFQSupplierModel[];

    constructor() {
        super();
        this.column = "id";
    }
}