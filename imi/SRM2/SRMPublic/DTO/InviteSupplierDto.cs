using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class InviteSupplierDto
    {
        public int invite_supplier_id { get; set; }
        public string invite_supplier_name { get; set; }
        public string email { get; set; }
        public string establishment_year { get; set; }
        public string[] supplier_type { get; set; }
        public string country { get; set; }
        public string city { get; set; }
        public string other_city { get; set; }
        public string po_box { get; set; }
        public string postal_code { get; set; }
        public string address_line1 { get; set; }
        public string address_line2 { get; set; }
        public string title { get; set; }
        public string first_name { get; set; }
        public string last_name { get; set; }
        public string telphone_country_code { get; set; }
        public string telephone_no { get; set; }
        public string extension { get; set; }
        public string mobile_country_code { get; set; }
        public string mobile_no { get; set; }
        public string fax_country_code { get; set; }
        public string fax_no { get; set; }
        public string cr_no { get; set; }
        public string cr_exp_date { get; set; }
        public string justification { get; set; }
        public string position { get; set; }
        public string? workflow_id { get; set; }
        public string? process_id { get; set; }
        public string? status { get; set; }
        public string create_date_time { get; set; }
        public string invite_by { get; set; }
        public string invite_by_email { get; set; }
        public string invite_by_role { get; set; }
        public string re_invite_date_time { get; set; }
        public string re_invite_by { get; set; }
        public string re_invite_by_email { get; set; }
        public string re_invite_by_role { get; set; }
        public string update_date_time { get; set; }
        public string update_by { get; set; }
        public string update_by_email { get; set; }
        public string update_by_role { get; set; }
    }
}
