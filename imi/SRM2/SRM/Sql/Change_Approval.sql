GO
CREATE TABLE [dbo].[SUPPLIERS_TAB_CHANGE] (
    [Id]             INT           IDENTITY (1, 1) NOT NULL,
    [SUPPLIER_ID]    INT           NOT NULL,
    [SUPPLIER_DTO]   VARCHAR (MAX) NOT NULL,
    [SUBMITTED_DATE] DATETIME      NOT NULL
);

GO
CREATE PROCEDURE [dbo].[Isp_Change_Approval_All_Search]
		 @role varchar(max)

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		
		SELECT STC.SUPPLIER_ID, ST.SUPPLIER_NAME, ST.STATUS, STC.SUBMITTED_DATE
		FROM SUPPLIERS_TAB_CHANGE STC
		INNER JOIN SUPPLIERS_TAB ST ON STC.SUPPLIER_ID = ST.SUPPLIER_ID;

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END

GO
CREATE PROCEDURE [dbo].[Isp_Change_Approval_Delete]
	@SupplierId Int

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		DELETE FROM SUPPLIERS_TAB_CHANGE WHERE SUPPLIER_ID = @SupplierId
		
		RETURN (0)
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END

GO
CREATE PROCEDURE [dbo].[Isp_Change_Approval_Save]
		 @supplier_id int,
		 @supplier_dto nvarchar(max)

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
		DECLARE @id int = 0;


		INSERT INTO SUPPLIERS_TAB_CHANGE(
		  supplier_id,
		  supplier_dto,
		  submitted_date
		) VALUES (
		 @supplier_id,
		 @supplier_dto,
		 GETDATE()
  )
		SET @id=SCOPE_IDENTITY()
		RETURN  @id

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END

GO
CREATE PROCEDURE [dbo].[Isp_Change_Approval_Search]
		 @SupplierId int output

AS

BEGIN
	SET NOCOUNT ON  

	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''

		SELECT *
		 From SUPPLIERS_TAB_CHANGE S where SUPPLIER_ID=@SupplierId

	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END
