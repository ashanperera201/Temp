#region References
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts;
using Dapper;
using System.Collections.Generic;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Implementations
{
    public class ProcessConfiguratorRepository : IProcessConfiguratorRepository
    {

        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessConfiguratorRepository" /> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public ProcessConfiguratorRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }

        /// <summary>
        /// Gets the process configurator asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorEntity> GetProcessConfiguratorAsync(int id, CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT [Id]
                                      ,[ProcessUniqueCode]
                                      ,[ProcessName]
                                      ,[ProcessDescription]
                                      ,[PhaseOne]
                                      ,[PhaseTwo]
                                      ,[PhaseThree]
                                      ,[IsActive]
                                      ,[CreatedBy]
                                      ,[CreatedOn]
                                      ,[UpdatedBy]
                                      ,[UpdatedOn]
                               FROM [dbo].[PROCESS_CONFIGURATOR]
                               WHERE [Id]='{id}'";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<ProcessConfiguratorEntity>(query, cancellationToken))?.FirstOrDefault();
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Gets the process configurator by name asynchronous.
        /// </summary>
        /// <param name="processName">Name of the process.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorEntity> GetProcessConfiguratorByPhaseOneAsync(string processName, CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT [Id]
                                      ,[ProcessUniqueCode]
                                      ,[ProcessName]
                                      ,[ProcessDescription]
                                      ,[PhaseOne]
                                      ,[PhaseTwo]
                                      ,[PhaseThree]
                                      ,[IsActive]
                                      ,[CreatedBy]
                                      ,[CreatedOn]
                                      ,[UpdatedBy]
                                      ,[UpdatedOn]
                               FROM [dbo].[PROCESS_CONFIGURATOR]
                               WHERE [PhaseOne]='{processName}'";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<ProcessConfiguratorEntity>(query, cancellationToken))?.FirstOrDefault();
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Gets the process configurators asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="pageNo">The page no.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<ProcessConfiguratorEntity>> GetProcessConfiguratorsAsync(string searchTerm, int pageNo, int pageSize = 10, CancellationToken cancellationToken = default)
        {
            string query = $@"
                              SELECT [Id]
                                  ,[ProcessUniqueCode]
                                  ,[ProcessName]
                                  ,[ProcessDescription]
                                  ,[PhaseOne]
                                  ,[PhaseTwo]
                                  ,[PhaseThree]
                                  ,[IsActive]
                                  ,[CreatedBy]
                                  ,[CreatedOn]
                                  ,[UpdatedBy]
                                  ,[UpdatedOn]
                              FROM [dbo].[PROCESS_CONFIGURATOR]
                              WHERE 
                                    [ProcessName] LIKE '%{searchTerm}%'
                              ORDER BY [CreatedOn] DESC
                              OFFSET {pageNo} ROWS
                              FETCH NEXT {pageSize} ROWS ONLY
                            ";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<ProcessConfiguratorEntity>(query, cancellationToken));
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Determines whether [is process configurator exists asynchronous] [the specified process name].
        /// </summary>
        /// <param name="processName">Name of the process.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>
        ///   <c>true</c> if [is process configurator exists asynchronous] [the specified process name]; otherwise, <c>false</c>.
        /// </returns>
        public async Task<bool> IsProcessConfiguratorExistsAsync(string processName, CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT [Id]
                              FROM [dbo].[PROCESS_CONFIGURATOR]
                              WHERE [ProcessName]='{processName}'";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<ProcessConfiguratorEntity>(query, cancellationToken))?.FirstOrDefault();
                connection.Close();
                return result != null ? true : false;
            }
        }

        /// <summary>
        /// Saves the process configurator asynchronous.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorEntity> SaveProcessConfiguratorAsync(ProcessConfiguratorEntity entity, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            string query = $@"
                        INSERT INTO [dbo].[PROCESS_CONFIGURATOR]
                                   ([ProcessUniqueCode]
                                   ,[ProcessName]
                                   ,[ProcessDescription]
                                   ,[PhaseOne]
                                   ,[PhaseTwo]
                                   ,[PhaseThree]
                                   ,[IsActive]
                                   ,[CreatedBy]
                                   ,[CreatedOn]
                                   ,[UpdatedBy]
                                   ,[UpdatedOn])
                             VALUES
                                   (@ProcessUniqueCode
                                   ,@ProcessName
                                   ,@ProcessDescription
                                   ,@PhaseOne
                                   ,@PhaseTwo
                                   ,@PhaseThree
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
                        transactionState = await conection.ExecuteAsync(query, entity, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? entity : null;
        }

        /// <summary>
        /// Updates the process configurator asynchronous.
        /// </summary>
        /// <param name="processConfiguratorEntity">The process configurator entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorEntity> updateProcessConfiguratorAsync(int id, ProcessConfiguratorEntity processConfiguratorEntity, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            string query = $@"
                UPDATE [dbo].[PROCESS_CONFIGURATOR]
                   SET [ProcessUniqueCode] = @ProcessUniqueCode
                      ,[ProcessName] = @ProcessName
                      ,[ProcessDescription] = @ProcessDescription
                      ,[PhaseOne] =@PhaseOne
                      ,[PhaseTwo] = @PhaseTwo
                      ,[PhaseThree] = @PhaseThree
                      ,[IsActive] = @IsActive
                 WHERE Id = {id}";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, processConfiguratorEntity, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? processConfiguratorEntity : null;
        }
    }
}
#endregion