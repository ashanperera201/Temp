#region References
using System;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class SrmUserDto
    {
        public int? Id { get; set; }
        public Guid UserId { get; set; }
        [Required(ErrorMessage = "User name is required.")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }
        public string Password { get; set; }
        public string PasswordSalt { get; set; }
        [Required(ErrorMessage = "Full name is required.")]
        public string FullName { get; set; }
        [Required(ErrorMessage = "source is required.")]
        public string Source { get; set; }
        public string LoginMethod { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public string DefaultLang { get; set; }
        public string DefaultCurrency { get; set; }
        public string UserGroups { get; set; }
        public bool IsActive { get; set; }
        public string UserImageUrl { get; set; }
        public string CreatedBy { get; set; }
        public UserLogDto UserLog { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }

    public class SrmUserFilterDto
    {
        public string Email { get; set; }
        public string UserName { get; set; }
        public string UserId { get; set; }
    } 
}
#endregion
