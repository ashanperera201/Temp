using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SRMDomain.Data;
using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMDomain.Services;
using SRMPublic.Criteria;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRM.Controllers
{
    [Route("api/categories")]
    public class CategoryController : Controller
    {
        //private readonly ICategoryData _categoryData = new CategoryData();
        private IConfiguration Configuration;

        //private readonly ICategoryService _categoryService ;
        public CategoryController(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        [HttpGet("search")]
        public async Task<IList<CategoryDto>> SearchCategories([FromQuery] CategorySearchCriteria searchParam)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _categoryData = new CategoryData(Configuration);
            var _categoryService = new CategoryService(_categoryData);
            var result = await _categoryService.Search(searchParam);
            return result;
        }

        [HttpGet]
        public async Task<IList<CategoryDto>> SearchCategories()
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _categoryData = new CategoryData(Configuration);
            var _categoryService = new CategoryService(_categoryData);
            var result = await _categoryService.SearchCategories();
            return result;
        }
    }
}
