export class RFAQAgreementInformationModel { 
         purchaseTypeId :string;
         priority :string;
         stepPriceBasisId :string;
         contractTitle :string;
         revisionNumber :string;

         contractSignDate :Date;
         reviewDate :Date;
         validFromDate:Date;
         validToDate :Date;
         
         agreementGroupId :string;
         agreementTypeId :string;
         maxAmountOptionId :string;
         terminationCondition :string;
         rFQId :string;

         isGroupAgreement :boolean;
         isActiveChangeAgreementExists :boolean;

         purchaseType :string;
         purchaseTypeDescription :string;
         stepPriceBasis    :string;    
         agreementGroup :string;
         agreementGroupDescription :string;
         agreementType:string;
         maxAmountOption :string;
         maxAmount :string;
         agreementGroupTypes: any[];
   }