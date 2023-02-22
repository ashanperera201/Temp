import { NgModule } from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { NormalDatatableComponent } from './normal-datatable.component';
import { FormsModule } from '@angular/forms';
import {NgxPermissionsModule} from 'ngx-permissions';


@NgModule({
    declarations: [
        NormalDatatableComponent
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
        NgxPermissionsModule.forChild(),
    ],
    exports: [
        NormalDatatableComponent
    ],
})
export class NormalDatatableModule
{
}
