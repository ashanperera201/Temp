import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
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
import { TagsOverlayModule } from 'app/modules/common/tags-overlay/tags-overlay.module';
import { MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgApexchartsModule } from "ng-apexcharts";
import { SuppliersViewComponent } from 'app/modules/common/rfq/suppliers-view/suppliers-view.component';
import { DatatableModule } from 'app/modules/common/datatable/datatable.module';
import { DrawerMiniModule } from 'app/modules/common/drawer-mini/drawer-mini.module';
import { SearchModule } from 'app/layout/common/search/search.module';
import { SupplierReviewsComponent } from './supplier-reviews.component';
import { ReviewResponsesComponent } from './review-responses/review-responses.component';
import { ReviewInitiationOverlayComponent } from './review-initiation-overlay/review-initiation-overlay.component';
import { ReviewInitiationSummaryOverlayComponent } from './review-initiation-summary-overlay/review-initiation-summary-overlay.component';
import { ReviewOutcomesComponent } from './review-outcomes/review-outcomes.component';
import { ReviewScheduleOverlayComponent } from './review-schedule-overlay/review-schedule-overlay.component';
import { ReviewScheduleSummaryOverlayComponent } from './review-schedule-summary-overlay/review-schedule-summary-overlay.component';
import { MatListModule } from '@angular/material/list';
import { ReviewReinitiationOverlayComponent } from './review-reinitiation-overlay/review-reinitiation-overlay.component';
import { ReviewApprovalOverlayComponent } from './review-approval-overlay/review-approval-overlay.component';
import { ReviewRejectionOverlayComponent } from './review-rejection-overlay/review-rejection-overlay.component';
import { TableComponent } from './table/table.component';
import { ReviewTodosComponent } from './review-todos/review-todos.component';
import { ReviewSummaryChartsComponent } from './review-summary-charts/review-summary-charts.component';
import { BlockSupplierOverlayComponent } from './block-supplier-overlay/block-supplier-overlay.component';
import { ApprovalHistoryOverlayComponent } from './approval-history-overlay/approval-history-overlay.component';
import { NgxPermissionsModule } from 'ngx-permissions'

const suppliersRoutes: Route[] = [
    {
        path: '',
        component: SupplierReviewsComponent
    }
];


@NgModule({
    declarations: [
        ReviewInitiationOverlayComponent,
        ReviewInitiationSummaryOverlayComponent,
        ReviewScheduleOverlayComponent,
        ReviewScheduleSummaryOverlayComponent,
        SupplierReviewsComponent,
        ReviewResponsesComponent,
        ReviewOutcomesComponent,
        ReviewTodosComponent,
        ReviewReinitiationOverlayComponent,
        ReviewApprovalOverlayComponent,
        ReviewRejectionOverlayComponent,
        TableComponent,
        BlockSupplierOverlayComponent,
        ApprovalHistoryOverlayComponent

    ],
    imports: [
        RouterModule.forChild(suppliersRoutes),
        FormsModule,
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
        MatStepperModule,
        MatSlideToggleModule,
        MatTooltipModule,
        SearchModule,
        MatAutocompleteModule,
        NgApexchartsModule,
        MatListModule,
        NgxPermissionsModule
    ]
})
export class SupplierReviewsModule {
}
