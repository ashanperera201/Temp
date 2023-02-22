using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SRMDomain.Data;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRM.Controllers
{
    [Route("api/siteaudit")]
    public class SiteAuditController : Controller
    {
        private IConfiguration Configuration;
        public SiteAuditController(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        [HttpPost("SaveDate")]
        public async Task<bool> Save([FromBody] IList<SiteAuditDateDto> date, [FromQuery] int suplierId, int siteauditid)
        {
            var _siteAuditData = new SiteAuditData(Configuration);
            var _siteAuditService = new SiteAuditService(_siteAuditData);
            var result = await _siteAuditService.SaveSiteAuditDate(date, suplierId, siteauditid);
            return result;
        }

        [HttpGet("search")]
        public async Task<IList<SiteAuditDateDto>> SearchInvite([FromQuery] int suplierId, int siteauditid)
        {
            var _siteAuditData = new SiteAuditData(Configuration);
            var _siteAuditService = new SiteAuditService(_siteAuditData);
            var result = await _siteAuditService.GetSiteAuditDates(suplierId, siteauditid);
            return result;
        }

        [HttpPost("SaveItem")]
        public async Task<int> SaveItem([FromBody] SiteAuditItemDto item)
        {
            var _siteAuditData = new SiteAuditData(Configuration);
            var _siteAuditService = new SiteAuditService(_siteAuditData);
            var result = await _siteAuditService.SaveSiteAuditItem(item);
            return result;
        }

        [HttpGet("searchItem")]
        public async Task<IList<SiteAuditItemDto>> SearchItem([FromQuery] int suplierId)
        {
            var _siteAuditData = new SiteAuditData(Configuration);
            var _siteAuditService = new SiteAuditService(_siteAuditData);
            var result = await _siteAuditService.GetSiteAuditItems(suplierId);
            return result;
        }

        [HttpPost("updateItem")]
        public async Task<bool> UpdateItem([FromBody] SiteAuditItemDto item)
        {
            var _siteAuditData = new SiteAuditData(Configuration);
            var _siteAuditService = new SiteAuditService(_siteAuditData);
            var result = await _siteAuditService.UpdateSiteAuditItem(item);
            return result;
        }
    }
}
