import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FileUploadModule } from 'ng2-file-upload';
import { MatListModule } from '@angular/material/list';

import { DatatableModule } from '../../../../modules/common/datatable/datatable.module';
import { DrawerMiniModule } from './../../../../modules/common/drawer-mini/drawer-mini.module';
import { TagsOverlayModule } from './../../../../modules/common/tags-overlay/tags-overlay.module';
import { SrmUserComponent } from './srm-user.component';
import { UsersListComponent } from './users-list/users-list.component';
import { UserCreateUpdateComponent } from './user-create-update/user-create-update.component';
import { SrmUserRoutingModule } from './srm-user.routing';
import { UserRoleAssignTabComponent } from './user-create-update/user-role-assign-tab/user-role-assign-tab.component';
import { UserTabComponent } from './user-create-update/user-tab/user-tab.component';


@NgModule({
  declarations: [
    SrmUserComponent,
    UsersListComponent,
    UserCreateUpdateComponent,
    UserRoleAssignTabComponent,
    UserTabComponent
  ],
  imports: [
    CommonModule,
    SrmUserRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatExpansionModule,
    DatatableModule,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatMenuModule,
    MatCardModule,
    TagsOverlayModule,
    DrawerMiniModule,
    MatDialogModule,
    MatChipsModule,
    MatDatepickerModule,
    MatTabsModule,
    MatRadioModule,
    MatDividerModule,
    MatSlideToggleModule,
    FileUploadModule,
    MatAutocompleteModule,
    MatListModule
  ],
  exports: [
    SrmUserComponent,
    UsersListComponent,
    UserCreateUpdateComponent,
    UserRoleAssignTabComponent,
    UserTabComponent
  ]
})
export class SrmUserModule { }