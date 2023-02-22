import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import {ItemsInviteSupplierInnerComponent} from './items-invite-supplier-inner.component';
import {FuseDrawerModule} from '@fuse/components/drawer';
import {FuseNavigationModule} from '@fuse/components/navigation';
import {FuseScrollbarModule} from '@fuse/directives/scrollbar';
import {DatatableModule} from '../../../common/datatable/datatable.module';
import {DrawerMiniModule} from '../../../common/drawer-mini/drawer-mini.module';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatFormFieldModule} from '@angular/material/form-field';
import {SharedModule} from '../../../../shared/shared.module';
import {MatOptionModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDialogModule} from '@angular/material/dialog';
import {ClipboardModule} from '@angular/cdk/clipboard';

const itemsInviteSupplierInnerRoutes: Route[] = [
    {
        path     : '',
        component: ItemsInviteSupplierInnerComponent
    },
];

@NgModule({
    declarations: [
        ItemsInviteSupplierInnerComponent,
    ],
    imports: [
        RouterModule.forChild(itemsInviteSupplierInnerRoutes),
        MatExpansionModule,
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
        DatatableModule,
        DrawerMiniModule,
        MatTabsModule,
        MatRadioModule,
        MatFormFieldModule,
        SharedModule,
        MatOptionModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatDialogModule,
        ClipboardModule
    ]
})
export class ItemsInviteSupplierInnerModule{
}