using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface IWorkflowData
    {
        Task<SupplierWorkflowDto> GetApprovalWorkFlow(string supplierId);
        Task<IList<SupplierApprovedItemsDto>> GetApprovedItems(string supplierId);
        Task<bool> SaveWorkFlow(WorkflowDto Workflow);
        Task<bool> SaveApprovedItem(SupplierApprovedItemsDto item);
        Task<IList<SupplierWorkflowDto>> GetPendingWorkflowSuppliers(string docIds);
        Task<IList<SupplierDto>> GetPendingSuppliers(string docId);
        Task<string> GetBankApprovalWorkFlow(int supplierId);
        Task<IList<SupplierHistoryDto>> GetHistory(string supplierId);
        Task<IList<UserDto>> GetUsers();

    }
}
