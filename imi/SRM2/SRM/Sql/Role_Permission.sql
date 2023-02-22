Create Table [dbo].[IAM-Permissions](
  Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
  RoleId NVARCHAR(200) NOT NULL,
  RoleAssignedUserId NVARCHAR(250) NOT NULL,
  LevelCode NVARCHAR(100) NOT NULL UNIQUE,
  SectionCode NVARCHAR(100) NOT NULL UNIQUE,
  PermissionCode NVARCHAR(100) NOT NULL UNIQUE,
  PermissionName NVARCHAR(200) NOT NULL,
  EnableToView BIT NULL DEFAULT 0,
  EnableToEdit BIT NULL DEFAULT 0,
  CreatedBy NVARCHAR(250) NOT NULL,
  CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
  UpdatedBy NVARCHAR(250) NULL DEFAULT NULL,
  UpdatedOn DATETIME NULL DEFAULT NULL
);


CREATE TABLE [dbo].[IAM-Roles](
	Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	RoleName NVARCHAR(300) NOT NULL UNIQUE,
	RoleCode NVARCHAR(300) NOT NULL UNIQUE,
	RoleDescription NVARCHAR(MAX) NULL,
	RoleType NVARCHAR(300) NOT NULL,
	RoleAssignedUserId NVARCHAR(300),
	IsActive [bit] NOT NULL,
	CreatedBy NVARCHAR(250) NOT NULL,
    CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy NVARCHAR(250) NULL DEFAULT NULL,
    UpdatedOn DATETIME NULL DEFAULT NULL
);

Create Table [dbo].[IAM-VisibilityPermissions](
	Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
	RoleId UNIQUEIDENTIFIER NOT NULL,
	AssignedUser NVARCHAR(MAX) NOT NULL,
	VisibilityPermissionJson NVARCHAR(MAX) NOT NULL,
	IsActive [bit] NOT NULL,
	CreatedBy NVARCHAR(250) NOT NULL,
    CreatedOn DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedBy NVARCHAR(250) NULL DEFAULT NULL,
    UpdatedOn DATETIME NULL DEFAULT NULL
);


--DROP TABLE [dbo].[IAM-Permissions];
--DROP TABLE [dbo].[IAM-Roles];
--DROP TABLE [dbo].[IAM-VisibilityPermissions];

SET ANSI_NULLS ON
GO

--DROP PROC [dbo].[IAM-VisibilityPermissionSaveUpdate];
--DROP PROC [dbo].[IAM-DeleteRole];
--DROP PROC [dbo].[IAM-GetRoles];
--DROP PROC [dbo].[IAM-RoleSaveUpdate];
--DROP PROC [dbo].[IAM-GetPermissions];
--DROP PROC [dbo].[IAM-PermissionSaveUpdate];



CREATE PROCEDURE [dbo].[IAM-VisibilityPermissionSaveUpdate]   
    @Id UNIQUEIDENTIFIER = '',
	@RoleId UNIQUEIDENTIFIER = '',
	@AssignedUser NVARCHAR(MAX) = '',
	@VisibilityPermissionJson NVARCHAR(MAX) = '',
	@IsActive BIT = 0,
    @CreatedBy NVARCHAR(250) = '',
    @CreatedOn DATETIME = NULL,
    @UpdatedBy NVARCHAR(250) = '',
    @UpdatedOn DATETIME = NULL,
	@Status BIT = 0 OUT,
	@Response VARCHAR(MAX) OUTPUT
AS   
BEGIN
SET NOCOUNT ON
	BEGIN TRAN
		BEGIN TRY
			IF EXISTS (SELECT Id FROM [dbo].[IAM-VisibilityPermissions] WHERE Id = @Id OR RoleId = @RoleId) 
				BEGIN
					UPDATE [dbo].[IAM-VisibilityPermissions]
					SET 
						RoleId = @RoleId,
						VisibilityPermissionJson = @VisibilityPermissionJson,
						AssignedUser = @AssignedUser,
						IsActive = @IsActive,
						CreatedBy = @CreatedBy,
						UpdatedBy = @UpdatedBy,
						UpdatedOn = GETDATE()
					 WHERE Id = @Id;

					COMMIT TRANSACTION;
					SET @Status = 1
					SET @Response = 'Successfully udpated.';
				END
			ELSE
				BEGIN
					IF NOT EXISTS (SELECT Id FROM [dbo].[IAM-VisibilityPermissions] WHERE Id = @Id)
						BEGIN
							INSERT INTO [dbo].[IAM-VisibilityPermissions]
								(
									Id,
									RoleId,
									AssignedUser,
									VisibilityPermissionJson,
									IsActive,
									CreatedBy,
									CreatedOn,
									UpdatedBy,
									UpdatedOn
								)
								SELECT 
									@Id,
									@RoleId,
									@AssignedUser,
									@VisibilityPermissionJson,
									1,
									@CreatedBy,
									@CreatedOn,
									NULL,
									NULL

								COMMIT TRANSACTION;
								SET @Status = 1;
								SET @Response = 'Successfully saved.';
							END
						ELSE
							BEGIN
								ROLLBACK TRANSACTION;
								SET @Status = 0;
								SET @Response = 'This record is already exists.';
							END
				END			
		END TRY

		BEGIN CATCH
			ROLLBACK TRANSACTION;
			SET @Status = 0;
			SET @Response = 'Transaction is failed.';
		END CATCH
