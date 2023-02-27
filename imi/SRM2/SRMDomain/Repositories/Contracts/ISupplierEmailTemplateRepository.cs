#region References
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using SRMDomain.Entities;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public interface ISupplierEmailTemplateRepository
    {
        /// <summary>
        /// Saves the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<EmailTemplateEntity> SaveEmailTemplateAsync(EmailTemplateEntity emailTemplate, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the email template asynchronous.
        /// </summary>
        /// <param name="templateId">The template identifier.</param>
        /// <param name="emailTemplateEntity">The email template entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<EmailTemplateEntity> UpdateEmailTemplateAsync(int templateId, EmailTemplateEntity emailTemplateEntity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Deletes the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplateId">The email template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> DeleteEmailTemplateAsync(int emailTemplateId, CancellationToken cancellationToken = default);
        /// <summary>
        /// Fetches the email templates asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<EmailTemplateEntity>> FetchEmailTemplatesAsync(CancellationToken cancellationToken = default);
        /// <summary>
        /// Fetches the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplateId">The email template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<EmailTemplateEntity> FetchEmailTemplateAsync(int emailTemplateId, CancellationToken cancellationToken = default);
        /// <summary>
        /// Filters the email templates asynchronous.
        /// </summary>
        /// <param name="filterItem">The filter item.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<EmailTemplateEntity>> FilterEmailTemplatesAsync(string filterItem, CancellationToken cancellationToken = default);
    }
}
#endregion