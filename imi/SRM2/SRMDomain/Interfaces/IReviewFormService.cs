#region References
using SRMPublic.DTO;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Interfaces
{
    public interface IReviewFormService
    {
        /// <summary>
        /// Fetches the name of the review form by.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        Task<ReviewFormDto> FetchReviewFormByNameAsync(string name);
        /// <summary>
        /// Updates the review form asynchronous.
        /// </summary>
        /// <param name="reviewForm">The review form.</param>
        /// <returns></returns>
        Task<ReviewFormDto> UpdateReviewFormAsync(ReviewFormDto reviewForm);

        /// <summary>
        /// Gets the review forms.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<IEnumerable<ReviewFormDto>> GetReviewFormsAsync(CancellationToken cancellationToken = default);
    }
}
#endregion