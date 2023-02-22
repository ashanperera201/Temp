import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
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
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import { DrawerMiniModule } from '../../common/drawer-mini/drawer-mini.module';
import { CostFactorsComponent } from './cost-factors.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseConfirmationModule } from '@fuse/services/confirmation';

const collaborationRoutes: Route[] = [
    {
        path: '',
        component: CostFactorsComponent
    }
];

@NgModule({
    declarations: [
        CostFactorsComponent,
        AddEditOverlayComponent,
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
        FuseAlertModule,
        FuseConfirmationModule
    ]
})

export class CostFactorsModule {
}