END
GO
----------------

CREATE PROCEDURE [dbo].[IAM-DeleteRole]   
    @RoleId UNIQUEIDENTIFIER = '',   
	@Status BIT = 0 OUT
AS   
	SET NOCOUNT ON
	BEGIN TRAN
		BEGIN TRY
			DELETE FROM [dbo].[IAM-Roles] WHERE Id = @RoleId;	
			SET @Status = 1;
			COMMIT TRANSACTION;
		END TRY

		BEGIN CATCH
			ROLLBACK TRANSACTION;
			SET @Status = 0;
		END CATCH
GO

----------------------

SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[IAM-GetRoles]
 @RoleAssignedUserId NVARCHAR(250) = NULL
AS 
	BEGIN
	 IF @RoleAssignedUserId IS NOT NULL
		SELECT * FROM [dbo].[IAM-Roles] WHERE RoleAssignedUserId = @RoleAssignedUserId;
	 ELSE 
		SELECT * FROM [dbo].[IAM-Roles]
	END;
GO

-------------------

CREATE PROCEDURE [dbo].[IAM-RoleSaveUpdate]   
    @Id UNIQUEIDENTIFIER = '',   
	@RoleName NVARCHAR(300) = '',
	@RoleCode NVARCHAR(300) = '',
    @RoleDescription NVARCHAR(MAX) = '',
    @RoleType NVARCHAR(300) = '',
    @RoleAssignedUserId NVARCHAR(300) = '',
	@IsActive BIT = 0,
    @CreatedBy NVARCHAR(250) = '',
    @CreatedOn DATETIME = NULL,
    @UpdatedBy NVARCHAR(250) = '',
    @UpdatedOn DATETIME = NULL,
	@Status BIT = 0 OUT,
	@Response VARCHAR(MAX) OUTPUT
AS   
BEGIN
SET NOCOUNT ON
	BEGIN TRAN
		BEGIN TRY
			IF EXISTS (SELECT Id FROM [dbo].[IAM-Roles] WHERE Id = @Id) 
				BEGIN
					UPDATE [dbo].[IAM-Roles]	
					SET 
						RoleName = @RoleName,
						RoleCode = @RoleCode,
						RoleDescription = @RoleDescription,
						RoleType = @RoleType,
						RoleAssignedUserId = @RoleAssignedUserId,
						IsActive = @IsActive,
						CreatedBy = @CreatedBy,
						UpdatedBy = @UpdatedBy,
						UpdatedOn = GETDATE()
					 WHERE Id = @Id;

					COMMIT TRANSACTION;
					SET @Status = 1
					SET @Response = 'Successfully role udpated.';
				END
			ELSE
				BEGIN
					IF NOT EXISTS (SELECT Id FROM [dbo].[IAM-Roles] WHERE RoleName = @RoleName)
						BEGIN
							INSERT INTO [dbo].[IAM-Roles]
								(
									Id,
									RoleName,
									RoleCode,
									RoleDescription,
									RoleType,
									RoleAssignedUserId,
									IsActive,
									CreatedBy,
									CreatedOn,
									UpdatedBy,
									UpdatedOn
								)
								SELECT 
									@Id,
									@RoleName,
									@RoleCode,
									@RoleDescription,
									@RoleType,
									@RoleAssignedUserId,
									@IsActive,
									@CreatedBy,
									@CreatedOn,
									@UpdatedBy,
									@UpdatedOn

								COMMIT TRANSACTION;
								SET @Status = 1;
								SET @Response = 'Successfully role saved.';
							END
						ELSE
							BEGIN
								ROLLBACK TRANSACTION;
								SET @Status = 0;
								SET @Response = 'This role is already exists.';
							END
				END			
		END TRY

		BEGIN CATCH
			ROLLBACK TRANSACTION;
			SET @Status = 0;
			SET @Response = 'Transaction is failed.';
		END CATCH
