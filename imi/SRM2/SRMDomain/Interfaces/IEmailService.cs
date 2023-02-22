#region References
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Interfaces
{
    public interface IEmailService
    {
        void SendEmail(MessageDto message);
        Task<List<string>> GetWorkflowEmail(string rolename);
    }
}
#endregion