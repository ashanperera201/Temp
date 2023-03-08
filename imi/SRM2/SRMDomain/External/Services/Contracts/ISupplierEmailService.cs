#region References
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SRMPublic.DTO;
#endregion

#region Namespace
namespace SRMDomain.External.Services.Contracts
{
    public interface ISupplierEmailService
    {
        /// <summary>
        /// Sends the email asynchronous.
        /// </summary>
        /// <param name="mailInfo">The mail information.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> SendEmailAsync(EmailDto mailInfo, CancellationToken cancellationToken = default);
        /// <summary>
        /// Saves the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<EmailTemplateDto> SaveEmailTemplateAsync(EmailTemplateDto emailTemplate, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<EmailTemplateDto> UpdateEmailTemplateAsync(int templateId, EmailTemplateDto emailTemplate, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes the email template asynchronous.
        /// </summary>
        /// <param name="templateIds">The template ids.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> DeleteEmailTemplateAsync(int templateIds, CancellationToken cancellationToken = default);
        /// <summary>
        /// Fetches all email templates asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<EmailTemplateDto>> FetchAllEmailTemplatesAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Fetches the email template asynchronous.
        /// </summary>
        /// <param name="templateId">The template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<EmailTemplateDto> FetchEmailTemplateAsync(int templateId, CancellationToken cancellationToken = default);

        /// <summary>
        /// Filters the email templates asynchronous.
        /// </summary>
        /// <param name="filterTerm">The filter term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<EmailTemplateDto>> FilterEmailTemplatesAsync(string filterTerm, CancellationToken cancellationToken = default);
    }
}
#endregion