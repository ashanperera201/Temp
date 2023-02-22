USE [ImiSRM2]
GO

/****** Object:  Table [dbo].[REVIEW_FORMS]    Script Date: 4/12/2022 4:16:40 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[REVIEW_FORMS](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[NAME] [varchar](max) NULL,
	[FORM] [varchar](max) NOT NULL,
	[TITLE] [varchar](max) NOT NULL,
	[SUBTITLE] [varchar](max) NULL,
	[LOGO] [varchar](max) NULL,
	[BANNER] [varchar](max) NULL,
	[STATUS] [varchar](max) NOT NULL,
	[CREATED_USER] [varchar](max) NULL,
	[CREATED_USER_ROLE] [varchar](max) NULL,
	[SUBMITTED_DATE] [datetime] NOT NULL,
	[FORM_TYPE] [varchar](50) NULL,
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO
CREATE PROCEDURE [dbo].[Isp_Review_Form_All]
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		SELECT * From REVIEW_FORMS

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END

GO
ALTER PROCEDURE [dbo].[Isp_Review_Form_Save]
		 @id int,
		 @name varchar(max),
		 @form nvarchar(max),
		 @title varchar(max),
		 @subtitle varchar(max) = null,
		 @logo varchar(max) = null,
		 @banner varchar(max) = null,
		 @status varchar(max),
		 @created_user varchar(max),
		 @created_user_role varchar(max),
		 @form_type varchar(50)

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		IF @id > 0
		BEGIN
			UPDATE REVIEW_FORMS
            SET    name = @name,
                   form = @form,
				   title = @title,
				   subtitle = @subtitle,
				   logo = @logo,
				   banner = @banner,
				   status = @status,
				   form_type = @form_type
            WHERE  id = @id
			RETURN  @id
		   END          
		ELSE
		BEGIN
			INSERT INTO REVIEW_FORMS(
			  name,
			  form,
			  title,
			  subtitle,
			  logo,
			  banner,
			  status,
			  created_user,
			  created_user_role,
			  submitted_date,
			  form_type
			) VALUES (
			 @name,
			 @form,
			 @title,
			 @subtitle,
			 @logo,
			 @banner,
			 @status,
			 @created_user,
			 @created_user_role,
			 GETDATE(),
			 @form_type
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
CREATE PROCEDURE [dbo].[Isp_Review_Form_Search]
			@Id int
AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		SELECT * From REVIEW_FORMS WHERE id = @Id 

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END


Create PROCEDURE [dbo].[GetSuppliers]
  @supplierId NVARCHAR(MAX) = '',
  @supplierEmail NVARCHAR(MAX) = ''
 AS
  BEGIN
	SELECT * FROM [dbo].[SUPPLIERS_TAB] where EMAIL = @supplierEmail or SUPPLIER_ID = @supplierId;
  END
