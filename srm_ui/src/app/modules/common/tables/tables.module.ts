import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {DatatableModule} from '../../common/datatable/datatable.module';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatCardModule} from '@angular/material/card';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import {DrawerMiniModule} from '../../common/drawer-mini/drawer-mini.module';
import {MatDialogModule } from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { FuseAlertModule } from '@fuse/components/alert';
import { TablesComponent } from './tables.component';
import { CreateTableOverlayComponent } from './create-table-overlay/create-table-overlay.component';
import { CreateValueOverlayComponent } from './create-value-overlay/create-value-overlay.component';
const collaborationRoutes: Route[] = [
    {
        path     : '',
        component: TablesComponent
    }
];

@NgModule({
    declarations: [
        TablesComponent,
        CreateTableOverlayComponent,
        CreateValueOverlayComponent
    ],
    imports: [
        RouterModule.forChild(collaborationRoutes),
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatExpansionModule,
        DatatableModule,
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
        TagsOverlayModule,
        DrawerMiniModule,
        MatDialogModule,
        MatChipsModule,
        MatDatepickerModule,
        FuseConfirmationModule,
        MatSlideToggleModule,
        FuseAlertModule
    ]
})
export class TablesModule
{
}
