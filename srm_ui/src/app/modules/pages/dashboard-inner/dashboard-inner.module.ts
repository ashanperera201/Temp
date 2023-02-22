import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { DashboardInnerComponent } from './dashboard-inner.component';
import {MatExpansionModule} from '@angular/material/expansion';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {SharedModule} from '../../../shared/shared.module';
import {MatButtonModule} from '@angular/material/button';
import {MatNativeDateModule, MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatTabsModule} from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DatatableModule} from '../../common/datatable/datatable.module';
import { MatDialogModule } from '@angular/material/dialog';
import {OverlayComponent} from '../../common/overlay/overlay.component';
import { MatTableModule } from '@angular/material/table';
import { NormalHistoryModule } from 'app/modules/common/normal-history/normal-history.module';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { WorkflowSummaryModule } from 'app/modules/common/workflow-summary/WorkflowSummary.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SearchModule } from 'app/layout/common/search/search.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { DrawerMiniModule } from 'app/modules/common/drawer-mini/drawer-mini.module';
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SupplierPerformanceComponent } from '../supplier-performance/supplier-performance.component';

const dashboardInnerRoutes: Route[] = [
    {
        path     : '',
        component: DashboardInnerComponent
    }
];

@NgModule({
    declarations: [
        DashboardInnerComponent,
        OverlayComponent,
        SupplierPerformanceComponent
    ],
    imports: [
        RouterModule.forChild(dashboardInnerRoutes),
        MatExpansionModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        SharedModule,
        MatButtonModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatTabsModule,
        MatDatepickerModule,
        MatMomentDateModule,
        MatTableModule,
        DatatableModule,
        MatDialogModule,
        NormalHistoryModule,
        NgbModule,
        WorkflowSummaryModule,
        FormsModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatSortModule,
        MatPaginatorModule,
        MatMenuModule,
        MatCardModule,
        TagsOverlayModule,
        DrawerMiniModule,
        MatChipsModule,
        MatDividerModule,
        MatStepperModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SearchModule,
        MatAutocompleteModule,
        NgApexchartsModule
    ]
})
export class DashboardInnerModule
{
    toppings: FormGroup;
    constructor(fb: FormBuilder) {
        this.toppings = fb.group({
            pepperoni: false,
            extracheese: false,
            mushroom: false
        });
    }
}
