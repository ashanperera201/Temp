#region References
using SRMPublic.DTO;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Data.Interfaces
{
    public interface ISrmUserData
    {
        /// <summary>
        /// Abps the user create asynchronous.
        /// </summary>
        /// <param name="users">The users.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<AbpUsers> AbpUserCreateAsync(AbpUsers users, CancellationToken cancellationToken);
        /// <summary>
        /// SRMs the user save asynchronous.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        Task<SrmUserDto> SrmUserSaveAsync(SrmUserDto user, CancellationToken cancellationToken = default);
        /// <summary>
        /// SRMs the user update asynchronous.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <returns></returns>
        Task<SrmUserDto> SrmUserUpdateAsync(SrmUserDto user, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the SRM user details asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<List<SrmUserDto>> GetSrmUserDetailsAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the SRM user asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        Task<SrmUserDto> GetSrmUserAsync(string userId, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the SRM user asynchronous.
        /// </summary>
        /// <param name="srmUserFilter">The SRM user filter.</param>
        /// <returns></returns>
        Task<SrmUserDto> FilterSrmUserAsync(SrmUserFilterDto srmUserFilter, CancellationToken cancellationToken = default);
        /// <summary>
        /// SRMs the user delete asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        Task<bool> SrmUserDeleteAsync(string userId, CancellationToken cancellationToken = default);
        /// <summary>
        /// Saves the user log asynchronous.
        /// </summary>
        /// <param name="userLog">The user log.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<UserLogDto> SaveUserLogAsync(UserLogDto userLog, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the user logs asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<List<UserLogDto>> GetUserLogsAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Saves the user rle assign log asynchronous.
        /// </summary>
        /// <param name="assignRoleLog">The assign role log.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<AssignRoleLog> SaveUserRleAssignLogAsync(AssignRoleLog assignRoleLog, CancellationToken cancellationToken = default);

        /// <summary>
        /// Assigns the user role asynchronous.
        /// </summary>
        /// <param name="assignRole">The assign role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<AssignRoleDto> AssignUserRoleAsync(AssignRoleDto assignRole, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the assigned roles.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<List<AssignRoleDto>> GetAssignedRoles(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the assigned role logs asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<List<AssignRoleLog>> GetAssignedRoleLogsAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets the workflow users asynchronous.
        /// </summary>
        /// <returns></returns>
        Task<List<AbpUsers>> GetWorkflowUsersAsync();
    }
}
#endregion