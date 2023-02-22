using Newtonsoft.Json;
using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using System.Text;
namespace SRMDomain.Services
{
    public class SupplierService : ISupplierService
    {
        private readonly ISupplierData _supplierData;
        private readonly EmailConfigDto _emailConfig;
        public SupplierService(ISupplierData supplierData, EmailConfigDto emailConfig=null)
        {
            _supplierData = supplierData;
            _emailConfig = emailConfig;
        }

        public async Task<IList<CriticalityDto>> GetCriticality(string supplierId)
        {
            var result = await _supplierData.GetCriticality(supplierId);
            return result;
        }

        public async Task<IList<EmergencySupplierDto>> GetEmergencySupplier(string supplierId)
        {
            var result = await _supplierData.GetEmergencySupplier(supplierId);
            return result;
        }

        public async Task<bool> SaveCriticality(IList<CriticalityDto> criticality, int supplierId)
        {
            var result = false;
            await _supplierData.DeleteCriticality(supplierId);

            foreach (var item in criticality)
            {
                result = await _supplierData.SaveCriticality(item, supplierId);
            }

            var supplierDto = new SupplierCriticalityDto();
            supplierDto.SUPPLIER_ID = supplierId;
            supplierDto.Criticality_Value = criticality.Count;
            if (criticality.Count >= 7)
            {
                supplierDto.Status = "Awaiting Site Audit Approval";
            }
            else if (criticality.Count == 5 || criticality.Count == 6)
            {
                supplierDto.Status = "Awaiting Desktop Audit Approval";
            }
            else
            {
                supplierDto.Status = "Awaiting SRM Approval";
            }


            await _supplierData.UpdateCriticality(supplierDto);
            return result;
        }

        public async Task<int> SaveEmergency(EmergencySupplierDto emergency)
        {
            var result = 0;
            if (emergency.supplier_id > 0)
            {
                result = await _supplierData.UpdateEmergency(emergency);
            }
            else
            {
                result = await _supplierData.SaveEmergency(emergency);
            }
            return result;
        }

        public async Task<bool> UpdateCriticality(SupplierCriticalityDto criticality)
        {
            var result = await _supplierData.UpdateCriticality(criticality);
            return result;
        }

        public async Task<int> UpdateEmergency(EmergencySupplierDto emergency)
        {
            var result = await _supplierData.UpdateEmergency(emergency);
            return result;
        }

        public async Task<bool> UpdateEmergencyStatus(EmergencyStatusDto emergency)
        {
            var result = await _supplierData.UpdateEmergencyStatus(emergency);
            return result;
        }

        public async Task<IList<EmergencySupplierDto>> GetPendingEmergencySupplier(string workflowId)
        {
            var result = await _supplierData.GetPendingEmergencySupplier(workflowId);
            return result;
        }

        public async Task<bool> UpdateEmergencyWorkflow(WorkflowDto workflow)
        {
            var result = await _supplierData.UpdateEmergencyWorkflow(workflow);
            return result;
        }

        public async Task<IList<EmergencyApprovedItems>> GetEmergencyApprovedItems(string supplierId)
        {
            var result = await _supplierData.GetEmergencyApprovedItems(supplierId);
            return result;
        }

        public async Task<bool> SaveEmergencyApprovedItem(EmergencyApprovedItems item)
        {
            var result = await _supplierData.SaveEmergencyApprovedItem(item);
            return result;
        }

        public async Task<int> SaveInvite(InviteSupplierDto invite)
        {
            int result = 0;
            if (invite.invite_supplier_id > 0)
            {
                result = await _supplierData.UpdateInvite(invite);
            }
            else
            {
                result = await _supplierData.SaveInvite(invite);
            }
            return result;
        }
        public async Task<IList<InviteSupplierDto>> GetInviteSupplier(string supplierId)
        {
            var result = await _supplierData.GetInviteSupplier(supplierId);
            return result;
        }
        public async Task<int> UpdateInvite(InviteSupplierDto invite)
        {
            var result = await _supplierData.UpdateInvite(invite);
            return result;
        }

        public async Task<int> SaveSupplier(SupplierDto supplier)
        {
            int result = 0;

            if (supplier.supplier_id > 0 && supplier.isSupplierPortalUser != null && (bool)supplier.isSupplierPortalUser)
            {
                result = await _supplierData.TempSavePortalSupplierEditInfo(supplier);
                return result;
            }

            if (supplier.supplier_id > 0)
            {                
                result = await _supplierData.UpdateRegisteredSupplier(supplier);
            }
            else
            {
                result = await _supplierData.SaveSupplier(supplier);
            }
            supplier.supplier_id = result;
            if (result > 0 && supplier.supplierCategories.Length > 0)
            {
                await _supplierData.DeleteCategory(supplier.supplier_id);

                foreach (SupplierCategoryDto item in supplier.supplierCategories)
                {
                    await _supplierData.SaveCategory(item, supplier.supplier_id);
                }
            }
            return result;
        }

        public async Task SyncToET(SupplierDto supplierDto, String etURL)
        {
            var supplier = System.Text.Json.JsonSerializer.Serialize(supplierDto);
            var supplierJson = new StringContent(supplier, Encoding.UTF8, "application/json");
            using var httpClient = new HttpClient();
            using var response = await httpClient.PostAsync(etURL + "/api/supp/SaveSRMSupplier", supplierJson);
        }

