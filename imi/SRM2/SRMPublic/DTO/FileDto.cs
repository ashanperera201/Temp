using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class FileDto
    {
        public int Id { get; set; }
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public int SupplierIdFile { get; set; }
        public string Category { get; set; }

    }
}
