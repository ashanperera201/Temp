import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

import { EmailTemplateComponent } from './email-template.component';
import { EmailTemplateFormComponent } from './email-template-form/email-template-form.component';
import { EmailTemplateRoutingModule } from './email-template.routing';
import { EmailTemplatesComponent } from './email-templates/email-templates.component';

@NgModule({
  declarations: [
    EmailTemplateComponent,
    EmailTemplateFormComponent,
    EmailTemplatesComponent,
  ],
  imports: [
    CommonModule,
    EmailTemplateRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatSortModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatDividerModule,
    MatPaginatorModule,
  ],
  exports: [
    EmailTemplateComponent,
    EmailTemplateFormComponent
  ]
})
export class EmailTemplateModule { }
