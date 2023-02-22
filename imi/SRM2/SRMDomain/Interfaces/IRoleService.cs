#region References
using SRMPublic.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Services.Interfaces
{
    public interface IRoleService
    {
        /// <summary>
        /// Gets the role by code.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <returns></returns>
        Task<List<RoleDto>> GetRoleByCode(string code);
    }
}
#endregion