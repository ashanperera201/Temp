using Microsoft.Extensions.Configuration;
using SRMDomain.Data.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data
{
    public class TemplateData : ITemplateData
    {
        private readonly string _connectionString;
        private IConfiguration _configuration;

        public TemplateData(IConfiguration configuration) {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("defaultConnection");
        }

        public async Task<bool> SaveTemplate(TemplateDto template)
        {
            const string spName = "dbo.Isp_Template_Save";
            IList<CriticalityDto> suppliercriticalitylist = new List<CriticalityDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@TemplateName", template.TemplateName));
                        cmd.Parameters.Add(new SqlParameter("@FilterText", template.FilterText));
                        cmd.Parameters.Add(new SqlParameter("@Query", template.Query));

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

        public async Task<IList<TemplateDto>> SearchTemplate(int templateId)
        {
            const string spName = "dbo.Isp_Template_Search";
            var templatelist = new List<TemplateDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@TemplateId", templateId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var template = new TemplateDto();

                                template.TemplateName = reader["TEMPLATE_NAME"].ToString();
                                template.FilterText = reader["FILTER_TEXT"].ToString();
                                template.Query = reader["QUERY"].ToString();
                                template.TemplateId = Convert.ToInt32(reader["TEMPLATE_ID"].ToString());

                                templatelist.Add(template);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return templatelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<SupplierDto>> SearchTemplateQueryData(int templateId, string role, string type)
        {
            const string spName = "dbo.Isp_TemplateQueryData_Get_ITEM";
            var supplierlist = new List<SupplierDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@TemplateId", templateId));
                        cmd.Parameters.Add(new SqlParameter("@rolename", role));
                        cmd.Parameters.Add(new SqlParameter("@type", type));
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
                                supplier.noOfYears = Convert.ToInt32(reader["NO_OF_YEARS"].ToString() != "" ? reader["NO_OF_YEARS"].ToString() : "0");
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

        public async Task<MasterDataDto> GetMasterData()
        {
            const string spName = "dbo.Isp_Master_Search";
            var templatelist = new MasterDataDto();

            DataTable table1;
            DataTable table2;
            DataTable table3;
            DataTable table4;
            DataTable table5;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        await sql.OpenAsync();

                        var ds = new DataSet();
                        using (var da = new SqlDataAdapter(cmd))
                        {
                            da.Fill(ds);
                            table1 = ds.Tables[0];
                            table2 = ds.Tables[1];
                            table3 = ds.Tables[2];
                            table4 = ds.Tables[3];
                            table5 = ds.Tables[4];
                        }

                        List<CountryMaster> countryList = new List<CountryMaster>();
                        for (int i = 0; i < table1.Rows.Count; i++)
                        {
                            CountryMaster country = new CountryMaster();
                            country.CountryCode = table1.Rows[i]["COUNTRY_CODE"].ToString();
                            country.CountryCode3 = table1.Rows[i]["COUNTRY_CODE3"].ToString();
                            country.Description = table1.Rows[i]["DESCRIPTION"].ToString();
                            countryList.Add(country);
                        }

                        List<BankMasterDto> bankList = new List<BankMasterDto>();
                        for (int i = 0; i < table2.Rows.Count; i++)
                        {
                            BankMasterDto bank = new BankMasterDto();
                            bank.BicCode = table2.Rows[i]["BIC_CODE"].ToString();
                            bank.Description = table2.Rows[i]["BANK_NAME"].ToString();
                            bank.City = table2.Rows[i]["CITY"].ToString();
                            bank.Country = table2.Rows[i]["COUNTRY"].ToString();
                            bankList.Add(bank);
                        }

                        List<CurrencyMasterDto> currencyList = new List<CurrencyMasterDto>();
                        for (int i = 0; i < table3.Rows.Count; i++)
                        {
                            CurrencyMasterDto currency = new CurrencyMasterDto();
                            currency.CurrencyCode = table3.Rows[i]["CURRENCY_CODE"].ToString();
                            currency.Description = table3.Rows[i]["CURRENCY"].ToString();
                            currencyList.Add(currency);
                        }

                        List<CityMasterDto> cityList = new List<CityMasterDto>();
                        for (int i = 0; i < table4.Rows.Count; i++)
                        {
                            CityMasterDto city = new CityMasterDto();
                            city.CountryCode = table4.Rows[i]["COUNTRY_CODE"].ToString();
                            city.CityName = table4.Rows[i]["CITY_NAME"].ToString();
                            city.CountryName = table4.Rows[i]["COUNTRY_NAME"].ToString();
                            cityList.Add(city);
                        }
                        SettingsMasterDto settings = new SettingsMasterDto();
                        settings.CategoryLimit = table5.Rows[0]["MAX_CATEGORY_LIMIT"].ToString();
                        settings.DraftLimit = table5.Rows[0]["DRAFT_LIMIT"].ToString();

                        var limit = _configuration["CategoryLimit"];
                        templatelist.CountryList = countryList;
                        templatelist.BankList = bankList;
                        templatelist.CurrencyList = currencyList;
                        templatelist.CityList = cityList;
                        templatelist.CategoryLimit = settings;

                    }
                    sql.CloseAsync();
                }
                return templatelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<UserTemplateStatDto>> SearchUserTemplateStat(string role, string email)
        {
            const string spName = "dbo.Isp_DashboardStatTemplate_Search";

            var statistics = new List<UserTemplateStatDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", role));
                        cmd.Parameters.Add(new SqlParameter("@email", email));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                UserTemplateStatDto stat = new UserTemplateStatDto();

                                stat.templateId = Convert.ToInt32(reader["templateId"].ToString()); 
                                stat.totcount = Convert.ToInt32(reader["recordCount"].ToString()); 
                                stat.templateName = reader["templateName"].ToString();

                                statistics.Add(stat);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return statistics;
            }
            catch (Exception ex)
            {
                return statistics;
            }
        }

        public async Task<IList<TemplateDto>> SearchRemainTemplate(string email)
        {
            const string spName = "dbo.Isp_DashboardUserRemainTemplate_Search";
            var templatelist = new List<TemplateDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@email", email));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var template = new TemplateDto();

                                template.TemplateName = reader["TEMPLATE_NAME"].ToString();
                                template.FilterText = reader["FILTER_TEXT"].ToString();
                                template.Query = reader["QUERY"].ToString();
                                template.TemplateId = Convert.ToInt32(reader["TEMPLATE_ID"].ToString());

                                templatelist.Add(template);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return templatelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveUserTemplate(int templateId, string email)
        {
            const string spName = "dbo.Isp_DashboardUserTemplate_Save";
            IList<CriticalityDto> suppliercriticalitylist = new List<CriticalityDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@email", email));
                        cmd.Parameters.Add(new SqlParameter("@templateId", templateId));

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

        public async Task<bool> DeleteUserTemplate(int templateId, string email)
        {
            const string spName = "dbo.Isp_DashboardUserTemplate_Delete";
            IList<CriticalityDto> suppliercriticalitylist = new List<CriticalityDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@email", email));
                        cmd.Parameters.Add(new SqlParameter("@templateId", templateId));

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

        public async Task<IList<UserDatatableFieldDto>> SearchUserTablefields(string email)
        {
            const string spName = "dbo.Isp_DashboardUserField_Search";
            var templatelist = new List<UserDatatableFieldDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@email", email));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var template = new UserDatatableFieldDto();

                                template.section = reader["SECTION"].ToString();
                                template.selectedColumns = reader["SELECTEDCOLUMNS"].ToString().Split(',').ToList();

                                templatelist.Add(template);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return templatelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveUserField(UserDatatableFieldDto userTemplate, string email)
        {
            const string spName = "dbo.Isp_DashboardUserField_Save";
            IList<CriticalityDto> suppliercriticalitylist = new List<CriticalityDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@email", email));
                        cmd.Parameters.Add(new SqlParameter("@section", userTemplate.section));
                        cmd.Parameters.Add(new SqlParameter("@fields", string.Join(",", userTemplate.selectedColumns)));

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
        public async Task<IList<KpiSupplierDto>> GetKpiData(KpiDto kpi)
        {
            const string spName = "dbo.Isp_Get_KPI_Data";

            var userIdParam = new SqlParameter("@totalCount", SqlDbType.Int);
            userIdParam.Direction = ParameterDirection.Output;

            IList<KpiSupplierDto> supplierlist = new List<KpiSupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.CommandTimeout = 0;
                        cmd.Parameters.Add(new SqlParameter("@startRowIndex", kpi.startindex));
                        cmd.Parameters.Add(new SqlParameter("@pageSize", kpi.pagesize));
                        cmd.Parameters.Add(new SqlParameter("@suppliercode", kpi.suppliercode !=null? kpi.suppliercode:"" ));
                        cmd.Parameters.Add(new SqlParameter("@suppliername", kpi.suppliername !=null? kpi.suppliername : "" ));
                        cmd.Parameters.Add(new SqlParameter("@status", kpi.status != null? kpi.status : "" ));
                        cmd.Parameters.Add(new SqlParameter("@ifscode", kpi.ifscode != null? kpi.ifscode : "" ));
                        cmd.Parameters.Add(new SqlParameter("@location", kpi.location != null? kpi.location : "" ));
                        cmd.Parameters.Add(new SqlParameter("@country", kpi.country != null? kpi.country : "" ));
                        cmd.Parameters.Add(new SqlParameter("@classification", kpi.classification != null? kpi.classification : "" ));
                        cmd.Parameters.Add(new SqlParameter("@createddatefrom", kpi.createdfrom != null? kpi.createdfrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@createddateto", kpi.createdto != null? kpi.createdto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@lastsubmitfrom", kpi.lastsubmitfrom != null? kpi.lastsubmitfrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@lastsubmitto", kpi.lastsubmitto != null? kpi.lastsubmitto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@srmreviewfrom", kpi.srmreviewfrom != null ? kpi.srmreviewfrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@srmreviewto", kpi.srmreviewto != null ? kpi.srmreviewto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@auditcompletefrom", kpi.auditcompletefrom != null ? kpi.auditcompletefrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@auditcompleteto", kpi.auditcompleteto != null ? kpi.auditcompleteto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@srmrecomfrom", kpi.srmrecomfrom != null ? kpi.srmrecomfrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@srmrecomto", kpi.srmrecomto != null ? kpi.srmrecomto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@gmapprovedfrom", kpi.gmapprovedfrom != null ? kpi.gmapprovedfrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@gmapprovedto", kpi.gmapprovedto != null ? kpi.gmapprovedto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@vpapprovedfrom", kpi.vpapprovedfrom != null ? kpi.vpapprovedfrom : "01/01/1800"));
                        cmd.Parameters.Add(new SqlParameter("@vpapprovedto", kpi.vpapprovedto != null ? kpi.vpapprovedto : "01/01/3000"));
                        cmd.Parameters.Add(new SqlParameter("@srmreviewdur", kpi.srmreviewdur != null ? kpi.srmreviewdur : ""));
                        cmd.Parameters.Add(new SqlParameter("@regisdur", kpi.regisdur != null ? kpi.regisdur : ""));
                        cmd.Parameters.Add(new SqlParameter("@auditcom", kpi.auditcom != null ? kpi.auditcom : ""));
                        cmd.Parameters.Add(new SqlParameter("@deptkpi", kpi.deptkpi != null ? kpi.deptkpi : ""));
                        cmd.Parameters.Add(new SqlParameter("@deptkpiResult", kpi.deptkpiResult != null ? kpi.deptkpiResult : ""));
                        cmd.Parameters.Add(new SqlParameter("@srmkpi", kpi.srmkpi != null ? kpi.srmkpi : ""));
                        cmd.Parameters.Add(new SqlParameter("@srmkpiResult", kpi.srmkpiResult != null ? kpi.srmkpiResult : ""));

                        await sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                KpiSupplierDto supplier = new KpiSupplierDto();
                                supplier.SUPPLIER_ID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplier.SUPPLIER_NAME = reader["SUPPLIER_NAME"].ToString();
                                supplier.SUPPLIER_CODE = reader["SUPPLIER_CODE"].ToString();
                                supplier.STATUS = reader["STATUS"].ToString();
                                supplier.IFS_CODE = reader["IFS_CODE"].ToString();
                                supplier.SUPPLIER_LOCATION = reader["SUPPLIER_LOCATION"].ToString();
                                supplier.COUNTRY = reader["COUNTRY"].ToString();
                                supplier.SUPPLIER_CLASSIFICATION = reader["SUPPLIER_CLASSIFICATION"].ToString();
                                supplier.CREATED_DATE = reader["CREATED_DATE"].ToString();
                                supplier.LAST_SUPPLIER_SUBMITTED_DATE = reader["LAST_SUPPLIER_SUBMITTED_DATE"].ToString();
                                supplier.LAST_SRM_REVIEW_DATE = reader["LAST_SRM_REVIEW_DATE"].ToString();
                                supplier.AUDIT_COMPLETION_DATE = reader["AUDIT_COMPLETION_DATE"].ToString();
                                supplier.LAST_SRM_RECOMMANDED_DATE = reader["LAST_SRM_RECOMMANDED_DATE"].ToString();
                                supplier.GM_APPROVED_DATE = reader["GM_APPROVED_DATE"].ToString();
                                supplier.VP_APPROVED_DATE = reader["VP_APPROVED_DATE"].ToString();
                                supplier.SRM_REVIEW_DURATION = reader["SRM_REVIEW_DURATION"].ToString();
                                supplier.REGISTRATION_DURATION = reader["REGISTRATION_DURATION"].ToString();
                                supplier.AUDIT_COMPLETION = reader["AUDIT_COMPLETION"].ToString();
                                supplier.DEPARTMENT_KPI = reader["DEPARTMENT_KPI"].ToString();
                                supplier.DEPARTMENT_KPI_RESULT = reader["DEPARTMENT_KPI_RESULT"].ToString();
                                supplier.SRM_KPI = reader["SRM_KPI"].ToString();
                                supplier.SRM_KPI_RESULT = reader["SRM_KPI_RESULT"].ToString();
                                supplier.TOT_COUNT = Convert.ToInt32(reader["TOTAL_COUNT"].ToString());


                                supplierlist.Add(supplier);
                            }


                        }
                        sql.CloseAsync();
                    }
                    return supplierlist;
                }
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
                                settings.ExpiryLimit = reader["EXP_LIMIT"].ToString();
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

        public async Task<bool> SaveSettingsData(SettingsMasterDto settings)
        {
            const string spName = "dbo.Isp_Setting_Save";

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@maxcatlimit", Convert.ToInt32(settings.CategoryLimit))); 
                        cmd.Parameters.Add(new SqlParameter("@draftlimit", Convert.ToInt32(settings.DraftLimit)));
                        cmd.Parameters.Add(new SqlParameter("@explimit", Convert.ToInt32(settings.ExpiryLimit)));

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
    }
}
