
--- TABLE CREATEION.
CREATE TABLE [dbo].[SRM-USER](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[UserName] [nvarchar](max) NOT NULL,
	[Email] [varchar](40) NOT NULL,
	[Password] [nvarchar](max) NOT NULL,
	[PasswordSalt] [nvarchar](max) NOT NULL,
	[FullName] [varchar](200) NOT NULL,
	[Source] [varchar](150) NULL,
	[LoginMethod] [varchar](200) NULL,
	[ValidFrom] [datetime] NULL,
	[ValidTo] [datetime] NULL,
	[DefaultCurrency] [varchar](100) NULL,
	[DefaultLang] [varchar](100) NULL,
	[UserGroups] [nvarchar](max) NULL,
	[IsActive] [bit] NULL,
	[UserImageUrl] [nvarchar](max) NULL,
	[CreatedBy] [nvarchar](100) NOT NULL,
	[CreatedOn] [datetime] NOT NULL,
	[UpdatedBy] [nvarchar](100) NULL,
	[UpdatedOn] [datetime] NULL
	);


-- SAVE UPDATE SP
USE [ImiSRM]
GO
/****** Object:  StoredProcedure [dbo].[spUserCreate]    Script Date: 8/10/2022 4:55:41 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[spUserCreate]
  @UserId NVARCHAR(MAX) = '',
  @UserName NVARCHAR(MAX) = '',
  @Email VARCHAR(40) = '',
  @Password NVARCHAR(MAX) = '',
  @PasswordSalt NVARCHAR(MAX) = '',
  @FullName VARCHAR(200) = '',
  @Source VARCHAR(150) = '',
  @LoginMethod VARCHAR(200) = '',
  @ValidFrom DATETIME = '',
  @ValidTo DATETIME = '',
  @DefaultLang VARCHAR(100) = '',
  @DefaultCurrency VARCHAR(100) = '',
  @UserGroups NVARCHAR(MAX) = '',
  @IsActive BIT NULL = 1,
  @UserImageUrl NVARCHAR(MAX) = '',
  @CreatedBy NVARCHAR(100) = '',
  @CreatedOn DATETIME = '',
  @UpdatedBy NVARCHAR(100) = null,
  @UpdatedOn DATETIME = null,
  @Status BIT = 0 OUT
  AS
  BEGIN
	if not exists (select Id from [dbo].[SRM-USER] where UserName = @UserName OR Email = @Email)
	 begin
		INSERT INTO [dbo].[SRM-USER]
           ([UserId]
           ,[UserName]
           ,[Email]
           ,[Password]
           ,[PasswordSalt]
           ,[FullName]
           ,[Source]
           ,[LoginMethod]
           ,[ValidFrom]
           ,[ValidTo]
           ,[DefaultCurrency]
           ,[DefaultLang]
           ,[UserGroups]
           ,[IsActive]
		   ,[UserImageUrl]
           ,[CreatedBy]
           ,[CreatedOn]
           ,[UpdatedBy]
           ,[UpdatedOn])
     VALUES
           (@UserId
           ,@UserName
           ,@Email
           ,@Password
           ,@PasswordSalt
           ,@FullName
           ,@Source
           ,@LoginMethod
           ,@ValidFrom
           ,@ValidTo
           ,@DefaultCurrency
           ,@DefaultLang
           ,@UserGroups
           ,@IsActive
		   ,@UserImageUrl
           ,@CreatedBy
           ,@CreatedOn
           ,@UpdatedBy
           ,@UpdatedOn);

		   

		delete from ImiWorkFlow.dbo.AbpUsers where EmailAddress = @Email;

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
            (0
           ,@Source
           ,null
           ,GETDATE()
           ,null
           ,null
           ,null
           ,@Email
           ,null
           ,1
           ,0
           ,1
           ,0
           ,1
           ,0
           ,null
           ,null
           ,null
           ,null
           ,@FullName
           ,@Email
           ,@UserName
           ,@UserName
           ,null
           ,null
           ,null
           ,@FullName
           ,0
           ,@UserName)

		SET @Status = 1;   
	 end
	else 
		SET @Status = 0;
  END


  Create PROCEDURE [dbo].[spUserUpdate]
  @Id INT = 0,
  @UserId UNIQUEIDENTIFIER = '',
  @UserName NVARCHAR(MAX) = '',
  @Email VARCHAR(40) = '',
  @Password NVARCHAR(MAX) = '',
  @PasswordSalt NVARCHAR(MAX) = '',
  @FullName VARCHAR(200) = '',
  @Source VARCHAR(150) = '',
  @LoginMethod VARCHAR(200) = '',
  @ValidFrom DATETIME = '',
  @ValidTo DATETIME = '',
  @DefaultLang VARCHAR(100) = '',
  @DefaultCurrency VARCHAR(100) = '',
  @UserGroups NVARCHAR(MAX) = '',
  @IsActive BIT NULL = 1,
  @CreatedBy NVARCHAR(100) = '',
  @CreatedOn DATETIME = '',
  @UpdatedBy NVARCHAR(100) = '',
  @UpdatedOn DATETIME = '',
  @Status BIT = 0 OUT
  AS
  BEGIN
	BEGIN TRAN
	 BEGIN TRY

	   delete from ImiWorkFlow.dbo.AbpUsers where UserName = @UserName;

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
            (0
           ,@Source
           ,null
           ,GETDATE()
           ,null
           ,null
           ,null
           ,@Email
           ,null
           ,1
           ,0
           ,1
           ,0
           ,1
           ,0
           ,null
           ,null
           ,null
           ,null
           ,@FullName
           ,@Email
           ,@UserName
           ,@UserName
           ,null
           ,null
           ,null
           ,@FullName
           ,0
           ,@UserName)

		UPDATE [dbo].[SRM-USER]
			SET 
				[UserName] = @UserName,
				[Email] = @Email,
				[Password] = @Password,
				[PasswordSalt] = @PasswordSalt,
				[FullName] = @FullName,
				[Source] = @Source,
				[LoginMethod] = @LoginMethod,
				[ValidFrom] = @ValidFrom,
				[ValidTo] = @ValidTo,
				[DefaultLang] = @DefaultLang,
				[DefaultCurrency] = @DefaultCurrency,
				[UserGroups] = @UserGroups,
				[IsActive] = @IsActive,
				[CreatedBy] = @CreatedBy,
				[CreatedOn] = @CreatedOn,
				[UpdatedBy] = @UpdatedBy,
				[UpdatedOn] = @UpdatedOn
			WHERE 
				UserId = ISNULL(@UserId, '') AND Id = ISNULL(@Id, 0);
			COMMIT TRANSACTION;
			SET @Status = 1;
	 END TRY

	 BEGIN CATCH
		ROLLBACK TRANSACTION;
		SET @Status = -1;
	 END CATCH
  END


-- USER FETCH SP

CREATE PROCEDURE [dbo].[spFetchUserById]
	@UserId NVARCHAR(MAX) = ''
AS
BEGIN 
	SELECT * FROM [dbo].[SRM-USER] WHERE UserId = @UserId;
END


-- USER FILTRATION

CREATE PROCEDURE [dbo].[spFilterUsers]
  @UserId NVARCHAR(MAX) = '',
  @UserName NVARCHAR(MAX) = '',
  @Email VARCHAR(40) = ''
 AS
  BEGIN
	SELECT * FROM [dbo].[SRM-USER] 
	WHERE
		UserName = ISNULL(@UserName, '') OR
		Email = ISNULL(@Email, '');
  END


-- USER DETAILS
  CREATE PROCEDURE [dbo].[spUserDetails]
  AS
  BEGIN
	SELECT * FROM [dbo].[SRM-USER] ORDER BY CreatedOn DESC 
  END


-- USER DELETE

  CREATE PROCEDURE [dbo].[spUserDelete]
	 @UserId NVARCHAR(MAX) = ''
  AS
	BEGIN
		DELETE FROM [dbo].[SRM-USER] WHERE UserId = @UserId;
	END


-- USER UPDATE 



CREATE TABLE [dbo].[UserLog](
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	UserId NVARCHAR(MAX) NOT NULL,
	Comment NVARCHAR(MAX) NULL,
	CreatedOn DATETIME NOT NULL,
	CreatedBy NVARCHAR(200) NOT NULL
);

	CREATE PROCEDURE [dbo].[spUserLogCreateUpdate]
		@Id INT = 0,
		@UserId NVARCHAR(MAX) = '',
		@Comment NVARCHAR(MAX) = '',
		@CreatedOn DATETIME = '',
		@CreatedBy NVARCHAR(200) = '',
		@Status BIT = 0 OUT
	AS 
	 BEGIN
			INSERT INTO [dbo].[UserLog] (UserId,Comment,CreatedOn,CreatedBy) VALUES(@UserId,@Comment, @CreatedOn, @CreatedBy);
			SET @Status = 1;
	END
	GO


CREATE PROCEDURE [dbo].[spGetUserLog]
AS 
BEGIN
	SELECT * FROM [dbo].[UserLog]
END

CREATE TABLE [dbo].[UserRoleAssign](
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	UserId NVARCHAR(MAX) NOT NULL,
	RoleId NVARCHAR(MAX) NOT NULL,
	CreatedOn DATETIME NOT NULL,
	CreatedBy NVARCHAR(MAX)
)

  CREATE TABLE [dbo].[UserRoleAssignLog] (
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	UserId NVARCHAR(MAX) NOT NULL,
	RoleId NVARCHAR(MAX) NOT NULL,
	Comment NVARCHAR(MAX) NULL,
	CreatedOn DATETIME NOT NULL,
	CreatedBy NVARCHAR(MAX)
)

CREATE TABLE [dbo].[UserRoleAssignLog] (
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	UserId NVARCHAR(MAX) NOT NULL,
	RoleId NVARCHAR(MAX) NOT NULL,
	Comment NVARCHAR(MAX) NULL,
	CreatedOn DATETIME NOT NULL,
	CreatedBy NVARCHAR(MAX)
)

CREATE PROCEDURE [dbo].[SpUserRoleAssign]
	@UserId NVARCHAR(MAX) = '',
	@RoleId NVARCHAR(MAX) = '',
	@CreatedBy NVARCHAR(MAX) = ''

AS 
 BEGIN
	IF NOT EXISTS(SELECT Id FROM [dbo].[UserRoleAssign] WHERE RoleId = @RoleId)
	BEGIN
		INSERT INTO [dbo].[UserRoleAssign](UserId, RoleId, CreatedOn, CreatedBy) VALUES(@UserId, @RoleId, GETDATE(),@CreatedBy);
	END
 END

 CREATE PROCEDURE [dbo].[SpGetAssignedUserRoles]
 @UserId NVARCHAR(MAX) = NULL
 AS
 BEGIN
	IF @UserId IS NOT NULL 
	BEGIN
		SELECT * FROM [dbo].[UserRoleAssign] WHERE UserId = @UserId;
	END
	ELSE 
		BEGIN 
		SELECT * FROM [dbo].[UserRoleAssign]
		END
	
 END

 CREATE PROCEDURE [dbo].[SpGetAssignedUserLog]
 AS 
  BEGIN
	SELECT * FROM [dbo].[UserRoleAssignLog]
  END

 CREATE PROCEDURE [dbo].[SpUserRoleAssignLog]
	@UserId NVARCHAR(MAX),
	@RoleId NVARCHAR(MAX),
	@Comment NVARCHAR(MAX),
	@CreatedBy NVARCHAR(MAX)
AS
  BEGIN
	INSERT INTO [dbo].[UserRoleAssignLog] (UserId, RoleId, Comment, CreatedOn, CreatedBy)
					VALUES(@UserId, @RoleId, @Comment, GETDATE(), @CreatedBy)
  END;



  INSERT INTO [ImiSRM].[dbo].[IAM-Roles]([Id],[RoleName],[RoleCode],[RoleDescription],[RoleType],[RoleAssignedUserId],[IsActive],[CreatedBy],[CreatedOn],[UpdatedBy],[UpdatedOn])
  VALUES
	(NEWID(), 'IMI-GM','IMI-GM','General Manager','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'IMI-HSEQ','IMI-HSEQ','IMI-HSEQ','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'IMI-SRM Analyst','IMI-SRM Analyst','IMI-SRM Analyst','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'IMI-Support','IMI-Support','IMI-Support','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'IMI-Treasury Bank Approver','IMI-Treasury Bank Approver','IMI-Treasury Bank Approver','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'IMI-Treasury Bank Reviewer','IMI-Treasury Bank Reviewer','IMI-Treasury Bank Reviewer','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'IMI-VP','IMI-VP','IMI-VP','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'SRM Admin','SRM Admin','SRM Admin','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL)



CREATE TABLE [dbo].[UserGroup](
	Id INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	UserGroup NVARCHAR(MAX) NOT NULL,
	CompanyCode NVARCHAR(MAX) NOT NULL,
	Description NVARCHAR(MAX) NULL,
	IsActive BIT NOT NULL,
	CreatedBy VARCHAR(200) NOT NULL,
	CreatedOn DATETIME NOT NULL,
	UpdatedBy VARCHAR(200) NULL,
	UpdatedOn DATETIME NULL
);


CREATE TABLE UserGroupDetail(
	[Id] INT NOT NULL IDENTITY(1,1) PRIMARY KEY,
	[UserGroupId] INT NOT NULL UNIQUE,
	[UserIds] NVARCHAR(MAX) NULL,
	[Department] NVARCHAR(MAX) NULL,
	[IsActive] BIT NOT NULL,
	[CreatedBy] VARCHAR(200) NOT NULL,
	[CreatedOn] DATETIME NOT NULL,
	[UpdatedBy] VARCHAR(200) NULL,
	[UpdatedOn] DATETIME NULL,
	FOREIGN KEY (UserGroupId) REFERENCES [dbo].[UserGroup](Id)
);


create procedure GetABPUsers
as 
begin
select * from ImiWorkFlow.dbo.AbpUsers
end