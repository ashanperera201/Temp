#region References
using System.Threading;
using System.Threading.Tasks;
using SRMPublic.DTO;
#endregion

#region Namespace
namespace SRMDomain.External.Services.Contracts
{
    public interface ISupplierEmailService
    {
        /// <summary>
        /// Sends the email asynchronous.
        /// </summary>
        /// <param name="mailInfo">The mail information.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        Task<bool> SendEmailAsync(EmailDto mailInfo, CancellationToken cancellationToken = default);
    }
}
#endregion