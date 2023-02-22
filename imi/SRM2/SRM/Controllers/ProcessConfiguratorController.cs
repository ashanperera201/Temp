#region References
using iText.Kernel.Geom;
using MailKit.Search;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/process-configurator")]
    public class ProcessConfiguratorController : Controller
    {
        /// <summary>
        /// The process configurator service
        /// </summary>
        private readonly IProcessConfiguratorService _processConfiguratorService;
        /// <summary>
        /// Initializes a new instance of the <see cref="ProcessConfiguratorController"/> class.
        /// </summary>
        /// <param name="processConfiguratorService">The process configurator service.</param>
        public ProcessConfiguratorController(IProcessConfiguratorService processConfiguratorService)
        {
            _processConfiguratorService = processConfiguratorService;
        }

        /// <summary>
        /// Fetches all process configurators asynchronous.
        /// </summary>
        /// <param name="searchTerm">The search term.</param>
        /// <param name="page">The page.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet]
        public async Task<IActionResult> FetchAllProcessConfiguratorsAsync([FromQuery] string searchTerm, int page, int pageSize, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _processConfiguratorService.GetProcessConfiguratorsAsync(searchTerm, page, pageSize, cancellationToken);
                return StatusCode(result != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet("filter-by-phase/{phaseOne}")]
        public async Task<IActionResult> FetchProcessConfiguratorByPhaseOneAsync(string phaseOne, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _processConfiguratorService.GetProcessConfiguratorByPhaseOneAsync(phaseOne, cancellationToken);
                return StatusCode(result != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Fetches the process configurator asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> FetchProcessConfiguratorAsync(int id, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _processConfiguratorService.GetProcessConfiguratorAsync(id, cancellationToken);
                return StatusCode(result != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Saves the process configurator asynchronous.
        /// </summary>
        /// <param name="processConfigurator">The process configurator.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost()]
        public async Task<IActionResult> SaveProcessConfiguratorAsync([FromBody] ProcessConfiguratorDto processConfigurator, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _processConfiguratorService.SaveProcessConfiguratorAsync(processConfigurator, cancellationToken);
                return StatusCode(result != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Updates the process configurator asynchronous.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="processConfigurator">The process configurator.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProcessConfiguratorAsync(int id, [FromBody] ProcessConfiguratorDto processConfigurator, CancellationToken cancellationToken)
        {
            try
            {
                var result = await _processConfiguratorService.updateProcessConfiguratorAsync(id, processConfigurator, cancellationToken);
                return StatusCode(result != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
#endregion
