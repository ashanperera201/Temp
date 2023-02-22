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
using Newtonsoft.Json;
using System.Text.RegularExpressions;


namespace SRMDomain.Data
{
    public class SupplierData : ISupplierData
    {
        private readonly string _connectionString;
        private IConfiguration configuration;

        public SupplierData(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("defaultConnection");

        public async Task<IList<CriticalityDto>> GetCriticality(string supplierId)
        {
            const string spName = "dbo.Isp_CriticalityData_Search";
            IList<CriticalityDto> suppliercriticalitylist = new List<CriticalityDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                CriticalityDto suppliercriticality = new CriticalityDto();

                                suppliercriticality.check = true;
                                suppliercriticality.position = reader["SEQUENCE"].ToString();
                                suppliercriticality.scope = reader["CRITICALITY_SELECTION"].ToString();

                                suppliercriticalitylist.Add(suppliercriticality);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return suppliercriticalitylist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<EmergencySupplierDto>> GetEmergencySupplier(string supplierId)
        {
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
                                supplieremergency.emergency_supplier_code = reader["EMERGENCY_SUPPLIER_CODE"].ToString();
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
                                supplieremergency.cr_no = reader["CR_NO"].ToString();
                                supplieremergency.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplieremergency.justification = reader["JUSTIFICATION"].ToString();
                                supplieremergency.srm_remark = reader["SRM_REMARK"].ToString();
                                supplieremergency.workflow_id = reader["WORKFLOW_DOC_ID"].ToString();
                                supplieremergency.process_id = reader["PROCESS_ID"].ToString();
                                supplieremergency.status = reader["SUPPLIER_STATUS"].ToString();
                                supplieremergency.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                supplieremergency.invite_by = reader["INVITE_BY"].ToString();
                                supplieremergency.invite_by_email = reader["INVITE_BY_EMAIL"].ToString();
                                supplieremergency.invite_by_role = reader["INVITE_BY_ROLE"].ToString();
                                supplieremergency.vat_no = reader["VAT_NO"].ToString();
                                supplieremergency.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplieremergency.ifs_pushed_status = reader["PUSHEDSUPPLIERSTATUS"].ToString(); ;

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

        public async Task<IList<EmergencySupplierDto>> SearchEmergencyForRole(string role)
        {
            const string spName = "dbo.Isp_SupplierPendingForRoleForEmerg_Search";
            IList<EmergencySupplierDto> supplierlist = new List<EmergencySupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", role != null ? role : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                EmergencySupplierDto supplieremergency = new EmergencySupplierDto();

                                supplieremergency.supplier_id = Convert.ToInt32(reader["EMERGENCY_SUPPLIER_ID"].ToString());
                                supplieremergency.emergency_supplier_code = reader["EMERGENCY_SUPPLIER_CODE"].ToString();
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
                                supplieremergency.cr_no = reader["CR_NO"].ToString();
                                supplieremergency.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplieremergency.justification = reader["JUSTIFICATION"].ToString();
                                supplieremergency.workflow_id = reader["WORKFLOW_DOC_ID"].ToString();
                                supplieremergency.process_id = reader["PROCESS_ID"].ToString();
                                supplieremergency.status = reader["SUPPLIER_STATUS"].ToString();
                                supplieremergency.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                supplieremergency.invite_by = reader["INVITE_BY"].ToString();
                                supplieremergency.invite_by_email = reader["INVITE_BY_EMAIL"].ToString();
                                supplieremergency.invite_by_role = reader["INVITE_BY_ROLE"].ToString();
                                supplieremergency.vat_no = reader["VAT_NO"].ToString();
                                supplieremergency.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplieremergency.ifs_pushed_status = reader["PUSHEDSUPPLIERSTATUS"].ToString();
                                supplieremergency.srm_remark = reader["SRM_REMARK"].ToString();

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

        public async Task<bool> SaveCriticality(CriticalityDto criticality, int supplierId)
        {
            const string spName = "dbo.Isp_CriticalityValue_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@Sequence", criticality.position));
                        cmd.Parameters.Add(new SqlParameter("@CriticalitySelection", criticality.scope));
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

        public async Task<bool> DeleteCriticality(int supplierId)
        {
            const string spName = "dbo.Isp_CriticalityValue_Delete";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
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

        public async Task<bool> UpdateSupplierCategory(SupplierCategoryDto category, int supplierId)
        {
            const string spName = "dbo.Isp_SupplierCategory_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@IsSrmSelected", category.isSRMChecked == "Yes" ? 1 : 0));
                        cmd.Parameters.Add(new SqlParameter("@position", category.position));
                        cmd.Parameters.Add(new SqlParameter("@IsAuditSelected", category.isSRMChecked == "Yes" ? 1 : 0));
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

        public async Task<bool> SaveSupplierWorkflowData(WorkflowDto workflow)
        {
            const string spName = "dbo.Isp_SupplierWorkflow_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", workflow.SUPPLIER_ID));
                        cmd.Parameters.Add(new SqlParameter("@WorkflowId", workflow.DOCID));
                        cmd.Parameters.Add(new SqlParameter("@ProcessId", workflow.PROCESSID));
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

        public async Task<int> SaveEmergency(EmergencySupplierDto emergency)
        {
            const string spName = "dbo.Isp_EmergencySupplier_Save";
            var result = 0;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@EmergencySupplierName", emergency.emergency_supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@EstablishmentYear", emergency.establishment_year != null ? emergency.establishment_year : ""));
                        cmd.Parameters.Add(new SqlParameter("@SupplierType", emergency.supplier_type != null ? String.Join(',', emergency.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@Country", emergency.country));
                        cmd.Parameters.Add(new SqlParameter("@City", emergency.city));
                        cmd.Parameters.Add(new SqlParameter("@OtherCity", emergency.other_city != null ? emergency.other_city : ""));
                        cmd.Parameters.Add(new SqlParameter("@PoBox", emergency.po_box != null ? emergency.po_box : ""));
                        cmd.Parameters.Add(new SqlParameter("@PostalCode", emergency.postal_code != null ? emergency.postal_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@AddressLine1", emergency.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@AddressLine2", emergency.address_line2 != null ? emergency.address_line2 : ""));
                        cmd.Parameters.Add(new SqlParameter("@Title", emergency.title));
                        cmd.Parameters.Add(new SqlParameter("@FirstName", emergency.first_name));
                        cmd.Parameters.Add(new SqlParameter("@LastName", emergency.last_name));
                        cmd.Parameters.Add(new SqlParameter("@Position", emergency.position));
                        cmd.Parameters.Add(new SqlParameter("@TelephoneCountryCode", emergency.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@TelephoneNo", emergency.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@Extention", emergency.extension != null ? emergency.extension : ""));
                        cmd.Parameters.Add(new SqlParameter("@Email", emergency.email));
                        cmd.Parameters.Add(new SqlParameter("@MobileCountryCode", emergency.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@MobileNo", emergency.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@FaxCountryCode", emergency.fax_country_code != null ? emergency.fax_country_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@FaxNo", emergency.fax_no != null ? emergency.fax_no : ""));
                        cmd.Parameters.Add(new SqlParameter("@CRNo", emergency.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@CRExpDate", emergency.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@Justification", emergency.justification));
                        cmd.Parameters.Add(new SqlParameter("@SrmRemark", emergency.srm_remark));
                        cmd.Parameters.Add(new SqlParameter("@CreatedDateTime", emergency.create_date_time));
                        cmd.Parameters.Add(new SqlParameter("@InviteBy", emergency.invite_by != null ? emergency.invite_by : ""));
                        cmd.Parameters.Add(new SqlParameter("@InviteByEmail", emergency.invite_by_email));
                        cmd.Parameters.Add(new SqlParameter("@InviteByRole", emergency.invite_by_role));
                        cmd.Parameters.Add(new SqlParameter("@VatNo", emergency.vat_no != null ? emergency.vat_no : ""));

                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", emergency.supplier_id));
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        result = Convert.ToInt32(returnParameter.Value);
                    }
                    sql.CloseAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public async Task<bool> UpdateCriticality(SupplierCriticalityDto criticality)
        {
            const string spName = "dbo.Isp_SupplierCriticality_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", criticality.SUPPLIER_ID));
                        cmd.Parameters.Add(new SqlParameter("@CriticalityValue", criticality.Criticality_Value));
                        cmd.Parameters.Add(new SqlParameter("@Status", criticality.Status));
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

        public async Task<int> UpdateEmergency(EmergencySupplierDto emergency)
        {
            const string spName = "dbo.Isp_EmergencySupplier_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", emergency.supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@EmergencySupplierName", emergency.emergency_supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@EstablishmentYear", emergency.establishment_year != null ? emergency.establishment_year : ""));
                        cmd.Parameters.Add(new SqlParameter("@SupplierType", emergency.supplier_type != null ? String.Join(',', emergency.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@Country", emergency.country));
                        cmd.Parameters.Add(new SqlParameter("@City", emergency.city));
                        cmd.Parameters.Add(new SqlParameter("@OtherCity", emergency.other_city != null ? emergency.other_city : ""));
                        cmd.Parameters.Add(new SqlParameter("@PoBox", emergency.po_box != null ? emergency.po_box : ""));
                        cmd.Parameters.Add(new SqlParameter("@PostalCode", emergency.postal_code != null ? emergency.postal_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@AddressLine1", emergency.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@AddressLine2", emergency.address_line2 != null ? emergency.address_line2 : ""));
                        cmd.Parameters.Add(new SqlParameter("@Title", emergency.title));
                        cmd.Parameters.Add(new SqlParameter("@FirstName", emergency.first_name));
                        cmd.Parameters.Add(new SqlParameter("@LastName", emergency.last_name));
                        cmd.Parameters.Add(new SqlParameter("@Position", emergency.position));
                        cmd.Parameters.Add(new SqlParameter("@TelephoneCountryCode", emergency.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@TelephoneNo", emergency.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@Extention", emergency.extension != null ? emergency.extension : ""));
                        cmd.Parameters.Add(new SqlParameter("@Email", emergency.email));
                        cmd.Parameters.Add(new SqlParameter("@MobileCountryCode", emergency.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@MobileNo", emergency.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@FaxCountryCode", emergency.fax_country_code));
                        cmd.Parameters.Add(new SqlParameter("@FaxNo", emergency.fax_no != null ? emergency.fax_no : ""));
                        cmd.Parameters.Add(new SqlParameter("@CRNo", emergency.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@CRExpDate", emergency.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@Justification", emergency.justification));
                        cmd.Parameters.Add(new SqlParameter("@SrmRemark", emergency.srm_remark));
                        cmd.Parameters.Add(new SqlParameter("@VatNo", emergency.vat_no != null ? emergency.vat_no : ""));

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return emergency.supplier_id;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }

        public async Task<bool> UpdateEmergencyStatus(EmergencyStatusDto emergency)
        {
            const string spName = "dbo.Isp_EmergencySupplierStatus_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", emergency.supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@Status", emergency.status));

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

        public async Task<IList<EmergencySupplierDto>> GetPendingEmergencySupplier(string workflowId)
        {
            const string spName = "dbo.Isp_PendingEmergencySupplier_Search";
            IList<EmergencySupplierDto> supplierlist = new List<EmergencySupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@WorkflowId", workflowId));
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
                                supplieremergency.cr_exp_date = reader["JUSTIFICATION"].ToString(); ;
                                supplieremergency.justification = reader["CR_EXP_DATE"].ToString(); ;
                                supplieremergency.cr_exp_date = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                supplieremergency.cr_exp_date = reader["PROCESS_ID"].ToString(); ;
                                supplieremergency.cr_exp_date = reader["STATUS"].ToString(); ;

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

        public async Task<bool> UpdateEmergencyWorkflow(WorkflowDto workflow)
        {
            const string spName = "dbo.Isp_EmergencySupplierWorkflow_Update";

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", Convert.ToInt32(workflow.SUPPLIER_ID)));
                        cmd.Parameters.Add(new SqlParameter("@WorkflowId", workflow.DOCID));
                        cmd.Parameters.Add(new SqlParameter("@ProcessId", workflow.PROCESSID));

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
        public async Task<IList<EmergencyApprovedItems>> GetEmergencyApprovedItems(string supplierId)
        {
            const string spName = "dbo.Isp_EmergencySupplierApproveItem_Search";
            IList<EmergencyApprovedItems> supplierlist = new List<EmergencyApprovedItems>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                EmergencyApprovedItems supplieremergency = new EmergencyApprovedItems();

                                supplieremergency.SupplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplieremergency.Status = reader["STATUS"].ToString();
                                supplieremergency.CURRENT_POSITION = reader["CURRENT_POSITION"].ToString();
                                supplieremergency.DUE_DATE = Convert.ToDateTime(reader["DUE_DATE"].ToString());
                                supplieremergency.HANDLE_BEFORE = Convert.ToDateTime(reader["HANDLE_BEFORE"].ToString());
                                supplieremergency.HANDLE_DATE = Convert.ToDateTime(reader["HANDLE_DATE"].ToString());
                                supplieremergency.OUTCOME = Convert.ToDateTime(reader["OUTCOME"].ToString());
                                supplieremergency.OUTCOME_REASON = reader["OUTCOME_REASON"].ToString();
                                supplieremergency.USERID = reader["USERID"].ToString();
                                supplieremergency.USERROLE = reader["USERROLE"].ToString();
                                supplieremergency.CREATEDDATE = Convert.ToDateTime(reader["CREATEDDATE"].ToString());
                                supplieremergency.Action_Command = reader["ACTION_COMMAND"].ToString();

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

        public async Task<bool> SaveEmergencyApprovedItem(EmergencyApprovedItems item)
        {
            const string spName = "dbo.Isp_EmergencySupplierApproveItem_Save";
            IList<CriticalityDto> suppliercriticalitylist = new List<CriticalityDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", item.SupplierId));
                        cmd.Parameters.Add(new SqlParameter("@Status", item.Status));
                        cmd.Parameters.Add(new SqlParameter("@CurrentPosition", item.CURRENT_POSITION));
                        //cmd.Parameters.Add(new SqlParameter("@DueDate", new DateTime()));
                        //cmd.Parameters.Add(new SqlParameter("@HandleBefore", new DateTime()));
                        //cmd.Parameters.Add(new SqlParameter("@HandleDate", new DateTime()));
                        //cmd.Parameters.Add(new SqlParameter("@OutCome", new DateTime()));
                        cmd.Parameters.Add(new SqlParameter("@OutcomeReason", item.OUTCOME_REASON != null ? item.OUTCOME_REASON : ""));
                        cmd.Parameters.Add(new SqlParameter("@UserId", item.USERID));
                        cmd.Parameters.Add(new SqlParameter("@UserRole", item.USERROLE));
                        cmd.Parameters.Add(new SqlParameter("@Command", item.Action_Command));

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

        public async Task<int> SaveInvite(InviteSupplierDto invite)
        {
            const string spName = "dbo.Isp_InviteSupplier_Save";
            var result = 0;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@inviteSupplierName", invite.invite_supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@EstablishmentYear", invite.establishment_year != null ? invite.establishment_year : ""));
                        cmd.Parameters.Add(new SqlParameter("@InviteSupplierType", invite.supplier_type != null ? String.Join(',', invite.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@Country", invite.country != null ? invite.country : ""));
                        cmd.Parameters.Add(new SqlParameter("@City", invite.city != null ? invite.city : ""));
                        cmd.Parameters.Add(new SqlParameter("@OtherCity", invite.other_city != null ? invite.other_city : ""));
                        cmd.Parameters.Add(new SqlParameter("@PoBox", invite.po_box != null ? invite.po_box : ""));
                        cmd.Parameters.Add(new SqlParameter("@PostalCode", invite.postal_code != null ? invite.postal_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@AddressLine1", invite.address_line1 != null ? invite.address_line1 : ""));
                        cmd.Parameters.Add(new SqlParameter("@AddressLine2", invite.address_line2 != null ? invite.address_line2 : ""));
                        cmd.Parameters.Add(new SqlParameter("@Title", invite.title));
                        cmd.Parameters.Add(new SqlParameter("@FirstName", invite.first_name));
                        cmd.Parameters.Add(new SqlParameter("@LastName", invite.last_name));
                        cmd.Parameters.Add(new SqlParameter("@Position", invite.position != null ? invite.position : ""));
                        cmd.Parameters.Add(new SqlParameter("@TelephoneCountryCode", invite.telphone_country_code != null ? invite.telphone_country_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@TelephoneNo", invite.telephone_no != null ? invite.telephone_no : ""));
                        cmd.Parameters.Add(new SqlParameter("@Extention", invite.extension != null ? invite.extension : ""));
                        cmd.Parameters.Add(new SqlParameter("@Email", invite.email));
                        cmd.Parameters.Add(new SqlParameter("@MobileCountryCode", invite.mobile_country_code != null ? invite.mobile_country_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@MobileNo", invite.mobile_no != null ? invite.mobile_no : ""));
                        cmd.Parameters.Add(new SqlParameter("@FaxCountryCode", invite.fax_country_code != null ? invite.fax_country_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@FaxNo", invite.fax_no != null ? invite.fax_no : ""));
                        cmd.Parameters.Add(new SqlParameter("@CRNo", invite.cr_no != null ? invite.cr_no : ""));
                        cmd.Parameters.Add(new SqlParameter("@CRExpDate", invite.cr_exp_date != null ? invite.cr_exp_date : ""));
                        cmd.Parameters.Add(new SqlParameter("@Justification", invite.justification != null ? invite.justification : ""));
                        cmd.Parameters.Add(new SqlParameter("@CreatedDateTime", invite.create_date_time));
                        cmd.Parameters.Add(new SqlParameter("@InviteBy", invite.invite_by));
                        cmd.Parameters.Add(new SqlParameter("@InviteByEmail", invite.invite_by_email));
                        cmd.Parameters.Add(new SqlParameter("@InviteByRole", invite.invite_by_role));

                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", 0));
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        result = Convert.ToInt32(returnParameter.Value);

                    }
                    sql.CloseAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return result;
            }
        }

        public async Task<IList<InviteSupplierDto>> GetInviteSupplier(string supplierId)
        {
            const string spName = "dbo.Isp_InviteSupplier_Search";
            IList<InviteSupplierDto> supplierlist = new List<InviteSupplierDto>();

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
                                InviteSupplierDto supplierInvite = new InviteSupplierDto();

                                supplierInvite.invite_supplier_id = Convert.ToInt32(reader["INVITE_SUPPLIER_ID"].ToString());
                                supplierInvite.invite_supplier_name = reader["INVITE_SUPPLIER_NAME"].ToString();
                                supplierInvite.email = reader["EMAIL"].ToString();
                                supplierInvite.establishment_year = reader["ESTABLISHMENT_YEAR"].ToString();
                                supplierInvite.supplier_type = reader["INVITE_SUPPLIER_TYPE"].ToString().Split(',');
                                supplierInvite.country = reader["COUNTRY"].ToString();
                                supplierInvite.city = reader["CITY"].ToString();
                                supplierInvite.other_city = reader["OTHER_CITY"].ToString();
                                supplierInvite.po_box = reader["PO_BOX"].ToString();
                                supplierInvite.postal_code = reader["POSTAL_CODE"].ToString();
                                supplierInvite.address_line1 = reader["ADDRESS_LINE1"].ToString();
                                supplierInvite.address_line2 = reader["ADDRESS_LINE2"].ToString();
                                supplierInvite.title = reader["TITLE"].ToString();
                                supplierInvite.first_name = reader["FIRST_NAME"].ToString();
                                supplierInvite.last_name = reader["LAST_NAME"].ToString();
                                supplierInvite.telphone_country_code = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplierInvite.telephone_no = reader["TELEPHONE_NO"].ToString();
                                supplierInvite.extension = reader["EXTENSION"].ToString();
                                supplierInvite.position = reader["POSITION"].ToString();
                                supplierInvite.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplierInvite.mobile_no = reader["MOBILE_NO"].ToString();
                                supplierInvite.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplierInvite.fax_no = reader["FAX_NO"].ToString();
                                supplierInvite.cr_no = reader["CR_NO"].ToString();
                                supplierInvite.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplierInvite.justification = reader["JUSTIFICATION"].ToString();
                                //supplierInvite.workflow_id = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                //supplierInvite.process_id = reader["PROCESS_ID"].ToString(); ;
                                //supplierInvite.status = reader["STATUS"].ToString(); ;
                                supplierInvite.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                supplierInvite.invite_by = reader["INVITE_BY"].ToString();
                                supplierInvite.invite_by_email = reader["INVITE_BY_EMAIL"].ToString();
                                supplierInvite.invite_by_role = reader["INVITE_BY_ROLE"].ToString();
                                supplierInvite.re_invite_by = reader["RE_INVITE_BY"].ToString();
                                supplierInvite.re_invite_by_email = reader["RE_INVITE_BY_EMAIL"].ToString();
                                supplierInvite.re_invite_by_role = reader["RE_INVITE_BY_ROLE"].ToString();
                                supplierInvite.re_invite_date_time = reader["RE_INVITE_DATE_TIME"].ToString();

                                supplierlist.Add(supplierInvite);
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

        public async Task<int> UpdateInvite(InviteSupplierDto invite)
        {
            const string spName = "dbo.Isp_InviteSupplier_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", invite.invite_supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@Email", invite.email != null ? invite.email : ""));
                        // cmd.Parameters.Add(new SqlParameter("@inviteSupplierName", invite.invite_supplier_name));
                        // cmd.Parameters.Add(new SqlParameter("@EstablishmentYear", invite.establishment_year));
                        // cmd.Parameters.Add(new SqlParameter("@SupplierType", invite.supplier_type != null ? String.Join(',', invite.supplier_type) : ""));
                        // cmd.Parameters.Add(new SqlParameter("@Country", invite.country));
                        // cmd.Parameters.Add(new SqlParameter("@City", invite.city));
                        // cmd.Parameters.Add(new SqlParameter("@OtherCity", invite.other_city));
                        // cmd.Parameters.Add(new SqlParameter("@PoBox", invite.po_box));
                        // cmd.Parameters.Add(new SqlParameter("@PostalCode", invite.postal_code));
                        // cmd.Parameters.Add(new SqlParameter("@AddressLine1", invite.address_line1));
                        // cmd.Parameters.Add(new SqlParameter("@AddressLine2", invite.address_line2));
                        // cmd.Parameters.Add(new SqlParameter("@Title", invite.title));
                        // cmd.Parameters.Add(new SqlParameter("@FirstName", invite.first_name));
                        // cmd.Parameters.Add(new SqlParameter("@LastName", invite.last_name));
                        // cmd.Parameters.Add(new SqlParameter("@Position", invite.position));
                        // cmd.Parameters.Add(new SqlParameter("@TelephoneCountryCode", invite.telphone_country_code));
                        // cmd.Parameters.Add(new SqlParameter("@TelephoneNo", invite.telephone_no));
                        // cmd.Parameters.Add(new SqlParameter("@Extention", invite.extension));
                        // cmd.Parameters.Add(new SqlParameter("@MobileCountryCode", invite.mobile_country_code));
                        // cmd.Parameters.Add(new SqlParameter("@MobileNo", invite.mobile_no));
                        // cmd.Parameters.Add(new SqlParameter("@FaxCountryCode", invite.fax_country_code));
                        // cmd.Parameters.Add(new SqlParameter("@FaxNo", invite.fax_no));
                        // cmd.Parameters.Add(new SqlParameter("@CRNo", invite.cr_no));
                        // cmd.Parameters.Add(new SqlParameter("@CRExpDate", invite.cr_exp_date));
                        // cmd.Parameters.Add(new SqlParameter("@Justification", invite.justification)); invite.telphone_country_code != null ? invite.telphone_country_code : ""));
                        cmd.Parameters.Add(new SqlParameter("@ReInviteDateTime", invite.re_invite_date_time != null ? invite.re_invite_date_time : ""));
                        cmd.Parameters.Add(new SqlParameter("@ReInviteBy", invite.re_invite_by != null ? invite.re_invite_by : ""));
                        cmd.Parameters.Add(new SqlParameter("@ReInviteEmail", invite.re_invite_by_email != null ? invite.re_invite_by_email : ""));
                        cmd.Parameters.Add(new SqlParameter("@ReInviteByRole", invite.re_invite_by_role != null ? invite.re_invite_by_role : ""));

                        cmd.Parameters.Add(new SqlParameter("@UpdateDateTime", invite.update_date_time != null ? invite.update_date_time : ""));
                        cmd.Parameters.Add(new SqlParameter("@UpdateBy", invite.update_by != null ? invite.update_by : ""));
                        cmd.Parameters.Add(new SqlParameter("@UpdateEmail", invite.update_by_email != null ? invite.update_by_email : ""));
                        cmd.Parameters.Add(new SqlParameter("@UpdateByRole", invite.update_by_role != null ? invite.update_by_role : ""));

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return invite.invite_supplier_id;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<int> SaveSupplier(SupplierDto supplier)
        {
            const string spName = "dbo.Isp_Supplier_Save";
            var result = 0;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplier_name", supplier.supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@supplier_name_arabic", supplier.supplier_name_arabic));
                        cmd.Parameters.Add(new SqlParameter("@establishment_year", supplier.establishment_year));
                        cmd.Parameters.Add(new SqlParameter("@issued_by", supplier.issued_by));
                        cmd.Parameters.Add(new SqlParameter("@web_site", supplier.web_site));
                        cmd.Parameters.Add(new SqlParameter("@supplier_type", supplier.supplier_type != null ? String.Join(',', supplier.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@country", supplier.country));
                        cmd.Parameters.Add(new SqlParameter("@city", supplier.city));
                        cmd.Parameters.Add(new SqlParameter("@other_city", supplier.other_city));
                        cmd.Parameters.Add(new SqlParameter("@po_box", supplier.po_box));
                        cmd.Parameters.Add(new SqlParameter("@postal_code", supplier.postal_code));
                        cmd.Parameters.Add(new SqlParameter("@address_line1", supplier.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@address_line2", supplier.address_line2));
                        cmd.Parameters.Add(new SqlParameter("@title", supplier.title));
                        cmd.Parameters.Add(new SqlParameter("@first_name", supplier.first_name));
                        cmd.Parameters.Add(new SqlParameter("@last_name", supplier.last_name));
                        cmd.Parameters.Add(new SqlParameter("@position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code", supplier.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no", supplier.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@extension", supplier.extension));
                        cmd.Parameters.Add(new SqlParameter("@email", supplier.email));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code", supplier.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no", supplier.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code", supplier.fax_country_code));
                        cmd.Parameters.Add(new SqlParameter("@fax_no", supplier.fax_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_no", supplier.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_exp_date", supplier.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@additional_material", supplier.additional_material));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org", supplier.typeOfOrganization));
                        cmd.Parameters.Add(new SqlParameter("@no_of_manager", supplier.managerialno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_operation", supplier.operationsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_technical", supplier.technicalno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_saudi", supplier.saudiNationalsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_total", supplier.totallno));
                        cmd.Parameters.Add(new SqlParameter("@parent_company_info", supplier.parentcompany));
                        //cmd.Parameters.Add(new SqlParameter("@affiliated_company_info", supplier.affiliated_company_info));
                        cmd.Parameters.Add(new SqlParameter("@owner_info", supplier.ownercompany));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year1", supplier.finance_status_year1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value1", supplier.finance_status_value1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year2", supplier.finance_status_year2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value2", supplier.finance_status_value2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year3", supplier.finance_status_year3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value3", supplier.finance_status_value3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year4", supplier.finance_status_year4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value4", supplier.finance_status_value4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year5", supplier.finance_status_year5));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value5", supplier.finance_status_value5));
                        cmd.Parameters.Add(new SqlParameter("@no_of_years", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@vat_no", supplier.vat_no));
                        cmd.Parameters.Add(new SqlParameter("@gosi_certificate", supplier.gosi_certificate));
                        cmd.Parameters.Add(new SqlParameter("@reg_date", supplier.reg_date));
                        cmd.Parameters.Add(new SqlParameter("@gosi_date", supplier.gosi_date));
                        cmd.Parameters.Add(new SqlParameter("@saudi_date", supplier.saudi_date));
                        cmd.Parameters.Add(new SqlParameter("@zakath_date", supplier.zakath_date));
                        cmd.Parameters.Add(new SqlParameter("@parentcompany", supplier.parentcompany));
                        cmd.Parameters.Add(new SqlParameter("@sistercompany", supplier.sistercompany));
                        cmd.Parameters.Add(new SqlParameter("@ownercompany", supplier.ownercompany));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit1", supplier.operatingProfit1));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit2", supplier.operatingProfit2));
                        cmd.Parameters.Add(new SqlParameter("@netIncome1", supplier.netIncome1));
                        cmd.Parameters.Add(new SqlParameter("@netIncome2", supplier.netIncome2));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset1", supplier.currentAsset1));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset2", supplier.currentAsset2));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable1", supplier.totalLiable1));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable2", supplier.totalLiable2));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity1", supplier.totalEquity1));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity2", supplier.totalEquity2));
                        cmd.Parameters.Add(new SqlParameter("@noOfYears", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@ownsPlantEquip", supplier.ownsPlantEquip));
                        cmd.Parameters.Add(new SqlParameter("@designnCap", supplier.designnCap));
                        cmd.Parameters.Add(new SqlParameter("@finishProd", supplier.finishProd));
                        cmd.Parameters.Add(new SqlParameter("@internalPolicy", supplier.internalPolicy));
                        cmd.Parameters.Add(new SqlParameter("@registeredOrg", supplier.registeredOrg));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj1", supplier.suspendedProj1));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj2", supplier.suspendedProj2));
                        cmd.Parameters.Add(new SqlParameter("@litigation1", supplier.litigation1));
                        cmd.Parameters.Add(new SqlParameter("@litigation2", supplier.litigation2));
                        cmd.Parameters.Add(new SqlParameter("@compliance1", supplier.compliance1));
                        cmd.Parameters.Add(new SqlParameter("@compliance2", supplier.compliance2));
                        cmd.Parameters.Add(new SqlParameter("@shareholder1", supplier.shareholder1));
                        cmd.Parameters.Add(new SqlParameter("@shareholder2", supplier.shareholder2));
                        cmd.Parameters.Add(new SqlParameter("@labour1", supplier.labour1));
                        cmd.Parameters.Add(new SqlParameter("@labour2", supplier.labour2));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset1", supplier.legalAsset1));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset2", supplier.legalAsset2));
                        cmd.Parameters.Add(new SqlParameter("@environment1", supplier.environment1));
                        cmd.Parameters.Add(new SqlParameter("@environment2", supplier.environment2));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested1", supplier.imiInterested1));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested2", supplier.imiInterested2));
                        cmd.Parameters.Add(new SqlParameter("@hse1", supplier.hse1));
                        cmd.Parameters.Add(new SqlParameter("@hse2", supplier.hse2));
                        cmd.Parameters.Add(new SqlParameter("@docuHse", supplier.docuHse));
                        cmd.Parameters.Add(new SqlParameter("@isohealth", supplier.isohealth));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt1", supplier.envtMgt1));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt2", supplier.envtMgt2));
                        cmd.Parameters.Add(new SqlParameter("@dedicatedpers", supplier.dedicatedpers));
                        cmd.Parameters.Add(new SqlParameter("@statistic", supplier.statistic));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy1", supplier.qualityPolicy1));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy2", supplier.qualityPolicy2));
                        cmd.Parameters.Add(new SqlParameter("@qualityMgt", supplier.qualityMgt));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp1", supplier.qualityResp1));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp2", supplier.qualityResp2));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp3", supplier.qualityResp3));
                        cmd.Parameters.Add(new SqlParameter("@hijriSelected", supplier.hijriSelected));
                        cmd.Parameters.Add(new SqlParameter("@bankCountryCodes", supplier.bankCountryCodes));
                        cmd.Parameters.Add(new SqlParameter("@bankName", supplier.bankName != null ? supplier.bankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@otherBankName", supplier.otherBankName != null ? supplier.otherBankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@swiftcode", supplier.swiftcode));
                        cmd.Parameters.Add(new SqlParameter("@accountHolderName", supplier.accountHolderName));
                        cmd.Parameters.Add(new SqlParameter("@ibanNo", supplier.ibanNo));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress", supplier.bankAddress));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress2", supplier.bankAddress2));
                        cmd.Parameters.Add(new SqlParameter("@accountCurrency", supplier.accountCurrency));
                        cmd.Parameters.Add(new SqlParameter("@account_number", supplier.account_number));
                        cmd.Parameters.Add(new SqlParameter("@static_near", supplier.statisticNear));
                        cmd.Parameters.Add(new SqlParameter("@static_first", supplier.statisticFirst));
                        cmd.Parameters.Add(new SqlParameter("@static_medi", supplier.statisticMedical));
                        cmd.Parameters.Add(new SqlParameter("@static_lost", supplier.statisticLost));
                        cmd.Parameters.Add(new SqlParameter("@static_fatal", supplier.statisticFatal));
                        cmd.Parameters.Add(new SqlParameter("@hse_name", supplier.hseName));
                        cmd.Parameters.Add(new SqlParameter("@hse_desig", supplier.hseDesig));
                        cmd.Parameters.Add(new SqlParameter("@quality_name", supplier.qualityName != null ? supplier.qualityName : ""));
                        cmd.Parameters.Add(new SqlParameter("@quality_desig", supplier.qualityDesig != null ? supplier.qualityDesig : ""));
                        cmd.Parameters.Add(new SqlParameter("@qualitymgt_iso", supplier.qualityMgtIso));
                        cmd.Parameters.Add(new SqlParameter("@statisticEnvt", supplier.statisticEnvt));
                        cmd.Parameters.Add(new SqlParameter("@qualityreviewDate", supplier.qualityreviewDate != null ? supplier.qualityreviewDate : ""));
                        cmd.Parameters.Add(new SqlParameter("@multicurrency", supplier.multicurrency));
                        cmd.Parameters.Add(new SqlParameter("@revisionNo", supplier.revisionNo));
                        cmd.Parameters.Add(new SqlParameter("@wasaladdress", supplier.wasalAddress));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org2", supplier.typeOfOrganization2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl", supplier.additionalCtrl));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl2", supplier.additionalCtrl2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl3", supplier.additionalCtrl3));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl4", supplier.additionalCtrl4));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl5", supplier.additionalCtrl5));
                        cmd.Parameters.Add(new SqlParameter("@supplier_extra", supplier.supplier_extra));
                        cmd.Parameters.Add(new SqlParameter("@title1", supplier.title1));
                        cmd.Parameters.Add(new SqlParameter("@first_name1", supplier.first_name1));
                        cmd.Parameters.Add(new SqlParameter("@last_name1", supplier.last_name1));
                        cmd.Parameters.Add(new SqlParameter("@position1", supplier.position1));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code1", supplier.telphone_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no1", supplier.telephone_no1));
                        cmd.Parameters.Add(new SqlParameter("@extension1", supplier.extension1));
                        cmd.Parameters.Add(new SqlParameter("@email1", supplier.email1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code1", supplier.mobile_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no1", supplier.mobile_no1));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code1", supplier.fax_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@fax_no1", supplier.fax_no1));
                        cmd.Parameters.Add(new SqlParameter("@title2", supplier.title2));
                        cmd.Parameters.Add(new SqlParameter("@first_name2", supplier.first_name2));
                        cmd.Parameters.Add(new SqlParameter("@last_name2", supplier.last_name2));
                        cmd.Parameters.Add(new SqlParameter("@position2", supplier.position2));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code2", supplier.telphone_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no2", supplier.telephone_no2));
                        cmd.Parameters.Add(new SqlParameter("@extension2", supplier.extension2));
                        cmd.Parameters.Add(new SqlParameter("@email2", supplier.email2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code2", supplier.mobile_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no2", supplier.mobile_no2));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code2", supplier.fax_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@fax_no2", supplier.fax_no2));

                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", supplier.supplier_id));
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        result = Convert.ToInt32(returnParameter.Value);

                    }
                    sql.CloseAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return result;
            }
        }

        public async Task<IList<SupplierDto>> GetRegisteredSupplier(string supplierId)
        {
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
                        sql.Open();

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
                                supplier.operatingProfit1 = reader["OPERATINGPROFIT1"].ToString() != "NULL" ? Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString()) : 0;
                                supplier.operatingProfit2 = reader["OPERATINGPROFIT2"].ToString() != "" ? (reader["OPERATINGPROFIT2"].ToString()) : "0";
                                supplier.netIncome1 = reader["NETINCOME1"].ToString() != "NULL" ? Convert.ToInt32(reader["NETINCOME1"].ToString()) : 0;
                                supplier.netIncome2 = reader["NETINCOME2"].ToString();
                                supplier.currentAsset1 = reader["CURRENTASSET1"].ToString() != "NULL" ? Convert.ToInt32(reader["CURRENTASSET1"].ToString()) : 0;
                                supplier.currentAsset2 = reader["CURRENTASSET2"].ToString() != "" ? (reader["CURRENTASSET2"].ToString()) : "0";
                                supplier.totalLiable1 = reader["TOTALLIABLE1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALLIABLE1"].ToString()) : 0;
                                supplier.totalLiable2 = reader["TOTALLIABLE2"].ToString() != "" ? (reader["TOTALLIABLE2"].ToString()) : "0";
                                supplier.totalEquity1 = reader["TOTALEQUITY1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALEQUITY1"].ToString()) : 0;
                                supplier.totalEquity2 = reader["TOTALEQUITY2"].ToString() != "" ? (reader["TOTALEQUITY2"].ToString()) : "0";
                                supplier.noOfYears = reader["NOOFYEARS"].ToString() != "" ? Convert.ToInt32(reader["NOOFYEARS"].ToString()) : 0;
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
                                supplier.supplier_extra = reader["SUPPLIER_EXTRA"].ToString();
                                supplier.bankCode = reader["BANK_CODE"].ToString();
                                supplier.revisionNo = reader["REVISION_NO"].ToString() != "" ? Convert.ToInt32(reader["REVISION_NO"].ToString()) : 0;
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
                    sql.Close();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<SupplierDto>> GetRegisteredSupplierForRole(string rolename)
        {
            const string spName = "dbo.Isp_SupplierForRole_Search";
            IList<SupplierDto> supplierlist = new List<SupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", rolename != null ? rolename : ""));
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
                                supplier.extension = (reader["EXTENSION"].ToString() != "NULL" && reader["EXTENSION"].ToString() != "") ? Convert.ToInt32(reader["EXTENSION"].ToString()) : 0;
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
                                supplier.operatingProfit1 = reader["OPERATINGPROFIT1"].ToString() != "NULL" ? Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString()) : 0;
                                supplier.operatingProfit2 = reader["OPERATINGPROFIT2"].ToString() != "" ? (reader["OPERATINGPROFIT2"].ToString()) : "0";
                                supplier.netIncome1 = reader["NETINCOME1"].ToString() != "NULL" ? Convert.ToInt32(reader["NETINCOME1"].ToString()) : 0;
                                supplier.netIncome2 = reader["NETINCOME2"].ToString(); ;
                                supplier.currentAsset1 = reader["CURRENTASSET1"].ToString() != "NULL" ? Convert.ToInt32(reader["CURRENTASSET1"].ToString()) : 0;
                                supplier.currentAsset2 = reader["CURRENTASSET2"].ToString() != "" ? (reader["CURRENTASSET2"].ToString()) : "0";
                                supplier.totalLiable1 = reader["TOTALLIABLE1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALLIABLE1"].ToString()) : 0;
                                supplier.totalLiable2 = reader["TOTALLIABLE2"].ToString() != "" ? (reader["TOTALLIABLE2"].ToString()) : "0";
                                supplier.totalEquity1 = reader["TOTALEQUITY1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALEQUITY1"].ToString()) : 0;
                                supplier.totalEquity2 = reader["TOTALEQUITY2"].ToString() != "" ? (reader["TOTALEQUITY2"].ToString()) : "0";
                                supplier.noOfYears = reader["NOOFYEARS"].ToString() != "" ? Convert.ToInt32(reader["NOOFYEARS"].ToString()) : 0;
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
                                //supplier.due_date = reader["DUE_DATE"].ToString();
                                supplier.multicurrency = reader["MULTICURRENCY"].ToString();
                                supplier.workflowstatus = reader["WFState"].ToString();
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

        public async Task<IList<PendingSupplierDto>> GetPendingSupplierForRole(string rolename)
        {
            const string spName = "dbo.Isp_SupplierPendingForRole_Search";
            IList<PendingSupplierDto> supplierlist = new List<PendingSupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", rolename != null ? rolename : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                PendingSupplierDto supplieremergency = new PendingSupplierDto();

                                supplieremergency.supplier_id = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplieremergency.supplier_code = reader["SUPPLIER_CODE"].ToString();
                                supplieremergency.supplier_name = reader["SUPPLIER_NAME"].ToString();
                                supplieremergency.type = reader["TYPE"].ToString();
                                supplieremergency.wfstatus = reader["WFState"].ToString();
                                supplieremergency.created_date = reader["CREATED_DATE"].ToString();
                                supplieremergency.email = reader["EMAIL"].ToString();
                                supplieremergency.city = reader["CITY"].ToString();
                                supplieremergency.country = reader["COUNTRY"].ToString();
                                supplieremergency.cr_no = reader["CR_NO"].ToString();
                                supplieremergency.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplieremergency.vat_no = reader["VAT_NO"].ToString();
                                supplieremergency.establishment_year = reader["ESTABLISHMENT_YEAR"].ToString();
                                supplieremergency.extension = reader["EXTENSION"].ToString();
                                supplieremergency.po_box = reader["PO_BOX"].ToString();
                                supplieremergency.postal_code = reader["POSTAL_CODE"].ToString();
                                supplieremergency.title = reader["TITLE"].ToString();
                                supplieremergency.first_name = reader["FIRST_NAME"].ToString();
                                supplieremergency.last_name = reader["LAST_NAME"].ToString();
                                //supplieremergency.telphone_country_code = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplieremergency.telephone_no = reader["TELEPHONE_NO"].ToString();
                                supplieremergency.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplieremergency.mobile_no = reader["MOBILE_NO"].ToString();
                                supplieremergency.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplieremergency.fax_no = reader["FAX_NO"].ToString();

                                supplieremergency.gosi_date = reader["GOSI_DATE"].ToString(); ;
                                supplieremergency.iban_no = reader["IBAN_NO"].ToString(); ;
                                supplieremergency.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplieremergency.additional_material = reader["ADDITIONAL_MATERIAL"].ToString(); ;
                                supplieremergency.reg_date = reader["REG_DATE"].ToString(); ;
                                supplieremergency.zakath_date = reader["ZAKATH_DATE"].ToString();
                                supplieremergency.saudi_date = reader["SAUDI_DATE"].ToString();
                                supplieremergency.website = reader["WEB_SITE"].ToString();
                                supplieremergency.pushed_supplier_status = reader["PUSHEDSUPPLIERSTATUS"].ToString();
                                supplieremergency.role = reader["ROLE"].ToString();
                                supplieremergency.buyer_name = reader["BUYERNAME"].ToString();
                                supplieremergency.buyer_email = reader["BUYEREMAIL"].ToString();
                                supplieremergency.supplier_status = reader["SUPPLIER_STATUS"].ToString();
                                supplieremergency.criticality = reader["CRITICALITY"].ToString();

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


        public async Task<IList<PendingSupplierDto>> GetSuppliersOnlyPendingForRole(string rolename)
        {
            const string spName = "dbo.Isp_SupplierPendingNormOnlyForRole_Search";
            IList<PendingSupplierDto> supplierlist = new List<PendingSupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", rolename != null ? rolename : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                PendingSupplierDto supplieremergency = new PendingSupplierDto();

                                supplieremergency.supplier_id = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplieremergency.supplier_code = reader["SUPPLIER_CODE"].ToString();
                                supplieremergency.supplier_name = reader["SUPPLIER_NAME"].ToString();
                                supplieremergency.type = reader["TYPE"].ToString();
                                supplieremergency.wfstatus = reader["WFState"].ToString();
                                supplieremergency.created_date = reader["CREATED_DATE"].ToString();
                                supplieremergency.email = reader["EMAIL"].ToString();
                                supplieremergency.city = reader["CITY"].ToString();
                                supplieremergency.country = reader["COUNTRY"].ToString();
                                supplieremergency.cr_no = reader["CR_NO"].ToString();
                                supplieremergency.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplieremergency.vat_no = reader["VAT_NO"].ToString();
                                supplieremergency.establishment_year = reader["ESTABLISHMENT_YEAR"].ToString();
                                supplieremergency.extension = reader["EXTENSION"].ToString();
                                supplieremergency.po_box = reader["PO_BOX"].ToString();
                                supplieremergency.postal_code = reader["POSTAL_CODE"].ToString();
                                supplieremergency.title = reader["TITLE"].ToString();
                                supplieremergency.first_name = reader["FIRST_NAME"].ToString();
                                supplieremergency.last_name = reader["LAST_NAME"].ToString();
                                //supplieremergency.telphone_country_code = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplieremergency.telephone_no = reader["TELEPHONE_NO"].ToString();
                                supplieremergency.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplieremergency.mobile_no = reader["MOBILE_NO"].ToString();
                                supplieremergency.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplieremergency.fax_no = reader["FAX_NO"].ToString();

                                supplieremergency.gosi_date = reader["GOSI_DATE"].ToString(); ;
                                supplieremergency.iban_no = reader["IBAN_NO"].ToString(); ;
                                supplieremergency.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplieremergency.additional_material = reader["ADDITIONAL_MATERIAL"].ToString(); ;
                                supplieremergency.reg_date = reader["REG_DATE"].ToString(); ;
                                supplieremergency.zakath_date = reader["ZAKATH_DATE"].ToString();
                                supplieremergency.saudi_date = reader["SAUDI_DATE"].ToString();
                                supplieremergency.website = reader["WEB_SITE"].ToString();
                                supplieremergency.pushed_supplier_status = reader["PUSHEDSUPPLIERSTATUS"].ToString();
                                supplieremergency.role = reader["ROLE"].ToString();
                                supplieremergency.buyer_name = reader["BUYERNAME"].ToString();
                                supplieremergency.buyer_email = reader["BUYEREMAIL"].ToString();
                                supplieremergency.supplier_status = reader["SUPPLIER_STATUS"].ToString();
                                supplieremergency.criticality = reader["CRITICALITY"].ToString();
                                supplieremergency.returned = reader["RETURNED"].ToString();
                                supplieremergency.hijri_selected = reader["HIJRI_SELECTED"].ToString();

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

        public async Task<int> UpdateRegisteredSupplier(SupplierDto supplier)
        {
            const string spName = "dbo.Isp_Supplier_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplier_name", supplier.supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@supplier_name_arabic", supplier.supplier_name_arabic));
                        cmd.Parameters.Add(new SqlParameter("@establishment_year", supplier.establishment_year));
                        cmd.Parameters.Add(new SqlParameter("@issued_by", supplier.issued_by));
                        cmd.Parameters.Add(new SqlParameter("@web_site", supplier.web_site));
                        cmd.Parameters.Add(new SqlParameter("@supplier_type", supplier.supplier_type != null ? String.Join(',', supplier.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@country", supplier.country));
                        cmd.Parameters.Add(new SqlParameter("@city", supplier.city));
                        cmd.Parameters.Add(new SqlParameter("@other_city", supplier.other_city));
                        cmd.Parameters.Add(new SqlParameter("@po_box", supplier.po_box));
                        cmd.Parameters.Add(new SqlParameter("@postal_code", supplier.postal_code));
                        cmd.Parameters.Add(new SqlParameter("@address_line1", supplier.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@address_line2", supplier.address_line2));
                        cmd.Parameters.Add(new SqlParameter("@title", supplier.title));
                        cmd.Parameters.Add(new SqlParameter("@first_name", supplier.first_name));
                        cmd.Parameters.Add(new SqlParameter("@last_name", supplier.last_name));
                        cmd.Parameters.Add(new SqlParameter("@position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code", supplier.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no", supplier.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@extension", supplier.extension));
                        cmd.Parameters.Add(new SqlParameter("@email", supplier.email));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code", supplier.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no", supplier.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code", supplier.fax_country_code));
                        cmd.Parameters.Add(new SqlParameter("@fax_no", supplier.fax_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_no", supplier.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_exp_date", supplier.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@additional_material", supplier.additional_material));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org", supplier.typeOfOrganization));
                        cmd.Parameters.Add(new SqlParameter("@no_of_manager", supplier.managerialno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_operation", supplier.operationsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_technical", supplier.technicalno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_saudi", supplier.saudiNationalsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_total", supplier.totallno));
                        cmd.Parameters.Add(new SqlParameter("@parent_company_info", supplier.parentcompany));
                        //cmd.Parameters.Add(new SqlParameter("@affiliated_company_info", supplier.affiliated_company_info));
                        cmd.Parameters.Add(new SqlParameter("@owner_info", supplier.ownercompany));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year1", supplier.finance_status_year1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value1", supplier.finance_status_value1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year2", supplier.finance_status_year2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value2", supplier.finance_status_value2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year3", supplier.finance_status_year3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value3", supplier.finance_status_value3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year4", supplier.finance_status_year4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value4", supplier.finance_status_value4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year5", supplier.finance_status_year5));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value5", supplier.finance_status_value5));
                        cmd.Parameters.Add(new SqlParameter("@no_of_years", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@vat_no", supplier.vat_no));
                        cmd.Parameters.Add(new SqlParameter("@gosi_certificate", supplier.gosi_certificate));
                        cmd.Parameters.Add(new SqlParameter("@reg_date", supplier.reg_date));
                        cmd.Parameters.Add(new SqlParameter("@gosi_date", supplier.gosi_date));
                        cmd.Parameters.Add(new SqlParameter("@saudi_date", supplier.saudi_date));
                        cmd.Parameters.Add(new SqlParameter("@zakath_date", supplier.zakath_date));
                        cmd.Parameters.Add(new SqlParameter("@parentcompany", supplier.parentcompany));
                        cmd.Parameters.Add(new SqlParameter("@sistercompany", supplier.sistercompany));
                        cmd.Parameters.Add(new SqlParameter("@ownercompany", supplier.ownercompany));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit1", supplier.operatingProfit1));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit2", supplier.operatingProfit2));
                        cmd.Parameters.Add(new SqlParameter("@netIncome1", supplier.netIncome1));
                        cmd.Parameters.Add(new SqlParameter("@netIncome2", supplier.netIncome2));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset1", supplier.currentAsset1));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset2", supplier.currentAsset2));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable1", supplier.totalLiable1));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable2", supplier.totalLiable2));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity1", supplier.totalEquity1));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity2", supplier.totalEquity2));
                        cmd.Parameters.Add(new SqlParameter("@noOfYears", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@ownsPlantEquip", supplier.ownsPlantEquip));
                        cmd.Parameters.Add(new SqlParameter("@designnCap", supplier.designnCap));
                        cmd.Parameters.Add(new SqlParameter("@finishProd", supplier.finishProd));
                        cmd.Parameters.Add(new SqlParameter("@internalPolicy", supplier.internalPolicy));
                        cmd.Parameters.Add(new SqlParameter("@registeredOrg", supplier.registeredOrg));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj1", supplier.suspendedProj1));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj2", supplier.suspendedProj2));
                        cmd.Parameters.Add(new SqlParameter("@litigation1", supplier.litigation1));
                        cmd.Parameters.Add(new SqlParameter("@litigation2", supplier.litigation2));
                        cmd.Parameters.Add(new SqlParameter("@compliance1", supplier.compliance1));
                        cmd.Parameters.Add(new SqlParameter("@compliance2", supplier.compliance2));
                        cmd.Parameters.Add(new SqlParameter("@shareholder1", supplier.shareholder1));
                        cmd.Parameters.Add(new SqlParameter("@shareholder2", supplier.shareholder2));
                        cmd.Parameters.Add(new SqlParameter("@labour1", supplier.labour1));
                        cmd.Parameters.Add(new SqlParameter("@labour2", supplier.labour2));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset1", supplier.legalAsset1));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset2", supplier.legalAsset2));
                        cmd.Parameters.Add(new SqlParameter("@environment1", supplier.environment1));
                        cmd.Parameters.Add(new SqlParameter("@environment2", supplier.environment2));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested1", supplier.imiInterested1));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested2", supplier.imiInterested2));
                        cmd.Parameters.Add(new SqlParameter("@hse1", supplier.hse1));
                        cmd.Parameters.Add(new SqlParameter("@hse2", supplier.hse2));
                        cmd.Parameters.Add(new SqlParameter("@docuHse", supplier.docuHse));
                        cmd.Parameters.Add(new SqlParameter("@isohealth", supplier.isohealth));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt1", supplier.envtMgt1));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt2", supplier.envtMgt2));
                        cmd.Parameters.Add(new SqlParameter("@dedicatedpers", supplier.dedicatedpers));
                        cmd.Parameters.Add(new SqlParameter("@statistic", supplier.statistic));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy1", supplier.qualityPolicy1));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy2", supplier.qualityPolicy2));
                        cmd.Parameters.Add(new SqlParameter("@qualityMgt", supplier.qualityMgt));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp1", supplier.qualityResp1));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp2", supplier.qualityResp2));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp3", supplier.qualityResp3));
                        cmd.Parameters.Add(new SqlParameter("@hijriSelected", supplier.hijriSelected));
                        cmd.Parameters.Add(new SqlParameter("@bankCountryCodes", supplier.bankCountryCodes));
                        cmd.Parameters.Add(new SqlParameter("@bankName", supplier.bankName != null ? supplier.bankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@otherBankName", supplier.otherBankName != null ? supplier.otherBankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@swiftcode", supplier.swiftcode));
                        cmd.Parameters.Add(new SqlParameter("@accountHolderName", supplier.accountHolderName));
                        cmd.Parameters.Add(new SqlParameter("@ibanNo", supplier.ibanNo));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress", supplier.bankAddress));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress2", supplier.bankAddress2));
                        cmd.Parameters.Add(new SqlParameter("@accountCurrency", supplier.accountCurrency));
                        cmd.Parameters.Add(new SqlParameter("@account_number", supplier.account_number));
                        cmd.Parameters.Add(new SqlParameter("@static_near", supplier.statisticNear));
                        cmd.Parameters.Add(new SqlParameter("@static_first", supplier.statisticFirst));
                        cmd.Parameters.Add(new SqlParameter("@static_medi", supplier.statisticMedical));
                        cmd.Parameters.Add(new SqlParameter("@static_lost", supplier.statisticLost));
                        cmd.Parameters.Add(new SqlParameter("@static_fatal", supplier.statisticFatal));
                        cmd.Parameters.Add(new SqlParameter("@hse_name", supplier.hseName));
                        cmd.Parameters.Add(new SqlParameter("@hse_desig", supplier.hseDesig));
                        cmd.Parameters.Add(new SqlParameter("@quality_name", supplier.qualityName != null ? supplier.qualityName : ""));
                        cmd.Parameters.Add(new SqlParameter("@quality_desig", supplier.qualityDesig != null ? supplier.qualityDesig : ""));
                        cmd.Parameters.Add(new SqlParameter("@qualitymgt_iso", supplier.qualityMgtIso));
                        cmd.Parameters.Add(new SqlParameter("@statisticEnvt", supplier.statisticEnvt));
                        cmd.Parameters.Add(new SqlParameter("@qualityreviewDate", supplier.qualityreviewDate != null ? supplier.qualityreviewDate : ""));
                        cmd.Parameters.Add(new SqlParameter("@id", supplier.supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@multicurrency", supplier.multicurrency));
                        cmd.Parameters.Add(new SqlParameter("@wasaladdress", supplier.wasalAddress));
                        cmd.Parameters.Add(new SqlParameter("@revisionNo", supplier.revisionNo));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org2", supplier.typeOfOrganization2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl", supplier.additionalCtrl));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl2", supplier.additionalCtrl2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl3", supplier.additionalCtrl3));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl4", supplier.additionalCtrl4));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl5", supplier.additionalCtrl5));
                        cmd.Parameters.Add(new SqlParameter("@supplier_extra", supplier.supplier_extra));
                        cmd.Parameters.Add(new SqlParameter("@title1", supplier.title1));
                        cmd.Parameters.Add(new SqlParameter("@first_name1", supplier.first_name1));
                        cmd.Parameters.Add(new SqlParameter("@last_name1", supplier.last_name1));
                        cmd.Parameters.Add(new SqlParameter("@position1", supplier.position1));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code1", supplier.telphone_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no1", supplier.telephone_no1));
                        cmd.Parameters.Add(new SqlParameter("@extension1", supplier.extension1));
                        cmd.Parameters.Add(new SqlParameter("@email1", supplier.email1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code1", supplier.mobile_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no1", supplier.mobile_no1));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code1", supplier.fax_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@fax_no1", supplier.fax_no1));
                        cmd.Parameters.Add(new SqlParameter("@title2", supplier.title2));
                        cmd.Parameters.Add(new SqlParameter("@first_name2", supplier.first_name2));
                        cmd.Parameters.Add(new SqlParameter("@last_name2", supplier.last_name2));
                        cmd.Parameters.Add(new SqlParameter("@position2", supplier.position2));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code2", supplier.telphone_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no2", supplier.telephone_no2));
                        cmd.Parameters.Add(new SqlParameter("@extension2", supplier.extension2));
                        cmd.Parameters.Add(new SqlParameter("@email2", supplier.email2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code2", supplier.mobile_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no2", supplier.mobile_no2));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code2", supplier.fax_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@fax_no2", supplier.fax_no2));

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return supplier.supplier_id;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<int> UpdateRegisteredSupplierByRole(SupplierDto supplier, string role, string changeremail, string changername)
        {
            const string spName = "dbo.Isp_SupplierUpdate_ByRole";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplier_name", supplier.supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@supplier_name_arabic", supplier.supplier_name_arabic));
                        cmd.Parameters.Add(new SqlParameter("@establishment_year", supplier.establishment_year));
                        cmd.Parameters.Add(new SqlParameter("@issued_by", supplier.issued_by));
                        cmd.Parameters.Add(new SqlParameter("@web_site", supplier.web_site));
                        cmd.Parameters.Add(new SqlParameter("@supplier_type", supplier.supplier_type != null ? String.Join(',', supplier.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@country", supplier.country));
                        cmd.Parameters.Add(new SqlParameter("@city", supplier.city));
                        cmd.Parameters.Add(new SqlParameter("@other_city", supplier.other_city));
                        cmd.Parameters.Add(new SqlParameter("@po_box", supplier.po_box));
                        cmd.Parameters.Add(new SqlParameter("@postal_code", supplier.postal_code));
                        cmd.Parameters.Add(new SqlParameter("@address_line1", supplier.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@address_line2", supplier.address_line2));
                        cmd.Parameters.Add(new SqlParameter("@title", supplier.title));
                        cmd.Parameters.Add(new SqlParameter("@first_name", supplier.first_name));
                        cmd.Parameters.Add(new SqlParameter("@last_name", supplier.last_name));
                        cmd.Parameters.Add(new SqlParameter("@position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code", supplier.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no", supplier.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@extension", supplier.extension));
                        cmd.Parameters.Add(new SqlParameter("@email", supplier.email));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code", supplier.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no", supplier.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code", supplier.fax_country_code));
                        cmd.Parameters.Add(new SqlParameter("@fax_no", supplier.fax_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_no", supplier.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_exp_date", supplier.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@additional_material", supplier.additional_material));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org", supplier.typeOfOrganization));
                        cmd.Parameters.Add(new SqlParameter("@no_of_manager", supplier.managerialno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_operation", supplier.operationsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_technical", supplier.technicalno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_saudi", supplier.saudiNationalsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_total", supplier.totallno));
                        cmd.Parameters.Add(new SqlParameter("@parent_company_info", supplier.parentcompany));
                        cmd.Parameters.Add(new SqlParameter("@owner_info", supplier.ownercompany));
                        cmd.Parameters.Add(new SqlParameter("@no_of_years", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@vat_no", supplier.vat_no));
                        cmd.Parameters.Add(new SqlParameter("@gosi_certificate", supplier.gosi_certificate));
                        cmd.Parameters.Add(new SqlParameter("@reg_date", supplier.reg_date));
                        cmd.Parameters.Add(new SqlParameter("@gosi_date", supplier.gosi_date));
                        cmd.Parameters.Add(new SqlParameter("@saudi_date", supplier.saudi_date));
                        cmd.Parameters.Add(new SqlParameter("@zakath_date", supplier.zakath_date));
                        cmd.Parameters.Add(new SqlParameter("@parentcompany", supplier.parentcompany));
                        cmd.Parameters.Add(new SqlParameter("@sistercompany", supplier.sistercompany));
                        cmd.Parameters.Add(new SqlParameter("@ownercompany", supplier.ownercompany));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit1", supplier.operatingProfit1));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit2", supplier.operatingProfit2));
                        cmd.Parameters.Add(new SqlParameter("@netIncome1", supplier.netIncome1));
                        cmd.Parameters.Add(new SqlParameter("@netIncome2", supplier.netIncome2));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset1", supplier.currentAsset1));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset2", supplier.currentAsset2));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable1", supplier.totalLiable1));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable2", supplier.totalLiable2));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity1", supplier.totalEquity1));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity2", supplier.totalEquity2));
                        cmd.Parameters.Add(new SqlParameter("@noOfYears", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@ownsPlantEquip", supplier.ownsPlantEquip));
                        cmd.Parameters.Add(new SqlParameter("@designnCap", supplier.designnCap));
                        cmd.Parameters.Add(new SqlParameter("@finishProd", supplier.finishProd));
                        cmd.Parameters.Add(new SqlParameter("@internalPolicy", supplier.internalPolicy));
                        cmd.Parameters.Add(new SqlParameter("@registeredOrg", supplier.registeredOrg));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj1", supplier.suspendedProj1));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj2", supplier.suspendedProj2));
                        cmd.Parameters.Add(new SqlParameter("@litigation1", supplier.litigation1));
                        cmd.Parameters.Add(new SqlParameter("@litigation2", supplier.litigation2));
                        cmd.Parameters.Add(new SqlParameter("@compliance1", supplier.compliance1));
                        cmd.Parameters.Add(new SqlParameter("@compliance2", supplier.compliance2));
                        cmd.Parameters.Add(new SqlParameter("@shareholder1", supplier.shareholder1));
                        cmd.Parameters.Add(new SqlParameter("@shareholder2", supplier.shareholder2));
                        cmd.Parameters.Add(new SqlParameter("@labour1", supplier.labour1));
                        cmd.Parameters.Add(new SqlParameter("@labour2", supplier.labour2));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset1", supplier.legalAsset1));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset2", supplier.legalAsset2));
                        cmd.Parameters.Add(new SqlParameter("@environment1", supplier.environment1));
                        cmd.Parameters.Add(new SqlParameter("@environment2", supplier.environment2));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested1", supplier.imiInterested1));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested2", supplier.imiInterested2));
                        cmd.Parameters.Add(new SqlParameter("@hse1", supplier.hse1));
                        cmd.Parameters.Add(new SqlParameter("@hse2", supplier.hse2));
                        cmd.Parameters.Add(new SqlParameter("@docuHse", supplier.docuHse));
                        cmd.Parameters.Add(new SqlParameter("@isohealth", supplier.isohealth));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt1", supplier.envtMgt1));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt2", supplier.envtMgt2));
                        cmd.Parameters.Add(new SqlParameter("@dedicatedpers", supplier.dedicatedpers));
                        cmd.Parameters.Add(new SqlParameter("@statistic", supplier.statistic));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy1", supplier.qualityPolicy1));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy2", supplier.qualityPolicy2));
                        cmd.Parameters.Add(new SqlParameter("@qualityMgt", supplier.qualityMgt));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp1", supplier.qualityResp1));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp2", supplier.qualityResp2));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp3", supplier.qualityResp3));
                        cmd.Parameters.Add(new SqlParameter("@hijriSelected", supplier.hijriSelected));
                        cmd.Parameters.Add(new SqlParameter("@bankCountryCodes", supplier.bankCountryCodes));
                        cmd.Parameters.Add(new SqlParameter("@bankName", supplier.bankName != null ? supplier.bankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@otherBankName", supplier.otherBankName != null ? supplier.otherBankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@swiftcode", supplier.swiftcode));
                        cmd.Parameters.Add(new SqlParameter("@accountHolderName", supplier.accountHolderName));
                        cmd.Parameters.Add(new SqlParameter("@ibanNo", supplier.ibanNo));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress", supplier.bankAddress));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress2", supplier.bankAddress2));
                        cmd.Parameters.Add(new SqlParameter("@accountCurrency", supplier.accountCurrency));
                        cmd.Parameters.Add(new SqlParameter("@account_number", supplier.account_number));
                        cmd.Parameters.Add(new SqlParameter("@static_near", supplier.statisticNear));
                        cmd.Parameters.Add(new SqlParameter("@static_first", supplier.statisticFirst));
                        cmd.Parameters.Add(new SqlParameter("@static_medi", supplier.statisticMedical));
                        cmd.Parameters.Add(new SqlParameter("@static_lost", supplier.statisticLost));
                        cmd.Parameters.Add(new SqlParameter("@static_fatal", supplier.statisticFatal));
                        cmd.Parameters.Add(new SqlParameter("@hse_name", supplier.hseName));
                        cmd.Parameters.Add(new SqlParameter("@hse_desig", supplier.hseDesig));
                        cmd.Parameters.Add(new SqlParameter("@quality_name", supplier.qualityName != null ? supplier.qualityName : ""));
                        cmd.Parameters.Add(new SqlParameter("@quality_desig", supplier.qualityDesig != null ? supplier.qualityDesig : ""));
                        cmd.Parameters.Add(new SqlParameter("@qualitymgt_iso", supplier.qualityMgtIso));
                        cmd.Parameters.Add(new SqlParameter("@statisticEnvt", supplier.statisticEnvt));
                        cmd.Parameters.Add(new SqlParameter("@qualityreviewDate", supplier.qualityreviewDate != null ? supplier.qualityreviewDate : ""));
                        cmd.Parameters.Add(new SqlParameter("@id", supplier.supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@multicurrency", supplier.multicurrency));
                        cmd.Parameters.Add(new SqlParameter("@wasaladdress", supplier.wasalAddress));
                        cmd.Parameters.Add(new SqlParameter("@revisionNo", supplier.revisionNo));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org2", supplier.typeOfOrganization2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl", supplier.additionalCtrl));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl2", supplier.additionalCtrl2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl3", supplier.additionalCtrl3));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl4", supplier.additionalCtrl4));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl5", supplier.additionalCtrl5));
                        cmd.Parameters.Add(new SqlParameter("@supplier_extra", supplier.supplier_extra));
                        cmd.Parameters.Add(new SqlParameter("@title1", supplier.title1));
                        cmd.Parameters.Add(new SqlParameter("@first_name1", supplier.first_name1));
                        cmd.Parameters.Add(new SqlParameter("@last_name1", supplier.last_name1));
                        cmd.Parameters.Add(new SqlParameter("@position1", supplier.position1));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code1", supplier.telphone_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no1", supplier.telephone_no1));
                        cmd.Parameters.Add(new SqlParameter("@extension1", supplier.extension1));
                        cmd.Parameters.Add(new SqlParameter("@email1", supplier.email1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code1", supplier.mobile_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no1", supplier.mobile_no1));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code1", supplier.fax_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@fax_no1", supplier.fax_no1));
                        cmd.Parameters.Add(new SqlParameter("@title2", supplier.title2));
                        cmd.Parameters.Add(new SqlParameter("@first_name2", supplier.first_name2));
                        cmd.Parameters.Add(new SqlParameter("@last_name2", supplier.last_name2));
                        cmd.Parameters.Add(new SqlParameter("@position2", supplier.position2));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code2", supplier.telphone_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no2", supplier.telephone_no2));
                        cmd.Parameters.Add(new SqlParameter("@extension2", supplier.extension2));
                        cmd.Parameters.Add(new SqlParameter("@email2", supplier.email2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code2", supplier.mobile_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no2", supplier.mobile_no2));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code2", supplier.fax_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@fax_no2", supplier.fax_no2));
                        cmd.Parameters.Add(new SqlParameter("@role", role));
                        cmd.Parameters.Add(new SqlParameter("@changerName", changername));
                        cmd.Parameters.Add(new SqlParameter("@changerEmail", changeremail));

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return supplier.supplier_id;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }


        public async Task<int> SaveTempSupplier(SupplierDto supplier)
        {
            const string spName = "dbo.Isp_SupplierTemp_Save";
            var result = 0;

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplier_name", supplier.supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@supplier_name_arabic", supplier.supplier_name_arabic));
                        cmd.Parameters.Add(new SqlParameter("@establishment_year", supplier.establishment_year));
                        cmd.Parameters.Add(new SqlParameter("@issued_by", supplier.issued_by));
                        cmd.Parameters.Add(new SqlParameter("@web_site", supplier.web_site));
                        cmd.Parameters.Add(new SqlParameter("@supplier_type", supplier.supplier_type != null ? String.Join(',', supplier.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@country", supplier.country));
                        cmd.Parameters.Add(new SqlParameter("@city", supplier.city));
                        cmd.Parameters.Add(new SqlParameter("@other_city", supplier.other_city));
                        cmd.Parameters.Add(new SqlParameter("@po_box", supplier.po_box));
                        cmd.Parameters.Add(new SqlParameter("@postal_code", supplier.postal_code));
                        cmd.Parameters.Add(new SqlParameter("@address_line1", supplier.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@address_line2", supplier.address_line2));
                        cmd.Parameters.Add(new SqlParameter("@title", supplier.title));
                        cmd.Parameters.Add(new SqlParameter("@first_name", supplier.first_name));
                        cmd.Parameters.Add(new SqlParameter("@last_name", supplier.last_name));
                        cmd.Parameters.Add(new SqlParameter("@position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code", supplier.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no", supplier.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@extension", supplier.extension));
                        cmd.Parameters.Add(new SqlParameter("@email", supplier.email));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code", supplier.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no", supplier.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code", supplier.fax_country_code));
                        cmd.Parameters.Add(new SqlParameter("@fax_no", supplier.fax_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_no", supplier.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_exp_date", supplier.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@additional_material", supplier.additional_material));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org", supplier.typeOfOrganization));
                        cmd.Parameters.Add(new SqlParameter("@no_of_manager", supplier.managerialno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_operation", supplier.operationsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_technical", supplier.technicalno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_saudi", supplier.saudiNationalsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_total", supplier.totallno));
                        cmd.Parameters.Add(new SqlParameter("@parent_company_info", supplier.parentcompany));
                        //cmd.Parameters.Add(new SqlParameter("@affiliated_company_info", supplier.affiliated_company_info));
                        cmd.Parameters.Add(new SqlParameter("@owner_info", supplier.ownercompany));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year1", supplier.finance_status_year1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value1", supplier.finance_status_value1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year2", supplier.finance_status_year2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value2", supplier.finance_status_value2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year3", supplier.finance_status_year3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value3", supplier.finance_status_value3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year4", supplier.finance_status_year4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value4", supplier.finance_status_value4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year5", supplier.finance_status_year5));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value5", supplier.finance_status_value5));
                        cmd.Parameters.Add(new SqlParameter("@no_of_years", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@vat_no", supplier.vat_no));
                        cmd.Parameters.Add(new SqlParameter("@gosi_certificate", supplier.gosi_certificate));
                        cmd.Parameters.Add(new SqlParameter("@reg_date", supplier.reg_date));
                        cmd.Parameters.Add(new SqlParameter("@gosi_date", supplier.gosi_date));
                        cmd.Parameters.Add(new SqlParameter("@saudi_date", supplier.saudi_date));
                        cmd.Parameters.Add(new SqlParameter("@zakath_date", supplier.zakath_date));
                        cmd.Parameters.Add(new SqlParameter("@parentcompany", supplier.parentcompany));
                        cmd.Parameters.Add(new SqlParameter("@sistercompany", supplier.sistercompany));
                        cmd.Parameters.Add(new SqlParameter("@ownercompany", supplier.ownercompany));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit1", supplier.operatingProfit1));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit2", supplier.operatingProfit2));
                        cmd.Parameters.Add(new SqlParameter("@netIncome1", supplier.netIncome1));
                        cmd.Parameters.Add(new SqlParameter("@netIncome2", supplier.netIncome2));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset1", supplier.currentAsset1));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset2", supplier.currentAsset2));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable1", supplier.totalLiable1));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable2", supplier.totalLiable2));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity1", supplier.totalEquity1));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity2", supplier.totalEquity2));
                        cmd.Parameters.Add(new SqlParameter("@noOfYears", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@ownsPlantEquip", supplier.ownsPlantEquip));
                        cmd.Parameters.Add(new SqlParameter("@designnCap", supplier.designnCap));
                        cmd.Parameters.Add(new SqlParameter("@finishProd", supplier.finishProd));
                        cmd.Parameters.Add(new SqlParameter("@internalPolicy", supplier.internalPolicy));
                        cmd.Parameters.Add(new SqlParameter("@registeredOrg", supplier.registeredOrg));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj1", supplier.suspendedProj1));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj2", supplier.suspendedProj2));
                        cmd.Parameters.Add(new SqlParameter("@litigation1", supplier.litigation1));
                        cmd.Parameters.Add(new SqlParameter("@litigation2", supplier.litigation2));
                        cmd.Parameters.Add(new SqlParameter("@compliance1", supplier.compliance1));
                        cmd.Parameters.Add(new SqlParameter("@compliance2", supplier.compliance2));
                        cmd.Parameters.Add(new SqlParameter("@shareholder1", supplier.shareholder1));
                        cmd.Parameters.Add(new SqlParameter("@shareholder2", supplier.shareholder2));
                        cmd.Parameters.Add(new SqlParameter("@labour1", supplier.labour1));
                        cmd.Parameters.Add(new SqlParameter("@labour2", supplier.labour2));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset1", supplier.legalAsset1));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset2", supplier.legalAsset2));
                        cmd.Parameters.Add(new SqlParameter("@environment1", supplier.environment1));
                        cmd.Parameters.Add(new SqlParameter("@environment2", supplier.environment2));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested1", supplier.imiInterested1));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested2", supplier.imiInterested2));
                        cmd.Parameters.Add(new SqlParameter("@hse1", supplier.hse1));
                        cmd.Parameters.Add(new SqlParameter("@hse2", supplier.hse2));
                        cmd.Parameters.Add(new SqlParameter("@docuHse", supplier.docuHse));
                        cmd.Parameters.Add(new SqlParameter("@isohealth", supplier.isohealth));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt1", supplier.envtMgt1));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt2", supplier.envtMgt2));
                        cmd.Parameters.Add(new SqlParameter("@dedicatedpers", supplier.dedicatedpers));
                        cmd.Parameters.Add(new SqlParameter("@statistic", supplier.statistic));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy1", supplier.qualityPolicy1));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy2", supplier.qualityPolicy2));
                        cmd.Parameters.Add(new SqlParameter("@qualityMgt", supplier.qualityMgt));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp1", supplier.qualityResp1));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp2", supplier.qualityResp2));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp3", supplier.qualityResp3));
                        cmd.Parameters.Add(new SqlParameter("@hijriSelected", supplier.hijriSelected));
                        cmd.Parameters.Add(new SqlParameter("@bankCountryCodes", supplier.bankCountryCodes));
                        cmd.Parameters.Add(new SqlParameter("@bankName", supplier.bankName != null ? supplier.bankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@otherBankName", supplier.otherBankName != null ? supplier.otherBankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@swiftcode", supplier.swiftcode));
                        cmd.Parameters.Add(new SqlParameter("@accountHolderName", supplier.accountHolderName));
                        cmd.Parameters.Add(new SqlParameter("@ibanNo", supplier.ibanNo));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress", supplier.bankAddress));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress2", supplier.bankAddress2));
                        cmd.Parameters.Add(new SqlParameter("@accountCurrency", supplier.accountCurrency));
                        cmd.Parameters.Add(new SqlParameter("@account_number", supplier.account_number));
                        cmd.Parameters.Add(new SqlParameter("@static_near", supplier.statisticNear));
                        cmd.Parameters.Add(new SqlParameter("@static_first", supplier.statisticFirst));
                        cmd.Parameters.Add(new SqlParameter("@static_medi", supplier.statisticMedical));
                        cmd.Parameters.Add(new SqlParameter("@static_lost", supplier.statisticLost));
                        cmd.Parameters.Add(new SqlParameter("@static_fatal", supplier.statisticFatal));
                        cmd.Parameters.Add(new SqlParameter("@hse_name", supplier.hseName));
                        cmd.Parameters.Add(new SqlParameter("@hse_desig", supplier.hseDesig));
                        cmd.Parameters.Add(new SqlParameter("@quality_name", supplier.qualityName != null ? supplier.qualityName : ""));
                        cmd.Parameters.Add(new SqlParameter("@quality_desig", supplier.qualityDesig != null ? supplier.qualityDesig : ""));
                        cmd.Parameters.Add(new SqlParameter("@qualitymgt_iso", supplier.qualityMgtIso));
                        cmd.Parameters.Add(new SqlParameter("@statisticEnvt", supplier.statisticEnvt));
                        cmd.Parameters.Add(new SqlParameter("@qualityreviewDate", supplier.qualityreviewDate != null ? supplier.qualityreviewDate : ""));
                        cmd.Parameters.Add(new SqlParameter("@multicurrency", supplier.multicurrency));
                        cmd.Parameters.Add(new SqlParameter("@revisionNo", supplier.revisionNo));
                        cmd.Parameters.Add(new SqlParameter("@wasaladdress", supplier.wasalAddress));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org2", supplier.typeOfOrganization2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl", supplier.additionalCtrl));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl2", supplier.additionalCtrl2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl3", supplier.additionalCtrl3));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl4", supplier.additionalCtrl4));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl5", supplier.additionalCtrl5));
                        cmd.Parameters.Add(new SqlParameter("@supplier_extra", supplier.supplier_extra));
                        cmd.Parameters.Add(new SqlParameter("@title1", supplier.title1));
                        cmd.Parameters.Add(new SqlParameter("@first_name1", supplier.first_name1));
                        cmd.Parameters.Add(new SqlParameter("@last_name1", supplier.last_name1));
                        cmd.Parameters.Add(new SqlParameter("@position1", supplier.position1));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code1", supplier.telphone_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no1", supplier.telephone_no1));
                        cmd.Parameters.Add(new SqlParameter("@extension1", supplier.extension1));
                        cmd.Parameters.Add(new SqlParameter("@email1", supplier.email1 != null ? supplier.email1 : ""));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code1", supplier.mobile_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no1", supplier.mobile_no1));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code1", supplier.fax_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@fax_no1", supplier.fax_no1));
                        cmd.Parameters.Add(new SqlParameter("@title2", supplier.title2));
                        cmd.Parameters.Add(new SqlParameter("@first_name2", supplier.first_name2));
                        cmd.Parameters.Add(new SqlParameter("@last_name2", supplier.last_name2));
                        cmd.Parameters.Add(new SqlParameter("@position2", supplier.position2));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code2", supplier.telphone_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no2", supplier.telephone_no2));
                        cmd.Parameters.Add(new SqlParameter("@extension2", supplier.extension2));
                        cmd.Parameters.Add(new SqlParameter("@email2", supplier.email2 != null ? supplier.email2 : ""));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code2", supplier.mobile_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no2", supplier.mobile_no2));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code2", supplier.fax_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@fax_no2", supplier.fax_no2));

                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", supplier.supplier_id));
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        result = Convert.ToInt32(returnParameter.Value);
                    }
                    sql.CloseAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return result;
            }
        }

        public async Task<bool> SaveCategory(SupplierCategoryDto supplier, int supplierId)
        {
            const string spName = "dbo.Isp_SupplierCategory_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@Position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@GeneralCatName", supplier.generalCategory));
                        cmd.Parameters.Add(new SqlParameter("@SubCatName", supplier.subCategory));
                        cmd.Parameters.Add(new SqlParameter("@DetailCatName", supplier.detailCategory));
                        cmd.Parameters.Add(new SqlParameter("@GeneralCode", supplier.generalCode));
                        cmd.Parameters.Add(new SqlParameter("@SubCode", supplier.subCode));
                        cmd.Parameters.Add(new SqlParameter("@DetailCode", supplier.detailCode));
                        cmd.Parameters.Add(new SqlParameter("@IsSupplierSelected", supplier.isChecked ? 1 : 0));
                        cmd.Parameters.Add(new SqlParameter("@IsSrmApproved", supplier.isSRMChecked == "Yes" ? 1 : 0));
                        cmd.Parameters.Add(new SqlParameter("@IsAuditApproved", supplier.isSRMChecked == "Yes" ? 1 : 0));

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

        public async Task<bool> DeleteCategory(int supplierId)
        {
            const string spName = "dbo.Isp_SupplierCategory_Delete";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));

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

        public async Task<bool> DeleteTempCategory(int supplierId)
        {
            const string spName = "dbo.Isp_SupplierTempCategory_Delete";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));

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

        public async Task<IList<SupplierDto>> GetTempRegisteredSupplier(string supplierId)
        {
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
                        sql.Open();

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
                                supplier.noOfYears = Convert.ToInt32(reader["NO_OF_YEARS"].ToString());
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
                                //supplier.criticality = reader["CRITICALITY_VALUE"].ToString(); ;
                                //supplier.workflow_id = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                //supplier.process_id = reader["PROCESS_ID"].ToString(); ;
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
                                supplier.totallno = Convert.ToInt32(reader["NO_OF_TOTAL"].ToString());
                                supplier.hijriSelected = reader["HIJRI_SELECTED"].ToString(); ;
                                supplier.saudiNationalsno = Convert.ToInt32(reader["NO_OF_SAUDI"].ToString());
                                //supplier.status = reader["STATUS"].ToString(); ;
                                //supplier.created_date = reader["CREATED_DATE"].ToString(); ;
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
                                //supplier.supplier_code = reader["SUPPLIER_CODE"].ToString(); ;
                                //supplier.ifs_code = reader["IFS_CODE"].ToString(); ;
                                supplier.account_number = reader["account_no"].ToString();
                                supplier.multicurrency = reader["MULTICURRENCY"].ToString();
                                supplier.wasalAddress = reader["WASAL_ADDRESS"].ToString();
                                supplier.created_date = reader["CREATED_DATE"].ToString();
                                supplier.typeOfOrganization2 = reader["TYPE_OF_ORG2"].ToString();
                                supplier.additionalCtrl = reader["ADDITIONALCTRL"].ToString();
                                supplier.additionalCtrl2 = reader["ADDITIONALCTRL2"].ToString();
                                supplier.additionalCtrl3 = reader["ADDITIONALCTRL3"].ToString();
                                supplier.additionalCtrl4 = reader["ADDITIONALCTRL4"].ToString();
                                supplier.additionalCtrl5 = reader["ADDITIONALCTRL5"].ToString();
                                supplier.supplier_extra = reader["SUPPLIER_EXTRA"].ToString();
                                supplier.draftLimit = reader["DRAFT_LIMIT"].ToString();
                                supplier.title1 = reader["title1"].ToString();
                                supplier.first_name1 = reader["first_name1"].ToString();
                                supplier.last_name1 = reader["last_name1"].ToString();
                                supplier.email1 = reader["email1"].ToString();
                                supplier.position1 = reader["position1"].ToString();
                                supplier.telphone_country_code1 = reader["telphone_country_code1"].ToString();
                                supplier.telephone_no1 = reader["telephone_no1"].ToString();
                                supplier.extension1 = Convert.ToInt32(reader["extension1"].ToString());
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
                                supplier.extension2 = Convert.ToInt32(reader["extension2"].ToString());
                                supplier.mobile_country_code2 = reader["mobile_country_code2"].ToString();
                                supplier.mobile_no2 = reader["mobile_no2"].ToString();
                                supplier.fax_country_code2 = reader["fax_country_code2"].ToString();
                                supplier.fax_no2 = reader["fax_no2"].ToString();
                                supplierlist.Add(supplier);
                            }
                        }

                    }
                    sql.Close();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<int> UpdateTempRegisteredSupplier(SupplierDto supplier)
        {
            const string spName = "dbo.Isp_SupplierTemp_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplier_name", supplier.supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@supplier_name_arabic", supplier.supplier_name_arabic));
                        cmd.Parameters.Add(new SqlParameter("@establishment_year", supplier.establishment_year));
                        cmd.Parameters.Add(new SqlParameter("@issued_by", supplier.issued_by));
                        cmd.Parameters.Add(new SqlParameter("@web_site", supplier.web_site));
                        cmd.Parameters.Add(new SqlParameter("@supplier_type", supplier.supplier_type != null ? String.Join(',', supplier.supplier_type) : ""));
                        cmd.Parameters.Add(new SqlParameter("@country", supplier.country));
                        cmd.Parameters.Add(new SqlParameter("@city", supplier.city));
                        cmd.Parameters.Add(new SqlParameter("@other_city", supplier.other_city));
                        cmd.Parameters.Add(new SqlParameter("@po_box", supplier.po_box));
                        cmd.Parameters.Add(new SqlParameter("@postal_code", supplier.postal_code));
                        cmd.Parameters.Add(new SqlParameter("@address_line1", supplier.address_line1));
                        cmd.Parameters.Add(new SqlParameter("@address_line2", supplier.address_line2));
                        cmd.Parameters.Add(new SqlParameter("@title", supplier.title));
                        cmd.Parameters.Add(new SqlParameter("@first_name", supplier.first_name));
                        cmd.Parameters.Add(new SqlParameter("@last_name", supplier.last_name));
                        cmd.Parameters.Add(new SqlParameter("@position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code", supplier.telphone_country_code));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no", supplier.telephone_no));
                        cmd.Parameters.Add(new SqlParameter("@extension", supplier.extension));
                        cmd.Parameters.Add(new SqlParameter("@email", supplier.email));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code", supplier.mobile_country_code));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no", supplier.mobile_no));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code", supplier.fax_country_code));
                        cmd.Parameters.Add(new SqlParameter("@fax_no", supplier.fax_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_no", supplier.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@cr_exp_date", supplier.cr_exp_date));
                        cmd.Parameters.Add(new SqlParameter("@additional_material", supplier.additional_material));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org", supplier.typeOfOrganization));
                        cmd.Parameters.Add(new SqlParameter("@no_of_manager", supplier.managerialno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_operation", supplier.operationsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_technical", supplier.technicalno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_saudi", supplier.saudiNationalsno));
                        cmd.Parameters.Add(new SqlParameter("@no_of_total", supplier.totallno));
                        cmd.Parameters.Add(new SqlParameter("@parent_company_info", supplier.parentcompany));
                        //cmd.Parameters.Add(new SqlParameter("@affiliated_company_info", supplier.affiliated_company_info));
                        cmd.Parameters.Add(new SqlParameter("@owner_info", supplier.ownercompany));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year1", supplier.finance_status_year1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value1", supplier.finance_status_value1));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year2", supplier.finance_status_year2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value2", supplier.finance_status_value2));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year3", supplier.finance_status_year3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value3", supplier.finance_status_value3));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year4", supplier.finance_status_year4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value4", supplier.finance_status_value4));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_year5", supplier.finance_status_year5));
                        //cmd.Parameters.Add(new SqlParameter("@finance_status_value5", supplier.finance_status_value5));
                        cmd.Parameters.Add(new SqlParameter("@no_of_years", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@vat_no", supplier.vat_no));
                        cmd.Parameters.Add(new SqlParameter("@gosi_certificate", supplier.gosi_certificate));
                        cmd.Parameters.Add(new SqlParameter("@reg_date", supplier.reg_date));
                        cmd.Parameters.Add(new SqlParameter("@gosi_date", supplier.gosi_date));
                        cmd.Parameters.Add(new SqlParameter("@saudi_date", supplier.saudi_date));
                        cmd.Parameters.Add(new SqlParameter("@zakath_date", supplier.zakath_date));
                        cmd.Parameters.Add(new SqlParameter("@parentcompany", supplier.parentcompany));
                        cmd.Parameters.Add(new SqlParameter("@sistercompany", supplier.sistercompany));
                        cmd.Parameters.Add(new SqlParameter("@ownercompany", supplier.ownercompany));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit1", supplier.operatingProfit1));
                        cmd.Parameters.Add(new SqlParameter("@operatingProfit2", supplier.operatingProfit2));
                        cmd.Parameters.Add(new SqlParameter("@netIncome1", supplier.netIncome1));
                        cmd.Parameters.Add(new SqlParameter("@netIncome2", supplier.netIncome2));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset1", supplier.currentAsset1));
                        cmd.Parameters.Add(new SqlParameter("@currentAsset2", supplier.currentAsset2));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable1", supplier.totalLiable1));
                        cmd.Parameters.Add(new SqlParameter("@totalLiable2", supplier.totalLiable2));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity1", supplier.totalEquity1));
                        cmd.Parameters.Add(new SqlParameter("@totalEquity2", supplier.totalEquity2));
                        cmd.Parameters.Add(new SqlParameter("@noOfYears", supplier.noOfYears));
                        cmd.Parameters.Add(new SqlParameter("@ownsPlantEquip", supplier.ownsPlantEquip));
                        cmd.Parameters.Add(new SqlParameter("@designnCap", supplier.designnCap));
                        cmd.Parameters.Add(new SqlParameter("@finishProd", supplier.finishProd));
                        cmd.Parameters.Add(new SqlParameter("@internalPolicy", supplier.internalPolicy));
                        cmd.Parameters.Add(new SqlParameter("@registeredOrg", supplier.registeredOrg));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj1", supplier.suspendedProj1));
                        cmd.Parameters.Add(new SqlParameter("@suspendedProj2", supplier.suspendedProj2));
                        cmd.Parameters.Add(new SqlParameter("@litigation1", supplier.litigation1));
                        cmd.Parameters.Add(new SqlParameter("@litigation2", supplier.litigation2));
                        cmd.Parameters.Add(new SqlParameter("@compliance1", supplier.compliance1));
                        cmd.Parameters.Add(new SqlParameter("@compliance2", supplier.compliance2));
                        cmd.Parameters.Add(new SqlParameter("@shareholder1", supplier.shareholder1));
                        cmd.Parameters.Add(new SqlParameter("@shareholder2", supplier.shareholder2));
                        cmd.Parameters.Add(new SqlParameter("@labour1", supplier.labour1));
                        cmd.Parameters.Add(new SqlParameter("@labour2", supplier.labour2));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset1", supplier.legalAsset1));
                        cmd.Parameters.Add(new SqlParameter("@legalAsset2", supplier.legalAsset2));
                        cmd.Parameters.Add(new SqlParameter("@environment1", supplier.environment1));
                        cmd.Parameters.Add(new SqlParameter("@environment2", supplier.environment2));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested1", supplier.imiInterested1));
                        cmd.Parameters.Add(new SqlParameter("@imiInterested2", supplier.imiInterested2));
                        cmd.Parameters.Add(new SqlParameter("@hse1", supplier.hse1));
                        cmd.Parameters.Add(new SqlParameter("@hse2", supplier.hse2));
                        cmd.Parameters.Add(new SqlParameter("@docuHse", supplier.docuHse));
                        cmd.Parameters.Add(new SqlParameter("@isohealth", supplier.isohealth));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt1", supplier.envtMgt1));
                        cmd.Parameters.Add(new SqlParameter("@envtMgt2", supplier.envtMgt2));
                        cmd.Parameters.Add(new SqlParameter("@dedicatedpers", supplier.dedicatedpers));
                        cmd.Parameters.Add(new SqlParameter("@statistic", supplier.statistic));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy1", supplier.qualityPolicy1));
                        cmd.Parameters.Add(new SqlParameter("@qualityPolicy2", supplier.qualityPolicy2));
                        cmd.Parameters.Add(new SqlParameter("@qualityMgt", supplier.qualityMgt));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp1", supplier.qualityResp1));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp2", supplier.qualityResp2));
                        cmd.Parameters.Add(new SqlParameter("@qualityResp3", supplier.qualityResp3));
                        cmd.Parameters.Add(new SqlParameter("@hijriSelected", supplier.hijriSelected));
                        cmd.Parameters.Add(new SqlParameter("@bankCountryCodes", supplier.bankCountryCodes));
                        cmd.Parameters.Add(new SqlParameter("@bankName", supplier.bankName != null ? supplier.bankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@otherBankName", supplier.otherBankName != null ? supplier.otherBankName : ""));
                        cmd.Parameters.Add(new SqlParameter("@swiftcode", supplier.swiftcode));
                        cmd.Parameters.Add(new SqlParameter("@accountHolderName", supplier.accountHolderName));
                        cmd.Parameters.Add(new SqlParameter("@ibanNo", supplier.ibanNo));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress", supplier.bankAddress));
                        cmd.Parameters.Add(new SqlParameter("@bankAddress2", supplier.bankAddress2));
                        cmd.Parameters.Add(new SqlParameter("@accountCurrency", supplier.accountCurrency));
                        cmd.Parameters.Add(new SqlParameter("@account_number", supplier.account_number));
                        cmd.Parameters.Add(new SqlParameter("@static_near", supplier.statisticNear));
                        cmd.Parameters.Add(new SqlParameter("@static_first", supplier.statisticFirst));
                        cmd.Parameters.Add(new SqlParameter("@static_medi", supplier.statisticMedical));
                        cmd.Parameters.Add(new SqlParameter("@static_lost", supplier.statisticLost));
                        cmd.Parameters.Add(new SqlParameter("@static_fatal", supplier.statisticFatal));
                        cmd.Parameters.Add(new SqlParameter("@hse_name", supplier.hseName));
                        cmd.Parameters.Add(new SqlParameter("@hse_desig", supplier.hseDesig));
                        cmd.Parameters.Add(new SqlParameter("@quality_name", supplier.qualityName != null ? supplier.qualityName : ""));
                        cmd.Parameters.Add(new SqlParameter("@quality_desig", supplier.qualityDesig != null ? supplier.qualityDesig : ""));
                        cmd.Parameters.Add(new SqlParameter("@qualitymgt_iso", supplier.qualityMgtIso));
                        cmd.Parameters.Add(new SqlParameter("@statisticEnvt", supplier.statisticEnvt));
                        cmd.Parameters.Add(new SqlParameter("@qualityreviewDate", supplier.qualityreviewDate != null ? supplier.qualityreviewDate : ""));
                        cmd.Parameters.Add(new SqlParameter("@id", supplier.supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@multicurrency", supplier.multicurrency));
                        cmd.Parameters.Add(new SqlParameter("@wasaladdress", supplier.wasalAddress));
                        cmd.Parameters.Add(new SqlParameter("@type_of_org2", supplier.typeOfOrganization2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl", supplier.additionalCtrl));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl2", supplier.additionalCtrl2));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl3", supplier.additionalCtrl3));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl4", supplier.additionalCtrl4));
                        cmd.Parameters.Add(new SqlParameter("@additionalCtrl5", supplier.additionalCtrl5));
                        cmd.Parameters.Add(new SqlParameter("@supplier_extra", supplier.supplier_extra));
                        cmd.Parameters.Add(new SqlParameter("@title1", supplier.title1));
                        cmd.Parameters.Add(new SqlParameter("@first_name1", supplier.first_name1));
                        cmd.Parameters.Add(new SqlParameter("@last_name1", supplier.last_name1));
                        cmd.Parameters.Add(new SqlParameter("@position1", supplier.position1));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code1", supplier.telphone_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no1", supplier.telephone_no1));
                        cmd.Parameters.Add(new SqlParameter("@extension1", supplier.extension1));
                        cmd.Parameters.Add(new SqlParameter("@email1", supplier.email1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code1", supplier.mobile_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no1", supplier.mobile_no1));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code1", supplier.fax_country_code1));
                        cmd.Parameters.Add(new SqlParameter("@fax_no1", supplier.fax_no1));
                        cmd.Parameters.Add(new SqlParameter("@title2", supplier.title2));
                        cmd.Parameters.Add(new SqlParameter("@first_name2", supplier.first_name2));
                        cmd.Parameters.Add(new SqlParameter("@last_name2", supplier.last_name2));
                        cmd.Parameters.Add(new SqlParameter("@position2", supplier.position2));
                        cmd.Parameters.Add(new SqlParameter("@telphone_country_code2", supplier.telphone_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@telephone_no2", supplier.telephone_no2));
                        cmd.Parameters.Add(new SqlParameter("@extension2", supplier.extension2));
                        cmd.Parameters.Add(new SqlParameter("@email2", supplier.email2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_country_code2", supplier.mobile_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@mobile_no2", supplier.mobile_no2));
                        cmd.Parameters.Add(new SqlParameter("@fax_country_code2", supplier.fax_country_code2));
                        cmd.Parameters.Add(new SqlParameter("@fax_no2", supplier.fax_no2));



                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }
                return supplier.supplier_id;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<bool> SaveTempCategory(SupplierCategoryDto supplier, int supplierId)
        {
            const string spName = "dbo.Isp_SupplierTempCategory_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@Position", supplier.position));
                        cmd.Parameters.Add(new SqlParameter("@GeneralCatName", supplier.generalCategory));
                        cmd.Parameters.Add(new SqlParameter("@SubCatName", supplier.subCategory));
                        cmd.Parameters.Add(new SqlParameter("@DetailCatName", supplier.detailCategory));
                        cmd.Parameters.Add(new SqlParameter("@GeneralCode", supplier.generalCode));
                        cmd.Parameters.Add(new SqlParameter("@SubCode", supplier.subCode));
                        cmd.Parameters.Add(new SqlParameter("@DetailCode", supplier.detailCode));
                        cmd.Parameters.Add(new SqlParameter("@IsSupplierSelected", supplier.isChecked ? 1 : 0));
                        cmd.Parameters.Add(new SqlParameter("@IsSrmApproved", supplier.isSRMChecked == "Yes" ? 1 : 0));

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

        public async Task<IList<SupplierCategoryDto>> SearchTempCategory(int supplierId)
        {
            const string spName = "dbo.Isp_SupplierTempCategory_Search";
            IList<SupplierCategoryDto> supplierlist = new List<SupplierCategoryDto>();

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
                                SupplierCategoryDto supplier = new SupplierCategoryDto();

                                supplier.position = Convert.ToInt32(reader["CATEGORY_POS_ID"].ToString());
                                supplier.generalCategory = reader["GENERAL_CATEGOTY"].ToString();
                                supplier.subCategory = reader["SUB_CATEGORY"].ToString();
                                supplier.detailCategory = reader["DETAIL_CATEGORY"].ToString();
                                supplier.generalCode = reader["GENERAL_CODE"].ToString();
                                supplier.subCode = reader["SUB_CODE"].ToString();
                                supplier.detailCode = reader["DETAIL_CODE"].ToString();
                                supplier.isChecked = reader["IS_SUPPLIER_SELECTED"].ToString() == "1" ? true : false;
                                supplier.isSRMChecked = reader["IS_SRM_SELECTED"].ToString() == "1" ? "Yes" : "No";
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

        public async Task<IList<SupplierCategoryDto>> SearchCategory(int supplierId)
        {
            const string spName = "dbo.Isp_SupplierCategory_Search";
            IList<SupplierCategoryDto> supplierlist = new List<SupplierCategoryDto>();

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
                                SupplierCategoryDto supplier = new SupplierCategoryDto();

                                supplier.position = Convert.ToInt32(reader["CATEGORY_POS_ID"].ToString());
                                supplier.generalCategory = reader["GENERAL_CATEGOTY"].ToString();
                                supplier.subCategory = reader["SUB_CATEGORY"].ToString();
                                supplier.detailCategory = reader["DETAIL_CATEGORY"].ToString();
                                supplier.generalCode = reader["GENERAL_CODE"].ToString();
                                supplier.subCode = reader["SUB_CODE"].ToString();
                                supplier.detailCode = reader["DETAIL_CODE"].ToString();
                                supplier.isChecked = reader["IS_SUPPLIER_SELECTED"].ToString() == "1" ? true : false;
                                supplier.isSRMChecked = reader["IS_SRM_SELECTED"].ToString() == "1" ? "Yes" : "No";
                                supplier.hseqUpdatedBy = reader["HSEQ_UPDATED_BY"].ToString();
                                supplier.hseqUpdatedDateTime = reader["HSEQ_UPDATED_DATE_TIME"].ToString();
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

        public async Task<bool> UpdateSupplierStatus(int supplierId, string status)
        {
            const string spName = "dbo.Isp_SupplierStatus_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@Status", status));

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

        public async Task<int> IsSupplierExists(string searchValue, string category)
        {
            const string spName = "dbo.Isp_Supplier_IsExists";
            var result = 0;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SearchValue", searchValue));
                        //cmd.Parameters.Add(new SqlParameter("@SupplierEmail", supplierEmail));
                        cmd.Parameters.Add(new SqlParameter("@Category", category));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        result = (int)cmd.ExecuteScalar();
                    }
                    sql.CloseAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<SupplierExistsDto> IsSupplierExistsWithStatus(string searchValue, string category)
        {
            const string spName = "dbo.Isp_Supplier_IsExists_withStatus";
            SupplierExistsDto supplier = new SupplierExistsDto();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SearchValue", searchValue));
                        //cmd.Parameters.Add(new SqlParameter("@SupplierEmail", supplierEmail));
                        cmd.Parameters.Add(new SqlParameter("@Category", category));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                supplier.SUPPLIER_ID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplier.SUPPLIER_NAME = reader["SUPPLIER_NAME"].ToString();
                                supplier.EMAIL = reader["EMAIL"].ToString();
                                supplier.CR_NO = reader["CR_NO"].ToString();
                                supplier.STATUS = reader["STATUS"].ToString();
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return supplier;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<SupplierExistsDto> IsRegistered(string searchValue)
        {
            const string spName = "dbo.Isp_Supplier_Registered";
            SupplierExistsDto supplier = new SupplierExistsDto();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SearchValue", searchValue));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                supplier.SUPPLIER_ID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplier.SUPPLIER_NAME = reader["SUPPLIER_NAME"].ToString();
                                supplier.EMAIL = reader["EMAIL"].ToString();
                                supplier.CR_NO = reader["CR_NO"].ToString();
                                supplier.STATUS = reader["STATUS"].ToString();
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return supplier;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> UpdateSupplierIfsCode(int supplierId, string ifscode)
        {
            const string spName = "dbo.Isp_SupplierIfsCode_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@IfsCode", ifscode));

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

        public async Task<bool> UpdateEmgSupplierIfsCode(int supplierId, string ifscode)
        {
            const string spName = "dbo.Isp_EMGSupplierIfsCode_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@IfsCode", ifscode));

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

        public async Task<bool> SaveHistory(SupplierHistoryDto supplierHistory)
        {
            const string spName = "dbo.Isp_SupplierHistory_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", Convert.ToInt32(supplierHistory.supplier_id)));
                        cmd.Parameters.Add(new SqlParameter("@StatusId", supplierHistory.status_id));
                        cmd.Parameters.Add(new SqlParameter("@StatusRemark", supplierHistory.status_remark));
                        cmd.Parameters.Add(new SqlParameter("@StatusComment", supplierHistory.status_comment));
                        cmd.Parameters.Add(new SqlParameter("@IsCurrentStatus", supplierHistory.iscurrentstatus));
                        cmd.Parameters.Add(new SqlParameter("@UserId", supplierHistory.userid));
                        cmd.Parameters.Add(new SqlParameter("@UserRole", supplierHistory.userrole));
                        cmd.Parameters.Add(new SqlParameter("@CreatedDate", DateTime.Now));
                        cmd.Parameters.Add(new SqlParameter("@Command", supplierHistory.ÇommandName));
                        cmd.Parameters.Add(new SqlParameter("@UserEmail", supplierHistory.useremail));

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


        public async Task<IList<EmergencySupplierDto>> GetSuppliersEMGForRole(string rolename)
        {
            const string spName = "dbo.Isp_SupplierForRoleEMG_Search";
            IList<EmergencySupplierDto> supplierlist = new List<EmergencySupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", rolename != null ? rolename : ""));
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
                                supplieremergency.workflow_id = reader["WORKFLOW_DOC_ID"].ToString(); ;
                                supplieremergency.process_id = reader["PROCESS_ID"].ToString(); ;
                                supplieremergency.status = reader["STATUS"].ToString(); ;
                                supplieremergency.workflowstatus = reader["WFState"].ToString(); ;
                                supplieremergency.create_date_time = reader["CREATED_DATE_TIME"].ToString();
                                supplieremergency.invite_by = reader["INVITE_BY"].ToString();
                                supplieremergency.invite_by_email = reader["INVITE_BY_EMAIL"].ToString();
                                supplieremergency.invite_by_role = reader["INVITE_BY_ROLE"].ToString();
                                supplieremergency.ifs_code = reader["IFS_CODE"].ToString();

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

        // Delete Emergency Supplier
        public async Task<bool> DeleteEmergency(int supplierId)
        {
            const string spName = "dbo.Isp_EmergencySupplier_Delete";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));

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

        // Delete Invite Supplier
        public async Task<bool> DeleteInvite(int supplierId)
        {
            const string spName = "dbo.Isp_InviteSupplier_delete";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));

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

        public async Task<bool> saveIFSFailedRecords(IfsFailMessageDto ifsdata)
        {
            const string spName = "dbo.Isp_IfsFailedMessage_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", Convert.ToInt32(ifsdata.supplierId)));
                        cmd.Parameters.Add(new SqlParameter("@SupplierName", ifsdata.supplierName));
                        cmd.Parameters.Add(new SqlParameter("@SupplierEmail", ifsdata.supplierEmail));
                        cmd.Parameters.Add(new SqlParameter("@Category", ifsdata.category));
                        cmd.Parameters.Add(new SqlParameter("@Error", ifsdata.message));

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

        // Category update action by HSEQ
        public async Task<bool> HSEQupdatedAction(string supplierID, string updatedBy, string updatedDateTime)
        {
            const string spName = "dbo.Isp_SupplierCategoryHSEQ_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierID));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedBy", updatedBy));
                        cmd.Parameters.Add(new SqlParameter("@UpdatedDateTime", updatedDateTime));
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

        //New UI Related changes

        public async Task<List<DashboardStatDto>> GetDashboardStatistic(string roleId)
        {
            const string spName = "dbo.Isp_DashboardStat_Search";

            var statistics = new List<DashboardStatDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", roleId));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                DashboardStatDto stat = new DashboardStatDto();

                                stat.description = reader["DESCP"].ToString();
                                stat.value = reader["VAL"].ToString();

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
        // Get category HSEQ action result for by HSEQ
        public async Task<IList<CategoriesForHSEQDto>> GetSupplierCategoriesForHSEQ(string supplierId)
        {
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
                                suppliercategory.isSRMChecked = reader["IS_SRM_SELECTED"].ToString() == "1" ? "Yes" : "No";
                                suppliercategory.isHSEQChecked = reader["IS_AUDIT_SELECTED"].ToString() == "1" ? "Yes" : "No";
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

        // Update Supplier Categories by HSEQ
        public async Task<bool> UpdateSupplierCategoryByHSEQ(SupplierCategoryDto category, int supplierId)
        {
            const string spName = "dbo.Isp_SupplierCategory_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@IsSrmSelected", category.isSRMChecked == "Yes" ? 1 : 0));
                        cmd.Parameters.Add(new SqlParameter("@position", category.position));
                        cmd.Parameters.Add(new SqlParameter("@IsAuditSelected", category.isHSEQChecked == "Yes" ? 1 : 0));
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

        // Get all suppliers
        public async Task<IList<SupplierBankDto>> AllSuppliers()
        {
            const string spName = "dbo.Isp_AllSupplier_Search";
            var supplierlist = new List<SupplierBankDto>();

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
                                SupplierBankDto supplierBank = new SupplierBankDto();

                                supplierBank.SupplierID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplierBank.SupplierCode = reader["SUPPLIER_CODE"].ToString();
                                supplierBank.SupplierName = reader["SUPPLIER_NAME"].ToString();
                                supplierBank.SupplierNameArabic = reader["SUPPLIER_NAME_ARABIC"].ToString();
                                supplierBank.EstablishmentYear = Convert.ToInt32(reader["ESTABLISHMENT_YEAR"].ToString());
                                supplierBank.IssuedBy = reader["ISSUED_BY"].ToString();
                                supplierBank.Website = reader["WEB_SITE"].ToString();
                                supplierBank.SupplierType = reader["SUPPLIER_TYPE"].ToString();

                                supplierBank.Country = reader["COUNTRY"].ToString();
                                supplierBank.City = reader["CITY"].ToString();
                                supplierBank.OtherCity = reader["OTHER_CITY"].ToString();
                                supplierBank.PoBox = reader["PO_BOX"].ToString();
                                supplierBank.PostalCode = reader["POSTAL_CODE"].ToString();
                                supplierBank.AddressLine1 = reader["ADDRESS_LINE1"].ToString();
                                supplierBank.AddressLine2 = reader["ADDRESS_LINE2"].ToString();

                                supplierBank.Title = reader["TITLE"].ToString();
                                supplierBank.FirstName = reader["FIRST_NAME"].ToString();
                                supplierBank.LastName = reader["LAST_NAME"].ToString();
                                supplierBank.CurrentPosition = reader["POSITION"].ToString();
                                supplierBank.TelphoneCountryCode = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplierBank.TelephoneNo = reader["TELEPHONE_NO"].ToString();
                                supplierBank.Extension = Convert.ToInt32(reader["EXTENSION"].ToString());
                                supplierBank.Email = reader["EMAIL"].ToString();
                                supplierBank.MobileCountryCode = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplierBank.MobileNo = reader["MOBILE_NO"].ToString();
                                supplierBank.FaxCountryCode = reader["FAX_COUNTRY_CODE"].ToString();
                                supplierBank.FaxNo = reader["FAX_NO"].ToString();
                                supplierBank.HijriSelected = reader["HIJRI_SELECTED"].ToString();

                                supplierBank.CRNo = reader["CR_NO"].ToString();
                                supplierBank.CRexpDate = reader["CR_EXP_DATE"].ToString();
                                supplierBank.RegDate = reader["REG_DATE"].ToString();
                                supplierBank.VatNo = reader["VAT_NO"].ToString();
                                supplierBank.GosiCertificate = reader["GOSI_CERTIFICATE"].ToString();
                                supplierBank.GosiDate = reader["GOSI_DATE"].ToString();
                                supplierBank.SaudiDate = reader["SAUDI_DATE"].ToString();
                                supplierBank.ZakathDate = reader["ZAKATH_DATE"].ToString();
                                supplierBank.AdditionalMaterial = reader["ADDITIONAL_MATERIAL"].ToString();
                                supplierBank.WaselAddress = reader["WASAL_ADDRESS"].ToString();

                                // Profile
                                supplierBank.TypeOfOrg = reader["TYPE_OF_ORG"].ToString();
                                supplierBank.ManagerialCount = Convert.ToInt32(reader["NO_OF_MANAGER"].ToString());
                                supplierBank.OperationsCount = Convert.ToInt32(reader["NO_OF_OPERATION"].ToString());
                                supplierBank.SaudiNationalsCount = Convert.ToInt32(reader["NO_OF_SAUDI"].ToString());
                                supplierBank.TechnicalCount = Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString());
                                supplierBank.TotalCount = Convert.ToInt32(reader["NO_OF_TOTAL"].ToString());
                                supplierBank.ParentCompany = reader["PARENT_COMPANY_INFO"].ToString();
                                supplierBank.SisterCompany = reader["SISTERCOMPANY"].ToString();
                                supplierBank.OwnerCompany = reader["OWNER_INFO"].ToString();

                                supplierBank.OperatingProfit1 = Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString());
                                supplierBank.OperatingProfit2 = reader["OPERATINGPROFIT2"].ToString();
                                supplierBank.NetIncome1 = Convert.ToInt32(reader["NETINCOME1"].ToString());
                                supplierBank.NetIncome2 = reader["NETINCOME2"].ToString();
                                supplierBank.CurrentAsset1 = Convert.ToInt32(reader["CURRENTASSET1"].ToString());
                                supplierBank.CurrentAsset2 = reader["CURRENTASSET2"].ToString();
                                supplierBank.TotalLiable1 = Convert.ToInt32(reader["TOTALLIABLE1"].ToString());
                                supplierBank.TotalLiable2 = reader["TOTALLIABLE2"].ToString();
                                supplierBank.TotalEquity1 = Convert.ToInt32(reader["TOTALEQUITY1"].ToString());
                                supplierBank.TotalEquity2 = reader["TOTALEQUITY2"].ToString();

                                supplierBank.NoOfYears = Convert.ToInt32(reader["NOOFYEARS"].ToString());
                                supplierBank.OwnsPlantEquip = reader["OWNSPLANTEQUIP"].ToString();
                                supplierBank.DesignnCap = reader["DESIGNNCAP"].ToString();
                                supplierBank.FinishProd = reader["FINISHPROD"].ToString();
                                supplierBank.InternalPolicy = reader["INTERNALPOLICY"].ToString();
                                supplierBank.registeredOrg = reader["REGISTEREDORG"].ToString();
                                supplierBank.suspendedProj1 = reader["SUSPENDEDPROJ1"].ToString();
                                supplierBank.suspendedProj2 = reader["SUSPENDEDPROJ2"].ToString();

                                supplierBank.litigation1 = reader["LITIGATION1"].ToString();
                                supplierBank.litigation2 = reader["LITIGATION2"].ToString();
                                supplierBank.compliance1 = reader["COMPLIANCE1"].ToString();
                                supplierBank.shareholder1 = reader["SHAREHOLDER1"].ToString();
                                supplierBank.shareholder2 = reader["SHAREHOLDER2"].ToString();
                                supplierBank.labour1 = reader["LABOUR1"].ToString();
                                supplierBank.labour2 = reader["LABOUR2"].ToString();
                                supplierBank.legalAsset1 = reader["LEGALASSET1"].ToString();
                                supplierBank.legalAsset2 = reader["LEGALASSET2"].ToString();
                                supplierBank.environment1 = reader["ENVIRONMENT1"].ToString();
                                supplierBank.environment2 = reader["ENVIRONMENT2"].ToString();
                                supplierBank.imiInterested1 = reader["IMIINTERESTED1"].ToString();
                                supplierBank.imiInterested2 = reader["IMIINTERESTED2"].ToString();

                                supplierBank.hse1 = reader["HSE1"].ToString();
                                supplierBank.docuHse = reader["DOCUHSE"].ToString();
                                supplierBank.isohealth = reader["ISOHEALTH"].ToString();
                                supplierBank.envtMgt1 = reader["ENVTMGT1"].ToString();
                                supplierBank.dedicatedpers = reader["DEDICATEDPERS"].ToString();
                                supplierBank.hseName = reader["HSENAME"].ToString();
                                supplierBank.hseDesig = reader["HSEDESIG"].ToString();
                                supplierBank.statistic = reader["STATISTIC"].ToString();
                                supplierBank.statisticNear = reader["STATISTICNEAR"].ToString();
                                supplierBank.statisticFirst = reader["STATISTICFIRST"].ToString();
                                supplierBank.statisticMedical = reader["STATISTICMEDI"].ToString();
                                supplierBank.statisticLost = reader["STATISTICLOST"].ToString();
                                supplierBank.statisticFatal = reader["STATISTICFATAL"].ToString();
                                supplierBank.statisticEnvt = reader["STATISTICENVT"].ToString();

                                supplierBank.qualityPolicy1 = reader["QUALITYPOLICY1"].ToString();
                                supplierBank.qualityMgt = reader["QUALITYMGT"].ToString();
                                supplierBank.qualityMgtIso = reader["QUALITYMGTISO"].ToString();
                                supplierBank.qualityResp1 = reader["QUALITYRESP1"].ToString();
                                supplierBank.qualityResp2 = reader["QUALITYRESP2"].ToString();
                                supplierBank.qualityResp3 = reader["QUALITYRESP3"].ToString();
                                supplierBank.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString();
                                // supplierBank.revisionNo = Convert.ToInt32(reader["REVISION_NO"].ToString());

                                // Bank
                                supplierBank.BankCountryCode = reader["BANK_COUNTRY_CODE"].ToString();
                                supplierBank.BankName = reader["BANK_NAME"].ToString();
                                supplierBank.OtherBank = reader["OTHER_BANK"].ToString();
                                supplierBank.BicCode = reader["SWIFT_CODE"].ToString();
                                supplierBank.AccountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString();
                                supplierBank.AccountNumber = reader["account_no"].ToString();
                                supplierBank.ibanNo = reader["IBAN_NO"].ToString();
                                supplierBank.BankAddress = reader["BANK_ADDRESS"].ToString();
                                supplierBank.BankAddress2 = reader["BANK_ADDRESS_2"].ToString();
                                supplierBank.AccountCurrency = reader["ACCOUNT_CURRENCY"].ToString();
                                supplierBank.Multicurrency = reader["MULTICURRENCY"].ToString();

                                supplierBank.CreatedDate = reader["CREATED_DATE"].ToString();
                                supplierBank.Status = reader["STATUS"].ToString();
                                supplierBank.PushedSupplierStatus = reader["PUSHEDSUPPLIERSTATUS"].ToString();
                                supplierBank.Criticality = reader["CRITICALITY_VALUE"].ToString();
                                supplierBank.InvitedSupplier = reader["INVITED"].ToString();

                                supplierBank.AuditType = reader["AUDIT_TYPE"].ToString();

                                supplierlist.Add(supplierBank);
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

        public async Task<IList<SupplierBankDto>> AllSuppliersTrunc(string supplierIds = "")
        {
            const string spName = "dbo.Isp_AllSupplier_Search_Trunc";
            var supplierlist = new List<SupplierBankDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierIds", supplierIds));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SupplierBankDto supplierBank = new SupplierBankDto();

                                supplierBank.SupplierID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplierBank.SupplierName = reader["SUPPLIER_NAME"].ToString();
                                supplierBank.SupplierType = reader["SUPPLIER_TYPE"].ToString();
                                supplierBank.SupplierCode = reader["IFS_CODE"].ToString();
                                supplierBank.RegDate = reader["REG_DATE"].ToString();
                                supplierBank.Status = reader["STATUS"].ToString();
                                supplierlist.Add(supplierBank);
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
        // Get all suppliers with Audit
        public async Task<IList<SupplierAuditDto>> AllSuppliersWithAudit()
        {
            const string spName = "dbo.Isp_AllSupplierAudit_Search";
            var supplierlist = new List<SupplierAuditDto>();

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
                                SupplierAuditDto supplierBank = new SupplierAuditDto();

                                supplierBank.SupplierID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplierBank.SupplierCode = reader["SUPPLIER_CODE"].ToString();
                                supplierBank.SupplierName = reader["SUPPLIER_NAME"].ToString();
                                supplierBank.SupplierNameArabic = reader["SUPPLIER_NAME_ARABIC"].ToString();
                                supplierBank.EstablishmentYear = Convert.ToInt32(reader["ESTABLISHMENT_YEAR"].ToString());
                                supplierBank.IssuedBy = reader["ISSUED_BY"].ToString();
                                supplierBank.Website = reader["WEB_SITE"].ToString();
                                supplierBank.SupplierType = reader["SUPPLIER_TYPE"].ToString();

                                supplierBank.Country = reader["COUNTRY"].ToString();
                                supplierBank.City = reader["CITY"].ToString();
                                supplierBank.OtherCity = reader["OTHER_CITY"].ToString();
                                supplierBank.PoBox = reader["PO_BOX"].ToString();
                                supplierBank.PostalCode = reader["POSTAL_CODE"].ToString();
                                supplierBank.AddressLine1 = reader["ADDRESS_LINE1"].ToString();
                                supplierBank.AddressLine2 = reader["ADDRESS_LINE2"].ToString();

                                supplierBank.Title = reader["TITLE"].ToString();
                                supplierBank.FirstName = reader["FIRST_NAME"].ToString();
                                supplierBank.LastName = reader["LAST_NAME"].ToString();
                                supplierBank.CurrentPosition = reader["POSITION"].ToString();
                                supplierBank.TelphoneCountryCode = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplierBank.TelephoneNo = reader["TELEPHONE_NO"].ToString();
                                supplierBank.Extension = Convert.ToInt32(reader["EXTENSION"].ToString());
                                supplierBank.Email = reader["EMAIL"].ToString();
                                supplierBank.MobileCountryCode = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplierBank.MobileNo = reader["MOBILE_NO"].ToString();
                                supplierBank.FaxCountryCode = reader["FAX_COUNTRY_CODE"].ToString();
                                supplierBank.FaxNo = reader["FAX_NO"].ToString();
                                supplierBank.HijriSelected = reader["HIJRI_SELECTED"].ToString();

                                supplierBank.CRNo = reader["CR_NO"].ToString();
                                supplierBank.CRexpDate = reader["CR_EXP_DATE"].ToString();
                                supplierBank.RegDate = reader["REG_DATE"].ToString();
                                supplierBank.VatNo = reader["VAT_NO"].ToString();
                                supplierBank.GosiCertificate = reader["GOSI_CERTIFICATE"].ToString();
                                supplierBank.GosiDate = reader["GOSI_DATE"].ToString();
                                supplierBank.SaudiDate = reader["SAUDI_DATE"].ToString();
                                supplierBank.ZakathDate = reader["ZAKATH_DATE"].ToString();
                                supplierBank.AdditionalMaterial = reader["ADDITIONAL_MATERIAL"].ToString();
                                supplierBank.WaselAddress = reader["WASAL_ADDRESS"].ToString();

                                // Profile
                                supplierBank.TypeOfOrg = reader["TYPE_OF_ORG"].ToString();
                                supplierBank.ManagerialCount = Convert.ToInt32(reader["NO_OF_MANAGER"].ToString());
                                supplierBank.OperationsCount = Convert.ToInt32(reader["NO_OF_OPERATION"].ToString());
                                supplierBank.SaudiNationalsCount = Convert.ToInt32(reader["NO_OF_SAUDI"].ToString());
                                supplierBank.TechnicalCount = Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString());
                                supplierBank.TotalCount = Convert.ToInt32(reader["NO_OF_TOTAL"].ToString());
                                supplierBank.ParentCompany = reader["PARENT_COMPANY_INFO"].ToString();
                                supplierBank.SisterCompany = reader["SISTERCOMPANY"].ToString();
                                supplierBank.OwnerCompany = reader["OWNER_INFO"].ToString();

                                supplierBank.OperatingProfit1 = Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString());
                                supplierBank.OperatingProfit2 = reader["OPERATINGPROFIT2"].ToString();
                                supplierBank.NetIncome1 = Convert.ToInt32(reader["NETINCOME1"].ToString());
                                supplierBank.NetIncome2 = reader["NETINCOME2"].ToString();
                                supplierBank.CurrentAsset1 = Convert.ToInt32(reader["CURRENTASSET1"].ToString());
                                supplierBank.CurrentAsset2 = reader["CURRENTASSET2"].ToString();
                                supplierBank.TotalLiable1 = Convert.ToInt32(reader["TOTALLIABLE1"].ToString());
                                supplierBank.TotalLiable2 = reader["TOTALLIABLE2"].ToString();
                                supplierBank.TotalEquity1 = Convert.ToInt32(reader["TOTALEQUITY1"].ToString());
                                supplierBank.TotalEquity2 = reader["TOTALEQUITY2"].ToString();

                                supplierBank.NoOfYears = Convert.ToInt32(reader["NOOFYEARS"].ToString());
                                supplierBank.OwnsPlantEquip = reader["OWNSPLANTEQUIP"].ToString();
                                supplierBank.DesignnCap = reader["DESIGNNCAP"].ToString();
                                supplierBank.FinishProd = reader["FINISHPROD"].ToString();
                                supplierBank.InternalPolicy = reader["INTERNALPOLICY"].ToString();
                                supplierBank.registeredOrg = reader["REGISTEREDORG"].ToString();
                                supplierBank.suspendedProj1 = reader["SUSPENDEDPROJ1"].ToString();
                                supplierBank.suspendedProj2 = reader["SUSPENDEDPROJ2"].ToString();

                                supplierBank.litigation1 = reader["LITIGATION1"].ToString();
                                supplierBank.litigation2 = reader["LITIGATION2"].ToString();
                                supplierBank.compliance1 = reader["COMPLIANCE1"].ToString();
                                supplierBank.shareholder1 = reader["SHAREHOLDER1"].ToString();
                                supplierBank.shareholder2 = reader["SHAREHOLDER2"].ToString();
                                supplierBank.labour1 = reader["LABOUR1"].ToString();
                                supplierBank.labour2 = reader["LABOUR2"].ToString();
                                supplierBank.legalAsset1 = reader["LEGALASSET1"].ToString();
                                supplierBank.legalAsset2 = reader["LEGALASSET2"].ToString();
                                supplierBank.environment1 = reader["ENVIRONMENT1"].ToString();
                                supplierBank.environment2 = reader["ENVIRONMENT2"].ToString();
                                supplierBank.imiInterested1 = reader["IMIINTERESTED1"].ToString();
                                supplierBank.imiInterested2 = reader["IMIINTERESTED2"].ToString();

                                supplierBank.hse1 = reader["HSE1"].ToString();
                                supplierBank.docuHse = reader["DOCUHSE"].ToString();
                                supplierBank.isohealth = reader["ISOHEALTH"].ToString();
                                supplierBank.envtMgt1 = reader["ENVTMGT1"].ToString();
                                supplierBank.dedicatedpers = reader["DEDICATEDPERS"].ToString();
                                supplierBank.hseName = reader["HSENAME"].ToString();
                                supplierBank.hseDesig = reader["HSEDESIG"].ToString();
                                supplierBank.statistic = reader["STATISTIC"].ToString();
                                supplierBank.statisticNear = reader["STATISTICNEAR"].ToString();
                                supplierBank.statisticFirst = reader["STATISTICFIRST"].ToString();
                                supplierBank.statisticMedical = reader["STATISTICMEDI"].ToString();
                                supplierBank.statisticLost = reader["STATISTICLOST"].ToString();
                                supplierBank.statisticFatal = reader["STATISTICFATAL"].ToString();
                                supplierBank.statisticEnvt = reader["STATISTICENVT"].ToString();

                                supplierBank.qualityPolicy1 = reader["QUALITYPOLICY1"].ToString();
                                supplierBank.qualityMgt = reader["QUALITYMGT"].ToString();
                                supplierBank.qualityMgtIso = reader["QUALITYMGTISO"].ToString();
                                supplierBank.qualityResp1 = reader["QUALITYRESP1"].ToString();
                                supplierBank.qualityResp2 = reader["QUALITYRESP2"].ToString();
                                supplierBank.qualityResp3 = reader["QUALITYRESP3"].ToString();
                                supplierBank.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString();
                                // supplierBank.revisionNo = Convert.ToInt32(reader["REVISION_NO"].ToString());

                                // Bank
                                supplierBank.BankCountryCode = reader["BANK_COUNTRY_CODE"].ToString();
                                supplierBank.BankName = reader["BANK_NAME"].ToString();
                                supplierBank.OtherBank = reader["OTHER_BANK"].ToString();
                                supplierBank.BicCode = reader["SWIFT_CODE"].ToString();
                                supplierBank.AccountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString();
                                supplierBank.AccountNumber = reader["account_no"].ToString();
                                supplierBank.ibanNo = reader["IBAN_NO"].ToString();
                                supplierBank.BankAddress = reader["BANK_ADDRESS"].ToString();
                                supplierBank.BankAddress2 = reader["BANK_ADDRESS_2"].ToString();
                                supplierBank.AccountCurrency = reader["ACCOUNT_CURRENCY"].ToString();
                                supplierBank.Multicurrency = reader["MULTICURRENCY"].ToString();

                                // Audit
                                supplierBank.StatusRemark = reader["STATUS_REMARK"].ToString();
                                supplierBank.StatusComment = reader["STATUS_COMMENT"].ToString();
                                supplierBank.IsCurrentStatus = reader["ISCURRENTSTATUS"].ToString();
                                supplierBank.ActionCommand = reader["ACTION_COMMAND"].ToString();
                                supplierBank.AuditCreatedDate = reader["CREATEDDATE"].ToString();
                                supplierBank.AuditUserID = reader["USERID"].ToString();
                                supplierBank.AuditUserRole = reader["USERROLE"].ToString();

                                supplierBank.CreatedDate = reader["CREATED_DATE"].ToString();
                                supplierBank.Status = reader["STATUS"].ToString();
                                supplierBank.PushedSupplierStatus = reader["PUSHEDSUPPLIERSTATUS"].ToString();
                                supplierBank.Criticality = reader["CRITICALITY_VALUE"].ToString();
                                supplierBank.InvitedSupplier = reader["INVITED"].ToString();

                                supplierBank.AuditType = reader["AUDIT_TYPE"].ToString();

                                supplierlist.Add(supplierBank);
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

        // Get Supplier's all Categories 
        public async Task<IList<SupplierAllCategoriesDto>> SupplierCategories(int[] supplierID)
        {
            const string spName = "dbo.Isp_SupplierAllCategory_Search";
            var supplierAllCategories = new List<SupplierAllCategoriesDto>();

            try
            {
                foreach (var id in supplierID)
                {
                    using (SqlConnection sql = new SqlConnection(_connectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand(spName, sql))
                        {
                            cmd.CommandType = System.Data.CommandType.StoredProcedure;
                            cmd.Parameters.Add(new SqlParameter("@SupplierId", Convert.ToInt32(id)));
                            sql.OpenAsync();

                            using (var reader = await cmd.ExecuteReaderAsync())
                            {
                                while (await reader.ReadAsync())
                                {
                                    SupplierAllCategoriesDto supplier = new SupplierAllCategoriesDto();

                                    supplier.supplierCode = reader["SUPPLIER_CODE"].ToString();
                                    supplier.generalCategory = reader["GENERAL_CATEGOTY"].ToString();
                                    supplier.subCategory = reader["SUB_CATEGORY"].ToString();
                                    supplier.detailCategory = reader["DETAIL_CATEGORY"].ToString();
                                    supplierAllCategories.Add(supplier);
                                }
                            }
                        }
                        sql.CloseAsync();
                    }
                }
                return supplierAllCategories;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Get Supplier's audit type
        public async Task<string> GetSupplierAuditType(int supplierID)
        {
            const string spName = "dbo.Isp_Supplier_AuditType_Search";
            var audit_type = "";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierID));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                audit_type = reader["AUDIT_TYPE"].ToString() != "NULL" || reader["AUDIT_TYPE"].ToString() != "null" ? reader["AUDIT_TYPE"].ToString() : "";
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return audit_type;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Update Supplier's audit type 
        public async Task<bool> UpdateSupplierAuditType(SupplierAuditTypeDto supplierAuditType)
        {
            const string spName = "dbo.Isp_Supplier_AuditType_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierAuditType.supplierID));
                        cmd.Parameters.Add(new SqlParameter("@AuditType", supplierAuditType.auditType));
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
        public async Task<bool> SaveFileName(SupplierFileNameDto file, int supplierId)
        {
            const string spName = "dbo.Isp_FileName_Save";
            try
            {
                string[] filenames = file.ORIGINAL_FILE_NAME.Split('~');
                foreach (var filename in filenames)
                {
                    string fileType = filename.Substring(0, 2);

                    using (SqlConnection sql = new SqlConnection(_connectionString))
                    {
                        using (SqlCommand cmd = new SqlCommand(spName, sql))
                        {


                            cmd.CommandType = System.Data.CommandType.StoredProcedure;
                            cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                            cmd.Parameters.Add(new SqlParameter("@SupplierName", file.SUPPLIER_NAME));
                            cmd.Parameters.Add(new SqlParameter("@FileName", filename));
                            cmd.Parameters.Add(new SqlParameter("@FileTag", fileType));
                            cmd.Parameters.Add(new SqlParameter("@SupplierType", file.SUPPLIER_TYPE));
                            await sql.OpenAsync();
                            await cmd.ExecuteNonQueryAsync();



                        }
                        sql.CloseAsync();
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public async Task<bool> UpdateFileName(SupplierFileNameDto file)
        {
            const string spName = "dbo.Isp_FileName_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", file.SUPPLIER_ID));
                        cmd.Parameters.Add(new SqlParameter("@SupplierName", file.SUPPLIER_NAME));
                        cmd.Parameters.Add(new SqlParameter("@FileName", file.ORIGINAL_FILE_NAME));
                        cmd.Parameters.Add(new SqlParameter("@FileTag", file.FILE_TAG));
                        cmd.Parameters.Add(new SqlParameter("@SupplierType", file.SUPPLIER_TYPE));
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
        public async Task<IList<SupplierFileNameDto>> GetFileName(string supplierId)
        {
            const string spName = "dbo.Isp_FileName_Search";
            IList<SupplierFileNameDto> supplierfilenamelist = new List<SupplierFileNameDto>();

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
                                SupplierFileNameDto supplierfilename = new SupplierFileNameDto();

                                supplierfilename.SUPPLIER_ID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplierfilename.SUPPLIER_NAME = reader["SUPPLIER_NAME"].ToString();
                                supplierfilename.ORIGINAL_FILE_NAME = reader["ORIGINAL_FILE_NAME"].ToString();
                                supplierfilename.FILE_TAG = reader["FILE_TAG"].ToString();
                                supplierfilename.SUPPLIER_TYPE = reader["SUPPLIER_TYPE"].ToString();

                                supplierfilenamelist.Add(supplierfilename);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return supplierfilenamelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<DashboardStatDto>> GetSuppliersStatusCountBasedOnRole(string rolename)
        {
            try
            {
                const string spName = "dbo.Isp_SupplierPendingCountForRole_Search";

                var statistics = new List<DashboardStatDto>();

                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", rolename != null ? rolename : ""));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                DashboardStatDto stat = new DashboardStatDto();

                                stat.description = reader["status"].ToString();
                                stat.value = reader["value"].ToString();

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
                return null;
            }
        }

        public async Task<List<IfsIntegrationDto>> GetIfsFailedData(int supplierID)
        {
            const string spName = "dbo.Isp_IfsIntegrationFailed_Search";
            List<IfsIntegrationDto> supplierlist = new List<IfsIntegrationDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierID));
                        sql.Open();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                IfsIntegrationDto suppliername = new IfsIntegrationDto();

                                suppliername.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                suppliername.supplierName = reader["SUPPLIER_NAME"].ToString();
                                suppliername.supplierCode = reader["SUPPLIER_CODE"].ToString();
                                suppliername.status = reader["STATUS"].ToString();
                                suppliername.supplierEmail = reader["EMAIL"].ToString();
                                suppliername.error = reader["ERROR"].ToString();
                                suppliername.interfacedDate = reader["INTERFACED_DATE"].ToString();
                                suppliername.userrole = reader["USER_ROLE"].ToString();
                                suppliername.category = reader["CATEGORY"].ToString();

                                supplierlist.Add(suppliername);
                            }
                        }

                    }
                    sql.Close();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> UpdateReInterfaceStatus(int supplierId)
        {
            const string spName = "dbo.Isp_IfsIntegration_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        sql.Open();
                        cmd.ExecuteNonQuery();
                    }
                    sql.Close();
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<List<IfsHistoryUpdateDto>> GetIfsFailedUpdatedHistory(int supplierID)
        {
            const string spName = "dbo.Isp_IfsSupportHistory_Search";
            List<IfsHistoryUpdateDto> supplierlist = new List<IfsHistoryUpdateDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierID));
                        sql.Open();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                IfsHistoryUpdateDto suppliername = new IfsHistoryUpdateDto();

                                suppliername.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                suppliername.changerEmail = reader["CHANGER_EMAIL"].ToString();
                                suppliername.changerRole = reader["CHANGER_ROLE"].ToString();
                                suppliername.changerName = reader["CHANGER_NAME"].ToString();
                                suppliername.interfacedDate = reader["INTERFACED_DATE"].ToString();
                                suppliername.fieldName = reader["FIELD_NAME"].ToString();
                                suppliername.changedFrom = reader["CHANGED_FROM"].ToString();
                                suppliername.ChangedTo = reader["CHANGED_TO"].ToString();

                                supplierlist.Add(suppliername);
                            }
                        }

                    }
                    sql.Close();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<SupplierDto>> GetSupplierInformation(IsExistsDto isExists)
        {
            try
            {
                const string spName = "dbo.Isp_SupplierData_Search";
                List<SupplierDto> supplierlist = new List<SupplierDto>();

                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Category", isExists.category));
                        cmd.Parameters.Add(new SqlParameter("@Value", isExists.value));
                        sql.Open();

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
                                supplier.extension = (reader["EXTENSION"].ToString() != "NULL" && reader["EXTENSION"].ToString() != "") ? Convert.ToInt32(reader["EXTENSION"].ToString()) : 0;
                                supplier.mobile_country_code = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplier.mobile_no = reader["MOBILE_NO"].ToString();
                                supplier.fax_country_code = reader["FAX_COUNTRY_CODE"].ToString();
                                supplier.fax_no = reader["FAX_NO"].ToString();
                                supplier.cr_no = reader["CR_NO"].ToString();
                                supplier.cr_exp_date = reader["CR_EXP_DATE"].ToString();
                                supplier.additional_material = reader["ADDITIONAL_MATERIAL"].ToString();
                                supplier.typeOfOrganization = reader["TYPE_OF_ORG"].ToString();
                                supplier.managerialno = reader["NO_OF_MANAGER"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_MANAGER"].ToString()) : 0;
                                supplier.operationsno = reader["NO_OF_OPERATION"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_OPERATION"].ToString()) : 0;
                                supplier.technicalno = reader["NO_OF_TECHNICAL"].ToString() != "NULL" ? Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString()) : 0;
                                supplier.parentcompany = reader["PARENT_COMPANY_INFO"].ToString();
                                //supplier.affiliated_company_info = reader["AFFILIATED_COMPANY_INFO"].ToString(); ;
                                supplier.ownercompany = reader["OWNER_INFO"].ToString();
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
                                supplier.bankCountryCodes = reader["BANK_COUNTRY_CODE"].ToString();
                                supplier.bankName = reader["BANK_NAME"].ToString();
                                supplier.otherBankName = reader["OTHER_BANK"].ToString();
                                supplier.swiftcode = reader["SWIFT_CODE"].ToString();
                                supplier.accountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString();
                                //supplier.account_number = reader["ACCOUNT_INT"].ToString(); 
                                supplier.ibanNo = reader["IBAN_NO"].ToString();
                                supplier.bankAddress = reader["BANK_ADDRESS"].ToString();
                                supplier.bankAddress2 = reader["BANK_ADDRESS_2"].ToString();
                                supplier.accountCurrency = reader["ACCOUNT_CURRENCY"].ToString();
                                supplier.criticality = reader["CRITICALITY_VALUE"].ToString();
                                supplier.workflow_id = reader["WORKFLOW_DOC_ID"].ToString();
                                supplier.process_id = reader["PROCESS_ID"].ToString();
                                supplier.parentcompany = reader["PARENTCOMPANY"].ToString();
                                supplier.sistercompany = reader["SISTERCOMPANY"].ToString();
                                supplier.ownercompany = reader["OWNERCOMPANY"].ToString();
                                supplier.operatingProfit1 = reader["OPERATINGPROFIT1"].ToString() != "NULL" ? Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString()) : 0;
                                supplier.operatingProfit2 = reader["OPERATINGPROFIT2"].ToString() != "" ? (reader["OPERATINGPROFIT2"].ToString()) : "0";
                                supplier.netIncome1 = reader["NETINCOME1"].ToString() != "NULL" ? Convert.ToInt32(reader["NETINCOME1"].ToString()) : 0;
                                supplier.netIncome2 = reader["NETINCOME2"].ToString();
                                supplier.currentAsset1 = reader["CURRENTASSET1"].ToString() != "NULL" ? Convert.ToInt32(reader["CURRENTASSET1"].ToString()) : 0;
                                supplier.currentAsset2 = reader["CURRENTASSET2"].ToString() != "" ? (reader["CURRENTASSET2"].ToString()) : "0";
                                supplier.totalLiable1 = reader["TOTALLIABLE1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALLIABLE1"].ToString()) : 0;
                                supplier.totalLiable2 = reader["TOTALLIABLE2"].ToString() != "" ? (reader["TOTALLIABLE2"].ToString()) : "0";
                                supplier.totalEquity1 = reader["TOTALEQUITY1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALEQUITY1"].ToString()) : 0;
                                supplier.totalEquity2 = reader["TOTALEQUITY2"].ToString() != "" ? (reader["TOTALEQUITY2"].ToString()) : "0";
                                supplier.noOfYears = reader["NOOFYEARS"].ToString() != "" ? Convert.ToInt32(reader["NOOFYEARS"].ToString()) : 0;
                                supplier.ownsPlantEquip = reader["OWNSPLANTEQUIP"].ToString();
                                supplier.designnCap = reader["DESIGNNCAP"].ToString();
                                supplier.finishProd = reader["FINISHPROD"].ToString();
                                supplier.internalPolicy = reader["INTERNALPOLICY"].ToString();
                                supplier.registeredOrg = reader["REGISTEREDORG"].ToString();
                                supplier.suspendedProj1 = reader["SUSPENDEDPROJ1"].ToString();
                                supplier.suspendedProj2 = reader["SUSPENDEDPROJ2"].ToString();
                                supplier.litigation1 = reader["LITIGATION1"].ToString();
                                supplier.litigation2 = reader["LITIGATION2"].ToString();
                                supplier.compliance1 = reader["COMPLIANCE1"].ToString();
                                supplier.compliance2 = reader["COMPLIANCE2"].ToString();
                                supplier.shareholder1 = reader["SHAREHOLDER1"].ToString();
                                supplier.shareholder2 = reader["SHAREHOLDER2"].ToString();
                                supplier.labour1 = reader["LABOUR1"].ToString();
                                supplier.labour2 = reader["LABOUR2"].ToString();
                                supplier.legalAsset1 = reader["LEGALASSET1"].ToString();
                                supplier.legalAsset2 = reader["LEGALASSET2"].ToString();
                                supplier.environment1 = reader["ENVIRONMENT1"].ToString();
                                supplier.environment2 = reader["ENVIRONMENT2"].ToString();
                                supplier.imiInterested1 = reader["IMIINTERESTED1"].ToString();
                                supplier.imiInterested2 = reader["IMIINTERESTED2"].ToString();
                                supplier.hse1 = reader["HSE1"].ToString();
                                supplier.hse2 = reader["HSE2"].ToString();
                                supplier.docuHse = reader["DOCUHSE"].ToString();
                                supplier.isohealth = reader["ISOHEALTH"].ToString();
                                supplier.envtMgt1 = reader["ENVTMGT1"].ToString();
                                supplier.envtMgt2 = reader["ENVTMGT2"].ToString();
                                supplier.dedicatedpers = reader["DEDICATEDPERS"].ToString();
                                supplier.statistic = reader["STATISTIC"].ToString();
                                supplier.qualityPolicy1 = reader["QUALITYPOLICY1"].ToString();
                                supplier.qualityPolicy2 = reader["QUALITYPOLICY2"].ToString();
                                supplier.qualityMgt = reader["QUALITYMGT"].ToString();
                                supplier.qualityResp1 = reader["QUALITYRESP1"].ToString();
                                supplier.qualityResp2 = reader["QUALITYRESP2"].ToString();
                                supplier.qualityResp3 = reader["QUALITYRESP3"].ToString();
                                supplier.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString();
                                supplier.reg_date = reader["REG_DATE"].ToString();
                                supplier.vat_no = reader["VAT_NO"].ToString();
                                supplier.gosi_certificate = reader["GOSI_CERTIFICATE"].ToString();
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
                                supplier.supplier_code = "";
                                supplier.ifs_code = "";
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
                                supplier.supplier_extra = reader["SUPPLIER_EXTRA"].ToString();
                                supplier.bankCode = reader["BANK_CODE"].ToString();
                                supplier.revisionNo = reader["REVISION_NO"].ToString() != "" ? Convert.ToInt32(reader["REVISION_NO"].ToString()) : 0;
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
                    sql.Close();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> DeleteExistingDraftSupplier(DeleteDraftSupplierDto DeleteDraftSupplier)
        {
            try
            {
                const string spName = "dbo.Isp_SupplierDraft_Delete";

                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierName", DeleteDraftSupplier.supplier_name));
                        cmd.Parameters.Add(new SqlParameter("@SupplierEmail", DeleteDraftSupplier.supplier_email));
                        cmd.Parameters.Add(new SqlParameter("@CR", DeleteDraftSupplier.cr_no));
                        cmd.Parameters.Add(new SqlParameter("@Type", DeleteDraftSupplier.type));
                        sql.Open();
                        cmd.ExecuteNonQuery();
                    }
                    sql.Close();
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<int> TempSavePortalSupplierEditInfo(SupplierDto supplier)
        {
            supplier.bankCode = "";
            supplier.created_date = "";
            supplier.supplier_code = "";
            supplier.ifs_code = "";
            supplier.due_date = "";
            supplier.workflowstatus = "";
            supplier.invitestatus = "";
            supplier.qualityreviewDate = "";
            supplier.qualityName = "";
            supplier.qualityDesig = "";
            supplier.criticality = "";
            supplier.workflow_id = "";
            supplier.process_id = "";
            supplier.draftLimit = "";
            supplier.isSupplierPortalUser = true;

            const string spName = "dbo.Isp_Change_Approval_Save";
            bool isCategoryChange = false;
            bool isBankChange = false;
            bool isGeneralChange = false;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplier_id", supplier.supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@supplier_dto", Newtonsoft.Json.JsonConvert.SerializeObject(supplier)));
                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                    sql.CloseAsync();
                }

                bool contains = Regex.IsMatch(supplier.supplier_extra, @"\b1,\b");

                if (contains || supplier.supplier_extra.Contains(",3,") || supplier.supplier_extra.Contains("%") || supplier.supplier_extra.Contains("^") || supplier.supplier_extra.Contains("&"))
                {
                    isGeneralChange = true;
                }

                if(supplier.supplier_extra.Contains("=") || supplier.supplier_extra.Contains("b1") || supplier.supplier_extra.Contains("b2") || supplier.supplier_extra.Contains("59") || supplier.supplier_extra.Contains("60") || supplier.supplier_extra.Contains("61") || supplier.supplier_extra.Contains("62")
                                     || supplier.supplier_extra.Contains("63") || supplier.supplier_extra.Contains("64") || supplier.supplier_extra.Contains("65") || supplier.supplier_extra.Contains("z") || supplier.supplier_extra.Contains("y"))
                {
                    isBankChange = true;
                }

                if (supplier.supplier_extra.Contains("+"))
                {
                    isCategoryChange = true;
                }

                if (isCategoryChange && isBankChange && isGeneralChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting SRM change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {
                        return 0;
                    }
                }

                if (isCategoryChange && isGeneralChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting SRM change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {  
                        return 0;
                    }
                }

                if (isCategoryChange && isBankChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting GM change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {
                        return 0;
                    }
                }

                if (isGeneralChange  && isBankChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting SRM change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {
                        return 0;
                    }
                }

                if (isCategoryChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting GM change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {
                        return 0;
                    }
                }
                if (isBankChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting Bank Reviewer change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {
                        return 0;
                    }
                }

                if (isGeneralChange)
                {
                    if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting SRM change approval"))
                    {
                        return supplier.supplier_id;
                    }
                    else
                    {
                        return 0;
                    }
                }
                /*if (await UpdateSupplierStatus(supplier.supplier_id, "Awaiting SRM change approval"))
                {
                    return supplier.supplier_id;
                }
                else
                {
                    return 0;
                }*/
                return supplier.supplier_id;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<IList<ChangeApprovalDto>> GetAllChangeApprovalsForRole(string rolename)
        {
            const string spName = "dbo.Isp_Change_Approval_All_Search";

            var approvals = new List<ChangeApprovalDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@role", rolename));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {


                            IList<SupplierBankDto> supplierlist = await AllSuppliers();

                            while (await reader.ReadAsync())
                            {
                                ChangeApprovalDto approval = new ChangeApprovalDto();

                                approval.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                approval.supplierName = reader["supplier_name"].ToString();
                                approval.status = reader["status"].ToString();
                                approval.submittedDate = Convert.ToDateTime(reader["SUBMITTED_DATE"]).ToString("dd-MMM-yyy HH:mm");

                                foreach (SupplierBankDto supplier in supplierlist)
                                {
                                    if (supplier.SupplierID == approval.supplierId && supplier.Status == "Approved")
                                    {
                                        approval.status = supplier.Status;
                                    }

                                }
                                // Fetching previous data
                                SuppliersTabChangeDto suppliersTabChange = await GetSupplierChangesForApproval(approval.supplierId);
                                SupplierDto changedSupplier = JsonConvert.DeserializeObject<SupplierDto>(suppliersTabChange.supplierDto);
                                IList<SupplierDto> supplierPromise = await GetRegisteredSupplierCategory(approval.supplierId.ToString());
                                SupplierDto prevSupplier = supplierPromise[0];
                                // Checking for Category details changes
                                

                                if(changedSupplier.supplierCategories.Length != prevSupplier.supplierCategories.Length){
                                    approval.isCategoryChange = true;
                                }

                                /*
                                 foreach (var catChange in changedSupplier.supplierCategories)
                                {
                                    foreach (var prevCategory in prevSupplier.supplierCategories)
                                    {
                                        if (catChange.generalCategory != prevCategory.generalCategory || catChange.subCategory != prevCategory.subCategory || catChange.detailCategory != prevCategory.detailCategory)
                                        {
                                            approval.isCategoryChange = true;
                                        }
                                    }
                                }
                                 */
                                // Checking for Bank details changes
                                if (prevSupplier.bankName != changedSupplier.bankName || prevSupplier.accountHolderName != changedSupplier.accountHolderName
                                    )
                                {
                                    approval.isBanckChange = true;
                                }
                                /*
                                 if (prevSupplier.bankCode != changedSupplier.bankCode || prevSupplier.bankName != changedSupplier.bankName || prevSupplier.otherBankName != changedSupplier.otherBankName
                                    || prevSupplier.swiftcode != changedSupplier.swiftcode || prevSupplier.accountHolderName != changedSupplier.accountHolderName || prevSupplier.account_number != changedSupplier.account_number
                                    || prevSupplier.bankAddress != changedSupplier.bankAddress || prevSupplier.bankAddress2 != changedSupplier.bankAddress2 || prevSupplier.ibanNo != changedSupplier.ibanNo
                                    || prevSupplier.accountCurrency != changedSupplier.accountCurrency || prevSupplier.multicurrency != changedSupplier.multicurrency
                                    )
                                {
                                    approval.isBanckChange = true;
                                }
                                 */
                                // Checking for General details changes
                                /*if (prevSupplier.accountHolderName != changedSupplier.accountHolderName || prevSupplier.account_number != changedSupplier.account_number ||
                                    prevSupplier.additionalCtrl != changedSupplier.additionalCtrl || prevSupplier.additionalCtrl2 != changedSupplier.additionalCtrl2 || prevSupplier.additionalCtrl3 != changedSupplier.additionalCtrl3 ||
                                    prevSupplier.additionalCtrl4 != changedSupplier.additionalCtrl4 || prevSupplier.additionalCtrl5 != changedSupplier.additionalCtrl5 || prevSupplier.additional_material != changedSupplier.additional_material ||
                                    prevSupplier.address_line1 != changedSupplier.address_line1 || prevSupplier.address_line2 != changedSupplier.address_line2 || prevSupplier.city != changedSupplier.city ||
                                    prevSupplier.compliance1 != changedSupplier.compliance1 || prevSupplier.compliance2 != changedSupplier.compliance2 || prevSupplier.country != changedSupplier.country ||
                                    prevSupplier.cr_exp_date != changedSupplier.cr_exp_date || prevSupplier.cr_no != changedSupplier.cr_no || prevSupplier.criticality != changedSupplier.criticality ||
                                    prevSupplier.currentAsset1 != changedSupplier.currentAsset1 || prevSupplier.currentAsset2 != changedSupplier.currentAsset2 || prevSupplier.dedicatedpers != changedSupplier.dedicatedpers ||
                                    prevSupplier.designnCap != changedSupplier.designnCap || prevSupplier.docuHse != changedSupplier.docuHse || prevSupplier.draftLimit != changedSupplier.draftLimit ||
                                    prevSupplier.due_date != changedSupplier.due_date || prevSupplier.email != changedSupplier.email || prevSupplier.email1 != changedSupplier.email1 ||
                                    prevSupplier.email2 != changedSupplier.email2 || prevSupplier.environment1 != changedSupplier.environment1 || prevSupplier.environment2 != changedSupplier.environment2 ||
                                    prevSupplier.envtMgt1 != changedSupplier.envtMgt1 || prevSupplier.envtMgt2 != changedSupplier.envtMgt2 || prevSupplier.establishment_year != changedSupplier.establishment_year ||
                                    prevSupplier.extension != changedSupplier.extension || prevSupplier.extension1 != changedSupplier.extension1 || prevSupplier.extension2 != changedSupplier.extension2 ||
                                    prevSupplier.fax_country_code != changedSupplier.fax_country_code || prevSupplier.fax_country_code1 != changedSupplier.fax_country_code1 || prevSupplier.fax_country_code2 != changedSupplier.fax_country_code2 ||
                                    prevSupplier.fax_no != changedSupplier.fax_no || prevSupplier.fax_no1 != changedSupplier.fax_no1 || prevSupplier.fax_no2 != changedSupplier.fax_no2 ||
                                    prevSupplier.finishProd != changedSupplier.finishProd || prevSupplier.first_name != changedSupplier.first_name || prevSupplier.first_name1 != changedSupplier.first_name1 ||
                                    prevSupplier.first_name2 != changedSupplier.first_name2 || prevSupplier.gosi_certificate != changedSupplier.gosi_certificate || prevSupplier.gosi_date != changedSupplier.gosi_date ||
                                    prevSupplier.hijriSelected != changedSupplier.hijriSelected || prevSupplier.hse1 != changedSupplier.hse1 || prevSupplier.hse2 != changedSupplier.hse2 ||
                                    prevSupplier.hseDesig != changedSupplier.hseDesig || prevSupplier.hseName != changedSupplier.hseName || prevSupplier.ibanNo != changedSupplier.ibanNo ||
                                    prevSupplier.ifs_code != changedSupplier.ifs_code || prevSupplier.imiInterested1 != changedSupplier.imiInterested1 || prevSupplier.imiInterested2 != changedSupplier.imiInterested2 ||
                                    prevSupplier.internalPolicy != changedSupplier.internalPolicy || prevSupplier.invitestatus != changedSupplier.invitestatus || prevSupplier.isSupplierPortalUser != changedSupplier.isSupplierPortalUser ||
                                    prevSupplier.isohealth != changedSupplier.isohealth || prevSupplier.issued_by != changedSupplier.issued_by || prevSupplier.labour1 != changedSupplier.labour1 ||
                                    prevSupplier.labour2 != changedSupplier.labour2 || prevSupplier.last_name != changedSupplier.last_name || prevSupplier.last_name1 != changedSupplier.last_name1 ||
                                    prevSupplier.last_name2 != changedSupplier.last_name2 || prevSupplier.legalAsset1 != changedSupplier.legalAsset1 || prevSupplier.legalAsset2 != changedSupplier.legalAsset2 ||
                                    prevSupplier.litigation1 != changedSupplier.litigation1 || prevSupplier.litigation2 != changedSupplier.litigation2 || prevSupplier.managerialno != changedSupplier.managerialno ||
                                    prevSupplier.mobile_country_code != changedSupplier.mobile_country_code || prevSupplier.mobile_country_code1 != changedSupplier.mobile_country_code1 || prevSupplier.mobile_country_code2 != changedSupplier.mobile_country_code2 ||
                                    prevSupplier.mobile_no != changedSupplier.mobile_no || prevSupplier.mobile_no1 != changedSupplier.mobile_no1 || prevSupplier.mobile_no2 != changedSupplier.mobile_no2 ||
                                    prevSupplier.multicurrency != changedSupplier.multicurrency || prevSupplier.netIncome1 != changedSupplier.netIncome1 || prevSupplier.netIncome2 != changedSupplier.netIncome2 ||
                                    prevSupplier.noOfYears != changedSupplier.noOfYears || prevSupplier.operatingProfit1 != changedSupplier.operatingProfit1 || prevSupplier.operatingProfit2 != changedSupplier.operatingProfit2 ||
                                    prevSupplier.operationsno != changedSupplier.operationsno || prevSupplier.other_city != changedSupplier.other_city || prevSupplier.ownercompany != changedSupplier.ownercompany ||
                                    prevSupplier.po_box != changedSupplier.po_box || prevSupplier.position != changedSupplier.position || prevSupplier.position1 != changedSupplier.position1 ||
                                    prevSupplier.position2 != changedSupplier.position2 || prevSupplier.postal_code != changedSupplier.postal_code || prevSupplier.process_id != changedSupplier.process_id ||
                                    prevSupplier.qualityDesig != changedSupplier.qualityDesig || prevSupplier.qualityMgt != changedSupplier.qualityMgt || prevSupplier.qualityMgtIso != changedSupplier.qualityMgtIso ||
                                    prevSupplier.qualityName != changedSupplier.qualityName || prevSupplier.qualityPolicy1 != changedSupplier.qualityPolicy1 || prevSupplier.qualityPolicy2 != changedSupplier.qualityPolicy2 ||
                                    prevSupplier.qualityResp1 != changedSupplier.qualityResp1 || prevSupplier.qualityResp2 != changedSupplier.qualityResp2 || prevSupplier.qualityResp3 != changedSupplier.qualityResp3 ||
                                    prevSupplier.qualityreviewDate != changedSupplier.qualityreviewDate || prevSupplier.reg_date != changedSupplier.reg_date || prevSupplier.registeredOrg != changedSupplier.registeredOrg ||
                                    prevSupplier.revisionNo != changedSupplier.revisionNo || prevSupplier.saudiNationalsno != changedSupplier.saudiNationalsno || prevSupplier.saudi_date != changedSupplier.saudi_date ||
                                    prevSupplier.shareholder1 != changedSupplier.shareholder1 || prevSupplier.shareholder2 != changedSupplier.shareholder2 || prevSupplier.sistercompany != changedSupplier.sistercompany ||
                                    prevSupplier.statistic != changedSupplier.statistic || prevSupplier.statisticEnvt != changedSupplier.statisticEnvt || prevSupplier.statisticFatal != changedSupplier.statisticFatal ||
                                    prevSupplier.statisticFirst != changedSupplier.statisticFirst || prevSupplier.statisticLost != changedSupplier.statisticLost || prevSupplier.statisticMedical != changedSupplier.statisticMedical ||
                                    prevSupplier.statisticNear != changedSupplier.statisticNear || prevSupplier.status != changedSupplier.status || prevSupplier.supplierCategories != changedSupplier.supplierCategories ||
                                    prevSupplier.supplier_code != changedSupplier.supplier_code || prevSupplier.supplier_extra != changedSupplier.supplier_extra || prevSupplier.supplier_id != changedSupplier.supplier_id ||
                                    prevSupplier.supplier_name != changedSupplier.supplier_name || prevSupplier.supplier_name_arabic != changedSupplier.supplier_name_arabic || prevSupplier.supplier_type != changedSupplier.supplier_type ||
                                    prevSupplier.suspendedProj1 != changedSupplier.suspendedProj1 || prevSupplier.suspendedProj2 != changedSupplier.suspendedProj2 || prevSupplier.technicalno != changedSupplier.technicalno ||
                                    prevSupplier.telephone_no != changedSupplier.telephone_no || prevSupplier.telephone_no1 != changedSupplier.telephone_no1 || prevSupplier.telephone_no2 != changedSupplier.telephone_no2 ||
                                    prevSupplier.telphone_country_code != changedSupplier.telphone_country_code || prevSupplier.telphone_country_code1 != changedSupplier.telphone_country_code1 || prevSupplier.telphone_country_code2 != changedSupplier.telphone_country_code2 ||
                                    prevSupplier.title != changedSupplier.title || prevSupplier.title1 != changedSupplier.title1 || prevSupplier.title2 != changedSupplier.title2 ||
                                     prevSupplier.totalEquity1 != changedSupplier.totalEquity1 || prevSupplier.totalEquity2 != changedSupplier.totalEquity2 || prevSupplier.totalLiable1 != changedSupplier.totalLiable1 ||
                                      prevSupplier.totalLiable2 != changedSupplier.totalLiable2 || prevSupplier.totallno != changedSupplier.totallno
                                    )*/
                                
                                    if (prevSupplier.supplier_name != changedSupplier.supplier_name || prevSupplier.telephone_no != changedSupplier.telephone_no || prevSupplier.first_name != changedSupplier.first_name || prevSupplier.last_name != changedSupplier.last_name)
                                    {
                                        approval.isGeneralChange = true;
                                }


                                approvals.Add(approval);
                            }

                        }
                    }
                    sql.CloseAsync();
                }
                return approvals;
            }
            catch (Exception ex)
            {
                return approvals;
            }
        }
        public async Task<IList<SupplierDto>> GetRegisteredSupplierCategory(string supplierId)
        {
            IList<SupplierDto> result = await GetRegisteredSupplier(supplierId);
            if (result == null)
            {
                result = await GetRegisteredSupplier(supplierId);
            }

            if (supplierId != null && Convert.ToInt32(supplierId) > 0)
            {
                var categories = await SearchCategory(Convert.ToInt32(supplierId));
                if (categories != null && categories.Count > 0 && result != null)
                {
                    SupplierCategoryDto[] cat = new SupplierCategoryDto[categories.Count];
                    for (int i = 0; i < categories.Count; i++)
                    {
                        cat[i] = categories[i];
                    }

                    result[0].supplierCategories = cat;
                }

            }
            return result;
        }

        public async Task<SuppliersTabChangeDto> GetSupplierChangesForApproval(int supplierId)
        {
            const string spName = "dbo.Isp_Change_Approval_Search";
            SuppliersTabChangeDto changedSupplier = new SuppliersTabChangeDto();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                changedSupplier.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                changedSupplier.submittedDate = Convert.ToDateTime(reader["SUBMITTED_DATE"]).ToString("dd-MMM-yyy HH:mm");
                                changedSupplier.supplierDto = reader["SUPPLIER_DTO"].ToString();
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return changedSupplier;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> DeleteSupplierChangesApproval(int supplierId)
        {
            const string spName = "dbo.Isp_Change_Approval_Delete";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId));
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

        public async Task<int> SaveReviewForm(ReviewFormDto reviewForm)
        {
            const string spName = "dbo.Isp_Review_Form_Save";
            int result = 0;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", reviewForm.Id));
                        cmd.Parameters.Add(new SqlParameter("@name", reviewForm.name));
                        cmd.Parameters.Add(new SqlParameter("@form", reviewForm.form));
                        cmd.Parameters.Add(new SqlParameter("@title", reviewForm.title));
                        cmd.Parameters.Add(new SqlParameter("@subtitle", reviewForm.subtitle));
                        cmd.Parameters.Add(new SqlParameter("@status", reviewForm.status));
                        cmd.Parameters.Add(new SqlParameter("@logo", reviewForm.logo));
                        cmd.Parameters.Add(new SqlParameter("@banner", reviewForm.banner));
                        cmd.Parameters.Add(new SqlParameter("@created_user", reviewForm.createdUser));
                        cmd.Parameters.Add(new SqlParameter("@created_user_role", reviewForm.createdUserRole));
                        cmd.Parameters.Add(new SqlParameter("@form_type", reviewForm.formType));
                        cmd.Parameters.Add(new SqlParameter("@is_active", reviewForm.isActive));
                        cmd.Parameters.Add(new SqlParameter("@no_of_apporvers", reviewForm.NumberOfApprovelsRequired));
                        cmd.Parameters.Add(new SqlParameter("@approver_refs", reviewForm.ApprovelsReferences));

                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", reviewForm.Id));
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        result = Convert.ToInt32(returnParameter.Value);
                    }
                    await sql.CloseAsync();
                }
                return result;
            }
            catch(Exception ex)
            {
                return 0;
            }
        }

        public async Task<IList<ReviewFormDto>> GetAllReviewForms()
        {
            const string spName = "dbo.Isp_Review_Form_All";

            var reviews = new List<ReviewFormDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure; ;
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewFormDto review = new ReviewFormDto();

                                review.Id = Convert.ToInt32(reader["ID"].ToString());
                                review.name = reader["NAME"].ToString();
                                review.form = reader["FORM"].ToString();
                                review.title = reader["TITLE"].ToString();
                                review.subtitle = reader["SUBTITLE"].ToString();
                                review.status = reader["STATUS"].ToString();
                                review.createdUser = reader["CREATED_USER"].ToString();
                                review.createdUserRole = reader["CREATED_USER_ROLE"].ToString();
                                review.submittedDate = Convert.ToDateTime(reader["SUBMITTED_DATE"]).ToString("dd-MMM-yyy HH:mm");
                                review.formType = reader["FORM_TYPE"].ToString();
                                review.isActive = Convert.ToInt32(reader["IS_ACTIVE"].ToString());
                                review.logo = reader["LOGO"].ToString();
                                review.banner = reader["BANNER"].ToString();
                                reviews.Add(review);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviews;
            }
            catch (Exception ex)
            {
                return reviews;
            }
        }

        public async Task<ReviewFormDto> GetReviewForm(int id)
        {
            const string spName = "dbo.Isp_Review_Form_Search";
            ReviewFormDto review = new ReviewFormDto();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", id));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                review.Id = Convert.ToInt32(reader["ID"].ToString());
                                review.name = reader["NAME"].ToString();
                                review.form = reader["FORM"].ToString();
                                review.title = reader["TITLE"].ToString();
                                review.subtitle = reader["SUBTITLE"].ToString();
                                review.status = reader["STATUS"].ToString();
                                review.logo = reader["LOGO"].ToString();
                                review.banner = reader["BANNER"].ToString();
                                review.createdUser = reader["CREATED_USER"].ToString();
                                review.createdUserRole = reader["CREATED_USER_ROLE"].ToString();
                                review.submittedDate = Convert.ToDateTime(reader["SUBMITTED_DATE"]).ToString("dd-MMM-yyy HH:mm");
                                 review.formType = reader["FORM_TYPE"].ToString();
                                review.isActive = Convert.ToInt32(reader["IS_ACTIVE"].ToString());


                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return review;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<ReviewResponseDto>> GetAllReviewResponses(string loggedInUser)
        {
            const string spName = "dbo.Isp_Review_Response_All_Search";
            var reviews = new List<ReviewResponseDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@LoggedInUser", loggedInUser));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewResponseDto review = new ReviewResponseDto();
                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.reviewSessionId = Convert.ToInt32(reader["REVIEW_SESSION_ID"].ToString());
                                review.status = reader["STATUS"].ToString();
                                review.review = reader["REVIEW"].ToString();
                                review.evaluationName = reader["EVALUATION_NAME"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                review.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                review.conductedUser = reader["CONDUCTED_USER"].ToString();
                                review.score = Convert.ToDouble(reader["SCORE"].ToString());
                                review.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                review.supplierName = reader["SUPPLIER_NAME"].ToString();
                                review.supplierName = reader["SUPPLIER_NAME"].ToString();
                                review.createdUser = reader["CREATED_USER"].ToString();
                                review.startDate = reader["STARTDATE"].ToString();
                                review.endDate = reader["ENDDATE"].ToString();
                                review.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                review.periodType = reader["PERIOD_TYPE"].ToString();
                                review.reviewYear = reader["REVIEW_YEAR"]?.ToString();
                                review.banner = reader["BANNER"]?.ToString();
                                review.logo = reader["LOGO"]?.ToString();
                                if (reader["APPROVAL_INITIATION_DATE"].ToString() != "")
                                {
                                    review.approvalInitiationDate = Convert.ToDateTime(reader["APPROVAL_INITIATION_DATE"]).ToString("dd/MM/yy");
                                }
                                reviews.Add(review);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviews;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ReviewResponseDto> GetReviewResponse(int reviewResponseId)
        {
            const string spName = "dbo.Isp_Review_Response_Search";
            ReviewResponseDto review = new ReviewResponseDto();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ReviewResponseId", reviewResponseId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.formId = Convert.ToInt32(reader["FORM_ID"].ToString());
                                review.reviewSessionId = Convert.ToInt32(reader["REVIEW_SESSION_ID"].ToString());
                                review.status = reader["STATUS"].ToString();
                                review.review = reader["REVIEW"].ToString();
                                review.evaluationName = reader["EVALUATION_NAME"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                review.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                review.conductedUser = reader["CONDUCTED_USER"].ToString();
                                review.title = reader["TITLE"].ToString();
                                review.subtitle = reader["SUBTITLE"].ToString();
                                review.score = Convert.ToDouble(reader["SCORE"].ToString());
                                review.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                review.supplierName = reader["SUPPLIER_NAME"].ToString();
                                review.startDate = reader["STARTDATE"].ToString();
                                review.endDate = reader["ENDDATE"].ToString();
                                review.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                review.periodType = reader["PERIOD_TYPE"].ToString();
                                review.reviewYear = reader["REVIEW_YEAR"].ToString();
                                review.createdUser = reader["CREATED_USER"].ToString();
                                review.logo = reader["LOGO"].ToString();
                                review.banner = reader["BANNER"].ToString();
                                review.finalScore = Convert.ToDouble(reader["FINAL_SCORE"].ToString());
                                review.createdEmail = reader["EMAILADDRESS"].ToString();
                                review.outcome = reader["OUTCOME"].ToString();
                                review.supplierEmail = reader["EMAIL"].ToString();
                                review.supervisorName = reader["SUPERVISORNAME"].ToString();
                                review.supervisorEmail = reader["SUPERVISOREMAIL"].ToString();
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return review;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<ReviewResponseDto> GetReviewResponseBySessionAndUser(int reviewSessionId, string conductedUserId, int supplierId)
        {
            const string spName = "dbo.Isp_Review_Response_Search_By_Session_And_User";
            ReviewResponseDto review = new ReviewResponseDto();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ReviewSessionId", reviewSessionId));
                        cmd.Parameters.Add(new SqlParameter("@ConductedUserId", conductedUserId));
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.formId = Convert.ToInt32(reader["FORM_ID"].ToString());
                                review.reviewSessionId = Convert.ToInt32(reader["REVIEW_SESSION_ID"].ToString());
                                review.status = reader["STATUS"].ToString();
                                review.review = reader["REVIEW"].ToString();
                                review.evaluationName = reader["EVALUATION_NAME"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                review.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                review.conductedUser = reader["CONDUCTED_USER"].ToString();
                                review.score = Convert.ToDouble(reader["SCORE"].ToString());
                                review.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                review.supplierName = reader["SUPPLIER_NAME"].ToString();
                                review.startDate = reader["STARTDATE"].ToString();
                                review.endDate = reader["ENDDATE"].ToString();
                                review.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                review.periodType = reader["PERIOD_TYPE"].ToString();
                                review.reviewYear = reader["REVIEW_YEAR"].ToString();
                                review.createdUser = reader["CREATED_USER"].ToString();
                                review.title = reader["TITLE"].ToString();
                                review.subtitle = reader["SUBTITLE"].ToString();
                                review.logo = reader["LOGO"].ToString();
                                review.banner = reader["BANNER"].ToString();
                                review.createdEmail = reader["EMAILADDRESS"].ToString();
                                if (reader["APPROVAL_INITIATION_DATE"].ToString() != "")
                                {
                                    review.approvalInitiationDate = Convert.ToDateTime(reader["APPROVAL_INITIATION_DATE"]).ToString("dd/MM/yy");
                                }
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return review;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<List<ReviewResponseDto>> GetSessionReviewResponseScores(int reviewSessionId, int supplierId)
        {
            const string spName = "dbo.Isp_Review_Response_Scores_By_Session";
            var reviews = new List<ReviewResponseDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ReviewSessionId", reviewSessionId));
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@rejectedStatus", "rejected"));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewResponseDto review = new ReviewResponseDto();
                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.reviewSessionId = Convert.ToInt32(reader["REVIEW_SESSION_ID"].ToString());
                                review.conductedUser = reader["CONDUCTED_USER"].ToString();
                                review.score = Convert.ToDouble(reader["SCORE"].ToString());
                                review.review = reader["REVIEW"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");

                                reviews.Add(review);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviews;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<int> SaveReviewResponse(ReviewResponseDto reviewResponse)
        {
            try
            {
                var result = 0;
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    string spName = "dbo.Isp_Review_Response_Save";
                    

                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", reviewResponse.id));
                        cmd.Parameters.Add(new SqlParameter("@reviewSessionId", reviewResponse.reviewSessionId));
                        cmd.Parameters.Add(new SqlParameter("@conductedUser", reviewResponse.conductedUser));
                        cmd.Parameters.Add(new SqlParameter("@review", reviewResponse.review));
                        cmd.Parameters.Add(new SqlParameter("@status", reviewResponse.status));
                        cmd.Parameters.Add(new SqlParameter("@score", reviewResponse.score));
                        cmd.Parameters.Add(new SqlParameter("@supplierId", reviewResponse.supplierId));
                        cmd.Parameters.Add(new SqlParameter("@waitingStatus", "waiting for review"));
                        cmd.Parameters.Add(new SqlParameter("@approvalReadyStatus", "ready for approval"));
                        cmd.Parameters.Add(new SqlParameter("@approvalWaitingStatus", "waiting for approval"));
                        cmd.Parameters.Add(new SqlParameter("@completedStatus", "completed"));
                        cmd.Parameters.Add(new SqlParameter("@approval_initiation_date", reviewResponse.approvalInitiationDate));
                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", reviewResponse.id));
                        returnParameter.Direction = ParameterDirection.ReturnValue;

                        await sql.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                        result = Convert.ToInt32(returnParameter.Value);
                    }
                    sql.CloseAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }
        public async Task<bool> SaveReviewOutcome(ReviewOutcomeDto reviewOutcome)
        {
            const string spName = "dbo.Isp_Review_Outcome_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", reviewOutcome.id));
                        cmd.Parameters.Add(new SqlParameter("@sessionId", reviewOutcome.sessionId));
                        cmd.Parameters.Add(new SqlParameter("@supplierId", reviewOutcome.supplierId));
                        cmd.Parameters.Add(new SqlParameter("@outcome", reviewOutcome.outcome));
                        cmd.Parameters.Add(new SqlParameter("@status", reviewOutcome.status));
                        cmd.Parameters.Add(new SqlParameter("@finalScore", reviewOutcome.finalScore));

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
        public async Task<bool> BlockSupplierByReviewOutcome(int supplierId)
        {
            const string spName = "dbo.Isp_Review_Outcome_Block_Supplier";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId));

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
        public async Task<List<ReviewOutcomeDto>> GetReviewOutcomeBySupplier(int sessionId, int supplierId)
        {
            const string spName = "dbo.Isp_Review_Outcome_Search_By_Supplier";
            var outcomes = new List<ReviewOutcomeDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@sessionId", sessionId));
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewOutcomeDto outcome = new ReviewOutcomeDto();
                                outcome.id = Convert.ToInt32(reader["ID"].ToString());
                                outcome.sessionId = Convert.ToInt32(reader["SESSION_ID"].ToString());
                                outcome.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                outcome.outcome = reader["OUTCOME"].ToString();
                                outcome.status = reader["STATUS"].ToString();
                                outcome.evaluationName = reader["EVALUATION_NAME"].ToString();
                                outcome.startDate = Convert.ToDateTime(reader["STARTDATE"]).ToString("yyyy-MM-dd"); ;
                                outcome.endDate = Convert.ToDateTime(reader["ENDDATE"]).ToString("yyyy-MM-dd");
                                outcome.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                outcome.periodType = reader["PERIOD_TYPE"].ToString();
                                outcome.reviewYear = reader["REVIEW_YEAR"].ToString();
                                outcome.createdUser = reader["CREATED_USER"].ToString();
                                outcome.createdDate = reader["CREATED_DATE"].ToString();
                                outcome.supplierName = reader["SUPPLIER_NAME"].ToString();
                                outcome.gradeCategories = reader["GRADE_CATEGORIES"].ToString();
                                outcome.gradingMethod = reader["GRADING_METHOD"].ToString();
                                outcome.reviewerWeights = reader["REVIEWER_WEIGHTS"].ToString();
                                outcome.supplierEmail = reader["EMAIL"].ToString();
                                outcome.finalScore = Convert.ToDouble(reader["FINAL_SCORE"].ToString());
                                outcomes.Add(outcome);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return outcomes;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<List<ReviewOutcomeDto>> GetReviewOutcomes(string loggedInUser)
        {
            const string spName = "dbo.Isp_Review_Outcome_Search";
            var outcomes = new List<ReviewOutcomeDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@LoggedInUser", loggedInUser));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewOutcomeDto outcome = new ReviewOutcomeDto();
                                outcome.id = Convert.ToInt32(reader["ID"].ToString());
                                outcome.sessionId = Convert.ToInt32(reader["SESSION_ID"].ToString());
                                outcome.supplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                outcome.outcome = reader["OUTCOME"].ToString();
                                outcome.gradeCategories = reader["GRADE_CATEGORIES"].ToString();
                                outcome.gradingMethod = reader["GRADING_METHOD"].ToString();
                                outcome.reviewerWeights = reader["REVIEWER_WEIGHTS"].ToString();
                                outcome.minGradeThreshold = Convert.ToInt32(reader["MIN_GRADE_THRESHOLD"].ToString());
                                outcome.supplierName = reader["SUPPLIER_NAME"].ToString();
                                outcome.evaluationName = reader["EVALUATION_NAME"].ToString();
                                outcome.status = reader["STATUS"].ToString();
                                outcome.startDate = Convert.ToDateTime(reader["STARTDATE"]).ToString("yyyy-MM-dd");
                                outcome.endDate = Convert.ToDateTime(reader["ENDDATE"]).ToString("yyyy-MM-dd");
                                outcome.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                outcome.periodType = reader["PERIOD_TYPE"].ToString();
                                outcome.reviewYear = reader["REVIEW_YEAR"].ToString();
                                outcome.createdUser = reader["CREATED_USER"].ToString();
                                outcome.createdDate = reader["CREATED_DATE"].ToString();
                                outcome.modifiedDate = reader["MODIFIED_DATE"].ToString();
                                outcome.supplierType = reader["SUPPLIER_TYPE"].ToString();
                                outcome.supplierStatus = reader["SUPPLIER_STATUS"].ToString();
                                outcome.supplierEmail = reader["EMAIL"].ToString();
                                outcome.supplierCode = reader["IFS_CODE"].ToString();
                                outcome.assignedUsers = reader["ASSIGNED_USERS"].ToString();
                                outcome.scheduled = reader["SCHEDULED"].ToString();
                                outcome.services = reader["SERVICES"].ToString();
                                outcome.frequency = reader["FREQUENCY"].ToString();
                                outcome.finalScore = Convert.ToDouble(reader["FINAL_SCORE"].ToString());



                                outcomes.Add(outcome);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return outcomes;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<IList<ReviewSessionDto>> GetAllReviewSessions()
        {
            const string spName = "dbo.Isp_Review_Session_All_Search";
            var reviews = new List<ReviewSessionDto>();
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
                                ReviewSessionDto review = new ReviewSessionDto();
                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.formId = Convert.ToInt32(reader["FORM_ID"].ToString());
                                review.suppliers = reader["SUPPLIERS"].ToString();
                                review.evaluationName = reader["EVALUATION_NAME"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                review.startDate = reader["STARTDATE"].ToString();
                                review.endDate = reader["ENDDATE"].ToString();
                                review.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                review.periodType = reader["PERIOD_TYPE"].ToString();
                                review.reviewYear = reader["REVIEW_YEAR"].ToString();
                                review.assignedUsers = reader["ASSIGNED_USERS"].ToString();
                                review.assignedUserRoles = reader["ASSIGNED_USER_ROLES"].ToString();
                                review.assignType = reader["ASSIGN_TYPE"].ToString();
                                review.gradeCategories = reader["GRADE_CATEGORIES"].ToString();
                                review.gradingMethod = reader["GRADING_METHOD"].ToString();
                                review.reviewerWeights = reader["REVIEWER_WEIGHTS"].ToString();
                                review.minGradeThreshold = Convert.ToInt32(reader["MIN_GRADE_THRESHOLD"].ToString());
                                review.status = reader["STATUS"].ToString();
                                review.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                review.createdUser = reader["CREATED_USER"].ToString();
                               // review.materials = Convert.ToInt32(reader["MATERIALS"].ToString());
                                review.services = reader["SERVICES"].ToString();
                                review.supplierBlocker = Convert.ToInt32(reader["SUPPLIER_BLOCKER"].ToString());
                                review.scored = Convert.ToInt32(reader["SCORED"].ToString());
                                reviews.Add(review);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviews;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ReviewSessionDto> GetReviewSession(int reviewSessionId)
        {
            const string spName = "dbo.Isp_Review_Session_Search";
            ReviewSessionDto review = new ReviewSessionDto();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ReviewSessionId", reviewSessionId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.formId = Convert.ToInt32(reader["FORM_ID"].ToString());
                                review.suppliers = reader["SUPPLIERS"].ToString();
                                review.evaluationName = reader["EVALUATION_NAME"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                review.startDate = reader["STARTDATE"].ToString();
                                review.endDate = reader["ENDDATE"].ToString();
                                review.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                review.periodType = reader["PERIOD_TYPE"].ToString();
                                review.reviewYear = reader["REVIEW_YEAR"].ToString();
                                review.gradeCategories = reader["GRADE_CATEGORIES"].ToString();
                                review.gradingMethod = reader["GRADING_METHOD"].ToString();
                                review.reviewerWeights = reader["REVIEWER_WEIGHTS"].ToString();
                                review.assignedUsers = reader["ASSIGNED_USERS"].ToString();
                                review.assignedUserRoles = reader["ASSIGNED_USER_ROLES"].ToString();
                                review.assignType = reader["ASSIGN_TYPE"].ToString();
                                review.minGradeThreshold = Convert.ToInt32(reader["MIN_GRADE_THRESHOLD"].ToString());
                                review.status = reader["STATUS"].ToString();
                                review.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                review.supplierBlocker = Convert.ToInt32(reader["SUPPLIER_BLOCKER"].ToString());
                                //review.materials = Convert.ToInt32(reader["MATERIALS"].ToString());
                                review.services = reader["SERVICES"].ToString();
                                review.createdUser = reader["CREATED_USER"].ToString();
                                review.scored = Convert.ToInt32(reader["SCORED"].ToString());
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return review;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<ReviewSessionDto>> GetReviewSessionsByUser(string loggedInUser)
        {
            const string spName = "dbo.Isp_Review_Session_Search_By_User";
            var reviews = new List<ReviewSessionDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@LoggedInUser", loggedInUser));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewSessionDto review = new ReviewSessionDto();
                                review.id = Convert.ToInt32(reader["ID"].ToString());
                                review.formId = Convert.ToInt32(reader["FORM_ID"].ToString());
                                review.suppliers = reader["SUPPLIERS"].ToString();
                                review.evaluationName = reader["EVALUATION_NAME"].ToString();
                                review.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                review.startDate = Convert.ToDateTime(reader["STARTDATE"]).ToString("yyyy-MM-dd");
                                review.endDate = Convert.ToDateTime(reader["ENDDATE"]).ToString("yyyy-MM-dd");
                                review.presetPeriod = reader["PRESET_PERIOD"].ToString();
                                review.periodType = reader["PERIOD_TYPE"].ToString();
                                review.reviewYear = reader["REVIEW_YEAR"].ToString();
                                review.gradeCategories = reader["GRADE_CATEGORIES"].ToString();
                                review.gradingMethod = reader["GRADING_METHOD"].ToString();
                                review.reviewerWeights = reader["REVIEWER_WEIGHTS"].ToString();
                                review.assignedUsers = reader["ASSIGNED_USERS"].ToString();
                                review.assignedUserRoles = reader["ASSIGNED_USER_ROLES"].ToString();
                                review.assignType = reader["ASSIGN_TYPE"].ToString();
                                review.minGradeThreshold = Convert.ToInt32(reader["MIN_GRADE_THRESHOLD"].ToString());
                                review.status = reader["STATUS"].ToString();
                                review.supplierBlocker = Convert.ToInt32(reader["SUPPLIER_BLOCKER"].ToString());
                                review.scheduled = Convert.ToInt32(reader["SCHEDULED"].ToString());
                                review.frequency = reader["FREQUENCY"].ToString();
                                review.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                review.createdUser = reader["CREATED_USER"].ToString();
                                //review.materials = Convert.ToInt32(reader["MATERIALS"].ToString());
                                review.services = reader["SERVICES"].ToString();
                                review.scored = Convert.ToInt32(reader["SCORED"].ToString());
                                reviews.Add(review);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviews;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveReviewSession(ReviewSessionDto reviewSession)
        {
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    const string spName = "dbo.Isp_Review_Session_Save";
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", reviewSession.id));
                        cmd.Parameters.Add(new SqlParameter("@formId", reviewSession.formId));
                        cmd.Parameters.Add(new SqlParameter("@suppliers", reviewSession.suppliers));
                        cmd.Parameters.Add(new SqlParameter("@status", reviewSession.status));
                        cmd.Parameters.Add(new SqlParameter("@gradingMethod", reviewSession.gradingMethod));
                        cmd.Parameters.Add(new SqlParameter("@gradeCategories", reviewSession.gradeCategories));
                        cmd.Parameters.Add(new SqlParameter("@reviewerWeights", reviewSession.reviewerWeights));
                        cmd.Parameters.Add(new SqlParameter("@assignedUsers", reviewSession.assignedUsers));
                        cmd.Parameters.Add(new SqlParameter("@startDate", DateTime.Parse(reviewSession.startDate)));
                        cmd.Parameters.Add(new SqlParameter("@endDate", DateTime.Parse(reviewSession.endDate)));
                        cmd.Parameters.Add(new SqlParameter("@presetPeriod", reviewSession.presetPeriod));
                        cmd.Parameters.Add(new SqlParameter("@periodType", reviewSession.periodType));
                        cmd.Parameters.Add(new SqlParameter("@reviewYear", reviewSession.reviewYear));
                        cmd.Parameters.Add(new SqlParameter("@minGradeThreshold", reviewSession.minGradeThreshold));
                        cmd.Parameters.Add(new SqlParameter("@evaluationName", reviewSession.evaluationName));
                        cmd.Parameters.Add(new SqlParameter("@assignedUserRoles", reviewSession.assignedUserRoles));
                        cmd.Parameters.Add(new SqlParameter("@assignType", reviewSession.assignType));
                        cmd.Parameters.Add(new SqlParameter("@supplierBlocker", reviewSession.supplierBlocker));
                        cmd.Parameters.Add(new SqlParameter("@createdUser", reviewSession.createdUser));
                        cmd.Parameters.Add(new SqlParameter("@frequency", reviewSession.frequency));
                        cmd.Parameters.Add(new SqlParameter("@scheduled", reviewSession.scheduled));
                        //cmd.Parameters.Add(new SqlParameter("@materials", reviewSession.materials));
                        cmd.Parameters.Add(new SqlParameter("@services", reviewSession.services));
                        cmd.Parameters.Add(new SqlParameter("@scored", reviewSession.scored));
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

        public async Task<List<ReviewApproverDto>> GetReviewApproversByResponse(int reviewResponseId)
        {
            const string spName = "dbo.Isp_Review_Approver_By_Response";
            var approvers = new List<ReviewApproverDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@reviewResponseId", reviewResponseId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewApproverDto approver = new ReviewApproverDto();
                                approver.id = Convert.ToInt32(reader["ID"].ToString());
                                approver.outcomeId = Convert.ToInt32(reader["OUTCOME_ID"].ToString());
                                approver.reviewResponseId = Convert.ToInt32(reader["REVIEW_RESPONSE_ID"].ToString());
                                approver.approverId = Convert.ToInt32(reader["APPROVER_ID"].ToString());
                                approver.createdDate = reader["CREATED_DATE"].ToString();
                                approver.modifiedDate = reader["MODIFIED_DATE"].ToString();
                                approver.approverName = reader["APPROVER_NAME"].ToString();
                                approver.status = reader["STATUS"].ToString();
                                approver.email = reader["EMAIL"].ToString();
                                approver.stepNo = Convert.ToInt32(reader["STEP_NO"].ToString());
                                approver.comments = reader["COMMENTS"].ToString();
                                approver.type = reader["TYPE"].ToString();
                                approver.role = reader["ROLE"].ToString();
                                approver.conductedUser = reader["CONDUCTED_USER"].ToString();
                                approvers.Add(approver);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return approvers;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<bool> SaveReviewApprover(ReviewApproverDto reviewApprover)
        {
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    const string spName = "dbo.Isp_Review_Approver_Save";
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", reviewApprover.id));
                        cmd.Parameters.Add(new SqlParameter("@status", reviewApprover.status));
                        cmd.Parameters.Add(new SqlParameter("@comments", reviewApprover.comments));
                        cmd.Parameters.Add(new SqlParameter("@approverId", reviewApprover.approverId));
                        cmd.Parameters.Add(new SqlParameter("@approverName", reviewApprover.approverName));
                        cmd.Parameters.Add(new SqlParameter("@reviewResponseId", reviewApprover.reviewResponseId));
                        cmd.Parameters.Add(new SqlParameter("@stepNo", reviewApprover.stepNo));
                        cmd.Parameters.Add(new SqlParameter("@email", reviewApprover.email));
                        cmd.Parameters.Add(new SqlParameter("@type", reviewApprover.type));
                        cmd.Parameters.Add(new SqlParameter("@role", reviewApprover.role));
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

        public async Task<bool> SaveReviewTodo(ReviewTodoDto reviewTodo)
        {
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    const string spName = "dbo.Isp_Review_Todo_Save";
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", reviewTodo.id));
                        cmd.Parameters.Add(new SqlParameter("@status", reviewTodo.status));
                        cmd.Parameters.Add(new SqlParameter("@actionType", reviewTodo.actionType));
                        cmd.Parameters.Add(new SqlParameter("@actionTakerUsername", reviewTodo.actionTakerUsername));
                        cmd.Parameters.Add(new SqlParameter("@reviewResponseId", reviewTodo.reviewResponseId));
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

        public async Task<IList<ReviewTodoDto>> GetReviewTodosByUser(string loggedInUser)
        {
            const string spName = "dbo.Isp_Review_Todo_Search_By_User";
            var reviewTodos = new List<ReviewTodoDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@LoggedInUser", loggedInUser));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewTodoDto reviewTodo = new ReviewTodoDto();
                                reviewTodo.id = Convert.ToInt32(reader["ID"].ToString());
                                reviewTodo.status = reader["STATUS"].ToString();
                                reviewTodo.actionTakerUsername = reader["ACTION_TAKER_USERNAME"].ToString();
                                reviewTodo.actionType = reader["ACTION_TYPE"].ToString();
                                reviewTodo.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                reviewTodo.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                reviewTodo.reviewResponseId = Convert.ToInt32((reader["REVIEW_RESPONSE_ID"]).ToString());
                                reviewTodo.evaluationName = reader["EVALUATION_NAME"].ToString();
                                reviewTodo.supplierName = reader["SUPPLIER_NAME"].ToString();
                                reviewTodo.services = reader["SERVICES"].ToString();
                                reviewTodos.Add(reviewTodo);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviewTodos;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<IList<ReviewTodoDto>> GetReviewTodosByReviewResponse(int reviewResponseId)
        {
            const string spName = "dbo.Isp_Review_Todo_Search_By_Review_Response";
            var reviewTodos = new List<ReviewTodoDto>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ReviewResponseId", reviewResponseId));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                ReviewTodoDto reviewTodo = new ReviewTodoDto();
                                reviewTodo.id = Convert.ToInt32(reader["ID"].ToString());
                                reviewTodo.status = reader["STATUS"].ToString();
                                reviewTodo.actionTakerUsername = reader["ACTION_TAKER_USERNAME"].ToString();
                                reviewTodo.actionType = reader["ACTION_TYPE"].ToString();
                                reviewTodo.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                reviewTodo.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                reviewTodo.reviewResponseId = Convert.ToInt32((reader["REVIEW_RESPONSE_ID"]).ToString());
                                reviewTodos.Add(reviewTodo);
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviewTodos;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<ReviewerSupervisorDto> GetReviewerSupervisor(string reviewerName)
        {
            const string spName = "dbo.Isp_ReviewSupervisor_Search";
            ReviewerSupervisorDto reviewerSupervisor = new ReviewerSupervisorDto();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@ReviewerName", reviewerName));
                        cmd.CommandTimeout = 0;
                        sql.OpenAsync();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                reviewerSupervisor.supervisorName = reader["SUPERVISOR_NAME"].ToString();
                                reviewerSupervisor.supervisorEmail = reader["EMAILADDRESS"].ToString();
                               
                            }
                        }
                    }
                    sql.CloseAsync();
                }
                return reviewerSupervisor;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public async Task<IList<SupplierBankDto>> AllApprovedSuppliers()
        {
            const string spName = "dbo.Isp_AllApprovedSupplier_Search";
            var supplierlist = new List<SupplierBankDto>();

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
                                SupplierBankDto supplierBank = new SupplierBankDto();

                                supplierBank.SupplierID = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                supplierBank.SupplierCode = reader["SUPPLIER_CODE"].ToString();
                                supplierBank.SupplierName = reader["SUPPLIER_NAME"].ToString();
                                supplierBank.SupplierNameArabic = reader["SUPPLIER_NAME_ARABIC"].ToString();
                                supplierBank.EstablishmentYear = Convert.ToInt32(reader["ESTABLISHMENT_YEAR"].ToString());
                                supplierBank.IssuedBy = reader["ISSUED_BY"].ToString();
                                supplierBank.Website = reader["WEB_SITE"].ToString();
                                supplierBank.SupplierType = reader["SUPPLIER_TYPE"].ToString();

                                supplierBank.Country = reader["COUNTRY"].ToString();
                                supplierBank.City = reader["CITY"].ToString();
                                supplierBank.OtherCity = reader["OTHER_CITY"].ToString();
                                supplierBank.PoBox = reader["PO_BOX"].ToString();
                                supplierBank.PostalCode = reader["POSTAL_CODE"].ToString();
                                supplierBank.AddressLine1 = reader["ADDRESS_LINE1"].ToString();
                                supplierBank.AddressLine2 = reader["ADDRESS_LINE2"].ToString();

                                supplierBank.Title = reader["TITLE"].ToString();
                                supplierBank.FirstName = reader["FIRST_NAME"].ToString();
                                supplierBank.LastName = reader["LAST_NAME"].ToString();
                                supplierBank.CurrentPosition = reader["POSITION"].ToString();
                                supplierBank.TelphoneCountryCode = reader["TELPHONE_COUNTRY_CODE"].ToString();
                                supplierBank.TelephoneNo = reader["TELEPHONE_NO"].ToString();
                                supplierBank.Extension = Convert.ToInt32(reader["EXTENSION"].ToString());
                                supplierBank.Email = reader["EMAIL"].ToString();
                                supplierBank.MobileCountryCode = reader["MOBILE_COUNTRY_CODE"].ToString();
                                supplierBank.MobileNo = reader["MOBILE_NO"].ToString();
                                supplierBank.FaxCountryCode = reader["FAX_COUNTRY_CODE"].ToString();
                                supplierBank.FaxNo = reader["FAX_NO"].ToString();
                                supplierBank.HijriSelected = reader["HIJRI_SELECTED"].ToString();

                                supplierBank.CRNo = reader["CR_NO"].ToString();
                                supplierBank.CRexpDate = reader["CR_EXP_DATE"].ToString();
                                supplierBank.RegDate = reader["REG_DATE"].ToString();
                                supplierBank.VatNo = reader["VAT_NO"].ToString();
                                supplierBank.GosiCertificate = reader["GOSI_CERTIFICATE"].ToString();
                                supplierBank.GosiDate = reader["GOSI_DATE"].ToString();
                                supplierBank.SaudiDate = reader["SAUDI_DATE"].ToString();
                                supplierBank.ZakathDate = reader["ZAKATH_DATE"].ToString();
                                supplierBank.AdditionalMaterial = reader["ADDITIONAL_MATERIAL"].ToString();
                                //supplierBank.WaselAddress = reader["WASAL_ADDRESS"].ToString();

                                // Profile
                                supplierBank.TypeOfOrg = reader["TYPE_OF_ORG"].ToString();
                                supplierBank.ManagerialCount = Convert.ToInt32(reader["NO_OF_MANAGER"].ToString());
                                supplierBank.OperationsCount = Convert.ToInt32(reader["NO_OF_OPERATION"].ToString());
                                supplierBank.SaudiNationalsCount = Convert.ToInt32(reader["NO_OF_SAUDI"].ToString());
                                supplierBank.TechnicalCount = Convert.ToInt32(reader["NO_OF_TECHNICAL"].ToString());
                                supplierBank.TotalCount = Convert.ToInt32(reader["NO_OF_TOTAL"].ToString());
                                supplierBank.ParentCompany = reader["PARENT_COMPANY_INFO"].ToString();
                                supplierBank.SisterCompany = reader["SISTERCOMPANY"].ToString();
                                supplierBank.OwnerCompany = reader["OWNER_INFO"].ToString();

                                supplierBank.OperatingProfit1 = Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString());
                                supplierBank.OperatingProfit2 = reader["OPERATINGPROFIT2"].ToString();
                                supplierBank.NetIncome1 = Convert.ToInt32(reader["NETINCOME1"].ToString());
                                supplierBank.NetIncome2 = reader["NETINCOME2"].ToString();
                                supplierBank.CurrentAsset1 = Convert.ToInt32(reader["CURRENTASSET1"].ToString());
                                supplierBank.CurrentAsset2 = reader["CURRENTASSET2"].ToString();
                                supplierBank.TotalLiable1 = Convert.ToInt32(reader["TOTALLIABLE1"].ToString());
                                supplierBank.TotalLiable2 = reader["TOTALLIABLE2"].ToString();
                                supplierBank.TotalEquity1 = Convert.ToInt32(reader["TOTALEQUITY1"].ToString());
                                supplierBank.TotalEquity2 = reader["TOTALEQUITY2"].ToString();

                                supplierBank.NoOfYears = Convert.ToInt32(reader["NOOFYEARS"].ToString());
                                supplierBank.OwnsPlantEquip = reader["OWNSPLANTEQUIP"].ToString();
                                supplierBank.DesignnCap = reader["DESIGNNCAP"].ToString();
                                supplierBank.FinishProd = reader["FINISHPROD"].ToString();
                                supplierBank.InternalPolicy = reader["INTERNALPOLICY"].ToString();
                                supplierBank.registeredOrg = reader["REGISTEREDORG"].ToString();
                                supplierBank.suspendedProj1 = reader["SUSPENDEDPROJ1"].ToString();
                                supplierBank.suspendedProj2 = reader["SUSPENDEDPROJ2"].ToString();

                                supplierBank.litigation1 = reader["LITIGATION1"].ToString();
                                supplierBank.litigation2 = reader["LITIGATION2"].ToString();
                                supplierBank.compliance1 = reader["COMPLIANCE1"].ToString();
                                supplierBank.shareholder1 = reader["SHAREHOLDER1"].ToString();
                                supplierBank.shareholder2 = reader["SHAREHOLDER2"].ToString();
                                supplierBank.labour1 = reader["LABOUR1"].ToString();
                                supplierBank.labour2 = reader["LABOUR2"].ToString();
                                supplierBank.legalAsset1 = reader["LEGALASSET1"].ToString();
                                supplierBank.legalAsset2 = reader["LEGALASSET2"].ToString();
                                supplierBank.environment1 = reader["ENVIRONMENT1"].ToString();
                                supplierBank.environment2 = reader["ENVIRONMENT2"].ToString();
                                supplierBank.imiInterested1 = reader["IMIINTERESTED1"].ToString();
                                supplierBank.imiInterested2 = reader["IMIINTERESTED2"].ToString();

                                supplierBank.hse1 = reader["HSE1"].ToString();
                                supplierBank.docuHse = reader["DOCUHSE"].ToString();
                                supplierBank.isohealth = reader["ISOHEALTH"].ToString();
                                supplierBank.envtMgt1 = reader["ENVTMGT1"].ToString();
                                supplierBank.dedicatedpers = reader["DEDICATEDPERS"].ToString();
                                supplierBank.hseName = reader["HSENAME"].ToString();
                                supplierBank.hseDesig = reader["HSEDESIG"].ToString();
                                supplierBank.statistic = reader["STATISTIC"].ToString();
                                supplierBank.statisticNear = reader["STATISTICNEAR"].ToString();
                                supplierBank.statisticFirst = reader["STATISTICFIRST"].ToString();
                                supplierBank.statisticMedical = reader["STATISTICMEDI"].ToString();
                                supplierBank.statisticLost = reader["STATISTICLOST"].ToString();
                                supplierBank.statisticFatal = reader["STATISTICFATAL"].ToString();
                                supplierBank.statisticEnvt = reader["STATISTICENVT"].ToString();

                                supplierBank.qualityPolicy1 = reader["QUALITYPOLICY1"].ToString();
                                supplierBank.qualityMgt = reader["QUALITYMGT"].ToString();
                                supplierBank.qualityMgtIso = reader["QUALITYMGTISO"].ToString();
                                supplierBank.qualityResp1 = reader["QUALITYRESP1"].ToString();
                                supplierBank.qualityResp2 = reader["QUALITYRESP2"].ToString();
                                supplierBank.qualityResp3 = reader["QUALITYRESP3"].ToString();
                                supplierBank.qualityreviewDate = reader["QUALITYREVIEWDATE"].ToString();
                                // supplierBank.revisionNo = Convert.ToInt32(reader["REVISION_NO"].ToString());

                                // Bank
                                supplierBank.BankCountryCode = reader["BANK_COUNTRY_CODE"].ToString();
                                supplierBank.BankName = reader["BANK_NAME"].ToString();
                                supplierBank.OtherBank = reader["OTHER_BANK"].ToString();
                                supplierBank.BicCode = reader["SWIFT_CODE"].ToString();
                                supplierBank.AccountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString();
                                supplierBank.AccountNumber = reader["account_no"].ToString();
                                supplierBank.ibanNo = reader["IBAN_NO"].ToString();
                                supplierBank.BankAddress = reader["BANK_ADDRESS"].ToString();
                                supplierBank.BankAddress2 = reader["BANK_ADDRESS_2"].ToString();
                                supplierBank.AccountCurrency = reader["ACCOUNT_CURRENCY"].ToString();
                                supplierBank.Multicurrency = reader["MULTICURRENCY"].ToString();

                                supplierBank.CreatedDate = reader["CREATED_DATE"].ToString();
                                supplierBank.Status = reader["STATUS"].ToString();
                                supplierBank.PushedSupplierStatus = reader["PUSHEDSUPPLIERSTATUS"].ToString();
                                supplierBank.Criticality = reader["CRITICALITY_VALUE"].ToString();
                                supplierBank.InvitedSupplier = reader["INVITED"].ToString();

                                //supplierBank.AuditType = reader["AUDIT_TYPE"].ToString();

                                supplierlist.Add(supplierBank);
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

        public async Task<List<SupplierDto>> GetAllSupplierAsync(string supplierId, string email)
        {
            const string spName = "[dbo].[GetSuppliers]";
            List<SupplierDto> supplierlist = new List<SupplierDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@supplierId", supplierId != null ? supplierId : ""));
                        cmd.Parameters.Add(new SqlParameter("@supplierEmail", email != null ? email : ""));
                        sql.Open();

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
                                supplier.ownercompany = reader["OWNER_INFO"].ToString(); ;
                                supplier.noOfYears = reader["NO_OF_YEARS"].ToString() != "" ? Convert.ToInt32(reader["NO_OF_YEARS"].ToString()) : 0;
                                supplier.bankCountryCodes = reader["BANK_COUNTRY_CODE"].ToString(); ;
                                supplier.bankName = reader["BANK_NAME"].ToString(); ;
                                supplier.otherBankName = reader["OTHER_BANK"].ToString(); ;
                                supplier.swiftcode = reader["SWIFT_CODE"].ToString(); ;
                                supplier.accountHolderName = reader["ACCOUNT_HOLDER_NAME"].ToString(); ;
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
                                supplier.operatingProfit1 = reader["OPERATINGPROFIT1"].ToString() != "NULL" ? Convert.ToInt32(reader["OPERATINGPROFIT1"].ToString()) : 0;
                                supplier.operatingProfit2 = reader["OPERATINGPROFIT2"].ToString() != "" ? (reader["OPERATINGPROFIT2"].ToString()) : "0";
                                supplier.netIncome1 = reader["NETINCOME1"].ToString() != "NULL" ? Convert.ToInt32(reader["NETINCOME1"].ToString()) : 0;
                                supplier.netIncome2 = reader["NETINCOME2"].ToString();
                                supplier.currentAsset1 = reader["CURRENTASSET1"].ToString() != "NULL" ? Convert.ToInt32(reader["CURRENTASSET1"].ToString()) : 0;
                                supplier.currentAsset2 = reader["CURRENTASSET2"].ToString() != "" ? (reader["CURRENTASSET2"].ToString()) : "0";
                                supplier.totalLiable1 = reader["TOTALLIABLE1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALLIABLE1"].ToString()) : 0;
                                supplier.totalLiable2 = reader["TOTALLIABLE2"].ToString() != "" ? (reader["TOTALLIABLE2"].ToString()) : "0";
                                supplier.totalEquity1 = reader["TOTALEQUITY1"].ToString() != "NULL" ? Convert.ToInt32(reader["TOTALEQUITY1"].ToString()) : 0;
                                supplier.totalEquity2 = reader["TOTALEQUITY2"].ToString() != "" ? (reader["TOTALEQUITY2"].ToString()) : "0";
                                supplier.noOfYears = reader["NOOFYEARS"].ToString() != "" ? Convert.ToInt32(reader["NOOFYEARS"].ToString()) : 0;
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
                                //supplier.due_date = reader["DUE_DATE"].ToString();
                                supplier.multicurrency = reader["MULTICURRENCY"].ToString();
                                //supplier.invitestatus = reader["INVITED"].ToString();
                                supplier.wasalAddress = reader["WASAL_ADDRESS"].ToString();
                                supplier.typeOfOrganization2 = reader["TYPE_OF_ORG2"].ToString();
                                supplier.additionalCtrl = reader["ADDITIONALCTRL"].ToString();
                                supplier.additionalCtrl2 = reader["ADDITIONALCTRL2"].ToString();
                                supplier.additionalCtrl3 = reader["ADDITIONALCTRL3"].ToString();
                                supplier.additionalCtrl4 = reader["ADDITIONALCTRL4"].ToString();
                                supplier.additionalCtrl5 = reader["ADDITIONALCTRL5"].ToString();
                                supplier.supplier_extra = reader["SUPPLIER_EXTRA"].ToString();
                                //supplier.bankCode = reader["BANK_CODE"]?.ToString();
                                supplier.revisionNo = reader["REVISION_NO"].ToString() != "" ? Convert.ToInt32(reader["REVISION_NO"].ToString()) : 0;
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
                    sql.Close();
                }
                return supplierlist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}