using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class MessageReviewReinitiationDTO
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Cc { get; set; }
        public List<MailboxAddress> Bcc { get; set; }
        public string supplierName { get; set; }
        public string period { get; set; }
        public string subject = "Invitation to Resubmit Supplier Review Response";
        public string reviewer { get; set; }
        public string evaluationName { get; set; }
        public string comment { get; set; }

        public MessageReviewReinitiationDTO(IEnumerable<string> to, IEnumerable<string> cc, string reviewSupplierName, string reviewPeriod,
             string reviewerValue, string evaluationNameValue, string commentValue)
        {
            Bcc = new List<MailboxAddress>();
            Cc = new List<MailboxAddress>();
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            Cc.AddRange(cc.Select(x => new MailboxAddress(x)));
            supplierName = reviewSupplierName;
            period = reviewPeriod;
            reviewer = reviewerValue;
            evaluationName = evaluationNameValue;
            comment = commentValue;
        }
    }
}
