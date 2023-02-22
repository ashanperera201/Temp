using System.Collections.Generic;

namespace SRMPublic.DTO
{
    public class SupplierChangesDto
    {
        public SupplierChangesDto(int supplierId, string supplierName, string status, string submittedDate, IList<Property> changedProperties,
                                  SupplierCategoryDto[] oldCategories, SupplierCategoryDto[] newCategories, bool isCategoryChange, bool isBanckChange, bool isGeneralChange)
        {
            this.supplierId = supplierId;
            this.supplierName = supplierName;
            this.status = status;
            this.submittedDate = submittedDate;
            this.changedProperties = changedProperties;
            this.oldCategories = oldCategories;
            this.newCategories = newCategories;
            this.isCategoryChange = isCategoryChange;
            this.isBanckChange = isBanckChange;
            this.isGeneralChange = isGeneralChange;
        }

        public int supplierId { get; set; }
        public string supplierName { get; set; }
        public string status { get; set; }
        public string submittedDate { get; set; }
        public IList<Property> changedProperties { get; set; }
        public SupplierCategoryDto[] oldCategories { get; set; }
        public SupplierCategoryDto[] newCategories { get; set; }
        public bool isCategoryChange { get; set; }
        public bool isBanckChange { get; set; }
        public bool isGeneralChange { get; set; }
    }

    public class Property
    {
        public Property(string property, string page, string tab, string fieldName, string oldValue, string newValue, string type)
        {
            this.property = property;
            this.page = page;
            this.tab = tab;
            this.fieldName = fieldName;
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.type = type;
        }

        public string property { get; set; }
        public string page { get; set; }
        public string tab { get; set; }
        public string fieldName { get; set; }
        public string oldValue { get; set; }
        public string newValue { get; set; }
        public string type { get; set; }
    }    
}
    


