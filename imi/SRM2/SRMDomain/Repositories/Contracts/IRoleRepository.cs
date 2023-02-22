#region References
using SRMDomain.Entities;
using SRMPublic.DTO;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public interface IRoleRepository
    {
        /// <summary>
        /// Gets the role by code asynchronous.
        /// </summary>
        /// <param name="roleCode">The role code.</param>
        /// <returns></returns>
        Task<IEnumerable<RoleEntity>> GetRoleByCodeAsync(string roleCode, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes the role asynchronous.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> DeleteRoleAsync(string roleId, CancellationToken cancellationToken);
        /// <summary>
        /// Gets the roles asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<RoleEntity>> GetRolesAsync(string assignedUserId, CancellationToken cancellationToken);
        /// <summary>
        /// Saves the update role asynchronous.
        /// </summary>
        /// <param name="role">The role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<RoleEntity> SaveUpdateRoleAsync(RoleEntity role, CancellationToken cancellationToken);
    }
}
#endregion
