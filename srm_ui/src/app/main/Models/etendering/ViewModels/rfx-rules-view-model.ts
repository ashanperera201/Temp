import { EtenderingLookupViewModel } from "./etendering-lookup-view-model";
import { RFQHeaderLineRulesViewModel } from "./rfq-header-line-rules-view-model";

export class RFXRulesViewModel {
    id: string;
    isDisabled: boolean;
    isTechnicalScoring: boolean;
    showScoringWeightToSuppliers: boolean; 
    isCommercialScoring: boolean; 
    showScoringCriteriaToSuppliers: boolean; 
    headerScoring: boolean; 
    linesScoring: boolean; 
    scoringTabToSuppliers: boolean; 
    rfxHeaders: RFQHeaderLineRulesViewModel[];
    rfxLines: RFQHeaderLineRulesViewModel[];
    rfqId : string;
    rfqRules: EtenderingLookupViewModel[];
    isNegoStyRFXHeaderAttachments : boolean;
    isNegoStyRFXHeaderAttributeItems : boolean;
    isNegoStyRFXHeaderCostFactors : boolean;
    isNegoStyRFXHeaderDeliverables : boolean;
    isNegoStyRFXHeaderDocumentTexts : boolean;
    isNegoStyRFXHeaderNotes : boolean;
    isNegoStyRFXHeaderPS : boolean;
    isNegoStyRFXHeaderTermsCondition : boolean;
    isNegoStyRFXHeaderSurveyForms : boolean;
    
    isNegoStyRFXLinesAttributeItems : boolean;
    isNegoStyRFXLinesAttachmentsItems : boolean;
    isNegoStyRFXLinesCostFactors : boolean;
    isNegoStyRFXLinesDeliverables : boolean;
    isNegoStyRFXLinesDocumentTexts : boolean;
    isNegoStyRFXLinesNotes : boolean;
    isNegoStyRFXLinesPS : boolean;
    isNegoStyRFXLinesTermsCondition : boolean;
    isNegoStyRFXLinesSurveyForms : boolean;
}