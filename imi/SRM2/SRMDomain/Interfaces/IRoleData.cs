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
    public interface IRoleData
    {
        /// <summary>
        /// Saves the role asynchronous.
        /// </summary>
        /// <param name="role">The role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<Tuple<RoleDto, string>> SaveUpdateRoleAsync(RoleDto role, CancellationToken cancellationToken);
        /// <summary>
        /// Gets the roles asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<List<RoleDto>> GetRolesAsync(string assignedUserId, CancellationToken cancellationToken);
        /// <summary>
        /// Deletes the role asynchronous.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<bool> DeleteRoleAsync(string roleId, CancellationToken cancellationToken);
    }
}
#endregion