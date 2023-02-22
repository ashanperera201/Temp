#region References
using System;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class UserGroupDetailDto
    {
        public int Id { get; set; }
        public string UserIds { get; set; }
        public int GroupId { get; set; }
        public string Department { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion