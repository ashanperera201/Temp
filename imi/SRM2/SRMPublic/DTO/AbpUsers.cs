using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SRMPublic.DTO
{
    public class AbpUsers
    {

        public long Id { get; set; }

        public int AccessFailedCount { get; set; }

        public string AuthenticationSource { get; set; }

        public string ConcurrencyStamp { get; set; }

        public DateTime? CreationTime { get; set; }

        public string CreatorUserId { get; set; }

        public string DeleterUserId { get; set; }

        public string DeletionTime { get; set; }

        public string EmailAddress { get; set; }

        public string EmailConfirmationCode { get; set; }

        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }

        public bool IsEmailConfirmed { get; set; }

        public bool IsLockoutEnabled { get; set; }

        public bool IsPhoneNumberConfirmed { get; set; }

        public bool IsTwoFactorEnabled { get; set; }

        public DateTime? LastLoginTime { get; set; }

        public DateTime? LastModificationTime { get; set; }

        public long? LastModifierUserId { get; set; }

        public DateTime? LockoutEndDateUtc { get; set; }

        public string Name { get; set; }

        public string NormalizedEmailAddress { get; set; }

        public string NormalizedUserName { get; set; }

        public string Password { get; set; }

        public string PasswordResetCode { get; set; }

        public string PhoneNumber { get; set; }

        public string SecurityStamp { get; set; }

        public string Surname { get; set; }

        public int? TenantId { get; set; }

        public string UserName { get; set; }
    }
}
