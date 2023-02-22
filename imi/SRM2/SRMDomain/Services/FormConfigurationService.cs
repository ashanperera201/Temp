#region References
using SRMDomain.Entities;
using SRMDomain.Interfaces;
using SRMDomain.Repositories.Contracts;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion


#region Namespace
namespace SRMDomain.Services
{
    public class FormConfigurationService : IFormConfigurationService
    {
        /// <summary>
        /// The form configuration repository
        /// </summary>
        private readonly IFormConfigurationRepository _formConfigurationRepository;
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// Initializes a new instance of the <see cref="FormConfigurationService" /> class.
        /// </summary>
        /// <param name="formConfigurationRepository">The form configuration repository.</param>
        /// <param name="entityMapper">The entity mapper.</param>
        public FormConfigurationService(IFormConfigurationRepository formConfigurationRepository, IEntityMapper entityMapper)
        {
            _formConfigurationRepository = formConfigurationRepository;
            _entityMapper = entityMapper;
        }
        /// <summary>
        /// Gets all configuration asynchronous.
        /// </summary>
        /// <returns></returns>
        public async Task<IEnumerable<FormConfigurationDto>> GetAllConfigurationAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var results = await _formConfigurationRepository.GetFormConfigurationsAsync(cancellationToken);
                return _entityMapper.Map<IEnumerable<FormConfigurationEntity>, IEnumerable<FormConfigurationDto>>(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the form configuration by module name asynchronous.
        /// </summary>
        /// <param name="moduleName">Name of the module.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<FormConfigurationDto> GetFormConfigurationByFilterAsync(string filterTerm, CancellationToken cancellationToken = default)
        {
            try
            {
                var results = await _formConfigurationRepository.GetFormConfigurationFilterAsync(filterTerm, cancellationToken);
                return _entityMapper.Map<FormConfigurationEntity, FormConfigurationDto>(results);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Saves the configuration asynchronous.
        /// </summary>
        /// <param name="formConfigurationDto">The form configuration dto.</param>
        /// <returns></returns>
        public async Task<FormConfigurationDto> SaveConfigurationAsync(FormConfigurationDto formConfigurationDto, CancellationToken cancellationToken = default)
        {
            try
            {
                var existingConfiguration = await GetFormConfigurationByFilterAsync(formConfigurationDto.ProcessStep);

                if (existingConfiguration != null)
                {
                    existingConfiguration.ConfigurationCode = formConfigurationDto.ConfigurationCode;
                    existingConfiguration.ConfigurationName = formConfigurationDto.ConfigurationName;
                    existingConfiguration.Module = formConfigurationDto.Module;
                    existingConfiguration.Configuration = formConfigurationDto.Configuration;
                    existingConfiguration.ElementCount = formConfigurationDto.ElementCount;
                    existingConfiguration.ElementItem = formConfigurationDto.ElementItem;

                    var mappedEntity = _entityMapper.Map<FormConfigurationDto, FormConfigurationEntity>(existingConfiguration);
                    var updatedResult = await _formConfigurationRepository.UpdateFormConfigurationAsync(existingConfiguration.Id, mappedEntity, cancellationToken);
                    return _entityMapper.Map<FormConfigurationEntity, FormConfigurationDto>(updatedResult);
                }
                else
                {
                    var mappedEntity = _entityMapper.Map<FormConfigurationDto, FormConfigurationEntity>(formConfigurationDto);
                    var savedResults = await _formConfigurationRepository.SaveFormConfigurationAsync(mappedEntity, cancellationToken);
                    return _entityMapper.Map<FormConfigurationEntity, FormConfigurationDto>(savedResults);
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Updates the form configuration by identifier.
        /// </summary>
        /// <param name="configurationFormId">The configuration form identifier.</param>
        /// <param name="formConfigurationDto">The form configuration dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<FormConfigurationDto> UpdateFormConfigurationByIdAsync(int configurationFormId, FormConfigurationDto formConfigurationDto, CancellationToken cancellationToken = default)
        {
            try
            {
                var mappedEntity = _entityMapper.Map<FormConfigurationDto, FormConfigurationEntity>(formConfigurationDto);
                var savedResults = await _formConfigurationRepository.UpdateFormConfigurationAsync(configurationFormId, mappedEntity, cancellationToken);
                return _entityMapper.Map<FormConfigurationEntity, FormConfigurationDto>(savedResults);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion