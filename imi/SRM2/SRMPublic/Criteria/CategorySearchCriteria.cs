using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.Criteria
{
    public class CategorySearchCriteria
    {
        public string SearchCriteria { get; set; }
        public int PageNo { get; set; }
        public int Records { get; set; }
        public int Count { get; set; }
        public string UserId { get; set; }
    }
}
