using SRMDomain.Data.Model;
using SRMPublic.Criteria;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface ICategoryData
    {
        Task<IList<CategoryDataModel>> SearchCategoryAsync(CategorySearchCriteria categoryParams);
        Task<IList<CategoryDto>> SearchCategories();
    }
}
