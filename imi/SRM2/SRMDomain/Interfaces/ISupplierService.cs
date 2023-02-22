using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Interfaces
{
    public interface ISupplierService
    {
        Task<bool> UpdateCriticality(SupplierCriticalityDto criticality);
        Task<bool> SaveCriticality(IList<CriticalityDto> criticality, int supplierId);
        Task<bool> SaveHistory(SupplierHistoryDto history);
        Task<IList<CriticalityDto>> GetCriticality(string supplierId);
        Task<int> SaveEmergency(EmergencySupplierDto emergency);
        Task<IList<EmergencySupplierDto>> GetEmergencySupplier(string supplierId);
        Task<int> UpdateEmergency(EmergencySupplierDto emergency);
        Task<bool> UpdateEmergencyStatus(EmergencyStatusDto emergency);
        Task<IList<EmergencySupplierDto>> GetPendingEmergencySupplier(string workflowId);
        Task<bool> UpdateEmergencyWorkflow(WorkflowDto workflow);
        Task<IList<EmergencyApprovedItems>> GetEmergencyApprovedItems(string supplierId);
        Task<bool> SaveEmergencyApprovedItem(EmergencyApprovedItems item);
        Task<int> SaveInvite(InviteSupplierDto emergency);
        Task<IList<InviteSupplierDto>> GetInviteSupplier(string supplierId);
        Task<int> UpdateInvite(InviteSupplierDto emergency);
        Task<int> SaveSupplier(SupplierDto supplier);
        Task<IList<SupplierDto>> GetRegisteredSupplier(string supplierId);
        Task<int> UpdateRegisteredSupplier(SupplierDto emergency);
        Task<int> SaveTempSupplier(SupplierDto supplier);
        Task<IList<SupplierDto>> GetTempRegisteredSupplier(string supplierId);
        Task<int> UpdateTempRegisteredSupplier(SupplierDto supplier);
        Task<bool> UpdateSupplierCategory(IList<SupplierCategoryDto> category, int supplierId);
        Task<bool> SaveSupplierWorkflowData(WorkflowDto workflow);
        Task<bool> UpdateSupplierStatus(int supplierid, string status);
        Task<int> IsSupplierExists(string searchValue, string category);
        Task<bool> UpdateSupplierIfsCode(int supplierId, string ifscode);
        Task<bool> saveIFSFailedRecords(IfsFailMessageDto history);
        Task<IList<EmergencySupplierDto>> SearchEmergencyForRole(string role);
        Task<List<DashboardStatDto>> GetDashboardStatistic(string role);
        Task<bool> SaveFileName(SupplierFileNameDto file, int supplierId);
        Task<bool> UpdateFileName(SupplierFileNameDto file);
        Task<IList<SupplierFileNameDto>> GetFileName(string supplierId);
        Task<List<IfsIntegrationDto>> GetIfsFailedData(int supplierID);
        Task<bool> UpdateReInterfaceStatus(int supplierId);
        Task<int> UpdateRegisterSupplierByRole(SupplierDto supplier, string role, string changeremail, string changername);
        Task<List<IfsHistoryUpdateDto>> GetIfsFailedUpdatedHistory(int supplierID);
        Task<List<SupplierDto>> GetSupplierDraftData(IsExistsDto isExists);
        Task<List<SupplierDto>> GetExpiredDetailsAsync(string supplierId, string email);
        Task<ReviewerSupervisorDto> GetReviewerSupervisor(string reviewerName);
    }
}
