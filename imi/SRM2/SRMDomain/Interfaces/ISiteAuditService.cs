using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Interfaces
{
    public interface ISiteAuditService
    {
        Task<bool> SaveSiteAuditDate(IList<SiteAuditDateDto> siteauditdate, int suplierId, int siteauditid);
        Task<IList<SiteAuditDateDto>> GetSiteAuditDates(int supplierId, int siteauditid);
        Task<int> SaveSiteAuditItem(SiteAuditItemDto siteaudititem);
        Task<IList<SiteAuditItemDto>> GetSiteAuditItems(int supplierId);
        Task<bool> UpdateSiteAuditItem(SiteAuditItemDto siteaudititem);
    }
}
