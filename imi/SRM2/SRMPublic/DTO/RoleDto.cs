#region References
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class RoleDto
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Role name is required.")]
        public string RoleName { get; set; }
        [Required(ErrorMessage = "Role code is required.")]
        public string RoleCode { get; set; }
        public string RoleDescription { get; set; }
        [Required(ErrorMessage = "Role type is requried.")]
        public string RoleType { get; set; }
        [Required(ErrorMessage = "Role assigned user id is required")]
        public string RoleAssignedUserId { get; set; }
        public List<PermissionVisibilityConfigDto> PermissionVisibilityConfigDto { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }

    }
}
#endregion