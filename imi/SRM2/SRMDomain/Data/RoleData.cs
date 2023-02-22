#region References
using System;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System.Threading;
using System.Collections.Generic;
#endregion

#region Namespace
namespace SRMDomain.Data
{
    public class RoleData : IRoleData
    {
        /// <summary>
        /// The connection string
        /// </summary>
        private readonly string _connectionString;
        /// <summary>
        /// Initializes a new instance of the <see cref="RoleData"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public RoleData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("defaultConnection");
        }

        /// <summary>
        /// Deletes the role asynchronous.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<bool> DeleteRoleAsync(string roleId, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-DeleteRole]";
            bool returnStatus = false;
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@RoleId", roleId));

                    cmd.Parameters.Add(new SqlParameter("@Status", false));
                    cmd.Parameters["@Status"].Direction = ParameterDirection.Output;

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                    returnStatus = Convert.ToBoolean(cmd.Parameters["@Status"].Value);
                }
                await sql.CloseAsync();
            }
            return returnStatus;
        }

        /// <summary>
        /// Gets the roles asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<RoleDto>> GetRolesAsync(string assignedUserId, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-GetRoles]";
            List<RoleDto> roles = new List<RoleDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@RoleAssignedUserId", assignedUserId));

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var role = new RoleDto();

                            role.Id = Guid.Parse(reader["Id"].ToString());
                            role.RoleName = reader["RoleName"].ToString();
                            role.RoleCode = reader["RoleCode"].ToString();
                            role.RoleDescription = reader["RoleDescription"].ToString();
                            role.RoleType = reader["RoleType"].ToString();
                            role.RoleAssignedUserId = reader["RoleAssignedUserId"].ToString();
                            role.IsActive = Convert.ToBoolean(reader["IsActive"].ToString());
                            role.CreatedBy = reader["CreatedBy"].ToString();
                            role.CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString());
                            role.UpdatedOn = string.IsNullOrEmpty(reader["UpdatedOn"].ToString()) ? DateTime.MinValue : DateTime.Parse(reader["UpdatedOn"].ToString());
                            role.UpdatedBy = reader["UpdatedBy"].ToString();

                            roles.Add(role);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return roles;
        }

        /// <summary>
        /// Saves the role asynchronous.
        /// </summary>
        /// <param name="role">The role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<Tuple<RoleDto, string>> SaveUpdateRoleAsync(RoleDto role, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[IAM-RoleSaveUpdate]";
            bool status = false;
            string responseMessage = string.Empty;

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    role.Id = role.Id == Guid.Empty ? Guid.NewGuid() : role.Id;
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id", role.Id));
                    cmd.Parameters.Add(new SqlParameter("@RoleName", role.RoleName));
                    cmd.Parameters.Add(new SqlParameter("@RoleCode", role.RoleCode));
                    cmd.Parameters.Add(new SqlParameter("@RoleDescription", role.RoleDescription));
                    cmd.Parameters.Add(new SqlParameter("@RoleType", role.RoleType));
                    cmd.Parameters.Add(new SqlParameter("@RoleAssignedUserId", role.RoleAssignedUserId));
                    cmd.Parameters.Add(new SqlParameter("@IsActive", role.IsActive));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", role.CreatedBy));
                    cmd.Parameters.Add(new SqlParameter("@CreatedOn", role.CreatedOn != null ? role.CreatedOn : DateTime.UtcNow));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedBy", role.UpdatedBy));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedOn", DateTime.UtcNow));
                    cmd.Parameters.Add(new SqlParameter("@Status", false));
                    cmd.Parameters.Add(new SqlParameter("@Response", string.Empty));
                    cmd.Parameters["@Status"].Direction = ParameterDirection.Output;
                    cmd.Parameters["@Response"].Direction = ParameterDirection.Output;

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                    status = Convert.ToBoolean(cmd.Parameters["@Status"]?.Value);
                    responseMessage = cmd.Parameters["@Response"]?.Value.ToString();
                }
                await sql.CloseAsync();

                if (status)
                {
                    return Tuple.Create<RoleDto, string>(role, responseMessage);
                }
                else
                {
                    return Tuple.Create<RoleDto, string>(null, responseMessage);
                }
            }
        }
    }
}
#endregion