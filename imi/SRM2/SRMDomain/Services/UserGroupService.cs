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
    public class UserGroupService : IUserGroupService
    {
        /// <summary>
        /// The user group repository
        /// </summary>
        private readonly IUserGroupRepository _userGroupRepository;
        /// <summary>
        /// The entity mapper
        /// </summary>
        private readonly IEntityMapper _entityMapper;
        /// <summary>
        /// Initializes a new instance of the <see cref="UserGroupService"/> class.
        /// </summary>
        /// <param name="userGroupRepository">The user group repository.</param>
        /// <param name="entityMapper">The entity mapper.</param>
        public UserGroupService(IUserGroupRepository userGroupRepository, IEntityMapper entityMapper)
        {
            _userGroupRepository = userGroupRepository;
            _entityMapper = entityMapper;
        }

        public async Task<bool> CloneUserGroup(string userGroupName, CancellationToken cancellationToken = default)
        {
            try
            {
                return await _userGroupRepository.CloneUserGroupAsync(userGroupName, cancellationToken);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the user group by identifier asynchronous.
        /// </summary>
        /// <param name="Id">The identifier.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupDto> GetUserGroupByIdAsync(int Id, CancellationToken cancellationToken = default)
        {
            try
            {
                var userGroup = (await _userGroupRepository.GetUserGroupDetailAsync(Id, cancellationToken));
                var mappedResult = _entityMapper.Map<UserGroupEntity, UserGroupDto>(userGroup);
                return mappedResult;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the user group details asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<UserGroupDto>> GetUserGroupDetailsAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                var userGroups = await _userGroupRepository.GetUserGroupDetailsAsync(cancellationToken);
                var mappedResult = _entityMapper.Map<IEnumerable<UserGroupEntity>, IEnumerable<UserGroupDto>>(userGroups);
                return mappedResult;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Saves the user group asynchronous.
        /// </summary>
        /// <param name="userGroupDto">The user group dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupDto> SaveUserGroupAsync(UserGroupDto userGroupDto, CancellationToken cancellationToken = default)
        {
            try
            {
                var mappedEntitty = _entityMapper.Map<UserGroupDto, UserGroupEntity>(userGroupDto);
                var savedResult = await _userGroupRepository.SaveUserGroupAsync(mappedEntitty, cancellationToken);
                return _entityMapper.Map<UserGroupEntity, UserGroupDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Updates the user group asynchronous.
        /// </summary>
        /// <param name="userGroupDto">The user group dto.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupDto> UpdateUserGroupAsync(UserGroupDto userGroupDto, CancellationToken cancellationToken = default)
        {
            try
            {
                var mappedEntitty = _entityMapper.Map<UserGroupDto, UserGroupEntity>(userGroupDto);
                var savedResult = await _userGroupRepository.UpdateUserGroupAsync(mappedEntitty, cancellationToken);
                return _entityMapper.Map<UserGroupEntity, UserGroupDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Inserts the group detail asynchronous.
        /// </summary>
        /// <param name="groupDetail">The group detail.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserGroupDetailDto> InsertGroupDetailAsync(UserGroupDetailDto groupDetail, CancellationToken cancellationToken = default)
        {
            try
            {
                var mappedEntitty = _entityMapper.Map<UserGroupDetailDto, UserGroupDetail>(groupDetail);
                var savedResult = await _userGroupRepository.InsertUserGroupDetailsAsync(mappedEntitty, cancellationToken);
                return _entityMapper.Map<UserGroupDetail, UserGroupDetailDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Saves the user group detail asynchronous.
        /// </summary>
        /// <param name="userGroupDetail">The user group detail.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<UserGroupDetailDto> UpdateUserGroupDetailAsync(UserGroupDetailDto userGroupDetail, CancellationToken cancellationToken)
        {
            try
            {
                var mappedEntitty = _entityMapper.Map<UserGroupDetailDto, UserGroupDetail>(userGroupDetail);
                var savedResult = await _userGroupRepository.UpdateUserGroupDetailInforAsync(mappedEntitty, cancellationToken);
                return _entityMapper.Map<UserGroupDetail, UserGroupDetailDto>(savedResult);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        /// <summary>
        /// Gets the user group detail dtos.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<IEnumerable<UserGroupDetailDto>> GetUserGroupDetailDtosAsync(CancellationToken cancellationToken)
        {
            try
            {
                var groupInfo = await _userGroupRepository.GetUserGroupDetailInfoAsync(cancellationToken);
                var mappedResult = _entityMapper.Map<IEnumerable<UserGroupDetail>, IEnumerable<UserGroupDetailDto>>(groupInfo);
                return mappedResult;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
#endregion
