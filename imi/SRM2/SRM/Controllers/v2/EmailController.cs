#region References
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.External.Services.Contracts;
using SRMPublic.DTO;
using System;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM.Controllers.v2
{
    [ApiVersion("2.0")]
    [Route("api/v{version:apiVersion}/email")]
    [ApiController]
    public class EmailController : ControllerBase
    {
        /// <summary>
        /// The supplier email service
        /// </summary>
        private readonly ISupplierEmailService _supplierEmailService;
        /// <summary>
        /// Initializes a new instance of the <see cref="EmailController"/> class.
        /// </summary>
        /// <param name="supplierEmailService">The supplier email service.</param>
        public EmailController(ISupplierEmailService supplierEmailService)
        {
            _supplierEmailService = supplierEmailService;
        }

        /// <summary>
        /// Sends the email asynchronous.
        /// </summary>
        /// <param name="email">The email.</param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> SendEmailAsync([FromBody] EmailDto email)
        {
            try
            {
                var emailResponse = await this._supplierEmailService.SendEmailAsync(email);
                return StatusCode(emailResponse ? StatusCodes.Status200OK : StatusCodes.Status204NoContent); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
#endregion