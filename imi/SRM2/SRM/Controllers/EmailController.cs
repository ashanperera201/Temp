using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using SRMDomain.Data.Interfaces;

namespace SRM.Controllers
{
    [Route("api/email")]
    public class EmailController : Controller
    {
        private readonly EmailConfigDto _emailConfig;
        private readonly ILogger<EmailController> _logger;
        private readonly ISupplierData _supplierData;

        public EmailController(EmailConfigDto emailConfig, ILogger<EmailController> logger, ISupplierData supplierData)
        {
            _supplierData = supplierData;
            _emailConfig = emailConfig;
            _logger = logger;
        }

        //private readonly ICategoryService _categoryService ;

        [HttpGet]
        public async Task<bool> Get(string email, string supplierid, string content, string category)
        {
            var subject = "";
            if (category == "draft")
            {
                subject = "IMI-Application draft Saved";
            }
            else if (category == "moreinfo")
            {
                subject = "IMI-Need More Information";
            }
            else if (category == "reject")
            {
                subject = "IMI Notification: Supplier Registration  Request Rejected";
            }
            else if (category == "srm")
            {
                subject = "IMI-Registration Submitted For Approval";
            }
            else if (category == "vp")
            {
                subject = "IMI-Registration Completed";
            }
            else if (category == "register")
            {
                subject = "IMI-Thank you for submitting your supplier registration request";
            }
            else if (category == "moreinfoupdate")
            {
                subject = "IMI-Updated Registration Submitted For Approval";
            }
            else if (category == "treasurer")
            {
                subject = "IMI-Bank Registration Completed";
            }
            else if (category == "inv")
            {
                subject = "IMI-Invitation to be Registered as an Approved Supplier to International Maritime Industries (IMI)";
            }
            else if (category == "ifs")
            {
                subject = "IMI-IFS integration failed";
            }
            else if (category == "reinv")
            {
                subject = "IMI Reminder - Invite Supplier Created";
            }
            else if (category == "srmrejectemg")
            {
                subject = "IMI-Emergency Supplier Registration Request Rejected by SRM";
            }
            var _emailSender = new EmailService(_emailConfig);
            var message = new MessageDto(new string[] { email }, subject, content, supplierid, null, category, "", "");
            await _emailSender.SendEmailAsync(message);
            return true;
        }

        [HttpGet("sendApproveSupplierMail")]
        public async Task<bool> sendApproveSupplierMail(string email, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                dynamic files = new FormFileCollection();

                //if (Request.ContentType !=null) {
                //    files = Request.Form.Files.Any() ? Request.Form.Files : new FormFileCollection();
                //}
                var emaillist = _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
                }

                //var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageCcDto(new string[] { email }, tolist, "IMI-Registration Completed", content, supplierid, null, category);
                _emailSender.SendCcEmail(message, "");
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("createpdf")]
        public async Task<bool> createpdf(string roleName, string supplierid, string content, string category, string recommendation, string outcome)
        {
            try
            {

                var _emailSender = new EmailService(_emailConfig);
                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }


                var toliststring = "";
                for (int i = 0; i < emaillist.Result.Count; i++)
                {
                    var message = new MessageDto(new string[] { emaillist.Result[i] }, "IMI-Supplier Details", content, supplierid, null, category, recommendation, outcome);
                    _emailSender.PopulateSupplierRegistrationDetails(message);

                }
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("generateEmergencySupplierPdf")]
        public async Task<bool> GenerateEmergencySupplierPdf(string supplierId)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                await _emailSender.PopulateEmgSupplierRegistrationDetails(supplierId);
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [HttpPost("sendmail")]
        public async Task<bool> sendmail(string roleName, string supplierid, string content, string category, string recommendation, string outcome)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                dynamic files = new FormFileCollection();

                //if (Request.ContentType !=null) {
                //    files = Request.Form.Files.Any() ? Request.Form.Files : new FormFileCollection();
                //}
                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                //var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();

                var toliststring = "";
                for (int i = 0; i < emaillist.Result.Count; i++)
                {
                    var message = new MessageDto(new string[] { emaillist.Result[i] }, "IMI-Supplier Details", content, supplierid, null, category, recommendation, outcome);
                    _emailSender.SendEmail(message);
                }
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("sendworkflowmail")]
        public async Task<bool> sendWorkflowMail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageDto(tolist, "IMI-Supplier Details", content, supplierid, null, category, "", "");
                _emailSender.SendEmail(message);

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }


        [HttpPost("sendEmgworkflowmail")]
        public async Task<bool> sendEmgworkflowmail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                //var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                //var toliststring = "";
                //for (int i = 0; i < emaillist.Result.Count; i++)
                //{
                //    var message = new MessageDto(new string[] { emaillist.Result[i] }, "IMI-Supplier Details", content, supplierid, null, category, "", "");
                //    _emailSender.SendEmergencyEmail(message);
                //}
                var message = new MessageDto(new string[] { "-" }, "IMI-Supplier Details", content, supplierid, null, category, "", "");
                _emailSender.SendEmergencyEmail(message);
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("sendNormalworkflowmail")]
        public async Task<bool> sendNormalworkflowmail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                //var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                //var toliststring = "";
                //for (int i = 0; i < emaillist.Result.Count; i++)
                //{
                //    var message = new MessageDto(new string[] { emaillist.Result[i] }, "IMI-Supplier Details", content, supplierid, null, category, "", "");
                //    _emailSender.SendWorkflowEmail(message);
                //}
                var message = new MessageDto(new string[] { "-" }, "IMI-Supplier Details", content, supplierid, null, category, "", "");
                _emailSender.SendWorkflowEmail(message);
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("sendWorkflowTriggeredMail")]
        public async Task<bool> sendWorkflowTriggeredMail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();

                var message = new MessageDto(tolist, "IMI-Please Provide Three Tentative Dates for Site Audit", content, supplierid, null, category, "", "");
                _emailSender.sendWorkflowTriggeredMail(message);
            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("sendsrmmail")]
        public async Task<bool> sendSrmMail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageDto(tolist, "IMI-Supplier SRM Approval", content, supplierid, null, category, "", "");
                _emailSender.SendEmail(message);

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("sendsrmrejectbyhseqmail")]
        public async Task<bool> sendsrmrejectbyhseqmail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageDto(tolist, "IMI-Supplier Registration Rejected by HSEQ", content, supplierid, null, category, "", "");
                _emailSender.SendEmail(message);

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        /*
        [HttpPost]
        public async Task<bool> Post(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                var files = Request.Form.Files.Any() ? Request.Form.Files : new FormFileCollection();

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                emaillist.Result.Add("evon.reginold@xitricon.com");
                var toliststring = "";
                for (int i = 0; i < emaillist.Result.Count; i++)
                {
                    var message = new MessageDto(new string[] { emaillist.Result[i] }, "Supplier Details", content, supplierid, files, category);
                    _emailSender.SendEmail(message);
                }
            }
            catch (Exception ex)
            {

                return false;
            }
            
            return true;
        }*/

        [HttpGet("bankdatacompletedemail")]
        public async Task<bool> BankDataCompleted(string supplierid, string comment)
        {
            var _emailSender = new EmailService(_emailConfig);
            var emaillist = _emailSender.GetWorkflowEmail("IMI-Treasury Bank Reviewer");
            if (emaillist.Result == null)
            {
                emaillist = _emailSender.GetWorkflowEmail("IMI-Treasury Bank Reviewer");
            }

            var emaillistsrm = _emailSender.GetWorkflowEmail("IMI-Treasury Bank Approver");
            if (emaillistsrm.Result == null)
            {
                emaillistsrm = _emailSender.GetWorkflowEmail("IMI-Treasury Bank Approver");
            }

            var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
            var tolistsrm = emaillistsrm.Result.Select(i => i.ToString()).ToArray();
            var alllist = tolist.Union(tolistsrm).ToArray();

            var message = new MessageDto(alllist, "IMI-Supplier Bank Registration Completed", comment, supplierid, null, "treasurerteam", "", "");
            _emailSender.SendEmail(message);

            return true;
        }

        [HttpPost("auditdates")]
        public async Task<bool> SendAuditDates([FromBody] IList<SiteAuditDateDto> dateList, string email, string supplierid, string content, string category)
        {
            var _emailSender = new EmailService(_emailConfig);
            //var files = Request.Form.Files.Any() ? Request.Form.Files : new FormFileCollection();
            var emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            if (emaillist.Result == null)
            {
                emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            }

            var emaillistsrm = _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
            if (emaillistsrm.Result == null)
            {
                emaillistsrm = _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
            }

            var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
            var tolistsrm = emaillistsrm.Result.Select(i => i.ToString()).ToArray();
            var alllist = tolist.Union(tolistsrm).ToArray();

            var message = new AuditMessageDto(new string[] { email }, alllist, "IMI-Required Date for the HSEQ Supplier Qualification Audit", content, supplierid, null, category, dateList);
            _emailSender.SendAuditEmail(message);
            return true;
        }

        [HttpPost("auditdateshseq")]
        public async Task<bool> SendAuditDatesHSEQ([FromBody] IList<SiteAuditDateDto> dateList, string email, string supplierid, string content, string category)
        {
            var _emailSender = new EmailService(_emailConfig);
            var emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            if (emaillist.Result == null)
            {
                emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            }

            var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
            var message = new AuditMessageDto(tolist, new string[] { }, "IMI-Confirmed IMS Site Audit Date and Time", content, supplierid, null, category, dateList);
            _emailSender.SendAuditEmailHseq(message);
            return true;
        }

        [HttpPost("auditdatesfinal")]
        public async Task<bool> SendAuditDateFinal(string email, string supplierid, string content, string category, string finaldate)
        {
            var _emailSender = new EmailService(_emailConfig);

            var emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            if (emaillist.Result == null)
            {
                emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            }

            var emaillistsrm = _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
            if (emaillistsrm.Result == null)
            {
                emaillistsrm = _emailSender.GetWorkflowEmail("IMI-SRM Analyst");
            }

            var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
            var tolistsrm = emaillistsrm.Result.Select(i => i.ToString()).ToArray();
            var alllist = tolist.Union(tolistsrm).ToArray();

            var message = new FinalAuditMessageDto(new string[] { email }, alllist, "IMI-Confirmed Date and Time for HSEQ Supplier Qualification Site Audit", content, supplierid, null, category, finaldate);
            _emailSender.SendAuditFinalEmail(message);
            return true;
        }

        [HttpPost("auditnonconfirmity")]
        public async Task<bool> SendAuditDateNonConfirmity(string email, string supplierid, string content, string category)
        {
            var _emailSender = new EmailService(_emailConfig);
            var emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            if (emaillist.Result == null)
            {
                emaillist = _emailSender.GetWorkflowEmail("IMI-HSEQ");
            }

            var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();

            var message = new FinalAuditMessageDto(new string[] { email }, new string[] { }, "IMI-Audit Report with Observations", content, supplierid, null, category, null);
            _emailSender.SendAuditNonConfirmity(message);
            return true;
        }

        [HttpPost("auditcompletesrmmail")]
        public async Task<bool> auditcompletesrmmail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageDto(tolist, "IMI-Audit Completed", content, supplierid, null, category, "", "");
                _emailSender.SendAuditCompleteEmail(message);

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpGet("Generatependingemail")]
        public async Task<bool> Generatependingemail(string currentstatus)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                IList<PortalToMsFlowDto> pendinglist = _emailSender.generateemailpending(currentstatus).Result.ToList();



                foreach (var item in pendinglist)
                {
                    await CallFromPortalByFlow(item);
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpGet("GeneratependingemailHSEQ")]
        public async Task<bool> GeneratependingemailHSEQ(string currentstatus)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                IList<PortalToMsFlowDto> pendinglist = _emailSender.generateemailpending(currentstatus).Result.ToList();



                foreach (var item in pendinglist)
                {
                    if (item.criticality > 6)
                    {
                        sendWorkflowTriggeredMail("IMI-HSEQ", item.supplierID, "highcritial", "chseq");
                    }
                    else if (item.criticality == 5 || item.criticality == 6)
                    {
                        sendNormalworkflowmail("IMI-HSEQ", item.supplierID, item.procesID, "chseq");
                    }
                    //await CallFromPortalByFlow(item);
                }



                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }



        [HttpGet("GetEmailAuthentication")]
        public async Task<ContentResult> GetEmailAuthentication(string enc)
        {
            var encirptedstring = enc.Replace(' ', '+');
            encirptedstring = QueryStringModule.Decrypt(encirptedstring);
            var decriptedvalues = encirptedstring.Split('&').ToArray();
            string processId = decriptedvalues[0].Substring(decriptedvalues[0].IndexOf("=") + 1);
            string command = decriptedvalues[1].Substring(decriptedvalues[1].IndexOf("=") + 1);
            string email = decriptedvalues[2].Substring(decriptedvalues[2].IndexOf("=") + 1);
            string role = decriptedvalues[3].Substring(decriptedvalues[3].IndexOf("=") + 1);
            string supplierId = decriptedvalues[4].Substring(decriptedvalues[4].IndexOf("=") + 1);

            var finalresult = "Something went wrong please contact administrator";

            var _emailSender = new EmailService(_emailConfig);

            var currentstatus = _emailSender.GetCurrentWorkflowStatus(processId);

            if ((role == "GM" && currentstatus.Result == "GM Approval") || (role == "VP" && currentstatus.Result == "VP Approval"))
            {

                var result = await _emailSender.GetEmailAuthentication(processId, command, email, role, supplierId, enc);
                if (role == "GM" && command == "Approve")
                {
                    await sendmail("IMI-VP", supplierId, processId, "vpattachement", "", "");
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#dff0d8;width:550px;" +
                "font-family:sans-serif;height:30px;border-color: #d6e9c6;\">You have successfully approved this request !</div>";
                }
                else if (role == "VP" && command == "Approve")
                {
                    //System.Threading.Thread.Sleep(10000);
                    await Task.Delay(15000);

                    SupplierDto supplier = _emailSender.GetSupplierData(supplierId).Result.FirstOrDefault();
                    if (supplier.ifs_code != null || supplier.ifs_code != "")
                    {
                        await Get(supplier.email, supplierId, "no", "vp");
                    }
                    await sendWorkflowMail("IMI-Treasury Bank Reviewer", supplierId, "Awaiting Bank Details Review", "workflow");
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#dff0d8;width:550px;" +
               "font-family:sans-serif;height:30px;border-color: #d6e9c6;\">You have successfully approved this request !</div>";
                }
                else if (command == "Reject")
                {
                    await sendWorkflowMail("IMI-SRM Analyst", supplierId, "Awaiting for SRM Recommendation", "workflow");
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#f2dede;width:550px;" +
                "font-family:sans-serif;height:30px;border-color: #ebccd1;\">You have successfully rejected this request !</div>";
                }

            }
            if ((role == "EGM" && currentstatus.Result == "GM Approval") || (role == "EVP" && currentstatus.Result == "VP Approval"))
            {

                var result = await _emailSender.GetEmailAuthentication(processId, command, email, role, supplierId, enc);
                if (role == "EGM" && command == "Approve")
                {
                    await sendEmgworkflowmail("IMI-VP", supplierId, processId, "emgvpattachement");
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#dff0d8;width:550px;" +
                "font-family:sans-serif;height:30px;border-color: #d6e9c6;\">You have successfully approved this request !</div>";
                }
                else if (role == "EVP" && command == "Approve")
                {
                    //System.Threading.Thread.Sleep(10000);
                    await Task.Delay(10000);

                    EmergencySupplierDto supplier = _emailSender.GetEmgSupplierData(supplierId).Result.FirstOrDefault();
                    if (supplier.ifs_code != null || supplier.ifs_code != "")
                    {
                        await Get(supplier.email, supplierId, "no", "emgvp");
                    }
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#dff0d8;width:550px;" +
               "font-family:sans-serif;height:30px;border-color: #d6e9c6;\">You have successfully approved this request !</div>";
                }
                else if (command == "Reject")
                {
                    await sendEmgworkflowmail("IMI-SRM Analyst", supplierId, "Awaiting for SRM Recommendation", "emgsrm");
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#f2dede;width:550px;" +
                "font-family:sans-serif;height:30px;border-color: #ebccd1;\">You have successfully rejected this request !</div>";
                }

            }
            else
            {
                if (command == "Approve")
                {
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#dff0d8;width:550px;" +
                     "font-family:sans-serif;height:30px;border-color: #d6e9c6;\">You have successfully approved this request !</div>";
                }
                else if (command == "Reject")
                {
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#f2dede;width:550px;" +
                 "font-family:sans-serif;height:30px;border-color: #ebccd1;\">You have successfully rejected this request !</div>";
                }
                else
                {
                    finalresult = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#fcf8e3;width:550px;" +
              "font-family:sans-serif;;height:30px;border-color: #faebcc;\">You have already responded to this request !</div>";
                }
            }

            //return finalresult;

            return new ContentResult
            {
                ContentType = "text/html",
                Content = finalresult
            };

        }

        [HttpGet("testnot")]
        public ContentResult GetAuthentication()

        {

            //var returnstring = "<script type=\"text / javascript\"> alert(success);</ script > ";
            //return returnstring;

            //string result = @"alert(""success"");";
            //var resp = new HttpResponseMessage(HttpStatusCode.OK);
            //resp.Content = new StringContent(result, System.Text.Encoding.UTF8, "text/plain");
            //resp.Content.Headers.ContentType = new MediaTypeHeaderValue("application/x-javascript");
            //return resp;

            return new ContentResult
            {
                ContentType = "text/html",
                Content = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#f2dede;width:550px;" +
                "font-family:sans-serif;height:30px;border-color: #ebccd1;\">You have successfully rejected this request !</div>"

                // Content = "<div style=\"position:relative;padding:1.25rem 1.25rem;margin-bottom:1rem;border:1px solid transparent;border-radius:.25rem;background-color:#f2dede;width:550px;" +
                //"font-family:sans-serif;;height:30px;\">You have successfully rejected this request!</div>"
            };

        }

        [HttpPost("sendIfsFailedemail")]
        public async Task<bool> sendIfsFailedemail([FromBody] IfsFailDto supplier)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);

                IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                configurationBuilder.AddJsonFile("AppSettings.json");
                IConfiguration configuration = configurationBuilder.Build();

                //var supportemail = configuration["ifsfailedemail"];

                //var message = new MessageDto(new string[] { supportemail }, "IFS integration failed", supplier.category, supplier.value, null, "ifs");
                //_emailSender.SendEmail(message);

                var emaillist = _emailSender.GetWorkflowEmail("SRM Admin");
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail("SRM Admin");
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();

                var toliststring = string.Join(",", emaillist);
                var cat = "";

                if (supplier.category == "R")
                {
                    cat = "IfsR";
                }
                else if (supplier.category == "E")
                {
                    cat = "IfsE";
                }
                var message = new MessageDto(tolist, "IMI-IFS integration failed", supplier.message, supplier.value, null, cat, "", "");
                _emailSender.SendEmail(message);


            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpGet("moreinfo")]
        public async Task<bool> SendNeedmoreInfo(string email, string supplierid, string content, string roleName)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                var fullrolename = "IMI-SRM Analyst";
                if (roleName == "srm")
                {
                    fullrolename = "IMI-SRM Analyst";
                }
                else if (roleName == "gm")
                {
                    fullrolename = "IMI-GM";
                }
                else if (roleName == "vp")
                {
                    fullrolename = "IMI-VP";
                }
                else if (roleName == "hseq")
                {
                    fullrolename = "IMI-HSEQ";
                }
                else if (roleName == "trev")
                {
                    fullrolename = "IMI-Treasury Bank Reviewer";
                }
                else if (roleName == "tapp")
                {
                    fullrolename = "IMI-Treasury Bank Approver";
                }

                var emaillist = _emailSender.GetWorkflowEmail(fullrolename);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(fullrolename);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();

                var message = new MessageCcDto(new string[] { email }, new string[] { }, "IMI-Need More Information", content, supplierid, null, "moreinfo");
                _emailSender.SendCcEmail(message, roleName);

                return true;

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        [HttpPost("needmorerolemail")]
        public async Task<bool> sendNeedMoreRoleMail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                var fullrolename = "IMI-SRM Analyst";

                if (roleName == "srm")
                {
                    fullrolename = "IMI-SRM Analyst";
                }
                else if (roleName == "gm")
                {
                    fullrolename = "IMI-GM";
                }
                else if (roleName == "vp")
                {
                    fullrolename = "IMI-VP";
                }
                else if (roleName == "hseq")
                {
                    fullrolename = "IMI-HSEQ";
                }
                else if (roleName == "trev")
                {
                    fullrolename = "IMI-Treasury Bank Reviewer";
                }
                else if (roleName == "tapp")
                {
                    fullrolename = "IMI-Treasury Bank Approver";
                }


                var emaillist = _emailSender.GetWorkflowEmail(fullrolename);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(fullrolename);
                }

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageDto(tolist, "IMI-Supplier Submitted Need More Information", fullrolename, supplierid, null, category, "", "");
                _emailSender.SendEmail(message);

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        // Audit Complete Mail to Supplier
        [HttpPost("auditcompletesuppliermail")]
        public async Task<bool> auditcompletesuppliermail(string email, string supplierid, string content, string category)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                var message = new MessageDto(new string[] { email }, "IMI supplier qualification audit Completed", content, supplierid, null, category, "", "");
                _emailSender.SendAuditCompleteSupplierEmail(message);

            }
            catch (Exception ex)
            {

                return false;
            }
            return true;
        }

        // Call MS Flow approval for portal
        [HttpPost("msflowstepfromportal")]
        public async Task<bool> CallFromPortalByFlow([FromBody] PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                _logger.LogInformation("CallFromPortalByFlow method");
                var _emailSender = new EmailService(_emailConfig);
                var message = new MessageDto(new string[] { "-" }, "Supplier Details", portalToMsFlowDto.procesID, portalToMsFlowDto.supplierID, null, portalToMsFlowDto.command, "", "");

                //Non critical
                if (portalToMsFlowDto.workflowCurrentStatus == "SRM Approval" && portalToMsFlowDto.criticality < 5)
                {
                    if (portalToMsFlowDto.command == "Reject")
                    {
                        //call non- critical SRM approval
                        _emailSender.SendApprovalMSFlowNonCriticalGMVP(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "GM Approval" && portalToMsFlowDto.criticality < 5 && portalToMsFlowDto.supplierStatus != "Pending Criticality Matrix")
                {
                    if (portalToMsFlowDto.command == "Recommended" || portalToMsFlowDto.command == "Not Recommended")
                    {
                        //call non-critical GM approval
                        _emailSender.SendApprovalMSFlowNonCriticalGM(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "VP Approval" && portalToMsFlowDto.criticality < 5)
                {
                    if (portalToMsFlowDto.command == "Approve")
                    {
                        //call non-critical VP approval
                        _emailSender.SendApprovalMSFlowNonCriticalVP(message, portalToMsFlowDto);
                    }
                }

                //Critical
                else if (portalToMsFlowDto.workflowCurrentStatus == "SRM Approval" && (portalToMsFlowDto.criticality == 5 || portalToMsFlowDto.criticality == 6))
                {
                    if (portalToMsFlowDto.command == "Recommended" || portalToMsFlowDto.command == "Not Recommended")
                    {
                        //call critical SRM approval
                        _emailSender.SendApprovalMSFlowCriticalSRM(message, portalToMsFlowDto);
                    }
                    if (portalToMsFlowDto.command == "Reject")
                    {
                        //call non- critical SRM approval
                        _emailSender.SendApprovalMSFlowCriticalGMVP(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "GM Approval" && (portalToMsFlowDto.criticality == 5 || portalToMsFlowDto.criticality == 6) && portalToMsFlowDto.supplierStatus != "Pending Criticality Matrix")
                {
                    if (portalToMsFlowDto.command == "Recommended" || portalToMsFlowDto.command == "Not Recommended")
                    {
                        //call non-critical GM approval
                        _emailSender.SendApprovalMSFlowCriticalGM(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "VP Approval" && (portalToMsFlowDto.criticality == 5 || portalToMsFlowDto.criticality == 6))
                {
                    if (portalToMsFlowDto.command == "Approve")
                    {
                        //call non-critical VP approval
                        _emailSender.SendApprovalMSFlowCriticalVP(message, portalToMsFlowDto);
                    }
                }

                //High Critical
                else if (portalToMsFlowDto.workflowCurrentStatus == "SRM Approval" && portalToMsFlowDto.criticality > 6)
                {
                    if (portalToMsFlowDto.command == "Recommended" || portalToMsFlowDto.command == "Not Recommended")
                    {
                        //call critical SRM approval
                        _emailSender.SendApprovalMSFlowHighCriticalSRM(message, portalToMsFlowDto);
                    }
                    else if (portalToMsFlowDto.command == "Reject")
                    {
                        //call critical SRM approval(Rejected)
                        _emailSender.SendApprovalMSFlowHighCriticalGMVP(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "GM Approval" && portalToMsFlowDto.criticality > 6 && portalToMsFlowDto.supplierStatus != "Pending Criticality Matrix")
                {
                    if (portalToMsFlowDto.command == "Recommended" || portalToMsFlowDto.command == "Not Recommended")
                    {
                        //call non-critical GM approval
                        _emailSender.SendApprovalMSFlowHighCriticalGM(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "VP Approval" && portalToMsFlowDto.criticality > 6)
                {
                    if (portalToMsFlowDto.command == "Approve")
                    {
                        //call non-critical VP approval
                        _emailSender.SendApprovalMSFlowHighCriticalVP(message, portalToMsFlowDto);
                    }
                }

                //Bank 
                else if (portalToMsFlowDto.workflowCurrentStatus == "Treasurer Team Review" || (portalToMsFlowDto.workflowCurrentStatus == "Complete" && portalToMsFlowDto.role == "IMI-VP"))
                {
                    //call bank workflow treasure review
                    _emailSender.SendApprovalMSFlowBankTBR(message, portalToMsFlowDto);
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "Treasurer Review")
                {
                    if (portalToMsFlowDto.command == "Review Done")
                    {
                        //call bank approver
                        _emailSender.SendApprovalMSFlowBankTBA(message, portalToMsFlowDto);
                    }
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("msflowstepfromportal failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return false;
            }
        }

        // Call MS Flow approval for portal Emregency
        [HttpPost("CallFromPortalByFlowEmg")]
        public async Task<bool> CallFromPortalByFlowEmg([FromBody] PortalToMsFlowDto portalToMsFlowDto)
        {
            try
            {
                _logger.LogInformation("CallFromPortalByFlow method");
                var _emailSender = new EmailService(_emailConfig);
                var message = new MessageDto(new string[] { "-" }, "IMI-Supplier Details", portalToMsFlowDto.procesID, portalToMsFlowDto.supplierID, null, portalToMsFlowDto.command, "", "");

                //Non critical
                if (portalToMsFlowDto.workflowCurrentStatus == "SRM Approval" && portalToMsFlowDto.criticality < 5)
                {
                    if (portalToMsFlowDto.command == "Reject")
                    {
                        //call non- critical SRM approval
                        _emailSender.SendApprovalMSFlowEmergencySRM(message, portalToMsFlowDto);
                    }
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "GM Approval")
                {
                    _emailSender.SendApprovalMSFlowEmergencyGM(message, portalToMsFlowDto);
                }
                else if (portalToMsFlowDto.workflowCurrentStatus == "VP Approval")
                {
                    _emailSender.SendApprovalMSFlowEmergencyVP(message, portalToMsFlowDto);
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("msflowstepfromportal failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return false;
            }
        }

        // Send email to GM after VP rejection
        [HttpPost("vprejectgm")]
        public async Task<bool> sendMailToGMafterVPreject(string roleName, string supplierid, string content, string category, string recommendation, string outcome)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                SupplierDto supplier = _emailSender.GetSupplierDataForMSFlow(supplierid).Result.FirstOrDefault();

                var emaillist = _emailSender.GetWorkflowEmail(roleName);
                if (emaillist.Result == null)
                {
                    emaillist = _emailSender.GetWorkflowEmail(roleName);
                }

                /*
                for (int i = 0; i < emaillist.Result.Count; i++)
                {
                    var message = new MessageDto(new string[] { emaillist.Result[i] }, "IMI-VP Rejection of the Supplier Registration Request " + supplier.supplier_name, content, supplierid, null, category, recommendation, outcome);
                    _emailSender.SendEmail(message);
                } 
                */

                var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
                var message = new MessageDto(tolist, "IMI-VP Rejection of the Supplier Registration Request " + supplier.supplier_name, content, supplierid, null, category, recommendation, outcome);
                _emailSender.SendEmail(message);
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        //// Send email to SRM after VP approval
        //[HttpPost("vpapprovesrm")]
        //public async Task<bool> sendMailToSRMafterVPapprove(string roleName, string supplierid, string content, string category, string recommendation, string outcome)
        //{
        //    try
        //    {
        //        var _emailSender = new EmailService(_emailConfig);
        //        SupplierDto supplier = _emailSender.GetSupplierDataForMSFlow(supplierid).Result.FirstOrDefault();

        //        var emaillist = _emailSender.GetWorkflowEmail(roleName);
        //        if (emaillist.Result == null)
        //        {
        //            emaillist = _emailSender.GetWorkflowEmail(roleName);
        //        }

        //        var tolist = emaillist.Result.Select(i => i.ToString()).ToArray();
        //        var message = new MessageDto(tolist, "IMI-Supplier Registration Request Approved by VP-PSCM " + supplier.supplier_name, content, supplierid, null, category, recommendation, outcome);
        //        _emailSender.SendEmail(message);
        //    }
        //    catch (Exception ex)
        //    {
        //        return false;
        //    }
        //    return true;
        //}


        [HttpPost("reviewsApprovalMail")]
        public async Task<bool> sendReviewsApprovalMail(string supplierName, string period, string approverEmail, string approverName,
            string evaluationName, string reviewer, int reviewResponseId)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                var message = new MessageReviewApprovalDTO(approverEmail.Split(), supplierName, period, evaluationName, approverName, reviewer);

                ReviewTodoDto reviewTodo = new ReviewTodoDto();
                reviewTodo.id = 0;
                reviewTodo.actionType = "review approval";
                reviewTodo.status = "pending";
                reviewTodo.reviewResponseId = reviewResponseId;
                reviewTodo.actionTakerUsername = approverName;
                await _supplierData.SaveReviewTodo(reviewTodo);

                _emailSender.SendReviewApprovalEmail(message);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [HttpPost("reinitiationReviewerEmail")]
        public async Task<bool> sendReinitiationReviewerMail(string supplierName, string period, string reviewer, string ccReceiverEmails, string evaluationName, int reviewResponseId, string comment)
        {
            try
            {

                var _emailSender = new EmailService(_emailConfig);
                List<string> emailList = new List<string>();
               
                var tempEmailList = _emailSender.GetWorkflowUsersEmail(reviewer);
                if (tempEmailList.Result == null)
                {
                    tempEmailList = _emailSender.GetWorkflowUsersEmail(reviewer);

                }
                var tolist = tempEmailList.Result.Select(i => i.ToString()).ToArray();
                emailList.AddRange(tolist);
                var ccList = ccReceiverEmails.Split(',').Except(emailList);
                var message = new MessageReviewReinitiationDTO(emailList, ccList, supplierName, period,
                    reviewer, evaluationName, comment);

                ReviewTodoDto reviewTodo = new ReviewTodoDto();
                reviewTodo.actionType = "supplier reviewal";
                reviewTodo.status = "pending";
                reviewTodo.actionTakerUsername = reviewer;
                reviewTodo.reviewResponseId = reviewResponseId;
                await _supplierData.SaveReviewTodo(reviewTodo);


                _emailSender.SendReviewReinitiationEmail(message);
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [HttpPost("rejectionReviewerEmail")]
        public async Task<bool> sendRejectionReviewerMail(string supplierName, string period, string reviewer, string ccReceiverEmails, string evaluationName, string comment)
        {
            try
            {

                var _emailSender = new EmailService(_emailConfig);
                List<string> emailList = new List<string>();

                var tempEmailList = _emailSender.GetWorkflowUsersEmail(reviewer);
                if (tempEmailList.Result == null)
                {
                    tempEmailList = _emailSender.GetWorkflowUsersEmail(reviewer);

                }
                var tolist = tempEmailList.Result.Select(i => i.ToString()).ToArray();
                emailList.AddRange(tolist);
                var ccList = ccReceiverEmails.Split(',').Except(emailList);
                var message = new MessageReviewRejectionDTO(emailList, ccList, supplierName, period, reviewer, evaluationName, comment);

                _emailSender.SendRejectionReviewerMail(message);
                return true;

            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [HttpPost("responseReceivedMail")]
        public async Task<bool> sendResponseReceivedMail(string supplierName, string period, string reviewer, string sessionCreator, string evaluationName)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                List<string> emailList = new List<string>();

                var tempEmailList = _emailSender.GetWorkflowUsersEmail(sessionCreator);
                if (tempEmailList.Result == null)
                {
                    tempEmailList = _emailSender.GetWorkflowUsersEmail(sessionCreator);

                }
                var tolist = tempEmailList.Result.Select(i => i.ToString()).ToArray();
                emailList.AddRange(tolist);
                var message = new MessageResponseReceivedDTO(emailList, supplierName, period, reviewer, evaluationName, sessionCreator);
                _emailSender.SendResponseReceivedEmail(message);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

        [HttpPost("supplierReviewCompleteMail")]
        public async Task<bool> sendSupplierReviewCompleteMail(string supplierEmail, string period, string reviewScore, string evaluationName, string reviewOutcome)
        {
            try
            {
                var _emailSender = new EmailService(_emailConfig);
                List<string> emailList = new List<string>();
                emailList.Add(supplierEmail);
                var message = new MessageSupplierReviewCompletedDto(emailList, period, evaluationName, reviewScore, reviewOutcome);
                _emailSender.SendSupplierReviewCompleteMail(message);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
            return true;
        }

    }
}