        public async Task<bool> SaveFileName(SupplierFileNameDto file, int supplierId)
        {
            var result = await _supplierData.SaveFileName(file, supplierId);
            return result;
        }
        public async Task<bool> UpdateFileName(SupplierFileNameDto file)
        {
            var result = await _supplierData.UpdateFileName(file);
            return result;
        }
        public async Task<IList<SupplierFileNameDto>> GetFileName(string supplierId)
        {
            IList<SupplierFileNameDto> result = await _supplierData.GetFileName(supplierId);
            return result;
        }
        public async Task<IList<SupplierDto>> GetRegisteredSupplier(string supplierId)
        {
            IList<SupplierDto> result = await _supplierData.GetRegisteredSupplier(supplierId);
            if (result == null)
            {
                result = await _supplierData.GetRegisteredSupplier(supplierId);
            }

            if (supplierId != null && Convert.ToInt32(supplierId) > 0)
            {
                var categories = await _supplierData.SearchCategory(Convert.ToInt32(supplierId));
                if (categories != null && categories.Count > 0 && result != null)
                {
                    SupplierCategoryDto[] cat = new SupplierCategoryDto[categories.Count];
                    for (int i = 0; i < categories.Count; i++)
                    {
                        cat[i] = categories[i];
                    }

                    result[0].supplierCategories = cat;
                }

            }
            return result;
        }
        public async Task<IList<SupplierDto>> GetRegisteredSuppliers(string status)
        {
            IList<SupplierDto> result = await _supplierData.GetRegisteredSupplier(null);
            if (result != null && result.Count > 0)
            {

                if (!string.IsNullOrEmpty(status) && !status.ToLower().Equals("all"))
                {
                    result = result.Where(x => status.ToLower().Contains(x.status.ToLower())).ToList();
                }
                foreach (SupplierDto supplier in result)
                {
                    var categories = await _supplierData.SearchCategory(Convert.ToInt32(supplier.supplier_id));
                    if (categories != null && categories.Count > 0)
                    {
                        SupplierCategoryDto[] cat = new SupplierCategoryDto[categories.Count];
                        for (int i = 0; i < categories.Count; i++)
                        {
                            cat[i] = categories[i];
                        }

                        supplier.supplierCategories = cat;
                    }
                }
            }
            return result;
        }

        public async Task<IList<SupplierDto>> GetRegisteredSupplierForRole(string rolename)
        {
            IList<SupplierDto> result = await _supplierData.GetRegisteredSupplierForRole(rolename);
            return result;
        }

        public async Task<IList<EmergencySupplierDto>> GetSuppliersEMGForRole(string rolename)
        {
            IList<EmergencySupplierDto> result = await _supplierData.GetSuppliersEMGForRole(rolename);
            return result;
        }

        public async Task<IList<PendingSupplierDto>> GetSuppliersPendingForRole(string rolename)
        {
            IList<PendingSupplierDto> result = await _supplierData.GetPendingSupplierForRole(rolename);
            return result;
        }

        public async Task<int> UpdateRegisteredSupplier(SupplierDto emergency)
        {
            var result = await _supplierData.UpdateRegisteredSupplier(emergency);
            return result;
        }


        public async Task<int> SaveTempSupplier(SupplierDto supplier)
        {
            int result = 0;
            if (supplier.supplier_id > 0)
            {
                result = await _supplierData.UpdateTempRegisteredSupplier(supplier);
            }
            else
            {
                result = await _supplierData.SaveTempSupplier(supplier);
            }
            supplier.supplier_id = result;
            if (result > 0 && supplier.supplierCategories.Length > 0)
            {
                await _supplierData.DeleteTempCategory(supplier.supplier_id);

                foreach (SupplierCategoryDto item in supplier.supplierCategories)
                {
                    await _supplierData.SaveTempCategory(item, supplier.supplier_id);
                }
            }
            return result;
        }

        public async Task<IList<SupplierDto>> GetTempRegisteredSupplier(string supplierId)
        {
            IList<SupplierDto> result = await _supplierData.GetTempRegisteredSupplier(supplierId);
            if (supplierId != null && Convert.ToInt32(supplierId) > 0)
            {
                var categories = await _supplierData.SearchTempCategory(Convert.ToInt32(supplierId));
                if (categories != null && categories.Count > 0 && result != null)
                {
                    SupplierCategoryDto[] cat = new SupplierCategoryDto[categories.Count];
                    for (int i = 0; i < categories.Count; i++)
                    {
                        cat[i] = categories[i];
                    }

                    result[0].supplierCategories = cat;
                }

            }
            return result;
        }

        public async Task<int> UpdateTempRegisteredSupplier(SupplierDto supplier)
        {
            var result = await _supplierData.UpdateTempRegisteredSupplier(supplier);
            return result;
        }

        public async Task<bool> UpdateSupplierCategory(IList<SupplierCategoryDto> category, int supplierId)
        {
            var result = false;
            foreach (var item in category)
            {
                result = await _supplierData.UpdateSupplierCategory(item, supplierId);
            }

            return result;
        }

        public async Task<bool> SaveSupplierWorkflowData(WorkflowDto workflow)
        {
            var result = await _supplierData.SaveSupplierWorkflowData(workflow);
            return result;
        }

        public async Task<bool> UpdateSupplierStatus(int supplierid, string status)
        {
            var result = await _supplierData.UpdateSupplierStatus(supplierid, status);
            return result;
        }
        public async Task<int> IsSupplierExists(string supplierName, string category)
        {
            var result = await _supplierData.IsSupplierExists(supplierName, category);
            return result;
        }

        public async Task<SupplierExistsDto> IsSupplierExistsWithStatus(string supplierName, string category)
        {
            var result = await _supplierData.IsSupplierExistsWithStatus(supplierName, category);
            return result;
        }

        public async Task<SupplierExistsDto> IsRegistered(string supplierName)
        {
            var result = await _supplierData.IsRegistered(supplierName);
            return result;
        }

        public async Task<bool> UpdateSupplierIfsCode(int supplierId, string ifscode)
        {
            var result = await _supplierData.UpdateSupplierIfsCode(supplierId, ifscode);
            return result;
        }

        public async Task<bool> UpdateEmgSupplierIfsCode(int supplierId, string ifscode)
        {
            var result = await _supplierData.UpdateEmgSupplierIfsCode(supplierId, ifscode);
            return result;
        }

        public async Task<bool> SaveHistory(SupplierHistoryDto history)
        {
            var result = await _supplierData.SaveHistory(history);
            return result;
        }


        public async Task<bool> saveIFSFailedRecords(IfsFailMessageDto history)
        {
            var result = await _supplierData.saveIFSFailedRecords(history);
            return result;
        }

        public async Task<bool> DeleteEmergency(int supplierId)
        {
            var result = await _supplierData.DeleteEmergency(supplierId);
            return result;
        }

        public async Task<bool> DeleteInvite(int supplierId)
        {
            var result = await _supplierData.DeleteInvite(supplierId);
            return result;
        }

        public async Task<IList<EmergencySupplierDto>> SearchEmergencyForRole(string role)
        {
            var result = await _supplierData.SearchEmergencyForRole(role);
            return result;
        }
        
        public async Task<bool> IsHSEQupdated(string supplierID, string updatedBy, string updatedDateTime)
        {
            var result = await _supplierData.HSEQupdatedAction(supplierID, updatedBy, updatedDateTime);
            return result;
        }

        public async Task<List<DashboardStatDto>> GetDashboardStatistic(string role)
        {
            var result = await _supplierData.GetDashboardStatistic(role);
            return result;
        }
        
        public async Task<IList<PendingSupplierDto>> GetSuppliersOnlyPendingForRole(string rolename)
        {
            IList<PendingSupplierDto> result = await _supplierData.GetSuppliersOnlyPendingForRole(rolename);
            return result;
        }

        public async Task<IList<CategoriesForHSEQDto>> GetSupplierCategoriesForHSEQ(string supplierID)
        {
            var result = await _supplierData.GetSupplierCategoriesForHSEQ(supplierID);
            return result;
        }

        public async Task<bool> UpdateSupplierCategoryByHSEQ(IList<SupplierCategoryDto> category, int supplierId)
        {
            var result = false;
            foreach (var item in category)
            {
                result = await _supplierData.UpdateSupplierCategoryByHSEQ(item, supplierId);
            }

            return result;
        }
        
        public async Task<IList<SupplierBankDto>> AllSuppliers()
        {
            IList<SupplierBankDto> result = await _supplierData.AllSuppliers();
            return result;  
        }

        public async Task<IList<SupplierBankDto>> AllSuppliersTrunc()
        {
            IList<SupplierBankDto> result = await _supplierData.AllSuppliersTrunc();
            return result;
        }

        public async Task<IList<SupplierAuditDto>> AllSuppliersWithAudit()
        {
            IList<SupplierAuditDto> result = await _supplierData.AllSuppliersWithAudit();
            return result;
        }

        public async Task<IList<SupplierAllCategoriesDto>> SupplierAllCategories(int[] supplierID)
        {
            var suppliercategories = await _supplierData.SupplierCategories(supplierID);
            return suppliercategories;
        }        

        public async Task<string> GetSupplierAuditType(int supplierID)
        {
            var suppliercategories = await _supplierData.GetSupplierAuditType(supplierID);
            return suppliercategories;
        }

        public async Task<bool> UpdateSupplierAuditType(SupplierAuditTypeDto supplierAuditType)
        {
            var suppliercategories = await _supplierData.UpdateSupplierAuditType(supplierAuditType);
            return suppliercategories;
        }

        public async Task<IList<ChangeApprovalDto>> GetAllChangeApprovalsForRole(string rolename)
        {
            IList<ChangeApprovalDto> result = await _supplierData.GetAllChangeApprovalsForRole(rolename);
            return result;
        }

        private string GetExtention(string filesPath, string filesToFind)
        {
            var folderName = Path.Combine(filesPath);
            var photos = Directory.EnumerateFiles(folderName, filesToFind)
                .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));
            return photos.First();
        }

        private void DeleteNewFiles(int supplierId, string filesPath, bool isApproved)
        {
            string newFilesToMove = @"*" + supplierId + "_*";
            string[] fileList = System.IO.Directory.GetFiles(filesPath + "/New", newFilesToMove);

            if (isApproved)
            {
                foreach (string file in fileList)
                {
                    string fileName = file.Substring(filesPath.Length + 5);
                    string tagname = fileName.Split(".").First();
                    string filesToDelete = @"*" + tagname + "*";
                    string[] fileListToDelete = System.IO.Directory.GetFiles(filesPath, filesToDelete);
                    foreach (string oldFile in fileListToDelete)
                    {
                        System.IO.File.Delete(oldFile);
                    }
                    System.IO.File.Move(file, Path.Combine(filesPath, fileName), true);
                }
            }
            else 
            {
                foreach (string file in fileList)
                {
                    System.IO.File.Delete(file);
                }
            }            
        }




        public async Task<SupplierChangesDto> GetSupplierChangesForApproval(int supplierId, string filesPath)
        {
            bool isCategoryChange = false;
            bool isBanckChange = false;
            bool isGeneralChange = false;


            SuppliersTabChangeDto suppliersTabChange = await _supplierData.GetSupplierChangesForApproval(supplierId);
            SupplierDto changedSupplier = JsonConvert.DeserializeObject<SupplierDto>(suppliersTabChange.supplierDto);
            IList<SupplierDto> supplierPromise = await GetRegisteredSupplier(supplierId.ToString());
            SupplierDto supplier = supplierPromise[0];


            // Checking for Category details changes

            if (changedSupplier.supplierCategories.Length != supplier.supplierCategories.Length)
            {
                isCategoryChange = true;
            }

            /*foreach (var catChange in changedSupplier.supplierCategories)
            {
                foreach (var prevCategory in supplier.supplierCategories)
                {
                    if (catChange.generalCategory != prevCategory.generalCategory || catChange.subCategory != prevCategory.subCategory || catChange.detailCategory != prevCategory.detailCategory)
                    {
                        isCategoryChange = true;
                    }
                }
            }*/
            // Checking for Bank details changes
            if (supplier.bankName != changedSupplier.bankName || supplier.accountHolderName != changedSupplier.accountHolderName)
            {
                isBanckChange = true;
            }

            /*if (supplier.bankCode != changedSupplier.bankCode || supplier.bankName != changedSupplier.bankName || supplier.otherBankName != changedSupplier.otherBankName
               || supplier.swiftcode != changedSupplier.swiftcode || supplier.accountHolderName != changedSupplier.accountHolderName || supplier.account_number != changedSupplier.account_number
               || supplier.bankAddress != changedSupplier.bankAddress || supplier.bankAddress2 != changedSupplier.bankAddress2 || supplier.ibanNo != changedSupplier.ibanNo
               || supplier.accountCurrency != changedSupplier.accountCurrency || supplier.multicurrency != changedSupplier.multicurrency
               )
            {
                isBanckChange = true;
            }*/
            // Checking for General details changes
            /*if (
                                   supplier.additionalCtrl != changedSupplier.additionalCtrl || supplier.additionalCtrl2 != changedSupplier.additionalCtrl2 || supplier.additionalCtrl3 != changedSupplier.additionalCtrl3 ||
                                   supplier.additionalCtrl4 != changedSupplier.additionalCtrl4 || supplier.additionalCtrl5 != changedSupplier.additionalCtrl5 || supplier.additional_material != changedSupplier.additional_material ||
                                   supplier.address_line1 != changedSupplier.address_line1 || supplier.address_line2 != changedSupplier.address_line2 || supplier.city != changedSupplier.city ||
                                   supplier.compliance1 != changedSupplier.compliance1 || supplier.compliance2 != changedSupplier.compliance2 || supplier.country != changedSupplier.country ||
                                   supplier.cr_exp_date != changedSupplier.cr_exp_date || supplier.cr_no != changedSupplier.cr_no || supplier.criticality != changedSupplier.criticality ||
                                   supplier.currentAsset1 != changedSupplier.currentAsset1 || supplier.currentAsset2 != changedSupplier.currentAsset2 || supplier.dedicatedpers != changedSupplier.dedicatedpers ||
                                   supplier.designnCap != changedSupplier.designnCap || supplier.docuHse != changedSupplier.docuHse || supplier.draftLimit != changedSupplier.draftLimit ||
                                   supplier.due_date != changedSupplier.due_date || supplier.email != changedSupplier.email || supplier.email1 != changedSupplier.email1 ||
                                   supplier.email2 != changedSupplier.email2 || supplier.environment1 != changedSupplier.environment1 || supplier.environment2 != changedSupplier.environment2 ||
                                   supplier.envtMgt1 != changedSupplier.envtMgt1 || supplier.envtMgt2 != changedSupplier.envtMgt2 || supplier.establishment_year != changedSupplier.establishment_year ||
                                   supplier.extension != changedSupplier.extension || supplier.extension1 != changedSupplier.extension1 || supplier.extension2 != changedSupplier.extension2 ||
                                   supplier.fax_country_code != changedSupplier.fax_country_code || supplier.fax_country_code1 != changedSupplier.fax_country_code1 || supplier.fax_country_code2 != changedSupplier.fax_country_code2 ||
                                   supplier.fax_no != changedSupplier.fax_no || supplier.fax_no1 != changedSupplier.fax_no1 || supplier.fax_no2 != changedSupplier.fax_no2 ||
                                   supplier.finishProd != changedSupplier.finishProd || supplier.first_name != changedSupplier.first_name || supplier.first_name1 != changedSupplier.first_name1 ||
                                   supplier.first_name2 != changedSupplier.first_name2 || supplier.gosi_certificate != changedSupplier.gosi_certificate || supplier.gosi_date != changedSupplier.gosi_date ||
                                   supplier.hijriSelected != changedSupplier.hijriSelected || supplier.hse1 != changedSupplier.hse1 || supplier.hse2 != changedSupplier.hse2 ||
                                   supplier.hseDesig != changedSupplier.hseDesig || supplier.hseName != changedSupplier.hseName || supplier.ibanNo != changedSupplier.ibanNo ||
                                   supplier.ifs_code != changedSupplier.ifs_code || supplier.imiInterested1 != changedSupplier.imiInterested1 || supplier.imiInterested2 != changedSupplier.imiInterested2 ||
                                   supplier.internalPolicy != changedSupplier.internalPolicy || supplier.invitestatus != changedSupplier.invitestatus || supplier.isSupplierPortalUser != changedSupplier.isSupplierPortalUser ||
                                   supplier.isohealth != changedSupplier.isohealth || supplier.issued_by != changedSupplier.issued_by || supplier.labour1 != changedSupplier.labour1 ||
                                   supplier.labour2 != changedSupplier.labour2 || supplier.last_name != changedSupplier.last_name || supplier.last_name1 != changedSupplier.last_name1 ||
                                   supplier.last_name2 != changedSupplier.last_name2 || supplier.legalAsset1 != changedSupplier.legalAsset1 || supplier.legalAsset2 != changedSupplier.legalAsset2 ||
                                   supplier.litigation1 != changedSupplier.litigation1 || supplier.litigation2 != changedSupplier.litigation2 || supplier.managerialno != changedSupplier.managerialno ||
                                   supplier.mobile_country_code != changedSupplier.mobile_country_code || supplier.mobile_country_code1 != changedSupplier.mobile_country_code1 || supplier.mobile_country_code2 != changedSupplier.mobile_country_code2 ||
                                   supplier.mobile_no != changedSupplier.mobile_no || supplier.mobile_no1 != changedSupplier.mobile_no1 || supplier.mobile_no2 != changedSupplier.mobile_no2 ||
                                   supplier.multicurrency != changedSupplier.multicurrency || supplier.netIncome1 != changedSupplier.netIncome1 || supplier.netIncome2 != changedSupplier.netIncome2 ||
                                   supplier.noOfYears != changedSupplier.noOfYears || supplier.operatingProfit1 != changedSupplier.operatingProfit1 || supplier.operatingProfit2 != changedSupplier.operatingProfit2 ||
                                   supplier.operationsno != changedSupplier.operationsno || supplier.other_city != changedSupplier.other_city || supplier.ownercompany != changedSupplier.ownercompany ||
                                   supplier.po_box != changedSupplier.po_box || supplier.position != changedSupplier.position || supplier.position1 != changedSupplier.position1 ||
                                   supplier.position2 != changedSupplier.position2 || supplier.postal_code != changedSupplier.postal_code || supplier.process_id != changedSupplier.process_id ||
                                   supplier.qualityDesig != changedSupplier.qualityDesig || supplier.qualityMgt != changedSupplier.qualityMgt || supplier.qualityMgtIso != changedSupplier.qualityMgtIso ||
                                   supplier.qualityName != changedSupplier.qualityName || supplier.qualityPolicy1 != changedSupplier.qualityPolicy1 || supplier.qualityPolicy2 != changedSupplier.qualityPolicy2 ||
                                   supplier.qualityResp1 != changedSupplier.qualityResp1 || supplier.qualityResp2 != changedSupplier.qualityResp2 || supplier.qualityResp3 != changedSupplier.qualityResp3 ||
                                   supplier.qualityreviewDate != changedSupplier.qualityreviewDate || supplier.reg_date != changedSupplier.reg_date || supplier.registeredOrg != changedSupplier.registeredOrg ||
                                   supplier.revisionNo != changedSupplier.revisionNo || supplier.saudiNationalsno != changedSupplier.saudiNationalsno || supplier.saudi_date != changedSupplier.saudi_date ||
                                   supplier.shareholder1 != changedSupplier.shareholder1 || supplier.shareholder2 != changedSupplier.shareholder2 || supplier.sistercompany != changedSupplier.sistercompany ||
                                   supplier.statistic != changedSupplier.statistic || supplier.statisticEnvt != changedSupplier.statisticEnvt || supplier.statisticFatal != changedSupplier.statisticFatal ||
                                   supplier.statisticFirst != changedSupplier.statisticFirst || supplier.statisticLost != changedSupplier.statisticLost || supplier.statisticMedical != changedSupplier.statisticMedical ||
                                   supplier.statisticNear != changedSupplier.statisticNear || supplier.status != changedSupplier.status || supplier.supplierCategories != changedSupplier.supplierCategories ||
                                   supplier.supplier_code != changedSupplier.supplier_code || supplier.supplier_extra != changedSupplier.supplier_extra || supplier.supplier_id != changedSupplier.supplier_id ||
                                   supplier.supplier_name != changedSupplier.supplier_name || supplier.supplier_name_arabic != changedSupplier.supplier_name_arabic || supplier.supplier_type != changedSupplier.supplier_type ||
                                   supplier.suspendedProj1 != changedSupplier.suspendedProj1 || supplier.suspendedProj2 != changedSupplier.suspendedProj2 || supplier.technicalno != changedSupplier.technicalno ||
                                   supplier.telephone_no != changedSupplier.telephone_no || supplier.telephone_no1 != changedSupplier.telephone_no1 || supplier.telephone_no2 != changedSupplier.telephone_no2 ||
                                   supplier.telphone_country_code != changedSupplier.telphone_country_code || supplier.telphone_country_code1 != changedSupplier.telphone_country_code1 || supplier.telphone_country_code2 != changedSupplier.telphone_country_code2 ||
                                   supplier.title != changedSupplier.title || supplier.title1 != changedSupplier.title1 || supplier.title2 != changedSupplier.title2 ||
                                    supplier.totalEquity1 != changedSupplier.totalEquity1 || supplier.totalEquity2 != changedSupplier.totalEquity2 || supplier.totalLiable1 != changedSupplier.totalLiable1 ||
                                     supplier.totalLiable2 != changedSupplier.totalLiable2 || supplier.totallno != changedSupplier.totallno
                                   )*/

            if (supplier.supplier_name != changedSupplier.supplier_name || supplier.telephone_no != changedSupplier.telephone_no || supplier.first_name != changedSupplier.first_name || supplier.last_name != changedSupplier.last_name)
               
            {
                isGeneralChange = true;
            }




            var supplier_extra = changedSupplier.supplier_extra.TrimEnd(',');

            string mappingFilePath = Directory.GetCurrentDirectory() + "\\Util\\ChangeCodeToSupplierDto.json";
            StreamReader r = new StreamReader(mappingFilePath);
            string json = r.ReadToEnd();
            r.Close();
            List<ChangeCodeToSupplierDto> items = JsonConvert.DeserializeObject<List<ChangeCodeToSupplierDto>>(json);

            List<Property> variants = new List<Property>();
            SupplierCategoryDto[] oldCategories = null;
            SupplierCategoryDto[] newCategories = null;
            foreach (string code in supplier_extra.Split(","))
            {
                var item = items.Find(x => x.Code == code);
                if (item == null)
                {
                    continue;
                }
                if (item.Code == "+")
                {
                    oldCategories = supplier.supplierCategories;
                    newCategories = changedSupplier.supplierCategories;
                }
                else if (item.Type == "Text")
                {
                    var oldValue = supplier.GetType().GetProperty(item.Property).GetValue(supplier, null).ToString();
                    var newValue = changedSupplier.GetType().GetProperty(item.Property).GetValue(changedSupplier, null).ToString();
                    var variant = new Property(item.Property, item.Page, item.Tab, item.FieldName, oldValue, newValue, item.Type);
                    variants.Add(variant);
                }
                else if (item.Type == "File")
                {
                    var oldFile = GetExtention(filesPath, @"" + supplier.supplier_id + "_" + item.Code + "*");
                    var newFile = GetExtention(filesPath + "/New", @"" + supplier.supplier_id + "_" + item.Code + "*");
                    var variant = new Property(item.Property,
                                               item.Page,
                                               item.Tab,
                                               item.FieldName,
                                               oldFile,
                                               newFile,
                                               item.Type);
                    variants.Add(variant);
                }

            }

            var newSupplier = new SupplierChangesDto(
                supplier.supplier_id,
                supplier.supplier_name,
                supplier.status,
                suppliersTabChange.submittedDate,
                variants,
                oldCategories,
                newCategories,
                isCategoryChange,
                isBanckChange,
                isGeneralChange);
            return newSupplier;
        }

        public async Task<bool> SupplierChangesApproval(int supplierId, string approvalStatus, bool isApproved, string filesPath)
        { 
            if (isApproved)
            {
                SuppliersTabChangeDto suppliersTabChange = await _supplierData.GetSupplierChangesForApproval(supplierId);
                SupplierDto changedSupplier = JsonConvert.DeserializeObject<SupplierDto>(suppliersTabChange.supplierDto);
                changedSupplier.isSupplierPortalUser = false;
                await SaveSupplier(changedSupplier);
            }
            //await _supplierData.UpdateSupplierStatus(supplierId, "Approved");
            //DeleteNewFiles(supplierId, filesPath, isApproved);
            //return await _supplierData.DeleteSupplierChangesApproval(supplierId);
            return await _supplierData.UpdateSupplierStatus(supplierId, approvalStatus);
            //return await _supplierData.UpdateSupplierStatus(supplierId, "Approved");

        }
        public async Task<int> SaveReviewForm(ReviewFormDto reviewForm)
        {
            return await _supplierData.SaveReviewForm(reviewForm);
        }
        public async Task<IList<ReviewFormDto>> GetAllReviewForms()
        {
            IList<ReviewFormDto> result = await _supplierData.GetAllReviewForms();
            return result;
        }
        public async Task<ReviewFormDto> GetReviewForm(int id)
        {
            var result = await _supplierData.GetReviewForm(id);
            return result;
        }
        public async Task<IList<ReviewResponseDto>> GetAllReviewResponses(string loggedInUser)
        {
            IList<ReviewResponseDto> reviews = await _supplierData.GetAllReviewResponses(loggedInUser);
            return reviews;
        }
        public async Task<ReviewResponseDto> GetReviewResponse(int reviewResponseId)
        {
            ReviewResponseDto reviewResponse = await _supplierData.GetReviewResponse(reviewResponseId);
            return reviewResponse;
        }
        public async Task<ReviewResponseDto> GetReviewResponseBySessionAndUser(int reviewSessionId, string conductedUserId, int supplierId)
        {
            ReviewResponseDto reviewResponse = await _supplierData.GetReviewResponseBySessionAndUser(reviewSessionId, conductedUserId, supplierId);
            return reviewResponse;
        }

        public async Task<List<ReviewResponseDto>> GetSessionReviewResponseScores(int reviewSessionId, int supplierId)
        {
            List<ReviewResponseDto> reviewResponse = await _supplierData.GetSessionReviewResponseScores(reviewSessionId, supplierId);
            return reviewResponse;
        }

        public async Task<bool> SaveReviewResponse(ReviewResponseDto reviewResponse)
        {
            try
            {
                
                dynamic result = JsonConvert.DeserializeObject(reviewResponse.review);
                var totalScore = 0.00;
                var scoredCount = 0.00;
                foreach (var section in result)
                {
                    foreach (var item in section["items"])
                    {
                        if (section.ContainsKey("enableScore") && section["enableScore"] == true)
                        //if (section.ContainsKey("enableScore") && section["enableScore"] == true && item["type"] != "label")
                            {
                            scoredCount += 1;
                        }
                    }
                }

                var weightage = 100 / scoredCount;
                foreach (var section in result)
                {
                    
                    if (section["items"] == null) {
                        continue;
                    }
                    var sectionScore = 0.00;
                    var denominator = 0.00; 
                   
                    if (section.ContainsKey("enableScore") && section["enableScore"] == true)
                    {
                        foreach (var item in section["items"])
                        {
                            if (item.ContainsKey("Weightage"))
                           // if (item.ContainsKey("Weightage") && item["type"] != "label")
                                { 
                                var w = item["Weightage"];
                                if (w != "")
                                {
                                    weightage = w;
                                }
                            }
                            denominator += 5.00;
                            if (item.ContainsKey("score"))
                            {
                                sectionScore += (Double.Parse(Convert.ToString(item["score"]))/5) * weightage;
                            }
                        }
                        totalScore += sectionScore;
                    }
                }
                reviewResponse.score = totalScore;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

           await _supplierData.SaveReviewResponse(reviewResponse);
           IList<ReviewTodoDto> reviewToDos = await _supplierData.GetReviewTodosByReviewResponse(reviewResponse.id);
            foreach (var reviewToDo in reviewToDos)
            {
                if (reviewToDo.actionType == "supplier reviewal")
                {
                    reviewToDo.status = "completed";
                    return await _supplierData.SaveReviewTodo(reviewToDo);
                }
                
            }
            return false;
        }

        public async Task<bool> SaveReviewOutcome(ReviewOutcomeDto reviewOutcome)
        { 
            return await _supplierData.SaveReviewOutcome(reviewOutcome);
        }
        public async Task<bool> BlockSupplierByReviewOutcome(int supplierId, string supplierCode, string comment, string ifsBeUrl)
        {
            using var httpClient = new HttpClient();
            var supplierBlock = new SupplierBlockDto();
            supplierBlock.supplierCode = supplierCode;
            supplierBlock.reason = comment;
            var supplierBlockData = new StringContent(System.Text.Json.JsonSerializer.Serialize(supplierBlock), Encoding.UTF8, "application/json");
            using var response =  await httpClient.PostAsync(ifsBeUrl + "/api/supplierblock", supplierBlockData);
            response.EnsureSuccessStatusCode();
            //dynamic approvers = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());

            return await _supplierData.BlockSupplierByReviewOutcome(supplierId);
        }
        public async Task<List<ReviewOutcomeDto>> GetReviewOutcomeBySupplier(int sessionId, int supplierId)
        {
            List<ReviewOutcomeDto> reviews = await _supplierData.GetReviewOutcomeBySupplier(sessionId, supplierId);
            return reviews;
        }
        public async Task<List<ReviewOutcomeDto>> GetReviewOutcomes(string loggedInUser)
        {
            List<ReviewOutcomeDto> reviews = await _supplierData.GetReviewOutcomes(loggedInUser);
            return reviews;
        }
        public async Task<IList<ReviewSessionDto>> GetAllReviewSessions()
        {
            IList<ReviewSessionDto> reviews = await _supplierData.GetAllReviewSessions();
            return reviews;
        }
        public async Task<ReviewSessionDto> GetReviewSession(int reviewSessionId)
        {
            ReviewSessionDto reviewResponse = await _supplierData.GetReviewSession(reviewSessionId);
            return reviewResponse;
        }

        public async Task<IList<ReviewSessionDto>> GetReviewSessionsByUser(string loggedInUser)
        {
            IList<ReviewSessionDto> reviewResponse = await _supplierData.GetReviewSessionsByUser(loggedInUser);
            return reviewResponse;
        }

        public async Task<bool> SaveReviewSession(ReviewSessionDto reviewSession)
        {
            return await _supplierData.SaveReviewSession(reviewSession);
        }

        public async Task<bool> PublishReviewSession(ReviewSessionDto reviewSession)
        {
            string[] suppliersToReview = reviewSession.suppliers.Split(',');
            var created = false;
            ReviewSessionDto existingSession = await _supplierData.GetReviewSession(reviewSession.id);
            reviewSession.status = "published";
            _supplierData.SaveReviewSession(reviewSession);
            foreach (int value in Enumerable.Range(0, suppliersToReview.Length))
            {
                ReviewOutcomeDto outcome = new ReviewOutcomeDto();
                outcome.id = 0;
                outcome.sessionId = reviewSession.id;
                outcome.supplierId = Convert.ToInt32(suppliersToReview[value]);
                outcome.outcome = "";
                outcome.finalScore = 0;
                outcome.status = "waiting for reviews";
                await _supplierData.SaveReviewOutcome(outcome);
            }
            if (reviewSession.scheduled == 1 && (DateTime.Parse(reviewSession.startDate) > DateTime.Now || DateTime.Now > DateTime.Parse(reviewSession.endDate)))
            {
                return false;
            }

            if (reviewSession.assignedUsers != "")
            {

                var form = await _supplierData.GetReviewForm(reviewSession.formId);
                string[] assignedUsersOrUserRoles;
                if (reviewSession.assignType == "users")
                {
                    assignedUsersOrUserRoles = reviewSession.assignedUsers.Split(',');
                }
                else
                {
                    assignedUsersOrUserRoles = reviewSession.assignedUserRoles.Split(',');
                }
                foreach (int value in Enumerable.Range(0, assignedUsersOrUserRoles.Length))
                {
                    foreach (int value_1 in Enumerable.Range(0, suppliersToReview.Length))
                    {
                        ReviewResponseDto response = new ReviewResponseDto();
                        response.conductedUser = assignedUsersOrUserRoles[value];
                        response.id = 0;
                        response.score = 0;
                        response.review = form.form;
                        response.reviewSessionId = reviewSession.id;
                        response.status = "waiting for review";
                        response.supplierId = Convert.ToInt32(suppliersToReview[value_1]);
                        int reviewResponseId = await _supplierData.SaveReviewResponse(response);

                        ReviewTodoDto reviewTodo = new ReviewTodoDto();
                        reviewTodo.id = 0;
                        reviewTodo.actionType = "supplier reviewal";
                        reviewTodo.status = "pending";
                        reviewTodo.reviewResponseId = reviewResponseId;
                        reviewTodo.actionTakerUsername = assignedUsersOrUserRoles[value];
                        await _supplierData.SaveReviewTodo(reviewTodo);
                    }
                }
                
               
                try
                {
                    var _emailSender = new EmailService(_emailConfig);
                    List<string> emailList = new List<string>();
                    var tempEmailList = _emailSender.GetWorkflowUsersEmail(reviewSession.assignedUsers);
                    if (tempEmailList.Result == null)
                    {
                        tempEmailList = _emailSender.GetWorkflowUsersEmail(reviewSession.assignedUsers);

                    }
                    var tolist = tempEmailList.Result.Select(i => i.ToString()).ToArray();
                    emailList.AddRange(tolist);

                    List<string> receiversList = emailList.Distinct().ToList();
                    var period = "";
                    if (reviewSession.periodType == "preset")
                    {
                        period = reviewSession.presetPeriod + ", " + reviewSession.reviewYear;
                    }
                    else
                    {
                        period = reviewSession.startDate.Substring(0,10) + " to " + reviewSession.endDate.Substring(0, 10);
                    }

                    IList<SupplierBankDto> result = await _supplierData.AllSuppliersTrunc(reviewSession.suppliers);
                    List<string> supplierNames = result.Select(o => o.SupplierName).ToList();
                    var message = new MessagePerformanceReviewDto(receiversList, string.Join(",", supplierNames), period, reviewSession.evaluationName);
                    _emailSender.SendPeformanceReviewEmail(message);
                    return true;
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
            return true;
           
        }
        public async Task<List<ReviewApproverDto>> GetReviewApproversByResponse(int reviewResponseId)
        {
            List<ReviewApproverDto> reviews = await _supplierData.GetReviewApproversByResponse(reviewResponseId);
            return reviews;
        }
        public async Task<bool> SaveReviewApprover(ReviewApproverDto reviewApprover)
        {
            await _supplierData.SaveReviewApprover(reviewApprover);
            List<string> approvalCompletedStatuses = new List<string> {"approved", "rejected", "reinitiated"};
            if (approvalCompletedStatuses.Contains(reviewApprover.status))
            {
                IList<ReviewTodoDto> reviewToDos = await _supplierData.GetReviewTodosByReviewResponse(reviewApprover.reviewResponseId);
                foreach (var reviewToDo in reviewToDos)
                {
                    if (reviewToDo.actionType == "review approval")
                    {
                        reviewToDo.status = "completed";
                        return await _supplierData.SaveReviewTodo(reviewToDo);
                    }

                }
            }
           
            return true;
        }
        public async Task<bool> SaveReviewTodo(ReviewTodoDto reviewTodo)
        {
            return await _supplierData.SaveReviewTodo(reviewTodo);
        }
        public async Task<IList<ReviewTodoDto>> GetReviewTodosByUser(string loggedInUser)
        {
            return await _supplierData.GetReviewTodosByUser(loggedInUser);
        }
        public async Task<IList<ReviewTodoDto>> GetReviewTodosByReviewResponse(int reviewResponse)
        {
            return await _supplierData.GetReviewTodosByReviewResponse(reviewResponse);
        }
        public async Task<List<DashboardStatDto>> GetSuppliersCountBasedOnRole(string rolename)
        {
            var result = await _supplierData.GetSuppliersStatusCountBasedOnRole(rolename);
            return result;
        }

        public async Task<List<IfsIntegrationDto>> GetIfsFailedData(int supplierID)
        {
            var ifsfailedsuppliers = await _supplierData.GetIfsFailedData(supplierID);
            return ifsfailedsuppliers;
        }

        public async Task<bool> UpdateReInterfaceStatus(int supplierId)
        {
            var ifsfailedsuppliers = await _supplierData.UpdateReInterfaceStatus(supplierId);
            return ifsfailedsuppliers;
        }

        public async Task<int> UpdateRegisterSupplierByRole(SupplierDto supplier, string role, string changeremail, string changername)
        {
            var supplierid = await _supplierData.UpdateRegisteredSupplierByRole(supplier,role,changeremail,changername);
            return supplierid;
        }

        public async Task<List<IfsHistoryUpdateDto>> GetIfsFailedUpdatedHistory(int supplierID)
        {
            var ifsfailedsuppliers = await _supplierData.GetIfsFailedUpdatedHistory(supplierID);
            return ifsfailedsuppliers;
        }

        public async Task<List<SupplierDto>> GetSupplierDraftData(IsExistsDto isExists)
        {
            var result = await _supplierData.GetSupplierInformation(isExists);
            return result;
        }

        public async Task<bool> DeleteExistingDraftSupplier(DeleteDraftSupplierDto DeleteDraftSupplier)
        {
            var result = await _supplierData.DeleteExistingDraftSupplier(DeleteDraftSupplier);
            return result;
        }

        public async Task<IList<SupplierBankDto>> AllApprovedSuppliers()
        {
            IList<SupplierBankDto> result = await _supplierData.AllApprovedSuppliers();
            return result;
        }

        public async Task<List<SupplierDto>> GetExpiredDetailsAsync(string supplierId, string email)
        {
            return await _supplierData.GetAllSupplierAsync(supplierId, email);
        }

        public async Task<bool> FetchReviewApprovers(ReviewResponseDto reviewResponse, string ifsBeUrl)
        {
            using var httpClient = new HttpClient();
            var reviewResponseContent = new StringContent(System.Text.Json.JsonSerializer.Serialize(reviewResponse), Encoding.UTF8, "application/json");
            using var response = await httpClient.PostAsync(ifsBeUrl + "/api/reviewapprover", reviewResponseContent);
            response.EnsureSuccessStatusCode();
            dynamic approvers = JsonConvert.DeserializeObject(await response.Content.ReadAsStringAsync());
            foreach (var approver in approvers)
            {

                ReviewApproverDto reviewApprover = new ReviewApproverDto();
                reviewApprover.reviewResponseId = reviewResponse.id;
                reviewApprover.approverId = approver.approverId;
                reviewApprover.approverName = approver.approverName;
                reviewApprover.status = "to be approved";
                reviewApprover.email = approver.email;
                reviewApprover.stepNo = approver.stepNo;
                reviewApprover.type = "individual";
                reviewApprover.role = approver.role;
                await _supplierData.SaveReviewApprover(reviewApprover);
            }
            var _emailSender = new EmailService(_emailConfig);
            string firstApprover = approvers[0].approverName;
            var period = "";
            if (reviewResponse.periodType == "preset")
            {
                period = reviewResponse.presetPeriod + ", " + reviewResponse.reviewYear;
            }
            else
            {
                period = reviewResponse.startDate.Substring(0, 10) + " to " + reviewResponse.endDate.Substring(0, 10);
            }

            ReviewTodoDto reviewTodo = new ReviewTodoDto();
            reviewTodo.actionType = "review approval";
            reviewTodo.status = "pending";
            reviewTodo.actionTakerUsername = firstApprover;
            reviewTodo.reviewResponseId = reviewResponse.id;
            await _supplierData.SaveReviewTodo(reviewTodo);

            var message = new MessageReviewApprovalDTO(approvers[0].email.split(','), reviewResponse.supplierName, period, reviewResponse.evaluationName, firstApprover, reviewResponse.conductedUser);
            _emailSender.SendReviewApprovalEmail(message);

            return true;

        }

        public async Task<ReviewerSupervisorDto> GetReviewerSupervisor(string reviewerName)
        {
            var result = await _supplierData.GetReviewerSupervisor(reviewerName);
            return result;
        }
    }
}