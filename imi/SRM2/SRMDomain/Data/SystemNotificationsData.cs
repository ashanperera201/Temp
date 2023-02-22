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
    public class SystemNotificationsData : ISystemNotificationsData
    {
        private readonly string _connectionString;
        private IConfiguration configuration;

        public SystemNotificationsData(IConfiguration configuration) => _connectionString = configuration.GetConnectionString("defaultConnection");

        public async Task<IList<SystemNotificationDto>> GetSystemNotificationsByUser(string loggedInUser)
        {
            const string spName = "dbo.Isp_System_Notifications_Search";
            var reviews = new List<SystemNotificationDto>();
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
                                SystemNotificationDto systemNotification = new SystemNotificationDto();
                                systemNotification.id = Convert.ToInt32(reader["ID"].ToString());
                                systemNotification.title = reader["TITLE"].ToString();
                                systemNotification.status = reader["STATUS"].ToString();
                                systemNotification.type = reader["TYPE"].ToString();
                                systemNotification.assignedUser = reader["ASSIGNED_USER"].ToString();
                                //systemNotification.createdDate = Convert.ToDateTime(reader["CREATED_DATE"]).ToString("dd/MM/yy");
                                //systemNotification.modifiedDate = Convert.ToDateTime(reader["MODIFIED_DATE"]).ToString("dd/MM/yy");
                                systemNotification.description = reader["DESCRIPTION"].ToString();
                                reviews.Add(systemNotification);
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

        public async Task<int> SaveSystemNotification(SystemNotificationDto systemNotification)
        {
            try
            {
                var result = 0;
                using (SqlConnection sql = new SqlConnection(_connectionString))
                {
                    string spName = "dbo.Isp_System_Notifications_Save";


                    using (SqlCommand cmd = new SqlCommand(spName, sql))
                    {
                        cmd.CommandType = System.Data.CommandType.StoredProcedure;
                        cmd.Parameters.Add(new SqlParameter("@id", systemNotification.id));
                        cmd.Parameters.Add(new SqlParameter("@type", systemNotification.type));
                        cmd.Parameters.Add(new SqlParameter("@title", systemNotification.title));
                        cmd.Parameters.Add(new SqlParameter("@status", systemNotification.status));
                        cmd.Parameters.Add(new SqlParameter("@assignedUser", systemNotification.assignedUser));
                        cmd.Parameters.Add(new SqlParameter("@description", systemNotification.description));
                        var returnParameter = cmd.Parameters.Add(new SqlParameter("@id", systemNotification.id));
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
    }
}