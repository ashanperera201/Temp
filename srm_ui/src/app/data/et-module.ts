export const ET_MODULE = {
    moduleName: "ET Module",
    moduleCode: "ET_MODULE",
    subCategories: [
        {
            categoryId: 1,
            categoryTitle: 'Visibility',
            categoryCode: 'VISIBILITY',
            visibilityConfig: [
                {
                    id: 1,
                    levelCode: "LEVEL_ONE",
                    levelLable: "Level 1",
                    levelHeader: "Main Menus",
                    show: true,
                    subItems: [
                        {
                            subItemMainHeader: "",
                            subItemCode: '',
                            showSubItem: true,
                            permissions: [
                                {
                                    permissionCode: "SOURCING",
                                    permissionName: "Sourcing",
                                    levelsAvailable: "LEVEL_TWO",
                                    subItemCode: 'SOURCING',
                                    visibilityPermission: true,
                                    active: false,
                                },
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    levelCode: "LEVEL_TWO",
                    levelLable: "Level 2",
                    levelHeader: "Sub Sections",
                    show: false,
                    subItems: [
                        {
                            subItemMainHeader: 'SOURCING',
                            subItemCode: 'SOURCING',
                            showSubItem: false,
                            permissions: [
                                {
                                    permissionCode: "CREATE_RFX",
                                    permissionName: "Create RFX",
                                    levelsAvailable: "LEVEL_THREE",
                                    subItemCode: 'CREATE_RFX',
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "MANAGE_RFX",
                                    permissionName: "Manage RFX",
                                    visibilityPermission: true,
                                    active: false,
                                }
                            ]
                        },
                    ]
                },
            ]
        },
        {
            categoryId: 2,
            categoryTitle: 'Permissions',
            categoryCode: 'PERMISSIONS',
            fieldLevels: [
                {
                    level: 'Level 1',
                    levelCode: 'LEVEL_ONE',
                    formItems: [
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'ET Related Screens',
                            formCode: 'ET_RELATED_SCREENS',
                            fields: [
                                {
                                    fieldName: 'Attribute Lists Screen',
                                    viewFieldCode: 'VIEW_ATTRIBUTE_LIST_SCREEN',
                                    editFieldCode: 'EDIT_ATTRIBUTE_LIST_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Attribute Screen',
                                    viewFieldCode: 'VIEW_ATTRIBUTE_SCREEN',
                                    editFieldCode: 'EDIT_ATTRIBUTE_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Cost Factor Lists',
                                    viewFieldCode: 'VIEW_COST_FACTOR_LIST_SCREEN',
                                    editFieldCode: 'EDIT_COST_FACTOR_LIST_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Cost Factor',
                                    viewFieldCode: 'VIEW_COST_FACTOR_SCREEN',
                                    editFieldCode: 'EDIT_COST_FACTOR_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Question Templates',
                                    viewFieldCode: 'VIEW_QUESTION_TEMPLATES_SCREEN',
                                    editFieldCode: 'EDIT_QUESTION_TEMPLATES_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Questions',
                                    viewFieldCode: 'VIEW_QUESTIONS_SCREEN',
                                    editFieldCode: 'EDIT_QUESTIONS_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'RFX Templates',
                                    viewFieldCode: 'VIEW_RFX_TEMPLATES_SCREEN',
                                    editFieldCode: 'EDIT_RFX_TEMPLATES_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Supplier Invitation List',
                                    viewFieldCode: 'VIEW_SUPPLIER_INVITATION_LIST_SCREEN',
                                    editFieldCode: 'EDIT_SUPPLIER_INVITATION_LIST_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Currency',
                                    viewFieldCode: 'VIEW_CURRENCY_SCREEN',
                                    editFieldCode: 'EDIT_CURRENCY_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Terms',
                                    viewFieldCode: 'VIEW_TERMS_SCREEN',
                                    editFieldCode: 'EDIT_TERMS_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Manage RFX',
                                    viewFieldCode: 'VIEW_MANAGE_RFX_SCREEN',
                                    editFieldCode: 'EDIT_MANAGE_RFX_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'New / Edit RFX',
                                    viewFieldCode: 'VIEW_NEW_EDIT_RFX_SCREEN',
                                    editFieldCode: 'EDIT_NEW_EDIT_RFX_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Supplier RFQ Lists',
                                    viewFieldCode: 'VIEW_SUPPLIER_RFQ_LIST_SCREEN',
                                    editFieldCode: 'EDIT_SUPPLIER_RFQ_LIST_SCREEN',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'RFQ information',
                                    viewFieldCode: 'VIEW_RQ_INFORMATION_SCREEN',
                                    editFieldCode: 'EDIT_RQ_INFORMATION_SCREEN',
                                    view: false,
                                    edit: false
                                },
                            ]
                        }
                    ]
                },
                {
                    level: 'Level 2',
                    levelCode: 'LEVEL_TWO',
                    formItems: [
                        {
                            level: 'Level 2',
                            levelCode: 'LEVEL_TWO',
                            formName: 'ET Related Tabs',
                            formCode: 'ET_RELATED_TABS',
                            fields: [
                                {
                                    fieldName: 'Header',
                                    viewFieldCode: 'VIEW_HEADER_TABS',
                                    editFieldCode: 'EDIT_HEADER_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Lines',
                                    viewFieldCode: 'VIEW_LINES_TABS',
                                    editFieldCode: 'EDIT_LINES_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Scorings',
                                    viewFieldCode: 'VIEW_SCORINGS_TABS',
                                    editFieldCode: 'EDIT_SCORINGS_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Rules',
                                    viewFieldCode: 'VIEW_RULES_TABS',
                                    editFieldCode: 'EDIT_RULES_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Suppliers',
                                    viewFieldCode: 'VIEW_SUPPLIERS_TABS',
                                    editFieldCode: 'EDIT_SUPPLIERS_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Collaboration',
                                    viewFieldCode: 'VIEW_COLLOBORATION_TABS',
                                    editFieldCode: 'EDIT_COLLOBORATION_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Responses',
                                    viewFieldCode: 'VIEW_RESPONSES_TABS',
                                    editFieldCode: 'EDIT_RESPONSES_TABS',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Evaluations',
                                    viewFieldCode: 'VIEW_EVALUATIONS_TABS',
                                    editFieldCode: 'EDIT_EVALUATIONS_TABS',
                                    view: false,
                                    edit: false
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    ],
}