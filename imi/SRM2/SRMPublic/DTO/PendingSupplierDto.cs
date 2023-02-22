using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class PendingSupplierDto
    {
        public int supplier_id { get; set; }
        public string supplier_code { get; set; }
        public string supplier_name { get; set; }
        public string type { get; set; }
        public string wfstatus { get; set; }
        public string created_date { get; set; }
        public string email { get; set; }
        public string establishment_year { get; set; }
        public string country { get; set; }
        public string city { get; set; }
        public string vat_no { get; set; }
        public string po_box { get; set; }
        public string postal_code { get; set; }
        public string gosi_date { get; set; }
        public string iban_no { get; set; }
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
        public string ifs_code { get; set; }
        public string additional_material { get; set; }
        public string reg_date { get; set; }
        public string zakath_date { get; set; }
        public string saudi_date { get; set; }
        public string website { get; set; }
        public string pushed_supplier_status { get; set; }
        public string role { get; set; }
        public string buyer_name { get; set; }
        public string buyer_email { get; set; }
        public string supplier_status { get; set; }
        public string criticality { get; set; }
        public string? returned { get; set; }
        public string? hijri_selected { get; set; }


    }
}
