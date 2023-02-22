﻿#region References
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SRMDomain.Entities;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public interface IProcessConfiguratorRepository
    {

        /// <summary>
        /// Gets the process configurator by name asynchronous.
        /// </summary>
        /// <param name="processName">Name of the process.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ProcessConfiguratorEntity> GetProcessConfiguratorByPhaseOneAsync(string processName, CancellationToken cancellationToken = default);

        /// <summary>
        /// Saves the process configurator asynchronous.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ProcessConfiguratorEntity> SaveProcessConfiguratorAsync(ProcessConfiguratorEntity entity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the process configurator asynchronous.
        /// </summary>
        /// <param name="processConfiguratorEntity">The process configurator entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ProcessConfiguratorEntity> updateProcessConfiguratorAsync(int id, ProcessConfiguratorEntity processConfiguratorEntity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Determines whether [is process configurator exists asynchronous] [the specified process name].
        /// </summary>
        /// <param name="processName">Name of the process.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> IsProcessConfiguratorExistsAsync(string processName, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the process configurators asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="pageNo">The page no.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<ProcessConfiguratorEntity>> GetProcessConfiguratorsAsync(string searchTerm, int pageNo, int pageSize = 10, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the process configurator asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ProcessConfiguratorEntity> GetProcessConfiguratorAsync(int id, CancellationToken cancellationToken = default);
    }
}
#endregion