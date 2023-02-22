CREATE TABLE [dbo].[FORM_CONFIGURATION](
	[Id] int IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[ConfigurationCode] NVARCHAR(MAX) NULL,
	[ConfigurationName] NVARCHAR(100) NOT NULL,
	[Module] NVARCHAR(MAX) NULL,
	[ElementItem] NVARCHAR(MAX) NULL,
	[ElementCount] INT NOT NULL,
	[Configuration] NVARCHAR(MAX) NULL,
	[ProcessStep] NVARCHAR(100) NULL
);
