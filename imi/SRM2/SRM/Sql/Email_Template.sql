CREATE TABLE [dbo].[EMAIL_TEMPLATES](
  [Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  [TemplateUniqueId] NVARCHAR(MAX) NOT NULL,
  [EmailTemplateCode] NVARCHAR(MAX) NOT NULL,
  [EmailTemplateName] NVARCHAR(150) NOT NULL,
  [HtmlContent] NVARCHAR(MAX) NULL,
  [FooterSignature] NVARCHAR(MAX) NULL,
  [HeaderSignature] NVARCHAR(MAX) NULL,
  [ThanksGivingSection] NVARCHAR(MAX) NULL,
  [IsActive] BIT NOT NULL,
  [CreatedBy] NVARCHAR(MAX) NOT NULL,
  [CreatedOn] DATETIME NOT NULL,
  [UpdatedBy]	NVARCHAR(MAX) NULL,
  [UpdatedOn]	DATETIME NULL
);