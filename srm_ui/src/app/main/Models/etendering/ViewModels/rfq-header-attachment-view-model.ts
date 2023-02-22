import { ListModel } from "../list-model";

export class RFQHeaderAttachmentViewModel extends ListModel{
    id : string;
    rFQId :string;
    etMediaId :string;
    attributeCategoryId :string;
    documentClass :string;
    prReferenceNo :string;
    internalToRFQ :string;
    isSupplierAttachmentRequired :boolean;
    isVisibleToSuppliers :boolean;
    srNo :string;
    title :string;
    fileName :string;
    fileExtension :string;
    isVisibleToSupplierSave:boolean;
    categoryName :string;
    attributeCatagories:any[];
  

}