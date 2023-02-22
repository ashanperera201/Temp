using Microsoft.Extensions.Configuration;
using SRMDomain.Data.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data
{
    public class WorkflowData : IWorkflowData
    {
        private readonly string _connectionString;
        private IConfiguration configuration;

        public WorkflowData(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("defaultConnection");

        public async Task<SupplierWorkflowDto> GetApprovalWorkFlow(string supplierId)
        {
            const string spName = "dbo.Isp_GetApprovalWorkflow";
            SupplierWorkflowDto supplierworkflow = new SupplierWorkflowDto();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                supplierworkflow.supplier_name = reader["supplier_name"].ToString();
                                supplierworkflow.email = reader["email"].ToString();
                                supplierworkflow.supplier_name_arabic = reader["supplier_name_arabic"].ToString();
                                supplierworkflow.establishment_year = reader["establishment_year"].ToString();
                                supplierworkflow.issued_by = reader["issued_by"].ToString();
                                supplierworkflow.web_site = reader["web_site"].ToString();
                                supplierworkflow.supplier_type = reader["supplier_type"].ToString();
                                supplierworkflow.country = reader["country"].ToString();
                                supplierworkflow.city = reader["city"].ToString();
                                supplierworkflow.other_city = reader["other_city"].ToString();
                                supplierworkflow.po_box = reader["po_box"].ToString();
                                supplierworkflow.postal_code = reader["postal_code"].ToString();
                                supplierworkflow.address_line1 = reader["address_line1"].ToString();
                                supplierworkflow.address_line2 = reader["address_line2"].ToString();
                                supplierworkflow.title = reader["title"].ToString();
                                supplierworkflow.first_name = reader["first_name"].ToString();
                                supplierworkflow.last_name = reader["last_name"].ToString();
                                supplierworkflow.telphone_country_code = reader["telphone_country_code"].ToString();
                                supplierworkflow.telephone_no = reader["telephone_no"].ToString();
                                supplierworkflow.extension = reader["extension"].ToString();
                                supplierworkflow.position = reader["position"].ToString();
                                supplierworkflow.mobile_country_code = reader["mobile_country_code"].ToString();
                                supplierworkflow.mobile_no = reader["mobile_no"].ToString();
                                supplierworkflow.fax_country_code = reader["fax_country_code"].ToString();
                                supplierworkflow.fax_no = reader["fax_no"].ToString();
                                supplierworkflow.additional_material = reader["additional_material"].ToString();
                                supplierworkflow.cr_no = reader["cr_no"].ToString();
                                supplierworkflow.vat_no = reader["vat_no"].ToString();
                                supplierworkflow.gosi_certificate = reader["gosi_certificate"].ToString();
                                supplierworkflow.parentcompany = reader["parentcompany"].ToString();
                                supplierworkflow.sistercompany = reader["sistercompany"].ToString();
                                supplierworkflow.ownercompany = reader["ownercompany"].ToString();
                                supplierworkflow.operatingProfit1 = reader["operatingProfit1"].ToString();
                                supplierworkflow.operatingProfit2 = reader["operatingProfit2"].ToString();
                                supplierworkflow.netIncome1 = reader["netIncome1"].ToString();
                                supplierworkflow.netIncome2 = reader["netIncome2"].ToString();
                                supplierworkflow.currentAsset1 = reader["currentAsset1"].ToString();
                                supplierworkflow.currentAsset2 = reader["currentAsset2"].ToString();
                                supplierworkflow.totalLiable1 = reader["totalLiable1"].ToString();
                                supplierworkflow.totalLiable2 = reader["totalLiable2"].ToString();
                                supplierworkflow.totalEquity1 = reader["totalEquity1"].ToString();
                                supplierworkflow.totalEquity2 = reader["totalEquity2"].ToString();
                                supplierworkflow.noOfYears = reader["noOfYears"].ToString();
                                supplierworkflow.ownsPlantEquip = reader["ownsPlantEquip"].ToString();
                                supplierworkflow.designnCap = reader["designnCap"].ToString();
                                supplierworkflow.finishProd = reader["finishProd"].ToString();
                                supplierworkflow.internalPolicy = reader["internalPolicy"].ToString();
                                supplierworkflow.registeredOrg = reader["registeredOrg"].ToString();
                                supplierworkflow.suspendedProj1 = reader["suspendedProj1"].ToString();
                                supplierworkflow.suspendedProj2 = reader["suspendedProj2"].ToString();
                                supplierworkflow.litigation1 = reader["litigation1"].ToString();
                                supplierworkflow.litigation2 = reader["litigation2"].ToString();
                                supplierworkflow.compliance1 = reader["compliance1"].ToString();
                                supplierworkflow.compliance2 = reader["compliance2"].ToString();
                                supplierworkflow.shareholder1 = reader["shareholder1"].ToString();
                                supplierworkflow.shareholder2 = reader["shareholder2"].ToString();
                                supplierworkflow.labour1 = reader["labour1"].ToString();
                                supplierworkflow.labour2 = reader["labour2"].ToString();
                                supplierworkflow.legalAsset1 = reader["LEGALASSET1"].ToString(); ;
                                supplierworkflow.legalAsset2 = reader["LEGALASSET2"].ToString(); ;
                                supplierworkflow.environment1 = reader["environment1"].ToString();
                                supplierworkflow.environment2 = reader["environment2"].ToString();
                                supplierworkflow.imiInterested1 = reader["imiInterested1"].ToString();
                                supplierworkflow.imiInterested2 = reader["imiInterested2"].ToString();
                                supplierworkflow.hse1 = reader["hse1"].ToString();
                                supplierworkflow.hse2 = reader["hse2"].ToString();
                                supplierworkflow.docuHse = reader["docuHse"].ToString();
                                supplierworkflow.isohealth = reader["isohealth"].ToString();
                                supplierworkflow.envtMgt1 = reader["envtMgt1"].ToString();
                                supplierworkflow.envtMgt2 = reader["envtMgt2"].ToString();
                                supplierworkflow.dedicatedpers = reader["dedicatedpers"].ToString();
                                supplierworkflow.statistic = reader["statistic"].ToString();
                                supplierworkflow.qualityPolicy1 = reader["qualityPolicy1"].ToString();
                                supplierworkflow.qualityPolicy2 = reader["qualityPolicy2"].ToString();
                                supplierworkflow.qualityMgt = reader["qualityMgt"].ToString();
                                supplierworkflow.qualityResp1 = reader["qualityResp1"].ToString();
                                supplierworkflow.qualityResp2 = reader["qualityResp2"].ToString();
                                supplierworkflow.qualityreviewDate = reader["qualityreviewDate"].ToString();
                                supplierworkflow.typeOfOrganization = reader["type_of_org"].ToString();
                                supplierworkflow.managerialno = reader["no_of_manager"].ToString();
                                supplierworkflow.technicalno = reader["no_of_technical"].ToString();
                                supplierworkflow.operationsno = reader["no_of_operation"].ToString();
                                supplierworkflow.saudiNationalsno = reader["no_of_saudi"].ToString();
                                supplierworkflow.totallno = reader["no_of_total"].ToString();
                                supplierworkflow.hijriSelected = reader["hijri_selected"].ToString();
                                supplierworkflow.bankCountryCodes = reader["bank_country_code"].ToString();
                                supplierworkflow.bankName = reader["bank_name"].ToString();
                                supplierworkflow.swiftcode = reader["swift_code"].ToString();
                                supplierworkflow.accountHolderName = reader["account_holder_name"].ToString();
                                supplierworkflow.ibanNo = reader["iban_no"].ToString();
                                supplierworkflow.bankAddress = reader["bank_address"].ToString();
                                supplierworkflow.accountCurrency = reader["account_currency"].ToString();
                                supplierworkflow.account_number = reader["account_no"].ToString();
                                supplierworkflow.isEmergencySupplier = "N";
                                supplierworkflow.bankWorkflowDocId = reader["BANK_WORKFLOW_DOCID"].ToString();
                                supplierworkflow.bankProcessId = reader["BANK_PROCESSID"].ToString();
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierworkflow;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<SupplierApprovedItemsDto>> GetApprovedItems(string supplierId)
        {
            const string spName = "dbo.Isp_ApprovalWorkflowItem_Search";
            IList<SupplierApprovedItemsDto> supplierworkflowList = new List<SupplierApprovedItemsDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SupplierApprovedItemsDto supplierworkflow = new SupplierApprovedItemsDto();

                                supplierworkflow.SUPPLIER_ID = reader["SUPPLIER_ID"].ToString();
                                supplierworkflow.DECISION_OUTCOME = reader["DECISION_OUTCOME"].ToString();
                                supplierworkflow.DECISION_REMARKS = reader["DECISION_REMARKS"].ToString();
                                supplierworkflow.PROPERTY_COMMENT = reader["PROPERTY_COMMENT"].ToString();
                                supplierworkflow.PROPERTY_OUTCOME = reader["PROPERTY_OUTCOME"].ToString();
                                supplierworkflow.ADDITIONAL_COMMENT = reader["ADDITIONAL_COMMENT"].ToString();
                                supplierworkflow.LAST_UPDATED_DATE = reader["LAST_UPDATED_DATE"].ToString();
                                supplierworkflow.USERID = reader["USERID"].ToString();
                                supplierworkflow.USERROLE = reader["USERROLE"].ToString();
                                supplierworkflow.CREATEDDATE = Convert.ToDateTime(reader["CREATEDDATE"].ToString());
                                supplierworkflow.ID = Convert.ToInt32(reader["ID"].ToString());
                                supplierworkflowList.Add(supplierworkflow);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierworkflowList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveWorkFlow(WorkflowDto workflow)
        {
            const string spName = "dbo.Isp_ApprovalWorkflow_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", workflow.SUPPLIER_ID));
                        cmd.Parameters.Add(new SqlParameter("@ProcessId", workflow.PROCESSID));
                        cmd.Parameters.Add(new SqlParameter("@WorkflowDocId", workflow.DOCID));
                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IList<SupplierWorkflowDto>> GetPendingWorkflowSuppliers(string docIds)
        {
            const string spName = "dbo.Isp_GetApprovalWorkflow";
            IList<SupplierWorkflowDto> supplierworkflowList = new List<SupplierWorkflowDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@WorkflowDocId", docIds));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SupplierWorkflowDto supplierworkflow = new SupplierWorkflowDto();
                                supplierworkflow.supplier_id = reader["supplier_id"].ToString();
                                supplierworkflow.supplier_name = reader["supplier_name"].ToString();
                                supplierworkflow.email = reader["email"].ToString();
                                supplierworkflow.supplier_name_arabic = reader["supplier_name_arabic"].ToString();
                                supplierworkflow.establishment_year = reader["establishment_year"].ToString();
                                supplierworkflow.issued_by = reader["issued_by"].ToString();
                                supplierworkflow.web_site = reader["web_site"].ToString();
                                supplierworkflow.supplier_type = reader["supplier_type"].ToString();
                                supplierworkflow.country = reader["country"].ToString();
                                supplierworkflow.city = reader["city"].ToString();
                                supplierworkflow.other_city = reader["other_city"].ToString();
                                supplierworkflow.po_box = reader["po_box"].ToString();
                                supplierworkflow.postal_code = reader["postal_code"].ToString();
                                supplierworkflow.address_line1 = reader["address_line1"].ToString();
                                supplierworkflow.address_line2 = reader["address_line2"].ToString();
                                supplierworkflow.title = reader["title"].ToString();
                                supplierworkflow.first_name = reader["first_name"].ToString();
                                supplierworkflow.last_name = reader["last_name"].ToString();
                                supplierworkflow.telphone_country_code = reader["telphone_country_code"].ToString();
                                supplierworkflow.telephone_no = reader["telephone_no"].ToString();
                                supplierworkflow.extension = reader["extension"].ToString();
                                supplierworkflow.position = reader["position"].ToString();
                                supplierworkflow.mobile_country_code = reader["mobile_country_code"].ToString();
                                supplierworkflow.mobile_no = reader["mobile_no"].ToString();
                                supplierworkflow.fax_country_code = reader["fax_country_code"].ToString();
                                supplierworkflow.fax_no = reader["fax_no"].ToString();
                                supplierworkflow.additional_material = reader["additional_material"].ToString();
                                supplierworkflow.cr_no = reader["cr_no"].ToString();
                                supplierworkflow.vat_no = reader["vat_no"].ToString();
                                supplierworkflow.gosi_certificate = reader["gosi_certificate"].ToString();
                                supplierworkflow.parentcompany = reader["parentcompany"].ToString();
                                supplierworkflow.sistercompany = reader["sistercompany"].ToString();
                                supplierworkflow.ownercompany = reader["ownercompany"].ToString();
                                supplierworkflow.operatingProfit1 = reader["operatingProfit1"].ToString();
                                supplierworkflow.operatingProfit2 = reader["operatingProfit2"].ToString();
                                supplierworkflow.netIncome1 = reader["netIncome1"].ToString();
                                supplierworkflow.netIncome2 = reader["netIncome2"].ToString();
                                supplierworkflow.currentAsset1 = reader["currentAsset1"].ToString();
                                supplierworkflow.currentAsset2 = reader["currentAsset2"].ToString();
                                supplierworkflow.totalLiable1 = reader["totalLiable1"].ToString();
                                supplierworkflow.totalLiable2 = reader["totalLiable2"].ToString();
                                supplierworkflow.totalEquity1 = reader["totalEquity1"].ToString();
                                supplierworkflow.totalEquity2 = reader["totalEquity2"].ToString();
                                supplierworkflow.noOfYears = reader["noOfYears"].ToString();
                                supplierworkflow.ownsPlantEquip = reader["ownsPlantEquip"].ToString();
                                supplierworkflow.designnCap = reader["designnCap"].ToString();
                                supplierworkflow.finishProd = reader["finishProd"].ToString();
                                supplierworkflow.internalPolicy = reader["internalPolicy"].ToString();
                                supplierworkflow.registeredOrg = reader["registeredOrg"].ToString();
                                supplierworkflow.suspendedProj1 = reader["suspendedProj1"].ToString();
                                supplierworkflow.suspendedProj2 = reader["suspendedProj2"].ToString();
                                supplierworkflow.litigation1 = reader["litigation1"].ToString();
                                supplierworkflow.litigation2 = reader["litigation2"].ToString();
                                supplierworkflow.compliance1 = reader["compliance1"].ToString();
                                supplierworkflow.compliance2 = reader["compliance2"].ToString();
                                supplierworkflow.shareholder1 = reader["shareholder1"].ToString();
                                supplierworkflow.shareholder2 = reader["shareholder2"].ToString();
                                supplierworkflow.labour1 = reader["labour1"].ToString();
                                supplierworkflow.labour2 = reader["labour2"].ToString();
                                supplierworkflow.legalAsset1 = reader["LEGALASSET1"].ToString(); ;
                                supplierworkflow.legalAsset2 = reader["LEGALASSET2"].ToString(); ;
                                supplierworkflow.environment1 = reader["environment1"].ToString();
                                supplierworkflow.environment2 = reader["environment2"].ToString();
                                supplierworkflow.imiInterested1 = reader["imiInterested1"].ToString();
                                supplierworkflow.imiInterested2 = reader["imiInterested2"].ToString();
                                supplierworkflow.hse1 = reader["hse1"].ToString();
                                supplierworkflow.hse2 = reader["hse2"].ToString();
                                supplierworkflow.docuHse = reader["docuHse"].ToString();
                                supplierworkflow.isohealth = reader["isohealth"].ToString();
                                supplierworkflow.envtMgt1 = reader["envtMgt1"].ToString();
                                supplierworkflow.envtMgt2 = reader["envtMgt2"].ToString();
                                supplierworkflow.dedicatedpers = reader["dedicatedpers"].ToString();
                                supplierworkflow.statistic = reader["statistic"].ToString();
                                supplierworkflow.qualityPolicy1 = reader["qualityPolicy1"].ToString();
                                supplierworkflow.qualityPolicy2 = reader["qualityPolicy2"].ToString();
                                supplierworkflow.qualityMgt = reader["qualityMgt"].ToString();
                                supplierworkflow.qualityResp1 = reader["qualityResp1"].ToString();
                                supplierworkflow.qualityResp2 = reader["qualityResp2"].ToString();
                                supplierworkflow.qualityreviewDate = reader["qualityreviewDate"].ToString();
                                supplierworkflow.typeOfOrganization = reader["type_of_org"].ToString();
                                supplierworkflow.managerialno = reader["no_of_manager"].ToString();
                                supplierworkflow.technicalno = reader["no_of_technical"].ToString();
                                supplierworkflow.operationsno = reader["no_of_operation"].ToString();
                                supplierworkflow.saudiNationalsno = reader["no_of_saudi"].ToString();
                                supplierworkflow.totallno = reader["no_of_total"].ToString();
                                supplierworkflow.hijriSelected = reader["hijri_selected"].ToString();
                                supplierworkflow.bankCountryCodes = reader["bank_country_code"].ToString();
                                supplierworkflow.bankName = reader["bank_name"].ToString();
                                supplierworkflow.swiftcode = reader["swift_code"].ToString();
                                supplierworkflow.accountHolderName = reader["account_holder_name"].ToString();
                                supplierworkflow.ibanNo = reader["iban_no"].ToString();
                                supplierworkflow.bankAddress = reader["bank_address"].ToString();
                                supplierworkflow.accountCurrency = reader["account_currency"].ToString();
                                supplierworkflow.account_number = reader["account_no"].ToString();
                                supplierworkflow.isEmergencySupplier = "N";
                                supplierworkflow.bankWorkflowDocId = reader["BANK_WORKFLOW_DOCID"].ToString();
                                supplierworkflow.bankProcessId = reader["BANK_PROCESSID"].ToString();

                                supplierworkflowList.Add(supplierworkflow);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierworkflowList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveApprovedItem(SupplierApprovedItemsDto item)
        {
            const string spName = "dbo.Isp_ApprovalWorkflowItem_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", item.SUPPLIER_ID));
                        cmd.Parameters.Add(new SqlParameter("@DecisionOutCome", item.DECISION_OUTCOME));
                        cmd.Parameters.Add(new SqlParameter("@DecisionRemark", item.DECISION_REMARKS));
                        cmd.Parameters.Add(new SqlParameter("@SelectedValue", item.PROPERTY_COMMENT));
                        cmd.Parameters.Add(new SqlParameter("@PropertyOutcome", item.PROPERTY_OUTCOME));
                        cmd.Parameters.Add(new SqlParameter("@AdditionalComment", item.ADDITIONAL_COMMENT));
                        cmd.Parameters.Add(new SqlParameter("@UserId", item.USERID));
                        cmd.Parameters.Add(new SqlParameter("@UserRole", item.USERROLE));
                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IList<SupplierDto>> GetPendingSuppliers(string docId)
        {
            const string spName = "dbo.Isp_PendingSupplierWorkflow_Search";
            IList<SupplierDto> supplierlist = new List<SupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@WorkflowDocId", docId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SupplierDto supplier = new SupplierDto();

                                supplier.supplier_id = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplier.supplier_name = reader["SUPPLIER_NAME"].ToString();
                                supplier.supplier_name_arabic = reader["SUPPLIER_NAME_ARABIC"].ToString();
                                supplier.email = reader["EMAIL"].ToString();
                                supplier.establishment_year = Convert.ToInt32(reader["ESTABLISHMENT_YEAR"].ToString());
                                supplier.issued_by = reader["ISSUED_BY"].ToString();
                                supplier.web_site = reader["WEB_SITE"].ToString();
                                supplier.supplier_type = reader["SUPPLIER_TYPE"].ToString().Split(',');
                                supplier.country = reader["COUNTRY"].ToString();
                                supplier.city = reader["CITY"].ToString();
                                supplier.other_city = reader["OTHER_CITY"].ToString();
                                supplier.po_box = reader["PO_BOX"].ToString();
                                supplier.postal_code = reader["POSTAL_CODE"].ToString();
                                supplier.address_line1 = reader["ADDRESS_LINE1"].ToString();
                                supplier.address_line2 = reader["ADDRESS_LINE2"].ToString();
                                supplier.title = reader["TITLE"].ToString();
                                supplier.first_name = reader["FIRST_NAME"].ToString();
                                supplier.last_name = reader["LAST_NAME"].ToString();
                                supplier.position = reader["POSITION"].ToString();
                                supplier.telphone_country_code = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplier.telephone_no = reader["TELEPHONE_NO"].ToString();
                                supplier.extension = Convert.ToInt32(reader["EXTENSION"].ToString());
                                supplier.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplier.mobile_no = reader["MOBILE_NO"].ToString();
                                supplier.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplier.fax_no =reader["FAX_NO"].ToString();
                                supplier.cr_no = reader["CR_NO"].ToString(); ;
                                supplier.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplier.additional_material = reader["ADDITIONAL_MATERIAL"].ToString(); ;
                                supplier.typeOfOrganization = reader["TYPE_OF_ORG"].ToString(); ;
                                supplier.managerialno = Convert.ToInt32(reader["NO_OF_MANAGER"].ToString());
                                supplier.operationsno = Convert.ToInt32(reader["NO_OF_OPERATION"].ToString());
                                supplier.technicalno = Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString());
                                supplier.parentcompany = reader["PARENT_COMPANY_INFO"].ToString(); ;
                                supplier.ownercompany = reader["OWNER_INFO"].ToString(); ;
                                supplier.noOfYears = Convert.ToInt32(reader["NO_OF_YEARS"].ToString());
                                supplier.bankCountryCodes = reader["BANK_COUNTRY_CODE"].ToString(); ;
                                supplier.bankName = reader["BANK_NAME"].ToString(); ;
                                supplier.swiftcode = reader["SWIFT_CODE"].ToString(); ;
                                supplier.accountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString(); ;
                                supplier.ibanNo = reader["IBAN_NO"].ToString(); ;
                                supplier.bankAddress = reader["BANK_ADDRESS"].ToString(); ;
                                supplier.accountCurrency = reader["ACCOUNT_CURRENCY"].ToString(); ;
                                supplier.criticality = reader["CRITICALITY_VALUE"].ToString(); ;
                                supplier.workflow_id = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                supplier.process_id = reader["PROCESS_ID"].ToString(); ;
                                supplier.parentcompany = reader["PARENTCOMPANY"].ToString(); ;
                                supplier.sistercompany = reader["SISTERCOMPANY"].ToString(); ;
                                supplier.ownercompany = reader["OWNERCOMPANY"].ToString(); ;
                                supplier.operatingProfit1 = Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString());
                                supplier.operatingProfit2 = (reader["OPERATINGPROFIT2"].ToString());
                                supplier.netIncome1 = Convert.ToInt32(reader["NETINCOME1"].ToString());
                                supplier.netIncome2 = reader["NETINCOME2"].ToString(); ;
                                supplier.currentAsset1 = Convert.ToInt32(reader["CURRENTASSET1"].ToString());
                                supplier.currentAsset2 = (reader["CURRENTASSET2"].ToString());
                                supplier.totalLiable1 = Convert.ToInt32(reader["TOTALLIABLE1"].ToString());
                                supplier.totalLiable2 = (reader["TOTALLIABLE2"].ToString());
                                supplier.totalEquity1 = Convert.ToInt32(reader["TOTALEQUITY1"].ToString());
                                supplier.totalEquity2 = (reader["TOTALEQUITY2"].ToString());
                                supplier.noOfYears = Convert.ToInt32(reader["NOOFYEARS"].ToString());
                                supplier.ownsPlantEquip = reader["OWNSPLANTEQUIP"].ToString(); ;
                                supplier.designnCap = reader["DESIGNNCAP"].ToString(); ;
                                supplier.finishProd = reader["FINISHPROD"].ToString(); ;
                                supplier.internalPolicy = reader["INTERNALPOLICY"].ToString(); ;
                                supplier.registeredOrg = reader["REGISTEREDORG"].ToString(); ;
                                supplier.suspendedProj1 = reader["SUSPENDEDPROJ1"].ToString(); ;
                                supplier.suspendedProj2 = reader["SUSPENDEDPROJ2"].ToString(); ;
                                supplier.litigation1 = reader["LITIGATION1"].ToString(); ;
                                supplier.litigation2 = reader["LITIGATION2"].ToString(); ;
                                supplier.compliance1 = reader["COMPLIANCE1"].ToString(); ;
                                supplier.compliance2 = reader["COMPLIANCE2"].ToString(); ;
                                supplier.shareholder1 = reader["SHAREHOLDER1"].ToString(); ;
                                supplier.shareholder2 = reader["SHAREHOLDER2"].ToString(); ;
                                supplier.labour1 = reader["LABOUR1"].ToString(); ;
                                supplier.labour2 = reader["LABOUR2"].ToString(); ;
                                supplier.legalAsset1 = reader["LEGALASSET1"].ToString(); ;
                                supplier.legalAsset2 = reader["LEGALASSET2"].ToString(); ;
                                supplier.environment1 = reader["ENVIRONMENT1"].ToString(); ;
                                supplier.environment2 = reader["ENVIRONMENT2"].ToString(); ;
                                supplier.imiInterested1 = reader["IMIINTERESTED1"].ToString(); ;
                                supplier.imiInterested2 = reader["IMIINTERESTED2"].ToString(); ;
                                supplier.hse1 = reader["HSE1"].ToString(); ;
                                supplier.hse2 = reader["HSE2"].ToString(); ;
                                supplier.docuHse = reader["DOCUHSE"].ToString(); ;
                                supplier.isohealth = reader["ISOHEALTH"].ToString(); ;
                                supplier.envtMgt1 = reader["ENVTMGT1"].ToString(); ;
                                supplier.envtMgt2 = reader["ENVTMGT2"].ToString(); ;
                                supplier.dedicatedpers = reader["DEDICATEDPERS"].ToString(); ;
                                supplier.statistic = reader["STATISTIC"].ToString(); ;
                                supplier.qualityPolicy1 = reader["QUALITYPOLICY1"].ToString(); ;
                                supplier.qualityPolicy2 = reader["QUALITYPOLICY2"].ToString(); ;
                                supplier.qualityMgt = reader["QUALITYMGT"].ToString(); ;
                                supplier.qualityResp1 = reader["QUALITYRESP1"].ToString(); ;
                                supplier.qualityResp2 = reader["QUALITYRESP2"].ToString(); ;
                                supplier.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString(); ;
                                supplier.reg_date = reader["REG_DATE"].ToString();
                                supplier.vat_no = reader["VAT_NO"].ToString(); ;
                                supplier.gosi_certificate = reader["GOSI_CERTIFICATE"].ToString(); ;
                                supplier.gosi_date = reader["GOSI_DATE"].ToString();
                                supplier.saudi_date = reader["SAUDI_DATE"].ToString();
                                supplier.zakath_date = reader["ZAKATH_DATE"].ToString();
                                supplier.totallno = Convert.ToInt32(reader["NO_OF_TOTAL"].ToString());
                                supplier.hijriSelected = reader["HIJRI_SELECTED"].ToString(); ;
                                supplier.saudiNationalsno = Convert.ToInt32(reader["NO_OF_SAUDI"].ToString());
                                supplier.status = reader["STATUS"].ToString(); ;
                                supplier.created_date = reader["CREATED_DATE"].ToString(); ;
                                supplier.statisticNear = reader["STATISTICNEAR"].ToString(); ;
                                supplier.statisticFirst = reader["STATISTICFIRST"].ToString(); ;
                                supplier.statisticLost = reader["STATISTICLOST"].ToString(); ;
                                supplier.statisticFatal = reader["STATISTICFATAL"].ToString(); ;
                                supplier.hseName = reader["HSENAME"].ToString(); ;
                                supplier.hseDesig = reader["HSEDESIG"].ToString(); ;
                                supplier.qualityDesig = reader["QUALITYDESIG"].ToString(); ;
                                supplier.statisticMedical = reader["STATISTICMEDI"].ToString(); ;
                                supplier.qualityMgtIso = reader["QUALITYMGTISO"].ToString(); ;
                                supplier.statisticEnvt = reader["STATISTICENVT"].ToString(); ;
                                supplier.supplier_code = reader["SUPPLIER_CODE"].ToString(); ;
                                supplier.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplier.account_number = reader["account_no"].ToString(); ;
                                supplier.due_date = reader["DUE_DATE"].ToString(); 

                                supplierlist.Add(supplier);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<string> GetBankApprovalWorkFlow(int supplierId)
        {
            const string spName = "dbo.Isp_GetBankApprovalWorkflow";
            var bankworkflowId = "";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                bankworkflowId = reader["BANK_PROCESSID"].ToString();
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return bankworkflowId;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<SupplierHistoryDto>> GetHistory(string supplierId)
        {
            const string spName = "dbo.Isp_SupplierHistory_Search";
            IList<SupplierHistoryDto> supplierworkflowList = new List<SupplierHistoryDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SupplierHistoryDto supplierworkflow = new SupplierHistoryDto();

                                supplierworkflow.supplier_id = reader["SUPPLIER_ID"].ToString();
                                supplierworkflow.status_id = Convert.ToInt32(reader["STATUS_ID"].ToString());
                                supplierworkflow.status_remark = reader["STATUS_REMARK"].ToString();
                                supplierworkflow.status_comment = reader["STATUS_COMMENT"].ToString();
                                supplierworkflow.iscurrentstatus = reader["ISCURRENTSTATUS"].ToString();
                                supplierworkflow.userid = reader["USERID"].ToString();
                                supplierworkflow.userrole = reader["USERROLE"].ToString();
                                supplierworkflow.ÇommandName = reader["ACTION_COMMAND"].ToString();
                                supplierworkflow.createddate = Convert.ToDateTime(reader["CREATEDDATE"].ToString());
                                supplierworkflow.useremail = reader["USEREMAIL"].ToString();
                                supplierworkflowList.Add(supplierworkflow);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierworkflowList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<IList<UserDto>> GetUsers()
        {
            const string spName = "dbo.Isp_WorkflowUsers_Get";
            IList<UserDto> users = new List<UserDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                UserDto user = new UserDto();

                                user.id = Convert.ToInt32(reader["ID"].ToString());
                                user.email = reader["EMAILADDRESS"].ToString();
                                user.department = reader["DEPARTMENT"].ToString();
                                user.name = reader["NAME"].ToString();

                                users.Add(user);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return users;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
