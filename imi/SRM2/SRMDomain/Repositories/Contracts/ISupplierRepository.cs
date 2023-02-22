#region References
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SRMDomain.Entities;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts.Implementations
{
    public interface ISupplierRepository
    {
        /// <summary>
        /// Saves the supplier asynchronous.
        /// </summary>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<SupplierEntity> SaveSupplierRowWiseAsync(SupplierEntity supplierEntity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the supplier asynchronous.
        /// </summary>
        /// <param name="supplierEntity">The supplier entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<SupplierEntity> UpdateSupplierRowWiseAsync(int supplierId, SupplierEntity supplierEntity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the supplier detail asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<SupplierEntity> GetSupplierDetailRowWiseAsync(string searchTerm, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the supplier details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<SupplierEntity>> GetSupplierDetailsRowWiseAsync(CancellationToken cancellationToken = default);
    }
}
#endregion