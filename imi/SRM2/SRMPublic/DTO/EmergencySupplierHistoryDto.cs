using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class EmergencySupplierHistoryDto
    {
        public string supplier_id { get; set; }
        public string status { get; set; }
        public string current_position { get; set; }
        public string due_date { get; set; }
        public string handle_before { get; set; }
        public DateTime handle_date { get; set; }
        public string outcome { get; set; }
        public string outcome_reason { get; set; }
        public string user_id { get; set; }
        public string user_role { get; set; }
        public DateTime createddate { get; set; }
        public string id { get; set; }
        public string action_command { get; set; }
    }
}
