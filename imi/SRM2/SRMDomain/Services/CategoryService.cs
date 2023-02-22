using SRMDomain.Data;
using SRMDomain.Data.Interfaces;
using SRMDomain.Data.Model;
using SRMDomain.Interfaces;
using SRMPublic.Criteria;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryData _categoryData;
        public CategoryService(ICategoryData categoryData)
        {
            _categoryData = categoryData;
        }
        public async Task<IList<CategoryDto>> Search(CategorySearchCriteria searchParams)
        {
            var result = await _categoryData.SearchCategoryAsync(searchParams);
            var data = MapDataToDto(result);
            return data;
        }

        public async Task<IList<CategoryDto>> SearchCategories()
        {
            var result = await _categoryData.SearchCategories();
            return result;
        }

        public IList<CategoryDto> MapDataToDto(IList<CategoryDataModel> categorylist)
        {
            IList<CategoryDto> categoryList = new List<CategoryDto>();
            foreach (var category in categorylist)
            {
                categoryList.Add(
                new CategoryDto()
                {
                    DETAILCATEGORYNAME = category.DETAILCATEGORYNAME,
                    GENERALCATEGORYNAME = category.GENERALCATEGORYNAME,
                    SUBCATEGORYNAME = category.SUBCATEGORYNAME,
                    DETAILCATEGORYCODE = category.DETAILCATEGORYCODE,
                    GENERALCATEGORYCODE = category.GENERALCATEGORYCODE,
                    SUBCATEGORYCODE = category.SUBCATEGORYCODE,
                    POSITION = category.POSITION
                }
                );
            }
            return categoryList;
        }
    }
}
