#region References
using Dapper;
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Implementations
{
    public class SupplierEmailTemplateRepository : ISupplierEmailTemplateRepository
    {
        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;
        /// <summary>
        /// Initializes a new instance of the <see cref="SupplierEmailTemplateRepository" /> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public SupplierEmailTemplateRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }

        /// <summary>
        /// Saves the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplate">The email template.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<EmailTemplateEntity> SaveEmailTemplateAsync(EmailTemplateEntity emailTemplate, CancellationToken cancellationToken = default)
        {
            string query = $@"
                INSERT INTO [dbo].[EMAIL_TEMPLATES]
                       ([TemplateUniqueId]
                       ,[EmailTemplateCode]
                       ,[EmailTemplateName]
                       ,[HtmlContent]
                       ,[FooterSignature]
                       ,[HeaderSignature]
                       ,[ThanksGivingSection]
                       ,[IsActive]
                       ,[CreatedBy]
                       ,[CreatedOn]
                       ,[UpdatedBy]
                       ,[UpdatedOn])
                 OUTPUT INSERTED.*
                 VALUES
                       (@TemplateUniqueId
                       ,@EmailTemplateCode
                       ,@EmailTemplateName
                       ,@HtmlContent
                       ,@FooterSignature
                       ,@HeaderSignature
                       ,@ThanksGivingSection
                       ,@IsActive
                       ,@CreatedBy
                       ,@CreatedOn
                       ,@UpdatedBy
                       ,@UpdatedOn)
            ";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        var savedEmailTemplate = await conection.QuerySingleAsync<EmailTemplateEntity>(query, emailTemplate, transaction);
                        transaction.Commit();
                        return savedEmailTemplate;
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return null;
        }

        /// <summary>
        /// Updates the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplateEntity">The email template entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<EmailTemplateEntity> UpdateEmailTemplateAsync(int templateId, EmailTemplateEntity emailTemplateEntity, CancellationToken cancellationToken = default)
        {

            string query = $@"
                         UPDATE [dbo].[EMAIL_TEMPLATES]
                           SET [EmailTemplateCode] = @EmailTemplateCode
                              ,[EmailTemplateName] = @EmailTemplateName
                              ,[HtmlContent] = @HtmlContent
                              ,[FooterSignature] = @FooterSignature
                              ,[HeaderSignature] = @HeaderSignature
                              ,[ThanksGivingSection] = @ThanksGivingSection
                              ,[IsActive] = @IsActive
                              ,[CreatedBy] = @CreatedBy
                              ,[CreatedOn] = @CreatedOn
                              ,[UpdatedBy] = @UpdatedBy
                              ,[UpdatedOn] = @UpdatedOn
                         OUTPUT INSERTED.*
                         WHERE [Id] = {templateId}
            ";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        var savedEmailTemplate = await conection.QuerySingleAsync<EmailTemplateEntity>(query, emailTemplateEntity, transaction);
                        transaction.Commit();
                        return savedEmailTemplate;
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return null;
        }

        /// <summary>
        /// Deletes the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplateId">The email template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<bool> DeleteEmailTemplateAsync(int emailTemplateId, CancellationToken cancellationToken = default)
        {
            string query = $@"DELETE FROM [dbo].[EMAIL_TEMPLATES] WHERE [Id] = @Id";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        var queryResult = await conection.ExecuteAsync(query, new { Id = emailTemplateId }, transaction);
                        transaction.Commit();
                        return queryResult > 0 ? true : false;
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return false;
        }

        /// <summary>
        /// Fetches the email template asynchronous.
        /// </summary>
        /// <param name="emailTemplateId">The email template identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<EmailTemplateEntity> FetchEmailTemplateAsync(int emailTemplateId, CancellationToken cancellationToken = default)
        {
            string query = $@"
                    SELECT [Id]
                          ,[TemplateUniqueId]
                          ,[EmailTemplateCode]
                          ,[EmailTemplateName]
                          ,[HtmlContent]
                          ,[FooterSignature]
                          ,[HeaderSignature]
                          ,[ThanksGivingSection]
                          ,[IsActive]
                          ,[CreatedBy]
                          ,[CreatedOn]
                          ,[UpdatedBy]
                          ,[UpdatedOn]
                      FROM [dbo].[EMAIL_TEMPLATES]
                      WHERE [Id] = {emailTemplateId}
            ";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<EmailTemplateEntity>(query, cancellationToken))?.FirstOrDefault();
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Fetches the email templates asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<EmailTemplateEntity>> FetchEmailTemplatesAsync(CancellationToken cancellationToken = default)
        {
            string query = $@"
                    SELECT [Id]
                          ,[TemplateUniqueId]
                          ,[EmailTemplateCode]
                          ,[EmailTemplateName]
                          ,[HtmlContent]
                          ,[FooterSignature]
                          ,[HeaderSignature]
                          ,[ThanksGivingSection]
                          ,[IsActive]
                          ,[CreatedBy]
                          ,[CreatedOn]
                          ,[UpdatedBy]
                          ,[UpdatedOn]
                      FROM [dbo].[EMAIL_TEMPLATES]
                      ORDER BY [CreatedOn] DESC
            ";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<EmailTemplateEntity>(query, cancellationToken));
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Filters the email templates asynchronous.
        /// </summary>
        /// <param name="filterItem">The filter item.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<EmailTemplateEntity>> FilterEmailTemplatesAsync(string filterItem, CancellationToken cancellationToken = default)
        {
            string query = $@"
                       SELECT [Id]
                          ,[TemplateUniqueId]
                          ,[EmailTemplateCode]
                          ,[EmailTemplateName]
                          ,[HtmlContent]
                          ,[FooterSignature]
                          ,[HeaderSignature]
                          ,[ThanksGivingSection]
                          ,[IsActive]
                          ,[CreatedBy]
                          ,[CreatedOn]
                          ,[UpdatedBy]
                          ,[UpdatedOn]
                       FROM [dbo].[EMAIL_TEMPLATES]
                         WHERE
                            [EmailTemplateCode] = '{filterItem}' OR
                            [EmailTemplateName] = '{filterItem}'; 
                        ";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<EmailTemplateEntity>(query, cancellationToken));
                connection.Close();
                return result;
            }
        }
    }
}
#endregion