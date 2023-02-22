using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SupplierWorkflowDto
    {
        public string supplier_id { get; set; }
        public string supplier_name { get; set; }
        public string email { get; set; }
        public string supplier_name_arabic { get; set; }
        public string establishment_year { get; set; }
        public string issued_by { get; set; }
        public string web_site { get; set; }
        public string supplier_type { get; set; }
        public string country { get; set; }
        public string city { get; set; }
        public string other_city { get; set; }
        public string po_box { get; set; }
        public string postal_code { get; set; }
        public string address_line1 { get; set; }
        public string address_line2 { get; set; }
        public string title { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string telphone_country_code { get; set; }
        public string telephone_no { get; set; }
        public string extension { get; set; }
        public string position { get; set; }
        public string mobile_country_code { get; set; }
        public string mobile_no { get; set; }
        public string fax_country_code { get; set; }
        public string fax_no { get; set; }
        public string additional_material { get; set; }
        public string cr_no { get; set; }
        public string vat_no { get; set; }
        public string gosi_certificate { get; set; }
        public string parentcompany { get; set; }
        public string sistercompany { get; set; }
        public string ownercompany { get; set; }
        public string operatingProfit1 { get; set; }
        public string operatingProfit2 { get; set; }
        public string netIncome1 { get; set; }
        public string netIncome2 { get; set; }
        public string currentAsset1 { get; set; }
        public string currentAsset2 { get; set; }
        public string totalLiable1 { get; set; }
        public string totalLiable2 { get; set; }
        public string totalEquity1 { get; set; }
        public string totalEquity2 { get; set; }
        public string noOfYears { get; set; }
        public string ownsPlantEquip { get; set; }
        public string designnCap { get; set; }
        public string finishProd { get; set; }
        public string internalPolicy { get; set; }
        public string registeredOrg { get; set; }
        public string suspendedProj1 { get; set; }
        public string suspendedProj2 { get; set; }
        public string litigation1 { get; set; }
        public string litigation2 { get; set; }
        public string compliance1 { get; set; }
        public string compliance2 { get; set; }
        public string shareholder1 { get; set; }
        public string shareholder2 { get; set; }
        public string labour1 { get; set; }
        public string labour2 { get; set; }
        public string legalAsset1 { get; set; }
        public string legalAsset2 { get; set; }
        public string environment1 { get; set; }
        public string environment2 { get; set; }
        public string imiInterested1 { get; set; }
        public string imiInterested2 { get; set; }
        public string hse1 { get; set; }
        public string hse2 { get; set; }
        public string docuHse { get; set; }
        public string isohealth { get; set; }
        public string envtMgt1 { get; set; }
        public string envtMgt2 { get; set; }
        public string dedicatedpers { get; set; }
        public string statistic { get; set; }
        public string qualityPolicy1 { get; set; }
        public string qualityPolicy2 { get; set; }
        public string qualityMgt { get; set; }
        public string qualityResp1 { get; set; }
        public string qualityResp2 { get; set; }
        public string qualityreviewDate { get; set; }
        public string typeOfOrganization { get; set; }
        public string managerialno { get; set; }
        public string technicalno { get; set; }
        public string operationsno { get; set; }
        public string saudiNationalsno { get; set; }
        public string totallno { get; set; }
        public string hijriSelected { get; set; }
        public string bankCountryCodes { get; set; }
        public string bankName { get; set; }
        public string swiftcode { get; set; }
        public string accountHolderName { get; set; }
        public string ibanNo { get; set; }
        public string bankAddress { get; set; }
        public string accountCurrency { get; set; }
        public string account_number { get; set; }
        public string isEmergencySupplier { get; set; }
        public SupplierCategoryDto[] supplierCategories { get; set; }
        public string? bankWorkflowDocId { get; set; }
        public string? bankProcessId { get; set; }
    }
}
