using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class MessageReviewApprovalDTO
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Cc { get; set; }
        public List<MailboxAddress> Bcc { get; set; }
        public string supplierName { get; set; }
        public string period { get; set; }

        public string subject = "Invitation to Approve Supplier Review Responses";
        public string evaluationName { get; set; }
        public string approver { get; set; }
        public string reviewer { get; set; }

        public MessageReviewApprovalDTO(IEnumerable<string> to, string reviewSupplierName, string reviewPeriod, string name, string approverValue, 
            string reviewerValue)
        {
            Bcc = new List<MailboxAddress>();
            Cc = new List<MailboxAddress>();
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            supplierName = reviewSupplierName;
            period = reviewPeriod;
            evaluationName = name;
            approver = approverValue;
            reviewer = reviewerValue;
        }
    }
}
