import { Component, ViewEncapsulation, ViewChild, ElementRef, Inject, Optional, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'environments/environment.prod';
import { FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { IsExists } from 'app/modules/Dto/IsExists';
import * as moment from 'moment';
import { DeleteEmg } from 'app/modules/Dto/DeleteEmg';
import { EmergencyApprovedItems } from 'app/shared/Models/EmergencyApprovedItems';
import { ApiService } from '../../../../../../api.service';
import { IfsFailMessageDto } from 'app/shared/Models/IfsFailMessageDto';
import { Supplier } from 'app/main/Models/Supplier';;
import { EmergencySupplier } from 'app/main/Models/EmergencySupplier';
import { DatePipe } from '@angular/common';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { PortalToMsFlowDto } from 'app/shared/Models/PortalMSFlowDto';
import { DeleteDraftSupplier } from 'app/modules/Dto/DeleteDraftSupplier';

@Component({
    selector: 'items-emergency-supplier-inner',
    templateUrl: './items-emergency-supplier-inner.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe]
})
export class ItemsEmergencySupplierInnerComponent {

    @ViewChild('emergencySupplierName') emergencySupplierNameField: ElementRef;
    @ViewChild("emergencySupplierEmail") emergencySupplierEmailField: ElementRef;
    @ViewChild("emergencySupplierCrNo") emergencySupplierCrNoField: ElementRef;

    public uploader: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadFiles' });
    public uploaderVat: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadFiles' });
    public uploaderEvi: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadFiles' });

    apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');

    fetchedMyRoleN: any = [];
    bulkData: any = [];
    history: any = [];

    selectedStatus = 'active';
    supplierSingleData: any;

    fetchedMyRoleNew: string = null;
    fetchedMyRoleNewId: string = null;
    fetchedMyRoleNewDetail: string = null;

    isCollapsed = true;
    isalreadysaved = false;

    isAdmin: boolean;
    isAuditor: boolean;
    issrm: boolean;
    enableapprovalwf: boolean;
    editSrmRemark: boolean = false;

    fetchedMyRole: any = [];
    profileJson: string = null;
    profileSet: any = [];

    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];

    supplierId_ = 0;
    emptyFileRegistration: boolean = false;
    registrationFile: any;
    registrationFile_name: any;
    registrationFileAttached: any;
    newifscode = 0;

    supplierCode = '';
    createdDate = '';
    supplierName = '';
    supplierStatus = '';
    cityList: any = [];
    cityListOriginal: any = [];

    passedDate: boolean = false;
    emptyFileEvidence: boolean = false;
    evidenceFile: any;
    evidenceFile_name: any;
    evidenceFileAttached: any;

    action: string;
    local_data: any;

    registerForm: FormGroup;

    allData: any;
    groupdata: any = [];
    selected: any = 0;
    isloading = true;

    criticalityDetail = [];
    selectedCountry: any;
    iscitydisable = true;
    kingdom: string = '0';
    telephoneCodeList: String[] = ['Aaland 358 ','Afghanistan 93 ', 'Albania 355 ', 'Algeria 213 ', 'American Samoa 1 684 ', 'Andorra 376 ', 'Angola 244 ', 'Anguilla 1 264 ', 'Antarctica (Australian bases) 6721 ', 'Antigua and Barbuda 1 268 ', 'Argentina 54 ', 'Armenia 374 ', 'Aruba 297 ', 'Ascension 247 ', 'Australia 61 ', 'Austria 43 ', 'Azerbaijan 994 ', 'Bahamas 1 242 ', 'Bahrain 973 ', 'Bangladesh 880 ', 'Barbados 1 246 ', 'Belarus 375 ', 'Belgium 32 ', 'Belize 501 ', 'Benin 229 ', 'Bermuda 1 441 ', 'Bhutan 975 ', 'Bolivia 591 ', 'Bosnia and Herzegovina 387 ', 'Botswana 267 ', 'Brazil 55 ', 'British Indian Ocean Territory 246 ', 'British Virgin Islands 1 284 ', 'Brunei 673 ', 'Bulgaria 359 ', 'Burkina Faso 226 ', 'Burundi 257 ', 'Cambodia 855 ', 'Cameroon 237 ', 'Canada 1 ', 'Cape Verde 238 ', 'Cayman Islands 1 345 ', 'Central African Republic 236 ', 'Chad 235 ', 'Chile 56 ', 'China 86 ', 'Colombia 57 ', 'Comoros 269 ', 'Congo, Democratic Republic of the 243 ', 'Congo, Republic of the 242 ', 'Cook Islands 682 ', 'Costa Rica 506 ', 'Cote dIvoire 225 ', 'Croatia 385 ', 'Cuba 53 ', 'Curaçao 599 ', 'Cyprus 357 ', 'Czech Republic 420 ', 'Denmark 45 ', 'Djibouti 253 ', 'Dominica 1 767 ', 'Dominican Republic 1 809, 1 829, and 1 849 ', 'Ecuador 593 ', 'Egypt 20 ', 'El Salvador 503 ', 'Equatorial Guinea 240 ', 'Eritrea 291 ', 'Estonia 372 ', 'Eswatini 268 ', 'Ethiopia 251 ', 'Falkland Islands 500 ', 'Faroe Islands 298 ', 'Fiji 679 ', 'Finland 358 ', 'France 33 ', 'French Guiana 594 ', 'French Polynesia 689 ', 'Gabon 241 ', 'Gambia 220 ', 'Gaza Strip 970 ', 'Georgia (and parts of breakaway regions Abkhazia as well as South Ossetia) 995 ', 'Germany 49 ', 'Ghana 233 ', 'Gibraltar 350 ', 'Greece 30 ', 'Greenland 299 ', 'Grenada 1 473 ', 'Guadeloupe 590 ', 'Guam 1 671 ', 'Guatemala 502 ', 'Guinea 224 ', 'Guinea-Bissau 245 ', 'Guyana 592 ', 'Haiti 509 ', 'Honduras 504 ', 'Hong Kong 852 ', 'Hungary 36 ', 'Iceland 354 ', 'India 91 ', 'Indonesia 62 ', 'Iraq 964 ', 'Iran 98 ', 'Ireland (Eire) 353 ', 'Israel 972 ', 'Italy 39 ', 'Jamaica 1 876, 1 658 ', 'Japan 81 ', 'Jordan 962 ', 'Kazakhstan 7 ', 'Kenya 254 ', 'Kiribati 686 ', 'Kosovo 383 ', 'Kuwait 965 ', 'Kyrgyzstan 996 ', 'Laos 856 ', 'Latvia 371 ', 'Lebanon 961 ', 'Lesotho 266 ', 'Liberia 231 ', 'Libya 218 ', 'Liechtenstein 423 ', 'Lithuania 370 ', 'Luxembourg 352 ', 'Macau 853 ', 'Madagascar 261 ', 'Malawi 265 ', 'Malaysia 60 ', 'Maldives 960 ', 'Mali 223 ', 'Malta 356 ', 'Marshall Islands 692 ', 'Martinique 596 ', 'Mauritania 222 ', 'Mauritius 230 ', 'Mayotte 262 ', 'Mexico 52 ', 'Micronesia, Federated States of 691 ', 'Moldova (plus breakaway Pridnestrovie) 373 ', 'Monaco 377 ', 'Mongolia 976 ', 'Montenegro 382 ', 'Montserrat 1 664 ', 'Morocco 212 ', 'Mozambique 258 ', 'Myanmar 95 ', 'Namibia 264 ', 'Nauru 674 ', 'Netherlands 31 ', 'Netherlands Antilles 599 ', 'Nepal 977 ', 'New Caledonia 687 ', 'New Zealand 64 ', 'Nicaragua 505 ', 'Niger 227 ', 'Nigeria 234 ', 'Niue 683 ', 'Norfolk Island 6723 ', 'North Korea 850 ', 'North Macedonia 389 ', 'Northern Ireland 44 28 ', 'Northern Mariana Islands 1 670 ', 'Norway 47 ', 'Oman 968 ', 'Pakistan 92 ', 'Palau 680 ', 'Panama 507 ', 'Papua New Guinea 675 ', 'Paraguay 595 ', 'Peru 51 ', 'Philippines 63 ', 'Poland 48 ', 'Portugal 351 ', 'Puerto Rico 1 787 and 1 939 ', 'Qatar 974 ', 'Reunion 262 ', 'Romania 40 ', 'Russia 7 ', 'Rwanda 250 ', 'Saint-Barthélemy 590 ', 'Saint Helena and Tristan da Cunha 290 ', 'Saint Kitts and Nevis 1 869 ', 'Saint Lucia 1 758 ', 'Saint Martin (French side) 590 ', 'Saint Pierre and Miquelon 508 ', 'Saint Vincent and the Grenadines 1 784 ', 'Samoa 685 ', 'San Marino 378', 'Sao Tome and Principe 239 ', 'Saudi Arabia 966 ', 'Senegal 221 ', 'Serbia 381 ', 'Seychelles 248 ', 'Sierra Leone 232 ', 'Sint Maarten (Dutch side) 1 721 ', 'Singapore 65 ', 'Slovakia 421 ', 'Slovenia 386 ', 'Solomon Islands 677 ', 'Somalia 252 ', 'South Africa 27 ', 'South Korea 82 ', 'South Sudan 211 ', 'Spain 34 ', 'Sri Lanka 94 ', 'Sudan 249 ', 'Suriname 597 ', 'Sweden 46 ', 'Switzerland 41 ', 'Syria 963 ', 'Taiwan 886 ', 'Tajikistan 992 ', 'Tanzania 255 ', 'Thailand 66 ', 'Timor-Leste 670 ', 'Togo 228 ', 'Tokelau 690 ', 'Tonga 676 ', 'Trinidad and Tobago 1 868 ', 'Tunisia 216 ', 'Turkey 90 ', 'Turkmenistan 993 ', 'Turks and Caicos Islands 1 649 ', 'Tuvalu 688 ', 'Uganda 256 ', 'Ukraine 380 ', 'United Arab Emirates 971 ', 'United Kingdom 44 ', 'United States of America 1 ', 'Uruguay 598 ', 'Uzbekistan 998 ', 'Vanuatu 678 ', 'Venezuela 58 ', 'Vietnam 84 ', 'U.S. Virgin Islands 1 340 ', 'Wallis and Futuna 681 ', 'West Bank 970 ', 'Yemen 967 ', 'Zambia 260 ', 'Zimbabwe 263'];
    countryList: String[] = ['Afghanistan ', 'Albania ', 'Algeria ', 'American Samoa ', 'Andorra ', 'Angola ', 'Anguila ', 'Antigua and Barbuda ', 'Argentina ', 'Armenia ', 'Aruba ', 'Australia ', 'Austria ', 'Azerbaijan ', 'Bahamas, The ', 'Bahrain ', 'Bangladesh ', 'Barbados ', 'Belarus ', 'Belgium ', 'Belgium-Luxembourg ', 'Belize ', 'Benin ', 'Bermuda ', 'Bhutan ', 'Bolivia ', 'Bosnia and Herzegovina ', 'Botswana ', 'Br. Antr. Terr ', 'Brazil ', 'British Indian Ocean Ter. ', 'British Virgin Islands ', 'Brunei ', 'Bulgaria ', 'Burkina Faso ', 'Burundi ', 'Cambodia ', 'Cameroon ', 'Canada ', 'Cape Verde ', 'Cayman Islands ', 'Central African Republic ', 'Chad ', 'Chile ', 'China ', 'Christmas Island ', 'Cocos (Keeling) Islands ', 'Colombia ', 'Comoros ', 'Congo, Dem. Rep. ', 'Congo, Rep. ', 'Cook Islands ', 'Costa Rica ', 'Cote dIvoire ', 'Croatia ', 'Cuba ', 'Cyprus ', 'Czech Republic ', 'Czechoslovakia ', 'Denmark ', 'Djibouti ', 'Dominica ', 'Dominican Republic ', 'East Timor ', 'Ecuador ', 'Egypt, Arab Rep. ', 'El Salvador ', 'Equatorial Guinea ', 'Eritrea ', 'Estonia ', 'Ethiopia (excludes Eritrea) ', 'Ethiopia (includes Eritrea) ', 'European Union ', 'Faeroe Islands ', 'Falkland Island ', 'Fiji ', 'Finland ', 'Fm Panama Cz ', 'Fm Rhod Nyas ', 'Fm Tanganyik ', 'Fm Vietnam Dr ', 'Fm Vietnam Rp ', 'Fm Zanz-Pemb ', 'Fr. So. Ant. Tr ', 'France ', 'Free Zones ', 'French Guiana ', 'French Polynesia ', 'Gabon ', 'Gambia, The ', 'Gaza Strip ', 'Georgia ', 'German Democratic Republic ', 'Germany ', 'Ghana ', 'Gibraltar ', 'Greece ', 'Greenland ', 'Grenada ', 'Guadeloupe ', 'Guam ', 'Guatemala ', 'Guinea ', 'Guinea-Bissau ', 'Guyana ', 'Haiti ', 'Holy See ', 'Honduras ', 'Hong Kong, China ', 'Hungary ', 'Iceland ', 'India ', 'Indonesia ', 'Iran, Islamic Rep. ', 'Iraq ', 'Ireland ', 'Israel ', 'Italy ', 'Jamaica ', 'Japan ', 'Jhonston Island ', 'Jordan ', 'Kazakhstan ', 'Kenya ', 'Kiribati ', 'Korea, Dem. Rep. ', 'Korea, Rep. ', 'Kuwait ', 'Kyrgyz Republic ', 'Lao PDR ', 'Latvia ', 'Lebanon ', 'Lesotho ', 'Liberia ', 'Libya ', 'Liechtenstein ', 'Lithuania ', 'Luxembourg ', 'Macao ', 'Macedonia, FYR ', 'Madagascar ', 'Malawi ', 'Malaysia ', 'Maldives ', 'Mali ', 'Malta ', 'Marshall Islands ', 'Martinique ', 'Mauritania ', 'Mauritius ', 'Mexico ', 'Micronesia, Fed. Sts. ', 'Midway Islands ', 'Moldova ', 'Monaco ', 'Mongolia ', 'Montserrat ', 'Morocco ', 'Mozambique ', 'Myanmar ', 'Namibia ', 'Nauru ', 'Nepal ', 'Netherlands ', 'Netherlands Antilles ', 'Neutral Zone ', 'New Caledonia ', 'New Zealand ', 'Nicaragua ', 'Niger ', 'Nigeria ', 'Niue ', 'Norfolk Island ', 'Northern Mariana Islands ', 'Norway ', 'Oman ', 'Pacific Islands ', 'Pakistan ', 'Palau ', 'Panama ', 'Papua New Guinea ', 'Paraguay ', 'Pen Malaysia ', 'Peru ', 'Philippines ', 'Pitcairn ', 'Poland ', 'Portugal ', 'Puerto Rico ', 'Qatar ', 'Reunion ', 'Romania ', 'Russian Federation ', 'Rwanda ', 'Ryukyu Is ', 'Sabah ', 'Saint Helena ', 'Saint Kitts-Nevis-Anguilla-Aru ', 'Saint Pierre and Miquelon ', 'Samoa ', 'San Marino ', 'Sao Tome and Principe ', 'Sarawak ', 'Saudi Arabia ', 'Senegal ', 'Seychelles ', 'Sierra Leone ', 'SIKKIM ', 'Singapore ', 'Slovak Republic ', 'Slovenia ', 'Solomon Islands ', 'Somalia ', 'South Africa ', 'Soviet Union ', 'Spain ', 'Special Categories ', 'Sri Lanka ', 'St. Kitts and Nevis ', 'St. Lucia ', 'St. Vincent and the Grenadines ', 'Sudan ', 'Suriname ', 'Svalbard and Jan Mayen Is ', 'Swaziland ', 'Sweden ', 'Switzerland ', 'Syrian Arab Republic ', 'Taiwan ', 'Tajikistan ', 'Tanzania ', 'Thailand ', 'Togo ', 'Tokelau ', 'Tonga ', 'Trinidad and Tobago ', 'Tunisia '];
    titleList: string[] = ['Miss', 'Mr', 'Mrs'];
    ifsSupplier: any;
    isWait = false;

    panelOpenState = false;
    formFieldHelpers: string[] = [''];
    workflowcurrentstate;
    processid = '';
    outcomereason: string = '';
    supplier = new Supplier();

    iserror: boolean = false;
    issuccess: boolean = false;
    errormessage = 'There are errors on this page. Please correct them to proceed!';
    successmessage = 'Successfully saved!';

    supplier_id: any;
    supplier_code: string;
    currentUserRole: string = null;
    currentUserEmail: string = null;
    currentUserName: string = null;
    userfullname:string = null;
    public photos: any;
    length: number;
    workflowcurrentrole;
    from_where: string;

    istemp: boolean = true;
    isnameexists: boolean = false;
    isemailexists: boolean = false;
    iscrnoexists: boolean = false;
    istempsave: boolean = false;

    due_date: Date;
    handlebefore_date: Date;
    handle_date: Date;
    outcome: Date;
    userrole = '';
    useremail = '';
    username = '';

    emergencysupplier: any;
    supplierTypeList: string[] = ['Manufacturer', 'Service Provider', 'Trading House'];
    UnSupportFormat: boolean = false;
    UnSupportFormatEvi: boolean = false;
    UnSupportFormatReg: boolean = false;
    UnSupportFormatVat: boolean = false;

    emptyFileVat: boolean = false;
    vatFile: any;
    vatFile_name: any;
    vatFileAttached: any;
    country: string;
    submit: boolean;
    showChecked:boolean = false;

    supplier_selected_Country: any;
    supplier_selected_City: any;
    city_: any;
    configForm: FormGroup;
    registrationFile_error_check: boolean = false;
    issuccess_e: boolean = false;
    newfile_reg: any;
    newfile_vat: any;
    newfile_evi: any;
    fileName_Evi: string;
    fileName_Vat: string;
    fileName_Reg: string;
    isdeletepermission:boolean = false;

    constructor(private activatedRoute: ActivatedRoute,
        private http: HttpClient,
        private _formBuilder: FormBuilder,
        private router: Router,
        private api: ApiService,
        private datePipe: DatePipe,
        private _fuseConfirmationService: FuseConfirmationService) {
        this.loadCurrentUserData();
        this.createForm();

        this.supplier_id = this.activatedRoute.snapshot.paramMap.get('id');
        this.from_where = this.activatedRoute.snapshot.paramMap.get('page');
        this.supplier_code = "IMI-ES-" + this.supplier_id;
        this.getEmergencySupplierData();

        
    }

    ngOnInit(): void {
        this.configForm = this._formBuilder.group({
            title: 'Delete Emergency Supplier',
            message: 'Are you sure you want to delete this supplier permanently?',
            icon: this._formBuilder.group({
                show: true,
                name: 'heroicons_outline:exclamation',
                color: 'warn'
            }),
            actions: this._formBuilder.group({
                confirm: this._formBuilder.group({
                    show: true,
                    label: 'Yes, Delete',
                    color: 'warn'
                }),
                cancel: this._formBuilder.group({
                    show: true,
                    label: 'Cancel'
                })
            }),
            dismissible: true
        });
    }

    // Load current user datas from localstorage
    public loadCurrentUserData() {
        this.currentUserName = localStorage.getItem("username");
        this.currentUserRole = localStorage.getItem("userrole");
        this.currentUserEmail = localStorage.getItem("useremail");
        this.userfullname = localStorage.getItem("userfullname");

        this.editSrmRemark = this.currentUserRole === 'IMI-SRM Analyst';
    }

    // Get Emergency Supplier's Data
    async getEmergencySupplierData() {
        this.http.get(environment.nodeurl + '/api/supplier/emergency?suplierId=' + this.supplier_id).subscribe(async data => {
            this.isloading = false;
            if (data) {
                this.supplierSingleData = data[0];
                this.workflowcurrentstate = this.supplierSingleData.status;
                this.processid = this.supplierSingleData.process_id;
                await this.setValues(this.supplierSingleData);
                await this.getEmergencyPhotos();
                await this.bindSupplier(this.supplierSingleData);
                await this.loadApproveStatusData();

                this.isalreadysaved = false;

                if(this.currentUserRole == 'IMI-SRM Analyst' && (this.workflowcurrentstate != 'Approved' && this.workflowcurrentstate != 'Rejected')){
                    this.isdeletepermission = true;
                }
            }
        })
    }

    // Get Country lists and city lists
    public getMasterData() {
        debugger
        this.http.get(environment.nodeurl + '/api/template/masterdata').subscribe(data2 => {
            if (data2) {
                localStorage.setItem("masterdata" , JSON.stringify(data2));
                this.countryList = [];
                this.countryList = data2["countryList"].map(x => x.description);

                this.cityList = [];
                this.cityListOriginal = data2["cityList"];
                this.cityList = this.cityListOriginal.filter(x => x.countryName == this.country);
            }
        });
    }

    public getMasterData1() {
        const data2 = JSON.parse(localStorage.getItem("masterdata"));
        debugger
            if (data2) {
                this.countryList = [];
                this.countryList = data2["countryList"].map(x => x.description);

                this.cityList = [];
                this.cityListOriginal = data2["cityList"];
                this.cityList = this.cityListOriginal.filter(x => x.countryName == this.country);
            }
    }

    // Emergency Supplier Form
    public createForm() {
        this.registerForm = this._formBuilder.group({
            supplierNameFormControl: ['', Validators.required],
            supplierTypeFormControl: ['', Validators.required],
            establishmentYearFormControl: ['', [YearValidator, YearValidator2, YearValidator3]],
            countryFormControl: ['', Validators.required],
            cityFormControl: ['', Validators.required],
            otherCityFormControl: [''],
            address1FormControl: ['', Validators.required],
            address2FormControl: [''],
            postalCodeFormControl: [''],
            poBoxFormControl: [''],
            titleFormControl: ['', Validators.required],
            firstNameFormControl: ['', Validators.required],
            lastNameFormControl: ['', Validators.required],
            positionFormControl: ['', Validators.required],
            telephoneCodeFormControl: ['', Validators.required],
            telephoneNumberFormControl: ['', Validators.required],
            extFormControl: [''],
            emailFormControl: ['', [Validators.required]],
            mobileCodeFormControl: ['', Validators.required],
            mobileNumberFormControl: ['', [Validators.required]],
            faxCodeFormControl: ['', Validators.required],
            faxNumberFormControl: [''],
            registrationNumberFormControl: ['', [Validators.required]],
            registrationDateFormControl: ['', [Validators.required]],
            justificationFormControl: ['', [Validators.required]],
            srmRemarkFormControl: ['', [Validators.required]],
            vatFormControl: [''],
            requiredfileEvidence: [undefined],
            requiredfileRegistration: [undefined, [Validators.required]],
            requiredfileVat: [undefined]
        });
    }

    // Set values to the form
    public async setValues(supplier) {
        this.supplier_id = supplier.supplier_id;

        if (supplier.supplier_type.length > 0 && supplier.supplier_type[0] != "") {
            let typeSelected = [];
            for (var i = 0; i < supplier.supplier_type.length; i++) {
                typeSelected.push(supplier.supplier_type[i]);
            }
            this.registerForm.patchValue({ supplierTypeFormControl: typeSelected });
        }

        var reviewdate: any = supplier.cr_exp_date ? this.datePipe.transform(supplier.cr_exp_date, "yyyy-MM-dd") : '';

        this.supplierName = supplier.emergency_supplier_name;
        this.country = supplier.country;
        this.city_ = supplier.city;

        this.registerForm.patchValue({
            supplierNameFormControl: supplier.emergency_supplier_name,
            establishmentYearFormControl: supplier.establishment_year == 0 ? '' : supplier.establishment_year,
            countryFormControl: supplier.country,
            cityFormControl: supplier.city,
            otherCityFormControl: supplier.other_city,
            address1FormControl: supplier.address_line1,
            address2FormControl: supplier.address_line2,
            postalCodeFormControl: supplier.postal_code,
            poBoxFormControl: supplier.po_box,
            titleFormControl: supplier.title,
            firstNameFormControl: supplier.first_name,
            lastNameFormControl: supplier.last_name,
            positionFormControl: supplier.position,
            telephoneCodeFormControl: supplier.telphone_country_code,
            telephoneNumberFormControl: supplier.telephone_no,
            extFormControl: supplier.extension == 0 ? '' : supplier.extension,
            emailFormControl: supplier.email,
            mobileCodeFormControl: supplier.mobile_country_code,
            mobileNumberFormControl: supplier.mobile_no,
            faxCodeFormControl: supplier.fax_country_code,
            faxNumberFormControl: supplier.fax_no,
            registrationNumberFormControl: supplier.cr_no,
            registrationDateFormControl: (reviewdate != '' && reviewdate.split("-")[0] > 1900) ? new Date(reviewdate.split("-")[0], reviewdate.split("-")[1] - 1, reviewdate.split("-")[2]) : '',
            justificationFormControl: supplier.justification,
            srmRemarkFormControl: supplier.srm_remark,
            vatFormControl: supplier.vat_no
        });

        if (JSON.parse(localStorage.getItem("masterdata"))) {
            this.getMasterData1();
          }else{
            this.getMasterData();
          }
          
        this.bindSupplier(supplier);

        if(supplier.country == 'SAUDI ARABIA'){
            this.showChecked = true;

        }else{
            this.showChecked = false;

        }
    }

    // Update Emergency Supplier
    updateEmergencySupplier(): void {
        const check = this.registerForm.valid;

        var CreatedDate = new Date().toISOString();
        var CreatedTime = new Date().toTimeString();
        var date_time_split = CreatedDate.split("T");
        var date = date_time_split[0];

        var time_split = CreatedTime.split(" ");
        var time = time_split[0] + "." + new Date().getMilliseconds();

        if (check && this.UnSupportFormatEvi == false && this.UnSupportFormatReg == false && this.UnSupportFormatVat == false) {

            var emergency: EmergencySupplier = new EmergencySupplier();
            emergency.supplier_id = Number(this.supplier_id);
            emergency.emergency_supplier_name = this.registerForm.value.supplierNameFormControl.trim();
            emergency.email = this.registerForm.value.emailFormControl.trim();
            emergency.establishment_year = this.registerForm.value.establishmentYearFormControl ? (this.registerForm.value.establishmentYearFormControl).toString() : null;
            emergency.supplier_type = this.registerForm.value.supplierTypeFormControl;
            emergency.country = this.registerForm.value.countryFormControl;
            emergency.city = this.registerForm.value.cityFormControl;
            emergency.other_city = this.registerForm.value.otherCityFormControl;
            emergency.po_box = this.registerForm.value.poBoxFormControl;
            emergency.postal_code = this.registerForm.value.postalCodeFormControl;
            emergency.address_line1 = this.registerForm.value.address1FormControl;
            emergency.address_line2 = this.registerForm.value.address2FormControl;
            emergency.title = this.registerForm.value.titleFormControl;
            emergency.first_name = this.registerForm.value.firstNameFormControl;
            emergency.last_name = this.registerForm.value.lastNameFormControl;
            emergency.telphone_country_code = this.registerForm.value.telephoneCodeFormControl;
            emergency.telephone_no = (this.registerForm.value.telephoneNumberFormControl).toString();
            emergency.extension = this.registerForm.value.extFormControl ? (this.registerForm.value.extFormControl).toString() : null;
            emergency.mobile_country_code = this.registerForm.value.mobileCodeFormControl;
            emergency.mobile_no = (this.registerForm.value.mobileNumberFormControl).toString();
            emergency.fax_country_code = this.registerForm.value.faxCodeFormControl;
            emergency.fax_no = this.registerForm.value.faxNumberFormControl ? (this.registerForm.value.faxNumberFormControl).toString() : null;
            emergency.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
            emergency.cr_exp_date = moment(this.registerForm.value.registrationDateFormControl).format('YYYY-MM-DD');  //this.registerForm.value.registrationDateFormControl;
            emergency.justification = this.registerForm.value.justificationFormControl;            
            emergency.srm_remark = this.registerForm.value.srmRemarkFormControl;            
            emergency.position = this.registerForm.value.positionFormControl;
            emergency.create_date_time = date + " " + time;
            emergency.invite_by = this.username;
            emergency.invite_by_email = this.useremail;
            emergency.invite_by_role = this.userrole;
            emergency.vat_no = this.registerForm.value.vatFormControl ? this.registerForm.value.vatFormControl : '';

            if(this.userrole === 'IMI-SRM Analyst'){
                emergency.srm_remark = this.registerForm.value.srmRemarkFormControl;
            }

            this.issuccess_e = true;

            this.http.post<any>(environment.nodeurl + '/api/supplier/emergency', emergency).subscribe(async data => {
                if (data && data > 0) {
                    this.supplier_id = data;

                    if (this.supplier_id != 0) {
                        if (this.uploader.queue.length != 0) {
                            this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                                form.append('supplierid', this.supplier_id);
                                fileItem.url = environment.nodeurl + '/api/file/uploadFiles';
                            };
                            this.uploader.uploadAll();

                            this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                                if (response == "All the files are successfully uploaded.") {
                                    this.uploader.queue.length = 0;
                                    this.registrationFile_name = this.supplier_id + this.newfile_reg;
                                }
                            };
                        }
                        if (this.uploaderEvi.queue.length != 0) {
                            this.uploaderEvi.onBuildItemForm = (fileItem: any, form: any) => {
                                form.append('supplierid', this.supplier_id);
                                fileItem.url = environment.nodeurl + '/api/file/uploadFiles';
                            };
                            this.uploaderEvi.uploadAll();

                            this.uploaderEvi.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                                if (response == "All the files are successfully uploaded.") {
                                    this.uploaderEvi.queue.length = 0;
                                    this.evidenceFile_name = this.supplier_id + this.newfile_evi;
                                }
                            };
                        }
                        if (this.uploaderVat.queue.length != 0) {
                            this.uploaderVat.onBuildItemForm = (fileItem: any, form: any) => {
                                form.append('supplierid', this.supplier_id);
                                fileItem.url = environment.nodeurl + '/api/file/uploadFiles';
                            };
                            this.uploaderVat.uploadAll();

                            this.uploaderVat.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
                                if (response == "All the files are successfully uploaded.") {
                                    this.uploaderVat.queue.length = 0;
                                    this.vatFile_name = this.supplier_id + this.newfile_vat;
                                }
                            };
                        }
                    }
                }
            });
        }
        else {
            this.registerForm.markAllAsTouched();
        }
    }

    // Delete Emergency Supplier
    deleteEmergencySupplier() {
        this.configForm.patchValue({
            message: 'Are you sure you want to delete this ' + this.supplier_code + ' supplier permanently ?'
        });

        const dialogRef = this._fuseConfirmationService.open(this.configForm.value);
        dialogRef.addPanelClass('confirmation-dialog');
        dialogRef.afterClosed().subscribe((result) => {
            if (result == "confirmed") {
                var supplier_id: number = parseInt(this.supplier_id);
                var delete_emergency: DeleteEmg = new DeleteEmg();
                delete_emergency.supplier_id = parseInt(this.supplier_id);

                this.http.post<any>(environment.nodeurl + '/api/supplier/deleteemg', delete_emergency).subscribe(
                    data => {
                        if (data) {
                            this.http.get<any>(environment.nodeurl + '/api/file/deleteEmergencySupplierFiles?supplierid=' + supplier_id).subscribe(
                                data => {
                                    if (data) {
                                        this.router.navigate(['/items/emergency-supplier']);
                                    }
                                },
                                error => console.log('Error in deleting the emergency supplier!'))
                        }
                    }, error => console.log('Error in deleting the emergency supplier!'))
            } else {
                // do nothing
                console.log("cancelled");
            }
        });
    }

    // Emergency supplier related attachments
    public async getEmergencyPhotos() {
        this.http.get(environment.nodeurl + '/api/file/getEmergencyPhotos?SupplierId=' + this.supplier_id).subscribe(data => {
            if (data) {
                console.log("load files ", data['photos']);
                this.photos = data['photos'];
                this.length = this.photos.length;

                data['photos'].forEach(element => {
                    if (element.includes('_Evi')) {
                        this.evidenceFile_name = element;
                        this.registerForm.get('requiredfileEvidence').markAsUntouched();
                        this.registerForm.get('requiredfileEvidence').setErrors(null);
                    } else if (element.includes('_Reg')) {
                        this.registrationFile_name = element;
                        this.registerForm.get('requiredfileRegistration').markAsUntouched();
                        this.registerForm.get('requiredfileRegistration').setErrors(null);
                    } else {
                        this.vatFile_name = element;
                        this.registerForm.get('requiredfileVat').markAsUntouched();
                        this.registerForm.get('requiredfileVat').setErrors(null);
                    }
                });
            }
        });
    }

    // Download Emergency supplier related files 
    public download(fileUrl: string) {
        window.location.href = environment.nodeurl + '/api/file/downloadEmergency?fileUrl=' + fileUrl;
    }

    // Validation for name, email and cr_no
    onKeySearch(event: any, cat: string) {
        if (this.supplier_id == 0) {
            if (cat == 'E') {
                var value = event.target.value;
                if (value != '') {
                    var emailvalue = value.toLowerCase().trim();
                    var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);
                    var res = pattern.test(emailvalue);
                    if (res) {
                        this.executeListing(event.target.value, cat);
                    } else {
                        console.log("invalid email ID");
                        this.registerForm.get('emailFormControl').setErrors({ invalidpattern: true });
                    }
                } else {
                    this.registerForm.get('emailFormControl').setErrors({ required: true });
                }
            }
            else if (cat == 'N') {
                this.executeListing(event.target.value, cat);
            }
            else if (cat == 'R') {
                this.executeListing(event.target.value, cat);
            }
        }
        else if (this.supplier_id > 0 && cat == 'E') {
            var value = event.target.value;
            if (value != '') {
                var emailvalue = value.toLowerCase().trim();
                var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);
                var res = pattern.test(emailvalue);
                if (res) {
                    if (this.supplier.email != this.registerForm.getRawValue().emailFormControl) {
                        this.executeListing(event.target.value, cat);
                    } else {
                        this.registerForm.get('emailFormControl').markAsUntouched();
                    }
                } else {
                    this.registerForm.get('emailFormControl').setErrors({ invalidpattern: true });
                }
            } else {
                this.registerForm.get('emailFormControl').setErrors({ required: true });
            }
        }
        else if (this.supplier_id > 0 && cat == 'N') {
            if (this.supplier.supplier_name != this.registerForm.getRawValue().supplierNameFormControl) {
                this.executeListing(event.target.value, cat);
            } else {
                this.registerForm.get('supplierNameFormControl').markAsUntouched();
            }
        }
        else if (this.supplier_id > 0 && cat == 'R') {
            if (this.supplier.cr_no != this.registerForm.getRawValue().registrationNumberFormControl.value) {
                this.executeListing(event.target.value, cat);
            } else {
                this.registerForm.get('registrationNumberFormControl').markAsUntouched();
            }
        }

        if (this.registerForm.value.supplierNameFormControl != '' && this.registerForm.value.emailFormControl != '' &&
            (this.registerForm.controls.emailFormControl.status != 'INVALID' && this.registerForm.controls.supplierNameFormControl.status != 'INVALID')) {

            this.istempsave = true;
        } else {
            this.istempsave = false;
        }
    }

    // check unique value or not nser name, email and cr_no
    executeListing(val: string, category: string) {
        var value = val.toLowerCase().trim();

        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let options = { headers: headers };
        var body = { value };

        if (value != '' && !(value == 'sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'nadun.ruchiranga@xitricon.com' || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com')) {
            var isExist: IsExists = new IsExists();
            isExist.value = value;
            isExist.category = category;

            this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {

                if (data != null && data['status'] != 'Rejected') {
                    if (category == 'N') {
                        this.isnameexists = true;
                        this.registerForm.get('supplierNameFormControl').setErrors({ invalid: true });
                    } else if (category == 'E') {
                        this.isemailexists = true;
                        this.registerForm.get('emailFormControl').setErrors({ invalid: true });
                    } else if (category == 'R') {
                        this.iscrnoexists = true;
                        this.registerForm.get('registrationNumberFormControl').setErrors({ invalid: true });
                    }

                } else {
                    if (category == 'N') {
                        this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'N', body, options).subscribe(data3 => {
                            var data = data3;
                            if (data3 != null && Number(data3['Message']) > 0) {
                                this.isnameexists = true;
                                this.registerForm.get('supplierNameFormControl').setErrors({ invalid: true });
                            } else {
                                this.isnameexists = false;
                                this.registerForm.get('supplierNameFormControl').markAsUntouched();
                            }
                        });
                    } else if (category == 'E') {
                        this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'E', body, options).subscribe(data3 => {
                            var data = data3;
                            if (data3 != null && Number(data3['Message']) > 0) {
                                this.isemailexists = true;
                                this.registerForm.get('emailFormControl').setErrors({ invalid: true });
                            } else {
                                this.isemailexists = false;
                                this.registerForm.get('emailFormControl').markAsUntouched();
                            }
                        });
                    } else if (category == 'R') {
                        this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'R', body, options).subscribe(data3 => {
                            var data = data3;
                            if (data3 != null && Number(data3['Message']) > 0) {
                                this.iscrnoexists = true;
                                this.registerForm.get('registrationNumberFormControl').setErrors({ invalid: true });
                            } else {
                                this.iscrnoexists = false;
                                this.registerForm.get('registrationNumberFormControl').markAsUntouched();
                            }
                        });

                    }
                }
            });
        }
    }

    // Select Date
    changeDate() {
        var selectedDate = new Date(this.registerForm.value.registrationDateFormControl); // moment(new Date(this.registerForm.value.registrationDateFormControl)).format('YYYY-MM-DD');
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if (selectedDate < now) {
            this.passedDate = true
        } else {
            this.passedDate = false;
        }
    }

    // select country
    OnCountrySelect(event) {

        this.registerForm.patchValue({
            otherCityFormControl: '',
            cityFormControl: ''
        })

        this.selectedCountry = event;
        this.selectTelephoneCode();

        this.iscitydisable = false;
        this.cityList = [];
        this.cityList = this.cityListOriginal.filter(x => x.countryName == event);

        if (this.registerForm.value.cityFormControl == 'Other') {
            this.registerForm.get('otherCityFormControl').enable();
            this.registerForm.get('otherCityFormControl').setErrors({ invalid: true });
        } else {
            this.registerForm.get('otherCityFormControl').disable();
            this.registerForm.get('otherCityFormControl').markAsUntouched();
        }

        if ((event) == 'SAUDI ARABIA') {
            this.kingdom = '1';
        }
        else {
            this.kingdom = '2';
        }
    }

    // Select city based on country
    OnCitySelect(event) {
        if (event === 'Other') {
            this.registerForm.get('otherCityFormControl').enable();
            this.registerForm.get('otherCityFormControl').setErrors({ invalid: true });
        } else {
            this.registerForm.get('otherCityFormControl').disable();
            this.registerForm.patchValue({
                otherCityFormControl: ''
            });
            this.registerForm.get('otherCityFormControl').markAsUntouched();
        }
    }

    // Select other city if city is not available
    onOtherCityEnter(event) {
        if (event && event.target.value != '') {
            var isexistingcity = this.cityList.filter(x => x.cityName.toUpperCase() == event.target.value.toString().toUpperCase());
            if (isexistingcity.length > 0) {
                this.registerForm.get('otherCityFormControl').setErrors({ isexists: true });
            } else {
                this.registerForm.get('otherCityFormControl').markAsUntouched();
            }
        } else {
            this.registerForm.get('otherCityFormControl').markAsUntouched();
        }
    }

    // Select Telephone country code
    selectTelephoneCode() {
        for (var i = 0; i < this.telephoneCodeList.length; i++) {
            var telephoneCode = this.telephoneCodeList[i];
            var str = telephoneCode.toUpperCase();
            if (str.includes(this.selectedCountry)) {
                return this.selectedCountry = telephoneCode;
            }
        }
    }

    // Check attachment
    onAttachment(event, category) {
        if (category == 'Evi') {
            if (this.uploaderEvi.queue.length > 1) {
                this.uploaderEvi.queue[0].remove()
            }
        }
        if (category == 'Vat') {
            if (this.uploaderVat.queue.length > 1) {
                this.uploaderVat.queue[0].remove()
            }
        }
        if (category == 'Reg') {
            if (this.uploader.queue.length > 1) {
                this.uploader.queue[0].remove()
            }
        }

        if (event.target.files && event.target.files[0]) {
            let type = category;
            var length = 0;
            var newFilename = '';

            if (type == 'Evi') {
                length = this.uploaderEvi.queue.length;
                const oldFileItem: FileItem = this.uploaderEvi.queue[length - 1];
                this.fileName_Evi = oldFileItem.file.name;
                newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
            }
            if (type == 'Vat') {
                length = this.uploaderVat.queue.length;
                const oldFileItem: FileItem = this.uploaderVat.queue[length - 1];
                this.fileName_Vat = oldFileItem.file.name;
                newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
            }
            if (type == 'Reg') {
                length = this.uploader.queue.length;
                const oldFileItem: FileItem = this.uploader.queue[length - 1];
                this.fileName_Reg = oldFileItem.file.name;
                newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
            }

            if (newFilename.includes('jpg') || newFilename.includes('jpeg') || newFilename.includes('pdf') ||
                newFilename.includes('png') || newFilename.includes('txt') || newFilename.includes('text') ||
                newFilename.includes('tex') || newFilename.includes('doc') || newFilename.includes('docx') ||
                newFilename.includes('xpd') || newFilename.includes('rtf') || newFilename.includes('ods') ||
                newFilename.includes('csv') || newFilename.includes('odt') || newFilename.includes('xlsx') ||
                newFilename.includes('xlsm') || newFilename.includes('xls') || newFilename.includes('xml') ||
                newFilename.includes('svg') || newFilename.includes('tif') || newFilename.includes('tiff') ||
                newFilename.includes('gif') || newFilename.includes('bmp') || newFilename.includes('xhtml') ||
                newFilename.includes('html') || newFilename.includes('key') || newFilename.includes('odp') ||
                newFilename.includes('pptx') || newFilename.includes('ppt') || newFilename.includes('JPG')
                || newFilename.includes('JPEG') || newFilename.includes('PDF') ||
                newFilename.includes('PNG') || newFilename.includes('TXT') || newFilename.includes('TEXT') ||
                newFilename.includes('TEX') || newFilename.includes('DOC') || newFilename.includes('DOCX') ||
                newFilename.includes('XPD') || newFilename.includes('RTF') || newFilename.includes('ODS') ||
                newFilename.includes('CSV') || newFilename.includes('ODT') || newFilename.includes('XLSX') ||
                newFilename.includes('XLSM') || newFilename.includes('XLS') || newFilename.includes('XML') ||
                newFilename.includes('SVG') || newFilename.includes('TIF') || newFilename.includes('TIFF') ||
                newFilename.includes('GIF') || newFilename.includes('BMP') || newFilename.includes('XHTML') ||
                newFilename.includes('HTML') || newFilename.includes('KEY') || newFilename.includes('ODP') ||
                newFilename.includes('PPTX') || newFilename.includes('PPT')) {

                if (type == 'Evi') {
                    this.UnSupportFormatEvi = false;
                    let file = event.target.files[0];
                    this.evidenceFile = file

                    if (file == undefined) {
                        this.evidenceFileAttached = false;
                        this.emptyFileEvidence = false;
                    }
                    else {
                        this.evidenceFileAttached = true
                        if (this.evidenceFile.size == 0) {
                            this.emptyFileEvidence = true;
                            this.registerForm.patchValue({ 'requiredfileEvidence': null });

                        } else {
                            this.emptyFileEvidence = false;
                        }
                    }
                }
                else if (type == 'Vat') {
                    this.UnSupportFormatVat = false;
                    let file = event.target.files[0];
                    this.vatFile = file

                    if (file == undefined) {
                        this.vatFileAttached = false;
                        this.emptyFileVat = false;
                    }
                    else {
                        this.vatFileAttached = true
                        if (this.vatFile.size == 0) {
                            this.emptyFileVat = true;
                            this.registerForm.patchValue({ 'requiredfileVat': null });

                        } else {
                            this.emptyFileVat = false;
                        }
                    }
                }
                else {
                    this.UnSupportFormatReg = false;
                    let file = event.target.files[0];
                    this.registrationFile = file

                    if (file == undefined) {
                        this.registrationFileAttached = false;
                        this.emptyFileRegistration = false;
                    } else {
                        this.registrationFileAttached = true;

                        if (this.registrationFile.size == 0) {
                            this.emptyFileRegistration = true;
                            this.registerForm.patchValue({ 'requiredfileRegistration': null });

                        } else {
                            this.emptyFileRegistration = false;
                        }
                    }
                }
            }
            else if (!newFilename.includes('jpg') || !newFilename.includes('jpeg') || !newFilename.includes('pdf') ||
                !newFilename.includes('png') || !newFilename.includes('txt') || !newFilename.includes('text') ||
                !newFilename.includes('tex') || !newFilename.includes('doc') || !newFilename.includes('docx') ||
                !newFilename.includes('xpd') || !newFilename.includes('rtf') || !newFilename.includes('ods') ||
                !newFilename.includes('csv') || !newFilename.includes('odt') || !newFilename.includes('xlsx') ||
                !newFilename.includes('xlsm') || !newFilename.includes('xls') || !newFilename.includes('xml') ||
                !newFilename.includes('svg') || !newFilename.includes('tif') || !newFilename.includes('tiff') ||
                !newFilename.includes('gif') || !newFilename.includes('bmp') || !newFilename.includes('xhtml') ||
                !newFilename.includes('html') || !newFilename.includes('key') || !newFilename.includes('odp') ||
                !newFilename.includes('pptx') || !newFilename.includes('ppt') || !newFilename.includes('JPG') ||
                !newFilename.includes('JPEG') || !newFilename.includes('PDF') ||
                !newFilename.includes('PNG') || !newFilename.includes('TXT') || !newFilename.includes('TEXT') ||
                !newFilename.includes('TEX') || !newFilename.includes('DOC') || !newFilename.includes('DOCX') ||
                !newFilename.includes('XPD') || !newFilename.includes('RTF') || !newFilename.includes('ODS') ||
                !newFilename.includes('CSV') || !newFilename.includes('ODT') || !newFilename.includes('XLSX') ||
                !newFilename.includes('XLSM') || !newFilename.includes('XLS') || !newFilename.includes('XML') ||
                !newFilename.includes('SVG') || !newFilename.includes('TIF') || !newFilename.includes('TIFF') ||
                !newFilename.includes('GIF') || !newFilename.includes('BMP') || !newFilename.includes('XHTML') ||
                !newFilename.includes('HTML') || !newFilename.includes('KEY') || !newFilename.includes('ODP') ||
                !newFilename.includes('PPTX') || !newFilename.includes('PPT')) {
                this.UnSupportFormat = true;

                if (type == 'Evi') {
                    this.UnSupportFormatEvi = true;
                }
                else if (type == 'Vat') {
                    this.UnSupportFormatVat = true;
                }
                else {
                    this.UnSupportFormatReg = true;
                }
            }

            if (length > 0) {
                if (this.UnSupportFormatEvi == false && type == 'Evi') {
                    const oldFileItem: FileItem = this.uploaderEvi.queue[length - 1];
                    var newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
                    const newFile: File = new File([this.uploaderEvi.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploaderEvi, newFile, null);
                    this.uploaderEvi.queue[length - 1] = newFileItem;
                    this.newfile_evi = newFileItem.file.name;
                }
                if (this.UnSupportFormatReg == false && type == 'Reg') {
                    const oldFileItem: FileItem = this.uploader.queue[length - 1];
                    var newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
                    const newFile: File = new File([this.uploader.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploader, newFile, null);
                    this.uploader.queue[length - 1] = newFileItem;
                    this.newfile_reg = newFileItem.file.name;
                    this.registrationFile_error_check = false;
                }
                if (this.UnSupportFormatVat == false && type == 'Vat') {
                    const oldFileItem: FileItem = this.uploaderVat.queue[length - 1];
                    var newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
                    const newFile: File = new File([this.uploaderVat.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploaderVat, newFile, null);
                    this.uploaderVat.queue[length - 1] = newFileItem;
                    this.newfile_vat = newFileItem.file.name;
                }
            }
        }
    }

    // Remove attachment error message
    removeAttachment(type) {
        if (type == "Reg") {
            if (this.uploader.queue.length > 0) { this.uploader.queue[0].remove(); }
            if (this.emptyFileRegistration == true) { this.emptyFileRegistration = false; }
            if (this.UnSupportFormatReg == true) { this.UnSupportFormatReg = false; }
        }
        if (type == "Evi") {
            if (this.uploaderEvi.queue.length > 0) { this.uploaderEvi.queue[0].remove(); }
            if (this.emptyFileEvidence == true) { this.emptyFileEvidence = false; }
            if (this.UnSupportFormatEvi == true) { this.UnSupportFormatEvi = false; }
        }
        if (type == "Vat") {
            if (this.uploaderVat.queue.length > 0) { this.uploaderVat.queue[0].remove(); }
            if (this.emptyFileVat == true) { this.emptyFileVat = false; }
            if (this.UnSupportFormatVat == true) { this.UnSupportFormatVat = false; }
        }
    }

    async loadApproveStatusData() {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiTokenworkflow
        });
        let options = { headers: headers };

        this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetAvaliableCommands?processId=' + this.processid, options)
            .subscribe(data => {
                this.groupdata = [];
                var comments = data["result"].map(a => a.name);
                this.groupdata = comments;

                this.getWorkflowInstanceCurrentRole();
            })
    }

    saveWorkflow() {

        if (this.selectedStatus != 'active' && this.outcomereason != '') {
            this.isloading = true;

            this.executeworkflowcommand(this.selectedStatus);
        } else if (this.selectedStatus == 'active') {
            this.iserror = true;
            this.errormessage = 'Please select an approval option!';
        }
        else if (this.outcomereason == '') {
            this.iserror = true;
            this.errormessage = 'Please enter remark!';
            this.formFieldHelpers.push("has-error");
        }
    }

    onOutcomeDecisionRemark() {
        this.iserror = false;
        this.errormessage = '';
        this.formFieldHelpers = [];
    }

    getWorkflowInstanceCurrentRole() {

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiTokenworkflow
        });
        let options = { headers: headers };

        this.http.get(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/GetInstanceCurrentRole?processId=' + this.processid, options)
            .subscribe(data => {
                var workflowstate = data["result"];
                if (workflowstate == 'GM Approval') {
                    this.workflowcurrentrole = 'IMI-GM';
                } else if (workflowstate == 'VP Approval') {
                    this.workflowcurrentrole = 'IMI-VP';
                } else if (workflowstate == 'SRM Approval') {
                    this.workflowcurrentrole = 'IMI-SRM Analyst';
                }
                if (localStorage.getItem("userrole") == this.workflowcurrentrole) {
                    this.enableapprovalwf = true;
                } else if (localStorage.getItem("userrole") == "IMI-SRM Analyst" && this.processid == null) {
                    this.enableapprovalwf = true;
                } else {
                    this.enableapprovalwf = false;
                }
            });
    }

    executeworkflowcommand(command) {
        this.isloading = true;
        const documentbody =
        {
            "processId": this.processid,
            "commandName": command
        }
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiTokenworkflow
        });
        let options = { headers: headers };
        this.http.post(environment.workflowApiUrl + '/api/services/app/WorkflowScheme/ExecuteCommand?processId=' + this.processid + '&commandName=' + command, documentbody, options)
            .subscribe(async data => {
                this.isalreadysaved = true;

                if (localStorage.getItem('userrole') == 'IMI-VP') {

                    if (command == 'Approve') {
                        const suppliercompstatus = {
                            supplier_id: this.supplier_id, //EMERGENCY_SUPPLIER_ID,
                            status: "Approved"
                        }


                        this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                            var history = new EmergencyApprovedItems();
                            history.SupplierId = this.supplier_id;
                            history.Status = 'Approved';
                            history.CURRENT_POSITION = this.currentUserRole,
                                history.DUE_DATE = new Date(),
                                history.HANDLE_BEFORE = new Date(),
                                history.HANDLE_DATE = new Date(),
                                history.OUTCOME = new Date(),
                                history.OUTCOME_REASON = this.outcomereason,
                                history.USERID = this.currentUserRole,
                                history.USERROLE = this.userfullname,
                                history.Action_Command = command
                            this.api.saveEmergHistory(history);
                            this.issuccess = true;
                            this.successmessage = 'Successfully executed the command. Supplier is pushing to IFS...!'
                            this.isloading = true;
                        });


                        await this.pushSuppliertoIFS();

                        var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                        deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                        deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                        deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                        deleteSupplier.type = "emg";

                        this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                            if (data2 == true) {
                                console.log("deletion success");
                            }
                        });

                    } else {
                        const suppliercompstatus = {
                            supplier_id: this.supplier_id, //EMERGENCY_SUPPLIER_ID,
                            status: "Awaiting for SRM Recommendation"
                        }


                        this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                            var history = new EmergencyApprovedItems();
                            history.SupplierId = this.supplier_id;
                            history.Status = 'Awaiting for SRM Recommendation';
                            history.CURRENT_POSITION = this.currentUserRole,
                                history.DUE_DATE = new Date(),
                                history.HANDLE_BEFORE = new Date(),
                                history.HANDLE_DATE = new Date(),
                                history.OUTCOME = new Date(),
                                history.OUTCOME_REASON = this.outcomereason,
                                history.USERID = this.currentUserRole,
                                history.USERROLE = this.userfullname,
                                history.Action_Command = command
                            this.api.saveEmergHistory(history);

                            var role = 'IMI-SRM Analyst';
                            // this.http.post<any>(environment.nodeurl + '/api/email/sendEmgworkflowmail?roleName=' + role + '&supplierid=' + this.supplier_id + '&content=' + this.processid + '&category=emgsrm', null).subscribe(data => {
                            // });

                            var portaltomsflow = new PortalToMsFlowDto();
                            portaltomsflow.command = command;
                            portaltomsflow.procesID = this.processid;
                            portaltomsflow.comment = this.outcomereason;
                            portaltomsflow.supplierID = this.supplier_id.toString();
                            portaltomsflow.supplier_code = this.supplier_code;
                            portaltomsflow.workflowCurrentStatus = "SRM Approval";
                            portaltomsflow.supplierStatus = status;
                            portaltomsflow.criticality = 0 ;
                            portaltomsflow.role = localStorage.getItem('userrole');
                            portaltomsflow.triggeredBy = localStorage.getItem('username');
                            
                            this.http.post<any>(environment.nodeurl + '/api/email/CallFromPortalByFlowEmg', portaltomsflow).subscribe(data => {
                                //debugger;
                            });

                            this.issuccess = true;
                            this.successmessage = 'Successfully executed the command!'

                            var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                            deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                            deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                            deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                            deleteSupplier.type = "emg";

                            this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                if (data2 == true) {
                                    this.isloading = false;
                                    console.log("deletion success");
                                }
                            });
                        });
                    }

                } else if (localStorage.getItem('userrole') == 'IMI-GM') {
                    if (command == 'Approve') {
                        const suppliercompstatus = {
                            supplier_id: this.supplier_id, //EMERGENCY_SUPPLIER_ID,
                            status: "Awaiting for VP approval"
                        }


                        this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                            var history = new EmergencyApprovedItems();
                            history.SupplierId = this.supplier_id;
                            history.Status = 'Awaiting for VP Approval';
                            history.CURRENT_POSITION = this.currentUserRole,
                                history.DUE_DATE = new Date(),
                                history.HANDLE_BEFORE = new Date(),
                                history.HANDLE_DATE = new Date(),
                                history.OUTCOME = new Date(),
                                history.OUTCOME_REASON = this.outcomereason,
                                history.USERID = this.currentUserRole,
                                history.USERROLE = this.userfullname,
                                history.Action_Command = command
                            this.api.saveEmergHistory(history);

                            // this.http.post<any>(environment.nodeurl + '/api/email/sendEmgworkflowmail?roleName=IMI-VP&supplierid=' + this.supplier_id + '&content=' + this.processid + '&category=emgvpattachement', null).subscribe(data => {
                            // });

                            var portaltomsflow = new PortalToMsFlowDto();
                            portaltomsflow.command = command;
                            portaltomsflow.procesID = this.processid;
                            portaltomsflow.comment = this.outcomereason;
                            portaltomsflow.supplierID = this.supplier_id.toString();
                            portaltomsflow.supplier_code = this.supplier_code;
                            portaltomsflow.workflowCurrentStatus = "VP Approval";
                            portaltomsflow.supplierStatus = status;
                            portaltomsflow.criticality = 0 ;
                            portaltomsflow.role = localStorage.getItem('userrole');
                            portaltomsflow.triggeredBy = localStorage.getItem('username');
                            
                            this.http.post<any>(environment.nodeurl + '/api/email/CallFromPortalByFlowEmg', portaltomsflow).subscribe(data => {
                                //debugger;
                            });

                            this.issuccess = true;
                            this.successmessage = 'Successfully executed the command!'
                            
                            var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                            deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                            deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                            deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                            deleteSupplier.type = "emg";

                            this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                if (data2 == true) {
                                    this.isloading = false;
                                    console.log("deletion success");
                                }
                            });

                        });
                    } else {
                        const suppliercompstatus = {
                            supplier_id: this.supplier_id, //EMERGENCY_SUPPLIER_ID,
                            status: "Awaiting for SRM Recommendation"
                        }


                        this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                            var history = new EmergencyApprovedItems();
                            history.SupplierId = this.supplier_id;
                            history.Status = 'Awaiting for SRM Recommendation';
                            history.CURRENT_POSITION = this.currentUserRole,
                                history.DUE_DATE = new Date(),
                                history.HANDLE_BEFORE = new Date(),
                                history.HANDLE_DATE = new Date(),
                                history.OUTCOME = new Date(),
                                history.OUTCOME_REASON = this.outcomereason,
                                history.USERID = this.currentUserRole,
                                history.USERROLE = this.userfullname,
                                history.Action_Command = command
                            this.api.saveEmergHistory(history);

                            var role = 'IMI-SRM Analyst';
                            // this.http.post<any>(environment.nodeurl + '/api/email/sendEmgworkflowmail?roleName=' + role + '&supplierid=' + this.supplier_id + '&content=' + this.processid + '&category=emgsrm', null).subscribe(data => {
                            // });

                            var portaltomsflow = new PortalToMsFlowDto();
                            portaltomsflow.command = command;
                            portaltomsflow.procesID = this.processid;
                            portaltomsflow.comment = this.outcomereason;
                            portaltomsflow.supplierID = this.supplier_id.toString();
                            portaltomsflow.supplier_code = this.supplier_code;
                            portaltomsflow.workflowCurrentStatus = "SRM Approval";
                            portaltomsflow.supplierStatus = status;
                            portaltomsflow.criticality = 0 ;
                            portaltomsflow.role = localStorage.getItem('userrole');
                            portaltomsflow.triggeredBy = localStorage.getItem('username');
                            
                            this.http.post<any>(environment.nodeurl + '/api/email/CallFromPortalByFlowEmg', portaltomsflow).subscribe(data => {
                                //debugger;
                            });

                            this.issuccess = true;
                            this.successmessage = 'Successfully executed the command!'
                            
                            var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                            deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                            deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                            deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                            deleteSupplier.type = "emg";

                            this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                if (data2 == true) {
                                    this.isloading = false;
                                    console.log("deletion success");
                                }
                            });

                        });
                    }

                } else if (localStorage.getItem('userrole') == 'IMI-SRM Analyst') {
                    if (command == 'Approve') {
                        const suppliercompstatus = {
                            supplier_id: this.supplier_id, //EMERGENCY_SUPPLIER_ID,
                            status: "Awaiting for GM approval"
                        }


                        this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                            var history = new EmergencyApprovedItems();
                            history.SupplierId = this.supplier_id;
                            history.Status = 'Awaiting for GM Approval';
                            history.CURRENT_POSITION = this.currentUserRole,
                                history.DUE_DATE = new Date(),
                                history.HANDLE_BEFORE = new Date(),
                                history.HANDLE_DATE = new Date(),
                                history.OUTCOME = new Date(),
                                history.OUTCOME_REASON = this.outcomereason,
                                history.USERID = this.currentUserRole,
                                history.USERROLE = this.userfullname,
                                history.Action_Command = command
                            this.api.saveEmergHistory(history);

                            // this.http.post<any>(environment.nodeurl + '/api/email/sendEmgworkflowmail?roleName=IMI-GM&supplierid=' + this.supplier_id + '&content=' + this.processid + '&category=emggmattachement', null).subscribe(data => {
                            // });

                            var portaltomsflow = new PortalToMsFlowDto();
                            portaltomsflow.command = command;
                            portaltomsflow.procesID = this.processid;
                            portaltomsflow.comment = this.outcomereason;
                            portaltomsflow.supplierID = this.supplier_id.toString();
                            portaltomsflow.supplier_code = this.supplier_code;
                            portaltomsflow.workflowCurrentStatus = "GM Approval";
                            portaltomsflow.supplierStatus = status;
                            portaltomsflow.criticality = 0 ;
                            portaltomsflow.role = localStorage.getItem('userrole');
                            portaltomsflow.triggeredBy = localStorage.getItem('username');
                            
                            this.http.post<any>(environment.nodeurl + '/api/email/CallFromPortalByFlowEmg', portaltomsflow).subscribe(data => {
                                //debugger;
                            });

                            this.issuccess = true;
                            this.successmessage = 'Successfully executed the command!'
                            
                            var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                            deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                            deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                            deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                            deleteSupplier.type = "emg";

                            this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                if (data2 == true) {
                                    this.isloading = false;
                                    console.log("deletion success");
                                }
                            });

                        });
                    } else {
                        const suppliercompstatus = {
                            supplier_id: this.supplier_id, //EMERGENCY_SUPPLIER_ID,
                            status: "Rejected"
                        }


                        this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                            this.http.get<any>(environment.nodeurl + '/api/email?email=' + this.supplierSingleData.email + '&supplierid=' + this.supplier_id + '&content='+this.outcomereason+'&category=srmrejectemg').subscribe(async data => {
                                var history = new EmergencyApprovedItems();
                                history.SupplierId = this.supplier_id;
                                history.Status = 'Rejected';
                                history.CURRENT_POSITION = this.currentUserRole,
                                history.DUE_DATE = new Date(),
                                history.HANDLE_BEFORE = new Date(),
                                history.HANDLE_DATE = new Date(),
                                history.OUTCOME = new Date(),
                                history.OUTCOME_REASON = this.outcomereason,
                                history.USERID = this.currentUserRole,
                                history.USERROLE = this.userfullname,
                                history.Action_Command = command
                            this.api.saveEmergHistory(history);
                               
                                this.issuccess = true;
                                this.successmessage = 'Successfully executed the command.'
                                
                                var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                                deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                                deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                                deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                                deleteSupplier.type = "emg";

                                this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                                    if (data2 == true) {
                                        this.isloading = false;
                                        console.log("deletion success");
                                    }
                                });
                            });
                        });
                    }

                }
            })
    }

    async pushSuppliertoIFS() {
        //this.isWait = true;
        this.isloading = true;

        this.http.post<any>(environment.ifsIntegrationUrl + '/api/supplier/', this.ifsSupplier).subscribe(data3 => {
            if (data3["Response"]) {
                if (data3["Message"] != null) {
                    var ifscode = data3["Message"];
                    this.newifscode = ifscode;
                    this.http.post<any>(environment.nodeurl + '/api/supplier/SaveEmgIfsCode?supplierId=' + this.supplier_id + '&ifscode=' + ifscode, null).subscribe(data => {
                        this.issuccess = true;
                        this.successmessage = 'Successfully registered the supplier in IFS!';

                        this.http.get<any>(environment.nodeurl + '/api/email/sendApproveSupplierMail?email=' + this.supplierSingleData.email + '&supplierid=' + this.supplier_id + '&content=null&category=emgvp').subscribe(data => {
                        });

                        this.http.post<any>(environment.nodeurl + '/api/email/sendWorkflowTriggeredMail?roleName='+'IMI-SRM Analyst'+'&supplierid=' + this.supplier_id  + '&content=' + 'ifsapprovedemg' + '&category=vpappemg', null).subscribe(data => {
                        });

                        this.issuccess = true;
                        this.isloading = false;
                        this.successmessage = 'Successfully registered the supplier in IFS! ' + ifscode;
                    });
                } else {
                    //  this.isWait = false;
                    this.iserror = true;
                    this.errormessage = 'Something went wrong when pushing the supplier to IFS!';
                    this.isloading = false;

                }
            }
            else {
                //this.isWait = false;

                var supplier = new IfsFailMessageDto();
                supplier.supplierId = String(this.supplierSingleData.supplier_id);
                supplier.supplierName = this.supplierSingleData.emergency_supplier_name;
                supplier.supplierEmail = this.supplierSingleData.email;
                supplier.category = 'Emergency';
                supplier.message = data3["Message"];

                this.http.post<any>(environment.nodeurl + '/api/supplier/saveIFSFailedRecords', supplier).subscribe(async data => {
                    this.iserror = true;
                    this.errormessage = 'Something went wrong:'+supplier.message+', when pushing the supplier to IFS email will sent to the Support team!';
                    this.isloading = false;

                    this.http.post<any>(environment.nodeurl + '/api/email/sendWorkflowTriggeredMail?roleName='+'IMI-SRM Analyst'+'&supplierid=' + this.supplier_id  + '&content=' + supplier.message + '&category=vpappfailemg', null).subscribe(data => {
                    });
                });
            }
        });
        setTimeout(function () {
            // this.issuccess = false;
            this.iserror = false;
            this.isloading = false;
        }.bind(this), 40000);

        if(this.newifscode != 0){
            this.issuccess = true;
            this.successmessage = 'Successfully registered the supplier in IFS! ' + this.newifscode;
        }
    }

    async bindSupplier(supplier) {
        const body = {
            supplier_id: supplier.supplier_id,
            supplier_name: supplier.emergency_supplier_name,
            email: supplier.email,
            supplier_name_arabic: '',
            establishment_year: supplier.establishment_year,
            issued_by: '',
            web_site: '',
            supplier_type: supplier.supplier_type,
            country: supplier.country,
            city: supplier.city,
            other_city: supplier.other_city,

            po_box: supplier.po_box,
            postal_code: supplier.postal_code,
            address_line1: supplier.address_line1,
            address_line2: supplier.address_line2,
            title: supplier.title,
            first_name: supplier.first_name,
            last_name: supplier.last_name,
            telphone_country_code: supplier.telphone_country_code,
            telephone_no: supplier.telephone_no,
            extension: supplier.extension,
            position: supplier.position,
            mobile_country_code: supplier.mobile_country_code,
            mobile_no: supplier.mobile_no,
            fax_country_code: supplier.fax_country_code,
            fax_no: supplier.fax_no,
            additional_material: this.supplier.additional_material,

            cr_no: supplier.cr_no,
            vat_no: supplier.vat_no,
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
            managerialno: this.supplier.managerialno,
            technicalno: this.supplier.technicalno,
            operationsno: this.supplier.operationsno,
            saudiNationalsno: this.supplier.saudiNationalsno,
            totallno: this.supplier.totallno,
            hijriSelected: this.supplier.hijriSelected,

            bankCountryCodes: this.supplier.bankCountryCodes,
            bankName: this.supplier.bankName,
            swiftcode: this.supplier.swiftcode,
            accountHolderName: this.supplier.accountHolderName,
            ibanNo: this.supplier.ibanNo,
            bankAddress: this.supplier.bankAddress,
            accountCurrency: this.supplier.accountCurrency,
            account_number: this.supplier.account_number,
            isEmergencySupplier: 'TRUE',
            supplierCategories: []
        }

        this.ifsSupplier = body;



    }

    // Navigate to Emergency Supplier Page
    route() {
        if (this.from_where == 'i') {
            this.router.navigate(['items/emergency-supplier']);
        }
        else if (this.from_where == 'd') {
            this.router.navigate(['dashboard']);
        }
    }

    approvestatusChange() {
        this.iserror = false;
        this.errormessage = '';
    }

    tabClick(event: MatTabChangeEvent) {
        const tab = event.tab.textLabel;
        console.log(tab);
        if (tab === "Workflow History") {
            this.issuccess = false;
        }
    }
}

// Check future year
export const YearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }
    var currentyear = (new Date()).getFullYear();
    const establishyear = control.parent.get('establishmentYearFormControl');
    if (establishyear.value < (new Date()).getFullYear() || establishyear.value == (new Date()).getFullYear()) {
        return null;
    }
    return { futureyear: true };
}

// Check Past year less than 4 digits
export const YearValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }
    const establishyear = control.parent.get('establishmentYearFormControl');
    if (establishyear.value == "" || ('' + establishyear.value).length > 4 || ('' + establishyear.value).length == 4) {
        return null;
    }
    return { pastyear: true };
}

// Check Zero in the year field 
export const YearValidator3: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }
    const establishyear = control.parent.get('establishmentYearFormControl');
    if (establishyear.value == '0' || establishyear.value == '00' || establishyear.value == '000'
        || establishyear.value == '0000' || establishyear.value == '00000' || establishyear.value == '000000'
        || establishyear.value == '0000000' || establishyear.value == '00000000' || establishyear.value == '000000000'
        || establishyear.value == '0000000000') {
        return { invalidyear: true };
    }
    return null;
}