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
    public class ReviewFormRepository : IReviewFormRepository
    {
        /// <summary>
        /// The SRM dapper context
        /// </summary>
        private readonly SrmDapperContext _srmDapperContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="ReviewFormRepository"/> class.
        /// </summary>
        /// <param name="srmDapperContext">The SRM dapper context.</param>
        public ReviewFormRepository(SrmDapperContext srmDapperContext)
        {
            _srmDapperContext = srmDapperContext;
        }
        /// <summary>
        /// Fetches the review form asynchronous.
        /// </summary>
        /// <param name="formName">Name of the form.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ReviewFormEntity> FetchReviewFormAsync(string formName, CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT [ID], [NAME], [FORM] FROM [dbo].[REVIEW_FORMS] WHERE [NAME]='{formName}'";

            using(var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<ReviewFormEntity>(query, cancellationToken)).FirstOrDefault();
                connection.Close();
                return result;  
            }
        }

        /// <summary>
        /// Gets all review forms.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<ReviewFormEntity>> GetAllReviewFormsAsync(CancellationToken cancellationToken = default)
        {
            string query = $@"SELECT [ID], [NAME], [FORM] FROM [dbo].[REVIEW_FORMS]";

            using (var connection = _srmDapperContext.CreateConnection())
            {
                connection.Open();
                var result = (await connection.QueryAsync<ReviewFormEntity>(query, cancellationToken));
                connection.Close();
                return result;
            }
        }

        /// <summary>
        /// Updates the review form asynchronous.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<ReviewFormEntity> UpdateReviewFormAsync(ReviewFormEntity entity, CancellationToken cancellationToken = default)
        {
            int transactionState = 0;
            string query = $@"
                UPDATE REVIEW_FORMS
                SET    name = @name, form = @form, title = @title,
				       subtitle = @subtitle, logo = @logo, banner = @banner,
				       status = @status, form_type = @formType
                WHERE  id = '{entity.Id}'";

            using (var conection = _srmDapperContext.CreateConnection())
            {
                conection.Open();
                using (var transaction = conection.BeginTransaction())
                {
                    try
                    {
                        transactionState = await conection.ExecuteAsync(query, entity, transaction);
                        transaction.Commit();                        
                    }
                    catch
                    {
                        transaction.Rollback();
                    }
                    conection.Close();
                }
            }
            return transactionState > 0 ? entity : null;
        }
    }
}
#endregion
