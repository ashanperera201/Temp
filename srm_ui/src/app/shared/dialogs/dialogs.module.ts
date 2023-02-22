import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ReviewFormConfigurationComponent } from './review-form-configuration/review-form-configuration.component';
import { DynamicTabsComponent } from './review-form-configuration/dynamic-tabs/dynamic-tabs.component';

@NgModule({
  declarations: [
    ReviewFormConfigurationComponent,
    DynamicTabsComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatAutocompleteModule,

    
  ],
  exports: [
    ReviewFormConfigurationComponent,
    DynamicTabsComponent
  ]
})
export class DialogsModule { }
