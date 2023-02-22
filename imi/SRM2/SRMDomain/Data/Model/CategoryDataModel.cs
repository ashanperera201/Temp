using System;
using System.Collections.Generic;
using System.Text;

namespace SRMDomain.Data.Model
{
    public class CategoryDataModel
    {
        public int POSITION { get; set; }
        public string GENERALCATEGORYNAME { get; set; }
        public string GENERALCATEGORYCODE { get; set; }
        public string SUBCATEGORYNAME { get; set; }
        public string SUBCATEGORYCODE { get; set; }
        public string DETAILCATEGORYNAME { get; set; }
        public string DETAILCATEGORYCODE { get; set; }
    }
}
