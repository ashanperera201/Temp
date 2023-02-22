using Microsoft.Extensions.Configuration;
using SRMDomain.Data.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace SRMDomain.Data
{
    public class EmailData : IEmailData
    {
        private readonly string _connectionString;
        private IConfiguration configuration;
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public async Task<List<string>> GetWorkflowRoleEmail(string rolename)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");
            const string spName = "dbo.Isp_WorkflowRoleEmail_Get";
            var emaillist = new List<string>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@roleName", rolename));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                emaillist.Add(reader["EmailAddress"].ToString());
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return emaillist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<string>> GetWorkflowUsersEmail(string users)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");
            const string spName = "dbo.Isp_WorkflowUsersEmail_Get";
            var emaillist = new List<string>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@users", users));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                emaillist.Add(reader["EmailAddress"].ToString());
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return emaillist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<SupplierDto>> GetRegisteredSupplier(string supplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_Supplier_Search";
            IList<SupplierDto> supplierlist = new List<SupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId != null ? supplierId : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SupplierDto supplier = new SupplierDto();



                                supplier.supplier_id = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplier.supplier_name = reader["SUPPLIER_NAME"].ToString();
                                supplier.supplier_name_arabic = reader["SUPPLIER_NAME_ARABIC"].ToString();
                                supplier.email = reader["EMAIL"].ToString();
                                supplier.establishment_year = reader["ESTABLISHMENT_YEAR"].ToString() != "NULL" ? Convert.ToInt32(reader["ESTABLISHMENT_YEAR"].ToString()) : 0;
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
                                supplier.extension = (reader["EXTENSION"].ToString() != "NULL" && reader["EXTENSION"].ToString() != "") ? Convert.ToInt32(reader["EXTENSION"].ToString()) : 0; ;
                                supplier.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplier.mobile_no = reader["MOBILE_NO"].ToString();
                                supplier.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplier.fax_no = reader["FAX_NO"].ToString();
                                supplier.cr_no = reader["CR_NO"].ToString(); ;
                                supplier.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplier.additional_material = reader["ADDITIONAL_MATERIAL"].ToString(); ;
                                supplier.typeOfOrganization = reader["TYPE_OF_ORG"].ToString(); ;
                                supplier.managerialno = reader["NO_OF_MANAGER"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_MANAGER"].ToString()) : 0;
                                supplier.operationsno = reader["NO_OF_OPERATION"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_OPERATION"].ToString()) : 0;
                                supplier.technicalno = reader["NO_OF_TECHNICAL"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString()) : 0;
                                supplier.parentcompany = reader["PARENT_COMPANY_INFO"].ToString(); ;
                                //supplier.affiliated_company_info = reader["AFFILIATED_COMPANY_INFO"].ToString(); ;
                                supplier.ownercompany = reader["OWNER_INFO"].ToString(); ;
                                //supplier.finance_status_year1 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR1"].ToString()) ;
                                //supplier.finance_status_value1 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE1"].ToString()) ;
                                //supplier.finance_status_year2 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR2"].ToString()) ;
                                //supplier.finance_status_value2 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE2"].ToString()) ;
                                //supplier.finance_status_year3 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR3"].ToString()) ;
                                //supplier.finance_status_value3 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE3"].ToString()) ;
                                //supplier.finance_status_year4 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR4"].ToString()) ;
                                //supplier.finance_status_value4 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE4"].ToString()) ;
                                //supplier.finance_status_year5 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR5"].ToString()) ;
                                //supplier.finance_status_value5 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE5"].ToString()) ;
                                supplier.noOfYears = reader["NO_OF_YEARS"].ToString() != "" ? Convert.ToInt32(reader["NO_OF_YEARS"].ToString()) : 0;
                                supplier.bankCountryCodes = reader["BANK_COUNTRY_CODE"].ToString(); ;
                                supplier.bankName = reader["BANK_NAME"].ToString(); ;
                                supplier.otherBankName = reader["OTHER_BANK"].ToString(); ;
                                supplier.swiftcode = reader["SWIFT_CODE"].ToString(); ;
                                supplier.accountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString(); ;
                                //supplier.account_number = reader["ACCOUNT_INT"].ToString(); ;
                                supplier.ibanNo = reader["IBAN_NO"].ToString(); ;
                                supplier.bankAddress = reader["BANK_ADDRESS"].ToString(); ;
                                supplier.bankAddress2 = reader["BANK_ADDRESS_2"].ToString(); ;
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
                                supplier.qualityResp3 = reader["QUALITYRESP3"].ToString(); ;
                                supplier.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString(); ;
                                supplier.reg_date = reader["REG_DATE"].ToString();
                                supplier.vat_no = reader["VAT_NO"].ToString(); ;
                                supplier.gosi_certificate = reader["GOSI_CERTIFICATE"].ToString(); ;
                                supplier.gosi_date = reader["GOSI_DATE"].ToString();
                                supplier.saudi_date = reader["SAUDI_DATE"].ToString();
                                supplier.zakath_date = reader["ZAKATH_DATE"].ToString();
                                supplier.totallno = reader["NO_OF_TOTAL"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_TOTAL"].ToString()) : 0;
                                supplier.hijriSelected = reader["HIJRI_SELECTED"].ToString();
                                supplier.saudiNationalsno = reader["NO_OF_SAUDI"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_SAUDI"].ToString()) : 0;
                                supplier.status = reader["STATUS"].ToString();
                                supplier.created_date = reader["CREATED_DATE"].ToString();
                                supplier.statisticNear = reader["STATISTICNEAR"].ToString();
                                supplier.statisticFirst = reader["STATISTICFIRST"].ToString();
                                supplier.statisticLost = reader["STATISTICLOST"].ToString();
                                supplier.statisticFatal = reader["STATISTICFATAL"].ToString();
                                supplier.hseName = reader["HSENAME"].ToString();
                                supplier.hseDesig = reader["HSEDESIG"].ToString();
                                supplier.qualityDesig = reader["QUALITYDESIG"].ToString();
                                supplier.statisticMedical = reader["STATISTICMEDI"].ToString();
                                supplier.qualityMgtIso = reader["QUALITYMGTISO"].ToString();
                                supplier.statisticEnvt = reader["STATISTICENVT"].ToString();
                                supplier.supplier_code = reader["SUPPLIER_CODE"].ToString();
                                supplier.ifs_code = reader["IFS_CODE"].ToString();
                                supplier.account_number = reader["account_no"].ToString();
                                supplier.due_date = reader["DUE_DATE"].ToString();
                                supplier.multicurrency = reader["MULTICURRENCY"].ToString();
                                supplier.invitestatus = reader["INVITED"].ToString();
                                supplier.wasalAddress = reader["WASAL_ADDRESS"].ToString();
                                supplier.typeOfOrganization2 = reader["TYPE_OF_ORG2"].ToString();
                                supplier.additionalCtrl = reader["ADDITIONALCTRL"].ToString();
                                supplier.additionalCtrl2 = reader["ADDITIONALCTRL2"].ToString();
                                supplier.additionalCtrl3 = reader["ADDITIONALCTRL3"].ToString();
                                supplier.additionalCtrl4 = reader["ADDITIONALCTRL4"].ToString();
                                supplier.additionalCtrl5 = reader["ADDITIONALCTRL5"].ToString();
                                supplier.title1 = reader["title1"].ToString();
                                supplier.first_name1 = reader["first_name1"].ToString();
                                supplier.last_name1 = reader["last_name1"].ToString();
                                supplier.email1 = reader["email1"].ToString();
                                supplier.position1 = reader["position1"].ToString();
                                supplier.telphone_country_code1 = reader["telphone_country_code1"].ToString();
                                supplier.telephone_no1 = reader["telephone_no1"].ToString();
                                supplier.extension1 = (reader["extension1"].ToString() != "null" && reader["extension1"].ToString() != "") ? Convert.ToInt32(reader["extension1"].ToString()) : 0; ;
                                supplier.mobile_country_code1 = reader["mobile_country_code1"].ToString();
                                supplier.mobile_no1 = reader["mobile_no1"].ToString();
                                supplier.fax_country_code1 = reader["fax_country_code1"].ToString();
                                supplier.fax_no1 = reader["fax_no1"].ToString();
                                supplier.title2 = reader["title2"].ToString();
                                supplier.first_name2 = reader["first_name2"].ToString();
                                supplier.last_name2 = reader["last_name2"].ToString();
                                supplier.email2 = reader["email2"].ToString();
                                supplier.position2 = reader["position2"].ToString();
                                supplier.telphone_country_code2 = reader["telphone_country_code2"].ToString();
                                supplier.telephone_no2 = reader["telephone_no2"].ToString();
                                supplier.extension2 = (reader["extension2"].ToString() != "null" && reader["extension2"].ToString() != "") ? Convert.ToInt32(reader["extension2"].ToString()) : 0; ;
                                supplier.mobile_country_code2 = reader["mobile_country_code2"].ToString();
                                supplier.mobile_no2 = reader["mobile_no2"].ToString();
                                supplier.fax_country_code2 = reader["fax_country_code2"].ToString();
                                supplier.fax_no2 = reader["fax_no2"].ToString();
                                //supplier.invitestatus = reader["INVITED"].ToString();
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

        public async Task<IList<EmergencySupplierDto>> GetEmgRegisteredSupplier(string supplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_EmergencySupplier_Search";
            IList<EmergencySupplierDto> supplierlist = new List<EmergencySupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId != null ? supplierId : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                EmergencySupplierDto supplieremergency = new EmergencySupplierDto();

                                supplieremergency.supplier_id = Convert.ToInt32(reader["EMERGENCY_SUPPLIER_ID"].ToString());
                                supplieremergency.emergency_supplier_name = reader["EMERGENCY_SUPPLIER_NAME"].ToString();
                                supplieremergency.email = reader["EMAIL"].ToString();
                                supplieremergency.establishment_year = reader["ESTABLISHMENT_YEAR"].ToString();
                                supplieremergency.supplier_type = reader["EMERGENCY_SUPPLIER_TYPE"].ToString().Split(',');
                                supplieremergency.country = reader["COUNTRY"].ToString();
                                supplieremergency.city = reader["CITY"].ToString();
                                supplieremergency.other_city = reader["OTHER_CITY"].ToString();
                                supplieremergency.po_box = reader["PO_BOX"].ToString();
                                supplieremergency.postal_code = reader["POSTAL_CODE"].ToString();
                                supplieremergency.address_line1 = reader["ADDRESS_LINE1"].ToString();
                                supplieremergency.address_line2 = reader["ADDRESS_LINE2"].ToString();
                                supplieremergency.title = reader["TITLE"].ToString();
                                supplieremergency.first_name = reader["FIRST_NAME"].ToString();
                                supplieremergency.last_name = reader["LAST_NAME"].ToString();
                                supplieremergency.telphone_country_code = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplieremergency.telephone_no = reader["TELEPHONE_NO"].ToString();
                                supplieremergency.extension = reader["EXTENSION"].ToString();
                                supplieremergency.position = reader["POSITION"].ToString();
                                supplieremergency.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplieremergency.mobile_no = reader["MOBILE_NO"].ToString();
                                supplieremergency.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplieremergency.fax_no = reader["FAX_NO"].ToString();
                                supplieremergency.cr_no = reader["CR_NO"].ToString(); ;
                                supplieremergency.cr_exp_date = reader["CR_EXP_DATE"].ToString(); ;
                                supplieremergency.justification = reader["JUSTIFICATION"].ToString(); ;
                                supplieremergency.srm_remark = reader["SRM_REMARK"].ToString(); ;
                                supplieremergency.workflow_id = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                supplieremergency.process_id = reader["PROCESS_ID"].ToString(); ;
                                supplieremergency.status = reader["SUPPLIER_STATUS"].ToString();
                                supplieremergency.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                supplieremergency.invite_by = reader["INVITE_BY"].ToString(); ;
                                supplieremergency.invite_by_email = reader["INVITE_BY_EMAIL"].ToString(); ;
                                supplieremergency.invite_by_role = reader["INVITE_BY_ROLE"].ToString(); ;
                                supplieremergency.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplieremergency.vat_no = reader["vat_no"].ToString(); ;

                                supplierlist.Add(supplieremergency);
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

        public async Task<IList<SupplierDto>> GetTempRegisteredSupplier(string supplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");
            const string spName = "dbo.Isp_SupplierTemp_Search";
            IList<SupplierDto> supplierlist = new List<SupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", Convert.ToInt32(supplierId)));
                        sql.OpenAsync();

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
                                supplier.last_name = reader["POSITION"].ToString();
                                supplier.telphone_country_code = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplier.telephone_no = reader["TELEPHONE_NO"].ToString();
                                supplier.extension = Convert.ToInt32(reader["EXTENSION"].ToString());
                                supplier.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplier.mobile_no = reader["MOBILE_NO"].ToString();
                                supplier.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplier.fax_no = reader["FAX_NO"].ToString();
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
                                supplier.account_number = reader["account_no"].ToString();
                                supplier.multicurrency = reader["MULTICURRENCY"].ToString();
                                supplier.title1 = reader["title1"].ToString();
                                supplier.first_name1 = reader["first_name1"].ToString();
                                supplier.last_name1 = reader["last_name1"].ToString();
                                supplier.email1 = reader["email1"].ToString();
                                supplier.position1 = reader["position1"].ToString();
                                supplier.telphone_country_code1 = reader["telphone_country_code1"].ToString();
                                supplier.telephone_no1 = reader["telephone_no1"].ToString();
                                supplier.extension1 = (reader["extension1"].ToString() != "null" && reader["extension1"].ToString() != "") ? Convert.ToInt32(reader["extension1"].ToString()) : 0; ;
                                supplier.mobile_country_code1 = reader["mobile_country_code1"].ToString();
                                supplier.mobile_no1 = reader["mobile_no1"].ToString();
                                supplier.fax_country_code1 = reader["fax_country_code1"].ToString();
                                supplier.fax_no1 = reader["fax_no1"].ToString();
                                supplier.title2 = reader["title2"].ToString();
                                supplier.first_name2 = reader["first_name2"].ToString();
                                supplier.last_name2 = reader["last_name2"].ToString();
                                supplier.email2 = reader["email2"].ToString();
                                supplier.position2 = reader["position2"].ToString();
                                supplier.telphone_country_code2 = reader["telphone_country_code2"].ToString();
                                supplier.telephone_no2 = reader["telephone_no2"].ToString();
                                supplier.extension2 = (reader["extension2"].ToString() != "null" && reader["extension2"].ToString() != "") ? Convert.ToInt32(reader["extension2"].ToString()) : 0; ;
                                supplier.mobile_country_code2 = reader["mobile_country_code2"].ToString();
                                supplier.mobile_no2 = reader["mobile_no2"].ToString();
                                supplier.fax_country_code2 = reader["fax_country_code2"].ToString();
                                supplier.fax_no2 = reader["fax_no2"].ToString();

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

        public async Task<string> GetEmalConfig()
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var emailconfig = configuration["EmailExpiryDate"];
            return emailconfig;
        }

        public async Task<string> GetCurrentWorkflowStatus(string processId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");
            const string spName = "dbo.Isp_CurrentWorkflowStatus_Search";
            var currentstatus = "";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ProcessId", processId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                currentstatus = reader["StateName"].ToString();
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return currentstatus;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Get Invite Supplier Data
        public async Task<IList<InviteSupplierDto>> GetInviteSupplier(string inviteSupplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_InviteSupplier_Search";
            IList<InviteSupplierDto> inviteSupplierList = new List<InviteSupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", inviteSupplierId != null ? inviteSupplierId : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                InviteSupplierDto invitesupplier = new InviteSupplierDto();

                                invitesupplier.invite_supplier_id = Convert.ToInt32(reader["INVITE_SUPPLIER_ID"].ToString());
                                invitesupplier.invite_supplier_name = reader["INVITE_SUPPLIER_NAME"].ToString();
                                invitesupplier.email = reader["EMAIL"].ToString();
                                invitesupplier.title = reader["TITLE"].ToString();
                                invitesupplier.first_name = reader["FIRST_NAME"].ToString();
                                invitesupplier.last_name = reader["LAST_NAME"].ToString();
                                invitesupplier.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                invitesupplier.invite_by = reader["INVITE_BY"].ToString();
                                invitesupplier.invite_by_email = reader["INVITE_BY_EMAIL"].ToString();
                                invitesupplier.invite_by_role = reader["INVITE_BY_ROLE"].ToString();

                                inviteSupplierList.Add(invitesupplier);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return inviteSupplierList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        //Get Re-Invite Data of Invite Supplier
        public async Task<IList<InviteSupplierDto>> GetReInviteSupplier(string inviteSupplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_InviteSupplier_Search";
            IList<InviteSupplierDto> inviteSupplierList = new List<InviteSupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", inviteSupplierId != null ? inviteSupplierId : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                InviteSupplierDto invitesupplier = new InviteSupplierDto();

                                invitesupplier.invite_supplier_id = Convert.ToInt32(reader["INVITE_SUPPLIER_ID"].ToString());
                                invitesupplier.invite_supplier_name = reader["INVITE_SUPPLIER_NAME"].ToString();
                                invitesupplier.email = reader["EMAIL"].ToString();
                                invitesupplier.title = reader["TITLE"].ToString();
                                invitesupplier.first_name = reader["FIRST_NAME"].ToString();
                                invitesupplier.last_name = reader["LAST_NAME"].ToString();
                                invitesupplier.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                invitesupplier.invite_by = reader["INVITE_BY"].ToString();
                                invitesupplier.invite_by_email = reader["INVITE_BY_EMAIL"].ToString();
                                invitesupplier.invite_by_role = reader["INVITE_BY_ROLE"].ToString();
                                invitesupplier.re_invite_date_time = reader["RE_INVITE_DATE_TIME"].ToString();
                                invitesupplier.re_invite_by = reader["RE_INVITE_BY"].ToString();
                                invitesupplier.re_invite_by_email = reader["RE_INVITE_BY_EMAIL"].ToString();
                                invitesupplier.re_invite_by_role = reader["RE_INVITE_BY_ROLE"].ToString();

                                inviteSupplierList.Add(invitesupplier);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return inviteSupplierList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        //Get Supplier Categories data 
        public async Task<IList<CategoriesForHSEQDto>> GetSupplierCategories(string supplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_SupplierCategory_Search";
            IList<CategoriesForHSEQDto> categorylist = new List<CategoriesForHSEQDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId != null ? supplierId : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                CategoriesForHSEQDto suppliercategory = new CategoriesForHSEQDto();

                                suppliercategory.position = Convert.ToInt32(reader["CATEGORY_POS_ID"].ToString());
                                suppliercategory.generalCategory = reader["GENERAL_CATEGOTY"].ToString();
                                suppliercategory.subCategory = reader["SUB_CATEGORY"].ToString();
                                suppliercategory.detailCategory = reader["DETAIL_CATEGORY"].ToString();
                                suppliercategory.generalCode = reader["GENERAL_CODE"].ToString();
                                suppliercategory.subCode = reader["SUB_CODE"].ToString();
                                suppliercategory.detailCode = reader["DETAIL_CODE"].ToString();
                                suppliercategory.isChecked = reader["IS_SUPPLIER_SELECTED"].ToString() == "1" ? true : false;
                                suppliercategory.isSRMChecked = reader["IS_SRM_SELECTED"].ToString() == "1" ? "Approved" : "Rejected";
                                suppliercategory.isHSEQChecked = reader["IS_AUDIT_SELECTED"].ToString() == "1" ? "Approved" : "Rejected";
                                suppliercategory.hseqUpdatedBy = reader["HSEQ_UPDATED_BY"].ToString() == null ? "" : reader["HSEQ_UPDATED_BY"].ToString();
                                suppliercategory.hseqUpdatedDateTime = reader["HSEQ_UPDATED_DATE_TIME"].ToString() == null ? "" : reader["HSEQ_UPDATED_DATE_TIME"].ToString();

                                categorylist.Add(suppliercategory);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return categorylist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        //Get Supplier Details for MS Flow
        public async Task<IList<SupplierDto>> GetRegisteredSupplierForMSFlow(string supplierId)
        {
            logger.Info(" supplier id in GetRegisteredSupplierForMSFlow : " + supplierId);
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_Supplier_Search";
            IList<SupplierDto> supplierlist = new List<SupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId != null ? supplierId : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            logger.Info(" supplier id in GetRegisteredSupplierForMSFlow 1 ");

                            while (await reader.ReadAsync())
                            {
                                logger.Info(" supplier id in GetRegisteredSupplierForMSFlow 2 ");
                                SupplierDto supplier = new SupplierDto();

                                supplier.supplier_id = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplier.supplier_name = reader["SUPPLIER_NAME"].ToString();
                                supplier.supplier_name_arabic = reader["SUPPLIER_NAME_ARABIC"].ToString();
                                supplier.email = reader["EMAIL"].ToString();
                                supplier.establishment_year = reader["ESTABLISHMENT_YEAR"].ToString() != "NULL" ? Convert.ToInt32(reader["ESTABLISHMENT_YEAR"].ToString()) : 0;
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
                                supplier.extension = (reader["EXTENSION"].ToString() != "NULL" && reader["EXTENSION"].ToString() != "") ? Convert.ToInt32(reader["EXTENSION"].ToString()) : 0; ;
                                supplier.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplier.mobile_no = reader["MOBILE_NO"].ToString();
                                supplier.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplier.fax_no = reader["FAX_NO"].ToString();
                                supplier.cr_no = reader["CR_NO"].ToString(); ;
                                supplier.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplier.additional_material = reader["ADDITIONAL_MATERIAL"].ToString(); ;
                                supplier.typeOfOrganization = reader["TYPE_OF_ORG"].ToString(); ;
                                supplier.managerialno = reader["NO_OF_MANAGER"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_MANAGER"].ToString()) : 0;
                                supplier.operationsno = reader["NO_OF_OPERATION"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_OPERATION"].ToString()) : 0;
                                supplier.technicalno = reader["NO_OF_TECHNICAL"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString()) : 0;
                                supplier.parentcompany = reader["PARENT_COMPANY_INFO"].ToString(); ;
                                //supplier.affiliated_company_info = reader["AFFILIATED_COMPANY_INFO"].ToString(); ;
                                supplier.ownercompany = reader["OWNER_INFO"].ToString(); ;
                                //supplier.finance_status_year1 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR1"].ToString()) ;
                                //supplier.finance_status_value1 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE1"].ToString()) ;
                                //supplier.finance_status_year2 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR2"].ToString()) ;
                                //supplier.finance_status_value2 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE2"].ToString()) ;
                                //supplier.finance_status_year3 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR3"].ToString()) ;
                                //supplier.finance_status_value3 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE3"].ToString()) ;
                                //supplier.finance_status_year4 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR4"].ToString()) ;
                                //supplier.finance_status_value4 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE4"].ToString()) ;
                                //supplier.finance_status_year5 = Convert.ToInt32(reader["FINANCE_STATUS_YEAR5"].ToString()) ;
                                //supplier.finance_status_value5 = Convert.ToInt32(reader["FINANCE_STATUS_VALUE5"].ToString()) ;
                                supplier.noOfYears = reader["NO_OF_YEARS"].ToString() != "" ? Convert.ToInt32(reader["NO_OF_YEARS"].ToString()) : 0;
                                supplier.bankCountryCodes = reader["BANK_COUNTRY_CODE"].ToString(); ;
                                supplier.bankName = reader["BANK_NAME"].ToString(); ;
                                supplier.otherBankName = reader["OTHER_BANK"].ToString(); ;
                                supplier.swiftcode = reader["SWIFT_CODE"].ToString(); ;
                                supplier.accountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString(); ;
                                //supplier.account_number = reader["ACCOUNT_INT"].ToString(); ;
                                supplier.ibanNo = reader["IBAN_NO"].ToString(); ;
                                supplier.bankAddress = reader["BANK_ADDRESS"].ToString(); ;
                                supplier.bankAddress2 = reader["BANK_ADDRESS_2"].ToString(); ;
                                supplier.accountCurrency = reader["ACCOUNT_CURRENCY"].ToString(); ;
                                supplier.criticality = reader["CRITICALITY_VALUE"].ToString(); ;
                                supplier.workflow_id = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                supplier.process_id = reader["PROCESS_ID"].ToString(); ;
                                supplier.parentcompany = reader["PARENTCOMPANY"].ToString(); ;
                                supplier.sistercompany = reader["SISTERCOMPANY"].ToString(); ;
                                logger.Info(" supplier detail 0");
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
                                logger.Info(" supplier detail 1");
                                supplier.shareholder2 = reader["SHAREHOLDER2"].ToString(); ;
                                supplier.labour1 = reader["LABOUR1"].ToString(); ;
                                logger.Info(" supplier detail 001");
                                supplier.labour2 = reader["LABOUR2"].ToString(); ;
                                supplier.legalAsset1 = reader["LEGALASSET1"].ToString(); ;
                                logger.Info(" supplier detail 002");
                                supplier.legalAsset2 = reader["LEGALASSET2"].ToString(); ;
                                supplier.environment1 = reader["ENVIRONMENT1"].ToString(); ;
                                supplier.environment2 = reader["ENVIRONMENT2"].ToString(); ;
                                logger.Info(" supplier detail 003");
                                supplier.imiInterested1 = reader["IMIINTERESTED1"].ToString(); ;
                                supplier.imiInterested2 = reader["IMIINTERESTED2"].ToString(); ;
                                supplier.hse1 = reader["HSE1"].ToString(); ;
                                supplier.hse2 = reader["HSE2"].ToString(); ;
                                supplier.docuHse = reader["DOCUHSE"].ToString(); ;
                                logger.Info(" supplier detail 004");
                                supplier.isohealth = reader["ISOHEALTH"].ToString(); ;
                                supplier.envtMgt1 = reader["ENVTMGT1"].ToString(); ;
                                supplier.envtMgt2 = reader["ENVTMGT2"].ToString(); ;
                                logger.Info(" supplier detail 005");
                                supplier.dedicatedpers = reader["DEDICATEDPERS"].ToString(); ;
                                supplier.statistic = reader["STATISTIC"].ToString(); ;
                                supplier.qualityPolicy1 = reader["QUALITYPOLICY1"].ToString(); ;
                                supplier.qualityPolicy2 = reader["QUALITYPOLICY2"].ToString(); ;
                                logger.Info(" supplier detail 006");
                                supplier.qualityMgt = reader["QUALITYMGT"].ToString(); ;
                                supplier.qualityResp1 = reader["QUALITYRESP1"].ToString(); ;
                                supplier.qualityResp2 = reader["QUALITYRESP2"].ToString(); ;
                                supplier.qualityResp3 = reader["QUALITYRESP3"].ToString(); ;
                                logger.Info(" supplier detail 007");
                                supplier.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString(); ;
                                supplier.reg_date = reader["REG_DATE"].ToString();
                                supplier.vat_no = reader["VAT_NO"].ToString(); ;
                                logger.Info(" supplier detail 008");
                                supplier.gosi_certificate = reader["GOSI_CERTIFICATE"].ToString(); ;
                                supplier.gosi_date = reader["GOSI_DATE"].ToString();
                                supplier.saudi_date = reader["SAUDI_DATE"].ToString();
                                supplier.zakath_date = reader["ZAKATH_DATE"].ToString();
                                logger.Info(" supplier detail 009");
                                supplier.totallno = 0;
                                logger.Info(" supplier detail 010");
                                supplier.hijriSelected = "N";
                                supplier.saudiNationalsno = 0;
                                logger.Info(" supplier detail 011");
                                supplier.status = reader["STATUS"].ToString();
                                logger.Info(" supplier detail 2");
                                supplier.created_date = reader["CREATED_DATE"].ToString();
                                supplier.statisticNear = reader["STATISTICNEAR"].ToString();
                                supplier.statisticFirst = reader["STATISTICFIRST"].ToString();
                                supplier.statisticLost = reader["STATISTICLOST"].ToString();
                                supplier.statisticFatal = reader["STATISTICFATAL"].ToString();
                                supplier.hseName = reader["HSENAME"].ToString();
                                supplier.hseDesig = reader["HSEDESIG"].ToString();
                                supplier.qualityDesig = reader["QUALITYDESIG"].ToString();
                                supplier.statisticMedical = reader["STATISTICMEDI"].ToString();
                                supplier.qualityMgtIso = reader["QUALITYMGTISO"].ToString();
                                supplier.statisticEnvt = reader["STATISTICENVT"].ToString();
                                supplier.supplier_code = reader["SUPPLIER_CODE"].ToString();
                                supplier.ifs_code = reader["IFS_CODE"].ToString();
                                supplier.account_number = reader["account_no"].ToString();
                                supplier.due_date = reader["DUE_DATE"].ToString();
                                supplier.multicurrency = reader["MULTICURRENCY"].ToString();
                                supplier.invitestatus = reader["INVITED"].ToString();
                                supplier.wasalAddress = reader["WASAL_ADDRESS"].ToString();
                                supplier.typeOfOrganization2 = reader["TYPE_OF_ORG2"].ToString();
                                supplier.additionalCtrl = reader["ADDITIONALCTRL"].ToString();
                                logger.Info(" supplier detail 3");
                                supplier.additionalCtrl2 = reader["ADDITIONALCTRL2"].ToString();
                                supplier.additionalCtrl3 = reader["ADDITIONALCTRL3"].ToString();
                                supplier.additionalCtrl4 = reader["ADDITIONALCTRL4"].ToString();
                                supplier.additionalCtrl5 = reader["ADDITIONALCTRL5"].ToString();
                                supplier.bankCode = reader["BANK_CODE"].ToString();
                                supplier.revisionNo = reader["REVISION_NO"].ToString() != "" ? Convert.ToInt32(reader["REVISION_NO"].ToString()) : 0;
                                logger.Info(" supplier detail 4");
                                supplierlist.Add(supplier);
                                logger.Info(" supplier id in GetRegisteredSupplierForMSFlow 3 after add ", supplierlist);
                                logger.Info(" supplier count 1" + supplierlist.Count);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                logger.Info(" supplier detail 1", ex.Message);
                logger.Info(" supplier detail 1", ex.StackTrace);

                return null;
            }
        }

        // Get Supplier History data for MS Flow
        public async Task<IList<SupplierHistoryDto>> GetHistory(string supplierId, string IsCurrentStatus, string StatusRemark)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_SupplierSpecificHistory_Search";
            IList<SupplierHistoryDto> supplierworkflowList = new List<SupplierHistoryDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@IsCurrentStatus", IsCurrentStatus));
                        cmd.Parameters.Add(new SqlParameter("@StatusRemark", StatusRemark));
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

        // Get Emergency Supplier History data for MS Flow
        public async Task<IList<EmergencySupplierHistoryDto>> GetEmergencyHistory(string supplierId, string Status)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_EmergencySupplierSpecificHistory_Search";
            IList<EmergencySupplierHistoryDto> supplierworkflowList = new List<EmergencySupplierHistoryDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@Status", Status));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                EmergencySupplierHistoryDto supplierworkflow = new EmergencySupplierHistoryDto();

                                supplierworkflow.supplier_id = reader["SUPPLIER_ID"].ToString();
                                supplierworkflow.status = reader["STATUS"].ToString();
                                supplierworkflow.current_position = reader["CURRENT_POSITION"].ToString();
                                supplierworkflow.due_date = reader["DUE_DATE"].ToString();
                                supplierworkflow.handle_before = reader["HANDLE_BEFORE"].ToString();
                                supplierworkflow.handle_date = Convert.ToDateTime(reader["HANDLE_DATE"].ToString());
                                supplierworkflow.outcome = reader["OUTCOME"].ToString();
                                supplierworkflow.outcome_reason = reader["OUTCOME_REASON"].ToString();
                                supplierworkflow.user_id = reader["USERID"].ToString();
                                supplierworkflow.user_role = reader["USERROLE"].ToString();
                                supplierworkflow.createddate = Convert.ToDateTime(reader["CREATEDDATE"].ToString());
                                supplierworkflow.id = reader["ID"].ToString();
                                supplierworkflow.action_command = reader["ACTION_COMMAND"].ToString();
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

        // Get Supplier specific old History data for MS Flow
        public async Task<IList<SupplierHistoryDto>> GetOldHistory(string supplierId, string IsCurrentStatus, string StatusRemark)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

            const string spName = "dbo.Isp_SupplierSpecificOldHistory_Search";
            IList<SupplierHistoryDto> supplierworkflowList = new List<SupplierHistoryDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@IsCurrentStatus", IsCurrentStatus));
                        cmd.Parameters.Add(new SqlParameter("@StatusRemark", StatusRemark));
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

        public async Task<IList<PortalToMsFlowDto>> generateemailpending(string supplierstatus)
        {
            try
            {
                IList<PortalToMsFlowDto> PortalToMsFlowDtoList = new List<PortalToMsFlowDto>();
                IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                configurationBuilder.AddJsonFile("AppSettings.json");
                IConfiguration configuration = configurationBuilder.Build();
                var _connectionString = configuration.GetConnectionString("defaultConnection");



                const string spName = "dbo.PENDINGEMAILSYSTEMGENERATETEMP_SEARCH";



                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {



                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@status", supplierstatus));
                        await sql.OpenAsync();



                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                PortalToMsFlowDto flowobject = new PortalToMsFlowDto();
                                flowobject.command = reader["Command"].ToString();
                                flowobject.procesID = reader["process_id"].ToString();
                                flowobject.comment = "-";
                                flowobject.supplierID = reader["supplier_id"].ToString();
                                flowobject.supplier_code = reader["supplier_code"].ToString();
                                flowobject.workflowCurrentStatus = reader["current_status"].ToString();
                                flowobject.supplierStatus = supplierstatus;
                                flowobject.criticality = Convert.ToInt32(reader["criticality_value"].ToString());
                                flowobject.role = reader["role"].ToString();
                                flowobject.triggeredBy = "SRM SYSTEM";

                                PortalToMsFlowDtoList.Add(flowobject);
                            }
                        }



                    }
                    sql.CloseAsync();
                }
                return PortalToMsFlowDtoList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        // Get Supplier History data for MS Flow - SRM Remark after rejection
        public async Task<IList<SupplierHistoryDto>> GetSupplierHistoryData(string supplierId)
        {
            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");

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

        public async Task<SettingsMasterDto> GetSettingsData()
        {
            const string spName = "dbo.Isp_Setting_Search";
            var settings = new SettingsMasterDto();

            IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
            configurationBuilder.AddJsonFile("AppSettings.json");
            IConfiguration configuration = configurationBuilder.Build();

            var _connectionString = configuration.GetConnectionString("defaultConnection");
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
                                var template = new UserDatatableFieldDto();

                                settings.CategoryLimit = reader["MAX_CATEGORY_LIMIT"].ToString();
                                settings.DraftLimit = reader["DRAFT_LIMIT"].ToString();
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return settings;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
