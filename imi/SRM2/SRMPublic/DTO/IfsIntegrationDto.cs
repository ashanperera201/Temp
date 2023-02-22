using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class IfsIntegrationDto
    {
       public int supplierId { get; set; }
       public string supplierName { get; set; }
       public string supplierCode { get; set; }
       public string supplierEmail { get; set; }
       public string status { get; set; }
        public string category { get; set; }
       public string error { get; set; }
       public string userrole { get; set; }
       public string interfacedDate { get; set; }

    }

    public class IfsHistoryUpdateDto
    {
        public int supplierId { get; set; }
        public string changerEmail { get; set; }
        public string changerRole { get; set; }
        public string changerName { get; set; }
        public string interfacedDate { get; set; }
        public string fieldName { get; set; }
        public string changedFrom { get; set; }
        public string ChangedTo { get; set; }
    }
}
