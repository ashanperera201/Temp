#region References
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Interfaces
{
    public interface ISupplierInformationService
    {

        /// <summary>
        /// Sends the supplier invitation asynchronous.
        /// </summary>
        /// <param name="supplierV2Dto">The supplier v2 dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<Object> SendSupplierInvitationAsync(SupplierV2Dto supplierV2Dto, CancellationToken cancellationToken = default);
        /// <summary>
        /// Saves the supplier asynchronous.
        /// </summary>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<SupplierV2Dto> SaveSupplierRowWiseAsync(SupplierV2Dto supplierEntity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the supplier asynchronous.
        /// </summary>
        /// <param name="supplierId">The supplier identifier.</param>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<SupplierV2Dto> UpdateSupplierRowWiseAsync(int supplierId, SupplierV2Dto supplierEntity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the supplier detail asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<SupplierV2Dto> GetSupplierDetailRowWiseAsync(string searchTerm, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the supplier details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<SupplierV2Dto>> GetSupplierDetailsRowWiseAsync(CancellationToken cancellationToken = default);
    }
}
#endregion
