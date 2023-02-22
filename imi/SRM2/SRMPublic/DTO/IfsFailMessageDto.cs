using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class IfsFailMessageDto
    {
        public string supplierId { get; set; }
        public string supplierName { get; set; }
        public string supplierEmail { get; set; }
        public string category { get; set; }
        public string message { get; set; }

    }
}