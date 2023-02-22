import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { DatatableModule } from '../../common/datatable/datatable.module';
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
// import { ChatsComponent } from '../../common/chats/chats.component';
import { DrawerMiniModule } from '../../common/drawer-mini/drawer-mini.module';
import { RfaqComponent } from './rfaq.component';
import { MatDialogModule } from '@angular/material/dialog';
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
import { ChatsModule } from '../../common/chats/chats.module';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { Terms1Component } from 'app/modules/common/terms1/terms1.component';
import { AddEditShippingOverlayComponent } from './add-edit-shipping-overlay/add-edit-shipping-overlay.component';
import { AddEditLineShippingOverlayComponent } from './add-edit-line-shipping-overlay/add-edit-line-shipping-overlay.component';
import { CopyToLinesOverlayComponent } from './copy-to-lines-overlay/copy-to-lines-overlay.component';

const rfaqRoutes: Route[] = [
    {
        path: '',
        component: RfaqComponent
    }
];

@NgModule({
    declarations: [
        RfaqComponent,
        Terms1Component,
        AddEditShippingOverlayComponent,
        // ChatsComponent,
        AddEditLineShippingOverlayComponent,
        CopyToLinesOverlayComponent
    ],
    imports: [
        RouterModule.forChild(rfaqRoutes),
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
        ChatsModule,
        FuseAlertModule,
        FuseConfirmationModule,
    ]
})
export class RfaqModule {
}
