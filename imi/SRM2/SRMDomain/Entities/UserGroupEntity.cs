#region References
using System;
#endregion

#region Namespace
namespace SRMDomain.Entities
{
    public class UserGroupEntity
    {
        public int Id { get; set; }
        public int UserGroupId { get; set; }
        public string UserGroup { get; set; }
        public string CompanyCode { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion