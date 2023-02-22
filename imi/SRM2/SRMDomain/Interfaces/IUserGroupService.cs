#region References
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Interfaces
{
    public interface IUserGroupService
    {
        /// <summary>
        /// Saves the user group detail asynchronous.
        /// </summary>
        /// <param name="userGroupDetail">The user group detail.</param>
        /// <returns></returns>
        Task<UserGroupDetailDto> UpdateUserGroupDetailAsync(UserGroupDetailDto userGroupDetail, CancellationToken cancellationToken);
        /// <summary>
        /// Gets the user group detail dtos.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<UserGroupDetailDto>> GetUserGroupDetailDtosAsync(CancellationToken cancellationToken);
        /// <summary>
        /// Inserts the group detail asynchronous.
        /// </summary>
        /// <param name="groupDetail">The group detail.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupDetailDto> InsertGroupDetailAsync(UserGroupDetailDto groupDetail, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the user group details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<UserGroupDto>> GetUserGroupDetailsAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the user group by identifier asynchronous.
        /// </summary>
        /// <param name="Id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupDto> GetUserGroupByIdAsync(int Id, CancellationToken cancellationToken = default);
        /// <summary>
        /// Saves the user group asynchronous.
        /// </summary>
        /// <param name="userGroupDto">The user group dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupDto> SaveUserGroupAsync(UserGroupDto userGroupDto, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the user group asynchronous.
        /// </summary>
        /// <param name="userGroupDto">The user group dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserGroupDto> UpdateUserGroupAsync(UserGroupDto userGroupDto, CancellationToken cancellationToken = default);
        /// <summary>
        /// Clones the user group.
        /// </summary>
        /// <param name="userGroupId">The user group identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> CloneUserGroup(string userGroupName, CancellationToken cancellationToken = default);
    }
}
#endregion