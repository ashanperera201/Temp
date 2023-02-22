USE [ImiSRM2]
GO
/****** Object:  Table [dbo].[REVIEW_APPROVERS]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REVIEW_APPROVERS](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[STEP_NO] [int] NOT NULL,
	[APPROVER_ID] [int] NOT NULL,
	[APPROVER_NAME] [varchar](200) NULL,
	[STATUS] [varchar](200) NULL,
	[EMAIL] [varchar](max) NULL,
	[OUTCOME_ID] [int] NULL,
	[CREATED_DATE] [date] NULL,
	[MODIFIED_DATE] [date] NULL,
	[COMMENTS] [varchar](max) NULL,
	[TYPE] [varchar](200) NULL,
	[ROLE] [varchar](200) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REVIEW_OUTCOMES]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REVIEW_OUTCOMES](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SESSION_ID] [int] NOT NULL,
	[SUPPLIER_ID] [int] NOT NULL,
	[OUTCOME] [varchar](200) NULL,
	[STATUS] [varchar](200) NULL,
	[FINAL_SCORE] [int] NULL,
	[APPROVAL_INITIATION_DATE] [datetime] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REVIEW_RESPONSES]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REVIEW_RESPONSES](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[REVIEW_SESSION_ID] [int] NOT NULL,
	[REVIEW] [varchar](max) NULL,
	[CREATED_DATE] [datetime] NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[CONDUCTED_USER] [varchar](50) NULL,
	[STATUS] [varchar](50) NULL,
	[SCORE] [int] NULL,
	[SUPPLIER_ID] [int] NULL,
	[APPROVAL_INITIATION_DATE] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REVIEW_SESSION_SCHEDULES]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REVIEW_SESSION_SCHEDULES](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FORM_ID] [int] NOT NULL,
	[CREATED_DATE] [datetime] NOT NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[CREATED_USER] [varchar](50) NULL,
	[EVALUATION_NAME] [varchar](200) NULL,
	[FREQUENCY] [varchar](200) NULL,
	[STATUS] [varchar](50) NULL,
	[ASSIGNED_USERS] [varchar](max) NOT NULL,
	[SUPPLIERS] [varchar](max) NULL,
	[GRADING_METHOD] [varchar](200) NULL,
	[GRADE_CATEGORIES] [varchar](max) NULL,
	[REVIEWER_WEIGHTS] [varchar](max) NULL,
	[MIN_GRADE_THRESHOLD] [int] NULL,
	[STARTDATE] [datetime] NULL,
	[ENDDATE] [datetime] NULL,
	[ASSIGN_TYPE] [varchar](200) NULL,
	[ASSIGNED_USER_ROLES] [varchar](max) NULL,
	[SUPPLIER_BLOCKER] [tinyint] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[REVIEW_SESSIONS]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REVIEW_SESSIONS](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[FORM_ID] [int] NOT NULL,
	[CREATED_DATE] [datetime] NOT NULL,
	[MODIFIED_DATE] [datetime] NULL,
	[CREATED_USER] [varchar](50) NULL,
	[EVALUATION_NAME] [varchar](200) NULL,
	[REVIEW_YEAR] [varchar](50) NULL,
	[STATUS] [varchar](50) NULL,
	[ASSIGNED_USERS] [varchar](max) NOT NULL,
	[SUPPLIERS] [varchar](max) NOT NULL,
	[GRADING_METHOD] [varchar](200) NULL,
	[GRADE_CATEGORIES] [varchar](max) NULL,
	[REVIEWER_WEIGHTS] [varchar](max) NULL,
	[MIN_GRADE_THRESHOLD] [int] NULL,
	[STARTDATE] [datetime] NULL,
	[ENDDATE] [datetime] NULL,
	[PRESET_PERIOD] [varchar](200) NOT NULL,
	[PERIOD_TYPE] [varchar](50) NULL,
	[ASSIGN_TYPE] [varchar](200) NULL,
	[ASSIGNED_USER_ROLES] [varchar](max) NULL,
	[SUPPLIER_BLOCKER] [tinyint] NULL,
	[FREQUENCY] [varchar](200) NULL,
	[SCHEDULED] [tinyint] NULL,
	[MATERIALS] [tinyint] NULL,
	[SERVICES] [tinyint] NULL,
	[SCORED] [tinyint] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[Isp_AllSupplier_Search_Trunc]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_AllSupplier_Search_Trunc]
	@supplierIds varchar(MAX) =''
AS

BEGIN
	SET NOCOUNT ON  
	;
	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
			SELECT S.SUPPLIER_ID
                ,S.SUPPLIER_NAME
				,S.SUPPLIER_TYPE
				,S.IFS_CODE
                ,CASE WHEN S.IFS_CODE <> '' THEN 'Pushed' ELSE 'Not Pushed'  END AS PUSHEDSUPPLIERSTATUS
				,CASE WHEN IT.INVITE_SUPPLIER_NAME is null then 'No' else 'Yes' end as INVITED
         FROM SUPPLIERS_TAB S 
		 LEFT JOIN INVITESUPPLIERS_TAB IT on IT.INVITE_SUPPLIER_NAME = S.SUPPLIER_NAME
		 WHERE (S.STATUS='approved')and (@supplierIds='' OR (CHARINDEX(CONVERT(VARCHAR(10), S.SUPPLIER_ID), @supplierIds) > 0))
         ORDER BY S.SUPPLIER_NAME ASC
		RETURN (0)
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END	
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Approver_By_Outcome]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[Isp_Review_Approver_By_Outcome]
	@outcomeId int OUTPUT
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT * FROM REVIEW_APPROVERS RA

		where RA.OUTCOME_ID=@outcomeId;
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Approver_Save]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[Isp_Review_Approver_Save]
		@id int,
		@status varchar(200),
		@comments varchar(MAX) = NULL,
		@approverId int,
		@approverName varchar(200),
		@outcomeId int,
		@role varchar(200),
		@stepNo int,
		@type varchar(200),
		@email varchar(200)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		IF @id > 0
		BEGIN
			UPDATE REVIEW_APPROVERS
               SET STATUS = @status,
				   COMMENTS= @comments,
				   MODIFIED_DATE = GETDATE()
            WHERE  id = @id
			RETURN  @id
		   END          
		ELSE
		BEGIN
			INSERT INTO REVIEW_APPROVERS(
			
			  STATUS,
			  APPROVER_ID,
			  APPROVER_NAME,
			  OUTCOME_ID,
			  STEP_NO,
			  EMAIL,
			  TYPE,
			  ROLE,
			  CREATED_DATE,
			  MODIFIED_DATE
			) VALUES (
			
			 @status,
			 @approverId,
			 @approverName,
			 @outcomeId,
			 @stepNo,
			 @email,
			 @type,
			 @role,
			 GETDATE(),
			 GETDATE()

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
/****** Object:  StoredProcedure [dbo].[Isp_Review_Outcome_Block_Supplier]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE   PROCEDURE [dbo].[Isp_Review_Outcome_Block_Supplier]
@supplierId int
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		BEGIN
			UPDATE SUPPLIERS_TAB
               SET STATUS = 'blocked'
            WHERE  SUPPLIER_ID = @supplierId
			RETURN  @supplierId
		   END          
		
	
		  
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH


END

GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Outcome_Save]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_Review_Outcome_Save]
@id int,
		 @sessionId int,
		 @supplierId int,
		 @finalScore int,
		 @status varchar(200),
		 @outcome varchar(200),
		 @approval_initiation_date datetime = null
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		IF @id > 0
		BEGIN
			UPDATE REVIEW_OUTCOMES
               SET SESSION_ID = @sessionId,
				   SUPPLIER_ID = @supplierId,
				   STATUS = @status,
				   OUTCOME = @outcome,
				   FINAL_SCORE = @finalScore,
				   APPROVAL_INITIATION_DATE = @approval_initiation_date
            WHERE  id = @id
			RETURN  @id
		   END          
		ELSE
		BEGIN
			INSERT INTO REVIEW_OUTCOMES(
			  SESSION_ID,
			  SUPPLIER_ID,
			  STATUS,
			  FINAL_SCORE,
			  OUTCOME,
			  APPROVAL_INITIATION_DATE
			) VALUES (
			@sessionId,
			 @supplierId,
			 @status,
			 @finalScore,
			 @outcome,
			 @approval_initiation_date
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
/****** Object:  StoredProcedure [dbo].[Isp_Review_Outcome_Search]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Outcome_Search
     	PROGRAM DESCRIPTION			: 	To get reviews response
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_Review_Outcome_Search]
@loggedInUser varchar(max) OUTPUT
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT RO.SUPPLIER_ID, RO.Id, RO.SESSION_ID, RO.OUTCOME, RO.APPROVAL_INITIATION_DATE, ST.SUPPLIER_NAME, RS.EVALUATION_NAME, RS.GRADE_CATEGORIES,
		RS.STARTDATE, RS.ENDDATE, RS.REVIEW_YEAR, RS.PERIOD_TYPE, RS.PRESET_PERIOD,RS.CREATED_USER, RO.FINAL_SCORE,
		RS.GRADING_METHOD, RS.MIN_GRADE_THRESHOLD, RS.REVIEWER_WEIGHTS, RO.STATUS FROM REVIEW_OUTCOMES RO
		INNER JOIN SUPPLIERS_TAB ST ON ST.SUPPLIER_ID=RO.SUPPLIER_ID
		LEFT JOIN REVIEW_APPROVERS RA ON RA.OUTCOME_ID = RO.ID 
		INNER JOIN REVIEW_SESSIONS RS ON RS.ID = RO.SESSION_ID where RS.CREATED_USER=@loggedInUser or RA.APPROVER_NAME=@loggedInUser
		GROUP BY
		RO.APPROVAL_INITIATION_DATE,
    RO.SUPPLIER_ID, RO.Id, RO.SESSION_ID, RO.OUTCOME, RO.FINAL_SCORE, ST.SUPPLIER_NAME, RS.EVALUATION_NAME, RS.GRADE_CATEGORIES,
		RS.STARTDATE, RS.ENDDATE, RS.REVIEW_YEAR, RS.PERIOD_TYPE, RS.PRESET_PERIOD,RS.CREATED_USER,
		RS.GRADING_METHOD, RS.MIN_GRADE_THRESHOLD, RS.REVIEWER_WEIGHTS, RO.STATUS
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Outcome_Search_By_Supplier]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Outcome_Search_By_Supplier
     	PROGRAM DESCRIPTION			: 	To get reviews response
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_Review_Outcome_Search_By_Supplier]
	@sessionId int OUTPUT,
	@supplierId int
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT RO.SUPPLIER_ID, RO.Id, RO.STATUS,  RO.FINAL_SCORE, RO.SESSION_ID, RO.OUTCOME, RO.APPROVAL_INITIATION_DATE, RS.EVALUATION_NAME, RS.REVIEW_YEAR, RS.CREATED_DATE, RS.CREATED_USER,
		ST.SUPPLIER_NAME, RS.PRESET_PERIOD, RS.PERIOD_TYPE, RS.STARTDATE, RS.ENDDATE FROM REVIEW_OUTCOMES RO
		INNER JOIN REVIEW_SESSIONS RS ON RS.ID = RO.SESSION_ID
		INNER JOIN SUPPLIERS_TAB ST ON ST.SUPPLIER_ID = RO.SUPPLIER_ID
		where (@sessionId=0 or RO.SESSION_ID=@sessionId) AND RO.SUPPLIER_ID=@supplierId;
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Response_All_Search]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Responses_All_Search
     	PROGRAM DESCRIPTION			: 	To get all supplier reviews
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_Review_Response_All_Search]
@loggedInUser varchar(max) OUTPUT

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT RR.CREATED_DATE, RR.Id, RR.REVIEW_SESSION_ID, RR.REVIEW, RR.SCORE, RS.CREATED_USER, RS.PERIOD_TYPE, RS.PRESET_PERIOD,
		RS.STARTDATE, RS.ENDDATE, RS.REVIEW_YEAR, RR.APPROVAL_INITIATION_DATE,
		RR.STATUS, RR.MODIFIED_DATE, RR.CONDUCTED_USER, RS.EVALUATION_NAME , ST.SUPPLIER_ID, ST.SUPPLIER_NAME
		FROM REVIEW_RESPONSES RR INNER JOIN REVIEW_SESSIONS RS ON RS.ID = RR.REVIEW_SESSION_ID
		INNER JOIN SUPPLIERS_TAB ST ON ST.SUPPLIER_ID = RR.SUPPLIER_ID
		LEFT JOIN REVIEW_APPROVERS RA ON RA.OUTCOME_ID = RR.ID 
		where RS.CREATED_USER=@loggedInUser or RA.APPROVER_NAME=@loggedInUser GROUP BY RR.CREATED_DATE, RR.Id, RR.REVIEW_SESSION_ID, RR.REVIEW, RR.SCORE, RS.CREATED_USER, RS.PERIOD_TYPE, RS.PRESET_PERIOD,
		RS.STARTDATE, RS.ENDDATE, RS.REVIEW_YEAR, RR.APPROVAL_INITIATION_DATE,
		RR.STATUS, RR.MODIFIED_DATE, RR.CONDUCTED_USER, RS.EVALUATION_NAME , ST.SUPPLIER_ID, ST.SUPPLIER_NAME;

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Response_Save]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_Review_Response_Save]
		 @id int,
		 @reviewSessionId int,
		 @review varchar(max),
		 @conductedUser varchar(50),
		 @status varchar(50),
		 @score int,
		 @supplierId int,
		 @waitingStatus varchar(200),
		 @approvalReadyStatus varchar(200),
		 @approvalWaitingStatus varchar(200),
		 @completedStatus varchar(200),
		 @approval_initiation_date datetime = null
		 

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		IF @id > 0
		BEGIN
			UPDATE REVIEW_RESPONSES
            SET    REVIEW = @review,
				   REVIEW_SESSION_ID = @reviewSessionId,
				   MODIFIED_DATE = GETDATE(),
				   CONDUCTED_USER = @conductedUser,
				   SCORE = @score,
				   STATUS =  @status,
				   SUPPLIER_ID = @supplierId,
				   APPROVAL_INITIATION_DATE = @approval_initiation_date
            WHERE  id = @id
			
			SELECT  RR.ID from REVIEW_RESPONSES RR
		where RR.REVIEW_SESSION_ID=@reviewSessionId and RR.SUPPLIER_ID =@supplierId and RR.STATUS=@waitingStatus;
		IF @@ROWCOUNT = 0
			BEGIN
				UPDATE REVIEW_OUTCOMES
               SET 
				   STATUS = @approvalReadyStatus			  
            WHERE  SUPPLIER_ID = @supplierId and SESSION_ID=@reviewSessionId
			END	


			SELECT  RR.ID from REVIEW_RESPONSES RR
		where RR.REVIEW_SESSION_ID=@reviewSessionId and RR.SUPPLIER_ID =@supplierId and (RR.STATUS=@waitingStatus or RR.STATUS=@approvalReadyStatus or 
		RR.STATUS=@approvalWaitingStatus);
		IF @@ROWCOUNT = 0
			BEGIN
				UPDATE REVIEW_OUTCOMES
               SET 
				   STATUS = @completedStatus			  
            WHERE  SUPPLIER_ID = @supplierId and SESSION_ID=@reviewSessionId
			END	


		   END          
		ELSE
		BEGIN
			INSERT INTO REVIEW_RESPONSES(
			  REVIEW_SESSION_ID,
			  REVIEW,
			  CREATED_DATE,
			  MODIFIED_DATE,
			  CONDUCTED_USER,
			  STATUS,
			  SCORE,
			  SUPPLIER_ID
			) VALUES (
			 @reviewSessionId,
			 @review,
			 GETDATE(),
			 GETDATE(),
			 @conductedUser,
			 @status,
			 @score,
			 @supplierId
		)
		SET @id=SCOPE_IDENTITY()
		RETURN  @id;
		END
		  
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END

GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Response_Scores_By_Session]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO




/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Response_Scores_By_Session
     	PROGRAM DESCRIPTION			: 	To get reviews response
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_Review_Response_Scores_By_Session]
	@ReviewSessionId int OUTPUT,
	@SupplierId int OUTPUT,
	 @rejectedStatus varchar(200)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT  RR.Id, RR.REVIEW_SESSION_ID, RR.SCORE, ST.SUPPLIER_ID, ST.SUPPLIER_NAME, RR.CREATED_DATE, RR.REVIEW,
		RR.CONDUCTED_USER FROM REVIEW_RESPONSES RR
		INNER JOIN REVIEW_SESSIONS RS ON RS.ID = RR.REVIEW_SESSION_ID
		INNER JOIN SUPPLIERS_TAB ST ON ST.SUPPLIER_ID = RR.SUPPLIER_ID
		where RR.REVIEW_SESSION_ID=@ReviewSessionId and RR.SUPPLIER_ID=@SupplierId and RR.status!=@rejectedStatus;
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Response_Search]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Responses_Search
     	PROGRAM DESCRIPTION			: 	To get reviews response
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_Review_Response_Search]
	@ReviewResponseId int output
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT RR.CREATED_DATE, RR.review, RR.REVIEW_SESSION_ID, RR.SCORE, RF.TITLE, RF.SUBTITLE, RR.ID, RF.Id AS FORM_ID, RF.LOGO, RF.BANNER,
		ST.SUPPLIER_ID, ST.SUPPLIER_NAME, RS.STARTDATE, RS.ENDDATE, RS.REVIEW_YEAR, RS.PERIOD_TYPE, RS.PRESET_PERIOD,RS.CREATED_USER,
		RR.APPROVAL_INITIATION_DATE, RR.STATUS, RR.MODIFIED_DATE, RR.CONDUCTED_USER, RS.EVALUATION_NAME FROM REVIEW_RESPONSES RR
		INNER JOIN REVIEW_SESSIONS RS ON RS.ID = RR.REVIEW_SESSION_ID
		INNER JOIN REVIEW_FORMS RF ON RS.FORM_ID = RF.ID
		INNER JOIN SUPPLIERS_TAB ST ON ST.SUPPLIER_ID = RR.SUPPLIER_ID
		where RR.Id=@ReviewResponseId;
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Response_Search_By_Session_And_User]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO



/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Responses_Search
     	PROGRAM DESCRIPTION			: 	To get reviews response
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_Review_Response_Search_By_Session_And_User]
	@ReviewSessionId int OUTPUT,
	@ConductedUserId nvarchar(50),
	@SupplierId int
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT RR.CREATED_DATE, RR.ID, RF.Id AS FORM_ID, RF.TITLE, RF.SUBTITLE, RR.review, RR.REVIEW_SESSION_ID, RR.SCORE, ST.SUPPLIER_ID, ST.SUPPLIER_NAME,
		RS.STARTDATE, RS.ENDDATE, RS.REVIEW_YEAR, RS.PERIOD_TYPE, RS.PRESET_PERIOD,RS.CREATED_USER, RF.LOGO, RF.BANNER, RR.APPROVAL_INITIATION_DATE,
		RR.STATUS, RR.MODIFIED_DATE, RR.CONDUCTED_USER, RS.EVALUATION_NAME FROM REVIEW_RESPONSES RR
		INNER JOIN REVIEW_SESSIONS RS ON RS.ID = RR.REVIEW_SESSION_ID
		INNER JOIN SUPPLIERS_TAB ST ON ST.SUPPLIER_ID = RR.SUPPLIER_ID
		INNER JOIN REVIEW_FORMS RF ON RS.FORM_ID = RF.ID
		where RR.REVIEW_SESSION_ID=@ReviewSessionId AND RR.CONDUCTED_USER=@ConductedUserId
		AND RR.SUPPLIER_ID=@SupplierId;
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Response_Waiting_Status]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO





/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Review_Response_Waiting_Status
     	PROGRAM DESCRIPTION			: 	To get reviews response
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@Supplier DTO
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Yumna      		11-04-2022			Original Version						
	****************************************************************************************************************************************************************/


