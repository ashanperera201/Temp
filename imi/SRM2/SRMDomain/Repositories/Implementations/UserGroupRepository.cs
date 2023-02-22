#region References
using Dapper;
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Implementations
{
    /// <summary>
    /// UserGroupRepository
    /// </summary>
    /// <seealso cref="SRMDomain.Repositories.Contracts.IUserGroupRepository" />
    public class UserGroupRepository : IUserGroupRepository
    {
        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserGroupRepository"/> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public UserGroupRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }

        /// <summary>
        /// Updates the user group detail infor asynchronous.
        /// </summary>
        /// <param name="userGroupDetail">The user group detail.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupDetail> UpdateUserGroupDetailInforAsync(UserGroupDetail userGroupDetail, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            string query = $@"
                        UPDATE [dbo].[UserGroupDetail]
                           SET
                               [UserGroupId] = @UserGroupId
                              ,[UserIds] = @UserIds
                              ,[Department] = @Department
                              ,[IsActive] = @IsActive
                              ,[CreatedBy] = @CreatedBy
                              ,[CreatedOn] = @CreatedOn
                              ,[UpdatedBy] = @UpdatedBy
                              ,[UpdatedOn] = @UpdatedOn
                         WHERE Id = '{userGroupDetail.Id}'
                    ";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, userGroupDetail, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? userGroupDetail : null;
        }

        /// <summary>
        /// Gets the user group detail information asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<UserGroupDetail>> GetUserGroupDetailInfoAsync(CancellationToken cancellationToken)
        {
            IEnumerable<UserGroupDetail> response;
            string query = $@"SELECT * FROM [dbo].[UserGroupDetail]";
            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                response = (await connection.QueryAsync<UserGroupDetail>(query, cancellationToken));
                connection.Close();
            }

            return response;
        }

        /// <summary>
        /// Deletes the user group asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<int> DeleteUserGroupAsync(int id, CancellationToken cancellationToken)
        {
            int transactionState = 0;
            string query = $@"DELETE FROM [dbo].[UserGroupDetail] WHERE [UserGroupId]={id}";
            using (var conection = _srmDapperContext.CreateConnection())
            {
                transactionState = await conection.ExecuteAsync(query, cancellationToken);
            }
            return transactionState;
        }

        /// <summary>
        /// Adds the user group details asynchronous.
        /// </summary>
        /// <param name="userGroupDetail">The user group detail.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupDetail> InsertUserGroupDetailsAsync(UserGroupDetail userGroupDetail, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            await DeleteUserGroupAsync(userGroupDetail.UserGroupId, cancellationToken);
            string query = $@"
                         INSERT INTO [dbo].[UserGroupDetail]
                               ([UserGroupId]
                               ,[UserIds]
                               ,[Department]
                               ,[IsActive]
                               ,[CreatedBy]
                               ,[CreatedOn]
                               ,[UpdatedBy]
                               ,[UpdatedOn])
                         VALUES
                               (@UserGroupId
                               ,@UserIds
                               ,@Department
                               ,@IsActive
                               ,@CreatedBy
                               ,@CreatedOn
                               ,@UpdatedBy
                               ,@UpdatedOn)";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, userGroupDetail, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
                return transactionState > 0 ? userGroupDetail : null;
        }

        public async Task<bool> CloneUserGroupAsync(string userGroupName, CancellationToken cancellationToken = default)
        {
            UserGroupEntity userGroupEntity = null;
            string query = $@"SELECT * FROM [dbo].[UserGroup] WHERE UserGroup  LIKE '%{userGroupName}%' ORDER BY Id DESC";
            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                userGroupEntity = (await connection.QueryAsync<UserGroupEntity>(query, cancellationToken)).FirstOrDefault();
                connection.Close();
                
            }
            Random rnd = new Random();
            //userGroupEntity.UserGroup = $"{userGroupName}{userGroupEntity.Id + 1}";
            var result = await SaveUserGroupAsync(userGroupEntity, cancellationToken);
            return result != null ? true : false;
        }

        /// <summary>
        /// Gets the user group detail asynchronous.
        /// </summary>
        /// <param name="userGroupId">The user group identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupEntity> GetUserGroupDetailAsync(int userGroupId, CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT * FROM [dbo].[UserGroup] WHERE Id = {userGroupId}";
            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var serviceResult = (await connection.QueryAsync<UserGroupEntity>(query, cancellationToken)).FirstOrDefault();
                connection.Close();
                return serviceResult;
            }
        }

        /// <summary>
        /// Gets the user group details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<UserGroupEntity>> GetUserGroupDetailsAsync(CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT * FROM [dbo].[UserGroup] ORDER BY Id DESC";
            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var serviceResult = await connection.QueryAsync<UserGroupEntity>(query, cancellationToken);
                connection.Close();
                return serviceResult;
            }
        }

        /// <summary>
        /// Saves the user group asynchronous.
        /// </summary>
        /// <param name="userGroup">The user group.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupEntity> SaveUserGroupAsync(UserGroupEntity userGroup, CancellationToken cancellationToken = default)
        {
            var transactionState = 0;
            string query = $@"
                   INSERT INTO [dbo].[UserGroup]
                               ([UserGroup]
                               ,[CompanyCode]
                               ,[Description]
                               ,[IsActive]
                               ,[CreatedBy]
                               ,[CreatedOn]
                               ,[UpdatedBy]
                               ,[UpdatedOn])
                    VALUES
                               (@UserGroup
                               ,@CompanyCode
                               ,@Description
                               ,@IsActive
                               ,@CreatedBy
                               ,@CreatedOn
                               ,@UpdatedBy
                               ,@UpdatedOn)";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using(var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, userGroup, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? userGroup : null;
        }

        /// <summary>
        /// Updates the user group asynchronous.
        /// </summary>
        /// <param name="userGroup">The user group.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupEntity> UpdateUserGroupAsync(UserGroupEntity userGroup, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            var query = $@"
                UPDATE [dbo].[UserGroup]
                   SET [UserGroup] = @UserGroup
                      ,[CompanyCode] = @CompanyCode
                      ,[Description] = @Description
                      ,[IsActive] = @IsActive
                      ,[CreatedBy] = @CreatedBy
                      ,[CreatedOn] = @CreatedOn
                      ,[UpdatedBy] = @UpdatedBy
                      ,[UpdatedOn] = @UpdatedOn
                 WHERE Id = ${userGroup.Id}";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, userGroup, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                }
                conection.Close();
            }
            return transactionState > 0 ? userGroup : null;
        }
    }
}
#endregion
