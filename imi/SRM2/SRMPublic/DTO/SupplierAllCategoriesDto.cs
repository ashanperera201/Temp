using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class SupplierAllCategoriesDto
    {
        public string supplierCode { get; set; }
        public bool isChecked { get; set; }
        public string isSRMChecked { get; set; }
        public string generalCode { get; set; }
        public string generalCategory { get; set; }
        public string subCode { get; set; }
        public string subCategory { get; set; }
        public string detailCode { get; set; }
        public string detailCategory { get; set; }
        public string isHSEQChecked { get; set; }
        public string? hseqUpdatedBy { get; set; }
        public string? hseqUpdatedDateTime { get; set; }
    }
}
