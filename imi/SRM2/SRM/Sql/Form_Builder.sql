USE [ImiSRM2]
GO
/****** Object:  StoredProcedure [dbo].[Isp_Review_Form_Save]    Script Date: 10/11/2022 6:10:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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

		begin
		SET @id = (SELECT id FROM REVIEW_FORMS WHERE [name] = @name);
		IF(@id = 0)
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
		end

		
		RETURN  0;
		
		  
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END