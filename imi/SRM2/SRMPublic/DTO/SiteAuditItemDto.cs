using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SiteAuditItemDto
    {
        public int Site_audit_id { get; set; }
        public string Supplier_id { get; set; }
        public string audit_remark { get; set; }
        public DateTime audit_date_final { get; set; }
        public string audit_time_final { get; set; }
        public string final_Date_remark { get; set; }
        public string additional_comment { get; set; }
        public string non_confirmity { get; set; }
        public DateTime last_updated_date { get; set; }
        public string userId { get; set; }
        public string userRole { get; set; }
        public DateTime createdDate { get; set; }
    }
}
