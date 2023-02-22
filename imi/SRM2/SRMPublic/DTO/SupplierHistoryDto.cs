using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SupplierHistoryDto
    {
        public int status_id { get; set; }
        public string supplier_id { get; set; }
        public string status_remark { get; set; }
        public string status_comment { get; set; }
        public string iscurrentstatus { get; set; }
        public string userid { get; set; }
        public string userrole { get; set; }
        public DateTime? createddate { get; set; }
        public string ÇommandName { get; set; }
        public string? useremail { get; set; }

        //public DateTime updateddate { get; set; }
    }
}
