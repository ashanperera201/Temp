using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class EmergencyApprovedItems
    {
        public int SupplierId { get; set; }
        public string Status { get; set; }
        public string CURRENT_POSITION { get; set; }
        public DateTime? DUE_DATE { get; set; }
        public DateTime? HANDLE_BEFORE { get; set; }
        public DateTime? HANDLE_DATE { get; set; }
        public DateTime? CREATEDDATE { get; set; }
        public DateTime? OUTCOME { get; set; }
        public string OUTCOME_REASON { get; set; }
        public string USERID { get; set; }
        public string USERROLE { get; set; }
        public string Action_Command { get; set; }

    }
}
