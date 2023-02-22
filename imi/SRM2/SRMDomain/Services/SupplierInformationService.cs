#region References
using SRMDomain.Entities;
using SRMDomain.External.Services.Contracts;
using SRMDomain.Interfaces;
using SRMDomain.Repositories.Contracts.Implementations;
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
    public class SupplierInformationService : ISupplierInformationService
    {
        /// <summary>
        /// The supplier repository
        /// </summary>
        private readonly ISupplierRepository _supplierRepository;
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// The supplier email service
        /// </summary>
        private readonly ISupplierEmailService _supplierEmailService;
        /// <summary>
        /// The email configuration
        /// </summary>
        private readonly EmailConfigDto _emailConfig;
        /// <summary>
        /// Initializes a new instance of the <see cref="SupplierInformationService" /> class.
        /// </summary>
        /// <param name="supplierRepository">The supplier repository.</param>
        /// <param name="entityMapper">The entity mapper.</param>
        /// <param name="supplierEmailService">The supplier email service.</param>
        /// <param name="emailConfig">The email configuration.</param>
        public SupplierInformationService(ISupplierRepository supplierRepository, IEntityMapper entityMapper, ISupplierEmailService supplierEmailService, EmailConfigDto emailConfig)
        {
            _supplierRepository = supplierRepository;
            _entityMapper = entityMapper;
            _supplierEmailService = supplierEmailService;
            _emailConfig = emailConfig;
        }

        /// <summary>
        /// Sends the supplier invitation asynchronous.
        /// </summary>
        /// <param name="supplierV2Dto">The supplier v2 dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<object> SendSupplierInvitationAsync(SupplierV2Dto supplierV2Dto, CancellationToken cancellationToken = default)
        {
            try
            {
                var savedResult = await SaveSupplierRowWiseAsync(supplierV2Dto, cancellationToken);

                if (savedResult != null && !string.IsNullOrEmpty(savedResult.SupplierUniqueId))
                {
                    var emailLink = $"{_emailConfig.EmailLink}/{savedResult.SupplierUniqueId}";

                    string emailBody =
                         $@"
                            <html>
                              <body>
                                <p>Hi Supplier,</p>
                                <p>You have being invited to supplier registration please click this <a href='{emailLink}'>link</a>,
                                <p>Thank & Regards></p>
                              </body>
                            </html>
                          ";


                    var mailInfo = new EmailDto
                    {
                        To = new List<string> { supplierV2Dto.SupplierEmail },
                        Bcc = null,
                        Cc = new List<string> { },
                        Body = emailBody,
                        Subject = "Invitation"
                    };

                    var sentResult = _supplierEmailService.SendEmailAsync(mailInfo);
                    return sentResult;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the supplier detail asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<SupplierV2Dto> GetSupplierDetailRowWiseAsync(string searchTerm, CancellationToken cancellationToken = default)
        {
            try
            {
                var entityResult = await _supplierRepository.GetSupplierDetailRowWiseAsync(searchTerm, cancellationToken);
                return _entityMapper.Map<SupplierEntity, SupplierV2Dto>(entityResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the supplier details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<SupplierV2Dto>> GetSupplierDetailsRowWiseAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var entityResult = await _supplierRepository.GetSupplierDetailsRowWiseAsync(cancellationToken);
                return _entityMapper.Map<IEnumerable<SupplierEntity>, IEnumerable<SupplierV2Dto>>(entityResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Saves the supplier asynchronous.
        /// </summary>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<SupplierV2Dto> SaveSupplierRowWiseAsync(SupplierV2Dto supplierEntity, CancellationToken cancellationToken = default)
        {
            try
            {
                var existsSupplier = await GetSupplierDetailRowWiseAsync(supplierEntity.SupplierEmail, cancellationToken);

                if (existsSupplier != null)
                {
                    existsSupplier.supplierName = supplierEntity.supplierName;
                    existsSupplier.SupplierEmail = supplierEntity.SupplierEmail;
                    existsSupplier.SupplierFirstName = supplierEntity.SupplierFirstName;
                    existsSupplier.SupplierMiddleName = supplierEntity.SupplierMiddleName;
                    existsSupplier.SupplierLastName = supplierEntity.SupplierLastName;

                    var updatedResult = await _supplierRepository.UpdateSupplierRowWiseAsync(existsSupplier.Id, _entityMapper.Map<SupplierV2Dto, SupplierEntity>(existsSupplier), cancellationToken);
                    return _entityMapper.Map<SupplierEntity, SupplierV2Dto>(updatedResult);
                }
                else
                {
                    supplierEntity.SupplierUniqueId = Guid.NewGuid().ToString();
                    supplierEntity.CreatedOn = DateTime.UtcNow;
                    // TODO : STATE LOGGED USER.
                    supplierEntity.CreatedBy = "user";
                    var savedResult = await _supplierRepository.SaveSupplierRowWiseAsync(_entityMapper.Map<SupplierV2Dto, SupplierEntity>(supplierEntity), cancellationToken);
                    return _entityMapper.Map<SupplierEntity, SupplierV2Dto>(savedResult);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Updates the supplier asynchronous.
        /// </summary>
        /// <param name="supplierId">The supplier identifier.</param>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<SupplierV2Dto> UpdateSupplierRowWiseAsync(int supplierId, SupplierV2Dto supplierEntity, CancellationToken cancellationToken = default)
        {
            try
            {
                supplierEntity.SupplierUniqueId = Guid.NewGuid().ToString();
                var entity = _entityMapper.Map<SupplierV2Dto, SupplierEntity>(supplierEntity);
                var savedResult = await _supplierRepository.UpdateSupplierRowWiseAsync(supplierId, entity, cancellationToken);
                return _entityMapper.Map<SupplierEntity, SupplierV2Dto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion
