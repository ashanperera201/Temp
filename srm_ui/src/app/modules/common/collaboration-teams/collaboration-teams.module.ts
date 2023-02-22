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
import { CollaborationTeamsComponent } from './collaboration-teams.component';
import { AddEditOverlayComponent } from './add-edit-overlay/add-edit-overlay.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddTeamOverlayComponent } from './add-team-overlay-basicdata/add-team-overlay.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
//import { AssignUserOverlayComponent } from './assign-user-overlay/assign-user-overlay.component';

const collaborationRoutes: Route[] = [
    {
        path: '',
        component: CollaborationTeamsComponent
    }
];

@NgModule({
    declarations: [
        CollaborationTeamsComponent,
        AddEditOverlayComponent,
        AddTeamOverlayComponent
    ],
    imports: [
        RouterModule.forChild(collaborationRoutes),
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
        FormsModule,
        MatDialogModule,
        MatTabsModule,
        MatRadioModule,
        MatChipsModule
    ]
})

export class CollaborationTeamsModule {

}