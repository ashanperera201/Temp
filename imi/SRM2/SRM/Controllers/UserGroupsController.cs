#region References
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [ApiController]
    [Route("api/user-group")]
    public class UserGroupsController : Controller
    {
        /// <summary>
        /// The user group service
        /// </summary>
        private readonly IUserGroupService _userGroupService;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserGroupsController"/> class.
        /// </summary>
        /// <param name="userGroupService">The user group service.</param>
        public UserGroupsController(IUserGroupService userGroupService)
        {
            _userGroupService = userGroupService;
        }

        /// <summary>
        /// Saves the user group asynchronous.
        /// </summary>
        /// <param name="userGroupDto">The user group dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("save")]
        public async Task<IActionResult> SaveUserGroupAsync([FromBody] UserGroupDto userGroupDto, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var serviceRes = await _userGroupService.SaveUserGroupAsync(userGroupDto, cancellationToken);
                    if (serviceRes != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, serviceRes);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status422UnprocessableEntity, serviceRes);
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Updates the user group acync.
        /// </summary>
        /// <param name="userGroupDto">The user group dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPut("update")]
        public async Task<IActionResult> UpdateUserGroupAcync([FromBody] UserGroupDto userGroupDto, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var serviceRes = await _userGroupService.UpdateUserGroupAsync(userGroupDto, cancellationToken);
                    if (serviceRes != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, serviceRes);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status422UnprocessableEntity, serviceRes);
                    }
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Gets the user group details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("details")]
        public async Task<IActionResult> GetUserGroupDetailsAsync(CancellationToken cancellationToken)
        {
            try
            {
                var serviceRes = await _userGroupService.GetUserGroupDetailsAsync(cancellationToken);
                if (serviceRes != null)
                {
                    return StatusCode(StatusCodes.Status200OK, serviceRes);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, serviceRes);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Gets the user group asynchronous.
        /// </summary>
        /// <param name="uniqueId">The unique identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("{uniqueId}")]
        public async Task<IActionResult> GetUserGroupAsync(int uniqueId, CancellationToken cancellationToken)
        {
            try
            {
                if (uniqueId > 0)
                {
                    var serviceRes = await _userGroupService.GetUserGroupByIdAsync(uniqueId, cancellationToken);
                    return StatusCode(StatusCodes.Status200OK, serviceRes);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "User group id is required.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Clones the user group.
        /// </summary>
        /// <param name="userGroupName">Name of the user group.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("clone/{userGroupName}")]
        public async Task<IActionResult> CloneUserGroup(string userGroupName, CancellationToken cancellationToken)
        {
            try
            {
                if (!string.IsNullOrEmpty(userGroupName))
                {
                    var serviceRes = await _userGroupService.CloneUserGroup(userGroupName, cancellationToken);
                    return StatusCode(StatusCodes.Status200OK, serviceRes);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "User group id is required.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Users the details information asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("details-info")]
        public async Task<IActionResult> UserDetailsInfoAsync(CancellationToken cancellationToken)
        {
            try
            {
                var serviceRes = await _userGroupService.GetUserGroupDetailDtosAsync(cancellationToken);
                if(serviceRes != null && serviceRes.Count() > 0)
                {
                    return StatusCode(StatusCodes.Status200OK, serviceRes);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, serviceRes);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Saves the user detail information asynchronous.
        /// </summary>
        /// <param name="userGroupDetailDto">The user group detail dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("save-detail-info")]
        public async Task<IActionResult> SaveUserDetailInfoAsync([FromBody] UserGroupDetailDto userGroupDetailDto, CancellationToken cancellationToken)
        {
            try
            {
                var serviceRes = await _userGroupService.InsertGroupDetailAsync(userGroupDetailDto, cancellationToken);
                if (serviceRes != null)
                {
                    return StatusCode(StatusCodes.Status200OK, serviceRes);
                }
                else
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, serviceRes);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }

        /// <summary>
        /// Updates the user detail information asynchronous.
        /// </summary>
        /// <param name="userGroupDetailDto">The user group detail dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPut("update-detail-info")]
        public async Task<IActionResult> UpdateUserDetailInfoAsync([FromBody] UserGroupDetailDto userGroupDetailDto, CancellationToken cancellationToken)
        {
            try
            {
                var serviceRes = await _userGroupService.UpdateUserGroupDetailAsync(userGroupDetailDto, cancellationToken);
                if (serviceRes != null)
                {
                    return StatusCode(StatusCodes.Status200OK, serviceRes);
                }
                else
                {
                    return StatusCode(StatusCodes.Status204NoContent, serviceRes);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, ex);
            }
        }


    }
}
#endregion