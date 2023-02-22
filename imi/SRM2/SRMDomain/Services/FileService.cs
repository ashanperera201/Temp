using SRMDomain.Data.Interfaces;
using SRMDomain.Interfaces;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Services
{
    public class FileService :IFileService
    {
        private readonly IFileData _fileData;
        public FileService(IFileData fileData)
        {
            _fileData = fileData;
        }
        public async Task<bool> SaveFile(FileDto file)
        {
            var result = await _fileData.SaveFile(file);
            return result;
        }

        public async Task<FileDto> GetFilebyId(int id)
        {
            var result = await _fileData.GetFilebyId(id);
            return result;
        }

        public async Task<IList<FileDto>> GetFileBySupplier(int id)
        {
            var result = await _fileData.GetFileBySupplier(id);
            return result;
        }

        public async Task<bool> SaveTempFile(FileDto file)
        {
            var result = await _fileData.SaveTempFile(file);
            return result;
        }

        public async Task<FileDto> GetTempFilebyId(int id)
        {
            var result = await _fileData.GetTempFilebyId(id);
            return result;
        }

        public async Task<IList<FileDto>> GetTempFileBySupplier(int supplierId)
        {
            var result = await _fileData.GetTempFileBySupplier(supplierId);
            return result;
        }

        public async Task<bool> SaveSiteAuditFile(FileDto file)
        {
            var result = await _fileData.SaveSiteAuditFile(file);
            return result;
        }

        public async Task<FileDto> GetSiteAuditFilebyId(int id)
        {
            var result = await _fileData.GetSiteAuditFilebyId(id);
            return result;
        }

        public async Task<IList<FileDto>> GetSiteAuditFileBySupplier(int supplierId)
        {
            var result = await _fileData.GetSiteAuditFileBySupplier(supplierId);
            return result;
        }

        public async Task<IList<InviteSupplierDto>> GetInviteSupplier(string supplierId)
        {
            var result = await _fileData.GetInviteSupplier(supplierId);
            return result;
        }
    }
}
