#region References
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using SRMDomain.External.Services.Contracts;
using SRMPublic.DTO;
using System;
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
        /// Initializes a new instance of the <see cref="SupplierEmailService" /> class.
        /// </summary>
        /// <param name="emailConfig">The email configuration.</param>
        public SupplierEmailService(EmailConfigDto emailConfig)
        {
            _emailConfig = emailConfig;
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
    }
}
#endregion