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
import {MatCardModule} from '@angular/material/card';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import {DrawerMiniModule} from '../../common/drawer-mini/drawer-mini.module';
import {RfxComponent} from './rfx.component';
import {MatDialogModule } from '@angular/material/dialog';
import {MatChipsModule} from "@angular/material/chips";
import {MatTabsModule} from '@angular/material/tabs';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxPermissionsModule} from 'ngx-permissions'

const collaborationRoutes: Route[] = [
    {
        path     : '',
        component: RfxComponent
    }
];

@NgModule({
    declarations: [
        RfxComponent,
    ],
    imports: [
        RouterModule.forChild(collaborationRoutes),
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
        MatTabsModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPermissionsModule
    ]
})
export class RfxModule
{
}
