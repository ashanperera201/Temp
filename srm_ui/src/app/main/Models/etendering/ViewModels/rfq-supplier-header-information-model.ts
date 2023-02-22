import { Time } from "@angular/common";
import { RFQSupplierHeaderAttributeGroupModel } from "../rfq-supplier-header-attribute-group-model";
import { RFQSupplierPartLineAttributeGroupModel } from "../rfq-supplier-part-line-attribute-group-model";
import { RFQSupplierHeaderDeliverableModel } from "./rfq-supplier-header-deliverable-model";
import { RFQSupplierHeaderPaymentScheduleModel } from "../rfq-supplier-headerpayment-schedule-model";
import { RFQSupplierPartLinePaymentScheduleModel } from "../rfq-supplier-partLine-payment-schedule-model";
import { RFQSupplierHeaderSurveyTemplateQuestionModel } from "../rfq-supplierheader-surveytemplate-question-module";
import { RFQSupplierHeaderNoteModel } from "./rfq-supplier-header-note-model";
import { RFQSupplierPartLineNoteModel } from "./rfq-supplier-part-line-note-model";
import { RFQSupplierCostFactorGroupModel } from "../rfq-supplier-cost-factor-group-model";
import { RFQSupplierHeaderAttachmentViewModel } from "./rfq-supplier-header-attachment-view-model";
import { RFQSupplierPartLineAttachmentViewModel } from "./rfq-supplier-partline-attachment-view-model";
import { RFQSupplierHeaderDocumentTextViewModel } from "./rfq-supplier-header-document-text-model";
import { RFQSupplierPartLineDocumentTextViewModel } from "./rfq-supplier-partline-document-text-model";
import { RFQSupplierPartLine } from "./rfq-supplier-partline";
import { RFQSupplierHeaderInformationAttatchmentModel } from 'app/main/Models/etendering/ViewModels/rfq-supplier-header-information-attatchment-model';

export class RFQSupplierHeaderInformationModel {
    id: string;
    qouteNumber: string;
    refNumber: string;
    rfqCurrencyId: string;
    qouteValideUntil: Date;
    daysOrWeeksInt: string;
    daysOrWeekType: string;
    daysOrWeeks: Date;
    deliveryTime: Time;
    supplierSite: string;
    noteToBuyer: string;
    rfqId: string;
    supplierId: string;
    rfqSupplierHeaderInformationAttatchments:RFQSupplierHeaderInformationAttatchmentModel[];
    statusID: string;
    statusName:string;
    isButtonVisible:boolean;
    communicationMethod: string;
    //Supplier Header Attribute - Helani
    rfqSupplierHeaderAttributeGroups: RFQSupplierHeaderAttributeGroupModel[];
    //Supplier PartLine Attribute - Helani
    rfqSupplierPartLineAttributeGroups: RFQSupplierPartLineAttributeGroupModel[];
    rfqSupplierHeaderDeliverableModel: RFQSupplierHeaderDeliverableModel[];
    rfqSupplierHeaderPaymentScheduleList: RFQSupplierHeaderPaymentScheduleModel[];
    rfqSupplierPartLinePaymentScheduleList: RFQSupplierPartLinePaymentScheduleModel[];
    rfqSupplierHeaderSurveyTemplateQuestionList: RFQSupplierHeaderSurveyTemplateQuestionModel[];

    //Supplier Header Note - Manula
    rfqSupplierHeaderNotes: RFQSupplierHeaderNoteModel[];
    //Supplier PartLine Note - Manula
    rfqSupplierPartLineNotes: RFQSupplierPartLineNoteModel[];
    // RFQSupplier Cost factor(Header && Partline)- Shohan
    rfqSupplierCostFactorGroupModelList: RFQSupplierCostFactorGroupModel[];
    //supplier header attachments - Rahal
    rfqSupplierHeaderAttachments: RFQSupplierHeaderAttachmentViewModel[];
    //supplier lines attachments - Rahal
    rfqSupplierPartLineAttachments: RFQSupplierPartLineAttachmentViewModel[];
    //supplier header Document Text - Shohan
    rfqSupplierHeaderDocumentTextModelList: RFQSupplierHeaderDocumentTextViewModel[];
    //supplier part line Document Text - Shohan
    rfqSupplierPartLineDocumentTextModelList: RFQSupplierPartLineDocumentTextViewModel[];
    // Lines information - Shohan
    rfqSupplierPartLineModelList: RFQSupplierPartLine[];
    bidReceivedDate:string;
    surrogateProofOfAttachmentId:string;
    surrogateProofOfAttachmentFileName:string;


}