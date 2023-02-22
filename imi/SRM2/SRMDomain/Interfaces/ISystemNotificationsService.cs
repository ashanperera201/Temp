using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SRMDomain.Interfaces
{
    public interface ISystemNotificationsService
    {
        public Task<IList<SystemNotificationDto>> GetSystemNotificationsByUser(string loggedInUser);
        public Task<int> SaveSystemNotification(SystemNotificationDto systemNotification);

    }
}
