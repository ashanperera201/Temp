#region References
using System;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class PermissionVisibilityConfigDto
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Role id is required.")]
        public string RoleId { get; set; }
        public string AssignedUserId { get; set; }
        public string VisibilityPermissionJson { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion