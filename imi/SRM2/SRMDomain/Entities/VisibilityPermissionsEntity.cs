#region References
using System;
#endregion

#region Namespace
namespace SRMDomain.Entities
{
    public class VisibilityPermissionsEntity
    {
        public Guid Id { get; set; }
        public Guid RoleId { get; set; }
        public string AssignedUser { get; set; }
        public object VisibilityPermissionJson { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion