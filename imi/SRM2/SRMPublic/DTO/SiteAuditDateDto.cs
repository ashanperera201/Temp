using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SiteAuditDateDto
    {
        public DateTime audit_date { get; set; }
        public string audit_time { get; set; }
        public int? SupplierId { get; set; }
        public int? SiteAuditId { get; set; }

    }
}
