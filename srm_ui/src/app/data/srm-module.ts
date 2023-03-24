export const SRM_MODULE = {
    moduleName: "SRM Module",
    moduleCode: "SRM_MODULE",
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
                                    permissionCode: "DASHBOARD",
                                    permissionName: "Dashboard",
                                    levelsAvailable: "LEVEL_TWO",
                                    subItemCode: 'DASHBOARD',
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "SRM_ITEM",
                                    permissionName: "SRM",
                                    levelsAvailable: "LEVEL_TWO",
                                    subItemCode: 'SRM_ITEM',
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "SOURCING",
                                    permissionName: "Sourcing",
                                    levelsAvailable: "LEVEL_TWO",
                                    subItemCode: 'SOURCING',
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "BASIC_DATA",
                                    permissionName: "Basic Data",
                                    levelsAvailable: "LEVEL_TWO",
                                    subItemCode: 'BASIC_DATA',
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "ANALYTICS",
                                    permissionName: "Analytics",
                                    levelsAvailable: "LEVEL_TWO",
                                    subItemCode: 'ANALYTICS',
                                    visibilityPermission: true,
                                    active: false,
                                }
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
                            subItemMainHeader: "DASHBOARD",
                            subItemCode: 'DASHBOARD',
                            showSubItem: false,
                            permissions: [
                                {
                                    permissionCode: "ADD-ELEMENTS",
                                    permissionName: "Add Elements",
                                    active: false,
                                },
                                {
                                    permissionCode: "PENDING-TASKS",
                                    permissionName: "Pending Tasks",
                                    active: false,
                                },
                                {
                                    permissionCode: "PASS-SUPPLIER-REGISTRATION",
                                    permissionName: "PASS Supplier Registration",
                                    active: false,
                                },
                                {
                                    permissionCode: "EMERGENCY-SUPPLIERS",
                                    permissionName: "Emergency Suppliers",
                                    active: false,
                                },
                            ]
                        },
                        {
                            subItemMainHeader: "Items",
                            subItemCode: 'SRM_ITEM',
                            showSubItem: false,
                            permissions: [
                                {
                                    permissionCode: "ALL",
                                    permissionName: "All",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "EMMERGENCY_SUPPLIER",
                                    permissionName: "Emmergency Supplier",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "WORKFLOW",
                                    permissionName: "Workflow",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "TASK",
                                    permissionName: "Task",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "REPORT_ALL",
                                    permissionName: "Report All",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "REPORT_AUDIT",
                                    permissionName: "Report Audit",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "TAGS",
                                    permissionName: "Tags",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "KPI_REPORT",
                                    permissionName: "KPI Report",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "IFS_INTEGRATION",
                                    permissionName: "IFS Integration",
                                    visibilityPermission: true,
                                    active: false,
                                },
                            ]
                        },
                        // {
                        //     subItemMainHeader: 'SOURCING',
                        //     subItemCode: 'SOURCING',
                        //     showSubItem: false,
                        //     permissions: [
                        //         {
                        //             permissionCode: "CREATE_RFX",
                        //             permissionName: "Create RFX",
                        //             levelsAvailable: "LEVEL_THREE",
                        //             subItemCode: 'CREATE_RFX',
                        //             visibilityPermission: true,
                        //             active: false,
                        //         },
                        //         {
                        //             permissionCode: "MANAGE_RFX",
                        //             permissionName: "Manage RFX",
                        //             visibilityPermission: true,
                        //             active: false,
                        //         }
                        //     ]
                        // },
                        {
                            subItemMainHeader: 'BASIC DATA',
                            subItemCode: 'BASIC_DATA',
                            showSubItem: false,
                            permissions: [
                                {
                                    permissionCode: "RFX_TEMPLATES",
                                    permissionName: "RFX Templates",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "SUPPLIER_INVITATION_LIST",
                                    permissionName: "Supplier Invitation List",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "REUSABLE_ATTRIBUTE_LISTS",
                                    permissionName: "Reusable Attribute List",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "COST_FACTOR_LISTS",
                                    permissionName: "Cost Factor Lists",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "NEGOTIATION_STYLES",
                                    permissionName: "Negotiation Styles",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "SURVEY_TEMPLATE",
                                    permissionName: "SURVEY TEMPLATE",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "SURVEY_QUESTION",
                                    permissionName: "SURVEY QUESTION",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "NUMBERING_SEQUENCE",
                                    permissionName: "Numbering Sequence",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "COLLOBORATION_TEAMS",
                                    permissionName: "Colloboration Teams",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "DOCUMENT_TEXTS",
                                    permissionName: "Document Texts",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "ATTACHMENTS",
                                    permissionName: "Attachments",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "CURRENCY",
                                    permissionName: "Currency",
                                    visibilityPermission: true,
                                    active: false,
                                },
                                {
                                    permissionCode: "TERMS",
                                    permissionName: "Terms",
                                    visibilityPermission: true,
                                    active: false,
                                },
                            ]
                        }
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
                            formName: 'Dashboard',
                            formCode: 'DASHBOARD',
                            fields: [
                                {
                                    fieldName: 'PT All Filtration',
                                    viewFieldCode: 'VIEW_PT_ALL_FILTRATION',
                                    editFieldCode: 'EDIT_PT_ALL_FILTRATION',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PT Search',
                                    viewFieldCode: 'VIEW_PT_SEARCH',
                                    editFieldCode: 'EDIT_PT_SEARCH',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PT Grid View',
                                    viewFieldCode: 'VIEW_PT_GRID_VIEW',
                                    editFieldCode: 'EDIT_PT_GRID_VIEW',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PT Column Selection',
                                    viewFieldCode: 'VIEW_PT_COLUMN_SELECTION',
                                    editFieldCode: 'EDIT_PT_COLUMN_SELECTION',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PASS All Filtration',
                                    viewFieldCode: 'VIEW_PASS_ALL_FILTRATION',
                                    editFieldCode: 'EDIT_PASS_ALL_FILTRATION',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PASS Search',
                                    viewFieldCode: 'VIEW_PASS_SEARCH',
                                    editFieldCode: 'EDIT_PASS_SEARCH',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PASS Grid View',
                                    viewFieldCode: 'VIEW_PASS_GRID_VIEW',
                                    editFieldCode: 'EDIT_PASS_GRID_VIEW',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'PASS Column Selection',
                                    viewFieldCode: 'VIEW_PASS_COLUMN_SELECTION',
                                    editFieldCode: 'EDIT_PASS_COLUMN_SELECTION',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'ES All Filtration',
                                    viewFieldCode: 'VIEW_ES_ALL_FILTRATION',
                                    editFieldCode: 'EDIT_ES_ALL_FILTRATION',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'ES Search',
                                    viewFieldCode: 'VIEW_ES_SEARCH',
                                    editFieldCode: 'EDIT_ES_SEARCH',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'ES Grid View',
                                    viewFieldCode: 'VIEW_ES_GRID_VIEW',
                                    editFieldCode: 'EDIT_ES_GRID_VIEW',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'ES Column Selection',
                                    viewFieldCode: 'VIEW_ES_COLUMN_SELECTION',
                                    editFieldCode: 'EDIT_ES_COLUMN_SELECTION',
                                    view: false,
                                    edit: false
                                },
                            ]
                        },
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'Items Add',
                            formCode: 'ITEMS_ADD',
                            fields: [
                                {
                                    fieldName: 'Approved Supplier',
                                    viewFieldCode: 'VIEW_APPROVED_SUPPLIER',
                                    editFieldCode: 'EDIT_APPROVED_SUPPLIER',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'High Critical',
                                    viewFieldCode: 'VIEW_HIGH_CRITICAL',
                                    editFieldCode: 'EDIT_HIGH_CRITICAL',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Critical',
                                    viewFieldCode: 'VIEW_CRITICAL',
                                    editFieldCode: 'EDIT_CRITICAL',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Awaiting For Site Audit Dates',
                                    viewFieldCode: 'VIEW_AWAITING_FOR_SITE_AUDIT_DATES',
                                    editFieldCode: 'EDIT_AWAITING_FOR_SITE_AUDIT_DATES',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Non Critical',
                                    viewFieldCode: 'VIEW_NON_CRITICAL',
                                    editFieldCode: 'EDIT_NON_CRITICAL',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Pending Criticality Matrix',
                                    viewFieldCode: 'VIEW_PENDING_CRITICALITY_MATRIX',
                                    editFieldCode: 'EDIT_PENDING_CRITICALITY_MATRIX',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Non Criticality',
                                    viewFieldCode: 'VIEW_NON_CRITICALITY',
                                    editFieldCode: 'EDIT_NON_CRITICALITY',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Save Items',
                                    viewFieldCode: 'VIEW_SAVE_ITEMS',
                                    editFieldCode: 'EDIT_SAVE_ITEMS',
                                    view: false,
                                    edit: false
                                },
                            ]
                        },
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'Items',
                            formCode: 'ITEMS',
                            fields: [
                                {
                                    fieldName: 'All Supplier Page',
                                    viewFieldCode: 'VIEW_ALL_SUPPLIER_PAGE',
                                    editFieldCode: 'EDIT_ALL_SUPPLIER_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Emergency Supplier Page',
                                    viewFieldCode: 'VIEW_EMERGENCY_SUPPLIER_PAGE',
                                    editFieldCode: 'EDIT_EMERGENCY_SUPPLIER_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Invite Supplier Page',
                                    viewFieldCode: 'VIEW_INVITE_SUPPLIER_PAGE',
                                    editFieldCode: 'EDIT_INVITE_SUPPLIER_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Workflow Page',
                                    viewFieldCode: 'VIEW_WORK_FLOW_PAGE',
                                    editFieldCode: 'EDIT_WORK_FLOW_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Task Page',
                                    viewFieldCode: 'VIEW_TASK_PAGE',
                                    editFieldCode: 'EDIT_TASK_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Report All Page',
                                    viewFieldCode: 'VIEW_REPORT_ALL_PAGE',
                                    editFieldCode: 'EDIT_REPORT_ALL_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Report Audit Page',
                                    viewFieldCode: 'VIEW_REPORT_AUDIT',
                                    editFieldCode: 'EDIT_REPORT_AUDIT',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Tags Page',
                                    viewFieldCode: 'VIEW_TAGS_PAGE',
                                    editFieldCode: 'EDIT_TAGS_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'KPI Report Page',
                                    viewFieldCode: 'VIEW_KPI_REPORT_PAGE',
                                    editFieldCode: 'EDIT_KPI_REPORT_PAGE',
                                    view: false,
                                    edit: false
                                },
                                {
                                    fieldName: 'Report Audit Page',
                                    viewFieldCode: 'VIEW_REPORT_AUDIT_PAGE',
                                    editFieldCode: 'EDIT_REPORT_AUDIT_PAGE',
                                    view: false,
                                    edit: false
                                }
                            ]
                        },
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'Supplier Overview',
                            formCode: 'SUPPLIER_OVERVIEW',
                            fields: [
                                {
                                    fieldName: 'Supplier Overview',
                                    viewFieldCode: 'VIEW_SUPPLIER_OVERVIEW',
                                    editFieldCode: 'EDIT_SUPPLIER_OVERVIEW',
                                    view: false,
                                    edit: false
                                }                              
                            ]
                        },
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'Supplier Reviews',
                            formCode: 'SUPPLIER_REVIEWS',
                            fields: [
                                {
                                    fieldName: 'Supplier Review Page',
                                    viewFieldCode: 'VIEW_SUPPLIER_REVIEWS_PAGE',
                                    editFieldCode: 'EDIT_SUPPLIER_REVIEWS_PAGE',
                                    view: false,
                                    edit: false
                                }                       
                            ]
                        },
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'Form Builder',
                            formCode: 'FORM_BUILDER',
                            fields: [
                                {
                                    fieldName: 'Form Builder Page',
                                    viewFieldCode: 'VIEW_FORM_BUILDER',
                                    editFieldCode: 'EDIT_FORM_BUILDER',
                                    view: false,
                                    edit: false
                                }                       
                            ]
                        },
                        {
                            level: 'Level 1',
                            levelCode: 'LEVEL_ONE',
                            formName: 'Supplier Change Approvals Page',
                            formCode: 'SUPPLIER_CHANGE_APPROVALS_PAGE',
                            fields: [
                                {
                                    fieldName: 'Supplier Change Approval Page',
                                    viewFieldCode: 'VIEW_SUPPLIER_CHANGE_APPROVALS_PAGE',
                                    editFieldCode: 'EDIT_SUPPLIER_CHANGE_APPROVALS_PAGE',
                                    view: false,
                                    edit: false
                                }                       
                            ]
                        },
                    ]
                },
            ]
        }
    ],
}