using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SupplierApprovedItemsDto
    {
        public string SUPPLIER_ID { get; set; }
        public string DECISION_OUTCOME { get; set; }
        public string DECISION_REMARKS { get; set; }
        public string PROPERTY_COMMENT { get; set; }
        public string PROPERTY_OUTCOME { get; set; }
        public string ADDITIONAL_COMMENT { get; set; }
        public string? LAST_UPDATED_DATE { get; set; }
        public string USERID { get; set; }
        public string USERROLE { get; set; }
        public DateTime? CREATEDDATE { get; set; }
        public int? ID { get; set; }
    }
}
