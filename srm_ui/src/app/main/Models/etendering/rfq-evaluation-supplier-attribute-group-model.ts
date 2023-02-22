import { RFQEvaluationSupplierHeaderAttributeModel } from "./ViewModels/rfq-evaluation-supplier-header-attribute-model";
import { RFQEvaluationSupplierLineAttributeModel } from "./ViewModels/rfq-evaluation-supplier-line-attribute-model";


export class RFQEvaluationSupplierAttributeGroupModel { 
    attributeGroupId : string;      
    title: string;     
    Name: string;
    group: any;
    rfqEvaluationSupplierHeaderAttributeModels: RFQEvaluationSupplierHeaderAttributeModel[];
    rfqEvaluationSupplierLineAttributeModels: RFQEvaluationSupplierLineAttributeModel[];

   
   }