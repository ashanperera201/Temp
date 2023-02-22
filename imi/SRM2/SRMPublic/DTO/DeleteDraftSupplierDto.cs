using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class DeleteDraftSupplierDto
    {
        public string supplier_name { get; set; }
        public string supplier_email { get; set; }
        public string cr_no { get; set; }
        public string type { get; set; }
    }
}