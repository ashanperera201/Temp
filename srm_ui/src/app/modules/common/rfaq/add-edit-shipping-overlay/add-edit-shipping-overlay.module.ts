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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditShippingOverlayComponent } from './add-edit-shipping-overlay.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from "@angular/material/radio";


@NgModule({
    declarations: [
        //AddEditShippingOverlayComponent
    ],
    imports: [
        MatExpansionModule,
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
        FormsModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatRadioModule
    ],
    exports: [
        //AddEditShippingOverlayComponent
    ],
})
export class AddEditShippingOverlayModule {
}
