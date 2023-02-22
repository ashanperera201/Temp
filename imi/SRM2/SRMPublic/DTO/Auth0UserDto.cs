using System;
using System.Collections.Generic;
using System.Text;

namespace SRMPublic.DTO
{
    public class Auth0UserDto
    {
            public string name { get; set; }
            public string nickname { get; set; }
            public string email { get; set; }
            public string sub { get; set; }
            public string userrole { get; set; }
    }
}