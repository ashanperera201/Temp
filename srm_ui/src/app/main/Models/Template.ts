export class Template{
    TemplateName : string;
    FilterText : string;
    Query : string;
}

export class UserTemplate{
    email : string;
    templateIds : number[];
}

export class UserFields{
    section : string;
    selectedColumns : string[];
}

export class KpiFields{
    startindex : number;
    pagesize : number;
    suppliername:string;
    suppliercode:string;
    status:string;
    ifscode:string;
    location:string;
    country:string;
    classification:string;
    createdfrom:string;
    createdto:string;
    lastsubmitfrom:string;
    lastsubmitto:string;
    srmreviewfrom:string;
    srmreviewto:string;
    auditcompletefrom: string;
    auditcompleteto: string;
    srmrecomfrom:string;
    srmrecomto:string;
    gmapprovedfrom:string;
    gmapprovedto:string;
    vpapprovedfrom:string;
    vpapprovedto:string;
    srmreviewdur: string;
    regisdur:string;
    auditcom:string;
    deptkpi:string;
    deptkpiResult:string;
    srmkpi:string;
    srmkpiResult:string;
}

export class SettingsFields{
    CategoryLimit : string;
    DraftLimit : string;
    ExpiryLimit:string;
}
