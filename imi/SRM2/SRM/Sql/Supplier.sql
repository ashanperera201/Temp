CREATE TABLE [dbo].[SUPPLIER_INFORMATIONS](
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[SupplierUniqueId] NVARCHAR(MAX) NOT NULL,
	[supplierName] NVARCHAR(100) NOT NULL,
	[SupplierContact] NVARCHAR(100) NOT NULL,
	[SupplierFirstName] NVARCHAR(100) NOT NULL,
	[SupplierLastName] NVARCHAR(100) NULL,
	[SupplierMiddleName] NVARCHAR(100) NULL,
	[SupplierEmail] NVARCHAR(100) NOT NULL,
	[SupplierCriticality] NVARCHAR(100) NULL,
	[AdditionalInformations] NVARCHAR(MAX) NULL,
	[IsActive] BIT NOT NULL,
	[CreatedBy] NVARCHAR(MAX) NOT NULL,
	[CreatedOn] DATETIME NOT NULL,
	[UpdatedBy]	NVARCHAR(MAX) NULL,
	[UpdatedOn]	DATETIME NULL
);