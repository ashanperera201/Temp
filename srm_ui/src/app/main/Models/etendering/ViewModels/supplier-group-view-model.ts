import { SupplierViewModel } from "./supplier-view-model";


export class SupplierGroupViewModel{
    id : string;
    title : string;
    name : string;
    isPrivate : boolean;
    isActive:boolean;
    supplierContactId : string;
    supplierModels : SupplierViewModel[];
    isChecked:boolean;
}