CREATE   PROCEDURE [dbo].[Isp_Review_Response_Waiting_Status]
	@supplierId int OUTPUT,
	@sessionId int,
	@waitingStatus varchar(200)

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		SELECT  RR.Id from REVIEW_RESPONSES RR
		where RR.REVIEW_SESSION_ID=@sessionId and RR.SUPPLIER_ID =@supplierId and RR.STATUS=@waitingStatus;
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Session_All_Search]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[Isp_Review_Session_All_Search]

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		
		SELECT RS.SUPPLIERS, RS.CREATED_DATE, RS.FORM_ID, RS.Id, RS.ASSIGNED_USERS, RS.SUPPLIERS, RS.GRADING_METHOD, RS.GRADE_CATEGORIES,
		RS.STATUS, RS.REVIEW_YEAR, RS.EVALUATION_NAME, RS.MODIFIED_DATE, RS.CREATED_USER,  RS.REVIEWER_WEIGHTS, RS.SUPPLIER_BLOCKER,
		RS.MIN_GRADE_THRESHOLD, RS.PRESET_PERIOD, RS.STARTDATE, RS.ENDDATE, RS.PERIOD_TYPE, RS.ASSIGN_TYPE, RS.ASSIGNED_USER_ROLES,
		RS.FREQUENCY, RS.SCHEDULED, RS.MATERIALS, RS.SERVICES, RS.SCORED
		FROM REVIEW_SESSIONS RS
		INNER JOIN REVIEW_FORMS RF ON RF.ID = RS.FORM_ID;

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Session_Save]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[Isp_Review_Session_Save]
		 @id int,
		 @suppliers varchar(MAX),
		 @formId int,
		 @createdUser varchar(50),
		 @reviewYear varchar(50),
		 @presetPeriod varchar(200),
		 @startDate date  = NULL,
		 @endDate date = NULL,
		 @status varchar(50),
		 @periodType varchar(50),
		 @evaluationName varchar(200),
		 @assignedUsers varchar(MAX),
		 @assignedUserRoles varchar(MAX),
		 @assignType varchar(50),
		 @gradingMethod varchar(200),
		 @gradeCategories varchar(MAX),
		 @reviewerWeights varchar(MAX),
		 @supplierBlocker tinyint,
		 @scheduled tinyint,
		 @frequency varchar(MAX),
		 @materials tinyint,
		 @services tinyint,
		 @scored tinyint,
		 @minGradeThreshold int
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		IF @id > 0
		BEGIN
			UPDATE REVIEW_SESSIONS
               SET FORM_ID = @formId,
				   SUPPLIERS = @suppliers,
				   EVALUATION_NAME = @evaluationName,
				   MODIFIED_DATE = GETDATE(),
				   PRESET_PERIOD = @presetPeriod,
				   STARTDATE = @startDate,
				   ENDDATE = @endDate,
				   REVIEW_YEAR = @reviewYear,
				   GRADING_METHOD= @gradingMethod,
				   GRADE_CATEGORIES=@gradeCategories,
				   STATUS =  @status,
				   ASSIGNED_USERS =  @assignedUsers,
				   REVIEWER_WEIGHTS = @reviewerWeights,
				   MIN_GRADE_THRESHOLD = @minGradeThreshold,
				   PERIOD_TYPE = @periodType,
				   ASSIGNED_USER_ROLES = @assignedUserRoles,
				   SUPPLIER_BLOCKER = @supplierBlocker,
				   FREQUENCY = @frequency,
				   SCHEDULED = @scheduled,
				   MATERIALS = @materials,
				   SERVICES = @services,
				   SCORED = @scored,
				   ASSIGN_TYPE = @assignType
            WHERE  id = @id
			RETURN  @id
		   END          
		ELSE
		BEGIN
			INSERT INTO REVIEW_SESSIONS(
			  FORM_ID,
			  SUPPLIERS,
			  CREATED_DATE,
			  EVALUATION_NAME,
			  MODIFIED_DATE,
			  PRESET_PERIOD,
			  STARTDATE,
			  ENDDATE,
			  REVIEW_YEAR,
			  CREATED_USER,
			  ASSIGNED_USERS,
			  GRADING_METHOD,
			  GRADE_CATEGORIES,
			  REVIEWER_WEIGHTS,
			  MIN_GRADE_THRESHOLD,
			  PERIOD_TYPE,
			  ASSIGNED_USER_ROLES,
			  ASSIGN_TYPE,
			  SUPPLIER_BLOCKER,
			  SCORED,
			 FREQUENCY,
		     SCHEDULED,
			 MATERIALS,
			 SERVICES,
			  STATUS
			) VALUES (
			 @formId,
			 @suppliers,
			 GETDATE(),
			 @evaluationName,
			 GETDATE(),
			 @presetPeriod,
			 @startDate,
			 @endDate,
			 @reviewYear,
			 @createdUser,
			 @assignedUsers,
			 @gradingMethod,
			 @gradeCategories,
			 @reviewerWeights,
			 @minGradeThreshold,
			 @periodType,
			 @assignedUserRoles,
			 @assignType,
			 @supplierBlocker,
			 @scored,
			 @frequency,
			 @scheduled,
			 @materials,
			 @services,
			 @status
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
/****** Object:  StoredProcedure [dbo].[Isp_Review_Session_Search]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_Review_Session_Search]
	@ReviewSessionId int output
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		SELECT RS.SUPPLIERS, RS.CREATED_DATE, RS.FORM_ID, RS.Id, RS.ASSIGNED_USERS, RS.SUPPLIERS, RS.GRADING_METHOD, RS.GRADE_CATEGORIES,
		RS.STATUS, RS.REVIEW_YEAR, RS.STARTDATE, RS.ENDDATE, RS.PRESET_PERIOD, RS.EVALUATION_NAME, RS.MODIFIED_DATE, RS.CREATED_USER,  RS.REVIEWER_WEIGHTS,
		RS.MIN_GRADE_THRESHOLD, RS.PERIOD_TYPE, RS.ASSIGN_TYPE, RS.ASSIGNED_USER_ROLES, RS.SUPPLIER_BLOCKER,RS.FREQUENCY, RS.SCHEDULED,
		RS.MATERIALS, RS.SERVICES, RS.SCORED
		FROM REVIEW_SESSIONS RS
		INNER JOIN REVIEW_FORMS RF ON RF.ID = RS.FORM_ID where RS.Id=@ReviewSessionId;

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Session_Search_By_User]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE PROCEDURE [dbo].[Isp_Review_Session_Search_By_User]
	@LoggedInUser varchar(20) output
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		SELECT RS.SUPPLIERS, RS.CREATED_DATE, RS.FORM_ID, RS.Id, RS.ASSIGNED_USERS, RS.SUPPLIERS, RS.GRADING_METHOD, RS.GRADE_CATEGORIES,
		RS.STATUS, RS.REVIEW_YEAR, RS.STARTDATE, RS.ENDDATE, RS.PRESET_PERIOD, RS.EVALUATION_NAME, RS.MODIFIED_DATE, RS.CREATED_USER, RS.REVIEWER_WEIGHTS,
		RS.MIN_GRADE_THRESHOLD, RS.PERIOD_TYPE, RS.ASSIGN_TYPE, RS.ASSIGNED_USER_ROLES, RS.SUPPLIER_BLOCKER, RS.FREQUENCY, RS.SCHEDULED,
		RS.MATERIALS, RS.SERVICES, RS.SCORED
		FROM REVIEW_SESSIONS RS
		INNER JOIN REVIEW_FORMS RF ON RF.ID = RS.FORM_ID 
		where RS.created_user=@LoggedInUser OR CHARINDEX(@LoggedInUser, RS.ASSIGNED_USERS) > 0 ORDER BY RS.ID DESC;

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
GO
/****** Object:  StoredProcedure [dbo].[Isp_WorkflowEmails_Get]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_WorkflowEmails_Get]

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		select US.EmailAddress, US.Id from ImiWorkFlow.dbo.AbpUsers US; 

	END TRY
	BEGIN CATCH
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END	

GO
/****** Object:  StoredProcedure [dbo].[Isp_WorkflowRoleEmail_Get]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/******************************************************************************************************************************************************************************************

		PROGRAM ID					: 	Isp_Supplier_Update
     	PROGRAM DESCRIPTION			: 	TO update Suppliers 
     	ONLINE/BATCH				: 	ONLINE
     	PROCEDURES CALLED          	: 	-
     	PROCEDURES CALLING THIS   	: 	-
     	INPUT PARAMETERS           	: 	@SupplierId
		OUTPUT PARAMETER           	: 	

		MODIFICATION LOG			:

	**************************************************************************************************************************************************************
		Ver		Author				Date				Changes made          					
     	1.0     Evon 				21-02-2021			Original Version						
	****************************************************************************************************************************************************************/


CREATE PROCEDURE [dbo].[Isp_WorkflowRoleEmail_Get]
		 @roleName varchar(max)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		select UR.RoleId,AR.Description,US.EmailAddress from ImiWorkFlow.dbo.AbpUserRoles UR
		Inner join ImiWorkFlow.dbo.AbpRoles AR on AR.Id= UR.RoleId
		inner join ImiWorkFlow.dbo.AbpUsers US on US.Id = UR.UserId
		Where AR.Name = @roleName
		order by EmailAddress 

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END	

GO
/****** Object:  StoredProcedure [dbo].[Isp_WorkflowUsers_Create]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_WorkflowUsers_Create]
@id int,
@department varchar(50) = null,
@isActive bit = 1,
@emailAddress nvarchar(256),
@creationTime dateTime2(7) = null,
@name nvarchar(64),
@userName nvarchar(256)= null,
@surname nvarchar(64),
@phoneNumber nvarchar(32)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = '' 

		BEGIN
			INSERT INTO ImiWorkFlow.dbo.AbpUsers(
			  Department,
			  IsActive,
			  EmailAddress,
			  CreationTime,
			  Name,
			  UserName,
			  Surname,
			  PhoneNumber
			) VALUES (
			@department,
			@isActive,
			@emailAddress,
			@creationTime,
			@name,
			@userName,
			@surname,
			@phoneNumber
		)
		RETURN  @id
		END


	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH


END

GO
/****** Object:  StoredProcedure [dbo].[Isp_WorkflowUsers_Get]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_WorkflowUsers_Get]

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		select US.EmailAddress, US.Id, US.department, US.name from ImiWorkFlow.dbo.AbpUsers US; 

	END TRY
	BEGIN CATCH
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END	

GO
/****** Object:  StoredProcedure [dbo].[Isp_WorkflowUsers_Update]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_WorkflowUsers_Update]
@id int,
		 @department varchar(50)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		BEGIN
			UPDATE ImiWorkFlow.dbo.AbpUsers
               SET DEPARTMENT = @department
            WHERE  id = @id
			RETURN  @id
		   END         
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH


END

GO
/****** Object:  StoredProcedure [dbo].[Isp_WorkflowUsersEmail_Get]    Script Date: 18/08/2022 12:10:56 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_WorkflowUsersEmail_Get]
		 @users varchar(max)
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		select US.EmailAddress from ImiWorkFlow.dbo.AbpUsers US 
		WHERE US.Name IN (select value from STRING_SPLIT(@users, ',')); 

	END TRY
	BEGIN CATCH
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END	

GO
