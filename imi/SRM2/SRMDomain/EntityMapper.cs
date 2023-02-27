#region References
using AutoMapper;
using SRMDomain.Entities;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
#endregion

#region Namespace
namespace SRMDomain
{
    /// <summary>
    /// EntityMapper
    /// </summary>
    /// <seealso cref="SRMPublic.Interfaces.IEntityMapper" />
    public class EntityMapper : IEntityMapper
    {
        /// <summary>
        /// The mapper configuration
        /// </summary>
        private MapperConfiguration _mapperConfiguration;
        /// <summary>
        /// The mapper
        /// </summary>
        private IMapper _mapper;
        /// <summary>
        /// Initializes a new instance of the <see cref="EntityMapper"/> class.
        /// </summary>
        public EntityMapper()
        {
            _configureMapper();
            _createMapper();
        }

        /// <summary>
        /// Configures the mapper.
        /// </summary>
        private void _configureMapper()
        {
            _mapperConfiguration = new MapperConfiguration(mapConfig =>
            {
                #region Role Mapping.
                mapConfig.CreateMap<RoleEntity, RoleDto>()
                    .ForMember(e => e.Id, m => m.MapFrom(t => t.Id))
                    .ForMember(e => e.RoleName, m => m.MapFrom(t => t.RoleName))
                    .ForMember(e => e.RoleCode, m => m.MapFrom(t => t.RoleCode))
                    .ForMember(e => e.RoleDescription, m => m.MapFrom(t => t.RoleDescription))
                    .ForMember(e => e.RoleType, m => m.MapFrom(t => t.RoleType))
                    .ForMember(e => e.RoleAssignedUserId, m => m.MapFrom(t => t.RoleAssignedUserId))
                    .ForMember(e => e.IsActive, m => m.MapFrom(t => t.IsActive))
                    .ForMember(e => e.CreatedBy, m => m.MapFrom(t => t.CreatedBy))
                    .ForMember(e => e.CreatedOn, m => m.MapFrom(t => t.CreatedOn))
                    .ForMember(e => e.UpdatedOn, m => m.MapFrom(t => t.UpdatedOn))
                    .ForMember(e => e.UpdatedBy, m => m.MapFrom(t => t.UpdatedBy))
                    .ForMember(e => e.PermissionVisibilityConfigDto, m => m.MapFrom(t => t.VisibilityPermissionsEntity))
                    .ReverseMap();


                mapConfig.CreateMap<VisibilityPermissionsEntity, PermissionVisibilityConfigDto>()
                    .ForMember(d => d.Id, m => m.MapFrom(t => t.Id))
                    .ForMember(d => d.RoleId, m => m.MapFrom(t => t.RoleId))
                    .ForMember(d => d.AssignedUserId, m => m.MapFrom(t => t.AssignedUser))
                    .ForMember(d => d.VisibilityPermissionJson, m => m.MapFrom(t => t.VisibilityPermissionJson))
                    .ForMember(e => e.IsActive, m => m.MapFrom(t => t.IsActive))
                    .ForMember(e => e.CreatedBy, m => m.MapFrom(t => t.CreatedBy))
                    .ForMember(e => e.CreatedOn, m => m.MapFrom(t => t.CreatedOn))
                    .ForMember(e => e.UpdatedOn, m => m.MapFrom(t => t.UpdatedOn))
                    .ForMember(e => e.UpdatedBy, m => m.MapFrom(t => t.UpdatedBy))
                    .ReverseMap();
                #endregion

                #region User Group Mapping
                mapConfig.CreateMap<UserGroupEntity, UserGroupDto>()
                   .ForMember(e => e.Id, m => m.MapFrom(t => t.Id))
                   .ReverseMap();
                #endregion

                #region User group detail
                mapConfig.CreateMap<UserGroupDetailDto, UserGroupDetail>()
                   .ForMember(e => e.UserGroupId, m => m.MapFrom(t => t.GroupId))
                   .ReverseMap();
                #endregion

                #region Review Form
                mapConfig.CreateMap<ReviewFormEntity, ReviewFormDto>()
                .ForMember(e => e.Id, m => m.MapFrom(t => t.Id))
                .ForMember(e => e.name, m => m.MapFrom(t => t.name))
                .ForMember(e => e.form, m => m.MapFrom(t => t.form))
                .ForMember(e => e.title, m => m.MapFrom(t => t.title))
                .ForMember(e => e.subtitle, m => m.MapFrom(t => t.subtitle))
                .ForMember(e => e.createdUser, m => m.MapFrom(t => t.createdUser))
                .ForMember(e => e.createdUserRole, m => m.MapFrom(t => t.createdUserRole))
                .ForMember(e => e.submittedDate, m => m.MapFrom(t => t.submittedDate))
                .ReverseMap();
                #endregion

                #region Form Configuration
                mapConfig.CreateMap<FormConfigurationEntity, FormConfigurationDto>()
                .ReverseMap();
                #endregion

                #region Process Configurator
                mapConfig.CreateMap<ProcessConfiguratorEntity, ProcessConfiguratorDto>()
                .ReverseMap();
                #endregion

                #region Supplier Details
                mapConfig.CreateMap<SupplierEntity, SupplierV2Dto>()
                .ForMember(e => e.SupplierUniqueId, m => m.MapFrom(t => t.SupplierUniqueId))
                .ReverseMap();
                #endregion

                #region Supplier Email Templates
                mapConfig.CreateMap<EmailTemplateEntity, EmailTemplateDto>()
                .ForMember(e => e.Id, m => m.MapFrom(t => t.Id))
                .ReverseMap();
                #endregion

            });
        }

        /// <summary>
        /// Creates the mapper.
        /// </summary>
        private void _createMapper()
        {
            _mapper = _mapperConfiguration.CreateMapper();
        }

        /// <summary>
        /// Maps the specified source.
        /// </summary>
        /// <typeparam name="TSource">The type of the source.</typeparam>
        /// <typeparam name="TDestination">The type of the destination.</typeparam>
        /// <param name="source">The source.</param>
        /// <returns></returns>
        public TDestination Map<TSource, TDestination>(TSource source)
        {
            return _mapper.Map<TSource, TDestination>(source);
        }
    }
}
#endregion