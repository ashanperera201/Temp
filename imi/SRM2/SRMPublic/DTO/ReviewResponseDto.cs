namespace SRMPublic.DTO
{
    public class ReviewResponseDto
    {
        public int id { get; set; }
        public int reviewSessionId { get; set; }
        public string createdDate { get; set; }
        public string review { get; set; }
        public string evaluationName { get; set; }
        public string status { get; set; }
        public string modifiedDate { get; set; }
        public string conductedUser { get; set; }
        public double score { get; set; }
        public string title { get; set; }
        public string subtitle { get; set; }
        public int supplierId { get; set; }
        public string? supplierName { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string periodType { get; set; }
        public string reviewYear { get; set; }
        public string presetPeriod { get; set; }
        public string createdUser { get; set; }
        public string createdEmail { get; set; }
        public int formId { get; set; }
        public string logo { get; set; }
        public string banner { get; set; }
        public string approvalInitiationDate { get; set; }
        public double finalScore { get; set; }
        public string outcome { get; set; }
        public string supplierEmail { get; set; }
        public string supervisorName { get; set; }
        public string supervisorEmail { get; set; }

    }
}
