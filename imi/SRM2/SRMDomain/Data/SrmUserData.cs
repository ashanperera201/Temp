#region References
using Microsoft.Extensions.Configuration;
using SRMDomain.Data.Interfaces;
using SRMDomain.Utils;
using SRMPublic.DTO;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
#endregion

#region Namespace
namespace SRMDomain.Data
{
    public class SrmUserData : ISrmUserData
    {
        /// <summary>
        /// The connection string
        /// </summary>
        private readonly string _connectionString;
        /// <summary>
        /// Initializes a new instance of the <see cref="SrmUserData"/> class.
        /// </summary>
        /// <param name="configuration">The configuration.</param>
        public SrmUserData(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("defaultConnection");
        }

        /// <summary>
        /// Gets the SRM user asynchronous.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<SrmUserDto> GetSrmUserAsync(string userId, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spFetchUserById]";
            List<SrmUserDto> srmUsers = new List<SrmUserDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@UserId", userId));

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var srmTempUserRef = new SrmUserDto()
                            {
                                UserId = Guid.Parse(reader["UserId"].ToString()),
                                FullName = reader["FullName"].ToString(),
                                Email = reader["Email"].ToString(),
                                Source = reader["Source"].ToString(),
                                DefaultLang = reader["DefaultLang"].ToString(),
                                DefaultCurrency = reader["DefaultCurrency"].ToString(),
                                LoginMethod = reader["LoginMethod"].ToString(),
                                UserGroups = reader["UserGroups"].ToString(),
                                UserName = reader["UserName"].ToString(),
                                ValidFrom = DateTime.Parse(reader["ValidFrom"].ToString()),
                                ValidTo = DateTime.Parse(reader["ValidTo"].ToString()),
                                UpdatedOn = string.IsNullOrEmpty(reader["UpdatedOn"].ToString()) ? DateTime.MinValue : DateTime.Parse(reader["UpdatedOn"].ToString()),
                                UpdatedBy = reader["UpdatedBy"].ToString(),
                                IsActive = Convert.ToBoolean(reader["IsActive"].ToString()),
                                UserImageUrl = reader["UserImageUrl"].ToString(),
                                CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString()),
                                CreatedBy = reader["CreatedBy"].ToString(),
                            };

