using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class MessageSupplierReviewCompletedDto
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Bcc { get; set; }
        public string suppliers { get; set; }
        public string period { get; set; }
        public string reviewOutcome { get; set; }
        public string reviewScore { get; set; }

        public string subject = "Performance Evaluation Outcome";

        public string evaluationName { get; set; }
        public MessageSupplierReviewCompletedDto(IEnumerable<string> to, string reviewPeriod, string name, string score, string outcome)
        {
            Bcc = new List<MailboxAddress>();
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            reviewOutcome = outcome;
            reviewScore = score;
            period = reviewPeriod;
            evaluationName = name;
        }
    }
}
