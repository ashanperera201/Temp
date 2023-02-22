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
namespace SRM.Controllers.v2
{
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/supplier")]
    [ApiController]
    public class SupplierController : ControllerBase
    {
        /// <summary>
        /// The supplier information service
        /// </summary>
        private readonly ISupplierInformationService _supplierInformationService;
        /// <summary>
        /// Initializes a new instance of the <see cref="SupplierController"/> class.
        /// </summary>
        /// <param name="supplierInformationService">The supplier information service.</param>
        public SupplierController(ISupplierInformationService supplierInformationService)
        {
            _supplierInformationService = supplierInformationService;
        }

        /// <summary>
        /// Suppliers the invitation asynchronous.
        /// </summary>
        /// <param name="supplier">The supplier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("invitation")]
        public async Task<IActionResult> SupplierInvitationAsync([FromBody] SupplierV2Dto supplier, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _supplierInformationService.SendSupplierInvitationAsync(supplier, cancellationToken);
                return StatusCode(response != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Saves the supplier row wise asynchronous.
        /// </summary>
        /// <param name="supplier">The supplier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("save/row-wise")]
        public async Task<IActionResult> SaveSupplierRowWiseAsync([FromBody] SupplierV2Dto supplier, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _supplierInformationService.SaveSupplierRowWiseAsync(supplier, cancellationToken);
                return StatusCode(response != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Updates the supplier row wise asynchronous.
        /// </summary>
        /// <param name="supplierId">The supplier identifier.</param>
        /// <param name="supplier">The supplier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPut("update/row-wise/{supplierId}")]
        public async Task<IActionResult> UpdateSupplierRowWiseAsync(int supplierId, [FromBody] SupplierV2Dto supplier, CancellationToken cancellationToken)
        {
            try
            {
                var response = await _supplierInformationService.UpdateSupplierRowWiseAsync(supplierId, supplier, cancellationToken);
                return StatusCode(response != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Gets all supplier details row wise asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("details/row-wise")]
        public async Task<IActionResult> GetAllSupplierDetailsRowWiseAsync(CancellationToken cancellationToken)
        {
            try
            {
                var response = await _supplierInformationService.GetSupplierDetailsRowWiseAsync(cancellationToken);
                return StatusCode(response != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Gets the supplier detail asynchronous.
        /// </summary>
        /// <param name="term">The term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpGet("detail/row-wise/{term}")]
        public async Task<IActionResult> GetSupplierDetailAsync(string term, CancellationToken cancellationToken)
        {

            try
            {
                var response = await _supplierInformationService.GetSupplierDetailRowWiseAsync(term, cancellationToken);
                return StatusCode(response != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, response);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpPost("save/document-wise")]
        public async Task<IActionResult> SaveSupplierDocumentWiseAsync([FromBody] object supplier, CancellationToken cancellationToken)
        {
            try
            {
                //var emailResponse = await this._supplierEmailService.SendEmailAsync(email);
                //return StatusCode(emailResponse ? StatusCodes.Status200OK : StatusCodes.Status204NoContent); ;
                return null;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


    }
}
#endregion