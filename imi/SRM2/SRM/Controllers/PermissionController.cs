#region References
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SRMDomain.Data;
using SRMDomain.Interfaces;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [Route("api/permission")]
    public class PermissionController : Controller
    {
        /// <summary>
        /// The permission data
        /// </summary>
        private readonly IPermissionData _permissionData;
        /// <summary>
        /// Initializes a new instance of the <see cref="PermissionController"/> class.
        /// </summary>
        /// <param name="permissionData">The permission data.</param>
        public PermissionController(IPermissionData permissionData)
        {
            _permissionData = permissionData;
        }

        [HttpGet("get-config-by-role/{roleId}")]
        public async Task<IActionResult> GetVisibilityConfig(string roleId, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(roleId))
                {
                    return NotFound();
                }
                else
                {
                    var permissionConfigs = await _permissionData.GetVisibilityConfigBasedOnRole(roleId, cancellationToken);
                    if(permissionConfigs != null && permissionConfigs.Count > 0)
                    {
                        return StatusCode(StatusCodes.Status200OK, permissionConfigs);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status204NoContent);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(statusCode: StatusCodes.Status500InternalServerError, value: ex.Message);
            }
        }

        /// <summary>
        /// Saves the update visibility configuration asynchronous.
        /// </summary>
        /// <param name="permissionVisibilityConfig">The permission visibility configuration.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("save-udpate-visibility-config")]
        public async Task<IActionResult> SaveUpdateVisibilityConfigAsync([FromBody] PermissionVisibilityConfigDto permissionVisibilityConfig, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var savedResult = await _permissionData.permissionVisibilityConfigAsync(permissionVisibilityConfig, cancellationToken);
                    if (savedResult != null)
                    {
                        return StatusCode(StatusCodes.Status200OK, savedResult);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "Failed to save config.");
                    }

                }
                else
                {
                    return StatusCode(statusCode: StatusCodes.Status400BadRequest, value: ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(statusCode: StatusCodes.Status500InternalServerError, value: ex.Message);
            }
        }

        /// <summary>
        /// Saves the permission asynchronous.
        /// </summary>
        /// <param name="permission">The permission.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("save")]
        public async Task<IActionResult> SavePermissionAsync([FromBody] PermissionDto permission, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    return StatusCode(StatusCodes.Status200OK, await _permissionData.SaveUpdatePermissionAsync(permission, cancellationToken));
                }
                else
                {
                    return StatusCode(statusCode: StatusCodes.Status400BadRequest, value: ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(statusCode: StatusCodes.Status500InternalServerError, value: ex.Message);
            }
        }

        /// <summary>
        /// Updates the permission asynchronous.
        /// </summary>
        /// <param name="permission">The permission.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPut("update")]
        public async Task<IActionResult> UpdatePermissionAsync([FromBody] PermissionDto permission, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    return StatusCode(StatusCodes.Status200OK, await _permissionData.SaveUpdatePermissionAsync(permission, cancellationToken));
                }
                else
                {
                    return StatusCode(statusCode: StatusCodes.Status400BadRequest, value: ModelState.Values.Select(x => x.Errors));
                }
            }
            catch (Exception ex)
            {
                return StatusCode(statusCode: StatusCodes.Status500InternalServerError, value: ex.Message);
            }
        }


        /// <summary>
        /// Gets all permissions asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("get-all/{userId}")]
        public async Task<IActionResult> GetAllPermissionsAsync(string userId, CancellationToken cancellationToken)
        {
            try
            {
                if (string.IsNullOrEmpty(userId))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "User id is required.");
                }

                return StatusCode(StatusCodes.Status200OK, await _permissionData.GetPermissionsAsync(userId, cancellationToken));
            }
            catch (Exception ex)
            {
                return StatusCode(statusCode: StatusCodes.Status500InternalServerError, value: ex.Message);
            }
        }
    }
}
#endregion