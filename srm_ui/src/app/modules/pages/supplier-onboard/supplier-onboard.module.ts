import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';

import { NgxSurveyModule } from '../form-builder/ngx-survey';
import { SupplierOnboardRoutingModule } from './supplier-onboard.routing';
import { SupplierOnboardComponent } from './supplier-onboard.component';

@NgModule({
  declarations: [
    SupplierOnboardComponent,
  ],
  imports: [
    CommonModule,
    SupplierOnboardRoutingModule,
    MatTabsModule,
    NgxSurveyModule,
    MatButtonModule,
  ],
  exports: [
    SupplierOnboardComponent,
  ]
})
export class SupplierOnboardModule { }
