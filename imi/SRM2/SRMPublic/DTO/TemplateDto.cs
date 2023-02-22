using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class TemplateDto
    {
        public int? TemplateId { get; set; }
        public string TemplateName { get; set; }
        public string FilterText { get; set; }
        public string Query { get; set; }
    }

    public class UserTemplateDto
    {
        public int[] templateIds { get; set; }
        public string email { get; set; }
    }
}
