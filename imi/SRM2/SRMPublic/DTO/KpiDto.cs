using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class KpiDto
    {
        public int startindex { get; set; }
        public int pagesize { get; set; }
        public string? suppliername { get; set; }
        public string? suppliercode { get; set; }
        public string? status { get; set; }
        public string? ifscode { get; set; }
        public string? location { get; set; }
        public string? country { get; set; }
        public string? classification { get; set; }
        public string? createdfrom { get; set; }
        public string? createdto { get; set; }
        public string? lastsubmitfrom { get; set; }
        public string? lastsubmitto { get; set; }
        public string? srmreviewfrom { get; set; }
        public string? srmreviewto { get; set; }
        public string? auditcompletefrom { get; set; }
        public string? auditcompleteto { get; set; }
        public string? srmrecomfrom { get; set; }
        public string? srmrecomto { get; set; }
        public string? gmapprovedfrom { get; set; }
        public string? gmapprovedto { get; set; }
        public string? vpapprovedfrom { get; set; }
        public string? vpapprovedto { get; set; }
        public string? srmreviewdur { get; set; }
        public string? regisdur { get; set; }
        public string? auditcom { get; set; }
        public string? deptkpi { get; set; }
        public string? deptkpiResult { get; set; }
        public string? srmkpi { get; set; }
        public string? srmkpiResult { get; set; }
    }

    public class KpiSupplierDto
    {
        public int SUPPLIER_ID { get; set; }
        public string SUPPLIER_NAME { get; set; }
        public string SUPPLIER_CODE { get; set; }
        public string STATUS { get; set; }
        public string IFS_CODE { get; set; }
        public string SUPPLIER_LOCATION { get; set; }
        public string COUNTRY { get; set; }
        public string SUPPLIER_CLASSIFICATION { get; set; }
        public string CREATED_DATE { get; set; }
        public string LAST_SUPPLIER_SUBMITTED_DATE { get; set; }
        public string LAST_SRM_REVIEW_DATE { get; set; }
        public string AUDIT_COMPLETION_DATE { get; set; }
        public string LAST_SRM_RECOMMANDED_DATE { get; set; }
        public string GM_APPROVED_DATE { get; set; }
        public string VP_APPROVED_DATE { get; set; }
        public string SRM_REVIEW_DURATION { get; set; }
        public string REGISTRATION_DURATION { get; set; }
        public string AUDIT_COMPLETION { get; set; }
        public string DEPARTMENT_KPI { get; set; }
        public string DEPARTMENT_KPI_RESULT { get; set; }
        public string SRM_KPI { get; set; }
        public string SRM_KPI_RESULT { get; set; }
        public int TOT_COUNT { get; set; }
    }
}
