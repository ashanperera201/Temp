#region References
using System;
#endregion

#region Namespace
namespace SRMDomain.Entities
{
    public class ApplicationEmailLogs
    {
        public int Id { get; set; }
        public string EmailSentBy { get; set; }
        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }
        public string OtherInformations { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public DateTime? UpdatedOn { get; set; }
    }
}
#endregion