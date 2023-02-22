import { ListModel } from "./list-model";
import { SupplierGroupViewModel } from "./ViewModels/supplier-group-view-model";
import { SupplierViewModel } from "./ViewModels/supplier-view-model";

export class SupplierGroupSearchModel extends ListModel {
    supplierGroupID: string;
    supplierGroupTitle: string;
    supplierGroupName: string;
    type: string;
    status: string;
    ifsSupplierId: string;
    suppliername: string;
    supplierContact: string;
    supplierStatus: string;
    supplierModels: SupplierViewModel[];
    supplierGroupModels: SupplierGroupViewModel[];
    supplierGroupViewModels: SupplierGroupViewModel[];
    isPrivate: boolean;
    paginator: any;
    sort: any;
    filter: string;

    constructor() {
        super();
        this.type = '';
        this.status = '';
        this.column = '';
    }
}
