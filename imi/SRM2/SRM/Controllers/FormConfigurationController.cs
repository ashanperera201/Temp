#region Referernces
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Linq;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [ApiController]
    [Route("api/form-confugration")]
    public class FormConfigurationController : Controller
    {
        /// <summary>
        /// The form configuration service
        /// </summary>
        private readonly IFormConfigurationService _formConfigurationService;
        /// <summary>
        /// Initializes a new instance of the <see cref="FormConfigurationController"/> class.
        /// </summary>
        /// <param name="formConfigurationService">The form configuration service.</param>
        public FormConfigurationController(IFormConfigurationService formConfigurationService)
        {
            _formConfigurationService = formConfigurationService;
        }

        /// <summary>
        /// Gets all form configurations.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> GetAllFormConfigurationsAsync()
        {
            try
            {
                var serviceResponse = await _formConfigurationService.GetAllConfigurationAsync();
                return StatusCode(serviceResponse != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, serviceResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Saves the form configuration.
        /// </summary>
        /// <param name="formConfiguration">The form configuration.</param>
        /// <returns></returns>

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> SaveFormConfigurationAsync([FromBody] FormConfigurationDto formConfiguration)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var serviceResponse = await _formConfigurationService.SaveConfigurationAsync(formConfiguration);
                    return StatusCode(serviceResponse != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, serviceResponse);
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
        /// Gets the form configuration by module name asynchronous.
        /// </summary>
        /// <param name="moduleName">Name of the module.</param>
        /// <returns></returns>
        [Authorize]
        [HttpGet("filter-by/{filterKey}")]
        public async Task<IActionResult> GetFormConfigurationByFilterAsync(string filterKey)
        {
            try
            {
                if (string.IsNullOrEmpty(filterKey))
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Filter key is required.");
                }
                else
                {
                    var serviceResponse = await _formConfigurationService.GetFormConfigurationByFilterAsync(filterKey);
                    return StatusCode(serviceResponse != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, serviceResponse);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        /// <summary>
        /// Updates the form configuration asyncc.
        /// </summary>
        /// <param name="configFormId">The configuration form identifier.</param>
        /// <param name="formConfiguration">The form configuration.</param>
        /// <returns></returns>
        [HttpPut("{configFormId}")]
        public async Task<IActionResult> UpdateFormConfigurationAsyncc(string configFormId, [FromBody] FormConfigurationDto formConfiguration)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var serviceRes = await _formConfigurationService.UpdateFormConfigurationByIdAsync(int.Parse(configFormId), formConfiguration);
                    return StatusCode(serviceRes != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, serviceRes);
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
    }
}
#endregion