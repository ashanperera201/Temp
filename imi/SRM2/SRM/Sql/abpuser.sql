DROP PROC AbpUserCreate;

CREATE PROCEDURE AbpUserCreate
@AccessFailedCount INT = 0,
@AuthenticationSource NVARCHAR(64) = '',
@ConcurrencyStamp NVARCHAR(128) = '',
@CreationTime DATETIME2(7) = '',
@CreatorUserId BIGINT = null,
@DeleterUserId BIGINT = null,
@DeletionTime DATETIME2(7) = null,
@EmailAddress NVARCHAR(256) = '',
@EmailConfirmationCode NVARCHAR(328) = '',
@IsActive BIT = 0,
@IsDeleted BIT = 0,
@IsEmailConfirmed BIT = 0,
@IsLockoutEnabled BIT = 0,
@IsPhoneNumberConfirmed BIT = 0,
@IsTwoFactorEnabled BIT = 0,
@LastLoginTime DATETIME2(7) = '',
@LastModificationTime DATETIME2(7) = '',
@LastModifierUserId BIGINT = null,
@LockoutEndDateUtc DATETIME2(7) = '',
@Name NVARCHAR(64) = '',
@NormalizedEmailAddress NVARCHAR(256) = '',
@NormalizedUserName NVARCHAR(256) = '',
@Password NVARCHAR(128) = '',
@PasswordResetCode NVARCHAR(328) = '',
@PhoneNumber NVARCHAR(32) = '',
@SecurityStamp NVARCHAR(128) = '',
@Surname NVARCHAR(64) = '',
@TenantId INT = 0,
@UserName NVARCHAR(256) = ''
AS 
BEGIN
INSERT INTO [ImiWorkFlow].[dbo].[AbpUsers]
           ([AccessFailedCount]
           ,[AuthenticationSource]
           ,[ConcurrencyStamp]
           ,[CreationTime]
           ,[CreatorUserId]
           ,[DeleterUserId]
           ,[DeletionTime]
           ,[EmailAddress]
           ,[EmailConfirmationCode]
           ,[IsActive]
           ,[IsDeleted]
           ,[IsEmailConfirmed]
           ,[IsLockoutEnabled]
           ,[IsPhoneNumberConfirmed]
           ,[IsTwoFactorEnabled]
           ,[LastLoginTime]
           ,[LastModificationTime]
           ,[LastModifierUserId]
           ,[LockoutEndDateUtc]
           ,[Name]
           ,[NormalizedEmailAddress]
           ,[NormalizedUserName]
           ,[Password]
           ,[PasswordResetCode]
           ,[PhoneNumber]
           ,[SecurityStamp]
           ,[Surname]
           ,[TenantId]
           ,[UserName])
     VALUES
            (
			@AccessFailedCount,
@AuthenticationSource,
@ConcurrencyStamp,
@CreationTime,
@CreatorUserId,
@DeleterUserId,
@DeletionTime,
@EmailAddress,
@EmailConfirmationCode,
@IsActive,
@IsDeleted,
@IsEmailConfirmed,
@IsLockoutEnabled,
@IsPhoneNumberConfirmed,
@IsTwoFactorEnabled,
@LastLoginTime,
@LastModificationTime,
@LastModifierUserId,
@LockoutEndDateUtc,
@Name,
@NormalizedEmailAddress,
@NormalizedUserName,
@Password,
@PasswordResetCode,
@PhoneNumber,
@SecurityStamp,
@Surname,
@TenantId,
@UserName)
END