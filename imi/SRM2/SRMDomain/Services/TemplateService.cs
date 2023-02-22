using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Services
{
    public class TemplateService : ITemplateService
    {
        private readonly ITemplateData _templateData;
        public TemplateService(ITemplateData templateData)
        {
            _templateData = templateData;
        }

        public async Task<bool> SaveTemplate(TemplateDto template)
        {
            var result = await _templateData.SaveTemplate(template);
            return result;
        }

        public async Task<IList<TemplateDto>> SearchTemplate(int templateId)
        {
            var result = await _templateData.SearchTemplate(templateId);
            return result;
        }

        public async Task<IList<SupplierDto>> SearchTemplateQueryData(int templateId, string role, string type)
        {
            var result = await _templateData.SearchTemplateQueryData(templateId, role.Trim(), type);
            return result;
        }

        public async Task<MasterDataDto> GetMasterData()
        {
            var result = await _templateData.GetMasterData();
            return result;
        }

        public async Task<List<UserTemplateStatDto>> SearchUserTemplateStat(string role, string email)
        {
            var result = await _templateData.SearchUserTemplateStat(role.Trim(), email);
            return result;
        }

        public async Task<IList<TemplateDto>> SearchRemainTemplate(string email)
        {
            var result = await _templateData.SearchRemainTemplate(email);
            return result;
        }

        public async Task<bool> SaveUserTemplate(int[] templateIds, string email)
        {
            var returnres = true;

            if (templateIds!=null && templateIds.Length > 0)
            {
               // var result = await _templateData.DeleteUserTemplate(0, email);
                foreach (var templateId in templateIds)
                {
                    returnres = await _templateData.SaveUserTemplate(templateId, email);
                };
            }
            
            return returnres;
        }

        public async Task<bool> DeleteUserTemplate(int templateIds, string email)
        {
            var result = await _templateData.DeleteUserTemplate(templateIds, email);
            return result;
        }

        public async Task<IList<UserDatatableFieldDto>> SearchUserTablefields(string email)
        {
            var result = await _templateData.SearchUserTablefields(email);
            return result;
        }

        public async Task<bool> SaveUserField(UserDatatableFieldDto userTemplate, string email)
        {
            var result = await _templateData.SaveUserField(userTemplate, email);
            return result; 
        }

        public async Task<IList<KpiSupplierDto>> GetKpiData(KpiDto userTemplate)
        {
            var result = await _templateData.GetKpiData(userTemplate);
            return result;
        }

        public async Task<SettingsMasterDto> GetSettingsData()
        {
            var result = await _templateData.GetSettingsData();
            return result;
        }

        public async Task<bool> SaveSettingsData(SettingsMasterDto settings)
        {
            var result = await _templateData.SaveSettingsData(settings);
            return result;
        }

    }
}
