﻿using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface ISupplierData
    {
        Task<bool> UpdateCriticality(SupplierCriticalityDto criticality);
        Task<bool> SaveCriticality(CriticalityDto criticality, int supplierId);
        Task<bool> DeleteCriticality(int supplierId);
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
        Task<IList<SupplierDto>> GetRegisteredSupplierForRole(string rolename); 
        Task<IList<EmergencySupplierDto>> GetSuppliersEMGForRole(string rolename); 
        Task<IList<PendingSupplierDto>> GetPendingSupplierForRole(string rolename); 
        Task<int> UpdateRegisteredSupplier(SupplierDto supplier);        
        Task<int> SaveTempSupplier(SupplierDto supplier);
        Task<IList<SupplierDto>> GetTempRegisteredSupplier(string supplierId);
        Task<int> UpdateTempRegisteredSupplier(SupplierDto supplier);
        Task<bool> SaveCategory(SupplierCategoryDto supplier, int supplierId);
        Task<bool> DeleteCategory(int supplierId);
        Task<bool> DeleteTempCategory(int supplierId);
        Task<bool> SaveTempCategory(SupplierCategoryDto supplier, int supplierId);
        Task<IList<SupplierCategoryDto>> SearchTempCategory(int supplierId);
        Task<IList<SupplierCategoryDto>> SearchCategory(int supplierId);
        Task<bool> UpdateSupplierCategory(SupplierCategoryDto category, int supplierId);
        Task<bool> SaveSupplierWorkflowData(WorkflowDto workflow);
        Task<bool> UpdateSupplierStatus(int supplierid, string status);
        Task<int> IsSupplierExists(string searchValue, string category); 
        Task<SupplierExistsDto> IsSupplierExistsWithStatus(string searchValue, string category); 
        Task<SupplierExistsDto> IsRegistered(string searchValue); 
         Task<bool> UpdateSupplierIfsCode(int supplierId, string ifscode); 
         Task<bool> UpdateEmgSupplierIfsCode(int supplierId, string ifscode); 
         Task<bool> SaveHistory(SupplierHistoryDto supplierHistory);
        Task<bool> DeleteEmergency(int supplierId);
        Task<bool> DeleteInvite(int supplierId);
        Task<bool> saveIFSFailedRecords(IfsFailMessageDto history);
        Task<IList<EmergencySupplierDto>> SearchEmergencyForRole(string role);
        Task<bool> HSEQupdatedAction(string supplierID, string updatedBy, string updatedDateTime);
        Task<List<DashboardStatDto>> GetDashboardStatistic(string role);
        Task<IList<PendingSupplierDto>> GetSuppliersOnlyPendingForRole(string role);
        Task<IList<CategoriesForHSEQDto>> GetSupplierCategoriesForHSEQ(string supplierID);
        Task<bool> UpdateSupplierCategoryByHSEQ(SupplierCategoryDto category, int supplierId);
        Task<IList<SupplierBankDto>> AllSuppliers();
        Task<IList<SupplierBankDto>> AllSuppliersTrunc(string supplierIds="");
        Task<IList<SupplierAuditDto>> AllSuppliersWithAudit();
        Task<IList<SupplierAllCategoriesDto>> SupplierCategories(int[] supplierID);
        Task<string> GetSupplierAuditType(int supplierID);
        Task<bool> UpdateSupplierAuditType(SupplierAuditTypeDto supplierAuditType);
        Task<int> TempSavePortalSupplierEditInfo(SupplierDto supplier);
        Task<IList<ChangeApprovalDto>> GetAllChangeApprovalsForRole(string rolename);
        Task<SuppliersTabChangeDto> GetSupplierChangesForApproval(int supplierID);
        Task<bool> DeleteSupplierChangesApproval(int supplierId);
        Task<int> SaveReviewForm(ReviewFormDto reviewForm);
        Task<IList<ReviewFormDto>> GetAllReviewForms();
        Task<ReviewFormDto> GetReviewForm(int id);
        Task<IList<ReviewSessionDto>> GetAllReviewSessions();
        Task<ReviewSessionDto> GetReviewSession(int reviewSessionId);
        Task<bool> SaveReviewSession(ReviewSessionDto reviewSession);
        Task<IList<ReviewResponseDto>> GetAllReviewResponses(string loggedInUser);
        Task<ReviewResponseDto> GetReviewResponse(int reviewResponseId);
        Task<ReviewResponseDto> GetReviewResponseBySessionAndUser(int reviewSessionId, string conductedUser, int supplierId);
        Task<List<ReviewResponseDto>> GetSessionReviewResponseScores(int reviewSessionId, int supplierId);
        Task<IList<ReviewSessionDto>> GetReviewSessionsByUser(string loggedInUser);
        Task<int> SaveReviewResponse(ReviewResponseDto reviewResponse);
        Task<bool> SaveReviewOutcome(ReviewOutcomeDto reviewOutcome);
        Task<bool> BlockSupplierByReviewOutcome(int supplierId);
        Task<List<ReviewOutcomeDto>> GetReviewOutcomeBySupplier(int sessionId, int supplierId);
        Task<List<ReviewOutcomeDto>> GetReviewOutcomes(string loggedInUser);
        Task<List<ReviewApproverDto>> GetReviewApproversByResponse(int reviewResponseId);
        Task<bool> SaveReviewApprover(ReviewApproverDto reviewApprover);
        Task<bool> SaveReviewTodo(ReviewTodoDto reviewTodo);
        Task<IList<ReviewTodoDto>> GetReviewTodosByUser(string loggedInUser);
        Task<IList<ReviewTodoDto>> GetReviewTodosByReviewResponse(int reviewResponse);
        Task<bool> SaveFileName(SupplierFileNameDto file, int supplierId);
        Task<bool> UpdateFileName(SupplierFileNameDto file);
        Task<IList<SupplierFileNameDto>> GetFileName(string supplierId);
        Task<List<DashboardStatDto>> GetSuppliersStatusCountBasedOnRole(string rolename);
        Task<List<IfsIntegrationDto>> GetIfsFailedData(int supplierID);
        Task<bool> UpdateReInterfaceStatus(int supplierId);
        Task<int> UpdateRegisteredSupplierByRole(SupplierDto supplier, string role, string changeremail, string changername);
        Task<List<IfsHistoryUpdateDto>> GetIfsFailedUpdatedHistory(int supplierID);
        Task<List<SupplierDto>> GetSupplierInformation(IsExistsDto isExists);
        Task<bool> DeleteExistingDraftSupplier(DeleteDraftSupplierDto DeleteDraftSupplier);
        Task<IList<SupplierBankDto>> AllApprovedSuppliers();
        Task<List<SupplierDto>> GetAllSupplierAsync(string supplierId, string email);
        Task<ReviewerSupervisorDto> GetReviewerSupervisor(string reviewerName);
    }
}