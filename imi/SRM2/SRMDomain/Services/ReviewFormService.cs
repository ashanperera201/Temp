#region References
using SRMDomain.Entities;
using SRMDomain.Interfaces;
using SRMDomain.Repositories.Contracts;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Services
{
    public class ReviewFormService : IReviewFormService
    {
        /// <summary>
        /// The review form repository
        /// </summary>
        private readonly IReviewFormRepository _reviewFormRepository;
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// Initializes a new instance of the <see cref="ReviewFormService"/> class.
        /// </summary>
        /// <param name="reviewFormRepository">The review form repository.</param>
        public ReviewFormService(IReviewFormRepository reviewFormRepository, IEntityMapper entityMapper)
        {
            _reviewFormRepository = reviewFormRepository;
            _entityMapper = entityMapper;
        }

        /// <summary>
        /// Fetches the name of the review form by.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <returns></returns>
        public async Task<ReviewFormDto> FetchReviewFormByNameAsync(string name)
        {
            try
            {
                var entityResult = await _reviewFormRepository.FetchReviewFormAsync(name);
                return _entityMapper.Map<ReviewFormEntity, ReviewFormDto>(entityResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<ReviewFormDto>> GetReviewFormsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var savedResult = await _reviewFormRepository.GetAllReviewFormsAsync();
                return _entityMapper.Map<IEnumerable<ReviewFormEntity>, IEnumerable<ReviewFormDto>>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Updates the review form asynchronous.
        /// </summary>
        /// <param name="reviewForm">The review form.</param>
        /// <returns></returns>
        public async Task<ReviewFormDto> UpdateReviewFormAsync(ReviewFormDto reviewForm)
        {
            try
            {
                var entity = _entityMapper.Map<ReviewFormDto, ReviewFormEntity>(reviewForm);
                var savedResult = await _reviewFormRepository.UpdateReviewFormAsync(entity);
                return _entityMapper.Map<ReviewFormEntity, ReviewFormDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion
