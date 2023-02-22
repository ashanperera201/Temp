using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class MessageDto
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Bcc { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string SupplierId { get; set; }
        public IFormFileCollection Attachments { get; set; }
        public string Recommendation { get; set; }
        public string Outcome { get; set; }

        public MessageDto(IEnumerable<string> to, string subject, string content, string supplierId, IFormFileCollection attachments, string category,
            string recommendation, string outcome, IEnumerable<string> bcc = null)
        {
            bcc ??= new List<string>();
            Bcc = new List<MailboxAddress>();
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            Bcc.AddRange(bcc.Select(x => new MailboxAddress(x)));
            Subject = subject;
            Content = content;
            Attachments = attachments;
            Category = category;
            SupplierId = supplierId;
            Recommendation = recommendation;
            Outcome = outcome;
        }
    }
}
