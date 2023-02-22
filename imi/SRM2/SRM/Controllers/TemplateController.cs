using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SRMDomain.Data;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SRM.Controllers
{
    [Route("api/template")]
    public class TemplateController : Controller
    {
        private IConfiguration Configuration;

        public TemplateController(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        [HttpGet]
        public async Task<IList<TemplateDto>> SearchTemplate([FromQuery] int templateId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SearchTemplate(templateId);
            return result;
        }

        [HttpPost]
        public async Task<bool> SaveTemplate([FromBody] TemplateDto template)
        {
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SaveTemplate(template);
            return result;
        }

        [HttpGet("querydata")]
        public async Task<IList<SupplierDto>> SearchTemplateQueryData([FromQuery] int templateId, string role, string type)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SearchTemplateQueryData(templateId,role.Trim(), type);
            return result;
        }

        [HttpGet("masterdata")]
        public async Task<MasterDataDto> GetMasterData()
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.GetMasterData();
            return result;
        }

        [HttpGet("IsValidUri")]
        public bool IsValidUri(string uri)
        {
            string pattern1 = @"^(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)$";

            string pattern = @"^((www)\.)([a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+.*)$";
            Regex reg = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase);
                    return reg.IsMatch(uri);
        }

        [HttpGet("userTemplates")]
        public async Task<List<UserTemplateStatDto>> SearchUserTemplateStat([FromQuery] string role, string email)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SearchUserTemplateStat(role.Trim(), email);
            return result;
        }

        [HttpGet("userRemainTemplates")]
        public async Task<IList<TemplateDto>> SearchRemainTemplate([FromQuery] string email)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SearchRemainTemplate(email);
            return result;
        }

        [HttpPost("SaveUserTemplate")]
        public async Task<bool> SaveUserTemplate([FromBody] UserTemplateDto userTemplate)
        {
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SaveUserTemplate(userTemplate.templateIds, userTemplate.email);
            return result;
        }

        [HttpGet("DeleteSaveUserTemplate")]
        public async Task<bool> SaveUserTemplate([FromQuery] int templateId, string email)
        {
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.DeleteUserTemplate(templateId, email);
            return result;
        }

        [HttpGet("userDatatableFields")]
        public async Task<IList<UserDatatableFieldDto>> SearchUserTablefields([FromQuery] string email)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SearchUserTablefields( email);
            return result;
        }

        [HttpPost("SaveUserField")]
        public async Task<bool> SaveUserField([FromBody] UserDatatableFieldDto userTemplate, string email)
        {
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SaveUserField(userTemplate, email);
            return result;
        }

        [HttpPost("kpiData")]
        public async Task<IList<KpiSupplierDto>> GetKpiData([FromBody] KpiDto userTemplate)
        {
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.GetKpiData(userTemplate);
            return result;
        }

        [HttpGet("srmsettings")]
        public async Task<SettingsMasterDto> SearchSRMSetting()
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.GetSettingsData();
            return result;
        }

        [HttpPost("srmsettingssave")]
        public async Task<bool> SaveSRMSetting([FromBody] SettingsMasterDto settings)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _templateData = new TemplateData(Configuration);
            var _templateService = new TemplateService(_templateData);
            var result = await _templateService.SaveSettingsData(settings);
            return result;
        }
    }
}
