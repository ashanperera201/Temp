import { Component, ViewEncapsulation } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
    selector     : 'items-task-inner',
    templateUrl  : './items-task-inner.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsTaskInnerComponent
{
    panelOpenState = false;
    formFieldHelpers: string[] = [''];
    supplierDetailsSummary2 = new FormGroup({
        numbers: new FormControl('1653'),
        created: new FormControl('5/30/2021 12:14:39 PM'),
        status: new FormControl('New - Pending Criticality Matrix'),
        code: new FormControl('IMI-2021-0161'),
        name: new FormControl('Testing-30-5-2021-4'),
    });
    supplierDetails2 = new FormGroup({
        name: new FormControl('Adam Bloc'),
        name2: new FormControl('Heinz'),
        date: new FormControl('03/09/2015'),
        adcs: new FormControl('Sample Input 1'),
        email: new FormControl('www.abcd.com'),
        status: new FormControl('Sample Input 2'),
    });
    address2 = new FormGroup({
        country: new FormControl('USA'),
        city: new FormControl('Colorado'),
        othercity: new FormControl('Colorado Springs'),
        pobox: new FormControl('CO 80903'),
        postalcode: new FormControl('9900'),
        suplocation: new FormControl('in'),
        street: new FormControl('201 E PIKES PEAK AVE'),
        othercity2: new FormControl('Colorado Springs'),
    });
    contactPerson2 = new FormGroup({
        title: new FormControl(1),
        firstname: new FormControl('Adam'),
        lastname: new FormControl('Block'),
        position: new FormControl('Manager'),
        email: new FormControl('Adam@abcd.com'),
        telephone: new FormControl('+1 719-570-5336'),
        telephone2: new FormControl('719-570-5336'),
        ext: new FormControl('0'),
        mobile: new FormControl('+1 719-570-5336'),
        mobile2: new FormControl('719-570-5336'),
        fax: new FormControl('+1 719-570-5336'),
        mobile3: new FormControl('719-570-5336'),
    });
    registrationDetails2 = new FormGroup({
        regnumber: new FormControl('32432423'),
        regfile: new FormControl('Design supplier 01-06_RegistrationCertificate.pdf'),
        expirationdate: new FormControl(new Date()),
        vatnumber: new FormControl('32432423'),
        vatfile: new FormControl('Design supplier 01-06_VatRegistration_166_v1.docx'),
        gosifile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
        gosiexpirationdate: new FormControl(new Date()),
        saudiexpirationdate: new FormControl(new Date()),
        saudifile: new FormControl('Design supplier 01-06_SaudizationCertificate.docx'),
        zakathexpirationdate: new FormControl(new Date()),
        zakathfile: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),

    });
    generalinformation2 = new FormGroup({
        orgType: new FormControl(' '),
        managerial: new FormControl(' '),
        technical: new FormControl(' '),
        operations: new FormControl(' '),
        saudi: new FormControl(' '),
        total: new FormControl(' '),
        list: new FormControl(' '),
        organogram: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        list2: new FormControl(' '),
    });

    financialstatus2 = new FormGroup({
        year1: new FormControl(' '),
        finyear1: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        finyear2: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        finyear3: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
    });
    experience2 = new FormGroup({
        radio1: new FormControl('yes'),
        processdocs: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        internalpolicy: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        businessref1: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        businessref2: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
    });
    legal2 = new FormGroup({
        radio1: new FormControl('yes'),
    });
    health2 = new FormGroup({
        radio1: new FormControl('yes'),
    });
    quality2 = new FormGroup({
        radio1: new FormControl('yes'),
    });
    documents2 = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
        docregfile2: new FormControl('Design supplier 01-06_VatRegistration_166_v1.docx'),
        docregfile3: new FormControl('Design supplier 01-06_RegistrationLicenseCertificate_166_r1.pdf'),
        docregfile4: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        docregfile5: new FormControl('Design supplier 01-06_SaudizationCertificate_166_s1.docx'),
        docgenfile: new FormControl('Design supplier 01-06_OrgaizationChart_166_m1.pdf'),
        docfinfile: new FormControl('Design supplier 01-06_FinancialYear1_166_f1.pdf'),
    });
    regdetails2 = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
        docregfile2: new FormControl('Design supplier 01-06_VatRegistration_166_v1.docx'),
        docregfile3: new FormControl('Design supplier 01-06_RegistrationLicenseCertificate_166_r1.pdf'),
        docregfile4: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        docregfile5: new FormControl('Design supplier 01-06_SaudizationCertificate_166_s1.docx'),

    });
    gendetails2 = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
    });
    findetails2 = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
    });
    actionitems2 = new FormGroup({
        outcome: new FormControl('matrix'),
        outcome2: new FormControl('yes'),
    });

    constructor() {}
}
