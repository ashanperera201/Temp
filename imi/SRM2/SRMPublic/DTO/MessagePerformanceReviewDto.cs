using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class MessagePerformanceReviewDto
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Bcc { get; set; }
        public string suppliers { get; set; }
        public string period { get; set; }

        public string subject = "Invitation to Review Supplier";

        public string evaluationName { get; set; }

        public MessagePerformanceReviewDto(IEnumerable<string> to, string reviewSuppliers, string reviewPeriod, string name)
        {
            Bcc = new List<MailboxAddress>();
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            suppliers = reviewSuppliers;
            period = reviewPeriod;
            evaluationName = name;
        }
    }
}
