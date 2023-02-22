#region References
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SRMPublic.DTO;
#endregion

#region Namespace
namespace SRM.Controllers
{
    [ApiController]
    [Route("api/parallel-task")]
    public class ParallelTestController : Controller
    {
        private readonly IHubContext<AppHub> _applicationHubContext;

        public ParallelTestController(IHubContext<AppHub> applicationHubContext)
        {
            _applicationHubContext = applicationHubContext;
        }

        [HttpPost()]
        public IActionResult ParallelTestAsync([FromBody] string message)
        {
            _applicationHubContext.Clients.All.SendAsync("CommonParallelAction", message);
            return Ok("Prallel test has been executed.");
        }

        [HttpPost("user")]
        public IActionResult ParallelUserBlockAsync([FromBody] ParallelUserDto parallelUser)
        {
            _applicationHubContext.Clients.All.SendAsync("CommonParallelAction", parallelUser);
            return Ok("Prallel test has been executed.");
        }
    }
}
#endregion