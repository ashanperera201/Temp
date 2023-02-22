﻿using Microsoft.AspNetCore.Http;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace SRMPublic.DTO
{
    public class AuditMessageDto
    {
        public List<MailboxAddress> To { get; set; }
        public List<MailboxAddress> Cc { get; set; }
        public string Subject { get; set; }
        public IList<SiteAuditDateDto> Auditdates { get; set; }
        public string Content { get; set; }
        public string Category { get; set; }
        public string SupplierId { get; set; }
        public IFormFileCollection Attachments { get; set; }
        public AuditMessageDto(IEnumerable<string> to, IEnumerable<string> cc, string subject, string content, string supplierId, IFormFileCollection attachments, string category,IList<SiteAuditDateDto> auditdates)
        {
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress(x)));
            Cc = new List<MailboxAddress>();
            Cc.AddRange(cc.Select(x => new MailboxAddress(x)));
            Subject = subject;
            Content = content;
            Attachments = attachments;
            Category = category;
            SupplierId = supplierId;
            Auditdates = auditdates;
        }
    }
}
