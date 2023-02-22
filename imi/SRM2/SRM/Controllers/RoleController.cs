#region References
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.Interfaces;
using SRMDomain.Services.Interfaces;
using SRMPublic.DTO;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [ApiController]
    [Route("api/roles")]
    public class RoleController : Controller
    {
        private readonly IRoleService _roleService;
        /// <summary>
        /// The role data
        /// </summary>
        private readonly IRoleData _roleData;
        /// <summary>
        /// Initializes a new instance of the <see cref="RoleController"/> class.
        /// </summary>
        /// <param name="roleData">The role data.</param>
        public RoleController(IRoleData roleData, IRoleService roleService)
        {
            _roleData = roleData;
            _roleService = roleService;
        }

        /// <summary>
        /// Filters the role by code asynchronous.
        /// </summary>
        /// <param name="roleCode">The role code.</param>
        /// <returns></returns>
        [HttpGet("filter-by-code/{roleCode}")]
        public async Task<IActionResult> FilterRoleByCodeAsync(string roleCode)
        {
            try
            {
                if (string.IsNullOrEmpty(roleCode))
                {
                    return BadRequest("Role code is required.");
                }
                else
                {
                    var roles = await _roleService.GetRoleByCode(roleCode);
                    if(roles != null && roles.Count > 0)
                    {
                        return StatusCode(StatusCodes.Status200OK, roles);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status204NoContent, roles);
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Saves the role asynchronous.
        /// </summary>
        /// <param name="role">The role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("create")]
        public async Task<IActionResult> SaveRoleAsync([FromBody] RoleDto role, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var savedResponse = await _roleData.SaveUpdateRoleAsync(role, cancellationToken);
                    if (savedResponse != null && savedResponse.Item1 == null)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, savedResponse.Item2);
                    }
                    else
                    {
                        return StatusCode(StatusCodes.Status200OK, savedResponse);
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
        /// Updates the role asynchronous.
        /// </summary>
        /// <param name="role">The role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPut("update")]
        public async Task<IActionResult> UpdateRoleAsync([FromBody] RoleDto role, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    return StatusCode(StatusCodes.Status200OK, await _roleData.SaveUpdateRoleAsync(role, cancellationToken));
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
        /// Gets the roles asynchronous.
        /// </summary>
        /// <param name="assignedUserId">The assigned user identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("details")]
        public async Task<IActionResult> GetRolesAsync(string assignedUserId, CancellationToken cancellationToken)
        {
            try
            {
                return StatusCode(StatusCodes.Status200OK, await _roleData.GetRolesAsync(assignedUserId, cancellationToken));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpDelete("{roleId}")]
        public async Task<IActionResult> DeleteAsync(string roleId, CancellationToken cancellationToken)
        {
            try
            {
                return StatusCode(StatusCodes.Status200OK, await _roleData.DeleteRoleAsync(roleId, cancellationToken));
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


    }
}
#endregion