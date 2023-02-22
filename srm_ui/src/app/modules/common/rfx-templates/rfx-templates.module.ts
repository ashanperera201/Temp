import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../datatable/datatable.module';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import { DrawerMiniModule } from '../drawer-mini/drawer-mini.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from "@angular/material/chips";
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RfxTemplatesComponent } from './rfx-templates.component';

const collaborationRoutes: Route[] = [
    {
        path: '',
        component: RfxTemplatesComponent
    }
];

@NgModule({
    declarations: [
        RfxTemplatesComponent,
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
    ]
})
export class RfxTemplatesModule {
}
