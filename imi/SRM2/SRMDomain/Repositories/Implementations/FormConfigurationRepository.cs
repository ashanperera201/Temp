#region References
using Dapper;
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion


#region Namespace
namespace SRMDomain.Repositories.Implementations
{
    public class FormConfigurationRepository : IFormConfigurationRepository
    {
        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;
        /// <summary>
        /// Initializes a new instance of the <see cref="FormConfigurationRepository"/> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public FormConfigurationRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }

        /// <summary>
        /// Gets the name of the form configuration by module.
        /// </summary>
        /// <param name="configCode"></param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<FormConfigurationEntity> GetFormConfigurationFilterAsync(string filterKey, CancellationToken cancellationToken = default)
        {
            string query = $@"
                            SELECT 
                                [Id],
                                [ConfigurationCode],
                                [ConfigurationName],
                                [Module],
                                [ElementItem],
                                [ElementCount],
                                [Configuration],
                                [ProcessStep] 
                            FROM 
                                [dbo].[FORM_CONFIGURATION] 
                            WHERE 
                                [ConfigurationCode]='{filterKey}' OR 
                                [ConfigurationName]='{filterKey}' OR 
                                [Module]='{filterKey}' OR
                                [ProcessStep]='{filterKey}'";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<FormConfigurationEntity>(query, cancellationToken)).FirstOrDefault();
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Gets the form configurations asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<FormConfigurationEntity>> GetFormConfigurationsAsync(CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT [Id],[ConfigurationCode],[ConfigurationName],[Module],[ElementItem],[ElementCount],[Configuration],[ProcessStep] FROM [dbo].[FORM_CONFIGURATION]";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<FormConfigurationEntity>(query, cancellationToken));
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Saves the form configuration asynchronous.
        /// </summary>
        /// <param name="formConfiguration">The form configuration.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<FormConfigurationEntity> SaveFormConfigurationAsync(FormConfigurationEntity formConfiguration, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            string query = $@"
                        INSERT INTO [dbo].[FORM_CONFIGURATION]
                                   ([ConfigurationCode]
                                   ,[ConfigurationName]
                                   ,[Module]
                                   ,[ElementItem]
                                   ,[ElementCount]
                                   ,[Configuration]
                                   ,[ProcessStep])
                             VALUES
                                   (@ConfigurationCode,
                                    @ConfigurationName,
                                    @Module,
                                    @ElementItem,
                                    @ElementCount,
                                    @Configuration,
                                    @ProcessStep)";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, formConfiguration, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? formConfiguration : null;
        }

        /// <summary>
        /// Updates the form configuration.
        /// </summary>
        /// <param name="configFormId">The configuration form identifier.</param>
        /// <param name="formConfiguration">The form configuration.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<FormConfigurationEntity> UpdateFormConfigurationAsync(int configFormId, FormConfigurationEntity formConfiguration, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            var query = $@"
                    UPDATE [dbo].[FORM_CONFIGURATION]
                       SET [ConfigurationCode] = @ConfigurationCode,
                           [ConfigurationName] = @ConfigurationName,
                           [Module] = @Module,
	                       [ElementItem] = @ElementItem,
	                       [ElementCount] = @ElementCount,
	                       [Configuration] = @Configuration,
                           [ProcessStep] = @ProcessStep
                    WHERE [Id] = ${configFormId}";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, formConfiguration, transaction);
                        transaction.Commit();
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                }
                conection.Close();
            }
            return transactionState > 0 ? formConfiguration : null;
        }
    }
}
#endregion