import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

import { PermissionCreateUpdateComponent } from './permission-visibility-create-update/permission-visibility-create-update.component';
import { VisibilityConfigComponent } from './permission-visibility-create-update/visibility-config/visibility-config.component';
import { PermissionsComponent } from './permission-visibility-create-update/permissions/permissions.component';

@NgModule({
  declarations: [
    PermissionCreateUpdateComponent,
    VisibilityConfigComponent,
    PermissionsComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatCardModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  exports: [
    PermissionCreateUpdateComponent,
    VisibilityConfigComponent,
    PermissionsComponent
  ]
})

export class PermissionModule { }
