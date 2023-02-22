#region Referencs
using SRMDomain.Entities;
using SRMDomain.Interfaces;
using SRMDomain.Repositories.Contracts;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
#endregion

#region Namespace
namespace SRMDomain.Services
{
    public class ProcessConfiguratorService : IProcessConfiguratorService
    {
        /// <summary>
        /// The process configurator repository
        /// </summary>
        private readonly IProcessConfiguratorRepository _processConfiguratorRepository;
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessConfiguratorService" /> class.
        /// </summary>
        /// <param name="processConfiguratorRepository">The process configurator repository.</param>
        /// <param name="entityMapper">The entity mapper.</param>
        public ProcessConfiguratorService(IProcessConfiguratorRepository processConfiguratorRepository, IEntityMapper entityMapper)
        {
            _processConfiguratorRepository = processConfiguratorRepository;
            _entityMapper = entityMapper;
        }

        /// <summary>
        /// Gets the process configurator asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorDto> GetProcessConfiguratorAsync(int id, CancellationToken cancellationToken = default)
        {
            try
            {
                var entityResult = await _processConfiguratorRepository.GetProcessConfiguratorAsync(id, cancellationToken);
                return _entityMapper.Map<ProcessConfiguratorEntity, ProcessConfiguratorDto>(entityResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the process configurator by phase one asynchronous.
        /// </summary>
        /// <param name="processName">Name of the process.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorDto> GetProcessConfiguratorByPhaseOneAsync(string processName, CancellationToken cancellationToken = default)
        {
            try
            {
                var entityResult = await _processConfiguratorRepository.GetProcessConfiguratorByPhaseOneAsync(processName, cancellationToken);
                return _entityMapper.Map<ProcessConfiguratorEntity, ProcessConfiguratorDto>(entityResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Determines whether [is process configurator exists asynchronous] [the specified process name].
        /// </summary>
        /// <param name="processName">Name of the process.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<bool> IsProcessConfiguratorExistsAsync(string processName, CancellationToken cancellationToken = default)
        {
            try
            {
                var entityResult = await _processConfiguratorRepository.IsProcessConfiguratorExistsAsync(processName, cancellationToken);
                return entityResult;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Saves the process configurator asynchronous.
        /// </summary>
        /// <param name="processConfigurator">The process configurator.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorDto> SaveProcessConfiguratorAsync(ProcessConfiguratorDto processConfigurator, CancellationToken cancellationToken = default)
        {
            try
            {
                processConfigurator.ProcessUniqueCode = Guid.NewGuid().ToString();
                var entity = _entityMapper.Map<ProcessConfiguratorDto, ProcessConfiguratorEntity>(processConfigurator);
                var savedResult = await _processConfiguratorRepository.SaveProcessConfiguratorAsync(entity, cancellationToken);
                return _entityMapper.Map<ProcessConfiguratorEntity, ProcessConfiguratorDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Updates the process configurator asynchronous.
        /// </summary>
        /// <param name="processConfiguratorEntity">The process configurator entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ProcessConfiguratorDto> updateProcessConfiguratorAsync(int id, ProcessConfiguratorDto processConfiguratorEntity, CancellationToken cancellationToken = default)
        {
            try
            {
                var entity = _entityMapper.Map<ProcessConfiguratorDto, ProcessConfiguratorEntity>(processConfiguratorEntity);
                var savedResult = await _processConfiguratorRepository.updateProcessConfiguratorAsync(id, entity, cancellationToken);
                return _entityMapper.Map<ProcessConfiguratorEntity, ProcessConfiguratorDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
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
        public async Task<IEnumerable<ProcessConfiguratorDto>> GetProcessConfiguratorsAsync(string searchTerm, int pageNo, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var entityResult = await _processConfiguratorRepository.GetProcessConfiguratorsAsync(searchTerm, pageNo, pageSize, cancellationToken);
                return _entityMapper.Map<IEnumerable<ProcessConfiguratorEntity>, IEnumerable<ProcessConfiguratorDto>>(entityResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion