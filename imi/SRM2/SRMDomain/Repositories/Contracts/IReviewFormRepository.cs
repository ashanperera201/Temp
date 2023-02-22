#region References
using SRMDomain.Entities;
using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Repositories.Contracts
{
    public interface IReviewFormRepository
    {
        /// <summary>
        /// Fetches the review form asynchronous.
        /// </summary>
        /// <param name="formName">Name of the form.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ReviewFormEntity> FetchReviewFormAsync(string formName, CancellationToken cancellationToken = default);
        /// <summary>
        /// Updates the review form asynchronous.
        /// </summary>
        /// <param name="entity">The entity.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<ReviewFormEntity> UpdateReviewFormAsync(ReviewFormEntity entity, CancellationToken cancellationToken = default);
        /// <summary>
        /// Gets all review forms.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<ReviewFormEntity>> GetAllReviewFormsAsync(CancellationToken cancellationToken = default);
    }
}
#endregion