export const USER_PERMISSIONS_CONFIGURATION = [
    {
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
                                        permissionCode: "ITEMS",
                                        permissionName: "Items",
                                        levelsAvailable: "LEVEL_TWO",
                                        subItemCode: 'ITEMS',
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
                                    },
                                    {
                                        permissionCode: "SUPPLIERS",
                                        permissionName: "Suppliers",
                                        levelsAvailable: "LEVEL_TWO",
                                        subItemCode: 'SUPPLIERS',
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                    {
                                        permissionCode: "HELP",
                                        permissionName: "Help",
                                        levelsAvailable: "LEVEL_TWO",
                                        subItemCode: 'HELP',
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                    {
                                        permissionCode: "CONTACT",
                                        permissionName: "Contact",
                                        levelsAvailable: "LEVEL_TWO",
                                        subItemCode: 'CONTACT',
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
                                subItemMainHeader: "ITEMS",
                                subItemCode: 'ITEMS',
                                showSubItem: false,
                                permissions: [
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
                                ]
                            },
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
                                        levelsAvailable: "LEVEL_THREE",
                                        subItemCode: 'ATTRIBUTE_ITEMS',
                                        active: false,
                                    },
                                    {
                                        permissionCode: "COST_FACTOR_LISTS",
                                        permissionName: "Cost Factor Lists",
                                        visibilityPermission: true,
                                        levelsAvailable: "LEVEL_THREE",
                                        subItemCode: 'COST_FACTORS',
                                        active: false,
                                    },
                                    {
                                        permissionCode: "NEGOTIATION_STYLES",
                                        permissionName: "Negotiation Styles",
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
                    {
                        id: 3,
                        levelCode: "LEVEL_THREE",
                        levelLable: "Level 3",
                        levelHeader: "Form Sublevel",
                        show: false,
                        subItems: [
                            {
                                subItemMainHeader: "CREATE RFX",
                                subItemCode: 'CREATE_RFX',
                                showSubItem: false,
                                permissions: [
                                    {
                                        permissionCode: "CREATE_NEW_RFX",
                                        permissionName: "Create New RFX",
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                    {
                                        permissionCode: "CREATE_FORM_TEMPLATE",
                                        permissionName: "Create Form Template",
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                    {
                                        permissionCode: "CREATE_FROM_EXISTING",
                                        permissionName: "Create From Existing",
                                        visibilityPermission: true,
                                        active: false,
                                    }
                                ]
                            },
                            {
                                subItemMainHeader: "ATTRIBUTE ITEMS",
                                subItemCode: 'ATTRIBUTE_ITEMS',
                                showSubItem: false,
                                permissions: [
                                    {
                                        permissionCode: "ATTRIBUTE_ITEMS",
                                        permissionName: "Attribute Items",
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                    {
                                        permissionCode: "ATTRIBUTE_LISTS",
                                        permissionName: "Attribute Lists",
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                ]
                            },
                            {
                                subItemMainHeader: "COST FACTORS",
                                subItemCode: 'COST_FACTORS',
                                showSubItem: false,
                                permissions: [
                                    {
                                        permissionCode: "COST_FACTORS",
                                        permissionName: "Cost Factors",
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                    {
                                        permissionCode: "COST_FACTOR_LIST",
                                        permissionName: "Cost Factor List",
                                        visibilityPermission: true,
                                        active: false,
                                    },
                                ]
                            }
                        ]
                    }
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
                                formName: 'Tags',
                                formCode: 'TAGS',
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
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
    }
]
