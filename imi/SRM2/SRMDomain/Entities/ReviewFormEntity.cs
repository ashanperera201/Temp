#region Namespace
namespace SRMDomain.Entities
{
    public class ReviewFormEntity
    {
        public int Id { get; set; }
        public string name { get; set; }
        public string form { get; set; }
        public string title { get; set; }
        public string subtitle { get; set; }
        public string status { get; set; }
        public string logo { get; set; }
        public string banner { get; set; }
        public string createdUser { get; set; }
        public string createdUserRole { get; set; }
        public string submittedDate { get; set; }
        public string formType { get; set; }
        public int isActive { get; set; }
        public int? NumberOfApprovelsRequired { get; set; }
        public string ApprovelsReferences { get; set; }

    }
}
#endregion