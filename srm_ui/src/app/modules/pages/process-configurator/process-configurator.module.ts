import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ProcessConfiguratorComponent } from '../process-configurator/process-configurator.component';
import { ProcessRoutingModule } from './process-configurator.routing';
import { ProcessConfiguratorLandingComponent } from './process-configurator-landing/process-configurator-landing.component';
import { ProcessConfiguratorCreateComponent } from './process-configurator-create/process-configurator-create.component';


@NgModule({
    declarations: [
        ProcessConfiguratorComponent,
        ProcessConfiguratorLandingComponent,
        ProcessConfiguratorCreateComponent
    ],
    imports: [
        CommonModule,
        ProcessRoutingModule,
        MatTableModule,
        MatInputModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        MatSortModule,
        MatButtonModule,
        MatDialogModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDividerModule,
        MatPaginatorModule,

    ]
})
export class ProcessConfiguratorModule { }
