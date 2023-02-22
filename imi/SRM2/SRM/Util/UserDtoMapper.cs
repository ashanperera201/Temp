using SRMDomain.Data.Interfaces;
using SRMPublic.DTO;
using SRMPublic.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SRM.Util
{
    public class UserDtoMapper
    {
        public static void Map<TSource, TDestination>(Auth0UserDto source, IUserData destination)
        {
            destination.createdUser = source.nickname;
            destination.createdUserRole = source.userrole;
        }
    }
}
