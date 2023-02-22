import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { ExportReportComponent } from './export-report.component';
import { Route, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatatableModule } from '../datatable/datatable.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DrawerMiniModule } from '../drawer-mini/drawer-mini.module';
import { TagsOverlayModule } from '../tags-overlay/tags-overlay.module';
import { ItemTablesComponent } from './item-tables/item-tables.component';
import { ResponcesComponent } from './responces/responces.component';
import { SelectionTablesComponent } from './selection-tables/selection-tables.component';
import { EvaluationTablesComponent } from './evaluation-tables/evaluation-tables.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChartsComponent } from './charts/charts.component';

const ExportReportRoutes: Route[] = [
    {
        path: '',
        component: ExportReportComponent,
    },
];


@NgModule({
    declarations: [
        ExportReportComponent,
        ItemTablesComponent,
        ResponcesComponent,
        SelectionTablesComponent,
        EvaluationTablesComponent,
        ChartsComponent
    ],
    imports: [
        RouterModule.forChild(ExportReportRoutes),
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
        MatTabsModule,
        MatDatepickerModule,
        MatNativeDateModule,
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
        NgApexchartsModule,
        MatSnackBarModule
    ],
    exports: [
        ExportReportComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExportReportModule {
}