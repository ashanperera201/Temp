using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface ITemplateData
    {
        Task<IList<TemplateDto>> SearchTemplate(int templateId);
        Task<bool> SaveTemplate(TemplateDto template);
        Task<IList<SupplierDto>> SearchTemplateQueryData(int templateId, string role, string type);
        Task<MasterDataDto> GetMasterData();
        Task<List<UserTemplateStatDto>> SearchUserTemplateStat(string role, string email);
        Task<IList<TemplateDto>> SearchRemainTemplate(string email);
        Task<bool> SaveUserTemplate(int templateIds, string email); 
        Task<bool> DeleteUserTemplate(int templateIds, string email);
        Task<IList<UserDatatableFieldDto>> SearchUserTablefields(string email);
        Task<bool> SaveUserField(UserDatatableFieldDto userTemplate, string email);
        Task<IList<KpiSupplierDto>> GetKpiData(KpiDto userTemplate);
        Task<SettingsMasterDto> GetSettingsData();
        Task<bool> SaveSettingsData(SettingsMasterDto settings);
    }
}
