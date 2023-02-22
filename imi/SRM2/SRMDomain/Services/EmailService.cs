using iText.Html2pdf;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using Newtonsoft.Json;
using SRMDomain.Data;
using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using NLog;

namespace SRMDomain.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailConfigDto _emailConfig;
        private static Logger logger = LogManager.GetCurrentClassLogger();

        public EmailService(EmailConfigDto emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public void SendEmail(MessageDto message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage);
        }

        public async Task SendEmailAsync(MessageDto message)
        {
            var emailMessage = await CreateEmailMessageAsync(message);
            await SendAsync(emailMessage);
        }

        public void SendPeformanceReviewEmail(MessagePerformanceReviewDto message)
        {
            var emailMessage = CreatePerformanceReviewEmailMessage(message);
            Send(emailMessage);
        }
        public void SendReviewApprovalEmail(MessageReviewApprovalDTO message)
        {
            var emailMessage = CreateReviewApprovalEmailMessage(message);
            Send(emailMessage);
        }

        public void SendReviewReinitiationEmail(MessageReviewReinitiationDTO message)
        {
            var emailMessage = CreateReviewReinitiationEmailMessage(message);
            Send(emailMessage);
        }
        public void SendRejectionReviewerMail(MessageReviewRejectionDTO message)
        {
            var emailMessage = CreateReviewRejectionEmailMessage(message);
            Send(emailMessage);
        }
        public void SendResponseReceivedEmail(MessageResponseReceivedDTO message)
        {
            var emailMessage = CreateResponseReceivedEmailMessage(message);
            Send(emailMessage);
        }

        public void SendSupplierReviewCompleteMail(MessageSupplierReviewCompletedDto message)
        {
            var emailMessage = CreateSupplierReviewCompleteEmailMessage(message);
            Send(emailMessage);
        }

        public void SendEmergencyEmail(MessageDto message)
        {
            var emailMessage = CreateEmgEmailMessage(message);
            //Send(emailMessage);
            SendEmergencyMSFlowApproval(message);
        }

        public void SendWorkflowEmail(MessageDto message)
        {
            var emailMessage = CreateNormalEmailMessage(message);
            //Send(emailMessage);
            SendMSFlowApproval(message);
        }

        public void sendWorkflowTriggeredMail(MessageDto message)
        {
            var emailMessage = CreateWorkflowTriggeredlMessage(message);
            Send(emailMessage);
            // SendMSFlowApproval(message);
        }

        public void SendCcEmail(MessageCcDto message, string roleName)
        {
            var emailMessage = CreateCcEmailMessage(message, roleName);
            Send(emailMessage);
        }

        public void SendAuditEmail(AuditMessageDto message)
        {
            var emailMessage = CreateAuditEmailMessage(message);
            Send(emailMessage);
        }

        public void SendAuditEmailHseq(AuditMessageDto message)
        {
            var emailMessage = CreateAuditEmailMessageHSEQ(message);
            Send(emailMessage);
        }

        public void SendAuditFinalEmail(FinalAuditMessageDto message)
        {
            var emailMessage = CreateAuditFinallMessage(message);
            Send(emailMessage);
        }

        public void SendAuditNonConfirmity(FinalAuditMessageDto message)
        {
            var emailMessage = CreateAuditNCMessage(message);
            Send(emailMessage);
        }

        public void SendAuditCompleteEmail(MessageDto message)
        {
            var emailMessage = CreateAuditCompleteMessage(message);
            Send(emailMessage);
        }

        // Audit Complete Mail to Supplier
        public void SendAuditCompleteSupplierEmail(MessageDto message)
        {
            var emailMessage = CreateAuditCompleteSupplierMessage(message);
            Send(emailMessage);
        }

        private string PopulateMessageWithSupplierDetails(string mailText, SupplierDto supplier)
        {
            string sourceDirectory = @"D:\Resources\Images";
            string searchTag = supplier.supplier_id + "_*";
            var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

            var tag_r1 = "-";
            var tag_v1 = "-";
            var tag_m1 = "-";
            var tag_q1 = "-";
            var tag_q2 = "-";
            var tag_q3 = "-";
            var tag_s1 = "-";
            var tag_e1 = "-";
            var tag_e2 = "-";
            var tag_e3 = "-";
            var tag_e4 = "-";
            var tag_e5 = "-";
            var tag_h1 = "-";
            var tag_h2 = "-";
            var tag_h3 = "-";
            var tag_h4 = "-";
            var tag_h6 = "-";
            var tag_z1 = "-";
            var tag_a1 = "-";
            var tag_a2 = "-";
            var tag_a3 = "-";
            var tag_a4 = "-";
            var tag_a5 = "-";
            var tag_a6 = "-";
            var tag_g1 = "-";
            var tag_f1 = "-";
            var tag_f2 = "-";
            var tag_f3 = "-";
            var tag_b1 = "-";
            var tag_b2 = "-";

            var additional_html = "";

            foreach (string currentFile in txtFiles)
            {
                string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                if (fileName.Contains("r1"))
                {
                    tag_r1 += "<span>" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</span> ";
                }
                if (fileName.Contains("b1"))
                {
                    tag_b1 += "<span>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                }
                if (fileName.Contains("b2"))
                {
                    tag_b2 += "<span>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                }
                if (fileName.Contains("m1"))
                {
                    tag_m1 += "<span>" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</span> ";
                }
                if (fileName.Contains("v1"))
                {
                    tag_v1 += "<span>" + supplier.supplier_name + "_VatRegistration_" + fileName + "</span> ";
                }
                if (fileName.Contains("q1"))
                {
                    tag_q1 += "<span>" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</span> ";
                }
                if (fileName.Contains("q2"))
                {
                    tag_q2 += "<span>" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</span> ";
                }
                if (fileName.Contains("q3"))
                {
                    tag_q3 += "<span>" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</span> ";
                }
                if (fileName.Contains("s1"))
                {
                    tag_s1 += "<span>" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</span> ";
                }
                if (fileName.Contains("e1"))
                {
                    tag_e1 += "<span>" + supplier.supplier_name + "_OrganizationDesignCapability_" + fileName + "</span> ";
                }
                if (fileName.Contains("e2"))
                {
                    tag_e2 += "<span>" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</span> ";
                }
                if (fileName.Contains("e3"))
                {
                    tag_e3 += "<span>" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</span> ";
                }
                if (fileName.Contains("e4"))
                {
                    tag_e4 += "<span>" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</span> ";
                }
                if (fileName.Contains("e5"))
                {
                    tag_e5 += "<span>" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</span> ";
                }
                if (fileName.Contains("h1"))
                {
                    tag_h1 += "<span>" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</span> ";
                }
                if (fileName.Contains("h2"))
                {
                    tag_h2 += "<span>" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</span> ";
                }
                if (fileName.Contains("h3"))
                {
                    tag_h3 += "<span>" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</span> ";
                }
                if (fileName.Contains("h4"))
                {
                    tag_h4 += "<span>" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</span> ";
                }
                if (fileName.Contains("h6"))
                {
                    tag_h6 += "<span>" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</span> ";
                }
                if (fileName.Contains("z1"))
                {
                    tag_z1 += "<span>" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</span> ";
                }
                if (fileName.Contains("a1"))
                {
                    tag_a1 += "<span>" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</span> ";
                }
                if (fileName.Contains("a2"))
                {
                    tag_a2 += "<span>" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</span> ";
                }
                if (fileName.Contains("a3"))
                {
                    tag_a3 += "<span>" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</span> ";
                }
                if (fileName.Contains("a4"))
                {
                    tag_a4 += "<span>" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</span> ";
                }
                if (fileName.Contains("a5"))
                {
                    tag_a5 += "<span>" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</span> ";
                }
                if (fileName.Contains("a6"))
                {
                    tag_a6 += "<span>" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</span> ";
                }
                if (fileName.Contains("g1"))
                {
                    tag_g1 += "<span>" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</span> ";
                }
                if (fileName.Contains("f1"))
                {
                    tag_f1 += "<span>" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</span> ";
                }
                if (fileName.Contains("f2"))
                {
                    tag_f2 += "<span>" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</span> ";
                }
                if (fileName.Contains("f3"))
                {
                    tag_f3 += "<span>" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</span> ";
                }
            }

            foreach (string currentFile in txtFiles)
            {
                string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                if (fileName.Contains("a2"))
                {
                    additional_html += "<tr class='rowheader'><td colspan='6' style='width: 50%'><div style='font -size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Title </div></td>" +
                        "<td colspan = '6' style = 'width: 50%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Additional Attachment </div></td>" +
                        "</tr><tr class='rowdata'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.additionalCtrl + "</div></td>" +
                        "<td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + tag_a2 + "</div></td></tr>";
                }
                if (fileName.Contains("a3"))
                {
                    additional_html += "<tr class='rowheader'><td colspan='6' style='width: 50%'><div style='font -size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Title</div></td>" +
                        "<td colspan = '6' style = 'width: 50%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Additional Attachment</div></td>" +
                        "</tr><tr class='rowdata'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.additionalCtrl2 + " </div></td>" +
                        "<td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + tag_a3 + " </div></td></tr>";
                }
                if (fileName.Contains("a4"))
                {
                    additional_html += "<tr class='rowheader'><td colspan='6' style='width: 50%'><div style='font -size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Title</div></td>" +
                        "<td colspan = '6' style = 'width: 50%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Additional Attachment</div></td>" +
                        "</tr><tr class='rowdata'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.additionalCtrl3 + "</div></td>" +
                        "<td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + tag_a4 + " </div></td></tr>";
                }
                if (fileName.Contains("a5"))
                {
                    additional_html += "<tr class='rowheader'><td colspan='6' style='width: 50%'><div style='font -size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Title</div></td>" +
                        "<td colspan = '6' style = 'width: 50%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Additional Attachment </div></td>" +
                        "</tr><tr class='rowdata'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.additionalCtrl4 + " </div></td>" +
                        "<td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + tag_a5 + "</div></td></tr>";
                }
                if (fileName.Contains("a6"))
                {
                    additional_html += "<tr class='rowheader'><td colspan='6' style='width: 50%'><div style='font -size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Title </div></td>" +
                        "<td colspan = '6' style = 'width: 50%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'> Additional Attachment </div></td>" +
                        "</tr><tr class='rowdata'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.additionalCtrl5 + " </div></td>" +
                        "<td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + tag_a6 + "</div></td></tr>";
                }

            }


            IList<CategoriesForHSEQDto> category = GetSupplierCategories(supplier.supplier_id.ToString()).Result;

            string categoriesTable = "";
            categoriesTable = "</br><table style='width:100%'><tr><th style='font-size:11px;border: 1px solid #ddd; padding: 8px;background-color: #f2f2f2;'>General Category</th>" +
                "<th style='font-size:11px;border: 1px solid #ddd; padding: 8px;background-color: #f2f2f2;'>Sub Category</th>" +
                "<th style='font-size:11px;border: 1px solid #ddd; padding: 8px;background-color: #f2f2f2;'>Detail Category</th></tr>";

            foreach (var item in category)
            {
                categoriesTable += "<tr>";
                categoriesTable += "<td>";
                categoriesTable += "<span style='font-size:11px;padding: 8px;'>" + item.generalCategory + "</span>";
                categoriesTable += "</td>";
                categoriesTable += "<td>";
                categoriesTable += "<span style='font-size:11px;padding: 8px;'>" + item.subCategory + "</span>";
                categoriesTable += "</td>";
                categoriesTable += "<td>";
                categoriesTable += "<span style='font-size:11px;padding: 8px;'>" + item.detailCategory + "</span>";
                categoriesTable += "</td>";
                categoriesTable += "</tr>";
            }
            categoriesTable += "</table>";

            int saudiNationalsno = supplier.managerialno + supplier.technicalno + supplier.operationsno;
            string multCurrency = "";
            string kingdom = "";

            if (supplier.multicurrency == "Y")
            {
                multCurrency = "True";
            }

            if (supplier.multicurrency == "N")
            {
                multCurrency = "False";
            }

            if (supplier.country == "SAUDI ARABIA")
            {
                kingdom = "In Kingdom";
            }

            if (supplier.country != "SAUDI ARABIA")
            {
                kingdom = "Out Kingdom";
            }

            string updatedQualityreviewDate = " " + supplier.qualityreviewDate.ToString();
            updatedQualityreviewDate = updatedQualityreviewDate.Substring(0, 10);

            /* Start Saudi */
            string updated_cr_exp_date = " " + supplier.cr_exp_date.ToString();
            updated_cr_exp_date = updated_cr_exp_date.Substring(0, 10);

            string updated_gosi_date = " " + supplier.gosi_date.ToString();
            updated_gosi_date = updated_gosi_date.Substring(0, 10);

            string updated_saudi_date = " " + supplier.saudi_date.ToString();
            updated_saudi_date = updated_saudi_date.Substring(0, 10);

            string updated_zakath_date = " " + supplier.zakath_date.ToString();
            updated_zakath_date = updated_zakath_date.Substring(0, 10);

            //string expDate = " " + supplier.cr_exp_date;
            //updated_cr_exp_date = updated_cr_exp_date.Substring(0, 10);
            /*  End Saudi */
            string hijriSelected = "";
            if (supplier.hijriSelected == "Y")
            {
                hijriSelected = "<span>" + "<input type='checkbox' checked>Hijri calendar" + "</span>";
                updated_cr_exp_date = convertHijri(updated_cr_exp_date);
                updated_gosi_date = convertHijri(updated_gosi_date);
                updated_saudi_date = convertHijri(updated_saudi_date);
                updated_zakath_date = convertHijri(updated_zakath_date);

                // updated_cr_exp_date = finalDate;

                // Console.WriteLine(d.ToString() + "/" + (1 + (m - 1)) + "/" + y.ToString());
            }

            //"D:/Resources/Arabic"
            string filenamepng = "filename_" + supplier.supplier_id + "_.png";
            //string dataurlpng = message.DataUrl;
            string arabic_name = "<span style='font-family: 'Markazi Text', serif;font-size: 11px;'>" + supplier.supplier_name_arabic + "</span>";

            // < img src = "https://uatsrm.imi-ksa.com/assets/images/logos/IMI_updated_logo2.png" style = "width:200px;" alt = "SRM Logo" >
            // string arabic_image = "<img src='D:/Resources/Arabic/"+ filenamepng + "'  alt = 'image' style='width: 162px; height: 22px; object-fit: cover; object-position: 0% 10%;'>";
            string arabic_image = "filename_" + supplier.supplier_id + "_.png";

            string dedicatedpersQuest = "";

            if (supplier.dedicatedpers == "Yes")
            {
                dedicatedpersQuest = "<tr class='rowheader'>" +
                    "<td colspan = '6' style='width: 50%'>" +
                    "<div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Name </div>" +
                    "</td>" +
                    "<td colspan = '6' style='width: 50%'>" +
                    "<div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Designation </div>" +
                    "</td>" +
                    "</tr>" +
                    "<tr class='rowdata'>" +
                    "<td colspan = '6' style='width: 50%'>" +
                    "<div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.hseName + "</div>" +
                    "</td>" +
                    "<td colspan = '6' style='width: 50%'>" +
                    "<div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.hseDesig + "</div>" +
                    "</td>" +
                    "</tr>";
            }

            string statisticQuest = "";

            if (supplier.statistic == "Yes")
            {
                statisticQuest = "<tr class='rowheader'><td colspan = '4' style='width:33%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Near Miss</div></td><td colspan = '4' style='width:33%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > First Aid Case</div></td><td colspan = '4' style='width:33%' ><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Medical Treatment Case </div></td></tr><tr class='rowdata'><td colspan = '4' style='width:33%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.statisticNear + "</div></td><td colspan = '4' style= 'width:33%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.statisticFirst + " </div></td><td colspan = '4' style='width:33%' ><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.statisticMedical + "</ div ></ td ></ tr ><tr class='rowheader'><td colspan = '4' style='width:33%'><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Lost time injuries </div></td><td colspan = '4' style='width:33%'><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Fatality </div></td><td colspan = '4' style='width:33%'><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Environmental Incident</div></td></tr><tr class='rowdata'><td colspan = '4' style='width:33%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.statisticLost + "</div></td><td colspan = '4' style='width:33%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.statisticFatal + " </div></td><td colspan = '4' style='width:33%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.statisticEnvt + "</div></td></tr>";
            }

            string qualityResp1Quest = "";

            if (supplier.qualityResp1 == "Yes")
            {
                qualityResp1Quest = "<tr class='rowheader'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Name </div></td><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px; color: #566573; margin: 10px 15px 1px 10px' > Designation</div></td></tr><tr class='rowdata'><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.qualityResp2 + " </div></td><td colspan = '6' style='width: 50%'><div style = 'font-size: 11px;border-bottom:1px solid #ccc; margin: 1px 15px 10px 10px' >" + supplier.qualityResp3 + "</div></td></tr>";
            }

            if (supplier.statistic == "No")
            {
                tag_h6 = "-";
            }

            string additionalContact1 = "";
            string additionalContact2 = "";

            if (supplier.first_name1 == "")
            {

            }
            else
            {
                additionalContact1 = "<tr>" + "<th colspan='12' style='width: 33%; background-color: #F2F3F4; text-align: left '><div style='font-size: 16px; color: #566573; margin: 10px 15px 1px 10px'>Additional Contact 1&nbsp;</div></th>" + "</tr>" +
"<tr class='rowheader'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Title&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>First name&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Last name&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Position&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowdata'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.title1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.first_name1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.last_name1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.position1 + "&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowheader'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Telephone No. [Country Code]&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Telephone No. 'Without country'&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Ext.&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Email address&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowdata'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.telphone_country_code1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.telephone_no1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.extension1.ToString() + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.email1 + "&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowheader'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Mob No. [Country Code]&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Mobile No. 'Without country'&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Fax No. [Country Code]&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Fax No. 'Without country'&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowdata'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.mobile_country_code1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.mobile_no1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.fax_country_code1 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.fax_no1 + "&nbsp;</div></td>" +
"</tr>";
            }

            if (supplier.first_name2 == "")
            {

            }
            else
            {
                additionalContact2 = "<tr>" + "<th colspan='12' style='width: 33%; background-color: #F2F3F4; text-align: left '><div style='font-size: 16px; color: #566573; margin: 10px 15px 1px 10px'>Additional Contact 2&nbsp;</div></th>" + "</tr>" +
"<tr class='rowheader'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Title&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>First name&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Last name&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Position&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowdata'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.title2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.first_name2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.last_name2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.position2 + "&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowheader'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Telephone No. [Country Code]&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Telephone No. 'Without country'&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Ext.&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Email address&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowdata'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.telphone_country_code2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.telephone_no2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.extension2.ToString() + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.email2 + "&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowheader'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Mob No. [Country Code]&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Mobile No. 'Without country'&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Fax No. [Country Code]&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px; color: #566573; margin: 10px 15px 1px 10px'>Fax No. 'Without country'&nbsp;</div></td>" +
"</tr>" +
"<tr class='rowdata'>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.mobile_country_code2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.mobile_no2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.fax_country_code2 + "&nbsp;</div></td>" +
"<td colspan='3' style='width:25%'><div style='font-size: 11px;border-bottom:1px solid #ccc;; margin: 1px 15px 10px 10px'>" + supplier.fax_no2 + "&nbsp;</div></td>" +
"</tr>";
            }


            mailText = mailText.Replace("[supplier_name]", supplier.supplier_name)
               .Replace("[supplier_id]", supplier.supplier_id.ToString())
               .Replace("[supplier_name_arabic]", arabic_image)
               .Replace("[email]", supplier.email)
               .Replace("[establishment_year]", supplier.establishment_year.ToString())
               .Replace("[issued_by]", supplier.issued_by)
               .Replace("[web_site]", supplier.web_site)
               .Replace("[supplier_type]", supplier.supplier_type != null ? string.Join(",", supplier.supplier_type) : "")
               .Replace("[supplier_location]", kingdom)
               .Replace("[country]", $"{supplier.country}")
               .Replace("[city]", supplier.city)
               .Replace("[po_box]", supplier.po_box)
               .Replace("[postal_code]", supplier.postal_code)
               .Replace("[address_line1]", supplier.address_line1)
               .Replace("[address_line2]", supplier.address_line2)
               .Replace("[title]", $"{supplier.title}")
               .Replace("[first_name]", $"{supplier.first_name}")
               .Replace("[last_name]", $"{supplier.last_name}")
               .Replace("[telephone_code]", $"{supplier.telphone_country_code}")
               .Replace("[telephone_no]", $"{supplier.telephone_no}")
               .Replace("[ext]", supplier.extension.ToString())
               .Replace("[position]", supplier.position)
               .Replace("[mobile_code]", $"{supplier.mobile_country_code}")
               .Replace("[mobile_no]", $"{supplier.mobile_no}")
               .Replace("[fax_code]", $"{supplier.fax_country_code}")
               .Replace("[fax_no]", $"{supplier.fax_no}")
               .Replace("[cr_no]", supplier.cr_no)
               .Replace("[vat_no]", supplier.vat_no)
               .Replace("[currentAsset1]", supplier.currentAsset1.ToString())
               .Replace("[currentAsset2]", supplier.currentAsset2.ToString())
               .Replace("[multicurrency]", multCurrency)
               .Replace("[otherBankName]", supplier.otherBankName)
               .Replace("[qualityName]", supplier.qualityName)
               .Replace("[qualityDesig]", supplier.qualityDesig)
               .Replace("[cr_exp_date]", updated_cr_exp_date)
               .Replace("[additional_material]", supplier.additional_material)
               .Replace("[reg_date]", supplier.reg_date)
               .Replace("[gosi_date]", updated_gosi_date)
               .Replace("[saudi_date]", updated_saudi_date)
               .Replace("[zakath_date]", updated_zakath_date)
               .Replace("[categorylist]", categoriesTable)
               .Replace("[parentcompany]", supplier.parentcompany)
               .Replace("[sistercompany]", supplier.sistercompany)
               .Replace("[ownercompany]", supplier.ownercompany)
               .Replace("[operatingProfit1]", supplier.operatingProfit1.ToString())
               .Replace("[operatingProfit2]", supplier.operatingProfit2.ToString())
               .Replace("[netIncome1]", supplier.netIncome1.ToString())
               .Replace("[netIncome2]", supplier.netIncome2)
               .Replace("[totalLiable1]", supplier.totalLiable1.ToString())
               .Replace("[totalLiable2]", supplier.totalLiable2.ToString())
               .Replace("[totalEquity1]", supplier.totalEquity1.ToString())
               .Replace("[totalEquity2]", supplier.totalEquity2.ToString())
               .Replace("[noOfYears]", supplier.noOfYears.ToString())
               .Replace("[ownsPlantEquip]", supplier.ownsPlantEquip)
               .Replace("[designnCap]", supplier.designnCap)
               .Replace("[finishProd]", supplier.finishProd)
               .Replace("[internalPolicy]", supplier.internalPolicy)
               .Replace("[registeredOrg]", supplier.registeredOrg)
               .Replace("[suspendedProj1]", supplier.suspendedProj1)
               .Replace("[suspendedProj2]", supplier.suspendedProj2)
               .Replace("[litigation1]", supplier.litigation1)
               .Replace("[litigation2]", supplier.litigation2)
               .Replace("[compliance1]", supplier.compliance1)
               .Replace("[compliance2]", supplier.compliance2)
               .Replace("[shareholder1]", supplier.shareholder1)
               .Replace("[shareholder2]", supplier.shareholder2)
               .Replace("[labour1]", supplier.labour1)
               .Replace("[labour2]", supplier.labour2)
               .Replace("[legalAsset1]", supplier.legalAsset1)
               .Replace("[legalAsset2]", supplier.legalAsset2)
               .Replace("[environment1]", supplier.environment1)
               .Replace("[environment2]", supplier.environment2)
               .Replace("[imiInterested1]", supplier.imiInterested1)
               .Replace("[imiInterested2]", supplier.imiInterested2)
               .Replace("[hse1]", supplier.hse1)
               .Replace("[docuHse]", supplier.docuHse)
               .Replace("[isohealth]", supplier.isohealth)
               .Replace("[envtMgt1]", supplier.envtMgt1)
               .Replace("[dedicatedpers]", supplier.dedicatedpers)
               .Replace("[dedicatedpersQuest]", dedicatedpersQuest)
               .Replace("[statistic]", supplier.statistic)
               .Replace("[statisticQuest]", statisticQuest)
               .Replace("[qualityPolicy1]", supplier.qualityPolicy1)
               .Replace("[qualityPolicy2]", supplier.qualityPolicy2)
               .Replace("[qualityMgt]", supplier.qualityMgt)
               .Replace("[qualityResp1]", supplier.qualityResp1)
               .Replace("[qualityResp2]", supplier.qualityResp2)
               .Replace("[qualityResp3]", supplier.qualityResp3)
               .Replace("[qualityResp1Quest]", qualityResp1Quest)
               .Replace("[qualityreviewDate]", updatedQualityreviewDate)
               .Replace("[typeOfOrganization]", supplier.typeOfOrganization)
               .Replace("[managerialno]", supplier.managerialno.ToString())
               .Replace("[technicalno]", supplier.technicalno.ToString())
               .Replace("[operationsno]", supplier.operationsno.ToString())
               .Replace("[saudiNationalsno]", supplier.saudiNationalsno.ToString())
               .Replace("[TotalEmp]", saudiNationalsno.ToString())
               .Replace("[bankCountryCodes]", supplier.bankCountryCodes)
               .Replace("[bankName]", supplier.bankName)
               .Replace("[swiftcode]", supplier.swiftcode.ToString())
               .Replace("[accountHolderName]", supplier.accountHolderName)
               .Replace("[ibanNo]", supplier.ibanNo)
               .Replace("[bankAddress]", supplier.bankAddress)
               .Replace("[bankAddress2]", supplier.bankAddress2)
               .Replace("[accountCurrency]", supplier.accountCurrency)
               .Replace("[account_number]", supplier.account_number)
               .Replace("[statisticNear]", supplier.statisticNear)
               .Replace("[statisticFirst]", supplier.statisticFirst)
               .Replace("[statisticMedical]", supplier.statisticMedical)
               .Replace("[statisticLost]", supplier.statisticLost)
               .Replace("[statisticFatal]", supplier.statisticFatal)
               .Replace("[hseName]", supplier.hseName)
               .Replace("[hseDesig]", supplier.hseDesig)
               .Replace("[statistic]", supplier.statistic)
               .Replace("[qualityMgtIso]", supplier.qualityMgtIso)
               .Replace("[statisticEnvt]", supplier.statisticEnvt)
               .Replace("[wasel_address]", supplier.wasalAddress)
               .Replace("[other_city]", supplier.other_city)
               .Replace("[hijriSelected]", hijriSelected)
               .Replace("[agreement]", "Yes")
               .Replace("[typeOfOrganization2]", supplier.typeOfOrganization2)
               .Replace("[additionalCtrl]", supplier.additionalCtrl)
               .Replace("[additionalCtrl2]", supplier.additionalCtrl2)
               .Replace("[additionalCtrl3]", supplier.additionalCtrl3)
               .Replace("[additionalCtrl4]", supplier.additionalCtrl4)
               .Replace("[additionalCtrl5]", supplier.additionalCtrl5)
               .Replace("[additionalContact1]", additionalContact1)
               .Replace("[additionalContact2]", additionalContact2)
               .Replace("[additional_html]", additional_html)
               .Replace("[tag_r1]", tag_r1)
               .Replace("[tag_v1]", tag_v1)
               .Replace("[tag_m1]", tag_m1)
               .Replace("[tag_q1]", tag_q1)
               .Replace("[tag_q2]", tag_q2)
               .Replace("[tag_q3]", tag_q3)
               .Replace("[tag_s1]", tag_s1)
               .Replace("[tag_e1]", tag_e1)
               .Replace("[tag_e2]", tag_e2)
               .Replace("[tag_e3]", tag_e3)
               .Replace("[tag_e4]", tag_e4)
               .Replace("[tag_e5]", tag_e5)
               .Replace("[tag_h1]", tag_h1)
               .Replace("[tag_h2]", tag_h2)
               .Replace("[tag_h3]", tag_h3)
               .Replace("[tag_h4]", tag_h4)
               .Replace("[tag_h6]", tag_h6)
               .Replace("[tag_z1]", tag_z1)
               .Replace("[tag_a1]", tag_a1)
               .Replace("[tag_a2]", tag_a2)
               .Replace("[tag_a3]", tag_a3)
               .Replace("[tag_a4]", tag_a4)
               .Replace("[tag_a5]", tag_a5)
               .Replace("[tag_a6]", tag_a6)
               .Replace("[tag_g1]", tag_g1)
               .Replace("[tag_f1]", tag_f1)
               .Replace("[tag_f2]", tag_f2)
               .Replace("[tag_f3]", tag_f3)
               .Replace("[tag_b1]", tag_b1)
               .Replace("[tag_b2]", tag_b2);

            /*mailText = mailText.Replace("[Categories]", categoryString.ToString());*/
            return mailText;
        }
        private string PopulateMessageWithEmgSupplierDetails(string mailText, EmergencySupplierDto emgSupplier)
        {
            string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";
            string searchTag = emgSupplier.supplier_id + "_*";
            var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

            var tag_r1 = "-";
            var tag_v1 = "-";
            var tag_q1 = "-";

            foreach (string currentFile in txtFiles)
            {
                string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                if (fileName.Contains("Reg"))
                {
                    tag_r1 += "<span>" + emgSupplier.emergency_supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</span> ";
                }
                if (fileName.Contains("Vat"))
                {
                    tag_v1 += "<span>" + emgSupplier.emergency_supplier_name + "_VatRegistration_" + fileName + "</span> ";
                }
                if (fileName.Contains("Evi"))
                {
                    tag_q1 += "<span>" + emgSupplier.emergency_supplier_name + "_JustificationEvidenceDocument_" + fileName + "</span> ";
                }
            }
            string updated_cr_exp_date = null;
            if (emgSupplier.cr_exp_date != "Invalid date")
            {
                updated_cr_exp_date = " " + emgSupplier.cr_exp_date.ToString();
                updated_cr_exp_date = updated_cr_exp_date.Substring(0, 10);
            }

            mailText = mailText.Replace("[supplier_name]", emgSupplier.emergency_supplier_name)
            .Replace("[supplierid]", emgSupplier.supplier_id.ToString())
            .Replace("[country]", emgSupplier.country)
            .Replace("[city]", emgSupplier.city)
            .Replace("[other_city]", emgSupplier.other_city)
            .Replace("[first_name]", emgSupplier.first_name)
            .Replace("[last_name]", emgSupplier.last_name)
            .Replace("[email]", emgSupplier.email)
            .Replace("[cr_no]", emgSupplier.cr_no)
            .Replace("[establishment_year]", emgSupplier.establishment_year.ToString())
            .Replace("[supplier_type]", emgSupplier.supplier_type != null ? string.Join(",", emgSupplier.supplier_type) : "")
            .Replace("[po_box]", emgSupplier.po_box)
            .Replace("[postal_code]", emgSupplier.postal_code)
            .Replace("[address_line1]", emgSupplier.address_line1)
            .Replace("[address_line2]", emgSupplier.address_line2)
            .Replace("[telephone_code]", $"{emgSupplier.telphone_country_code}")
            .Replace("[telephone_no]", $"{emgSupplier.telephone_no}")
            .Replace("[ext]", $"{emgSupplier.extension}")
            .Replace("[title]", $"{emgSupplier.title}")
            .Replace("[position]", emgSupplier.position)
            .Replace("[mobile_code]", $"{emgSupplier.mobile_country_code}")
            .Replace("[mobile_no]", $"{emgSupplier.mobile_no}")
            .Replace("[fax_code]", $"{emgSupplier.fax_country_code}")
            .Replace("[fax_no]", $"{emgSupplier.fax_no}")
            .Replace("[vat_no]", $"{emgSupplier.vat_no}")
            .Replace("[justification]", $"{emgSupplier.justification}")
            .Replace("[srm_remark]", emgSupplier.srm_remark != null ? emgSupplier.srm_remark : "-")
            .Replace("[tag_r1]", tag_r1)
            .Replace("[tag_v1]", tag_v1)
            .Replace("[tag_q1]", tag_q1)
            .Replace("[cr_exp_date]", updated_cr_exp_date != null ? updated_cr_exp_date : "-");

            return mailText;
        }
        public string convertHijri(string updatedDate)
        {
            var split = updatedDate.Split('/');

            int month = Int16.Parse(split[0]);
            int date = Int16.Parse(split[1]);
            int year = Int16.Parse(split[2]);

            Console.WriteLine(month);
            Console.WriteLine(date);
            Console.WriteLine(year);

            //convert Solar year from 622 to 2500
            double jd;
            double j, L, n;
            int d, m, y;
            int theDay;
            //Solar day
            d = date;
            //get the number of Solar month
            m = month;
            // Solar year
            y = year;

            if ((y > 1582) || ((y == 1582) && (m > 10)) || ((y == 1582) && (m == 10) && (d > 14)))
            {
                jd = getInt((1461 * (y + 4800 + getInt((m - 14) / 12))) / 4) + getInt((367 * (m - 2 - 12 * (getInt((m - 14) / 12)))) / 12) - getInt((3 * (getInt((y + 4900 + getInt((m - 14) / 12)) / 100))) / 4) + d - 32075;
            }
            else
            {
                jd = 367 * y - getInt((7 * (y + 5001 + getInt((m - 9) / 7))) / 4) + getInt((275 * m) / 9) + d + 1729777;
            }

            //day of the week
            theDay = (int)(jd % 7);

            //lblDay.Text = WeekDays[theDay];
            L = jd - 1948440 + 10632;
            n = getInt((L - 1) / 10631);
            L = L - 10631 * n + 354;
            j = (getInt((10985 - L) / 5316)) * (getInt((50 * L) / 17719)) + (getInt(L / 5670)) * (getInt((43 * L) / 15238));
            L = L - (getInt((30 - j) / 15)) * (getInt((17719 * j) / 50)) - (getInt(j / 16)) * (getInt((15238 * j) / 43)) + 29;
            m = (int)(getInt((24 * L) / 709));
            d = (int)(L - getInt((709 * m) / 24));
            y = (int)(30 * n + j - 30);

            // Console.WriteLine("");
            // Console.WriteLine(d.ToString());
            // Console.WriteLine(1 + (m - 1));
            // Console.WriteLine(y.ToString());

            string finalDate = d.ToString() + "/" + (1 + (m - 1)) + "/" + y.ToString();

            return finalDate;
        }

        private double getInt(double fNumber)
        {
            double intPart;
            if (fNumber < -0.0000001)
            {
                intPart = Math.Ceiling(fNumber - 0.0000001);
            }
            else
            {
                intPart = Math.Floor(fNumber + 0.0000001);
            }
            return intPart;
        }

        public byte[] PopulateSupplierRegistrationDetails(MessageDto message)
        {
            SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

            var template = "";

            if (supplier.country == "SAUDI ARABIA")
            {
                template = "\\Template\\SupplierRegistrationDetails.html";
            }

            if (supplier.country != "SAUDI ARABIA")
            {
                template = "\\Template\\SupplierRegistrationDetails-2.html";
            }

            string FilePath = Directory.GetCurrentDirectory() + template;
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();

            MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                .Replace("[supplierid]", supplier.supplier_id.ToString())
                .Replace("[countryval]", supplier.country)
                .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                .Replace("[cr]", supplier.cr_no);

            MailText = PopulateMessageWithSupplierDetails(MailText, supplier);

            byte[] fileBytes = CreatePdfFile(MailText);

            var pdfFileName = $"SupplierRegistrationCopy_{message.SupplierId}_.pdf";

            bool savedToDisk = SaveSupplierRegistrationFile(pdfFileName, fileBytes);

            return fileBytes;
        }

        public async Task<bool> PopulateEmgSupplierRegistrationDetails(string supplierId)
        {
            EmergencySupplierDto emgSupplier = GetEmgSupplierData(supplierId).Result.FirstOrDefault();

            var template = "\\Template\\EmergencySupplierRegistrationDetails.html";

            string FilePath = Directory.GetCurrentDirectory() + template;
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();

            MailText = PopulateMessageWithEmgSupplierDetails(MailText, emgSupplier);

            byte[] fileBytes = CreatePdfFile(MailText);

            var pdfFileName = $"EmergencySupplierRegistrationCopy_{emgSupplier.supplier_id}_.pdf";

            bool savedToDisk = SaveSupplierRegistrationFileEmg(pdfFileName, fileBytes);

            return savedToDisk;
        }

        private byte[] CreatePdfFile(string reportBoddyContent)
        {
            byte[] pdfData = null;

            using (MemoryStream pdfDest = new MemoryStream())
            {
                ConverterProperties converterProperties = new ConverterProperties();
                HtmlConverter.ConvertToPdf(reportBoddyContent, pdfDest, converterProperties);
                pdfData = pdfDest.ToArray();
            }

            return pdfData;
        }

        private bool SaveSupplierRegistrationFile(string fileName, byte[] file)
        {
            var filePath = $"D:\\Resources\\SupplierRegistration\\{ fileName }";

            BinaryWriter writer = null;
            try
            {
                // Create a new stream to write to the file
                writer = new BinaryWriter(File.OpenWrite(filePath));
                using (writer)
                {
                    // Writer raw data
                    writer.Write(file);
                    writer.Flush();
                    writer.Close();
                }
            }
            catch
            {
                //...
                return false;
            }

            return true;
        }

        private bool SaveSupplierRegistrationFileEmg(string fileName, byte[] file)
        {
            var filePath = $"D:\\Resources\\SupplierRegistrationEmg\\{ fileName }";

            BinaryWriter writer = null;
            try
            {
                // Create a new stream to write to the file
                writer = new BinaryWriter(File.OpenWrite(filePath));
                using (writer)
                {
                    // Writer raw data
                    writer.Write(file);
                    writer.Flush();
                    writer.Close();
                }
            }
            catch
            {
                //...
                return false;
            }

            return true;
        }


        private MimeMessage CreateCcEmailMessage(MessageCcDto message, string roleName)
        {
            try
            {
                var template = "\\Template\\MoreInfo.html";
                if (message.Category == "moreinfo")
                {
                    template = "\\Template\\MoreInfo.html";
                }
                else if (message.Category == "vp")
                {
                    template = "\\Template\\VPapproval.html";
                }
                else if (message.Category == "emgvp")
                {
                    template = "\\Template\\VPapprovalEmgSupplier.html";
                }

                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                if (message.Category == "moreinfo")
                {
                    var team = "SRM team";

                    if (roleName == "hseq")
                    {
                        team = "Quality Assurance team";
                    }

                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/R_" + roleName)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[team]", team)
                        .Replace("moreinfo", message.Content);
                }
                else if (message.Category == "vp")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th>";
                    /*if (supplier.criticality != "" && Convert.ToInt16(supplier.criticality) > 4)
                    {
                        categoriesTable += "<th>HSEQ Action</th>";
                    }*/

                    categoriesTable += "</tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }
                        /*if (supplier.criticality != "" && Convert.ToInt16(supplier.criticality) > 4)
                        {
                            if (item.isHSEQChecked == "Approved")
                            {
                                categoriesTable += "<td style=\"color:green\">";
                                categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                                categoriesTable += "</td>";
                            }

                            if (item.isHSEQChecked == "Rejected")
                            {
                                categoriesTable += "<td style=\"color:red\">";
                                categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                                categoriesTable += "</td>";
                            }
                        }*/
                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved";
                }
                else if (message.Category == "emgvp")
                {
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    var linkApprove = _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId + "/emg";

                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[approvelink]", linkApprove);
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved as Emergency Supplier";
                }

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };

                if (message.Attachments != null && message.Attachments.Any())
                {
                    byte[] fileBytes;
                    foreach (var attachment in message.Attachments)
                    {
                        using (var ms = new MemoryStream())
                        {
                            attachment.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                    }
                }

                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public MimeMessage CreatePerformanceReviewEmailMessage(MessagePerformanceReviewDto message)
        {
            try
            {
                var template = "\\Template\\PerformanceReview.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                var linkReview = _emailConfig.supplierPerformanceUrl;
                MailText = MailText.Replace("[linkReview]", linkReview);
                MailText = MailText.Replace("[reviewSuppliers]", message.suppliers);
                MailText = MailText.Replace("[reviewPeriod]", message.period);
                MailText = MailText.Replace("[evaluationName]", message.evaluationName);
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();
                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public MimeMessage CreateReviewApprovalEmailMessage(MessageReviewApprovalDTO message)
        {
            try
            {

                var template = "\\Template\\ReviewApproval.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                var linkReview = _emailConfig.supplierPerformanceUrl;
                MailText = MailText.Replace("[linkReview]", linkReview);
                MailText = MailText.Replace("[reviewSupplier]", message.supplierName);
                MailText = MailText.Replace("[reviewPeriod]", message.period);
                MailText = MailText.Replace("[evaluationName]", message.evaluationName);
                MailText = MailText.Replace("[approver]", message.approver);
                MailText = MailText.Replace("[reviewer]", message.reviewer);
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();
                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        public MimeMessage CreateReviewReinitiationEmailMessage(MessageReviewReinitiationDTO message)
        {
            try
            {
                var template = "\\Template\\ReinitiationReviewer.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                var linkReview = _emailConfig.supplierPerformanceUrl;
                MailText = MailText.Replace("[reviewer]", message.reviewer);
                MailText = MailText.Replace("[evaluationName]", message.evaluationName);
                MailText = MailText.Replace("[linkReview]", linkReview);
                MailText = MailText.Replace("[reviewSupplier]", message.supplierName);
                MailText = MailText.Replace("[reviewPeriod]", message.period);
                MailText = MailText.Replace("[comment]", message.comment);
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();
                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public MimeMessage CreateReviewRejectionEmailMessage(MessageReviewRejectionDTO message)
        {
            try
            {
                var template = "\\Template\\ReviewRejection.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                var linkReview = _emailConfig.supplierPerformanceUrl;
                MailText = MailText.Replace("[reviewer]", message.reviewer);
                MailText = MailText.Replace("[evaluationName]", message.evaluationName);
                MailText = MailText.Replace("[reviewSupplier]", message.supplierName);
                MailText = MailText.Replace("[reviewPeriod]", message.period);
                MailText = MailText.Replace("[comment]", message.comment);
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();
                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public MimeMessage CreateResponseReceivedEmailMessage(MessageResponseReceivedDTO message)
        {
            try
            {

                var template = "\\Template\\ResponseReceived.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                var linkReview = _emailConfig.supplierPerformanceUrl;
                MailText = MailText.Replace("[linkReview]", linkReview);
                MailText = MailText.Replace("[reviewSupplier]", message.supplierName);
                MailText = MailText.Replace("[reviewPeriod]", message.period);
                MailText = MailText.Replace("[evaluationName]", message.evaluationName);
                MailText = MailText.Replace("[reviewer]", message.reviewer);
                MailText = MailText.Replace("[sessionCreator]", message.sessionCreator);
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();
                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public MimeMessage CreateSupplierReviewCompleteEmailMessage(MessageSupplierReviewCompletedDto message)
        {
            try
            {

                var template = "\\Template\\ReviewComplete.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();
                var linkReview = _emailConfig.supplierPortalSupplierPerformanceUrl;
                MailText = MailText.Replace("[linkReview]", linkReview);
                MailText = MailText.Replace("[reviewScore]", message.reviewScore);
                MailText = MailText.Replace("[reviewPeriod]", message.period);
                MailText = MailText.Replace("[evaluationName]", message.evaluationName);
                MailText = MailText.Replace("[reviewOutcome]", message.reviewOutcome);
                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();
                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private async Task<MimeMessage> CreateEmailMessageAsync(MessageDto message)
        {
            try
            {
                var template = "\\Template\\SaveAsDraft.html";
                if (message.Category == "draft")
                {
                    template = "\\Template\\SaveAsDraft.html";
                }
                else if (message.Category == "moreinfo")
                {
                    template = "\\Template\\MoreInfo.html";
                }
                else if (message.Category == "reject")
                {
                    template = "\\Template\\Rejected.html";
                }
                else if (message.Category == "srm")
                {
                    template = "\\Template\\SRMapproval.html";
                }
                else if (message.Category == "vp")
                {
                    template = "\\Template\\VPapproval.html";
                }
                else if (message.Category == "emgvp")
                {
                    template = "\\Template\\VPapprovalEmgSupplier.html";
                }
                else if (message.Category == "gmattachement")
                {
                    template = "\\Template\\GMattachment.html";
                }
                else if (message.Category == "vpattachement")
                {
                    template = "\\Template\\VPWfattachment.html";
                }
                else if (message.Category == "register")
                {
                    template = "\\Template\\RegisterSupplier.html";
                }
                else if (message.Category == "moreinfoupdate")
                {
                    template = "\\Template\\UpdateRegisterSupplier.html";
                }
                else if (message.Category == "treasurer")
                {
                    template = "\\Template\\Completed.html";
                }
                else if (message.Category == "workflow")
                {
                    template = "\\Template\\Workflow.html";
                }
                else if (message.Category == "inv")
                {
                    template = "\\Template\\InviteSupplier.html";
                }
                else if (message.Category == "IfsR" || message.Category == "IfsE")
                {
                    template = "\\Template\\IfsIntegrationFailed.html";
                }
                else if (message.Category == "reinv")
                {
                    template = "\\Template\\Re-InviteSupplier.html";
                }
                else if (message.Category == "needmoreupdated" && message.Content != "IMI-Treasury Bank Reviewer")
                {
                    template = "\\Template\\NeedMoreRoleSubmittion.html";
                }
                else if (message.Category == "needmoreupdated" && message.Content == "IMI-Treasury Bank Reviewer")
                {
                    template = "\\Template\\NeedMoreReviewerSubmittion.html";
                }
                else if (message.Category == "hseqreject")
                {
                    template = "\\Template\\HSEQ-Rejected.html";
                }
                else if (message.Category == "return")
                {
                    template = "\\Template\\ReturnToSRM.html";
                }
                else if (message.Category == "srmrejectemg")
                {
                    template = "\\Template\\SRMrejectSupplier.html";
                }
                else if (message.Category == "vprejectgm")
                {
                    template = "\\Template\\VPrejectGM.html";
                }
                else if (message.Category == "treasurerteam")
                {
                    template = "\\Template\\BankDetailsApproved.html";
                }

                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                if (message.Category == "draft")
                {
                    SupplierDto supplier = (await GetTempSupplierData(message.SupplierId))?.FirstOrDefault();
                    SettingsMasterDto configuration = await GetSettingsData();
                    var emailconfig = await GetEmalConfig();
                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/tmp")
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", message.SupplierId)
                        .Replace("[countryval]", supplier.country)
                        .Replace("[emaildays]", configuration.DraftLimit)
                        .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                        .Replace("[cr]", supplier.cr_no);
                }
                else if (message.Category == "register")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[countryval]", supplier.country)
                        .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                        .Replace("[cr]", supplier.cr_no);
                }
                else if (message.Category == "moreinfoupdate")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[countryval]", supplier.country)
                        .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                        .Replace("[cr]", supplier.cr_no);
                    message.Subject = "IMI-Updated Registration Submitted For Approval";
                }
                else if (message.Category == "moreinfo")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[link]", _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("moreinfo", message.Content);
                }
                else if (message.Category == "reject")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[moreinfo]", message.Content)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", supplier.supplier_code);
                }
                else if (message.Category == "gmattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "GM" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "GM" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = await GetSupplierCategories(message.SupplierId);

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    string recommendation = "";

                    if (message.Recommendation == "Recommended")
                    {
                        recommendation = "SRM Analyst Recommended this Supplier, and the Outcome is " + message.Outcome;
                    }

                    if (message.Recommendation == "Not Recommended")
                    {
                        recommendation = "SRM Analyst did <span style='color:red;'>NOT</span> Recommend this supplier, and the Outcome is " + message.Outcome;
                    }

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        // counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                          .Replace("[supplierid]", supplier.supplier_code)
                          .Replace("[suppliername]", supplier.supplier_name)
                          .Replace("[recommendation]", recommendation)
                          .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable);

                    message.Subject = "IMI-Awaiting GM Approval";
                }
                else if (message.Category == "vpattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "VP" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "VP" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = await GetSupplierCategories(message.SupplierId);

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";

                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing
                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }


                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable);
                    message.Subject = "IMI-Awaiting VP Approval";
                }
                else if (message.Category == "hseqreject")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                       .Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", message.SupplierId)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Supplier Registration Rejected by HSEQ";
                }
                else if (message.Category == "srm")
                {
                    PopulateSupplierRegistrationDetails(message);

                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = await GetSupplierCategories(message.SupplierId);

                    string sourceDirectory = @"D:\Resources\Images";

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    //SupplierRegistrationDetails_166_637617614477032138.pdf
                    //RegistrationLicenseCertificate_258_r1.pdf

                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            //RegistrationLicenseCertificate_258_r1.pdf
                            // close table row
                            dynTable += "</tr>";
                            //counter++;

                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    /* starts supplier registration copy */
                    /* dynTable += "<td>";

                   foreach (string currentFileReg in txtFilesReg)
                   {
                       string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                       dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_Supplier_Registration_Copy_" + fileNameReg + "</a></span> ";
                   }

                   dynTable += "</td>";*/

                    // close the table tag
                    dynTable += "</table>";

                    var urls = "";
                    var r1 = "";
                    var v1 = "";
                    var b1 = "";
                    var b2 = "";
                    var m1 = "";
                    var q1 = "";
                    var q2 = "";
                    var q3 = "";
                    var s1 = "";
                    var e1 = "";
                    var e2 = "";
                    var e3 = "";
                    var e4 = "";
                    var e5 = "";
                    var h1 = "";
                    var h2 = "";
                    var h3 = "";
                    var h4 = "";
                    var h6 = "";
                    var z1 = "";
                    var a1 = "";
                    var a2 = "";
                    var a3 = "";
                    var a4 = "";
                    var a5 = "";
                    var a6 = "";
                    var g1 = "";
                    var f1 = "";
                    var f2 = "";
                    var f3 = "";

                    var tag_r1 = "-";
                    var tag_v1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";
                    var tag_q2 = "-";
                    var tag_q3 = "-";
                    var tag_s1 = "-";
                    var tag_e1 = "-";
                    var tag_e2 = "-";
                    var tag_e3 = "-";
                    var tag_e4 = "-";
                    var tag_e5 = "-";
                    var tag_h1 = "-";
                    var tag_h2 = "-";
                    var tag_h3 = "-";
                    var tag_h4 = "-";
                    var tag_h6 = "-";
                    var tag_z1 = "-";
                    var tag_a1 = "-";
                    var tag_a2 = "-";
                    var tag_a3 = "-";
                    var tag_a4 = "-";
                    var tag_a5 = "-";
                    var tag_a6 = "-";
                    var tag_g1 = "-";
                    var tag_f1 = "-";
                    var tag_f2 = "-";
                    var tag_f3 = "-";
                    var tag_b1 = "-";
                    var tag_b2 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        /*string[] arr = { "_r1.pdf", "_m1.pdf", "_b1.pdf" };*/
                        /*var r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + fileName;*/

                        /*< a href =[link] >< span style = "font-weight: 400;" > click here </ span ></ a > "*/

                        if (fileName.Contains("r1"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }
                        if (fileName.Contains("b2"))
                        {
                            b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b2 = "Available";
                        }
                        if (fileName.Contains("b1"))
                        {
                            b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b1 = "Available";
                        }
                        if (fileName.Contains("m1"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }
                        if (fileName.Contains("v1"))
                        {
                            v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_v1 = "Available";
                        }
                        if (fileName.Contains("q1"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                        if (fileName.Contains("q2"))
                        {
                            q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q2 = "Available";
                        }
                        if (fileName.Contains("q3"))
                        {
                            q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q3 = "Available";
                        }
                        if (fileName.Contains("s1"))
                        {
                            s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_s1 = "Available";
                        }
                        if (fileName.Contains("e1"))
                        {
                            e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e1 = "Available";
                        }
                        if (fileName.Contains("e2"))
                        {
                            e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e2 = "Available";
                        }
                        if (fileName.Contains("e3"))
                        {
                            e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e3 = "Available";
                        }
                        if (fileName.Contains("e4"))
                        {
                            e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e4 = "Available";
                        }
                        if (fileName.Contains("e5"))
                        {
                            e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e5 = "Available";
                        }
                        if (fileName.Contains("h1"))
                        {
                            h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h1 = "Available";
                        }
                        if (fileName.Contains("h2"))
                        {
                            h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h2 = "Available";
                        }
                        if (fileName.Contains("h3"))
                        {
                            h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h3 = "Available";
                        }
                        if (fileName.Contains("h4"))
                        {
                            h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h4 = "Available";
                        }
                        if (fileName.Contains("h6"))
                        {
                            h6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h6 = "Available";
                        }
                        if (fileName.Contains("z1"))
                        {
                            z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_z1 = "Available";
                        }
                        if (fileName.Contains("a1"))
                        {
                            a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a1 = "Available";
                        }
                        if (fileName.Contains("a2"))
                        {
                            a2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a2 = "Available";
                        }
                        if (fileName.Contains("a3"))
                        {
                            a3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a3 = "Available";
                        }
                        if (fileName.Contains("a4"))
                        {
                            a4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a4 = "Available";
                        }
                        if (fileName.Contains("a5"))
                        {
                            a5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a5 = "Available";
                        }
                        if (fileName.Contains("a6"))
                        {
                            a6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a6 = "Available";
                        }
                        if (fileName.Contains("g1"))
                        {
                            g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_g1 = "Available";
                        }
                        if (fileName.Contains("f1"))
                        {
                            f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f1 = "Available";
                        }
                        if (fileName.Contains("f2"))
                        {
                            f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f2 = "Available";
                        }
                        if (fileName.Contains("f3"))
                        {
                            f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f3 = "Available";
                        }

                        /*fileName = fileName.Replace(oldName, newName);*/

                        /*Directory.Move(currentFile, Path.Combine(archiveDirectory, fileName));*/
                        /*Console.WriteLine("File name: ", fileName);*/
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    /*var r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_r1.pdf";*/
                    /*var v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_v1.pdf";*/
                    /*var g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_g1.pdf";
                    var s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_s1.pdf";
                    var z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_z1.pdf";
                    var a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_a1.pdf";
                    var m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_m1.pdf";
                    var f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_f1.pdf";
                    var f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_f2.pdf";
                    var f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_f3.pdf";
                    var e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e1.pdf";
                    var e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e2.pdf";
                    var e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e3.pdf";
                    var e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e4.pdf";
                    var e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e5.pdf";
                    var h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h1.pdf";
                    var h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h2.pdf";
                    var h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h3.pdf";
                    var h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h4.pdf";
                    var q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_q1.pdf";
                    var q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_q2.pdf";
                    var q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_q3.pdf";*/
                    /*var b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_b1.pdf";*/

                    string categoriesTable = "";

                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[v1]", v1)
                       .Replace("[g1]", g1)
                       .Replace("[s1]", s1)
                       .Replace("[z1]", z1)
                       .Replace("[a1]", a1)
                       .Replace("[a2]", a2)
                       .Replace("[a3]", a3)
                       .Replace("[a4]", a4)
                       .Replace("[a5]", a5)
                       .Replace("[a6]", a6)
                       .Replace("[m1]", m1)
                       .Replace("[f1]", f1)
                       .Replace("[f2]", f2)
                       .Replace("[f3]", f3)
                       .Replace("[e1]", e1)
                       .Replace("[e2]", e2)
                       .Replace("[e3]", e3)
                       .Replace("[e4]", e4)
                       .Replace("[e5]", e5)
                       .Replace("[h1]", h1)
                       .Replace("[h2]", h2)
                       .Replace("[h3]", h3)
                       .Replace("[h4]", h4)
                       .Replace("[h6]", h6)
                       .Replace("[q1]", q1)
                       .Replace("[q2]", q2)
                       .Replace("[q3]", q3)
                       .Replace("[b1]", b1)
                       .Replace("[b2]", b2)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_v1]", tag_v1)
                       .Replace("[tag_b1]", tag_b1)
                       .Replace("[tag_b2]", tag_b2)
                       .Replace("[tag_q1]", tag_q1)
                       .Replace("[tag_q2]", tag_q2)
                       .Replace("[tag_q3]", tag_q3)
                       .Replace("[tag_e1]", tag_e1)
                       .Replace("[tag_e2]", tag_e2)
                       .Replace("[tag_e3]", tag_e3)
                       .Replace("[tag_e4]", tag_e4)
                       .Replace("[tag_e5]", tag_e5)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_g1]", tag_g1)
                       .Replace("[tag_s1]", tag_s1)
                       .Replace("[tag_h1]", tag_h1)
                       .Replace("[tag_h2]", tag_h2)
                       .Replace("[tag_h3]", tag_h3)
                       .Replace("[tag_h4]", tag_h4)
                       .Replace("[tag_h6]", tag_h6)
                       .Replace("[tag_z1]", tag_z1)
                       .Replace("[tag_a1]", tag_a1)
                       .Replace("[tag_a2]", tag_a2)
                       .Replace("[tag_a3]", tag_a3)
                       .Replace("[tag_a4]", tag_a4)
                       .Replace("[tag_a5]", tag_a5)
                       .Replace("[tag_a6]", tag_a6)
                       .Replace("[tag_f1]", tag_f1)
                       .Replace("[tag_f2]", tag_f2)
                       .Replace("[tag_f3]", tag_f3)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    //message.Subject = "Pending approval at " + message.Content;
                    message.Subject = "IMI-Review Supplier Registration Request " + supplier.supplier_name;
                }
                else if (message.Category == "vp")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    string searchTag = message.SupplierId + "_*";
                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + "https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";
                            dynTable += "</tr>";
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    var urls = "";
                    var r1 = "";
                    var v1 = "";
                    var b1 = "";
                    var b2 = "";
                    var m1 = "";
                    var q1 = "";
                    var q2 = "";
                    var q3 = "";
                    var s1 = "";
                    var e1 = "";
                    var e2 = "";
                    var e3 = "";
                    var e4 = "";
                    var e5 = "";
                    var h1 = "";
                    var h2 = "";
                    var h3 = "";
                    var h4 = "";
                    var h6 = "";
                    var z1 = "";
                    var a1 = "";
                    var a2 = "";
                    var a3 = "";
                    var a4 = "";
                    var a5 = "";
                    var a6 = "";
                    var g1 = "";
                    var f1 = "";
                    var f2 = "";
                    var f3 = "";

                    var tag_r1 = "-";
                    var tag_v1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";
                    var tag_q2 = "-";
                    var tag_q3 = "-";
                    var tag_s1 = "-";
                    var tag_e1 = "-";
                    var tag_e2 = "-";
                    var tag_e3 = "-";
                    var tag_e4 = "-";
                    var tag_e5 = "-";
                    var tag_h1 = "-";
                    var tag_h2 = "-";
                    var tag_h3 = "-";
                    var tag_h4 = "-";
                    var tag_h6 = "-";
                    var tag_a1 = "-";
                    var tag_a2 = "-";
                    var tag_a3 = "-";
                    var tag_a4 = "-";
                    var tag_a5 = "-";
                    var tag_a6 = "-";
                    var tag_z1 = "-";
                    var tag_g1 = "-";
                    var tag_f1 = "-";
                    var tag_f2 = "-";
                    var tag_f3 = "-";
                    var tag_b1 = "-";
                    var tag_b2 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("r1"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }
                        if (fileName.Contains("b2"))
                        {
                            b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b2 = "Available";
                        }
                        if (fileName.Contains("b1"))
                        {
                            b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b1 = "Available";
                        }
                        if (fileName.Contains("m1"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }
                        if (fileName.Contains("v1"))
                        {
                            v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_v1 = "Available";
                        }
                        if (fileName.Contains("q1"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                        if (fileName.Contains("q2"))
                        {
                            q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q2 = "Available";
                        }
                        if (fileName.Contains("q3"))
                        {
                            q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q3 = "Available";
                        }
                        if (fileName.Contains("s1"))
                        {
                            s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_s1 = "Available";
                        }
                        if (fileName.Contains("e1"))
                        {
                            e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e1 = "Available";
                        }
                        if (fileName.Contains("e2"))
                        {
                            e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e2 = "Available";
                        }
                        if (fileName.Contains("e3"))
                        {
                            e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e3 = "Available";
                        }
                        if (fileName.Contains("e4"))
                        {
                            e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e4 = "Available";
                        }
                        if (fileName.Contains("e5"))
                        {
                            e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e5 = "Available";
                        }
                        if (fileName.Contains("h1"))
                        {
                            h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h1 = "Available";
                        }
                        if (fileName.Contains("h2"))
                        {
                            h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h2 = "Available";
                        }
                        if (fileName.Contains("h3"))
                        {
                            h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h3 = "Available";
                        }
                        if (fileName.Contains("h4"))
                        {
                            h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h4 = "Available";
                        }
                        if (fileName.Contains("h6"))
                        {
                            h6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h6 = "Available";
                        }
                        if (fileName.Contains("z1"))
                        {
                            z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_z1 = "Available";
                        }
                        if (fileName.Contains("a1"))
                        {
                            a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a1 = "Available";
                        }
                        if (fileName.Contains("a2"))
                        {
                            a2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a2 = "Available";
                        }
                        if (fileName.Contains("a3"))
                        {
                            a3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a3 = "Available";
                        }
                        if (fileName.Contains("a4"))
                        {
                            a4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a4 = "Available";
                        }
                        if (fileName.Contains("a5"))
                        {
                            a5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a5 = "Available";
                        }
                        if (fileName.Contains("a6"))
                        {
                            a6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a6 = "Available";
                        }
                        if (fileName.Contains("g1"))
                        {
                            g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_g1 = "Available";
                        }
                        if (fileName.Contains("f1"))
                        {
                            f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f1 = "Available";
                        }
                        if (fileName.Contains("f2"))
                        {
                            f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f2 = "Available";
                        }
                        if (fileName.Contains("f3"))
                        {
                            f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f3 = "Available";
                        }
                    }

                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    IList<CategoriesForHSEQDto> category = (await GetSupplierCategories(message.SupplierId));

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th>";

                    categoriesTable += "</tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[v1]", v1)
                       .Replace("[g1]", g1)
                       .Replace("[s1]", s1)
                       .Replace("[z1]", z1)
                       .Replace("[a1]", a1)
                       .Replace("[a2]", a2)
                       .Replace("[a3]", a3)
                       .Replace("[a4]", a4)
                       .Replace("[a5]", a5)
                       .Replace("[a6]", a6)
                       .Replace("[m1]", m1)
                       .Replace("[f1]", f1)
                       .Replace("[f2]", f2)
                       .Replace("[f3]", f3)
                       .Replace("[e1]", e1)
                       .Replace("[e2]", e2)
                       .Replace("[e3]", e3)
                       .Replace("[e4]", e4)
                       .Replace("[e5]", e5)
                       .Replace("[h1]", h1)
                       .Replace("[h2]", h2)
                       .Replace("[h3]", h3)
                       .Replace("[h4]", h4)
                       .Replace("[h6]", h6)
                       .Replace("[q1]", q1)
                       .Replace("[q2]", q2)
                       .Replace("[q3]", q3)
                       .Replace("[b1]", b1)
                       .Replace("[b2]", b2)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_v1]", tag_v1)
                       .Replace("[tag_b1]", tag_b1)
                       .Replace("[tag_b2]", tag_b2)
                       .Replace("[tag_q1]", tag_q1)
                       .Replace("[tag_q2]", tag_q2)
                       .Replace("[tag_q3]", tag_q3)
                       .Replace("[tag_e1]", tag_e1)
                       .Replace("[tag_e2]", tag_e2)
                       .Replace("[tag_e3]", tag_e3)
                       .Replace("[tag_e4]", tag_e4)
                       .Replace("[tag_e5]", tag_e5)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_g1]", tag_g1)
                       .Replace("[tag_s1]", tag_s1)
                       .Replace("[tag_h1]", tag_h1)
                       .Replace("[tag_h2]", tag_h2)
                       .Replace("[tag_h3]", tag_h3)
                       .Replace("[tag_h4]", tag_h4)
                       .Replace("[tag_h6]", tag_h6)
                       .Replace("[tag_z1]", tag_z1)
                       .Replace("[tag_a1]", tag_a1)
                       .Replace("[tag_a2]", tag_a2)
                       .Replace("[tag_a3]", tag_a3)
                       .Replace("[tag_a4]", tag_a4)
                       .Replace("[tag_a5]", tag_a5)
                       .Replace("[tag_a6]", tag_a6)
                       .Replace("[tag_f1]", tag_f1)
                       .Replace("[tag_f2]", tag_f2)
                       .Replace("[tag_f3]", tag_f3)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    //message.Subject = "Supplier Registration Request Approved by VP-PSCM_" + supplier.supplier_name;
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved";
                }
                else if (message.Category == "emgvp")
                {
                    EmergencySupplierDto supplier = (await GetEmgSupplierData(message.SupplierId))?.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var urls = "";
                    var r1 = "";
                    var m1 = "";

                    var tag_r1 = "-";
                    var tag_m1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("Reg"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }
                        if (fileName.Contains("Evi"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }
                    }

                    var linkApprove = _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId + "/emg";

                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[approvelink]", linkApprove);
                    //message.Subject = "Supplier Registration Request Approved by VP-PSCM_" + supplier.emergency_supplier_name;
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved as Emergency Supplier";
                }
                else if (message.Category == "srmrejectemg")
                {
                    EmergencySupplierDto supplier = (await GetEmgSupplierData(message.SupplierId))?.FirstOrDefault();


                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[remark]", message.Content);
                }
                else if (message.Category == "vprejectgm")
                {
                    SupplierDto supplier = (await GetSupplierDataForMSFlow(message.SupplierId))?.FirstOrDefault();

                    var classification = "";
                    if (Int16.Parse(supplier.criticality) >= 7) { classification = "High Critical"; }
                    if (Int16.Parse(supplier.criticality) == 6 || Int16.Parse(supplier.criticality) == 5) { classification = "Critical"; }
                    if (Int16.Parse(supplier.criticality) < 5) { classification = "Non Critical"; }

                    var history_VP = (await GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval"))?.FirstOrDefault();

                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                                       .Replace("[supplierclassification]", classification)
                                       .Replace("[vpremark]", history_VP.status_comment)
                                       .Replace("[approvelink]", linkApprove);
                }
                else if (message.Category == "workflow")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);

                    message.Subject = message.Content;
                }
                else if (message.Category == "inv")
                {
                    // SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    InviteSupplierDto inviteSupplier = (await GetInviteSupplierData(message.SupplierId))?.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\InviteDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var r1 = "";
                    var tag_r1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        r1 = _emailConfig.wfendpoint + "/server/api/file/downloadInvite?fileUrl=" + fileName;
                        tag_r1 = "Available";
                    }

                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/inv")
                               .Replace("[suppliername]", inviteSupplier.invite_supplier_name)
                               .Replace("[r1]", r1)
                               .Replace("[Remarks]", message.Content != null ? message.Content : "No remarks added")
                       .Replace("[tag_r1]", tag_r1);
                }
                else if (message.Category == "IfsR")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[failedreason]", message.Content);
                }
                else if (message.Category == "IfsE")
                {
                    EmergencySupplierDto supplier = (await GetEmgSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[supplierid]", "IMI-ES-" + message.SupplierId)
                        .Replace("[suppliername]", supplier.emergency_supplier_name)
                        .Replace("[failedreason]", message.Content);
                }
                else if (message.Category == "reinv")
                {
                    InviteSupplierDto inviteSupplier = (await GetReInviteSupplierData(message.SupplierId))?.FirstOrDefault();

                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/inv")
                               .Replace("[suppliername]", inviteSupplier.invite_supplier_name);
                }
                else if (message.Category == "needmoreupdated" && message.Content != "IMI-Treasury Bank Reviewer")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();

                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[Role]", message.Content)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove);
                }
                else if (message.Category == "needmoreupdated" && message.Content == "IMI-Treasury Bank Reviewer")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);
                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            if (fileName.Contains("r1") || fileName.Contains("b2") || fileName.Contains("b1") || fileName.Contains("v1") || fileName.Contains("z1") || fileName.Contains("a1") || fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6") || fileName.Contains("g1") || fileName.Contains("f1") || fileName.Contains("f2") || fileName.Contains("f3"))
                            {
                                dynTable += "<tr>";
                                dynTable += "<td>";
                                dynTable += "<span>" + counter + "</span>";
                                dynTable += "</td>";
                                dynTable += "<td>";
                                //counter++;
                            }

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    var history_reviewer = (await GetHistory(message.SupplierId, "Completed", "Awaiting Bank Details Review"))?.FirstOrDefault();
                    var history_approver = (await GetHistory(message.SupplierId, "Completed", "Awaiting Bank Details Approval"))?.FirstOrDefault();

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[bankname]", supplier.bankName + " " + (supplier.otherBankName != "" ? supplier.otherBankName : ""))
                       .Replace("[accountName]", supplier.accountHolderName)
                       .Replace("[accountNo]", supplier.account_number)
                       .Replace("[swiftcode]", supplier.swiftcode)
                       .Replace("[ibanNo]", supplier.ibanNo)
                       .Replace("[bankCurrency]", supplier.accountCurrency)
                       .Replace("[bankAddress]", supplier.bankAddress)
                       .Replace("[attachment]", dynTable)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[reviewerremark]", history_reviewer != null ? history_reviewer.status_comment : "-")
                       .Replace("[approverremark]", history_approver != null ? history_approver.status_comment : "-")
                       .Replace("[email]", supplier.email);
                    message.Subject = "IMI Notification- Bank Details Updated by Supplier " + supplier.supplier_name;

                }
                else if (message.Category == "return")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();

                    var paramtoencriptApp = "processId=" + supplier.process_id + "&commandName=" + "Recommended" + "&email=" + message.To[0].Address + "&role=" + "RETSR" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing
                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[attachement]", dynTable)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);

                    message.Subject = "IMI-Awaiting SRM Recommendation - Return to SRM";
                }
                else if (message.Category == "treasurer")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();
                    MailText = MailText.Replace("[ifscode]", supplier.ifs_code != "" ? " is " + supplier.ifs_code : "will be notified");
                    if (_emailConfig.SupplierPortalSinUpUrl != null)
                    {
                        MailText = MailText.Replace("[supplierPortalSinUpUrl]", _emailConfig.SupplierPortalSinUpUrl + "?" + supplier.email);
                    }
                }
                else if (message.Category == "treasurerteam")
                {
                    SupplierDto supplier = (await GetSupplierData(message.SupplierId))?.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\Images";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("r1") || fileName.Contains("b2") || fileName.Contains("b1") || fileName.Contains("v1") || fileName.Contains("z1") || fileName.Contains("a1") || fileName.Contains("f1") ||
                            fileName.Contains("f2") || fileName.Contains("f3") || fileName.Contains("g1"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                        }


                        if (fileName.Contains("r1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("b2"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("b1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("v1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("z1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("a1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("g1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("f1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("f2"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("f3"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                            counter++;
                        }

                        dynTable += "</td>";

                        // close table row
                        dynTable += "</tr>";
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                    }

                    // close the table tag
                    dynTable += "</table>";

                    var history_trev = (await GetHistory(message.SupplierId, "Completed", "Awaiting Bank Details Review"))?.FirstOrDefault();
                    var history_tapp = message.Content;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[ifscode]", supplier.ifs_code)
                       .Replace("[bank_name]", supplier.bankName)
                       .Replace("[acc_name]", supplier.accountHolderName)
                       .Replace("[acc_no]", supplier.account_number)
                       .Replace("[swift_code]", supplier.swiftcode)
                       .Replace("[iban_no]", supplier.ibanNo)
                       .Replace("[bank_currency]", supplier.accountCurrency)
                       .Replace("[bank_add]", supplier.bankAddress + " " + supplier.bankAddress2)
                       .Replace("[attachment]", dynTable)
                       .Replace("[reviewer_remark]", history_trev != null && history_trev.status_comment != null ? history_trev.status_comment : "")
                       .Replace("[approver_remark]", history_tapp)
                       .Replace("[email]", supplier.email);
                    message.Subject = "IMI-Bank Details was Approved - " + supplier.supplier_name;

                }

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Bcc.AddRange(message.Bcc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };

                if (message.Attachments != null && message.Attachments.Any())
                {
                    byte[] fileBytes;
                    foreach (var attachment in message.Attachments)
                    {
                        using (var ms = new MemoryStream())
                        {
                            attachment.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                    }
                }

                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        private MimeMessage CreateEmailMessage(MessageDto message)
        {
            try
            {
                var template = "\\Template\\SaveAsDraft.html";
                if (message.Category == "draft")
                {
                    template = "\\Template\\SaveAsDraft.html";
                }
                else if (message.Category == "moreinfo")
                {
                    template = "\\Template\\MoreInfo.html";
                }
                else if (message.Category == "reject")
                {
                    template = "\\Template\\Rejected.html";
                }
                else if (message.Category == "srm")
                {
                    template = "\\Template\\SRMapproval.html";
                }
                else if (message.Category == "vp")
                {
                    template = "\\Template\\VPapproval.html";
                }
                else if (message.Category == "emgvp")
                {
                    template = "\\Template\\VPapprovalEmgSupplier.html";
                }
                else if (message.Category == "gmattachement")
                {
                    template = "\\Template\\GMattachment.html";
                }
                else if (message.Category == "vpattachement")
                {
                    template = "\\Template\\VPWfattachment.html";
                }
                else if (message.Category == "register")
                {
                    template = "\\Template\\RegisterSupplier.html";
                }
                else if (message.Category == "moreinfoupdate")
                {
                    template = "\\Template\\UpdateRegisterSupplier.html";
                }
                else if (message.Category == "treasurer")
                {
                    template = "\\Template\\Completed.html";
                }
                else if (message.Category == "workflow")
                {
                    template = "\\Template\\Workflow.html";
                }
                else if (message.Category == "inv")
                {
                    template = "\\Template\\InviteSupplier.html";
                }
                else if (message.Category == "IfsR" || message.Category == "IfsE")
                {
                    template = "\\Template\\IfsIntegrationFailed.html";
                }
                else if (message.Category == "reinv")
                {
                    template = "\\Template\\Re-InviteSupplier.html";
                }
                else if (message.Category == "needmoreupdated" && message.Content != "IMI-Treasury Bank Reviewer")
                {
                    template = "\\Template\\NeedMoreRoleSubmittion.html";
                }
                else if (message.Category == "needmoreupdated" && message.Content == "IMI-Treasury Bank Reviewer")
                {
                    template = "\\Template\\NeedMoreReviewerSubmittion.html";
                }
                else if (message.Category == "hseqreject")
                {
                    template = "\\Template\\HSEQ-Rejected.html";
                }
                else if (message.Category == "return")
                {
                    template = "\\Template\\ReturnToSRM.html";
                }
                else if (message.Category == "srmrejectemg")
                {
                    template = "\\Template\\SRMrejectSupplier.html";
                }
                else if (message.Category == "vprejectgm")
                {
                    template = "\\Template\\VPrejectGM.html";
                }
                else if (message.Category == "treasurerteam")
                {
                    template = "\\Template\\BankDetailsApproved.html";
                }
                //else if (message.Category == "vpapprovesrm")
                //{
                //    template = "\\Template\\VPapproveSRMemail.html";
                //}

                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                if (message.Category == "draft")
                {
                    SupplierDto supplier = GetTempSupplierData(message.SupplierId).Result.FirstOrDefault();
                    SettingsMasterDto configuration = GetSettingsData().Result;
                    var emailconfig = GetEmalConfig();
                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/tmp")
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", message.SupplierId)
                        .Replace("[countryval]", supplier.country)
                        .Replace("[emaildays]", configuration.DraftLimit)
                        .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                        .Replace("[cr]", supplier.cr_no);
                }
                else if (message.Category == "register")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[countryval]", supplier.country)
                        .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                        .Replace("[cr]", supplier.cr_no);
                }
                else if (message.Category == "moreinfoupdate")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[countryval]", supplier.country)
                        .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                        .Replace("[cr]", supplier.cr_no);
                    message.Subject = "IMI-Updated Registration Submitted For Approval";
                }
                else if (message.Category == "moreinfo")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[link]", _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("moreinfo", message.Content);
                }
                else if (message.Category == "reject")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[moreinfo]", message.Content)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[supplierid]", supplier.supplier_code);
                }
                else if (message.Category == "gmattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "GM" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "GM" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    string recommendation = "";

                    if (message.Recommendation == "Recommended")
                    {
                        recommendation = "SRM Analyst Recommended this Supplier, and the Outcome is " + message.Outcome;
                    }

                    if (message.Recommendation == "Not Recommended")
                    {
                        recommendation = "SRM Analyst did <span style='color:red;'>NOT</span> Recommend this supplier, and the Outcome is " + message.Outcome;
                    }

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        // counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                          .Replace("[supplierid]", supplier.supplier_code)
                          .Replace("[suppliername]", supplier.supplier_name)
                          .Replace("[recommendation]", recommendation)
                          .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable);

                    message.Subject = "IMI-Awaiting GM Approval";
                }
                else if (message.Category == "vpattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "VP" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "VP" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";

                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }


                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable);
                    message.Subject = "IMI-Awaiting VP Approval";
                }
                else if (message.Category == "hseqreject")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                       .Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", message.SupplierId)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Supplier Registration Rejected by HSEQ";
                }
                else if (message.Category == "srm")
                {
                    PopulateSupplierRegistrationDetails(message);

                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectory = @"D:\Resources\Images";

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    //SupplierRegistrationDetails_166_637617614477032138.pdf
                    //RegistrationLicenseCertificate_258_r1.pdf

                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            //RegistrationLicenseCertificate_258_r1.pdf
                            // close table row
                            dynTable += "</tr>";
                            //counter++;

                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    /* starts supplier registration copy */
                    /* dynTable += "<td>";

                   foreach (string currentFileReg in txtFilesReg)
                   {
                       string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                       dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_Supplier_Registration_Copy_" + fileNameReg + "</a></span> ";
                   }

                   dynTable += "</td>";*/

                    // close the table tag
                    dynTable += "</table>";

                    var urls = "";
                    var r1 = "";
                    var v1 = "";
                    var b1 = "";
                    var b2 = "";
                    var m1 = "";
                    var q1 = "";
                    var q2 = "";
                    var q3 = "";
                    var s1 = "";
                    var e1 = "";
                    var e2 = "";
                    var e3 = "";
                    var e4 = "";
                    var e5 = "";
                    var h1 = "";
                    var h2 = "";
                    var h3 = "";
                    var h4 = "";
                    var h6 = "";
                    var z1 = "";
                    var a1 = "";
                    var a2 = "";
                    var a3 = "";
                    var a4 = "";
                    var a5 = "";
                    var a6 = "";
                    var g1 = "";
                    var f1 = "";
                    var f2 = "";
                    var f3 = "";

                    var tag_r1 = "-";
                    var tag_v1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";
                    var tag_q2 = "-";
                    var tag_q3 = "-";
                    var tag_s1 = "-";
                    var tag_e1 = "-";
                    var tag_e2 = "-";
                    var tag_e3 = "-";
                    var tag_e4 = "-";
                    var tag_e5 = "-";
                    var tag_h1 = "-";
                    var tag_h2 = "-";
                    var tag_h3 = "-";
                    var tag_h4 = "-";
                    var tag_h6 = "-";
                    var tag_z1 = "-";
                    var tag_a1 = "-";
                    var tag_a2 = "-";
                    var tag_a3 = "-";
                    var tag_a4 = "-";
                    var tag_a5 = "-";
                    var tag_a6 = "-";
                    var tag_g1 = "-";
                    var tag_f1 = "-";
                    var tag_f2 = "-";
                    var tag_f3 = "-";
                    var tag_b1 = "-";
                    var tag_b2 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        /*string[] arr = { "_r1.pdf", "_m1.pdf", "_b1.pdf" };*/
                        /*var r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + fileName;*/

                        /*< a href =[link] >< span style = "font-weight: 400;" > click here </ span ></ a > "*/

                        if (fileName.Contains("r1"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }
                        if (fileName.Contains("b2"))
                        {
                            b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b2 = "Available";
                        }
                        if (fileName.Contains("b1"))
                        {
                            b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b1 = "Available";
                        }
                        if (fileName.Contains("m1"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }
                        if (fileName.Contains("v1"))
                        {
                            v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_v1 = "Available";
                        }
                        if (fileName.Contains("q1"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                        if (fileName.Contains("q2"))
                        {
                            q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q2 = "Available";
                        }
                        if (fileName.Contains("q3"))
                        {
                            q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q3 = "Available";
                        }
                        if (fileName.Contains("s1"))
                        {
                            s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_s1 = "Available";
                        }
                        if (fileName.Contains("e1"))
                        {
                            e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e1 = "Available";
                        }
                        if (fileName.Contains("e2"))
                        {
                            e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e2 = "Available";
                        }
                        if (fileName.Contains("e3"))
                        {
                            e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e3 = "Available";
                        }
                        if (fileName.Contains("e4"))
                        {
                            e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e4 = "Available";
                        }
                        if (fileName.Contains("e5"))
                        {
                            e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e5 = "Available";
                        }
                        if (fileName.Contains("h1"))
                        {
                            h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h1 = "Available";
                        }
                        if (fileName.Contains("h2"))
                        {
                            h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h2 = "Available";
                        }
                        if (fileName.Contains("h3"))
                        {
                            h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h3 = "Available";
                        }
                        if (fileName.Contains("h4"))
                        {
                            h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h4 = "Available";
                        }
                        if (fileName.Contains("h6"))
                        {
                            h6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h6 = "Available";
                        }
                        if (fileName.Contains("z1"))
                        {
                            z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_z1 = "Available";
                        }
                        if (fileName.Contains("a1"))
                        {
                            a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a1 = "Available";
                        }
                        if (fileName.Contains("a2"))
                        {
                            a2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a2 = "Available";
                        }
                        if (fileName.Contains("a3"))
                        {
                            a3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a3 = "Available";
                        }
                        if (fileName.Contains("a4"))
                        {
                            a4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a4 = "Available";
                        }
                        if (fileName.Contains("a5"))
                        {
                            a5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a5 = "Available";
                        }
                        if (fileName.Contains("a6"))
                        {
                            a6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a6 = "Available";
                        }
                        if (fileName.Contains("g1"))
                        {
                            g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_g1 = "Available";
                        }
                        if (fileName.Contains("f1"))
                        {
                            f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f1 = "Available";
                        }
                        if (fileName.Contains("f2"))
                        {
                            f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f2 = "Available";
                        }
                        if (fileName.Contains("f3"))
                        {
                            f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f3 = "Available";
                        }

                        /*fileName = fileName.Replace(oldName, newName);*/

                        /*Directory.Move(currentFile, Path.Combine(archiveDirectory, fileName));*/
                        /*Console.WriteLine("File name: ", fileName);*/
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    /*var r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_r1.pdf";*/
                    /*var v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_v1.pdf";*/
                    /*var g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_g1.pdf";
                    var s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_s1.pdf";
                    var z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_z1.pdf";
                    var a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_a1.pdf";
                    var m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_m1.pdf";
                    var f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_f1.pdf";
                    var f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_f2.pdf";
                    var f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_f3.pdf";
                    var e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e1.pdf";
                    var e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e2.pdf";
                    var e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e3.pdf";
                    var e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e4.pdf";
                    var e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_e5.pdf";
                    var h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h1.pdf";
                    var h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h2.pdf";
                    var h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h3.pdf";
                    var h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_h4.pdf";
                    var q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_q1.pdf";
                    var q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_q2.pdf";
                    var q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_q3.pdf";*/
                    /*var b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + "_b1.pdf";*/

                    string categoriesTable = "";

                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[v1]", v1)
                       .Replace("[g1]", g1)
                       .Replace("[s1]", s1)
                       .Replace("[z1]", z1)
                       .Replace("[a1]", a1)
                       .Replace("[a2]", a2)
                       .Replace("[a3]", a3)
                       .Replace("[a4]", a4)
                       .Replace("[a5]", a5)
                       .Replace("[a6]", a6)
                       .Replace("[m1]", m1)
                       .Replace("[f1]", f1)
                       .Replace("[f2]", f2)
                       .Replace("[f3]", f3)
                       .Replace("[e1]", e1)
                       .Replace("[e2]", e2)
                       .Replace("[e3]", e3)
                       .Replace("[e4]", e4)
                       .Replace("[e5]", e5)
                       .Replace("[h1]", h1)
                       .Replace("[h2]", h2)
                       .Replace("[h3]", h3)
                       .Replace("[h4]", h4)
                       .Replace("[h6]", h6)
                       .Replace("[q1]", q1)
                       .Replace("[q2]", q2)
                       .Replace("[q3]", q3)
                       .Replace("[b1]", b1)
                       .Replace("[b2]", b2)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_v1]", tag_v1)
                       .Replace("[tag_b1]", tag_b1)
                       .Replace("[tag_b2]", tag_b2)
                       .Replace("[tag_q1]", tag_q1)
                       .Replace("[tag_q2]", tag_q2)
                       .Replace("[tag_q3]", tag_q3)
                       .Replace("[tag_e1]", tag_e1)
                       .Replace("[tag_e2]", tag_e2)
                       .Replace("[tag_e3]", tag_e3)
                       .Replace("[tag_e4]", tag_e4)
                       .Replace("[tag_e5]", tag_e5)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_g1]", tag_g1)
                       .Replace("[tag_s1]", tag_s1)
                       .Replace("[tag_h1]", tag_h1)
                       .Replace("[tag_h2]", tag_h2)
                       .Replace("[tag_h3]", tag_h3)
                       .Replace("[tag_h4]", tag_h4)
                       .Replace("[tag_h6]", tag_h6)
                       .Replace("[tag_z1]", tag_z1)
                       .Replace("[tag_a1]", tag_a1)
                       .Replace("[tag_a2]", tag_a2)
                       .Replace("[tag_a3]", tag_a3)
                       .Replace("[tag_a4]", tag_a4)
                       .Replace("[tag_a5]", tag_a5)
                       .Replace("[tag_a6]", tag_a6)
                       .Replace("[tag_f1]", tag_f1)
                       .Replace("[tag_f2]", tag_f2)
                       .Replace("[tag_f3]", tag_f3)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    //message.Subject = "Pending approval at " + message.Content;
                    message.Subject = "IMI-Review Supplier Registration Request " + supplier.supplier_name;
                }
                else if (message.Category == "vp")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                                counter++;
                                /*dynTable += "<span><a href =" + "" + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";*/
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                                counter++;
                                /*dynTable += "<span><a href =" + "" + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";*/
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + "https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    var urls = "";
                    var r1 = "";
                    var v1 = "";
                    var b1 = "";
                    var b2 = "";
                    var m1 = "";
                    var q1 = "";
                    var q2 = "";
                    var q3 = "";
                    var s1 = "";
                    var e1 = "";
                    var e2 = "";
                    var e3 = "";
                    var e4 = "";
                    var e5 = "";
                    var h1 = "";
                    var h2 = "";
                    var h3 = "";
                    var h4 = "";
                    var h6 = "";
                    var z1 = "";
                    var a1 = "";
                    var a2 = "";
                    var a3 = "";
                    var a4 = "";
                    var a5 = "";
                    var a6 = "";
                    var g1 = "";
                    var f1 = "";
                    var f2 = "";
                    var f3 = "";

                    var tag_r1 = "-";
                    var tag_v1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";
                    var tag_q2 = "-";
                    var tag_q3 = "-";
                    var tag_s1 = "-";
                    var tag_e1 = "-";
                    var tag_e2 = "-";
                    var tag_e3 = "-";
                    var tag_e4 = "-";
                    var tag_e5 = "-";
                    var tag_h1 = "-";
                    var tag_h2 = "-";
                    var tag_h3 = "-";
                    var tag_h4 = "-";
                    var tag_h6 = "-";
                    var tag_a1 = "-";
                    var tag_a2 = "-";
                    var tag_a3 = "-";
                    var tag_a4 = "-";
                    var tag_a5 = "-";
                    var tag_a6 = "-";
                    var tag_z1 = "-";
                    var tag_g1 = "-";
                    var tag_f1 = "-";
                    var tag_f2 = "-";
                    var tag_f3 = "-";
                    var tag_b1 = "-";
                    var tag_b2 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        /*string[] arr = { "_r1.pdf", "_m1.pdf", "_b1.pdf" };*/
                        /*var r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + fileName;*/

                        /*< a href =[link] >< span style = "font-weight: 400;" > click here </ span ></ a > "*/

                        if (fileName.Contains("r1"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }
                        if (fileName.Contains("b2"))
                        {
                            b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b2 = "Available";
                        }
                        if (fileName.Contains("b1"))
                        {
                            b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b1 = "Available";
                        }
                        if (fileName.Contains("m1"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }
                        if (fileName.Contains("v1"))
                        {
                            v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_v1 = "Available";
                        }
                        if (fileName.Contains("q1"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                        if (fileName.Contains("q2"))
                        {
                            q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q2 = "Available";
                        }
                        if (fileName.Contains("q3"))
                        {
                            q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_q3 = "Available";
                        }
                        if (fileName.Contains("s1"))
                        {
                            s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_s1 = "Available";
                        }
                        if (fileName.Contains("e1"))
                        {
                            e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e1 = "Available";
                        }
                        if (fileName.Contains("e2"))
                        {
                            e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e2 = "Available";
                        }
                        if (fileName.Contains("e3"))
                        {
                            e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e3 = "Available";
                        }
                        if (fileName.Contains("e4"))
                        {
                            e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e4 = "Available";
                        }
                        if (fileName.Contains("e5"))
                        {
                            e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_e5 = "Available";
                        }
                        if (fileName.Contains("h1"))
                        {
                            h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h1 = "Available";
                        }
                        if (fileName.Contains("h2"))
                        {
                            h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h2 = "Available";
                        }
                        if (fileName.Contains("h3"))
                        {
                            h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h3 = "Available";
                        }
                        if (fileName.Contains("h4"))
                        {
                            h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h4 = "Available";
                        }
                        if (fileName.Contains("h6"))
                        {
                            h6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_h6 = "Available";
                        }
                        if (fileName.Contains("z1"))
                        {
                            z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_z1 = "Available";
                        }
                        if (fileName.Contains("a1"))
                        {
                            a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a1 = "Available";
                        }
                        if (fileName.Contains("a2"))
                        {
                            a2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a2 = "Available";
                        }
                        if (fileName.Contains("a3"))
                        {
                            a3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a3 = "Available";
                        }
                        if (fileName.Contains("a4"))
                        {
                            a4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a4 = "Available";
                        }
                        if (fileName.Contains("a5"))
                        {
                            a5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a5 = "Available";
                        }
                        if (fileName.Contains("a6"))
                        {
                            a6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_a6 = "Available";
                        }
                        if (fileName.Contains("g1"))
                        {
                            g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_g1 = "Available";
                        }
                        if (fileName.Contains("f1"))
                        {
                            f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f1 = "Available";
                        }
                        if (fileName.Contains("f2"))
                        {
                            f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f2 = "Available";
                        }
                        if (fileName.Contains("f3"))
                        {
                            f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_f3 = "Available";
                        }

                        /*fileName = fileName.Replace(oldName, newName);*/

                        /*Directory.Move(currentFile, Path.Combine(archiveDirectory, fileName));*/
                        /*Console.WriteLine("File name: ", fileName);*/
                    }

                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th>";
                    /*if (supplier.criticality != "" && Convert.ToInt16(supplier.criticality) > 4)
                    {
                        categoriesTable += "<th>HSEQ Action</th>";
                    }*/

                    categoriesTable += "</tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }
                        /*if (supplier.criticality != "" && Convert.ToInt16(supplier.criticality) > 4)
                        {
                            if (item.isHSEQChecked == "Approved")
                            {
                                categoriesTable += "<td style=\"color:green\">";
                                categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                                categoriesTable += "</td>";
                            }

                            if (item.isHSEQChecked == "Rejected")
                            {
                                categoriesTable += "<td style=\"color:red\">";
                                categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                                categoriesTable += "</td>";
                            }
                        }*/

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[v1]", v1)
                       .Replace("[g1]", g1)
                       .Replace("[s1]", s1)
                       .Replace("[z1]", z1)
                       .Replace("[a1]", a1)
                       .Replace("[a2]", a2)
                       .Replace("[a3]", a3)
                       .Replace("[a4]", a4)
                       .Replace("[a5]", a5)
                       .Replace("[a6]", a6)
                       .Replace("[m1]", m1)
                       .Replace("[f1]", f1)
                       .Replace("[f2]", f2)
                       .Replace("[f3]", f3)
                       .Replace("[e1]", e1)
                       .Replace("[e2]", e2)
                       .Replace("[e3]", e3)
                       .Replace("[e4]", e4)
                       .Replace("[e5]", e5)
                       .Replace("[h1]", h1)
                       .Replace("[h2]", h2)
                       .Replace("[h3]", h3)
                       .Replace("[h4]", h4)
                       .Replace("[h6]", h6)
                       .Replace("[q1]", q1)
                       .Replace("[q2]", q2)
                       .Replace("[q3]", q3)
                       .Replace("[b1]", b1)
                       .Replace("[b2]", b2)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_v1]", tag_v1)
                       .Replace("[tag_b1]", tag_b1)
                       .Replace("[tag_b2]", tag_b2)
                       .Replace("[tag_q1]", tag_q1)
                       .Replace("[tag_q2]", tag_q2)
                       .Replace("[tag_q3]", tag_q3)
                       .Replace("[tag_e1]", tag_e1)
                       .Replace("[tag_e2]", tag_e2)
                       .Replace("[tag_e3]", tag_e3)
                       .Replace("[tag_e4]", tag_e4)
                       .Replace("[tag_e5]", tag_e5)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_g1]", tag_g1)
                       .Replace("[tag_s1]", tag_s1)
                       .Replace("[tag_h1]", tag_h1)
                       .Replace("[tag_h2]", tag_h2)
                       .Replace("[tag_h3]", tag_h3)
                       .Replace("[tag_h4]", tag_h4)
                       .Replace("[tag_h6]", tag_h6)
                       .Replace("[tag_z1]", tag_z1)
                       .Replace("[tag_a1]", tag_a1)
                       .Replace("[tag_a2]", tag_a2)
                       .Replace("[tag_a3]", tag_a3)
                       .Replace("[tag_a4]", tag_a4)
                       .Replace("[tag_a5]", tag_a5)
                       .Replace("[tag_a6]", tag_a6)
                       .Replace("[tag_f1]", tag_f1)
                       .Replace("[tag_f2]", tag_f2)
                       .Replace("[tag_f3]", tag_f3)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    //message.Subject = "Supplier Registration Request Approved by VP-PSCM_" + supplier.supplier_name;
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved";
                }
                else if (message.Category == "emgvp")
                {
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var urls = "";
                    var r1 = "";
                    var m1 = "";

                    var tag_r1 = "-";
                    var tag_m1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("Reg"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }
                        if (fileName.Contains("Evi"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.emergency_supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId + "/emg";

                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[approvelink]", linkApprove);
                    //message.Subject = "Supplier Registration Request Approved by VP-PSCM_" + supplier.emergency_supplier_name;
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved as Emergency Supplier";
                }
                else if (message.Category == "srmrejectemg")
                {
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();


                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[remark]", message.Content);
                }
                else if (message.Category == "vprejectgm")
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    var classification = "";
                    if (Int16.Parse(supplier.criticality) >= 7) { classification = "High Critical"; }
                    if (Int16.Parse(supplier.criticality) == 6 || Int16.Parse(supplier.criticality) == 5) { classification = "Critical"; }
                    if (Int16.Parse(supplier.criticality) < 5) { classification = "Non Critical"; }

                    var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();

                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                                       .Replace("[supplierclassification]", classification)
                                       .Replace("[vpremark]", history_VP.status_comment)
                                       .Replace("[approvelink]", linkApprove);
                }
                else if (message.Category == "workflow")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);

                    message.Subject = message.Content;
                }
                else if (message.Category == "inv")
                {
                    // SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    InviteSupplierDto inviteSupplier = GetInviteSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\InviteDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var r1 = "";
                    var tag_r1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        r1 = _emailConfig.wfendpoint + "/server/api/file/downloadInvite?fileUrl=" + fileName;
                        tag_r1 = "Available";
                    }

                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/inv")
                               .Replace("[suppliername]", inviteSupplier.invite_supplier_name)
                               .Replace("[r1]", r1)
                               .Replace("[Remarks]", message.Content != null ? message.Content : "No remarks added")
                       .Replace("[tag_r1]", tag_r1);
                }
                else if (message.Category == "IfsR")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[failedreason]", message.Content);
                }
                else if (message.Category == "IfsE")
                {
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[supplierid]", "IMI-ES-" + message.SupplierId)
                        .Replace("[suppliername]", supplier.emergency_supplier_name)
                        .Replace("[failedreason]", message.Content);
                }
                else if (message.Category == "reinv")
                {
                    // SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    InviteSupplierDto inviteSupplier = GetReInviteSupplierData(message.SupplierId).Result.FirstOrDefault();

                    MailText = MailText.Replace("[link]", _emailConfig.supplierRegistrationForm + "/supplier-registration-form/" + message.SupplierId + "/inv")
                               .Replace("[suppliername]", inviteSupplier.invite_supplier_name);
                }
                else if (message.Category == "needmoreupdated" && message.Content != "IMI-Treasury Bank Reviewer")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[Role]", message.Content)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove);
                }
                else if (message.Category == "needmoreupdated" && message.Content == "IMI-Treasury Bank Reviewer")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);
                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            if (fileName.Contains("r1") || fileName.Contains("b2") || fileName.Contains("b1") || fileName.Contains("v1") || fileName.Contains("z1") || fileName.Contains("a1") || fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6") || fileName.Contains("g1") || fileName.Contains("f1") || fileName.Contains("f2") || fileName.Contains("f3"))
                            {
                                dynTable += "<tr>";
                                dynTable += "<td>";
                                dynTable += "<span>" + counter + "</span>";
                                dynTable += "</td>";
                                dynTable += "<td>";
                                //counter++;
                            }

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    var history_reviewer = GetHistory(message.SupplierId, "Completed", "Awaiting Bank Details Review").Result.FirstOrDefault();
                    var history_approver = GetHistory(message.SupplierId, "Completed", "Awaiting Bank Details Approval").Result.FirstOrDefault();

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[bankname]", supplier.bankName + " " + (supplier.otherBankName != "" ? supplier.otherBankName : ""))
                       .Replace("[accountName]", supplier.accountHolderName)
                       .Replace("[accountNo]", supplier.account_number)
                       .Replace("[swiftcode]", supplier.swiftcode)
                       .Replace("[ibanNo]", supplier.ibanNo)
                       .Replace("[bankCurrency]", supplier.accountCurrency)
                       .Replace("[bankAddress]", supplier.bankAddress)
                       .Replace("[attachment]", dynTable)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[reviewerremark]", history_reviewer != null ? history_reviewer.status_comment : "-")
                       .Replace("[approverremark]", history_approver != null ? history_approver.status_comment : "-")
                       .Replace("[email]", supplier.email);
                    message.Subject = "IMI Notification- Bank Details Updated by Supplier " + supplier.supplier_name;

                }
                else if (message.Category == "return")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    var paramtoencriptApp = "processId=" + supplier.process_id + "&commandName=" + "Recommended" + "&email=" + message.To[0].Address + "&role=" + "RETSR" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[attachement]", dynTable)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);

                    message.Subject = "IMI-Awaiting SRM Recommendation - Return to SRM";
                }
                else if (message.Category == "treasurer")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    MailText = MailText.Replace("[ifscode]", supplier.ifs_code != "" ? " is " + supplier.ifs_code : "will be notified");
                    if (_emailConfig.SupplierPortalSinUpUrl != null)
                    {
                        MailText = MailText.Replace("[supplierPortalSinUpUrl]", _emailConfig.SupplierPortalSinUpUrl + "?" + supplier.email);
                    }
                }
                else if (message.Category == "treasurerteam")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\Images";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("r1") || fileName.Contains("b2") || fileName.Contains("b1") || fileName.Contains("v1") || fileName.Contains("z1") || fileName.Contains("a1") || fileName.Contains("f1") ||
                            fileName.Contains("f2") || fileName.Contains("f3") || fileName.Contains("g1"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                        }


                        if (fileName.Contains("r1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("b2"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("b1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("v1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("z1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("a1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("g1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("f1"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("f2"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                            counter++;
                        }
                        if (fileName.Contains("f3"))
                        {
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                            counter++;
                        }

                        dynTable += "</td>";

                        // close table row
                        dynTable += "</tr>";
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;

                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                    }

                    // close the table tag
                    dynTable += "</table>";

                    var history_trev = GetHistory(message.SupplierId, "Completed", "Awaiting Bank Details Review").Result.FirstOrDefault();
                    var history_tapp = message.Content;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[ifscode]", supplier.ifs_code)
                       .Replace("[bank_name]", supplier.bankName)
                       .Replace("[acc_name]", supplier.accountHolderName)
                       .Replace("[acc_no]", supplier.account_number)
                       .Replace("[swift_code]", supplier.swiftcode)
                       .Replace("[iban_no]", supplier.ibanNo)
                       .Replace("[bank_currency]", supplier.accountCurrency)
                       .Replace("[bank_add]", supplier.bankAddress + " " + supplier.bankAddress2)
                       .Replace("[attachment]", dynTable)
                       .Replace("[reviewer_remark]", history_trev != null && history_trev.status_comment != null ? history_trev.status_comment : "")
                       .Replace("[approver_remark]", history_tapp)
                       .Replace("[email]", supplier.email);
                    message.Subject = "IMI-Bank Details was Approved - " + supplier.supplier_name;

                }

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Bcc.AddRange(message.Bcc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };

                if (message.Attachments != null && message.Attachments.Any())
                {
                    byte[] fileBytes;
                    foreach (var attachment in message.Attachments)
                    {
                        using (var ms = new MemoryStream())
                        {
                            attachment.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                    }
                }

                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private MimeMessage CreateEmgEmailMessage(MessageDto message)
        {
            try
            {
                var template = "\\Template\\SaveAsDraft.html";
                if (message.Category == "emgsrm")
                {
                    template = "\\Template\\SRMapprovalEmg.html";
                }
                else if (message.Category == "emggmattachement")
                {
                    template = "\\Template\\GMattachmentEmg.html";
                }
                else if (message.Category == "emgvpattachement")
                {
                    template = "\\Template\\VPWfattachmentEmg.html";
                }
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                if (message.Category == "emggmattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "EGM" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "EGM" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var urls = "";
                    var r1 = "";
                    var m1 = "";
                    var q1 = "";

                    var tag_r1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("Reg"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }

                        if (fileName.Contains("Evi"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }

                        if (fileName.Contains("Vat"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.emergency_supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                          .Replace("[supplierid]", "IMI-ES-" + message.SupplierId)
                          .Replace("[suppliername]", supplier.emergency_supplier_name)
                        .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[m1]", m1)
                       .Replace("[q1]", q1)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_q1]", tag_q1);

                    message.Subject = "IMI-Awaiting for GM Approval";
                }
                else if (message.Category == "emgvpattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "EVP" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "EVP" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var urls = "";
                    var r1 = "";
                    var m1 = "";
                    var q1 = "";

                    var tag_r1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("Reg"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }

                        if (fileName.Contains("Evi"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }

                        if (fileName.Contains("Vat"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.emergency_supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                        .Replace("[supplierid]", "IMI-ES" + message.SupplierId)
                        .Replace("[suppliername]", supplier.emergency_supplier_name)
                        .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[m1]", m1)
                       .Replace("[q1]", q1)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_q1]", tag_q1);
                    message.Subject = "IMI-Awaiting for VP Approval";
                }
                else if (message.Category == "emgsrm")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "ESR" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "ESR" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";

                    string searchTag = message.SupplierId + "_*";

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var urls = "";
                    var r1 = "";
                    var m1 = "";
                    var q1 = "";

                    var tag_r1 = "-";
                    var tag_m1 = "-";
                    var tag_q1 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("Reg"))
                        {
                            r1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_r1 = "Available";
                        }

                        if (fileName.Contains("Evi"))
                        {
                            m1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_m1 = "Available";
                        }

                        if (fileName.Contains("Vat"))
                        {
                            q1 = _emailConfig.wfendpoint + "/server/api/file/downloadEmergency?fileUrl=" + fileName;
                            tag_q1 = "Available";
                        }
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.emergency_supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.emergency_supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", "IMI-ES" + message.SupplierId)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[approvelink]", linkApprove)
                       .Replace("[urlList]", urls)
                       .Replace("[r1]", r1)
                       .Replace("[m1]", m1)
                       .Replace("[q1]", q1)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_q1]", tag_q1)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content)
                       .Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej);
                    message.Subject = "IMI-Awaiting for SRM Recommendation";
                }

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };

                if (message.Attachments != null && message.Attachments.Any())
                {
                    byte[] fileBytes;
                    foreach (var attachment in message.Attachments)
                    {
                        using (var ms = new MemoryStream())
                        {
                            attachment.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                    }
                }

                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private MimeMessage CreateNormalEmailMessage(MessageDto message)
        {
            try
            {
                var template = "\\Template\\SaveAsDraft.html";
                if (message.Category == "emgsrm")
                {
                    template = "\\Template\\SRMapprovalEmg.html";
                }
                else if (message.Category == "gmattachement")
                {
                    template = "\\Template\\GMattachment.html";
                }
                else if (message.Category == "vpattachement")
                {
                    template = "\\Template\\VPWfattachment.html";
                }
                else if (message.Category == "nsrm")
                {
                    template = "\\Template\\SRMwf.html";
                }
                else if (message.Category == "tbr")
                {
                    template = "\\Template\\TBRwf.html";
                }
                else if (message.Category == "tba")
                {
                    template = "\\Template\\TBAwf.html";
                }
                else if (message.Category == "vp")
                {
                    template = "\\Template\\VPapproval.html";
                }
                else if (message.Category == "chseq")
                {
                    template = "\\Template\\HSEQwf.html";
                }
                else if (message.Category == "rethseq")
                {
                    template = "\\Template\\RetHSEQwf.html";
                }
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                if (message.Category == "gmattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "GM" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "GM" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";
                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }
                    // close the table tag
                    dynTable += "</table>";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej).Replace("link3", linkApprove)
                          .Replace("[supplierid]", message.SupplierId)
                          .Replace("[suppliername]", supplier.supplier_name)
                          .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable);

                    message.Subject = "IMI-Awaiting GM Approval";
                }
                else if (message.Category == "vpattachement")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "VP" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Reject" + "&email=" + message.To[0].Address + "&role=" + "VP" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";
                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                        .Replace("[supplierid]", supplier.supplier_code)
                        .Replace("[suppliername]", supplier.supplier_name)
                        .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable);
                    message.Subject = "IMI-Awaiting VP Approval";
                }
                else if (message.Category == "nsrm")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Recommended" + "&email=" + message.To[0].Address + "&role=" + "NSR" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Not Recommended" + "&email=" + message.To[0].Address + "&role=" + "NSR" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string categoriesTable = "";
                    categoriesTable = " <br /><p><span style=\"font - weight: 400;\">Categories List: </span><span style=\"font - weight: 400;\"><br /></span></p></br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";
                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isHSEQChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                            categoriesTable += "</td>";
                        }


                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }
                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       //.Replace("[approvelink]", linkApprove)
                       .Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Awaiting for SRM Recommandation";
                }
                else if (message.Category == "tbr")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Review Done" + "&email=" + message.To[0].Address + "&role=" + "TBR" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);
                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_DesignCapability_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    var urls = "";

                    var b1 = "";

                    var tag_b1 = "-";

                    var b2 = "";

                    var tag_b2 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("b1"))
                        {
                            b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b1 = "Available";
                        }

                        if (fileName.Contains("b2"))
                        {
                            b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b2 = "Available";
                        }
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       //.Replace("[approvelink]", linkApprove)
                       .Replace("link1", encirptedstringApp)
                       .Replace("[urlList]", urls)
                       .Replace("[b1]", b1)
                       .Replace("[tag_b1]", tag_b1)
                       .Replace("[b2]", b2)
                       .Replace("[tag_b2]", tag_b2)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Awaiting Bank Details Review";
                }
                else if (message.Category == "tba")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Approve" + "&email=" + message.To[0].Address + "&role=" + "TBA" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Return to Review" + "&email=" + message.To[0].Address + "&role=" + "TBA" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);
                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BankLetter_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_DesignCapability_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                                counter++;
                            }
                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span>" + supplier.supplier_name + "_" + fileNameReg + "</span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    var urls = "";

                    var b1 = "";

                    var tag_b1 = "-";

                    var b2 = "";

                    var tag_b2 = "-";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("b1"))
                        {
                            b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b1 = "Available";
                        }

                        if (fileName.Contains("b2"))
                        {
                            b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                            tag_b2 = "Available";
                        }
                    }

                    //var linkApprove = "https://uatsrm.imi-ksa.com/expand?id=" + message.SupplierId + "&supplierName=" + supplier.supplier_name + "&intn=true";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       //.Replace("[approvelink]", linkApprove)
                       .Replace("link1", encirptedstringApp)
                       .Replace("link2", encirptedstringRej)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Awaiting Bank Details Approval";
                }
                else if (message.Category == "vp")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string categoriesTable = "";
                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th>";
                    /* if (supplier.criticality!= "" && Convert.ToInt16(supplier.criticality)>4)
                     {
                         categoriesTable += "<th>HSEQ Action</th>";
                     }*/

                    categoriesTable += "</tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }
                        // if (supplier.criticality != "" && Convert.ToInt16(supplier.criticality) > 4)
                        // {
                        //     if (item.isHSEQChecked == "Approved")
                        //     {
                        //         categoriesTable += "<td style=\"color:green\">";
                        //         categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                        //         categoriesTable += "</td>";
                        //     }

                        //     if (item.isHSEQChecked == "Rejected")
                        //     {
                        //         categoriesTable += "<td style=\"color:red\">";
                        //         categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                        //         categoriesTable += "</td>";
                        //     }
                        // }

                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";


                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.ifs_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);
                    //message.Subject = "Supplier Registration Request Approved by VP-PSCM_" + supplier.supplier_name;
                    message.Subject = "IMI-Congratulations! Your Supplier Registration Application is Approved";
                }
                else if (message.Category == "chseq")
                {
                    var paramtoencriptApp = "processId=" + message.Content + "&commandName=" + "Recommended" + "&email=" + message.To[0].Address + "&role=" + "CHSEQ" + "&supplierId=" + message.SupplierId;
                    var paramtoencriptRej = "processId=" + message.Content + "&commandName=" + "Not Recommended" + "&email=" + message.To[0].Address + "&role=" + "CHSEQ" + "&supplierId=" + message.SupplierId;
                    var encirptedstringApp = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptApp);
                    var encirptedstringRej = _emailConfig.wfendpoint + QueryStringModule.Encrypt(paramtoencriptRej);
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span style='color: #444;'>" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_VatRegistration_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span style='color: #444;'>" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span style='color: #444;'>" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span>" + supplier.supplier_name + "_" + fileNameReg + "</span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("link1", encirptedstringApp).Replace("link2", encirptedstringRej)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Awaiting for HSEQ Recommandation";
                }
                else if (message.Category == "rethseq")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing

                        }
                        else
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            if (fileName.Contains("r1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("b2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("b1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("v1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("s1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e5"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("z1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("a1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("g1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("f1"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("f2"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</span> ";
                                counter++;
                            }
                            if (fileName.Contains("f3"))
                            {
                                dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</span> ";
                                counter++;
                            }

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    foreach (string currentFileReg in txtFilesReg)
                    {
                        string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                        dynTable += "<tr>";
                        dynTable += "<td>";
                        dynTable += "<span>" + counter + "</span>";
                        dynTable += "</td>";
                        dynTable += "<td>";

                        dynTable += "<span>" + supplier.supplier_name + "_" + fileNameReg + "</span> ";

                        dynTable += "</td>";

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        dynTable += "</tr>";
                        counter++;
                    }

                    // close the table tag
                    dynTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Awaiting for Audit dates";
                }

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };

                if (message.Attachments != null && message.Attachments.Any())
                {
                    byte[] fileBytes;
                    foreach (var attachment in message.Attachments)
                    {
                        using (var ms = new MemoryStream())
                        {
                            attachment.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                    }
                }

                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private MimeMessage CreateWorkflowTriggeredlMessage(MessageDto message)
        {
            try
            {
                var template = "\\Template\\SaveAsDraft.html";
                if (message.Category == "chseq")
                {
                    template = "\\Template\\HSEQHCwf.html";
                }
                else if (message.Category == "vpapp")
                {
                    template = "\\Template\\VPapprovalSRM.html";
                }
                else if (message.Category == "vpappemg")
                {
                    template = "\\Template\\VPapprovalEmg.html";
                }
                else if (message.Category == "vpappfail")
                {
                    template = "\\Template\\VPapprovalSRMFail.html";
                }
                else if (message.Category == "vpappfailemg")
                {
                    template = "\\Template\\VPapprovalSRMFail.html";
                }

                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                if (message.Content == "highcritial")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();
                    IList<CategoriesForHSEQDto> category = GetSupplierCategories(message.SupplierId).Result;

                    string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
                    string searchTagRegisterCopy = "SupplierRegistrationCopy_" + message.SupplierId + "_*";
                    var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

                    string sourceDirectory = @"D:\Resources\Images";
                    /*string archiveDirectory = @"D:\Resources\Images";*/

                    string searchTag = message.SupplierId + "_*";
                    /*string searchTag = "24018_*";*/

                    /*string oldName = tempId + "_";
                    string newName = registerId + "_";*/

                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    string dynTable = "";
                    dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
                    int counter = 1;
                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                        if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                        {
                            // Do nothing
                        }
                        else if (fileName.Contains("m1") || fileName.Contains("q1") || fileName.Contains("q2") || fileName.Contains("q3") || fileName.Contains("e1") || fileName.Contains("e2") || fileName.Contains("e3") || fileName.Contains("e4") ||
                                 fileName.Contains("h1") || fileName.Contains("h2") || fileName.Contains("h3") || fileName.Contains("h4") || fileName.Contains("h6"))
                        {

                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";

                            //if (fileName.Contains("r1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("b2"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("b1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            if (fileName.Contains("m1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                                counter++;
                            }
                            //if (fileName.Contains("v1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_VatRegistration_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            if (fileName.Contains("q1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("q3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            //if (fileName.Contains("s1"))
                            //{
                            //    dynTable += "<span style='color: #444;'> " + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            if (fileName.Contains("e1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("e4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                                counter++;
                            }
                            //if (fileName.Contains("e5"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</span> ";
                            //    counter++;
                            //}
                            if (fileName.Contains("h1"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h2"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h3"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h4"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                                counter++;
                            }
                            if (fileName.Contains("h6"))
                            {
                                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                                counter++;
                            }

                            //if (fileName.Contains("z1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("a1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("g1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("f1"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("f2"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</span> ";
                            //    counter++;
                            //}
                            //if (fileName.Contains("f3"))
                            //{
                            //    dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</span> ";
                            //    counter++;
                            //}

                            dynTable += "</td>";

                            // close table row
                            dynTable += "</tr>";
                            //counter++;
                        }
                        else
                        {
                            // Do nothing
                        }

                    }

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                        if (fileName.Contains("a2"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a3"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a4"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a5"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }
                        if (fileName.Contains("a6"))
                        {
                            dynTable += "<tr>";
                            dynTable += "<td>";
                            dynTable += "<span>" + counter + "</span>";
                            dynTable += "</td>";
                            dynTable += "<td>";
                            dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                            dynTable += "</td>";
                            dynTable += "</tr>";
                            counter++;
                        }

                        //RegistrationLicenseCertificate_258_r1.pdf
                        // close table row
                        //counter++;
                    }

                    // foreach (string currentFileReg in txtFilesReg)
                    // {
                    //     string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                    //     dynTable += "<tr>";
                    //     dynTable += "<td>";
                    //     dynTable += "<span>" + counter + "</span>";
                    //     dynTable += "</td>";
                    //     dynTable += "<td>";

                    //     dynTable += "<span>" + supplier.supplier_name + "_" + fileNameReg + "</span> ";

                    //     dynTable += "</td>";

                    //     //RegistrationLicenseCertificate_258_r1.pdf
                    //     // close table row
                    //     dynTable += "</tr>";
                    //     counter++;
                    // }

                    // close the table tag
                    dynTable += "</table>";
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    string categoriesTable = "";

                    categoriesTable = "</br><table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Status</th></tr>";

                    foreach (var item in category)
                    {
                        categoriesTable += "<tr>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.generalCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.subCategory + "</span>";
                        categoriesTable += "</td>";
                        categoriesTable += "<td>";
                        categoriesTable += "<span>" + item.detailCategory + "</span>";
                        categoriesTable += "</td>";

                        if (item.isSRMChecked == "Approved")
                        {
                            categoriesTable += "<td style=\"color:green\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }

                        if (item.isSRMChecked == "Rejected")
                        {
                            categoriesTable += "<td style=\"color:red\">";
                            categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                            categoriesTable += "</td>";
                        }
                        categoriesTable += "</tr>";
                    }
                    categoriesTable += "</table>";

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", supplier.supplier_code)
                       .Replace("[categorylist]", categoriesTable)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("link1", linkApprove)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("[attachement]", dynTable)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Please Provide Tentative Dates for " + supplier.supplier_name + " Supplier Qualification Audit";
                }
                else if (message.Content == "ifsapproved")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    // close the table tag
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name)
                                       .Replace("[suppliercode]", supplier.supplier_code)
                                       .Replace("[ifscode]", supplier.ifs_code)
                                       .Replace("[countryval]", supplier.country)
                                       .Replace("[supplierid]", message.SupplierId)
                                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                                       .Replace("link1", linkApprove)
                                       .Replace("[cr]", supplier.cr_no)
                                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Supplier Registration Request Approved by VP-PSCM_" + supplier.supplier_name;
                }
                else if (message.Content == "ifsapprovedemg")
                {
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    // close the table tag
                    //var linkApprove = _emailConfig.wfendpoint + "/client/items/emergency-supplier/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/items/emergency-supplier/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.emergency_supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("[supplierid]", message.SupplierId)
                       .Replace("[contactname]", supplier.first_name + " " + supplier.last_name)
                       .Replace("link1", linkApprove)
                       .Replace("[cr]", supplier.cr_no)
                       .Replace("moreinfo", message.Content);
                    message.Subject = "IMI-Emergency Supplier Registration Request Approved by VP-PSCM_" + supplier.emergency_supplier_name;
                }
                else if (message.Category == "vpappfail")
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    // close the table tag
                    //var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.supplier_name).Replace("[suppliercode]", supplier.supplier_code)
                       .Replace("[supplierid]", message.SupplierId)
                       .Replace("link1", linkApprove)
                       .Replace("[reason]", message.Content);
                    message.Subject = "IMI-Supplier Registration Request Approved by VP-PSCM_" + supplier.supplier_name + " - IFS Integration Failed";
                }
                else if (message.Category == "vpappfailemg")
                {
                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    // close the table tag
                    //var linkApprove = _emailConfig.wfendpoint + "/client/items/emergency-supplier/d/" + message.SupplierId + "&intn=true";
                    var linkApprove = _emailConfig.wfendpoint + "/client/items/emergency-supplier/d/" + message.SupplierId;

                    MailText = MailText.Replace("[suppliername]", supplier.emergency_supplier_name).Replace("[suppliercode]", supplier.emergency_supplier_code)
                       .Replace("[countryval]", supplier.country)
                       .Replace("link1", linkApprove)
                       .Replace("[reason]", message.Content);
                    message.Subject = "IMI-Supplier Registration Request Approved by VP-PSCM_" + supplier.emergency_supplier_name + " - IFS Integration Failed";
                }


                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };

                if (message.Attachments != null && message.Attachments.Any())
                {
                    byte[] fileBytes;
                    foreach (var attachment in message.Attachments)
                    {
                        using (var ms = new MemoryStream())
                        {
                            attachment.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        bodyBuilder.Attachments.Add(attachment.FileName, fileBytes, ContentType.Parse(attachment.ContentType));
                    }
                }

                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private async Task SendAsync(MimeMessage mimeMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, SecureSocketOptions.StartTls);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);
                    await client.SendAsync(mimeMessage);
                }
                catch
                {
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, SecureSocketOptions.StartTls);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
                    client.Send(mailMessage);
                }
                catch (Exception ex)
                {
                    //log an error message or throw an exception or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        private MimeMessage CreateAuditEmailMessage(AuditMessageDto message)
        {
            try
            {
                SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                string sourceDirectory = @"D:\Resources\Images";
                /*string archiveDirectory = @"D:\Resources\Images";*/

                string searchTag = message.SupplierId + "_*";
                /*string searchTag = "24018_*";*/

                /*string oldName = tempId + "_";
                string newName = registerId + "_";*/

                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                var urls = "";
                var r1 = "";
                var v1 = "";
                var b1 = "";
                var b2 = "";
                var m1 = "";
                var q1 = "";
                var q2 = "";
                var q3 = "";
                var s1 = "";
                var e1 = "";
                var e2 = "";
                var e3 = "";
                var e4 = "";
                var e5 = "";
                var h1 = "";
                var h2 = "";
                var h3 = "";
                var h4 = "";
                var h6 = "";
                var z1 = "";
                var a1 = "";
                var a2 = "";
                var a3 = "";
                var a4 = "";
                var a5 = "";
                var a6 = "";
                var g1 = "";
                var f1 = "";
                var f2 = "";
                var f3 = "";

                var tag_r1 = "-";
                var tag_v1 = "-";
                var tag_m1 = "-";
                var tag_q1 = "-";
                var tag_q2 = "-";
                var tag_q3 = "-";
                var tag_s1 = "-";
                var tag_e1 = "-";
                var tag_e2 = "-";
                var tag_e3 = "-";
                var tag_e4 = "-";
                var tag_e5 = "-";
                var tag_h1 = "-";
                var tag_h2 = "-";
                var tag_h3 = "-";
                var tag_h4 = "-";
                var tag_h6 = "-";
                var tag_z1 = "-";
                var tag_a1 = "-";
                var tag_a2 = "-";
                var tag_a3 = "-";
                var tag_a4 = "-";
                var tag_a5 = "-";
                var tag_a6 = "-";
                var tag_g1 = "-";
                var tag_f1 = "-";
                var tag_f2 = "-";
                var tag_f3 = "-";
                var tag_b1 = "-";
                var tag_b2 = "-";

                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                    /*string[] arr = { "_r1.pdf", "_m1.pdf", "_b1.pdf" };*/
                    /*var r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + message.SupplierId + fileName;*/

                    /*< a href =[link] >< span style = "font-weight: 400;" > click here </ span ></ a > "*/

                    if (fileName.Contains("r1"))
                    {
                        r1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_r1 = "Available";
                    }
                    if (fileName.Contains("b2"))
                    {
                        b2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_b2 = "Available";
                    }
                    if (fileName.Contains("b1"))
                    {
                        b1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_b1 = "Available";
                    }
                    if (fileName.Contains("m1"))
                    {
                        m1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_m1 = "Available";
                    }
                    if (fileName.Contains("v1"))
                    {
                        v1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_v1 = "Available";
                    }
                    if (fileName.Contains("q1"))
                    {
                        q1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_q1 = "Available";
                    }
                    if (fileName.Contains("q2"))
                    {
                        q2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_q2 = "Available";
                    }
                    if (fileName.Contains("q3"))
                    {
                        q3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_q3 = "Available";
                    }
                    if (fileName.Contains("s1"))
                    {
                        s1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_s1 = "Available";
                    }
                    if (fileName.Contains("e1"))
                    {
                        e1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_e1 = "Available";
                    }
                    if (fileName.Contains("e2"))
                    {
                        e2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_e2 = "Available";
                    }
                    if (fileName.Contains("e3"))
                    {
                        e3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_e3 = "Available";
                    }
                    if (fileName.Contains("e4"))
                    {
                        e4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_e4 = "Available";
                    }
                    if (fileName.Contains("e5"))
                    {
                        e5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_e5 = "Available";
                    }
                    if (fileName.Contains("h1"))
                    {
                        h1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_h1 = "Available";
                    }
                    if (fileName.Contains("h2"))
                    {
                        h2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_h2 = "Available";
                    }
                    if (fileName.Contains("h3"))
                    {
                        h3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_h3 = "Available";
                    }
                    if (fileName.Contains("h4"))
                    {
                        h4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_h4 = "Available";
                    }
                    if (fileName.Contains("h6"))
                    {
                        h6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_h6 = "Available";
                    }
                    if (fileName.Contains("z1"))
                    {
                        z1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_z1 = "Available";
                    }
                    if (fileName.Contains("a1"))
                    {
                        a1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_a1 = "Available";
                    }
                    if (fileName.Contains("a2"))
                    {
                        a2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_a2 = "Available";
                    }
                    if (fileName.Contains("a3"))
                    {
                        a3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_a3 = "Available";
                    }
                    if (fileName.Contains("a4"))
                    {
                        a4 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_a4 = "Available";
                    }
                    if (fileName.Contains("a5"))
                    {
                        a5 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_a5 = "Available";
                    }
                    if (fileName.Contains("a6"))
                    {
                        a6 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_a6 = "Available";
                    }
                    if (fileName.Contains("g1"))
                    {
                        g1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_g1 = "Available";
                    }
                    if (fileName.Contains("f1"))
                    {
                        f1 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_f1 = "Available";
                    }
                    if (fileName.Contains("f2"))
                    {
                        f2 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_f2 = "Available";
                    }
                    if (fileName.Contains("f3"))
                    {
                        f3 = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                        tag_f3 = "Available";
                    }

                    /*fileName = fileName.Replace(oldName, newName);*/

                    /*Directory.Move(currentFile, Path.Combine(archiveDirectory, fileName));*/
                    /*Console.WriteLine("File name: ", fileName);*/
                }

                var template = "\\Template\\SiteAudit.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                var dates = GenerateTable(message.Auditdates);

                MailText = MailText.Replace("auditdates", dates)
                    .Replace("[supplierid]", supplier.supplier_code)
                    .Replace("[moreinfo]", message.Content)
                    .Replace("[suppliername]", supplier.supplier_name)
                    .Replace("[r1]", r1)
                       .Replace("[v1]", v1)
                       .Replace("[g1]", g1)
                       .Replace("[s1]", s1)
                       .Replace("[z1]", z1)
                       .Replace("[a1]", a1)
                       .Replace("[a2]", a2)
                       .Replace("[a3]", a3)
                       .Replace("[a4]", a4)
                       .Replace("[a5]", a5)
                       .Replace("[a6]", a6)
                       .Replace("[m1]", m1)
                       .Replace("[f1]", f1)
                       .Replace("[f2]", f2)
                       .Replace("[f3]", f3)
                       .Replace("[e1]", e1)
                       .Replace("[e2]", e2)
                       .Replace("[e3]", e3)
                       .Replace("[e4]", e4)
                       .Replace("[e5]", e5)
                       .Replace("[h1]", h1)
                       .Replace("[h2]", h2)
                       .Replace("[h3]", h3)
                       .Replace("[h4]", h4)
                       .Replace("[h6]", h6)
                       .Replace("[q1]", q1)
                       .Replace("[q2]", q2)
                       .Replace("[q3]", q3)
                       .Replace("[b1]", b1)
                       .Replace("[b2]", b2)
                       .Replace("[tag_r1]", tag_r1)
                       .Replace("[tag_v1]", tag_v1)
                       .Replace("[tag_b1]", tag_b1)
                       .Replace("[tag_q1]", tag_q1)
                       .Replace("[tag_q2]", tag_q2)
                       .Replace("[tag_q3]", tag_q3)
                       .Replace("[tag_e1]", tag_e1)
                       .Replace("[tag_e2]", tag_e2)
                       .Replace("[tag_e3]", tag_e3)
                       .Replace("[tag_e4]", tag_e4)
                       .Replace("[tag_e5]", tag_e5)
                       .Replace("[tag_m1]", tag_m1)
                       .Replace("[tag_g1]", tag_g1)
                       .Replace("[tag_s1]", tag_s1)
                       .Replace("[tag_h1]", tag_h1)
                       .Replace("[tag_h2]", tag_h2)
                       .Replace("[tag_h3]", tag_h3)
                       .Replace("[tag_h4]", tag_h4)
                       .Replace("[tag_h6]", tag_h6)
                       .Replace("[tag_z1]", tag_z1)
                       .Replace("[tag_a1]", tag_a1)
                       .Replace("[tag_a2]", tag_a2)
                       .Replace("[tag_a3]", tag_a3)
                       .Replace("[tag_a4]", tag_a4)
                       .Replace("[tag_a5]", tag_a5)
                       .Replace("[tag_a6]", tag_a6)
                       .Replace("[tag_f1]", tag_f1)
                       .Replace("[tag_f2]", tag_f2)
                       .Replace("[tag_f3]", tag_f3);

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private MimeMessage CreateAuditEmailMessageHSEQ(AuditMessageDto message)
        {
            try
            {
                SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                var template = "\\Template\\SiteAuditSrm.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                var dates = GenerateTable(message.Auditdates);
                var linkApprove = _emailConfig.wfendpoint + "/client/dashboard/inner/d/" + message.SupplierId;

                MailText = MailText.Replace("auditdates", dates)
                    .Replace("[supplierid]", supplier.supplier_code)
                    .Replace("[suppliername]", supplier.supplier_name)
                    .Replace("[link]", linkApprove);

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Audit Complete Mail to Supplier - Create Mail
        private MimeMessage CreateAuditCompleteSupplierMessage(MessageDto message)
        {
            try
            {
                SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                string sourceDirectory = @"D:\Resources\AuditFinal";

                string searchTag = "*_" + message.SupplierId + "_*";

                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                string dynTable = "";
                dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\">";
                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                    dynTable += "<tr>";

                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/downloadAuditComplete?fileUrl=" + fileName + " >" + fileName + "</a></span> ";
                    dynTable += "</td>";

                    // close table row
                    dynTable += "</tr>";
                }
                // close the table tag
                dynTable += "</table>";

                var template = "\\Template\\SiteAuditCompleteSupplier.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                MailText = MailText.Replace("[link]", _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId)
                    .Replace("[suppliername]", supplier.supplier_name)
                    .Replace("moreinfo", message.Content)
                    .Replace("[attachement]", dynTable);

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        // Get Supplier's Categories - Create Categories list mail
        public async Task<IList<CategoriesForHSEQDto>> GetSupplierCategories(string supplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetSupplierCategories(supplierId);
            return result;
        }

        private static string GenerateTable(IList<SiteAuditDateDto> siteadates)
        {
            string dynTable = "";
            dynTable = "<table cellspacing=\"0\" cellpadding=\"2\" border=\"1\">";
            for (int tRows = 0; tRows < siteadates.Count; tRows++)
            {
                dynTable += "<tr>";
                dynTable += "<td>"; dynTable += "Date: <font style=\"color: #003DA5;font-family:Cambria,serif\"><b> " + siteadates[tRows].audit_date.ToString("dd/MMM/yyyy") + "</b></font> Time: <font style=\"color: #003DA5;font-family:Cambria,serif\"><b> " + siteadates[tRows].audit_time + " (UTC +03:00) Riyadh</b></font>";
                dynTable += "</td>";

                // close table row
                dynTable += "</tr>";
            }
            // close the table tag
            dynTable += "</table>";
            return dynTable;
        }

        public async Task<List<string>> GetWorkflowEmail(string rolename)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetWorkflowRoleEmail(rolename);
            return result;
        }

        public async Task<List<string>> GetWorkflowUsersEmail(string users)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetWorkflowUsersEmail(users);
            return result;
        }
        public async Task<IList<SupplierDto>> GetSupplierData(string supplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetRegisteredSupplier(supplierId);
            return result;
        }

        //Get Supplier Data for MS Flow
        public async Task<IList<SupplierDto>> GetSupplierDataForMSFlow(string supplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetRegisteredSupplierForMSFlow(supplierId);
            return result;
        }

        public async Task<IList<EmergencySupplierDto>> GetEmgSupplierData(string supplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetEmgRegisteredSupplier(supplierId);
            return result;
        }

        public async Task<IList<SupplierDto>> GetTempSupplierData(string supplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetTempRegisteredSupplier(supplierId);
            return result;
        }

        public async Task<string> GetEmalConfig()
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetEmalConfig();
            return result;
        }

        private MimeMessage CreateAuditFinallMessage(FinalAuditMessageDto message)
        {
            try
            {
                SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                string sourceDirectory = @"D:\Resources\Audit";

                string searchTag = "*_" + message.SupplierId + "_*";

                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                string dynTable = "";
                dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\">";
                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                    dynTable += "<tr>";

                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/downloadAudit?fileUrl=" + fileName + " >" + fileName + "</a></span> ";
                    dynTable += "</td>";

                    // close table row
                    dynTable += "</tr>";
                }
                // close the table tag
                dynTable += "</table>";

                //foreach (string currentFile in txtFiles)
                //{
                //    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                //     var   file = _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName;
                //     var   tag   = "Available";

                //}

                var template = "\\Template\\SiteAuditFinal.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                string[] authorsList = message.Auditdates.Split("T");

                MailText = MailText.Replace("[AUDITS_DATE]", authorsList[0])
                .Replace("[AUDITS_TEXT]", authorsList[1])
                .Replace("[moreinfo]", message.Content)
                .Replace("[suppliername]", supplier.supplier_name)
                .Replace("[attachement]", dynTable)
                ;

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private MimeMessage CreateAuditNCMessage(FinalAuditMessageDto message)
        {
            try
            {
                SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                string sourceDirectory = @"D:\Resources\AuditNonConfirmity";

                string searchTag = "*_" + message.SupplierId + "_*";

                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                string dynTable = "";
                dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\">";
                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                    dynTable += "<tr>";

                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/downloadNC?fileUrl=" + fileName + " >" + fileName + "</a></span> ";
                    dynTable += "</td>";

                    // close table row
                    dynTable += "</tr>";
                }
                // close the table tag
                dynTable += "</table>";

                string sourceDirectory2 = @"D:\Resources\AuditNonConfirmityReport";

                var txtFiles2 = Directory.EnumerateFiles(sourceDirectory2, searchTag, SearchOption.AllDirectories);

                string dynTable2 = "";
                dynTable2 = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\">";
                foreach (string currentFile in txtFiles2)
                {
                    string fileName = currentFile.Substring(sourceDirectory2.Length + 1);

                    dynTable2 += "<tr>";

                    dynTable2 += "<td>";
                    dynTable2 += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/downloadNCAudit?fileUrl=" + fileName + " >" + fileName + "</a></span> ";
                    dynTable2 += "</td>";

                    // close table row
                    dynTable2 += "</tr>";
                }
                // close the table tag
                dynTable2 += "</table>";

                var template = "\\Template\\NonConfirmity.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                //MailText = MailText.Replace("[AUDITS_DATE]", authorsList[0])
                //.Replace("[AUDITS_TEXT]", authorsList[1])
                //.Replace("[suppliername]", supplier.supplier_name)
                //;

                MailText = MailText.Replace("[link]", _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId + "/R_hseq"
                    )
                    .Replace("[supplierid]", supplier.supplier_code)
                    .Replace("[suppliername]", supplier.supplier_name)
                    .Replace("moreinfo", message.Content)
                    .Replace("[attachement]", dynTable)
                    .Replace("[attachement2]", dynTable2);

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Cc.AddRange(message.Cc);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private MimeMessage CreateAuditCompleteMessage(MessageDto message)
        {
            try
            {
                SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                string sourceDirectory = @"D:\Resources\AuditFinal";

                string searchTag = "*_" + message.SupplierId + "_*";

                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                string dynTable = "";
                dynTable = "</br><table cellspacing=\"0\" cellpadding=\"2\" border=\"0\">";
                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                    dynTable += "<tr>";

                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/downloadAuditComplete?fileUrl=" + fileName + " >" + fileName + "</a></span> ";
                    dynTable += "</td>";

                    // close table row
                    dynTable += "</tr>";
                }
                // close the table tag
                dynTable += "</table>";

                var template = "\\Template\\SiteAuditComplete.html";
                string FilePath = Directory.GetCurrentDirectory() + template;
                StreamReader str = new StreamReader(FilePath);
                string MailText = str.ReadToEnd();
                str.Close();

                //MailText = MailText.Replace("[AUDITS_DATE]", authorsList[0])
                //.Replace("[AUDITS_TEXT]", authorsList[1])
                //.Replace("[suppliername]", supplier.supplier_name)
                //;

                MailText = MailText.Replace("[link]", _emailConfig.wfendpoint + "/client/supplier-registration-form/" + message.SupplierId)
                    .Replace("[supplierid]", supplier.supplier_code)
                    .Replace("[suppliername]", supplier.supplier_name)
                    .Replace("[suppliercode]", supplier.supplier_code)
                    .Replace("[countryval]", supplier.country)
                    .Replace("moreinfo", message.Content)
                    .Replace("[attachement]", dynTable);

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress(_emailConfig.From));
                emailMessage.To.AddRange(message.To);
                emailMessage.Subject = message.Subject;
                var bodyBuilder = new BodyBuilder { HtmlBody = MailText };
                emailMessage.Body = bodyBuilder.ToMessageBody();

                return emailMessage;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<string> GetEmailAuthentication(string processId, string command, string email, string role, string supplierId, string enc)
        {
            HttpResponseMessage response;
            string responseString = "not processed";
            //var url = "https://uatsrm.imi-ksa.com:21022/api/TokenAuth/GetEmailAuthentication?"+ "processId=" + processId + "&command=" + command  + "&email=" + email + "&role=" + role + "&supplierId=" + supplierId;
            try
            {
                using (var client = new HttpClient())
                {
                    //client.BaseAddress = new Uri("https://uatsrm.imi-ksa.com:21022/api/TokenAuth/"); //change
                    client.BaseAddress = new Uri("http://localhost:21021/api/TokenAuth/"); //change
                    client.DefaultRequestHeaders.Accept.Clear();
                    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    //POST Method
                    HttpResponseMessage responsePostA = await client.GetAsync("GetEmailAuthentication4?enc=" + enc);

                    if (responsePostA.IsSuccessStatusCode)
                    {
                        responseString = await responsePostA.Content.ReadAsStringAsync();
                        // Get the URI of the created resource.
                        Uri returnUrl = responsePostA.Headers.Location;
                        //  Console.WriteLine(returnUrl);
                    }
                }
            }
            catch (Exception ex)
            {
                response = new HttpResponseMessage();
                return ex.StackTrace.ToString();
            }

            return responseString;
        }

        public async Task<string> GetCurrentWorkflowStatus(string processId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetCurrentWorkflowStatus(processId);
            return result;
        }

        // Get Invite Supplier data to mail
        public async Task<IList<InviteSupplierDto>> GetInviteSupplierData(string inviteSupplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetInviteSupplier(inviteSupplierId);
            return result;
        }

        // Get Re-Invite Supplier data to mail
        public async Task<IList<InviteSupplierDto>> GetReInviteSupplierData(string inviteSupplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetReInviteSupplier(inviteSupplierId);
            return result;
        }

        // MS Flow Emergency approval
        public void SendEmergencyMSFlowApproval(MessageDto message)
        {
            using (var client = new HttpClient())
            {
                string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";
                string searchTag = message.SupplierId + "_*";
                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                var Evi_File = "";
                var Reg_File = "";
                var Vat_File = "";

                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                    if (fileName.Contains("Reg")) { Reg_File = fileName; }
                    else if (fileName.Contains("Evi")) { Evi_File = fileName; }
                    else { Vat_File = fileName; }
                }

                EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                //PROD
                //string URI = "https://prod-185.westeurope.logic.azure.com:443/workflows/f8272c101018474ab70d86e9e250a525/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tTRnym-ArDSvvYXPBDMd4-QtzkWYJuMdjV63i-Hfp-E";

                //UAT
                string URI = "https://prod-112.westeurope.logic.azure.com:443/workflows/0abca8bda9ef45e0a3a9b2bcadf712fa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TV8KRDNCFVsxOrm8Ot86sD7uLtPUdWwR2UR6ZG6Lsqg";

                MSFlowEmergDto Flow = new MSFlowEmergDto();
                Flow.Date = "-";
                Flow.To = "-";
                Flow.Cc = "-";
                Flow.Subject = "-";
                Flow.MailBody = "-";
                Flow.MessageId = "-";
                Flow.SupplierId = message.SupplierId;
                Flow.ContentId = message.Content;
                Flow.Category = "-";
                Flow.SupplierName = supplier.emergency_supplier_name;

                Flow.EviFile = Evi_File != "" ? Evi_File : "Not Available";
                Flow.RegFile = Reg_File != "" ? Reg_File : "Not Available";
                Flow.VatFile = Vat_File != "" ? Vat_File : "Not Available";

                var body = JsonConvert.SerializeObject(Flow);
                var content = new StringContent(body, Encoding.UTF8, "application/json");
                var result = client.PostAsync(URI, content).Result;
                if (result.IsSuccessStatusCode)
                {
                    Console.WriteLine("Success");
                }
            }
        }

        // MS Flow Normal, Critical, High Critical approvals
        public void SendMSFlowApproval(MessageDto message)
        {
            // Normal Workflow
            if (message.Category == "nsrm")
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-59.westeurope.logic.azure.com:443/workflows/cdb28aee524348598095498f49c7827a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3FugamlV9MokPMpx_stTl1ZhbREbArCou0_XPJYPi9g";

                    //UAT
                    string URI = "https://prod-143.westeurope.logic.azure.com:443/workflows/65a787c8f34c44f9b9f2d510dc8ffb31/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=O9CDvDSHUXiBROyMgC0pJmdpcKRs0Cx9lRSnMCkGFp8";

                    MSFlowNormalDto Flow = new MSFlowNormalDto();
                    Flow.Date = "-"; //SRM remark after rejection
                    Flow.To = "-"; //VP Remark
                    Flow.Cc = "-"; //GM Remark
                    Flow.Subject = "-";
                    Flow.MailBody = "-";
                    Flow.MessageId = "-";
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.InviteStatus = supplier.invitestatus != "0" ? "Invitation" : "Website";
                    Flow.Status = supplier.status;
                    Flow.Classification = "Non Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                    if (result.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Success");
                    }
                }
            }

            // Critical Workflow
            if (message.Category == "chseq")
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    //PROd
                    //string URI = "https://prod-128.westeurope.logic.azure.com:443/workflows/e6b1686a4c5b41d18ed43f46470f6f15/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=utWK-UpyzQNenXPythhsXmQ0aUIYr_UOrXjA4g8X6Js";

                    //UAT
                    string URI = "https://prod-189.westeurope.logic.azure.com:443/workflows/378a72dba401412ca84d80db7e3b6326/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=CHZ5hYEd6JF1wrihHj-Dy8WdxqeXBqtg4srXrSgLE7g";

                    MSFlowCriticalDto Flow = new MSFlowCriticalDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";
                    Flow.MailBody = "-";
                    Flow.MessageId = "-";
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = GetSupplierFilesList(message.SupplierId);

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                    if (result.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Success");
                    }
                }
            }

            // High Critical workflow
            if (message.Category == "rethseq")
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierData(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-105.westeurope.logic.azure.com:443/workflows/4815d1d279454a40b33288b05bf3820c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=dW8PFcm8AoQr9GMhJzFDKrih4QQxrrQL3YG-q_23_xM";

                    //UAT
                    string URI = "https://prod-188.westeurope.logic.azure.com:443/workflows/09b02453e9fd4c16a6c58a814578c25c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tWRcKSzOK1qPtVpPUxztjW9PZdjbbIwcVbPRSa0bAgk";

                    MSFlowHighCriticalDto Flow = new MSFlowHighCriticalDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";
                    Flow.MailBody = "-";
                    Flow.MessageId = "-";
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = GetSupplierFilesList(message.SupplierId);
                    Flow.Country = supplier.country;
                    Flow.Classification = "High Critical";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                    if (result.IsSuccessStatusCode)
                    {
                        Console.WriteLine("Success");
                    }
                }
            }
        }

        // Get CategoriesList for MS Flow (HTML)
        public string GetCategoriesListinHTML(string supplierID)
        {
            IList<CategoriesForHSEQDto> category = GetSupplierCategories(supplierID).Result;

            string categoriesTable = "";
            categoriesTable = "<table cellspacing=\"0\" cellpadding=\"4\" border=\"0\"><tr><th>General Category</th><th>Sub Category</th><th>Detail Category</th><th>Action</th><th>HSEQ Action</th></tr>";

            foreach (var item in category)
            {
                categoriesTable += "<tr>";
                categoriesTable += "<td>";
                categoriesTable += "<span>" + item.generalCategory + "</span>";
                categoriesTable += "</td>";
                categoriesTable += "<td>";
                categoriesTable += "<span>" + item.subCategory + "</span>";
                categoriesTable += "</td>";
                categoriesTable += "<td>";
                categoriesTable += "<span>" + item.detailCategory + "</span>";
                categoriesTable += "</td>";

                if (item.isSRMChecked == "Approved")
                {
                    categoriesTable += "<td style=\"color:green\">";
                    categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                    categoriesTable += "</td>";
                }

                if (item.isSRMChecked == "Rejected")
                {
                    categoriesTable += "<td style=\"color:red\">";
                    categoriesTable += "<span>" + item.isSRMChecked + "</span>";
                    categoriesTable += "</td>";
                }

                if (item.isHSEQChecked == "Approved")
                {
                    categoriesTable += "<td style=\"color:green\">";
                    categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                    categoriesTable += "</td>";
                }

                if (item.isHSEQChecked == "Rejected")
                {
                    categoriesTable += "<td style=\"color:red\">";
                    categoriesTable += "<span>" + item.isHSEQChecked + "</span>";
                    categoriesTable += "</td>";
                }

                categoriesTable += "</tr>";
            }
            categoriesTable += "</table>";
            return categoriesTable;
        }

        // Get CategoriesList for MS Flow
        public string GetCategoriesList(string supplierID)
        {
            IList<CategoriesForHSEQDto> category = GetSupplierCategories(supplierID).Result;

            string categoriesTable = "| **General Category** | **Sub Category** | **Detail Category** | **Action** | **HSEQ Action** | " + System.Environment.NewLine;
            categoriesTable += "|:-----------|:-----------|:-----------|:-----------|:-----------| " + System.Environment.NewLine;
            foreach (var item in category)
            {
                categoriesTable += "| " + item.generalCategory + " | " + item.subCategory + " | " + item.detailCategory + " | ";

                if (item.isSRMChecked == "Approved") { categoriesTable += " _" + item.isSRMChecked + "_ | "; }
                if (item.isSRMChecked == "Rejected") { categoriesTable += " _" + item.isSRMChecked + "_ | "; }
                if (item.isHSEQChecked == "Approved") { categoriesTable += " _" + item.isHSEQChecked + "_ | " + System.Environment.NewLine; }
                if (item.isHSEQChecked == "Rejected") { categoriesTable += " _" + item.isHSEQChecked + "_ | " + System.Environment.NewLine; }
            }
            return categoriesTable;
        }

        // Get Supplier Files for MS Flow (HTML)
        public string GetSupplierFilesListinHTML(string supplierID)
        {
            IList<CategoriesForHSEQDto> category = GetSupplierCategories(supplierID).Result;
            SupplierDto supplier = GetSupplierData(supplierID).Result.FirstOrDefault();

            string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
            string searchTagRegisterCopy = "SupplierRegistrationCopy_" + supplierID + "_*";
            string sourceDirectory = @"D:\Resources\Images";
            string searchTag = supplierID + "_*";

            var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);
            var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

            string dynTable = "";
            dynTable = "<table cellspacing=\"0\" cellpadding=\"2\" border=\"0\"><tr><th>Sr. No</th><th>File Name</th></tr>";
            int counter = 1;
            foreach (string currentFile in txtFiles)
            {
                string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                if (fileName.Contains("a2") || fileName.Contains("a3") || fileName.Contains("a4") || fileName.Contains("a5") || fileName.Contains("a6"))
                {
                    // Do nothing

                }
                else
                {

                    dynTable += "<tr>";
                    dynTable += "<td>";
                    dynTable += "<span>" + counter + "</span>";
                    dynTable += "</td>";
                    dynTable += "<td>";

                    if (fileName.Contains("r1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("b1"))
                    {
                        dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetter_" + fileName + "</span> ";
                        counter++;
                    }
                    if (fileName.Contains("b2"))
                    {
                        dynTable += "<span style='color: #444;'>" + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + "</span> ";
                        counter++;
                    }
                    if (fileName.Contains("m1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("v1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_VatRegistration_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("q1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("q2"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("q3"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_QMSISODocument_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("s1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("e1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_DesignCapability_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("e2"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("e3"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("e4"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_BusinessReferences_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("e5"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_PreventionOfCorruption__" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("h1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("h2"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("h3"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("h4"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("h6"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("a1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_LetterOfAssociationFile_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("z1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("g1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_GOSICertificate_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("f1"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear1_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("f2"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear2_" + fileName + "</a></span> ";
                        counter++;
                    }
                    if (fileName.Contains("f3"))
                    {
                        dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_FinancialYear3_" + fileName + "</a></span> ";
                        counter++;
                    }

                    dynTable += "</td>";

                    // close table row
                    dynTable += "</tr>";
                    //counter++;
                }
            }

            foreach (string currentFile in txtFiles)
            {
                string fileName = currentFile.Substring(sourceDirectory.Length + 1);



                if (fileName.Contains("a2"))
                {
                    dynTable += "<tr>";
                    dynTable += "<td>";
                    dynTable += "<span>" + counter + "</span>";
                    dynTable += "</td>";
                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment1_" + fileName + "</a></span> ";
                    dynTable += "</td>";
                    dynTable += "</tr>";
                    counter++;
                }
                if (fileName.Contains("a3"))
                {
                    dynTable += "<tr>";
                    dynTable += "<td>";
                    dynTable += "<span>" + counter + "</span>";
                    dynTable += "</td>";
                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment2_" + fileName + "</a></span> ";
                    dynTable += "</td>";
                    dynTable += "</tr>";
                    counter++;
                }
                if (fileName.Contains("a4"))
                {
                    dynTable += "<tr>";
                    dynTable += "<td>";
                    dynTable += "<span>" + counter + "</span>";
                    dynTable += "</td>";
                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment3_" + fileName + "</a></span> ";
                    dynTable += "</td>";
                    dynTable += "</tr>";
                    counter++;
                }
                if (fileName.Contains("a5"))
                {
                    dynTable += "<tr>";
                    dynTable += "<td>";
                    dynTable += "<span>" + counter + "</span>";
                    dynTable += "</td>";
                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment4_" + fileName + "</a></span> ";
                    dynTable += "</td>";
                    dynTable += "</tr>";
                    counter++;
                }
                if (fileName.Contains("a6"))
                {
                    dynTable += "<tr>";
                    dynTable += "<td>";
                    dynTable += "<span>" + counter + "</span>";
                    dynTable += "</td>";
                    dynTable += "<td>";
                    dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/download?fileUrl=" + fileName + " >" + supplier.supplier_name + "_AdditionalAttachment5_" + fileName + "</a></span> ";
                    dynTable += "</td>";
                    dynTable += "</tr>";
                    counter++;
                }

                //RegistrationLicenseCertificate_258_r1.pdf
                // close table row
                //counter++;
            }

            foreach (string currentFileReg in txtFilesReg)
            {
                string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);

                dynTable += "<tr>";
                dynTable += "<td>";
                dynTable += "<span>" + counter + "</span>";
                dynTable += "</td>";
                dynTable += "<td>";

                dynTable += "<span><a href =" + _emailConfig.wfendpoint + "/server/api/file/DownloadRegisterCopy?fileUrl=" + fileNameReg + " >" + supplier.supplier_name + "_" + fileNameReg + "</a></span> ";

                dynTable += "</td>";

                // close table row
                dynTable += "</tr>";
                counter++;
            }

            // close the table tag
            dynTable += "</table>";
            return dynTable;
        }

        // Get Supplier Files for MS Flow
        public string GetSupplierFilesList(string supplierID)
        {
            SupplierDto supplier = GetSupplierData(supplierID).Result.FirstOrDefault();

            string sourceDirectoryRegisterCopy = @"D:\Resources\SupplierRegistration";
            string searchTagRegisterCopy = "SupplierRegistrationCopy_" + supplierID + "_*";
            var txtFilesReg = Directory.EnumerateFiles(sourceDirectoryRegisterCopy, searchTagRegisterCopy, SearchOption.AllDirectories);

            string sourceDirectory = @"D:\Resources\Images";
            string searchTag = supplierID + "_*";
            var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

            string dynTable = "| File Name | File | " + System.Environment.NewLine;
            dynTable += "|:-----------|:-----------| " + System.Environment.NewLine;
            int counter = 1;
            if (counter == 1)
            {
                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);

                    if (fileName.Contains("r1")) { dynTable += " | " + " RegistrationLicenseCertificate " + " | [" + supplier.supplier_name + "_RegistrationLicenseCertificate_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("b1")) { dynTable += " | " + " BankLetter " + " | " + supplier.supplier_name + "_BankLetter_" + fileName + " | " + System.Environment.NewLine; }
                    if (fileName.Contains("b2")) { dynTable += " | " + " BankLetterWithCompanyLetterhead " + " | " + supplier.supplier_name + "_BankLetterWithCompanyLetterHead_" + fileName + " | " + System.Environment.NewLine; }
                    if (fileName.Contains("a1")) { dynTable += " | " + " LetterofAssociationFile " + " | [" + supplier.supplier_name + "_LetterofAssociationFile_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("a2")) { dynTable += " | " + " AdditionalAttachment " + " | [" + supplier.supplier_name + "_AdditionalAttachment_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("m1")) { dynTable += " | " + " OrgaizationChart " + " | [" + supplier.supplier_name + "_OrgaizationChart_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("v1")) { dynTable += " | " + " VatRegistration " + " | [" + supplier.supplier_name + "_VatRegistration_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("q1")) { dynTable += " | " + " QualityPolicyDoc " + " | [" + supplier.supplier_name + "_QualityPolicyDocument_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("q2")) { dynTable += " | " + " QualityManagementSystem " + " | [" + supplier.supplier_name + "_QualityManagementSystem_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("q3")) { dynTable += " | " + " QMSISODocument " + " | [" + supplier.supplier_name + "_QMSISODocument_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("s1")) { dynTable += " | " + " SaudizationCertificate " + " | [" + supplier.supplier_name + "_SaudizationCertificate_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("e1")) { dynTable += " | " + " OrganizationDesignCapability " + " | [" + supplier.supplier_name + "_OrganizationDesignCapability_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("e2")) { dynTable += " | " + " FinishedProductProcess " + " | [" + supplier.supplier_name + "_FinishedProductProcess_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("e3")) { dynTable += " | " + " ThirdPartyCertifyingBody " + " | [" + supplier.supplier_name + "_ThirdPartyCertifyingBody_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("e4")) { dynTable += " | " + " BusinessReferences " + " | [" + supplier.supplier_name + "_BusinessReferences_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("e5")) { dynTable += " | " + " PreventionOfCorruption " + " | [" + supplier.supplier_name + "_PreventionOfCorruption_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("h1")) { dynTable += " | " + " HseWrittenPolicy " + " | [" + supplier.supplier_name + "_HseWrittenPolicy_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("h2")) { dynTable += " | " + " HseManagementDoc " + " | [" + supplier.supplier_name + "_HseManagementDocument_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("h3")) { dynTable += " | " + " SafetyManagementDoc " + " | [" + supplier.supplier_name + "_SafetyManagementDocument_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("h4")) { dynTable += " | " + " EnvironManagementDoc " + " | [" + supplier.supplier_name + "_EnvironManagementDocument_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("h6")) { dynTable += " | " + " StatisticsDoc " + " | [" + supplier.supplier_name + "_StatisticsDocument_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("z1")) { dynTable += " | " + " ZakatCertificate " + " | [" + supplier.supplier_name + "_ZakatCertificate_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("g1")) { dynTable += " | " + " GOSICertificate " + " | [" + supplier.supplier_name + "_GOSICertificate_" + fileName + "](https://uatsrm.imi-ksa.com:44305/api/file/download?fileUrl=" + fileName + ") | " + System.Environment.NewLine; }
                    if (fileName.Contains("f1")) { dynTable += " | " + " FinancialYear1 " + " | " + supplier.supplier_name + "_FinancialYear1_" + fileName + " | " + System.Environment.NewLine; }
                    if (fileName.Contains("f2")) { dynTable += " | " + " FinancialYear2 " + " | " + supplier.supplier_name + "_FinancialYear2_" + fileName + " | " + System.Environment.NewLine; }
                    if (fileName.Contains("f3")) { dynTable += " | " + " FinancialYear3 " + " | " + supplier.supplier_name + "_FinancialYear3_" + fileName + " | " + System.Environment.NewLine; }

                    counter = counter + 1;
                }
            }

            if (counter != 1)
            {
                foreach (string currentFileReg in txtFilesReg)
                {
                    string fileNameReg = currentFileReg.Substring(sourceDirectoryRegisterCopy.Length + 1);
                    dynTable += " | " + " SupplierRegistrationCopy " + " | [" + supplier.supplier_name + "_" + fileNameReg + "](https://uatsrm.imi-ksa.com:44305/api/file/downloadregistercopy?fileUrl=" + fileNameReg + ") | ";
                }
            }

            return dynTable;
        }

        // Get Bank Details
        public string GetSupplierBankDetails(string supplierID)
        {
            SupplierDto supplier = GetSupplierData(supplierID).Result.FirstOrDefault();

            string bankDetail = " | **Supplier Name** | " + supplier.supplier_name + " | " + System.Environment.NewLine;
            bankDetail += " | **Bank Name** | " + supplier.bankName + "  | " + System.Environment.NewLine;
            bankDetail += " | **Account Holder Name** | " + supplier.accountHolderName + " | " + System.Environment.NewLine;
            bankDetail += " | **Account Number** | " + supplier.account_number + " | " + System.Environment.NewLine;
            bankDetail += " | **BIC/SWIFT CODE** | " + supplier.swiftcode + " | " + System.Environment.NewLine;
            bankDetail += " | **IBAN Number** | " + supplier.ibanNo + " | " + System.Environment.NewLine;
            bankDetail += " | **Bank Currency** | " + supplier.accountCurrency + " | " + System.Environment.NewLine;
            bankDetail += " | **Bank Address** | " + supplier.bankAddress + " | ";

            return bankDetail;
        }

        public bool SendApprovalMSFlowNonCriticalGMVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-59.westeurope.logic.azure.com:443/workflows/cdb28aee524348598095498f49c7827a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3FugamlV9MokPMpx_stTl1ZhbREbArCou0_XPJYPi9g";

                    //UAT
                    string URI = "https://prod-143.westeurope.logic.azure.com:443/workflows/65a787c8f34c44f9b9f2d510dc8ffb31/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=O9CDvDSHUXiBROyMgC0pJmdpcKRs0Cx9lRSnMCkGFp8";

                    MSFlowNonCriticalGMVPDto Flow = new MSFlowNonCriticalGMVPDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "-"; }

                    Flow.MessageId = portalToMsFlowDto.comment;    // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.InviteStatus = supplier.invitestatus != "0" ? "Invitation" : "Website";
                    Flow.Status = supplier.status;
                    Flow.Classification = "Non Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowNonCriticalGM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    logger.Info(" supplier " + message.SupplierId);
                    logger.Info(" supplier " + Convert.ToInt32(message.SupplierId));
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    logger.Info(" supplier count email service" + supplier);
                    logger.Info(" supplier " + supplier);
                    /*var history_srm = GetHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    logger.Info(" history_srm " + history_srm);
                    var histroy_srm_reject = GetOldHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    logger.Info(" histroy_srm_reject " + histroy_srm_reject);
                    var history_GM = GetHistory(message.SupplierId, "Completed", "Awaiting for GM approval").Result.FirstOrDefault();
                    logger.Info(" history_GM " + history_GM);
                    var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();
                    logger.Info(" history_VP " + history_VP);*/



                    /*var srm_remark_after_rejection = GetSupplierHistoryData(message.SupplierId);
                    logger.Info(" srm_remark_after_rejection " + srm_remark_after_rejection);
                    int count = srm_remark_after_rejection.Result.Count();
                    logger.Info(" count " + count);
                    var remark = "-";*/



                    /*for (int i = 0; i < count; i++)
                    {
                        logger.Info(" i " + i);
                        var x = i + 1;
                        logger.Info(" x " + x);
                        if ((x < count) == true)
                        {
                            if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for VP approval" &&
                            srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                            srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                            {
                                remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                                logger.Info(" remark " + remark);
                            }
                            else if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for GM approval" &&
                            srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                            srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                            {
                                remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                            }
                        }
                    }*/



                    //PROD
                    //string URI = "https://prod-199.westeurope.logic.azure.com:443/workflows/46d8a2777a4f4eb68e83da198f59081e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0VL8VPHtqnF918Lf-mMFEiZvUbxKEPgA3gX8WiIRYeU";

                    //UAT
                    string URI = "https://prod-134.westeurope.logic.azure.com:443/workflows/7a8cb5d9cf8c4989b47fc06160341836/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LGmto-x80EXNgiYl6EibQd5M2gwufozddQEIU6DTbkw";

                    MSFlowNonCriticalGMDto Flow = new MSFlowNonCriticalGMDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "-"; }



                    Flow.SRMRemarkAfterRejection = "-";
                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    logger.Info(" message.SupplierId " + message.SupplierId);
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    logger.Info(" supplier.supplier_code " + supplier.supplier_code);
                    Flow.InviteStatus = supplier.invitestatus != "0" ? "Invitation" : "Website";
                    Flow.Status = supplier.status;
                    Flow.Classification = "Non Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.ApprovedPerson = portalToMsFlowDto.triggeredBy;



                    logger.Info(" Flow " + Flow);



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                logger.Info(" Exception " + ex.Message);
                logger.Info(" Exception " + ex.StackTrace);
                return false;
            }
        }

        public bool SendApprovalMSFlowNonCriticalVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    //var history_srm = GetHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var histroy_srm_reject = GetOldHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var history_GM = GetHistory(message.SupplierId, "Completed", "Awaiting for GM approval").Result.FirstOrDefault();
                    //var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();



                    //var srm_remark_after_rejection = GetSupplierHistoryData(message.SupplierId);
                    //int count = srm_remark_after_rejection.Result.Count();
                    //var remark = "-";



                    //for (int i = 0; i < count; i++)
                    //{
                    // var x = i + 1;
                    // if ((x < count) == true)
                    // {
                    // if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for VP approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // else if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for GM approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // }
                    //}



                    //PROD
                    //string URI = "https://prod-156.westeurope.logic.azure.com:443/workflows/c1e5c939c9bc4e378ecc7711c9e0ebc3/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=J7an5S6kaRmspUHJcqtIQT44wzkR6Cc3hHzosRWw52g";

                    //UAT
                    string URI = "https://prod-73.westeurope.logic.azure.com:443/workflows/bd439673aab44886bc2409129b469810/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=W2IG45xLSt1puTPyNBwFFUwklR5LjNTfMtulLOsGQOQ";

                    MSFlowNonCriticalVPDto Flow = new MSFlowNonCriticalVPDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }



                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.InviteStatus = supplier.invitestatus != "0" ? "Invitation" : "Website";
                    Flow.Status = supplier.status;
                    Flow.Classification = "Non Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.GMRemark = portalToMsFlowDto.comment;
                    Flow.SRMRemarkAfterRejection = "-";



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public bool SendApprovalMSFlowCriticalGMVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-252.westeurope.logic.azure.com:443/workflows/238f2c6aa326441181661ce0d1623be7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jo5CP3jTeZ-nGTMYmLIvIc1CPK4VqCVBhnOEVX8VR9o";

                    //UAT
                    string URI = "https://prod-16.westeurope.logic.azure.com:443/workflows/81bb880fa0154f37b29970d5e165bbaa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kp_gxyX4ZzMnpQpNcsgmoFiiRX87RfE82qHlBI0Xw28";

                    MSFlowCriticalGMVPDto Flow = new MSFlowCriticalGMVPDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "-"; }

                    Flow.MessageId = portalToMsFlowDto.comment;    // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.InviteStatus = supplier.invitestatus != "0" ? "Invitation" : "Website";
                    Flow.Status = supplier.status;
                    Flow.Classification = "Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";// GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.HSEQOutcome = "-";
                    Flow.HSEQRemark = "-";
                    Flow.GMRemark = "-";
                    Flow.VPRemark = "-";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowCriticalSRM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    var history_hseq = GetHistory(message.SupplierId, "Completed", "Awaiting for HSEQ Recommendation").Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-252.westeurope.logic.azure.com:443/workflows/238f2c6aa326441181661ce0d1623be7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=jo5CP3jTeZ-nGTMYmLIvIc1CPK4VqCVBhnOEVX8VR9o";

                    //UAT
                    string URI = "https://prod-16.westeurope.logic.azure.com:443/workflows/81bb880fa0154f37b29970d5e165bbaa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=kp_gxyX4ZzMnpQpNcsgmoFiiRX87RfE82qHlBI0Xw28";

                    MSFlowCriticalGMVPDto Flow = new MSFlowCriticalGMVPDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }

                    Flow.MessageId = portalToMsFlowDto.comment;    // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.InviteStatus = supplier.invitestatus != "0" ? "Invitation" : "Website";
                    Flow.Status = supplier.status;
                    Flow.Classification = "Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";// GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.HSEQOutcome = portalToMsFlowDto.command;
                    Flow.HSEQRemark = portalToMsFlowDto.comment;
                    Flow.GMRemark = "-";
                    Flow.VPRemark = "-";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowCriticalGM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    //var history_hseq = GetHistory(message.SupplierId, "Completed", "Awaiting for HSEQ Recommendation").Result.FirstOrDefault();
                    //var history_srm = GetHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var histroy_srm_reject = GetOldHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var history_GM = GetHistory(message.SupplierId, "Completed", "Awaiting for GM approval").Result.FirstOrDefault();
                    //var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();



                    //var srm_remark_after_rejection = GetSupplierHistoryData(message.SupplierId);
                    //int count = srm_remark_after_rejection.Result.Count();
                    //var remark = "-";



                    //for (int i = 0; i < count; i++)
                    //{
                    // var x = i + 1;
                    // if ((x < count) == true)
                    // {
                    // if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for VP approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // else if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for GM approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // }
                    //}



                    //PROD
                    //string URI = "https://prod-84.westeurope.logic.azure.com:443/workflows/0937c3036c1440bd880ca9950feb620e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=8M0VwbCgsyw1xnRn09RDo5fB6DOIvxgVyiKoBED7WeI";

                    //UAT
                    string URI = "https://prod-63.westeurope.logic.azure.com:443/workflows/a8a8bfe5d5424526bd6c7da6df00671a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=xfI9VGmT3O4P_b2X7knSh-ZshVm6o8IqvYHcPfYKG28";

                    MSFlowCriticalGMDto Flow = new MSFlowCriticalGMDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }



                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.ApprovedPerson = portalToMsFlowDto.triggeredBy;



                    Flow.SRMRemarkAfterRejection = "-";
                    Flow.Classification = "Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-"; // portalToMsFlowDto.command;
                    Flow.SRMRemark = "-"; // portalToMsFlowDto.comment;
                    Flow.HSEQOutcome = "-";
                    Flow.HSEQRemark = "-";
                    Flow.GMRemark = "-";
                    Flow.VPRemark = "-";



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        public bool SendApprovalMSFlowCriticalVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    //var history_hseq = GetHistory(message.SupplierId, "Completed", "Awaiting for HSEQ Recommendation").Result.FirstOrDefault();
                    //var history_srm = GetHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var histroy_srm_reject = GetOldHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var history_GM = GetHistory(message.SupplierId, "Completed", "Awaiting for GM approval").Result.FirstOrDefault();
                    //var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();



                    //var srm_remark_after_rejection = GetSupplierHistoryData(message.SupplierId);
                    //int count = srm_remark_after_rejection.Result.Count();
                    //var remark = "-";



                    //for (int i = 0; i < count; i++)
                    //{
                    // var x = i + 1;
                    // if ((x < count) == true)
                    // {
                    // if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for VP approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // else if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for GM approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // }
                    //}



                    //PROD
                    //string URI = "https://prod-238.westeurope.logic.azure.com:443/workflows/b6bd42d391874a8e997622ead3f9e18e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Wtuaomn7osnv2wVK1b5BRF5N_MPLbhQ9k2fljyqf3Lc";

                    //UAT
                    string URI = "https://prod-179.westeurope.logic.azure.com:443/workflows/c05d8bcb346c4c1cbeb9777edff6abde/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mWJl27d7lGvmIFdUgMQpx1gPJTyDtNV8dbx5-GsqJqM";

                    MSFlowCriticalVPDto Flow = new MSFlowCriticalVPDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }



                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.SRMRemarkAfterRejection = "-";
                    Flow.Classification = "Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.HSEQOutcome = "-";
                    Flow.HSEQRemark = "-";
                    Flow.GMRemark = portalToMsFlowDto.comment;
                    Flow.VPRemark = "-";



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowHighCriticalSRM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-03.westeurope.logic.azure.com:443/workflows/045ab8795ff64dfb9312349d138b3a46/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AWWS6tCk_0LMtibfX9YYkXPah_WrfS9WHdujfPDZY30";

                    //UAT
                    string URI = "https://prod-66.westeurope.logic.azure.com:443/workflows/7a824cca046346d7883ddda7bebf032c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hh0H3xkoiXikqY19ZmgfaWlfkvT5SRjZIKN-2ZtfeU8";

                    MSFlowHighCriticalSRMDto Flow = new MSFlowHighCriticalSRMDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }

                    Flow.MessageId = portalToMsFlowDto.comment;    // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.Classification = "High Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";// GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.HSEQOutcome = portalToMsFlowDto.command;
                    Flow.HSEQRemark = portalToMsFlowDto.comment;
                    Flow.GMRemark = "-";
                    Flow.VPRemark = "-";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowHighCriticalGMVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-03.westeurope.logic.azure.com:443/workflows/045ab8795ff64dfb9312349d138b3a46/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=AWWS6tCk_0LMtibfX9YYkXPah_WrfS9WHdujfPDZY30";

                    //UAT
                    string URI = "https://prod-66.westeurope.logic.azure.com:443/workflows/7a824cca046346d7883ddda7bebf032c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hh0H3xkoiXikqY19ZmgfaWlfkvT5SRjZIKN-2ZtfeU8";

                    MSFlowHighCriticalSRMDto Flow = new MSFlowHighCriticalSRMDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }

                    Flow.MessageId = portalToMsFlowDto.comment;    // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.Classification = "High Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.HSEQOutcome = "-";
                    Flow.HSEQRemark = "-";
                    Flow.GMRemark = "-";
                    Flow.VPRemark = "-";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowHighCriticalGM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    //var history_hseq = GetHistory(message.SupplierId, "Completed", "Awaiting for HSEQ Recommendation").Result.FirstOrDefault();
                    //var history_srm = GetHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var histroy_srm_reject = GetOldHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var history_GM = GetHistory(message.SupplierId, "Completed", "Awaiting for GM approval").Result.FirstOrDefault();
                    //var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();



                    //var srm_remark_after_rejection = GetSupplierHistoryData(message.SupplierId);
                    //int count = srm_remark_after_rejection.Result.Count();
                    //var remark = "-";



                    //for (int i = 0; i < count; i++)
                    //{
                    // var x = i + 1;
                    // if ((x < count) == true)
                    // {
                    // if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for VP approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // else if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for GM approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // }
                    //}



                    //PROD
                    //string URI = "https://prod-205.westeurope.logic.azure.com:443/workflows/1f7e7c012f9342f0920a76413ffd26b5/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=05wBGkwbXwVHH4JDNLKWFfAOFWfheHv_a-vRgOuLw-o";

                    //UAT
                    string URI = "https://prod-34.westeurope.logic.azure.com:443/workflows/f1f7e45be71343e0b7562a6620be1cfe/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fhnJHv-ydHVv4QDAgbViEI34kssbjWPrVNqCplwyg-I";

                    MSFlowHighCriticalGMDto Flow = new MSFlowHighCriticalGMDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }



                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.Classification = "High Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-"; // GetSupplierFilesList(message.SupplierId);
                    Flow.ApprovedPerson = portalToMsFlowDto.triggeredBy;
                    Flow.SRMRemarkAfterRejection = "-";
                    Flow.SRMOutcome = "-"; // portalToMsFlowDto.command;
                    Flow.SRMRemark = "-"; // portalToMsFlowDto.comment;
                    Flow.HSEQOutcome = "-";
                    Flow.HSEQRemark = "-";
                    Flow.GMRemark = "-";
                    Flow.VPRemark = "-";



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowHighCriticalVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();
                    //var history_hseq = GetHistory(message.SupplierId, "Completed", "Awaiting for HSEQ Recommendation").Result.FirstOrDefault();
                    //var history_srm = GetHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var histroy_srm_reject = GetOldHistory(message.SupplierId, "Completed", "Awaiting for SRM Recommendation").Result.FirstOrDefault();
                    //var history_GM = GetHistory(message.SupplierId, "Completed", "Awaiting for GM approval").Result.FirstOrDefault();
                    //var history_VP = GetHistory(message.SupplierId, "Completed", "Awaiting for VP approval").Result.FirstOrDefault();



                    //var srm_remark_after_rejection = GetSupplierHistoryData(message.SupplierId);
                    //int count = srm_remark_after_rejection.Result.Count();
                    //var remark = "-";



                    //for (int i = 0; i < count; i++)
                    //{
                    // var x = i + 1;
                    // if ((x < count) == true)
                    // {
                    // if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for VP approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // else if (srm_remark_after_rejection.Result[i + 1].status_remark == "Awaiting for GM approval" &&
                    // srm_remark_after_rejection.Result[i].iscurrentstatus == "Completed" &&
                    // srm_remark_after_rejection.Result[i].status_remark == "Awaiting for SRM Recommendation")
                    // {
                    // remark = remark != "-" ? remark : srm_remark_after_rejection.Result[i].status_comment;
                    // }
                    // }
                    //}



                    //PROD
                    //string URI = "https://prod-164.westeurope.logic.azure.com:443/workflows/8793849b13d244668fd10d8e82cd1712/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=_XFFl9cOuiM6eVeQrEwE1vbHiXOVNXi84Z-u4QbwdTM";

                    //UAT
                    string URI = "https://prod-02.westeurope.logic.azure.com:443/workflows/d96f00955a6b466c9cf2ebfafbe0d30f/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=3ep8U4V3PhAah6RbucSYxJA6RnkLXX3kE2pN8-enRdE";

                    MSFlowHighCriticalVPDto Flow = new MSFlowHighCriticalVPDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }



                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.Classification = "High Critical";
                    Flow.Country = supplier.country;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);
                    Flow.SRMRemarkAfterRejection = "-";
                    Flow.SRMOutcome = "-";
                    Flow.SRMRemark = "-";
                    Flow.HSEQOutcome = "-";
                    Flow.HSEQRemark = "-";
                    Flow.GMRemark = portalToMsFlowDto.comment;
                    Flow.VPRemark = "-";



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowBankTBR(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                var history_VP = GetHistory(message.SupplierId, "Pending", "Awaiting for VP approval").Result;
                if (history_VP.Count == 0)
                {
                    using (var client = new HttpClient())
                    {
                        SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                        //PROD
                        //string URI = "https://prod-93.westeurope.logic.azure.com:443/workflows/e44f0a98fa4a4a57ae565efd9915d6df/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=mWqGQiv3pmePy59M1zbmi_KYZu5w8Vd99DWBjUtaX_M";

                        //UAT
                        string URI = "https://prod-28.westeurope.logic.azure.com:443/workflows/c825bfb7ef084178afe07afc6a474ac7/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=eZSFbkYM807V86UBqBzjatggZqHv8gT5WODJjyWcjZ4";

                        MSFlowBankTBRDto Flow = new MSFlowBankTBRDto();
                        Flow.Date = "-";
                        Flow.To = "-";
                        Flow.Cc = "-";
                        Flow.Subject = "-";

                        if (portalToMsFlowDto.role == "IMI-Treasury Bank Approver") { Flow.MailBody = "Rejected"; }
                        else { Flow.MailBody = "Nothing"; }

                        Flow.MessageId = portalToMsFlowDto.comment;    // Reject Reason
                        Flow.ContentId = message.Content;
                        Flow.SupplierId = message.SupplierId;
                        Flow.SupplierName = supplier.supplier_name;
                        Flow.SupplierCode = supplier.supplier_code;
                        Flow.Category = GetCategoriesList(message.SupplierId);
                        Flow.SupplierFiles = "-";//GetSupplierFilesList(message.SupplierId);

                        var body = JsonConvert.SerializeObject(Flow);
                        var content = new StringContent(body, Encoding.UTF8, "application/json");
                        var result = client.PostAsync(URI, content).Result;
                    }
                    return true;
                }
                else
                {
                    return false;
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowBankTBA(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    SupplierDto supplier = GetSupplierDataForMSFlow(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-223.westeurope.logic.azure.com:443/workflows/2edf5fb6670d40bf8153badee175ba4d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zfTZlGWxx1grnFIdCDLUGNfC0ZXI1HQMa_9Xd9ETL_U";

                    //UAT
                    string URI = "https://prod-169.westeurope.logic.azure.com:443/workflows/6132b1064be4462297f200362b4fb4e2/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=esqYpIE0p2VCGsz_UWRCmVW_Jp-zhQOR-RTXAtMqsWE";

                    MSFlowBankTBADto Flow = new MSFlowBankTBADto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";



                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "Rejected by GM"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "Rejected by VP"; }
                    else { Flow.MailBody = "Nothing"; }



                    Flow.MessageId = portalToMsFlowDto.comment; // Reject Reason
                    Flow.ContentId = message.Content;
                    Flow.SupplierId = message.SupplierId;
                    Flow.SupplierName = supplier.supplier_name;
                    Flow.SupplierCode = supplier.supplier_code;
                    Flow.Category = GetCategoriesList(message.SupplierId);
                    Flow.SupplierFiles = GetSupplierFilesList(message.SupplierId);
                    Flow.SupplierEmail = portalToMsFlowDto.triggeredBy;
                    Flow.BankDetails = GetSupplierBankDetails(message.SupplierId);
                    Flow.ReviewerRemark = portalToMsFlowDto.comment;



                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowEmergencyGM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";
                    string searchTag = message.SupplierId + "_*";
                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var Evi_File = "";
                    var Reg_File = "";
                    var Vat_File = "";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                        if (fileName.Contains("Reg")) { Reg_File = fileName; }
                        else if (fileName.Contains("Evi")) { Evi_File = fileName; }
                        else { Vat_File = fileName; }
                    }

                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-185.westeurope.logic.azure.com:443/workflows/f8272c101018474ab70d86e9e250a525/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tTRnym-ArDSvvYXPBDMd4-QtzkWYJuMdjV63i-Hfp-E";

                    //UAT
                    string URI = "https://prod-112.westeurope.logic.azure.com:443/workflows/0abca8bda9ef45e0a3a9b2bcadf712fa/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=TV8KRDNCFVsxOrm8Ot86sD7uLtPUdWwR2UR6ZG6Lsqg";

                    MSFlowEmergDto Flow = new MSFlowEmergDto();
                    Flow.Date = "-";
                    Flow.To = "-";
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    if (portalToMsFlowDto.role == "IMI-GM") { Flow.MailBody = "After Rejection"; }
                    else if (portalToMsFlowDto.role == "IMI-VP") { Flow.MailBody = "After Rejection"; }
                    else { Flow.MailBody = "Nothing"; }

                    Flow.MessageId = "-";
                    Flow.SupplierId = message.SupplierId;
                    Flow.ContentId = message.Content;
                    Flow.Category = portalToMsFlowDto.comment;
                    Flow.SupplierName = supplier.emergency_supplier_name;

                    Flow.EviFile = Evi_File != "" ? Evi_File : "Not Available";
                    Flow.RegFile = Reg_File != "" ? Reg_File : "Not Available";
                    Flow.VatFile = Vat_File != "" ? Vat_File : "Not Available";

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowEmergencyVP(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";
                    string searchTag = message.SupplierId + "_*";
                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var Evi_File = "";
                    var Reg_File = "";
                    var Vat_File = "";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                        if (fileName.Contains("Reg")) { Reg_File = fileName; }
                        else if (fileName.Contains("Evi")) { Evi_File = fileName; }
                        else { Vat_File = fileName; }
                    }
                    string dynTable = "| File Name | File | " + System.Environment.NewLine;
                    dynTable += "|:-----------|:-----------| " + System.Environment.NewLine;

                    string evi = Evi_File != "" ? "[Available](https://uatsrm.imi-ksa.com:44305/api/file/downloadEmergency?fileUrl=" + Evi_File + ")" : "Not Available";
                    string reg = Reg_File != "" ? "[Available](https://uatsrm.imi-ksa.com:44305/api/file/downloadEmergency?fileUrl=" + Reg_File + ")" : "Not Available";
                    string vat = Vat_File != "" ? "[Available](https://uatsrm.imi-ksa.com:44305/api/file/downloadEmergency?fileUrl=" + Vat_File + ")" : "Not Available";

                    dynTable += "| Registration/License/CR# | " + reg + " | " + System.Environment.NewLine;
                    dynTable += "| Vat Certificate | " + vat + " | " + System.Environment.NewLine;
                    dynTable += "| Evidence Document | " + evi + " | ";

                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();
                    var history_vp = GetEmegencySupplierHistory(message.SupplierId, "Awaiting for VP Approval").Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-244.westeurope.logic.azure.com:443/workflows/2e11a06ed3684bb5b4bb844955e481ee/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=1KQOXxB-iWjziNq0rZ1hZqT4ZGvYF9CAkjUKC9k2F6Q";

                    //UAT
                    string URI = "https://prod-177.westeurope.logic.azure.com:443/workflows/e6a9499d8d454367acb8943e0b96d330/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=fQuMEFo-a-1XUw171Gh233XmQ_jNyeGC87jBEnJh10Q";

                    MSFlowEmergencyGMDto Flow = new MSFlowEmergencyGMDto();
                    Flow.Date = history_vp != null ? history_vp.outcome_reason : "-"; //VP remark
                    Flow.To = portalToMsFlowDto.comment; //GM remark
                    Flow.Cc = "-";
                    Flow.Subject = "-";

                    Flow.MailBody = dynTable;
                    Flow.MessageId = "-";
                    Flow.SupplierId = message.SupplierId;
                    Flow.ContentId = message.Content;
                    Flow.Category = "-";
                    Flow.SupplierName = supplier.emergency_supplier_name;

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public bool SendApprovalMSFlowEmergencySRM(MessageDto message, PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                using (var client = new HttpClient())
                {
                    string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";
                    string searchTag = message.SupplierId + "_*";
                    var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                    var Evi_File = "";
                    var Reg_File = "";
                    var Vat_File = "";

                    foreach (string currentFile in txtFiles)
                    {
                        string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                        if (fileName.Contains("Reg")) { Reg_File = fileName; }
                        else if (fileName.Contains("Evi")) { Evi_File = fileName; }
                        else { Vat_File = fileName; }
                    }

                    string dynTable = "| File Name | File | " + System.Environment.NewLine;
                    dynTable += "|:-----------|:-----------| " + System.Environment.NewLine;

                    string evi = Evi_File != "" ? "[Available](https://uatsrm.imi-ksa.com:44305/api/file/downloadEmergency?fileUrl=" + Evi_File + ")" : "Not Available";
                    string reg = Reg_File != "" ? "[Available](https://uatsrm.imi-ksa.com:44305/api/file/downloadEmergency?fileUrl=" + Reg_File + ")" : "Not Available";
                    string vat = Vat_File != "" ? "[Available](https://uatsrm.imi-ksa.com:44305/api/file/downloadEmergency?fileUrl=" + Vat_File + ")" : "Not Available";

                    dynTable += "| Registration/License/CR# | " + reg + " | " + System.Environment.NewLine;
                    dynTable += "| Vat Certificate | " + vat + " | " + System.Environment.NewLine;
                    dynTable += "| Evidence Document | " + evi + " | ";

                    EmergencySupplierDto supplier = GetEmgSupplierData(message.SupplierId).Result.FirstOrDefault();

                    //PROD
                    //string URI = "https://prod-228.westeurope.logic.azure.com:443/workflows/4b667d1ae0404b0cb0d67c3e3a04172a/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4gNWxNz6Q4vd3i9RSmPVnBZmHgduj8ZuAhKQAPKL7Dw";

                    //UAT
                    string URI = "https://prod-73.westeurope.logic.azure.com:443/workflows/c0314cfb7b224a0ba6cfa17b8736351d/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=LPHyi6v4gMAXtZ2eMtyEBmfljFsjEGIuzTIPzFjLmOI";

                    MSFlowEmergencySRMDto Flow = new MSFlowEmergencySRMDto();

                    if (portalToMsFlowDto.role == "IMI-GM")
                    {
                        Flow.Subject = "Rejected by GM";
                        Flow.Date = "-";
                        Flow.To = portalToMsFlowDto.comment;  // GM Reject Reason
                    }
                    else if (portalToMsFlowDto.role == "IMI-VP")
                    {
                        Flow.Subject = "Rejected by VP";
                        Flow.Date = portalToMsFlowDto.comment; // VP Reject Reason
                        Flow.To = "-";
                    }

                    Flow.Cc = "-";
                    Flow.MailBody = dynTable;
                    Flow.MessageId = "-";
                    Flow.SupplierId = message.SupplierId;
                    Flow.ContentId = message.Content;
                    Flow.Category = "-";
                    Flow.SupplierName = supplier.emergency_supplier_name;

                    var body = JsonConvert.SerializeObject(Flow);
                    var content = new StringContent(body, Encoding.UTF8, "application/json");
                    var result = client.PostAsync(URI, content).Result;
                }
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<IList<PortalToMsFlowDto>> generateemailpending(string currentstatus)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.generateemailpending(currentstatus);
            return result;
        }

        public async Task<IList<SupplierHistoryDto>> GetHistory(string supplierId, string IsCurrentStatus, string StatusRemark)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetHistory(supplierId, IsCurrentStatus, StatusRemark);
            return result;
        }

        public async Task<IList<EmergencySupplierHistoryDto>> GetEmegencySupplierHistory(string supplierId, string Status)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetEmergencyHistory(supplierId, Status);
            return result;
        }

        public async Task<IList<SupplierHistoryDto>> GetOldHistory(string supplierId, string IsCurrentStatus, string StatusRemark)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetOldHistory(supplierId, IsCurrentStatus, StatusRemark);
            return result;
        }

        public async Task<IList<SupplierHistoryDto>> GetSupplierHistoryData(string supplierId)
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetSupplierHistoryData(supplierId);
            return result;
        }
        public async Task<SettingsMasterDto> GetSettingsData()
        {
            var _emaildata = new EmailData();
            var result = await _emaildata.GetSettingsData();
            return result;
        }
    }
}