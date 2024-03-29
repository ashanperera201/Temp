import { Component, ViewEncapsulation } from '@angular/core';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';

@Component({
    selector: 'drawer-mini',
    templateUrl: '../drawer-mini/drawer-mini.component.html',
    encapsulation: ViewEncapsulation.None
})
export class DrawerMiniComponent {
    menuData: FuseNavigationItem[];
    currentUserRole: any;

    /**
     * Constructor
     */
    constructor() {
        this.currentUserRole = localStorage.getItem("userrole");
        this.menuData = [
            {
                title: 'All',
                type: 'basic',
                icon: 'all_inclusive',
                link: '/items',
                permission: 'ALL'
            },
            {
                title: 'Emergency Supplier',
                type: 'basic',
                icon: 'heroicons_outline:light-bulb',
                link: '/items/emergency-supplier',
                permission: 'EMMERGENCY_SUPPLIER'
            },
            {
                title: 'Invite Supplier',
                type: 'basic',
                icon: 'heroicons_outline:mail-open',
                link: '/items/invite-supplier',
                permission: 'VIEW_INVITE_SUPPLIER_PAGE'
            },
            {
                title: 'Workflow',
                type: 'basic',
                icon: 'heroicons_outline:template',
                link: '/items/workflow',
                permission: 'WORKFLOW'
            },
            {
                title: 'Task',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-list',
                link: '/items/task',
                permission: 'TASK'
            },
            {
                title: 'Report All',
                type: 'basic',
                icon: 'heroicons_outline:document-text',
                link: '/items/reportall',
                permission: 'REPORT_ALL'
            },
            {
                title: 'Report Audit',
                type: 'basic',
                icon: 'heroicons_outline:document-search',
                link: '/items/reportaudit',
                permission: 'REPORT_AUDIT'
            },
            {
                title: 'Tags',
                type: 'basic',
                icon: 'heroicons_outline:tag',
                link: '/items/tags',
                permission: 'TAGS'
            },
            {
                title: 'KPI Report',
                type: 'basic',
                icon: 'heroicons_outline:document-report',
                link: '/items/kpi',
                permission: 'KPI_REPORT'
            },
            {
                title: 'IFS Integration',
                type: 'basic',
                icon: 'heroicons_outline:document-report',
                link: '/items/ifs',
                permission: 'IFS_INTEGRATION'
            }
        ];

        // Hide All items page except IMI-SRM Analyst
        if (this.currentUserRole == 'IMI-GM' ||
            this.currentUserRole == 'IMI-HSEQ' ||
            this.currentUserRole == 'IMI-Treasury Bank Approver' ||
            this.currentUserRole == 'IMI-Treasury Bank Reviewer' ||
            this.currentUserRole == 'IMI-VP') {
            this.menuData = this.menuData.filter(x => x.title != 'All');
            this.menuData = this.menuData.filter(x => x.title != 'Invite Supplier');
            this.menuData = this.menuData.filter(x => x.title != 'IFS Integration');
        }

        if (this.currentUserRole == 'IMI-Support') {
            this.menuData = this.menuData.filter(x => x.title != 'All');
            this.menuData = this.menuData.filter(x => x.title != 'Invite Supplier');
            this.menuData = this.menuData.filter(x => x.title != 'Report All');
            this.menuData = this.menuData.filter(x => x.title != 'Emergency Supplier');
            this.menuData = this.menuData.filter(x => x.title != 'KPI Report');
        }

        if (this.currentUserRole == 'IMI-SRM Analyst') {
            this.menuData = this.menuData.filter(x => x.title != 'All');
            this.menuData = this.menuData.filter(x => x.title != 'IFS Integration');
        }

        // Hide report all to HSEQ
        if (this.currentUserRole == 'IMI-HSEQ') {
            this.menuData = this.menuData.filter(x => x.title != 'Report All');
        }

        if (this.currentUserRole == 'IMI-HSEQ' ||
            this.currentUserRole == 'IMI-Treasury Bank Approver' ||
            this.currentUserRole == 'IMI-Treasury Bank Reviewer') {
            this.menuData = this.menuData.filter(x => x.title != 'Emergency Supplier');
            this.menuData = this.menuData.filter(x => x.title != 'KPI Report');
        }
    }
}
