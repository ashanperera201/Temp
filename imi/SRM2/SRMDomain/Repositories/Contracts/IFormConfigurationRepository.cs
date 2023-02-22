#region Referemces
using SRMDomain.Entities;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion


#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public interface IFormConfigurationRepository
    {
        /// <summary>
        /// Saves the form configuration asynchronous.
        /// </summary>
        /// <param name="formConfiguration">The form configuration.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<FormConfigurationEntity> SaveFormConfigurationAsync(FormConfigurationEntity formConfiguration, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the form configurations asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<FormConfigurationEntity>> GetFormConfigurationsAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the name of the form configuration by module.
        /// </summary>
        /// <param name="filterKey">The filter key.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<FormConfigurationEntity> GetFormConfigurationFilterAsync(string filterKey, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the form configuration.
        /// </summary>
        /// <param name="configFormId">The configuration form identifier.</param>
        /// <param name="formConfiguration">The form configuration.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<FormConfigurationEntity> UpdateFormConfigurationAsync(int configFormId, FormConfigurationEntity formConfiguration, CancellationToken cancellationToken = default);
    }
}
#endregion