#region References
using System;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class SupplierV2Dto
    {
        public int Id { get; set; }
        public string SupplierUniqueId { get; set; }
        public string supplierName { get; set; }
        public string SupplierContact { get; set; }
        public string SupplierFirstName { get; set; }
        public string SupplierLastName { get; set; }
        public string SupplierMiddleName { get; set; }
        public string SupplierEmail { get; set; }
        public string SupplierCriticality { get; set; }
        public string AdditionalInformations { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion