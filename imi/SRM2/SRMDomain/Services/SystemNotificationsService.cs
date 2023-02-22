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
    public class SystemNotificationsService : ISystemNotificationsService
    {
        private readonly ISystemNotificationsData _systemNotificationsData;
        public SystemNotificationsService(ISystemNotificationsData systemNotificationsData)
        {
            _systemNotificationsData = systemNotificationsData;
        }

        public async Task<IList<SystemNotificationDto>> GetSystemNotificationsByUser(string loggedInUser)
        {
            IList<SystemNotificationDto> result = await _systemNotificationsData.GetSystemNotificationsByUser(loggedInUser);
            return result;
        }

        public async Task<int> SaveSystemNotification(SystemNotificationDto systemNotification)
        {
            var result = await _systemNotificationsData.SaveSystemNotification(systemNotification);
            return result;
        }

    }
}