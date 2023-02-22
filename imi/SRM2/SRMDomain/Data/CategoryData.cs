using Microsoft.Extensions.Configuration;
using SRMDomain.Data.Interfaces;
using SRMDomain.Data.Model;
using SRMPublic.Criteria;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data
{
    public class CategoryData :ICategoryData
    {
        //private readonly IDataAccess _dataAccess;
        private readonly string _connectionString;
        private IConfiguration configuration;

        //public CategoryData() {
        //    _connectionString = configuration.GetConnectionString("defaultConnection");
        //}
        
        public CategoryData(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("defaultConnection");

        public async Task<IList<CategoryDto>> SearchCategories()
        {
            const string spName = "dbo.Isp_AllCategory_Search";
            var CategoryDataList = new List<CategoryDto>();
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
                                var gen = reader["GENERALCATEGORYNAME"].ToString();
                                CategoryDataList.Add(new CategoryDto()
                                {
                                    POSITION = Convert.ToInt32(reader["POSITION"].ToString()),
                                    GENERALCATEGORYNAME = reader["GENERALCATEGORYNAME"].ToString(),
                                    SUBCATEGORYNAME = reader["SUBCATEGORYNAME"].ToString(),
                                    DETAILCATEGORYNAME = reader["DETAILCATEGORYNAME"].ToString(),
                                    GENERALCATEGORYCODE = reader["GENERALCATEGORYCODE"].ToString(),
                                    SUBCATEGORYCODE = reader["SUBCATEGORYCODE"].ToString(),
                                    DETAILCATEGORYCODE = reader["DETAILCATEGORYCODE"].ToString()
                                }); 
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return CategoryDataList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<IList<CategoryDataModel>> SearchCategoryAsync(CategorySearchCriteria categoryParams)
        {
            const string spName = "dbo.Isp_Category_Search";
            var CategoryDataList = new List<CategoryDataModel>();
            try
            {
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@SearchCriteria", categoryParams.SearchCriteria ?? string.Empty));
                        cmd.Parameters.Add(new SqlParameter("@UserId", categoryParams.UserId));
                        cmd.Parameters.Add(new SqlParameter("@PageNo", categoryParams.PageNo));
                        cmd.Parameters.Add(new SqlParameter("@Records", categoryParams.Records));
                        cmd.Parameters.Add(new SqlParameter("@Count", categoryParams.Count));
                        await sql.OpenAsync();

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var gen = reader["GENERALCATEGORYNAME"].ToString();
                                CategoryDataList.Add(new CategoryDataModel() {
                                    POSITION = Convert.ToInt32(reader["POSITION"].ToString()),
                                    GENERALCATEGORYNAME = reader["GENERALCATEGORYNAME"].ToString(),
                                    SUBCATEGORYNAME = reader["SUBCATEGORYNAME"].ToString(),
                                    DETAILCATEGORYNAME = reader["DETAILCATEGORYNAME"].ToString(),
                                    GENERALCATEGORYCODE = reader["GENERALCATEGORYCODE"].ToString(),
                                    SUBCATEGORYCODE = reader["SUBCATEGORYCODE"].ToString(),
                                    DETAILCATEGORYCODE = reader["DETAILCATEGORYCODE"].ToString()
                                });
                            }
                        }

                    }
                    sql.CloseAsync();
                }
                return CategoryDataList;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
