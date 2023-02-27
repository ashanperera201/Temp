#region References
using System;
#endregion

#region Namespace
namespace SRMDomain.Entities
{
    public class EmailTemplateEntity
    {
        public int Id { get; set; }
        public string TemplateUniqueId { get; set; }
        public string EmailTemplateCode { get; set; }
        public string EmailTemplateName { get; set; }
        public string HtmlContent { get; set; }
        public string FooterSignature { get; set; }
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