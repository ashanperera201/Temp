import { Component, ViewEncapsulation, Inject, Optional, ViewChild, OnDestroy, OnInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Directive, Output, Input, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { EmergencySupplier } from 'app/main/Models/EmergencySupplier';
import { Supplier } from 'app/main/Models/Supplier';
import * as moment from 'moment';
import * as $ from 'jquery';
import { truncate } from 'lodash';
import { Workflow } from 'app/main/Models/WorkflowDto';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { EmergencyApprovedItems } from 'app/main/Models/EmergencyApprovedItems';
import { IsExists } from 'app/main/Models/IsExists';
import { ApiService } from '../../../../../../api.service';
import { DeleteDraftSupplier } from 'app/modules/Dto/DeleteDraftSupplier';

@Component({
    selector: 'items-emergency-supplier-new',
    templateUrl: './items-emergency-supplier-new.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ItemsEmergencySupplierNewComponent {

    @ViewChild('emergencySupplierName') emergencySupplierNameField: ElementRef;
    @ViewChild("emergencySupplierEmail") emergencySupplierEmailField: ElementRef;
    @ViewChild("emergencySupplierCrNo") emergencySupplierCrNoField: ElementRef;

    public uploader: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadFiles' });
    public uploaderVat: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadFiles' });
    public uploaderEvi: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadFiles' });

    supplierTypeList: string[] = ['Manufacturer', 'Service Provider', 'Trading House'];
    countryList: String[] = ['Afghanistan ', 'Albania ', 'Algeria ', 'American Samoa ', 'Andorra ', 'Angola ', 'Anguila ', 'Antigua and Barbuda ', 'Argentina ', 'Armenia ', 'Aruba ', 'Australia ', 'Austria ', 'Azerbaijan ', 'Bahamas, The ', 'Bahrain ', 'Bangladesh ', 'Barbados ', 'Belarus ', 'Belgium ', 'Belgium-Luxembourg ', 'Belize ', 'Benin ', 'Bermuda ', 'Bhutan ', 'Bolivia ', 'Bosnia and Herzegovina ', 'Botswana ', 'Br. Antr. Terr ', 'Brazil ', 'British Indian Ocean Ter. ', 'British Virgin Islands ', 'Brunei ', 'Bulgaria ', 'Burkina Faso ', 'Burundi ', 'Cambodia ', 'Cameroon ', 'Canada ', 'Cape Verde ', 'Cayman Islands ', 'Central African Republic ', 'Chad ', 'Chile ', 'China ', 'Christmas Island ', 'Cocos (Keeling) Islands ', 'Colombia ', 'Comoros ', 'Congo, Dem. Rep. ', 'Congo, Rep. ', 'Cook Islands ', 'Costa Rica ', 'Cote dIvoire ', 'Croatia ', 'Cuba ', 'Cyprus ', 'Czech Republic ', 'Czechoslovakia ', 'Denmark ', 'Djibouti ', 'Dominica ', 'Dominican Republic ', 'East Timor ', 'Ecuador ', 'Egypt, Arab Rep. ', 'El Salvador ', 'Equatorial Guinea ', 'Eritrea ', 'Estonia ', 'Ethiopia (excludes Eritrea) ', 'Ethiopia (includes Eritrea) ', 'European Union ', 'Faeroe Islands ', 'Falkland Island ', 'Fiji ', 'Finland ', 'Fm Panama Cz ', 'Fm Rhod Nyas ', 'Fm Tanganyik ', 'Fm Vietnam Dr ', 'Fm Vietnam Rp ', 'Fm Zanz-Pemb ', 'Fr. So. Ant. Tr ', 'France ', 'Free Zones ', 'French Guiana ', 'French Polynesia ', 'Gabon ', 'Gambia, The ', 'Gaza Strip ', 'Georgia ', 'German Democratic Republic ', 'Germany ', 'Ghana ', 'Gibraltar ', 'Greece ', 'Greenland ', 'Grenada ', 'Guadeloupe ', 'Guam ', 'Guatemala ', 'Guinea ', 'Guinea-Bissau ', 'Guyana ', 'Haiti ', 'Holy See ', 'Honduras ', 'Hong Kong, China ', 'Hungary ', 'Iceland ', 'India ', 'Indonesia ', 'Iran, Islamic Rep. ', 'Iraq ', 'Ireland ', 'Israel ', 'Italy ', 'Jamaica ', 'Japan ', 'Jhonston Island ', 'Jordan ', 'Kazakhstan ', 'Kenya ', 'Kiribati ', 'Korea, Dem. Rep. ', 'Korea, Rep. ', 'Kuwait ', 'Kyrgyz Republic ', 'Lao PDR ', 'Latvia ', 'Lebanon ', 'Lesotho ', 'Liberia ', 'Libya ', 'Liechtenstein ', 'Lithuania ', 'Luxembourg ', 'Macao ', 'Macedonia, FYR ', 'Madagascar ', 'Malawi ', 'Malaysia ', 'Maldives ', 'Mali ', 'Malta ', 'Marshall Islands ', 'Martinique ', 'Mauritania ', 'Mauritius ', 'Mexico ', 'Micronesia, Fed. Sts. ', 'Midway Islands ', 'Moldova ', 'Monaco ', 'Mongolia ', 'Montserrat ', 'Morocco ', 'Mozambique ', 'Myanmar ', 'Namibia ', 'Nauru ', 'Nepal ', 'Netherlands ', 'Netherlands Antilles ', 'Neutral Zone ', 'New Caledonia ', 'New Zealand ', 'Nicaragua ', 'Niger ', 'Nigeria ', 'Niue ', 'Norfolk Island ', 'Northern Mariana Islands ', 'Norway ', 'Oman ', 'Pacific Islands ', 'Pakistan ', 'Palau ', 'Panama ', 'Papua New Guinea ', 'Paraguay ', 'Pen Malaysia ', 'Peru ', 'Philippines ', 'Pitcairn ', 'Poland ', 'Portugal ', 'Puerto Rico ', 'Qatar ', 'Reunion ', 'Romania ', 'Russian Federation ', 'Rwanda ', 'Ryukyu Is ', 'Sabah ', 'Saint Helena ', 'Saint Kitts-Nevis-Anguilla-Aru ', 'Saint Pierre and Miquelon ', 'Samoa ', 'San Marino ', 'Sao Tome and Principe ', 'Sarawak ', 'Saudi Arabia ', 'Senegal ', 'Seychelles ', 'Sierra Leone ', 'SIKKIM ', 'Singapore ', 'Slovak Republic ', 'Slovenia ', 'Solomon Islands ', 'Somalia ', 'South Africa ', 'Soviet Union ', 'Spain ', 'Special Categories ', 'Sri Lanka ', 'St. Kitts and Nevis ', 'St. Lucia ', 'St. Vincent and the Grenadines ', 'Sudan ', 'Suriname ', 'Svalbard and Jan Mayen Is ', 'Swaziland ', 'Sweden ', 'Switzerland ', 'Syrian Arab Republic ', 'Taiwan ', 'Tajikistan ', 'Tanzania ', 'Thailand ', 'Togo ', 'Tokelau ', 'Tonga ', 'Trinidad and Tobago ', 'Tunisia '];
    telephoneCodeList: String[] = ['Aaland 358 ', 'Afghanistan 93 ', 'Albania 355 ', 'Algeria 213 ', 'American Samoa 1 684 ', 'Andorra 376 ', 'Angola 244 ', 'Anguilla 1 264 ', 'Antarctica (Australian bases) 6721 ', 'Antigua and Barbuda 1 268 ', 'Argentina 54 ', 'Armenia 374 ', 'Aruba 297 ', 'Ascension 247 ', 'Australia 61 ', 'Austria 43 ', 'Azerbaijan 994 ', 'Bahamas 1 242 ', 'Bahrain 973 ', 'Bangladesh 880 ', 'Barbados 1 246 ', 'Belarus 375 ', 'Belgium 32 ', 'Belize 501 ', 'Benin 229 ', 'Bermuda 1 441 ', 'Bhutan 975 ', 'Bolivia 591 ', 'Bosnia and Herzegovina 387 ', 'Botswana 267 ', 'Brazil 55 ', 'British Indian Ocean Territory 246 ', 'British Virgin Islands 1 284 ', 'Brunei 673 ', 'Bulgaria 359 ', 'Burkina Faso 226 ', 'Burundi 257 ', 'Cambodia 855 ', 'Cameroon 237 ', 'Canada 1 ', 'Cape Verde 238 ', 'Cayman Islands 1 345 ', 'Central African Republic 236 ', 'Chad 235 ', 'Chile 56 ', 'China 86 ', 'Colombia 57 ', 'Comoros 269 ', 'Congo, Democratic Republic of the 243 ', 'Congo, Republic of the 242 ', 'Cook Islands 682 ', 'Costa Rica 506 ', 'Cote dIvoire 225 ', 'Croatia 385 ', 'Cuba 53 ', 'Curaçao 599 ', 'Cyprus 357 ', 'Czech Republic 420 ', 'Denmark 45 ', 'Djibouti 253 ', 'Dominica 1 767 ', 'Dominican Republic 1 809, 1 829, and 1 849 ', 'Ecuador 593 ', 'Egypt 20 ', 'El Salvador 503 ', 'Equatorial Guinea 240 ', 'Eritrea 291 ', 'Estonia 372 ', 'Eswatini 268 ', 'Ethiopia 251 ', 'Falkland Islands 500 ', 'Faroe Islands 298 ', 'Fiji 679 ', 'Finland 358 ', 'France 33 ', 'French Guiana 594 ', 'French Polynesia 689 ', 'Gabon 241 ', 'Gambia 220 ', 'Gaza Strip 970 ', 'Georgia (and parts of breakaway regions Abkhazia as well as South Ossetia) 995 ', 'Germany 49 ', 'Ghana 233 ', 'Gibraltar 350 ', 'Greece 30 ', 'Greenland 299 ', 'Grenada 1 473 ', 'Guadeloupe 590 ', 'Guam 1 671 ', 'Guatemala 502 ', 'Guinea 224 ', 'Guinea-Bissau 245 ', 'Guyana 592 ', 'Haiti 509 ', 'Honduras 504 ', 'Hong Kong 852 ', 'Hungary 36 ', 'Iceland 354 ', 'India 91 ', 'Indonesia 62 ', 'Iraq 964 ', 'Iran 98 ', 'Ireland (Eire) 353 ', 'Israel 972 ', 'Italy 39 ', 'Jamaica 1 876, 1 658 ', 'Japan 81 ', 'Jordan 962 ', 'Kazakhstan 7 ', 'Kenya 254 ', 'Kiribati 686 ', 'Kosovo 383 ', 'Kuwait 965 ', 'Kyrgyzstan 996 ', 'Laos 856 ', 'Latvia 371 ', 'Lebanon 961 ', 'Lesotho 266 ', 'Liberia 231 ', 'Libya 218 ', 'Liechtenstein 423 ', 'Lithuania 370 ', 'Luxembourg 352 ', 'Macau 853 ', 'Madagascar 261 ', 'Malawi 265 ', 'Malaysia 60 ', 'Maldives 960 ', 'Mali 223 ', 'Malta 356 ', 'Marshall Islands 692 ', 'Martinique 596 ', 'Mauritania 222 ', 'Mauritius 230 ', 'Mayotte 262 ', 'Mexico 52 ', 'Micronesia, Federated States of 691 ', 'Moldova (plus breakaway Pridnestrovie) 373 ', 'Monaco 377 ', 'Mongolia 976 ', 'Montenegro 382 ', 'Montserrat 1 664 ', 'Morocco 212 ', 'Mozambique 258 ', 'Myanmar 95 ', 'Namibia 264 ', 'Nauru 674 ', 'Netherlands 31 ', 'Netherlands Antilles 599 ', 'Nepal 977 ', 'New Caledonia 687 ', 'New Zealand 64 ', 'Nicaragua 505 ', 'Niger 227 ', 'Nigeria 234 ', 'Niue 683 ', 'Norfolk Island 6723 ', 'North Korea 850 ', 'North Macedonia 389 ', 'Northern Ireland 44 28 ', 'Northern Mariana Islands 1 670 ', 'Norway 47 ', 'Oman 968 ', 'Pakistan 92 ', 'Palau 680 ', 'Panama 507 ', 'Papua New Guinea 675 ', 'Paraguay 595 ', 'Peru 51 ', 'Philippines 63 ', 'Poland 48 ', 'Portugal 351 ', 'Puerto Rico 1 787 and 1 939 ', 'Qatar 974 ', 'Reunion 262 ', 'Romania 40 ', 'Russia 7 ', 'Rwanda 250 ', 'Saint-Barthélemy 590 ', 'Saint Helena and Tristan da Cunha 290 ', 'Saint Kitts and Nevis 1 869 ', 'Saint Lucia 1 758 ', 'Saint Martin (French side) 590 ', 'Saint Pierre and Miquelon 508 ', 'Saint Vincent and the Grenadines 1 784 ', 'Samoa 685 ', 'San Marino 378', 'Sao Tome and Principe 239 ', 'Saudi Arabia 966 ', 'Senegal 221 ', 'Serbia 381 ', 'Seychelles 248 ', 'Sierra Leone 232 ', 'Sint Maarten (Dutch side) 1 721 ', 'Singapore 65 ', 'Slovakia 421 ', 'Slovenia 386 ', 'Solomon Islands 677 ', 'Somalia 252 ', 'South Africa 27 ', 'South Korea 82 ', 'South Sudan 211 ', 'Spain 34 ', 'Sri Lanka 94 ', 'Sudan 249 ', 'Suriname 597 ', 'Sweden 46 ', 'Switzerland 41 ', 'Syria 963 ', 'Taiwan 886 ', 'Tajikistan 992 ', 'Tanzania 255 ', 'Thailand 66 ', 'Timor-Leste 670 ', 'Togo 228 ', 'Tokelau 690 ', 'Tonga 676 ', 'Trinidad and Tobago 1 868 ', 'Tunisia 216 ', 'Turkey 90 ', 'Turkmenistan 993 ', 'Turks and Caicos Islands 1 649 ', 'Tuvalu 688 ', 'Uganda 256 ', 'Ukraine 380 ', 'United Arab Emirates 971 ', 'United Kingdom 44 ', 'United States of America 1 ', 'Uruguay 598 ', 'Uzbekistan 998 ', 'Vanuatu 678 ', 'Venezuela 58 ', 'Vietnam 84 ', 'U.S. Virgin Islands 1 340 ', 'Wallis and Futuna 681 ', 'West Bank 970 ', 'Yemen 967 ', 'Zambia 260 ', 'Zimbabwe 263'];
    cityList: any = [];
    cityListOriginal: any = [];
    titleList: string[] = ['Miss', 'Mr', 'Mrs'];

    emergencySupplier = new EmergencySupplier();
    apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');

    supplierId = 5;
    supplierCode = '';
    createdDate = '';
    supplierName = '';
    supplierStatus = '';
    processid = '';

    action: string;
    local_data: any;

    allData: any;

    supplier_id: number = 0;
    istemp: boolean = true;
    isnameexists: boolean = false;
    isemailexists: boolean = false;
    iscrnoexists: boolean = false;
    supplier = new Supplier();
    istempsave: boolean = false;

    registerForm: FormGroup;
    selectedCountry: any;
    selectedCountryCode: any;
    iscitydisable = true;
    kingdom: string;
    showChecked: boolean = false;
    minDate = moment().add('days', 0).format('YYYY-MM-DD');

    passedDate: boolean = false;
    emptyFileEvidence: boolean = false;
    evidenceFile: any;
    evidenceFileAttached: any;

    emptyFileRegistration: boolean = false;
    registrationFile: any;
    registrationFile_error_check: boolean = false;
    evidance_error_check: boolean = false;
    vatfile_error_check: boolean = false;
    registrationFileAttached: any;

    emptyFileVat: boolean = false;
    vatFile: any;
    vatFileAttached: any;

    supplier_ID: number = 0;

    userName: string;
    userEmail: string;
    userRole: string;
    userfullname: string;
    submit_disable: boolean;
    UnSupportFormat: boolean = false;
    UnSupportFormatEvi: boolean = false;
    UnSupportFormatReg: boolean = false;
    UnSupportFormatVat: boolean = false;
    supplierCreated: boolean = false;

    yesNoList: string[] = ['Yes', 'No'];
    selectedDisclosureValue = null;

    panelOpenState = false;
    formFieldHelpers: string[] = [''];
    isloading: boolean = false;
    title_: any;
    issuccess: boolean = false;
    fileName_Reg: string;
    fileName_Vat: string;
    fileName_Evi: string;

    all_uploaded: boolean = false;
    all_uploaded_Reg: boolean = false;
    all_uploaded_Vat: boolean = false;
    all_uploaded_Evi: boolean = false;

    registration_file_size: boolean = false;
    vat_file_size: boolean = false;
    evidance_file_size: boolean = false;
    othercity_check: boolean = false;
    selectedFiles: File[];
    counting: number = 0;
    selectedFilesName: any = [];

    constructor(private http: HttpClient, private _formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
        private api: ApiService, private router: Router) {
        this.title_ = "Mr";
        this.loadCurrentUserData();

        this.registerForm = this._formBuilder.group({
            supplierNameFormControl: ['', Validators.required],
            supplierTypeFormControl: ['', Validators.required],
            establishmentYearFormControl: ['', [YearValidator, YearValidator2, YearValidator3]],
            countryFormControl: ['', Validators.required],
            cityFormControl: ['', Validators.required],
            otherCityFormControl: [''],
            address1FormControl: [''],
            address2FormControl: [''],
            postalCodeFormControl: [''],
            poBoxFormControl: [''],
            titleFormControl: ['', Validators.required],
            firstNameFormControl: ['', Validators.required],
            lastNameFormControl: ['', Validators.required],
            positionFormControl: ['', Validators.required],
            telephoneCodeFormControl: [''],
            telephoneNumberFormControl: [''],
            extFormControl: [''],
            emailFormControl: ['', [Validators.required]],
            mobileCodeFormControl: ['', [Validators.required]],
            mobileNumberFormControl: ['', [Validators.required]],
            faxCodeFormControl: [''],
            faxNumberFormControl: [''],
            registrationNumberFormControl: ['', [Validators.required]],
            registrationDateFormControl: ['', [Validators.required]],
            justificationFormControl: ['', [Validators.required]],
            srmRemarkFormControl: ['', [Validators.required]],
            vatFormControl: ['', [Validators.required]],
            requiredfileEvidence: [undefined, [Validators.required]],
            requiredfileRegistration: [undefined, [Validators.required]],
            requiredfileVat: [undefined, [Validators.required]]
        });

        this.registerForm.get('otherCityFormControl').disable();
    }

    ngOnInit(): void {
        
        if (JSON.parse(localStorage.getItem("masterdata"))) {
            this.getMasterData1();
          }else{
            this.getMasterData();
          }

        let emergencySupplier_id = this.activatedRoute.snapshot.params.id;
        if (emergencySupplier_id) {
            this.emergencySupplier.supplier_id = emergencySupplier_id;
            this.http.get(environment.nodeurl + '/api/supplier/emergency?suplierId=' + emergencySupplier_id).subscribe(data => {
                if (data) {
                    // this.setValues(data);
                }
            },
                error => console.log('Supplier Already Registered. Please start new!', '', 'success')
            )
        }

    }

    // Load country and city lists
    public getMasterData() {
        this.http.get(environment.nodeurl + '/api/template/masterdata').subscribe(data2 => {
            debugger
            console.log('data2 ' + data2)
            if (data2) {
                localStorage.setItem("categoryLimit", data2["categoryLimit"]);
                this.countryList = [];
                this.countryList = data2["countryList"].map(x => x.description);

                this.cityList = [];
                this.cityListOriginal = data2["cityList"];
            }
        });
    }

    public getMasterData1() {
        const data2 = JSON.parse(localStorage.getItem("masterdata"));
            debugger
            console.log('data2 ' + data2)
            if (data2) {
                localStorage.setItem("categoryLimit", data2["categoryLimit"]);
                this.countryList = [];
                this.countryList = data2["countryList"].map(x => x.description);

                this.cityList = [];
                this.cityListOriginal = data2["cityList"];
            }
    }

    // Load Current user related data
    loadCurrentUserData() {
        this.userRole = localStorage.getItem("userrole");
        this.userEmail = localStorage.getItem("useremail");
        this.userName = localStorage.getItem("username");
        this.userfullname = localStorage.getItem("userfullname");
    }

    // Select country
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
            this.showChecked = true;
        }
        else {
            this.kingdom = '2';
            this.showChecked = false;
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

    // Atuomatically select the telephone, faxe and mobile code base on country
    selectTelephoneCode() {
        for (var i = 0; i < this.telephoneCodeList.length; i++) {
            var telephoneCode = this.telephoneCodeList[i];
            var str = telephoneCode.toUpperCase();
            if (str.includes(this.selectedCountry)) {
                return this.selectedCountry = telephoneCode;
            }
            // else{
            //     return this.selectedCountryCode = null;
            // }
        }
    }

    // Validate Form values
    checkValue(): boolean {
        var cityFormControl = this.registerForm.value.cityFormControl;
        var othercityFormControl = this.registerForm.value.otherCityFormControl;
        var countryFormControl = this.registerForm.value.countryFormControl;
        var emailFormControl = this.registerForm.value.emailFormControl;
        var firstNameFormControl = this.registerForm.value.firstNameFormControl;
        var justificationFormControl = this.registerForm.value.justificationFormControl;
        var srmRemarkFormControl = this.registerForm.value.srmRemarkFormControl;
        var lastNameFormControl = this.registerForm.value.lastNameFormControl;
        var mobileCodeFormControl = this.registerForm.value.mobileCodeFormControl;
        var mobileNumberFormControl = this.registerForm.value.mobileNumberFormControl;
        var positionFormControl = this.registerForm.value.positionFormControl;
        var registrationDateFormControl = this.registerForm.value.registrationDateFormControl._isValid; //true or false
        var registrationNumberFormControl = this.registerForm.value.registrationNumberFormControl;
        var vatFormControl = this.registerForm.value.vatFormControl;
        var requiredfileRegistration = this.registerForm.value.requiredfileRegistration;  // not null
        var requiredfileEvidence = this.registerForm.value.requiredfileEvidence;  // not null
        var requiredfileVat = this.registerForm.value.requiredfileVat;  // not null
        var supplierTypeFormControl = this.registerForm.value.supplierTypeFormControl;
        var titleFormControl = this.registerForm.value.titleFormControl;
        var registrationFileCheck = this.uploader.queue.length;

        if (registrationFileCheck == 0) {
            this.registrationFile_error_check = true;
        }
        if (requiredfileEvidence == 0 || requiredfileEvidence == null) {
            this.evidance_error_check = true;
        }
        if (countryFormControl == 'SAUDI ARABIA' && (requiredfileVat == 0 || requiredfileVat == null)) {
            this.vatfile_error_check = true;
        }
        if (cityFormControl == "Other" && othercityFormControl == "") {
            this.othercity_check = true;
        }
        if (cityFormControl == "Other" && othercityFormControl != "") {
            this.othercity_check = false;
        }

        if (cityFormControl != '' && countryFormControl != '' && emailFormControl != '' && registrationDateFormControl != undefined && this.othercity_check == false &&
            firstNameFormControl != '' && justificationFormControl != '' && srmRemarkFormControl != '' && lastNameFormControl != '' && mobileCodeFormControl != '' && mobileNumberFormControl != '' &&
            positionFormControl != '' && registrationDateFormControl != false && registrationNumberFormControl != '' && requiredfileRegistration != null &&
            supplierTypeFormControl != '' && titleFormControl != '' &&
            requiredfileEvidence != null && mobileCodeFormControl != undefined && registrationFileCheck != 0) {

            if (countryFormControl == 'SAUDI ARABIA' && vatFormControl != '') {
                return true;
            } else if (countryFormControl != 'SAUDI ARABIA' && vatFormControl == '') {
                return true;
            } else {
                return false;
            }
        }
        else {
            return false
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
                // var filesize = oldFileItem.file.size;
                // if (filesize < 5000000) 
                if (this.UnSupportFormatEvi == false && type == 'Evi') {
                    const oldFileItem: FileItem = this.uploaderEvi.queue[length - 1];
                    var newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
                    const newFile: File = new File([this.uploaderEvi.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploaderEvi, newFile, null);
                    this.uploaderEvi.queue[length - 1] = newFileItem;
                    this.evidance_error_check = false;
                }
                if (this.UnSupportFormatReg == false && type == 'Reg') {
                    const oldFileItem: FileItem = this.uploader.queue[length - 1];
                    var newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
                    const newFile: File = new File([this.uploader.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploader, newFile, null);
                    this.uploader.queue[length - 1] = newFileItem;
                    this.registrationFile_error_check = false;
                }
                if (this.UnSupportFormatVat == false && type == 'Vat') {
                    const oldFileItem: FileItem = this.uploaderVat.queue[length - 1];
                    var newFilename = '_' + category + '.' + oldFileItem.file.name.split('.')[1];
                    const newFile: File = new File([this.uploaderVat.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                    const newFileItem = new FileItem(this.uploaderVat, newFile, null);
                    this.uploaderVat.queue[length - 1] = newFileItem;
                    this.vatfile_error_check = false;
                }
            }
        }
    }

    onAttachment2(files: FileList, categoryname: string) {
        if (this.counting == 0) {
            this.selectedFiles = [];
        }
        for (let i = 0; i < files.length; i++) {
            var filetypeposition = files[i].name.split('.').length-1;
            var newFilenameFormat = files[i].name.split('.')[filetypeposition];
            var newFilename = '_' + categoryname + '.' + newFilenameFormat;

            if (files && files[i]) {
                let type = categoryname;
                var length = 0;
                //this.fileType = files[i].name.split('.')[1];
    
                if (type == 'Evi') {
                    length = files.length;
                    // this.fileName_Evi = oldFileItem.file.name;
                    this.fileName_Evi = files[i].name;
                    // newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
                }
                if (type == 'Vat') {
                    length = files.length;
                    // this.fileName_Vat = oldFileItem.file.name;
                    this.fileName_Vat = files[i].name;
                    // newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
                }
                if (type == 'Reg') {
                    length = files.length;
                    // this.fileName_Reg = oldFileItem.file.name;
                    this.fileName_Reg = files[i].name;
                    // newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
                }
    
                if (newFilenameFormat.includes('jpg') || newFilenameFormat.includes('jpeg') || newFilenameFormat.includes('pdf') ||
                    newFilenameFormat.includes('png') || newFilenameFormat.includes('txt') || newFilenameFormat.includes('text') ||
                    newFilenameFormat.includes('tex') || newFilenameFormat.includes('doc') || newFilenameFormat.includes('docx') ||
                    newFilenameFormat.includes('xpd') || newFilenameFormat.includes('rtf') || newFilenameFormat.includes('ods') ||
                    newFilenameFormat.includes('csv') || newFilenameFormat.includes('odt') || newFilenameFormat.includes('xlsx') ||
                    newFilenameFormat.includes('xlsm') || newFilenameFormat.includes('xls') || newFilenameFormat.includes('xml') ||
                    newFilenameFormat.includes('svg') || newFilenameFormat.includes('tif') || newFilenameFormat.includes('tiff') ||
                    newFilenameFormat.includes('gif') || newFilenameFormat.includes('bmp') || newFilenameFormat.includes('xhtml') ||
                    newFilenameFormat.includes('html') || newFilenameFormat.includes('key') || newFilenameFormat.includes('odp') ||
                    newFilenameFormat.includes('pptx') || newFilenameFormat.includes('ppt') || newFilenameFormat.includes('JPG')
                    || newFilenameFormat.includes('JPEG') || newFilenameFormat.includes('PDF') ||
                    newFilenameFormat.includes('PNG') || newFilenameFormat.includes('TXT') || newFilenameFormat.includes('TEXT') ||
                    newFilenameFormat.includes('TEX') || newFilenameFormat.includes('DOC') || newFilenameFormat.includes('DOCX') ||
                    newFilenameFormat.includes('XPD') || newFilenameFormat.includes('RTF') || newFilenameFormat.includes('ODS') ||
                    newFilenameFormat.includes('CSV') || newFilenameFormat.includes('ODT') || newFilenameFormat.includes('XLSX') ||
                    newFilenameFormat.includes('XLSM') || newFilenameFormat.includes('XLS') || newFilenameFormat.includes('XML') ||
                    newFilenameFormat.includes('SVG') || newFilenameFormat.includes('TIF') || newFilenameFormat.includes('TIFF') ||
                    newFilenameFormat.includes('GIF') || newFilenameFormat.includes('BMP') || newFilenameFormat.includes('XHTML') ||
                    newFilenameFormat.includes('HTML') || newFilenameFormat.includes('KEY') || newFilenameFormat.includes('ODP') ||
                    newFilenameFormat.includes('PPTX') || newFilenameFormat.includes('PPT')) {
    
                    if (type == 'Evi') {
                        this.UnSupportFormatEvi = false;
                        let file = files[i];
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
                        let file = files[i];
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
                        let file = files[i];
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
                else if (!newFilenameFormat.includes('jpg') || !newFilenameFormat.includes('jpeg') || !newFilenameFormat.includes('pdf') ||
                    !newFilenameFormat.includes('png') || !newFilenameFormat.includes('txt') || !newFilenameFormat.includes('text') ||
                    !newFilenameFormat.includes('tex') || !newFilenameFormat.includes('doc') || !newFilenameFormat.includes('docx') ||
                    !newFilenameFormat.includes('xpd') || !newFilenameFormat.includes('rtf') || !newFilenameFormat.includes('ods') ||
                    !newFilenameFormat.includes('csv') || !newFilenameFormat.includes('odt') || !newFilenameFormat.includes('xlsx') ||
                    !newFilenameFormat.includes('xlsm') || !newFilenameFormat.includes('xls') || !newFilenameFormat.includes('xml') ||
                    !newFilenameFormat.includes('svg') || !newFilenameFormat.includes('tif') || !newFilenameFormat.includes('tiff') ||
                    !newFilenameFormat.includes('gif') || !newFilenameFormat.includes('bmp') || !newFilenameFormat.includes('xhtml') ||
                    !newFilenameFormat.includes('html') || !newFilenameFormat.includes('key') || !newFilenameFormat.includes('odp') ||
                    !newFilenameFormat.includes('pptx') || !newFilenameFormat.includes('ppt') || !newFilenameFormat.includes('JPG') ||
                    !newFilenameFormat.includes('JPEG') || !newFilenameFormat.includes('PDF') ||
                    !newFilenameFormat.includes('PNG') || !newFilenameFormat.includes('TXT') || !newFilenameFormat.includes('TEXT') ||
                    !newFilenameFormat.includes('TEX') || !newFilenameFormat.includes('DOC') || !newFilenameFormat.includes('DOCX') ||
                    !newFilenameFormat.includes('XPD') || !newFilenameFormat.includes('RTF') || !newFilenameFormat.includes('ODS') ||
                    !newFilenameFormat.includes('CSV') || !newFilenameFormat.includes('ODT') || !newFilenameFormat.includes('XLSX') ||
                    !newFilenameFormat.includes('XLSM') || !newFilenameFormat.includes('XLS') || !newFilenameFormat.includes('XML') ||
                    !newFilenameFormat.includes('SVG') || !newFilenameFormat.includes('TIF') || !newFilenameFormat.includes('TIFF') ||
                    !newFilenameFormat.includes('GIF') || !newFilenameFormat.includes('BMP') || !newFilenameFormat.includes('XHTML') ||
                    !newFilenameFormat.includes('HTML') || !newFilenameFormat.includes('KEY') || !newFilenameFormat.includes('ODP') ||
                    !newFilenameFormat.includes('PPTX') || !newFilenameFormat.includes('PPT')) {
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
                    // var filesize = oldFileItem.file.size;
                    // if (filesize < 5000000) 
                    if (this.UnSupportFormatEvi == false && type == 'Evi') {
                        // const oldFileItem: FileItem = this.uploaderEvi.queue[length - 1];
                        // var newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
                        // const newFile: File = new File([this.uploaderEvi.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                        // const newFileItem = new FileItem(this.uploaderEvi, newFile, null);
                        // this.uploaderEvi.queue[length - 1] = newFileItem;
                        this.evidance_error_check = false;
                    }
                    if (this.UnSupportFormatReg == false && type == 'Reg') {
                        // const oldFileItem: FileItem = this.uploader.queue[length - 1];
                        // var newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
                        // const newFile: File = new File([this.uploader.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                        // const newFileItem = new FileItem(this.uploader, newFile, null);
                        // this.uploader.queue[length - 1] = newFileItem;
                        this.registrationFile_error_check = false;
                    }
                    if (this.UnSupportFormatVat == false && type == 'Vat') {
                        // const oldFileItem: FileItem = this.uploaderVat.queue[length - 1];
                        // var newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
                        // const newFile: File = new File([this.uploaderVat.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
                        // const newFileItem = new FileItem(this.uploaderVat, newFile, null);
                        // this.uploaderVat.queue[length - 1] = newFileItem;
                        this.vatfile_error_check = false;
                    }
                }
            }    
            this.selectedFilesName.push(newFilename);
            this.selectedFiles.push(files[i]);
        }
        this.counting++;
    }

    // Create an emergency Supplier
    async createEmergencySupplier() {
        const check = this.checkValue();

        var CreatedDate = new Date().toISOString();
        var CreatedTime = new Date().toTimeString();
        var date_time_split = CreatedDate.split("T");
        var date = date_time_split[0];

        var time_split = CreatedTime.split(" ");
        var time = time_split[0] + "." + new Date().getMilliseconds();

        if ((check && this.UnSupportFormatReg == false && this.UnSupportFormatEvi == false) ||
            (check && this.UnSupportFormatReg == false && this.UnSupportFormatEvi == false)) {
            this.isloading = true;
            var emergency: EmergencySupplier = new EmergencySupplier();
            emergency.supplier_id = 0;
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
            emergency.invite_by = this.userName;
            emergency.invite_by_email = this.userEmail;
            emergency.invite_by_role = this.userRole;
            emergency.vat_no = this.registerForm.value.vatFormControl ? this.registerForm.value.vatFormControl : '';

            // this.issuccess = true;
            this.http.post<any>(environment.nodeurl + '/api/supplier/emergency', emergency).subscribe(async data => {

                if (data && data > 0) {

                    this.submit_disable = true;
                    this.supplier_ID = data;

                    var deleteSupplier: DeleteDraftSupplier = new DeleteDraftSupplier();
                    deleteSupplier.supplier_name = this.registerForm.value.supplierNameFormControl.trim();
                    deleteSupplier.supplier_email = this.registerForm.value.emailFormControl.trim();
                    deleteSupplier.cr_no = this.registerForm.value.registrationNumberFormControl.trim();
                    deleteSupplier.type = "emg";

                    this.http.post<any>(environment.nodeurl + '/api/supplier/deletedraftsupplier', deleteSupplier).subscribe(async data2 => {
                        if (data2 == true) {
                            console.log("deletion success");
                            
                            if (this.supplier_ID != 0) {
                                this.all_uploaded = true;
                                
                                if (this.all_uploaded) {
                                    const accessTokenBody = {
                                        userNameOrEmailAddress: this.userEmail != '' ? this.userEmail : "admin",
                                        password: "123qwe",
                                        rememberClient: true
                                    }
                                    this.http.post<any>(environment.workflowApiUrl + '/api/TokenAuth/Authenticate', accessTokenBody).subscribe(data => {
                                        var workflowToken = data["result"].accessToken;
                                        localStorage.setItem('apiTokenworkflow', workflowToken);
                                        this.apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');
                                        this.supplierworkflowInit(this.supplier_ID);
                                    });
                                }
                            }
                        }
                    });

                    // if (this.supplier_ID != 0) {
                    //     if (this.uploader.queue.length != 0) { // && count == 0) {
                    //         this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
                    //             form.append('supplierid', this.supplier_ID);
                    //             fileItem.url = environment.nodeurl + '/api/file/uploadFiles';
                    //         };
                    //         this.uploader.uploadAll();
                    //         this.all_uploaded_Reg = true;
                    //         // count = 1;
                    //     }
                    //     if (this.uploaderEvi.queue.length != 0) { // && count == 1) {
                    //         this.uploaderEvi.onBuildItemForm = (fileItem: any, form: any) => {
                    //             form.append('supplierid', this.supplier_ID);
                    //             fileItem.url = environment.nodeurl + '/api/file/uploadFiles';
                    //         };
                    //         this.uploaderEvi.uploadAll();
                    //         this.all_uploaded_Evi = true;
                    //         // count = 2;
                    //     }
                    //     if (this.uploaderVat.queue.length != 0 /* && count == 2 */ && this.kingdom == '1') {
                    //         this.uploaderVat.onBuildItemForm = (fileItem: any, form: any) => {
                    //             form.append('supplierid', this.supplier_ID);
                    //             fileItem.url = environment.nodeurl + '/api/file/uploadFiles';
                    //         };
                    //         this.uploaderVat.uploadAll();
                    //         this.all_uploaded_Vat = true;
                    //         // count = 3;
                    //     }
                    //     if ((this.all_uploaded_Reg && this.all_uploaded_Evi /* && count == 2 */) || (this.all_uploaded_Reg && this.all_uploaded_Evi && this.all_uploaded_Vat)) {
                    //         this.all_uploaded = true;
                    //     }
                    //     if (this.all_uploaded) {
                    //         const accessTokenBody = {
                    //             userNameOrEmailAddress: this.userEmail != '' ? this.userEmail : "admin",
                    //             password: "123qwe",
                    //             rememberClient: true
                    //         }
                    //         this.http.post<any>(environment.workflowApiUrl + '/api/TokenAuth/Authenticate', accessTokenBody).subscribe(data => {
                    //             var workflowToken = data["result"].accessToken;
                    //             localStorage.setItem('apiTokenworkflow', workflowToken);
                    //             this.apiTokenworkflow = 'Bearer ' + localStorage.getItem('apiTokenworkflow');
                    //             this.supplierworkflowInit(this.supplier_ID);
                    //         });
                    //     }
                    // }
                }
            });
        }
        else {
            this.registerForm.markAllAsTouched();
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    supplierworkflowInit(supplierid) {
        var scheme = 'Emergency Approval';

        const documentbody =
        {
            "title": 'IMI-ES-' + this.supplier_ID,
            "description": this.registerForm.value.supplierNameFormControl,
            "creationTime": "2020-12-18T08:51:29.332Z",
            "state": "start",
            "scheme": scheme
        }

        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': this.apiTokenworkflow
        });
        let options = { headers: headers };

        this.http.post(environment.workflowApiUrl + '/api/services/app/Document/Create', documentbody, options).subscribe(data => {

            // this.dialogRef.close();

            var documentid = data["result"].id;
            var processid = data["result"].processId;
            this.processid = processid;

            var workflow = new Workflow();
            workflow.SUPPLIER_ID = this.supplier_ID;
            workflow.PROCESSID = processid;
            workflow.DOCID = documentid;
            this.http.post<any>(environment.nodeurl + '/api/supplier/emergencyupdateworkflow', workflow).subscribe(data => {
                console.log("Successfully saved workflow id!");

                var history = new EmergencyApprovedItems();
                history.SupplierId = this.supplier_ID;
                history.Status = 'New';
                history.CURRENT_POSITION = this.userRole,
                    history.DUE_DATE = new Date(),
                    history.HANDLE_BEFORE = new Date(),
                    history.HANDLE_DATE = new Date(),
                    history.OUTCOME = new Date(),
                    history.OUTCOME_REASON = '',
                    history.USERID = this.userRole,
                    history.USERROLE = this.userfullname,
                    history.Action_Command = ''
                this.api.saveEmergHistory(history);

                if (this.userRole == 'IMI-SRM Analyst') {
                    this.executeworkflowcommand("Approve");
                    // Create Emergency Email Pdf
                    this.http.post<any>(environment.nodeurl + '/api/email/generateEmergencySupplierPdf?supplierid=' + supplierid, null).subscribe(
                        (data: any) => {
                            console.log(data)
                        }
                    );

                } else {
                    const suppliercompstatus = {
                        supplier_id: this.supplier_ID, //EMERGENCY_SUPPLIER_ID,
                        status: "Awaiting for SRM Recommendation"
                    }


                    this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(data3 => {
                        var history = new EmergencyApprovedItems();
                        history.SupplierId = this.supplier_ID;
                        history.Status = 'Awaiting for SRM Recommendation';
                        history.CURRENT_POSITION = this.userRole,
                            history.DUE_DATE = new Date(),
                            history.HANDLE_BEFORE = new Date(),
                            history.HANDLE_DATE = new Date(),
                            history.OUTCOME = new Date(),
                            history.OUTCOME_REASON = '',
                            history.USERID = this.userRole,
                            history.USERROLE = this.userfullname,
                            history.Action_Command = ''
                        this.api.saveEmergHistory(history);
                    });

                    this.isloading = false;

                    // setTimeout(() => {
                    //   location.replace("/supplier/emergencySupplier");
                    // }, 300);
                }

            })
            console.log('Here is the API data');
            console.log(data);
        }, (err) => {
            if (err === 'Unauthorized') {
                var res = err;
            }
        })
    }

    executeworkflowcommand(command) {
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
            .subscribe(data => {

                const suppliercompstatus = {
                    supplier_id: this.supplier_ID, //EMERGENCY_SUPPLIER_ID,
                    status: "Awaiting for GM approval"
                }


                this.http.post<any>(environment.nodeurl + '/api/supplier/emergencystatus', suppliercompstatus).subscribe(async data3 => {
                    var history = new EmergencyApprovedItems();
                    history.SupplierId = this.supplier_ID;
                    history.Status = 'Awaiting for GM approval';
                    history.CURRENT_POSITION = this.userRole,
                        history.DUE_DATE = new Date(),
                        history.HANDLE_BEFORE = new Date(),
                        history.HANDLE_DATE = new Date(),
                        history.OUTCOME = new Date(),
                        history.OUTCOME_REASON = '',
                        history.USERID = this.userRole,
                        history.USERROLE = this.userfullname,
                        history.Action_Command = ''
                    this.api.saveEmergHistory(history);

                    if (this.all_uploaded) {

                        // await this.sleep(40000);

                        this.issuccess = true;

                        const formData = new FormData();
                        if (this.selectedFiles && this.selectedFiles.length > 0) {

                            this.selectedFiles.forEach((f, index) => { 
                                formData.append('certificates', f, ""+ this.selectedFilesName[index]);
                                formData.append('supplierid', this.supplier_ID.toString());
                                formData.append('email', this.registerForm.value.emailFormControl.trim());
                                formData.append('processid', this.processid);
                            });
                        }

                        this.http.post<any>(environment.nodeurl + '/api/file/UploadFileQueueEmergency',formData).subscribe(data => {
                            var responseonqueue = data;
                        });

                        // this.http.post<any>(environment.nodeurl + '/api/email/sendEmgworkflowmail?roleName=IMI-GM&supplierid=' + this.supplier_ID + '&content=' + this.processid + '&category=emggmattachement', null).subscribe(data => {
                        // });
                        this.isloading = false;
                        this.issuccess = true;
                        console.log("Emergency Supplier Has Been Submitted Sucessfully");
                    }
                });
            })
    }

    // Validation for name, email and cr_no
    onKeySearch(event: any, cat: string) {
        if (this.supplier_ID == 0) {
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
        else if (this.supplier_ID > 0 && cat == 'E') {
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
        else if (this.supplier_ID > 0 && cat == 'N') {
            if (this.supplier.supplier_name != this.registerForm.getRawValue().supplierNameFormControl) {
                this.executeListing(event.target.value, cat);
            } else {
                this.registerForm.get('supplierNameFormControl').markAsUntouched();
            }
        }
        else if (this.supplier_ID > 0 && cat == 'R') {
            if (this.supplier.cr_no != this.registerForm.getRawValue().registrationNumberFormControl.value) {
                this.executeListing(event.target.value, cat);
            } else {
                this.registerForm.get('registrationNumberFormControl').markAsUntouched();
            }
        }

        if (this.registerForm.value.supplierNameFormControl != '' && this.registerForm.value.emailFormControl != '' && this.registerForm.value.registrationNumberFormControl != '' &&
            (this.registerForm.controls.emailFormControl.status != 'INVALID' && this.registerForm.controls.supplierNameFormControl.status != 'INVALID' && this.registerForm.controls.registrationNumberFormControl.status != 'INVALID')) {

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

        if (this.supplierCreated == false) {
            if (value != '' && !(value == 'sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'nadun.ruchiranga@xitricon.com' || value == 'evon.reginold@xitricon.com'
                || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com')) {
                var isExist: IsExists = new IsExists();
                isExist.value = value;
                isExist.category = category;

                this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {

                    if (data != null && data['status'] != 'Rejected' && data['status'] != 'Draft') {
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

    }

    // Check date is a past date
    changeDate() {
        var selectedDate = new Date(this.registerForm.value.registrationDateFormControl);
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if (selectedDate < now) {
            console.log("Selected date is in the past");
            this.passedDate = true
        } else {
            console.log("Selected date is NOT in the past");
            this.passedDate = false;
        }
    }

    // Remove attachment error message
    removeAttachment(type) {
        if (type == "Reg") {
            if (this.uploader.queue.length > 0) { this.uploader.queue[0].remove(); this.registerForm.patchValue({ 'requiredfileRegistration': null }); } // if (this.uploader.queue.length > 0) { this.uploader.queue[0].remove(); this.registrationFile_error_check = true; this.registerForm.patchValue({ 'requiredfileRegistration': null });}
            if (this.emptyFileRegistration == true) { this.emptyFileRegistration = false; }
            if (this.UnSupportFormatReg == true) { this.UnSupportFormatReg = false; }
        }
        if (type == "Evi") {
            if (this.uploaderEvi.queue.length > 0) { this.uploaderEvi.queue[0].remove(); this.registerForm.patchValue({ 'requiredfileEvidence': null }); } // if (this.uploaderEvi.queue.length > 0) { this.uploaderEvi.queue[0].remove(); this.evidance_error_check = true;this.registerForm.patchValue({ 'requiredfileEvidence': null });}
            if (this.emptyFileEvidence == true) { this.emptyFileEvidence = false; }
            if (this.UnSupportFormatEvi == true) { this.UnSupportFormatEvi = false; }
        }
        if (type == "Vat") {
            if (this.uploaderVat.queue.length > 0) { this.uploaderVat.queue[0].remove(); this.registerForm.patchValue({ 'requiredfileVat': null }); } // if (this.uploaderVat.queue.length > 0) { this.uploaderVat.queue[0].remove(); this.vatfile_error_check = true;this.registerForm.patchValue({ 'requiredfileVat': null });}
            if (this.emptyFileVat == true) { this.emptyFileVat = false; }
            if (this.UnSupportFormatVat == true) { this.UnSupportFormatVat = false; }
        }
    }

    // Reset Form
    resetForm() {
        this.registerForm.reset();

        this.registerForm.patchValue({
            titleFormControl: "Mr"
        });

        if (this.uploader.queue.length > 0) {
            this.uploader.queue[0].remove();
        }
        if (this.uploaderEvi.queue.length > 0) {
            this.uploaderEvi.queue[0].remove();
        }
        if (this.uploaderVat.queue.length > 0) {
            this.uploaderVat.queue[0].remove();
        }
    }

    // Navigate to Emergency Supplier Page
    route() {
        this.router.navigate(['items/emergency-supplier']);
    }

    // download attached files
    downloadAttachment(category: string, input) {
        var fileURL = "";
        var link = document.createElement('a');
        if (input.files.length == 1) {
            fileURL = URL.createObjectURL(input.files[0]);

            if (category == "Reg" && this.uploader.queue.length > 0) {
                link.href = fileURL;
                link.download = this.fileName_Reg;
                link.click();
            }
            else if (category == "Evi" && this.uploaderEvi.queue.length > 0) {
                link.href = fileURL;
                link.download = this.fileName_Evi;
                link.click();
            }
            else if (category == "Vat" && this.uploaderVat.queue.length > 0) {
                link.href = fileURL;
                link.download = this.fileName_Vat;
                link.click();
            }
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

// Check File Size
export const FileSizeCheck: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent || !control) {
        return null;
    }
    const emptyFile = control.parent.get('requiredfileRegistration').value._files[0].size;

    if (emptyFile != 0) {
        return null;
    }
    return { invalidSize: true };
}
