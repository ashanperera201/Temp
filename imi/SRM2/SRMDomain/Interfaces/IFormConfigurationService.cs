#region References
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace

namespace SRMDomain.Interfaces
{
    public interface IFormConfigurationService
    {
        /// <summary>
        /// Saves the configuration asynchronous.
        /// </summary>
        /// <param name="formConfigurationDto">The form configuration dto.</param>
        /// <returns></returns>
        Task<FormConfigurationDto> SaveConfigurationAsync(FormConfigurationDto formConfigurationDto, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets all configuration asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<IEnumerable<FormConfigurationDto>> GetAllConfigurationAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the form configuration by module name asynchronous.
        /// </summary>
        /// <param name="moduleName">Name of the module.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<FormConfigurationDto> GetFormConfigurationByFilterAsync(string filterKey, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the form configuration by identifier.
        /// </summary>
        /// <param name="configurationFormId">The configuration form identifier.</param>
        /// <param name="formConfigurationDto">The form configuration dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<FormConfigurationDto> UpdateFormConfigurationByIdAsync(int configurationFormId, FormConfigurationDto formConfigurationDto, CancellationToken cancellationToken = default);
    }
}
#endregion