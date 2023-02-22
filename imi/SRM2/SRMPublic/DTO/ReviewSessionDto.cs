namespace SRMPublic.DTO
{
    public class ReviewSessionDto
    {
        public int id { get; set; }
        public int formId { get; set; }
        public string suppliers { get; set; }
        public string evaluationName { get; set; }
        public string createdDate { get; set; }
        public string status { get; set; }
        public string reviewYear { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string presetPeriod { get; set; }
        public string periodType { get; set; }
        public string modifiedDate { get; set; }
        public string createdUser { get; set; }
        public string assignedUsers { get; set; }
        public string gradeCategories { get; set; }
        public string gradingMethod { get; set; }
        public string reviewerWeights { get; set; }
        public int minGradeThreshold { get; set; }
        public string assignedUserRoles { get; set; }
        public string assignType { get; set; }
        public int supplierBlocker { get; set; }
        public string frequency { get; set; }
        public int scheduled { get; set; }
        //public int materials { get; set; }
        public string services { get; set; }
        public int scored { get; set; }


    }
}
