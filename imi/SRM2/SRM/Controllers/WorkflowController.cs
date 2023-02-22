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
    [Route("api/workflow")]
    public class WorkflowController : ControllerBase
    {
        private IConfiguration Configuration;

        //private readonly ICategoryService _categoryService ;
        public WorkflowController(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        [HttpGet("search")]
        public async Task<SupplierWorkflowDto> GetApprovalWorkFlow([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetApprovalWorkFlow(suplierId);
            return result;
        }

        [HttpGet("approvedItems")]
        public async Task<IList<SupplierApprovedItemsDto>> GetApprovedItems([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetApprovedItems(suplierId);
            return result;
        }

        [HttpPost("approvedItems")]
        public async Task<bool> SaveApprovedItem([FromBody] SupplierApprovedItemsDto approvedItem)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.SaveApprovedItem(approvedItem);
            return result;
        }

        [HttpPost("saveWorkflow")]
        public async Task<bool> SaveWorkFlow([FromBody] WorkflowDto workflow)
        {
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.SaveWorkFlow(workflow);
            return result;
        }

        [HttpPost("pendingbankWorkflow")]
        public async Task<IList<SupplierWorkflowDto>> GetPendingWorkflowSuppliers([FromBody] int[] docId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetPendingWorkflowSuppliers(docId);
            return result;
        }

        [HttpPost("pendingWorkflow")]
        public async Task<IList<SupplierDto>> GetPendingSuppliers([FromBody] int[] docId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetPendingSuppliers(docId);
            return result;
        }

        [HttpGet("bankSearch")]
        public async Task<WorkflowDto> GetBankApprovalWorkFlow([FromQuery] int suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetBankApprovalWorkFlow(suplierId);
            var workflow = new WorkflowDto();
            workflow.PROCESSID = result;
            workflow.SUPPLIER_ID = suplierId;
            return workflow;
        }

        [HttpGet("history")]
        public async Task<IList<SupplierHistoryDto>> GetHistory([FromQuery] string suplierId)
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetHistory(suplierId);
            return result;
        }


        [HttpGet("users")]
        public async Task<IList<UserDto>> GetUsers()
        {
            //searchParam.UserId = _requestContextService.UserName;
            var _workflowData = new WorkflowData(Configuration);
            var _categoryService = new WorkflowService(_workflowData);
            var result = await _categoryService.GetUsers();
            return result;
        }
    }
}
