using SRMPublic.Criteria;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Interfaces
{
    public interface IWorkflowService
    {
        Task<SupplierWorkflowDto> GetApprovalWorkFlow(string supplierId);
        Task<IList<SupplierApprovedItemsDto>> GetApprovedItems(string supplierId);
        Task<bool> SaveWorkFlow(WorkflowDto supplierId);
        Task<IList<SupplierWorkflowDto>> GetPendingWorkflowSuppliers(int[] docIds);
        Task<bool> SaveApprovedItem(SupplierApprovedItemsDto item);
        Task<IList<SupplierDto>> GetPendingSuppliers(int[] docId);
        Task<string> GetBankApprovalWorkFlow(int supplierId);

    }
}
