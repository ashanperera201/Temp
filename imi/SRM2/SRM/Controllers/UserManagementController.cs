#region References
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.Data.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [Route("api/users")]
    public class UserManagementController : Controller
    {
        /// <summary>
        /// The SRM user data
        /// </summary>
        private readonly ISrmUserData _srmUserData;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserManagementController"/> class.
        /// </summary>
        /// <param name="srmUserData">The SRM user data.</param>
        public UserManagementController(ISrmUserData srmUserData)
        {
            _srmUserData = srmUserData;
        }

        [HttpPost("create/imi-user")]
        public async Task<IActionResult> CreateImiUserAsync([FromBody] AbpUsers abpUsers, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var savedUser = await _srmUserData.AbpUserCreateAsync(abpUsers, cancellationToken);
                    if(savedUser != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, savedUser);
                    }
                    return StatusCode(StatusCodes.Status400BadRequest);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Creates the user asynchronous.
        /// </summary>
        /// <param name="srmUser">The SRM user.</param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<IActionResult> CreateUserAsync([FromBody] SrmUserDto srmUser, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var savedUserResult = await _srmUserData.SrmUserSaveAsync(srmUser, cancellationToken);
                    if (savedUserResult != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, savedUserResult);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status412PreconditionFailed, "Failed to save user.");
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Updates the user asynchronous.
        /// </summary>
        /// <param name="srmUser">The SRM user.</param>
        /// <returns></returns>
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] SrmUserDto srmUser, CancellationToken cancellationToken)
        {

            try
            {
                if (ModelState.IsValid)
                {
                    var updatedUserResult = await _srmUserData.SrmUserUpdateAsync(srmUser, cancellationToken);
                    if (updatedUserResult != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, updatedUserResult);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status412PreconditionFailed, "Failed to update user.");
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Gets the user asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserAsync(string userId, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "User id is required.");
                }
                else
                {
                    var srmUserResult = await _srmUserData.GetSrmUserAsync(userId, cancellationToken);
                    if (srmUserResult != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, srmUserResult);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status204NoContent, null);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Filters the user asynchronous.
        /// </summary>
        /// <param name="srmUserFilter">The SRM user filter.</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> FilterUserAsync([FromQuery] SrmUserFilterDto srmUserFilter, CancellationToken cancellationToken)
        {
            try
            {
                var users = await _srmUserData.FilterSrmUserAsync(srmUserFilter, cancellationToken);
                if (users != null)
                {
                    return StatusCode(StatusCodes.Status200OK, users);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, null);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Deletes the user asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns></returns>
        [HttpDelete("delete/{userId}")]
        public async Task<IActionResult> DeleteUserAsync(string userId, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "User id is required.");
                }
                else
                {
                    var deletedResult = await _srmUserData.SrmUserDeleteAsync(userId, cancellationToken);
                    return StatusCode(StatusCodes.Status200OK, deletedResult);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Fetches the users.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("fetch-all")]
        public async Task<IActionResult> FetchUsers(CancellationToken cancellationToken)
        {
            try
            {
                var userList = await _srmUserData.GetSrmUserDetailsAsync(cancellationToken);
                return StatusCode(StatusCodes.Status200OK, userList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Fetches the user log asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("fetch-user-logs")]
        public async Task<IActionResult> FetchUserLogAsync(CancellationToken cancellationToken)
        {
            try
            {
                var userLogList = await _srmUserData.GetUserLogsAsync(cancellationToken);
                return StatusCode(StatusCodes.Status200OK, userLogList);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Assigns the role asynchronous.
        /// </summary>
        /// <param name="assignRoleDto">The assign role dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRoleAsync([FromBody] List<AssignRoleDto> assignRoleDtos, CancellationToken cancellationToken)
        {
            try
            {
                for (int i = 0; i < assignRoleDtos.Count; i++)
                {
                    await _srmUserData.AssignUserRoleAsync(assignRoleDtos[i], cancellationToken);
                }
                await _srmUserData.SaveUserRleAssignLogAsync(assignRoleDtos[0].AssignRoleLog, cancellationToken);
                return StatusCode(StatusCodes.Status200OK, assignRoleDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Gets the assign roles asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("assigned-roles")]
        public async Task<IActionResult> GetAssignRolesAsync(CancellationToken cancellationToken)
        {
            try
            {
                return StatusCode(StatusCodes.Status200OK, await _srmUserData.GetAssignedRoles(cancellationToken));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Gets the assign logs asynchronous.
        /// </summary>
        /// <returns></returns>
        [HttpGet("assign-logs")]
        public async Task<IActionResult> GetAssignLogsAsync()
        {
            try
            {
                var assignedLogs = await _srmUserData.GetAssignedRoleLogsAsync();
                return StatusCode(StatusCodes.Status200OK, assignedLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("workflow-module")]
        public async Task<IActionResult> GetWorkflowUsersAsync()
        {
            try
            {
                var assignedLogs = await _srmUserData.GetWorkflowUsersAsync();
                return StatusCode(StatusCodes.Status200OK, assignedLogs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
#endregion
