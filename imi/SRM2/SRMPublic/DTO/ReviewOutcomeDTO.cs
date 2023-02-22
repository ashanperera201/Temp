namespace SRMPublic.DTO
{
    public class ReviewOutcomeDto
    {
        public int id { get; set; }
        public int sessionId { get; set; }
        public int supplierId { get; set; }
        public string outcome { get; set; }
        public double finalScore { get; set; }
        public string gradeCategories { get; set; }
        public string gradingMethod { get; set; }
        public string reviewerWeights { get; set; }
        public int minGradeThreshold { get; set; }
        public string supplierName { get; set; }
        public string evaluationName { get; set; }
        public string status { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string periodType { get; set; }
        public string reviewYear { get; set; }
        public string presetPeriod { get; set; }
        public string createdUser { get; set; }
        public string createdDate { get; set; }
        public string? modifiedDate { get; set; }
        public string? supplierType { get; set; }
        public string? assignedUsers { get; set; }
        public string? scheduled { get; set; }
        public string? frequency { get; set; }
        public string? supplierEmail { get; set; }
        public string? supplierStatus { get; set; }
        public string? supplierCode { get; set; }
        public string? services { get; set; }
    }
}
