import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ItemsKpiComponent } from './items-kpi.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {DatatableModule} from '../../../common/datatable/datatable.module';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {FuseDrawerModule} from '@fuse/components/drawer';
import {FuseNavigationModule} from '@fuse/components/navigation';
import {FuseScrollbarModule} from '@fuse/directives/scrollbar';
import {DrawerMiniModule} from '../../../common/drawer-mini/drawer-mini.module';
import {MatChipsModule} from "@angular/material/chips";
import { ItemTagsDatatableModule } from 'app/modules/common/item-tags-datatable/item-tags-datatable.module';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';

const itemsKpiRoutes: Route[] = [
    {
        path     : '',
        component: ItemsKpiComponent,
    }
];

@NgModule({
    declarations: [
        ItemsKpiComponent,
    ],
    imports: [
        RouterModule.forChild(itemsKpiRoutes),
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
        MatChipsModule,
        ItemTagsDatatableModule,
        FormsModule,
        MatDatepickerModule,

    ]
})
export class ItemsKpiModule
{
}
