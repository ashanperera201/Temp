using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SRM.Util;
using SRMDomain.Data;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Http;

namespace SRM.Controllers
{
    [Route("api/supplier")]
    public class SupplierController : Controller
    {
        private IConfiguration Configuration;
        private readonly EmailConfigDto _emailConfig;
        public SupplierController(IConfiguration _configuration, EmailConfigDto emailConfig)
        {
            Configuration = _configuration;
            _emailConfig = emailConfig;
        }

        [HttpPost("updateCriticality")]
        public async Task<bool> UpdateCriticality([FromBody] SupplierCriticalityDto criticality)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateCriticality(criticality);
            return result;
        }

        [HttpPost("saveCriticality")]
        public async Task<bool> SaveCriticality([FromBody] IList<CriticalityDto> criticality, int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveCriticality(criticality, supplierId);
            return result;
        }

        [HttpPost("updateCategory")]
        public async Task<bool> UpdateSupplierCategory([FromBody] IList<SupplierCategoryDto> category, int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateSupplierCategory(category, supplierId);
            return result;

        }

        [HttpPost("saveSupplierWorkflow")]
        public async Task<bool> SaveSupplierWorkflowData([FromBody] WorkflowDto workflow)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveSupplierWorkflowData(workflow);
            return result;

        }

        [HttpGet("criticality")]
        public async Task<IList<CriticalityDto>> SearchCriticality([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetCriticality(suplierId);
            return result;
        }

        [HttpPost("emergency")]
        public async Task<int> SaveEmergency([FromBody] EmergencySupplierDto emergency)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveEmergency(emergency);
            return result;
        }

        [HttpGet("emergency")]
        public async Task<IList<EmergencySupplierDto>> SearchEmergency([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetEmergencySupplier(suplierId);
            return result;
        }

        [HttpPost("emergencyupdate")]
        public async Task<int> UpdateEmergency([FromBody] EmergencySupplierDto emergency)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateEmergency(emergency);
            return result;
        }

        [HttpPost("emergencystatus")]
        public async Task<bool> UpdateEmergencyStatus([FromBody] EmergencyStatusDto emergency)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateEmergencyStatus(emergency);
            return result;
        }

        [HttpGet("pendingemergency")]
        public async Task<IList<EmergencySupplierDto>> SearchPendingEmergency([FromQuery] string docId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetEmergencySupplier(docId);
            return result;
        }

        [HttpPost("emergencyupdateworkflow")]
        public async Task<bool> UpdateEmergencyWorkflow([FromBody] WorkflowDto emergency)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateEmergencyWorkflow(emergency);
            return result;
        }

        [HttpGet("emergencyapproved")]
        public async Task<IList<EmergencyApprovedItems>> SearchEmergencyAppproved([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetEmergencyApprovedItems(suplierId);
            return result;
        }

        [HttpPost("emergencyapproved")]
        public async Task<bool> SaveEmergencyApprovedItem([FromBody] EmergencyApprovedItems emergency)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveEmergencyApprovedItem(emergency);
            return result;
        }


        [HttpGet("emergencyforRole")]
        public async Task<IList<EmergencySupplierDto>> SearchEmergencyForRole([FromQuery] string role)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SearchEmergencyForRole(role.Trim());
            return result;
        }
        [HttpPost("filename")]
        public async Task<bool> SaveFileName([FromBody] SupplierFileNameDto file)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveFileName(file, file.SUPPLIER_ID);
            return result;
        }
        /*[HttpPost("filename")]
        public async Task<bool> UpdateFileName([FromBody] SupplierFileNameDto file)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateFileName(file);
            return result;
        }*/
        /*[HttpGet("getfilename")]
        public async Task<IList<SupplierFileNameDto>> SearchFileName([FromQuery] string supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetFileName("2051");
            return result;
        }
        */
        [HttpGet("getfile")]
        public async Task<IList<SupplierFileNameDto>> SearchFileName([FromQuery] string suplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetFileName(suplierId);
            return result;
        }

        [HttpPost("invite")]
        public async Task<int> SaveInvite([FromBody] InviteSupplierDto invite)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveInvite(invite);
            return result;
        }

        [HttpGet("invite")]
        public async Task<IList<InviteSupplierDto>> SearchInvite([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetInviteSupplier(suplierId);
            return result;
        }

        [HttpPost("inviteupdate")]
        public async Task<int> UpdateInvite([FromBody] InviteSupplierDto invite)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateInvite(invite);
            return result;
        }

        [HttpGet("register")]
        public async Task<IList<SupplierDto>> GetRegisterSupplier([FromQuery] string suplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetRegisteredSupplier(suplierId);
            return result;
        }

        [HttpGet("byStatus")]
        public async Task<IList<SupplierDto>> GetRegisterSupplierByStatus([FromQuery] string status)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetRegisteredSuppliers(status);
            return result;
        }

        [HttpPost("register")]
        public async Task<int> SaveRegisterSupplier([FromBody] SupplierDto supplier)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveSupplier(supplier);

            if (result > 0)
            {
                BackgroundJob.Enqueue(() => _supplierService.SyncToET(supplier, Configuration["EtBeUrl"]));
            }
            return result;
        }

        [HttpPost("updateregister")]
        public async Task<int> UpdateRegisterSupplier([FromBody] SupplierDto supplier)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateRegisteredSupplier(supplier);
            return result;
        }

        [HttpPost("updateregisterbyrole")]
        public async Task<int> UpdateRegisterSupplierByRole([FromBody] SupplierDto supplier, string role, string changeremail, string changername)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateRegisterSupplierByRole(supplier,role,changeremail,changername);
            return result;
        }

        [HttpGet("tempregister")]
        public async Task<IList<SupplierDto>> GetTempRegisterSupplier([FromQuery] string suplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetTempRegisteredSupplier(suplierId);
            return result;
        }

        [HttpPost("tempregister")]
        public async Task<int> SaveTempRegisterSupplier([FromBody] SupplierDto supplier)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveTempSupplier(supplier);
            return result;
        }

        [HttpPost("updatetempregister")]
        public async Task<int> UpdateTempRegisterSupplier([FromBody] SupplierDto supplier)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateTempRegisteredSupplier(supplier);
            return result;
        }

        [HttpGet("status")]
        public async Task<bool> UpdateTempRegisterSupplier([FromQuery] int supplierId,string status)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            if (status == "Approved")
            {
                var suppliers = await _supplierService.GetRegisteredSupplier(supplierId.ToString());
                var supplier = suppliers.First();
                var etSupplier = new EtSupplierDto()
                {
                    SupplierName = supplier.supplier_name,
                    ContactEmail = supplier.email,
                    IFSSupplierId = supplier.supplier_id.ToString(),
                    SupplierStatus = supplier.status,
                    EstablishedDate = supplier.created_date
                };
                var supplierList = new List<EtSupplierDto>();
                supplierList.Add(etSupplier);
                var suppliersList = System.Text.Json.JsonSerializer.Serialize(supplierList);
                var approvedEtSuppliersContent = new StringContent(suppliersList, Encoding.UTF8, "application/json");
                using var httpClient = new HttpClient();
                await httpClient.PostAsync(Configuration["EtBeUrl"] + "/api/supp/SyncAllSuppliers", approvedEtSuppliersContent);
            }
            var result = await _supplierService.UpdateSupplierStatus(supplierId, status);
            return result;
        }

        [HttpGet("isexists")]
        public async Task<int> UpdateTempRegisterSupplier([FromQuery] string searchValue, string category)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.IsSupplierExists(searchValue, category);
            return result;
        }

        [HttpPost("isexists")]
        public async Task<int> CheckSupplierNameAndEmail([FromBody] IsExistsDto isExists)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.IsSupplierExists(isExists.value, isExists.category);
            return result;
        }

        [HttpPost("isexistsWithStatus")]
        public async Task<SupplierExistsDto> IsExistsWithStatus([FromBody] IsExistsDto isExists)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.IsSupplierExistsWithStatus(isExists.value, isExists.category);
            return result;
        }

        [HttpGet("supplierExpiration")]
        public async Task<List<SupplierDto>> GetSupplierExpiration([FromQuery] string supplierId, [FromQuery] string email)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetExpiredDetailsAsync(supplierId, email);
            return result;
        }


        [HttpGet("isRegistered")]
        public async Task<SupplierExistsDto> IsRegistered([FromQuery] string searchValue)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.IsRegistered(searchValue);
            return result;
        }

        [HttpPost("SaveEmgIfsCode")]
        public async Task<bool> UpdateEmgSupplierIfsCode([FromQuery] int supplierId, string ifscode)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateEmgSupplierIfsCode(supplierId, ifscode);
            return result;
        }

        [HttpPost("SaveIfsCode")]
        public async Task<bool> UpdateSupplierIfsCode([FromQuery] int supplierId, string ifscode)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateSupplierIfsCode(supplierId, ifscode);
            return result;
        }

        [HttpPost("saveSupplierHistory")]
        public async Task<bool> saveSupplierHistory([FromBody] SupplierHistoryDto history)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveHistory(history);
            return result;
        }

        [HttpGet("registerall")]
        public async Task<IList<SupplierDto>> GetSuppliersForRole([FromQuery] string rolename)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetRegisteredSupplierForRole(rolename);
            return result;
        }

        [HttpGet("registerallemg")]
        public async Task<IList<EmergencySupplierDto>> GetSuppliersEMGForRole([FromQuery] string rolename)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSuppliersEMGForRole(rolename);
            return result;
        }

        [HttpGet("pendingall")]
        public async Task<IList<PendingSupplierDto>> GetSuppliersPendingForRole([FromQuery] string rolename)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSuppliersPendingForRole(rolename);
            return result;
        }

        [HttpPost("deleteemg")]
        public async Task<bool> DeleteEmergencySup([FromBody] DeleteEmgDto DeleteEmg)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.DeleteEmergency(DeleteEmg.supplier_id);
            return result;
        }

        [HttpPost("deleteinv")]
        public async Task<bool> DeleteInviteSup([FromBody] DeleteInvDto DeleteInv)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.DeleteInvite(DeleteInv.supplier_id);
            return result;
        }

        [HttpPost("saveIFSFailedRecords")]
        public async Task<bool> saveIFSFailedRecords([FromBody] IfsFailMessageDto history)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.saveIFSFailedRecords(history);
            return result;
        }

        [HttpPost("ishsequpdated")]
        public async Task<bool> IsHSEQupdated([FromBody] HSEQupdateDto HSEQupdate)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.IsHSEQupdated(HSEQupdate.supplierID, HSEQupdate.updatedBy, HSEQupdate.updatedDateTime);
            return result;
        }

        [HttpGet("statistic")]
        public async Task<List<DashboardStatDto>> GetDashboardStatistic([FromQuery] string role)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetDashboardStatistic(role);
            return result;
        }

        [HttpGet("onlyPendingall")]
        public async Task<IList<PendingSupplierDto>> GetSuppliersOnlyPendingForRole([FromQuery] string rolename)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSuppliersOnlyPendingForRole(rolename);
            return result;
        }

        [HttpGet("hseqcatgegory")]
        public async Task<IList<CategoriesForHSEQDto>> GetSupplierCategoriesForHSEQ([FromQuery] string supplierID)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSupplierCategoriesForHSEQ(supplierID);
            return result;
        }

        [HttpPost("updateCategorybyhseq")]
        public async Task<bool> UpdateSupplierCategoryByHSEQ([FromBody] IList<SupplierCategoryDto> category, int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateSupplierCategoryByHSEQ(category, supplierId);
            return result;

        }
        
        [HttpGet("allsuppliers")]
        public async Task<IList<SupplierBankDto>> Allsuppliers()
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.AllSuppliers();
            return result;
        }

        [HttpGet("allsupplierswithaudit")]
        public async Task<IList<SupplierAuditDto>> AllSuppliersWithAudit()
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.AllSuppliersWithAudit();
            return result;
        }

        [HttpPost("allsuppliercategories")]
        public async Task<IList<SupplierAllCategoriesDto>> AllSuppliersCategories([FromBody] int[] supplierID)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SupplierAllCategories(supplierID);
            return result;
        }

        [HttpGet("audittype")]
        public async Task<string> GetSupplierAuditType([FromQuery] int supplierID)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSupplierAuditType(supplierID);
            return result;
        }

        [HttpPost("audittype")]
        public async Task<bool> UpdateSupplierAuditType([FromBody] SupplierAuditTypeDto supplierAuditType)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateSupplierAuditType(supplierAuditType);
            return result;
        }

        [HttpGet("changeApprovals")]
        public async Task<IList<ChangeApprovalDto>> GetAllChangeApprovalsForRole([FromQuery] string rolename)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetAllChangeApprovalsForRole(rolename);
            return result;
        }

        [HttpGet("supplierChangesForApproval")]
        public async Task<SupplierChangesDto> GetSupplierChangesForApproval([FromQuery] int supplierID)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSupplierChangesForApproval(supplierID, Configuration["FilesPath"]);
            return result;
        }

        [HttpPost("supplierChangesApproval")]
        public async Task<bool> SupplierChangesApproval([FromQuery] int supplierId, [FromQuery] string approvalStatus, [FromQuery] bool isApproved)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SupplierChangesApproval(supplierId, approvalStatus, isApproved, Configuration["FilesPath"]);
            return result;
        }

        [HttpPost("deleteSupplierChangesApproval")]
        public async Task<bool> DeleteSupplierChangesApproval([FromQuery] int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierData.DeleteSupplierChangesApproval(supplierId);

            return result;
        }

        [Authorize]
        [HttpPost("SaveReviewForm")]
        public async Task<int> SaveReviewForm([FromBody] ReviewFormDto reviewForm)
        {
            var user = JsonConvert.DeserializeObject<Auth0UserDto>(Request.Headers["x-auth-user"]);
            UserDtoMapper.Map<Auth0UserDto, ReviewFormDto>(user, reviewForm);
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveReviewForm(reviewForm);

            if(reviewForm != null && reviewForm?.ApprovelsReferences != null)
            {
                var approvers = JsonConvert.DeserializeObject<List<ReviewApprover>>(reviewForm?.ApprovelsReferences);

                if (approvers != null && approvers.Count > 0)
                {
                    var approverEmails = approvers.Select(x => x.Email);
                    var _emailSender = new EmailService(_emailConfig);

                    var emaillist = await _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
                    var tolist = emaillist.Select(i => i.ToString()).ToArray();
                    var message = new MessageCcDto(approverEmails, tolist, "Form Approvel", "Form is approved successfully", null, null, "");
                    _emailSender.SendCcEmail(message, "");
                }
            }
           
            return result;
        }

        [HttpGet("reviewForms")]
        public async Task<IList<ReviewFormDto>> GetAllReviewForms()
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetAllReviewForms();
            return result;
        }

        [HttpGet("reviewForm")]
        public async Task<ReviewFormDto> GetReviewForm([FromQuery] int formId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewForm(formId);
            return result;
        }

        [HttpGet("reviewSessions")]
        public async Task<IList<ReviewSessionDto>> GetAllReviewSessions()
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetAllReviewSessions();
            return result;
        }

        [HttpGet("reviewSession")]
        public async Task<ReviewSessionDto> GetReviewSession([FromQuery] int reviewSessionId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewSession(reviewSessionId);
            return result;
        }

        [HttpPost("reviewSession")]
        public async Task<bool> SaveReviewSession([FromBody] ReviewSessionDto reviewSession)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveReviewSession(reviewSession);
            return result;
        }

        [HttpPost("reviewSessionPublish")]
        public async Task<bool> PublishReviewSession([FromBody] ReviewSessionDto reviewSession)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData, _emailConfig);

            if (reviewSession.scheduled == 1)
            {
                if (reviewSession.frequency == "Monthly") {
                    string cronExp = "0 0 1 * *";
                    RecurringJob.AddOrUpdate(() => _supplierService.PublishReviewSession(reviewSession), cronExp);
                }
                else if (reviewSession.frequency == "Quarterly")
                {
                    string cronExp = "0 0 1 */4 *";
                    RecurringJob.AddOrUpdate(() => _supplierService.PublishReviewSession(reviewSession), cronExp);
                }
                else if (reviewSession.frequency == "Semi Annually")
                {
                    string cronExp = "0 0 1 */6 *";
                    RecurringJob.AddOrUpdate(() => _supplierService.PublishReviewSession(reviewSession), cronExp);
                }
                else
                {
                    RecurringJob.AddOrUpdate(() => _supplierService.PublishReviewSession(reviewSession), Cron.Yearly);
                }
                reviewSession.status = "published";
                _supplierData.SaveReviewSession(reviewSession);
                return true;
            }
            else
            {
                var result = await _supplierService.PublishReviewSession(reviewSession);
                return result;
            }
        }

        [HttpGet("reviewResponsesByUser")]
        public async Task<IList<ReviewResponseDto>> GetAllReviewResponses([FromQuery] string loggedInUser)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetAllReviewResponses(loggedInUser);
            return result;
        }

        [HttpGet("reviewResponse")]
        public async Task<ReviewResponseDto> GetReviewResponse([FromQuery] int reviewResponseId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewResponse(reviewResponseId);
            return result;
        }

        [HttpGet("reviewResponseBySessionAndUser")]
        public async Task<ReviewResponseDto> GetReviewResponseBySessionAndUser([FromQuery] int reviewSessionId, [FromQuery] string conductedUserId, [FromQuery] int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewResponseBySessionAndUser(reviewSessionId, conductedUserId, supplierId);
            return result;
        }

        [HttpGet("sessionReviewResponseScores")]
        public async Task<List<ReviewResponseDto>> GetSessionReviewResponseScores([FromQuery] int reviewSessionId, [FromQuery] int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSessionReviewResponseScores(reviewSessionId, supplierId);
            return result;
        }

        [HttpGet("reviewSessionsByUser")]
        public async Task<IList<ReviewSessionDto>> GetReviewSessionsByUser([FromQuery] string loggedInUser)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewSessionsByUser(loggedInUser);
            return result;
        }
        [HttpPost("reviewResponse")]
        public async Task<bool> SaveReviewResponse([FromBody] ReviewResponseDto reviewResponse)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveReviewResponse(reviewResponse);
            return result;
        }
        [HttpPost("reviewOutcome")]
        public async Task<bool> SaveReviewOutcome([FromBody] ReviewOutcomeDto reviewOutcome)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveReviewOutcome(reviewOutcome);
            return result;
        }
        [HttpGet("reviewOutcomeSupplier")]
        public async Task<bool> BlockSupplierByReviewOutcome([FromQuery] int supplierId, [FromQuery] string supplierCode, [FromQuery] string comment)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.BlockSupplierByReviewOutcome(supplierId, supplierCode, comment, Configuration["IfsBeUrl"]);
            return result;
        }
        [HttpGet("reviewOutcomeBySupplier")]
        public async Task<List<ReviewOutcomeDto>> GetReviewOutcomeBySupplier([FromQuery] int sessionId, [FromQuery] int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewOutcomeBySupplier(sessionId, supplierId);
            return result;
        }
        [HttpGet("reviewOutcomesByUser")]
        public async Task<List<ReviewOutcomeDto>> GetReviewOutcomes([FromQuery] string loggedInUser)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewOutcomes(loggedInUser);
            return result;
        }
        [HttpPost("reviewApprover")]
        public async Task<bool> SaveReviewApprover([FromBody] ReviewApproverDto reviewApprover)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveReviewApprover(reviewApprover);
            return result;
        }
        [HttpPost("reviewTodo")]
        public async Task<bool> SaveReviewTodo([FromBody] ReviewTodoDto reviewTodo)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.SaveReviewTodo(reviewTodo);
            return result;
        }
        [HttpGet("reviewTodoSByUser")]
        public async Task<IList<ReviewTodoDto>> GetReviewTodosByUser([FromQuery] string loggedInUser)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewTodosByUser(loggedInUser);
            return result;
        }
        [HttpGet("reviewTodosByReviewResponse")]
        public async Task<IList<ReviewTodoDto>> GetReviewTodosByReviewResponse([FromQuery] int reviewResponseId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewTodosByReviewResponse(reviewResponseId);
            return result;
        }


        [HttpPost("reviewApprovals")]
        public async Task<bool> FetchReviewApprovers([FromBody] ReviewResponseDto reviewResponse)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData, _emailConfig);
            var result = await _supplierService.FetchReviewApprovers(reviewResponse, Configuration["IfsBeUrl"]);
            return result;
        }
        [HttpGet("reviewApproversByReviewResponse")]
        public async Task<List<ReviewApproverDto>> GetReviewApproversByResponse([FromQuery] int reviewResponseId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewApproversByResponse(reviewResponseId);
            return result;
        }

        [HttpGet("suppliercount")]
        public async Task<List<DashboardStatDto>> GetSuppliersCountBasedOnRole([FromQuery] string rolename)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSuppliersCountBasedOnRole(rolename);
            return result;
        }

        [HttpGet("ifsfailed")]
        public async Task<List<IfsIntegrationDto>> GetIfsFailedData([FromQuery] int supplierID)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetIfsFailedData(supplierID);
            return result;
        }

        [HttpGet("ifsfailedupdatedhistory")]
        public async Task<List<IfsHistoryUpdateDto>> GetIfsFailedUpdatedHistory([FromQuery] int supplierID)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetIfsFailedUpdatedHistory(supplierID);
            return result;
        }

        [HttpPost("ifsreinterfacestatus")]
        public async Task<bool> UpdateReInterfaceStatus([FromQuery] int supplierId)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.UpdateReInterfaceStatus(supplierId);
            return result;
        }

        [HttpPost("existingsupplierdata")]
        public async Task<List<SupplierDto>> GetExistingSupplierDraftData([FromBody] IsExistsDto isExists)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetSupplierDraftData(isExists);
            return result;
        }

        [HttpPost("deletedraftsupplier")]
        public async Task<bool> DeleteExistingDraftSupplier([FromBody] DeleteDraftSupplierDto DeleteDraftSupplier)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.DeleteExistingDraftSupplier(DeleteDraftSupplier);
            return result;
        }

        [HttpGet("allSuppliersByStatus")]
        public async Task<IList<SupplierBankDto>> AllSuppliersByStatus(string status)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.AllSuppliers();
            return result.Where(x => status.ToLower().Contains(x.Status.ToLower())).ToList();
        }

        [HttpPost("SyncAllApprovedSuppliersToEt")]
        public async Task<bool> SyncAllApprovedSuppliersToEt()
        {
            var approvedSuppliers = await AllSuppliersByStatus("Approved");
            var approvedEtSuppliers = approvedSuppliers.Select(x => new EtSupplierDto()
            {
                SupplierName = x.SupplierName,
                ContactEmail = x.Email,
                IFSSupplierId = x.SupplierID.ToString(),
                SupplierStatus = x.Status,
                EstablishedDate = x.CreatedDate
            }).ToList();
            var suppliers = System.Text.Json.JsonSerializer.Serialize(approvedEtSuppliers);
            var approvedEtSuppliersContent = new StringContent(suppliers, Encoding.UTF8, "application/json");
            using var httpClient = new HttpClient();
            using var response = await httpClient.PostAsync(Configuration["EtBeUrl"] + "/api/supp/SyncAllSuppliers", approvedEtSuppliersContent);
            return true;
        }

        [HttpGet("allSuppliersTrunc")]
        public async Task<IList<SupplierBankDto>> AllSuppliersTrunc()
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.AllSuppliersTrunc();
            return result;
        }

        [HttpGet("allapprovedsupplier")]
        public async Task<IList<SupplierBankDto>> AllApprovedSuppliers()
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.AllApprovedSuppliers();
            return result;
        }

        [HttpGet("reviewerSupervisor")]
        public async Task<ReviewerSupervisorDto> GetReviewerSupervisor(string reviewerName)
        {
            var _supplierData = new SupplierData(Configuration);
            var _supplierService = new SupplierService(_supplierData);
            var result = await _supplierService.GetReviewerSupervisor(reviewerName);
            return result;
        }

    }
}
