#region References
using System;
using System.Collections.Generic;
#endregion

#region Namespace
namespace SRMDomain.Entities
{
    public class RoleEntity
    {
        public Guid Id { get; set; }
        public string RoleName { get; set; }
        public string RoleCode { get; set; }
        public string RoleDescription { get; set; }
        public string RoleType { get; set; }
        public string RoleAssignedUserId { get; set; }
        public IEnumerable<VisibilityPermissionsEntity> VisibilityPermissionsEntity { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion
