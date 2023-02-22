using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SRMDomain.Data;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SRM.Controllers
{
    [Route("api/file")]
    public class FileController : Controller
    {

        private IConfiguration Configuration;
        private readonly ILogger<FileController> _logger;
        private string baseLocation = Directory.GetCurrentDirectory();
        public FileController(IConfiguration _configuration, ILogger<FileController> logger)
        {
            Configuration = _configuration;
            _logger = logger;
        }

        [HttpPost("save")]
        public async Task<bool> SaveFile([FromBody] FileDto file)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.SaveFile(file);
            return result;
        }

        [HttpGet("byid")]
        public async Task<FileDto> GetById([FromQuery] int id)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.GetFilebyId(id);
            return result;
        }

        [HttpGet("bySupplier")]
        public async Task<IList<FileDto>> GetBySupplier([FromQuery] int id)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.GetFileBySupplier(id);
            return result;
        }

        [HttpPost("tempsave")]
        public async Task<bool> SavetempFile([FromBody] FileDto file)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.SaveFile(file);
            return result;
        }

        [HttpGet("tempbyid")]
        public async Task<FileDto> GetTempById([FromQuery] int id)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.GetFilebyId(id);
            return result;
        }

        [HttpGet("tempbySupplier")]
        public async Task<IList<FileDto>> GetTempBySupplier([FromQuery] int id)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.GetFileBySupplier(id);
            return result;
        }

        [HttpPost("sitesave")]
        public async Task<bool> SaveSiteAuditFile([FromBody] FileDto file)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.SaveSiteAuditFile(file);
            return result;
        }

        [HttpGet("siteauditbyid")]
        public async Task<FileDto> GetSiteAuditFilebyId([FromQuery] int id)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.GetSiteAuditFilebyId(id);
            return result;
        }

        [HttpGet("siteauditbysupplier")]
        public async Task<IList<FileDto>> GetSiteAuditFileBySupplier([FromQuery] int id)
        {
            var _fileData = new FileData(Configuration);
            var _fileService = new FileService(_fileData);
            var result = await _fileService.GetSiteAuditFileBySupplier(id);
            return result;
        }

        [HttpGet("getNeedmorePhotos")]
        public async Task<IActionResult> GetNeedmorePhotos()
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/Images");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                var photos = Directory.EnumerateFiles(folderName)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getAuthToken")]
        public async Task<IActionResult> GetAuthToken()
        {

            try {
                var url = "https://dev-ay82ezuy.us.auth0.com/oauth/token";

                var httpRequest = (System.Net.HttpWebRequest)WebRequest.Create(url);
                httpRequest.Method = "POST";

                httpRequest.Headers["content-type"] = "application/json";

                var data = "{\"client_id\":\"OgkcSQ7ZYMva3RqrD71tFItYzVp6hWOM\",\"client_secret\":\"TLpXFHq0D7GG6KwIGrdO2VWU-HFTRDVrk-DZQDg0yx_Emx5Z1ZtxrJVrVWal3ksp\",\"audience\":\"https://dev-ay82ezuy.us.auth0.com/api/v2/\",\"grant_type\":\"client_credentials\"}";

                using (var streamWriter = new StreamWriter(httpRequest.GetRequestStream()))
                {
                    streamWriter.Write(data);
                }

                var httpResponse = (HttpWebResponse)httpRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    var result = streamReader.ReadToEnd();
                    return Ok(new { result });

                //return result;

                }
            } catch (Exception ex) {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
            //Console.WriteLine(httpResponse.StatusCode);


        }

        [HttpGet("getRegisteredPhotos")]
        public  IActionResult getRegisteredPhotos([FromQuery] string supId)
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/SupplierRegistration");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                string filesToFind = @"*" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getDraftPhotos")]
        public async Task<IActionResult> GetDraftPhotos([FromQuery] string supId)
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/Temp");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                string filesToFind = @"" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getPhotosById")]
        public async Task<IActionResult> GetPhotosById([FromQuery] string supId)
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/Images");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                string filesToFind = @"" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getPhotos")]
        public async Task<IActionResult> GetPhotos()
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/Images");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                var photos = Directory.EnumerateFiles(folderName)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        private bool IsAPhotoFile(string fileName)
        {
            return fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".txt", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".tex", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".text", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".doc", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xpd", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".rtf", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".ods", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".odt", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xlsm", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xls", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".svg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".tif", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".tiff", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".gif", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".bmp", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xhtml", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".html", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".key", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".odp", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".pptx", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".pps", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".emz", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".ppt", StringComparison.OrdinalIgnoreCase);

        }

        [HttpGet]
        [Route("movefiles")]
        public async Task<IActionResult> Movefiles([FromQuery] string tempId, string registerId)
        {

            string oldSupplierName = "5_r1";
            string newSupplierName = "12_q1";



            var folderName = Path.Combine("D:/Resources/Temp");
            var pathToRead = Path.Combine(folderName);

            var photos = Directory.EnumerateFiles(folderName)
                .Where(IsAPhotoFile)
                .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));


            Console.WriteLine("Whole photo: ", photos);
            /*
            foreach (var photo in photos)
            {
                /
                Console.WriteLine("Photo is: ", photo);
                if (photo.Contains("1200_")){
                    string test = photo;
                    Console.WriteLine("YES", test);
                } else {

                }
            }*/

            string sourceDirectory = @"D:\Resources\Temp";
            string archiveDirectory = @"D:\Resources\Images";

            /*string tempId = "1200";
            string registerId = "700";*/

            string searchTag = tempId + "_*";

            string oldName = tempId + "_";
            string newName = registerId + "_";
            try
            {
                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                    fileName = fileName.Replace(oldName, newName);

                    Directory.Move(currentFile, Path.Combine(archiveDirectory, fileName));
                    Console.WriteLine("File name: ", fileName);

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }


            /* Start File Migration */
            /*string path = @"D:\Resources\Temp1\files_DONE";
            string path2 = @"D:\Resources\Images1\files_DONE_123";

            try
            {
                if (!System.IO.File.Exists(path))
                {
                    // This statement ensures that the file is created,
                    // but the handle is not kept.
                    using (FileStream fs = System.IO.File.Create(path)) { }
                }

                // Ensure that the target does not exist.
                if (System.IO.File.Exists(path2))
                    System.IO.File.Delete(path2);

                // Move the file.
                System.IO.File.Move(path, path2);z
                Console.WriteLine("{0} was moved to {1}.", path, path2);

                // See if the original exists now.
                if (System.IO.File.Exists(path))
                {
                    Console.WriteLine("The original file still exists, which is unexpected.");
                }
                else
                {
                    Console.WriteLine("The original file no longer exists, which is expected.");
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("The process faileD: {0}", e.ToString());
            }*/




            return Ok(new { photos });
        }

        [HttpGet]
        [Route("moveemgfiles")]
        public async Task<IActionResult> MoveEmergfiles([FromQuery] string tempId, string registerId, string both,string cat)
        {
            var folderName = Path.Combine("D:/Resources/EmergencySupplierDocs");
            var photos = Directory.EnumerateFiles(folderName)
                .Where(IsAPhotoFile)
                .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

            string sourceDirectory = @"D:\Resources\EmergencySupplierDocs";
            string targetPath = @"D:\Resources\Images";

            string searchTag = tempId + "_*";


            if (cat == "temp")
            {
                 targetPath = @"D:\Resources\Temp";
            }
            else
            {
                 targetPath = @"D:\Resources\Images";
            }

            try
            {

                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                    if (fileName.Contains("Reg"))
                    {
                        fileName = fileName.Replace("Reg", "r1");
                        fileName = fileName.Replace(tempId + "_", registerId + "_");

                        string sourceFile = System.IO.Path.Combine(sourceDirectory, currentFile);
                        string destFile = System.IO.Path.Combine(targetPath, fileName);

                        System.IO.File.Copy(sourceFile, destFile, true);
                    }

                    if (both == "true" && fileName.Contains("Vat"))
                    {
                        string fileNamevat = currentFile.Substring(sourceDirectory.Length + 1);

                        fileNamevat = fileNamevat.Replace("Vat", "v1");
                        fileNamevat = fileNamevat.Replace(tempId + "_", registerId + "_");

                        string sourceFile = System.IO.Path.Combine(sourceDirectory, currentFile);
                        string destFile = System.IO.Path.Combine(targetPath, fileNamevat);

                        System.IO.File.Copy(sourceFile, destFile, true);
                    }

                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return Ok(new { photos });
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("DownloadRegisterCopy")]
        public async Task<IActionResult> DownloadRegisterCopy([FromQuery] string fileUrl)
        {
            var filePath = Path.Combine("D:/Resources/SupplierRegistration", fileUrl);
            var fileName = "SupplierRegistrationCopy_" + fileUrl;

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("download")]
        public async Task<IActionResult> Download([FromQuery] string fileUrl)
        {
            var fileName = "";
            var filePath = Path.Combine("D:/Resources/Images", fileUrl);

            if (fileUrl.Contains("r1"))
            {
                fileName = "RegistrationLicenseCertificate_" + fileUrl;
            }

            if (fileUrl.Contains("v1"))
            {
                fileName = "VatRegistration_" + fileUrl;
            }

            if (fileUrl.Contains("s1"))
            {
                fileName = "SaudizationCertificate_" + fileUrl;
            }

            if (fileUrl.Contains("g1"))
            {
                fileName = "GOSICertificate_" + fileUrl;
            }

            if (fileUrl.Contains("z1"))
            {
                fileName = "Zakath_Certificate_" + fileUrl;
            }

            if (fileUrl.Contains("a1"))
            {
                fileName = "Association_Certificate_" + fileUrl;
            }

            if (fileUrl.Contains("a2"))
            {
                fileName = "Additional_Attachment1_" + fileUrl;
            }

            if (fileUrl.Contains("a3"))
            {
                fileName = "Additional_Attachment2_" + fileUrl;
            }

            if (fileUrl.Contains("a4"))
            {
                fileName = "Additional_Attachment3_" + fileUrl;
            }

            if (fileUrl.Contains("a5"))
            {
                fileName = "Additional_Attachment4_" + fileUrl;
            }

            if (fileUrl.Contains("a6"))
            {
                fileName = "Additional_Attachment5_" + fileUrl;
            }

            if (fileUrl.Contains("m1"))
            {
                fileName = "OrgaizationChart_" + fileUrl;
            }

            if (fileUrl.Contains("f1"))
            {
                fileName = "FinancialYear1_" + fileUrl;
            }

            if (fileUrl.Contains("f2"))
            {
                fileName = "FinancialYear2_" + fileUrl;
            }

            if (fileUrl.Contains("f3"))
            {
                fileName = "FinancialYear3_" + fileUrl;
            }

            if (fileUrl.Contains("e1"))
            {
                fileName = "OrganizationDesignCapability_" + fileUrl;
            }

            if (fileUrl.Contains("e2"))
            {
                fileName = "FinishedProductProcess_" + fileUrl;
            }

            if (fileUrl.Contains("e3"))
            {
                fileName = "ThirdPartyCertifyingBody_" + fileUrl;
            }

            if (fileUrl.Contains("e4"))
            {
                fileName = "BusinessReferences_" + fileUrl;
            }

            if (fileUrl.Contains("e5"))
            {
                fileName = "PreventionOfCorruption_" + fileUrl;
            }

            if (fileUrl.Contains("h1"))
            {
                fileName = "HseWrittenPolicy_" + fileUrl;
            }

            if (fileUrl.Contains("h2"))
            {
                fileName = "HseManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h3"))
            {
                fileName = "SafetyManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h4"))
            {
                fileName = "EnvironManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h6"))
            {
                fileName = "StatisticsDocument_" + fileUrl;
            }

            if (fileUrl.Contains("q1"))
            {
                fileName = "QualityPolicyDocument_" + fileUrl;
            }

            if (fileUrl.Contains("q2"))
            {
                fileName = "QualityManagementSystem_" + fileUrl;
            }

            if (fileUrl.Contains("q3"))
            {
                fileName = "QMSISODocument_" + fileUrl;
            }

            if (fileUrl.Contains("b1"))
            {
                fileName = "BankLetter_" + fileUrl;
            }

            if (fileUrl.Contains("b2"))
            {
                fileName = "BankLetterWithCompanyLetterHead_" + fileUrl;
            }

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadDraft")]
        public async Task<IActionResult> DownloadDraft([FromQuery] string fileUrl)
        {
            var fileName = "";
            var filePath = Path.Combine("D:/Resources/Temp", fileUrl);

            if (fileUrl.Contains("r1"))
            {
                fileName = "RegistrationLicenseCertificate_" + fileUrl;
            }

            if (fileUrl.Contains("v1"))
            {
                fileName = "VatRegistration_" + fileUrl;
            }

            if (fileUrl.Contains("s1"))
            {
                fileName = "SaudizationCertificate_" + fileUrl;
            }

            if (fileUrl.Contains("g1"))
            {
                fileName = "GOSICertificate_" + fileUrl;
            }

            if (fileUrl.Contains("z1"))
            {
                fileName = "Zakath_Certificate_" + fileUrl;
            }

            if (fileUrl.Contains("a1"))
            {
                fileName = "Association_Certificate_" + fileUrl;
            }

            if (fileUrl.Contains("a2"))
            {
                fileName = "Additional_Attachment1" + fileUrl;
            }

            if (fileUrl.Contains("a3"))
            {
                fileName = "Additional_Attachment2" + fileUrl;
            }

            if (fileUrl.Contains("a4"))
            {
                fileName = "Additional_Attachment3" + fileUrl;
            }

            if (fileUrl.Contains("a5"))
            {
                fileName = "Additional_Attachment4" + fileUrl;
            }

            if (fileUrl.Contains("a6"))
            {
                fileName = "Additional_Attachment5" + fileUrl;
            }

            if (fileUrl.Contains("m1"))
            {
                fileName = "OrgaizationChart_" + fileUrl;
            }

            if (fileUrl.Contains("f1"))
            {
                fileName = "FinancialYear1_" + fileUrl;
            }

            if (fileUrl.Contains("f2"))
            {
                fileName = "FinancialYear2_" + fileUrl;
            }

            if (fileUrl.Contains("f3"))
            {
                fileName = "FinancialYear3_" + fileUrl;
            }

            if (fileUrl.Contains("e1"))
            {
                fileName = "OrganizationDesignCapability_" + fileUrl;
            }

            if (fileUrl.Contains("e2"))
            {
                fileName = "FinishedProductProcess_" + fileUrl;
            }

            if (fileUrl.Contains("e3"))
            {
                fileName = "ThirdPartyCertifyingBody_" + fileUrl;
            }

            if (fileUrl.Contains("e4"))
            {
                fileName = "BusinessReferences_" + fileUrl;
            }

            if (fileUrl.Contains("e5"))
            {
                fileName = "PreventionOfCorruption_" + fileUrl;
            }

            if (fileUrl.Contains("h1"))
            {
                fileName = "HseWrittenPolicy_" + fileUrl;
            }

            if (fileUrl.Contains("h2"))
            {
                fileName = "HseManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h3"))
            {
                fileName = "SafetyManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h4"))
            {
                fileName = "EnvironManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h6"))
            {
                fileName = "StatisticsDocument_" + fileUrl;
            }

            if (fileUrl.Contains("q1"))
            {
                fileName = "QualityPolicyDocument_" + fileUrl;
            }

            if (fileUrl.Contains("q2"))
            {
                fileName = "QualityManagementSystem_" + fileUrl;
            }

            if (fileUrl.Contains("q3"))
            {
                fileName = "QMSISODocument_" + fileUrl;
            }

            if (fileUrl.Contains("b1"))
            {
                fileName = "BankLetter_" + fileUrl;
            }

            if (fileUrl.Contains("b2"))
            {
                fileName = "BankLetterWithCompanyLetterHead_" + fileUrl;
            }

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadNeedmore")]
        public async Task<IActionResult> DownloadNeedmore([FromQuery] string fileUrl, [FromQuery] bool isNew = false)
        {
            var fileName = "";
            var filePath = isNew ? Path.Combine("D:/Resources/Images/New", fileUrl) : Path.Combine("D:/Resources/Images", fileUrl);
            fileUrl = isNew ? "New_" + fileUrl : fileUrl;

            if (fileUrl.Contains("r1"))
            {
                fileName = "RegistrationLicenseCertificate_" + fileUrl;
            }

            if (fileUrl.Contains("v1"))
            {
                fileName = "VatRegistration_" + fileUrl;
            }

            if (fileUrl.Contains("s1"))
            {
                fileName = "SaudizationCertificate_" + fileUrl;
            }

            if (fileUrl.Contains("g1"))
            {
                fileName = "GOSICertificate_" + fileUrl;
            }

            if (fileUrl.Contains("z1"))
            {
                fileName = "Zakath_Certificate_" + fileUrl;
            }

            if (fileUrl.Contains("a1"))
            {
                fileName = "Association_Certificate_" + fileUrl;
            }

            if (fileUrl.Contains("a2"))
            {
                fileName = "Additional_Attachment1" + fileUrl;
            }

            if (fileUrl.Contains("a3"))
            {
                fileName = "Additional_Attachment2" + fileUrl;
            }

            if (fileUrl.Contains("a4"))
            {
                fileName = "Additional_Attachment3" + fileUrl;
            }

            if (fileUrl.Contains("a5"))
            {
                fileName = "Additional_Attachment4" + fileUrl;
            }

            if (fileUrl.Contains("a6"))
            {
                fileName = "Additional_Attachment5" + fileUrl;
            }

            if (fileUrl.Contains("m1"))
            {
                fileName = "OrgaizationChart_" + fileUrl;
            }

            if (fileUrl.Contains("f1"))
            {
                fileName = "FinancialYear1_" + fileUrl;
            }

            if (fileUrl.Contains("f2"))
            {
                fileName = "FinancialYear2_" + fileUrl;
            }

            if (fileUrl.Contains("f3"))
            {
                fileName = "FinancialYear3_" + fileUrl;
            }

            if (fileUrl.Contains("e1"))
            {
                fileName = "OrganizationDesignCapability_" + fileUrl;
            }

            if (fileUrl.Contains("e2"))
            {
                fileName = "FinishedProductProcess_" + fileUrl;
            }

            if (fileUrl.Contains("e3"))
            {
                fileName = "ThirdPartyCertifyingBody_" + fileUrl;
            }

            if (fileUrl.Contains("e4"))
            {
                fileName = "BusinessReferences_" + fileUrl;
            }

            if (fileUrl.Contains("e5"))
            {
                fileName = "PreventionOfCorruption_" + fileUrl;
            }

            if (fileUrl.Contains("h1"))
            {
                fileName = "HseWrittenPolicy_" + fileUrl;
            }

            if (fileUrl.Contains("h2"))
            {
                fileName = "HseManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h3"))
            {
                fileName = "SafetyManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h4"))
            {
                fileName = "EnvironManagementDocument_" + fileUrl;
            }

            if (fileUrl.Contains("h6"))
            {
                fileName = "StatisticsDocument_" + fileUrl;
            }

            if (fileUrl.Contains("q1"))
            {
                fileName = "QualityPolicyDocument_" + fileUrl;
            }

            if (fileUrl.Contains("q2"))
            {
                fileName = "QualityManagementSystem_" + fileUrl;
            }

            if (fileUrl.Contains("q3"))
            {
                fileName = "QMSISODocument_" + fileUrl;
            }

            if (fileUrl.Contains("b1"))
            {
                fileName = "BankLetter_" + fileUrl;
            }

            if (fileUrl.Contains("b2"))
            {
                fileName = "BankLetterWithCompanyLetterHead_" + fileUrl;
            }

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        private string GetContentType(string path)
        {
            var provider = new FileExtensionContentTypeProvider();
            string contentType;

            if (!provider.TryGetContentType(path, out contentType))
            {
                contentType = "application/octet-stream";
            }

            return contentType;
        }

        [HttpPost("uploadTemp")]
        public async Task<IActionResult> UploadTemp([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;
                var checkDocType = files[0].FileName;

                // file.FileName
                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Temp");
                /*Console.WriteLine("folder name : "+ folderName);*/
                //var supId = "5";
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                // var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathToSave = Path.Combine("D:/Resources/Temp");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                // Delete existing files
                string rootFolderPath = @"D:\\Resources\\Temp";

                if (checkDocType.Contains("_r1") == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_r1*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a1") == true)
                {
                    string filesToDelete_a1 = @"*" + supplierid + "_a1*";
                    string[] fileList_a1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a1);
                    foreach (string file in fileList_a1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a2") == true)
                {
                    string filesToDelete_a2 = @"*" + supplierid + "_a2*";
                    string[] fileList_a2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a2);
                    foreach (string file in fileList_a2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a3") == true)
                {
                    string filesToDelete_a3 = @"*" + supplierid + "_a3*";
                    string[] fileList_a3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a3);
                    foreach (string file in fileList_a3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a4") == true)
                {
                    string filesToDelete_a4 = @"*" + supplierid + "_a4*";
                    string[] fileList_a4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a4);
                    foreach (string file in fileList_a4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a5") == true)
                {
                    string filesToDelete_a5 = @"*" + supplierid + "_a5*";
                    string[] fileList_a5 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a5);
                    foreach (string file in fileList_a5)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a6") == true)
                {
                    string filesToDelete_a6 = @"*" + supplierid + "_a6*";
                    string[] fileList_a6 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a6);
                    foreach (string file in fileList_a6)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_b1") == true)
                {
                    string filesToDelete_b1 = @"*" + supplierid + "_b1*";
                    string[] fileList_b1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_b1);
                    foreach (string file in fileList_b1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_b2") == true)
                {
                    string filesToDelete_b2 = @"*" + supplierid + "_b2*";
                    string[] fileList_b2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_b2);
                    foreach (string file in fileList_b2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e1") == true) 
                {
                    string filesToDelete_e1 = @"*" + supplierid + "_e1*";
                    string[] fileList_e1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e1);
                    foreach (string file in fileList_e1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e2") == true) 
                {
                    string filesToDelete_e2 = @"*" + supplierid + "_e2*";
                    string[] fileList_e2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e2);
                    foreach (string file in fileList_e2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e3") == true)
                {
                    string filesToDelete_e3 = @"*" + supplierid + "_e3*";
                    string[] fileList_e3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e3);
                    foreach (string file in fileList_e3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e4") == true)
                {
                    string filesToDelete_e4 = @"*" + supplierid + "_e4*";
                    string[] fileList_e4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e4);
                    foreach (string file in fileList_e4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e5") == true)
                {
                    string filesToDelete_e5 = @"*" + supplierid + "_e5*";
                    string[] fileList_e5 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e5);
                    foreach (string file in fileList_e5)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f1") == true)
                {
                    string filesToDelete_f1 = @"*" + supplierid + "_f1*";
                    string[] fileList_f1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f1);
                    foreach (string file in fileList_f1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f2") == true)
                {
                    string filesToDelete_f2 = @"*" + supplierid + "_f2*";
                    string[] fileList_f2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f2);
                    foreach (string file in fileList_f2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f3") == true)
                {
                    string filesToDelete_f3 = @"*" + supplierid + "_f3*";
                    string[] fileList_f3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f3);
                    foreach (string file in fileList_f3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_g1") == true)
                {
                    string filesToDelete_g1 = @"*" + supplierid + "_g1*";
                    string[] fileList_g1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_g1);
                    foreach (string file in fileList_g1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h1") == true)
                {
                    string filesToDelete_h1 = @"*" + supplierid + "_h1*";
                    string[] fileList_h1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h1);
                    foreach (string file in fileList_h1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h2") == true)
                {
                    string filesToDelete_h2 = @"*" + supplierid + "_h2*";
                    string[] fileList_h2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h2);
                    foreach (string file in fileList_h2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h3") == true)
                {
                    string filesToDelete_h3 = @"*" + supplierid + "_h3*";
                    string[] fileList_h3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h3);
                    foreach (string file in fileList_h3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h4") == true)
                {
                    string filesToDelete_h4 = @"*" + supplierid + "_h4*";
                    string[] fileList_h4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h4);
                    foreach (string file in fileList_h4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h6") == true)
                {
                    string filesToDelete_h6 = @"*" + supplierid + "_h6*";
                    string[] fileList_h6 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h6);
                    foreach (string file in fileList_h6)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_m1") == true)
                {
                    string filesToDelete_m1 = @"*" + supplierid + "_m1*";
                    string[] fileList_m1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_m1);
                    foreach (string file in fileList_m1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q1") == true)
                {
                    string filesToDelete_q1 = @"*" + supplierid + "_q1*";
                    string[] fileList_q1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q1);
                    foreach (string file in fileList_q1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q2") == true)
                {
                    string filesToDelete_q2 = @"*" + supplierid + "_q2*";
                    string[] fileList_q2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q2);
                    foreach (string file in fileList_q2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q3") == true)
                {
                    string filesToDelete_q3 = @"*" + supplierid + "_q3*";
                    string[] fileList_q3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q3);
                    foreach (string file in fileList_q3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_s1") == true)
                {
                    string filesToDelete_s1 = @"*" + supplierid + "_s1*";
                    string[] fileList_s1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_s1);
                    foreach (string file in fileList_s1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_v1") == true)
                {
                    string filesToDelete_v1 = @"*" + supplierid + "_v1*";
                    string[] fileList_v1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_v1);
                    foreach (string file in fileList_v1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_z1") == true)
                {
                    string filesToDelete_z1 = @"*" + supplierid + "_z1*";
                    string[] fileList_z1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_z1);
                    foreach (string file in fileList_z1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, supId + fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("uploadFileQueueTemp")]
        public async Task<ActionResult> UploadFileQueueTemp(List<IFormFile> certificates, string supplierid, string email, string[] filenames, string emgsupplierid,  string isEmergency, string bothselected, string fileToRemove, string autosave)
        {
            /*if (certificates == null || certificates.Count == 0)
            {
                return BadRequest("No file is uploaded.");
            }*/
            if (isEmergency == "true")
            {
                await MoveEmergfiles(emgsupplierid, supplierid, bothselected, "temp");
            }
            var folderName = Path.Combine("Resources", "Temp");
            var pathToSave = Path.Combine("D:/Resources/Temp");
            string rootFolderPath = @"D:\\Resources\\Temp";

            if (fileToRemove == "h6")
            {
                string filesToDelete_h6 = @"*" + supplierid + "_" + "h6" + "*";
                string[] fileList_h6 = System.IO.Directory.GetFiles(pathToSave, filesToDelete_h6);

                foreach (string file in fileList_h6)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }
            }

            foreach (var certificate in certificates)
            {
                var fileName = ContentDispositionHeaderValue.Parse(certificate.ContentDisposition).FileName.Trim('"');
                var tagname = fileName.Split("_").Last(); // r1.pdf
                tagname = tagname.Split(".").First();
                if (fileName.Contains(tagname) == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_" + tagname + "*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(pathToSave, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                var fullPath = Path.Combine(rootFolderPath, supplierid + fileName);
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    certificate.CopyTo(stream);
                }
            }

            if(autosave== "false")
            {
                var _emailConfig = Configuration.GetSection("EmailConfiguration").Get<EmailConfigDto>();
                var _emailSender = new EmailService(_emailConfig);
                //var message = new MessageDto(new string[] { email }, "IMI-Application draft Saved", "", supplierid, null, "draft", "", "");
                var message = new MessageDto(new string[] { email }, "IMI-Application draft Saved", "", supplierid, null, "draft", "", "", new string[] { "sooae.cho@imi-ksa.com" });
                _emailSender.SendEmail(message);
            }
            
            return Ok();
        }

        [HttpPost("uploadFileQueueSubmit")]
        [DisableRequestSizeLimit]
        public async Task<ActionResult> UploadFileQueueSubmit(List<IFormFile> certificates, string supplierid, string email, int oldsupplierId, string isneedmore, string needmorerole, int rejectedsupplierid, string istempfile, string isEmergency, string bothselected, bool isSupplierPortalUser = false)
        {
            /*if (certificates == null || certificates.Count == 0)
            {
                return BadRequest("No file is uploaded.");
            }*/
            var oldsupplieridnum = (oldsupplierId != null && oldsupplierId != 0 && oldsupplierId > 0) ? Convert.ToInt32(oldsupplierId) : 0;
            var rejectedsupplieridnum = (rejectedsupplierid != null && rejectedsupplierid != 0) ? Convert.ToInt32(rejectedsupplierid) : 0;
            //var oldsupplieridnum = 0;
            //var rejectedsupplieridnum = 0;
            if (isEmergency == "true")
            {
                await MoveEmergfiles(oldsupplierId.ToString(), supplierid, bothselected, "reg");
            } 
            if (istempfile == "true")
            {
                await Movefiles(oldsupplierId.ToString(), supplierid);
            } 
            if (rejectedsupplieridnum > 0 )
            {
                if (istempfile == "true")
                {
                    await Movefiles(oldsupplierId.ToString(), supplierid);
                } else if (istempfile == "false")
                {
                    await moverejectedfiles(rejectedsupplierid.ToString(), supplierid, "reg");
                }
            }
            var rootFolderPath = @"D:\\Resources\\Images";
            var folderName = Path.Combine("Resources", "Images");
            var pathToSave = Path.Combine("D:/Resources/Images");
            foreach (var certificate in certificates)
            {
                var fileName = ContentDispositionHeaderValue.Parse(certificate.ContentDisposition).FileName.Trim('"');
                var fullPath = isSupplierPortalUser ? Path.Combine(rootFolderPath, "New" , supplierid + fileName) : Path.Combine(rootFolderPath, supplierid + fileName);
                var tagname = fileName.Split("_").Last(); // r1.pdf
                tagname = tagname.Split(".").First();
                if (fileName.Contains(tagname) == true && !isSupplierPortalUser)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_" + tagname + "*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(pathToSave, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    certificate.CopyTo(stream);
                }
            }
            var _emailConfig = Configuration.GetSection("EmailConfiguration").Get<EmailConfigDto>();
            var _emailSender = new EmailService(_emailConfig);
                if (isneedmore == "true" && needmorerole != "" && needmorerole != null && rejectedsupplieridnum == 0)
                {
                    var message = new MessageDto(new string[] { email }, "IMI-Updated Registration Submitted For Approval", "", supplierid, null, "moreinfoupdate", "", "");
                    _emailSender.SendEmail(message);
                    await sendNeedMoreRoleMail(needmorerole, supplierid, "updated", "needmoreupdated");
                }
                else if(isneedmore != "true")
                {
                    var message = new MessageDto(new string[] { email }, "IMI-Thank you for submitting your supplier registration request", "", supplierid, null, "register", "", "");
                    _emailSender.SendEmail(message);
                    if ( isneedmore == "false" || (isneedmore == "true" && rejectedsupplieridnum > 0)) {
                        await sendSrmMail("IMI-SRM Analyst", supplierid, "new", "srm");
                    }
                }
            return Ok();
        }

        [HttpPost("uploadFileQueueEmergency")]
        public async Task<ActionResult> UploadFileQueueEmergency(List<IFormFile> certificates, string supplierid, string email, string processid)
        {
            var rootFolderPath = @"D:\\Resources\\EmergencySupplierDocs";
            var folderName = Path.Combine("Resources", "EmergencySupplierDocs");
            var pathToSave = Path.Combine("D:/Resources/EmergencySupplierDocs");
            foreach (var certificate in certificates)
            {
                var fileName = ContentDispositionHeaderValue.Parse(certificate.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(rootFolderPath, supplierid + fileName);
                var tagname = fileName.Split("_").Last(); // r1.pdf
                tagname = tagname.Split(".").First();
                if (fileName.Contains(tagname) == true)
                {
                    string filesToDelete = @"*" + supplierid + "_" + tagname + "*";
                    string[] fileList = System.IO.Directory.GetFiles(pathToSave, filesToDelete);
                    foreach (string file in fileList)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    certificate.CopyTo(stream);
                }
            }

            await sendEmgworkflowmail("IMI-GM", supplierid, processid, "emggmattachement");

            //this.http.post<any>(environment.nodeurl + '/api/email/sendEmgworkflowmail?roleName=IMI-GM&supplierid=' + this.supplier_ID + '&content=' + this.processid + '&category=emggmattachement', null).subscribe(data => {});
            return Ok();
        }

        // Emergency Supplier's Files
        [HttpPost("uploadFiles")]
        public async Task<IActionResult> UploadFiles([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;
                var checkDocType = files[0].FileName;

                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "EmergencySupplierDocs");
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");
                _logger.LogInformation("upload start before pathToSave");


                var pathToSave = Path.Combine("D:/Resources/EmergencySupplierDocs");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                // Delete existing files
                string rootFolderPath = @"D:\\Resources\\EmergencySupplierDocs";

                if (checkDocType.Contains("_Evi") == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_Evi*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_Reg") == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_Reg*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_Vat") == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_Vat*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, supId + fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        public async Task<bool> sendEmgworkflowmail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailConfig = Configuration.GetSection("EmailConfiguration").Get<EmailConfigDto>();
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

        public async Task<bool> sendSrmMail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfigDto>();
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

        public async Task<bool> sendNeedMoreRoleMail(string roleName, string supplierid, string content, string category)
        {
            try
            {
                var _emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfigDto>();
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


        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;
                var checkDocType = files[0].FileName;

                // file.FileName
                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Images");
                /*Console.WriteLine("folder name : "+ folderName);*/
                //var supId = "5";
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                // var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathToSave = Path.Combine("D:/Resources/Images");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                // Delete existing files
                string rootFolderPath = @"D:\\Resources\\Images";

                if (checkDocType.Contains("_r1") == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_r1*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a1") == true)
                {
                    string filesToDelete_a1 = @"*" + supplierid + "_a1*";
                    string[] fileList_a1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a1);
                    foreach (string file in fileList_a1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a2") == true)
                {
                    string filesToDelete_a2 = @"*" + supplierid + "_a2*";
                    string[] fileList_a2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a2);
                    foreach (string file in fileList_a2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a3") == true)
                {
                    string filesToDelete_a3 = @"*" + supplierid + "_a3*";
                    string[] fileList_a3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a3);
                    foreach (string file in fileList_a3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a4") == true)
                {
                    string filesToDelete_a4 = @"*" + supplierid + "_a4*";
                    string[] fileList_a4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a4);
                    foreach (string file in fileList_a4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a5") == true)
                {
                    string filesToDelete_a5 = @"*" + supplierid + "_a5*";
                    string[] fileList_a5 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a5);
                    foreach (string file in fileList_a5)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_a6") == true)
                {
                    string filesToDelete_a6 = @"*" + supplierid + "_a6*";
                    string[] fileList_a6 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_a6);
                    foreach (string file in fileList_a6)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_b1") == true)
                {
                    string filesToDelete_b1 = @"*" + supplierid + "_b1*";
                    string[] fileList_b1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_b1);
                    foreach (string file in fileList_b1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_b2") == true)
                {
                    string filesToDelete_b2 = @"*" + supplierid + "_b2*";
                    string[] fileList_b2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_b2);
                    foreach (string file in fileList_b2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e1") == true) 
                {
                    string filesToDelete_e1 = @"*" + supplierid + "_e1*";
                    string[] fileList_e1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e1);
                    foreach (string file in fileList_e1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e2") == true) 
                {
                    string filesToDelete_e2 = @"*" + supplierid + "_e2*";
                    string[] fileList_e2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e2);
                    foreach (string file in fileList_e2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e3") == true)
                {
                    string filesToDelete_e3 = @"*" + supplierid + "_e3*";
                    string[] fileList_e3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e3);
                    foreach (string file in fileList_e3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e4") == true)
                {
                    string filesToDelete_e4 = @"*" + supplierid + "_e4*";
                    string[] fileList_e4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e4);
                    foreach (string file in fileList_e4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e5") == true)
                {
                    string filesToDelete_e5 = @"*" + supplierid + "_e5*";
                    string[] fileList_e5 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e5);
                    foreach (string file in fileList_e5)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f1") == true)
                {
                    string filesToDelete_f1 = @"*" + supplierid + "_f1*";
                    string[] fileList_f1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f1);
                    foreach (string file in fileList_f1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f2") == true)
                {
                    string filesToDelete_f2 = @"*" + supplierid + "_f2*";
                    string[] fileList_f2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f2);
                    foreach (string file in fileList_f2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f3") == true)
                {
                    string filesToDelete_f3 = @"*" + supplierid + "_f3*";
                    string[] fileList_f3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f3);
                    foreach (string file in fileList_f3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_g1") == true)
                {
                    string filesToDelete_g1 = @"*" + supplierid + "_g1*";
                    string[] fileList_g1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_g1);
                    foreach (string file in fileList_g1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h1") == true)
                {
                    string filesToDelete_h1 = @"*" + supplierid + "_h1*";
                    string[] fileList_h1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h1);
                    foreach (string file in fileList_h1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h2") == true)
                {
                    string filesToDelete_h2 = @"*" + supplierid + "_h2*";
                    string[] fileList_h2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h2);
                    foreach (string file in fileList_h2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h3") == true)
                {
                    string filesToDelete_h3 = @"*" + supplierid + "_h3*";
                    string[] fileList_h3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h3);
                    foreach (string file in fileList_h3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h4") == true)
                {
                    string filesToDelete_h4 = @"*" + supplierid + "_h4*";
                    string[] fileList_h4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h4);
                    foreach (string file in fileList_h4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h6") == true)
                {
                    string filesToDelete_h6 = @"*" + supplierid + "_h6*";
                    string[] fileList_h6 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h6);
                    foreach (string file in fileList_h6)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_m1") == true)
                {
                    string filesToDelete_m1 = @"*" + supplierid + "_m1*";
                    string[] fileList_m1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_m1);
                    foreach (string file in fileList_m1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q1") == true)
                {
                    string filesToDelete_q1 = @"*" + supplierid + "_q1*";
                    string[] fileList_q1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q1);
                    foreach (string file in fileList_q1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q2") == true)
                {
                    string filesToDelete_q2 = @"*" + supplierid + "_q2*";
                    string[] fileList_q2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q2);
                    foreach (string file in fileList_q2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q3") == true)
                {
                    string filesToDelete_q3 = @"*" + supplierid + "_q3*";
                    string[] fileList_q3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q3);
                    foreach (string file in fileList_q3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_s1") == true)
                {
                    string filesToDelete_s1 = @"*" + supplierid + "_s1*";
                    string[] fileList_s1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_s1);
                    foreach (string file in fileList_s1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_v1") == true)
                {
                    string filesToDelete_v1 = @"*" + supplierid + "_v1*";
                    string[] fileList_v1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_v1);
                    foreach (string file in fileList_v1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_z1") == true)
                {
                    string filesToDelete_z1 = @"*" + supplierid + "_z1*";
                    string[] fileList_z1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_z1);
                    foreach (string file in fileList_z1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, supId + fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("uploadarabic")]
        public async Task<IActionResult> UploadArabic([FromForm] string supplierid, string filename)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;
                var checkDocType = files[0].FileName;

                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Arabic");
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                var pathToSave = Path.Combine("D:/Resources/Arabic");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                string rootFolderPath = @"D:\\Resources\\Arabic";

                if (checkDocType.Contains("_r1") == true)
                {
                    string filesToDelete_r1 = @"*" + supplierid + "_r1*";
                    string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                    foreach (string file in fileList_r1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_b1") == true)
                {
                    string filesToDelete_b1 = @"*" + supplierid + "_b1*";
                    string[] fileList_b1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_b1);
                    foreach (string file in fileList_b1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_b2") == true)
                {
                    string filesToDelete_b2 = @"*" + supplierid + "_b2*";
                    string[] fileList_b2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_b2);
                    foreach (string file in fileList_b2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e1") == true)
                {
                    string filesToDelete_e1 = @"*" + supplierid + "_e1*";
                    string[] fileList_e1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e1);
                    foreach (string file in fileList_e1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e2") == true)
                {
                    string filesToDelete_e2 = @"*" + supplierid + "_e2*";
                    string[] fileList_e2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e2);
                    foreach (string file in fileList_e2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e3") == true)
                {
                    string filesToDelete_e3 = @"*" + supplierid + "_e3*";
                    string[] fileList_e3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e3);
                    foreach (string file in fileList_e3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e4") == true)
                {
                    string filesToDelete_e4 = @"*" + supplierid + "_e4*";
                    string[] fileList_e4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e4);
                    foreach (string file in fileList_e4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_e5") == true)
                {
                    string filesToDelete_e5 = @"*" + supplierid + "_e5*";
                    string[] fileList_e5 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_e5);
                    foreach (string file in fileList_e5)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f1") == true)
                {
                    string filesToDelete_f1 = @"*" + supplierid + "_f1*";
                    string[] fileList_f1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f1);
                    foreach (string file in fileList_f1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f2") == true)
                {
                    string filesToDelete_f2 = @"*" + supplierid + "_f2*";
                    string[] fileList_f2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f2);
                    foreach (string file in fileList_f2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_f3") == true)
                {
                    string filesToDelete_f3 = @"*" + supplierid + "_f3*";
                    string[] fileList_f3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_f3);
                    foreach (string file in fileList_f3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_g1") == true)
                {
                    string filesToDelete_g1 = @"*" + supplierid + "_g1*";
                    string[] fileList_g1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_g1);
                    foreach (string file in fileList_g1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h1") == true)
                {
                    string filesToDelete_h1 = @"*" + supplierid + "_h1*";
                    string[] fileList_h1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h1);
                    foreach (string file in fileList_h1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h2") == true)
                {
                    string filesToDelete_h2 = @"*" + supplierid + "_h2*";
                    string[] fileList_h2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h2);
                    foreach (string file in fileList_h2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h3") == true)
                {
                    string filesToDelete_h3 = @"*" + supplierid + "_h3*";
                    string[] fileList_h3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h3);
                    foreach (string file in fileList_h3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h4") == true)
                {
                    string filesToDelete_h4 = @"*" + supplierid + "_h4*";
                    string[] fileList_h4 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h4);
                    foreach (string file in fileList_h4)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_h6") == true)
            {
                string filesToDelete_h6 = @"*" + supplierid + "_h6*";
                string[] fileList_h6 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_h6);
                foreach (string file in fileList_h6)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }
            }
            else if (checkDocType.Contains("_m1") == true)
                {
                    string filesToDelete_m1 = @"*" + supplierid + "_m1*";
                    string[] fileList_m1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_m1);
                    foreach (string file in fileList_m1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q1") == true)
                {
                    string filesToDelete_q1 = @"*" + supplierid + "_q1*";
                    string[] fileList_q1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q1);
                    foreach (string file in fileList_q1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q2") == true)
                {
                    string filesToDelete_q2 = @"*" + supplierid + "_q2*";
                    string[] fileList_q2 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q2);
                    foreach (string file in fileList_q2)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_q3") == true)
                {
                    string filesToDelete_q3 = @"*" + supplierid + "_q3*";
                    string[] fileList_q3 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_q3);
                    foreach (string file in fileList_q3)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_s1") == true)
                {
                    string filesToDelete_s1 = @"*" + supplierid + "_s1*";
                    string[] fileList_s1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_s1);
                    foreach (string file in fileList_s1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_v1") == true)
                {
                    string filesToDelete_v1 = @"*" + supplierid + "_v1*";
                    string[] fileList_v1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_v1);
                    foreach (string file in fileList_v1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }
                else if (checkDocType.Contains("_z1") == true)
                {
                    string filesToDelete_z1 = @"*" + supplierid + "_z1*";
                    string[] fileList_z1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_z1);
                    foreach (string file in fileList_z1)
                    {
                        System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                        System.IO.File.Delete(file);
                    }
                }

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, supId + fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        //[HttpPost("uploadAudit")]
        //public async Task<IActionResult> uploadAudit()
        //{
        //    try
        //    {
        //        var files = Request.Form.Files;
        //        var folderName = Path.Combine("Resources", "Audit");
        //        /*Console.WriteLine("folder name : "+ folderName);*/
        //        var pathToSave = Path.Combine("D:/Resources/Images", folderName);
        //        if (files.Any(f => f.Length == 0))
        //        {
        //            return BadRequest();
        //        }
        //        foreach (var file in files)
        //        {
        //            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
        //            var fullPath = Path.Combine(pathToSave, fileName);
        //            var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
        //            using (var stream = new FileStream(fullPath, FileMode.Create))
        //            {
        //                file.CopyTo(stream);
        //            }
        //        }
        //        return Ok("All the files are successfully uploaded.");
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, "Internal server error");
        //    }
        //}

        [HttpPost("uploadAudit")]
        public async Task<IActionResult> uploadAudit([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;

                // file.FileName
                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Audit");
                /*Console.WriteLine("folder name : "+ folderName);*/
                //var supId = "5";
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                // var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathToSave = Path.Combine("D:/Resources/Audit");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("uploadAuditFinal")]
        public async Task<IActionResult> uploadAuditFinal([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;

                // file.FileName
                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Audit");
                /*Console.WriteLine("folder name : "+ folderName);*/
                //var supId = "5";
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                // var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathToSave = Path.Combine("D:/Resources/AuditFinal");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("getAuditPhotos")]
        public async Task<IActionResult> getAuditPhotos(string supId)
        {
            try
            {
                var folderName = Path.Combine("D:/Resources/Audit");
                var pathToRead = Path.Combine(folderName);

                string filesToFind = @"*_" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }
        

        [HttpGet("getChecklistPhotos")]
        public async Task<IActionResult> getChecklistPhotos(string supId)
        {
            try
            {
                var folderName = Path.Combine("D:/Resources/AuditFinal");
                var pathToRead = Path.Combine(folderName);

                string filesToFind = @"*_" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getNCAuditPhotos")]
        public async Task<IActionResult> getNCAuditPhotos(string supId)
        {
            try
            {
                var folderName = Path.Combine("D:/Resources/AuditNonConfirmityReport");
                var pathToRead = Path.Combine(folderName);

                string filesToFind = @"*_" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet("getAuditNCPhotos")]
        public async Task<IActionResult> getAuditNCPhotos(string supId)
        {
            try
            {
                var folderName = Path.Combine("D:/Resources/AuditNonConfirmity");
                var pathToRead = Path.Combine(folderName);

                string filesToFind = @"*_" + supId + "_*";

                var photos = Directory.EnumerateFiles(folderName, filesToFind)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        private bool IsAuditFile(string fileName)
        {
            return fileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".txt", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".tex", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".text", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".doc", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xpd", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".docx", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".rtf", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".ods", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".odt", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xlsm", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xls", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".svg", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".tif", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".tiff", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".gif", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".bmp", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".xhtml", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".html", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".key", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".odp", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".pptx", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".pps", StringComparison.OrdinalIgnoreCase)
                || fileName.EndsWith(".ppt", StringComparison.OrdinalIgnoreCase);

        }

        // Emergency Supplier's Files - Deleting part
        [HttpGet("deleteEmergencySupplierFiles")]
        public async Task<bool> DeleteEmergencySupplierFiles(int supplierid)
        {
            try
            {
                string filesToDelete_r1 = @"" + supplierid + "_*";
                var rootFolderPath = Path.Combine("D:/Resources/EmergencySupplierDocs");
                string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                foreach (string file in fileList_r1)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }

                _logger.LogInformation("emergency supplier files deleted");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("deletion failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return false;
            }
        }

        // Emergency Supplier Vat File delete 
        [HttpGet("deleteEmgVatFile")]
        public async Task<bool> DeleteEmgVatFile(int supplierid)
        {
            try
            {
                string filesToDelete_r1 = @"*" + supplierid + "_Vat*";
                var rootFolderPath = Path.Combine("D:/Resources/EmergencySupplierDocs");
                string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                foreach (string file in fileList_r1)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }

                _logger.LogInformation("emergency supplier vat file deleted");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("deletion failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return false;
            }
        }

        [HttpGet("deleteAuditNonConfirmity")]
        public async Task<bool> DeleteAuditNonConfirmityFiles(int supplierid)
        {
            string filesToDelete_r1 = @"" + supplierid + "_*";
            var rootFolderPath = Path.Combine("D:/Resources/AuditNonConfirmity");
            string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
            foreach (string file in fileList_r1)
            {
                System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                System.IO.File.Delete(file);
            }
            return true;
        }

        [HttpGet("deleteAuditNCReport")]
        public async Task<bool> DeleteAuditNCReportFiles(int supplierid)
        {
            string filesToDelete_r1 = @"" + supplierid + "_*";
            var rootFolderPath = Path.Combine("D:/Resources/AuditNonConfirmityReport");
            string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
            foreach (string file in fileList_r1)
            {
                System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                System.IO.File.Delete(file);
            }
            return true;
        }

        [HttpPost("uploadAuditNonConfirmity")]
        public async Task<IActionResult> uploadAuditNonConfirmity([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;

                // file.FileName
                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Audit");
                /*Console.WriteLine("folder name : "+ folderName);*/
                //var supId = "5";
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                // var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathToSave = Path.Combine("D:/Resources/AuditNonConfirmity");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("uploadAuditNCAudit")]
        public async Task<IActionResult> uploadAuditNCAudit([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;

                // file.FileName
                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "Audit");
                /*Console.WriteLine("folder name : "+ folderName);*/
                //var supId = "5";
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");

                // var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var pathToSave = Path.Combine("D:/Resources/AuditNonConfirmityReport");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, fileName);
                    var dbPath = Path.Combine(folderName, fileName); //you can add this path to a list and then return all dbPaths to the client if require
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadAudit")]
        public async Task<IActionResult> downloadAudit([FromQuery] string fileUrl)
        {
            var fileName = fileUrl;
            var filePath = Path.Combine("D:/Resources/Audit", fileUrl);

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadNC")]
        public async Task<IActionResult> downloadNC([FromQuery] string fileUrl)
        {
            var fileName = fileUrl;
            var filePath = Path.Combine("D:/Resources/AuditNonConfirmity", fileUrl);

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadAuditComplete")]
        public async Task<IActionResult> downloadAuditComplete([FromQuery] string fileUrl)
        {
            var fileName = fileUrl;
            var filePath = Path.Combine("D:/Resources/AuditFinal", fileUrl);

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadNCAudit")]
        public async Task<IActionResult> downloadNCAudit([FromQuery] string fileUrl)
        {
            var fileName = fileUrl;
            var filePath = Path.Combine("D:/Resources/AuditNonConfirmityReport", fileUrl);

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadEmergency")]
        public async Task<IActionResult> downloadEmergency([FromQuery] string fileUrl)
        {
            var fileName = fileUrl;
            var filePath = Path.Combine("D:/Resources/EmergencySupplierDocs", fileUrl);

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet("getEmergencyPhotos")]
        public async Task<IActionResult> getEmergencyPhotos(string SupplierId)
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/EmergencySupplierDocs");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                string searchTag = SupplierId + "_*";

                var photos = Directory.EnumerateFiles(folderName, searchTag, SearchOption.AllDirectories)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        [HttpGet]
        [Route("moverejectedfiles")]
        public async Task<IActionResult> moverejectedfiles([FromQuery] string tempId, string registerId, string cat)
        {

            
            string sourceDirectory = @"D:\Resources\Temp";
            string archiveDirectory = @"D:\Resources\Images";


            if (cat == "tmp")
            {
                sourceDirectory = "D:/Resources/Images";
                archiveDirectory = "D:/Resources/Temp";
            }
            else
            {
                sourceDirectory = "D:/Resources/Images";
                archiveDirectory = "D:/Resources/Images";
            }

            /*string tempId = "1200";
            string registerId = "700";*/

            string searchTag = tempId + "_*";

            string oldName = tempId + "_";
            string newName = registerId + "_";
            try
            {
                var txtFiles = Directory.EnumerateFiles(sourceDirectory, searchTag, SearchOption.AllDirectories);

                foreach (string currentFile in txtFiles)
                {
                    string fileName = currentFile.Substring(sourceDirectory.Length + 1);
                    fileName = fileName.Replace(oldName, newName);

                    System.IO.File.Copy(currentFile, Path.Combine(archiveDirectory, fileName));
                    Console.WriteLine("File name: ", fileName);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }

            return Ok(true);
        }

        [HttpPost("uploadInviteFiles")]
        public async Task<IActionResult> uploadInviteFiles([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;
                var checkDocType = files[0].FileName;

                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "InviteDocs");
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");
                _logger.LogInformation("upload start before pathToSave");


                var pathToSave = Path.Combine("D:/Resources/InviteDocs");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                // Delete existing files
                string rootFolderPath = @"D:\\Resources\\InviteDocs";

                string filesToDelete_r1 = @"*" + supplierid + "_*";
                string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                foreach (string file in fileList_r1)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }


                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, supId + fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                var _fileData = new FileData(Configuration);
                var _fileService = new FileService(_fileData);
                InviteSupplierDto invitesupplier = _fileService.GetInviteSupplier(supId.ToString()).Result.FirstOrDefault();
                var _emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfigDto>();
                var _emailSender = new EmailService(_emailConfig);
                var message = new MessageDto(new string[] { invitesupplier.email }, "IMI-Invitation to be Registered as an Approved Supplier to International Maritime Industries (IMI)", invitesupplier.justification, supId.ToString(), null, "inv", "", "");
                _emailSender.SendEmail(message);

                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("uploadpdfFiles")]
        public async Task<IActionResult> UploadpdfFiles(IFormFile file)
        {
            //var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");
            var uploads = Path.Combine("Resources", "supplierreviewpdfs");
            var pathToSave = Path.Combine("D:/Resources/supplierreviewpdfs");
            var folderName = Path.Combine("Resources", "supplierreviewpdfs");

            if (!Directory.Exists(uploads))
            {
                Directory.CreateDirectory(uploads);
            }
            if (file.Length > 0)
            {
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                var fullPath = Path.Combine(pathToSave, "101" + fileName);
                var dbPath = Path.Combine(folderName, fileName);
                _logger.LogInformation("upload start after fullPath " + fullPath);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
            }
            return Ok();
        }

        [HttpPost("uploadpdfFiles1")]
        public async Task<IActionResult> UploadpdfFiles1([FromForm] int supplierid)
        {
            try
            {
                _logger.LogInformation("upload start");
                var files = Request.Form.Files;
                var checkDocType = files[0].FileName;

                var fileNameChange = files;
                var folderName = Path.Combine("Resources", "supplierreviewpdfs");
                var supId = supplierid;
                _logger.LogInformation("upload start before pathToSave");
                _logger.LogInformation("upload start before pathToSave");


                var pathToSave = Path.Combine("D:/Resources/supplierreviewpdfs");

                _logger.LogInformation("upload start after pathToSave " + pathToSave);

                // Delete existing files
                string rootFolderPath = @"D:\\Resources\\supplierreviewpdfs";

                string filesToDelete_r1 = @"*" + supplierid + "_*";
                string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                foreach (string file in fileList_r1)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }


                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }
                foreach (var file in files)
                {
                    var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    var fullPath = Path.Combine(pathToSave, supId + fileName);
                    var dbPath = Path.Combine(folderName, fileName);
                    _logger.LogInformation("upload start after fullPath " + fullPath);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }
                }
                var _fileData = new FileData(Configuration);
                var _fileService = new FileService(_fileData);
                InviteSupplierDto invitesupplier = _fileService.GetInviteSupplier(supId.ToString()).Result.FirstOrDefault();
                var _emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfigDto>();
                var _emailSender = new EmailService(_emailConfig);
                var message = new MessageDto(new string[] { invitesupplier.email }, "IMI-Invitation to be Registered as an Approved Supplier to International Maritime Industries (IMI)", invitesupplier.justification, supId.ToString(), null, "inv", "", "");
                _emailSender.SendEmail(message);

                _logger.LogInformation("upload end");

                return Ok("All the files are successfully uploaded.");
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadInvite")]
        public async Task<IActionResult> downloadInvite([FromQuery] string fileUrl)
        {
            var fileName = fileUrl;
            var filePath = Path.Combine("D:/Resources/InviteDocs", fileUrl);

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpGet("getInvitePhotos")]
        public async Task<IActionResult> getInvitePhotos(string SupplierId)
        {
            try
            {
                //var folderName = Path.Combine("Resources", "Images");
                var folderName = Path.Combine("D:/Resources/InviteDocs");
                var pathToRead = Path.Combine(folderName);
                _logger.LogInformation("upload start after fullPath " + pathToRead);

                string searchTag = SupplierId + "_*";

                var photos = Directory.EnumerateFiles(folderName, searchTag, SearchOption.AllDirectories)
                    .Where(IsAPhotoFile)
                    .Select(fullPath => Path.Combine(Path.GetFileName(fullPath)));

                _logger.LogInformation("fetch end");

                return Ok(new { photos });
            }
            catch (Exception ex)
            {
                _logger.LogError("upload failed " + ex.Message + " stack trace: " + ex.StackTrace);

                return StatusCode(500, $"Internal server error: {ex}");
            }
        }

        // Invite Supplier Basic Data File delete 
        [HttpGet("deleteInvSupplierFile")]
        public async Task<bool> DeleteInvSupplierFile(int supplierid)
        {
            try
            {
                string filesToDelete_r1 = @"*" + supplierid;
                var rootFolderPath = Path.Combine("D:/Resources/InviteDocs");
                string[] fileList_r1 = System.IO.Directory.GetFiles(rootFolderPath, filesToDelete_r1);
                foreach (string file in fileList_r1)
                {
                    System.Diagnostics.Debug.WriteLine(file + "will be deleted");
                    System.IO.File.Delete(file);
                }

                _logger.LogInformation("invite supplier basic data file deleted");

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("deletion failed " + ex.Message + " stack trace: " + ex.StackTrace);
                return false;
            }
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("downloadNotify")]
        public async Task<IActionResult> DownloadNotify([FromQuery] string fileUrl)
        {
            var fileName = "";
            var filePath = Path.Combine("D:\\Resources\\ExpiryNotification", fileUrl);

            fileName = fileUrl;

            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }

        [HttpPost("uploadFormBuilderFiles")]
        public IActionResult uploadFormBuilderFiles([FromForm] int formId, [FromForm] string type)
        {
            var file = Request.Form.Files[0];
            var destinationDirectory = new DirectoryInfo($@"{Path.GetDirectoryName(baseLocation)}\Resources");
            string path = destinationDirectory.FullName;

            if (!destinationDirectory.Exists)
            {
                Directory.CreateDirectory(path);
            }
            
            var pathToSave = Path.Combine(path);
            var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
            var fullPath = Path.Combine(pathToSave, formId + "_" + type + "_" + fileName);

            if (System.IO.File.Exists(fullPath))
            {
                System.IO.File.Delete(fullPath);
            }

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            return Ok("File is uploaded");
        }

        [HttpGet, DisableRequestSizeLimit]
        [Route("formBuilderFile")]
        public async Task<IActionResult> DownloadFormBuilderFile([FromQuery] string fileName)
        {
            var destinationDirectory = new DirectoryInfo($@"{Path.GetDirectoryName(baseLocation)}\Resources");
            string path = destinationDirectory.FullName;

            var filePath = Path.Combine(path, fileName);
            if (!System.IO.File.Exists(filePath))
                return NotFound();
            var memory = new MemoryStream();
            await using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, GetContentType(filePath), fileName);
        }
    }
}