import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { environment } from 'environments/environment.prod';
import { Workbook } from 'exceljs';
import moment from 'moment';
import * as fs from 'file-saver';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export interface DashboardElement {
  supplierID: number;
  position: string;
  supplierName: string;
  supplierNameArabic: string;
  establishmentyear: string;
  issuedby: string;
  website: string;
  supplierType: string;

  country: string;
  city: string;
  otherCity: string;
  poBox: string;
  postalcode: string;
  adressline1: string;
  adressline2: string;

  title: string;
  firstname: string;
  lastname: string;
  currentPosition: string;
  telNoCountryCode: string;
  telNo: string;
  ext: string;
  email: string;
  mobNoCountryCode: string;
  mobNo: string;
  faxNoCountryCode: string;
  faxNo: string;
  hijriCalendar: string;

  crno: string;
  crExpDate: string;
  vatno: string;
  // regDate: string;
  // gosiCertificate: string;
  gosiExpDate: string;
  saudizationCertificateExpDate: string;
  zakathExpDate: string;
  addtionalMaterial: string;
  waselAddress: string;

  // Profile data - General
  typeoforg: string;
  manegerialCount: string;
  technicalCount: string;
  operationsCount: string;
  saudiNationalsCount: string;
  totalCount: string;
  parentCompany: string;
  sisterCompany: string;
  ownerCompany: string;

  // Profile data - Financial
  operatingProfitYear: string;
  operatingProfitValue: string;
  netIncomeYear: string;
  netIncomeValue: string;
  currentAssetYear: string;
  currentAssetValue: string;
  totalLiabilitiesYear: string;
  totalLiabilitiesValue: string;
  totalEquityYear: string;
  totalEquityValue: string;

  // Profile data - Experience
  noOfBusinessYears: string;
  ownsPlantEquipment: string;
  designnCapability: string;
  finishedProduct: string;
  internalPolicy: string;
  registered3rdPartyBody: string;
  suspendedProj: string;

  // Profile data - Legal
  litigation: string;
  compliance: string;
  shareholder: string;
  legalAsset: string;
  labour: string;
  environment: string;
  imiInterested: string;

  // Profile data - Health
  hse: string;
  docuHse: string;
  isohealth: string;
  envtMgt1: string;
  dedicatedpers: string;
  hseName: string;
  hseDesig: string;
  statistic: string;
  statisticNear: string;
  statisticFirst: string;
  statisticMedical: string;
  statisticLost: string;
  statisticFatal: string;
  statisticEnvt: string;

  // Profile data - Quality
  qualityPolicy: string;
  qualityMgt: string;
  qualityMgtIso: string;
  qualityResp1: string;
  qualityResp2: string;
  qualityResp3: string;
  qualityreviewDate: string;
  // revisionNo: number;

  // Bank Details
  accountcurrency: string;
  accountholdername: string;
  accountnumber: string;
  bankaddress: string;
  bankaddress2: string;
  bankcountrycode: string;
  bankname: string;
  multicurrency: string;
  otherbank: string;
  swiftcode: string;
  ibanNo: string;

  // Other data
  status: string;
  criticality: string;
  createddate: string;
  pushsupplierstatus: string;
  invitedsupplier: string;
  audittype: string;
  supplierCategories: any;

  // Audit data
  statusremark: string;
  statuscomment: string;
  iscurrentstatus: string;
  actioncommand: string;
  auditcreateddate: string;
  audituserid: string;
  audituserrole: string;
}

export class Template {
  TemplateName: string;
  FilterText: string;
  Query: string;
}

const ELEMENT_DATA_CATEGORIES_NEW: DashboardElement[] = [];

@Component({
  selector: 'app-itemreportAudit-datatable',
  templateUrl: './item-reportAudit-datatable.component.html',
  styleUrls: ['./item-reportAudit-datatable.component.scss'],
  providers: [DatePipe]
})

export class ItemReportAuditDatatableComponent implements OnInit {
  @ViewChild('tableOnePaginator', { read: MatPaginator }) tableOnePaginator: MatPaginator;

  dataSourceDashboard = new MatTableDataSource(ELEMENT_DATA_CATEGORIES_NEW);
  tempData: DashboardElement[];

  currentReqPage = '';
  isloading = true;

  AuditData: any;
  filteredDataAfterCreatedDate: any;
  filteredDataAfterAuditDate: any;
  fromAudit_: boolean = false;
  fromAudit2_: boolean = false;
  fromDate_: boolean = false;
  fromDate2_: boolean = false;

  displayedDashboardColumns: string[] = ['position', 'supplierName', 'criticality', 'status', 'currentPosition', 'country', 'createddate',
    'establishmentyear', 'issuedby', 'city', 'postalcode', 'adressline1', 'firstname', 'email', 'crno', 'typeoforg', 'vatno', "statusremark", "statuscomment", "iscurrentstatus", "actioncommand", "auditcreateddate",
    "audituserid", "audituserrole", "pushsupplierstatus", "invitedsupplier"];
  ColumnListFormControl = new FormControl();
  iserror = false;
  errormessage = 'Select atleast one column';

  ColumnList = [
    { name: 'Supplier Code', completed: false, val: 'SupplierCode', title: 'position' },
    { name: 'Supplier Details - Supplier Name (in English)', completed: false, val: 'SupplierName', title: 'supplierName' },
    { name: 'Supplier Details - Supplier Name (in Arabic)', completed: false, val: 'SupplierNameArabic', title: 'supplierNameArabic' },
    { name: 'Supplier Details - Establishment Year', completed: false, val: 'EstablishmentYear', title: 'establishmentyear' },
    { name: 'Supplier Details - Issued By', completed: false, val: 'IssuedBy', title: 'issuedby' },
    { name: 'Supplier Details - Website', completed: false, val: 'Website', title: 'website' },
    { name: 'Supplier Details - Supplier Type', completed: false, val: 'SupplierType', title: 'supplierType' },

    { name: 'Address - Country', completed: false, val: 'Country', title: 'country' },
    { name: 'Address - City', completed: false, val: 'City', title: 'city' },
    { name: 'Address - Other City', completed: false, val: 'OtherCity', title: 'otherCity' },
    { name: 'Address - PoBox', completed: false, val: 'PoBox', title: 'poBox' },
    { name: 'Address - Postal Code', completed: false, val: 'PostalCode', title: 'postalcode' },
    { name: 'Address - Address Line1', completed: false, val: 'AddressLine1', title: 'adressline1' },
    { name: 'Address - Address Line2', completed: false, val: 'AddressLine2', title: 'adressline2' },

    { name: 'Contact Person - Title', completed: false, val: 'Title', title: 'title' },
    { name: 'Contact Person - First Name', completed: false, val: 'FirstName', title: 'firstname' },
    { name: 'Contact Person - Last Name', completed: false, val: 'LastName', title: 'lastname' },
    { name: 'Contact Person - Current Position', completed: false, val: 'CurrentPosition', title: 'currentPosition' },
    { name: 'Contact Person - Tel No CountryCode', completed: false, val: 'TelNoCountryCode', title: 'telNoCountryCode' },
    { name: 'Contact Person - Tel No', completed: false, val: 'TelNo', title: 'telNo' },
    { name: 'Contact Person - Ext', completed: false, val: 'Ext', title: 'ext' },
    { name: 'Contact Person - Email', completed: false, val: 'Email', title: 'email' },
    { name: 'Contact Person - Mob No CountryCode', completed: false, val: 'MobNoCountryCode', title: 'mobNoCountryCode' },
    { name: 'Contact Person - Mob No', completed: false, val: 'MobNo', title: 'mobNo' },
    { name: 'Contact Person - Fax No CountryCode', completed: false, val: 'FaxNoCountryCode', title: 'faxNoCountryCode' },
    { name: 'Contact Person - Fax No', completed: false, val: 'FaxNo', title: 'faxNo' },
    { name: 'Contact Person - Hijri Calendar', completed: false, val: 'HijriCalendar', title: 'hijriCalendar' },

    { name: 'Registration Details - CR No', completed: false, val: 'CRNo', title: 'crno' },
    { name: 'Registration Details - CR Exp Date', completed: false, val: 'CrExpDate', title: 'crExpDate' },
    { name: 'Registration Details - Vat No', completed: false, val: 'VatNo', title: 'vatno' },
    // { name: 'Registration Details - Reg Date', completed: false, val: 'RegDate', title: 'regDate' },
    { name: 'Registration Details - GOSI Exp Date', completed: false, val: 'GosiExpDate', title: 'gosiExpDate' },
    { name: 'Registration Details - Saudization Exp Date', completed: false, val: 'SaudizationCertificateExpDate', title: 'saudizationCertificateExpDate' },
    { name: 'Registration Details - Zakat Exp Date', completed: false, val: 'ZakathExpDate', title: 'zakathExpDate' },
    { name: 'Registration Details - Addtional Material', completed: false, val: 'AddtionalMaterial', title: 'addtionalMaterial' },
    { name: 'Registration Details - Wasel Address', completed: false, val: 'WaselAddress', title: 'waselAddress' },

    // Other Data
    { name: 'Status', completed: false, val: 'Status', title: 'status' },
    { name: 'Criticality', completed: false, val: 'Criticality', title: 'criticality' },
    { name: 'Created Date', completed: false, val: 'CreatedDate', title: 'createddate' },
    { name: 'Push Supplier Status', completed: false, val: 'PushSupplierStatus', title: 'pushsupplierstatus' },
    { name: 'Invited Supplier', completed: false, val: 'InvitedSupplier', title: 'invitedsupplier' },

    // Audit
    { name: 'Status Remark', completed: false, val: 'StatusRemark', title: 'statusremark' },
    { name: 'Decision Remark', completed: false, val: 'StatusComment', title: 'statuscomment' },
    { name: 'Is Current Status', completed: false, val: 'IsCurrentStatus', title: 'iscurrentstatus' },
    { name: 'Action Command', completed: false, val: 'ActionCommand', title: 'actioncommand' },
    { name: 'Audit Created Date', completed: false, val: 'AuditCreatedDate', title: 'auditcreateddate' },
    { name: 'Audit Type', completed: false, val: 'AuditType', title: 'audittype' },
    { name: 'Audit User ID', completed: false, val: 'AuditUserID', title: 'audituserid' },
    { name: 'Audit User Role', completed: false, val: 'AuditUserRole', title: 'audituserrole' }
  ];

  DropdownList = [
    { name: 'Supplier Details - Supplier Name (in Arabic)', completed: false, val: 'SupplierNameArabic', title: 'supplierNameArabic' },
    { name: 'Supplier Details - Establishment Year', completed: false, val: 'EstablishmentYear', title: 'establishmentyear' },
    { name: 'Supplier Details - Issued By', completed: false, val: 'IssuedBy', title: 'issuedby' },
    { name: 'Supplier Details - Website', completed: false, val: 'Website', title: 'website' },
    { name: 'Supplier Details - Supplier Type', completed: false, val: 'SupplierType', title: 'supplierType' },

    { name: 'Address - Country', completed: false, val: 'Country', title: 'country' },
    { name: 'Address - City', completed: false, val: 'City', title: 'city' },
    { name: 'Address - Other City', completed: false, val: 'OtherCity', title: 'otherCity' },
    { name: 'Address - PoBox', completed: false, val: 'PoBox', title: 'poBox' },
    { name: 'Address - Postal Code', completed: false, val: 'PostalCode', title: 'postalcode' },
    { name: 'Address - Address Line1', completed: false, val: 'AddressLine1', title: 'adressline1' },
    { name: 'Address - Address Line2', completed: false, val: 'AddressLine2', title: 'adressline2' },

    { name: 'Contact Person - Title', completed: false, val: 'Title', title: 'title' },
    { name: 'Contact Person - First Name', completed: false, val: 'FirstName', title: 'firstname' },
    { name: 'Contact Person - Last Name', completed: false, val: 'LastName', title: 'lastname' },
    { name: 'Contact Person - Current Position', completed: false, val: 'CurrentPosition', title: 'currentPosition' },
    { name: 'Contact Person - Tel No CountryCode', completed: false, val: 'TelNoCountryCode', title: 'telNoCountryCode' },
    { name: 'Contact Person - Tel No', completed: false, val: 'TelNo', title: 'telNo' },
    { name: 'Contact Person - Ext', completed: false, val: 'Ext', title: 'ext' },
    { name: 'Contact Person - Email', completed: false, val: 'Email', title: 'email' },
    { name: 'Contact Person - Mob No CountryCode', completed: false, val: 'MobNoCountryCode', title: 'mobNoCountryCode' },
    { name: 'Contact Person - Mob No', completed: false, val: 'MobNo', title: 'mobNo' },
    { name: 'Contact Person - Fax No CountryCode', completed: false, val: 'FaxNoCountryCode', title: 'faxNoCountryCode' },
    { name: 'Contact Person - Fax No', completed: false, val: 'FaxNo', title: 'faxNo' },
    { name: 'Contact Person - Hijri Calendar', completed: false, val: 'HijriCalendar', title: 'hijriCalendar' },

    { name: 'Registration Details - CR No', completed: false, val: 'CRNo', title: 'crno' },
    { name: 'Registration Details - CR Exp Date', completed: false, val: 'CrExpDate', title: 'crExpDate' },
    { name: 'Registration Details - Vat No', completed: false, val: 'VatNo', title: 'vatno' },
    // { name: 'Registration Details - Reg Date', completed: false, val: 'RegDate', title: 'regDate' },
    { name: 'Registration Details - GOSI Exp Date', completed: false, val: 'GosiExpDate', title: 'gosiExpDate' },
    { name: 'Registration Details - Saudization Exp Date', completed: false, val: 'SaudizationCertificateExpDate', title: 'saudizationCertificateExpDate' },
    { name: 'Registration Details - Zakat Exp Date', completed: false, val: 'ZakathExpDate', title: 'zakathExpDate' },
    { name: 'Registration Details - Addtional Material', completed: false, val: 'AddtionalMaterial', title: 'addtionalMaterial' },
    { name: 'Registration Details - Wasel Address', completed: false, val: 'WaselAddress', title: 'waselAddress' },

    // Other Data
    { name: 'Status', completed: false, val: 'Status', title: 'status' },
    { name: 'Criticality', completed: false, val: 'Criticality', title: 'criticality' },
    { name: 'Created Date', completed: false, val: 'CreatedDate', title: 'createddate' },
    { name: 'Push Supplier Status', completed: false, val: 'PushSupplierStatus', title: 'pushsupplierstatus' },
    { name: 'Invited Supplier', completed: false, val: 'InvitedSupplier', title: 'invitedsupplier' },

    // Audit
    { name: 'Status Remark', completed: false, val: 'StatusRemark', title: 'statusremark' },
    { name: 'Decision Remark', completed: false, val: 'StatusComment', title: 'statuscomment' },
    { name: 'Is Current Status', completed: false, val: 'IsCurrentStatus', title: 'iscurrentstatus' },
    { name: 'Action Command', completed: false, val: 'ActionCommand', title: 'actioncommand' },
    { name: 'Audit Created Date', completed: false, val: 'AuditCreatedDate', title: 'auditcreateddate' },
    { name: 'Audit Type', completed: false, val: 'AuditType', title: 'audittype' },
    { name: 'Audit User ID', completed: false, val: 'AuditUserID', title: 'audituserid' },
    { name: 'Audit User Role', completed: false, val: 'AuditUserRole', title: 'audituserrole' }
  ];

  DataToExport = [];
  selectedList: any;

  SupplierCode: boolean = false;
  SupplierName: boolean = false;
  SupplierNameArabic: boolean = false;
  EstablishmentYear: boolean = false;
  IssuedBy: boolean = false;
  Website: boolean = false;
  SupplierType: boolean = false;

  Country: boolean = false;
  City: boolean = false;
  OtherCity: boolean = false;
  PoBox: boolean = false;
  PostalCode: boolean = false;
  AddressLine1: boolean = false;
  AddressLine2: boolean = false;

  Title: boolean = false;
  FirstName: boolean = false;
  LastName: boolean = false;
  CurrentPosition: boolean = false;
  telNoCountryCode: boolean = false;
  telNo: boolean = false;
  ext: boolean = false;
  Email: boolean = false;
  mobNoCountryCode: boolean = false;
  mobNo: boolean = false;
  faxNoCountryCode: boolean = false;
  faxNo: boolean = false;
  hijriCalendar: boolean = false;

  CRNo: boolean = false;
  crExpDate: boolean = false;
  VatNo: boolean = false;
  // regDate: boolean = false;
  // gosiCertificate: boolean = false;
  gosiExpDate: boolean = false;
  saudizationCertificateExpDate: boolean = false;
  zakathExpDate: boolean = false;
  addtionalMaterial: boolean = false;
  waselAddress: boolean = false;

  // Profile data - General
  TypeOfOrg: boolean = false;
  manegerialCount: boolean = false;
  technicalCount: boolean = false;
  operationsCount: boolean = false;
  saudiNationalsCount: boolean = false;
  totalCount: boolean = false;
  parentCompany: boolean = false;
  sisterCompany: boolean = false;
  ownerCompany: boolean = false;

  // Profile data - Financial
  operatingProfitYear: boolean = false;
  operatingProfitValue: boolean = false;
  netIncomeYear: boolean = false;
  netIncomeValue: boolean = false;
  currentAssetYear: boolean = false;
  currentAssetValue: boolean = false;
  totalLiabilitiesYear: boolean = false;
  totalLiabilitiesValue: boolean = false;
  totalEquityYear: boolean = false;
  totalEquityValue: boolean = false;

  // Profile data - Experience
  noOfBusinessYears: boolean = false;
  ownsPlantEquipment: boolean = false;
  designnCapability: boolean = false;
  finishedProduct: boolean = false;
  internalPolicy: boolean = false;
  registered3rdPartyBody: boolean = false;
  suspendedProj: boolean = false;

  // Profile data - Legal
  litigation: boolean = false;
  compliance: boolean = false;
  shareholder: boolean = false;
  legalAsset: boolean = false;
  labour: boolean = false;
  environment: boolean = false;
  imiInterested: boolean = false;

  // Profile data - Health
  hse: boolean = false;
  docuHse: boolean = false;
  isohealth: boolean = false;
  envtMgt1: boolean = false;
  dedicatedpers: boolean = false;
  hseName: boolean = false;
  hseDesig: boolean = false;
  statistic: boolean = false;
  statisticNear: boolean = false;
  statisticFirst: boolean = false;
  statisticMedical: boolean = false;
  statisticLost: boolean = false;
  statisticFatal: boolean = false;
  statisticEnvt: boolean = false;

  // Profile data - Quality
  qualityPolicy: boolean = false;
  qualityMgt: boolean = false;
  qualityMgtIso: boolean = false;
  qualityResp1: boolean = false;
  qualityResp2: boolean = false;
  qualityResp3: boolean = false;
  qualityreviewDate: boolean = false;
  // revisionNo: number;

  // Bank Details
  AccountCurrency: boolean = false;
  AccountHolderName: boolean = false;
  AccountNumber: boolean = false;
  BankAddress: boolean = false;
  BankAddress2: boolean = false;
  BankCountryCode: boolean = false;
  BankName: boolean = false;
  Multicurrency: boolean = false;
  OtherBank: boolean = false;
  SwiftCode: boolean = false;
  ibanNo: boolean = false;
  Suppliers_Categories: any[];

  StatusRemark: boolean = false;
  StatusComment: boolean = false;
  IsCurrentStatus: boolean = false;
  ActionCommand: boolean = false;
  AuditCreatedDate: boolean = false;
  AuditUserID: boolean = false;
  AuditUserRole: boolean = false;

  Status: boolean = false;
  Criticality: boolean = false;
  CreatedDate: boolean = false;
  PushSupplierStatus: boolean = false;
  InvitedSupplier: boolean = false;
  AuditType: boolean = false;

  minCreatedDate = null;
  maxCreatedDate = null;
  minAuditDate = null;
  maxAuditDate = null;
  selectedFromCreatedDate: any;
  selectedToCreatedDate: any;
  selectedFromAuditDate: any;
  selectedToAuditDate: any;

  checkedList: any;
  allSelected: boolean = false;

  dataSourceDashboardList: any = [];
  filterValues = {};
  supplierName = '';
  status = '';
  currentPosition = '';
  country = '';
  criticality = '';
  establishmentyearfrom = '';
  establishmentyearto = '';
  position = '';
  createddatefrom = '';
  createddateto = '';
  issuedby = '';
  city = '';
  postalcode = '';
  adressline1 = '';
  firstname = '';
  email = '';
  crno = '';
  typeoforg = '';
  vatno = '';

  push_supplier_status = '';
  invited_supplier = '';
  status_remark = '';
  status_comment = '';
  iscurrent_status = '';
  action_command = '';
  audit_createddate = '';
  audit_userid = '';
  audit_userrole = '';

  supplierNameArabic = '';
  website = '';
  supplierType = '';
  otherCity = '';
  poBox = '';
  adressline2 = '';
  title = '';
  lastname = '';
  telNoCountryCodeVal = '';
  telNoVal = '';
  extVal = '';
  EmailVal = '';
  mobNoCountryCodeVal = '';
  mobNoVal = '';
  faxNoCountryCodeVal = '';
  faxNoVal = '';
  hijriCalendarVal = '';

  CRNoVal = '';
  crExpDateVal = '';
  VatNoVal = '';
  // regDateVal = '';
  // gosiCertificateVal='';
  gosiExpDateVal = '';
  saudizationCertificateExpDateVal = '';
  zakathExpDateVal = '';
  addtionalMaterialVal = '';
  waselAddressVal = '';

  // Profile data - General
  TypeOfOrgVal = '';
  manegerialCountVal = '';
  technicalCountVal = '';
  operationsCountVal = '';
  saudiNationalsCountVal = '';
  totalCountVal = '';
  parentCompanyVal = '';
  sisterCompanyVal = '';
  ownerCompanyVal = '';

  // Profile data - Financial
  operatingProfitYearVal = '';
  operatingProfitValueVal = '';
  netIncomeYearVal = '';
  netIncomeValueVal = '';
  currentAssetYearVal = '';
  currentAssetValueVal = '';
  totalLiabilitiesYearVal = '';
  totalLiabilitiesValueVal = '';
  totalEquityYearVal = '';
  totalEquityValueVal = '';

