#region References
using Dapper;
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Implementations
{
    public class RoleRepository : IRoleRepository
    {
        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;
        /// <summary>
        /// Initializes a new instance of the <see cref="RoleRepository"/> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public RoleRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }
        /// <summary>
        /// Gets the role by code asynchronous.
        /// </summary>
        /// <param name="roleCode">The role code.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        public async Task<IEnumerable<RoleEntity>> GetRoleByCodeAsync(string roleCode, CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT * FROM [dbo].[IAM-Roles] R WHERE R.RoleCode = '{roleCode}';
                              SELECT * FROM [dbo].[IAM-VisibilityPermissions] VP WHERE VP.RoleId = (SELECT Id FROM [dbo].[IAM-Roles] WHERE RoleCode = '{roleCode}')";
            using (var connection = _srmDapperContext.CreateConnection())
            using (var multiQuery = await connection.QueryMultipleAsync(query, cancellationToken))
            {
                var role = await multiQuery.ReadAsync<RoleEntity>();
                if (role != null && role.Count() > 0)
                {
                    role.ToList().ForEach(async x =>
                    {
                        x.VisibilityPermissionsEntity = (await multiQuery.ReadAsync<VisibilityPermissionsEntity>()).Where(vp => vp.RoleId == x.Id);
                    });
                    connection.Close();
                    return role;
                }
                return null;
            }
        }

        /// <summary>
        /// Deletes the role asynchronous.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<bool> DeleteRoleAsync(string roleId, CancellationToken cancellationToken)
        {
            string query = $@"DELETE FROM [dbo].[IAM-Roles] WHERE Id = '{roleId}'";
            using (var connection = _srmDapperContext.CreateConnection())
            {
                var queryResult = await connection.ExecuteAsync(query, cancellationToken);
                if (queryResult > 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        /// <summary>
        /// Gets the roles asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<RoleEntity>> GetRolesAsync(string assignedUserId, CancellationToken cancellationToken)
        {
            string query = $@"SELECT * FROM [dbo].[IAM-Roles]";

            if(assignedUserId != string.Empty)
            {
                query.Concat($" WHERE RoleAssignedUserId = '{assignedUserId}'");
            }
            using (var connection = _srmDapperContext.CreateConnection())
            {
                var serviceResult = await connection.QueryAsync<RoleEntity>(query, cancellationToken);
                return serviceResult;
            }
        }

        public Task<RoleEntity> SaveUpdateRoleAsync(RoleEntity role, CancellationToken cancellationToken)
        {
            string query = string.Empty;
            if(role.Id != Guid.Empty)
            {
                // UPDATE
                query = $@"




                ";
                using (var connection = _srmDapperContext.CreateConnection())
                {
                    connection.Open();
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {

                        }
                        catch
                        {

                            throw;
                        }
                    }
                }
            }
            else
            {
                // SAVE
            }
            throw new NotImplementedException();
        }
    }
}
#endregion