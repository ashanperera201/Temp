using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class EmailConfigDto
    {
        public string From { get; set; }
        public string SmtpServer { get; set; }
        public int Port { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string wfendpoint { get; set; }
        public string wfcmdendpoint { get; set; }
        public string SupplierPortalSinUpUrl { get; set; }
        public string supplierPerformanceUrl { get; set; }
        public string supplierRegistrationForm { get; set; }
        public string supplierPortalSupplierPerformanceUrl { get; set; }
        public string EmailLink { get; set; }


    }
}
