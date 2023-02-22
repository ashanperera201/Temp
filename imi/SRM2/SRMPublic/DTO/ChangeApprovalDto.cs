using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class ChangeApprovalDto
    {
        public int supplierId { get; set; }
        public string supplierName { get; set; }
        public string status { get; set; }
        public string submittedDate { get; set; }
        public bool isGeneralChange { get; set; }
        public bool isCategoryChange { get; set; }
        public bool isBanckChange { get; set; }
    }

    public class SuppliersTabChangeDto
    {
        public int supplierId { get; set; }
        public string supplierDto { get; set; }
        public string submittedDate { get; set; }
    }
}
