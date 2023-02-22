/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-var */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Output, Renderer2, ViewChild, ViewChildren, ViewEncapsulation, Inject, Optional, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { NormalHistoryComponent } from 'app/modules/common/normal-history/normal-history.component';
import { environment } from 'environments/environment.prod';
import moment from 'moment';
import { OverlayComponent } from '../../common/overlay/overlay.component';
import { FormArray } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { SupplierHistory } from 'app/shared/Models/SupplierHistory';
import { ApiService } from '../../../../../api.service';
import { Workflow } from 'app/shared/Models/WorkflowDto';
import { HistoryRestore } from 'app/shared/Models/HistoryRestoreDto';
import { IfsFailMessageDto } from 'app/shared/Models/IfsFailMessageDto';
import { SiteAuditItem } from 'app/shared/Models/SiteAuditItem';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { PortalToMsFlowDto } from 'app/shared/Models/PortalMSFlowDto';
import { AuthService } from '@auth0/auth0-angular';
import { SupplierAuditType } from 'app/main/Models/SupplierAuditType';
import { Store } from '@ngrx/store';
import { selectConcurrentInfo } from '../../../redux/selectors/concurrency.selector';
import { AppState } from '../../../redux/application-state'
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface Categories {
    id: number;
    position: number;
    generalCategory: string;
    subCategory: string;
    detailCategory: string;
    isChecked: boolean;
}

const ELEMENT_DATA_CATEGORIES: Categories[] = [];

@Component({
    selector: 'dashboard-inner',
    templateUrl: './dashboard-inner.component.html',
    styleUrls: ['./dashboard-inner.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [
        DatePipe
    ]
})
export class DashboardInnerComponent implements OnInit, OnDestroy {

    @ViewChild(NormalHistoryComponent) childHistory: NormalHistoryComponent;
    @ViewChild('mattabgroup', { static: false }) mattabgroup: MatTabGroup;

    public uploader: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadAudit' });
    public uploaderFinal: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadAuditFinal' });
    public uploaderReport: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadAuditNonConfirmity' });
    public uploaderReportAudit: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadAuditNCAudit' });
    minDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') + 'T' + '00:00';

    public registeredphotos: string[] = [];

    destroy$: Subject<boolean>;
    additionalContact1: boolean = false;
    additionalContact2: boolean = false;
    actualFileNameSave = '';
    showCriticalityButton: boolean = true;
    showunrejectButton: boolean = false;
    systemvisible: boolean = true;
    panelOpenState = false;
    formFieldHelpers: string[] = [''];
    POformFieldHelpers: string[] = [''];
    HSformFieldHelpers: string[] = [''];
    FinalformFieldHelpers: string[] = [''];
    auditformFieldHelpers: string[] = [''];
    supplierId: number = 0;
    contactsequence: number = 2;
    requ_page: string = '';
    supplier: any;
    supplierFileName: any;
    supplierCode = '';
    supplierDType = '';
    createdDate = '';
    createdTime = '';
    supplierName = '';
    supplierStatus = '';
    processid = '';
    invited: string;
    criticalityValue: string;
    criticalityScore: number;
    decisionOutcome: string = '';
    decisionRemark: string = '';
    onperformciritcalityclick: boolean = false;
    onperformrejectclick: boolean = false;
    onperformreturntoSRMclick: boolean = false;
    currentCheckedValue = null;
    IsperformCriticality: boolean = true;
    ismgrcomt: boolean = false;
    userrole: string = '';
    financevisible: boolean = true;
    experiencevisible: boolean = true;
    legalvisible: boolean = true;
    healthvisible: boolean = true;
    qualityvisible: boolean = true;
    bankvisible: boolean = true;
    allDocumentVisible: boolean = false;
    issrm: boolean = false;
    isonlysrm: boolean = false;
    isonlyhseqCritical: boolean = false;
    isauditor: boolean = false;
    isTester: boolean = false;
    generalInfo = true;
    registrationInfo = true;
    isadmin: boolean = false;
    isreviewer: boolean = false;
    actionItemsVisible: boolean = true;
    Final_Date_date: string;
    Final_Date_time: string;
    currentWorkflowActor = '';

    IsAuditDateComplete: boolean = false;
    IsAuditDateOnetimeComplete: boolean = false;
    IsAuditFinalComplete: boolean = false;
    IsAuditComplete: boolean = false;
    auditComplete: boolean = false;
    alreadyAnswered: boolean = true;
    isauditcompleteclick: boolean = false;
    dataSourceAll = ELEMENT_DATA_CATEGORIES;
    apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');
    selectedTab = new FormControl(0);
    groupdata: any = [];
    isNotRecommended: boolean = false;
    isRecommended: boolean = false;
    showUpdatedDate: boolean = true;
    regExpiryDate: any;
    gosiExpiryDate: any;
    saudiExpiryDate: any;
    zakathExpiryDate: any;

    isSuspendedProj1: boolean = false;
    islitigation1Ctrl: boolean = false;
    isshareholder1Ctrl: boolean = false;
    islegalAsset1Ctrl: boolean = false;
    islabour1Ctrl: boolean = false;
    isenvironment1Ctrl: boolean = false;
    isimiInterested1trl: boolean = false;
    isdedicatedpersCtrl: boolean = false;
    isstatisticCtrl: boolean = false;
    isqualityResp1Ctrl: boolean = false;

    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;
    thirdFormGroup: FormGroup;

    email: any;
    supplierType: string;
    currencycode: string;
    banknameList: any = [];
    cityList: any = [];
    cityListOriginal: any = [];
    selectedBankList: any = [];
    kingdom: string;
    selectedCountry: any;
    selectedBankCountry: any;
    checked: boolean = false;
    nonconfirmitychecked: boolean = false;
    showChecked: boolean = false;
    isTypeOfOrganization2CtrlSelected: boolean = false;

    modelGosi: any;
    modelReg: any;
    modelSaudi: any;
    modelZakat: any;
    modelAudit: any;
    selected = null;
    selected2 = null;
    selected3 = null;
    selected4 = null;
    selected5 = null;
    selected6 = null;
    selected7 = null;
    selected8 = null;
    selected9 = null;
    selected14 = null;
    selected15 = null;
    selected16 = null;
    selected17 = null;
    selected18 = null;
    selected19 = null;
    selected20 = null;
    selected21 = null;
    selected22 = null;
    selected23 = null;
    selected24 = null;
    selected25 = null;
    manageval = null;
    techval = null;
    opeval = null;
    saudival = null;
    public photos: string[] = [];
    public audits: string[] = [];
    public checklistfinal: string[] = [];
    public nonConfirmityObservation: string[] = [];
    public nonconfirmityAudit: string[] = [];
    site_audit_id;
    datefinal: Date;
    timefinal: string;
    displayedCategoriesColumns: string[] = ['generalCategory', 'subCategory', 'detailCategory'];
    displayedCategoriesColumnsNew: string[] = ['position', 'scope', 'check'];
    public form: FormGroup;
    public contactList: FormArray;
    approvalLabel: string = 'Recommendation';

    isemptyfinal = false;
    isemptyreport = false;
    isemptyauditall = false;
    // minDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")+"T"+"00:00";


    // supplierDetailsSummary = new FormGroup({
    //     numbers: new FormControl(''),
    //     created: new FormControl(''),
    //     status: new FormControl(''),
    //     code: new FormControl(''),
    //     name: new FormControl(''),
    // });

    iserror: boolean = false;
    issuccess: boolean = false;
    selectedComment: string;
    property_outcome: string = '';
    processclicked = false;
    workflowactor: string;
    workflowflag: string;
    ifsSupplier: any;
    isloadingdecision: boolean = false;
    isloadingaction: boolean = false;
    isreturntosrmclick: boolean = false;
    isloading: boolean;
    supplier_name_changed: boolean = false;
    country_changed: boolean = false;

    supplier_name_arabic_changed: boolean = false;
    establishment_year_changed: boolean = false;
    issued_by_changed: boolean = false;
    website_changed: boolean = false;
    supplier_type_changed: boolean = false;
    city_changed: boolean = false;
    other_city_changed: boolean = false;
    po_box_changed: boolean = false;
    postal_code_changed: boolean = false;
    address_line1_changed: boolean = false;
    address_line2_changed: boolean = false;
    title_changed: boolean = false;
    first_name_changed: boolean = false;
    last_name_changed: boolean = false;
    position_changed: boolean = false;
    email_changed: boolean = false;
    telephone_code_changed: boolean = false;
    telephone_changed: boolean = false;
    ext_changed: boolean = false;
    mobile_code_changed: boolean = false;
    mobile_changed: boolean = false;
    fax_code_changed: boolean = false;
    fax_no_changed: boolean = false;
    title_changed1: boolean = false;
    first_name_changed1: boolean = false;
    last_name_changed1: boolean = false;
    position_changed1: boolean = false;
    email_changed1: boolean = false;
    telephone_code_changed1: boolean = false;
    telephone_changed1: boolean = false;
    ext_changed1: boolean = false;
    mobile_code_changed1: boolean = false;
    mobile_changed1: boolean = false;
    fax_code_changed1: boolean = false;
    fax_no_changed1: boolean = false;
    title_changed2: boolean = false;
    first_name_changed2: boolean = false;
    last_name_changed2: boolean = false;
    position_changed2: boolean = false;
    email_changed2: boolean = false;
    telephone_code_changed2: boolean = false;
    telephone_changed2: boolean = false;
    ext_changed2: boolean = false;
    mobile_code_changed2: boolean = false;
    mobile_changed2: boolean = false;
    fax_code_changed2: boolean = false;
    fax_no_changed2: boolean = false;
    additional_scope_changed: boolean = false;
    category_changed: boolean = false;
    typeoforg_changed: boolean = false;
    typeoforg_other_changed: boolean = false;
    managerial_changed: boolean = false;
    technical_changed: boolean = false;
    operations_changed: boolean = false;
    saudinationals_changed: boolean = false;
    total_changed: boolean = false;
    address_parent_changed: boolean = false;
    address_sister_changed: boolean = false;
    ownership_changed: boolean = false;
    operatingProfit1Ctrl_changed: boolean = false;
    operatingProfit2Ctrl_changed: boolean = false;

    netIncome1Ctrl_changed: boolean = false;
    netIncome2Ctrl_changed: boolean = false;
    currentAsset1Ctrl_changed: boolean = false;
    currentAsset2Ctrl_changed: boolean = false;
    totalLiable1Ctrl_changed: boolean = false;
    totalLiable2Ctrl_changed: boolean = false;
    totalEquity1Ctrl_changed: boolean = false;
    totalEquity2Ctrl_changed: boolean = false;

    noOfYearsCtrl_changed: boolean = false;
    ownsPlantEquipCtrl_changed: boolean = false;
    designnCapCtrl_changed: boolean = false;
    finishProdCtrl_changed: boolean = false;
    internalPolicyCtrl_changed: boolean = false;
    registeredOrgCtrl_changed: boolean = false;
    suspendedProj1Ctrl_changed: boolean = false;
    litigation1Ctrl_changed: boolean = false;
    compliance1Ctrl_changed: boolean = false;
    shareholder1Ctrl_changed: boolean = false;
    legalAsset1Ctrl_changed: boolean = false;
    labour1Ctrl_changed: boolean = false;
    environment1Ctrl_changed: boolean = false;
    imiInterested1trl_changed: boolean = false;
    hse1Ctrl_changed: boolean = false;
    docuHseCtrl_changed: boolean = false;
    isohealthCtrl_changed: boolean = false;
    envtMgt1Ctrl_changed: boolean = false;
    dedicatedpersCtrl_changed: boolean = false;
    statisticCtrl_changed: boolean = false;
    qualityPolicy1Ctrl_changed: boolean = false;
    qualityMgtCtrl_changed: boolean = false;
    qualityMgtIsoCtrl_changed: boolean = false;
    qualityResp1Ctrl_changed: boolean = false;
    qualityreviewDateCtrl_changed: boolean = false;
    additionalCtrl_changed: boolean = false;
    additionalCtrl2_changed: boolean = false;
    additionalCtrl3_changed: boolean = false;
    additionalCtrl4_changed: boolean = false;
    additionalCtrl5_changed: boolean = false;
    bankCountryCodesCtrl_changed: boolean = false;
    bankNameCtrl_changed: boolean = false;
    otherNameCtrl_changed: boolean = false;
    swiftCtrl_changed: boolean = false;
    accountHolderNameCtrl_changed: boolean = false;
    accountNumberCtrl_changed: boolean = false;
    bankAddressLine1Ctrl_changed: boolean = false;
    ibanNumberCtrl_changed: boolean = false;
    bankAddressLine2Ctrl_changed: boolean = false;
    multicurrency_changed: boolean = false;
    susp2_changed: boolean = false;
    lit2_changed: boolean = false;
    shr2_changed: boolean = false;
    lg2_changed: boolean = false;
    lb2_changed: boolean = false;
    en2_changed: boolean = false;
    im2_changed: boolean = false;
    qn_changed: boolean = false;
    qd_changed: boolean = false;
    hsn_changed: boolean = false;
    hsd_changed: boolean = false;
    stn_changed: boolean = false;
    stf_changed: boolean = false;
    stm_changed: boolean = false;
    stl_changed: boolean = false;
    stfa_changed: boolean = false;
    ste_changed: boolean = false;
    r1_changed: boolean = false;
    v1_changed: boolean = false;
    g1_changed: boolean = false;
    s1_changed: boolean = false;
    z1_changed: boolean = false;
    a1_changed: boolean = false;
    m1_changed: boolean = false;
    a2_changed: boolean = false;
    a3_changed: boolean = false;
    a4_changed: boolean = false;
    a5_changed: boolean = false;
    a6_changed: boolean = false;
    f1_changed: boolean = false;
    f2_changed: boolean = false;
    f3_changed: boolean = false;
    e1_changed: boolean = false;
    e2_changed: boolean = false;
    e3_changed: boolean = false;
    e4_changed: boolean = false;
    e5_changed: boolean = false;
    h1_changed: boolean = false;
    h2_changed: boolean = false;
    h3_changed: boolean = false;
    h4_changed: boolean = false;
    h6_changed: boolean = false;
    q1_changed: boolean = false;
    q2_changed: boolean = false;
    q3_changed: boolean = false;
    b1_changed: boolean = false;
    b2_changed: boolean = false;
    crn_changed: boolean = false;
    crd_changed: boolean = false;
    vt_changed: boolean = false;
    god_changed: boolean = false;
    sad_changed: boolean = false;
    zad_changed: boolean = false;
    ws_changed: boolean = false;
    na_originalfile: boolean = false;
    na_originalfilename: string = '';
    ac_originalfile: boolean = false;
    ac_originalfilename: string = '';
    af_originalfile: boolean = false;
    af_originalfilename: string = '';
    h1_originalfile: boolean = false;
    h1_originalfilename: string = '';
    h2_originalfile: boolean = false;
    h2_originalfilename: string = '';
    h3_originalfile: boolean = false;
    h3_originalfilename: string = '';
    h4_originalfile: boolean = false;
    h4_originalfilename: string = '';
    h6_originalfile: boolean = false;
    h6_originalfilename: string = '';

    accountcurrency_changed: boolean = false;


    updated_date: boolean = false;
    updateddate: string = '';
    errormessage = 'There are errors on this page. Please correct them to proceed!';
    successmessage = 'Successfully saved!';
    hasBaseDropZoneOver: boolean;
    hasAnotherDropZoneOver: boolean;
    decisionRemarkHseq: string = '';

    auditRemark: string = '';
    finalRemark: string = '';
    additional_comment: string = '';
    configForm: FormGroup;
    profileSet: any = [];

    supplierDetails = new FormGroup({
        name: new FormControl('Adam Bloc'),
        name2: new FormControl('Heinz'),
        date: new FormControl('03/09/2015'),
        adcs: new FormControl('Sample Input 1'),
        email: new FormControl('www.abcd.com'),
        status: new FormControl('Sample Input 2'),
    });
    address = new FormGroup({
        country: new FormControl('USA'),
        city: new FormControl('Colorado'),
        othercity: new FormControl('Colorado Springs'),
        pobox: new FormControl('CO 80903'),
        postalcode: new FormControl('9900'),
        suplocation: new FormControl('in'),
        street: new FormControl('201 E PIKES PEAK AVE'),
        othercity2: new FormControl('Colorado Springs'),
    });
    contactPerson = new FormGroup({
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
    registrationDetails = new FormGroup({
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
    generalinformation = new FormGroup({
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

    financialstatus = new FormGroup({
        year1: new FormControl(' '),
        finyear1: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        finyear2: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        finyear3: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
    });
    experience = new FormGroup({
        radio1: new FormControl('yes'),
        processdocs: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        internalpolicy: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        businessref1: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        businessref2: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
    });
    legal = new FormGroup({
        radio1: new FormControl('yes'),
    });
    health = new FormGroup({
        radio1: new FormControl('yes'),
    });
    quality = new FormGroup({
        radio1: new FormControl('yes'),
    });
    documents = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
        docregfile2: new FormControl('Design supplier 01-06_VatRegistration_166_v1.docx'),
        docregfile3: new FormControl('Design supplier 01-06_RegistrationLicenseCertificate_166_r1.pdf'),
        docregfile4: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        docregfile5: new FormControl('Design supplier 01-06_SaudizationCertificate_166_s1.docx'),
        docgenfile: new FormControl('Design supplier 01-06_OrgaizationChart_166_m1.pdf'),
        docfinfile: new FormControl('Design supplier 01-06_FinancialYear1_166_f1.pdf'),
    });
    regdetails = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
        docregfile2: new FormControl('Design supplier 01-06_VatRegistration_166_v1.docx'),
        docregfile3: new FormControl('Design supplier 01-06_RegistrationLicenseCertificate_166_r1.pdf'),
        docregfile4: new FormControl('Design supplier 01-06_ZakatCertificate_166_z1.pdf'),
        docregfile5: new FormControl('Design supplier 01-06_SaudizationCertificate_166_s1.docx'),

    });
    gendetails = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
    });
    findetails = new FormGroup({
        docregfile: new FormControl('Design supplier 01-06_GOSICertificate_166_g1.docx'),
    });

