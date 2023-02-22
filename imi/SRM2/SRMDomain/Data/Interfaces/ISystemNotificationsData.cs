using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Data.Interfaces
{
    public interface ISystemNotificationsData
    {
        Task<IList<SystemNotificationDto>> GetSystemNotificationsByUser(string loggedInUser);
        Task<int> SaveSystemNotification(SystemNotificationDto systemNotification);
       
    }
}