END
GO

-----------------

CREATE PROCEDURE [dbo].[IAM-GetPermissions]
 @AssignedUserId NVARCHAR(250) = ''
AS 
	BEGIN

	SELECT * FROM [dbo].[IAM-Permissions] WHERE RoleAssignedUserId = @AssignedUserId
	END;
GO

-------------------------

CREATE PROCEDURE [dbo].[IAM-PermissionSaveUpdate]   
    @Id UNIQUEIDENTIFIER = '',   
    @RoleId NVARCHAR(200) = '',
	@RoleAssignedUserId NVARCHAR(250) = '',
	@LevelCode NVARCHAR(100) = '',
    @SectionCode NVARCHAR(100) = '',
    @PermissionCode NVARCHAR(100) = '',
    @PermissionName NVARCHAR(200) = '',
    @EnableToView BIT = 0,
    @EnableToEdit BIT = 0,
    @CreatedBy NVARCHAR(250) = '',
    @CreatedOn DATETIME = NULL,
    @UpdatedBy NVARCHAR(250) = '',
    @UpdatedOn DATETIME = NULL,
	@Message BIT = 0 OUT
AS   
	SET NOCOUNT ON
	BEGIN TRAN
		BEGIN TRY
			IF EXISTS (SELECT Id FROM [dbo].[IAM-Permissions] WHERE Id = @Id) 
				BEGIN
					UPDATE [dbo].[Permissions]
					SET 
						RoleId = @RoleId,
						RoleAssignedUserId = @RoleAssignedUserId,
						LevelCode = @LevelCode,
						SectionCode = @SectionCode,
						PermissionCode = @PermissionCode,
						PermissionName = @PermissionName,
						EnableToView = @EnableToView,
						EnableToEdit = @EnableToEdit,
						CreatedBy = @CreatedBy,
						UpdatedBy = @UpdatedBy,
						UpdatedOn = GETDATE()
					 WHERE Id = @Id;

					COMMIT TRANSACTION;
					SET @Message = 1
				END
			ELSE
				BEGIN
					INSERT INTO [dbo].[IAM-Permissions]
					(
					      [Id],
						  [RoleId],
						  [RoleAssignedUserId],
						  [LevelCode],
						  [SectionCode],
						  [PermissionCode],
						  [PermissionName],
						  [EnableToView],
						  [EnableToEdit],
						  [CreatedBy]
					)
					SELECT 
						  @Id,
						  @RoleId,
						  @RoleAssignedUserId,
						  @LevelCode,
						  @SectionCode,
						  @PermissionCode,
						  @PermissionName,
						  @EnableToView,
						  @EnableToEdit,
						  @CreatedBy

					COMMIT TRANSACTION;
					SET @Message = 0;
				END			
		END TRY

		BEGIN CATCH
			ROLLBACK TRANSACTION;
			SET @Message = 0;
		END CATCH
GO


----
CREATE PROCEDURE [dbo].[IAM-GetVisibilityPermission]
 @RoleId NVARCHAR(250) = ''
AS 
	BEGIN

	SELECT * FROM [dbo].[IAM-VisibilityPermissions] WHERE RoleId = @RoleId
	END;	
	
-----------
	
CREATE PROCEDURE [dbo].[IAM-GetVisibilityPermissionByUser] 
	@AssignedUserId NVARCHAR(MAX) = ''
AS
 BEGIN
	SELECT * FROM [dbo].[IAM-VisibilityPermissions] WHERE AssignedUser = @AssignedUserId;
 END
  

 INSERT INTO [ImiSRM].[dbo].[IAM-Roles]([Id],[RoleName],[RoleCode],[RoleDescription],[RoleType],[RoleAssignedUserId],[IsActive],[CreatedBy],[CreatedOn],[UpdatedBy],[UpdatedOn])
  VALUES
	(NEWID(), 'Buyer','Buyer','Buyer','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'Watcher','Watcher','Watcher','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'Commercial Bid Evaluator','Commercial Bid Evaluator','Commercial Bid Evaluator','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'Technical Bid Evaluator','Technical Bid Evaluator','Technical Bid Evaluator','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL),
	(NEWID(), 'Manager','Manager','Manager','Internal','auth0|602ca3115e098c0070cb4d0f', 1, 'auth0|602ca3115e098c0070cb4d0f' , GETDATE(), '', NULL)
	