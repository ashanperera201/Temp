#region References
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SRMDomain.Entities;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public interface IUserGroupRepository
    {
        /// <summary>
        /// Saves the user group asynchronous.
        /// </summary>
        /// <param name="userGroup">The user group.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupEntity> SaveUserGroupAsync(UserGroupEntity userGroup, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the user group asynchronous.
        /// </summary>
        /// <param name="userGroup">The user group.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupEntity> UpdateUserGroupAsync(UserGroupEntity userGroup, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the user group details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<UserGroupEntity>> GetUserGroupDetailsAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the user group detail asynchronous.
        /// </summary>
        /// <param name="userGroupId">The user group identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupEntity> GetUserGroupDetailAsync(int userGroupId, CancellationToken cancellationToken = default);
        /// <summary>
        /// Clones the user group asynchronous.
        /// </summary>
        /// <param name="userGroupId">The user group identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> CloneUserGroupAsync(string userGroupName, CancellationToken cancellationToken = default);
        /// <summary>
        /// Adds the user group details asynchronous.
        /// </summary>
        /// <param name="userGroupDetail">The user group detail.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupDetail> InsertUserGroupDetailsAsync(UserGroupDetail userGroupDetail, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the user group detail information asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<UserGroupDetail>> GetUserGroupDetailInfoAsync(CancellationToken cancellationToken);
        /// <summary>
        /// Updates the user group detail infor asynchronous.
        /// </summary>
        /// <param name="userGroupDetail">The user group detail.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupDetail> UpdateUserGroupDetailInforAsync(UserGroupDetail userGroupDetail, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes the user group asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<int> DeleteUserGroupAsync(int id, CancellationToken cancellationToken);
    }
}
#endregion
