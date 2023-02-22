#region References
using System;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class UserGroupDto
    {
        public int? Id { get; set; }
        [Required(ErrorMessage = "User group is required.")]
        public string UserGroup { get; set; }
        [Required(ErrorMessage = "Company is required.")]
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