  // Profile data - Experience
  noOfBusinessYearsVal = '';
  ownsPlantEquipmentVal = '';
  designnCapabilityVal = '';
  finishedProductVal = '';
  internalPolicyVal = '';
  registered3rdPartyBodyVal = '';
  suspendedProjVal = '';

  // Profile data - Legal
  litigationVal = '';
  complianceVal = '';
  shareholderVal = '';
  legalAssetVal = '';
  labourVal = '';
  environmentVal = '';
  imiInterestedVal = '';

  // Profile data - Health
  hseVal = '';
  docuHseVal = '';
  isohealthVal = '';
  envtMgt1Val = '';
  dedicatedpersVal = '';
  hseNameVal = '';
  hseDesigVal = '';
  statisticVal = '';
  statisticNearVal = '';
  statisticFirstVal = '';
  statisticMedicalVal = '';
  statisticLostVal = '';
  statisticFatalVal = '';
  statisticEnvtVal = '';

  // Profile data - Quality
  qualityPolicyVal = '';
  qualityMgtVal = '';
  qualityMgtIsoVal = '';
  qualityResp1Val = '';
  qualityResp2Val = '';
  qualityResp3Val = '';
  qualityreviewDateVal = '';
  // revisionNoVal=''; number;

  // Bank Details
  AccountCurrencyVal = '';
  AccountHolderNameVal = '';
  AccountNumberVal = '';
  BankAddressVal = '';
  BankAddress2Val = '';
  BankCountryCodeVal = '';
  BankNameVal = '';
  MulticurrencyVal = '';
  OtherBankVal = '';
  SwiftCodeVal = '';
  ibanNoVal = '';

  StatusRemarkVal = '';
  StatusCommentVal = '';
  IsCurrentStatusVal = '';
  ActionCommandVal = '';
  AuditCreatedDateVal = '';
  AuditUserIDVal = '';
  AuditUserRoleVal = '';

  StatusVal = '';
  CriticalityVal = '';
  CreatedDateVal = '';
  PushSupplierStatusVal = '';
  InvitedSupplierVal = '';
  AuditTypeVal = '';

  filtertext = "";
  displaytemplatecreate = false;
  user_role = '';
  AllData: any;
  filterForm = new FormGroup({
    fromDate: new FormControl(),
    toDate: new FormControl(),
  });
  auditfilterForm = new FormGroup({
    fromAuditDate: new FormControl(),
    toAuditDate: new FormControl(),
  });
  temp: DashboardElement[];

  get fromDate() { return this.filterForm.get('fromDate').value; }
  get toDate() { return this.filterForm.get('toDate').value; }
  get fromAuditDate() { return this.auditfilterForm.get('fromAuditDate').value; }
  get toAuditDate() { return this.auditfilterForm.get('toAuditDate').value; }

  audit_createddatefrom = '';
  audit_createddateto = '';

  supplierIDs = [];
  uniqueSupplierIDs = [];
  all_sup_categories: any;

  IsCategorySelected: boolean = false;

  constructor(private http: HttpClient, private router: Router, private datePipe: DatePipe) {
    this.user_role = localStorage.getItem('userrole');

    this.getAllSuppliersWithAudit();

    if (this.user_role == 'Admin') {
      this.ColumnList.push(
        { name: 'Gen. Info. - 1. Type Of Org', completed: false, val: 'TypeOfOrg', title: 'typeoforg' },
        { name: 'Gen. Info. - 2. Manegerial', completed: false, val: 'ManegerialCount', title: 'manegerialCount' },
        { name: 'Gen. Info. - 2. Operational', completed: false, val: 'OperationsCount', title: 'operationsCount' },
        { name: 'Gen. Info. - 2. Saudi Nationals', completed: false, val: 'SaudiNationalsCount', title: 'saudiNationalsCount' },
        { name: 'Gen. Info. - 2. Technical', completed: false, val: 'TechnicalCount', title: 'technicalCount' },
        { name: 'Gen. Info. - 2. Total', completed: false, val: 'TotalCount', title: 'totalCount' },
        { name: 'Gen. Info. - 3. Add. of the parent company', completed: false, val: 'ParentCompany', title: 'parentCompany' },
        { name: 'Gen. Info. - 4. Add. of the sister/affiliated companies', completed: false, val: 'SisterCompany', title: 'sisterCompany' },
        { name: 'Gen. Info. - 5. List all owners/principals’ name', completed: false, val: 'OwnerCompany', title: 'ownerCompany' },

        { name: 'Fin. Status - 1. Operating profit - Year', completed: false, val: 'OperatingProfitYear', title: 'operatingProfitYear' },
        { name: 'Fin. Status - 1. Operating profit - Value', completed: false, val: 'OperatingProfitValue', title: 'operatingProfitValue' },
        { name: 'Fin. Status - 2. Net income - Year', completed: false, val: 'NetIncomeYear', title: 'netIncomeYear' },
        { name: 'Fin. Status - 2. Net income - Value', completed: false, val: 'NetIncomeValue', title: 'netIncomeValue' },
        { name: 'Fin. Status - 3. Current asset - Year', completed: false, val: 'CurrentAssetYear', title: 'currentAssetYear' },
        { name: 'Fin. Status - 3. Current asset - Value', completed: false, val: 'CurrentAssetValue', title: 'currentAssetValue' },
        { name: 'Fin. Status - 4. Total liabilities - Year', completed: false, val: 'TotalLiabilitiesYear', title: 'totalLiabilitiesYear' },
        { name: 'Fin. Status - 4. Total liabilities - Value', completed: false, val: 'TotalLiabilitiesValue', title: 'totalLiabilitiesValue' },
        { name: 'Fin. Status - 5. Total equity - Year', completed: false, val: 'TotalEquityYear', title: 'totalEquityYear' },
        { name: 'Fin. Status - 5. Total equity - Value', completed: false, val: 'TotalEquityValue', title: 'totalEquityValue' },

        { name: 'Exp. & Qua. - 1. Number of Years in the Business', completed: false, val: 'NoOfBusinessYears', title: 'noOfBusinessYears' },
        { name: 'Exp. & Qua. - 2. Own the plant and equipment', completed: false, val: 'OwnsPlantEquipment', title: 'ownsPlantEquipment' },
        { name: 'Exp. & Qua. - 3. Design capability', completed: false, val: 'DesignnCapability', title: 'designnCapability' },
        { name: 'Exp. & Qua. - 4. Product/Service outsourcing', completed: false, val: 'FinishedProduct', title: 'finishedProduct' },
        { name: 'Exp. & Qua. - 5. Internal Written policy', completed: false, val: 'InternalPolicy', title: 'internalPolicy' },
        { name: 'Exp. & Qua. - 6. 3rd party certifying', completed: false, val: 'Registered3rdPartyBody', title: 'registered3rdPartyBody' },
        { name: 'Exp. & Qua. - 7. Project/Order suspened', completed: false, val: 'SuspendedProj', title: 'suspendedProj' },

        { name: 'Legal - 1. Involved in any litigation', completed: false, val: 'Litigation', title: 'litigation' },
        { name: 'Legal - 2. Internal compliance program', completed: false, val: 'Compliance', title: 'compliance' },
        { name: 'Legal - 3. offered gifts or bribes', completed: false, val: 'Shareholder', title: 'shareholder' },
        { name: 'Legal - 4. financial transactions blocked', completed: false, val: 'LegalAsset', title: 'legalAsset' },
        { name: 'Legal - 5. convictions under labor legislation', completed: false, val: 'Labour', title: 'labour' },
        { name: 'Legal - 6. convictions under environmental legislation', completed: false, val: 'Environment', title: 'environment' },
        { name: 'Legal - 7. IMI has an interest', completed: false, val: 'ImiInterested', title: 'imiInterested' },

        { name: 'HSE - 1. HSE written policy', completed: false, val: 'hse', title: 'hse' },
        { name: 'HSE - 2. HSE Management System', completed: false, val: 'docuHse', title: 'docuHse' },
        { name: 'HSE - 3. ISO 45001 Certified', completed: false, val: 'isohealth', title: 'isohealth' },
        { name: 'HSE - 4. ISO 14001 Certified', completed: false, val: 'envtMgt1', title: 'envtMgt1' },
        { name: 'HSE - 5. person responsible for HSE?', completed: false, val: 'dedicatedpers', title: 'dedicatedpers' },
        { name: 'HSE - 5. person responsible for HSE? - Name', completed: false, val: 'hseName', title: 'hseName' },
        { name: 'HSE - 5. person responsible for HSE? - Designation', completed: false, val: 'hseDesig', title: 'hseDesig' },
        { name: 'HSE - 6. HSE statistics', completed: false, val: 'statistic', title: 'statistic' },
        { name: 'HSE - 6. HSE statistics - Near Miss', completed: false, val: 'statisticNear', title: 'statisticNear' },
        { name: 'HSE - 6. HSE statistics - First Aid Case', completed: false, val: 'statisticFirst', title: 'statisticFirst' },
        { name: 'HSE - 6. HSE statistics - Medical Tre. Case', completed: false, val: 'statisticMedical', title: 'statisticMedical' },
        { name: 'HSE - 6. HSE statistics - Lost Time Injuries', completed: false, val: 'statisticLost', title: 'statisticLost' },
        { name: 'HSE - 6. HSE statistics - Fatality', completed: false, val: 'statisticFatal', title: 'statisticFatal' },
        { name: 'HSE - 6. HSE statistics - Env. Incident', completed: false, val: 'statisticEnvt', title: 'statisticEnvt' },

        { name: 'Quality - 1. Quality written policy', completed: false, val: 'qualityPolicy', title: 'qualityPolicy' },
        { name: 'Quality - 2. Quality Management System', completed: false, val: 'qualityMgt', title: 'qualityMgt' },
        { name: 'Quality - 3. Certified to ISO 9001:2015', completed: false, val: 'qualityMgtIso', title: 'qualityMgtIso' },
        { name: 'Quality - 4. Person responsible for Quality', completed: false, val: 'qualityResp1', title: 'qualityResp1' },
        { name: 'Quality - 4. Person responsible for Quality - Name', completed: false, val: 'qualityResp2', title: 'qualityResp2' },
        { name: 'Quality - 4. Person responsible for Quality - Designation ', completed: false, val: 'qualityResp3', title: 'qualityResp3' },
        { name: 'Quality - 5. QMS Audit date', completed: false, val: 'qualityreviewDate', title: 'qualityreviewDate' },

        { name: 'Bank info. - Bank Name', completed: false, val: 'BankName', title: 'bankname' },
        { name: 'Bank info. - Other Bank', completed: false, val: 'OtherBank', title: 'otherbank' },
        { name: 'Bank info. - BIC/SWIFT Code', completed: false, val: 'SwiftCode', title: 'swiftcode' },
        { name: 'Bank info. - Acc. Holder Name', completed: false, val: 'AccountHolderName', title: 'accountholdername' },
        { name: 'Bank info. - Acc. Number', completed: false, val: 'AccountNumber', title: 'accountnumber' },
        { name: 'Bank info. - Bank Add. Line1', completed: false, val: 'BankAddress', title: 'bankaddress' },
        { name: 'Bank info. - Bank Add. Line2', completed: false, val: 'BankAddress2', title: 'bankaddress2' },
        { name: 'Bank info. - IBAN No', completed: false, val: 'ibanNo', title: 'ibanNo' },
        { name: 'Bank info. - Acc. Currency', completed: false, val: 'AccountCurrency', title: 'accountcurrency' },
        { name: 'Bank info. - Multicurrency', completed: false, val: 'Multicurrency', title: 'multicurrency' }
      );

      this.DropdownList.push(
        { name: 'Gen. Info. - 1. Type Of Org', completed: false, val: 'TypeOfOrg', title: 'typeoforg' },
        { name: 'Gen. Info. - 2. Manegerial', completed: false, val: 'ManegerialCount', title: 'manegerialCount' },
        { name: 'Gen. Info. - 2. Operational', completed: false, val: 'OperationsCount', title: 'operationsCount' },
        { name: 'Gen. Info. - 2. Saudi Nationals', completed: false, val: 'SaudiNationalsCount', title: 'saudiNationalsCount' },
        { name: 'Gen. Info. - 2. Technical', completed: false, val: 'TechnicalCount', title: 'technicalCount' },
        { name: 'Gen. Info. - 2. Total', completed: false, val: 'TotalCount', title: 'totalCount' },
        { name: 'Gen. Info. - 3. Add. of the parent company', completed: false, val: 'ParentCompany', title: 'parentCompany' },
        { name: 'Gen. Info. - 4. Add. of the sister/affiliated companies', completed: false, val: 'SisterCompany', title: 'sisterCompany' },
        { name: 'Gen. Info. - 5. List all owners/principals’ name', completed: false, val: 'OwnerCompany', title: 'ownerCompany' },

        { name: 'Fin. Status - 1. Operating profit - Year', completed: false, val: 'OperatingProfitYear', title: 'operatingProfitYear' },
        { name: 'Fin. Status - 1. Operating profit - Value', completed: false, val: 'OperatingProfitValue', title: 'operatingProfitValue' },
        { name: 'Fin. Status - 2. Net income - Year', completed: false, val: 'NetIncomeYear', title: 'netIncomeYear' },
        { name: 'Fin. Status - 2. Net income - Value', completed: false, val: 'NetIncomeValue', title: 'netIncomeValue' },
        { name: 'Fin. Status - 3. Current asset - Year', completed: false, val: 'CurrentAssetYear', title: 'currentAssetYear' },
        { name: 'Fin. Status - 3. Current asset - Value', completed: false, val: 'CurrentAssetValue', title: 'currentAssetValue' },
        { name: 'Fin. Status - 4. Total liabilities - Year', completed: false, val: 'TotalLiabilitiesYear', title: 'totalLiabilitiesYear' },
        { name: 'Fin. Status - 4. Total liabilities - Value', completed: false, val: 'TotalLiabilitiesValue', title: 'totalLiabilitiesValue' },
        { name: 'Fin. Status - 5. Total equity - Year', completed: false, val: 'TotalEquityYear', title: 'totalEquityYear' },
        { name: 'Fin. Status - 5. Total equity - Value', completed: false, val: 'TotalEquityValue', title: 'totalEquityValue' },

        { name: 'Exp. & Qua. - 1. Number of Years in the Business', completed: false, val: 'NoOfBusinessYears', title: 'noOfBusinessYears' },
        { name: 'Exp. & Qua. - 2. Own the plant and equipment', completed: false, val: 'OwnsPlantEquipment', title: 'ownsPlantEquipment' },
        { name: 'Exp. & Qua. - 3. Design capability', completed: false, val: 'DesignnCapability', title: 'designnCapability' },
        { name: 'Exp. & Qua. - 4. Product/Service outsourcing', completed: false, val: 'FinishedProduct', title: 'finishedProduct' },
        { name: 'Exp. & Qua. - 5. Internal Written policy', completed: false, val: 'InternalPolicy', title: 'internalPolicy' },
        { name: 'Exp. & Qua. - 6. 3rd party certifying', completed: false, val: 'Registered3rdPartyBody', title: 'registered3rdPartyBody' },
        { name: 'Exp. & Qua. - 7. Project/Order suspened', completed: false, val: 'SuspendedProj', title: 'suspendedProj' },

        { name: 'Legal - 1. Involved in any litigation', completed: false, val: 'Litigation', title: 'litigation' },
        { name: 'Legal - 2. Internal compliance program', completed: false, val: 'Compliance', title: 'compliance' },
        { name: 'Legal - 3. offered gifts or bribes', completed: false, val: 'Shareholder', title: 'shareholder' },
        { name: 'Legal - 4. financial transactions blocked', completed: false, val: 'LegalAsset', title: 'legalAsset' },
        { name: 'Legal - 5. convictions under labor legislation', completed: false, val: 'Labour', title: 'labour' },
        { name: 'Legal - 6. convictions under environmental legislation', completed: false, val: 'Environment', title: 'environment' },
        { name: 'Legal - 7. IMI has an interest', completed: false, val: 'ImiInterested', title: 'imiInterested' },

        { name: 'HSE - 1. HSE written policy', completed: false, val: 'hse', title: 'hse' },
        { name: 'HSE - 2. HSE Management System', completed: false, val: 'docuHse', title: 'docuHse' },
        { name: 'HSE - 3. ISO 45001 Certified', completed: false, val: 'isohealth', title: 'isohealth' },
        { name: 'HSE - 4. ISO 14001 Certified', completed: false, val: 'envtMgt1', title: 'envtMgt1' },
        { name: 'HSE - 5. person responsible for HSE?', completed: false, val: 'dedicatedpers', title: 'dedicatedpers' },
        { name: 'HSE - 5. person responsible for HSE? - Name', completed: false, val: 'hseName', title: 'hseName' },
        { name: 'HSE - 5. person responsible for HSE? - Designation', completed: false, val: 'hseDesig', title: 'hseDesig' },
        { name: 'HSE - 6. HSE statistics', completed: false, val: 'statistic', title: 'statistic' },
        { name: 'HSE - 6. HSE statistics - Near Miss', completed: false, val: 'statisticNear', title: 'statisticNear' },
        { name: 'HSE - 6. HSE statistics - First Aid Case', completed: false, val: 'statisticFirst', title: 'statisticFirst' },
        { name: 'HSE - 6. HSE statistics - Medical Tre. Case', completed: false, val: 'statisticMedical', title: 'statisticMedical' },
        { name: 'HSE - 6. HSE statistics - Lost Time Injuries', completed: false, val: 'statisticLost', title: 'statisticLost' },
        { name: 'HSE - 6. HSE statistics - Fatality', completed: false, val: 'statisticFatal', title: 'statisticFatal' },
        { name: 'HSE - 6. HSE statistics - Env. Incident', completed: false, val: 'statisticEnvt', title: 'statisticEnvt' },

        { name: 'Quality - 1. Quality written policy', completed: false, val: 'qualityPolicy', title: 'qualityPolicy' },
        { name: 'Quality - 2. Quality Management System', completed: false, val: 'qualityMgt', title: 'qualityMgt' },
        { name: 'Quality - 3. Certified to ISO 9001:2015', completed: false, val: 'qualityMgtIso', title: 'qualityMgtIso' },
        { name: 'Quality - 4. Person responsible for Quality', completed: false, val: 'qualityResp1', title: 'qualityResp1' },
        { name: 'Quality - 4. Person responsible for Quality - Name', completed: false, val: 'qualityResp2', title: 'qualityResp2' },
        { name: 'Quality - 4. Person responsible for Quality - Designation ', completed: false, val: 'qualityResp3', title: 'qualityResp3' },
        { name: 'Quality - 5. QMS Audit date', completed: false, val: 'qualityreviewDate', title: 'qualityreviewDate' },

        { name: 'Bank info. - Bank Name', completed: false, val: 'BankName', title: 'bankname' },
        { name: 'Bank info. - Other Bank', completed: false, val: 'OtherBank', title: 'otherbank' },
        { name: 'Bank info. - BIC/SWIFT Code', completed: false, val: 'SwiftCode', title: 'swiftcode' },
        { name: 'Bank info. - Acc. Holder Name', completed: false, val: 'AccountHolderName', title: 'accountholdername' },
        { name: 'Bank info. - Acc. Number', completed: false, val: 'AccountNumber', title: 'accountnumber' },
        { name: 'Bank info. - Bank Add. Line1', completed: false, val: 'BankAddress', title: 'bankaddress' },
        { name: 'Bank info. - Bank Add. Line2', completed: false, val: 'BankAddress2', title: 'bankaddress2' },
        { name: 'Bank info. - IBAN No', completed: false, val: 'ibanNo', title: 'ibanNo' },
        { name: 'Bank info. - Acc. Currency', completed: false, val: 'AccountCurrency', title: 'accountcurrency' },
        { name: 'Bank info. - Multicurrency', completed: false, val: 'Multicurrency', title: 'multicurrency' }
      );
    }
    if (this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver') {
      this.displayedDashboardColumns.push("accountcurrency", "accountholdername", "accountnumber", "bankaddress", "bankaddress2",
        "bankcountrycode", "bankname", "multicurrency", "otherbank", "swiftcode", "ibanNo");

      this.ColumnList.push(
        { name: 'Fin. Status - 1. Operating profit - Year', completed: false, val: 'OperatingProfitYear', title: 'operatingProfitYear' },
        { name: 'Fin. Status - 1. Operating profit - Value', completed: false, val: 'OperatingProfitValue', title: 'operatingProfitValue' },
        { name: 'Fin. Status - 2. Net income - Year', completed: false, val: 'NetIncomeYear', title: 'netIncomeYear' },
        { name: 'Fin. Status - 2. Net income - Value', completed: false, val: 'NetIncomeValue', title: 'netIncomeValue' },
        { name: 'Fin. Status - 3. Current asset - Year', completed: false, val: 'CurrentAssetYear', title: 'currentAssetYear' },
        { name: 'Fin. Status - 3. Current asset - Value', completed: false, val: 'CurrentAssetValue', title: 'currentAssetValue' },
        { name: 'Fin. Status - 4. Total liabilities - Year', completed: false, val: 'TotalLiabilitiesYear', title: 'totalLiabilitiesYear' },
        { name: 'Fin. Status - 4. Total liabilities - Value', completed: false, val: 'TotalLiabilitiesValue', title: 'totalLiabilitiesValue' },
        { name: 'Fin. Status - 5. Total equity - Year', completed: false, val: 'TotalEquityYear', title: 'totalEquityYear' },
        { name: 'Fin. Status - 5. Total equity - Value', completed: false, val: 'TotalEquityValue', title: 'totalEquityValue' },

        { name: 'Bank info. - Bank Country Code', completed: false, val: 'BankCountryCode', title: 'bankcountrycode' },
        { name: 'Bank info. - Bank Name', completed: false, val: 'BankName', title: 'bankname' },
        { name: 'Bank info. - Other Bank', completed: false, val: 'OtherBank', title: 'otherbank' },
        { name: 'Bank info. - BIC/SWIFT Code', completed: false, val: 'SwiftCode', title: 'swiftcode' },
        { name: 'Bank info. - Acc. Holder Name', completed: false, val: 'AccountHolderName', title: 'accountholdername' },
        { name: 'Bank info. - Acc. Number', completed: false, val: 'AccountNumber', title: 'accountnumber' },
        { name: 'Bank info. - Bank Add. Line1', completed: false, val: 'BankAddress', title: 'bankaddress' },
        { name: 'Bank info. - Bank Add. Line2', completed: false, val: 'BankAddress2', title: 'bankaddress2' },
        { name: 'Bank info. - IBAN No', completed: false, val: 'ibanNo', title: 'ibanNo' },
        { name: 'Bank info. - Acc. Currency', completed: false, val: 'AccountCurrency', title: 'accountcurrency' },
        { name: 'Bank info. - Multicurrency', completed: false, val: 'Multicurrency', title: 'multicurrency' }
      );

      this.DropdownList.push(
        { name: 'Fin. Status - 1. Operating profit - Year', completed: false, val: 'OperatingProfitYear', title: 'operatingProfitYear' },
        { name: 'Fin. Status - 1. Operating profit - Value', completed: false, val: 'OperatingProfitValue', title: 'operatingProfitValue' },
        { name: 'Fin. Status - 2. Net income - Year', completed: false, val: 'NetIncomeYear', title: 'netIncomeYear' },
        { name: 'Fin. Status - 2. Net income - Value', completed: false, val: 'NetIncomeValue', title: 'netIncomeValue' },
        { name: 'Fin. Status - 3. Current asset - Year', completed: false, val: 'CurrentAssetYear', title: 'currentAssetYear' },
        { name: 'Fin. Status - 3. Current asset - Value', completed: false, val: 'CurrentAssetValue', title: 'currentAssetValue' },
        { name: 'Fin. Status - 4. Total liabilities - Year', completed: false, val: 'TotalLiabilitiesYear', title: 'totalLiabilitiesYear' },
        { name: 'Fin. Status - 4. Total liabilities - Value', completed: false, val: 'TotalLiabilitiesValue', title: 'totalLiabilitiesValue' },
        { name: 'Fin. Status - 5. Total equity - Year', completed: false, val: 'TotalEquityYear', title: 'totalEquityYear' },
        { name: 'Fin. Status - 5. Total equity - Value', completed: false, val: 'TotalEquityValue', title: 'totalEquityValue' },

        { name: 'Bank info. - Bank Country Code', completed: false, val: 'BankCountryCode', title: 'bankcountrycode' },
        { name: 'Bank info. - Bank Name', completed: false, val: 'BankName', title: 'bankname' },
        { name: 'Bank info. - Other Bank', completed: false, val: 'OtherBank', title: 'otherbank' },
        { name: 'Bank info. - BIC/SWIFT Code', completed: false, val: 'SwiftCode', title: 'swiftcode' },
        { name: 'Bank info. - Acc. Holder Name', completed: false, val: 'AccountHolderName', title: 'accountholdername' },
        { name: 'Bank info. - Acc. Number', completed: false, val: 'AccountNumber', title: 'accountnumber' },
        { name: 'Bank info. - Bank Add. Line1', completed: false, val: 'BankAddress', title: 'bankaddress' },
        { name: 'Bank info. - Bank Add. Line2', completed: false, val: 'BankAddress2', title: 'bankaddress2' },
        { name: 'Bank info. - IBAN No', completed: false, val: 'ibanNo', title: 'ibanNo' },
        { name: 'Bank info. - Acc. Currency', completed: false, val: 'AccountCurrency', title: 'accountcurrency' },
        { name: 'Bank info. - Multicurrency', completed: false, val: 'Multicurrency', title: 'multicurrency' }
      );
    }
    if (this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP') {
      this.ColumnList.push(
        { name: 'Gen. Info. - 1. Type Of Org', completed: false, val: 'TypeOfOrg', title: 'typeoforg' },
        { name: 'Gen. Info. - 2. Manegerial', completed: false, val: 'ManegerialCount', title: 'manegerialCount' },
        { name: 'Gen. Info. - 2. Operational', completed: false, val: 'OperationsCount', title: 'operationsCount' },
        { name: 'Gen. Info. - 2. Saudi Nationals', completed: false, val: 'SaudiNationalsCount', title: 'saudiNationalsCount' },
        { name: 'Gen. Info. - 2. Technical', completed: false, val: 'TechnicalCount', title: 'technicalCount' },
        { name: 'Gen. Info. - 2. Total', completed: false, val: 'TotalCount', title: 'totalCount' },
        { name: 'Gen. Info. - 3. Add. of the parent company', completed: false, val: 'ParentCompany', title: 'parentCompany' },
        { name: 'Gen. Info. - 4. Add. of the sister/affiliated companies', completed: false, val: 'SisterCompany', title: 'sisterCompany' },
        { name: 'Gen. Info. - 5. List all owners/principals’ name', completed: false, val: 'OwnerCompany', title: 'ownerCompany' },

        { name: 'Fin. Status - 1. Operating profit - Year', completed: false, val: 'OperatingProfitYear', title: 'operatingProfitYear' },
        { name: 'Fin. Status - 1. Operating profit - Value', completed: false, val: 'OperatingProfitValue', title: 'operatingProfitValue' },
        { name: 'Fin. Status - 2. Net income - Year', completed: false, val: 'NetIncomeYear', title: 'netIncomeYear' },
        { name: 'Fin. Status - 2. Net income - Value', completed: false, val: 'NetIncomeValue', title: 'netIncomeValue' },
        { name: 'Fin. Status - 3. Current asset - Year', completed: false, val: 'CurrentAssetYear', title: 'currentAssetYear' },
        { name: 'Fin. Status - 3. Current asset - Value', completed: false, val: 'CurrentAssetValue', title: 'currentAssetValue' },
        { name: 'Fin. Status - 4. Total liabilities - Year', completed: false, val: 'TotalLiabilitiesYear', title: 'totalLiabilitiesYear' },
        { name: 'Fin. Status - 4. Total liabilities - Value', completed: false, val: 'TotalLiabilitiesValue', title: 'totalLiabilitiesValue' },
        { name: 'Fin. Status - 5. Total equity - Year', completed: false, val: 'TotalEquityYear', title: 'totalEquityYear' },
        { name: 'Fin. Status - 5. Total equity - Value', completed: false, val: 'TotalEquityValue', title: 'totalEquityValue' },

        { name: 'Exp. & Qua. - 1. Number of Years in the Business', completed: false, val: 'NoOfBusinessYears', title: 'noOfBusinessYears' },
        { name: 'Exp. & Qua. - 2. Own the plant and equipment', completed: false, val: 'OwnsPlantEquipment', title: 'ownsPlantEquipment' },
        { name: 'Exp. & Qua. - 3. Design capability', completed: false, val: 'DesignnCapability', title: 'designnCapability' },
        { name: 'Exp. & Qua. - 4. Product/Service outsourcing', completed: false, val: 'FinishedProduct', title: 'finishedProduct' },
        { name: 'Exp. & Qua. - 5. Internal Written policy', completed: false, val: 'InternalPolicy', title: 'internalPolicy' },
        { name: 'Exp. & Qua. - 6. 3rd party certifying', completed: false, val: 'Registered3rdPartyBody', title: 'registered3rdPartyBody' },
        { name: 'Exp. & Qua. - 7. Project/Order suspened', completed: false, val: 'SuspendedProj', title: 'suspendedProj' },

        { name: 'Legal - 1. Involved in any litigation', completed: false, val: 'Litigation', title: 'litigation' },
        { name: 'Legal - 2. Internal compliance program', completed: false, val: 'Compliance', title: 'compliance' },
        { name: 'Legal - 3. offered gifts or bribes', completed: false, val: 'Shareholder', title: 'shareholder' },
        { name: 'Legal - 4. financial transactions blocked', completed: false, val: 'LegalAsset', title: 'legalAsset' },
        { name: 'Legal - 5. convictions under labor legislation', completed: false, val: 'Labour', title: 'labour' },
        { name: 'Legal - 6. convictions under environmental legislation', completed: false, val: 'Environment', title: 'environment' },
        { name: 'Legal - 7. IMI has an interest', completed: false, val: 'ImiInterested', title: 'imiInterested' },

        { name: 'HSE - 1. HSE written policy', completed: false, val: 'hse', title: 'hse' },
        { name: 'HSE - 2. HSE Management System', completed: false, val: 'docuHse', title: 'docuHse' },
        { name: 'HSE - 3. ISO 45001 Certified', completed: false, val: 'isohealth', title: 'isohealth' },
        { name: 'HSE - 4. ISO 14001 Certified', completed: false, val: 'envtMgt1', title: 'envtMgt1' },
        { name: 'HSE - 5. person responsible for HSE?', completed: false, val: 'dedicatedpers', title: 'dedicatedpers' },
        { name: 'HSE - 5. person responsible for HSE? - Name', completed: false, val: 'hseName', title: 'hseName' },
        { name: 'HSE - 5. person responsible for HSE? - Designation', completed: false, val: 'hseDesig', title: 'hseDesig' },
        { name: 'HSE - 6. HSE statistics', completed: false, val: 'statistic', title: 'statistic' },
        { name: 'HSE - 6. HSE statistics - Near Miss', completed: false, val: 'statisticNear', title: 'statisticNear' },
        { name: 'HSE - 6. HSE statistics - First Aid Case', completed: false, val: 'statisticFirst', title: 'statisticFirst' },
        { name: 'HSE - 6. HSE statistics - Medical Tre. Case', completed: false, val: 'statisticMedical', title: 'statisticMedical' },
        { name: 'HSE - 6. HSE statistics - Lost Time Injuries', completed: false, val: 'statisticLost', title: 'statisticLost' },
        { name: 'HSE - 6. HSE statistics - Fatality', completed: false, val: 'statisticFatal', title: 'statisticFatal' },
        { name: 'HSE - 6. HSE statistics - Env. Incident', completed: false, val: 'statisticEnvt', title: 'statisticEnvt' },

        { name: 'Quality - 1. Quality written policy', completed: false, val: 'qualityPolicy', title: 'qualityPolicy' },
        { name: 'Quality - 2. Quality Management System', completed: false, val: 'qualityMgt', title: 'qualityMgt' },
        { name: 'Quality - 3. Certified to ISO 9001:2015', completed: false, val: 'qualityMgtIso', title: 'qualityMgtIso' },
        { name: 'Quality - 4. Person responsible for Quality', completed: false, val: 'qualityResp1', title: 'qualityResp1' },
        { name: 'Quality - 4. Person responsible for Quality - Name', completed: false, val: 'qualityResp2', title: 'qualityResp2' },
        { name: 'Quality - 4. Person responsible for Quality - Designation ', completed: false, val: 'qualityResp3', title: 'qualityResp3' },
        { name: 'Quality - 5. QMS Audit date', completed: false, val: 'qualityreviewDate', title: 'qualityreviewDate' }
      );

      this.DropdownList.push(
        { name: 'Gen. Info. - 1. Type Of Org', completed: false, val: 'TypeOfOrg', title: 'typeoforg' },
        { name: 'Gen. Info. - 2. Manegerial', completed: false, val: 'ManegerialCount', title: 'manegerialCount' },
        { name: 'Gen. Info. - 2. Operational', completed: false, val: 'OperationsCount', title: 'operationsCount' },
        { name: 'Gen. Info. - 2. Saudi Nationals', completed: false, val: 'SaudiNationalsCount', title: 'saudiNationalsCount' },
        { name: 'Gen. Info. - 2. Technical', completed: false, val: 'TechnicalCount', title: 'technicalCount' },
        { name: 'Gen. Info. - 2. Total', completed: false, val: 'TotalCount', title: 'totalCount' },
        { name: 'Gen. Info. - 3. Add. of the parent company', completed: false, val: 'ParentCompany', title: 'parentCompany' },
        { name: 'Gen. Info. - 4. Add. of the sister/affiliated companies', completed: false, val: 'SisterCompany', title: 'sisterCompany' },
        { name: 'Gen. Info. - 5. List all owners/principals’ name', completed: false, val: 'OwnerCompany', title: 'ownerCompany' },

        { name: 'Fin. Status - 1. Operating profit - Year', completed: false, val: 'OperatingProfitYear', title: 'operatingProfitYear' },
        { name: 'Fin. Status - 1. Operating profit - Value', completed: false, val: 'OperatingProfitValue', title: 'operatingProfitValue' },
        { name: 'Fin. Status - 2. Net income - Year', completed: false, val: 'NetIncomeYear', title: 'netIncomeYear' },
        { name: 'Fin. Status - 2. Net income - Value', completed: false, val: 'NetIncomeValue', title: 'netIncomeValue' },
        { name: 'Fin. Status - 3. Current asset - Year', completed: false, val: 'CurrentAssetYear', title: 'currentAssetYear' },
        { name: 'Fin. Status - 3. Current asset - Value', completed: false, val: 'CurrentAssetValue', title: 'currentAssetValue' },
        { name: 'Fin. Status - 4. Total liabilities - Year', completed: false, val: 'TotalLiabilitiesYear', title: 'totalLiabilitiesYear' },
        { name: 'Fin. Status - 4. Total liabilities - Value', completed: false, val: 'TotalLiabilitiesValue', title: 'totalLiabilitiesValue' },
        { name: 'Fin. Status - 5. Total equity - Year', completed: false, val: 'TotalEquityYear', title: 'totalEquityYear' },
        { name: 'Fin. Status - 5. Total equity - Value', completed: false, val: 'TotalEquityValue', title: 'totalEquityValue' },

        { name: 'Exp. & Qua. - 1. Number of Years in the Business', completed: false, val: 'NoOfBusinessYears', title: 'noOfBusinessYears' },
        { name: 'Exp. & Qua. - 2. Own the plant and equipment', completed: false, val: 'OwnsPlantEquipment', title: 'ownsPlantEquipment' },
        { name: 'Exp. & Qua. - 3. Design capability', completed: false, val: 'DesignnCapability', title: 'designnCapability' },
        { name: 'Exp. & Qua. - 4. Product/Service outsourcing', completed: false, val: 'FinishedProduct', title: 'finishedProduct' },
        { name: 'Exp. & Qua. - 5. Internal Written policy', completed: false, val: 'InternalPolicy', title: 'internalPolicy' },
        { name: 'Exp. & Qua. - 6. 3rd party certifying', completed: false, val: 'Registered3rdPartyBody', title: 'registered3rdPartyBody' },
        { name: 'Exp. & Qua. - 7. Project/Order suspened', completed: false, val: 'SuspendedProj', title: 'suspendedProj' },

        { name: 'Legal - 1. Involved in any litigation', completed: false, val: 'Litigation', title: 'litigation' },
        { name: 'Legal - 2. Internal compliance program', completed: false, val: 'Compliance', title: 'compliance' },
        { name: 'Legal - 3. offered gifts or bribes', completed: false, val: 'Shareholder', title: 'shareholder' },
        { name: 'Legal - 4. financial transactions blocked', completed: false, val: 'LegalAsset', title: 'legalAsset' },
        { name: 'Legal - 5. convictions under labor legislation', completed: false, val: 'Labour', title: 'labour' },
        { name: 'Legal - 6. convictions under environmental legislation', completed: false, val: 'Environment', title: 'environment' },
        { name: 'Legal - 7. IMI has an interest', completed: false, val: 'ImiInterested', title: 'imiInterested' },

        { name: 'HSE - 1. HSE written policy', completed: false, val: 'hse', title: 'hse' },
        { name: 'HSE - 2. HSE Management System', completed: false, val: 'docuHse', title: 'docuHse' },
        { name: 'HSE - 3. ISO 45001 Certified', completed: false, val: 'isohealth', title: 'isohealth' },
        { name: 'HSE - 4. ISO 14001 Certified', completed: false, val: 'envtMgt1', title: 'envtMgt1' },
        { name: 'HSE - 5. person responsible for HSE?', completed: false, val: 'dedicatedpers', title: 'dedicatedpers' },
        { name: 'HSE - 5. person responsible for HSE? - Name', completed: false, val: 'hseName', title: 'hseName' },
        { name: 'HSE - 5. person responsible for HSE? - Designation', completed: false, val: 'hseDesig', title: 'hseDesig' },
        { name: 'HSE - 6. HSE statistics', completed: false, val: 'statistic', title: 'statistic' },
        { name: 'HSE - 6. HSE statistics - Near Miss', completed: false, val: 'statisticNear', title: 'statisticNear' },
        { name: 'HSE - 6. HSE statistics - First Aid Case', completed: false, val: 'statisticFirst', title: 'statisticFirst' },
        { name: 'HSE - 6. HSE statistics - Medical Tre. Case', completed: false, val: 'statisticMedical', title: 'statisticMedical' },
        { name: 'HSE - 6. HSE statistics - Lost Time Injuries', completed: false, val: 'statisticLost', title: 'statisticLost' },
        { name: 'HSE - 6. HSE statistics - Fatality', completed: false, val: 'statisticFatal', title: 'statisticFatal' },
        { name: 'HSE - 6. HSE statistics - Env. Incident', completed: false, val: 'statisticEnvt', title: 'statisticEnvt' },

        { name: 'Quality - 1. Quality written policy', completed: false, val: 'qualityPolicy', title: 'qualityPolicy' },
        { name: 'Quality - 2. Quality Management System', completed: false, val: 'qualityMgt', title: 'qualityMgt' },
        { name: 'Quality - 3. Certified to ISO 9001:2015', completed: false, val: 'qualityMgtIso', title: 'qualityMgtIso' },
        { name: 'Quality - 4. Person responsible for Quality', completed: false, val: 'qualityResp1', title: 'qualityResp1' },
        { name: 'Quality - 4. Person responsible for Quality - Name', completed: false, val: 'qualityResp2', title: 'qualityResp2' },
        { name: 'Quality - 4. Person responsible for Quality - Designation ', completed: false, val: 'qualityResp3', title: 'qualityResp3' },
        { name: 'Quality - 5. QMS Audit date', completed: false, val: 'qualityreviewDate', title: 'qualityreviewDate' }
      );
      
    }
    if (this.user_role == 'IMI-HSEQ') {
      this.ColumnList.push(
        { name: 'Gen. Info. - 1. Type Of Org', completed: false, val: 'TypeOfOrg', title: 'typeoforg' },
        { name: 'Gen. Info. - 2. Manegerial', completed: false, val: 'ManegerialCount', title: 'manegerialCount' },
        { name: 'Gen. Info. - 2. Operational', completed: false, val: 'OperationsCount', title: 'operationsCount' },
        { name: 'Gen. Info. - 2. Saudi Nationals', completed: false, val: 'SaudiNationalsCount', title: 'saudiNationalsCount' },
        { name: 'Gen. Info. - 2. Technical', completed: false, val: 'TechnicalCount', title: 'technicalCount' },
        { name: 'Gen. Info. - 2. Total', completed: false, val: 'TotalCount', title: 'totalCount' },
        { name: 'Gen. Info. - 3. Add. of the parent company', completed: false, val: 'ParentCompany', title: 'parentCompany' },
        { name: 'Gen. Info. - 4. Add. of the sister/affiliated companies', completed: false, val: 'SisterCompany', title: 'sisterCompany' },
        { name: 'Gen. Info. - 5. List all owners/principals’ name', completed: false, val: 'OwnerCompany', title: 'ownerCompany' },

        { name: 'Exp. & Qua. - 1. Number of Years in the Business', completed: false, val: 'NoOfBusinessYears', title: 'noOfBusinessYears' },
        { name: 'Exp. & Qua. - 2. Own the plant and equipment', completed: false, val: 'OwnsPlantEquipment', title: 'ownsPlantEquipment' },
        { name: 'Exp. & Qua. - 3. Design capability', completed: false, val: 'DesignnCapability', title: 'designnCapability' },
        { name: 'Exp. & Qua. - 4. Product/Service outsourcing', completed: false, val: 'FinishedProduct', title: 'finishedProduct' },
        { name: 'Exp. & Qua. - 5. Internal Written policy', completed: false, val: 'InternalPolicy', title: 'internalPolicy' },
        { name: 'Exp. & Qua. - 6. 3rd party certifying', completed: false, val: 'Registered3rdPartyBody', title: 'registered3rdPartyBody' },
        { name: 'Exp. & Qua. - 7. Project/Order suspened', completed: false, val: 'SuspendedProj', title: 'suspendedProj' },

        { name: 'HSE - 1. HSE written policy', completed: false, val: 'hse', title: 'hse' },
        { name: 'HSE - 2. HSE Management System', completed: false, val: 'docuHse', title: 'docuHse' },
        { name: 'HSE - 3. ISO 45001 Certified', completed: false, val: 'isohealth', title: 'isohealth' },
        { name: 'HSE - 4. ISO 14001 Certified', completed: false, val: 'envtMgt1', title: 'envtMgt1' },
        { name: 'HSE - 5. person responsible for HSE?', completed: false, val: 'dedicatedpers', title: 'dedicatedpers' },
        { name: 'HSE - 5. person responsible for HSE? - Name', completed: false, val: 'hseName', title: 'hseName' },
        { name: 'HSE - 5. person responsible for HSE? - Designation', completed: false, val: 'hseDesig', title: 'hseDesig' },
        { name: 'HSE - 6. HSE statistics', completed: false, val: 'statistic', title: 'statistic' },
        { name: 'HSE - 6. HSE statistics - Near Miss', completed: false, val: 'statisticNear', title: 'statisticNear' },
        { name: 'HSE - 6. HSE statistics - First Aid Case', completed: false, val: 'statisticFirst', title: 'statisticFirst' },
        { name: 'HSE - 6. HSE statistics - Medical Tre. Case', completed: false, val: 'statisticMedical', title: 'statisticMedical' },
        { name: 'HSE - 6. HSE statistics - Lost Time Injuries', completed: false, val: 'statisticLost', title: 'statisticLost' },
        { name: 'HSE - 6. HSE statistics - Fatality', completed: false, val: 'statisticFatal', title: 'statisticFatal' },
        { name: 'HSE - 6. HSE statistics - Env. Incident', completed: false, val: 'statisticEnvt', title: 'statisticEnvt' },

        { name: 'Quality - 1. Quality written policy', completed: false, val: 'qualityPolicy', title: 'qualityPolicy' },
        { name: 'Quality - 2. Quality Management System', completed: false, val: 'qualityMgt', title: 'qualityMgt' },
        { name: 'Quality - 3. Certified to ISO 9001:2015', completed: false, val: 'qualityMgtIso', title: 'qualityMgtIso' },
        { name: 'Quality - 4. Person responsible for Quality', completed: false, val: 'qualityResp1', title: 'qualityResp1' },
        { name: 'Quality - 4. Person responsible for Quality - Name', completed: false, val: 'qualityResp2', title: 'qualityResp2' },
        { name: 'Quality - 4. Person responsible for Quality - Designation ', completed: false, val: 'qualityResp3', title: 'qualityResp3' },
        { name: 'Quality - 5. QMS Audit date', completed: false, val: 'qualityreviewDate', title: 'qualityreviewDate' }
      );

      this.DropdownList.push(
        { name: 'Gen. Info. - 1. Type Of Org', completed: false, val: 'TypeOfOrg', title: 'typeoforg' },
        { name: 'Gen. Info. - 2. Manegerial', completed: false, val: 'ManegerialCount', title: 'manegerialCount' },
        { name: 'Gen. Info. - 2. Operational', completed: false, val: 'OperationsCount', title: 'operationsCount' },
        { name: 'Gen. Info. - 2. Saudi Nationals', completed: false, val: 'SaudiNationalsCount', title: 'saudiNationalsCount' },
        { name: 'Gen. Info. - 2. Technical', completed: false, val: 'TechnicalCount', title: 'technicalCount' },
        { name: 'Gen. Info. - 2. Total', completed: false, val: 'TotalCount', title: 'totalCount' },
        { name: 'Gen. Info. - 3. Add. of the parent company', completed: false, val: 'ParentCompany', title: 'parentCompany' },
        { name: 'Gen. Info. - 4. Add. of the sister/affiliated companies', completed: false, val: 'SisterCompany', title: 'sisterCompany' },
        { name: 'Gen. Info. - 5. List all owners/principals’ name', completed: false, val: 'OwnerCompany', title: 'ownerCompany' },

        { name: 'Exp. & Qua. - 1. Number of Years in the Business', completed: false, val: 'NoOfBusinessYears', title: 'noOfBusinessYears' },
        { name: 'Exp. & Qua. - 2. Own the plant and equipment', completed: false, val: 'OwnsPlantEquipment', title: 'ownsPlantEquipment' },
        { name: 'Exp. & Qua. - 3. Design capability', completed: false, val: 'DesignnCapability', title: 'designnCapability' },
        { name: 'Exp. & Qua. - 4. Product/Service outsourcing', completed: false, val: 'FinishedProduct', title: 'finishedProduct' },
        { name: 'Exp. & Qua. - 5. Internal Written policy', completed: false, val: 'InternalPolicy', title: 'internalPolicy' },
        { name: 'Exp. & Qua. - 6. 3rd party certifying', completed: false, val: 'Registered3rdPartyBody', title: 'registered3rdPartyBody' },
        { name: 'Exp. & Qua. - 7. Project/Order suspened', completed: false, val: 'SuspendedProj', title: 'suspendedProj' },

        { name: 'HSE - 1. HSE written policy', completed: false, val: 'hse', title: 'hse' },
        { name: 'HSE - 2. HSE Management System', completed: false, val: 'docuHse', title: 'docuHse' },
        { name: 'HSE - 3. ISO 45001 Certified', completed: false, val: 'isohealth', title: 'isohealth' },
        { name: 'HSE - 4. ISO 14001 Certified', completed: false, val: 'envtMgt1', title: 'envtMgt1' },
        { name: 'HSE - 5. person responsible for HSE?', completed: false, val: 'dedicatedpers', title: 'dedicatedpers' },
        { name: 'HSE - 5. person responsible for HSE? - Name', completed: false, val: 'hseName', title: 'hseName' },
        { name: 'HSE - 5. person responsible for HSE? - Designation', completed: false, val: 'hseDesig', title: 'hseDesig' },
        { name: 'HSE - 6. HSE statistics', completed: false, val: 'statistic', title: 'statistic' },
        { name: 'HSE - 6. HSE statistics - Near Miss', completed: false, val: 'statisticNear', title: 'statisticNear' },
        { name: 'HSE - 6. HSE statistics - First Aid Case', completed: false, val: 'statisticFirst', title: 'statisticFirst' },
        { name: 'HSE - 6. HSE statistics - Medical Tre. Case', completed: false, val: 'statisticMedical', title: 'statisticMedical' },
        { name: 'HSE - 6. HSE statistics - Lost Time Injuries', completed: false, val: 'statisticLost', title: 'statisticLost' },
        { name: 'HSE - 6. HSE statistics - Fatality', completed: false, val: 'statisticFatal', title: 'statisticFatal' },
        { name: 'HSE - 6. HSE statistics - Env. Incident', completed: false, val: 'statisticEnvt', title: 'statisticEnvt' },

        { name: 'Quality - 1. Quality written policy', completed: false, val: 'qualityPolicy', title: 'qualityPolicy' },
        { name: 'Quality - 2. Quality Management System', completed: false, val: 'qualityMgt', title: 'qualityMgt' },
        { name: 'Quality - 3. Certified to ISO 9001:2015', completed: false, val: 'qualityMgtIso', title: 'qualityMgtIso' },
        { name: 'Quality - 4. Person responsible for Quality', completed: false, val: 'qualityResp1', title: 'qualityResp1' },
        { name: 'Quality - 4. Person responsible for Quality - Name', completed: false, val: 'qualityResp2', title: 'qualityResp2' },
        { name: 'Quality - 4. Person responsible for Quality - Designation ', completed: false, val: 'qualityResp3', title: 'qualityResp3' },
        { name: 'Quality - 5. QMS Audit date', completed: false, val: 'qualityreviewDate', title: 'qualityreviewDate' }
      );
    }

    this.displayedDashboardColumns = this.ColumnList.map(x => x.title);
  }

  ngOnInit(): void {
    var loggedInRole = localStorage.getItem('userrole');
    // var loggedInRole = 'Admin';
    if (loggedInRole == 'Admin') {
      this.displaytemplatecreate = true;
    }
    this.filterValues = JSON.parse(localStorage.getItem('auditfilter'));
    this.filterValues = this.filterValues == null ? {} : this.filterValues;
  }  

  // Get all the suppliers
  public async getAllSuppliersWithAudit() {
    this.http.get<any>(environment.nodeurl + '/api/supplier/allsupplierswithaudit').subscribe(async data => {
      if (data) {
        this.AuditData = data;

        this.dataSourceDashboard.data = [];
        this.addSuppliersData(this.AuditData);
      }
    });
  }

  // Set all the Suppiers data to the table  -- 
  addSuppliersData(suppliersData) {
    var count: number = 0;
    this.dataSourceDashboardList = [];

    if (count == 0) {

      for (var product of suppliersData) {
        var regformatdate: any = product.regDate ? this.datePipe.transform(product.regDate, "yyyy-MM-dd") : '';
        var reg_date;
        var gosiformatdate: any = product.gosiDate ? this.datePipe.transform(product.gosiDate, "yyyy-MM-dd") : '';
        var gosi_date;
        var saudiformatdate: any = product.saudiDate ? this.datePipe.transform(product.saudiDate, "yyyy-MM-dd") : '';
        var saudi_date;
        var zakathformatdate: any = product.zakathDate ? this.datePipe.transform(product.zakathDate, "yyyy-MM-dd") : '';
        var zakath_date;

        // CR date
        if (Number(regformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "Y") {
          reg_date = new NgbDate(Number(regformatdate.split("-")[0]) - 1, 12, Number(regformatdate.split("-")[2]) - 1);
          reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
        }
        if (Number(regformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "N") {
          reg_date = new NgbDate(Number(regformatdate.split("-")[0]) - 1, 12, Number(regformatdate.split("-")[2]));
          reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
        }
        if (Number(regformatdate.split("-")[1]) - 1 != 0) {
          if (product.hijriSelected == "N") {
            reg_date = new NgbDate(Number(regformatdate.split("-")[0]), Number(regformatdate.split("-")[1]) - 1, Number(regformatdate.split("-")[2]));
            reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
          }
          if (product.hijriSelected == "Y") {
            reg_date = new NgbDate(Number(regformatdate.split("-")[0]), Number(regformatdate.split("-")[1]) - 1, Number(regformatdate.split("-")[2]) - 1);
            reg_date = this.datePipe.transform(reg_date.year + "-" + reg_date.month + "-" + reg_date.day, 'dd-MMM-yyyy');
          }
        }

        // Gosi Date
        if (Number(gosiformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "Y") {
          gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]) - 1, 12, Number(gosiformatdate.split("-")[2]) - 1);
          gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
        }
        if (Number(gosiformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "N") {
          gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]) - 1, 12, Number(gosiformatdate.split("-")[2]));
          gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
        }
        if (Number(gosiformatdate.split("-")[1]) - 1 != 0) {
          if (product.country == "SAUDI ARABIA" && product.hijriSelected == "N") {
            gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]), Number(gosiformatdate.split("-")[1]) - 1, Number(gosiformatdate.split("-")[2]));
            gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
          }
          else if (product.country == "SAUDI ARABIA" && product.hijriSelected == "Y") {
            gosi_date = new NgbDate(Number(gosiformatdate.split("-")[0]), Number(gosiformatdate.split("-")[1]) - 1, Number(gosiformatdate.split("-")[2]) - 1);
            gosi_date = this.datePipe.transform(gosi_date.year + "-" + gosi_date.month + "-" + gosi_date.day, 'dd-MMM-yyyy');
          }
          else { gosi_date = ''; }
        }

        // Saudi Date
        if (Number(saudiformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "Y") {
          saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]) - 1, 12, Number(saudiformatdate.split("-")[2]) - 1);
          saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
        }
        if (Number(saudiformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "N") {
          saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]) - 1, 12, Number(saudiformatdate.split("-")[2]));
          saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
        }
        if (Number(saudiformatdate.split("-")[1]) - 1 != 0) {
          if (product.country == "SAUDI ARABIA" && product.hijriSelected == "N") {
            saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]), Number(saudiformatdate.split("-")[1]) - 1, Number(saudiformatdate.split("-")[2]));
            saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
          }
          else if (product.country == "SAUDI ARABIA" && product.hijriSelected == "Y") {
            saudi_date = new NgbDate(Number(saudiformatdate.split("-")[0]), Number(saudiformatdate.split("-")[1]) - 1, Number(saudiformatdate.split("-")[2]) - 1);
            saudi_date = this.datePipe.transform(saudi_date.year + "-" + saudi_date.month + "-" + saudi_date.day, 'dd-MMM-yyyy');
          }
          else { saudi_date = ''; }
        }

        // Zakath Date
        if (Number(zakathformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "Y") {
          zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]) - 1, 12, Number(zakathformatdate.split("-")[2]) - 1);
          zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
        }
        if (Number(zakathformatdate.split("-")[1]) - 1 == 0 && product.hijriSelected == "N") {
          zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]) - 1, 12, Number(zakathformatdate.split("-")[2]));
          zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
        }
        if (Number(zakathformatdate.split("-")[1]) - 1 != 0) {
          if (product.country == "SAUDI ARABIA" && product.hijriSelected == "N") {
            zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]), Number(zakathformatdate.split("-")[1]) - 1, Number(zakathformatdate.split("-")[2]));
            zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
          }
          else if (product.country == "SAUDI ARABIA" && product.hijriSelected == "Y") {
            zakath_date = new NgbDate(Number(zakathformatdate.split("-")[0]), Number(zakathformatdate.split("-")[1]) - 1, Number(zakathformatdate.split("-")[2]) - 1);
            zakath_date = this.datePipe.transform(zakath_date.year + "-" + zakath_date.month + "-" + zakath_date.day, 'dd-MMM-yyyy');
          }
          else { zakath_date = ''; }
        }

        this.dataSourceDashboardList.push({
          position: product.supplierCode,
          supplierID: product.supplierID,
          supplierName: product.supplierName,
          supplierNameArabic: product.supplierNameArabic ? product.supplierNameArabic : '',
          establishmentyear: product.establishmentYear == 0 ? "" : product.establishmentYear,
          issuedby: product.issuedBy ? product.issuedBy : '',
          website: product.website,
          supplierType: product.supplierType,

          country: product.country ? product.country : '',
          city: product.city ? product.city : '',
          otherCity: product.otherCity ? product.otherCity : '',
          poBox: product.poBox ? product.poBox : '',
          postalcode: product.postalCode ? product.postalCode : '',
          adressline1: product.addressLine1 ? product.addressLine1 : '',
          adressline2: product.addressLine2 ? product.addressLine2 : '',

          title: product.title,
          firstname: product.firstName ? product.firstName : '',
          lastname: product.lastName ? product.lastName : '',
          currentPosition: product.currentPosition ? product.currentPosition : '',
          telNoCountryCode: product.telphoneCountryCode ? product.telphoneCountryCode : '',
          telNo: product.telephoneNo ? product.telephoneNo : '',
          ext: product.extension ? product.extension : '',
          email: product.email ? product.email : '',
          mobNoCountryCode: product.mobileCountryCode ? product.mobileCountryCode : '',
          mobNo: product.mobileNo ? product.mobileNo : '',
          faxNoCountryCode: product.faxCountryCode ? product.faxCountryCode : '',
          faxNo: product.faxNo ? product.faxNo : '',
          hijriCalendar: product.hijriSelected ? product.hijriSelected : '',

          crno: product.crNo ? product.crNo : '',
          crExpDate: product.regDate == "01-Jan-1900" || product.regDate == "1/1/1900 12:00:00 AM" || product.regDate == "1900-01-01 12:00:00 AM" ? '': reg_date,
          vatno: product.vatNo ? product.vatNo : '',
          // regDate: product.regDate ? product.regDate : '',
          // gosiCertificate: product.gosiCertificate ? product.gosiCertificate : '',
          gosiExpDate: product.gosiDate == "01-Jan-1900" || product.gosiDate == "1/1/1900 12:00:00 AM" || product.gosiDate == "1900-01-01 12:00:00 AM" ? '':gosi_date,
          saudizationCertificateExpDate: product.saudiDate == "01-Jan-1900" || product.saudiDate == "1/1/1900 12:00:00 AM" || product.saudiDate == "1900-01-01 12:00:00 AM" ? '': saudi_date,
          zakathExpDate: product.zakathDate == "01-Jan-1900" || product.zakathDate == "1/1/1900 12:00:00 AM" || product.zakathDate == "1900-01-01 12:00:00 AM" ? '':zakath_date,
          addtionalMaterial: product.additionalMaterial ? product.additionalMaterial : '',
          waselAddress: product.waselAddress ? product.waselAddress : '',

          typeoforg: product.typeOfOrg ? product.typeOfOrg : '',
          manegerialCount: product.managerialCount ? product.managerialCount : '',
          operationsCount: product.operationsCount ? product.operationsCount : '',
          saudiNationalsCount: product.saudiNationalsCount ? product.saudiNationalsCount : '',
          technicalCount: product.technicalCount ? product.technicalCount : '',
          totalCount: Number(product.managerialCount) + Number(product.operationsCount) + Number(product.technicalCount),
          parentCompany: product.parentCompany ? product.parentCompany : '',
          sisterCompany: product.sisterCompany ? product.sisterCompany : '',
          ownerCompany: product.ownerCompany ? product.ownerCompany : '',

          operatingProfitYear: product.operatingProfit1 ? product.operatingProfit1 : '',
          operatingProfitValue: product.operatingProfit2 ? product.operatingProfit2 : '',
          netIncomeYear: product.netIncome1 ? product.netIncome1 : '',
          netIncomeValue: product.netIncome2 ? product.netIncome2 : '',
          currentAssetYear: product.currentAsset1 ? product.currentAsset1 : '',
          currentAssetValue: product.currentAsset2 ? product.currentAsset2 : '',
          totalLiabilitiesYear: product.totalLiable1 ? product.totalLiable1 : '',
          totalLiabilitiesValue: product.totalLiable2 ? product.totalLiable2 : '',
          totalEquityYear: product.totalEquity1 ? product.totalEquity1 : '',
          totalEquityValue: product.totalEquity2 ? product.totalEquity2 : '',

          noOfBusinessYears: product.noOfYears ? product.noOfYears : '',
          ownsPlantEquipment: product.ownsPlantEquip ? product.ownsPlantEquip : '',
          designnCapability: product.designnCap ? product.designnCap : '',
          finishedProduct: product.finishProd ? product.finishProd : '',
          internalPolicy: product.internalPolicy ? product.internalPolicy : '',
          registered3rdPartyBody: product.registeredOrg ? product.registeredOrg : '',
          suspendedProj: product.suspendedProj1 == "Yes" ? product.suspendedProj1 + ', ' + product.suspendedProj2 : product.suspendedProj1,

          litigation: product.litigation1 == "Yes" ? product.litigation1 + ', ' + product.litigation2 : product.litigation1,
          compliance: product.compliance1 ? product.compliance1 : '',
          shareholder: product.shareholder1 == "Yes" ? product.shareholder1 + ', ' + product.shareholder2 : product.shareholder1,
          legalAsset: product.legalAsset1 == "Yes" ? product.legalAsset1 + ', ' + product.legalAsset2 : product.legalAsset1,
          labour: product.labour1 == "Yes" ? product.labour1 + ', ' + product.labour2 : product.labour1,
          environment: product.environment1 == "Yes" ? product.environment1 + ', ' + product.environment2 : product.environment1,
          imiInterested: product.imiInterested1 == "Yes" ? product.imiInterested1 + ', ' + product.imiInterested2 : product.imiInterested1,

          hse: product.hse1 ? product.hse1 : '',
          docuHse: product.docuHse ? product.docuHse : '',
          isohealth: product.isohealth ? product.isohealth : '',
          envtMgt1: product.envtMgt1 ? product.envtMgt1 : '',
          dedicatedpers: product.dedicatedpers ? product.dedicatedpers : '',
          hseName: product.hseName ? product.hseName : '',
          hseDesig: product.hseDesig ? product.hseDesig : '',
          statistic: product.statistic ? product.statistic : '',
          statisticNear: product.statisticNear ? product.statisticNear : '',
          statisticFirst: product.statisticFirst ? product.statisticFirst : '',
          statisticMedical: product.statisticMedical ? product.statisticMedical : '',
          statisticLost: product.statisticLost ? product.statisticLost : '',
          statisticFatal: product.statisticFatal ? product.statisticFatal : '',
          statisticEnvt: product.statisticEnvt ? product.statisticEnvt : '',

          qualityPolicy: product.qualityPolicy1 ? product.qualityPolicy1 : '',
          qualityMgt: product.qualityMgt ? product.qualityMgt : '',
          qualityMgtIso: product.qualityMgtIso ? product.qualityMgtIso : '',
          qualityResp1: product.qualityResp1 ? product.qualityResp1 : '',
          qualityResp2: product.qualityResp2 ? product.qualityResp2 : '',
          qualityResp3: product.qualityResp3 ? product.qualityResp3 : '',
          qualityreviewDate: product.qualityreviewDate == "01-Jan-1900" || product.qualityreviewDate == "1/1/1900 12:00:00 AM" || product.qualityreviewDate == "1900-01-01 12:00:00 AM" ? '' : this.datePipe.transform(product.qualityreviewDate, 'dd-MMM-yyyy'),

          // Bank Details
          accountcurrency: product.accountCurrency ? product.accountCurrency : '',
          accountholdername: product.accountHolderName,
          accountnumber: product.accountNumber ? product.accountNumber : '',
          bankaddress: product.bankAddress,
          bankaddress2: product.bankAddress2 ? product.bankAddress2 : '',
          bankcountrycode: product.bankCountryCode,
          bankname: product.bankName,
          multicurrency: product.multicurrency == "Y" ? "Yes" : "No",
          otherbank: product.otherBank ? product.otherBank : '',
          swiftcode: product.bicCode ? product.bicCode : '',
          ibanNo: product.ibanNo,

          // other data
          status: product.status,
          criticality: product.criticality > 6 ? 'High Critical' : (product.criticality == 5 || product.criticality == 6) ? 'Critical' : (product.criticality > 0 && product.criticality < 5) ? 'Non Critical' : 'Not categorized',
          createddate: this.datePipe.transform(product.createdDate, 'dd-MMM-yyyy, HH:mm'),
          pushsupplierstatus: product.pushedSupplierStatus,
          invitedsupplier: product.invitedSupplier,
          audittype: product.auditType == "" && product.criticality > 6 ? "Site Audit" : product.auditType == "" && (product.criticality == 5 || product.criticality == 6) ? "Desktop Audit" : product.auditType == "" && (product.criticality > 0 && product.criticality < 5) ? "NA": product.auditType,
          supplierCategories: product.supplierCategories,

          statusremark: product.statusRemark,
          statuscomment: product.statusComment,
          iscurrentstatus: product.isCurrentStatus,
          actioncommand: product.actionCommand,
          auditcreateddate: this.datePipe.transform(product.auditCreatedDate, 'dd-MMM-yyyy, HH:mm'),
          audituserid: product.auditUserID,
          audituserrole: product.auditUserRole,
        });
        count = count + 1;
      }
    }

    if (count == suppliersData.length) {
      this.dataSourceDashboard = new MatTableDataSource<DashboardElement>(this.dataSourceDashboardList);

      this.dataSourceDashboard.paginator = this.tableOnePaginator;
      this.temp = this.dataSourceDashboard.data;
      this.tempData = this.dataSourceDashboard.data;
      this.setFilterText();
      this.filterChange('', '');
    }
    this.isloading = false;
  }

  // Select Category option for report extraction
  public selectCategoryOption(value){
    this.IsCategorySelected = false;
    
    if(value == "Without Categories"){
      this.IsCategorySelected = false;
    }
    else{
      this.IsCategorySelected = true;
    }
  }

  // Filter the data table
  filterChange(filter, event) {
    var value = '';
    if (filter == "createddatefrom" || filter == "createddateto" || filter == "auditcreateddatefrom" || filter == "auditcreateddateto") {
      // value = this.datePipe.transform(event, 'yyyy-MM-dd');
      value = moment(event).format('YYYY-MM-DD');
    } else {
      value = event ? event.target.value.trim().toLowerCase() : '';
    }

    if (filter != '') {
      this.filterValues[filter] = value;
    }

    localStorage.setItem('auditfilter', JSON.stringify(this.filterValues));

    this.dataSourceDashboard.data = this.tempData;

    for (let key in this.filterValues) {
      let value = this.filterValues[key];
      var type = key;

      const temp = this.dataSourceDashboard.data.filter(function (d) {
        var result;

        if (type == "pushsupplierstatus") {
          result = d.pushsupplierstatus.toString();
          return result.toLowerCase().indexOf(value) == 0 || !value;
        }

        else if (type == "status") {
          result = d.status.toString();
          return result.toLowerCase().indexOf(value) == 0 || !value;
        }

        else if (type == "criticality") {
          result = d.criticality.toString();
          return result.toLowerCase().indexOf(value) == 0 || !value;
        }

        else if ((type != "createddatefrom" && type != "createddateto") && (type != "establishmentyearfrom" && type != "establishmentyearto") && (type != "auditcreateddatefrom" && type != "auditcreateddateto")) {
          if (type == "position") { result = d.position.toString(); }
          else if (type == "supplierName") { result = d.supplierName.toString(); }
          else if (type == "currentPosition") { result = d.currentPosition.toString(); }
          else if (type == "country") { result = d.country.toString(); }
          else if (type == "issuedby") { result = d.issuedby.toString(); }
          else if (type == "city") { result = d.city.toString(); }
          else if (type == "postalcode") { result = d.postalcode.toString(); }
          else if (type == "adressline1") { result = d.adressline1.toString(); }
          else if (type == "firstname") { result = d.firstname.toString(); }
          else if (type == "email") { result = d.email.toString(); }
          else if (type == "crno") { result = d.crno.toString(); }
          else if (type == "typeoforg") { result = d.typeoforg.toString(); }
          else if (type == "vatno") { result = d.vatno.toString(); }
          else if (type == "invitedsupplier") { result = d.invitedsupplier.toString(); }
          else if (type == "audittype") { result = d.audittype.toString(); }
          else if (type == "statusremark") { result = d.statusremark.toString(); }
          else if (type == "statuscomment") { result = d.statuscomment.toString(); }
          else if (type == "iscurrentstatus") { result = d.iscurrentstatus.toString(); }
          else if (type == "actioncommand") { result = d.actioncommand.toString(); }
          else if (type == "audituserid") { result = d.audituserid.toString(); }
          else if (type == "audituserrole") { result = d.audituserrole.toString(); }

          else if (type == "supplierNameArabic") { result = d.supplierNameArabic.toString(); }
          else if (type == "website") { result = d.website.toString(); }
          else if (type == "supplierType") { result = d.supplierType.toString(); }
          else if (type == "otherCity") { result = d.otherCity.toString(); }
          else if (type == "poBox") { result = d.poBox.toString(); }
          else if (type == "postalcode") { result = d.postalcode.toString(); }
          else if (type == "adressline2") { result = d.adressline2.toString(); }
          else if (type == "title") { result = d.title.toString(); }
          else if (type == "lastname") { result = d.lastname.toString(); }
          else if (type == "telNoCountryCode") { result = d.telNoCountryCode.toString(); }
          else if (type == "telNo") { result = d.telNo.toString(); }
          else if (type == "ext") { result = d.ext.toString(); }
          else if (type == "mobNoCountryCode") { result = d.mobNoCountryCode.toString(); }
          else if (type == "mobNo") { result = d.mobNo.toString(); }
          else if (type == "faxNoCountryCode") { result = d.faxNoCountryCode.toString(); }
          else if (type == "faxNo") { result = d.faxNo.toString(); }
          else if (type == "hijriCalendar") { result = d.hijriCalendar.toString(); }
          else if (type == "crno") { result = d.crno.toString(); }
          else if (type == "crExpDate") { result = d.crExpDate.toString(); }
          // else if (type == "regDate") { result = d.regDate.toString(); }
          else if (type == "gosiExpDate") { result = d.gosiExpDate.toString(); }
          else if (type == "saudizationCertificateExpDate") { result = d.saudizationCertificateExpDate.toString(); }
          else if (type == "zakathExpDate") { result = d.zakathExpDate.toString(); }
          else if (type == "addtionalMaterial") { result = d.addtionalMaterial.toString(); }
          else if (type == "waselAddress") { result = d.waselAddress.toString(); }
          else if (type == "typeoforg") { result = d.typeoforg.toString(); }
          else if (type == "manegerialCount") { result = d.manegerialCount.toString(); }
          else if (type == "operationsCount") { result = d.operationsCount.toString(); }
          else if (type == "saudiNationalsCount") { result = d.saudiNationalsCount.toString(); }
          else if (type == "technicalCount") { result = d.technicalCount.toString(); }
          else if (type == "totalCount") { result = d.totalCount.toString(); }
          else if (type == "parentCompany") { result = d.parentCompany.toString(); }
          else if (type == "sisterCompany") { result = d.sisterCompany.toString(); }
          else if (type == "ownerCompany") { result = d.ownerCompany.toString(); }
          else if (type == "operatingProfitYear") { result = d.operatingProfitYear.toString(); }
          else if (type == "operatingProfitValue") { result = d.operatingProfitValue.toString(); }
          else if (type == "netIncomeYear") { result = d.netIncomeYear.toString(); }
          else if (type == "netIncomeValue") { result = d.netIncomeValue.toString(); }
          else if (type == "currentAssetYear") { result = d.currentAssetYear.toString(); }
          else if (type == "currentAssetValue") { result = d.currentAssetValue.toString(); }
          else if (type == "totalLiabilitiesYear") { result = d.totalLiabilitiesYear.toString(); }
          else if (type == "totalLiabilitiesValue") { result = d.totalLiabilitiesValue.toString(); }
          else if (type == "totalEquityYear") { result = d.totalEquityYear.toString(); }
          else if (type == "totalEquityValue") { result = d.totalEquityValue.toString(); }
          else if (type == "noOfBusinessYears") { result = d.noOfBusinessYears.toString(); }
          else if (type == "ownsPlantEquipment") { result = d.ownsPlantEquipment.toString(); }
          else if (type == "designnCapability") { result = d.designnCapability.toString(); }
          else if (type == "finishedProduct") { result = d.finishedProduct.toString(); }
          else if (type == "internalPolicy") { result = d.internalPolicy.toString(); }
          else if (type == "registered3rdPartyBody") { result = d.registered3rdPartyBody.toString(); }
          else if (type == "suspendedProj") { result = d.suspendedProj.toString(); }
          else if (type == "litigation") { result = d.litigation.toString(); }
          else if (type == "compliance") { result = d.compliance.toString(); }
          else if (type == "shareholder") { result = d.shareholder.toString(); }
          else if (type == "legalAsset") { result = d.legalAsset.toString(); }
          else if (type == "labour") { result = d.labour.toString(); }
          else if (type == "environment") { result = d.environment.toString(); }
          else if (type == "imiInterested") { result = d.imiInterested.toString(); }
          else if (type == "hse") { result = d.hse.toString(); }
          else if (type == "docuHse") { result = d.docuHse.toString(); }
          else if (type == "isohealth") { result = d.isohealth.toString(); }
          else if (type == "envtMgt1") { result = d.envtMgt1.toString(); }
          else if (type == "dedicatedpers") { result = d.dedicatedpers.toString(); }
          else if (type == "hseName") { result = d.hseName.toString(); }
          else if (type == "hseDesig") { result = d.hseDesig.toString(); }
          else if (type == "statistic") { result = d.statistic.toString(); }
          else if (type == "statisticNear") { result = d.statisticNear.toString(); }
          else if (type == "statisticFirst") { result = d.statisticFirst.toString(); }
          else if (type == "statisticMedical") { result = d.statisticMedical.toString(); }
          else if (type == "statisticLost") { result = d.statisticLost.toString(); }
          else if (type == "statisticFatal") { result = d.statisticFatal.toString(); }
          else if (type == "statisticEnvt") { result = d.statisticEnvt.toString(); }
          else if (type == "qualityPolicy") { result = d.qualityPolicy.toString(); }
          else if (type == "qualityMgt") { result = d.qualityMgt.toString(); }
          else if (type == "qualityMgtIso") { result = d.qualityMgtIso.toString(); }
          else if (type == "qualityResp1") { result = d.qualityResp1.toString(); }
          else if (type == "qualityResp2") { result = d.qualityResp2.toString(); }
          else if (type == "qualityResp3") { result = d.qualityResp3.toString(); }
          else if (type == "qualityreviewDate") { result = d.qualityreviewDate.toString(); }
          else if (type == "accountcurrency") { result = d.accountcurrency.toString(); }
          else if (type == "accountholdername") { result = d.accountholdername.toString(); }
          else if (type == "accountnumber") { result = d.accountnumber.toString(); }
          else if (type == "bankaddress") { result = d.bankaddress.toString(); }
          else if (type == "bankaddress2") { result = d.bankaddress2.toString(); }
          else if (type == "bankcountrycode") { result = d.bankcountrycode.toString(); }
          else if (type == "bankname") { result = d.bankname.toString(); }
          else if (type == "multicurrency") { result = d.multicurrency.toString(); }
          else if (type == "otherbank") { result = d.otherbank.toString(); }
          else if (type == "swiftcode") { result = d.swiftcode.toString(); }
          else if (type == "ibanNo") { result = d.ibanNo.toString(); }
          return result.toLowerCase().indexOf(value) == 0 || !value || result.toLowerCase().includes(value);
        }

        else if (type == "createddatefrom" || type == "createddateto") {
          if (type == "createddatefrom") { return moment(d.createddate).format('YYYY-MM-DD') >= value || !value; }
          else if (type == "createddateto") { return moment(d.createddate).format('YYYY-MM-DD') <= value || !value; }
        }

        else if (type == "auditcreateddatefrom" || type == "auditcreateddateto") {
          if (type == "auditcreateddatefrom") { return moment(d.auditcreateddate).format('YYYY-MM-DD') >= value || !value; }
          else if (type == "auditcreateddateto") { return moment(d.auditcreateddate).format('YYYY-MM-DD') <= value || !value; }
        }

        else if (type == "establishmentyearfrom" || type == "establishmentyearto") {
          if (type == "establishmentyearfrom") { return d.establishmentyear >= value || !value; }
          else if (type == "establishmentyearto") { return d.establishmentyear <= value || !value; }
        }
      });
      this.dataSourceDashboard.data = temp;
      this.isloading = false;
    }
  }

  // route the selected row data
  openRowInfo(position) {
    this.router.navigate(['/dashboard/inner/a/' + position]);
  }

  // Set filter values
  setFilterText() {
    this.status = this.filterValues['status'] ? this.filterValues['status'] : '';
    this.supplierName = this.filterValues['supplierName'] ? this.filterValues['supplierName'] : '';
    this.currentPosition = this.filterValues['currentPosition'] ? this.filterValues['currentPosition'] : '';
    this.position = this.filterValues['position'] ? this.filterValues['position'] : '';
    this.country = this.filterValues['country'] ? this.filterValues['country'] : '';
    this.criticality = this.filterValues['criticality'] ? this.filterValues['criticality'] : '';
    this.createddatefrom = this.filterValues['createddatefrom'] ? this.filterValues['createddatefrom'] : '';
    this.createddateto = this.filterValues['createddateto'] ? this.filterValues['createddateto'] : '';
    this.establishmentyearfrom = this.filterValues['establishmentyearfrom'] ? this.filterValues['establishmentyearfrom'] : '';
    this.establishmentyearto = this.filterValues['establishmentyearto'] ? this.filterValues['establishmentyearto'] : '';
    this.issuedby = this.filterValues['issuedby'] ? this.filterValues['issuedby'] : '';
    this.city = this.filterValues['city'] ? this.filterValues['city'] : '';
    this.postalcode = this.filterValues['postalcode'] ? this.filterValues['postalcode'] : '';
    this.adressline1 = this.filterValues['adressline1'] ? this.filterValues['adressline1'] : '';
    this.firstname = this.filterValues['firstname'] ? this.filterValues['firstname'] : '';
    this.email = this.filterValues['email'] ? this.filterValues['email'] : '';
    this.crno = this.filterValues['crno'] ? this.filterValues['crno'] : '';
    this.typeoforg = this.filterValues['typeoforg'] ? this.filterValues['typeoforg'] : '';
    this.vatno = this.filterValues['vatno'] ? this.filterValues['vatno'] : '';
    this.push_supplier_status = this.filterValues['pushsupplierstatus'] ? this.filterValues['pushsupplierstatus'] : '';
    this.invited_supplier = this.filterValues['invitedsupplier'] ? this.filterValues['invitedsupplier'] : '';
    this.AuditTypeVal = this.filterValues['audittype'] ? this.filterValues['audittype'] : '';

    this.status_remark = this.filterValues['statusremark'] ? this.filterValues['statusremark'] : '';
    this.status_comment = this.filterValues['statuscomment'] ? this.filterValues['statuscomment'] : '';
    this.iscurrent_status = this.filterValues['iscurrentstatus'] ? this.filterValues['iscurrentstatus'] : '';
    this.action_command = this.filterValues['actioncommand'] ? this.filterValues['actioncommand'] : '';
    this.audit_createddatefrom = this.filterValues['auditcreateddatefrom'] ? this.filterValues['auditcreateddatefrom'] : '';
    this.audit_createddateto = this.filterValues['auditcreateddateto'] ? this.filterValues['auditcreateddateto'] : '';
    this.audit_userid = this.filterValues['audituserid'] ? this.filterValues['audituserid'] : '';
    this.audit_userrole = this.filterValues['audituserrole'] ? this.filterValues['audituserrole'] : '';

    this.telNoCountryCodeVal = this.filterValues['telNoCountryCode'] ? this.filterValues['telNoCountryCode'] : '';
    this.telNoVal = this.filterValues['telNo'] ? this.filterValues['telNo'] : '';
    this.extVal = this.filterValues['ext'] ? this.filterValues['ext'] : '';
    this.EmailVal = this.filterValues['email'] ? this.filterValues['email'] : '';
    this.mobNoCountryCodeVal = this.filterValues['mobNoCountryCode'] ? this.filterValues['mobNoCountryCode'] : '';
    this.mobNoVal = this.filterValues['mobNo'] ? this.filterValues['mobNo'] : '';
    this.faxNoCountryCodeVal = this.filterValues['faxNoCountryCode'] ? this.filterValues['faxNoCountryCode'] : '';
    this.faxNoVal = this.filterValues['faxNo'] ? this.filterValues['faxNo'] : '';
    this.hijriCalendarVal = this.filterValues['hijriCalendar'] ? this.filterValues['hijriCalendar'] : '';
    this.CRNoVal = this.filterValues['crno'] ? this.filterValues['crno'] : '';
    this.crExpDateVal = this.filterValues['crExpDate'] ? this.filterValues['crExpDate'] : '';
    this.VatNoVal = this.filterValues['vatno'] ? this.filterValues['vatno'] : '';
    // this.regDateVal = this.filterValues['regDate'] ? this.filterValues['regDate'] : '';
    this.gosiExpDateVal = this.filterValues['gosiExpDate'] ? this.filterValues['gosiExpDate'] : '';
    this.saudizationCertificateExpDateVal = this.filterValues['saudizationCertificateExpDate'] ? this.filterValues['saudizationCertificateExpDate'] : '';
    this.zakathExpDateVal = this.filterValues['zakathExpDate'] ? this.filterValues['zakathExpDate'] : '';
    this.addtionalMaterialVal = this.filterValues['addtionalMaterial'] ? this.filterValues['addtionalMaterial'] : '';
    this.waselAddressVal = this.filterValues['waselAddress'] ? this.filterValues['waselAddress'] : '';
    this.TypeOfOrgVal = this.filterValues['typeoforg'] ? this.filterValues['typeoforg'] : '';
    this.manegerialCountVal = this.filterValues['manegerialCount'] ? this.filterValues['manegerialCount'] : '';
    this.technicalCountVal = this.filterValues['technicalCount'] ? this.filterValues['technicalCount'] : '';
    this.operationsCountVal = this.filterValues['operationsCount'] ? this.filterValues['operationsCount'] : '';
    this.saudiNationalsCountVal = this.filterValues['saudiNationalsCount'] ? this.filterValues['saudiNationalsCount'] : '';
    this.totalCountVal = this.filterValues['totalCount'] ? this.filterValues['totalCount'] : '';
    this.parentCompanyVal = this.filterValues['parentCompany'] ? this.filterValues['parentCompany'] : '';
    this.sisterCompanyVal = this.filterValues['sisterCompany'] ? this.filterValues['sisterCompany'] : '';
    this.ownerCompanyVal = this.filterValues['ownerCompany'] ? this.filterValues['ownerCompany'] : '';
    this.operatingProfitYearVal = this.filterValues['operatingProfitYear'] ? this.filterValues['operatingProfitYear'] : '';
    this.operatingProfitValueVal = this.filterValues['operatingProfitValue'] ? this.filterValues['operatingProfitValue'] : '';
    this.netIncomeYearVal = this.filterValues['netIncomeYear'] ? this.filterValues['netIncomeYear'] : '';
    this.netIncomeValueVal = this.filterValues['netIncomeValue'] ? this.filterValues['netIncomeValue'] : '';
    this.currentAssetYearVal = this.filterValues['currentAssetYear'] ? this.filterValues['currentAssetYear'] : '';
    this.currentAssetValueVal = this.filterValues['currentAssetValue'] ? this.filterValues['currentAssetValue'] : '';
    this.totalLiabilitiesYearVal = this.filterValues['totalLiabilitiesYear'] ? this.filterValues['totalLiabilitiesYear'] : '';
    this.totalLiabilitiesValueVal = this.filterValues['totalLiabilitiesValue'] ? this.filterValues['totalLiabilitiesValue'] : '';
    this.totalEquityYearVal = this.filterValues['totalEquityYear'] ? this.filterValues['totalEquityYear'] : '';
    this.totalEquityValueVal = this.filterValues['totalEquityValue'] ? this.filterValues['totalEquityValue'] : '';
    this.noOfBusinessYearsVal = this.filterValues['noOfBusinessYears'] ? this.filterValues['noOfBusinessYears'] : '';
    this.ownsPlantEquipmentVal = this.filterValues['ownsPlantEquipment'] ? this.filterValues['ownsPlantEquipment'] : '';
    this.designnCapabilityVal = this.filterValues['designnCapability'] ? this.filterValues['designnCapability'] : '';
    this.finishedProductVal = this.filterValues['finishedProduct'] ? this.filterValues['finishedProduct'] : '';
    this.internalPolicyVal = this.filterValues['internalPolicy'] ? this.filterValues['internalPolicy'] : '';
    this.registered3rdPartyBodyVal = this.filterValues['registered3rdPartyBody'] ? this.filterValues['registered3rdPartyBody'] : '';
    this.suspendedProjVal = this.filterValues['suspendedProj'] ? this.filterValues['suspendedProj'] : '';
    this.litigationVal = this.filterValues['litigation'] ? this.filterValues['litigation'] : '';
    this.complianceVal = this.filterValues['compliance'] ? this.filterValues['compliance'] : '';
    this.shareholderVal = this.filterValues['shareholder'] ? this.filterValues['shareholder'] : '';
    this.legalAssetVal = this.filterValues['legalAsset'] ? this.filterValues['legalAsset'] : '';
    this.labourVal = this.filterValues['labour'] ? this.filterValues['labour'] : '';
    this.environmentVal = this.filterValues['environment'] ? this.filterValues['environment'] : '';
    this.imiInterestedVal = this.filterValues['imiInterested'] ? this.filterValues['imiInterested'] : '';
    this.hseVal = this.filterValues['hse'] ? this.filterValues['hse'] : '';
    this.docuHseVal = this.filterValues['docuHse'] ? this.filterValues['docuHse'] : '';
    this.isohealthVal = this.filterValues['isohealth'] ? this.filterValues['isohealth'] : '';
    this.envtMgt1Val = this.filterValues['envtMgt1'] ? this.filterValues['envtMgt1'] : '';
    this.dedicatedpersVal = this.filterValues['dedicatedpers'] ? this.filterValues['dedicatedpers'] : '';
    this.hseNameVal = this.filterValues['hseName'] ? this.filterValues['hseName'] : '';
    this.hseDesigVal = this.filterValues['hseDesig'] ? this.filterValues['hseDesig'] : '';
    this.statisticVal = this.filterValues['statistic'] ? this.filterValues['statistic'] : '';
    this.statisticNearVal = this.filterValues['statisticNear'] ? this.filterValues['statisticNear'] : '';
    this.statisticFirstVal = this.filterValues['statisticFirst'] ? this.filterValues['statisticFirst'] : '';
    this.statisticMedicalVal = this.filterValues['statisticMedical'] ? this.filterValues['statisticMedical'] : '';
    this.statisticLostVal = this.filterValues['statisticLost'] ? this.filterValues['statisticLost'] : '';
    this.statisticFatalVal = this.filterValues['statisticFatal'] ? this.filterValues['statisticFatal'] : '';
    this.statisticEnvtVal = this.filterValues['statisticEnvt'] ? this.filterValues['statisticEnvt'] : '';
    this.qualityPolicyVal = this.filterValues['qualityPolicy'] ? this.filterValues['qualityPolicy'] : '';
    this.qualityMgtVal = this.filterValues['qualityMgt'] ? this.filterValues['qualityMgt'] : '';
    this.qualityMgtIsoVal = this.filterValues['qualityMgtIso'] ? this.filterValues['qualityMgtIso'] : '';
    this.qualityResp1Val = this.filterValues['qualityResp1'] ? this.filterValues['qualityResp1'] : '';
    this.qualityResp2Val = this.filterValues['qualityResp2'] ? this.filterValues['qualityResp2'] : '';
    this.qualityResp3Val = this.filterValues['qualityResp3'] ? this.filterValues['qualityResp3'] : '';
    this.qualityreviewDateVal = this.filterValues['qualityreviewDate'] ? this.filterValues['qualityreviewDate'] : '';
    this.AccountCurrencyVal = this.filterValues['accountcurrency'] ? this.filterValues['accountcurrency'] : '';
    this.AccountHolderNameVal = this.filterValues['accountholdername'] ? this.filterValues['accountholdername'] : '';
    this.AccountNumberVal = this.filterValues['accountnumber'] ? this.filterValues['accountnumber'] : '';
    this.BankAddressVal = this.filterValues['bankaddress'] ? this.filterValues['bankaddress'] : '';
    this.BankAddress2Val = this.filterValues['bankaddress2'] ? this.filterValues['bankaddress2'] : '';
    this.BankCountryCodeVal = this.filterValues['bankcountrycode'] ? this.filterValues['bankcountrycode'] : '';
    this.BankNameVal = this.filterValues['bankname'] ? this.filterValues['bankname'] : '';
    this.MulticurrencyVal = this.filterValues['multicurrency'] ? this.filterValues['multicurrency'] : '';
    this.OtherBankVal = this.filterValues['otherbank'] ? this.filterValues['otherbank'] : '';
    this.SwiftCodeVal = this.filterValues['swiftcode'] ? this.filterValues['swiftcode'] : '';
    this.ibanNoVal = this.filterValues['ibanNo'] ? this.filterValues['ibanNo'] : '';
  }

  // clear the filtered values
  resetFilters() {
    this.filterValues = {};
    this.filterChange('', '');
    this.setFilterText();

    this.maxCreatedDate = null;
    this.minCreatedDate = null;

    this.maxAuditDate = null;
    this.minAuditDate = null;
  }

  // export all the filtered data to an excel
  async ExportToExcel() {
    if (this.selectedList != undefined) {
      if (this.selectedList.length > 0) {
        this.isloading = true;
        this.iserror = false;
        this.selectedValue();
        var count: number = 0;
        this.DataToExport = [];

        if (count == 0) {
          for (var i = 0; i < this.dataSourceDashboard.filteredData.length; i++) {
            this.DataToExport.push({
              Id: i + 1,
              SupplierCode: this.dataSourceDashboard.filteredData[i].position,
              SupplierName: this.dataSourceDashboard.filteredData[i].supplierName,
              SupplierNameArabic: this.dataSourceDashboard.filteredData[i].supplierNameArabic,
              EstablishmentYear: this.dataSourceDashboard.filteredData[i].establishmentyear ? this.dataSourceDashboard.filteredData[i].establishmentyear : '',
              IssuedBy: this.dataSourceDashboard.filteredData[i].issuedby,
              Website: this.dataSourceDashboard.filteredData[i].website,
              SupplierType: this.dataSourceDashboard.filteredData[i].supplierType,

              Country: this.dataSourceDashboard.filteredData[i].country,
              City: this.dataSourceDashboard.filteredData[i].city,
              OtherCity: this.dataSourceDashboard.filteredData[i].otherCity,
              PoBox: this.dataSourceDashboard.filteredData[i].poBox,
              PostalCode: this.dataSourceDashboard.filteredData[i].postalcode,
              AddressLine1: this.dataSourceDashboard.filteredData[i].adressline1,
              AddressLine2: this.dataSourceDashboard.filteredData[i].adressline2,

              Title: this.dataSourceDashboard.filteredData[i].title,
              FirstName: this.dataSourceDashboard.filteredData[i].firstname,
              LastName: this.dataSourceDashboard.filteredData[i].lastname,
              CurrentPosition: this.dataSourceDashboard.filteredData[i].currentPosition,
              TelNoCountryCode: this.dataSourceDashboard.filteredData[i].telNoCountryCode,
              TelNo: this.dataSourceDashboard.filteredData[i].telNo,
              Ext: this.dataSourceDashboard.filteredData[i].ext,
              Email: this.dataSourceDashboard.filteredData[i].email,
              MobNoCountryCode: this.dataSourceDashboard.filteredData[i].mobNoCountryCode,
              MobNo: this.dataSourceDashboard.filteredData[i].mobNo,
              FaxNoCountryCode: this.dataSourceDashboard.filteredData[i].faxNoCountryCode,
              FaxNo: this.dataSourceDashboard.filteredData[i].faxNo,
              HijriCalendar: this.dataSourceDashboard.filteredData[i].hijriCalendar,

              CRNo: this.dataSourceDashboard.filteredData[i].crno,
              CrExpDate: this.dataSourceDashboard.filteredData[i].crExpDate,
              VatNo: this.dataSourceDashboard.filteredData[i].vatno,
              // RegDate: moment(new Date(this.dataSourceDashboard.filteredData[i].regDate)).format('YYYY-MM-DD') == "Invalid date" || this.dataSourceDashboard.filteredData[i].regDate == null ? '' : moment(new Date(this.dataSourceDashboard.filteredData[i].regDate)).format('YYYY-MM-DD'),
              // GosiCertificate: this.dataSourceDashboard.filteredData[i].gosiCertificate,
              GosiExpDate: this.dataSourceDashboard.filteredData[i].gosiExpDate,
              SaudizationCertificateExpDate: this.dataSourceDashboard.filteredData[i].saudizationCertificateExpDate,
              ZakathExpDate: this.dataSourceDashboard.filteredData[i].zakathExpDate,
              AddtionalMaterial: this.dataSourceDashboard.filteredData[i].addtionalMaterial,
              WaselAddress: this.dataSourceDashboard.filteredData[i].waselAddress,

              TypeOfOrg: this.dataSourceDashboard.filteredData[i].typeoforg,
              ManegerialCount: this.dataSourceDashboard.filteredData[i].manegerialCount,
              OperationsCount: this.dataSourceDashboard.filteredData[i].operationsCount,
              SaudiNationalsCount: this.dataSourceDashboard.filteredData[i].saudiNationalsCount,
              TechnicalCount: this.dataSourceDashboard.filteredData[i].technicalCount,
              TotalCount: this.dataSourceDashboard.filteredData[i].totalCount,
              ParentCompany: this.dataSourceDashboard.filteredData[i].parentCompany,
              SisterCompany: this.dataSourceDashboard.filteredData[i].sisterCompany,
              OwnerCompany: this.dataSourceDashboard.filteredData[i].ownerCompany,

              OperatingProfitYear: this.dataSourceDashboard.filteredData[i].operatingProfitYear,
              OperatingProfitValue: this.dataSourceDashboard.filteredData[i].operatingProfitValue,
              NetIncomeYear: this.dataSourceDashboard.filteredData[i].netIncomeYear,
              NetIncomeValue: this.dataSourceDashboard.filteredData[i].netIncomeValue,
              CurrentAssetYear: this.dataSourceDashboard.filteredData[i].currentAssetYear,
              CurrentAssetValue: this.dataSourceDashboard.filteredData[i].currentAssetValue,
              TotalLiabilitiesYear: this.dataSourceDashboard.filteredData[i].totalLiabilitiesYear,
              TotalLiabilitiesValue: this.dataSourceDashboard.filteredData[i].totalLiabilitiesValue,
              TotalEquityYear: this.dataSourceDashboard.filteredData[i].totalEquityYear,
              TotalEquityValue: this.dataSourceDashboard.filteredData[i].totalEquityValue,

              NoOfBusinessYears: this.dataSourceDashboard.filteredData[i].noOfBusinessYears,
              OwnsPlantEquipment: this.dataSourceDashboard.filteredData[i].ownsPlantEquipment,
              DesignnCapability: this.dataSourceDashboard.filteredData[i].designnCapability,
              FinishedProduct: this.dataSourceDashboard.filteredData[i].finishedProduct,
              InternalPolicy: this.dataSourceDashboard.filteredData[i].internalPolicy,
              Registered3rdPartyBody: this.dataSourceDashboard.filteredData[i].registered3rdPartyBody,
              SuspendedProj: this.dataSourceDashboard.filteredData[i].suspendedProj,

              Litigation: this.dataSourceDashboard.filteredData[i].litigation,
              Compliance: this.dataSourceDashboard.filteredData[i].compliance,
              Shareholder: this.dataSourceDashboard.filteredData[i].shareholder,
              LegalAsset: this.dataSourceDashboard.filteredData[i].legalAsset,
              Labour: this.dataSourceDashboard.filteredData[i].labour,
              Environment: this.dataSourceDashboard.filteredData[i].environment,
              ImiInterested: this.dataSourceDashboard.filteredData[i].imiInterested,

              hse: this.dataSourceDashboard.filteredData[i].hse,
              docuHse: this.dataSourceDashboard.filteredData[i].docuHse,
              isohealth: this.dataSourceDashboard.filteredData[i].isohealth,
              envtMgt1: this.dataSourceDashboard.filteredData[i].envtMgt1,
              dedicatedpers: this.dataSourceDashboard.filteredData[i].dedicatedpers,
              hseName: this.dataSourceDashboard.filteredData[i].hseName,
              hseDesig: this.dataSourceDashboard.filteredData[i].hseDesig,
              statistic: this.dataSourceDashboard.filteredData[i].statistic,
              statisticNear: this.dataSourceDashboard.filteredData[i].statisticNear,
              statisticFirst: this.dataSourceDashboard.filteredData[i].statisticFirst,
              statisticMedical: this.dataSourceDashboard.filteredData[i].statisticMedical,
              statisticLost: this.dataSourceDashboard.filteredData[i].statisticLost,
              statisticFatal: this.dataSourceDashboard.filteredData[i].statisticFatal,
              statisticEnvt: this.dataSourceDashboard.filteredData[i].statisticEnvt,

              qualityPolicy: this.dataSourceDashboard.filteredData[i].qualityPolicy,
              qualityMgt: this.dataSourceDashboard.filteredData[i].qualityMgt,
              qualityMgtIso: this.dataSourceDashboard.filteredData[i].qualityMgtIso,
              qualityResp1: this.dataSourceDashboard.filteredData[i].qualityResp1,
              qualityResp2: this.dataSourceDashboard.filteredData[i].qualityResp2,
              qualityResp3: this.dataSourceDashboard.filteredData[i].qualityResp3,
              qualityreviewDate: this.dataSourceDashboard.filteredData[i].qualityreviewDate != '' ? this.datePipe.transform(this.dataSourceDashboard.filteredData[i].qualityreviewDate, 'dd-MMM-yyyy') : '',
              // revisionNo: this.dataSourceDashboard.filteredData[i].revisionNo,

              // Bank Details
              AccountCurrency: this.dataSourceDashboard.filteredData[i].accountcurrency,
              AccountHolderName: this.dataSourceDashboard.filteredData[i].accountholdername,
              AccountNumber: this.dataSourceDashboard.filteredData[i].accountnumber,
              BankAddress: this.dataSourceDashboard.filteredData[i].bankaddress,
              BankAddress2: this.dataSourceDashboard.filteredData[i].bankaddress2,
              BankCountryCode: this.dataSourceDashboard.filteredData[i].bankcountrycode,
              BankName: this.dataSourceDashboard.filteredData[i].bankname,
              Multicurrency: this.dataSourceDashboard.filteredData[i].multicurrency,
              OtherBank: this.dataSourceDashboard.filteredData[i].otherbank,
              SwiftCode: this.dataSourceDashboard.filteredData[i].swiftcode,
              ibanNo: this.dataSourceDashboard.filteredData[i].ibanNo,

              // Audit Details
              StatusRemark: this.dataSourceDashboard.filteredData[i].statusremark,
              StatusComment: this.dataSourceDashboard.filteredData[i].statuscomment,
              IsCurrentStatus: this.dataSourceDashboard.filteredData[i].iscurrentstatus,
              ActionCommand: this.dataSourceDashboard.filteredData[i].actioncommand,
              AuditCreatedDate: this.dataSourceDashboard.filteredData[i].auditcreateddate,
              AuditUserID: this.dataSourceDashboard.filteredData[i].audituserid,
              AuditUserRole: this.dataSourceDashboard.filteredData[i].audituserrole,

              // Other data
              Status: this.dataSourceDashboard.filteredData[i].status,
              Criticality: this.dataSourceDashboard.filteredData[i].criticality,
              CreatedDate: this.dataSourceDashboard.filteredData[i].createddate,
              PushSupplierStatus: this.dataSourceDashboard.filteredData[i].pushsupplierstatus,
              InvitedSupplier: this.dataSourceDashboard.filteredData[i].invitedsupplier,
              AuditType: this.dataSourceDashboard.filteredData[i].audittype,
              supplierCategories: this.dataSourceDashboard.filteredData[i].supplierCategories

            });
            this.supplierIDs.push(this.dataSourceDashboard.filteredData[i].supplierID);

            count = count + 1;
          }
        }

        if (count == this.dataSourceDashboard.filteredData.length) {
          if(this.IsCategorySelected == true){
            this.all_sup_categories = null;
            this.Suppliers_Categories = null;
            this.uniqueSupplierIDs = this.supplierIDs.filter((a, b) => this.supplierIDs.indexOf(a) === b);

            await this.http.post<any>(environment.nodeurl + '/api/supplier/allsuppliercategories', this.uniqueSupplierIDs).subscribe(async data => {
              if (data) {
                this.Suppliers_Categories = data;

                var headerresult = this.DataToExport;
                let workbook = new Workbook();
                let worksheet = workbook.addWorksheet('All Suppliers');

                var headertbltitles = [];

                headertbltitles.push("S. No");
                headertbltitles.push('Supplier Code');
                headertbltitles.push('Supplier Details - Supplier Name (in English)');
                if (this.SupplierNameArabic) { headertbltitles.push('Supplier Details - Supplier Name (in Arabic)'); }
                if (this.EstablishmentYear) { headertbltitles.push('Supplier Details - Establishment Year'); }
                if (this.IssuedBy) { headertbltitles.push('Supplier Details - Issued By'); }
                if (this.Website) { headertbltitles.push('Supplier Details - Website'); }
                if (this.SupplierType) { headertbltitles.push('Supplier Details - Supplier Type'); }

                if (this.Country) { headertbltitles.push('Address - Country'); }
                if (this.City) { headertbltitles.push('Address - City'); }
                if (this.OtherCity) { headertbltitles.push('Address - Other City'); }
                if (this.PoBox) { headertbltitles.push('Address - PoBox'); }
                if (this.PostalCode) { headertbltitles.push('Address - Postal Code'); }
                if (this.AddressLine1) { headertbltitles.push('Address - Address Line1'); }
                if (this.AddressLine2) { headertbltitles.push('Address - Address Line2'); }

                if (this.Title) { headertbltitles.push('Contact Person - Title'); }
                if (this.FirstName) { headertbltitles.push('Contact Person - First Name'); }
                if (this.LastName) { headertbltitles.push('Contact Person - Last Name'); }
                if (this.CurrentPosition) { headertbltitles.push('Contact Person - Current Position'); }
                if (this.telNoCountryCode) { headertbltitles.push('Contact Person - Tel No CountryCode'); }
                if (this.telNo) { headertbltitles.push('Contact Person - Tel No'); }
                if (this.ext) { headertbltitles.push('Contact Person - Ext'); }
                if (this.Email) { headertbltitles.push('Contact Person - Email'); }
                if (this.mobNoCountryCode) { headertbltitles.push('Contact Person - Mob No CountryCode'); }
                if (this.mobNo) { headertbltitles.push('Contact Person - Mob No'); }
                if (this.faxNoCountryCode) { headertbltitles.push('Contact Person - Fax No CountryCode'); }
                if (this.faxNo) { headertbltitles.push('Contact Person - Fax No'); }
                if (this.hijriCalendar) { headertbltitles.push('Contact Person - Hijri Calendar'); }

                if (this.CRNo) { headertbltitles.push('Registration Details - CR No'); }
                if (this.crExpDate) { headertbltitles.push('Registration Details - CR Exp Date'); }
                if (this.VatNo) { headertbltitles.push('Registration Details - Vat No'); }
                // if (this.regDate) { headertbltitles.push('Registration Details - Reg Date'); }
                if (this.gosiExpDate) { headertbltitles.push('Registration Details - GOSI Exp Date'); }
                if (this.saudizationCertificateExpDate) { headertbltitles.push('Registration Details - Saudization Exp Date'); }
                if (this.zakathExpDate) { headertbltitles.push('Registration Details - Zakat Exp Date'); }
                if (this.addtionalMaterial) { headertbltitles.push('Registration Details - Addtional Material'); }
                if (this.waselAddress) { headertbltitles.push('Registration Details - Wasel Address'); }

                // Other Data
                if (this.Status) { headertbltitles.push('Status'); }
                if (this.Criticality) { headertbltitles.push('Criticality'); }
                if (this.CreatedDate) { headertbltitles.push('Created Date'); }
                if (this.PushSupplierStatus) { headertbltitles.push('Push Supplier Status'); }
                if (this.InvitedSupplier) { headertbltitles.push('Invited Supplier'); }

                // Audit Details
                if (this.StatusRemark) { headertbltitles.push('Status Remark'); }
                if (this.StatusComment) { headertbltitles.push('Decision Remark'); }
                if (this.IsCurrentStatus) { headertbltitles.push('Is Current Status'); }
                if (this.ActionCommand) { headertbltitles.push('Action Command'); }
                if (this.AuditCreatedDate) { headertbltitles.push('Audit Created Date'); }
                if (this.AuditType) { headertbltitles.push('Audit Type'); }
                if (this.AuditUserID) { headertbltitles.push('Audit User ID'); }
                if (this.AuditUserRole) { headertbltitles.push('Audit User Role'); }

                if (this.TypeOfOrg && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 1. Type Of Org'); }
                if (this.manegerialCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Manegerial'); }
                if (this.operationsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Operations'); }
                if (this.saudiNationalsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Saudi Nationals'); }
                if (this.technicalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Technical'); }
                if (this.totalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Total'); }
                if (this.parentCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 3. Add. of the parent company'); }
                if (this.sisterCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 4. Add. of the sister/affiliated companies'); }
                if (this.ownerCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 5. List all owners/principals’ name'); }

                if (this.operatingProfitYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 1. Operating profit - Year'); }
                if (this.operatingProfitValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 1. Operating profit - Value'); }
                if (this.netIncomeYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 2. Net income - Year'); }
                if (this.netIncomeValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 2. Net income - Value'); }
                if (this.currentAssetYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 3. Current asset - Year'); }
                if (this.currentAssetValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 3. Current asset - Value'); }
                if (this.totalLiabilitiesYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 4. Total liabilities - Year'); }
                if (this.totalLiabilitiesValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 4. Total liabilities - Value'); }
                if (this.totalEquityYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 5. Total equity - Year'); }
                if (this.totalEquityValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 5. Total equity - Value'); }

                if (this.noOfBusinessYears && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 1. Number of Years in the Business'); }
                if (this.ownsPlantEquipment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 2. Own the plant and equipment'); }
                if (this.designnCapability && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 3. Design capability'); }
                if (this.finishedProduct && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 4. Product/Service outsourcing'); }
                if (this.internalPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 5. Internal Written policy'); }
                if (this.registered3rdPartyBody && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 6. 3rd party certifying'); }
                if (this.suspendedProj && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 7. Project/Order suspened'); }

                if (this.litigation && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 1. Involved in any litigation'); }
                if (this.compliance && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 2. Internal compliance program'); }
                if (this.shareholder && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 3. offered gifts or bribes'); }
                if (this.legalAsset && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 4. financial transactions blocked'); }
                if (this.labour && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 5. convictions under labor legislation'); }
                if (this.environment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 6. convictions under environmental legislation'); }
                if (this.imiInterested && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 7. IMI has an interest'); }

                if (this.hse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 1. HSE written policy'); }
                if (this.docuHse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 2. HSE Management System'); }
                if (this.isohealth && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 3. ISO 45001 Certified'); }
                if (this.envtMgt1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 4. ISO 14001 Certified'); }
                if (this.dedicatedpers && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 5. person responsible for HSE?'); }
                if (this.hseName && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 5. person responsible for HSE? - Name'); }
                if (this.hseDesig && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 5. person responsible for HSE? - Designation'); }
                if (this.statistic && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics'); }
                if (this.statisticNear && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Near Miss'); }
                if (this.statisticFirst && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - First Aid Case'); }
                if (this.statisticMedical && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Medical Tre. Case'); }
                if (this.statisticLost && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Lost Time Injuries'); }
                if (this.statisticFatal && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Fatality'); }
                if (this.statisticEnvt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Env. Incident'); }

                if (this.qualityPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 1. Quality written policy'); }
                if (this.qualityMgt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 2. Quality Management System'); }
                if (this.qualityMgtIso && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 3. Certified to ISO 9001:2015'); }
                if (this.qualityResp1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 4. Person responsible for Quality'); }
                if (this.qualityResp2 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 4. Person responsible for Quality - Name'); }
                if (this.qualityResp3 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 4. Person responsible for Quality - Designation'); }
                if (this.qualityreviewDate && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 5. QMS Audit date'); }

                // Bank Details
                if (this.BankCountryCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Country Code'); }
                if (this.BankName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Name'); }
                if (this.OtherBank && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Other Bank'); }
                if (this.SwiftCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - BIC/SWIFT Code'); }
                if (this.AccountHolderName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Acc. Holder Name'); }
                if (this.AccountNumber && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Acc. Number'); }
                if (this.BankAddress && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Add. Line1'); }
                if (this.BankAddress2 && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Add. Line2'); }
                if (this.ibanNo && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - IBAN No'); }
                if (this.AccountCurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Acc. Currency'); }
                if (this.Multicurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Multicurrency'); }

                let headerRow = worksheet.addRow(headertbltitles);
                headerRow.font = { bold: true };

                // colour the header
                for (var i = 0; i < this.selectedList.length; i++) {
                  if (this.selectedList[i]) {
                    worksheet.getRow(1).getCell(1).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    worksheet.getRow(1).getCell(2).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    worksheet.getRow(1).getCell(3).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    var num: number = 0;
                    num = i + 4;
                    worksheet.getRow(1).getCell(num).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };
                  }
                }

                headerresult.forEach(x => {
                  let row = [];
                  row.push(x.Id);

                  row.push(x.SupplierCode);
                  row.push(x.SupplierName);
                  if (this.SupplierNameArabic) { row.push(x.SupplierNameArabic); }
                  if (this.EstablishmentYear) { row.push(x.EstablishmentYear); }
                  if (this.IssuedBy) { row.push(x.IssuedBy); }
                  if (this.Website) { row.push(x.Website); }
                  if (this.SupplierType) { row.push(x.SupplierType); }

                  if (this.Country) { row.push(x.Country); }
                  if (this.City) { row.push(x.City); }
                  if (this.OtherCity) { row.push(x.OtherCity); }
                  if (this.PoBox) { row.push(x.PoBox); }
                  if (this.PostalCode) { row.push(x.PostalCode); }
                  if (this.AddressLine1) { row.push(x.AddressLine1); }
                  if (this.AddressLine2) { row.push(x.AddressLine2); }

                  if (this.Title) { row.push(x.Title); }
                  if (this.FirstName) { row.push(x.FirstName); }
                  if (this.LastName) { row.push(x.LastName); }
                  if (this.CurrentPosition) { row.push(x.CurrentPosition); }
                  if (this.telNoCountryCode) { row.push(x.TelNoCountryCode); }
                  if (this.telNo) { row.push(x.TelNo); }
                  if (this.ext) { row.push(x.Ext); }
                  if (this.Email) { row.push(x.Email); }
                  if (this.mobNoCountryCode) { row.push(x.MobNoCountryCode); }
                  if (this.mobNo) { row.push(x.MobNo); }
                  if (this.faxNoCountryCode) { row.push(x.FaxNoCountryCode); }
                  if (this.faxNo) { row.push(x.FaxNo); }
                  if (this.hijriCalendar) { row.push(x.HijriCalendar); }

                  if (this.CRNo) { row.push(x.CRNo); }
                  if (this.crExpDate) { row.push(x.CrExpDate); }
                  if (this.VatNo) { row.push(x.VatNo); }
                  // if (this.regDate) { row.push(x.RegDate); }
                  if (this.gosiExpDate) { row.push(x.GosiExpDate); }
                  if (this.saudizationCertificateExpDate) { row.push(x.SaudizationCertificateExpDate); }
                  if (this.zakathExpDate) { row.push(x.ZakathExpDate); }
                  if (this.addtionalMaterial) { row.push(x.AddtionalMaterial); }
                  if (this.waselAddress) { row.push(x.WaselAddress); }

                  // Other Data
                  if (this.Status) { row.push(x.Status); }
                  if (this.Criticality) { row.push(x.Criticality); }
                  if (this.CreatedDate) { row.push(x.CreatedDate); }
                  if (this.PushSupplierStatus) { row.push(x.PushSupplierStatus); }
                  if (this.InvitedSupplier) { row.push(x.InvitedSupplier); }

                  // Audit Details
                  if (this.StatusRemark) { row.push(x.StatusRemark); }
                  if (this.StatusComment) { row.push(x.StatusComment); }
                  if (this.IsCurrentStatus) { row.push(x.IsCurrentStatus); }
                  if (this.ActionCommand) { row.push(x.ActionCommand); }
                  if (this.AuditCreatedDate) { row.push(x.AuditCreatedDate); }
                  if (this.AuditType) { row.push(x.AuditType); }
                  if (this.AuditUserID) { row.push(x.AuditUserID); }
                  if (this.AuditUserRole) { row.push(x.AuditUserRole); }

                  if (this.TypeOfOrg && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.TypeOfOrg); }
                  if (this.manegerialCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.ManegerialCount); }
                  if (this.operationsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.OperationsCount); }
                  if (this.saudiNationalsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.SaudiNationalsCount); }
                  if (this.technicalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.TechnicalCount); }
                  if (this.totalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.TotalCount); }
                  if (this.parentCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.ParentCompany); }
                  if (this.sisterCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.SisterCompany); }
                  if (this.ownerCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.OwnerCompany); }

                  if (this.operatingProfitYear && this.user_role != 'IMI-HSEQ') { row.push(x.OperatingProfitYear); }
                  if (this.operatingProfitValue && this.user_role != 'IMI-HSEQ') { row.push(x.OperatingProfitValue); }
                  if (this.netIncomeYear && this.user_role != 'IMI-HSEQ') { row.push(x.NetIncomeYear); }
                  if (this.netIncomeValue && this.user_role != 'IMI-HSEQ') { row.push(x.NetIncomeValue); }
                  if (this.currentAssetYear && this.user_role != 'IMI-HSEQ') { row.push(x.CurrentAssetYear); }
                  if (this.currentAssetValue && this.user_role != 'IMI-HSEQ') { row.push(x.CurrentAssetValue); }
                  if (this.totalLiabilitiesYear && this.user_role != 'IMI-HSEQ') { row.push(x.TotalLiabilitiesYear); }
                  if (this.totalLiabilitiesValue && this.user_role != 'IMI-HSEQ') { row.push(x.TotalLiabilitiesValue); }
                  if (this.totalEquityYear && this.user_role != 'IMI-HSEQ') { row.push(x.TotalEquityYear); }
                  if (this.totalEquityValue && this.user_role != 'IMI-HSEQ') { row.push(x.TotalEquityValue); }

                  if (this.noOfBusinessYears && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.NoOfBusinessYears); }
                  if (this.ownsPlantEquipment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.OwnsPlantEquipment); }
                  if (this.designnCapability && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.DesignnCapability); }
                  if (this.finishedProduct && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.FinishedProduct); }
                  if (this.internalPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.InternalPolicy); }
                  if (this.registered3rdPartyBody && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.Registered3rdPartyBody); }
                  if (this.suspendedProj && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.SuspendedProj); }

                  if (this.litigation && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Litigation); }
                  if (this.compliance && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Compliance); }
                  if (this.shareholder && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Shareholder); }
                  if (this.legalAsset && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.LegalAsset); }
                  if (this.labour && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Labour); }
                  if (this.environment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Environment); }
                  if (this.imiInterested && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.ImiInterested); }

                  if (this.hse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.hse); }
                  if (this.docuHse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.docuHse); }
                  if (this.isohealth && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.isohealth); }
                  if (this.envtMgt1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.envtMgt1); }
                  if (this.dedicatedpers && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.dedicatedpers); }
                  if (this.hseName && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.hseName); }
                  if (this.hseDesig && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.hseDesig); }
                  if (this.statistic && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statistic); }
                  if (this.statisticNear && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticNear); }
                  if (this.statisticFirst && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticFirst); }
                  if (this.statisticMedical && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticMedical); }
                  if (this.statisticLost && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticLost); }
                  if (this.statisticFatal && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticFatal); }
                  if (this.statisticEnvt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticEnvt); }

                  if (this.qualityPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityPolicy); }
                  if (this.qualityMgt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityMgt); }
                  if (this.qualityMgtIso && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityMgtIso); }
                  if (this.qualityResp1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityResp1); }
                  if (this.qualityResp2 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityResp2); }
                  if (this.qualityResp3 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityResp3); }
                  if (this.qualityreviewDate && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityreviewDate); }

                  // Bank Details
                  if (this.BankCountryCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankCountryCode); }
                  if (this.BankName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankName); }
                  if (this.OtherBank && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.OtherBank); }
                  if (this.SwiftCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.SwiftCode); }
                  if (this.AccountHolderName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.AccountHolderName); }
                  if (this.AccountNumber && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.AccountNumber); }
                  if (this.BankAddress && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankAddress); }
                  if (this.BankAddress2 && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankAddress2); }
                  if (this.ibanNo && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.ibanNo); }
                  if (this.AccountCurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.AccountCurrency); }
                  if (this.Multicurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.Multicurrency); }

                  worksheet.addRow(row);
                });

                worksheet.addRow([]);

                // column size adjusted
                worksheet.columns.forEach((column) => {
                  let maxColumnLength = 0;
                  column.eachCell({ includeEmpty: true }, (cell) => {
                    maxColumnLength = Math.max(
                      maxColumnLength,
                      10,
                      cell.value ? cell.value.toString().length : 0
                    );
                  });
                  column.width = maxColumnLength + 2;
                });

                // Footer Row
                var Footer_row: number = headerresult.length + 3;
                var last_cell: number = this.selectedList.length + 1;
                let footerRow = worksheet.addRow(['Report generated date - ' + moment().format('YYYY-MM-DD')]);
                worksheet.mergeCells(Footer_row, 1, Footer_row, last_cell);

                var headerresult2 = this.Suppliers_Categories;
                let worksheet2 = workbook.addWorksheet('All Suppliers categories');
                var headertbltitles2 = ['S.No', 'Supplier Code', 'General Category', 'Sub Category', 'Detail Category'];
                let headerRow2 = worksheet2.addRow(headertbltitles2);
                headerRow2.font = { bold: true };

                // colour the header
                for (var i = 0; i < headertbltitles2.length; i++) {
                  if (headertbltitles2[i]) {
                    worksheet2.getRow(1).getCell(1).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };

                    var num: number = 0;
                    num = i + 1;
                    worksheet2.getRow(1).getCell(num).fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'cccccc' },
                      bgColor: { argb: 'd3d3d3' }
                    };
                  }
                }

                var count = 0;

                headerresult2.forEach(x => {
                  let row = [];
                  count = count + 1;
                  row.push(count);
                  row.push(x.supplierCode);
                  row.push(x.generalCategory);
                  row.push(x.subCategory);
                  row.push(x.detailCategory);
                  worksheet2.addRow(row);
                });

                worksheet2.addRow([]);

                // column size adjusted
                worksheet2.columns.forEach((column) => {
                  let maxColumnLength = 0;
                  column.eachCell({ includeEmpty: true }, (cell) => {
                    maxColumnLength = Math.max(
                      maxColumnLength,
                      10,
                      cell.value ? cell.value.toString().length : 0
                    );
                  });
                  column.width = maxColumnLength + 2;
                });

                // Generate Excel File with given name
                workbook.xlsx.writeBuffer().then((data) => {
                  let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                  fs.saveAs(blob, 'AllSuppliersDetails.xlsx');

                  this.isloading = false;
                });
              }
            });
          }
          else{
            var headerresult = this.DataToExport;
            let workbook = new Workbook();
            let worksheet = workbook.addWorksheet('All Suppliers');

            var headertbltitles = [];

            headertbltitles.push("S. No");
            headertbltitles.push('Supplier Code');
            headertbltitles.push('Supplier Details - Supplier Name (in English)');
            if (this.SupplierNameArabic) { headertbltitles.push('Supplier Details - Supplier Name (in Arabic)'); }
            if (this.EstablishmentYear) { headertbltitles.push('Supplier Details - Establishment Year'); }
            if (this.IssuedBy) { headertbltitles.push('Supplier Details - Issued By'); }
            if (this.Website) { headertbltitles.push('Supplier Details - Website'); }
            if (this.SupplierType) { headertbltitles.push('Supplier Details - Supplier Type'); }

            if (this.Country) { headertbltitles.push('Address - Country'); }
            if (this.City) { headertbltitles.push('Address - City'); }
            if (this.OtherCity) { headertbltitles.push('Address - Other City'); }
            if (this.PoBox) { headertbltitles.push('Address - PoBox'); }
            if (this.PostalCode) { headertbltitles.push('Address - Postal Code'); }
            if (this.AddressLine1) { headertbltitles.push('Address - Address Line1'); }
            if (this.AddressLine2) { headertbltitles.push('Address - Address Line2'); }

            if (this.Title) { headertbltitles.push('Contact Person - Title'); }
            if (this.FirstName) { headertbltitles.push('Contact Person - First Name'); }
            if (this.LastName) { headertbltitles.push('Contact Person - Last Name'); }
            if (this.CurrentPosition) { headertbltitles.push('Contact Person - Current Position'); }
            if (this.telNoCountryCode) { headertbltitles.push('Contact Person - Tel No CountryCode'); }
            if (this.telNo) { headertbltitles.push('Contact Person - Tel No'); }
            if (this.ext) { headertbltitles.push('Contact Person - Ext'); }
            if (this.Email) { headertbltitles.push('Contact Person - Email'); }
            if (this.mobNoCountryCode) { headertbltitles.push('Contact Person - Mob No CountryCode'); }
            if (this.mobNo) { headertbltitles.push('Contact Person - Mob No'); }
            if (this.faxNoCountryCode) { headertbltitles.push('Contact Person - Fax No CountryCode'); }
            if (this.faxNo) { headertbltitles.push('Contact Person - Fax No'); }
            if (this.hijriCalendar) { headertbltitles.push('Contact Person - Hijri Calendar'); }

            if (this.CRNo) { headertbltitles.push('Registration Details - CR No'); }
            if (this.crExpDate) { headertbltitles.push('Registration Details - CR Exp Date'); }
            if (this.VatNo) { headertbltitles.push('Registration Details - Vat No'); }
            if (this.gosiExpDate) { headertbltitles.push('Registration Details - GOSI Exp Date'); }
            if (this.saudizationCertificateExpDate) { headertbltitles.push('Registration Details - Saudization Exp Date'); }
            if (this.zakathExpDate) { headertbltitles.push('Registration Details - Zakat Exp Date'); }
            if (this.addtionalMaterial) { headertbltitles.push('Registration Details - Addtional Material'); }
            if (this.waselAddress) { headertbltitles.push('Registration Details - Wasel Address'); }

            // Other Data
            if (this.Status) { headertbltitles.push('Status'); }
            if (this.Criticality) { headertbltitles.push('Criticality'); }
            if (this.CreatedDate) { headertbltitles.push('Created Date'); }
            if (this.PushSupplierStatus) { headertbltitles.push('Push Supplier Status'); }
            if (this.InvitedSupplier) { headertbltitles.push('Invited Supplier'); }

            // Audit Details
            if (this.StatusRemark) { headertbltitles.push('Status Remark'); }
            if (this.StatusComment) { headertbltitles.push('Decision Remark'); }
            if (this.IsCurrentStatus) { headertbltitles.push('Is Current Status'); }
            if (this.ActionCommand) { headertbltitles.push('Action Command'); }
            if (this.AuditCreatedDate) { headertbltitles.push('Audit Created Date'); }
            if (this.AuditType) { headertbltitles.push('Audit Type'); }
            if (this.AuditUserID) { headertbltitles.push('Audit User ID'); }
            if (this.AuditUserRole) { headertbltitles.push('Audit User Role'); }

            if (this.TypeOfOrg && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 1. Type Of Org'); }
            if (this.manegerialCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Manegerial'); }
            if (this.operationsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Operations'); }
            if (this.saudiNationalsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Saudi Nationals'); }
            if (this.technicalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Technical'); }
            if (this.totalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 2. Total'); }
            if (this.parentCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 3. Add. of the parent company'); }
            if (this.sisterCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 4. Add. of the sister/affiliated companies'); }
            if (this.ownerCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Gen. Info. - 5. List all owners/principals’ name'); }

            if (this.operatingProfitYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 1. Operating profit - Year'); }
            if (this.operatingProfitValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 1. Operating profit - Value'); }
            if (this.netIncomeYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 2. Net income - Year'); }
            if (this.netIncomeValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 2. Net income - Value'); }
            if (this.currentAssetYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 3. Current asset - Year'); }
            if (this.currentAssetValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 3. Current asset - Value'); }
            if (this.totalLiabilitiesYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 4. Total liabilities - Year'); }
            if (this.totalLiabilitiesValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 4. Total liabilities - Value'); }
            if (this.totalEquityYear && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 5. Total equity - Year'); }
            if (this.totalEquityValue && this.user_role != 'IMI-HSEQ') { headertbltitles.push('Fin. Status - 5. Total equity - Value'); }

            if (this.noOfBusinessYears && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 1. Number of Years in the Business'); }
            if (this.ownsPlantEquipment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 2. Own the plant and equipment'); }
            if (this.designnCapability && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 3. Design capability'); }
            if (this.finishedProduct && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 4. Product/Service outsourcing'); }
            if (this.internalPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 5. Internal Written policy'); }
            if (this.registered3rdPartyBody && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 6. 3rd party certifying'); }
            if (this.suspendedProj && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Exp. & Qua. - 7. Project/Order suspened'); }

            if (this.litigation && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 1. Involved in any litigation'); }
            if (this.compliance && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 2. Internal compliance program'); }
            if (this.shareholder && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 3. offered gifts or bribes'); }
            if (this.legalAsset && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 4. financial transactions blocked'); }
            if (this.labour && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 5. convictions under labor legislation'); }
            if (this.environment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 6. convictions under environmental legislation'); }
            if (this.imiInterested && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { headertbltitles.push('Legal - 7. IMI has an interest'); }

            if (this.hse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 1. HSE written policy'); }
            if (this.docuHse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 2. HSE Management System'); }
            if (this.isohealth && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 3. ISO 45001 Certified'); }
            if (this.envtMgt1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 4. ISO 14001 Certified'); }
            if (this.dedicatedpers && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 5. person responsible for HSE?'); }
            if (this.hseName && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 5. person responsible for HSE? - Name'); }
            if (this.hseDesig && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 5. person responsible for HSE? - Designation'); }
            if (this.statistic && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics'); }
            if (this.statisticNear && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Near Miss'); }
            if (this.statisticFirst && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - First Aid Case'); }
            if (this.statisticMedical && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Medical Tre. Case'); }
            if (this.statisticLost && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Lost Time Injuries'); }
            if (this.statisticFatal && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Fatality'); }
            if (this.statisticEnvt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('HSE - 6. HSE statistics - Env. Incident'); }

            if (this.qualityPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 1. Quality written policy'); }
            if (this.qualityMgt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 2. Quality Management System'); }
            if (this.qualityMgtIso && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 3. Certified to ISO 9001:2015'); }
            if (this.qualityResp1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 4. Person responsible for Quality'); }
            if (this.qualityResp2 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 4. Person responsible for Quality - Name'); }
            if (this.qualityResp3 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 4. Person responsible for Quality - Designation'); }
            if (this.qualityreviewDate && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { headertbltitles.push('Quality - 5. QMS Audit date'); }

            // Bank Details
            if (this.BankCountryCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Country Code'); }
            if (this.BankName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Name'); }
            if (this.OtherBank && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Other Bank'); }
            if (this.SwiftCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - BIC/SWIFT Code'); }
            if (this.AccountHolderName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Acc. Holder Name'); }
            if (this.AccountNumber && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Acc. Number'); }
            if (this.BankAddress && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Add. Line1'); }
            if (this.BankAddress2 && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Bank Add. Line2'); }
            if (this.ibanNo && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - IBAN No'); }
            if (this.AccountCurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Acc. Currency'); }
            if (this.Multicurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { headertbltitles.push('Bank info. - Multicurrency'); }

            let headerRow = worksheet.addRow(headertbltitles);
            headerRow.font = { bold: true };

            // colour the header
            for (var i = 0; i < this.selectedList.length; i++) {
              if (this.selectedList[i]) {
                worksheet.getRow(1).getCell(1).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'cccccc' },
                  bgColor: { argb: 'd3d3d3' }
                };

                worksheet.getRow(1).getCell(2).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'cccccc' },
                  bgColor: { argb: 'd3d3d3' }
                };

                worksheet.getRow(1).getCell(3).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'cccccc' },
                  bgColor: { argb: 'd3d3d3' }
                };

                var num: number = 0;
                num = i + 4;
                worksheet.getRow(1).getCell(num).fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'cccccc' },
                  bgColor: { argb: 'd3d3d3' }
                };
              }
            }

            headerresult.forEach(x => {
              let row = [];
              row.push(x.Id);

              row.push(x.SupplierCode);
              row.push(x.SupplierName);
              if (this.SupplierNameArabic) { row.push(x.SupplierNameArabic); }
              if (this.EstablishmentYear) { row.push(x.EstablishmentYear); }
              if (this.IssuedBy) { row.push(x.IssuedBy); }
              if (this.Website) { row.push(x.Website); }
              if (this.SupplierType) { row.push(x.SupplierType); }

              if (this.Country) { row.push(x.Country); }
              if (this.City) { row.push(x.City); }
              if (this.OtherCity) { row.push(x.OtherCity); }
              if (this.PoBox) { row.push(x.PoBox); }
              if (this.PostalCode) { row.push(x.PostalCode); }
              if (this.AddressLine1) { row.push(x.AddressLine1); }
              if (this.AddressLine2) { row.push(x.AddressLine2); }

              if (this.Title) { row.push(x.Title); }
              if (this.FirstName) { row.push(x.FirstName); }
              if (this.LastName) { row.push(x.LastName); }
              if (this.CurrentPosition) { row.push(x.CurrentPosition); }
              if (this.telNoCountryCode) { row.push(x.TelNoCountryCode); }
              if (this.telNo) { row.push(x.TelNo); }
              if (this.ext) { row.push(x.Ext); }
              if (this.Email) { row.push(x.Email); }
              if (this.mobNoCountryCode) { row.push(x.MobNoCountryCode); }
              if (this.mobNo) { row.push(x.MobNo); }
              if (this.faxNoCountryCode) { row.push(x.FaxNoCountryCode); }
              if (this.faxNo) { row.push(x.FaxNo); }
              if (this.hijriCalendar) { row.push(x.HijriCalendar); }

              if (this.CRNo) { row.push(x.CRNo); }
              if (this.crExpDate) { row.push(x.CrExpDate); }
              if (this.VatNo) { row.push(x.VatNo); }
              // if (this.regDate) { row.push(x.RegDate); }
              if (this.gosiExpDate) { row.push(x.GosiExpDate); }
              if (this.saudizationCertificateExpDate) { row.push(x.SaudizationCertificateExpDate); }
              if (this.zakathExpDate) { row.push(x.ZakathExpDate); }
              if (this.addtionalMaterial) { row.push(x.AddtionalMaterial); }
              if (this.waselAddress) { row.push(x.WaselAddress); }

              // Other Data
              if (this.Status) { row.push(x.Status); }
              if (this.Criticality) { row.push(x.Criticality); }
              if (this.CreatedDate) { row.push(x.CreatedDate); }
              if (this.PushSupplierStatus) { row.push(x.PushSupplierStatus); }
              if (this.InvitedSupplier) { row.push(x.InvitedSupplier); }

              // Audit Details
              if (this.StatusRemark) { row.push(x.StatusRemark); }
              if (this.StatusComment) { row.push(x.StatusComment); }
              if (this.IsCurrentStatus) { row.push(x.IsCurrentStatus); }
              if (this.ActionCommand) { row.push(x.ActionCommand); }
              if (this.AuditCreatedDate) { row.push(x.AuditCreatedDate); }
              if (this.AuditType) { row.push(x.AuditType); }
              if (this.AuditUserID) { row.push(x.AuditUserID); }
              if (this.AuditUserRole) { row.push(x.AuditUserRole); }

              if (this.TypeOfOrg && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.TypeOfOrg); }
              if (this.manegerialCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.ManegerialCount); }
              if (this.operationsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.OperationsCount); }
              if (this.saudiNationalsCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.SaudiNationalsCount); }
              if (this.technicalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.TechnicalCount); }
              if (this.totalCount && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.TotalCount); }
              if (this.parentCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.ParentCompany); }
              if (this.sisterCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.SisterCompany); }
              if (this.ownerCompany && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.OwnerCompany); }

              if (this.operatingProfitYear && this.user_role != 'IMI-HSEQ') { row.push(x.OperatingProfitYear); }
              if (this.operatingProfitValue && this.user_role != 'IMI-HSEQ') { row.push(x.OperatingProfitValue); }
              if (this.netIncomeYear && this.user_role != 'IMI-HSEQ') { row.push(x.NetIncomeYear); }
              if (this.netIncomeValue && this.user_role != 'IMI-HSEQ') { row.push(x.NetIncomeValue); }
              if (this.currentAssetYear && this.user_role != 'IMI-HSEQ') { row.push(x.CurrentAssetYear); }
              if (this.currentAssetValue && this.user_role != 'IMI-HSEQ') { row.push(x.CurrentAssetValue); }
              if (this.totalLiabilitiesYear && this.user_role != 'IMI-HSEQ') { row.push(x.TotalLiabilitiesYear); }
              if (this.totalLiabilitiesValue && this.user_role != 'IMI-HSEQ') { row.push(x.TotalLiabilitiesValue); }
              if (this.totalEquityYear && this.user_role != 'IMI-HSEQ') { row.push(x.TotalEquityYear); }
              if (this.totalEquityValue && this.user_role != 'IMI-HSEQ') { row.push(x.TotalEquityValue); }

              if (this.noOfBusinessYears && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.NoOfBusinessYears); }
              if (this.ownsPlantEquipment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.OwnsPlantEquipment); }
              if (this.designnCapability && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.DesignnCapability); }
              if (this.finishedProduct && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.FinishedProduct); }
              if (this.internalPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.InternalPolicy); }
              if (this.registered3rdPartyBody && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.Registered3rdPartyBody); }
              if (this.suspendedProj && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.SuspendedProj); }

              if (this.litigation && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Litigation); }
              if (this.compliance && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Compliance); }
              if (this.shareholder && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Shareholder); }
              if (this.legalAsset && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.LegalAsset); }
              if (this.labour && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Labour); }
              if (this.environment && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.Environment); }
              if (this.imiInterested && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP')) { row.push(x.ImiInterested); }

              if (this.hse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.hse); }
              if (this.docuHse && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.docuHse); }
              if (this.isohealth && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.isohealth); }
              if (this.envtMgt1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.envtMgt1); }
              if (this.dedicatedpers && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.dedicatedpers); }
              if (this.hseName && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.hseName); }
              if (this.hseDesig && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.hseDesig); }
              if (this.statistic && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statistic); }
              if (this.statisticNear && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticNear); }
              if (this.statisticFirst && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticFirst); }
              if (this.statisticMedical && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticMedical); }
              if (this.statisticLost && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticLost); }
              if (this.statisticFatal && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticFatal); }
              if (this.statisticEnvt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.statisticEnvt); }

              if (this.qualityPolicy && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityPolicy); }
              if (this.qualityMgt && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityMgt); }
              if (this.qualityMgtIso && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityMgtIso); }
              if (this.qualityResp1 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityResp1); }
              if (this.qualityResp2 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityResp2); }
              if (this.qualityResp3 && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityResp3); }
              if (this.qualityreviewDate && (this.user_role == 'Admin' || this.user_role == 'IMI-SRM Analyst' || this.user_role == 'IMI-GM' || this.user_role == 'IMI-VP' || this.user_role == 'IMI-HSEQ')) { row.push(x.qualityreviewDate); }

              // Bank Details
              if (this.BankCountryCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankCountryCode); }
              if (this.BankName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankName); }
              if (this.OtherBank && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.OtherBank); }
              if (this.SwiftCode && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.SwiftCode); }
              if (this.AccountHolderName && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.AccountHolderName); }
              if (this.AccountNumber && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.AccountNumber); }
              if (this.BankAddress && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankAddress); }
              if (this.BankAddress2 && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.BankAddress2); }
              if (this.ibanNo && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.ibanNo); }
              if (this.AccountCurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.AccountCurrency); }
              if (this.Multicurrency && (this.user_role == 'Admin' || this.user_role == 'IMI-Treasury Bank Reviewer' || this.user_role == 'IMI-Treasury Bank Approver')) { row.push(x.Multicurrency); }

              worksheet.addRow(row);
            });

            worksheet.addRow([]);

            // column size adjusted
            worksheet.columns.forEach((column) => {
              let maxColumnLength = 0;
              column.eachCell({ includeEmpty: true }, (cell) => {
                maxColumnLength = Math.max(
                  maxColumnLength,
                  10,
                  cell.value ? cell.value.toString().length : 0
                );
              });
              column.width = maxColumnLength + 2;
            });

            // Footer Row
            var Footer_row: number = headerresult.length + 3;
            var last_cell: number = this.selectedList.length + 1;
            let footerRow = worksheet.addRow(['Report generated date - ' + moment().format('YYYY-MM-DD')]);
            worksheet.mergeCells(Footer_row, 1, Footer_row, last_cell);     

            // Generate Excel File with given name
            workbook.xlsx.writeBuffer().then((data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, 'AllSuppliersDetails.xlsx');

              this.isloading = false;
            });
          }
        }
      }
      else {
        this.iserror = true;
      }
    }
    else {
      this.iserror = true;
    }
  }

  // Select columns to export in excel
  selectedValue() {
    this.SupplierNameArabic = false;
    this.EstablishmentYear = false;
    this.IssuedBy = false;
    this.Website = false;
    this.SupplierType = false;

    this.Country = false;
    this.City = false;
    this.OtherCity = false;
    this.PoBox = false;
    this.PostalCode = false;
    this.AddressLine1 = false;
    this.AddressLine2 = false;

    this.Title = false;
    this.FirstName = false;
    this.LastName = false;
    this.CurrentPosition = false;
    this.telNoCountryCode = false;
    this.telNo = false;
    this.ext = false;
    this.Email = false;
    this.mobNoCountryCode = false;
    this.mobNo = false;
    this.faxNoCountryCode = false;
    this.faxNo = false;
    this.hijriCalendar = false;

    this.CRNo = false;
    this.crExpDate = false;
    this.VatNo = false;
    // this.regDate = false;
    // this.gosiCertificate = false;
    this.gosiExpDate = false;
    this.saudizationCertificateExpDate = false;
    this.zakathExpDate = false;
    this.addtionalMaterial = false;
    this.waselAddress = false;

    // Profile data - General
    this.TypeOfOrg = false;
    this.manegerialCount = false;
    this.technicalCount = false;
    this.operationsCount = false;
    this.saudiNationalsCount = false;
    this.totalCount = false;
    this.parentCompany = false;
    this.sisterCompany = false;
    this.ownerCompany = false;

    // Profile data - Financial
    this.operatingProfitYear = false;
    this.operatingProfitValue = false;
    this.netIncomeYear = false;
    this.netIncomeValue = false;
    this.currentAssetYear = false;
    this.currentAssetValue = false;
    this.totalLiabilitiesYear = false;
    this.totalLiabilitiesValue = false;
    this.totalEquityYear = false;
    this.totalEquityValue = false;

    // Profile data - Experience
    this.noOfBusinessYears = false;
    this.ownsPlantEquipment = false;
    this.designnCapability = false;
    this.finishedProduct = false;
    this.internalPolicy = false;
    this.registered3rdPartyBody = false;
    this.suspendedProj = false;

    // Profile data - Legal
    this.litigation = false;
    this.compliance = false;
    this.shareholder = false;
    this.legalAsset = false;
    this.labour = false;
    this.environment = false;
    this.imiInterested = false;

    // Profile data - Health
    this.hse = false;
    this.docuHse = false;
    this.isohealth = false;
    this.envtMgt1 = false;
    this.dedicatedpers = false;
    this.hseName = false;
    this.hseDesig = false;
    this.statistic = false;
    this.statisticNear = false;
    this.statisticFirst = false;
    this.statisticMedical = false;
    this.statisticLost = false;
    this.statisticFatal = false;
    this.statisticEnvt = false;

    // Profile data - Quality
    this.qualityPolicy = false;
    this.qualityMgt = false;
    this.qualityMgtIso = false;
    this.qualityResp1 = false;
    this.qualityResp2 = false;
    this.qualityResp3 = false;
    this.qualityreviewDate = false;

    // Bank Details
    this.AccountCurrency = false;
    this.AccountHolderName = false;
    this.AccountNumber = false;
    this.BankAddress = false;
    this.BankAddress2 = false;
    this.BankCountryCode = false;
    this.BankName = false;
    this.Multicurrency = false;
    this.OtherBank = false;
    this.SwiftCode = false;
    this.ibanNo = false;

    // Audit Details
    this.StatusRemark = false;
    this.StatusComment = false;
    this.IsCurrentStatus = false;
    this.ActionCommand = false;
    this.AuditCreatedDate = false;
    this.AuditUserID = false;
    this.AuditUserRole = false;

    // Other data
    this.Status = false;
    this.Criticality = false;
    this.CreatedDate = false;
    this.PushSupplierStatus = false;
    this.InvitedSupplier = false;
    this.AuditType = false;

    for (var i = 0; i < this.selectedList.length; i++) {
      if (this.selectedList[i].val == "SupplierNameArabic") {
        this.SupplierNameArabic = true;
      }
      if (this.selectedList[i].val == "EstablishmentYear") {
        this.EstablishmentYear = true;
      }
      if (this.selectedList[i].val == "IssuedBy") {
        this.IssuedBy = true;
      }
      if (this.selectedList[i].val == "Website") {
        this.Website = true;
      }
      if (this.selectedList[i].val == "SupplierType") {
        this.SupplierType = true;
      }

      if (this.selectedList[i].val == "Country") {
        this.Country = true;
      }
      if (this.selectedList[i].val == "City") {
        this.City = true;
      }
      if (this.selectedList[i].val == "OtherCity") {
        this.OtherCity = true;
      }
      if (this.selectedList[i].val == "PoBox") {
        this.PoBox = true;
      }
      if (this.selectedList[i].val == "PostalCode") {
        this.PostalCode = true;
      }
      if (this.selectedList[i].val == "AddressLine1") {
        this.AddressLine1 = true;
      }
      if (this.selectedList[i].val == "AddressLine2") {
        this.AddressLine2 = true;
      }

      if (this.selectedList[i].val == "Title") {
        this.Title = true;
      }
      if (this.selectedList[i].val == "FirstName") {
        this.FirstName = true;
      }
      if (this.selectedList[i].val == "LastName") {
        this.LastName = true;
      }
      if (this.selectedList[i].val == "CurrentPosition") {
        this.CurrentPosition = true;
      }
      if (this.selectedList[i].val == "TelNoCountryCode") {
        this.telNoCountryCode = true;
      }
      if (this.selectedList[i].val == "TelNo") {
        this.telNo = true;
      }
      if (this.selectedList[i].val == "Ext") {
        this.ext = true;
      }
      if (this.selectedList[i].val == "Email") {
        this.Email = true;
      }
      if (this.selectedList[i].val == "MobNoCountryCode") {
        this.mobNoCountryCode = true;
      }
      if (this.selectedList[i].val == "MobNo") {
        this.mobNo = true;
      }
      if (this.selectedList[i].val == "FaxNoCountryCode") {
        this.faxNoCountryCode = true;
      }
      if (this.selectedList[i].val == "FaxNo") {
        this.faxNo = true;
      }
      if (this.selectedList[i].val == "HijriCalendar") {
        this.hijriCalendar = true;
      }

      if (this.selectedList[i].val == "CRNo") {
        this.CRNo = true;
      }
      if (this.selectedList[i].val == "CrExpDate") {
        this.crExpDate = true;
      }
      if (this.selectedList[i].val == "VatNo") {
        this.VatNo = true;
      }
      // if (this.selectedList[i].val == "RegDate") {
      //   this.regDate = true;
      // }
      if (this.selectedList[i].val == "GosiExpDate") {
        this.gosiExpDate = true;
      }
      if (this.selectedList[i].val == "SaudizationCertificateExpDate") {
        this.saudizationCertificateExpDate = true;
      }
      if (this.selectedList[i].val == "ZakathExpDate") {
        this.zakathExpDate = true;
      }
      if (this.selectedList[i].val == "AddtionalMaterial") {
        this.addtionalMaterial = true;
      }
      if (this.selectedList[i].val == "WaselAddress") {
        this.waselAddress = true;
      }

      if (this.selectedList[i].val == "TypeOfOrg") {
        this.TypeOfOrg = true;
      }
      if (this.selectedList[i].val == "ManegerialCount") {
        this.manegerialCount = true;
      }
      if (this.selectedList[i].val == "OperationsCount") {
        this.operationsCount = true;
      }
      if (this.selectedList[i].val == "SaudiNationalsCount") {
        this.saudiNationalsCount = true;
      }
      if (this.selectedList[i].val == "TechnicalCount") {
        this.technicalCount = true;
      }
      if (this.selectedList[i].val == "TotalCount") {
        this.totalCount = true;
      }
      if (this.selectedList[i].val == "ParentCompany") {
        this.parentCompany = true;
      }
      if (this.selectedList[i].val == "SisterCompany") {
        this.sisterCompany = true;
      }
      if (this.selectedList[i].val == "OwnerCompany") {
        this.ownerCompany = true;
      }

      if (this.selectedList[i].val == "OperatingProfitYear") {
        this.operatingProfitYear = true;
      }
      if (this.selectedList[i].val == "OperatingProfitValue") {
        this.operatingProfitValue = true;
      }
      if (this.selectedList[i].val == "NetIncomeYear") {
        this.netIncomeYear = true;
      }
      if (this.selectedList[i].val == "NetIncomeValue") {
        this.netIncomeValue = true;
      }
      if (this.selectedList[i].val == "CurrentAssetYear") {
        this.currentAssetYear = true;
      }
      if (this.selectedList[i].val == "CurrentAssetValue") {
        this.currentAssetValue = true;
      }
      if (this.selectedList[i].val == "TotalLiabilitiesYear") {
        this.totalLiabilitiesYear = true;
      }
      if (this.selectedList[i].val == "TotalLiabilitiesValue") {
        this.totalLiabilitiesValue = true;
      }
      if (this.selectedList[i].val == "TotalEquityYear") {
        this.totalEquityYear = true;
      }
      if (this.selectedList[i].val == "TotalEquityValue") {
        this.totalEquityValue = true;
      }

      if (this.selectedList[i].val == "NoOfBusinessYears") {
        this.noOfBusinessYears = true;
      }
      if (this.selectedList[i].val == "OwnsPlantEquipment") {
        this.ownsPlantEquipment = true;
      }
      if (this.selectedList[i].val == "DesignnCapability") {
        this.designnCapability = true;
      }
      if (this.selectedList[i].val == "FinishedProduct") {
        this.finishedProduct = true;
      }
      if (this.selectedList[i].val == "InternalPolicy") {
        this.internalPolicy = true;
      }
      if (this.selectedList[i].val == "Registered3rdPartyBody") {
        this.registered3rdPartyBody = true;
      }
      if (this.selectedList[i].val == "SuspendedProj") {
        this.suspendedProj = true;
      }

      if (this.selectedList[i].val == "Litigation") {
        this.litigation = true;
      }
      if (this.selectedList[i].val == "Compliance") {
        this.compliance = true;
      }
      if (this.selectedList[i].val == "Shareholder") {
        this.shareholder = true;
      }
      if (this.selectedList[i].val == "LegalAsset") {
        this.legalAsset = true;
      }
      if (this.selectedList[i].val == "Labour") {
        this.labour = true;
      }
      if (this.selectedList[i].val == "Environment") {
        this.environment = true;
      }
      if (this.selectedList[i].val == "ImiInterested") {
        this.imiInterested = true;
      }

      if (this.selectedList[i].val == "hse") {
        this.hse = true;
      }
      if (this.selectedList[i].val == "docuHse") {
        this.docuHse = true;
      }
      if (this.selectedList[i].val == "isohealth") {
        this.isohealth = true;
      }
      if (this.selectedList[i].val == "envtMgt1") {
        this.envtMgt1 = true;
      }
      if (this.selectedList[i].val == "dedicatedpers") {
        this.dedicatedpers = true;
      }
      if (this.selectedList[i].val == "hseName") {
        this.hseName = true;
      }
      if (this.selectedList[i].val == "hseDesig") {
        this.hseDesig = true;
      }
      if (this.selectedList[i].val == "statistic") {
        this.statistic = true;
      }
      if (this.selectedList[i].val == "statisticNear") {
        this.statisticNear = true;
      }
      if (this.selectedList[i].val == "statisticFirst") {
        this.statisticFirst = true;
      }
      if (this.selectedList[i].val == "statisticMedical") {
        this.statisticMedical = true;
      }
      if (this.selectedList[i].val == "statisticLost") {
        this.statisticLost = true;
      }
      if (this.selectedList[i].val == "statisticFatal") {
        this.statisticFatal = true;
      }
      if (this.selectedList[i].val == "statisticEnvt") {
        this.statisticEnvt = true;
      }

      if (this.selectedList[i].val == "qualityPolicy") {
        this.qualityPolicy = true;
      }
      if (this.selectedList[i].val == "qualityMgt") {
        this.qualityMgt = true;
      }
      if (this.selectedList[i].val == "qualityMgtIso") {
        this.qualityMgtIso = true;
      }
      if (this.selectedList[i].val == "qualityResp1") {
        this.qualityResp1 = true;
      }
      if (this.selectedList[i].val == "qualityResp2") {
        this.qualityResp2 = true;
      }
      if (this.selectedList[i].val == "qualityResp3") {
        this.qualityResp3 = true;
      }
      if (this.selectedList[i].val == "qualityreviewDate") {
        this.qualityreviewDate = true;
      }

      // Bank Details
      if (this.selectedList[i].val == "AccountCurrency") {
        this.AccountCurrency = true;
      }
      if (this.selectedList[i].val == "AccountHolderName") {
        this.AccountHolderName = true;
      }
      if (this.selectedList[i].val == "AccountNumber") {
        this.AccountNumber = true;
      }
      if (this.selectedList[i].val == "BankAddress") {
        this.BankAddress = true;
      }
      if (this.selectedList[i].val == "BankAddress2") {
        this.BankAddress2 = true;
      }
      if (this.selectedList[i].val == "BankCountryCode") {
        this.BankCountryCode = true;
      }
      if (this.selectedList[i].val == "BankName") {
        this.BankName = true;
      }
      if (this.selectedList[i].val == "Multicurrency") {
        this.Multicurrency = true;
      }
      if (this.selectedList[i].val == "OtherBank") {
        this.OtherBank = true;
      }
      if (this.selectedList[i].val == "SwiftCode") {
        this.SwiftCode = true;
      }
      if (this.selectedList[i].val == "ibanNo") {
        this.ibanNo = true;
      }

      // Audit Details
      if (this.selectedList[i].val == "StatusRemark") {
        this.StatusRemark = true;
      }
      if (this.selectedList[i].val == "StatusComment") {
        this.StatusComment = true;
      }
      if (this.selectedList[i].val == "IsCurrentStatus") {
        this.IsCurrentStatus = true;
      }
      if (this.selectedList[i].val == "ActionCommand") {
        this.ActionCommand = true;
      }
      if (this.selectedList[i].val == "AuditCreatedDate") {
        this.AuditCreatedDate = true;
      }
      if (this.selectedList[i].val == "AuditUserID") {
        this.AuditUserID = true;
      }
      if (this.selectedList[i].val == "AuditUserRole") {
        this.AuditUserRole = true;
      }

      // Other related date
      if (this.selectedList[i].val == "Status") {
        this.Status = true;
      }
      if (this.selectedList[i].val == "Criticality") {
        this.Criticality = true;
      }
      if (this.selectedList[i].val == "CreatedDate") {
        this.CreatedDate = true;
      }
      if (this.selectedList[i].val == "PushSupplierStatus") {
        this.PushSupplierStatus = true;
      }
      if (this.selectedList[i].val == "InvitedSupplier") {
        this.InvitedSupplier = true;
      }
      if (this.selectedList[i].val == "AuditType") {
        this.AuditType = true;
      }
    }
  }

  // Select all option in the dropdown
  toggleAllSelection() {
    for (var i = 0; i < this.DropdownList.length; i++) {
      this.DropdownList[i].completed = this.allSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.allSelected = this.DropdownList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList() {
    this.checkedList = [];
    this.selectedList = [];
    for (var i = 0; i < this.DropdownList.length; i++) {
      if (this.DropdownList[i].completed)
        this.checkedList.push(this.DropdownList[i]);
    }
    this.selectedList = this.checkedList;
    this.checkedList = JSON.stringify(this.checkedList);
  }

  // Set min and max date selection to created date
  selectedDate(type, event) {
    if (type == "createddatefrom") {
      if (event.value != null) { this.minCreatedDate = moment(event.value).format('YYYY-MM-DD'); }
      else { this.minCreatedDate = null; }
    }
    else if (type == "createddateto") {
      if (event.value != null) { this.maxCreatedDate = moment(event.value).format('YYYY-MM-DD'); }
      else { this.maxCreatedDate = null; }
    }
    else if (type == "auditcreateddatefrom") {
      if (event.value != null) { this.minAuditDate = moment(event.value).format('YYYY-MM-DD'); }
      else { this.minAuditDate = null; }
    }
    else if (type == "auditcreateddateto") {
      if (event.value != null) { this.maxAuditDate = moment(event.value).format('YYYY-MM-DD'); }
      else { this.maxAuditDate = null; }
    }
  }
}
