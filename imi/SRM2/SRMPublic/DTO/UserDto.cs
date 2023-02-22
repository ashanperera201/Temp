using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SRMPublic.DTO
{
    public class UserDto
    {
        public int id { get; set; }
        public string email { get; set; }
        public string name { get; set; }
        public string department { get; set; }
        public string creationTime { get; set; }
        public int isActive { get; set; }
        //public string name { get; set; }
        public string phoneNumber { get; set; }
        public string surname { get; set; }
        public string userName{ get; set; }
    }
}