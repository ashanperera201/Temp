#region References
using System;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class EmailTemplateDto
    {
        public int Id { get; set; }
        public string TemplateUniqueId { get; set; }
        [Required(ErrorMessage = "Email template code is required.")]
        public string EmailTemplateCode { get; set; }
        [Required(ErrorMessage = "Email template name is required.")]
        public string EmailTemplateName { get; set; }
        public string HtmlContent { get; set; }
        [Required (ErrorMessage = "Footer signature is required.")]
        public string FooterSignature { get; set; }
        [Required(ErrorMessage = "Header signature is required.")]
        public string HeaderSignature { get; set; }
        public string ThanksGivingSection { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion