#region References
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class EmailDto
    {
        [Required]
        public List<string> To { get; set; }
        public List<string> Bcc { get; set; }
        public List<string> Cc { get; set; }
        public string DisplayName { get; set; }
        public string ReplyTo { get; set; }
        public string ReplyToName { get; set; }
        [Required]
        public string Subject { get; set; }
        [Required]
        public string Body { get; set; }
    }
}
#endregion