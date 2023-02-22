using SRMPublic.Criteria;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Interfaces
{
    public interface ICategoryService
    {
        Task<IList<CategoryDto>> Search(CategorySearchCriteria searchParams);
        Task<IList<CategoryDto>> SearchCategories();
    }
}
