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
    public class FileData :IFileData
    {
        private readonly string _connectionString;
        private IConfiguration configuration;

        public FileData(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("defaultConnection");

        public async Task<bool> SaveFile(FileDto file)
        {
            const string spName = "dbo.Isp_File_Save";

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", file.SupplierIdFile));
                        cmd.Parameters.Add(new SqlParameter("@FileName", file.FileName));
                        cmd.Parameters.Add(new SqlParameter("@ContentType", file.ContentType));
                        cmd.Parameters.Add(new SqlParameter("@Category", file.Category));

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

        public async Task<FileDto> GetFilebyId(int id)
        {
            const string spName = "dbo.Isp_File_SearchbyId";
            FileDto file = new FileDto();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", id));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                file.Id = Convert.ToInt32(reader["ID"].ToString());
                                file.FileName = reader["FILE_NAME"].ToString();
                                file.ContentType = reader["CONTENT_TYPE"].ToString();
                                file.SupplierIdFile = Convert.ToInt32(reader["SUPPLIERIDFILE"].ToString());
                                file.Category = reader["CATEGORY"].ToString();

                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return file;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<FileDto>> GetFileBySupplier(int id)
        {
            const string spName = "dbo.Isp_File_SearchbySupplierId";
            IList<FileDto> fileList = new List<FileDto>();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", id));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                FileDto file = new FileDto();

                                file.Id = Convert.ToInt32(reader["ID"].ToString());
                                file.FileName = reader["FILE_NAME"].ToString();
                                file.ContentType = reader["CONTENT_TYPE"].ToString();
                                file.SupplierIdFile = Convert.ToInt32(reader["SUPPLIERIDFILE"].ToString());
                                file.Category = reader["CATEGORY"].ToString();

                                fileList.Add(file);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return fileList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveTempFile(FileDto file)
        {
            const string spName = "dbo.Isp_FileTemp_Save";

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", file.SupplierIdFile));
                        cmd.Parameters.Add(new SqlParameter("@FileName", file.FileName));
                        cmd.Parameters.Add(new SqlParameter("@ContentType", file.ContentType));
                        cmd.Parameters.Add(new SqlParameter("@Category", file.Category));

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

        public async Task<FileDto> GetTempFilebyId(int id)
        {
            const string spName = "dbo.Isp_FileTemp_SearchbyId";
            FileDto file = new FileDto();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", id));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                file.Id = Convert.ToInt32(reader["ID"].ToString());
                                file.FileName = reader["FILE_NAME"].ToString();
                                file.ContentType = reader["CONTENT_TYPE"].ToString();
                                file.SupplierIdFile = Convert.ToInt32(reader["SUPPLIERIDFILE"].ToString());
                                file.Category = reader["CATEGORY"].ToString();

                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return file;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<FileDto>> GetTempFileBySupplier(int supplierId)
        {
            const string spName = "dbo.Isp_FileTemp_SearchbySupplierId";
            IList<FileDto> fileList = new List<FileDto>();

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
                                FileDto file = new FileDto();

                                file.Id = Convert.ToInt32(reader["ID"].ToString());
                                file.FileName = reader["FILE_NAME"].ToString();
                                file.ContentType = reader["CONTENT_TYPE"].ToString();
                                file.SupplierIdFile = Convert.ToInt32(reader["SUPPLIERIDFILE"].ToString());
                                file.Category = reader["CATEGORY"].ToString();

                                fileList.Add(file);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return fileList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<bool> SaveSiteAuditFile(FileDto file)
        {
            const string spName = "dbo.Isp_FileSite_Save";

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SupplierId", file.SupplierIdFile));
                        cmd.Parameters.Add(new SqlParameter("@FileName", file.FileName));
                        cmd.Parameters.Add(new SqlParameter("@ContentType", file.ContentType));
                        cmd.Parameters.Add(new SqlParameter("@Category", file.Category));

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

        public async Task<FileDto> GetSiteAuditFilebyId(int id)
        {
            const string spName = "dbo.Isp_FileSite_SearchbyId";
            FileDto file = new FileDto();

            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@Id", id));
                        sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {

                                file.Id = Convert.ToInt32(reader["ID"].ToString());
                                file.FileName = reader["FILE_NAME"].ToString();
                                file.ContentType = reader["CONTENT_TYPE"].ToString();
                                file.SupplierIdFile = Convert.ToInt32(reader["SUPPLIERIDFILE"].ToString());
                                file.Category = reader["CATEGORY"].ToString();

                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return file;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<FileDto>> GetSiteAuditFileBySupplier(int supplierId)
        {
            const string spName = "dbo.Isp_FileTemp_SearchbySupplierId";
            IList<FileDto> fileList = new List<FileDto>();

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
                                FileDto file = new FileDto();

                                file.Id = Convert.ToInt32(reader["ID"].ToString());
                                file.FileName = reader["FILE_NAME"].ToString();
                                file.ContentType = reader["CONTENT_TYPE"].ToString();
                                file.SupplierIdFile = Convert.ToInt32(reader["SUPPLIERIDFILE"].ToString());
                                file.Category = reader["CATEGORY"].ToString();

                                fileList.Add(file);
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return fileList;
            }
            catch (Exception ex)
            {
                return null;
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
    }
}
