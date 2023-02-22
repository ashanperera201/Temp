#region References
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SRMPublic.DTO;
#endregion


#region Namespace
namespace SRMDomain.Interfaces
{
    public interface IPermissionData
    {
        /// <summary>
        /// Permissions the visibility configuration asynchronous.
        /// </summary>
        /// <param name="permissionVisibilityConfig">The permission visibility configuration.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<PermissionVisibilityConfigDto> permissionVisibilityConfigAsync(PermissionVisibilityConfigDto permissionVisibilityConfig, CancellationToken cancellationToken);
        /// <summary>
        /// Saves the permission asynchronous.
        /// </summary>
        /// <param name="permission">The permission.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>
        ///   <br />
        /// </returns>
        public Task<PermissionDto> SaveUpdatePermissionAsync(PermissionDto permission, CancellationToken cancellationToken);
        /// <summary>
        /// Deletes the permission.
        /// </summary>
        /// <param name="permissionCode">The permission code.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<Tuple<string, bool>> DeletePermissionAsync(string permissionCode, CancellationToken cancellationToken);
        /// <summary>
        /// Filters the permission asynchronous.
        /// </summary>
        /// <param name="permissions">The permissions.</param>
        /// <returns></returns>
        public Task<List<PermissionDto>> FilterPermissionAsync(params PermissionDto[] permissions);
        /// <summary>
        /// Gets the permissions asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<List<PermissionDto>> GetPermissionsAsync(string assignedUserId, CancellationToken cancellationToken);
        /// <summary>
        /// Gets the visibility configuration based on role.
        /// </summary>
        /// <param name="roleId">The role identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public Task<List<PermissionVisibilityConfigDto>> GetVisibilityConfigBasedOnRole(string roleId, CancellationToken cancellationToken);

    }
}
#endregion