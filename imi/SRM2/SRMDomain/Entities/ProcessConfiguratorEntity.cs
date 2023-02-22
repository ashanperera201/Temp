#region References
using System;
#endregion


#region Namespace
namespace SRMDomain.Entities
{

    public class ProcessConfiguratorEntity
    {
        public int Id { get; set; }
        public string ProcessUniqueCode { get; set; }
        public string ProcessName { get; set; }
        public string ProcessDescription { get; set; }
        public string PhaseOne { get; set; }
        public string PhaseTwo { get; set; }
        public string PhaseThree { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion
