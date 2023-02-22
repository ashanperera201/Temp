import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationLoaderComponent } from './application-loader/application-loader.component';

import { MatDialogModule } from '@angular/material/dialog'
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

@NgModule({
    declarations: [
        ApplicationLoaderComponent
    ],
    imports: [
        CommonModule,
        MatDialogModule
    ],
    exports: [
        ApplicationLoaderComponent
    ],
    providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 3000 } }
    ]
})
export class ComponentsModule { }
