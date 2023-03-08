export interface IEmailTemplate {
    id?: number;
    templateUniqueId?: string;
    emailTemplateCode: string;
    emailTemplateName: string;
    htmlContent: string;
    footerSignature: string;
    headerSignature: string;
    thanksGivingSection?: string;
    isActive: boolean;
    createdBy: string;
    createdOn: Date;
    updatedBy?: string;
    updatedOn?: Date;
}
