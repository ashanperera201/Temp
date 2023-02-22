import { Component, ViewChild, OnDestroy, OnInit, ViewEncapsulation, Injectable, ElementRef } from '@angular/core';
import { FormGroup, FormControl, AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FileItem, FileUploader } from 'ng2-file-upload';
import { MatTable } from '@angular/material/table';
import { NgbDateStruct, NgbDatepickerI18n, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, TranslationWidth } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { Supplier } from 'app/main/Models/Supplier';
import { IsExists } from 'app/main/Models/IsExists';
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas from 'html2canvas';


import Swal from 'sweetalert2';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';


export interface Categories {
  position: number;
  generalCategory: string;
  subCategory: string;
  detailCategory: string;
  isChecked: boolean;
  isSRMChecked: string;
  generalCode: string;
  subCode: string;
  detailCode: string;
}

const ELEMENT_DATA_CATEGORIES: Categories[] = [

];

export interface SelectedId {
  position: string;
}

const ELEMENT_DATA_SELECTEDID: SelectedId[] = [

];


export interface Users {
  userId: string;
  id: number;
  title: string;
  completed: boolean;
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
interface Country {
  name: string;
  alpha2Code: string;
  alpha3Code: string;
  numericCode: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

const I18N_VALUES = {
  en: {
    weekdays: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  ar: {
    weekdays: ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'],
    months: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
      'ذو القعدة', 'ذو الحجة'],
  }
};

@Injectable()
export class I18n {
  language = 'en';
}

@Injectable()
export class IslamicI18n extends NgbDatepickerI18n {


  constructor(private _i18n: I18n) {
    super();

  }

  getWeekdayLabel(weekdays: number, width?: TranslationWidth): string {
    // throw new Error('Method not implemented.');
    return I18N_VALUES[this._i18n.language].weekdays[weekdays - 1];
  }

  getWeekdayShortName(weekday: number) {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }

  getMonthShortName(month: number) {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }

  getMonthFullName(month: number) {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Injectable()
export class NgbdDatepickerI18n {

  constructor(private _i18n: I18n) { }

  set language(language: string) {
    this._i18n.language = language;
  }

  get language() {
    return this._i18n.language;
  }
}


@Component({
  selector: 'items-ifs-edit',
  templateUrl: './items-ifs-edit.component.html',
  styleUrls: ['./items-ifs-edit.css'],
  providers: [
    { provide: NgbDatepickerI18n, useClass: IslamicI18n },
    I18n,
    NgbdDatepickerI18n,
    DatePipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class ItemsIfsEditComponent implements OnInit, OnDestroy {

  panelOpenState = false;
  formFieldHelpers: string[] = [''];
  supplierDetailsSummary = new FormGroup({
    numbers: new FormControl('1653'),
    created: new FormControl('5/30/2021 12:14:39 PM'),
    status: new FormControl('New - Pending Criticality Matrix'),
    code: new FormControl('IMI-2021-0161'),
    name: new FormControl('Testing-30-5-2021-4'),
  });
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
    fax2: new FormControl('719-570-5336'),
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
    outcome21: new FormControl('yes'),
    auditchecklist: new FormControl('Audit_166_v1.PDF'),
    list: new FormControl(' '),
  });
  actionitems2 = new FormGroup({
    outcome: new FormControl('matrix'),
    outcome2: new FormControl('yes'),
    auditchecklist: new FormControl('Audit_166_v1.PDF'),
    list: new FormControl(' '),
  });
  actionitemsaudit = new FormGroup({
    outcome4: new FormControl('matrix'),
    outcome5: new FormControl('yes'),
    auditchecklist2: new FormControl('Audit_166_v1.PDF'),
    auditchecklistfile1: new FormControl('Audit_166_v1.PDF'),
    auditchecklistfile2: new FormControl('Audit_166_v1.PDF'),
    auditdatetime1: new FormControl(new Date()),
    auditdatetime2: new FormControl(new Date()),
    auditdatetime3: new FormControl(new Date()),

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


  public uploader: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/upload' });
  public uploaderTemp: FileUploader = new FileUploader({ url: environment.nodeurl + '/api/file/uploadTemp' });

  selectedMainTabIndex: number = 0;
  selectedProfileTabIndex: number = 0;

  RegFile_name: any;
  VatFile_name: any;
  GosiFile_name: any;
  SaudiFile_name: any;
  ZakathFile_name: any;
  AssociationFile_name: any;
  OrgaizationChartFile_name: any;
  AdditionalFile_name: any;
  AdditionalFile2_name: any;
  AdditionalFile3_name: any;
  AdditionalFile4_name: any;
  AdditionalFile5_name: any;
  FinancialYear1File_name: any;
  FinancialYear2File_name: any;
  FinancialYear3File_name: any;
  DesignFile_name: any;
  FinishFile_name: any;
  RegisteredFile_name: any;
  BusinessReferencesFile_name: any;
  PreventionOfCorruptionFile_name: any;
  ComplianceFile_name: any;
  HseFile_name: any;
  DocuFile_name: any;
  StatisticFile_name: any;
  ISOHealthFile_name: any;
  EnvtFile_name: any;
  QualityPolicyFile_name: any;
  QualityMgtFile_name: any;
  QualityMgtISOFile_name: any;
  BankFile_name: any;
  BankLetterHeadFile_name: any;

  isRegFile_name: boolean = false;
  isVatFile_name: boolean = false;
  isGosiFile_name: boolean = false;
  isSaudiFile_name: boolean = false;
  isZakathFile_name: boolean = false;
  isAssociationFile_name: boolean = false;
  isOrgaizationChartFile_name: boolean = false;
  isAdditionalFile_name: boolean = false;
  isAdditionalFile2_name: boolean = false;
  isAdditionalFile3_name: boolean = false;
  isAdditionalFile4_name: boolean = false;
  isAdditionalFile5_name: boolean = false;
  isFinancialYear1File_name: boolean = false;
  isFinancialYear2File_name: boolean = false;
  isFinancialYear3File_name: boolean = false;
  isDesignFile_name: boolean = false;
  isFinishFile_name: boolean = false;
  isRegisteredFile_name: boolean = false;
  isBusinessReferencesFile_name: boolean = false;
  isPreventionOfCorruptionFile_name: boolean = false;
  isComplianceFile_name: boolean = false;
  isHseFile_name: boolean = false;
  isStatisticFile_name: boolean = false;
  isDocuFile_name: boolean = false;
  isISOHealthFile_name: boolean = false;
  isEnvtFile_name: boolean = false;
  isQualityPolicyFile_name: boolean = false;
  isQualityMgtFile_name: boolean = false;
  isQualityMgtISOFile_name: boolean = false;
  isBankFile_name: boolean = false;
  isBankLetterHeadFile_name: boolean = false;

  TempRegFile_name: any;
  TempVatFile_name: any;
  TempGosiFile_name: any;
  TempSaudiFile_name: any;
  TempZakathFile_name: any;
  TempAssociationFile_name: any;
  TempOrgaizationChartFile_name: any;
  TempAdditionalFile_name: any;
  TempAdditionalFile_name2: any;
  TempAdditionalFile_name3: any;
  TempAdditionalFile_name4: any;
  TempAdditionalFile_name5: any;
  TempFinancialYear1File_name: any;
  TempFinancialYear2File_name: any;
  TempFinancialYear3File_name: any;
  TempDesignFile_name: any;
  TempFinishFile_name: any;
  TempRegisteredFile_name: any;
  TempBusinessReferencesFile_name: any;
  TempPreventionOfCorruptionFile_name: any;
  TempComplianceFile_name: any;
  TempHseFile_name: any;
  TempDocuFile_name: any;
  TempISOHealthFile_name: any;
  TempEnvtFile_name: any;
  TempQualityPolicyFile_name: any;
  TempQualityMgtFile_name: any;
  TempQualityMgtISOFile_name: any;
  TempBankFile_name: any;
  TempBankLetterHeadFile_name: any;
  TempStaticFile_name: any;

  // changedFields = '';
  htmlCanvas: HTMLCanvasElement;
  contentDataURL: any;
  isDisabled = false;
  isFirstDraftClick = false;
  isFirstSubmitClick = 0;
  count = 0;
  disableemail = false;
  num1: number;
  num2: number;
  number1 = 0;
  number2 = 0;
  sum = 0;
  contactsequence = 2;
  selected = null;
  selected2 = null;
  selected3 = null;
  selected4 = null;
  selected5 = null;
  selected6 = null;
  selected7 = null;
  selected8 = null;
  selected9 = null;
  selected10 = null;
  selected11 = null;
  selected12 = null;
  selected13 = null;
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
  selected26 = null;
  selected27 = null;
  selected28 = null;
  selected29 = null;
  selected30 = null;
  selectedEmpty = null;
  selectedCountry: any;
  selectedBankCountry: any;
  supplierIdForFile = 0;

  attachment_count = 1;

  userName: string;
  userEmail: string;
  userRole: string;
  userfullname: string;

  link: any;
  public supplierIdforTemp = '';
  public supplierIdforMoreinfo = '';
  public supplierIdforRegister = '';
  public saveasdraftid = '';

  fileToRemove = '';
  public NeedmoreRole = '';
  public photos: string[] = [];
  public photosInfo: string[] = [];
  public emgphotos: string[] = [];
  rejectedSupplierId = 0;
  totalVal = 0;
  savedCategory = '';
  filesChanged = '';
  actualFileName = '';
  additionalEmailCheck1: boolean = false;
  additionalEmailCheck2: boolean = false;
  additionalEmailCheckPattern1: boolean = false;
  additionalEmailCheckPattern2: boolean = false;
  totalChanged: boolean = false;
  termsAndConditionsCheck: boolean = false;
  needmorebankapprover: boolean = false;
  needmorehseq: boolean = false;
  biccodeerror = '';
  ibancodeerror = 'Iban no is not valid';
  public progress: number;
  public message: string;
  @Output() public onUploadFinished = new EventEmitter();
  @Output() dateSelect = new EventEmitter<NgbDateStruct>();
  selectedStatus = 'active';
  @ViewChild('fileInput') myFileInput: ElementRef;
  title = 'angular-material-table-inline-ops';
  displayedCategoriesColumns: string[] = ['id', 'position', 'generalCategory', 'subCategory', 'detailCategory', 'isChecked', 'action'];
  dataSourceAll = ELEMENT_DATA_CATEGORIES;
  displayedSelectedId: string[] = ['position'];
  dataSourceSelectedId = ELEMENT_DATA_SELECTEDID;
  isRegFileAlreadyAttached: boolean = false;
  isVatFileAlreadyAttached: boolean = false;
  isGosiFileAlreadyAttached: boolean = false;
  isSaudiFileAlreadyAttached: boolean = false;
  isZakathFileAlreadyAttached: boolean = false;
  isAssociationFileAlreadyAttached: boolean = false;
  isOrgaizationChartFileAlreadyAttached: boolean = false;
  isFinancialYear1FileAlreadyAttached: boolean = false;
  isAdditionalFileAlreadyAttached: boolean = false;
  isAdditionalFile2AlreadyAttached: boolean = false;
  isAdditionalFile3AlreadyAttached: boolean = false;
  isAdditionalFile4AlreadyAttached: boolean = false;
  isAdditionalFile5AlreadyAttached: boolean = false;
  isFinancialYear2FileAlreadyAttached: boolean = false;
  isFinancialYear3FileAlreadyAttached: boolean = false;
  isDesignFileAlreadyAttached: boolean = false;
  isFinishFileAlreadyAttached: boolean = false;
  isRegisteredFileAlreadyAttached: boolean = false;
  isBusinessReferencesFileAlreadyAttached: boolean = false;
  isPreventionOfCorruptionFileAlreadyAttached: boolean = false;
  isComplianceFileAlreadyAttached: boolean = false;
  isHseFileAlreadyAttached: boolean = false;
  isDocuFileAlreadyAttached: boolean = false;
  isISOHealthFileAlreadyAttached: boolean = false;
  isEnvtFileAlreadyAttached: boolean = false;
  isQualityPolicyFileAlreadyAttached: boolean = false;
  isQualityMgtFileAlreadyAttached: boolean = false;
  isQualityMgtISOFileAlreadyAttached: boolean = false;
  isBankFileAlreadyAttached: boolean = false;
  isBankLetterHeadFileAlreadyAttached: boolean = false;
  isHseStaticDocFileAlreadyAttached: boolean = false;
  url: any;
  fileName: any;
  fileType: any;
  section: boolean = false;
  r1url: any;
  r1fileName: any;
  r1fileType: any;
  r1section: boolean = false;
  v1url: any;
  v1fileName: any;
  v1fileType: any;
  v1section: boolean = false;
  g1url: any;
  g1fileName: any;
  g1fileType: any;
  g1section: boolean = false;
  s1url: any;
  s1fileName: any;
  s1fileType: any;
  s1section: boolean = false;
  z1url: any;
  z1fileName: any;
  z1fileType: any;
  z1section: boolean = false;
  a1url: any;
  a1fileName: any;
  a1fileType: any;
  a1section: boolean = false;
  m1url: any;
  m1fileName: any;
  m1fileType: any;
  m1section: boolean = false;
  a2url: any;
  a2fileName: any;
  a2fileType: any;
  a2section: boolean = false;
  a3url: any;
  a3fileName: any;
  a3fileType: any;
  a3section: boolean = false;
  a4url: any;
  a4fileName: any;
  a4fileType: any;
  a4section: boolean = false;
  a5url: any;
  a5fileName: any;
  a5fileType: any;
  a5section: boolean = false;
  a6url: any;
  a6fileName: any;
  a6fileType: any;
  a6section: boolean = false;
  f1url: any;
  f1fileName: any;
  f1fileType: any;
  f1section: boolean = false;
  f2url: any;
  f2fileName: any;
  f2fileType: any;
  f2section: boolean = false;
  f3url: any;
  f3fileName: any;
  f3fileType: any;
  f3section: boolean = false;
  e1url: any;
  e1fileName: any;
  e1fileType: any;
  e1section: boolean = false;
  e2url: any;
  e2fileName: any;
  e2fileType: any;
  e2section: boolean = false;
  e3url: any;
  e3fileName: any;
  e3fileType: any;
  e3section: boolean = false;
  e4url: any;
  e4fileName: any;
  e4fileType: any;
  e4section: boolean = false;
  e5url: any;
  e5fileName: any;
  e5fileType: any;
  e5section: boolean = false;
  h1url: any;
  h1fileName: any;
  h1fileType: any;
  h1section: boolean = false;
  h2url: any;
  h2fileName: any;
  h2fileType: any;
  h2section: boolean = false;
  h3url: any;
  h3fileName: any;
  h3fileType: any;
  h3section: boolean = false;
  h4url: any;
  h4fileName: any;
  h4fileType: any;
  h4section: boolean = false;
  h6url: any;
  h6fileName: any;
  h6fileType: any;
  h6section: boolean = false;
  q1url: any;
  q1fileName: any;
  q1fileType: any;
  q1section: boolean = false;
  q2url: any;
  q2fileName: any;
  q2fileType: any;
  q2section: boolean = false;
  q3url: any;
  q3fileName: any;
  q3fileType: any;
  q3section: boolean = false;
  b1url: any;
  b1fileName: any;
  b1fileType: any;
  b1section: boolean = false;
  b2url: any;
  b2fileName: any;
  b2fileType: any;
  b2section: boolean = false;
  @ViewChild(MatTable, { static: true })
  table!: MatTable<any>;
  isLinear = false;
  agreement = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  SubFormGroup1: FormGroup;
  SubFormGroup2: FormGroup;
  SubFormGroup3: FormGroup;
  SubFormGroup4: FormGroup;
  SubFormGroup5: FormGroup;
  SubFormGroup6: FormGroup;
  SubFormGroup7: FormGroup;
  modelGosi: NgbDateStruct;
  modelReg: NgbDateStruct;
  modelSaudi: NgbDateStruct;
  modelZakat: NgbDateStruct;
  modelAudit: NgbDateStruct;
  istempsave: boolean = false;
  isemaildisable: boolean = false;
  files: any = [];
  filetemp: any = [];
  allsuppliers: any = [];
  istempFile: boolean = false;
  isNeedmoreInfo: boolean = false;
  isEmergency: boolean = false;
  istemp: boolean = true;
  isnameexists: boolean = false;
  isemailexists: boolean = false;
  iscrnoexists: boolean = false;
  r1FileLoaded: boolean = false;
  v1FileLoaded: boolean = false;
  g1FileLoaded: boolean = false;
  s1FileLoaded: boolean = false;
  z1FileLoaded: boolean = false;
  a1FileLoaded: boolean = false;
  e1FileLoaded: boolean = false;
  e2FileLoaded: boolean = false;
  e3FileLoaded: boolean = false;
  e4FileLoaded: boolean = false;
  e5FileLoaded: boolean = false;
  h1FileLoaded: boolean = false;
  h2FileLoaded: boolean = false;
  h3FileLoaded: boolean = false;
  h4FileLoaded: boolean = false;
  h6FileLoaded: boolean = false;
  q1FileLoaded: boolean = false;
  q2FileLoaded: boolean = false;
  q3FileLoaded: boolean = false;
  b1FileLoaded: boolean = false;
  b2FileLoaded: boolean = false;

  isValid: boolean = false;
  addAnother: boolean = false;
  addAnother2: boolean = false;
  addAnother3: boolean = false;
  addAnother4: boolean = false;
  additionalAttachButton: boolean = false;
  isdesignnCapCtrl: boolean = false;
  isfinishProdCtrl: boolean = false;
  isregisteredOrgCtrl: boolean = false;
  issuspendedProj1Ctrl: boolean = false;
  orgtype: boolean = false;
  islitigation1Ctrl: boolean = false;
  iscompliance1Ctrl: boolean = false;
  isshareholder1Ctrl: boolean = false;
  islegalAsset1Ctrl: boolean = false;
  islabour1Ctrl: boolean = false;
  isenvironment1Ctrl: boolean = false;
  isimiInterested1trl: boolean = false;
  isstatisticCtrl: boolean = false;
  isdedicatedpersCtrl: boolean = false;
  isenvtMgt1Ctrl: boolean = false;
  isisohealthCtrl: boolean = false;
  isdocuHseCtrl: boolean = false;
  ishse1Ctrl: boolean = false;
  isqualityPolicy1Ctrl: boolean = false;
  isqualityMgtCtrl: boolean = false;
  isqualityMgtIsoCtrl: boolean = false;
  isqualityResp1Ctrl: boolean = false;

  /* Experience & QUalification Tab Starts */
  isOwnsPlantEquipCtrlSelected: boolean = false;
  isDesignnCapCtrlSelected: boolean = false;
  isFinishProdCtrlSelected: boolean = false;
  isInternalPolicyCtrlSelected: boolean = false;
  isRegisteredOrgCtrlSelected: boolean = false;
  isSuspendedProj1CtrlSelected: boolean = false;
  /* Experience & QUalification Tab Ends */
  /* Legal Tab Starts */
  isLitigation1CtrlSelected: boolean = false;
  isCompliance1CtrlSelected: boolean = false;
  isShareholder1CtrlSelected: boolean = false;
  isLegalAsset1CtrlSelected: boolean = false;
  isLabour1CtrlSelected: boolean = false;
  isEnvironment1CtrlSelected: boolean = false;
  isImiInterested1trlSelected: boolean = false;
  /* Legal Tab Ends */
  /* HSE Tab Starts */
  isHse1CtrlSelected: boolean = false;
  isDocuHseCtrlSelected: boolean = false;
  isIsohealthCtrlSelected: boolean = false;
  isEnvtMgt1CtrlSelected: boolean = false;
  isDedicatedpersCtrlSelected: boolean = false;
  isStatisticCtrlSelected: boolean = false;
  /* HSE Tab Ends*/
  /* Quality Tab Starts */
  isQualityPolicy1CtrlSelected: boolean = false;
  isQualityMgtCtrlSelected: boolean = false;
  isQualityMgtIsoCtrlSelected: boolean = false;
  isQualityResp1CtrlSelected: boolean = false;
  /* Quality Tab Ends */
  /* Bank Tab starts */
  isBankLetterSelected: boolean = false;
  isBankLetterHeadSelected: boolean = false;
  /* Bank Tab ends */
  /* Supplier Details Starts */
  isRegFileSelected: boolean = false;
  isVatFileSelected: boolean = false;
  isGosiFileSelected: boolean = false;
  isSaudiFileSelected: boolean = false;
  isZakathFileSelected: boolean = false;
  isOtherCityCtrlSelected: boolean = false;
  isVatNumberSelected: boolean = false;
  isOtherBankCtrlSelected: boolean = false;

  isTypeOfOrganization2CtrlSelected: boolean = false;
  // Calenders
  isReghijriSelected: boolean = false;
  isGosihijriSelected: boolean = false;
  isSaudihijriSelected: boolean = false;
  isZakathhijriSelected: boolean = false;
  /* Supplier Details Ends */

  showErrorForDate: boolean = false;
  showErrorForRegDate: boolean = false;
  showErrorForGosiDate: boolean = false;
  showErrorForSaudiDate: boolean = false;
  showErrorForZakathDate: boolean = false;
  isNotGCC: boolean = false;

  isfirsttimeclickcount: number = 0;
  showSubmitButton: boolean = false;
  displayedColumns2: string[] = ['userId', 'id', 'title', 'completed'];
  totalAngularPackages;
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  orcalTest;
  displayedColumns3: string[] = ['id', 'first_name', 'last_name', 'email', 'phone_number', 'hire_date', 'job_id', 'salary', 'commission_pct', 'manager_id', 'department_id'];
  isWaitDraft = false;
  agree: boolean = false;
  uploadingDone: boolean = false;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  regdate: any;
  kingdom: string;
  supId: string;
  checked: boolean = false;
  showChecked: boolean = false;
  language: string = 'en';
  supplier = new Supplier();
  iscitydisable = true;
  isBankcitydisable = true;
  isothercitydisable = true;
  startdate: NgbDate;
  registerForm: FormGroup;
  private _unsubscribeAll: Subject<any>;
  fileslistReg: any;
  fileslistVat: any;
  fileslistGosi: any;
  fileslistSaudi: any;
  fileslistZakath: any;
  fileslistMan: any;
  fileslistFin1: any;
  fileslistFin2: any;
  fileslistFin3: any;
  fileslistExp1: any;
  fileslistExp2: any;
  fileslistExp3: any;
  fileslistExp4: any;
  fileslistExp5: any;
  fileslistExp6: any;
  fileslistExp7: any;
  fileslistExp8: any;
  fileslistExp9: any;
  fileslistExp10: any;
  fileslistExp11: any;
  fileslistExp12: any;
  fileslistBank: any;
  manageval = null;
  techval = null;
  opeval = null;
  saudival = null;
  supplier_id: number = 0;
  supplierName: string;
  Bank_Invalid: boolean = false;
  originalCountryList: any = [];
  additionalContact1: boolean = true;
  additionalContact2: boolean = false;
  showAdditionalButton1: boolean = true;
  showAdditionalButton2: boolean = true;
  r1_count: number = 1;
  v1_count: number = 1;
  g1_count: number = 1;
  s1_count: number = 1;
  z1_count: number = 1;
  a1_count: number = 1;
  m1_count: number = 1;
  a2_count: number = 1;
  a3_count: number = 1;
  a4_count: number = 1;
  a5_count: number = 1;
  a6_count: number = 1;
  f1_count: number = 1;
  f2_count: number = 1;
  f3_count: number = 1;
  e1_count: number = 1;
  e2_count: number = 1;
  e3_count: number = 1;
  e4_count: number = 1;
  e5_count: number = 1;
  h1_count: number = 1;
  h2_count: number = 1;
  h3_count: number = 1;
  h4_count: number = 1;
  h6_count: number = 1;
  q1_count: number = 1;
  q2_count: number = 1;
  q3_count: number = 1;
  b1_count: number = 1;
  b2_count: number = 1;
  counting: number = 0;
  selectedFiles: File[];
  selectedFileName: any = [];
  selectedFilesSize: number = 0;
  public response: { dbPath: '' };
  draftlimit = 15;
  autosave = false;
  alertmessage = '';
  alertmessageTab = '';


  public uploadFinished = (event) => {
    this.response = event;
  }


  getFileLater() {
    console.log(this.myFileInput.nativeElement.files[0]);
  }

  fileChanged(event) {
    console.log(event.target.files[0]);
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.totalAngularPackages.filter = filterValue.trim().toLowerCase();
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.orcalTest.filter = filterValue.trim().toLowerCase();
  }



  uploadFile(event) {
    for (let index = 0; index < event.length; index++) {
      const element = event[index];
      this.files.push(element.name)
    }
  }

  deleteAttachment(index) {
    this.files.splice(index, 1)
  }

  myDate = new Date();

  /**
   * Constructor
   */
  constructor(public dialogAttachment: MatDialog,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    private _formBuilder: FormBuilder, private http: HttpClient,
    // private _snackBar: MatSnackBar,
    private ngbdDatepickerI18n: NgbdDatepickerI18n,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router) {

    this._unsubscribeAll = new Subject();

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.kingdom = '2';
    this.loadCurrentUserData();
  }

  public returnToCreate = () => {
    this.getPhotos();
  }

  public migrateFiles(tempIdOld: string, registerIdNew: string) {
    var tempId = tempIdOld;
    var registerId = registerIdNew;

    this.http.get(environment.nodeurl + '/api/file/movefiles?tempId=' + tempId + '&registerId=' + registerId).subscribe(data => this.photos = data['photos']);
  }

  public migrateRejectedFiles(tempIdOld: string, registerIdNew: string, category: string) {
    var tempId = tempIdOld;
    var registerId = registerIdNew;

    this.http.get(environment.nodeurl + '/api/file/moverejectedfiles?tempId=' + tempId + '&registerId=' + registerId + '&cat=' + category).subscribe();
  }




  creatEmpTest() {
    this.migrateFiles("1200", "700");

    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('supplierid', '5');


      fileItem.url = environment.nodeurl + '/api/file/upload';
    };
    this.uploader.uploadAll();
  }

  public async initialwork() {
    let supplierid = this.activatedRoute.snapshot.params.id;
    let category = this.activatedRoute.snapshot.params.cat;
    this.supplierIdforMoreinfo = this.activatedRoute.snapshot.params.id.toString();

    Swal.fire('Please dont refresh the page. We are still loading!');
    Swal.showLoading();

    this.firstFormGroup.get('otherCityCtrl').disable();
    this.firstFormGroup.get('kingdomCtrl').disable();
    this.thirdFormGroup.get('otherNameCtrl').disable();

    if (supplierid) {
      await this.loadNeedmoreData(supplierid, category);
      this.r1FileLoaded = true;
      this.isVatFileSelected = true;
      this.isGosiFileSelected = true;
      this.isSaudiFileSelected = true;
      this.isZakathFileSelected = true;
      this.isGosihijriSelected = true;
      this.isSaudihijriSelected = true;
      this.isZakathhijriSelected = true;
    }
    else {
      this.istempsave = true;
    }


  }

  public loadNeedmoreData(supplierid, category) {
    this.isNeedmoreInfo = true;
    this.savedCategory = 'reg';

    Swal.fire('Please dont refresh the page. We are still loading!');
    Swal.showLoading();

    this.istemp = false;
    this.supplier.supplier_id = supplierid;
    this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + supplierid)
      .subscribe(data => {
        if (data) {
          Swal.fire('Please dont refresh the page. We are still loading!');
          Swal.showLoading();
          this.setValues(data[0]);
          this.rejectedSupplierId = data[0].revisionNo;

          let catvalues = data[0].supplierCategories;
          if (catvalues) {
            this.dataSourceAll = []
            for (let i = 0; i < catvalues.length; i++) {
              this.dataSourceAll.push({
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
          }

        }
        Swal.close();
      },
        error => Swal.fire('Supplier Already Registered. Please start new!', '', 'success')
      )
    this.istempsave = false;
    this.isemaildisable = true;
    // this.firstFormGroup.get('emailCtrl').disable();

    this.r1FileLoaded = true;
    this.isVatFileSelected = true;
    this.isGosiFileSelected = true;
    this.isSaudiFileSelected = true;
    this.isZakathFileSelected = true;
    this.isGosihijriSelected = true;
    this.isSaudihijriSelected = true;
    this.isZakathhijriSelected = true;
    this.iscitydisable = true;
  }

  public findAlreadyAddedPhotos() {
    var photolist: string[] = this.photos;


    if (this.istempFile) {
      photolist = this.photos;
      this.supId = this.supplierIdforTemp.toString();
    } else if (this.isNeedmoreInfo) {
      photolist = this.photosInfo;

      this.supId = this.supplierIdforMoreinfo.toString();

    } else {
      photolist = this.photos;

    }

    console.log('Inside findAlreadyAddedPhotos');

    for (let obj of photolist) {
      console.log('Inside photos loops');

      // if(obj.includes(this.supplierIdforTemp+'_')){
      console.log('Inside photos loops after id valid');

      var sup_id = this.supId + '_';
      if (obj.includes(sup_id)) {
        if (obj.includes('r1')) {
          console.log('Inside photos r1 found');

          this.isRegFileAlreadyAttached = true;
          this.isRegFileSelected = true;
          this.TempRegFile_name = obj;

          console.log("isRegFileAlreadyAttached is true");
        }

        if (obj.includes('v1')) {
          console.log('Inside photos v1 found');

          this.isVatFileAlreadyAttached = true;
          this.isVatFileSelected = true;
          this.TempVatFile_name = obj;
          console.log("isVatFileAlreadyAttached is true");
        }

        if (obj.includes('g1')) {
          console.log('Inside photos g1 found');

          this.isGosiFileAlreadyAttached = true;
          this.isGosiFileSelected = true;
          this.TempGosiFile_name = obj;

          console.log("isGosiFileAlreadyAttached is true");
        }

        if (obj.includes('s1')) {
          console.log('Inside photos s1 found');

          this.isSaudiFileAlreadyAttached = true;
          this.isSaudiFileSelected = true;
          this.TempSaudiFile_name = obj;

          console.log("isSaudiFileAlreadyAttached is true");
        }

        if (obj.includes('z1')) {
          this.isZakathFileAlreadyAttached = true;
          this.isZakathFileSelected = true;
          this.TempZakathFile_name = obj;

          console.log("isZakathFileAlreadyAttached is true");
        }

        if (obj.includes('a1')) {
          this.isAssociationFileAlreadyAttached = true;
          this.TempAssociationFile_name = obj;

          console.log("isAssociationFileAlreadyAttached is true");
        }

        if (obj.includes('m1')) {
          this.isOrgaizationChartFileAlreadyAttached = true;
          this.TempOrgaizationChartFile_name = obj;

          console.log("isOrgaizationChartFileAlreadyAttached is true");
        }

        if (obj.includes('a2')) {
          this.isAdditionalFileAlreadyAttached = true;
          this.TempAdditionalFile_name = obj;

          console.log("isAdditionalFileAlreadyAttached1 is true");
        }

        if (obj.includes('a3')) {
          this.isAdditionalFile2AlreadyAttached = true;
          this.TempAdditionalFile_name2 = obj;

          console.log("isAdditionalFileAlreadyAttached2 is true");
        }

        if (obj.includes('a4')) {
          this.isAdditionalFile3AlreadyAttached = true;
          this.TempAdditionalFile_name3 = obj;

          console.log("isAdditionalFileAlreadyAttached3 is true");
        }

        if (obj.includes('a5')) {
          this.isAdditionalFile4AlreadyAttached = true;
          this.TempAdditionalFile_name4 = obj;

          console.log("isAdditionalFileAlreadyAttached4 is true");
        }

        if (obj.includes('a6')) {
          this.isAdditionalFile5AlreadyAttached = true;
          this.TempAdditionalFile_name5 = obj;

          console.log("isAdditionalFileAlreadyAttached5 is true");
        }

        if (obj.includes('f1')) {
          this.isFinancialYear1FileAlreadyAttached = true;
          this.TempFinancialYear1File_name = obj;

          console.log("isFinancialYear1FileAlreadyAttached is true");
        }

        if (obj.includes('f2')) {
          this.isFinancialYear2FileAlreadyAttached = true;
          this.TempFinancialYear2File_name = obj;

          console.log("isFinancialYear2FileAlreadyAttached is true");
        }

        if (obj.includes('f3')) {
          this.isFinancialYear3FileAlreadyAttached = true;
          this.TempFinancialYear3File_name = obj;

          console.log("isFinancialYear3FileAlreadyAttached is true");
        }

        /* Supplier Detail Ends */

        /* Experience & Qualifiaction Tab Starts */

        if (obj.includes('e1')) {
          this.isDesignFileAlreadyAttached = true;
          this.isDesignnCapCtrlSelected = true;
          this.TempDesignFile_name = obj;

          console.log("isDesignFileAlreadyAttached:  is true");
        }

        if (obj.includes('e2')) {
          this.isFinishFileAlreadyAttached = true;
          this.isFinishProdCtrlSelected = true;
          this.TempFinishFile_name = obj;

          console.log("isFinishFileAlreadyAttached:  is true");
        }

        if (obj.includes('e3')) {
          this.isRegisteredFileAlreadyAttached = true;
          this.isRegisteredOrgCtrlSelected = true;
          this.TempRegisteredFile_name = obj;

          console.log("isRegisteredFileAlreadyAttached:  is true");
        }

        if (obj.includes('e4')) {
          this.isBusinessReferencesFileAlreadyAttached = true;
          this.TempBusinessReferencesFile_name = obj;

          console.log("isBusinessReferencesFileAlreadyAttached:  is true");
        }

        if (obj.includes('e5')) {
          this.isPreventionOfCorruptionFileAlreadyAttached = true;
          this.isCompliance1CtrlSelected = true;
          this.TempComplianceFile_name = obj;

          console.log("isPreventionOfCorruptionFileAlreadyAttached:  is true");
        }

        if (obj.includes('h1')) {
          this.isHseFileAlreadyAttached = true;
          this.isHse1CtrlSelected = true;
          this.TempHseFile_name = obj;

          console.log("isHseFileAlreadyAttached:  is true");
        }

        if (obj.includes('h2')) {
          this.isDocuFileAlreadyAttached = true;
          this.isDocuHseCtrlSelected = true;
          this.TempDocuFile_name = obj;

          console.log("isDocuFileAlreadyAttached:  is true");
        }

        if (obj.includes('h3')) {
          this.isISOHealthFileAlreadyAttached = true;
          this.isIsohealthCtrlSelected = true;
          this.TempISOHealthFile_name = obj;

          console.log("isISOHealthFileAlreadyAttached:  is true");
        }

        if (obj.includes('h4')) {
          this.isEnvtFileAlreadyAttached = true;
          this.isEnvtMgt1CtrlSelected = true;
          this.TempEnvtFile_name = obj;

          console.log("isEnvtFileAlreadyAttached:  is true");
        }

        if (obj.includes('h6')) {
          this.isHseStaticDocFileAlreadyAttached = true;
          this.TempStaticFile_name = obj;

          console.log("isHseStaticDocFileAlreadyAttached:  is true");
        }

        if (obj.includes('q1')) {
          this.isQualityPolicyFileAlreadyAttached = true;
          this.isQualityPolicy1CtrlSelected = true;
          this.TempQualityPolicyFile_name = obj;

          console.log("isQualityPolicyFileAlreadyAttached:  is true");
        }

        if (obj.includes('q2')) {
          this.isQualityMgtFileAlreadyAttached = true;
          this.isQualityMgtCtrlSelected = true;
          this.TempQualityMgtFile_name = obj;

          console.log("isQualityMgtFileAlreadyAttached:  is true");
        }

        if (obj.includes('q3')) {
          this.isQualityMgtISOFileAlreadyAttached = true;
          this.isQualityMgtIsoCtrlSelected = true;
          this.TempQualityMgtISOFile_name = obj;

          console.log("isQualityMgtISOFileAlreadyAttached:  is true");
        }

        if (obj.includes('b1')) {
          this.isBankFileAlreadyAttached = true;
          this.TempBankFile_name = obj;

          this.b1FileLoaded = true;
          console.log("isBankFileAlreadyAttached:  is true");
        }

        if (obj.includes('b2')) {
          this.isBankLetterHeadFileAlreadyAttached = true;
          this.TempBankLetterHeadFile_name = obj;

          this.b2FileLoaded = true;
          console.log("isBankFile 2 AlreadyAttached:  is true");
        }
      }
      /* Experience & Qualifiaction Tab Ends */
    }

    // isVatFileAlreadyAttached
    // isGosiFileAlreadyAttached
    // isSaudiFileAlreadyAttached
    // isZakathFileAlreadyAttached
    // isDesignFileAlreadyAttached
    // isFinishFileAlreadyAttached
    // isRegisteredFileAlreadyAttached
    // isComplianceFileAlreadyAttached
    // isHseFileAlreadyAttached
    // isDocuFileAlreadyAttached
    // isISOHealthFileAlreadyAttached
    // isEnvtFileAlreadyAttached
    // isQualityPolicyFileAlreadyAttached
    // isQualityMgtFileAlreadyAttached
    // isQualityMgtISOFileAlreadyAttached
    // isBankFileAlreadyAttached

    if (this.istempFile) {


      if (this.isRegFileAlreadyAttached) {
        this.isRegFileSelected = true;
      } else {
        if (this.firstFormGroup.get('regfiletempCtrl').hasError('invalid')) {
          this.isRegFileSelected = false;
          console.log("regfileoriCtrl is false");
        } else {
          if (this.r1FileLoaded) {
            if (this.isemptyreg) {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            } else {
              this.isRegFileSelected = true;
              console.log("regfileoriCtrl is true");
            }
          } else {
            this.isRegFileSelected = false;
            console.log("regfileoriCtrl is false");
          }
        }
      }

      if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
        if (this.isVatFileAlreadyAttached) {
          this.isVatFileSelected = true;

        } else {
          if (this.firstFormGroup.get('vatfiletempCtrl').hasError('invalid')) {
            this.isVatFileSelected = false;
            console.log("vatfileoriCtrl is false");
          } else {
            if (this.v1FileLoaded) {
              if (this.isemptyvat) {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              } else {
                this.isVatFileSelected = true;
                console.log("vatfileoriCtrl is true");
              }
            } else {
              this.isVatFileSelected = false;
              console.log("vatfileoriCtrl is false");
            }
          }
        }


        // 3. GosiFile
        if (this.isGosiFileAlreadyAttached) {
          this.isGosiFileSelected = true;

        } else {
          if (this.firstFormGroup.get('gosifiletempCtrl').hasError('invalid')) {
            this.isGosiFileSelected = false;
            console.log("gosifileoriCtrl is false");
          } else {
            if (this.g1FileLoaded) {
              if (this.isemptygosi) {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                this.isGosiFileSelected = true;
                console.log("gosifileoriCtrl is true");
              }


            } else {
              this.isGosiFileSelected = false;
              console.log("gosifileoriCtrl is false");
            }
          }
        }


        // 4. SaudiFile
        if (this.isSaudiFileAlreadyAttached) {
          this.isSaudiFileSelected = true;

        } else {
          if (this.firstFormGroup.get('saudifiletempCtrl').hasError('invalid')) {
            this.isSaudiFileSelected = false;
            console.log("saudifileoriCtrl is false");
          } else {
            if (this.s1FileLoaded) {
              if (this.isemptysaudi) {
                this.isSaudiFileSelected = false;
                console.log("saudifileoriCtrl is false");
              } else {
                this.isSaudiFileSelected = true;
                console.log("saudifileoriCtrl is true");
              }


            } else {
              this.isSaudiFileSelected = false;
              console.log("saudifileoriCtrl is false");
            }
          }
        }


        // 5. ZakathFile
        if (this.isZakathFileAlreadyAttached) {
          this.isZakathFileSelected = true;

        } else {
          if (this.firstFormGroup.get('zakathfiletempCtrl').hasError('invalid')) {
            this.isZakathFileSelected = false;
            console.log("zakathfileoriCtrl is false");
          } else {
            if (this.z1FileLoaded) {
              if (this.isemptyzakath) {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              } else {
                this.isZakathFileSelected = true;
                console.log("zakathfileoriCtrl is true");
              }

            } else {
              this.isZakathFileSelected = false;
              console.log("zakathfileoriCtrl is false");
            }
          }
        }
      } else {

        this.isVatFileSelected = true;

        this.isGosiFileSelected = true;

        this.isSaudiFileSelected = true;

        this.isZakathFileSelected = true;

      }

    }

    if (!this.istempFile) {

      // 1. RegFile
      if (this.isRegFileAlreadyAttached) {
        this.isRegFileSelected = true;
      } else {
        if (this.firstFormGroup.get('regfileoriCtrl').hasError('invalid')) {
          this.isRegFileSelected = false;
          console.log("regfileoriCtrl is false");
        } else {
          if (this.r1FileLoaded) {
            if (this.isemptyreg) {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            } else {
              if (this.ismaxreg) {
                this.isRegFileSelected = false;
                console.log("regfileoriCtrl is false");
              } else {
                this.isRegFileSelected = true;
                console.log("regfileoriCtrl is true");
              }
            }
          } else {
            this.isRegFileSelected = false;
            console.log("regfileoriCtrl is false");
          }
        }
      }

      if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
        if (this.isVatFileAlreadyAttached) {
          this.isVatFileSelected = true;
        } else {
          if (this.firstFormGroup.get('vatfileoriCtrl').hasError('invalid')) {
            this.isVatFileSelected = false;
            console.log("vatfileoriCtrl is false");
          } else {
            if (this.v1FileLoaded) {
              if (this.isemptyvat) {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              } else {
                if (this.ismaxvat) {
                  this.isVatFileSelected = false;
                  console.log("vatfileoriCtrl is false");
                } else {
                  this.isVatFileSelected = true;
                  console.log("vatfileoriCtrl is true");
                }
              }
            } else {
              this.isVatFileSelected = false;
              console.log("vatfileoriCtrl is false");
            }
          }
        }

        // 3. GosiFile
        if (this.isGosiFileAlreadyAttached) {
          this.isGosiFileSelected = true;
        } else {
          if (this.firstFormGroup.get('gosifileoriCtrl').hasError('invalid')) {
            this.isGosiFileSelected = false;
            console.log("gosifileoriCtrl is false");
          } else {
            if (this.g1FileLoaded) {
              if (this.isemptygosi) {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                if (this.ismaxgosi) {
                  this.isGosiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  this.isGosiFileSelected = true;
                  console.log("gosifileoriCtrl is true");
                }
              }
            } else {
              this.isGosiFileSelected = false;
              console.log("gosifileoriCtrl is false");
            }
          }
        }

        // 4. SaudiFile
        if (this.isSaudiFileAlreadyAttached) {
          this.isSaudiFileSelected = true;
        } else {
          if (this.firstFormGroup.get('saudifileoriCtrl').hasError('invalid')) {
            this.isSaudiFileSelected = false;
            console.log("saudifileoriCtrl is false");
          } else {
            if (this.s1FileLoaded) {
              if (this.isemptygosi) {
                this.isSaudiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                if (this.ismaxgosi) {
                  this.isSaudiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  this.isSaudiFileSelected = true;
                  console.log("gosifileoriCtrl is true");
                }
              }
            } else {
              this.isSaudiFileSelected = false;
              console.log("saudifileoriCtrl is false");
            }
          }
        }

        // 5. ZakathFile
        if (this.isZakathFileAlreadyAttached) {
          this.isZakathFileSelected = true;
        } else {
          if (this.firstFormGroup.get('zakathfileoriCtrl').hasError('invalid')) {
            this.isZakathFileSelected = false;
            console.log("zakathfileoriCtrl is false");
          } else {
            if (this.z1FileLoaded) {
              if (this.isemptyzakath) {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              } else {
                if (this.ismaxzakath) {
                  this.isZakathFileSelected = false;
                  console.log("zakathfileoriCtrl is false");
                } else {
                  this.isZakathFileSelected = true;
                  console.log("zakathfileoriCtrl is true");
                }
              }
            } else {
              this.isZakathFileSelected = false;
              console.log("zakathfileoriCtrl is false");
            }
          }
        }
      } else {

        this.isVatFileSelected = true;

        this.isGosiFileSelected = true;

        this.isSaudiFileSelected = true;

        this.isZakathFileSelected = true;

      }
    }
  }

  public getPhotos() {

    // https://localhost:44304/api/file/getDraftPhotos?supId=19012
    // window.location.href = environment.nodeurl + '/api/file/download?fileUrl=' + fileUrl;

    // this.fileService.getPhotos().subscribe(data => this.photos = data['photos']);
    this.http.get(environment.nodeurl + '/api/file/getDraftPhotos?supId=' + this.supplierIdforTemp).subscribe(data => this.photos = data['photos']);

    // return this.http.get(environment.nodeurl+'/api/file/getPhotos');
  }

  public getNeedMorePhotos() {
    // this.fileService.getPhotos().subscribe(data => this.photos = data['photos']);
    this.http.get(environment.nodeurl + '/api/file/getPhotosById?supId=' + this.supplierIdforMoreinfo).subscribe(
      data =>
        this.photosInfo = data['photos']);

    // return this.http.get(environment.nodeurl+'/api/file/getPhotos');
  }

  public getRegisteredPhotos(supplierid) {
    // this.fileService.getPhotos().subscribe(data => this.photos = data['photos']);
    this.http.get(environment.nodeurl + '/api/file/getPhotosById?supId=' + supplierid).subscribe(
      data => {
        this.photosInfo = data['photos'];
        var registered = data['photos'];

        this.findAlreadyAddedPhotosReject(supplierid);
        //         registered.forEach(element => {
        //           if(element.indexOf(String(supplierid))!= -1){
        //             this.http.get(environment.nodeurl + '/api/file/downloadNeedmore?fileUrl='+element).subscribe(data3=>{
        // var res = data3;
        //             })
        //           }
        //           var elementnew = element.replace(String(supplierid)+'_','');
        //           this.photosInfo.push(elementnew);
        //         });
      });

    // return this.http.get(environment.nodeurl+'/api/file/getPhotos');
  }

  public getEmerencyPhotos(supplierid) {

    this.http.get(environment.nodeurl + '/api/file/getEmergencyPhotos?SupplierId=' + supplierid).subscribe(data => this.emgphotos = data['photos']);
    this.isVatFileSelected = true;
    this.isRegFileSelected = true;
    this.isVatFileAlreadyAttached = true;
    this.isRegFileAlreadyAttached = true;
  }

  public findAlreadyAddedPhotosReject(supplierid) {
    var photolist: string[] = this.photosInfo;

    // photolist = this.photosInfo;

    console.log('Inside findAlreadyAddedPhotos');

    for (let obj of photolist) {
      console.log('Inside photos loops');

      // if(obj.includes(this.supplierIdforTemp+'_')){
      console.log('Inside photos loops after id valid');

      var sup_id = supplierid + '_';
      if (obj.includes(sup_id)) {
        if (obj.includes('r1')) {
          console.log('Inside photos r1 found');

          this.isRegFileAlreadyAttached = true;
          this.TempRegFile_name = obj;

          console.log("isRegFileAlreadyAttached is true");
        }

        if (obj.includes('v1')) {
          console.log('Inside photos v1 found');

          this.isVatFileAlreadyAttached = true;
          this.TempVatFile_name = obj;
          console.log("isVatFileAlreadyAttached is true");
        }

        if (obj.includes('g1')) {
          console.log('Inside photos g1 found');

          this.isGosiFileAlreadyAttached = true;
          this.TempGosiFile_name = obj;

          console.log("isGosiFileAlreadyAttached is true");
        }

        if (obj.includes('s1')) {
          console.log('Inside photos s1 found');

          this.isSaudiFileAlreadyAttached = true;
          this.TempSaudiFile_name = obj;

          console.log("isSaudiFileAlreadyAttached is true");
        }

        if (obj.includes('z1')) {
          this.isZakathFileAlreadyAttached = true;
          this.TempZakathFile_name = obj;

          console.log("isZakathFileAlreadyAttached is true");
        }

        if (obj.includes('a1')) {
          this.isAssociationFileAlreadyAttached = true;
          this.TempAssociationFile_name = obj;

          console.log("isAssociationFileAlreadyAttached is true");
        }

        if (obj.includes('m1')) {
          this.isOrgaizationChartFileAlreadyAttached = true;
          this.TempOrgaizationChartFile_name = obj;

          console.log("isOrgaizationChartFileAlreadyAttached is true");
        }

        if (obj.includes('a2')) {
          this.isAdditionalFileAlreadyAttached = true;
          this.TempAdditionalFile_name = obj;

          console.log("isAdditionalFileAlreadyAttached is true");
        }

        if (obj.includes('a3')) {
          this.isAdditionalFile2AlreadyAttached = true;
          this.TempAdditionalFile_name2 = obj;

          console.log("isAdditionalFileAlreadyAttached2 is true");
        }

        if (obj.includes('a4')) {
          this.isAdditionalFile3AlreadyAttached = true;
          this.TempAdditionalFile_name3 = obj;

          console.log("isAdditionalFileAlreadyAttached3 is true");
        }

        if (obj.includes('a5')) {
          this.isAdditionalFile4AlreadyAttached = true;
          this.TempAdditionalFile_name4 = obj;

          console.log("isAdditionalFileAlreadyAttached4 is true");
        }

        if (obj.includes('a6')) {
          this.isAdditionalFile5AlreadyAttached = true;
          this.TempAdditionalFile_name5 = obj;

          console.log("isAdditionalFileAlreadyAttached5 is true");
        }

        if (obj.includes('f1')) {
          this.isFinancialYear1FileAlreadyAttached = true;
          this.TempFinancialYear1File_name = obj;

          console.log("isFinancialYear1FileAlreadyAttached is true");
        }

        if (obj.includes('f2')) {
          this.isFinancialYear2FileAlreadyAttached = true;
          this.TempFinancialYear2File_name = obj;

          console.log("isFinancialYear2FileAlreadyAttached is true");
        }

        if (obj.includes('f3')) {
          this.isFinancialYear3FileAlreadyAttached = true;
          this.TempFinancialYear3File_name = obj;

          console.log("isFinancialYear3FileAlreadyAttached is true");
        }

        /* Supplier Detail Ends */

        /* Experience & Qualifiaction Tab Starts */

        if (obj.includes('e1')) {
          this.isDesignFileAlreadyAttached = true;
          this.TempDesignFile_name = obj;

          console.log("isDesignFileAlreadyAttached:  is true");
        }

        if (obj.includes('e2')) {
          this.isFinishFileAlreadyAttached = true;
          this.TempFinishFile_name = obj;

          console.log("isFinishFileAlreadyAttached:  is true");
        }

        if (obj.includes('e3')) {
          this.isRegisteredFileAlreadyAttached = true;
          this.TempRegisteredFile_name = obj;

          console.log("isRegisteredFileAlreadyAttached:  is true");
        }

        if (obj.includes('e4')) {
          this.isBusinessReferencesFileAlreadyAttached = true;
          this.TempBusinessReferencesFile_name = obj;

          console.log("isBusinessReferencesFileAlreadyAttached:  is true");
        }

        if (obj.includes('e5')) {
          this.isPreventionOfCorruptionFileAlreadyAttached = true;
          this.TempComplianceFile_name = obj;

          console.log("isPreventionOfCorruptionFileAlreadyAttached:  is true");
        }

        if (obj.includes('h1')) {
          this.isHseFileAlreadyAttached = true;
          this.TempHseFile_name = obj;

          console.log("isHseFileAlreadyAttached:  is true");
        }

        if (obj.includes('h2')) {
          this.isDocuFileAlreadyAttached = true;
          this.TempDocuFile_name = obj;

          console.log("isDocuFileAlreadyAttached:  is true");
        }

        if (obj.includes('h3')) {
          this.isISOHealthFileAlreadyAttached = true;
          this.TempISOHealthFile_name = obj;

          console.log("isISOHealthFileAlreadyAttached:  is true");
        }

        if (obj.includes('h4')) {
          this.isEnvtFileAlreadyAttached = true;
          this.TempEnvtFile_name = obj;

          console.log("isEnvtFileAlreadyAttached:  is true");
        }

        if (obj.includes('h6')) {
          this.isHseStaticDocFileAlreadyAttached = true;
          this.TempStaticFile_name = obj;

          console.log("isHseStaticDocFileAlreadyAttached:  is true");
        }

        if (obj.includes('q1')) {
          this.isQualityPolicyFileAlreadyAttached = true;
          this.TempQualityPolicyFile_name = obj;

          console.log("isQualityPolicyFileAlreadyAttached:  is true");
        }

        if (obj.includes('q2')) {
          this.isQualityMgtFileAlreadyAttached = true;
          this.TempQualityMgtFile_name = obj;

          console.log("isQualityMgtFileAlreadyAttached:  is true");
        }

        if (obj.includes('q3')) {
          this.isQualityMgtISOFileAlreadyAttached = true;
          this.TempQualityMgtISOFile_name = obj;

          console.log("isQualityMgtISOFileAlreadyAttached:  is true");
        }

        if (obj.includes('b1')) {
          this.isBankFileAlreadyAttached = true;
          this.TempBankFile_name = obj;

          this.b1FileLoaded = true;
          console.log("isBankFileAlreadyAttached:  is true");
        }

        if (obj.includes('b2')) {
          this.isBankLetterHeadFileAlreadyAttached = true;
          this.TempBankLetterHeadFile_name = obj;

          this.b2FileLoaded = true;
          console.log("isBankLetterHeadFileAlreadyAttached:  is true");
        }
      }
      /* Experience & Qualifiaction Tab Ends */
    }

  }

  public getMasterData() {
    this.http.get(environment.nodeurl + '/api/template/masterdata').subscribe(data2 => {
      debugger
      console.log('data2 ' + data2)
      if (data2) {
        var categoryLimit = data2["categoryLimit"]["categoryLimit"];
        localStorage.setItem("categoryLimit", categoryLimit);
        this.countryList = [];
        this.originalCountryList = data2["countryList"];
        this.countryList = data2["countryList"].map(x => x.description);

        this.currencyCodeList = [];
        this.currencyCodeList = data2["currencyList"];
        // this.currencyCodeList = data2["currencyList"].map(x=>x.description);

        this.banknameList = [];
        this.selectedBankList = [];
        this.banknameList = data2["bankList"];
        this.selectedBankList = this.banknameList;

        this.cityList = [];
        this.cityListOriginal = data2["cityList"];
        // this.cityList = data2["cityList"];
      }

      this.findAlreadyAddedPhotos();

    });
  }

  public getMasterData1() {
      const data2 = JSON.parse(localStorage.getItem("masterdata"));
      debugger
      console.log('data2 ' + data2)
      if (data2) {
        var categoryLimit = data2["categoryLimit"]["categoryLimit"];
        localStorage.setItem("categoryLimit", categoryLimit);
        this.countryList = [];
        this.originalCountryList = data2["countryList"];
        this.countryList = data2["countryList"].map(x => x.description);

        this.currencyCodeList = [];
        this.currencyCodeList = data2["currencyList"];
        // this.currencyCodeList = data2["currencyList"].map(x=>x.description);

        this.banknameList = [];
        this.selectedBankList = [];
        this.banknameList = data2["bankList"];
        this.selectedBankList = this.banknameList;

        this.cityList = [];
        this.cityListOriginal = data2["cityList"];
        // this.cityList = data2["cityList"];
      }

      this.findAlreadyAddedPhotos();

  }

  public download(fileUrl: string) {
    console.log('hit download');

    // https://localhost:44304/api/file/download?fileUrl=Resources/Images/0_b1.pdf

    window.location.href = environment.nodeurl + '/api/file/download?fileUrl=' + fileUrl;


    // this.http.get(environment.nodeurl+'/api/file/download?fileUrl='+fileUrl).subscribe(data => this.photos = data['']);

    // this.http.get(environment.nodeurl+'/api/file/download/fileUrl', {
    //   reportProgress: true,
    //   responseType: 'blob',
    // });
  }

  public downloadDraft(fileUrl: string) {
    console.log('hit download');
    // https://localhost:44304/api/file/download?fileUrl=Resources/Images/0_b1.pdf
    window.location.href = environment.nodeurl + '/api/file/downloadDraft?fileUrl=' + fileUrl;
    // this.http.get(environment.nodeurl+'/api/file/download?fileUrl='+fileUrl).subscribe(data => this.photos = data['']);
    // this.http.get(environment.nodeurl+'/api/file/download/fileUrl', {
    //   reportProgress: true,
    //   responseType: 'blob',
    // });
  }

  public downloadNeedmore(fileUrl: string) {
    console.log('hit download');
    // https://localhost:44304/api/file/download?fileUrl=Resources/Images/0_b1.pdf
    window.location.href = environment.nodeurl + '/api/file/downloadNeedmore?fileUrl=' + fileUrl;
    // this.http.get(environment.nodeurl+'/api/file/download?fileUrl='+fileUrl).subscribe(data => this.photos = data['']);
    // this.http.get(environment.nodeurl+'/api/file/download/fileUrl', {
    //   reportProgress: true,
    //   responseType: 'blob',
    // });
  }

  public downloadEmerg(fileUrl: string) {
    window.location.href = environment.nodeurl + '/api/file/downloadEmergency?fileUrl=' + fileUrl;
  }

  createImgPath(photo) {
    return environment.nodeurl + '/Resources/Images/' + photo;
  }

  public uploadingFile() {
    this.uploaderTemp.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('supplierid', '5');
      fileItem.url = environment.nodeurl + '/api/file/upload';
    };
    this.uploaderTemp.uploadAll();

  }

  async fileUploading(supplierId) {

    // File Upload starts
    console.log('File uploading started');
    this.uploader = this.uploaderTemp;
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {

      form.append('supplierid', supplierId);


      fileItem.url = environment.nodeurl + '/api/file/upload';
    };
    this.uploader.uploadAll();
    if (this.istempFile) {
      this.supplierIdforRegister = supplierId.toString();
      this.migrateFiles(this.supplierIdforTemp, this.supplierIdforRegister);
    }

    if (this.rejectedSupplierId > 0) {
      this.supplierIdforRegister = supplierId.toString();
      if (this.istempFile) {
        this.migrateFiles(this.supplierIdforTemp, this.supplierIdforRegister);
      } else {
        this.migrateRejectedFiles(this.rejectedSupplierId.toString(), this.supplierIdforRegister, 'reg');
      }
    }

    console.log('File uploading ends');


    // File Upload ends
    this.uploadingDone = true;
  }

  async fileUploading2(supplierId, supplierEmail, oldsupplierId, rejectedSupplierId, isEmergency, bothselected, emgsupplierid) {
    console.log('File uploading started');

    const formData = new FormData();

    if (this.selectedFiles && this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((f, index) => {
        formData.append('certificates', f, "" + this.selectedFileName[index]);
        formData.append('supplierid', supplierId.toString());
        formData.append('email', supplierEmail);
        if (isEmergency) {
          formData.append('oldsupplierid', emgsupplierid);
        } else {
          formData.append('oldsupplierid', oldsupplierId);
        }
        formData.append('isneedmore', this.isNeedmoreInfo.toString());
        formData.append('needmorerole', this.NeedmoreRole);
        formData.append('rejectedsupplierid', rejectedSupplierId);
        formData.append('istempfile', this.istempFile.toString());
        formData.append('isEmergency', isEmergency.toString());
        formData.append('bothselected', bothselected.toString());

      });
    } else {
      formData.append('certificates', "");
      formData.append('supplierid', supplierId.toString());
      formData.append('email', supplierEmail);
      if (isEmergency) {
        formData.append('oldsupplierid', emgsupplierid);
      } else {
        formData.append('oldsupplierid', oldsupplierId);
      }
      formData.append('isneedmore', this.isNeedmoreInfo.toString());
      formData.append('needmorerole', this.NeedmoreRole);
      formData.append('rejectedsupplierid', rejectedSupplierId);
      formData.append('istempfile', this.istempFile.toString());
      formData.append('isEmergency', isEmergency.toString());
      formData.append('bothselected', bothselected.toString());

    }


    this.http.post<any>(environment.nodeurl + '/api/file/UploadFileQueueSubmit', formData).subscribe(data => {
      var responseonqueue = data;
      if (this.isNeedmoreInfo) {
        if (this.isNeedmoreInfo) {

          Swal.close();

          Swal.fire({
            title:  "Supplier data updated successfully",
            html: "<p style='font-size: 18px;'>Supplier editted has been submitted successfully. </p>",
            width: "1200px",
            showCancelButton: false,
            confirmButtonText: `Close`,
            allowOutsideClick: false
          }).then(async (result) => {
            if (result.isConfirmed) {
              await this.sleep(5000);
            }
          });
          // });
        } else {

          Swal.close();
          Swal.fire({
            title: (this.isNeedmoreInfo && this.NeedmoreRole != '') ? "Additionally Requested Information Submitted" : " Additionally Requested Information Submitted",
            html: "<p style='font-size: 18px;'>Your application has been submitted successfully. We'll get back to you soon. Your temporary number is <b> IMI-" + "2022" + "-" + supplierId + "</b>, kindly use this number for your reference. </p></br></br><p style='font-size: 18px;'>For further information please contact: SRM@IMI-KSA.com</p>",
            width: "1200px",
            showCancelButton: false,
            confirmButtonText: `Close`,
            allowOutsideClick: false
          }).then((result) => {
            if (result.isConfirmed) {

            }
          });
          // });
        }
      }
    }, error => {
      Swal.close();
    });

    console.log('File uploading ends');
    // File Upload ends
    this.uploadingDone = true;
  }

 
 
  async srmEmailSend(supplierId) {
    this.http.post<any>(environment.nodeurl + '/api/email/sendsrmmail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + supplierId + '&content=' + 'new' + '&category=srm', null).subscribe(data => {

    });
  }

  testScreenshotImage() {

    var data = document.getElementById('htmlData');
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      let imgWidth = 100;
      let pageHeight = 295;
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      this.contentDataURL = canvas.toDataURL('image/png');

      console.log(this.contentDataURL);
      var filename = "filename_" + this.supplier_id + "_.png";

      this.htmlCanvas = canvas;

    });
  }

  async submitSupplier() {
    if (this.supplier && this.supplier.supplier_id && this.savedCategory == 'reg') {
      this.isDisabled = true;
      await this.validateform();
      if (this.alertmessage == '') { this.creatEmp(); }
    } else {

      await this.validateform();
      if (this.alertmessage == '') {
        this.http.get(environment.nodeurl + '/api/supplier/isRegistered?searchValue=' + this.firstFormGroup.value.supplierNameCtrl)
          .subscribe(data => {
            if (data != undefined && (data['supplieR_ID'] > 0) && data['status'] != 'Reactivated') {
              Swal.fire('Supplier Already Registered !', 'Supplier Id : ' + data['supplieR_ID'], 'success').then((result) => {
                location.reload();
              });;
            } else if (data != undefined && (data['supplieR_ID'] > 0) && data['status'] == 'Reactivated') {
              this.rejectedSupplierId = data['supplieR_ID'];
              this.creatEmp();
            }
            else {
              this.creatEmp();
            }
          });
      }
    }
  }

  async validateform() {
    this.alertmessage = '';
    let category = this.activatedRoute.snapshot.params.cat;

    this.onKeySearchBicSubmit();
    this.onKeySearchIbanSubmit();

    this.onEmpEnter();

    // if((category == 'emg' && this.firstFormGroup.value.supplierNameCtrl != '' && this.supplier.supplier_name != this.firstFormGroup.value.supplierNameCtrl)  ||
    //  (category == 'inv' && this.firstFormGroup.value.supplierNameCtrl != '' && this.supplier.supplier_name != this.firstFormGroup.value.supplierNameCtrl) || (category == 'tmp' && this.supplier.supplier_name != this.firstFormGroup.value.supplierNameCtrl) ||
    //  (category && category.indexOf('R_') > -1 && this.supplier.supplier_name != this.firstFormGroup.value.supplierNameCtrl)){
    //   this.executeListing(this.firstFormGroup.value.supplierNameCtrl,'N');
    //  }

    //  if((category == 'emg' && this.firstFormGroup.value.emailCtrl != '' && this.supplier.email != this.firstFormGroup.value.emailCtrl)  ||
    //  (category == 'inv' && this.firstFormGroup.value.emailCtrl != '' && this.supplier.email != this.firstFormGroup.value.emailCtrl) || (category == 'tmp' && this.supplier.email != this.firstFormGroup.value.emailCtrl) ||
    //  (category && category.indexOf('R_') > -1 && this.supplier.email != this.firstFormGroup.value.emailCtrl)){
    //   this.executeListing(this.firstFormGroup.value.emailCtrl,'E');
    //  }

    //  if((category == 'emg' && this.firstFormGroup.value.registrationCtrl != '' && this.supplier.cr_no != this.firstFormGroup.value.registrationCtrl)  ||
    //  (category == 'inv' && this.firstFormGroup.value.registrationCtrl != '' && this.supplier.cr_no != this.firstFormGroup.value.registrationCtrl) || (category == 'tmp' && this.supplier.cr_no != this.firstFormGroup.value.registrationCtrl) ||
    //  (category && category.indexOf('R_') > -1 && this.supplier.cr_no != this.firstFormGroup.value.registrationCtrl)|| (category == undefined && this.firstFormGroup.value.registrationCtrl != '')){
    //   this.executeListing(this.firstFormGroup.value.registrationCtrl,'R');
    //  }

    if (this.isnameexists || (this.firstFormGroup.value.supplierNameCtrl != '' && this.firstFormGroup.controls.supplierNameCtrl.status == 'INVALID')) {
      { this.alertmessage += '• Supplier Name already exists \n'; }
    } else if (this.isemailexists || (this.firstFormGroup.value.emailCtrl != '' && (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.invalid != undefined && this.firstFormGroup.controls.emailCtrl.errors.invalid))) {
      { this.alertmessage += '• Supplier Email already exists \n'; }
    } else if (this.iscrnoexists || (this.firstFormGroup.value.registrationCtrl != '' && this.firstFormGroup.controls.registrationCtrl.status == 'INVALID')) { { this.alertmessage += '• Registration no already exists \n'; } }

    if (this.firstFormGroup.controls.supplierNameCtrl.errors && this.firstFormGroup.controls.supplierNameCtrl.errors.required) { this.alertmessage += '• Supplier Name is required \n'; }
    if (this.firstFormGroup.controls.establishmentYearCtrl.errors && this.firstFormGroup.controls.establishmentYearCtrl.errors.futureyear) { this.alertmessage += '• Establishment future year is not allowed \n'; }
    if (this.firstFormGroup.controls.establishmentYearCtrl.errors && (this.firstFormGroup.controls.establishmentYearCtrl.errors.pastyear || this.firstFormGroup.controls.establishmentYearCtrl.errors.invalidyear)) { this.alertmessage += '• Establishment year has invalid format \n'; }
    if (this.firstFormGroup.controls.websiteCtrl.errors && this.firstFormGroup.controls.websiteCtrl.errors.invalidWebsiteURL) { this.alertmessage += '• Website has invalid format \n'; }
    if (this.firstFormGroup.controls.supplierTypeCtrl.errors && this.firstFormGroup.controls.supplierTypeCtrl.errors.required) { this.alertmessage += '• Supplier Type  is required \n'; }
    if (this.firstFormGroup.controls.countryCtrl.errors && this.firstFormGroup.controls.countryCtrl.errors.required) { this.alertmessage += '• Country is required \n'; }
    if (this.firstFormGroup.controls.stateCtrl.errors && this.firstFormGroup.controls.stateCtrl.errors.required) { this.alertmessage += '• City is required \n'; }
    if (this.firstFormGroup.controls.otherCityCtrl.errors && this.firstFormGroup.controls.otherCityCtrl.errors.isexists) { this.alertmessage += '• City is already exists in the city list \n'; }
    if (this.firstFormGroup.value.otherCityCtrl == '' && this.firstFormGroup.value.stateCtrl == 'Other') { this.alertmessage += '• Other City is required \n ' }
    if (this.firstFormGroup.controls.addressLine1Ctrl.errors && this.firstFormGroup.controls.addressLine1Ctrl.errors.required) { this.alertmessage += '• Address Line 1 is required \n'; }
    if (this.firstFormGroup.controls.titleCtrl.errors && this.firstFormGroup.controls.titleCtrl.errors.required) { this.alertmessage += '• Primary - Title is required \n'; }
    if (this.firstFormGroup.controls.firstNameCtrl.errors && this.firstFormGroup.controls.firstNameCtrl.errors.required) { this.alertmessage += '• Primary - First Name is required \n'; }
    if (this.firstFormGroup.controls.lastNameCtrl.errors && this.firstFormGroup.controls.lastNameCtrl.errors.required) { this.alertmessage += '• Primary - Last Name is required \n'; }
    if (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.pattern) { this.alertmessage += '• Primary - Email has invalid format \n'; }
    if (this.firstFormGroup.controls.positionCtrl.errors && this.firstFormGroup.controls.positionCtrl.errors.required) { this.alertmessage += '• Primary - Position is required \n'; }
    if (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.required) { this.alertmessage += '• Primary - Email is required \n'; }
    if (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.email) { this.alertmessage += '• Primary - Email has invalid format \n'; }
    if (this.firstFormGroup.controls.telephoneNumberCtrl.errors && this.firstFormGroup.controls.telephoneNumberCtrl.errors.required) { this.alertmessage += '• Primary - Telephone No is required \n'; }
    if (this.firstFormGroup.controls.mobileNumberCtrl.errors && this.firstFormGroup.controls.mobileNumberCtrl.errors.required) { this.alertmessage += '• Primary - Mobile No is required \n'; }




    if (this.additionalContact1) {
      if (this.firstFormGroup.value.titleCtrl1 == null || this.firstFormGroup.value.titleCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-Title is required \n ';
      }
      if (this.firstFormGroup.value.firstNameCtrl1 == null || this.firstFormGroup.value.firstNameCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-First Name is required \n ';
      }
      if (this.firstFormGroup.value.lastNameCtrl1 == null || this.firstFormGroup.value.lastNameCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-Last Name is required \n ';
      }
      if (this.firstFormGroup.value.positionCtrl1 == null || this.firstFormGroup.value.positionCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-Position is required \n ';
      }
      if (this.firstFormGroup.value.emailCtrl1 == null || this.firstFormGroup.value.emailCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-Email is required \n ';
      }
      if (this.firstFormGroup.value.telephoneNumberCtrl1 == null || this.firstFormGroup.value.telephoneNumberCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-Telephone No is required \n ';
      }
      if (this.firstFormGroup.value.mobileNumberCtrl1 == null || this.firstFormGroup.value.mobileNumberCtrl1 == '') {
        this.alertmessage += '• Additional Contact 1-Mobile No is required \n ';
      }
      if (this.additionalEmailCheckPattern1) {
        this.alertmessage += '• Additional Contact 1-Email has invalid format \n ';
      }
      if(this.additionalEmailCheck1){
        this.alertmessage += '• Additional Contact 1-Email already exists \n ';
      }
    }

    if (this.additionalContact2) {
      if (this.firstFormGroup.value.titleCtrl2 == null || this.firstFormGroup.value.titleCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-Title is required \n '; }
      if (this.firstFormGroup.value.firstNameCtrl2 == null || this.firstFormGroup.value.firstNameCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-First Name is required \n '; }
      if (this.firstFormGroup.value.lastNameCtrl2 == null || this.firstFormGroup.value.lastNameCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-Last Name is required \n '; }
      if (this.firstFormGroup.value.positionCtrl2 == null || this.firstFormGroup.value.positionCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-Position is required \n '; }
      if (this.firstFormGroup.value.emailCtrl2 == null || this.firstFormGroup.value.emailCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-Email is required \n '; }
      if (this.firstFormGroup.value.telephoneNumberCtrl2 == null || this.firstFormGroup.value.telephoneNumberCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-Telephone No is required \n '; }
      if (this.firstFormGroup.value.mobileNumberCtrl2 == null || this.firstFormGroup.value.mobileNumberCtrl2 == '') { this.alertmessage += '• Additional Contact ' + this.contactsequence + '-Mobile No is required \n '; }
      if (this.additionalEmailCheckPattern2) {
        this.alertmessage += '• Additional Contact 2-Email has invalid format \n ';
      }
      if(this.additionalEmailCheck2){
        this.alertmessage += '• Additional Contact 2-Email already exists \n ';
      }
    }

    if (this.firstFormGroup.controls.registrationCtrl.errors && this.firstFormGroup.controls.registrationCtrl.errors.required) { this.alertmessage += '• Company Certificate/Licence/CR# is required \n'; }
    if (!this.isRegFileSelected) { this.alertmessage += '• Valid Certificate/Licence/CR File is required \n '; }
    if (this.showErrorForRegDate) { this.alertmessage += '• Registration exp date is required \n '; }
    if ((this.firstFormGroup.controls.reghijri.errors && this.firstFormGroup.controls.reghijri.errors.invalid) || (this.firstFormGroup.controls.reggregory.errors && this.firstFormGroup.controls.reggregory.errors.invalid)) { this.alertmessage += '• Past Registration date is not allowed \n'; }
    if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && (this.firstFormGroup.controls.vatCtrl.value == null || this.firstFormGroup.controls.vatCtrl.value == '')) { this.alertmessage += '• Vat No is required \n '; }
    if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isVatFileSelected) { this.alertmessage += '• Valid Vat File is required \n '; }
    if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isGosiFileSelected) { this.alertmessage += '• Valid Gosi File is required \n '; }
    if (this.showErrorForGosiDate) { this.alertmessage += '• GOSI exp date is required \n '; }
    if ((this.firstFormGroup.controls.gosihijri.errors && this.firstFormGroup.controls.gosihijri.errors.invalid) || (this.firstFormGroup.controls.gosigregory.errors && this.firstFormGroup.controls.gosigregory.errors.invalid)) { this.alertmessage += '• Past Gosi date is not allowed \n'; }
    if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isSaudiFileSelected) { this.alertmessage += '• Valid Saudi File is required \n '; }
    if (this.showErrorForSaudiDate) { this.alertmessage += '• Saudi exp date is required \n '; }
    if ((this.firstFormGroup.controls.saudihijri.errors && this.firstFormGroup.controls.saudihijri.errors.invalid) || (this.firstFormGroup.controls.saudigregory.errors && this.firstFormGroup.controls.saudigregory.errors.invalid)) { this.alertmessage += '• Past Saudi date is not allowed \n'; }
    if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isZakathFileSelected) { this.alertmessage += '• Valid Zakath File is required \n '; }
    if (this.showErrorForZakathDate) { this.alertmessage += '• Zakath exp date is required \n '; }
    if ((this.firstFormGroup.controls.zakathijri.errors && this.firstFormGroup.controls.zakathijri.errors.invalid) || (this.firstFormGroup.controls.zakatgregory.errors && this.firstFormGroup.controls.zakatgregory.errors.invalid)) { this.alertmessage += '• Past Zakath date is not allowed \n'; }

    if (this.dataSourceAll && this.dataSourceAll.length == 0) { this.alertmessage += '• Categories required \n '; }

    if (this.secondFormGroup.get('typeOfOrganizationCtrl').value == 'Other - Please Specify' && (this.secondFormGroup.get('typeOfOrganization2Ctrl').value == null || this.secondFormGroup.get('typeOfOrganization2Ctrl').value == '')) { this.alertmessage += '• Type of Organization other field required \n '; }
    if (this.secondFormGroup.controls.typeOfOrganizationCtrl.errors && this.secondFormGroup.controls.typeOfOrganizationCtrl.errors.required) { this.alertmessage += '• Type of Organization is required \n'; }
    if (this.secondFormGroup.controls.managerialCtrl.errors && this.secondFormGroup.controls.managerialCtrl.errors.required) { this.alertmessage += '• Managerial Employee is required \n'; }
    if (this.secondFormGroup.controls.technicallCtrl.errors && this.secondFormGroup.controls.technicallCtrl.errors.required) { this.alertmessage += '• Technical Employee is required \n'; }
    if (this.secondFormGroup.controls.operationsCtrl.errors && this.secondFormGroup.controls.operationsCtrl.errors.required) { this.alertmessage += '• Operational Employee is required \n'; }
    if (this.secondFormGroup.controls.saudiNationalslCtrl.errors && this.secondFormGroup.controls.saudiNationalslCtrl.errors.exceed) { this.alertmessage += '• Saudi Nationals cannot be greater than total value\n '; }

    if (this.secondFormGroup.controls.operatingProfit1Ctrl.errors && this.secondFormGroup.controls.operatingProfit1Ctrl.errors.finance1year) { this.alertmessage += '• Finance Year1 future year is not allowed \n'; }
    if (this.secondFormGroup.controls.operatingProfit1Ctrl.errors && this.secondFormGroup.controls.operatingProfit1Ctrl.errors.finance1yearinvalid) { this.alertmessage += '• Finance Year1 has invalid format \n'; }
    if (this.secondFormGroup.controls.operatingProfit2Ctrl.errors && this.secondFormGroup.controls.operatingProfit2Ctrl.errors.pattern) { this.alertmessage += '• Operating profit only 2 decimal points are allowed \n'; }
    if (this.secondFormGroup.controls.netIncome1Ctrl.errors && this.secondFormGroup.controls.netIncome1Ctrl.errors.finance2year) { this.alertmessage += '• Finance Year2 future year is not allowed \n'; }
    if (this.secondFormGroup.controls.netIncome1Ctrl.errors && this.secondFormGroup.controls.netIncome1Ctrl.errors.finance2yearinvalid) { this.alertmessage += '• Finance Year2 has invalid format \n'; }
    if (this.secondFormGroup.controls.netIncome2Ctrl.errors && this.secondFormGroup.controls.netIncome2Ctrl.errors.pattern) { this.alertmessage += '• Net income only 2 decimal points are allowed \n'; }
    if (this.secondFormGroup.controls.currentAsset1Ctrl.errors && this.secondFormGroup.controls.currentAsset1Ctrl.errors.finance3year) { this.alertmessage += '• Finance Year3 future year is not allowed \n'; }
    if (this.secondFormGroup.controls.currentAsset1Ctrl.errors && this.secondFormGroup.controls.currentAsset1Ctrl.errors.finance3yearinvalid) { this.alertmessage += '• Finance Year3 has invalid format \n'; }
    if (this.secondFormGroup.controls.currentAsset2Ctrl.errors && this.secondFormGroup.controls.currentAsset2Ctrl.errors.pattern) { this.alertmessage += '• Current assest only 2 decimal points are allowed \n'; }
    if (this.secondFormGroup.controls.totalLiable1Ctrl.errors && this.secondFormGroup.controls.totalLiable1Ctrl.errors.finance4year) { this.alertmessage += '• Finance Year4 future year is not allowed \n'; }
    if (this.secondFormGroup.controls.totalLiable1Ctrl.errors && this.secondFormGroup.controls.totalLiable1Ctrl.errors.finance4yearinvalid) { this.alertmessage += '• Finance Year4 has invalid format \n'; }
    if (this.secondFormGroup.controls.totalLiable2Ctrl.errors && this.secondFormGroup.controls.totalLiable2Ctrl.errors.pattern) { this.alertmessage += '• Total liable only 2 decimal points are allowed \n'; }
    if (this.secondFormGroup.controls.totalEquity1Ctrl.errors && this.secondFormGroup.controls.totalEquity1Ctrl.errors.finance5year) { this.alertmessage += '• Finance Year5 future year is not allowed \n'; }
    if (this.secondFormGroup.controls.totalEquity1Ctrl.errors && this.secondFormGroup.controls.totalEquity1Ctrl.errors.finance5yearinvalid) { this.alertmessage += '• Finance Year5 has invalid format \n'; }
    if (this.secondFormGroup.controls.totalEquity2Ctrl.errors && this.secondFormGroup.controls.totalEquity2Ctrl.errors.pattern) { this.alertmessage += '• Total equity only 2 decimal points are allowed \n'; }

    if ((this.secondFormGroup.controls.ownsPlantEquipCtrl.errors && this.secondFormGroup.controls.ownsPlantEquipCtrl.errors.required) ||
      (this.secondFormGroup.controls.suspendedProj1Ctrl.errors && this.secondFormGroup.controls.suspendedProj1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.designnCapCtrl.errors && this.secondFormGroup.controls.designnCapCtrl.errors.required) ||
      (this.secondFormGroup.controls.finishProdCtrl.errors && this.secondFormGroup.controls.finishProdCtrl.errors.required) ||
      (this.secondFormGroup.controls.internalPolicyCtrl.errors && this.secondFormGroup.controls.internalPolicyCtrl.errors.required) ||
      (this.secondFormGroup.controls.registeredOrgCtrl.errors && this.secondFormGroup.controls.registeredOrgCtrl.errors.required)) { { this.alertmessage += '• Experience & Qualification details required \n '; }; }
    if ((this.isdesignnCapCtrl && !this.isDesignnCapCtrlSelected) || (this.isfinishProdCtrl && !this.isFinishProdCtrlSelected) || (this.isregisteredOrgCtrl && !this.isRegisteredOrgCtrlSelected)) { this.alertmessage += '• Experience & Qualification Files required \n ' }
    if (this.secondFormGroup.get('suspendedProj2Ctrl').errors && this.secondFormGroup.get('suspendedProj2Ctrl').errors.suspend) { this.alertmessage += '• Experience & Qualification Q.7 remark required \n ' }


    if ((this.secondFormGroup.controls.litigation1Ctrl.errors && this.secondFormGroup.controls.litigation1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.compliance1Ctrl.errors && this.secondFormGroup.controls.compliance1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.shareholder1Ctrl.errors && this.secondFormGroup.controls.shareholder1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.legalAsset1Ctrl.errors && this.secondFormGroup.controls.legalAsset1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.labour1Ctrl.errors && this.secondFormGroup.controls.labour1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.environment1Ctrl.errors && this.secondFormGroup.controls.environment1Ctrl.errors.required)) { { this.alertmessage += '• Legal details required \n '; }; }
    if ((this.iscompliance1Ctrl && !this.isCompliance1CtrlSelected)) { this.alertmessage += '• Legal File is required \n ' }
    if ((this.secondFormGroup.controls.litigation2Ctrl.errors && this.secondFormGroup.controls.litigation2Ctrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.imiInterested2trl.errors && this.secondFormGroup.controls.imiInterested2trl.status == 'INVALID') ||
      (this.secondFormGroup.controls.legalAsset2Ctrl.errors && this.secondFormGroup.controls.legalAsset2Ctrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.labour2Ctrl.errors && this.secondFormGroup.controls.labour2Ctrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.environment2Ctrl.errors && this.secondFormGroup.controls.environment2Ctrl.status == 'INVALID')) { { this.alertmessage += '• Legal Remarks required \n '; }; }
    if (this.secondFormGroup.controls.shareholder2Ctrl.errors && this.secondFormGroup.controls.shareholder2Ctrl.errors.litierror2) { this.alertmessage += '• Legal Q3. Remarks required \n '; }

    if ((this.secondFormGroup.controls.hse1Ctrl.errors && this.secondFormGroup.controls.hse1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.isohealthCtrl.errors && this.secondFormGroup.controls.isohealthCtrl.errors.required) ||
      (this.secondFormGroup.controls.docuHseCtrl.errors && this.secondFormGroup.controls.docuHseCtrl.errors.required) ||
      (this.secondFormGroup.controls.envtMgt1Ctrl.errors && this.secondFormGroup.controls.envtMgt1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.dedicatedpersCtrl.errors && this.secondFormGroup.controls.dedicatedpersCtrl.errors.required) ||
      (this.secondFormGroup.controls.statisticCtrl.errors && this.secondFormGroup.controls.statisticCtrl.errors.required)) { { this.alertmessage += '• Health & Safety details required \n '; }; }
    if ((this.ishse1Ctrl && !this.isHse1CtrlSelected) || (this.isdocuHseCtrl && !this.isDocuHseCtrlSelected) || (this.isisohealthCtrl && !this.isIsohealthCtrlSelected) || (this.isenvtMgt1Ctrl && !this.isEnvtMgt1CtrlSelected)) { this.alertmessage += '• Health & Safety Files required \n ' }
    if (this.secondFormGroup.controls.hseNameCtrl.errors && this.secondFormGroup.controls.hseNameCtrl.status == 'INVALID') { { this.alertmessage += '• Health & Safety Q5 Name required \n '; } }
    if (this.secondFormGroup.controls.hseDesigCtrl.errors && this.secondFormGroup.controls.hseDesigCtrl.status == 'INVALID') { { this.alertmessage += '• Health & Safety Q5 Designation required \n '; } }
    if ((this.secondFormGroup.controls.statisticNearCtrl.errors && this.secondFormGroup.controls.statisticNearCtrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.statisticFirstCtrl.errors && this.secondFormGroup.controls.statisticFirstCtrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.statisticMediCtrl.errors && this.secondFormGroup.controls.statisticMediCtrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.statisticLostCtrl.errors && this.secondFormGroup.controls.statisticLostCtrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.statisticFatalCtrl.errors && this.secondFormGroup.controls.statisticFatalCtrl.status == 'INVALID') ||
      (this.secondFormGroup.controls.statisticEnvtCtrl.errors && this.secondFormGroup.controls.statisticEnvtCtrl.status == 'INVALID')) { { this.alertmessage += '• Health & Safety Statistics required \n '; } }

    if ((this.secondFormGroup.controls.qualityPolicy1Ctrl.errors && this.secondFormGroup.controls.qualityPolicy1Ctrl.errors.required) ||
      (this.secondFormGroup.controls.qualityMgtCtrl.errors && this.secondFormGroup.controls.qualityMgtCtrl.errors.required) ||
      (this.secondFormGroup.controls.qualityMgtIsoCtrl.errors && this.secondFormGroup.controls.qualityMgtIsoCtrl.errors.required) ||
      (this.secondFormGroup.controls.qualityResp1Ctrl.errors && this.secondFormGroup.controls.qualityResp1Ctrl.errors.required)) { { this.alertmessage += '• Quality Details required \n '; }; }
    if ((this.isqualityPolicy1Ctrl && !this.isQualityPolicy1CtrlSelected) || (this.isqualityMgtCtrl && !this.isQualityMgtCtrlSelected) || (this.isqualityMgtIsoCtrl && !this.isQualityMgtIsoCtrlSelected)) { this.alertmessage += '• Quality Files required \n ' }
    if (this.secondFormGroup.controls.qualityNameCtrl.errors && this.secondFormGroup.controls.qualityNameCtrl.status == 'INVALID') { { this.alertmessage += '• Quality Q4 Name required \n '; }; }
    if (this.secondFormGroup.controls.qualityDesigCtrl.errors && this.secondFormGroup.controls.qualityDesigCtrl.status == 'INVALID') { { this.alertmessage += '• Quality Q4 Designation required \n '; }; }
    if (this.secondFormGroup.controls.qualityreviewDateCtrl.errors && this.secondFormGroup.controls.qualityreviewDateCtrl.errors.qualitydatevalid) { this.alertmessage += '• Future Quality date is not allowed \n '; }


    if (this.thirdFormGroup.controls.bankCountryCodesCtrl.errors && this.thirdFormGroup.controls.bankCountryCodesCtrl.errors.required) { this.alertmessage += '• Bank Country Code is required \n '; }
    if (this.thirdFormGroup.controls.bankNameCtrl.errors && this.thirdFormGroup.controls.bankNameCtrl.errors.required) { this.alertmessage += '• Bank Name is required \n '; }
    if (this.thirdFormGroup.controls.otherNameCtrl.errors && this.thirdFormGroup.controls.otherNameCtrl.errors.bankNameRequired) { this.alertmessage += '• Bank Other Name is required \n '; }
    if (this.thirdFormGroup.controls.otherNameCtrl.errors && this.thirdFormGroup.controls.otherNameCtrl.errors.isexists) { this.alertmessage += '• Other Bank name is already exists in the list \n '; }
    if ((this.thirdFormGroup.controls.swiftCtrl.errors && this.thirdFormGroup.controls.swiftCtrl.errors.invalid && this.biccodeerror!='') || this.biccodeerror!='') { this.alertmessage += '• ' + this.biccodeerror + '\n '; }
    if (this.thirdFormGroup.controls.accountHolderNameCtrl.errors && this.thirdFormGroup.controls.accountHolderNameCtrl.errors.required) { this.alertmessage += '• Account Holder Name is required \n '; }
    if (this.thirdFormGroup.controls.accountNumberCtrl.errors && this.thirdFormGroup.controls.accountNumberCtrl.errors.required) { this.alertmessage += '• Account No is required \n '; }
    if (this.thirdFormGroup.controls.bankAddressLine1Ctrl.errors && this.thirdFormGroup.controls.bankAddressLine1Ctrl.errors.required) { this.alertmessage += '• Bank Address Line 1 is required \n '; }
    if (this.thirdFormGroup.controls.ibanNumberCtrl.errors && this.thirdFormGroup.controls.ibanNumberCtrl.errors.invalid) { this.alertmessage += '• ' + this.ibancodeerror + '\n '; }

    if (!this.b1FileLoaded) { this.alertmessage += '• Valid Bank Letter file is required \n '; }
    if (!this.b2FileLoaded) { this.alertmessage += '• Bank Information with Company Letter Head file is required \n '; }
    if (this.isemptyreg || this.isemptyvat || this.isemptygosi || this.isemptysaudi || this.isemptyzakath || this.isemptyassociation || this.isemptymanorg || this.isemptyfin1 || this.isemptyfin2
      || this.isemptyfin3 || this.isemptyorgdesign || this.isemptybusrefr || this.isemptytrainInfo || this.isemptyhse || this.isemptyhse2 || this.isemptyhse3 || this.isemptyhse4 || this.isemptyhse6
      || this.isemptyquality1 || this.isemptyquality2 || this.isemptyquality3 || this.isemptyadditional || this.isemptyadditional2 || this.isemptyadditional3 || this.isemptyadditional4
      || this.isemptyadditional5 || this.isemptybank || this.isemptybankletterhead) { this.alertmessage += '• Empty Files are not allowed \n '; }
    if (this.ismaxreg || this.ismaxvat || this.ismaxgosi || this.ismaxsaudi || this.ismaxzakath || this.ismaxassociation || this.ismaxmanorg || this.ismaxfin1 || this.ismaxfin2
      || this.ismaxfin3 || this.ismaxorgdesign || this.ismaxoutorg || this.ismaxthirdparty || this.ismaxbusrefr || this.ismaxtrainInfo || this.ismaxhse || this.ismaxhse2 || this.ismaxhse3 || this.ismaxhse4 || this.ismaxhse6
      || this.ismaxquality1 || this.ismaxquality2 || this.ismaxquality3 || this.ismaxadditional || this.ismaxadditional2 || this.ismaxadditional3 || this.ismaxadditional4
      || this.ismaxadditional5 || this.ismaxbank || this.ismaxbankletterhead) { this.alertmessage += '• Maximum file size is 5MB \n '; }
    if (this.isFormatreg || this.isFormatvat || this.isFormatgosi || this.isFormatsaudi || this.isFormatadditional || this.isFormatadditional2 || this.isFormatadditional3 || this.isFormatadditional4 || this.isFormatadditional5
      || this.isFormatbank || this.isFormatbankletterhead) { this.alertmessage += '• Not allowed to upload file with unsupported format \n '; }

    if (this.alertmessage != '') { this.toastSubmit(TYPE.WARNING, false, this.alertmessage); }

    this.firstFormGroup.get('supplierNameCtrl').markAsTouched();
    this.firstFormGroup.get('supplierTypeCtrl').markAsTouched();
    this.firstFormGroup.get('countryCtrl').markAsTouched();
    this.firstFormGroup.get('stateCtrl').markAsTouched();
    this.firstFormGroup.get('addressLine1Ctrl').markAsTouched();
    this.firstFormGroup.get('titleCtrl').markAsTouched();
    this.firstFormGroup.get('firstNameCtrl').markAsTouched();
    this.firstFormGroup.get('lastNameCtrl').markAsTouched();
    this.firstFormGroup.get('positionCtrl').markAsTouched();
    this.firstFormGroup.get('telephoneNumberCtrl').markAsTouched();
    this.firstFormGroup.get('emailCtrl').markAsTouched();
    this.firstFormGroup.get('mobileNumberCtrl').markAsTouched();
    this.firstFormGroup.get('registrationCtrl').markAsTouched();
    this.firstFormGroup.get('regfileoriCtrl').markAsTouched();
    // this.firstFormGroup.get('reggregory').markAsTouched();
    this.firstFormGroup.get('vatCtrl').markAsTouched();
    this.firstFormGroup.get('titleCtrl1').markAsTouched();
    this.firstFormGroup.get('firstNameCtrl1').markAsTouched();
    this.firstFormGroup.get('lastNameCtrl1').markAsTouched();
    this.firstFormGroup.get('positionCtrl1').markAsTouched();
    this.firstFormGroup.get('emailCtrl1').markAsTouched();
    this.firstFormGroup.get('telephoneNumberCtrl1').markAsTouched();
    this.firstFormGroup.get('mobileNumberCtrl1').markAsTouched();

    this.secondFormGroup.get('typeOfOrganizationCtrl').markAsTouched();
    this.secondFormGroup.get('managerialCtrl').markAsTouched();
    this.secondFormGroup.get('technicallCtrl').markAsTouched();
    this.secondFormGroup.get('operationsCtrl').markAsTouched();
    this.secondFormGroup.get('saudiNationalslCtrl').markAsTouched();
    this.secondFormGroup.get('ownsPlantEquipCtrl').markAsTouched();
    this.secondFormGroup.get('designnCapCtrl').markAsTouched();
    this.secondFormGroup.get('finishProdCtrl').markAsTouched();
    this.secondFormGroup.get('internalPolicyCtrl').markAsTouched();
    this.secondFormGroup.get('registeredOrgCtrl').markAsTouched();
    this.secondFormGroup.get('suspendedProj1Ctrl').markAsTouched();
    this.secondFormGroup.get('litigation1Ctrl').markAsTouched();
    this.secondFormGroup.get('compliance1Ctrl').markAsTouched();
    this.secondFormGroup.get('shareholder1Ctrl').markAsTouched();
    this.secondFormGroup.get('legalAsset1Ctrl').markAsTouched();
    this.secondFormGroup.get('labour1Ctrl').markAsTouched();
    this.secondFormGroup.get('environment1Ctrl').markAsTouched();
    this.secondFormGroup.get('imiInterested1trl').markAsTouched();
    this.secondFormGroup.get('hse1Ctrl').markAsTouched();
    this.secondFormGroup.get('docuHseCtrl').markAsTouched();
    this.secondFormGroup.get('isohealthCtrl').markAsTouched();
    this.secondFormGroup.get('envtMgt1Ctrl').markAsTouched();
    this.secondFormGroup.get('dedicatedpersCtrl').markAsTouched();
    this.secondFormGroup.get('statisticCtrl').markAsTouched();
    this.secondFormGroup.get('qualityPolicy1Ctrl').markAsTouched();
    this.secondFormGroup.get('qualityMgtCtrl').markAsTouched();
    this.secondFormGroup.get('qualityMgtIsoCtrl').markAsTouched();
    this.secondFormGroup.get('qualityResp1Ctrl').markAsTouched();
    this.secondFormGroup.get('qualityResp1Ctrl').markAsTouched();

    this.thirdFormGroup.get('bankCountryCodesCtrl').markAsTouched();
    this.thirdFormGroup.get('bankNameCtrl').markAsTouched();
    this.thirdFormGroup.get('accountHolderNameCtrl').markAsTouched();
    this.thirdFormGroup.get('accountNumberCtrl').markAsTouched();
    this.thirdFormGroup.get('bankAddressLine1Ctrl').markAsTouched();
    this.thirdFormGroup.get('bankfileoriCtrl').markAsTouched();
    this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsTouched();

  }

  async validateformTab($event) {
    let clickedIndex = $event.index;
    this.alertmessageTab = '';

    if(clickedIndex == 0 || clickedIndex == 1){

      if (this.isnameexists || (this.firstFormGroup.value.supplierNameCtrl != '' && this.firstFormGroup.controls.supplierNameCtrl.status == 'INVALID')) {
        { this.alertmessageTab += '• Supplier Name already exists \n'; }
      } else if (this.isemailexists || (this.firstFormGroup.value.emailCtrl != '' && (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.invalid != undefined && this.firstFormGroup.controls.emailCtrl.errors.invalid))) {
        { this.alertmessageTab += '• Supplier Email already exists \n'; }
      } else if (this.iscrnoexists || (this.firstFormGroup.value.registrationCtrl != '' && this.firstFormGroup.controls.registrationCtrl.status == 'INVALID')) { { this.alertmessageTab += '• Registration no already exists \n'; } }
  
      if (this.firstFormGroup.controls.supplierNameCtrl.errors && this.firstFormGroup.controls.supplierNameCtrl.errors.required) { this.alertmessageTab += '• Supplier Name is required \n'; }
      if (this.firstFormGroup.controls.establishmentYearCtrl.errors && this.firstFormGroup.controls.establishmentYearCtrl.errors.futureyear) { this.alertmessageTab += '• Establishment future year is not allowed \n'; }
      if (this.firstFormGroup.controls.establishmentYearCtrl.errors && (this.firstFormGroup.controls.establishmentYearCtrl.errors.pastyear || this.firstFormGroup.controls.establishmentYearCtrl.errors.invalidyear)) { this.alertmessageTab += '• Establishment year has invalid format \n'; }
      if (this.firstFormGroup.controls.websiteCtrl.errors && this.firstFormGroup.controls.websiteCtrl.errors.invalidWebsiteURL) { this.alertmessageTab += '• Website has invalid format \n'; }
      if (this.firstFormGroup.controls.supplierTypeCtrl.errors && this.firstFormGroup.controls.supplierTypeCtrl.errors.required) { this.alertmessageTab += '• Supplier Type  is required \n'; }
      if (this.firstFormGroup.controls.countryCtrl.errors && this.firstFormGroup.controls.countryCtrl.errors.required) { this.alertmessageTab += '• Country is required \n'; }
      if (this.firstFormGroup.controls.stateCtrl.errors && this.firstFormGroup.controls.stateCtrl.errors.required) { this.alertmessageTab += '• City is required \n'; }
      if (this.firstFormGroup.controls.otherCityCtrl.errors && this.firstFormGroup.controls.otherCityCtrl.errors.isexists) { this.alertmessageTab += '• City is already exists in the city list \n'; }
      if (this.firstFormGroup.value.otherCityCtrl == '' && this.firstFormGroup.value.stateCtrl == 'Other') { this.alertmessageTab += '• Other City is required \n ' }
      if (this.firstFormGroup.controls.addressLine1Ctrl.errors && this.firstFormGroup.controls.addressLine1Ctrl.errors.required) { this.alertmessageTab += '• Address Line 1 is required \n'; }
      if (this.firstFormGroup.controls.titleCtrl.errors && this.firstFormGroup.controls.titleCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - Title is required \n'; }
      if (this.firstFormGroup.controls.firstNameCtrl.errors && this.firstFormGroup.controls.firstNameCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - First Name is required \n'; }
      if (this.firstFormGroup.controls.lastNameCtrl.errors && this.firstFormGroup.controls.lastNameCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - Last Name is required \n'; }
      if (this.firstFormGroup.controls.positionCtrl.errors && this.firstFormGroup.controls.positionCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - Position is required \n'; }
      if (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - Email is required \n'; }
      if (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.pattern) { this.alertmessageTab += '• Primary Contact - Email has invalid format \n'; }
      if (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.email) { this.alertmessageTab += '• Primary Contact - Email has invalid format \n'; }
      if (this.firstFormGroup.controls.telephoneNumberCtrl.errors && this.firstFormGroup.controls.telephoneNumberCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - Telephone No is required \n'; }
      if (this.firstFormGroup.controls.mobileNumberCtrl.errors && this.firstFormGroup.controls.mobileNumberCtrl.errors.required) { this.alertmessageTab += '• Primary Contact - Mobile No is required \n'; }
  
  
  
  
      if (this.additionalContact1) {
        if (this.firstFormGroup.value.titleCtrl1 == null || this.firstFormGroup.value.titleCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-Title is required \n ';
        }
        if (this.firstFormGroup.value.firstNameCtrl1 == null || this.firstFormGroup.value.firstNameCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-First Name is required \n ';
        }
        if (this.firstFormGroup.value.lastNameCtrl1 == null || this.firstFormGroup.value.lastNameCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-Last Name is required \n ';
        }
        if (this.firstFormGroup.value.positionCtrl1 == null || this.firstFormGroup.value.positionCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-Position is required \n ';
        }
        if (this.firstFormGroup.value.emailCtrl1 == null || this.firstFormGroup.value.emailCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-Email is required \n ';
        }
        if (this.additionalEmailCheckPattern1) {
          this.alertmessageTab += '• Additional Contact 1-Email has invalid format \n ';
        }
        if(this.additionalEmailCheck1){
          this.alertmessageTab += '• Additional Contact 1-Email already exists \n ';
        }
        if (this.firstFormGroup.value.telephoneNumberCtrl1 == null || this.firstFormGroup.value.telephoneNumberCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-Telephone No is required \n ';
        }
        if (this.firstFormGroup.value.mobileNumberCtrl1 == null || this.firstFormGroup.value.mobileNumberCtrl1 == '') {
          this.alertmessageTab += '• Additional Contact 1-Mobile No is required \n ';
        }
        
      }
  
      if (this.additionalContact2) {
        if (this.firstFormGroup.value.titleCtrl2 == null || this.firstFormGroup.value.titleCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-Title is required \n '; }
        if (this.firstFormGroup.value.firstNameCtrl2 == null || this.firstFormGroup.value.firstNameCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-First Name is required \n '; }
        if (this.firstFormGroup.value.lastNameCtrl2 == null || this.firstFormGroup.value.lastNameCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-Last Name is required \n '; }
        if (this.firstFormGroup.value.positionCtrl2 == null || this.firstFormGroup.value.positionCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-Position is required \n '; }
        if (this.firstFormGroup.value.emailCtrl2 == null || this.firstFormGroup.value.emailCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-Email is required \n '; }
        if (this.additionalEmailCheckPattern2) {
          this.alertmessageTab += '• Additional Contact 2-Email has invalid format \n ';
        }
        if(this.additionalEmailCheck2){
          this.alertmessageTab += '• Additional Contact 2-Email already exists \n ';
        }
        if (this.firstFormGroup.value.telephoneNumberCtrl2 == null || this.firstFormGroup.value.telephoneNumberCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-Telephone No is required \n '; }
        if (this.firstFormGroup.value.mobileNumberCtrl2 == null || this.firstFormGroup.value.mobileNumberCtrl2 == '') { this.alertmessageTab += '• Additional Contact ' + this.contactsequence + '-Mobile No is required \n '; }
        
      }
  
      if (this.firstFormGroup.controls.registrationCtrl.errors && this.firstFormGroup.controls.registrationCtrl.errors.required) { this.alertmessageTab += '• Company Certificate/Licence/CR# is required \n'; }
      if (!this.isRegFileSelected) { this.alertmessageTab += '• Valid Certificate/Licence/CR File is required \n '; }
      if (this.showErrorForRegDate) { this.alertmessageTab += '• Registration exp date is required \n '; }
      if ((this.firstFormGroup.controls.reghijri.errors && this.firstFormGroup.controls.reghijri.errors.invalid) || (this.firstFormGroup.controls.reggregory.errors && this.firstFormGroup.controls.reggregory.errors.invalid)) { this.alertmessageTab += '• Past Registration date is not allowed \n'; }
      if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && (this.firstFormGroup.controls.vatCtrl.value == null || this.firstFormGroup.controls.vatCtrl.value == '')) { this.alertmessageTab += '• Vat No is required \n '; }
      if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isVatFileSelected) { this.alertmessageTab += '• Valid Vat File is required \n '; }
      if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isGosiFileSelected) { this.alertmessageTab += '• Valid Gosi File is required \n '; }
      if (this.showErrorForGosiDate) { this.alertmessageTab += '• GOSI exp date is required \n '; }
      if ((this.firstFormGroup.controls.gosihijri.errors && this.firstFormGroup.controls.gosihijri.errors.invalid) || (this.firstFormGroup.controls.gosigregory.errors && this.firstFormGroup.controls.gosigregory.errors.invalid)) { this.alertmessageTab += '• Past Gosi date is not allowed \n'; }
      if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isSaudiFileSelected) { this.alertmessageTab += '• Valid Saudi File is required \n '; }
      if (this.showErrorForSaudiDate) { this.alertmessageTab += '• Saudi exp date is required \n '; }
      if ((this.firstFormGroup.controls.saudihijri.errors && this.firstFormGroup.controls.saudihijri.errors.invalid) || (this.firstFormGroup.controls.saudigregory.errors && this.firstFormGroup.controls.saudigregory.errors.invalid)) { this.alertmessageTab += '• Past Saudi date is not allowed \n'; }
      if (this.firstFormGroup.get('countryCtrl').value == 'SAUDI ARABIA' && !this.isZakathFileSelected) { this.alertmessageTab += '• Valid Zakath File is required \n '; }
      if (this.showErrorForZakathDate) { this.alertmessageTab += '• Zakath exp date is required \n '; }
      if ((this.firstFormGroup.controls.zakathijri.errors && this.firstFormGroup.controls.zakathijri.errors.invalid) || (this.firstFormGroup.controls.zakatgregory.errors && this.firstFormGroup.controls.zakatgregory.errors.invalid)) { this.alertmessageTab += '• Past Zakath date is not allowed \n'; }
  
      if (this.dataSourceAll && this.dataSourceAll.length == 0) { this.alertmessageTab += '• Categories required \n '; }

      
    }else if(clickedIndex == 2){
      this.alertmessageTab = '';
      this.onKeySearchBicSubmit();
      this.onKeySearchIbanSubmit();
  
      this.onEmpEnter();
  
      
      if (this.secondFormGroup.get('typeOfOrganizationCtrl').value == 'Other - Please Specify' && (this.secondFormGroup.get('typeOfOrganization2Ctrl').value == null || this.secondFormGroup.get('typeOfOrganization2Ctrl').value == '')) { this.alertmessageTab += '• Type of Organization other field required \n '; }
      if (this.secondFormGroup.controls.typeOfOrganizationCtrl.errors && this.secondFormGroup.controls.typeOfOrganizationCtrl.errors.required) { this.alertmessageTab += '• Type of Organization is required \n'; }
      if (this.secondFormGroup.controls.managerialCtrl.errors && this.secondFormGroup.controls.managerialCtrl.errors.required) { this.alertmessageTab += '• Managerial Employee is required \n'; }
      if (this.secondFormGroup.controls.technicallCtrl.errors && this.secondFormGroup.controls.technicallCtrl.errors.required) { this.alertmessageTab += '• Technical Employee is required \n'; }
      if (this.secondFormGroup.controls.operationsCtrl.errors && this.secondFormGroup.controls.operationsCtrl.errors.required) { this.alertmessageTab += '• Operational Employee is required \n'; }
      if (this.secondFormGroup.controls.saudiNationalslCtrl.errors && this.secondFormGroup.controls.saudiNationalslCtrl.errors.exceed) { this.alertmessageTab += '• Saudi Nationals cannot be greater than total value\n '; }
  
      if (this.secondFormGroup.controls.operatingProfit1Ctrl.errors && this.secondFormGroup.controls.operatingProfit1Ctrl.errors.finance1year) { this.alertmessageTab += '• Finance Year1 future year is not allowed \n'; }
      if (this.secondFormGroup.controls.operatingProfit1Ctrl.errors && this.secondFormGroup.controls.operatingProfit1Ctrl.errors.finance1yearinvalid) { this.alertmessageTab += '• Finance Year1 has invalid format \n'; }
      if (this.secondFormGroup.controls.operatingProfit2Ctrl.errors && this.secondFormGroup.controls.operatingProfit2Ctrl.errors.pattern) { this.alertmessageTab += '• Operating profit only 2 decimal points are allowed \n'; }
      if (this.secondFormGroup.controls.netIncome1Ctrl.errors && this.secondFormGroup.controls.netIncome1Ctrl.errors.finance2year) { this.alertmessageTab += '• Finance Year2 future year is not allowed \n'; }
      if (this.secondFormGroup.controls.netIncome1Ctrl.errors && this.secondFormGroup.controls.netIncome1Ctrl.errors.finance2yearinvalid) { this.alertmessageTab += '• Finance Year2 has invalid format \n'; }
      if (this.secondFormGroup.controls.netIncome2Ctrl.errors && this.secondFormGroup.controls.netIncome2Ctrl.errors.pattern) { this.alertmessageTab += '• Net income only 2 decimal points are allowed \n'; }
      if (this.secondFormGroup.controls.currentAsset1Ctrl.errors && this.secondFormGroup.controls.currentAsset1Ctrl.errors.finance3year) { this.alertmessageTab += '• Finance Year3 future year is not allowed \n'; }
      if (this.secondFormGroup.controls.currentAsset1Ctrl.errors && this.secondFormGroup.controls.currentAsset1Ctrl.errors.finance3yearinvalid) { this.alertmessageTab += '• Finance Year3 has invalid format \n'; }
      if (this.secondFormGroup.controls.currentAsset2Ctrl.errors && this.secondFormGroup.controls.currentAsset2Ctrl.errors.pattern) { this.alertmessageTab += '• Current assest only 2 decimal points are allowed \n'; }
      if (this.secondFormGroup.controls.totalLiable1Ctrl.errors && this.secondFormGroup.controls.totalLiable1Ctrl.errors.finance4year) { this.alertmessageTab += '• Finance Year4 future year is not allowed \n'; }
      if (this.secondFormGroup.controls.totalLiable1Ctrl.errors && this.secondFormGroup.controls.totalLiable1Ctrl.errors.finance4yearinvalid) { this.alertmessageTab += '• Finance Year4 has invalid format \n'; }
      if (this.secondFormGroup.controls.totalLiable2Ctrl.errors && this.secondFormGroup.controls.totalLiable2Ctrl.errors.pattern) { this.alertmessageTab += '• Total liable only 2 decimal points are allowed \n'; }
      if (this.secondFormGroup.controls.totalEquity1Ctrl.errors && this.secondFormGroup.controls.totalEquity1Ctrl.errors.finance5year) { this.alertmessageTab += '• Finance Year5 future year is not allowed \n'; }
      if (this.secondFormGroup.controls.totalEquity1Ctrl.errors && this.secondFormGroup.controls.totalEquity1Ctrl.errors.finance5yearinvalid) { this.alertmessageTab += '• Finance Year5 has invalid format \n'; }
      if (this.secondFormGroup.controls.totalEquity2Ctrl.errors && this.secondFormGroup.controls.totalEquity2Ctrl.errors.pattern) { this.alertmessageTab += '• Total equity only 2 decimal points are allowed \n'; }
  
      if ((this.secondFormGroup.controls.ownsPlantEquipCtrl.errors && this.secondFormGroup.controls.ownsPlantEquipCtrl.errors.required) ||
        (this.secondFormGroup.controls.suspendedProj1Ctrl.errors && this.secondFormGroup.controls.suspendedProj1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.designnCapCtrl.errors && this.secondFormGroup.controls.designnCapCtrl.errors.required) ||
        (this.secondFormGroup.controls.finishProdCtrl.errors && this.secondFormGroup.controls.finishProdCtrl.errors.required) ||
        (this.secondFormGroup.controls.internalPolicyCtrl.errors && this.secondFormGroup.controls.internalPolicyCtrl.errors.required) ||
        (this.secondFormGroup.controls.registeredOrgCtrl.errors && this.secondFormGroup.controls.registeredOrgCtrl.errors.required)) { { this.alertmessageTab += '• Experience & Qualification details required \n '; }; }
      if ((this.isdesignnCapCtrl && !this.isDesignnCapCtrlSelected) || (this.isfinishProdCtrl && !this.isFinishProdCtrlSelected) || (this.isregisteredOrgCtrl && !this.isRegisteredOrgCtrlSelected)) { this.alertmessageTab += '• Experience & Qualification Files required \n ' }
      if (this.secondFormGroup.get('suspendedProj2Ctrl').errors && this.secondFormGroup.get('suspendedProj2Ctrl').errors.suspend) { this.alertmessageTab += '• Experience & Qualification Q.7 remark required \n ' }
  
  
      if ((this.secondFormGroup.controls.litigation1Ctrl.errors && this.secondFormGroup.controls.litigation1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.compliance1Ctrl.errors && this.secondFormGroup.controls.compliance1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.shareholder1Ctrl.errors && this.secondFormGroup.controls.shareholder1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.legalAsset1Ctrl.errors && this.secondFormGroup.controls.legalAsset1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.labour1Ctrl.errors && this.secondFormGroup.controls.labour1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.environment1Ctrl.errors && this.secondFormGroup.controls.environment1Ctrl.errors.required)) { { this.alertmessageTab += '• Legal details required \n '; }; }
      if ((this.iscompliance1Ctrl && !this.isCompliance1CtrlSelected)) { this.alertmessageTab += '• Legal File is required \n ' }
      if ((this.secondFormGroup.controls.litigation2Ctrl.errors && this.secondFormGroup.controls.litigation2Ctrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.imiInterested2trl.errors && this.secondFormGroup.controls.imiInterested2trl.status == 'INVALID') ||
        (this.secondFormGroup.controls.legalAsset2Ctrl.errors && this.secondFormGroup.controls.legalAsset2Ctrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.labour2Ctrl.errors && this.secondFormGroup.controls.labour2Ctrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.environment2Ctrl.errors && this.secondFormGroup.controls.environment2Ctrl.status == 'INVALID')) { { this.alertmessageTab += '• Legal Remarks required \n '; }; }
      if (this.secondFormGroup.controls.shareholder2Ctrl.errors && this.secondFormGroup.controls.shareholder2Ctrl.errors.litierror2) { this.alertmessageTab += '• Legal Q3. Remarks required \n '; }
  
      if ((this.secondFormGroup.controls.hse1Ctrl.errors && this.secondFormGroup.controls.hse1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.isohealthCtrl.errors && this.secondFormGroup.controls.isohealthCtrl.errors.required) ||
        (this.secondFormGroup.controls.docuHseCtrl.errors && this.secondFormGroup.controls.docuHseCtrl.errors.required) ||
        (this.secondFormGroup.controls.envtMgt1Ctrl.errors && this.secondFormGroup.controls.envtMgt1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.dedicatedpersCtrl.errors && this.secondFormGroup.controls.dedicatedpersCtrl.errors.required) ||
        (this.secondFormGroup.controls.statisticCtrl.errors && this.secondFormGroup.controls.statisticCtrl.errors.required)) { { this.alertmessageTab += '• Health & Safety details required \n '; }; }
      if ((this.ishse1Ctrl && !this.isHse1CtrlSelected) || (this.isdocuHseCtrl && !this.isDocuHseCtrlSelected) || (this.isisohealthCtrl && !this.isIsohealthCtrlSelected) || (this.isenvtMgt1Ctrl && !this.isEnvtMgt1CtrlSelected)) { this.alertmessageTab += '• Health & Safety Files required \n ' }
      if (this.secondFormGroup.controls.hseNameCtrl.errors && this.secondFormGroup.controls.hseNameCtrl.status == 'INVALID') { { this.alertmessageTab += '• Health & Safety Q5 Name required \n '; } }
      if (this.secondFormGroup.controls.hseDesigCtrl.errors && this.secondFormGroup.controls.hseDesigCtrl.status == 'INVALID') { { this.alertmessageTab += '• Health & Safety Q5 Designation required \n '; } }
      if ((this.secondFormGroup.controls.statisticNearCtrl.errors && this.secondFormGroup.controls.statisticNearCtrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.statisticFirstCtrl.errors && this.secondFormGroup.controls.statisticFirstCtrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.statisticMediCtrl.errors && this.secondFormGroup.controls.statisticMediCtrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.statisticLostCtrl.errors && this.secondFormGroup.controls.statisticLostCtrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.statisticFatalCtrl.errors && this.secondFormGroup.controls.statisticFatalCtrl.status == 'INVALID') ||
        (this.secondFormGroup.controls.statisticEnvtCtrl.errors && this.secondFormGroup.controls.statisticEnvtCtrl.status == 'INVALID')) { { this.alertmessageTab += '• Health & Safety Statistics required \n '; } }
  
      if ((this.secondFormGroup.controls.qualityPolicy1Ctrl.errors && this.secondFormGroup.controls.qualityPolicy1Ctrl.errors.required) ||
        (this.secondFormGroup.controls.qualityMgtCtrl.errors && this.secondFormGroup.controls.qualityMgtCtrl.errors.required) ||
        (this.secondFormGroup.controls.qualityMgtIsoCtrl.errors && this.secondFormGroup.controls.qualityMgtIsoCtrl.errors.required) ||
        (this.secondFormGroup.controls.qualityResp1Ctrl.errors && this.secondFormGroup.controls.qualityResp1Ctrl.errors.required)) { { this.alertmessageTab += '• Quality Details required \n '; }; }
      if ((this.isqualityPolicy1Ctrl && !this.isQualityPolicy1CtrlSelected) || (this.isqualityMgtCtrl && !this.isQualityMgtCtrlSelected) || (this.isqualityMgtIsoCtrl && !this.isQualityMgtIsoCtrlSelected)) { this.alertmessageTab += '• Quality Files required \n ' }
      if (this.secondFormGroup.controls.qualityNameCtrl.errors && this.secondFormGroup.controls.qualityNameCtrl.status == 'INVALID') { { this.alertmessageTab += '• Quality Q4 Name required \n '; }; }
      if (this.secondFormGroup.controls.qualityDesigCtrl.errors && this.secondFormGroup.controls.qualityDesigCtrl.status == 'INVALID') { { this.alertmessageTab += '• Quality Q4 Designation required \n '; }; }
      if (this.secondFormGroup.controls.qualityreviewDateCtrl.errors && this.secondFormGroup.controls.qualityreviewDateCtrl.errors.qualitydatevalid) { this.alertmessageTab += '• Future Quality date is not allowed \n '; }
  
  
      if (this.thirdFormGroup.controls.bankCountryCodesCtrl.errors && this.thirdFormGroup.controls.bankCountryCodesCtrl.errors.required) { this.alertmessageTab += '• Bank Country Code is required \n '; }
      if (this.thirdFormGroup.controls.bankNameCtrl.errors && this.thirdFormGroup.controls.bankNameCtrl.errors.required) { this.alertmessageTab += '• Bank Name is required \n '; }
      if (this.thirdFormGroup.controls.otherNameCtrl.errors && this.thirdFormGroup.controls.otherNameCtrl.errors.bankNameRequired) { this.alertmessageTab += '• Bank Other Name is required \n '; }
      if (this.thirdFormGroup.controls.otherNameCtrl.errors && this.thirdFormGroup.controls.otherNameCtrl.errors.isexists) { this.alertmessageTab += '• Other Bank name is already exists in the list \n '; }
      if ((this.thirdFormGroup.controls.swiftCtrl.errors && this.thirdFormGroup.controls.swiftCtrl.errors.invalid && this.biccodeerror!='') || this.biccodeerror!='') { this.alertmessageTab += '• ' + this.biccodeerror + '\n '; }
      if (this.thirdFormGroup.controls.accountHolderNameCtrl.errors && this.thirdFormGroup.controls.accountHolderNameCtrl.errors.required) { this.alertmessageTab += '• Account Holder Name is required \n '; }
      if (this.thirdFormGroup.controls.accountNumberCtrl.errors && this.thirdFormGroup.controls.accountNumberCtrl.errors.required) { this.alertmessageTab += '• Account No is required \n '; }
      if (this.thirdFormGroup.controls.bankAddressLine1Ctrl.errors && this.thirdFormGroup.controls.bankAddressLine1Ctrl.errors.required) { this.alertmessageTab += '• Bank Address Line 1 is required \n '; }
      if (this.thirdFormGroup.controls.ibanNumberCtrl.errors && this.thirdFormGroup.controls.ibanNumberCtrl.errors.invalid) { this.alertmessageTab += '• ' + this.ibancodeerror + '\n '; }
  
      if (!this.b1FileLoaded) { this.alertmessageTab += '• Valid Bank Letter file is required \n '; }
      if (!this.b2FileLoaded) { this.alertmessageTab += '• Bank Information with Company Letter Head file is required \n '; }
      if (this.isemptyreg || this.isemptyvat || this.isemptygosi || this.isemptysaudi || this.isemptyzakath || this.isemptyassociation || this.isemptymanorg || this.isemptyfin1 || this.isemptyfin2
        || this.isemptyfin3 || this.isemptyorgdesign || this.isemptybusrefr || this.isemptytrainInfo || this.isemptyhse || this.isemptyhse2 || this.isemptyhse3 || this.isemptyhse4 || this.isemptyhse6
        || this.isemptyquality1 || this.isemptyquality2 || this.isemptyquality3 || this.isemptyadditional || this.isemptyadditional2 || this.isemptyadditional3 || this.isemptyadditional4
        || this.isemptyadditional5 || this.isemptybank || this.isemptybankletterhead) { this.alertmessageTab += '• Empty Files are not allowed \n '; }
      if (this.ismaxreg || this.ismaxvat || this.ismaxgosi || this.ismaxsaudi || this.ismaxzakath || this.ismaxassociation || this.ismaxmanorg || this.ismaxfin1 || this.ismaxfin2
        || this.ismaxfin3 || this.ismaxorgdesign || this.ismaxoutorg || this.ismaxthirdparty || this.ismaxbusrefr || this.ismaxtrainInfo || this.ismaxhse || this.ismaxhse2 || this.ismaxhse3 || this.ismaxhse4 || this.ismaxhse6
        || this.ismaxquality1 || this.ismaxquality2 || this.ismaxquality3 || this.ismaxadditional || this.ismaxadditional2 || this.ismaxadditional3 || this.ismaxadditional4
        || this.ismaxadditional5 || this.ismaxbank || this.ismaxbankletterhead) { this.alertmessageTab += '• Maximum file size is 5MB \n '; }
      if (this.isFormatreg || this.isFormatvat || this.isFormatgosi || this.isFormatsaudi || this.isFormatadditional || this.isFormatadditional2 || this.isFormatadditional3 || this.isFormatadditional4 || this.isFormatadditional5
        || this.isFormatbank || this.isFormatbankletterhead) { this.alertmessageTab += '• Not allowed to upload file with unsupported format \n '; }
  
      // if (this.thirdFormGroup.controls.termsandconditionCtrl.value != true) { this.alertmessageTab += '• Please select - I/We agree to abide with all the above-mentioned declarations \n '; }
  
    }

    
    if (this.alertmessageTab != '') { this.toastSubmit(TYPE.WARNING, false, this.alertmessageTab); }

    this.firstFormGroup.get('supplierNameCtrl').markAsTouched();
    this.firstFormGroup.get('supplierTypeCtrl').markAsTouched();
    this.firstFormGroup.get('countryCtrl').markAsTouched();
    this.firstFormGroup.get('stateCtrl').markAsTouched();
    this.firstFormGroup.get('addressLine1Ctrl').markAsTouched();
    this.firstFormGroup.get('titleCtrl').markAsTouched();
    this.firstFormGroup.get('firstNameCtrl').markAsTouched();
    this.firstFormGroup.get('lastNameCtrl').markAsTouched();
    this.firstFormGroup.get('positionCtrl').markAsTouched();
    this.firstFormGroup.get('telephoneNumberCtrl').markAsTouched();
    this.firstFormGroup.get('emailCtrl').markAsTouched();
    this.firstFormGroup.get('mobileNumberCtrl').markAsTouched();
    this.firstFormGroup.get('registrationCtrl').markAsTouched();
    this.firstFormGroup.get('regfileoriCtrl').markAsTouched();
    // this.firstFormGroup.get('reggregory').markAsTouched();
    this.firstFormGroup.get('vatCtrl').markAsTouched();
    this.firstFormGroup.get('titleCtrl1').markAsTouched();
    this.firstFormGroup.get('firstNameCtrl1').markAsTouched();
    this.firstFormGroup.get('lastNameCtrl1').markAsTouched();
    this.firstFormGroup.get('positionCtrl1').markAsTouched();
    this.firstFormGroup.get('emailCtrl1').markAsTouched();
    this.firstFormGroup.get('telephoneNumberCtrl1').markAsTouched();
    this.firstFormGroup.get('mobileNumberCtrl1').markAsTouched();

    this.secondFormGroup.get('typeOfOrganizationCtrl').markAsTouched();
    this.secondFormGroup.get('managerialCtrl').markAsTouched();
    this.secondFormGroup.get('technicallCtrl').markAsTouched();
    this.secondFormGroup.get('operationsCtrl').markAsTouched();
    this.secondFormGroup.get('saudiNationalslCtrl').markAsTouched();
    this.secondFormGroup.get('ownsPlantEquipCtrl').markAsTouched();
    this.secondFormGroup.get('designnCapCtrl').markAsTouched();
    this.secondFormGroup.get('finishProdCtrl').markAsTouched();
    this.secondFormGroup.get('internalPolicyCtrl').markAsTouched();
    this.secondFormGroup.get('registeredOrgCtrl').markAsTouched();
    this.secondFormGroup.get('suspendedProj1Ctrl').markAsTouched();
    this.secondFormGroup.get('litigation1Ctrl').markAsTouched();
    this.secondFormGroup.get('compliance1Ctrl').markAsTouched();
    this.secondFormGroup.get('shareholder1Ctrl').markAsTouched();
    this.secondFormGroup.get('legalAsset1Ctrl').markAsTouched();
    this.secondFormGroup.get('labour1Ctrl').markAsTouched();
    this.secondFormGroup.get('environment1Ctrl').markAsTouched();
    this.secondFormGroup.get('imiInterested1trl').markAsTouched();
    this.secondFormGroup.get('hse1Ctrl').markAsTouched();
    this.secondFormGroup.get('docuHseCtrl').markAsTouched();
    this.secondFormGroup.get('isohealthCtrl').markAsTouched();
    this.secondFormGroup.get('envtMgt1Ctrl').markAsTouched();
    this.secondFormGroup.get('dedicatedpersCtrl').markAsTouched();
    this.secondFormGroup.get('statisticCtrl').markAsTouched();
    this.secondFormGroup.get('qualityPolicy1Ctrl').markAsTouched();
    this.secondFormGroup.get('qualityMgtCtrl').markAsTouched();
    this.secondFormGroup.get('qualityMgtIsoCtrl').markAsTouched();
    this.secondFormGroup.get('qualityResp1Ctrl').markAsTouched();
    this.secondFormGroup.get('qualityResp1Ctrl').markAsTouched();

    this.thirdFormGroup.get('bankCountryCodesCtrl').markAsTouched();
    this.thirdFormGroup.get('bankNameCtrl').markAsTouched();
    this.thirdFormGroup.get('accountHolderNameCtrl').markAsTouched();
    this.thirdFormGroup.get('accountNumberCtrl').markAsTouched();
    this.thirdFormGroup.get('bankAddressLine1Ctrl').markAsTouched();
    this.thirdFormGroup.get('bankfileoriCtrl').markAsTouched();
    this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsTouched();

  }

  async createSupplierPdf() {
    console.log('Creating supplier PDF started ');

    this.http.post<any>(environment.nodeurl + '/api/email/sendsrmmail?roleName=' + 'IMI-SRM Analyst' + '&supplierid=' + "45019" + '&content=' + 'new' + '&category=srm', null).subscribe(async data => {
    });

  }

  async creatEmp() {
    this.isDisabled = true;
    this.isFirstSubmitClick = this.isFirstSubmitClick + 1;

    if (this.isFirstSubmitClick == 1) {
      Swal.fire({
        title: 'Please dont refresh the web browser, we are processing your request!',
        showConfirmButton: false,
        allowOutsideClick: false
      })
      Swal.showLoading();


      if (this.dataSourceAll.length > 0) {

        var registerddate;
        var gosidate;
        var saudiddate;
        var zakathdate;
        var auditdate;
        var qualityDate;

        if (!this.firstFormGroup.value.hijriGregCtrl) {
          if (this.firstFormGroup.value.reggregory != null) {
            this.modelReg = this.firstFormGroup.value.reggregory;
          }


          if (this.firstFormGroup.value.gosigregory != null) {
            this.modelGosi = this.firstFormGroup.value.gosigregory;
          }
          if (this.firstFormGroup.value.saudigregory != null) {
            this.modelSaudi = this.firstFormGroup.value.saudigregory;
          }
          if (this.firstFormGroup.value.zakatgregory != null) {
            this.modelZakat = this.firstFormGroup.value.zakatgregory;
          }
          registerddate = this.modelReg ? this.datePipe.transform(new Date(this.modelReg.year, this.modelReg.month, this.modelReg.day), "yyyy-MM-dd") : '';
          gosidate = this.modelGosi ? this.datePipe.transform(new Date(this.modelGosi.year, this.modelGosi.month, this.modelGosi.day), "yyyy-MM-dd") : '';
          saudiddate = this.modelSaudi ? this.datePipe.transform(new Date(this.modelSaudi.year, this.modelSaudi.month, this.modelSaudi.day), "yyyy-MM-dd") : '';
          zakathdate = this.modelZakat ? this.datePipe.transform(new Date(this.modelZakat.year, this.modelZakat.month, this.modelZakat.day), "yyyy-MM-dd") : '';

          if (this.firstFormGroup.value.countryCtrl != 'SAUDI ARABIA') {
            if (this.firstFormGroup.value.reggregory == null) {
              registerddate = "";
            }
          }
          // auditdate = this.modelAudit ? this.datePipe.transform(new Date(this.modelAudit.year, this.modelAudit.month, this.modelAudit.day), "yyyy-MM-dd") : '';
        } else {
          if (this.firstFormGroup.value.reghijri != null) {
            this.modelReg = this.firstFormGroup.value.reghijri;
          }
          if (this.firstFormGroup.value.gosihijri != null) {
            this.modelGosi = this.firstFormGroup.value.gosihijri;
          }
          if (this.firstFormGroup.value.saudihijri != null) {
            this.modelSaudi = this.firstFormGroup.value.saudihijri;
          }
          if (this.firstFormGroup.value.zakathijri != null) {
            this.modelZakat = this.firstFormGroup.value.zakathijri;
          }
          var reg_date = this.modelReg ? ConvertLunarToSolar(this.modelReg.day, this.modelReg.month, this.modelReg.year) : '';
          var gosi_date = this.modelGosi ? ConvertLunarToSolar(this.modelGosi.day, this.modelGosi.month, this.modelGosi.year) : '';
          var saudi_date = this.modelSaudi ? ConvertLunarToSolar(this.modelSaudi.day, this.modelSaudi.month, this.modelSaudi.year) : '';
          var zakath_date = this.modelZakat ? ConvertLunarToSolar(this.modelZakat.day, this.modelZakat.month, this.modelZakat.year) : '';
          // var audit_date = this.modelAudit ? ConvertLunarToSolar(this.modelAudit.day, this.modelAudit.month, this.modelAudit.year) : '';

          registerddate = reg_date ? this.datePipe.transform(new Date(reg_date.year, reg_date.month, reg_date.day), "yyyy-MM-dd") : '';
          gosidate = gosi_date ? this.datePipe.transform(new Date(gosi_date.year, gosi_date.month, gosi_date.day), "yyyy-MM-dd") : '';
          saudiddate = saudi_date ? this.datePipe.transform(new Date(saudi_date.year, saudi_date.month, saudi_date.day), "yyyy-MM-dd") : '';
          zakathdate = zakath_date ? this.datePipe.transform(new Date(zakath_date.year, zakath_date.month, zakath_date.day), "yyyy-MM-dd") : '';
          // audit_date = audit_date ? this.datePipe.transform(new Date(audit_date.year, audit_date.month, audit_date.day), "yyyy-MM-dd") : '';
        }

        if (this.secondFormGroup.value.qualityreviewDateCtrl) {
          // var quality = this.secondFormGroup.value.qualityreviewDateCtrl;
          var quality = new Date(this.secondFormGroup.value.qualityreviewDateCtrl);
          let UTCDate = Date.UTC(quality.getFullYear(), quality.getMonth(), quality.getDate()) - quality.getTimezoneOffset();
          qualityDate = this.datePipe.transform(new Date(UTCDate), "yyyy-MM-dd");
        }

        let supplierid = this.activatedRoute.snapshot.params.id;
        let category = this.activatedRoute.snapshot.params.cat;



        var changedFields = "";
        var supplier: Supplier = new Supplier();

        if (this.isNeedmoreInfo) {
           changedFields += '';

          changedFields += this.filesChanged;

          if (!changedFields.includes(',1,')) {
            if (this.supplier.supplier_name != this.firstFormGroup.getRawValue().supplierNameCtrl) {
              changedFields += '1' + ',';
            }
          }

          if (!changedFields.includes(',2,')) {
            if (this.supplier.supplier_name_arabic != this.firstFormGroup.getRawValue().supplierNameArabicCtrl) {
              changedFields += '2' + ',';
            }
          }


          if (!changedFields.includes(',3,')) {
            if (this.supplier.establishment_year != this.firstFormGroup.getRawValue().establishmentYearCtrl) {
              changedFields += '3' + ',';
            }
          }


          if (!changedFields.includes(',4,')) {
            if (this.supplier.issued_by != this.firstFormGroup.getRawValue().issuedByCtrl) {
              changedFields += '4' + ',';
            }
          }


          if (!changedFields.includes(',5,')) {
            if (this.supplier.web_site != this.firstFormGroup.getRawValue().websiteCtrl) {
              changedFields += '5' + ',';
            }
          }

          if (!changedFields.includes(',6,')) {
            if (this.supplier.supplier_type != this.firstFormGroup.getRawValue().supplierTypeCtrl) {
              changedFields += '6' + ',';
            }
          }
          if (!changedFields.includes(',7,')) {
            if (this.supplier.country != this.firstFormGroup.value.countryCtrl) {
              changedFields += '7' + ',';
            }
          }


          if (!changedFields.includes(',8,')) {
            if (this.supplier.city != this.firstFormGroup.value.stateCtrl) {
              changedFields += '8' + ',';
            }
          }



          if (!changedFields.includes(',9,')) {
            if (this.firstFormGroup.value.otherCityCtrl != null) {
              if (this.supplier.other_city != this.firstFormGroup.value.otherCityCtrl) {
                changedFields += '9' + ',';
              }
            }
          }



          if (!changedFields.includes('!')) {
            if (this.supplier.po_box != this.firstFormGroup.value.poBoxCtrl) {
              changedFields += '!' + ',';
            }
          }


          if (!changedFields.includes('@')) {
            if (this.supplier.postal_code != this.firstFormGroup.value.postalCodeCtrl) {
              changedFields += '@' + ',';
            }
          }


          if (!changedFields.includes('#')) {
            if (this.supplier.address_line1 != this.firstFormGroup.value.addressLine1Ctrl) {
              changedFields += '#' + ',';
            }
          }


          if (!changedFields.includes('$')) {
            if (this.supplier.address_line2 != this.firstFormGroup.value.addressLine2Ctrl) {
              changedFields += '$' + ',';
            }
          }


          if (!changedFields.includes('%')) {
            if (this.supplier.title != this.firstFormGroup.value.titleCtrl) {
              changedFields += '%' + ',';
            }
          }


          if (!changedFields.includes('^')) {
            if (this.supplier.first_name != this.firstFormGroup.value.firstNameCtrl) {
              changedFields += '^' + ',';
            }
          }


          if (!changedFields.includes('&')) {
            if (this.supplier.last_name != this.firstFormGroup.value.lastNameCtrl) {
              changedFields += '&' + ',';
            }
          }


          if (!changedFields.includes('*')) {
            if (this.supplier.position != this.firstFormGroup.value.positionCtrl) {
              changedFields += '*' + ',';
            }
          }


          if (!changedFields.includes('(')) {
            if (this.supplier.telphone_country_code != this.firstFormGroup.value.telephoneCodeCtrl) {
              changedFields += '(' + ',';
            }
          }


          if (!changedFields.includes(')')) {
            if (this.supplier.telephone_no != this.firstFormGroup.value.telephoneNumberCtrl) {
              changedFields += ')' + ',';
            }
          }


          if (!changedFields.includes('<')) {
            if (this.supplier.extension != this.firstFormGroup.value.poBoxCtrl) {
              changedFields += '<' + ',';
            }
          }



          if (!changedFields.includes('>')) {
            if (this.supplier.mobile_country_code != this.firstFormGroup.value.mobileCodeCtrl) {
              changedFields += '>' + ',';
            }
          }


          if (!changedFields.includes('?')) {
            if (this.supplier.mobile_no != this.firstFormGroup.value.mobileNumberCtrl) {
              changedFields += '?' + ',';
            }
          }


          if (!changedFields.includes('/')) {
            if (this.supplier.fax_country_code != this.firstFormGroup.value.faxCodeCtrl) {
              changedFields += '/' + ',';
            }
          }


          if (!changedFields.includes(':')) {
            if (this.supplier.fax_no != this.firstFormGroup.value.faxNumberCtrl) {
              changedFields += ':' + ',';
            }
          }


          if (!changedFields.includes('|')) {
            if (this.supplier.additional_material != this.firstFormGroup.value.additionalMaterialCtrl) {
              changedFields += '|' + ',';
            }
          }

          if (!changedFields.includes('+')) {
            if (this.supplier.supplierCategories.length != this.dataSourceAll.length) {
              changedFields += '+' + ',';
            }
          }

          if (!changedFields.includes('~')) {
            if (this.supplier.typeOfOrganization != this.secondFormGroup.value.typeOfOrganizationCtrl) {
              changedFields += '~' + ',';
            }

          }

          if (!changedFields.includes('`')) {
            if (this.supplier.typeOfOrganization2 != this.secondFormGroup.value.typeOfOrganization2Ctrl) {
              changedFields += '`' + ',';
            }
          }


          if (!changedFields.includes('11')) {
            if (this.supplier.managerialno != this.secondFormGroup.value.managerialCtrl) {
              changedFields += '11' + ',';
            }
          }


          if (!changedFields.includes('12')) {
            if (this.supplier.technicalno != this.secondFormGroup.value.technicallCtrl) {
              changedFields += '12' + ',';
            }
          }


          if (!changedFields.includes('13')) {
            if (this.supplier.operationsno != this.secondFormGroup.value.operationsCtrl) {
              changedFields += '13' + ',';
            }
          }


          if (!changedFields.includes('14')) {
            if (this.supplier.saudiNationalsno != this.secondFormGroup.value.saudiNationalslCtrl) {
              changedFields += '14' + ',';
            }
          }


          if (!changedFields.includes('15')) {
            if (this.supplier.totallno != this.secondFormGroup.value.totallCtrl) {
              changedFields += '15' + ',';
            }
          }


          if (!changedFields.includes('16')) {
            if (this.supplier.parentcompany != this.secondFormGroup.value.parentcompanyCtrl) {
              changedFields += '16' + ',';
            }
          }


          if (!changedFields.includes('17')) {
            if (this.supplier.sistercompany != this.secondFormGroup.value.sistercompanyCtrl) {
              changedFields += '17' + ',';
            }
          }


          if (!changedFields.includes('18')) {
            if (this.supplier.ownercompany != this.secondFormGroup.value.ownercompanyCtrl) {
              changedFields += '18' + ',';
            }
          }


          if (!changedFields.includes('19')) {
            if (this.supplier.operatingProfit1 != this.secondFormGroup.value.operatingProfit1Ctrl) {
              changedFields += '19' + ',';
            }
          }


          if (!changedFields.includes('20')) {
            if (this.supplier.operatingProfit2 != this.secondFormGroup.value.operatingProfit2Ctrl) {
              changedFields += '20' + ',';
            }
          }


          if (!changedFields.includes('21')) {
            if (this.supplier.netIncome1 != this.secondFormGroup.value.netIncome1Ctrl) {
              changedFields += '21' + ',';
            }
          }


          if (!changedFields.includes('22')) {
            if (this.supplier.netIncome2 != this.secondFormGroup.value.netIncome2Ctrl) {
              changedFields += '22' + ',';
            }
          }


          if (!changedFields.includes('23')) {
            if (this.supplier.currentAsset1 != this.secondFormGroup.value.currentAsset1Ctrl) {
              changedFields += '23' + ',';
            }
          }


          if (!changedFields.includes('24')) {
            if (this.supplier.currentAsset2 != this.secondFormGroup.value.currentAsset2Ctrl) {
              changedFields += '24' + ',';
            }
          }


          if (!changedFields.includes('25')) {
            if (this.supplier.totalLiable1 != this.secondFormGroup.value.totalLiable1Ctrl) {
              changedFields += '25' + ',';
            }
          }


          if (!changedFields.includes('26')) {
            if (this.supplier.totalLiable2 != this.secondFormGroup.value.totalLiable2Ctrl) {
              changedFields += '26' + ',';
            }
          }


          if (!changedFields.includes('27')) {
            if (this.supplier.totalEquity1 != this.secondFormGroup.value.totalEquity1Ctrl) {
              changedFields += '27' + ',';
            }
          }


          if (!changedFields.includes('28')) {
            if (this.supplier.totalEquity2 != this.secondFormGroup.value.totalEquity2Ctrl) {
              changedFields += '28' + ',';
            }
          }


          if (!changedFields.includes('29')) {
            if (this.supplier.noOfYears != this.secondFormGroup.value.noOfYearsCtrl) {
              changedFields += '29' + ',';
            }
          }


          if (!changedFields.includes('30')) {
            if (this.supplier.ownsPlantEquip != this.secondFormGroup.value.ownsPlantEquipCtrl) {
              changedFields += '30' + ',';
            }
          }


          if (!changedFields.includes('31')) {
            if (this.supplier.designnCap != this.secondFormGroup.value.designnCapCtrl) {
              changedFields += '31' + ',';
            }
          }


          if (!changedFields.includes('32')) {
            if (this.supplier.finishProd != this.secondFormGroup.value.finishProdCtrl) {
              changedFields += '32' + ',';
            }
          }


          if (!changedFields.includes('33')) {
            if (this.supplier.internalPolicy != this.secondFormGroup.value.internalPolicyCtrl) {
              changedFields += '33' + ',';
            }
          }


          if (!changedFields.includes('34')) {
            if (this.supplier.registeredOrg != this.secondFormGroup.value.registeredOrgCtrl) {
              changedFields += '34' + ',';
            }
          }


          if (!changedFields.includes('35')) {
            if (this.supplier.suspendedProj1 != this.secondFormGroup.value.suspendedProj1Ctrl) {
              changedFields += '35' + ',';
            }
          }


          if (!changedFields.includes('36')) {
            if (this.supplier.litigation1 != this.secondFormGroup.value.litigation1Ctrl) {
              changedFields += '36' + ',';
            }
          }


          if (!changedFields.includes('37')) {
            if (this.supplier.compliance1 != this.secondFormGroup.value.compliance1Ctrl) {
              changedFields += '37' + ',';
            }
          }


          if (!changedFields.includes('38')) {
            if (this.supplier.shareholder1 != this.secondFormGroup.value.shareholder1Ctrl) {
              changedFields += '38' + ',';
            }
          }


          if (!changedFields.includes('39')) {
            if (this.supplier.legalAsset1 != this.secondFormGroup.value.legalAsset1Ctrl) {
              changedFields += '39' + ',';
            }
          }


          if (!changedFields.includes('40')) {
            if (this.supplier.labour1 != this.secondFormGroup.value.labour1Ctrl) {
              changedFields += '40' + ',';
            }
          }


          if (!changedFields.includes('41')) {
            if (this.supplier.environment1 != this.secondFormGroup.value.environment1Ctrl) {
              changedFields += '41' + ',';
            }
          }

          if (!changedFields.includes('42')) {
            if (this.supplier.imiInterested1 != this.secondFormGroup.value.imiInterested1trl) {
              changedFields += '42' + ',';
            }
          }


          if (!changedFields.includes('43')) {
            if (this.supplier.hse1 != this.secondFormGroup.value.hse1Ctrl) {
              changedFields += '43' + ',';
            }
          }


          if (!changedFields.includes('44')) {
            if (this.supplier.docuHse != this.secondFormGroup.value.docuHseCtrl) {
              changedFields += '44' + ',';
            }
          }


          if (!changedFields.includes('45')) {
            if (this.supplier.isohealth != this.secondFormGroup.value.isohealthCtrl) {
              changedFields += '45' + ',';
            }
          }


          if (!changedFields.includes('46')) {
            if (this.supplier.envtMgt1 != this.secondFormGroup.value.envtMgt1Ctrl) {
              changedFields += '46' + ',';
            }
          }


          if (!changedFields.includes('47')) {
            if (this.supplier.dedicatedpers != this.secondFormGroup.value.dedicatedpersCtrl) {
              changedFields += '47' + ',';
            }
          }


          if (!changedFields.includes('48')) {
            if (this.supplier.statistic != this.secondFormGroup.value.statisticCtrl) {
              changedFields += '48' + ',';
            }
          }


          if (!changedFields.includes('49')) {
            if (this.supplier.qualityPolicy1 != this.secondFormGroup.value.qualityPolicy1Ctrl) {
              changedFields += '49' + ',';
            }
          }


          if (!changedFields.includes('50')) {
            if (this.supplier.qualityMgt != this.secondFormGroup.value.qualityMgtCtrl) {
              changedFields += '50' + ',';
            }
          }


          if (!changedFields.includes('51')) {
            if (this.supplier.qualityMgtIso != this.secondFormGroup.value.qualityMgtIsoCtrl) {
              changedFields += '51' + ',';
            }
          }


          if (!changedFields.includes('52')) {
            if (this.supplier.qualityResp1 != this.secondFormGroup.value.qualityResp1Ctrl) {
              changedFields += '52' + ',';
            }
          }


          if (!changedFields.includes('53')) {
            if (this.supplier.qualityreviewDate != this.secondFormGroup.value.qualityreviewDateCtrl) {
              changedFields += '53' + ',';
            }
          }


          if (!changedFields.includes('54')) {
            if (this.supplier.additionalCtrl != this.secondFormGroup.value.additionalCtrl) {
              changedFields += '54' + ',';
            }
          }


          if (!changedFields.includes('55')) {
            if (this.supplier.additionalCtrl2 != this.secondFormGroup.value.additionalCtrl2) {
              changedFields += '55' + ',';
            }
          }


          if (!changedFields.includes('56')) {
            if (this.supplier.additionalCtrl3 != this.secondFormGroup.value.additionalCtrl3) {
              changedFields += '56' + ',';
            }
          }


          if (!changedFields.includes('57')) {
            if (this.supplier.additionalCtrl4 != this.secondFormGroup.value.additionalCtrl4) {
              changedFields += '57' + ',';
            }
          }


          if (!changedFields.includes('58')) {
            if (this.supplier.additionalCtrl5 != this.secondFormGroup.value.additionalCtrl5) {
              changedFields += '58' + ',';
            }
          }


          if (!changedFields.includes('59')) {
            if (this.supplier.bankCountryCodes != this.thirdFormGroup.value.bankCountryCodesCtrl) {
              changedFields += '59' + ',';
            }
          }


          if (!changedFields.includes('60')) {
            if (this.supplier.bankName != this.thirdFormGroup.value.bankNameCtrl) {
              changedFields += '60' + ',';
            }
          }


          if (!changedFields.includes('61')) {
            if (this.supplier.otherBankName != this.thirdFormGroup.value.otherNameCtrl) {
              changedFields += '61' + ',';
            }
          }


          if (!changedFields.includes('62')) {
            if (this.supplier.swiftcode != this.thirdFormGroup.value.swiftCtrl) {
              changedFields += '62' + ',';
            }
          }


          if (!changedFields.includes('63')) {
            if (this.supplier.accountHolderName != this.thirdFormGroup.value.accountHolderNameCtrl) {
              changedFields += '63' + ',';
            }
          }


          if (!changedFields.includes('64')) {
            if (this.supplier.account_number != this.thirdFormGroup.value.accountNumberCtrl) {
              changedFields += '64' + ',';
            }
          }


          if (!changedFields.includes('65')) {
            if (this.supplier.ibanNo != this.thirdFormGroup.value.ibanNumberCtrl) {
              changedFields += '65' + ',';
            }
          }

          if (!changedFields.includes('66')) {
            if (this.supplier.title1 != this.thirdFormGroup.value.titleCtrl1) {
              changedFields += '66' + ',';
            }
          }

          if (!changedFields.includes('67')) {
            if (this.supplier.first_name1 != this.thirdFormGroup.value.firstNameCtrl1) {
              changedFields += '67' + ',';
            }
          }

          if (!changedFields.includes('68')) {
            if (this.supplier.last_name1 != this.thirdFormGroup.value.firstNameCtrl1) {
              changedFields += '68' + ',';
            }
          }

          if (!changedFields.includes('69')) {
            if (this.supplier.position1 != this.thirdFormGroup.value.positionCtrl1) {
              changedFields += '69' + ',';
            }
          }

          if (!changedFields.includes('70')) {
            if (this.supplier.email1 != this.thirdFormGroup.value.emailCtrl1) {
              changedFields += '70' + ',';
            }
          }

          if (!changedFields.includes('71')) {
            if (this.supplier.telphone_country_code1 != this.thirdFormGroup.value.telephoneCodeCtrl1) {
              changedFields += '71' + ',';
            }
          }

          if (!changedFields.includes('72')) {
            if (this.supplier.telephone_no1 != this.thirdFormGroup.value.telephoneNumberCtrl1) {
              changedFields += '72' + ',';
            }
          }

          if (!changedFields.includes('73')) {
            if (this.supplier.extension1 != this.thirdFormGroup.value.extCtrl1) {
              changedFields += '73' + ',';
            }
          }

          if (!changedFields.includes('74')) {
            if (this.supplier.mobile_country_code1 != this.thirdFormGroup.value.mobileCodeCtrl1) {
              changedFields += '74' + ',';
            }
          }

          if (!changedFields.includes('75')) {
            if (this.supplier.mobile_no1 != this.thirdFormGroup.value.mobileNumberCtrl1) {
              changedFields += '75' + ',';
            }
          }

          if (!changedFields.includes('76')) {
            if (this.supplier.fax_country_code1 != this.thirdFormGroup.value.faxCodeCtrl1) {
              changedFields += '76' + ',';
            }
          }

          if (!changedFields.includes('77')) {
            if (this.supplier.fax_no1 != this.thirdFormGroup.value.faxNumberCtrl1) {
              changedFields += '77' + ',';
            }
          }

          //
          if (!changedFields.includes('78')) {
            if (this.supplier.title2 != this.thirdFormGroup.value.titleCtrl2) {
              changedFields += '78' + ',';
            }
          }

          if (!changedFields.includes('79')) {
            if (this.supplier.first_name2 != this.thirdFormGroup.value.firstNameCtrl2) {
              changedFields += '79' + ',';
            }
          }

          if (!changedFields.includes('80')) {
            if (this.supplier.last_name2 != this.thirdFormGroup.value.firstNameCtrl2) {
              changedFields += '80' + ',';
            }
          }

          if (!changedFields.includes('81')) {
            if (this.supplier.position2 != this.thirdFormGroup.value.positionCtrl2) {
              changedFields += '81' + ',';
            }
          }

          if (!changedFields.includes('82')) {
            if (this.supplier.email2 != this.thirdFormGroup.value.emailCtrl2) {
              changedFields += '82' + ',';
            }
          }

          if (!changedFields.includes('83')) {
            if (this.supplier.telphone_country_code2 != this.thirdFormGroup.value.telephoneCodeCtrl2) {
              changedFields += '83' + ',';
            }
          }

          if (!changedFields.includes('84')) {
            if (this.supplier.telephone_no2 != this.thirdFormGroup.value.telephoneNumberCtrl2) {
              changedFields += '84' + ',';
            }
          }

          if (!changedFields.includes('85')) {
            if (this.supplier.extension2 != this.thirdFormGroup.value.extCtrl2) {
              changedFields += '85' + ',';
            }
          }

          if (!changedFields.includes('86')) {
            if (this.supplier.mobile_country_code2 != this.thirdFormGroup.value.mobileCodeCtrl2) {
              changedFields += '86' + ',';
            }
          }

          if (!changedFields.includes('87')) {
            if (this.supplier.mobile_no2 != this.thirdFormGroup.value.mobileNumberCtrl2) {
              changedFields += '87' + ',';
            }
          }

          if (!changedFields.includes('88')) {
            if (this.supplier.fax_country_code2 != this.thirdFormGroup.value.faxCodeCtrl2) {
              changedFields += '88' + ',';
            }
          }

          if (!changedFields.includes('89')) {
            if (this.supplier.fax_no2 != this.thirdFormGroup.value.faxNumberCtrl2) {
              changedFields += '89' + ',';
            }
          }
          //

          if (!changedFields.includes(',z,')) {
            if (this.supplier.bankAddress != this.thirdFormGroup.value.bankAddressLine1Ctrl) {
              changedFields += 'z' + ',';
            }
          }

          if (!changedFields.includes(',y,')) {
            if (this.supplier.bankAddress2 != this.thirdFormGroup.value.bankAddressLine2Ctrl) {
              changedFields += 'y' + ',';
            }

          }

          if (!changedFields.includes(',x,')) {
            if (this.supplier.suspendedProj2 != this.secondFormGroup.value.suspendedProj2Ctrl) {
              changedFields += 'x' + ',';
            }
          }


          if (!changedFields.includes(',w,')) {
            if (this.supplier.litigation2 != this.secondFormGroup.value.litigation2Ctrl) {
              changedFields += 'w' + ',';
            }
          }


          if (!changedFields.includes(',v,')) {
            if (this.supplier.shareholder2 != this.secondFormGroup.value.shareholder2Ctrl) {
              changedFields += 'v' + ',';
            }
          }


          if (!changedFields.includes(',u,')) {
            if (this.supplier.legalAsset2 != this.secondFormGroup.value.legalAsset2Ctrl) {
              changedFields += 'u' + ',';
            }
          }


          if (!changedFields.includes(',t,')) {
            if (this.supplier.labour2 != this.secondFormGroup.value.labour2Ctrl) {
              changedFields += 't' + ',';
            }
          }


          if (!changedFields.includes(',s,')) {
            if (this.supplier.environment2 != this.secondFormGroup.value.environment2Ctrl) {
              changedFields += 's' + ',';
            }
          }


          if (!changedFields.includes(',r,')) {
            if (this.supplier.imiInterested2 != this.secondFormGroup.value.imiInterested2trl) {
              changedFields += 'r' + ',';
            }
          }


          if (!changedFields.includes(',q,')) {
            if (this.supplier.qualityName != this.secondFormGroup.value.qualityNameCtrl) {
              changedFields += 'q' + ',';
            }
          }


          if (!changedFields.includes(',p,')) {
            if (this.supplier.qualityDesig != this.secondFormGroup.value.qualityDesigCtrl) {
              changedFields += 'p' + ',';
            }
          }


          if (!changedFields.includes(',o,')) {
            if (this.supplier.hseName != this.secondFormGroup.value.hseNameCtrl) {
              changedFields += 'o' + ',';
            }
          }


          if (!changedFields.includes(',n,')) {
            if (this.supplier.hseDesig != this.secondFormGroup.value.hseDesigCtrl) {
              changedFields += 'n' + ',';
            }
          }


          if (!changedFields.includes(',m,')) {
            if (this.supplier.statisticNear != this.secondFormGroup.value.statisticNearCtrl) {
              changedFields += 'm' + ',';
            }
          }


          if (!changedFields.includes(',l,')) {
            if (this.supplier.statisticFirst != this.secondFormGroup.value.statisticFirstCtrl) {
              changedFields += 'l' + ',';
            }
          }

          if (!changedFields.includes(',k,')) {
            if (this.supplier.statisticMedical != this.secondFormGroup.value.statisticMediCtrl) {
              changedFields += 'k' + ',';
            }
          }

          if (!changedFields.includes(',j,')) {
            if (this.supplier.statisticLost != this.secondFormGroup.value.statisticLostCtrl) {
              changedFields += 'j' + ',';
            }
          }

          if (!changedFields.includes(',i,')) {
            if (this.supplier.statisticFatal != this.secondFormGroup.value.statisticFatalCtrl) {
              changedFields += 'i' + ',';
            }
          }

          if (!changedFields.includes(',h,')) {
            if (this.supplier.statisticEnvt != this.secondFormGroup.value.statisticEnvtCtrl) {
              changedFields += 'h' + ',';
            }
          }

          if (!changedFields.includes(',g,')) {
            if (this.supplier.cr_no != this.firstFormGroup.value.registrationCtrl) {
              changedFields += 'g' + ',';
            }
          }

          if (!changedFields.includes(',f,')) {
            if (this.supplier.cr_exp_date != this.firstFormGroup.value.reggregory) {
              changedFields += 'f' + ',';
            }
          }

          if (!changedFields.includes(',e,')) {
            if (this.supplier.vat_no != this.firstFormGroup.value.vatCtrl) {
              changedFields += 'e' + ',';
            }
          }

          if (!changedFields.includes(',d,')) {
            if (this.supplier.gosi_date != this.firstFormGroup.value.gosihijri) {
              changedFields += 'd' + ',';
            }
          }

          if (!changedFields.includes(',c,')) {
            if (this.supplier.saudi_date != this.firstFormGroup.value.saudihijri) {
              changedFields += 'c' + ',';
            }
          }

          if (!changedFields.includes(',b,')) {
            if (this.supplier.zakath_date != this.firstFormGroup.value.zakathijri) {
              changedFields += 'b' + ',';
            }
          }





          if (!changedFields.includes(',a,')) {
            if (this.supplier.wasalAddress != this.firstFormGroup.value.waselCtrl) {
              changedFields += 'a' + ',';
            }
          }



          // if(this.supplier.multicurrency != this.thirdFormGroup.value.multicurrency){
          //   changedFields += 'multicurrency' + ',';
          // }


          // if(this.supplier.email != this.firstFormGroup.value.emailCtrl){
          //   changedFields += 'email' + ',';
          // }




          // var currentDate = this.datePipe.transform(this.myDate, 'yyyy-MM-dd');
          // changedFields += 'updateddate:'+ currentDate.toString() + ',';

          // supplier.supplier_extra = changedFields;
        }

        supplier.supplier_id = (this.supplier.supplier_id && this.savedCategory == 'reg') ? Number(this.supplier.supplier_id) : 0;
        supplier.supplier_name = this.firstFormGroup.getRawValue().supplierNameCtrl;
        supplier.email = this.firstFormGroup.getRawValue().emailCtrl ? this.firstFormGroup.getRawValue().emailCtrl : this.firstFormGroup.value.emailCtrl;
        supplier.supplier_name_arabic = this.firstFormGroup.value.supplierNameArabicCtrl ? this.firstFormGroup.value.supplierNameArabicCtrl : '';
        supplier.establishment_year = this.firstFormGroup.value.establishmentYearCtrl ? Number(this.firstFormGroup.value.establishmentYearCtrl) : 0;
        supplier.issued_by = this.firstFormGroup.value.issuedByCtrl ? this.firstFormGroup.value.issuedByCtrl : '';
        supplier.web_site = this.firstFormGroup.value.websiteCtrl ? this.firstFormGroup.value.websiteCtrl : '';
        supplier.supplier_type = this.firstFormGroup.value.supplierTypeCtrl == null ? [] : this.firstFormGroup.value.supplierTypeCtrl;
        supplier.country = this.firstFormGroup.value.countryCtrl ? this.firstFormGroup.value.countryCtrl : '';
        supplier.city = this.firstFormGroup.value.stateCtrl ? this.firstFormGroup.value.stateCtrl : '';
        supplier.other_city = this.firstFormGroup.value.otherCityCtrl ? this.firstFormGroup.value.otherCityCtrl : '';
        supplier.po_box = this.firstFormGroup.value.poBoxCtrl ? this.firstFormGroup.value.poBoxCtrl : '';
        supplier.postal_code = this.firstFormGroup.value.postalCodeCtrl ? this.firstFormGroup.value.postalCodeCtrl : '';
        supplier.address_line1 = this.firstFormGroup.value.addressLine1Ctrl ? this.firstFormGroup.value.addressLine1Ctrl : '';
        supplier.address_line2 = this.firstFormGroup.value.addressLine2Ctrl ? this.firstFormGroup.value.addressLine2Ctrl : '';
        supplier.title = this.firstFormGroup.value.titleCtrl ? this.firstFormGroup.value.titleCtrl : '';
        supplier.first_name = this.firstFormGroup.value.firstNameCtrl ? this.firstFormGroup.value.firstNameCtrl : '';
        supplier.last_name = this.firstFormGroup.value.lastNameCtrl ? this.firstFormGroup.value.lastNameCtrl : '';
        supplier.telphone_country_code = this.firstFormGroup.value.telephoneCodeCtrl ? this.firstFormGroup.value.telephoneCodeCtrl : '';
        supplier.telephone_no = this.firstFormGroup.value.telephoneNumberCtrl ? String(this.firstFormGroup.value.telephoneNumberCtrl) : '';
        supplier.extension = this.firstFormGroup.value.extCtrl ? Number(this.firstFormGroup.value.extCtrl) : 0;
        supplier.position = this.firstFormGroup.value.positionCtrl ? this.firstFormGroup.value.positionCtrl : '';
        supplier.mobile_country_code = this.firstFormGroup.value.mobileCodeCtrl ? this.firstFormGroup.value.mobileCodeCtrl : '';
        supplier.mobile_no = this.firstFormGroup.value.mobileNumberCtrl ? String(this.firstFormGroup.value.mobileNumberCtrl) : '';
        supplier.fax_country_code = this.firstFormGroup.value.faxCodeCtrl ? this.firstFormGroup.value.faxCodeCtrl : '';
        supplier.fax_no = this.firstFormGroup.value.faxNumberCtrl ? String(this.firstFormGroup.value.faxNumberCtrl) : '';
        supplier.additional_material = this.firstFormGroup.value.additionalMaterialCtrl ? this.firstFormGroup.value.additionalMaterialCtrl : '';
        supplier.wasalAddress = this.firstFormGroup.value.waselCtrl ? this.firstFormGroup.value.waselCtrl : '';

        supplier.cr_no = this.firstFormGroup.value.registrationCtrl ? this.firstFormGroup.value.registrationCtrl : '';
        supplier.cr_exp_date = this.datePipe.transform(new Date(), "yyyy-MM-dd");
        supplier.vat_no = this.firstFormGroup.value.vatCtrl ? String(this.firstFormGroup.value.vatCtrl) : '';
        // supplier.gosi_certificate = this.firstFormGroup.value.certificateDateCtrl ? this.firstFormGroup.value.certificateDateCtrl : '';
        supplier.gosi_certificate = '';
        supplier.reg_date = this.modelReg ? registerddate : '',
          supplier.gosi_date = this.modelGosi ? gosidate : '';
        supplier.saudi_date = this.modelSaudi ? saudiddate : '';
        supplier.zakath_date = this.modelZakat ? zakathdate : '';

        supplier.parentcompany = this.secondFormGroup.value.parentcompanyCtrl ? this.secondFormGroup.value.parentcompanyCtrl : '';
        supplier.sistercompany = this.secondFormGroup.value.sistercompanyCtrl ? this.secondFormGroup.value.sistercompanyCtrl : '';
        supplier.ownercompany = this.secondFormGroup.value.ownercompanyCtrl ? this.secondFormGroup.value.ownercompanyCtrl : '';
        supplier.operatingProfit1 = this.secondFormGroup.value.operatingProfit1Ctrl ? this.secondFormGroup.value.operatingProfit1Ctrl : 0;
        supplier.operatingProfit2 = this.secondFormGroup.value.operatingProfit2Ctrl ? this.secondFormGroup.value.operatingProfit2Ctrl.toString() : '0';
        supplier.netIncome1 = this.secondFormGroup.value.netIncome1Ctrl ? this.secondFormGroup.value.netIncome1Ctrl : 0;
        supplier.netIncome2 = this.secondFormGroup.value.netIncome2Ctrl ? this.secondFormGroup.value.netIncome2Ctrl.toString() : '';
        supplier.currentAsset1 = this.secondFormGroup.value.currentAsset1Ctrl ? this.secondFormGroup.value.currentAsset1Ctrl : 0;
        supplier.currentAsset2 = this.secondFormGroup.value.currentAsset2Ctrl ? this.secondFormGroup.value.currentAsset2Ctrl.toString() : '0';
        supplier.totalLiable1 = this.secondFormGroup.value.totalLiable1Ctrl ? this.secondFormGroup.value.totalLiable1Ctrl : 0;
        supplier.totalLiable2 = this.secondFormGroup.value.totalLiable2Ctrl ? this.secondFormGroup.value.totalLiable2Ctrl.toString() : '0';
        supplier.totalEquity1 = this.secondFormGroup.value.totalEquity1Ctrl ? this.secondFormGroup.value.totalEquity1Ctrl : 0;
        supplier.totalEquity2 = this.secondFormGroup.value.totalEquity2Ctrl ? this.secondFormGroup.value.totalEquity2Ctrl.toString() : '0';
        supplier.noOfYears = this.secondFormGroup.value.noOfYearsCtrl ? this.secondFormGroup.value.noOfYearsCtrl : 0;
        supplier.ownsPlantEquip = this.secondFormGroup.value.ownsPlantEquipCtrl ? this.secondFormGroup.value.ownsPlantEquipCtrl : '';
        supplier.designnCap = this.secondFormGroup.value.designnCapCtrl ? this.secondFormGroup.value.designnCapCtrl : '';
        supplier.finishProd = this.secondFormGroup.value.finishProdCtrl ? this.secondFormGroup.value.finishProdCtrl : '';
        supplier.internalPolicy = this.secondFormGroup.value.internalPolicyCtrl ? this.secondFormGroup.value.internalPolicyCtrl : '';
        supplier.registeredOrg = this.secondFormGroup.value.registeredOrgCtrl ? this.secondFormGroup.value.registeredOrgCtrl : '';
        supplier.suspendedProj1 = this.secondFormGroup.value.suspendedProj1Ctrl ? this.secondFormGroup.value.suspendedProj1Ctrl : '';
        supplier.suspendedProj2 = this.secondFormGroup.value.suspendedProj2Ctrl ? this.secondFormGroup.value.suspendedProj2Ctrl : '';
        supplier.litigation1 = this.secondFormGroup.value.litigation1Ctrl ? this.secondFormGroup.value.litigation1Ctrl : '';
        supplier.litigation2 = this.secondFormGroup.value.litigation2Ctrl ? this.secondFormGroup.value.litigation2Ctrl : '';
        supplier.compliance1 = this.secondFormGroup.value.compliance1Ctrl ? this.secondFormGroup.value.compliance1Ctrl : '';
        supplier.compliance2 = this.secondFormGroup.value.compliance2Ctrl ? this.secondFormGroup.value.compliance2Ctrl : '';
        supplier.shareholder1 = this.secondFormGroup.value.shareholder1Ctrl ? this.secondFormGroup.value.shareholder1Ctrl : '';
        supplier.shareholder2 = this.secondFormGroup.value.shareholder2Ctrl ? this.secondFormGroup.value.shareholder2Ctrl : '';
        supplier.labour1 = this.secondFormGroup.value.labour1Ctrl ? this.secondFormGroup.value.labour1Ctrl : '';
        supplier.labour2 = this.secondFormGroup.value.labour2Ctrl ? this.secondFormGroup.value.labour2Ctrl : '';
        supplier.legalAsset1 = this.secondFormGroup.value.legalAsset1Ctrl ? this.secondFormGroup.value.legalAsset1Ctrl : '';
        supplier.legalAsset2 = this.secondFormGroup.value.legalAsset2Ctrl ? this.secondFormGroup.value.legalAsset2Ctrl : '';
        supplier.environment1 = this.secondFormGroup.value.environment1Ctrl ? this.secondFormGroup.value.environment1Ctrl : '';
        supplier.environment2 = this.secondFormGroup.value.environment2Ctrl ? this.secondFormGroup.value.environment2Ctrl : '';
        supplier.imiInterested1 = this.secondFormGroup.value.imiInterested1trl ? this.secondFormGroup.value.imiInterested1trl : '';
        supplier.imiInterested2 = this.secondFormGroup.value.imiInterested2trl ? this.secondFormGroup.value.imiInterested2trl : '';
        supplier.hse1 = this.secondFormGroup.value.hse1Ctrl ? this.secondFormGroup.value.hse1Ctrl : '';
        supplier.hse2 = this.secondFormGroup.value.hse2Ctrl ? this.secondFormGroup.value.hse2Ctrl : '';
        supplier.docuHse = this.secondFormGroup.value.docuHseCtrl ? this.secondFormGroup.value.docuHseCtrl : '';
        supplier.isohealth = this.secondFormGroup.value.isohealthCtrl ? this.secondFormGroup.value.isohealthCtrl : '';
        supplier.envtMgt1 = this.secondFormGroup.value.envtMgt1Ctrl ? this.secondFormGroup.value.envtMgt1Ctrl : '';
        supplier.envtMgt2 = this.secondFormGroup.value.envtMgt2Ctrl ? this.secondFormGroup.value.envtMgt2Ctrl : '';
        supplier.dedicatedpers = this.secondFormGroup.value.dedicatedpersCtrl ? this.secondFormGroup.value.dedicatedpersCtrl : '';
        supplier.statistic = this.secondFormGroup.value.statisticCtrl ? this.secondFormGroup.value.statisticCtrl : '';
        supplier.qualityPolicy1 = this.secondFormGroup.value.qualityPolicy1Ctrl ? this.secondFormGroup.value.qualityPolicy1Ctrl : '';
        supplier.qualityPolicy2 = this.secondFormGroup.value.qualityPolicy2Ctrl ? this.secondFormGroup.value.qualityPolicy2Ctrl : '';
        supplier.qualityMgt = this.secondFormGroup.value.qualityMgtCtrl ? this.secondFormGroup.value.qualityMgtCtrl : '';
        supplier.qualityResp1 = this.secondFormGroup.value.qualityResp1Ctrl ? this.secondFormGroup.value.qualityResp1Ctrl : '';
        supplier.qualityResp2 = this.secondFormGroup.value.qualityNameCtrl ? this.secondFormGroup.value.qualityNameCtrl : '';
        supplier.qualityResp3 = this.secondFormGroup.value.qualityDesigCtrl ? this.secondFormGroup.value.qualityDesigCtrl : '';
        supplier.qualityreviewDate = qualityDate;
        supplier.typeOfOrganization = this.secondFormGroup.value.typeOfOrganizationCtrl ? this.secondFormGroup.value.typeOfOrganizationCtrl : '';
        supplier.typeOfOrganization2 = this.secondFormGroup.value.typeOfOrganization2Ctrl ? this.secondFormGroup.value.typeOfOrganization2Ctrl : '';
        supplier.additionalCtrl = this.secondFormGroup.value.additionalCtrl ? this.secondFormGroup.value.additionalCtrl : '';
        supplier.additionalCtrl2 = this.secondFormGroup.value.additionalCtrl2 ? this.secondFormGroup.value.additionalCtrl2 : '';
        supplier.additionalCtrl3 = this.secondFormGroup.value.additionalCtrl3 ? this.secondFormGroup.value.additionalCtrl3 : '';
        supplier.additionalCtrl4 = this.secondFormGroup.value.additionalCtrl4 ? this.secondFormGroup.value.additionalCtrl4 : '';
        supplier.additionalCtrl5 = this.secondFormGroup.value.additionalCtrl5 ? this.secondFormGroup.value.additionalCtrl5 : '';
        supplier.managerialno = this.secondFormGroup.value.managerialCtrl ? this.secondFormGroup.value.managerialCtrl : 0;
        supplier.technicalno = this.secondFormGroup.value.technicallCtrl ? this.secondFormGroup.value.technicallCtrl : 0;
        supplier.operationsno = this.secondFormGroup.value.operationsCtrl ? this.secondFormGroup.value.operationsCtrl : 0;
        supplier.saudiNationalsno = this.secondFormGroup.value.saudiNationalslCtrl ? this.secondFormGroup.value.saudiNationalslCtrl : 0;
        supplier.totallno = this.secondFormGroup.value.totallCtrl ? this.secondFormGroup.value.totallCtrl : 0;
        supplier.hijriSelected = this.firstFormGroup.value.hijriGregCtrl == true ? 'Y' : 'N';
        supplier.bankCountryCodes = this.thirdFormGroup.value.bankCountryCodesCtrl ? this.thirdFormGroup.value.bankCountryCodesCtrl : '';
        supplier.bankName = this.thirdFormGroup.value.bankNameCtrl ? this.thirdFormGroup.value.bankNameCtrl : '';
        supplier.otherBankName = this.thirdFormGroup.value.otherNameCtrl ? this.thirdFormGroup.value.otherNameCtrl : '';
        supplier.swiftcode = this.thirdFormGroup.getRawValue().swiftCtrl ? this.thirdFormGroup.getRawValue().swiftCtrl : '';
        supplier.accountHolderName = this.thirdFormGroup.value.accountHolderNameCtrl ? this.thirdFormGroup.value.accountHolderNameCtrl : '';
        supplier.ibanNo = this.thirdFormGroup.value.ibanNumberCtrl ? this.thirdFormGroup.value.ibanNumberCtrl : '';
        supplier.bankAddress = this.thirdFormGroup.value.bankAddressLine1Ctrl ? this.thirdFormGroup.value.bankAddressLine1Ctrl : '';
        supplier.bankAddress2 = this.thirdFormGroup.value.bankAddressLine2Ctrl ? this.thirdFormGroup.value.bankAddressLine2Ctrl : '';
        supplier.accountCurrency = this.thirdFormGroup.value.accountCurrencyCtrl ? this.thirdFormGroup.value.accountCurrencyCtrl : '';
        supplier.account_number = this.thirdFormGroup.value.accountNumberCtrl ? this.thirdFormGroup.value.accountNumberCtrl : '';
        supplier.statisticNear = this.secondFormGroup.value.statisticNearCtrl ? this.secondFormGroup.value.statisticNearCtrl : '';
        supplier.statisticFirst = this.secondFormGroup.value.statisticFirstCtrl ? this.secondFormGroup.value.statisticFirstCtrl : '';
        supplier.statisticMedical = this.secondFormGroup.value.statisticMediCtrl ? this.secondFormGroup.value.statisticMediCtrl : '';
        supplier.statisticLost = this.secondFormGroup.value.statisticLostCtrl ? this.secondFormGroup.value.statisticLostCtrl : '';
        supplier.statisticFatal = this.secondFormGroup.value.statisticFatalCtrl ? this.secondFormGroup.value.statisticFatalCtrl : '';
        supplier.hseName = this.secondFormGroup.value.hseNameCtrl ? this.secondFormGroup.value.hseNameCtrl : '';
        supplier.hseDesig = this.secondFormGroup.value.hseDesigCtrl ? this.secondFormGroup.value.hseDesigCtrl : '';
        supplier.qualityMgtIso = this.secondFormGroup.value.qualityMgtIsoCtrl ? this.secondFormGroup.value.qualityMgtIsoCtrl : '';
        supplier.statisticEnvt = this.secondFormGroup.value.statisticEnvtCtrl ? this.secondFormGroup.value.statisticEnvtCtrl : '';
        supplier.supplierCategories = this.dataSourceAll;
        supplier.multicurrency = this.thirdFormGroup.value.multicurrency == true ? 'Y' : 'N';
        supplier.revisionNo = this.rejectedSupplierId;
        supplier.supplier_extra = changedFields;
        supplier.draftLimit = "";

        if (this.additionalContact1) {
          supplier.title1 = this.firstFormGroup.value.titleCtrl1 ? this.firstFormGroup.value.titleCtrl1 : '';
          supplier.first_name1 = this.firstFormGroup.value.firstNameCtrl1 ? this.firstFormGroup.value.firstNameCtrl1 : '';
          supplier.last_name1 = this.firstFormGroup.value.lastNameCtrl1 ? this.firstFormGroup.value.lastNameCtrl1 : '';
          supplier.email1 = this.firstFormGroup.getRawValue().emailCtrl1 ? this.firstFormGroup.getRawValue().emailCtrl1 : this.firstFormGroup.value.emailCtrl1;
          supplier.telphone_country_code1 = this.firstFormGroup.value.telephoneCodeCtrl1 ? this.firstFormGroup.value.telephoneCodeCtrl1 : '';
          supplier.telephone_no1 = this.firstFormGroup.value.telephoneNumberCtrl1 ? String(this.firstFormGroup.value.telephoneNumberCtrl1) : '';
          supplier.extension1 = this.firstFormGroup.value.extCtrl1 ? Number(this.firstFormGroup.value.extCtrl1) : 0;
          supplier.position1 = this.firstFormGroup.value.positionCtrl1 ? this.firstFormGroup.value.positionCtrl1 : '';
          supplier.mobile_country_code1 = this.firstFormGroup.value.mobileCodeCtrl1 ? this.firstFormGroup.value.mobileCodeCtrl1 : '';
          supplier.mobile_no1 = this.firstFormGroup.value.mobileNumberCtrl1 ? String(this.firstFormGroup.value.mobileNumberCtrl1) : '';
          supplier.fax_country_code1 = this.firstFormGroup.value.faxCodeCtrl1 ? this.firstFormGroup.value.faxCodeCtrl1 : '';
          supplier.fax_no1 = this.firstFormGroup.value.faxNumberCtrl1 ? String(this.firstFormGroup.value.faxNumberCtrl1) : '';

        } else if (!this.additionalContact1) {
          supplier.title1 = '';
          supplier.first_name1 = '';
          supplier.last_name1 = '';
          supplier.email1 = '';
          supplier.telphone_country_code1 = '';
          supplier.telephone_no1 = '';
          supplier.extension1 = 0;
          supplier.position1 = '';
          supplier.mobile_country_code1 = '';
          supplier.mobile_no1 = '';
          supplier.fax_country_code1 = '';
          supplier.fax_no1 = '';


        }

        if (this.additionalContact2) {
          supplier.title2 = this.firstFormGroup.value.titleCtrl2 ? this.firstFormGroup.value.titleCtrl2 : '';
          supplier.first_name2 = this.firstFormGroup.value.firstNameCtrl2 ? this.firstFormGroup.value.firstNameCtrl2 : '';
          supplier.last_name2 = this.firstFormGroup.value.lastNameCtrl2 ? this.firstFormGroup.value.lastNameCtrl2 : '';
          supplier.email2 = this.firstFormGroup.getRawValue().emailCtrl2 ? this.firstFormGroup.getRawValue().emailCtrl2 : this.firstFormGroup.value.emailCtrl2;
          supplier.telphone_country_code2 = this.firstFormGroup.value.telephoneCodeCtrl2 ? this.firstFormGroup.value.telephoneCodeCtrl2 : '';
          supplier.telephone_no2 = this.firstFormGroup.value.telephoneNumberCtrl2 ? String(this.firstFormGroup.value.telephoneNumberCtrl2) : '';
          supplier.extension2 = this.firstFormGroup.value.extCtrl2 ? Number(this.firstFormGroup.value.extCtrl2) : 0;
          supplier.position2 = this.firstFormGroup.value.positionCtrl2 ? this.firstFormGroup.value.positionCtrl2 : '';
          supplier.mobile_country_code2 = this.firstFormGroup.value.mobileCodeCtrl2 ? this.firstFormGroup.value.mobileCodeCtrl2 : '';
          supplier.mobile_no2 = this.firstFormGroup.value.mobileNumberCtrl2 ? String(this.firstFormGroup.value.mobileNumberCtrl2) : '';
          supplier.fax_country_code2 = this.firstFormGroup.value.faxCodeCtrl2 ? this.firstFormGroup.value.faxCodeCtrl2 : '';
          supplier.fax_no2 = this.firstFormGroup.value.faxNumberCtrl2 ? String(this.firstFormGroup.value.faxNumberCtrl2) : '';
        } else if (!this.additionalContact2) {
          supplier.title2 = '';
          supplier.first_name2 = '';
          supplier.last_name2 = '';
          supplier.email2 = '';
          supplier.telphone_country_code2 = '';
          supplier.telephone_no2 = '';
          supplier.extension2 = 0;
          supplier.position2 = '';
          supplier.mobile_country_code2 = '';
          supplier.mobile_no2 = '';
          supplier.fax_country_code2 = '';
          supplier.fax_no2 = '';
        }


        var suppliername = this.firstFormGroup.value.supplierNameCtrl;
        var supplieremail = this.firstFormGroup.value.emailCtrl;


        this.http.post<any>(environment.nodeurl + '/api/supplier/updateregisterbyrole?role='+ this.userRole+'&changeremail='+ this.userEmail+'&changername='+ this.userName, supplier).subscribe(async data => {
          if (data && data > 0) {
            supplier.supplier_id = data;

            if (this.htmlCanvas != null) {
              var filename = "filename_" + supplier.supplier_id + "_.png";
              this.htmlCanvas.toBlob(function (blob) {
                var form = new FormData(),
                  request = new XMLHttpRequest();

                form.append("image", blob, filename);
                request.open("POST", environment.nodeurl + '/api/file/uploadarabic', true);
                request.send(form);
              }, "image/png");
            }

            var bothselected = "false";

            let emgsupplierid = this.activatedRoute.snapshot.params.id;
            if (this.isEmergency) {
              bothselected = "true";


              if (supplier.country == 'SAUDI ARABIA') {
                bothselected = "true";
              } else {
                bothselected = "false";
              }
              // this.http.get(environment.nodeurl + '/api/file/moveemgfiles?tempId=' + emgsupplierid + '&registerId=' + supplier.supplier_id + '&both=' + bothselected+ '&cat=reg').subscribe(data => this.photos = data['photos']);
            }

            // this.fileUploading(supplier.supplier_id);
            let supplierid = this.activatedRoute.snapshot.params.id;
            if (!supplierid) {
              supplierid = this.supplierIdforTemp;
            }

            this.fileUploading2(supplier.supplier_id, supplier.email, supplierid, this.rejectedSupplierId, this.isEmergency, bothselected, emgsupplierid);
            
            this.savedCategory = 'reg';


            this.isDisabled = true;

            Swal.close();

            var d = new Date();
            // var fullyear = d.getFullYear();

            if (this.isNeedmoreInfo) {
              Swal.fire({
                title:  "Supplier data updated successfully",
                html: "<p style='font-size: 18px;'>Supplier editted has been submitted successfully. </p>", width: "1200px",
                showCancelButton: false,
                allowOutsideClick: false,
                confirmButtonText: `Ok`
              }).then(async (result) => {
                if (result.isConfirmed) {
                  Swal.fire({
                    title: 'Please dont refresh the web browser, we are sending you the email!',
                    showConfirmButton: false,
                    allowOutsideClick: false
                  })
                  Swal.showLoading();

                }
              });
            }
          } else {
            Swal.fire('Something went wrong please contact administrator!', 'Failed');

          }
        })



      } else {
        Swal.fire('Supplier categories required !', 'fail');

      }
    }


  }

  loadCurrentUserData() {
    this.userRole = localStorage.getItem("userrole");
    this.userEmail = localStorage.getItem("useremail");
    this.userName = localStorage.getItem("username");
    this.userfullname = localStorage.getItem("userfullname");
}

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  vatCtrlChange(event: any) {

    if (this.firstFormGroup.value.vatCtrl == '') {
      this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });
    }

    if (this.firstFormGroup.value.vatCtrl == "") {
      this.isVatNumberSelected = false;
    }

    if (this.firstFormGroup.value.vatCtrl != "") {
      this.isVatNumberSelected = true;
    }

  }

  otherCountry(event: any) {
    if (this.firstFormGroup.value.otherCityCtrl == '') {
      this.firstFormGroup.get('otherCityCtrl').setErrors({ invalid: true });
    }
  }

  // otherBank(event: any){
  //   if(this.firstFormGroup.value.otherCityCtrl == ''){
  //     this.firstFormGroup.get('otherCityCtrl').setErrors({ invalid: true });
  //   }
  // }

  onTabChanged($event) {
    let clickedIndex = $event.index;
    console.log("Inside ontab change : " + clickedIndex);
  }


  changeTermsandcondition() {

    console.log('state of terms : ' + this.termsAndConditionsCheck);

    console.log('checkbox : ' + this.thirdFormGroup.value.termsandconditionCtrl);

    if (this.thirdFormGroup.value.termsandconditionCtrl) {
      this.termsAndConditionsCheck = true;
      console.log('state of terms 2 : ' + this.termsAndConditionsCheck);

    } else if (!this.thirdFormGroup.value.termsandconditionCtrl) {
      this.termsAndConditionsCheck = false;
      console.log('state of terms 3: ' + this.termsAndConditionsCheck);

    }

    if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
      if (this.firstFormGroup.value.vatCtrl == null) {
        this.isVatNumberSelected = false;
      }

      if (this.firstFormGroup.value.vatCtrl != null) {
        this.isVatNumberSelected = true;
      }

      if (this.firstFormGroup.value.vatCtrl == "") {
        this.isVatNumberSelected = false;
      }

    }

    if (this.firstFormGroup.value.countryCtrl != 'SAUDI ARABIA') {
      this.isVatNumberSelected = true;
    }

    let supplierid = this.activatedRoute.snapshot.params.id;
    let category = this.activatedRoute.snapshot.params.cat;

    if (this.isfirsttimeclickcount == 0) {
      if (supplierid && category && category.indexOf('R_') > -1) {
        this.changeTab("Bank Information");
      }

      if (this.istempFile) {
        this.changeTab("Bank Information");
      }
    }
    this.isfirsttimeclickcount++;
  }

  changeTab(position: string) {
    for (let i = 0; i < document.querySelectorAll('.mat-tab-label-content').length; i++) {
      if ((<HTMLElement>document.querySelectorAll('.mat-tab-label-content')[i]).innerText == position) {
        (<HTMLElement>document.querySelectorAll('.mat-tab-label')[i]).click();
      }
    }
  }

  goToProfileDetailsQulityTab() {
    this.selectedMainTabIndex = 1;
    this.selectedProfileTabIndex = 6;
  }

  supplierTypeList: string[] = ['Manufacturer', 'Service Provider', 'Trading House'];
  titleList: string[] = ['Miss', 'Mr', 'Mrs'];
  yesNoList: string[] = ['Yes', 'No'];
  accountCurrencyList: String[] = [];
  currencyCodeList: String[] = ['Code ', 'AFN ', 'ALL ', 'DZD ', 'USD ', 'EUR ', 'AOA ', 'XCD ', 'XCD ', 'ARS ', 'AMD ', 'AWG ', 'AUD ', 'EUR ', 'AZN ', 'BSD ', 'BHD ', 'BDT ', 'BBD ', 'BYN ', 'EUR ', 'BZD ', 'XOF ', 'BMD ', 'BTN ', 'INR ', 'BOB ', 'BOV ', 'USD ', 'BAM ', 'BWP ', 'NOK ', 'BRL ', 'USD ', 'BND ', 'BGN ', 'XOF ', 'BIF ', 'CVE ', 'KHR ', 'XAF ', 'CAD ', 'KYD ', 'XAF ', 'XAF ', 'CLF ', 'CLP ', 'CNY ', 'AUD ', 'AUD ', 'COP ', 'COU ', 'KMF ', 'CDF ', 'XAF ', 'NZD ', 'CRC ', 'HRK ', 'CUC ', 'CUP ', 'ANG ', 'EUR ', 'CZK ', 'XOF ', 'DKK ', 'DJF ', 'XCD ', 'DOP ', 'USD ', 'EGP ', 'SVC ', 'USD ', 'XAF ', 'ERN ', 'EUR ', 'ETB ', 'EUR ', 'FKP ', 'DKK ', 'FJD ', 'EUR ', 'EUR ', 'EUR ', 'XPF ', 'EUR ', 'XAF ', 'GMD ', 'GEL ', 'EUR ', 'GHS ', 'GIP ', 'EUR ', 'DKK ', 'XCD ', 'EUR ', 'USD ', 'GTQ ', 'GBP ', 'GNF ', 'XOF ', 'GYD ', 'HTG ', 'USD ', 'AUD ', 'EUR ', 'HNL ', 'HKD ', 'HUF ', 'ISK ', 'INR ', 'IDR ', 'XDR ', 'IRR ', 'IQD ', 'EUR ', 'GBP ', 'ILS ', 'EUR ', 'JMD ', 'JPY ', 'GBP ', 'JOD ', 'KZT ', 'KES ', 'AUD ', 'KPW ', 'KRW ', 'KWD ', 'KGS ', 'LAK ', 'EUR ', 'LBP ', 'LSL ', 'ZAR ', 'LRD ', 'LYD ', 'CHF ', 'EUR ', 'EUR ', 'MOP ', 'MGA ', 'MWK ', 'MYR ', 'MVR ', 'XOF ', 'EUR ', 'USD ', 'EUR ', 'MRU ', 'MUR ', 'EUR ', 'XUA ', 'MXN ', 'MXV ', 'USD ', 'MDL ', 'EUR ', 'MNT ', 'EUR ', 'XCD ', 'MAD ', 'MZN ', 'MMK ', 'NAD ', 'ZAR ', 'AUD ', 'NPR ', 'EUR ', 'XPF ', 'NZD ', 'NIO ', 'XOF ', 'NGN ', 'NZD ', 'AUD ', 'USD ', 'NOK ', 'OMR ', 'PKR ', 'USD ', ' ', 'PAB ', 'USD ', 'PGK ', 'PYG ', 'PEN ', 'PHP ', 'NZD ', 'PLN ', 'EUR ', 'USD ', 'QAR ', 'MKD ', 'RON ', 'RUB ', 'RWF ', 'EUR ', 'EUR ', 'SHP ', 'XCD ', 'XCD ', 'EUR ', 'EUR ', 'XCD ', 'WST ', 'EUR ', 'STN ', 'SAR ', 'XOF ', 'RSD ', 'SCR ', 'SLL ', 'SGD ', 'ANG ', 'XSU ', 'EUR ', 'EUR ', 'SBD ', 'SOS ', 'ZAR ', ' ', 'SSP ', 'EUR ', 'LKR ', 'SDG ', 'SRD ', 'NOK ', 'SZL ', 'SEK ', 'CHE ', 'CHF ', 'CHW ', 'SYP ', 'TWD ', 'TJS ', 'TZS ', 'THB ', 'USD ', 'XOF ', 'NZD ', 'TOP ', 'TTD ', 'TND ', 'TRY ', 'TMT ', 'USD ', 'AUD ', 'UGX ', 'UAH ', 'AED ', 'GBP ', 'USD ', 'USD ', 'USN ', 'UYI ', 'UYU ', 'UZS ', 'VUV ', 'VEF ', 'VND ', 'USD ', 'USD ', 'XPF ', 'MAD ', 'YER ', 'ZMW ', 'ZWL ', 'EUR '];
  typeOfOrganizationList: string[] = ['Govt Owned', 'Joint Stock Company', 'Limited Liability', 'Non-Profit', 'Other - Please Specify', 'Sole Proprietor'];
  countryList: String[] = ['Afghanistan ', 'Albania ', 'Algeria ', 'American Samoa ', 'Andorra ', 'Angola ', 'Anguila ', 'Antigua and Barbuda ', 'Argentina ', 'Armenia ', 'Aruba ', 'Australia ', 'Austria ', 'Azerbaijan ', 'Bahamas, The ', 'Bahrain ', 'Bangladesh ', 'Barbados ', 'Belarus ', 'Belgium ', 'Belgium-Luxembourg ', 'Belize ', 'Benin ', 'Bermuda ', 'Bhutan ', 'Bolivia ', 'Bosnia and Herzegovina ', 'Botswana ', 'Br. Antr. Terr ', 'Brazil ', 'British Indian Ocean Ter. ', 'British Virgin Islands ', 'Brunei ', 'Bulgaria ', 'Burkina Faso ', 'Burundi ', 'Cambodia ', 'Cameroon ', 'Canada ', 'Cape Verde ', 'Cayman Islands ', 'Central African Republic ', 'Chad ', 'Chile ', 'China ', 'Christmas Island ', 'Cocos (Keeling) Islands ', 'Colombia ', 'Comoros ', 'Congo, Dem. Rep. ', 'Congo, Rep. ', 'Cook Islands ', 'Costa Rica ', 'Cote dIvoire ', 'Croatia ', 'Cuba ', 'Cyprus ', 'Czech Republic ', 'Czechoslovakia ', 'Denmark ', 'Djibouti ', 'Dominica ', 'Dominican Republic ', 'East Timor ', 'Ecuador ', 'Egypt, Arab Rep. ', 'El Salvador ', 'Equatorial Guinea ', 'Eritrea ', 'Estonia ', 'Ethiopia (excludes Eritrea) ', 'Ethiopia (includes Eritrea) ', 'European Union ', 'Faeroe Islands ', 'Falkland Island ', 'Fiji ', 'Finland ', 'Fm Panama Cz ', 'Fm Rhod Nyas ', 'Fm Tanganyik ', 'Fm Vietnam Dr ', 'Fm Vietnam Rp ', 'Fm Zanz-Pemb ', 'Fr. So. Ant. Tr ', 'France ', 'Free Zones ', 'French Guiana ', 'French Polynesia ', 'Gabon ', 'Gambia, The ', 'Gaza Strip ', 'Georgia ', 'German Democratic Republic ', 'Germany ', 'Ghana ', 'Gibraltar ', 'Greece ', 'Greenland ', 'Grenada ', 'Guadeloupe ', 'Guam ', 'Guatemala ', 'Guinea ', 'Guinea-Bissau ', 'Guyana ', 'Haiti ', 'Holy See ', 'Honduras ', 'Hong Kong, China ', 'Hungary ', 'Iceland ', 'India ', 'Indonesia ', 'Iran, Islamic Rep. ', 'Iraq ', 'Ireland ', 'Israel ', 'Italy ', 'Jamaica ', 'Japan ', 'Jhonston Island ', 'Jordan ', 'Kazakhstan ', 'Kenya ', 'Kiribati ', 'Korea, Dem. Rep. ', 'Korea, Rep. ', 'Kuwait ', 'Kyrgyz Republic ', 'Lao PDR ', 'Latvia ', 'Lebanon ', 'Lesotho ', 'Liberia ', 'Libya ', 'Liechtenstein ', 'Lithuania ', 'Luxembourg ', 'Macao ', 'Macedonia, FYR ', 'Madagascar ', 'Malawi ', 'Malaysia ', 'Maldives ', 'Mali ', 'Malta ', 'Marshall Islands ', 'Martinique ', 'Mauritania ', 'Mauritius ', 'Mexico ', 'Micronesia, Fed. Sts. ', 'Midway Islands ', 'Moldova ', 'Monaco ', 'Mongolia ', 'Montserrat ', 'Morocco ', 'Mozambique ', 'Myanmar ', 'Namibia ', 'Nauru ', 'Nepal ', 'Netherlands ', 'Netherlands Antilles ', 'Neutral Zone ', 'New Caledonia ', 'New Zealand ', 'Nicaragua ', 'Niger ', 'Nigeria ', 'Niue ', 'Norfolk Island ', 'Northern Mariana Islands ', 'Norway ', 'Oman ', 'Pacific Islands ', 'Pakistan ', 'Palau ', 'Panama ', 'Papua New Guinea ', 'Paraguay ', 'Pen Malaysia ', 'Peru ', 'Philippines ', 'Pitcairn ', 'Poland ', 'Portugal ', 'Puerto Rico ', 'Qatar ', 'Reunion ', 'Romania ', 'Russian Federation ', 'Rwanda ', 'Ryukyu Is ', 'Sabah ', 'Saint Helena ', 'Saint Kitts-Nevis-Anguilla-Aru ', 'Saint Pierre and Miquelon ', 'Samoa ', 'San Marino ', 'Sao Tome and Principe ', 'Sarawak ', 'Saudi Arabia ', 'Senegal ', 'Seychelles ', 'Sierra Leone ', 'SIKKIM ', 'Singapore ', 'Slovak Republic ', 'Slovenia ', 'Solomon Islands ', 'Somalia ', 'South Africa ', 'Soviet Union ', 'Spain ', 'Special Categories ', 'Sri Lanka ', 'St. Kitts and Nevis ', 'St. Lucia ', 'St. Vincent and the Grenadines ', 'Sudan ', 'Suriname ', 'Svalbard and Jan Mayen Is ', 'Swaziland ', 'Sweden ', 'Switzerland ', 'Syrian Arab Republic ', 'Taiwan ', 'Tajikistan ', 'Tanzania ', 'Thailand ', 'Togo ', 'Tokelau ', 'Tonga ', 'Trinidad and Tobago ', 'Tunisia '];
  telephoneCodeList: String[] = ['Aaland 358 ', 'Afghanistan 93 ', 'Albania 355 ', 'Algeria 213 ', 'American Samoa 1 684 ', 'Andorra 376 ', 'Angola 244 ', 'Anguilla 1 264 ', 'Antarctica (Australian bases) 6721 ', 'Antigua and Barbuda 1 268 ', 'Argentina 54 ', 'Armenia 374 ', 'Aruba 297 ', 'Ascension 247 ', 'Australia 61 ', 'Austria 43 ', 'Azerbaijan 994 ', 'Bahamas 1 242 ', 'Bahrain 973 ', 'Bangladesh 880 ', 'Barbados 1 246 ', 'Belarus 375 ', 'Belgium 32 ', 'Belize 501 ', 'Benin 229 ', 'Bermuda 1 441 ', 'Bhutan 975 ', 'Bolivia 591 ', 'Bosnia and Herzegovina 387 ', 'Botswana 267 ', 'Brazil 55 ', 'British Indian Ocean Territory 246 ', 'British Virgin Islands 1 284 ', 'Brunei 673 ', 'Bulgaria 359 ', 'Burkina Faso 226 ', 'Burundi 257 ', 'Cambodia 855 ', 'Cameroon 237 ', 'Canada 1 ', 'Cape Verde 238 ', 'Cayman Islands 1 345 ', 'Central African Republic 236 ', 'Chad 235 ', 'Chile 56 ', 'China 86 ', 'Colombia 57 ', 'Comoros 269 ', 'Congo, Democratic Republic of the 243 ', 'Congo, Republic of the 242 ', 'Cook Islands 682 ', 'Costa Rica 506 ', 'Cote dIvoire 225 ', 'Croatia 385 ', 'Cuba 53 ', 'Curaçao 599 ', 'Cyprus 357 ', 'Czech Republic 420 ', 'Denmark 45 ', 'Djibouti 253 ', 'Dominica 1 767 ', 'Dominican Republic 1 809, 1 829, and 1 849 ', 'Ecuador 593 ', 'Egypt 20 ', 'El Salvador 503 ', 'Equatorial Guinea 240 ', 'Eritrea 291 ', 'Estonia 372 ', 'Eswatini 268 ', 'Ethiopia 251 ', 'Falkland Islands 500 ', 'Faroe Islands 298 ', 'Fiji 679 ', 'Finland 358 ', 'France 33 ', 'French Guiana 594 ', 'French Polynesia 689 ', 'Gabon 241 ', 'Gambia 220 ', 'Gaza Strip 970 ', 'Georgia (and parts of breakaway regions Abkhazia as well as South Ossetia) 995 ', 'Germany 49 ', 'Ghana 233 ', 'Gibraltar 350 ', 'Greece 30 ', 'Greenland 299 ', 'Grenada 1 473 ', 'Guadeloupe 590 ', 'Guam 1 671 ', 'Guatemala 502 ', 'Guinea 224 ', 'Guinea-Bissau 245 ', 'Guyana 592 ', 'Haiti 509 ', 'Honduras 504 ', 'Hong Kong 852 ', 'Hungary 36 ', 'Iceland 354 ', 'India 91 ', 'Indonesia 62 ', 'Iraq 964 ', 'Iran 98 ', 'Ireland (Eire) 353 ', 'Israel 972 ', 'Italy 39 ', 'Jamaica 1 876, 1 658 ', 'Japan 81 ', 'Jordan 962 ', 'Kazakhstan 7 ', 'Kenya 254 ', 'Kiribati 686 ', 'Kosovo 383 ', 'Kuwait 965 ', 'Kyrgyzstan 996 ', 'Laos 856 ', 'Latvia 371 ', 'Lebanon 961 ', 'Lesotho 266 ', 'Liberia 231 ', 'Libya 218 ', 'Liechtenstein 423 ', 'Lithuania 370 ', 'Luxembourg 352 ', 'Macau 853 ', 'Madagascar 261 ', 'Malawi 265 ', 'Malaysia 60 ', 'Maldives 960 ', 'Mali 223 ', 'Malta 356 ', 'Marshall Islands 692 ', 'Martinique 596 ', 'Mauritania 222 ', 'Mauritius 230 ', 'Mayotte 262 ', 'Mexico 52 ', 'Micronesia, Federated States of 691 ', 'Moldova (plus breakaway Pridnestrovie) 373 ', 'Monaco 377 ', 'Mongolia 976 ', 'Montenegro 382 ', 'Montserrat 1 664 ', 'Morocco 212 ', 'Mozambique 258 ', 'Myanmar 95 ', 'Namibia 264 ', 'Nauru 674 ', 'Netherlands 31 ', 'Netherlands Antilles 599 ', 'Nepal 977 ', 'New Caledonia 687 ', 'New Zealand 64 ', 'Nicaragua 505 ', 'Niger 227 ', 'Nigeria 234 ', 'Niue 683 ', 'Norfolk Island 6723 ', 'North Korea 850 ', 'North Macedonia 389 ', 'Northern Ireland 44 28 ', 'Northern Mariana Islands 1 670 ', 'Norway 47 ', 'Oman 968 ', 'Pakistan 92 ', 'Palau 680 ', 'Panama 507 ', 'Papua New Guinea 675 ', 'Paraguay 595 ', 'Peru 51 ', 'Philippines 63 ', 'Poland 48 ', 'Portugal 351 ', 'Puerto Rico 1 787 and 1 939 ', 'Qatar 974 ', 'Reunion 262 ', 'Romania 40 ', 'Russia 7 ', 'Rwanda 250 ', 'Saint-Barthélemy 590 ', 'Saint Helena and Tristan da Cunha 290 ', 'Saint Kitts and Nevis 1 869 ', 'Saint Lucia 1 758 ', 'Saint Martin (French side) 590 ', 'Saint Pierre and Miquelon 508 ', 'Saint Vincent and the Grenadines 1 784 ', 'Samoa 685 ', 'San Marino 378', 'Sao Tome and Principe 239 ', 'Saudi Arabia 966 ', 'Senegal 221 ', 'Serbia 381 ', 'Seychelles 248 ', 'Sierra Leone 232 ', 'Sint Maarten (Dutch side) 1 721 ', 'Singapore 65 ', 'Slovakia 421 ', 'Slovenia 386 ', 'Solomon Islands 677 ', 'Somalia 252 ', 'South Africa 27 ', 'South Korea 82 ', 'South Sudan 211 ', 'Spain 34 ', 'Sri Lanka 94 ', 'Sudan 249 ', 'Suriname 597 ', 'Sweden 46 ', 'Switzerland 41 ', 'Syria 963 ', 'Taiwan 886 ', 'Tajikistan 992 ', 'Tanzania 255 ', 'Thailand 66 ', 'Timor-Leste 670 ', 'Togo 228 ', 'Tokelau 690 ', 'Tonga 676 ', 'Trinidad and Tobago 1 868 ', 'Tunisia 216 ', 'Turkey 90 ', 'Turkmenistan 993 ', 'Turks and Caicos Islands 1 649 ', 'Tuvalu 688 ', 'Uganda 256 ', 'Ukraine 380 ', 'United Arab Emirates 971 ', 'United Kingdom 44 ', 'United States of America 1 ', 'Uruguay 598 ', 'Uzbekistan 998 ', 'Vanuatu 678 ', 'Venezuela 58 ', 'Vietnam 84 ', 'U.S. Virgin Islands 1 340 ', 'Wallis and Futuna 681 ', 'West Bank 970 ', 'Yemen 967 ', 'Zambia 260 ', 'Zimbabwe 263'];
  telephoneCodeList1: String[] = ['Aaland 358 ', 'Afghanistan 93 ', 'Albania 355 ', 'Algeria 213 ', 'American Samoa 1 684 ', 'Andorra 376 ', 'Angola 244 ', 'Anguilla 1 264 ', 'Antarctica (Australian bases) 6721 ', 'Antigua and Barbuda 1 268 ', 'Argentina 54 ', 'Armenia 374 ', 'Aruba 297 ', 'Ascension 247 ', 'Australia 61 ', 'Austria 43 ', 'Azerbaijan 994 ', 'Bahamas 1 242 ', 'Bahrain 973 ', 'Bangladesh 880 ', 'Barbados 1 246 ', 'Belarus 375 ', 'Belgium 32 ', 'Belize 501 ', 'Benin 229 ', 'Bermuda 1 441 ', 'Bhutan 975 ', 'Bolivia 591 ', 'Bosnia and Herzegovina 387 ', 'Botswana 267 ', 'Brazil 55 ', 'British Indian Ocean Territory 246 ', 'British Virgin Islands 1 284 ', 'Brunei 673 ', 'Bulgaria 359 ', 'Burkina Faso 226 ', 'Burundi 257 ', 'Cambodia 855 ', 'Cameroon 237 ', 'Canada 1 ', 'Cape Verde 238 ', 'Cayman Islands 1 345 ', 'Central African Republic 236 ', 'Chad 235 ', 'Chile 56 ', 'China 86 ', 'Colombia 57 ', 'Comoros 269 ', 'Congo, Democratic Republic of the 243 ', 'Congo, Republic of the 242 ', 'Cook Islands 682 ', 'Costa Rica 506 ', 'Cote dIvoire 225 ', 'Croatia 385 ', 'Cuba 53 ', 'Curaçao 599 ', 'Cyprus 357 ', 'Czech Republic 420 ', 'Denmark 45 ', 'Djibouti 253 ', 'Dominica 1 767 ', 'Dominican Republic 1 809, 1 829, and 1 849 ', 'Ecuador 593 ', 'Egypt 20 ', 'El Salvador 503 ', 'Equatorial Guinea 240 ', 'Eritrea 291 ', 'Estonia 372 ', 'Eswatini 268 ', 'Ethiopia 251 ', 'Falkland Islands 500 ', 'Faroe Islands 298 ', 'Fiji 679 ', 'Finland 358 ', 'France 33 ', 'French Guiana 594 ', 'French Polynesia 689 ', 'Gabon 241 ', 'Gambia 220 ', 'Gaza Strip 970 ', 'Georgia (and parts of breakaway regions Abkhazia as well as South Ossetia) 995 ', 'Germany 49 ', 'Ghana 233 ', 'Gibraltar 350 ', 'Greece 30 ', 'Greenland 299 ', 'Grenada 1 473 ', 'Guadeloupe 590 ', 'Guam 1 671 ', 'Guatemala 502 ', 'Guinea 224 ', 'Guinea-Bissau 245 ', 'Guyana 592 ', 'Haiti 509 ', 'Honduras 504 ', 'Hong Kong 852 ', 'Hungary 36 ', 'Iceland 354 ', 'India 91 ', 'Indonesia 62 ', 'Iraq 964 ', 'Iran 98 ', 'Ireland (Eire) 353 ', 'Israel 972 ', 'Italy 39 ', 'Jamaica 1 876, 1 658 ', 'Japan 81 ', 'Jordan 962 ', 'Kazakhstan 7 ', 'Kenya 254 ', 'Kiribati 686 ', 'Kosovo 383 ', 'Kuwait 965 ', 'Kyrgyzstan 996 ', 'Laos 856 ', 'Latvia 371 ', 'Lebanon 961 ', 'Lesotho 266 ', 'Liberia 231 ', 'Libya 218 ', 'Liechtenstein 423 ', 'Lithuania 370 ', 'Luxembourg 352 ', 'Macau 853 ', 'Madagascar 261 ', 'Malawi 265 ', 'Malaysia 60 ', 'Maldives 960 ', 'Mali 223 ', 'Malta 356 ', 'Marshall Islands 692 ', 'Martinique 596 ', 'Mauritania 222 ', 'Mauritius 230 ', 'Mayotte 262 ', 'Mexico 52 ', 'Micronesia, Federated States of 691 ', 'Moldova (plus breakaway Pridnestrovie) 373 ', 'Monaco 377 ', 'Mongolia 976 ', 'Montenegro 382 ', 'Montserrat 1 664 ', 'Morocco 212 ', 'Mozambique 258 ', 'Myanmar 95 ', 'Namibia 264 ', 'Nauru 674 ', 'Netherlands 31 ', 'Netherlands Antilles 599 ', 'Nepal 977 ', 'New Caledonia 687 ', 'New Zealand 64 ', 'Nicaragua 505 ', 'Niger 227 ', 'Nigeria 234 ', 'Niue 683 ', 'Norfolk Island 6723 ', 'North Korea 850 ', 'North Macedonia 389 ', 'Northern Ireland 44 28 ', 'Northern Mariana Islands 1 670 ', 'Norway 47 ', 'Oman 968 ', 'Pakistan 92 ', 'Palau 680 ', 'Panama 507 ', 'Papua New Guinea 675 ', 'Paraguay 595 ', 'Peru 51 ', 'Philippines 63 ', 'Poland 48 ', 'Portugal 351 ', 'Puerto Rico 1 787 and 1 939 ', 'Qatar 974 ', 'Reunion 262 ', 'Romania 40 ', 'Russia 7 ', 'Rwanda 250 ', 'Saint-Barthélemy 590 ', 'Saint Helena and Tristan da Cunha 290 ', 'Saint Kitts and Nevis 1 869 ', 'Saint Lucia 1 758 ', 'Saint Martin (French side) 590 ', 'Saint Pierre and Miquelon 508 ', 'Saint Vincent and the Grenadines 1 784 ', 'Samoa 685 ', 'San Marino 378', 'Sao Tome and Principe 239 ', 'Saudi Arabia 966 ', 'Senegal 221 ', 'Serbia 381 ', 'Seychelles 248 ', 'Sierra Leone 232 ', 'Sint Maarten (Dutch side) 1 721 ', 'Singapore 65 ', 'Slovakia 421 ', 'Slovenia 386 ', 'Solomon Islands 677 ', 'Somalia 252 ', 'South Africa 27 ', 'South Korea 82 ', 'South Sudan 211 ', 'Spain 34 ', 'Sri Lanka 94 ', 'Sudan 249 ', 'Suriname 597 ', 'Sweden 46 ', 'Switzerland 41 ', 'Syria 963 ', 'Taiwan 886 ', 'Tajikistan 992 ', 'Tanzania 255 ', 'Thailand 66 ', 'Timor-Leste 670 ', 'Togo 228 ', 'Tokelau 690 ', 'Tonga 676 ', 'Trinidad and Tobago 1 868 ', 'Tunisia 216 ', 'Turkey 90 ', 'Turkmenistan 993 ', 'Turks and Caicos Islands 1 649 ', 'Tuvalu 688 ', 'Uganda 256 ', 'Ukraine 380 ', 'United Arab Emirates 971 ', 'United Kingdom 44 ', 'United States of America 1 ', 'Uruguay 598 ', 'Uzbekistan 998 ', 'Vanuatu 678 ', 'Venezuela 58 ', 'Vietnam 84 ', 'U.S. Virgin Islands 1 340 ', 'Wallis and Futuna 681 ', 'West Bank 970 ', 'Yemen 967 ', 'Zambia 260 ', 'Zimbabwe 263'];
  telephoneCodeList2: String[] = ['Aaland 358 ', 'Afghanistan 93 ', 'Albania 355 ', 'Algeria 213 ', 'American Samoa 1 684 ', 'Andorra 376 ', 'Angola 244 ', 'Anguilla 1 264 ', 'Antarctica (Australian bases) 6721 ', 'Antigua and Barbuda 1 268 ', 'Argentina 54 ', 'Armenia 374 ', 'Aruba 297 ', 'Ascension 247 ', 'Australia 61 ', 'Austria 43 ', 'Azerbaijan 994 ', 'Bahamas 1 242 ', 'Bahrain 973 ', 'Bangladesh 880 ', 'Barbados 1 246 ', 'Belarus 375 ', 'Belgium 32 ', 'Belize 501 ', 'Benin 229 ', 'Bermuda 1 441 ', 'Bhutan 975 ', 'Bolivia 591 ', 'Bosnia and Herzegovina 387 ', 'Botswana 267 ', 'Brazil 55 ', 'British Indian Ocean Territory 246 ', 'British Virgin Islands 1 284 ', 'Brunei 673 ', 'Bulgaria 359 ', 'Burkina Faso 226 ', 'Burundi 257 ', 'Cambodia 855 ', 'Cameroon 237 ', 'Canada 1 ', 'Cape Verde 238 ', 'Cayman Islands 1 345 ', 'Central African Republic 236 ', 'Chad 235 ', 'Chile 56 ', 'China 86 ', 'Colombia 57 ', 'Comoros 269 ', 'Congo, Democratic Republic of the 243 ', 'Congo, Republic of the 242 ', 'Cook Islands 682 ', 'Costa Rica 506 ', 'Cote dIvoire 225 ', 'Croatia 385 ', 'Cuba 53 ', 'Curaçao 599 ', 'Cyprus 357 ', 'Czech Republic 420 ', 'Denmark 45 ', 'Djibouti 253 ', 'Dominica 1 767 ', 'Dominican Republic 1 809, 1 829, and 1 849 ', 'Ecuador 593 ', 'Egypt 20 ', 'El Salvador 503 ', 'Equatorial Guinea 240 ', 'Eritrea 291 ', 'Estonia 372 ', 'Eswatini 268 ', 'Ethiopia 251 ', 'Falkland Islands 500 ', 'Faroe Islands 298 ', 'Fiji 679 ', 'Finland 358 ', 'France 33 ', 'French Guiana 594 ', 'French Polynesia 689 ', 'Gabon 241 ', 'Gambia 220 ', 'Gaza Strip 970 ', 'Georgia (and parts of breakaway regions Abkhazia as well as South Ossetia) 995 ', 'Germany 49 ', 'Ghana 233 ', 'Gibraltar 350 ', 'Greece 30 ', 'Greenland 299 ', 'Grenada 1 473 ', 'Guadeloupe 590 ', 'Guam 1 671 ', 'Guatemala 502 ', 'Guinea 224 ', 'Guinea-Bissau 245 ', 'Guyana 592 ', 'Haiti 509 ', 'Honduras 504 ', 'Hong Kong 852 ', 'Hungary 36 ', 'Iceland 354 ', 'India 91 ', 'Indonesia 62 ', 'Iraq 964 ', 'Iran 98 ', 'Ireland (Eire) 353 ', 'Israel 972 ', 'Italy 39 ', 'Jamaica 1 876, 1 658 ', 'Japan 81 ', 'Jordan 962 ', 'Kazakhstan 7 ', 'Kenya 254 ', 'Kiribati 686 ', 'Kosovo 383 ', 'Kuwait 965 ', 'Kyrgyzstan 996 ', 'Laos 856 ', 'Latvia 371 ', 'Lebanon 961 ', 'Lesotho 266 ', 'Liberia 231 ', 'Libya 218 ', 'Liechtenstein 423 ', 'Lithuania 370 ', 'Luxembourg 352 ', 'Macau 853 ', 'Madagascar 261 ', 'Malawi 265 ', 'Malaysia 60 ', 'Maldives 960 ', 'Mali 223 ', 'Malta 356 ', 'Marshall Islands 692 ', 'Martinique 596 ', 'Mauritania 222 ', 'Mauritius 230 ', 'Mayotte 262 ', 'Mexico 52 ', 'Micronesia, Federated States of 691 ', 'Moldova (plus breakaway Pridnestrovie) 373 ', 'Monaco 377 ', 'Mongolia 976 ', 'Montenegro 382 ', 'Montserrat 1 664 ', 'Morocco 212 ', 'Mozambique 258 ', 'Myanmar 95 ', 'Namibia 264 ', 'Nauru 674 ', 'Netherlands 31 ', 'Netherlands Antilles 599 ', 'Nepal 977 ', 'New Caledonia 687 ', 'New Zealand 64 ', 'Nicaragua 505 ', 'Niger 227 ', 'Nigeria 234 ', 'Niue 683 ', 'Norfolk Island 6723 ', 'North Korea 850 ', 'North Macedonia 389 ', 'Northern Ireland 44 28 ', 'Northern Mariana Islands 1 670 ', 'Norway 47 ', 'Oman 968 ', 'Pakistan 92 ', 'Palau 680 ', 'Panama 507 ', 'Papua New Guinea 675 ', 'Paraguay 595 ', 'Peru 51 ', 'Philippines 63 ', 'Poland 48 ', 'Portugal 351 ', 'Puerto Rico 1 787 and 1 939 ', 'Qatar 974 ', 'Reunion 262 ', 'Romania 40 ', 'Russia 7 ', 'Rwanda 250 ', 'Saint-Barthélemy 590 ', 'Saint Helena and Tristan da Cunha 290 ', 'Saint Kitts and Nevis 1 869 ', 'Saint Lucia 1 758 ', 'Saint Martin (French side) 590 ', 'Saint Pierre and Miquelon 508 ', 'Saint Vincent and the Grenadines 1 784 ', 'Samoa 685 ', 'San Marino 378', 'Sao Tome and Principe 239 ', 'Saudi Arabia 966 ', 'Senegal 221 ', 'Serbia 381 ', 'Seychelles 248 ', 'Sierra Leone 232 ', 'Sint Maarten (Dutch side) 1 721 ', 'Singapore 65 ', 'Slovakia 421 ', 'Slovenia 386 ', 'Solomon Islands 677 ', 'Somalia 252 ', 'South Africa 27 ', 'South Korea 82 ', 'South Sudan 211 ', 'Spain 34 ', 'Sri Lanka 94 ', 'Sudan 249 ', 'Suriname 597 ', 'Sweden 46 ', 'Switzerland 41 ', 'Syria 963 ', 'Taiwan 886 ', 'Tajikistan 992 ', 'Tanzania 255 ', 'Thailand 66 ', 'Timor-Leste 670 ', 'Togo 228 ', 'Tokelau 690 ', 'Tonga 676 ', 'Trinidad and Tobago 1 868 ', 'Tunisia 216 ', 'Turkey 90 ', 'Turkmenistan 993 ', 'Turks and Caicos Islands 1 649 ', 'Tuvalu 688 ', 'Uganda 256 ', 'Ukraine 380 ', 'United Arab Emirates 971 ', 'United Kingdom 44 ', 'United States of America 1 ', 'Uruguay 598 ', 'Uzbekistan 998 ', 'Vanuatu 678 ', 'Venezuela 58 ', 'Vietnam 84 ', 'U.S. Virgin Islands 1 340 ', 'Wallis and Futuna 681 ', 'West Bank 970 ', 'Yemen 967 ', 'Zambia 260 ', 'Zimbabwe 263'];
  stateList: string[] = ['Abhā', 'Abqaiq', 'Al-Baḥah', 'Al-Dammām', 'Al-Hufūf', 'Al-Jawf', 'Al-Kharj (oasis)', 'Al-Khubar', 'Al-Qaṭīf', 'Al-Ṭaʾif', 'ʿArʿar', 'Buraydah', 'Dhahran', 'Ḥāʾil', 'Jiddah', 'Jīzān', 'Khamīs Mushayt', 'King Khalīd Military City', 'Mecca', 'Medina', 'Najrān', 'Ras Tanura', 'Riyadh', 'Sakākā', 'Tabūk', 'Yanbuʿ'];

  supplierType: string;
  currencycode: string;
  banknameList: any = [];
  cityList: any = [];
  cityListOriginal: any = [];
  selectedBankList: any = [];
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit(): Promise<void> {

    this.firstFormGroup = this._formBuilder.group({
      supplierNameCtrl: ['', Validators.required],
      supplierNameArabicCtrl: ['', Validators.compose([Validators.pattern('^[\u0600-\u06ff ]+$')])],
      websiteCtrl: ['', [URLValidator]],
      establishmentYearCtrl: ['', [YearValidator, YearValidator2, YearValidator3]],
      issuedByCtrl: [],
      supplierTypeCtrl: ['', Validators.required],
      countryCtrl: ['', Validators.required],
      kingdomCtrl: ['2'],
      stateCtrl: ['', Validators.required],
      otherCityCtrl: [],
      poBoxCtrl: [],
      postalCodeCtrl: [],
      addressLine1Ctrl: ['', Validators.required],
      addressLine1Ctr2: [],
      titleCtrl: ['', Validators.required],
      firstNameCtrl: ['', Validators.required],
      lastNameCtrl: ['', Validators.required],
      positionCtrl: ['', Validators.required],
      extCtrl: [],
      telephoneCodeCtrl: [],
      telephoneNumberCtrl: ['', Validators.required],
      mobileCodeCtrl: [],
      mobileNumberCtrl: ['', Validators.required],
      faxCodeCtrl: [],
      faxNumberCtrl: [],
      registrationCtrl: ['', Validators.required],
      hijriGregCtrl: [false],
      regfiletempCtrl: [],
      regfileoriCtrl: [],
      vatCtrl: [],
      vatfiletempCtrl: [],
      vatfileoriCtrl: [],
      gosifiletempCtrl: [],
      gosifileoriCtrl: [],
      saudifiletempCtrl: [],
      saudifileoriCtrl: [],
      zakathfiletempCtrl: [],
      zakathfileoriCtrl: [],
      associationfileoriCtrl: [],
      associationfiletempCtrl: [],
      // certificateDateCtrl: [],
      addressLine2Ctrl: [],
      accountNumberCtrl: [],
      additionalMaterialCtrl: [],
      waselCtrl: [],
      reghijri: [],
      reggregory: [],
      gosihijri: [],
      gosigregory: [],
      saudihijri: [],
      saudigregory: [],
      zakathijri: [],
      zakatgregory: [],
      emailCtrl: ['', Validators.compose([Validators.required, Validators.email])],
      titleCtrl1: [],
      firstNameCtrl1: [],
      lastNameCtrl1: [],
      positionCtrl1: [],
      emailCtrl1: [],
      telephoneCodeCtrl1: [],
      telephoneNumberCtrl1: [],
      extCtrl1: [],
      mobileCodeCtrl1: [],
      mobileNumberCtrl1: [],
      faxCodeCtrl1: [],
      faxNumberCtrl1: [],
      titleCtrl2: [],
      firstNameCtrl2: [],
      lastNameCtrl2: [],
      positionCtrl2: [],
      emailCtrl2: [],
      telephoneCodeCtrl2: [],
      telephoneNumberCtrl2: [],
      extCtrl2: [],
      mobileCodeCtrl2: [],
      mobileNumberCtrl2: [],
      faxCodeCtrl2: [],
      faxNumberCtrl2: []


    });
    this.secondFormGroup = this._formBuilder.group({
      typeOfOrganizationCtrl: ['', Validators.required],
      typeOfOrganization2Ctrl: [],
      managerialCtrl: ['', [Validators.required]],
      totallCtrl: [],
      technicallCtrl: ['', [Validators.required]],
      operationsCtrl: ['', [Validators.required]],
      saudiNationalslCtrl: [],
      parentcompanyCtrl: [],
      sistercompanyCtrl: [],
      ownercompanyCtrl: [],
      operatingProfit1Ctrl: ['', [FinanceYearValidate1, FinanceYearValidator2]],
      operatingProfit2Ctrl: [],
      netIncome1Ctrl: ['', [FinanceYearValidate2, FinanceYearValidator3]],
      netIncome2Ctrl: [],
      currentAsset1Ctrl: ['', [FinanceYearValidate3, FinanceYearValidator4]],
      currentAsset2Ctrl: [],
      totalLiable1Ctrl: ['', [FinanceYearValidate4, FinanceYearValidator5]],
      totalLiable2Ctrl: [],
      totalEquity1Ctrl: ['', [FinanceYearValidate5, FinanceYearValidator6]],
      totalEquity2Ctrl: [],
      noOfYearsCtrl: [],
      ownsPlantEquipCtrl: ['', Validators.required],
      designnCapCtrl: ['', Validators.required],
      designtempCtrl: [],
      designoriCtrl: [],
      finishProdCtrl: ['', Validators.required],
      finishtempCtrl: [],
      finishoriCtrl: [],
      internalPolicyCtrl: ['', Validators.required],
      registeredOrgCtrl: ['', Validators.required],
      registeredtempCtrl: [],
      registeredoriCtrl: [],
      suspendedProj1Ctrl: ['', Validators.required],
      suspendedProj2Ctrl: ['', [ExpYesNoValidator]],
      litigation1Ctrl: ['', Validators.required],
      litigation2Ctrl: ['', [LegalYesNoValidator]],
      compliance1Ctrl: ['', Validators.required],
      compliance2Ctrl: [],
      compliancetempCtrl: [],
      complianceoriCtrl: [],
      shareholder1Ctrl: ['', Validators.required],
      shareholder2Ctrl: ['', [LegalYesNoValidator2]],
      labour1Ctrl: ['', Validators.required],
      labour2Ctrl: ['', [LegalYesNoValidator3]],
      legalAsset1Ctrl: ['', Validators.required],
      legalAsset2Ctrl: ['', [LegalYesNoValidator6]],
      environment1Ctrl: ['', Validators.required],
      environment2Ctrl: ['', [LegalYesNoValidator4]],
      imiInterested1trl: ['', Validators.required],
      imiInterested2trl: ['', [LegalYesNoValidator5]],
      hse1Ctrl: ['', Validators.required],
      hse2Ctrl: [],
      hsetempCtrl: [],
      hseoriCtrl: [],
      docuHseCtrl: ['', Validators.required],
      docutempCtrl: [],
      docuoriCtrl: [],
      isohealthCtrl: ['', Validators.required],
      isohealthtempCtrl: [],
      isohealthoriCtrl: [],
      envtMgt1Ctrl: ['', Validators.required],
      envtMgt2Ctrl: [],
      envttempCtrl: [],
      envtoriCtrl: [],
      dedicatedpersCtrl: ['', Validators.required],
      statisticCtrl: ['', Validators.required],
      statisticNearCtrl: ['', [HealthYesNoValidator3]],
      statisticFirstCtrl: ['', [HealthYesNoValidator4]],
      statisticMediCtrl: ['', [HealthYesNoValidator5]],
      statisticLostCtrl: ['', [HealthYesNoValidator6]],
      statisticFatalCtrl: ['', [HealthYesNoValidator7]],
      statisticEnvtCtrl: ['', [HealthYesNoValidator8]],
      hseNameCtrl: ['', [HealthYesNoValidator]],
      hseDesigCtrl: ['', [HealthYesNoValidator2]],
      qualityNameCtrl: ['', [QualityYesNoValidator]],
      qualityDesigCtrl: ['', [QualityYesNoValidator2]],
      qualityPolicy1Ctrl: ['', Validators.required],
      qualityPolicy2Ctrl: [],
      qualityPolicytempCtrl: [],
      qualityPolicyoriCtrl: [],
      qualityMgtCtrl: ['', Validators.required],
      qualityMgttempCtrl: [],
      qualityMgtoriCtrl: [],
      qualityMgtIsoCtrl: ['', Validators.required],
      qualityMgtIsotempCtrl: [],
      qualityMgtIsooriCtrl: [],
      qualityResp1Ctrl: ['', Validators.required],
      // qualityResp2Ctrl: [],
      qualityreviewDateCtrl: ['', [QualityDateValidator]],
      // qualityreviewDateCtrlHij: [],
      // qualityreviewDateCtrlGreg: []
      additionalCtrl: [],
      additionalCtrl2: [],
      additionalCtrl3: [],
      additionalCtrl4: [],
      additionalCtrl5: [],
      statisticTempCtrl: [],
      StatisticoriCtrl: [],
    });
    this.thirdFormGroup = this._formBuilder.group({
      bankCountryCodesCtrl: ['', Validators.required],
      bankNameCtrl: ['', Validators.required],
      otherNameCtrl: ['', [BankNameValidator]],
      swiftCtrl: [],
      accountHolderNameCtrl: ['', Validators.required],
      ibanNumberCtrl: [],
      bankAddressLine1Ctrl: ['', Validators.required],
      bankAddressLine2Ctrl: [],
      accountCurrencyCtrl: [],
      accountNumberCtrl: [],
      multicurrency: [],
      bankfiletempCtrl: [],
      bankfileoriCtrl: [],
      bankletterheadfiletempCtrl: [],
      bankletterheadfileoriCtrl: [],
      termsandconditionCtrl: [false]
    });



    this.initialwork();
    this.getPhotos();
    this.getNeedMorePhotos();

    if (JSON.parse(localStorage.getItem("masterdata"))) {
      this.getMasterData1();
    }else{
      this.getMasterData();
    }


  }



  check_Word: boolean = false;
  public checkword(val) {
    var str = val;
    if (str.includes("٠") ||
      str.includes(" ") ||
      str.includes("١") ||
      str.includes("٢") ||
      str.includes("٣") ||
      str.includes("٤") ||
      str.includes("٥") ||
      str.includes("٦") ||
      str.includes("٧") ||
      str.includes("٨") ||
      str.includes("٩")) {
      return this.check_Word = false;
    }

    if (str.includes("٠") ||
      str.includes(" ") ||
      str.includes("١") ||
      str.includes("۲") ||
      str.includes("۳") ||
      str.includes("۴") ||
      str.includes("۵") ||
      str.includes("۶") ||
      str.includes("۷") ||
      str.includes("۸") ||
      str.includes("۹")) {
      return this.check_Word = false;
    }

    else if (str.includes("ء") ||
      str.includes(" ") ||
      str.includes("ا") ||
      str.includes("ب") ||
      str.includes("ة") ||
      str.includes("ت") ||
      str.includes("ث") ||
      str.includes("ج") ||
      str.includes("ح") ||
      str.includes("خ") ||
      str.includes("د") ||
      str.includes("ذ") ||
      str.includes("ر") ||
      str.includes("ز") ||
      str.includes("س") ||
      str.includes("ش") ||
      str.includes("ص") ||
      str.includes("ض") ||
      str.includes("ط") ||
      str.includes("ظ") ||
      str.includes("ع") ||
      str.includes("غ") ||
      str.includes("ـ") ||
      str.includes("ف") ||
      str.includes("ق") ||
      str.includes("ك") ||
      str.includes("ل") ||
      str.includes("م") ||
      str.includes("ن") ||
      str.includes("ه") ||
      str.includes("و") ||
      str.includes("ى") ||
      str.includes("ي")) {
      return this.check_Word = false;
    }

    else {
      return this.check_Word = true;
    }
  }

  setValuesInvite(supplier) {
    // this.supplier.supplier_name = supplier.SUPPLIER_NAME;
    // this.supplier.supplier_name_arabic = supplier.SUPPLIER_NAME_ARABIC;
    // this.supplier.web_site = supplier.WEB_SITE;


    this.firstFormGroup.patchValue({
      supplierNameCtrl: supplier.invite_supplier_name,
      supplierNameArabicCtrl: supplier.supplier_name_arabic,
      establishmentYearCtrl: supplier.establishment_year == 0 ? '' : Number(supplier.establishment_year),
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
      extCtrl: supplier.extension == 0 ? '' : Number(supplier.extension),
      emailCtrl: supplier.email,
      mobileCodeCtrl: supplier.mobile_country_code,
      mobileNumberCtrl: supplier.mobile_no,
      faxCodeCtrl: supplier.fax_country_code,
      faxNumberCtrl: supplier.fax_no,
      titleCtrl1: supplier.title1,
      firstNameCtrl1: supplier.first_name1,
      lastNameCtrl1: supplier.last_name1,
      positionCtrl1: supplier.position1,
      emailCtrl1: supplier.email1,
      telephoneCodeCtrl1: supplier.telphone_country_code1,
      telephoneNumberCtrl1: supplier.telephone_no1,
      extCtrl1: supplier.extension1 == 0 ? '' : Number(supplier.extension1),
      mobileCodeCtrl1: supplier.mobile_country_code1,
      mobileNumberCtrl1: supplier.mobile_no1,
      faxCodeCtrl1: supplier.fax_country_code1,
      faxNumberCtrl1: supplier.fax_no1,
      titleCtrl2: supplier.title2,
      firstNameCtrl2: supplier.first_name2,
      lastNameCtrl2: supplier.last_name2,
      positionCtrl2: supplier.position2,
      emailCtrl2: supplier.email2,
      telephoneCodeCtrl2: supplier.telphone_country_code2,
      telephoneNumberCtrl2: supplier.telephone_no2,
      extCtrl2: supplier.extension2 == 0 ? '' : Number(supplier.extension2),
      mobileCodeCtrl2: supplier.mobile_country_code2,
      mobileNumberCtrl2: supplier.mobile_no2,
      faxCodeCtrl2: supplier.fax_country_code2,
      faxNumberCtrl2: supplier.fax_no2,
      registrationCtrl: supplier.cr_no,
      cr_exp_date: supplier.cr_exp_date,
      additionalMaterialCtrl: supplier.additional_material,
      waselCtrl: supplier.wasalAddress,
      vatCtrl: supplier.vat_no,
      certificateDateCtrl: ''
    });

    this.secondFormGroup.patchValue({
      parentcompanyCtrl: supplier.parentcompany,
      sistercompanyCtrl: supplier.sistercompany,
      ownercompanyCtrl: supplier.ownercompany,
      operatingProfit1Ctrl: supplier.operatingProfit1 == 0 ? '' : supplier.operatingProfit1,
      operatingProfit2Ctrl: supplier.operatingProfit2 == 0 ? '' : supplier.operatingProfit2,
      netIncome1Ctrl: supplier.netIncome1 == 0 ? '' : supplier.netIncome1,
      netIncome2Ctrl: supplier.netIncome2 == 0 ? '' : supplier.netIncome2,
      currentAsset1Ctrl: supplier.currentAsset1 == 0 ? '' : supplier.currentAsset1,
      currentAsset2Ctrl: supplier.currentAsset2 == 0 ? '' : supplier.currentAsset2,
      totalLiable1Ctrl: supplier.totalLiable1 == 0 ? '' : supplier.totalLiable1,
      totalLiable2Ctrl: supplier.totalLiable2 == 0 ? '' : supplier.totalLiable2,
      totalEquity1Ctrl: supplier.totalEquity1 == 0 ? '' : supplier.totalEquity1,
      totalEquity2Ctrl: supplier.totalEquity2 == 0 ? '' : supplier.totalEquity2,
      noOfYearsCtrl: supplier.noOfYears == 0 ? '' : supplier.noOfYears,
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
      qualityreviewDateCtrl: (supplier.qualityreviewDate && supplier.qualityreviewDate.split('/')[2].split(' ')[0] > 1900) ? new Date(supplier.qualityreviewDate.split('/')[2].split(' ')[0], supplier.qualityreviewDate.split('/')[1] - 1, supplier.qualityreviewDate.split('/')[0]) : '',
      typeOfOrganizationCtrl: supplier.typeOfOrganization,
      typeOfOrganization2Ctrl: supplier.typeOfOrganization2,
      additionalCtrl: supplier.additionalCtrl,
      additionalCtrl2: supplier.additionalCtrl2,
      additionalCtrl3: supplier.additionalCtrl3,
      additionalCtrl4: supplier.additionalCtrl4,
      additionalCtrl5: supplier.additionalCtrl5,
      managerialCtrl: supplier.managerialno == 0 ? null : supplier.managerialno,
      technicallCtrl: supplier.technicalno == 0 ? null : supplier.technicalno,
      operationsCtrl: supplier.operationsno == 0 ? null : supplier.operationsno,
      saudiNationalslCtrl: supplier.saudiNationalsno,
      totallCtrl: supplier.managerialno + supplier.technicalno + supplier.operationsno

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

    //  var selmodelReg = new NgbDate(Number(supplier.reg_date.split(" ")[0].split("/")[2]), Number(supplier.reg_date.split(" ")[0].split("/")[1]) - 1, Number(supplier.reg_date.split(" ")[0].split("/")[0]));
    // var selmodelGosi = new NgbDate(Number(supplier.gosi_date.split(" ")[0].split("/")[2]), Number(supplier.gosi_date.split(" ")[0].split("/")[1]) - 1, Number(supplier.gosi_date.split(" ")[0].split("/")[0]));
    // var selmodelSaudi = new NgbDate(Number(supplier.saudi_date.split(" ")[0].split("/")[2]), Number(supplier.saudi_date.split(" ")[0].split("/")[1]) - 1, Number(supplier.saudi_date.split(" ")[0].split("/")[0]));
    // var selmodelZakat = new NgbDate(Number(supplier.zakath_date.split(" ")[0].split("/")[2]), Number(supplier.zakath_date.split(" ")[0].split("/")[1]) - 1, Number(supplier.zakath_date.split(" ")[0].split("/")[0]));

    // if (supplier.hijriSelected == 'Y') {
    //   var reg_date = selmodelReg.year == 1317 ? ConvertSolarToLunar(selmodelReg.day, selmodelReg.month, 1442) : ConvertSolarToLunar(selmodelReg.day, selmodelReg.month, selmodelReg.year);
    //   var gosi_date = selmodelGosi.year == 1317 ? ConvertSolarToLunar(selmodelGosi.day, selmodelGosi.month, 1442) : ConvertSolarToLunar(selmodelGosi.day, selmodelGosi.month, selmodelGosi.year);
    //   var saudi_date = selmodelSaudi.year == 1317 ? ConvertSolarToLunar(selmodelSaudi.day, selmodelSaudi.month, 1442) : ConvertSolarToLunar(selmodelSaudi.day, selmodelSaudi.month, selmodelSaudi.year);
    //   var zakath_date = selmodelZakat.year == 1317 ? ConvertSolarToLunar(selmodelZakat.day, selmodelZakat.month, 1442) : ConvertSolarToLunar(selmodelZakat.day, selmodelZakat.month, selmodelZakat.year);

    //   this.modelReg = new NgbDate(reg_date.year, reg_date.month, reg_date.day);
    //   this.modelGosi = new NgbDate(gosi_date.year, gosi_date.month, gosi_date.day);
    //   this.modelSaudi = new NgbDate(saudi_date.year, saudi_date.month, saudi_date.day);
    //   this.modelZakat = new NgbDate(zakath_date.year, zakath_date.month, zakath_date.day);
    // } else {
    //   this.modelReg = selmodelReg.year == 1900 ? null : selmodelReg;
    //   this.modelGosi = selmodelGosi.year == 1900 ? null : selmodelGosi;
    //   this.modelSaudi = selmodelSaudi.year == 1900 ? null : selmodelSaudi;
    //   this.modelZakat = selmodelZakat.year == 1900 ? null : selmodelZakat;
    // }


    // this.supplierType = (supplier.supplier_type.length>0 && supplier.supplier_type[0] != "")?supplier.supplier_type.join(','):'';

    if (supplier.country == 'SAUDI ARABIA') {
      this.kingdom = '1';
      this.showChecked = true;
      this.firstFormGroup.patchValue({ kingdomCtrl: '1' });
    }
    else {
      this.kingdom = '2';
      this.showChecked = false;
      this.firstFormGroup.patchValue({ kingdomCtrl: '2' });
      // this.firstFormGroup.patchValue({ reggregory: this.modelReg });
    }

    if (supplier.hijriSelected == 'Y') {
      this.checked = true;
      this.firstFormGroup.patchValue({ hijriGregCtrl: true });
    } else {
      this.checked = false;
      this.firstFormGroup.patchValue({ hijriGregCtrl: false });
    }

    if (supplier.multicurrency == 'Y') {
      this.thirdFormGroup.patchValue({ multicurrency: true });
    } else {
      this.thirdFormGroup.patchValue({ multicurrency: false });
    }

    if (supplier.supplier_type.length > 0 && supplier.supplier_type[0] != "") {
      // let suppliertypes = supplier.supplier_type.split(",");
      let typeSelected = [];
      for (var i = 0; i < supplier.supplier_type.length; i++) {
        typeSelected.push(supplier.supplier_type[i]);
      }
      this.firstFormGroup.patchValue({ supplierTypeCtrl: typeSelected });
    }

    if (supplier != undefined || supplier.country != undefined || supplier.country != '') {
      this.iscitydisable = false;
      if (supplier.city != '' && supplier.city != 'Other') {
        this.firstFormGroup.get('otherCityCtrl').disable();
      } else {
        this.firstFormGroup.get('otherCityCtrl').enable();
      }
    }

    if (supplier != undefined || supplier.bankCountryCodes != undefined || supplier.bankCountryCodes != '') {
      this.isBankcitydisable = false;
      if (supplier.bankName != '' && supplier.bankName != 'Other') {
        this.thirdFormGroup.get('otherNameCtrl').disable();
      } else {
        this.thirdFormGroup.get('otherNameCtrl').enable();
      }
    }


  }

  setValues(supplier) {
    Swal.fire('Please dont refresh the page. We are still loading!');
    Swal.showLoading();

    this.supplier = supplier;

    if (this.cityListOriginal.length > 0) {
      Swal.fire('Please dont refresh the page. We are still loading!');
      Swal.showLoading();
      this.setSupplierValues(supplier);
    } else {
      Swal.fire('Please dont refresh the page. We are still loading!');
      this.setSupplierValues(supplier);
      Swal.fire('Please dont refresh the page. We are still loading!');

      this.http.get(environment.nodeurl + '/api/template/masterdata').subscribe(data2 => {
        console.log('data2 ' + data2)
        if (data2) {
          localStorage.setItem("categoryLimit", data2["categoryLimit"]);
          this.countryList = [];
          this.countryList = data2["countryList"].map(x => x.description);

          this.currencyCodeList = [];
          this.currencyCodeList = data2["currencyList"];
          // this.currencyCodeList = data2["currencyList"].map(x=>x.description);

          this.banknameList = [];
          this.selectedBankList = [];
          this.banknameList = data2["bankList"];
          this.selectedBankList = this.banknameList;

          this.cityList = [];
          this.cityListOriginal = data2["cityList"];
          // this.cityList = data2["cityList"];

          this.setSupplierValues(supplier);
          Swal.close();
        }
      });
    }

    if (this.firstFormGroup.value.countryCtrl != 'SAUDI ARABIA') {
      this.isGosihijriSelected = true;
      this.isZakathhijriSelected = true;
      this.isSaudihijriSelected = true;

      this.isVatFileSelected = true;
      this.isGosiFileSelected = true;
      this.isSaudiFileSelected = true;
      this.isZakathFileSelected = true;
      // isRegFileSelected

    }

    if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
      if (this.firstFormGroup.value.gosihijri == null) {
        this.isGosihijriSelected = false;

      }

      if (this.firstFormGroup.value.gosihijri != null) {
        this.isGosihijriSelected = true;
      }

      if (this.firstFormGroup.value.saudihijri == null) {
        this.isSaudihijriSelected = false;
      }

      if (this.firstFormGroup.value.saudihijri != null) {
        this.isSaudihijriSelected = true;
      }

      if (this.firstFormGroup.value.zakathijri == null) {
        this.isZakathhijriSelected = false;

      }

      if (this.firstFormGroup.value.zakathijri != null) {
        this.isZakathhijriSelected = true;
      }
    }

    if (this.secondFormGroup.value.typeOfOrganizationCtrl == 'Other - Please Specify') {
      if (this.secondFormGroup.value.typeOfOrganization2Ctrl == null) {
        this.isTypeOfOrganization2CtrlSelected = false;
      } else if (this.secondFormGroup.value.typeOfOrganization2Ctrl != null) {
        this.isTypeOfOrganization2CtrlSelected = true;
        if (this.secondFormGroup.value.typeOfOrganization2Ctrl == '') {
          this.isTypeOfOrganization2CtrlSelected = false;
        }

      }
    } else {
      this.isTypeOfOrganization2CtrlSelected = true;
    }
  }

  async setSupplierValues(supplier) {
    this.supplier_id = supplier.supplier_id;
    this.supplierName = supplier.supplier_name;
    // this.supplier.supplier_name = supplier.supplier_name;
    // this.supplier.supplier_name_arabic = supplier.supplier_name_arabic;
    // this.supplier.web_site = supplier.web_site;

    if (supplier.first_name1 == '') {
      this.additionalContact1 = true;
      this.showAdditionalButton1 = false;
      this.contactsequence = 1;
    } else {
      this.additionalContact1 = true;
      this.showAdditionalButton1 = false;
      this.contactsequence = 2;
    }

    if (supplier.first_name2 == '') {
      this.additionalContact2 = false;
      this.showAdditionalButton2 = true;
    } else {
      this.additionalContact2 = true;
      this.showAdditionalButton2 = false;
    }

    this.cityList = [];
    this.cityList = this.cityListOriginal.filter(x => x.countryName == supplier.country);

    this.selectedBankList = [];
    this.selectedBankList = this.banknameList.filter(x => x.country == supplier.bankCountryCodes);
    var reviewdate: any = supplier.qualityreviewDate ? this.datePipe.transform(supplier.qualityreviewDate, "yyyy-MM-dd") : '';

    if (supplier.typeOfOrganization == 'Other - Please Specify') {
      this.orgtype = true;
    } else {
      this.orgtype = false;

    }

    this.firstFormGroup.patchValue({
      supplierNameCtrl: supplier.supplier_name,
      supplierNameArabicCtrl: supplier.supplier_name_arabic,
      establishmentYearCtrl: supplier.establishment_year == 0 ? '' : supplier.establishment_year,
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
      extCtrl: supplier.extension == 0 ? '' : supplier.extension,
      emailCtrl: supplier.email,
      mobileCodeCtrl: supplier.mobile_country_code,
      mobileNumberCtrl: supplier.mobile_no,
      faxCodeCtrl: supplier.fax_country_code,
      faxNumberCtrl: supplier.fax_no,
      titleCtrl1: supplier.title1,
      firstNameCtrl1: supplier.first_name1,
      lastNameCtrl1: supplier.last_name1,
      positionCtrl1: supplier.position1,
      emailCtrl1: supplier.email1,
      telephoneCodeCtrl1: supplier.telphone_country_code1,
      telephoneNumberCtrl1: supplier.telephone_no1,
      extCtrl1: supplier.extension1 == 0 ? '' : supplier.extension1,
      mobileCodeCtrl1: supplier.mobile_country_code1,
      mobileNumberCtrl1: supplier.mobile_no1,
      faxCodeCtrl1: supplier.fax_country_code1,
      faxNumberCtrl1: supplier.fax_no1,
      titleCtrl2: supplier.title2,
      firstNameCtrl2: supplier.first_name2,
      lastNameCtrl2: supplier.last_name2,
      positionCtrl2: supplier.position2,
      emailCtrl2: supplier.email2,
      telephoneCodeCtrl2: supplier.telphone_country_code2,
      telephoneNumberCtrl2: supplier.telephone_no2,
      extCtrl2: supplier.extension2 == 0 ? '' : supplier.extension2,
      mobileCodeCtrl2: supplier.mobile_country_code2,
      mobileNumberCtrl2: supplier.mobile_no2,
      faxCodeCtrl2: supplier.fax_country_code2,
      faxNumberCtrl2: supplier.fax_no2,
      registrationCtrl: supplier.cr_no,
      cr_exp_date: supplier.cr_exp_date,
      additionalMaterialCtrl: supplier.additional_material,
      waselCtrl: supplier.wasalAddress,
      vatCtrl: supplier.vat_no,
      certificateDateCtrl: ''
    });

    this.secondFormGroup.patchValue({
      parentcompanyCtrl: supplier.parentcompany,
      sistercompanyCtrl: supplier.sistercompany,
      ownercompanyCtrl: supplier.ownercompany,
      operatingProfit1Ctrl: supplier.operatingProfit1 == 0 ? '' : supplier.operatingProfit1,
      operatingProfit2Ctrl: supplier.operatingProfit2 == 0 ? '' : supplier.operatingProfit2,
      netIncome1Ctrl: supplier.netIncome1 == 0 ? '' : supplier.netIncome1,
      netIncome2Ctrl: supplier.netIncome2 == 0 ? '' : supplier.netIncome2,
      currentAsset1Ctrl: supplier.currentAsset1 == 0 ? '' : supplier.currentAsset1,
      currentAsset2Ctrl: supplier.currentAsset2 == 0 ? '' : supplier.currentAsset2,
      totalLiable1Ctrl: supplier.totalLiable1 == 0 ? '' : supplier.totalLiable1,
      totalLiable2Ctrl: supplier.totalLiable2 == 0 ? '' : supplier.totalLiable2,
      totalEquity1Ctrl: supplier.totalEquity1 == 0 ? '' : supplier.totalEquity1,
      totalEquity2Ctrl: supplier.totalEquity2 == 0 ? '' : supplier.totalEquity2,
      noOfYearsCtrl: supplier.noOfYears == 0 ? '' : supplier.noOfYears,
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
      qualityreviewDateCtrl: (reviewdate != '' && reviewdate.split("-")[0] > 1900) ? new Date(reviewdate.split("-")[0], reviewdate.split("-")[1] - 1, reviewdate.split("-")[2]) : '',
      // qualityreviewDateCtrl: (supplier.qualityreviewDate && supplier.qualityreviewDate.split('/')[2].split(' ')[0] > 1900) ? new Date(supplier.qualityreviewDate.split('/')[2].split(' ')[0], supplier.qualityreviewDate.split('/')[1] - 1, supplier.qualityreviewDate.split('/')[0]) : '',
      typeOfOrganizationCtrl: supplier.typeOfOrganization,
      typeOfOrganization2Ctrl: supplier.typeOfOrganization2,
      additionalCtrl: supplier.additionalCtrl,
      additionalCtrl2: supplier.additionalCtrl2,
      additionalCtrl3: supplier.additionalCtrl3,
      additionalCtrl4: supplier.additionalCtrl4,
      additionalCtrl5: supplier.additionalCtrl5,
      managerialCtrl: supplier.managerialno == 0 ? null : supplier.managerialno,
      technicallCtrl: supplier.technicalno == 0 ? null : supplier.technicalno,
      operationsCtrl: supplier.operationsno == 0 ? null : supplier.operationsno,
      saudiNationalslCtrl: supplier.saudiNationalsno,
      totallCtrl: supplier.managerialno + supplier.technicalno + supplier.operationsno


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

    if (supplier.country == 'SAUDI ARABIA' || supplier.country == 'BAHRAIN' || supplier.country == 'KUWAIT' || supplier.country == 'OMAN' || supplier.country == 'QATAR' || supplier.country == 'UNITED ARAB EMIRATES') {
      this.isNotGCC = false;
    } else {
      this.isNotGCC = true;
    }


    if (supplier.designnCap == 'Yes') {
      this.isdesignnCapCtrl = true;
    } else {
      this.isdesignnCapCtrl = false;

    }

    if (supplier.finishProd == 'Yes') {
      this.isfinishProdCtrl = true;
    } else {
      this.isfinishProdCtrl = false;

    }

    if (supplier.registeredOrg == 'Yes') {
      this.isregisteredOrgCtrl = true;
    } else {
      this.isregisteredOrgCtrl = false;

    }

    if (supplier.suspendedProj1 == 'Yes') {
      this.issuspendedProj1Ctrl = true;
    } else {
      this.issuspendedProj1Ctrl = false;

    }



    if (supplier.litigation1 == 'Yes') {
      this.islitigation1Ctrl = true;
    } else {
      this.islitigation1Ctrl = false;

    }

    if (supplier.compliance1 == 'Yes') {
      this.iscompliance1Ctrl = true;
    } else {
      this.iscompliance1Ctrl = false;
    }


    if (supplier.shareholder1 == 'Yes') {
      this.isshareholder1Ctrl = true;
    } else {
      this.isshareholder1Ctrl = false;
    }

    if (supplier.legalAsset1 == 'Yes') {
      this.islegalAsset1Ctrl = true;

    } else {
      this.islegalAsset1Ctrl = false;

    }

    if (supplier.labour1 == 'Yes') {
      this.islabour1Ctrl = true;


    } else {
      this.islabour1Ctrl = false;

    }


    if (supplier.environment1 == 'Yes') {
      this.isenvironment1Ctrl = true;

    } else {
      this.isenvironment1Ctrl = false;

    }

    if (supplier.environment1 == 'Yes') {
      this.isimiInterested1trl = true;

    } else {
      this.isimiInterested1trl = false;

    }

    if (supplier.hse1 == 'Yes') {
      this.ishse1Ctrl = true;

    } else {
      this.ishse1Ctrl = false;

    }

    if (supplier.docuHse == 'Yes') {
      this.isdocuHseCtrl = true;

    } else {
      this.isdocuHseCtrl = false;

    }

    if (supplier.isohealth == 'Yes') {
      this.isisohealthCtrl = true;

    } else {
      this.isisohealthCtrl = false;

    }

    if (supplier.envtMgt1 == 'Yes') {
      this.isenvtMgt1Ctrl = true;

    } else {
      this.isenvtMgt1Ctrl = false;

    }

    if (supplier.dedicatedpers == 'Yes') {
      this.isdedicatedpersCtrl = true;

    } else {
      this.isdedicatedpersCtrl = false;

    }

    if (supplier.statistic == 'Yes') {
      this.isstatisticCtrl = true;

    } else {
      this.isstatisticCtrl = false;

    }


    if (supplier.qualityPolicy1 == 'Yes') {
      this.isqualityPolicy1Ctrl = true;

    } else {
      this.isqualityPolicy1Ctrl = false;

    }

    if (supplier.qualityMgt == 'Yes') {
      this.isqualityMgtCtrl = true;

    } else {
      this.isqualityMgtCtrl = false;

    }

    if (supplier.qualityMgtIso == 'Yes') {
      this.isqualityMgtIsoCtrl = true;

    } else {
      this.isqualityMgtIsoCtrl = false;

    }

    if (supplier.qualityResp1 == 'Yes') {
      this.isqualityResp1Ctrl = true;

    } else {
      this.isqualityResp1Ctrl = false;

    }


    var regformatdate: any = supplier.reg_date ? this.datePipe.transform(supplier.reg_date, "yyyy-MM-dd") : '';
    var gosiformatdate: any = supplier.gosi_date ? this.datePipe.transform(supplier.gosi_date, "yyyy-MM-dd") : '';
    var saudiformatdate: any = supplier.saudi_date ? this.datePipe.transform(supplier.saudi_date, "yyyy-MM-dd") : '';
    var zakathformatdate: any = supplier.zakath_date ? this.datePipe.transform(supplier.zakath_date, "yyyy-MM-dd") : '';

    var selmodelReg = new NgbDate(Number(regformatdate.split("-")[0]), Number(regformatdate.split("-")[1]) - 1, Number(regformatdate.split("-")[2]));
    if (Number(regformatdate.split("-")[1]) - 1 == 0) {
      selmodelReg = new NgbDate(Number(regformatdate.split("-")[0]) - 1, 12, Number(regformatdate.split("-")[2]));
    }
    var selmodelGosi = new NgbDate(Number(gosiformatdate.split("-")[0]), Number(gosiformatdate.split("-")[1]) - 1, Number(gosiformatdate.split("-")[2]));
    if (Number(gosiformatdate.split("-")[1]) - 1 == 0) {
      selmodelGosi = new NgbDate(Number(gosiformatdate.split("-")[0] - 1), 12, Number(gosiformatdate.split("-")[2]));
    }
    var selmodelSaudi = new NgbDate(Number(saudiformatdate.split("-")[0]), Number(saudiformatdate.split("-")[1]) - 1, Number(saudiformatdate.split("-")[2]));
    if (Number(saudiformatdate.split("-")[1]) - 1 == 0) {
      selmodelSaudi = new NgbDate(Number(saudiformatdate.split("-")[0] - 1), 12, Number(saudiformatdate.split("-")[2]));
    }
    var selmodelZakat = new NgbDate(Number(zakathformatdate.split("-")[0]), Number(zakathformatdate.split("-")[1]) - 1, Number(zakathformatdate.split("-")[2]));
    if (Number(zakathformatdate.split("-")[1]) - 1 == 0) {
      selmodelZakat = new NgbDate(Number(zakathformatdate.split("-")[0] - 1), 12, Number(zakathformatdate.split("-")[2]));
    }
    // var selmodelAudit = new NgbDate(new Date(supplier.AUDIT_DATE).getFullYear(), new Date(supplier.AUDIT_DATE).getMonth(), new Date(supplier.AUDIT_DATE).getDate());

    if (supplier.hijriSelected == 'Y') {
      var reg_date = selmodelReg.year == 1317 ? ConvertSolarToLunar(selmodelReg.day, selmodelReg.month, 1442) : ConvertSolarToLunar(selmodelReg.day, selmodelReg.month, selmodelReg.year);
      var gosi_date = selmodelGosi.year == 1317 ? ConvertSolarToLunar(selmodelGosi.day, selmodelGosi.month, 1442) : ConvertSolarToLunar(selmodelGosi.day, selmodelGosi.month, selmodelGosi.year);
      var saudi_date = selmodelSaudi.year == 1317 ? ConvertSolarToLunar(selmodelSaudi.day, selmodelSaudi.month, 1442) : ConvertSolarToLunar(selmodelSaudi.day, selmodelSaudi.month, selmodelSaudi.year);
      var zakath_date = selmodelZakat.year == 1317 ? ConvertSolarToLunar(selmodelZakat.day, selmodelZakat.month, 1442) : ConvertSolarToLunar(selmodelZakat.day, selmodelZakat.month, selmodelZakat.year);
      // var audit_date = ConvertSolarToLunar(selmodelAudit.day, selmodelAudit.month, selmodelAudit.year);

      this.modelReg = reg_date.year == 1317 ? null : new NgbDate(reg_date.year, reg_date.month, reg_date.day);
      this.modelGosi = gosi_date.year == 1317 ? null : new NgbDate(gosi_date.year, gosi_date.month, gosi_date.day);
      this.modelSaudi = saudi_date.year == 1317 ? null : new NgbDate(saudi_date.year, saudi_date.month, saudi_date.day);
      this.modelZakat = zakath_date.year == 1317 ? null : new NgbDate(zakath_date.year, zakath_date.month, zakath_date.day);
      // this.modelAudit =new NgbDate(audit_date.year, audit_date.month, audit_date.day);
    } else {
      this.modelReg = selmodelReg.year == 1900 ? null : selmodelReg;
      this.modelGosi = selmodelGosi.year == 1900 ? null : selmodelGosi;
      this.modelSaudi = selmodelSaudi.year == 1900 ? null : selmodelSaudi;
      this.modelZakat = selmodelZakat.year == 1900 ? null : selmodelZakat;
      // this.modelAudit = new NgbDate(new Date(supplier.AUDIT_DATE).getFullYear(), new Date(supplier.AUDIT_DATE).getMonth() , new Date(supplier.AUDIT_DATE).getDate());
    }


    // this.supplierType = (supplier.supplier_type.length>0 && supplier.supplier_type[0] != "")?supplier.supplier_type.join(','):'';

    if (supplier.country == 'SAUDI ARABIA') {
      this.kingdom = '1';
      this.showChecked = true;
      this.firstFormGroup.patchValue({ kingdomCtrl: '1' });

      var resultdefault = await this.hijriGregorianDateConverter(supplier.hijriSelected == 'Y', null);
      var currentYear = resultdefault['year'];
      var currentMonth = resultdefault['month'];
      var currentDate = resultdefault['day'];
      this.startdate = new NgbDate(currentYear, currentMonth, currentDate);

      if (supplier.hijriSelected == 'Y') {
        this.ngbdDatepickerI18n.language = 'ar';
        this.firstFormGroup.patchValue({ reghijri: this.modelReg, gosihijri: this.modelGosi, saudihijri: this.modelSaudi, zakathijri: this.modelZakat });
      } else {
        this.firstFormGroup.patchValue({ reggregory: this.modelReg, gosigregory: this.modelGosi, saudigregory: this.modelSaudi, zakatgregory: this.modelZakat });
      }

    }
    else {
      this.kingdom = '2';
      this.showChecked = false;
      this.firstFormGroup.patchValue({ kingdomCtrl: '2' });

      if (this.istempFile) {
        if (supplier.hijriSelected != 'Y') {
          if (this.modelReg.year == 1899) {
            // this.firstFormGroup.patchValue({
            //   reggregory: ""
            // });
            this.modelReg = new NgbDate(1899, 12, 1);
          } else {
            this.firstFormGroup.patchValue({
              reggregory: this.modelReg
            });
          }
        } else {
          this.firstFormGroup.patchValue({
            reggregory: this.modelReg
          });
        }
      } else {
        if (supplier.hijriSelected != 'Y') {
          if (this.modelReg.year == 1899) {
            // this.firstFormGroup.patchValue({
            //   reggregory: ""
            // });
            this.modelReg = new NgbDate(1899, 12, 1);
          } else {
            this.firstFormGroup.patchValue({
              reggregory: this.modelReg
            });
          }
        } else {
          this.firstFormGroup.patchValue({
            reggregory: this.modelReg
          });
        }
      }
    }

    if (supplier.hijriSelected == 'Y') {
      this.checked = true;
      this.firstFormGroup.patchValue({ hijriGregCtrl: true });
    } else {
      this.checked = false;
      this.firstFormGroup.patchValue({ hijriGregCtrl: false });
    }

    if (supplier.multicurrency == 'Y') {
      this.thirdFormGroup.patchValue({ multicurrency: true });
    } else {
      this.thirdFormGroup.patchValue({ multicurrency: false });
    }

    if (supplier.supplier_type.length > 0 && supplier.supplier_type[0] != "") {
      // let suppliertypes = supplier.supplier_type.split(",");
      let typeSelected = [];
      for (var i = 0; i < supplier.supplier_type.length; i++) {
        typeSelected.push(supplier.supplier_type[i]);
      }
      this.firstFormGroup.patchValue({ supplierTypeCtrl: typeSelected });
    }

    if (supplier != undefined || supplier.country != undefined || supplier.country != '') {
      this.iscitydisable = false;
      if (supplier.city != '' && supplier.city != 'Other') {
        this.firstFormGroup.get('otherCityCtrl').disable();
      } else {
        this.firstFormGroup.get('otherCityCtrl').enable();
      }
    }

    if (this.NeedmoreRole == 'trev' || this.NeedmoreRole == 'tapp') {
      // this.firstFormGroup.get('stateCtrl').disable();
    }

    if (supplier != undefined || supplier.bankCountryCodes != undefined || supplier.bankCountryCodes != '') {
      this.isBankcitydisable = false;
      if (supplier.bankName != '' && supplier.bankName != 'Other') {
        this.thirdFormGroup.get('otherNameCtrl').disable();
      } else {
        this.thirdFormGroup.get('otherNameCtrl').enable();
      }
    }

    if (this.istempFile) {
      if (this.firstFormGroup.value.supplierNameCtrl == '') {
        location.replace(environment.clientUrl + ":4450/supplier-registration-form/" + this.supplierIdforTemp + "/tmp");
      }
    }

    if (this.istempFile) {
      if (supplier.country == 'SAUDI ARABIA') {
        if (this.checked) {
          if (this.firstFormGroup.value.reghijri == null) {
            this.showErrorForRegDate = true;
          } else if (this.firstFormGroup.value.reghijri != null) {
            this.showErrorForRegDate = false;
          } else {
            this.showErrorForRegDate = false;
          }

          if (this.firstFormGroup.value.gosihijri == null) {
            this.showErrorForGosiDate = true;
          } else if (this.firstFormGroup.value.gosihijri != null) {
            this.showErrorForGosiDate = false;
          } else {
            this.showErrorForGosiDate = false;
          }

          if (this.firstFormGroup.value.saudihijri == null) {
            this.showErrorForSaudiDate = true;
          } else if (this.firstFormGroup.value.saudihijri != null) {
            this.showErrorForSaudiDate = false;
          } else {
            this.showErrorForSaudiDate = false;
          }

          if (this.firstFormGroup.value.zakathijri == null) {
            this.showErrorForZakathDate = true;
          } else if (this.firstFormGroup.value.zakathijri != null) {
            this.showErrorForZakathDate = false;
          } else {
            this.showErrorForZakathDate = false;
          }
        }

        if (!this.checked) {
          if (this.firstFormGroup.value.reggregory == null) {
            this.showErrorForRegDate = true;
          } else if (this.firstFormGroup.value.reggregory != null) {
            this.showErrorForRegDate = false;
          } else {
            this.showErrorForRegDate = false;
          }

          if (this.firstFormGroup.value.gosigregory == null) {
            this.showErrorForGosiDate = true;
          } else if (this.firstFormGroup.value.gosigregory != null) {
            this.showErrorForGosiDate = false;
          } else {
            this.showErrorForGosiDate = false;
          }

          if (this.firstFormGroup.value.saudigregory == null) {
            this.showErrorForSaudiDate = true;
          } else if (this.firstFormGroup.value.saudigregory != null) {
            this.showErrorForSaudiDate = false;
          } else {
            this.showErrorForSaudiDate = false;
          }

          if (this.firstFormGroup.value.zakatgregory == null) {
            this.showErrorForZakathDate = true;
          } else if (this.firstFormGroup.value.zakatgregory != null) {
            this.showErrorForZakathDate = false;
          } else {
            this.showErrorForZakathDate = false;
          }
        }

      } else {
        this.showErrorForRegDate = false;
        this.showErrorForGosiDate = false;
        this.showErrorForSaudiDate = false;
        this.showErrorForZakathDate = false;

      }
    }

    // Swal.close();
  }


  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  selectionevent(value, cat) {

    if (cat == 'design') {
      if (value == 'Yes') {
        this.isdesignnCapCtrl = true;
        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('designtempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('designoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('designoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('designtempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isDesignnCapCtrlSelected = false;

      } else {
        this.isdesignnCapCtrl = false;

        this.secondFormGroup.controls['designtempCtrl'].setErrors(null);
        this.secondFormGroup.controls['designoriCtrl'].setErrors(null);
        this.DesignFile_name = "";
        this.isDesignnCapCtrlSelected = true;

      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.designnCapCtrl == null) {
          this.isDesignnCapCtrlSelected = false;
          console.log("designnCapCtrl is false");
        } else if (this.secondFormGroup.value.designnCapCtrl == 'Yes') {
          if (this.isDesignFileAlreadyAttached) {
            this.isDesignnCapCtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('designtempCtrl').hasError('invalid')) {
              this.isDesignnCapCtrlSelected = false;
              console.log("designnCapCtrl is false");
            } else {
              if (this.e1FileLoaded) {
                if (this.isemptyorgdesign) {
                  this.isDesignnCapCtrlSelected = false;
                  console.log("designnCapCtrl is false");
                } else {
                  this.isDesignnCapCtrlSelected = true;
                  console.log("designnCapCtrl is true");
                }

              } else {
                this.isDesignnCapCtrlSelected = false;
                console.log("designnCapCtrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.designnCapCtrl == 'No') {
          this.isDesignnCapCtrlSelected = true;
          console.log("designnCapCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.designnCapCtrl == null) {
          this.isDesignnCapCtrlSelected = false;
          console.log("designnCapCtrl is false");
        } else if (this.secondFormGroup.value.designnCapCtrl == 'Yes') {
          if (this.isDesignFileAlreadyAttached) {
            this.isDesignnCapCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('designoriCtrl').hasError('invalid')) {
              this.isDesignnCapCtrlSelected = false;
              console.log("designnCapCtrl is false");
            } else {
              if (this.e1FileLoaded) {
                if (this.isemptyorgdesign) {
                  this.isDesignnCapCtrlSelected = false;
                  console.log("designnCapCtrl is false");
                } else {
                  if (this.ismaxorgdesign) {
                    this.isDesignnCapCtrlSelected = false;
                    console.log("designnCapCtrl is false");
                  } else {
                    this.isDesignnCapCtrlSelected = true;
                    console.log("designnCapCtrl is true");
                  }
                }
              } else {
                this.isDesignnCapCtrlSelected = false;
                console.log("designnCapCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.designnCapCtrl == 'No') {
          this.isDesignnCapCtrlSelected = true;
          console.log("designnCapCtrl is true");
        }
      }
    }

    if (cat == 'finish') {
      if (value == 'Yes') {
        this.isfinishProdCtrl = true;
        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('finishtempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('finishoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('finishoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('finishtempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isFinishProdCtrlSelected = false;

      }
      else {
        this.isfinishProdCtrl = false;

        this.secondFormGroup.controls['finishoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['finishtempCtrl'].setErrors(null);
        this.FinishFile_name = "";
        this.isFinishProdCtrlSelected = true;

      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.finishProdCtrl == null) {
          this.isFinishProdCtrlSelected = false;
          console.log("finishProdCtrl is false");
        } else if (this.secondFormGroup.value.finishProdCtrl == 'Yes') {
          if (this.isFinishFileAlreadyAttached) {
            this.isFinishProdCtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('finishtempCtrl').hasError('invalid')) {
              this.isFinishProdCtrlSelected = false;
              console.log("finishProdCtrl is false");
            } else {
              if (this.e2FileLoaded) {
                if (this.isemptyoutorg) {
                  this.isFinishProdCtrlSelected = false;
                  console.log("finishProdCtrl is false");
                } else {
                  this.isFinishProdCtrlSelected = true;
                  console.log("finishProdCtrl is true");
                }

              } else {
                this.isFinishProdCtrlSelected = false;
                console.log("finishProdCtrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.finishProdCtrl == 'No') {
          this.isFinishProdCtrlSelected = true;
          console.log("finishProdCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.finishProdCtrl == null) {
          this.isFinishProdCtrlSelected = false;
          console.log("finishProdCtrl is false");
        } else if (this.secondFormGroup.value.finishProdCtrl == 'Yes') {
          if (this.isFinishFileAlreadyAttached) {
            this.isFinishProdCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('finishoriCtrl').hasError('invalid')) {
              this.isFinishProdCtrlSelected = false;
              console.log("finishProdCtrl is false");
            } else {
              if (this.e2FileLoaded) {
                if (this.isemptyoutorg) {
                  this.isFinishProdCtrlSelected = false;
                  console.log("finishProdCtrl is false");
                } else {
                  if (this.ismaxoutorg) {
                    this.isFinishProdCtrlSelected = false;
                    console.log("finishProdCtrl is false");
                  } else {
                    this.isFinishProdCtrlSelected = true;
                    console.log("finishProdCtrl is true");
                  }
                }
              } else {
                this.isFinishProdCtrlSelected = false;
                console.log("finishProdCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.finishProdCtrl == 'No') {
          this.isFinishProdCtrlSelected = true;
          console.log("finishProdCtrl is true");
        }
      }
    }

    if (cat == 'regis') {
      if (value == 'Yes') {
        this.isregisteredOrgCtrl = true;
        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('registeredtempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('registeredoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('registeredoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('registeredtempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isRegisteredOrgCtrlSelected = false;

      } else {
        this.isregisteredOrgCtrl = false;

        this.secondFormGroup.controls['registeredoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['registeredtempCtrl'].setErrors(null);
        this.RegisteredFile_name = "";
        this.isRegisteredOrgCtrlSelected = true;

      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.registeredOrgCtrl == null) {
          this.isRegisteredOrgCtrlSelected = false;
          console.log("registeredOrgCtrl is false");
        } else if (this.secondFormGroup.value.registeredOrgCtrl == 'Yes') {
          if (this.isRegisteredFileAlreadyAttached) {
            this.isRegisteredOrgCtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('registeredtempCtrl').hasError('invalid')) {
              this.isRegisteredOrgCtrlSelected = false;
              console.log("registeredOrgCtrl is false");
            } else {
              if (this.e3FileLoaded) {
                if (this.isemptythirdparty) {
                  this.isRegisteredOrgCtrlSelected = false;
                  console.log("registeredOrgCtrl is false");
                } else {
                  this.isRegisteredOrgCtrlSelected = true;
                  console.log("registeredOrgCtrl is true");
                }

              } else {
                this.isRegisteredOrgCtrlSelected = false;
                console.log("registeredOrgCtrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.registeredOrgCtrl == 'No') {
          this.isRegisteredOrgCtrlSelected = true;
          console.log("registeredOrgCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.registeredOrgCtrl == null) {
          this.isRegisteredOrgCtrlSelected = false;
          console.log("registeredOrgCtrl is false");
        } else if (this.secondFormGroup.value.registeredOrgCtrl == 'Yes') {
          if (this.isRegisteredFileAlreadyAttached) {
            this.isRegisteredOrgCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('registeredoriCtrl').hasError('invalid')) {
              this.isRegisteredOrgCtrlSelected = false;
              console.log("registeredOrgCtrl is false");
            } else {
              if (this.e3FileLoaded) {
                if (this.isemptythirdparty) {
                  this.isRegisteredOrgCtrlSelected = false;
                  console.log("registeredOrgCtrl is false");
                } else {
                  if (this.ismaxthirdparty) {
                    this.isRegisteredOrgCtrlSelected = false;
                    console.log("registeredOrgCtrl is false");
                  } else {
                    this.isRegisteredOrgCtrlSelected = true;
                    console.log("registeredOrgCtrl is true");
                  }
                }
              } else {
                this.isRegisteredOrgCtrlSelected = false;
                console.log("registeredOrgCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.registeredOrgCtrl == 'No') {
          this.isRegisteredOrgCtrlSelected = true;
          console.log("registeredOrgCtrl is true");
        }
      }
    }

    if (cat == 'comp') {
      if (value == 'Yes') {
        this.iscompliance1Ctrl = true;
        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('compliancetempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('complianceoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('compliancetempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isCompliance1CtrlSelected = false;

      } else {
        this.iscompliance1Ctrl = false;

        this.secondFormGroup.controls['complianceoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['compliancetempCtrl'].setErrors(null);
        this.ComplianceFile_name = "";
        this.isCompliance1CtrlSelected = true;

      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.compliance1Ctrl == null) {
          this.isCompliance1CtrlSelected = false;
          console.log("compliance1Ctrl is false");
        } else if (this.secondFormGroup.value.compliance1Ctrl == 'Yes') {
          if (this.isPreventionOfCorruptionFileAlreadyAttached) {
            this.isCompliance1CtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('compliancetempCtrl').hasError('invalid')) {
              this.isCompliance1CtrlSelected = false;
              console.log("compliance1Ctrl is false");
            } else {
              if (this.e5FileLoaded) {
                if (this.isemptytrainInfo) {
                  this.isCompliance1CtrlSelected = false;
                  console.log("compliance1Ctrl is false");
                } else {
                  this.isCompliance1CtrlSelected = true;
                  console.log("compliance1Ctrl is true");
                }

              } else {
                this.isCompliance1CtrlSelected = false;
                console.log("compliance1Ctrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.compliance1Ctrl == 'No') {
          this.isCompliance1CtrlSelected = true;
          console.log("compliance1Ctrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.compliance1Ctrl == null) {
          this.isCompliance1CtrlSelected = false;
          console.log("compliance1Ctrl is false");
        } else if (this.secondFormGroup.value.compliance1Ctrl == 'Yes') {
          if (this.isPreventionOfCorruptionFileAlreadyAttached) {
            this.isCompliance1CtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('complianceoriCtrl').hasError('invalid')) {
              this.isCompliance1CtrlSelected = false;
              console.log("compliance1Ctrl is false");
            } else {
              if (this.e5FileLoaded) {
                if (this.isemptytrainInfo) {
                  this.isCompliance1CtrlSelected = false;
                  console.log("compliance1Ctrl is false");
                } else {
                  if (this.ismaxtrainInfo) {
                    this.isCompliance1CtrlSelected = false;
                    console.log("compliance1Ctrl is false");
                  } else {
                    this.isCompliance1CtrlSelected = true;
                    console.log("compliance1Ctrl is true");
                  }
                }
              } else {
                this.isCompliance1CtrlSelected = false;
                console.log("compliance1Ctrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.compliance1Ctrl == 'No') {
          this.isCompliance1CtrlSelected = true;
          console.log("compliance1Ctrl is true");
        }
      }
    }

    if (cat == 'hse') {
      if (value == 'Yes') {
        this.ishse1Ctrl = true;

        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('hsetempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('hseoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('hsetempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isHse1CtrlSelected = false;

      } else {
        this.ishse1Ctrl = false;

        this.secondFormGroup.controls['hseoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['hsetempCtrl'].setErrors(null);
        this.HseFile_name = "";
        this.isHse1CtrlSelected = true;
      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.hse1Ctrl == null) {
          this.isHse1CtrlSelected = false;
          console.log("hse1Ctrl is false");
        } else if (this.secondFormGroup.value.hse1Ctrl == 'Yes') {
          if (this.isHseFileAlreadyAttached) {
            this.isHse1CtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('hsetempCtrl').hasError('invalid')) {
              this.isHse1CtrlSelected = false;
              console.log("hse1Ctrl is false");
            } else {
              if (this.h1FileLoaded) {
                if (this.isemptyhse) {
                  this.isHse1CtrlSelected = false;
                  console.log("hse1Ctrl is false");
                } else {
                  this.isHse1CtrlSelected = true;
                  console.log("hse1Ctrl is true");
                }

              } else {
                this.isHse1CtrlSelected = false;
                console.log("hse1Ctrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.hse1Ctrl == 'No') {
          this.isHse1CtrlSelected = true;
          console.log("hse1Ctrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.hse1Ctrl == null) {
          this.isHse1CtrlSelected = false;
          console.log("hse1Ctrl is false");
        } else if (this.secondFormGroup.value.hse1Ctrl == 'Yes') {
          if (this.isHseFileAlreadyAttached) {
            this.isHse1CtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('hseoriCtrl').hasError('invalid')) {
              this.isHse1CtrlSelected = false;
              console.log("hse1Ctrl is false");
            } else {
              if (this.h1FileLoaded) {
                if (this.isemptyhse) {
                  this.isHse1CtrlSelected = false;
                  console.log("hse1Ctrl is false");
                } else {
                  if (this.ismaxhse) {
                    this.isHse1CtrlSelected = false;
                    console.log("hse1Ctrl is false");
                  } else {
                    this.isHse1CtrlSelected = true;
                    console.log("hse1Ctrl is true");
                  }
                }
              } else {
                this.isHse1CtrlSelected = false;
                console.log("hse1Ctrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.hse1Ctrl == 'No') {
          this.isHse1CtrlSelected = true;
          console.log("hse1Ctrl is true");
        }
      }
    }

    if (cat == 'docu') {
      if (value == 'Yes') {
        this.isdocuHseCtrl = true;


        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('docutempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('docuoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('docutempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isDocuHseCtrlSelected = false;

      } else {
        this.isdocuHseCtrl = false;

        this.secondFormGroup.controls['docuoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['docutempCtrl'].setErrors(null);
        this.DocuFile_name = "";
        this.isDocuHseCtrlSelected = true;
      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.docuHseCtrl == null) {
          this.isDocuHseCtrlSelected = false;
          console.log("docuHseCtrl is false");
        } else if (this.secondFormGroup.value.docuHseCtrl == 'Yes') {
          if (this.isDocuFileAlreadyAttached) {
            this.isDocuHseCtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('docutempCtrl').hasError('invalid')) {
              this.isDocuHseCtrlSelected = false;
              console.log("docuHseCtrl is false");
            } else {
              if (this.h2FileLoaded) {
                if (this.isemptyhse2) {
                  this.isDocuHseCtrlSelected = false;
                  console.log("docuHseCtrl is false");
                } else {
                  this.isDocuHseCtrlSelected = true;
                  console.log("docuHseCtrl is true");
                }

              } else {
                this.isDocuHseCtrlSelected = false;
                console.log("docuHseCtrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.docuHseCtrl == 'No') {
          this.isDocuHseCtrlSelected = true;
          console.log("docuHseCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.docuHseCtrl == null) {
          this.isDocuHseCtrlSelected = false;
          console.log("docuHseCtrl is false");
        } else if (this.secondFormGroup.value.docuHseCtrl == 'Yes') {
          if (this.isDocuFileAlreadyAttached) {
            this.isDocuHseCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('docuoriCtrl').hasError('invalid')) {
              this.isDocuHseCtrlSelected = false;
              console.log("docuHseCtrl is false");
            } else {
              if (this.h2FileLoaded) {
                if (this.isemptyhse2) {
                  this.isDocuHseCtrlSelected = false;
                  console.log("docuHseCtrl is false");
                } else {
                  if (this.ismaxhse2) {
                    this.isDocuHseCtrlSelected = false;
                    console.log("docuHseCtrl is false");
                  } else {
                    this.isDocuHseCtrlSelected = true;
                    console.log("docuHseCtrl is true");
                  }
                }
              } else {
                this.isDocuHseCtrlSelected = false;
                console.log("docuHseCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.docuHseCtrl == 'No') {
          this.isDocuHseCtrlSelected = true;
          console.log("docuHseCtrl is true");
        }
      }
    }

    if (cat == 'iso') {
      if (value == 'Yes') {
        this.isisohealthCtrl = true;


        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('isohealthtempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('isohealthoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('isohealthtempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isIsohealthCtrlSelected = false;

      } else {
        this.isisohealthCtrl = false;

        this.secondFormGroup.controls['isohealthoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['isohealthtempCtrl'].setErrors(null);
        this.ISOHealthFile_name = "";
        this.isIsohealthCtrlSelected = true;
      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.isohealthCtrl == null) {
          this.isIsohealthCtrlSelected = false;
          console.log("isohealthCtrl is false");
        } else if (this.secondFormGroup.value.isohealthCtrl == 'Yes') {
          if (this.isISOHealthFileAlreadyAttached) {
            this.isIsohealthCtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('isohealthtempCtrl').hasError('invalid')) {
              this.isIsohealthCtrlSelected = false;
              console.log("isohealthCtrl is false");
            } else {
              if (this.h3FileLoaded) {
                if (this.isemptyhse3) {
                  this.isIsohealthCtrlSelected = false;
                  console.log("isohealthCtrl is false");
                } else {
                  this.isIsohealthCtrlSelected = true;
                  console.log("isohealthCtrl is true");
                }
              } else {
                this.isIsohealthCtrlSelected = false;
                console.log("isohealthCtrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.isohealthCtrl == 'No') {
          this.isIsohealthCtrlSelected = true;
          console.log("isohealthCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.isohealthCtrl == null) {
          this.isIsohealthCtrlSelected = false;
          console.log("isohealthCtrl is false");
        } else if (this.secondFormGroup.value.isohealthCtrl == 'Yes') {
          if (this.isISOHealthFileAlreadyAttached) {
            this.isIsohealthCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('isohealthoriCtrl').hasError('invalid')) {
              this.isIsohealthCtrlSelected = false;
              console.log("isohealthCtrl is false");
            } else {
              if (this.h3FileLoaded) {
                if (this.isemptyhse3) {
                  this.isIsohealthCtrlSelected = false;
                  console.log("isohealthCtrl is false");
                } else {
                  if (this.ismaxhse3) {
                    this.isIsohealthCtrlSelected = false;
                    console.log("isohealthCtrl is false");
                  } else {
                    this.isIsohealthCtrlSelected = true;
                    console.log("isohealthCtrl is true");
                  }
                }
              } else {
                this.isIsohealthCtrlSelected = false;
                console.log("isohealthCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.isohealthCtrl == 'No') {
          this.isIsohealthCtrlSelected = true;
          console.log("isohealthCtrl is true");
        }
      }
    }

    if (cat == 'envt') {
      if (value == 'Yes') {
        this.isenvtMgt1Ctrl = true;
        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('envttempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('envtoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('envttempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isEnvtMgt1CtrlSelected = false;
      } else {
        this.isenvtMgt1Ctrl = false;

        this.secondFormGroup.controls['envtoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['envttempCtrl'].setErrors(null);
        this.EnvtFile_name = "";
        this.isEnvtMgt1CtrlSelected = true;
      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.envtMgt1Ctrl == null) {
          this.isEnvtMgt1CtrlSelected = false;
          console.log("envtMgt1Ctrl is false");
        } else if (this.secondFormGroup.value.envtMgt1Ctrl == 'Yes') {
          if (this.isEnvtFileAlreadyAttached) {
            this.isEnvtMgt1CtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('envttempCtrl').hasError('invalid')) {
              this.isEnvtMgt1CtrlSelected = false;
              console.log("envtMgt1Ctrl is false");
            } else {
              if (this.h4FileLoaded) {
                if (this.isemptyhse4) {
                  this.isEnvtMgt1CtrlSelected = false;
                  console.log("envtMgt1Ctrl is false");
                } else {
                  this.isEnvtMgt1CtrlSelected = true;
                  console.log("envtMgt1Ctrl is true");
                }

              } else {
                this.isEnvtMgt1CtrlSelected = false;
                console.log("envtMgt1Ctrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.envtMgt1Ctrl == 'No') {
          this.isEnvtMgt1CtrlSelected = true;
          console.log("envtMgt1Ctrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.envtMgt1Ctrl == null) {
          this.isEnvtMgt1CtrlSelected = false;
          console.log("envtMgt1Ctrl is false");
        } else if (this.secondFormGroup.value.envtMgt1Ctrl == 'Yes') {
          if (this.isEnvtFileAlreadyAttached) {
            this.isEnvtMgt1CtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('envtoriCtrl').hasError('invalid')) {
              this.isEnvtMgt1CtrlSelected = false;
              console.log("envtMgt1Ctrl is false");
            } else {
              if (this.h4FileLoaded) {
                if (this.isemptyhse4) {
                  this.isEnvtMgt1CtrlSelected = false;
                  console.log("envtMgt1Ctrl is false");
                } else {
                  if (this.ismaxhse4) {
                    this.isEnvtMgt1CtrlSelected = false;
                    console.log("envtMgt1Ctrl is false");
                  } else {
                    this.isEnvtMgt1CtrlSelected = true;
                    console.log("envtMgt1Ctrl is true");
                  }
                }
              } else {
                this.isEnvtMgt1CtrlSelected = false;
                console.log("envtMgt1Ctrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.envtMgt1Ctrl == 'No') {
          this.isEnvtMgt1CtrlSelected = true;
          console.log("envtMgt1Ctrl is true");
        }
      }
    }

    if (cat == 'quality') {

      if (value == 'Yes') {
        this.isqualityPolicy1Ctrl = true;

        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('qualityPolicytempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('qualityPolicyoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('qualityPolicytempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isQualityPolicy1CtrlSelected = false;

      } else {
        this.isqualityPolicy1Ctrl = false;

        this.secondFormGroup.controls['qualityPolicyoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['qualityPolicytempCtrl'].setErrors(null);
        this.QualityPolicyFile_name = "";
        this.isQualityPolicy1CtrlSelected = true;
      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.qualityPolicy1Ctrl == null) {
          this.isQualityPolicy1CtrlSelected = false;
          console.log("qualityPolicy1Ctrl is false");
        } else if (this.secondFormGroup.value.qualityPolicy1Ctrl == 'Yes') {
          if (this.isQualityPolicyFileAlreadyAttached) {
            this.isQualityPolicy1CtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('qualityPolicytempCtrl').hasError('invalid')) {
              this.isQualityPolicy1CtrlSelected = false;
              console.log("qualityPolicy1Ctrl is false");
            } else {
              if (this.q1FileLoaded) {
                if (this.isemptyquality1) {
                  this.isQualityPolicy1CtrlSelected = false;
                  console.log("qualityPolicy1Ctrl is false");
                } else {
                  this.isQualityPolicy1CtrlSelected = true;
                  console.log("qualityPolicy1Ctrl is true");
                }

              } else {
                this.isQualityPolicy1CtrlSelected = false;
                console.log("qualityPolicy1Ctrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.qualityPolicy1Ctrl == 'No') {
          this.isQualityPolicy1CtrlSelected = true;
          console.log("qualityPolicy1Ctrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.qualityPolicy1Ctrl == null) {
          this.isQualityPolicy1CtrlSelected = false;
          console.log("qualityPolicy1Ctrl is false");
        } else if (this.secondFormGroup.value.qualityPolicy1Ctrl == 'Yes') {
          if (this.isQualityPolicyFileAlreadyAttached) {
            this.isQualityPolicy1CtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('qualityPolicyoriCtrl').hasError('invalid')) {
              this.isQualityPolicy1CtrlSelected = false;
              console.log("qualityPolicy1Ctrl is false");
            } else {
              if (this.q1FileLoaded) {
                if (this.isemptyquality1) {
                  this.isQualityPolicy1CtrlSelected = false;
                  console.log("qualityPolicy1Ctrl is false");
                } else {
                  if (this.ismaxquality1) {
                    this.isQualityPolicy1CtrlSelected = false;
                    console.log("qualityPolicy1Ctrl is false");
                  } else {
                    this.isQualityPolicy1CtrlSelected = true;
                    console.log("qualityPolicy1Ctrl is true");
                  }
                }
              } else {
                this.isQualityPolicy1CtrlSelected = false;
                console.log("qualityPolicy1Ctrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.qualityPolicy1Ctrl == 'No') {
          this.isQualityPolicy1CtrlSelected = true;
          console.log("qualityPolicy1Ctrl is true");
        }
      }
    }

    if (cat == 'qualitymgt') {
      if (value == 'Yes') {
        this.isqualityMgtCtrl = true;

        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('qualityMgttempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgtoriCtrl').setErrors({ invalid: null });
            this.secondFormGroup.get('qualityMgtoriCtrl').updateValueAndValidity();
          }
          else {
            this.secondFormGroup.get('qualityMgtoriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('qualityMgttempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgttempCtrl').setErrors({ invalid: null });
            this.secondFormGroup.get('qualityMgttempCtrl').updateValueAndValidity();
          }
        }, 1000);
        this.isQualityMgtCtrlSelected = false;
      } else {
        this.isqualityMgtCtrl = false;

        this.secondFormGroup.controls['qualityMgtoriCtrl'].setErrors(null);
        this.secondFormGroup.controls['qualityMgttempCtrl'].setErrors(null);
        this.QualityMgtFile_name = "";
        this.isQualityMgtCtrlSelected = true;
      }

      if (this.istempFile) {
        if (this.secondFormGroup.value.qualityMgtCtrl == null) {
          this.isQualityMgtCtrlSelected = false;
          console.log("qualityMgtCtrl is false");
        } else if (this.secondFormGroup.value.qualityMgtCtrl == 'Yes') {
          if (this.isQualityMgtFileAlreadyAttached) {
            this.isQualityMgtCtrlSelected = true;

          } else {
            if (this.secondFormGroup.get('qualityMgttempCtrl').hasError('invalid')) {
              this.isQualityMgtCtrlSelected = false;
              console.log("qualityMgtCtrl is false");
            } else {
              if (this.q2FileLoaded) {
                if (this.isemptyquality2) {
                  this.isQualityMgtCtrlSelected = false;
                  console.log("qualityMgtCtrl is false");
                } else {
                  this.isQualityMgtCtrlSelected = true;
                  console.log("qualityMgtCtrl is true");
                }

              } else {
                this.isQualityMgtCtrlSelected = false;
                console.log("qualityMgtCtrl is false");
              }
            }
          }

        } else if (this.secondFormGroup.value.qualityMgtCtrl == 'No') {
          this.isQualityMgtCtrlSelected = true;
          console.log("qualityMgtCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.qualityMgtCtrl == null) {
          this.isQualityMgtCtrlSelected = false;
          console.log("qualityMgtCtrl is false");
        } else if (this.secondFormGroup.value.qualityMgtCtrl == 'Yes') {
          if (this.isQualityMgtFileAlreadyAttached) {
            this.isQualityMgtCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('qualityMgtoriCtrl').hasError('invalid')) {
              this.isQualityMgtCtrlSelected = false;
              console.log("qualityMgtCtrl is false");
            } else {
              if (this.q2FileLoaded) {
                if (this.isemptyquality2) {
                  this.isQualityMgtCtrlSelected = false;
                  console.log("qualityMgtCtrl is false");
                } else {
                  if (this.ismaxquality2) {
                    this.isQualityMgtCtrlSelected = false;
                    console.log("qualityMgtCtrl is false");
                  } else {
                    this.isQualityMgtCtrlSelected = true;
                    console.log("qualityMgtCtrl is true");
                  }
                }
              } else {
                this.isQualityMgtCtrlSelected = false;
                console.log("qualityMgtCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.qualityMgtCtrl == 'No') {
          this.isQualityMgtCtrlSelected = true;
          console.log("qualityMgtCtrl is true");
        }
      }
    }

    if (cat == 'qualitymgtIso') {
      if (value == 'Yes') {

        this.isqualityMgtIsoCtrl = true;

        setTimeout(() => {
          if (this.istempFile) {
            this.secondFormGroup.get('qualityMgtIsotempCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
          }
          else {
            this.secondFormGroup.get('qualityMgtIsooriCtrl').setErrors({ invalid: true });
            this.secondFormGroup.get('qualityMgtIsotempCtrl').markAsUntouched();
          }
        }, 1000);
        this.isQualityMgtIsoCtrlSelected = false;
      } else {
        this.isqualityMgtIsoCtrl = false;

        this.secondFormGroup.controls['qualityMgtIsooriCtrl'].setErrors(null);
        this.secondFormGroup.controls['qualityMgtIsotempCtrl'].setErrors(null);
        this.QualityMgtISOFile_name = "";
        this.isQualityMgtIsoCtrlSelected = true;
      }
      if (this.istempFile) {
        if (this.secondFormGroup.value.qualityMgtIsoCtrl == null) {
          this.isQualityMgtIsoCtrlSelected = false;
          console.log("qualityMgtIsoCtrl is false");
        } else if (this.secondFormGroup.value.qualityMgtIsoCtrl == 'Yes') {
          if (this.isQualityMgtISOFileAlreadyAttached) {
            this.isQualityMgtIsoCtrlSelected = true;

          } else {

            if (this.secondFormGroup.get('qualityMgtIsotempCtrl').hasError('invalid')) {
              this.isQualityMgtIsoCtrlSelected = false;
              console.log("qualityMgtIsoCtrl is false");
            } else {
              if (this.q3FileLoaded) {
                if (this.isemptyquality3) {
                  this.isQualityMgtIsoCtrlSelected = false;
                  console.log("qualityMgtIsoCtrl is false");
                } else {
                  this.isQualityMgtIsoCtrlSelected = true;
                  console.log("qualityMgtIsoCtrl is true");
                }

              } else {
                this.isQualityMgtIsoCtrlSelected = false;
                console.log("qualityMgtIsoCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.qualityMgtIsoCtrl == 'No') {
          this.isQualityMgtIsoCtrlSelected = true;
          console.log("qualityMgtIsoCtrl is true");
        }
      } else if (!this.istempFile) {
        if (this.secondFormGroup.value.qualityMgtIsoCtrl == null) {
          this.isQualityMgtIsoCtrlSelected = false;
          console.log("qualityMgtIsoCtrl is false");
        } else if (this.secondFormGroup.value.qualityMgtIsoCtrl == 'Yes') {
          if (this.isQualityMgtISOFileAlreadyAttached) {
            this.isQualityMgtIsoCtrlSelected = true;
          } else {
            if (this.secondFormGroup.get('qualityMgtIsooriCtrl').hasError('invalid')) {
              this.isQualityMgtIsoCtrlSelected = false;
              console.log("qualityMgtIsoCtrl is false");
            } else {
              if (this.q3FileLoaded) {
                if (this.isemptyquality3) {
                  this.isQualityMgtIsoCtrlSelected = false;
                  console.log("qualityMgtIsoCtrl is false");
                } else {
                  if (this.ismaxquality3) {
                    this.isQualityMgtIsoCtrlSelected = false;
                    console.log("qualityMgtIsoCtrl is false");
                  } else {
                    this.isQualityMgtIsoCtrlSelected = true;
                    console.log("qualityMgtIsoCtrl is true");
                  }
                }
              } else {
                this.isQualityMgtIsoCtrlSelected = false;
                console.log("qualityMgtIsoCtrl is false");
              }
            }
          }
        } else if (this.secondFormGroup.value.qualityMgtIsoCtrl == 'No') {
          this.isQualityMgtIsoCtrlSelected = true;
          console.log("qualityMgtIsoCtrl is true");
        }
      }
    }
  }

  OnCountrySelectEmg(event) {

    this.regdate = this.firstFormGroup.value.reggregory;
    if ((event) == 'SAUDI ARABIA') {
      // this.kingdom = '1';
      // this.showChecked = true;
      // this.firstFormGroup.patchValue({ hijriGregCtrl: true });

      // this.toggleShow();
      // this.checked = true;
      // this.firstFormGroup.patchValue({
      //   hijriGregCtrl: true
      // });

      // this.firstFormGroup.patchValue({
      //   reggregory: this.regdate
      // });
      // this.firstFormGroup.get('reggregory').markAsUntouched();
      // this.firstFormGroup.get('reghijri').markAsUntouched();



      setTimeout(() => {
        if (this.istempFile) {

          if (this.checked) {

            if ((event) == 'SAUDI ARABIA') {
              // this.firstFormGroup.get('reghijri').setErrors({ regreqvalid: true });
            }
            // this.firstFormGroup.get('gosihijri').setErrors({ gosireqvalid: true });
            // this.firstFormGroup.get('saudihijri').setErrors({ saudireqvalid: true });
            // this.firstFormGroup.get('zakathijri').setErrors({ zakathreqvalid: true });
            // this.firstFormGroup.get('reggregory').markAsUntouched();
            this.firstFormGroup.get('gosigregory').markAsUntouched();
            this.firstFormGroup.get('saudigregory').markAsUntouched();
            this.firstFormGroup.get('zakatgregory').markAsUntouched();
          } else {
            // this.firstFormGroup.get('reggregory').setErrors({ regreqvalid: true });
            // this.firstFormGroup.get('gosigregory').setErrors({ gosireqvalid: true });
            // this.firstFormGroup.get('saudigregory').setErrors({ saudireqvalid: true });
            // this.firstFormGroup.get('zakatgregory').setErrors({ zakathreqvalid: true });
          }

        } else {
          // this.firstFormGroup.get('regfileoriCtrl').setErrors({ invalid: true });
          // this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
          // this.thirdFormGroup.get('bankfileoriCtrl').setErrors({ invalid: true });
          // this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
          // this.thirdFormGroup.get('bankletterheadfileoriCtrl').setErrors({ invalid: true });
          // this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
          // this.firstFormGroup.get('vatfileoriCtrl').setErrors({ invalid: true });
          // this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
          // this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });
          // this.firstFormGroup.get('vatCtrl').markAsUntouched();
          // this.firstFormGroup.get('gosifileoriCtrl').setErrors({ invalid: true });
          // this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
          // this.firstFormGroup.get('saudifileoriCtrl').setErrors({ invalid: true });
          // this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
          // this.firstFormGroup.get('zakathfileoriCtrl').setErrors({ invalid: true });
          // this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();

          if (this.checked) {
            if ((event) == 'SAUDI ARABIA') {
              // this.firstFormGroup.get('reghijri').setErrors({ regreqvalid: true });
            }
            // this.firstFormGroup.get('gosihijri').setErrors({ gosireqvalid: true });
            // this.firstFormGroup.get('saudihijri').setErrors({ saudireqvalid: true });
            // this.firstFormGroup.get('zakathijri').setErrors({ zakathreqvalid: true });
            // this.firstFormGroup.get('reggregory').markAsUntouched();
            this.firstFormGroup.get('gosigregory').markAsUntouched();
            this.firstFormGroup.get('saudigregory').markAsUntouched();
            this.firstFormGroup.get('zakatgregory').markAsUntouched();
          } else {
            // this.firstFormGroup.get('reggregory').setErrors({ regreqvalid: true });
            // this.firstFormGroup.get('gosigregory').setErrors({ gosireqvalid: true });
            // this.firstFormGroup.get('saudigregory').setErrors({ saudireqvalid: true });
            // this.firstFormGroup.get('zakatgregory').setErrors({ zakathreqvalid: true });
          }

        }


      }, 1000);
    }
    else {
      // this.kingdom = '2';
      // // this.checked= false;
      // this.showChecked = false;
      // this.firstFormGroup.patchValue({
      //   hijriGregCtrl: false
      // });
      //   this.ngbdDatepickerI18n.language = 'ar';
      // this.modelReg = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      // this.modelGosi = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      // this.modelSaudi = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      // this.modelZakat = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      // this.firstFormGroup.get('gosihijri').markAsUntouched();
      //   this.firstFormGroup.get('gosigregory').markAsUntouched();
      //   this.firstFormGroup.get('saudihijri').markAsUntouched();
      //   this.firstFormGroup.get('saudigregory').markAsUntouched();
      //   this.firstFormGroup.get('zakathijri').markAsUntouched();
      //   this.firstFormGroup.get('zakatgregory').markAsUntouched();
      //   this.firstFormGroup.get('reggregory').markAsUntouched();
      //   this.firstFormGroup.get('reghijri').markAsUntouched();

      //this.toggleShow();
      // this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
      // this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
      if (this.istempFile) {
        // this.firstFormGroup.get('regfiletempCtrl').setErrors({ invalid: false });
        // // this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
        // this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: false });
        // this.thirdFormGroup.get('bankletterheadfiletempCtrl').setErrors({ invalid: false });
        // this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
      } else {
        // this.firstFormGroup.get('regfileoriCtrl').setErrors({ invalid: true });
        // this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
        // this.thirdFormGroup.get('bankfileoriCtrl').setErrors({ invalid: true });
        // this.thirdFormGroup.get('bankletterheadfileoriCtrl').setErrors({ invalid: true });
        // this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
        // this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
      }
      setTimeout(() => {
        // this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
        // this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
        // this.firstFormGroup.get('vatCtrl').markAsUntouched();
        // this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
        // this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
        // this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
        // this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
        // this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();
        // this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();

        // this.firstFormGroup.get('reghijri').markAsUntouched();
        // this.firstFormGroup.get('gosihijri').markAsUntouched();
        // this.firstFormGroup.get('saudihijri').markAsUntouched();
        // this.firstFormGroup.get('zakathijri').markAsUntouched();
        // this.firstFormGroup.get('gosigregory').markAsUntouched();
        // this.firstFormGroup.get('saudigregory').markAsUntouched();
        // this.firstFormGroup.get('zakatgregory').markAsUntouched();

      }, 1000);
    }

  }


  OnCountrySelect(event) {
    this.firstFormGroup.patchValue({
      otherCityCtrl: '',
      stateCtrl: ''
    })
    this.selectedCountry = event;
    this.selectTelephoneCode();
    this.selectTelephoneCode1();
    this.selectTelephoneCode2();

    this.iscitydisable = false;
    this.cityList = [];
    this.cityList = this.cityListOriginal.filter(x => x.countryName == event);

    if (this.firstFormGroup.value.stateCtrl == 'Other') {
      this.firstFormGroup.get('otherCityCtrl').enable();
      this.firstFormGroup.get('otherCityCtrl').setErrors({ invalid: true });
    } else {
      this.firstFormGroup.get('otherCityCtrl').disable();
      this.firstFormGroup.get('otherCityCtrl').markAsUntouched();
    }

    if ((event) == 'SAUDI ARABIA') {
      if (this.checked) {
        if (this.firstFormGroup.value.reghijri == null) {
          this.showErrorForRegDate = true;
        } else if (this.firstFormGroup.value.reghijri != null) {
          this.showErrorForRegDate = false;
        } else {
          this.showErrorForRegDate = false;
        }

        if (this.firstFormGroup.value.gosihijri == null) {
          this.showErrorForGosiDate = true;
        } else if (this.firstFormGroup.value.gosihijri != null) {
          this.showErrorForGosiDate = false;
        } else {
          this.showErrorForGosiDate = false;
        }

        if (this.firstFormGroup.value.saudihijri == null) {
          this.showErrorForSaudiDate = true;
        } else if (this.firstFormGroup.value.saudihijri != null) {
          this.showErrorForSaudiDate = false;
        } else {
          this.showErrorForSaudiDate = false;
        }

        if (this.firstFormGroup.value.zakathijri == null) {
          this.showErrorForZakathDate = true;
        } else if (this.firstFormGroup.value.zakathijri != null) {
          this.showErrorForZakathDate = false;
        } else {
          this.showErrorForZakathDate = false;
        }
      }

      if (!this.checked) {
        if (this.firstFormGroup.value.reggregory == null) {
          this.showErrorForRegDate = true;
        } else if (this.firstFormGroup.value.reggregory != null) {
          this.showErrorForRegDate = false;
        } else {
          this.showErrorForRegDate = false;
        }

        if (this.firstFormGroup.value.gosigregory == null) {
          this.showErrorForGosiDate = true;
        } else if (this.firstFormGroup.value.gosigregory != null) {
          this.showErrorForGosiDate = false;
        } else {
          this.showErrorForGosiDate = false;
        }

        if (this.firstFormGroup.value.saudigregory == null) {
          this.showErrorForSaudiDate = true;
        } else if (this.firstFormGroup.value.saudigregory != null) {
          this.showErrorForSaudiDate = false;
        } else {
          this.showErrorForSaudiDate = false;
        }

        if (this.firstFormGroup.value.zakatgregory == null) {
          this.showErrorForZakathDate = true;
        } else if (this.firstFormGroup.value.zakatgregory != null) {
          this.showErrorForZakathDate = false;
        } else {
          this.showErrorForZakathDate = false;
        }
      }

    } else {
      this.showErrorForRegDate = false;
      this.showErrorForGosiDate = false;
      this.showErrorForSaudiDate = false;
      this.showErrorForZakathDate = false;
    }



    if ((event) == 'BAHRAIN' || (event) == 'KUWAIT' || (event) == 'OMAN'
      || (event) == 'QATAR' || (event) == 'UNITED ARAB EMIRATES') {
      if (this.firstFormGroup.value.reggregory == null) {
        this.showErrorForDate = true;
      } else if (this.firstFormGroup.value.reggregory != null) {
        this.showErrorForDate = false;
      } else {
        this.showErrorForDate = false;
      }
    } else {
      this.showErrorForDate = false;
    }

    if ((event) == 'BAHRAIN' || (event) == 'KUWAIT' || (event) == 'OMAN'
      || (event) == 'QATAR' || (event) == 'UNITED ARAB EMIRATES' || (event) == 'SAUDI ARABIA') {
      this.isNotGCC = false;
    } else {
      this.isNotGCC = true;
    }

    if ((event) == 'SAUDI ARABIA') {
      this.kingdom = '1';
      this.showChecked = true;
      this.firstFormGroup.patchValue({ hijriGregCtrl: true });
      this.toggleShow();
      this.checked = true;
      this.firstFormGroup.patchValue({
        hijriGregCtrl: true
      });

      // this.firstFormGroup.get('reggregory').markAsUntouched();
      // this.firstFormGroup.get('reghijri').markAsUntouched();



      setTimeout(() => {
        if (this.istempFile) {
          this.firstFormGroup.get('regfiletempCtrl').setErrors({ invalid: false });
          // this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: false });
          this.thirdFormGroup.get('bankletterheadfiletempCtrl').setErrors({ invalid: false });
          // this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
          this.firstFormGroup.get('vatfiletempCtrl').setErrors({ invalid: false });
          // this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
          this.firstFormGroup.get('vatCtrl').setErrors({ invalid: false });
          // this.firstFormGroup.get('vatCtrl').markAsUntouched();
          this.firstFormGroup.get('gosifiletempCtrl').setErrors({ invalid: false });
          // this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
          this.firstFormGroup.get('saudifiletempCtrl').setErrors({ invalid: false });
          // this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
          this.firstFormGroup.get('zakathfiletempCtrl').setErrors({ invalid: false });
          // this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();

          if (this.checked) {

            if ((event) == 'SAUDI ARABIA') {
              this.firstFormGroup.get('reghijri').setErrors({ regreqvalid: true });
            }
            this.firstFormGroup.get('gosihijri').setErrors({ gosireqvalid: true });
            this.firstFormGroup.get('saudihijri').setErrors({ saudireqvalid: true });
            this.firstFormGroup.get('zakathijri').setErrors({ zakathreqvalid: true });
            this.firstFormGroup.get('reggregory').markAsUntouched();
            this.firstFormGroup.get('gosigregory').markAsUntouched();
            this.firstFormGroup.get('saudigregory').markAsUntouched();
            this.firstFormGroup.get('zakatgregory').markAsUntouched();
          } else {
            this.firstFormGroup.get('reggregory').setErrors({ regreqvalid: true });
            this.firstFormGroup.get('gosigregory').setErrors({ gosireqvalid: true });
            this.firstFormGroup.get('saudigregory').setErrors({ saudireqvalid: true });
            this.firstFormGroup.get('zakatgregory').setErrors({ zakathreqvalid: true });
          }

        } else {
          this.firstFormGroup.get('regfileoriCtrl').setErrors({ invalid: true });
          this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankfileoriCtrl').setErrors({ invalid: true });
          this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankletterheadfileoriCtrl').setErrors({ invalid: true });
          this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('vatfileoriCtrl').setErrors({ invalid: true });
          this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });
          this.firstFormGroup.get('vatCtrl').markAsUntouched();
          this.firstFormGroup.get('gosifileoriCtrl').setErrors({ invalid: true });
          this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('saudifileoriCtrl').setErrors({ invalid: true });
          this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('zakathfileoriCtrl').setErrors({ invalid: true });
          this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();

          if (this.checked) {
            if ((event) == 'SAUDI ARABIA') {
              this.firstFormGroup.get('reghijri').setErrors({ regreqvalid: true });
            }
            this.firstFormGroup.get('gosihijri').setErrors({ gosireqvalid: true });
            this.firstFormGroup.get('saudihijri').setErrors({ saudireqvalid: true });
            this.firstFormGroup.get('zakathijri').setErrors({ zakathreqvalid: true });
            this.firstFormGroup.get('reggregory').markAsUntouched();
            this.firstFormGroup.get('gosigregory').markAsUntouched();
            this.firstFormGroup.get('saudigregory').markAsUntouched();
            this.firstFormGroup.get('zakatgregory').markAsUntouched();
          } else {
            this.firstFormGroup.get('reggregory').setErrors({ regreqvalid: true });
            this.firstFormGroup.get('gosigregory').setErrors({ gosireqvalid: true });
            this.firstFormGroup.get('saudigregory').setErrors({ saudireqvalid: true });
            this.firstFormGroup.get('zakatgregory').setErrors({ zakathreqvalid: true });
          }

        }


      }, 1000);


    }
    else {
      this.kingdom = '2';
      // this.checked= false;
      this.showChecked = false;
      this.firstFormGroup.patchValue({
        hijriGregCtrl: false
      });
      //   this.ngbdDatepickerI18n.language = 'ar';
      this.modelReg = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.modelGosi = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.modelSaudi = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      this.modelZakat = new NgbDate(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate());
      // this.firstFormGroup.get('gosihijri').markAsUntouched();
      //   this.firstFormGroup.get('gosigregory').markAsUntouched();
      //   this.firstFormGroup.get('saudihijri').markAsUntouched();
      //   this.firstFormGroup.get('saudigregory').markAsUntouched();
      //   this.firstFormGroup.get('zakathijri').markAsUntouched();
      //   this.firstFormGroup.get('zakatgregory').markAsUntouched();
      //   this.firstFormGroup.get('reggregory').markAsUntouched();
      //   this.firstFormGroup.get('reghijri').markAsUntouched();

      //this.toggleShow();
      // this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
      // this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
      if (this.istempFile) {
        this.firstFormGroup.get('regfiletempCtrl').setErrors({ invalid: false });
        // this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
        this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: false });
        this.thirdFormGroup.get('bankletterheadfiletempCtrl').setErrors({ invalid: false });
        // this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
      } else {
        this.firstFormGroup.get('regfileoriCtrl').setErrors({ invalid: true });
        this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
        this.thirdFormGroup.get('bankfileoriCtrl').setErrors({ invalid: true });
        this.thirdFormGroup.get('bankletterheadfileoriCtrl').setErrors({ invalid: true });
        this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
        this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
      }
      setTimeout(() => {
        this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
        this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
        this.firstFormGroup.get('vatCtrl').markAsUntouched();
        this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
        this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
        this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
        this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
        this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();
        this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();

        this.firstFormGroup.get('reghijri').markAsUntouched();
        this.firstFormGroup.get('gosihijri').markAsUntouched();
        this.firstFormGroup.get('saudihijri').markAsUntouched();
        this.firstFormGroup.get('zakathijri').markAsUntouched();
        this.firstFormGroup.get('gosigregory').markAsUntouched();
        this.firstFormGroup.get('saudigregory').markAsUntouched();
        this.firstFormGroup.get('zakatgregory').markAsUntouched();

      }, 1000);
    }

    if (this.istempFile) {


      if (this.isRegFileAlreadyAttached) {
        this.isRegFileSelected = true;
      } else {
        if (this.firstFormGroup.get('regfiletempCtrl').hasError('invalid')) {
          this.isRegFileSelected = false;
          console.log("regfileoriCtrl is false");
        } else {
          if (this.r1FileLoaded) {
            if (this.isemptyreg) {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            } else {
              this.isRegFileSelected = true;
              console.log("regfileoriCtrl is true");
            }
          } else {
            this.isRegFileSelected = false;
            console.log("regfileoriCtrl is false");
          }
        }
      }

      if ((event) == 'SAUDI ARABIA') {
        if (this.isVatFileAlreadyAttached) {
          this.isVatFileSelected = true;

        } else {
          if (this.firstFormGroup.get('vatfiletempCtrl').hasError('invalid')) {
            this.isVatFileSelected = false;
            console.log("vatfileoriCtrl is false");
          } else {
            if (this.v1FileLoaded) {
              if (this.isemptyvat) {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              } else {
                this.isVatFileSelected = true;
                console.log("vatfileoriCtrl is true");
              }
            } else {
              this.isVatFileSelected = false;
              console.log("vatfileoriCtrl is false");
            }
          }
        }


        // 3. GosiFile
        if (this.isGosiFileAlreadyAttached) {
          this.isGosiFileSelected = true;

        } else {
          if (this.firstFormGroup.get('gosifiletempCtrl').hasError('invalid')) {
            this.isGosiFileSelected = false;
            console.log("gosifileoriCtrl is false");
          } else {
            if (this.g1FileLoaded) {
              if (this.isemptygosi) {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                this.isGosiFileSelected = true;
                console.log("gosifileoriCtrl is true");
              }


            } else {
              this.isGosiFileSelected = false;
              console.log("gosifileoriCtrl is false");
            }
          }
        }


        // 4. SaudiFile
        if (this.isSaudiFileAlreadyAttached) {
          this.isSaudiFileSelected = true;

        } else {
          if (this.firstFormGroup.get('saudifiletempCtrl').hasError('invalid')) {
            this.isSaudiFileSelected = false;
            console.log("saudifileoriCtrl is false");
          } else {
            if (this.s1FileLoaded) {
              if (this.isemptysaudi) {
                this.isSaudiFileSelected = false;
                console.log("saudifileoriCtrl is false");
              } else {
                this.isSaudiFileSelected = true;
                console.log("saudifileoriCtrl is true");
              }


            } else {
              this.isSaudiFileSelected = false;
              console.log("saudifileoriCtrl is false");
            }
          }
        }


        // 5. ZakathFile
        if (this.isZakathFileAlreadyAttached) {
          this.isZakathFileSelected = true;

        } else {
          if (this.firstFormGroup.get('zakathfiletempCtrl').hasError('invalid')) {
            this.isZakathFileSelected = false;
            console.log("zakathfileoriCtrl is false");
          } else {
            if (this.z1FileLoaded) {
              if (this.isemptyzakath) {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              } else {
                this.isZakathFileSelected = true;
                console.log("zakathfileoriCtrl is true");
              }

            } else {
              this.isZakathFileSelected = false;
              console.log("zakathfileoriCtrl is false");
            }
          }
        }
      } else {

        this.isVatFileSelected = true;

        this.isGosiFileSelected = true;

        this.isSaudiFileSelected = true;

        this.isZakathFileSelected = true;

      }

    }

    if (!this.istempFile) {

      // 1. RegFile
      if (this.isRegFileAlreadyAttached) {
        this.isRegFileSelected = true;
      } else {
        if (this.firstFormGroup.get('regfileoriCtrl').hasError('invalid')) {
          this.isRegFileSelected = false;
          console.log("regfileoriCtrl is false");
        } else {
          if (this.r1FileLoaded) {
            if (this.isemptyreg) {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            } else {
              if (this.ismaxreg) {
                this.isRegFileSelected = false;
                console.log("regfileoriCtrl is false");
              } else {
                this.isRegFileSelected = true;
                console.log("regfileoriCtrl is true");
              }
            }
          } else {
            this.isRegFileSelected = false;
            console.log("regfileoriCtrl is false");
          }
        }
      }

      if ((event) == 'SAUDI ARABIA') {
        if (this.isVatFileAlreadyAttached) {
          this.isVatFileSelected = true;
        } else {
          if (this.firstFormGroup.get('vatfileoriCtrl').hasError('invalid')) {
            this.isVatFileSelected = false;
            console.log("vatfileoriCtrl is false");
          } else {
            if (this.v1FileLoaded) {
              if (this.isemptyvat) {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              } else {
                if (this.ismaxvat) {
                  this.isVatFileSelected = false;
                  console.log("vatfileoriCtrl is false");
                } else {
                  this.isVatFileSelected = true;
                  console.log("vatfileoriCtrl is true");
                }
              }
            } else {
              this.isVatFileSelected = false;
              console.log("vatfileoriCtrl is false");
            }
          }
        }

        // 3. GosiFile
        if (this.isGosiFileAlreadyAttached) {
          this.isGosiFileSelected = true;
        } else {
          if (this.firstFormGroup.get('gosifileoriCtrl').hasError('invalid')) {
            this.isGosiFileSelected = false;
            console.log("gosifileoriCtrl is false");
          } else {
            if (this.g1FileLoaded) {
              if (this.isemptygosi) {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                if (this.ismaxgosi) {
                  this.isGosiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  this.isGosiFileSelected = true;
                  console.log("gosifileoriCtrl is true");
                }
              }
            } else {
              this.isGosiFileSelected = false;
              console.log("gosifileoriCtrl is false");
            }
          }
        }

        // 4. SaudiFile
        if (this.isSaudiFileAlreadyAttached) {
          this.isSaudiFileSelected = true;
        } else {
          if (this.firstFormGroup.get('saudifileoriCtrl').hasError('invalid')) {
            this.isSaudiFileSelected = false;
            console.log("saudifileoriCtrl is false");
          } else {
            if (this.s1FileLoaded) {
              if (this.isemptygosi) {
                this.isSaudiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                if (this.ismaxgosi) {
                  this.isSaudiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  this.isSaudiFileSelected = true;
                  console.log("gosifileoriCtrl is true");
                }
              }
            } else {
              this.isSaudiFileSelected = false;
              console.log("saudifileoriCtrl is false");
            }
          }
        }

        // 5. ZakathFile
        if (this.isZakathFileAlreadyAttached) {
          this.isZakathFileSelected = true;
        } else {
          if (this.firstFormGroup.get('zakathfileoriCtrl').hasError('invalid')) {
            this.isZakathFileSelected = false;
            console.log("zakathfileoriCtrl is false");
          } else {
            if (this.z1FileLoaded) {
              if (this.isemptyzakath) {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              } else {
                if (this.ismaxzakath) {
                  this.isZakathFileSelected = false;
                  console.log("zakathfileoriCtrl is false");
                } else {
                  this.isZakathFileSelected = true;
                  console.log("zakathfileoriCtrl is true");
                }
              }
            } else {
              this.isZakathFileSelected = false;
              console.log("zakathfileoriCtrl is false");
            }
          }
        }
      } else {

        this.isVatFileSelected = true;

        this.isGosiFileSelected = true;

        this.isSaudiFileSelected = true;

        this.isZakathFileSelected = true;

      }
    }

    // if( this.firstFormGroup.value.countryCtrl == 'BAHRAIN' || this.firstFormGroup.value.countryCtrl == 'KUWAIT' || this.firstFormGroup.value.countryCtrl == 'OMAN'
    // || this.firstFormGroup.value.countryCtrl == 'QATAR' || this.firstFormGroup.value.countryCtrl == 'UNITED ARAB EMIRATES'){
    //   this.firstFormGroup.get('reggregory').setErrors({ regreqvalid: true });
    // }

    this.uploader.clearQueue();
    this.uploaderTemp.clearQueue();
  }

  changeDate(event: any, control: string) {

    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;
    var currentDate = new Date().getDate();
    var currentFormattedDate = new Date();

    if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {

      if (this.firstFormGroup.value.hijriGregCtrl) {
        var convertedDate = ConvertSolarToLunar(currentDate, currentMonth, currentYear);
        currentFormattedDate = new Date(convertedDate.year, convertedDate.month, convertedDate.day);
      } else {
        currentFormattedDate = new Date(currentYear, currentMonth, currentDate);
      }
      var selectedDate = new Date(event.year, event.month, event.day);
      if (currentFormattedDate <= selectedDate && selectedDate != null) {
        if (control == 'reghijri') {
          this.firstFormGroup.get('reghijri').markAsUntouched();
        }
        if (control == 'reggregory') {
          this.firstFormGroup.get('reggregory').markAsUntouched();
        }
        if (control == 'gosihijri') {
          this.firstFormGroup.get('gosihijri').markAsUntouched();
        }
        if (control == 'gosigregory') {
          this.firstFormGroup.get('gosigregory').markAsUntouched();
        }
        if (control == 'saudihijri') {
          this.firstFormGroup.get('saudihijri').markAsUntouched();
        }
        if (control == 'saudigregory') {
          this.firstFormGroup.get('saudigregory').markAsUntouched();
        }
        if (control == 'zakathijri') {
          this.firstFormGroup.get('zakathijri').markAsUntouched();
        }
        if (control == 'zakatgregory') {
          this.firstFormGroup.get('zakatgregory').markAsUntouched();
        }
      } else {
        if (control == 'reghijri') {
          this.firstFormGroup.get('reghijri').setErrors({ invalid: true });
        }
        if (control == 'reggregory') {
          this.firstFormGroup.get('reggregory').setErrors({ invalid: true });
        }
        if (control == 'gosihijri') {
          this.firstFormGroup.get('gosihijri').setErrors({ invalid: true });
        }
        if (control == 'gosigregory') {
          this.firstFormGroup.get('gosigregory').setErrors({ invalid: true });
        }
        if (control == 'saudihijri') {
          this.firstFormGroup.get('saudihijri').setErrors({ invalid: true });
        }
        if (control == 'saudigregory') {
          this.firstFormGroup.get('saudigregory').setErrors({ invalid: true });
        }
        if (control == 'zakathijri') {
          this.firstFormGroup.get('zakathijri').setErrors({ invalid: true });
        }
        if (control == 'zakatgregory') {
          this.firstFormGroup.get('zakatgregory').setErrors({ invalid: true });
        }
      }

      if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
        if (this.firstFormGroup.value.gosihijri == null) {
          this.isGosihijriSelected = false;
        }

        if (this.firstFormGroup.value.gosihijri != null) {
          this.isGosihijriSelected = true;
        }

        // if(this.firstFormGroup.value.saudigregory == null){
        //   this.isSaudihijriSelected = false;
        // }

        // if(this.firstFormGroup.value.saudigregory != null){
        //   this.isSaudihijriSelected = true;
        // }

        if (this.firstFormGroup.value.saudihijri == null) {
          this.isSaudihijriSelected = false;
        }

        if (this.firstFormGroup.value.saudihijri != null) {
          this.isSaudihijriSelected = true;
        }

        // if(this.firstFormGroup.value.zakatgregory == null){
        //   this.isZakathhijriSelected = false;
        // }

        // if(this.firstFormGroup.value.zakatgregory != null){
        //   this.isZakathhijriSelected = true;
        // }

        if (this.firstFormGroup.value.zakathijri == null) {
          this.isZakathhijriSelected = false;
        }

        if (this.firstFormGroup.value.zakathijri != null) {
          this.isZakathhijriSelected = true;
        }
      }

    }
    else {
      var currentFormattedDate = new Date(currentYear, currentMonth, currentDate);
      var selectedDate = new Date(event.year, event.month, event.day);
      if (currentFormattedDate <= selectedDate) {
        if (control == 'reggregory') {
          this.firstFormGroup.get('reggregory').markAsUntouched();
        }
        if (control == 'gosigregory') {
          this.firstFormGroup.get('gosigregory').markAsUntouched();
        }
        if (control == 'saudigregory') {
          this.firstFormGroup.get('saudigregory').markAsUntouched();
        }
        if (control == 'zakatgregory') {
          this.firstFormGroup.get('zakatgregory').markAsUntouched();
        }
      } else {
        if (control == 'reggregory') {
          this.firstFormGroup.get('reggregory').setErrors({ invalid: true });
        }
        if (control == 'gosigregory') {
          this.firstFormGroup.get('gosigregory').setErrors({ invalid: true });
        }
        if (control == 'saudigregory') {
          this.firstFormGroup.get('saudigregory').setErrors({ invalid: true });
        }
        if (control == 'zakatgregory') {
          this.firstFormGroup.get('zakatgregory').setErrors({ invalid: true });
        }
      }
    }

    if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
      if (this.checked) {
        if (this.firstFormGroup.value.reghijri == null) {
          this.showErrorForRegDate = true;
        } else if (this.firstFormGroup.value.reghijri != null) {
          this.showErrorForRegDate = false;
        } else {
          this.showErrorForRegDate = false;
        }

        if (this.firstFormGroup.value.gosihijri == null) {
          this.showErrorForGosiDate = true;
        } else if (this.firstFormGroup.value.gosihijri != null) {
          this.showErrorForGosiDate = false;
        } else {
          this.showErrorForGosiDate = false;
        }

        if (this.firstFormGroup.value.saudihijri == null) {
          this.showErrorForSaudiDate = true;
        } else if (this.firstFormGroup.value.saudihijri != null) {
          this.showErrorForSaudiDate = false;
        } else {
          this.showErrorForSaudiDate = false;
        }

        if (this.firstFormGroup.value.zakathijri == null) {
          this.showErrorForZakathDate = true;
        } else if (this.firstFormGroup.value.zakathijri != null) {
          this.showErrorForZakathDate = false;
        } else {
          this.showErrorForZakathDate = false;
        }

      }

      if (!this.checked) {

        if (this.firstFormGroup.value.reggregory == null) {
          this.showErrorForRegDate = true;
        } else if (this.firstFormGroup.value.reggregory != null) {
          this.showErrorForRegDate = false;
        } else {
          this.showErrorForRegDate = false;
        }

        if (this.firstFormGroup.value.gosigregory == null) {
          this.showErrorForGosiDate = true;
        } else if (this.firstFormGroup.value.gosigregory != null) {
          this.showErrorForGosiDate = false;
        } else {
          this.showErrorForGosiDate = false;
        }

        if (this.firstFormGroup.value.saudigregory == null) {
          this.showErrorForSaudiDate = true;
        } else if (this.firstFormGroup.value.saudigregory != null) {
          this.showErrorForSaudiDate = false;
        } else {
          this.showErrorForSaudiDate = false;
        }

        if (this.firstFormGroup.value.zakatgregory == null) {
          this.showErrorForZakathDate = true;
        } else if (this.firstFormGroup.value.zakatgregory != null) {
          this.showErrorForZakathDate = false;
        } else {
          this.showErrorForZakathDate = false;
        }
      }



    } else {
      this.showErrorForRegDate = false;
      this.showErrorForGosiDate = false;
      this.showErrorForSaudiDate = false;
      this.showErrorForZakathDate = false;

    }

    if (this.firstFormGroup.value.countryCtrl == 'BAHRAIN' || this.firstFormGroup.value.countryCtrl == 'KUWAIT' ||
      this.firstFormGroup.value.countryCtrl == 'OMAN' || this.firstFormGroup.value.countryCtrl == 'QATAR' || this.firstFormGroup.value.countryCtrl == 'UNITED ARAB EMIRATES') {
      if (this.firstFormGroup.value.reggregory == null) {
        this.showErrorForDate = true;
      } else if (this.firstFormGroup.value.reggregory != null) {
        this.showErrorForDate = false;
      } else {
        this.showErrorForDate = false;
      }


    } else {
      this.showErrorForDate = false;

    }

    if (this.firstFormGroup.value.countryCtrl == 'BAHRAIN' || this.firstFormGroup.value.countryCtrl == 'KUWAIT' ||
      this.firstFormGroup.value.countryCtrl == 'OMAN' || this.firstFormGroup.value.countryCtrl == 'QATAR' || this.firstFormGroup.value.countryCtrl == 'UNITED ARAB EMIRATES' || this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
      this.isNotGCC = false;
    } else {
      this.isNotGCC = true;
    }
  }

  OnCitySelect(event) {
    if (event === 'Other') {
      this.firstFormGroup.get('otherCityCtrl').enable();
      this.firstFormGroup.get('otherCityCtrl').setErrors({ invalid: true });
    } else {
      this.firstFormGroup.get('otherCityCtrl').disable();
      this.firstFormGroup.patchValue({
        otherCityCtrl: ''
      });
      this.firstFormGroup.get('otherCityCtrl').markAsUntouched();
    }
  }

  onOtherCityEnter(event) {
    if (event && event.target.value != '') {
      var isexistingcity = this.cityList.filter(x => x.cityName.toUpperCase() == event.target.value.toString().toUpperCase());
      if (isexistingcity.length > 0) {
        this.firstFormGroup.get('otherCityCtrl').setErrors({ isexists: true });
      } else {
        this.firstFormGroup.get('otherCityCtrl').markAsUntouched();
      }
    } else {
      this.firstFormGroup.get('otherCityCtrl').markAsUntouched();
    }

    if (this.firstFormGroup.value.stateCtrl == 'Other') {
      if (this.firstFormGroup.value.otherCityCtrl == null) {
        this.isOtherCityCtrlSelected = false;
      } else if (this.firstFormGroup.value.otherCityCtrl != null) {
        this.isOtherCityCtrlSelected = true;
        if (this.firstFormGroup.value.otherCityCtrl == '') {
          this.isOtherCityCtrlSelected = false;
        }
      }
    } else {
      this.isOtherCityCtrlSelected = true;
    }
  }

  selectTelephoneCode() {
    for (var i = 0; i < this.telephoneCodeList.length; i++) {
      var telephoneCode = this.telephoneCodeList[i];
      var str = telephoneCode.toUpperCase();
      if (str.includes(this.selectedCountry)) {
        return this.selectedCountry = telephoneCode;
        // return console.log('telephoneCode:'+telephoneCode +' selected country value:'+this.selectedCountry);
      }
    }
  }

  selectTelephoneCode1() {
    for (var i = 0; i < this.telephoneCodeList1.length; i++) {
      var telephoneCode1 = this.telephoneCodeList1[i];
      var str = telephoneCode1.toUpperCase();
      if (str.includes(this.selectedCountry)) {
        return this.selectedCountry = telephoneCode1;
        // return console.log('telephoneCode:'+telephoneCode +' selected country value:'+this.selectedCountry);
      }
    }
  }

  selectTelephoneCode2() {
    for (var i = 0; i < this.telephoneCodeList2.length; i++) {
      var telephoneCode2 = this.telephoneCodeList2[i];
      var str = telephoneCode2.toUpperCase();
      if (str.includes(this.selectedCountry)) {
        return this.selectedCountry = telephoneCode2;
        // return console.log('telephoneCode:'+telephoneCode +' selected country value:'+this.selectedCountry);
      }
    }
  }

  deleteselectTelephoneCode() {
    for (var i = 0; i < this.telephoneCodeList.length; i++) {
      var telephoneCode = this.telephoneCodeList[i];
      var str = telephoneCode.toUpperCase();
      if (str.includes(this.firstFormGroup.value.countryCtrl)) {
        return this.selectedCountry = telephoneCode;
        // return console.log('telephoneCode:'+telephoneCode +' selected country value:'+this.selectedCountry);
      }
    }
  }

  deleteselectTelephoneCode1() {
    for (var i = 0; i < this.telephoneCodeList1.length; i++) {
      var telephoneCode1 = this.telephoneCodeList1[i];
      var str = telephoneCode1.toUpperCase();
      if (str.includes(this.firstFormGroup.value.countryCtrl)) {
        return this.selectedCountry = telephoneCode1;
        // return console.log('telephoneCode:'+telephoneCode +' selected country value:'+this.selectedCountry);
      }
    }
  }

  deleteselectTelephoneCode2() {
    for (var i = 0; i < this.telephoneCodeList2.length; i++) {
      var telephoneCode2 = this.telephoneCodeList2[i];
      var str = telephoneCode2.toUpperCase();
      if (str.includes(this.firstFormGroup.value.countryCtrl)) {
        return this.selectedCountry = telephoneCode2;
        // return console.log('telephoneCode:'+telephoneCode +' selected country value:'+this.selectedCountry);
      }
    }
  }

  OnBankCountrySelect(event) {
    this.thirdFormGroup.patchValue({
      bankNameCtrl: '',
      otherNameCtrl: '',
      ibanNumberCtrl: ''
    })
    this.selectedBankCountry = event;

    this.isBankcitydisable = false;

    this.selectedBankList = [];
    this.selectedBankList = this.banknameList.filter(x => x.country == event);

    if (this.thirdFormGroup.value.bankNameCtrl == 'Other') {
      this.thirdFormGroup.get('otherNameCtrl').enable();
    } else {
      this.thirdFormGroup.get('otherNameCtrl').disable();
    }
  }

  OnBankNameSelect(event) {
    if (event === 'Other') {
      this.Bank_Invalid = true;
      this.thirdFormGroup.get('otherNameCtrl').enable();
      this.thirdFormGroup.get('swiftCtrl').enable();
      // this.thirdFormGroup.get('otherNameCtrl').setErrors({ invalid: true });
      this.thirdFormGroup.patchValue({
        swiftCtrl: '',
        // otherNameCtrl: ''
      });
      // if(this.thirdFormGroup.get('otherNameCtrl').hasError('invalid')){
      //   // alert("working");
      //   this.Bank_Invalid = true;
      // }
    } else {
      this.Bank_Invalid = false;
      this.thirdFormGroup.get('otherNameCtrl').disable();
      this.thirdFormGroup.patchValue({
        otherNameCtrl: ''
      });
      this.thirdFormGroup.get('otherNameCtrl').markAsUntouched();
      var country = this.thirdFormGroup.value.bankCountryCodesCtrl;
      var banklist = this.banknameList.filter(x => x.country == country && x.description == event);
      this.thirdFormGroup.patchValue({
        swiftCtrl: banklist[0] ? banklist[0].bicCode : ''
      });
      this.thirdFormGroup.get('swiftCtrl').disable();
    }
  }

  onOtherBankEnter(event) {
    if (event && event.target.value != '') {
      var isexistingBank = this.selectedBankList.filter(x => x.description.toUpperCase().includes(event.target.value.toString().toUpperCase()));
      if (isexistingBank.length > 0) {
        this.thirdFormGroup.get('otherNameCtrl').setErrors({ isexists: true });
      } else {
        this.Bank_Invalid = false;
        this.thirdFormGroup.get('otherNameCtrl').markAsUntouched();
      }
    } else {
      this.Bank_Invalid = false;
      this.thirdFormGroup.get('otherNameCtrl ').markAsUntouched();
    }
  }

  currentRegDate: NgbDate = null;
  currentGosiDate: NgbDate = null;
  currentSaudiDate: NgbDate = null;
  currentZakatDate: NgbDate = null;
  currentAuditDate: NgbDate = null;

  async toggleShow() {
    var check = this.firstFormGroup.value.hijriGregCtrl;
    if (check) {
      this.modelReg = this.firstFormGroup.value.reggregory;
      this.modelGosi = this.firstFormGroup.value.gosigregory;
      this.modelSaudi = this.firstFormGroup.value.saudigregory;
      this.modelZakat = this.firstFormGroup.value.zakatgregory;
    } else {
      this.modelReg = this.firstFormGroup.value.reghijri;
      this.modelGosi = this.firstFormGroup.value.gosihijri;
      this.modelSaudi = this.firstFormGroup.value.saudihijri;
      this.modelZakat = this.firstFormGroup.value.zakathijri;
    }

    if (this.modelReg) {
      var result = await this.hijriGregorianDateConverter(check, this.modelReg);
      var currentYear = result['year'];
      var currentMonth = result['month'];
      var currentDate = result['day'];
      this.currentRegDate = new NgbDate(currentYear, currentMonth, currentDate);
      this.firstFormGroup.get('reggregory').markAsUntouched();
      this.firstFormGroup.get('reghijri').markAsUntouched();
    } else {
      setTimeout(() => {
        if (check) {
          if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
            this.firstFormGroup.get('reghijri').setErrors({ regreqvalid: true });
          }
          this.firstFormGroup.get('reggregory').markAsUntouched();
        } else {
          if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
            this.firstFormGroup.get('reggregory').setErrors({ regreqvalid: true });
          }
          this.firstFormGroup.get('reghijri').markAsUntouched();
        }
      }, 1000);

    }

    if (this.modelGosi) {
      var result2 = await this.hijriGregorianDateConverter(check, this.modelGosi);
      var currentYear = result2['year'];
      var currentMonth = result2['month'];
      var currentDate = result2['day'];
      this.currentGosiDate = new NgbDate(currentYear, currentMonth, currentDate);
      this.firstFormGroup.get('gosigregory').markAsUntouched();
      this.firstFormGroup.get('gosihijri').markAsUntouched();
    }
    else {
      setTimeout(() => {
        if (check) {
          this.firstFormGroup.get('gosihijri').setErrors({ gosireqvalid: true });
          this.firstFormGroup.get('gosigregory').markAsUntouched();
        } else {
          this.firstFormGroup.get('gosigregory').setErrors({ gosireqvalid: true });
          this.firstFormGroup.get('gosihijri').markAsUntouched();
        }
      }, 1000);
    }

    if (this.modelSaudi) {
      var result2 = await this.hijriGregorianDateConverter(check, this.modelSaudi);
      var currentYear = result2['year'];
      var currentMonth = result2['month'];
      var currentDate = result2['day'];
      this.currentSaudiDate = new NgbDate(currentYear, currentMonth, currentDate);
      this.firstFormGroup.get('saudigregory').markAsUntouched();
      this.firstFormGroup.get('saudihijri').markAsUntouched();
    } else {
      setTimeout(() => {
        if (check) {
          this.firstFormGroup.get('saudihijri').setErrors({ saudireqvalid: true });
          this.firstFormGroup.get('saudigregory').markAsUntouched();
        } else {
          this.firstFormGroup.get('saudigregory').setErrors({ saudireqvalid: true });
          this.firstFormGroup.get('saudihijri').markAsUntouched();
        }
      }, 1000);

    }

    if (this.modelZakat) {
      var result2 = await this.hijriGregorianDateConverter(check, this.modelZakat);
      var currentYear = result2['year'];
      var currentMonth = result2['month'];
      var currentDate = result2['day'];
      this.currentZakatDate = new NgbDate(currentYear, currentMonth, currentDate);
      this.firstFormGroup.get('zakatgregory').markAsUntouched();
      this.firstFormGroup.get('zakathijri').markAsUntouched();
    } else {
      setTimeout(() => {
        if (check) {
          this.firstFormGroup.get('zakathijri').setErrors({ zakathreqvalid: true });
          this.firstFormGroup.get('zakatgregory').markAsUntouched();
        } else {
          this.firstFormGroup.get('zakatgregory').setErrors({ zakathreqvalid: true });
          this.firstFormGroup.get('zakathijri').markAsUntouched();
        }
      }, 1000);

    }

    var resultdefault = await this.hijriGregorianDateConverter(check, null);
    var currentYear = resultdefault['year'];
    var currentMonth = resultdefault['month'];
    var currentDate = resultdefault['day'];
    this.startdate = new NgbDate(currentYear, currentMonth, currentDate);



    this.modelReg = this.currentRegDate;
    this.modelGosi = this.currentGosiDate;
    this.modelSaudi = this.currentSaudiDate;
    this.modelZakat = this.currentZakatDate;
    // this.modelAudit = this.currentAuditDate;

    if (check && this.modelReg != null) {
      this.firstFormGroup.patchValue({
        reghijri: this.modelReg
      })
    } else {
      this.firstFormGroup.patchValue({
        reggregory: this.modelReg
      })
    }
    if (check && this.modelGosi != null) {
      this.firstFormGroup.patchValue({
        gosihijri: this.modelGosi
      })
    } else {
      this.firstFormGroup.patchValue({
        gosigregory: this.modelGosi
      })
    }
    if (check && this.modelSaudi != null) {
      this.firstFormGroup.patchValue({
        saudihijri: this.modelSaudi
      })
    } else {
      this.firstFormGroup.patchValue({
        saudigregory: this.modelSaudi
      })
    }
    if (check && this.modelSaudi != null) {
      this.firstFormGroup.patchValue({
        zakathijri: this.modelZakat
      })
    } else {
      this.firstFormGroup.patchValue({
        zakatgregory: this.modelZakat
      })
    }
    setTimeout(() => {
      if (check) {
        this.changeDate(this.modelReg, 'reghijri');
        this.changeDate(this.modelGosi, 'gosihijri');
        this.changeDate(this.modelSaudi, 'saudihijri');
        this.changeDate(this.modelZakat, 'zakathijri');
      } else {
        this.changeDate(this.modelReg, 'reggregory');
        this.changeDate(this.modelGosi, 'gosigregory');
        this.changeDate(this.modelSaudi, 'saudigregory');
        this.changeDate(this.modelZakat, 'zakatgregory');
      }
    }, 1000);

  }


  hijriGregorianDateConverter(checked: boolean, selectedDate: NgbDateStruct) {
    var currentYear = new Date().getFullYear();
    var currentMonth = new Date().getMonth() + 1;
    var currentDate = new Date().getDate();

    var currentFormattedDate: NgbDate;

    if (checked) {
      this.ngbdDatepickerI18n.language = 'ar';
      if (!selectedDate) {
        var convertedDate = ConvertSolarToLunar(currentDate, currentMonth, currentYear);
        currentFormattedDate = new NgbDate(convertedDate.year, convertedDate.month, convertedDate.day);
      } else if (checked && selectedDate) {
        var convertedDate = ConvertSolarToLunar(selectedDate.day + 1, selectedDate.month, selectedDate.year);
        currentFormattedDate = new NgbDate(convertedDate.year, convertedDate.month, convertedDate.day);

      } else {
        currentFormattedDate = new NgbDate(selectedDate.year, selectedDate.month, selectedDate.day);

      }
      currentFormattedDate;
    }
    else {
      this.ngbdDatepickerI18n.language = 'en';
      if (!selectedDate) {
        currentFormattedDate = new NgbDate(currentYear, currentMonth, currentDate);
      } else if (!checked && selectedDate) {
        if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
          var convertedDate = ConvertLunarToSolar(selectedDate.day - 1, selectedDate.month, selectedDate.year);
          currentFormattedDate = new NgbDate(convertedDate.year, convertedDate.month, convertedDate.day);
        } else {
          currentFormattedDate = new NgbDate(selectedDate.year, selectedDate.month, selectedDate.day);
        }
      } else {
        currentFormattedDate = new NgbDate(selectedDate.year, selectedDate.month, selectedDate.day);

      }

    }

    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(currentFormattedDate)
      }, 200);
    });

  }

  additionalEmailValidate(event: any, category: string) {
    // this.additionalEmailCheck1 = true;
    // this.additionalEmailCheck2 = true;

    var email1 = this.firstFormGroup.getRawValue().emailCtrl1;
    var email2 = this.firstFormGroup.getRawValue().emailCtrl2;

    if (category == '1') {
      this.executeListingAdditional(email1,'E','EA1');
      if (this.firstFormGroup.getRawValue().emailCtrl1 != '') {
        var emailvalue = this.firstFormGroup.getRawValue().emailCtrl1.toLowerCase().trim();
        var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);  // ("^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-z]{2,6})$");
        var res = pattern.test(emailvalue);
        if (res) {
          if ((this.supplier.email1 != this.firstFormGroup.getRawValue().emailCtrl1)) {
            // this.executeListing(event.target.value, 'E');
            this.additionalEmailCheckPattern1 = false;

          }
          this.additionalEmailCheckPattern1 = false;

        } else {
          // this.firstFormGroup.get('emailCtrl1').setErrors({ pattern: true });
          this.additionalEmailCheckPattern1 = true;

        }
      } else {
        // this.firstFormGroup.get('emailCtrl').setErrors({ required: true });
      }

      if (this.firstFormGroup.getRawValue().emailCtrl1 == this.firstFormGroup.getRawValue().emailCtrl) {
        if (this.firstFormGroup.getRawValue().emailCtrl1 != '') {
          this.additionalEmailCheck1 = true;
        }
      } else if (this.firstFormGroup.getRawValue().emailCtrl1 == this.firstFormGroup.getRawValue().emailCtrl2) {
        if (this.firstFormGroup.getRawValue().emailCtrl1 != '') {
          this.additionalEmailCheck1 = true;
        }
      } else {
        this.additionalEmailCheck1 = false;
      }
    }

    if (category == '2') {
      this.executeListingAdditional(email2,'E','EA2');
      if (this.firstFormGroup.getRawValue().emailCtrl2 != '') {
        var emailvalue = this.firstFormGroup.getRawValue().emailCtrl2.toLowerCase().trim();
        var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);  // ("^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-z]{2,6})$");
        var res = pattern.test(emailvalue);
        if (res) {
          if ((this.supplier.email2 != this.firstFormGroup.getRawValue().emailCtrl2)) {
            // this.executeListing(event.target.value, 'E');
            this.additionalEmailCheckPattern2 = false;

          }
          this.additionalEmailCheckPattern2 = false;

        } else {
          // this.firstFormGroup.get('emailCtrl1').setErrors({ pattern: true });
          this.additionalEmailCheckPattern2 = true;

        }
      } else {
        // this.firstFormGroup.get('emailCtrl').setErrors({ required: true });
      }

      if (this.firstFormGroup.getRawValue().emailCtrl2 == this.firstFormGroup.getRawValue().emailCtrl) {
        if (this.firstFormGroup.getRawValue().emailCtrl2 != '') {
          this.additionalEmailCheck2 = true;
        }
      } else if (this.firstFormGroup.getRawValue().emailCtrl2 == this.firstFormGroup.getRawValue().emailCtrl1) {
        if (this.firstFormGroup.getRawValue().emailCtrl2 != '') {
          this.additionalEmailCheck2 = true;
        }
      } else {
        this.additionalEmailCheck2 = false;
      }
    }
  }

  additionalContact(action, position) {
    if (action == "Add") {
      if (position == "1") {
        this.contactsequence = 2;

        this.additionalContact1 = true;
        this.showAdditionalButton1 = false;
        this.firstFormGroup.get('titleCtrl1').markAsTouched();
        this.firstFormGroup.get('firstNameCtrl1').markAsTouched();
        this.firstFormGroup.get('lastNameCtrl1').markAsTouched();
        this.firstFormGroup.get('positionCtrl1').markAsTouched();
        this.firstFormGroup.get('emailCtrl1').markAsTouched();
        this.firstFormGroup.get('telephoneNumberCtrl1').markAsTouched();
        this.firstFormGroup.get('mobileNumberCtrl1').markAsTouched();

      }
      if (position == "2") {
        this.additionalContact2 = true;
        this.showAdditionalButton2 = false;
        this.contactsequence = 2;
        this.firstFormGroup.get('titleCtrl2').markAsTouched();
        this.firstFormGroup.get('firstNameCtrl2').markAsTouched();
        this.firstFormGroup.get('lastNameCtrl2').markAsTouched();
        this.firstFormGroup.get('positionCtrl2').markAsTouched();
        this.firstFormGroup.get('emailCtrl2').markAsTouched();
        this.firstFormGroup.get('telephoneNumberCtrl2').markAsTouched();
        this.firstFormGroup.get('mobileNumberCtrl2').markAsTouched();
      }
    }
    if (action == "Remove") {
      if (position == "1") {

        this.contactsequence = 1;
        this.additionalContact1 = true;
        this.showAdditionalButton1 = true;
        this.firstFormGroup.get('titleCtrl1').markAsUntouched();
        this.firstFormGroup.get('firstNameCtrl1').markAsUntouched();
        this.firstFormGroup.get('lastNameCtrl1').markAsUntouched();
        this.firstFormGroup.get('positionCtrl1').markAsUntouched();
        this.firstFormGroup.get('emailCtrl1').markAsUntouched();
        this.firstFormGroup.get('telephoneCodeCtrl1').markAsUntouched();
        this.firstFormGroup.get('telephoneNumberCtrl1').markAsUntouched();
        this.firstFormGroup.get('mobileCodeCtrl1').markAsUntouched();
        this.firstFormGroup.get('extCtrl1').markAsUntouched();
        this.firstFormGroup.get('mobileNumberCtrl1').markAsUntouched();
        this.firstFormGroup.get('faxNumberCtrl1').markAsUntouched();
        this.firstFormGroup.get('faxNumberCtrl1').markAsUntouched();

        this.firstFormGroup.patchValue({
          titleCtrl1: "",
          firstNameCtrl1: "",
          lastNameCtrl1: "",
          positionCtrl1: "",
          emailCtrl1: "",
          telephoneCodeCtrl1: "",
          telephoneNumberCtrl1: "",
          extCtrl1: 0,
          mobileCodeCtrl1: "",
          mobileNumberCtrl1: "",
          faxCodeCtrl1: "",
          faxNumberCtrl1: ""
        });

        this.deleteselectTelephoneCode();
        // this.selectTelephoneCode1();
        if (this.additionalContact2) {
          this.deleteselectTelephoneCode2();
        }
        // this.changeTab('Profile Details');
        // this.changeTab('Supplier Details');

        // this.popupValidate1(1);
        // this.popupValidate1(0);
      }
      if (position == "2") {
        this.additionalContact2 = false;
        this.showAdditionalButton2 = true;
        this.firstFormGroup.get('titleCtrl2').markAsUntouched();
        this.firstFormGroup.get('firstNameCtrl2').markAsUntouched();
        this.firstFormGroup.get('lastNameCtrl2').markAsUntouched();
        this.firstFormGroup.get('positionCtrl2').markAsUntouched();
        this.firstFormGroup.get('emailCtrl2').markAsUntouched();
        this.firstFormGroup.get('telephoneCodeCtrl2').markAsUntouched();
        this.firstFormGroup.get('telephoneNumberCtrl2').markAsUntouched();
        this.firstFormGroup.get('extCtrl2').markAsUntouched();
        this.firstFormGroup.get('mobileCodeCtrl2').markAsUntouched();
        this.firstFormGroup.get('mobileNumberCtrl2').markAsUntouched();
        this.firstFormGroup.get('faxNumberCtrl2').markAsUntouched();
        this.firstFormGroup.get('faxNumberCtrl2').markAsUntouched();

        this.firstFormGroup.patchValue({
          titleCtrl2: "",
          firstNameCtrl2: "",
          lastNameCtrl2: "",
          positionCtrl2: "",
          emailCtrl2: "",
          telephoneCodeCtrl2: "",
          telephoneNumberCtrl2: "",
          extCtrl2: 0,
          mobileCodeCtrl2: "",
          mobileNumberCtrl2: "",
          faxCodeCtrl2: "",
          faxNumberCtrl2: ""
        });
        this.deleteselectTelephoneCode();
        if (this.additionalContact1) {
          this.deleteselectTelephoneCode1();
        }
        // this.selectTelephoneCode2();
        // this.popupValidate1(1);
        // this.popupValidate1(0);
      }
    }
  }

  executeListingAdditional(value: string, category: string, addCategory: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    var body = {
      value
    };
    if (value != '' && !(value == 'Sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'Nadun.Ruchiranga@xitricon.com' || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com')) {
      var isExist: IsExists = new IsExists();
      isExist.value = value;
      isExist.category = category;
      this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {
        if (data != null && data['status'] != 'Reactivated') {
          if (category == 'E') {
            if (addCategory == 'EA1') {
              this.additionalEmailCheck1 = true;
            } else if (addCategory == 'EA2') {
              this.additionalEmailCheck2 = true;
            }
          }
        }
      });
    }
  }

  openDialog(action, obj) {
    obj.action = action;
    obj.detail = this.dataSourceSelectedId;
    console.log(action);

    if (action == 'Add') {
      const dialogRef = this.dialog.open(DialogBoxComponent, {
        width: '100%',
        data: [obj, this.dataSourceAll],
        maxHeight: '90vh',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result.event == 'Add') {
          this.addRowData(result.data);
        } else {
        }
      });

    } else if (action == 'Delete') {

      this.dataSourceAll = this.dataSourceAll.filter(x => x.position != obj.position);

      if (this.dataSourceAll.length == 0) {
        this.firstFormGroup.patchValue({
          additionalMaterialCtrl: ''
        });
      }
    }
  }
  // dataSourceSelected = [];

  addRowData(row_obj) {
    console.log(row_obj);
    if (row_obj.length == 0) {
      this.dataSourceAll = [];

    } else {
      this.dataSourceAll = [];
      const values = this.dataSourceAll.filter((value, key) => { value.position });

      console.log(row_obj.length);

      for (var product of row_obj) {
        var d = Math.random();

        if (this.dataSourceAll.filter(x => x.position == product.position).length < 1) {
          this.dataSourceAll.push({
            //id: d,
            position: product.position,
            generalCategory: product.generalCategory,
            subCategory: product.subCategory,
            detailCategory: product.detailCategory,
            isChecked: product.isChecked,
            isSRMChecked: 'Yes',
            generalCode: product.generalCode,
            subCode: product.subCode,
            detailCode: product.detailCode,
          });

          this.dataSourceSelectedId.push({
            position: product.position
          });
        }
      }
      this.table.renderRows();
      console.log(this.dataSourceAll);

    }
  }

  updateRowData(row_obj) {
    this.dataSourceAll = this.dataSourceAll.filter((value, key) => {
      if (value.position == row_obj.position) {
        value.position = row_obj.position;
        value.generalCategory = row_obj.generalCategory;
        value.isChecked = row_obj.isChecked;
      }
      return true;
    });
  }
  deleteRowData(row_obj) {
    this.dataSourceAll = this.dataSourceAll.filter((value, key) => {
      return value.position != row_obj.position;
    });
  }

  agreementcheckclick() {
    if (this.agree) {
      this.agreement = false
    } else {
      this.agreement = true;
    }
  }

  validatecheck() {
    if (this.firstFormGroup.value.supplierNameCtrl != '' && this.firstFormGroup.controls.supplierNameCtrl.status == 'INVALID') {
      this.toast(TYPE.WARNING, false, 'Supplier Name already exists');
    } else if (this.firstFormGroup.value.emailCtrl != '' && (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.pattern != undefined && this.firstFormGroup.controls.emailCtrl.errors.pattern)) {
      this.toast(TYPE.WARNING, false, 'Please enter a valid E-mail Address eg : example@exp.com');
    } else if (this.firstFormGroup.value.emailCtrl != '' && (this.firstFormGroup.controls.emailCtrl.errors && this.firstFormGroup.controls.emailCtrl.errors.invalid != undefined && this.firstFormGroup.controls.emailCtrl.errors.invalid)) {
      this.toast(TYPE.WARNING, false, 'Supplier Email already exists');
    }
  }

  

  onQualityChange(ob, cat) {
    let selectedBook = ob.value;

    if (cat === "stat")
      this.isstatisticCtrl = false;

    if (cat == 'resp' && selectedBook == 'No') {
      this.isqualityResp1Ctrl = false;

      this.secondFormGroup.patchValue({
        qualityNameCtrl: '',
        qualityDesigCtrl: ''
      });
    }

    // if (cat == 'orgtype' && selectedBook == 'No') {
    //   this.orgtype = false;

    //   this.secondFormGroup.patchValue({
    //     typeOfOrganization2Ctrl: ''
    //   });
    //   this.secondFormGroup.get('typeOfOrganization2Ctrl').markAsUntouched();

    // }

    if (cat == 'orgtype' && selectedBook == 'Other - Please Specify') {
      this.orgtype = true;
      if (this.secondFormGroup.value.typeOfOrganizationCtrl == 'Other - Please Specify') {
        if (this.secondFormGroup.value.typeOfOrganization2Ctrl == null) {
          this.isTypeOfOrganization2CtrlSelected = false;
        } else if (this.secondFormGroup.value.typeOfOrganization2Ctrl != null) {
          this.isTypeOfOrganization2CtrlSelected = true;
          if (this.secondFormGroup.value.typeOfOrganization2Ctrl == '') {
            this.isTypeOfOrganization2CtrlSelected = false;
          }

        }
      } else {
        this.isTypeOfOrganization2CtrlSelected = true;
      }
    }

    if (cat == 'orgtype' && selectedBook != 'Other - Please Specify') {
      this.orgtype = false;
      if (this.secondFormGroup.value.typeOfOrganizationCtrl == 'Other - Please Specify') {
        if (this.secondFormGroup.value.typeOfOrganization2Ctrl == null) {
          this.isTypeOfOrganization2CtrlSelected = false;
        } else if (this.secondFormGroup.value.typeOfOrganization2Ctrl != null) {
          this.isTypeOfOrganization2CtrlSelected = true;
          if (this.secondFormGroup.value.typeOfOrganization2Ctrl == '') {
            this.isTypeOfOrganization2CtrlSelected = false;
          }

        }
      } else {
        this.isTypeOfOrganization2CtrlSelected = true;
      }

    }

    if (cat == 'resp' && selectedBook == 'Yes') {
      this.isqualityResp1Ctrl = true;
    }

    if (cat == 'suspend' && selectedBook == 'No') {
      this.issuspendedProj1Ctrl = false;

      this.secondFormGroup.patchValue({
        suspendedProj2Ctrl: ''
      });
      this.secondFormGroup.get('suspendedProj2Ctrl').markAsUntouched();

    }
    if (cat == 'suspend' && selectedBook == 'Yes') {
      this.issuspendedProj1Ctrl = true;

      this.secondFormGroup.get('suspendedProj2Ctrl').markAsTouched();
      console.log('before 1');
      this.secondFormGroup.get('suspendedProj2Ctrl').setErrors({ invalid: true });
      console.log('after 2');


    }
    if (cat == 'litigation' && selectedBook == 'No') {
      this.islitigation1Ctrl = false;

      this.secondFormGroup.patchValue({
        litigation2Ctrl: ''
      });
    }
    if (cat == 'litigation' && selectedBook == 'Yes') {
      this.islitigation1Ctrl = true;

      this.secondFormGroup.get('litigation2Ctrl').markAsTouched();
      this.secondFormGroup.get('litigation2Ctrl').setErrors({ invalid: true });

      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });
    }
    if (cat == 'share' && selectedBook == 'No') {
      this.isshareholder1Ctrl = false;

      this.secondFormGroup.patchValue({
        shareholder2Ctrl: ''
      });
    }
    if (cat == 'share' && selectedBook == 'Yes') {
      this.isshareholder1Ctrl = true;

      this.secondFormGroup.get('shareholder2Ctrl').markAsTouched();
      this.secondFormGroup.get('shareholder2Ctrl').setErrors({ invalid: true });

      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });
    }

    if (cat == 'labour' && selectedBook == 'Yes') {
      this.islegalAsset1Ctrl = true;

      this.secondFormGroup.get('legalAsset2Ctrl').markAsTouched();
      this.secondFormGroup.get('legalAsset2Ctrl').setErrors({ invalid: true });
      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });
    }
    if (cat == 'labour' && selectedBook == 'No') {
      this.islegalAsset1Ctrl = false
      this.secondFormGroup.patchValue({
        labour2Ctrl: ''
      });
    }

    if (cat == 'labour1' && selectedBook == 'Yes') {
      this.islabour1Ctrl = true;

      this.secondFormGroup.get('labour2Ctrl').markAsTouched();
      this.secondFormGroup.get('labour2Ctrl').setErrors({ invalid: true });
      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });
    }
    if (cat == 'labour1' && selectedBook == 'No') {
      this.islabour1Ctrl = false;
      this.secondFormGroup.patchValue({
        labour2Ctrl: ''
      });
    }

    if (cat == 'envt' && selectedBook == 'No') {
      this.isenvironment1Ctrl = false;


      this.secondFormGroup.patchValue({
        environment2Ctrl: ''
      });
    }
    if (cat == 'envt' && selectedBook == 'Yes') {
      this.isenvironment1Ctrl = true;

      this.secondFormGroup.get('environment2Ctrl').markAsTouched();
      this.secondFormGroup.get('environment2Ctrl').setErrors({ invalid: true });
      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });
    }

    if (cat == 'inter' && selectedBook == 'Yes') {
      this.isimiInterested1trl = true;

      this.secondFormGroup.get('imiInterested2trl').markAsTouched();
      this.secondFormGroup.get('imiInterested2trl').setErrors({ invalid: true });
      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });
    }
    if (cat == 'inter' && selectedBook == 'No') {
      this.isimiInterested1trl = false;
      this.secondFormGroup.patchValue({
        imiInterested2trl: ''
      });
    }

    if (cat == 'dedic' && selectedBook == 'No') {
      this.isdedicatedpersCtrl = false;

      this.secondFormGroup.patchValue({
        hseNameCtrl: '',
        hseDesigCtrl: ''
      });

    }

    if (cat == 'dedic' && selectedBook == 'Yes') {
      this.isdedicatedpersCtrl = true;

      this.secondFormGroup.get('hseNameCtrl').markAsTouched();
      this.secondFormGroup.get('hseNameCtrl').setErrors({ invalid: true });

      this.secondFormGroup.get('hseDesigCtrl').markAsTouched();
      this.secondFormGroup.get('hseDesigCtrl').setErrors({ invalid: true });
      // this.secondFormGroup.get('litigation1Ctrl').setErrors({ invalid: true });

    }


    if (cat == 'stat' && selectedBook == 'Yes') {
      this.isstatisticCtrl = true;

      this.secondFormGroup.get('statisticNearCtrl').markAsTouched();
      this.secondFormGroup.get('statisticNearCtrl').setErrors({ invalid: true });

      this.secondFormGroup.get('statisticFirstCtrl').markAsTouched();
      this.secondFormGroup.get('statisticFirstCtrl').setErrors({ invalid: true });

      this.secondFormGroup.get('statisticMediCtrl').markAsTouched();
      this.secondFormGroup.get('statisticMediCtrl').setErrors({ invalid: true });

      this.secondFormGroup.get('statisticLostCtrl').markAsTouched();
      this.secondFormGroup.get('statisticLostCtrl').setErrors({ invalid: true });

      this.secondFormGroup.get('statisticFatalCtrl').markAsTouched();
      this.secondFormGroup.get('statisticFatalCtrl').setErrors({ invalid: true });

      this.secondFormGroup.get('statisticEnvtCtrl').markAsTouched();
      this.secondFormGroup.get('statisticEnvtCtrl').setErrors({ invalid: true });

      this.isStatisticCtrlSelected = false;

      this.isHseStaticDocFileAlreadyAttached = false;


    }

    if (cat == 'stat' && selectedBook == 'No') {
      this.isstatisticCtrl = false;
      this.isStatisticCtrlSelected = true;

      for (let i = 0; i < this.selectedFileName.length; i++) {
        if (this.selectedFileName[i].includes('h6')) {
          const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
          // Remove filename form file[] array
          // Delete the item from fileNames list
          this.selectedFileName.splice(index, 1);
          // delete file from FileList
          this.selectedFiles.splice(index, 1);
        }
      }

      this.StatisticFile_name = null;

      this.secondFormGroup.patchValue({
        statisticNearCtrl: '',
        statisticFirstCtrl: '',
        statisticLostCtrl: '',
        statisticFatalCtrl: '',
        statisticEnvtCtrl: '',
        statisticMediCtrl: '',
        statisticTempCtrl: '',
        StatisticoriCtrl: ''
      });

      this.h6FileLoaded = false;


    }
  }

  isFormatreg = false;
  isFormatvat = false;
  isFormatgosi = false;
  isFormatsaudi = false;
  isFormatzakath = false;
  isFormatassociation = false;
  isFormatmanorg = false;
  isFormatadditional = false;
  isFormatadditional2 = false;
  isFormatadditional3 = false;
  isFormatadditional4 = false;
  isFormatadditional5 = false;
  isFormatfin1 = false;
  isFormatfin2 = false;
  isFormatfin3 = false;
  isFormatorgdesign = false;
  isFormatoutorg = false;
  isFormatthirdparty = false;
  isFormatbusrefr = false;
  isFormattrainInfo = false;
  isFormathse = false;
  isFormathse2 = false;
  isFormathse3 = false;
  isFormathse4 = false;
  isFormathse6 = false;
  isFormatquality1 = false;
  isFormatquality2 = false;
  isFormatquality3 = false;
  isFormatbank = false;
  isFormatbankletterhead = false;


  ismaxreg = false;
  ismaxvat = false;
  ismaxgosi = false;
  ismaxsaudi = false;
  ismaxzakath = false;
  ismaxassociation = false;
  ismaxmanorg = false;
  ismaxadditional = false;
  ismaxadditional2 = false;
  ismaxadditional3 = false;
  ismaxadditional4 = false;
  ismaxadditional5 = false;
  ismaxfin1 = false;
  ismaxfin2 = false;
  ismaxfin3 = false;
  ismaxorgdesign = false;
  ismaxoutorg = false;
  ismaxthirdparty = false;
  ismaxbusrefr = false;
  ismaxtrainInfo = false;
  ismaxhse = false;
  ismaxhse2 = false;
  ismaxhse3 = false;
  ismaxhse4 = false;
  ismaxquality1 = false;
  ismaxquality2 = false;
  ismaxquality3 = false;
  ismaxbank = false;
  ismaxbankletterhead = false;
  ismaxhse6 = false;

  isemptyhse6 = false;
  isemptyreg = false;
  isemptyvat = false;
  isemptygosi = false;
  isemptysaudi = false;
  isemptyzakath = false;
  isemptyassociation = false;
  isemptymanorg = false;
  isemptyadditional = false;
  isemptyadditional2 = false;
  isemptyadditional3 = false;
  isemptyadditional4 = false;
  isemptyadditional5 = false;
  isemptyfin1 = false;
  isemptyfin2 = false;
  isemptyfin3 = false;
  isemptyorgdesign = false;
  isemptyoutorg = false;
  isemptythirdparty = false;
  isemptybusrefr = false;
  isemptytrainInfo = false;
  isemptyhse = false;
  isemptyhse2 = false;
  isemptyhse3 = false;
  isemptyhse4 = false;
  isemptyquality1 = false;
  isemptyquality2 = false;
  isemptyquality3 = false;
  isemptybank = false;
  isemptybankletterhead = false;
  isregadded = false;
  isbankadded = false;
  isbankletterheadadded = false;
  isReqBank = false;

  isFileRequired = false;
  isFileAdded = false;

  addMoreAttachment() {

    if (this.attachment_count == 1) {
      this.addAnother = true;

    }

    if (this.attachment_count == 2) {
      this.addAnother2 = true;

    }

    if (this.attachment_count == 3) {
      this.addAnother3 = true;

    }

    if (this.attachment_count == 4) {
      this.addAnother4 = true;

    }
    this.attachment_count++;

    if (this.attachment_count > 4) {
      this.additionalAttachButton = true;
    }
    // this.firstFormGroup.get('additionalCtrl2').markAsTouched();
    // this.firstFormGroup.get('additionalCtrl3').markAsTouched();
    // this.firstFormGroup.get('additionalCtrl4').markAsTouched();
    // this.firstFormGroup.get('additionalCtrl5').markAsTouched();

  }

  uploadFiles(categoryname: string, input) {

    var searchTags = "_" + categoryname;

    if (categoryname == 'r1') {

      if (this.r1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.r1_count = this.r1_count + 1;

    } else if (categoryname == 'v1') {
      if (this.v1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.v1_count = this.v1_count + 1;
    } else if (categoryname == 'g1') {
      if (this.g1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.g1_count = this.g1_count + 1;

    } else if (categoryname == 's1') {
      if (this.s1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.s1_count = this.s1_count + 1;

    } else if (categoryname == 'z1') {
      if (this.z1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.z1_count = this.z1_count + 1;

    } else if (categoryname == 'a1') {
      if (this.a1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.a1_count = this.a1_count + 1;

    } else if (categoryname == 'm1') {
      if (this.m1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.m1_count = this.m1_count + 1;

    } else if (categoryname == 'a2') {
      if (this.a2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a3') {
      if (this.a3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a4') {
      if (this.a4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a5') {
      if (this.a5_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a6') {
      if (this.a6_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'f1') {
      if (this.f1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.f1_count = this.f1_count + 1;

    } else if (categoryname == 'f2') {
      if (this.f2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.f2_count = this.f2_count + 1;

    } else if (categoryname == 'f3') {
      if (this.f3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.f3_count = this.f3_count + 1;

    } else if (categoryname == 'e1') {
      if (this.e1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e1_count = this.e1_count + 1;


    } else if (categoryname == 'e2') {
      if (this.e2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e2_count = this.e2_count + 1;


    } else if (categoryname == 'e3') {
      if (this.e3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e3_count = this.e3_count + 1;

    } else if (categoryname == 'e4') {
      if (this.e4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e4_count = this.e4_count + 1;

    } else if (categoryname == 'e5') {
      if (this.e5_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e5_count = this.e5_count + 1;

    } else if (categoryname == 'h1') {
      if (this.h1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h1_count = this.h1_count + 1;

    } else if (categoryname == 'h2') {
      if (this.h2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h2_count = this.h2_count + 1;

    } else if (categoryname == 'h3') {
      if (this.h3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h3_count = this.h3_count + 1;

    } else if (categoryname == 'h4') {
      if (this.h4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h4_count = this.h4_count + 1;

    } else if (categoryname == 'h6') {
      if (this.h6_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h6_count = this.h6_count + 1;

    } else if (categoryname == 'q1') {
      if (this.q1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.q1_count = this.q1_count + 1;

    } else if (categoryname == 'q2') {
      if (this.q2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.q2_count = this.q2_count + 1;

    } else if (categoryname == 'q3') {
      if (this.q3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.q3_count = this.q3_count + 1;

    } else if (categoryname == 'b1') {
      if (this.b1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
            this.b1FileLoaded = false;

          }
        }
      }
      this.b1_count = this.b1_count + 1;

    } else if (categoryname == 'b2') {
      if (this.b2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
            this.b2FileLoaded = false;

          }
        }
      }
      this.b2_count = this.b2_count + 1;

    }
    console.log(input.files.length);


    // if (input.files && input.files[0]) {
    //   var reader = new FileReader();

    //   reader.readAsDataURL(input.files[0]); // read file as data url
    //   // reader. // read file as data url


    //   const fileURL = URL.createObjectURL(input.files[0]);

    //   this.url = fileURL;

    //   if(input.files[0]){
    //     this.section = true;
    //   }

    //   // window.open(fileURL, '_blank');

    //   // reader.onload = (input) => { // called once readAsDataURL is completed
    //   //   this.url = input.target.result;
    //   //   // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    //   //   console.log(this.url);
    //   // }
    // }

    console.log(input.files.length);

    if (!input.files.length) {
      console.log('No file is attached - no file length');

      for (const fileItem of this.uploaderTemp.queue) {
        console.log('file items : ' + fileItem.file.name);
        if (fileItem.file.name.includes(searchTags)) {
          this.uploaderTemp.removeFromQueue(fileItem);
          console.log('file deleted');
          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

        }
      }

      if (categoryname == 'r1') {
        this.RegFile_name = "";
        this.isRegFile_name = false;
      } else if (categoryname == 'v1') {
        this.VatFile_name = "";
        this.isVatFile_name = false;

      } else if (categoryname == 'g1') {
        this.GosiFile_name = "";
        this.isGosiFile_name = false;

      } else if (categoryname == 's1') {
        this.SaudiFile_name = "";
        this.isSaudiFile_name = false;

      } else if (categoryname == 'z1') {
        this.ZakathFile_name = "";
        this.isZakathFile_name = false;

      } else if (categoryname == 'a1') {
        this.AssociationFile_name = "";
        this.isAssociationFile_name = false;

      } else if (categoryname == 'm1') {
        this.OrgaizationChartFile_name = "";
        this.isOrgaizationChartFile_name = false;

      } else if (categoryname == 'a2') {
        this.AdditionalFile_name = "";
        this.isAdditionalFile_name = false;

      } else if (categoryname == 'a3') {
        this.AdditionalFile2_name = "";
        this.isAdditionalFile2_name = false;

      } else if (categoryname == 'a4') {
        this.AdditionalFile3_name = "";
        this.isAdditionalFile3_name = false;

      } else if (categoryname == 'a5') {
        this.AdditionalFile4_name = "";
        this.isAdditionalFile4_name = false;

      } else if (categoryname == 'a6') {
        this.AdditionalFile5_name = "";
        this.isAdditionalFile5_name = false;

      } else if (categoryname == 'f1') {
        this.FinancialYear1File_name = "";
        this.isFinancialYear1File_name = false;

      } else if (categoryname == 'f2') {
        this.FinancialYear2File_name = "";
        this.isFinancialYear2File_name = false;


      } else if (categoryname == 'f3') {
        this.FinancialYear3File_name = "";
        this.isFinancialYear3File_name = false;


      } else if (categoryname == 'e1') {
        this.DesignFile_name = "";
        this.isDesignFile_name = false;

      } else if (categoryname == 'e2') {
        this.FinishFile_name = "";
        this.isFinishFile_name = false;

      } else if (categoryname == 'e3') {
        this.RegisteredFile_name = "";
        this.isRegisteredFile_name = false;

      } else if (categoryname == 'e4') {
        this.BusinessReferencesFile_name = "";
        this.isBusinessReferencesFile_name = false;

      } else if (categoryname == 'e5') {
        this.ComplianceFile_name = "";
        this.isComplianceFile_name = false;

      } else if (categoryname == 'h1') {
        this.HseFile_name = "";
        this.isHseFile_name = false;

      } else if (categoryname == 'h2') {
        this.DocuFile_name = "";
        this.isDocuFile_name = false;

      } else if (categoryname == 'h3') {
        this.ISOHealthFile_name = "";
        this.isISOHealthFile_name = false;

      } else if (categoryname == 'h4') {
        this.EnvtFile_name = "";
        this.isEnvtFile_name = false;

      } else if (categoryname == 'h6') {
        this.StatisticFile_name = "";
        this.isStatisticFile_name = false;

      } else if (categoryname == 'q1') {
        this.QualityPolicyFile_name = "";
        this.isQualityPolicyFile_name = false;

      } else if (categoryname == 'q2') {
        this.QualityMgtFile_name = "";
        this.isQualityMgtFile_name = false;

      } else if (categoryname == 'q3') {
        this.QualityMgtISOFile_name = "";
        this.isQualityMgtISOFile_name = false;

      } else if (categoryname == 'b1') {
        this.BankFile_name = "";
        this.isBankFile_name = false;

      } else if (categoryname == 'b2') {
        this.BankLetterHeadFile_name = "";
        this.isBankLetterHeadFile_name = false;

      }
    }

    console.log('Categorized name: ' + categoryname);
    var length = this.uploaderTemp.queue.length;
    if (length > 0) {
      const oldFileItem: FileItem = this.uploaderTemp.queue[length - 1];

      this.fileName = oldFileItem.file.name;

      // var uniq = (new Date()).getTime();
      // this.supplierIdForFile = 147;
      var newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
      // var newFilename = oldFileItem.file.name.split('.')[0] + '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
      var filesize = oldFileItem.file.size;


      /* Unsupported format file check Starts */
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

        const fileURL = URL.createObjectURL(input.files[0]);

        if (categoryname == 'r1') {
          if (input.files && input.files[0]) {
            this.r1url = fileURL;
            this.r1section = true;

            this.r1fileName = oldFileItem.file.name;
            this.r1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatreg = false;
          if (input.files.length == 0) {
            this.r1FileLoaded = false;
            // this.firstFormGroup.get('regfiletempCtrl').setErrors({ invalid: true });
            this.isRegFileSelected = false;

            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.RegFile_name = this.fileName;
            console.log(this.RegFile_name);
            this.isRegFile_name = true;
            this.r1FileLoaded = true;
            this.isRegFileSelected = true;

            console.log('Length is one');
          }
        } else if (categoryname == 'v1') {
          if (input.files && input.files[0]) {
            this.v1url = fileURL;
            this.v1section = true;

            this.v1fileName = oldFileItem.file.name;
            this.v1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatvat = false;
          if (input.files.length == 0) {
            this.v1FileLoaded = false;
            // this.firstFormGroup.get('vatfiletempCtrl').setErrors({ invalid: true });
            this.isVatFileSelected = false;

            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.VatFile_name = this.fileName;
            this.isVatFile_name = true;

            this.v1FileLoaded = true;
            this.isVatFileSelected = true;

            console.log('Length is one');
          }
        } else if (categoryname == 'g1') {
          if (input.files && input.files[0]) {
            this.g1url = fileURL;
            this.g1section = true;

            this.g1fileName = oldFileItem.file.name;
            this.g1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatgosi = false;
          if (input.files.length == 0) {
            this.g1FileLoaded = false;
            // this.firstFormGroup.get('gosifiletempCtrl').setErrors({ invalid: true });
            this.isGosiFileSelected = false;

            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.GosiFile_name = this.fileName;
            this.isGosiFile_name = true;

            this.g1FileLoaded = true;
            this.isGosiFileSelected = true;

            console.log('Length is one');
          }
        } else if (categoryname == 's1') {
          if (input.files && input.files[0]) {
            this.s1url = fileURL;
            this.s1section = true;

            this.s1fileName = oldFileItem.file.name;
            this.s1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatsaudi = false;
          if (input.files.length == 0) {
            this.s1FileLoaded = false;
            // this.firstFormGroup.get('saudifiletempCtrl').setErrors({ invalid: true });
            this.isSaudiFileSelected = false;

            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.SaudiFile_name = this.fileName;
            this.isSaudiFile_name = true;

            this.s1FileLoaded = true;
            this.isSaudiFileSelected = true;

            console.log('Length is one');
          }
        } else if (categoryname == 'z1') {
          if (input.files && input.files[0]) {
            this.z1url = fileURL;
            this.z1section = true;

            this.z1fileName = oldFileItem.file.name;
            this.z1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatzakath = false;
          if (input.files.length == 0) {
            this.z1FileLoaded = false;
            // this.firstFormGroup.get('zakathfiletempCtrl').setErrors({ invalid: true });
            this.isZakathFileSelected = false;

            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.ZakathFile_name = this.fileName;
            this.isZakathFile_name = true;

            this.z1FileLoaded = true;
            this.isZakathFileSelected = true;

            console.log('Length is one');
          }
        } else if (categoryname == 'a1') {
          if (input.files && input.files[0]) {
            this.a1url = fileURL;
            this.a1section = true;

            this.a1fileName = oldFileItem.file.name;
            this.a1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatassociation = false;
          if (input.files.length == 0) {
            this.a1FileLoaded = false;
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.AssociationFile_name = this.fileName;
            this.isAssociationFile_name = true;

            this.a1FileLoaded = true;
            console.log('Length is one');
          }
        } else if (categoryname == 'm1') {
          if (input.files && input.files[0]) {
            this.OrgaizationChartFile_name = this.fileName;
            this.isOrgaizationChartFile_name = true;

            this.m1url = fileURL;
            this.m1section = true;

            this.m1fileName = oldFileItem.file.name;
            this.m1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatmanorg = false;
        } else if (categoryname == 'a2') {
          if (input.files && input.files[0]) {
            this.AdditionalFile_name = this.fileName;
            this.isAdditionalFile_name = true;

            this.a2url = fileURL;
            this.a2section = true;

            this.a2fileName = oldFileItem.file.name;
            this.a2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatadditional = false;
        } else if (categoryname == 'a3') {
          if (input.files && input.files[0]) {
            this.AdditionalFile2_name = this.fileName;
            this.isAdditionalFile2_name = true;

            this.a3url = fileURL;
            this.a3section = true;

            this.a3fileName = oldFileItem.file.name;
            this.a3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatadditional2 = false;
        } else if (categoryname == 'a4') {
          if (input.files && input.files[0]) {
            this.AdditionalFile3_name = this.fileName;
            this.isAdditionalFile3_name = true;

            this.a4url = fileURL;
            this.a4section = true;

            this.a4fileName = oldFileItem.file.name;
            this.a4fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatadditional3 = false;
        } else if (categoryname == 'a5') {
          if (input.files && input.files[0]) {
            this.AdditionalFile4_name = this.fileName;
            this.isAdditionalFile4_name = true;

            this.a5url = fileURL;
            this.a5section = true;

            this.a5fileName = oldFileItem.file.name;
            this.a5fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatadditional4 = false;
        } else if (categoryname == 'a6') {
          if (input.files && input.files[0]) {
            this.AdditionalFile5_name = this.fileName;
            this.isAdditionalFile5_name = true;

            this.a6url = fileURL;
            this.a6section = true;

            this.a6fileName = oldFileItem.file.name;
            this.a6fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatadditional5 = false;
        } else if (categoryname == 'f1') {
          if (input.files && input.files[0]) {
            this.FinancialYear1File_name = this.fileName;
            this.isFinancialYear1File_name = true;

            this.f1url = fileURL;
            this.f1section = true;

            this.f1fileName = oldFileItem.file.name;
            this.f1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatfin1 = false;
        } else if (categoryname == 'f2') {
          if (input.files && input.files[0]) {
            this.FinancialYear2File_name = this.fileName;
            this.isFinancialYear2File_name = true;

            this.f2url = fileURL;
            this.f2section = true;

            this.f2fileName = oldFileItem.file.name;
            this.f2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatfin2 = false;
        } else if (categoryname == 'f3') {
          if (input.files && input.files[0]) {
            this.FinancialYear3File_name = this.fileName;
            this.isFinancialYear3File_name = true;

            this.f3url = fileURL;
            this.f3section = true;

            this.f3fileName = oldFileItem.file.name;
            this.f3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatfin3 = false;
        } else if (categoryname == 'e1') {
          if (input.files && input.files[0]) {
            this.e1url = fileURL;
            this.e1section = true;

            this.e1fileName = oldFileItem.file.name;
            this.e1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatorgdesign = false;
          if (input.files.length == 0) {
            this.e1FileLoaded = false;
            // this.secondFormGroup.get('designtempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isDesignnCapCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.DesignFile_name = this.fileName;

            this.isDesignFile_name = true;

            this.e1FileLoaded = true;
            console.log('Length is one');
            this.isDesignnCapCtrlSelected = true;

          }
        } else if (categoryname == 'e2') {
          if (input.files && input.files[0]) {
            this.e2url = fileURL;
            this.e2section = true;

            this.e2fileName = oldFileItem.file.name;
            this.e2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatoutorg = false;
          if (input.files.length == 0) {
            this.e2FileLoaded = false;
            // this.secondFormGroup.get('finishtempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isFinishProdCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.FinishFile_name = this.fileName;
            this.isFinishFile_name = true;

            this.e2FileLoaded = true;
            console.log('Length is one');
            this.isFinishProdCtrlSelected = true;

          }
        } else if (categoryname == 'e3') {
          if (input.files && input.files[0]) {
            this.e3url = fileURL;
            this.e3section = true;

            this.e3fileName = oldFileItem.file.name;
            this.e3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatthirdparty = false;
          if (input.files.length == 0) {
            this.e3FileLoaded = false;
            // this.secondFormGroup.get('registeredtempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isRegisteredOrgCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.RegisteredFile_name = this.fileName;
            this.isRegisteredFile_name = true;

            this.e3FileLoaded = true;
            console.log('Length is one');
            this.isRegisteredOrgCtrlSelected = true;

          }
        } else if (categoryname == 'e4') {
          if (input.files && input.files[0]) {
            this.BusinessReferencesFile_name = this.fileName;
            this.isBusinessReferencesFile_name = true;

            this.e4url = fileURL;
            this.e4section = true;

            this.e4fileName = oldFileItem.file.name;
            this.e4fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatbusrefr = false;

        } else if (categoryname == 'e5') {
          if (input.files && input.files[0]) {
            this.e5url = fileURL;
            this.e5section = true;

            this.e5fileName = oldFileItem.file.name;
            this.e5fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormattrainInfo = false;
          if (input.files.length == 0) {
            this.e5FileLoaded = false;
            // this.secondFormGroup.get('isFormattrainInfo').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isCompliance1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.ComplianceFile_name = this.fileName;
            this.isComplianceFile_name = true;


            this.e5FileLoaded = true;
            console.log('Length is one');
            this.isCompliance1CtrlSelected = true;

          }
        } else if (categoryname == 'h1') {
          if (input.files && input.files[0]) {
            this.h1url = fileURL;
            this.h1section = true;

            this.h1fileName = oldFileItem.file.name;
            this.h1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormathse = false;
          if (input.files.length == 0) {
            this.h1FileLoaded = false;
            // this.secondFormGroup.get('hsetempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isHse1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.HseFile_name = this.fileName;
            this.isHseFile_name = true;

            this.h1FileLoaded = true;
            console.log('Length is one');
            this.isHse1CtrlSelected = true;

          }
        } else if (categoryname == 'h2') {
          if (input.files && input.files[0]) {
            this.h2url = fileURL;
            this.h2section = true;

            this.h2fileName = oldFileItem.file.name;
            this.h2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormathse2 = false;
          if (input.files.length == 0) {
            this.h2FileLoaded = false;
            // this.secondFormGroup.get('docutempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isDocuHseCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.DocuFile_name = this.fileName;
            this.isDocuFile_name = true;

            this.h2FileLoaded = true;
            console.log('Length is one');
            this.isDocuHseCtrlSelected = true;

          }
        } else if (categoryname == 'h3') {
          if (input.files && input.files[0]) {
            this.h3url = fileURL;
            this.h3section = true;

            this.h3fileName = oldFileItem.file.name;
            this.h3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormathse3 = false;
          if (input.files.length == 0) {
            this.h3FileLoaded = false;
            // this.secondFormGroup.get('isohealthtempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isIsohealthCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.ISOHealthFile_name = this.fileName;
            this.isISOHealthFile_name = true;

            this.h3FileLoaded = true;
            console.log('Length is one');
            this.isIsohealthCtrlSelected = true;

          }
        } else if (categoryname == 'h4') {
          if (input.files && input.files[0]) {
            this.h4url = fileURL;
            this.h4section = true;

            this.h4fileName = oldFileItem.file.name;
            this.h4fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormathse4 = false;
          if (input.files.length == 0) {
            this.h4FileLoaded = false;
            // this.secondFormGroup.get('envttempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isEnvtMgt1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.EnvtFile_name = this.fileName;
            this.isEnvtFile_name = true;

            this.h4FileLoaded = true;
            console.log('Length is one');
            this.isEnvtMgt1CtrlSelected = true;

          }
        } else if (categoryname == 'h6') {
          if (input.files && input.files[0]) {
            this.h6url = fileURL;
            this.h6section = true;

            this.h6fileName = oldFileItem.file.name;
            this.h6fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormathse6 = false;
          if (input.files.length == 0) {
            this.h6FileLoaded = false;
            // this.secondFormGroup.get('envttempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isEnvtMgt1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.EnvtFile_name = this.fileName;
            this.isEnvtFile_name = true;

            this.h6FileLoaded = true;
            console.log('Length is one');
            this.isEnvtMgt1CtrlSelected = true;

          }
        } else if (categoryname == 'q1') {
          if (input.files && input.files[0]) {
            this.q1url = fileURL;
            this.q1section = true;

            this.q1fileName = oldFileItem.file.name;
            this.q1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatquality1 = false;
          if (input.files.length == 0) {
            this.q1FileLoaded = false;
            // this.secondFormGroup.get('qualityPolicytempCtrl').setErrors({ invalid: true });

            this.isQualityPolicy1CtrlSelected = false;
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.QualityPolicyFile_name = this.fileName;
            this.isQualityPolicyFile_name = true;

            this.q1FileLoaded = true;
            this.isQualityPolicy1CtrlSelected = true;
            console.log('Length is one');
          }
        } else if (categoryname == 'q2') {
          if (input.files && input.files[0]) {
            this.q2url = fileURL;
            this.q2section = true;

            this.q2fileName = oldFileItem.file.name;
            this.q2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatquality2 = false;
          if (input.files.length == 0) {
            this.q2FileLoaded = false;
            // this.secondFormGroup.get('qualityMgttempCtrl').setErrors({ invalid: true });

            console.log('Length is zero');
            this.isQualityMgtCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.QualityMgtFile_name = this.fileName;
            this.isQualityMgtFile_name = true;

            this.q2FileLoaded = true;
            console.log('Length is one');
            this.isQualityMgtCtrlSelected = true;

          }
        } else if (categoryname == 'q3') {
          if (input.files && input.files[0]) {
            this.q3url = fileURL;
            this.q3section = true;

            this.q3fileName = oldFileItem.file.name;
            this.q3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatquality3 = false;
          if (input.files.length == 0) {
            this.q3FileLoaded = false;
            // this.secondFormGroup.get('qualityMgtIsotempCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isQualityMgtIsoCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.QualityMgtISOFile_name = this.fileName;
            this.isQualityMgtISOFile_name = true;

            this.q3FileLoaded = true;
            console.log('Length is one');
            this.isQualityMgtIsoCtrlSelected = true;

          }
        } else if (categoryname == 'b1') {
          if (input.files && input.files[0]) {
            this.b1url = fileURL;
            this.b1section = true;

            this.b1fileName = oldFileItem.file.name;
            this.b1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatbank = false;
          if (input.files.length == 0) {
            this.b1FileLoaded = false;
            // this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.BankFile_name = this.fileName;
            this.isBankFile_name = true;

            this.b1FileLoaded = true;
            console.log('Length is one');
          }
        } else if (categoryname == 'b2') {
          if (input.files && input.files[0]) {
            this.b2url = fileURL;
            this.b2section = true;

            this.b2fileName = oldFileItem.file.name;
            this.b2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatbankletterhead = false;
          if (input.files.length == 0) {
            this.b2FileLoaded = false;
            // this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.BankLetterHeadFile_name = this.fileName;
            this.isBankLetterHeadFile_name = true;

            this.b2FileLoaded = true;
            console.log('Length is one');
          }
        }
      } else {
        if (categoryname == 'r1') {
          this.isFormatreg = true;

          this.r1FileLoaded = false;
          console.log('File is not supported, so its false');

        } else if (categoryname == 'v1') {
          this.isFormatvat = true;
        } else if (categoryname == 'g1') {
          this.isFormatgosi = true;
        } else if (categoryname == 's1') {
          this.isFormatsaudi = true;
        } else if (categoryname == 'z1') {
          this.isFormatzakath = true;
        } else if (categoryname == 'a1') {
          this.isFormatassociation = true;
        } else if (categoryname == 'm1') {
          this.isFormatmanorg = true;
        } else if (categoryname == 'a2') {
          this.isFormatadditional = true;
        } else if (categoryname == 'a3') {
          this.isFormatadditional2 = true;
        } else if (categoryname == 'a4') {
          this.isFormatadditional3 = true;
        } else if (categoryname == 'a5') {
          this.isFormatadditional4 = true;
        } else if (categoryname == 'a6') {
          this.isFormatadditional5 = true;
        } else if (categoryname == 'f1') {
          this.isFormatfin1 = true;
        } else if (categoryname == 'f2') {
          this.isFormatfin2 = true;
        } else if (categoryname == 'f3') {
          this.isFormatfin3 = true;
        } else if (categoryname == 'e1') {
          this.isFormatorgdesign = true;

          this.e1FileLoaded = false;
          console.log('File is not supported, so its false');

        } else if (categoryname == 'e2') {
          this.isFormatoutorg = true;

          this.e2FileLoaded = false;
          console.log('File is not supported, so its false');

        } else if (categoryname == 'e3') {
          this.isFormatthirdparty = true;

          this.e3FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'e4') {
          this.isFormatbusrefr = true;

          this.e4FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'e5') {
          this.isFormattrainInfo = true;

          this.e5FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h1') {
          this.isFormathse = true;

          this.h1FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h2') {
          this.isFormathse2 = true;

          this.h2FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h3') {
          this.isFormathse3 = true;

          this.h3FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h4') {
          this.isFormathse4 = true;

          this.h4FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h6') {
          this.isFormathse4 = true;

          this.h6FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'q1') {
          this.isFormatquality1 = true;

          this.q1FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'q2') {
          this.isFormatquality2 = true;

          this.q2FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'q3') {
          this.isFormatquality3 = true;

          this.q3FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'b1') {
          this.isFormatbank = true;
          this.b1FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'b2') {
          this.isFormatbankletterhead = true;
          this.b2FileLoaded = false;
          console.log('File is not supported, so its false');
        }
      }
      /* Unsupported format file check Ends */


      /* Change for empty file */
      /**/
      console.log('File size  is : ' + filesize);
      if (filesize > 5000000) {
        if (categoryname == 'r1') {
          this.ismaxreg = true;
        } else if (categoryname == 'v1') {
          this.ismaxvat = true;
        } else if (categoryname == 'g1') {
          this.ismaxgosi = true;
        } else if (categoryname == 's1') {
          this.ismaxsaudi = true;
        } else if (categoryname == 'z1') {
          this.ismaxzakath = true;
        } else if (categoryname == 'a1') {
          this.ismaxassociation = true;
        } else if (categoryname == 'm1') {
          this.ismaxmanorg = true;
        } else if (categoryname == 'a2') {
          this.ismaxadditional = true;
        } else if (categoryname == 'a3') {
          this.ismaxadditional2 = true;
        } else if (categoryname == 'a4') {
          this.ismaxadditional3 = true;
        } else if (categoryname == 'a5') {
          this.ismaxadditional4 = true;
        } else if (categoryname == 'a6') {
          this.ismaxadditional5 = true;
        } else if (categoryname == 'f1') {
          this.ismaxfin1 = true;
        } else if (categoryname == 'f2') {
          this.ismaxfin2 = true;
        } else if (categoryname == 'f3') {
          this.ismaxfin3 = true;
        } else if (categoryname == 'e1') {
          this.ismaxorgdesign = true;
        } else if (categoryname == 'e2') {
          this.ismaxoutorg = true;
        } else if (categoryname == 'e3') {
          this.ismaxthirdparty = true;
        } else if (categoryname == 'e4') {
          this.ismaxbusrefr = true;
        } else if (categoryname == 'e5') {
          this.ismaxtrainInfo = true;
        } else if (categoryname == 'h1') {
          this.ismaxhse = true;
        } else if (categoryname == 'h2') {
          this.ismaxhse2 = true;
        } else if (categoryname == 'h3') {
          this.ismaxhse3 = true;
        } else if (categoryname == 'h4') {
          this.ismaxhse4 = true;
        } else if (categoryname == 'h6') {
          this.ismaxhse6 = true;
          // Remove filename form filename array
          const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);
          // Remove filename form file[] array
          // Delete the item from fileNames list
          this.selectedFileName.splice(index, 1);
          // delete file from FileList
          this.selectedFiles.splice(index, 1);
        } else if (categoryname == 'q1') {
          this.ismaxquality1 = true;
        } else if (categoryname == 'q2') {
          this.ismaxquality2 = true;
        } else if (categoryname == 'q3') {
          this.ismaxquality3 = true;
        } else if (categoryname == 'b1') {
          this.ismaxbank = true;
        } else if (categoryname == 'b2') {
          this.ismaxbankletterhead = true;
        }
      } else {
        if (categoryname == 'r1') {
          this.ismaxreg = false;
        } else if (categoryname == 'v1') {
          this.ismaxvat = false;
        } else if (categoryname == 'g1') {
          this.ismaxgosi = false;
        } else if (categoryname == 's1') {
          this.ismaxsaudi = false;
        } else if (categoryname == 'z1') {
          this.ismaxzakath = false;
        } else if (categoryname == 'a1') {
          this.ismaxzakath = false;
        } else if (categoryname == 'm1') {
          this.ismaxmanorg = false;
        } else if (categoryname == 'a2') {
          this.ismaxadditional = false;
        } else if (categoryname == 'a3') {
          this.ismaxadditional2 = false;
        } else if (categoryname == 'a4') {
          this.ismaxadditional3 = false;
        } else if (categoryname == 'a5') {
          this.ismaxadditional4 = false;
        } else if (categoryname == 'a6') {
          this.ismaxadditional5 = false;
        } else if (categoryname == 'f1') {
          this.ismaxfin1 = false;
        } else if (categoryname == 'f2') {
          this.ismaxfin2 = false;
        } else if (categoryname == 'f3') {
          this.ismaxfin3 = false;
        } else if (categoryname == 'e1') {
          this.ismaxorgdesign = false;
        } else if (categoryname == 'e2') {
          this.ismaxoutorg = false;
        } else if (categoryname == 'e3') {
          this.ismaxthirdparty = false;
        } else if (categoryname == 'e4') {
          this.ismaxbusrefr = false;
        } else if (categoryname == 'e5') {
          this.ismaxtrainInfo = false;
        } else if (categoryname == 'h1') {
          this.ismaxhse = false;
        } else if (categoryname == 'h2') {
          this.ismaxhse2 = false;
        } else if (categoryname == 'h3') {
          this.ismaxhse3 = false;
        } else if (categoryname == 'h4') {
          this.ismaxhse4 = false;
        } else if (categoryname == 'h6') {
          this.ismaxhse6 = false;
        } else if (categoryname == 'q1') {
          this.ismaxquality1 = false;
        } else if (categoryname == 'q2') {
          this.ismaxquality2 = false;
        } else if (categoryname == 'q3') {
          this.ismaxquality3 = false;
        } else if (categoryname == 'b1') {
          this.ismaxbank = false;
        } else if (categoryname == 'b2') {
          this.ismaxbankletterhead = false;
        }

      }

      if (filesize == 0) {
        if (categoryname == 'r1') {
          this.isemptyreg = true;
        } else if (categoryname == 'v1') {
          this.isemptyvat = true;
        } else if (categoryname == 'g1') {
          this.isemptygosi = true;
        } else if (categoryname == 's1') {
          this.isemptysaudi = true;
        } else if (categoryname == 'z1') {
          this.isemptyzakath = true;
        } else if (categoryname == 'a1') {
          this.isemptyassociation = true;
        } else if (categoryname == 'm1') {
          this.isemptymanorg = true;
        } else if (categoryname == 'a2') {
          this.isemptyadditional = true;
        } else if (categoryname == 'a3') {
          this.isemptyadditional2 = true;
        } else if (categoryname == 'a4') {
          this.isemptyadditional3 = true;
        } else if (categoryname == 'a5') {
          this.isemptyadditional4 = true;
        } else if (categoryname == 'a6') {
          this.isemptyadditional5 = true;
        } else if (categoryname == 'f1') {
          this.isemptyfin1 = true;
        } else if (categoryname == 'f2') {
          this.isemptyfin2 = true;
        } else if (categoryname == 'f3') {
          this.isemptyfin3 = true;
        } else if (categoryname == 'e1') {
          this.isemptyorgdesign = true;
        } else if (categoryname == 'e2') {
          this.isemptyoutorg = true;
        } else if (categoryname == 'e3') {
          this.isemptythirdparty = true;
        } else if (categoryname == 'e4') {
          this.isemptybusrefr = true;
        } else if (categoryname == 'e5') {
          this.isemptytrainInfo = true;
        } else if (categoryname == 'h1') {
          this.isemptyhse = true;
        } else if (categoryname == 'h2') {
          this.isemptyhse2 = true;
        } else if (categoryname == 'h3') {
          this.isemptyhse3 = true;
        } else if (categoryname == 'h4') {
          this.isemptyhse4 = true;
        } else if (categoryname == 'h6') {
          // this.StatisticFile_name = files[i].name;
          this.isemptyhse6 = true;
          // Remove filename form filename array
          const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);
          // Remove filename form file[] array
          // Delete the item from fileNames list
          this.selectedFileName.splice(index, 1);
          // delete file from FileList
          this.selectedFiles.splice(index, 1);
        } else if (categoryname == 'q1') {
          this.isemptyquality1 = true;
        } else if (categoryname == 'q2') {
          this.isemptyquality2 = true;
        } else if (categoryname == 'q3') {
          this.isemptyquality3 = true;
        } else if (categoryname == 'b1') {
          this.isemptybank = true;
        } else if (categoryname == 'b2') {
          this.isemptybankletterhead = true;
        }
      } else {
        if (categoryname == 'r1') {
          this.isemptyreg = false;
          this.isregadded = true;
          this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();

        } else if (categoryname == 'v1') {
          this.isemptyvat = false;
          this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'g1') {
          this.isemptygosi = false;
          this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
        } else if (categoryname == 's1') {
          this.isemptysaudi = false;
          this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
        } else if (categoryname == 'z1') {
          this.isemptyzakath = false;
          this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'a1') {
          this.isemptyassociation = false;
          this.firstFormGroup.get('associationfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('associationfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'm1') {
          this.isemptymanorg = false;
        } else if (categoryname == 'a2') {
          this.isemptyadditional = false;
        } else if (categoryname == 'a3') {
          this.isemptyadditional2 = false;
        } else if (categoryname == 'a4') {
          this.isemptyadditional3 = false;
        } else if (categoryname == 'a5') {
          this.isemptyadditional4 = false;
        } else if (categoryname == 'a6') {
          this.isemptyadditional5 = false;
        } else if (categoryname == 'f1') {
          this.isemptyfin1 = false;
        } else if (categoryname == 'f2') {
          this.isemptyfin2 = false;
        } else if (categoryname == 'f3') {
          this.isemptyfin3 = false;
        } else if (categoryname == 'e1') {
          this.isemptyorgdesign = false;
          this.secondFormGroup.get('designtempCtrl').markAsUntouched();
          this.secondFormGroup.get('designoriCtrl').markAsUntouched();
        } else if (categoryname == 'e2') {
          this.isemptyoutorg = false;
          this.secondFormGroup.get('finishtempCtrl').markAsUntouched();
          this.secondFormGroup.get('finishoriCtrl').markAsUntouched();
        } else if (categoryname == 'e3') {
          this.isemptythirdparty = false;
          this.secondFormGroup.get('registeredtempCtrl').markAsUntouched();
          this.secondFormGroup.get('registeredoriCtrl').markAsUntouched();
        } else if (categoryname == 'e4') {
          this.isemptybusrefr = false;
        } else if (categoryname == 'e5') {
          this.isemptytrainInfo = false;
          this.secondFormGroup.get('compliancetempCtrl').markAsUntouched();
          this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
        } else if (categoryname == 'h1') {
          this.isemptyhse = false;
          this.secondFormGroup.get('hsetempCtrl').markAsUntouched();
          this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
        } else if (categoryname == 'h2') {
          this.isemptyhse2 = false;
          this.secondFormGroup.get('docutempCtrl').markAsUntouched();
          this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
        } else if (categoryname == 'h3') {
          this.isemptyhse3 = false;
          this.secondFormGroup.get('isohealthtempCtrl').markAsUntouched();
          this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
        } else if (categoryname == 'h4') {
          this.isemptyhse4 = false;
          this.secondFormGroup.get('envttempCtrl').markAsUntouched();
          this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
        } else if (categoryname == 'h6') {
          this.isemptyhse6 = false;
          this.secondFormGroup.get('envttempCtrl').markAsUntouched();
          this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
        } else if (categoryname == 'q1') {
          this.isemptyquality1 = false;
          this.secondFormGroup.get('qualityPolicytempCtrl').markAsUntouched();
          this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
        } else if (categoryname == 'q2') {
          this.isemptyquality2 = false;
          this.secondFormGroup.get('qualityMgttempCtrl').markAsUntouched();
          this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
        } else if (categoryname == 'q3') {
          this.isemptyquality3 = false;
          this.secondFormGroup.get('qualityMgtIsotempCtrl').markAsUntouched();
          this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
        } else if (categoryname == 'b1') {
          this.isemptybank = false;
          this.isbankadded = true;
          this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'b2') {
          this.isemptybankletterhead = false;
          this.isbankletterheadadded = true;
          this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsUntouched();
        }

      }
      /** End of empty file change */

      if (!oldFileItem.isReady) {
        if (categoryname == 'r1') {

          this.isFileRequired = true;

        } else if (categoryname == 'v1') {
          this.isFileRequired = true;
        } else if (categoryname == 'g1') {
          // this.isemptygosi = true;
        } else if (categoryname == 's1') {
          // this.isemptysaudi = true;
        }
      } else {
        if (categoryname == 'r1') {
          this.isFileRequired = true;
          this.isFileAdded = true;
          // this.isemptyreg = false;
        } else if (categoryname == 'v1') {
          // this.isemptyvat = false;
        } else if (categoryname == 'g1') {
          // this.isemptygosi = false;
        } else if (categoryname == 's1') {
          // this.isemptysaudi = false;
        }
      }
      const newFile: File = new File([this.uploaderTemp.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
      const newFileItem = new FileItem(this.uploaderTemp, newFile, null);
      this.uploaderTemp.queue[length - 1] = newFileItem;

      var searchTag = "_" + categoryname;

      console.log('File size  is : ' + filesize);
      if (filesize > 5000000) {
        if (categoryname == 'r1') {
          this.ismaxreg = true;


          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }



          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'v1') {
          this.ismaxvat = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'g1') {
          this.ismaxgosi = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 's1') {
          this.ismaxsaudi = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'z1') {
          this.ismaxzakath = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a1') {
          this.ismaxassociation = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'm1') {
          this.ismaxmanorg = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a2') {
          this.ismaxadditional = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a3') {
          this.ismaxadditional2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a4') {
          this.ismaxadditional3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a5') {
          this.ismaxadditional4 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a6') {
          this.ismaxadditional5 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'f1') {
          this.ismaxfin1 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'f2') {
          this.ismaxfin2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'f3') {
          this.ismaxfin3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e1') {
          this.ismaxorgdesign = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e2') {
          this.ismaxoutorg = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e3') {
          this.ismaxthirdparty = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e4') {
          this.ismaxbusrefr = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e5') {
          this.ismaxtrainInfo = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h1') {
          this.ismaxhse = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h2') {
          this.ismaxhse2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h3') {
          this.ismaxhse3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h4') {
          this.ismaxhse4 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

        } else if (categoryname == 'h6') {
          this.ismaxhse6 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

        } else if (categoryname == 'q1') {
          this.ismaxquality1 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'q2') {
          this.ismaxquality2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'q3') {
          this.ismaxquality3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'b1') {
          this.ismaxbank = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'b2') {
          this.ismaxbankletterhead = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        }
      } else {
        if (categoryname == 'r1') {
          this.ismaxreg = false;
        } else if (categoryname == 'v1') {
          this.ismaxvat = false;
        } else if (categoryname == 'g1') {
          this.ismaxgosi = false;
        } else if (categoryname == 's1') {
          this.ismaxsaudi = false;
        } else if (categoryname == 'z1') {
          this.ismaxzakath = false;
        } else if (categoryname == 'a1') {
          this.ismaxzakath = false;
        } else if (categoryname == 'm1') {
          this.ismaxmanorg = false;
        } else if (categoryname == 'a2') {
          this.ismaxadditional = false;
        } else if (categoryname == 'a3') {
          this.ismaxadditional2 = false;
        } else if (categoryname == 'a4') {
          this.ismaxadditional3 = false;
        } else if (categoryname == 'a5') {
          this.ismaxadditional4 = false;
        } else if (categoryname == 'a6') {
          this.ismaxadditional5 = false;
        } else if (categoryname == 'f1') {
          this.ismaxfin1 = false;
        } else if (categoryname == 'f2') {
          this.ismaxfin2 = false;
        } else if (categoryname == 'f3') {
          this.ismaxfin3 = false;
        } else if (categoryname == 'e1') {
          this.ismaxorgdesign = false;
        } else if (categoryname == 'e2') {
          this.ismaxoutorg = false;
        } else if (categoryname == 'e3') {
          this.ismaxthirdparty = false;
        } else if (categoryname == 'e4') {
          this.ismaxbusrefr = false;
        } else if (categoryname == 'e5') {
          this.ismaxtrainInfo = false;
        } else if (categoryname == 'h1') {
          this.ismaxhse = false;
        } else if (categoryname == 'h2') {
          this.ismaxhse2 = false;
        } else if (categoryname == 'h3') {
          this.ismaxhse3 = false;
        } else if (categoryname == 'h4') {
          this.ismaxhse4 = false;
        } else if (categoryname == 'h6') {
          this.ismaxhse6 = false;
        } else if (categoryname == 'q1') {
          this.ismaxquality1 = false;
        } else if (categoryname == 'q2') {
          this.ismaxquality2 = false;
        } else if (categoryname == 'q3') {
          this.ismaxquality3 = false;
        } else if (categoryname == 'b1') {
          this.ismaxbank = false;
        } else if (categoryname == 'b2') {
          this.ismaxbankletterhead = false;
        }

      }
    }
  }

  removeFile(categoryname: string, input) {
    // const oldFileItem: FileItem = this.uploaderTemp.queue[length - 1];
    var searchTag = "_" + categoryname;
    // if (categoryname == 'r1') {
    for (const fileItem of this.uploaderTemp.queue) {
      console.log('file items : ' + fileItem.file.name);
      if (fileItem.file.name.includes(searchTag)) {
        this.uploaderTemp.removeFromQueue(fileItem);


        if (categoryname == 'r1') {
          this.RegFile_name = "";
          this.isRegFile_name = false;
        } else if (categoryname == 'v1') {
          this.VatFile_name = "";
          this.isVatFile_name = false;

        } else if (categoryname == 'g1') {
          this.GosiFile_name = "";
          this.isGosiFile_name = false;

        } else if (categoryname == 's1') {
          this.SaudiFile_name = "";
          this.isSaudiFile_name = false;

        } else if (categoryname == 'z1') {
          this.ZakathFile_name = "";
          this.isZakathFile_name = false;

        } else if (categoryname == 'a1') {
          this.AssociationFile_name = "";
          this.isAssociationFile_name = false;

        } else if (categoryname == 'm1') {
          this.OrgaizationChartFile_name = "";
          this.isOrgaizationChartFile_name = false;

        } else if (categoryname == 'a2') {
          this.AdditionalFile_name = "";
          this.isAdditionalFile_name = false;

        } else if (categoryname == 'a3') {
          this.AdditionalFile2_name = "";
          this.isAdditionalFile2_name = false;

        } else if (categoryname == 'a4') {
          this.AdditionalFile3_name = "";
          this.isAdditionalFile3_name = false;

        } else if (categoryname == 'a5') {
          this.AdditionalFile4_name = "";
          this.isAdditionalFile4_name = false;

        } else if (categoryname == 'a6') {
          this.AdditionalFile5_name = "";
          this.isAdditionalFile5_name = false;

        } else if (categoryname == 'f1') {
          this.FinancialYear1File_name = "";
          this.isFinancialYear1File_name = false;

        } else if (categoryname == 'f2') {
          this.FinancialYear2File_name = "";
          this.isFinancialYear2File_name = false;


        } else if (categoryname == 'f3') {
          this.FinancialYear3File_name = "";
          this.isFinancialYear3File_name = false;


        } else if (categoryname == 'e1') {
          this.DesignFile_name = "";
          this.isDesignFile_name = false;

        } else if (categoryname == 'e2') {
          this.FinishFile_name = "";
          this.isFinishFile_name = false;

        } else if (categoryname == 'e3') {
          this.RegisteredFile_name = "";
          this.isRegisteredFile_name = false;

        } else if (categoryname == 'e4') {
          this.BusinessReferencesFile_name = "";
          this.isBusinessReferencesFile_name = false;

        } else if (categoryname == 'e5') {
          this.ComplianceFile_name = "";
          this.isComplianceFile_name = false;

        } else if (categoryname == 'h1') {
          this.HseFile_name = "";
          this.isHseFile_name = false;

        } else if (categoryname == 'h2') {
          this.DocuFile_name = "";
          this.isDocuFile_name = false;

        } else if (categoryname == 'h3') {
          this.ISOHealthFile_name = "";
          this.isISOHealthFile_name = false;

        } else if (categoryname == 'h4') {
          this.EnvtFile_name = "";
          this.isEnvtFile_name = false;

        } else if (categoryname == 'h6') {
          this.StatisticFile_name = "";
          this.isStatisticFile_name = false;

        } else if (categoryname == 'q1') {
          this.QualityPolicyFile_name = "";
          this.isQualityPolicyFile_name = false;

        } else if (categoryname == 'q2') {
          this.QualityMgtFile_name = "";
          this.isQualityMgtFile_name = false;

        } else if (categoryname == 'q3') {
          this.QualityMgtISOFile_name = "";
          this.isQualityMgtISOFile_name = false;

        } else if (categoryname == 'b1') {
          this.BankFile_name = "";
          this.isBankFile_name = false;

        } else if (categoryname == 'b2') {
          this.BankLetterHeadFile_name = "";
          this.isBankLetterHeadFile_name = false;

        }
      }
    }

    console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
    // }

  }


  uploadFilesSubmitTemp(files: FileList, categoryname: string) {
    if (this.counting == 0) {
      this.selectedFiles = [];
    }
    if (files.length == 0) {
      console.log('No file is attached - no file length');

      // console.log('file items : ' + files[i].name);
      // if (files[i].name.includes(searchTags)) {
      //   // this.uploaderTemp.removeFromQueue(fileItem);
      //   delete this.selectedFiles[i];
      //   console.log('file deleted');
      //   console.log('New length of the queue: ' + this.selectedFiles.length);

      // }

      if (categoryname == 'r1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('r1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.RegFile_name = "";
        this.isRegFileSelected = false;
        // this.isRegFile_name = false;


      } else if (categoryname == 'v1') {

        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('v1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }
        this.VatFile_name = "";
        this.isVatFileSelected = false;
        // this.isVatFile_name = false;


      } else if (categoryname == 'g1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('g1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.GosiFile_name = "";
        this.isGosiFileSelected = false;
        // this.isGosiFile_name = false;



      } else if (categoryname == 's1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('s1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.SaudiFile_name = "";
        this.isSaudiFileSelected = false;
        // this.isSaudiFile_name = false;



      } else if (categoryname == 'z1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('z1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.ZakathFile_name = "";
        this.isZakathFileSelected = false;
        // this.isZakathFile_name = false;


      } else if (categoryname == 'a1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AssociationFile_name = "";
        // this.isAssociationFile_name = false;


      } else if (categoryname == 'm1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('m1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.OrgaizationChartFile_name = "";
        // this.isOrgaizationChartFile_name = false;


      } else if (categoryname == 'a2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile_name = "";
        // this.isAdditionalFile_name = false;


      } else if (categoryname == 'a3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile2_name = "";
        // this.isAdditionalFile2_name = false;


      } else if (categoryname == 'a4') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a4')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile3_name = "";
        // this.isAdditionalFile3_name = false;


      } else if (categoryname == 'a5') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a5')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile4_name = "";
        // this.isAdditionalFile4_name = false;


      } else if (categoryname == 'a6') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a6')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile5_name = "";
        // this.isAdditionalFile5_name = false;


      } else if (categoryname == 'f1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('f1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinancialYear1File_name = "";
        // this.isFinancialYear1File_name = false;


      } else if (categoryname == 'f2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('f2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinancialYear2File_name = "";
        // this.isFinancialYear2File_name = false;



      } else if (categoryname == 'f3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('f3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinancialYear3File_name = "";
        // this.isFinancialYear3File_name = false;


      } else if (categoryname == 'e1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.DesignFile_name = "";
        this.isDesignnCapCtrlSelected = false;
        // this.isDesignFile_name = false;


      } else if (categoryname == 'e2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinishFile_name = "";
        this.isFinishProdCtrlSelected = false;
        // this.isFinishFile_name = false;


      } else if (categoryname == 'e3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.RegisteredFile_name = "";
        this.isRegisteredOrgCtrlSelected = false;
        // this.isRegisteredFile_name = false;


      } else if (categoryname == 'e4') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e4')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.BusinessReferencesFile_name = "";
        // this.isBusinessReferencesFile_name = false;


      } else if (categoryname == 'e5') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e5')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.ComplianceFile_name = "";
        this.isCompliance1CtrlSelected = false;
        // this.isComplianceFile_name = false;


      } else if (categoryname == 'h1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.HseFile_name = "";
        this.isHse1CtrlSelected = false;
        // this.isHseFile_name = false;


      } else if (categoryname == 'h2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.DocuFile_name = "";
        this.isDocuHseCtrlSelected = false;
        // this.isDocuFile_name = false;


      } else if (categoryname == 'h3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.ISOHealthFile_name = "";
        this.isIsohealthCtrlSelected = false;
        // this.isISOHealthFile_name = false;


      } else if (categoryname == 'h4') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h4')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.EnvtFile_name = "";
        this.isEnvtMgt1CtrlSelected = false;
        // this.isEnvtFile_name = false;


      } else if (categoryname == 'h6') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h6')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }
        this.StatisticFile_name = "";
        this.isStatisticCtrlSelected = false;
        // this.isStatisticFile_name = false;




      } else if (categoryname == 'q1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('q1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.QualityPolicyFile_name = "";
        this.isQualityPolicy1CtrlSelected = false;
        // this.isQualityPolicyFile_name = false;


      } else if (categoryname == 'q2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('q2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.QualityMgtFile_name = "";
        this.isQualityMgtCtrlSelected = false;
        // this.isQualityMgtFile_name = false;


      } else if (categoryname == 'q3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('q3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.QualityMgtISOFile_name = "";
        this.isQualityMgtIsoCtrlSelected = false;
        // this.isQualityMgtISOFile_name = false;


      } else if (categoryname == 'b1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('b1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.BankFile_name = "";
        this.b1FileLoaded = false;
        // this.isBankFile_name = false;


      } else if (categoryname == 'b2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('b2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.BankLetterHeadFile_name = "";
        this.b2FileLoaded = false;
        // this.isBankLetterHeadFile_name = false;


      }
    }
    for (let i = 0; i < files.length; i++) {

      var searchTags = "_" + categoryname;

      if (categoryname == 'r1') {

        if (this.r1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }
          // }
        }
        this.r1_count = this.r1_count + 1;

      } else if (categoryname == 'v1') {
        if (this.v1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.v1_count = this.v1_count + 1;
      } else if (categoryname == 'g1') {
        if (this.g1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.g1_count = this.g1_count + 1;

      } else if (categoryname == 's1') {
        if (this.s1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.s1_count = this.s1_count + 1;

      } else if (categoryname == 'z1') {
        if (this.z1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.z1_count = this.z1_count + 1;

      } else if (categoryname == 'a1') {
        if (this.a1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.a1_count = this.a1_count + 1;

      } else if (categoryname == 'm1') {
        if (this.m1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.m1_count = this.m1_count + 1;

      } else if (categoryname == 'a2') {
        if (this.a2_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            // //this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a3') {
        if (this.a3_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            // //this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a4') {
        if (this.a4_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            // //this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a5') {
        if (this.a5_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            // //this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a6') {
        if (this.a6_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            // //this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'f1') {
        if (this.f1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.f1_count = this.f1_count + 1;

      } else if (categoryname == 'f2') {
        if (this.f2_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.f2_count = this.f2_count + 1;

      } else if (categoryname == 'f3') {
        if (this.f3_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.f3_count = this.f3_count + 1;

      } else if (categoryname == 'e1') {
        if (this.e1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.e1_count = this.e1_count + 1;


      } else if (categoryname == 'e2') {
        if (this.e2_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.e2_count = this.e2_count + 1;


      } else if (categoryname == 'e3') {
        if (this.e3_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.e3_count = this.e3_count + 1;

      } else if (categoryname == 'e4') {
        if (this.e4_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.e4_count = this.e4_count + 1;

      } else if (categoryname == 'e5') {
        if (this.e5_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.e5_count = this.e5_count + 1;

      } else if (categoryname == 'h1') {
        if (this.h1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.h1_count = this.h1_count + 1;

      } else if (categoryname == 'h2') {
        if (this.h2_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.h2_count = this.h2_count + 1;

      } else if (categoryname == 'h3') {
        if (this.h3_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.h3_count = this.h3_count + 1;

      } else if (categoryname == 'h4') {
        if (this.h4_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.h4_count = this.h4_count + 1;

      } else if (categoryname == 'h6') {
        if (this.h6_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.h6_count = this.h6_count + 1;

      } else if (categoryname == 'q1') {
        if (this.q1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.q1_count = this.q1_count + 1;

      } else if (categoryname == 'q2') {
        if (this.q2_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.q2_count = this.q2_count + 1;

      } else if (categoryname == 'q3') {
        if (this.q3_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);

          }

        }
        this.q3_count = this.q3_count + 1;

      } else if (categoryname == 'b1') {
        if (this.b1_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);
            this.b1FileLoaded = false;

          }

        }
        this.b1_count = this.b1_count + 1;

      } else if (categoryname == 'b2') {
        if (this.b2_count > 1) {

          console.log('file items : ' + files[i].name);
          if (files[i].name.includes(searchTags)) {
            //this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.selectedFiles.length);
            this.b2FileLoaded = false;

          }

        }
        this.b2_count = this.b2_count + 1;

      }
      console.log(files.length);

      if (!files.length) {
        console.log('No file is attached - no file length');


        console.log('file items : ' + files[i].name);
        if (files[i].name.includes(searchTags)) {
          // this.uploaderTemp.removeFromQueue(fileItem);
          delete this.selectedFiles[i];
          console.log('file deleted');
          console.log('New length of the queue: ' + this.selectedFiles.length);

        }


        if (categoryname == 'r1') {
          this.RegFile_name = "";
          this.isRegFile_name = false;
        } else if (categoryname == 'v1') {
          this.VatFile_name = "";
          this.isVatFile_name = false;

        } else if (categoryname == 'g1') {
          this.GosiFile_name = "";
          this.isGosiFile_name = false;

        } else if (categoryname == 's1') {
          this.SaudiFile_name = "";
          this.isSaudiFile_name = false;

        } else if (categoryname == 'z1') {
          this.ZakathFile_name = "";
          this.isZakathFile_name = false;

        } else if (categoryname == 'a1') {
          this.AssociationFile_name = "";
          this.isAssociationFile_name = false;

        } else if (categoryname == 'm1') {
          this.OrgaizationChartFile_name = "";
          this.isOrgaizationChartFile_name = false;

        } else if (categoryname == 'a2') {
          this.AdditionalFile_name = "";
          this.isAdditionalFile_name = false;

        } else if (categoryname == 'a3') {
          this.AdditionalFile2_name = "";
          this.isAdditionalFile2_name = false;

        } else if (categoryname == 'a4') {
          this.AdditionalFile3_name = "";
          this.isAdditionalFile3_name = false;

        } else if (categoryname == 'a5') {
          this.AdditionalFile4_name = "";
          this.isAdditionalFile4_name = false;

        } else if (categoryname == 'a6') {
          this.AdditionalFile5_name = "";
          this.isAdditionalFile5_name = false;

        } else if (categoryname == 'f1') {
          this.FinancialYear1File_name = "";
          this.isFinancialYear1File_name = false;

        } else if (categoryname == 'f2') {
          this.FinancialYear2File_name = "";
          this.isFinancialYear2File_name = false;


        } else if (categoryname == 'f3') {
          this.FinancialYear3File_name = "";
          this.isFinancialYear3File_name = false;


        } else if (categoryname == 'e1') {
          this.DesignFile_name = "";
          this.isDesignFile_name = false;

        } else if (categoryname == 'e2') {
          this.FinishFile_name = "";
          this.isFinishFile_name = false;

        } else if (categoryname == 'e3') {
          this.RegisteredFile_name = "";
          this.isRegisteredFile_name = false;

        } else if (categoryname == 'e4') {
          this.BusinessReferencesFile_name = "";
          this.isBusinessReferencesFile_name = false;

        } else if (categoryname == 'e5') {
          this.ComplianceFile_name = "";
          this.isComplianceFile_name = false;

        } else if (categoryname == 'h1') {
          this.HseFile_name = "";
          this.isHseFile_name = false;

        } else if (categoryname == 'h2') {
          this.DocuFile_name = "";
          this.isDocuFile_name = false;

        } else if (categoryname == 'h3') {
          this.ISOHealthFile_name = "";
          this.isISOHealthFile_name = false;

        } else if (categoryname == 'h4') {
          this.EnvtFile_name = "";
          this.isEnvtFile_name = false;

        } else if (categoryname == 'h6') {
          this.StatisticFile_name = "";
          this.isStatisticFile_name = false;

        } else if (categoryname == 'q1') {
          this.QualityPolicyFile_name = "";
          this.isQualityPolicyFile_name = false;

        } else if (categoryname == 'q2') {
          this.QualityMgtFile_name = "";
          this.isQualityMgtFile_name = false;

        } else if (categoryname == 'q3') {
          this.QualityMgtISOFile_name = "";
          this.isQualityMgtISOFile_name = false;

        } else if (categoryname == 'b1') {
          this.BankFile_name = "";
          this.isBankFile_name = false;

        } else if (categoryname == 'b2') {
          this.BankLetterHeadFile_name = "";
          this.isBankLetterHeadFile_name = false;

        }
      }

      console.log('Categorized name: ' + categoryname);
      var length = files.length;
      if (length > 0) {
        // const oldFileItem: FileItem = this.uploaderTemp.queue[length - 1];

        this.fileName = files[i].name;
        this.fileType = files[i].name.split('.')[1];

        var filetypeposition = files[i].name.split('.').length - 1;
        var newFilenameFormat = files[i].name.split('.')[filetypeposition];
        var newFilename = '_' + categoryname + '.' + newFilenameFormat;

        console.log("The file format [1]: " + files[i].name.split('.')[1]);
        console.log("The file format [2]: " + files[i].name.split('.')[2]);
        console.log("The file format [3]: " + files[i].name.split('.').length);
        var newFilenameLength = newFilename.length;
        console.log("filename length is:" + newFilename.length);
        console.log("The file name is : " + newFilename);
        var filesize = files[i].size;

        /* Unsupported format file check Starts */
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

          const fileURL = URL.createObjectURL(files[i]);

          if (categoryname == 'r1') {
            if (files && files[i]) {
              this.r1url = fileURL;
              this.r1section = true;

              this.r1fileName = files[i].name;
              this.r1fileType = files[i].name.split('.')[1];
            }
            this.isFormatreg = false;
            if (files.length == 0) {
              this.r1FileLoaded = false;
              // this.firstFormGroup.get('regfiletempCtrl').setErrors({ invalid: true });
              this.isRegFileSelected = false;

              console.log('Length is zero');
            } else if (files.length == 1) {
              this.RegFile_name = this.fileName;
              console.log(this.RegFile_name);
              this.isRegFile_name = true;
              this.r1FileLoaded = true;
              this.isRegFileSelected = true;

              console.log('Length is one');
            }
          } else if (categoryname == 'v1') {
            if (files && files[i]) {
              this.v1url = fileURL;
              this.v1section = true;

              this.v1fileName = files[i].name;
              this.v1fileType = files[i].name.split('.')[1];
            }

            this.isFormatvat = false;
            if (files.length == 0) {
              this.v1FileLoaded = false;
              // this.firstFormGroup.get('vatfiletempCtrl').setErrors({ invalid: true });
              this.isVatFileSelected = false;

              console.log('Length is zero');
            } else if (files.length == 1) {
              this.VatFile_name = this.fileName;
              this.isVatFile_name = true;

              this.v1FileLoaded = true;
              this.isVatFileSelected = true;

              console.log('Length is one');
            }
          } else if (categoryname == 'g1') {
            if (files && files[i]) {
              this.g1url = fileURL;
              this.g1section = true;

              this.g1fileName = files[i].name;
              this.g1fileType = files[i].name.split('.')[1];
            }
            this.isFormatgosi = false;
            if (files.length == 0) {
              this.g1FileLoaded = false;
              // this.firstFormGroup.get('gosifiletempCtrl').setErrors({ invalid: true });
              this.isGosiFileSelected = false;

              console.log('Length is zero');
            } else if (files.length == 1) {
              this.GosiFile_name = this.fileName;
              this.isGosiFile_name = true;

              this.g1FileLoaded = true;
              this.isGosiFileSelected = true;

              console.log('Length is one');
            }
          } else if (categoryname == 's1') {
            if (files && files[i]) {
              this.s1url = fileURL;
              this.s1section = true;

              this.s1fileName = files[i].name;
              this.s1fileType = files[i].name.split('.')[1];
            }
            this.isFormatsaudi = false;
            if (files.length == 0) {
              this.s1FileLoaded = false;
              // this.firstFormGroup.get('saudifiletempCtrl').setErrors({ invalid: true });
              this.isSaudiFileSelected = false;

              console.log('Length is zero');
            } else if (files.length == 1) {
              this.SaudiFile_name = this.fileName;
              this.isSaudiFile_name = true;

              this.s1FileLoaded = true;
              this.isSaudiFileSelected = true;

              console.log('Length is one');
            }
          } else if (categoryname == 'z1') {
            if (files && files[i]) {
              this.z1url = fileURL;
              this.z1section = true;

              this.z1fileName = files[i].name;
              this.z1fileType = files[i].name.split('.')[1];
            }
            this.isFormatzakath = false;
            if (files.length == 0) {
              this.z1FileLoaded = false;
              // this.firstFormGroup.get('zakathfiletempCtrl').setErrors({ invalid: true });
              this.isZakathFileSelected = false;

              console.log('Length is zero');
            } else if (files.length == 1) {
              this.ZakathFile_name = this.fileName;
              this.isZakathFile_name = true;

              this.z1FileLoaded = true;
              this.isZakathFileSelected = true;

              console.log('Length is one');
            }
          } else if (categoryname == 'a1') {
            if (files && files[i]) {
              this.a1url = fileURL;
              this.a1section = true;

              this.a1fileName = files[i].name;
              this.a1fileType = files[i].name.split('.')[1];
            }
            this.isFormatassociation = false;
            if (files.length == 0) {
              this.a1FileLoaded = false;
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.AssociationFile_name = this.fileName;
              this.isAssociationFile_name = true;

              this.a1FileLoaded = true;
              console.log('Length is one');
            }
          } else if (categoryname == 'm1') {
            if (files && files[i]) {
              this.OrgaizationChartFile_name = this.fileName;
              this.isOrgaizationChartFile_name = true;

              this.m1url = fileURL;
              this.m1section = true;

              this.m1fileName = files[i].name;
              this.m1fileType = files[i].name.split('.')[1];
            }
            this.isFormatmanorg = false;
          } else if (categoryname == 'a2') {
            if (files && files[i]) {
              this.AdditionalFile_name = this.fileName;
              this.isAdditionalFile_name = true;

              this.a2url = fileURL;
              this.a2section = true;

              this.a2fileName = files[i].name;
              this.a2fileType = files[i].name.split('.')[1];
            }
            this.isFormatadditional = false;
          } else if (categoryname == 'a3') {
            if (files && files[i]) {
              this.AdditionalFile2_name = this.fileName;
              this.isAdditionalFile2_name = true;

              this.a3url = fileURL;
              this.a3section = true;

              this.a3fileName = files[i].name;
              this.a3fileType = files[i].name.split('.')[1];
            }
            this.isFormatadditional2 = false;
          } else if (categoryname == 'a4') {
            if (files && files[i]) {
              this.AdditionalFile3_name = this.fileName;
              this.isAdditionalFile3_name = true;

              this.a4url = fileURL;
              this.a4section = true;

              this.a4fileName = files[i].name;
              this.a4fileType = files[i].name.split('.')[1];
            }
            this.isFormatadditional3 = false;
          } else if (categoryname == 'a5') {
            if (files && files[i]) {
              this.AdditionalFile4_name = this.fileName;
              this.isAdditionalFile4_name = true;

              this.a5url = fileURL;
              this.a5section = true;

              this.a5fileName = files[i].name;
              this.a5fileType = files[i].name.split('.')[1];
            }
            this.isFormatadditional4 = false;
          } else if (categoryname == 'a6') {
            if (files && files[i]) {
              this.AdditionalFile5_name = this.fileName;
              this.isAdditionalFile5_name = true;

              this.a6url = fileURL;
              this.a6section = true;

              this.a6fileName = files[i].name;
              this.a6fileType = files[i].name.split('.')[1];
            }
            this.isFormatadditional5 = false;
          } else if (categoryname == 'f1') {
            if (files && files[i]) {
              this.FinancialYear1File_name = this.fileName;
              this.isFinancialYear1File_name = true;

              this.f1url = fileURL;
              this.f1section = true;

              this.f1fileName = files[i].name;
              this.f1fileType = files[i].name.split('.')[1];
            }
            this.isFormatfin1 = false;
          } else if (categoryname == 'f2') {
            if (files && files[i]) {
              this.FinancialYear2File_name = this.fileName;
              this.isFinancialYear2File_name = true;

              this.f2url = fileURL;
              this.f2section = true;

              this.f2fileName = files[i].name;
              this.f2fileType = files[i].name.split('.')[1];
            }
            this.isFormatfin2 = false;
          } else if (categoryname == 'f3') {
            if (files && files[i]) {
              this.FinancialYear3File_name = this.fileName;
              this.isFinancialYear3File_name = true;

              this.f3url = fileURL;
              this.f3section = true;

              this.f3fileName = files[i].name;
              this.f3fileType = files[i].name.split('.')[1];
            }
            this.isFormatfin3 = false;
          } else if (categoryname == 'e1') {
            if (files && files[i]) {
              this.e1url = fileURL;
              this.e1section = true;

              this.e1fileName = files[i].name;
              this.e1fileType = files[i].name.split('.')[1];
            }
            this.isFormatorgdesign = false;
            if (files.length == 0) {
              this.e1FileLoaded = false;
              // this.secondFormGroup.get('designtempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isDesignnCapCtrlSelected = false;

            } else if (files.length == 1) {
              this.DesignFile_name = this.fileName;

              this.isDesignFile_name = true;

              this.e1FileLoaded = true;
              console.log('Length is one');
              this.isDesignnCapCtrlSelected = true;

            }
          } else if (categoryname == 'e2') {
            if (files && files[i]) {
              this.e2url = fileURL;
              this.e2section = true;

              this.e2fileName = files[i].name;
              this.e2fileType = files[i].name.split('.')[1];
            }
            this.isFormatoutorg = false;
            if (files.length == 0) {
              this.e2FileLoaded = false;
              // this.secondFormGroup.get('finishtempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isFinishProdCtrlSelected = false;

            } else if (files.length == 1) {
              this.FinishFile_name = this.fileName;
              this.isFinishFile_name = true;

              this.e2FileLoaded = true;
              console.log('Length is one');
              this.isFinishProdCtrlSelected = true;

            }
          } else if (categoryname == 'e3') {
            if (files && files[i]) {
              this.e3url = fileURL;
              this.e3section = true;

              this.e3fileName = files[i].name;
              this.e3fileType = files[i].name.split('.')[1];
            }
            this.isFormatthirdparty = false;
            if (files.length == 0) {
              this.e3FileLoaded = false;
              // this.secondFormGroup.get('registeredtempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isRegisteredOrgCtrlSelected = false;

            } else if (files.length == 1) {
              this.RegisteredFile_name = this.fileName;
              this.isRegisteredFile_name = true;

              this.e3FileLoaded = true;
              console.log('Length is one');
              this.isRegisteredOrgCtrlSelected = true;

            }
          } else if (categoryname == 'e4') {
            if (files && files[i]) {
              this.BusinessReferencesFile_name = this.fileName;
              this.isBusinessReferencesFile_name = true;

              this.e4url = fileURL;
              this.e4section = true;

              this.e4fileName = files[i].name;
              this.e4fileType = files[i].name.split('.')[1];
            }
            this.isFormatbusrefr = false;

          } else if (categoryname == 'e5') {
            if (files && files[i]) {
              this.e5url = fileURL;
              this.e5section = true;

              this.e5fileName = files[i].name;
              this.e5fileType = files[i].name.split('.')[1];
            }
            this.isFormattrainInfo = false;
            if (files.length == 0) {
              this.e5FileLoaded = false;
              // this.secondFormGroup.get('isFormattrainInfo').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isCompliance1CtrlSelected = false;

            } else if (files.length == 1) {
              this.ComplianceFile_name = this.fileName;
              this.isComplianceFile_name = true;


              this.e5FileLoaded = true;
              console.log('Length is one');
              this.isCompliance1CtrlSelected = true;

            }
          } else if (categoryname == 'h1') {
            if (files && files[i]) {
              this.h1url = fileURL;
              this.h1section = true;

              this.h1fileName = files[i].name;
              this.h1fileType = files[i].name.split('.')[1];
            }
            this.isFormathse = false;
            if (files.length == 0) {
              this.h1FileLoaded = false;
              // this.secondFormGroup.get('hsetempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isHse1CtrlSelected = false;

            } else if (files.length == 1) {
              this.HseFile_name = this.fileName;
              this.isHseFile_name = true;

              this.h1FileLoaded = true;
              console.log('Length is one');
              this.isHse1CtrlSelected = true;

            }
          } else if (categoryname == 'h2') {
            if (files && files[i]) {
              this.h2url = fileURL;
              this.h2section = true;

              this.h2fileName = files[i].name;
              this.h2fileType = files[i].name.split('.')[1];
            }
            this.isFormathse2 = false;
            if (files.length == 0) {
              this.h2FileLoaded = false;
              // this.secondFormGroup.get('docutempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isDocuHseCtrlSelected = false;

            } else if (files.length == 1) {
              this.DocuFile_name = this.fileName;
              this.isDocuFile_name = true;

              this.h2FileLoaded = true;
              console.log('Length is one');
              this.isDocuHseCtrlSelected = true;

            }
          } else if (categoryname == 'h3') {
            if (files && files[i]) {
              this.h3url = fileURL;
              this.h3section = true;

              this.h3fileName = files[i].name;
              this.h3fileType = files[i].name.split('.')[1];
            }
            this.isFormathse3 = false;
            if (files.length == 0) {
              this.h3FileLoaded = false;
              // this.secondFormGroup.get('isohealthtempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isIsohealthCtrlSelected = false;

            } else if (files.length == 1) {
              this.ISOHealthFile_name = this.fileName;
              this.isISOHealthFile_name = true;

              this.h3FileLoaded = true;
              console.log('Length is one');
              this.isIsohealthCtrlSelected = true;

            }
          } else if (categoryname == 'h4') {
            if (files && files[i]) {
              this.h4url = fileURL;
              this.h4section = true;

              this.h4fileName = files[i].name;
              this.h4fileType = files[i].name.split('.')[1];
            }
            this.isFormathse4 = false;
            if (files.length == 0) {
              this.h4FileLoaded = false;
              // this.secondFormGroup.get('envttempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isEnvtMgt1CtrlSelected = false;

            } else if (files.length == 1) {
              this.EnvtFile_name = this.fileName;
              this.isEnvtFile_name = true;

              this.h4FileLoaded = true;
              console.log('Length is one');
              this.isEnvtMgt1CtrlSelected = true;

            }
          } else if (categoryname == 'h6') {
            if (files && files[i]) {
              this.h6url = fileURL;
              this.h6section = true;

              this.h6fileName = files[i].name;
              this.h6fileType = files[i].name.split('.')[1];
            }
            this.isFormathse6 = false;
            if (files.length == 0) {
              this.h6FileLoaded = false;
              // this.secondFormGroup.get('envttempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              // this.isEnvtMgt1CtrlSelected = false;

            } else if (files.length == 1) {
              this.StatisticFile_name = this.fileName;
              this.isStatisticFile_name = true;

              this.h6FileLoaded = true;
              console.log('Length is one');
              // this.isStatisticCtrlSelected = true;

            }
          } else if (categoryname == 'q1') {
            if (files && files[i]) {
              this.q1url = fileURL;
              this.q1section = true;

              this.q1fileName = files[i].name;
              this.q1fileType = files[i].name.split('.')[1];
            }
            this.isFormatquality1 = false;
            if (files.length == 0) {
              this.q1FileLoaded = false;
              // this.secondFormGroup.get('qualityPolicytempCtrl').setErrors({ invalid: true });

              this.isQualityPolicy1CtrlSelected = false;
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.QualityPolicyFile_name = this.fileName;
              this.isQualityPolicyFile_name = true;

              this.q1FileLoaded = true;
              this.isQualityPolicy1CtrlSelected = true;
              console.log('Length is one');
            }
          } else if (categoryname == 'q2') {
            if (files && files[i]) {
              this.q2url = fileURL;
              this.q2section = true;

              this.q2fileName = files[i].name;
              this.q2fileType = files[i].name.split('.')[1];
            }
            this.isFormatquality2 = false;
            if (files.length == 0) {
              this.q2FileLoaded = false;
              // this.secondFormGroup.get('qualityMgttempCtrl').setErrors({ invalid: true });

              console.log('Length is zero');
              this.isQualityMgtCtrlSelected = false;

            } else if (files.length == 1) {
              this.QualityMgtFile_name = this.fileName;
              this.isQualityMgtFile_name = true;

              this.q2FileLoaded = true;
              console.log('Length is one');
              this.isQualityMgtCtrlSelected = true;

            }
          } else if (categoryname == 'q3') {
            if (files && files[i]) {
              this.q3url = fileURL;
              this.q3section = true;

              this.q3fileName = files[i].name;
              this.q3fileType = files[i].name.split('.')[1];
            }
            this.isFormatquality3 = false;
            if (files.length == 0) {
              this.q3FileLoaded = false;
              // this.secondFormGroup.get('qualityMgtIsotempCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isQualityMgtIsoCtrlSelected = false;

            } else if (files.length == 1) {
              this.QualityMgtISOFile_name = this.fileName;
              this.isQualityMgtISOFile_name = true;

              this.q3FileLoaded = true;
              console.log('Length is one');
              this.isQualityMgtIsoCtrlSelected = true;

            }
          } else if (categoryname == 'b1') {
            if (files && files[i]) {
              this.b1url = fileURL;
              this.b1section = true;

              this.b1fileName = files[i].name;
              this.b1fileType = files[i].name.split('.')[1];
            }
            this.isFormatbank = false;
            if (files.length == 0) {
              this.b1FileLoaded = false;
              // this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.BankFile_name = this.fileName;
              this.isBankFile_name = true;

              this.b1FileLoaded = true;
              console.log('Length is one');
            }
          } else if (categoryname == 'b2') {
            if (files && files[i]) {
              this.b2url = fileURL;
              this.b2section = true;

              this.b2fileName = files[i].name;
              this.b2fileType = files[i].name.split('.')[1];
            }
            this.isFormatbankletterhead = false;
            if (files.length == 0) {
              this.b2FileLoaded = false;
              // this.thirdFormGroup.get('bankfiletempCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.BankLetterHeadFile_name = this.fileName;
              this.isBankLetterHeadFile_name = true;

              this.b2FileLoaded = true;
              console.log('Length is one');
            }
          }
        } else {
          if (categoryname == 'r1') {
            this.isFormatreg = true;

            this.r1FileLoaded = false;
            console.log('File is not supported, so its false');

          } else if (categoryname == 'v1') {
            this.isFormatvat = true;
          } else if (categoryname == 'g1') {
            this.isFormatgosi = true;
          } else if (categoryname == 's1') {
            this.isFormatsaudi = true;
          } else if (categoryname == 'z1') {
            this.isFormatzakath = true;
          } else if (categoryname == 'a1') {
            this.isFormatassociation = true;
          } else if (categoryname == 'm1') {
            this.isFormatmanorg = true;
          } else if (categoryname == 'a2') {
            this.isFormatadditional = true;
          } else if (categoryname == 'a3') {
            this.isFormatadditional2 = true;
          } else if (categoryname == 'a4') {
            this.isFormatadditional3 = true;
          } else if (categoryname == 'a5') {
            this.isFormatadditional4 = true;
          } else if (categoryname == 'a6') {
            this.isFormatadditional5 = true;
          } else if (categoryname == 'f1') {
            this.isFormatfin1 = true;
          } else if (categoryname == 'f2') {
            this.isFormatfin2 = true;
          } else if (categoryname == 'f3') {
            this.isFormatfin3 = true;
          } else if (categoryname == 'e1') {
            this.isFormatorgdesign = true;

            this.e1FileLoaded = false;
            console.log('File is not supported, so its false');

          } else if (categoryname == 'e2') {
            this.isFormatoutorg = true;

            this.e2FileLoaded = false;
            console.log('File is not supported, so its false');

          } else if (categoryname == 'e3') {
            this.isFormatthirdparty = true;

            this.e3FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'e4') {
            this.isFormatbusrefr = true;

            this.e4FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'e5') {
            this.isFormattrainInfo = true;

            this.e5FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h1') {
            this.isFormathse = true;

            this.h1FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h2') {
            this.isFormathse2 = true;

            this.h2FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h3') {
            this.isFormathse3 = true;

            this.h3FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h4') {
            this.isFormathse4 = true;

            this.h4FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h6') {
            this.isFormathse6 = true;

            this.h6FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'q1') {
            this.isFormatquality1 = true;

            this.q1FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'q2') {
            this.isFormatquality2 = true;

            this.q2FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'q3') {
            this.isFormatquality3 = true;

            this.q3FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'b1') {
            this.isFormatbank = true;
            this.b1FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'b2') {
            this.isFormatbankletterhead = true;
            this.b2FileLoaded = false;
            console.log('File is not supported, so its false');
          }
        }
        /* Unsupported format file check Ends */


        /* Change for empty file */
        /**/
        console.log('File size  is : ' + filesize);
        if (filesize > 5000000) {
          if (categoryname == 'r1') {
            this.ismaxreg = true;
          } else if (categoryname == 'v1') {
            this.ismaxvat = true;
          } else if (categoryname == 'g1') {
            this.ismaxgosi = true;
          } else if (categoryname == 's1') {
            this.ismaxsaudi = true;
          } else if (categoryname == 'z1') {
            this.ismaxzakath = true;
          } else if (categoryname == 'a1') {
            this.ismaxassociation = true;
          } else if (categoryname == 'm1') {
            this.ismaxmanorg = true;
          } else if (categoryname == 'a2') {
            this.ismaxadditional = true;
          } else if (categoryname == 'a3') {
            this.ismaxadditional2 = true;
          } else if (categoryname == 'a4') {
            this.ismaxadditional3 = true;
          } else if (categoryname == 'a5') {
            this.ismaxadditional4 = true;
          } else if (categoryname == 'a6') {
            this.ismaxadditional5 = true;
          } else if (categoryname == 'f1') {
            this.ismaxfin1 = true;
          } else if (categoryname == 'f2') {
            this.ismaxfin2 = true;
          } else if (categoryname == 'f3') {
            this.ismaxfin3 = true;
          } else if (categoryname == 'e1') {
            this.ismaxorgdesign = true;
          } else if (categoryname == 'e2') {
            this.ismaxoutorg = true;
          } else if (categoryname == 'e3') {
            this.ismaxthirdparty = true;
          } else if (categoryname == 'e4') {
            this.ismaxbusrefr = true;
          } else if (categoryname == 'e5') {
            this.ismaxtrainInfo = true;
          } else if (categoryname == 'h1') {
            this.ismaxhse = true;
          } else if (categoryname == 'h2') {
            this.ismaxhse2 = true;
          } else if (categoryname == 'h3') {
            this.ismaxhse3 = true;
          } else if (categoryname == 'h4') {
            this.ismaxhse4 = true;
          } else if (categoryname == 'h6') {
            this.ismaxhse6 = true;
            // Remove filename form filename array
            const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          } else if (categoryname == 'q1') {
            this.ismaxquality1 = true;
          } else if (categoryname == 'q2') {
            this.ismaxquality2 = true;
          } else if (categoryname == 'q3') {
            this.ismaxquality3 = true;
          } else if (categoryname == 'b1') {
            this.ismaxbank = true;
          } else if (categoryname == 'b2') {
            this.ismaxbankletterhead = true;
          }
        } else {
          if (categoryname == 'r1') {
            this.ismaxreg = false;
          } else if (categoryname == 'v1') {
            this.ismaxvat = false;
          } else if (categoryname == 'g1') {
            this.ismaxgosi = false;
          } else if (categoryname == 's1') {
            this.ismaxsaudi = false;
          } else if (categoryname == 'z1') {
            this.ismaxzakath = false;
          } else if (categoryname == 'a1') {
            this.ismaxzakath = false;
          } else if (categoryname == 'm1') {
            this.ismaxmanorg = false;
          } else if (categoryname == 'a2') {
            this.ismaxadditional = false;
          } else if (categoryname == 'a3') {
            this.ismaxadditional2 = false;
          } else if (categoryname == 'a4') {
            this.ismaxadditional3 = false;
          } else if (categoryname == 'a5') {
            this.ismaxadditional4 = false;
          } else if (categoryname == 'a6') {
            this.ismaxadditional5 = false;
          } else if (categoryname == 'f1') {
            this.ismaxfin1 = false;
          } else if (categoryname == 'f2') {
            this.ismaxfin2 = false;
          } else if (categoryname == 'f3') {
            this.ismaxfin3 = false;
          } else if (categoryname == 'e1') {
            this.ismaxorgdesign = false;
          } else if (categoryname == 'e2') {
            this.ismaxoutorg = false;
          } else if (categoryname == 'e3') {
            this.ismaxthirdparty = false;
          } else if (categoryname == 'e4') {
            this.ismaxbusrefr = false;
          } else if (categoryname == 'e5') {
            this.ismaxtrainInfo = false;
          } else if (categoryname == 'h1') {
            this.ismaxhse = false;
          } else if (categoryname == 'h2') {
            this.ismaxhse2 = false;
          } else if (categoryname == 'h3') {
            this.ismaxhse3 = false;
          } else if (categoryname == 'h4') {
            this.ismaxhse4 = false;
          } else if (categoryname == 'h6') {
            this.ismaxhse6 = false;
          } else if (categoryname == 'q1') {
            this.ismaxquality1 = false;
          } else if (categoryname == 'q2') {
            this.ismaxquality2 = false;
          } else if (categoryname == 'q3') {
            this.ismaxquality3 = false;
          } else if (categoryname == 'b1') {
            this.ismaxbank = false;
          } else if (categoryname == 'b2') {
            this.ismaxbankletterhead = false;
          }

        }

        if (filesize == 0) {
          if (categoryname == 'r1') {
            this.isemptyreg = true;
          } else if (categoryname == 'v1') {
            this.isemptyvat = true;
          } else if (categoryname == 'g1') {
            this.isemptygosi = true;
          } else if (categoryname == 's1') {
            this.isemptysaudi = true;
          } else if (categoryname == 'z1') {
            this.isemptyzakath = true;
          } else if (categoryname == 'a1') {
            this.isemptyassociation = true;
          } else if (categoryname == 'm1') {
            this.isemptymanorg = true;
          } else if (categoryname == 'a2') {
            this.isemptyadditional = true;
          } else if (categoryname == 'a3') {
            this.isemptyadditional2 = true;
          } else if (categoryname == 'a4') {
            this.isemptyadditional3 = true;
          } else if (categoryname == 'a5') {
            this.isemptyadditional4 = true;
          } else if (categoryname == 'a6') {
            this.isemptyadditional5 = true;
          } else if (categoryname == 'f1') {
            this.isemptyfin1 = true;
          } else if (categoryname == 'f2') {
            this.isemptyfin2 = true;
          } else if (categoryname == 'f3') {
            this.isemptyfin3 = true;
          } else if (categoryname == 'e1') {
            this.isemptyorgdesign = true;
          } else if (categoryname == 'e2') {
            this.isemptyoutorg = true;
          } else if (categoryname == 'e3') {
            this.isemptythirdparty = true;
          } else if (categoryname == 'e4') {
            this.isemptybusrefr = true;
          } else if (categoryname == 'e5') {
            this.isemptytrainInfo = true;
          } else if (categoryname == 'h1') {
            this.isemptyhse = true;
          } else if (categoryname == 'h2') {
            this.isemptyhse2 = true;
          } else if (categoryname == 'h3') {
            this.isemptyhse3 = true;
          } else if (categoryname == 'h4') {
            this.isemptyhse4 = true;
          } else if (categoryname == 'h6') {
            this.StatisticFile_name = files[i].name;
            this.isemptyhse6 = true;
            // Remove filename form filename array
            const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          } else if (categoryname == 'q1') {
            this.isemptyquality1 = true;
          } else if (categoryname == 'q2') {
            this.isemptyquality2 = true;
          } else if (categoryname == 'q3') {
            this.isemptyquality3 = true;
          } else if (categoryname == 'b1') {
            this.isemptybank = true;
          } else if (categoryname == 'b2') {
            this.isemptybankletterhead = true;
          }
        } else {
          if (categoryname == 'r1') {
            this.isemptyreg = false;
            this.isregadded = true;
            this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();

          } else if (categoryname == 'v1') {
            this.isemptyvat = false;
            this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'g1') {
            this.isemptygosi = false;
            this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
          } else if (categoryname == 's1') {
            this.isemptysaudi = false;
            this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
          } else if (categoryname == 'z1') {
            this.isemptyzakath = false;
            this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'a1') {
            this.isemptyassociation = false;
            this.firstFormGroup.get('associationfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('associationfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'm1') {
            this.isemptymanorg = false;
          } else if (categoryname == 'a2') {
            this.isemptyadditional = false;
          } else if (categoryname == 'a3') {
            this.isemptyadditional2 = false;
          } else if (categoryname == 'a4') {
            this.isemptyadditional3 = false;
          } else if (categoryname == 'a5') {
            this.isemptyadditional4 = false;
          } else if (categoryname == 'a6') {
            this.isemptyadditional5 = false;
          } else if (categoryname == 'f1') {
            this.isemptyfin1 = false;
          } else if (categoryname == 'f2') {
            this.isemptyfin2 = false;
          } else if (categoryname == 'f3') {
            this.isemptyfin3 = false;
          } else if (categoryname == 'e1') {
            this.isemptyorgdesign = false;
            this.secondFormGroup.get('designtempCtrl').markAsUntouched();
            this.secondFormGroup.get('designoriCtrl').markAsUntouched();
          } else if (categoryname == 'e2') {
            this.isemptyoutorg = false;
            this.secondFormGroup.get('finishtempCtrl').markAsUntouched();
            this.secondFormGroup.get('finishoriCtrl').markAsUntouched();
          } else if (categoryname == 'e3') {
            this.isemptythirdparty = false;
            this.secondFormGroup.get('registeredtempCtrl').markAsUntouched();
            this.secondFormGroup.get('registeredoriCtrl').markAsUntouched();
          } else if (categoryname == 'e4') {
            this.isemptybusrefr = false;
          } else if (categoryname == 'e5') {
            this.isemptytrainInfo = false;
            this.secondFormGroup.get('compliancetempCtrl').markAsUntouched();
            this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
          } else if (categoryname == 'h1') {
            this.isemptyhse = false;
            this.secondFormGroup.get('hsetempCtrl').markAsUntouched();
            this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
          } else if (categoryname == 'h2') {
            this.isemptyhse2 = false;
            this.secondFormGroup.get('docutempCtrl').markAsUntouched();
            this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
          } else if (categoryname == 'h3') {
            this.isemptyhse3 = false;
            this.secondFormGroup.get('isohealthtempCtrl').markAsUntouched();
            this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
          } else if (categoryname == 'h4') {
            this.isemptyhse4 = false;
            this.secondFormGroup.get('envttempCtrl').markAsUntouched();
            this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
          } else if (categoryname == 'h6') {
            this.isemptyhse6 = false;
            this.secondFormGroup.get('statisticTempCtrl').markAsUntouched();
            this.secondFormGroup.get('StatisticoriCtrl').markAsUntouched();
          } else if (categoryname == 'q1') {
            this.isemptyquality1 = false;
            this.secondFormGroup.get('qualityPolicytempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
          } else if (categoryname == 'q2') {
            this.isemptyquality2 = false;
            this.secondFormGroup.get('qualityMgttempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
          } else if (categoryname == 'q3') {
            this.isemptyquality3 = false;
            this.secondFormGroup.get('qualityMgtIsotempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
          } else if (categoryname == 'b1') {
            this.isemptybank = false;
            this.isbankadded = true;
            this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
            this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'b2') {
            this.isemptybankletterhead = false;
            this.isbankletterheadadded = true;
            this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
            this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsUntouched();
          }

        }
        /** End of empty file change */


        // const newFile: File = new File([this.uploaderTemp.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
        // const newFileItem = new FileItem(this.uploaderTemp, newFile, null);
        // this.uploaderTemp.queue[length - 1] = newFileItem;

        var searchTag = "_" + categoryname;

        console.log('File size  is : ' + filesize);
        if (filesize > 5000000) {
          if (categoryname == 'r1') {
            this.ismaxreg = true;


            // for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              //this.uploaderTemp.removeFromQueue(fileItem);
            }
            // }



            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'v1') {
            this.ismaxvat = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'g1') {
            this.ismaxgosi = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 's1') {
            this.ismaxsaudi = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'z1') {
            this.ismaxzakath = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a1') {
            this.ismaxassociation = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'm1') {
            this.ismaxmanorg = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a2') {
            this.ismaxadditional = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a3') {
            this.ismaxadditional2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a4') {
            this.ismaxadditional3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a5') {
            this.ismaxadditional4 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a6') {
            this.ismaxadditional5 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'f1') {
            this.ismaxfin1 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'f2') {
            this.ismaxfin2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'f3') {
            this.ismaxfin3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e1') {
            this.ismaxorgdesign = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e2') {
            this.ismaxoutorg = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e3') {
            this.ismaxthirdparty = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e4') {
            this.ismaxbusrefr = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e5') {
            this.ismaxtrainInfo = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h1') {
            this.ismaxhse = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h2') {
            this.ismaxhse2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h3') {
            this.ismaxhse3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h4') {
            this.ismaxhse4 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h6') {
            this.ismaxhse6 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }
          } else if (categoryname == 'q1') {
            this.ismaxquality1 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'q2') {
            this.ismaxquality2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'q3') {
            this.ismaxquality3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'b1') {
            this.ismaxbank = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'b2') {
            this.ismaxbankletterhead = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          }
        } else {
          if (categoryname == 'r1') {
            this.ismaxreg = false;
          } else if (categoryname == 'v1') {
            this.ismaxvat = false;
          } else if (categoryname == 'g1') {
            this.ismaxgosi = false;
          } else if (categoryname == 's1') {
            this.ismaxsaudi = false;
          } else if (categoryname == 'z1') {
            this.ismaxzakath = false;
          } else if (categoryname == 'a1') {
            this.ismaxzakath = false;
          } else if (categoryname == 'm1') {
            this.ismaxmanorg = false;
          } else if (categoryname == 'a2') {
            this.ismaxadditional = false;
          } else if (categoryname == 'a3') {
            this.ismaxadditional2 = false;
          } else if (categoryname == 'a4') {
            this.ismaxadditional3 = false;
          } else if (categoryname == 'a5') {
            this.ismaxadditional4 = false;
          } else if (categoryname == 'a6') {
            this.ismaxadditional5 = false;
          } else if (categoryname == 'f1') {
            this.ismaxfin1 = false;
          } else if (categoryname == 'f2') {
            this.ismaxfin2 = false;
          } else if (categoryname == 'f3') {
            this.ismaxfin3 = false;
          } else if (categoryname == 'e1') {
            this.ismaxorgdesign = false;
          } else if (categoryname == 'e2') {
            this.ismaxoutorg = false;
          } else if (categoryname == 'e3') {
            this.ismaxthirdparty = false;
          } else if (categoryname == 'e4') {
            this.ismaxbusrefr = false;
          } else if (categoryname == 'e5') {
            this.ismaxtrainInfo = false;
          } else if (categoryname == 'h1') {
            this.ismaxhse = false;
          } else if (categoryname == 'h2') {
            this.ismaxhse2 = false;
          } else if (categoryname == 'h3') {
            this.ismaxhse3 = false;
          } else if (categoryname == 'h4') {
            this.ismaxhse4 = false;
          } else if (categoryname == 'h6') {
            this.ismaxhse6 = false;
          } else if (categoryname == 'q1') {
            this.ismaxquality1 = false;
          } else if (categoryname == 'q2') {
            this.ismaxquality2 = false;
          } else if (categoryname == 'q3') {
            this.ismaxquality3 = false;
          } else if (categoryname == 'b1') {
            this.ismaxbank = false;
          } else if (categoryname == 'b2') {
            this.ismaxbankletterhead = false;
          }

        }
      }

      if (this.istempFile) {


        if (this.isRegFileAlreadyAttached) {
          this.isRegFileSelected = true;
        } else {
          if (this.firstFormGroup.get('regfiletempCtrl').hasError('invalid')) {
            this.isRegFileSelected = false;
            console.log("regfileoriCtrl is false");
          } else {
            if (this.r1FileLoaded) {
              if (this.isemptyreg) {
                this.isRegFileSelected = false;
                console.log("regfileoriCtrl is false");
              } else {
                this.isRegFileSelected = true;
                console.log("regfileoriCtrl is true");
              }
            } else {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            }
          }
        }

        if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
          if (this.isVatFileAlreadyAttached) {
            this.isVatFileSelected = true;

          } else {
            if (this.firstFormGroup.get('vatfiletempCtrl').hasError('invalid')) {
              this.isVatFileSelected = false;
              console.log("vatfileoriCtrl is false");
            } else {
              if (this.v1FileLoaded) {
                if (this.isemptyvat) {
                  this.isVatFileSelected = false;
                  console.log("vatfileoriCtrl is false");
                } else {
                  this.isVatFileSelected = true;
                  console.log("vatfileoriCtrl is true");
                }
              } else {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              }
            }
          }


          // 3. GosiFile
          if (this.isGosiFileAlreadyAttached) {
            this.isGosiFileSelected = true;

          } else {
            if (this.firstFormGroup.get('gosifiletempCtrl').hasError('invalid')) {
              this.isGosiFileSelected = false;
              console.log("gosifileoriCtrl is false");
            } else {
              if (this.g1FileLoaded) {
                if (this.isemptygosi) {
                  this.isGosiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  this.isGosiFileSelected = true;
                  console.log("gosifileoriCtrl is true");
                }


              } else {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              }
            }
          }


          // 4. SaudiFile
          if (this.isSaudiFileAlreadyAttached) {
            this.isSaudiFileSelected = true;

          } else {
            if (this.firstFormGroup.get('saudifiletempCtrl').hasError('invalid')) {
              this.isSaudiFileSelected = false;
              console.log("saudifileoriCtrl is false");
            } else {
              if (this.s1FileLoaded) {
                if (this.isemptysaudi) {
                  this.isSaudiFileSelected = false;
                  console.log("saudifileoriCtrl is false");
                } else {
                  this.isSaudiFileSelected = true;
                  console.log("saudifileoriCtrl is true");
                }


              } else {
                this.isSaudiFileSelected = false;
                console.log("saudifileoriCtrl is false");
              }
            }
          }


          // 5. ZakathFile
          if (this.isZakathFileAlreadyAttached) {
            this.isZakathFileSelected = true;

          } else {
            if (this.firstFormGroup.get('zakathfiletempCtrl').hasError('invalid')) {
              this.isZakathFileSelected = false;
              console.log("zakathfileoriCtrl is false");
            } else {
              if (this.z1FileLoaded) {
                if (this.isemptyzakath) {
                  this.isZakathFileSelected = false;
                  console.log("zakathfileoriCtrl is false");
                } else {
                  this.isZakathFileSelected = true;
                  console.log("zakathfileoriCtrl is true");
                }

              } else {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              }
            }
          }
        } else {

          this.isVatFileSelected = true;

          this.isGosiFileSelected = true;

          this.isSaudiFileSelected = true;

          this.isZakathFileSelected = true;

        }

      }

      if (!this.istempFile) {

        // 1. RegFile
        if (this.isRegFileAlreadyAttached) {
          this.isRegFileSelected = true;
        } else {
          if (this.firstFormGroup.get('regfileoriCtrl').hasError('invalid')) {
            this.isRegFileSelected = false;
            console.log("regfileoriCtrl is false");
          } else {
            if (this.r1FileLoaded) {
              if (this.isemptyreg) {
                this.isRegFileSelected = false;
                console.log("regfileoriCtrl is false");
              } else {
                if (this.ismaxreg) {
                  this.isRegFileSelected = false;
                  console.log("regfileoriCtrl is false");
                } else {
                  this.isRegFileSelected = true;
                  console.log("regfileoriCtrl is true");
                }
              }
            } else {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            }
          }
        }

        if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
          if (this.isVatFileAlreadyAttached) {
            this.isVatFileSelected = true;
          } else {
            if (this.firstFormGroup.get('vatfileoriCtrl').hasError('invalid')) {
              this.isVatFileSelected = false;
              console.log("vatfileoriCtrl is false");
            } else {
              if (this.v1FileLoaded) {
                if (this.isemptyvat) {
                  this.isVatFileSelected = false;
                  console.log("vatfileoriCtrl is false");
                } else {
                  if (this.ismaxvat) {
                    this.isVatFileSelected = false;
                    console.log("vatfileoriCtrl is false");
                  } else {
                    this.isVatFileSelected = true;
                    console.log("vatfileoriCtrl is true");
                  }
                }
              } else {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              }
            }
          }

          // 3. GosiFile
          if (this.isGosiFileAlreadyAttached) {
            this.isGosiFileSelected = true;
          } else {
            if (this.firstFormGroup.get('gosifileoriCtrl').hasError('invalid')) {
              this.isGosiFileSelected = false;
              console.log("gosifileoriCtrl is false");
            } else {
              if (this.g1FileLoaded) {
                if (this.isemptygosi) {
                  this.isGosiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  if (this.ismaxgosi) {
                    this.isGosiFileSelected = false;
                    console.log("gosifileoriCtrl is false");
                  } else {
                    this.isGosiFileSelected = true;
                    console.log("gosifileoriCtrl is true");
                  }
                }
              } else {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              }
            }
          }

          // 4. SaudiFile
          if (this.isSaudiFileAlreadyAttached) {
            this.isSaudiFileSelected = true;
          } else {
            if (this.firstFormGroup.get('saudifileoriCtrl').hasError('invalid')) {
              this.isSaudiFileSelected = false;
              console.log("saudifileoriCtrl is false");
            } else {
              if (this.s1FileLoaded) {
                if (this.isemptygosi) {
                  this.isSaudiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                } else {
                  if (this.ismaxgosi) {
                    this.isSaudiFileSelected = false;
                    console.log("gosifileoriCtrl is false");
                  } else {
                    this.isSaudiFileSelected = true;
                    console.log("gosifileoriCtrl is true");
                  }
                }
              } else {
                this.isSaudiFileSelected = false;
                console.log("saudifileoriCtrl is false");
              }
            }
          }

          // 5. ZakathFile
          if (this.isZakathFileAlreadyAttached) {
            this.isZakathFileSelected = true;
          } else {
            if (this.firstFormGroup.get('zakathfileoriCtrl').hasError('invalid')) {
              this.isZakathFileSelected = false;
              console.log("zakathfileoriCtrl is false");
            } else {
              if (this.z1FileLoaded) {
                if (this.isemptyzakath) {
                  this.isZakathFileSelected = false;
                  console.log("zakathfileoriCtrl is false");
                } else {
                  if (this.ismaxzakath) {
                    this.isZakathFileSelected = false;
                    console.log("zakathfileoriCtrl is false");
                  } else {
                    this.isZakathFileSelected = true;
                    console.log("zakathfileoriCtrl is true");
                  }
                }
              } else {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              }
            }
          }
        } else {

          this.isVatFileSelected = true;

          this.isGosiFileSelected = true;

          this.isSaudiFileSelected = true;

          this.isZakathFileSelected = true;

        }
      }

      if (filesize > 0) {
        if (filesize > 5000000) {

        } else {
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

            this.selectedFilesSize += files[i].size;
            this.selectedFileName.push(newFilename);
            this.selectedFiles.push(files[i]);
          }

        }
      }
    }
    this.counting++;
  }

  uploadFilesSubmit2(files: FileList, categoryname: string) {
    if (this.counting == 0) {
      this.selectedFiles = [];
    }

    // const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);


    if (files.length == 0) {
      console.log('No file is attached - no file length');


      // console.log('file items : ' + files[i].name);
      // if (files[i].name.includes(searchTags)) {
      //   // this.uploaderTemp.removeFromQueue(fileItem);
      //   delete this.selectedFiles[i];
      //   console.log('file deleted');
      //   console.log('New length of the queue: ' + this.selectedFiles.length);

      // }

      if (categoryname == 'r1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('r1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.RegFile_name = "";
        this.isRegFileSelected = false;
        this.isRegFile_name = false;


      } else if (categoryname == 'v1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('v1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.VatFile_name = "";
        this.isVatFileSelected = false;
        this.isVatFile_name = false;


      } else if (categoryname == 'g1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('g1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.GosiFile_name = "";
        this.isGosiFileSelected = false;
        this.isGosiFile_name = false;


      } else if (categoryname == 's1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('s1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.SaudiFile_name = "";
        this.isSaudiFileSelected = false;
        this.isSaudiFile_name = false;



      } else if (categoryname == 'z1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('z1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.ZakathFile_name = "";
        this.isZakathFileSelected = false;
        this.isZakathFile_name = false;


      } else if (categoryname == 'a1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AssociationFile_name = "";
        this.isAssociationFile_name = false;


      } else if (categoryname == 'm1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('m1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.OrgaizationChartFile_name = "";
        this.isOrgaizationChartFile_name = false;


      } else if (categoryname == 'a2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile_name = "";
        this.isAdditionalFile_name = false;


      } else if (categoryname == 'a3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile2_name = "";
        this.isAdditionalFile2_name = false;


      } else if (categoryname == 'a4') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a4')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile3_name = "";
        this.isAdditionalFile3_name = false;


      } else if (categoryname == 'a5') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a5')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile4_name = "";
        this.isAdditionalFile4_name = false;


      } else if (categoryname == 'a6') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('a6')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.AdditionalFile5_name = "";
        this.isAdditionalFile5_name = false;


      } else if (categoryname == 'f1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('f1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinancialYear1File_name = "";
        this.isFinancialYear1File_name = false;


      } else if (categoryname == 'f2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('f2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinancialYear2File_name = "";
        this.isFinancialYear2File_name = false;



      } else if (categoryname == 'f3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('f3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinancialYear3File_name = "";
        this.isFinancialYear3File_name = false;


      } else if (categoryname == 'e1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.DesignFile_name = "";
        this.isDesignnCapCtrlSelected = false;
        this.isDesignFile_name = false;


      } else if (categoryname == 'e2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.FinishFile_name = "";
        this.isFinishProdCtrlSelected = false;
        this.isFinishFile_name = false;


      } else if (categoryname == 'e3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.RegisteredFile_name = "";
        this.isRegisteredOrgCtrlSelected = false;
        this.isRegisteredFile_name = false;


      } else if (categoryname == 'e4') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e4')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.BusinessReferencesFile_name = "";
        this.isBusinessReferencesFile_name = false;


      } else if (categoryname == 'e5') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('e5')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.ComplianceFile_name = "";
        this.isCompliance1CtrlSelected = false;
        this.isComplianceFile_name = false;


      } else if (categoryname == 'h1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.HseFile_name = "";
        this.isHse1CtrlSelected = false;
        this.isHseFile_name = false;


      } else if (categoryname == 'h2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.DocuFile_name = "";
        this.isDocuHseCtrlSelected = false;
        this.isDocuFile_name = false;


      } else if (categoryname == 'h3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.ISOHealthFile_name = "";
        this.isIsohealthCtrlSelected = false;
        this.isISOHealthFile_name = false;


      } else if (categoryname == 'h4') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h4')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.EnvtFile_name = "";
        this.isEnvtMgt1CtrlSelected = false;
        this.isEnvtFile_name = false;


      } else if (categoryname == 'h6') {
        console.log(this.selectedFileName);
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('h6')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }


        this.StatisticFile_name = "";
        // this.isStatisticCtrlSelected = false;
        this.isStatisticFile_name = false;



      } else if (categoryname == 'q1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('q1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.QualityPolicyFile_name = "";
        this.isQualityPolicy1CtrlSelected = false;
        this.isQualityPolicyFile_name = false;


      } else if (categoryname == 'q2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('q2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.QualityMgtFile_name = "";
        this.isQualityMgtCtrlSelected = false;
        this.isQualityMgtFile_name = false;


      } else if (categoryname == 'q3') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('q3')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.QualityMgtISOFile_name = "";
        this.isQualityMgtIsoCtrlSelected = false;
        this.isQualityMgtISOFile_name = false;


      } else if (categoryname == 'b1') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('b1')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.BankFile_name = "";
        this.b1FileLoaded = false;
        this.isBankFile_name = false;


      } else if (categoryname == 'b2') {
        // Remove filename form filename array
        for (let i = 0; i < this.selectedFileName.length; i++) {
          if (this.selectedFileName[i].includes('b2')) {
            const index: number = this.selectedFileName.indexOf(this.selectedFileName[i]);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          }
        }

        this.BankLetterHeadFile_name = "";
        this.b2FileLoaded = false;
        this.isBankLetterHeadFile_name = false;


      }
    }

    var searchTags = "_" + categoryname;

    for (let i = 0; i < files.length; i++) {

      if (categoryname == 'r1') {

        if (this.r1_count > 1) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            delete this.selectedFiles[i];
            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);
          }
        }
        this.r1_count = this.r1_count + 1;
      } else if (categoryname == 'v1') {
        if (this.v1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.v1_count = this.v1_count + 1;
      } else if (categoryname == 'g1') {
        if (this.g1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.g1_count = this.g1_count + 1;

      } else if (categoryname == 's1') {
        if (this.s1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.s1_count = this.s1_count + 1;

      } else if (categoryname == 'z1') {
        if (this.z1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.z1_count = this.z1_count + 1;

      } else if (categoryname == 'a1') {
        if (this.a1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.a1_count = this.a1_count + 1;

      } else if (categoryname == 'm1') {
        if (this.m1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.m1_count = this.m1_count + 1;

      } else if (categoryname == 'a2') {
        if (this.a2_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a3') {
        if (this.a3_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a4') {
        if (this.a4_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a5') {
        if (this.a5_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'a6') {
        if (this.a6_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        // this.a2_count = this.a2_count+1;

      } else if (categoryname == 'f1') {
        if (this.f1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.f1_count = this.f1_count + 1;

      } else if (categoryname == 'f2') {
        if (this.f2_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.f2_count = this.f2_count + 1;

      } else if (categoryname == 'f3') {
        if (this.f3_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.f3_count = this.f3_count + 1;

      } else if (categoryname == 'e1') {
        if (this.e1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.e1_count = this.e1_count + 1;


      } else if (categoryname == 'e2') {
        if (this.e2_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.e2_count = this.e2_count + 1;


      } else if (categoryname == 'e3') {
        if (this.e3_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.e3_count = this.e3_count + 1;

      } else if (categoryname == 'e4') {
        if (this.e4_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.e4_count = this.e4_count + 1;

      } else if (categoryname == 'e5') {
        if (this.e5_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.e5_count = this.e5_count + 1;

      } else if (categoryname == 'h1') {
        if (this.h1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.h1_count = this.h1_count + 1;

      } else if (categoryname == 'h2') {
        if (this.h2_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.h2_count = this.h2_count + 1;

      } else if (categoryname == 'h3') {
        if (this.h3_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.h3_count = this.h3_count + 1;

      } else if (categoryname == 'h4') {
        if (this.h4_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.h4_count = this.h4_count + 1;

      } else if (categoryname == 'h6') {
        if (this.h6_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.h6_count = this.h6_count + 1;

      } else if (categoryname == 'q1') {
        if (this.q1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.q1_count = this.q1_count + 1;

      } else if (categoryname == 'q2') {
        if (this.q2_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.q2_count = this.q2_count + 1;

      } else if (categoryname == 'q3') {
        if (this.q3_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.q3_count = this.q3_count + 1;

      } else if (categoryname == 'b1') {
        if (this.b1_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.b1_count = this.b1_count + 1;

      } else if (categoryname == 'b2') {
        if (this.b2_count > 1) {
          // for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + files[i].name);
          console.log('file items : ' + files);
          if (files[i].name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            delete this.selectedFiles[i];

            console.log('file deleted');
            console.log('New length of the file: ' + files.length);
            console.log('New length of the file list in array: ' + this.selectedFiles.length);

          }
          // }
        }
        this.b2_count = this.b2_count + 1;

      }
      console.log(files.length);



      if (!files.length) {
        console.log('No file is attached - no file length');

        console.log('file items : ' + files[i].name);
        if (files[i].name.includes(searchTags)) {
          // this.uploaderTemp.removeFromQueue(fileItem);
          delete this.selectedFiles[i];
          console.log('file deleted');
          console.log('New length of the queue: ' + this.selectedFiles.length);

        }

        if (categoryname == 'r1') {
          this.RegFile_name = "";
          this.isRegFile_name = false;
        } else if (categoryname == 'v1') {
          this.VatFile_name = "";
          this.isVatFile_name = false;

        } else if (categoryname == 'g1') {
          this.GosiFile_name = "";
          this.isGosiFile_name = false;

        } else if (categoryname == 's1') {
          this.SaudiFile_name = "";
          this.isSaudiFile_name = false;

        } else if (categoryname == 'z1') {
          this.ZakathFile_name = "";
          this.isZakathFile_name = false;

        } else if (categoryname == 'a1') {
          this.AssociationFile_name = "";
          this.isAssociationFile_name = false;

        } else if (categoryname == 'm1') {
          this.OrgaizationChartFile_name = "";
          this.isOrgaizationChartFile_name = false;

        } else if (categoryname == 'a2') {
          this.AdditionalFile_name = "";
          this.isAdditionalFile_name = false;

        } else if (categoryname == 'a3') {
          this.AdditionalFile2_name = "";
          this.isAdditionalFile2_name = false;

        } else if (categoryname == 'a4') {
          this.AdditionalFile3_name = "";
          this.isAdditionalFile3_name = false;

        } else if (categoryname == 'a5') {
          this.AdditionalFile4_name = "";
          this.isAdditionalFile4_name = false;

        } else if (categoryname == 'a6') {
          this.AdditionalFile5_name = "";
          this.isAdditionalFile5_name = false;

        } else if (categoryname == 'f1') {
          this.FinancialYear1File_name = "";
          this.isFinancialYear1File_name = false;

        } else if (categoryname == 'f2') {
          this.FinancialYear2File_name = "";
          this.isFinancialYear2File_name = false;


        } else if (categoryname == 'f3') {
          this.FinancialYear3File_name = "";
          this.isFinancialYear3File_name = false;


        } else if (categoryname == 'e1') {
          this.DesignFile_name = "";
          this.isDesignFile_name = false;

        } else if (categoryname == 'e2') {
          this.FinishFile_name = "";
          this.isFinishFile_name = false;

        } else if (categoryname == 'e3') {
          this.RegisteredFile_name = "";
          this.isRegisteredFile_name = false;

        } else if (categoryname == 'e4') {
          this.BusinessReferencesFile_name = "";
          this.isBusinessReferencesFile_name = false;

        } else if (categoryname == 'e5') {
          this.ComplianceFile_name = "";
          this.isComplianceFile_name = false;

        } else if (categoryname == 'h1') {
          this.HseFile_name = "";
          this.isHseFile_name = false;

        } else if (categoryname == 'h2') {
          this.DocuFile_name = "";
          this.isDocuFile_name = false;

        } else if (categoryname == 'h3') {
          this.ISOHealthFile_name = "";
          this.isISOHealthFile_name = false;

        } else if (categoryname == 'h4') {
          this.EnvtFile_name = "";
          this.isEnvtFile_name = false;

        } else if (categoryname == 'h6') {
          this.StatisticFile_name = "";
          this.isStatisticFile_name = false;

        } else if (categoryname == 'q1') {
          this.QualityPolicyFile_name = "";
          this.isQualityPolicyFile_name = false;

        } else if (categoryname == 'q2') {
          this.QualityMgtFile_name = "";
          this.isQualityMgtFile_name = false;

        } else if (categoryname == 'q3') {
          this.QualityMgtISOFile_name = "";
          this.isQualityMgtISOFile_name = false;

        } else if (categoryname == 'b1') {
          this.BankFile_name = "";
          this.isBankFile_name = false;

        } else if (categoryname == 'b2') {
          this.BankLetterHeadFile_name = "";
          this.isBankLetterHeadFile_name = false;

        }
      }


      console.log('Categorized name: ' + categoryname);
      console.log('Length: ' + this.selectedFiles.length);
      var length = files.length;
      console.log('Lenth of the Upload Queue' + length);
      if (length > 0) {

        if (this.isNeedmoreInfo) {
          this.filesChanged += categoryname + ',';
        }

        this.fileName = files[i].name;
        this.fileType = files[i].name.split('.')[1];

        var filetypeposition = files[i].name.split('.').length - 1;
        var newFilenameFormat = files[i].name.split('.')[filetypeposition];
        var newFilename = '_' + categoryname + '.' + newFilenameFormat;

        // if(categoryname == "m1" || categoryname == "e1" || categoryname == "e2" || categoryname == "e3" || categoryname == "e4" || categoryname == "h1" ||   categoryname == "h1" || categoryname == "h2" || categoryname == "h3" || categoryname == "h4" || categoryname == "h6" || categoryname == "q1" || categoryname == "q2" || categoryname == "q3" || categoryname == "a2" || categoryname == "a3" || categoryname == "a4" || categoryname == "a5" || categoryname == "a6"){
        //   this.actualFileName += categoryname + '_' + files[i].name + '~';
        // }
        // if(categoryname == "h1" || categoryname == "h2" || categoryname == "h3" || categoryname == "h4" || categoryname == "h6" || categoryname == "q1" || categoryname == "q2" || categoryname == "q3"){
        //   this.actualFileName += categoryname + '_' + files[i].name + '~';
        // }

        var newFilenameLength = newFilename.length;
        console.log("filename length is:" + newFilename.length);
        console.log("The file name is : " + newFilename);
        var filesize = files[i].size;

        if (files && files[i]) {
          const fileURL = URL.createObjectURL(files[0]);
          this.url = fileURL;
          this.section = true;
        }

        /* Unsupported format file check Starts */
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

          var fileURL = "";

          if (files.length == 1) {
            fileURL = URL.createObjectURL(files[i]);
          }

          if (categoryname == 'r1') {

            if (files && files[i]) {
              this.r1url = fileURL;
              this.r1section = true;
              this.r1fileName = files[i].name;
              this.r1fileType = files[i].name.split('.')[1];
            }

            this.isFormatreg = false;
            if (files.length == 0) {
              this.r1FileLoaded = false;
              this.firstFormGroup.get('regfileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isRegFileSelected = false;
            } else if (files.length == 1) {
              this.RegFile_name = this.fileName;
              this.isRegFile_name = true;
              console.log(this.RegFile_name);
              this.r1FileLoaded = true;
              this.isRegFileSelected = true;
              this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
              console.log('Length is one');
            }
          } else if (categoryname == 'v1') {
            if (files && files[i]) {
              this.v1url = fileURL;
              this.v1section = true;

              this.v1fileName = files[i].name;
              this.v1fileType = files[i].name.split('.')[1];
            }

            this.isFormatvat = false;
            if (files.length == 0) {
              this.v1FileLoaded = false;
              this.isVatFileSelected = false;

              this.firstFormGroup.get('vatfileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.VatFile_name = this.fileName;
              this.isVatFile_name = true;
              this.v1FileLoaded = true;
              this.isVatFileSelected = true;

              this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
              console.log('Length is one');
            }
          } else if (categoryname == 'g1') {
            if (files && files[i]) {
              this.g1url = fileURL;
              this.g1section = true;

              this.g1fileName = files[i].name;
              this.g1fileType = files[i].name.split('.')[1];
            }

            this.isFormatgosi = false;
            if (files.length == 0) {
              this.g1FileLoaded = false;
              this.isGosiFileSelected = false;

              this.firstFormGroup.get('gosifileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.GosiFile_name = this.fileName;
              this.isGosiFile_name = true;
              this.g1FileLoaded = true;
              this.isGosiFileSelected = true;

              this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
              console.log('Length is one');
            }
          } else if (categoryname == 's1') {
            if (files && files[i]) {
              this.s1url = fileURL;
              this.s1section = true;

              this.s1fileName = files[i].name;
              this.s1fileType = files[i].name.split('.')[1];
            }

            this.isFormatsaudi = false;
            if (files.length == 0) {
              this.s1FileLoaded = false;
              this.isSaudiFileSelected = false;

              this.firstFormGroup.get('saudifileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.SaudiFile_name = this.fileName;
              this.isSaudiFile_name = true;
              this.s1FileLoaded = true;
              this.isSaudiFileSelected = true;

              this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
              console.log('Length is one');
            }
          } else if (categoryname == 'z1') {
            if (files && files[i]) {
              this.z1url = fileURL;
              this.z1section = true;

              this.z1fileName = files[i].name;
              this.z1fileType = files[i].name.split('.')[1];
            }

            this.isFormatzakath = false;
            if (files.length == 0) {
              this.z1FileLoaded = false;
              this.isZakathFileSelected = false;

              this.firstFormGroup.get('zakathfileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.ZakathFile_name = this.fileName;
              this.isZakathFile_name = true;
              this.z1FileLoaded = true;
              this.isZakathFileSelected = true;

              this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();
              console.log('Length is one');
            }
          } else if (categoryname == 'a1') {
            if (files && files[i]) {
              this.a1url = fileURL;
              this.a1section = true;

              this.a1fileName = files[i].name;
              this.a1fileType = files[i].name.split('.')[1];
            }

            this.isFormatassociation = false;
            if (files.length == 0) {
              this.a1FileLoaded = false;
              // this.firstFormGroup.get('associationfileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.AssociationFile_name = this.fileName;
              this.isAssociationFile_name = true;
              this.a1FileLoaded = true;
              this.firstFormGroup.get('associationfileoriCtrl').markAsUntouched();
              console.log('Length is one');
            }
          } else if (categoryname == 'm1') {
            if (files && files[i]) {
              this.OrgaizationChartFile_name = this.fileName;
              this.isOrgaizationChartFile_name = true;
              this.m1url = fileURL;
              this.m1section = true;

              this.m1fileName = files[i].name;
              this.m1fileType = files[i].name.split('.')[1];
            }

            this.isFormatmanorg = false;
          } else if (categoryname == 'a2') {
            if (files && files[i]) {
              this.AdditionalFile_name = this.fileName;
              this.isAdditionalFile_name = true;
              this.a2url = fileURL;
              this.a2section = true;

              this.a2fileName = files[i].name;
              this.a2fileType = files[i].name.split('.')[1];
            }

            this.isFormatadditional = false;
          } else if (categoryname == 'a3') {
            if (files && files[i]) {
              this.AdditionalFile2_name = this.fileName;
              this.isAdditionalFile2_name = true;
              this.a3url = fileURL;
              this.a3section = true;

              this.a3fileName = files[i].name;
              this.a3fileType = files[i].name.split('.')[1];
            }

            this.isFormatadditional2 = false;
          } else if (categoryname == 'a4') {
            if (files && files[i]) {
              this.AdditionalFile3_name = this.fileName;
              this.isAdditionalFile3_name = true;
              this.a4url = fileURL;
              this.a4section = true;

              this.a4fileName = files[i].name;
              this.a4fileType = files[i].name.split('.')[1];
            }

            this.isFormatadditional3 = false;
          } else if (categoryname == 'a5') {
            if (files && files[i]) {
              this.AdditionalFile4_name = this.fileName;
              this.isAdditionalFile4_name = true;
              this.a5url = fileURL;
              this.a5section = true;

              this.a5fileName = files[i].name;
              this.a5fileType = files[i].name.split('.')[1];
            }

            this.isFormatadditional = false;
          } else if (categoryname == 'a6') {
            if (files && files[i]) {
              this.AdditionalFile5_name = this.fileName;
              this.isAdditionalFile5_name = true;
              this.a6url = fileURL;
              this.a6section = true;

              this.a6fileName = files[i].name;
              this.a6fileType = files[i].name.split('.')[1];
            }

            this.isFormatadditional = false;
          } else if (categoryname == 'f1') {
            if (files && files[i]) {
              this.FinancialYear1File_name = this.fileName;
              this.isFinancialYear1File_name = true;
              this.f1url = fileURL;
              this.f1section = true;

              this.f1fileName = files[i].name;
              this.f1fileType = files[i].name.split('.')[1];
            }

            this.isFormatfin1 = false;
          } else if (categoryname == 'f2') {
            if (files && files[i]) {
              this.FinancialYear2File_name = this.fileName;
              this.isFinancialYear2File_name = true;
              this.f2url = fileURL;
              this.f2section = true;

              this.f2fileName = files[i].name;
              this.f2fileType = files[i].name.split('.')[1];
            }

            this.isFormatfin2 = false;
          } else if (categoryname == 'f3') {
            if (files && files[i]) {
              this.FinancialYear3File_name = this.fileName;
              this.isFinancialYear3File_name = true;
              this.f3url = fileURL;
              this.f3section = true;

              this.f3fileName = files[i].name;
              this.f3fileType = files[i].name.split('.')[1];
            }

            this.isFormatfin3 = false;
          } else if (categoryname == 'e1') {
            if (files && files[i]) {
              this.e1url = fileURL;
              this.e1section = true;

              this.e1fileName = files[i].name;
              this.e1fileType = files[i].name.split('.')[1];
            }

            this.isFormatorgdesign = false;
            if (files.length == 0) {
              this.e1FileLoaded = false;
              this.secondFormGroup.get('designoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isDesignnCapCtrlSelected = false;

            } else if (files.length == 1) {
              this.DesignFile_name = this.fileName;
              this.isDesignFile_name = true;
              this.e1FileLoaded = true;
              this.secondFormGroup.get('designoriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isDesignnCapCtrlSelected = true;

            }
          } else if (categoryname == 'e2') {
            if (files && files[i]) {
              this.e2url = fileURL;
              this.e2section = true;

              this.e2fileName = files[i].name;
              this.e2fileType = files[i].name.split('.')[1];
            }

            this.isFormatoutorg = false;
            if (files.length == 0) {
              this.e2FileLoaded = false;
              this.secondFormGroup.get('finishoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isFinishProdCtrlSelected = false;

            } else if (files.length == 1) {
              this.FinishFile_name = this.fileName;
              this.isFinishFile_name = true;
              this.isFinancialYear1File_name = true;
              this.e2FileLoaded = true;
              this.secondFormGroup.get('finishoriCtrl').markAsUntouched()
              console.log('Length is one');
              this.isFinishProdCtrlSelected = true;

            }
          } else if (categoryname == 'e3') {
            if (files && files[i]) {
              this.e3url = fileURL;
              this.e3section = true;

              this.e3fileName = files[i].name;
              this.e3fileType = files[i].name.split('.')[1];
            }
            this.isFormatthirdparty = false;
            if (files.length == 0) {
              this.e3FileLoaded = false;
              this.secondFormGroup.get('registeredoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isRegisteredOrgCtrlSelected = false;

            } else if (files.length == 1) {
              this.RegisteredFile_name = this.fileName;
              this.isRegisteredFile_name = true;
              this.e3FileLoaded = true;
              this.secondFormGroup.get('registeredoriCtrl').markAsUntouched()
              console.log('Length is one');
              this.isRegisteredOrgCtrlSelected = true;

            }
          } else if (categoryname == 'e4') {
            if (files && files[i]) {
              this.e4url = fileURL;
              this.e4section = true;

              this.e4fileName = files[i].name;
              this.e4fileType = files[i].name.split('.')[1];
            }
            this.isFormatbusrefr = false;
            if (files.length == 0) {
              this.e4FileLoaded = false;
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.BusinessReferencesFile_name = this.fileName;
              this.isBusinessReferencesFile_name = this.fileName;

              this.e4FileLoaded = true;
              console.log('Length is one');
            }
          } else if (categoryname == 'e5') {
            if (files && files[i]) {
              this.e5url = fileURL;
              this.e5section = true;

              this.e5fileName = files[i].name;
              this.e5fileType = files[i].name.split('.')[1];
            }

            this.isFormattrainInfo = false;
            if (files.length == 0) {
              this.e5FileLoaded = false;
              this.secondFormGroup.get('complianceoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isCompliance1CtrlSelected = false;

            } else if (files.length == 1) {
              this.ComplianceFile_name = this.fileName;

              this.isComplianceFile_name = true;
              this.e5FileLoaded = true;
              this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isCompliance1CtrlSelected = true;

            }
          } else if (categoryname == 'h1') {
            if (files && files[i]) {
              this.h1url = fileURL;
              this.h1section = true;

              this.h1fileName = files[i].name;
              this.h1fileType = files[i].name.split('.')[1];
            }

            this.isFormathse = false;
            if (files.length == 0) {
              this.h1FileLoaded = false;
              this.secondFormGroup.get('hseoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isHse1CtrlSelected = false;

            } else if (files.length == 1) {
              this.HseFile_name = this.fileName;
              this.isHseFile_name = true;
              this.h1FileLoaded = true;
              this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isHse1CtrlSelected = true;

            }
          } else if (categoryname == 'h2') {
            if (files && files[i]) {
              this.h2url = fileURL;
              this.h2section = true;

              this.h2fileName = files[i].name;
              this.h2fileType = files[i].name.split('.')[1];
            }

            this.isFormathse2 = false;
            if (files.length == 0) {
              this.h2FileLoaded = false;
              this.secondFormGroup.get('docuoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isDocuHseCtrlSelected = false;

            } else if (files.length == 1) {
              this.DocuFile_name = this.fileName;
              this.isDocuFile_name = true;
              this.h2FileLoaded = true;
              this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isDocuHseCtrlSelected = true;

            }
          } else if (categoryname == 'h3') {
            if (files && files[i]) {
              this.h3url = fileURL;
              this.h3section = true;

              this.h3fileName = files[i].name;
              this.h3fileType = files[i].name.split('.')[1];
            }
            this.isFormathse3 = false;
            if (files.length == 0) {
              this.h3FileLoaded = false;
              this.secondFormGroup.get('isohealthoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isIsohealthCtrlSelected = false;

            } else if (files.length == 1) {
              this.ISOHealthFile_name = this.fileName;
              this.isISOHealthFile_name = true;
              this.h3FileLoaded = true;
              this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isIsohealthCtrlSelected = true;

            }
          } else if (categoryname == 'h4') {
            if (files && files[i]) {
              this.h4url = fileURL;
              this.h4section = true;

              this.h4fileName = files[i].name;
              this.h4fileType = files[i].name.split('.')[1];
            }

            this.isFormathse4 = false;
            if (files.length == 0) {
              this.h4FileLoaded = false;
              this.secondFormGroup.get('envtoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isEnvtMgt1CtrlSelected = false;

            } else if (files.length == 1) {
              this.EnvtFile_name = this.fileName;
              this.isEnvtFile_name = true;
              this.h4FileLoaded = true;
              this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isEnvtMgt1CtrlSelected = true;

            }

          } else if (categoryname == 'h6') {
            if (files && files[i]) {
              this.h6url = fileURL;
              this.h6section = true;

              this.h6fileName = files[i].name;
              this.h6fileType = files[i].name.split('.')[1];
            }

            this.isFormathse6 = false;
            if (files.length == 0) {
              this.h6FileLoaded = false;
              this.secondFormGroup.get('StatisticoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              // this.isStatisticCtrlSelected = false;

            } else if (files.length == 1) {
              this.StatisticFile_name = this.fileName;
              this.isStatisticFile_name = true;
              this.h6FileLoaded = true;
              this.secondFormGroup.get('StatisticoriCtrl').markAsUntouched();
              console.log('Length is one');
              // this.isStatisticCtrlSelected = true;

            }



          } else if (categoryname == 'q1') {
            if (files && files[i]) {
              this.q1url = fileURL;
              this.q1section = true;

              this.q1fileName = files[i].name;
              this.q1fileType = files[i].name.split('.')[1];
            }
            this.isFormatquality1 = false;
            if (files.length == 0) {
              this.q1FileLoaded = false;
              this.secondFormGroup.get('qualityPolicyoriCtrl').setErrors({ invalid: true });
              this.isQualityPolicy1CtrlSelected = false;
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.QualityPolicyFile_name = this.fileName;
              this.isQualityPolicyFile_name = true;
              this.q1FileLoaded = true;
              this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
              this.isQualityPolicy1CtrlSelected = true;
              console.log('Length is one');
            }
          } else if (categoryname == 'q2') {
            if (files && files[i]) {
              this.q2url = fileURL;
              this.q2section = true;

              this.q2fileName = files[i].name;
              this.q2fileType = files[i].name.split('.')[1];
            }
            this.isFormatquality2 = false;
            if (files.length == 0) {
              this.q2FileLoaded = false;
              this.secondFormGroup.get('qualityMgtoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isQualityMgtCtrlSelected = false;
            } else if (files.length == 1) {
              this.QualityMgtFile_name = this.fileName;
              this.isQualityMgtFile_name = true;
              this.q2FileLoaded = true;
              this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
              this.secondFormGroup.get('qualityMgtoriCtrl').setErrors({ invalid: null });
              this.secondFormGroup.get('qualityMgtoriCtrl').updateValueAndValidity();
              console.log('Length is one');
              this.isQualityMgtCtrlSelected = true;

            }
          } else if (categoryname == 'q3') {
            if (files && files[i]) {
              this.q3url = fileURL;
              this.q3section = true;

              this.q3fileName = files[i].name;
              this.q3fileType = files[i].name.split('.')[1];
            }
            this.isFormatquality3 = false;
            if (files.length == 0) {
              this.q3FileLoaded = false;
              this.secondFormGroup.get('qualityMgtIsooriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
              this.isQualityMgtIsoCtrlSelected = false;

            } else if (files.length == 1) {
              this.QualityMgtISOFile_name = this.fileName;
              this.isQualityMgtISOFile_name = true;
              this.q3FileLoaded = true;
              this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
              console.log('Length is one');
              this.isQualityMgtIsoCtrlSelected = true;

            }
          } else if (categoryname == 'b1') {
            if (files && files[i]) {
              this.b1url = fileURL;
              this.b1section = true;

              this.b1fileName = files[i].name;
              this.b1fileType = files[i].name.split('.')[1];
            }

            this.isFormatbank = false;
            if (files.length == 0) {
              this.b1FileLoaded = false;
              this.thirdFormGroup.get('bankfileoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.BankFile_name = this.fileName;
              this.isBankFile_name = true;
              this.b1FileLoaded = true;
              this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched()
              console.log('Length is one');
            }
          } else if (categoryname == 'b2') {
            if (files && files[i]) {
              this.b2url = fileURL;
              this.b2section = true;

              this.b2fileName = files[i].name;
              this.b2fileType = files[i].name.split('.')[1];
            }

            this.isFormatbankletterhead = false;
            if (files.length == 0) {
              this.b2FileLoaded = false;
              this.thirdFormGroup.get('bankfileletterheadoriCtrl').setErrors({ invalid: true });
              console.log('Length is zero');
            } else if (files.length == 1) {
              this.BankLetterHeadFile_name = this.fileName;
              this.isBankLetterHeadFile_name = true;
              this.b2FileLoaded = true;
              this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsUntouched()
              console.log('Length is one');
            }
          }
        } else {
          if (categoryname == 'r1') {
            this.isFormatreg = true;

            this.r1FileLoaded = false;
            console.log('File is not supported, so its false');

          } else if (categoryname == 'v1') {
            this.isFormatvat = true;
          } else if (categoryname == 'g1') {
            this.isFormatgosi = true;
          } else if (categoryname == 's1') {
            this.isFormatsaudi = true;
          } else if (categoryname == 'z1') {
            this.isFormatzakath = true;
          } else if (categoryname == 'a1') {
            this.isFormatassociation = true;
          } else if (categoryname == 'm1') {
            this.isFormatmanorg = true;
          } else if (categoryname == 'a2') {
            this.isFormatadditional = true;
          } else if (categoryname == 'a3') {
            this.isFormatadditional2 = true;
          } else if (categoryname == 'a4') {
            this.isFormatadditional3 = true;
          } else if (categoryname == 'a5') {
            this.isFormatadditional4 = true;
          } else if (categoryname == 'a6') {
            this.isFormatadditional5 = true;
          } else if (categoryname == 'f1') {
            this.isFormatfin1 = true;
          } else if (categoryname == 'f2') {
            this.isFormatfin2 = true;
          } else if (categoryname == 'f3') {
            this.isFormatfin3 = true;
          } else if (categoryname == 'e1') {
            this.isFormatorgdesign = true;

            this.e1FileLoaded = false;
            console.log('File is not supported, so its false');

          } else if (categoryname == 'e2') {
            this.isFormatoutorg = true;

            this.e2FileLoaded = false;
            console.log('File is not supported, so its false');

          } else if (categoryname == 'e3') {
            this.isFormatthirdparty = true;

            this.e3FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'e4') {
            this.isFormatbusrefr = true;

            this.e4FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'e5') {
            this.isFormattrainInfo = true;

            this.e5FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h1') {
            this.isFormathse = true;

            this.h1FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h2') {
            this.isFormathse2 = true;

            this.h2FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h3') {
            this.isFormathse3 = true;

            this.h3FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h4') {
            this.isFormathse4 = true;

            this.h4FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'h6') {
            this.isFormathse6 = true;

            this.h6FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'q1') {
            this.isFormatquality1 = true;

            this.q1FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'q2') {
            this.isFormatquality2 = true;

            this.q2FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'q3') {
            this.isFormatquality3 = true;

            this.q3FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'b1') {
            this.isFormatbank = true;
            this.b1FileLoaded = false;
            console.log('File is not supported, so its false');
          } else if (categoryname == 'b2') {
            this.isFormatbankletterhead = true;
            this.b2FileLoaded = false;
            console.log('File is not supported, so its false');
          }
        }

        if (filesize == 0) {
          if (categoryname == 'r1') {
            this.isemptyreg = true;
            this.isregadded = false;
          } else if (categoryname == 'v1') {
            this.isemptyvat = true;
          } else if (categoryname == 'g1') {
            this.isemptygosi = true;
          } else if (categoryname == 's1') {
            this.isemptysaudi = true;
          } else if (categoryname == 'z1') {
            this.isemptyzakath = true;
          } else if (categoryname == 'a1') {
            this.isemptyassociation = true;
          } else if (categoryname == 'm1') {
            this.isemptymanorg = true;
          } else if (categoryname == 'a2') {
            this.isemptyadditional = true;
          } else if (categoryname == 'a3') {
            this.isemptyadditional2 = true;
          } else if (categoryname == 'a4') {
            this.isemptyadditional3 = true;
          } else if (categoryname == 'a5') {
            this.isemptyadditional4 = true;
          } else if (categoryname == 'a6') {
            this.isemptyadditional5 = true;
          } else if (categoryname == 'f1') {
            this.isemptyfin1 = true;
          } else if (categoryname == 'f2') {
            this.isemptyfin2 = true;
          } else if (categoryname == 'f3') {
            this.isemptyfin3 = true;
          } else if (categoryname == 'e1') {
            this.isemptyorgdesign = true;
          } else if (categoryname == 'e2') {
            this.isemptyoutorg = true;
          } else if (categoryname == 'e3') {
            this.isemptythirdparty = true;
          } else if (categoryname == 'e4') {
            this.isemptybusrefr = true;
          } else if (categoryname == 'e5') {
            this.isemptytrainInfo = true;
          } else if (categoryname == 'h1') {
            this.isemptyhse = true;
          } else if (categoryname == 'h2') {
            this.isemptyhse2 = true;
          } else if (categoryname == 'h3') {
            this.isemptyhse3 = true;
          } else if (categoryname == 'h4') {
            this.isemptyhse4 = true;
          } else if (categoryname == 'h6') {
            this.StatisticFile_name = files[i].name;
            this.isemptyhse6 = true;
            // Remove filename form filename array
            const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);
            // Remove filename form file[] array
            // Delete the item from fileNames list
            this.selectedFileName.splice(index, 1);
            // delete file from FileList
            this.selectedFiles.splice(index, 1);
          } else if (categoryname == 'q1') {
            this.isemptyquality1 = true;
          } else if (categoryname == 'q2') {
            this.isemptyquality2 = true;
          } else if (categoryname == 'q3') {
            this.isemptyquality3 = true;
          } else if (categoryname == 'b1') {
            this.isemptybank = true;
            this.isbankadded = false;
          } else if (categoryname == 'b2') {
            this.isemptybankletterhead = true;
            this.isbankletterheadadded = false;
          }
        } else {
          if (categoryname == 'r1') {
            this.isemptyreg = false;
            this.isregadded = true;
            this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'v1') {
            this.isemptyvat = false;
            this.isemptygosi = false;
            this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'g1') {
            this.isemptygosi = false;
            this.isemptygosi = false;
            this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
          } else if (categoryname == 's1') {
            this.isemptysaudi = false;
            this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
          } else if (categoryname == 'z1') {
            this.isemptyzakath = false;
            this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'a1') {
            this.isemptyzakath = false;
            this.firstFormGroup.get('associationfiletempCtrl').markAsUntouched();
            this.firstFormGroup.get('associationfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'm1') {
            this.isemptymanorg = false;
          } else if (categoryname == 'a2') {
            this.isemptyadditional = false;
          } else if (categoryname == 'a3') {
            this.isemptyadditional2 = false;
          } else if (categoryname == 'a4') {
            this.isemptyadditional3 = false;
          } else if (categoryname == 'a5') {
            this.isemptyadditional4 = false;
          } else if (categoryname == 'a6') {
            this.isemptyadditional5 = false;
          } else if (categoryname == 'f1') {
            this.isemptyfin1 = false;
          } else if (categoryname == 'f2') {
            this.isemptyfin2 = false;
          } else if (categoryname == 'f3') {
            this.isemptyfin3 = false;
          } else if (categoryname == 'e1') {
            this.isemptyorgdesign = false;
            this.secondFormGroup.get('designtempCtrl').markAsUntouched();
            this.secondFormGroup.get('designoriCtrl').markAsUntouched();
          } else if (categoryname == 'e2') {
            this.isemptyoutorg = false;
            this.secondFormGroup.get('finishtempCtrl').markAsUntouched();
            this.secondFormGroup.get('finishoriCtrl').markAsUntouched();
          } else if (categoryname == 'e3') {
            this.isemptythirdparty = false;
            this.secondFormGroup.get('registeredtempCtrl').markAsUntouched();
            this.secondFormGroup.get('registeredoriCtrl').markAsUntouched();
          } else if (categoryname == 'e4') {
            this.isemptybusrefr = false;
          } else if (categoryname == 'e5') {
            this.isemptytrainInfo = false;
            this.secondFormGroup.get('compliancetempCtrl').markAsUntouched();
            this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
          } else if (categoryname == 'h1') {
            this.isemptyhse = false;
            this.secondFormGroup.get('hsetempCtrl').markAsUntouched();
            this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
          } else if (categoryname == 'h2') {
            this.isemptyhse2 = false;
            this.secondFormGroup.get('docutempCtrl').markAsUntouched();
            this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
          } else if (categoryname == 'h3') {
            this.isemptyhse3 = false;
            this.secondFormGroup.get('isohealthtempCtrl').markAsUntouched();
            this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
          } else if (categoryname == 'h4') {
            this.isemptyhse4 = false;
            this.secondFormGroup.get('envttempCtrl').markAsUntouched();
            this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
          } else if (categoryname == 'h6') {
            this.isemptyhse6 = false;
            this.secondFormGroup.get('statisticTempCtrl').markAsUntouched();
            this.secondFormGroup.get('StatisticoriCtrl').markAsUntouched();
          } else if (categoryname == 'q1') {
            this.isemptyquality1 = false;
            this.secondFormGroup.get('qualityPolicytempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
          } else if (categoryname == 'q2') {
            this.isemptyquality2 = false;
            this.secondFormGroup.get('qualityMgttempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
          } else if (categoryname == 'q3') {
            this.isemptyquality3 = false;
            this.secondFormGroup.get('qualityMgtIsotempCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
          } else if (categoryname == 'b1') {
            this.isemptybank = false;
            this.isbankadded = true;
            this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
            this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
          } else if (categoryname == 'b2') {
            this.isemptybankletterhead = false;
            this.isbankletterheadadded = true;
            this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
            this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsUntouched();
          }

        }
        /** End of empty file change */
        var searchTag = "_" + categoryname;
        console.log('File size  is : ' + filesize);
        if (filesize > 5000000) {
          if (categoryname == 'r1') {
            this.ismaxreg = true;
            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
              delete this.selectedFiles[i];
            }
            console.log('New length of the queue: ' + files.length);
          } else if (categoryname == 'v1') {
            this.ismaxvat = true;
            // for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }
            // }

            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'g1') {
            this.ismaxgosi = true;
            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 's1') {
            this.ismaxsaudi = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'z1') {
            this.ismaxzakath = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a1') {
            this.ismaxassociation = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'm1') {
            this.ismaxmanorg = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a2') {
            this.ismaxadditional = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a3') {
            this.ismaxadditional2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a4') {
            this.ismaxadditional3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a5') {
            this.ismaxadditional4 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'a6') {
            this.ismaxadditional5 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              // delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'f1') {
            this.ismaxfin1 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'f2') {
            this.ismaxfin2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'f3') {
            this.ismaxfin3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e1') {
            this.ismaxorgdesign = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e2') {
            this.ismaxoutorg = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e3') {
            this.ismaxthirdparty = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e4') {
            this.ismaxbusrefr = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'e5') {
            this.ismaxtrainInfo = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h1') {
            this.ismaxhse = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h2') {
            this.ismaxhse2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h3') {
            this.ismaxhse3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'h4') {
            this.ismaxhse4 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          } else if (categoryname == 'h6') {
            this.ismaxhse6 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }

          } else if (categoryname == 'q1') {
            this.ismaxquality1 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'q2') {
            this.ismaxquality2 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'q3') {
            this.ismaxquality3 = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'b1') {
            this.ismaxbank = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          } else if (categoryname == 'b2') {
            this.ismaxbankletterhead = true;

            console.log('file items : ' + files[i].name);
            if (files[i].name.includes(searchTag)) {
              delete this.selectedFiles[i];
            }


            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
          }
        } else {
          if (categoryname == 'r1') {
            this.ismaxreg = false;
          } else if (categoryname == 'v1') {
            this.ismaxvat = false;
          } else if (categoryname == 'g1') {
            this.ismaxgosi = false;
          } else if (categoryname == 's1') {
            this.ismaxsaudi = false;
          } else if (categoryname == 'z1') {
            this.ismaxzakath = false;
          } else if (categoryname == 'a1') {
            this.ismaxzakath = false;
          } else if (categoryname == 'm1') {
            this.ismaxmanorg = false;
          } else if (categoryname == 'a2') {
            this.ismaxadditional = false;
          } else if (categoryname == 'a3') {
            this.ismaxadditional2 = false;
          } else if (categoryname == 'a4') {
            this.ismaxadditional3 = false;
          } else if (categoryname == 'a5') {
            this.ismaxadditional4 = false;
          } else if (categoryname == 'a6') {
            this.ismaxadditional5 = false;
          } else if (categoryname == 'f1') {
            this.ismaxfin1 = false;
          } else if (categoryname == 'f2') {
            this.ismaxfin2 = false;
          } else if (categoryname == 'f3') {
            this.ismaxfin3 = false;
          } else if (categoryname == 'e1') {
            this.ismaxorgdesign = false;
          } else if (categoryname == 'e2') {
            this.ismaxoutorg = false;
          } else if (categoryname == 'e3') {
            this.ismaxthirdparty = false;
          } else if (categoryname == 'e4') {
            this.ismaxbusrefr = false;
          } else if (categoryname == 'e5') {
            this.ismaxtrainInfo = false;
          } else if (categoryname == 'h1') {
            this.ismaxhse = false;
          } else if (categoryname == 'h2') {
            this.ismaxhse2 = false;
          } else if (categoryname == 'h3') {
            this.ismaxhse3 = false;
          } else if (categoryname == 'h4') {
            this.ismaxhse4 = false;
          } else if (categoryname == 'h6') {
            this.ismaxhse6 = false;
          } else if (categoryname == 'q1') {
            this.ismaxquality1 = false;
          } else if (categoryname == 'q2') {
            this.ismaxquality2 = false;
          } else if (categoryname == 'q3') {
            this.ismaxquality3 = false;
          } else if (categoryname == 'b1') {
            this.ismaxbank = false;
          } else if (categoryname == 'b2') {
            this.ismaxbankletterhead = false;
          }

        }

        if (this.istempFile) {


          if (this.isRegFileAlreadyAttached) {
            this.isRegFileSelected = true;
          } else {
            if (this.firstFormGroup.get('regfiletempCtrl').hasError('invalid')) {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            } else {
              if (this.r1FileLoaded) {
                if (this.isemptyreg) {
                  this.isRegFileSelected = false;
                  console.log("regfileoriCtrl is false");
                } else {
                  this.isRegFileSelected = true;
                  console.log("regfileoriCtrl is true");
                }
              } else {
                this.isRegFileSelected = false;
                console.log("regfileoriCtrl is false");
              }
            }
          }

          if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
            if (this.isVatFileAlreadyAttached) {
              this.isVatFileSelected = true;

            } else {
              if (this.firstFormGroup.get('vatfiletempCtrl').hasError('invalid')) {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              } else {
                if (this.v1FileLoaded) {
                  if (this.isemptyvat) {
                    this.isVatFileSelected = false;
                    console.log("vatfileoriCtrl is false");
                  } else {
                    this.isVatFileSelected = true;
                    console.log("vatfileoriCtrl is true");
                  }
                } else {
                  this.isVatFileSelected = false;
                  console.log("vatfileoriCtrl is false");
                }
              }
            }


            // 3. GosiFile
            if (this.isGosiFileAlreadyAttached) {
              this.isGosiFileSelected = true;

            } else {
              if (this.firstFormGroup.get('gosifiletempCtrl').hasError('invalid')) {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                if (this.g1FileLoaded) {
                  if (this.isemptygosi) {
                    this.isGosiFileSelected = false;
                    console.log("gosifileoriCtrl is false");
                  } else {
                    this.isGosiFileSelected = true;
                    console.log("gosifileoriCtrl is true");
                  }


                } else {
                  this.isGosiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                }
              }
            }


            // 4. SaudiFile
            if (this.isSaudiFileAlreadyAttached) {
              this.isSaudiFileSelected = true;

            } else {
              if (this.firstFormGroup.get('saudifiletempCtrl').hasError('invalid')) {
                this.isSaudiFileSelected = false;
                console.log("saudifileoriCtrl is false");
              } else {
                if (this.s1FileLoaded) {
                  if (this.isemptysaudi) {
                    this.isSaudiFileSelected = false;
                    console.log("saudifileoriCtrl is false");
                  } else {
                    this.isSaudiFileSelected = true;
                    console.log("saudifileoriCtrl is true");
                  }


                } else {
                  this.isSaudiFileSelected = false;
                  console.log("saudifileoriCtrl is false");
                }
              }
            }


            // 5. ZakathFile
            if (this.isZakathFileAlreadyAttached) {
              this.isZakathFileSelected = true;

            } else {
              if (this.firstFormGroup.get('zakathfiletempCtrl').hasError('invalid')) {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              } else {
                if (this.z1FileLoaded) {
                  if (this.isemptyzakath) {
                    this.isZakathFileSelected = false;
                    console.log("zakathfileoriCtrl is false");
                  } else {
                    this.isZakathFileSelected = true;
                    console.log("zakathfileoriCtrl is true");
                  }

                } else {
                  this.isZakathFileSelected = false;
                  console.log("zakathfileoriCtrl is false");
                }
              }
            }
          } else {

            this.isVatFileSelected = true;

            this.isGosiFileSelected = true;

            this.isSaudiFileSelected = true;

            this.isZakathFileSelected = true;

          }

        }

        if (!this.istempFile) {

          // 1. RegFile
          if (this.isRegFileAlreadyAttached) {
            this.isRegFileSelected = true;
          } else {
            if (this.firstFormGroup.get('regfileoriCtrl').hasError('invalid')) {
              this.isRegFileSelected = false;
              console.log("regfileoriCtrl is false");
            } else {
              if (this.r1FileLoaded) {
                if (this.isemptyreg) {
                  this.isRegFileSelected = false;
                  console.log("regfileoriCtrl is false");
                } else {
                  if (this.ismaxreg) {
                    this.isRegFileSelected = false;
                    console.log("regfileoriCtrl is false");
                  } else {
                    this.isRegFileSelected = true;
                    console.log("regfileoriCtrl is true");
                  }
                }
              } else {
                this.isRegFileSelected = false;
                console.log("regfileoriCtrl is false");
              }
            }
          }

          if (this.firstFormGroup.value.countryCtrl == 'SAUDI ARABIA') {
            if (this.isVatFileAlreadyAttached) {
              this.isVatFileSelected = true;
            } else {
              if (this.firstFormGroup.get('vatfileoriCtrl').hasError('invalid')) {
                this.isVatFileSelected = false;
                console.log("vatfileoriCtrl is false");
              } else {
                if (this.v1FileLoaded) {
                  if (this.isemptyvat) {
                    this.isVatFileSelected = false;
                    console.log("vatfileoriCtrl is false");
                  } else {
                    if (this.ismaxvat) {
                      this.isVatFileSelected = false;
                      console.log("vatfileoriCtrl is false");
                    } else {
                      this.isVatFileSelected = true;
                      console.log("vatfileoriCtrl is true");
                    }
                  }
                } else {
                  this.isVatFileSelected = false;
                  console.log("vatfileoriCtrl is false");
                }
              }
            }

            // 3. GosiFile
            if (this.isGosiFileAlreadyAttached) {
              this.isGosiFileSelected = true;
            } else {
              if (this.firstFormGroup.get('gosifileoriCtrl').hasError('invalid')) {
                this.isGosiFileSelected = false;
                console.log("gosifileoriCtrl is false");
              } else {
                if (this.g1FileLoaded) {
                  if (this.isemptygosi) {
                    this.isGosiFileSelected = false;
                    console.log("gosifileoriCtrl is false");
                  } else {
                    if (this.ismaxgosi) {
                      this.isGosiFileSelected = false;
                      console.log("gosifileoriCtrl is false");
                    } else {
                      this.isGosiFileSelected = true;
                      console.log("gosifileoriCtrl is true");
                    }
                  }
                } else {
                  this.isGosiFileSelected = false;
                  console.log("gosifileoriCtrl is false");
                }
              }
            }

            // 4. SaudiFile
            if (this.isSaudiFileAlreadyAttached) {
              this.isSaudiFileSelected = true;
            } else {
              if (this.firstFormGroup.get('saudifileoriCtrl').hasError('invalid')) {
                this.isSaudiFileSelected = false;
                console.log("saudifileoriCtrl is false");
              } else {
                if (this.s1FileLoaded) {
                  if (this.isemptygosi) {
                    this.isSaudiFileSelected = false;
                    console.log("gosifileoriCtrl is false");
                  } else {
                    if (this.ismaxgosi) {
                      this.isSaudiFileSelected = false;
                      console.log("gosifileoriCtrl is false");
                    } else {
                      this.isSaudiFileSelected = true;
                      console.log("gosifileoriCtrl is true");
                    }
                  }
                } else {
                  this.isSaudiFileSelected = false;
                  console.log("saudifileoriCtrl is false");
                }
              }
            }

            // 5. ZakathFile
            if (this.isZakathFileAlreadyAttached) {
              this.isZakathFileSelected = true;
            } else {
              if (this.firstFormGroup.get('zakathfileoriCtrl').hasError('invalid')) {
                this.isZakathFileSelected = false;
                console.log("zakathfileoriCtrl is false");
              } else {
                if (this.z1FileLoaded) {
                  if (this.isemptyzakath) {
                    this.isZakathFileSelected = false;
                    console.log("zakathfileoriCtrl is false");
                  } else {
                    if (this.ismaxzakath) {
                      this.isZakathFileSelected = false;
                      console.log("zakathfileoriCtrl is false");
                    } else {
                      this.isZakathFileSelected = true;
                      console.log("zakathfileoriCtrl is true");
                    }
                  }
                } else {
                  this.isZakathFileSelected = false;
                  console.log("zakathfileoriCtrl is false");
                }
              }
            }
          } else {

            this.isVatFileSelected = true;

            this.isGosiFileSelected = true;

            this.isSaudiFileSelected = true;

            this.isZakathFileSelected = true;

          }
        }
      }

      if (filesize > 0) {
        if (filesize > 5000000) {

        } else {
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

            this.selectedFilesSize += files[i].size;
            // this.selectedFilesSize.push(files[i].size);
            this.selectedFileName.push(newFilename);
            this.selectedFiles.push(files[i]);
          }
        }

      }
    }
    this.counting++;
  }

  uploadFilesSubmit(categoryname: string, input) {


    var searchTags = "_" + categoryname;

    if (categoryname == 'r1') {

      if (this.r1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.r1_count = this.r1_count + 1;

    } else if (categoryname == 'v1') {
      if (this.v1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.v1_count = this.v1_count + 1;
    } else if (categoryname == 'g1') {
      if (this.g1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.g1_count = this.g1_count + 1;

    } else if (categoryname == 's1') {
      if (this.s1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.s1_count = this.s1_count + 1;

    } else if (categoryname == 'z1') {
      if (this.z1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.z1_count = this.z1_count + 1;

    } else if (categoryname == 'a1') {
      if (this.a1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.a1_count = this.a1_count + 1;

    } else if (categoryname == 'm1') {
      if (this.m1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.m1_count = this.m1_count + 1;

    } else if (categoryname == 'a2') {
      if (this.a2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a3') {
      if (this.a3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a4') {
      if (this.a4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a5') {
      if (this.a5_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'a6') {
      if (this.a6_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            // this.uploaderTemp.removeFromQueue(fileItem);
            // console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      // this.a2_count = this.a2_count+1;

    } else if (categoryname == 'f1') {
      if (this.f1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.f1_count = this.f1_count + 1;

    } else if (categoryname == 'f2') {
      if (this.f2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.f2_count = this.f2_count + 1;

    } else if (categoryname == 'f3') {
      if (this.f3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.f3_count = this.f3_count + 1;

    } else if (categoryname == 'e1') {
      if (this.e1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e1_count = this.e1_count + 1;


    } else if (categoryname == 'e2') {
      if (this.e2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e2_count = this.e2_count + 1;


    } else if (categoryname == 'e3') {
      if (this.e3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e3_count = this.e3_count + 1;

    } else if (categoryname == 'e4') {
      if (this.e4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e4_count = this.e4_count + 1;

    } else if (categoryname == 'e5') {
      if (this.e5_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.e5_count = this.e5_count + 1;

    } else if (categoryname == 'h1') {
      if (this.h1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h1_count = this.h1_count + 1;

    } else if (categoryname == 'h2') {
      if (this.h2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h2_count = this.h2_count + 1;

    } else if (categoryname == 'h3') {
      if (this.h3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h3_count = this.h3_count + 1;

    } else if (categoryname == 'h4') {
      if (this.h4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h4_count = this.h4_count + 1;

    } else if (categoryname == 'h6') {
      if (this.h4_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.h6_count = this.h6_count + 1;

    } else if (categoryname == 'q1') {
      if (this.q1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.q1_count = this.q1_count + 1;

    } else if (categoryname == 'q2') {
      if (this.q2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.q2_count = this.q2_count + 1;

    } else if (categoryname == 'q3') {
      if (this.q3_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

          }
        }
      }
      this.q3_count = this.q3_count + 1;

    } else if (categoryname == 'b1') {
      if (this.b1_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
            this.b1FileLoaded = false;

          }
        }
      }
      this.b1_count = this.b1_count + 1;

    } else if (categoryname == 'b2') {
      if (this.b2_count > 1) {
        for (const fileItem of this.uploaderTemp.queue) {
          console.log('file items : ' + fileItem.file.name);
          if (fileItem.file.name.includes(searchTags)) {
            this.uploaderTemp.removeFromQueue(fileItem);
            console.log('file deleted');
            console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
            this.b2FileLoaded = false;
          }
        }
      }
      this.b2_count = this.b2_count + 1;

    }
    console.log(input.files.length);


    if (!input.files.length) {
      console.log('No file is attached - no file length');

      for (const fileItem of this.uploaderTemp.queue) {
        console.log('file items : ' + fileItem.file.name);
        if (fileItem.file.name.includes(searchTags)) {
          this.uploaderTemp.removeFromQueue(fileItem);
          console.log('file deleted');
          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);

        }
      }

      if (categoryname == 'r1') {
        this.RegFile_name = "";
        this.isRegFile_name = false;
      } else if (categoryname == 'v1') {
        this.VatFile_name = "";
        this.isVatFile_name = false;

      } else if (categoryname == 'g1') {
        this.GosiFile_name = "";
        this.isGosiFile_name = false;

      } else if (categoryname == 's1') {
        this.SaudiFile_name = "";
        this.isSaudiFile_name = false;

      } else if (categoryname == 'z1') {
        this.ZakathFile_name = "";
        this.isZakathFile_name = false;

      } else if (categoryname == 'a1') {
        this.AssociationFile_name = "";
        this.isAssociationFile_name = false;

      } else if (categoryname == 'm1') {
        this.OrgaizationChartFile_name = "";
        this.isOrgaizationChartFile_name = false;

      } else if (categoryname == 'a2') {
        this.AdditionalFile_name = "";
        this.isAdditionalFile_name = false;

      } else if (categoryname == 'a3') {
        this.AdditionalFile2_name = "";
        this.isAdditionalFile2_name = false;

      } else if (categoryname == 'a4') {
        this.AdditionalFile3_name = "";
        this.isAdditionalFile3_name = false;

      } else if (categoryname == 'a5') {
        this.AdditionalFile4_name = "";
        this.isAdditionalFile4_name = false;

      } else if (categoryname == 'a6') {
        this.AdditionalFile5_name = "";
        this.isAdditionalFile5_name = false;

      } else if (categoryname == 'f1') {
        this.FinancialYear1File_name = "";
        this.isFinancialYear1File_name = false;

      } else if (categoryname == 'f2') {
        this.FinancialYear2File_name = "";
        this.isFinancialYear2File_name = false;


      } else if (categoryname == 'f3') {
        this.FinancialYear3File_name = "";
        this.isFinancialYear3File_name = false;


      } else if (categoryname == 'e1') {
        this.DesignFile_name = "";
        this.isDesignFile_name = false;

      } else if (categoryname == 'e2') {
        this.FinishFile_name = "";
        this.isFinishFile_name = false;

      } else if (categoryname == 'e3') {
        this.RegisteredFile_name = "";
        this.isRegisteredFile_name = false;

      } else if (categoryname == 'e4') {
        this.BusinessReferencesFile_name = "";
        this.isBusinessReferencesFile_name = false;

      } else if (categoryname == 'e5') {
        this.ComplianceFile_name = "";
        this.isComplianceFile_name = false;

      } else if (categoryname == 'h1') {
        this.HseFile_name = "";
        this.isHseFile_name = false;

      } else if (categoryname == 'h2') {
        this.DocuFile_name = "";
        this.isDocuFile_name = false;

      } else if (categoryname == 'h3') {
        this.ISOHealthFile_name = "";
        this.isISOHealthFile_name = false;

      } else if (categoryname == 'h4') {
        this.EnvtFile_name = "";
        this.isEnvtFile_name = false;
      } else if (categoryname == 'h6') {
        this.StatisticFile_name = "";
        this.isStatisticFile_name = false;

      } else if (categoryname == 'q1') {
        this.QualityPolicyFile_name = "";
        this.isQualityPolicyFile_name = false;

      } else if (categoryname == 'q2') {
        this.QualityMgtFile_name = "";
        this.isQualityMgtFile_name = false;

      } else if (categoryname == 'q3') {
        this.QualityMgtISOFile_name = "";
        this.isQualityMgtISOFile_name = false;

      } else if (categoryname == 'b1') {
        this.BankFile_name = "";
        this.isBankFile_name = false;

      } else if (categoryname == 'b2') {
        this.BankLetterHeadFile_name = "";
        this.isBankLetterHeadFile_name = false;

      }
    }

    console.log('Categorized name: ' + categoryname);
    console.log('Length: ' + this.uploaderTemp.queue.length);
    var length = this.uploaderTemp.queue.length;
    console.log('Lenth of the Upload Queue' + length);
    if (length > 0) {
      const oldFileItem: FileItem = this.uploaderTemp.queue[length - 1];
      // var uniq = (new Date()).getTime();
      // this.supplierIdForFile = 147;
      this.fileName = oldFileItem.file.name;
      this.fileType = oldFileItem.file.name.split('.')[1];



      var newFilename = '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
      var newFilenameLength = newFilename.length
      console.log("filename length is:" + newFilename.length);
      console.log("The file name is : " + newFilename);
      // var newFilename = oldFileItem.file.name.split('.')[0] + '_' + categoryname + '.' + oldFileItem.file.name.split('.')[1];
      var filesize = oldFileItem.file.size;

      if (input.files && input.files[0]) {
        // var reader = new FileReader();

        // reader.readAsDataURL(input.files[0]); // read file as data url
        // reader. // read file as data url


        const fileURL = URL.createObjectURL(input.files[0]);

        this.url = fileURL;

        // if(input.files[0]){
        this.section = true;
        // }



        // window.open(fileURL, '_blank');

        // reader.onload = (input) => { // called once readAsDataURL is completed
        //   this.url = input.target.result;
        //   // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
        //   console.log(this.url);
        // }
      }

      /* Unsupported format file check Starts */
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

        var fileURL = "";

        if (input.files.length == 1) {

          fileURL = URL.createObjectURL(input.files[0]);
        }

        if (categoryname == 'r1') {

          if (input.files && input.files[0]) {
            this.r1url = fileURL;
            this.r1section = true;

            this.r1fileName = oldFileItem.file.name;
            this.r1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatreg = false;
          if (input.files.length == 0) {
            this.r1FileLoaded = false;
            this.firstFormGroup.get('regfileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isRegFileSelected = false;

          } else if (input.files.length == 1) {
            this.RegFile_name = this.fileName;
            this.isRegFile_name = true;
            console.log(this.RegFile_name);
            this.r1FileLoaded = true;
            this.isRegFileSelected = true;
            this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();
            // this.firstFormGroup.get('regfiletempCtrl').setErrors(null);
            console.log('Length is one');
          }
        } else if (categoryname == 'v1') {
          if (input.files && input.files[0]) {
            this.v1url = fileURL;
            this.v1section = true;

            this.v1fileName = oldFileItem.file.name;
            this.v1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatvat = false;
          if (input.files.length == 0) {
            this.v1FileLoaded = false;
            this.isVatFileSelected = false;

            this.firstFormGroup.get('vatfileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.VatFile_name = this.fileName;
            this.isVatFile_name = true;
            this.v1FileLoaded = true;
            this.isVatFileSelected = true;

            this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
            console.log('Length is one');
          }
        } else if (categoryname == 'g1') {
          if (input.files && input.files[0]) {
            this.g1url = fileURL;
            this.g1section = true;

            this.g1fileName = oldFileItem.file.name;
            this.g1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatgosi = false;
          if (input.files.length == 0) {
            this.g1FileLoaded = false;
            this.isGosiFileSelected = false;

            this.firstFormGroup.get('gosifileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.GosiFile_name = this.fileName;
            this.isGosiFile_name = true;
            this.g1FileLoaded = true;
            this.isGosiFileSelected = true;

            this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
            console.log('Length is one');
          }
        } else if (categoryname == 's1') {
          if (input.files && input.files[0]) {
            this.s1url = fileURL;
            this.s1section = true;

            this.s1fileName = oldFileItem.file.name;
            this.s1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatsaudi = false;
          if (input.files.length == 0) {
            this.s1FileLoaded = false;
            this.isSaudiFileSelected = false;

            this.firstFormGroup.get('saudifileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.SaudiFile_name = this.fileName;
            this.isSaudiFile_name = true;
            this.s1FileLoaded = true;
            this.isSaudiFileSelected = true;

            this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
            console.log('Length is one');
          }
        } else if (categoryname == 'z1') {
          if (input.files && input.files[0]) {
            this.z1url = fileURL;
            this.z1section = true;

            this.z1fileName = oldFileItem.file.name;
            this.z1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatzakath = false;
          if (input.files.length == 0) {
            this.z1FileLoaded = false;
            this.isZakathFileSelected = false;

            this.firstFormGroup.get('zakathfileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.ZakathFile_name = this.fileName;
            this.isZakathFile_name = true;
            this.z1FileLoaded = true;
            this.isZakathFileSelected = true;

            this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();
            console.log('Length is one');
          }
        } else if (categoryname == 'a1') {
          if (input.files && input.files[0]) {
            this.a1url = fileURL;
            this.a1section = true;

            this.a1fileName = oldFileItem.file.name;
            this.a1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatassociation = false;
          if (input.files.length == 0) {
            this.a1FileLoaded = false;
            // this.firstFormGroup.get('associationfileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.AssociationFile_name = this.fileName;
            this.isAssociationFile_name = true;
            this.a1FileLoaded = true;
            this.firstFormGroup.get('associationfileoriCtrl').markAsUntouched();
            console.log('Length is one');
          }
        } else if (categoryname == 'm1') {
          if (input.files && input.files[0]) {
            this.OrgaizationChartFile_name = this.fileName;
            this.isOrgaizationChartFile_name = true;
            this.m1url = fileURL;
            this.m1section = true;

            this.m1fileName = oldFileItem.file.name;
            this.m1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatmanorg = false;
        } else if (categoryname == 'a2') {
          if (input.files && input.files[0]) {
            this.AdditionalFile_name = this.fileName;
            this.isAdditionalFile_name = true;
            this.a2url = fileURL;
            this.a2section = true;

            this.a2fileName = oldFileItem.file.name;
            this.a2fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatadditional = false;
        } else if (categoryname == 'a3') {
          if (input.files && input.files[0]) {
            this.AdditionalFile2_name = this.fileName;
            this.isAdditionalFile2_name = true;
            this.a3url = fileURL;
            this.a3section = true;

            this.a3fileName = oldFileItem.file.name;
            this.a3fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatadditional2 = false;
        } else if (categoryname == 'a4') {
          if (input.files && input.files[0]) {
            this.AdditionalFile3_name = this.fileName;
            this.isAdditionalFile3_name = true;
            this.a4url = fileURL;
            this.a4section = true;

            this.a4fileName = oldFileItem.file.name;
            this.a4fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatadditional3 = false;
        } else if (categoryname == 'a5') {
          if (input.files && input.files[0]) {
            this.AdditionalFile4_name = this.fileName;
            this.isAdditionalFile4_name = true;
            this.a5url = fileURL;
            this.a5section = true;

            this.a5fileName = oldFileItem.file.name;
            this.a5fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatadditional = false;
        } else if (categoryname == 'a6') {
          if (input.files && input.files[0]) {
            this.AdditionalFile5_name = this.fileName;
            this.isAdditionalFile5_name = true;
            this.a6url = fileURL;
            this.a6section = true;

            this.a6fileName = oldFileItem.file.name;
            this.a6fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatadditional = false;
        } else if (categoryname == 'f1') {
          if (input.files && input.files[0]) {
            this.FinancialYear1File_name = this.fileName;
            this.isFinancialYear1File_name = true;
            this.f1url = fileURL;
            this.f1section = true;

            this.f1fileName = oldFileItem.file.name;
            this.f1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatfin1 = false;
        } else if (categoryname == 'f2') {
          if (input.files && input.files[0]) {
            this.FinancialYear2File_name = this.fileName;
            this.isFinancialYear2File_name = true;
            this.f2url = fileURL;
            this.f2section = true;

            this.f2fileName = oldFileItem.file.name;
            this.f2fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatfin2 = false;
        } else if (categoryname == 'f3') {
          if (input.files && input.files[0]) {
            this.FinancialYear3File_name = this.fileName;
            this.isFinancialYear3File_name = true;
            this.f3url = fileURL;
            this.f3section = true;

            this.f3fileName = oldFileItem.file.name;
            this.f3fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatfin3 = false;
        } else if (categoryname == 'e1') {
          if (input.files && input.files[0]) {
            this.e1url = fileURL;
            this.e1section = true;

            this.e1fileName = oldFileItem.file.name;
            this.e1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatorgdesign = false;
          if (input.files.length == 0) {
            this.e1FileLoaded = false;
            this.secondFormGroup.get('designoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isDesignnCapCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.DesignFile_name = this.fileName;
            this.isDesignFile_name = true;
            this.e1FileLoaded = true;
            this.secondFormGroup.get('designoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isDesignnCapCtrlSelected = true;

          }
        } else if (categoryname == 'e2') {
          if (input.files && input.files[0]) {
            this.e2url = fileURL;
            this.e2section = true;

            this.e2fileName = oldFileItem.file.name;
            this.e2fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatoutorg = false;
          if (input.files.length == 0) {
            this.e2FileLoaded = false;
            this.secondFormGroup.get('finishoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isFinishProdCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.FinishFile_name = this.fileName;
            this.isFinishFile_name = true;
            this.isFinancialYear1File_name = true;
            this.e2FileLoaded = true;
            this.secondFormGroup.get('finishoriCtrl').markAsUntouched()
            console.log('Length is one');
            this.isFinishProdCtrlSelected = true;

          }
        } else if (categoryname == 'e3') {
          if (input.files && input.files[0]) {
            this.e3url = fileURL;
            this.e3section = true;

            this.e3fileName = oldFileItem.file.name;
            this.e3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatthirdparty = false;
          if (input.files.length == 0) {
            this.e3FileLoaded = false;
            this.secondFormGroup.get('registeredoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isRegisteredOrgCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.RegisteredFile_name = this.fileName;
            this.isRegisteredFile_name = true;
            this.e3FileLoaded = true;
            this.secondFormGroup.get('registeredoriCtrl').markAsUntouched()
            console.log('Length is one');
            this.isRegisteredOrgCtrlSelected = true;

          }
        } else if (categoryname == 'e4') {
          if (input.files && input.files[0]) {
            this.e4url = fileURL;
            this.e4section = true;

            this.e4fileName = oldFileItem.file.name;
            this.e4fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatbusrefr = false;
          if (input.files.length == 0) {
            this.e4FileLoaded = false;
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.BusinessReferencesFile_name = this.fileName;
            this.isBusinessReferencesFile_name = this.fileName;

            this.e4FileLoaded = true;
            console.log('Length is one');
          }
        } else if (categoryname == 'e5') {
          if (input.files && input.files[0]) {
            this.e5url = fileURL;
            this.e5section = true;

            this.e5fileName = oldFileItem.file.name;
            this.e5fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormattrainInfo = false;
          if (input.files.length == 0) {
            this.e5FileLoaded = false;
            this.secondFormGroup.get('complianceoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isCompliance1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.ComplianceFile_name = this.fileName;

            this.isComplianceFile_name = true;
            this.e5FileLoaded = true;
            this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isCompliance1CtrlSelected = true;

          }
        } else if (categoryname == 'h1') {
          if (input.files && input.files[0]) {
            this.h1url = fileURL;
            this.h1section = true;

            this.h1fileName = oldFileItem.file.name;
            this.h1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormathse = false;
          if (input.files.length == 0) {
            this.h1FileLoaded = false;
            this.secondFormGroup.get('hseoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isHse1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.HseFile_name = this.fileName;
            this.isHseFile_name = true;
            this.h1FileLoaded = true;
            this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isHse1CtrlSelected = true;

          }
        } else if (categoryname == 'h2') {
          if (input.files && input.files[0]) {
            this.h2url = fileURL;
            this.h2section = true;

            this.h2fileName = oldFileItem.file.name;
            this.h2fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormathse2 = false;
          if (input.files.length == 0) {
            this.h2FileLoaded = false;
            this.secondFormGroup.get('docuoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isDocuHseCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.DocuFile_name = this.fileName;
            this.isDocuFile_name = true;
            this.h2FileLoaded = true;
            this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isDocuHseCtrlSelected = true;

          }
        } else if (categoryname == 'h3') {
          if (input.files && input.files[0]) {
            this.h3url = fileURL;
            this.h3section = true;

            this.h3fileName = oldFileItem.file.name;
            this.h3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormathse3 = false;
          if (input.files.length == 0) {
            this.h3FileLoaded = false;
            this.secondFormGroup.get('isohealthoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isIsohealthCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.ISOHealthFile_name = this.fileName;
            this.isISOHealthFile_name = true;
            this.h3FileLoaded = true;
            this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isIsohealthCtrlSelected = true;

          }
        } else if (categoryname == 'h4') {
          if (input.files && input.files[0]) {
            this.h4url = fileURL;
            this.h4section = true;

            this.h4fileName = oldFileItem.file.name;
            this.h4fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormathse4 = false;
          if (input.files.length == 0) {
            this.h4FileLoaded = false;
            this.secondFormGroup.get('envtoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isEnvtMgt1CtrlSelected = false;

          } else if (input.files.length == 1) {
            this.EnvtFile_name = this.fileName;
            this.isEnvtFile_name = true;
            this.h4FileLoaded = true;
            this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isEnvtMgt1CtrlSelected = true;

          }

        } else if (categoryname == 'h6') {
          if (input.files && input.files[0]) {
            this.h6url = fileURL;
            this.h6section = true;

            this.h6fileName = oldFileItem.file.name;
            this.h6fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormathse6 = false;
          if (input.files.length == 0) {
            this.h6FileLoaded = false;
            this.secondFormGroup.get('StatisticoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            // this.isStatisticCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.StatisticFile_name = this.fileName;
            this.isStatisticFile_name = true;
            this.h6FileLoaded = true;
            this.secondFormGroup.get('StatisticoriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isStatisticFile_name = true;

          }

        } else if (categoryname == 'q1') {
          if (input.files && input.files[0]) {
            this.q1url = fileURL;
            this.q1section = true;

            this.q1fileName = oldFileItem.file.name;
            this.q1fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatquality1 = false;
          if (input.files.length == 0) {
            this.q1FileLoaded = false;
            this.secondFormGroup.get('qualityPolicyoriCtrl').setErrors({ invalid: true });
            this.isQualityPolicy1CtrlSelected = false;
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.QualityPolicyFile_name = this.fileName;
            this.isQualityPolicyFile_name = true;
            this.q1FileLoaded = true;
            this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
            this.isQualityPolicy1CtrlSelected = true;
            console.log('Length is one');
          }
        } else if (categoryname == 'q2') {
          if (input.files && input.files[0]) {
            this.q2url = fileURL;
            this.q2section = true;

            this.q2fileName = oldFileItem.file.name;
            this.q2fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatquality2 = false;
          if (input.files.length == 0) {
            this.q2FileLoaded = false;
            this.secondFormGroup.get('qualityMgtoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isQualityMgtCtrlSelected = false;
          } else if (input.files.length == 1) {
            this.QualityMgtFile_name = this.fileName;
            this.isQualityMgtFile_name = true;
            this.q2FileLoaded = true;
            this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
            this.secondFormGroup.get('qualityMgtoriCtrl').setErrors({ invalid: null });
            this.secondFormGroup.get('qualityMgtoriCtrl').updateValueAndValidity();
            console.log('Length is one');
            this.isQualityMgtCtrlSelected = true;

          }
        } else if (categoryname == 'q3') {
          if (input.files && input.files[0]) {
            this.q3url = fileURL;
            this.q3section = true;

            this.q3fileName = oldFileItem.file.name;
            this.q3fileType = oldFileItem.file.name.split('.')[1];
          }
          this.isFormatquality3 = false;
          if (input.files.length == 0) {
            this.q3FileLoaded = false;
            this.secondFormGroup.get('qualityMgtIsooriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
            this.isQualityMgtIsoCtrlSelected = false;

          } else if (input.files.length == 1) {
            this.QualityMgtISOFile_name = this.fileName;
            this.isQualityMgtISOFile_name = true;
            this.q3FileLoaded = true;
            this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
            console.log('Length is one');
            this.isQualityMgtIsoCtrlSelected = true;

          }
        } else if (categoryname == 'b1') {
          if (input.files && input.files[0]) {
            this.b1url = fileURL;
            this.b1section = true;

            this.b1fileName = oldFileItem.file.name;
            this.b1fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatbank = false;
          if (input.files.length == 0) {
            this.b1FileLoaded = false;
            this.thirdFormGroup.get('bankfileoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.BankFile_name = this.fileName;
            this.isBankFile_name = true;
            this.b1FileLoaded = true;
            this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched()
            console.log('Length is one');
          }
        } else if (categoryname == 'b2') {
          if (input.files && input.files[0]) {
            this.b2url = fileURL;
            this.b2section = true;

            this.b2fileName = oldFileItem.file.name;
            this.b2fileType = oldFileItem.file.name.split('.')[1];
          }

          this.isFormatbankletterhead = false;
          if (input.files.length == 0) {
            this.b2FileLoaded = false;
            this.thirdFormGroup.get('bankfileletterheadoriCtrl').setErrors({ invalid: true });
            console.log('Length is zero');
          } else if (input.files.length == 1) {
            this.BankLetterHeadFile_name = this.fileName;
            this.isBankLetterHeadFile_name = true;
            this.b2FileLoaded = true;
            this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsUntouched()
            console.log('Length is one');
          }
        }
      } else {
        if (categoryname == 'r1') {
          this.isFormatreg = true;

          this.r1FileLoaded = false;
          console.log('File is not supported, so its false');

        } else if (categoryname == 'v1') {
          this.isFormatvat = true;
        } else if (categoryname == 'g1') {
          this.isFormatgosi = true;
        } else if (categoryname == 's1') {
          this.isFormatsaudi = true;
        } else if (categoryname == 'z1') {
          this.isFormatzakath = true;
        } else if (categoryname == 'a1') {
          this.isFormatassociation = true;
        } else if (categoryname == 'm1') {
          this.isFormatmanorg = true;
        } else if (categoryname == 'a2') {
          this.isFormatadditional = true;
        } else if (categoryname == 'a3') {
          this.isFormatadditional2 = true;
        } else if (categoryname == 'a4') {
          this.isFormatadditional3 = true;
        } else if (categoryname == 'a5') {
          this.isFormatadditional4 = true;
        } else if (categoryname == 'a6') {
          this.isFormatadditional5 = true;
        } else if (categoryname == 'f1') {
          this.isFormatfin1 = true;
        } else if (categoryname == 'f2') {
          this.isFormatfin2 = true;
        } else if (categoryname == 'f3') {
          this.isFormatfin3 = true;
        } else if (categoryname == 'e1') {
          this.isFormatorgdesign = true;

          this.e1FileLoaded = false;
          console.log('File is not supported, so its false');

        } else if (categoryname == 'e2') {
          this.isFormatoutorg = true;

          this.e2FileLoaded = false;
          console.log('File is not supported, so its false');

        } else if (categoryname == 'e3') {
          this.isFormatthirdparty = true;

          this.e3FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'e4') {
          this.isFormatbusrefr = true;

          this.e4FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'e5') {
          this.isFormattrainInfo = true;

          this.e5FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h1') {
          this.isFormathse = true;

          this.h1FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h2') {
          this.isFormathse2 = true;

          this.h2FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h3') {
          this.isFormathse3 = true;

          this.h3FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h4') {
          this.isFormathse4 = true;

          this.h4FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'h6') {
          this.isFormathse6 = true;

          this.h6FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'q1') {
          this.isFormatquality1 = true;

          this.q1FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'q2') {
          this.isFormatquality2 = true;

          this.q2FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'q3') {
          this.isFormatquality3 = true;

          this.q3FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'b1') {
          this.isFormatbank = true;
          this.b1FileLoaded = false;
          console.log('File is not supported, so its false');
        } else if (categoryname == 'b2') {
          this.isFormatbankletterhead = true;
          this.b2FileLoaded = false;
          console.log('File is not supported, so its false');
        }
      }

      /* Unsupported format file check Ends */


      // if (newFilename.includes('undefined')) {
      //   if (categoryname == 'r1') {
      //     this.isFormatCorruptreg = true;
      //   }
      // } else {
      //   if (categoryname == 'r1') {
      //     this.isFormatCorruptreg = false;
      //   }
      // }

      /* Change for empty file */
      /**/


      if (filesize == 0) {
        if (categoryname == 'r1') {
          this.isemptyreg = true;
          this.isregadded = false;
        } else if (categoryname == 'v1') {
          this.isemptyvat = true;
        } else if (categoryname == 'g1') {
          this.isemptygosi = true;
        } else if (categoryname == 's1') {
          this.isemptysaudi = true;
        } else if (categoryname == 'z1') {
          this.isemptyzakath = true;
        } else if (categoryname == 'a1') {
          this.isemptyassociation = true;
        } else if (categoryname == 'm1') {
          this.isemptymanorg = true;
        } else if (categoryname == 'a2') {
          this.isemptyadditional = true;
        } else if (categoryname == 'a3') {
          this.isemptyadditional2 = true;
        } else if (categoryname == 'a4') {
          this.isemptyadditional3 = true;
        } else if (categoryname == 'a5') {
          this.isemptyadditional4 = true;
        } else if (categoryname == 'a6') {
          this.isemptyadditional5 = true;
        } else if (categoryname == 'f1') {
          this.isemptyfin1 = true;
        } else if (categoryname == 'f2') {
          this.isemptyfin2 = true;
        } else if (categoryname == 'f3') {
          this.isemptyfin3 = true;
        } else if (categoryname == 'e1') {
          this.isemptyorgdesign = true;
        } else if (categoryname == 'e2') {
          this.isemptyoutorg = true;
        } else if (categoryname == 'e3') {
          this.isemptythirdparty = true;
        } else if (categoryname == 'e4') {
          this.isemptybusrefr = true;
        } else if (categoryname == 'e5') {
          this.isemptytrainInfo = true;
        } else if (categoryname == 'h1') {
          this.isemptyhse = true;
        } else if (categoryname == 'h2') {
          this.isemptyhse2 = true;
        } else if (categoryname == 'h3') {
          this.isemptyhse3 = true;
        } else if (categoryname == 'h4') {
          this.isemptyhse4 = true;
        } else if (categoryname == 'h6') {
          // this.StatisticFile_name = files[i].name;
          this.isemptyhse6 = true;
          // Remove filename form filename array
          const index: number = this.selectedFileName.indexOf(this.StatisticFile_name);
          // Remove filename form file[] array
          // Delete the item from fileNames list
          this.selectedFileName.splice(index, 1);
          // delete file from FileList
          this.selectedFiles.splice(index, 1);
        } else if (categoryname == 'q1') {
          this.isemptyquality1 = true;
        } else if (categoryname == 'q2') {
          this.isemptyquality2 = true;
        } else if (categoryname == 'q3') {
          this.isemptyquality3 = true;
        } else if (categoryname == 'b1') {
          this.isemptybank = true;
          this.isbankadded = false;
        } else if (categoryname == 'b2') {
          this.isemptybankletterhead = true;
          this.isbankletterheadadded = false;
        }
      } else {
        if (categoryname == 'r1') {


          this.isemptyreg = false;
          this.isregadded = true;
          this.firstFormGroup.get('regfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('regfileoriCtrl').markAsUntouched();


        } else if (categoryname == 'v1') {
          this.isemptyvat = false;
          this.isemptygosi = false;
          this.firstFormGroup.get('vatfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('vatfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'g1') {
          this.isemptygosi = false;
          this.isemptygosi = false;
          this.firstFormGroup.get('gosifiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('gosifileoriCtrl').markAsUntouched();
        } else if (categoryname == 's1') {
          this.isemptysaudi = false;
          this.firstFormGroup.get('saudifiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('saudifileoriCtrl').markAsUntouched();
        } else if (categoryname == 'z1') {
          this.isemptyzakath = false;
          this.firstFormGroup.get('zakathfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('zakathfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'a1') {
          this.isemptyzakath = false;
          this.firstFormGroup.get('associationfiletempCtrl').markAsUntouched();
          this.firstFormGroup.get('associationfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'm1') {
          this.isemptymanorg = false;
        } else if (categoryname == 'a2') {
          this.isemptyadditional = false;
        } else if (categoryname == 'a3') {
          this.isemptyadditional2 = false;
        } else if (categoryname == 'a4') {
          this.isemptyadditional3 = false;
        } else if (categoryname == 'a5') {
          this.isemptyadditional4 = false;
        } else if (categoryname == 'a6') {
          this.isemptyadditional5 = false;
        } else if (categoryname == 'f1') {
          this.isemptyfin1 = false;
        } else if (categoryname == 'f2') {
          this.isemptyfin2 = false;
        } else if (categoryname == 'f3') {
          this.isemptyfin3 = false;
        } else if (categoryname == 'e1') {
          this.isemptyorgdesign = false;
          this.secondFormGroup.get('designtempCtrl').markAsUntouched();
          this.secondFormGroup.get('designoriCtrl').markAsUntouched();
        } else if (categoryname == 'e2') {
          this.isemptyoutorg = false;
          this.secondFormGroup.get('finishtempCtrl').markAsUntouched();
          this.secondFormGroup.get('finishoriCtrl').markAsUntouched();
        } else if (categoryname == 'e3') {
          this.isemptythirdparty = false;
          this.secondFormGroup.get('registeredtempCtrl').markAsUntouched();
          this.secondFormGroup.get('registeredoriCtrl').markAsUntouched();
        } else if (categoryname == 'e4') {
          this.isemptybusrefr = false;
        } else if (categoryname == 'e5') {
          this.isemptytrainInfo = false;
          this.secondFormGroup.get('compliancetempCtrl').markAsUntouched();
          this.secondFormGroup.get('complianceoriCtrl').markAsUntouched();
        } else if (categoryname == 'h1') {
          this.isemptyhse = false;
          this.secondFormGroup.get('hsetempCtrl').markAsUntouched();
          this.secondFormGroup.get('hseoriCtrl').markAsUntouched();
        } else if (categoryname == 'h2') {
          this.isemptyhse2 = false;
          this.secondFormGroup.get('docutempCtrl').markAsUntouched();
          this.secondFormGroup.get('docuoriCtrl').markAsUntouched();
        } else if (categoryname == 'h3') {
          this.isemptyhse3 = false;
          this.secondFormGroup.get('isohealthtempCtrl').markAsUntouched();
          this.secondFormGroup.get('isohealthoriCtrl').markAsUntouched();
        } else if (categoryname == 'h4') {
          this.isemptyhse4 = false;
          this.secondFormGroup.get('envttempCtrl').markAsUntouched();
          this.secondFormGroup.get('envtoriCtrl').markAsUntouched();
        } else if (categoryname == 'h6') {
          this.isemptyhse6 = false;
          this.secondFormGroup.get('statisticTempCtrl').markAsUntouched();
          this.secondFormGroup.get('StatisticoriCtrl').markAsUntouched();
        } else if (categoryname == 'q1') {
          this.isemptyquality1 = false;
          this.secondFormGroup.get('qualityPolicytempCtrl').markAsUntouched();
          this.secondFormGroup.get('qualityPolicyoriCtrl').markAsUntouched();
        } else if (categoryname == 'q2') {
          this.isemptyquality2 = false;
          this.secondFormGroup.get('qualityMgttempCtrl').markAsUntouched();
          this.secondFormGroup.get('qualityMgtoriCtrl').markAsUntouched();
        } else if (categoryname == 'q3') {
          this.isemptyquality3 = false;
          this.secondFormGroup.get('qualityMgtIsotempCtrl').markAsUntouched();
          this.secondFormGroup.get('qualityMgtIsooriCtrl').markAsUntouched();
        } else if (categoryname == 'b1') {
          this.isemptybank = false;
          this.isbankadded = true;
          this.thirdFormGroup.get('bankfiletempCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankfileoriCtrl').markAsUntouched();
        } else if (categoryname == 'b2') {
          this.isemptybankletterhead = false;
          this.isbankletterheadadded = true;
          this.thirdFormGroup.get('bankletterheadfiletempCtrl').markAsUntouched();
          this.thirdFormGroup.get('bankletterheadfileoriCtrl').markAsUntouched();
        }

      }
      /** End of empty file change */


      if (oldFileItem) {
        if (categoryname == 'r1') {
        } else if (categoryname == 'v1') {
          // this.isemptyvat = true;
        } else if (categoryname == 'g1') {
          // this.isemptygosi = true;
        } else if (categoryname == 's1') {
          // this.isemptysaudi = true;
        }
      } else {
        if (categoryname == 'r1') {
          // this.isFileAdded = true;
          // this.isemptyreg = false;
        } else if (categoryname == 'v1') {
          // this.isemptyvat = false;
        } else if (categoryname == 'g1') {
          // this.isemptygosi = false;
        } else if (categoryname == 's1') {
          // this.isemptysaudi = false;
        }
      }

      const newFile: File = new File([this.uploaderTemp.queue[length - 1]._file], newFilename, { type: oldFileItem.file.type });
      const newFileItem = new FileItem(this.uploaderTemp, newFile, null);
      this.uploaderTemp.queue[length - 1] = newFileItem;

      var searchTag = "_" + categoryname;

      console.log('File size  is : ' + filesize);
      if (filesize > 5000000) {
        if (categoryname == 'r1') {
          this.ismaxreg = true;


          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }




          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'v1') {
          this.ismaxvat = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'g1') {
          this.ismaxgosi = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 's1') {
          this.ismaxsaudi = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'z1') {
          this.ismaxzakath = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a1') {
          this.ismaxassociation = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'm1') {
          this.ismaxmanorg = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a2') {
          this.ismaxadditional = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a3') {
          this.ismaxadditional2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a4') {
          this.ismaxadditional3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a5') {
          this.ismaxadditional4 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'a6') {
          this.ismaxadditional5 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              // this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'f1') {
          this.ismaxfin1 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'f2') {
          this.ismaxfin2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'f3') {
          this.ismaxfin3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e1') {
          this.ismaxorgdesign = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e2') {
          this.ismaxoutorg = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e3') {
          this.ismaxthirdparty = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e4') {
          this.ismaxbusrefr = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'e5') {
          this.ismaxtrainInfo = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h1') {
          this.ismaxhse = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h2') {
          this.ismaxhse2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h3') {
          this.ismaxhse3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h4') {
          this.ismaxhse4 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'h6') {
          this.ismaxhse6 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }
        } else if (categoryname == 'q1') {
          this.ismaxquality1 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'q2') {
          this.ismaxquality2 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'q3') {
          this.ismaxquality3 = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'b1') {
          this.ismaxbank = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        } else if (categoryname == 'b2') {
          this.ismaxbankletterhead = true;
          for (const fileItem of this.uploaderTemp.queue) {
            console.log('file items : ' + fileItem.file.name);
            if (fileItem.file.name.includes(searchTag)) {
              this.uploaderTemp.removeFromQueue(fileItem);
            }
          }

          console.log('New length of the queue: ' + this.uploaderTemp.queue.length);
        }
      } else {
        if (categoryname == 'r1') {
          this.ismaxreg = false;
        } else if (categoryname == 'v1') {
          this.ismaxvat = false;
        } else if (categoryname == 'g1') {
          this.ismaxgosi = false;
        } else if (categoryname == 's1') {
          this.ismaxsaudi = false;
        } else if (categoryname == 'z1') {
          this.ismaxzakath = false;
        } else if (categoryname == 'a1') {
          this.ismaxzakath = false;
        } else if (categoryname == 'm1') {
          this.ismaxmanorg = false;
        } else if (categoryname == 'a2') {
          this.ismaxadditional = false;
        } else if (categoryname == 'a3') {
          this.ismaxadditional2 = false;
        } else if (categoryname == 'a4') {
          this.ismaxadditional3 = false;
        } else if (categoryname == 'a5') {
          this.ismaxadditional4 = false;
        } else if (categoryname == 'a6') {
          this.ismaxadditional5 = false;
        } else if (categoryname == 'f1') {
          this.ismaxfin1 = false;
        } else if (categoryname == 'f2') {
          this.ismaxfin2 = false;
        } else if (categoryname == 'f3') {
          this.ismaxfin3 = false;
        } else if (categoryname == 'e1') {
          this.ismaxorgdesign = false;
        } else if (categoryname == 'e2') {
          this.ismaxoutorg = false;
        } else if (categoryname == 'e3') {
          this.ismaxthirdparty = false;
        } else if (categoryname == 'e4') {
          this.ismaxbusrefr = false;
        } else if (categoryname == 'e5') {
          this.ismaxtrainInfo = false;
        } else if (categoryname == 'h1') {
          this.ismaxhse = false;
        } else if (categoryname == 'h2') {
          this.ismaxhse2 = false;
        } else if (categoryname == 'h3') {
          this.ismaxhse3 = false;
        } else if (categoryname == 'h4') {
          this.ismaxhse4 = false;
        } else if (categoryname == 'h6') {
          this.ismaxhse6 = false;
        } else if (categoryname == 'q1') {
          this.ismaxquality1 = false;
        } else if (categoryname == 'q2') {
          this.ismaxquality2 = false;
        } else if (categoryname == 'q3') {
          this.ismaxquality3 = false;
        } else if (categoryname == 'b1') {
          this.ismaxbank = false;
        } else if (categoryname == 'b2') {
          this.ismaxbankletterhead = false;
        }

      }
    }
  }

  openModal(action, obj) {
    /*
    newFilename.includes('jpg') || newFilename.includes('jpeg') || newFilename.includes('pdf') ||
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
    newFilename.includes('PPTX') || newFilename.includes('PPT')
    */
    var link = document.createElement('a');


    if (action == 'r1') {
      link.href = this.r1url;
      link.download = this.r1fileName;
      console.log(this.r1fileType);

      if (this.r1fileType === 'doc') {
        link.click();
      } else if (this.r1fileType === 'docx') {
        link.click();
      } else if (this.r1fileType === 'text') {
        link.click();
      } else if (this.r1fileType === 'txt') {
        link.click();
      } else if (this.r1fileType === 'xlsx') {
        link.click();
      } else if (this.r1fileType === 'csv') {
        link.click();
      } else if (this.r1fileType === 'rtf') {
        link.click();
      } else if (this.r1fileType === 'xls') {
        link.click();
      } else if (this.r1fileType === 'xlsm') {
        link.click();
      } else if (this.r1fileType === 'ppt') {
        link.click();
      } else if (this.r1fileType === 'pptx') {

        link.click();
      } else if (this.r1fileType === 'DOC') {
        link.click();
      } else if (this.r1fileType === 'DOCX') {
        link.click();
      } else if (this.r1fileType === 'TEXT') {
        link.click();
      } else if (this.r1fileType === 'TXT') {
        link.click();
      } else if (this.r1fileType === 'XLSX') {
        link.click();
      } else if (this.r1fileType === 'CSV') {
        link.click();
      } else if (this.r1fileType === 'RTF') {
        link.click();
      } else if (this.r1fileType === 'XLS') {
        link.click();
      } else if (this.r1fileType === 'XLSM') {
        link.click();
      } else if (this.r1fileType === 'PPT') {
        link.click();
      } else if (this.r1fileType === 'PPTX') {

        link.click();

      } else if (this.r1fileType === 'pdf') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'jpeg') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'jpg') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'png') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'gif') {

        window.open(this.r1url, '_blank');
      } else if (this.r1fileType === 'PDF') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'JPEG') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'JPG') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'PNG') {

        window.open(this.r1url, '_blank');

      } else if (this.r1fileType === 'GIF') {

        window.open(this.r1url, '_blank');
      }

    } else if (action == 'v1') {
      link.href = this.v1url;
      link.download = this.v1fileName;
      console.log(this.v1fileType);

      if (this.v1fileType === 'doc') {
        link.click();
      } else if (this.v1fileType === 'docx') {
        link.click();
      } else if (this.v1fileType === 'text') {
        link.click();
      } else if (this.v1fileType === 'txt') {
        link.click();
      } else if (this.v1fileType === 'xlsx') {
        link.click();
      } else if (this.v1fileType === 'csv') {
        link.click();
      } else if (this.v1fileType === 'rtf') {
        link.click();
      } else if (this.v1fileType === 'xls') {
        link.click();
      } else if (this.v1fileType === 'xlsm') {
        link.click();
      } else if (this.v1fileType === 'ppt') {
        link.click();
      } else if (this.v1fileType === 'pptx') {

        link.click();
      } else if (this.v1fileType === 'DOC') {
        link.click();
      } else if (this.v1fileType === 'DOCX') {
        link.click();
      } else if (this.v1fileType === 'TEXT') {
        link.click();
      } else if (this.v1fileType === 'TXT') {
        link.click();
      } else if (this.v1fileType === 'XLSX') {
        link.click();
      } else if (this.v1fileType === 'CSV') {
        link.click();
      } else if (this.v1fileType === 'RTF') {
        link.click();
      } else if (this.v1fileType === 'XLS') {
        link.click();
      } else if (this.v1fileType === 'XLSM') {
        link.click();
      } else if (this.v1fileType === 'PPT') {
        link.click();
      } else if (this.v1fileType === 'PPTX') {

        link.click();

      } else if (this.v1fileType === 'pdf') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'jpeg') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'jpg') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'png') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'gif') {

        window.open(this.v1url, '_blank');
      } else if (this.v1fileType === 'PDF') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'JPEG') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'JPG') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'PNG') {

        window.open(this.v1url, '_blank');

      } else if (this.v1fileType === 'GIF') {

        window.open(this.v1url, '_blank');
      }

    } else if (action == 'g1') {
      link.href = this.g1url;
      link.download = this.g1fileName;
      console.log(this.g1fileType);

      if (this.g1fileType === 'doc') {
        link.click();
      } else if (this.g1fileType === 'docx') {
        link.click();
      } else if (this.g1fileType === 'text') {
        link.click();
      } else if (this.g1fileType === 'txt') {
        link.click();
      } else if (this.g1fileType === 'xlsx') {
        link.click();
      } else if (this.g1fileType === 'csv') {
        link.click();
      } else if (this.g1fileType === 'rtf') {
        link.click();
      } else if (this.g1fileType === 'xls') {
        link.click();
      } else if (this.g1fileType === 'xlsm') {
        link.click();
      } else if (this.g1fileType === 'ppt') {
        link.click();
      } else if (this.g1fileType === 'pptx') {

        link.click();
      } else if (this.g1fileType === 'DOC') {
        link.click();
      } else if (this.g1fileType === 'DOCX') {
        link.click();
      } else if (this.g1fileType === 'TEXT') {
        link.click();
      } else if (this.g1fileType === 'TXT') {
        link.click();
      } else if (this.g1fileType === 'XLSX') {
        link.click();
      } else if (this.g1fileType === 'CSV') {
        link.click();
      } else if (this.g1fileType === 'RTF') {
        link.click();
      } else if (this.g1fileType === 'XLS') {
        link.click();
      } else if (this.g1fileType === 'XLSM') {
        link.click();
      } else if (this.g1fileType === 'PPT') {
        link.click();
      } else if (this.g1fileType === 'PPTX') {

        link.click();

      } else if (this.g1fileType === 'pdf') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'jpeg') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'jpg') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'png') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'gif') {

        window.open(this.g1url, '_blank');
      } else if (this.g1fileType === 'PDF') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'JPEG') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'JPG') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'PNG') {

        window.open(this.g1url, '_blank');

      } else if (this.g1fileType === 'GIF') {

        window.open(this.g1url, '_blank');
      }
    } else if (action == 's1') {
      link.href = this.s1url;
      link.download = this.s1fileName;
      console.log(this.s1fileType);

      if (this.s1fileType === 'doc') {
        link.click();
      } else if (this.s1fileType === 'docx') {
        link.click();
      } else if (this.s1fileType === 'text') {
        link.click();
      } else if (this.s1fileType === 'txt') {
        link.click();
      } else if (this.s1fileType === 'xlsx') {
        link.click();
      } else if (this.s1fileType === 'csv') {
        link.click();
      } else if (this.s1fileType === 'rtf') {
        link.click();
      } else if (this.s1fileType === 'xls') {
        link.click();
      } else if (this.s1fileType === 'xlsm') {
        link.click();
      } else if (this.s1fileType === 'ppt') {
        link.click();
      } else if (this.s1fileType === 'pptx') {

        link.click();
      } else if (this.s1fileType === 'DOC') {
        link.click();
      } else if (this.s1fileType === 'DOCX') {
        link.click();
      } else if (this.s1fileType === 'TEXT') {
        link.click();
      } else if (this.s1fileType === 'TXT') {
        link.click();
      } else if (this.s1fileType === 'XLSX') {
        link.click();
      } else if (this.s1fileType === 'CSV') {
        link.click();
      } else if (this.s1fileType === 'RTF') {
        link.click();
      } else if (this.s1fileType === 'XLS') {
        link.click();
      } else if (this.s1fileType === 'XLSM') {
        link.click();
      } else if (this.s1fileType === 'PPT') {
        link.click();
      } else if (this.s1fileType === 'PPTX') {

        link.click();

      } else if (this.s1fileType === 'pdf') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'jpeg') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'jpg') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'png') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'gif') {

        window.open(this.s1url, '_blank');
      } else if (this.s1fileType === 'PDF') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'JPEG') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'JPG') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'PNG') {

        window.open(this.s1url, '_blank');

      } else if (this.s1fileType === 'GIF') {

        window.open(this.s1url, '_blank');
      }
    } else if (action == 'z1') {
      link.href = this.z1url;
      link.download = this.z1fileName;
      console.log(this.z1fileType);

      if (this.z1fileType === 'doc') {
        link.click();
      } else if (this.z1fileType === 'docx') {
        link.click();
      } else if (this.z1fileType === 'text') {
        link.click();
      } else if (this.z1fileType === 'txt') {
        link.click();
      } else if (this.z1fileType === 'xlsx') {
        link.click();
      } else if (this.z1fileType === 'csv') {
        link.click();
      } else if (this.z1fileType === 'rtf') {
        link.click();
      } else if (this.z1fileType === 'xls') {
        link.click();
      } else if (this.z1fileType === 'xlsm') {
        link.click();
      } else if (this.z1fileType === 'ppt') {
        link.click();
      } else if (this.z1fileType === 'pptx') {

        link.click();
      } else if (this.z1fileType === 'DOC') {
        link.click();
      } else if (this.z1fileType === 'DOCX') {
        link.click();
      } else if (this.z1fileType === 'TEXT') {
        link.click();
      } else if (this.z1fileType === 'TXT') {
        link.click();
      } else if (this.z1fileType === 'XLSX') {
        link.click();
      } else if (this.z1fileType === 'CSV') {
        link.click();
      } else if (this.z1fileType === 'RTF') {
        link.click();
      } else if (this.z1fileType === 'XLS') {
        link.click();
      } else if (this.z1fileType === 'XLSM') {
        link.click();
      } else if (this.z1fileType === 'PPT') {
        link.click();
      } else if (this.z1fileType === 'PPTX') {

        link.click();

      } else if (this.z1fileType === 'pdf') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'jpeg') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'jpg') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'png') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'gif') {

        window.open(this.z1url, '_blank');
      } else if (this.z1fileType === 'PDF') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'JPEG') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'JPG') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'PNG') {

        window.open(this.z1url, '_blank');

      } else if (this.z1fileType === 'GIF') {

        window.open(this.z1url, '_blank');
      }
    } else if (action == 'a1') {
      link.href = this.a1url;
      link.download = this.a1fileName;
      console.log(this.a1fileType);

      if (this.a1fileType === 'doc') {
        link.click();
      } else if (this.a1fileType === 'docx') {
        link.click();
      } else if (this.a1fileType === 'text') {
        link.click();
      } else if (this.a1fileType === 'txt') {
        link.click();
      } else if (this.a1fileType === 'xlsx') {
        link.click();
      } else if (this.a1fileType === 'csv') {
        link.click();
      } else if (this.a1fileType === 'rtf') {
        link.click();
      } else if (this.a1fileType === 'xls') {
        link.click();
      } else if (this.a1fileType === 'xlsm') {
        link.click();
      } else if (this.a1fileType === 'ppt') {
        link.click();
      } else if (this.a1fileType === 'pptx') {

        link.click();
      } else if (this.a1fileType === 'DOC') {
        link.click();
      } else if (this.a1fileType === 'DOCX') {
        link.click();
      } else if (this.a1fileType === 'TEXT') {
        link.click();
      } else if (this.a1fileType === 'TXT') {
        link.click();
      } else if (this.a1fileType === 'XLSX') {
        link.click();
      } else if (this.a1fileType === 'CSV') {
        link.click();
      } else if (this.a1fileType === 'RTF') {
        link.click();
      } else if (this.a1fileType === 'XLS') {
        link.click();
      } else if (this.a1fileType === 'XLSM') {
        link.click();
      } else if (this.a1fileType === 'PPT') {
        link.click();
      } else if (this.a1fileType === 'PPTX') {

        link.click();

      } else if (this.a1fileType === 'pdf') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'jpeg') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'jpg') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'png') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'gif') {

        window.open(this.a1url, '_blank');
      } else if (this.a1fileType === 'PDF') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'JPEG') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'JPG') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'PNG') {

        window.open(this.a1url, '_blank');

      } else if (this.a1fileType === 'GIF') {

        window.open(this.a1url, '_blank');
      }
    } else if (action == 'm1') {
      link.href = this.m1url;
      link.download = this.m1fileName;
      console.log(this.m1fileType);

      if (this.m1fileType === 'doc') {
        link.click();
      } else if (this.m1fileType === 'docx') {
        link.click();
      } else if (this.m1fileType === 'text') {
        link.click();
      } else if (this.m1fileType === 'txt') {
        link.click();
      } else if (this.m1fileType === 'xlsx') {
        link.click();
      } else if (this.m1fileType === 'csv') {
        link.click();
      } else if (this.m1fileType === 'rtf') {
        link.click();
      } else if (this.m1fileType === 'xls') {
        link.click();
      } else if (this.m1fileType === 'xlsm') {
        link.click();
      } else if (this.m1fileType === 'ppt') {
        link.click();
      } else if (this.m1fileType === 'pptx') {

        link.click();
      } else if (this.m1fileType === 'DOC') {
        link.click();
      } else if (this.m1fileType === 'DOCX') {
        link.click();
      } else if (this.m1fileType === 'TEXT') {
        link.click();
      } else if (this.m1fileType === 'TXT') {
        link.click();
      } else if (this.m1fileType === 'XLSX') {
        link.click();
      } else if (this.m1fileType === 'CSV') {
        link.click();
      } else if (this.m1fileType === 'RTF') {
        link.click();
      } else if (this.m1fileType === 'XLS') {
        link.click();
      } else if (this.m1fileType === 'XLSM') {
        link.click();
      } else if (this.m1fileType === 'PPT') {
        link.click();
      } else if (this.m1fileType === 'PPTX') {

        link.click();

      } else if (this.m1fileType === 'pdf') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'jpeg') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'jpg') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'png') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'gif') {

        window.open(this.m1url, '_blank');
      } else if (this.m1fileType === 'PDF') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'JPEG') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'JPG') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'PNG') {

        window.open(this.m1url, '_blank');

      } else if (this.m1fileType === 'GIF') {

        window.open(this.m1url, '_blank');
      }
    } else if (action == 'a2') {
      link.href = this.a2url;
      link.download = this.a2fileName;
      console.log(this.a2fileType);

      if (this.a2fileType === 'doc') {
        link.click();
      } else if (this.a2fileType === 'docx') {
        link.click();
      } else if (this.a2fileType === 'text') {
        link.click();
      } else if (this.a2fileType === 'txt') {
        link.click();
      } else if (this.a2fileType === 'xlsx') {
        link.click();
      } else if (this.a2fileType === 'csv') {
        link.click();
      } else if (this.a2fileType === 'rtf') {
        link.click();
      } else if (this.a2fileType === 'xls') {
        link.click();
      } else if (this.a2fileType === 'xlsm') {
        link.click();
      } else if (this.a2fileType === 'ppt') {
        link.click();
      } else if (this.a2fileType === 'pptx') {

        link.click();
      } else if (this.a2fileType === 'DOC') {
        link.click();
      } else if (this.a2fileType === 'DOCX') {
        link.click();
      } else if (this.a2fileType === 'TEXT') {
        link.click();
      } else if (this.a2fileType === 'TXT') {
        link.click();
      } else if (this.a2fileType === 'XLSX') {
        link.click();
      } else if (this.a2fileType === 'CSV') {
        link.click();
      } else if (this.a2fileType === 'RTF') {
        link.click();
      } else if (this.a2fileType === 'XLS') {
        link.click();
      } else if (this.a2fileType === 'XLSM') {
        link.click();
      } else if (this.a2fileType === 'PPT') {
        link.click();
      } else if (this.a2fileType === 'PPTX') {

        link.click();

      } else if (this.a2fileType === 'pdf') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'jpeg') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'jpg') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'png') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'gif') {

        window.open(this.a2url, '_blank');
      } else if (this.a2fileType === 'PDF') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'JPEG') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'JPG') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'PNG') {

        window.open(this.a2url, '_blank');

      } else if (this.a2fileType === 'GIF') {

        window.open(this.a2url, '_blank');
      }
    } else if (action == 'a3') {
      link.href = this.a3url;
      link.download = this.a3fileName;
      console.log(this.a3fileType);

      if (this.a3fileType === 'doc') {
        link.click();
      } else if (this.a3fileType === 'docx') {
        link.click();
      } else if (this.a3fileType === 'text') {
        link.click();
      } else if (this.a3fileType === 'txt') {
        link.click();
      } else if (this.a3fileType === 'xlsx') {
        link.click();
      } else if (this.a3fileType === 'csv') {
        link.click();
      } else if (this.a3fileType === 'rtf') {
        link.click();
      } else if (this.a3fileType === 'xls') {
        link.click();
      } else if (this.a3fileType === 'xlsm') {
        link.click();
      } else if (this.a3fileType === 'ppt') {
        link.click();
      } else if (this.a3fileType === 'pptx') {

        link.click();
      } else if (this.a3fileType === 'DOC') {
        link.click();
      } else if (this.a3fileType === 'DOCX') {
        link.click();
      } else if (this.a3fileType === 'TEXT') {
        link.click();
      } else if (this.a3fileType === 'TXT') {
        link.click();
      } else if (this.a3fileType === 'XLSX') {
        link.click();
      } else if (this.a3fileType === 'CSV') {
        link.click();
      } else if (this.a3fileType === 'RTF') {
        link.click();
      } else if (this.a3fileType === 'XLS') {
        link.click();
      } else if (this.a3fileType === 'XLSM') {
        link.click();
      } else if (this.a3fileType === 'PPT') {
        link.click();
      } else if (this.a3fileType === 'PPTX') {

        link.click();

      } else if (this.a3fileType === 'pdf') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'jpeg') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'jpg') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'png') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'gif') {

        window.open(this.a3url, '_blank');
      } else if (this.a3fileType === 'PDF') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'JPEG') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'JPG') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'PNG') {

        window.open(this.a3url, '_blank');

      } else if (this.a3fileType === 'GIF') {

        window.open(this.a3url, '_blank');
      }
    } else if (action == 'a4') {
      link.href = this.a4url;
      link.download = this.a4fileName;
      console.log(this.a4fileType);

      if (this.a4fileType === 'doc') {
        link.click();
      } else if (this.a4fileType === 'docx') {
        link.click();
      } else if (this.a4fileType === 'text') {
        link.click();
      } else if (this.a4fileType === 'txt') {
        link.click();
      } else if (this.a4fileType === 'xlsx') {
        link.click();
      } else if (this.a4fileType === 'csv') {
        link.click();
      } else if (this.a4fileType === 'rtf') {
        link.click();
      } else if (this.a4fileType === 'xls') {
        link.click();
      } else if (this.a4fileType === 'xlsm') {
        link.click();
      } else if (this.a4fileType === 'ppt') {
        link.click();
      } else if (this.a4fileType === 'pptx') {

        link.click();
      } else if (this.a4fileType === 'DOC') {
        link.click();
      } else if (this.a4fileType === 'DOCX') {
        link.click();
      } else if (this.a4fileType === 'TEXT') {
        link.click();
      } else if (this.a4fileType === 'TXT') {
        link.click();
      } else if (this.a4fileType === 'XLSX') {
        link.click();
      } else if (this.a4fileType === 'CSV') {
        link.click();
      } else if (this.a4fileType === 'RTF') {
        link.click();
      } else if (this.a4fileType === 'XLS') {
        link.click();
      } else if (this.a4fileType === 'XLSM') {
        link.click();
      } else if (this.a4fileType === 'PPT') {
        link.click();
      } else if (this.a4fileType === 'PPTX') {

        link.click();

      } else if (this.a4fileType === 'pdf') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'jpeg') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'jpg') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'png') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'gif') {

        window.open(this.a4url, '_blank');
      } else if (this.a4fileType === 'PDF') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'JPEG') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'JPG') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'PNG') {

        window.open(this.a4url, '_blank');

      } else if (this.a4fileType === 'GIF') {

        window.open(this.a4url, '_blank');
      }
    } else if (action == 'a5') {
      link.href = this.a5url;
      link.download = this.a5fileName;
      console.log(this.a5fileType);

      if (this.a5fileType === 'doc') {
        link.click();
      } else if (this.a5fileType === 'docx') {
        link.click();
      } else if (this.a5fileType === 'text') {
        link.click();
      } else if (this.a5fileType === 'txt') {
        link.click();
      } else if (this.a5fileType === 'xlsx') {
        link.click();
      } else if (this.a5fileType === 'csv') {
        link.click();
      } else if (this.a5fileType === 'rtf') {
        link.click();
      } else if (this.a5fileType === 'xls') {
        link.click();
      } else if (this.a5fileType === 'xlsm') {
        link.click();
      } else if (this.a5fileType === 'ppt') {
        link.click();
      } else if (this.a5fileType === 'pptx') {

        link.click();
      } else if (this.a5fileType === 'DOC') {
        link.click();
      } else if (this.a5fileType === 'DOCX') {
        link.click();
      } else if (this.a5fileType === 'TEXT') {
        link.click();
      } else if (this.a5fileType === 'TXT') {
        link.click();
      } else if (this.a5fileType === 'XLSX') {
        link.click();
      } else if (this.a5fileType === 'CSV') {
        link.click();
      } else if (this.a5fileType === 'RTF') {
        link.click();
      } else if (this.a5fileType === 'XLS') {
        link.click();
      } else if (this.a5fileType === 'XLSM') {
        link.click();
      } else if (this.a5fileType === 'PPT') {
        link.click();
      } else if (this.a5fileType === 'PPTX') {

        link.click();

      } else if (this.a5fileType === 'pdf') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'jpeg') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'jpg') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'png') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'gif') {

        window.open(this.a5url, '_blank');
      } else if (this.a5fileType === 'PDF') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'JPEG') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'JPG') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'PNG') {

        window.open(this.a5url, '_blank');

      } else if (this.a5fileType === 'GIF') {

        window.open(this.a5url, '_blank');
      }
    } else if (action == 'a6') {
      link.href = this.a6url;
      link.download = this.a6fileName;
      console.log(this.a6fileType);

      if (this.a6fileType === 'doc') {
        link.click();
      } else if (this.a6fileType === 'docx') {
        link.click();
      } else if (this.a6fileType === 'text') {
        link.click();
      } else if (this.a6fileType === 'txt') {
        link.click();
      } else if (this.a6fileType === 'xlsx') {
        link.click();
      } else if (this.a6fileType === 'csv') {
        link.click();
      } else if (this.a6fileType === 'rtf') {
        link.click();
      } else if (this.a6fileType === 'xls') {
        link.click();
      } else if (this.a6fileType === 'xlsm') {
        link.click();
      } else if (this.a6fileType === 'ppt') {
        link.click();
      } else if (this.a6fileType === 'pptx') {

        link.click();
      } else if (this.a6fileType === 'DOC') {
        link.click();
      } else if (this.a6fileType === 'DOCX') {
        link.click();
      } else if (this.a6fileType === 'TEXT') {
        link.click();
      } else if (this.a6fileType === 'TXT') {
        link.click();
      } else if (this.a6fileType === 'XLSX') {
        link.click();
      } else if (this.a6fileType === 'CSV') {
        link.click();
      } else if (this.a6fileType === 'RTF') {
        link.click();
      } else if (this.a6fileType === 'XLS') {
        link.click();
      } else if (this.a6fileType === 'XLSM') {
        link.click();
      } else if (this.a6fileType === 'PPT') {
        link.click();
      } else if (this.a6fileType === 'PPTX') {

        link.click();

      } else if (this.a6fileType === 'pdf') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'jpeg') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'jpg') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'png') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'gif') {

        window.open(this.a6url, '_blank');
      } else if (this.a6fileType === 'PDF') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'JPEG') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'JPG') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'PNG') {

        window.open(this.a6url, '_blank');

      } else if (this.a6fileType === 'GIF') {

        window.open(this.a6url, '_blank');
      }
    } else if (action == 'f1') {
      link.href = this.f1url;
      link.download = this.f1fileName;
      console.log(this.f1fileType);

      if (this.f1fileType === 'doc') {
        link.click();
      } else if (this.f1fileType === 'docx') {
        link.click();
      } else if (this.f1fileType === 'text') {
        link.click();
      } else if (this.f1fileType === 'txt') {
        link.click();
      } else if (this.f1fileType === 'xlsx') {
        link.click();
      } else if (this.f1fileType === 'csv') {
        link.click();
      } else if (this.f1fileType === 'rtf') {
        link.click();
      } else if (this.f1fileType === 'xls') {
        link.click();
      } else if (this.f1fileType === 'xlsm') {
        link.click();
      } else if (this.f1fileType === 'ppt') {
        link.click();
      } else if (this.f1fileType === 'pptx') {

        link.click();
      } else if (this.f1fileType === 'DOC') {
        link.click();
      } else if (this.f1fileType === 'DOCX') {
        link.click();
      } else if (this.f1fileType === 'TEXT') {
        link.click();
      } else if (this.f1fileType === 'TXT') {
        link.click();
      } else if (this.f1fileType === 'XLSX') {
        link.click();
      } else if (this.f1fileType === 'CSV') {
        link.click();
      } else if (this.f1fileType === 'RTF') {
        link.click();
      } else if (this.f1fileType === 'XLS') {
        link.click();
      } else if (this.f1fileType === 'XLSM') {
        link.click();
      } else if (this.f1fileType === 'PPT') {
        link.click();
      } else if (this.f1fileType === 'PPTX') {

        link.click();

      } else if (this.f1fileType === 'pdf') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'jpeg') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'jpg') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'png') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'gif') {

        window.open(this.f1url, '_blank');
      } else if (this.f1fileType === 'PDF') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'JPEG') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'JPG') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'PNG') {

        window.open(this.f1url, '_blank');

      } else if (this.f1fileType === 'GIF') {

        window.open(this.f1url, '_blank');
      }
    } else if (action == 'f2') {
      link.href = this.f2url;
      link.download = this.f2fileName;
      console.log(this.f2fileType);

      if (this.f2fileType === 'doc') {
        link.click();
      } else if (this.f2fileType === 'docx') {
        link.click();
      } else if (this.f2fileType === 'text') {
        link.click();
      } else if (this.f2fileType === 'txt') {
        link.click();
      } else if (this.f2fileType === 'xlsx') {
        link.click();
      } else if (this.f2fileType === 'csv') {
        link.click();
      } else if (this.f2fileType === 'rtf') {
        link.click();
      } else if (this.f2fileType === 'xls') {
        link.click();
      } else if (this.f2fileType === 'xlsm') {
        link.click();
      } else if (this.f2fileType === 'ppt') {
        link.click();
      } else if (this.f2fileType === 'pptx') {

        link.click();
      } else if (this.f2fileType === 'DOC') {
        link.click();
      } else if (this.f2fileType === 'DOCX') {
        link.click();
      } else if (this.f2fileType === 'TEXT') {
        link.click();
      } else if (this.f2fileType === 'TXT') {
        link.click();
      } else if (this.f2fileType === 'XLSX') {
        link.click();
      } else if (this.f2fileType === 'CSV') {
        link.click();
      } else if (this.f2fileType === 'RTF') {
        link.click();
      } else if (this.f2fileType === 'XLS') {
        link.click();
      } else if (this.f2fileType === 'XLSM') {
        link.click();
      } else if (this.f2fileType === 'PPT') {
        link.click();
      } else if (this.f2fileType === 'PPTX') {

        link.click();

      } else if (this.f2fileType === 'pdf') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'jpeg') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'jpg') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'png') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'gif') {

        window.open(this.f2url, '_blank');
      } else if (this.f2fileType === 'PDF') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'JPEG') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'JPG') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'PNG') {

        window.open(this.f2url, '_blank');

      } else if (this.f2fileType === 'GIF') {

        window.open(this.f2url, '_blank');
      }
    } else if (action == 'f3') {
      link.href = this.f3url;
      link.download = this.f3fileName;
      console.log(this.f3fileType);

      if (this.f3fileType === 'doc') {
        link.click();
      } else if (this.f3fileType === 'docx') {
        link.click();
      } else if (this.f3fileType === 'text') {
        link.click();
      } else if (this.f3fileType === 'txt') {
        link.click();
      } else if (this.f3fileType === 'xlsx') {
        link.click();
      } else if (this.f3fileType === 'csv') {
        link.click();
      } else if (this.f3fileType === 'rtf') {
        link.click();
      } else if (this.f3fileType === 'xls') {
        link.click();
      } else if (this.f3fileType === 'xlsm') {
        link.click();
      } else if (this.f3fileType === 'ppt') {
        link.click();
      } else if (this.f3fileType === 'pptx') {

        link.click();
      } else if (this.f3fileType === 'DOC') {
        link.click();
      } else if (this.f3fileType === 'DOCX') {
        link.click();
      } else if (this.f3fileType === 'TEXT') {
        link.click();
      } else if (this.f3fileType === 'TXT') {
        link.click();
      } else if (this.f3fileType === 'XLSX') {
        link.click();
      } else if (this.f3fileType === 'CSV') {
        link.click();
      } else if (this.f3fileType === 'RTF') {
        link.click();
      } else if (this.f3fileType === 'XLS') {
        link.click();
      } else if (this.f3fileType === 'XLSM') {
        link.click();
      } else if (this.f3fileType === 'PPT') {
        link.click();
      } else if (this.f3fileType === 'PPTX') {

        link.click();

      } else if (this.f3fileType === 'pdf') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'jpeg') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'jpg') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'png') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'gif') {

        window.open(this.f3url, '_blank');
      } else if (this.f3fileType === 'PDF') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'JPEG') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'JPG') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'PNG') {

        window.open(this.f3url, '_blank');

      } else if (this.f3fileType === 'GIF') {

        window.open(this.f3url, '_blank');
      }
    } else if (action == 'e1') {
      link.href = this.e1url;
      link.download = this.e1fileName;
      console.log(this.e1fileType);

      if (this.e1fileType === 'doc') {
        link.click();
      } else if (this.e1fileType === 'docx') {
        link.click();
      } else if (this.e1fileType === 'text') {
        link.click();
      } else if (this.e1fileType === 'txt') {
        link.click();
      } else if (this.e1fileType === 'xlsx') {
        link.click();
      } else if (this.e1fileType === 'csv') {
        link.click();
      } else if (this.e1fileType === 'rtf') {
        link.click();
      } else if (this.e1fileType === 'xls') {
        link.click();
      } else if (this.e1fileType === 'xlsm') {
        link.click();
      } else if (this.e1fileType === 'ppt') {
        link.click();
      } else if (this.e1fileType === 'pptx') {

        link.click();
      } else if (this.e1fileType === 'DOC') {
        link.click();
      } else if (this.e1fileType === 'DOCX') {
        link.click();
      } else if (this.e1fileType === 'TEXT') {
        link.click();
      } else if (this.e1fileType === 'TXT') {
        link.click();
      } else if (this.e1fileType === 'XLSX') {
        link.click();
      } else if (this.e1fileType === 'CSV') {
        link.click();
      } else if (this.e1fileType === 'RTF') {
        link.click();
      } else if (this.e1fileType === 'XLS') {
        link.click();
      } else if (this.e1fileType === 'XLSM') {
        link.click();
      } else if (this.e1fileType === 'PPT') {
        link.click();
      } else if (this.e1fileType === 'PPTX') {

        link.click();

      } else if (this.e1fileType === 'pdf') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'jpeg') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'jpg') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'png') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'gif') {

        window.open(this.e1url, '_blank');
      } else if (this.e1fileType === 'PDF') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'JPEG') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'JPG') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'PNG') {

        window.open(this.e1url, '_blank');

      } else if (this.e1fileType === 'GIF') {

        window.open(this.e1url, '_blank');
      }
    } else if (action == 'e2') {
      link.href = this.e2url;
      link.download = this.e2fileName;
      console.log(this.e2fileType);

      if (this.e2fileType === 'doc') {
        link.click();
      } else if (this.e2fileType === 'docx') {
        link.click();
      } else if (this.e2fileType === 'text') {
        link.click();
      } else if (this.e2fileType === 'txt') {
        link.click();
      } else if (this.e2fileType === 'xlsx') {
        link.click();
      } else if (this.e2fileType === 'csv') {
        link.click();
      } else if (this.e2fileType === 'rtf') {
        link.click();
      } else if (this.e2fileType === 'xls') {
        link.click();
      } else if (this.e2fileType === 'xlsm') {
        link.click();
      } else if (this.e2fileType === 'ppt') {
        link.click();
      } else if (this.e2fileType === 'pptx') {

        link.click();
      } else if (this.e2fileType === 'DOC') {
        link.click();
      } else if (this.e2fileType === 'DOCX') {
        link.click();
      } else if (this.e2fileType === 'TEXT') {
        link.click();
      } else if (this.e2fileType === 'TXT') {
        link.click();
      } else if (this.e2fileType === 'XLSX') {
        link.click();
      } else if (this.e2fileType === 'CSV') {
        link.click();
      } else if (this.e2fileType === 'RTF') {
        link.click();
      } else if (this.e2fileType === 'XLS') {
        link.click();
      } else if (this.e2fileType === 'XLSM') {
        link.click();
      } else if (this.e2fileType === 'PPT') {
        link.click();
      } else if (this.e2fileType === 'PPTX') {

        link.click();

      } else if (this.e2fileType === 'pdf') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'jpeg') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'jpg') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'png') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'gif') {

        window.open(this.e2url, '_blank');
      } else if (this.e2fileType === 'PDF') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'JPEG') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'JPG') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'PNG') {

        window.open(this.e2url, '_blank');

      } else if (this.e2fileType === 'GIF') {

        window.open(this.e2url, '_blank');
      }

    } else if (action == 'e3') {
      link.href = this.e3url;
      link.download = this.e3fileName;
      console.log(this.e3fileType);

      if (this.e3fileType === 'doc') {
        link.click();
      } else if (this.e3fileType === 'docx') {
        link.click();
      } else if (this.e3fileType === 'text') {
        link.click();
      } else if (this.e3fileType === 'txt') {
        link.click();
      } else if (this.e3fileType === 'xlsx') {
        link.click();
      } else if (this.e3fileType === 'csv') {
        link.click();
      } else if (this.e3fileType === 'rtf') {
        link.click();
      } else if (this.e3fileType === 'xls') {
        link.click();
      } else if (this.e3fileType === 'xlsm') {
        link.click();
      } else if (this.e3fileType === 'ppt') {
        link.click();
      } else if (this.e3fileType === 'pptx') {

        link.click();
      } else if (this.e3fileType === 'DOC') {
        link.click();
      } else if (this.e3fileType === 'DOCX') {
        link.click();
      } else if (this.e3fileType === 'TEXT') {
        link.click();
      } else if (this.e3fileType === 'TXT') {
        link.click();
      } else if (this.e3fileType === 'XLSX') {
        link.click();
      } else if (this.e3fileType === 'CSV') {
        link.click();
      } else if (this.e3fileType === 'RTF') {
        link.click();
      } else if (this.e3fileType === 'XLS') {
        link.click();
      } else if (this.e3fileType === 'XLSM') {
        link.click();
      } else if (this.e3fileType === 'PPT') {
        link.click();
      } else if (this.e3fileType === 'PPTX') {

        link.click();

      } else if (this.e3fileType === 'pdf') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'jpeg') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'jpg') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'png') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'gif') {

        window.open(this.e3url, '_blank');
      } else if (this.e3fileType === 'PDF') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'JPEG') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'JPG') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'PNG') {

        window.open(this.e3url, '_blank');

      } else if (this.e3fileType === 'GIF') {

        window.open(this.e3url, '_blank');
      }
    } else if (action == 'e4') {
      link.href = this.e4url;
      link.download = this.e4fileName;
      console.log(this.e4fileType);

      if (this.e4fileType === 'doc') {
        link.click();
      } else if (this.e4fileType === 'docx') {
        link.click();
      } else if (this.e4fileType === 'text') {
        link.click();
      } else if (this.e4fileType === 'txt') {
        link.click();
      } else if (this.e4fileType === 'xlsx') {
        link.click();
      } else if (this.e4fileType === 'csv') {
        link.click();
      } else if (this.e4fileType === 'rtf') {
        link.click();
      } else if (this.e4fileType === 'xls') {
        link.click();
      } else if (this.e4fileType === 'xlsm') {
        link.click();
      } else if (this.e4fileType === 'ppt') {
        link.click();
      } else if (this.e4fileType === 'pptx') {

        link.click();
      } else if (this.e4fileType === 'DOC') {
        link.click();
      } else if (this.e4fileType === 'DOCX') {
        link.click();
      } else if (this.e4fileType === 'TEXT') {
        link.click();
      } else if (this.e4fileType === 'TXT') {
        link.click();
      } else if (this.e4fileType === 'XLSX') {
        link.click();
      } else if (this.e4fileType === 'CSV') {
        link.click();
      } else if (this.e4fileType === 'RTF') {
        link.click();
      } else if (this.e4fileType === 'XLS') {
        link.click();
      } else if (this.e4fileType === 'XLSM') {
        link.click();
      } else if (this.e4fileType === 'PPT') {
        link.click();
      } else if (this.e4fileType === 'PPTX') {

        link.click();

      } else if (this.e4fileType === 'pdf') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'jpeg') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'jpg') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'png') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'gif') {

        window.open(this.e4url, '_blank');
      } else if (this.e4fileType === 'PDF') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'JPEG') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'JPG') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'PNG') {

        window.open(this.e4url, '_blank');

      } else if (this.e4fileType === 'GIF') {

        window.open(this.e4url, '_blank');
      }
    } else if (action == 'e5') {
      link.href = this.e5url;
      link.download = this.e5fileName;
      console.log(this.e5fileType);

      if (this.e5fileType === 'doc') {
        link.click();
      } else if (this.e5fileType === 'docx') {
        link.click();
      } else if (this.e5fileType === 'text') {
        link.click();
      } else if (this.e5fileType === 'txt') {
        link.click();
      } else if (this.e5fileType === 'xlsx') {
        link.click();
      } else if (this.e5fileType === 'csv') {
        link.click();
      } else if (this.e5fileType === 'rtf') {
        link.click();
      } else if (this.e5fileType === 'xls') {
        link.click();
      } else if (this.e5fileType === 'xlsm') {
        link.click();
      } else if (this.e5fileType === 'ppt') {
        link.click();
      } else if (this.e5fileType === 'pptx') {

        link.click();
      } else if (this.e5fileType === 'DOC') {
        link.click();
      } else if (this.e5fileType === 'DOCX') {
        link.click();
      } else if (this.e5fileType === 'TEXT') {
        link.click();
      } else if (this.e5fileType === 'TXT') {
        link.click();
      } else if (this.e5fileType === 'XLSX') {
        link.click();
      } else if (this.e5fileType === 'CSV') {
        link.click();
      } else if (this.e5fileType === 'RTF') {
        link.click();
      } else if (this.e5fileType === 'XLS') {
        link.click();
      } else if (this.e5fileType === 'XLSM') {
        link.click();
      } else if (this.e5fileType === 'PPT') {
        link.click();
      } else if (this.e5fileType === 'PPTX') {

        link.click();

      } else if (this.e5fileType === 'pdf') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'jpeg') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'jpg') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'png') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'gif') {

        window.open(this.e5url, '_blank');
      } else if (this.e5fileType === 'PDF') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'JPEG') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'JPG') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'PNG') {

        window.open(this.e5url, '_blank');

      } else if (this.e5fileType === 'GIF') {

        window.open(this.e5url, '_blank');
      }
    } else if (action == 'h1') {
      link.href = this.h1url;
      link.download = this.h1fileName;
      console.log(this.h1fileType);

      if (this.h1fileType === 'doc') {
        link.click();
      } else if (this.h1fileType === 'docx') {
        link.click();
      } else if (this.h1fileType === 'text') {
        link.click();
      } else if (this.h1fileType === 'txt') {
        link.click();
      } else if (this.h1fileType === 'xlsx') {
        link.click();
      } else if (this.h1fileType === 'csv') {
        link.click();
      } else if (this.h1fileType === 'rtf') {
        link.click();
      } else if (this.h1fileType === 'xls') {
        link.click();
      } else if (this.h1fileType === 'xlsm') {
        link.click();
      } else if (this.h1fileType === 'ppt') {
        link.click();
      } else if (this.h1fileType === 'pptx') {

        link.click();
      } else if (this.h1fileType === 'DOC') {
        link.click();
      } else if (this.h1fileType === 'DOCX') {
        link.click();
      } else if (this.h1fileType === 'TEXT') {
        link.click();
      } else if (this.h1fileType === 'TXT') {
        link.click();
      } else if (this.h1fileType === 'XLSX') {
        link.click();
      } else if (this.h1fileType === 'CSV') {
        link.click();
      } else if (this.h1fileType === 'RTF') {
        link.click();
      } else if (this.h1fileType === 'XLS') {
        link.click();
      } else if (this.h1fileType === 'XLSM') {
        link.click();
      } else if (this.h1fileType === 'PPT') {
        link.click();
      } else if (this.h1fileType === 'PPTX') {

        link.click();

      } else if (this.h1fileType === 'pdf') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'jpeg') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'jpg') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'png') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'gif') {

        window.open(this.h1url, '_blank');
      } else if (this.h1fileType === 'PDF') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'JPEG') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'JPG') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'PNG') {

        window.open(this.h1url, '_blank');

      } else if (this.h1fileType === 'GIF') {

        window.open(this.h1url, '_blank');
      }
    } else if (action == 'h2') {
      link.href = this.h2url;
      link.download = this.h2fileName;
      console.log(this.h2fileType);

      if (this.h2fileType === 'doc') {
        link.click();
      } else if (this.h2fileType === 'docx') {
        link.click();
      } else if (this.h2fileType === 'text') {
        link.click();
      } else if (this.h2fileType === 'txt') {
        link.click();
      } else if (this.h2fileType === 'xlsx') {
        link.click();
      } else if (this.h2fileType === 'csv') {
        link.click();
      } else if (this.h2fileType === 'rtf') {
        link.click();
      } else if (this.h2fileType === 'xls') {
        link.click();
      } else if (this.h2fileType === 'xlsm') {
        link.click();
      } else if (this.h2fileType === 'ppt') {
        link.click();
      } else if (this.h2fileType === 'pptx') {

        link.click();
      } else if (this.h2fileType === 'DOC') {
        link.click();
      } else if (this.h2fileType === 'DOCX') {
        link.click();
      } else if (this.h2fileType === 'TEXT') {
        link.click();
      } else if (this.h2fileType === 'TXT') {
        link.click();
      } else if (this.h2fileType === 'XLSX') {
        link.click();
      } else if (this.h2fileType === 'CSV') {
        link.click();
      } else if (this.h2fileType === 'RTF') {
        link.click();
      } else if (this.h2fileType === 'XLS') {
        link.click();
      } else if (this.h2fileType === 'XLSM') {
        link.click();
      } else if (this.h2fileType === 'PPT') {
        link.click();
      } else if (this.h2fileType === 'PPTX') {

        link.click();

      } else if (this.h2fileType === 'pdf') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'jpeg') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'jpg') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'png') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'gif') {

        window.open(this.h2url, '_blank');
      } else if (this.h2fileType === 'PDF') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'JPEG') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'JPG') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'PNG') {

        window.open(this.h2url, '_blank');

      } else if (this.h2fileType === 'GIF') {

        window.open(this.h2url, '_blank');
      }
    } else if (action == 'h3') {
      link.href = this.h3url;
      link.download = this.h3fileName;
      console.log(this.h3fileType);

      if (this.h3fileType === 'doc') {
        link.click();
      } else if (this.h3fileType === 'docx') {
        link.click();
      } else if (this.h3fileType === 'text') {
        link.click();
      } else if (this.h3fileType === 'txt') {
        link.click();
      } else if (this.h3fileType === 'xlsx') {
        link.click();
      } else if (this.h3fileType === 'csv') {
        link.click();
      } else if (this.h3fileType === 'rtf') {
        link.click();
      } else if (this.h3fileType === 'xls') {
        link.click();
      } else if (this.h3fileType === 'xlsm') {
        link.click();
      } else if (this.h3fileType === 'ppt') {
        link.click();
      } else if (this.h3fileType === 'pptx') {

        link.click();
      } else if (this.h3fileType === 'DOC') {
        link.click();
      } else if (this.h3fileType === 'DOCX') {
        link.click();
      } else if (this.h3fileType === 'TEXT') {
        link.click();
      } else if (this.h3fileType === 'TXT') {
        link.click();
      } else if (this.h3fileType === 'XLSX') {
        link.click();
      } else if (this.h3fileType === 'CSV') {
        link.click();
      } else if (this.h3fileType === 'RTF') {
        link.click();
      } else if (this.h3fileType === 'XLS') {
        link.click();
      } else if (this.h3fileType === 'XLSM') {
        link.click();
      } else if (this.h3fileType === 'PPT') {
        link.click();
      } else if (this.h3fileType === 'PPTX') {

        link.click();

      } else if (this.h3fileType === 'pdf') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'jpeg') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'jpg') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'png') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'gif') {

        window.open(this.h3url, '_blank');
      } else if (this.h3fileType === 'PDF') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'JPEG') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'JPG') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'PNG') {

        window.open(this.h3url, '_blank');

      } else if (this.h3fileType === 'GIF') {

        window.open(this.h3url, '_blank');
      }
    } else if (action == 'h4') {
      link.href = this.h4url;
      link.download = this.h4fileName;
      console.log(this.h4fileType);

      if (this.h4fileType === 'doc') {
        link.click();
      } else if (this.h4fileType === 'docx') {
        link.click();
      } else if (this.h4fileType === 'text') {
        link.click();
      } else if (this.h4fileType === 'txt') {
        link.click();
      } else if (this.h4fileType === 'xlsx') {
        link.click();
      } else if (this.h4fileType === 'csv') {
        link.click();
      } else if (this.h4fileType === 'rtf') {
        link.click();
      } else if (this.h4fileType === 'xls') {
        link.click();
      } else if (this.h4fileType === 'xlsm') {
        link.click();
      } else if (this.h4fileType === 'ppt') {
        link.click();
      } else if (this.h4fileType === 'pptx') {

        link.click();
      } else if (this.h4fileType === 'DOC') {
        link.click();
      } else if (this.h4fileType === 'DOCX') {
        link.click();
      } else if (this.h4fileType === 'TEXT') {
        link.click();
      } else if (this.h4fileType === 'TXT') {
        link.click();
      } else if (this.h4fileType === 'XLSX') {
        link.click();
      } else if (this.h4fileType === 'CSV') {
        link.click();
      } else if (this.h4fileType === 'RTF') {
        link.click();
      } else if (this.h4fileType === 'XLS') {
        link.click();
      } else if (this.h4fileType === 'XLSM') {
        link.click();
      } else if (this.h4fileType === 'PPT') {
        link.click();
      } else if (this.h4fileType === 'PPTX') {

        link.click();

      } else if (this.h4fileType === 'pdf') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'jpeg') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'jpg') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'png') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'gif') {

        window.open(this.h4url, '_blank');
      } else if (this.h4fileType === 'PDF') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'JPEG') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'JPG') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'PNG') {

        window.open(this.h4url, '_blank');

      } else if (this.h4fileType === 'GIF') {

        window.open(this.h4url, '_blank');
      }

    } else if (action == 'h6') {
      link.href = this.h6url;
      link.download = this.h6fileName;
      console.log(this.h6fileType);

      if (this.h6fileType === 'doc') {
        link.click();
      } else if (this.h6fileType === 'docx') {
        link.click();
      } else if (this.h6fileType === 'text') {
        link.click();
      } else if (this.h6fileType === 'txt') {
        link.click();
      } else if (this.h6fileType === 'xlsx') {
        link.click();
      } else if (this.h6fileType === 'csv') {
        link.click();
      } else if (this.h6fileType === 'rtf') {
        link.click();
      } else if (this.h6fileType === 'xls') {
        link.click();
      } else if (this.h6fileType === 'xlsm') {
        link.click();
      } else if (this.h6fileType === 'ppt') {
        link.click();
      } else if (this.h6fileType === 'pptx') {

        link.click();
      } else if (this.h6fileType === 'DOC') {
        link.click();
      } else if (this.h6fileType === 'DOCX') {
        link.click();
      } else if (this.h6fileType === 'TEXT') {
        link.click();
      } else if (this.h6fileType === 'TXT') {
        link.click();
      } else if (this.h6fileType === 'XLSX') {
        link.click();
      } else if (this.h6fileType === 'CSV') {
        link.click();
      } else if (this.h6fileType === 'RTF') {
        link.click();
      } else if (this.h6fileType === 'XLS') {
        link.click();
      } else if (this.h6fileType === 'XLSM') {
        link.click();
      } else if (this.h6fileType === 'PPT') {
        link.click();
      } else if (this.h6fileType === 'PPTX') {

        link.click();

      } else if (this.h6fileType === 'pdf') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'jpeg') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'jpg') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'png') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'gif') {

        window.open(this.h6url, '_blank');
      } else if (this.h6fileType === 'PDF') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'JPEG') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'JPG') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'PNG') {

        window.open(this.h6url, '_blank');

      } else if (this.h6fileType === 'GIF') {

        window.open(this.h6url, '_blank');
      }

    } else if (action == 'q1') {
      link.href = this.q1url;
      link.download = this.q1fileName;
      console.log(this.q1fileType);

      if (this.q1fileType === 'doc') {
        link.click();
      } else if (this.q1fileType === 'docx') {
        link.click();
      } else if (this.q1fileType === 'text') {
        link.click();
      } else if (this.q1fileType === 'txt') {
        link.click();
      } else if (this.q1fileType === 'xlsx') {
        link.click();
      } else if (this.q1fileType === 'csv') {
        link.click();
      } else if (this.q1fileType === 'rtf') {
        link.click();
      } else if (this.q1fileType === 'xls') {
        link.click();
      } else if (this.q1fileType === 'xlsm') {
        link.click();
      } else if (this.q1fileType === 'ppt') {
        link.click();
      } else if (this.q1fileType === 'pptx') {

        link.click();
      } else if (this.q1fileType === 'DOC') {
        link.click();
      } else if (this.q1fileType === 'DOCX') {
        link.click();
      } else if (this.q1fileType === 'TEXT') {
        link.click();
      } else if (this.q1fileType === 'TXT') {
        link.click();
      } else if (this.q1fileType === 'XLSX') {
        link.click();
      } else if (this.q1fileType === 'CSV') {
        link.click();
      } else if (this.q1fileType === 'RTF') {
        link.click();
      } else if (this.q1fileType === 'XLS') {
        link.click();
      } else if (this.q1fileType === 'XLSM') {
        link.click();
      } else if (this.q1fileType === 'PPT') {
        link.click();
      } else if (this.q1fileType === 'PPTX') {

        link.click();

      } else if (this.q1fileType === 'pdf') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'jpeg') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'jpg') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'png') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'gif') {

        window.open(this.q1url, '_blank');
      } else if (this.q1fileType === 'PDF') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'JPEG') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'JPG') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'PNG') {

        window.open(this.q1url, '_blank');

      } else if (this.q1fileType === 'GIF') {

        window.open(this.q1url, '_blank');
      }
    } else if (action == 'q2') {
      link.href = this.q2url;
      link.download = this.q2fileName;
      console.log(this.q2fileType);

      if (this.q2fileType === 'doc') {
        link.click();
      } else if (this.q2fileType === 'docx') {
        link.click();
      } else if (this.q2fileType === 'text') {
        link.click();
      } else if (this.q2fileType === 'txt') {
        link.click();
      } else if (this.q2fileType === 'xlsx') {
        link.click();
      } else if (this.q2fileType === 'csv') {
        link.click();
      } else if (this.q2fileType === 'rtf') {
        link.click();
      } else if (this.q2fileType === 'xls') {
        link.click();
      } else if (this.q2fileType === 'xlsm') {
        link.click();
      } else if (this.q2fileType === 'ppt') {
        link.click();
      } else if (this.q2fileType === 'pptx') {

        link.click();
      } else if (this.q2fileType === 'DOC') {
        link.click();
      } else if (this.q2fileType === 'DOCX') {
        link.click();
      } else if (this.q2fileType === 'TEXT') {
        link.click();
      } else if (this.q2fileType === 'TXT') {
        link.click();
      } else if (this.q2fileType === 'XLSX') {
        link.click();
      } else if (this.q2fileType === 'CSV') {
        link.click();
      } else if (this.q2fileType === 'RTF') {
        link.click();
      } else if (this.q2fileType === 'XLS') {
        link.click();
      } else if (this.q2fileType === 'XLSM') {
        link.click();
      } else if (this.q2fileType === 'PPT') {
        link.click();
      } else if (this.q2fileType === 'PPTX') {

        link.click();

      } else if (this.q2fileType === 'pdf') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'jpeg') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'jpg') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'png') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'gif') {

        window.open(this.q2url, '_blank');
      } else if (this.q2fileType === 'PDF') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'JPEG') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'JPG') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'PNG') {

        window.open(this.q2url, '_blank');

      } else if (this.q2fileType === 'GIF') {

        window.open(this.q2url, '_blank');
      }
    } else if (action == 'q3') {
      link.href = this.q3url;
      link.download = this.q3fileName;
      console.log(this.q3fileType);

      if (this.q3fileType === 'doc') {
        link.click();
      } else if (this.q3fileType === 'docx') {
        link.click();
      } else if (this.q3fileType === 'text') {
        link.click();
      } else if (this.q3fileType === 'txt') {
        link.click();
      } else if (this.q3fileType === 'xlsx') {
        link.click();
      } else if (this.q3fileType === 'csv') {
        link.click();
      } else if (this.q3fileType === 'rtf') {
        link.click();
      } else if (this.q3fileType === 'xls') {
        link.click();
      } else if (this.q3fileType === 'xlsm') {
        link.click();
      } else if (this.q3fileType === 'ppt') {
        link.click();
      } else if (this.q3fileType === 'pptx') {

        link.click();
      } else if (this.q3fileType === 'DOC') {
        link.click();
      } else if (this.q3fileType === 'DOCX') {
        link.click();
      } else if (this.q3fileType === 'TEXT') {
        link.click();
      } else if (this.q3fileType === 'TXT') {
        link.click();
      } else if (this.q3fileType === 'XLSX') {
        link.click();
      } else if (this.q3fileType === 'CSV') {
        link.click();
      } else if (this.q3fileType === 'RTF') {
        link.click();
      } else if (this.q3fileType === 'XLS') {
        link.click();
      } else if (this.q3fileType === 'XLSM') {
        link.click();
      } else if (this.q3fileType === 'PPT') {
        link.click();
      } else if (this.q3fileType === 'PPTX') {

        link.click();

      } else if (this.q3fileType === 'pdf') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'jpeg') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'jpg') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'png') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'gif') {

        window.open(this.q3url, '_blank');
      } else if (this.q3fileType === 'PDF') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'JPEG') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'JPG') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'PNG') {

        window.open(this.q3url, '_blank');

      } else if (this.q3fileType === 'GIF') {

        window.open(this.q3url, '_blank');
      }
    } else if (action == 'b1') {
      link.href = this.b1url;
      link.download = this.b1fileName;
      console.log(this.b1fileType);

      if (this.b1fileType === 'doc') {
        link.click();
      } else if (this.b1fileType === 'docx') {
        link.click();
      } else if (this.b1fileType === 'text') {
        link.click();
      } else if (this.b1fileType === 'txt') {
        link.click();
      } else if (this.b1fileType === 'xlsx') {
        link.click();
      } else if (this.b1fileType === 'csv') {
        link.click();
      } else if (this.b1fileType === 'rtf') {
        link.click();
      } else if (this.b1fileType === 'xls') {
        link.click();
      } else if (this.b1fileType === 'xlsm') {
        link.click();
      } else if (this.b1fileType === 'ppt') {
        link.click();
      } else if (this.b1fileType === 'pptx') {

        link.click();
      } else if (this.b1fileType === 'DOC') {
        link.click();
      } else if (this.b1fileType === 'DOCX') {
        link.click();
      } else if (this.b1fileType === 'TEXT') {
        link.click();
      } else if (this.b1fileType === 'TXT') {
        link.click();
      } else if (this.b1fileType === 'XLSX') {
        link.click();
      } else if (this.b1fileType === 'CSV') {
        link.click();
      } else if (this.b1fileType === 'RTF') {
        link.click();
      } else if (this.b1fileType === 'XLS') {
        link.click();
      } else if (this.b1fileType === 'XLSM') {
        link.click();
      } else if (this.b1fileType === 'PPT') {
        link.click();
      } else if (this.b1fileType === 'PPTX') {

        link.click();

      } else if (this.b1fileType === 'pdf') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'jpeg') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'jpg') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'png') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'gif') {

        window.open(this.b1url, '_blank');
      } else if (this.b1fileType === 'PDF') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'JPEG') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'JPG') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'PNG') {

        window.open(this.b1url, '_blank');

      } else if (this.b1fileType === 'GIF') {

        window.open(this.b1url, '_blank');
      }
    } else if (action == 'b2') {
      link.href = this.b2url;
      link.download = this.b2fileName;
      console.log(this.b2fileType);

      if (this.b2fileType === 'doc') {
        link.click();
      } else if (this.b2fileType === 'docx') {
        link.click();
      } else if (this.b2fileType === 'text') {
        link.click();
      } else if (this.b2fileType === 'txt') {
        link.click();
      } else if (this.b2fileType === 'xlsx') {
        link.click();
      } else if (this.b2fileType === 'csv') {
        link.click();
      } else if (this.b2fileType === 'rtf') {
        link.click();
      } else if (this.b2fileType === 'xls') {
        link.click();
      } else if (this.b2fileType === 'xlsm') {
        link.click();
      } else if (this.b2fileType === 'ppt') {
        link.click();
      } else if (this.b2fileType === 'pptx') {

        link.click();
      } else if (this.b2fileType === 'DOC') {
        link.click();
      } else if (this.b2fileType === 'DOCX') {
        link.click();
      } else if (this.b2fileType === 'TEXT') {
        link.click();
      } else if (this.b2fileType === 'TXT') {
        link.click();
      } else if (this.b2fileType === 'XLSX') {
        link.click();
      } else if (this.b2fileType === 'CSV') {
        link.click();
      } else if (this.b2fileType === 'RTF') {
        link.click();
      } else if (this.b2fileType === 'XLS') {
        link.click();
      } else if (this.b2fileType === 'XLSM') {
        link.click();
      } else if (this.b2fileType === 'PPT') {
        link.click();
      } else if (this.b2fileType === 'PPTX') {

        link.click();

      } else if (this.b2fileType === 'pdf') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'jpeg') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'jpg') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'png') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'gif') {

        window.open(this.b2url, '_blank');
      } else if (this.b2fileType === 'PDF') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'JPEG') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'JPG') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'PNG') {

        window.open(this.b2url, '_blank');

      } else if (this.b2fileType === 'GIF') {

        window.open(this.b2url, '_blank');
      }
    }

  }

  showFile(id) {

    this.http.get('http://localhost:3000/api/files/' + id, {
      responseType: 'arraybuffer'
    }
    ).subscribe(response =>
      this.downLoadFile(response, "application/pdf"));

  }

  showFileTemp(id) {

    if (!this.istemp) {
      this.http.get('http://localhost:3000/api/files/' + id, {
        responseType: 'arraybuffer'
      }
      ).subscribe(response =>
        this.downLoadFile(response, "application/pdf"));
    } else {
      this.http.get('http://localhost:3000/api/filesTemp/' + id, {
        responseType: 'arraybuffer'
      }
      ).subscribe(response =>
        this.downLoadFile(response, "application/pdf"));
    }
  }

  downLoadFile(data: any, type: string) {
    console.log(data);
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);

    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  isSupplierExists(category: string) {


  }
  timeout: any = null;
  onKeySearch(event: any, cat: string) {
    if (this.supplier_id == 0) {
      if (cat == 'E') {
        if (this.firstFormGroup.value.countryCtrl != 'SAUDI ARABIA') {
          this.isGosihijriSelected = true;
          this.isZakathhijriSelected = true;
          this.isSaudihijriSelected = true;

          this.isVatFileSelected = true;
          this.isGosiFileSelected = true;
          this.isSaudiFileSelected = true;
          this.isZakathFileSelected = true;
          // isRegFileSelected

        }

        if (this.firstFormGroup.getRawValue().emailCtrl != '') {
          var emailvalue = this.firstFormGroup.getRawValue().emailCtrl.toLowerCase().trim();
          var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);  // ("^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-z]{2,6})$");
          var res = pattern.test(emailvalue);
          if (res) {
            if ((this.isrejectalreadyloaded && this.supplier.email != this.firstFormGroup.getRawValue().emailCtrl) || !this.isrejectalreadyloaded) {
              this.executeListing(event.target.value, cat);
            }
          } else {
            this.firstFormGroup.get('emailCtrl').setErrors({ pattern: true });
          }
          // this.executeListing(event.target.value, cat);
        } else {
          this.firstFormGroup.get('emailCtrl').setErrors({ required: true });
        }

      } else {
        this.executeListing(event.target.value, cat);
      }
    }
    else if (this.supplier_id > 0 && cat == 'E') {
      if (this.supplier.email != this.firstFormGroup.getRawValue().emailCtrl) {
        var emailvalue = this.firstFormGroup.getRawValue().emailCtrl.toLowerCase().trim();
        var pattern = new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9._-]+[a-zA-Z0-9]+@[a-zA-Z0-9]+[a-zA-Z0-9.-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}$/g);  // ("^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+(?:\.[a-z]{2,6})$");
        var res = pattern.test(emailvalue);
        if (res) {
          this.executeListing(event.target.value, cat);
        } else {
          this.firstFormGroup.get('emailCtrl').setErrors({ pattern: true });
        }
        this.executeListing(event.target.value, cat);
      } else {
        if (event.target.value == '') {
          this.firstFormGroup.get('emailCtrl').setErrors({ required: true });
        } else {
          this.firstFormGroup.get('emailCtrl').markAsUntouched();
        }
      }
    }
    else if (this.supplier_id > 0 && cat == 'N') {
      if (this.supplier.supplier_name != this.firstFormGroup.getRawValue().supplierNameCtrl) {
        this.executeListing(event.target.value, cat);
      } else {
        this.firstFormGroup.get('supplierNameCtrl').markAsUntouched();
      }
    }
    else if (this.supplier_id > 0 && cat == 'R') {
      if (this.supplier.cr_no != this.firstFormGroup.getRawValue().registrationCtrl) {
        this.executeListing(event.target.value, cat);
      } else {
        this.firstFormGroup.get('registrationCtrl').markAsUntouched();
      }
    }

    // if (this.firstFormGroup.value.supplierNameCtrl != '' && this.firstFormGroup.value.emailCtrl != '' && (this.firstFormGroup.controls.emailCtrl.status != 'INVALID' && this.firstFormGroup.controls.supplierNameCtrl.status != 'INVALID')) {
    //   this.istempsave = true;
    // } else {
    //   this.istempsave = false;
    // }
    // }, 1000);
  }

  onKeySearchIban(event: any) {
    if (this.thirdFormGroup.value.bankCountryCodesCtrl != '') {
      var countrycode = this.originalCountryList.filter(x => x.description == this.thirdFormGroup.value.bankCountryCodesCtrl)[0].countryCode;
      if (event.target.value != '') {
        if (this.thirdFormGroup.value.ibanNumberCtrl.startsWith(countrycode)) {
          if (this.supplier_id == 0) {
            this.executeListingIban(event.target.value);
          }
          else {
            if (this.supplier.ibanNo != this.thirdFormGroup.getRawValue().ibanNumberCtrl) {
              this.executeListingIban(event.target.value);
            } else {
              this.thirdFormGroup.get('ibanNumberCtrl').markAsUntouched();
            }
          }
        } else {
          this.ibancodeerror = 'Iban should starts with bank country code';
          this.thirdFormGroup.get('ibanNumberCtrl').setErrors({ invalid: true });
        }
      }
    } else {
      this.ibancodeerror = 'Bank country should not be blank';
      this.thirdFormGroup.patchValue({
        ibanNumberCtrl: ''
      });
      this.thirdFormGroup.get('ibanNumberCtrl').setErrors({ invalid: true });
    }

  }

  onKeySearchBic(event: any) {
    if (event.target.value != '') {
      if (this.supplier_id == 0) {
        this.executeListingBic(event.target.value);
      }
      else {
        if (this.supplier.ibanNo != this.thirdFormGroup.getRawValue().swiftCtrl) {
          this.executeListingBic(event.target.value);
        } else {
          this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
        }
      }
    }
  }

  onKeySearchType(event: any) {
    if (event.target.value != '') {
      this.isTypeOfOrganization2CtrlSelected = true;
    } else {
      this.isTypeOfOrganization2CtrlSelected = false;
    }

    if (this.secondFormGroup.value.typeOfOrganizationCtrl == 'Other - Please Specify') {
      if (this.secondFormGroup.value.typeOfOrganization2Ctrl == null) {
        this.isTypeOfOrganization2CtrlSelected = false;
      } else if (this.secondFormGroup.value.typeOfOrganization2Ctrl != null) {
        this.isTypeOfOrganization2CtrlSelected = true;
        if (this.secondFormGroup.value.typeOfOrganization2Ctrl == '') {
          this.isTypeOfOrganization2CtrlSelected = false;
        }

      }
    } else {
      this.isTypeOfOrganization2CtrlSelected = true;
    }
  }

  isvalid(event) {
    var url = event.target.value;
    this.http.get(environment.nodeurl + '/api/template/IsValidUri?uri=' + url)
      .subscribe(data => {
        if (data) {
          this.firstFormGroup.get('websiteCtrl').markAsUntouched();
        } else {
          this.firstFormGroup.get('websiteCtrl').setErrors({ invalidWebsiteURL: true });
        }
      });
  }

  onEmpEnter() {
    const saudi = this.secondFormGroup.value.saudiNationalslCtrl;
    const managerial = this.secondFormGroup.value.managerialCtrl;
    const technical = this.secondFormGroup.value.technicallCtrl;
    const operation = this.secondFormGroup.value.operationsCtrl;

    this.totalVal = managerial + technical + operation;

    this.secondFormGroup.patchValue({
      totallCtrl: this.totalVal
    });

    if ((saudi - (managerial + technical + operation)) > 0) {
      this.secondFormGroup.get('saudiNationalslCtrl').setErrors({ exceed: true });
      this.secondFormGroup.get('saudiNationalslCtrl').markAsTouched();
    } else {
      // this.secondFormGroup.get('saudiNationalslCtrl').setErrors(null);
      this.secondFormGroup.get('saudiNationalslCtrl').markAsUntouched();
    }


  }

  isrejectalreadyloaded: boolean = false;

  executeListing(value: string, category: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    var body = {
      value
    };

    if (value != '' && !(value == 'Sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'Nadun.Ruchiranga@xitricon.com' || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com')) {
      var isExist: IsExists = new IsExists();
      isExist.value = value;
      isExist.category = category;

      this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {
        if (data != null && data['status'] != 'Reactivated') {
          if (category == 'N') {
            this.isnameexists = true;
            this.firstFormGroup.get('supplierNameCtrl').setErrors({ invalid: true });
          } else if (category == 'E') {
            this.isemailexists = true;
            this.firstFormGroup.get('emailCtrl').setErrors({ invalid: true });
          }  else if (category == 'EA1') {
            this.additionalEmailCheck1 = true;
          } else if (category == 'EA2') {
            this.additionalEmailCheck2 = true;
          } else if (category == 'R') {
            this.iscrnoexists = true;
            this.firstFormGroup.get('registrationCtrl').setErrors({ invalid: true });
            //this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });
          }
        }
        else if (data != null && data['status'] == 'Reactivated') {
          var newvalue = '';
          var oldvalue = '';
          if (category == 'N') {
            this.isnameexists = false;
            this.firstFormGroup.get('supplierNameCtrl').markAsUntouched();
            newvalue = this.firstFormGroup.getRawValue().supplierNameCtrl;
            oldvalue = this.supplier.supplier_name;
          } else if (category == 'E') {
            this.isemailexists = false;
            this.firstFormGroup.get('emailCtrl').markAsUntouched();
            newvalue = this.firstFormGroup.getRawValue().emailCtrl;
            oldvalue = this.supplier.email;
          } else if (category == 'R') {
            this.iscrnoexists = false;
            this.firstFormGroup.get('registrationCtrl').markAsUntouched();
            newvalue = this.firstFormGroup.getRawValue().registrationCtrl;
            oldvalue = this.supplier.cr_no;
          }
          if (!(this.isrejectalreadyloaded && newvalue == oldvalue)) {
            Swal.fire({
              title: 'The registration request with the entered supplier name already exists!!',
              html: '<span style="float:left;">Select the following options:</span></br><span style="float:left;"><b>To load the existing information, please press – Yes </b></span></br><span style="float:left;"><b>To fill in the new registration detail,please press - No</b></span>',
              // icon: 'question',
              width: "800px",
              showCancelButton: true,
              confirmButtonText: `Yes`,
              cancelButtonText: `No`,
              // denyButtonText: `Don't Load`,
            }).then((result) => {
              this.isrejectalreadyloaded = true;
              if (result.isConfirmed) {
                this.getRejectedSupplier(data['supplieR_ID']);
              } else if (result.isDismissed) {
                if (category == 'N') {
                  this.firstFormGroup.patchValue({
                    supplierNameCtrl: ''
                  });
                } else if (category == 'E') {
                  this.firstFormGroup.patchValue({
                    emailCtrl: ''
                  });
                } else if (category == 'R') {
                  this.firstFormGroup.patchValue({
                    registrationCtrl: ''
                  });
                }
              }
            });
          }
        }
        else {
          if (category == 'N') {
            this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'N', body, options).subscribe(data3 => {
              var data = data3;
              if (data3 != null && Number(data3['Message']) > 0) {
                this.isnameexists = true;
                this.firstFormGroup.get('supplierNameCtrl').setErrors({ invalid: true });
              } else {
                this.isnameexists = false;
                this.firstFormGroup.get('supplierNameCtrl').markAsUntouched();
              }
            });
          } else if (category == 'E') {
            this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'E', body, options).subscribe(data3 => {
              var data = data3;
              if (data3 != null && Number(data3['Message']) > 0) {
                this.isnameexists = true;
                this.firstFormGroup.get('emailCtrl').setErrors({ invalid: true });
              } else {
                this.isemailexists = false;
                this.firstFormGroup.get('emailCtrl').markAsUntouched();
              }
            });
          } else if (category == 'R') {
            this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'R', body, options).subscribe(data3 => {
              var data = data3;
              if (data3 != null && Number(data3['Message']) > 0) {
                this.isnameexists = true;
                this.firstFormGroup.get('registrationCtrl').setErrors({ invalid: true });
                this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });

              } else {
                this.iscrnoexists = false;
                this.firstFormGroup.get('registrationCtrl').markAsUntouched();
                this.firstFormGroup.get('vatCtrl').markAsUntouched();
              }
            });


          }
        }
      });
    }
  }

  executeListingTemp(value: string, category: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };
    var body = {
      value
    };

    if (value != '' && !(value == 'Sooae.cho@imi-ksa.com' || value == 'muhammed.nauman@imi-ksa.com' || value == 'Nadun.Ruchiranga@xitricon.com' || value == 'chathurya.heshani@xitricon.com' || value == 'uresha.sewwandi@xitricon.com')) {
      var isExist: IsExists = new IsExists();
      isExist.value = value;
      isExist.category = category;

      this.http.post<any>(environment.nodeurl + '/api/supplier/isexistsWithStatus', isExist).subscribe(data => {
        if (data != null && data['status'] != 'Reactivated') {
          if (category == 'N') {
            this.isnameexists = true;
            this.firstFormGroup.get('supplierNameCtrl').setErrors({ invalid: true });
            this.toast(TYPE.WARNING, false, 'Supplier Name already exists');
          } else if (category == 'E') {
            this.isemailexists = true;
            this.firstFormGroup.get('emailCtrl').setErrors({ invalid: true });
            this.toast(TYPE.WARNING, false, 'Supplier Email already exists');
          } else if (category == 'R') {
            this.iscrnoexists = true;
            this.firstFormGroup.get('registrationCtrl').setErrors({ invalid: true });
            this.toast(TYPE.WARNING, false, 'Registration no already exists');
            //this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });
          }
        }
        else if (data != null && data['status'] == 'Reactivated') {
          var newvalue = '';
          var oldvalue = '';
          if (category == 'N') {
            this.isnameexists = false;
            this.firstFormGroup.get('supplierNameCtrl').markAsUntouched();
            newvalue = this.firstFormGroup.getRawValue().supplierNameCtrl;
            oldvalue = this.supplier.supplier_name;
          } else if (category == 'E') {
            this.isemailexists = false;
            this.firstFormGroup.get('emailCtrl').markAsUntouched();
            newvalue = this.firstFormGroup.getRawValue().emailCtrl;
            oldvalue = this.supplier.email;
          } else if (category == 'R') {
            this.iscrnoexists = false;
            this.firstFormGroup.get('registrationCtrl').markAsUntouched();
            newvalue = this.firstFormGroup.getRawValue().registrationCtrl;
            oldvalue = this.supplier.cr_no;
          }
          if (!(this.isrejectalreadyloaded && newvalue == oldvalue)) {
            Swal.fire({
              title: 'The registration request with the entered supplier name already exists!!',
              html: '<span style="float:left;">Select the following options:</span></br><span style="float:left;"><b>To load the existing information, please press – Yes </b></span></br><span style="float:left;"><b>To fill in the new registration detail,please press - No</b></span>',
              // icon: 'question',
              width: "800px",
              showCancelButton: true,
              confirmButtonText: `Yes`,
              cancelButtonText: `No`,
              // denyButtonText: `Don't Load`,
            }).then((result) => {
              this.isrejectalreadyloaded = true;
              if (result.isConfirmed) {
                this.getRejectedSupplier(data['supplieR_ID']);
              } else if (result.isDismissed) {
                if (category == 'N') {
                  this.firstFormGroup.patchValue({
                    supplierNameCtrl: ''
                  });
                } else if (category == 'E') {
                  this.firstFormGroup.patchValue({
                    emailCtrl: ''
                  });
                } else if (category == 'R') {
                  this.firstFormGroup.patchValue({
                    registrationCtrl: ''
                  });
                }
              }
            });
          }
        }
        else {
          if (category == 'N') {
            this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'N', body, options).subscribe(data3 => {
              var data = data3;
              if (data3 != null && Number(data3['Message']) > 0) {
                this.isnameexists = true;
                this.firstFormGroup.get('supplierNameCtrl').setErrors({ invalid: true });
                this.toast(TYPE.WARNING, false, 'Supplier Name already exists');
              } else {
                this.isnameexists = false;
                this.firstFormGroup.get('supplierNameCtrl').markAsUntouched();
              }
            });
          } else if (category == 'E') {
            this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'E', body, options).subscribe(data3 => {
              var data = data3;
              if (data3 != null && Number(data3['Message']) > 0) {
                this.isnameexists = true;
                this.firstFormGroup.get('emailCtrl').setErrors({ invalid: true });
                this.toast(TYPE.WARNING, false, 'Supplier Email already exists');
              } else {
                this.isemailexists = false;
                this.firstFormGroup.get('emailCtrl').markAsUntouched();
              }
            });
          } else if (category == 'R') {
            this.http.put<any>(environment.ifsIntegrationUrl + '/api/supplier?cat=' + 'R', body, options).subscribe(data3 => {
              var data = data3;
              if (data3 != null && Number(data3['Message']) > 0) {
                this.isnameexists = true;
                this.firstFormGroup.get('registrationCtrl').setErrors({ invalid: true });
                this.firstFormGroup.get('vatCtrl').setErrors({ invalid: true });
                this.toast(TYPE.WARNING, false, 'Registration no already exists');

              } else {
                this.iscrnoexists = false;
                this.firstFormGroup.get('registrationCtrl').markAsUntouched();
                this.firstFormGroup.get('vatCtrl').markAsUntouched();
              }
            });


          }
        }
      });
    }
  }

  onKeySearchIbanSubmit() {
    if (this.thirdFormGroup.value.bankCountryCodesCtrl != '') {
      var countrycode = this.originalCountryList.filter(x => x.description == this.thirdFormGroup.value.bankCountryCodesCtrl)[0].countryCode;
      if (this.thirdFormGroup.value.ibanNumberCtrl != '') {
        if (this.thirdFormGroup.value.ibanNumberCtrl.startsWith(countrycode)) {
          if (this.supplier_id == 0) {
            this.executeListingIban(this.thirdFormGroup.value.ibanNumberCtrl);
          }
          else {
            if (this.supplier.ibanNo != this.thirdFormGroup.getRawValue().ibanNumberCtrl) {
              this.executeListingIban(this.thirdFormGroup.value.ibanNumberCtrl);
            } else {
              this.thirdFormGroup.get('ibanNumberCtrl').markAsUntouched();
            }
          }
        } else {
          this.ibancodeerror = 'Iban should starts with bank country code';
          this.thirdFormGroup.get('ibanNumberCtrl').setErrors({ invalid: true });
        }
      }
    } else {
      this.ibancodeerror = 'Bank country should not be blank';
      this.thirdFormGroup.patchValue({
        ibanNumberCtrl: ''
      });
      this.thirdFormGroup.get('ibanNumberCtrl').setErrors({ invalid: true });
    }

  }

  onKeySearchBicSubmit() {
    if (this.thirdFormGroup.value.swiftCtrl != '') {
      if (this.supplier_id == 0) {
        if(this.thirdFormGroup.value.swiftCtrl != undefined){
          this.executeListingBic(this.thirdFormGroup.value.swiftCtrl);
        }else{
          this.biccodeerror = '';
          this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
        }
      }
      else {
        if (this.supplier.ibanNo != this.thirdFormGroup.getRawValue().swiftCtrl) {
          if(this.thirdFormGroup.value.swiftCtrl != undefined){
            this.executeListingBic(this.thirdFormGroup.value.swiftCtrl);
          }else{
            this.biccodeerror = '';
            this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
          }
        } else {
          this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
        }
      }
    }
  }

  executeListingIban(value: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };

    this.http.get<any>(environment.ifsIntegrationUrl + '/api/bank/?ibanNo=' + value).subscribe(data => {
      if (data["Response"]) {
        if (data["Message"] != null && data["Message"] == "FALSE") {
          this.ibancodeerror = 'Iban no is not valid';
          this.thirdFormGroup.get('ibanNumberCtrl').setErrors({ invalid: true });
        } else {
          this.thirdFormGroup.get('ibanNumberCtrl').markAsUntouched();
        }
      } else {
        this.thirdFormGroup.get('ibanNumberCtrl').markAsUntouched();
      }
    });
  }

  executeListingBic(value: string) {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    let options = { headers: headers };

    this.http.get<any>(environment.ifsIntegrationUrl + '/api/file?bicno=' + value).subscribe(data => {
      if (data["Response"]) {
        if (data["Message"] != null && data["Message"] == "FALSE") {
          this.thirdFormGroup.get('swiftCtrl').setErrors({ invalid: true });
        } else {
          this.biccodeerror = '';
          this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
        }
      } else {
        if (data["Message"] != null) {
          this.biccodeerror = data['Message'].split(':')[1].trim()
          this.thirdFormGroup.get('swiftCtrl').setErrors({ invalid: true });
        } else {
          this.biccodeerror = '';
          this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
        }
        //do not uncomment
        //this.thirdFormGroup.get('swiftCtrl').markAsUntouched();
      }
    });
  }

  get f() {
    return this.firstFormGroup.controls;
  }

  getRejectedSupplier(supplierid) {
    this.istempsave = true;
    this.http.get(environment.nodeurl + '/api/supplier/register?suplierId=' + supplierid)
      .subscribe(data => {
        if (data) {
          this.supplierIdforMoreinfo = supplierid;
          this.isNeedmoreInfo = true;
          this.rejectedSupplierId = supplierid;
          this.addAnother = true;
          this.addAnother2 = true;
          this.addAnother3 = true;
          this.addAnother4 = true;
          this.additionalAttachButton = true;
          this.getRegisteredPhotos(supplierid);
          this.setValues(data[0]);
          let catvalues = data[0].supplierCategories;
          this.supplier_id = 0;
          if (catvalues) {
            this.dataSourceAll = []
            for (let i = 0; i < catvalues.length; i++) {
              this.dataSourceAll.push({
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
          }

          setTimeout(() => {
            if (data[0].hijriSelected == 'Y') {
              this.changeDate(this.modelReg, 'reghijri');
              this.changeDate(this.modelGosi, 'gosihijri');
              this.changeDate(this.modelSaudi, 'saudihijri');
              this.changeDate(this.modelZakat, 'zakathijri');
            } else if (data[0].hijriSelected == 'N' && data[0].country == 'SAUDI ARABIA') {
              this.changeDate(this.modelReg, 'reggregory');
              this.changeDate(this.modelGosi, 'gosigregory');
              this.changeDate(this.modelSaudi, 'saudigregory');
              this.changeDate(this.modelZakat, 'zakatgregory');
            } else {
              this.changeDate(this.modelReg, 'reggregory');
            }
          }, 1000);
        }
      },
        error => Swal.fire('Supplier Already Registered. Please start new!', '', 'success')
      )
  }

  toastSubmit(typeIcon = TYPE.SUCCESS, timerProgressBar: boolean = false, message) {
    Swal.fire({
      toast: true,
      showClass: {
        popup: 'test-toast'
      },
      position: 'bottom-end',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar,
      title: message,
      showCloseButton: true,
      // showCancelButton: true,
      focusConfirm: true,
      width: '400px'
    })
  }

  toast(typeIcon = TYPE.SUCCESS, timerProgressBar: boolean = false, message) {
    Swal.fire({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      icon: typeIcon,
      timerProgressBar,
      title: message,
      showCloseButton: true,
      // showCancelButton: true,
      focusConfirm: true,
      width: '400px'
    })
  }


}

export enum TYPE {
  ERROR = 'error',
  SUCCESS = 'success',
  WARNING = 'warning',
  INFO = 'info',
  QUESTION = 'question'
}

export const YearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  var currentyear = (new Date()).getFullYear();
  const establishyear = control.parent.get('establishmentYearCtrl');
  if (establishyear.value < (new Date()).getFullYear() || establishyear.value == (new Date()).getFullYear()) {
    return null;
  }
  return { futureyear: true };
}
export const YearValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const establishyear = control.parent.get('establishmentYearCtrl');
  if (establishyear.value == "" || ('' + establishyear.value).length > 4 || ('' + establishyear.value).length == 4) {
    return null;
  }
  return { pastyear: true };
}

export const YearValidator3: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const establishyear = control.parent.get('establishmentYearCtrl');
  if (establishyear.value == '0' || establishyear.value == '00' || establishyear.value == '000'
    || establishyear.value == '0000' || establishyear.value == '00000' || establishyear.value == '000000'
    || establishyear.value == '0000000' || establishyear.value == '00000000' || establishyear.value == '000000000'
    || establishyear.value == '0000000000') {
    return { invalidyear: true };
  }
  return null;
}

//Working URL validator before added the new regX

// export const URLValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//   if (!control.parent || !control) {
//     return null;
//   }

//   const validURL = control.parent.get('websiteCtrl').value ? control.parent.get('websiteCtrl').value.toLowerCase() : '';

//   // var patt = new RegExp("(https?://)?([\\dA-Za-z0-9.-]+)\\.([A-Za-z0-9.]{2,6})[/\\w .-]*?\\.([A-Za-z0-9.]{2,6})/?");
//   //Validators.compose([Validators.pattern('^((www)\.)([a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+)$')])
//   var patt = new RegExp("^((www)\.)([a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+)$");
//   var res = patt.test(validURL);

//   const str = validURL.split(".");

//   // if ((str[0] == "www" && res == true) || validURL == '') { // && result == true) {
//   //   return null;
//   // }
//   if ((res == true || validURL == '') && validURL.split(',').length == 1) {
//     return null;
//   }

//   return { invalidWebsiteURL: true };

// }

export const URLValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const webUrl = control.parent.get('websiteCtrl').value;
  var regxWebPattern = new RegExp(/^((www|WWW)\.)((?!-)[a-zA-Z0-9-\.)]{2,64})+(\.[a-zA-Z]{2,})+$/);
  var regxSpecialChar = new RegExp(/[ `!@#$%^&*()_+=\[\]{};':\|,<>\/?~]/);

  if (webUrl != '' && webUrl != undefined) {
    if (regxSpecialChar.test(webUrl)) {
      return { invalidWebsiteURL: true }
    } else if (!regxWebPattern.test(webUrl)) {
      return { invalidWebsiteURL: true }
    }
    else {
      var dashCount = 0;
      var dotCount = 0;
      for (var i = 0; i < webUrl.length; i++) {
        if (webUrl.charAt(i) === '-') {
          dashCount++
        }
        if (webUrl.charAt(i) === '.') {
          dotCount++
        }
      }
      if (dashCount > 1 || dotCount > 3) {
        return { invalidWebsiteURL: true }
      }
    }
    return null;
  }
  return null;
}

export const BankNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const BankName = control.parent.get('bankNameCtrl').value;
  const OtherBank = control.parent.get('otherNameCtrl').value;

  if (BankName == "Other" && OtherBank == '') { // && result == true) {
    return { bankNameRequired: true }
  }

  return null;

}

export const ExpYesNoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const suspendedprj = control.parent.get('suspendedProj1Ctrl');
  const suspendedprj2 = control.parent.get('suspendedProj2Ctrl');
  if (suspendedprj.value == 'Yes' && suspendedprj2.value == '') {
    return { suspend: true };
  }
  return null;
}

export const SaudiNationalValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const Total = control.parent.get('totallCtrl');
  const saudi = control.parent.get('saudiNationalslCtrl');
  const managerial = control.parent.get('managerialCtrl');
  const technical = control.parent.get('technicallCtrl');
  const operation = control.parent.get('operationsCtrl');
  if (saudi.value > (managerial.value + technical.value + operation.value)) {
    return { exceed: true };
  }
  return null;
}

export const LegalYesNoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const litigation1 = control.parent.get('litigation1Ctrl');
  const litigation1re = control.parent.get('litigation2Ctrl');

  if (litigation1.value == 'Yes' && litigation1re.value == '') {
    return { litierror: true };
  }
  if (litigation1.value == 'Yes' && litigation1re.value != '') {
    return null;
  }
  if (litigation1.value == 'No') {
    return null;
  }
  return null;
}


export const LegalYesNoValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const litigation2 = control.parent.get('shareholder1Ctrl');
  const litigation2re = control.parent.get('shareholder2Ctrl');

  if (litigation2.value == 'Yes' && litigation2re.value == '') {
    return { litierror2: true };
  }
  if (litigation2.value == 'Yes' && litigation2re.value != '') {
    return null;
  }

  if (litigation2.value == 'No') {
    return null;
  }
  return null;
}

export const LegalYesNoValidator3: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const litigation3 = control.parent.get('labour1Ctrl');
  const litigation3re = control.parent.get('labour2Ctrl');

  if (litigation3.value == 'Yes' && litigation3re.value == '') {
    return { litierror3: true };
  }
  if (litigation3.value == 'Yes' && litigation3re.value != '') {
    return null
  }

  if (litigation3.value == 'No') {
    return null;
  }
  return null;
}

export const LegalYesNoValidator4: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const litigation4 = control.parent.get('environment1Ctrl');
  const litigation4re = control.parent.get('environment2Ctrl');

  if (litigation4.value == 'Yes' && litigation4re.value == '') {
    return { litierror4: true };
  }
  if (litigation4.value == 'Yes' && litigation4re.value != '') {
    return null;
  }

  if (litigation4.value == 'No') {
    return null;
  }
  return null;
}
export const LegalYesNoValidator5: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const litigation5 = control.parent.get('imiInterested1trl');
  const litigation5re = control.parent.get('imiInterested2trl');

  if (litigation5.value == 'Yes' && litigation5re.value == '') {
    return { litierror5: true };
  }
  if (litigation5.value == 'Yes' && litigation5re.value != '') {
    return null;
  }
  if (litigation5.value == 'No') {
    return null;
  }
  return null;
}

export const LegalYesNoValidator6: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const litigation6 = control.parent.get('legalAsset1Ctrl');
  const litigation6re = control.parent.get('legalAsset2Ctrl');

  if (litigation6.value == 'Yes' && litigation6re.value == '') {
    return { litierror3: true };
  }
  if (litigation6.value == 'Yes' && litigation6re.value != '') {
    return null
  }

  if (litigation6.value == 'No') {
    return null;
  }
  return null;
}

export const HealthYesNoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const dedicate = control.parent.get('dedicatedpersCtrl');
  const hsename = control.parent.get('hseNameCtrl');

  if (dedicate.value == 'Yes' && hsename.value == '') {
    return { hsenameerr: true };
  }
  if (dedicate.value == 'Yes' && hsename.value != '') {
    return null;
  }
  if (dedicate.value == 'No') {
    return null;
  }
  return null;
}

export const HealthYesNoValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const dedicate = control.parent.get('dedicatedpersCtrl');
  const hsedes = control.parent.get('hseDesigCtrl');

  if (dedicate.value == 'Yes' && hsedes.value == '') {
    return { hsedeserr: true };
  } if (dedicate.value == 'Yes' && hsedes.value != '') {
    return null;
  }
  if (dedicate.value == 'No') {
    return null;
  }
  return null;
}


export const HealthYesNoValidator3: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const static1 = control.parent.get('statisticCtrl');
  const near = control.parent.get('statisticNearCtrl');


  if (static1.value == 'Yes' && near.value == '') {
    return { near: true };
  }
  if (static1.value == 'Yes' && near.value != '') {
    return null;
  }
  if (static1.value == 'No') {
    return null;
  }
  return null;
}


export const HealthYesNoValidator4: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const static1 = control.parent.get('statisticCtrl');
  const first = control.parent.get('statisticFirstCtrl');

  if (static1.value == 'Yes' && first.value == '') {
    return { first: true };
  }
  if (static1.value == 'Yes' && first.value != '') {
    return null;
  }
  if (static1.value == 'No') {
    return null;
  }
  return null;
}


export const HealthYesNoValidator5: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const static1 = control.parent.get('statisticCtrl');
  const medi = control.parent.get('statisticMediCtrl');


  if (static1.value == 'Yes' && medi.value == '') {
    return { medi: true };
  }
  if (static1.value == 'Yes' && medi.value != '') {
    return null;
  }
  if (static1.value == 'No') {
    return null;
  }
  return null;
}


export const HealthYesNoValidator6: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const static1 = control.parent.get('statisticCtrl');
  const lost = control.parent.get('statisticLostCtrl');

  if (static1.value == 'Yes' && lost.value == '') {
    return { lost: true };
  }
  if (static1.value == 'Yes' && lost.value != '') {
    return null;
  }
  if (static1.value == 'No') {
    return null;
  }
  return null;
}


export const HealthYesNoValidator7: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const static1 = control.parent.get('statisticCtrl');
  const fatal = control.parent.get('statisticFatalCtrl');

  if (static1.value == 'Yes' && fatal.value == '') {
    return { fatal: true };
  }
  if (static1.value == 'Yes' && fatal.value != '') {
    return null;
  }
  if (static1.value == 'No') {
    return null;
  }
  return null;
}


export const HealthYesNoValidator8: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const static1 = control.parent.get('statisticCtrl');
  const inci = control.parent.get('statisticEnvtCtrl');


  if (static1.value == 'Yes' && inci.value == '') {
    return { inci: true };
  }
  if (static1.value == 'Yes' && inci.value != '') {
    return null;
  }
  if (static1.value == 'No') {
    return null;
  }
  return null;
}

export const QualityYesNoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const dedicate = control.parent.get('qualityResp1Ctrl');
  const hsename = control.parent.get('qualityNameCtrl');

  if (dedicate.value == 'Yes' && hsename.value == '') {
    return { qhsenameerr: true };
  }
  if (dedicate.value == 'Yes' && hsename.value != '') {
    return null;
  }
  if (dedicate.value == 'No') {
    return null;
  }
  return null;
}

export const QualityYesNoValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const dedicate = control.parent.get('qualityResp1Ctrl');
  const hsedes = control.parent.get('qualityDesigCtrl');

  if (dedicate.value == 'Yes' && hsedes.value == '') {
    return { qhsedeserr: true };
  } if (dedicate.value == 'Yes' && hsedes.value != '') {
    return null;
  }
  if (dedicate.value == 'No') {
    return null;
  }
  return null;
}


export const FinanceYearValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance1 = control.parent.get('operatingProfit1Ctrl');
  const finance2 = control.parent.get('netIncome1Ctrl');
  const finance3 = control.parent.get('currentAsset1Ctrl');
  const finance4 = control.parent.get('totalLiable1Ctrl');
  const finance5 = control.parent.get('totalEquity1Ctrl');
  if (finance1.value != "" && finance1.value >= (new Date()).getFullYear()) {
    return { finance1year: true };;
  }
  if (finance2.value != "" && finance2.value >= (new Date()).getFullYear()) {
    return { finance2year: true };;
  }
  if (finance3.value != "" && finance3.value >= (new Date()).getFullYear()) {
    return { finance3year: true };;
  }
  if (finance4.value != "" && finance4.value >= (new Date()).getFullYear()) {
    return { finance4year: true };;
  }
  if (finance5.value != "" && finance5.value >= (new Date()).getFullYear()) {
    return { finance5year: true };;
  }
  return null;
}
export const FinanceYearValidate1: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance1 = control.parent.get('operatingProfit1Ctrl');
  if (finance1.value != "" && finance1.value >= (new Date()).getFullYear()) {
    return { finance1year: true };;
  }
  return null;
}
export const FinanceYearValidate2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance2 = control.parent.get('netIncome1Ctrl');
  if (finance2.value != "" && finance2.value >= (new Date()).getFullYear()) {
    return { finance2year: true };;
  }
  return null;
}
export const FinanceYearValidate3: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance3 = control.parent.get('currentAsset1Ctrl');
  if (finance3.value != "" && finance3.value >= (new Date()).getFullYear()) {
    return { finance3year: true };;
  }
  return null;
}
export const FinanceYearValidate4: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance4 = control.parent.get('totalLiable1Ctrl');
  if (finance4.value != "" && finance4.value >= (new Date()).getFullYear()) {
    return { finance4year: true };;
  }
  return null;
}
export const FinanceYearValidate5: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance5 = control.parent.get('totalEquity1Ctrl');
  if (finance5.value != "" && finance5.value >= (new Date()).getFullYear()) {
    return { finance5year: true };;
  }
  return null;
}
export const FinanceYearValidator2: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance1 = control.parent.get('operatingProfit1Ctrl');
  if (finance1.value == "" || ('' + finance1.value).length > 4 || ('' + finance1.value).length == 4) {
    return null;
  }
  return { finance1yearinvalid: true };
}
export const FinanceYearValidator3: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance2 = control.parent.get('netIncome1Ctrl');
  if (finance2.value == "" || ('' + finance2.value).length > 4 || ('' + finance2.value).length == 4) {
    return null;
  }
  return { finance2yearinvalid: true };
}
export const FinanceYearValidator4: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance3 = control.parent.get('currentAsset1Ctrl');
  if (finance3.value == "" || ('' + finance3.value).length > 4 || ('' + finance3.value).length == 4) {
    return null;
  }
  return { finance3yearinvalid: true };
}
export const FinanceYearValidator5: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance4 = control.parent.get('totalLiable1Ctrl');
  if (finance4.value == "" || ('' + finance4.value).length > 4 || ('' + finance4.value).length == 4) {
    return null;
  }
  return { finance4yearinvalid: true };
}
export const FinanceYearValidator6: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const finance5 = control.parent.get('totalEquity1Ctrl');
  if (finance5.value == "" || ('' + finance5.value).length > 4 || ('' + finance5.value).length == 4) {
    return null;
  }
  return { finance5yearinvalid: true };
}

export const ExpiryDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const registrationdate = control.parent.get('reghijri');
  const registrationdategreg = control.parent.get('reggregory');
  const hijriselect = control.parent.get('hijriGregCtrl');
  if (hijriselect.value && registrationdate.value == "") {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value == "") {
    return null;
  }
  if (registrationdate.value == undefined || registrationdategreg.value == undefined) {
    return;
  }

  if (hijriselect.value && registrationdate.value != "" && new Date(registrationdate.value.year, registrationdate.value.month - 1, registrationdate.value.day) >= new Date(ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).year, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).month - 1, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).day)) {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value != "" && new Date(registrationdategreg.value.year, registrationdategreg.value.month - 1, registrationdategreg.value.day) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
    return null;
  }
  return { regdatevalid: true };
}
export const ExpiryGosiDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const registrationdate = control.parent.get('gosihijri');
  const registrationdategreg = control.parent.get('gosigregory');
  const hijriselect = control.parent.get('hijriGregCtrl');
  const country = control.parent.get('countryCtrl');
  if (registrationdate.value == "" && registrationdategreg.value == "") {
    return null;
  }

  if (registrationdate.value == undefined || registrationdategreg.value == undefined) {
    return;
  }

  if (country.value != "SAUDI ARABIA") {
    return null;
  }
  if (country.value == "SAUDI ARABIA" && hijriselect.value && registrationdate.value == "") {
    return { gosireqvalid: true };
  }
  if (country.value == "SAUDI ARABIA" && !hijriselect.value && registrationdategreg.value == "") {
    return { gosireqvalid: true };
  }
  if (hijriselect.value && registrationdate.value == "") {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value == "") {
    return null;
  }
  if (hijriselect.value && registrationdate.value != "" && new Date(registrationdate.value.year, registrationdate.value.month - 1, registrationdate.value.day) >= new Date(ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).year, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).month - 1, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).day)) {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value != "" && new Date(registrationdategreg.value.year, registrationdategreg.value.month - 1, registrationdategreg.value.day) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
    return null;
  }
  return { gosidatevalid: true };
}
export const ExpirySaudiDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const registrationdate = control.parent.get('saudihijri');
  const registrationdategreg = control.parent.get('saudigregory');
  const hijriselect = control.parent.get('hijriGregCtrl');
  const country = control.parent.get('countryCtrl');
  if (country.value != "SAUDI ARABIA") {
    return null;
  }
  if (registrationdate.value == "" && registrationdategreg.value == "") {
    return null;
  }

  if (registrationdate.value == undefined || registrationdategreg.value == undefined) {
    return;
  }

  if (country.value == "SAUDI ARABIA" && hijriselect.value && registrationdate.value == "") {
    return { saudireqvalid: true };
  }
  if (country.value == "SAUDI ARABIA" && !hijriselect.value && registrationdategreg.value == "") {
    return { saudireqvalid: true };
  }
  if (hijriselect.value && registrationdate.value == "") {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value == "") {
    return null;
  }
  if (hijriselect.value && registrationdate.value != "" && new Date(registrationdate.value.year, registrationdate.value.month - 1, registrationdate.value.day) >= new Date(ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).year, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).month - 1, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).day)) {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value != "" && new Date(registrationdategreg.value.year, registrationdategreg.value.month - 1, registrationdategreg.value.day) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
    return null;
  }
  return { saudidatevalid: true };
}
export const ExpiryZakathDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const registrationdate = control.parent.get('zakathijri');
  const registrationdategreg = control.parent.get('zakatgregory');
  const hijriselect = control.parent.get('hijriGregCtrl');
  const country = control.parent.get('countryCtrl');
  if (country.value != "SAUDI ARABIA") {
    return null;
  }
  if (registrationdate.value == "" && registrationdategreg.value == "") {
    return null;
  }

  if (registrationdate.value == undefined || registrationdategreg.value == undefined) {
    return;
  }
  if (country.value == "SAUDI ARABIA" && hijriselect.value && registrationdate.value == "") {
    return { zakathreqvalid: true };
  }
  if (country.value == "SAUDI ARABIA" && !hijriselect.value && registrationdategreg.value == "") {
    return { zakathreqvalid: true };
  }
  if (hijriselect.value && registrationdate.value == "") {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value == "") {
    return null;
  }
  if (hijriselect.value && registrationdate.value != "" && new Date(registrationdate.value.year, registrationdate.value.month - 1, registrationdate.value.day) >= new Date(ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).year, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).month - 1, ConvertSolarToLunar(new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear()).day)) {
    return null;
  }
  if (!hijriselect.value && registrationdategreg.value != "" && new Date(registrationdategreg.value.year, registrationdategreg.value.month - 1, registrationdategreg.value.day) >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
    return null;
  }
  return { szakathdatevalid: true };
}
export const QualityDateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }
  const qualitydate = control.parent.get('qualityreviewDateCtrl');
  if (qualitydate.value == "") {
    return null;
  }
  if (qualitydate.value != "" && qualitydate.value < new Date()) {
    return null;
  }
  return { qualitydatevalid: true };
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};

// @Component({
//     selector: 'dialog-content-example-dialog',
//     templateUrl: '../overlay/dialog-content-example-dialog.html',
// })
// export class DialogContentExampleDialog {}

