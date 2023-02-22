import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {DatatableModule} from '../../common/datatable/datatable.module';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import {DrawerMiniModule} from '../../common/drawer-mini/drawer-mini.module';
// import {FormLandingComponent} from './form-landing.component';
import {MatDialogModule } from '@angular/material/dialog';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
//import {PreviewFormOverlayComponent} from './preview-form-overlay/preview-form-overlay.component';
import { SupplierListComponent } from './suppliers-list.component';

const formRoutes: Route[] = [
    {
        path     : '',
        component: SupplierListComponent
    }
];

@NgModule({
    declarations: [
        SupplierListComponent,
       // PreviewFormOverlayComponent,
    ],
    imports: [
        RouterModule.forChild(formRoutes),
        MatNativeDateModule,
        ReactiveFormsModule,
        MatExpansionModule,
        DatatableModule,
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
        TagsOverlayModule,
        DrawerMiniModule,
        MatDialogModule,
        MatChipsModule,
        MatDatepickerModule,
        MatTabsModule,
        MatRadioModule,
        MatDividerModule,
        MatSlideToggleModule,
    ]
})
export class SupplierListModule
{
}
