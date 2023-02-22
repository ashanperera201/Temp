using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface ISiteAuditData
    {
        Task<bool> SaveSiteAuditDate(SiteAuditDateDto siteauditdate, int suplierId, int siteauditid);
        Task<IList<SiteAuditDateDto>> GetSiteAuditDates(int supplierId, int siteauditid);
        Task<int> SaveSiteAuditItem(SiteAuditItemDto siteaudititem);
        Task<IList<SiteAuditItemDto>> GetSiteAuditItems(int supplierId);
        Task<bool> UpdateSiteAuditItem(SiteAuditItemDto siteaudititem);

    }
}
