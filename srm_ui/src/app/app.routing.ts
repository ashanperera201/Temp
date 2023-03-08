/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'home' },

    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule) },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule) },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule) },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            { path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule) },
        ]
    },
    // {
    //     path       : '',
    //     component  : LayoutComponent,
    //     resolve    : {
    //         initialData: InitialDataResolver,
    //     },
    //     data: {
    //         layout: 'enterprise'
    //     },
    //     children   : [
    //         {path: 'profile', loadChildren: () => import('app/modules/profile/profile.module').then(m => m.ProfileModule)},
    //     ]
    // },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-in', loadChildren: () => import('app/modules/pages/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
        ]
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            layout: 'enterprise'
        },
        children: [
            { path: 'dashboard', loadChildren: () => import('../app/modules/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
            { path: 'negotiation-styles', loadChildren: () => import('app/modules/common/negotiation-styles/negotiation-styles.module').then(m => m.NegotiationStylesModule) },
            { path: 'numbering-sequence', loadChildren: () => import('app/modules/common/numbering-sequence/numbering-sequence.module').then(m => m.NumberingSequenceModule) },
            { path: 'cost-factors', loadChildren: () => import('app/modules/common/cost-factors/cost-factors.module').then(m => m.CostFactorsModule) },
            { path: 'cost-factors-list', loadChildren: () => import('app/modules/common/cost-factors-list/cost-factors-list.module').then(m => m.CostFactorsListModule) },
            { path: 'survey-template', loadChildren: () => import('app/modules/common/survey-template/survey-template.module').then(m => m.SurveyTemplateModule) },
            { path: 'survey-question', loadChildren: () => import('app/modules/common/survey-question/survey-question.module').then(m => m.SurveyQuestionModule) },
            { path: 'tables', loadChildren: () => import('app/modules/common/tables/tables.module').then(m => m.TablesModule) },
            { path: 'attribute/attribute-list/detail', loadChildren: () => import('app/modules/common/attributes-list/list-detail/list-detail.module').then(m => m.ListDetailModule) },
            { path: 'attribute-items', loadChildren: () => import('app/modules/common/attributes/attribute-items.module').then(m => m.AttributeItemsModule) },
            { path: 'attribute-list', loadChildren: () => import('app/modules/common/attributes-list/attribute-list.module').then(m => m.AttributeListModule) },
            { path: 'colteams', loadChildren: () => import('app/modules/common/collaboration-teams/collaboration-teams.module').then(m => m.CollaborationTeamsModule) },
            { path: 'currency', loadChildren: () => import('app/modules/common/currency/currency.module').then(m => m.CurrencyModule) },
            { path: 'cost-factors-list-detail', loadChildren: () => import('app/modules/common/cost-factors-list/list-detail/list-detail.module').then(m => m.ListDetailModule) },
            { path: 'tables-table-detail', loadChildren: () => import('app/modules/common/tables/table-detail/table-detail.module').then(m => m.TableDetailModule) },
            { path: 'survey-template-list-detail', loadChildren: () => import('app/modules/common/survey-template/list-detail/list-detail.module').then(m => m.ListDetailModule) },
            { path: 'supplier-invitation-list', loadChildren: () => import('app/modules/common/supplier-invitation-list/supplier-invitation-list.module').then(m => m.SupplierInvitationListModule) },
            { path: 'supplier-invitation-list-detail', loadChildren: () => import('app/modules/common/supplier-invitation-list/sup-list-detail/sup-list-detail.module').then(m => m.SupListDetailModule) },
            { path: 'terms', loadChildren: () => import('app/modules/common/terms/terms.module').then(m => m.TermsModule) },
            { path: 'rfx', loadChildren: () => import('app/modules/common/rfx/rfx.module').then(m => m.RfxModule) },
            { path: 'rfx-new', loadChildren: () => import('app/modules/common/rfx/rfx-new/rfx-new.module').then(m => m.RfxNewModule) },
            { path: 'rfx-new-from-template', loadChildren: () => import('app/modules/common/rfx/rfx-new-from-template/rfx-new-from-template.module').then(m => m.RfxNewFromTemplateModule) },
            { path: 'rfx-new-from-existing', loadChildren: () => import('app/modules/common/rfx/rfx-new-from-existing/rfx-new-from-existing.module').then(m => m.RfxNewFromExistingModule) },
            { path: 'rfq', loadChildren: () => import('app/modules/common/rfq/rfq.module').then(m => m.RfqModule) },
            { path: 'rfq/:id', loadChildren: () => import('app/modules/common/rfq/rfq.module').then(m => m.RfqModule) },
            { path: 'rfaq', loadChildren: () => import('app/modules/common/rfaq/rfaq.module').then(m => m.RfaqModule) },
            { path: 'items', loadChildren: () => import('app/modules/pages/items/items-all/items.module').then(m => m.ItemsModule) },
            { path: 'items/inner', loadChildren: () => import('app/modules/pages/items/items-inner/items-inner.module').then(m => m.ItemsInnerModule) },
            { path: 'items/emergency-supplier', loadChildren: () => import('app/modules/pages/items/items-emergency-supplier/items-emergency-supplier.module').then(m => m.ItemsEmergencySupplierModule) },
            { path: 'items/workflow', loadChildren: () => import('app/modules/pages/items/items-workflow/items-workflow.module').then(m => m.ItemsWorkflowModule) },
            { path: 'items/invite-supplier', loadChildren: () => import('app/modules/pages/items/items-invite-supplier/items-invite-supplier.module').then(m => m.ItemsInviteSupplierModule) },
            { path: 'items/task', loadChildren: () => import('app/modules/pages/items/items-task/items-task.module').then(m => m.ItemsTaskModule) },
            { path: 'items/tags', loadChildren: () => import('app/modules/pages/items/items-tags/items-tags.module').then(m => m.ItemsTagsModule) },
            { path: 'items/kpi', loadChildren: () => import('app/modules/pages/items/items-kpi/items-kpi.module').then(m => m.ItemsKpiModule) },
            { path: 'items/emergency-supplier/:page/:id', loadChildren: () => import('app/modules/pages/items/items-emergency-supplier-inner/items-emergency-supplier-inner.module').then(m => m.ItemsEmergencySupplierInnerModule) },
            { path: 'items/new-emergency-supplier', loadChildren: () => import('app/modules/pages/items/items-emergency-supplier-new/items-emergency-supplier-new.module').then(m => m.ItemsEmergencySupplierNewModule) },
            { path: 'items/invite-supplier/:page/:id', loadChildren: () => import('app/modules/pages/items/items-invite-supplier-inner/items-invite-supplier-inner.module').then(m => m.ItemsInviteSupplierInnerModule) },
            { path: 'items/new-invite-supplier', loadChildren: () => import('app/modules/pages/items/items-invite-supplier-new/items-invite-supplier-new.module').then(m => m.ItemsInviteSupplierNewModule) },

            { path: 'items/new-supplier-invite', loadChildren: () => import(`./modules/pages/items/items-supplier-invite-v2/items-supplier-invite-v2.module`).then(m => m.ItemsSupplierV2Module) },

            { path: 'items/task/inner', loadChildren: () => import('app/modules/pages/items/items-task-inner/items-task-inner.module').then(m => m.ItemsTaskInnerModule) },
            { path: 'items/workflow/inner/:code', loadChildren: () => import('app/modules/pages/items/items-workflow-inner/items-workflow-inner.module').then(m => m.ItemsWorkflowInnerModule) },
            { path: 'dashboard/inner/:page/:id', loadChildren: () => import('app/modules/pages/dashboard-inner/dashboard-inner.module').then(m => m.DashboardInnerModule) },
            { path: 'admin-user', loadChildren: () => import('app/modules/pages/admin-user/admin-user.module').then(m => m.AdminUserModule) },
            { path: 'profile', loadChildren: () => import('app/modules/pages/profile/profile.module').then(m => m.ProfileModule) },
            { path: 'items/reportall', loadChildren: () => import('app/modules/pages/items/items-reportall/items-reportall.module').then(m => m.ItemsReportallModule) },
            { path: 'items/reportaudit', loadChildren: () => import('app/modules/pages/items/items-reportaudit/items-reportaudit.module').then(m => m.ItemsReportauditModule) },
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
            { path: 'default', loadChildren: () => import('app/modules/pages/setup/default/default.module').then(m => m.DefaultModule) },
            { path: 'notifications', loadChildren: () => import('app/modules/pages/setup/notifications/notifications.module').then(m => m.NotificationsModule) },
            { path: 'notifications-config', loadChildren: () => import('app/modules/pages/setup/notifications/notification-config-dialog/notification-config-dialog.module').then(m => m.NotificationConfigModule) },
            { path: 'user-groups', loadChildren: () => import('app/modules/common/user-groups/user-groups.module').then(m => m.UserGroupsModule) },
            { path: 'user-permission', loadChildren: () => import('app/modules/pages/user-permission/user-permission.module').then(m => m.UserPermissionModule) },
            { path: 'access-management', loadChildren: () => import(`./modules/pages/access-management/access-management.module`).then(m => m.AccessManagementModule) },
            { path: 'user-permission-details', loadChildren: () => import('app/modules/pages/user-permission/user-permission-details/user-permission-details.module').then(m => m.UserPermissionDetailsModule) },
            { path: 'items/reportall', loadChildren: () => import('app/modules/pages/items/items-reportall/items-reportall.module').then(m => m.ItemsReportallModule) },
            { path: 'items/reportaudit', loadChildren: () => import('app/modules/pages/items/items-reportaudit/items-reportaudit.module').then(m => m.ItemsReportauditModule) },
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
            { path: 'form-builder', loadChildren: () => import('app/modules/pages/form-builder/form-landing.module').then(m => m.FormLandingModule) },
            { path: 'approval-changes-landing', loadChildren: () => import('app/modules/pages/approval-changes-landing/approval-changes-landing.module').then(m => m.ApprovalChangesLandingModule) },
            { path: 'approvals-page/:id', loadChildren: () => import('app/modules/pages/approvals-page/approvals-page.module').then(m => m.ApprovalsPageModule) },
            { path: 'supplier-reviews', loadChildren: () => import('app/modules/pages/supplier-reviews/supplier-reviews.module').then(m => m.SupplierReviewsModule) },
            { path: 'review-response-page/:id', loadChildren: () => import('app/modules/pages/supplier-reviews/review-response-page/review-response-page.module').then(m => m.ReviewResponsePageModule) },
            { path: 'review-response-summary', loadChildren: () => import('app/modules/pages/supplier-reviews/review-response-summary/review-response-summary.module').then(m => m.ReviewResponseSummaryModule) },
            { path: 'review-summary-charts', loadChildren: () => import('app/modules/pages/supplier-reviews/review-summary-charts/review-summary-charts.module').then(m => m.ReviewSummaryChartsModule) },
            { path: 'suppliers-list', loadChildren: () => import('app/modules/pages/suppliers-list/suppliers-list.module').then(m => m.SupplierListModule) },
            //{ path: 'form-new', loadChildren: () => import('app/modules/pages/form-builder/form-new/form-new.module').then(m => m.FormNewModule) },
            { path: 'internal-user-creation', loadChildren: () => import('app/modules/pages/setup/internal-user-creation-n-role-assignment/internal-user-creation-n-role-assignment.module').then(m => m.InternalUserModule) },
            { path: 'user-records', loadChildren: () => import('app/modules/pages/setup/internal-user-creation-n-role-assignment/user-records/user-records.module').then(m => m.InternalUserRecordModule) },
            { path: 'po-info/:id', loadChildren: () => import('app/modules/pages/po-info/po-info.module').then(m => m.PoInfoModule) },
            { path: 'password-policy', loadChildren: () => import('app/modules/common/password-policy/password-policy.module').then(m => m.PasswordPolicyModule) },
            { path: 'performance-evaluation', loadChildren: () => import('app/modules/pages/performance-evaluation/performance-evaluation.module').then(m => m.PerformanceEvaluationModule) },
            { path: 'block_suppliers1', loadChildren: () => import('app/modules/pages/block_suppliers1/block_suppliers1.module').then(m => m.block_suppliers1Module) },
            { path: 'summery-review', loadChildren: () => import('app/modules/pages/supplier-reviews/summery-review/summery-review.module').then(m => m.SummeryReviewModule) },
            { path: 'rfx-templates', loadChildren: () => import('app/modules/common/rfx-templates/rfx-templates.module').then(m => m.RfxTemplatesModule) },
            { path: 'export-report/:id', loadChildren: () => import('app/modules/common/export-report/export-report.module').then(m => m.ExportReportModule) },
            { path: 'process-configurator', loadChildren: () => import('app/modules/pages/process-configurator/process-configurator.module').then(m => m.ProcessConfiguratorModule) },
            { path: 'email-templates', loadChildren: () => import('app/modules/pages/email-template/email-template.module').then(m => m.EmailTemplateModule) },

        ]
    },
    {
        path: '',
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'supplier-registration-form', loadChildren: () => import('app/modules/pages/supplier-registration-form/supplier-registration-form.module').then(m => m.SupplierRegistrationFormModule) },

            {
                path: 'supplier-registration-form/:id',
                loadChildren: () => import('app/modules/pages/supplier-registration-form/supplier-registration-form.module').then(m => m.SupplierRegistrationFormModule)
            },

            {
                path: 'supplier-registration-form/:id/:cat',
                loadChildren: () => import('app/modules/pages/supplier-registration-form/supplier-registration-form.module').then(m => m.SupplierRegistrationFormModule)
            },
            { path: 'supplier-onboard', loadChildren: () => import('./modules/pages/supplier-onboard/supplier-onboard.module').then(m => m.SupplierOnboardModule) },

        ]
    }
];
