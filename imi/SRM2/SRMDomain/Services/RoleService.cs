#region References
using SRMDomain.Entities;
using SRMDomain.Repositories.Contracts;
using SRMDomain.Services.Interfaces;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Services.Services
{
    public class RoleService : IRoleService
    {
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// The role repository
        /// </summary>
        private readonly IRoleRepository _roleRepository;
        public RoleService(IEntityMapper entityMapper, IRoleRepository roleRepository)
        {
            _entityMapper = entityMapper;
            _roleRepository = roleRepository;
        }

        /// <summary>
        /// Gets the role by code.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <returns></returns>
        public async Task<List<RoleDto>> GetRoleByCode(string code)
        {
            try
            {
                var roles = (await _roleRepository.GetRoleByCodeAsync(code));
                var mappedResult = _entityMapper.Map<IEnumerable<RoleEntity>, IEnumerable<RoleDto>>(roles);
                return mappedResult.ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion