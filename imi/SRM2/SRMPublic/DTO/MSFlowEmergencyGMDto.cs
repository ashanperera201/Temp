using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class MSFlowEmergencyGMDto
    {
        public string MessageId { get; set; }
        public string Subject { get; set; }
        public string Date { get; set; }
        public string To { get; set; }
        public string Cc { get; set; }
        public string MailBody { get; set; }
        public string ContentId { get; set; }
        public string Category { get; set; }
        public string SupplierId { get; set; }
        public string SupplierName { get; set; }
    }
}