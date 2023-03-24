import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ItemsReportallComponent } from './items-reportall.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../../../common/datatable/datatable.module';
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
import { ItemDatatableModule } from 'app/modules/common/item-datatable/item-datatable.module';
import { ItemReportAllDatatableModule } from 'app/modules/common/item-reportall-datatable/item-reportall-datatable.module';
import { NgxPermissionsModule } from 'ngx-permissions'

const itemsReportallRoutes: Route[] = [
    {
        path: '',
        component: ItemsReportallComponent,
    }
];

@NgModule({
    declarations: [
        ItemsReportallComponent,
    ],
    imports: [
        RouterModule.forChild(itemsReportallRoutes),
        MatExpansionModule,
        DatatableModule,
        ItemDatatableModule,
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
        ItemReportAllDatatableModule,
        NgxPermissionsModule,
    ]
})
export class ItemsReportallModule {
}
