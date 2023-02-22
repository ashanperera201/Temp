namespace SRMPublic.DTO
{
    public class ReviewApproverDto
    {
        public int id { get; set; }
        public int outcomeId { get; set; }
        public int reviewResponseId { get; set; }
        public int approverId { get; set; }
        public string approverName { get; set; }
        public string status { get; set; }
        public string createdDate { get; set; }
        public string modifiedDate { get; set; }
        public string email { get; set; }
        public int stepNo { get; set; }
        public string comments { get; set; }
        public string type { get; set; }
        public string role { get; set; }
        public string conductedUser { get; set; }


    }
}