    actionitems = new FormGroup({
        outcome: new FormControl('matrix'),
        outcome2: new FormControl('yes'),
    });


    bankinformation = new FormGroup({
        countrycode: new FormControl('AALAND'),
        bankname: new FormControl('ABB Bank'),
        otherbank: new FormControl('ABCDF'),
        swiftcode: new FormControl('32432423'),
        accountholdername: new FormControl('A J Adams'),
        accountnumber: new FormControl('125 7895 78954 11'),
        address1: new FormControl('A J Adams'),
        address2: new FormControl('yes'),
        ibannumber: new FormControl('32432423'),
        currency: new FormControl('Dirham'),
    });

    histroy1: any;
    audit_type: any;

    /**
     * Constructor
     */
    constructor(
        private fb: FormBuilder, public dialog: MatDialog, private _fuseConfirmationService: FuseConfirmationService, private route: ActivatedRoute, private api: ApiService, private http: HttpClient, private _formBuilder: FormBuilder, private ren: Renderer2,
        private datePipe: DatePipe, public auth: AuthService, private store: Store<AppState>
    ) {
        route.params.subscribe((params) => {

            this.userrole = localStorage.getItem('userrole');

            this.supplierId = Number(params['id']);
            this.requ_page = params['page'];
            this.getSupplierData();
            this.getWFdata();
            this.setRolePermission();

            this.getAuditPhotos(this.supplierId);
            this.getChecklistFinalPhotos(this.supplierId);
            this.getNCObservationPhotos(this.supplierId);
            this.getNonConfirmityAudit(this.supplierId);

            this.isloading = false;

            this.loadAuditType(this.supplierId);
        });
    }

    ngOnInit(): void {
        this.getPhotos(this.supplierId);
        this.getRegisterCopy(this.supplierId);

        this.createForm();

        this.configForm = this._formBuilder.group({
            title: 'Are you sure want to perform this action?',
            message: '<span class="font-medium">This action cannot be undone!</span>',
            icon: this._formBuilder.group({
                show: false,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Yes',
                    color: 'primary'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: false
        });
        // this.onConcurrentDataListner();
    }


    concurrency: boolean = false;
    
    onConcurrentDataListner = () => {
        this.store.select(state => state.concurrentData).subscribe({
            next: (serviceResult: any) => {
                if (serviceResult && serviceResult.commonConcurrency && serviceResult.commonConcurrency.userInformation) {
                   this.concurrency = true;
                } else {
                    this.concurrency = false;
                }
            }
        })
    }



    // Load Supplier's Audit Type
    async loadAuditType(supplierID): Promise<void> {
        await this.http.get(environment.nodeurl + '/api/supplier/audittype?supplierID=' + supplierID, { responseType: 'text' }).subscribe(async (data) => {
            console.log('Audit Type: ' + data);
            if (data) {
                if (data === 'Site Audit' || data === '') {
                    this.audit_type = 1;
                }
                else if (data === 'Remote Audit') {
                    this.audit_type = 2;
                }
                else if (data === 'Desktop Audit') {
                    this.audit_type = 3;
                }
                else if (data === 'NA') {
                    this.audit_type = 4;
                }
            }
        });
    }

    // Update Supplier's Sudit Type
    async updateSupplierAuditType(event): Promise<void> {
        const audit_type: SupplierAuditType = new SupplierAuditType();
        audit_type.supplierID = Number(this.supplierId);

        if (event === 'site_audit') {
            audit_type.auditType = 'Site Audit';
        }
        else {
            audit_type.auditType = 'Remote Audit';
        }

        await this.http.post<any>(environment.nodeurl + '/api/supplier/audittype', audit_type).subscribe(async (data2) => {
            console.log('Audit type updated success');
        });
    }

    bindSupplier(bindSupplier): void {
        const body = {
            supplier_id: this.supplier.supplier_id,
            supplier_name: this.supplier.supplier_name,
            email: this.supplier.email,
            supplier_name_arabic: this.supplier.supplier_name_arabic,
            establishment_year: this.supplier.establishment_year,
            issued_by: this.supplier.issued_by,
            web_site: this.supplier.web_site,
            supplier_type: this.supplier.supplier_type,
            country: this.supplier.country,
            city: this.supplier.city,
            other_city: this.supplier.other_city,

            po_box: this.supplier.po_box,
            postal_code: this.supplier.postal_code,
            address_line1: this.supplier.address_line1,
            address_line2: this.supplier.address_line2,
            title: this.supplier.title,
            first_name: this.supplier.first_name,
            last_name: this.supplier.last_name,
            telphone_country_code: this.supplier.telphone_country_code,
            telephone_no: this.supplier.telephone_no,
            extension: this.supplier.extension,
            position: this.supplier.position,
            mobile_country_code: this.supplier.mobile_country_code,
            mobile_no: this.supplier.mobile_no,
            fax_country_code: this.supplier.fax_country_code,
            fax_no: this.supplier.fax_no,
            additional_material: this.supplier.additional_material,

            cr_no: this.supplier.cr_no,
            vat_no: this.supplier.vat_no,
            gosi_certificate: this.supplier.gosi_certificate,

            parentcompany: this.supplier.parentcompany,
            sistercompany: this.supplier.sistercompany,
            ownercompany: this.supplier.ownercompany,
            operatingProfit1: this.supplier.operatingProfit1,
            operatingProfit2: this.supplier.operatingProfit2,
            netIncome1: this.supplier.netIncome1,
            netIncome2: this.supplier.netIncome2,
            currentAsset1: this.supplier.currentAsset1,
            currentAsset2: this.supplier.currentAsset2,
            totalLiable1: this.supplier.totalLiable1,
            totalLiable2: this.supplier.totalLiable2,
            totalEquity1: this.supplier.totalEquity1,
            totalEquity2: this.supplier.totalEquity2,
            noOfYears: this.supplier.noOfYears,
            ownsPlantEquip: this.supplier.ownsPlantEquip,
            designnCap: this.supplier.designnCap,
            finishProd: this.supplier.finishProd,
            internalPolicy: this.supplier.internalPolicy,
            registeredOrg: this.supplier.registeredOrg,
            suspendedProj1: this.supplier.suspendedProj1,
            suspendedProj2: this.supplier.suspendedProj2,
            litigation1: this.supplier.litigation1,
            litigation2: this.supplier.litigation2,
            compliance1: this.supplier.compliance1,
            compliance2: this.supplier.compliance2,
            shareholder1: this.supplier.shareholder1,
            shareholder2: this.supplier.shareholder2,
            labour1: this.supplier.labour1,
            labour2: this.supplier.labour2,
            environment1: this.supplier.environment1,
            environment2: this.supplier.environment2,
            imiInterested1: this.supplier.imiInterested1,
            imiInterested2: this.supplier.imiInterested2,
            hse1: this.supplier.hse1,
            hse2: this.supplier.hse2,
            docuHse: this.supplier.docuHse,
            isohealth: this.supplier.isohealth,
            envtMgt1: this.supplier.envtMgt1,
            envtMgt2: this.supplier.envtMgt2,
            dedicatedpers: this.supplier.dedicatedpers,
            statistic: this.supplier.statistic,
            qualityPolicy1: this.supplier.qualityPolicy1,
            qualityPolicy2: this.supplier.qualityPolicy2,
            qualityMgt: this.supplier.qualityMgt,
            qualityResp1: this.supplier.qualityResp1,
            qualityResp2: this.supplier.qualityResp2,
            qualityreviewDate: this.supplier.qualityreviewDate,
            typeOfOrganization: this.supplier.typeOfOrganization,
            typeOfOrganization2: this.supplier.typeOfOrganization2,
            managerialno: this.supplier.managerialno,
            technicalno: this.supplier.technicalno,
            operationsno: this.supplier.operationsno,
            saudiNationalsno: this.supplier.saudiNationalsno,
            totallno: this.supplier.totallno,
            hijriSelected: this.supplier.hijriSelected,

            bankCountryCodes: this.supplier.bankCountryCodes,
            // qualityResp2Ctrl: supplier.qualityResp2,
            bankName: this.supplier.bankName !== 'Other' ? this.supplier.bankName : this.supplier.otherBankName,
            swiftcode: this.supplier.swiftcode,
            accountHolderName: this.supplier.accountHolderName,
            ibanNo: this.supplier.ibanNo,
            bankAddress: this.supplier.bankAddress,
            bankAddress2: this.supplier.bankAddress2,
            accountCurrency: this.supplier.accountCurrency,
            account_number: this.supplier.account_number,
            isEmergencySupplier: 'FALSE',
            supplierCategories: bindSupplier,
            wasalAddress: this.supplier.wasalAddress,
            additionalCtrl: this.supplier.additionalCtrl,
            additionalCtrl2: this.supplier.additionalCtrl2,
            additionalCtrl3: this.supplier.additionalCtrl3,
            additionalCtrl4: this.supplier.additionalCtrl4,
            additionalCtrl5: this.supplier.additionalCtrl5,
            supplier_extra: this.supplier.supplier_extra
        };

        this.ifsSupplier = body;
    }

    public getPhotos(supId) {
        // this.http.get(environment.nodeurl + '/api/file/getPhotos').subscribe(data => this.photos = data['photos']);
        this.http.get(environment.nodeurl + '/api/file/getPhotosById?supId=' + supId).subscribe(data => this.photos = data['photos']);

        // var newsupId = supId.toString();
        // this.http.get(environment.nodeurl + '/api/supplier/getfilename?suplierId=' + supId )
        //     .subscribe(data => {

        //         this.supplierFileName = data[0];
        // });
        // this.http.get(environment.nodeurl + '/api/supplier/getfile?suplierId=' + supId)
        //     .subscribe(data => {
        //         this.supplierFileName = data;

        //         let suppliervalues =  data;
        //         for (let i = 0; i < this.supplierFileName.length; i++) {
        //             if(this.supplierFileName[i].originaL_FILE_NAME.includes('h1')){
        //                 this.h1_originalfile = true;
        //                 this.h1_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //                 console.log("H1 filename : "+this.h1_originalfilename);
        //             }
        //             if(this.supplierFileName[i].originaL_FILE_NAME.includes('h2')){
        //                 this.h2_originalfile = true;
        //                 this.h2_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //                 console.log("H1 filename : "+this.h2_originalfilename);
        //             }
        //             if(this.supplierFileName[i].originaL_FILE_NAME.includes('h3')){
        //                 this.h3_originalfile = true;
        //                 this.h3_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //                 console.log("H1 filename : "+this.h3_originalfilename);
        //             }
        //             if(this.supplierFileName[i].originaL_FILE_NAME.includes('h4')){
        //                 this.h4_originalfile = true;
        //                 this.h4_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //                 console.log("H1 filename : "+this.h4_originalfilename);
        //             }
        //             if(this.supplierFileName[i].originaL_FILE_NAME.includes('h6')){
        //                 this.h6_originalfile = true;
        //                 this.h6_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //                 console.log("H1 filename : "+this.h6_originalfilename);
        //             }
        //             // if(this.supplierFileName[i].originaL_FILE_NAME.includes('m1')){
        //             //     this.m1_originalfile = true;
        //             //     this.m1_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //             //     console.log("H1 filename : "+this.m1_originalfilename);
        //             // }
        //             // if(this.supplierFileName[i].originaL_FILE_NAME.includes('e1')){
        //             //     this.e1_originalfile = true;
        //             //     this.e1_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //             //     console.log("H1 filename : "+this.e1_originalfilename);
        //             // }
        //             // if(this.supplierFileName[i].originaL_FILE_NAME.includes('e2')){
        //             //     this.e2_originalfile = true;
        //             //     this.e2_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //             //     console.log("H1 filename : "+this.e2_originalfilename);
        //             // }
        //             // if(this.supplierFileName[i].originaL_FILE_NAME.includes('e3')){
        //             //     this.e3_originalfile = true;
        //             //     this.e3_originalfilename =  this.supplierFileName[i].originaL_FILE_NAME;
        //             //     console.log("H1 filename : "+this.e3_originalfilename);
        //             // }


        //         };

        //         // data[0].forEach((index) => {
        //         //     this.h1_originalfile = true;
        //         //     this.h1_originalfilename = this.supplierFileName[index].originaL_FILE_NAME;
        //         //     console.log("H1 filename : "+this.h1_originalfilename);
        //         // });
        // });
    }

    public getRegisterCopy(supId) {
        this.http.get(environment.nodeurl + '/api/file/getRegisteredPhotos?supId=' + supId).subscribe(data => this.registeredphotos = data['photos']);
    }

    public download(fileUrl: string) {
        console.log('hit download');
        window.location.href = environment.nodeurl + '/api/file/download?fileUrl=' + fileUrl;
    }

    createForm() {
        this.firstFormGroup = this._formBuilder.group({
            supplierNameCtrl: [''],
            supplierNameArabicCtrl: [''],
            websiteCtrl: [''],
            establishmentYearCtrl: [''],
            issuedByCtrl: [],
            supplierTypeCtrl: [''],
            countryCtrl: [''],
            kingdomCtrl: ['2'],
            stateCtrl: [''],
            otherCityCtrl: [],
            poBoxCtrl: [],
            postalCodeCtrl: [],
            addressLine1Ctrl: [''],
            addressLine1Ctr2: [],
            titleCtrl: [''],
            firstNameCtrl: [''],
            lastNameCtrl: [''],
            positionCtrl: [''],
            extCtrl: [],
            telephoneCodeCtrl: [],
            telephoneNumberCtrl: [''],
            mobileCodeCtrl: [],
            mobileNumberCtrl: [''],
            faxCodeCtrl: [],
            faxNumberCtrl: [],
            emailCtrl: [''],
            registrationCtrl: [''],
            hijriGregCtrl: [false],
            vatCtrl: [],
            waselCtrl: [],
            addressLine2Ctrl: [],
            accountNumberCtrl: [],
            additionalMaterialCtrl: [],
            reghijri: [],
            reggregory: [],
            gosihijri: [],
            gosigregory: [],
            saudihijri: [],
            saudigregory: [],
            zakathijri: [],
            zakatgregory: [],
            titleCtrl1: [''],
            firstNameCtrl1: [''],
            lastNameCtrl1: [''],
            positionCtrl1: [''],
            extCtrl1: [],
            telephoneCodeCtrl1: [],
            telephoneNumberCtrl1: [''],
            mobileCodeCtrl1: [],
            mobileNumberCtrl1: [''],
            faxCodeCtrl1: [],
            faxNumberCtrl1: [],
            emailCtrl1: [''],
            titleCtrl2: [''],
            firstNameCtrl2: [''],
            lastNameCtrl2: [''],
            positionCtrl2: [''],
            extCtrl2: [],
            telephoneCodeCtrl2: [],
            telephoneNumberCtrl2: [''],
            mobileCodeCtrl2: [],
            mobileNumberCtrl2: [''],
            faxCodeCtrl2: [],
            faxNumberCtrl2: [],
            emailCtrl2: ['']

        });

        this.secondFormGroup = this._formBuilder.group({
            typeOfOrganizationCtrl: [''],
            typeOfOrganization2Ctrl: [''],
            managerialCtrl: [''],
            totallCtrl: [],
            technicallCtrl: [''],
            operationsCtrl: [''],
            saudiNationalslCtrl: [],
            parentcompanyCtrl: [],
            sistercompanyCtrl: [],
            ownercompanyCtrl: [],
            operatingProfit1Ctrl: [''],
            operatingProfit2Ctrl: [],
            netIncome1Ctrl: [''],
            netIncome2Ctrl: [],
            currentAsset1Ctrl: [''],
            currentAsset2Ctrl: [],
            totalLiable1Ctrl: [''],
            totalLiable2Ctrl: [],
            totalEquity1Ctrl: [''],
            totalEquity2Ctrl: [],
            noOfYearsCtrl: [],
            ownsPlantEquipCtrl: [''],
            designnCapCtrl: [''],
            finishProdCtrl: [''],
            internalPolicyCtrl: [''],
            registeredOrgCtrl: [''],
            suspendedProj1Ctrl: [''],
            suspendedProj2Ctrl: [''],
            litigation1Ctrl: [''],
            litigation2Ctrl: [''],
            compliance1Ctrl: [''],
            compliance2Ctrl: [],
            shareholder1Ctrl: [''],
            shareholder2Ctrl: [''],
            labour1Ctrl: [''],
            labour2Ctrl: [''],
            legalAsset1Ctrl: [''],
            legalAsset2Ctrl: [''],
            environment1Ctrl: [''],
            environment2Ctrl: [''],
            imiInterested1trl: [''],
            imiInterested2trl: [''],
            hse1Ctrl: [''],
            hse2Ctrl: [],
            docuHseCtrl: [''],
            isohealthCtrl: [''],
            envtMgt1Ctrl: [''],
            envtMgt2Ctrl: [],
            dedicatedpersCtrl: [''],
            statisticCtrl: [''],
            statisticNearCtrl: [''],
            statisticFirstCtrl: [''],
            statisticMediCtrl: [''],
            statisticLostCtrl: [''],
            statisticFatalCtrl: [''],
            statisticEnvtCtrl: [''],
            hseNameCtrl: [''],
            hseDesigCtrl: [''],
            qualityNameCtrl: [''],
            qualityDesigCtrl: [''],
            qualityPolicy1Ctrl: [''],
            qualityPolicy2Ctrl: [],
            qualityMgtCtrl: [''],
            qualityMgtIsoCtrl: [''],
            qualityResp1Ctrl: [''],
            qualityreviewDateCtrl: [''],
            additionalCtrl: [],
            additionalCtrl2: [],
            additionalCtrl3: [],
            additionalCtrl4: [],
            additionalCtrl5: []
        });

        this.thirdFormGroup = this._formBuilder.group({
            bankCountryCodesCtrl: [''],
            bankNameCtrl: [''],
            otherNameCtrl: [],
            swiftCtrl: [],
            accountHolderNameCtrl: [''],
            ibanNumberCtrl: [],
            bankAddressLine1Ctrl: [''],
            bankAddressLine2Ctrl: [],
            accountCurrencyCtrl: [],
            accountNumberCtrl: [],
            multicurrency: []
        });





        this.firstFormGroup.disable();
        this.secondFormGroup.disable();
        this.thirdFormGroup.disable();
    }

    setValues(supplier): void {
        this.cityList = [];
        this.cityList = this.cityListOriginal.filter(x => x.countryName === supplier.country);

        this.selectedBankList = [];
        this.selectedBankList = this.banknameList.filter(x => x.country === supplier.bankCountryCodes);

        const reviewdate: any = supplier.qualityreviewDate ? this.datePipe.transform(supplier.qualityreviewDate, 'yyyy-MM-dd') : '';

        this.email = supplier.email;

        // console.log("The supplier changed these fields: " + supplier.supplier_extra);
        const changedFieldsArray = supplier.supplier_extra ? supplier.supplier_extra.split(',') : '';


        for (let i = 0; i < changedFieldsArray.length; i++) {

            this.accountNumberCtrl_changed = true;
            this.accountcurrency_changed = true;
            this.multicurrency_changed = true;


            changedFieldsArray[i] === '1' ? this.supplier_name_changed = true : this.supplier_name_changed = false;
            changedFieldsArray[i] === '2' ? this.supplier_name_arabic_changed = true : this.supplier_name_arabic_changed = false;
            changedFieldsArray[i] === '3' ? this.establishment_year_changed = true : this.establishment_year_changed = false;
            changedFieldsArray[i] === '4' ? this.issued_by_changed = true : this.issued_by_changed = false;
            changedFieldsArray[i] === '5' ? this.website_changed = true : this.website_changed = false;
            changedFieldsArray[i] === '6' ? this.supplier_type_changed = true : this.supplier_type_changed = false;
            changedFieldsArray[i] === '7' ? this.country_changed = true : this.country_changed = false;
            changedFieldsArray[i] === '8' ? this.city_changed = true : this.city_changed = false;
            changedFieldsArray[i] === '9' ? this.other_city_changed = true : this.other_city_changed = false;
            changedFieldsArray[i] === '!' ? this.po_box_changed = true : this.po_box_changed = false;
            changedFieldsArray[i] === '@' ? this.postal_code_changed = true : this.postal_code_changed = false;
            changedFieldsArray[i] === '#' ? this.address_line1_changed = true : this.address_line1_changed = false;
            changedFieldsArray[i] === '$' ? this.address_line2_changed = true : this.address_line2_changed = false;
            changedFieldsArray[i] === '%' ? this.title_changed = true : this.title_changed = false;
            changedFieldsArray[i] === '^' ? this.first_name_changed = true : this.first_name_changed = false;
            changedFieldsArray[i] === '&' ? this.last_name_changed = true : this.last_name_changed = false;
            changedFieldsArray[i] === '*' ? this.position_changed = true : this.position_changed = false;
            changedFieldsArray[i] === '(' ? this.telephone_code_changed = true : this.telephone_code_changed = false;
            changedFieldsArray[i] === ')' ? this.telephone_changed = true : this.telephone_changed = false;
            changedFieldsArray[i] === '<' ? this.ext_changed = true : this.ext_changed = false;
            changedFieldsArray[i] === '>' ? this.mobile_code_changed = true : this.mobile_code_changed = false;
            changedFieldsArray[i] === '?' ? this.mobile_changed = true : this.mobile_changed = false;
            changedFieldsArray[i] === '/' ? this.fax_code_changed = true : this.fax_code_changed = false;
            changedFieldsArray[i] === ':' ? this.fax_no_changed = true : this.fax_no_changed = false;
            changedFieldsArray[i] === '|' ? this.additional_scope_changed = true : this.additional_scope_changed = false;
            changedFieldsArray[i] === '+' ? this.category_changed = true : this.category_changed = false;
            changedFieldsArray[i] === '~' ? this.typeoforg_changed = true : this.typeoforg_changed = false;
            changedFieldsArray[i] === '`' ? this.typeoforg_other_changed = true : this.typeoforg_other_changed = false;
            changedFieldsArray[i] === '11' ? this.managerial_changed = true : this.managerial_changed = false;
            changedFieldsArray[i] === '12' ? this.technical_changed = true : this.technical_changed = false;
            changedFieldsArray[i] === '13' ? this.operations_changed = true : this.operations_changed = false;
            changedFieldsArray[i] === '14' ? this.saudinationals_changed = true : this.saudinationals_changed = false;
            changedFieldsArray[i] === '15' ? this.total_changed = true : this.total_changed = false;
            changedFieldsArray[i] === '16' ? this.address_parent_changed = true : this.address_parent_changed = false;
            changedFieldsArray[i] === '17' ? this.address_sister_changed = true : this.address_sister_changed = false;
            changedFieldsArray[i] === '18' ? this.ownership_changed = true : this.ownership_changed = false;
            changedFieldsArray[i] === '19' ? this.operatingProfit1Ctrl_changed = true : this.operatingProfit1Ctrl_changed = false;
            changedFieldsArray[i] === '20' ? this.operatingProfit2Ctrl_changed = true : this.operatingProfit2Ctrl_changed = false;
            changedFieldsArray[i] === '21' ? this.netIncome1Ctrl_changed = true : this.netIncome1Ctrl_changed = false;
            changedFieldsArray[i] === '22' ? this.netIncome2Ctrl_changed = true : this.netIncome2Ctrl_changed = false;
            changedFieldsArray[i] === '23' ? this.currentAsset1Ctrl_changed = true : this.currentAsset1Ctrl_changed = false;
            changedFieldsArray[i] === '24' ? this.currentAsset2Ctrl_changed = true : this.currentAsset2Ctrl_changed = false;
            changedFieldsArray[i] === '25' ? this.totalLiable1Ctrl_changed = true : this.totalLiable1Ctrl_changed = false;
            changedFieldsArray[i] === '26' ? this.totalLiable2Ctrl_changed = true : this.totalLiable2Ctrl_changed = false;
            changedFieldsArray[i] === '27' ? this.totalEquity1Ctrl_changed = true : this.totalEquity1Ctrl_changed = false;
            changedFieldsArray[i] === '28' ? this.totalEquity2Ctrl_changed = true : this.totalEquity2Ctrl_changed = false;
            changedFieldsArray[i] === '29' ? this.noOfYearsCtrl_changed = true : this.noOfYearsCtrl_changed = false;
            changedFieldsArray[i] === '30' ? this.ownsPlantEquipCtrl_changed = true : this.ownsPlantEquipCtrl_changed = false;
            changedFieldsArray[i] === '31' ? this.designnCapCtrl_changed = true : this.designnCapCtrl_changed = false;
            changedFieldsArray[i] === '32' ? this.finishProdCtrl_changed = true : this.finishProdCtrl_changed = false;
            changedFieldsArray[i] === '33' ? this.internalPolicyCtrl_changed = true : this.internalPolicyCtrl_changed = false;
            changedFieldsArray[i] === '34' ? this.registeredOrgCtrl_changed = true : this.registeredOrgCtrl_changed = false;
            changedFieldsArray[i] === '35' ? this.suspendedProj1Ctrl_changed = true : this.suspendedProj1Ctrl_changed = false;
            changedFieldsArray[i] === '36' ? this.litigation1Ctrl_changed = true : this.litigation1Ctrl_changed = false;
            changedFieldsArray[i] === '37' ? this.compliance1Ctrl_changed = true : this.compliance1Ctrl_changed = false;
            changedFieldsArray[i] === '38' ? this.shareholder1Ctrl_changed = true : this.shareholder1Ctrl_changed = false;
            changedFieldsArray[i] === '39' ? this.legalAsset1Ctrl_changed = true : this.legalAsset1Ctrl_changed = false;
            changedFieldsArray[i] === '40' ? this.labour1Ctrl_changed = true : this.labour1Ctrl_changed = false;
            changedFieldsArray[i] === '41' ? this.environment1Ctrl_changed = true : this.environment1Ctrl_changed = false;
            changedFieldsArray[i] === '42' ? this.imiInterested1trl_changed = true : this.imiInterested1trl_changed = false;
            changedFieldsArray[i] === '43' ? this.hse1Ctrl_changed = true : this.hse1Ctrl_changed = false;
            changedFieldsArray[i] === '44' ? this.docuHseCtrl_changed = true : this.docuHseCtrl_changed = false;
            changedFieldsArray[i] === '45' ? this.isohealthCtrl_changed = true : this.isohealthCtrl_changed = false;
            changedFieldsArray[i] === '46' ? this.envtMgt1Ctrl_changed = true : this.envtMgt1Ctrl_changed = false;
            changedFieldsArray[i] === '47' ? this.dedicatedpersCtrl_changed = true : this.dedicatedpersCtrl_changed = false;
            changedFieldsArray[i] === '48' ? this.statisticCtrl_changed = true : this.statisticCtrl_changed = false;
            changedFieldsArray[i] === '49' ? this.qualityPolicy1Ctrl_changed = true : this.qualityPolicy1Ctrl_changed = false;
            changedFieldsArray[i] === '50' ? this.qualityMgtCtrl_changed = true : this.qualityMgtCtrl_changed = false;
            changedFieldsArray[i] === '51' ? this.qualityMgtIsoCtrl_changed = true : this.qualityMgtIsoCtrl_changed = false;
            changedFieldsArray[i] === '52' ? this.qualityResp1Ctrl_changed = true : this.qualityResp1Ctrl_changed = false;
            changedFieldsArray[i] === '53' ? this.qualityreviewDateCtrl_changed = true : this.qualityreviewDateCtrl_changed = false;
            changedFieldsArray[i] === '54' ? this.additionalCtrl_changed = true : this.additionalCtrl_changed = false;
            changedFieldsArray[i] === '55' ? this.additionalCtrl2_changed = true : this.additionalCtrl2_changed = false;
            changedFieldsArray[i] === '56' ? this.additionalCtrl3_changed = true : this.additionalCtrl3_changed = false;
            changedFieldsArray[i] === '57' ? this.additionalCtrl4_changed = true : this.additionalCtrl4_changed = false;
            changedFieldsArray[i] === '58' ? this.additionalCtrl5_changed = true : this.additionalCtrl5_changed = false;
            changedFieldsArray[i] === '59' ? this.bankCountryCodesCtrl_changed = true : this.bankCountryCodesCtrl_changed = false;
            changedFieldsArray[i] === '60' ? this.bankNameCtrl_changed = true : this.bankNameCtrl_changed = false;
            changedFieldsArray[i] === '61' ? this.otherNameCtrl_changed = true : this.otherNameCtrl_changed = false;
            changedFieldsArray[i] === '62' ? this.swiftCtrl_changed = true : this.swiftCtrl_changed = false;
            changedFieldsArray[i] === '63' ? this.accountHolderNameCtrl_changed = true : this.accountHolderNameCtrl_changed = false;
            changedFieldsArray[i] === '64' ? this.accountNumberCtrl_changed = true : this.accountNumberCtrl_changed = false;
            changedFieldsArray[i] === '65' ? this.ibanNumberCtrl_changed = true : this.ibanNumberCtrl_changed = false;
            // starts here
            changedFieldsArray[i] === '66' ? this.title_changed1 = true : this.title_changed1 = false;
            changedFieldsArray[i] === '67' ? this.first_name_changed1 = true : this.first_name_changed1 = false;
            changedFieldsArray[i] === '68' ? this.last_name_changed1 = true : this.last_name_changed1 = false;
            changedFieldsArray[i] === '69' ? this.position_changed1 = true : this.position_changed1 = false;
            changedFieldsArray[i] === '70' ? this.email_changed1 = true : this.email_changed1 = false;
            changedFieldsArray[i] === '71' ? this.telephone_code_changed1 = true : this.telephone_code_changed1 = false;
            changedFieldsArray[i] === '72' ? this.telephone_changed1 = true : this.telephone_changed1 = false;
            changedFieldsArray[i] === '73' ? this.ext_changed1 = true : this.ext_changed1 = false;
            changedFieldsArray[i] === '74' ? this.mobile_code_changed1 = true : this.mobile_code_changed1 = false;
            changedFieldsArray[i] === '75' ? this.mobile_changed1 = true : this.mobile_changed1 = false;
            changedFieldsArray[i] === '76' ? this.fax_code_changed1 = true : this.fax_code_changed1 = false;
            changedFieldsArray[i] === '77' ? this.fax_no_changed1 = true : this.fax_no_changed1 = false;
            changedFieldsArray[i] === '78' ? this.title_changed2 = true : this.title_changed2 = false;
            changedFieldsArray[i] === '79' ? this.first_name_changed2 = true : this.first_name_changed2 = false;
            changedFieldsArray[i] === '80' ? this.last_name_changed2 = true : this.last_name_changed2 = false;
            changedFieldsArray[i] === '81' ? this.position_changed2 = true : this.position_changed2 = false;
            changedFieldsArray[i] === '82' ? this.email_changed2 = true : this.email_changed2 = false;
            changedFieldsArray[i] === '83' ? this.telephone_code_changed2 = true : this.telephone_code_changed2 = false;
            changedFieldsArray[i] === '84' ? this.telephone_changed2 = true : this.telephone_changed2 = false;
            changedFieldsArray[i] === '85' ? this.ext_changed2 = true : this.ext_changed2 = false;
            changedFieldsArray[i] === '86' ? this.mobile_code_changed2 = true : this.mobile_code_changed2 = false;
            changedFieldsArray[i] === '87' ? this.mobile_changed2 = true : this.mobile_changed2 = false;
            changedFieldsArray[i] === '88' ? this.fax_code_changed2 = true : this.fax_code_changed2 = false;
            changedFieldsArray[i] === '89' ? this.fax_no_changed2 = true : this.fax_no_changed2 = false;
            // ends here

            changedFieldsArray[i] === 'z' ? this.bankAddressLine1Ctrl_changed = true : this.bankAddressLine1Ctrl_changed = false;
            changedFieldsArray[i] === 'y' ? this.bankAddressLine2Ctrl_changed = true : this.bankAddressLine2Ctrl_changed = false;
            changedFieldsArray[i] === 'multicurrency' ? this.multicurrency_changed = true : this.multicurrency_changed = false;
            changedFieldsArray[i] === 'x' ? this.susp2_changed = true : this.susp2_changed = false;
            changedFieldsArray[i] === 'w' ? this.lit2_changed = true : this.lit2_changed = false;
            changedFieldsArray[i] === 'v' ? this.shr2_changed = true : this.shr2_changed = false;
            changedFieldsArray[i] === 'u' ? this.lg2_changed = true : this.lg2_changed = false;
            changedFieldsArray[i] === 't' ? this.lb2_changed = true : this.lb2_changed = false;
            changedFieldsArray[i] === 's' ? this.en2_changed = true : this.en2_changed = false;
            changedFieldsArray[i] === 'r' ? this.im2_changed = true : this.im2_changed = false;
            changedFieldsArray[i] === 'q' ? this.qn_changed = true : this.qn_changed = false;
            changedFieldsArray[i] === 'p' ? this.qd_changed = true : this.qd_changed = false;
            changedFieldsArray[i] === 'o' ? this.hsn_changed = true : this.hsn_changed = false;
            changedFieldsArray[i] === 'n' ? this.hsd_changed = true : this.hsd_changed = false;
            changedFieldsArray[i] === 'm' ? this.stn_changed = true : this.stn_changed = false;
            changedFieldsArray[i] === 'l' ? this.stf_changed = true : this.stf_changed = false;
            changedFieldsArray[i] === 'k' ? this.stm_changed = true : this.stm_changed = false;
            changedFieldsArray[i] === 'j' ? this.stl_changed = true : this.stl_changed = false;
            changedFieldsArray[i] === 'i' ? this.stfa_changed = true : this.stfa_changed = false;
            changedFieldsArray[i] === 'h' ? this.ste_changed = true : this.ste_changed = false;
            changedFieldsArray[i] === 'r1' ? this.r1_changed = true : this.r1_changed = false;
            changedFieldsArray[i] === 'v1' ? this.v1_changed = true : this.v1_changed = false;
            changedFieldsArray[i] === 'g1' ? this.g1_changed = true : this.g1_changed = false;
            changedFieldsArray[i] === 's1' ? this.s1_changed = true : this.s1_changed = false;
            changedFieldsArray[i] === 'z1' ? this.z1_changed = true : this.z1_changed = false;
            changedFieldsArray[i] === 'a1' ? this.a1_changed = true : this.a1_changed = false;
            changedFieldsArray[i] === 'm1' ? this.m1_changed = true : this.m1_changed = false;
            changedFieldsArray[i] === 'a2' ? this.a2_changed = true : this.a2_changed = false;
            changedFieldsArray[i] === 'a3' ? this.a3_changed = true : this.a3_changed = false;
            changedFieldsArray[i] === 'a4' ? this.a4_changed = true : this.a4_changed = false;
            changedFieldsArray[i] === 'a5' ? this.a5_changed = true : this.a5_changed = false;
            changedFieldsArray[i] === 'a6' ? this.a6_changed = true : this.a6_changed = false;
            changedFieldsArray[i] === 'f1' ? this.f1_changed = true : this.f1_changed = false;
            changedFieldsArray[i] === 'f2' ? this.f2_changed = true : this.f2_changed = false;
            changedFieldsArray[i] === 'f3' ? this.f3_changed = true : this.f3_changed = false;
            changedFieldsArray[i] === 'e1' ? this.e1_changed = true : this.e1_changed = false;
            changedFieldsArray[i] === 'e2' ? this.e2_changed = true : this.e2_changed = false;
            changedFieldsArray[i] === 'e3' ? this.e3_changed = true : this.e3_changed = false;
            changedFieldsArray[i] === 'e4' ? this.e4_changed = true : this.e4_changed = false;
            changedFieldsArray[i] === 'e5' ? this.e5_changed = true : this.e5_changed = false;
            changedFieldsArray[i] === 'h1' ? this.h1_changed = true : this.h1_changed = false;
            changedFieldsArray[i] === 'h2' ? this.h2_changed = true : this.h2_changed = false;
            changedFieldsArray[i] === 'h3' ? this.h3_changed = true : this.h3_changed = false;
            changedFieldsArray[i] === 'h4' ? this.h4_changed = true : this.h4_changed = false;
            changedFieldsArray[i] === 'h6' ? this.h6_changed = true : this.h6_changed = false;
            changedFieldsArray[i] === 'q1' ? this.q1_changed = true : this.q1_changed = false;
            changedFieldsArray[i] === 'q2' ? this.q2_changed = true : this.q2_changed = false;
            changedFieldsArray[i] === 'q3' ? this.q3_changed = true : this.q3_changed = false;
            changedFieldsArray[i] === 'b1' ? this.b1_changed = true : this.b1_changed = false;
            changedFieldsArray[i] === 'b2' ? this.b2_changed = true : this.b2_changed = false;
            changedFieldsArray[i] === 'g' ? this.crn_changed = true : this.crn_changed = false;
            changedFieldsArray[i] === 'f' ? this.crd_changed = true : this.crd_changed = false;
            changedFieldsArray[i] === 'e' ? this.vt_changed = true : this.vt_changed = false;
            changedFieldsArray[i] === 'd' ? this.god_changed = true : this.god_changed = false;
            changedFieldsArray[i] === 'c' ? this.sad_changed = true : this.sad_changed = false;
            changedFieldsArray[i] === 'b' ? this.zad_changed = true : this.zad_changed = false;
            changedFieldsArray[i] === 'a' ? this.ws_changed = true : this.ws_changed = false;
        }

        // this.additionalContact1 = true;
        // this.additionalContact2 = true;

        if (supplier.first_name1 === '') {
            this.additionalContact1 = false;
            this.contactsequence = 1;
        } else {
            this.additionalContact1 = true;
            this.contactsequence = 2;
        }

        supplier.first_name2 === '' ? this.additionalContact2 = false : this.additionalContact2 = true;

        this.firstFormGroup.patchValue({
            supplierNameCtrl: supplier.supplier_name,
            supplierNameArabicCtrl: supplier.supplier_name_arabic,
            establishmentYearCtrl: supplier.establishment_year === 0 ? '' : supplier.establishment_year,
            issuedByCtrl: supplier.issued_by,
            websiteCtrl: supplier.web_site,
            //supplier_type:    text,
            countryCtrl: supplier.country,
            stateCtrl: supplier.city,
            otherCityCtrl: supplier.other_city,
            poBoxCtrl: supplier.po_box,
            postalCodeCtrl: supplier.postal_code,
            addressLine1Ctrl: supplier.address_line1,
            addressLine2Ctrl: supplier.address_line2,
            titleCtrl: supplier.title,
            firstNameCtrl: supplier.first_name,
            lastNameCtrl: supplier.last_name,
            positionCtrl: supplier.position,
            telephoneCodeCtrl: supplier.telphone_country_code,
            telephoneNumberCtrl: supplier.telephone_no,
            extCtrl: supplier.extension === 0 ? '' : supplier.extension,
            emailCtrl: supplier.email,
            mobileCodeCtrl: supplier.mobile_country_code,
            mobileNumberCtrl: supplier.mobile_no,
            faxCodeCtrl: supplier.fax_country_code,
            faxNumberCtrl: supplier.fax_no,
            registrationCtrl: supplier.cr_no,
            cr_exp_date: supplier.cr_exp_date,
            additionalMaterialCtrl: supplier.additional_material,
            vatCtrl: supplier.vat_no,
            certificateDateCtrl: '',
            waselCtrl: supplier.wasalAddress,
            titleCtrl1: supplier.title1,
            firstNameCtrl1: supplier.first_name1,
            lastNameCtrl1: supplier.last_name1,
            positionCtrl1: supplier.position1,
            telephoneCodeCtrl1: supplier.telphone_country_code1,
            telephoneNumberCtrl1: supplier.telephone_no1,
            extCtrl1: supplier.extension1 === 0 ? '' : supplier.extension1,
            emailCtrl1: supplier.email1,
            mobileCodeCtrl1: supplier.mobile_country_code1,
            mobileNumberCtrl1: supplier.mobile_no1,
            faxCodeCtrl1: supplier.fax_country_code1,
            faxNumberCtrl1: supplier.fax_no1,
            titleCtrl2: supplier.title2,
            firstNameCtrl2: supplier.first_name2,
            lastNameCtrl2: supplier.last_name2,
            positionCtrl2: supplier.position2,
            telephoneCodeCtrl2: supplier.telphone_country_code2,
            telephoneNumberCtrl2: supplier.telephone_no2,
            extCtrl2: supplier.extension2 === 0 ? '' : supplier.extension2,
            emailCtrl2: supplier.email2,
            mobileCodeCtrl2: supplier.mobile_country_code2,
            mobileNumberCtrl2: supplier.mobile_no2,
            faxCodeCtrl2: supplier.fax_country_code2,
            faxNumberCtrl2: supplier.fax_no2,
        });

        this.secondFormGroup.patchValue({
            parentcompanyCtrl: supplier.parentcompany,
            sistercompanyCtrl: supplier.sistercompany,
            ownercompanyCtrl: supplier.ownercompany,
            operatingProfit1Ctrl: supplier.operatingProfit1 === 0 ? '' : supplier.operatingProfit1,
            operatingProfit2Ctrl: supplier.operatingProfit2 === 0 ? '' : supplier.operatingProfit2,
            netIncome1Ctrl: supplier.netIncome1 === 0 ? '' : supplier.netIncome1,
            netIncome2Ctrl: supplier.netIncome2 === 0 ? '' : supplier.netIncome2,
            currentAsset1Ctrl: supplier.currentAsset1 === 0 ? '' : supplier.currentAsset1,
            currentAsset2Ctrl: supplier.currentAsset2 === 0 ? '' : supplier.currentAsset2,
            totalLiable1Ctrl: supplier.totalLiable1 === 0 ? '' : supplier.totalLiable1,
            totalLiable2Ctrl: supplier.totalLiable2 === 0 ? '' : supplier.totalLiable2,
            totalEquity1Ctrl: supplier.totalEquity1 === 0 ? '' : supplier.totalEquity1,
            totalEquity2Ctrl: supplier.totalEquity2 === 0 ? '' : supplier.totalEquity2,
            noOfYearsCtrl: supplier.noOfYears === 0 ? '' : supplier.noOfYears,
            ownsPlantEquipCtrl: supplier.ownsPlantEquip,
            designnCapCtrl: supplier.designnCap,
            finishProdCtrl: supplier.finishProd,
            internalPolicyCtrl: supplier.internalPolicy,
            registeredOrgCtrl: supplier.registeredOrg,
            suspendedProj1Ctrl: supplier.suspendedProj1,
            suspendedProj2Ctrl: supplier.suspendedProj2,
            litigation1Ctrl: supplier.litigation1,
            litigation2Ctrl: supplier.litigation2,
            compliance1Ctrl: supplier.compliance1,
            compliance2Ctrl: supplier.compliance2,
            shareholder1Ctrl: supplier.shareholder1,
            shareholder2Ctrl: supplier.shareholder2,
            labour1Ctrl: supplier.labour1,
            labour2Ctrl: supplier.labour2,
            legalAsset1Ctrl: supplier.legalAsset1,
            legalAsset2Ctrl: supplier.legalAsset2,
            environment1Ctrl: supplier.environment1,
            environment2Ctrl: supplier.environment2,
            imiInterested1trl: supplier.imiInterested1,
            imiInterested2trl: supplier.imiInterested2,
            hse1Ctrl: supplier.hse1,
            hse2Ctrl: supplier.hse2,
            docuHseCtrl: supplier.docuHse,
            isohealthCtrl: supplier.isohealth,
            envtMgt1Ctrl: supplier.envtMgt1,
            envtMgt2Ctrl: supplier.envtMgt2,
            dedicatedpersCtrl: supplier.dedicatedpers,
            statisticCtrl: supplier.statistic,
            //temp
            statisticNearCtrl: supplier.statisticNear,
            statisticFirstCtrl: supplier.statisticFirst,
            statisticMediCtrl: supplier.statisticMedical,
            statisticLostCtrl: supplier.statisticLost,
            statisticFatalCtrl: supplier.statisticFatal,
            statisticEnvtCtrl: supplier.statisticEnvt,

            qualityPolicy1Ctrl: supplier.qualityPolicy1,
            qualityPolicy2Ctrl: supplier.qualityPolicy2,
            qualityMgtCtrl: supplier.qualityMgt,
            //temp
            qualityMgtIsoCtrl: supplier.qualityMgtIso,
            hseNameCtrl: supplier.hseName,
            hseDesigCtrl: supplier.hseDesig,
            qualityNameCtrl: supplier.qualityResp2,
            qualityDesigCtrl: supplier.qualityResp3,

            qualityResp1Ctrl: supplier.qualityResp1,
            // qualityResp2Ctrl: supplier.qualityResp2,
            qualityreviewDateCtrl: (reviewdate !== '' && reviewdate.split('-')[0] > 1900) ? new Date(reviewdate.split('-')[0], reviewdate.split('-')[1] - 1, reviewdate.split('-')[2]) : '',
            typeOfOrganizationCtrl: supplier.typeOfOrganization,
            typeOfOrganization2Ctrl: supplier.typeOfOrganization2,
            managerialCtrl: supplier.managerialno,
            technicallCtrl: supplier.technicalno,
            operationsCtrl: supplier.operationsno,
            saudiNationalslCtrl: supplier.saudiNationalsno,
            totallCtrl: supplier.managerialno + supplier.technicalno + supplier.operationsno,
            additionalCtrl: supplier.additionalCtrl,
            additionalCtrl2: supplier.additionalCtrl2,
            additionalCtrl3: supplier.additionalCtrl3,
            additionalCtrl4: supplier.additionalCtrl4,
            additionalCtrl5: supplier.additionalCtrl5

        });

        this.thirdFormGroup.patchValue({
            bankCountryCodesCtrl: supplier.bankCountryCodes,
            bankNameCtrl: supplier.bankName,
            otherNameCtrl: supplier.otherBankName,
            swiftCtrl: supplier.swiftcode,
            accountHolderNameCtrl: supplier.accountHolderName,
            ibanNumberCtrl: supplier.ibanNo,
            bankAddressLine1Ctrl: supplier.bankAddress,
            bankAddressLine2Ctrl: supplier.bankAddress2,
            accountCurrencyCtrl: supplier.accountCurrency,
            accountNumberCtrl: supplier.account_number
        });

        this.regExpiryDate = supplier.cr_exp_date;

        supplier.suspendedProj1 === 'Yes' ? this.isSuspendedProj1 = true : this.isSuspendedProj1 = false;
        supplier.litigation1 === 'Yes' ? this.islitigation1Ctrl = true : this.islitigation1Ctrl = false;
        supplier.shareholder1 === 'Yes' ? this.isshareholder1Ctrl = true : this.isshareholder1Ctrl = false;
        supplier.legalAsset1 === 'Yes' ? this.islegalAsset1Ctrl = true : this.islegalAsset1Ctrl = false;
        supplier.labour1 === 'Yes' ? this.islabour1Ctrl = true : this.islabour1Ctrl = false;
        supplier.environment1 === 'Yes' ? this.isenvironment1Ctrl = true : this.isenvironment1Ctrl = false;
        supplier.imiInterested1 === 'Yes' ? this.isimiInterested1trl = true : this.isimiInterested1trl = false;
        supplier.dedicatedpers === 'Yes' ? this.isdedicatedpersCtrl = true : this.isdedicatedpersCtrl = false;
        supplier.statistic === 'Yes' ? this.isstatisticCtrl = true : this.isstatisticCtrl = false;
        supplier.qualityResp1 === 'Yes' ? this.isqualityResp1Ctrl = true : this.isqualityResp1Ctrl = false;

        const regformatdate: any = supplier.reg_date ? this.datePipe.transform(supplier.reg_date, 'yyyy-MM-dd') : '';
        const gosiformatdate: any = supplier.gosi_date ? this.datePipe.transform(supplier.gosi_date, 'yyyy-MM-dd') : '';
        const saudiformatdate: any = supplier.saudi_date ? this.datePipe.transform(supplier.saudi_date, 'yyyy-MM-dd') : '';
        const zakathformatdate: any = supplier.zakath_date ? this.datePipe.transform(supplier.zakath_date, 'yyyy-MM-dd') : '';

        let selmodelReg = new NgbDate(Number(regformatdate.split('-')[0]), Number(regformatdate.split('-')[1]) - 1, Number(regformatdate.split('-')[2]));
        if (Number(regformatdate.split('-')[1]) - 1 === 0) {
            selmodelReg = new NgbDate(Number(regformatdate.split('-')[0]) - 1, 12, Number(regformatdate.split('-')[2]));
        }
        let selmodelGosi = new NgbDate(Number(gosiformatdate.split('-')[0]), Number(gosiformatdate.split('-')[1]) - 1, Number(gosiformatdate.split('-')[2]));
        if (Number(gosiformatdate.split('-')[1]) - 1 === 0) {
            selmodelGosi = new NgbDate(Number(gosiformatdate.split('-')[0] - 1), 12, Number(gosiformatdate.split('-')[2]));
        }
        let selmodelSaudi = new NgbDate(Number(saudiformatdate.split('-')[0]), Number(saudiformatdate.split('-')[1]) - 1, Number(saudiformatdate.split('-')[2]));
        if (Number(saudiformatdate.split('-')[1]) - 1 === 0) {
            selmodelSaudi = new NgbDate(Number(saudiformatdate.split('-')[0] - 1), 12, Number(saudiformatdate.split('-')[2]));
        }
        let selmodelZakat = new NgbDate(Number(zakathformatdate.split('-')[0]), Number(zakathformatdate.split('-')[1]) - 1, Number(zakathformatdate.split('-')[2]));
        if (Number(zakathformatdate.split('-')[1]) - 1 === 0) {
            selmodelZakat = new NgbDate(Number(zakathformatdate.split('-')[0] - 1), 12, Number(zakathformatdate.split('-')[2]));
        }
        if (supplier.hijriSelected === 'Y') {
            const reg_date = selmodelReg.year === 1317 ? ConvertSolarToLunar(selmodelReg.day, selmodelReg.month, 1442) : ConvertSolarToLunar(selmodelReg.day, selmodelReg.month, selmodelReg.year);
            const gosi_date = selmodelGosi.year === 1317 ? ConvertSolarToLunar(selmodelGosi.day, selmodelGosi.month, 1442) : ConvertSolarToLunar(selmodelGosi.day, selmodelGosi.month, selmodelGosi.year);
            const saudi_date = selmodelSaudi.year === 1317 ? ConvertSolarToLunar(selmodelSaudi.day, selmodelSaudi.month, 1442) : ConvertSolarToLunar(selmodelSaudi.day, selmodelSaudi.month, selmodelSaudi.year);
            const zakath_date = selmodelZakat.year === 1317 ? ConvertSolarToLunar(selmodelZakat.day, selmodelZakat.month, 1442) : ConvertSolarToLunar(selmodelZakat.day, selmodelZakat.month, selmodelZakat.year);

            this.modelReg = reg_date.year + '/' + reg_date.month + '/' + reg_date.day;
            this.modelGosi = gosi_date.year + '/' + gosi_date.month + '/' + gosi_date.day;
            this.modelSaudi = saudi_date.year + '/' + saudi_date.month + '/' + saudi_date.day;
            this.modelZakat = zakath_date.year + '/' + zakath_date.month + '/' + zakath_date.day;
        } else {
            this.modelReg = selmodelReg.year === 1900 ? null : selmodelReg.year + '/' + selmodelReg.month + '/' + selmodelReg.day;
            this.modelGosi = selmodelGosi.year === 1900 ? null : selmodelGosi.year + '/' + selmodelGosi.month + '/' + selmodelGosi.day;
            this.modelSaudi = selmodelSaudi.year === 1900 ? null : selmodelSaudi.year + '/' + selmodelSaudi.month + '/' + selmodelSaudi.day;
            this.modelZakat = selmodelZakat.year === 1900 ? null : selmodelZakat.year + '/' + selmodelZakat.month + '/' + selmodelZakat.day;

        }

        if (supplier.hijriSelected !== 'Y') {
            if (supplier.country !== 'SAUDI ARABIA' || supplier.country !== 'BAHRAIN' || supplier.country !== 'KUWAIT' ||
                supplier.country !== 'OMAN' || supplier.country !== 'QATAR' || supplier.country !== 'UNITED ARAB EMIRATES') {
                if (this.modelReg === '1899/12/1') {
                    this.modelReg = '';
                }
            }
        } else {
            this.firstFormGroup.patchValue({
                reggregory: this.modelReg
            });
        }

        if (supplier.country === 'SAUDI ARABIA') {
            this.kingdom = '1';
            this.showChecked = true;
            this.firstFormGroup.patchValue({ kingdomCtrl: '1' });
        }
        else {
            this.kingdom = '2';
            this.showChecked = false;
            this.firstFormGroup.patchValue({ kingdomCtrl: '2' });
        }

        if (supplier.hijriSelected === 'Y') {
            this.checked = true;
            this.firstFormGroup.patchValue({ hijriGregCtrl: true });
        } else {
            this.checked = false;
            this.firstFormGroup.patchValue({ hijriGregCtrl: false });
        }

        if (supplier.multicurrency === 'Y') {
            this.thirdFormGroup.patchValue({ multicurrency: true });
        } else {
            this.thirdFormGroup.patchValue({ multicurrency: false });
        }

        if (supplier.supplier_type.length > 0 && supplier.supplier_type[0] !== '') {
            const typeSelected = [];
            for (let i = 0; i < supplier.supplier_type.length; i++) {
                typeSelected.push(supplier.supplier_type[i]);
            }
            this.firstFormGroup.patchValue({ supplierTypeCtrl: typeSelected });
        }

        if (supplier.typeOfOrganization === 'Other - Please Specify') {
            this.isTypeOfOrganization2CtrlSelected = true;
        } else {
            this.isTypeOfOrganization2CtrlSelected = false;
        }


    }

    getSupplierData(): void {
        this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + this.supplierId)
            .subscribe((data) => {
                this.supplier = data[0];

                this.supplierCode = this.supplier.supplier_code;
                this.createdDate = this.supplier.created_date.split(' ')[0];
                this.createdTime = this.supplier.created_date.split(' ')[1] + ' ' + this.supplier.created_date.split(' ')[2];
                this.supplierName = this.supplier.supplier_name;
                this.supplierStatus = this.supplier.status;
                this.processid = this.supplier.process_id;
                this.invited = this.supplier.invitestatus === 1 ? 'yes' : 'no';
                this.supplierDType = this.supplier.supplier_type;


                this.criticalityScore = this.supplier.criticality;
                if (this.criticalityScore > 0) {

                    if (this.criticalityScore >= 7) {
                        this.criticalityValue = 'High Critical';
                    }

                    if (this.criticalityScore === 5) {
                        this.criticalityValue = 'Critical';
                    }

                    if (this.criticalityScore === 6) {
                        this.criticalityValue = 'Critical';
                    }

                    if (this.criticalityScore < 5) {
                        this.criticalityValue = 'Non Critical';
                    }
                } else {
                    this.criticalityValue = 'Not Performed  Yet';
                }

                const catvalues = data[0].supplierCategories;
                if (catvalues) {
                    var categories = [];
                    for (let i = 0; i < catvalues.length; i++) {
                        categories.push({
                            //id: i,
                            position: catvalues[i].position,
                            generalCategory: catvalues[i].generalCategory,
                            subCategory: catvalues[i].subCategory,
                            detailCategory: catvalues[i].detailCategory,
                            isChecked: catvalues[i].isChecked,
                            isSRMChecked: catvalues[i].isSRMChecked,
                            generalCode: catvalues[i].generalCode,
                            subCode: catvalues[i].subCode,
                            detailCode: catvalues[i].detailCode
                        });
                    }
                    this.supplier.supplierCategories = categories;
                    this.bindSupplier(categories);
                    this.setValues(data[0]);
                    this.dataSourceAll = [];
                    this.dataSourceAll = categories;
                }

                if (this.userrole === 'IMI-SRM Analyst' || (this.userrole === 'IMI-HSEQ' && this.supplier.criticality < 7) ||
                    this.userrole.trim() === 'IMI-Auditor/QA') {
                    this.isTester = true;
                    this.issrm = true;
                    if (this.userrole === 'IMI-SRM Analyst' && (this.supplier.process_id === '' || this.supplier.status === 'Pending Criticality Matrix')) {
                        this.isonlysrm = true;
                    }
                    if ((this.userrole === 'IMI-HSEQ' && this.supplier.criticality < 7)) {
                        this.isonlyhseqCritical = true;
                    }
                } else if (this.userrole === 'IMI-HSEQ' && this.supplier.criticality > 6) {
                    this.isTester = true;
                    this.isauditor = true;
                    console.log('Audit complete is: ' + this.IsAuditComplete);
                    console.log('Audit complete is: ' + this.auditComplete);
                    if (this.auditComplete || this.IsAuditComplete || this.IsAuditFinalComplete) {
                        this.selectedTab.setValue(1);
                    }

                    this.getAuditDetails();
                } else if (this.userrole === 'Admin') {
                    this.isadmin = true;
                } else if (this.userrole === 'IMI-Treasury Bank Reviewer' || this.userrole === 'IMI-Treasury Bank Approver') {
                    this.issrm = true;
                }

                if (this.supplier.status.indexOf('Awaiting Clarification from Supplier') !== -1) {
                    this.alreadyAnswered = false;
                } else {
                    this.alreadyAnswered = true;
                }

                if (this.supplier.status !== 'Rejected' && this.supplier.status !== 'Approved') {
                    const headers = new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': this.apiTokenworkflow
                    });
                    const options = { headers: headers };
                    this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetInstanceCurrentRole?processId=' + this.processid, options)
                        .subscribe((data) => {
                            const currentstatus = data['result'];

                            if (currentstatus === 'SRM Approval') {
                                this.currentWorkflowActor = 'IMI-SRM Analyst';
                                this.approvalLabel = 'Recommendation';
                            } else if (currentstatus === 'Return To SRM') {
                                this.currentWorkflowActor = 'IMI-SRM Analyst';
                                this.approvalLabel = 'Recommendation';
                            } else if (currentstatus === 'GM Approval') {
                                this.currentWorkflowActor = 'IMI-GM';
                                this.approvalLabel = 'Approval';
                            } else if (currentstatus === 'VP Approval') {
                                this.currentWorkflowActor = 'IMI-VP';
                                this.approvalLabel = 'Approval';
                            } else if (currentstatus === 'Desktop Audit') {
                                this.currentWorkflowActor = 'IMI-HSEQ';
                                this.approvalLabel = 'Recommendation';
                            } else if (currentstatus === 'Clarification Audit') {
                                this.currentWorkflowActor = 'IMI-SRM Analyst';
                            } else if (currentstatus === 'QA Audit') {
                                this.currentWorkflowActor = 'IMI-Auditor/QA';
                            } else if (currentstatus === 'Site Audit') {
                                this.currentWorkflowActor = 'IMI-HSEQ';
                                this.approvalLabel = 'Recommendation';
                            }
                            else if (currentstatus === 'Treasurer Team Review') {
                                this.currentWorkflowActor = 'IMI-Treasury Bank Reviewer';
                                this.approvalLabel = 'Recommendation';
                            } else if (currentstatus === 'Treasurer Review') {
                                this.currentWorkflowActor = 'IMI-Treasury Bank Approver';
                                this.approvalLabel = 'Approval';
                            }

                            if (this.userrole === this.currentWorkflowActor) {
                                this.actionItemsVisible = true;
                                if (this.userrole === 'IMI-Treasury Bank Reviewer' || this.userrole === 'IMI-Treasury Bank Approver') {
                                    this.loadApproveStatusDataBank();
                                } else {
                                    this.loadApproveStatusData();
                                }
                            } else {
                                this.actionItemsVisible = false;
                            }
                        });
                } else {
                    this.actionItemsVisible = false;
                    if (this.supplier.status === 'Rejected' && this.userrole === 'IMI-SRM Analyst') {
                        this.showunrejectButton = true;
                    }
                }
            });
    }

    setRolePermission(): void {
        this.userrole = localStorage.getItem('userrole');

        if (this.userrole === 'IMI-SRM Analyst') {
            this.bankvisible = false;
            this.allDocumentVisible = true;
            this.isTester = true;
            this.systemvisible = true;

        } else if (this.userrole === 'IMI-GM') {
            this.bankvisible = false;
            this.allDocumentVisible = true;
            this.isTester = true;
            this.systemvisible = true;


        } else if (this.userrole === 'IMI-VP') {
            this.bankvisible = false;
            this.allDocumentVisible = true;
            this.isTester = true;
            this.systemvisible = true;
            this.showCriticalityButton = true;

        } else if (this.userrole === 'IMI-HSEQ') {
            this.financevisible = false;
            this.legalvisible = false;
            this.bankvisible = false;
            this.systemvisible = false;
            this.showCriticalityButton = true;
            this.allDocumentVisible = true;
            this.registrationInfo = false;

        } else if (this.userrole.trim() === 'IMI-Auditor/QA') {
            this.financevisible = false;
            this.legalvisible = false;
            this.bankvisible = false;
            this.systemvisible = false;
            this.showCriticalityButton = true;
            this.allDocumentVisible = true;
            this.isTester = true;

        } else if (this.userrole === 'IMI-Treasury Bank Reviewer') {
            this.generalInfo = false;
            this.financevisible = true;
            this.experiencevisible = false;
            this.legalvisible = false;
            this.healthvisible = false;
            this.qualityvisible = false;
            this.systemvisible = false;
            this.allDocumentVisible = true;
            this.showCriticalityButton = false;
            this.isreviewer = true;
            this.isTester = true;

        } else if (this.userrole === 'IMI-Treasury Bank Approver') {
            this.generalInfo = false;
            this.financevisible = true;
            this.experiencevisible = false;
            this.legalvisible = false;
            this.healthvisible = false;
            this.qualityvisible = false;
            this.systemvisible = false;
            this.allDocumentVisible = true;
            this.showCriticalityButton = false;
            this.isreviewer = true;
            this.isTester = true;

        } else if (this.userrole === 'IMI-SRM Analyst' || this.userrole === 'Admin') {
            this.allDocumentVisible = true;
            this.isTester = true;
            this.systemvisible = true;
            this.showCriticalityButton = true;
        }
    }

    statusChange(event: any, selected: number): void {
        this.iserror = false;
        this.errormessage = '';

        setTimeout(() => {
            if (this.currentCheckedValue && this.currentCheckedValue === event.value) {
                event.checked = false;
                this.ren.removeClass(event['_elementRef'].nativeElement, 'cdk-focused');
                this.ren.removeClass(event['_elementRef'].nativeElement, 'cdk-program-focused');
                this.currentCheckedValue = null;
                this.decisionOutcome = null;
                this.decisionRemark = '';
            } else {
                this.currentCheckedValue = event.value;
            }

            if (this.currentCheckedValue !== null) {
                if (selected > 0) {
                    this.ismgrcomt = true;
                } else {
                    this.ismgrcomt = false;
                }
                if (selected === 1) {
                    this.onperformciritcalityclick = true;
                    this.IsperformCriticality = true;
                } else {
                    this.onperformciritcalityclick = false;
                    this.IsperformCriticality = false;
                }
                if (selected === 3) {
                    this.onperformrejectclick = true;
                } else {
                    this.onperformrejectclick = false;
                }
                if (selected === 7) {
                    this.onperformreturntoSRMclick = true;
                } else {
                    this.onperformreturntoSRMclick = false;
                }
            } else {
                this.ismgrcomt = false;
            }
        });
    }


    loadApproveStatusData(): void {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiTokenworkflow
        });
        const options = { headers: headers };
        if (this.userrole === this.currentWorkflowActor) {
            this.actionItemsVisible = true;

            this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetAvaliableCommands?processId=' + this.processid, options)
                .subscribe((data) => {
                    this.groupdata = [];
                    const comments = data['result'].map(a => a.name);
                    if (comments.indexOf('Approve') > -1) {
                        this.groupdata = comments;
                    } else {
                        this.groupdata = comments.sort((a, b) => (a.id < b.id) ? 1 : -1);

                    }
                });
        }
    }


    loadApproveStatusDataBank(): void {
        this.http.get<any>(environment.nodeurl + '/api/workflow/bankSearch?suplierId=' + this.supplierId).subscribe((data) => {
            if (data) {
                this.processid = data['processid'];
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.apiTokenworkflow
                });
                const options = { headers: headers };

                this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetAvaliableCommands?processId=' + this.processid, options)
                    .subscribe((data) => {
                        this.groupdata = [];
                        const comments = data['result'].map(a => a.name);
                        this.groupdata = comments;
                    });
            }


        });
    }

    getWFdata(): void {
        this.auth.user$.subscribe(
            async profile => (
                this.profileSet = profile,
                this.getworkflowtoken()
            )
        );


    }

    getworkflowtoken(): void {
        const wfuser = 'admin';
        const documentbody =
        {
            'userNameOrEmailAddress': wfuser,
            'password': '123qwe',
            'rememberClient': true
        };


        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        const options = { headers: headers };

        this.http.post(environment.workflowApiUrl + '/api/TokenAuth/Authenticate', documentbody, options)
            .subscribe((data) => {
                const workflowToken = data['result'].accessToken;
                localStorage.setItem('apiTokenworkflow', workflowToken);
            });
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(OverlayComponent, {
            width: '100%',
            height: 'auto',
            data: {
                supplierId: this.supplierId,
                supplierCode: this.supplierCode,
                createdDate: this.supplier.created_date,
                supplierName: this.supplierName,
                supplierStatus: this.supplierStatus,
                supplierType: this.firstFormGroup.value.supplierTypeCtrl,
                IsperformCriticality: this.IsperformCriticality,
                actionItemsVisible: this.actionItemsVisible
            },
            disableClose: true
        });
    }

    reactiveSupplier(): void {
        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

        dialogRef.addPanelClass('confirmation-dialog');
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result === 'confirmed') {
                this.isloadingdecision = true;

                const userid = localStorage.getItem('userrole');
                const useremail = localStorage.getItem('useremail');
                const userfullname = localStorage.getItem('userfullname');

                const history = new SupplierHistory();
                history.status_id = 5;
                history.supplier_id = this.supplierId.toString();
                history.status_remark = 'Reactivated';
                history.status_comment = this.decisionRemark;
                history.iscurrentstatus = 'Completed';
                history.userid = userfullname;
                history.userrole = userid;
                history.ÇommandName = 'Un-Reject';
                history.useremail = useremail;

                this.api.saveHistory(history);

                const status = 'Reactivated';
                this.http.get<any>(environment.nodeurl + '/api/supplier/status?supplierId=' + this.supplierId + '&status=' + status).subscribe(async (data3) => {
                });
                this.issuccess = true;
                this.isloadingdecision = false;
                this.successmessage = 'Successfully Re-activated the supplier!';
                this.showunrejectButton = false;
            }
        });

    }

    historyclicked: boolean = false;
    tabClick(event: MatTabChangeEvent) {
        const tab = event.tab.textLabel;
        console.log(tab);
        if (tab === 'Workflow History') {
            this.issuccess = false;
            this.historyclicked = true;
        }

        if (tab === 'Documents') {
            const userrole = localStorage.getItem('userrole');

            if (userrole === 'IMI-SRM Analyst' || userrole === 'Admin') {
                this.allDocumentVisible = true;
            } else {
                this.allDocumentVisible = true;
            }
        }

        if (tab === 'Action Items') {
            console.log('Audit complete is: ' + this.IsAuditComplete);
            console.log('Audit complete is: ' + this.auditComplete);
            if (this.auditComplete || this.IsAuditComplete || this.IsAuditFinalComplete) {
                this.selectedTab.setValue(1);
            }

            const userrole = localStorage.getItem('userrole');

            if (userrole === 'IMI-GM') {
                this.http.get(environment.nodeurl + '/api/workflow/history?suplierId=' + this.supplierId)
                    .subscribe((datahis) => {
                        let historyAction: any = [];
                        historyAction = datahis;


                        // historyAction.forEach(element => {

                        console.log(historyAction[1].çommandName);

                        if (historyAction[1].çommandName === 'Not Recommended') {
                            this.isNotRecommended = true;
                            this.isRecommended = false;

                        } else if (historyAction[1].çommandName === 'Recommended') {
                            this.isNotRecommended = false;
                            this.isRecommended = true;

                        }
                        // });
                    });
            }
        }
        if (tab === 'Action Items') {
            this.showUpdatedDate = false;
        }

        if (tab === 'Workflow History') {
            this.showUpdatedDate = false;
        }

        if (tab === 'Documents') {
            this.showUpdatedDate = true;
        }

        if (tab === 'Supplier Registration Data') {
            this.showUpdatedDate = true;
        }
    }


    async getAuditDetails() {
        this.http.get(environment.nodeurl + '/api/siteaudit/searchItem?suplierId=' + this.supplierId).subscribe((data) => {
            const result: any = data;
            if (result && result.length > 0) {
                const index = result.length - 1;
                this.auditRemark = data[index]['audit_remark'];
                this.site_audit_id = data[index]['site_audit_id'];

                const dat2: any = moment(new Date(data[index]['audit_date_final'])).format('YYYY-MM-DD') + 'T' + data[index]['audit_time_final'];

                this.datefinal = dat2;
                this.timefinal = data[index]['audit_time_final'];
                this.finalRemark = data[index]['final_Date_remark'];
                this.additional_comment = data[index]['additional_comment'];

                this.http.get(environment.nodeurl + '/api/siteaudit/search?suplierId=' + this.supplierId + '&siteauditid=' + this.site_audit_id).subscribe((data) => {
                    const resultDates: any = data;
                    const contactold = [];
                    if (resultDates.length > 0) {
                        for (let i = 0; i < resultDates.length; i++) {
                            const date = moment(new Date(resultDates[i]['audit_date'])).format('YYYY-MM-DD') + 'T' + resultDates[i]['audit_time'];
                            const time = '';

                            contactold.push(this.createContact(date, time));
                        }
                        this.IsAuditDateComplete = true;
                        this.IsAuditFinalComplete = this.datefinal.toString() === '1900-01-01T' ? false : true;
                    } else {
                        contactold.push(this.createContact(null, null));
                    }
                    this.form = this.fb.group({
                        contacts: this.fb.array(contactold)
                    });

                    // set contactlist to this field
                    this.contactList = this.form.get('contacts') as FormArray;

                    this.http.get(environment.nodeurl + '/api/workflow/history?suplierId=' + this.supplierId)
                        .subscribe((datahis) => {
                            let history: any = [];
                            history = datahis;
                            const auditcomplete = history.find(a => a.status_remark === 'Audit Complete' && a.iscurrentstatus === 'Completed');
                            if (auditcomplete) {
                                this.IsAuditComplete = true;
                                this.auditComplete = true;
                                this.decisionRemark = auditcomplete['status_comment'];
                            } else {
                                this.IsAuditComplete = false;
                                this.auditComplete = false;
                            }
                        });

                });
            } else {
                const contactold = [];
                contactold.push(this.createContact(null, null));
                this.form = this.fb.group({
                    contacts: this.fb.array(contactold)
                });
                this.contactList = this.form.get('contacts') as FormArray;

            }
        });
    }

    createContact(date, time): FormGroup {
        return this.fb.group({
            date: [date, Validators.compose([Validators.required])],
            time: [time, Validators.compose([Validators.required])]
        });
    }

    removeContact(index) {
        this.contactList.removeAt(index);
    }

    addContact() {
        this.contactList.push(this.createContact(null, null));
    }

    get contactFormGroup() {
        return this.form.get('contacts') as FormArray;
    }

    public getAuditPhotos(supId) {
        this.http.get(environment.nodeurl + '/api/file/getAuditPhotos?supId=' + supId).subscribe(data => this.audits = data['photos']);
    }

    public getChecklistFinalPhotos(supId) {
        this.http.get(environment.nodeurl + '/api/file/getChecklistPhotos?supId=' + supId).subscribe(data => this.checklistfinal = data['photos']);
    }

    public getNCObservationPhotos(supId) {
        this.nonConfirmityObservation = [];
        this.http.get(environment.nodeurl + '/api/file/getAuditNCPhotos?supId=' + supId).subscribe(data => this.nonConfirmityObservation = data['photos']);
    }

    public getNonConfirmityAudit(supId) {
        this.nonconfirmityAudit = [];
        this.http.get(environment.nodeurl + '/api/file/getNCAuditPhotos?supId=' + supId).subscribe(data => this.nonconfirmityAudit = data['photos']);
    }

    uploadcomplete(cat, file) {

        console.log(file.files.length);
        if (cat === 'C') {
            if (file.files[0].size > 0) {
                const newFileItem = new FileItem(this.uploaderFinal, file.files[0], null);
                this.uploaderFinal.queue.push(newFileItem);
                this.iserror = false;
                this.errormessage = '';
            }
            else {
                this.isemptyauditall = false;

            }
        }
        if (cat === 'R') {
            if (file.files[0].size > 0) {
                const newFileItem = new FileItem(this.uploaderReport, file.files[0], null);
                this.uploaderReport.queue.push(newFileItem);
                this.iserror = false;
                this.errormessage = '';
            }
            else {
                this.isemptyreport = false;

            }
        }
        if (cat === 'A') {
            if (file.files[0].size > 0) {
                const newFileItem = new FileItem(this.uploader, file.files[0], null);
                this.uploader.queue.push(newFileItem);
                this.iserror = false;
                this.errormessage = '';
            }
            else {
                this.isemptyauditall = false;

            }
        }
        if (cat === 'NR') {
            if (file.files[0].size > 0) {
                const newFileItem = new FileItem(this.uploaderReportAudit, file.files[0], null);
                this.uploaderReportAudit.queue.push(newFileItem);
                this.iserror = false;
                this.errormessage = '';
            }
            else {
                this.isemptyreport = false;

            }
        }
    }


    onNotifySubmitTest() {
        if (this.isauditor && !this.nonconfirmitychecked && !this.auditComplete) {
            this.iserror = true;
            this.errormessage = 'Please select Non Confirmity/Audit Complete!';
        }
        else if (this.isauditor && this.nonconfirmitychecked && this.uploaderReport.queue.length === 0 && this.nonConfirmityObservation.length === 0) {
            this.iserror = true;
            this.errormessage = 'Observation is mandatory!';
        }
        else if (this.isauditor && this.nonconfirmitychecked && this.uploaderReportAudit.queue.length === 0 && this.nonconfirmityAudit.length === 0) {
            this.iserror = true;
            this.errormessage = 'Non Confirmity Audit Report is mandatory!';
        }
        else if (this.isauditor && this.auditComplete && this.uploaderFinal.queue.length === 0) {
            this.iserror = true;
            this.errormessage = 'Final checklist is mandatory!';
        } else {
            if (this.isauditor && this.auditComplete && this.isemptyfinal) {
                this.iserror = true;
                this.errormessage = 'Please remove empty files!';
            } else {
                this.onNotifySubmit();
            }
        }
    }

    async onNotifySubmit() {
        if (this.decisionRemark === '') {
            this.iserror = true;
            this.errormessage = 'Please enter remark!';
            this.formFieldHelpers.push('has-error');
        } else if (!this.isauditor && (this.decisionOutcome === null || this.decisionOutcome === '')) {
            this.iserror = true;
            this.errormessage = 'Please enter outcome!';
        }
        else {

            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingdecision = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');

                    // Swal.fire('Please dont refresh the web browser, we are processing your request!');
                    // Swal.showLoading();

                    if (this.isauditor) {
                        this.decisionOutcome = this.auditComplete ? '4' : (this.nonconfirmitychecked ? '2' : this.decisionOutcome);
                    } else {
                        this.decisionOutcome = this.decisionOutcome;
                    }


                    this.alreadyAnswered = false;

                    if (this.decisionOutcome === '2') {
                        if (this.isauditor) {

                            this.http.get<any>(environment.nodeurl + '/api/file/deleteAuditNonConfirmity?supplierid=' + this.supplierId).subscribe((data) => {
                                for (const key in this.uploaderReport.queue) {
                                    const oldFileItem: FileItem = this.uploaderReport.queue[key];
                                    const actualFilename = 'NC' + '_' + oldFileItem.file.name;
                                    const finalstring = oldFileItem.file.name.split(' ').join('_');
                                    const finalstringwithoutspace = finalstring.replace(/ /g, '');
                                    const newFilename = '_' + this.supplierId + '_' + finalstringwithoutspace;
                                    // var newFilename = 'NonConfirmity_' + this.supplierId + '_' + oldFileItem.file.name.split(' ').join('_');
                                    const newFile: File = new File([this.uploaderReport.queue[key]._file], newFilename, { type: oldFileItem.file.type });
                                    const newFileItem = new FileItem(this.uploaderReport, newFile, null);
                                    this.uploaderReport.queue[key] = newFileItem;
                                }
                                this.uploaderReport.uploadAll();
                            });

                            this.http.get<any>(environment.nodeurl + '/api/file/deleteAuditNCReport?supplierid=' + this.supplierId).subscribe((data) => {
                                for (const key in this.uploaderReportAudit.queue) {
                                    const oldFileItem: FileItem = this.uploaderReportAudit.queue[key];
                                    const actualFilename = 'NA' + '_' + oldFileItem.file.name;
                                    const finalstring = oldFileItem.file.name.split(' ').join('_');
                                    const finalstringwithoutspace = finalstring.replace(/ /g, '');
                                    const newFilename = '_' + this.supplierId + '_' + finalstringwithoutspace;
                                    // var newFilename = 'NonConfirmityAudit_' + this.supplierId + '_' + oldFileItem.file.name.split(' ').join('_');
                                    const newFile: File = new File([this.uploaderReportAudit.queue[key]._file], newFilename, { type: oldFileItem.file.type });
                                    const newFileItem = new FileItem(this.uploaderReportAudit, newFile, null);
                                    this.uploaderReportAudit.queue[key] = newFileItem;
                                }
                                this.uploaderReportAudit.uploadAll();
                            });

                            var history = new SupplierHistory();
                            history.status_id = 4;
                            history.supplier_id = this.supplierId.toString();
                            history.status_remark = 'Awaiting Supplier response on NCR';
                            history.status_comment = this.decisionRemark;
                            history.iscurrentstatus = 'Pending';
                            history.userid = userfullname;
                            history.userrole = userid;
                            history.ÇommandName = '';
                            history.useremail = useremail;

                            this.api.saveHistory(history);

                            if (true) {
                                await this.sleep(20000);
                                this.http.post<any>(environment.nodeurl + '/api/email/auditnonconfirmity?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&category=ncr', null).subscribe((data) => {
                                    this.issuccess = true;
                                    this.isloadingdecision = false;
                                    this.successmessage = 'Successfully sent the email to the supplier!';
                                });
                            }



                        } else {

                            let fullrolename = '';
                            if (userid === 'IMI-SRM Analyst') {
                                fullrolename = 'srm';
                            } else if (userid === 'IMI-GM') {
                                fullrolename = 'gm';
                            } else if (userid === 'IMI-VP') {
                                fullrolename = 'vp';
                            } else if (userid === 'IMI-HSEQ') {
                                fullrolename = 'hseq';
                            } else if (userid === 'IMI-Treasury Bank Reviewer') {
                                fullrolename = 'trev';
                            } else if (userid === 'IMI-Treasury Bank Approver') {
                                fullrolename = 'tapp';
                            }

                            this.http.get<any>(environment.nodeurl + '/api/email/moreinfo?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&roleName=' + fullrolename).subscribe((data) => {
                                this.issuccess = true;
                                this.isloadingdecision = false;

                                this.successmessage = 'Successfully sent the email to the supplier!';

                                const history = new SupplierHistory();
                                history.status_id = 4;
                                history.supplier_id = this.supplierId.toString();
                                history.status_remark = 'Awaiting Clarification from Supplier';
                                history.status_comment = this.decisionRemark;
                                history.iscurrentstatus = 'Pending';
                                history.userid = userfullname;
                                history.userrole = userid;
                                history.ÇommandName = 'Need more information';
                                history.useremail = useremail;

                                this.api.saveHistory(history);

                            });
                        }

                    } else if (this.decisionOutcome === '3') {
                        this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&category=reject').subscribe((data) => {
                            this.issuccess = true;
                            this.isloadingdecision = false;

                            this.successmessage = 'Successfully sent the email!';

                            const history = new SupplierHistory();
                            history.status_id = 5;
                            history.supplier_id = this.supplierId.toString();
                            history.status_remark = 'Rejected';
                            history.status_comment = this.decisionRemark;
                            history.iscurrentstatus = 'Completed';
                            history.userid = userfullname;
                            history.userrole = userid;
                            history.ÇommandName = 'Reject';
                            history.useremail = useremail;

                            this.api.saveHistory(history);

                        });
                    } else if (this.decisionOutcome === '4') {
                        //debugger;

                        this.IsAuditComplete = true;

                        var history = new SupplierHistory();
                        history.status_id = 8;
                        history.supplier_id = this.supplierId.toString();
                        history.status_remark = 'Audit Complete';
                        history.status_comment = this.decisionRemark;
                        history.iscurrentstatus = 'Completed';
                        history.userid = userfullname;
                        history.userrole = userid;
                        history.ÇommandName = 'Audit Completed';
                        history.useremail = useremail;

                        // this.histroy1 = this.api.saveHistory(history);

                        await this.http.post<any>(environment.nodeurl + '/api/supplier/saveSupplierHistory', history).subscribe(async (data) => {

                            const history2 = new SupplierHistory();
                            history2.status_id = 9;
                            history2.supplier_id = this.supplierId.toString();
                            history2.status_remark = 'Awaiting for HSEQ Recommendation';
                            history2.status_comment = this.decisionRemark;
                            history2.iscurrentstatus = 'Pending';
                            history2.userid = userfullname;
                            history2.userrole = userid;
                            history2.ÇommandName = 'Audit Completed';
                            history.useremail = useremail;

                            // this.histroy1 = this.api.saveHistory(history2);

                            await this.http.post<any>(environment.nodeurl + '/api/supplier/saveSupplierHistory', history2).subscribe(async (data) => {

                                for (const key in this.uploaderFinal.queue) {
                                    const oldFileItem: FileItem = this.uploaderFinal.queue[key];
                                    const actualFilename = 'AC' + (Number(key) + 1) + '_' + oldFileItem.file.name;
                                    // this.actualFileNameSave += actualFilename + '~';
                                    const finalstring = oldFileItem.file.name;
                                    const finalstringwithoutspace = finalstring.replace(/ /g, '');
                                    const newFilename = '_' + this.supplierId + '_' + (Number(key) + 1) + '_' + finalstringwithoutspace;
                                    // var newFilename = 'AuditComplete_' + this.supplierId + '_' + (Number(key) + 1) + '.' + oldFileItem.file.name.split('.')[1];
                                    const newFile: File = new File([this.uploaderFinal.queue[key]._file], newFilename, { type: oldFileItem.file.type });
                                    const newFileItem = new FileItem(this.uploaderFinal, newFile, null);
                                    this.uploaderFinal.queue[key] = newFileItem;
                                }

                                this.uploaderFinal.uploadAll();

                                await this.sleep(20000);

                                // this.http.post<any>(environment.nodeurl + '/api/email/auditcompletesrmmail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&category=srm', null).subscribe(async data => {

                                this.http.post<any>(environment.nodeurl + '/api/email/auditcompletesuppliermail?email=' + this.email + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&category=supplier', null).subscribe(async (data) => {
                                    const role = 'IMI-HSEQ';
                                    // this.http.post<any>(environment.nodeurl + '/api/email/sendNormalworkflowmail?roleName=' + role + '&supplierid=' + history.supplier_id + '&content=' + this.processid + '&category=chseq', null).subscribe(data => {
                                    // });
                                    this.issuccess = true;
                                    this.isloadingdecision = false;

                                    this.successmessage = 'Sucessfully Completed the Audit!';
                                    this.IsAuditComplete = true;
                                    this.alreadyAnswered = true;

                                    // High Critical
                                    this.http.post<any>(environment.nodeurl + '/api/email/sendNormalworkflowmail?roleName=' + role + '&supplierid=' + history.supplier_id + '&content=' + this.processid + '&category=rethseq', null).subscribe((data) => {
                                        //window.location.reload();
                                    });
                                });
                                // });
                            });
                        });
                    }
                }
            });
        }
    }

    public downloadRegisterCopy(fileUrl: string) {
        console.log('hit registerCopy download');
        window.location.href = environment.nodeurl + '/api/file/DownloadRegisterCopy?fileUrl=' + fileUrl;
    }


    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    onReject() {
        if (this.decisionRemark === '') {
            this.iserror = true;
            this.errormessage = 'Please enter a remark!';
            this.formFieldHelpers.push('has-error');

        } else if (this.decisionOutcome === null) {
            this.iserror = true;
            this.errormessage = 'Please select an outcome!';
        }
        else {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingdecision = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');

                    this.isrejectclicked = true;

                    const history = new SupplierHistory();
                    history.status_id = 5;
                    history.supplier_id = this.supplierId.toString();
                    history.status_remark = 'Rejected';
                    history.status_comment = this.decisionRemark;
                    history.iscurrentstatus = 'Completed';
                    history.userid = userfullname;
                    history.userrole = userid;
                    history.ÇommandName = 'Reject';
                    history.useremail = useremail;

                    this.api.saveHistory(history);

                    this.issuccess = true;
                    this.isloadingdecision = false;
                    this.successmessage = 'Sucessfully rejected the supplier!';
                }
            });


        }
    }

    isrejectclicked: boolean = false;

    onRejectNotify() {
        if (this.decisionRemark === '') {
            this.iserror = true;
            this.errormessage = 'Please enter a remark!';
            this.formFieldHelpers.push('has-error');

        }
        else if (this.decisionOutcome === null) {
            this.iserror = true;
            this.errormessage = 'Please select an outcome!';
        }
        else {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingdecision = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');

                    this.isrejectclicked = true;
                    this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&category=reject').subscribe(async (data) => {


                        const history = new SupplierHistory();
                        history.status_id = 5;
                        history.supplier_id = this.supplierId.toString();
                        history.status_remark = 'Rejected';
                        history.status_comment = this.decisionRemark;
                        history.iscurrentstatus = 'Completed';
                        history.userid = userfullname;
                        history.userrole = userid;
                        history.ÇommandName = 'Reject';
                        history.useremail = useremail;

                        this.api.saveHistory(history);

                        this.issuccess = true;
                        this.isloadingdecision = false;

                        this.successmessage = 'Sucessfully rejected and notified the supplier!';

                        await this.sleep(20000);
                        console.log('Waiting on sleep');

                        if (this.isauditor) {
                            console.log('Role is Auditor');
                            this.http.post<any>(environment.nodeurl + '/api/email/sendsrmrejectbyhseqmail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemark + '&category=hseqreject', null).subscribe(async (data) => {
                            });

                        }
                    });
                }
            });

        }
    }

    onDecisionRemark() {
        this.iserror = false;
        this.errormessage = '';
        this.formFieldHelpers = [];
    }

    onOutcomeDecisionRemark() {
        this.iserror = false;
        this.errormessage = '';
        this.POformFieldHelpers = [];
    }

    onOutcomeDecisionRemarkHSEQ() {
        this.iserror = false;
        this.errormessage = '';
        this.HSformFieldHelpers = [];
    }

    onFinalRemarkHSEQ() {
        this.iserror = false;
        this.errormessage = '';
        this.FinalformFieldHelpers = [];
    }

    onAuditRemarkHSEQ() {
        this.iserror = false;
        this.errormessage = '';
        this.auditformFieldHelpers = [];
    }

    approvestatusChange() {
        this.iserror = false;
        this.errormessage = '';
    }

    onApproveSubmit() {
        if (!this.selectedComment) {
            this.iserror = true;
            if (this.criticalityValue === 'Not Performed  Yet') {
                this.errormessage = 'Perform Criticality Matrix first!';
            }
            else {
                this.errormessage = 'Please select the approval action to proceed!';
            }
        } else if (this.property_outcome === '') {
            this.iserror = true;
            this.POformFieldHelpers.push('has-error');
            this.errormessage = 'Please Add The Outcome To Proceed!';
        }
        else {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingdecision = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');

                    let status = '';
                    let statusid = 0;

                    if (userid === 'IMI-HSEQ' && (this.selectedComment === 'Approve' || this.selectedComment === 'Recommended' || this.selectedComment === 'Not Recommended')) {
                        status = 'Awaiting for SRM Recommendation';
                        statusid = 10;
                    } else if (userid === 'IMI-SRM Analyst' && this.supplierStatus === 'Pending Criticality Matrix' && (this.selectedComment === 'Approve' || this.selectedComment === 'Recommended' || this.selectedComment === 'Not Recommended')) {
                        status = 'Awaiting for Audit dates';
                        statusid = 11;
                    }
                    else if (userid === 'IMI-SRM Analyst' && (this.selectedComment === 'Approve' || this.selectedComment === 'Recommended' || this.selectedComment === 'Not Recommended')) {
                        status = 'Awaiting for GM approval';
                        statusid = 11;
                    }
                    else if (userid === 'IMI-GM' && (this.selectedComment === 'Approve' || this.selectedComment === 'Recommended')) {
                        status = 'Awaiting for VP approval';
                        statusid = 12;
                    } else if (userid === 'IMI-VP' && (this.selectedComment === 'Approve' || this.selectedComment === 'Recommended')) {
                        status = 'Supplier Approved - Awaiting Bank workflow to be triggered';
                        statusid = 13;
                    }
                    else if (userid === 'IMI-Treasury Bank Reviewer' && (this.selectedComment === 'Review Done' || this.selectedComment === 'Recommended')) {
                        status = 'Awaiting Bank Details Approval';
                        statusid = 14;
                    } else if (userid === 'IMI-GM' && (this.selectedComment === 'Reject' || this.selectedComment === 'Not Recommended')) {
                        status = 'Awaiting for SRM Recommendation';
                        statusid = 15;
                    }
                    else if (userid === 'IMI-VP' && (this.selectedComment === 'Reject' || this.selectedComment === 'Not Recommended')) {
                        status = 'Awaiting for SRM Recommendation';
                        statusid = 15;
                    } else if (userid === 'IMI-Treasury Bank Approver' && (this.selectedComment === 'Reject' || this.selectedComment === 'Return to Review')) {
                        status = 'Awaiting Bank Details Review';
                        statusid = 14;
                    }
                    if (!(userid === 'IMI-Treasury Bank Approver' && this.selectedComment === 'Approve')) {
                        const history = new SupplierHistory();
                        history.status_id = statusid;
                        history.supplier_id = this.supplierId.toString();
                        history.status_remark = status;
                        history.status_comment = this.property_outcome;
                        history.iscurrentstatus = 'Pending';
                        history.userid = userfullname;
                        history.userrole = userid;
                        history.ÇommandName = this.selectedComment;
                        history.useremail = useremail;

                        this.api.saveHistory(history);
                    }


                    if (true) {

                        // const userName: string = localStorage.getItem('username');
                        // const userRole: string = localStorage.getItem('userrole');
                        // const userEmail: string = localStorage.getItem('useremail');

                        // const userObject = {
                        //     userName: userName,
                        //     userRole: userRole,
                        //     userEmail: userEmail
                        // }

                        // const payload = {
                        //     "action": "Supplier Registration",
                        //     "actionType": "SUPPLIER_REGISTRATION",
                        //     "userInformation": JSON.stringify(userObject),
                        // }

                        // this.http.post<string>('https://localhost:44304/api/parallel-task/user', payload).subscribe({
                        //     next: (res: any) => {
                        //         functionInner();
                        //     },
                        //     error: (error: any) => {
                        //         console.log(error);
                        //     }
                        // });

                        // const functionInner = () => {
                           
                        // }


                        const documentbody =
                        {
                            'processId': this.processid,
                            'commandName': this.selectedComment
                        };
                        const headers = new HttpHeaders({
                            'Content-Type': 'application/json',
                            'Authorization': this.apiTokenworkflow
                        });
                        const options = { headers: headers };
                        this.http.post(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/ExecuteCommand?processId=' + this.processid + '&commandName=' + this.selectedComment, documentbody, options)
                            .subscribe((data) => {
                                this.processclicked = true;

                                this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetInstanceCurrentRole?processId=' + this.processid, options)
                                    .subscribe((data) => {
                                        const currentstatus = data['result'];
                                        this.workflowactor = '';
                                        this.workflowflag = '';
                                        if (currentstatus === 'SRM Approval') {
                                            this.workflowactor = 'IMI-SRM Analyst';
                                            this.workflowflag = 'nsrm';
                                        } else if (currentstatus === 'Return To SRM') {
                                            this.workflowactor = 'IMI-SRM Analyst';
                                            this.workflowflag = 'rsrm';
                                        } else if (currentstatus === 'GM Approval') {
                                            this.workflowactor = 'IMI-GM';
                                        } else if (currentstatus === 'VP Approval') {
                                            this.workflowactor = 'IMI-VP';
                                        } else if (currentstatus === 'Desktop Audit') {
                                            this.workflowactor = 'IMI-HSEQ';
                                            this.workflowflag = 'chseq';
                                        } else if (currentstatus === 'Clarification Audit') {
                                            this.workflowactor = 'IMI-SRM Analyst';
                                        } else if (currentstatus === 'QA Audit') {
                                            this.workflowactor = 'IMI-Auditor/QA';
                                        } else if (currentstatus === 'Site Audit' && this.supplierStatus !== 'Pending Criticality Matrix') {
                                            this.workflowactor = 'IMI-HSEQ';
                                            this.workflowflag = 'chseq';
                                        }
                                        else if (currentstatus === 'Site Audit' && this.supplierStatus === 'Pending Criticality Matrix') {
                                            this.workflowactor = 'IMI-HSEQ';
                                            this.workflowflag = 'rethseq';
                                        }
                                        else if (currentstatus === 'Treasurer Team Review') {
                                            this.workflowactor = 'IMI-Treasury Bank Reviewer';
                                            this.workflowflag = 'tbr';
                                        } else if (currentstatus === 'Treasurer Review') {
                                            this.workflowactor = 'IMI-Treasury Bank Approver';
                                            this.workflowflag = 'tba';
                                        }

                                        // Call the Server New Method`
                                        if (currentstatus !== '') {
                                            const portaltomsflow = new PortalToMsFlowDto();
                                            portaltomsflow.command = this.selectedComment;
                                            portaltomsflow.procesID = this.processid;
                                            portaltomsflow.comment = this.property_outcome;
                                            portaltomsflow.supplierID = this.supplierId.toString();
                                            portaltomsflow.supplier_code = this.supplier.supplier_code;
                                            portaltomsflow.workflowCurrentStatus = currentstatus;
                                            portaltomsflow.supplierStatus = status;
                                            portaltomsflow.criticality = Number(this.supplier.criticality);
                                            portaltomsflow.role = localStorage.getItem('userrole');
                                            portaltomsflow.triggeredBy = localStorage.getItem('username');

                                            this.http.post<any>(environment.nodeurl + '/api/email/msflowstepfromportal', portaltomsflow).subscribe((data) => {
                                                //debugger;
                                            });
                                        }

                                        if (localStorage.getItem('userrole') === 'IMI-VP') {
                                            if (this.selectedComment === 'Approve') {

                                                // this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=null&category=treasurer').subscribe((data) => {

                                                    const vpstatus = 'Supplier Approved - Awaiting Bank workflow to be triggered';
                                                    this.http.get<any>(environment.nodeurl + '/api/supplier/status?supplierId=' + this.supplierId + '&status=' + vpstatus).subscribe(async (data3) => {
                                                        await this.supplierbankflowInit(this.supplierId);
                                                    });
                                                // });
                                            } else {
                                                // Mail to GM after VP rejection
                                                this.http.post<any>(environment.nodeurl + '/api/email/vprejectgm?roleName=IMI-GM&supplierid=' + this.supplierId + '&content=' + this.processid + '&category=vprejectgm', null).subscribe((data) => {
                                                });

                                                this.issuccess = true;
                                                this.isloadingdecision = false;

                                                this.successmessage = 'Successfully saved!';
                                            }
                                        } else if (localStorage.getItem('userrole') === 'IMI-Treasury Bank Approver') {
                                            if (this.selectedComment === 'Approve') {
                                                this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=null&category=treasurer').subscribe((data) => {

                                                    this.http.get<any>(environment.nodeurl + '/api/email/bankdatacompletedemail?supplierid=' + this.supplierId + '&comment=' + this.property_outcome).subscribe((data) => {

                                                        const history = new SupplierHistory();
                                                        history.status_id = statusid;
                                                        history.supplier_id = this.supplierId.toString();
                                                        history.status_remark = 'Approved';
                                                        history.status_comment = this.property_outcome;
                                                        history.iscurrentstatus = 'Completed';
                                                        history.userid = userfullname;
                                                        history.userrole = userid;
                                                        history.ÇommandName = 'Approve';
                                                        history.useremail = useremail;

                                                        this.api.saveHistory(history);

                                                        const bankdetails = {
                                                            SupplierId: this.supplier.supplier_id,
                                                            SupplierName: this.supplier.supplier_name,
                                                            BankName: this.supplier.bankName !== 'Other' ? this.supplier.bankName : this.supplier.otherBankName,
                                                            AccountNo: this.supplier.account_number,
                                                            IbanNo: this.supplier.ibanNo,
                                                            BicCode: this.supplier.swiftcode,
                                                            AddressLine1: this.supplier.bankAddress,
                                                            AddressLine2: this.supplier.bankAddress2,
                                                            IsEmergencySupplier: 'FALSE',
                                                            BankCountry: this.supplier.bankCode,
                                                            Currency: this.supplier.accountCurrency,
                                                            exp_date: ''
                                                        };

                                                        this.http.post(environment.ifsIntegrationUrl + '/api/Bank/', bankdetails).subscribe((data3) => {
                                                            this.issuccess = true;
                                                            this.isloadingdecision = false;

                                                            this.successmessage = 'Successfully registered Bank Details in IFS!';
                                                            this.http.get<any>(environment.nodeurl + '/api/supplier/status?supplierId=' + this.supplierId + '&status=' + 'Approved').subscribe((data3) => {
                                                            });
                                                        });
                                                    });
                                                });
                                            } else {
                                                this.issuccess = true;
                                                this.isloadingdecision = false;

                                                this.successmessage = 'Successfully saved!';
                                            }

                                        }
                                        else {

                                            this.issuccess = true;
                                            this.isloadingdecision = false;

                                            this.successmessage = 'Successfully saved!';
                                        }
                                    });
                            });
                    }
                }
            });

        }
    }

    async supplierbankflowInit(supplierid) {
        const scheme = 'Bank Approval';
        const userid = localStorage.getItem('userrole');
        const useremail = localStorage.getItem('useremail');
        const userfullname = localStorage.getItem('userfullname');

        const documentbody =
        {
            'title': this.supplier.supplier_code,
            'description': this.supplier.supplier_name,
            'creationTime': '2020-12-18T08:51:29.332Z',
            'state': 'start',
            'scheme': scheme
        };

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiTokenworkflow
        });
        const options = { headers: headers };

        this.http.post(environment.workflowApiUrl + '/api/services/app/Document/Create', documentbody, options)
            .subscribe((data) => {
                if (data) {
                    const documentid = data['result'].id;
                    const processid = data['result'].processId;
                    const supplierbody =
                    {
                        'supplier_id': supplierid,
                        'workflowdocid': documentid,
                        'processid': processid
                    };
                    const workflow = new Workflow();
                    workflow.SUPPLIER_ID = Number(this.supplierId);
                    workflow.DOCID = Number(documentid);
                    workflow.PROCESSID = processid;
                    this.http.post<any>(environment.nodeurl + '/api/workflow/SaveWorkFlow/', workflow).subscribe((data) => {

                        this.issuccess = true;
                        this.successmessage = 'Successfully saved bank workflow id!';

                        const history = new SupplierHistory();
                        history.status_id = 10;
                        history.supplier_id = this.supplierId.toString();
                        history.status_remark = 'Awaiting Bank Details Review';
                        history.status_comment = this.property_outcome;
                        history.iscurrentstatus = 'Pending';
                        history.userid = userfullname;
                        history.userrole = userid;
                        history.ÇommandName = '';
                        history.useremail = useremail;

                        this.api.saveHistory(history);

                        this.pushSuppliertoIFS();

                    });
                } else {
                    const restore = new HistoryRestore();
                    restore.supplierId = this.supplierId.toString();
                    restore.currentstatus = 'VP Approval';
                    restore.processId = this.processid;
                    restore.email = useremail;

                    this.http.get(environment.workflowApiUrl + '/api/TokenAuth/RestoreSupplierFailedHistoryPortal?supplierId=' + restore.supplierId + '&currentstatus=' + restore.currentstatus + '&processId=' + restore.processId + '&email=' + restore.email)
                        .subscribe((data) => {
                            this.iserror = true;
                            this.errormessage = 'Something went wrong.Please try again later!';
                        });
                }

            }, (err) => {
                const restore = new HistoryRestore();
                restore.supplierId = this.supplierId.toString();
                restore.currentstatus = 'VP Approval';
                restore.processId = this.processid;
                restore.email = useremail;

                this.http.get(environment.workflowApiUrl + '/api/TokenAuth/RestoreSupplierFailedHistoryPortal?supplierId=' + restore.supplierId + '&currentstatus=' + restore.currentstatus + '&processId=' + restore.processId + '&email=' + restore.email)
                    .subscribe((data) => {
                        this.iserror = true;
                        this.errormessage = 'Something went wrong.Please try again later!';
                    });
            });
    }

    async pushSuppliertoIFS() {

        this.http.post<any>(environment.ifsIntegrationUrl + '/api/supplier/', this.ifsSupplier).subscribe((data3) => {
            if (data3['Response']) {
                if (data3['Message'] !== null) {
                    const ifscode = data3['Message'];
                    this.http.post<any>(environment.nodeurl + '/api/supplier/SaveIfsCode?supplierId=' + this.supplierId + '&ifscode=' + ifscode, null).subscribe((data) => {
                        this.issuccess = true;
                        this.successmessage = 'Successfully registered the supplier in IFS!';
                        this.http.get<any>(environment.nodeurl + '/api/email/sendApproveSupplierMail?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=no&category=vp').subscribe((data) => {

                            this.http.post<any>(environment.nodeurl + '/api/email/sendWorkflowTriggeredMail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + this.supplierId + '&content=' + 'ifsapproved' + '&category=vpapp', null).subscribe((data) => {
                            });
                            this.issuccess = true;
                            this.successmessage = 'Successfully registered the supplier in IFS : ' + ifscode;
                            this.isloadingdecision = false;


                        });
                    });
                } else {
                    this.iserror = true;
                    this.errormessage = 'Something went wrong when pushing the supplier to IFS!';
                    this.isloadingdecision = false;
                }
            }
            else {
                const supplier = new IfsFailMessageDto();
                supplier.supplierId = String(this.supplierId);
                supplier.supplierName = this.supplier.supplier_name;
                supplier.supplierEmail = this.supplier.email;
                supplier.category = 'Normal';
                supplier.message = data3['Message'];

                this.http.post<any>(environment.nodeurl + '/api/supplier/saveIFSFailedRecords', supplier).subscribe(async (data) => {
                    this.iserror = true;
                    this.errormessage = 'IFS interfaced with Supplier ID:' + supplier.message.split('_')[0] + ',Something went wrong: ' + supplier.message.split('_')[1] + ', when pushing the supplier to IFS email will sent to the Support team!';
                    this.isloadingdecision = false;

                    this.http.post<any>(environment.nodeurl + '/api/email/sendWorkflowTriggeredMail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + this.supplierId + '&content=' + supplier.message + '&category=vpappfail', null).subscribe((data) => {
                    });
                });
            }
        });
    }

    async onNotifySupplierSRM() {
        if (this.decisionRemarkHseq === '') {
            this.iserror = true;
            this.errormessage = 'Please enter a remark!';
            this.HSformFieldHelpers.push('has-error');
        } else {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingaction = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');
                    this.alreadyAnswered = false;

                    if (this.decisionOutcome === '5') {
                        if (this.isauditor) {
                            var history = new SupplierHistory();
                            history.status_id = 4;
                            history.supplier_id = this.supplierId.toString();
                            history.status_remark = 'Awaiting Clarification from Supplier';
                            history.status_comment = this.decisionRemarkHseq;
                            history.iscurrentstatus = 'Pending';
                            history.userid = userfullname;
                            history.userrole = userid;
                            history.ÇommandName = 'Need more information';
                            history.useremail = useremail;

                            this.api.saveHistory(history);

                            if (true) {
                                this.http.get<any>(environment.nodeurl + '/api/email/moreinfo?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.decisionRemarkHseq + '&roleName=hseq').subscribe((data) => {
                                    this.issuccess = true;
                                    this.isloadingaction = false;
                                    this.successmessage = 'Successfully sent the email to the supplier!';
                                });
                            }
                        }
                    } else if (this.decisionOutcome === '6') {
                        var history = new SupplierHistory();
                        history.status_id = 4;
                        history.supplier_id = this.supplierId.toString();
                        history.status_remark = 'Pending Criticality Matrix';
                        history.status_comment = this.decisionRemarkHseq;
                        history.iscurrentstatus = 'Pending';
                        history.userid = userfullname;
                        history.userrole = userid;
                        history.ÇommandName = 'Return To SRM';
                        history.useremail = useremail;
                        this.api.saveHistory(history);

                        const documentbody =
                        {
                            'processId': this.processid,
                            'state': 'Return To SRM'
                        };
                        const headers = new HttpHeaders({
                            'Content-Type': 'application/json',
                            'Authorization': this.apiTokenworkflow
                        });
                        const options = { headers: headers };

                        this.http.post(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/SetState?processId=' + this.processid + '&state=' + 'Return To SRM', documentbody, options)
                            .subscribe((data) => {
                                this.http.post<any>(environment.nodeurl + '/api/email/sendworkflowmail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + this.supplierId + '&content=' + history.status_comment + '&category=return', null).subscribe((data) => {
                                });
                                this.issuccess = true;
                                this.isloadingaction = false;
                                this.successmessage = 'Successfully submitted the supplier to SRM Team!';
                            });
                    }
                }
            });
        }
    }

    CriticalReturnToSRM() {
        if (this.decisionRemark === '') {
            this.iserror = true;
            this.errormessage = 'Please enter remark!';
            this.formFieldHelpers.push('has-error');
        } else {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {

                this.isloadingaction = true;
                this.isreturntosrmclick = true;
                const userid = localStorage.getItem('userrole');
                const useremail = localStorage.getItem('useremail');
                const userfullname = localStorage.getItem('userfullname');

                const history = new SupplierHistory();
                history.status_id = 4;
                history.supplier_id = this.supplierId.toString();
                history.status_remark = 'Pending Criticality Matrix';
                history.status_comment = this.decisionRemark;
                history.iscurrentstatus = 'Pending';
                history.userid = userfullname;
                history.userrole = userid;
                history.ÇommandName = 'Return To SRM';
                history.useremail = useremail;

                this.api.saveHistory(history);

                const documentbody =
                {
                    'processId': this.processid,
                    'state': 'Return To SRM'
                };
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': this.apiTokenworkflow
                });
                const options = { headers: headers };

                this.http.post(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/SetState?processId=' + this.processid + '&state=' + 'Return To SRM', documentbody, options)
                    .subscribe((data) => {
                        this.http.post<any>(environment.nodeurl + '/api/email/sendworkflowmail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + this.supplierId + '&content=' + history.status_comment + '&category=return', null).subscribe((data) => {
                        });
                        this.issuccess = true;
                        this.isloadingaction = false;
                        this.successmessage = 'Successfully submitted the supplier to SRM Team!';
                    });
            });

        }
    }

    onNotifyAuditSubmit() {
        if (this.auditRemark !== '') {

            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingaction = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');

                    const body = {
                        supplier_id: this.supplierId,
                        userid: userid,
                        userrole: useremail,
                        audit_remark: this.auditRemark,
                        audit_date_final: '',
                        audit_time_final: '',
                        final_date_remark: '',
                        additional_comment: '',
                        non_confirmity: 'N',
                        blob: '',
                        site_audit_id: 0
                    };

                    const siteaudititem = new SiteAuditItem();
                    siteaudititem.Site_audit_id = 0;
                    siteaudititem.Supplier_id = this.supplierId.toString();
                    siteaudititem.audit_remark = this.auditRemark;
                    siteaudititem.audit_date_final = new Date('1900-01-01');
                    siteaudititem.audit_time_final = '';
                    siteaudititem.final_Date_remark = '';
                    siteaudititem.additional_comment = '';
                    siteaudititem.non_confirmity = 'N';
                    siteaudititem.last_updated_date = new Date();
                    siteaudititem.userId = useremail;
                    siteaudititem.userRole = userid;
                    siteaudititem.createdDate = new Date();
                    this.http.post<any>(environment.nodeurl + '/api/siteaudit/SaveItem/', siteaudititem).subscribe((data) => {
                        this.issuccess = true;
                        this.isloadingaction = false;

                        this.successmessage = 'Successfully updated workflow status!';

                        this.site_audit_id = data;

                        const auditlistselected = [];
                        if (this.form.value.contacts.length > 0) {

                            for (const key in this.form.value.contacts) {
                                const dateselected = moment(new Date(this.form.value.contacts[key].date)).format('YYYY-MM-DD');
                                const timeselected = moment(new Date(this.form.value.contacts[key].date)).format('HH:mm'); //('h:mm a');

                                auditlistselected.push({ audit_date: dateselected, audit_time: timeselected });
                            }
                        }
                        const sitedates = {
                            supplier_id: this.supplierId,
                            site_audit_id: this.site_audit_id,
                            audit_dates: auditlistselected
                        };
                        this.http.post<any>(environment.nodeurl + '/api/siteaudit/SaveDate?suplierId=' + this.supplierId + '&siteauditid=' + this.site_audit_id, auditlistselected).subscribe((data) => {

                            let datestring = '';
                            this.IsAuditDateComplete = true;
                            this.IsAuditDateOnetimeComplete = true;

                            if (this.form.value.contacts.length > 0) {

                                for (const key in this.form.value.contacts) {
                                    const dateselected = moment(new Date(this.form.value.contacts[key].date)).format('YYYY-MM-DD');
                                    const timeselected = moment(new Date(this.form.value.contacts[key].date)).format('HH:mm'); //('h:mm a');

                                    datestring += 'Audit Date: ' + dateselected + '  Audit Time : ' + timeselected + '<br><br>';
                                }

                                datestring += 'Audit Date Final : ' + body.audit_date_final + '  Audit Time : ' + body.audit_time_final + '<br><br>';

                                const auditcomment = {
                                    supplier_id: this.supplierId,
                                    supplier_name: this.supplierName,
                                    decision_remark: datestring + this.decisionRemark,
                                    email: this.supplier.email,
                                    para_one: 'Thank you for filling the supplier registration application.  The registration request pending approval with below audit date reply by HSCQ team.',
                                    para_two: 'You can access the submitted from the below link to complete your application. ',
                                    link_req: false,
                                    subject: 'Need More Information'
                                };
                                const supplierstatus = {
                                    supplier_id: this.supplierId,
                                    status: 'Pending Audit info'
                                };

                                this.http.post<any>(environment.nodeurl + '/api/email/auditdates?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.auditRemark + '&category=siteaudit', auditlistselected).subscribe((data) => {

                                    this.http.post<any>(environment.nodeurl + '/api/email/auditdateshseq?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.auditRemark + '&category=siteaudit', auditlistselected).subscribe((data) => {
                                        this.issuccess = true;
                                        this.successmessage = 'Successfully sent the email to the supplier!';
                                        const history = new SupplierHistory();
                                        history.status_id = 6;
                                        history.supplier_id = this.supplierId.toString();
                                        history.status_remark = 'Awaiting Supplier for Audit Dates';
                                        history.status_comment = this.auditRemark;
                                        history.iscurrentstatus = 'Pending';
                                        history.userid = userfullname;
                                        history.userrole = userid;
                                        history.ÇommandName = 'Audit date requested';
                                        history.useremail = useremail;

                                        this.api.saveHistory(history);
                                    });
                                });
                            }
                        });
                    });
                }
            });



        } else {
            this.iserror = true;
            this.errormessage = 'Please enter a remark';
            this.auditformFieldHelpers.push('has-error');

        }
    }

    public downloadAudit(fileUrl: string) {
        window.location.href = environment.nodeurl + '/api/file/downloadAudit?fileUrl=' + fileUrl;
    }

    public downloadAuditComplete(fileUrl: string) {
        window.location.href = environment.nodeurl + '/api/file/downloadAuditComplete?fileUrl=' + fileUrl;
    }

    public downloadNCAudit(fileUrl: string) {
        window.location.href = environment.nodeurl + '/api/file/downloadNCAudit?fileUrl=' + fileUrl;
    }

    public downloadNCObserversion(fileUrl: string) {
        window.location.href = environment.nodeurl + '/api/file/downloadNC?fileUrl=' + fileUrl;
    }

    onNotifyAuditFinaltest() {
        console.log(this.datefinal.toString());
        if (this.datefinal.toString() === '' || this.datefinal.toString() === '1900-01-01T') {
            this.iserror = true;
            this.errormessage = 'Final Date is mandatory!';
        } else if (this.uploader.queue.length === 0) {
            this.iserror = true;
            this.errormessage = 'Audit plan is mandatory!';
        }
        else {
            this.onNotifyAuditFinal();
        }
    }

    onNotifyAuditFinal() {

        if (this.finalRemark !== '') {
            const dialogRef = this._fuseConfirmationService.open(this.configForm.value);

            dialogRef.addPanelClass('confirmation-dialog');
            dialogRef.afterClosed().subscribe(async (result) => {
                if (result === 'confirmed') {
                    this.isloadingaction = true;
                    const userid = localStorage.getItem('userrole');
                    const useremail = localStorage.getItem('useremail');
                    const userfullname = localStorage.getItem('userfullname');

                    console.log('this.datefinal ', this.datefinal);
                    this.Final_Date_date = moment(new Date(this.datefinal)).format('YYYY-MM-DD');
                    this.Final_Date_time = moment(new Date(this.datefinal)).format('HH:mm');

                    const siteaudititem = new SiteAuditItem();
                    siteaudititem.Site_audit_id = this.site_audit_id;
                    siteaudititem.Supplier_id = this.supplierId.toString();
                    siteaudititem.audit_remark = '';
                    siteaudititem.audit_date_final = this.datefinal ? this.Final_Date_date : null;
                    siteaudititem.audit_time_final = this.Final_Date_time ? this.Final_Date_time : '';
                    siteaudititem.final_Date_remark = this.finalRemark;
                    siteaudititem.additional_comment = this.additional_comment;
                    siteaudititem.non_confirmity = 'Y';
                    siteaudititem.last_updated_date = new Date();
                    siteaudititem.userId = useremail;
                    siteaudititem.userRole = userid;
                    siteaudititem.createdDate = new Date();
                    this.http.post<any>(environment.nodeurl + '/api/siteaudit/updateItem/', siteaudititem).subscribe(async (data) => {

                        this.IsAuditFinalComplete = true;
                        const history = new SupplierHistory();

                        history.status_id = 7;
                        history.supplier_id = this.supplierId.toString();
                        history.status_remark = 'HSEQ to Perform the Audit';
                        history.status_comment = this.finalRemark;
                        history.iscurrentstatus = 'Pending';
                        history.userid = userfullname;
                        history.userrole = userid;
                        history.ÇommandName = 'Final date submitted';
                        history.useremail = useremail;

                        this.api.saveHistory(history);

                        if (true) {

                            for (const key in this.uploader.queue) {
                                const oldFileItem: FileItem = this.uploader.queue[key];
                                const actualFilename = 'AF' + (Number(key) + 1) + '_' + oldFileItem.file.name;
                                const finalstring = oldFileItem.file.name;
                                const finalstringwithoutspace = finalstring.replace(/ /g, '');
                                const newFilename = '_' + this.supplierId + '_' + (Number(key) + 1) + '_' + finalstringwithoutspace;
                                const newFile: File = new File([this.uploader.queue[key]._file], newFilename, { type: oldFileItem.file.type });
                                const newFileItem = new FileItem(this.uploader, newFile, null);
                                this.uploader.queue[key] = newFileItem;
                            }

                            this.uploader.uploadAll();
                        }
                        if (true) {
                            await this.sleep(20000);
                            this.http.post<any>(environment.nodeurl + '/api/email/auditdatesfinal?email=' + this.supplier.email + '&supplierid=' + this.supplierId + '&content=' + this.finalRemark + '&category=siteaudit&finaldate=' + this.datefinal, null).subscribe((data) => {
                                this.issuccess = true;
                                this.isloadingaction = false;

                                this.successmessage = 'Successfully updated details!';
                            });
                        }

                    });
                }
            });



        } else {
            this.iserror = true;
            this.errormessage = 'Please enter a remark';
            this.FinalformFieldHelpers.push('has-error');
        }

    }

    auditcompleteclick() {
        if (this.auditComplete) {
            this.isauditcompleteclick = true;
        } else {
            this.isauditcompleteclick = false;

        }
    }

    isnonconfirmity: boolean = false;
    nonconfirmityclick() {
        if (this.nonconfirmitychecked) {
            this.isnonconfirmity = true;
        } else {
            this.isnonconfirmity = false;
        }
    }


    ngOnDestroy(): void {
        // this.destroy$.next(true);
        // this.destroy$.complete();
    }

}
