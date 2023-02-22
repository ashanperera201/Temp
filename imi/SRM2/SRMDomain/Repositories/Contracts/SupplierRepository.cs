#region References
using Dapper;
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts.Implementations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public class SupplierRepository : ISupplierRepository
    {

        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="SupplierRepository"/> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public SupplierRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }

        /// <summary>
        /// Gets the supplier detail asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<SupplierEntity> GetSupplierDetailRowWiseAsync(string searchTerm, CancellationToken cancellationToken = default)
        {
            string query = $@"
                       SELECT  [Id]
                              ,[SupplierUniqueId]
                              ,[supplierName]
                              ,[SupplierContact]
                              ,[SupplierFirstName]
                              ,[SupplierLastName]
                              ,[SupplierMiddleName]
                              ,[SupplierEmail]
                              ,[SupplierCriticality]
                              ,[AdditionalInformations]
                              ,[IsActive]
                              ,[CreatedBy]
                              ,[CreatedOn]
                              ,[UpdatedBy]
                              ,[UpdatedOn]
                          FROM [dbo].[SUPPLIER_INFORMATIONS]
                          WHERE [SupplierUniqueId] = '{searchTerm}' OR [SupplierEmail] = '{searchTerm}'
                        ";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<SupplierEntity>(query, cancellationToken))?.FirstOrDefault();
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Gets the supplier details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<SupplierEntity>> GetSupplierDetailsRowWiseAsync(CancellationToken cancellationToken = default)
        {
            string query = $@"
                       SELECT  [Id]
                              ,[SupplierUniqueId]
                              ,[supplierName]
                              ,[SupplierContact]
                              ,[SupplierFirstName]
                              ,[SupplierLastName]
                              ,[SupplierMiddleName]
                              ,[SupplierEmail]
                              ,[SupplierCriticality]
                              ,[AdditionalInformations]
                              ,[IsActive]
                              ,[CreatedBy]
                              ,[CreatedOn]
                              ,[UpdatedBy]
                              ,[UpdatedOn]
                          FROM [dbo].[SUPPLIER_INFORMATIONS]";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<SupplierEntity>(query, cancellationToken));
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Saves the supplier asynchronous.
        /// </summary>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<SupplierEntity> SaveSupplierRowWiseAsync(SupplierEntity supplierEntity, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            string query = $@"
                         INSERT INTO [dbo].[SUPPLIER_INFORMATIONS]
                               ([SupplierUniqueId]
                               ,[supplierName]
                               ,[SupplierContact]
                               ,[SupplierFirstName]
                               ,[SupplierLastName]
                               ,[SupplierMiddleName]
                               ,[SupplierEmail]
                               ,[SupplierCriticality]
                               ,[AdditionalInformations]
                               ,[IsActive]
                               ,[CreatedBy]
                               ,[CreatedOn]
                               ,[UpdatedBy]
                               ,[UpdatedOn])
                         VALUES
                               (@SupplierUniqueId
                               ,@supplierName
                               ,@SupplierContact
                               ,@SupplierFirstName
                               ,@SupplierLastName
                               ,@SupplierMiddleName
                               ,@SupplierEmail
                               ,@SupplierCriticality
                               ,@AdditionalInformations
                               ,@IsActive
                               ,@CreatedBy
                               ,@CreatedOn
                               ,@UpdatedBy
                               ,@UpdatedOn)
                        ";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, supplierEntity, transaction);
                        transaction.Commit();
                    }
                    catch(Exception ex)
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? supplierEntity : null;
        }

        /// <summary>
        /// Updates the supplier asynchronous.
        /// </summary>
        /// <param name="supplierId">The supplier identifier.</param>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<SupplierEntity> UpdateSupplierRowWiseAsync(int supplierId, SupplierEntity supplierEntity, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            var query = $@"
                    UPDATE [dbo].[SUPPLIER_INFORMATIONS]
                       SET 
                           [supplierName] = @supplierName
                          ,[SupplierContact] = @SupplierContact
                          ,[SupplierFirstName] = @SupplierFirstName
                          ,[SupplierLastName] = @SupplierLastName
                          ,[SupplierMiddleName] = @SupplierMiddleName
                          ,[SupplierEmail] = @SupplierEmail
                          ,[SupplierCriticality] = @SupplierCriticality
                          ,[AdditionalInformations] = @AdditionalInformations
                          ,[IsActive] = @IsActive
                          ,[CreatedBy] = @CreatedBy
                          ,[CreatedOn] = @CreatedOn
                          ,[UpdatedBy] = @UpdatedBy
                          ,[UpdatedOn] = @UpdatedOn
                     WHERE [Id] = ${supplierId}";
             

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, supplierEntity, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                }
                conection.Close();
            }
            return transactionState > 0 ? supplierEntity : null;
        }
    }
}
#endregion