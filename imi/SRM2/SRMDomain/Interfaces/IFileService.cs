using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Interfaces
{
    public interface IFileService
    {
        Task<bool> SaveFile(FileDto file);
        Task<FileDto> GetFilebyId(int id);
        Task<IList<FileDto>> GetFileBySupplier(int supplierId);
        Task<bool> SaveTempFile(FileDto file);
        Task<FileDto> GetTempFilebyId(int id);
        Task<IList<FileDto>> GetTempFileBySupplier(int supplierId);
        Task<bool> SaveSiteAuditFile(FileDto file);
        Task<FileDto> GetSiteAuditFilebyId(int id);
        Task<IList<FileDto>> GetSiteAuditFileBySupplier(int supplierId);
        Task<IList<InviteSupplierDto>> GetInviteSupplier(string supplierId);
    }
}
