using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Services
{
    public class WorkflowService : IWorkflowService
    {
        private readonly IWorkflowData _workflowData;
        public WorkflowService(IWorkflowData workflowData)
        {
            _workflowData = workflowData;
        }

        public async Task<SupplierWorkflowDto> GetApprovalWorkFlow(string supplierId)
        {
            var result = await _workflowData.GetApprovalWorkFlow(supplierId);
            return result;
        }

        public async Task<IList<SupplierApprovedItemsDto>> GetApprovedItems(string supplierId)
        {
            var result = await _workflowData.GetApprovedItems(supplierId);
            return result;
        }

        public async Task<IList<SupplierWorkflowDto>> GetPendingWorkflowSuppliers(int[] docIds)
        {
            if (docIds.Length > 0)
            {
                var docidstring = string.Join(",", docIds);
                var result = await _workflowData.GetPendingWorkflowSuppliers(docidstring);
                return result;
            }
            return null;
        }

        public async Task<bool> SaveApprovedItem(SupplierApprovedItemsDto item)
        {
            var result = await _workflowData.SaveApprovedItem(item);
            return result;
        }

        public async Task<bool> SaveWorkFlow(WorkflowDto workflow)
        {
            var result = await _workflowData.SaveWorkFlow(workflow);
            return result;
        }


        public async Task<IList<SupplierDto>> GetPendingSuppliers(int[] docId)
        {
            if (docId.Length > 0)
            {
                var docidstring = string.Join(",", docId);
                var result = await _workflowData.GetPendingSuppliers(docidstring);
                return result;
            }
            return null;
        }

        public async Task<string> GetBankApprovalWorkFlow(int supplierId)
        {
            var result = await _workflowData.GetBankApprovalWorkFlow(supplierId);
            return result;
        }

        public async Task<IList<SupplierHistoryDto>> GetHistory(string supplierId)
        {
            var result = await _workflowData.GetHistory(supplierId);
            return result;
        }

        public async Task<IList<UserDto>> GetUsers()
        {
            var result = await _workflowData.GetUsers();
            return result;
        }
    }
}
