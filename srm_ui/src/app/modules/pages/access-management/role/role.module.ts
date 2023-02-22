import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RoleRoutingModule } from './role.routing';
import { RoleComponent } from './role.component';
import { RoleCreateUpdateComponent } from './role-create-update/role-create-update.component';
import { RoleConfirmationComponent } from './role-confirmation/role-confirmation.component';
import { PermissionModule } from '../permission/permission.module';

@NgModule({
  declarations: [
    RoleComponent,
    RoleCreateUpdateComponent,
    RoleConfirmationComponent
  ],
  imports: [
    CommonModule,
    RoleRoutingModule,
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
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    PermissionModule,
  ],
  exports: [
    RoleComponent,
    RoleCreateUpdateComponent
  ]
})
export class RoleModule { }
