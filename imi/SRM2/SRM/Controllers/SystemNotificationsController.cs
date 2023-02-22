using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SRM.Util;
using SRMDomain.Data;
using SRMDomain.Services;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Http;

namespace SRM.Controllers
{
    [Route("api/systemNotifications")]
    public class SupplierNotificationsController : Controller
    {
        private IConfiguration Configuration;
        private readonly EmailConfigDto _emailConfig;
        public SupplierNotificationsController(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }

        [HttpGet("systemNotifications")]
        public async Task<IList<SystemNotificationDto>> GetSystemNotificationsByUser(string loggedInUser)
        {
            var _systemNotificationsData = new SystemNotificationsData(Configuration);
            var _systemNotificationsService = new SystemNotificationsService(_systemNotificationsData);
            var result = await _systemNotificationsService.GetSystemNotificationsByUser(loggedInUser);
            return result;
        }
        [HttpPost("systemNotification")]
        public async Task<int> SaveSystemNotification(SystemNotificationDto systemNotification)
        {
            var _systemNotificationsData = new SystemNotificationsData(Configuration);
            var _systemNotificationsService = new SystemNotificationsService(_systemNotificationsData);
            var result = await _systemNotificationsService.SaveSystemNotification(systemNotification);
            return result;
        }
    }
}
