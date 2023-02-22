using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Services
{
    public class SiteAuditService : ISiteAuditService
    {
        private readonly ISiteAuditData _siteAuditData;
        public SiteAuditService(ISiteAuditData siteAuditData)
        {
            _siteAuditData = siteAuditData;
        }
        public async Task<bool> SaveSiteAuditDate(IList<SiteAuditDateDto> siteauditdate, int suplierId, int siteauditid)
        {
            var result = false;
            foreach (var item in siteauditdate)
            {
                result = await _siteAuditData.SaveSiteAuditDate(item, suplierId, siteauditid);

            }
            return result;
        }
        public async Task<IList<SiteAuditDateDto>> GetSiteAuditDates(int supplierId, int siteauditid)
        {
            var result = await _siteAuditData.GetSiteAuditDates(supplierId, siteauditid);
            return result;
        }

        public async Task<int> SaveSiteAuditItem(SiteAuditItemDto siteaudititem)
        {
            var result = await _siteAuditData.SaveSiteAuditItem(siteaudititem);
            return result;
        }

        public async Task<IList<SiteAuditItemDto>> GetSiteAuditItems(int supplierId)
        {
            var result = await _siteAuditData.GetSiteAuditItems(supplierId);
            return result;
        }

        public async Task<bool> UpdateSiteAuditItem(SiteAuditItemDto siteaudititem)
        {
            var result = await _siteAuditData.UpdateSiteAuditItem(siteaudititem);
            return result;
        }
    }
}
