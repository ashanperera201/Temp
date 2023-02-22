using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface IEmailData
    {
        Task<List<string>> GetWorkflowRoleEmail(string rolename);
        Task<IList<SupplierDto>> GetRegisteredSupplier(string supplierId);
        Task<IList<SupplierDto>> GetTempRegisteredSupplier(string supplierId);
        Task<SettingsMasterDto> GetSettingsData();
    }
}
