using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SupplierAuditDto
    {
        //Supplier Details
        public int SupplierID { get; set; }
        public string SupplierCode { get; set; }
        public string SupplierName { get; set; }
        public string SupplierNameArabic { get; set; }
        public int EstablishmentYear { get; set; }
        public string IssuedBy { get; set; }
        public string Website { get; set; }
        public string SupplierType { get; set; }


        public string Country { get; set; }
        public string City { get; set; }
        public string OtherCity { get; set; }
        public string PoBox { get; set; }
        public string PostalCode { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }

        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CurrentPosition { get; set; }
        public string TelphoneCountryCode { get; set; }
        public string TelephoneNo { get; set; }
        public int Extension { get; set; }
        public string Email { get; set; }
        public string MobileCountryCode { get; set; }
        public string MobileNo { get; set; }
        public string FaxCountryCode { get; set; }
        public string FaxNo { get; set; }
        public string HijriSelected { get; set; }
        
        public string CRNo { get; set; }
        public string CRexpDate { get; set; }
        public string RegDate { get; set; }
        public string VatNo { get; set; }
        public string? GosiDate { get; set; }
        public string? GosiCertificate { get; set; }
        public string? SaudiDate { get; set; }
        public string? ZakathDate { get; set; }

        public string AdditionalMaterial { get; set; }
        public string WaselAddress { get; set; }
        public SupplierCategoryDto[] supplierCategories { get; set; }


        // Profile Details
        public string TypeOfOrg { get; set; }
        public int ManagerialCount { get; set; }
        public int TechnicalCount { get; set; }
        public int OperationsCount { get; set; }
        public int SaudiNationalsCount { get; set; }
        public int TotalCount { get; set; }
        public string ParentCompany { get; set; }
        public string SisterCompany { get; set; }
        public string OwnerCompany { get; set; }

        public int? OperatingProfit1 { get; set; }
        public string? OperatingProfit2 { get; set; }
        public int? NetIncome1 { get; set; }
        public string? NetIncome2 { get; set; }
        public int? CurrentAsset1 { get; set; }
        public string? CurrentAsset2 { get; set; }
        public int TotalLiable1 { get; set; }
        public string TotalLiable2 { get; set; }
        public int TotalEquity1 { get; set; }
        public string TotalEquity2 { get; set; }
        public int NoOfYears { get; set; }

        public string OwnsPlantEquip { get; set; }
        public string DesignnCap { get; set; }
        public string FinishProd { get; set; }
        public string InternalPolicy { get; set; }
        public string registeredOrg { get; set; }
        public string suspendedProj1 { get; set; }
        public string suspendedProj2 { get; set; }

        public string litigation1 { get; set; }
        public string litigation2 { get; set; }
        public string compliance1 { get; set; }
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
        public string docuHse { get; set; }
        public string isohealth { get; set; }
        public string envtMgt1 { get; set; }
        public string dedicatedpers { get; set; }
        public string hseName { get; set; }
        public string hseDesig { get; set; }
        public string statistic { get; set; }
        public string statisticNear { get; set; }
        public string statisticFirst { get; set; }
        public string statisticMedical { get; set; }
        public string statisticLost { get; set; }
        public string statisticFatal { get; set; }
        public string statisticEnvt { get; set; }

        public string qualityPolicy1 { get; set; }
        public string qualityMgt { get; set; }
        public string qualityMgtIso { get; set; }
        public string qualityResp1 { get; set; }
        public string qualityResp2 { get; set; }
        public string qualityResp3 { get; set; }
        public string qualityreviewDate { get; set; }
        public int? revisionNo { get; set; }
     
        public string CreatedDate { get; set; }
        public string? Status { get; set; }
        public string? Criticality { get; set; }
        public string? PushedSupplierStatus { get; set; }
        public string? InvitedSupplier { get; set; }

        // Bank Data
        public string BankCountryCode { get; set; }
        public string BankName { get; set; }
        public string? OtherBank { get; set; }
        public string? BicCode { get; set; }
        public string AccountHolderName { get; set; }
        public string? AccountNumber { get; set; }
        public string ibanNo { get; set; }
        public string BankAddress { get; set; }
        public string? BankAddress2 { get; set; }
        public string? AccountCurrency { get; set; }
        public string? Multicurrency { get; set; }

        // Audit Data
        public string? StatusRemark { get; set; }
        public string? StatusComment { get; set; }
        public string? IsCurrentStatus { get; set; }
        public string ActionCommand { get; set; }
        public string AuditCreatedDate { get; set; }
        public string AuditUserID { get; set; }
        public string AuditUserRole { get; set; }

        public string? AuditType { get; set; }
    }
}