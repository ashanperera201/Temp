#region References
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.External.Services.Contracts;
using SRMPublic.DTO;
using System;
using System.Linq;
using System.Threading;
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
                var emailResponse = await _supplierEmailService.SendEmailAsync(email);
                return StatusCode(emailResponse ? StatusCodes.Status200OK : StatusCodes.Status204NoContent); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        /// <summary>
        /// Saves the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpPost("save-template")]
        public async Task<IActionResult> SaveEmailTemplateAsync([FromBody] EmailTemplateDto emailTemplate, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var savedEmailTemplate = await _supplierEmailService.SaveEmailTemplateAsync(emailTemplate, cancellationToken);
                    return StatusCode(savedEmailTemplate != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, savedEmailTemplate);
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

        [HttpPut("update-template/{templateId}")]
        public async Task<IActionResult> UpdateEmailTemplateAsync(int templateId, [FromBody] EmailTemplateDto emailTemplate, CancellationToken cancellationToken)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var savedEmailTemplate = await _supplierEmailService.UpdateEmailTemplateAsync(templateId, emailTemplate, cancellationToken);
                    return StatusCode(savedEmailTemplate != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, savedEmailTemplate);
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
        /// Deletes the email template asynchronous.
        /// </summary>
        /// <param name="templateId">The template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        [HttpDelete("template-remove/{templateId}")]
        public async Task<IActionResult> DeleteEmailTemplateAsync(int templateId, CancellationToken cancellationToken)
        {
            try
            {
                if (templateId != 0)
                {
                    var deletedResult = await _supplierEmailService.DeleteEmailTemplateAsync(templateId, cancellationToken);
                    return StatusCode(deletedResult ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, deletedResult);
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Email template id is required.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpGet("templates")]
        public async Task<IActionResult> FetchEmailTemplatesAsync(CancellationToken cancellationToken)
        {
            try
            {
                var templates = await _supplierEmailService.FetchAllEmailTemplatesAsync(cancellationToken);
                return StatusCode(templates.Count() > 0 ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, templates);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet("template/{templateId}")]
        public async Task<IActionResult> FetchEmailTemplateAsync(int templateId, CancellationToken cancellationToken)
        {
            try
            {
                var template = await _supplierEmailService.FetchEmailTemplateAsync(templateId, cancellationToken);
                return StatusCode(template != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, template);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        [HttpGet("template/filter-by")]
        public async Task<IActionResult> FetchEmailTemplateAsync([FromQuery] string term, CancellationToken cancellationToken)
        {
            try
            {
                var template = await _supplierEmailService.FilterEmailTemplatesAsync(term, cancellationToken);
                return StatusCode((template != null && template.Count() > 0) ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, template);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion