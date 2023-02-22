#region References
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Threading.Tasks;
#endregion

#region Namespace

namespace SRM.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/review-form")]
    public class ReviewFormController : Controller
    {
        /// <summary>
        /// The review form service
        /// </summary>
        private readonly IReviewFormService _reviewFormService;
        /// <summary>
        /// Initializes a new instance of the <see cref="ReviewFormController"/> class.
        /// </summary>
        /// <param name="reviewFormService">The review form service.</param>
        public ReviewFormController(IReviewFormService reviewFormService)
        {
            _reviewFormService = reviewFormService;
        }

        /// <summary>
        /// Fetches the name of the review form by.
        /// </summary>
        /// <param name="formName">Name of the form.</param>
        /// <returns></returns>
        [HttpGet("filter-by-name")]
        public async Task<IActionResult> FetchReviewFormByName([FromQuery] string formName)
        {
            try
            {
                var result = await _reviewFormService.FetchReviewFormByNameAsync(formName);
                return StatusCode(result != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }


        [HttpPut("update")]
        public async Task<IActionResult> UpdateReviewForm([FromBody] ReviewFormDto reviewForm)
        {
            try
            {
                var updatedResult = await _reviewFormService.UpdateReviewFormAsync(reviewForm);
                return StatusCode(updatedResult != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, updatedResult.Id);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllReveiwForms()
        {
            try
            {
                var reviewForms = await _reviewFormService.GetReviewFormsAsync();
                return StatusCode(reviewForms != null ? StatusCodes.Status200OK : StatusCodes.Status204NoContent, reviewForms);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message);
            }
        }
    }
}
#endregion