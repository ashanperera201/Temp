using Microsoft.Extensions.Configuration;
using SRMDomain.Data.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data
{
    public class SiteAuditData : ISiteAuditData
    {
        private readonly string _connectionString;
        private IConfiguration configuration;

        public SiteAuditData(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("defaultConnection");

        public async Task<IList<SiteAuditDateDto>> GetSiteAuditDates(int supplierId, int siteauditid)
        {
            const string spName = "dbo.Isp_SiteAudit_Search";
            IList<SiteAuditDateDto> sitelist = new List<SiteAuditDateDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", supplierId));
                        cmd.Parameters.Add(new SqlParameter("@SiteAuditId", siteauditid));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                SiteAuditDateDto siteauditdate = new SiteAuditDateDto();

                                siteauditdate.SupplierId = Convert.ToInt32(reader["SUPPLIER_ID"].ToString());
                                siteauditdate.audit_date = Convert.ToDateTime(reader["AUDIT_DATE"].ToString());
                                siteauditdate.audit_time = reader["AUDIT_TIME"].ToString();
                                siteauditdate.SiteAuditId = Convert.ToInt32(reader["SITE_AUDIT_ID"].ToString());

                                sitelist.Add(siteauditdate);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return sitelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<SiteAuditItemDto>> GetSiteAuditItems(int supplierId)
        {
            const string spName = "dbo.Isp_SiteAuditItem_Search";
            IList<SiteAuditItemDto> sitelist = new List<SiteAuditItemDto>();

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
                                SiteAuditItemDto siteaudititem = new SiteAuditItemDto();

                                siteaudititem.Site_audit_id = Convert.ToInt32(reader["SITE_AUDIT_ID"].ToString());
                                siteaudititem.Supplier_id = reader["SUPPLIER_ID"].ToString();
                                siteaudititem.audit_remark = reader["AUDIT_REMARK"].ToString();
                                siteaudititem.audit_date_final = Convert.ToDateTime(reader["AUDIT_DATE_FINAL"].ToString());
                                siteaudititem.audit_time_final = reader["AUDIT_TIME_FINAL"].ToString();
                                siteaudititem.final_Date_remark = reader["FINAL_DATE_REMARK"].ToString();
                                siteaudititem.additional_comment = reader["ADDITIONAL_COMMENT"].ToString();
                                siteaudititem.non_confirmity = reader["NON_CONFIRMITY"].ToString();
                                //siteaudititem.last_updated_date = DateTime.ParseExact(reader["LAST_UPDATED_DATE"].ToString(), @"d/M/yyyy",
    //System.Globalization.CultureInfo.InvariantCulture);
                                siteaudititem.userId = reader["USERID"].ToString();
                                siteaudititem.userRole = reader["USERROLE"].ToString();
                                //siteaudititem.createdDate = DateTime.ParseExact(reader["CREATEDDATE"].ToString(), @"d/M/yyyy",
    //System.Globalization.CultureInfo.InvariantCulture);

                                sitelist.Add(siteaudititem);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return sitelist;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveSiteAuditDate(SiteAuditDateDto siteauditdate, int suplierId, int siteauditid)
        {
            const string spName = "dbo.Isp_SiteAudit_Save";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", suplierId));
                        cmd.Parameters.Add(new SqlParameter("@AuditDate", siteauditdate.audit_date));
                        cmd.Parameters.Add(new SqlParameter("@AuditTime", siteauditdate.audit_time));
                        cmd.Parameters.Add(new SqlParameter("@SiteAuditId", siteauditid));
                        
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

        public async Task<int> SaveSiteAuditItem(SiteAuditItemDto siteaudititem)
        {
            const string spName = "dbo.Isp_SiteAuditItem_Save";
            var result = 0;
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", siteaudititem.Supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@AuditRemark", siteaudititem.audit_remark));
                        cmd.Parameters.Add(new SqlParameter("@AuditDate", siteaudititem.audit_date_final));
                        cmd.Parameters.Add(new SqlParameter("@AuditTime", siteaudititem.audit_time_final));
                        cmd.Parameters.Add(new SqlParameter("@FinalRemark", siteaudititem.final_Date_remark));
                        cmd.Parameters.Add(new SqlParameter("@AdditionalComment", siteaudititem.additional_comment));
                        cmd.Parameters.Add(new SqlParameter("@NonConfirmity", siteaudititem.non_confirmity == "N"?0:1));
                        cmd.Parameters.Add(new SqlParameter("@UserId", siteaudititem.userId));
                        cmd.Parameters.Add(new SqlParameter("@UserRole", siteaudititem.userRole));

                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@SiteAuditId", siteaudititem.Site_audit_id));
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

        public async Task<bool> UpdateSiteAuditItem(SiteAuditItemDto siteaudititem)
        {
            const string spName = "dbo.Isp_SiteAuditItem_Update";
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", siteaudititem.Supplier_id));
                        cmd.Parameters.Add(new SqlParameter("@AuditRemark", siteaudititem.audit_remark));
                        cmd.Parameters.Add(new SqlParameter("@AuditDate", siteaudititem.audit_date_final));
                        cmd.Parameters.Add(new SqlParameter("@AuditTime", siteaudititem.audit_time_final));
                        cmd.Parameters.Add(new SqlParameter("@FinalRemark", siteaudititem.final_Date_remark));
                        cmd.Parameters.Add(new SqlParameter("@AdditionalComment", siteaudititem.additional_comment));
                        cmd.Parameters.Add(new SqlParameter("@NonConfirmity", siteaudititem.non_confirmity =="N"?0:1));
                        cmd.Parameters.Add(new SqlParameter("@UserId", siteaudititem.userId));
                        cmd.Parameters.Add(new SqlParameter("@UserRole", siteaudititem.userRole));
                        cmd.Parameters.Add(new SqlParameter("@SiteAuditId", siteaudititem.Site_audit_id));

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
