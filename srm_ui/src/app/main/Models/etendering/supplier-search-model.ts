import { ListModel } from './list-model';
import { SupplierViewModel } from './ViewModels/supplier-view-model';

export class SupplierSearchModel extends ListModel {
    id: string;
    ifsSupplierId: string;
    supplierName: string;
    supplierType: string;
    title: string;
    contactEmail: string;
    supplierStatus: string;
    data: any;
    supplierViewModels: SupplierViewModel[];
    paginator: any;
    sort: any;
    filter: string;
    invited: string;
    category: string;

    constructor() {
        super();
        this.column = '';
    }
}
