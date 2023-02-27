#region References
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SRMDomain.Entities;
using SRMDomain.External.Services.Contracts;
using SRMDomain.Repositories.Contracts;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.External.Services.Implementation
{
    public class SupplierEmailService : ISupplierEmailService
    {
        /// <summary>
        /// The email configuration
        /// </summary>
        private readonly EmailConfigDto _emailConfig;
        /// <summary>
        /// The supplier email template repository
        /// </summary>
        private readonly ISupplierEmailTemplateRepository _supplierEmailTemplateRepository;
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// Initializes a new instance of the <see cref="SupplierEmailService" /> class.
        /// </summary>
        /// <param name="emailConfig">The email configuration.</param>
        /// <param name="supplierEmailTemplateRepository">The supplier email template repository.</param>
        /// <param name="entityMapper">The entity mapper.</param>
        public SupplierEmailService(EmailConfigDto emailConfig, ISupplierEmailTemplateRepository supplierEmailTemplateRepository, IEntityMapper entityMapper)
        {
            _emailConfig = emailConfig;
            _supplierEmailTemplateRepository = supplierEmailTemplateRepository;
            _entityMapper = entityMapper;
        }

        /// <summary>
        /// Sends the email asynchronous.
        /// </summary>
        /// <param name="mailInfo">The mail information.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<bool> SendEmailAsync(EmailDto mailInfo, CancellationToken cancellationToken)
        {

            try
            {
                var mail = new MimeMessage();

                mail.From.Add(new MailboxAddress(_emailConfig.UserName, _emailConfig.From));

                foreach (string mailAddress in mailInfo.To)
                    mail.To.Add(MailboxAddress.Parse(mailAddress));

                if (!string.IsNullOrEmpty(mailInfo.ReplyTo))
                    mail.ReplyTo.Add(new MailboxAddress(mailInfo.ReplyToName, mailInfo.ReplyTo));

                if (mailInfo.Bcc != null)
                {
                    foreach (string mailAddress in mailInfo.Bcc.Where(x => !string.IsNullOrWhiteSpace(x)))
                        mail.Bcc.Add(MailboxAddress.Parse(mailAddress.Trim()));
                }

                if (mailInfo.Cc != null)
                {
                    foreach (string mailAddress in mailInfo.Cc.Where(x => !string.IsNullOrWhiteSpace(x)))
                        mail.Cc.Add(MailboxAddress.Parse(mailAddress.Trim()));
                }

                var body = new BodyBuilder();
                mail.Subject = mailInfo.Subject;
                body.HtmlBody = mailInfo.Body;
                mail.Body = body.ToMessageBody();

                using var smtp = new SmtpClient();

                await smtp.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, SecureSocketOptions.StartTls, cancellationToken);
                smtp.AuthenticationMechanisms.Remove("XOAUTH2");
                await smtp.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password, cancellationToken);
                await smtp.SendAsync(mail, cancellationToken);
                await smtp.DisconnectAsync(true, cancellationToken);
                smtp.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Updates the email template asynchronous.
        /// </summary>
        /// <param name="templateId"></param>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<EmailTemplateDto> UpdateEmailTemplateAsync(int templateId, EmailTemplateDto emailTemplate, CancellationToken cancellationToken = default)
        {
            try
            {
                emailTemplate.UpdatedOn = DateTime.UtcNow;
                var savedSupplierEmailTemplate = await _supplierEmailTemplateRepository.UpdateEmailTemplateAsync(templateId, _entityMapper.Map<EmailTemplateDto, EmailTemplateEntity>(emailTemplate), cancellationToken);
                return _entityMapper.Map<EmailTemplateEntity, EmailTemplateDto>(savedSupplierEmailTemplate);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Deletes the email template asynchronous.
        /// </summary>
        /// <param name="templateIds">The template ids.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<bool> DeleteEmailTemplateAsync(int templateIds, CancellationToken cancellationToken = default)
        {
            try
            {
                var actionResult = await _supplierEmailTemplateRepository.DeleteEmailTemplateAsync(templateIds, cancellationToken);
                return actionResult;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Fetches all email templates asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<EmailTemplateDto>> FetchAllEmailTemplatesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                return _entityMapper.Map<IEnumerable<EmailTemplateEntity>, IEnumerable<EmailTemplateDto>>(await _supplierEmailTemplateRepository.FetchEmailTemplatesAsync(cancellationToken));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Fetches the email template asynchronous.
        /// </summary>
        /// <param name="templateId">The template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<EmailTemplateDto> FetchEmailTemplateAsync(int templateId, CancellationToken cancellationToken = default)
        {
            try
            {
                return _entityMapper.Map<EmailTemplateEntity, EmailTemplateDto>(await _supplierEmailTemplateRepository.FetchEmailTemplateAsync(templateId, cancellationToken));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Saves the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<EmailTemplateDto> SaveEmailTemplateAsync(EmailTemplateDto emailTemplate, CancellationToken cancellationToken = default)
        {
            try
            {
                var existingEmail = (await _supplierEmailTemplateRepository.FilterEmailTemplatesAsync(emailTemplate.EmailTemplateName, cancellationToken))?.FirstOrDefault();
                if (existingEmail != null)
                {
                    existingEmail.EmailTemplateName = emailTemplate.EmailTemplateName;
                    existingEmail.EmailTemplateCode = emailTemplate.EmailTemplateCode;
                    existingEmail.FooterSignature = emailTemplate.FooterSignature;
                    existingEmail.HeaderSignature = emailTemplate.HeaderSignature;
                    existingEmail.ThanksGivingSection = emailTemplate.ThanksGivingSection;
                    existingEmail.HtmlContent = emailTemplate.HtmlContent;

                    var updatedResult = await _supplierEmailTemplateRepository.UpdateEmailTemplateAsync(existingEmail.Id, existingEmail, cancellationToken);
                    return _entityMapper.Map<EmailTemplateEntity, EmailTemplateDto>(updatedResult);
                }
                else
                {
                    emailTemplate.TemplateUniqueId = Guid.NewGuid().ToString();
                    emailTemplate.IsActive = false;
                    emailTemplate.CreatedOn = DateTime.UtcNow;
                    var savedSupplierEmailTemplate = await _supplierEmailTemplateRepository.SaveEmailTemplateAsync(_entityMapper.Map<EmailTemplateDto, EmailTemplateEntity>(emailTemplate), cancellationToken);
                    return _entityMapper.Map<EmailTemplateEntity, EmailTemplateDto>(savedSupplierEmailTemplate);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Filters the email templates asynchronous.
        /// </summary>
        /// <param name="filterTerm">The filter term.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        /// <exception cref="System.NotImplementedException"></exception>
        public async Task<IEnumerable<EmailTemplateDto>> FilterEmailTemplatesAsync(string filterTerm, CancellationToken cancellationToken = default)
        {
            try
            {
                return _entityMapper.Map<IEnumerable<EmailTemplateEntity>, IEnumerable<EmailTemplateDto>>(await _supplierEmailTemplateRepository.FilterEmailTemplatesAsync(filterTerm));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion