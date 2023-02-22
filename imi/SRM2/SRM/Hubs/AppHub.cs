#region References
using Microsoft.AspNetCore.SignalR;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRM
{
  
    public class AppHub : Hub
    {
        public async Task CommonParallelAction(string message, CancellationToken cancellationToken)
        {
            await Clients.All.SendAsync("CommonParallelAction", message, cancellationToken);
        }
        /// <summary>
        /// Saves the ims user asynchronous.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        public async Task SaveImsUserAsync(string message, CancellationToken cancellationToken)
        {
            await Clients.All.SendAsync("SaveImsUserAsync", message, cancellationToken);
        }

        /// <summary>
        /// Updates the ims user asynchronous.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        public async Task UpdateImsUserAsync(string message, CancellationToken cancellationToken)
        {
            await Clients.All.SendAsync("UpdateImsUserAsync", message, cancellationToken);
        }

        /// <summary>
        /// Deletes the ims user asynchronous.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        public async void DeleteImsUserAsync(string message, CancellationToken cancellationToken)
        {
            await Clients.All.SendAsync("DeleteImsUserAsync", message, cancellationToken);
        }
    }
}
#endregion