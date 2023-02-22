#region References
using System;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class PermissionDto
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Role id is required.")]
        public string RoleId { get; set; }
        [Required(ErrorMessage = "Role assigned user is required.")]
        public string RoleAssignedUserId { get; set; }
        [Required(ErrorMessage = "Level code is required.")]
        public string LevelCode { get; set; }
        [Required(ErrorMessage = "Section code is required.")]
        public string SectionCode { get; set; }
        [Required(ErrorMessage = "Permission code is required.")]
        public string PermissionCode { get; set; }
        [Required(ErrorMessage = "Permission name is required.")]
        public string PermissionName { get; set; }
        public bool EnableToView { get; set; }
        public bool EnableToEdit { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion
