import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardComponent } from 'app/modules/pages/dashboard/dashboard.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../../common/datatable/datatable.module';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { NormalDatatableModule } from 'app/modules/common/normal-datatable/normal-datatable.module';
import { NormalRegListModule } from 'app/modules/common/normal-reg-list/normal-reg-list.module';
import { EmergPendingListModule } from 'app/modules/common/emerg-pending-list/emerg-pending-list.module';
import { ReviewToDoListModule } from 'app/modules/common/review-to-do-list/review-to-do-list.module';
import { InviteSupplierListModule } from 'app/modules/common/invite-supplier-list/invite-supplier-list.module';
import { DashboardTagsDatatableModule } from 'app/modules/common/dashboard-tags-datatable/dashboard-tags-datatable.module';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import { UserPermissionComponent } from './user-permission.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const userPermissionRoutes: Route[] = [
    {
        path: '',
        component: UserPermissionComponent
    }
];

@NgModule({
    declarations: [
        UserPermissionComponent,
    ],
    imports: [
        RouterModule.forChild(userPermissionRoutes),
        MatExpansionModule,
        DatatableModule,
        NormalDatatableModule,
        MatIconModule,
        CommonModule,
        MatInputModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatSelectModule,
        MatButtonModule,
        MatMenuModule,
        MatCheckboxModule,
        MatCardModule,
        NormalRegListModule,
        EmergPendingListModule,
        ReviewToDoListModule,
        InviteSupplierListModule,
        DashboardTagsDatatableModule,
        TagsOverlayModule,
        MatSlideToggleModule
    ]
})
export class UserPermissionModule {
}
