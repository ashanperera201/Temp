using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class PortalToMsFlowDto
    {
        public string command { get; set; }
        public string procesID { get; set; }
        public string comment { get; set; }
        public string supplierID { get; set; }
        public string supplier_code { get; set; }
        public string workflowCurrentStatus { get; set; }
        public string supplierStatus { get; set; }
        public int criticality { get; set; }
        public string role { get; set; }
        public string triggeredBy { get; set; }

}
}