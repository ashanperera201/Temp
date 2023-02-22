GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[Isp_AllApprovedSupplier_Search]
	
AS

BEGIN
	SET NOCOUNT ON  
	;
	BEGIN TRY
		DECLARE @ErrorMessage VARCHAR(MAX) = ''
			SELECT S.SUPPLIER_ID
                ,S.SUPPLIER_CODE
                ,S.SUPPLIER_NAME
                ,S.SUPPLIER_NAME_ARABIC
                ,S.ESTABLISHMENT_YEAR
                ,S.ISSUED_BY
                ,S.WEB_SITE
                ,S.SUPPLIER_TYPE

                ,S.COUNTRY
                ,S.CITY
                ,S.OTHER_CITY
                ,S.PO_BOX
                ,S.POSTAL_CODE
                ,S.ADDRESS_LINE1
                ,S.ADDRESS_LINE2

                ,S.TITLE
                ,S.FIRST_NAME
                ,S.LAST_NAME
                ,S.POSITION
                ,S.TELPHONE_COUNTRY_CODE
                ,S.TELEPHONE_NO
                ,S.EXTENSION
                ,S.EMAIL
                ,S.MOBILE_COUNTRY_CODE
                ,S.MOBILE_NO
                ,S.FAX_COUNTRY_CODE
                ,S.FAX_NO
				,S.HIJRI_SELECTED

                ,S.CR_NO
                ,S.CR_EXP_DATE
				,S.REG_DATE
                ,S.VAT_NO
                ,S.GOSI_CERTIFICATE
                ,S.GOSI_DATE
                ,S.SAUDI_DATE
                ,S.ZAKATH_DATE
                ,S.ADDITIONAL_MATERIAL

                ,S.TYPE_OF_ORG
                ,S.NO_OF_MANAGER
                ,S.NO_OF_OPERATION
                ,S.NO_OF_TECHNICAL
				,S.NO_OF_SAUDI
				,S.NO_OF_TOTAL
				,S.PARENT_COMPANY_INFO --PARENTCOMPANY
                ,S.SISTERCOMPANY
                ,S.OWNER_INFO --OWNERCOMPANY

                ,S.OPERATINGPROFIT1
                ,S.OPERATINGPROFIT2
                ,S.NETINCOME1
                ,S.NETINCOME2
                ,S.CURRENTASSET1
                ,S.CURRENTASSET2
                ,S.TOTALLIABLE1
                ,S.TOTALLIABLE2
                ,S.TOTALEQUITY1
                ,S.TOTALEQUITY2
                ,S.NOOFYEARS

				,S.OWNSPLANTEQUIP
				,S.DESIGNNCAP
				,S.FINISHPROD
				,S.INTERNALPOLICY
				,S.REGISTEREDORG
				,S.SUSPENDEDPROJ1
				,S.SUSPENDEDPROJ2
				
				,S.LITIGATION1
				,S.LITIGATION2
				,S.COMPLIANCE1
				,S.SHAREHOLDER1
				,S.SHAREHOLDER2
				,S.LEGALASSET1
				,S.LEGALASSET2
				,S.LABOUR1
				,S.LABOUR2
				,S.ENVIRONMENT1
				,S.ENVIRONMENT2
				,S.IMIINTERESTED1
				,S.IMIINTERESTED2
				
				,S.HSE1
				,S.DOCUHSE
				,S.ISOHEALTH
				,S.ENVTMGT1
				,S.DEDICATEDPERS
				,S.HSENAME
				,S.HSEDESIG
				,S.STATISTIC
				,S.STATISTICNEAR
				,S.STATISTICFIRST
				,S.STATISTICMEDI
				,S.STATISTICLOST
				,S.STATISTICFATAL
				,S.STATISTICENVT

				,S.QUALITYPOLICY1
                ,S.QUALITYMGT
                ,S.QUALITYMGTISO
                ,S.QUALITYRESP1
                ,S.QUALITYRESP2
				,S.QUALITYRESP3
                ,S.QUALITYREVIEWDATE
                ,S.REVISION_NO

                ,S.BANK_COUNTRY_CODE
                ,S.BANK_NAME
				,S.OTHER_BANK
                ,S.SWIFT_CODE
                ,S.ACCOUNT_HOLDER_NAME
                ,S.ACCOUNT_INT
                ,S.IBAN_NO
                ,S.BANK_ADDRESS
				,S.BANK_ADDRESS_2
                ,S.ACCOUNT_CURRENCY
				,S.MULTICURRENCY
				,S.account_no
                 
                ,S.STATUS
                ,S.CREATED_DATE
				,S.CRITICALITY_VALUE
                ,S.WORKFLOW_DOC_ID

                ,CASE WHEN S.IFS_CODE <> '' THEN 'Pushed' ELSE 'Not Pushed'  END AS PUSHEDSUPPLIERSTATUS
				,CASE WHEN IT.INVITE_SUPPLIER_NAME is null then 'No' else 'Yes' end as INVITED
         FROM SUPPLIERS_TAB S 
		 LEFT JOIN INVITESUPPLIERS_TAB IT on IT.INVITE_SUPPLIER_NAME = S.SUPPLIER_NAME
		 WHERE S.STATUS = 'Approved' OR S.STATUS = 'blocked'
         ORDER BY S.CREATED_DATE DESC
		RETURN (0)
	END TRY

	BEGIN CATCH
		
		RAISERROR (@ErrorMessage, 16, -1)                   
		RETURN (1)
	END CATCH
END	

