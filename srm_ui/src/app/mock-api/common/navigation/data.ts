/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';


export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: '/dashboard',
        icon: 'feather:home'
    },
    {
        id: 'items',
        title: 'Items',
        type: 'basic',
        link: '/items',
        icon: 'feather:layers'
    },
    {
        id: 'sourcing',
        title: 'Sourcing',
        type: 'collapsable',
        link: '/sourcing',
        icon: 'feather:users',
        children: [
            {
                id: 'rfx-new',
                title: 'Create RFX',
                type: 'basic',
                link: '/rfx-new'
            },
            {
                id: 'rfx',
                title: 'Manage RFX',
                type: 'basic',
                link: '/rfx'
            }
            // {
            //     id   : 'rfaq',
            //     title: 'RFAQ',
            //     type : 'basic',
            //     link : '/rfaq'
            // }
        ]
    },
    {
        id: 'basicData',
        title: 'Basic Data',
        type: 'collapsable',
        link: '/basicData',
        icon: 'feather:database',
        children: [
            // {
            //     id: 'basicData.rfx-templates',
            //     title: 'RFX Templates',
            //     type: 'basic',
            //     link: '/rfx-templates'
            // },
            {
                id: 'supinlist',
                title: 'Supplier Invitation Lists',
                type: 'basic',
                link: '/supplier-invitation-list'
            },
            {
                id: 'basicData.reusableattributelists',
                title: 'Reusable Attribute Lists',
                type: 'collapsable',
                link: '/reusable-attribute-lists',
                children: [
                    {
                        id: 'basicData.attributeitems',
                        title: 'Attribute Items',
                        type: 'basic',
                        link: '/attribute-items'
                    },
                    {
                        id: 'basicData.attributelists',
                        title: 'Attribute Lists',
                        type: 'basic',
                        link: '/attribute-list'
                    },
                ]
            },
            {
                id: 'basicData.reusableattributelists',
                title: 'Cost Factor Lists',
                type: 'collapsable',
                link: '/reusable-attribute-lists',
                children: [
                    {
                        id: 'basicData.costfactors',
                        title: 'Cost Factors',
                        type: 'basic',
                        link: '/cost-factors'
                    },
                    {
                        id: 'basicData.costfactorlists',
                        title: 'Cost Factor Lists',
                        type: 'basic',
                        link: '/cost-factors-list'
                    },
                ]
            },
            {
                id: 'basicData.survey',
                title: 'Survey',
                type: 'collapsable',
                link: '/survey',
                children: [
                    {
                        id: 'basicData.surveytemplate',
                        title: 'Survey Template',
                        type: 'basic',
                        link: '/survey-template'
                    },
                    {
                        id: 'basicData.surveyquestion',
                        title: 'Survey Question',
                        type: 'basic',
                        link: '/survey-question'
                    },
                ]
            },
            {
                id: 'negotiation-styles',
                title: 'Negotiation Styles',
                type: 'basic',
                link: '/negotiation-styles'
            },
            {
                id: 'numbering-sequence',
                title: 'Numbering Sequence',
                type: 'basic',
                link: '/numbering-sequence'
            },
            {
                id: 'basicData.collaborationteams',
                title: 'Collaboration Teams',
                type: 'basic',
                link: '/colteams'
            },
            // {
            //     id: 'basicData.documenttexts',
            //     title: 'Document Texts',
            //     type: 'basic',
            //     link: '/document-texts'
            // },
            // {
            //     id: 'basicData.attachments',
            //     title: 'Attachments',
            //     type: 'basic',
            //     link: '/attachments'
            // },
            {
                id: 'basicData.currency',
                title: 'Currency',
                type: 'basic',
                link: '/currency'
            },
            {
                id: 'basicData.terms',
                title: 'Terms',
                type: 'basic',
                link: '/terms'
            }
        ]
    },
    {
        id: 'analytics',
        title: 'Analytics',
        type: 'collapsable',
        link: '/analytics',
        icon: 'feather:trending-up',
        children: [
            {
                id: 'analytics.reports',
                title: 'Reports',
                type: 'basic',
                link: '/reports'
            },
            {
                id: 'analytics.dashboards',
                title: 'Dashboards',
                type: 'basic',
                link: '/dashboards'
            },
        ]
    },
    {
        id: 'supplierperformance',
        title: 'Suppliers Overview',
        type: 'collapsable',
        link: '/Suppliers',
        icon: 'feather:send',
        children: [
            {
                id: 'suppliers-list',
                title: 'Suppliers Overview',
                type: 'basic',
                link: '/suppliers-list',
            },
            {
                id: 'supplier-reviews',
                title: 'Supplier Evaluation',
                type: 'basic',
                link: '/supplier-reviews'
            },
            {
                id: 'approval-changes-landing',
                title: 'Supplier Change Approvals',
                type: 'basic',
                link: '/approval-changes-landing'
            }
        ]
    },
    {
        id: 'setup',
        title: 'Setup',
        type: 'collapsable',
        link: '/setup',
        icon: 'feather:settings',
        children: [           
            {
                id: 'table',
                title: 'Table',
                type: 'basic',
                link: '/tables',
            },
            {
                id: 'users',
                title: 'Users',
                type: 'collapsable',
                link: '/users',
                children: [
                    {
                        id: 'user-groups',
                        title: 'User-groups',
                        type: 'basic',
                        link: '/user-groups'
                    }
                ]
            },
            {
                id: 'default',
                title: 'Defaults',
                type: 'basic',
                link: '/default',
            },
            {
                id: 'password-policy',
                title: 'Password policy',
                type: 'basic',
                link: '/password-policy',
            },
            {
                id: 'forms',
                title: 'Forms',
                type: 'collapsable',
                children: [
                    {
                        id: 'form-builder',
                        title: 'Forms',
                        type: 'basic',
                        link: '/form-builder',
                    },
                    {
                        id: 'review-form-configuration',
                        title: 'Form Configurator',
                        type: 'basic',
                        isModal: true,
                        code: 'REVIEW-FORM-CONFIGURATION'
                    }
                ]
            },
            {
                id: 'process_configurator',
                title: 'Process Configurator',
                type: 'basic',
                link: '/process-configurator/landing'
            },
            {
                id: 'email-template',
                title: 'Email Templates',
                type: 'basic',
                link: '/email-templates/landing'
            }
        ]

    },
    {
        id: 'profile',
        title: 'IMI SRM Analyst1',
        type: 'group',
        link: '/profile'
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: '/dashboard',
        icon: 'feather:home'
    },
    {
        id: 'items',
        title: 'Items',
        type: 'basic',
        link: '/items',
        icon: 'feather:layers'
    },
    {
        id: 'sourcing',
        title: 'Sourcing',
        type: 'collapsable',
        link: '/sourcing',
        icon: 'feather:users',
        children: [
            {
                id: 'rfx-new',
                title: 'Create RFX',
                type: 'basic',
                link: '/rfx-new'
            },
            {
                id: 'rfx',
                title: 'Manage RFX',
                type: 'basic',
                link: '/rfx'
            },
            // {
            //     id   : 'rfaq',
            //     title: 'RFAQ',
            //     type : 'basic',
            //     link : '/rfaq'
            // }
        ]
    },
    {
        id: 'basicData',
        title: 'Basic Data',
        type: 'collapsable',
        link: '/basicData',
        icon: 'feather:database',
        children: [
            {
                id: 'negotiation-styles',
                title: 'Negotiation Styles',
                type: 'basic',
                link: '/negotiation-styles'
            },
            {
                id: 'basicData.collaborationteams',
                title: 'Collaboration Teams',
                type: 'basic',
                link: '/colteams'
            }
        ]
    },
    {
        id: 'analytics',
        title: 'Analytics',
        type: 'collapsable',
        link: '/analytics',
        icon: 'feather:trending-up',
        children: [
            {
                id: 'analytics.reports',
                title: 'Reports',
                type: 'basic',
                link: '/reports'
            },
            {
                id: 'analytics.dashboards',
                title: 'Dashboards',
                type: 'basic',
                link: '/dashboards'
            },
        ]
    },
    {
        id: 'supplierperformance',
        title: 'Suppliers Overview',
        type: 'collapsable',
        link: '/supplierperformance',
        icon: 'feather:send',
        children: [
            {
                id: 'form-builder',
                title: 'Supplier Performance Form',
                type: 'basic',
                link: '/form-builder',
            },
            {
                id: 'suppliers',
                title: 'Supplier Review Form',
                type: 'basic',
                link: '/suppliers'
            },
        ]
    },
    {
        id: 'setup',
        title: 'Setup',
        type: 'collapsable',
        link: '/setup',
        icon: 'feather:settings',
        children: [
            {
                id: 'table',
                title: 'Table',
                type: 'basic',
                link: '/tables',
            }, {
                id: 'default',
                title: 'Defaults',
                type: 'basic',
                link: '/default',
            }
        ]

    },
    {
        id: 'profile',
        title: 'IMI SRM Analyst2',
        type: 'group',
        link: '/profile'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: '/dashboard',
        icon: 'feather:home'
    },
    {
        id: 'items',
        title: 'Items',
        type: 'basic',
        link: '/items',
        icon: 'feather:layers'
    },
    {
        id: 'sourcing',
        title: 'Sourcing',
        type: 'collapsable',
        link: '/sourcing',
        icon: 'feather:users',
        children: [
            {
                id: 'rfx-new',
                title: 'Create RFX',
                type: 'basic',
                link: '/rfx-new'
            },
            {
                id: 'rfx',
                title: 'Manage RFX',
                type: 'basic',
                link: '/rfx'
            },
        ]
    },
    {
        id: 'basicData',
        title: 'Basic Data',
        type: 'collapsable',
        link: '/basicData',
        icon: 'feather:database',
        children: [
            {
                id: 'negotiation-styles',
                title: 'Negotiation Styles',
                type: 'basic',
                link: '/negotiation-styles'
            },
            {
                id: 'basicData.collaborationteams',
                title: 'Collaboration Teams',
                type: 'basic',
                link: '/colteams'
            },
            {
                id: 'basicData.documenttexts',
                title: 'Document Texts',
                type: 'basic',
                link: '/document-texts'
            },
            {
                id: 'basicData.attachments',
                title: 'Attachments',
                type: 'basic',
                link: '/attachments'
            },
        ]
    },
    {
        id: 'analytics',
        title: 'Analytics',
        type: 'collapsable',
        link: '/analytics',
        icon: 'feather:trending-up',
        children: [
            {
                id: 'analytics.reports',
                title: 'Reports',
                type: 'basic',
                link: '/reports'
            },
            {
                id: 'analytics.dashboards',
                title: 'Dashboards',
                type: 'basic',
                link: '/dashboards'
            },
        ]
    },
    {
        id: 'supplierperformance',
        title: 'Suppliers Overview',
        type: 'collapsable',
        link: '/supplierperformance',
        icon: 'feather:send',
        children: [
            {
                id: 'form-builder',
                title: 'Supplier Performance Form',
                type: 'basic',
                link: '/form-builder',
            },
            {
                id: 'suppliers',
                title: 'Supplier Review Form',
                type: 'basic',
                link: '/suppliers'
            },
        ]
    },
    {
        id: 'setup',
        title: 'Setup',
        type: 'collapsable',
        link: '/setup',
        icon: 'feather:settings',
        children: [
            {
                id: 'table',
                title: 'Table',
                type: 'basic',
                link: '/tables',
            }, {
                id: 'default',
                title: 'Defaults',
                type: 'basic',
                link: '/default',
            }
        ]

    },
    {
        id: 'setup',
        title: 'Setup',
        type: 'collapsable',
        link: '/setup',
        icon: 'feather:settings',
        children: [
            {
                id: 'table',
                title: 'Table',
                type: 'basic',
                link: '/tables',
            }
        ]

    },
    {
        id: 'profile',
        title: 'IMI SRM Analyst3',
        type: 'group',
        link: '/profile'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'profile',
        title: 'IMI SRM Analyst4',
        type: 'basic',
        link: '/profile',
        classes: {
            wrapper: 'bordered-link'
        }
    },
    {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'basic',
        link: '/dashboard',
        icon: 'feather:home'
    },
    {
        id: 'srm',
        title: 'SRM',
        type: 'collapsable',
        link: '/srm',
        icon: 'feather:layers',
        children: [
            {
                id: 'items',
                title: 'Items',
                type: 'basic',
                link: '/items',
            },
            {
                id: 'suppliers-list',
                title: 'Suppliers Overview',
                type: 'basic',
                link: '/suppliers-list',
            },
            {
                id: 'supplier-reviews',
                title: 'Supplier Evaluation',
                type: 'basic',
                link: '/supplier-reviews'
            },
            {
                id: 'approval-changes-landing',
                title: 'Supplier Change Approvals',
                type: 'basic',
                link: '/approval-changes-landing'
            }
        ]
    },
    {
        id: 'sourcing',
        title: 'Sourcing',
        type: 'collapsable',
        link: '/sourcing',
        icon: 'feather:users',
        children: [
            {
                id: 'rfx-new',
                title: 'Create RFX',
                type: 'basic',
                link: '/rfx-new'
            },
            {
                id: 'rfx',
                title: 'Manage RFX',
                type: 'basic',
                link: '/rfx'
            },
        ]
    },
    {
        id: 'basicData',
        title: 'Basic Data',
        type: 'collapsable',
        link: '/basicData',
        icon: 'feather:database',
        children: [
            {
                id: 'negotiation-styles',
                title: 'Negotiation Styles',
                type: 'basic',
                link: '/negotiation-styles'
            },
            {
                id: 'basicData.collaborationteams',
                title: 'Collaboration Teams',
                type: 'basic',
                link: '/colteams'
            }
        ]
    },
    {
        id: 'setup',
        title: 'Setup',
        type: 'collapsable',
        link: '/setup',
        icon: 'feather:settings',
        children: [
            {
                id: 'table',
                title: 'Table',
                type: 'basic',
                link: '/tables',
            }
        ]

    }
];
