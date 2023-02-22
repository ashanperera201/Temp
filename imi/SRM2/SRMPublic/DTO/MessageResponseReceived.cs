using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class MessageResponseReceivedDTO
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Bcc { get; set; }
        public string supplierName { get; set; }
        public string period { get; set; }
        public string subject = "Received response from reviewer";
        public string reviewer { get; set; }
        public string sessionCreator { get; set; }
        public string evaluationName { get; set; }

        public MessageResponseReceivedDTO(IEnumerable<string> to, string reviewSupplierName, string reviewPeriod,
             string reviewerValue, string evaluationNameValue, string sessionCreatorValue)
        {
            Bcc = new List<MailboxAddress>();
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            supplierName = reviewSupplierName;
            period = reviewPeriod;
            reviewer = reviewerValue;
            evaluationName = evaluationNameValue;
            sessionCreator = sessionCreatorValue;
        }
    }
}
