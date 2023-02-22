#region References
using System;
#endregion

#region Namespace
namespace SRMPublic.DTO
{
    public class UserLogDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
#endregion