                            srmUsers.Add(srmTempUserRef);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return srmUsers.FirstOrDefault();
        }

        /// <summary>
        /// Gets the SRM user asynchronous.
        /// </summary>
        /// <param name="srmUserFilter">The SRM user filter.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<SrmUserDto> FilterSrmUserAsync(SrmUserFilterDto srmUserFilter, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spFilterUsers]";
            List<SrmUserDto> srmUsers = new List<SrmUserDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Email", srmUserFilter.Email));
                    cmd.Parameters.Add(new SqlParameter("@UserName", srmUserFilter.UserName));

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var srmTempUserRef = new SrmUserDto()
                            {
                                UserId = Guid.Parse(reader["UserId"].ToString()),
                                FullName = reader["FullName"].ToString(),
                                Email = reader["Email"].ToString(),
                                Source = reader["Source"].ToString(),
                                DefaultLang = reader["DefaultLang"].ToString(),
                                DefaultCurrency = reader["DefaultCurrency"].ToString(),
                                LoginMethod = reader["LoginMethod"].ToString(),
                                UserGroups = reader["UserGroups"].ToString(),
                                UserName = reader["UserName"].ToString(),
                                ValidFrom = DateTime.Parse(reader["ValidFrom"].ToString()),
                                ValidTo = DateTime.Parse(reader["ValidTo"].ToString()),
                                UpdatedOn = string.IsNullOrEmpty(reader["UpdatedOn"].ToString()) ? DateTime.MinValue : DateTime.Parse(reader["UpdatedOn"].ToString()),
                                UpdatedBy = reader["UpdatedBy"].ToString(),
                                IsActive = Convert.ToBoolean(reader["IsActive"].ToString()),
                                UserImageUrl = reader["UserImageUrl"].ToString(),
                                CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString()),
                                CreatedBy = reader["CreatedBy"].ToString(),
                            };

                            srmUsers.Add(srmTempUserRef);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return srmUsers.FirstOrDefault();
        }

        /// <summary>
        /// Gets the SRM user details asynchronous.
        /// </summary>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<List<SrmUserDto>> GetSrmUserDetailsAsync(CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spUserDetails]";
            List<SrmUserDto> srmUsers = new List<SrmUserDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var srmTempUserRef = new SrmUserDto()
                            {
                                Id = int.Parse(reader["Id"].ToString()),
                                UserId = Guid.Parse(reader["UserId"].ToString()),
                                FullName = reader["FullName"].ToString(),
                                Email = reader["Email"].ToString(),
                                Source = reader["Source"].ToString(),
                                DefaultLang = reader["DefaultLang"].ToString(),
                                DefaultCurrency = reader["DefaultCurrency"].ToString(),
                                LoginMethod = reader["LoginMethod"].ToString(),
                                UserGroups = reader["UserGroups"].ToString(),
                                UserName = reader["UserName"].ToString(),
                                ValidFrom = DateTime.Parse(reader["ValidFrom"].ToString()),
                                ValidTo = DateTime.Parse(reader["ValidTo"].ToString()),
                                UpdatedOn = string.IsNullOrEmpty(reader["UpdatedOn"].ToString()) ? DateTime.MinValue : DateTime.Parse(reader["UpdatedOn"].ToString()),
                                UpdatedBy = reader["UpdatedBy"].ToString(),
                                IsActive = Convert.ToBoolean(reader["IsActive"].ToString()),
                                UserImageUrl = reader["UserImageUrl"].ToString(),
                                CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString()),
                                CreatedBy = reader["CreatedBy"].ToString(),
                            };

                            srmUsers.Add(srmTempUserRef);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return srmUsers;
        }

        public async Task<bool> SrmUserDeleteAsync(string userId, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spUserDelete]";
            bool returnStatus = true;
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@UserId", userId));

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                }
                await sql.CloseAsync();
            }
            return returnStatus;
        }

        /// <summary>
        /// SRMs the user save asynchronous.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<SrmUserDto> SrmUserSaveAsync(SrmUserDto user, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spUserCreate]";
            bool status = false;
            string responseMessage = string.Empty;
            string userId = Guid.NewGuid().ToString();

            if (!string.IsNullOrEmpty(user.Password))
            {
                // TODO : HASH THE PASSWORD.
                string passwordSalt = CryptographyProcessor.CreateSalt(300);
                user.PasswordSalt = passwordSalt;
                user.Password = CryptographyProcessor.GenerateHash(user.Password, passwordSalt);
            }

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@UserId", userId));
                    cmd.Parameters.Add(new SqlParameter("@UserName", user.UserName));
                    cmd.Parameters.Add(new SqlParameter("@Email", user.Email));
                    cmd.Parameters.Add(new SqlParameter("@Password", user.Password));
                    cmd.Parameters.Add(new SqlParameter("@PasswordSalt", user.PasswordSalt));
                    cmd.Parameters.Add(new SqlParameter("@FullName", user.FullName));
                    cmd.Parameters.Add(new SqlParameter("@Source", user.Source));
                    cmd.Parameters.Add(new SqlParameter("@LoginMethod", user.LoginMethod));
                    cmd.Parameters.Add(new SqlParameter("@ValidFrom", user.ValidFrom));
                    cmd.Parameters.Add(new SqlParameter("@ValidTo", user.ValidTo));
                    cmd.Parameters.Add(new SqlParameter("@DefaultLang", user.DefaultLang));
                    cmd.Parameters.Add(new SqlParameter("@DefaultCurrency", user.DefaultCurrency));
                    cmd.Parameters.Add(new SqlParameter("@UserGroups", user.UserGroups));
                    cmd.Parameters.Add(new SqlParameter("@UserImageUrl", user.UserImageUrl));
                    cmd.Parameters.Add(new SqlParameter("@IsActive", user.IsActive));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", user.CreatedBy));
                    cmd.Parameters.Add(new SqlParameter("@CreatedOn", user.CreatedOn));
                    cmd.Parameters.Add(new SqlParameter("@Status", false));

                    cmd.Parameters["@Status"].Direction = ParameterDirection.Output;

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                    status = Convert.ToBoolean(cmd.Parameters["@Status"]?.Value);
                }
                await sql.CloseAsync();
                user.Password = string.Empty;
                user.PasswordSalt = string.Empty;

                if (user.UserLog != null && status)
                {
                    user.UserLog.UserId = userId;
                    await SaveUserLogAsync(user.UserLog, cancellationToken);
                }

                return status ? user : null;
            }
        }

        /// <summary>
        /// SRMs the user update asynchronous.
        /// </summary>
        /// <param name="user">The user.</param>
        /// <param name="cancellationToken"></param>
        /// <returns></returns>
        public async Task<SrmUserDto> SrmUserUpdateAsync(SrmUserDto user, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spUserUpdate]";
            bool status = false;
            string responseMessage = string.Empty;

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Id", user.Id));
                    cmd.Parameters.Add(new SqlParameter("@UserId", user.UserId));
                    cmd.Parameters.Add(new SqlParameter("@UserName", user.UserName));
                    cmd.Parameters.Add(new SqlParameter("@Email", user.Email));
                    cmd.Parameters.Add(new SqlParameter("@Password", user.Password));
                    cmd.Parameters.Add(new SqlParameter("@FullName", user.FullName));
                    cmd.Parameters.Add(new SqlParameter("@Source", user.Source));
                    cmd.Parameters.Add(new SqlParameter("@LoginMethod", user.LoginMethod));
                    cmd.Parameters.Add(new SqlParameter("@ValidFrom", user.ValidFrom));
                    cmd.Parameters.Add(new SqlParameter("@ValidTo", user.ValidTo));
                    cmd.Parameters.Add(new SqlParameter("@DefaultLang", user.DefaultLang));
                    cmd.Parameters.Add(new SqlParameter("@DefaultCurrency", user.DefaultCurrency));
                    cmd.Parameters.Add(new SqlParameter("@UserGroups", user.UserGroups));
                    cmd.Parameters.Add(new SqlParameter("@IsActive", user.IsActive));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", user.CreatedBy));
                    cmd.Parameters.Add(new SqlParameter("@CreatedOn", user.CreatedOn));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedBy", user.UpdatedBy));
                    cmd.Parameters.Add(new SqlParameter("@UpdatedOn", user.UpdatedOn));
                    cmd.Parameters.Add(new SqlParameter("@Status", false));


                    cmd.Parameters["@Status"].Direction = ParameterDirection.Output;

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                    status = Convert.ToBoolean(cmd.Parameters["@Status"]?.Value);
                }
                await sql.CloseAsync();

                if (user.UserLog != null && status)
                {
                    await SaveUserLogAsync(user.UserLog, cancellationToken);
                }

                return status ? user : null;
            }
        }

        /// <summary>
        /// Saves the user log asynchronous.
        /// </summary>
        /// <param name="userLog">The user log.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<UserLogDto> SaveUserLogAsync(UserLogDto userLog, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spUserLogCreateUpdate]";
            bool status = false;
            string responseMessage = string.Empty;

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("UserId", userLog.UserId));
                    cmd.Parameters.Add(new SqlParameter("@Comment", userLog.Comment));
                    cmd.Parameters.Add(new SqlParameter("@CreatedOn", userLog.CreatedOn));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", userLog.CreatedBy));
                    cmd.Parameters.Add(new SqlParameter("@Status", false));


                    cmd.Parameters["@Status"].Direction = ParameterDirection.Output;

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                    status = Convert.ToBoolean(cmd.Parameters["@Status"]?.Value);
                }
                await sql.CloseAsync();
                return status ? userLog : null;
            }
        }

        /// <summary>
        /// Gets the user logs asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<UserLogDto>> GetUserLogsAsync(CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[spGetUserLog]";
            List<UserLogDto> userLogs = new List<UserLogDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var userLog = new UserLogDto()
                            {
                                Id = int.Parse(reader["Id"].ToString()),
                                UserId = reader["UserId"].ToString(),
                                Comment = reader["Comment"].ToString(),
                                CreatedBy = reader["CreatedBy"].ToString(),
                                CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString()),
                            };

                            userLogs.Add(userLog);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return userLogs;
        }

        /// <summary>
        /// Assigns the user role asynchronous.
        /// </summary>
        /// <param name="assignRole">The assign role.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<AssignRoleDto> AssignUserRoleAsync(AssignRoleDto assignRole, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[SpUserRoleAssign]";

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("UserId", assignRole.UserId));
                    cmd.Parameters.Add(new SqlParameter("@RoleId", assignRole.RoleId));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", assignRole.CreatedBy));


                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                }
                await sql.CloseAsync();
            }

            //if(assignRole.AssignRoleLog != null)
            //{
            //    await SaveUserRleAssignLogAsync(assignRole.AssignRoleLog, cancellationToken);
            //}
            return assignRole;
        }

        /// <summary>
        /// Saves the user rle assign log asynchronous.
        /// </summary>
        /// <param name="assignRoleLog">The assign role log.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<AssignRoleLog> SaveUserRleAssignLogAsync(AssignRoleLog assignRoleLog, CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[SpUserRoleAssignLog]";

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {

                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@UserId", assignRoleLog.UserId));
                    cmd.Parameters.Add(new SqlParameter("@RoleId", assignRoleLog.RoleId));
                    cmd.Parameters.Add(new SqlParameter("@Comment", assignRoleLog.Comment));
                    cmd.Parameters.Add(new SqlParameter("@CreatedBy", assignRoleLog.CreatedBy));

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);
                }
                await sql.CloseAsync();
            }

            return assignRoleLog;
        }

        /// <summary>
        /// Gets the assigned roles.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<AssignRoleDto>> GetAssignedRoles(CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[SpGetAssignedUserRoles]";
            List<AssignRoleDto> assignRoleList = new List<AssignRoleDto>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var assignRole = new AssignRoleDto()
                            {
                                Id = int.Parse(reader["Id"].ToString()),
                                UserId = reader["UserId"].ToString(),
                                RoleId = reader["RoleId"].ToString(),
                                CreatedBy = reader["CreatedBy"].ToString(),
                                CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString()),
                            };

                            assignRoleList.Add(assignRole);
                        }
                    }
                }
                await sql.CloseAsync();
            }

            return assignRoleList;
        }

        /// <summary>
        /// Gets the assigned role logs asynchronous.
        /// </summary>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns></returns>
        public async Task<List<AssignRoleLog>> GetAssignedRoleLogsAsync(CancellationToken cancellationToken = default)
        {
            const string spName = "[dbo].[SpGetAssignedUserLog]";
            List<AssignRoleLog> assignRoleLogs = new List<AssignRoleLog>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var assignRoleLog = new AssignRoleLog()
                            {
                                Id = int.Parse(reader["Id"].ToString()),
                                UserId = reader["UserId"].ToString(),
                                Comment = reader["Comment"].ToString(),
                                RoleId = reader["RoleId"].ToString(),
                                CreatedBy = reader["CreatedBy"].ToString(),
                                CreatedOn = DateTime.Parse(reader["CreatedOn"].ToString()),
                            };
                            assignRoleLogs.Add(assignRoleLog);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return assignRoleLogs;
        }

        public async Task<List<AbpUsers>> GetWorkflowUsersAsync()
        {
            const string spName = "[dbo].[GetABPUsers]";
            List<AbpUsers> users = new List<AbpUsers>();
            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    await sql.OpenAsync();

                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var user = new AbpUsers()
                            {
                                Id = long.Parse(reader["Id"]?.ToString()),
                                AuthenticationSource = reader["AuthenticationSource"]?.ToString(),
                                CreatorUserId = reader["CreatorUserId"]?.ToString(),
                                EmailAddress = reader["EmailAddress"]?.ToString(),
                                IsActive = bool.Parse(reader["IsActive"]?.ToString()),
                                Name = reader["Name"]?.ToString(),
                                NormalizedEmailAddress = reader["NormalizedEmailAddress"]?.ToString(),
                                NormalizedUserName = reader["NormalizedUserName"]?.ToString(),
                                PhoneNumber = reader["PhoneNumber"]?.ToString(),
                                Surname = reader["Surname"]?.ToString(),
                                UserName = reader["UserName"]?.ToString(),
                            };
                            users.Add(user);
                        }
                    }
                }
                await sql.CloseAsync();
            }
            return users;
        }

        public async Task<AbpUsers> AbpUserCreateAsync(AbpUsers users, CancellationToken cancellationToken)
        {
            const string spName = "[dbo].[AbpUserCreate]";
            string responseMessage = string.Empty;

            using (SqlConnection sql = new SqlConnection(connectionString: _connectionString))
            {
                using (SqlCommand cmd = new SqlCommand(spName, sql))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.Add(new SqlParameter("@AccessFailedCount", users.AccessFailedCount));
                    cmd.Parameters.Add(new SqlParameter("@AuthenticationSource", users.AuthenticationSource));
                    cmd.Parameters.Add(new SqlParameter("@ConcurrencyStamp", users.ConcurrencyStamp));
                    cmd.Parameters.Add(new SqlParameter("@CreationTime", users.CreationTime));
                    cmd.Parameters.Add(new SqlParameter("@CreatorUserId", users.CreatorUserId));
                    cmd.Parameters.Add(new SqlParameter("@DeleterUserId", users.DeleterUserId));
                    cmd.Parameters.Add(new SqlParameter("@DeletionTime", users.DeletionTime));
                    cmd.Parameters.Add(new SqlParameter("@EmailAddress", users.EmailAddress));
                    cmd.Parameters.Add(new SqlParameter("@EmailConfirmationCode", users.EmailConfirmationCode));
                    cmd.Parameters.Add(new SqlParameter("@IsActive", users.IsActive));
                    cmd.Parameters.Add(new SqlParameter("@IsDeleted", users.IsDeleted));
                    cmd.Parameters.Add(new SqlParameter("@IsEmailConfirmed", users.IsEmailConfirmed));
                    cmd.Parameters.Add(new SqlParameter("@IsLockoutEnabled", users.IsLockoutEnabled));
                    cmd.Parameters.Add(new SqlParameter("@IsPhoneNumberConfirmed", users.IsPhoneNumberConfirmed));
                    cmd.Parameters.Add(new SqlParameter("@IsTwoFactorEnabled", users.IsTwoFactorEnabled));
                    cmd.Parameters.Add(new SqlParameter("@LastLoginTime", users.LastLoginTime));
                    cmd.Parameters.Add(new SqlParameter("@LastModificationTime", users.LastModificationTime));
                    cmd.Parameters.Add(new SqlParameter("@LastModifierUserId", users.LastModifierUserId));
                    cmd.Parameters.Add(new SqlParameter("@LockoutEndDateUtc", users.LockoutEndDateUtc));
                    cmd.Parameters.Add(new SqlParameter("@Name", users.Name));
                    cmd.Parameters.Add(new SqlParameter("@NormalizedEmailAddress", users.NormalizedEmailAddress));
                    cmd.Parameters.Add(new SqlParameter("@NormalizedUserName", users.NormalizedUserName));
                    cmd.Parameters.Add(new SqlParameter("@Password", users.Password));
                    cmd.Parameters.Add(new SqlParameter("@PasswordResetCode", users.PasswordResetCode));
                    cmd.Parameters.Add(new SqlParameter("@PhoneNumber", users.SecurityStamp));
                    cmd.Parameters.Add(new SqlParameter("@SecurityStamp", users.SecurityStamp));
                    cmd.Parameters.Add(new SqlParameter("@Surname", users.Surname));
                    cmd.Parameters.Add(new SqlParameter("@TenantId", users.TenantId));
                    cmd.Parameters.Add(new SqlParameter("@UserName", users.UserName));

                    await sql.OpenAsync(cancellationToken);
                    await cmd.ExecuteNonQueryAsync(cancellationToken);

                }

                await sql.CloseAsync();
                return users;
            }
        }
    }
}
#endregion