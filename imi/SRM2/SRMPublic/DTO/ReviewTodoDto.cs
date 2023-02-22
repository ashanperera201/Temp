using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class ReviewTodoDto
    {
        public int id { get; set; }
        public string actionType { get; set; }
        public string status { get; set; }
        public string actionTakerUsername { get; set; }
        public string createdDate { get; set; }
        public string modifiedDate { get; set; }
        public int reviewResponseId { get; set; }
        public string evaluationName { get; set; }
        public string supplierName { get; set; }
        public string services { get; set; }
    }
}
