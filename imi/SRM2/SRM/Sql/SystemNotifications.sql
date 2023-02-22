USE [ImiSRM2]
GO
/****** Object:  Table [dbo].[SYSTEM_NOTIFICATIONS]    Script Date: 02/11/2022 5:32:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SYSTEM_NOTIFICATIONS](
	[ID] [int] NULL,
	[TITLE] [varchar](50) NULL,
	[TYPE] [varchar](50) NULL,
	[CREATED_DATETIME] [datetime] NULL,
	[MODIFIED_DATETIME] [datetime] NULL,
	[STATUS] [varchar](50) NULL,
	[ASSIGNED_USER] [varchar](200) NULL,
	[DESCRIPTION] [varchar](200) NULL
) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[Isp_System_Notifications_Save]    Script Date: 02/11/2022 5:32:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_System_Notifications_Save]
		 @id int,
		 @title varchar(50),
		 @type varchar(50),
		 @status varchar(50),
		 @assignedUser varchar(200),
		 @description varchar(200)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		IF @id > 0
		BEGIN
			UPDATE SYSTEM_NOTIFICATIONS
               SET TITLE = @title,
				   TYPE = @type,
				   STATUS = @status,
				   ASSIGNED_USER = @assignedUser,
				   DESCRIPTION = @description
            WHERE  id = @id
			RETURN  @id
		   END          
		ELSE
		BEGIN
			INSERT INTO SYSTEM_NOTIFICATIONS(
			  TITLE,
			  TYPE,
			  STATUS,
			  ASSIGNED_USER,
			  DESCRIPTION
			) VALUES (
			@title,
			 @type,
			 @status,
			 @assignedUser,
			 @description
		)
		SET @id=SCOPE_IDENTITY()
		RETURN  @id
		END
		  
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH


END

GO
/****** Object:  StoredProcedure [dbo].[Isp_System_Notifications_Search]    Script Date: 02/11/2022 5:32:01 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_System_Notifications_Search
     	PROGRAM DESCRIPTION			: 	To get system notifications
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	-
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_System_Notifications_Search]
@loggedInUser varchar(max) OUTPUT
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT * from SYSTEM_NOTIFICATIONS SN where (SN.ASSIGNED_USER=@loggedInUser)
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
