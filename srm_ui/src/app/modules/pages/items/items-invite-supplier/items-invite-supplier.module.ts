import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ItemsInviteSupplierComponent } from './items-invite-supplier.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../../../common/datatable/datatable.module';
import { ItemsInviteSupplierListModule } from 'app/modules/common/items-invite-supplier-list/items-invite-supplier-list.module';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { FuseNavigationModule } from '@fuse/components/navigation';
import { FuseScrollbarModule } from '@fuse/directives/scrollbar';
import { DrawerMiniModule } from '../../../common/drawer-mini/drawer-mini.module';

const itemsInviteSupplierRoutes: Route[] = [
    {
        path: '',
        component: ItemsInviteSupplierComponent,
    }
];

@NgModule({
    declarations: [
        ItemsInviteSupplierComponent,
    ],
    imports: [
        RouterModule.forChild(itemsInviteSupplierRoutes),
        MatExpansionModule,
        DatatableModule,
        DrawerMiniModule,
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
        FuseDrawerModule,
        FuseNavigationModule,
        FuseScrollbarModule,
        ItemsInviteSupplierListModule
    ]
})
export class ItemsInviteSupplierModule {
}