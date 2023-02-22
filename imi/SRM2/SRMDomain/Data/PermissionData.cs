#region References
using System;
using System.Data;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using Newtonsoft.Json;
#endregion

#region Namespace
namespace SRMDomain.Data
{
    public class PermissionData : IPermissionData
    {
        /// <summary>
        /// The connection string
        /// </summary>
        private readonly string _connectionString;
        /// <summary>
        /// Initializes a new instance of the <see cref="PermissionData"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public PermissionData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("defaultConnection");
        }

        public Task<List<PermissionDto>> FilterPermissionAsync(params PermissionDto[] permissions)
        {
            throw new NotImplementedException();
        }

        public async Task<List<PermissionVisibilityConfigDto>> GetVisibilityConfigBasedOnRole(string roleId, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-GetVisibilityPermission]";
            List<PermissionVisibilityConfigDto> visibilityConfigs = new List<PermissionVisibilityConfigDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@RoleId", roleId));

                    await sql.OpenAsync(cancellationToken);

                    using (var reader = await cmd.ExecuteReaderAsync(cancellationToken))
                    {
                        while (await reader.ReadAsync(cancellationToken))
                        {
                            var permissionVisibilityConfig = new PermissionVisibilityConfigDto();

                            permissionVisibilityConfig.Id = Guid.Parse(reader["Id"].ToString());
                            permissionVisibilityConfig.RoleId = reader["RoleId"].ToString();
                            permissionVisibilityConfig.VisibilityPermissionJson = reader["VisibilityPermissionJson"].ToString();
                            permissionVisibilityConfig.IsActive = Convert.ToBoolean(reader["IsActive"].ToString());
                            permissionVisibilityConfig.CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString());
                            permissionVisibilityConfig.CreatedBy = reader["CreatedBy"].ToString();
                            permissionVisibilityConfig.UpdatedOn = string.IsNullOrEmpty(reader["UpdatedOn"].ToString()) ? DateTime.MinValue : DateTime.Parse(reader["UpdatedOn"].ToString());
                            permissionVisibilityConfig.UpdatedBy = reader["UpdatedBy"].ToString();

                            visibilityConfigs.Add(permissionVisibilityConfig);
                        }
                    }
                }
                await sql.CloseAsync();
                return visibilityConfigs;
            }
        }

        /// <summary>
        /// Gets the permissions asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<PermissionDto>> GetPermissionsAsync(string assignedUserId, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-GetPermissions]";
            List<PermissionDto> permissions = new List<PermissionDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@AssignedUserId", assignedUserId));

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var permission = new PermissionDto();

                            permission.Id = Guid.Parse(reader["Id"].ToString());
                            permission.RoleId = reader["RoleId"].ToString();
                            permission.RoleAssignedUserId = reader["RoleAssignedUserId"].ToString();
                            permission.SectionCode = reader["SectionCode"].ToString();
                            permission.LevelCode = reader["LevelCode"].ToString();
                            permission.PermissionName = reader["PermissionName"].ToString();
                            permission.PermissionCode = reader["PermissionCode"].ToString();
                            permission.EnableToView = Boolean.Parse(reader["EnableToView"].ToString());
                            permission.EnableToEdit = Boolean.Parse(reader["EnableToEdit"].ToString());
                            permission.CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString());
                            permission.CreatedBy = reader["CreatedBy"].ToString();
                            permission.UpdatedOn = string.IsNullOrEmpty(reader["UpdatedOn"].ToString()) ? DateTime.MinValue : DateTime.Parse(reader["UpdatedOn"].ToString());
                            permission.UpdatedBy = reader["UpdatedBy"].ToString();

                            permissions.Add(permission);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return permissions;
        }

        /// <summary>
        /// Saves the permission asynchronous.
        /// </summary>
        /// <param name="permission">The permission.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>
        ///   <br />
        /// </returns>
        public async Task<PermissionDto> SaveUpdatePermissionAsync(PermissionDto permission, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-PermissionSaveUpdate]";
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    permission.Id = permission.Id == Guid.Empty ? Guid.NewGuid() : permission.Id;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id", permission.Id));
                    cmd.Parameters.Add(new SqlParameter("@RoleId", permission.RoleId));
                    cmd.Parameters.Add(new SqlParameter("@RoleAssignedUserId", permission.RoleAssignedUserId));
                    cmd.Parameters.Add(new SqlParameter("@LevelCode", permission.LevelCode));
                    cmd.Parameters.Add(new SqlParameter("@SectionCode", permission.SectionCode));
                    cmd.Parameters.Add(new SqlParameter("@PermissionCode", permission.PermissionCode));
                    cmd.Parameters.Add(new SqlParameter("@PermissionName", permission.PermissionName));
                    cmd.Parameters.Add(new SqlParameter("@EnableToView", permission.EnableToView));
                    cmd.Parameters.Add(new SqlParameter("@EnableToEdit", permission.EnableToEdit));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", permission.CreatedBy));
                    cmd.Parameters.Add(new SqlParameter("@CreatedOn", permission.CreatedOn));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedBy", permission.UpdatedBy));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedOn", permission.UpdatedOn));

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);
                }
                await sql.CloseAsync();
                return permission;
            }
        }

        public Task<Tuple<string, bool>> DeletePermissionAsync(string permissionCode, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public async Task<PermissionVisibilityConfigDto> permissionVisibilityConfigAsync(PermissionVisibilityConfigDto permissionVisibilityConfig, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-VisibilityPermissionSaveUpdate]";
            bool status = false;

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    permissionVisibilityConfig.Id = permissionVisibilityConfig.Id == Guid.Empty ? Guid.NewGuid() : permissionVisibilityConfig.Id;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id", permissionVisibilityConfig.Id));
                    cmd.Parameters.Add(new SqlParameter("@RoleId", permissionVisibilityConfig.RoleId));
                    cmd.Parameters.Add(new SqlParameter("@AssignedUser", permissionVisibilityConfig.AssignedUserId));
                    cmd.Parameters.Add(new SqlParameter("@VisibilityPermissionJson", permissionVisibilityConfig.VisibilityPermissionJson));
                    cmd.Parameters.Add(new SqlParameter("@IsActive", permissionVisibilityConfig.IsActive));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", permissionVisibilityConfig.CreatedBy));
                    cmd.Parameters.Add(new SqlParameter("@CreatedOn", permissionVisibilityConfig.CreatedOn));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedBy", permissionVisibilityConfig.UpdatedBy));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedOn", permissionVisibilityConfig.UpdatedOn));
                    cmd.Parameters.Add(new SqlParameter("@Status", false));
                    cmd.Parameters.Add(new SqlParameter("@Response", string.Empty));

                    cmd.Parameters["@Status"].Direction = ParameterDirection.Output;
                    cmd.Parameters["@Response"].Direction = ParameterDirection.Output;

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                    status = Convert.ToBoolean(cmd.Parameters["@Status"]?.Value);
                }
                await sql.CloseAsync();
                return status ? permissionVisibilityConfig : null;
            }
        }
    }
}
#endregion